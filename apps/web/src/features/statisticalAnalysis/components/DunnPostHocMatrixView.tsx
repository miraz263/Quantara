import React from 'react';
import { Sliders, CheckCircle2, ShieldAlert } from 'lucide-react';

export interface PostHocPairRow {
  group1: string;
  group2: string;
  zStat?: number;
  wStat?: number;
  rawP: string | number;
  adjP: string | number;
}

interface DunnPostHocMatrixViewProps {
  testName?: string;
  adjustmentMethod?: string;
  pairs: PostHocPairRow[];
}

export const DunnPostHocMatrixView: React.FC<DunnPostHocMatrixViewProps> = ({
  testName = "Dunn's Post-Hoc Pairwise Comparisons",
  adjustmentMethod = 'Holm Step-Down Method',
  pairs,
}) => {
  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-950/80 border border-purple-800 text-purple-400 rounded-lg">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">{testName}</h3>
            <p className="text-[11px] text-quantara-400">
              Multiple-comparison adjusted p-values controlling familywise error rate ({adjustmentMethod})
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/60 border border-purple-800 px-3 py-1 rounded-lg">
          Adjustment: {adjustmentMethod}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-quantara-800 bg-quantara-950">
        <table className="w-full text-xs text-left text-quantara-200">
          <thead className="bg-quantara-900 border-b border-quantara-800 font-semibold text-quantara-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">(I) Comparison Group</th>
              <th className="px-4 py-3">(J) Comparison Group</th>
              <th className="px-4 py-3 text-right">Test Statistic (Z / W)</th>
              <th className="px-4 py-3 text-right">Unadjusted Raw p</th>
              <th className="px-4 py-3 text-right">Adjusted p-value ({adjustmentMethod})</th>
              <th className="px-4 py-3 text-center">Significance (α = 0.05)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800/60 font-mono">
            {pairs.map((pair, idx) => {
              const pValStr = String(pair.adjP);
              const isSig = pValStr.includes('<') || parseFloat(pValStr) < 0.05;

              return (
                <tr key={`${pair.group1}-${pair.group2}-${idx}`} className="hover:bg-quantara-900/60 transition">
                  <td className="px-4 py-2.5 font-bold font-sans text-white">{pair.group1}</td>
                  <td className="px-4 py-2.5 font-bold font-sans text-white">{pair.group2}</td>
                  <td className="px-4 py-2.5 text-right font-bold text-blue-400">
                    {pair.zStat !== undefined ? `Z = ${pair.zStat.toFixed(2)}` : pair.wStat !== undefined ? `W = ${pair.wStat.toFixed(1)}` : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right text-quantara-400">{pair.rawP}</td>
                  <td className={`px-4 py-2.5 text-right font-bold ${isSig ? 'text-emerald-400' : 'text-quantara-400'}`}>
                    {pair.adjP}
                  </td>
                  <td className="px-4 py-2.5 text-center font-sans">
                    {isSig ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Significant (p &lt; .05)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-quantara-900 text-quantara-500 border border-quantara-800">
                        Not Significant
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
