import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Activity, ShieldCheck, Layers, AlertTriangle, RefreshCw, Database, FileSpreadsheet, ArrowLeft } from 'lucide-react';
import { ProfilingService } from '../services/profilingService';

export const ProfileWorkspaceLayout: React.FC = () => {
  const { projectId, datasetId } = useParams<{ projectId: string; datasetId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshStep, setRefreshStep] = useState<string | null>(null);

  const currentTab = location.pathname.endsWith('/variables')
    ? 'variables'
    : location.pathname.endsWith('/missing')
    ? 'missing'
    : location.pathname.endsWith('/outliers')
    ? 'outliers'
    : location.pathname.endsWith('/duplicates')
    ? 'duplicates'
    : location.pathname.endsWith('/quality')
    ? 'quality'
    : 'overview';

  const handleTabChange = (tab: string) => {
    const base = `/projects/${projectId || 'proj-001'}/datasets/${datasetId || 'ds-001'}/profile`;
    if (tab === 'overview') navigate(`${base}/overview`);
    else navigate(`${base}/${tab}`);
  };

  const handleRefreshProfile = async () => {
    setIsRefreshing(true);
    setRefreshStep('Analyzing record cases...');
    await new Promise((res) => setTimeout(res, 250));
    setRefreshStep('Evaluating variable distributions...');
    await new Promise((res) => setTimeout(res, 250));
    setRefreshStep('Checking missingness matrix & outliers...');
    await new Promise((res) => setTimeout(res, 250));
    setRefreshStep('Calculating quality scores...');
    await ProfilingService.refreshProfile(datasetId);
    setIsRefreshing(false);
    setRefreshStep(null);
  };

  return (
    <div className="flex flex-col h-full bg-quantara-950 overflow-hidden font-sans">
      {/* Workspace Header */}
      <div className="bg-quantara-950 border-b border-quantara-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(`/projects/${projectId || 'proj-001'}/datasets/${datasetId || 'ds-001'}`)}
            className="flex items-center gap-1.5 text-xs text-quantara-400 hover:text-white transition font-medium mb-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dataset Details
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Activity className="w-6 h-6 text-blue-400" />
              Data Profiling & Diagnostics Workspace
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
              ● Analysis Ready
            </span>
          </div>
          <p className="text-xs text-quantara-400 mt-1">
            Automated statistical summaries, distribution profiles, missingness patterns, and quality verification.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/projects/${projectId || 'proj-001'}/datasets/${datasetId || 'ds-001'}/data`)}
            className="px-3.5 py-2 bg-quantara-900 hover:bg-quantara-800 text-white rounded-lg text-xs font-semibold border border-quantara-700 transition flex items-center gap-2"
          >
            <Database className="w-4 h-4 text-blue-400" /> Open Data Editor
          </button>

          <button
            onClick={handleRefreshProfile}
            disabled={isRefreshing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg transition flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? refreshStep || 'Refreshing Profile...' : 'Refresh Profile'}
          </button>
        </div>
      </div>

      {/* Profile Sub-Tab Bar */}
      <div className="bg-quantara-900 border-b border-quantara-800 px-6 flex border-b gap-6 text-xs font-semibold">
        <button
          onClick={() => handleTabChange('overview')}
          className={`py-3 transition border-b-2 ${
            currentTab === 'overview'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-quantara-400 hover:text-white'
          }`}
        >
          Overview & KPIs
        </button>

        <button
          onClick={() => handleTabChange('variables')}
          className={`py-3 transition border-b-2 ${
            currentTab === 'variables'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-quantara-400 hover:text-white'
          }`}
        >
          Variable Profiles
        </button>

        <button
          onClick={() => handleTabChange('missing')}
          className={`py-3 transition border-b-2 ${
            currentTab === 'missing'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-quantara-400 hover:text-white'
          }`}
        >
          Missingness (3.8%)
        </button>

        <button
          onClick={() => handleTabChange('outliers')}
          className={`py-3 transition border-b-2 ${
            currentTab === 'outliers'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-quantara-400 hover:text-white'
          }`}
        >
          Outliers (318)
        </button>

        <button
          onClick={() => handleTabChange('duplicates')}
          className={`py-3 transition border-b-2 ${
            currentTab === 'duplicates'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-quantara-400 hover:text-white'
          }`}
        >
          Duplicates (124)
        </button>

        <button
          onClick={() => handleTabChange('quality')}
          className={`py-3 transition border-b-2 ${
            currentTab === 'quality'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-quantara-400 hover:text-white'
          }`}
        >
          Quality Checks & Issues (14)
        </button>
      </div>

      {/* Main Outlet for Profile Views */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
