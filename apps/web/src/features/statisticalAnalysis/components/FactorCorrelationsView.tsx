import React from 'react';
import { Layers } from 'lucide-react';

interface FactorCorrelationsViewProps {
  factors: string[];
  matrix: number[][]; // [f1][f2]
  rotationName?: string;
}

export const FactorCorrelationsView: React.FC<FactorCorrelationsViewProps> = ({
  factors,
  matrix,
  rotationName = 'Direct Oblimin Oblique Rotation',
}) => {
  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-950/80 border border-purple-800 text-purple-400 rounded-lg">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Factor Correlation Matrix</h3>
            <p className="text-[11px] text-quantara-400">Inter-factor correlation coefficients under {rotationName}</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/60 border border-purple-800 px-3 py-1 rounded-lg">
          Oblique Framework
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-quantara-800 bg-quantara-950">
        <table className="w-full text-xs text-left text-quantara-200">
          <thead className="bg-quantara-900 border-b border-quantara-800 font-semibold text-quantara-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">Factor Name</th>
              {factors.map((f) => (
                <th key={f} className="px-4 py-3 text-right">{f}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800/60 font-mono">
            {factors.map((rowFactor, rIdx) => (
              <tr key={rowFactor} className="hover:bg-quantara-900/60 transition">
                <td className="px-4 py-2.5 font-bold font-sans text-white">{rowFactor}</td>
                {factors.map((_, cIdx) => {
                  const val = matrix[rIdx] ? matrix[rIdx][cIdx] || 0 : 0;
                  const isDiag = rIdx === cIdx;

                  return (
                    <td
                      key={cIdx}
                      className={`px-4 py-2.5 text-right font-bold ${
                        isDiag
                          ? 'text-quantara-400'
                          : Math.abs(val) >= 0.32
                          ? 'text-purple-400 font-extrabold'
                          : 'text-quantara-300'
                      }`}
                    >
                      {isDiag ? '1.000' : val.toFixed(3)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-[11px] text-quantara-400 leading-relaxed bg-quantara-950 p-3 rounded-xl border border-quantara-800">
        Note: Inter-factor correlation values exceeding <span className="text-purple-300 font-mono font-bold">0.32</span> support the choice of oblique rotation over orthogonal rotation, as factors share meaningful common variance.
      </div>
    </div>
  );
};
