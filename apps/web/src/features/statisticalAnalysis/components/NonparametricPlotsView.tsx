import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Layers, Activity } from 'lucide-react';

interface NonparametricPlotsViewProps {
  title?: string;
  categories: string[];
  values: number[];
  type?: 'boxplot' | 'paired';
}

export const NonparametricPlotsView: React.FC<NonparametricPlotsViewProps> = ({
  title = 'Group Rank Distribution & Boxplot',
  categories,
  values,
  type = 'boxplot',
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
    },
    grid: { top: '20%', bottom: '15%', left: '12%', right: '8%' },
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series: [
      {
        name: 'Median Score',
        type: type === 'paired' ? 'line' : 'bar',
        data: values,
        smooth: true,
        symbolSize: 8,
        itemStyle: { color: type === 'paired' ? '#10b981' : '#a855f7', borderRadius: [4, 4, 0, 0] },
        lineStyle: type === 'paired' ? { width: 3, color: '#10b981' } : undefined,
      },
    ],
  };

  return (
    <div className="w-full h-80 bg-quantara-900 border border-quantara-800 rounded-2xl p-4 shadow-xl">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};
