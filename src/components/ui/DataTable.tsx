/**
 * DataTable Component
 * ===================
 * Advanced data table with sorting, filtering, pagination, row selection,
 * bulk actions, CSV export capabilities, and keyboard navigation.
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import {
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Filter,
  MoreHorizontal,
  Trash2,
  Edit,
  Copy,
  Check,
  X,
  ArrowUpDown,
  Inbox,
  Loader2,
  Keyboard,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { useArrowKeyNavigation } from '@/hooks/useArrowKeyNavigation'

// =============================================================================
// Types
// =============================================================================

export interface ColumnDef<T> {
  key: keyof T
  header: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  render?: (value: any, row: T) => React.ReactNode
}

export interface BulkAction<T> {
  label: string
  icon?: React.ReactNode
  onClick: (selectedRows: T[]) => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
}

export interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  pageSize?: number
  loading?: boolean
  onRowClick?: (row: T) => void
  onSelectionChange?: (selected: T[]) => void
  bulkActions?: BulkAction<T>[]
  className?: string
  rowKey?: keyof T
  emptyState?: {
    title?: string
    description?: string
    icon?: React.ReactNode
  }
  /** Enable keyboard navigation */
  enableKeyboardNav?: boolean
}

type SortDirection = 'asc' | 'desc' | null

interface SortState {
  key: string | null
  direction: SortDirection
}

// =============================================================================
// Helper Functions
// =============================================================================

function getNestedValue<T>(obj: T, key: keyof T): any {
  return obj[key]
}

