/**
 * Badge Component
 * ===============
 * Accessible badge component for status indicators and labels.
 * 
 * @accessibility
 * - High contrast color combinations
 * - Support for status indicators
 * - Icons accompany colors (don't rely on color alone)
 * - Keyboard accessible when interactive
 * - Screen reader friendly
 * - Color-independent status representation
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  Clock,
  MinusCircle,
  LucideIcon
} from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Add dot indicator */
  dot?: boolean;
  /** Dot color (defaults to variant color) */
  dotColor?: string;
  /** Make badge clickable */
  interactive?: boolean;
  /** Show remove button (for dismissible badges) */
  onRemove?: () => void;
  /** Icon to display (overrides variant default) */
  icon?: LucideIcon | null;
  /** Hide icon even if variant has default icon */
  hideIcon?: boolean;
}

// =============================================================================
// Icon mapping for accessibility (don't rely on color alone)
// =============================================================================

const variantIcons: Record<string, LucideIcon> = {
  default: MinusCircle,
  primary: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
  outline: MinusCircle,
};

// =============================================================================
// Component
// =============================================================================

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      dot = false,
      dotColor,
      interactive = false,
      onRemove,
      icon,
      hideIcon = false,
      children,
      onClick,
      onKeyDown,
      tabIndex,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: 'bg-white/10 text-white border-transparent',
      primary: 'bg-[#ff6b7a]/20 text-[#ff6b7a] border-[#ff6b7a]/30', /* Fixed: Accessible accent */
      success: 'bg-[#10b981]/20 text-[#34d399] border-[#10b981]/30',
      warning: 'bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]/30',
      error: 'bg-[#ef4444]/20 text-[#f87171] border-[#ef4444]/30',
      info: 'bg-[#3b82f6]/20 text-[#60a5fa] border-[#3b82f6]/30',
      outline: 'bg-transparent text-white border-white/20',
    };

    const sizeClasses = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-2.5 py-0.5',
      lg: 'text-base px-3 py-1',
    };

    const dotColors: Record<string, string> = {
      default: 'bg-white',
      primary: 'bg-[#ff6b7a]', /* Fixed: Accessible accent */
      success: 'bg-[#34d399]',
      warning: 'bg-[#fbbf24]',
      error: 'bg-[#f87171]',
      info: 'bg-[#60a5fa]',
      outline: 'bg-white',
    };

    // Get the appropriate icon for this variant
    const IconComponent = icon === null ? null : (icon || variantIcons[variant]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>): void => {
      if (interactive && onClick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onClick(event as unknown as React.MouseEvent<HTMLSpanElement>);
      }
      onKeyDown?.(event);
    };

    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center gap-1.5',
          'font-medium',
          'rounded-full border',
          'transition-colors duration-200',
          
          // Size
          sizeClasses[size],
          
          // Variant
          variantClasses[variant],
          
          // Interactive
          interactive && [
            'cursor-pointer',
            'hover:bg-opacity-30',
            'focus:outline-none focus:ring-2 focus:ring-[#ff6b7a] focus:ring-offset-2 focus:ring-offset-[#0f0f1a]',
          ],
          
          // Custom classes
          className
        )}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={interactive ? (tabIndex ?? 0) : tabIndex}
        role={interactive ? 'button' : undefined}
        {...props}
      >
        {/* Icon for accessibility - don't rely on color alone */}
        {!hideIcon && IconComponent && (
          <IconComponent 
            className="w-3.5 h-3.5 flex-shrink-0" 
            aria-hidden="true"
          />
        )}
        
        {dot && (
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full flex-shrink-0',
              dotColor || dotColors[variant]
            )}
            aria-hidden="true"
          />
        )}
        <span className="truncate">{children}</span>
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-1 -mr-0.5 p-0.5 rounded-full hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-white/50"
            aria-label={`Remove ${children}`}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

// =============================================================================
// Status Badge Preset
// =============================================================================

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'dot' | 'icon'> {
  status: 'active' | 'inactive' | 'pending' | 'error' | 'warning' | 'success';
}

const statusConfig: Record<string, { 
  variant: BadgeProps['variant']; 
  label: string;
  icon: LucideIcon;
  ariaLabel: string;
}> = {
  active: { 
    variant: 'success', 
    label: 'Active',
    icon: CheckCircle2,
    ariaLabel: 'Status: Active',
  },
  inactive: { 
    variant: 'default', 
    label: 'Inactive',
    icon: MinusCircle,
    ariaLabel: 'Status: Inactive',
  },
  pending: { 
    variant: 'warning', 
    label: 'Pending',
    icon: Clock,
    ariaLabel: 'Status: Pending',
  },
  error: { 
    variant: 'error', 
    label: 'Error',
    icon: XCircle,
    ariaLabel: 'Status: Error',
  },
  warning: { 
    variant: 'warning', 
    label: 'Warning',
    icon: AlertTriangle,
    ariaLabel: 'Status: Warning',
  },
  success: { 
    variant: 'success', 
    label: 'Success',
    icon: CheckCircle2,
    ariaLabel: 'Status: Success',
  },
};

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, className, ...props }, ref) => {
    const config = statusConfig[status];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        icon={config.icon}
        className={className}
        aria-label={config.ariaLabel}
        {...props}
      >
        {props.children || config.label}
      </Badge>
    );
  }
);
StatusBadge.displayName = 'StatusBadge';

// =============================================================================
// Status Indicator Component
// =============================================================================

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: 'active' | 'inactive' | 'pending' | 'error' | 'warning';
  showLabel?: boolean;
  label?: string;
  pulse?: boolean;
}

const statusIndicatorConfig: Record<string, { 
  color: string; 
  label: string;
  icon: LucideIcon;
}> = {
  active: { 
    color: 'bg-[#34d399]', 
    label: 'Active',
    icon: CheckCircle2,
  },
  inactive: { 
    color: 'bg-[#6b7280]', 
    label: 'Inactive',
    icon: MinusCircle,
  },
  pending: { 
    color: 'bg-[#fbbf24]', 
    label: 'Pending',
    icon: Clock,
  },
  error: { 
    color: 'bg-[#f87171]', 
    label: 'Error',
    icon: XCircle,
  },
  warning: { 
    color: 'bg-[#fbbf24]', 
    label: 'Warning',
    icon: AlertTriangle,
  },
};

const StatusIndicator = React.forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  ({ status, showLabel = true, label, pulse = false, className, ...props }, ref) => {
    const config = statusIndicatorConfig[status];
    const Icon = config.icon;

    return (
      <span 
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 text-sm',
          className
        )}
        {...props}
      >
        {/* Visual dot with pulse animation */}
        <span className="relative flex h-2.5 w-2.5">
          {pulse && status === 'active' && (
            <span className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              config.color
            )} />
          )}
          <span className={cn(
            "relative inline-flex rounded-full h-2.5 w-2.5",
            config.color
          )} aria-hidden="true" />
        </span>
        
        {/* Icon for accessibility */}
        <Icon 
          className="w-4 h-4 flex-shrink-0 opacity-80" 
          aria-hidden="true"
        />
        
        {/* Status text - visible to all */}
        {showLabel && (
          <>
            <span className="sr-only">Status:</span>
            <span>{label || config.label}</span>
          </>
        )}
      </span>
    );
  }
);
StatusIndicator.displayName = 'StatusIndicator';

// =============================================================================
// Exports
// =============================================================================

export { Badge, StatusBadge, StatusIndicator };
export default Badge;
