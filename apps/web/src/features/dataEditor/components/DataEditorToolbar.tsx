import React, { useState } from 'react';
import {
  Undo,
  Redo,
  Save,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Trash2,
  Database,
  Sliders,
  Sparkles,
  ChevronDown,
  X,
  PlusCircle,
  Tag,
  Eye,
  Lock,
} from 'lucide-react';
import { TransformMenu } from './TransformMenu';
import { FilterCondition, SortCondition } from '../types/dataEditorTypes';

interface DataEditorToolbarProps {
  activeView: 'data' | 'variable';
  onViewChange: (view: 'data' | 'variable') => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onOpenFindReplace: () => void;
  onInsertRow: () => void;
  onDeleteSelectedRows: () => void;
  onInsertVariable: () => void;
  onDeleteSelectedVariables: () => void;
  activeFilter?: FilterCondition;
  onFilterChange: (filter?: FilterCondition) => void;
  activeSort?: SortCondition;
  onSortChange: (sort?: SortCondition) => void;
  variableNames: string[];
  showValueLabels?: boolean;
  onToggleValueLabels?: () => void;
}

export const DataEditorToolbar: React.FC<DataEditorToolbarProps> = ({
  activeView,
  onViewChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onOpenFindReplace,
  onInsertRow,
  onDeleteSelectedRows,
  onInsertVariable,
  onDeleteSelectedVariables,
  activeFilter,
  onFilterChange,
  activeSort,
  onSortChange,
  variableNames,
  showValueLabels = true,
  onToggleValueLabels,
}) => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterCol, setFilterCol] = useState(variableNames[0] || 'age');
  const [filterOp, setFilterOp] = useState<FilterCondition['operator']>('greater_than');
  const [filterVal, setFilterVal] = useState('40');

  const handleApplyFilter = () => {
    onFilterChange({
      colId: filterCol,
      operator: filterOp,
      value: filterVal,
    });
    setIsFilterDropdownOpen(false);
  };

  return (
    <div className="bg-quantara-900 border-b border-quantara-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 font-sans">
      {/* Left Action Buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Undo / Redo */}
        <div className="flex items-center bg-quantara-950 border border-quantara-700 rounded-lg p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition ${
              canUndo ? 'text-quantara-200 hover:text-white hover:bg-quantara-800' : 'text-quantara-600 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition ${
              canRedo ? 'text-quantara-200 hover:text-white hover:bg-quantara-800' : 'text-quantara-600 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-quantara-800" />

        {/* Value Labels Toggle Button */}
        {onToggleValueLabels && (
          <button
            onClick={onToggleValueLabels}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition flex items-center gap-1.5 ${
              showValueLabels
                ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                : 'bg-quantara-950 border-quantara-700 text-quantara-300 hover:text-white'
            }`}
            title="Toggle Value Labels Display vs Raw Code Values"
          >
            <Tag className={`w-3.5 h-3.5 ${showValueLabels ? 'text-amber-400' : 'text-quantara-400'}`} />
            <span>{showValueLabels ? 'Labels Active' : 'Raw Values'}</span>
          </button>
        )}

        <div className="h-4 w-px bg-quantara-800" />

        {/* Find & Replace */}
        <button
          onClick={onOpenFindReplace}
          className="px-2.5 py-1.5 bg-quantara-950 border border-quantara-700 hover:bg-quantara-800 text-quantara-200 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
          title="Find & Replace (Ctrl+F)"
        >
          <Search className="w-3.5 h-3.5 text-blue-400" />
          Find & Replace
        </button>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition flex items-center gap-1.5 ${
              activeFilter
                ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                : 'bg-quantara-950 border-quantara-700 text-quantara-200 hover:text-white'
            }`}
          >
            <Filter className={`w-3.5 h-3.5 ${activeFilter ? 'text-amber-400' : 'text-quantara-400'}`} />
            {activeFilter ? `Filter: ${activeFilter.colId}` : 'Filter'}
            <ChevronDown className="w-3 h-3 text-quantara-500" />
          </button>

          {isFilterDropdownOpen && (
            <div className="absolute left-0 mt-1 w-72 bg-quantara-900 border border-quantara-700 rounded-xl shadow-2xl p-4 z-50 text-xs space-y-3">
              <div className="font-bold text-white border-b border-quantara-800 pb-2">Filter Data View</div>

              <div>
                <label className="block text-quantara-400 mb-1 font-semibold">Variable</label>
                <select
                  value={filterCol}
                  onChange={(e) => setFilterCol(e.target.value)}
                  className="w-full bg-quantara-950 border border-quantara-700 text-white rounded p-1.5 outline-none font-mono"
                >
                  {variableNames.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-quantara-400 mb-1 font-semibold">Operator</label>
                <select
                  value={filterOp}
                  onChange={(e) => setFilterOp(e.target.value as any)}
                  className="w-full bg-quantara-950 border border-quantara-700 text-white rounded p-1.5 outline-none"
                >
                  <option value="greater_than">Greater than (&gt;)</option>
                  <option value="less_than">Less than (&lt;)</option>
                  <option value="equals">Equals (=)</option>
                  <option value="not_equals">Not equals (!=)</option>
                  <option value="contains">Contains</option>
                  <option value="is_null">Is missing / null</option>
                </select>
              </div>

              <div>
                <label className="block text-quantara-400 mb-1 font-semibold">Value</label>
                <input
                  type="text"
                  value={filterVal}
                  onChange={(e) => setFilterVal(e.target.value)}
                  className="w-full bg-quantara-950 border border-quantara-700 text-white rounded p-1.5 outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-quantara-800">
                {activeFilter && (
                  <button
                    onClick={() => {
                      onFilterChange(undefined);
                      setIsFilterDropdownOpen(false);
                    }}
                    className="text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    Clear Filter
                  </button>
                )}
                <button
                  onClick={handleApplyFilter}
                  className="ml-auto px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold transition"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-quantara-800" />

        {/* Insert / Delete Operations */}
        <button
          onClick={onInsertRow}
          className="px-2.5 py-1.5 bg-quantara-950 border border-quantara-700 hover:bg-quantara-800 text-quantara-200 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
          title="Insert New Row / Case"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" /> Case
        </button>

        <button
          onClick={onDeleteSelectedRows}
          className="px-2.5 py-1.5 bg-quantara-950 border border-quantara-700 hover:bg-quantara-800 text-quantara-200 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
          title="Delete Selected Cases"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Cases
        </button>

        <button
          onClick={onInsertVariable}
          className="px-2.5 py-1.5 bg-quantara-950 border border-quantara-700 hover:bg-quantara-800 text-quantara-200 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
          title="Insert New Variable / Column"
        >
          <PlusCircle className="w-3.5 h-3.5 text-blue-400" /> Variable
        </button>

        <button
          onClick={onDeleteSelectedVariables}
          className="px-2.5 py-1.5 bg-quantara-950 border border-quantara-700 hover:bg-quantara-800 text-quantara-200 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
          title="Delete Selected Variables"
        >
          <Trash2 className="w-3.5 h-3.5 text-amber-400" /> Variables
        </button>

        <div className="h-4 w-px bg-quantara-800" />

        {/* Transform Menu */}
        <TransformMenu />
      </div>

      {/* Right View Switcher */}
      <div className="flex items-center bg-quantara-950 border border-quantara-700 rounded-xl p-1">
        <button
          onClick={() => onViewChange('data')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
            activeView === 'data'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-quantara-400 hover:text-white'
          }`}
        >
          <Database className="w-3.5 h-3.5" /> Data View
        </button>

        <button
          onClick={() => onViewChange('variable')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
            activeView === 'variable'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-quantara-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" /> Variable View
        </button>
      </div>
    </div>
  );
};
