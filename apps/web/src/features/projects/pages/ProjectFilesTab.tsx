import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project } from '../types/projectTypes';
import { FolderArchive, Folder, FileSpreadsheet, FileText, Code2, Download, Search, LayoutGrid, List } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const ProjectFilesTab: React.FC = () => {
  const { project } = useOutletContext<{ project: Project }>();
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  const folders = [
    { name: 'Datasets/', count: 4 },
    { name: 'Reports/', count: 3 },
    { name: 'Exports/', count: 6 },
    { name: 'Scripts/', count: 2 },
    { name: 'Attachments/', count: 1 },
  ];

  const files = [
    { name: 'customer_data.csv', folder: 'Datasets/', type: 'CSV Data', size: '1.4 MB', modified: 'Today 09:30', owner: 'Dr. Sarah Khan' },
    { name: 'health_survey.xlsx', folder: 'Datasets/', type: 'Excel Spreadsheet', size: '2.8 MB', modified: 'Yesterday', owner: 'Ahmed Rahman' },
    { name: 'research_report.docx', folder: 'Reports/', type: 'Word Document', size: '4.2 MB', modified: '3 days ago', owner: 'Dr. Sarah Khan' },
    { name: 'analysis_notebook.ipynb', folder: 'Scripts/', type: 'Jupyter Notebook', size: '320 KB', modified: '5 days ago', owner: 'Tanvir Hasan' }
  ];

  const filteredFiles = currentFolder ? files.filter(f => f.folder === currentFolder) : files;

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-blue-400" />
            Project File Browser
          </h2>
          <p className="text-xs text-quantara-400 mt-1">
            Browse datasets, reports, scripts, exported tables, and attachments.
          </p>
        </div>

        <Button variant="primary" size="sm">
          Upload File
        </Button>
      </div>

      {/* Folders Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setCurrentFolder(null)}
          className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
            currentFolder === null ? 'bg-blue-600 text-white border-blue-500 shadow-md' : 'bg-quantara-900 border-quantara-800 text-slate-200 hover:bg-quantara-800'
          }`}
        >
          <Folder className="w-4 h-4 text-blue-300 shrink-0" />
          <span className="text-xs font-bold truncate">All Files</span>
        </button>

        {folders.map((f) => (
          <button
            key={f.name}
            onClick={() => setCurrentFolder(f.name)}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
              currentFolder === f.name ? 'bg-blue-600 text-white border-blue-500 shadow-md' : 'bg-quantara-900 border-quantara-800 text-slate-200 hover:bg-quantara-800'
            }`}
          >
            <Folder className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold truncate">{f.name}</span>
              <span className="text-[10px] text-quantara-400 font-mono">{f.count} items</span>
            </div>
          </button>
        ))}
      </div>

      {/* File Browser Table */}
      <div className="bg-quantara-900 border border-quantara-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs border-collapse font-sans">
          <thead>
            <tr className="bg-quantara-950 text-quantara-400 uppercase font-semibold border-b border-quantara-800">
              <th className="py-3 px-4">File Name</th>
              <th className="py-3 px-4 font-mono">Folder</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 font-mono">Size</th>
              <th className="py-3 px-4 font-mono">Modified</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800 text-slate-200">
            {filteredFiles.map((file, idx) => (
              <tr key={idx} className="hover:bg-quantara-800/40 transition font-mono text-[11px]">
                <td className="py-3.5 px-4 font-bold text-blue-400 font-sans">{file.name}</td>
                <td className="py-3.5 px-4 text-quantara-400">{file.folder}</td>
                <td className="py-3.5 px-4 text-slate-300 font-sans">{file.type}</td>
                <td className="py-3.5 px-4 text-slate-300">{file.size}</td>
                <td className="py-3.5 px-4 text-quantara-400">{file.modified}</td>
                <td className="py-3.5 px-4 text-slate-300 font-sans">{file.owner}</td>
                <td className="py-3.5 px-4 text-right">
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
