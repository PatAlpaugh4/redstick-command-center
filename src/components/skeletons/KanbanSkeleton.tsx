/**
 * Kanban Skeleton Component
 * =========================
 * Kanban board loading state with multiple columns and card skeletons.
 * Mimics the appearance of the KanbanBoard component during loading.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'

export interface KanbanSkeletonProps {
  /** Number of columns to display */
  columns?: number
  /** Number of cards per column */
  cardsPerColumn?: number
  /** Custom className for styling */
  className?: string
  /** Animation style */
  animation?: 'pulse' | 'wave' | 'none'
  /** Whether to show column headers with counts */
  showCounts?: boolean
  /** Whether to show add buttons in columns */
  showAddButtons?: boolean
}

export function KanbanSkeleton({
  columns = 5,
  cardsPerColumn = 3,
  className,
  animation = 'pulse',
  showCounts = true,
  showAddButtons = true,
}: KanbanSkeletonProps) {
  // Stage names for realistic column titles
  const stageNames = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed']

  return (
    <div
      className={cn(
        // Kanban board container
        'flex gap-4 overflow-x-auto pb-4',
        className
      )}
    >
      {Array.from({ length: columns }).map((_, colIdx) => (
        <div
          key={colIdx}
          className="flex-shrink-0 w-80"
        >
          {/* Column header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <Skeleton
                variant="text"
                width={100}
                height={16}
                animation={animation}
              />
              {showCounts && (
                <Skeleton
                  variant="rectangular"
                  width={28}
                  height={20}
                  animation={animation}
                  className="rounded-full"
                />
              )}
            </div>
            {showAddButtons && (
              <Skeleton
                variant="rectangular"
                width={24}
                height={24}
                animation={animation}
                className="rounded"
              />
            )}
          </div>

          {/* Column container */}
          <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-3 min-h-[400px]">
            {/* Cards */}
            {Array.from({ length: cardsPerColumn + (colIdx % 2) }).map((_, cardIdx) => (
              <KanbanCardSkeleton
                key={cardIdx}
                animation={animation}
                hasTags={cardIdx % 2 === 0}
                hasAssignee={cardIdx % 3 !== 0}
                hasAmount={cardIdx % 2 !== 0}
              />
            ))}

            {/* Add card placeholder */}
            {showAddButtons && (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={40}
                animation={animation}
                className="rounded-lg border-2 border-dashed border-border bg-transparent"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Individual kanban card skeleton */
function KanbanCardSkeleton({
  animation,
  hasTags = true,
  hasAssignee = true,
  hasAmount = true,
}: {
  animation: 'pulse' | 'wave' | 'none'
  hasTags?: boolean
  hasAssignee?: boolean
  hasAmount?: boolean
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      {/* Tags row */}
      {hasTags && (
        <div className="flex items-center gap-2">
          <Skeleton
            variant="rectangular"
            width={60}
            height={20}
            animation={animation}
            className="rounded-full"
          />
          <Skeleton
            variant="rectangular"
            width={40}
            height={20}
            animation={animation}
            className="rounded-full"
          />
        </div>
      )}

      {/* Title */}
      <Skeleton
        variant="text"
        width="100%"
        height={18}
        animation={animation}
      />

      {/* Description lines */}
      <div className="space-y-1">
        <Skeleton
          variant="text"
          width="90%"
          height={12}
          animation={animation}
        />
        <Skeleton
          variant="text"
          width="60%"
          height={12}
          animation={animation}
        />
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between pt-2">
        {/* Amount */}
        {hasAmount ? (
          <Skeleton
            variant="text"
            width={70}
            height={16}
            animation={animation}
          />
        ) : (
          <div /> // Spacer
        )}

        {/* Assignee and date */}
        <div className="flex items-center gap-3">
          <Skeleton
            variant="text"
            width={60}
            height={12}
            animation={animation}
          />
          {hasAssignee && (
            <Skeleton
              variant="circular"
              width={28}
              height={28}
              animation={animation}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/** Compact kanban skeleton for smaller spaces */
export function CompactKanbanSkeleton({
  className,
  ...props
}: Omit<KanbanSkeletonProps, 'className'>) {
  return (
    <KanbanSkeleton
      columns={3}
      cardsPerColumn={2}
      showAddButtons={false}
      className={cn('gap-3', className)}
      {...props}
    />
  )
}

/** Expanded kanban skeleton with more columns and cards */
export function ExpandedKanbanSkeleton({
  className,
  ...props
}: Omit<KanbanSkeletonProps, 'className'>) {
  return (
    <KanbanSkeleton
      columns={6}
      cardsPerColumn={5}
      className={cn('gap-5', className)}
      {...props}
    />
  )
}

/** Kanban column skeleton (single column) */
export function KanbanColumnSkeleton({
  cardCount = 4,
  className,
  animation = 'pulse',
}: {
  cardCount?: number
  className?: string
  animation?: 'pulse' | 'wave' | 'none'
}) {
  return (
    <div className={cn('w-80', className)}>
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <Skeleton
          variant="text"
          width={100}
          height={16}
          animation={animation}
        />
        <Skeleton
          variant="rectangular"
          width={24}
          height={24}
          animation={animation}
          className="rounded"
        />
      </div>

      {/* Column content */}
      <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-3">
        {Array.from({ length: cardCount }).map((_, i) => (
          <KanbanCardSkeleton
            key={i}
            animation={animation}
            hasTags={i % 2 === 0}
            hasAssignee={i % 3 !== 0}
            hasAmount={i % 2 !== 0}
          />
        ))}
      </div>
    </div>
  )
}

export default KanbanSkeleton
