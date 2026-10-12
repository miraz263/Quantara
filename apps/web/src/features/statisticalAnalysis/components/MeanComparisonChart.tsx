import React from 'react';
import ReactECharts from 'echarts-for-react';

interface MeanComparisonChartProps {
  title?: string;
  categories: string[];
  means: number[];
  ciLower?: number[];
  ciUpper?: number[];
  testValueRef?: number; // For One-Sample t-Test reference line
}

export const MeanComparisonChart: React.FC<MeanComparisonChartProps> = ({
  title = 'Sample Means with 95% Confidence Intervals',
  categories,
  means,
  ciLower,
  ciUpper,
  testValueRef,
}) => {
  // Build error bar data format: [categoryIndex, lower, upper]
  const errorBarData = categories.map((_, i) => {
    const low = ciLower && ciLower[i] !== undefined ? ciLower[i] : means[i] * 0.95;
    const high = ciUpper && ciUpper[i] !== undefined ? ciUpper[i] : means[i] * 1.05;
    return [i, parseFloat(low.toFixed(2)), parseFloat(high.toFixed(2))];
  });

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
      formatter: (params: any) => {
        const catName = params[0]?.name || '';
        const meanVal = params[0]?.value;
        const low = ciLower ? ciLower[params[0]?.dataIndex] : '—';
        const high = ciUpper ? ciUpper[params[0]?.dataIndex] : '—';
        return `
          <div style="font-weight: bold; margin-bottom: 4px;">${catName}</div>
          <div>Mean Estimate: <b>${typeof meanVal === 'number' ? meanVal.toLocaleString() : meanVal}</b></div>
          ${ciLower ? `<div>95% CI: <b>[${low}, ${high}]</b></div>` : ''}
        `;
      },
    },
    grid: {
      top: '20%',
      bottom: '12%',
      left: '12%',
      right: '8%',
    },
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
        name: 'Group Mean',
        type: 'bar',
        data: means,
        barMaxWidth: 40,
        itemStyle: {
          color: '#3b82f6',
          borderRadius: [4, 4, 0, 0],
        },
        markLine: testValueRef !== undefined ? {
          silent: false,
          symbol: ['none', 'none'],
          label: {
            formatter: `Test Value = ${testValueRef.toLocaleString()}`,
            color: '#f59e0b',
            fontSize: 11,
            fontWeight: 'bold',
          },
          lineStyle: {
            color: '#f59e0b',
            type: 'dashed',
            width: 2,
          },
          data: [{ yAxis: testValueRef }],
        } : undefined,
      },
    ],
  };

  return (
    <div className="w-full h-80 bg-quantara-900 border border-quantara-800 rounded-2xl p-4 shadow-xl">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};
