/**
 * useFocusTrap Hook
 * =================
 * Traps focus within a container element for modals, dialogs, and dropdowns.
 * Returns focus to the trigger element when deactivated.
 */

"use client";

import { useEffect, useRef, useCallback } from "react";

// Selectors for focusable elements
const FOCUSABLE_SELECTORS = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
  "[contenteditable]",
].join(", ");

interface UseFocusTrapOptions {
  /** Whether the focus trap is active */
  isActive: boolean;
  /** Callback when escape key is pressed */
  onEscape?: () => void;
  /** Whether to focus first element on activation */
  focusFirstOnActivate?: boolean;
  /** Element to return focus to on deactivation */
  returnFocusTo?: HTMLElement | null;
}

interface UseFocusTrapReturn {
  /** Ref to attach to the container element */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Ref to store the previously focused element */
  previousFocusRef: React.RefObject<HTMLElement | null>;
}

/**
 * Hook to trap focus within a container element
 * @param options - Configuration options
 * @returns Object containing refs for the container and previous focus
 */
export function useFocusTrap(
  options: UseFocusTrapOptions
): UseFocusTrapReturn {
  const { isActive, onEscape, focusFirstOnActivate = true } = options;
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);

  // Store the previously focused element when activated
  useEffect(() => {
    if (isActive) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [isActive]);

  // Update focusable elements reference
  const updateFocusableElements = useCallback(() => {
    if (!containerRef.current) return;

    const focusableElements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    ).filter((el) => {
      // Filter out hidden elements
      return el.offsetParent !== null && !el.hasAttribute("aria-hidden");
    });

    firstFocusableRef.current = focusableElements[0] || null;
    lastFocusableRef.current =
      focusableElements[focusableElements.length - 1] || null;
  }, []);

  // Handle tab key navigation
  const handleTabKey = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive || !containerRef.current) return;

      updateFocusableElements();

      const firstFocusable = firstFocusableRef.current;
      const lastFocusable = lastFocusableRef.current;

      // If no focusable elements, prevent tab
      if (!firstFocusable || !lastFocusable) {
        e.preventDefault();
        return;
      }

      const activeElement = document.activeElement;

      // Shift + Tab
      if (e.shiftKey) {
        if (activeElement === firstFocusable || !containerRef.current.contains(activeElement)) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab
        if (activeElement === lastFocusable || !containerRef.current.contains(activeElement)) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    },
    [isActive, updateFocusableElements]
  );

  // Handle escape key
  const handleEscapeKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isActive && onEscape) {
        e.preventDefault();
        e.stopPropagation();
        onEscape();
      }
    },
    [isActive, onEscape]
  );

  // Focus first element when activated
  useEffect(() => {
    if (isActive && focusFirstOnActivate && containerRef.current) {
      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        updateFocusableElements();
        const firstFocusable = firstFocusableRef.current;
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          // If no focusable element, focus the container itself
          containerRef.current?.focus();
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [isActive, focusFirstOnActivate, updateFocusableElements]);

  // Return focus when deactivated
  useEffect(() => {
    return () => {
      if (previousFocusRef.current && document.contains(previousFocusRef.current)) {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        handleTabKey(e);
      } else if (e.key === "Escape") {
        handleEscapeKey(e);
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isActive, handleTabKey, handleEscapeKey]);

  return { containerRef, previousFocusRef };
}

export default useFocusTrap;
