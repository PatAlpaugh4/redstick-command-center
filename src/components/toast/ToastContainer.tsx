/**
 * ToastContainer Component
 * ========================
 * Positions toast notifications on screen with stack management
 * and z-index handling. Supports multiple positions.
 */

"use client";

import * as React from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Toast, type ToastProps } from "./Toast";

// =============================================================================
// Types
// =============================================================================

export type ToastPosition =
  | "top-right"
  | "top-center"
  | "top-left"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left";

export interface ToastContainerProps {
  /** Array of toast items to display */
  toasts: Array<ToastProps>;
  /** Position of the toast container on screen */
  position?: ToastPosition;
  /** Maximum number of toasts to show at once */
  maxToasts?: number;
  /** Whether to reverse the order (newest first) */
  newestOnTop?: boolean;
  /** Callback to dismiss a toast */
  onDismiss: (id: string) => void;
  /** Gap between toasts */
  gap?: number;
  /** Optional className for styling */
  className?: string;
}

// =============================================================================
// Position Styles
// =============================================================================

const positionStyles: Record<ToastPosition, string> = {
  "top-right": "top-0 right-0 flex-col",
  "top-center": "top-0 left-1/2 -translate-x-1/2 flex-col",
  "top-left": "top-0 left-0 flex-col",
  "bottom-right": "bottom-0 right-0 flex-col-reverse",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 flex-col-reverse",
  "bottom-left": "bottom-0 left-0 flex-col-reverse",
};

// =============================================================================
// ToastContainer Component
// =============================================================================

export function ToastContainer({
  toasts,
  position = "top-right",
  maxToasts = 5,
  newestOnTop = true,
  onDismiss,
  gap = 12,
  className,
}: ToastContainerProps) {
  // Limit the number of visible toasts
  const visibleToasts = React.useMemo(() => {
    const limited = toasts.slice(-maxToasts);
    return newestOnTop ? [...limited].reverse() : limited;
  }, [toasts, maxToasts, newestOnTop]);

  // Calculate if position is at bottom (for margin adjustments)
  const isBottomPosition = position.startsWith("bottom");

  return (
    <div
      className={cn(
        "fixed z-[9999] flex p-4 pointer-events-none",
        positionStyles[position],
        className
      )}
      style={{
        gap: `${gap}px`,
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="popLayout">
        {visibleToasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
            style={{
              // Add margin to prevent overlapping with edge when many toasts
              marginTop: isBottomPosition && index > 0 ? undefined : 0,
              marginBottom: !isBottomPosition && index > 0 ? undefined : 0,
            }}
          >
            <Toast {...toast} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// Multiple Position Container
// =============================================================================

export interface MultiPositionToastContainerProps {
  /** Map of position to toast items */
  toastsByPosition: Record<ToastPosition, Array<ToastProps>>;
  /** Default position for toasts without a position specified */
  defaultPosition?: ToastPosition;
  /** Maximum number of toasts per position */
  maxToastsPerPosition?: number;
  /** Whether to reverse the order (newest first) */
  newestOnTop?: boolean;
  /** Callback to dismiss a toast */
  onDismiss: (id: string) => void;
  /** Gap between toasts */
  gap?: number;
}

/**
 * Container that can handle toasts at multiple positions simultaneously.
 * Useful when you want to show different types of notifications in different locations.
 */
export function MultiPositionToastContainer({
  toastsByPosition,
  defaultPosition = "top-right",
  maxToastsPerPosition = 5,
  newestOnTop = true,
  onDismiss,
  gap = 12,
}: MultiPositionToastContainerProps) {
  const positions = Object.keys(toastsByPosition) as ToastPosition[];

  return (
    <>
      {positions.map((position) => (
        <ToastContainer
          key={position}
          toasts={toastsByPosition[position] || []}
          position={position}
          maxToasts={maxToastsPerPosition}
          newestOnTop={newestOnTop}
          onDismiss={onDismiss}
          gap={gap}
        />
      ))}
    </>
  );
}

export default ToastContainer;
