/**
 * ToastProvider
 * =============
 * Context provider for toast notifications. Manages toast state,
 * provides methods to add, remove, and update toasts.
 */

"use client";

import * as React from "react";
import { ToastContainer, type ToastPosition } from "@/components/toast/ToastContainer";
import type { ToastProps, ToastType, ToastAction } from "@/components/toast/Toast";

// =============================================================================
// Types
// =============================================================================

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: ToastAction;
  position?: ToastPosition;
}

export interface ToastContextType {
  /** Array of active toasts */
  toasts: Toast[];
  /** Add a new toast, returns the toast ID */
  addToast: (toast: Omit<Toast, "id">) => string;
  /** Remove a toast by ID */
  removeToast: (id: string) => void;
  /** Update an existing toast */
  updateToast: (id: string, updates: Partial<Omit<Toast, "id">>) => void;
  /** Remove all toasts */
  clearAll: () => void;
}

// =============================================================================
// Context
// =============================================================================

export const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

// =============================================================================
// Provider Props
// =============================================================================

export interface ToastProviderProps {
  /** React children */
  children: React.ReactNode;
  /** Default position for toasts */
  defaultPosition?: ToastPosition;
  /** Default duration for toasts (ms) */
  defaultDuration?: number;
  /** Maximum number of toasts to show at once */
  maxToasts?: number;
  /** Whether to show newest toasts on top */
  newestOnTop?: boolean;
}

// =============================================================================
// Helper Functions
// =============================================================================

function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// =============================================================================
// ToastProvider Component
// =============================================================================

export function ToastProvider({
  children,
  defaultPosition = "top-right",
  defaultDuration = 5000,
  maxToasts = 5,
  newestOnTop = true,
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  /**
   * Add a new toast notification
   */
  const addToast = React.useCallback(
    (toast: Omit<Toast, "id">): string => {
      const id = generateId();
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration ?? defaultDuration,
        position: toast.position ?? defaultPosition,
      };

      setToasts((prev) => {
        // Remove oldest toast if at max capacity
        const newToasts = [...prev, newToast];
        if (newToasts.length > maxToasts) {
          return newToasts.slice(newToasts.length - maxToasts);
        }
        return newToasts;
      });

      return id;
    },
    [defaultDuration, defaultPosition, maxToasts]
  );

  /**
   * Remove a toast by ID
   */
  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Update an existing toast
   */
  const updateToast = React.useCallback(
    (id: string, updates: Partial<Omit<Toast, "id">>) => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id ? { ...toast, ...updates } : toast
        )
      );
    },
    []
  );

  /**
   * Remove all toasts
   */
  const clearAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
      updateToast,
      clearAll,
    }),
    [toasts, addToast, removeToast, updateToast, clearAll]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        toasts={toasts.map(({ position, ...toast }) => toast)}
        position={defaultPosition}
        maxToasts={maxToasts}
        newestOnTop={newestOnTop}
        onDismiss={removeToast}
      />
    </ToastContext.Provider>
  );
}

export default ToastProvider;
