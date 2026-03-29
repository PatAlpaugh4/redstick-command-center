"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

interface NotificationBellProps {
  unreadCount: number;
  hasNewNotifications: boolean;
  onClick: () => void;
  isOpen: boolean;
}

export function NotificationBell({
  unreadCount,
  hasNewNotifications,
  onClick,
  isOpen,
}: NotificationBellProps) {
  const displayCount = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded-lg transition-colors"
      aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      aria-expanded={isOpen}
    >
      <motion.div
        animate={hasNewNotifications ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <Bell className="w-5 h-5" />
      </motion.div>

      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {displayCount}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse ring for new notifications */}
      <AnimatePresence>
        {hasNewNotifications && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 rounded-lg border-2 border-error"
          />
        )}
      </AnimatePresence>
    </button>
  );
}
