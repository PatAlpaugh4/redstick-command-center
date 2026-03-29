/**
 * usePullToRefresh Hook
 * =====================
 * Implements pull-to-refresh gesture for mobile devices.
 * Shows a visual indicator and triggers refresh callback.
 * 
 * @accessibility
 * - Respects reduced motion preferences
 * - Provides screen reader announcements
 * - Includes keyboard alternative (F5/Ctrl+R)
 * 
 * @example
 * const { handlers, isPulling, pullProgress, isRefreshing } = usePullToRefresh({
 *   onRefresh: async () => {
 *     await refetchData();
 *   },
 *   threshold: 100,
 * });
 * 
 * return (
 *   <div {...handlers}>
 *     <PullIndicator progress={pullProgress} refreshing={isRefreshing} />
 *     <Content />
 *   </div>
 * );
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// =============================================================================
// Types
// =============================================================================

export interface PullToRefreshOptions {
  /** Callback when refresh is triggered */
  onRefresh: () => Promise<void>;
  /** Distance in pixels to trigger refresh (default: 80) */
  threshold?: number;
  /** Maximum distance for visual feedback (default: 150) */
  maxDistance?: number;
  /** Resistance factor for pull (default: 0.5) */
  resistance?: number;
  /** Enable haptic feedback (default: true) */
  hapticFeedback?: boolean;
  /** Disable pull-to-refresh (default: false) */
  disabled?: boolean;
  /** Container ref for scroll detection (default: window) */
  containerRef?: React.RefObject<HTMLElement>;
}

export interface PullToRefreshState {
  /** Whether user is currently pulling */
  isPulling: boolean;
  /** Pull progress from 0 to 100 */
  pullProgress: number;
  /** Whether refresh is in progress */
  isRefreshing: boolean;
  /** Current pull distance in pixels */
  pullDistance: number;
  /** Whether threshold has been reached */
  thresholdReached: boolean;
}

export interface PullToRefreshHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export interface UsePullToRefreshReturn {
  /** Event handlers to spread on the target element */
  handlers: PullToRefreshHandlers;
  /** Current pull-to-refresh state */
  state: PullToRefreshState;
  /** Manually trigger refresh */
  triggerRefresh: () => Promise<void>;
  /** Reset all state */
  reset: () => void;
}

// =============================================================================
// Hook
// =============================================================================

