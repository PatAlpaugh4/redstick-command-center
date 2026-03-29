/**
 * Live Region Component
 * =====================
 * ARIA live region for announcing dynamic content changes to screen readers.
 * 
 * WCAG 2.1: 4.1.3 Status Messages
 * - Use polite for non-urgent updates (most common)
 * - Use assertive for urgent notifications that need immediate attention
 * - Use off when the region should not be announced
 * 
 * @accessibility
 * - aria-live: polite, assertive, or off
 * - aria-atomic: true (announce entire region) or false (announce changes only)
 * - aria-relevant: additions, removals, text, all
 * 
 * @usage
 * ```tsx
 * // For status updates
 * <LiveRegion>
 *   {statusMessage}
 * </LiveRegion>
 * 
 * // For error alerts
 * <LiveRegion priority="assertive" role="alert">
 *   {errorMessage}
 * </LiveRegion>
 * 
 * // Hook usage
 * const { announce } = useLiveRegion();
 * announce('Item saved successfully');
 * ```
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

export type LiveRegionPriority = 'polite' | 'assertive' | 'off';

export interface LiveRegionProps {
  /** Content to announce */
  children?: React.ReactNode;
  /** Priority level for announcements */
  priority?: LiveRegionPriority;
  /** Whether to announce the entire region or just changes */
  atomic?: boolean;
  /** ARIA role */
  role?: 'status' | 'alert' | 'log' | 'marquee' | 'timer' | 'none';
  /** Additional CSS classes */
  className?: string;
  /** Unique identifier for the region */
  id?: string;
}

export interface LiveRegionContextValue {
  /** Make an announcement */
  announce: (message: string, priority?: LiveRegionPriority) => void;
  /** Clear all announcements */
  clear: () => void;
}

// =============================================================================
// Context
// =============================================================================

const LiveRegionContext = createContext<LiveRegionContextValue | undefined>(undefined);

/**
 * Hook to access the live region context
 * Must be used within a LiveRegionProvider
 */
export function useLiveRegion(): LiveRegionContextValue {
  const context = useContext(LiveRegionContext);
  if (context === undefined) {
    throw new Error('useLiveRegion must be used within a LiveRegionProvider');
  }
  return context;
}

// =============================================================================
// Live Region Provider
// =============================================================================

export interface LiveRegionProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that manages live regions for screen reader announcements.
 * Place this once at the app root level.
 */
export const LiveRegionProvider: React.FC<LiveRegionProviderProps> = ({ children }) => {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const announce = useCallback((message: string, priority: LiveRegionPriority = 'polite') => {
    if (!message?.trim()) return;

    const trimmedMessage = message.trim();

    if (priority === 'assertive') {
      // Clear first to ensure the announcement is made
      setAssertiveMessage('');
      // Small delay to ensure screen reader catches the change
      requestAnimationFrame(() => {
        setAssertiveMessage(trimmedMessage);
      });
    } else if (priority === 'polite') {
      setPoliteMessage(trimmedMessage);
    }
  }, []);

  const clear = useCallback(() => {
    setPoliteMessage('');
    setAssertiveMessage('');
  }, []);

  return (
    <LiveRegionContext.Provider value={{ announce, clear }}>
      {children}
      {/* Polite live region - non-interrupting announcements */}
      <LiveRegion priority="polite" atomic />
      {/* Assertive live region - immediate announcements */}
      <LiveRegion priority="assertive" atomic role="alert" />
    </LiveRegionContext.Provider>
  );
};

// =============================================================================
// Live Region Component
// =============================================================================

/**
 * Individual live region component.
 * Use this for specific announcement areas or let LiveRegionProvider handle global announcements.
 */
export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  priority = 'polite',
  atomic = true,
  role = priority === 'assertive' ? 'alert' : 'status',
  className,
  id,
}) => {
  const isOff = priority === 'off';
  
  return (
    <div
      id={id}
      aria-live={isOff ? undefined : priority}
      aria-atomic={isOff ? undefined : atomic}
      role={isOff ? undefined : role}
      className={cn(
        // Screen reader only - visually hidden
        'sr-only',
        className
      )}
    >
      {children}
    </div>
  );
};

// =============================================================================
// Status Announcer Hook
// =============================================================================

export interface UseStatusAnnouncerReturn {
  /** Announce a success message */
  announceSuccess: (message: string) => void;
  /** Announce an error message */
  announceError: (message: string) => void;
  /** Announce a warning message */
  announceWarning: (message: string) => void;
  /** Announce an info message */
  announceInfo: (message: string) => void;
  /** Announce a loading state */
  announceLoading: (message?: string) => void;
  /** Clear the current announcement */
  clear: () => void;
}

/**
 * Hook for announcing different types of status messages
 */
export function useStatusAnnouncer(): UseStatusAnnouncerReturn {
  const { announce, clear } = useLiveRegion();

  const announceSuccess = useCallback(
    (message: string) => announce(message, 'polite'),
    [announce]
  );

  const announceError = useCallback(
    (message: string) => announce(message, 'assertive'),
    [announce]
  );

  const announceWarning = useCallback(
    (message: string) => announce(message, 'polite'),
    [announce]
  );

  const announceInfo = useCallback(
    (message: string) => announce(message, 'polite'),
    [announce]
  );

  const announceLoading = useCallback(
    (message = 'Loading, please wait...') => announce(message, 'polite'),
    [announce]
  );

  return {
    announceSuccess,
    announceError,
    announceWarning,
    announceInfo,
    announceLoading,
    clear,
  };
}

