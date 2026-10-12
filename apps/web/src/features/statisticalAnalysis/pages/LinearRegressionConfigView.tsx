import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { Play, LineChart, Plus, Trash2, Sliders, CheckCircle2, AlertTriangle, ShieldCheck, Calculator } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface LinearRegressionConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const LinearRegressionConfigView: React.FC<LinearRegressionConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const numericVars = availableVariables.filter((v) => v.measure === 'scale' || v.dataType === 'integer' || v.dataType === 'float');

  const [dependentVariable, setDependentVariable] = useState<string>('income');
  const [selectedPredictors, setSelectedPredictors] = useState<string[]>(['age', 'experience', 'education']);
  const [includeIntercept, setIncludeIntercept] = useState<boolean>(true);
  const [confidenceInterval, setConfidenceInterval] = useState<number>(95);
  const [collinearityDiagnostics, setCollinearityDiagnostics] = useState<boolean>(true);
  const [residualDiagnostics, setResidualDiagnostics] = useState<boolean>(true);
  const [influenceDiagnostics, setInfluenceDiagnostics] = useState<boolean>(true);
  const [showPlots, setShowPlots] = useState<boolean>(true);

  // Validation checks
  const depVarObj = availableVariables.find((v) => v.name === dependentVariable);
  const isDepVarNumeric = depVarObj ? depVarObj.measure === 'scale' || depVarObj.dataType === 'integer' || depVarObj.dataType === 'float' : true;

  const numPredictors = selectedPredictors.length;
  const isMultiple = numPredictors >= 2;
  const isSimple = numPredictors === 1;

  const handleAddPredictor = (varName: string) => {
    if (!selectedPredictors.includes(varName) && varName !== dependentVariable) {
      setSelectedPredictors([...selectedPredictors, varName]);
    }
  };

  const handleRemovePredictor = (varName: string) => {
    setSelectedPredictors(selectedPredictors.filter((p) => p !== varName));
  };

  const handleRun = () => {
    if (!dependentVariable || numPredictors === 0 || !isDepVarNumeric) return;

    onRunAnalysis({
      procedure: 'linear_regression',
      title: `${isMultiple ? 'Multiple' : 'Simple'} Linear Regression — ${dependentVariable} on ${selectedPredictors.join(', ')}`,
      variables: [dependentVariable, ...selectedPredictors],
      options: {
        dependentVariable,
        predictors: selectedPredictors,
        includeIntercept,
        confidenceInterval,
        collinearityDiagnostics,
        residualDiagnostics,
        influenceDiagnostics,
        showPlots,
      },
    });
  };

  const availableToAdd = availableVariables.filter((v) => v.name !== dependentVariable && !selectedPredictors.includes(v.name));

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 font-sans">
      {/* Header Title */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-950 border border-blue-800 text-blue-400 rounded-xl">
            <LineChart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Linear & Multiple Linear Regression</h1>
            <p className="text-xs text-quantara-400 mt-0.5">
              Fit OLS regression models with ANOVA fit test, coefficients, VIF collinearity & residual diagnostics
            </p>
          </div>
        </div>

        {/* Model Classification Tag */}
        <div className="flex items-center gap-2">
          {isSimple && (
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800 shadow flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" /> Simple Linear Regression (1 Predictor)
            </span>
          )}
          {isMultiple && (
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800 shadow flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> Multiple Linear Regression ({numPredictors} Predictors)
            </span>
          )}
        </div>
      </div>

      {/* Model Formula Preview Banner */}
      <div className="p-4 bg-quantara-950 border border-quantara-800 rounded-xl flex items-center justify-between gap-4 font-mono text-xs text-quantara-200">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>
            Model Specification: <strong className="text-white">ŷ_{dependentVariable || 'Outcome'}</strong> = {includeIntercept ? 'β₀ + ' : ''}
            {selectedPredictors.length > 0
              ? selectedPredictors.map((p, idx) => `β${idx + 1}(${p})`).join(' + ')
              : '[Add Predictors]'} + ε
          </span>
        </div>
      </div>

      {/* Dependent & Independent Variable Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dependent Variable Selector */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
          <label className="text-xs font-bold text-white uppercase tracking-wider block">
            1. Dependent Variable (Continuous Outcome)
          </label>
          <select
            value={dependentVariable}
            onChange={(e) => {
              setDependentVariable(e.target.value);
              setSelectedPredictors(selectedPredictors.filter((p) => p !== e.target.value));
            }}
            className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500"
          >
            {availableVariables.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.label || v.measure})
              </option>
            ))}
          </select>

          {!isDepVarNumeric && (
            <div className="p-3 bg-amber-950/60 border border-amber-800 text-amber-300 rounded-xl text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                This regression procedure requires a numeric continuous dependent variable. For categorical outcomes, use Logistic Regression when available.
              </span>
            </div>
          )}
        </div>

        {/* Independent Variables (Predictors) */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white uppercase tracking-wider block">
              2. Predictors / Independent Variables ({selectedPredictors.length})
            </label>
          </div>

          {/* Predictors List */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {selectedPredictors.map((pred) => (
              <div
                key={pred}
                className="p-2.5 bg-quantara-950 border border-quantara-800 rounded-xl flex items-center justify-between text-xs text-white"
              >
                <span className="font-semibold">{pred}</span>
                <button
                  onClick={() => handleRemovePredictor(pred)}
                  className="p-1 hover:bg-rose-950 text-quantara-400 hover:text-rose-400 rounded transition"
                  title="Remove predictor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {selectedPredictors.length === 0 && (
              <div className="p-4 border border-dashed border-quantara-700 rounded-xl text-center text-xs text-quantara-400">
                Add at least one predictor variable below to estimate regression model.
              </div>
            )}
          </div>

          {/* Add Predictor Dropdown */}
          {availableToAdd.length > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t border-quantara-800">
              <select
                id="add-pred-select"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddPredictor(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="flex-1 bg-quantara-950 border border-quantara-700 text-quantara-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-blue-500"
              >
                <option value="" disabled>
                  + Select variable to add as predictor...
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
      </div>

      {/* Model Options & Diagnostics Toggles */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <label className="text-xs font-bold text-white uppercase tracking-wider block flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" /> Model Options & Residual Diagnostics
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Intercept Toggle */}
          <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-white">
              <input
                type="checkbox"
                checked={includeIntercept}
                onChange={(e) => setIncludeIntercept(e.target.checked)}
                className="rounded border-quantara-700 text-blue-500 focus:ring-0"
              />
              <span>Include Constant / Intercept (β₀)</span>
            </label>
            {!includeIntercept && (
              <p className="text-[11px] text-amber-400 pl-6">
                Removing the intercept changes model interpretation and $R^2$ baseline. Use only when scientifically justified.
              </p>
            )}
          </div>

          {/* Confidence Level */}
          <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl flex items-center justify-between">
            <span className="font-semibold text-white">Confidence Interval Level</span>
            <select
              value={confidenceInterval}
              onChange={(e) => setConfidenceInterval(Number(e.target.value))}
              className="bg-quantara-900 border border-quantara-700 text-white rounded-lg px-2.5 py-1 text-xs outline-none"
            >
              <option value={90}>90% CI</option>
              <option value={95}>95% CI (Default)</option>
              <option value={99}>99% CI</option>
            </select>
          </div>

          {/* Collinearity Diagnostics (VIF) */}
          <label className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl flex items-center gap-2 cursor-pointer text-white font-semibold">
            <input
              type="checkbox"
              checked={collinearityDiagnostics}
              onChange={(e) => setCollinearityDiagnostics(e.target.checked)}
              className="rounded border-quantara-700 text-blue-500 focus:ring-0"
            />
            <span>Collinearity Diagnostics (Tolerance & VIF)</span>
          </label>

          {/* Residual & Outlier Influence Diagnostics */}
          <label className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl flex items-center gap-2 cursor-pointer text-white font-semibold">
            <input
              type="checkbox"
              checked={influenceDiagnostics}
              onChange={(e) => setInfluenceDiagnostics(e.target.checked)}
              className="rounded border-quantara-700 text-blue-500 focus:ring-0"
            />
            <span>Outlier & Influence Diagnostics (Cook's D, Leverage)</span>
          </label>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-quantara-400">
          Listwise missing value strategy applied by default.
        </div>

        <Button
          onClick={handleRun}
          disabled={!dependentVariable || numPredictors === 0 || !isDepVarNumeric || isSubmitting}
          variant="primary"
          size="lg"
          className="flex items-center gap-2 shadow-xl px-6"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isSubmitting ? 'Estimating Regression Model...' : 'Run Linear Regression'}</span>
        </Button>
      </div>
    </div>
  );
};
