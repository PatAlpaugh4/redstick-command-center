/**
 * ErrorFallback Component
 * =======================
 * Beautiful error UI displayed when an error boundary catches an error.
 * Features error icon, message display, retry button, home link,
 * and collapsible stack trace for development mode.
 */

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  ChevronDown, 
  ChevronUp,
  Bug,
  FileCode,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorFallbackProps {
  /** The error that occurred */
  error?: Error;
  /** Callback when user clicks retry */
  onRetry?: () => void;
  /** Optional custom title */
  title?: string;
  /** Optional custom description */
  description?: string;
  /** Whether to show the home button */
  showHomeButton?: boolean;
  /** Custom home button URL */
  homeUrl?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ErrorFallback displays a user-friendly error message with options
 * to retry or navigate home. Includes a collapsible stack trace
 * visible only in development mode.
 * 
 * @example
 * ```tsx
 * <ErrorFallback 
 *   error={error} 
 *   onRetry={() => window.location.reload()}
 * />
 * ```
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  onRetry,
  title = "Something went wrong",
  description = "We encountered an unexpected error. Please try again or contact support if the problem persists.",
  showHomeButton = true,
  homeUrl = "/",
  className,
}) => {
  const [showStackTrace, setShowStackTrace] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === "development";

  const handleRetry = async () => {
    setIsRetrying(true);
    
    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    onRetry?.();
    setIsRetrying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col items-center justify-center min-h-[400px] p-8",
        className
      )}
    >
      <div className="w-full max-w-lg">
        {/* Error Card */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center"
            role="img"
            aria-label="Error"
          >
            <AlertTriangle className="w-10 h-10 text-red-500" aria-hidden="true" />
          </motion.div>

          {/* Error Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-white mb-3"
          >
            {title}
          </motion.h2>

          {/* Error Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[#a0a0b0] mb-6 leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Error Message (if available) */}
          {error?.message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-[#0f0f1a] rounded-lg p-4 mb-6 border border-red-500/20"
            >
              <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
                <Bug className="w-4 h-4" />
                <span className="font-medium">Error Details</span>
              </div>
              <code className="text-red-300/80 text-sm font-mono break-all">
                {error.message}
              </code>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            {/* Try Again Button */}
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all",
                "bg-[#e94560] hover:bg-[#d63d56] focus:outline-none focus:ring-2 focus:ring-[#e94560]/50",
                isRetrying && "opacity-70 cursor-not-allowed"
              )}
            >
              <RefreshCw 
                className={cn(
                  "w-4 h-4",
                  isRetrying && "animate-spin"
                )} 
                aria-hidden="true"
              />
              {isRetrying ? "Retrying..." : "Try Again"}
            </button>

            {/* Go Home Button */}
            {showHomeButton && (
              <a
                href={homeUrl}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all",
                  "bg-[#2a2a3e] text-white hover:bg-[#3a3a4e]",
                  "border border-white/10 hover:border-white/20"
                )}
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                Go Home
              </a>
            )}
          </motion.div>
        </div>

        {/* Stack Trace (Development Only) */}
        {isDevelopment && error?.stack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4"
          >
            <button
              onClick={() => setShowStackTrace(!showStackTrace)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-lg",
                "bg-[#1a1a2e] border border-white/10 hover:border-white/20",
                "text-[#a0a0b0] text-sm transition-all"
              )}
            >
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4" aria-hidden="true" />
                <span>Stack Trace (Development Only)</span>
              </div>
              {showStackTrace ? (
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            <AnimatePresence>
              {showStackTrace && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 p-4 bg-[#0f0f1a] rounded-lg border border-white/10 overflow-x-auto">
                    <pre className="text-xs text-red-400/80 font-mono whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Support Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6 text-[#6a6a7a] text-sm"
        >
          Need help?{" "}
          <a
            href="mailto:support@example.com"
            className="text-[#e94560] hover:text-[#ff6b6b] transition-colors"
          >
            Contact Support
          </a>
        </motion.p>
      </div>
    </motion.div>
  );
};

export default ErrorFallback;
