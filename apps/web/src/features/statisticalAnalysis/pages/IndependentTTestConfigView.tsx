import React, { useState, useEffect } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { VariableSelector } from '../components/VariableSelector';
import { Play, RefreshCw, Layers, CheckCircle2, ShieldAlert, AlertTriangle, HelpCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface IndependentTTestConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const IndependentTTestConfigView: React.FC<IndependentTTestConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>(['income']);
  const [groupingVariable, setGroupingVariable] = useState<string>('sex');
  const [group1, setGroup1] = useState<string>('Male (1)');
  const [group2, setGroup2] = useState<string>('Female (2)');

  const [tail, setTail] = useState<'two_sided' | 'less' | 'greater'>('two_sided');
  const [confidenceInterval, setConfidenceInterval] = useState<number>(95);
  const [equalVariance, setEqualVariance] = useState<'both' | 'assumed' | 'not_assumed'>('both');
  const [effectSize, setEffectSize] = useState<boolean>(true);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [anovaNotice, setAnovaNotice] = useState<string | null>(null);

  // Auto-detect groups based on groupingVariable selection
  useEffect(() => {
    if (groupingVariable === 'sex') {
      setGroup1('Male (1)');
      setGroup2('Female (2)');
      setAnovaNotice(null);
    } else if (groupingVariable === 'employment') {
      setGroup1('Full-time');
      setGroup2('Part-time');
      setAnovaNotice('Employment Status contains 4 groups (Full-time, Part-time, Self-employed, Unemployed). For comparison across 3+ groups, consider ANOVA.');
    } else if (groupingVariable === 'region') {
      setGroup1('North');
      setGroup2('South');
      setAnovaNotice('Geographic Region contains 4 region codes. Comparing North vs South only.');
    } else {
      setAnovaNotice(null);
    }
  }, [groupingVariable]);

  const handleRun = () => {
    if (selectedVariables.length === 0) {
      setValidationError('Select at least ONE numeric dependent variable.');
      return;
    }
    if (!groupingVariable) {
      setValidationError('Select a categorical grouping variable.');
      return;
    }
    if (!group1 || !group2) {
      setValidationError('Select exactly TWO distinct groups for comparison.');
      return;
    }
    if (group1 === group2) {
      setValidationError('Group 1 and Group 2 must be different categories.');
      return;
    }

    setValidationError(null);
    onRunAnalysis({
      procedure: 'independent_ttest',
      title: `Independent-Samples t-Test — ${selectedVariables.join(', ')} by ${groupingVariable} (${group1} vs ${group2})`,
      variables: selectedVariables,
      groupingVariables: [groupingVariable],
      options: {
        testType: 'independent',
        groupingVariable,
        group1,
        group2,
        tail,
        confidenceInterval,
        equalVariance,
        effectSize,
      },
    });
  };

  const categoricalVars = availableVariables.filter((v) => v.measure === 'nominal' || v.measure === 'ordinal' || v.dataType === 'string' || v.dataType === 'boolean' || v.name === 'sex');

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6 font-sans">
      <div className="border-b border-quantara-800 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Independent-Samples t-Test Procedure Configuration
          </h2>
          <p className="text-xs text-quantara-400 mt-0.5">
            Compare population means between two independent groups with Levene's test & Welch's t-test.
          </p>
        </div>

        <Button
          onClick={handleRun}
          disabled={isSubmitting || selectedVariables.length === 0 || !groupingVariable || group1 === group2}
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

      {anovaNotice && (
        <div className="p-3.5 bg-amber-950/60 border border-amber-800/80 text-amber-200 rounded-xl text-xs font-semibold flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{anovaNotice}</span>
        </div>
      )}

      {/* 1. Dependent Variable Selector */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          1. Select Numeric Dependent Variable(s)
        </h3>
        <VariableSelector
          availableVariables={availableVariables}
          selectedVariableNames={selectedVariables}
          onChangeSelected={setSelectedVariables}
          targetLabel="Test / Dependent Variables"
          allowCategoricalWarning={true}
        />
      </div>

      {/* 2. Grouping Variable & Two Group Selection */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-quantara-800 pb-2">
          2. Grouping Variable & Group Selection (Exactly 2 Groups Required)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
          {/* Select Grouping Var */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-2">
            <label className="block text-quantara-300 font-bold mb-1">Grouping Variable</label>
            <select
              value={groupingVariable}
              onChange={(e) => setGroupingVariable(e.target.value)}
              className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
            >
              {categoricalVars.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.label || v.name} ({v.name})
                </option>
              ))}
            </select>
          </div>

          {/* Group 1 Selection */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-2">
            <label className="block text-blue-400 font-bold mb-1">Group 1 Category</label>
            <input
              type="text"
              value={group1}
              onChange={(e) => setGroup1(e.target.value)}
              className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
            />
          </div>

          {/* Group 2 Selection */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-2">
            <label className="block text-indigo-400 font-bold mb-1">Group 2 Category</label>
            <input
              type="text"
              value={group2}
              onChange={(e) => setGroup2(e.target.value)}
              className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
            />
          </div>
        </div>

        {/* Validation Checklist */}
        <div className="p-3 bg-quantara-950/80 border border-quantara-800 rounded-xl text-xs space-y-1.5 font-mono">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Grouping variable selected: <b className="text-white font-sans">{groupingVariable}</b>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Group 1: <b className="text-white font-sans">{group1}</b> | Group 2: <b className="text-white font-sans">{group2}</b>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Exactly 2 distinct groups configured for bivariate t-test comparison.
          </div>
        </div>
      </div>

      {/* 3. Statistical Options */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-quantara-800 pb-2">
          3. Variance Assumption & Effect Size Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-3">
            <div className="font-bold text-blue-400 uppercase text-[10px]">Variance Assumptions</div>
            <select
              value={equalVariance}
              onChange={(e) => setEqualVariance(e.target.value as any)}
              className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
            >
              <option value="both">Report Both (Student & Welch's t-test)</option>
              <option value="assumed">Equal Variances Assumed Only</option>
              <option value="not_assumed">Welch's t-Test Only (Unequal Variances)</option>
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
            <div className="font-bold text-purple-400 uppercase text-[10px]">Effect Size Metrics</div>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={effectSize}
                onChange={(e) => setEffectSize(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              Calculate Cohen's d & Hedges' g
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
