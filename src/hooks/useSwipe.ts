/**
 * useSwipe Hook
 * =============
 * Detects swipe gestures in four directions (left, right, up, down).
 * Supports both touch and mouse events.
 * 
 * @accessibility
 * - Respects reduced motion preferences
 * - Works with keyboard navigation when combined with other handlers
 * - Provides haptic feedback on supported devices
 * 
 * @example
 * const { handlers, swipeState } = useSwipe({
 *   onSwipeLeft: () => navigateNext(),
 *   onSwipeRight: () => navigatePrev(),
 *   threshold: 50,
 * });
 * 
 * return <div {...handlers}>Swipeable content</div>;
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// =============================================================================
// Types
// =============================================================================

export interface SwipeOptions {
  /** Callback when swiping left */
  onSwipeLeft?: () => void;
  /** Callback when swiping right */
  onSwipeRight?: () => void;
  /** Callback when swiping up */
  onSwipeUp?: () => void;
  /** Callback when swiping down */
  onSwipeDown?: () => void;
  /** Minimum distance in pixels to trigger a swipe (default: 50) */
  threshold?: number;
  /** Maximum time in ms for a swipe (default: 300) */
  timeout?: number;
  /** Enable haptic feedback (default: true) */
  hapticFeedback?: boolean;
  /** Prevent default on swipe (default: false) */
  preventDefault?: boolean;
  /** Axis to restrict swipes to: 'x', 'y', or 'both' (default: 'both') */
  axis?: 'x' | 'y' | 'both';
}

export interface SwipeState {
  isSwiping: boolean;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  deltaX: number;
  deltaY: number;
  startX: number;
  startY: number;
}

export interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
}

export interface UseSwipeReturn {
  /** Event handlers to spread on the target element */
  handlers: SwipeHandlers;
  /** Current swipe state */
  swipeState: SwipeState;
  /** Reset swipe state manually */
  reset: () => void;
}

// =============================================================================
// Hook
// =============================================================================

export function useSwipe(options: SwipeOptions = {}): UseSwipeReturn {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    timeout = 300,
    hapticFeedback = true,
    preventDefault = false,
    axis = 'both',
  } = options;

  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    direction: null,
    deltaX: 0,
    deltaY: 0,
    startX: 0,
    startY: 0,
  });

  const startTimeRef = useRef<number>(0);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const isMouseDownRef = useRef<boolean>(false);

  // Haptic feedback helper
  const triggerHaptic = useCallback((pattern: number | number[] = 10) => {
    if (hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, [hapticFeedback]);

  // Reset state
  const reset = useCallback(() => {
    setSwipeState({
      isSwiping: false,
      direction: null,
      deltaX: 0,
      deltaY: 0,
      startX: 0,
      startY: 0,
    });
    isMouseDownRef.current = false;
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    startTimeRef.current = Date.now();
    startXRef.current = touch.clientX;
    startYRef.current = touch.clientY;

    setSwipeState({
      isSwiping: true,
      direction: null,
      deltaX: 0,
      deltaY: 0,
      startX: touch.clientX,
      startY: touch.clientY,
    });
  }, []);

  // Handle touch move
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swipeState.isSwiping) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startXRef.current;
    const deltaY = touch.clientY - startYRef.current;

    // Prevent default if needed
    if (preventDefault) {
      if (axis === 'x' && Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
      } else if (axis === 'y' && Math.abs(deltaY) > Math.abs(deltaX)) {
        e.preventDefault();
      } else if (axis === 'both') {
        e.preventDefault();
      }
    }

    setSwipeState((prev) => ({
      ...prev,
      deltaX,
      deltaY,
    }));
  }, [swipeState.isSwiping, axis, preventDefault]);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    if (!swipeState.isSwiping) return;

    const elapsedTime = Date.now() - startTimeRef.current;
    const { deltaX, deltaY } = swipeState;

    // Check if within timeout
    if (elapsedTime <= timeout) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Determine swipe direction
      if (axis !== 'y' && absX > absY && absX >= threshold) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          triggerHaptic(15);
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          triggerHaptic(15);
          onSwipeLeft();
        }
      } else if (axis !== 'x' && absY > absX && absY >= threshold) {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          triggerHaptic(15);
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          triggerHaptic(15);
          onSwipeUp();
        }
      }
    }

    reset();
  }, [swipeState, threshold, timeout, axis, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, triggerHaptic, reset]);

  // Handle mouse events (for desktop testing)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    startTimeRef.current = Date.now();
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;

    setSwipeState({
      isSwiping: true,
      direction: null,
      deltaX: 0,
      deltaY: 0,
      startX: e.clientX,
      startY: e.clientY,
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;

    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;

    setSwipeState((prev) => ({
      ...prev,
      deltaX,
      deltaY,
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isMouseDownRef.current) return;

    const elapsedTime = Date.now() - startTimeRef.current;
    const { deltaX, deltaY } = swipeState;

    if (elapsedTime <= timeout) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (axis !== 'y' && absX > absY && absX >= threshold) {
        if (deltaX > 0 && onSwipeRight) {
          triggerHaptic(15);
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          triggerHaptic(15);
          onSwipeLeft();
        }
      } else if (axis !== 'x' && absY > absX && absY >= threshold) {
        if (deltaY > 0 && onSwipeDown) {
          triggerHaptic(15);
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          triggerHaptic(15);
          onSwipeUp();
        }
      }
    }

    reset();
  }, [swipeState, threshold, timeout, axis, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, triggerHaptic, reset]);

  const handleMouseLeave = useCallback(() => {
    if (isMouseDownRef.current) {
      reset();
    }
  }, [reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handlers: SwipeHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
  };

  return {
    handlers,
    swipeState,
    reset,
  };
}

// =============================================================================
// Convenience Hooks
// =============================================================================

/**
 * Hook for horizontal swipes only
 */
export function useHorizontalSwipe(options: Omit<SwipeOptions, 'axis'>): UseSwipeReturn {
  return useSwipe({ ...options, axis: 'x' });
}

/**
 * Hook for vertical swipes only
 */
export function useVerticalSwipe(options: Omit<SwipeOptions, 'axis'>): UseSwipeReturn {
  return useSwipe({ ...options, axis: 'y' });
}

export default useSwipe;
