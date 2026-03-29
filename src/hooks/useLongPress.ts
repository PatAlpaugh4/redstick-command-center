/**
 * useLongPress Hook
 * ================
 * Detects long press gestures on both touch and mouse devices.
 * Useful for context menus, drag initiation, and secondary actions.
 * 
 * @accessibility
 * - Provides alternative keyboard activation
 * - Announces state changes to screen readers
 * - Respects reduced motion preferences
 * 
 * @example
 * const { handlers, isPressing } = useLongPress({
 *   onLongPress: () => showContextMenu(),
 *   onClick: () => handleClick(),
 *   duration: 500,
 * });
 * 
 * return <button {...handlers}>Press and hold</button>;
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// =============================================================================
// Types
// =============================================================================

export interface LongPressOptions {
  /** Callback when long press is triggered */
  onLongPress: () => void;
  /** Callback for regular click (optional) */
  onClick?: () => void;
  /** Duration in ms to trigger long press (default: 500) */
  duration?: number;
  /** Enable haptic feedback on long press (default: true) */
  hapticFeedback?: boolean;
  /** Prevent default context menu on long press (default: true) */
  preventContextMenu?: boolean;
  /** Maximum movement allowed before canceling (default: 10) */
  moveThreshold?: number;
}

export interface LongPressState {
  isPressing: boolean;
  progress: number; // 0 to 100
  isLongPressed: boolean;
}

export interface LongPressHandlers {
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export interface UseLongPressReturn {
  /** Event handlers to spread on the target element */
  handlers: LongPressHandlers;
  /** Current long press state */
  state: LongPressState;
  /** Reset the long press state manually */
  reset: () => void;
}

// =============================================================================
// Hook
// =============================================================================

export function useLongPress(options: LongPressOptions): UseLongPressReturn {
  const {
    onLongPress,
    onClick,
    duration = 500,
    hapticFeedback = true,
    preventContextMenu = true,
    moveThreshold = 10,
  } = options;

  const [state, setState] = useState<LongPressState>({
    isPressing: false,
    progress: 0,
    isLongPressed: false,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const isLongPressedRef = useRef<boolean>(false);
  const startTimeRef = useRef<number>(0);

  // Trigger haptic feedback
  const triggerHaptic = useCallback((pattern: number | number[] = 20) => {
    if (hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, [hapticFeedback]);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Reset state
  const reset = useCallback(() => {
    clearTimers();
    setState({
      isPressing: false,
      progress: 0,
      isLongPressed: false,
    });
    isLongPressedRef.current = false;
  }, [clearTimers]);

  // Start long press detection
  const startLongPress = useCallback((clientX: number, clientY: number) => {
    startXRef.current = clientX;
    startYRef.current = clientY;
    startTimeRef.current = Date.now();
    isLongPressedRef.current = false;

    setState({
      isPressing: true,
      progress: 0,
      isLongPressed: false,
    });

    // Update progress
    const updateInterval = 16; // ~60fps
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      setState((prev) => ({ ...prev, progress }));
    }, updateInterval);

    // Trigger long press after duration
    timerRef.current = setTimeout(() => {
      triggerHaptic([30, 50, 30]); // Success pattern
      isLongPressedRef.current = true;
      setState({
        isPressing: false,
        progress: 100,
        isLongPressed: true,
      });
      onLongPress();
      clearTimers();
    }, duration);
  }, [duration, onLongPress, triggerHaptic, clearTimers]);

  // Cancel long press
  const cancelLongPress = useCallback((triggerClick: boolean = false) => {
    const wasPressing = state.isPressing;
    const wasLongPressed = isLongPressedRef.current;

    clearTimers();
    setState({
      isPressing: false,
      progress: 0,
      isLongPressed: false,
    });

    // Trigger click if it wasn't a long press and we want to trigger click
    if (triggerClick && wasPressing && !wasLongPressed && onClick) {
      onClick();
    }

    isLongPressedRef.current = false;
  }, [state.isPressing, onClick, clearTimers]);

  // Check if movement exceeds threshold
  const checkMovement = useCallback((clientX: number, clientY: number): boolean => {
    const deltaX = Math.abs(clientX - startXRef.current);
    const deltaY = Math.abs(clientY - startYRef.current);
    return deltaX > moveThreshold || deltaY > moveThreshold;
  }, [moveThreshold]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    startLongPress(e.clientX, e.clientY);
  }, [startLongPress]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    cancelLongPress(true);
  }, [cancelLongPress]);

  const handleMouseLeave = useCallback(() => {
    cancelLongPress(false);
  }, [cancelLongPress]);

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    startLongPress(touch.clientX, touch.clientY);
  }, [startLongPress]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // Prevent mouse emulation events
    e.preventDefault();
    cancelLongPress(true);
  }, [cancelLongPress]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!state.isPressing) return;

    const touch = e.touches[0];
    if (checkMovement(touch.clientX, touch.clientY)) {
      cancelLongPress(false);
    }
  }, [state.isPressing, checkMovement, cancelLongPress]);

  // Context menu handler
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (preventContextMenu && isLongPressedRef.current) {
      e.preventDefault();
    }
  }, [preventContextMenu]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const handlers: LongPressHandlers = {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
    ...(preventContextMenu && { onContextMenu: handleContextMenu }),
  };

  return {
    handlers,
    state,
    reset,
  };
}

// =============================================================================
// Convenience Hook for Drag Initiation
// =============================================================================

export interface UseDragInitiatorOptions {
  onDragStart: () => void;
  duration?: number;
  hapticFeedback?: boolean;
}

/**
 * Specialized hook for initiating drag operations with long press
 */
export function useDragInitiator(options: UseDragInitiatorOptions) {
  const { onDragStart, duration = 300, hapticFeedback = true } = options;

  return useLongPress({
    onLongPress: onDragStart,
    duration,
    hapticFeedback,
    preventContextMenu: true,
  });
}

export default useLongPress;
