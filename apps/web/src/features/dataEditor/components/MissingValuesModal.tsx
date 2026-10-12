import React, { useState } from 'react';
import { Variable } from '../types/dataEditorTypes';
import { X, Plus, Trash2, HelpCircle, Check } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface MissingValuesModalProps {
  variable: Variable;
  onSave: (missingValues: string[]) => void;
  onClose: () => void;
}

export const MissingValuesModal: React.FC<MissingValuesModalProps> = ({ variable, onSave, onClose }) => {
  const [missingList, setMissingList] = useState<string[]>(variable.missingValues || []);
  const [newMissing, setNewMissing] = useState('');

  const handleAdd = () => {
    if (!newMissing.trim()) return;
    if (!missingList.includes(newMissing.trim())) {
      setMissingList([...missingList, newMissing.trim()]);
    }
    setNewMissing('');
  };

  const handleDelete = (val: string) => {
    setMissingList(missingList.filter((m) => m !== val));
  };

  const handleSave = () => {
    onSave(missingList);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-quantara-900 border border-quantara-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 bg-quantara-950 border-b border-quantara-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <HelpCircle className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-sm">User-Defined Missing Values — <span className="text-blue-400 font-mono">{variable.name}</span></h3>
          </div>
          <button onClick={onClose} className="text-quantara-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-quantara-300">
            Specify explicit numeric or string codes (e.g. <strong className="text-white font-mono">99, 999, N/A</strong>) that should be treated as discrete missing values during statistical analysis.
          </p>

          {/* Input Add */}
          <div className="bg-quantara-950 p-3 rounded-xl border border-quantara-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. 99, 999, NA, Refused"
              value={newMissing}
              onChange={(e) => setNewMissing(e.target.value)}
              className="flex-1 bg-quantara-900 border border-quantara-700 text-white rounded p-2 outline-none focus:border-blue-500 font-mono"
            />
            <button
              onClick={handleAdd}
              className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Code
            </button>
          </div>

          {/* Missing list pills */}
          <div className="bg-quantara-950 border border-quantara-800 rounded-xl p-4 min-h-24">
            <div className="text-[11px] font-semibold text-quantara-400 uppercase tracking-wider mb-2">
              Configured User-Defined Missing Codes:
            </div>
            {missingList.length === 0 ? (
              <span className="text-quantara-500 italic">No discrete user-defined missing values (System missing only).</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {missingList.map((val) => (
                  <span
                    key={val}
                    className="px-2.5 py-1 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-lg font-mono font-bold flex items-center gap-1.5"
                  >
                    {val}
                    <button onClick={() => handleDelete(val)} className="text-rose-400 hover:text-white transition">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-quantara-950 border-t border-quantara-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-quantara-800 hover:bg-quantara-700 text-white text-xs rounded-lg transition border border-quantara-700 font-medium"
          >
            Cancel
          </button>
          <Button onClick={handleSave} variant="primary" size="sm" className="flex items-center gap-1.5">
            <Check className="w-4 h-4" /> Save Missing Codes
          </Button>
        </div>
      </div>
    </div>
  );
};
