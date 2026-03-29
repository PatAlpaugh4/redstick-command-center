"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Settings, Volume2, VolumeX, Bell } from "lucide-react";
import { Notification } from "@/hooks/useNotifications";
import { ANIMATION } from "@/lib/animations";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  browserNotificationsEnabled: boolean;
  requestBrowserPermission: () => Promise<boolean>;
}

const typeIcons = {
  deal: "🤝",
  agent: "🤖",
  system: "⚙️",
  mention: "💬",
};

const typeColors = {
  deal: "border-l-emerald-500",
  agent: "border-l-blue-500",
  system: "border-l-amber-500",
  mention: "border-l-accent",
};

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,
  dismissNotification,
  soundEnabled,
  setSoundEnabled,
  browserNotificationsEnabled,
  requestBrowserPermission,
}: NotificationCenterProps) {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "mentions">("all");

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "mentions") return n.type === "mention";
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-surface border-l border-border z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>
                <p className="text-sm text-text-secondary">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-2 hover:bg-surface-elevated rounded-lg text-text-secondary hover:text-text-primary"
                    title="Mark all as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-surface-elevated rounded-lg text-text-secondary hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              {(["all", "unread", "mentions"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium capitalize transition-colors relative ${
                    activeTab === tab ? "text-accent" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto h-[calc(100%-180px)]">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Bell className="w-12 h-12 text-text-tertiary mb-4" />
                  <p className="text-text-secondary">
                    {activeTab === "unread"
                      ? "No unread notifications"
                      : activeTab === "mentions"
                      ? "No mentions yet"
                      : "No notifications"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-4 hover:bg-surface-elevated/50 cursor-pointer transition-colors border-l-4 ${
                        typeColors[notification.type]
                      } ${!notification.read ? "bg-surface-elevated/30" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{typeIcons[notification.type]}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className={`font-medium text-sm ${!notification.read ? "text-text-primary" : "text-text-secondary"}`}>
                              {notification.title}
                            </h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissNotification(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface rounded text-text-tertiary"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-sm text-text-secondary mt-1">{notification.message}</p>
                          <p className="text-xs text-text-tertiary mt-2">
                            {formatRelativeTime(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-surface">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Volume2 className="w-4 h-4" />
                    <span>Sound</span>
                  </div>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      soundEnabled ? "bg-accent" : "bg-surface-elevated"
                    }`}
                  >
                    <motion.div
                      animate={{ x: soundEnabled ? 20 : 2 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Bell className="w-4 h-4" />
                    <span>Browser Notifications</span>
                  </div>
                  <button
                    onClick={() => {
                      if (!browserNotificationsEnabled) {
                        requestBrowserPermission();
                      }
                    }}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      browserNotificationsEnabled ? "bg-accent" : "bg-surface-elevated"
                    }`}
                  >
                    <motion.div
                      animate={{ x: browserNotificationsEnabled ? 20 : 2 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full"
                    />
                  </button>
                </div>

                <button className="flex items-center gap-2 text-sm text-accent hover:underline w-full">
                  <Settings className="w-4 h-4" />
                  <span>Notification Settings</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import { useState } from "react";
