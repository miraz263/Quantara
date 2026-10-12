import React from 'react';
import { DatasetVersionInfo } from '../types/datasetTypes';
import { History, GitCommit, User, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

interface DatasetVersionTableProps {
  versions: DatasetVersionInfo[];
  currentVersion: number;
  onRestoreVersion?: (version: DatasetVersionInfo) => void;
}

export const DatasetVersionTable: React.FC<DatasetVersionTableProps> = ({
  versions,
  currentVersion,
  onRestoreVersion,
}) => {
  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-xl overflow-hidden shadow-xl font-sans">
      <div className="p-4 border-b border-quantara-800 bg-quantara-950/80 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-blue-400" />
            Dataset Version Audit Log ({versions.length} Snapshots)
          </h3>
          <p className="text-xs text-quantara-400 mt-0.5">
            Immutable version snapshots automatically saved during cleaning, transformation, and import operations.
          </p>
        </div>
      </div>

      <div className="divide-y divide-quantara-800/80">
        {versions.map((ver) => {
          const isCurrent = ver.versionNumber === currentVersion;
          return (
            <div
              key={ver.versionNumber}
              className={`p-4 transition ${isCurrent ? 'bg-blue-950/30 border-l-4 border-l-blue-500' : 'hover:bg-quantara-800/40'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-quantara-950 border border-quantara-700 text-blue-400">
                    <GitCommit className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-white">
                        v{ver.versionNumber}.0
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-900 text-blue-300 border border-blue-700">
                          CURRENT HEAD
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-quantara-400 mt-1 font-mono">
                      <span className="flex items-center gap-1 font-sans">
                        <User className="w-3 h-3 text-quantara-500" /> {ver.createdBy}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-quantara-500" /> {new Date(ver.createdAt).toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>{ver.rowCount.toLocaleString()} rows</span>
                      <span>•</span>
                      <span>{ver.columnCount} cols</span>
                    </div>
                  </div>
                </div>

                {!isCurrent && onRestoreVersion && (
                  <button
                    onClick={() => onRestoreVersion(ver)}
                    className="px-3 py-1.5 bg-quantara-800 hover:bg-quantara-700 text-blue-300 rounded-lg text-xs font-semibold border border-quantara-700 transition flex items-center gap-1.5 self-start sm:self-center"
                  >
                    Restore v{ver.versionNumber} <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Changes List */}
              {ver.changes && ver.changes.length > 0 && (
                <div className="mt-3 pl-11">
                  <div className="text-[11px] font-semibold text-quantara-400 uppercase tracking-wider mb-1">
                    Recorded Changes:
                  </div>
                  <ul className="list-disc list-inside text-xs text-quantara-300 space-y-0.5 font-sans">
                    {ver.changes.map((change, i) => (
                      <li key={i}>{change}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
