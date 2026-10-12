import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MissingProfile } from '../types/profilingTypes';
import { ProfilingService } from '../services/profilingService';
import { MissingnessBarChart } from '../components/MissingnessBarChart';
import { MissingnessHeatmap } from '../components/MissingnessHeatmap';
import { Database, HelpCircle, Layers, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const ProfileMissingPage: React.FC = () => {
  const { projectId, datasetId } = useParams<{ projectId: string; datasetId: string }>();
  const navigate = useNavigate();

  const [missingData, setMissingData] = useState<MissingProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMissing = async () => {
      setLoading(true);
      try {
        const data = await ProfilingService.getMissingProfile(datasetId);
        setMissingData(data);
      } catch (err) {
        console.error('Failed to load missingness profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMissing();
  }, [datasetId]);

  if (loading || !missingData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-quantara-400">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-3" />
        <span className="text-xs">Analyzing missingness patterns...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-quantara-400 font-medium">Missing Cells Rate</div>
            <div className="text-xl font-bold text-amber-400 font-mono mt-1">
              {missingData.missingPercentage}%
            </div>
          </div>
          <div className="p-3 bg-amber-950/80 border border-amber-800 text-amber-400 rounded-lg">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-quantara-400 font-medium">Variables With Missing</div>
            <div className="text-xl font-bold text-white font-mono mt-1">
              {missingData.variablesWithMissingCount}
            </div>
          </div>
          <div className="p-3 bg-indigo-950/80 border border-indigo-800 text-indigo-400 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-quantara-400 font-medium">Complete Cases / Rows</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
              {missingData.completeRows.toLocaleString()}
            </div>
          </div>
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-quantara-400 font-medium">Rows With $\ge 1$ Missing</div>
            <div className="text-xl font-bold text-rose-400 font-mono mt-1">
              {missingData.rowsWithMissing.toLocaleString()}
            </div>
          </div>
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-400 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missingness Bar Chart */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white border-b border-quantara-800 pb-3">
            Variables Sorted by Missing % Rate
          </h3>
          <MissingnessBarChart data={missingData.variableMissingList} />
        </div>

        {/* Missingness Heatmap */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-3">
          <h3 className="text-sm font-bold text-white border-b border-quantara-800 pb-3">
            Missingness Distribution Matrix Heatmap
          </h3>
          <MissingnessHeatmap />
        </div>
      </div>

      {/* Missingness Patterns Breakdown Table */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Combinatorial Missingness Patterns</h3>
            <p className="text-xs text-quantara-400 mt-0.5">
              Identified co-occurrence patterns of missing variables across cases.
            </p>
          </div>
          <Button
            onClick={() => navigate(`/projects/${projectId || 'proj-001'}/datasets/${datasetId || 'ds-001'}/data`)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" /> Filter Missing Cases in Data Editor
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-quantara-950 text-quantara-400 uppercase font-semibold text-[11px] border-b border-quantara-800 tracking-wider font-mono">
                <th className="py-3 px-4">Pattern Name</th>
                <th className="py-3 px-4 font-mono">Row Count</th>
                <th className="py-3 px-4 font-mono">Percentage</th>
                <th className="py-3 px-4">Co-Occurring Missing Variables</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-quantara-800/80 text-slate-200 font-mono">
              {missingData.patterns.map((p, idx) => (
                <tr key={idx} className="hover:bg-quantara-800/40 font-sans">
                  <td className="py-3 px-4 font-bold text-white">{p.patternName}</td>
                  <td className="py-3 px-4 font-mono text-slate-200">{p.rowCount.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-amber-400 font-bold">{p.percentage}%</td>
                  <td className="py-3 px-4 font-mono text-xs text-quantara-300">
                    {p.variables.length === 0 ? (
                      <span className="text-emerald-400 font-normal">None (Complete case)</span>
                    ) : (
                      p.variables.join(', ')
                    )}
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
