import React from 'react';
import ReactECharts from 'echarts-for-react';

interface MissingnessBarChartProps {
  data: Array<{ variableName: string; missingPercentage: number }>;
}

export const MissingnessBarChart: React.FC<MissingnessBarChartProps> = ({ data }) => {
  const sorted = [...data].sort((a, b) => a.missingPercentage - b.missingPercentage);
  const categories = sorted.map((d) => d.variableName);
  const values = sorted.map((d) => d.missingPercentage);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c}% missing',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 11, formatter: '{value}%' },
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#f8fafc', fontSize: 11, fontFamily: 'monospace' },
    },
    series: [
      {
        type: 'bar',
        data: values,
        itemStyle: {
          color: (params: any) => (params.value > 3.0 ? '#f43f5e' : '#f59e0b'),
          borderRadius: [0, 4, 4, 0],
        },
      },
    ],
  };

  return (
    <div className="w-full h-64">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};
