import React from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';

export interface RankSummaryRow {
  groupOrCategory: string;
  n: number;
  median?: number;
  meanRank: number | string;
  sumRanks?: number | string;
}

interface NonparametricRanksViewProps {
  title?: string;
  subtitle?: string;
  rows: RankSummaryRow[];
  totalN?: number;
}

export const NonparametricRanksView: React.FC<NonparametricRanksViewProps> = ({
  title = 'Group Rank & Distribution Summary',
  subtitle = 'Nonparametric rank assignments and mean ranks across observation groups',
  rows,
  totalN,
}) => {
  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-950/80 border border-indigo-800 text-indigo-400 rounded-lg">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
            <p className="text-[11px] text-quantara-400">{subtitle}</p>
          </div>
        </div>

        {totalN !== undefined && (
          <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-800 px-3 py-1 rounded-lg">
            Total Valid N = {totalN.toLocaleString()}
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-quantara-800 bg-quantara-950">
        <table className="w-full text-xs text-left text-quantara-200">
          <thead className="bg-quantara-900 border-b border-quantara-800 font-semibold text-quantara-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">Group / Rank Category</th>
              <th className="px-4 py-3 text-right">N</th>
              <th className="px-4 py-3 text-right">Median</th>
              <th className="px-4 py-3 text-right">Mean Rank</th>
              <th className="px-4 py-3 text-right">Sum of Ranks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800/60 font-mono">
            {rows.map((row, idx) => (
              <tr key={row.groupOrCategory || idx} className="hover:bg-quantara-900/60 transition">
                <td className="px-4 py-2.5 font-bold font-sans text-white">{row.groupOrCategory}</td>
                <td className="px-4 py-2.5 text-right">{row.n.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-emerald-400 font-bold">
                  {row.median !== undefined ? row.median.toLocaleString() : '—'}
                </td>
                <td className="px-4 py-2.5 text-right font-bold text-blue-400">
                  {typeof row.meanRank === 'number' ? row.meanRank.toFixed(2) : row.meanRank}
                </td>
                <td className="px-4 py-2.5 text-right text-quantara-300">
                  {typeof row.sumRanks === 'number' ? row.sumRanks.toLocaleString() : row.sumRanks || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
