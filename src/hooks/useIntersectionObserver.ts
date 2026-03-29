/**
 * useIntersectionObserver Hook
 * =============================
 * A reusable React hook for lazy loading triggers using the IntersectionObserver API.
 * 
 * Features:
 * - Lazy loading images and components when they enter viewport
 * - Infinite scroll trigger detection
 * - Animation trigger on scroll into view
 * - Configurable root margin and thresholds
 * - Supports once-only or continuous observation
 * 
 * Performance Benefits:
 * - Native browser API (no scroll event listeners)
 * - Minimal performance impact
 * - Enables true lazy loading for better initial load times
 */

'use client';

import { useState, useEffect, useRef, useCallback, RefObject } from 'react';

// =============================================================================
// Types
// =============================================================================

interface UseIntersectionObserverOptions {
  /** Element that is used as the viewport for checking visibility */
  root?: Element | null;
  /** Margin around the root */
  rootMargin?: string;
  /** Number between 0 and 1 indicating the percentage of target visibility */
  threshold?: number | number[];
  /** Whether to disconnect observer after first intersection */
  triggerOnce?: boolean;
  /** Initial visibility state */
  initialIsIntersecting?: boolean;
  /** Callback when intersection state changes */
  onChange?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void;
}

interface UseIntersectionObserverReturn<T extends HTMLElement> {
  /** Ref to attach to the target element */
  ref: RefObject<T>;
  /** Whether the element is currently intersecting */
  isIntersecting: boolean;
  /** The IntersectionObserverEntry if available */
  entry?: IntersectionObserverEntry;
  /** Manually disconnect the observer */
  disconnect: () => void;
  /** Manually reconnect the observer */
  reconnect: () => void;
}

// =============================================================================
// Main Hook
// =============================================================================

/**
 * Hook for observing element visibility using IntersectionObserver
 * 
 * @example
 * // Basic lazy load trigger
 * const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>();
 * 
 * @example
 * // With options for infinite scroll
 * const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
 *   rootMargin: '100px',
 *   onChange: (visible) => {
 *     if (visible) loadMoreItems();
 *   }
 * });
 * 
 * @example
 * // Trigger animation once
 * const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
 *   threshold: 0.2,
 *   triggerOnce: true
 * });
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn<T> {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    triggerOnce = false,
    initialIsIntersecting = false,
    onChange,
  } = options;

  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(initialIsIntersecting);
  const [entry, setEntry] = useState<IntersectionObserverEntry | undefined>();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasTriggeredRef = useRef(false);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    hasTriggeredRef.current = false;

    if (!ref.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;

        setIsIntersecting(isElementIntersecting);
        setEntry(entry);

        // Call onChange callback
        onChange?.(isElementIntersecting, entry);

        // Handle trigger once
        if (isElementIntersecting && triggerOnce) {
          hasTriggeredRef.current = true;
          disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observerRef.current.observe(ref.current);
  }, [root, rootMargin, threshold, triggerOnce, onChange, disconnect]);

  useEffect(() => {
    // Don't observe if triggerOnce and already triggered
    if (triggerOnce && hasTriggeredRef.current) return;

    reconnect();

    return () => {
      disconnect();
    };
  }, [reconnect, disconnect, triggerOnce]);

  return { ref, isIntersecting, entry, disconnect, reconnect };
}

// =============================================================================
// Specialized Hooks
// =============================================================================

/**
 * Hook for lazy loading images
 * Returns props that can be spread onto an img element
 * 
 * @example
 * const { ref, isVisible, src } = useLazyImage('/image.jpg', '/placeholder.jpg');
 * <img ref={ref} src={src} />
 */
export function useLazyImage(
  src: string,
  placeholderSrc?: string,
  options?: Omit<UseIntersectionObserverOptions, 'triggerOnce'>
) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLImageElement>({
    rootMargin: '50px',
    triggerOnce: true,
    ...options,
  });

  return {
    ref,
    isVisible: isIntersecting,
    src: isIntersecting ? src : placeholderSrc || '',
  };
}

/**
 * Hook for infinite scroll detection
 * Automatically triggers callback when user scrolls near bottom
 * 
 * @example
 * useInfiniteScroll(() => {
 *   if (hasMore && !loading) {
 *     loadMore();
 *   }
 * }, hasMore, loading);
 */
export function useInfiniteScroll(
  onLoadMore: () => void,
  hasMore: boolean,
  isLoading: boolean,
  options?: { rootMargin?: string; threshold?: number }
) {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    rootMargin: options?.rootMargin || '200px',
    threshold: options?.threshold || 0,
  });

  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [isIntersecting, hasMore, isLoading, onLoadMore]);

  return { ref, isIntersecting };
}

/**
 * Hook for triggering animations when element comes into view
 * 
 * @example
 * const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });
 * <motion.div
 *   ref={ref}
 *   initial={{ opacity: 0, y: 20 }}
 *   animate={isVisible ? { opacity: 1, y: 0 } : {}}
 * />
 */
