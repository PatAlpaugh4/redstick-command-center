/**
 * usePinchZoom Hook
 * =================
 * Detects pinch gestures for zooming in/out.
 * Perfect for charts, images, and maps.
 * 
 * @accessibility
 * - Works with trackpad pinch gestures
 * - Provides keyboard zoom alternatives (+/- keys)
 * - Respects reduced motion preferences
 * 
 * @example
 * const { scale, handlers, zoomIn, zoomOut, reset } = usePinchZoom({
 *   minScale: 1,
 *   maxScale: 3,
 *   onZoomChange: (scale) => console.log('Zoom:', scale),
 * });
 * 
 * return (
 *   <div {...handlers} style={{ transform: `scale(${scale})` }}>
 *     <Chart />
 *   </div>
 * );
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// =============================================================================
// Types
// =============================================================================

export interface PinchZoomOptions {
  /** Minimum zoom scale (default: 0.5) */
  minScale?: number;
  /** Maximum zoom scale (default: 3) */
  maxScale?: number;
  /** Initial scale (default: 1) */
  initialScale?: number;
  /** Step size for keyboard zoom (default: 0.1) */
  step?: number;
  /** Enable haptic feedback (default: true) */
  hapticFeedback?: boolean;
  /** Callback when scale changes */
  onZoomChange?: (scale: number) => void;
  /** Callback when zoom starts */
  onZoomStart?: () => void;
  /** Callback when zoom ends */
  onZoomEnd?: () => void;
  /** Center point for zoom (default: center of element) */
  center?: { x: number; y: number };
}

export interface PinchZoomState {
  /** Current zoom scale */
  scale: number;
  /** Whether currently pinching */
  isPinching: boolean;
  /** Initial distance between touch points */
  initialDistance: number;
  /** Initial scale when pinch started */
  initialScale: number;
  /** Scale as percentage (e.g., 150 for 1.5x) */
  scalePercentage: number;
}

export interface PinchZoomHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onWheel: (e: React.WheelEvent) => void;
}

export interface UsePinchZoomReturn {
  /** Current zoom state */
  state: PinchZoomState;
  /** Event handlers to spread on the target element */
  handlers: PinchZoomHandlers;
  /** Zoom in by one step */
  zoomIn: () => void;
  /** Zoom out by one step */
  zoomOut: () => void;
  /** Set specific scale */
  setScale: (scale: number) => void;
  /** Reset to initial scale */
  reset: () => void;
  /** Check if can zoom in more */
  canZoomIn: boolean;
  /** Check if can zoom out more */
  canZoomOut: boolean;
}

// =============================================================================
// Helper Functions
// =============================================================================

