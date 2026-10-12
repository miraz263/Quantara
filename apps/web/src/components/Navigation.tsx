import React from 'react';
import { useQuantaraStore } from '../store/useQuantaraStore';
import { 
  Database, 
  Sliders, 
  BarChart3, 
  Sparkles, 
  Plus, 
  Play, 
  BookOpen, 
  FolderKanban, 
  FileSpreadsheet,
  Cpu
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    activeProject, 
    activeDataset,
    datasets,
    setActiveDataset,
    setIsUploadModalOpen,
    setIsAnalysisModalOpen
  } = useQuantaraStore();

  return (
    <header className="bg-quantara-950 border-b border-quantara-800 text-slate-200">
      {/* Top Banner Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-quantara-900 bg-quantara-950">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-white">
            <div className="p-1.5 bg-blue-600 rounded-md shadow-sm">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span>QUANTARA</span>
            <span className="text-xs font-mono px-2 py-0.5 bg-blue-950 text-blue-400 border border-blue-800 rounded">v1.0 AI-Native</span>
          </div>
          <span className="text-quantara-600">|</span>
          <span className="text-xs text-quantara-400 font-medium">From Data to Discovery.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-quantara-800 hover:bg-quantara-700 text-slate-100 rounded border border-quantara-700 transition"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            Import Dataset
          </button>
          
          <button
            onClick={() => setIsAnalysisModalOpen(true)}
            disabled={!activeDataset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded shadow-sm transition"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run Analysis
          </button>
        </div>
      </div>

      {/* Main Navigation Workspace Tabs */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-quantara-900/60">
        <div className="flex items-center gap-1">
          {/* Dataset Selector Dropdown */}
          <div className="flex items-center gap-2 mr-4 px-2.5 py-1 bg-quantara-950 rounded border border-quantara-800">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <select
              className="bg-transparent text-xs font-medium text-slate-200 outline-none cursor-pointer"
              value={activeDataset?.id || ''}
              onChange={(e) => {
                const found = datasets.find(d => d.id === e.target.value);
                if (found) setActiveDataset(found);
              }}
            >
              {datasets.length === 0 ? (
                <option value="">No Dataset Selected</option>
              ) : (
                datasets.map(d => (
                  <option key={d.id} value={d.id} className="bg-quantara-900 text-slate-200">
                    {d.name} ({d.row_count} rows, {d.column_count} cols)
                  </option>
                ))
              )}
            </select>
          </div>

          {/* View Mode Switchers */}
          <button
            onClick={() => setActiveTab('data_view')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition ${
              activeTab === 'data_view' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-quantara-300 hover:bg-quantara-800 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            Data View
          </button>

          <button
            onClick={() => setActiveTab('variable_view')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition ${
              activeTab === 'variable_view' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-quantara-300 hover:bg-quantara-800 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Variable View
          </button>

          <button
            onClick={() => setActiveTab('analyses')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition ${
              activeTab === 'analyses' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-quantara-300 hover:bg-quantara-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Output Viewer
          </button>

          <button
            onClick={() => setActiveTab('visualize')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition ${
              activeTab === 'visualize' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-quantara-300 hover:bg-quantara-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Visualizations
          </button>

          <button
            onClick={() => setActiveTab('ai_copilot')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition ${
              activeTab === 'ai_copilot' 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'text-purple-300 hover:bg-purple-900/40 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            AI Statistical Copilot
          </button>
        </div>

        {/* Project Name Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 text-xs text-quantara-300 bg-quantara-950 rounded border border-quantara-800 font-mono">
          <FolderKanban className="w-3.5 h-3.5 text-blue-400" />
          <span>{activeProject?.name || 'Quantara Project'}</span>
        </div>
      </div>
    </header>
  );
};
