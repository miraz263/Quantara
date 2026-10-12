import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Project } from '../types/projectTypes';
import { BookOpen, Plus, Download, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export const ProjectReportsTab: React.FC = () => {
  const { project } = useOutletContext<{ project: Project }>();
  const navigate = useNavigate();

  const reports = [
    { title: 'Healthcare Research Report 2026', type: 'APA 7 Scientific Report', status: 'ready', modified: 'Yesterday' },
    { title: 'Customer Satisfaction Statistical Report', type: 'Executive Summary', status: 'ready', modified: '3 days ago' },
    { title: 'Clinical Trial Phase III Results', type: 'Medical Biostatistics Report', status: 'draft', modified: '5 days ago' }
  ];

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            Project Reports ({reports.length})
          </h2>
          <p className="text-xs text-quantara-400 mt-1">
            Academic APA 7 / IEEE research reports and executive summaries.
          </p>
        </div>

        <Button onClick={() => navigate(`/projects/${project.id}/reports`)} variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" /> Create Report
        </Button>
      </div>

      <div className="bg-quantara-900 border border-quantara-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-quantara-950 text-quantara-400 uppercase font-semibold border-b border-quantara-800">
              <th className="py-3 px-4">Report Title</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 font-mono">Modified</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800 text-slate-200">
            {reports.map((r, idx) => (
              <tr key={idx} className="hover:bg-quantara-800/40 transition">
                <td className="py-3.5 px-4 font-bold text-white">{r.title}</td>
                <td className="py-3.5 px-4 text-quantara-300 font-mono text-[11px]">{r.type}</td>
                <td className="py-3.5 px-4">
                  <Badge variant={r.status === 'ready' ? 'emerald' : 'amber'}>{r.status.toUpperCase()}</Badge>
                </td>
                <td className="py-3.5 px-4 font-mono text-quantara-400">{r.modified}</td>
                <td className="py-3.5 px-4 text-right">
                  <button onClick={() => navigate(`/projects/${project.id}/reports`)} className="px-3 py-1 bg-quantara-800 text-slate-200 rounded text-xs hover:bg-quantara-700 transition">
                    Edit Report
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
