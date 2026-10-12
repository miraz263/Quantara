import React from 'react';
import ReactECharts from 'echarts-for-react';

export const MissingnessHeatmap: React.FC = () => {
  const variables = ['patient_id', 'age', 'sex', 'education', 'income', 'satisfaction'];
  const caseBlocks = ['Cases 1-5k', 'Cases 5k-10k', 'Cases 10k-15k', 'Cases 15k-20k', 'Cases 20k-24k'];

  // Matrix data [caseIdx, varIdx, value (0 = present, 1 = missing)]
  const data = [
    [0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 3, 0.2], [0, 4, 3.1], [0, 5, 0.4],
    [1, 0, 0], [1, 1, 0.1], [1, 2, 0], [1, 3, 1.8], [1, 4, 4.2], [1, 5, 0.8],
    [2, 0, 0], [2, 1, 0], [2, 2, 0.1], [2, 3, 2.5], [2, 4, 2.9], [2, 5, 0.5],
    [3, 0, 0], [3, 1, 0.3], [3, 2, 0], [3, 3, 1.9], [3, 4, 3.8], [3, 5, 0.6],
    [4, 0, 0], [4, 1, 0], [4, 2, 0], [4, 3, 2.1], [4, 4, 2.4], [4, 5, 1.1],
  ];

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      position: 'top',
      formatter: (params: any) => `${caseBlocks[params.value[0]]} • ${variables[params.value[1]]}: ${params.value[2]}% missing`,
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
    },
    grid: {
      height: '70%',
      top: '10%',
      bottom: '15%',
    },
    xAxis: {
      type: 'category',
      data: caseBlocks,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: variables,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#f8fafc', fontSize: 11, fontFamily: 'monospace' },
    },
    visualMap: {
      min: 0,
      max: 5,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      inRange: {
        color: ['#0f172a', '#1e293b', '#f59e0b', '#f43f5e'],
      },
      textStyle: { color: '#94a3b8', fontSize: 10 },
    },
    series: [
      {
        name: 'Missingness Matrix',
        type: 'heatmap',
        data: data,
        label: { show: false },
        itemStyle: {
          borderWidth: 1,
          borderColor: '#020617',
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
