/**
 * Status Message Component
 * ========================
 * Status messages that auto-announce to screen readers.
 * Provides visual feedback while ensuring screen reader users
 * are notified of status changes.
 * 
 * @accessibility
 * - Uses ARIA role="status" for automatic announcement
 * - aria-live="polite" ensures non-interrupting announcements
 * - Visual and auditory feedback alignment
 * - WCAG 2.1 AA compliant
 * 
 * @usage
 * Use for:
 * - Form submission status
 * - Data loading states
 * - Operation results (success/error)
 * - Progress updates
 * 
 * @example
 * ```tsx
 * // Success message
 * <StatusMessage 
 *   status="success" 
 *   message="Deal created successfully" 
 * />
 * 
 * // Error message with details
 * <StatusMessage 
 *   status="error" 
 *   message="Unable to save deal"
 *   details="Please check your connection and try again." 
 * />
 * 
 * // Loading state
 * <StatusMessage 
 *   status="loading" 
 *   message="Loading deals..."
 *   aria-live="polite"
 * />
 * ```
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Loader2,
  type LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'neutral';

export interface StatusMessageProps {
  /** The status type - determines styling and icon */
  status: StatusType;
  /** The main status message */
  message: string;
  /** Additional details or context */
  details?: string;
  /** ARIA live region priority - polite (non-interrupting) or assertive (immediate) */
  priority?: 'polite' | 'assertive';
  /** Whether the message should be announced to screen readers */
  announce?: boolean;
  /** Optional icon override */
  icon?: LucideIcon;
  /** Additional CSS classes */
  className?: string;
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Whether to show an icon */
  showIcon?: boolean;
}

// =============================================================================
// Status Configuration
// =============================================================================

interface StatusConfig {
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  ariaRole: 'status' | 'alert';
}

const statusConfig: Record<StatusType, StatusConfig> = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-500',
    ariaRole: 'status',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    iconColor: 'text-red-500',
    ariaRole: 'alert',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    iconColor: 'text-amber-500',
    ariaRole: 'alert',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-500',
    ariaRole: 'status',
  },
  loading: {
    icon: Loader2,
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-500',
    ariaRole: 'status',
  },
  neutral: {
    icon: Info,
    bgColor: 'bg-white/5',
    borderColor: 'border-white/10',
    iconColor: 'text-[#a0a0b0]',
    ariaRole: 'status',
  },
};

// =============================================================================
// Component
// =============================================================================

export const StatusMessage: React.FC<StatusMessageProps> = ({
  status,
  message,
  details,
  priority = 'polite',
  announce = true,
  icon: CustomIcon,
  className,
  animationDuration = 0.3,
  showIcon = true,
}) => {
  const config = statusConfig[status];
  const Icon = CustomIcon || config.icon;
  const isLoading = status === 'loading';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: animationDuration }}
      role={config.ariaRole}
      aria-live={priority}
      aria-atomic="true"
      className={cn(
        'rounded-lg border p-4',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className={cn('flex-shrink-0 mt-0.5', config.iconColor)}>
            <Icon 
              className={cn('w-5 h-5', isLoading && 'animate-spin')} 
              aria-hidden="true"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">
            {message}
          </p>
          {details && (
            <p className="mt-1 text-sm text-[#a0a0b0]">
              {details}
            </p>
          )}
        </div>
      </div>
      
      {/* Screen reader only announcement text */}
      {announce && (
        <span className="sr-only" role={config.ariaRole} aria-live={priority}>
          {status === 'error' && 'Error: '}
          {status === 'warning' && 'Warning: '}
          {status === 'success' && 'Success: '}
          {message}
          {details && `. ${details}`}
        </span>
      )}
    </motion.div>
  );
};

// =============================================================================
// Live Status Message (for dynamic updates)
// =============================================================================

export interface LiveStatusMessageProps extends Omit<StatusMessageProps, 'announce'> {
  /** Unique ID for the status message */
  id: string;
  /** Whether the message is visible */
  isVisible: boolean;
  /** Callback when the message should be dismissed */
  onDismiss?: () => void;
  /** Auto-dismiss duration in milliseconds (0 for no auto-dismiss) */
  autoDismiss?: number;
}

/**
 * Status message with visibility control and auto-dismiss functionality.
 * Suitable for toast-like status notifications.
 */
export const LiveStatusMessage: React.FC<LiveStatusMessageProps> = ({
  id,
  isVisible,
  onDismiss,
  autoDismiss = 0,
  ...props
}) => {
  React.useEffect(() => {
    if (isVisible && autoDismiss > 0) {
      const timer = setTimeout(() => {
        onDismiss?.();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoDismiss, onDismiss]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <StatusMessage
          key={id}
          {...props}
        />
      )}
    </AnimatePresence>
  );
};

// =============================================================================
// Inline Status (for form fields)
// =============================================================================

export interface InlineStatusProps {
  /** The status type */
  status: Exclude<StatusType, 'loading'>;
  /** The status message */
  message: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Compact status message for inline use (e.g., form field validation).
 */
export const InlineStatus: React.FC<InlineStatusProps> = ({
  status,
  message,
  className,
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      role={status === 'error' ? 'alert' : 'status'}
      aria-live={status === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'inline-flex items-center gap-1.5 text-sm',
        config.iconColor,
        className
      )}
    >
      <Icon className="w-4 h-4" aria-hidden="true" />
      <span>{message}</span>
    </span>
  );
};

// =============================================================================
// Polite Announcement (for non-visual updates)
// =============================================================================

export interface PoliteAnnouncementProps {
  /** The message to announce */
  message: string;
  /** Whether to announce immediately */
  trigger?: boolean;
}

/**
 * A component that announces messages to screen readers
 * without any visual display.
 */
export const PoliteAnnouncement: React.FC<PoliteAnnouncementProps> = ({
  message,
  trigger = true,
}) => {
  return (
    <div 
      role="status" 
      aria-live="polite" 
      aria-atomic="true" 
      className="sr-only"
    >
      {trigger && message}
    </div>
  );
};

// =============================================================================
// Assertive Announcement (for critical updates)
// =============================================================================

export interface AssertiveAnnouncementProps {
  /** The message to announce immediately */
  message: string;
  /** Whether to announce immediately */
  trigger?: boolean;
}

/**
 * A component that immediately announces messages to screen readers
 * without any visual display. Use for critical errors or important updates.
 */
export const AssertiveAnnouncement: React.FC<AssertiveAnnouncementProps> = ({
  message,
  trigger = true,
}) => {
  return (
    <div 
      role="alert" 
      aria-live="assertive" 
      aria-atomic="true" 
      className="sr-only"
    >
      {trigger && message}
    </div>
  );
};

// =============================================================================
// Exports
// =============================================================================

export default StatusMessage;
