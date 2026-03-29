/**
 * Chart Skeleton Component
 * ========================
 * Chart placeholder with title area, animated bars/lines, and legend placeholder.
 * Mimics the appearance of various chart types during loading states.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'

export interface ChartSkeletonProps {
  /** Type of chart being loaded */
  type?: 'bar' | 'line' | 'pie' | 'area' | 'composed'
  /** Whether to show title area */
  showTitle?: boolean
  /** Whether to show legend */
  showLegend?: boolean
  /** Whether to show axes */
  showAxes?: boolean
  /** Custom className for styling */
  className?: string
  /** Animation style */
  animation?: 'pulse' | 'wave' | 'none'
  /** Height of the chart area */
  height?: number
}

export function ChartSkeleton({
  type = 'bar',
  showTitle = true,
  showLegend = true,
  showAxes = true,
  className,
  animation = 'pulse',
  height = 300,
}: ChartSkeletonProps) {
  return (
    <div
      className={cn(
        // Card container matching real chart cards
        'rounded-xl border border-border bg-card p-5',
        className
      )}
    >
      {/* Title area */}
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <Skeleton
              variant="text"
              width={180}
              height={20}
              animation={animation}
            />
            <Skeleton
              variant="text"
              width={120}
              height={14}
              animation={animation}
              className="bg-muted/40"
            />
          </div>
          {/* Time range selector placeholder */}
          <Skeleton
            variant="rectangular"
            width={100}
            height={32}
            animation={animation}
            className="rounded-md"
          />
        </div>
      )}

      {/* Chart area */}
      <div
        className="relative"
        style={{ height }}
      >
        {type === 'bar' && <BarChartPlaceholder animation={animation} />}
        {type === 'line' && <LineChartPlaceholder animation={animation} />}
        {type === 'area' && <AreaChartPlaceholder animation={animation} />}
        {type === 'pie' && <PieChartPlaceholder animation={animation} />}
        {type === 'composed' && <ComposedChartPlaceholder animation={animation} />}

        {/* Axes placeholder */}
        {showAxes && <AxesPlaceholder animation={animation} />}
      </div>

      {/* Legend placeholder */}
      {showLegend && (
        <div className="flex items-center justify-center gap-6 mt-6">
          {Array.from({ length: type === 'pie' ? 5 : 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton
                variant="rectangular"
                width={12}
                height={12}
                animation={animation}
                className="rounded-sm"
              />
              <Skeleton
                variant="text"
                width={60 + Math.random() * 40}
                height={14}
                animation={animation}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/** Bar chart placeholder with animated bars */
function BarChartPlaceholder({
  animation,
}: {
  animation: 'pulse' | 'wave' | 'none'
}) {
  return (
    <div className="absolute inset-0 flex items-end justify-between gap-3 px-8 pb-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          width="100%"
          height={`${30 + Math.random() * 60}%`}
          animation={animation}
          className="rounded-t-md"
        />
      ))}
    </div>
  )
}

/** Line chart placeholder with animated path-like elements */
function LineChartPlaceholder({
  animation,
}: {
  animation: 'pulse' | 'wave' | 'none'
}) {
  return (
    <div className="absolute inset-0 flex items-center px-8">
      <svg
        viewBox="0 0 100 50"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            as="line"
            x1="0"
            y1={i * 12.5}
            x2="100"
            y2={i * 12.5}
            animation={animation}
            className="opacity-20"
          />
        ))}
        {/* Line path simulation with multiple small bars */}
        <g className="opacity-60">
          {Array.from({ length: 20 }).map((_, i) => {
            const height = 20 + Math.sin(i * 0.8) * 15 + Math.random() * 10
            return (
              <rect
                key={i}
                x={i * 5}
                y={50 - height}
                width="4"
                height={height}
                className="fill-muted"
                rx="1"
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}

/** Area chart placeholder */
function AreaChartPlaceholder({
  animation,
}: {
  animation: 'pulse' | 'wave' | 'none'
}) {
  return (
    <div className="absolute inset-0 flex items-end px-8 pb-8">
      <div className="w-full h-full relative">
        {/* Stacked areas simulation */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation={animation}
          className="absolute bottom-0 opacity-30 rounded-t-lg"
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height="70%"
          animation={animation}
          className="absolute bottom-0 opacity-40 rounded-t-lg"
        />
        <Skeleton
          variant="rectangular"
          width="100%"
          height="45%"
          animation={animation}
          className="absolute bottom-0 opacity-50 rounded-t-lg"
        />
      </div>
    </div>
  )
}

/** Pie chart placeholder */
function PieChartPlaceholder({
  animation,
}: {
  animation: 'pulse' | 'wave' | 'none'
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        {/* Outer ring segments */}
        <Skeleton
          variant="circular"
          width={200}
          height={200}
          animation={animation}
          className="rounded-full"
        />
        {/* Inner hole for donut effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 bg-card rounded-full" />
        </div>
        {/* Center text placeholder */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Skeleton
            variant="text"
            width={60}
            height={16}
            animation={animation}
          />
          <Skeleton
            variant="text"
            width={40}
            height={12}
            animation={animation}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  )
}

/** Composed chart placeholder (bars + line) */
function ComposedChartPlaceholder({
  animation,
}: {
  animation: 'pulse' | 'wave' | 'none'
}) {
  return (
    <div className="absolute inset-0 px-8 pb-8">
      {/* Bars */}
      <div className="absolute inset-0 flex items-end justify-between gap-2 px-8 pb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width="100%"
            height={`${25 + Math.random() * 50}%`}
            animation={animation}
            className="rounded-t-md opacity-60"
          />
        ))}
      </div>
      {/* Line overlay simulation */}
      <div className="absolute inset-0 flex items-center px-8">
        <svg viewBox="0 0 100 50" className="w-full h-full opacity-80">
          <polyline
            points="5,40 20,25 35,35 50,15 65,30 80,20 95,25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted"
          />
        </svg>
      </div>
    </div>
  )
}

/** Axes placeholder */
function AxesPlaceholder({
  animation,
}: {
  animation: 'pulse' | 'wave' | 'none'
}) {
  return (
    <>
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={24}
            height={10}
            animation={animation}
          />
        ))}
      </div>
      {/* X-axis labels */}
      <div className="absolute left-8 right-0 bottom-0 h-8 flex justify-between items-center px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={30}
            height={10}
            animation={animation}
          />
        ))}
      </div>
    </>
  )
}

/** Small chart skeleton for dashboard widgets */
export function MiniChartSkeleton({
  className,
}: {
  className?: string
}) {
  return (
    <ChartSkeleton
      type="bar"
      showTitle={false}
      showLegend={false}
      showAxes={false}
      height={120}
      className={cn('p-3', className)}
    />
  )
}

/** Stats chart skeleton with stats cards alongside */
export function StatsChartSkeleton({
  className,
}: {
  className?: string
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4">
            <Skeleton variant="text" width={80} height={12} className="mb-2" />
            <Skeleton variant="text" width={60} height={24} />
          </div>
        ))}
      </div>
      {/* Main chart */}
      <ChartSkeleton type="area" height={250} />
    </div>
  )
}

export default ChartSkeleton
