import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { VariableSelector } from '../components/VariableSelector';
import { Sliders, Layers, Info, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface EFAConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const EFAConfigView: React.FC<EFAConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>([
    'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18'
  ]);

  // Options State
  const [extractionMethod, setExtractionMethod] = useState<'principal_axis' | 'maximum_likelihood'>('principal_axis');
  const [retentionMethod, setRetentionMethod] = useState<'fixed' | 'eigenvalue_gt_1' | 'scree' | 'parallel_analysis'>('fixed');
  const [numberOfFactors, setNumberOfFactors] = useState<number>(3);
  const [rotationMethod, setRotationMethod] = useState<'oblimin' | 'promax' | 'varimax' | 'none' | 'quartimax' | 'equamax'>('oblimin');
  const [kmoDiagnostic, setKmoDiagnostic] = useState<boolean>(true);
  const [bartlettDiagnostic, setBartlettDiagnostic] = useState<boolean>(true);
  const [factorScoresEnabled, setFactorScoresEnabled] = useState<boolean>(true);
  const [factorScoresMethod, setFactorScoresMethod] = useState<'regression' | 'bartlett' | 'anderson_rubin'>('regression');

  const isValid = selectedVariables.length >= 3;

  const handleRun = () => {
    if (!isValid) return;

    onRunAnalysis({
      procedure: 'efa',
      title: `EFA (${extractionMethod === 'maximum_likelihood' ? 'ML' : 'PAF'} / ${rotationMethod.toUpperCase()}) — ${selectedVariables.length} Items`,
      variables: selectedVariables,
      options: {
        extractionMethod,
        retentionMethod,
        numberOfFactors: retentionMethod === 'fixed' ? numberOfFactors : 3,
        rotationMethod,
        kmoDiagnostic,
        bartlettDiagnostic,
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
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 uppercase tracking-wider">
              Factor Analysis (Module 11)
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Exploratory Factor Analysis (EFA)</h1>
          </div>
          <p className="text-xs text-quantara-400 mt-1">
            Latent factor modeling to discover common construct dimensions underlying observed variables
          </p>
        </div>
      </div>

      {/* Educational Conceptual Distinction Tooltip Banner */}
      <div className="p-4 bg-purple-950/40 border border-purple-800/80 rounded-xl text-xs text-purple-200 space-y-1.5 leading-relaxed">
        <div className="font-bold text-purple-300 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-purple-400" />
          EFA Conceptual Framework
        </div>
        <p>
          EFA models unobserved latent factors that are intended to explain shared covariance among observed items.
          Common factor extraction (e.g. Principal Axis Factoring) excludes unique variance and measurement error.
        </p>
      </div>

      {/* Variable Selection Section */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" /> Select Analysis Items (Numeric / Scale Variables)
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
            <span>At least 3 numeric/scale variables are required for Exploratory Factor Analysis.</span>
          </div>
        )}

        {/* Sample Adequacy Indicator */}
        <div className="text-xs font-mono text-quantara-400 bg-quantara-950 p-3 rounded-xl border border-quantara-800 flex flex-wrap items-center justify-between gap-3">
          <div>Selected Variables: <span className="text-white font-bold">{selectedVariables.length}</span></div>
          <div>Sample Observations: <span className="text-white font-bold">482</span></div>
          <div>Ratio: <span className="text-purple-400 font-bold">{(482 / Math.max(selectedVariables.length, 1)).toFixed(1)}</span> cases/variable</div>
        </div>
      </div>

      {/* Extraction & Retention Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Extraction Method & Retention */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" /> Extraction & Retention
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-quantara-300 mb-1 font-medium">Factor Extraction Method</label>
              <select
                value={extractionMethod}
                onChange={(e) => setExtractionMethod(e.target.value as any)}
                className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2 font-mono text-xs outline-none focus:border-purple-500"
              >
                <option value="principal_axis">Principal Axis Factoring (PAF — Default)</option>
                <option value="maximum_likelihood">Maximum Likelihood (ML)</option>
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-quantara-800 text-quantara-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="efaRetention"
                  checked={retentionMethod === 'fixed'}
                  onChange={() => setRetentionMethod('fixed')}
                  className="text-purple-500 focus:ring-0"
                />
                <span>Fixed Number of Latent Factors</span>
              </label>

              {retentionMethod === 'fixed' && (
                <div className="ml-6 flex items-center gap-2">
                  <span className="text-quantara-400">Number of factors:</span>
                  <input
                    type="number"
                    min={1}
                    max={selectedVariables.length || 18}
                    value={numberOfFactors}
                    onChange={(e) => setNumberOfFactors(parseInt(e.target.value) || 1)}
                    className="w-16 bg-quantara-950 border border-quantara-700 text-white rounded px-2 py-1 text-xs font-mono"
                  />
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="efaRetention"
                  checked={retentionMethod === 'eigenvalue_gt_1'}
                  onChange={() => setRetentionMethod('eigenvalue_gt_1')}
                  className="text-purple-500 focus:ring-0"
                />
                <span>Eigenvalue &gt; 1.0 (Kaiser Criterion)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Rotation & Diagnostics */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Rotation & Diagnostics
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-quantara-300 mb-1 font-medium">Factor Rotation Method</label>
              <select
                value={rotationMethod}
                onChange={(e) => setRotationMethod(e.target.value as any)}
                className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2 font-mono text-xs outline-none focus:border-purple-500"
              >
                <optgroup label="Oblique (Correlated Factors — Modern Default)">
                  <option value="oblimin">Direct Oblimin (δ = 0 — Default)</option>
                  <option value="promax">Promax (κ = 4)</option>
                </optgroup>
                <optgroup label="Orthogonal (Uncorrelated Factors)">
                  <option value="varimax">Varimax</option>
                  <option value="quartimax">Quartimax</option>
                  <option value="equamax">Equamax</option>
                  <option value="none">None (Unrotated Factor Matrix)</option>
                </optgroup>
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-quantara-800 text-quantara-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={kmoDiagnostic}
                  onChange={(e) => setKmoDiagnostic(e.target.checked)}
                  className="rounded border-quantara-700 text-purple-500"
                />
                <span>Calculate KMO Measure of Sampling Adequacy</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bartlettDiagnostic}
                  onChange={(e) => setBartlettDiagnostic(e.target.checked)}
                  className="rounded border-quantara-700 text-purple-500"
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
          Deterministic Common Factor extraction & oblique/orthogonal rotation
        </div>

        <Button
          onClick={handleRun}
          disabled={!isValid || isSubmitting}
          variant="primary"
          size="lg"
          className="flex items-center gap-2 shadow-xl px-6 bg-purple-600 hover:bg-purple-500 border-purple-500"
        >
          {isSubmitting ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Sparkles className="w-4 h-4 text-purple-200" />
          )}
          Run Exploratory Factor Analysis
        </Button>
      </div>
    </div>
  );
};
