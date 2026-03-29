/**
 * Accessibility Check Utilities
 * ==============================
 * Automated accessibility check utilities for WCAG 2.1 AA compliance.
 * These functions can be used in development, testing, and runtime environments.
 * 
 * @accessibility
 * - Heading hierarchy validation
 * - ARIA label checking
 * - Color contrast verification
 * - Focus visibility detection
 * - Form label association
 * 
 * @usage
 * ```typescript
 * import { checkHeadingHierarchy, checkContrast } from '@/lib/a11y/checks';
 * 
 * // In development or testing
 * const hasValidHeadings = checkHeadingHierarchy();
 * const contrastResult = checkContrast(document.getElementById('button'));
 * ```
 */

// =============================================================================
// Types
// =============================================================================

export interface ContrastResult {
  /** The calculated contrast ratio (1-21) */
  ratio: number;
  /** Whether the contrast passes WCAG 2.1 AA */
  passes: boolean;
  /** WCAG level achieved (AA or AAA) */
  level: 'fail' | 'AA' | 'AAA';
  /** Text size category */
  textSize: 'normal' | 'large';
}

export interface A11yViolation {
  /** WCAG criterion ID */
  criterion: string;
  /** Severity level */
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  /** Description of the issue */
  message: string;
  /** Affected element (if applicable) */
  element?: string;
  /** Suggested fix */
  fix: string;
}

export interface CheckResult {
  /** Whether the check passed */
  passed: boolean;
  /** Violations found */
  violations: A11yViolation[];
}

// =============================================================================
// Color Contrast Utilities
// =============================================================================

/**
 * Parse RGB values from a color string
 * Supports hex, rgb, and rgba formats
 */
function parseColor(color: string): { r: number; g: number; b: number } | null {
  // Remove spaces
  const cleanColor = color.trim().toLowerCase();

  // Hex format
  const hexMatch = cleanColor.match(/^#([a-f0-9]{3,8})$/);
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
      };
    } else if (hex.length === 6 || hex.length === 8) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
  }

  // RGB/RGBA format
  const rgbMatch = cleanColor.match(/^rgba?\(([^)]+)\)$/);
  if (rgbMatch) {
    const values = rgbMatch[1].split(',').map(v => parseFloat(v.trim()));
    if (values.length >= 3) {
      return {
        r: values[0],
        g: values[1],
        b: values[2],
      };
    }
  }

  return null;
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 formula
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const c1 = parseColor(color1);
  const c2 = parseColor(color2);

  if (!c1 || !c2) return 1;

  const l1 = getLuminance(c1.r, c1.g, c1.b);
  const l2 = getLuminance(c2.r, c2.g, c2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get computed style color from an element
 */
function getComputedColor(element: HTMLElement, property: string): string {
  if (typeof window === 'undefined') return '#000000';
  const computed = window.getComputedStyle(element);
  return computed.getPropertyValue(property);
}

// =============================================================================
// Heading Hierarchy Check
// =============================================================================

/**
 * Check if heading hierarchy is valid (h1 → h2 → h3, etc.)
 * WCAG 2.1: 1.3.1 Info and Relationships
 * 
 * @returns Object with pass/fail status and any violations
 */
export function checkHeadingHierarchy(): CheckResult {
  const violations: A11yViolation[] = [];

  if (typeof document === 'undefined') {
    return { passed: true, violations: [] };
  }

  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  
  if (headings.length === 0) {
    violations.push({
      criterion: '1.3.1',
      severity: 'serious',
      message: 'No headings found on page',
      fix: 'Add at least one h1 heading to define page structure',
    });
    return { passed: false, violations };
  }

  // Check for h1 presence
  const h1s = headings.filter(h => h.tagName === 'H1');
  if (h1s.length === 0) {
    violations.push({
      criterion: '1.3.1',
      severity: 'serious',
      message: 'No h1 heading found',
      fix: 'Add an h1 heading as the main page title',
    });
  } else if (h1s.length > 1) {
    violations.push({
      criterion: '1.3.1',
      severity: 'moderate',
      message: `Multiple h1 headings found (${h1s.length})`,
      fix: 'Use only one h1 per page',
    });
  }

  // Check heading order
  let previousLevel = 0;
  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.tagName[1]);
    
    if (currentLevel > previousLevel + 1) {
      violations.push({
        criterion: '1.3.1',
        severity: 'moderate',
        message: `Heading level skipped: ${heading.tagName} follows ${previousLevel > 0 ? 'h' + previousLevel : 'no heading'}`,
        element: heading.outerHTML.slice(0, 100),
        fix: `Use h${previousLevel + 1} instead of ${heading.tagName} or add intermediate heading`,
      });
    }
    previousLevel = currentLevel;
  });

  return {
    passed: violations.length === 0,
    violations,
  };
}

