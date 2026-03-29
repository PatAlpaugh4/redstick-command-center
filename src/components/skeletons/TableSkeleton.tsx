/**
 * Table Skeleton Component
 * ========================
 * Table loading state with header row, multiple data rows, and checkbox placeholders.
 * Mimics the appearance of the DataTable component during loading.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'

export interface TableSkeletonProps {
  /** Number of columns to display */
  columns?: number
  /** Number of rows to display (excluding header) */
  rows?: number
  /** Whether to show checkbox column */
  showCheckboxes?: boolean
  /** Whether to show header row */
  showHeader?: boolean
  /** Custom className for styling */
  className?: string
  /** Animation style */
  animation?: 'pulse' | 'wave' | 'none'
  /** Column widths (array of percentages or pixel values) */
  columnWidths?: string[]
}

export function TableSkeleton({
  columns = 5,
  rows = 8,
  showCheckboxes = true,
  showHeader = true,
  className,
  animation = 'pulse',
  columnWidths,
}: TableSkeletonProps) {
  // Generate random widths for realistic appearance if not provided
  const getColumnWidth = (index: number) => {
    if (columnWidths?.[index]) return columnWidths[index]
    // Vary widths for realistic appearance
    const widths = ['30%', '25%', '20%', '15%', '10%']
    return widths[index % widths.length]
  }

  return (
    <div
      className={cn(
        // Container styling matching DataTable
        'rounded-lg border border-border bg-card overflow-hidden',
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Header Row */}
          {showHeader && (
            <thead className="bg-muted">
              <tr>
                {/* Checkbox header */}
                {showCheckboxes && (
                  <th className="px-4 py-3 w-12">
                    <Skeleton
                      variant="rectangular"
                      width={16}
                      height={16}
                      animation={animation}
                      className="rounded"
                    />
                  </th>
                )}
                {/* Column headers */}
                {Array.from({ length: columns }).map((_, i) => (
                  <th key={i} className="px-4 py-3">
                    <Skeleton
                      variant="text"
                      width={getColumnWidth(i)}
                      height={14}
                      animation={animation}
                    />
                  </th>
                ))}
              </tr>
            </thead>
          )}

          {/* Data Rows */}
          <tbody className="divide-y divide-border">
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx} className="animate-pulse">
                {/* Checkbox cell */}
                {showCheckboxes && (
                  <td className="px-4 py-4">
                    <Skeleton
                      variant="rectangular"
                      width={16}
                      height={16}
                      animation={animation}
                      className="rounded"
                    />
                  </td>
                )}
                {/* Data cells */}
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <td key={colIdx} className="px-4 py-4">
                    <Skeleton
                      variant="text"
                      width={`${60 + Math.random() * 40}%`}
                      height={16}
                      animation={animation}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
        <Skeleton
          variant="text"
          width={150}
          height={14}
          animation={animation}
        />
        <div className="flex items-center gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={32}
              height={32}
              animation={animation}
              className="rounded-md"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/** Compact table skeleton for smaller spaces */
export function CompactTableSkeleton({
  className,
  ...props
}: Omit<TableSkeletonProps, 'className'>) {
  return (
    <TableSkeleton
      columns={4}
      rows={5}
      className={cn('text-xs', className)}
      {...props}
    />
  )
}

/** Detailed table skeleton with more rows and columns */
export function DetailedTableSkeleton({
  className,
  ...props
}: Omit<TableSkeletonProps, 'className'>) {
  return (
    <TableSkeleton
      columns={7}
      rows={12}
      className={className}
      {...props}
    />
  )
}

export default TableSkeleton
