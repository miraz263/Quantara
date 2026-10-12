import React from 'react';
import ReactECharts from 'echarts-for-react';

interface AnovaBoxPlotChartProps {
  title?: string;
  categories: string[];
  // Box plot data per group: [min, Q1, median, Q3, max]
  boxData?: Array<[number, number, number, number, number]>;
}

export const AnovaBoxPlotChart: React.FC<AnovaBoxPlotChartProps> = ({
  title = 'Group Distribution & Outlier Box Plot',
  categories = ['Primary', 'Secondary', 'Higher Sec', 'Graduate', 'Postgraduate'],
  boxData = [
    [12000, 30000, 42000, 52000, 98000],
    [14000, 36000, 50000, 64000, 145000],
    [16000, 42000, 58000, 75000, 180000],
    [20000, 55000, 76000, 98000, 350000],
    [25000, 64000, 90000, 115000, 450000],
  ],
}) => {
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: title,
      textStyle: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold' },
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
      formatter: (param: any) => {
        if (param.data) {
          const [min, q1, median, q3, max] = param.data.value ? param.data.value.slice(1) : param.data;
          return `
            <div style="font-weight: bold; margin-bottom: 4px;">${param.name}</div>
            <div>Max: <b>$${max?.toLocaleString()}</b></div>
            <div>Q3 (75th): <b>$${q3?.toLocaleString()}</b></div>
            <div>Median: <b>$${median?.toLocaleString()}</b></div>
            <div>Q1 (25th): <b>$${q1?.toLocaleString()}</b></div>
            <div>Min: <b>$${min?.toLocaleString()}</b></div>
          `;
        }
        return '';
      },
    },
    grid: {
      top: '18%',
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
      name: 'Household Income ($)',
      nameTextStyle: { color: '#94a3b8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series: [
      {
        name: 'Income Distribution',
        type: 'boxplot',
        data: boxData,
        itemStyle: {
          color: '#3b82f6',
          borderColor: '#60a5fa',
          borderWidth: 1.5,
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
