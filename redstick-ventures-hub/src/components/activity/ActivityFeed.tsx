"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ActivityItem } from "./ActivityItem";
import { useActivityFeed, ActivityFilters } from "@/hooks/useActivityFeed";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  X,
  Calendar,
  User,
  Layers,
  Activity,
} from "lucide-react";

export function ActivityFeed() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { activities, loading, hasMore, loadMore, filters, setFilters, exportActivities, refresh } =
    useActivityFeed({ limit: 20 });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMore();
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, loadMore]);

  // Apply search filter
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters((prev: ActivityFilters) => ({ ...prev, search: query }));
  };

  // Group activities by date
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.timestamp).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, typeof activities>);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-text-primary">Activity Feed</h2>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={refresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="secondary" size="sm" onClick={exportActivities}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search activities..."
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            variant={showFilters ? "primary" : "secondary"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-surface rounded-lg p-4 border border-border"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Entity Type Filter */}
              <div>
                <label className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                  <Layers className="w-4 h-4" />
                  Entity Type
                </label>
                <select
                  value={filters.entityType || ""}
                  onChange={(e) =>
                    setFilters((prev: ActivityFilters) => ({
                      ...prev,
                      entityType: (e.target.value as ActivityFilters["entityType"]) || null,
                    }))
                  }
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text-primary"
                >
                  <option value="">All Types</option>
                  <option value="deal">Deal</option>
                  <option value="company">Company</option>
                  <option value="agent">Agent</option>
                  <option value="user">User</option>
                  <option value="settings">Settings</option>
                </select>
              </div>

              {/* Action Filter */}
              <div>
                <label className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                  <Activity className="w-4 h-4" />
                  Action
                </label>
                <select
                  value={filters.action || ""}
                  onChange={(e) =>
                    setFilters((prev: ActivityFilters) => ({
                      ...prev,
                      action: e.target.value || undefined,
                    }))
                  }
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text-primary"
                >
                  <option value="">All Actions</option>
                  <option value="CREATED">Created</option>
                  <option value="UPDATED">Updated</option>
                  <option value="DELETED">Deleted</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                  <Calendar className="w-4 h-4" />
                  From
                </label>
                <input
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) =>
                    setFilters((prev: ActivityFilters) => ({ ...prev, dateFrom: e.target.value }))
                  }
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text-primary"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                  <Calendar className="w-4 h-4" />
                  To
                </label>
                <input
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) =>
                    setFilters((prev: ActivityFilters) => ({ ...prev, dateTo: e.target.value }))
                  }
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text-primary"
                />
              </div>
            </div>

            {/* Active Filters */}
            {(filters.entityType || filters.action || filters.dateFrom || filters.dateTo) && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <span className="text-sm text-text-tertiary">Active filters:</span>
                <button
                  onClick={() => setFilters({})}
                  className="text-sm text-accent hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="space-y-6">
        {Object.entries(groupedActivities).map(([date, dateActivities]) => (
          <div key={date}>
            <h3 className="text-sm font-medium text-text-tertiary mb-4 sticky top-0 bg-background py-2">
              {new Date(date).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <div className="pl-2">
              {dateActivities.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  isLast={index === dateActivities.length - 1}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Loading / Load More */}
      <div ref={loadMoreRef} className="py-4 text-center">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-text-secondary">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading more...</span>
          </div>
        ) : hasMore ? (
          <Button variant="secondary" onClick={loadMore}>
            Load More
          </Button>
        ) : activities.length > 0 ? (
          <p className="text-text-tertiary">No more activities</p>
        ) : (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <p className="text-text-secondary">No activities found</p>
            <button
              onClick={() => setFilters({})}
              className="text-accent hover:underline mt-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { Input } from "@/components/ui/Input";
