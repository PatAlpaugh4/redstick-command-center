"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { ANIMATION } from "@/lib/animations";

/**
 * Hook for scroll-triggered animations
 * 
 * Uses Framer Motion's useInView with standardized threshold
 * to trigger animations when elements scroll into view.
 * 
 * @param threshold - Amount of element that must be visible (0-1). Default: 0.2 (20%)
 * @returns { ref, isInView } - Ref to attach to element, boolean for animation state
 * 
 * @example
 * const { ref, isInView } = useScrollAnimation(0.2);
 * 
 * <motion.div
 *   ref={ref}
 *   initial="hidden"
 *   animate={isInView ? "visible" : "hidden"}
 *   variants={fadeInUp}
 * >
 *   Content
 * </motion.div>
 */
export function useScrollAnimation(threshold = ANIMATION.threshold) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: threshold 
  });
  
  return { ref, isInView };
}

/**
 * Hook for scroll-triggered animations with custom options
 * 
 * @param options - Configuration options
 * @param options.threshold - Amount visible to trigger (0-1)
 * @param options.once - Only trigger once (default: true)
 * @param options.amount - Alias for threshold
 * @returns { ref, isInView }
 * 
 * @example
 * const { ref, isInView } = useScrollAnimationCustom({
 *   threshold: 0.5,
 *   once: false // Trigger every time element enters view
 * });
 */
export function useScrollAnimationCustom({
  threshold = ANIMATION.threshold,
  once = true,
}: {
  threshold?: number;
  once?: boolean;
} = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once, 
    amount: threshold 
  });
  
  return { ref, isInView };
}
