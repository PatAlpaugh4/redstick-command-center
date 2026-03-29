"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Command } from "lucide-react";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { SearchResults } from "./SearchResults";

export interface SearchableItem {
  id: string;
  type: "deal" | "company" | "contact" | "document";
  title: string;
  subtitle?: string;
  url: string;
}

interface GlobalSearchProps {
  searchableItems: SearchableItem[];
  onSelect: (item: SearchableItem) => void;
}

export function GlobalSearch({ searchableItems, onSelect }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    query,
    setQuery,
    results,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    removeRecentSearch,
    filterByType,
    activeTypeFilter,
  } = useGlobalSearch(searchableItems);

  // Keyboard shortcut: Cmd/Ctrl + K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = useCallback(
    (item: SearchableItem) => {
      addRecentSearch(item.title);
      onSelect(item);
      setIsOpen(false);
      setQuery("");
    },
    [addRecentSearch, onSelect, setQuery]
  );

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-text-secondary hover:text-text-primary hover:border-accent/50 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm hidden md:inline">Search...</span>
        <kbd className="hidden md:flex items-center gap-1 px-2 py-0.5 bg-surface-elevated rounded text-xs text-text-tertiary">
          <Command className="w-3 h-3" />
          <span>K</span>
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh]"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search className="w-5 h-5 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search deals, companies, contacts..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-text-primary placeholder-text-tertiary outline-none text-lg"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 hover:bg-surface-elevated rounded text-text-tertiary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd
                  onClick={() => setIsOpen(false)}
                  className="px-2 py-1 bg-surface-elevated rounded text-xs text-text-tertiary cursor-pointer hover:text-text-secondary"
                >
                  ESC
                </kbd>
              </div>

              {/* Type Filters */}
              <div className="flex gap-2 p-2 border-b border-border overflow-x-auto">
                {["all", "deal", "company", "contact", "document"].map((type) => (
                  <button
                    key={type}
                    onClick={() => filterByType(type === "all" ? null : (type as SearchableItem["type"]))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                      (type === "all" && !activeTypeFilter) || activeTypeFilter === type
                        ? "bg-accent text-white"
                        : "bg-surface-elevated text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {type === "all" ? "All" : type + "s"}
                  </button>
                ))}
              </div>

              {/* Results */}
              <SearchResults
                results={results}
                recentSearches={recentSearches}
                query={query}
                onSelect={handleSelect}
                onClearRecent={clearRecentSearches}
                onRemoveRecent={removeRecentSearch}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
