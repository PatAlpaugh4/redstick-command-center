/**
 * ActivityItem Component
 * ======================
 * Single activity row with timeline connector, user avatar, action description,
 * entity badge, timestamp, and expandable metadata.
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Briefcase,
  Building2,
  Bot,
  User,
  Settings,
  Plus,
  Edit3,
  Trash2,
  LogIn,
  LogOut,
  CheckCircle2,
  Play,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Activity, ActivityAction, EntityType } from '@/hooks/useActivityFeed'
import { formatDistanceToNow, format } from 'date-fns'

// =============================================================================
// Types
// =============================================================================

interface ActivityItemProps {
  activity: Activity
  isLast?: boolean
  isFirst?: boolean
  showConnector?: boolean
  onEntityClick?: (activity: Activity) => void
  className?: string
}

// =============================================================================
// Icon Configurations
// =============================================================================

const entityIcons: Record<EntityType, typeof Briefcase> = {
  deal: Briefcase,
  company: Building2,
  agent: Bot,
  user: User,
  settings: Settings,
}

const actionIcons: Record<string, typeof Plus> = {
  DEAL_CREATED: Plus,
  DEAL_UPDATED: Edit3,
  DEAL_DELETED: Trash2,
  COMPANY_CREATED: Plus,
  COMPANY_UPDATED: Edit3,
  AGENT_RUN_STARTED: Play,
  AGENT_RUN_COMPLETED: CheckCircle2,
  USER_LOGIN: LogIn,
  USER_LOGOUT: LogOut,
  SETTINGS_CHANGED: Settings,
}

const entityColors: Record<EntityType, string> = {
  deal: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  company: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  agent: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  user: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  settings: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
}

const actionColors: Record<ActivityAction, string> = {
  DEAL_CREATED: 'text-emerald-400',
  DEAL_UPDATED: 'text-blue-400',
  DEAL_DELETED: 'text-red-400',
  COMPANY_CREATED: 'text-emerald-400',
  COMPANY_UPDATED: 'text-blue-400',
  AGENT_RUN_STARTED: 'text-amber-400',
  AGENT_RUN_COMPLETED: 'text-violet-400',
  USER_LOGIN: 'text-green-400',
  USER_LOGOUT: 'text-orange-400',
  SETTINGS_CHANGED: 'text-slate-400',
}

const timelineColors: Record<EntityType, string> = {
  deal: 'bg-blue-500/30',
  company: 'bg-emerald-500/30',
  agent: 'bg-violet-500/30',
  user: 'bg-amber-500/30',
  settings: 'bg-slate-500/30',
}

// =============================================================================
// Helper Functions
// =============================================================================

function formatMetadataValue(key: string, value: any): string {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') {
    if (key.toLowerCase().includes('amount') || key.toLowerCase().includes('value')) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value)
    }
    return value.toLocaleString()
  }
  if (value instanceof Date || !isNaN(Date.parse(value))) {
    return format(new Date(value), 'MMM d, yyyy HH:mm')
  }
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

function formatKey(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, (str) => str.toUpperCase()).trim()
}

// =============================================================================
// Components
// =============================================================================

function EntityBadge({ entityType, entityName, onClick }: { entityType: EntityType; entityName: string; onClick?: () => void }) {
  const Icon = entityIcons[entityType]

  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 active:scale-95',
        entityColors[entityType],
        onClick && 'cursor-pointer hover:brightness-110'
      )}
    >
      <Icon className="h-3 w-3" />
      <span className="max-w-[120px] truncate">{entityName}</span>
    </button>
  )
}

function UserAvatar({ user }: { user: Activity['user'] }) {
  const initials = user.name.split(' ').map((n) => n[0]).join('').toUpperCase()

  return (
    <div className="relative group">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="h-9 w-9 rounded-full object-cover border-2 border-border ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
        />
      ) : (
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-xs font-semibold text-primary border-2 border-border">
          {initials}
        </div>
      )}
      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
    </div>
  )
}

function MetadataPanel({ metadata }: { metadata: Record<string, any> }) {
  if (!metadata || Object.keys(metadata).length === 0) {
    return <div className="text-sm text-muted-foreground italic">No additional details available</div>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Object.entries(metadata).map(([key, value]) => (
        <div key={key} className="space-y-0.5">
          <div className="text-xs text-muted-foreground uppercase tracking-wide">{formatKey(key)}</div>
          <div className="text-sm font-medium text-foreground truncate">{formatMetadataValue(key, value)}</div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// Main ActivityItem Component
// =============================================================================

export function ActivityItem({
  activity,
  isLast = false,
  isFirst = false,
  showConnector = true,
  onEntityClick,
  className,
}: ActivityItemProps) {
  const [expanded, setExpanded] = React.useState(false)

  const ActionIcon = actionIcons[activity.type] || FileText
  const actionColor = actionColors[activity.type]
  const timelineColor = timelineColors[activity.entityType]

  const relativeTime = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })
  const absoluteTime = format(new Date(activity.timestamp), 'MMM d, yyyy at h:mm a')

  const handleEntityClick = () => {
    onEntityClick?.(activity)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn('relative', className)}
    >
      {showConnector && (
        <>
          {!isFirst && <div className="absolute left-5 top-0 bottom-1/2 w-px bg-border -translate-x-1/2" />}
          {!isLast && <div className={cn('absolute left-5 top-1/2 bottom-0 w-px -translate-x-1/2', timelineColor)} />}
          <div
            className={cn(
              'absolute left-5 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-background transition-transform duration-200',
              expanded && 'scale-125',
              timelineColor.replace('/30', '')
            )}
          />
        </>
      )}

      <div
        className={cn(
          'ml-12 rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-200 hover:border-border/80 hover:bg-card',
          expanded && 'bg-card border-border shadow-lg'
        )}
      >
        <div className="flex items-start gap-4 p-4 cursor-pointer transition-colors duration-200" onClick={() => setExpanded(!expanded)}>
          <UserAvatar user={activity.user} />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground">{activity.user.name}</span>
              <span className="text-muted-foreground">{activity.action}</span>
              <EntityBadge entityType={activity.entityType} entityName={activity.entityName} onClick={handleEntityClick} />
            </div>

            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-muted-foreground" title={absoluteTime}>{relativeTime}</span>
              <span className="text-xs text-muted-foreground/50">•</span>
              <span className={cn('text-xs font-medium', actionColor)}>{activity.type.replace(/_/g, ' ')}</span>
            </div>
          </div>

          <div
            className={cn(
              'flex items-center justify-center h-8 w-8 rounded-lg bg-muted/50 transition-colors duration-200',
              actionColor.replace('text-', 'bg-').replace('400', '500/10')
            )}
          >
            <ActionIcon className={cn('h-4 w-4', actionColor)} />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
            className={cn(
              'flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200',
              expanded && 'bg-muted text-foreground'
            )}
          >
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </button>
        </div>

        <AnimatePresence>
          {expanded && activity.metadata && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-0">
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Details</span>
                  </div>
                  <MetadataPanel metadata={activity.metadata} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default ActivityItem
