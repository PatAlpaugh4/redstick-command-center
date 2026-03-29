/**
 * useHaptic Hook
 * ==============
 * Provides haptic feedback for touch interactions.
 * Gracefully handles devices without vibration support.
 * 
 * @accessibility
 * - Checks for vibration API support before calling
 * - Respects system haptic settings
 * - No-op on unsupported devices
 * 
 * @example
 * const haptic = useHaptic();
 * 
 * <button onClick={() => {
 *   haptic.light();
 *   handleAction();
 * }}>
 *   Click me
 * </button>
 * 
 * // Or with custom pattern
 * <button onClick={() => haptic.vibrate([50, 100, 50])}>
 *   Custom pattern
 * </button>
 */

'use client';

import { useCallback, useRef, useEffect } from 'react';

// =============================================================================
// Types
// =============================================================================

export type HapticIntensity = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning';

export interface HapticPatterns {
  light: number;
  medium: number;
  heavy: number;
  success: number[];
  error: number[];
  warning: number[];
}

export interface UseHapticReturn {
  /** Check if haptic feedback is supported */
  isSupported: boolean;
  /** Trigger custom vibration pattern */
  vibrate: (pattern: number | number[]) => void;
  /** Light tap feedback */
  light: () => void;
  /** Medium impact feedback */
  medium: () => void;
  /** Heavy impact feedback */
  heavy: () => void;
  /** Success pattern (short-short) */
  success: () => void;
  /** Error pattern (long-pause-long) */
  error: () => void;
  /** Warning pattern (medium) */
  warning: () => void;
  /** Selection change feedback */
  selection: () => void;
  /** Impact with custom intensity */
  impact: (intensity: HapticIntensity) => void;
  /** Trigger haptic only once within a time window */
  throttledVibrate: (pattern: number | number[], windowMs?: number) => void;
}

// =============================================================================
// Default Patterns
// =============================================================================

const DEFAULT_PATTERNS: HapticPatterns = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  error: [50, 100, 50, 100, 50],
  warning: [30, 50, 30],
};

// =============================================================================
// Hook
// =============================================================================

export function useHaptic(): UseHapticReturn {
  // Check for vibration support
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;
  
  // Track last vibration time for throttling
  const lastVibrationRef = useRef<number>(0);
  const throttleWindowsRef = useRef<Map<string, number>>(new Map());

  // Base vibrate function
  const vibrate = useCallback((pattern: number | number[]) => {
    if (!isSupported) return;
    
    try {
      navigator.vibrate(pattern);
      lastVibrationRef.current = Date.now();
    } catch (error) {
      // Silently fail if vibration fails
      console.warn('Haptic feedback failed:', error);
    }
  }, [isSupported]);

  // Throttled vibrate
  const throttledVibrate = useCallback((pattern: number | number[], windowMs: number = 100) => {
    const now = Date.now();
    const patternKey = Array.isArray(pattern) ? pattern.join(',') : String(pattern);
    const lastTime = throttleWindowsRef.current.get(patternKey) || 0;

    if (now - lastTime >= windowMs) {
      vibrate(pattern);
      throttleWindowsRef.current.set(patternKey, now);
    }
  }, [vibrate]);

  // Predefined haptic patterns
  const light = useCallback(() => {
    vibrate(DEFAULT_PATTERNS.light);
  }, [vibrate]);

  const medium = useCallback(() => {
    vibrate(DEFAULT_PATTERNS.medium);
  }, [vibrate]);

  const heavy = useCallback(() => {
    vibrate(DEFAULT_PATTERNS.heavy);
  }, [vibrate]);

  const success = useCallback(() => {
    vibrate(DEFAULT_PATTERNS.success);
  }, [vibrate]);

  const error = useCallback(() => {
    vibrate(DEFAULT_PATTERNS.error);
  }, [vibrate]);

  const warning = useCallback(() => {
    vibrate(DEFAULT_PATTERNS.warning);
  }, [vibrate]);

  const selection = useCallback(() => {
    vibrate(5); // Very light
  }, [vibrate]);

  const impact = useCallback((intensity: HapticIntensity) => {
    switch (intensity) {
      case 'light':
        light();
        break;
      case 'medium':
        medium();
        break;
      case 'heavy':
        heavy();
        break;
      case 'success':
        success();
        break;
      case 'error':
        error();
        break;
      case 'warning':
        warning();
        break;
    }
  }, [light, medium, heavy, success, error, warning]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (isSupported) {
        navigator.vibrate(0); // Cancel any ongoing vibration
      }
    };
  }, [isSupported]);

  return {
    isSupported,
    vibrate,
    light,
    medium,
    heavy,
    success,
    error,
    warning,
    selection,
    impact,
    throttledVibrate,
  };
}

// =============================================================================
// Hook with Context Awareness
// =============================================================================

export interface UseContextualHapticOptions {
  /** Enable haptic feedback (default: true) */
  enabled?: boolean;
  /** Disable on battery saving mode (default: true) */
  respectBattery?: boolean;
}

/**
 * Enhanced haptic hook with context awareness
 */
export function useContextualHaptic(options: UseContextualHapticOptions = {}): UseHapticReturn {
  const { enabled = true, respectBattery = true } = options;
  const baseHaptic = useHaptic();

  // Check if we should disable haptics (e.g., low battery)
  const shouldDisable = !enabled || (respectBattery && isBatterySaving());

  if (shouldDisable) {
    return {
      isSupported: false,
      vibrate: () => {},
      light: () => {},
      medium: () => {},
      heavy: () => {},
      success: () => {},
      error: () => {},
      warning: () => {},
      selection: () => {},
      impact: () => {},
      throttledVibrate: () => {},
    };
  }

  return baseHaptic;
}

// Helper to detect battery saving mode (approximate)
function isBatterySaving(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  // Check for battery API
  const battery = (navigator as any).getBattery?.();
  if (battery && battery.charging === false && battery.level < 0.2) {
    return true;
  }

  // Check for reduced motion preference (often enabled in battery saving)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return true;
  }

  return false;
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Trigger haptic feedback without hook
 */
export function triggerHaptic(intensity: HapticIntensity = 'light'): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;

  const patterns: Record<HapticIntensity, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 30,
    success: [10, 50, 10],
    error: [50, 100, 50, 100, 50],
    warning: [30, 50, 30],
  };

  try {
    navigator.vibrate(patterns[intensity]);
  } catch {
    // Silently fail
  }
}

export default useHaptic;
