/**
 * Skeletons Index
 * ===============
 * Central export point for all skeleton components.
 * Provides loading state components for various UI patterns.
 */

// Base skeleton component
export { Skeleton, TextSkeleton, AvatarSkeleton, ButtonSkeleton, InputSkeleton, CardSkeletonBase } from '@/components/ui/Skeleton'
export type { SkeletonProps } from '@/components/ui/Skeleton'

// Specialized skeleton components
export { CardSkeleton, CardsGridSkeleton } from './CardSkeleton'
export type { CardSkeletonProps } from './CardSkeleton'

export { TableSkeleton, CompactTableSkeleton, DetailedTableSkeleton } from './TableSkeleton'
export type { TableSkeletonProps } from './TableSkeleton'

export { ChartSkeleton, MiniChartSkeleton, StatsChartSkeleton } from './ChartSkeleton'
export type { ChartSkeletonProps } from './ChartSkeleton'

export { PageSkeleton } from './PageSkeleton'
export type { PageSkeletonProps } from './PageSkeleton'

export { KanbanSkeleton, CompactKanbanSkeleton, ExpandedKanbanSkeleton, KanbanColumnSkeleton } from './KanbanSkeleton'
export type { KanbanSkeletonProps } from './KanbanSkeleton'

export { FormSkeleton, CompactFormSkeleton, SettingsFormSkeleton, LoginFormSkeleton } from './FormSkeleton'
export type { FormSkeletonProps } from './FormSkeleton'
