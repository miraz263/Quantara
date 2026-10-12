import React from 'react';
import { FileSpreadsheet, Database, Star, Clock, Layers, FileCode, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Dataset, DatasetSourceType, DatasetStatus } from '../types/datasetTypes';
import { DatasetContextMenu } from './DatasetContextMenu';

interface DatasetCardProps {
  dataset: Dataset;
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

const getSourceBadge = (type: DatasetSourceType) => {
  switch (type) {
    case 'csv':
      return { bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800', label: 'CSV' };
    case 'xlsx':
    case 'xls':
      return { bg: 'bg-green-950/60 text-green-300 border-green-800', label: 'EXCEL' };
    case 'sav':
      return { bg: 'bg-blue-950/60 text-blue-300 border-blue-800', label: 'SPSS (.sav)' };
    case 'dta':
      return { bg: 'bg-indigo-950/60 text-indigo-300 border-indigo-800', label: 'STATA (.dta)' };
    case 'sas7bdat':
      return { bg: 'bg-purple-950/60 text-purple-300 border-purple-800', label: 'SAS (.sas7bdat)' };
    case 'parquet':
      return { bg: 'bg-amber-950/60 text-amber-300 border-amber-800', label: 'PARQUET' };
    case 'database':
      return { bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-800', label: 'SQL DB' };
    case 'json':
      return { bg: 'bg-orange-950/60 text-orange-300 border-orange-800', label: 'JSON' };
    default:
      return { bg: 'bg-quantara-800 text-quantara-300 border-quantara-700', label: type.toUpperCase() };
  }
};

const getStatusBadge = (status: DatasetStatus) => {
  switch (status) {
    case 'ready':
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">
          <CheckCircle2 className="w-3 h-3" /> Ready
        </span>
      );
    case 'warning':
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800">
          <AlertTriangle className="w-3 h-3" /> Issues
        </span>
      );
    case 'processing':
    case 'uploading':
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800">
          <RefreshCw className="w-3 h-3 animate-spin" /> Processing
        </span>
      );
    case 'archived':
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-quantara-900 text-quantara-400 border border-quantara-700">
          Archived
        </span>
      );
    default:
      return null;
  }
};

export const DatasetCard: React.FC<DatasetCardProps> = ({
  dataset,
  onSelect,
  onPreview,
  onFavoriteToggle,
  onDuplicate,
  onArchive,
  onDelete,
  onViewDetails,
}) => {
  const badge = getSourceBadge(dataset.sourceType);

  return (
    <div
      onClick={() => onSelect ? onSelect(dataset) : onViewDetails ? onViewDetails(dataset) : null}
      className="group bg-quantara-900/90 border border-quantara-800 hover:border-quantara-600 rounded-xl p-5 shadow-lg hover:shadow-2xl transition duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-2 rounded-lg bg-quantara-800/80 text-emerald-400 border border-quantara-700 flex-shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition truncate">
                  {dataset.name}
                </h3>
                {dataset.isFavorite && (
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-quantara-400 truncate mt-0.5">
                v{dataset.version} • {dataset.createdBy}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <DatasetContextMenu
              dataset={dataset}
              onPreview={onPreview}
              onFavoriteToggle={onFavoriteToggle}
              onDuplicate={onDuplicate}
              onArchive={onArchive}
              onDelete={onDelete}
              onViewDetails={onViewDetails}
            />
          </div>
        </div>

        {/* Description */}
        {dataset.description && (
          <p className="text-xs text-quantara-300 line-clamp-2 mb-4 leading-relaxed font-sans">
            {dataset.description}
          </p>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 bg-quantara-950/70 rounded-lg p-2.5 border border-quantara-800/60 mb-4 font-mono text-xs">
          <div>
            <div className="text-[10px] text-quantara-500 uppercase font-sans">Rows</div>
            <div className="font-semibold text-slate-200">{dataset.rowCount.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[10px] text-quantara-500 uppercase font-sans font-normal">Variables</div>
            <div className="font-semibold text-slate-200">{dataset.columnCount}</div>
          </div>
          <div>
            <div className="text-[10px] text-quantara-500 uppercase font-sans font-normal">Size</div>
            <div className="font-semibold text-slate-200">{formatBytes(dataset.sizeBytes)}</div>
          </div>
        </div>

        {/* Tags */}
        {dataset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {dataset.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-quantara-800 text-quantara-300 border border-quantara-700 px-2 py-0.5 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-quantara-800/80 flex items-center justify-between text-[11px] text-quantara-400">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badge.bg}`}>
            {badge.label}
          </span>
          {getStatusBadge(dataset.status)}
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <Clock className="w-3 h-3 text-quantara-500" />
          {new Date(dataset.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
