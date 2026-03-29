/**
 * ActivityFeed Component
 * ======================
 * Timeline view of all activities with filtering, infinite scroll,
 * and CSV export capabilities.
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Filter,
  Download,
  RefreshCw,
  Search,
  X,
  ChevronDown,
  Loader2,
  Calendar,
  User,
  Briefcase,
  Activity,
  Inbox,
} from 'lucide-react'
import { format, subDays } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ActivityItem } from './ActivityItem'
import {
  useActivityFeed,
  type Activity,
  type EntityType,
  type ActivityAction,
  type ActivityFilters,
} from '@/hooks/useActivityFeed'

// =============================================================================
// Types
// =============================================================================

interface ActivityFeedProps {
  className?: string
  onEntityClick?: (activity: Activity) => void
  showHeader?: boolean
  enablePolling?: boolean
}

// =============================================================================
// Filter Options
// =============================================================================

const entityTypeOptions: { value: EntityType | 'all'; label: string; icon: typeof Briefcase }[] = [
  { value: 'all', label: 'All Types', icon: Activity },
  { value: 'deal', label: 'Deals', icon: Briefcase },
  { value: 'company', label: 'Companies', icon: Briefcase },
  { value: 'agent', label: 'Agents', icon: Activity },
  { value: 'user', label: 'Users', icon: User },
  { value: 'settings', label: 'Settings', icon: Activity },
]

const actionOptions: { value: ActivityAction | 'all'; label: string }[] = [
  { value: 'all', label: 'All Actions' },
  { value: 'DEAL_CREATED', label: 'Deal Created' },
  { value: 'DEAL_UPDATED', label: 'Deal Updated' },
  { value: 'DEAL_DELETED', label: 'Deal Deleted' },
  { value: 'COMPANY_CREATED', label: 'Company Created' },
  { value: 'COMPANY_UPDATED', label: 'Company Updated' },
  { value: 'AGENT_RUN_STARTED', label: 'Agent Started' },
  { value: 'AGENT_RUN_COMPLETED', label: 'Agent Completed' },
  { value: 'USER_LOGIN', label: 'User Login' },
  { value: 'USER_LOGOUT', label: 'User Logout' },
  { value: 'SETTINGS_CHANGED', label: 'Settings Changed' },
]

const userOptions = [
  { value: 'all', label: 'All Users' },
  { value: 'u1', label: 'Sarah Chen' },
  { value: 'u2', label: 'Michael Ross' },
  { value: 'u3', label: 'Emily Watson' },
  { value: 'u4', label: 'David Kim' },
  { value: 'u5', label: 'Alex Thompson' },
]

const dateRangeOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
]

// =============================================================================
// Helper Components
// =============================================================================

interface FilterSelectProps {
  label: string
  value: string
  options: { value: string; label: string; icon?: typeof Briefcase }[]
  onChange: (value: string) => void
  className?: string
}

function FilterSelect({ label, value, options, onChange, className }: FilterSelectProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors cursor-pointer'
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  )
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">No activities found</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">Try adjusting your filters or search query to find what you are looking for.</p>
      <Button variant="outline" size="sm" onClick={onClearFilters}>
        <X className="h-4 w-4 mr-2" />
        Clear Filters
      </Button>
    </motion.div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="ml-12 rounded-xl border border-border bg-card/50 p-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-muted rounded" />
              <div className="h-3 w-1/4 bg-muted rounded" />
            </div>
            <div className="h-8 w-8 rounded-lg bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ActivityGroupHeader({ date }: { date: string }) {
  const dateObj = new Date(date)
  const today = new Date()
  const yesterday = subDays(today, 1)

  let label = format(dateObj, 'MMMM d, yyyy')
  if (format(dateObj, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) label = 'Today'
  else if (format(dateObj, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) label = 'Yesterday'

  return (
    <div className="flex items-center gap-4 my-6">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

// =============================================================================
// Main ActivityFeed Component
// =============================================================================

export function ActivityFeed({
  className,
  onEntityClick,
  showHeader = true,
  enablePolling = false,
}: ActivityFeedProps) {
  const [showFilters, setShowFilters] = React.useState(false)
  const [dateRange, setDateRange] = React.useState('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const {
    activities,
    loading,
    hasMore,
    loadMore,
    filters,
    setFilters,
    resetFilters,
    exportActivities,
    refresh,
    totalCount,
  } = useActivityFeed({ enablePolling, limit: 10 })

  const handleDateRangeChange = (value: string) => {
    setDateRange(value)
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    let dateFrom: string | undefined
    let dateTo: string | undefined

    switch (value) {
      case 'today':
        dateFrom = format(today, 'yyyy-MM-dd')
        dateTo = format(today, 'yyyy-MM-dd')
        break
      case 'week':
        dateFrom = format(subDays(today, 7), 'yyyy-MM-dd')
        dateTo = format(today, 'yyyy-MM-dd')
        break
      case 'month':
        dateFrom = format(subDays(today, 30), 'yyyy-MM-dd')
        dateTo = format(today, 'yyyy-MM-dd')
        break
      default:
        dateFrom = undefined
        dateTo = undefined
    }

    setFilters((prev) => ({ ...prev, dateFrom, dateTo }))
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setFilters((prev) => ({ ...prev, searchQuery: value }))
  }

  const handleClearFilters = () => {
    setDateRange('all')
    setSearchQuery('')
    resetFilters()
  }

  const hasActiveFilters =
    (filters.entityType && filters.entityType !== 'all') ||
    (filters.userId && filters.userId !== 'all') ||
    (filters.action && filters.action !== 'all') ||
    dateRange !== 'all' ||
    searchQuery !== ''

  const groupedActivities = React.useMemo(() => {
    const groups: Record<string, Activity[]> = {}
    activities.forEach((activity) => {
      const date = format(new Date(activity.timestamp), 'yyyy-MM-dd')
      if (!groups[date]) groups[date] = []
      groups[date].push(activity)
    })
    return groups
  }, [activities])

  const loadMoreRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) loadMore()
      },
      { threshold: 0.1, rootMargin: '100px' }
    )
    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, loadMore])

  return (
    <div className={cn('w-full space-y-4', className)}>
      {showHeader && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Activity Feed</h2>
              <p className="text-sm text-muted-foreground">{totalCount.toLocaleString()} activities tracked</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
                <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportActivities}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className={cn(
                  'w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors'
                )}
              />
              {searchQuery && (
                <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              variant="outline"
              size="default"
              onClick={() => setShowFilters(!showFilters)}
              className={cn('sm:w-auto w-full', showFilters && 'bg-accent text-accent-foreground')}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">!</span>
              )}
            </Button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="rounded-lg border border-border bg-card/50 p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FilterSelect
                      label="Entity Type"
                      value={filters.entityType || 'all'}
                      options={entityTypeOptions}
                      onChange={(value) => setFilters((prev) => ({ ...prev, entityType: value as EntityType | 'all' }))}
                    />
                    <FilterSelect
                      label="Action Type"
                      value={filters.action || 'all'}
                      options={actionOptions}
                      onChange={(value) => setFilters((prev) => ({ ...prev, action: value as ActivityAction | 'all' }))}
                    />
                    <FilterSelect
                      label="User"
                      value={filters.userId || 'all'}
                      options={userOptions}
                      onChange={(value) => setFilters((prev) => ({ ...prev, userId: value === 'all' ? undefined : value }))}
                    />
                    <FilterSelect
                      label="Date Range"
                      value={dateRange}
                      options={dateRangeOptions}
                      onChange={handleDateRangeChange}
                    />
                  </div>

                  {hasActiveFilters && (
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-sm text-muted-foreground">Showing {activities.length} of {totalCount} activities</span>
                      <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-8">
                        <X className="h-4 w-4 mr-2" />
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

        <AnimatePresence mode="wait">
          {loading && activities.length === 0 ? (
            <LoadingSkeleton />
          ) : activities.length === 0 ? (
            <EmptyState onClearFilters={handleClearFilters} />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-0">
              {Object.entries(groupedActivities).map(([date, dateActivities], groupIndex) => (
                <React.Fragment key={date}>
                  <ActivityGroupHeader date={date} />
                  <div className="space-y-3">
                    {dateActivities.map((activity, index) => (
                      <ActivityItem
                        key={activity.id}
                        activity={activity}
                        isFirst={groupIndex === 0 && index === 0}
                        isLast={groupIndex === Object.keys(groupedActivities).length - 1 && index === dateActivities.length - 1 && !hasMore}
                        onEntityClick={onEntityClick}
                      />
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {hasMore && (
          <div ref={loadMoreRef} className="flex items-center justify-center py-6">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading more...</span>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={loadMore}>Load More</Button>
            )}
          </div>
        )}
      </div>

      {activities.length > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
          <span>Showing {activities.length} of {totalCount} activities</span>
          <span>Last updated {format(new Date(), 'h:mm a')}</span>
        </div>
      )}
    </div>
  )
}

export default ActivityFeed
