/**
 * Error Page
 * ==========
 * Root error page for Next.js App Router.
 * Automatically wraps route segments and catches errors.
 * 
 * This file must be a Client Component because error boundaries
 * in React must be able to handle JavaScript errors, which requires
 * client-side JavaScript.
 */

"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ErrorPageProps {
  /** The error that was thrown */
  error: Error & { digest?: string };
  /** Function to reset the error boundary and attempt to recover */
  reset: () => void;
}

/**
 * ErrorPage is the default error UI for the app router.
 * It catches errors in nested routes and provides recovery options.
 * 
 * This component is rendered when:
 * - A server component throws an error
 * - A client component throws an error during rendering
 * - A data fetching error occurs
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  // Log error details for debugging
  useEffect(() => {
    // Log to console
    console.error("Route Error:", error);
    
    // Log to external service in production
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error);
      // Example: LogRocket.captureException(error);
      
      console.error("[Error Tracking] Route Error:", {
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl"
      >
        {/* Error Card */}
        <div className="bg-[#1a1a2e] border border-red-500/30 rounded-2xl p-8 md:p-12 text-center">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center"
          >
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </motion.div>

          {/* Error Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <span className="text-6xl font-bold text-red-500/20">Error</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Something went wrong
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-[#a0a0b0] text-lg mb-8 max-w-md mx-auto leading-relaxed"
          >
            We encountered an unexpected error while loading this page. 
            Please try again or return to the dashboard.
          </motion.p>

          {/* Error Message (Development) */}
          {process.env.NODE_ENV === "development" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="bg-[#0f0f1a] rounded-lg p-4 mb-8 text-left border border-red-500/20"
            >
              <p className="text-red-400 text-sm font-mono mb-2">Error Details (Development Only):</p>
              <p className="text-red-300/80 text-sm font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-[#6a6a7a] text-xs font-mono mt-2">
                  Digest: {error.digest}
                </p>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Try Again Button */}
            <button
              onClick={reset}
              className="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-[#e94560] hover:bg-[#d63d56] transition-all hover:shadow-lg hover:shadow-[#e94560]/25 focus:outline-none focus:ring-2 focus:ring-[#e94560]/50"
            >
              <RefreshCw className="w-5 h-5 group-hover:animate-spin" />
              Try Again
            </button>

            {/* Go Home Button */}
            <Link
              href="/app"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-[#2a2a3e] hover:bg-[#3a3a4e] border border-white/10 hover:border-white/20 transition-all"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </Link>
          </motion.div>

          {/* Go Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-[#6a6a7a] hover:text-[#e94560] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </motion.div>
        </div>

        {/* Support Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-[#6a6a7a] text-sm">
            If this problem persists, please{" "}
            <a
              href="mailto:support@redstick.vc"
              className="text-[#e94560] hover:text-[#ff6b6b] transition-colors"
            >
              contact our support team
            </a>
            {" "}or{" "}
            <a
              href="https://status.redstick.vc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e94560] hover:text-[#ff6b6b] transition-colors"
            >
              check system status
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
