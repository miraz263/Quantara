import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Sliders } from 'lucide-react';

interface ScreePlotChartProps {
  title?: string;
  categories: string[];
  eigenvalues: number[];
  retainedCount?: number;
}

export const ScreePlotChart: React.FC<ScreePlotChartProps> = ({
  title = 'Scree Plot — Component Eigenvalue Retention Curve',
  categories,
  eigenvalues,
  retainedCount = 3,
}) => {
  const totalVariance = eigenvalues.reduce((acc, v) => acc + v, 0);

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
        const idx = p.dataIndex;
        const pct = ((val / totalVariance) * 100).toFixed(2);
        const cumPct = (
          (eigenvalues.slice(0, idx + 1).reduce((a, b) => a + b, 0) / totalVariance) *
          100
        ).toFixed(2);
        return `
          <div style="font-weight:bold;margin-bottom:4px;">${p.name}</div>
          <div>Eigenvalue: <b style="color:#3b82f6;">${val.toFixed(3)}</b></div>
          <div>Variance Explained: <b>${pct}%</b></div>
          <div>Cumulative Variance: <b>${cumPct}%</b></div>
          <div>Status: <b style="color:${val >= 1 ? '#10b981' : '#94a3b8'};">${val >= 1 ? 'Retained (λ ≥ 1.0)' : 'Not Retained'}</b></div>
        `;
      },
    },
    grid: { top: '22%', bottom: '15%', left: '10%', right: '8%' },
    xAxis: {
      type: 'category',
      name: 'Component / Factor',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: { color: '#94a3b8', fontSize: 11 },
      data: categories,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      name: 'Eigenvalue (λ)',
      nameTextStyle: { color: '#94a3b8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series: [
      {
        name: 'Eigenvalue',
        type: 'line',
        data: eigenvalues,
        smooth: false,
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          color: (params: any) => (params.dataIndex < retainedCount ? '#3b82f6' : '#64748b'),
        },
        lineStyle: { width: 3, color: '#3b82f6' },
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
            {
              yAxis: 1.0,
              label: {
                formatter: 'Kaiser Criterion (λ = 1.0)',
                color: '#ef4444',
                fontSize: 10,
                fontWeight: 'bold',
                position: 'end',
              },
              lineStyle: { color: '#ef4444', type: 'dashed', width: 2 },
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
