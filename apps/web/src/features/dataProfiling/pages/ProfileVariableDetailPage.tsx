import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VariableProfile } from '../types/profilingTypes';
import { ProfilingService } from '../services/profilingService';
import { DistributionChart } from '../components/DistributionChart';
import { OutlierScatterChart } from '../components/OutlierScatterChart';
import { ArrowLeft, Database, Sliders, Hash, Type, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const ProfileVariableDetailPage: React.FC = () => {
  const { projectId, datasetId, variableId } = useParams<{ projectId: string; datasetId: string; variableId: string }>();
  const navigate = useNavigate();

  const [variable, setVariable] = useState<VariableProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVar = async () => {
      setLoading(true);
      if (!variableId) return;
      try {
        const data = await ProfilingService.getVariableProfile(datasetId || 'ds-001', variableId);
        setVariable(data);
      } catch (err) {
        console.error('Failed to load variable detail:', err);
      } finally {
        setLoading(false);
      }
    };
    loadVar();
  }, [datasetId, variableId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-quantara-400">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-3" />
        <span className="text-xs">Loading variable detailed profile...</span>
      </div>
    );
  }

  if (!variable) {
    return (
      <div className="p-8 text-center space-y-4 text-quantara-400">
        <h3 className="text-base font-bold text-white">Variable Profile Not Found</h3>
        <button
          onClick={() => navigate(`/projects/${projectId}/datasets/${datasetId}/profile/variables`)}
          className="px-4 py-2 bg-quantara-800 text-xs text-white rounded-lg"
        >
          Return to Variable List
        </button>
      </div>
    );
  }

  const isNumeric = variable.dataType === 'integer' || variable.dataType === 'float';

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Top Header & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/projects/${projectId || 'proj-001'}/datasets/${datasetId || 'ds-001'}/profile/variables`)}
          className="flex items-center gap-1.5 text-xs text-quantara-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Variables List
        </button>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate(`/projects/${projectId || 'proj-001'}/datasets/${datasetId || 'ds-001'}/data`)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" /> View Cases in Data Editor
          </Button>

          <Button
            onClick={() => navigate(`/projects/${projectId || 'proj-001'}/datasets/${datasetId || 'ds-001'}/data/variables`)}
            variant="primary"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" /> Edit Metadata in Variable View
          </Button>
        </div>
      </div>

      {/* Header Info Card */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-white font-mono">{variable.name}</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-quantara-800 text-quantara-300 border border-quantara-700 uppercase">
                {variable.dataType}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                  variable.measure === 'scale'
                    ? 'bg-blue-950 text-blue-300 border-blue-800'
                    : variable.measure === 'ordinal'
                    ? 'bg-purple-950 text-purple-300 border-purple-800'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}
              >
                {variable.measure}
              </span>
            </div>
            <p className="text-xs text-quantara-300 mt-1">{variable.label || 'No label specified.'}</p>
          </div>

          <div className="flex items-center gap-2">
            {variable.qualityStatus === 'good' && (
              <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Quality: Good
              </span>
            )}
            {variable.qualityStatus === 'warning' && (
              <span className="px-3 py-1 bg-amber-950 text-amber-400 border border-amber-800 rounded-full text-xs font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Quality: Warning
              </span>
            )}
            {variable.qualityStatus === 'critical' && (
              <span className="px-3 py-1 bg-rose-950 text-rose-400 border border-rose-800 rounded-full text-xs font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Quality: Critical
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Statistics & Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics Table */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-quantara-800 pb-3">
            Descriptive Statistics Summary
          </h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-quantara-800/60">
              <span className="text-quantara-400 font-sans">Total Observations:</span>
              <span className="text-white font-bold">{variable.totalCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-quantara-800/60">
              <span className="text-quantara-400 font-sans">Valid Non-Null:</span>
              <span className="text-emerald-400 font-bold">{variable.nonNullCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-quantara-800/60">
              <span className="text-quantara-400 font-sans">Missing Count (%):</span>
              <span className={variable.missingCount > 0 ? 'text-amber-400 font-bold' : 'text-white'}>
                {variable.missingCount} ({variable.missingPercentage}%)
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-quantara-800/60">
              <span className="text-quantara-400 font-sans">Unique Categories / Values:</span>
              <span className="text-white font-bold">{variable.uniqueCount.toLocaleString()}</span>
            </div>

            {isNumeric && (
              <>
                <div className="flex justify-between py-1.5 border-b border-quantara-800/60">
                  <span className="text-quantara-400 font-sans">Minimum:</span>
                  <span className="text-white font-bold">{variable.min}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-quantara-800/60">
                  <span className="text-quantara-400 font-sans">Maximum:</span>
                  <span className="text-white font-bold">{variable.max}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-quantara-800/60">
                  <span className="text-quantara-400 font-sans">Mean:</span>
                  <span className="text-blue-400 font-bold">{variable.mean}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-quantara-800/60">
                  <span className="text-quantara-400 font-sans">Median (50th %):</span>
                  <span className="text-white font-bold">{variable.median}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-quantara-800/60">
                  <span className="text-quantara-400 font-sans">Standard Deviation:</span>
                  <span className="text-white font-bold">{variable.stdDev}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-quantara-800/60">
                  <span className="text-quantara-400 font-sans">IQR (Q3 - Q1):</span>
                  <span className="text-white font-bold">{variable.iqr}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-quantara-800/60">
                  <span className="text-quantara-400 font-sans">Skewness:</span>
                  <span className="text-white font-bold">{variable.skewness}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-quantara-800/60">
                  <span className="text-quantara-400 font-sans">Outlier Count:</span>
                  <span className={(variable.outlierCount || 0) > 0 ? 'text-rose-400 font-bold' : 'text-white'}>
                    {variable.outlierCount || 0}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Visual Charts Container */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-quantara-800 pb-3">
              Distribution Histogram / Frequency Profile
            </h3>
            {isNumeric ? (
              <DistributionChart
                categories={['10-25', '25-40', '40-55', '55-70', '70-85', '85-100', '100+']}
                values={[1400, 8900, 10200, 3100, 850, 120, 14]}
                color="#3b82f6"
              />
            ) : variable.topCategories ? (
              <DistributionChart
                categories={variable.topCategories.map((c) => c.category)}
                values={variable.topCategories.map((c) => c.count)}
                color="#10b981"
              />
            ) : null}
          </div>

          {isNumeric && (variable.outlierCount || 0) > 0 && (
            <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white border-b border-quantara-800 pb-3">
                Outlier Scatter Plot ({variable.name})
              </h3>
              <OutlierScatterChart variableName={variable.name} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
