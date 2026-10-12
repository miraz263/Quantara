import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project } from '../types/projectTypes';
import { Activity, Clock, UploadCloud, Calculator, BarChart3, BookOpen, User } from 'lucide-react';

export const ProjectActivityTab: React.FC = () => {
  const { project } = useOutletContext<{ project: Project }>();

  const timeline = [
    {
      date: 'Today',
      events: [
        { time: '10:42 AM', title: 'Dataset imported', detail: 'patient_survey.csv (12,450 rows ingested)', icon: UploadCloud, color: 'text-emerald-400' },
        { time: '10:25 AM', title: 'Regression analysis created', detail: 'OLS Linear Model (satisfaction_score ~ income + age)', icon: Calculator, color: 'text-purple-400' },
        { time: '09:48 AM', title: 'Visualization updated', detail: 'Satisfaction by Income Scatter Chart', icon: BarChart3, color: 'text-blue-400' }
      ]
    },
    {
      date: 'Yesterday',
      events: [
        { time: '04:15 PM', title: 'Report generated', detail: 'Clinical Trial Executive Summary exported to PDF', icon: BookOpen, color: 'text-amber-400' },
        { time: '02:30 PM', title: 'Variable View updated', detail: 'Added label "Respondent Age (Years)" to variable age', icon: Activity, color: 'text-purple-400' }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-6 overflow-y-auto max-w-4xl mx-auto w-full space-y-6 font-sans">
      <div className="border-b border-quantara-800 pb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Project Activity Audit Log
        </h2>
        <p className="text-xs text-quantara-400 mt-1">
          Chronological execution log of dataset ingestions, statistical runs, visualizations, and exports.
        </p>
      </div>

      <div className="space-y-6">
        {timeline.map((group, gIdx) => (
          <div key={gIdx} className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-quantara-400 font-mono">{group.date}</h3>
            <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-4 divide-y divide-quantara-800 shadow-lg space-y-3">
              {group.events.map((ev, eIdx) => {
                const Icon = ev.icon;
                return (
                  <div key={eIdx} className="flex items-start gap-3 pt-3 first:pt-0 text-xs">
                    <div className="p-2 bg-quantara-950 border border-quantara-800 rounded-lg shrink-0">
                      <Icon className={`w-4 h-4 ${ev.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{ev.title}</span>
                        <span className="text-[10px] font-mono text-quantara-500">{ev.time}</span>
                      </div>
                      <p className="text-xs text-quantara-300 mt-0.5">{ev.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
