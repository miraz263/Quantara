import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useQuantaraStore } from '../store/useQuantaraStore';
import { BarChart3, Sliders, Save, PieChart, Activity, Layers } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const VisualizeWorkspacePage: React.FC = () => {
  const { variables } = useQuantaraStore();

  // Chart 1: Satisfaction by Gender (Bar Chart)
  const chart1Option = {
    title: { text: 'Satisfaction by Gender', textStyle: { color: '#f0f4f8', fontSize: 13, fontWeight: 'bold' } },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Male', 'Female'],
      axisLine: { lineStyle: { color: '#486581' } },
      axisLabel: { color: '#9fb3c8', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      name: 'Mean Satisfaction Score',
      min: 0,
      max: 10,
      axisLine: { lineStyle: { color: '#486581' } },
      splitLine: { lineStyle: { color: '#1b324a' } },
      axisLabel: { color: '#9fb3c8', fontSize: 11 }
    },
    series: [
      {
        name: 'Mean Satisfaction',
        type: 'bar',
        data: [7.15, 7.28],
        itemStyle: { color: '#2563eb', borderRadius: [4, 4, 0, 0] },
        barWidth: '40%'
      }
    ],
    backgroundColor: 'transparent'
  };

  // Chart 2: Satisfaction by Income (Scatter / Line Plot)
  const chart2Option = {
    title: { text: 'Satisfaction by Income ($ USD)', textStyle: { color: '#f0f4f8', fontSize: 13, fontWeight: 'bold' } },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['$20k-$40k', '$40k-$60k', '$60k-$80k', '$80k-$100k', '$100k+'],
      axisLine: { lineStyle: { color: '#486581' } },
      axisLabel: { color: '#9fb3c8', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      name: 'Mean Satisfaction',
      min: 0,
      max: 10,
      axisLine: { lineStyle: { color: '#486581' } },
      splitLine: { lineStyle: { color: '#1b324a' } },
      axisLabel: { color: '#9fb3c8', fontSize: 11 }
    },
    series: [
      {
        name: 'Satisfaction',
        type: 'line',
        smooth: true,
        data: [5.4, 6.8, 7.9, 8.7, 9.3],
        lineStyle: { color: '#059669', width: 3 },
        itemStyle: { color: '#059669' }
      }
    ],
    backgroundColor: 'transparent'
  };

  // Chart 3: Correlation Matrix Heatmap
  const correlationVariables = ['Age', 'Income', 'Satisfaction', 'Purchase Freq'];
  const chart3Option = {
    title: { text: 'Correlation Matrix', textStyle: { color: '#f0f4f8', fontSize: 13, fontWeight: 'bold' } },
    tooltip: { position: 'top' },
    grid: { height: '60%', top: '20%' },
    xAxis: { type: 'category', data: correlationVariables, axisLabel: { color: '#9fb3c8', fontSize: 10 } },
    yAxis: { type: 'category', data: correlationVariables, axisLabel: { color: '#9fb3c8', fontSize: 10 } },
    visualMap: {
      min: -1,
      max: 1,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      textStyle: { color: '#829ab1', fontSize: 10 },
      inRange: { color: ['#3b82f6', '#102a43', '#10b981'] }
    },
    series: [
      {
        name: 'Pearson r',
        type: 'heatmap',
        data: [
          [0, 0, 1.0], [0, 1, 0.24], [0, 2, 0.18], [0, 3, 0.12],
          [1, 0, 0.24], [1, 1, 1.0], [1, 2, 0.69], [1, 3, 0.54],
          [2, 0, 0.18], [2, 1, 0.69], [2, 2, 1.0], [2, 3, 0.48],
          [3, 0, 0.12], [3, 1, 0.54], [3, 2, 0.48], [3, 3, 1.0]
        ],
        label: { show: true, color: '#ffffff', fontSize: 10 }
      }
    ],
    backgroundColor: 'transparent'
  };

  // Chart 4: Respondent Composition (Pie Chart)
  const chart4Option = {
    title: { text: 'Respondent Composition by Region', textStyle: { color: '#f0f4f8', fontSize: 13, fontWeight: 'bold' } },
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left', textStyle: { color: '#829ab1', fontSize: 11 }, top: '20%' },
    series: [
      {
        name: 'Region',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '55%'],
        data: [
          { value: 4200, name: 'North Region' },
          { value: 3800, name: 'South Region' },
          { value: 2900, name: 'East Region' },
          { value: 1550, name: 'West Region' }
        ],
        itemStyle: {
          borderRadius: 6,
          borderColor: '#102a43',
          borderWidth: 2
        }
      }
    ],
    backgroundColor: 'transparent'
  };

  return (
    <div className="flex flex-col h-full bg-quantara-950 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
      {/* Studio Header */}
      <div className="flex items-center justify-between border-b border-quantara-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Quantara Visualization Studio
            </h1>
            <Badge variant="blue">DEMO MODE</Badge>
          </div>
          <p className="text-xs text-quantara-400 mt-1">
            Publication-ready statistical visualizations dynamically generated from tabular dataset observations.
          </p>
        </div>
      </div>

      {/* 4 Interactive Rendered Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-xl hover:border-quantara-700 transition">
          <ReactECharts option={chart1Option} style={{ height: '320px', width: '100%' }} />
        </div>

        {/* Chart 2 */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-xl hover:border-quantara-700 transition">
          <ReactECharts option={chart2Option} style={{ height: '320px', width: '100%' }} />
        </div>

        {/* Chart 3 */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-xl hover:border-quantara-700 transition">
          <ReactECharts option={chart3Option} style={{ height: '320px', width: '100%' }} />
        </div>

        {/* Chart 4 */}
        <div className="bg-quantara-900 border border-quantara-800 rounded-xl p-5 shadow-xl hover:border-quantara-700 transition">
          <ReactECharts option={chart4Option} style={{ height: '320px', width: '100%' }} />
        </div>
      </div>
    </div>
  );
};
