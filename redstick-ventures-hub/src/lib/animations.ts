/**
 * Animation Constants and Variants for Redstick Ventures
 * 
 * Standardized animation timing, easing, and variants for consistent
 * motion throughout the application.
 */

// Animation timing constants (in seconds)
export const ANIMATION = {
  // Durations
  duration: {
    fast: 0.2,      // 200ms - micro-interactions
    normal: 0.5,    // 500ms - standard transitions
    slow: 0.6,      // 600ms - section reveals
    hero: 0.8,      // 800ms - hero content
  },
  
  // Easing curves
  easing: {
    // Primary easing: smooth deceleration
    default: [0.16, 1, 0.3, 1] as const,
    // Alternative easings
    easeOut: [0, 0, 0.2, 1] as const,
    easeInOut: [0.4, 0, 0.2, 1] as const,
    // For agent pulse
    pulse: [0.4, 0, 0.6, 1] as const,
  },
  
  // Stagger delays (seconds between children)
  stagger: {
    hero: 0.1,      // 100ms - hero section elements
    section: 0.1,   // 100ms - section headers
    card: 0.08,     // 80ms - card grids
    fast: 0.05,     // 50ms - quick sequences
  },
  
  // Viewport threshold for scroll triggers
  // 0.2 = trigger when 20% of element is visible
  threshold: 0.2,
};

// ============================================
// Framer Motion Variants
// ============================================

/**
 * Fade in from below
 * Use for: General content reveals, cards, text blocks
 */
export const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION.duration.slow,
      ease: ANIMATION.easing.default,
    }
  }
};

/**
 * Simple fade in
 * Use for: Subtle reveals, images, icons
 */
export const fadeIn = {
  hidden: { 
    opacity: 0,
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: ANIMATION.duration.normal,
      ease: ANIMATION.easing.default,
    }
  }
};

/**
 * Scale up with fade
 * Use for: Modals, popovers, emphasis
 */
export const scaleIn = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: ANIMATION.duration.fast,
      ease: ANIMATION.easing.default,
    }
  }
};

/**
 * Slide in from left
 * Use for: Side panels, navigation
 */
export const slideInLeft = {
  hidden: { 
    opacity: 0, 
    x: -30,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: ANIMATION.duration.slow,
      ease: ANIMATION.easing.default,
    }
  }
};

/**
 * Slide in from right
 * Use for: Side panels, alternating content
 */
export const slideInRight = {
  hidden: { 
    opacity: 0, 
    x: 30,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: ANIMATION.duration.slow,
      ease: ANIMATION.easing.default,
    }
  }
};

// ============================================
// Container Variants (with stagger)
// ============================================

/**
 * Hero section container
 * Stagger: 100ms between children
 */
export const heroContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION.stagger.hero,
      delayChildren: 0.1,
    }
  }
};

/**
 * Standard section container
 * Stagger: 100ms between children
 */
export const sectionContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION.stagger.section,
      delayChildren: 0.1,
    }
  }
};

/**
 * Card grid container
 * Stagger: 80ms between children
 */
export const cardContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION.stagger.card,
      delayChildren: 0.05,
    }
  }
};

/**
 * Fast stagger container
 * Stagger: 50ms between children
 */
export const fastContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION.stagger.fast,
      delayChildren: 0.05,
    }
  }
};

// ============================================
// Individual Element Variants
// ============================================

/**
 * Hero headline variant
 * Longer duration for dramatic effect
 */
export const heroItem = {
  hidden: { 
    opacity: 0, 
    y: 30,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION.duration.hero,
      ease: ANIMATION.easing.default,
    }
  }
};

/**
 * Card item variant
 * Standard reveal for cards
 */
export const cardItem = {
  hidden: { 
    opacity: 0, 
    y: 30,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION.duration.slow,
      ease: ANIMATION.easing.default,
    }
  }
};

/**
 * List item variant
 * Subtle reveal for list items
 */
export const listItem = {
  hidden: { 
    opacity: 0, 
    x: -10,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: ANIMATION.duration.fast,
      ease: ANIMATION.easing.default,
    }
  }
};

// ============================================
// Hover/Tap Variants
// ============================================

/**
 * Button hover effect
 * Scale down slightly on tap
 */
export const buttonTap = {
  scale: 0.98,
  transition: {
    duration: 0.1,
  }
};

/**
 * Card hover effect
 * Slight lift
 */
export const cardHover = {
  y: -4,
  transition: {
    duration: ANIMATION.duration.fast,
    ease: ANIMATION.easing.default,
  }
};

// ============================================
// Viewport Configuration
// ============================================

/**
 * Standard viewport config for scroll animations
 * Triggers when 20% of element is visible
 * Only triggers once
 */
export const defaultViewport = {
  once: true,
  amount: ANIMATION.threshold,
};

/**
 * Eager viewport config
 * Triggers when any part is visible
 */
export const eagerViewport = {
  once: true,
  amount: 0.1,
};

/**
 * Lazy viewport config
 * Triggers when mostly visible
 */
export const lazyViewport = {
  once: true,
  amount: 0.5,
};
