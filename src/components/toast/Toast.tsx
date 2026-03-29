/**
 * Toast Component
 * ===============
 * Individual toast notification with type-based styling,
 * auto-dismiss progress bar, and action button support.
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Loader2,
} from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { toastVariants, toastVariantsReduced } from "@/lib/animations";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastProps {
  /** Unique identifier for the toast */
  id: string;
  /** Visual type of the toast */
  type: ToastType;
  /** Main title/message */
  title: string;
  /** Optional detailed message */
  message?: string;
  /** Duration in milliseconds before auto-dismiss (0 for no auto-dismiss) */
  duration?: number;
  /** Optional action button */
  action?: ToastAction;
  /** Callback when toast is dismissed */
  onDismiss: (id: string) => void;
  /** Optional className for styling */
  className?: string;
}

// =============================================================================
// Toast Configuration
// =============================================================================

const toastConfig: Record<
  ToastType,
  {
    icon: React.ElementType;
    bgColor: string;
    borderColor: string;
    iconColor: string;
    progressColor: string;
  }
> = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-emerald-500/10",
    borderColor: "border-l-emerald-500",
    iconColor: "text-emerald-500",
    progressColor: "bg-emerald-500",
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-500/10",
    borderColor: "border-l-red-500",
    iconColor: "text-red-500",
    progressColor: "bg-red-500",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-500/10",
    borderColor: "border-l-amber-500",
    iconColor: "text-amber-500",
    progressColor: "bg-amber-500",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-500/10",
    borderColor: "border-l-blue-500",
    iconColor: "text-blue-500",
    progressColor: "bg-blue-500",
  },
  loading: {
    icon: Loader2,
    bgColor: "bg-purple-500/10",
    borderColor: "border-l-purple-500",
    iconColor: "text-purple-500",
    progressColor: "bg-purple-500",
  },
};

// =============================================================================
// Toast Component
// =============================================================================

export function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  action,
  onDismiss,
  className,
}: ToastProps) {
  const [progress, setProgress] = React.useState(100);
  const [isPaused, setIsPaused] = React.useState(false);
  const config = toastConfig[type];
  const Icon = config.icon;
  const prefersReducedMotion = useReducedMotion();

  // Auto-dismiss logic with progress bar
  React.useEffect(() => {
    if (type === "loading" || duration === 0) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      if (isPaused) return;

      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / duration) * 100;

      setProgress(newProgress);

      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      } else {
        onDismiss(id);
      }
    };

    const animationFrame = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrame);
  }, [id, duration, onDismiss, type, isPaused]);

  const handleDismiss = React.useCallback(() => {
    onDismiss(id);
  }, [id, onDismiss]);

  const handleActionClick = React.useCallback(() => {
    action?.onClick();
    handleDismiss();
  }, [action, handleDismiss]);

  // Select variants based on reduced motion preference
  const variants = prefersReducedMotion ? toastVariantsReduced : toastVariants;

  return (
    <motion.div
      layout
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        "relative w-full max-w-sm overflow-hidden rounded-lg border border-white/10",
        "bg-[#1a1a2e] backdrop-blur-sm shadow-xl",
        "border-l-4",
        config.borderColor,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Background tint */}
      <div className={cn("absolute inset-0 opacity-50", config.bgColor)} />

      {/* Content */}
      <div className="relative flex items-start gap-3 p-4">
        {/* Icon */}
        <div className={cn("flex-shrink-0 mt-0.5", config.iconColor)}>
          <Icon
            className={cn("w-5 h-5", type === "loading" && !prefersReducedMotion && "animate-spin")}
          />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{title}</p>
          {message && (
            <p className="mt-1 text-sm text-[#a0a0b0] line-clamp-3">{message}</p>
          )}

          {/* Action Button */}
          {action && (
            <button
              onClick={handleActionClick}
              className={cn(
                "mt-2 text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
                "bg-white/10 hover:bg-white/20 text-white"
              )}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Close Button */}
        {type !== "loading" && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-md text-[#6a6a7a] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {type !== "loading" && duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          <motion.div
            className={cn("h-full", config.progressColor)}
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default Toast;
