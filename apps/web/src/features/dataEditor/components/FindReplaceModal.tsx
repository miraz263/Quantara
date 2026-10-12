import React, { useState } from 'react';
import { Variable } from '../types/dataEditorTypes';
import { Search, RefreshCw, X, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface FindReplaceModalProps {
  variables: Variable[];
  onFindAndReplace: (findVal: string, replaceVal: string, colId?: string) => Promise<number>;
  onClose: () => void;
}

export const FindReplaceModal: React.FC<FindReplaceModalProps> = ({ variables, onFindAndReplace, onClose }) => {
  const [findVal, setFindVal] = useState('');
  const [replaceVal, setReplaceVal] = useState('');
  const [selectedColId, setSelectedColId] = useState<string>('all');
  const [matchMessage, setMatchMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExecuteReplace = async () => {
    if (!findVal.trim()) return;
    setIsProcessing(true);
    try {
      const colId = selectedColId === 'all' ? undefined : selectedColId;
      const count = await onFindAndReplace(findVal.trim(), replaceVal.trim(), colId);
      setMatchMessage(`Successfully replaced ${count} matching cell instance(s).`);
    } catch (err) {
      setMatchMessage('Error executing replace operation.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-quantara-900 border border-quantara-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 bg-quantara-950 border-b border-quantara-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Search className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Find & Replace in Dataset</h3>
          </div>
          <button onClick={onClose} className="text-quantara-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-quantara-300 mb-1">Find Value</label>
            <input
              type="text"
              placeholder="Target value to search..."
              value={findVal}
              onChange={(e) => setFindVal(e.target.value)}
              className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2.5 outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-quantara-300 mb-1">Replace With</label>
            <input
              type="text"
              placeholder="New replacement value..."
              value={replaceVal}
              onChange={(e) => setReplaceVal(e.target.value)}
              className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2.5 outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-quantara-300 mb-1">Scope Column</label>
            <select
              value={selectedColId}
              onChange={(e) => setSelectedColId(e.target.value)}
              className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2.5 outline-none focus:border-blue-500 font-mono"
            >
              <option value="all">All Variables / Columns</option>
              {variables.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name} ({v.label || 'No label'})
                </option>
              ))}
            </select>
          </div>

          {matchMessage && (
            <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-lg text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{matchMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-quantara-950 border-t border-quantara-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-quantara-800 hover:bg-quantara-700 text-white text-xs rounded-lg transition border border-quantara-700 font-medium"
          >
            Close
          </button>
          <Button
            onClick={handleExecuteReplace}
            disabled={isProcessing || !findVal.trim()}
            variant="primary"
            size="sm"
            className="flex items-center gap-1.5"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Replace All Matching
          </Button>
        </div>
      </div>
    </div>
  );
};
