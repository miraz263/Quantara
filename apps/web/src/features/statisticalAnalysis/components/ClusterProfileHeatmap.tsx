import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Sliders } from 'lucide-react';

interface ClusterProfileHeatmapProps {
  title?: string;
  variables: string[];
  clusters: string[];
  // matrix[clusterIndex][variableIndex] = standardized score
  matrix: number[][];
}

export const ClusterProfileHeatmap: React.FC<ClusterProfileHeatmapProps> = ({
  title = 'Cluster Profile Heatmap (Standardized Centroid Means Z-Score)',
  variables,
  clusters,
  matrix,
}) => {
  // Format data for ECharts Heatmap: [xIndex (variable), yIndex (cluster), value]
  const data: [number, number, number][] = [];

  for (let cIdx = 0; cIdx < clusters.length; cIdx++) {
    for (let vIdx = 0; vIdx < variables.length; vIdx++) {
      const val = matrix[cIdx]?.[vIdx] ?? 0;
      data.push([vIdx, cIdx, Number(val.toFixed(3))]);
    }
  }

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: title,
      textStyle: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold' },
      left: 'center',
    },
    tooltip: {
      position: 'top',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
      formatter: (params: any) => {
        const [vIdx, cIdx, val] = params.value;
        const vName = variables[vIdx];
        const cName = clusters[cIdx];
        return `
          <div style="font-weight:bold;margin-bottom:4px;">${cName}</div>
          <div>Variable: <b>${vName}</b></div>
          <div>Standardized Z-Score: <b style="color:${val >= 0 ? '#10b981' : '#f43f5e'};">${val > 0 ? '+' : ''}${val}</b></div>
        `;
      },
    },
    grid: { top: '18%', bottom: '22%', left: '15%', right: '8%' },
    xAxis: {
      type: 'category',
      data: variables,
      axisLabel: {
        color: '#94a3b8',
        fontSize: 10,
        rotate: 30,
        interval: 0,
      },
      axisLine: { lineStyle: { color: '#334155' } },
      splitArea: { show: true },
    },
    yAxis: {
      type: 'category',
      data: clusters,
      axisLabel: { color: '#f8fafc', fontSize: 11, fontWeight: 'bold' },
      axisLine: { lineStyle: { color: '#334155' } },
      splitArea: { show: true },
    },
    visualMap: {
      min: -1.5,
      max: 1.5,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '2%',
      textStyle: { color: '#94a3b8', fontSize: 10 },
      inRange: {
        color: ['#e11d48', '#881337', '#0f172a', '#064e3b', '#10b981'],
      },
    },
    series: [
      {
        name: 'Standardized Centroid',
        type: 'heatmap',
        data: data,
        label: {
          show: true,
          color: '#ffffff',
          fontSize: 10,
          fontFamily: 'monospace',
          formatter: (params: any) => {
            const v = params.value[2];
            return v > 0 ? `+${v}` : `${v}`;
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
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
