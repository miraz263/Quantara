import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DatasetProfile, QualityIssue } from '../types/profilingTypes';
import { ProfilingService } from '../services/profilingService';
import { QualityGauge } from '../components/QualityGauge';
import { IssueDetailModal } from '../components/IssueDetailModal';
import { Database, Layers, FileSpreadsheet, Activity, AlertCircle, AlertTriangle, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const ProfileOverviewPage: React.FC = () => {
  const { projectId, datasetId } = useParams<{ projectId: string; datasetId: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<DatasetProfile | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<QualityIssue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await ProfilingService.getProfile(datasetId);
        setProfile(data);
      } catch (err) {
        console.error('Failed to load dataset profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [datasetId]);

  if (loading || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-quantara-400">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-3" />
        <span className="text-xs">Computing dataset profile diagnostics...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6 font-sans">
      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-quantara-400 font-medium">Total Cases (Rows)</div>
            <div className="text-xl font-bold text-white font-mono mt-1">
              {profile.rowCount.toLocaleString()}
            </div>
          </div>
          <div className="p-3 bg-blue-950/80 border border-blue-800 text-blue-400 rounded-lg">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-quantara-400 font-medium">Total Variables (Cols)</div>
            <div className="text-xl font-bold text-white font-mono mt-1">{profile.columnCount}</div>
          </div>
          <div className="p-3 bg-indigo-950/80 border border-indigo-800 text-indigo-400 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-quantara-400 font-medium">Complete Cells Rate</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
              {(100 - profile.missingPercentage).toFixed(1)}%
            </div>
          </div>
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-quantara-400 font-medium">Data Quality Index</div>
            <div className="text-xl font-bold text-white font-mono mt-1">
              {profile.qualityScore.overall}/100
            </div>
          </div>
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Row: Quality Gauge & Type Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quality Gauge */}
        <div className="lg:col-span-2">
          <QualityGauge score={profile.qualityScore} />
        </div>

        {/* Data Type & Anomaly Summary Card */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-quantara-800 pb-3">
            Dataset Composition Breakdown
          </h3>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between p-2 rounded bg-quantara-950 border border-quantara-800">
              <span className="text-quantara-300 font-sans">Numeric Variables:</span>
              <strong className="text-blue-400">{profile.numericVariablesCount}</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-quantara-950 border border-quantara-800">
              <span className="text-quantara-300 font-sans">Categorical Variables:</span>
              <strong className="text-emerald-400">{profile.categoricalVariablesCount}</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-quantara-950 border border-quantara-800">
              <span className="text-quantara-300 font-sans">Date/Time Variables:</span>
              <strong className="text-purple-400">{profile.dateVariablesCount}</strong>
            </div>
            <div className="flex justify-between p-2 rounded bg-quantara-950 border border-quantara-800">
              <span className="text-quantara-300 font-sans">Boolean Flags:</span>
              <strong className="text-amber-400">{profile.booleanVariablesCount}</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-quantara-800 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-quantara-400">
              <span className="font-sans">Constant Variables:</span>
              <strong className="text-amber-400">{profile.constantVariablesCount}</strong>
            </div>
            <div className="flex justify-between text-quantara-400">
              <span className="font-sans">High-Cardinality:</span>
              <strong className="text-indigo-400">{profile.highCardinalityVariablesCount}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Issues Section */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Automated Data Quality Diagnostics ({profile.issues.length} Issues)
            </h3>
            <p className="text-xs text-quantara-400 mt-0.5">
              Identified completeness anomalies, outlier observations, and metadata warnings.
            </p>
          </div>

          <button
            onClick={() => navigate(`/projects/${projectId || 'proj-001'}/datasets/${datasetId || 'ds-001'}/profile/quality`)}
            className="text-xs text-blue-400 hover:underline font-semibold flex items-center gap-1"
          >
            View All Issues <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => setSelectedIssue(issue)}
              className="p-4 bg-quantara-950 border border-quantara-800 hover:border-quantara-700 rounded-xl transition cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                      issue.severity === 'critical'
                        ? 'bg-rose-950/80 text-rose-400 border-rose-800'
                        : issue.severity === 'warning'
                        ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                        : 'bg-blue-950/80 text-blue-400 border-blue-800'
                    }`}
                  >
                    {issue.severity}
                  </span>

                  {issue.variableName && (
                    <span className="text-[11px] font-mono font-semibold text-blue-400">
                      {issue.variableName}
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition">
                  {issue.title}
                </h4>
                <p className="text-[11px] text-quantara-400 line-clamp-2 leading-relaxed font-sans">
                  {issue.description}
                </p>
              </div>

              <div className="pt-2 border-t border-quantara-800/60 flex items-center justify-between text-[11px] text-blue-400 font-semibold">
                <span>Inspect Recommendation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onNavigateToDataEditor={(vName) => {
            setSelectedIssue(null);
            navigate(`/projects/${projectId || 'proj-001'}/datasets/${datasetId || 'ds-001'}/data`);
          }}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
};
