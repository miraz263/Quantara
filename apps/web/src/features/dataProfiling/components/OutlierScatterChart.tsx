import React from 'react';
import ReactECharts from 'echarts-for-react';

interface OutlierScatterChartProps {
  variableName: string;
}

export const OutlierScatterChart: React.FC<OutlierScatterChartProps> = ({ variableName }) => {
  // Generated sample scatter points: [caseIndex, value, isOutlier]
  const normalPoints = [
    [10, 45000], [25, 52000], [40, 61000], [65, 48000], [90, 72000],
    [120, 58000], [150, 64000], [180, 81000], [210, 39000], [250, 75000],
    [290, 68000], [340, 54000], [400, 89000], [450, 42000], [490, 71000]
  ];

  const outlierPoints = [
    [1842, 1250000], [2314, 980000], [3105, 1100000]
  ];

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `Case #${params.value[0]} • Value: ${params.value[1].toLocaleString()}`,
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: 'Case Index',
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      name: variableName,
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series: [
      {
        name: 'Normal Observations',
        type: 'scatter',
        data: normalPoints,
        symbolSize: 8,
        itemStyle: { color: '#3b82f6', opacity: 0.8 },
      },
      {
        name: 'Flagged Outliers',
        type: 'scatter',
        data: outlierPoints,
        symbolSize: 14,
        itemStyle: { color: '#f43f5e', opacity: 1 },
      },
    ],
  };

  return (
    <div className="w-full h-64">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};
