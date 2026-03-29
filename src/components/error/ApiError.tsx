/**
 * ApiError Component
 * ==================
 * API-specific error handling component with status code display,
 * friendly error messages per HTTP status, and retry functionality.
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  WifiOff,
  FileSearch,
  AlertCircle,
  ServerCrash,
  RefreshCw,
  ShieldAlert,
  Clock,
  Ban,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiErrorProps {
  /** HTTP status code */
  status: number;
  /** Error message to display */
  message?: string;
  /** Callback when user clicks retry */
  onRetry?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether retry is loading */
  retrying?: boolean;
  /** Custom title override */
  title?: string;
}

/**
 * Maps HTTP status codes to user-friendly error configurations.
 */
const ERROR_CONFIGS: Record<
  number,
  {
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
    bgColor: string;
  }
> = {
  // 4xx Client Errors
  400: {
    icon: AlertCircle,
    title: "Bad Request",
    description: "The request was invalid. Please check your input and try again.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10 border-yellow-500/30",
  },
  401: {
    icon: ShieldAlert,
    title: "Unauthorized",
    description: "Please sign in to access this resource.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10 border-orange-500/30",
  },
  403: {
    icon: Ban,
    title: "Access Denied",
    description: "You don't have permission to access this resource.",
    color: "text-red-500",
    bgColor: "bg-red-500/10 border-red-500/30",
  },
  404: {
    icon: FileSearch,
    title: "Not Found",
    description: "The requested resource could not be found.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 border-blue-500/30",
  },
  408: {
    icon: Clock,
    title: "Request Timeout",
    description: "The request took too long. Please try again.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10 border-yellow-500/30",
  },
  429: {
    icon: Clock,
    title: "Too Many Requests",
    description: "You've made too many requests. Please wait a moment and try again.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 border-purple-500/30",
  },
  // 5xx Server Errors
  500: {
    icon: ServerCrash,
    title: "Server Error",
    description: "An internal server error occurred. Please try again later.",
    color: "text-red-500",
    bgColor: "bg-red-500/10 border-red-500/30",
  },
  502: {
    icon: ServerCrash,
    title: "Bad Gateway",
    description: "The server encountered a temporary error. Please try again.",
    color: "text-red-500",
    bgColor: "bg-red-500/10 border-red-500/30",
  },
  503: {
    icon: ServerCrash,
    title: "Service Unavailable",
    description: "The service is temporarily unavailable. Please try again later.",
    color: "text-red-500",
    bgColor: "bg-red-500/10 border-red-500/30",
  },
  504: {
    icon: Clock,
    title: "Gateway Timeout",
    description: "The server took too long to respond. Please try again.",
    color: "text-red-500",
    bgColor: "bg-red-500/10 border-red-500/30",
  },
};

/**
 * Network error configuration (for when there's no status code)
 */
const NETWORK_ERROR_CONFIG = {
  icon: WifiOff,
  title: "Connection Error",
  description: "Unable to connect to the server. Please check your internet connection.",
  color: "text-red-500",
  bgColor: "bg-red-500/10 border-red-500/30",
};

/**
 * Default error configuration for unknown status codes
 */
const DEFAULT_ERROR_CONFIG = {
  icon: AlertCircle,
  title: "Error Occurred",
  description: "An unexpected error occurred. Please try again.",
  color: "text-red-500",
  bgColor: "bg-red-500/10 border-red-500/30",
};

/**
 * ApiError displays a contextual error message based on HTTP status codes.
 * Provides appropriate icons, colors, and messaging for different error types.
 * 
 * @example
 * ```tsx
 * <ApiError 
 *   status={404} 
 *   message="Deal not found" 
 *   onRetry={() => refetch()}
 * />
 * ```
 */
export const ApiError: React.FC<ApiErrorProps> = ({
  status,
  message,
  onRetry,
  className,
  retrying = false,
  title: customTitle,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  // Get error configuration based on status code
  const config = status 
    ? (ERROR_CONFIGS[status] || DEFAULT_ERROR_CONFIG)
    : NETWORK_ERROR_CONFIG;

  // Use custom title if provided
  const title = customTitle || config.title;

  // Determine if this is a client error (4xx) or server error (5xx)
  const isClientError = status >= 400 && status < 500;
  const isServerError = status >= 500 && status < 600;
  const isNetworkError = !status;

  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onRetry();
    setIsRetrying(false);
  };

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-xl p-6 border",
        config.bgColor,
        className
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Icon */}
        <div className={cn(
          "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
          "bg-white/5"
        )}>
          <Icon className={cn("w-6 h-6", config.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {/* Status Code Badge */}
            {status && (
              <span className={cn(
                "px-2 py-0.5 rounded text-xs font-bold",
                isClientError && "bg-yellow-500/20 text-yellow-400",
                isServerError && "bg-red-500/20 text-red-400",
                isNetworkError && "bg-red-500/20 text-red-400"
              )}>
                {status}
              </span>
            )}
            
            {/* Title */}
            <h3 className="font-semibold text-white">{title}</h3>
          </div>

          {/* Description */}
          <p className="text-[#a0a0b0] text-sm">
            {message || config.description}
          </p>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={handleRetry}
            disabled={isRetrying || retrying}
            className={cn(
              "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-[#e94560] hover:bg-[#d63d56] text-white text-sm font-medium",
              "transition-all focus:outline-none focus:ring-2 focus:ring-[#e94560]/50",
              (isRetrying || retrying) && "opacity-70 cursor-not-allowed"
            )}
          >
            <RefreshCw 
              className={cn(
                "w-4 h-4",
                (isRetrying || retrying) && "animate-spin"
              )} 
            />
            Retry
          </button>
        )}
      </div>

      {/* Additional Info for Client Errors */}
      {isClientError && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-[#6a6a7a] text-xs">
            If this error persists, please verify your request parameters or contact support.
          </p>
        </div>
      )}

      {/* Additional Info for Server Errors */}
      {isServerError && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-[#6a6a7a] text-xs">
            Our team has been notified of this issue. Please try again in a few moments.
          </p>
        </div>
      )}

      {/* Additional Info for Network Errors */}
      {isNetworkError && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <ul className="text-[#6a6a7a] text-xs space-y-1">
            <li>• Check your internet connection</li>
            <li>• Verify your firewall settings</li>
            <li>• Try again in a few moments</li>
          </ul>
        </div>
      )}
    </motion.div>
  );
};

/**
 * Helper function to get a user-friendly error message from an API error
 */
export function getApiErrorMessage(error: any): string {
  if (!error) return "An unknown error occurred";
  
  // Handle HTTP status codes
  if (error.status) {
    const config = ERROR_CONFIGS[error.status];
    if (config) return config.description;
  }
  
  // Handle network errors
  if (error.message?.includes("network") || error.message?.includes("fetch")) {
    return NETWORK_ERROR_CONFIG.description;
  }
  
  // Return the error message or a default
  return error.message || "An unexpected error occurred";
}

/**
 * Helper function to determine if an error is retryable
 */
export function isRetryableError(error: any): boolean {
  if (!error?.status) return true; // Network errors are retryable
  
  // Server errors (5xx) and specific client errors are retryable
  return (
    error.status >= 500 ||
    error.status === 408 || // Request Timeout
    error.status === 429 || // Too Many Requests
    error.status === 0      // Network error
  );
}

export default ApiError;
