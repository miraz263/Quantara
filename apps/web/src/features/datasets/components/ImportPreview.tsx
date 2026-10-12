import React from 'react';
import { ColumnMetadataSummary } from '../types/datasetTypes';
import { Eye, CheckCircle2, Hash, Type, Sparkles } from 'lucide-react';

interface ImportPreviewProps {
  fileName: string;
  columns: ColumnMetadataSummary[];
}

// Sample row data for preview
const SAMPLE_PREVIEW_ROWS = [
  { id: '1001', age: 34, gender: 'Female', income: 68500, satisfaction_score: 4.8, status: 'Active' },
  { id: '1002', age: 45, gender: 'Male', income: 92100, satisfaction_score: 4.2, status: 'Active' },
  { id: '1003', age: 29, gender: 'Non-binary', income: 54200, satisfaction_score: 3.9, status: 'Pending' },
  { id: '1004', age: 52, gender: 'Female', income: 115000, satisfaction_score: 4.9, status: 'Active' },
  { id: '1005', age: 38, gender: 'Male', income: 74300, satisfaction_score: 3.1, status: 'Inactive' },
];

export const ImportPreview: React.FC<ImportPreviewProps> = ({ fileName, columns }) => {
  return (
    <div className="space-y-4 font-sans">
      <div className="bg-quantara-950/80 border border-quantara-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            Ingestion Preview: <span className="text-blue-400 font-mono">{fileName}</span>
          </h4>
          <p className="text-xs text-quantara-400 mt-0.5">
            Showing inferred column schema and top 5 sample rows.
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-xs font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Schema Validated
        </span>
      </div>

      {/* Schema / Column Type Pills */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 space-y-2">
        <h5 className="text-xs font-bold text-quantara-300 uppercase tracking-wider">
          Inferred Variables & Measurement Types ({columns.length} columns)
        </h5>
        <div className="flex flex-wrap gap-2 pt-1">
          {columns.map((col) => (
            <div
              key={col.name}
              className="bg-quantara-950 border border-quantara-700 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-xs"
            >
              <span className="font-bold text-white font-mono">{col.name}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-quantara-800 text-blue-300">
                {col.dataType}
              </span>
              <span className="text-[10px] text-quantara-400 capitalize font-mono">
                {col.measurementLevel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Preview Table */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-quantara-950 text-quantara-400 uppercase font-semibold text-[11px] border-b border-quantara-800">
                <th className="py-3 px-4">#</th>
                {columns.map((col) => (
                  <th key={col.name} className="py-3 px-4">
                    <div className="font-bold text-white font-sans">{col.name}</div>
                    <div className="text-[10px] font-normal text-quantara-400 capitalize">{col.measurementLevel}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-quantara-800 text-slate-200">
              {SAMPLE_PREVIEW_ROWS.map((row, i) => (
                <tr key={i} className="hover:bg-quantara-800/40">
                  <td className="py-2.5 px-4 text-quantara-500 text-[11px]">{i + 1}</td>
                  <td className="py-2.5 px-4">{row.id}</td>
                  <td className="py-2.5 px-4">{row.age}</td>
                  <td className="py-2.5 px-4">{row.gender}</td>
                  <td className="py-2.5 px-4">${row.income.toLocaleString()}</td>
                  <td className="py-2.5 px-4 font-bold text-emerald-400">{row.satisfaction_score}</td>
                  <td className="py-2.5 px-4">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
