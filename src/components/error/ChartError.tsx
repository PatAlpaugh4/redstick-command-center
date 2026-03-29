/**
 * Chart Error Component
 * =====================
 * Error fallback specifically designed for chart components.
 * Provides a compact error display with retry functionality.
 */

"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartErrorProps {
  /** Error message to display */
  message?: string;
  /** Callback when user clicks retry */
  onRetry?: () => void;
  /** Custom className */
  className?: string;
  /** Error object if available */
  error?: Error;
}

/**
 * ChartError provides a minimal error display suitable for chart containers.
 * Displays within the chart area to maintain layout stability.
 */
export const ChartError: React.FC<ChartErrorProps> = ({
  message = "Failed to load chart data",
  onRetry,
  className,
  error,
}) => {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    setIsRetrying(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onRetry();
    setIsRetrying(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "h-[280px] rounded-xl",
        "bg-red-500/5 border border-red-500/20",
        "p-6 text-center",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>
      
      <h4 className="text-sm font-medium text-white mb-1">
        Chart Error
      </h4>
      
      <p className="text-xs text-[#a0a0b0] mb-4 max-w-[200px]">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg",
            "text-xs font-medium text-red-400",
            "bg-red-500/10 hover:bg-red-500/20",
            "transition-colors disabled:opacity-50"
          )}
        >
          <RefreshCw 
            className={cn("w-3.5 h-3.5", isRetrying && "animate-spin")} 
          />
          {isRetrying ? "Retrying..." : "Try Again"}
        </button>
      )}
    </div>
  );
};

export default ChartError;
