/**
 * Accessibility Components
 * =========================
 * Reusable accessibility components for screen reader support and keyboard navigation.
 * 
 * @example
 * ```tsx
 * import { SkipLink, LiveRegion, useAnnouncer } from '@/components/a11y';
 * 
 * function App() {
 *   return (
 *     <>
 *       <SkipLink targetId="main-content" />
 *       <main id="main-content">
 *         <Content />
 *       </main>
 *     </>
 *   );
 * }
 * ```
 */

// =============================================================================
// Skip Link Component
// =============================================================================

export {
  SkipLink,
  SkipLinks,
  useSkipTarget,
  type SkipLinkProps,
  type SkipLinksProps,
} from './SkipLink';

// =============================================================================
// Announcer / Live Region Components
// =============================================================================

export {
  // Components
  Announcer,
  AnnouncerProvider,
  LiveRegion,
  LiveRegionProvider,
  BatchAnnouncer,
  
  // Hooks
  useAnnouncer,
  useLiveRegion,
  useLoadingAnnouncer,
  useFormAnnouncer,
  useNavigationAnnouncer,
  useStatusAnnouncer,
  
  // Types
  type AnnouncerProps,
  type AnnouncerContextValue,
  type AnnouncementPriority,
  type Announcement,
} from './Announcer';

// Re-export LiveRegion types
export type {
  LiveRegionPriority,
  LiveRegionProps,
  LiveRegionContextValue,
  UseStatusAnnouncerReturn,
  UseFormAnnouncerReturn,
  UseNavigationAnnouncerReturn,
  BatchAnnouncerProps,
} from './LiveRegion';

// =============================================================================
// Combined Provider
// =============================================================================

import { AnnouncerProvider } from './Announcer';

/**
 * Combined accessibility provider that sets up all a11y components.
 * Use this at the root of your app.
 */
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  return (
    <AnnouncerProvider>
      {children}
    </AnnouncerProvider>
  );
}

// Default exports
export { default as SkipLinkDefault } from './SkipLink';
export { default as AnnouncerDefault } from './Announcer';
export { default as LiveRegionDefault } from './LiveRegion';
