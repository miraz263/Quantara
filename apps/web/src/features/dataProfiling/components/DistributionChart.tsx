import React from 'react';
import ReactECharts from 'echarts-for-react';

interface DistributionChartProps {
  title?: string;
  categories: string[];
  values: number[];
  color?: string;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({
  title,
  categories,
  values,
  color = '#3b82f6',
}) => {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '12%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8', fontSize: 11, rotate: categories.length > 8 ? 25 : 0 },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series: [
      {
        name: title || 'Frequency',
        type: 'bar',
        data: values,
        barMaxWidth: 35,
        itemStyle: {
          color: color,
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  return (
    <div className="w-full h-56">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};
