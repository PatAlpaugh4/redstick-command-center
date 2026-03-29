/**
 * Workstream 5A: Mobile Layout Optimization
 * StatsCard Component with Responsive Grid
 * 
 * Features:
 * - Responsive grid: 1 col mobile, 2 tablet, 4 desktop
 * - Touch-friendly cards
 * - Loading skeleton state
 * - Trend indicators
 */

'use client';

import React from 'react';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface StatsCardData {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  href?: string;
  onClick?: () => void;
}

export interface StatsCardProps extends StatsCardData {
  loading?: boolean;
  className?: string;
}

export interface StatsGridProps {
  cards: StatsCardData[];
  loading?: boolean;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

// ============================================
// COLOR CONFIGURATIONS
// ============================================

const COLOR_SCHEMES = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'bg-blue-100 text-blue-600',
    text: 'text-blue-900',
    trendUp: 'text-blue-600',
    trendDown: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'bg-green-100 text-green-600',
    text: 'text-green-900',
    trendUp: 'text-green-600',
    trendDown: 'text-green-600',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'bg-yellow-100 text-yellow-600',
    text: 'text-yellow-900',
    trendUp: 'text-yellow-600',
    trendDown: 'text-yellow-600',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'bg-red-100 text-red-600',
    text: 'text-red-900',
    trendUp: 'text-red-600',
    trendDown: 'text-red-600',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'bg-purple-100 text-purple-600',
    text: 'text-purple-900',
    trendUp: 'text-purple-600',
    trendDown: 'text-purple-600',
  },
  gray: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: 'bg-gray-100 text-gray-600',
    text: 'text-gray-900',
    trendUp: 'text-gray-600',
    trendDown: 'text-gray-600',
  },
};

// ============================================
// LOADING SKELETON
// ============================================

const StatsCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-3 flex-1">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded w-32" />
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
      <div className="h-12 w-12 bg-gray-200 rounded-lg" />
    </div>
  </div>
);

// ============================================
// STATS CARD COMPONENT
// ============================================

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'blue',
  href,
  onClick,
  loading = false,
  className = '',
}) => {
  const colors = COLOR_SCHEMES[color];

  if (loading) {
    return <StatsCardSkeleton />;
  }

  const TrendIcon = trend?.direction === 'up' 
    ? ArrowUp 
    : trend?.direction === 'down' 
      ? ArrowDown 
      : Minus;

  const trendColor = trend?.direction === 'up' 
    ? colors.trendUp 
    : trend?.direction === 'down' 
      ? colors.trendDown 
      : 'text-gray-500';

  const CardWrapper = href ? 'a' : onClick ? 'button' : 'div';
  const wrapperProps = href 
    ? { href, className: 'block' }
    : onClick 
      ? { onClick, type: 'button', className: 'w-full text-left' }
      : { className: '' };

  return (
    <CardWrapper
      {...wrapperProps}
      className={`
        group relative
        bg-white rounded-xl border border-gray-200
        p-4 sm:p-6
        transition-all duration-200
        ${href || onClick ? 'cursor-pointer hover:shadow-lg hover:border-gray-300 active:scale-[0.98]' : ''}
        touch-manipulation
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className="text-sm font-medium text-gray-600 truncate">
            {title}
          </p>
          
          {/* Value */}
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {value}
          </p>
          
          {/* Trend */}
          {trend && (
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className={`inline-flex items-center gap-0.5 text-sm font-medium ${trendColor}`}>
                <TrendIcon size={14} />
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              {trend.label && (
                <span className="text-sm text-gray-500">
                  {trend.label}
                </span>
              )}
            </div>
          )}
          
          {/* Subtitle */}
          {subtitle && !trend && (
            <p className="mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Icon */}
        {icon && (
          <div className={`
            shrink-0 p-3 rounded-lg
            ${colors.icon}
            ${href || onClick ? 'group-hover:scale-110 transition-transform' : ''}
          `}>
            {icon}
          </div>
        )}
      </div>

      {/* Hover indicator for clickable cards */}
      {(href || onClick) && (
        <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-focus-visible:ring-blue-500 group-focus-visible:ring-offset-2" />
      )}
    </CardWrapper>
  );
};

// ============================================
// STATS GRID COMPONENT
// ============================================

export const StatsGrid: React.FC<StatsGridProps> = ({
  cards,
  loading = false,
  columns = 4,
  className = '',
}) => {
  // Responsive grid classes
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-4 sm:gap-6 ${className}`}>
        {[...Array(columns)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4 sm:gap-6 ${className}`}>
      {cards.map((card) => (
        <StatsCard key={card.id} {...card} />
      ))}
    </div>
  );
};

// ============================================
// STATS SECTION COMPONENT
// ============================================

export interface StatsSectionProps {
  title?: string;
  description?: string;
  cards: StatsCardData[];
  loading?: boolean;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  action?: React.ReactNode;
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  title,
  description,
  cards,
  loading,
  columns = 4,
  className = '',
  action,
}) => {
  return (
    <section className={className}>
      {/* Header */}
      {(title || description || action) && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500">
                {description}
              </p>
            )}
          </div>
          
          {action && (
            <div className="shrink-0">
              {action}
            </div>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <StatsGrid 
        cards={cards} 
        loading={loading} 
        columns={columns}
      />
    </section>
  );
};

export default StatsCard;
