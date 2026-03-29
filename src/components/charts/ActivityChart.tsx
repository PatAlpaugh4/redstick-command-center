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
  Legend,
} from 'recharts';

interface ActivityData {
  month: string;
  new: number;
  closed: number;
  passed: number;
}

interface ActivityChartProps {
  data?: ActivityData[];
  isLoading?: boolean;
  /** 
   * Chart height - can be number (pixels) or 'responsive' for auto-sizing
   * @default 'responsive'
   */
  height?: number | 'responsive';
  /** Accessible label describing the chart */
  ariaLabel?: string;
}

const mockData: ActivityData[] = [
  { month: 'Jan', new: 12, closed: 3, passed: 2 },
  { month: 'Feb', new: 15, closed: 4, passed: 3 },
  { month: 'Mar', new: 18, closed: 5, passed: 4 },
  { month: 'Apr', new: 22, closed: 6, passed: 5 },
  { month: 'May', new: 19, closed: 7, passed: 3 },
  { month: 'Jun', new: 25, closed: 8, passed: 6 },
  { month: 'Jul', new: 28, closed: 9, passed: 7 },
  { month: 'Aug', new: 31, closed: 10, passed: 8 },
  { month: 'Sep', new: 26, closed: 8, passed: 5 },
  { month: 'Oct', new: 34, closed: 12, passed: 9 },
  { month: 'Nov', new: 29, closed: 11, passed: 6 },
  { month: 'Dec', new: 38, closed: 14, passed: 10 },
];

const activityColors = {
  new: '#3b82f6', // info - blue
  closed: '#10b981', // success - green
  passed: '#6a6a7a', // muted gray
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    return (
      <div className="bg-surface border border-border rounded-lg p-3 shadow-lg min-w-[140px]">
        <p className="text-text-primary font-medium mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-text-secondary text-sm capitalize">
                  {entry.dataKey}:
                </span>
              </div>
              <span className="text-text-primary font-medium text-sm">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary text-sm">Total:</span>
            <span className="text-text-primary font-medium">{total}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  if (!payload) return null;

  const labelMap: Record<string, string> = {
    new: 'New Deals',
    closed: 'Closed',
    passed: 'Passed',
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-2">
      {payload.map((entry: any, index: number) => (
        <div
          key={`legend-${index}`}
          className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-text-secondary">{labelMap[entry.value] || entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const Shimmer = () => (
  <div className="absolute inset-0 flex flex-col p-4">
    <div className="flex-1 flex items-end justify-between gap-2">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="w-full bg-white/5 rounded-t animate-pulse"
          style={{ height: `${30 + Math.random() * 50}%` }}
        />
      ))}
    </div>
    <div className="flex justify-between mt-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-3 bg-white/5 rounded animate-pulse w-8" />
      ))}
    </div>
  </div>
);

export const ActivityChart: React.FC<ActivityChartProps> = ({
  data = mockData,
  isLoading = false,
  height = 'responsive',
  ariaLabel = 'Activity chart showing deals by month',
}) => {
  // Use responsive height classes when height is 'responsive'
  const containerHeight = height === 'responsive' ? '100%' : `${height}px`;
  const containerClass = height === 'responsive' ? 'h-48 sm:h-64 lg:h-80' : '';
  if (isLoading) {
    return (
      <div 
        className={`relative ${containerClass}`}
        style={{ height: containerHeight }}
        aria-label={ariaLabel}
        role="img"
        aria-busy="true"
      >
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-sm">No activity data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClass}`} style={{ height: containerHeight }}>
    <ResponsiveContainer 
      width="100%" 
      height="100%"
      aria-label={ariaLabel}
      role="img"
    >
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.05)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6a6a7a', fontSize: 11 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6a6a7a', fontSize: 11 }}
          dx={-10}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
        <Legend content={<CustomLegend />} />
        <Bar
          dataKey="new"
          stackId="a"
          fill={activityColors.new}
          radius={[0, 0, 0, 0]}
          animationDuration={800}
        />
        <Bar
          dataKey="closed"
          stackId="a"
          fill={activityColors.closed}
          radius={[0, 0, 0, 0]}
          animationDuration={800}
          animationBegin={200}
        />
        <Bar
          dataKey="passed"
          stackId="a"
          fill={activityColors.passed}
          radius={[4, 4, 0, 0]}
          animationDuration={800}
          animationBegin={400}
        />
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
