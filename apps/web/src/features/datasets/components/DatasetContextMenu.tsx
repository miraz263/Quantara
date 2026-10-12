import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Copy, Archive, Trash2, Star, Download, Settings, History } from 'lucide-react';
import { Dataset } from '../types/datasetTypes';

interface DatasetContextMenuProps {
  dataset: Dataset;
  onPreview?: (dataset: Dataset) => void;
  onFavoriteToggle?: (dataset: Dataset) => void;
  onDuplicate?: (dataset: Dataset) => void;
  onArchive?: (dataset: Dataset) => void;
  onDelete?: (dataset: Dataset) => void;
  onViewDetails?: (dataset: Dataset) => void;
}

export const DatasetContextMenu: React.FC<DatasetContextMenuProps> = ({
  dataset,
  onPreview,
  onFavoriteToggle,
  onDuplicate,
  onArchive,
  onDelete,
  onViewDetails,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 text-quantara-400 hover:text-white hover:bg-quantara-800 rounded-lg transition"
        title="More actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-quantara-900 border border-quantara-700 rounded-lg shadow-2xl py-1 z-50 text-xs font-sans">
          {onPreview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onPreview(dataset);
              }}
              className="w-full text-left px-3 py-2 text-quantara-200 hover:bg-quantara-800 hover:text-white flex items-center gap-2 transition"
            >
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              Open Data Grid
            </button>
          )}

          {onViewDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onViewDetails(dataset);
              }}
              className="w-full text-left px-3 py-2 text-quantara-200 hover:bg-quantara-800 hover:text-white flex items-center gap-2 transition"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
              Dataset Details & Schema
            </button>
          )}

          {onFavoriteToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onFavoriteToggle(dataset);
              }}
              className="w-full text-left px-3 py-2 text-quantara-200 hover:bg-quantara-800 hover:text-white flex items-center gap-2 transition"
            >
              <Star className={`w-3.5 h-3.5 ${dataset.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-quantara-400'}`} />
              {dataset.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
            </button>
          )}

          {onDuplicate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onDuplicate(dataset);
              }}
              className="w-full text-left px-3 py-2 text-quantara-200 hover:bg-quantara-800 hover:text-white flex items-center gap-2 transition"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-400" />
              Duplicate Dataset
            </button>
          )}

          <div className="my-1 border-t border-quantara-800" />

          {onArchive && dataset.status !== 'archived' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onArchive(dataset);
              }}
              className="w-full text-left px-3 py-2 text-quantara-300 hover:bg-quantara-800 hover:text-amber-300 flex items-center gap-2 transition"
            >
              <Archive className="w-3.5 h-3.5 text-amber-400" />
              Archive Dataset
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onDelete(dataset);
              }}
              className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-950/60 hover:text-rose-300 flex items-center gap-2 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Dataset
            </button>
          )}
        </div>
      )}
    </div>
  );
};
