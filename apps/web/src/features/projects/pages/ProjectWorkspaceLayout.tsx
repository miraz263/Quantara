import React, { useEffect, useState } from 'react';
import { useParams, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Project } from '../types/projectTypes';
import { ProjectService } from '../services/projectService';
import { ProjectHeader } from '../components/ProjectHeader';
import { LayoutDashboard, FileSpreadsheet, Calculator, BarChart3, BookOpen, FolderArchive, Activity, Settings, AlertCircle } from 'lucide-react';
import { useQuantaraStore } from '../../../store/useQuantaraStore';

export const ProjectWorkspaceLayout: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { setIsUploadModalOpen, setIsAnalysisModalOpen } = useQuantaraStore();

  useEffect(() => {
    async function load() {
      if (!projectId) return;
      setIsLoading(true);
      const found = await ProjectService.getProject(projectId);
      setProject(found);
      setIsLoading(false);
    }
    load();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-quantara-950 text-quantara-400 font-mono text-xs">
        Loading Quantara Project Workspace...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-quantara-950 p-8 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-rose-400" />
        <h3 className="text-base font-bold text-white">Project Not Found</h3>
        <p className="text-xs text-quantara-400">The requested project workspace ID does not exist or has been removed.</p>
        <button onClick={() => navigate('/projects')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold">
          Back to Projects List
        </button>
      </div>
    );
  }

  const tabs = [
    { label: 'Overview', icon: LayoutDashboard, path: `/projects/${project.id}/overview` },
    { label: 'Datasets', icon: FileSpreadsheet, path: `/projects/${project.id}/datasets` },
    { label: 'Analyses', icon: Calculator, path: `/projects/${project.id}/analyses` },
    { label: 'Visualizations', icon: BarChart3, path: `/projects/${project.id}/visualizations` },
    { label: 'Reports', icon: BookOpen, path: `/projects/${project.id}/reports` },
    { label: 'Files', icon: FolderArchive, path: `/projects/${project.id}/files` },
    { label: 'Activity', icon: Activity, path: `/projects/${project.id}/activity` },
    { label: 'Settings', icon: Settings, path: `/projects/${project.id}/settings` },
  ];

  return (
    <div className="flex flex-col h-full bg-quantara-950 overflow-hidden font-sans">
      {/* Project Header */}
      <ProjectHeader
        project={project}
        onImportData={() => setIsUploadModalOpen(true)}
        onNewAnalysis={() => setIsAnalysisModalOpen(true)}
        onNewVisualization={() => navigate(`/projects/${project.id}/visualizations`)}
      />

      {/* Sub-Navigation Bar */}
      <div className="bg-quantara-900 border-b border-quantara-800 px-6 py-1.5 flex items-center gap-1 overflow-x-auto shadow-inner text-xs">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <NavLink
              key={t.label}
              to={t.path}
              className={({ isActive }) => `flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-quantara-300 hover:bg-quantara-800 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-hidden relative">
        <Outlet context={{ project }} />
      </div>
    </div>
  );
};
