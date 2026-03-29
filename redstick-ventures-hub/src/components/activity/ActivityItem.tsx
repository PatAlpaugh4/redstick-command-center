"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "@/hooks/useActivityFeed";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ActivityItemProps {
  activity: Activity;
  isLast?: boolean;
}

const entityColors = {
  deal: "bg-blue-500",
  company: "bg-emerald-500",
  agent: "bg-violet-500",
  user: "bg-amber-500",
  settings: "bg-slate-500",
};

const actionIcons: Record<string, string> = {
  DEAL_CREATED: "✨",
  DEAL_UPDATED: "📝",
  DEAL_DELETED: "🗑️",
  COMPANY_CREATED: "🏢",
  COMPANY_UPDATED: "🔄",
  AGENT_RUN_STARTED: "▶️",
  AGENT_RUN_COMPLETED: "✅",
  USER_LOGIN: "🔑",
  USER_LOGOUT: "👋",
  SETTINGS_CHANGED: "⚙️",
};

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function ActivityItem({ activity, isLast }: ActivityItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative flex gap-4 pb-8">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-border" />
      )}

      {/* Icon */}
      <div className={`relative z-10 w-10 h-10 rounded-full ${entityColors[activity.entityType]} flex items-center justify-center text-lg shrink-0`}>
        {actionIcons[activity.type] || "•"}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-text-primary">
              <span className="font-medium">{activity.user.name}</span>{" "}
              <span className="text-text-secondary">{activity.action}</span>{" "}
              <span className="font-medium text-accent">{activity.entityName}</span>
            </p>
            <p className="text-xs text-text-tertiary mt-1">
              {formatRelativeTime(activity.timestamp)}
            </p>
          </div>
          
          {activity.metadata && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-surface-elevated rounded text-text-tertiary"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Expanded metadata */}
        <AnimatePresence>
          {isExpanded && activity.metadata && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="bg-surface-elevated rounded-lg p-3 text-sm">
                {Object.entries(activity.metadata).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="text-text-tertiary capitalize">{key}:</span>
                    <span className="text-text-secondary">{String(value)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
