/**
 * useArrowKeyNavigation Hook
 * ==========================
 * Provides arrow key navigation for lists, grids, menus, and other collections.
 * Supports horizontal, vertical, and grid layouts.
 */

"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export type ArrowKeyOrientation = "horizontal" | "vertical" | "grid" | "both";

export interface UseArrowKeyNavigationOptions<T> {
  /** Array of items to navigate */
  items: T[];
  /** Layout orientation for navigation */
  orientation: ArrowKeyOrientation;
  /** Number of columns for grid layout */
  columns?: number;
  /** Initial focused index */
  initialIndex?: number;
  /** Callback when an item is selected (Enter/Space) */
  onSelect?: (item: T, index: number) => void;
  /** Callback when focus changes */
  onFocusChange?: (item: T, index: number) => void;
  /** Whether navigation is enabled */
  enabled?: boolean;
  /** Whether to loop around when reaching the end */
  loop?: boolean;
  /** Custom key mappings */
  keyMappings?: {
    next?: string[];
    previous?: string[];
    first?: string[];
    last?: string[];
  };
}

export interface UseArrowKeyNavigationReturn<T> {
  /** Currently focused index */
  focusedIndex: number;
  /** Set focused index programmatically */
  setFocusedIndex: (index: number) => void;
  /** Get props for an item element */
  getItemProps: (index: number) => {
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onClick: () => void;
    onFocus: () => void;
    ref: React.RefObject<HTMLElement | null>;
    "aria-selected": boolean;
  };
  /** Navigate to next item */
  goNext: () => void;
  /** Navigate to previous item */
  goPrevious: () => void;
  /** Navigate to first item */
  goFirst: () => void;
  /** Navigate to last item */
  goLast: () => void;
  /** Currently focused item */
  focusedItem: T | undefined;
}

/**
 * Hook for arrow key navigation in lists and grids
 * @param options - Configuration options
 * @returns Navigation state and handlers
 */
