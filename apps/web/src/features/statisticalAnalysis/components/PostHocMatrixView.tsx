import React from 'react';
import { Layers, CheckCircle2, XCircle } from 'lucide-react';

interface PostHocMatrixViewProps {
  method?: string;
  groups: string[];
  // Significance matrix where matrix[i][j] is the adjusted p-value or undefined if i === j
  pValues: number[][];
}

export const PostHocMatrixView: React.FC<PostHocMatrixViewProps> = ({
  method = 'Tukey HSD',
  groups = ['Primary', 'Secondary', 'Higher Sec', 'Graduate', 'Postgraduate'],
  pValues = [
    [1.0, 0.0001, 0.0001, 0.0001, 0.0001],
    [0.0001, 1.0, 0.0001, 0.0001, 0.0001],
    [0.0001, 0.0001, 1.0, 0.0001, 0.0001],
    [0.0001, 0.0001, 0.0001, 1.0, 0.0001],
    [0.0001, 0.0001, 0.0001, 0.0001, 1.0],
  ],
}) => {
  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans">
      <div className="border-b border-quantara-800 pb-3 flex items-center justify-between">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          Pairwise Post-Hoc Significance Matrix ({method})
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
          Familywise Error Rate Controlled (&alpha; = 0.05)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-center border-collapse font-mono">
          <thead>
            <tr className="bg-quantara-950 text-quantara-300 uppercase font-semibold border-b border-quantara-800">
              <th className="py-2.5 px-3 text-left font-sans text-[11px]">Group</th>
              {groups.map((g) => (
                <th key={g} className="py-2.5 px-3">
                  {g}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800/70 text-slate-200">
            {groups.map((gRow, rIdx) => (
              <tr key={gRow} className="hover:bg-quantara-800/40 transition">
                <td className="py-2.5 px-3 font-sans font-bold text-white text-left bg-quantara-950/60">
                  {gRow}
                </td>
                {groups.map((gCol, cIdx) => {
                  if (rIdx === cIdx) {
                    return (
                      <td key={gCol} className="py-2.5 px-3 text-quantara-600 bg-quantara-950">
                        —
                      </td>
                    );
                  }

                  const pVal = pValues[rIdx] && pValues[rIdx][cIdx] !== undefined ? pValues[rIdx][cIdx] : 0.001;
                  const isSig = pVal < 0.05;

                  return (
                    <td
                      key={gCol}
                      className={`py-2.5 px-3 font-bold ${
                        isSig ? 'text-emerald-400 bg-emerald-950/20' : 'text-slate-400'
                      }`}
                    >
                      {pVal < 0.001 ? '< .001 *' : `${pVal.toFixed(3)} ${isSig ? '*' : ''}`}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-[10px] text-quantara-400 flex items-center gap-2 font-mono border-t border-quantara-800/60 pt-2">
        <span className="text-emerald-400 font-bold">* Statistically significant difference at p &lt; .05.</span>
      </div>
    </div>
  );
};