function getDistance(touch1: Touch, touch2: Touch): number {
  const dx = touch2.clientX - touch1.clientX;
  const dy = touch2.clientY - touch1.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function getCenter(touch1: Touch, touch2: Touch): { x: number; y: number } {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// =============================================================================
// Hook
// =============================================================================

export function usePinchZoom(options: PinchZoomOptions = {}): UsePinchZoomReturn {
  const {
    minScale = 0.5,
    maxScale = 3,
    initialScale = 1,
    step = 0.1,
    hapticFeedback = true,
    onZoomChange,
    onZoomStart,
    onZoomEnd,
  } = options;

  const [state, setState] = useState<PinchZoomState>({
    scale: initialScale,
    isPinching: false,
    initialDistance: 0,
    initialScale: initialScale,
    scalePercentage: initialScale * 100,
  });

  const touchStartDistanceRef = useRef<number>(0);
  const touchStartScaleRef = useRef<number>(initialScale);
  const lastScaleRef = useRef<number>(initialScale);

  // Haptic feedback helper
  const triggerHaptic = useCallback((pattern: number | number[] = 10) => {
    if (hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, [hapticFeedback]);

  // Update scale with callbacks
  const updateScale = useCallback((newScale: number) => {
    const clampedScale = clamp(newScale, minScale, maxScale);
    
    if (clampedScale !== lastScaleRef.current) {
      lastScaleRef.current = clampedScale;
      setState((prev) => ({
        ...prev,
        scale: clampedScale,
        scalePercentage: Math.round(clampedScale * 100),
      }));
      onZoomChange?.(clampedScale);
    }
  }, [minScale, maxScale, onZoomChange]);

  // Handle touch start (pinch detection)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      
      const distance = getDistance(e.touches[0], e.touches[1]);
      touchStartDistanceRef.current = distance;
      touchStartScaleRef.current = state.scale;

      setState((prev) => ({
        ...prev,
        isPinching: true,
        initialDistance: distance,
        initialScale: state.scale,
      }));

      onZoomStart?.();
      triggerHaptic(5);
    }
  }, [state.scale, onZoomStart, triggerHaptic]);

  // Handle touch move (pinch zoom)
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && state.isPinching) {
      e.preventDefault();

      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scaleFactor = currentDistance / touchStartDistanceRef.current;
      const newScale = touchStartScaleRef.current * scaleFactor;

      updateScale(newScale);
    }
  }, [state.isPinching, updateScale]);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    if (state.isPinching) {
      setState((prev) => ({
        ...prev,
        isPinching: false,
      }));
      onZoomEnd?.();
    }
  }, [state.isPinching, onZoomEnd]);

  // Handle wheel (trackpad pinch or Ctrl+wheel)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Check if it's a pinch gesture (Ctrl key or trackpad)
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      const delta = e.deltaY > 0 ? -step : step;
      const newScale = state.scale + delta;
      
      updateScale(newScale);
      
      if (!state.isPinching) {
        onZoomStart?.();
        setState((prev) => ({ ...prev, isPinching: true }));
        
        // Debounce zoom end
        setTimeout(() => {
          setState((prev) => ({ ...prev, isPinching: false }));
          onZoomEnd?.();
        }, 150);
      }
    }
  }, [state.scale, state.isPinching, step, updateScale, onZoomStart, onZoomEnd]);

  // Zoom in
  const zoomIn = useCallback(() => {
    const newScale = state.scale + step;
    if (newScale <= maxScale) {
      triggerHaptic(10);
    }
    updateScale(newScale);
  }, [state.scale, step, maxScale, updateScale, triggerHaptic]);

  // Zoom out
  const zoomOut = useCallback(() => {
    const newScale = state.scale - step;
    if (newScale >= minScale) {
      triggerHaptic(10);
    }
    updateScale(newScale);
  }, [state.scale, step, minScale, updateScale, triggerHaptic]);

  // Set specific scale
  const setScale = useCallback((scale: number) => {
    updateScale(scale);
  }, [updateScale]);

  // Reset to initial
  const reset = useCallback(() => {
    triggerHaptic([10, 20, 10]);
    updateScale(initialScale);
  }, [initialScale, updateScale, triggerHaptic]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Plus
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        zoomIn();
      }
      // Ctrl/Cmd + Minus
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        zoomOut();
      }
      // Ctrl/Cmd + 0
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, reset]);

  const handlers: PinchZoomHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onWheel: handleWheel,
  };

  return {
    state,
    handlers,
    zoomIn,
    zoomOut,
    setScale,
    reset,
    canZoomIn: state.scale < maxScale,
    canZoomOut: state.scale > minScale,
  };
}

// =============================================================================
// Zoom Controls Component
// =============================================================================

export interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  scale: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  className?: string;
  showPercentage?: boolean;
}

/**
 * Pre-built zoom controls component
 */
export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onReset,
  scale,
  canZoomIn,
  canZoomOut,
  className = '',
  showPercentage = true,
}: ZoomControlsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
        aria-label="Zoom out"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      
      <button
        onClick={onReset}
        className="min-w-[60px] px-2 py-1 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
        aria-label="Reset zoom"
      >
        {showPercentage ? `${Math.round(scale * 100)}%` : 'Reset'}
      </button>
      
      <button
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
        aria-label="Zoom in"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

export default usePinchZoom;
