import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { VariableSelector } from '../components/VariableSelector';
import { BarChart2, Play, Sliders, CheckSquare, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface DescriptivesConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const DescriptivesConfigView: React.FC<DescriptivesConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>(['age', 'income', 'satisfaction']);

  // Options
  const [mean, setMean] = useState(true);
  const [median, setMedian] = useState(true);
  const [mode, setMode] = useState(false);
  const [stdDev, setStdDev] = useState(true);
  const [variance, setVariance] = useState(false);
  const [range, setRange] = useState(false);
  const [min, setMin] = useState(true);
  const [max, setMax] = useState(true);
  const [quartiles, setQuartiles] = useState(true);
  const [skewness, setSkewness] = useState(true);
  const [kurtosis, setKurtosis] = useState(true);
  const [decimals, setDecimals] = useState(2);
  const [confidenceInterval, setConfidenceInterval] = useState(95);

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRun = () => {
    if (selectedVariables.length === 0) {
      setValidationError('Select at least one numeric variable to run Descriptive Statistics.');
      return;
    }

    setValidationError(null);
    onRunAnalysis({
      procedure: 'descriptives',
      title: `Descriptive Statistics — ${selectedVariables.join(', ')}`,
      variables: selectedVariables,
      options: {
        mean,
        median,
        mode,
        stdDev,
        variance,
        range,
        minimum: min,
        maximum: max,
        quartiles,
        skewness,
        kurtosis,
        decimals,
        confidenceInterval,
      },
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6 font-sans">
      {/* Title Header */}
      <div className="border-b border-quantara-800 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-400" />
            Descriptive Statistics Procedure Configuration
          </h2>
          <p className="text-xs text-quantara-400 mt-0.5">
            Compute central tendency (Mean, Median), dispersion (Std Dev, Range), skewness, and confidence intervals.
          </p>
        </div>

        <Button
          onClick={handleRun}
          disabled={isSubmitting || selectedVariables.length === 0}
          variant="primary"
          size="sm"
          className="flex items-center gap-2 shadow-lg"
        >
          {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          {isSubmitting ? 'Calculating Statistics...' : 'Run Procedure'}
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
          1. Select Numeric Variables for Summary Analysis
        </h3>
        <VariableSelector
          availableVariables={availableVariables}
          selectedVariableNames={selectedVariables}
          onChangeSelected={setSelectedVariables}
          targetLabel="Variables to Summarize"
          allowCategoricalWarning={true}
        />
      </div>

      {/* 2. Options Grid */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-quantara-800 pb-2">
          2. Statistical Measures & Option Checkboxes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
          {/* Central Tendency */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-2">
            <div className="font-bold text-blue-400 uppercase text-[10px]">Central Tendency</div>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input type="checkbox" checked={mean} onChange={(e) => setMean(e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" /> Mean
            </label>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input type="checkbox" checked={median} onChange={(e) => setMedian(e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" /> Median
            </label>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input type="checkbox" checked={mode} onChange={(e) => setMode(e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" /> Mode
            </label>
          </div>

          {/* Dispersion */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-2">
            <div className="font-bold text-emerald-400 uppercase text-[10px]">Dispersion & Range</div>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input type="checkbox" checked={stdDev} onChange={(e) => setStdDev(e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" /> Standard Deviation
            </label>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input type="checkbox" checked={variance} onChange={(e) => setVariance(e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" /> Variance
            </label>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input type="checkbox" checked={min} onChange={(e) => setMin(e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" /> Minimum & Maximum
            </label>
          </div>

          {/* Distribution & CI */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-2">
            <div className="font-bold text-purple-400 uppercase text-[10px]">Distribution & Precision</div>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input type="checkbox" checked={skewness} onChange={(e) => setSkewness(e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" /> Skewness & Kurtosis
            </label>

            <div className="pt-2 border-t border-quantara-800 font-mono">
              <label className="block text-[11px] text-quantara-400 mb-1 font-sans">Confidence Interval for Mean</label>
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
          </div>
        </div>
      </div>
    </div>
  );
};
