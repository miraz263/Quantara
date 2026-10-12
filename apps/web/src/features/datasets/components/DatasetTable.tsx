import React from 'react';
import { FileSpreadsheet, Star, CheckCircle2, AlertTriangle, RefreshCw, Eye } from 'lucide-react';
import { Dataset } from '../types/datasetTypes';
import { DatasetContextMenu } from './DatasetContextMenu';

interface DatasetTableProps {
  datasets: Dataset[];
  onSelect?: (dataset: Dataset) => void;
  onPreview?: (dataset: Dataset) => void;
  onFavoriteToggle?: (dataset: Dataset) => void;
  onDuplicate?: (dataset: Dataset) => void;
  onArchive?: (dataset: Dataset) => void;
  onDelete?: (dataset: Dataset) => void;
  onViewDetails?: (dataset: Dataset) => void;
}

const formatBytes = (bytes?: number): string => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const DatasetTable: React.FC<DatasetTableProps> = ({
  datasets,
  onSelect,
  onPreview,
  onFavoriteToggle,
  onDuplicate,
  onArchive,
  onDelete,
  onViewDetails,
}) => {
  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="bg-quantara-950/90 text-quantara-400 uppercase font-semibold text-[11px] border-b border-quantara-800 tracking-wider">
              <th className="py-3.5 px-4">Dataset Name</th>
              <th className="py-3.5 px-4">Format</th>
              <th className="py-3.5 px-4 font-mono">Rows</th>
              <th className="py-3.5 px-4 font-mono">Variables</th>
              <th className="py-3.5 px-4 font-mono">Size</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Created By</th>
              <th className="py-3.5 px-4">Last Modified</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800/80 text-slate-200 font-mono">
            {datasets.map((d) => (
              <tr
                key={d.id}
                onClick={() => onViewDetails ? onViewDetails(d) : onSelect ? onSelect(d) : null}
                className="hover:bg-quantara-800/40 transition cursor-pointer group"
              >
                <td className="py-3.5 px-4 font-sans font-bold text-white group-hover:text-blue-400">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onFavoriteToggle) onFavoriteToggle(d);
                      }}
                      className="text-quantara-500 hover:text-amber-400 transition"
                    >
                      <Star className={`w-3.5 h-3.5 ${d.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                    </button>
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{d.name}</span>
                        <span className="text-[10px] text-quantara-500 font-mono font-normal">v{d.version}</span>
                      </div>
                      {d.description && (
                        <p className="text-[11px] text-quantara-400 font-normal truncate max-w-xs font-sans mt-0.5">
                          {d.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 uppercase font-bold text-[11px] text-quantara-300">
                  {d.sourceType}
                </td>

                <td className="py-3.5 px-4 text-slate-300">
                  {d.rowCount.toLocaleString()}
                </td>

                <td className="py-3.5 px-4 text-slate-300">
                  {d.columnCount}
                </td>

                <td className="py-3.5 px-4 text-quantara-400">
                  {formatBytes(d.sizeBytes)}
                </td>

                <td className="py-3.5 px-4 font-sans">
                  {d.status === 'ready' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  )}
                  {d.status === 'warning' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800">
                      <AlertTriangle className="w-3 h-3" /> Warning
                    </span>
                  )}
                  {(d.status === 'processing' || d.status === 'uploading') && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Processing
                    </span>
                  )}
                  {d.status === 'archived' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-quantara-900 text-quantara-400 border border-quantara-700">
                      Archived
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 font-sans text-quantara-300 text-[11px]">
                  {d.createdBy}
                </td>

                <td className="py-3.5 px-4 text-quantara-400 text-[11px]">
                  {new Date(d.updatedAt).toLocaleDateString()}
                </td>

                <td className="py-3.5 px-4 text-right font-sans" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    {onPreview && (
                      <button
                        onClick={() => onPreview(d)}
                        className="px-2.5 py-1 bg-quantara-800 hover:bg-quantara-700 text-blue-300 rounded text-[11px] font-medium transition border border-quantara-700 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Open
                      </button>
                    )}
                    <DatasetContextMenu
                      dataset={d}
                      onPreview={onPreview}
                      onFavoriteToggle={onFavoriteToggle}
                      onDuplicate={onDuplicate}
                      onArchive={onArchive}
                      onDelete={onDelete}
                      onViewDetails={onViewDetails}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
