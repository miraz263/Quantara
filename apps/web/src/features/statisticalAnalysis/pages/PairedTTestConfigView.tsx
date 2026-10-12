import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { VariableSelector } from '../components/VariableSelector';
import { Play, RefreshCw, Plus, Trash2, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface PairedTTestConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const PairedTTestConfigView: React.FC<PairedTTestConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [pairs, setPairs] = useState<Array<{ variable1: string; variable2: string }>>([
    { variable1: 'before_score', variable2: 'after_score' },
  ]);

  const [tail, setTail] = useState<'two_sided' | 'less' | 'greater'>('two_sided');
  const [confidenceInterval, setConfidenceInterval] = useState<number>(95);
  const [effectSize, setEffectSize] = useState<boolean>(true);

  const [validationError, setValidationError] = useState<string | null>(null);

  const numericVars = availableVariables.filter(
    (v) => v.measure === 'scale' || v.dataType === 'float' || v.dataType === 'integer'
  );

  const handleAddPair = () => {
    const v1 = numericVars[0]?.name || 'before_score';
    const v2 = numericVars[1]?.name || 'after_score';
    setPairs([...pairs, { variable1: v1, variable2: v2 }]);
  };

  const handleRemovePair = (index: number) => {
    if (pairs.length === 1) {
      setValidationError('At least ONE valid variable pair is required.');
      return;
    }
    setPairs(pairs.filter((_, i) => i !== index));
  };

  const handlePairChange = (index: number, field: 'variable1' | 'variable2', value: string) => {
    const updated = [...pairs];
    updated[index][field] = value;
    setPairs(updated);
  };

  const handleRun = () => {
    if (pairs.length === 0) {
      setValidationError('Add at least one pair of related numeric variables.');
      return;
    }

    for (let i = 0; i < pairs.length; i++) {
      const p = pairs[i];
      if (!p.variable1 || !p.variable2) {
        setValidationError(`Pair ${i + 1} is incomplete. Both variables must be selected.`);
        return;
      }
      if (p.variable1 === p.variable2) {
        setValidationError(`Pair ${i + 1} has identical variables (${p.variable1}). A paired t-test requires two distinct measurements.`);
        return;
      }
    }

    setValidationError(null);

    // Extract all unique variables for the request
    const allVars = Array.from(new Set(pairs.flatMap((p) => [p.variable1, p.variable2])));

    onRunAnalysis({
      procedure: 'paired_ttest',
      title: `Paired-Samples t-Test — ${pairs.map((p) => `${p.variable1} ↔ ${p.variable2}`).join(', ')}`,
      variables: allVars,
      options: {
        testType: 'paired',
        pairedVariables: pairs,
        tail,
        confidenceInterval,
        effectSize,
      },
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6 font-sans">
      <div className="border-b border-quantara-800 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
            Paired-Samples t-Test Procedure Configuration
          </h2>
          <p className="text-xs text-quantara-400 mt-0.5">
            Compare means between two related measurements (e.g. Baseline vs Follow-up) on the same subjects.
          </p>
        </div>

        <Button
          onClick={handleRun}
          disabled={isSubmitting || pairs.length === 0}
          variant="primary"
          size="sm"
          className="flex items-center gap-2 shadow-lg"
        >
          {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          {isSubmitting ? 'Calculating Paired t-Test...' : 'Run Procedure'}
        </Button>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* 1. Pair Builder */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-quantara-800 pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            1. Configure Paired Variables (&ge; 1 Pair)
          </h3>

          <button
            onClick={handleAddPair}
            className="px-2.5 py-1 bg-quantara-950 hover:bg-quantara-800 text-indigo-400 hover:text-white rounded-lg text-xs font-semibold border border-quantara-700 transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Variable Pair
          </button>
        </div>

        <div className="space-y-3">
          {pairs.map((pair, idx) => (
            <div key={idx} className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 flex flex-col sm:flex-row items-center gap-3">
              <span className="text-xs font-mono font-bold text-indigo-400 w-16">Pair {idx + 1}:</span>

              {/* Variable 1 */}
              <select
                value={pair.variable1}
                onChange={(e) => handlePairChange(idx, 'variable1', e.target.value)}
                className="flex-1 bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
              >
                {numericVars.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.label || v.name} ({v.name})
                  </option>
                ))}
              </select>

              <ArrowRightLeft className="w-4 h-4 text-quantara-500 flex-shrink-0" />

              {/* Variable 2 */}
              <select
                value={pair.variable2}
                onChange={(e) => handlePairChange(idx, 'variable2', e.target.value)}
                className="flex-1 bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
              >
                {numericVars.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.label || v.name} ({v.name})
                  </option>
                ))}
              </select>

              {/* Remove */}
              <button
                onClick={() => handleRemovePair(idx)}
                className="p-1.5 bg-quantara-900 hover:bg-rose-950/60 border border-quantara-800 text-quantara-400 hover:text-rose-300 rounded transition"
                title="Remove Pair"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Options */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-quantara-800 pb-2">
          2. Statistical Options
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-3">
            <div className="font-bold text-blue-400 uppercase text-[10px]">Alternative Hypothesis</div>
            <select
              value={tail}
              onChange={(e) => setTail(e.target.value as any)}
              className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
            >
              <option value="two_sided">Two-sided (&mu;₁ &ne; &mu;₂)</option>
              <option value="less">Less than (&mu;₁ &lt; &mu;₂)</option>
              <option value="greater">Greater than (&mu;₁ &gt; &mu;₂)</option>
            </select>
          </div>

          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-3">
            <div className="font-bold text-emerald-400 uppercase text-[10px]">Confidence Level</div>
            <select
              value={confidenceInterval}
              onChange={(e) => setConfidenceInterval(parseInt(e.target.value) || 95)}
              className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
            >
              <option value={90}>90% Confidence Interval</option>
              <option value={95}>95% Confidence Interval</option>
              <option value={99}>99% Confidence Interval</option>
            </select>
          </div>

          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-2.5">
            <div className="font-bold text-purple-400 uppercase text-[10px]">Effect Size</div>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={effectSize}
                onChange={(e) => setEffectSize(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              Calculate Cohen's dz (Mean Diff / SD Diff)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
