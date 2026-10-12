import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { VariableSelector } from '../components/VariableSelector';
import { Layers, Play, RefreshCw, BarChart2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface ExploreConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const ExploreConfigView: React.FC<ExploreConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [dependentVars, setDependentVars] = useState<string[]>(['income']);
  const [groupingVars, setGroupingVars] = useState<string[]>(['sex']);

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRun = () => {
    if (dependentVars.length === 0) {
      setValidationError('Select at least one dependent variable for Explore procedure.');
      return;
    }

    setValidationError(null);
    onRunAnalysis({
      procedure: 'explore',
      title: `Explore — ${dependentVars.join(', ')} by ${groupingVars.join(', ') || 'All Cases'}`,
      variables: dependentVars,
      groupingVariables: groupingVars,
      options: {},
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6 font-sans">
      <div className="border-b border-quantara-800 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            Explore & Grouped Summaries Procedure
          </h2>
          <p className="text-xs text-quantara-400 mt-0.5">
            Examine numeric distributions broken down by factor groups (e.g. Income by Sex, Age by Education).
          </p>
        </div>

        <Button
          onClick={handleRun}
          disabled={isSubmitting || dependentVars.length === 0}
          variant="primary"
          size="sm"
          className="flex items-center gap-2 shadow-lg"
        >
          {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          {isSubmitting ? 'Running Explore...' : 'Run Explore'}
        </Button>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold">
          {validationError}
        </div>
      )}

      {/* Dependent Variables */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          1. Select Dependent Numeric Variable(s)
        </h3>
        <VariableSelector
          availableVariables={availableVariables}
          selectedVariableNames={dependentVars}
          onChangeSelected={setDependentVars}
          targetLabel="Dependent Numeric Variables"
          allowCategoricalWarning={true}
        />
      </div>

      {/* Factor Grouping Variable */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          2. Select Grouping Factor Variable (Optional Breakdown)
        </h3>
        <VariableSelector
          availableVariables={availableVariables}
          selectedVariableNames={groupingVars}
          onChangeSelected={setGroupingVars}
          targetLabel="Factor / Grouping Variable"
          allowCategoricalWarning={false}
        />
      </div>
    </div>
  );
};
