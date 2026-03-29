/**
 * Screen Reader Announcer Component
 * ==================================
 * Announces dynamic content changes to screen readers using ARIA live regions.
 * Supports both polite (non-interrupting) and assertive (immediate) announcements.
 * 
 * @accessibility
 * - ARIA live regions for polite and assertive announcements
 * - Visually hidden but announced by screen readers
 * - Supports both polite (non-interrupting) and assertive (immediate) announcements
 * - WCAG 2.1 AA compliant
 * 
 * @usage
 * Place this component once at the app root level.
 * Use the useAnnouncer hook to make announcements.
 * 
 * @example
 * ```tsx
 * // In your root layout
 * <ScreenReaderAnnouncer />
 * 
 * // In your components
 * const { announce } = useAnnouncer();
 * announce('Form submitted successfully', 'polite');
 * ```
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

export type AnnouncementPriority = 'polite' | 'assertive';

export interface Announcement {
  id: string;
  message: string;
  priority: AnnouncementPriority;
  timestamp: number;
}

export interface AnnouncerContextValue {
  /** Make an announcement to screen readers */
  announce: (message: string, priority?: AnnouncementPriority) => void;
  /** Clear all announcements */
  clear: () => void;
  /** Get recent announcements */
  getHistory: () => Announcement[];
}

export interface ScreenReaderAnnouncerProps {
  /** Maximum number of announcements to keep in history */
  maxHistory?: number;
  /** Additional CSS classes for the container */
  className?: string;
  /** Enable console logging for debugging */
  debug?: boolean;
}

// =============================================================================
// Context
// =============================================================================

const AnnouncerContext = createContext<AnnouncerContextValue | undefined>(undefined);

/**
 * Hook to access the announcer context
 * Must be used within an AnnouncerProvider
 */
export function useAnnouncer(): AnnouncerContextValue {
  const context = useContext(AnnouncerContext);
  if (context === undefined) {
    throw new Error('useAnnouncer must be used within an AnnouncerProvider');
  }
  return context;
}

// =============================================================================
// Announcer Provider
// =============================================================================

export interface AnnouncerProviderProps {
  children: React.ReactNode;
  maxHistory?: number;
  debug?: boolean;
}

