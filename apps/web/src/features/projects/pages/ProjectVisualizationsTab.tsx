import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Project } from '../types/projectTypes';
import { BarChart3, Plus, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const ProjectVisualizationsTab: React.FC = () => {
  const { project } = useOutletContext<{ project: Project }>();
  const navigate = useNavigate();

  const charts = [
    { title: 'Patient Satisfaction Distribution', type: 'Histogram / Boxplot', updated: '2 hours ago' },
    { title: 'Revenue vs Household Income Trend', type: 'Scatter & Regression Line', updated: 'Yesterday' },
    { title: 'Age Group Comparison', type: 'Categorical Bar Chart', updated: '3 days ago' },
    { title: 'Correlation Matrix Heatmap', type: 'Pearson r Matrix', updated: '5 days ago' }
  ];

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Project Visualizations ({charts.length})
          </h2>
          <p className="text-xs text-quantara-400 mt-1">
            Publication-ready charts, heatmaps, and interactive diagnostic diagrams.
          </p>
        </div>

        <Button onClick={() => navigate(`/projects/${project.id}/visualize`)} variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" /> New Visualization
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charts.map((chart, idx) => (
          <div
            key={idx}
            onClick={() => navigate(`/projects/${project.id}/visualize`)}
            className="bg-quantara-900 border border-quantara-800 hover:border-blue-500 rounded-xl p-5 shadow-xl cursor-pointer transition flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded">
                  {chart.type}
                </span>
                <span className="text-[10px] font-mono text-quantara-400">{chart.updated}</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">{chart.title}</h3>
            </div>

            <div className="h-32 bg-quantara-950 border border-quantara-800 rounded-lg flex items-center justify-center text-quantara-500 text-xs font-mono">
              [ Dynamic Interactive ECharts Preview Canvas ]
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
