/**
 * SearchResults Component
 * =======================
 * Displays search results grouped by type with highlighting
 * and keyboard navigation support.
 */

import { useMemo } from 'react'
import { cn } from '@utils/cn'
import {
  Handshake,
  Building2,
  User,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
} from 'lucide-react'
import type { SearchableItem, SearchableItemType } from '@hooks/useGlobalSearch'

export interface SearchResultsProps {
  /** Search results to display */
  results: SearchableItem[]
  /** Currently selected item index for keyboard navigation */
  selectedIndex: number
  /** Current search query for highlighting */
  query: string
  /** Recent searches to show when no query */
  recentSearches: string[]
  /** Whether search is in progress */
  isSearching: boolean
  /** Callback when an item is clicked/selected */
  onSelect: (item: SearchableItem) => void
  /** Callback when a recent search is clicked */
  onRecentSearchClick?: (search: string) => void
  /** Callback to remove a recent search */
  onRemoveRecentSearch?: (search: string) => void
  /** Callback to clear all recent searches */
  onClearRecentSearches?: () => void
}

// Type configuration with icons and labels
const TYPE_CONFIG: Record<SearchableItemType, { icon: typeof Handshake; label: string; color: string }> = {
  deal: { icon: Handshake, label: 'Deals', color: 'text-emerald-500' },
  company: { icon: Building2, label: 'Companies', color: 'text-blue-500' },
  contact: { icon: User, label: 'Contacts', color: 'text-purple-500' },
  document: { icon: FileText, label: 'Documents', color: 'text-orange-500' },
}

/**
 * Highlight matching text in a string
 */
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'))
  
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <mark 
            key={i} 
            className="bg-primary/20 text-primary font-medium rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Group results by type
 */
function groupResultsByType(results: SearchableItem[]): Record<SearchableItemType, SearchableItem[]> {
  return results.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = []
    }
    acc[item.type].push(item)
    return acc
  }, {} as Record<SearchableItemType, SearchableItem[]>)
}

export function SearchResults({
  results,
  selectedIndex,
  query,
  recentSearches,
  isSearching,
  onSelect,
  onRecentSearchClick,
  onRemoveRecentSearch,
  onClearRecentSearches,
}: SearchResultsProps) {
  const groupedResults = useMemo(() => groupResultsByType(results), [results])
  
  // Order of types to display
  const typeOrder: SearchableItemType[] = ['deal', 'company', 'contact', 'document']
  
  // Calculate global index for an item within its group
  const getGlobalIndex = (typeIndex: number, itemIndex: number): number => {
    let index = 0
    for (let i = 0; i < typeIndex; i++) {
      const type = typeOrder[i]
      if (groupedResults[type]) {
        index += groupedResults[type].length
      }
    }
    return index + itemIndex
  }
  
  // Show recent searches when no query
  const showRecentSearches = !query.trim() && recentSearches.length > 0
  
  // Show empty state
  const showEmptyState = !isSearching && query.trim() && results.length === 0
  
  // Show initial state (no query, no recent searches)
  const showInitialState = !query.trim() && recentSearches.length === 0
  
  return (
    <div className="flex flex-col">
      {/* Recent Searches */}
      {showRecentSearches && (
        <div className="border-b border-border">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5" />
              Recent Searches
            </div>
            {onClearRecentSearches && (
              <button
                onClick={onClearRecentSearches}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="p-2">
            {recentSearches.map((search, index) => (
              <div
                key={`recent-${index}`}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer transition-colors',
                  selectedIndex === index 
                    ? 'bg-accent/20' 
                    : 'hover:bg-surface-elevated'
                )}
                onClick={() => onRecentSearchClick?.(search)}
              >
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm">{search}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                {onRemoveRecentSearch && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveRecentSearch(search)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all"
                    title="Remove"
                  >
                    <span className="sr-only">Remove</span>
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Search Results */}
      {results.length > 0 && (
        <div className="max-h-[60vh] overflow-y-auto">
          {typeOrder.map((type, typeIndex) => {
            const items = groupedResults[type]
            if (!items || items.length === 0) return null
            
            const config = TYPE_CONFIG[type]
            const Icon = config.icon
            
            return (
              <div key={type} className="border-b border-border last:border-0">
                {/* Type Header */}
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/30">
                  <Icon className={cn('h-4 w-4', config.color)} />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {config.label}
                  </span>
                  <span className="text-xs text-muted-foreground/60">
                    ({items.length})
                  </span>
                </div>
                
                {/* Items */}
                <div className="p-2">
                  {items.map((item, itemIndex) => {
                    const globalIndex = getGlobalIndex(typeIndex, itemIndex)
                    const isSelected = globalIndex === selectedIndex
                    
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'group flex items-start gap-3 rounded-md px-3 py-2.5 cursor-pointer transition-all',
                          isSelected 
                            ? 'bg-accent/20' 
                            : 'hover:bg-surface-elevated'
                        )}
                        onClick={() => onSelect(item)}
                      >
                        {/* Type Icon */}
                        <div className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted',
                          config.color
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            <HighlightedText text={item.title} query={query} />
                          </div>
                          {item.subtitle && (
                            <div className="text-xs text-muted-foreground truncate mt-0.5">
                              <HighlightedText text={item.subtitle} query={query} />
                            </div>
                          )}
                        </div>
                        
                        {/* Arrow indicator on hover/select */}
                        <ArrowRight className={cn(
                          'h-4 w-4 shrink-0 transition-opacity',
                          isSelected ? 'opacity-100 text-primary' : 'opacity-0 group-hover:opacity-50'
                        )} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {/* Empty State */}
      {showEmptyState && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium mb-1">No results found</h3>
          <p className="text-xs text-muted-foreground max-w-xs">
            We couldn&apos;t find anything matching &quot;<span className="font-medium text-foreground">{query}</span>&quot;.
            Try a different search term or check your spelling.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['Acme Corp', 'Series A', 'John Smith', 'Term Sheet'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onRecentSearchClick?.(suggestion)}
                className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Initial State */}
      {showInitialState && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-sm font-medium mb-1">Start searching</h3>
          <p className="text-xs text-muted-foreground max-w-xs">
            Search across deals, companies, contacts, and documents.
            Use arrow keys to navigate and Enter to select.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['Acme Corp', 'Series A', 'John Smith', 'Due Diligence'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onRecentSearchClick?.(suggestion)}
                className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Searching Indicator */}
      {isSearching && query.trim() && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg 
              className="h-4 w-4 animate-spin" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4" 
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
              />
            </svg>
            Searching...
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchResults
