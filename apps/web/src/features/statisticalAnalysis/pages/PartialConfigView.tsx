import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { VariableSelector } from '../components/VariableSelector';
import { Sliders, Play, RefreshCw, ShieldAlert } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface PartialConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const PartialConfigView: React.FC<PartialConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>(['income', 'satisfaction']);
  const [controlVariables, setControlVariables] = useState<string[]>(['age']);

  const [significanceType, setSignificanceType] = useState<'two_tailed' | 'one_tailed'>('two_tailed');

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRun = () => {
    if (selectedVariables.length < 2) {
      setValidationError('Select at least TWO target variables for Partial Correlation.');
      return;
    }
    if (controlVariables.length === 0) {
      setValidationError('Select at least ONE control variable (covariate) to control for.');
      return;
    }

    // Check overlap between target variables and control variables
    const overlap = selectedVariables.filter((v) => controlVariables.includes(v));
    if (overlap.length > 0) {
      setValidationError(`Variable "${overlap[0]}" cannot be both a target variable and a control variable.`);
      return;
    }

    setValidationError(null);
    onRunAnalysis({
      procedure: 'partial_correlation',
      title: `Partial Correlation — ${selectedVariables.join(' & ')} (Controlling for ${controlVariables.join(', ')})`,
      variables: selectedVariables,
      options: {
        controlVariables,
        significanceType,
      },
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6 font-sans">
      <div className="border-b border-quantara-800 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            Partial Correlation (Controlling for Covariates)
          </h2>
          <p className="text-xs text-quantara-400 mt-0.5">
            Measure the linear relationship between two variables after removing the linear effect of one or more control variables.
          </p>
        </div>

        <Button
          onClick={handleRun}
          disabled={isSubmitting || selectedVariables.length < 2 || controlVariables.length === 0}
          variant="primary"
          size="sm"
          className="flex items-center gap-2 shadow-lg"
        >
          {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          {isSubmitting ? 'Calculating Partial r...' : 'Run Procedure'}
        </Button>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* 1. Target Variables */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          1. Target Variables (&ge; 2)
        </h3>
        <VariableSelector
          availableVariables={availableVariables}
          selectedVariableNames={selectedVariables}
          onChangeSelected={setSelectedVariables}
          targetLabel="Target Variables"
        />
      </div>

      {/* 2. Control Variables */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          2. Control Variables (Covariates to Hold Constant &ge; 1)
        </h3>
        <VariableSelector
          availableVariables={availableVariables.filter((v) => !selectedVariables.includes(v.name))}
          selectedVariableNames={controlVariables}
          onChangeSelected={setControlVariables}
          targetLabel="Control Variables / Confounders"
        />
      </div>

      {/* 3. Significance Options */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-quantara-800 pb-2">
          3. Significance Options
        </h3>
        <div className="max-w-xs">
          <label className="block text-xs text-quantara-300 mb-1">Test of Significance</label>
          <select
            value={significanceType}
            onChange={(e) => setSignificanceType(e.target.value as any)}
            className="w-full bg-quantara-950 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
          >
            <option value="two_tailed">Two-tailed test</option>
            <option value="one_tailed">One-tailed test</option>
          </select>
        </div>
      </div>
    </div>
  );
};
