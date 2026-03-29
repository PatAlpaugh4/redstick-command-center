"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export interface Notification {
  id: string;
  type: "deal" | "agent" | "system" | "mention";
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "deal",
    title: "New Deal Submitted",
    message: "AquaCulture Labs submitted a Series A pitch deck",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    actionUrl: "/app/pipeline/1",
  },
  {
    id: "2",
    type: "agent",
    title: "Agent Run Complete",
    message: "Deal Screener analyzed 24 deals with 8 matches",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "3",
    type: "mention",
    title: "You were mentioned",
    message: "Sarah Chen mentioned you in AquaCulture Labs notes",
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "4",
    type: "system",
    title: "Weekly Digest Ready",
    message: "Your portfolio performance summary is available",
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "5",
    type: "deal",
    title: "Stage Updated",
    message: "FarmGrid Analytics moved to Due Diligence",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "6",
    type: "agent",
    title: "Market Alert",
    message: "Competitor funding detected: $50M Series C",
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "7",
    type: "system",
    title: "Security Alert",
    message: "New login from unrecognized device",
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "8",
    type: "mention",
    title: "IC Meeting Scheduled",
    message: "You were added to VerticalHarvest IC review",
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const hasNewNotifications = unreadCount > 0;

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Play notification sound
  const playSound = useCallback(() => {
    if (!soundEnabled || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }, [soundEnabled]);

  // Request browser notification permission
  const requestBrowserPermission = useCallback(async () => {
    if (!("Notification" in window)) return false;
    const permission = await Notification.requestPermission();
    const enabled = permission === "granted";
    setBrowserNotificationsEnabled(enabled);
    return enabled;
  }, []);

  // Show browser notification
  const showBrowserNotification = useCallback((title: string, body: string) => {
    if (browserNotificationsEnabled && "Notification" in window) {
      new Notification(title, { body, icon: "/icon.png" });
    }
  }, [browserNotificationsEnabled]);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Dismiss notification
  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Add new notification (mock SSE)
  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
    playSound();
    showBrowserNotification(notification.title, notification.message);
  }, [playSound, showBrowserNotification]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance to add a new notification every 30 seconds
      if (Math.random() < 0.1) {
        const types: Notification["type"][] = ["deal", "agent", "system", "mention"];
        const type = types[Math.floor(Math.random() * types.length)];
        addNotification({
          type,
          title: type === "deal" ? "New Deal Activity" : type === "agent" ? "Agent Update" : "Notification",
          message: "You have a new notification",
          read: false,
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    hasNewNotifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    addNotification,
    soundEnabled,
    setSoundEnabled,
    browserNotificationsEnabled,
    requestBrowserPermission,
  };
}
