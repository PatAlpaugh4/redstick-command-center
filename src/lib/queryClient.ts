/**
 * TanStack Query Client Configuration
 * ===================================
 * Centralized query client setup with default options for caching,
 * retries, and error handling.
 */

import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { ApiError } from '@/types/api';

// =============================================================================
// Default Query Options
// =============================================================================

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const DEFAULT_GC_TIME = 1000 * 60 * 10; // 10 minutes
const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

// =============================================================================
// Error Handler
// =============================================================================

/**
 * Global error handler for queries and mutations
 */
function handleError(error: Error): void {
  // Log error for monitoring/debugging
  console.error('Query/Mutation Error:', error);

  // In production, you might send to error tracking service
  // e.g., Sentry.captureException(error);

  // Check if it's an API error with specific handling
  if (isApiError(error)) {
    const apiError = error as unknown as ApiError;
    
    // Handle specific error codes
    switch (apiError.code) {
      case 'UNAUTHORIZED':
        // Redirect to login or refresh token
        window.location.href = '/login';
        break;
      case 'FORBIDDEN':
        // Handle permission errors
        console.warn('Permission denied:', apiError.message);
        break;
      case 'NOT_FOUND':
        // Handle not found errors
        console.warn('Resource not found:', apiError.message);
        break;
      case 'RATE_LIMITED':
        // Handle rate limiting
        console.warn('Rate limited, retry after delay');
        break;
      default:
        console.error('API Error:', apiError.message);
    }
  }
}

/**
 * Type guard to check if error is an API error
 */
function isApiError(error: Error): boolean {
  return 'code' in error && 'message' in error;
}

// =============================================================================
// Retry Logic
// =============================================================================

/**
 * Custom retry function with exponential backoff
 */
function getRetryDelay(failureCount: number): number {
  return Math.min(
    DEFAULT_RETRY_DELAY * Math.pow(2, failureCount - 1),
    30000 // Max 30 seconds
  );
}

/**
 * Determine if a query should be retried
 */
function shouldRetryQuery(failureCount: number, error: Error): boolean {
  // Don't retry on 4xx errors (client errors)
  if (isApiError(error)) {
    const apiError = error as unknown as ApiError;
    const nonRetryableCodes = ['BAD_REQUEST', 'UNAUTHORIZED', 'FORBIDDEN', 'NOT_FOUND'];
    if (nonRetryableCodes.includes(apiError.code)) {
      return false;
    }
  }
  
  return failureCount < DEFAULT_RETRY_COUNT;
}

// =============================================================================
// Query Cache Configuration
// =============================================================================

const queryCache = new QueryCache({
  onError: handleError,
});

// =============================================================================
// Mutation Cache Configuration
// =============================================================================

const mutationCache = new MutationCache({
  onError: handleError,
});

// =============================================================================
// Query Client Instance
// =============================================================================

export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      // Stale time - how long before data is considered stale
      staleTime: DEFAULT_STALE_TIME,
      
      // Garbage collection time - how long to keep inactive data in cache
      gcTime: DEFAULT_GC_TIME,
      
      // Retry configuration
      retry: shouldRetryQuery,
      retryDelay: getRetryDelay,
      
      // Refetch behavior
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      
      // Error handling
      throwOnError: false,
      
      // Network behavior
      networkMode: 'online',
      
      // Placeholder data while loading
      placeholderData: undefined,
    },
    mutations: {
      // Retry configuration for mutations (usually fewer retries)
      retry: 1,
      retryDelay: 1000,
      
      // Network behavior
      networkMode: 'online',
      
      // Error handling
      throwOnError: false,
      
      // Default mutation options
      onSettled: (data, error, variables, context) => {
        // Can add global post-mutation logic here
        // e.g., analytics tracking
      },
    },
  },
});

// =============================================================================
// Query Client Utilities
// =============================================================================

/**
 * Invalidate multiple query keys at once
 */
export function invalidateQueries(queryKeys: string[][]): Promise<void> {
  return Promise.all(
    queryKeys.map((key) => 
      queryClient.invalidateQueries({ queryKey: key })
    )
  ).then(() => undefined);
}

/**
 * Prefetch data for a query key
 */
export async function prefetchQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: { staleTime?: number }
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: options?.staleTime ?? DEFAULT_STALE_TIME,
  });
}

/**
 * Cancel all active queries
 */
export function cancelQueries(): Promise<void> {
  return queryClient.cancelQueries();
}

/**
 * Clear all cached data
 */
export function clearCache(): void {
  queryClient.clear();
}

/**
 * Reset query client (clear cache and refetch active queries)
 */
export function resetQueryClient(): void {
  queryClient.resetQueries();
}

/**
 * Set query data manually
 */
export function setQueryData<T>(queryKey: string[], data: T): void {
  queryClient.setQueryData(queryKey, data);
}

/**
 * Get query data
 */
export function getQueryData<T>(queryKey: string[]): T | undefined {
  return queryClient.getQueryData<T>(queryKey);
}

/**
 * Remove query from cache
 */
export function removeQuery(queryKey: string[]): void {
  queryClient.removeQueries({ queryKey });
}

// =============================================================================
// Export Default
// =============================================================================

export default queryClient;
