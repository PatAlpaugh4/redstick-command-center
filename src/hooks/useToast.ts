/**
 * useToast Hook
 * =============
 * React hook for using toast notifications. Provides convenient methods
 * for showing success, error, warning, info, and loading toasts, as well
 * as promise-based toast handling.
 */

import * as React from "react";
import { ToastContext, type Toast, type ToastPosition } from "@/components/providers/ToastProvider";
import type { ToastAction } from "@/components/toast/Toast";

// =============================================================================
// Types
// =============================================================================

export interface UseToastOptions {
  /** Default duration for toasts (ms) */
  duration?: number;
  /** Default position for toasts */
  position?: ToastPosition;
}

export interface PromiseToastMessages<T = unknown> {
  /** Message shown while promise is pending */
  loading: string;
  /** Message shown when promise resolves */
  success: string | ((data: T) => string);
  /** Message shown when promise rejects */
  error: string | ((error: Error) => string);
}

export interface ToastAPI {
  /** Show a success toast */
  success: (title: string, message?: string, options?: ToastOptions) => string;
  /** Show an error toast */
  error: (title: string, message?: string, options?: ToastOptions) => string;
  /** Show a warning toast */
  warning: (title: string, message?: string, options?: ToastOptions) => string;
  /** Show an info toast */
  info: (title: string, message?: string, options?: ToastOptions) => string;
  /** Show a loading toast (returns ID for updating) */
  loading: (title: string, message?: string, options?: ToastOptions) => string;
  /** Show a toast with a custom action button */
  action: (
    title: string,
    action: ToastAction,
    message?: string,
    options?: ToastOptions
  ) => string;
  /** Track a promise with loading/success/error toasts */
  promise: <T>(
    promise: Promise<T>,
    messages: PromiseToastMessages<T>,
    options?: ToastOptions
  ) => Promise<T>;
  /** Remove a toast by ID */
  remove: (id: string) => void;
  /** Update an existing toast */
  update: (id: string, updates: Partial<Omit<Toast, "id">>) => void;
  /** Remove all toasts */
  clear: () => void;
  /** Create a toast with custom configuration */
  custom: (toast: Omit<Toast, "id">) => string;
}

export interface ToastOptions {
  /** Duration in milliseconds (0 for no auto-dismiss) */
  duration?: number;
  /** Position on screen */
  position?: ToastPosition;
  /** Action button configuration */
  action?: ToastAction;
}

// =============================================================================
// Hook
// =============================================================================

export function useToast(defaultOptions?: UseToastOptions): ToastAPI {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const { addToast, removeToast, updateToast, clearAll } = context;

  // Merge default options
  const getOptions = React.useCallback(
    (options?: ToastOptions) => ({
      duration: options?.duration ?? defaultOptions?.duration ?? 5000,
      position: options?.position ?? defaultOptions?.position ?? "top-right",
      action: options?.action,
    }),
    [defaultOptions]
  );

  /**
   * Show a success toast
   */
  const success = React.useCallback(
    (title: string, message?: string, options?: ToastOptions): string => {
      const opts = getOptions(options);
      return addToast({
        type: "success",
        title,
        message,
        ...opts,
      });
    },
    [addToast, getOptions]
  );

  /**
   * Show an error toast
   */
  const error = React.useCallback(
    (title: string, message?: string, options?: ToastOptions): string => {
      const opts = getOptions(options);
      return addToast({
        type: "error",
        title,
        message,
        duration: opts.duration === 5000 ? 8000 : opts.duration, // Errors stay longer by default
        position: opts.position,
        action: opts.action,
      });
    },
    [addToast, getOptions]
  );

  /**
   * Show a warning toast
   */
  const warning = React.useCallback(
    (title: string, message?: string, options?: ToastOptions): string => {
      const opts = getOptions(options);
      return addToast({
        type: "warning",
        title,
        message,
        ...opts,
      });
    },
    [addToast, getOptions]
  );

  /**
   * Show an info toast
   */
  const info = React.useCallback(
    (title: string, message?: string, options?: ToastOptions): string => {
      const opts = getOptions(options);
      return addToast({
        type: "info",
        title,
        message,
        ...opts,
      });
    },
    [addToast, getOptions]
  );

  /**
   * Show a loading toast
   */
  const loading = React.useCallback(
    (title: string, message?: string, options?: ToastOptions): string => {
      const opts = getOptions(options);
      return addToast({
        type: "loading",
        title,
        message,
        duration: 0, // Loading toasts don't auto-dismiss
        position: opts.position,
      });
    },
    [addToast, getOptions]
  );

  /**
   * Show a toast with an action button
   */
  const action = React.useCallback(
    (
      title: string,
      actionConfig: ToastAction,
      message?: string,
      options?: ToastOptions
    ): string => {
      const opts = getOptions(options);
      return addToast({
        type: "info",
        title,
        message,
        duration: 0, // Action toasts don't auto-dismiss
        position: opts.position,
        action: actionConfig,
      });
    },
    [addToast, getOptions]
  );

  /**
   * Track a promise with loading/success/error toasts
   */
  const promise = React.useCallback(
    async <T,>(
      promise: Promise<T>,
      messages: PromiseToastMessages<T>,
      options?: ToastOptions
    ): Promise<T> => {
      const opts = getOptions(options);

      // Show loading toast
      const loadingId = addToast({
        type: "loading",
        title: messages.loading,
        duration: 0,
        position: opts.position,
      });

      try {
        const data = await promise;

        // Update to success
        const successMessage =
          typeof messages.success === "function"
            ? messages.success(data)
            : messages.success;

        updateToast(loadingId, {
          type: "success",
          title: successMessage,
          duration: opts.duration,
        });

        return data;
      } catch (err) {
        // Update to error
        const error = err instanceof Error ? err : new Error(String(err));
        const errorMessage =
          typeof messages.error === "function"
            ? messages.error(error)
            : messages.error;

        updateToast(loadingId, {
          type: "error",
          title: errorMessage,
          duration: opts.duration === 5000 ? 8000 : opts.duration,
        });

        throw error;
      }
    },
    [addToast, updateToast, getOptions]
  );

  /**
   * Create a custom toast
   */
  const custom = React.useCallback(
    (toast: Omit<Toast, "id">): string => {
      return addToast(toast);
    },
    [addToast]
  );

  return {
    success,
    error,
    warning,
    info,
    loading,
    action,
    promise,
    remove: removeToast,
    update: updateToast,
    clear: clearAll,
    custom,
  };
}

export default useToast;
