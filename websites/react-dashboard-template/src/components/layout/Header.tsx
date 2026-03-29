/**
 * Header Component
 * ================
 * Top navigation bar with global search, notifications, and actions.
 */

import { useState, useCallback } from 'react'
import { cn } from '@utils/cn'
import {
  Search,
  Bell,
  Moon,
  Sun,
  Plus,
} from 'lucide-react'
import { GlobalSearch } from '@components/search/GlobalSearch'
import { mockSearchableItems } from '@components/search/mockData'
import type { SearchableItem } from '@hooks/useGlobalSearch'

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleSearchSelect = useCallback((item: SearchableItem) => {
    console.log('Navigating to:', item.url)
    // In a real app: navigate(item.url)
    // window.location.href = item.url
    // or using your router: navigate(item.url)
  }, [])

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
        {/* Search Bar */}
        <div className="flex flex-1 max-w-md">
          <button
            onClick={() => setIsSearchOpen(true)}
            className={cn(
              'relative w-full text-left',
              'rounded-md border border-input bg-background',
              'hover:bg-muted/50 transition-colors'
            )}
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <div className="flex items-center justify-between pl-10 pr-4 py-2">
              <span className="text-sm text-muted-foreground">
                Search deals, companies, contacts...
              </span>
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-sans text-muted-foreground">
                ⌘K
              </kbd>
            </div>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* New Button */}
          <button
            className={cn(
              'flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground',
              'hover:bg-primary/90 transition-colors'
            )}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-md border border-input',
              'hover:bg-muted transition-colors'
            )}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Notifications */}
          <button
            className={cn(
              'relative flex h-9 w-9 items-center justify-center rounded-md border border-input',
              'hover:bg-muted transition-colors'
            )}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              3
            </span>
          </button>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearch
        searchableItems={mockSearchableItems}
        onSelect={handleSearchSelect}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  )
}
