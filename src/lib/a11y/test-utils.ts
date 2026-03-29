/**
 * Accessibility Testing Utilities
 * ================================
 * Testing utilities for automated accessibility testing with jest-axe and axe-core.
 * 
 * @accessibility
 * - Integrates with jest-axe for automated a11y testing
 * - Provides keyboard navigation testing helpers
 * - Includes focus management validation
 * 
 * @see https://github.com/nickcolley/jest-axe
 * @see https://www.deque.com/axe/core-documentation/api-documentation/
 */

import { configureAxe, type AxeResults, type RunOptions } from 'axe-core';

// =============================================================================
// Types
// =============================================================================

export interface KeyboardTestOptions {
  /** Elements to test navigation between */
  elements: HTMLElement[];
  /** Expected tab order (indices of elements) */
  expectedOrder?: number[];
  /** Whether to test reverse tab (Shift+Tab) */
  testReverse?: boolean;
  /** Whether focus should wrap around */
  shouldWrap?: boolean;
}

export interface FocusTrapOptions {
  /** Container element that should trap focus */
  container: HTMLElement;
  /** Initial focus element */
  initialFocus?: HTMLElement;
  /** Elements outside container that should not receive focus */
  outsideElements?: HTMLElement[];
}

export interface A11yTestConfig {
  /** axe-core run options */
  axeOptions?: RunOptions;
  /** Whether to include experimental rules */
  experimentalRules?: boolean;
}

// =============================================================================
// axe-core Integration
// =============================================================================

/**
 * Default axe configuration for WCAG 2.1 AA compliance
 */
export const defaultAxeConfig: RunOptions = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
  },
  rules: {
    // Enable experimental rules for better coverage
    'color-contrast-enhanced': { enabled: false }, // AAA only
    // Disable rules that may have false positives in test environment
    'page-has-heading-one': { enabled: false },
    'region': { enabled: false },
  },
};

/**
 * Configure axe with custom options
 */
export function configureA11yTesting(config?: A11yTestConfig): typeof axe {
  const options: RunOptions = {
    ...defaultAxeConfig,
    ...config?.axeOptions,
  };

  if (config?.experimentalRules) {
    options.rules = {
      ...options.rules,
      'object-alt': { enabled: true },
      'aria-allowed-attr': { enabled: true },
      'aria-conditional-attr': { enabled: true },
      'aria-deprecated-role': { enabled: true },
      'aria-prohibited-attr': { enabled: true },
      'aria-required-attr': { enabled: true },
      'aria-required-children': { enabled: true },
      'aria-required-parent': { enabled: true },
      'aria-roledescription': { enabled: true },
      'aria-roles': { enabled: true },
      'aria-text': { enabled: true },
      'aria-valid-attr-value': { enabled: true },
      'aria-valid-attr': { enabled: true },
      'duplicate-id-aria': { enabled: true },
      'empty-heading': { enabled: true },
      'heading-order': { enabled: true },
      'input-button-name': { enabled: true },
      'label-title-only': { enabled: true },
      'link-in-text-block': { enabled: true },
      'no-autoplay-audio': { enabled: true },
      'p-as-heading': { enabled: true },
      'target-size': { enabled: true },
    };
  }

  return configureAxe({
    branding: {
      brand: 'Redstick Ventures',
      application: 'Dashboard Accessibility Tests',
    },
    ...options,
  });
}

/**
 * Run axe accessibility check on an element
 * 
 * @example
 * ```typescript
 * const { container } = render(<Button>Click me</Button>);
 * const results = await checkA11y(container);
 * expectToHaveNoViolations(results);
 * ```
 */
export async function checkA11y(
  element: HTMLElement,
  options?: RunOptions
): Promise<AxeResults> {
  // Dynamic import axe-core to avoid issues in non-test environments
  const axe = (await import('axe-core')).default;
  
  const results = await axe.run(element, {
    ...defaultAxeConfig,
    ...options,
  });
  
  return results;
}

/**
 * Assert that axe results have no violations
 * Compatible with jest-axe's toHaveNoViolations matcher
 * 
 * @example
 * ```typescript
 * const results = await axe(container);
 * expectToHaveNoViolations(results);
 * ```
 */
export function expectToHaveNoViolations(results: AxeResults): void {
  if (results.violations.length === 0) {
    return;
  }

  const violationMessages = results.violations.map((violation) => {
    const nodes = violation.nodes.map((node) => {
      const target = Array.isArray(node.target) 
        ? node.target.join(', ') 
        : node.target;
      return `    - ${target}\n      ${node.failureSummary || ''}`;
    }).join('\n');

    return `
  ${violation.id}: ${violation.description}
  Impact: ${violation.impact}
  Help: ${violation.help}
  Help URL: ${violation.helpUrl}
  Affected nodes:
${nodes}`;
  }).join('\n');

  const message = `Found ${results.violations.length} accessibility violation${
    results.violations.length === 1 ? '' : 's'
  }:${violationMessages}`;

  throw new Error(message);
}

