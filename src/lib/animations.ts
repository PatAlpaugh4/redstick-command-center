/**
 * Animation Utilities
 * ===================
 * Shared animation configurations and variants for Framer Motion.
 * All animations respect the user's reduced motion preference.
 * 
 * @example
 * import { fadeVariants, withReducedMotion } from '@/lib/animations';
 * 
 * <motion.div
 *   variants={fadeVariants}
 *   initial="hidden"
 *   animate="visible"
 * />
 */

import { Variants, Transition, AnimationProps } from "framer-motion";

// =============================================================================
// Types
// =============================================================================

export interface AnimationVariants {
  hidden?: Record<string, number | string>;
  visible?: Record<string, number | string>;
  exit?: Record<string, number | string>;
  [key: string]: Record<string, number | string> | undefined;
}

// =============================================================================
// Duration Constants
// =============================================================================

export const DURATIONS = {
  /** Near-instant for reduced motion */
  instant: 0.01,
  /** Fast transitions (150ms equivalent) */
  fast: 0.15,
  /** Normal transitions (300ms equivalent) */
  normal: 0.3,
  /** Slow transitions (500ms equivalent) */
  slow: 0.5,
  /** Page transitions */
  page: 0.4,
} as const;

// =============================================================================
// Easing Functions
// =============================================================================

export const EASINGS = {
  /** Standard ease-out curve */
  default: [0.16, 1, 0.3, 1] as const,
  /** Spring-like bounce */
  spring: { type: "spring", stiffness: 500, damping: 30 } as const,
  /** Gentle ease */
  gentle: [0.4, 0, 0.2, 1] as const,
} as const;

// =============================================================================
// Reduced Motion Helpers
// =============================================================================

/**
 * Wraps animation variants with reduced motion support.
 * Reduces all transition durations to near-instant when reduced motion is preferred.
 * 
 * @param variants - The animation variants to wrap
 * @returns Variants with reduced motion transitions
 */
export function withReducedMotion(variants: AnimationVariants): AnimationVariants {
  const reduceTransition = (transition: Transition = {}): Transition => ({
    ...transition,
    duration: DURATIONS.instant,
    // Disable spring animations
    type: "tween",
  });

  const reducedVariants: AnimationVariants = { ...variants };

  Object.keys(variants).forEach((key) => {
    const variant = variants[key];
    if (variant && typeof variant === "object") {
      reducedVariants[key] = {
        ...variant,
        transition: reduceTransition(variant.transition as Transition),
      };
    }
  });

  return reducedVariants;
}

/**
 * Creates fade-only variants for reduced motion compatibility.
 * Removes all transform-based animations, keeps only opacity changes.
 */
export function createFadeOnlyVariants(
  duration: number = DURATIONS.normal
): AnimationVariants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration },
    },
    exit: {
      opacity: 0,
      transition: { duration: DURATIONS.fast },
    },
  };
}

// =============================================================================
// Standard Variants
// =============================================================================

/** Simple fade in/out */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATIONS.normal, ease: EASINGS.default },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATIONS.fast },
  },
};

/** Fade variants optimized for reduced motion */
export const fadeVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATIONS.instant },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATIONS.instant },
  },
};

/** Slide up animation */
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.default },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: DURATIONS.fast },
  },
};

/** Slide up with reduced motion (converts to fade only) */
export const slideUpVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATIONS.instant },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATIONS.instant },
  },
};

/** Scale in animation (modals, dialogs) */
export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATIONS.normal, ease: EASINGS.default },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: DURATIONS.fast },
  },
};

/** Scale variants for reduced motion (no scale, just fade) */
export const scaleVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATIONS.instant },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATIONS.instant },
  },
};

/** Page transition variants */
export const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: DURATIONS.page, ease: EASINGS.default },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATIONS.fast },
  },
};

/** Stagger container for lists */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Stagger container for reduced motion (no stagger delay) */
export const staggerContainerReduced: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATIONS.instant,
    },
  },
};

/** Stagger item for lists */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.default },
  },
};

/** Stagger item for reduced motion */
export const staggerItemReduced: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATIONS.instant },
  },
};

// =============================================================================
// Toast Variants
// =============================================================================

export const toastVariants: Variants = {
  initial: { opacity: 0, x: 100, scale: 0.9 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: DURATIONS.normal, ease: EASINGS.default },
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.9,
    transition: { duration: DURATIONS.fast },
  },
};

/** Toast variants for reduced motion (simpler, faster) */
export const toastVariantsReduced: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: DURATIONS.instant },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATIONS.instant },
  },
};

// =============================================================================
// Modal/Dialog Variants
// =============================================================================

export const modalOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATIONS.fast },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATIONS.fast },
  },
};

export const modalContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: DURATIONS.normal, ease: EASINGS.default },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: DURATIONS.fast },
  },
};

/** Modal variants for reduced motion (fade only, no scale) */
export const modalContentVariantsReduced: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATIONS.instant },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATIONS.instant },
  },
};

// =============================================================================
// Continuous Animations (to disable for reduced motion)
// =============================================================================

/** Pulse animation - DISABLED for reduced motion */
export const pulseAnimation: AnimationProps["animate"] = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
};

/** Spin animation - DISABLED for reduced motion */
export const spinAnimation: AnimationProps["animate"] = {
  rotate: 360,
  transition: { duration: 1, repeat: Infinity, ease: "linear" },
};

/** Bounce animation - DISABLED for reduced motion */
export const bounceAnimation: AnimationProps["animate"] = {
  y: [0, -10, 0],
  transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Selects the appropriate variants based on reduced motion preference
 * @param normal - Normal animation variants
 * @param reduced - Reduced motion variants (optional, defaults to fade only)
 * @param prefersReducedMotion - Whether reduced motion is preferred
 * @returns Appropriate variants
 */
export function selectVariants(
  normal: Variants,
  reduced: Variants | undefined,
  prefersReducedMotion: boolean
): Variants {
  if (prefersReducedMotion) {
    return reduced || fadeVariantsReduced;
  }
  return normal;
}

/**
 * Creates transition config based on reduced motion preference
 * @param prefersReducedMotion - Whether reduced motion is preferred
 * @param normalConfig - Normal transition configuration
 * @returns Transition configuration
 */
export function createTransition(
  prefersReducedMotion: boolean,
  normalConfig: Transition = { duration: DURATIONS.normal }
): Transition {
  if (prefersReducedMotion) {
    return { duration: DURATIONS.instant };
  }
  return normalConfig;
}

/**
 * Returns empty animation props when reduced motion is preferred
 * Useful for disabling continuous animations
 * @param prefersReducedMotion - Whether reduced motion is preferred
 * @returns Animation props or empty object
 */
export function disableIfReducedMotion<T extends Record<string, unknown>>(
  prefersReducedMotion: boolean,
  animationProps: T
): T | Record<string, never> {
  return prefersReducedMotion ? {} : animationProps;
}
