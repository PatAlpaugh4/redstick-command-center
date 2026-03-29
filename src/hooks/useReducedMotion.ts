/**
 * useReducedMotion Hook
 * =====================
 * Detects user's motion preference using the prefers-reduced-motion media query.
 * Returns true if the user prefers reduced motion (accessibility setting).
 * 
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * 
 * // Use in animations
 * <motion.div
 *   animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
 * />
 */

"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if user prefers reduced motion
 * @returns boolean indicating if reduced motion is preferred
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === "undefined") {
      return;
    }

    // Create media query for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Handler for preference changes
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    // Add listener (with fallback for older browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    } else {
      // Fallback for Safari < 14
      mediaQuery.addListener(handler);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler);
      } else {
        // Fallback for Safari < 14
        mediaQuery.removeListener(handler);
      }
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook that returns animation props based on reduced motion preference
 * Useful for conditionally applying animations
 * 
 * @example
 * const animationProps = useMotionPreference({
 *   animate: { scale: [1, 1.05, 1] },
 *   transition: { duration: 2, repeat: Infinity }
 * });
 * 
 * <motion.div {...animationProps} />
 */
export function useMotionPreference<T extends Record<string, unknown>>(
  animatedProps: T
): T | Record<string, never> {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return {};
  }
  
  return animatedProps;
}

/**
 * Hook to get transition duration based on reduced motion preference
 * @param normalDuration - Normal animation duration in seconds
 * @param reducedDuration - Duration when reduced motion is preferred (default: 0.01)
 * @returns Appropriate duration value
 * 
 * @example
 * const duration = useAnimationDuration(0.5);
 * // Returns 0.5 normally, 0.01 when reduced motion is on
 */
export function useAnimationDuration(
  normalDuration: number,
  reducedDuration: number = 0.01
): number {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedDuration : normalDuration;
}

/**
 * Hook to conditionally disable animations
 * @returns Object with utility flags and helpers
 * 
 * @example
 * const { shouldAnimate, transition, instant } = useAnimationControl();
 * 
 * <motion.div
 *   animate={shouldAnimate ? { y: 20 } : {}}
 *   transition={transition}
 * />
 */
export function useAnimationControl() {
  const prefersReducedMotion = useReducedMotion();
  
  return {
    /** Whether animations should play */
    shouldAnimate: !prefersReducedMotion,
    /** Whether to use reduced motion */
    prefersReducedMotion,
    /** Transition config for normal animations */
    transition: {
      duration: prefersReducedMotion ? 0.01 : 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
    /** Instant transition for reduced motion */
    instant: {
      duration: 0.01,
    },
    /** Fade-only transition (respects reduced motion) */
    fadeTransition: {
      duration: prefersReducedMotion ? 0.01 : 0.2,
    },
  };
}

export default useReducedMotion;
