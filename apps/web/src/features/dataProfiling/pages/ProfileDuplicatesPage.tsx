import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DuplicateProfile } from '../types/profilingTypes';
import { ProfilingService } from '../services/profilingService';
import { Copy, Database, Layers, CheckCircle2, Eye, Sliders } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const ProfileDuplicatesPage: React.FC = () => {
  const { projectId, datasetId } = useParams<{ projectId: string; datasetId: string }>();
  const navigate = useNavigate();

  const [duplicateData, setDuplicateData] = useState<DuplicateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [keyStrategy, setKeyStrategy] = useState<'all' | 'id_keys'>('id_keys');

  useEffect(() => {
    const loadDuplicates = async () => {
      setLoading(true);
      try {
        const data = await ProfilingService.getDuplicateProfile(datasetId);
        setDuplicateData(data);
      } catch (err) {
        console.error('Failed to load duplicate profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDuplicates();
  }, [datasetId]);

  if (loading || !duplicateData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-quantara-400">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-3" />
        <span className="text-xs">Scanning record uniqueness...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-quantara-400 font-medium">Duplicate Rows Identified</div>
            <div className="text-xl font-bold text-amber-400 font-mono mt-1">
              {duplicateData.duplicateRowsCount}
            </div>
          </div>
          <div className="p-3 bg-amber-950/80 border border-amber-800 text-amber-400 rounded-lg">
            <Copy className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-quantara-400 font-medium">Duplicate Match Groups</div>
            <div className="text-xl font-bold text-white font-mono mt-1">
              {duplicateData.duplicateGroupsCount}
            </div>
          </div>
          <div className="p-3 bg-indigo-950/80 border border-indigo-800 text-indigo-400 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-quantara-400 font-medium">Unique Case Records</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
              {duplicateData.uniqueRowsCount.toLocaleString()}
            </div>
          </div>
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Duplicate Strategy Toolbar */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-white">Matching Criteria Strategy:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setKeyStrategy('id_keys')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              keyStrategy === 'id_keys'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-quantara-950 border border-quantara-700 text-quantara-300 hover:text-white'
            }`}
          >
            Identifier Keys (patient_id + visit_date)
          </button>
          <button
            onClick={() => setKeyStrategy('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              keyStrategy === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-quantara-950 border border-quantara-700 text-quantara-300 hover:text-white'
            }`}
          >
            All Dataset Columns
          </button>
        </div>
      </div>

      {/* Duplicate Groups List Table */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Identified Duplicate Groups</h3>
            <p className="text-xs text-quantara-400 mt-0.5">
              Groups of rows sharing identical key attributes.
            </p>
          </div>
          <Button
            onClick={() => navigate(`/projects/${projectId || 'proj-001'}/datasets/${datasetId || 'ds-001'}/data`)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" /> Open Duplicates in Data Editor
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-quantara-950 text-quantara-400 uppercase font-semibold text-[11px] border-b border-quantara-800 tracking-wider font-mono">
                <th className="py-3 px-4">Group ID</th>
                <th className="py-3 px-4 font-mono">Row Numbers</th>
                <th className="py-3 px-4 font-mono">Matching Key Specification</th>
                <th className="py-3 px-4 font-mono">Duplicates Count</th>
                <th className="py-3 px-4 text-right font-sans">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-quantara-800/80 text-slate-200 font-mono">
              {duplicateData.groups.map((group) => (
                <tr key={group.groupId} className="hover:bg-quantara-800/40">
                  <td className="py-3.5 px-4 font-bold text-blue-400 font-sans">{group.groupId}</td>
                  <td className="py-3.5 px-4 text-amber-400 font-bold">
                    Rows #{group.matchingRowNumbers.join(', #')}
                  </td>
                  <td className="py-3.5 px-4 text-quantara-300 font-sans">{group.matchKey}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{group.rowCount} records</td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <button
                      onClick={() => navigate(`/projects/${projectId || 'proj-001'}/datasets/${datasetId || 'ds-001'}/data`)}
                      className="px-2.5 py-1 bg-quantara-800 hover:bg-quantara-700 text-blue-300 rounded text-[11px] font-semibold transition border border-quantara-700 flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3 h-3" /> Inspect Group
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
