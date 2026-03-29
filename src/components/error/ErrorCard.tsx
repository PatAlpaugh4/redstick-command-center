/**
 * ErrorCard Component
 * ===================
 * Compact error display for inline errors within cards, charts,
 * and other contained components. Features a mini retry button
 * and minimal design for limited spaces.
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  RefreshCw,
  X,
  WifiOff,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorCardProps {
  /** Error message to display */
  message: string;
  /** Optional callback when user clicks retry */
  onRetry?: () => void;
  /** Optional callback to dismiss the error */
  onDismiss?: () => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Visual variant */
  variant?: "error" | "warning" | "info";
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the icon */
  showIcon?: boolean;
  /** Custom icon override */
  icon?: React.ReactNode;
  /** Whether retry is loading */
  retrying?: boolean;
  /** Optional title */
  title?: string;
}

/**
 * ErrorCard provides a compact error display suitable for embedding
 * within cards, charts, tables, and other constrained spaces.
 * 
 * @example
 * ```tsx
 * <ErrorCard 
 *   message="Failed to load chart data" 
 *   onRetry={() => refetch()}
 *   size="sm"
 * />
 * ```
 */
export const ErrorCard: React.FC<ErrorCardProps> = ({
  message,
  onRetry,
  onDismiss,
  size = "md",
  variant = "error",
  className,
  showIcon = true,
  icon,
  retrying = false,
  title,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onRetry();
    setIsRetrying(false);
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      padding: "p-3",
      iconSize: "w-4 h-4",
      iconContainer: "w-8 h-8",
      textSize: "text-xs",
      titleSize: "text-sm",
    },
    md: {
      padding: "p-4",
      iconSize: "w-5 h-5",
      iconContainer: "w-10 h-10",
      textSize: "text-sm",
      titleSize: "text-base",
    },
    lg: {
      padding: "p-6",
      iconSize: "w-6 h-6",
      iconContainer: "w-12 h-12",
      textSize: "text-base",
      titleSize: "text-lg",
    },
  };

  // Variant configurations
  const variantConfig = {
    error: {
      container: "bg-red-500/10 border-red-500/30",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-500",
      button: "bg-red-500/20 hover:bg-red-500/30 text-red-400",
    },
    warning: {
      container: "bg-yellow-500/10 border-yellow-500/30",
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-500",
      button: "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400",
    },
    info: {
      container: "bg-blue-500/10 border-blue-500/30",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-500",
      button: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400",
    },
  };

  // Select icon based on variant
  const DefaultIcon = {
    error: AlertCircle,
    warning: Info,
    info: WifiOff,
  }[variant];

  const config = sizeConfig[size];
  const colors = variantConfig[variant];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-xl border",
        colors.container,
        config.padding,
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {showIcon && (
          <div className={cn(
            "flex-shrink-0 rounded-full flex items-center justify-center",
            colors.iconBg,
            config.iconContainer
          )}>
            {icon || <DefaultIcon className={cn(config.iconSize, colors.iconColor)} />}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn(
              "font-semibold text-white mb-1",
              config.titleSize
            )}>
              {title}
            </h4>
          )}
          <p className={cn(
            "text-[#a0a0b0] leading-relaxed",
            config.textSize
          )}>
            {message}
          </p>

          {/* Actions */}
          {(onRetry || onDismiss) && (
            <div className="flex items-center gap-2 mt-3">
              {onRetry && (
                <button
                  onClick={handleRetry}
                  disabled={isRetrying || retrying}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
                    "text-xs font-medium transition-all",
                    colors.button,
                    (isRetrying || retrying) && "opacity-70 cursor-not-allowed"
                  )}
                >
                  <RefreshCw 
                    className={cn(
                      "w-3.5 h-3.5",
                      (isRetrying || retrying) && "animate-spin"
                    )} 
                  />
                  {isRetrying || retrying ? "Retrying..." : "Retry"}
                </button>
              )}

              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#6a6a7a] hover:text-white hover:bg-white/5 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dismiss Button (inline) */}
        {onDismiss && !onRetry && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded-lg text-[#6a6a7a] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Compact error display for very small spaces (e.g., chart corners)
 */
export const ErrorChip: React.FC<{
  message: string;
  onRetry?: () => void;
  className?: string;
}> = ({ message, onRetry, className }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    setIsRetrying(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onRetry();
    setIsRetrying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg",
        "bg-red-500/10 border border-red-500/30",
        className
      )}
    >
      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
      <span className="text-xs text-red-300 truncate max-w-[200px]">
        {message}
      </span>
      {onRetry && (
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="p-1 rounded hover:bg-red-500/20 transition-colors"
        >
          <RefreshCw className={cn("w-3 h-3 text-red-400", isRetrying && "animate-spin")} />
        </button>
      )}
    </motion.div>
  );
};

/**
 * Skeleton error placeholder for loading error states
 */
export const ErrorSkeleton: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div className={cn(
      "rounded-xl p-4 border border-red-500/20 bg-red-500/5",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-500/10 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-red-500/10 rounded animate-pulse" />
          <div className="h-3 w-1/2 bg-red-500/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ErrorCard;
