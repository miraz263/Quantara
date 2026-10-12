import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Project } from '../types/projectTypes';
import { Calculator, Play, Clock, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { MOCK_ANALYSES } from '../../../mocks/mockData';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

export const ProjectAnalysesTab: React.FC = () => {
  const { project } = useOutletContext<{ project: Project }>();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-400" />
            Project Statistical Analyses ({MOCK_ANALYSES.length})
          </h2>
          <p className="text-xs text-quantara-400 mt-1">
            Executed statistical models, assumption diagnostics, and verified output tables.
          </p>
        </div>

        <Button onClick={() => navigate(`/projects/${project.id}/analyze`)} variant="primary" size="sm">
          <Play className="w-3.5 h-3.5 fill-current" /> Run New Analysis
        </Button>
      </div>

      <div className="bg-quantara-900 border border-quantara-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-quantara-950 text-quantara-400 uppercase font-semibold border-b border-quantara-800">
              <th className="py-3.5 px-4">Analysis Name</th>
              <th className="py-3.5 px-4">Statistical Method</th>
              <th className="py-3.5 px-4">Dataset Version</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 font-mono">Duration</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800 text-slate-200">
            {MOCK_ANALYSES.map((an) => (
              <tr key={an.id} className="hover:bg-quantara-800/40 transition cursor-pointer" onClick={() => navigate(`/projects/${project.id}/analyze`)}>
                <td className="py-3.5 px-4 font-bold text-white">{an.name}</td>
                <td className="py-3.5 px-4 font-mono text-purple-300 capitalize text-[11px]">{an.analysis_type.replace('_', ' ')}</td>
                <td className="py-3.5 px-4 font-mono text-quantara-400">customer_satisfaction_v1</td>
                <td className="py-3.5 px-4">
                  <Badge variant="emerald">COMPLETED</Badge>
                </td>
                <td className="py-3.5 px-4 font-mono text-quantara-400">{an.execution_time_ms} ms</td>
                <td className="py-3.5 px-4 text-right">
                  <span className="text-xs text-blue-400 font-semibold hover:underline">View Output</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
