import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { VariableSelector } from '../components/VariableSelector';
import { Sliders, Play, RefreshCw, BarChart2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface SpearmanConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const SpearmanConfigView: React.FC<SpearmanConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>([
    'satisfaction',
    'service_quality',
    'education',
  ]);

  const [significanceType, setSignificanceType] = useState<'two_tailed' | 'one_tailed'>('two_tailed');
  const [missingStrategy, setMissingStrategy] = useState<'pairwise' | 'listwise'>('pairwise');
  const [showAPA, setShowAPA] = useState(true);

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRun = () => {
    if (selectedVariables.length < 2) {
      setValidationError('Select at least TWO ordinal or continuous variables for Spearman Rank Correlation.');
      return;
    }

    setValidationError(null);
    onRunAnalysis({
      procedure: 'spearman',
      title: `Spearman Rank Correlation — ${selectedVariables.join(', ')}`,
      variables: selectedVariables,
      options: {
        missingStrategy,
        significanceType,
        showAPA,
      },
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6 font-sans">
      <div className="border-b border-quantara-800 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            Spearman Rank-Order Correlation (&rho;) Procedure
          </h2>
          <p className="text-xs text-quantara-400 mt-0.5">
            Non-parametric monotonic rank correlation with rank tie corrections.
          </p>
        </div>

        <Button
          onClick={handleRun}
          disabled={isSubmitting || selectedVariables.length < 2}
          variant="primary"
          size="sm"
          className="flex items-center gap-2 shadow-lg"
        >
          {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          {isSubmitting ? 'Calculating Ranks...' : 'Run Procedure'}
        </Button>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold">
          {validationError}
        </div>
      )}

      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          1. Select Ordinal or Continuous Variables (&ge; 2)
        </h3>
        <VariableSelector
          availableVariables={availableVariables}
          selectedVariableNames={selectedVariables}
          onChangeSelected={setSelectedVariables}
          targetLabel="Variables for Spearman Correlation"
          allowCategoricalWarning={true}
        />
      </div>

      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-quantara-800 pb-2">
          2. Statistical Options
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-3">
            <div className="font-bold text-blue-400 uppercase text-[10px]">Test Options</div>
            <div>
              <label className="block text-quantara-300 mb-1">Missing Data Strategy</label>
              <select
                value={missingStrategy}
                onChange={(e) => setMissingStrategy(e.target.value as any)}
                className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
              >
                <option value="pairwise">Exclude cases pairwise</option>
                <option value="listwise">Exclude cases listwise</option>
              </select>
            </div>
            <div>
              <label className="block text-quantara-300 mb-1">Significance Test</label>
              <select
                value={significanceType}
                onChange={(e) => setSignificanceType(e.target.value as any)}
                className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
              >
                <option value="two_tailed">Two-tailed</option>
                <option value="one_tailed">One-tailed</option>
              </select>
            </div>
          </div>

          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-3">
            <div className="font-bold text-purple-400 uppercase text-[10px]">Reporting</div>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={showAPA}
                onChange={(e) => setShowAPA(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              Generate APA 7th Edition Narrative
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
