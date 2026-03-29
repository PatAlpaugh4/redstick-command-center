'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

interface DealFlowData {
  stage: string;
  count: number;
  percentage: number;
}

interface DealFlowChartProps {
  data?: DealFlowData[];
  isLoading?: boolean;
  /** 
   * Chart height - can be number (pixels) or 'responsive' for auto-sizing
   * @default 'responsive'
   */
  height?: number | 'responsive';
}

const mockData: DealFlowData[] = [
  { stage: 'Sourced', count: 124, percentage: 100 },
  { stage: 'Screened', count: 86, percentage: 69 },
  { stage: 'First Meeting', count: 52, percentage: 42 },
  { stage: 'Due Diligence', count: 28, percentage: 23 },
  { stage: 'Term Sheet', count: 14, percentage: 11 },
  { stage: 'Closed', count: 8, percentage: 6 },
];

const stageColors = [
  '#e94560', // Sourced - accent
  '#f472b6', // Screened
  '#a855f7', // First Meeting
  '#3b82f6', // Due Diligence - info
  '#f59e0b', // Term Sheet - warning
  '#10b981', // Closed - success
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as DealFlowData;
    return (
      <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
        <p className="text-text-primary font-medium mb-1">{data.stage}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-sm">Deals:</span>
            <span className="text-text-primary font-medium">{data.count}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-sm">Conversion:</span>
            <span className="text-text-primary font-medium">
              {data.percentage}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const LabelContent = (props: any) => {
  const { x, y, width, height, value, payload } = props;
  const percentage = payload.percentage;
  return (
    <text
      x={x + width + 8}
      y={y + height / 2}
      fill="#6a6a7a"
      textAnchor="start"
      dominantBaseline="middle"
      fontSize={11}
    >
      {value} ({percentage}%)
    </text>
  );
};

const Shimmer = () => (
  <div className="absolute inset-0 flex flex-col justify-center gap-3 p-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="h-3 bg-white/5 rounded animate-pulse w-20" />
        <div
          className="h-6 bg-white/5 rounded animate-pulse"
          style={{ width: `${100 - i * 15}%` }}
        />
      </div>
    ))}
  </div>
);

export const DealFlowChart: React.FC<DealFlowChartProps> = ({
  data = mockData,
  isLoading = false,
  height = 'responsive',
}) => {
  // Use responsive height classes when height is 'responsive'
  const containerHeight = height === 'responsive' ? '100%' : `${height}px`;
  const containerClass = height === 'responsive' ? 'h-48 sm:h-64 lg:h-80' : '';
  if (isLoading) {
    return (
      <div className={`relative ${containerClass}`} style={{ height: containerHeight }}>
        <Shimmer />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center text-text-tertiary ${containerClass}`}
        style={{ height: containerHeight }}
      >
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto mb-2 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <p className="text-sm">No deal flow data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClass}`} style={{ height: containerHeight }}>
      <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 60, left: 80, bottom: 10 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          horizontal={false}
        />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6a6a7a', fontSize: 11 }}
        />
        <YAxis
          type="category"
          dataKey="stage"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6a6a7a', fontSize: 12 }}
          width={70}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
        <Bar
          dataKey="count"
          radius={[0, 4, 4, 0]}
          barSize={24}
          animationDuration={1000}
        >
          <LabelList content={LabelContent} />
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={stageColors[index % stageColors.length]} />
          ))}
        </Bar>
      </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DealFlowChart;
