"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";

interface UseBulkOperationsOptions<T> {
  items: T[];
  getItemId: (item: T) => string;
}

interface UseBulkOperationsReturn<T> {
  selectedIds: string[];
  selectedItems: T[];
  isAllSelected: boolean;
  isIndeterminate: boolean;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  selectRange: (startId: string, endId: string) => void;
  isSelected: (id: string) => boolean;
  setSelection: (ids: string[]) => void;
}

export function useBulkOperations<T>({
  items,
  getItemId,
}: UseBulkOperationsOptions<T>): UseBulkOperationsReturn<T> {
  // Use Set for O(1) lookups
  const [selectedIdsSet, setSelectedIdsSet] = useState<Set<string>>(new Set());
  const lastClickedIdRef = useRef<string | null>(null);

  // Persist selections across filters using a ref
  const persistentSelectionRef = useRef<Set<string>>(new Set());

  // Sync persistent selection with state
  useEffect(() => {
    persistentSelectionRef.current = selectedIdsSet;
  }, [selectedIdsSet]);

  const selectedIds = useMemo(() => Array.from(selectedIdsSet), [selectedIdsSet]);

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIdsSet.has(getItemId(item))),
    [items, selectedIdsSet, getItemId]
  );

  const isAllSelected = useMemo(
    () => items.length > 0 && items.every((item) => selectedIdsSet.has(getItemId(item))),
    [items, selectedIdsSet, getItemId]
  );

  const isIndeterminate = useMemo(
    () => selectedIdsSet.size > 0 && !isAllSelected,
    [selectedIdsSet.size, isAllSelected]
  );

  const isSelected = useCallback(
    (id: string) => selectedIdsSet.has(id),
    [selectedIdsSet]
  );

  const toggleSelection = useCallback((id: string) => {
    setSelectedIdsSet((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        lastClickedIdRef.current = id;
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    const allIds = items.map(getItemId);
    setSelectedIdsSet(new Set(allIds));
  }, [items, getItemId]);

  const clearSelection = useCallback(() => {
    setSelectedIdsSet(new Set());
    lastClickedIdRef.current = null;
  }, []);

  const selectRange = useCallback(
    (startId: string, endId: string) => {
      const itemIds = items.map(getItemId);
      const startIndex = itemIds.indexOf(startId);
      const endIndex = itemIds.indexOf(endId);

      if (startIndex === -1 || endIndex === -1) return;

      const [minIndex, maxIndex] = [startIndex, endIndex].sort((a, b) => a - b);
      const rangeIds = itemIds.slice(minIndex, maxIndex + 1);

      setSelectedIdsSet((prev) => {
        const newSet = new Set(prev);
        rangeIds.forEach((id) => newSet.add(id));
        return newSet;
      });
    },
    [items, getItemId]
  );

  const setSelection = useCallback((ids: string[]) => {
    setSelectedIdsSet(new Set(ids));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+A / Cmd+A - Select all
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
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
    isSelected,
    setSelection,
  };
}
