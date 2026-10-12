import React from 'react';
import { CellSelectionInfo, FilterCondition, SortCondition, EditorSaveStatus } from '../types/dataEditorTypes';
import { Database, Filter, ArrowUpDown, CheckCircle2, AlertCircle } from 'lucide-react';

interface StatusBarProps {
  totalRows: number;
  totalCols: number;
  selection: CellSelectionInfo | null;
  filter?: FilterCondition;
  sort?: SortCondition;
  saveStatus: EditorSaveStatus;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  totalRows,
  totalCols,
  selection,
  filter,
  sort,
  saveStatus,
}) => {
  return (
    <div className="bg-quantara-950 border-t border-quantara-800 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-quantara-400 font-medium">
      {/* Left Data Counts & Selection */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-slate-200">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <strong className="text-white">{totalRows.toLocaleString()}</strong> cases × <strong className="text-white">{totalCols}</strong> variables
        </span>

        {selection && (
          <>
            <span className="text-quantara-600">•</span>
            <span className="text-blue-300 font-sans">
              Selected: <strong className="text-white font-mono">{selection.selectedCellCount}</strong> {selection.selectedCellCount === 1 ? 'cell' : 'cells'}
            </span>
          </>
        )}
      </div>

      {/* Right Filters, Sort & Save Status */}
      <div className="flex items-center gap-4">
        {filter && (
          <span className="flex items-center gap-1 text-amber-300 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded font-sans text-[10px]">
            <Filter className="w-3 h-3 text-amber-400" />
            Filter: {filter.colId} {filter.operator} {String(filter.value)}
          </span>
        )}

        {sort && (
          <span className="flex items-center gap-1 text-indigo-300 bg-indigo-950/60 border border-indigo-800 px-2 py-0.5 rounded font-sans text-[10px]">
            <ArrowUpDown className="w-3 h-3 text-indigo-400" />
            Sort: {sort.colId} {sort.direction.toUpperCase()}
          </span>
        )}

        <span className="text-quantara-600">•</span>

        <span className="font-sans">
          {saveStatus.state === 'saved' && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> All changes saved
            </span>
          )}
          {saveStatus.state === 'unsaved' && (
            <span className="text-amber-400 font-semibold">● Unsaved changes</span>
          )}
          {saveStatus.state === 'saving' && (
            <span className="text-blue-400 font-semibold">Saving dataset...</span>
          )}
        </span>
      </div>
    </div>
  );
};
