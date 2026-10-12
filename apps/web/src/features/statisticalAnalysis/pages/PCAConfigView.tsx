import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { VariableSelector } from '../components/VariableSelector';
import { Sliders, Layers, Info, CheckCircle2, AlertTriangle, ShieldCheck, Database, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface PCAConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const PCAConfigView: React.FC<PCAConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>([
    'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18'
  ]);

  // Options State
  const [standardize, setStandardize] = useState<boolean>(true);
  const [retentionMethod, setRetentionMethod] = useState<'eigenvalue_gt_1' | 'fixed' | 'scree' | 'parallel_analysis'>('eigenvalue_gt_1');
  const [numberOfComponents, setNumberOfComponents] = useState<number>(3);
  const [rotationMethod, setRotationMethod] = useState<'varimax' | 'none' | 'quartimax' | 'equamax' | 'oblimin' | 'promax'>('varimax');
  const [kmoDiagnostic, setKmoDiagnostic] = useState<boolean>(true);
  const [bartlettDiagnostic, setBartlettDiagnostic] = useState<boolean>(true);
  const [antiImageDiagnostic, setAntiImageDiagnostic] = useState<boolean>(false);
  const [factorScoresEnabled, setFactorScoresEnabled] = useState<boolean>(true);
  const [factorScoresMethod, setFactorScoresMethod] = useState<'regression' | 'bartlett' | 'anderson_rubin'>('regression');

  const isValid = selectedVariables.length >= 3;

  const handleRun = () => {
    if (!isValid) return;

    onRunAnalysis({
      procedure: 'pca',
      title: `PCA — ${selectedVariables.length} Items (${rotationMethod.toUpperCase()} Rotation)`,
      variables: selectedVariables,
      options: {
        extractionMethod: 'pca',
        standardizeVariables: standardize,
        retentionMethod,
        numberOfFactors: retentionMethod === 'fixed' ? numberOfComponents : 3,
        rotationMethod,
        kmoDiagnostic,
        bartlettDiagnostic,
        antiImageDiagnostic,
        factorScoresEnabled,
        factorScoresMethod,
      },
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-quantara-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 uppercase tracking-wider">
              Dimension Reduction (Module 11)
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Principal Component Analysis (PCA)</h1>
          </div>
          <p className="text-xs text-quantara-400 mt-1">
            Data reduction and variance summarization into uncorrelated linear components
          </p>
        </div>
      </div>

      {/* Educational Conceptual Distinction Tooltip Banner */}
      <div className="p-4 bg-blue-950/40 border border-blue-800/80 rounded-xl text-xs text-blue-200 space-y-1.5 leading-relaxed">
        <div className="font-bold text-blue-300 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-400" />
          PCA Conceptual Framework
        </div>
        <p>
          PCA creates linear components that summarize total observed variance across items.
          It differs from EFA, which models unobserved latent factors explaining shared covariance.
        </p>
      </div>

      {/* Variable Selection Section */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" /> Select Analysis Items (Numeric / Scale Variables)
        </h3>

        <VariableSelector
          availableVariables={availableVariables}
          selectedVariableNames={selectedVariables}
          onChangeSelected={setSelectedVariables}
        />

        {/* Validation Warnings */}
        {!isValid && (
          <div className="p-3 bg-amber-950/50 border border-amber-800/80 rounded-xl text-xs text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>At least 3 numeric/scale variables are required for Principal Component Analysis.</span>
          </div>
        )}

        {/* Sample Adequacy Indicator */}
        <div className="text-xs font-mono text-quantara-400 bg-quantara-950 p-3 rounded-xl border border-quantara-800 flex flex-wrap items-center justify-between gap-3">
          <div>Selected Variables: <span className="text-white font-bold">{selectedVariables.length}</span></div>
          <div>Sample Observations: <span className="text-white font-bold">482</span></div>
          <div>Ratio: <span className="text-blue-400 font-bold">{(482 / Math.max(selectedVariables.length, 1)).toFixed(1)}</span> cases/variable</div>
        </div>
      </div>

      {/* Extraction & Retention Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Retention Criterion */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" /> Component Retention Rule
          </h3>

          <div className="space-y-2.5 text-xs text-quantara-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="retention"
                checked={retentionMethod === 'eigenvalue_gt_1'}
                onChange={() => setRetentionMethod('eigenvalue_gt_1')}
                className="text-blue-500 focus:ring-0"
              />
              <span>Eigenvalue &gt; 1.0 (Kaiser Criterion)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="retention"
                checked={retentionMethod === 'fixed'}
                onChange={() => setRetentionMethod('fixed')}
                className="text-blue-500 focus:ring-0"
              />
              <span>Fixed Number of Components</span>
            </label>

            {retentionMethod === 'fixed' && (
              <div className="ml-6 flex items-center gap-2">
                <span className="text-quantara-400">Number of components:</span>
                <input
                  type="number"
                  min={1}
                  max={selectedVariables.length || 18}
                  value={numberOfComponents}
                  onChange={(e) => setNumberOfComponents(parseInt(e.target.value) || 1)}
                  className="w-16 bg-quantara-950 border border-quantara-700 text-white rounded px-2 py-1 text-xs font-mono"
                />
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="retention"
                checked={retentionMethod === 'scree'}
                onChange={() => setRetentionMethod('scree')}
                className="text-blue-500 focus:ring-0"
              />
              <span>Scree Plot Elbow Inspection</span>
            </label>
          </div>

          <div className="pt-2 border-t border-quantara-800 flex items-center justify-between text-xs text-quantara-300">
            <span>Standardize Variables (Z-score)</span>
            <input
              type="checkbox"
              checked={standardize}
              onChange={(e) => setStandardize(e.target.checked)}
              className="rounded border-quantara-700 text-blue-500 focus:ring-0"
            />
          </div>
        </div>

        {/* Rotation & Diagnostics */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Rotation & Diagnostics
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-quantara-300 mb-1 font-medium">Component Rotation Method</label>
              <select
                value={rotationMethod}
                onChange={(e) => setRotationMethod(e.target.value as any)}
                className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2 font-mono text-xs outline-none focus:border-blue-500"
              >
                <optgroup label="Orthogonal (Uncorrelated Components)">
                  <option value="varimax">Varimax (Maximal Variance — Default)</option>
                  <option value="quartimax">Quartimax</option>
                  <option value="equamax">Equamax</option>
                  <option value="none">None (Unrotated Component Matrix)</option>
                </optgroup>
                <optgroup label="Oblique (Correlated Components)">
                  <option value="oblimin">Direct Oblimin</option>
                  <option value="promax">Promax</option>
                </optgroup>
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-quantara-800 text-quantara-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={kmoDiagnostic}
                  onChange={(e) => setKmoDiagnostic(e.target.checked)}
                  className="rounded border-quantara-700 text-blue-500"
                />
                <span>Calculate Kaiser-Meyer-Olkin (KMO) Measure</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bartlettDiagnostic}
                  onChange={(e) => setBartlettDiagnostic(e.target.checked)}
                  className="rounded border-quantara-700 text-blue-500"
                />
                <span>Bartlett's Test of Sphericity</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-quantara-400 font-mono">
          Deterministic OLS component extraction & rotation
        </div>

        <Button
          onClick={handleRun}
          disabled={!isValid || isSubmitting}
          variant="primary"
          size="lg"
          className="flex items-center gap-2 shadow-xl px-6"
        >
          {isSubmitting ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Sparkles className="w-4 h-4 text-blue-300" />
          )}
          Run Principal Component Analysis
        </Button>
      </div>
    </div>
  );
};
