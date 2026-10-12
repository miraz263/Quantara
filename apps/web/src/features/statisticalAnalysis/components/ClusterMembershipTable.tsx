import React, { useState } from 'react';
import { Database, Plus, Check, Edit2, ShieldCheck, Tag } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface MembershipRow {
  caseId: string;
  assignedClusterId: string;
  assignedClusterName: string;
  distanceToCentroid: number;
  nearestNeighborCluster: string;
  secondDistance: number;
  silhouetteIndex: number;
}

interface ClusterLabel {
  id: string;
  defaultName: string;
  customName: string;
  count: number;
}

interface ClusterMembershipTableProps {
  rows: MembershipRow[];
  clusters: ClusterLabel[];
  onSaveToDataset?: (variableName: string, clusterMap: Record<string, string>) => void;
}

export const ClusterMembershipTable: React.FC<ClusterMembershipTableProps> = ({
  rows,
  clusters: initialClusters,
  onSaveToDataset,
}) => {
  const [clusters, setClusters] = useState<ClusterLabel[]>(initialClusters);
  const [variableName, setVariableName] = useState('cluster_membership');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempLabel, setTempLabel] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleStartRename = (c: ClusterLabel) => {
    setEditingId(c.id);
    setTempLabel(c.customName || c.defaultName);
  };

  const handleSaveRename = (id: string) => {
    setClusters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, customName: tempLabel.trim() || c.defaultName } : c))
    );
    setEditingId(null);
  };

  const handleSaveVariable = () => {
    const clusterMap: Record<string, string> = {};
    clusters.forEach((c) => {
      clusterMap[c.id] = c.customName || c.defaultName;
    });

    if (onSaveToDataset) {
      onSaveToDataset(variableName, clusterMap);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-5 shadow-xl space-y-5 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-quantara-800 pb-4">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400" />
            Cluster Variable Management & Case Membership Table
          </h3>
          <p className="text-[11px] text-quantara-400 mt-0.5">
            Rename cluster solution labels & add derived cluster membership variable to active dataset
          </p>
        </div>

        {/* Action: Save Variable to Dataset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-quantara-950 px-3 py-1.5 rounded-lg border border-quantara-700">
            <span className="text-xs text-quantara-400 font-mono">Var Name:</span>
            <input
              type="text"
              value={variableName}
              onChange={(e) => setVariableName(e.target.value)}
              className="bg-transparent text-xs text-white font-mono outline-none w-36 font-bold"
            />
          </div>

          <Button
            onClick={handleSaveVariable}
            variant="primary"
            size="sm"
            className="flex items-center gap-1.5 shadow-lg"
          >
            {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Database className="w-3.5 h-3.5" />}
            {saveSuccess ? 'Saved to Dataset!' : 'Save Cluster Variable'}
          </Button>
        </div>
      </div>

      {/* Cluster Label Customization List */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-bold text-quantara-300 uppercase tracking-wider">
          Custom Cluster Naming / Semantic Labels
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {clusters.map((c) => (
            <div key={c.id} className="p-3 bg-quantara-950 border border-quantara-800 rounded-xl space-y-1.5">
              <div className="text-[10px] font-mono text-quantara-400 flex items-center justify-between">
                <span>{c.defaultName}</span>
                <span className="text-emerald-400 font-bold">{c.count} cases</span>
              </div>

              {editingId === c.id ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempLabel}
                    onChange={(e) => setTempLabel(e.target.value)}
                    className="w-full bg-quantara-900 border border-blue-500 rounded text-xs text-white px-2 py-1 outline-none font-sans font-bold"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveRename(c.id)}
                    className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => handleStartRename(c)}
                  className="group flex items-center justify-between cursor-pointer hover:bg-quantara-900 p-1.5 rounded transition border border-transparent hover:border-quantara-700"
                >
                  <span className="text-xs font-bold text-white font-sans truncate">{c.customName}</span>
                  <Edit2 className="w-3 h-3 text-quantara-500 group-hover:text-blue-400 flex-shrink-0" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Case-Level Preview Table */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-bold text-quantara-300 uppercase tracking-wider">
          Sample Observation Cluster Assignment & Centroid Distance Preview
        </h4>
        <div className="overflow-x-auto border border-quantara-800 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-quantara-950 border-b border-quantara-800 text-quantara-300 font-mono text-[11px]">
                <th className="p-3 font-semibold">Case Identifier</th>
                <th className="p-3 font-semibold">Assigned Cluster</th>
                <th className="p-3 font-semibold text-right">Distance to Centroid</th>
                <th className="p-3 font-semibold text-right">2nd Nearest Cluster</th>
                <th className="p-3 font-semibold text-right">2nd Distance</th>
                <th className="p-3 font-semibold text-right text-emerald-400">Silhouette (s_i)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-quantara-800 text-quantara-200 font-mono">
              {rows.map((r, idx) => (
                <tr key={idx} className="hover:bg-quantara-800/50 transition">
                  <td className="p-3 font-bold text-white">{r.caseId}</td>
                  <td className="p-3 font-sans">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {r.assignedClusterName}
                    </span>
                  </td>
                  <td className="p-3 text-right text-white font-bold">{r.distanceToCentroid.toFixed(3)}</td>
                  <td className="p-3 text-right text-quantara-400 font-sans">{r.nearestNeighborCluster}</td>
                  <td className="p-3 text-right text-quantara-400">{r.secondDistance.toFixed(3)}</td>
                  <td className="p-3 text-right text-emerald-400 font-bold">{r.silhouetteIndex.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
