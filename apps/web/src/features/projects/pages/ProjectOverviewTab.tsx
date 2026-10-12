import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Project } from '../types/projectTypes';
import { FileSpreadsheet, Calculator, BarChart3, BookOpen, Clock, Plus, UploadCloud, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MOCK_DATASETS, MOCK_ANALYSES } from '../../../mocks/mockData';
import { Button } from '../../../components/ui/Button';

export const ProjectOverviewTab: React.FC = () => {
  const { project } = useOutletContext<{ project: Project }>();
  const navigate = useNavigate();

  const activities = [
    { text: 'Dataset "patient_survey.csv" imported', time: '2 hours ago' },
    { text: 'OLS Linear Regression analysis executed', time: '5 hours ago' },
    { text: 'Correlation matrix visualization updated', time: 'Yesterday' },
    { text: 'Executive research summary report exported (PDF)', time: 'Yesterday' }
  ];

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-quantara-400">Datasets</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">{project.datasetCount}</div>
          </div>
          <div className="p-3 bg-emerald-950 rounded-xl border border-emerald-800 text-emerald-400">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-quantara-400">Analyses</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">{project.analysisCount}</div>
          </div>
          <div className="p-3 bg-purple-950 rounded-xl border border-purple-800 text-purple-400">
            <Calculator className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-quantara-400">Visualizations</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">{project.visualizationCount}</div>
          </div>
          <div className="p-3 bg-blue-950 rounded-xl border border-blue-800 text-blue-400">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-quantara-400">Reports</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">{project.reportCount}</div>
          </div>
          <div className="p-3 bg-amber-950 rounded-xl border border-amber-800 text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Activity & Datasets/Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Datasets & Analyses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Datasets Table */}
          <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-quantara-800">
              <h3 className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Recent Datasets
              </h3>
              <button onClick={() => navigate(`/projects/${project.id}/datasets`)} className="text-xs text-blue-400 hover:underline">
                View All Datasets
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-quantara-950 text-quantara-400 uppercase font-semibold border-b border-quantara-800">
                    <th className="py-2.5 px-3">Dataset</th>
                    <th className="py-2.5 px-3 font-mono">Rows</th>
                    <th className="py-2.5 px-3 font-mono">Cols</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-quantara-800 text-slate-200 font-mono">
                  {MOCK_DATASETS.map((ds) => (
                    <tr key={ds.id} className="hover:bg-quantara-800/40 transition">
                      <td className="py-2.5 px-3 font-bold text-blue-400 font-sans">{ds.name}</td>
                      <td className="py-2.5 px-3">{ds.row_count.toLocaleString()}</td>
                      <td className="py-2.5 px-3">{ds.column_count}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[10px]">
                          READY
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-quantara-400">{new Date(ds.updated_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Analyses Table */}
          <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-quantara-800">
              <h3 className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-2">
                <Calculator className="w-4 h-4 text-purple-400" />
                Recent Analyses
              </h3>
              <button onClick={() => navigate(`/projects/${project.id}/analyses`)} className="text-xs text-blue-400 hover:underline">
                View All Analyses
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-quantara-950 text-quantara-400 uppercase font-semibold border-b border-quantara-800">
                    <th className="py-2.5 px-3">Analysis Name</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 font-mono">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-quantara-800 text-slate-200">
                  {MOCK_ANALYSES.map((an) => (
                    <tr key={an.id} className="hover:bg-quantara-800/40 transition">
                      <td className="py-2.5 px-3 font-bold text-white">{an.name}</td>
                      <td className="py-2.5 px-3 capitalize font-mono text-[11px] text-purple-300">{an.analysis_type}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[10px] font-mono">
                          COMPLETED
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-quantara-400">{an.execution_time_ms} ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase text-white tracking-wider">Quick Actions</h3>
            <div className="space-y-2">
              <Button onClick={() => navigate(`/projects/${project.id}/datasets`)} variant="secondary" size="sm" className="w-full justify-start">
                <UploadCloud className="w-3.5 h-3.5 text-blue-400" /> Import Dataset
              </Button>
              <Button onClick={() => navigate(`/projects/${project.id}/analyses`)} variant="secondary" size="sm" className="w-full justify-start">
                <Calculator className="w-3.5 h-3.5 text-purple-400" /> Create Analysis
              </Button>
              <Button onClick={() => navigate(`/projects/${project.id}/visualizations`)} variant="secondary" size="sm" className="w-full justify-start">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> Create Visualization
              </Button>
              <Button onClick={() => navigate(`/projects/${project.id}/reports`)} variant="secondary" size="sm" className="w-full justify-start">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Create Report
              </Button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Recent Activity
            </h3>
            <div className="space-y-3 font-sans">
              {activities.map((act, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="leading-snug">{act.text}</p>
                    <span className="text-[10px] text-quantara-500 font-mono">{act.time}</span>
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
