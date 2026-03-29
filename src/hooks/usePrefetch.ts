/**
 * usePrefetch Hook
 * ================
 * Data prefetching hook for implementing instant navigation.
 * Prefetches data on hover/focus before user clicks for perceived
 * performance improvement.
 * 
 * Features:
 * - Prefetch on hover with configurable delay
 * - Prefetch on focus for keyboard navigation
 * - Route preloading for Next.js
 * - Data caching with stale-while-revalidate
 * - Request deduplication
 * 
 * @example
 * // Prefetch deal data on hover
 * const prefetchDeal = usePrefetchDeal();
 * <Link href={`/deals/${id}`} onMouseEnter={() => prefetchDeal(id)}>
 *   View Deal
 * </Link>
 */

'use client';

import { useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// =============================================================================
// Types
// =============================================================================

interface PrefetchOptions {
  /** Delay before prefetching (ms) - prevents prefetch on quick mouse passes */
  delay?: number;
  /** Maximum cache age in ms */
  maxAge?: number;
  /** Whether to prefetch on focus (keyboard navigation) */
  prefetchOnFocus?: boolean;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  promise?: Promise<T>;
}

// =============================================================================
// Global Cache
// =============================================================================

const prefetchCache = new Map<string, CacheEntry<any>>();
const DEFAULT_MAX_AGE = 5 * 60 * 1000; // 5 minutes
const DEFAULT_DELAY = 100; // 100ms

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Check if cache entry is valid
 */
function isCacheValid<T>(entry: CacheEntry<T> | undefined, maxAge: number): boolean {
  if (!entry) return false;
  return Date.now() - entry.timestamp < maxAge;
}

/**
 * Generate cache key
 */
function generateCacheKey(endpoint: string, params?: Record<string, any>): string {
  if (!params) return endpoint;
  const sortedParams = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  return `${endpoint}?${sortedParams}`;
}

// =============================================================================
// Base Prefetch Hook
// =============================================================================

/**
 * Generic prefetch hook with caching
 * 
 * @example
 * const prefetchUser = usePrefetch(
 *   (id) => fetch(`/api/users/${id}`).then(r => r.json()),
 *   { delay: 150 }
 * );
 */
export function usePrefetch<T, P = string>(
  fetcher: (params: P) => Promise<T>,
  options: PrefetchOptions = {}
): {
  prefetch: (params: P) => void;
  cancel: () => void;
  getCached: (params: P) => T | undefined;
} {
  const { delay = DEFAULT_DELAY, maxAge = DEFAULT_MAX_AGE } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const prefetch = useCallback(
    (params: P) => {
      // Cancel any pending prefetch
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Check cache first
      const cacheKey = generateCacheKey(fetcher.name, { params });
      const cached = prefetchCache.get(cacheKey);
      
      if (isCacheValid(cached, maxAge)) {
        return; // Already cached and valid
      }

      // If there's an in-flight request, don't duplicate
      if (cached?.promise) {
        return;
      }

      // Schedule prefetch with delay
      timeoutRef.current = setTimeout(() => {
        abortControllerRef.current = new AbortController();
        
        const promise = fetcher(params);
        
        // Store promise in cache to prevent duplicate requests
        prefetchCache.set(cacheKey, {
          data: null as any,
          timestamp: Date.now(),
          promise,
        });

        promise
          .then((data) => {
            prefetchCache.set(cacheKey, {
              data,
              timestamp: Date.now(),
            });
          })
          .catch((error) => {
            // Remove failed request from cache
            prefetchCache.delete(cacheKey);
            if (process.env.NODE_ENV === 'development') {
              console.warn('[Prefetch] Failed:', error);
            }
          });
      }, delay);
    },
    [fetcher, delay, maxAge]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const getCached = useCallback(
    (params: P): T | undefined => {
      const cacheKey = generateCacheKey(fetcher.name, { params });
      const entry = prefetchCache.get(cacheKey);
      return isCacheValid(entry, maxAge) ? entry?.data : undefined;
    },
    [fetcher, maxAge]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return { prefetch, cancel, getCached };
}

// =============================================================================
// Entity-Specific Prefetch Hooks
// =============================================================================

/**
 * Prefetch deal data
 * 
 * @example
 * const prefetchDeal = usePrefetchDeal();
 * 
 * <Link 
 *   href={`/deals/${deal.id}`}
 *   onMouseEnter={() => prefetchDeal(deal.id)}
 *   onMouseLeave={() => prefetchDeal.cancel?.()}
 * >
 *   {deal.companyName}
 * </Link>
 */
export function usePrefetchDeal(options?: PrefetchOptions) {
  const router = useRouter();
  
  const fetcher = useCallback(
    async (id: string) => {
      // Prefetch the route
      router.prefetch(`/deals/${id}`);
      
      // Fetch deal data
      const response = await fetch(`/api/deals/${id}`);
      if (!response.ok) throw new Error('Failed to fetch deal');
      return response.json();
    },
    [router]
  );

  return usePrefetch(fetcher, { delay: 100, ...options });
}

/**
 * Prefetch company data
 */
export function usePrefetchCompany(options?: PrefetchOptions) {
  const router = useRouter();
  
  const fetcher = useCallback(
    async (id: string) => {
      router.prefetch(`/companies/${id}`);
      const response = await fetch(`/api/companies/${id}`);
      if (!response.ok) throw new Error('Failed to fetch company');
      return response.json();
    },
    [router]
  );

  return usePrefetch(fetcher, { delay: 100, ...options });
}

/**
 * Prefetch user data
 */
export function usePrefetchUser(options?: PrefetchOptions) {
  const fetcher = useCallback(async (id: string) => {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  }, []);

  return usePrefetch(fetcher, { delay: 150, ...options });
}

/**
 * Prefetch deals list with filters
 */
export function usePrefetchDeals(options?: PrefetchOptions) {
  const fetcher = useCallback(async (filters?: Record<string, any>) => {
    const queryString = filters
      ? '?' + new URLSearchParams(filters).toString()
      : '';
    const response = await fetch(`/api/deals${queryString}`);
    if (!response.ok) throw new Error('Failed to fetch deals');
    return response.json();
  }, []);

  return usePrefetch(fetcher, { delay: 200, ...options });
}

/**
 * Prefetch activity feed
 */
export function usePrefetchActivity(options?: PrefetchOptions) {
  const fetcher = useCallback(async (params?: { limit?: number; cursor?: string }) => {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    const response = await fetch(`/api/activity${queryString}`);
    if (!response.ok) throw new Error('Failed to fetch activity');
    return response.json();
  }, []);

  return usePrefetch(fetcher, { delay: 300, ...options });
}

// =============================================================================
// Route Prefetch Hook
// =============================================================================

/**
 * Hook for prefetching Next.js routes
 * Simpler than data prefetching, just warms up the route
 * 
 * @example
 * const prefetchRoute = usePrefetchRoute();
 * 
 * <button 
 *   onMouseEnter={() => prefetchRoute('/pipeline')}
 *   onClick={() => router.push('/pipeline')}
 * >
 *   Go to Pipeline
 * </button>
 */
export function usePrefetchRoute() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const prefetch = useCallback(
    (href: string, delay: number = 100) => {
      // Cancel pending prefetch
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        router.prefetch(href);
      }, delay);
    },
    [router]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return { prefetch, cancel };
}

// =============================================================================
// Component Prefetch Hook
// =============================================================================

/**
 * Hook for prefetching heavy components
 * Uses dynamic import to load component code
 * 
 * @example
 * const prefetchComponent = usePrefetchComponent();
 * 
 * <div 
 *   onMouseEnter={() => prefetchComponent(() => import('@/components/HeavyChart'))}
 * >
 *   Hover to load chart
 * </div>
 */
export function usePrefetchComponent() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadedComponents = useRef<Set<string>>(new Set());

  const prefetch = useCallback(
    (importFn: () => Promise<any>, componentName: string, delay: number = 150) => {
      // Skip if already loaded
      if (loadedComponents.current.has(componentName)) {
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        importFn()
          .then(() => {
            loadedComponents.current.add(componentName);
          })
          .catch((error) => {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`[Prefetch] Failed to load ${componentName}:`, error);
            }
          });
      }, delay);
    },
    []
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return { prefetch, cancel };
}