export function useArrowKeyNavigation<T>(
  options: UseArrowKeyNavigationOptions<T>
): UseArrowKeyNavigationReturn<T> {
  const {
    items,
    orientation,
    columns = 1,
    initialIndex = -1,
    onSelect,
    onFocusChange,
    enabled = true,
    loop = true,
    keyMappings = {},
  } = options;

  const [focusedIndex, setFocusedIndexState] = useState(initialIndex);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  // Default key mappings
  const defaultKeyMappings = {
    next:
      orientation === "horizontal"
        ? ["ArrowRight"]
        : orientation === "vertical"
        ? ["ArrowDown"]
        : orientation === "grid"
        ? ["ArrowRight", "ArrowDown"]
        : ["ArrowRight", "ArrowDown"],
    previous:
      orientation === "horizontal"
        ? ["ArrowLeft"]
        : orientation === "vertical"
        ? ["ArrowUp"]
        : orientation === "grid"
        ? ["ArrowLeft", "ArrowUp"]
        : ["ArrowLeft", "ArrowUp"],
    first: ["Home"],
    last: ["End"],
  };

  const mappings = {
    next: keyMappings.next || defaultKeyMappings.next,
    previous: keyMappings.previous || defaultKeyMappings.previous,
    first: keyMappings.first || defaultKeyMappings.first,
    last: keyMappings.last || defaultKeyMappings.last,
  };

  const setFocusedIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= items.length) return;
      setFocusedIndexState(index);
      onFocusChange?.(items[index], index);

      // Focus the element
      const element = itemRefs.current[index];
      if (element) {
        element.focus();
      }
    },
    [items, onFocusChange]
  );

  const goNext = useCallback(() => {
    if (items.length === 0) return;

    if (orientation === "grid" && columns > 1) {
      // For grid, move right or down
      const newIndex = focusedIndex + 1;
      if (newIndex < items.length) {
        setFocusedIndex(newIndex);
      } else if (loop) {
        setFocusedIndex(0);
      }
    } else {
      const newIndex = loop
        ? (focusedIndex + 1) % items.length
        : Math.min(focusedIndex + 1, items.length - 1);
      if (newIndex !== focusedIndex || loop) {
        setFocusedIndex(newIndex);
      }
    }
  }, [focusedIndex, items.length, orientation, columns, loop, setFocusedIndex]);

  const goPrevious = useCallback(() => {
    if (items.length === 0) return;

    if (orientation === "grid" && columns > 1) {
      const newIndex = focusedIndex - 1;
      if (newIndex >= 0) {
        setFocusedIndex(newIndex);
      } else if (loop) {
        setFocusedIndex(items.length - 1);
      }
    } else {
      const newIndex = loop
        ? (focusedIndex - 1 + items.length) % items.length
        : Math.max(focusedIndex - 1, 0);
      if (newIndex !== focusedIndex || loop) {
        setFocusedIndex(newIndex);
      }
    }
  }, [focusedIndex, items.length, orientation, columns, loop, setFocusedIndex]);

  const goFirst = useCallback(() => {
    if (items.length > 0) {
      setFocusedIndex(0);
    }
  }, [items.length, setFocusedIndex]);

  const goLast = useCallback(() => {
    if (items.length > 0) {
      setFocusedIndex(items.length - 1);
    }
  }, [items.length, setFocusedIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (!enabled) return;

      const key = e.key;

      // Handle selection
      if (key === "Enter" || key === " ") {
        e.preventDefault();
        onSelect?.(items[index], index);
        return;
      }

      // Handle Home key
      if (mappings.first.includes(key)) {
        e.preventDefault();
        goFirst();
        return;
      }

      // Handle End key
      if (mappings.last.includes(key)) {
        e.preventDefault();
        goLast();
        return;
      }

      // Handle Page Up/Down for vertical navigation
      if (orientation === "vertical" || orientation === "grid") {
        if (key === "PageUp") {
          e.preventDefault();
          const jumpSize = orientation === "grid" ? columns : 5;
          const newIndex = Math.max(0, focusedIndex - jumpSize);
          setFocusedIndex(newIndex);
          return;
        }
        if (key === "PageDown") {
          e.preventDefault();
          const jumpSize = orientation === "grid" ? columns : 5;
          const newIndex = Math.min(items.length - 1, focusedIndex + jumpSize);
          setFocusedIndex(newIndex);
          return;
        }
      }

      // Handle arrow keys based on orientation
      if (mappings.next.includes(key)) {
        e.preventDefault();
        goNext();
        return;
      }

      if (mappings.previous.includes(key)) {
        e.preventDefault();
        goPrevious();
        return;
      }

      // Handle character navigation (type-ahead)
      if (key.length === 1 && /[a-zA-Z0-9]/.test(key)) {
        const char = key.toLowerCase();
        const nextIndex = items.findIndex((item, i) => {
          if (i <= index) return false;
          const itemText = getItemText(item).toLowerCase();
          return itemText.startsWith(char);
        });

        if (nextIndex !== -1) {
          setFocusedIndex(nextIndex);
        } else {
          // Wrap around and search from beginning
          const wrapIndex = items.findIndex((item) => {
            const itemText = getItemText(item).toLowerCase();
            return itemText.startsWith(char);
          });
          if (wrapIndex !== -1) {
            setFocusedIndex(wrapIndex);
          }
        }
      }
    },
    [
      enabled,
      items,
      focusedIndex,
      mappings,
      orientation,
      columns,
      onSelect,
      goNext,
      goPrevious,
      goFirst,
      goLast,
      setFocusedIndex,
    ]
  );

  // Helper to extract text from item for type-ahead
  const getItemText = (item: T): string => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object") {
      const obj = item as Record<string, unknown>;
      return String(obj.label ?? obj.name ?? obj.title ?? obj.id ?? "");
    }
    return String(item);
  };

  const getItemProps = useCallback(
    (index: number) => ({
      tabIndex: index === focusedIndex ? 0 : -1,
      onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, index),
      onClick: () => {
        setFocusedIndex(index);
        onSelect?.(items[index], index);
      },
      onFocus: () => setFocusedIndexState(index),
      ref: (el: HTMLElement | null) => {
        itemRefs.current[index] = el;
      },
      "aria-selected": index === focusedIndex,
    }),
    [focusedIndex, items, onSelect, setFocusedIndex, handleKeyDown]
  );

  // Reset focused index when items change
  useEffect(() => {
    if (focusedIndex >= items.length) {
      setFocusedIndexState(Math.max(0, items.length - 1));
    }
  }, [items.length, focusedIndex]);

  return {
    focusedIndex,
    setFocusedIndex,
    getItemProps,
    goNext,
    goPrevious,
    goFirst,
    goLast,
    focusedItem: items[focusedIndex],
  };
}

export default useArrowKeyNavigation;
