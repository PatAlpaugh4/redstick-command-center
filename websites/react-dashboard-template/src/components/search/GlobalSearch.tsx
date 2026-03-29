/**
 * GlobalSearch Component
 * ======================
 * Command palette style global search with keyboard navigation,
 * recent searches, and fuzzy matching.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@utils/cn'
import { useGlobalSearch, type SearchableItem } from '@hooks/useGlobalSearch'
import { SearchResults } from './SearchResults'
import {
  Search,
  Command,
  X,
  Filter,
} from 'lucide-react'

export interface GlobalSearchProps {
  /** Array of items to search through */
  searchableItems: SearchableItem[]
  /** Callback when an item is selected */
  onSelect: (item: SearchableItem) => void
  /** Optional callback when modal is closed */
  onClose?: () => void
  /** Whether the search modal is open (controlled mode) */
  isOpen?: boolean
  /** Initial open state (uncontrolled mode) */
  defaultOpen?: boolean
}

// Type filter options
const TYPE_FILTERS = [
  { value: 'all' as const, label: 'All', shortcut: 'A' },
  { value: 'deal' as const, label: 'Deals', shortcut: 'D' },
  { value: 'company' as const, label: 'Companies', shortcut: 'C' },
  { value: 'contact' as const, label: 'Contacts', shortcut: 'O' },
  { value: 'document' as const, label: 'Documents', shortcut: 'F' },
]

export function GlobalSearch({
  searchableItems,
  onSelect,
  onClose,
  isOpen: controlledIsOpen,
  defaultOpen = false,
}: GlobalSearchProps) {
  // State for uncontrolled mode
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen)
  
  // Use controlled or uncontrolled state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setIsOpen = useCallback((value: boolean) => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(value)
    }
    if (!value) {
      onClose?.()
    }
  }, [controlledIsOpen, onClose])
  
  // Search hook
  const {
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
  } = useGlobalSearch(searchableItems)
  
  // Keyboard navigation state
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  
  // Calculate total items for keyboard navigation
  const totalItems = results.length || (query.trim() ? 0 : recentSearches.length)
  
  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query, activeTypeFilter, results.length])
  
  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }, [isOpen])
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        return
      }
      
      // Only handle these when modal is open
      if (!isOpen) return
      
      // Escape to close
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsOpen(false)
        return
      }
      
      // Arrow navigation
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % Math.max(totalItems, 1))
        return
      }
      
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + Math.max(totalItems, 1)) % Math.max(totalItems, 1))
        return
      }
      
      // Enter to select
      if (e.key === 'Enter') {
        e.preventDefault()
        
        if (query.trim() && results.length > 0 && selectedIndex < results.length) {
          // Select search result
          const selectedItem = results[selectedIndex]
          handleSelect(selectedItem)
        } else if (!query.trim() && recentSearches.length > 0) {
          // Select recent search
          const selectedSearch = recentSearches[selectedIndex]
          if (selectedSearch) {
            setQuery(selectedSearch)
          }
        }
        return
      }
      
      // Type filter shortcuts (only when not typing in input)
      if (document.activeElement !== inputRef.current) {
        const filterMap: Record<string, typeof activeTypeFilter> = {
          'a': 'all',
          'd': 'deal',
          'c': 'company',
          'o': 'contact',
          'f': 'document',
        }
        
        const filter = filterMap[e.key.toLowerCase()]
        if (filter) {
          e.preventDefault()
          filterByType(filter)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setIsOpen, results, selectedIndex, query, recentSearches, totalItems, filterByType])
  
  // Handle item selection
  const handleSelect = useCallback((item: SearchableItem) => {
    addRecentSearch(item.title)
    onSelect(item)
    setIsOpen(false)
    setQuery('')
  }, [addRecentSearch, onSelect, setIsOpen, setQuery])
  
  // Handle recent search click
  const handleRecentSearchClick = useCallback((search: string) => {
    setQuery(search)
    addRecentSearch(search)
  }, [setQuery, addRecentSearch])
  
  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      setIsOpen(false)
    }
  }, [setIsOpen])
  
  // Prevent modal from rendering if not open (except for portal cleanup)
  if (!isOpen) return null
  
  const modalContent = (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className={cn(
          'relative w-full max-w-2xl overflow-hidden rounded-xl',
          'bg-surface border border-border shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-200'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
      >
        {/* Search Input Header */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deals, companies, contacts..."
            className={cn(
              'flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground',
              'text-foreground'
            )}
            aria-label="Search input"
          />
          
          {/* Type Filter Badge (when active) */}
          {activeTypeFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {TYPE_FILTERS.find(f => f.value === activeTypeFilter)?.label}
              <button
                onClick={() => filterByType('all')}
                className="ml-1 hover:text-primary/70"
                aria-label="Clear filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {/* Keyboard Shortcut Hint */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-sans">
              ESC
            </kbd>
            <span>to close</span>
          </div>
        </div>
        
        {/* Type Filters */}
        <div className="flex items-center gap-1 border-b border-border px-3 py-2 bg-muted/30">
          <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1" />
          {TYPE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => filterByType(filter.value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                activeTypeFilter === filter.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
              title={`Filter by ${filter.label} (Alt+${filter.shortcut})`}
            >
              {filter.label}
              <span className="hidden sm:inline text-[10px] opacity-60">
                ⌥{filter.shortcut}
              </span>
            </button>
          ))}
        </div>
        
        {/* Results */}
        <SearchResults
          results={results}
          selectedIndex={selectedIndex}
          query={query}
          recentSearches={recentSearches}
          isSearching={isSearching}
          onSelect={handleSelect}
          onRecentSearchClick={handleRecentSearchClick}
          onRemoveRecentSearch={removeRecentSearch}
          onClearRecentSearches={clearRecentSearches}
        />
        
        {/* Footer with Keyboard Shortcuts */}
        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-sans">
                ↑↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-sans">
                ↵
              </kbd>
              <span>to select</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">
              {results.length > 0 ? `${results.length} results` : ''}
            </span>
            <span className="flex items-center gap-1">
              <Command className="h-3 w-3" />
              <span>+</span>
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-sans">
                K
              </kbd>
              <span className="hidden sm:inline ml-1">to search</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
  
  // Use portal to render at document body
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }
  
  return null
}

export default GlobalSearch
