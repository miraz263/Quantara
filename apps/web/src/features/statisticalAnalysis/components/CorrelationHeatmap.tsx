import React from 'react';
import ReactECharts from 'echarts-for-react';

interface CorrelationHeatmapProps {
  title?: string;
  variables: string[];
  matrix: number[][]; // N x N matrix of coefficients (-1.0 to +1.0)
}

export const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  title = 'Correlation Matrix Heatmap',
  variables,
  matrix,
}) => {
  // Convert 2D matrix into ECharts heatmap data [xIndex, yIndex, value]
  const data: Array<[number, number, number]> = [];
  for (let i = 0; i < variables.length; i++) {
    for (let j = 0; j < variables.length; j++) {
      const val = matrix[i] && matrix[i][j] !== undefined ? matrix[i][j] : 0;
      data.push([j, i, parseFloat(val.toFixed(3))]);
    }
  }

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: title,
      textStyle: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold' },
      left: 'center',
      top: 5,
    },
    tooltip: {
      position: 'top',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
      formatter: (params: any) => {
        const xVar = variables[params.value[0]];
        const yVar = variables[params.value[1]];
        const coef = params.value[2];
        return `
          <div style="font-weight: bold; margin-bottom: 4px;">${xVar} &leftrightarrow; ${yVar}</div>
          <div>Correlation Coefficient (r): <b>${coef > 0 ? '+' : ''}${coef}</b></div>
        `;
      },
    },
    grid: {
      top: '18%',
      bottom: '15%',
      left: '18%',
      right: '12%',
    },
    xAxis: {
      type: 'category',
      data: variables,
      splitArea: { show: true },
      axisLabel: { color: '#94a3b8', fontSize: 11, rotate: variables.length > 5 ? 30 : 0 },
      axisLine: { lineStyle: { color: '#334155' } },
    },
    yAxis: {
      type: 'category',
      data: variables,
      splitArea: { show: true },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
      inverse: true,
    },
    visualMap: {
      min: -1.0,
      max: 1.0,
      calculable: true,
      orient: 'vertical',
      right: '1%',
      top: 'center',
      itemHeight: 120,
      inRange: {
        color: ['#f43f5e', '#334155', '#3b82f6', '#10b981'], // Red (-1) -> Dark (0) -> Blue (+0.5) -> Emerald (+1)
      },
      textStyle: { color: '#94a3b8', fontSize: 10 },
    },
    series: [
      {
        name: 'Correlation',
        type: 'heatmap',
        data: data,
        label: {
          show: true,
          color: '#ffffff',
          fontSize: 11,
          fontWeight: 'bold',
          formatter: (p: any) => (p.value[2] > 0 ? `+${p.value[2]}` : `${p.value[2]}`),
        },
        itemStyle: {
          borderColor: '#0f172a',
          borderWidth: 2,
        },
      },
    ],
  };

  return (
    <div className="w-full h-80 bg-quantara-900 border border-quantara-800 rounded-2xl p-4 shadow-xl">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};
