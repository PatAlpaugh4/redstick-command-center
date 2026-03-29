import { useState, useCallback, useMemo, useEffect, useRef } from "react";

export interface UseBulkOperationsOptions<T> {
  items: T[];
  getItemId: (item: T) => string;
}

export interface UseBulkOperationsReturn<T> {
  /** Array of selected item IDs */
  selectedIds: string[];
  /** Array of selected item objects */
  selectedItems: T[];
  /** Whether all items are selected */
  isAllSelected: boolean;
  /** Whether some (but not all) items are selected */
  isIndeterminate: boolean;
  /** Toggle selection of a single item */
  toggleSelection: (id: string) => void;
  /** Select all items */
  selectAll: () => void;
  /** Clear all selections */
  clearSelection: () => void;
  /** Select a range of items (for shift-click) */
  selectRange: (startId: string, endId: string) => void;
  /** Set selection to specific IDs */
  setSelection: (ids: string[]) => void;
  /** Check if an item is selected */
  isSelected: (id: string) => boolean;
  /** Last clicked item ID (for range selection) */
  lastClickedId: string | null;
  /** Set the last clicked item ID */
  setLastClickedId: (id: string | null) => void;
}

/**
 * Hook for managing bulk operations with items
 * 
 * Features:
 * - Track selected items by ID
 * - Persist selection across filters
 * - Support shift-click range selection
 * - Keyboard shortcuts (Ctrl+A, Escape)
 * 
 * @example
 * ```tsx
 * const { selectedIds, selectedItems, toggleSelection, isAllSelected } = useBulkOperations({
 *   items: companies,
 *   getItemId: (company) => company.id,
 * });
 * ```
 */
export function useBulkOperations<T>(
  options: UseBulkOperationsOptions<T>
): UseBulkOperationsReturn<T> {
  const { items, getItemId } = options;

  // Use a Set for efficient lookups
  const [selectedIdsSet, setSelectedIdsSet] = useState<Set<string>>(new Set());
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);
  
  // Keep track of items that were selected but may not be in current filtered view
  const persistedSelectionRef = useRef<Set<string>>(new Set());

  // Sync the Set with the Ref for persistence across filters
  useEffect(() => {
    persistedSelectionRef.current = selectedIdsSet;
  }, [selectedIdsSet]);

  // Convert Set to array for external use
  const selectedIds = useMemo(() => Array.from(selectedIdsSet), [selectedIdsSet]);

  // Get selected item objects
  const selectedItems = useMemo(() => {
    const selectedSet = persistedSelectionRef.current;
    return items.filter((item) => selectedSet.has(getItemId(item)));
  }, [items, getItemId, selectedIds]); // selectedIds triggers recalculation

  // Check if all visible items are selected
  const isAllSelected = useMemo(() => {
    if (items.length === 0) return false;
    return items.every((item) => selectedIdsSet.has(getItemId(item)));
  }, [items, selectedIdsSet, getItemId]);

  // Check if some (but not all) items are selected
  const isIndeterminate = useMemo(() => {
    if (items.length === 0) return false;
    const visibleSelectedCount = items.filter((item) =>
      selectedIdsSet.has(getItemId(item))
    ).length;
    return visibleSelectedCount > 0 && visibleSelectedCount < items.length;
  }, [items, selectedIdsSet, getItemId]);

  // Toggle selection of a single item
  const toggleSelection = useCallback((id: string) => {
    setSelectedIdsSet((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    setLastClickedId(id);
  }, []);

  // Select all items
  const selectAll = useCallback(() => {
    setSelectedIdsSet((prev) => {
      const newSet = new Set(prev);
      items.forEach((item) => {
        newSet.add(getItemId(item));
      });
      return newSet;
    });
  }, [items, getItemId]);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedIdsSet(new Set());
    setLastClickedId(null);
  }, []);

  // Select a range of items (for shift-click functionality)
  const selectRange = useCallback(
    (startId: string, endId: string) => {
      const itemIds = items.map(getItemId);
      const startIndex = itemIds.indexOf(startId);
      const endIndex = itemIds.indexOf(endId);

      if (startIndex === -1 || endIndex === -1) return;

      const [minIndex, maxIndex] =
        startIndex < endIndex
          ? [startIndex, endIndex]
          : [endIndex, startIndex];

      setSelectedIdsSet((prev) => {
        const newSet = new Set(prev);
        for (let i = minIndex; i <= maxIndex; i++) {
          newSet.add(itemIds[i]);
        }
        return newSet;
      });
    },
    [items, getItemId]
  );

  // Set selection to specific IDs
  const setSelection = useCallback((ids: string[]) => {
    setSelectedIdsSet(new Set(ids));
  }, []);

  // Check if an item is selected
  const isSelected = useCallback(
    (id: string) => selectedIdsSet.has(id),
    [selectedIdsSet]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+A / Cmd+A - Select all visible items
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        // Only if not in an input/textarea
        const target = e.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        selectAll();
      }

      // Escape - Clear selection
      if (e.key === "Escape") {
        clearSelection();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectAll, clearSelection]);

  return {
    selectedIds,
    selectedItems,
    isAllSelected,
    isIndeterminate,
    toggleSelection,
    selectAll,
    clearSelection,
    selectRange,
    setSelection,
    isSelected,
    lastClickedId,
    setLastClickedId,
  };
}

export default useBulkOperations;
