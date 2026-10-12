import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Variable, DataRow, CellSelectionInfo, FilterCondition, SortCondition, EditorSaveStatus } from '../types/dataEditorTypes';
import { DataEditorService } from '../services/dataEditorService';
import { DataEditorHeader } from '../components/DataEditorHeader';
import { DataEditorToolbar } from '../components/DataEditorToolbar';
import { FormulaBar } from '../components/FormulaBar';
import { DataGridView } from '../components/DataGridView';
import { VariableGridView } from '../components/VariableGridView';
import { StatusBar } from '../components/StatusBar';
import { FindReplaceModal } from '../components/FindReplaceModal';
import { KeyboardShortcutsModal } from '../components/KeyboardShortcutsModal';
import { Info, X } from 'lucide-react';
import { DatasetService } from '../../datasets/services/datasetService';

export const DataEditorPage: React.FC = () => {
  const { projectId, datasetId } = useParams<{ projectId: string; datasetId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Active view tab state (Data View vs Variable View)
  const [activeView, setActiveView] = useState<'data' | 'variable'>(
    location.pathname.endsWith('/variables') ? 'variable' : 'data'
  );

  useEffect(() => {
    if (location.pathname.endsWith('/variables')) {
      setActiveView('variable');
    } else {
      setActiveView('data');
    }
  }, [location.pathname]);

  // Data states
  const [datasetName, setDatasetName] = useState<string>('clinical_trial_patients.csv');
  const [variables, setVariables] = useState<Variable[]>([]);
  const [rows, setRows] = useState<DataRow[]>([]);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter & Sort
  const [activeFilter, setActiveFilter] = useState<FilterCondition | undefined>();
  const [activeSort, setActiveSort] = useState<SortCondition | undefined>();

  // Selection & Formula Bar
  const [activeCellSelection, setActiveCellSelection] = useState<CellSelectionInfo | null>(null);
  const [formulaValue, setFormulaValue] = useState<string>('');
  const [showValueLabels, setShowValueLabels] = useState<boolean>(true);

  // History stack for Undo / Redo
  const [history, setHistory] = useState<Array<{ undo: () => void; redo: () => void }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Save Status
  const [saveStatus, setSaveStatus] = useState<EditorSaveStatus>({ state: 'saved' });

  // Modal visibility flags
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isDatasetInfoOpen, setIsDatasetInfoOpen] = useState(false);

  // Load Data
  const loadEditorData = useCallback(async () => {
    setLoading(true);
    try {
      if (datasetId && projectId) {
        const ds = await DatasetService.getDataset(projectId, datasetId);
        if (ds) setDatasetName(ds.name);
      }
      const vars = await DataEditorService.getVariables(datasetId);
      setVariables(vars);

      const { rows: fetchedRows, totalCount } = await DataEditorService.getRows(
        datasetId,
        0,
        500,
        activeFilter,
        activeSort
      );
      setRows(fetchedRows);
      setTotalRowCount(totalCount);
    } catch (err) {
      console.error('Failed to load data editor contents:', err);
    } finally {
      setLoading(false);
    }
  }, [datasetId, projectId, activeFilter, activeSort]);

  useEffect(() => {
    loadEditorData();
  }, [loadEditorData]);

  // Sync view change with route or internal state
  const handleViewChange = (view: 'data' | 'variable') => {
    setActiveView(view);
    if (datasetId && projectId) {
      if (view === 'variable') {
        navigate(`/projects/${projectId}/datasets/${datasetId}/data/variables`, { replace: true });
      } else {
        navigate(`/projects/${projectId}/datasets/${datasetId}/data/view`, { replace: true });
      }
    }
  };

  // Push to Undo history
  const pushHistory = (undoFn: () => void, redoFn: () => void) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ undo: undoFn, redo: redoFn });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSaveStatus({ state: 'unsaved' });
  };

  const handleUndo = () => {
    if (historyIndex >= 0) {
      history[historyIndex].undo();
      setHistoryIndex(historyIndex - 1);
      setSaveStatus({ state: 'unsaved' });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      history[historyIndex + 1].redo();
      setHistoryIndex(historyIndex + 1);
      setSaveStatus({ state: 'unsaved' });
    }
  };

  // Cell edit completion
  const handleCellEdit = async (rowId: string, colId: string, newValue: any) => {
    const targetRow = rows.find((r) => r._rowId === rowId);
    if (!targetRow) return;

    const oldValue = targetRow[colId];
    if (oldValue === newValue) return;

    await DataEditorService.updateCell(datasetId || 'ds-001', rowId, colId, newValue);

    const applyEdit = (val: any) => {
      setRows((prev) =>
        prev.map((r) => (r._rowId === rowId ? { ...r, [colId]: val } : r))
      );
    };

    applyEdit(newValue);

    pushHistory(
      () => applyEdit(oldValue),
      () => applyEdit(newValue)
    );
  };

  // Selection change
  const handleSelectionChange = (sel: CellSelectionInfo | null) => {
    setActiveCellSelection(sel);
    if (sel && sel.colId && sel.rowIndex !== undefined) {
      const row = rows[sel.rowIndex];
      if (row) {
        const val = row[sel.colId];
        setFormulaValue(val !== null && val !== undefined ? String(val) : '');
      }
    }
  };

  // Formula bar commit
  const handleFormulaCommit = () => {
    if (activeCellSelection && activeCellSelection.colId && activeCellSelection.rowIndex !== undefined) {
      const row = rows[activeCellSelection.rowIndex];
      if (row) {
        handleCellEdit(row._rowId, activeCellSelection.colId, formulaValue);
      }
    }
  };

  // Row operations
  const handleInsertRow = async () => {
    const pos = activeCellSelection ? activeCellSelection.rowIndex : 0;
    const newRow = await DataEditorService.insertRow(datasetId || 'ds-001', pos);

    setRows((prev) => {
      const copy = [...prev];
      copy.splice(pos, 0, newRow);
      return copy;
    });
    setTotalRowCount((prev) => prev + 1);

    pushHistory(
      () => {
        setRows((prev) => prev.filter((r) => r._rowId !== newRow._rowId));
        setTotalRowCount((prev) => prev - 1);
      },
      () => {
        setRows((prev) => {
          const copy = [...prev];
          copy.splice(pos, 0, newRow);
          return copy;
        });
        setTotalRowCount((prev) => prev + 1);
      }
    );
  };

  const handleDeleteSelectedRows = async () => {
    if (!activeCellSelection || activeCellSelection.selectedRowIds.length === 0) {
      alert('Please select one or more rows by clicking row numbers before deleting.');
      return;
    }

    const idsToDelete = activeCellSelection.selectedRowIds;
    const deletedRows = rows.filter((r) => idsToDelete.includes(r._rowId));

    if (confirm(`Are you sure you want to delete ${idsToDelete.length} selected row(s)?`)) {
      await DataEditorService.deleteRows(datasetId || 'ds-001', idsToDelete);
      setRows((prev) => prev.filter((r) => !idsToDelete.includes(r._rowId)));
      setTotalRowCount((prev) => prev - idsToDelete.length);

      pushHistory(
        () => {
          setRows((prev) => [...deletedRows, ...prev]);
          setTotalRowCount((prev) => prev + deletedRows.length);
        },
        () => {
          setRows((prev) => prev.filter((r) => !idsToDelete.includes(r._rowId)));
          setTotalRowCount((prev) => prev - idsToDelete.length);
        }
      );
    }
  };

  // Variable operations
  const handleInsertVariable = async () => {
    const newVar = await DataEditorService.addVariable(datasetId || 'ds-001', {
      name: `var_${variables.length + 1}`,
      dataType: 'string',
      measure: 'nominal',
    });

    setVariables((prev) => [...prev, newVar]);

    pushHistory(
      () => setVariables((prev) => prev.filter((v) => v.id !== newVar.id)),
      () => setVariables((prev) => [...prev, newVar])
    );
  };

  const handleUpdateVariable = async (varId: string, changes: Partial<Variable>) => {
    const target = variables.find((v) => v.id === varId);
    if (!target) return;

    const oldVar = { ...target };
    const updated = await DataEditorService.updateVariable(datasetId || 'ds-001', varId, changes);

    setVariables((prev) => prev.map((v) => (v.id === varId ? updated : v)));

    pushHistory(
      () => setVariables((prev) => prev.map((v) => (v.id === varId ? oldVar : v))),
      () => setVariables((prev) => prev.map((v) => (v.id === varId ? updated : v)))
    );
  };

  const handleDeleteSelectedVariables = async () => {
    if (!activeCellSelection || activeCellSelection.selectedColIds.length === 0) {
      alert('Please select a variable column header to delete.');
      return;
    }

    const colNames = activeCellSelection.selectedColIds;
    const targetVars = variables.filter((v) => colNames.includes(v.name));
    const targetIds = targetVars.map((v) => v.id);

    if (confirm(`Are you sure you want to delete ${targetVars.length} variable(s)?`)) {
      await DataEditorService.deleteVariables(datasetId || 'ds-001', targetIds);
      setVariables((prev) => prev.filter((v) => !targetIds.includes(v.id)));

      pushHistory(
        () => setVariables((prev) => [...prev, ...targetVars]),
        () => setVariables((prev) => prev.filter((v) => !targetIds.includes(v.id)))
      );
    }
  };

  // Save operation
  const handleSave = async () => {
    setSaveStatus({ state: 'saving' });
    try {
      await DataEditorService.save(datasetId || 'ds-001');
      setSaveStatus({ state: 'saved', lastSavedAt: new Date().toISOString() });
    } catch (err) {
      setSaveStatus({ state: 'error' });
    }
  };

  // Find & Replace
  const handleFindAndReplace = async (findVal: string, replaceVal: string, colId?: string) => {
    const count = await DataEditorService.findAndReplace(datasetId || 'ds-001', findVal, replaceVal, colId);
    if (count > 0) {
      loadEditorData();
      setSaveStatus({ state: 'unsaved' });
    }
    return count;
  };

  // Keyboard Shortcuts Global Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setIsFindReplaceOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  return (
    <div className="flex flex-col h-full bg-quantara-950 overflow-hidden font-sans">
      {/* 1. Header */}
      <DataEditorHeader
        datasetName={datasetName}
        version={3}
        rowCount={totalRowCount}
        colCount={variables.length}
        saveStatus={saveStatus}
        onSave={handleSave}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenInfo={() => setIsDatasetInfoOpen(true)}
      />

      {/* 2. Toolbar */}
      <DataEditorToolbar
        activeView={activeView}
        onViewChange={handleViewChange}
        canUndo={historyIndex >= 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        onOpenFindReplace={() => setIsFindReplaceOpen(true)}
        onInsertRow={handleInsertRow}
        onDeleteSelectedRows={handleDeleteSelectedRows}
        onInsertVariable={handleInsertVariable}
        onDeleteSelectedVariables={handleDeleteSelectedVariables}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        activeSort={activeSort}
        onSortChange={setActiveSort}
        variableNames={variables.map((v) => v.name)}
        showValueLabels={showValueLabels}
        onToggleValueLabels={() => setShowValueLabels(!showValueLabels)}
      />

      {/* 3. Formula Bar */}
      {activeView === 'data' && (
        <FormulaBar
          activeCell={activeCellSelection}
          cellValue={formulaValue}
          onCellValueChange={setFormulaValue}
          onCommitCellEdit={handleFormulaCommit}
        />
      )}

      {/* 4. Main Grid View Container */}
      <div className="flex-1 overflow-hidden relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-quantara-400 bg-quantara-950">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-3" />
            <span className="text-xs">Loading statistical data matrix...</span>
          </div>
        ) : activeView === 'data' ? (
          <DataGridView
            variables={variables}
            rows={rows}
            onCellEdit={handleCellEdit}
            onSelectionChange={handleSelectionChange}
            onInsertRowBefore={(pos) => handleInsertRow()}
            onDeleteRow={(rId) => {
              setActiveCellSelection({
                rowIndex: 0,
                colId: '',
                selectedCellCount: 1,
                selectedRowIds: [rId],
                selectedColIds: [],
              });
              handleDeleteSelectedRows();
            }}
            activeFilter={activeFilter}
            activeSort={activeSort}
            showValueLabels={showValueLabels}
          />
        ) : (
          <VariableGridView
            variables={variables}
            onUpdateVariable={handleUpdateVariable}
            onAddVariable={handleInsertVariable}
            onDeleteVariable={(varId) => {
              const target = variables.find((v) => v.id === varId);
              if (target) {
                setActiveCellSelection({
                  rowIndex: 0,
                  colId: '',
                  selectedCellCount: 1,
                  selectedRowIds: [],
                  selectedColIds: [target.name],
                });
                handleDeleteSelectedVariables();
              }
            }}
          />
        )}
      </div>

      {/* 5. Status Bar */}
      <StatusBar
        totalRows={totalRowCount}
        totalCols={variables.length}
        selection={activeCellSelection}
        filter={activeFilter}
        sort={activeSort}
        saveStatus={saveStatus}
      />

      {/* Modals */}
      {isFindReplaceOpen && (
        <FindReplaceModal
          variables={variables}
          onFindAndReplace={handleFindAndReplace}
          onClose={() => setIsFindReplaceOpen(false)}
        />
      )}

      {isShortcutsOpen && <KeyboardShortcutsModal onClose={() => setIsShortcutsOpen(false)} />}

      {isDatasetInfoOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-quantara-900 border border-quantara-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" /> Dataset Information
              </h3>
              <button onClick={() => setIsDatasetInfoOpen(false)} className="text-quantara-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs font-mono text-quantara-300">
              <div className="flex justify-between py-1 border-b border-quantara-800/60">
                <span className="text-quantara-400">Dataset Name:</span>
                <span className="text-white font-bold">{datasetName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-quantara-800/60">
                <span className="text-quantara-400">Row Count:</span>
                <span className="text-white font-bold">{totalRowCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-quantara-800/60">
                <span className="text-quantara-400">Variable Count:</span>
                <span className="text-white font-bold">{variables.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-quantara-800/60">
                <span className="text-quantara-400">Version:</span>
                <span className="text-white font-bold">3.0</span>
              </div>
              <div className="flex justify-between py-1 border-b border-quantara-800/60">
                <span className="text-quantara-400">Primary Format:</span>
                <span className="text-white font-bold">Apache Parquet / Arrow Snapshot</span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsDatasetInfoOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
