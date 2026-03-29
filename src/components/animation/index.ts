/**
 * Animation Components Index
 * ==========================
 * Export all animation-related components and utilities.
 * 
 * @example
 * import { 
 *   MotionWrapper, 
 *   FadeIn, 
 *   SlideUp,
 *   StaggerContainer,
 *   StaggerItem 
 * } from '@/components/animation';
 */

// =============================================================================
// Main Components
// =============================================================================

export {
  MotionWrapper,
  FadeIn,
  SlideUp,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  Pulse,
  Spin,
} from './MotionWrapper';

export type { MotionWrapperProps } from './MotionWrapper';

// =============================================================================
// Example Component
// =============================================================================

export { ReducedMotionExample } from './ReducedMotionExample';

// =============================================================================
// Default Export
// =============================================================================

export { default } from './MotionWrapper';
