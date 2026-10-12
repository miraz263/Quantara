import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { VariableSelector } from '../components/VariableSelector';
import { Sliders, Play, RefreshCw, BarChart2, Grid } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface PearsonConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const PearsonConfigView: React.FC<PearsonConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>([
    'age',
    'income',
    'satisfaction',
    'waiting_time',
    'service_quality',
  ]);

  const [missingStrategy, setMissingStrategy] = useState<'pairwise' | 'listwise'>('pairwise');
  const [significanceType, setSignificanceType] = useState<'two_tailed' | 'one_tailed'>('two_tailed');
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [triangle, setTriangle] = useState<'full' | 'lower' | 'upper'>('full');
  const [showScatterPlot, setShowScatterPlot] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showAPA, setShowAPA] = useState(true);

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRun = () => {
    if (selectedVariables.length < 2) {
      setValidationError('Select at least TWO numeric variables to calculate Pearson Correlation.');
      return;
    }

    setValidationError(null);
    onRunAnalysis({
      procedure: 'pearson',
      title: `Pearson Correlation Matrix — ${selectedVariables.join(', ')}`,
      variables: selectedVariables,
      options: {
        missingStrategy,
        significanceType,
        confidenceLevel,
        triangle,
        showScatterPlot,
        showHeatmap,
        showAPA,
      },
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6 font-sans">
      {/* Title Header */}
      <div className="border-b border-quantara-800 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            Pearson Correlation Matrix Procedure Configuration
          </h2>
          <p className="text-xs text-quantara-400 mt-0.5">
            Bivariate linear correlation coefficients (r), two-tailed/one-tailed p-values, 95% CIs & heatmap visualizer.
          </p>
        </div>

        <Button
          onClick={handleRun}
          disabled={isSubmitting || selectedVariables.length < 2}
          variant="primary"
          size="sm"
          className="flex items-center gap-2 shadow-lg"
        >
          {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          {isSubmitting ? 'Calculating Matrix...' : 'Run Procedure'}
        </Button>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold">
          {validationError}
        </div>
      )}

      {/* 1. Variable Selector */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          1. Select Numeric / Continuous Variables (&ge; 2)
        </h3>
        <VariableSelector
          availableVariables={availableVariables}
          selectedVariableNames={selectedVariables}
          onChangeSelected={setSelectedVariables}
          targetLabel="Variables for Correlation Matrix"
          allowCategoricalWarning={true}
        />
      </div>

      {/* 2. Options Grid */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-quantara-800 pb-2">
          2. Statistical Options & Output Display Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
          {/* Missing Data & Test Type */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-3">
            <div className="font-bold text-blue-400 uppercase text-[10px]">Missing Values & Significance</div>

            <div>
              <label className="block text-quantara-300 mb-1">Missing Data Strategy</label>
              <select
                value={missingStrategy}
                onChange={(e) => setMissingStrategy(e.target.value as any)}
                className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
              >
                <option value="pairwise">Exclude cases pairwise (Maximize N)</option>
                <option value="listwise">Exclude cases listwise (Strict N)</option>
              </select>
            </div>

            <div>
              <label className="block text-quantara-300 mb-1">Test of Significance</label>
              <select
                value={significanceType}
                onChange={(e) => setSignificanceType(e.target.value as any)}
                className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
              >
                <option value="two_tailed">Two-tailed test (Standard)</option>
                <option value="one_tailed">One-tailed test (Directional)</option>
              </select>
            </div>
          </div>

          {/* Matrix Triangle & CIs */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-3">
            <div className="font-bold text-emerald-400 uppercase text-[10px]">Precision & Format</div>

            <div>
              <label className="block text-quantara-300 mb-1">Confidence Interval Level</label>
              <select
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(parseInt(e.target.value) || 95)}
                className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
              >
                <option value={90}>90% Confidence Interval</option>
                <option value={95}>95% Confidence Interval</option>
                <option value={99}>99% Confidence Interval</option>
              </select>
            </div>

            <div>
              <label className="block text-quantara-300 mb-1">Matrix Display Layout</label>
              <select
                value={triangle}
                onChange={(e) => setTriangle(e.target.value as any)}
                className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-1.5 outline-none font-semibold text-xs"
              >
                <option value="full">Full Symmetric Matrix (SPSS Style)</option>
                <option value="lower">Lower Triangle Only</option>
                <option value="upper">Upper Triangle Only</option>
              </select>
            </div>
          </div>

          {/* Visualizations & APA Narrative */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-2.5">
            <div className="font-bold text-purple-400 uppercase text-[10px]">Visuals & Reporting</div>

            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              Interactive Correlation Heatmap
            </label>

            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={showScatterPlot}
                onChange={(e) => setShowScatterPlot(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              Bivariate Scatter Trend Plot
            </label>

            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={showAPA}
                onChange={(e) => setShowAPA(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              APA 7th Publication View Narrative
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
