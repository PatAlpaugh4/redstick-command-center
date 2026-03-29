/**
 * useGlobalSearch Hook
 * ====================
 * Custom hook for global search functionality with fuzzy search,
 * debouncing, and recent searches persistence.
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'

// Searchable item types
export type SearchableItemType = 'deal' | 'company' | 'contact' | 'document'

export interface SearchableItem {
  id: string
  type: SearchableItemType
  title: string
  subtitle?: string
  url: string
}

export interface UseGlobalSearchReturn {
  query: string
  setQuery: (q: string) => void
  results: SearchableItem[]
  isSearching: boolean
  recentSearches: string[]
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
  removeRecentSearch: (query: string) => void
  filterByType: (type: SearchableItemType | 'all') => void
  activeTypeFilter: SearchableItemType | 'all'
}

const RECENT_SEARCHES_KEY = 'vc-dashboard-recent-searches'
const MAX_RECENT_SEARCHES = 10
const DEBOUNCE_MS = 300

/**
 * Simple fuzzy search implementation
 * Returns true if query matches text (case-insensitive, supports partial matches)
 */
function fuzzyMatch(text: string, query: string): boolean {
  const textLower = text.toLowerCase()
  const queryLower = query.toLowerCase()
  
  // Simple includes check for basic matching
  if (textLower.includes(queryLower)) return true
  
  // Character-by-character matching for fuzzy search
  let queryIndex = 0
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++
    }
  }
  
  return queryIndex === queryLower.length
}

/**
 * Calculate relevance score for sorting results
 * Exact matches score higher than fuzzy matches
 */
function getRelevanceScore(item: SearchableItem, query: string): number {
  const queryLower = query.toLowerCase()
  const titleLower = item.title.toLowerCase()
  const subtitleLower = item.subtitle?.toLowerCase() || ''
  
  let score = 0
  
  // Exact title match (highest priority)
  if (titleLower === queryLower) score += 100
  // Title starts with query
  else if (titleLower.startsWith(queryLower)) score += 80
  // Title contains query
  else if (titleLower.includes(queryLower)) score += 60
  // Fuzzy match in title
  else if (fuzzyMatch(item.title, query)) score += 40
  
  // Subtitle matches (lower priority)
  if (subtitleLower.includes(queryLower)) score += 30
  else if (fuzzyMatch(item.subtitle || '', query)) score += 20
  
  // Boost by type priority (deals > companies > contacts > documents)
  const typePriority: Record<SearchableItemType, number> = {
    deal: 5,
    company: 4,
    contact: 3,
    document: 2,
  }
  score += typePriority[item.type] || 0
  
  return score
}

export function useGlobalSearch(items: SearchableItem[]): UseGlobalSearchReturn {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [activeTypeFilter, setActiveTypeFilter] = useState<SearchableItemType | 'all'>('all')
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, MAX_RECENT_SEARCHES))
        }
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error)
    }
  }, [])
  
  // Debounce query updates
  useEffect(() => {
    setIsSearching(true)
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(query)
      setIsSearching(false)
    }, DEBOUNCE_MS)
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [query])
  
  // Filter and sort results
  const results = useMemo(() => {
    // If no query, return empty results (we show recent searches instead)
    if (!debouncedQuery.trim()) {
      return []
    }
    
    // Filter items by type and search query
    const filtered = items.filter((item) => {
      // Apply type filter
      if (activeTypeFilter !== 'all' && item.type !== activeTypeFilter) {
        return false
      }
      
      // Apply search filter
      const matchesTitle = fuzzyMatch(item.title, debouncedQuery)
      const matchesSubtitle = item.subtitle 
        ? fuzzyMatch(item.subtitle, debouncedQuery)
        : false
      
      return matchesTitle || matchesSubtitle
    })
    
    // Sort by relevance score (highest first)
    return filtered
      .map((item) => ({ item, score: getRelevanceScore(item, debouncedQuery) }))
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item)
  }, [debouncedQuery, items, activeTypeFilter])
  
  // Add a search to recent searches
  const addRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    setRecentSearches((prev) => {
      // Remove if already exists (to move to top)
      const filtered = prev.filter((s) => s.toLowerCase() !== searchQuery.toLowerCase())
      // Add to beginning and limit to max
      const updated = [searchQuery, ...filtered].slice(0, MAX_RECENT_SEARCHES)
      
      // Persist to localStorage
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('Failed to save recent searches:', error)
      }
      
      return updated
    })
  }, [])
  
  // Remove a specific recent search
  const removeRecentSearch = useCallback((searchQuery: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== searchQuery)
      
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('Failed to save recent searches:', error)
      }
      
      return updated
    })
  }, [])
  
  // Clear all recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY)
    } catch (error) {
      console.error('Failed to clear recent searches:', error)
    }
  }, [])
  
  // Filter by type
  const filterByType = useCallback((type: SearchableItemType | 'all') => {
    setActiveTypeFilter(type)
  }, [])
  
  return {
    query,
    setQuery,
    results,
    isSearching,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    removeRecentSearch,
    filterByType,
    activeTypeFilter,
  }
}

export default useGlobalSearch