// =============================================================================
// Form Announcer Hook
// =============================================================================

export interface UseFormAnnouncerReturn {
  /** Announce form submission success */
  announceSubmitSuccess: (message?: string) => void;
  /** Announce form submission error */
  announceSubmitError: (message?: string) => void;
  /** Announce field validation error */
  announceFieldError: (fieldName: string, error: string) => void;
  /** Announce multiple form errors */
  announceFormErrors: (errorCount: number) => void;
  /** Announce current form step (for multi-step forms) */
  announceStepChange: (currentStep: number, totalSteps: number) => void;
}

/**
 * Hook for announcing form-related updates
 */
export function useFormAnnouncer(): UseFormAnnouncerReturn {
  const { announce } = useLiveRegion();

  const announceSubmitSuccess = useCallback(
    (message = 'Form submitted successfully') => {
      announce(message, 'polite');
    },
    [announce]
  );

  const announceSubmitError = useCallback(
    (message = 'Form submission failed. Please check your entries and try again.') => {
      announce(message, 'assertive');
    },
    [announce]
  );

  const announceFieldError = useCallback(
    (fieldName: string, error: string) => {
      announce(`${fieldName}: ${error}`, 'assertive');
    },
    [announce]
  );

  const announceFormErrors = useCallback(
    (errorCount: number) => {
      announce(
        `Form has ${errorCount} error${errorCount !== 1 ? 's' : ''}. Please review and correct.`,
        'assertive'
      );
    },
    [announce]
  );

  const announceStepChange = useCallback(
    (currentStep: number, totalSteps: number) => {
      announce(`Step ${currentStep} of ${totalSteps}`, 'polite');
    },
    [announce]
  );

  return {
    announceSubmitSuccess,
    announceSubmitError,
    announceFieldError,
    announceFormErrors,
    announceStepChange,
  };
}

// =============================================================================
// Navigation Announcer Hook
// =============================================================================

export interface UseNavigationAnnouncerReturn {
  /** Announce page navigation */
  announcePageChange: (pageName: string) => void;
  /** Announce route change */
  announceRouteChange: (from: string, to: string) => void;
  /** Announce navigation within page (anchor links) */
  announceSectionChange: (sectionName: string) => void;
}

/**
 * Hook for announcing navigation changes
 */
export function useNavigationAnnouncer(): UseNavigationAnnouncerReturn {
  const { announce } = useLiveRegion();

  const announcePageChange = useCallback(
    (pageName: string) => {
      announce(`Navigated to ${pageName}`, 'polite');
    },
    [announce]
  );

  const announceRouteChange = useCallback(
    (from: string, to: string) => {
      announce(`Navigated from ${from} to ${to}`, 'polite');
    },
    [announce]
  );

  const announceSectionChange = useCallback(
    (sectionName: string) => {
      announce(`Jumped to ${sectionName}`, 'polite');
    },
    [announce]
  );

  return {
    announcePageChange,
    announceRouteChange,
    announceSectionChange,
  };
}

// =============================================================================
// Standalone Announcer Component
// =============================================================================

export interface AnnouncerProps {
  /** Current message to announce */
  message?: string;
  /** Priority level */
  priority?: LiveRegionPriority;
  /** Delay before announcing (ms) */
  delay?: number;
  /** Callback after announcement */
  onAnnounce?: () => void;
}

/**
 * Standalone announcer component for one-off announcements.
 * Useful for announcing state changes in class components or when you don't need the context.
 */
export const Announcer: React.FC<AnnouncerProps> = ({
  message,
  priority = 'polite',
  delay = 0,
  onAnnounce,
}) => {
  const [announcement, setAnnouncement] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!message) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setAnnouncement(message);
        onAnnounce?.();
      }, delay);
    } else {
      setAnnouncement(message);
      onAnnounce?.();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, delay, onAnnounce]);

  if (!announcement) return null;

  return (
    <LiveRegion priority={priority} atomic>
      {announcement}
    </LiveRegion>
  );
};

// =============================================================================
// Batch Announcer Component
// =============================================================================

export interface BatchAnnouncerProps {
  /** Array of messages to announce in sequence */
  messages: string[];
  /** Delay between announcements (ms) */
  interval?: number;
  /** Priority level */
  priority?: LiveRegionPriority;
  /** Callback when all announcements complete */
  onComplete?: () => void;
}

/**
 * Component for announcing multiple messages in sequence.
 * Useful for step-by-step processes or batch operations.
 */
export const BatchAnnouncer: React.FC<BatchAnnouncerProps> = ({
  messages,
  interval = 1000,
  priority = 'polite',
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (messages.length === 0) return;

    if (currentIndex < messages.length) {
      setCurrentMessage(messages[currentIndex]);
      
      const timeout = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, interval);

      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [messages, currentIndex, interval, onComplete]);

  if (!currentMessage) return null;

  return (
    <LiveRegion priority={priority} atomic>
      {currentMessage}
    </LiveRegion>
  );
};

// Default export
export default LiveRegion;
