import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, ProjectFilters, ProjectSortOption } from '../types/projectTypes';
import { ProjectService } from '../services/projectService';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectFilterToolbar } from '../components/ProjectFilterToolbar';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { ConfirmArchiveModal } from '../components/ConfirmArchiveModal';
import { FolderKanban, Plus, FileSpreadsheet, Calculator, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ProjectFilters>({
    searchQuery: '',
    status: 'all',
    visibility: 'all',
    owner: 'all',
    updatedTimeframe: 'all'
  });

  const [sort, setSort] = useState<ProjectSortOption>('recently_updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [archivingProject, setArchivingProject] = useState<Project | null>(null);

  const loadProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ProjectService.getProjects(filters, sort);
      setProjects(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [filters, sort]);

  const handleCreateProject = async (data: any) => {
    const created = await ProjectService.createProject(data);
    await loadProjects();
    navigate(`/projects/${created.id}/overview`);
  };

  const handleDuplicate = async (id: string) => {
    const duplicated = await ProjectService.duplicateProject(id);
    await loadProjects();
    navigate(`/projects/${duplicated.id}/overview`);
  };

  const handleArchiveConfirm = async (id: string) => {
    await ProjectService.archiveProject(id);
    await loadProjects();
  };

  const handleDeleteConfirm = async (id: string) => {
    await ProjectService.deleteProject(id);
    await loadProjects();
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      status: 'all',
      visibility: 'all',
      owner: 'all',
      updatedTimeframe: 'all'
    });
    setSort('recently_updated');
  };

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-quantara-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5 font-sans tracking-tight">
            <FolderKanban className="w-6 h-6 text-blue-400" />
            Quantara Projects Workspace
          </h1>
          <p className="text-xs text-quantara-400 mt-1 font-medium">
            Manage your statistical research, data analysis, econometrics, and biostatistical workspaces.
          </p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)} variant="primary" size="md">
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <ProjectFilterToolbar
        filters={filters}
        onFilterChange={setFilters}
        sort={sort}
        onSortChange={setSort}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReset={handleResetFilters}
      />

      {/* Content Rendering */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-quantara-900 border border-quantara-800 rounded-xl p-6 h-48 animate-pulse space-y-4">
              <div className="h-4 bg-quantara-800 rounded w-3/4" />
              <div className="h-3 bg-quantara-800 rounded w-full" />
              <div className="h-3 bg-quantara-800 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-950/60 border border-red-800 rounded-xl p-8 text-center space-y-3 max-w-lg mx-auto my-12">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Unable to load projects</h3>
          <p className="text-xs text-red-300">{error}</p>
          <Button onClick={loadProjects} variant="secondary" size="sm">
            <RotateCcw className="w-3.5 h-3.5" /> Try Again
          </Button>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-12 text-center space-y-4 max-w-lg mx-auto my-12">
          <FolderKanban className="w-12 h-12 text-quantara-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No projects found</h3>
          <p className="text-xs text-quantara-400 leading-relaxed">
            No Quantara projects matched your active search query or filter criteria. Try clearing your filters or create a new project.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button onClick={handleResetFilters} variant="secondary" size="sm">
              Reset Filters
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)} variant="primary" size="sm">
              <Plus className="w-3.5 h-3.5" /> Create Project
            </Button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onOpen={(id) => navigate(`/projects/${id}/overview`)}
              onDuplicate={handleDuplicate}
              onArchive={(id) => setArchivingProject(proj)}
              onDelete={(id) => setDeletingProject(proj)}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-quantara-900 border border-quantara-800 rounded-xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-quantara-950 text-quantara-400 font-semibold border-b border-quantara-800 uppercase">
                <th className="py-3.5 px-4">Project Name</th>
                <th className="py-3.5 px-4">Owner</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Visibility</th>
                <th className="py-3.5 px-4">Datasets</th>
                <th className="py-3.5 px-4">Analyses</th>
                <th className="py-3.5 px-4">Updated</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-quantara-800 text-slate-200">
              {projects.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}/overview`)}
                  className="hover:bg-quantara-800/50 cursor-pointer transition"
                >
                  <td className="py-3.5 px-4 font-bold text-blue-400">{p.name}</td>
                  <td className="py-3.5 px-4">{p.ownerName}</td>
                  <td className="py-3.5 px-4 capitalize font-mono text-[11px]">{p.status}</td>
                  <td className="py-3.5 px-4 capitalize font-mono text-[11px]">{p.visibility}</td>
                  <td className="py-3.5 px-4 font-mono">{p.datasetCount}</td>
                  <td className="py-3.5 px-4 font-mono">{p.analysisCount}</td>
                  <td className="py-3.5 px-4 font-mono text-quantara-400">{new Date(p.updatedAt).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4 text-right">
                    <ArrowRight className="w-4 h-4 text-quantara-500 hover:text-white inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      <ConfirmArchiveModal
        project={archivingProject}
        isOpen={!!archivingProject}
        onClose={() => setArchivingProject(null)}
        onConfirm={handleArchiveConfirm}
      />

      <ConfirmDeleteModal
        project={deletingProject}
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
