import React from 'react';
import { Calculator, FunctionSquare, Check } from 'lucide-react';
import { CellSelectionInfo } from '../types/dataEditorTypes';

interface FormulaBarProps {
  activeCell: CellSelectionInfo | null;
  cellValue: string;
  onCellValueChange: (val: string) => void;
  onCommitCellEdit: () => void;
}

export const FormulaBar: React.FC<FormulaBarProps> = ({
  activeCell,
  cellValue,
  onCellValueChange,
  onCommitCellEdit,
}) => {
  return (
    <div className="bg-quantara-950 border-b border-quantara-800 px-4 py-1.5 flex items-center gap-3 font-mono text-xs">
      {/* Active Cell Location Pill */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-quantara-900 border border-quantara-700 rounded text-blue-400 font-bold min-w-36 text-[11px]">
        <FunctionSquare className="w-3.5 h-3.5 text-quantara-400 flex-shrink-0" />
        {activeCell ? (
          <span>
            R{activeCell.rowIndex + 1} : <strong className="text-white font-sans">{activeCell.colId}</strong>
          </span>
        ) : (
          <span className="text-quantara-500 font-sans italic font-normal">No cell selected</span>
        )}
      </div>

      <span className="text-quantara-600 font-sans font-bold">fx</span>

      {/* Formula / Value Input */}
      <div className="flex-1 flex items-center gap-2">
        <input
          type="text"
          value={cellValue}
          onChange={(e) => onCellValueChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onCommitCellEdit();
            }
          }}
          placeholder={activeCell ? 'Enter cell value or statistical expression...' : 'Select a cell in Data View to inspect or edit value'}
          className="w-full bg-quantara-900 border border-quantara-800 text-white rounded px-3 py-1 outline-none focus:border-blue-500 text-xs font-mono"
        />

        {cellValue !== '' && (
          <button
            onClick={onCommitCellEdit}
            className="p-1 rounded bg-blue-600 hover:bg-blue-500 text-white transition"
            title="Commit cell edit (Enter)"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
