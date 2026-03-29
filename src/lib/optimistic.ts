/**
 * Optimistic Update Helpers
 * =========================
 * Utilities for implementing optimistic updates with TanStack Query.
 * Provides functions for updating cache before server confirmation.
 */

import { QueryClient, QueryKey } from '@tanstack/react-query';
import { queryClient } from './queryClient';

// =============================================================================
// Types
// =============================================================================

/**
 * Context for optimistic updates
 */
export interface OptimisticContext<TData, TVariables> {
  previousData: TData | undefined;
  variables: TVariables;
}

/**
 * Options for optimistic update
 */
export interface OptimisticUpdateOptions<TData, TVariables> {
  queryClient?: QueryClient;
  queryKey: QueryKey;
  mutationFn: (variables: TVariables) => Promise<TData>;
  updater: (oldData: TData | undefined, variables: TVariables) => TData;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables, context: OptimisticContext<TData, TVariables>) => void;
  onSettled?: () => void;
  retryCount?: number;
}

/**
 * Options for list item optimistic update
 */
export interface ListOptimisticUpdateOptions<TItem, TVariables> {
  queryClient?: QueryClient;
  queryKey: QueryKey;
  mutationFn: (variables: TVariables) => Promise<TItem>;
  updateMode: 'add' | 'update' | 'delete';
  getItemId: (item: TItem) => string;
  mergeFn?: (oldItem: TItem, newItem: TItem) => TItem;
  onSuccess?: (data: TItem, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
}

// =============================================================================
// Core Optimistic Update Function
// =============================================================================

/**
 * Perform an optimistic update on a query
 * 
 * @example
 * ```typescript
 * const mutation = useMutation({
 *   mutationFn: updateDeal,
 *   onMutate: async (variables) => {
 *     return optimisticUpdate<Deal, UpdateDealVariables>({
 *       queryKey: ['deals', variables.id],
 *       updater: (old, vars) => ({ ...old, ...vars.updates }),
 *     });
 *   },
 * });
 * ```
 */
export function optimisticUpdate<TData, TVariables = unknown>(
  options: Omit<OptimisticUpdateOptions<TData, TVariables>, 'mutationFn'>
): Promise<OptimisticContext<TData, TVariables>> {
  const client = options.queryClient || queryClient;
  const queryKey = options.queryKey;

  // Cancel outgoing refetches
  client.cancelQueries({ queryKey });

  // Snapshot previous value
  const previousData = client.getQueryData<TData>(queryKey);

  // Optimistically update
  client.setQueryData<TData>(queryKey, (old) => options.updater(old, undefined as TVariables));

  return Promise.resolve({
    previousData,
    variables: undefined as TVariables,
  });
}

/**
 * Rollback optimistic update on error
 */
export function rollbackOptimisticUpdate<TData, TVariables>(
  queryKey: QueryKey,
  context: OptimisticContext<TData, TVariables>,
  customClient?: QueryClient
): void {
  const client = customClient || queryClient;
  client.setQueryData<TData>(queryKey, context.previousData);
}

// =============================================================================
// List Operations
// =============================================================================

/**
 * Optimistically add an item to a list
 */
export function optimisticAddToList<TItem, TVariables = TItem>(
  queryKey: QueryKey,
  newItem: TItem,
  options?: {
    prepend?: boolean;
    queryClient?: QueryClient;
    listKey?: string; // For paginated responses with 'data' key
  }
): OptimisticContext<TItem[], TVariables> {
  const client = options?.queryClient || queryClient;
  
  client.cancelQueries({ queryKey });
  const previousData = client.getQueryData<TItem[]>(queryKey);

  client.setQueryData<TItem[]>(queryKey, (old) => {
    if (!old) return [newItem];
    return options?.prepend ? [newItem, ...old] : [...old, newItem];
  });

  return {
    previousData,
    variables: newItem as unknown as TVariables,
  };
}

/**
 * Optimistically update an item in a list
 */
export function optimisticUpdateInList<TItem, TVariables = Partial<TItem>>(
  queryKey: QueryKey,
  itemId: string,
  updates: Partial<TItem>,
  options: {
    getItemId: (item: TItem) => string;
    queryClient?: QueryClient;
    mergeFn?: (oldItem: TItem, updates: Partial<TItem>) => TItem;
  }
): OptimisticContext<TItem[], TVariables> {
  const client = options.queryClient || queryClient;
  
  client.cancelQueries({ queryKey });
  const previousData = client.getQueryData<TItem[]>(queryKey);

  const mergeFn = options.mergeFn || ((old, updates) => ({ ...old, ...updates }));

  client.setQueryData<TItem[]>(queryKey, (old) => {
    if (!old) return old;
    return old.map((item) =>
      options.getItemId(item) === itemId ? mergeFn(item, updates) : item
    );
  });

  return {
    previousData,
    variables: updates as unknown as TVariables,
  };
}

/**
 * Optimistically remove an item from a list
 */
export function optimisticRemoveFromList<TItem, TVariables = string>(
  queryKey: QueryKey,
  itemId: string,
  options: {
    getItemId: (item: TItem) => string;
    queryClient?: QueryClient;
  }
): OptimisticContext<TItem[], TVariables> {
  const client = options.queryClient || queryClient;
  
  client.cancelQueries({ queryKey });
  const previousData = client.getQueryData<TItem[]>(queryKey);

  client.setQueryData<TItem[]>(queryKey, (old) => {
    if (!old) return old;
    return old.filter((item) => options.getItemId(item) !== itemId);
  });

  return {
    previousData,
    variables: itemId as unknown as TVariables,
  };
}

// =============================================================================
// Object Operations
// =============================================================================

/**
 * Optimistically update object properties
 */
export function optimisticUpdateObject<T extends Record<string, unknown>, TVariables = Partial<T>>(
  queryKey: QueryKey,
  updates: Partial<T>,
  customClient?: QueryClient
): OptimisticContext<T, TVariables> {
  const client = customClient || queryClient;
  
  client.cancelQueries({ queryKey });
  const previousData = client.getQueryData<T>(queryKey);

  client.setQueryData<T>(queryKey, (old) => {
    if (!old) return old;
    return { ...old, ...updates } as T;
  });

  return {
    previousData,
    variables: updates as unknown as TVariables,
  };
}

// =============================================================================
// Batch Operations
// =============================================================================

/**
 * Perform multiple optimistic updates atomically
 */
export function batchOptimisticUpdates<T>(
  updates: Array<{
    queryKey: QueryKey;
    updater: (old: unknown) => unknown;
  }>,
  customClient?: QueryClient
): Array<{ queryKey: QueryKey; previousData: unknown }> {
  const client = customClient || queryClient;
  const contexts: Array<{ queryKey: QueryKey; previousData: unknown }> = [];

  // Cancel all queries first
  updates.forEach(({ queryKey }) => {
    client.cancelQueries({ queryKey });
  });

  // Snapshot all current values
  updates.forEach(({ queryKey }) => {
    contexts.push({
      queryKey,
      previousData: client.getQueryData(queryKey),
    });
  });

  // Apply all updates
  updates.forEach(({ queryKey, updater }) => {
    client.setQueryData(queryKey, updater);
  });

  return contexts;
}

/**
 * Rollback multiple optimistic updates
 */
export function rollbackBatchOptimisticUpdates(
  contexts: Array<{ queryKey: QueryKey; previousData: unknown }>,
  customClient?: QueryClient
): void {
  const client = customClient || queryClient;
  
  contexts.forEach(({ queryKey, previousData }) => {
    client.setQueryData(queryKey, previousData);
  });
}

// =============================================================================
// Mutation Helpers
// =============================================================================

/**
 * Create mutation handlers for optimistic list updates
 */
export function createOptimisticListMutations<TItem>(
  queryKey: QueryKey,
  options: {
    getItemId: (item: TItem) => string;
    queryClient?: QueryClient;
  }
) {
  const client = options.queryClient || queryClient;

  return {
    onAdd: (item: TItem) => {
      return optimisticAddToList<TItem>(queryKey, item, {
        prepend: true,
        queryClient: client,
      });
    },

    onUpdate: (id: string, updates: Partial<TItem>) => {
      return optimisticUpdateInList<TItem>(queryKey, id, updates, {
        getItemId: options.getItemId,
        queryClient: client,
      });
    },

    onDelete: (id: string) => {
      return optimisticRemoveFromList<TItem>(queryKey, id, {
        getItemId: options.getItemId,
        queryClient: client,
      });
    },
  };
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Invalidate related queries after mutation
 */
export function invalidateRelatedQueries(
  primaryKey: QueryKey,
  relatedKeys: QueryKey[] = [],
  customClient?: QueryClient
): Promise<void> {
  const client = customClient || queryClient;
  const allKeys = [primaryKey, ...relatedKeys];
  
  return Promise.all(
    allKeys.map((key) => client.invalidateQueries({ queryKey: key }))
  ).then(() => undefined);
}

/**
 * Prefetch related data after successful mutation
 */
export async function prefetchRelatedData<T>(
  queries: Array<{
    queryKey: QueryKey;
    queryFn: () => Promise<T>;
  }>,
  customClient?: QueryClient
): Promise<void> {
  const client = customClient || queryClient;
  
  await Promise.all(
    queries.map(({ queryKey, queryFn }) =>
      client.prefetchQuery({ queryKey, queryFn })
    )
  );
}

// =============================================================================
// Export
// =============================================================================

export default {
  optimisticUpdate,
  rollbackOptimisticUpdate,
  optimisticAddToList,
  optimisticUpdateInList,
  optimisticRemoveFromList,
  optimisticUpdateObject,
  batchOptimisticUpdates,
  rollbackBatchOptimisticUpdates,
  createOptimisticListMutations,
  invalidateRelatedQueries,
  prefetchRelatedData,
};
