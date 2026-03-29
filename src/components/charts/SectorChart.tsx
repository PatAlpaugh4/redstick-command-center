'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from 'recharts';

interface SectorData {
  name: string;
  value: number;
  percentage: number;
}

interface SectorChartProps {
  data?: SectorData[];
  isLoading?: boolean;
  /** 
   * Chart height - can be number (pixels) or 'responsive' for auto-sizing
   * @default 'responsive'
   */
  height?: number | 'responsive';
}

const mockData: SectorData[] = [
  { name: 'Enterprise SaaS', value: 45.2, percentage: 32.5 },
  { name: 'Fintech', value: 28.6, percentage: 20.6 },
  { name: 'HealthTech', value: 22.4, percentage: 16.1 },
  { name: 'AI/ML', value: 18.8, percentage: 13.5 },
  { name: 'DevTools', value: 14.3, percentage: 10.3 },
  { name: 'Consumer', value: 9.7, percentage: 7.0 },
];

const sectorColors = [
  '#e94560', // Enterprise SaaS - accent
  '#3b82f6', // Fintech - info
  '#10b981', // HealthTech - success
  '#8b5cf6', // AI/ML
  '#f59e0b', // DevTools - warning
  '#06b6d4', // Consumer
];

const RADIAN = Math.PI / 180;

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke={fill}
        strokeWidth={2}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as SectorData;
    return (
      <div className="bg-surface border border-border rounded-lg p-3 shadow-lg min-w-[160px]">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].color }}
          />
          <p className="text-text-primary font-medium text-sm">{data.name}</p>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-sm">Value:</span>
            <span className="text-text-primary font-medium">
              ${data.value.toFixed(1)}M
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-sm">Share:</span>
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

const Shimmer = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="relative w-32 h-32">
      <div className="absolute inset-0 rounded-full border-8 border-white/5 animate-pulse" />
      <div className="absolute inset-4 rounded-full border-8 border-white/5 animate-pulse" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-4 bg-white/5 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

export const SectorChart: React.FC<SectorChartProps> = ({
  data = mockData,
  isLoading = false,
  height = 'responsive',
}) => {
  // Use responsive height classes when height is 'responsive'
  const containerHeight = height === 'responsive' ? '100%' : `${height}px`;
  const containerClass = height === 'responsive' ? 'h-48 sm:h-64 lg:h-80' : '';
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

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
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
          <p className="text-sm">No sector data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${containerClass}`} style={{ height: containerHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex ?? undefined}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={sectorColors[index % sectorColors.length]}
                stroke="transparent"
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center mt-4">
          <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">
            Total
          </p>
          <p className="text-text-primary font-bold text-xl">
            ${totalValue.toFixed(0)}M
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 px-4">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition-opacity"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: sectorColors[index % sectorColors.length] }}
            />
            <span className="text-text-secondary truncate">{item.name}</span>
            <span className="text-text-tertiary text-xs ml-auto">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectorChart;