// =============================================================================
// ARIA Labels Check
// =============================================================================

/**
 * Check ARIA labels on an element or document
 * WCAG 2.1: 4.1.2 Name, Role, Value
 * 
 * @param element - Element to check (defaults to document)
 * @returns Array of accessibility issues
 */
export function checkAriaLabels(element: HTMLElement | null = null): A11yViolation[] {
  const violations: A11yViolation[] = [];

  if (typeof document === 'undefined') {
    return violations;
  }

  const root = element || document.body;

  // Check interactive elements without accessible names
  const interactiveSelectors = [
    'button:not([aria-label]):not([aria-labelledby])',
    'a:not([aria-label]):not([aria-labelledby])',
    'input:not([type="hidden"]):not([aria-label]):not([aria-labelledby])',
    'select:not([aria-label]):not([aria-labelledby])',
    'textarea:not([aria-label]):not([aria-labelledby])',
    '[role="button"]:not([aria-label]):not([aria-labelledby])',
    '[role="link"]:not([aria-label]):not([aria-labelledby])',
    '[role="checkbox"]:not([aria-label]):not([aria-labelledby])',
  ];

  interactiveSelectors.forEach(selector => {
    const elements = root.querySelectorAll(selector);
    elements.forEach(el => {
      // Check if element has visible text or title
      const hasText = el.textContent?.trim().length > 0;
      const hasTitle = el.hasAttribute('title');
      const hasLabel = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
      
      // For images inside buttons/links, check alt text
      const hasImgWithAlt = el.querySelector('img[alt]');
      
      if (!hasText && !hasTitle && !hasLabel && !hasImgWithAlt) {
        // Check if it's an icon-only button
        const hasIcon = el.querySelector('svg, i, [class*="icon"]');
        
        if (hasIcon) {
          violations.push({
            criterion: '4.1.2',
            severity: 'serious',
            message: `Icon-only ${el.tagName.toLowerCase()} missing accessible name`,
            element: el.outerHTML.slice(0, 100),
            fix: 'Add aria-label attribute describing the button action',
          });
        } else if (el.tagName === 'INPUT' && !el.getAttribute('placeholder')) {
          violations.push({
            criterion: '4.1.2',
            severity: 'critical',
            message: `Input field missing label`,
            element: el.outerHTML.slice(0, 100),
            fix: 'Add <label> element with htmlFor attribute or aria-label',
          });
        }
      }
    });
  });

  // Check for redundant ARIA (role same as semantic element)
  const redundantRoles = [
    { selector: 'button[role="button"]', element: 'button' },
    { selector: 'a[role="link"]', element: 'a' },
    { selector: 'nav[role="navigation"]', element: 'nav' },
    { selector: 'main[role="main"]', element: 'main' },
  ];

  redundantRoles.forEach(({ selector, element }) => {
    const elements = root.querySelectorAll(selector);
    if (elements.length > 0) {
      violations.push({
        criterion: '4.1.2',
        severity: 'minor',
        message: `Redundant role attribute on <${element}>`,
        element: elements[0].outerHTML.slice(0, 100),
        fix: `Remove role="${element}" as it's implicit`,
      });
    }
  });

  return violations;
}

