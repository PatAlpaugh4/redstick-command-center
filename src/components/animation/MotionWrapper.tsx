/**
 * MotionWrapper Component
 * =======================
 * A wrapper component that automatically respects the user's reduced motion preference.
 * Wraps Framer Motion's motion.div and applies appropriate variants based on settings.
 * 
 * @example
 * <MotionWrapper
 *   variants={fadeVariants}
 *   initial="hidden"
 *   animate="visible"
 * >
 *   <YourContent />
 * </MotionWrapper>
 */

"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  fadeVariantsReduced,
  withReducedMotion,
  selectVariants,
} from "@/lib/animations";

// =============================================================================
// Types
// =============================================================================

export interface MotionWrapperProps extends Omit<HTMLMotionProps<"div">, "children"> {
  /** Child elements to animate */
  children: ReactNode;
  /** Animation variants */
  variants?: Variants;
  /** Reduced motion variants (optional, auto-generated if not provided) */
  reducedVariants?: Variants;
  /** Whether to disable animations completely when reduced motion is on */
  disableOnReducedMotion?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function MotionWrapper({
  children,
  variants,
  reducedVariants,
  disableOnReducedMotion = false,
  ...props
}: MotionWrapperProps) {
  const prefersReducedMotion = useReducedMotion();

  // If no variants provided, just render with props
  if (!variants) {
    return <motion.div {...props}>{children}</motion.div>;
  }

  // If reduced motion is preferred
  if (prefersReducedMotion) {
    // Option 1: Completely disable animations
    if (disableOnReducedMotion) {
      return <div className={props.className}>{children}</div>;
    }

    // Option 2: Use provided reduced variants or generate them
    const safeVariants = reducedVariants || withReducedMotion(variants);

    return (
      <motion.div variants={safeVariants} {...props}>
        {children}
      </motion.div>
    );
  }

  // Normal motion - use original variants
  return (
    <motion.div variants={variants} {...props}>
      {children}
    </motion.div>
  );
}

// =============================================================================
// Specialized Wrappers
// =============================================================================

/**
 * FadeIn wrapper - simple fade animation with reduced motion support
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  ...props
}: Omit<MotionWrapperProps, "variants"> & { delay?: number }) {
  const prefersReducedMotion = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.3,
        delay: prefersReducedMotion ? 0 : delay,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * SlideUp wrapper - slide up animation with reduced motion support
 */
export function SlideUp({
  children,
  className,
  delay = 0,
  y = 20,
  ...props
}: Omit<MotionWrapperProps, "variants"> & { delay?: number; y?: number }) {
  const prefersReducedMotion = useReducedMotion();

  const variants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.01 },
        },
      }
    : {
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.3, delay, ease: [0.16, 1, 0.3, 1] },
        },
      };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScaleIn wrapper - scale animation with reduced motion support
 * Good for modals and dialogs
 */
export function ScaleIn({
  children,
  className,
  delay = 0,
  ...props
}: Omit<MotionWrapperProps, "variants"> & { delay?: number }) {
  const prefersReducedMotion = useReducedMotion();

  const variants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.01 },
        },
        exit: { opacity: 0, transition: { duration: 0.01 } },
      }
    : {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.3, delay, ease: [0.16, 1, 0.3, 1] },
        },
        exit: {
          opacity: 0,
          scale: 0.95,
          transition: { duration: 0.2 },
        },
      };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer - container for staggered children animations
 */
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
  delayChildren = 0.1,
  ...props
}: Omit<MotionWrapperProps, "variants"> & {
  staggerDelay?: number;
  delayChildren?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  const variants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.01 },
        },
      }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren,
          },
        },
      };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem - child item for stagger animations
 */
export function StaggerItem({
  children,
  className,
  ...props
}: Omit<MotionWrapperProps, "variants">) {
  const prefersReducedMotion = useReducedMotion();

  const variants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.01 },
        },
      }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        },
      };

  return (
    <motion.div variants={variants} className={className} {...props}>
      {children}
    </motion.div>
  );
}

/**
 * Pulse - continuous pulse animation (DISABLED for reduced motion)
 */
export function Pulse({
  children,
  className,
  intensity = 1.05,
  ...props
}: Omit<MotionWrapperProps, "variants"> & { intensity?: number }) {
  const prefersReducedMotion = useReducedMotion();

  // Disable completely for reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{
        scale: [1, intensity, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Spin - continuous spin animation (DISABLED for reduced motion)
 */
export function Spin({
  children,
  className,
  duration = 1,
  ...props
}: Omit<MotionWrapperProps, "variants"> & { duration?: number }) {
  const prefersReducedMotion = useReducedMotion();

  // Disable completely for reduced motion
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default MotionWrapper;
