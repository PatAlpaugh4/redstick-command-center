/**
 * Providers Index
 * ===============
 * Export all context providers for easy importing.
 * 
 * @example
 * import { 
 *   AuthProvider,
 *   QueryClientProvider,
 *   ToastProvider,
 *   ReducedMotionProvider 
 * } from '@/components/providers';
 */

// =============================================================================
// Providers
// =============================================================================

export { AuthProvider } from './AuthProvider';
export { QueryClientProvider } from './QueryClientProvider';
export { ToastProvider } from './ToastProvider';
export { NotificationProvider } from './NotificationProvider';
export { 
  ReducedMotionProvider,
  useReducedMotionContext,
  useReducedMotionPreference,
} from './ReducedMotionProvider';

// =============================================================================
// Types
// =============================================================================

export type { ReducedMotionContextValue } from './ReducedMotionProvider';
