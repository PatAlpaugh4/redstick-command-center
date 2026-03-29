/**
 * useActivityFeed Hook
 * ====================
 * React hook for managing activity feed data with filtering, pagination,
 * infinite scroll, and CSV export capabilities.
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { format } from 'date-fns'

// =============================================================================
// Types
// =============================================================================

export type EntityType = 'deal' | 'company' | 'agent' | 'user' | 'settings'

export type ActivityAction =
  | 'DEAL_CREATED'
  | 'DEAL_UPDATED'
  | 'DEAL_DELETED'
  | 'COMPANY_CREATED'
  | 'COMPANY_UPDATED'
  | 'AGENT_RUN_STARTED'
  | 'AGENT_RUN_COMPLETED'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'SETTINGS_CHANGED'

export interface ActivityUser {
  id: string
  name: string
  avatar?: string
  email?: string
}

export interface Activity {
  id: string
  type: ActivityAction
  entityType: EntityType
  entityId: string
  entityName: string
  action: string
  user: ActivityUser
  timestamp: string
  metadata?: Record<string, any>
}

export interface ActivityFilters {
  entityType?: EntityType | 'all'
  userId?: string
  action?: ActivityAction | 'all'
  dateFrom?: string
  dateTo?: string
  searchQuery?: string
}

export interface UseActivityFeedOptions {
  filters?: ActivityFilters
  limit?: number
  enablePolling?: boolean
  pollingInterval?: number
}

export interface UseActivityFeedReturn {
  activities: Activity[]
  loading: boolean
  hasMore: boolean
  loadMore: () => void
  filters: ActivityFilters
  setFilters: (filters: ActivityFilters | ((prev: ActivityFilters) => ActivityFilters)) => void
  resetFilters: () => void
  exportActivities: () => void
  refresh: () => void
  totalCount: number
}

// =============================================================================
// Mock Data
// =============================================================================

const mockUsers: ActivityUser[] = [
  { id: 'u1', name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah', email: 'sarah@redstick.vc' },
  { id: 'u2', name: 'Michael Ross', avatar: 'https://i.pravatar.cc/150?u=michael', email: 'michael@redstick.vc' },
  { id: 'u3', name: 'Emily Watson', avatar: 'https://i.pravatar.cc/150?u=emily', email: 'emily@redstick.vc' },
  { id: 'u4', name: 'David Kim', avatar: 'https://i.pravatar.cc/150?u=david', email: 'david@redstick.vc' },
  { id: 'u5', name: 'Alex Thompson', avatar: 'https://i.pravatar.cc/150?u=alex', email: 'alex@redstick.vc' },
]

const mockActivities: Activity[] = [
  {
    id: 'a1',
    type: 'DEAL_CREATED',
    entityType: 'deal',
    entityId: 'd1',
    entityName: 'TechFlow AI Series A',
    action: 'created deal',
    user: mockUsers[0],
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    metadata: { amount: 5000000, stage: 'evaluation', sector: 'AI/ML' },
  },
  {
    id: 'a2',
    type: 'AGENT_RUN_COMPLETED',
    entityType: 'agent',
    entityId: 'ag1',
    entityName: 'Due Diligence Agent',
    action: 'completed analysis',
    user: mockUsers[1],
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    metadata: { dealsAnalyzed: 3, reportUrl: '/reports/dd-001.pdf', score: 87 },
  },
  {
    id: 'a3',
    type: 'DEAL_UPDATED',
    entityType: 'deal',
    entityId: 'd2',
    entityName: 'Quantum Labs Seed',
    action: 'updated deal stage',
    user: mockUsers[2],
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    metadata: { fromStage: 'lead', toStage: 'qualified', reason: 'Strong team background' },
  },
  {
    id: 'a4',
    type: 'COMPANY_CREATED',
    entityType: 'company',
    entityId: 'c1',
    entityName: 'Neural Networks Inc',
    action: 'added company',
    user: mockUsers[0],
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    metadata: { sector: 'Deep Learning', employees: 25, founded: 2022 },
  },
  {
    id: 'a5',
    type: 'USER_LOGIN',
    entityType: 'user',
    entityId: 'u3',
    entityName: 'Emily Watson',
    action: 'logged in',
    user: mockUsers[2],
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    metadata: { ip: '192.168.1.100', device: 'Chrome / MacOS', location: 'San Francisco, CA' },
  },
  {
    id: 'a6',
    type: 'DEAL_UPDATED',
    entityType: 'deal',
    entityId: 'd3',
    entityName: 'CloudScale Infrastructure',
    action: 'updated valuation',
    user: mockUsers[3],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    metadata: { oldValuation: 12000000, newValuation: 15000000, currency: 'USD' },
  },
  {
    id: 'a7',
    type: 'AGENT_RUN_STARTED',
    entityType: 'agent',
    entityId: 'ag2',
    entityName: 'Market Research Agent',
    action: 'started research',
    user: mockUsers[1],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    metadata: { targetSector: 'Fintech', competitors: ['Stripe', 'Plaid', 'Marqeta'] },
  },
  {
    id: 'a8',
    type: 'SETTINGS_CHANGED',
    entityType: 'settings',
    entityId: 's1',
    entityName: 'Notification Preferences',
    action: 'changed settings',
    user: mockUsers[4],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    metadata: { setting: 'email_notifications', oldValue: true, newValue: false },
  },
  {
    id: 'a9',
    type: 'DEAL_DELETED',
    entityType: 'deal',
    entityId: 'd4',
    entityName: 'Obsolete Startup Inc',
    action: 'deleted deal',
    user: mockUsers[0],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    metadata: { reason: 'Company shut down', originalAmount: 2000000 },
  },
  {
    id: 'a10',
    type: 'COMPANY_UPDATED',
    entityType: 'company',
    entityId: 'c2',
    entityName: 'DataFlow Systems',
    action: 'updated company info',
    user: mockUsers[2],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    metadata: { field: 'headcount', oldValue: 50, newValue: 65 },
  },
  {
    id: 'a11',
    type: 'AGENT_RUN_COMPLETED',
    entityType: 'agent',
    entityId: 'ag3',
    entityName: 'Portfolio Analysis Agent',
    action: 'completed report',
    user: mockUsers[3],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    metadata: { portfolioValue: 125000000, companies: 12, irr: 28.5 },
  },
  {
    id: 'a12',
    type: 'DEAL_CREATED',
    entityType: 'deal',
    entityId: 'd5',
    entityName: 'BioTech Solutions Series B',
    action: 'created deal',
    user: mockUsers[1],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    metadata: { amount: 15000000, leadInvestor: 'Andreessen Horowitz', coInvestors: 3 },
  },
  {
    id: 'a13',
    type: 'USER_LOGOUT',
    entityType: 'user',
    entityId: 'u2',
    entityName: 'Michael Ross',
    action: 'logged out',
    user: mockUsers[1],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    metadata: { sessionDuration: 28800 },
  },
  {
    id: 'a14',
    type: 'DEAL_UPDATED',
    entityType: 'deal',
    entityId: 'd1',
    entityName: 'TechFlow AI Series A',
    action: 'assigned deal',
    user: mockUsers[0],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
    metadata: { assignedTo: 'David Kim', previousOwner: 'Unassigned' },
  },
  {
    id: 'a15',
    type: 'COMPANY_CREATED',
    entityType: 'company',
    entityId: 'c3',
    entityName: 'GreenEnergy Corp',
    action: 'added company',
    user: mockUsers[4],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    metadata: { sector: 'CleanTech', revenue: 2500000, growth: 150 },
  },
  {
    id: 'a16',
    type: 'AGENT_RUN_STARTED',
    entityType: 'agent',
    entityId: 'ag1',
    entityName: 'Due Diligence Agent',
    action: 'started analysis',
    user: mockUsers[2],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    metadata: { dealId: 'd5', focus: 'financial', documentsAnalyzed: 47 },
  },
  {
    id: 'a17',
    type: 'SETTINGS_CHANGED',
    entityType: 'settings',
    entityId: 's2',
    entityName: 'Deal Stages',
    action: 'customized pipeline',
    user: mockUsers[0],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    metadata: { addedStage: 'Technical Review', position: 3 },
  },
  {
    id: 'a18',
    type: 'DEAL_CREATED',
    entityType: 'deal',
    entityId: 'd6',
    entityName: 'FinTech Pro Seed+',
    action: 'created deal',
    user: mockUsers[3],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    metadata: { amount: 3000000, referredBy: 'Existing Portfolio CEO' },
  },
  {
    id: 'a19',
    type: 'AGENT_RUN_COMPLETED',
    entityType: 'agent',
    entityId: 'ag4',
    entityName: 'Email Summarizer',
    action: 'processed emails',
    user: mockUsers[1],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    metadata: { emailsProcessed: 23, summariesGenerated: 5, actionItems: 8 },
  },
  {
    id: 'a20',
    type: 'COMPANY_UPDATED',
    entityType: 'company',
    entityId: 'c1',
    entityName: 'Neural Networks Inc',
    action: 'uploaded document',
    user: mockUsers[2],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    metadata: { documentType: 'Pitch Deck', fileName: 'NNI_SeriesA_Deck.pdf', size: '4.2MB' },
  },
  {
    id: 'a21',
    type: 'DEAL_UPDATED',
    entityType: 'deal',
    entityId: 'd7',
    entityName: 'Robotics Plus',
    action: 'updated priority',
    user: mockUsers[4],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
    metadata: { priority: 'high', reason: 'Strong technical moat' },
  },
  {
    id: 'a22',
    type: 'USER_LOGIN',
    entityType: 'user',
    entityId: 'u1',
    entityName: 'Sarah Chen',
    action: 'logged in',
    user: mockUsers[0],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 34).toISOString(),
    metadata: { ip: '192.168.1.105', device: 'Safari / MacOS', location: 'Palo Alto, CA' },
  },
  {
    id: 'a23',
    type: 'DEAL_CREATED',
    entityType: 'deal',
    entityId: 'd8',
    entityName: 'CyberSecure Inc',
    action: 'created deal',
    user: mockUsers[1],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    metadata: { amount: 8000000, stage: 'evaluation', sector: 'Cybersecurity' },
  },
  {
    id: 'a24',
    type: 'SETTINGS_CHANGED',
    entityType: 'settings',
    entityId: 's3',
    entityName: 'API Keys',
    action: 'rotated API key',
    user: mockUsers[3],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    metadata: { service: 'Crunchbase API', keyName: 'cb_prod_key_001' },
  },
  {
    id: 'a25',
    type: 'AGENT_RUN_COMPLETED',
    entityType: 'agent',
    entityId: 'ag2',
    entityName: 'Market Research Agent',
    action: 'completed research',
    user: mockUsers[2],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    metadata: { reportType: 'TAM Analysis', marketSize: '$12B', cagr: 24.5 },
  },
]

// =============================================================================
// Helper Functions
// =============================================================================

function filterActivities(activities: Activity[], filters: ActivityFilters): Activity[] {
  return activities.filter((activity) => {
    if (filters.entityType && filters.entityType !== 'all') {
      if (activity.entityType !== filters.entityType) return false
    }

    if (filters.userId && activity.user.id !== filters.userId) {
      return false
    }

    if (filters.action && filters.action !== 'all') {
      if (activity.type !== filters.action) return false
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      if (new Date(activity.timestamp) < fromDate) return false
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999)
      if (new Date(activity.timestamp) > toDate) return false
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      const searchFields = [
        activity.entityName,
        activity.action,
        activity.user.name,
        activity.type,
      ]
      if (!searchFields.some((field) => field.toLowerCase().includes(query))) {
        return false
      }
    }

    return true
  })
}

function exportToCSV(activities: Activity[], filename: string) {
  const headers = ['ID', 'Timestamp', 'Type', 'Entity Type', 'Entity Name', 'Action', 'User', 'User Email', 'Metadata']

  const rows = activities.map((activity) => [
    activity.id,
    format(new Date(activity.timestamp), 'yyyy-MM-dd HH:mm:ss'),
    activity.type,
    activity.entityType,
    activity.entityName,
    activity.action,
    activity.user.name,
    activity.user.email || '',
    JSON.stringify(activity.metadata || {}),
  ])

  const csv = [headers.join(','), ...rows.map((row) => row.map((cell) => {
    const stringValue = String(cell ?? '')
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    return stringValue
  }).join(','))].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

// =============================================================================
// Hook
// =============================================================================

const DEFAULT_LIMIT = 10

export function useActivityFeed(options: UseActivityFeedOptions = {}): UseActivityFeedReturn {
  const { filters: initialFilters = {}, limit = DEFAULT_LIMIT, enablePolling = false, pollingInterval = 30000 } = options

  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [displayCount, setDisplayCount] = useState(limit)
  const [loading, setLoading] = useState(false)
  const [filters, setFiltersState] = useState<ActivityFilters>(initialFilters)

  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  const filteredActivities = useMemo(() => {
    return filterActivities(activities, filters)
  }, [activities, filters])

  const displayedActivities = useMemo(() => {
    return filteredActivities.slice(0, displayCount)
  }, [filteredActivities, displayCount])

  const hasMore = displayCount < filteredActivities.length
  const totalCount = filteredActivities.length

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    setLoading(true)
    setTimeout(() => {
      setDisplayCount((prev) => prev + limit)
      setLoading(false)
    }, 500)
  }, [loading, hasMore, limit])

  const setFilters = useCallback(
    (newFilters: ActivityFilters | ((prev: ActivityFilters) => ActivityFilters)) => {
      setFiltersState((prev) => {
        const resolved = typeof newFilters === 'function' ? newFilters(prev) : newFilters
        return { ...prev, ...resolved }
      })
      setDisplayCount(limit)
    },
    [limit]
  )

  const resetFilters = useCallback(() => {
    setFiltersState({})
    setDisplayCount(limit)
  }, [limit])

  const exportActivities = useCallback(() => {
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss')
    const filename = `activity-log_${timestamp}.csv`
    exportToCSV(filteredActivities, filename)
  }, [filteredActivities])

  const refresh = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }, [])

  useEffect(() => {
    if (!enablePolling) return
    pollingRef.current = setInterval(() => {}, pollingInterval)
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [enablePolling, pollingInterval])

  useEffect(() => {
    setDisplayCount(limit)
  }, [filters.entityType, filters.userId, filters.action, filters.dateFrom, filters.dateTo, limit])

  return {
    activities: displayedActivities,
    loading,
    hasMore,
    loadMore,
    filters,
    setFilters,
    resetFilters,
    exportActivities,
    refresh,
    totalCount,
  }
}

export default useActivityFeed
