"use client";

import { motion } from "framer-motion";
import { Clock, X, FileText, Building2, User, Briefcase, Search } from "lucide-react";
import { SearchableItem } from "./GlobalSearch";

interface SearchResultsProps {
  results: SearchableItem[];
  recentSearches: string[];
  query: string;
  onSelect: (item: SearchableItem) => void;
  onClearRecent: () => void;
  onRemoveRecent: (search: string) => void;
}

const typeIcons = {
  deal: Briefcase,
  company: Building2,
  contact: User,
  document: FileText,
};

const typeColors = {
  deal: "text-accent",
  company: "text-blue-400",
  contact: "text-green-400",
  document: "text-amber-400",
};

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="bg-accent/30 text-accent font-medium">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export function SearchResults({
  results,
  recentSearches,
  query,
  onSelect,
  onClearRecent,
  onRemoveRecent,
}: SearchResultsProps) {
  const hasResults = results.length > 0;
  const hasRecent = recentSearches.length > 0;
  const isSearching = query.length > 0;

  // Group results by type
  const groupedResults = results.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, SearchableItem[]>);

  return (
    <div className="max-h-[60vh] overflow-y-auto">
      {/* Recent Searches */}
      {!isSearching && hasRecent && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-tertiary uppercase">
              Recent Searches
            </span>
            <button
              onClick={onClearRecent}
              className="text-xs text-text-tertiary hover:text-text-secondary"
            >
              Clear
            </button>
          </div>
          <div className="space-y-1">
            {recentSearches.slice(0, 5).map((search, index) => (
              <motion.div
                key={search}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-elevated cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-text-tertiary" />
                  <span className="text-text-secondary">{search}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRecent(search);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface rounded text-text-tertiary"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {isSearching && hasResults && (
        <div className="p-2">
          {Object.entries(groupedResults).map(([type, items]) => (
            <div key={type} className="mb-4">
              <div className="px-3 py-2 text-xs font-medium text-text-tertiary uppercase">
                {type}s
              </div>
              <div className="space-y-1">
                {items.map((item, index) => {
                  const Icon = typeIcons[item.type];
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onSelect(item)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent/10 text-left transition-colors"
                    >
                      <Icon className={`w-5 h-5 ${typeColors[item.type]}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary font-medium truncate">
                          {highlightMatch(item.title, query)}
                        </p>
                        {item.subtitle && (
                          <p className="text-sm text-text-secondary truncate">
                            {highlightMatch(item.subtitle, query)}
                          </p>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {isSearching && !hasResults && (
        <div className="p-8 text-center">
          <Search className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
          <p className="text-text-secondary">No results found for &quot;{query}&quot;</p>
          <p className="text-sm text-text-tertiary mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isSearching && !hasRecent && (
        <div className="p-8 text-center">
          <Search className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
          <p className="text-text-secondary">Start typing to search</p>
          <p className="text-sm text-text-tertiary mt-1">
            Search across deals, companies, contacts, and documents
          </p>
        </div>
      )}
    </div>
  );
}
