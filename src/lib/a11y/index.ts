/**
 * Accessibility Utilities
 * =======================
 * Centralized exports for all accessibility utilities.
 * 
 * @example
 * ```typescript
 * // Import everything
 * import { runAccessibilityAudit, checkContrast, useAnnouncer } from '@/lib/a11y';
 * 
 * // Import specific modules
 * import { checkHeadingHierarchy } from '@/lib/a11y/checks';
 * import { runQuickAudit } from '@/lib/a11y/audit';
 * ```
 */

// =============================================================================
// Checks - Individual accessibility checks
// =============================================================================

export {
  // Heading checks
  checkHeadingHierarchy,
  
  // ARIA checks
  checkAriaLabels,
  
  // Contrast checks
  checkContrast,
  checkAllContrasts,
  
  // Focus checks
  checkFocusVisible,
  checkAllFocusVisibility,
  
  // Form checks
  checkFormLabels,
  
  // Content checks
  checkImageAltText,
  checkLandmarkRegions,
  checkSkipLink,
  checkLangAttribute,
  checkPageTitle,
} from './checks';

// Export types from checks
export type {
  ContrastResult,
  A11yViolation,
  CheckResult,
} from './checks';

// =============================================================================
// Audit - Comprehensive WCAG audit
// =============================================================================

export {
  // Main audit functions
  runAccessibilityAudit,
  runQuickAudit,
  
  // Individual checks (re-exported for convenience)
  checkHeadingHierarchy,
  checkAriaLabels,
  checkContrast,
  checkAllContrasts,
  checkFocusVisible,
  checkAllFocusVisibility,
  checkFormLabels,
  checkImageAltText,
  checkLandmarkRegions,
  checkSkipLink,
  checkLangAttribute,
  checkPageTitle,
} from './audit';

// Export types from audit
export type {
  WcagLevel,
  Severity,
  AuditViolation,
  AuditResult,
} from './audit';

// =============================================================================
// Constants
// =============================================================================

/** WCAG 2.1 AA contrast thresholds */
export const CONTRAST_THRESHOLDS = {
  /** Normal text (14pt or smaller) */
  NORMAL_AA: 4.5,
  /** Large text (18pt+ or 14pt+ bold) */
  LARGE_AA: 3,
  /** Normal text AAA */
  NORMAL_AAA: 7,
  /** Large text AAA */
  LARGE_AAA: 4.5,
  /** UI components and graphical objects */
  UI_COMPONENTS: 3,
} as const;

/** WCAG 2.1 success criteria by level */
export const WCAG_CRITERIA = {
  /** Level A - Must satisfy */
  A: [
    '1.1.1', '1.2.1', '1.2.2', '1.2.3', '1.3.1', '1.3.2', '1.3.3',
    '1.4.1', '1.4.2', '2.1.1', '2.1.2', '2.2.1', '2.2.2', '2.3.1',
    '2.4.1', '2.4.2', '2.4.3', '2.4.4', '3.1.1', '3.2.1', '3.2.2',
    '3.3.1', '3.3.2', '4.1.1', '4.1.2',
  ],
  /** Level AA - Should satisfy */
  AA: [
    '1.2.4', '1.2.5', '1.3.4', '1.3.5', '1.4.3', '1.4.4', '1.4.5',
    '1.4.10', '1.4.11', '1.4.12', '1.4.13', '2.1.4', '2.4.5', '2.4.6',
    '2.4.7', '2.5.1', '2.5.2', '2.5.3', '2.5.4', '3.1.2', '3.2.3',
    '3.2.4', '3.3.3', '3.3.4', '4.1.3',
  ],
  /** Level AAA - May satisfy */
  AAA: [
    '1.2.6', '1.2.7', '1.2.8', '1.2.9', '1.4.6', '1.4.7', '1.4.8',
    '1.4.9', '2.1.3', '2.2.3', '2.2.4', '2.2.5', '2.2.6', '2.3.2',
    '2.3.3', '2.4.8', '2.4.9', '2.4.10', '2.5.5', '2.5.6', '3.1.3',
    '3.1.4', '3.1.5', '3.1.6', '3.2.5', '3.3.5', '3.3.6',
  ],
} as const;

/** Severity levels and their descriptions */
export const SEVERITY_LEVELS = {
  /** Blocks access to content or functionality */
  critical: {
    description: 'Blocks access to content or functionality',
    examples: ['Missing alt text on informative images', 'Form inputs without labels'],
    priority: 'Fix immediately',
  },
  /** Significantly impacts usability */
  serious: {
    description: 'Significantly impacts usability',
    examples: ['Poor color contrast', 'Missing heading structure'],
    priority: 'Fix within 1 week',
  },
  /** Causes some difficulty but workarounds exist */
  moderate: {
    description: 'Causes some difficulty but workarounds exist',
    examples: ['Redundant ARIA attributes', 'Minor heading skips'],
    priority: 'Fix within 1 month',
  },
  /** Minor issues that don\'t significantly impact users */
  minor: {
    description: 'Minor issues that don\'t significantly impact users',
    examples: ['Missing landmarks', 'Redundant role attributes'],
    priority: 'Fix when convenient',
  },
} as const;

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Check if running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Generate a unique ID for accessibility attributes
 */
export function generateA11yId(prefix: string = 'a11y'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Escape special regex characters in a string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check if an element is visible to assistive technologies
 */
export function isVisibleToAT(element: HTMLElement): boolean {
  if (!isBrowser()) return false;
  
  const style = window.getComputedStyle(element);
  
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    element.getAttribute('aria-hidden') !== 'true' &&
    !element.hasAttribute('hidden')
  );
}

/**
 * Get accessible name for an element
 */
export function getAccessibleName(element: HTMLElement): string {
  if (!isBrowser()) return '';
  
  // Check aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent || '';
  }
  
  // Check title attribute
  const title = element.getAttribute('title');
  if (title) return title;
  
  // Check associated label (for form inputs)
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent || '';
  }
  
  // Check if wrapped in label
  const parentLabel = element.closest('label');
  if (parentLabel) {
    // Get text content excluding the input itself
    const text = parentLabel.textContent || '';
    const inputText = element.textContent || '';
    return text.replace(inputText, '').trim();
  }
  
  // Return text content
  return element.textContent?.trim() || '';
}

// =============================================================================
// Contrast Utilities
// =============================================================================

export {
  parseColor,
  getLuminance,
  getContrastRatio,
  analyzeContrast,
  passesAA,
  passesAAA,
  passesNonTextContrast,
  adjustBrightness,
  getRecommendedColor,
  findAccessibleColor,
  formatContrastRatio,
  getWCAGLevel,
  validatePalette,
  WCAG_AA_NORMAL,
  WCAG_AA_LARGE,
  WCAG_AAA_NORMAL,
  WCAG_AAA_LARGE,
  WCAG_NON_TEXT,
  type RGBColor,
  type ContrastResult,
} from './contrast';

// =============================================================================
// Testing Utilities
// =============================================================================

export {
  checkA11y,
  expectToHaveNoViolations,
  testKeyboardNavigation,
  testFocusTrap,
  testAriaAnnouncements,
  testAccessibleName,
  testColorContrast,
  configureA11yTesting,
  a11yMatchers,
  type KeyboardTestOptions,
  type FocusTrapOptions,
  type A11yTestConfig,
} from './test-utils';

// =============================================================================
// React Hooks (if needed in the future)
// =============================================================================

// Placeholder for future React-specific a11y hooks
// export { useAccessibilityAudit } from './hooks';
