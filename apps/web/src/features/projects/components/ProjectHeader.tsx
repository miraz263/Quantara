import React from 'react';
import { Project } from '../types/projectTypes';
import { FolderKanban, UploadCloud, Calculator, BarChart3, BookOpen, Clock, User, Shield, Tag } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

interface ProjectHeaderProps {
  project: Project;
  onImportData?: () => void;
  onNewAnalysis?: () => void;
  onNewVisualization?: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  onImportData,
  onNewAnalysis,
  onNewVisualization
}) => {
  return (
    <div className="bg-quantara-900 border-b border-quantara-800 p-6 shadow-md font-sans">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-white tracking-tight font-sans">{project.name}</h1>
              <Badge variant={project.status === 'active' ? 'emerald' : 'amber'}>{project.status.toUpperCase()}</Badge>
              <Badge variant="blue">{project.visibility.toUpperCase()}</Badge>
            </div>
            {project.description && (
              <p className="text-xs text-quantara-300 leading-relaxed max-w-3xl font-sans">
                {project.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs font-mono text-quantara-400 pt-1">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-purple-400" />
                {project.ownerName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Updated {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={onImportData} variant="secondary" size="sm">
              <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
              Import Data
            </Button>
            <Button onClick={onNewAnalysis} variant="primary" size="sm">
              <Calculator className="w-3.5 h-3.5" />
              New Analysis
            </Button>
            <Button onClick={onNewVisualization} variant="outline" size="sm">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              New Visualization
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
