import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { Play, Layers, CheckCircle2, Trash2, Plus, Sliders } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface FriedmanConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const FriedmanConfigView: React.FC<FriedmanConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>(['before_score', 'after_score', 'income']);
  const [pairwiseWilcoxonPostHoc, setPairwiseWilcoxonPostHoc] = useState<boolean>(true);
  const [postHocAdjustment, setPostHocAdjustment] = useState<'none' | 'bonferroni' | 'holm'>('holm');

  const handleAddCondition = (varName: string) => {
    if (!selectedConditions.includes(varName)) {
      setSelectedConditions([...selectedConditions, varName]);
    }
  };

  const handleRemoveCondition = (varName: string) => {
    setSelectedConditions(selectedConditions.filter((c) => c !== varName));
  };

  const handleRun = () => {
    if (selectedConditions.length < 3) return;

    onRunAnalysis({
      procedure: 'friedman',
      title: `Friedman Test — ${selectedConditions.join(', ')}`,
      variables: selectedConditions,
      options: {
        relatedConditions: selectedConditions,
        pairwiseWilcoxonPostHoc,
        postHocAdjustment,
      },
    });
  };

  const availableToAdd = availableVariables.filter((v) => !selectedConditions.includes(v.name));

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 font-sans">
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-950 border border-purple-800 text-purple-400 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Friedman Test</h1>
            <p className="text-xs text-quantara-400 mt-0.5">
              Nonparametric repeated-measures test for comparing 3 or more related conditions with Kendall's W
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-purple-400" /> ≥ 3 Related Conditions ({selectedConditions.length})
        </span>
      </div>

      {/* Related Conditions Selector List */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <label className="text-xs font-bold text-white uppercase tracking-wider block">
          Repeated / Related Conditions (Select ≥ 3 variables measured on the same subjects)
        </label>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {selectedConditions.map((cond, idx) => (
            <div
              key={cond}
              className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl flex items-center justify-between text-xs text-white"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-950 text-purple-400 font-mono text-[10px] font-bold flex items-center justify-center border border-purple-800">
                  {idx + 1}
                </span>
                <span className="font-semibold">{cond}</span>
              </div>
              <button
                onClick={() => handleRemoveCondition(cond)}
                className="p-1 hover:bg-rose-950 text-quantara-400 hover:text-rose-400 rounded transition"
                title="Remove condition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {selectedConditions.length < 3 && (
            <div className="p-3 bg-amber-950/60 border border-amber-800 text-amber-300 rounded-xl text-xs font-medium">
              Select at least 3 related condition variables to run the Friedman test.
            </div>
          )}
        </div>

        {availableToAdd.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-quantara-800">
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  handleAddCondition(e.target.value);
                  e.target.value = '';
                }
              }}
              className="flex-1 bg-quantara-950 border border-quantara-700 text-quantara-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-purple-500"
            >
              <option value="" disabled>
                + Select variable to add as related condition...
              </option>
              {availableToAdd.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.label || v.measure})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Post-Hoc Options */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <label className="text-xs font-bold text-white uppercase tracking-wider block flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" /> Post-Hoc Pairwise Wilcoxon Signed-Rank Comparisons
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <label className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl flex items-center gap-2 cursor-pointer text-white font-semibold">
            <input
              type="checkbox"
              checked={pairwiseWilcoxonPostHoc}
              onChange={(e) => setPairwiseWilcoxonPostHoc(e.target.checked)}
              className="rounded border-quantara-700 text-purple-500 focus:ring-0"
            />
            <span>Perform Pairwise Wilcoxon Post-Hoc Tests</span>
          </label>

          {pairwiseWilcoxonPostHoc && (
            <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl flex items-center justify-between">
              <span className="font-semibold text-white">p-Value Multiple Comparison Adjustment</span>
              <select
                value={postHocAdjustment}
                onChange={(e) => setPostHocAdjustment(e.target.value as any)}
                className="bg-quantara-900 border border-quantara-700 text-white rounded-lg px-2.5 py-1 text-xs outline-none"
              >
                <option value="holm">Holm Step-Down (Recommended)</option>
                <option value="bonferroni">Bonferroni Adjustment</option>
                <option value="none">Unadjusted Raw p-values</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-quantara-400">
          Friedman $\chi^2$ statistic and Kendall's W concordance effect size calculated deterministically.
        </div>

        <Button
          onClick={handleRun}
          disabled={selectedConditions.length < 3 || isSubmitting}
          variant="primary"
          size="lg"
          className="flex items-center gap-2 shadow-xl px-6"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isSubmitting ? 'Calculating Friedman Test...' : 'Run Friedman Test'}</span>
        </Button>
      </div>
    </div>
  );
};
