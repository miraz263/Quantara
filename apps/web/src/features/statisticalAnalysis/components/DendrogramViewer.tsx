import React from 'react';
import ReactECharts from 'echarts-for-react';
import { GitCommit, Layers } from 'lucide-react';

interface DendrogramViewerProps {
  title?: string;
  cutK?: number;
}

export const DendrogramViewer: React.FC<DendrogramViewerProps> = ({
  title = "Dendrogram — Agglomerative Hierarchical Tree (Ward's Linkage)",
  cutK = 4,
}) => {
  // ECharts Tree structure representing hierarchical cluster merging
  const treeData = {
    name: `Cut K=${cutK} (Total N=2,432)`,
    children: [
      {
        name: 'Cluster 1: High Value Loyalists (N=842)',
        children: [
          { name: 'Sub-group A1 (N=420)' },
          { name: 'Sub-group A2 (N=422)' },
        ],
      },
      {
        name: 'Cluster 2: Cost-Sensitive Price Seekers (N=680)',
        children: [
          { name: 'Sub-group B1 (N=310)' },
          { name: 'Sub-group B2 (N=370)' },
        ],
      },
      {
        name: 'Cluster 3: Disengaged At-Risk (N=410)',
        children: [
          { name: 'Sub-group C1 (N=190)' },
          { name: 'Sub-group C2 (N=220)' },
        ],
      },
      {
        name: 'Cluster 4: High Usage Explorers (N=500)',
        children: [
          { name: 'Sub-group D1 (N=240)' },
          { name: 'Sub-group D2 (N=260)' },
        ],
      },
    ],
  };

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: title,
      textStyle: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold' },
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
    },
    series: [
      {
        type: 'tree',
        data: [treeData],
        top: '18%',
        left: '12%',
        bottom: '12%',
        right: '25%',
        symbol: 'emptyCircle',
        symbolSize: 8,
        orient: 'LR',
        initialTreeDepth: 2,
        lineStyle: {
          color: '#3b82f6',
          width: 2,
          curveness: 0.5,
        },
        itemStyle: {
          color: '#10b981',
          borderColor: '#3b82f6',
        },
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 11,
          color: '#f8fafc',
          fontWeight: 'bold',
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
            color: '#94a3b8',
            fontSize: 10,
          },
        },
        emphasis: {
          focus: 'descendant',
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
      },
    ],
  };

  return (
    <div className="w-full h-96 bg-quantara-900 border border-quantara-800 rounded-2xl p-4 shadow-xl font-sans space-y-2">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};
