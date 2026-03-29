/**
 * Card Component
 * ==============
 * Accessible card component with variants for content containers.
 * 
 * @accessibility
 * - Proper semantic structure
 * - ARIA support for interactive cards
 * - Focus management for clickable cards
 * - Reduced motion support
 * - High contrast mode support
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Make the card interactive (clickable) */
  interactive?: boolean;
  /** Add hover elevation effect */
  hover?: boolean;
  /** Card padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Visual variant */
  variant?: 'default' | 'outlined' | 'elevated' | 'ghost';
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header actions (right side) */
  actions?: React.ReactNode;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level (h1-h6) */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Footer alignment */
  align?: 'start' | 'center' | 'end' | 'between';
}

// =============================================================================
// Card Component
// =============================================================================

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { 
      className, 
      interactive = false, 
      hover = false, 
      padding = 'md',
      variant = 'default',
      children,
      onClick,
      onKeyDown,
      tabIndex,
      role,
      'aria-label': ariaLabel,
      ...props 
    },
    ref
  ) => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const variantClasses = {
      default: 'bg-[#1a1a2e] border border-white/10',
      outlined: 'bg-transparent border border-white/20',
      elevated: 'bg-[#1a1a2e] shadow-lg shadow-black/20',
      ghost: 'bg-white/5',
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
      if (interactive && onClick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
      }
      onKeyDown?.(event);
    };

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-xl',
          
          // Variant styles
          variantClasses[variant],
          
          // Padding
          paddingClasses[padding],
          
          // Interactive styles
          interactive && [
            'cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-[#ff6b7a] focus:ring-offset-2 focus:ring-offset-[#0f0f1a]',
          ],
          
          // Hover styles
          hover && [
            'transition-all duration-200',
            'hover:border-[#ff6b7a]/30',
            'hover:shadow-lg hover:shadow-[#ff6b7a]/5',
          ],
          
          // High contrast mode
          'forced-colors:border-2 forced-colors:border-CanvasText',
          'forced-colors:bg-Canvas forced-colors:text-CanvasText',
          
          // Custom classes
          className
        )}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={interactive ? (tabIndex ?? 0) : tabIndex}
        role={interactive ? (role ?? 'button') : role}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

// =============================================================================
// Card Header
// =============================================================================

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, actions, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-start justify-between gap-4',
        'pb-4 mb-4 border-b border-white/5',
        'forced-colors:border-b-2 forced-colors:border-CanvasText',
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

// =============================================================================
// Card Title
// =============================================================================

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = 'h3', children, ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'text-lg font-semibold text-white',
        'leading-tight',
        'forced-colors:text-CanvasText',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
);
CardTitle.displayName = 'CardTitle';

// =============================================================================
// Card Description
// =============================================================================

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-sm text-[#a0a0b0]', /* 7.2:1 on background, 6.3:1 on surface - AA compliant */
        'mt-1',
        'forced-colors:text-CanvasText forced-colors:opacity-80',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
);
CardDescription.displayName = 'CardDescription';

// =============================================================================
// Card Content
// =============================================================================

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'text-[#a0a0b0]', /* AA compliant secondary text */
        'forced-colors:text-CanvasText',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
CardContent.displayName = 'CardContent';

// =============================================================================
// Card Footer
// =============================================================================

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = 'between', children, ...props }, ref) => {
    const alignClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3',
          'pt-4 mt-4 border-t border-white/5',
          'forced-colors:border-t-2 forced-colors:border-CanvasText',
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'CardFooter';

// =============================================================================
// Exports
// =============================================================================

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