export const AnnouncerProvider: React.FC<AnnouncerProviderProps> = ({
  children,
  maxHistory = 10,
  debug = false,
}) => {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  const historyRef = useRef<Announcement[]>([]);

  const announce = useCallback(
    (message: string, priority: AnnouncementPriority = 'polite'): void => {
      if (!message || typeof message !== 'string') {
        console.warn('Announcer: Invalid message provided');
        return;
      }

      const trimmedMessage = message.trim();
      if (!trimmedMessage) return;

      const announcement: Announcement = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message: trimmedMessage,
        priority,
        timestamp: Date.now(),
      };

      // Update history
      historyRef.current = [announcement, ...historyRef.current].slice(0, maxHistory);

      // Set message for live region
      if (priority === 'assertive') {
        // Clear first to ensure re-announcement
        setAssertiveMessage('');
        // Use setTimeout to ensure the clear happens before the new message
        setTimeout(() => {
          setAssertiveMessage(trimmedMessage);
        }, 100);
      } else {
        setPoliteMessage(trimmedMessage);
      }

      // Debug logging
      if (debug) {
        console.log(`[Announcer] ${priority}:`, trimmedMessage);
      }
    },
    [maxHistory, debug]
  );

  const clear = useCallback((): void => {
    setPoliteMessage('');
    setAssertiveMessage('');
    historyRef.current = [];
  }, []);

  const getHistory = useCallback((): Announcement[] => {
    return historyRef.current;
  }, []);

  const value: AnnouncerContextValue = {
    announce,
    clear,
    getHistory,
  };

  return (
    <AnnouncerContext.Provider value={value}>
      {children}
      {/* Live Regions - Visually Hidden */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {politeMessage}
      </div>
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        role="alert"
      >
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
};

// =============================================================================
// Standalone Announcer Component
// =============================================================================

export const ScreenReaderAnnouncer: React.FC<ScreenReaderAnnouncerProps> = ({
  maxHistory = 10,
  className,
  debug = false,
}) => {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  const historyRef = useRef<Announcement[]>([]);

  // Expose announce method globally for convenience
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as Window & { announce?: (message: string, priority?: AnnouncementPriority) => void }).announce = (
        message: string,
        priority: AnnouncementPriority = 'polite'
      ): void => {
        if (!message?.trim()) return;

        const announcement: Announcement = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          message: message.trim(),
          priority,
          timestamp: Date.now(),
        };

        historyRef.current = [announcement, ...historyRef.current].slice(0, maxHistory);

        if (priority === 'assertive') {
          setAssertiveMessage('');
          setTimeout(() => setAssertiveMessage(message.trim()), 100);
        } else {
          setPoliteMessage(message.trim());
        }

        if (debug) {
          console.log(`[Announcer] ${priority}:`, message.trim());
        }
      };
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as Window & { announce?: unknown }).announce;
      }
    };
  }, [maxHistory, debug]);

  return (
    <div className={cn('sr-only', className)}>
      {/* Polite announcements - non-interrupting */}
      <div
        aria-live="polite"
        aria-atomic="true"
        role="status"
        className="sr-only"
      >
        {politeMessage}
      </div>

      {/* Assertive announcements - immediate */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        role="alert"
        className="sr-only"
      >
        {assertiveMessage}
      </div>

      {/* Log region for debugging */}
      {debug && (
        <div aria-hidden="true" className="fixed bottom-4 right-4 z-50 bg-[#1a1a2e] border border-[#e94560] rounded-lg p-4 max-w-sm not-sr-only">
          <p className="text-[#e94560] font-medium mb-2">Announcer Debug</p>
          <p className="text-white text-sm mb-1">Polite: {politeMessage || '(empty)'}</p>
          <p className="text-white text-sm">Assertive: {assertiveMessage || '(empty)'}</p>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// Convenience Hooks
// =============================================================================

/**
 * Hook for announcing loading states
 */
export function useLoadingAnnouncer(): {
  announceLoading: (message?: string) => void;
  announceSuccess: (message?: string) => void;
  announceError: (message?: string) => void;
} {
  const { announce } = useAnnouncer();

  const announceLoading = useCallback(
    (message = 'Loading, please wait...'): void => {
      announce(message, 'polite');
    },
    [announce]
  );

  const announceSuccess = useCallback(
    (message = 'Operation completed successfully'): void => {
      announce(message, 'polite');
    },
    [announce]
  );

  const announceError = useCallback(
    (message = 'An error occurred. Please try again.'): void => {
      announce(message, 'assertive');
    },
    [announce]
  );

  return {
    announceLoading,
    announceSuccess,
    announceError,
  };
}

/**
 * Hook for announcing form validation
 */
export function useFormAnnouncer(): {
  announceFieldError: (fieldName: string, error: string) => void;
  announceFormSuccess: (message?: string) => void;
  announceFormErrors: (errorCount: number) => void;
} {
  const { announce } = useAnnouncer();

  const announceFieldError = useCallback(
    (fieldName: string, error: string): void => {
      announce(`${fieldName}: ${error}`, 'assertive');
    },
    [announce]
  );

  const announceFormSuccess = useCallback(
    (message = 'Form submitted successfully'): void => {
      announce(message, 'polite');
    },
    [announce]
  );

  const announceFormErrors = useCallback(
    (errorCount: number): void => {
      announce(
        `Form has ${errorCount} error${errorCount !== 1 ? 's' : ''}. Please review and correct.`,
        'assertive'
      );
    },
    [announce]
  );

  return {
    announceFieldError,
    announceFormSuccess,
    announceFormErrors,
  };
}

/**
 * Hook for announcing navigation
 */
export function useNavigationAnnouncer(): {
  announcePageChange: (pageName: string) => void;
  announceRouteChange: (from: string, to: string) => void;
} {
  const { announce } = useAnnouncer();

  const announcePageChange = useCallback(
    (pageName: string): void => {
      announce(`Navigated to ${pageName}`, 'polite');
    },
    [announce]
  );

  const announceRouteChange = useCallback(
    (from: string, to: string): void => {
      announce(`Navigated from ${from} to ${to}`, 'polite');
    },
    [announce]
  );

  return {
    announcePageChange,
    announceRouteChange,
  };
}

// Default export
export default ScreenReaderAnnouncer;
