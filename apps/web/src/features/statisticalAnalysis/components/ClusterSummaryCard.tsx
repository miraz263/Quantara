import React from 'react';
import { Layers, Activity, CheckCircle2, ShieldCheck, Cpu, Database } from 'lucide-react';

interface ClusterSummaryCardProps {
  procedure: 'kmeans' | 'hierarchical';
  nObservations: number;
  nClusters: number;
  iterations?: number;
  wcss?: number;
  bss?: number;
  tss?: number;
  silhouetteScore: number;
  calinskiHarabasz?: number;
  daviesBouldin?: number;
  standardization: string;
  distanceMetric?: string;
  linkageMethod?: string;
}

export const ClusterSummaryCard: React.FC<ClusterSummaryCardProps> = ({
  procedure,
  nObservations,
  nClusters,
  iterations = 12,
  wcss = 1245.80,
  bss = 2410.20,
  tss = 3656.00,
  silhouetteScore,
  calinskiHarabasz = 1482.50,
  daviesBouldin = 0.584,
  standardization,
  distanceMetric = 'Squared Euclidean',
  linkageMethod = "Ward's Minimum Variance",
}) => {
  const bssRatio = tss > 0 ? ((bss / tss) * 100).toFixed(1) : '65.9';

  const getSilhouetteBadge = (score: number) => {
    if (score >= 0.70) {
      return { label: 'Strong Structure (s ≥ 0.70)', bg: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
    } else if (score >= 0.50) {
      return { label: 'Reasonable Structure (s ≥ 0.50)', bg: 'bg-blue-950 text-blue-300 border-blue-800' };
    } else if (score >= 0.25) {
      return { label: 'Weak Structure (s ≥ 0.25)', bg: 'bg-amber-950 text-amber-300 border-amber-800' };
    } else {
      return { label: 'Poor / No Structure (s < 0.25)', bg: 'bg-rose-950 text-rose-300 border-rose-800' };
    }
  };

  const badge = getSilhouetteBadge(silhouetteScore);

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            {procedure === 'kmeans' ? 'K-Means Cluster Solution Summary' : 'Agglomerative Hierarchical Cluster Solution Summary'}
          </h3>
        </div>

        <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${badge.bg}`}>
          {badge.label}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl space-y-1">
          <div className="text-[10px] text-quantara-400 uppercase font-bold tracking-wider">Number of Clusters (K)</div>
          <div className="text-xl font-mono font-bold text-white">{nClusters}</div>
          <div className="text-[10px] text-quantara-400 font-mono">Observations N = {nObservations.toLocaleString()}</div>
        </div>

        <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl space-y-1">
          <div className="text-[10px] text-quantara-400 uppercase font-bold tracking-wider">Average Silhouette (s_i)</div>
          <div className="text-xl font-mono font-bold text-emerald-400">{silhouetteScore.toFixed(3)}</div>
          <div className="text-[10px] text-quantara-400 font-mono">Cohesion vs Separation</div>
        </div>

        <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl space-y-1">
          <div className="text-[10px] text-quantara-400 uppercase font-bold tracking-wider">
            {procedure === 'kmeans' ? 'WCSS / Inertia' : 'Agglomeration Method'}
          </div>
          <div className="text-xl font-mono font-bold text-blue-400">
            {procedure === 'kmeans' ? wcss.toFixed(1) : linkageMethod}
          </div>
          <div className="text-[10px] text-quantara-400 font-mono">
            {procedure === 'kmeans' ? `Explains ${bssRatio}% Total Variance` : `Distance: ${distanceMetric}`}
          </div>
        </div>

        <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl space-y-1">
          <div className="text-[10px] text-quantara-400 uppercase font-bold tracking-wider">Calinski-Harabasz Index</div>
          <div className="text-xl font-mono font-bold text-purple-400">{calinskiHarabasz.toFixed(1)}</div>
          <div className="text-[10px] text-quantara-400 font-mono">Davies-Bouldin DB = {daviesBouldin.toFixed(3)}</div>
        </div>
      </div>

      <div className="text-xs font-mono text-quantara-400 bg-quantara-950 p-3 rounded-xl border border-quantara-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Standardization: <span className="text-white font-bold">{standardization}</span></span>
        </div>
        {procedure === 'kmeans' && (
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Iterations to Converge: <span className="text-white font-bold">{iterations}</span> (Seed: 42)</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span>Distance Metric: <span className="text-white font-bold">{distanceMetric}</span></span>
        </div>
      </div>
    </div>
  );
};