// =============================================================================
// Keyboard Navigation Testing
// =============================================================================

/**
 * Test keyboard navigation between elements
 * Verifies Tab key navigation follows expected order
 * 
 * @example
 * ```typescript
 * const button1 = screen.getByText('Button 1');
 * const button2 = screen.getByText('Button 2');
 * const success = await testKeyboardNavigation({
 *   elements: [button1, button2],
 *   expectedOrder: [0, 1],
 * });
 * expect(success).toBe(true);
 * ```
 */
export async function testKeyboardNavigation(
  options: KeyboardTestOptions
): Promise<boolean> {
  const { elements, expectedOrder, testReverse = true, shouldWrap = false } = options;

  if (elements.length === 0) {
    throw new Error('No elements provided for keyboard navigation test');
  }

  // Focus first element
  elements[0].focus();

  // Test forward navigation (Tab)
  const order = expectedOrder || elements.map((_, i) => i);
  
  for (let i = 0; i < order.length; i++) {
    const expectedIndex = order[i];
    const currentElement = elements[expectedIndex];
    
    if (document.activeElement !== currentElement) {
      console.error(
        `Focus mismatch at step ${i}. Expected element ${expectedIndex}, got:`,
        document.activeElement
      );
      return false;
    }

    // Press Tab to move to next element
    if (i < order.length - 1 || shouldWrap) {
      simulateKeyPress('Tab');
      // Allow for focus change to propagate
      await waitForFocusChange();
    }
  }

  // Test reverse navigation (Shift+Tab)
  if (testReverse) {
    // Reset to last element
    elements[order[order.length - 1]].focus();

    for (let i = order.length - 1; i >= 0; i--) {
      const expectedIndex = order[i];
      const currentElement = elements[expectedIndex];

      if (document.activeElement !== currentElement) {
        console.error(
          `Reverse focus mismatch at step ${i}. Expected element ${expectedIndex}, got:`,
          document.activeElement
        );
        return false;
      }

      if (i > 0 || shouldWrap) {
        simulateKeyPress('Tab', { shiftKey: true });
        await waitForFocusChange();
      }
    }
  }

  return true;
}

/**
 * Test that focus is trapped within a container
 * Used for modals, dialogs, and other overlay components
 * 
 * @example
 * ```typescript
 * const modal = screen.getByRole('dialog');
 * const trapped = await testFocusTrap({
 *   container: modal,
 *   outsideElements: [document.querySelector('header')!],
 * });
 * expect(trapped).toBe(true);
 * ```
 */
export async function testFocusTrap(options: FocusTrapOptions): Promise<boolean> {
  const { container, initialFocus, outsideElements = [] } = options;

  // Set initial focus
  if (initialFocus) {
    initialFocus.focus();
  } else {
    // Try to find first focusable element
    const firstFocusable = getFocusableElements(container)[0];
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  // Get all focusable elements within container
  const focusableElements = getFocusableElements(container);
  
  if (focusableElements.length === 0) {
    throw new Error('No focusable elements found in container');
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // Test Tab from last element wraps to first
  lastElement.focus();
  simulateKeyPress('Tab');
  await waitForFocusChange();

  if (document.activeElement !== firstElement) {
    console.error(
      'Focus trap failed: Tab from last element did not wrap to first.',
      'Expected:', firstElement,
      'Got:', document.activeElement
    );
    return false;
  }

  // Test Shift+Tab from first element wraps to last
  firstElement.focus();
  simulateKeyPress('Tab', { shiftKey: true });
  await waitForFocusChange();

  if (document.activeElement !== lastElement) {
    console.error(
      'Focus trap failed: Shift+Tab from first element did not wrap to last.',
      'Expected:', lastElement,
      'Got:', document.activeElement
    );
    return false;
  }

  // Verify outside elements cannot be focused
  for (const outsideElement of outsideElements) {
    if (outsideElement === document.activeElement) {
      console.error('Focus trap failed: Outside element is focused:', outsideElement);
      return false;
    }
  }

  return true;
}

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled]):not([aria-hidden="true"])',
    'a[href]:not([aria-hidden="true"])',
    'input:not([disabled]):not([type="hidden"]):not([aria-hidden="true"])',
    'select:not([disabled]):not([aria-hidden="true"])',
    'textarea:not([disabled]):not([aria-hidden="true"])',
    '[tabindex]:not([tabindex="-1"]):not([disabled]):not([aria-hidden="true"])',
    '[contenteditable]:not([contenteditable="false"])',
  ];

  return Array.from(
    container.querySelectorAll(focusableSelectors.join(', '))
  ) as HTMLElement[];
}

/**
 * Simulate a keyboard event
 */