// =============================================================================
// Color Contrast Check
// =============================================================================

/**
 * Check color contrast of an element
 * WCAG 2.1: 1.4.3 Contrast (Minimum), 1.4.6 Contrast (Enhanced)
 * 
 * @param element - Element to check
 * @param isLargeText - Whether text is 18pt+ (or 14pt+ bold)
 * @returns Contrast result with ratio and pass/fail status
 */
export function checkContrast(
  element: HTMLElement | null,
  isLargeText: boolean = false
): ContrastResult {
  const defaultResult: ContrastResult = {
    ratio: 1,
    passes: false,
    level: 'fail',
    textSize: isLargeText ? 'large' : 'normal',
  };

  if (!element || typeof window === 'undefined') {
    return defaultResult;
  }

  const foreground = getComputedColor(element, 'color');
  const background = getComputedColor(element, 'background-color');

  // If background is transparent, try to find parent background
  let effectiveBackground = background;
  let parent = element.parentElement;
  while (effectiveBackground === 'rgba(0, 0, 0, 0)' && parent) {
    effectiveBackground = getComputedColor(parent, 'background-color');
    parent = parent.parentElement;
  }

  // Default to white if still transparent
  if (effectiveBackground === 'rgba(0, 0, 0, 0)') {
    effectiveBackground = '#ffffff';
  }

  const ratio = getContrastRatio(foreground, effectiveBackground);

  // WCAG thresholds
  const aaThreshold = isLargeText ? 3 : 4.5;
  const aaaThreshold = isLargeText ? 4.5 : 7;

  let level: 'fail' | 'AA' | 'AAA' = 'fail';
  if (ratio >= aaaThreshold) {
    level = 'AAA';
  } else if (ratio >= aaThreshold) {
    level = 'AA';
  }

  return {
    ratio: Math.round(ratio * 100) / 100,
    passes: ratio >= aaThreshold,
    level,
    textSize: isLargeText ? 'large' : 'normal',
  };
}

/**
 * Check all text elements for contrast compliance
 * @returns Array of violations
 */
export function checkAllContrasts(): A11yViolation[] {
  const violations: A11yViolation[] = [];

  if (typeof document === 'undefined') {
    return violations;
  }

  // Check text elements
  const textSelectors = [
    'p',
    'span',
    'a',
    'button',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'label',
    'li',
  ];

  const elements = document.querySelectorAll(textSelectors.join(', '));
  
  elements.forEach(el => {
    const computed = window.getComputedStyle(el);
    const fontSize = parseFloat(computed.fontSize);
    const fontWeight = parseInt(computed.fontWeight);
    
    // Large text: 18px+ or 14px+ bold
    const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
    
    const result = checkContrast(el as HTMLElement, isLargeText);
    
    if (!result.passes) {
      violations.push({
        criterion: '1.4.3',
        severity: 'serious',
        message: `Insufficient color contrast: ${result.ratio}:1 (requires ${isLargeText ? 3 : 4.5}:1)`,
        element: el.outerHTML.slice(0, 100),
        fix: `Increase contrast ratio to at least ${isLargeText ? 3 : 4.5}:1`,
      });
    }
  });

  return violations;
}

// =============================================================================
// Focus Visibility Check
// =============================================================================

/**
 * Check if an element has visible focus indicators
 * WCAG 2.1: 2.4.7 Focus Visible
 * 
 * @param element - Element to check
 * @returns true if element has visible focus indicator
 */
export function checkFocusVisible(element: HTMLElement | null): boolean {
  if (!element || typeof window === 'undefined') {
    return false;
  }

  const computed = window.getComputedStyle(element);
  
  // Check for outline
  const hasOutline = computed.outlineStyle !== 'none' && 
                     computed.outlineWidth !== '0px' &&
                     computed.outlineColor !== 'transparent';
  
  // Check for box-shadow used as focus indicator
  const hasFocusShadow = computed.boxShadow !== 'none';
  
  // Check for border changes
  const hasBorderChange = computed.borderStyle !== 'none';

  return hasOutline || hasFocusShadow || hasBorderChange;
}

