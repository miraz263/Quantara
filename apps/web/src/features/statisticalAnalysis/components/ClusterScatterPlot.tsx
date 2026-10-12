import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Sliders } from 'lucide-react';

interface ClusterScatterPlotProps {
  title?: string;
  xVarLabel?: string;
  yVarLabel?: string;
}

export const ClusterScatterPlot: React.FC<ClusterScatterPlotProps> = ({
  title = '2D Cluster Scatter Projection (Income vs Satisfaction Rating)',
  xVarLabel = 'Household Income ($)',
  yVarLabel = 'Satisfaction Rating (1-5 Scale)',
}) => {
  // Deterministic mock data points grouped into 4 clusters
  const cluster1Data = [
    [92000, 4.8], [98000, 4.6], [89000, 4.9], [95000, 4.7], [102000, 4.9],
    [86000, 4.5], [91000, 4.8], [94000, 4.6], [99000, 4.9], [88000, 4.7],
  ];

  const cluster2Data = [
    [42000, 2.1], [48000, 2.4], [39000, 1.9], [45000, 2.3], [52000, 2.5],
    [36000, 1.8], [41000, 2.2], [44000, 2.0], [49000, 2.4], [38000, 2.1],
  ];

  const cluster3Data = [
    [32000, 4.2], [38000, 4.4], [29000, 4.1], [35000, 4.3], [42000, 4.5],
    [28000, 3.9], [31000, 4.2], [34000, 4.0], [39000, 4.4], [30000, 4.1],
  ];

  const cluster4Data = [
    [78000, 2.8], [82000, 3.1], [74000, 2.6], [85000, 3.0], [89000, 3.2],
    [72000, 2.5], [79000, 2.9], [81000, 2.7], [86000, 3.1], [75000, 2.8],
  ];

  // Centroids
  const centroids = [
    [93400, 4.74], // Cluster 1
    [43400, 2.17], // Cluster 2
    [34800, 4.21], // Cluster 3
    [80400, 2.87], // Cluster 4
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
          <div>${xVarLabel}: <b>${typeof x === 'number' ? x.toLocaleString() : x}</b></div>
          <div>${yVarLabel}: <b>${y}</b></div>
        `;
      },
    },
    legend: {
      top: '10%',
      textStyle: { color: '#94a3b8', fontSize: 11 },
    },
    grid: { top: '24%', bottom: '15%', left: '12%', right: '8%' },
    xAxis: {
      type: 'value',
      name: xVarLabel,
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: { color: '#94a3b8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      name: yVarLabel,
      nameTextStyle: { color: '#94a3b8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series: [
      {
        name: 'Cluster 1: High Value Loyalists',
        type: 'scatter',
        data: cluster1Data,
        symbolSize: 10,
        itemStyle: { color: '#10b981' },
      },
      {
        name: 'Cluster 2: Cost-Sensitive Seekers',
        type: 'scatter',
        data: cluster2Data,
        symbolSize: 10,
        itemStyle: { color: '#f43f5e' },
      },
      {
        name: 'Cluster 3: Disengaged At-Risk',
        type: 'scatter',
        data: cluster3Data,
        symbolSize: 10,
        itemStyle: { color: '#3b82f6' },
      },
      {
        name: 'Cluster 4: High Usage Explorers',
        type: 'scatter',
        data: cluster4Data,
        symbolSize: 10,
        itemStyle: { color: '#a855f7' },
      },
      {
        name: 'Cluster Centroids (★)',
        type: 'scatter',
        data: centroids,
        symbol: 'diamond',
        symbolSize: 18,
        itemStyle: { color: '#f59e0b', borderColor: '#ffffff', borderWidth: 2 },
        label: {
          show: true,
          formatter: '★ Centroid',
          position: 'top',
          color: '#f59e0b',
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
