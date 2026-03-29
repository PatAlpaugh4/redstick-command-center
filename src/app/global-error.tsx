/**
 * Global Error Page
 * =================
 * Handles critical errors that occur at the root layout level.
 * Unlike error.tsx, this component wraps the entire application
 * including the HTML document itself.
 * 
 * This is a last-resort error boundary for:
 * - Root layout rendering errors
 * - Critical initialization failures
 * - Complete application crashes
 */

"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface GlobalErrorProps {
  /** The error that was thrown */
  error: Error & { digest?: string };
  /** Function to reset the error boundary */
  reset: () => void;
}

/**
 * GlobalError is rendered when a critical error occurs that prevents
 * the application from rendering at all. It includes its own HTML
 * structure since the error might have occurred in the root layout.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Critical error logging
    console.error("Critical Application Error:", error);

    // Always log to external service for global errors
    if (typeof window !== "undefined") {
      // Example: Sentry.captureException(error);
      // Example: LogRocket.captureException(error);
      
      console.error("[Critical Error Tracking]", {
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        critical: true,
      });
    }
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Critical Error | Redstick Ventures</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: #0f0f1a;
            color: #ffffff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
          }
          
          .error-container {
            max-width: 600px;
            width: 100%;
            text-align: center;
          }
          
          .error-card {
            background: #1a1a2e;
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 24px;
            padding: 48px 32px;
            margin-bottom: 24px;
          }
          
          .error-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            background: rgba(239, 68, 68, 0.1);
            border: 2px solid rgba(239, 68, 68, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .error-icon svg {
            width: 40px;
            height: 40px;
            color: #ef4444;
          }
          
          .error-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 16px;
            color: #ffffff;
          }
          
          .error-description {
            font-size: 16px;
            line-height: 1.6;
            color: #a0a0b0;
            margin-bottom: 32px;
          }
          
          .error-details {
            background: #0f0f1a;
            border: 1px solid rgba(239, 68, 68, 0.2);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 32px;
            text-align: left;
            overflow-x: auto;
          }
          
          .error-details-label {
            font-size: 12px;
            color: #ef4444;
            font-family: monospace;
            margin-bottom: 8px;
          }
          
          .error-details-message {
            font-size: 13px;
            color: rgba(239, 68, 68, 0.8);
            font-family: monospace;
            word-break: break-all;
          }
          
          .button-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: center;
          }
          
          @media (min-width: 640px) {
            .button-group {
              flex-direction: row;
              justify-content: center;
            }
          }
          
          .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 28px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            border: none;
          }
          
          .btn-primary {
            background: #e94560;
            color: #ffffff;
          }
          
          .btn-primary:hover {
            background: #d63d56;
          }
          
          .btn-secondary {
            background: #2a2a3e;
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .btn-secondary:hover {
            background: #3a3a4e;
            border-color: rgba(255, 255, 255, 0.2);
          }
          
          .support-text {
            font-size: 14px;
            color: #6a6a7a;
          }
          
          .support-text a {
            color: #e94560;
            text-decoration: none;
          }
          
          .support-text a:hover {
            color: #ff6b6b;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </head>
      <body>
        <div className="error-container">
          <div className="error-card">
            {/* Error Icon */}
            <div className="error-icon">
              <AlertTriangle />
            </div>

            {/* Title */}
            <h1 className="error-title">Critical Error</h1>

            {/* Description */}
            <p className="error-description">
              A critical error has occurred that prevents the application from loading. 
              This may be due to a server issue or a problem with your connection.
            </p>

            {/* Error Details (Development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="error-details">
                <div className="error-details-label">Error Details (Development Only):</div>
                <div className="error-details-message">{error.message}</div>
                {error.digest && (
                  <div className="error-details-message" style={{ marginTop: 8, opacity: 0.7 }}>
                    Digest: {error.digest}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="button-group">
              <button onClick={reset} className="btn btn-primary">
                <RefreshCw style={{ width: 20, height: 20 }} />
                Reload Application
              </button>
              <a href="/" className="btn btn-secondary">
                <Home style={{ width: 20, height: 20 }} />
                Go to Home
              </a>
            </div>
          </div>

          {/* Support Text */}
          <p className="support-text">
            If the problem persists, please{" "}
            <a href="mailto:support@redstick.vc">contact support</a>
            {" "}or{" "}
            <a href="https://status.redstick.vc" target="_blank" rel="noopener noreferrer">
              check system status
            </a>
          </p>
        </div>

        {/* Inline script for immediate retry on key press */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Allow pressing 'R' to retry
            document.addEventListener('keydown', function(e) {
              if (e.key === 'r' || e.key === 'R') {
                if (e.ctrlKey || e.metaKey) {
                  e.preventDefault();
                  window.location.reload();
                }
              }
            });
            
            // Log that the global error page loaded
            console.error('[GlobalError] Critical error page loaded');
          `
        }} />
      </body>
    </html>
  );
}
