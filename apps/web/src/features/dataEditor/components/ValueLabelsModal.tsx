import React, { useState } from 'react';
import { Variable } from '../types/dataEditorTypes';
import { X, Plus, Trash2, Tag, Save, Check } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface ValueLabelsModalProps {
  variable: Variable;
  onSave: (valueLabels: Record<string, string>) => void;
  onClose: () => void;
}

export const ValueLabelsModal: React.FC<ValueLabelsModalProps> = ({ variable, onSave, onClose }) => {
  const [labels, setLabels] = useState<Array<{ val: string; label: string }>>(
    variable.valueLabels
      ? Object.entries(variable.valueLabels).map(([val, label]) => ({ val, label }))
      : []
  );

  const [newVal, setNewVal] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const handleAdd = () => {
    if (!newVal.trim() || !newLabel.trim()) return;
    setLabels([...labels.filter((l) => l.val !== newVal.trim()), { val: newVal.trim(), label: newLabel.trim() }]);
    setNewVal('');
    setNewLabel('');
  };

  const handleDelete = (valToDelete: string) => {
    setLabels(labels.filter((l) => l.val !== valToDelete));
  };

  const handleSave = () => {
    const map: Record<string, string> = {};
    labels.forEach((l) => {
      map[l.val] = l.label;
    });
    onSave(map);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-quantara-900 border border-quantara-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 bg-quantara-950 border-b border-quantara-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Tag className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">Value Labels — <span className="text-blue-400 font-mono">{variable.name}</span></h3>
          </div>
          <button onClick={onClose} className="text-quantara-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-quantara-300">
            Define discrete numeric or string code mappings (e.g. <strong className="text-white font-mono">1 = Male, 2 = Female</strong>) used for statistical frequency tables and charts.
          </p>

          {/* Add New Entry Form */}
          <div className="bg-quantara-950 p-3 rounded-xl border border-quantara-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Value Code (e.g. 1)"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              className="w-1/3 bg-quantara-900 border border-quantara-700 text-white rounded p-2 outline-none focus:border-blue-500 font-mono"
            />
            <input
              type="text"
              placeholder="Label Description (e.g. Male)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="flex-1 bg-quantara-900 border border-quantara-700 text-white rounded p-2 outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAdd}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* Existing Labels List */}
          <div className="bg-quantara-950 border border-quantara-800 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
            {labels.length === 0 ? (
              <div className="p-6 text-center text-quantara-500 font-sans">
                No value labels defined for this variable yet.
              </div>
            ) : (
              <table className="w-full text-left font-mono border-collapse">
                <thead>
                  <tr className="bg-quantara-900 text-quantara-400 uppercase text-[10px] border-b border-quantara-800">
                    <th className="py-2 px-3">Value</th>
                    <th className="py-2 px-3 font-sans">Label</th>
                    <th className="py-2 px-3 text-right font-sans">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-quantara-800 text-slate-200">
                  {labels.map((l) => (
                    <tr key={l.val} className="hover:bg-quantara-900/60">
                      <td className="py-2 px-3 font-bold text-amber-400">{l.val}</td>
                      <td className="py-2 px-3 font-sans">{l.label}</td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => handleDelete(l.val)}
                          className="text-rose-400 hover:text-rose-300 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            <Check className="w-4 h-4" /> Save Value Labels
          </Button>
        </div>
      </div>
    </div>
  );
};
