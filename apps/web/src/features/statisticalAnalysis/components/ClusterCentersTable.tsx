import React, { useState } from 'react';
import { Table, Sliders, Hash, ArrowUpDown } from 'lucide-react';

interface ClusterCenterRow {
  variable: string;
  variableLabel?: string;
  clusterMeans: Record<string, { raw: number; zScore: number }>;
}

interface ClusterSize {
  clusterId: string;
  clusterName: string;
  n: number;
  pct: number;
}

interface ClusterCentersTableProps {
  clusters: ClusterSize[];
  rows: ClusterCenterRow[];
}

export const ClusterCentersTable: React.FC<ClusterCentersTableProps> = ({ clusters, rows }) => {
  const [showStandardized, setShowStandardized] = useState(true);

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Table className="w-4 h-4 text-blue-400" />
            Final Cluster Centroids & Variable Means Matrix
          </h3>
          <p className="text-[11px] text-quantara-400 mt-0.5">
            Mean variable values across assigned clusters ({showStandardized ? 'Standardized Z-Scores' : 'Raw Unit Scale'})
          </p>
        </div>

        <div className="flex items-center gap-2 bg-quantara-950 p-1 rounded-lg border border-quantara-800 text-xs">
          <button
            onClick={() => setShowStandardized(true)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
              showStandardized ? 'bg-blue-600 text-white shadow' : 'text-quantara-400 hover:text-white'
            }`}
          >
            Standardized (Z-Score)
          </button>
          <button
            onClick={() => setShowStandardized(false)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
              !showStandardized ? 'bg-blue-600 text-white shadow' : 'text-quantara-400 hover:text-white'
            }`}
          >
            Raw Scale
          </button>
        </div>
      </div>

      {/* Cluster Sizes Bar Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {clusters.map((c, idx) => (
          <div key={c.clusterId} className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-white truncate">{c.clusterName}</span>
              <span className="text-[10px] font-mono text-quantara-400">#{idx + 1}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-base font-mono font-bold text-indigo-400">{c.n.toLocaleString()} cases</span>
              <span className="text-xs font-mono font-bold text-emerald-400">{c.pct.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Centroids Table */}
      <div className="overflow-x-auto border border-quantara-800 rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-quantara-950 border-b border-quantara-800 text-quantara-300 font-mono text-[11px]">
              <th className="p-3 font-semibold">Variable</th>
              {clusters.map((c) => (
                <th key={c.clusterId} className="p-3 font-semibold text-right">
                  {c.clusterName}
                </th>
              ))}
              <th className="p-3 font-semibold text-right text-quantara-400">Total Sample Mean</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800 text-quantara-200">
            {rows.map((r, rowIdx) => {
              const totalRawMean =
                Object.values(r.clusterMeans).reduce((acc, item) => acc + item.raw, 0) /
                Object.keys(r.clusterMeans).length;
              return (
                <tr key={rowIdx} className="hover:bg-quantara-800/50 transition font-mono">
                  <td className="p-3 font-medium text-white font-sans">
                    {r.variable}
                    {r.variableLabel && <span className="block text-[10px] text-quantara-400 font-normal">{r.variableLabel}</span>}
                  </td>
                  {clusters.map((c) => {
                    const data = r.clusterMeans[c.clusterId];
                    if (!data) return <td key={c.clusterId} className="p-3 text-right text-quantara-500">-</td>;
                    const val = showStandardized ? data.zScore : data.raw;
                    const isHigh = showStandardized ? data.zScore > 0.5 : false;
                    const isLow = showStandardized ? data.zScore < -0.5 : false;

                    return (
                      <td key={c.clusterId} className="p-3 text-right font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-xs inline-block ${
                            showStandardized
                              ? isHigh
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                                : isLow
                                ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                                : 'text-quantara-200'
                              : 'text-white'
                          }`}
                        >
                          {showStandardized ? val.toFixed(3) : val.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                      </td>
                    );
                  })}
                  <td className="p-3 text-right text-quantara-400 font-normal">
                    {showStandardized ? '0.000' : totalRawMean.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-[10px] text-quantara-500 font-mono flex items-center justify-between">
        <span>Standardized scores (Z-score): Mean = 0, SD = 1. Positive values denote above-average variable means.</span>
        <span>Green = High (&gt; +0.50 SD) | Red = Low (&lt; -0.50 SD)</span>
      </div>
    </div>
  );
};