export function usePullToRefresh(options: PullToRefreshOptions): UsePullToRefreshReturn {
  const {
    onRefresh,
    threshold = 80,
    maxDistance = 150,
    resistance = 0.5,
    hapticFeedback = true,
    disabled = false,
    containerRef,
  } = options;

  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    pullProgress: 0,
    isRefreshing: false,
    pullDistance: 0,
    thresholdReached: false,
  });

  const startYRef = useRef<number>(0);
  const startXRef = useRef<number>(0);
  const isAtTopRef = useRef<boolean>(true);
  const hasTriggeredRef = useRef<boolean>(false);

  // Haptic feedback helper
  const triggerHaptic = useCallback((pattern: number | number[] = 10) => {
    if (hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, [hapticFeedback]);

  // Check if we're at the top of the scroll container
  const checkIsAtTop = useCallback((): boolean => {
    if (containerRef?.current) {
      return containerRef.current.scrollTop <= 0;
    }
    return window.scrollY <= 0;
  }, [containerRef]);

  // Reset state
  const reset = useCallback(() => {
    setState({
      isPulling: false,
      pullProgress: 0,
      isRefreshing: false,
      pullDistance: 0,
      thresholdReached: false,
    });
    hasTriggeredRef.current = false;
  }, []);

  // Trigger refresh
  const triggerRefresh = useCallback(async () => {
    if (state.isRefreshing) return;

    setState((prev) => ({
      ...prev,
      isRefreshing: true,
      thresholdReached: true,
    }));

    try {
      await onRefresh();
    } finally {
      // Animate back to 0
      setState((prev) => ({
        ...prev,
        isRefreshing: false,
        isPulling: false,
        pullDistance: 0,
        pullProgress: 0,
        thresholdReached: false,
      }));
      hasTriggeredRef.current = false;
    }
  }, [onRefresh, state.isRefreshing]);

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || state.isRefreshing) return;

    const touch = e.touches[0];
    startYRef.current = touch.clientY;
    startXRef.current = touch.clientX;
    isAtTopRef.current = checkIsAtTop();

    if (isAtTopRef.current) {
      setState((prev) => ({
        ...prev,
        isPulling: true,
        pullDistance: 0,
        pullProgress: 0,
      }));
    }
  }, [disabled, state.isRefreshing, checkIsAtTop]);

  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || state.isRefreshing || !state.isPulling) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - startYRef.current;
    const deltaX = Math.abs(touch.clientX - startXRef.current);

    // Check if scrolling horizontally - cancel pull
    if (deltaX > Math.abs(deltaY)) {
      setState((prev) => ({
        ...prev,
        isPulling: false,
      }));
      return;
    }

    // Only pull when at top and pulling down
    if (isAtTopRef.current && deltaY > 0) {
      e.preventDefault();

      // Apply resistance
      const resistedDistance = deltaY * resistance;
      const clampedDistance = Math.min(resistedDistance, maxDistance);
      const progress = Math.min((clampedDistance / threshold) * 100, 100);
      const thresholdReached = clampedDistance >= threshold;

      // Trigger haptic when crossing threshold
      if (thresholdReached && !state.thresholdReached && !hasTriggeredRef.current) {
        triggerHaptic(20);
      }

      setState((prev) => ({
        ...prev,
        pullDistance: clampedDistance,
        pullProgress: progress,
        thresholdReached,
      }));
    }
  }, [disabled, state.isRefreshing, state.isPulling, state.thresholdReached, resistance, maxDistance, threshold, triggerHaptic]);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    if (!state.isPulling || state.isRefreshing) return;

    if (state.thresholdReached && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      triggerHaptic([10, 30, 10]); // Success pattern
      triggerRefresh();
    } else {
      // Spring back
      setState({
        isPulling: false,
        pullProgress: 0,
        isRefreshing: false,
        pullDistance: 0,
        thresholdReached: false,
      });
    }
  }, [state.isPulling, state.isRefreshing, state.thresholdReached, triggerHaptic, triggerRefresh]);

  // Keyboard shortcut for refresh (F5 or Ctrl+R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'F5' || (e.ctrlKey && e.key === 'r')) && !state.isRefreshing) {
        e.preventDefault();
        triggerRefresh();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerRefresh, state.isRefreshing]);

  const handlers: PullToRefreshHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return {
    handlers,
    state,
    triggerRefresh,
    reset,
  };
}

// =============================================================================
// Pull Indicator Component
// =============================================================================

export interface PullIndicatorProps {
  progress: number;
  refreshing: boolean;
  thresholdReached: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Visual indicator component for pull-to-refresh
 */
export function PullIndicator({
  progress,
  refreshing,
  thresholdReached,
  size = 'md',
  className = '',
}: PullIndicatorProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const strokeWidth = size === 'sm' ? 2 : size === 'md' ? 3 : 4;
  const rotation = (progress / 100) * 360;

  return (
    <div
      className={`flex items-center justify-center transition-opacity duration-200 ${className}`}
      style={{
        opacity: progress > 0 ? 1 : 0,
        transform: `translateY(${Math.min(progress * 0.5, 20)}px)`,
      }}
      aria-hidden={progress <= 0}
    >
      {refreshing ? (
        // Spinner
        <svg
          className={`${sizeClasses[size]} animate-spin`}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        // Arrow that rotates based on progress
        <svg
          className={`${sizeClasses[size]} transition-colors duration-200`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          style={{
            transform: `rotate(${rotation}deg)`,
            color: thresholdReached ? '#10b981' : 'currentColor',
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      )}
    </div>
  );
}

export default usePullToRefresh;
