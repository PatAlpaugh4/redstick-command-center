/**
 * Responsive Testing Utilities
 * =============================
 * Helper functions and types for responsive design testing
 */

import { vi } from 'vitest';

// =============================================================================
// Types
// =============================================================================

export interface ViewportSize {
  width: number;
  height: number;
}

export interface BreakpointConfig {
  name: string;
  size: ViewportSize;
  description: string;
}

// =============================================================================
// Standard Breakpoints
// =============================================================================

export const BREAKPOINTS = {
  // Mobile
  xs: { width: 320, height: 568, name: 'iPhone SE' },
  sm: { width: 375, height: 812, name: 'iPhone 12/13' },
  md: { width: 414, height: 896, name: 'iPhone Pro Max' },
  
  // Tablet
  lg: { width: 768, height: 1024, name: 'iPad' },
  xl: { width: 1024, height: 1366, name: 'iPad Pro' },
  
  // Desktop
  '2xl': { width: 1440, height: 900, name: 'Desktop' },
  '3xl': { width: 1920, height: 1080, name: 'Large Desktop' },
} as const;

export const BREAKPOINT_CONFIGS: BreakpointConfig[] = [
  { name: '320px', size: BREAKPOINTS.xs, description: 'Small phones (iPhone SE)' },
  { name: '375px', size: BREAKPOINTS.sm, description: 'Standard phones (iPhone 12/13)' },
  { name: '414px', size: BREAKPOINTS.md, description: 'Large phones (iPhone Pro Max)' },
  { name: '768px', size: BREAKPOINTS.lg, description: 'Tablets (iPad)' },
  { name: '1024px', size: BREAKPOINTS.xl, description: 'Large tablets / Small laptops' },
  { name: '1440px', size: BREAKPOINTS['2xl'], description: 'Desktop screens' },
];

// =============================================================================
// Viewport Manipulation
// =============================================================================

/**
 * Set the viewport size for testing
 */
export function setViewport(size: ViewportSize): void {
  // Set window dimensions
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: size.width,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: size.height,
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
  
  // Update matchMedia
  updateMatchMedia(size.width);
}

/**
 * Update matchMedia to reflect current viewport
 */
export function updateMatchMedia(width: number): void {
  const mediaQueries: Record<string, boolean> = {
    '(max-width: 320px)': width <= 320,
    '(max-width: 374px)': width <= 374,
    '(max-width: 639px)': width <= 639,
    '(max-width: 767px)': width <= 767,
    '(max-width: 1023px)': width <= 1023,
    '(max-width: 1279px)': width <= 1279,
    '(max-width: 1535px)': width <= 1535,
    '(min-width: 640px)': width >= 640,
    '(min-width: 768px)': width >= 768,
    '(min-width: 1024px)': width >= 1024,
    '(min-width: 1280px)': width >= 1280,
    '(min-width: 1536px)': width >= 1536,
    '(orientation: portrait)': width < window.innerHeight,
    '(orientation: landscape)': width > window.innerHeight,
  };
  
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: mediaQueries[query] || false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// =============================================================================
// Responsive Testing Helpers
// =============================================================================

/**
 * Test a component at multiple breakpoints
 */
export function testAtBreakpoints(
  name: string,
  testFn: (breakpoint: BreakpointConfig) => void
): void {
  BREAKPOINT_CONFIGS.forEach((breakpoint) => {
    describe(`${name} at ${breakpoint.name}`, () => {
      beforeEach(() => {
        setViewport(breakpoint.size);
      });
      
      testFn(breakpoint);
    });
  });
}

/**
 * Check if element overflows its container
 */
export function checkOverflow(element: Element): {
  horizontal: boolean;
  vertical: boolean;
  overflowX: number;
  overflowY: number;
} {
  const rect = element.getBoundingClientRect();
  const parent = element.parentElement;
  
  if (!parent) {
    return { horizontal: false, vertical: false, overflowX: 0, overflowY: 0 };
  }
  
  const parentRect = parent.getBoundingClientRect();
  
  const overflowX = Math.max(0, rect.right - parentRect.right);
  const overflowY = Math.max(0, rect.bottom - parentRect.bottom);
  
  return {
    horizontal: overflowX > 0,
    vertical: overflowY > 0,
    overflowX,
    overflowY,
  };
}

/**
 * Verify touch targets meet minimum size requirements
 */
export function verifyTouchTargets(minSize: number = 44): {
  valid: boolean;
  violations: Element[];
} {
  const interactiveElements = document.querySelectorAll(
    'button, a, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const violations: Element[] = [];
  
  interactiveElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      if (rect.width < minSize || rect.height < minSize) {
        violations.push(el);
      }
    }
  });
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Check text readability (minimum font size)
 */
export function verifyTextReadability(minSize: number = 12): {
  valid: boolean;
  violations: { element: Element; fontSize: number }[];
} {
  const textElements = document.querySelectorAll(
    'p, span, h1, h2, h3, h4, h5, h6, a, button, label, li'
  );
  
  const violations: { element: Element; fontSize: number }[] = [];
  
  textElements.forEach((el) => {
    const style = window.getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize);
    
    if (fontSize > 0 && fontSize < minSize) {
      violations.push({ element: el, fontSize });
    }
  });
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

// =============================================================================
// Orientation Testing
// =============================================================================

/**
 * Set landscape orientation
 */
export function setLandscape(size: ViewportSize = BREAKPOINTS.sm): void {
  setViewport({
    width: size.height,
    height: size.width,
  });
}

/**
 * Set portrait orientation
 */
export function setPortrait(size: ViewportSize = BREAKPOINTS.sm): void {
  setViewport(size);
}

// =============================================================================
// CSS Custom Property Testing
// =============================================================================

/**
 * Get CSS custom property value
 */
export function getCSSCustomProperty(property: string, element?: Element): string {
  const target = element || document.documentElement;
  return getComputedStyle(target).getPropertyValue(property).trim();
}

/**
 * Verify container queries are supported
 */
export function supportsContainerQueries(): boolean {
  return CSS.supports('container-type', 'inline-size');
}

// =============================================================================
// Performance Testing
// =============================================================================

/**
 * Measure layout shift during viewport changes
 */
export async function measureLayoutShift(
  callback: () => Promise<void> | void
): Promise<number> {
  let shiftScore = 0;
  
  // Use Performance Observer if available
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift') {
          shiftScore += (entry as any).value;
        }
      }
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
    
    await callback();
    
    // Small delay to capture all shifts
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    observer.disconnect();
  } else {
    await callback();
  }
  
  return shiftScore;
}

// =============================================================================
// Export for test setup
// =============================================================================

export function setupResponsiveTests(): void {
  // Set default viewport
  setViewport(BREAKPOINTS['2xl']);
}

// Default export
export default {
  BREAKPOINTS,
  BREAKPOINT_CONFIGS,
  setViewport,
  updateMatchMedia,
  testAtBreakpoints,
  checkOverflow,
  verifyTouchTargets,
  verifyTextReadability,
  setLandscape,
  setPortrait,
  setupResponsiveTests,
};
