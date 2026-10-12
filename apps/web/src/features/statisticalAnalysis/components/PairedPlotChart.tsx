import React from 'react';
import ReactECharts from 'echarts-for-react';

interface PairedPlotChartProps {
  title?: string;
  var1Label?: string;
  var2Label?: string;
  mean1?: number;
  mean2?: number;
  samplePairs?: Array<[number, number]>;
}

export const PairedPlotChart: React.FC<PairedPlotChartProps> = ({
  title = 'Paired Slope Plot (Pre vs Post Measurement Change)',
  var1Label = 'Baseline Assessment (Pre)',
  var2Label = 'Follow-up Assessment (Post)',
  mean1 = 62.4,
  mean2 = 68.7,
  samplePairs = [
    [52, 60], [58, 65], [60, 68], [63, 71], [65, 70],
    [70, 75], [72, 78], [75, 82], [55, 62], [68, 73],
  ],
}) => {
  // Individual pair lines
  const seriesLines = samplePairs.map((pair, idx) => ({
    name: `Obs ${idx + 1}`,
    type: 'line',
    data: [pair[0], pair[1]],
    showSymbol: true,
    symbolSize: 6,
    lineStyle: {
      color: '#64748b',
      width: 1,
      type: 'dashed',
      opacity: 0.6,
    },
    itemStyle: {
      color: '#94a3b8',
    },
  }));

  // Mean trend line
  const meanSeries = {
    name: 'Group Mean Trend',
    type: 'line',
    data: [mean1, mean2],
    showSymbol: true,
    symbolSize: 12,
    lineStyle: {
      color: '#10b981',
      width: 3.5,
    },
    itemStyle: {
      color: '#10b981',
      borderColor: '#ffffff',
      borderWidth: 2,
    },
    label: {
      show: true,
      position: 'top',
      color: '#10b981',
      fontWeight: 'bold',
      fontSize: 12,
      formatter: (p: any) => `Mean = ${p.value}`,
    },
  };

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: title,
      subtext: `Mean Change: Δ = ${(mean2 - mean1).toFixed(2)} (from ${mean1} to ${mean2})`,
      textStyle: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold' },
      subtextStyle: { color: '#10b981', fontSize: 11, fontWeight: 'bold' },
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
    },
    grid: {
      top: '22%',
      bottom: '12%',
      left: '12%',
      right: '12%',
    },
    xAxis: {
      type: 'category',
      data: [var1Label, var2Label],
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series: [...seriesLines, meanSeries],
  };

  return (
    <div className="w-full h-80 bg-quantara-900 border border-quantara-800 rounded-2xl p-4 shadow-xl">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};
