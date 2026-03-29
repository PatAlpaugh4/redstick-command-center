/**
 * Workstream 5A: Mobile Layout Optimization
 * ChartContainer Component with Responsive Height
 * 
 * Features:
 * - Responsive chart heights: h-48 mobile, h-64 tablet, h-80 desktop
 * - Maintains aspect ratio on resize
 * - Touch-friendly tooltips
 */

'use client';

import React from 'react';

// ============================================
// TYPES
// ============================================

export interface ChartContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  height?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  actions?: React.ReactNode;
  legend?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
}

// ============================================
// HEIGHT CONFIGURATIONS
// ============================================

const HEIGHT_CLASSES = {
  sm: 'h-40 sm:h-48 lg:h-56',     // Small charts
  md: 'h-48 sm:h-64 lg:h-80',     // Standard charts
  lg: 'h-64 sm:h-80 lg:h-96',     // Large charts
  xl: 'h-80 sm:h-96 lg:h-[28rem]', // Extra large charts
};

// ============================================
// LOADING SKELETON
// ============================================

const ChartSkeleton: React.FC<{ height: string }> = ({ height }) => (
  <div className={`${height} w-full animate-pulse bg-gray-100 rounded-lg flex items-end justify-around p-4`}>
    {[...Array(7)].map((_, i) => (
      <div
        key={i}
        className="w-8 bg-gray-200 rounded-t"
        style={{ 
          height: `${Math.random() * 60 + 20}%`,
          animationDelay: `${i * 0.1}s`
        }}
      />
    ))}
  </div>
);

// ============================================
// ERROR STATE
// ============================================

const ChartError: React.FC<{ message: string }> = ({ message }) => (
  <div className="h-48 sm:h-64 lg:h-80 w-full flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
    <svg 
      className="w-12 h-12 text-gray-400 mb-3" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
    <p className="text-sm text-gray-600">{message}</p>
  </div>
);

// ============================================
// MAIN CHART CONTAINER
// ============================================

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  title,
  description,
  height = 'md',
  className = '',
  actions,
  legend,
  loading = false,
  error = null,
}) => {
  const heightClass = HEIGHT_CLASSES[height];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      {(title || description || actions) && (
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="text-base font-semibold text-gray-900">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1 text-sm text-gray-500">
                  {description}
                </p>
              )}
            </div>
            
            {actions && (
              <div className="flex items-center gap-2 shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chart Content */}
      <div className="p-4 sm:p-6">
        {loading ? (
          <ChartSkeleton height={heightClass} />
        ) : error ? (
          <ChartError message={error} />
        ) : (
          <div className={`${heightClass} w-full`}>
            {children}
          </div>
        )}
      </div>

      {/* Legend */}
      {legend && (
        <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          {legend}
        </div>
      )}
    </div>
  );
};

// ============================================
// RESPONSIVE CHART GRID
// ============================================

export interface ChartGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const ChartGrid: React.FC<ChartGridProps> = ({
  children,
  columns = 2,
  className = '',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 sm:gap-6 ${className}`}>
      {children}
    </div>
  );
};

// ============================================
// CHART LEGEND COMPONENT
// ============================================

export interface LegendItem {
  label: string;
  color: string;
  value?: string | number;
}

export interface ChartLegendProps {
  items: LegendItem[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({
  items,
  orientation = 'horizontal',
  className = '',
}) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div 
      className={`
        flex ${isHorizontal ? 'flex-wrap gap-4' : 'flex-col gap-2'}
        ${className}
      `}
    >
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`
            flex items-center gap-2
            ${isHorizontal ? '' : 'justify-between'}
          `}
        >
          <div className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className="text-sm text-gray-600">{item.label}</span>
          </div>
          
          {item.value !== undefined && (
            <span className="text-sm font-medium text-gray-900 ml-auto">
              {item.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

// ============================================
// CHART TOOLTIP COMPONENT
// ============================================

export interface ChartTooltipProps {
  title?: string;
  items: { label: string; value: string | number; color?: string }[];
  className?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  title,
  items,
  className = '',
}) => {
  return (
    <div 
      className={`
        bg-gray-900 text-white 
        px-3 py-2 rounded-lg shadow-lg
        text-sm
        ${className}
      `}
      style={{ 
        maxWidth: '200px',
        touchAction: 'none' // Prevent scroll when touching tooltip
      }}
    >
      {title && (
        <div className="font-medium mb-1 pb-1 border-b border-gray-700">
          {title}
        </div>
      )}
      <div className="space-y-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {item.color && (
                <span 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span className="text-gray-300">{item.label}</span>
            </div>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export default ChartContainer;
