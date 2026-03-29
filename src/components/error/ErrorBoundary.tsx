/**
 * ErrorBoundary Component
 * =======================
 * React error boundary class component that catches JavaScript errors
 * anywhere in its child component tree, logs those errors, and displays
 * a fallback UI instead of the component tree that crashed.
 */

"use client";

import React from "react";

interface ErrorBoundaryProps {
  /** ReactNode to render when an error occurs */
  fallback: React.ReactNode;
  /** Child components to be wrapped by the error boundary */
  children: React.ReactNode;
  /** Optional callback when an error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Optional callback when the user requests a retry */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean;
  /** The error that was caught */
  error?: Error;
  /** Additional error info from React */
  errorInfo?: React.ErrorInfo;
}

/**
 * ErrorBoundary is a React class component that catches errors in its child
 * component tree. It must be a class component because error boundaries
 * require lifecycle methods not available in function components.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<ErrorFallback onRetry={() => {}} />}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Update state so the next render will show the fallback UI.
   * This is a static method called during the render phase.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * Called after an error has been caught. Use for logging and side effects.
   * This runs in the commit phase, so side effects are allowed here.
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Update state with error details
    this.setState({ errorInfo });

    // Log error to console
    console.error("ErrorBoundary caught an error:", error);
    console.error("Component stack:", errorInfo.componentStack);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Log to external service in production
    if (process.env.NODE_ENV === "production") {
      this.logErrorToService(error, errorInfo);
    }
  }

  /**
   * Log error to external error tracking service.
   * Replace this with your preferred service (Sentry, LogRocket, etc.)
   */
  private logErrorToService(error: Error, errorInfo: React.ErrorInfo) {
    // Example integration points:
    // Sentry.captureException(error, { extra: errorInfo });
    // LogRocket.captureException(error);
    
    // For now, just log to console with structured format
    console.error("[Error Tracking]", {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof window !== "undefined" ? navigator.userAgent : "",
    });
  }

  /**
   * Reset the error state and optionally call the onReset callback.
   * This allows users to retry rendering the component tree.
   */
  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      // Clone the fallback element and inject reset handler if it's a valid element
      if (React.isValidElement(this.props.fallback)) {
        return React.cloneElement(this.props.fallback as React.ReactElement, {
          onRetry: this.handleReset,
          error: this.state.error,
        });
      }
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