// =============================================================================
// Prefetch Link Component
// =============================================================================

import React from 'react';
import Link from 'next/link';

interface PrefetchLinkProps {
  href: string;
  children: React.ReactNode;
  prefetchData?: () => void;
  className?: string;
  delay?: number;
}

/**
 * Link component with automatic prefetching on hover
 * Combines Next.js route prefetching with data prefetching
 * 
 * @example
 * <PrefetchLink 
 *   href={`/deals/${deal.id}`}
 *   prefetchData={() => prefetchDeal(deal.id)}
 * >
 *   {deal.companyName}
 * </PrefetchLink>
 */
export const PrefetchLink: React.FC<PrefetchLinkProps> = ({
  href,
  children,
  prefetchData,
  className,
  delay = 100,
}) => {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      // Prefetch route
      router.prefetch(href);
      // Prefetch data if provided
      prefetchData?.();
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
    </Link>
  );
};

// =============================================================================
// Visibility-based Prefetch Hook
// =============================================================================

import { useIntersectionObserver } from './useIntersectionObserver';

/**
 * Prefetch data when element becomes visible
 * Useful for below-the-fold content
 * 
 * @example
 * const { ref } = usePrefetchOnVisible(() => {
 *   prefetchDeals({ status: 'active' });
 * });
 * 
 * <div ref={ref}>
 *   <HeavyDealsList />
 * </div>
 */
export function usePrefetchOnVisible(
  prefetchFn: () => void,
  options?: { rootMargin?: string; triggerOnce?: boolean }
) {
  const hasPrefetched = useRef(false);

  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    rootMargin: options?.rootMargin || '200px',
    triggerOnce: options?.triggerOnce !== false,
  });

  useEffect(() => {
    if (isIntersecting && !hasPrefetched.current) {
      hasPrefetched.current = true;
      prefetchFn();
    }
  }, [isIntersecting, prefetchFn]);

  return { ref, isIntersecting };
}

// =============================================================================
// Cache Management
// =============================================================================

/**
 * Clear the prefetch cache
 * Call this on logout or when data needs to be refreshed
 */
export function clearPrefetchCache(): void {
  prefetchCache.clear();
}

/**
 * Clear specific cache entry
 */
export function clearPrefetchCacheEntry(key: string): void {
  prefetchCache.delete(key);
}

/**
 * Get cache stats (for debugging)
 */
export function getPrefetchCacheStats(): { size: number; keys: string[] } {
  return {
    size: prefetchCache.size,
    keys: Array.from(prefetchCache.keys()),
  };
}

// =============================================================================
// Export Types
// =============================================================================

export type { PrefetchOptions, CacheEntry };

// Default export
export default {
  usePrefetch,
  usePrefetchDeal,
  usePrefetchCompany,
  usePrefetchUser,
  usePrefetchDeals,
  usePrefetchActivity,
  usePrefetchRoute,
  usePrefetchComponent,
  usePrefetchOnVisible,
  clearPrefetchCache,
  clearPrefetchCacheEntry,
  getPrefetchCacheStats,
};
