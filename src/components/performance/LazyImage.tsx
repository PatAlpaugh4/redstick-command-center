/**
 * LazyImage Component
 * ===================
 * Optimized image component wrapping next/image with additional features:
 * - Blur placeholder for smooth loading transition
 * - Lazy loading with Intersection Observer
 * - Aspect ratio handling to prevent layout shift
 * - Error fallback handling
 * - Priority loading for above-the-fold images
 * 
 * Performance Benefits:
 * - Reduces LCP (Largest Contentful Paint) for critical images
 * - Prevents CLS (Cumulative Layout Shift) with aspect ratio
 * - Smooth loading experience with blur placeholder
 */

'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

interface LazyImageProps {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Width of the image (number for pixels, string for CSS values) */
  width?: number | string;
  /** Height of the image (number for pixels, string for CSS values) */
  height?: number | string;
  /** Aspect ratio as 'width/height' (e.g., '16/9') - prevents layout shift */
  aspectRatio?: string;
  /** Object fit style */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Object position */
  objectPosition?: string;
  /** Custom CSS classes */
  className?: string;
  /** Container CSS classes */
  containerClassName?: string;
  /** Whether to load immediately (for above-the-fold images) */
  priority?: boolean;
  /** Blur hash or base64 data URL for placeholder */
  placeholder?: 'blur' | 'empty';
  /** Blur data URL (base64 encoded small image) */
  blurDataURL?: string;
  /** Callback when image loads */
  onLoad?: () => void;
  /** Callback on error */
  onError?: () => void;
  /** Loading state override */
  loading?: 'lazy' | 'eager';
  /** Image sizes attribute for responsive images */
  sizes?: string;
  /** Quality (1-100) */
  quality?: number;
  /** Fill mode - image fills container */
  fill?: boolean;
  /** Enable hover zoom effect */
  hoverZoom?: boolean;
  /** Rounded corners */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Border styling */
  bordered?: boolean;
  /** Shadow styling */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Generate a simple blur data URL from a color
 * Use this as a fallback when no blurDataURL is provided
 */
function generateBlurDataURL(color: string = '#1a1a2e'): string {
  // Create a 1x1 pixel SVG with the given color
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="${color}"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Parse aspect ratio string to padding-bottom percentage
 */
function getAspectRatioPadding(aspectRatio: string): string {
  const [w, h] = aspectRatio.split('/').map(Number);
  if (!w || !h) return '56.25%'; // Default 16:9
  return `${(h / w) * 100}%`;
}

// =============================================================================
// Error Fallback Component
// =============================================================================

const ImageErrorFallback: React.FC<{ alt: string; className?: string }> = ({
  alt,
  className,
}) => (
  <div
    className={cn(
      'flex items-center justify-center bg-muted text-muted-foreground',
      className
    )}
  >
    <div className="text-center p-4">
      <svg
        className="w-8 h-8 mx-auto mb-2 opacity-50"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span className="text-xs">{alt}</span>
    </div>
  </div>
);

// =============================================================================
// Main Component
// =============================================================================

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  aspectRatio,
  objectFit = 'cover',
  objectPosition = 'center',
  className,
  containerClassName,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  loading,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  fill = false,
  hoverZoom = false,
  rounded = 'none',
  bordered = false,
  shadow = 'none',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Handle successful load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  // Handle error
  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Determine blur data URL
  const finalBlurDataURL = blurDataURL || generateBlurDataURL();

  // Rounded styles
  const roundedStyles = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  // Shadow styles
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  // If there's an error, show fallback
  if (hasError) {
    return (
      <div
        className={cn(
          roundedStyles[rounded],
          shadowStyles[shadow],
          bordered && 'border border-border',
          containerClassName
        )}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          aspectRatio: aspectRatio,
        }}
      >
        <ImageErrorFallback alt={alt} className={cn('w-full h-full', roundedStyles[rounded])} />
      </div>
    );
  }

  // Container with aspect ratio
  if (aspectRatio && !fill) {
    return (
      <div
        className={cn(
          'relative overflow-hidden',
          roundedStyles[rounded],
          shadowStyles[shadow],
          bordered && 'border border-border',
          hoverZoom && 'group cursor-pointer',
          containerClassName
        )}
        style={{ paddingBottom: getAspectRatioPadding(aspectRatio) }}
      >
        {/* Loading placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
          </div>
        )}
        
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={loading || (priority ? 'eager' : 'lazy')}
          placeholder={placeholder}
          blurDataURL={finalBlurDataURL}
          sizes={sizes}
          quality={quality}
          className={cn(
            'transition-all duration-500',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            objectFit === 'fill' && 'object-fill',
            objectFit === 'none' && 'object-none',
            objectFit === 'scale-down' && 'object-scale-down',
            !isLoaded && 'opacity-0 scale-105',
            isLoaded && 'opacity-100 scale-100',
            hoverZoom && 'group-hover:scale-110',
            className
          )}
          style={{ objectPosition }}
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    );
  }

  // Standard dimensions or fill mode
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        roundedStyles[rounded],
        shadowStyles[shadow],
        bordered && 'border border-border',
        hoverZoom && 'group cursor-pointer',
        containerClassName
      )}
      style={{
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
      }}
    >
      {/* Loading placeholder */}
      {!isLoaded && !priority && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : (width as number)}
        height={fill ? undefined : (height as number)}
        fill={fill}
        priority={priority}
        loading={loading || (priority ? 'eager' : 'lazy')}
        placeholder={placeholder}
        blurDataURL={finalBlurDataURL}
        sizes={sizes}
        quality={quality}
        className={cn(
          'transition-all duration-500',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down',
          !isLoaded && !priority && 'opacity-0 scale-105',
          isLoaded && 'opacity-100 scale-100',
          hoverZoom && 'group-hover:scale-110',
          className
        )}
        style={{ objectPosition }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

// =============================================================================
// Avatar Variant
// =============================================================================

interface LazyAvatarProps {
  src?: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

export const LazyAvatar: React.FC<LazyAvatarProps> = ({
  src,
  alt,
  size = 'md',
  fallback,
  className,
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const fallbackInitials = fallback || alt.slice(0, 2).toUpperCase();

  if (!src || hasError) {
    return (
      <div
        className={cn(
          'rounded-full bg-gradient-to-br from-[#e94560]/20 to-[#e94560]/5',
          'flex items-center justify-center text-[#e94560] font-medium',
          sizeClasses[size],
          className
        )}
      >
        {fallbackInitials}
      </div>
    );
  }

  return (
    <div className={cn('relative rounded-full overflow-hidden', sizeClasses[size], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

// =============================================================================
// Logo Variant
// =============================================================================

interface LazyLogoProps {
  src: string;
  alt: string;
  height?: number;
  className?: string;
}

export const LazyLogo: React.FC<LazyLogoProps> = ({
  src,
  alt,
  height = 32,
  className,
}) => {
  return (
    <LazyImage
      src={src}
      alt={alt}
      height={height}
      width={height * 3} // Assuming 3:1 aspect ratio for logos
      aspectRatio="3/1"
      objectFit="contain"
      objectPosition="left center"
      className={className}
      priority // Logos are usually above the fold
    />
  );
};

export default LazyImage;
