import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Plus, FileSpreadsheet, Calculator, Users, ArrowRight } from 'lucide-react';
import { MOCK_PROJECTS } from '../mocks/mockData';
import { Button } from '../components/ui/Button';

export const ProjectsList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-blue-400" />
            Quantara Projects Workspace
          </h1>
          <p className="text-xs text-quantara-400 mt-1">
            Manage quantitative research projects, datasets, analysis outputs, and team workspaces.
          </p>
        </div>

        <Button onClick={() => navigate('/projects/proj-101/data')} variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" />
          Create New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROJECTS.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}/data`)}
            className="bg-quantara-900 border border-quantara-800 hover:border-blue-500/80 rounded-xl p-6 shadow-xl cursor-pointer transition flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded">
                  {project.status}
                </span>
                <span className="text-[10px] font-mono text-quantara-400">
                  Updated {new Date(project.updated_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">{project.name}</h3>
              <p className="text-xs text-quantara-300 line-clamp-2 leading-relaxed font-sans">{project.description}</p>
            </div>

            <div className="pt-4 border-t border-quantara-800/80 flex items-center justify-between text-xs text-quantara-400 font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  {project.dataset_count}
                </span>
                <span className="flex items-center gap-1">
                  <Calculator className="w-3.5 h-3.5 text-purple-400" />
                  {project.analysis_count}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  {project.collaborator_count}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-quantara-500 group-hover:text-blue-400 transition" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
