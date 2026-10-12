import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { VariableSelector } from '../components/VariableSelector';
import { Hash, Play, Sliders, PieChart, BarChart, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface FrequenciesConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const FrequenciesConfigView: React.FC<FrequenciesConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [selectedVariables, setSelectedVariables] = useState<string[]>(['education', 'sex']);
  const [displayFrequencyTable, setDisplayFrequencyTable] = useState(true);
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'histogram' | 'none'>('bar');
  const [sortByFrequency, setSortByFrequency] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRun = () => {
    if (selectedVariables.length === 0) {
      setValidationError('Select at least one categorical variable for Frequencies.');
      return;
    }

    setValidationError(null);
    onRunAnalysis({
      procedure: 'frequencies',
      title: `Frequencies — ${selectedVariables.join(', ')}`,
      variables: selectedVariables,
      options: {
        displayFrequencyTable,
        chartType,
        sortByFrequency,
      },
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6 font-sans">
      {/* Header */}
      <div className="border-b border-quantara-800 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Hash className="w-5 h-5 text-emerald-400" />
            Frequencies Procedure Configuration
          </h2>
          <p className="text-xs text-quantara-400 mt-0.5">
            Tabulate category counts, percentages, valid percentages, cumulative percentages, and bar/pie charts.
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
          {isSubmitting ? 'Calculating Frequencies...' : 'Run Frequencies'}
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
          1. Select Categorical or Discrete Variables
        </h3>
        <VariableSelector
          availableVariables={availableVariables}
          selectedVariableNames={selectedVariables}
          onChangeSelected={setSelectedVariables}
          targetLabel="Variables for Frequency Tables"
          allowCategoricalWarning={false}
        />
      </div>

      {/* 2. Options Grid */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-quantara-800 pb-2">
          2. Display & Charting Options
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
          {/* Frequency Table Settings */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-3">
            <div className="font-bold text-emerald-400 uppercase text-[10px]">Frequency Table Configuration</div>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={displayFrequencyTable}
                onChange={(e) => setDisplayFrequencyTable(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              Display frequency tables with Valid % and Cumulative %
            </label>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={sortByFrequency}
                onChange={(e) => setSortByFrequency(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              Sort categories by descending frequency count
            </label>
          </div>

          {/* Chart Selection */}
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-3">
            <div className="font-bold text-blue-400 uppercase text-[10px]">Frequency Chart Type</div>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
              className="w-full bg-quantara-900 border border-quantara-700 text-white rounded p-2 outline-none text-xs font-semibold"
            >
              <option value="bar">Bar Chart (Vertical Category Bars)</option>
              <option value="pie">Pie / Donut Chart</option>
              <option value="histogram">Histogram</option>
              <option value="none">No Chart (Table Only)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