/**
 * Check all interactive elements for focus visibility
 * @returns Array of violations
 */
export function checkAllFocusVisibility(): A11yViolation[] {
  const violations: A11yViolation[] = [];

  if (typeof document === 'undefined') {
    return violations;
  }

  const interactiveSelectors = [
    'button',
    'a[href]',
    'input:not([type="hidden"])',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]',
    '[role="link"]',
    '[role="checkbox"]',
    '[role="radio"]',
  ];

  const elements = document.querySelectorAll(interactiveSelectors.join(', '));
  
  elements.forEach(el => {
    const hasFocusStyle = checkFocusVisible(el as HTMLElement);
    
    if (!hasFocusStyle) {
      violations.push({
        criterion: '2.4.7',
        severity: 'serious',
        message: 'Interactive element lacks visible focus indicator',
        element: el.outerHTML.slice(0, 100),
        fix: 'Add CSS :focus style with outline, box-shadow, or border change',
      });
    }
  });

  return violations;
}

// =============================================================================
// Form Labels Check
// =============================================================================

/**
 * Check that all form inputs have associated labels
 * WCAG 2.1: 1.3.1 Info and Relationships, 3.3.2 Labels or Instructions
 * 
 * @returns Array of form inputs without labels
 */
export function checkFormLabels(): A11yViolation[] {
  const violations: A11yViolation[] = [];

  if (typeof document === 'undefined') {
    return violations;
  }

  const inputSelectors = [
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="image"])',
    'select',
    'textarea',
  ];

  const inputs = document.querySelectorAll(inputSelectors.join(', '));
  
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    const hasTitle = input.hasAttribute('title');
    const placeholder = input.getAttribute('placeholder');
    
    // Check for explicit label
    let hasExplicitLabel = false;
    if (id) {
      hasExplicitLabel = document.querySelector(`label[for="${id}"]`) !== null;
    }
    
    // Check for implicit label (input wrapped in label)
    const hasImplicitLabel = input.closest('label') !== null;
    
    // Check if input has accessible name
    const hasAccessibleName = ariaLabel || ariaLabelledBy || hasExplicitLabel || 
                               hasImplicitLabel || hasTitle;
    
    if (!hasAccessibleName) {
      violations.push({
        criterion: '1.3.1',
        severity: 'critical',
        message: `Form input missing label: ${input.getAttribute('type') || input.tagName.toLowerCase()}`,
        element: input.outerHTML.slice(0, 100),
        fix: placeholder 
          ? 'Add <label> element with htmlFor attribute (placeholder is not a substitute for a label)'
          : 'Add <label> element with htmlFor attribute or aria-label',
      });
    }

    // Warn about placeholder-only labels
    if (placeholder && !hasAccessibleName) {
      violations.push({
        criterion: '3.3.2',
        severity: 'moderate',
        message: 'Form input relies solely on placeholder for identification',
        element: input.outerHTML.slice(0, 100),
        fix: 'Add a persistent label element, not just placeholder text',
      });
    }
  });

  return violations;
}

// =============================================================================
// Image Alt Text Check
// =============================================================================

/**
 * Check that all images have alt text
 * WCAG 2.1: 1.1.1 Non-text Content
 * 
 * @returns Array of images without alt text
 */
export function checkImageAltText(): A11yViolation[] {
  const violations: A11yViolation[] = [];

  if (typeof document === 'undefined') {
    return violations;
  }

  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    const alt = img.getAttribute('alt');
    const ariaLabel = img.getAttribute('aria-label');
    const ariaLabelledBy = img.getAttribute('aria-labelledby');
    const hasTitle = img.hasAttribute('title');
    const role = img.getAttribute('role');
    
    // Decorative images should have alt="" or role="presentation"
    const isDecorative = alt === '' || role === 'presentation' || role === 'none';
    
    // Check if image has accessible name
    const hasAccessibleName = alt !== null || ariaLabel || ariaLabelledBy || hasTitle;
    
    if (!hasAccessibleName && !isDecorative) {
      violations.push({
        criterion: '1.1.1',
        severity: 'serious',
        message: 'Image missing alt text',
        element: img.outerHTML.slice(0, 100),
        fix: 'Add alt attribute describing the image, or alt="" if decorative',
      });
    }
  });

  return violations;
}

