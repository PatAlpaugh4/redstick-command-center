/**
 * Card Skeleton Component
 * =======================
 * Card-shaped skeleton for stats cards with icon, title, value, and trend.
 * Mimics the appearance of dashboard stat cards during loading states.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'

export interface CardSkeletonProps {
  /** Whether to show the icon placeholder */
  showIcon?: boolean
  /** Whether to show the title line */
  showTitle?: boolean
  /** Whether to show the value line */
  showValue?: boolean
  /** Whether to show the trend line */
  showTrend?: boolean
  /** Custom className for styling */
  className?: string
  /** Animation style */
  animation?: 'pulse' | 'wave' | 'none'
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
}

export function CardSkeleton({
  showIcon = true,
  showTitle = true,
  showValue = true,
  showTrend = true,
  className,
  animation = 'pulse',
  size = 'md',
}: CardSkeletonProps) {
  // Size configurations
  const sizes = {
    sm: {
      icon: 36,
      titleWidth: '60%',
      valueHeight: 24,
      trendWidth: '40%',
      padding: 'p-4',
      gap: 'gap-3',
    },
    md: {
      icon: 44,
      titleWidth: '50%',
      valueHeight: 32,
      trendWidth: '35%',
      padding: 'p-5',
      gap: 'gap-4',
    },
    lg: {
      icon: 52,
      titleWidth: '45%',
      valueHeight: 40,
      trendWidth: '30%',
      padding: 'p-6',
      gap: 'gap-5',
    },
  }

  const config = sizes[size]

  return (
    <div
      className={cn(
        // Card container styling matching real stat cards
        'rounded-xl border border-border bg-card',
        config.padding,
        className
      )}
    >
      <div className={cn('flex flex-col', config.gap)}>
        {/* Header: Icon + Title */}
        <div className="flex items-start justify-between">
          {/* Title line */}
          {showTitle && (
            <Skeleton
              variant="text"
              width={config.titleWidth}
              height={14}
              animation={animation}
              className="mt-1"
            />
          )}

          {/* Icon placeholder */}
          {showIcon && (
            <Skeleton
              variant="rectangular"
              width={config.icon}
              height={config.icon}
              animation={animation}
              className="rounded-lg"
            />
          )}
        </div>

        {/* Value line */}
        {showValue && (
          <Skeleton
            variant="text"
            width="70%"
            height={config.valueHeight}
            animation={animation}
          />
        )}

        {/* Trend line */}
        {showTrend && (
          <div className="flex items-center gap-2">
            <Skeleton
              variant="text"
              width={16}
              height={16}
              animation={animation}
              className="rounded-sm"
            />
            <Skeleton
              variant="text"
              width={config.trendWidth}
              height={14}
              animation={animation}
            />
          </div>
        )}
      </div>
    </div>
  )
}

/** Multiple cards skeleton for grid layouts */
export function CardsGridSkeleton({
  count = 4,
  columns = 4,
  className,
  ...props
}: {
  count?: number
  columns?: 1 | 2 | 3 | 4 | 6
  className?: string
} & Omit<CardSkeletonProps, 'className'>) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  }

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} {...props} />
      ))}
    </div>
  )
}

export default CardSkeleton
