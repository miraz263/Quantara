import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Project } from '../types/projectTypes';
import { ProjectService } from '../services/projectService';
import { Settings, Save, Archive, Trash2, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { ConfirmArchiveModal } from '../components/ConfirmArchiveModal';

export const ProjectSettingsTab: React.FC = () => {
  const { project } = useOutletContext<{ project: Project }>();
  const navigate = useNavigate();

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [visibility, setVisibility] = useState(project.visibility);
  const [savedMsg, setSavedMsg] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await ProjectService.updateProject(project.id, {
      name,
      description,
      visibility
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleArchiveConfirm = async (id: string) => {
    await ProjectService.archiveProject(id);
    navigate('/projects');
  };

  const handleDeleteConfirm = async (id: string) => {
    await ProjectService.deleteProject(id);
    navigate('/projects');
  };

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-6 overflow-y-auto max-w-4xl mx-auto w-full space-y-6 font-sans">
      <div className="border-b border-quantara-800 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          Project Workspace Settings
        </h2>
        <p className="text-xs text-quantara-400 mt-1">
          Configure project identity, visibility, access control, version history, and lifecycle operations.
        </p>
      </div>

      {savedMsg && (
        <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-lg text-xs flex items-center gap-2 animate-fade-in font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Project settings saved successfully.</span>
        </div>
      )}

      {/* General Settings */}
      <form onSubmit={handleSave} className="bg-quantara-900 border border-quantara-800 rounded-xl p-6 shadow-xl space-y-5">
        <h3 className="text-xs font-bold uppercase text-white tracking-wider border-b border-quantara-800 pb-2">General Settings</h3>

        <div>
          <label className="block text-xs font-semibold uppercase text-quantara-400 mb-1">Project Name *</label>
          <input
            type="text"
            className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 font-medium"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-quantara-400 mb-1">Description</label>
          <textarea
            rows={3}
            className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 font-sans leading-relaxed"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-quantara-400 mb-1">Project Visibility</label>
          <select
            className="bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 font-medium"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as any)}
          >
            <option value="private">Private (Only you)</option>
            <option value="team">Team (Project collaborators)</option>
            <option value="organization">Organization (All members)</option>
          </select>
        </div>

        <div className="pt-3 border-t border-quantara-800 flex justify-end">
          <Button type="submit" variant="primary" size="sm">
            <Save className="w-3.5 h-3.5" /> Save Changes
          </Button>
        </div>
      </form>

      {/* Behavior & Lineage */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-bold uppercase text-white tracking-wider border-b border-quantara-800 pb-2">Project Behavior & Governance</h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Auto-Save Analytical Execution State</p>
              <p className="text-[11px] text-quantara-400">Automatically record execution parameters and outputs to project manifests.</p>
            </div>
            <input type="checkbox" defaultChecked className="accent-blue-600 cursor-pointer" />
          </div>

          <div className="flex items-center justify-between border-t border-quantara-800/60 pt-3">
            <div>
              <p className="font-semibold text-white">Strict Reproducibility Versioning</p>
              <p className="text-[11px] text-quantara-400">Lock dataset checksums upon statistical procedure execution.</p>
            </div>
            <input type="checkbox" defaultChecked className="accent-blue-600 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-rose-950/40 border border-rose-900/80 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Danger Zone</h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-rose-900/60">
          <div>
            <p className="text-xs font-semibold text-white">Archive Project</p>
            <p className="text-[11px] text-rose-300">Hide this project from default active lists while preserving historical data.</p>
          </div>
          <Button onClick={() => setIsArchiveModalOpen(true)} variant="secondary" size="sm" className="bg-amber-950 text-amber-300 border-amber-800 hover:bg-amber-900">
            <Archive className="w-3.5 h-3.5" /> Archive Project
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-rose-900/60">
          <div>
            <p className="text-xs font-semibold text-white">Delete Project</p>
            <p className="text-[11px] text-rose-300">Permanently delete project metadata, analyses, and report manifests.</p>
          </div>
          <Button onClick={() => setIsDeleteModalOpen(true)} variant="danger" size="sm">
            <Trash2 className="w-3.5 h-3.5" /> Delete Project
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ConfirmArchiveModal
        project={project}
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        onConfirm={handleArchiveConfirm}
      />

      <ConfirmDeleteModal
        project={project}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
