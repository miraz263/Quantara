import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  UploadCloud, 
  Calculator, 
  Sparkles, 
  BarChart3, 
  BookOpen, 
  Users, 
  ArrowRight, 
  Activity, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { MOCK_PROJECTS, MOCK_ANALYSES, MOCK_QUALITY_REPORT } from '../mocks/mockData';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-quantara-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans">
            Welcome to Quantara
          </h1>
          <p className="text-xs text-quantara-400 mt-1 font-medium">
            AI-Powered Quantitative Intelligence — <span className="text-blue-400">From Data to Discovery.</span>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/projects/proj-101/data')} variant="secondary" size="sm">
            <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
            Import Dataset
          </Button>
          <Button onClick={() => navigate('/projects/proj-101/analyze')} variant="primary" size="sm">
            <Calculator className="w-3.5 h-3.5" />
            Start Analysis
          </Button>
          <Button onClick={() => navigate('/projects/proj-101/ai')} variant="outline" size="sm" className="border-purple-800 text-purple-300 hover:bg-purple-950">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Ask AI Analyst
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-quantara-400">Total Respondents</span>
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">12,450</div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <span>↑ 100% valid observations</span>
          </p>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-quantara-400">Avg Satisfaction</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">7.21 <span className="text-xs font-normal text-quantara-400">/ 10</span></div>
          <p className="text-[11px] text-quantara-400 mt-1 font-mono">SD = 1.84 (Scale 1-10)</p>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-quantara-400">Analyses Executed</span>
            <Calculator className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">284</div>
          <p className="text-[11px] text-purple-400 mt-1 font-mono">Deterministic Engine v1.0</p>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-quantara-400">Data Quality Score</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{MOCK_QUALITY_REPORT.overall_score}%</div>
          <p className="text-[11px] text-quantara-400 mt-1 font-mono">Completeness {MOCK_QUALITY_REPORT.completeness}%</p>
        </div>
      </div>

      {/* Main Grid: Projects & Recent Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Projects & Insights */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Projects */}
          <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-quantara-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Analytical Projects</h3>
              <button onClick={() => navigate('/projects')} className="text-xs text-blue-400 hover:text-blue-300 font-medium">View All</button>
            </div>

            <div className="space-y-3">
              {MOCK_PROJECTS.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => navigate(`/projects/${proj.id}/data`)}
                  className="p-4 bg-quantara-950/60 border border-quantara-800/80 hover:border-blue-600/60 rounded-lg cursor-pointer transition flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 transition">{proj.name}</h4>
                    <p className="text-[11px] text-quantara-400 line-clamp-1 font-sans">{proj.description}</p>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-quantara-500 pt-1">
                      <span>{proj.dataset_count} Datasets</span>
                      <span>•</span>
                      <span>{proj.analysis_count} Analyses</span>
                      <span>•</span>
                      <span>Updated {new Date(proj.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-quantara-500 group-hover:text-blue-400 transition shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* AI Quick Insights Panel */}
          <div className="bg-quantara-900 border border-purple-900/60 rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold uppercase text-purple-300 tracking-wider">AI Quick Insights</h3>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 font-sans">
              <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-lg flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Customer satisfaction is strongly positively correlated with annual household income (<strong className="font-mono text-blue-300">r = 0.694, p &lt; 0.001</strong>).</span>
              </div>
              <div className="p-3 bg-quantara-950 border border-quantara-800 rounded-lg flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Gender groups show no statistically significant difference in baseline satisfaction (<strong className="font-mono text-amber-300">t(12448) = 0.84, p = 0.401</strong>).</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Recent Analyses */}
        <div className="space-y-8">
          <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-6 shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-quantara-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Analyses</h3>
            </div>

            <div className="space-y-3 flex-1">
              {MOCK_ANALYSES.map((an) => (
                <div
                  key={an.id}
                  onClick={() => navigate(`/projects/${an.project_id}/analyze`)}
                  className="p-3 bg-quantara-950/60 border border-quantara-800/80 hover:border-purple-600/60 rounded-lg cursor-pointer transition space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100 truncate max-w-[180px]">{an.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                      {an.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-quantara-400">
                    <span className="capitalize">{an.analysis_type}</span>
                    <span>{an.execution_time_ms} ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
