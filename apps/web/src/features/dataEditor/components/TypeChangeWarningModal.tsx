import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DataType } from '../types/dataEditorTypes';

interface TypeChangeWarningModalProps {
  varName: string;
  fromType: DataType;
  toType: DataType;
  onConfirm: () => void;
  onCancel: () => void;
}

export const TypeChangeWarningModal: React.FC<TypeChangeWarningModalProps> = ({
  varName,
  fromType,
  toType,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-quantara-900 border border-amber-900/80 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-scale-up">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-950 text-amber-400 border border-amber-800 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Confirm Variable Type Change</h3>
            <p className="text-xs text-quantara-400 mt-0.5 font-mono">
              Variable: <span className="text-amber-400 font-bold">{varName}</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-quantara-300 leading-relaxed">
          Changing data type from <strong className="text-white font-mono uppercase">{fromType}</strong> to <strong className="text-white font-mono uppercase">{toType}</strong> may cause incompatible or non-convertible cell observations to become missing (<strong className="text-rose-400 font-mono">NaN / null</strong>).
        </p>

        <div className="p-3 bg-quantara-950 rounded-xl border border-quantara-800 text-[11px] text-quantara-400 font-mono">
          Note: This operation can be undone using Undo (Ctrl+Z).
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-quantara-800">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-quantara-800 hover:bg-quantara-700 text-quantara-300 rounded-lg text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg text-xs transition shadow-lg"
          >
            Convert Data Type
          </button>
        </div>
      </div>
    </div>
  );
};
