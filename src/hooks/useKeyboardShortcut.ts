/**
 * useKeyboardShortcut Hook
 * ========================
 * Registers global keyboard shortcuts with support for modifier keys.
 * Handles key combinations like Ctrl+K, Cmd+S, etc.
 */

"use client";

import { useEffect, useRef, useCallback } from "react";

export interface KeyboardShortcutOptions {
  /** Whether the shortcut is enabled */
  enabled?: boolean;
  /** Require Ctrl key */
  ctrl?: boolean;
  /** Require Shift key */
  shift?: boolean;
  /** Require Alt/Option key */
  alt?: boolean;
  /** Require Meta/Cmd key */
  meta?: boolean;
  /** Prevent default browser behavior */
  preventDefault?: boolean;
  /** Stop event propagation */
  stopPropagation?: boolean;
  /** Target element (default: document) */
  target?: HTMLElement | Document | null;
  /** Only trigger when target element is focused */
  targetOnly?: boolean;
  /** Allow when user is typing in input/textarea */
  allowInInput?: boolean;
  /** Debounce delay in ms */
  debounce?: number;
  /** Throttle delay in ms */
  throttle?: number;
}

export type KeyboardShortcutHandler = (e: KeyboardEvent) => void;

// Track registered shortcuts for help display
const registeredShortcuts = new Map<string, { description: string; shortcut: string }>();

/**
 * Register a keyboard shortcut
 * @param key - Key to listen for (e.g., 'k', 'Escape', 'F1')
 * @param callback - Function to call when shortcut is triggered
 * @param options - Shortcut configuration options
 */
export function useKeyboardShortcut(
  key: string | string[],
  callback: KeyboardShortcutHandler,
  options: KeyboardShortcutOptions = {}
): void {
  const {
    enabled = true,
    ctrl = false,
    shift = false,
    alt = false,
    meta = false,
    preventDefault = true,
    stopPropagation = false,
    target = typeof document !== "undefined" ? document : null,
    targetOnly = false,
    allowInInput = false,
    debounce = 0,
    throttle = 0,
  } = options;

  const callbackRef = useRef(callback);
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  /**
   * Check if the user is currently typing in an input element
   */
  const isTyping = useCallback((): boolean => {
    const activeElement = document.activeElement;
    if (!activeElement) return false;

    const tagName = activeElement.tagName.toLowerCase();
    const isContentEditable = activeElement.getAttribute("contenteditable") === "true";

    return (
      tagName === "input" ||
      tagName === "textarea" ||
      tagName === "select" ||
      isContentEditable
    );
  }, []);

  /**
   * Check if the shortcut matches the keyboard event
   */
  const matchesShortcut = useCallback(
    (e: KeyboardEvent, shortcutKey: string): boolean => {
      const keyMatches = e.key.toLowerCase() === shortcutKey.toLowerCase();
      const ctrlMatches = ctrl === e.ctrlKey;
      const shiftMatches = shift === e.shiftKey;
      const altMatches = alt === e.altKey;
      const metaMatches = meta === e.metaKey;

      return keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches;
    },
    [ctrl, shift, alt, meta]
  );

  /**
   * Execute callback with debounce/throttle
   */
  const executeCallback = useCallback(
    (e: KeyboardEvent) => {
      const now = Date.now();

      // Throttle
      if (throttle > 0 && now - lastCallRef.current < throttle) {
        return;
      }

      // Debounce
      if (debounce > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callbackRef.current(e);
        }, debounce);
        return;
      }

      lastCallRef.current = now;
      callbackRef.current(e);
    },
    [debounce, throttle]
  );

  /**
   * Handle keyboard event
   */
  const handleKeyDown = useCallback(
    (e: Event) => {
      if (!enabled) return;

      const keyboardEvent = e as KeyboardEvent;
      const keys = Array.isArray(key) ? key : [key];

      for (const shortcutKey of keys) {
        if (matchesShortcut(keyboardEvent, shortcutKey)) {
          // Check if user is typing
          if (isTyping() && !allowInInput) {
            return;
          }

          // Check target if targetOnly is set
          if (targetOnly && target instanceof HTMLElement) {
            if (document.activeElement !== target) {
              return;
            }
          }

          if (preventDefault) {
            keyboardEvent.preventDefault();
          }
          if (stopPropagation) {
            keyboardEvent.stopPropagation();
          }

          executeCallback(keyboardEvent);
          return;
        }
      }
    },
    [enabled, key, matchesShortcut, isTyping, allowInInput, targetOnly, target, preventDefault, stopPropagation, executeCallback]
  );

  // Attach event listener
  useEffect(() => {
    if (!target || !enabled) return;

    target.addEventListener("keydown", handleKeyDown);
    return () => {
      target.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [target, enabled, handleKeyDown]);
}

/**
 * Hook for multiple keyboard shortcuts
 */
export interface ShortcutConfig {
  key: string | string[];
  callback: KeyboardShortcutHandler;
  options?: KeyboardShortcutOptions;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]): void {
  shortcuts.forEach(({ key, callback, options }) => {
    useKeyboardShortcut(key, callback, options);
  });
}

/**
 * Common keyboard shortcut presets
 */
export const KeyboardShortcuts = {
  // Search
  search: { key: "k", ctrl: true, meta: true },
  // Navigation
  navigateNext: { key: "ArrowDown" },
  navigatePrevious: { key: "ArrowUp" },
  navigateFirst: { key: "Home" },
  navigateLast: { key: "End" },
  // Actions
  save: { key: "s", ctrl: true, meta: true },
  create: { key: "n", ctrl: true, meta: true },
  edit: { key: "e", ctrl: true, meta: true },
  delete: { key: "Delete" },
  // General
  escape: { key: "Escape" },
  enter: { key: "Enter" },
  selectAll: { key: "a", ctrl: true, meta: true },
  undo: { key: "z", ctrl: true, meta: true },
  redo: { key: "y", ctrl: true, meta: true },
  help: { key: "?", shift: true },
  // Modal
  closeModal: { key: "Escape" },
} as const;

/**
 * Register a shortcut for help documentation
 */
export function registerShortcut(
  id: string,
  shortcut: string,
  description: string
): void {
  registeredShortcuts.set(id, { shortcut, description });
}

/**
 * Get all registered shortcuts
 */
export function getRegisteredShortcuts(): Map<
  string,
  { description: string; shortcut: string }
> {
  return new Map(registeredShortcuts);
}

/**
 * Unregister a shortcut
 */
export function unregisterShortcut(id: string): void {
  registeredShortcuts.delete(id);
}

export default useKeyboardShortcut;
