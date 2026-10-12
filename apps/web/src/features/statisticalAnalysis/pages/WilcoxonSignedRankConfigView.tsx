import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { Play, Layers, CheckCircle2, Sliders } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface WilcoxonSignedRankConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const WilcoxonSignedRankConfigView: React.FC<WilcoxonSignedRankConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [var1, setVar1] = useState<string>('before_score');
  const [var2, setVar2] = useState<string>('after_score');
  const [zeroHandling, setZeroHandling] = useState<'wilcox' | 'pratt' | 'zsplit'>('pratt');
  const [pValueMethod, setPValueMethod] = useState<'automatic' | 'exact' | 'asymptotic'>('automatic');

  const handleRun = () => {
    if (!var1 || !var2 || var1 === var2) return;

    onRunAnalysis({
      procedure: 'wilcoxon_signed_rank',
      title: `Wilcoxon Signed-Rank Test — ${var1} vs ${var2}`,
      variables: [var1, var2],
      options: {
        pairedVariables: [{ variable1: var1, variable2: var2 }],
        zeroDifferenceHandling: zeroHandling,
        pValueMethod,
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 font-sans">
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-950 border border-indigo-800 text-indigo-400 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Wilcoxon Signed-Rank Test</h1>
            <p className="text-xs text-quantara-400 mt-0.5">
              Nonparametric test for comparing two related/paired observations (Pre vs Post)
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-indigo-400" /> 2 Matched Paired Samples
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Variable 1 Selector */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
          <label className="text-xs font-bold text-white uppercase tracking-wider block">
            1. Paired Variable 1 (Baseline / Pre-Test)
          </label>
          <select
            value={var1}
            onChange={(e) => setVar1(e.target.value)}
            className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500"
          >
            {availableVariables.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.label || v.measure})
              </option>
            ))}
          </select>
        </div>

        {/* Variable 2 Selector */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
          <label className="text-xs font-bold text-white uppercase tracking-wider block">
            2. Paired Variable 2 (Follow-up / Post-Test)
          </label>
          <select
            value={var2}
            onChange={(e) => setVar2(e.target.value)}
            className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500"
          >
            {availableVariables.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.label || v.measure})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Test Options */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <label className="text-xs font-bold text-white uppercase tracking-wider block flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" /> Zero Differences & Probability Handling
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl flex items-center justify-between">
            <span className="font-semibold text-white">Zero-Difference Handling</span>
            <select
              value={zeroHandling}
              onChange={(e) => setZeroHandling(e.target.value as any)}
              className="bg-quantara-900 border border-quantara-700 text-white rounded-lg px-2.5 py-1 text-xs outline-none"
            >
              <option value="pratt">Pratt Method (Include Zero Differences)</option>
              <option value="wilcox">Wilcoxon Original (Discard Zeros)</option>
            </select>
          </div>

          <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl flex items-center justify-between">
            <span className="font-semibold text-white">p-Value Method</span>
            <select
              value={pValueMethod}
              onChange={(e) => setPValueMethod(e.target.value as any)}
              className="bg-quantara-900 border border-quantara-700 text-white rounded-lg px-2.5 py-1 text-xs outline-none"
            >
              <option value="automatic">Automatic (Sample Size Rule)</option>
              <option value="exact">Exact Test</option>
              <option value="asymptotic">Asymptotic Approximation</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-quantara-400">
          Matched pairs effect size r = Z / √N calculated deterministically.
        </div>

        <Button
          onClick={handleRun}
          disabled={!var1 || !var2 || var1 === var2 || isSubmitting}
          variant="primary"
          size="lg"
          className="flex items-center gap-2 shadow-xl px-6"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isSubmitting ? 'Calculating Wilcoxon Test...' : 'Run Wilcoxon Signed-Rank Test'}</span>
        </Button>
      </div>
    </div>
  );
};
