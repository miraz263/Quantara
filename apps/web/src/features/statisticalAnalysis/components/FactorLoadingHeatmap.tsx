import React, { useState } from 'react';
import { Sliders, Eye, EyeOff, Sparkles } from 'lucide-react';

interface FactorLoadingHeatmapProps {
  title?: string;
  variables: string[];
  factors: string[];
  loadings: number[][]; // [varIndex][factorIndex]
  defaultThreshold?: number;
}

export const FactorLoadingHeatmap: React.FC<FactorLoadingHeatmapProps> = ({
  title = 'Factor Loading Intensity Matrix Heatmap',
  variables,
  factors,
  loadings,
  defaultThreshold = 0.30,
}) => {
  const [threshold, setThreshold] = useState<number>(defaultThreshold);
  const [useAbsolute, setUseAbsolute] = useState<boolean>(false);
  const [suppressBelow, setSuppressBelow] = useState<boolean>(true);

  // Helper for cell background color intensity
  const getCellBg = (val: number) => {
    const absVal = Math.abs(val);
    if (suppressBelow && absVal < threshold) return 'bg-quantara-950 text-quantara-600';

    if (val >= 0.7) return 'bg-blue-600 text-white font-bold';
    if (val >= 0.5) return 'bg-blue-700/80 text-blue-100 font-bold';
    if (val >= 0.3) return 'bg-blue-900/60 text-blue-200 font-semibold';
    if (val > 0) return 'bg-quantara-900 text-quantara-300';

    if (val <= -0.7) return 'bg-rose-600 text-white font-bold';
    if (val <= -0.5) return 'bg-rose-700/80 text-rose-100 font-bold';
    if (val <= -0.3) return 'bg-rose-900/60 text-rose-200 font-semibold';
    return 'bg-quantara-900 text-quantara-300';
  };

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-quantara-800 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-950/80 border border-indigo-800 text-indigo-400 rounded-lg">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
            <p className="text-[11px] text-quantara-400">Visual magnitude matrix across extracted components/factors</p>
          </div>
        </div>

        {/* Heatmap Controls */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-quantara-950 border border-quantara-800 px-2.5 py-1 rounded-lg">
            <span className="text-quantara-400 text-[10px] font-sans">Cutoff:</span>
            {[0.2, 0.3, 0.4, 0.5].map((t) => (
              <button
                key={t}
                onClick={() => setThreshold(t)}
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  threshold === t ? 'bg-blue-600 text-white font-bold' : 'text-quantara-400 hover:text-white'
                }`}
              >
                .{Math.round(t * 10)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSuppressBelow(!suppressBelow)}
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 text-[11px] font-sans font-medium transition ${
              suppressBelow ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800' : 'bg-quantara-950 text-quantara-400 border-quantara-800'
            }`}
          >
            {suppressBelow ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {suppressBelow ? 'Suppressed' : 'Show All'}
          </button>
        </div>
      </div>

      {/* Grid Heatmap */}
      <div className="overflow-x-auto rounded-xl border border-quantara-800 bg-quantara-950">
        <table className="w-full text-xs text-left text-quantara-200">
          <thead className="bg-quantara-900 border-b border-quantara-800 font-semibold text-quantara-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">Observed Variable Item</th>
              {factors.map((f) => (
                <th key={f} className="px-4 py-3 text-center">{f}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800/60 font-mono">
            {variables.map((v, vIdx) => (
              <tr key={v} className="hover:bg-quantara-900/60 transition">
                <td className="px-4 py-2 font-bold font-sans text-white text-xs">{v}</td>
                {factors.map((_, fIdx) => {
                  const rawVal = loadings[vIdx] ? loadings[vIdx][fIdx] || 0 : 0;
                  const displayVal = useAbsolute ? Math.abs(rawVal) : rawVal;
                  const isSuppressed = suppressBelow && Math.abs(rawVal) < threshold;

                  return (
                    <td key={fIdx} className="px-3 py-2 text-center">
                      <div
                        className={`py-1 px-2 rounded font-bold text-xs transition ${getCellBg(rawVal)}`}
                        title={`${v} on ${factors[fIdx]}: Loading = ${rawVal.toFixed(3)}`}
                      >
                        {isSuppressed ? '—' : displayVal.toFixed(3)}
                      </div>
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
