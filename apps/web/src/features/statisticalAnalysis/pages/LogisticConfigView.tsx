import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { Target, Play, Sliders, CheckCircle2, AlertTriangle, ShieldCheck, Plus, Trash2, Layers } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface LogisticConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const LogisticConfigView: React.FC<LogisticConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [logisticProcedure, setLogisticProcedure] = useState<'binary' | 'multinomial' | 'ordinal'>('binary');
  const [dependentVariable, setDependentVariable] = useState<string>('default_status');
  const [selectedPredictors, setSelectedPredictors] = useState<string[]>(['income', 'age', 'spending_score', 'loyalty_score']);
  
  // Categorical Predictors configuration
  const [categoricalVars, setCategoricalVars] = useState<Array<{ variable: string; codingMethod: 'indicator' | 'effect'; referenceCategory: string }>>([
    { variable: 'sex', codingMethod: 'indicator', referenceCategory: 'Male' },
  ]);

  const [classificationCutoff, setClassificationCutoff] = useState<number>(0.50);
  const [validation, setValidation] = useState<'none' | 'cross_validation' | 'leave_one_out'>('cross_validation');
  
  // Display & Diagnostic options
  const [includeOddsRatios, setIncludeOddsRatios] = useState<boolean>(true);
  const [includeConfidenceIntervals, setIncludeConfidenceIntervals] = useState<boolean>(true);
  const [includeROC, setIncludeROC] = useState<boolean>(true);
  const [includeCalibration, setIncludeCalibration] = useState<boolean>(true);
  const [includeMarginalEffects, setIncludeMarginalEffects] = useState<boolean>(true);
  const [includeVIF, setIncludeVIF] = useState<boolean>(true);
  const [includeInfluence, setIncludeInfluence] = useState<boolean>(true);

  // Saving options
  const [savePredictions, setSavePredictions] = useState<boolean>(true);
  const [saveProbabilities, setSaveProbabilities] = useState<boolean>(true);
  const [saveResiduals, setSaveResiduals] = useState<boolean>(false);

  const numPredictors = selectedPredictors.length;

  const handleAddPredictor = (varName: string) => {
    if (!selectedPredictors.includes(varName) && varName !== dependentVariable) {
      setSelectedPredictors([...selectedPredictors, varName]);
    }
  };

  const handleRemovePredictor = (varName: string) => {
    setSelectedPredictors(selectedPredictors.filter((p) => p !== varName));
  };

  const handleRun = () => {
    if (!dependentVariable || numPredictors === 0) return;

    onRunAnalysis({
      procedure: 'logistic_regression',
      title: `${logisticProcedure === 'binary' ? 'Binary' : logisticProcedure === 'multinomial' ? 'Multinomial' : 'Ordinal'} Logistic Regression — ${dependentVariable}`,
      variables: [dependentVariable, ...selectedPredictors],
      options: {
        logisticProcedure,
        dependentVariable,
        predictorVariables: selectedPredictors,
        categoricalPredictors: categoricalVars.map((c) => ({
          variable: c.variable,
          codingMethod: c.codingMethod as any,
          referenceCategory: c.referenceCategory,
        })),
        classificationCutoff,
        validation,
        includeOddsRatios,
        includeConfidenceIntervals,
        includeROC,
        includeCalibration,
        includeMarginalEffects,
        includeVIF,
        includeInfluence,
        savePredictions,
        saveProbabilities,
        saveResiduals,
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans p-6">
      {/* Header */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-bold rounded-lg text-xs">
              MODULE 15 — LOGISTIC REGRESSION
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-2 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" /> Logistic Regression Family Workspace
          </h2>
          <p className="text-xs text-quantara-400 mt-1">
            Fit Binary, Multinomial & Ordinal Logit models with Odds Ratios, ROC/AUC Curves, Calibration & Margins.
          </p>
        </div>

        <Button
          onClick={handleRun}
          disabled={isSubmitting || numPredictors === 0 || !dependentVariable}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-white" />
          )}
          <span>Run Logistic Analysis</span>
        </Button>
      </div>

      {/* Main Grid Setup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Procedure & Variable Selection */}
        <div className="md:col-span-2 space-y-6">
          {/* Procedure Model Type Selector */}
          <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-quantara-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" /> Procedure Specification
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setLogisticProcedure('binary')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  logisticProcedure === 'binary'
                    ? 'bg-emerald-950/80 border-emerald-600 text-white font-bold'
                    : 'bg-quantara-950 border-quantara-800 text-quantara-300 hover:bg-quantara-800'
                }`}
              >
                <span className="text-xs font-bold">Binary Logistic</span>
                <span className="text-[10px] text-quantara-400 mt-1">2 Outcome Classes ($Y \in {"{0, 1}"}$)</span>
              </button>

              <button
                onClick={() => setLogisticProcedure('multinomial')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  logisticProcedure === 'multinomial'
                    ? 'bg-emerald-950/80 border-emerald-600 text-white font-bold'
                    : 'bg-quantara-950 border-quantara-800 text-quantara-300 hover:bg-quantara-800'
                }`}
              >
                <span className="text-xs font-bold">Multinomial</span>
                <span className="text-[10px] text-quantara-400 mt-1">3+ Nominal Categories</span>
              </button>

              <button
                onClick={() => setLogisticProcedure('ordinal')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  logisticProcedure === 'ordinal'
                    ? 'bg-emerald-950/80 border-emerald-600 text-white font-bold'
                    : 'bg-quantara-950 border-quantara-800 text-quantara-300 hover:bg-quantara-800'
                }`}
              >
                <span className="text-xs font-bold">Ordinal Logit</span>
                <span className="text-[10px] text-quantara-400 mt-1">Ordered Categories (Proportional Odds)</span>
              </button>
            </div>
          </div>

          {/* Dependent Variable Selector */}
          <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-quantara-300 uppercase tracking-wider flex items-center justify-between">
              <span>Dependent Outcome Variable ($Y$)</span>
              <span className="text-emerald-400 text-[11px] font-normal">Target Outcome</span>
            </h3>
            <select
              value={dependentVariable}
              onChange={(e) => setDependentVariable(e.target.value)}
              className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 font-medium"
            >
              {availableVariables.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} {v.label ? `— ${v.label}` : ''} ({v.measure.toUpperCase()})
                </option>
              ))}
            </select>
            <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl text-[11px] text-quantara-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                Detected categories for <b>{dependentVariable}</b>: {logisticProcedure === 'binary' ? '0 (No), 1 (Yes)' : '3 categories detected'}
              </span>
            </div>
          </div>

          {/* Predictors Selector */}
          <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-quantara-300 uppercase tracking-wider">
                Predictor Variables ($X_1, X_2, \dots, X_k$)
              </h3>
              <span className="text-xs font-bold text-emerald-400">{numPredictors} selected</span>
            </div>

            <div className="flex gap-2">
              <select
                id="add-pred-select"
                className="flex-1 bg-quantara-950 border border-quantara-700 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 font-medium"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddPredictor(e.target.value);
                    e.target.value = '';
                  }
                }}
              >
                <option value="" disabled>
                  -- Select Predictor to Add --
                </option>
                {availableVariables
                  .filter((v) => v.name !== dependentVariable && !selectedPredictors.includes(v.name))
                  .map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} {v.label ? `— ${v.label}` : ''}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {selectedPredictors.map((pred) => (
                <div key={pred} className="flex items-center justify-between bg-quantara-950 border border-quantara-800 p-2.5 rounded-xl text-xs">
                  <span className="font-semibold text-white">{pred}</span>
                  <button
                    onClick={() => handleRemovePredictor(pred)}
                    className="p-1 hover:text-red-400 text-quantara-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Model Options & Cutoff */}
        <div className="space-y-6">
          {/* Classification Cutoff & Validation */}
          <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-quantara-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cutoff & Validation
            </h3>

            {logisticProcedure === 'binary' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-quantara-300">
                  <span>Classification Cutoff ($c$):</span>
                  <span className="font-mono text-emerald-400 font-bold">{classificationCutoff.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.90"
                  step="0.05"
                  value={classificationCutoff}
                  onChange={(e) => setClassificationCutoff(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 bg-quantara-950 rounded-lg cursor-pointer"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs text-quantara-300 font-semibold block">Validation Strategy:</label>
              <select
                value={validation}
                onChange={(e) => setValidation(e.target.value as any)}
                className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 font-medium"
              >
                <option value="none">Full Dataset Fit</option>
                <option value="cross_validation">10-Fold Cross-Validation (CV)</option>
                <option value="leave_one_out">Leave-One-Out (LOOCV)</option>
              </select>
            </div>
          </div>

          {/* Model Diagnostics Checkboxes */}
          <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <h3 className="text-xs font-bold text-quantara-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" /> Model Output Options
            </h3>

            <label className="flex items-center gap-2.5 text-quantara-200 cursor-pointer">
              <input type="checkbox" checked={includeOddsRatios} onChange={(e) => setIncludeOddsRatios(e.target.checked)} className="rounded border-quantara-700 text-emerald-500 focus:ring-emerald-500" />
              <span>Odds Ratios ($e^{"{\\beta}"}$) & 95% CIs</span>
            </label>

            <label className="flex items-center gap-2.5 text-quantara-200 cursor-pointer">
              <input type="checkbox" checked={includeROC} onChange={(e) => setIncludeROC(e.target.checked)} className="rounded border-quantara-700 text-emerald-500 focus:ring-emerald-500" />
              <span>ROC Curve & AUC Metric</span>
            </label>

            <label className="flex items-center gap-2.5 text-quantara-200 cursor-pointer">
              <input type="checkbox" checked={includeCalibration} onChange={(e) => setIncludeCalibration(e.target.checked)} className="rounded border-quantara-700 text-emerald-500 focus:ring-emerald-500" />
              <span>Calibration Plot & Brier Score</span>
            </label>

            <label className="flex items-center gap-2.5 text-quantara-200 cursor-pointer">
              <input type="checkbox" checked={includeMarginalEffects} onChange={(e) => setIncludeMarginalEffects(e.target.checked)} className="rounded border-quantara-700 text-emerald-500 focus:ring-emerald-500" />
              <span>Average Marginal Effects (AME)</span>
            </label>

            <label className="flex items-center gap-2.5 text-quantara-200 cursor-pointer">
              <input type="checkbox" checked={includeVIF} onChange={(e) => setIncludeVIF(e.target.checked)} className="rounded border-quantara-700 text-emerald-500 focus:ring-emerald-500" />
              <span>Multicollinearity VIF Diagnostics</span>
            </label>

            <label className="flex items-center gap-2.5 text-quantara-200 cursor-pointer">
              <input type="checkbox" checked={includeInfluence} onChange={(e) => setIncludeInfluence(e.target.checked)} className="rounded border-quantara-700 text-emerald-500 focus:ring-emerald-500" />
              <span>Cook's Distance & Leverage</span>
            </label>
          </div>

          {/* Derived Variable Saving Options */}
          <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs">
            <h3 className="text-xs font-bold text-quantara-300 uppercase tracking-wider">Save Derived Variables</h3>
            <label className="flex items-center gap-2.5 text-quantara-200 cursor-pointer">
              <input type="checkbox" checked={savePredictions} onChange={(e) => setSavePredictions(e.target.checked)} className="rounded border-quantara-700 text-emerald-500 focus:ring-emerald-500" />
              <span>Save Predicted Class Column</span>
            </label>
            <label className="flex items-center gap-2.5 text-quantara-200 cursor-pointer">
              <input type="checkbox" checked={saveProbabilities} onChange={(e) => setSaveProbabilities(e.target.checked)} className="rounded border-quantara-700 text-emerald-500 focus:ring-emerald-500" />
              <span>Save Predicted Probabilities Column</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
