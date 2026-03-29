/**
 * SearchDemo Component
 * ====================
 * Demo component showing how to use the GlobalSearch component.
 * This can be used for testing or as a reference implementation.
 */

import { useState, useCallback } from 'react'
import { GlobalSearch } from './GlobalSearch'
import { mockSearchableItems } from './mockData'
import { Button } from '@components/ui/Button'
import { Search } from 'lucide-react'
import type { SearchableItem } from '@hooks/useGlobalSearch'

export function SearchDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [lastSelected, setLastSelected] = useState<SearchableItem | null>(null)

  const handleSelect = useCallback((item: SearchableItem) => {
    console.log('Selected:', item)
    setLastSelected(item)
    // In a real app, you would navigate to item.url
    // navigate(item.url)
  }, [])

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Global Search Demo</h1>
        <p className="text-muted-foreground">
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-sm">Cmd+K</kbd> or click the button below to open search.
        </p>
      </div>

      <Button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Search className="h-4 w-4" />
        Open Search
        <span className="ml-2 text-xs opacity-60 hidden sm:inline">
          ⌘K
        </span>
      </Button>

      {lastSelected && (
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm font-medium mb-1">Last Selected:</p>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(lastSelected, null, 2)}
          </pre>
        </div>
      )}

      <GlobalSearch
        searchableItems={mockSearchableItems}
        onSelect={handleSelect}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  )
}

export default SearchDemo
