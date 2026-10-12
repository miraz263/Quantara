import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';

interface ScatterTrendPlotProps {
  xVarLabel?: string;
  yVarLabel?: string;
  xVarName?: string;
  yVarName?: string;
  availableVars?: string[];
  points?: Array<[number, number]>;
  rValue?: number;
  pValue?: number;
  n?: number;
}

export const ScatterTrendPlot: React.FC<ScatterTrendPlotProps> = ({
  xVarLabel = 'Waiting Time (minutes)',
  yVarLabel = 'Satisfaction Rating (1-5)',
  points,
  rValue = -0.542,
  pValue = 0.0001,
  n = 24320,
}) => {
  // Generate scatter points with a realistic standard error distribution if not passed
  const samplePoints: Array<[number, number]> = points || [
    [5, 4.8], [10, 4.6], [12, 4.9], [15, 4.2], [18, 4.0], [20, 3.8], [22, 4.1],
    [25, 3.5], [28, 3.9], [30, 3.2], [35, 3.4], [40, 2.9], [45, 3.1], [50, 2.5],
    [55, 2.6], [60, 2.2], [70, 2.0], [75, 1.9], [85, 1.6], [90, 1.4], [105, 1.2]
  ];

  // Calculate linear regression line points: y = a + bx
  const xValues = samplePoints.map((p) => p[0]);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);

  const meanX = xValues.reduce((a, b) => a + b, 0) / xValues.length;
  const yValues = samplePoints.map((p) => p[1]);
  const meanY = yValues.reduce((a, b) => a + b, 0) / yValues.length;

  const num = samplePoints.reduce((sum, p) => sum + (p[0] - meanX) * (p[1] - meanY), 0);
  const den = samplePoints.reduce((sum, p) => sum + (p[0] - meanX) ** 2, 0);
  const slope = den !== 0 ? num / den : 0;
  const intercept = meanY - slope * meanX;

  const lineStart: [number, number] = [minX, intercept + slope * minX];
  const lineEnd: [number, number] = [maxX, intercept + slope * maxX];

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: `Bivariate Scatter Plot & Linear Trend Line`,
      subtext: `r = ${rValue > 0 ? '+' : ''}${rValue}, p ${pValue < 0.001 ? '< .001' : `= ${pValue}`}, N = ${n.toLocaleString()}`,
      textStyle: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold' },
      subtextStyle: { color: '#3b82f6', fontSize: 11, fontWeight: 'bold' },
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
      formatter: (p: any) => {
        if (p.seriesType === 'scatter') {
          return `${xVarLabel}: <b>${p.value[0]}</b><br/>${yVarLabel}: <b>${p.value[1]}</b>`;
        }
        return `Linear Fit: y = ${intercept.toFixed(2)} ${slope >= 0 ? '+' : ''}${slope.toFixed(3)}x`;
      },
    },
    grid: {
      top: '20%',
      bottom: '12%',
      left: '10%',
      right: '8%',
    },
    xAxis: {
      type: 'value',
      name: xVarLabel,
      nameLocation: 'middle',
      nameGap: 28,
      nameTextStyle: { color: '#94a3b8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      name: yVarLabel,
      nameLocation: 'middle',
      nameGap: 32,
      nameTextStyle: { color: '#94a3b8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    series: [
      {
        name: 'Observations',
        type: 'scatter',
        data: samplePoints,
        symbolSize: 8,
        itemStyle: {
          color: '#3b82f6',
          opacity: 0.8,
        },
      },
      {
        name: 'OLS Linear Fit',
        type: 'line',
        data: [lineStart, lineEnd],
        showSymbol: false,
        lineStyle: {
          color: '#10b981',
          width: 2.5,
          type: 'solid',
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