function simulateKeyPress(
  key: string,
  options: { shiftKey?: boolean; ctrlKey?: boolean; altKey?: boolean; metaKey?: boolean } = {}
): void {
  const event = new KeyboardEvent('keydown', {
    key,
    code: `Key${key.toUpperCase()}`,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  
  document.activeElement?.dispatchEvent(event);
}

/**
 * Wait for focus to change (helper for async focus operations)
 */
function waitForFocusChange(ms: number = 50): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// Screen Reader Testing Helpers
// =============================================================================

/**
 * Test that an element has proper ARIA announcements
 */
export function testAriaAnnouncements(
  element: HTMLElement,
  expectedLiveRegion: 'polite' | 'assertive' = 'polite'
): boolean {
  const liveRegion = element.closest('[aria-live]') || 
    element.querySelector('[aria-live]') ||
    document.querySelector(`[aria-live="${expectedLiveRegion}"]`);

  if (!liveRegion) {
    console.error(`No aria-live region found with value: ${expectedLiveRegion}`);
    return false;
  }

  const actualLive = liveRegion.getAttribute('aria-live');
  if (actualLive !== expectedLiveRegion) {
    console.error(
      `Expected aria-live="${expectedLiveRegion}", got aria-live="${actualLive}"`
    );
    return false;
  }

  return true;
}

/**
 * Verify element has accessible name
 */
export function testAccessibleName(
  element: HTMLElement,
  expectedName?: string
): boolean {
  const accessibleName = element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    (element as HTMLInputElement).placeholder ||
    element.textContent?.trim();

  if (!accessibleName) {
    console.error('Element has no accessible name:', element);
    return false;
  }

  if (expectedName && accessibleName !== expectedName) {
    console.error(
      `Expected accessible name "${expectedName}", got "${accessibleName}"`
    );
    return false;
  }

  return true;
}

// =============================================================================
// Contrast Testing
// =============================================================================

/**
 * Test color contrast between foreground and background
 * Uses the contrast utilities from contrast.ts
 */
export function testColorContrast(
  foreground: string,
  background: string,
  isLargeText = false
): { passes: boolean; ratio: number } {
  // Import contrast utilities dynamically
  const { getContrastRatio, passesAA } = require('./contrast');
  
  const ratio = getContrastRatio(foreground, background);
  const passes = passesAA(ratio, isLargeText);

  return { passes, ratio };
}

// =============================================================================
// Jest Matchers (for extending jest)
// =============================================================================

/**
 * Custom Jest matchers for accessibility testing
 * 
 * To use, add to your jest setup file:
 * ```typescript
 * import { a11yMatchers } from '@/lib/a11y/test-utils';
 * expect.extend(a11yMatchers);
 * ```
 */
export const a11yMatchers = {
  toHaveNoViolations(received: AxeResults) {
    const pass = received.violations.length === 0;
    
    const message = () => {
      if (pass) {
        return 'Expected accessibility violations, but none were found.';
      }
      
      const violations = received.violations.map(v => 
        `  - ${v.id}: ${v.description} (${v.impact})`
      ).join('\n');
      
      return `Found ${received.violations.length} accessibility violation(s):\n${violations}`;
    };

    return { pass, message };
  },

  toBeFocusable(received: HTMLElement) {
    const tabIndex = received.getAttribute('tabindex');
    const disabled = received.hasAttribute('disabled');
    const hidden = received.getAttribute('aria-hidden') === 'true';
    const display = window.getComputedStyle(received).display;
    const visibility = window.getComputedStyle(received).visibility;

    const pass = !disabled && 
                 !hidden && 
                 display !== 'none' && 
                 visibility !== 'hidden' &&
                 tabIndex !== '-1';

    return {
      pass,
      message: () => 
        pass 
          ? `Expected element not to be focusable, but it is.`
          : `Expected element to be focusable, but it is not.`,
    };
  },

  toHaveAccessibleName(received: HTMLElement, expectedName?: string) {
    const name = received.getAttribute('aria-label') ||
      received.getAttribute('aria-labelledby') ||
      received.textContent?.trim();

    const hasName = !!name;
    const matchesExpected = expectedName === undefined || name === expectedName;
    const pass = hasName && matchesExpected;

    return {
      pass,
      message: () => {
        if (!hasName) {
          return `Expected element to have an accessible name, but it does not.`;
        }
        if (!matchesExpected) {
          return `Expected accessible name to be "${expectedName}", but got "${name}".`;
        }
        return `Expected element not to have accessible name "${name}".`;
      },
    };
  },
};

// =============================================================================
// Exports
// =============================================================================

export default {
  checkA11y,
  expectToHaveNoViolations,
  testKeyboardNavigation,
  testFocusTrap,
  testAriaAnnouncements,
  testAccessibleName,
  testColorContrast,
  configureA11yTesting,
  a11yMatchers,
};
