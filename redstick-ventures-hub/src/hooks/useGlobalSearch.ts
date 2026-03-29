"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { SearchableItem } from "@/components/search/GlobalSearch";

const RECENT_SEARCHES_KEY = "global_search_recent";
const MAX_RECENT = 10;

export function useGlobalSearch(items: SearchableItem[]) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeTypeFilter, setActiveTypeFilter] = useState<SearchableItem["type"] | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save recent searches to localStorage
  useEffect(() => {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Filter items based on query and type
  const results = useMemo(() => {
    let filtered = items;

    // Filter by type
    if (activeTypeFilter) {
      filtered = filtered.filter((item) => item.type === activeTypeFilter);
    }

    // Filter by query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.subtitle?.toLowerCase().includes(lowerQuery)
      );

      // Sort by relevance (exact matches first)
      filtered.sort((a, b) => {
        const aExact = a.title.toLowerCase() === lowerQuery;
        const bExact = b.title.toLowerCase() === lowerQuery;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return a.title.localeCompare(b.title);
      });
    }

    return filtered.slice(0, 20); // Limit results
  }, [items, query, activeTypeFilter]);

  const addRecentSearch = useCallback((search: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== search);
      return [search, ...filtered].slice(0, MAX_RECENT);
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const removeRecentSearch = useCallback((search: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== search));
  }, []);

  const filterByType = useCallback((type: SearchableItem["type"] | null) => {
    setActiveTypeFilter(type);
  }, []);

  return {
    query,
    setQuery,
    results,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    removeRecentSearch,
    filterByType,
    activeTypeFilter,
  };
}
