import React from 'react';
import { FolderArchive, FileSpreadsheet, FileText, BarChart2, Download, Trash2 } from 'lucide-react';
import { MOCK_FILES } from '../mocks/mockData';

export const FilesPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-quantara-950 p-8 overflow-y-auto max-w-6xl mx-auto w-full space-y-6">
      <div className="border-b border-quantara-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <FolderArchive className="w-5 h-5 text-blue-400" />
          Project File Manager
        </h1>
        <p className="text-xs text-quantara-400 mt-1">
          Ingested datasets, exported PDF/DOCX reports, generated charts, and analytical notebooks.
        </p>
      </div>

      <div className="bg-quantara-900 border border-quantara-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-quantara-950 text-quantara-400 font-semibold border-b border-quantara-800 uppercase">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Modified</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800 text-slate-200 font-mono">
            {MOCK_FILES.map((file) => (
              <tr key={file.id} className="hover:bg-quantara-800/40 transition">
                <td className="py-3 px-4 font-semibold text-blue-400">{file.name}</td>
                <td className="py-3 px-4 uppercase text-[10px] text-quantara-300">{file.category}</td>
                <td className="py-3 px-4">{(file.size_bytes / (1024 * 1024)).toFixed(2)} MB</td>
                <td className="py-3 px-4">{new Date(file.modified_at).toLocaleDateString()}</td>
                <td className="py-3 px-4 font-sans">{file.owner_name}</td>
                <td className="py-3 px-4 text-right">
                  <button className="p-1 text-quantara-400 hover:text-white transition">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
