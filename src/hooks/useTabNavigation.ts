/**
 * useTabNavigation Hook
 * =====================
 * Manages tab order within a container, including Shift+Tab handling.
 * Useful for custom components that need controlled tab behavior.
 */

"use client";

import { useCallback, useEffect, useRef } from "react";

export interface UseTabNavigationOptions {
  /** Container element reference */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Whether tab navigation is enabled */
  enabled?: boolean;
  /** Custom tab order (array of element refs or selectors) */
  tabOrder?: (string | React.RefObject<HTMLElement | null>)[];
  /** Callback when tab order wraps */
  onWrap?: (direction: "forward" | "backward") => void;
  /** Whether to wrap around when reaching the end */
  wrap?: boolean;
}

export interface UseTabNavigationReturn {
  /** Navigate to the next tabbable element */
  focusNext: () => void;
  /** Navigate to the previous tabbable element */
  focusPrevious: () => void;
  /** Navigate to a specific element by index */
  focusAtIndex: (index: number) => void;
  /** Get all tabbable elements */
  getTabbableElements: () => HTMLElement[];
  /** Current focused element index */
  getCurrentIndex: () => number;
}

// Default selectors for tabbable elements
const TABBABLE_SELECTORS = [
  'button:not([disabled]):not([tabindex="-1"])',
  'a[href]:not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
  '[contenteditable]:not([contenteditable="false"])',
].join(", ");

/**
 * Hook to manage tab navigation within a container
 * @param options - Configuration options
 * @returns Navigation control functions
 */
export function useTabNavigation(
  options: UseTabNavigationOptions
): UseTabNavigationReturn {
  const { containerRef, enabled = true, tabOrder, wrap = true, onWrap } = options;
  const lastDirectionRef = useRef<"forward" | "backward">("forward");

  /**
   * Get all tabbable elements within the container
   */
  const getTabbableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    // If custom tab order is provided, use it
    if (tabOrder && tabOrder.length > 0) {
      return tabOrder
        .map((selector) => {
          if (typeof selector === "string") {
            return containerRef.current?.querySelector<HTMLElement>(selector);
          }
          return selector.current;
        })
        .filter((el): el is HTMLElement => el !== null);
    }

    // Otherwise, get all tabbable elements
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(TABBABLE_SELECTORS)
    ).filter((el) => {
      // Filter out hidden elements
      return el.offsetParent !== null && isVisible(el);
    });
  }, [containerRef, tabOrder]);

  /**
   * Check if an element is visible
   */
  const isVisible = (element: HTMLElement): boolean => {
    const style = window.getComputedStyle(element);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0"
    );
  };

  /**
   * Get the index of the currently focused element
   */
  const getCurrentIndex = useCallback((): number => {
    const elements = getTabbableElements();
    const activeElement = document.activeElement as HTMLElement;
    return elements.findIndex((el) => el === activeElement);
  }, [getTabbableElements]);

  /**
   * Focus element at a specific index
   */
  const focusAtIndex = useCallback(
    (index: number) => {
      const elements = getTabbableElements();
      if (index >= 0 && index < elements.length) {
        elements[index].focus();
      }
    },
    [getTabbableElements]
  );

  /**
   * Focus the next tabbable element
   */
  const focusNext = useCallback(() => {
    const elements = getTabbableElements();
    if (elements.length === 0) return;

    const currentIndex = getCurrentIndex();
    let nextIndex: number;

    if (currentIndex === -1 || currentIndex === elements.length - 1) {
      // Not focused within container or at last element
      if (wrap) {
        nextIndex = 0;
        onWrap?.("forward");
      } else {
        return; // Don't wrap
      }
    } else {
      nextIndex = currentIndex + 1;
    }

    elements[nextIndex].focus();
    lastDirectionRef.current = "forward";
  }, [getTabbableElements, getCurrentIndex, wrap, onWrap]);

  /**
   * Focus the previous tabbable element
   */
  const focusPrevious = useCallback(() => {
    const elements = getTabbableElements();
    if (elements.length === 0) return;

    const currentIndex = getCurrentIndex();
    let prevIndex: number;

    if (currentIndex === -1 || currentIndex === 0) {
      // Not focused within container or at first element
      if (wrap) {
        prevIndex = elements.length - 1;
        onWrap?.("backward");
      } else {
        return; // Don't wrap
      }
    } else {
      prevIndex = currentIndex - 1;
    }

    elements[prevIndex].focus();
    lastDirectionRef.current = "backward";
  }, [getTabbableElements, getCurrentIndex, wrap, onWrap]);

  /**
   * Handle Tab and Shift+Tab key events
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled || !containerRef.current) return;

      if (e.key === "Tab") {
        const elements = getTabbableElements();
        if (elements.length === 0) return;

        const currentIndex = getCurrentIndex();

        // Check if we're at the boundaries
        if (!e.shiftKey) {
          // Tab forward
          if (currentIndex === elements.length - 1) {
            if (wrap) {
              e.preventDefault();
              focusAtIndex(0);
              onWrap?.("forward");
            }
          } else if (currentIndex === -1) {
            // Focus not in container, focus first
            e.preventDefault();
            focusAtIndex(0);
          }
        } else {
          // Shift+Tab backward
          if (currentIndex === 0) {
            if (wrap) {
              e.preventDefault();
              focusAtIndex(elements.length - 1);
              onWrap?.("backward");
            }
          } else if (currentIndex === -1) {
            // Focus not in container, focus last
            e.preventDefault();
            focusAtIndex(elements.length - 1);
          }
        }
      }
    },
    [enabled, containerRef, getTabbableElements, getCurrentIndex, wrap, focusAtIndex, onWrap]
  );

  // Attach event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    container.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [containerRef, enabled, handleKeyDown]);

  return {
    focusNext,
    focusPrevious,
    focusAtIndex,
    getTabbableElements,
    getCurrentIndex,
  };
}

export default useTabNavigation;
