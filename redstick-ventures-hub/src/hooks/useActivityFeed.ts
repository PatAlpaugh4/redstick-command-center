"use client";

import { useState, useCallback, useMemo } from "react";
import { exportToCSV } from "@/lib/export";

export interface Activity {
  id: string;
  type: string;
  entityType: "deal" | "company" | "agent" | "user" | "settings";
  entityId: string;
  entityName: string;
  action: string;
  user: { id: string; name: string; avatar?: string };
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ActivityFilters {
  entityType?: Activity["entityType"] | null;
  userId?: string;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "DEAL_CREATED",
    entityType: "deal",
    entityId: "d1",
    entityName: "AquaCulture Labs",
    action: "created",
    user: { id: "u1", name: "Sarah Chen" },
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "2",
    type: "DEAL_UPDATED",
    entityType: "deal",
    entityId: "d2",
    entityName: "FarmGrid Analytics",
    action: "moved to Due Diligence",
    user: { id: "u2", name: "Marcus Johnson" },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "3",
    type: "AGENT_RUN_COMPLETED",
    entityType: "agent",
    entityId: "a1",
    entityName: "Deal Screener",
    action: "completed analysis",
    user: { id: "system", name: "System" },
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    metadata: { dealsAnalyzed: 24, matches: 8 },
  },
  {
    id: "4",
    type: "COMPANY_CREATED",
    entityType: "company",
    entityId: "c1",
    entityName: "VerticalHarvest",
    action: "added to portfolio",
    user: { id: "u1", name: "Sarah Chen" },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "5",
    type: "USER_LOGIN",
    entityType: "user",
    entityId: "u3",
    entityName: "Dr. Elena Rodriguez",
    action: "logged in",
    user: { id: "u3", name: "Dr. Elena Rodriguez" },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "6",
    type: "SETTINGS_CHANGED",
    entityType: "settings",
    entityId: "s1",
    entityName: "Notification Preferences",
    action: "updated",
    user: { id: "u1", name: "Sarah Chen" },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "7",
    type: "DEAL_DELETED",
    entityType: "deal",
    entityId: "d3",
    entityName: "Old Prospect",
    action: "deleted",
    user: { id: "u2", name: "Marcus Johnson" },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "8",
    type: "AGENT_RUN_STARTED",
    entityType: "agent",
    entityId: "a2",
    entityName: "Market Intel",
    action: "started monitoring",
    user: { id: "system", name: "System" },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

export function useActivityFeed(options: { limit?: number } = {}) {
  const { limit = 20 } = options;
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [filters, setFilters] = useState<ActivityFilters>({});
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (filters.entityType && activity.entityType !== filters.entityType) return false;
      if (filters.userId && activity.user.id !== filters.userId) return false;
      if (filters.action && !activity.type.includes(filters.action)) return false;
      if (filters.dateFrom && new Date(activity.timestamp) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(activity.timestamp) > new Date(filters.dateTo)) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return (
          activity.entityName.toLowerCase().includes(search) ||
          activity.user.name.toLowerCase().includes(search) ||
          activity.action.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [activities, filters]);

  // Load more (mock pagination)
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newActivities = mockActivities.map((a) => ({
        ...a,
        id: `${a.id}_${Date.now()}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      }));
      setActivities((prev) => [...prev, ...newActivities]);
      setHasMore(newActivities.length === limit);
      setLoading(false);
    }, 500);
  }, [loading, hasMore, limit]);

  // Export activities to CSV
  const exportActivities = useCallback(() => {
    const exportData = filteredActivities.map((a) => ({
      Timestamp: a.timestamp,
      User: a.user.name,
      Action: a.action,
      Entity: a.entityName,
      Type: a.entityType,
    }));
    exportToCSV(exportData, "activity-log");
  }, [filteredActivities]);

  // Refresh activities
  const refresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 500);
  }, []);

  return {
    activities: filteredActivities.slice(0, limit),
    loading,
    hasMore,
    loadMore,
    filters,
    setFilters,
    exportActivities,
    refresh,
  };
}
