import React, { useState } from 'react';
import { ValidationRule } from '../types/profilingTypes';
import { X, Plus, ShieldCheck, Check } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface RuleBuilderModalProps {
  variableNames: string[];
  onAddRule: (rule: ValidationRule) => void;
  onClose: () => void;
}

export const RuleBuilderModal: React.FC<RuleBuilderModalProps> = ({ variableNames, onAddRule, onClose }) => {
  const [variableName, setVariableName] = useState(variableNames[0] || 'age');
  const [ruleType, setRuleType] = useState<ValidationRule['ruleType']>('between');
  const [minVal, setMinVal] = useState<string>('0');
  const [maxVal, setMaxVal] = useState<string>('120');

  const handleSave = () => {
    const newRule: ValidationRule = {
      id: `rule-${Date.now()}`,
      variableName,
      ruleType,
      min: ruleType === 'between' || ruleType === 'greater_than' ? Number(minVal) : undefined,
      max: ruleType === 'between' || ruleType === 'less_than' ? Number(maxVal) : undefined,
    };
    onAddRule(newRule);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-quantara-900 border border-quantara-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 bg-quantara-950 border-b border-quantara-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Add Custom Data Validation Rule</h3>
          </div>
          <button onClick={onClose} className="text-quantara-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-quantara-300 mb-1">Target Variable</label>
            <select
              value={variableName}
              onChange={(e) => setVariableName(e.target.value)}
              className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2.5 outline-none focus:border-blue-500 font-mono"
            >
              {variableNames.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-quantara-300 mb-1">Validation Constraint Rule</label>
            <select
              value={ruleType}
              onChange={(e) => setRuleType(e.target.value as any)}
              className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2.5 outline-none focus:border-blue-500"
            >
              <option value="between">Range (Minimum $\le$ Value $\le$ Maximum)</option>
              <option value="greater_than">Greater than or equal to ($\ge$ Min)</option>
              <option value="less_than">Less than or equal to ($\le$ Max)</option>
              <option value="not_null">Cannot be missing (Not Null)</option>
            </select>
          </div>

          {ruleType === 'between' && (
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div>
                <label className="block font-semibold text-quantara-300 mb-1 font-sans">Minimum Allowed</label>
                <input
                  type="number"
                  value={minVal}
                  onChange={(e) => setMinVal(e.target.value)}
                  className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-quantara-300 mb-1 font-sans">Maximum Allowed</label>
                <input
                  type="number"
                  value={maxVal}
                  onChange={(e) => setMaxVal(e.target.value)}
                  className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
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
            <Check className="w-4 h-4" /> Save Rule
          </Button>
        </div>
      </div>
    </div>
  );
};
