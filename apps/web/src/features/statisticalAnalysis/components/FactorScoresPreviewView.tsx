import React, { useState } from 'react';
import { Database, CheckCircle2, Save } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface FactorScoreRow {
  caseId: string;
  [key: string]: string | number;
}

interface FactorScoresPreviewViewProps {
  scoreColumns: string[];
  rows: FactorScoreRow[];
  methodName?: string;
  onSaveScores?: () => void;
}

export const FactorScoresPreviewView: React.FC<FactorScoresPreviewViewProps> = ({
  scoreColumns,
  rows,
  methodName = 'Regression Method (Standardized Mean = 0, SD = 1)',
  onSaveScores,
}) => {
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    if (onSaveScores) onSaveScores();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-quantara-800 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-lg">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Factor / Component Scores Preview</h3>
            <p className="text-[11px] text-quantara-400">Estimated case scores ({methodName})</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" /> Saved to Dataset
            </span>
          )}
          <Button onClick={handleSave} variant="primary" size="sm" className="flex items-center gap-1.5 shadow-lg">
            <Save className="w-3.5 h-3.5" /> Save Scores as Derived Variables
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-quantara-800 bg-quantara-950">
        <table className="w-full text-xs text-left text-quantara-200">
          <thead className="bg-quantara-900 border-b border-quantara-800 font-semibold text-quantara-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">Observation ID</th>
              {scoreColumns.map((col) => (
                <th key={col} className="px-4 py-3 text-right">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800/60 font-mono">
            {rows.map((r, idx) => (
              <tr key={r.caseId || idx} className="hover:bg-quantara-900/60 transition">
                <td className="px-4 py-2.5 font-bold font-sans text-white">{r.caseId}</td>
                {scoreColumns.map((col) => {
                  const val = typeof r[col] === 'number' ? (r[col] as number) : 0;
                  return (
                    <td
                      key={col}
                      className={`px-4 py-2.5 text-right font-bold ${
                        val > 0 ? 'text-emerald-400' : val < 0 ? 'text-rose-400' : 'text-quantara-400'
                      }`}
                    >
                      {val.toFixed(3)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
