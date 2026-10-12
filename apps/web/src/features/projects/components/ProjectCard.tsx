import React from 'react';
import { Project } from '../types/projectTypes';
import { ProjectContextMenu } from './ProjectContextMenu';
import { FileSpreadsheet, Calculator, BarChart3, BookOpen, Clock, User, Shield, Tag, ArrowRight } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';

interface ProjectCardProps {
  project: Project;
  onOpen: (id: string) => void;
  onRename?: (project: Project) => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpen,
  onRename,
  onDuplicate,
  onArchive,
  onDelete
}) => {
  const statusVariant = project.status === 'active' ? 'emerald' : project.status === 'draft' ? 'amber' : 'gray';

  return (
    <div
      onClick={() => onOpen(project.id)}
      className="bg-quantara-900 border border-quantara-800 hover:border-blue-500/80 rounded-xl p-5 shadow-xl cursor-pointer transition group flex flex-col justify-between space-y-4 hover:shadow-2xl relative"
    >
      <div className="space-y-3">
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant}>{project.status.toUpperCase()}</Badge>
            <Badge variant="blue">{project.visibility.toUpperCase()}</Badge>
          </div>

          <ProjectContextMenu
            project={project}
            onOpen={onOpen}
            onRename={onRename}
            onDuplicate={onDuplicate}
            onArchive={onArchive}
            onDelete={onDelete}
          />
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition font-sans tracking-tight">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-xs text-quantara-300 mt-1 line-clamp-2 leading-relaxed font-sans">
              {project.description}
            </p>
          )}
        </div>

        {/* Owner & Last Updated */}
        <div className="flex items-center justify-between text-[11px] text-quantara-400 font-mono pt-1">
          <span className="flex items-center gap-1 font-sans">
            <User className="w-3 h-3 text-purple-400" />
            {project.ownerName}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-400" />
            Updated {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {project.tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-quantara-950 text-quantara-400 border border-quantara-800 rounded text-[10px] font-mono">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Item Counts Footer */}
      <div className="pt-3 border-t border-quantara-800/80 flex items-center justify-between text-xs text-quantara-300 font-mono">
        <div className="grid grid-cols-4 gap-3">
          <span className="flex items-center gap-1" title="Datasets">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            {project.datasetCount}
          </span>
          <span className="flex items-center gap-1" title="Analyses">
            <Calculator className="w-3.5 h-3.5 text-purple-400" />
            {project.analysisCount}
          </span>
          <span className="flex items-center gap-1" title="Visualizations">
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
            {project.visualizationCount}
          </span>
          <span className="flex items-center gap-1" title="Reports">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            {project.reportCount}
          </span>
        </div>

        <ArrowRight className="w-4 h-4 text-quantara-500 group-hover:text-blue-400 transition shrink-0" />
      </div>
    </div>
  );
};
