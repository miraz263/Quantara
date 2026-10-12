import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OutlierProfile } from '../types/profilingTypes';
import { ProfilingService } from '../services/profilingService';
import { OutlierScatterChart } from '../components/OutlierScatterChart';
import { AlertCircle, Database, Layers, ArrowRight, Eye, Sliders } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const ProfileOutliersPage: React.FC = () => {
  const { projectId, datasetId } = useParams<{ projectId: string; datasetId: string }>();
  const navigate = useNavigate();

  const [outlierData, setOutlierData] = useState<OutlierProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<'IQR Rule' | 'Z-Score' | 'Modified Z-Score' | 'Percentile'>('IQR Rule');

  useEffect(() => {
    const loadOutliers = async () => {
      setLoading(true);
      try {
        const data = await ProfilingService.getOutlierProfile(datasetId);
        setOutlierData(data);
      } catch (err) {
        console.error('Failed to load outlier profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOutliers();
  }, [datasetId]);

  if (loading || !outlierData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-quantara-400">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-3" />
        <span className="text-xs">Computing statistical outlier boundaries...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Top Controls & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-quantara-400 font-medium">Flagged Outlier Points</div>
            <div className="text-xl font-bold text-amber-400 font-mono mt-1">
              {outlierData.totalOutliers}
            </div>
          </div>
          <div className="p-3 bg-amber-950/80 border border-amber-800 text-amber-400 rounded-lg">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-quantara-400 font-medium">Affected Numeric Variables</div>
            <div className="text-xl font-bold text-white font-mono mt-1">
              {outlierData.affectedVariablesCount}
            </div>
          </div>
          <div className="p-3 bg-indigo-950/80 border border-indigo-800 text-indigo-400 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-quantara-400 font-medium">Extreme Observations (&gt;3 IQR)</div>
            <div className="text-xl font-bold text-rose-400 font-mono mt-1">
              {outlierData.extremeCount}
            </div>
          </div>
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-400 rounded-lg">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Detection Method Toolbar */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-white">Detection Algorithm:</span>
        </div>

        <div className="flex items-center gap-2">
          {(['IQR Rule', 'Z-Score', 'Modified Z-Score', 'Percentile'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                method === m
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-quantara-950 border border-quantara-700 text-quantara-300 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Main Scatter View */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white border-b border-quantara-800 pb-3">
          Income Outlier Distribution Scatter Plot
        </h3>
        <OutlierScatterChart variableName="income" />
      </div>

      {/* Outlier Items List */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Flagged Extreme Outlier Observations</h3>
            <p className="text-xs text-quantara-400 mt-0.5">
              Specific case rows exceeding statistical interquartile range thresholds.
            </p>
          </div>
          <Button
            onClick={() => navigate(`/projects/${projectId || 'proj-001'}/datasets/${datasetId || 'ds-001'}/data`)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" /> View Outliers in Data Editor
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-quantara-950 text-quantara-400 uppercase font-semibold text-[11px] border-b border-quantara-800 tracking-wider font-mono">
                <th className="py-3 px-4">Variable Name</th>
                <th className="py-3 px-4 font-mono">Row Index</th>
                <th className="py-3 px-4 font-mono">Observed Value</th>
                <th className="py-3 px-4 font-mono">Expected Range</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4 text-right font-sans">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-quantara-800/80 text-slate-200 font-mono">
              {outlierData.outlierList.map((item) => (
                <tr key={item.id} className="hover:bg-quantara-800/40">
                  <td className="py-3 px-4 font-bold text-blue-400 font-sans">{item.variableName}</td>
                  <td className="py-3 px-4 font-bold text-white">Row #{item.rowNumber}</td>
                  <td className="py-3 px-4 text-rose-400 font-bold">{item.value.toLocaleString()}</td>
                  <td className="py-3 px-4 text-quantara-400">{item.expectedRange}</td>
                  <td className="py-3 px-4 text-quantara-300">{item.method}</td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.severity === 'extreme'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => navigate(`/projects/${projectId || 'proj-001'}/datasets/${datasetId || 'ds-001'}/data`)}
                      className="px-2.5 py-1 bg-quantara-800 hover:bg-quantara-700 text-blue-300 rounded text-[11px] font-semibold transition border border-quantara-700 flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3 h-3" /> View Case
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
