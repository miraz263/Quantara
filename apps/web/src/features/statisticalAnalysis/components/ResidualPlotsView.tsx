import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Activity, LineChart, PieChart } from 'lucide-react';

interface ResidualPlotsViewProps {
  rSquared?: number;
  stdError?: number;
}

export const ResidualPlotsView: React.FC<ResidualPlotsViewProps> = ({
  rSquared = 0.624,
  stdError = 19840.2,
}) => {
  // Sample scatter data for Residuals vs Predicted
  const residualVsPredData = [
    [-1.5, 0.4], [-1.2, -0.8], [-0.9, 0.1], [-0.5, 0.9], [-0.2, -0.3],
    [0.1, 0.6], [0.4, -0.9], [0.8, 0.2], [1.2, -0.4], [1.5, 0.8],
    [1.8, -1.1], [2.1, 0.3], [2.4, -0.7], [-1.8, -0.2], [0.0, 0.1],
  ];

  // Sample scatter data for Actual vs Predicted
  const actualVsPredData = [
    [22000, 24000], [41000, 39500], [59000, 61200], [81000, 78400],
    [99000, 102100], [122000, 118900], [139000, 141200], [35000, 32000],
    [52000, 54100], [71000, 69800], [88000, 91500], [115000, 112000],
  ];

  const residualOption = {
    backgroundColor: 'transparent',
    title: {
      text: 'Residuals vs Predicted (Scatter Plot)',
      textStyle: { color: '#f8fafc', fontSize: 12, fontWeight: 'bold' },
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 11 },
      formatter: (p: any) => `Std. Predicted: ${p.value[0]}<br/>Std. Residual: ${p.value[1]}`,
    },
    grid: { top: '22%', bottom: '15%', left: '12%', right: '8%' },
    xAxis: {
      type: 'value',
      name: 'Std. Predicted',
      nameTextStyle: { color: '#94a3b8', fontSize: 10 },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      name: 'Std. Residual',
      nameTextStyle: { color: '#94a3b8', fontSize: 10 },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    series: [
      {
        type: 'scatter',
        symbolSize: 8,
        data: residualVsPredData,
        itemStyle: { color: '#60a5fa' },
        markLine: {
          symbol: ['none', 'none'],
          lineStyle: { color: '#f59e0b', type: 'dashed', width: 1.5 },
          label: { formatter: 'Zero Line', color: '#f59e0b', fontSize: 10 },
          data: [{ yAxis: 0 }],
        },
      },
    ],
  };

  const actualVsPredOption = {
    backgroundColor: 'transparent',
    title: {
      text: 'Actual vs Predicted Outcome ($)',
      textStyle: { color: '#f8fafc', fontSize: 12, fontWeight: 'bold' },
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 11 },
      formatter: (p: any) => `Actual: $${p.value[0].toLocaleString()}<br/>Predicted: $${p.value[1].toLocaleString()}`,
    },
    grid: { top: '22%', bottom: '15%', left: '14%', right: '8%' },
    xAxis: {
      type: 'value',
      name: 'Actual Outcome',
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      name: 'Predicted Outcome',
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    series: [
      {
        type: 'scatter',
        symbolSize: 8,
        data: actualVsPredData,
        itemStyle: { color: '#10b981' },
        markLine: {
          symbol: ['none', 'none'],
          lineStyle: { color: '#3b82f6', type: 'solid', width: 1.5 },
          label: { formatter: '45° Ideal Fit Line', color: '#3b82f6', fontSize: 10 },
          data: [{ select: false, start: [20000, 20000], end: [140000, 140000] }],
        },
      },
    ],
  };

  // Histogram of Residuals Option
  const histogramOption = {
    backgroundColor: 'transparent',
    title: {
      text: 'Histogram of Standardized Residuals',
      textStyle: { color: '#f8fafc', fontSize: 12, fontWeight: 'bold' },
      left: 'center',
    },
    grid: { top: '22%', bottom: '15%', left: '12%', right: '8%' },
    xAxis: {
      type: 'category',
      data: ['-3.0', '-2.0', '-1.0', '0.0', '1.0', '2.0', '3.0'],
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    series: [
      {
        type: 'bar',
        data: [120, 1420, 6800, 10240, 6120, 1380, 140],
        itemStyle: { color: '#a855f7', borderRadius: [4, 4, 0, 0] },
      },
    ],
  };

  return (
    <div className="bg-quantara-900 border border-quantara-800 rounded-2xl p-6 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-950/80 border border-indigo-800 text-indigo-400 rounded-lg">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Regression Diagnostics Visualizations</h3>
            <p className="text-[11px] text-quantara-400">
              Diagnostic plots for homoscedasticity, linearity, and residual distribution
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-lg flex items-center gap-2">
          <span>R² = {rSquared.toFixed(3)}</span>
          <span>•</span>
          <span>S_e = ${stdError.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-72 bg-quantara-950 border border-quantara-800 rounded-xl p-3">
          <ReactECharts option={residualOption} style={{ height: '100%', width: '100%' }} />
        </div>
        <div className="h-72 bg-quantara-950 border border-quantara-800 rounded-xl p-3">
          <ReactECharts option={actualVsPredOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      <div className="h-64 bg-quantara-950 border border-quantara-800 rounded-xl p-3">
        <ReactECharts option={histogramOption} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};
