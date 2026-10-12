import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { VariableSelector } from '../components/VariableSelector';
import { Play, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface OneSampleTTestConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const OneSampleTTestConfigView: React.FC<OneSampleTTestConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>(['income']);
  const [testValue, setTestValue] = useState<number>(65000);
  const [tail, setTail] = useState<'two_sided' | 'less' | 'greater'>('two_sided');
  const [confidenceInterval, setConfidenceInterval] = useState<number>(95);
  const [missingStrategy, setMissingStrategy] = useState<'pairwise' | 'listwise'>('pairwise');
  const [effectSize, setEffectSize] = useState<boolean>(true);
  const [assumptionChecks, setAssumptionChecks] = useState<boolean>(true);

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRun = () => {
    if (selectedVariables.length === 0) {
      setValidationError('Select at least ONE numeric test variable to run One-Sample t-Test.');
      return;
    }
    if (testValue === undefined || isNaN(testValue)) {
      setValidationError('Specify a valid numeric test value (μ₀) to compare against.');
      return;
    }

    setValidationError(null);
    onRunAnalysis({
      procedure: 'one_sample_ttest',
      title: `One-Sample t-Test — ${selectedVariables.join(', ')} (Test Value = ${testValue})`,
      variables: selectedVariables,
      options: {
        testType: 'one_sample',
        testValue,
        tail,
        confidenceInterval,
        missingStrategy,
        effectSize,
        assumptionChecks,
      },
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6 font-sans">
      <div className="border-b border-quantara-800 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-400" />
            One-Sample t-Test Procedure Configuration
          </h2>
          <p className="text-xs text-quantara-400 mt-0.5">
            Test whether the population mean of a numeric variable differs from a specified test value (&mu;&thinsp;&₀).
          </p>
        </div>

        <Button
          onClick={handleRun}
          disabled={isSubmitting || selectedVariables.length === 0}
          variant="primary"
          size="sm"
          className="flex items-center gap-2 shadow-lg"
        >
          {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          {isSubmitting ? 'Calculating t-Test...' : 'Run Procedure'}
        </Button>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* 1. Variable Selector */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          1. Select Numeric Test Variable(s)
        </h3>
        <VariableSelector
          availableVariables={availableVariables}
          selectedVariableNames={selectedVariables}
          onChangeSelected={setSelectedVariables}
          targetLabel="Test Variables"
          allowCategoricalWarning={true}
        />
      </div>

      {/* 2. Test Value & Options */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-quantara-800 pb-2">
          2. Test Value & Hypothesis Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
          {/* Test Value Input */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-3">
            <div className="font-bold text-blue-400 uppercase text-[10px]">Hypothesized Test Value (&mu;&thinsp;&₀)</div>
            <div>
              <label className="block text-quantara-300 mb-1">Null Hypothesis Test Value</label>
              <input
                type="number"
                value={testValue}
                onChange={(e) => setTestValue(parseFloat(e.target.value) || 0)}
                className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-bold text-sm"
                placeholder="0"
              />
            </div>
          </div>

          {/* Alternative Hypothesis & CI */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-3">
            <div className="font-bold text-emerald-400 uppercase text-[10px]">Alternative Hypothesis & CI</div>

            <div>
              <label className="block text-quantara-300 mb-1">Tail (Alternative Hypothesis)</label>
              <select
                value={tail}
                onChange={(e) => setTail(e.target.value as any)}
                className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
              >
                <option value="two_sided">Two-sided (&mu; &ne; &mu;&thinsp;&₀)</option>
                <option value="less">Less than (&mu; &lt; &mu;&thinsp;&₀)</option>
                <option value="greater">Greater than (&mu; &gt; &mu;&thinsp;&₀)</option>
              </select>
            </div>

            <div>
              <label className="block text-quantara-300 mb-1">Confidence Interval Level</label>
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
          </div>

          {/* Additional Options */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-2.5">
            <div className="font-bold text-purple-400 uppercase text-[10px]">Diagnostics & Effect Size</div>

            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={effectSize}
                onChange={(e) => setEffectSize(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              Calculate Cohen's d Effect Size
            </label>

            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={assumptionChecks}
                onChange={(e) => setAssumptionChecks(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              Include Normality Diagnostics
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
