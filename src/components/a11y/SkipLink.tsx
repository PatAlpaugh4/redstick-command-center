/**
 * Skip Link Component
 * ===================
 * Provides a "skip to main content" link for keyboard users.
 * This is essential for accessibility, allowing users to bypass
 * repetitive navigation and jump directly to the main content.
 * 
 * @accessibility
 * - Visible on keyboard focus
 * - Hidden visually but available to screen readers when not focused
 * - WCAG 2.1 AA compliant
 * 
 * @usage
 * Place this component at the very beginning of your body content,
 * before any navigation or header elements.
 * 
 * @example
 * ```tsx
 * <body>
 *   <SkipLink targetId="main-content" />
 *   <nav>...</nav>
 *   <main id="main-content">...</main>
 * </body>
 * ```
 */

'use client';

import React, { useCallback } from 'react';
import { cn } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

export interface SkipLinkProps {
  /** The ID of the main content element to skip to */
  targetId?: string;
  /** Custom label text for the skip link */
  label?: string;
  /** Additional CSS classes */
  className?: string;
  /** Callback when skip link is activated */
  onSkip?: () => void;
}

// =============================================================================
// Component
// =============================================================================

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  label = 'Skip to main content',
  className,
  onSkip,
}) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>): void => {
      event.preventDefault();

      const target = document.getElementById(targetId);
      
      if (target) {
        // Set tabindex to allow programmatic focus
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
          target.addEventListener(
            'blur',
            () => {
              target.removeAttribute('tabindex');
            },
            { once: true }
          );
        }

        // Focus the target element
        target.focus({ preventScroll: true });
        
        // Scroll into view smoothly
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Call optional callback
        onSkip?.();
      }
    },
    [targetId, onSkip]
  );

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={cn(
        // Base styles
        'fixed top-4 left-4 z-[9999]',
        
        // Visual styling
        'px-6 py-3',
        'bg-[#e94560] text-white',
        'rounded-lg',
        'font-medium text-sm',
        'shadow-lg shadow-[#e94560]/20',
        
        // Focus ring
        'focus:outline-none focus:ring-4 focus:ring-[#e94560]/30',
        
        // Hidden by default, visible on focus
        'sr-only focus:not-sr-only focus:absolute',
        
        // Transition
        'transition-all duration-200',
        
        // Custom classes
        className
      )}
      aria-label={label}
    >
      {label}
    </a>
  );
};

// =============================================================================
// Skip Link with Multiple Targets
// =============================================================================

export interface SkipLinksProps {
  /** Array of skip targets */
  links: Array<{
    targetId: string;
    label: string;
  }>;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Multiple Skip Links Component
 * Use when there are multiple important landmarks to skip to
 * (e.g., main content, navigation, search)
 */
export const SkipLinks: React.FC<SkipLinksProps> = ({ links, className }) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, targetId: string): void => {
      event.preventDefault();

      const target = document.getElementById(targetId);
      
      if (target) {
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
          target.addEventListener(
            'blur',
            () => {
              target.removeAttribute('tabindex');
            },
            { once: true }
          );
        }

        target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    []
  );

  return (
    <nav
      aria-label="Skip links"
      className={cn(
        'fixed top-0 left-0 right-0 z-[9999]',
        'bg-[#1a1a2e] border-b border-white/10',
        'p-4',
        'sr-only focus-within:not-sr-only focus-within:relative',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-[#a0a0b0] text-sm font-medium">Skip to:</span>
        {links.map(({ targetId, label }) => (
          <a
            key={targetId}
            href={`#${targetId}`}
            onClick={(e) => handleClick(e, targetId)}
            className="px-4 py-2 bg-[#e94560] text-white rounded-md text-sm font-medium hover:bg-[#d63d56] focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:ring-offset-2 focus:ring-offset-[#1a1a2e] transition-colors"
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
};

// =============================================================================
// Hook for managing skip link targets
// =============================================================================

/**
 * Hook to register a skip link target
 * Automatically handles tabindex for focus management
 */
export function useSkipTarget(targetId: string): {
  ref: React.RefObject<HTMLElement>;
  skipProps: {
    id: string;
    tabIndex?: number;
  };
} {
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (element && !element.id) {
      element.id = targetId;
    }
  }, [targetId]);

  return {
    ref: ref as React.RefObject<HTMLElement>,
    skipProps: {
      id: targetId,
    },
  };
}

// Default export
export default SkipLink;
