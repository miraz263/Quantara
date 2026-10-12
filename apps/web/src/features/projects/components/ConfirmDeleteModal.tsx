import React, { useState } from 'react';
import { Project } from '../types/projectTypes';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface ConfirmDeleteModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  project,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [confirmInput, setConfirmInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !project) return null;

  const isMatched = confirmInput.trim() === project.name;

  const handleDelete = async () => {
    if (!isMatched) return;
    setIsDeleting(true);
    try {
      await onConfirm(project.id);
      setConfirmInput('');
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-quantara-900 border border-rose-900/80 w-full max-w-md rounded-xl shadow-2xl overflow-hidden font-sans animate-scale-up">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-950 rounded-xl border border-rose-800 text-rose-400 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Delete Project Confirmation</h3>
              <p className="text-xs text-rose-300">This action cannot be undone.</p>
            </div>
          </div>

          <p className="text-xs text-quantara-300 leading-relaxed">
            Deleting <strong className="text-white">{project.name}</strong> will remove all dataset pointers, saved statistical analyses, visualizations, and report section manifests.
          </p>

          <div>
            <label className="block text-[11px] font-semibold text-quantara-400 mb-1">
              Type project name <span className="text-white font-mono">{project.name}</span> to confirm:
            </label>
            <input
              type="text"
              className="w-full bg-quantara-950 border border-quantara-700 text-white rounded-lg p-2.5 text-xs font-mono outline-none focus:border-rose-500"
              placeholder={project.name}
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-quantara-800">
            <Button onClick={onClose} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="danger"
              size="sm"
              disabled={!isMatched}
              isLoading={isDeleting}
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Project Permanently
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
