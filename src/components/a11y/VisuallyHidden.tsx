/**
 * Visually Hidden Component
 * =========================
 * Content visible to screen readers only, hidden from visual display.
 * Essential for providing additional context to screen reader users
 * without affecting the visual design.
 * 
 * @accessibility
 * - Content is visually hidden but accessible to screen readers
 * - Properly removes content from visual flow while keeping it in accessibility tree
 * - Supports focusable content (e.g., skip links)
 * - WCAG 2.1 AA compliant
 * 
 * @usage
 * Use for:
 * - Additional context for screen reader users
 * - Labels for icon-only buttons
 * - Skip links
 * - Hidden form labels
 * 
 * @example
 * ```tsx
 * // Icon-only button with accessible label
 * <button>
 *   <XIcon aria-hidden="true" />
 *   <VisuallyHidden>Close dialog</VisuallyHidden>
 * </button>
 * 
 * // Table header abbreviations with full text for screen readers
 * <th>
 *   <abbr title="Total Addressable Market">TAM</abbr>
 *   <VisuallyHidden> - Total Addressable Market</VisuallyHidden>
 * </th>
 * ```
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

export interface VisuallyHiddenProps {
  /** Content to be visually hidden */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** 
   * Whether the content should become visible on focus.
   * Useful for skip links and other focusable elements.
   */
  focusable?: boolean;
  /** HTML element to render as */
  as?: 'span' | 'div' | 'p' | 'label';
  /** ID for aria-labelledby references */
  id?: string;
}

// =============================================================================
// Component
// =============================================================================

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  children,
  className,
  focusable = false,
  as: Component = 'span',
  id,
}) => {
  return (
    <Component
      id={id}
      className={cn(
        // Base styles - visually hidden
        'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0',
        'clip-rect-0',
        
        // Make visible on focus if focusable
        focusable && [
          'focus:static focus:w-auto focus:h-auto focus:m-0 focus:overflow-visible focus:whitespace-normal focus:clip-auto',
          'focus:px-4 focus:py-2 focus:bg-[#e94560] focus:text-white focus:rounded-lg focus:shadow-lg',
          'focus:z-[9999]',
        ],
        
        // Custom classes
        className
      )}
      style={{
        clipPath: 'inset(50%)',
        clip: 'rect(0, 0, 0, 0)',
      }}
    >
      {children}
    </Component>
  );
};

// =============================================================================
// Visually Hidden Input Label
// =============================================================================

export interface HiddenLabelProps {
  /** The ID of the input this label describes */
  htmlFor: string;
  /** The label text */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * A visually hidden label for inputs that have visual placeholders
 * but need accessible labels for screen readers.
 */
export const HiddenLabel: React.FC<HiddenLabelProps> = ({
  htmlFor,
  children,
  className,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0',
        className
      )}
      style={{
        clipPath: 'inset(50%)',
        clip: 'rect(0, 0, 0, 0)',
      }}
    >
      {children}
    </label>
  );
};

// =============================================================================
// Screen Reader Only Text
// =============================================================================

export interface ScreenReaderTextProps {
  /** Text content for screen readers */
  children: React.ReactNode;
  /** Additional context prefix (e.g., "Status:") */
  prefix?: string;
  /** Additional context suffix */
  suffix?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Provides additional context text for screen readers.
 * Useful for adding "Status:", "Error:", or other prefixes/suffixes
 * that clarify the meaning of visual elements.
 */
export const ScreenReaderText: React.FC<ScreenReaderTextProps> = ({
  children,
  prefix,
  suffix,
  className,
}) => {
  return (
    <span
      className={cn('sr-only', className)}
    >
      {prefix && <span>{prefix} </span>}
      {children}
      {suffix && <span> {suffix}</span>}
    </span>
  );
};

// =============================================================================
// Aria Label Helper
// =============================================================================

export interface AccessibleIconProps {
  /** The icon component (should have aria-hidden="true") */
  icon: React.ReactNode;
  /** The accessible label describing what the icon represents */
  label: string;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * Wraps an icon with an accessible label for screen readers.
 * Ensures icons have proper text alternatives.
 */
export const AccessibleIcon: React.FC<AccessibleIconProps> = ({
  icon,
  label,
  className,
}) => {
  return (
    <span className={cn('inline-flex items-center', className)}>
      {React.cloneElement(icon as React.ReactElement, {
        'aria-hidden': 'true',
        focusable: 'false',
      })}
      <VisuallyHidden>{label}</VisuallyHidden>
    </span>
  );
};

// =============================================================================
// Status Announcement Helper
// =============================================================================

export interface StatusAnnouncementProps {
  /** The current status value */
  status: string;
  /** The status label (e.g., "Deal status", "Task status") */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Announces status changes to screen readers with proper formatting.
 * Use inside status badges or indicators.
 */
export const StatusAnnouncement: React.FC<StatusAnnouncementProps> = ({
  status,
  label = 'Status',
  className,
}) => {
  return (
    <span className={cn('sr-only', className)}>
      {label}: {status}
    </span>
  );
};

// =============================================================================
// Exports
// =============================================================================

export default VisuallyHidden;
