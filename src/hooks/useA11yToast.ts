/**
 * useA11yToast Hook
 * =================
 * An accessible wrapper around useToast that integrates screen reader announcements.
 * Automatically announces toast messages to screen readers when notifications are shown.
 * 
 * @accessibility
 * - Automatically announces success messages (polite)
 * - Announces error messages with assertive priority
 * - Announces loading states for async operations
 * - Integrates with AnnouncerProvider for live region announcements
 * 
 * @usage
 * Use this hook instead of useToast when you want screen reader announcements.
 * It provides the same API as useToast with added accessibility features.
 * 
 * @example
 * ```tsx
 * // In your component
 * const { success, error, loading, promise } = useA11yToast();
 * 
 * // Success - announced politely
 * success("Deal created", "The deal was saved successfully");
 * 
 * // Error - announced assertively
 * error("Failed to save", "Please check your connection and try again");
 * 
 * // Loading - announced politely
 * const loadingId = loading("Saving deal...");
 * 
 * // Promise - announces loading, then success or error
 * await promise(
 *   saveDeal(data),
 *   {
 *     loading: "Saving deal...",
 *     success: "Deal saved successfully",
 *     error: "Failed to save deal"
 *   }
 * );
 * ```
 */

import * as React from "react";
import { useToast, type UseToastOptions, type ToastOptions, type PromiseToastMessages } from "./useToast";
import { useAnnouncer } from "@/components/a11y/ScreenReaderAnnouncer";
import type { ToastAction } from "@/components/toast/Toast";

// =============================================================================
// Types
// =============================================================================

export interface A11yToastAPI {
  /** Show a success toast and announce to screen readers */
  success: (title: string, message?: string, options?: ToastOptions) => string;
  /** Show an error toast and announce assertively to screen readers */
  error: (title: string, message?: string, options?: ToastOptions) => string;
  /** Show a warning toast and announce to screen readers */
  warning: (title: string, message?: string, options?: ToastOptions) => string;
  /** Show an info toast and announce to screen readers */
  info: (title: string, message?: string, options?: ToastOptions) => string;
  /** Show a loading toast and announce to screen readers */
  loading: (title: string, message?: string, options?: ToastOptions) => string;
  /** Show a toast with an action button and announce to screen readers */
  action: (
    title: string,
    action: ToastAction,
    message?: string,
    options?: ToastOptions
  ) => string;
  /** Track a promise with loading/success/error toasts and announcements */
  promise: <T>(
    promise: Promise<T>,
    messages: PromiseToastMessages<T>,
    options?: ToastOptions
  ) => Promise<T>;
  /** Remove a toast by ID */
  remove: (id: string) => void;
  /** Update an existing toast */
  update: (id: string, updates: Partial<{ type: string; title: string; message?: string; duration?: number }>) => void;
  /** Remove all toasts */
  clear: () => void;
  /** Create a custom toast with announcement */
  custom: (toast: { type: string; title: string; message?: string; duration?: number }) => string;
}

// =============================================================================
// Hook
// =============================================================================

export function useA11yToast(defaultOptions?: UseToastOptions): A11yToastAPI {
  const toast = useToast(defaultOptions);
  
  // Try to get announcer, but don't fail if not in provider
  let announce: ((message: string, priority?: "polite" | "assertive") => void) | null = null;
  try {
    const announcer = useAnnouncer();
    announce = announcer.announce;
  } catch {
    // Announcer not available, will fall back to console
  }

  /**
   * Announce message to screen readers
   */
  const announceMessage = React.useCallback(
    (message: string, priority: "polite" | "assertive" = "polite"): void => {
      if (announce) {
        announce(message, priority);
      } else if (typeof window !== "undefined" && (window as typeof window & { announce?: typeof announce }).announce) {
        // Fallback to global window.announce if available
        (window as typeof window & { announce: typeof announce }).announce(message, priority);
      }
    },
    [announce]
  );

  /**
   * Show success toast with announcement
   */
  const success = React.useCallback(
    (title: string, message?: string, options?: ToastOptions): string => {
      const id = toast.success(title, message, options);
      announceMessage(`${title}${message ? `. ${message}` : ""}`, "polite");
      return id;
    },
    [toast, announceMessage]
  );

  /**
   * Show error toast with assertive announcement
   */
  const error = React.useCallback(
    (title: string, message?: string, options?: ToastOptions): string => {
      const id = toast.error(title, message, options);
      announceMessage(`Error: ${title}${message ? `. ${message}` : ""}`, "assertive");
      return id;
    },
    [toast, announceMessage]
  );

  /**
   * Show warning toast with announcement
   */
  const warning = React.useCallback(
    (title: string, message?: string, options?: ToastOptions): string => {
      const id = toast.warning(title, message, options);
      announceMessage(`Warning: ${title}${message ? `. ${message}` : ""}`, "polite");
      return id;
    },
    [toast, announceMessage]
  );

  /**
   * Show info toast with announcement
   */
  const info = React.useCallback(
    (title: string, message?: string, options?: ToastOptions): string => {
      const id = toast.info(title, message, options);
      announceMessage(`${title}${message ? `. ${message}` : ""}`, "polite");
      return id;
    },
    [toast, announceMessage]
  );

  /**
   * Show loading toast with announcement
   */
  const loading = React.useCallback(
    (title: string, message?: string, options?: ToastOptions): string => {
      const id = toast.loading(title, message, options);
      announceMessage(`${title}${message ? `. ${message}` : ""}`, "polite");
      return id;
    },
    [toast, announceMessage]
  );

  /**
   * Show action toast with announcement
   */
  const action = React.useCallback(
    (
      title: string,
      actionConfig: ToastAction,
      message?: string,
      options?: ToastOptions
    ): string => {
      const id = toast.action(title, actionConfig, message, options);
      announceMessage(`${title}${message ? `. ${message}` : ""}. Action available: ${actionConfig.label}`, "polite");
      return id;
    },
    [toast, announceMessage]
  );

  /**
   * Track a promise with announcements
   */
  const promise = React.useCallback(
    async <T,>(
      promise: Promise<T>,
      messages: PromiseToastMessages<T>,
      options?: ToastOptions
    ): Promise<T> => {
      // Announce loading
      announceMessage(
        typeof messages.loading === "string" ? messages.loading : "Loading...",
        "polite"
      );

      try {
        const result = await toast.promise(promise, messages, options);
        
        // Announce success
        const successMessage =
          typeof messages.success === "function"
            ? messages.success(result)
            : messages.success;
        announceMessage(successMessage, "polite");
        
        return result;
      } catch (err) {
        // Announce error
        const errorMessage =
          typeof messages.error === "function"
            ? messages.error(err as Error)
            : messages.error;
        announceMessage(`Error: ${errorMessage}`, "assertive");
        
        throw err;
      }
    },
    [toast, announceMessage]
  );

  /**
   * Custom toast with type-based announcement
   */
  const custom = React.useCallback(
    (toastConfig: { type: string; title: string; message?: string; duration?: number }): string => {
      const id = toast.custom(toastConfig);
      
      const priority = toastConfig.type === "error" ? "assertive" : "polite";
      const prefix = toastConfig.type === "error" ? "Error: " : "";
      announceMessage(
        `${prefix}${toastConfig.title}${toastConfig.message ? `. ${toastConfig.message}` : ""}`,
        priority
      );
      
      return id;
    },
    [toast, announceMessage]
  );

  return {
    success,
    error,
    warning,
    info,
    loading,
    action,
    promise,
    remove: toast.remove,
    update: toast.update,
    clear: toast.clear,
    custom,
  };
}

export default useA11yToast;
