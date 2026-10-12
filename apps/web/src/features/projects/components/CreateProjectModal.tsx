import React, { useState } from 'react';
import { CreateProjectDTO, ProjectVisibility } from '../types/projectTypes';
import { X, Plus, FolderKanban, Shield, Tag, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProjectDTO) => Promise<void>;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['biostatistics']);
  const [visibility, setVisibility] = useState<ProjectVisibility>('team');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter(tag => tag !== t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project Name is strictly required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        tags,
        visibility
      });
      setName('');
      setDescription('');
      setTags(['biostatistics']);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-quantara-900 border border-quantara-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col font-sans animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-quantara-950 border-b border-quantara-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded shadow-md">
              <FolderKanban className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Create Quantara Project</h3>
          </div>
          <button onClick={onClose} className="text-quantara-400 hover:text-white p-1 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-quantara-400 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 font-medium"
              placeholder="e.g. Clinical Outcome Study Phase III"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-quantara-400 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2.5 text-xs outline-none focus:border-blue-500 font-sans leading-relaxed"
              placeholder="Describe the research questions, dataset sources, or analytical goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-quantara-400 mb-1">
              Visibility & Sharing
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['private', 'team', 'organization'] as ProjectVisibility[]).map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setVisibility(v)}
                  className={`p-2.5 rounded-lg border text-xs font-semibold uppercase tracking-wider transition text-center ${
                    visibility === v 
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md' 
                      : 'bg-quantara-950 border-quantara-800 text-quantara-400 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-quantara-400 mb-1">
              Tags
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                className="flex-1 bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2 text-xs outline-none focus:border-blue-500 font-mono"
                placeholder="Add tag e.g. econometrics"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 bg-quantara-800 hover:bg-quantara-700 text-slate-200 rounded-lg text-xs font-semibold border border-quantara-700 transition"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-quantara-950 text-blue-300 border border-blue-900 rounded text-[11px] font-mono">
                  #{t}
                  <button type="button" onClick={() => handleRemoveTag(t)} className="text-quantara-400 hover:text-white ml-1">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-quantara-800">
            <Button type="button" onClick={onClose} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              <Plus className="w-3.5 h-3.5" /> Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
