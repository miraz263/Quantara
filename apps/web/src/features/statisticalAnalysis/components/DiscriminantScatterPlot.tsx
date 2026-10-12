import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Layers } from 'lucide-react';

interface DiscriminantScatterPlotProps {
  title?: string;
  func1Label?: string;
  func2Label?: string;
}

export const DiscriminantScatterPlot: React.FC<DiscriminantScatterPlotProps> = ({
  title = 'Canonical Discriminant Functions (Function 1 vs Function 2 by Group Centroids)',
  func1Label = 'Canonical Discriminant Function 1 (82.5% Variance)',
  func2Label = 'Canonical Discriminant Function 2 (17.5% Variance)',
}) => {
  // Deterministic mock discriminant score points for 3 groups
  const budgetGroupData = [
    [-1.85, 0.42], [-1.45, 0.12], [-1.20, -0.15], [-1.60, 0.35], [-0.95, 0.28],
    [-1.30, 0.05], [-1.50, 0.18], [-1.10, -0.08], [-1.40, 0.22], [-1.05, 0.14],
  ];

  const standardGroupData = [
    [0.10, -0.45], [0.35, -0.20], [0.18, -0.55], [0.42, -0.15], [-0.05, -0.38],
    [0.25, -0.28], [0.12, -0.42], [0.30, -0.30], [0.08, -0.50], [0.28, -0.22],
  ];

  const premiumGroupData = [
    [1.45, 0.65], [1.80, 0.38], [1.55, 0.52], [1.70, 0.25], [1.38, 0.48],
    [1.62, 0.55], [1.48, 0.32], [1.90, 0.42], [1.32, 0.60], [1.68, 0.45],
  ];

  // Group Centroids (Mean Discriminant Scores)
  const centroids = [
    [-1.242, 0.184], // Budget Group Centroid
    [0.214, -0.321], // Standard Group Centroid
    [1.625, 0.442],  // Premium Group Centroid
  ];

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: title,
      textStyle: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold' },
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
      formatter: (params: any) => {
        const [x, y] = params.value;
        return `
          <div style="font-weight:bold;margin-bottom:4px;">${params.seriesName}</div>
          <div>Function 1 Score: <b>${x.toFixed(3)}</b></div>
          <div>Function 2 Score: <b>${y.toFixed(3)}</b></div>
        `;
      },
    },
    legend: {
      top: '9%',
      textStyle: { color: '#94a3b8', fontSize: 11 },
    },
    grid: { top: '24%', bottom: '15%', left: '10%', right: '8%' },
    xAxis: {
      type: 'value',
      name: func1Label,
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: { color: '#94a3b8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      name: func2Label,
      nameTextStyle: { color: '#94a3b8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series: [
      {
        name: 'Budget Segment (Group 1)',
        type: 'scatter',
        data: budgetGroupData,
        symbolSize: 10,
        itemStyle: { color: '#3b82f6' },
      },
      {
        name: 'Standard Segment (Group 2)',
        type: 'scatter',
        data: standardGroupData,
        symbolSize: 10,
        itemStyle: { color: '#f59e0b' },
      },
      {
        name: 'Premium Segment (Group 3)',
        type: 'scatter',
        data: premiumGroupData,
        symbolSize: 10,
        itemStyle: { color: '#10b981' },
      },
      {
        name: 'Group Centroids (★)',
        type: 'scatter',
        data: centroids,
        symbol: 'diamond',
        symbolSize: 18,
        itemStyle: { color: '#a855f7', borderColor: '#ffffff', borderWidth: 2 },
        label: {
          show: true,
          formatter: '★ Group Centroid',
          position: 'top',
          color: '#c084fc',
          fontSize: 10,
          fontWeight: 'bold',
        },
      },
    ],
  };

  return (
    <div className="w-full h-96 bg-quantara-900 border border-quantara-800 rounded-2xl p-4 shadow-xl font-sans space-y-2">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};