export function useScrollAnimation(options?: { threshold?: number; rootMargin?: string }) {
  return useIntersectionObserver<HTMLDivElement>({
    threshold: options?.threshold || 0.2,
    rootMargin: options?.rootMargin || '0px',
    triggerOnce: true,
  });
}

/**
 * Hook for tracking visibility percentage of an element
 * Returns the intersection ratio (0 to 1)
 * 
 * @example
 * const { ref, visibility } = useVisibilityTracking();
 * <div style={{ opacity: visibility }} />
 */
export function useVisibilityTracking<T extends HTMLElement = HTMLElement>(
  options?: Omit<UseIntersectionObserverOptions, 'threshold'>
) {
  const [visibility, setVisibility] = useState(0);
  const { ref, entry } = useIntersectionObserver<T>({
    threshold: Array.from({ length: 101 }, (_, i) => i / 100),
    ...options,
  });

  useEffect(() => {
    if (entry) {
      setVisibility(entry.intersectionRatio);
    }
  }, [entry]);

  return { ref, visibility, entry };
}

/**
 * Hook for tracking which section is currently in view
 * Useful for table of contents or navigation highlighting
 * 
 * @example
 * const { registerSection, activeSection } = useSectionObserver();
 * 
 * <div ref={registerSection('section1')} id="section1">...</div>
 * <div ref={registerSection('section2')} id="section2">...</div>
 */
export function useSectionObserver(options?: { rootMargin?: string; threshold?: number }) {
  const [activeSection, setActiveSection] = useState<string>('');
  const sectionsRef = useRef<Map<string, IntersectionObserverEntry>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map());

  const registerSection = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (!el) return;

      elementsRef.current.set(id, el);

      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const sectionId = entry.target.getAttribute('data-section-id');
              if (sectionId) {
                if (entry.isIntersecting) {
                  sectionsRef.current.set(sectionId, entry);
                } else {
                  sectionsRef.current.delete(sectionId);
                }
              }
            });

            // Find the most visible section
            let maxRatio = 0;
            let mostVisibleSection = '';
            sectionsRef.current.forEach((entry, id) => {
              if (entry.intersectionRatio > maxRatio) {
                maxRatio = entry.intersectionRatio;
                mostVisibleSection = id;
              }
            });

            if (mostVisibleSection) {
              setActiveSection(mostVisibleSection);
            }
          },
          {
            rootMargin: options?.rootMargin || '-20% 0px -60% 0px',
            threshold: options?.threshold || 0,
          }
        );
      }

      el.setAttribute('data-section-id', id);
      observerRef.current?.observe(el);
    },
    [options?.rootMargin, options?.threshold]
  );

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return { registerSection, activeSection };
}

// =============================================================================
// Hook with State Machine (Advanced)
// =============================================================================

type LazyLoadState = 'idle' | 'loading' | 'loaded' | 'error';

interface UseLazyComponentOptions extends UseIntersectionObserverOptions {
  /** Delay before loading (ms) */
  delay?: number;
  /** Function to call when component should load */
  onLoad?: () => void | Promise<void>;
}

interface UseLazyComponentReturn<T extends HTMLElement> {
  ref: RefObject<T>;
  state: LazyLoadState;
  isVisible: boolean;
  load: () => void;
  error?: Error;
}

/**
 * Advanced hook for lazy loading components with state management
 * 
 * @example
 * const { ref, state, isVisible } = useLazyComponent<HTMLDivElement>({
 *   rootMargin: '100px',
 *   delay: 100
 * });
 * 
 * {state === 'loaded' && <HeavyComponent />}
 */
export function useLazyComponent<T extends HTMLElement = HTMLElement>(
  options: UseLazyComponentOptions = {}
): UseLazyComponentReturn<T> {
  const { delay = 0, onLoad, triggerOnce = true, ...observerOptions } = options;
  const [state, setState] = useState<LazyLoadState>('idle');
  const [error, setError] = useState<Error>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const { ref, isIntersecting } = useIntersectionObserver<T>({
    ...observerOptions,
    triggerOnce,
    onChange: (visible) => {
      if (visible && state === 'idle') {
        setState('loading');

        timeoutRef.current = setTimeout(async () => {
          try {
            await onLoad?.();
            setState('loaded');
          } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load'));
            setState('error');
          }
        }, delay);
      }
    },
  });

  const load = useCallback(() => {
    if (state === 'idle') {
      setState('loading');
      timeoutRef.current = setTimeout(async () => {
        try {
          await onLoad?.();
          setState('loaded');
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to load'));
          setState('error');
        }
      }, delay);
    }
  }, [state, delay, onLoad]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ref,
    state,
    isVisible: isIntersecting,
    load,
    error,
  };
}

export default useIntersectionObserver;