// =============================================================================
// Landmark Regions Check
// =============================================================================

/**
 * Check for proper landmark regions
 * WCAG 2.1: 1.3.1 Info and Relationships, 2.4.1 Bypass Blocks
 * 
 * @returns Array of landmark-related violations
 */
export function checkLandmarkRegions(): A11yViolation[] {
  const violations: A11yViolation[] = [];

  if (typeof document === 'undefined') {
    return violations;
  }

  // Check for main landmark
  const main = document.querySelector('main, [role="main"]');
  if (!main) {
    violations.push({
      criterion: '2.4.1',
      severity: 'moderate',
      message: 'No main landmark region found',
      fix: 'Wrap main content in <main> element or add role="main"',
    });
  }

  // Check for navigation landmark
  const nav = document.querySelector('nav, [role="navigation"]');
  if (!nav) {
    violations.push({
      criterion: '2.4.1',
      severity: 'minor',
      message: 'No navigation landmark region found',
      fix: 'Wrap navigation in <nav> element or add role="navigation"',
    });
  }

  // Check for multiple mains
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    violations.push({
      criterion: '1.3.1',
      severity: 'moderate',
      message: `Multiple main landmarks found (${mains.length})`,
      fix: 'Use only one main landmark per page',
    });
  }

  return violations;
}

// =============================================================================
// Skip Link Check
// =============================================================================

/**
 * Check for skip link
 * WCAG 2.1: 2.4.1 Bypass Blocks
 * 
 * @returns Check result
 */
export function checkSkipLink(): CheckResult {
  const violations: A11yViolation[] = [];

  if (typeof document === 'undefined') {
    return { passed: true, violations: [] };
  }

  const skipLink = document.querySelector(
    'a[href^="#"], a[href^="#main"], .sr-only, .skip-link'
  );
  
  if (!skipLink) {
    violations.push({
      criterion: '2.4.1',
      severity: 'moderate',
      message: 'No skip link found',
      fix: 'Add a "Skip to main content" link as the first focusable element',
    });
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

// =============================================================================
// Language Attribute Check
// =============================================================================

/**
 * Check for lang attribute on html element
 * WCAG 2.1: 3.1.1 Language of Page
 * 
 * @returns Check result
 */
export function checkLangAttribute(): CheckResult {
  const violations: A11yViolation[] = [];

  if (typeof document === 'undefined') {
    return { passed: true, violations: [] };
  }

  const html = document.documentElement;
  const lang = html.getAttribute('lang');
  
  if (!lang) {
    violations.push({
      criterion: '3.1.1',
      severity: 'serious',
      message: 'HTML element missing lang attribute',
      fix: 'Add lang attribute to <html> element (e.g., lang="en")',
    });
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

// =============================================================================
// Page Title Check
// =============================================================================

/**
 * Check for page title
 * WCAG 2.1: 2.4.2 Page Titled
 * 
 * @returns Check result
 */
export function checkPageTitle(): CheckResult {
  const violations: A11yViolation[] = [];

  if (typeof document === 'undefined') {
    return { passed: true, violations: [] };
  }

  const title = document.querySelector('title');
  const titleText = title?.textContent?.trim();
  
  if (!title) {
    violations.push({
      criterion: '2.4.2',
      severity: 'serious',
      message: 'Page missing title element',
      fix: 'Add <title> element in <head>',
    });
  } else if (!titleText || titleText.length === 0) {
    violations.push({
      criterion: '2.4.2',
      severity: 'serious',
      message: 'Page title is empty',
      fix: 'Add descriptive text to the <title> element',
    });
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}
