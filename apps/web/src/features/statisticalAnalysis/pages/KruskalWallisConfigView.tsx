import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { Play, Layers, CheckCircle2, Sliders, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface KruskalWallisConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const KruskalWallisConfigView: React.FC<KruskalWallisConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [dependentVariable, setDependentVariable] = useState<string>('income');
  const [factorVariable, setFactorVariable] = useState<string>('education');
  const [dunnPostHoc, setDunnPostHoc] = useState<boolean>(true);
  const [postHocAdjustment, setPostHocAdjustment] = useState<'none' | 'bonferroni' | 'holm'>('holm');

  const handleRun = () => {
    if (!dependentVariable || !factorVariable) return;

    onRunAnalysis({
      procedure: 'kruskal_wallis',
      title: `Kruskal–Wallis H Test — ${dependentVariable} by ${factorVariable}`,
      variables: [dependentVariable],
      groupingVariables: [factorVariable],
      options: {
        dependentVariable,
        factorVariable,
        dunnPostHoc,
        postHocAdjustment,
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 font-sans">
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-950 border border-purple-800 text-purple-400 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Kruskal–Wallis H Test</h1>
            <p className="text-xs text-quantara-400 mt-0.5">
              Nonparametric rank-based test for comparing 3 or more independent groups with Dunn post-hoc
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-purple-400" /> ≥ 3 Independent Groups
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dependent Variable Selector */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
          <label className="text-xs font-bold text-white uppercase tracking-wider block">
            1. Dependent Variable (Numeric or Ordinal Outcome)
          </label>
          <select
            value={dependentVariable}
            onChange={(e) => setDependentVariable(e.target.value)}
            className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-purple-500"
          >
            {availableVariables.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.label || v.measure})
              </option>
            ))}
          </select>
        </div>

        {/* Factor Variable Selector */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
          <label className="text-xs font-bold text-white uppercase tracking-wider block">
            2. Grouping Factor Variable (≥ 3 Group Levels)
          </label>
          <select
            value={factorVariable}
            onChange={(e) => setFactorVariable(e.target.value)}
            className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-purple-500"
          >
            {availableVariables.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.label || v.measure})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Post-Hoc Options */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <label className="text-xs font-bold text-white uppercase tracking-wider block flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" /> Post-Hoc Pairwise Comparisons (Dunn's Test)
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <label className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl flex items-center gap-2 cursor-pointer text-white font-semibold">
            <input
              type="checkbox"
              checked={dunnPostHoc}
              onChange={(e) => setDunnPostHoc(e.target.checked)}
              className="rounded border-quantara-700 text-purple-500 focus:ring-0"
            />
            <span>Perform Dunn's Post-Hoc Pairwise Comparisons</span>
          </label>

          {dunnPostHoc && (
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
          Omnibus test statistic $H$ (Chi-Square) and effect size $\epsilon^2$ calculated deterministically.
        </div>

        <Button
          onClick={handleRun}
          disabled={!dependentVariable || !factorVariable || isSubmitting}
          variant="primary"
          size="lg"
          className="flex items-center gap-2 shadow-xl px-6"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isSubmitting ? 'Calculating Kruskal–Wallis H...' : 'Run Kruskal–Wallis H Test'}</span>
        </Button>
      </div>
    </div>
  );
};