function exportToCSV<T>(data: T[], columns: ColumnDef<T>[], filename: string) {
  const headers = columns.map((col) => col.header).join(',')
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = getNestedValue(row, col.key)
        // Handle strings with commas by wrapping in quotes
        const stringValue = String(value ?? '')
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(',')
  )

  const csv = [headers, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

// =============================================================================
// Skeleton Loading Component
// =============================================================================

function TableSkeleton({ columns, pageSize }: { columns: number; pageSize: number }) {
  return (
    <>
      {Array.from({ length: pageSize }).map((_, rowIdx) => (
        <tr key={rowIdx} className="animate-pulse">
          <td className="px-4 py-4">
            <div className="h-4 w-4 rounded bg-white/10" />
          </td>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <td key={colIdx} className="px-4 py-4">
              <div className="h-4 rounded bg-white/10" style={{ width: `${60 + Math.random() * 40}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

// =============================================================================
// Empty State Component
// =============================================================================

function EmptyState({
  title = 'No data found',
  description = 'Try adjusting your filters or search query.',
  icon,
}: {
  title?: string
  description?: string
  icon?: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="rounded-full bg-white/5 p-4 mb-4">
        {icon || <Inbox className="h-8 w-8 text-white/40" />}
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-white/50 text-center max-w-sm">{description}</p>
    </motion.div>
  )
}

// =============================================================================
// Keyboard Help Panel
// =============================================================================

function KeyboardHelpPanel({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    { key: "↑/↓", action: "Navigate rows" },
    { key: "←/→", action: "Navigate cells" },
    { key: "Enter", action: "Edit row" },
    { key: "Space", action: "Select row" },
    { key: "Ctrl+A", action: "Select all" },
    { key: "Ctrl+E", action: "Export CSV" },
    { key: "Ctrl+F", action: "Focus search" },
    { key: "?", action: "Show/hide help" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-4 right-4 bg-[#1a1a2e] border border-white/10 rounded-xl p-4 shadow-2xl z-50 max-w-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Keyboard className="w-4 h-4" />
          Keyboard Shortcuts
        </h3>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors p-1"
          aria-label="Close help"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2">
        {shortcuts.map(({ key, action }) => (
          <div key={key} className="flex items-center justify-between text-sm">
            <kbd className="px-2 py-1 bg-white/10 rounded text-white/80 font-mono text-xs min-w-[80px] text-center">
              {key}
            </kbd>
            <span className="text-white/60 ml-3">{action}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// =============================================================================
// Main DataTable Component
// =============================================================================

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  loading = false,
  onRowClick,
  onSelectionChange,
  bulkActions,
  className,
  rowKey = 'id' as keyof T,
  emptyState,
  enableKeyboardNav = true,
}: DataTableProps<T>) {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [currentPage, setCurrentPage] = React.useState(1)
  const [sort, setSort] = React.useState<SortState>({ key: null, direction: null })
  const [filters, setFilters] = React.useState<Record<string, string>>({})
  const [globalSearch, setGlobalSearch] = React.useState('')
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = React.useState(false)
  const [focusedRowIndex, setFocusedRowIndex] = React.useState<number>(-1)
  const [focusedCellIndex, setFocusedCellIndex] = React.useState<number>(-1)
  const [editingRowId, setEditingRowId] = React.useState<string | null>(null)
  const [showKeyboardHelp, setShowKeyboardHelp] = React.useState(false)
  
  const tableRef = React.useRef<HTMLDivElement>(null)
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const rowRefs = React.useRef<(HTMLTableRowElement | null)[]>([])

  // ---------------------------------------------------------------------------
  // Derived State
  // ---------------------------------------------------------------------------

  // Filter data
  const filteredData = React.useMemo(() => {
    let result = [...data]

    // Global search
    if (globalSearch) {
      const searchLower = globalSearch.toLowerCase()
      result = result.filter((row) =>
        columns.some((col) => {
          const value = getNestedValue(row, col.key)
          return String(value ?? '').toLowerCase().includes(searchLower)
        })
      )
    }

    // Column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        const filterLower = value.toLowerCase()
        result = result.filter((row) => {
          const cellValue = getNestedValue(row, key as keyof T)
          return String(cellValue ?? '').toLowerCase().includes(filterLower)
        })
      }
    })

    return result
  }, [data, globalSearch, filters, columns])

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sort.key || !sort.direction) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, sort.key as keyof T)
      const bValue = getNestedValue(b, sort.key as keyof T)

      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sort.direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }

      const aString = String(aValue).toLowerCase()
      const bString = String(bValue).toLowerCase()

      if (sort.direction === 'asc') {
        return aString.localeCompare(bString)
      }
      return bString.localeCompare(aString)
    })
  }, [filteredData, sort])

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize)

  // Get selected row data
  const selectedData = React.useMemo(
    () => data.filter((row) => selectedRows.has(String(row[rowKey]))),
    [data, selectedRows, rowKey]
  )

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev.key !== key) {
        return { key, direction: 'asc' }
      }
      if (prev.direction === 'asc') {
        return { key, direction: 'desc' }
      }
      return { key: null, direction: null }
    })
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
    } else {
      const newSelected = new Set(paginatedData.map((row) => String(row[rowKey])))
      setSelectedRows(newSelected)
    }
  }

  const handleSelectRow = (rowId: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(rowId)) {
        newSet.delete(rowId)
      } else {
        newSet.add(rowId)
      }
      return newSet
    })
  }

  const handleClearSelection = () => {
    setSelectedRows(new Set())
  }

  const handleExportCSV = () => {
    const dataToExport = selectedRows.size > 0 ? selectedData : sortedData
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss')
    exportToCSV(dataToExport, columns, `export_${timestamp}.csv`)
  }

  // Keyboard navigation handlers
  const handleRowKeyDown = (e: React.KeyboardEvent, row: T, rowIndex: number) => {
    if (!enableKeyboardNav) return

    const rowId = String(row[rowKey])
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (rowIndex < paginatedData.length - 1) {
          setFocusedRowIndex(rowIndex + 1)
          rowRefs.current[rowIndex + 1]?.focus()
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (rowIndex > 0) {
          setFocusedRowIndex(rowIndex - 1)
          rowRefs.current[rowIndex - 1]?.focus()
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        if (focusedCellIndex < columns.length) {
          setFocusedCellIndex(prev => Math.min(columns.length, prev + 1))
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (focusedCellIndex > 0) {
          setFocusedCellIndex(prev => Math.max(0, prev - 1))
        }
        break
      case 'Enter':
        e.preventDefault()
        if (editingRowId === rowId) {
          setEditingRowId(null)
        } else {
          setEditingRowId(rowId)
          onRowClick?.(row)
        }
        break
      case ' ':
        e.preventDefault()
        handleSelectRow(rowId)
        break
      case 'Escape':
        if (editingRowId) {
          e.preventDefault()
          setEditingRowId(null)
        }
        break
    }
  }

  const handleCellKeyDown = (e: React.KeyboardEvent, row: T, cellIndex: number) => {
    if (!enableKeyboardNav) return

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        setFocusedCellIndex(Math.min(columns.length - 1, cellIndex + 1))
        break
      case 'ArrowLeft':
        e.preventDefault()
        setFocusedCellIndex(Math.max(0, cellIndex - 1))
        break
      case 'Tab':
        if (!e.shiftKey && cellIndex === columns.length - 1) {
          // Move to next row
          e.preventDefault()
          const currentRowIndex = paginatedData.findIndex((r) => String(r[rowKey]) === String(row[rowKey]))
          if (currentRowIndex < paginatedData.length - 1) {
            setFocusedRowIndex(currentRowIndex + 1)
            setFocusedCellIndex(0)
          }
        } else if (e.shiftKey && cellIndex === 0) {
          // Move to previous row
          e.preventDefault()
          const currentRowIndex = paginatedData.findIndex((r) => String(r[rowKey]) === String(row[rowKey]))
          if (currentRowIndex > 0) {
            setFocusedRowIndex(currentRowIndex - 1)
            setFocusedCellIndex(columns.length - 1)
          }
        }
        break
    }
  }

  // Keyboard shortcuts
  useKeyboardShortcut('a', () => {
    handleSelectAll()
  }, { ctrl: true, meta: true })

  useKeyboardShortcut('e', () => {
    handleExportCSV()
  }, { ctrl: true, meta: true })

  useKeyboardShortcut('f', () => {
    searchInputRef.current?.focus()
  }, { ctrl: true, meta: true })

  useKeyboardShortcut('?', () => {
    setShowKeyboardHelp((prev) => !prev)
  }, { shift: true })

  useKeyboardShortcut('Escape', () => {
    if (showKeyboardHelp) {
      setShowKeyboardHelp(false)
    } else if (editingRowId) {
      setEditingRowId(null)
    } else if (selectedRows.size > 0) {
      handleClearSelection()
    }
  })

  // Notify parent of selection changes
  React.useEffect(() => {
    onSelectionChange?.(selectedData)
  }, [selectedRows, onSelectionChange, selectedData])

  // Reset page when data changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [data.length, globalSearch, filters])

  // Reset focus when page changes
  React.useEffect(() => {
    setFocusedRowIndex(-1)
    setFocusedCellIndex(-1)
  }, [currentPage])

  // ---------------------------------------------------------------------------
  // Render Helpers
  // ---------------------------------------------------------------------------

  const renderPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const allSelected = paginatedData.length > 0 && paginatedData.every((row) => selectedRows.has(String(row[rowKey])))
  const someSelected = selectedRows.size > 0 && !allSelected

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className={cn('w-full space-y-4', className)} ref={tableRef}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search... (Ctrl+F)"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className={cn(
              'w-full rounded-lg border border-white/10 bg-[#1a1a2e] pl-10 pr-4 py-2 text-sm text-white',
              'placeholder:text-white/40',
              'focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent'
            )}
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {enableKeyboardNav && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
              className={cn(showKeyboardHelp && 'bg-[#e94560]/20 text-[#e94560] border-[#e94560]/30')}
            >
              <Keyboard className="h-4 w-4 mr-2" />
              Shortcuts
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && 'bg-white/10')}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Keyboard Help Panel */}
      <AnimatePresence>
        {showKeyboardHelp && enableKeyboardNav && (
          <KeyboardHelpPanel onClose={() => setShowKeyboardHelp(false)} />
        )}
      </AnimatePresence>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedRows.size > 0 && bulkActions && bulkActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="flex items-center gap-4 p-3 rounded-lg bg-[#e94560]/10 border border-[#e94560]/20"
          >
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-[#e94560]" />
              <span className="font-medium text-white">
                {selectedRows.size} selected
              </span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              {bulkActions.map((action, idx) => (
                <Button
                  key={idx}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={() => action.onClick(selectedData)}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
              <Button variant="ghost" size="sm" onClick={handleClearSelection}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Container - Responsive horizontal scroll */}
      <div className="rounded-xl border border-white/10 bg-[#1a1a2e]/50 overflow-hidden">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth-touch">
          <table className="min-w-full text-sm" role="grid" aria-label="Data table">
            {/* Header */}
            <thead className="bg-white/5">
              {/* Main Headers */}
              <tr>
                <th className="px-4 py-3 w-12 text-left" scope="col">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected
                    }}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-white/20 bg-transparent text-[#e94560] focus:ring-[#e94560] focus:ring-offset-0"
                    aria-label="Select all rows"
                  />
                </th>
                {columns.map((column, colIndex) => (
                  <th
                    key={String(column.key)}
                    className="px-4 py-3 text-left font-medium text-white/60"
                    style={{ width: column.width }}
                    scope="col"
                  >
                    {column.sortable ? (
                      <button
                        onClick={() => handleSort(String(column.key))}
                        className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none focus:text-white"
                      >
                        {column.header}
                        {sort.key === column.key ? (
                          sort.direction === 'asc' ? (
                            <ChevronUp className="h-4 w-4 text-[#e94560]" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-[#e94560]" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-50" />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                ))}
              </tr>

              {/* Filter Row */}
              <AnimatePresence>
                {showFilters && (
                  <motion.tr
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/5"
                  >
                    <td className="px-4 py-2" />
                    {columns.map((column) => (
                      <td key={`filter-${String(column.key)}`} className="px-4 py-2">
                        {column.filterable !== false && (
                          <input
                            type="text"
                            placeholder={`Filter ${column.header}...`}
                            value={filters[String(column.key)] || ''}
                            onChange={(e) => handleFilterChange(String(column.key), e.target.value)}
                            className={cn(
                              'w-full rounded border border-white/10 bg-[#0f0f1a] px-2 py-1 text-xs text-white',
                              'placeholder:text-white/40',
                              'focus:outline-none focus:ring-1 focus:ring-[#e94560]'
                            )}
                          />
                        )}
                      </td>
                    ))}
                  </motion.tr>
                )}
              </AnimatePresence>
            </thead>

            {/* Body - with responsive cell content */}
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <TableSkeleton columns={columns.length} pageSize={pageSize} />
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1}>
                    <EmptyState {...emptyState} />
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => {
                  const rowId = String(row[rowKey])
                  const isSelected = selectedRows.has(rowId)
                  const isFocused = focusedRowIndex === rowIndex
                  const isEditing = editingRowId === rowId

                  return (
                    <motion.tr
                      key={rowId}
                      ref={(el) => { rowRefs.current[rowIndex] = el }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: rowIndex * 0.03 }}
                      onClick={() => onRowClick?.(row)}
                      onKeyDown={(e) => handleRowKeyDown(e, row, rowIndex)}
                      tabIndex={isFocused ? 0 : -1}
                      className={cn(
                        'transition-colors outline-none',
                        onRowClick && 'cursor-pointer',
                        isSelected
                          ? 'bg-[#e94560]/10 ring-1 ring-inset ring-[#e94560]/20'
                          : 'hover:bg-white/5',
                        isFocused && 'ring-2 ring-[#e94560] ring-inset'
                      )}
                      role="row"
                      aria-selected={isSelected}
                    >
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowId)}
                          className="h-4 w-4 rounded border-white/20 bg-transparent text-[#e94560] focus:ring-[#e94560] focus:ring-offset-0"
                        />
                      </td>
                      {columns.map((column, cellIndex) => {
                        const value = getNestedValue(row, column.key)
                        const isCellFocused = isFocused && focusedCellIndex === cellIndex
                        
                        return (
                          <td 
                            key={`${rowId}-${String(column.key)}`} 
                            className={cn(
                              "px-4 py-3",
                              isCellFocused && "ring-2 ring-inset ring-[#e94560]/50"
                            )}
                            onKeyDown={(e) => handleCellKeyDown(e, row, cellIndex)}
                            tabIndex={isCellFocused ? 0 : -1}
                            role="gridcell"
                          >
                            {column.render ? (
                              column.render(value, row)
                            ) : (
                              <span className={cn(
                                "text-white/90 break-words max-w-[200px] sm:max-w-none",
                                isEditing && "text-[#e94560] font-medium"
                              )}>
                                {value === null || value === undefined
                                  ? '-'
                                  : String(value)}
                              </span>
                            )}
                          </td>
                        )
                      })}
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/50">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedData.length)} of{' '}
            {sortedData.length} results
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {renderPageNumbers().map((page, idx) =>
              page === '...' ? (
                <span key={idx} className="px-2 text-white/40">
                  ...
                </span>
              ) : (
                <Button
                  key={idx}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setCurrentPage(page as number)}
                  className="h-8 w-8"
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Keyboard Instructions */}
      {enableKeyboardNav && (
        <div className="text-center text-white/30 text-sm">
          <p>Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/60 font-mono text-xs">?</kbd> for keyboard shortcuts</p>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Example Usage
// =============================================================================

/**
 * Example Deal data structure:
 * 
 * interface Deal {
 *   id: string
 *   company: string
 *   stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed'
 *   amount: number
 *   assignedTo: string
 *   createdAt: Date
 * }
 * 
 * Example usage:
 * 
 * <DataTable
 *   data={deals}
 *   columns={[
 *     { key: 'company', header: 'Company', sortable: true, filterable: true },
 *     { 
 *       key: 'stage', 
 *       header: 'Stage', 
 *       sortable: true,
 *       render: (value) => (
 *         <span className={cn(
 *           'px-2 py-1 rounded-full text-xs font-medium',
 *           value === 'closed' && 'bg-green-100 text-green-800',
 *           value === 'lead' && 'bg-gray-100 text-gray-800',
 *           value === 'proposal' && 'bg-blue-100 text-blue-800',
 *         )}>
 *           {value}
 *         </span>
 *       )
 *     },
 *     { 
 *       key: 'amount', 
 *       header: 'Amount', 
 *       sortable: true,
 *       render: (value) => formatCurrency(value)
 *     },
 *     { key: 'assignedTo', header: 'Assigned To', sortable: true, filterable: true },
 *     {
 *       key: 'id',
 *       header: 'Actions',
 *       render: (_, row) => (
 *         <div className="flex gap-2">
 *           <Button size="icon" variant="ghost" onClick={() => editDeal(row)}>
 *             <Edit className="h-4 w-4" />
 *           </Button>
 *           <Button size="icon" variant="ghost" onClick={() => deleteDeal(row.id)}>
 *             <Trash2 className="h-4 w-4" />
 *           </Button>
 *         </div>
 *       )
 *     }
 *   ]}
 *   pageSize={10}
 *   enableKeyboardNav={true}
 *   onRowClick={(row) => console.log('Clicked:', row)}
 *   onSelectionChange={(selected) => console.log('Selected:', selected)}
 *   bulkActions={[
 *     { label: 'Export', icon: <Download className="h-4 w-4 mr-2" />, onClick: (rows) => exportDeals(rows) },
 *     { label: 'Delete', icon: <Trash2 className="h-4 w-4 mr-2" />, onClick: (rows) => deleteDeals(rows), variant: 'destructive' },
 *   ]}
 * />
 */

export default DataTable
