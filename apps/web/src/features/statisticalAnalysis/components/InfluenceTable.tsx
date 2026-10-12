import React from 'react';
import { AlertCircle, ExternalLink, Filter } from 'lucide-react';

export interface InfluenceRow {
  caseId: string;
  observed: number;
  predicted: number;
  residual: number;
  stdResidual: number;
  leverage: number;
  cooksD: number;
}

interface InfluenceTableProps {
  rows: InfluenceRow[];
  onViewCaseInDataEditor?: (caseId: string) => void;
}

export const InfluenceTable: React.FC<InfluenceTableProps> = ({
  rows,
  onViewCaseInDataEditor,
}) => {
  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-950/80 border border-amber-800 text-amber-400 rounded-lg">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Outlier & Influence Diagnostics</h3>
            <p className="text-[11px] text-quantara-400">
              Cases identified with standardized residuals $|z| &gt; 2.5$ or influential Cook's Distance ($D &gt; 4/N$)
            </p>
          </div>
        </div>

        <span className="text-xs text-amber-300 font-medium bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded-lg">
          {rows.length} Potentially Unusual Observation{rows.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-quantara-800 bg-quantara-950">
        <table className="w-full text-xs text-left text-quantara-200">
          <thead className="bg-quantara-900 border-b border-quantara-800 font-semibold text-quantara-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">Case ID</th>
              <th className="px-4 py-3 text-right">Observed Outcome ($)</th>
              <th className="px-4 py-3 text-right">Predicted Outcome ($)</th>
              <th className="px-4 py-3 text-right">Residual ($)</th>
              <th className="px-4 py-3 text-right">Std. Residual</th>
              <th className="px-4 py-3 text-right">Leverage (h)</th>
              <th className="px-4 py-3 text-right">Cook's D</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800/60 font-mono">
            {rows.map((row) => (
              <tr key={row.caseId} className="hover:bg-quantara-900/60 transition">
                <td className="px-4 py-2.5 font-bold font-sans text-white">{row.caseId}</td>
                <td className="px-4 py-2.5 text-right">${row.observed.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right">${row.predicted.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-quantara-300">${row.residual.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right font-bold text-amber-400">{row.stdResidual.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right">{row.leverage.toFixed(4)}</td>
                <td className="px-4 py-2.5 text-right text-rose-300 font-bold">{row.cooksD.toFixed(4)}</td>
                <td className="px-4 py-2.5 text-center font-sans">
                  <button
                    onClick={() => onViewCaseInDataEditor && onViewCaseInDataEditor(row.caseId)}
                    className="px-2.5 py-1 bg-quantara-900 hover:bg-quantara-800 border border-quantara-700 text-blue-400 hover:text-blue-300 rounded text-[11px] font-semibold transition inline-flex items-center gap-1"
                  >
                    <span>View Case</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-[11px] text-quantara-400">
        <span className="font-semibold text-quantara-300">Diagnostic Note: </span>
        Potentially unusual observations serve as diagnostic guidelines for investigation, not automatic deletions. Inspect data quality in Data Editor before taking scientific action.
      </div>
    </div>
  );
};
