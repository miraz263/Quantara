import React from 'react';
import ReactECharts from 'echarts-for-react';

interface ElbowPlotChartProps {
  title?: string;
  categories: string[];
  wcssValues: number[];
  optimalK?: number;
}

export const ElbowPlotChart: React.FC<ElbowPlotChartProps> = ({
  title = 'Elbow Method Plot — Within-Cluster Sum of Squares (WCSS) vs K',
  categories,
  wcssValues,
  optimalK = 4,
}) => {
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
      formatter: (params: any[]) => {
        const p = params[0];
        const val = p.value;
        const kStr = p.name;
        const isElbow = kStr === `K = ${optimalK}`;
        return `
          <div style="font-weight:bold;margin-bottom:4px;">${kStr}</div>
          <div>WCSS / Inertia: <b style="color:#3b82f6;">${val.toFixed(1)}</b></div>
          <div>Status: <b style="color:${isElbow ? '#10b981' : '#94a3b8'};">${isElbow ? 'Optimal Elbow Point' : 'Candidate K'}</b></div>
        `;
      },
    },
    grid: { top: '22%', bottom: '15%', left: '10%', right: '8%' },
    xAxis: {
      type: 'category',
      name: 'Number of Clusters (K)',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: { color: '#94a3b8', fontSize: 11 },
      data: categories,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      name: 'WCSS / Inertia',
      nameTextStyle: { color: '#94a3b8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series: [
      {
        name: 'WCSS',
        type: 'line',
        data: wcssValues,
        smooth: false,
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          color: (params: any) => (categories[params.dataIndex] === `K = ${optimalK}` ? '#10b981' : '#3b82f6'),
        },
        lineStyle: { width: 3, color: '#3b82f6' },
        markPoint: {
          data: [
            {
              name: 'Optimal K Elbow',
              coord: [`K = ${optimalK}`, wcssValues[categories.indexOf(`K = ${optimalK}`)]],
              symbol: 'pin',
              symbolSize: 45,
              itemStyle: { color: '#10b981' },
              label: {
                formatter: `Elbow (K=${optimalK})`,
                fontSize: 10,
                color: '#ffffff',
                fontWeight: 'bold',
              },
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
