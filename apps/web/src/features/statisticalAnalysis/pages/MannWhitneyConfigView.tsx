import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { Play, Layers, CheckCircle2, AlertCircle, Sliders } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface MannWhitneyConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const MannWhitneyConfigView: React.FC<MannWhitneyConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [testVariable, setTestVariable] = useState<string>('satisfaction');
  const [groupingVariable, setGroupingVariable] = useState<string>('sex');
  const [group1, setGroup1] = useState<string>('Male');
  const [group2, setGroup2] = useState<string>('Female');
  const [pValueMethod, setPValueMethod] = useState<'automatic' | 'exact' | 'asymptotic'>('automatic');
  const [continuityCorrection, setContinuityCorrection] = useState<boolean>(true);

  const handleRun = () => {
    if (!testVariable || !groupingVariable || !group1 || !group2) return;

    onRunAnalysis({
      procedure: 'mann_whitney',
      title: `Mann–Whitney U Test — ${testVariable} by ${groupingVariable} (${group1} vs ${group2})`,
      variables: [testVariable],
      groupingVariables: [groupingVariable],
      options: {
        dependentVariable: testVariable,
        groupingVariable,
        group1,
        group2,
        pValueMethod,
        continuityCorrection,
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 font-sans">
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-950 border border-indigo-800 text-indigo-400 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Mann–Whitney U Test</h1>
            <p className="text-xs text-quantara-400 mt-0.5">
              Nonparametric rank-sum test for comparing two independent observation groups
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-indigo-400" /> 2 Independent Groups
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Variable Selector */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
          <label className="text-xs font-bold text-white uppercase tracking-wider block">
            1. Test Variable (Numeric or Ordinal Outcome)
          </label>
          <select
            value={testVariable}
            onChange={(e) => setTestVariable(e.target.value)}
            className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500"
          >
            {availableVariables.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.label || v.measure})
              </option>
            ))}
          </select>
        </div>

        {/* Grouping Variable Selector */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
          <label className="text-xs font-bold text-white uppercase tracking-wider block">
            2. Grouping Variable (Categorical - 2 Groups)
          </label>
          <select
            value={groupingVariable}
            onChange={(e) => setGroupingVariable(e.target.value)}
            className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-500"
          >
            {availableVariables.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.label || v.measure})
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-semibold text-quantara-400 block mb-1">Group 1 Value</label>
              <input
                type="text"
                value={group1}
                onChange={(e) => setGroup1(e.target.value)}
                className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg px-2.5 py-1.5 text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-quantara-400 block mb-1">Group 2 Value</label>
              <input
                type="text"
                value={group2}
                onChange={(e) => setGroup2(e.target.value)}
                className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg px-2.5 py-1.5 text-xs outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Options & Method Config */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <label className="text-xs font-bold text-white uppercase tracking-wider block flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" /> Test Options & Probability Calculation
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl flex items-center justify-between">
            <span className="font-semibold text-white">p-Value Calculation Method</span>
            <select
              value={pValueMethod}
              onChange={(e) => setPValueMethod(e.target.value as any)}
              className="bg-quantara-900 border border-quantara-700 text-white rounded-lg px-2.5 py-1 text-xs outline-none"
            >
              <option value="automatic">Automatic (Sample Size Rule)</option>
              <option value="exact">Exact Test</option>
              <option value="asymptotic">Asymptotic Normal Approximation</option>
            </select>
          </div>

          <label className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl flex items-center gap-2 cursor-pointer text-white font-semibold">
            <input
              type="checkbox"
              checked={continuityCorrection}
              onChange={(e) => setContinuityCorrection(e.target.checked)}
              className="rounded border-quantara-700 text-indigo-500 focus:ring-0"
            />
            <span>Apply Continuity Correction to Z Statistic</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-quantara-400">
          Rank-biserial correlation (r_rb) calculated deterministically.
        </div>

        <Button
          onClick={handleRun}
          disabled={!testVariable || !groupingVariable || !group1 || !group2 || isSubmitting}
          variant="primary"
          size="lg"
          className="flex items-center gap-2 shadow-xl px-6"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isSubmitting ? 'Calculating Mann–Whitney U...' : 'Run Mann–Whitney U Test'}</span>
        </Button>
      </div>
    </div>
  );
};
