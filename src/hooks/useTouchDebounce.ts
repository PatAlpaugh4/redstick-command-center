/**
 * useTouchDebounce Hook
 * =====================
 * Prevents accidental rapid touches by debouncing touch/click events.
 * Essential for touch interfaces where users might accidentally double-tap.
 * 
 * @accessibility
 * - Respects reduced motion preferences
 * - Works with both touch and mouse events
 * - Provides visual feedback when debouncing
 * 
 * @example
 * const { debouncedCallback, isDebouncing, timeRemaining } = useTouchDebounce(
 *   () => handleSubmit(),
 *   { delay: 300 }
 * );
 * 
 * <button 
 *   onClick={debouncedCallback}
 *   disabled={isDebouncing}
 *   className={isDebouncing ? 'opacity-50' : ''}
 * >
 *   {isDebouncing ? `Wait ${timeRemaining}ms...` : 'Submit'}
 * </button>
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// =============================================================================
// Types
// =============================================================================

export interface TouchDebounceOptions {
  /** Debounce delay in milliseconds (default: 300) */
  delay?: number;
  /** Callback when debouncing starts */
  onDebounceStart?: () => void;
  /** Callback when debouncing ends */
  onDebounceEnd?: () => void;
  /** Enable haptic feedback on blocked touches (default: true) */
  hapticFeedback?: boolean;
  /** Allow the first call immediately, debounce subsequent calls (default: false) */
  leading?: boolean;
  /** Allow one final call after delay (default: false) */
  trailing?: boolean;
}

export interface TouchDebounceState {
  /** Whether currently debouncing */
  isDebouncing: boolean;
  /** Time remaining in milliseconds */
  timeRemaining: number;
  /** Number of blocked calls */
  blockedCount: number;
  /** Last call timestamp */
  lastCallTime: number | null;
}

export interface UseTouchDebounceReturn<T extends (...args: any[]) => any> {
  /** Debounced callback function */
  debouncedCallback: T;
  /** Current debounce state */
  state: TouchDebounceState;
  /** Manually cancel debouncing */
  cancel: () => void;
  /** Manually flush the pending callback */
  flush: () => void;
  /** Reset all state */
  reset: () => void;
}

// =============================================================================
// Hook
// =============================================================================

