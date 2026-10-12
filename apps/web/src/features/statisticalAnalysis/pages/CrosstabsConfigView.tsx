import React, { useState } from 'react';
import { VariableItem, AnalysisRequest } from '../types/analysisTypes';
import { VariableSelector } from '../components/VariableSelector';
import { Sliders, Play, RefreshCw, CheckSquare } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface CrosstabsConfigViewProps {
  availableVariables: VariableItem[];
  onRunAnalysis: (request: Partial<AnalysisRequest>) => void;
  isSubmitting?: boolean;
}

export const CrosstabsConfigView: React.FC<CrosstabsConfigViewProps> = ({
  availableVariables,
  onRunAnalysis,
  isSubmitting = false,
}) => {
  const [rowVars, setRowVars] = useState<string[]>(['education']);
  const [colVars, setColVars] = useState<string[]>(['employment']);

  // Cell Content Options
  const [showCounts, setShowCounts] = useState(true);
  const [showRowPercents, setShowRowPercents] = useState(true);
  const [showColPercents, setShowColPercents] = useState(true);
  const [showTotalPercents, setShowTotalPercents] = useState(false);
  const [showTotals, setShowTotals] = useState(true);

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRun = () => {
    if (rowVars.length === 0 || colVars.length === 0) {
      setValidationError('Select at least one Row variable and one Column variable for Crosstabs.');
      return;
    }

    setValidationError(null);
    onRunAnalysis({
      procedure: 'crosstabs',
      title: `Crosstabs — ${rowVars.join(', ')} × ${colVars.join(', ')}`,
      variables: [...rowVars, ...colVars],
      options: {
        rowVariables: rowVars,
        columnVariables: colVars,
        showCounts,
        showRowPercents,
        showColPercents,
        showTotalPercents,
        showTotals,
      },
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6 font-sans">
      <div className="border-b border-quantara-800 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            Crosstabs Procedure Configuration
          </h2>
          <p className="text-xs text-quantara-400 mt-0.5">
            Construct 2-way contingency crosstabulations with row, column, and total percentage distributions.
          </p>
        </div>

        <Button
          onClick={handleRun}
          disabled={isSubmitting || rowVars.length === 0 || colVars.length === 0}
          variant="primary"
          size="sm"
          className="flex items-center gap-2 shadow-lg"
        >
          {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          {isSubmitting ? 'Computing Crosstabs...' : 'Run Crosstabs'}
        </Button>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold">
          {validationError}
        </div>
      )}

      {/* Row Variable */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          1. Select Row Variable(s)
        </h3>
        <VariableSelector
          availableVariables={availableVariables}
          selectedVariableNames={rowVars}
          onChangeSelected={setRowVars}
          targetLabel="Row Variables"
          allowCategoricalWarning={false}
        />
      </div>

      {/* Column Variable */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          2. Select Column Variable(s)
        </h3>
        <VariableSelector
          availableVariables={availableVariables}
          selectedVariableNames={colVars}
          onChangeSelected={setColVars}
          targetLabel="Column Variables"
          allowCategoricalWarning={false}
        />
      </div>

      {/* Crosstab Cell Content Options */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-quantara-800 pb-2">
          3. Crosstab Cell Content & Totals
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-2">
            <div className="font-bold text-indigo-400 uppercase text-[10px]">Counts & Percentages</div>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input type="checkbox" checked={showCounts} onChange={(e) => setShowCounts(e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" /> Count (Observed Frequencies)
            </label>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input type="checkbox" checked={showRowPercents} onChange={(e) => setShowRowPercents(e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" /> Row Percentage (%)
            </label>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input type="checkbox" checked={showColPercents} onChange={(e) => setShowColPercents(e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" /> Column Percentage (%)
            </label>
          </div>

          <div className="bg-quantara-950 p-4 rounded-xl border border-quantara-800 space-y-2">
            <div className="font-bold text-emerald-400 uppercase text-[10px]">Totals Display</div>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input type="checkbox" checked={showTotals} onChange={(e) => setShowTotals(e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" /> Include Row & Column Totals
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
