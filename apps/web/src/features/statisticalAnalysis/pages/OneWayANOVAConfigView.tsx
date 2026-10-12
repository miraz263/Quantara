import React, { useState, useEffect } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { VariableSelector } from '../components/VariableSelector';
import { Play, RefreshCw, BarChart2, Layers, CheckCircle2, ShieldAlert, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface OneWayANOVAConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const OneWayANOVAConfigView: React.FC<OneWayANOVAConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>(['income']);
  const [factorVariable, setFactorVariable] = useState<string>('education');

  // Groups list for selected factor
  const [detectedGroups, setDetectedGroups] = useState<string[]>([
    'Primary (1)',
    'Secondary (2)',
    'Higher Sec (3)',
    'Graduate (4)',
    'Postgraduate (5)',
  ]);
  const [includedGroups, setIncludedGroups] = useState<string[]>([
    'Primary (1)',
    'Secondary (2)',
    'Higher Sec (3)',
    'Graduate (4)',
    'Postgraduate (5)',
  ]);

  const [anovaMethod, setAnovaMethod] = useState<'standard' | 'welch' | 'both'>('both');
  const [postHocMethod, setPostHocMethod] = useState<'none' | 'tukey' | 'games_howell' | 'bonferroni' | 'holm'>('tukey');
  const [alpha, setAlpha] = useState<number>(0.05);
  const [confidenceInterval, setConfidenceInterval] = useState<number>(95);
  const [effectSizes, setEffectSizes] = useState<boolean>(true);
  const [homogeneityTest, setHomogeneityTest] = useState<boolean>(true);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [twoGroupNotice, setTwoGroupNotice] = useState<string | null>(null);

  // Update detected groups when factor variable changes
  useEffect(() => {
    if (factorVariable === 'education') {
      const g = ['Primary (1)', 'Secondary (2)', 'Higher Sec (3)', 'Graduate (4)', 'Postgraduate (5)'];
      setDetectedGroups(g);
      setIncludedGroups(g);
      setTwoGroupNotice(null);
    } else if (factorVariable === 'employment') {
      const g = ['Full-time', 'Part-time', 'Self-employed', 'Unemployed'];
      setDetectedGroups(g);
      setIncludedGroups(g);
      setTwoGroupNotice(null);
    } else if (factorVariable === 'sex') {
      const g = ['Male (1)', 'Female (2)'];
      setDetectedGroups(g);
      setIncludedGroups(g);
      setTwoGroupNotice('This variable contains exactly two groups. An independent-samples t-test may also be appropriate.');
    } else if (factorVariable === 'region') {
      const g = ['North', 'South', 'East', 'West'];
      setDetectedGroups(g);
      setIncludedGroups(g);
      setTwoGroupNotice(null);
    } else {
      const g = ['Group A', 'Group B', 'Group C'];
      setDetectedGroups(g);
      setIncludedGroups(g);
      setTwoGroupNotice(null);
    }
  }, [factorVariable]);

  const handleGroupToggle = (grp: string) => {
    if (includedGroups.includes(grp)) {
      if (includedGroups.length <= 2) {
        setValidationError('One-Way ANOVA requires at least TWO included groups.');
        return;
      }
      setIncludedGroups(includedGroups.filter((g) => g !== grp));
    } else {
      setIncludedGroups([...includedGroups, grp]);
    }
  };

  const handleRun = () => {
    if (selectedVariables.length === 0) {
      setValidationError('Select at least ONE numeric dependent variable.');
      return;
    }
    if (!factorVariable) {
      setValidationError('Select a categorical Factor / Grouping variable.');
      return;
    }
    if (includedGroups.length < 2) {
      setValidationError('One-Way ANOVA requires at least TWO valid groups for mean comparison.');
      return;
    }

    setValidationError(null);
    onRunAnalysis({
      procedure: 'one_way_anova',
      title: `One-Way ANOVA — ${selectedVariables.join(', ')} by ${factorVariable} (${includedGroups.length} groups)`,
      variables: selectedVariables,
      groupingVariables: [factorVariable],
      options: {
        factorVariable,
        includedGroups,
        anovaMethod,
        postHocMethod,
        alpha,
        confidenceInterval,
        effectSizes,
        homogeneityTest,
      },
    });
  };

  const categoricalVars = availableVariables.filter(
    (v) => v.measure === 'nominal' || v.measure === 'ordinal' || v.dataType === 'string' || v.name === 'sex' || v.name === 'education'
  );

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6 font-sans">
      <div className="border-b border-quantara-800 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-400" />
            One-Way ANOVA & Post-Hoc Procedure Configuration
          </h2>
          <p className="text-xs text-quantara-400 mt-0.5">
            Test for population mean differences across k &ge; 2 groups with Levene's test, Welch ANOVA & Tukey HSD / Games-Howell post-hoc.
          </p>
        </div>

        <Button
          onClick={handleRun}
          disabled={isSubmitting || selectedVariables.length === 0 || !factorVariable || includedGroups.length < 2}
          variant="primary"
          size="sm"
          className="flex items-center gap-2 shadow-lg"
        >
          {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          {isSubmitting ? 'Calculating ANOVA...' : 'Run Procedure'}
        </Button>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {twoGroupNotice && (
        <div className="p-3 bg-blue-950/60 border border-blue-800/80 text-blue-200 rounded-xl text-xs font-semibold flex items-center gap-2 font-mono">
          <AlertTriangle className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>{twoGroupNotice}</span>
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
          targetLabel="Dependent Variables"
          allowCategoricalWarning={true}
        />
      </div>

      {/* 2. Factor Variable & Group Management */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider border-b border-quantara-800 pb-2">
          2. Factor / Grouping Variable & Included Groups ({includedGroups.length} of {detectedGroups.length} selected)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
          {/* Factor Selector */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-2">
            <label className="block text-quantara-300 font-bold mb-1">Factor / Grouping Variable</label>
            <select
              value={factorVariable}
              onChange={(e) => setFactorVariable(e.target.value)}
              className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
            >
              {categoricalVars.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.label || v.name} ({v.name})
                </option>
              ))}
            </select>
          </div>

          {/* Group Checklist */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-2">
            <label className="block text-emerald-400 font-bold mb-1">Included Factor Levels / Groups</label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {detectedGroups.map((grp) => (
                <label key={grp} className="flex items-center gap-2 text-slate-200 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={includedGroups.includes(grp)}
                    onChange={() => handleGroupToggle(grp)}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <span>{grp}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Statistical Options & Post-Hoc Selector */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-quantara-800 pb-2">
          3. Variance Assumption, Post-Hoc Tests & Effect Size
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
          {/* Variance Method */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-3">
            <div className="font-bold text-blue-400 uppercase text-[10px]">ANOVA Model & Variance Assumption</div>
            <div>
              <label className="block text-quantara-300 mb-1">Variance Assumption</label>
              <select
                value={anovaMethod}
                onChange={(e) => setAnovaMethod(e.target.value as any)}
                className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
              >
                <option value="both">Report Both (Standard & Welch ANOVA)</option>
                <option value="standard">Standard Homogeneous ANOVA Only</option>
                <option value="welch">Welch ANOVA Only (Robust for Unequal Variances)</option>
              </select>
            </div>
          </div>

          {/* Post-Hoc Selector */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-3">
            <div className="font-bold text-emerald-400 uppercase text-[10px]">Post-Hoc Pairwise Procedure</div>
            <div>
              <label className="block text-quantara-300 mb-1">Post-Hoc Test Method</label>
              <select
                value={postHocMethod}
                onChange={(e) => setPostHocMethod(e.target.value as any)}
                className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
              >
                <option value="tukey">Tukey HSD (Equal Variances)</option>
                <option value="games_howell">Games-Howell (Unequal Variances)</option>
                <option value="bonferroni">Bonferroni Correction</option>
                <option value="holm">Holm Method</option>
                <option value="none">None (Omnibus Test Only)</option>
              </select>
            </div>
          </div>

          {/* Options & Effect Sizes */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-2.5">
            <div className="font-bold text-purple-400 uppercase text-[10px]">Diagnostics & Effect Sizes</div>

            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={effectSizes}
                onChange={(e) => setEffectSizes(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              Calculate Eta Squared (&eta;&sup2;) & Omega Squared (&omega;&sup2;)
            </label>

            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={homogeneityTest}
                onChange={(e) => setHomogeneityTest(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              Test Homogeneity of Variances (Levene Test)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
