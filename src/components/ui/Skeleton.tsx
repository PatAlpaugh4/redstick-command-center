/**
 * Skeleton Component
 * ==================
 * Base skeleton component with multiple variants and animations.
 * Used for displaying loading states throughout the application.
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the skeleton */
  variant?: 'text' | 'circular' | 'rectangular'
  /** Width of the skeleton (string for CSS values like '100px' or number for pixels) */
  width?: string | number
  /** Height of the skeleton (string for CSS values like '100px' or number for pixels) */
  height?: string | number
  /** Animation style */
  animation?: 'pulse' | 'wave' | 'none'
  /** Border radius (overrides variant defaults) */
  borderRadius?: string | number
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = 'text',
      width,
      height,
      animation = 'pulse',
      borderRadius,
      style,
      ...props
    },
    ref
  ) => {
    // Convert width/height to style values
    const dimensionStyles: React.CSSProperties = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
      ...style,
    }

    // Variant-specific classes
    const variantClasses = {
      text: 'rounded-md',
      circular: 'rounded-full',
      rectangular: 'rounded-lg',
    }

    // Animation classes
    const animationClasses = {
      pulse: 'animate-pulse',
      wave: 'animate-shimmer',
      none: '',
    }

    return (
      <div
        ref={ref}
        className={cn(
          // Base skeleton styling with dark theme colors
          'bg-muted/60',
          // Variant-specific styling
          variantClasses[variant],
          // Animation
          animationClasses[animation],
          // Custom shimmer animation for wave variant
          animation === 'wave' &&
            'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
          className
        )}
        style={dimensionStyles}
        {...props}
      />
    )
  }
)
Skeleton.displayName = 'Skeleton'

export { Skeleton }

// =============================================================================
// Convenience Exports for Common Skeleton Patterns
// =============================================================================

/** Text skeleton - for lines of text */
export function TextSkeleton({
  lines = 1,
  className,
  lastLineWidth = '75%',
  ...props
}: {
  lines?: number
  className?: string
  lastLineWidth?: string
} & Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={16}
          width={i === lines - 1 && lines > 1 ? lastLineWidth : '100%'}
          {...props}
        />
      ))}
    </div>
  )
}

/** Avatar skeleton - circular for profile pictures */
export function AvatarSkeleton({
  size = 40,
  className,
  ...props
}: {
  size?: number
  className?: string
} & Omit<SkeletonProps, 'variant' | 'width' | 'height'>) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
}

/** Button skeleton - rectangular with button-like proportions */
export function ButtonSkeleton({
  className,
  ...props
}: {
  className?: string
} & Omit<SkeletonProps, 'variant' | 'width' | 'height'>) {
  return (
    <Skeleton
      variant="rectangular"
      width={100}
      height={40}
      className={cn('rounded-md', className)}
      {...props}
    />
  )
}

/** Input skeleton - for form input placeholders */
export function InputSkeleton({
  className,
  ...props
}: {
  className?: string
} & Omit<SkeletonProps, 'variant' | 'width' | 'height'>) {
  return (
    <Skeleton
      variant="rectangular"
      width="100%"
      height={40}
      className={cn('rounded-md', className)}
      {...props}
    />
  )
}

/** Card skeleton - for card-shaped placeholders */
export function CardSkeletonBase({
  className,
  ...props
}: {
  className?: string
} & Omit<SkeletonProps, 'variant'>) {
  return (
    <Skeleton
      variant="rectangular"
      className={cn('rounded-xl', className)}
      {...props}
    />
  )
}