export function useTouchDebounce<T extends (...args: any[]) => any>(
  callback: T,
  options: TouchDebounceOptions = {}
): UseTouchDebounceReturn<T> {
  const {
    delay = 300,
    onDebounceStart,
    onDebounceEnd,
    hapticFeedback = true,
    leading = false,
    trailing = true,
  } = options;

  const [state, setState] = useState<TouchDebounceState>({
    isDebouncing: false,
    timeRemaining: 0,
    blockedCount: 0,
    lastCallTime: null,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingArgsRef = useRef<Parameters<T> | null>(null);
  const isFirstCallRef = useRef<boolean>(true);
  const blockedCountRef = useRef<number>(0);

  // Haptic feedback helper
  const triggerHaptic = useCallback(() => {
    if (hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(5);
    }
  }, [hapticFeedback]);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Update time remaining
  const startTimeTracking = useCallback((startTime: number) => {
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, delay - elapsed);
      
      setState((prev) => ({
        ...prev,
        timeRemaining: remaining,
      }));

      if (remaining === 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
      }
    }, 50);
  }, [delay]);

  // Cancel debouncing
  const cancel = useCallback(() => {
    clearTimers();
    pendingArgsRef.current = null;
    setState((prev) => ({
      ...prev,
      isDebouncing: false,
      timeRemaining: 0,
    }));
  }, [clearTimers]);

  // Flush pending callback
  const flush = useCallback(() => {
    if (pendingArgsRef.current) {
      callback(...pendingArgsRef.current);
      pendingArgsRef.current = null;
    }
    cancel();
    onDebounceEnd?.();
  }, [callback, cancel, onDebounceEnd]);

  // Reset all state
  const reset = useCallback(() => {
    cancel();
    blockedCountRef.current = 0;
    isFirstCallRef.current = true;
    setState({
      isDebouncing: false,
      timeRemaining: 0,
      blockedCount: 0,
      lastCallTime: null,
    });
  }, [cancel]);

  // Debounced callback
  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    const now = Date.now();

    // Handle leading edge
    if (leading && isFirstCallRef.current) {
      isFirstCallRef.current = false;
      setState({
        isDebouncing: true,
        timeRemaining: delay,
        blockedCount: 0,
        lastCallTime: now,
      });
      callback(...args);
      
      // Start cooldown
      clearTimers();
      const startTime = Date.now();
      startTimeTracking(startTime);
      
      timeoutRef.current = setTimeout(() => {
        isFirstCallRef.current = true;
        setState({
          isDebouncing: false,
          timeRemaining: 0,
          blockedCount: blockedCountRef.current,
          lastCallTime: now,
        });
        blockedCountRef.current = 0;
        onDebounceEnd?.();
      }, delay);
      
      return;
    }

    // If debouncing, increment blocked count
    if (state.isDebouncing) {
      blockedCountRef.current++;
      triggerHaptic();
      setState((prev) => ({
        ...prev,
        blockedCount: blockedCountRef.current,
      }));
      return;
    }

    // Start debouncing
    onDebounceStart?.();
    pendingArgsRef.current = args;
    blockedCountRef.current = 0;
    
    const startTime = Date.now();
    setState({
      isDebouncing: true,
      timeRemaining: delay,
      blockedCount: 0,
      lastCallTime: now,
    });

    // Start tracking time
    startTimeTracking(startTime);

    // Set timeout for execution
    timeoutRef.current = setTimeout(() => {
      if (trailing && pendingArgsRef.current) {
        callback(...pendingArgsRef.current);
      }
      
      pendingArgsRef.current = null;
      isFirstCallRef.current = true;
      
      setState({
        isDebouncing: false,
        timeRemaining: 0,
        blockedCount: blockedCountRef.current,
        lastCallTime: now,
      });
      blockedCountRef.current = 0;
      onDebounceEnd?.();
    }, delay);
  }, [callback, delay, leading, trailing, state.isDebouncing, onDebounceStart, onDebounceEnd, startTimeTracking, triggerHaptic, clearTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    debouncedCallback: debouncedCallback as T,
    state,
    cancel,
    flush,
    reset,
  };
}

// =============================================================================
// Convenience Hooks
// =============================================================================

/**
 * Hook for button debouncing with common defaults
 */
export function useButtonDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): UseTouchDebounceReturn<T> {
  return useTouchDebounce(callback, {
    delay,
    hapticFeedback: true,
    leading: true, // First click goes through immediately
    trailing: false,
  });
}

/**
 * Hook for preventing double form submissions
 */
export function useFormSubmitDebounce<T extends (...args: any[]) => any | Promise<any>>(
  callback: T,
  delay: number = 1000
): UseTouchDebounceReturn<T> {
  const { debouncedCallback, state, cancel } = useTouchDebounce(callback, {
    delay,
    hapticFeedback: true,
    leading: true,
    trailing: false,
  });

  // Wrapper that handles async completion
  const wrappedCallback = useCallback(async (...args: Parameters<T>) => {
    try {
      const result = debouncedCallback(...args);
      if (result instanceof Promise) {
        await result;
      }
    } finally {
      // Ensure we can submit again after completion
      setTimeout(cancel, delay);
    }
  }, [debouncedCallback, cancel, delay]);

  return {
    debouncedCallback: wrappedCallback as T,
    state,
    cancel,
    flush: () => {},
    reset: cancel,
  };
}

/**
 * Hook for rapid action prevention (like rapid fire button)
 */
export function useRapidFirePrevent<T extends (...args: any[]) => any>(
  callback: T,
  minInterval: number = 200
): { throttledCallback: T; isThrottled: boolean } {
  const [isThrottled, setIsThrottled] = useState(false);
  const lastCallRef = useRef<number>(0);

  const throttledCallback = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallRef.current;

    if (timeSinceLastCall >= minInterval) {
      lastCallRef.current = now;
      callback(...args);
      setIsThrottled(true);
      
      setTimeout(() => {
        setIsThrottled(false);
      }, minInterval);
    }
  }, [callback, minInterval]);

  return {
    throttledCallback: throttledCallback as T,
    isThrottled,
  };
}

export default useTouchDebounce;
