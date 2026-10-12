import React, { useState, useMemo } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { Sliders, Database, Layers, CheckCircle2, AlertCircle, Info, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface DiscriminantConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const DiscriminantConfigView: React.FC<DiscriminantConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  // Grouping Variable State
  const [groupingVariable, setGroupingVariable] = useState<string>('sex');
  const [isFromClusterSolution, setIsFromClusterSolution] = useState<boolean>(false);

  // Predictor Variables State
  const [selectedPredictors, setSelectedPredictors] = useState<string[]>([
    'age',
    'income',
    'satisfaction',
    'waiting_time',
    'service_quality',
  ]);

  // Model Options
  const [priorMethod, setPriorMethod] = useState<'equal' | 'proportional' | 'custom'>('equal');
  const [customPriors, setCustomPriors] = useState<Record<string, string>>({
    'Group 1': '0.33',
    'Group 2': '0.33',
    'Group 3': '0.34',
  });
  const [missingMethod, setMissingMethod] = useState<'listwise' | 'available_case'>('listwise');
  const [validation, setValidation] = useState<'none' | 'cross_validation' | 'leave_one_out'>('leave_one_out');

  // Diagnostic & Output Options
  const [boxMTest, setBoxMTest] = useState<boolean>(true);
  const [structureMatrix, setStructureMatrix] = useState<boolean>(true);
  const [caseLevelClassification, setCaseLevelClassification] = useState<boolean>(true);
  const [groupCentroids, setGroupCentroids] = useState<boolean>(true);

  // Save Options
  const [saveClassification, setSaveClassification] = useState<boolean>(true);
  const [saveDiscriminantScores, setSaveDiscriminantScores] = useState<boolean>(true);

  // Search filter for predictors
  const [predictorSearch, setPredictorSearch] = useState('');

  // Eligible predictors (must be numeric / scale or integer / float and not equal to grouping variable)
  const eligiblePredictors = useMemo(() => {
    return availableVariables.filter(
      (v) => v.name !== groupingVariable && (v.dataType === 'integer' || v.dataType === 'float' || v.measure === 'scale' || v.measure === 'ordinal')
    );
  }, [availableVariables, groupingVariable]);

  // Detected group count for active grouping variable
  const detectedGroupCount = useMemo(() => {
    if (groupingVariable === 'education') return 5;
    if (groupingVariable === 'sex') return 2;
    if (groupingVariable === 'treatment_type') return 3;
    if (groupingVariable === 'region') return 4;
    return 3;
  }, [groupingVariable]);

  const togglePredictor = (varName: string) => {
    setSelectedPredictors((prev) =>
      prev.includes(varName) ? prev.filter((v) => v !== varName) : [...prev, varName]
    );
  };

  const selectAllPredictors = () => {
    setSelectedPredictors(eligiblePredictors.map((v) => v.name));
  };

  const clearAllPredictors = () => {
    setSelectedPredictors([]);
  };

  // Validation before running
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (!groupingVariable) {
      errors.push('Please select a categorical grouping variable.');
    }
    if (selectedPredictors.length === 0) {
      errors.push('Please select at least one numeric predictor variable.');
    }
    if (selectedPredictors.includes(groupingVariable)) {
      errors.push('Grouping variable cannot also be included in predictor variables.');
    }
    if (detectedGroupCount < 2) {
      errors.push('Discriminant Analysis requires a grouping variable with at least 2 distinct groups.');
    }
    if (priorMethod === 'custom') {
      const sum = Object.values(customPriors).reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
      if (Math.abs(sum - 1.0) > 0.02) {
        errors.push(`Custom prior probabilities must sum to 1.0 (Current sum: ${sum.toFixed(2)}).`);
      }
    }
    return errors;
  }, [groupingVariable, selectedPredictors, detectedGroupCount, priorMethod, customPriors]);

  const handleRun = () => {
    if (validationErrors.length > 0) return;

    onRunAnalysis({
      procedure: 'discriminant',
      title: `Discriminant Analysis — ${groupingVariable} by ${selectedPredictors.join(', ')}`,
      variables: selectedPredictors,
      groupingVariables: [groupingVariable],
      options: {
        discriminantProcedure: detectedGroupCount > 2 ? 'multiple_discriminant' : 'linear_discriminant',
        groupingVariable,
        predictorVariables: selectedPredictors,
        priorMethod,
        missingMethod,
        validation,
        saveClassification,
        saveDiscriminantScores,
        boxMTest,
        structureMatrix,
        caseLevelClassification,
        groupCentroids,
      },
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-950/80 border border-violet-800 text-violet-400 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Discriminant Analysis (LDA & Multiple DA)</h2>
            <p className="text-xs text-quantara-400 font-sans">
              Module 14 — Classify observations, compute canonical discriminant functions, Wilks' Lambda, group centroids, and cross-validated confusion matrices.
            </p>
          </div>
        </div>
      </div>

      {/* Cluster Solution Integration Warning */}
      {isFromClusterSolution && (
        <div className="p-4 bg-purple-950/40 border border-purple-800/80 rounded-xl text-xs text-purple-200 flex items-start gap-2.5 font-medium">
          <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block">Using Module 13 Cluster Analysis Membership</span>
            Discriminant Analysis will treat stored cluster assignments as observed class labels to derive discriminant classification functions and evaluate cluster separability.
          </div>
        </div>
      )}

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Grouping Variable & Predictors */}
        <div className="space-y-6">
          {/* 1. Grouping Variable Box */}
          <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-violet-400" /> Grouping / Target Variable (1 Required)
              </h3>
              <span className="text-[10px] font-mono text-quantara-400">Categorical</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-quantara-300 mb-1.5">Select Grouping Variable</label>
              <select
                value={groupingVariable}
                onChange={(e) => {
                  setGroupingVariable(e.target.value);
                  setIsFromClusterSolution(false);
                }}
                className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-xl p-2.5 text-xs outline-none focus:border-violet-500 font-semibold"
              >
                {availableVariables.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} {v.label ? `— (${v.label})` : ''} [{v.measure}]
                  </option>
                ))}
              </select>
            </div>

            {/* Group Summary Box */}
            <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between text-quantara-400">
                <span>Detected Groups:</span>
                <span className="text-white font-bold">{detectedGroupCount} distinct categories</span>
              </div>
              <div className="flex justify-between text-quantara-400">
                <span>Valid Observations:</span>
                <span className="text-white font-bold">1,842 cases</span>
              </div>
              <div className="flex justify-between text-quantara-400">
                <span>Max Discriminant Functions:</span>
                <span className="text-violet-400 font-bold">{Math.min(selectedPredictors.length, Math.max(1, detectedGroupCount - 1))}</span>
              </div>
            </div>

            {/* Quick Button to use Cluster Membership */}
            <button
              onClick={() => {
                setGroupingVariable('education');
                setIsFromClusterSolution(true);
              }}
              className="w-full py-2 bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800/80 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Use Module 13 Saved Cluster Solution
            </button>
          </div>

          {/* 2. Predictor Variables Box */}
          <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" /> Predictor Variables ({selectedPredictors.length} Selected)
              </h3>
              <div className="flex gap-2 text-[11px]">
                <button onClick={selectAllPredictors} className="text-blue-400 hover:text-blue-300 font-semibold">Select All</button>
                <span className="text-quantara-600">|</span>
                <button onClick={clearAllPredictors} className="text-quantara-400 hover:text-white font-semibold">Clear</button>
              </div>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Filter predictor variables..."
              value={predictorSearch}
              onChange={(e) => setPredictorSearch(e.target.value)}
              className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-xl p-2 text-xs outline-none focus:border-blue-500 font-medium"
            />

            {/* Predictor List */}
            <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
              {eligiblePredictors
                .filter((v) => !predictorSearch || v.name.toLowerCase().includes(predictorSearch.toLowerCase()) || (v.label || '').toLowerCase().includes(predictorSearch.toLowerCase()))
                .map((v) => (
                  <label
                    key={v.name}
                    className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition ${
                      selectedPredictors.includes(v.name)
                        ? 'bg-blue-950/60 border-blue-700 text-white'
                        : 'bg-quantara-950 border-quantara-800/80 text-quantara-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <input
                        type="checkbox"
                        checked={selectedPredictors.includes(v.name)}
                        onChange={() => togglePredictor(v.name)}
                        className="rounded border-quantara-700 text-blue-500"
                      />
                      <span className="font-bold font-mono">{v.name}</span>
                      {v.label && <span className="text-quantara-400 truncate">({v.label})</span>}
                    </div>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-quantara-900 border border-quantara-700 text-quantara-400">
                      {v.measure}
                    </span>
                  </label>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Model Options & Validation */}
        <div className="space-y-6">
          {/* 3. Model Specifications Box */}
          <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-quantara-800 pb-3">
              Model Specifications & Prior Probabilities
            </h3>

            {/* Prior Probabilities */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-quantara-300">Prior Probabilities</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPriorMethod('equal')}
                  className={`p-2 rounded-xl border text-xs font-semibold transition ${
                    priorMethod === 'equal' ? 'bg-violet-600 text-white shadow border-violet-500' : 'bg-quantara-950 border-quantara-700 text-quantara-400 hover:text-white'
                  }`}
                >
                  Equal
                </button>
                <button
                  onClick={() => setPriorMethod('proportional')}
                  className={`p-2 rounded-xl border text-xs font-semibold transition ${
                    priorMethod === 'proportional' ? 'bg-violet-600 text-white shadow border-violet-500' : 'bg-quantara-950 border-quantara-700 text-quantara-400 hover:text-white'
                  }`}
                >
                  Proportional
                </button>
                <button
                  onClick={() => setPriorMethod('custom')}
                  className={`p-2 rounded-xl border text-xs font-semibold transition ${
                    priorMethod === 'custom' ? 'bg-violet-600 text-white shadow border-violet-500' : 'bg-quantara-950 border-quantara-700 text-quantara-400 hover:text-white'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {/* Validation Strategy */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-quantara-300">Validation & Accuracy Strategy</label>
              <select
                value={validation}
                onChange={(e) => setValidation(e.target.value as any)}
                className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-xl p-2 text-xs outline-none focus:border-violet-500"
              >
                <option value="leave_one_out">Leave-One-Out Cross-Validation (Jackknife)</option>
                <option value="cross_validation">10-Fold Cross Validation</option>
                <option value="none">Original Sample Only (No Validation)</option>
              </select>
            </div>

            {/* Missing Data Strategy */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-quantara-300">Missing Data Handling</label>
              <select
                value={missingMethod}
                onChange={(e) => setMissingMethod(e.target.value as any)}
                className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-xl p-2 text-xs outline-none focus:border-violet-500"
              >
                <option value="listwise">Listwise Deletion (Recommended)</option>
                <option value="available_case">Pairwise / Available Case</option>
              </select>
            </div>
          </div>

          {/* 4. Diagnostic & Saving Options */}
          <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-quantara-800 pb-3">
              Diagnostics & Output Variables
            </h3>

            <div className="space-y-2 text-xs text-quantara-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={boxMTest}
                  onChange={(e) => setBoxMTest(e.target.checked)}
                  className="rounded border-quantara-700 text-violet-500"
                />
                <span>Include Box's M Test of Equality of Covariance Matrices</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={structureMatrix}
                  onChange={(e) => setStructureMatrix(e.target.checked)}
                  className="rounded border-quantara-700 text-violet-500"
                />
                <span>Include Structure Matrix & Standardized Coefficients</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={caseLevelClassification}
                  onChange={(e) => setCaseLevelClassification(e.target.checked)}
                  className="rounded border-quantara-700 text-violet-500"
                />
                <span>Include Case-Level Posterior Probabilities & Diagnostics</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveClassification}
                  onChange={(e) => setSaveClassification(e.target.checked)}
                  className="rounded border-quantara-700 text-violet-500"
                />
                <span>Save Predicted Group & Posterior Probabilities to Dataset</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveDiscriminantScores}
                  onChange={(e) => setSaveDiscriminantScores(e.target.checked)}
                  className="rounded border-quantara-700 text-violet-500"
                />
                <span>Save Canonical Discriminant Function Scores (D1, D2) to Dataset</span>
              </label>
            </div>
          </div>

          {/* Validation Warnings Box */}
          {validationErrors.length > 0 && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-xl space-y-1.5 text-xs text-rose-300">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-400" /> Cannot Run Discriminant Analysis
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Execution Action Button */}
          <Button
            onClick={handleRun}
            disabled={isSubmitting || validationErrors.length > 0}
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-center gap-2 shadow-2xl py-3 font-bold text-sm"
          >
            {isSubmitting ? (
              <span>Fitting Discriminant Model...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Run Discriminant Analysis
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
