import React from 'react';
import { ShieldCheck, BarChart2, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface KSolution {
  k: number;
  wcss: number;
  silhouette: number;
  calinskiHarabasz: number;
  daviesBouldin: number;
  isOptimal?: boolean;
}

interface ClusterValidationViewProps {
  currentK: number;
  kSolutions: KSolution[];
}

export const ClusterValidationView: React.FC<ClusterValidationViewProps> = ({ currentK, kSolutions }) => {
  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-5 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Cluster Validation & Multi-K Solution Comparison
          </h3>
          <p className="text-[11px] text-quantara-400 mt-0.5">
            Internal validity indices across candidate cluster numbers (K = 2 to 6)
          </p>
        </div>

        <span className="px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
          Current K = {currentK}
        </span>
      </div>

      {/* Validation Index Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl space-y-1">
          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Silhouette Coefficient (s_i)
          </div>
          <p className="text-[11px] text-quantara-300 leading-normal">
            Measures cluster cohesion vs separation. Range [-1, +1]. Higher is better (≥ 0.50 denotes reasonable structure).
          </p>
        </div>

        <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl space-y-1">
          <div className="font-bold text-blue-400 flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" /> Calinski-Harabasz Index
          </div>
          <p className="text-[11px] text-quantara-300 leading-normal">
            Variance ratio criterion (SSB/SSW ratio). Higher values indicate distinct, well-separated dense clusters.
          </p>
        </div>

        <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl space-y-1">
          <div className="font-bold text-purple-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Davies-Bouldin Index
          </div>
          <p className="text-[11px] text-quantara-300 leading-normal">
            Average similarity between each cluster and its most similar one. Lower values indicate better separation.
          </p>
        </div>
      </div>

      {/* Multi-K Solutions Table */}
      <div className="overflow-x-auto border border-quantara-800 rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-quantara-950 border-b border-quantara-800 text-quantara-300 font-mono text-[11px]">
              <th className="p-3 font-semibold">Clusters (K)</th>
              <th className="p-3 font-semibold text-right">WCSS / Inertia</th>
              <th className="p-3 font-semibold text-right text-emerald-400">Avg Silhouette (s_i)</th>
              <th className="p-3 font-semibold text-right text-blue-400">Calinski-Harabasz</th>
              <th className="p-3 font-semibold text-right text-purple-400">Davies-Bouldin</th>
              <th className="p-3 font-semibold text-center">Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800 text-quantara-200 font-mono">
            {kSolutions.map((sol) => {
              const isSelected = sol.k === currentK;
              return (
                <tr
                  key={sol.k}
                  className={`transition ${
                    isSelected
                      ? 'bg-blue-950/40 border-l-4 border-l-blue-500 font-bold text-white'
                      : 'hover:bg-quantara-800/50'
                  }`}
                >
                  <td className="p-3 font-sans font-bold flex items-center gap-2">
                    <span>K = {sol.k}</span>
                    {isSelected && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-mono bg-blue-600 text-white">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">{sol.wcss.toFixed(1)}</td>
                  <td className="p-3 text-right text-emerald-400 font-bold">{sol.silhouette.toFixed(3)}</td>
                  <td className="p-3 text-right text-blue-400 font-bold">{sol.calinskiHarabasz.toFixed(1)}</td>
                  <td className="p-3 text-right text-purple-400 font-bold">{sol.daviesBouldin.toFixed(3)}</td>
                  <td className="p-3 text-center font-sans text-[11px]">
                    {sol.isOptimal ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Recommended Elbow & Silhouette Peak
                      </span>
                    ) : (
                      <span className="text-quantara-400">Candidate Solution</span>
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
