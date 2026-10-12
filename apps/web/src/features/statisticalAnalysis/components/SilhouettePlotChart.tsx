import React from 'react';
import ReactECharts from 'echarts-for-react';

interface SilhouettePlotChartProps {
  title?: string;
  averageSilhouette?: number;
  sampleSilhouettes?: Array<{ clusterId: string; clusterName: string; silhouette: number }>;
}

export const SilhouettePlotChart: React.FC<SilhouettePlotChartProps> = ({
  title = 'Silhouette Plot — Per-Cluster Cohesion vs Separation Coefficients',
  averageSilhouette = 0.642,
  sampleSilhouettes = [
    { clusterId: 'c1', clusterName: 'Cluster 1: High Value Loyalists', silhouette: 0.724 },
    { clusterId: 'c2', clusterName: 'Cluster 2: Cost-Sensitive Price Seekers', silhouette: 0.685 },
    { clusterId: 'c3', clusterName: 'Cluster 3: Disengaged At-Risk', silhouette: 0.542 },
    { clusterId: 'c4', clusterName: 'Cluster 4: High Usage Explorers', silhouette: 0.618 },
  ],
}) => {
  const categories = sampleSilhouettes.map((s) => s.clusterName);
  const values = sampleSilhouettes.map((s) => s.silhouette);

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: title,
      textStyle: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold' },
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => {
        const p = params[0];
        return `
          <div style="font-weight:bold;margin-bottom:4px;">${p.name}</div>
          <div>Mean Silhouette (s_i): <b style="color:#10b981;">${p.value.toFixed(3)}</b></div>
          <div>Overall Average Benchmark: <b>${averageSilhouette.toFixed(3)}</b></div>
          <div>Adequacy: <b>${p.value >= 0.5 ? 'Good Cohesion (≥ 0.50)' : 'Moderate'}</b></div>
        `;
      },
    },
    grid: { top: '20%', bottom: '15%', left: '30%', right: '10%' },
    xAxis: {
      type: 'value',
      name: 'Silhouette Coefficient (s_i)',
      min: -0.2,
      max: 1.0,
      nameLocation: 'middle',
      nameGap: 25,
      nameTextStyle: { color: '#94a3b8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#f8fafc', fontSize: 11, fontWeight: 'bold' },
    },
    series: [
      {
        name: 'Cluster Silhouette',
        type: 'bar',
        data: values,
        itemStyle: {
          color: (params: any) => (params.value >= averageSilhouette ? '#10b981' : '#3b82f6'),
          borderRadius: [0, 6, 6, 0],
        },
        label: {
          show: true,
          position: 'right',
          color: '#ffffff',
          fontSize: 10,
          fontFamily: 'monospace',
          formatter: (params: any) => params.value.toFixed(3),
        },
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
            {
              xAxis: averageSilhouette,
              label: {
                formatter: `Mean s_i = ${averageSilhouette.toFixed(3)}`,
                color: '#10b981',
                fontSize: 10,
                fontWeight: 'bold',
                position: 'end',
              },
              lineStyle: { color: '#10b981', type: 'dashed', width: 2 },
            },
          ],
        },
      },
    ],
  };

  return (
    <div className="w-full h-80 bg-quantara-900 border border-quantara-800 rounded-2xl p-4 shadow-xl font-sans">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};
