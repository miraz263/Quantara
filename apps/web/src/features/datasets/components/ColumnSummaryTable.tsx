import React from 'react';
import { ColumnMetadataSummary } from '../types/datasetTypes';
import { Hash, Type, Calendar, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface ColumnSummaryTableProps {
  columns: ColumnMetadataSummary[];
}

const getMeasurementBadge = (level: 'nominal' | 'ordinal' | 'scale') => {
  switch (level) {
    case 'scale':
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800">
          <Hash className="w-3 h-3" /> Scale (Continuous)
        </span>
      );
    case 'ordinal':
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
          <Type className="w-3 h-3" /> Ordinal (Ranked)
        </span>
      );
    case 'nominal':
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
          <Type className="w-3 h-3" /> Nominal (Categorical)
        </span>
      );
    default:
      return null;
  }
};

export const ColumnSummaryTable: React.FC<ColumnSummaryTableProps> = ({ columns }) => {
  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-xl overflow-hidden shadow-xl font-sans">
      <div className="p-4 border-b border-quantara-800 bg-quantara-950/80 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            Variable Dictionary & Quality Profiles ({columns.length} Columns)
          </h3>
          <p className="text-xs text-quantara-400 mt-0.5">
            Statistical measurement levels, missing value distributions, and data type inferences.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-quantara-950 text-quantara-400 uppercase font-semibold text-[11px] border-b border-quantara-800 tracking-wider font-mono">
              <th className="py-3.5 px-4">#</th>
              <th className="py-3.5 px-4">Variable Name</th>
              <th className="py-3.5 px-4">Data Type</th>
              <th className="py-3.5 px-4">Measurement Level</th>
              <th className="py-3.5 px-4">Non-Null</th>
              <th className="py-3.5 px-4">Missing</th>
              <th className="py-3.5 px-4">Unique</th>
              <th className="py-3.5 px-4">Sample Values</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800/80 text-slate-200 font-mono">
            {columns.map((col, idx) => (
              <tr key={col.name} className="hover:bg-quantara-800/40 transition">
                <td className="py-3 px-4 text-quantara-500 text-[11px]">{idx + 1}</td>
                <td className="py-3 px-4 font-bold text-white font-sans">{col.name}</td>
                <td className="py-3 px-4 uppercase text-[11px] text-quantara-300 font-semibold">{col.dataType}</td>
                <td className="py-3 px-4 font-sans">{getMeasurementBadge(col.measurementLevel)}</td>
                <td className="py-3 px-4 text-emerald-400">{col.nonNullCount.toLocaleString()}</td>
                <td className="py-3 px-4">
                  {col.missingCount > 0 ? (
                    <span className="text-rose-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {col.missingCount} ({col.missingPercentage}%)
                    </span>
                  ) : (
                    <span className="text-quantara-500 font-normal">0 (0%)</span>
                  )}
                </td>
                <td className="py-3 px-4 text-quantara-300">{col.uniqueCount.toLocaleString()}</td>
                <td className="py-3 px-4 font-sans text-quantara-400 text-[11px] max-w-xs truncate">
                  {col.exampleValues.map(String).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
