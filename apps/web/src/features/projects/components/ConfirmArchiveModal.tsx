import React, { useState } from 'react';
import { Project } from '../types/projectTypes';
import { Archive, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface ConfirmArchiveModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export const ConfirmArchiveModal: React.FC<ConfirmArchiveModalProps> = ({
  project,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [isArchiving, setIsArchiving] = useState(false);

  if (!isOpen || !project) return null;

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      await onConfirm(project.id);
      onClose();
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-quantara-900 border border-amber-900/80 w-full max-w-md rounded-xl shadow-2xl overflow-hidden font-sans animate-scale-up">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-950 rounded-xl border border-amber-800 text-amber-400 shrink-0">
              <Archive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Archive Project</h3>
              <p className="text-xs text-amber-300">Move project to archived status.</p>
            </div>
          </div>

          <p className="text-xs text-quantara-300 leading-relaxed">
            Archiving <strong className="text-white">{project.name}</strong> will hide it from the active projects workspace list. You can view or restore it anytime by filtering status by <span className="font-mono text-amber-300">Archived</span>.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-quantara-800">
            <Button onClick={onClose} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button onClick={handleArchive} variant="primary" size="sm" isLoading={isArchiving} className="bg-amber-600 hover:bg-amber-500">
              <Archive className="w-3.5 h-3.5" /> Archive Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
