import React, { useMemo, useRef, useCallback, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, CellValueChangedEvent, SelectionChangedEvent, CellFocusedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Variable, DataRow, CellSelectionInfo, FilterCondition, SortCondition } from '../types/dataEditorTypes';
import { Info, HelpCircle, Tag, Layers, ShieldCheck } from 'lucide-react';

interface DataGridViewProps {
  variables: Variable[];
  rows: DataRow[];
  onCellEdit: (rowId: string, colId: string, newValue: any) => void;
  onSelectionChange: (selection: CellSelectionInfo | null) => void;
  onColumnHeaderContextMenu?: (colId: string, event: React.MouseEvent) => void;
  onInsertRowBefore?: (rowIndex: number) => void;
  onDeleteRow?: (rowId: string) => void;
  activeFilter?: FilterCondition;
  activeSort?: SortCondition;
  showValueLabels?: boolean;
}

export const DataGridView: React.FC<DataGridViewProps> = ({
  variables,
  rows,
  onCellEdit,
  onSelectionChange,
  onInsertRowBefore,
  onDeleteRow,
  activeFilter,
  activeSort,
  showValueLabels = true,
}) => {
  const gridRef = useRef<AgGridReact>(null);
  const [hoveredHeaderVar, setHoveredHeaderVar] = useState<Variable | null>(null);

  // Column definitions for AG Grid
  const columnDefs = useMemo<ColDef[]>(() => {
    // 1. Sticky Row Number Column (#)
    const rowNumCol: ColDef = {
      headerName: '#',
      field: '_rowNumber',
      width: 65,
      pinned: 'left',
      lockPinned: true,
      sortable: false,
      filter: false,
      resizable: false,
      editable: false,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      cellStyle: {
        backgroundColor: '#0a0d14',
        color: '#64748b',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        textAlign: 'center',
        borderRight: '1px solid #1e293b',
      },
    };

    // 2. Variable columns
    const varCols: ColDef[] = variables
      .filter((v) => !v.isHidden)
      .map((v) => {
        return {
          headerName: v.name,
          field: v.name,
          width: v.width || 120,
          editable: true,
          sortable: true,
          filter: true,
          resizable: true,
          pinned: v.isFrozen ? 'left' : undefined,
          headerTooltip: `${v.name} (${v.dataType.toUpperCase()}) — ${v.label || 'No label'}\nMeasure: ${v.measure.toUpperCase()} | Role: ${v.role.toUpperCase()}`,
          cellStyle: (params) => {
            const align = v.alignment || (v.dataType === 'integer' || v.dataType === 'float' ? 'right' : 'left');
            return {
              textAlign: align,
              fontFamily: v.dataType === 'integer' || v.dataType === 'float' ? 'monospace' : 'sans-serif',
            };
          },
          cellRenderer: (params: any) => {
            const val = params.value;
            // Check missing values
            if (val === null || val === undefined || val === '') {
              return <span className="text-quantara-600 italic font-mono text-[11px]">. (missing)</span>;
            }

            // User-defined missing check
            if (v.missingValues && v.missingValues.includes(String(val))) {
              return <span className="text-rose-400 font-mono font-bold" title="User-Defined Missing">{val} (missing)</span>;
            }

            // Value label formatting
            if (showValueLabels && v.valueLabels && v.valueLabels[String(val)]) {
              return (
                <span className="text-blue-300 font-semibold" title={`Raw Value Code: ${val}`}>
                  {v.valueLabels[String(val)]}
                </span>
              );
            }

            // Decimals formatting
            if (typeof val === 'number' && v.decimals !== undefined) {
              return <span>{val.toFixed(v.decimals)}</span>;
            }

            return <span>{String(val)}</span>;
          },
        };
      });

    return [rowNumCol, ...varCols];
  }, [variables, showValueLabels]);

  // Handle cell value edit completion
  const handleCellValueChanged = useCallback(
    (event: CellValueChangedEvent) => {
      const rowId = event.data._rowId;
      const colId = event.colDef.field;
      if (rowId && colId && colId !== '_rowNumber') {
        onCellEdit(rowId, colId, event.newValue);
      }
    },
    [onCellEdit]
  );

  // Handle cell focus / selection
  const handleCellFocused = useCallback(
    (event: CellFocusedEvent) => {
      if (event.rowIndex !== null && event.column) {
        const colId = typeof event.column === 'string' ? event.column : event.column.getColId();
        if (colId !== '_rowNumber') {
          onSelectionChange({
            rowIndex: event.rowIndex,
            colId,
            selectedCellCount: 1,
            selectedRowIds: [],
            selectedColIds: [colId],
          });
        }
      }
    },
    [onSelectionChange]
  );

  // Handle row selection change
  const handleSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const selectedNodes = event.api.getSelectedNodes();
      const selectedRowIds = selectedNodes.map((n) => n.data._rowId);
      if (selectedRowIds.length > 0) {
        onSelectionChange({
          rowIndex: selectedNodes[0].rowIndex || 0,
          colId: '',
          selectedCellCount: selectedRowIds.length,
          selectedRowIds,
          selectedColIds: [],
        });
      }
    },
    [onSelectionChange]
  );

  return (
    <div className="flex-1 w-full h-full bg-quantara-950 ag-theme-alpine-dark font-sans relative">
      <AgGridReact
        ref={gridRef}
        columnDefs={columnDefs}
        rowData={rows}
        rowSelection="multiple"
        enableCellTextSelection={true}
        ensureDomOrder={true}
        animateRows={true}
        onCellValueChanged={handleCellValueChanged}
        onCellFocused={handleCellFocused}
        onSelectionChanged={handleSelectionChanged}
        defaultColDef={{
          minWidth: 90,
          resizable: true,
        }}
      />
    </div>
  );
};
