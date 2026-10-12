import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, FolderOpen, Edit3, Copy, Archive, Share2, Download, Trash2 } from 'lucide-react';
import { Project } from '../types/projectTypes';

interface ProjectContextMenuProps {
  project: Project;
  onOpen: (id: string) => void;
  onRename?: (project: Project) => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ProjectContextMenu: React.FC<ProjectContextMenuProps> = ({
  project,
  onOpen,
  onRename,
  onDuplicate,
  onArchive,
  onDelete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 text-quantara-400 hover:text-white rounded-lg hover:bg-quantara-800 transition"
        title="Project options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 bg-quantara-900 border border-quantara-700 rounded-xl shadow-2xl z-50 py-1 font-sans text-xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onOpen(project.id);
            }}
            className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-200 hover:bg-quantara-800 hover:text-white transition"
          >
            <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
            Open Workspace
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              if (onRename) onRename(project);
            }}
            className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-200 hover:bg-quantara-800 hover:text-white transition"
          >
            <Edit3 className="w-3.5 h-3.5 text-quantara-400" />
            Rename
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onDuplicate(project.id);
            }}
            className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-200 hover:bg-quantara-800 hover:text-white transition"
          >
            <Copy className="w-3.5 h-3.5 text-purple-400" />
            Duplicate
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onArchive(project.id);
            }}
            className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-200 hover:bg-quantara-800 hover:text-white transition"
          >
            <Archive className="w-3.5 h-3.5 text-amber-400" />
            Archive
          </button>

          <div className="my-1 border-t border-quantara-800" />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onDelete(project.id);
            }}
            className="w-full text-left px-3 py-2 flex items-center gap-2 text-rose-400 hover:bg-rose-950 hover:text-rose-300 transition"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            Delete Project
          </button>
        </div>
      )}
    </div>
  );
};
