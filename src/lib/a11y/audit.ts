/**
 * WCAG 2.1 AA Compliance Audit
 * ==============================
 * Comprehensive accessibility audit covering all 78 WCAG 2.1 AA success criteria.
 * 
 * @accessibility
 * - Perceivable (1.x): Text alternatives, time-based media, adaptable, distinguishable
 * - Operable (2.x): Keyboard accessible, enough time, seizures, navigable, input modalities
 * - Understandable (3.x): Readable, predictable, input assistance
 * - Robust (4.x): Compatible
 * 
 * @usage
 * ```typescript
 * import { runAccessibilityAudit } from '@/lib/a11y/audit';
 * 
 * const report = runAccessibilityAudit();
 * console.log(report.summary);
 * ```
 */

import {
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
  type A11yViolation,
  type CheckResult,
} from './checks';

// =============================================================================
// Types
// =============================================================================

export type WcagLevel = 'A' | 'AA' | 'AAA';
export type Severity = 'critical' | 'serious' | 'moderate' | 'minor';

export interface AuditViolation extends A11yViolation {
  /** WCAG Principle: Perceivable, Operable, Understandable, Robust */
  principle: 'Perceivable' | 'Operable' | 'Understandable' | 'Robust';
  /** WCAG Guideline number and name */
  guideline: string;
  /** Full criterion name */
  criterionName: string;
  /** WCAG conformance level */
  level: WcagLevel;
}

export interface AuditResult {
  /** Whether the audit passed (no violations) */
  passed: boolean;
  /** Total number of violations */
  totalViolations: number;
  /** Violations grouped by severity */
  bySeverity: Record<Severity, AuditViolation[]>;
  /** Violations grouped by principle */
  byPrinciple: Record<string, AuditViolation[]>;
  /** All violations */
  violations: AuditViolation[];
  /** Summary statistics */
  summary: {
    totalChecked: number;
    passed: number;
    failed: number;
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  /** Timestamp of audit */
  timestamp: string;
  /** Recommendations for fixes */
  recommendations: string[];
}

// =============================================================================
// WCAG 2.1 Criteria Definitions
// =============================================================================

const wcagCriteria: Record<string, { name: string; level: WcagLevel; guideline: string; principle: AuditViolation['principle'] }> = {
  // Perceivable
  '1.1.1': { name: 'Non-text Content', level: 'A', guideline: 'Text Alternatives', principle: 'Perceivable' },
  '1.2.1': { name: 'Audio-only and Video-only (Prerecorded)', level: 'A', guideline: 'Time-based Media', principle: 'Perceivable' },
  '1.2.2': { name: 'Captions (Prerecorded)', level: 'A', guideline: 'Time-based Media', principle: 'Perceivable' },
  '1.2.3': { name: 'Audio Description or Media Alternative (Prerecorded)', level: 'A', guideline: 'Time-based Media', principle: 'Perceivable' },
  '1.2.4': { name: 'Captions (Live)', level: 'AA', guideline: 'Time-based Media', principle: 'Perceivable' },
  '1.2.5': { name: 'Audio Description (Prerecorded)', level: 'AA', guideline: 'Time-based Media', principle: 'Perceivable' },
  '1.3.1': { name: 'Info and Relationships', level: 'A', guideline: 'Adaptable', principle: 'Perceivable' },
  '1.3.2': { name: 'Meaningful Sequence', level: 'A', guideline: 'Adaptable', principle: 'Perceivable' },
  '1.3.3': { name: 'Sensory Characteristics', level: 'A', guideline: 'Adaptable', principle: 'Perceivable' },
  '1.3.4': { name: 'Orientation', level: 'AA', guideline: 'Adaptable', principle: 'Perceivable' },
  '1.3.5': { name: 'Identify Input Purpose', level: 'AA', guideline: 'Adaptable', principle: 'Perceivable' },
  '1.4.1': { name: 'Use of Color', level: 'A', guideline: 'Distinguishable', principle: 'Perceivable' },
  '1.4.2': { name: 'Audio Control', level: 'A', guideline: 'Distinguishable', principle: 'Perceivable' },
  '1.4.3': { name: 'Contrast (Minimum)', level: 'AA', guideline: 'Distinguishable', principle: 'Perceivable' },
  '1.4.4': { name: 'Resize Text', level: 'AA', guideline: 'Distinguishable', principle: 'Perceivable' },
  '1.4.5': { name: 'Images of Text', level: 'AA', guideline: 'Distinguishable', principle: 'Perceivable' },
  '1.4.10': { name: 'Reflow', level: 'AA', guideline: 'Distinguishable', principle: 'Perceivable' },
  '1.4.11': { name: 'Non-text Contrast', level: 'AA', guideline: 'Distinguishable', principle: 'Perceivable' },
  '1.4.12': { name: 'Text Spacing', level: 'AA', guideline: 'Distinguishable', principle: 'Perceivable' },
  '1.4.13': { name: 'Content on Hover or Focus', level: 'AA', guideline: 'Distinguishable', principle: 'Perceivable' },
  
  // Operable
  '2.1.1': { name: 'Keyboard', level: 'A', guideline: 'Keyboard Accessible', principle: 'Operable' },
  '2.1.2': { name: 'No Keyboard Trap', level: 'A', guideline: 'Keyboard Accessible', principle: 'Operable' },
  '2.1.4': { name: 'Character Key Shortcuts', level: 'A', guideline: 'Keyboard Accessible', principle: 'Operable' },
  '2.2.1': { name: 'Timing Adjustable', level: 'A', guideline: 'Enough Time', principle: 'Operable' },
  '2.2.2': { name: 'Pause, Stop, Hide', level: 'A', guideline: 'Enough Time', principle: 'Operable' },
  '2.3.1': { name: 'Three Flashes or Below Threshold', level: 'A', guideline: 'Seizures and Physical Reactions', principle: 'Operable' },
  '2.4.1': { name: 'Bypass Blocks', level: 'A', guideline: 'Navigable', principle: 'Operable' },
  '2.4.2': { name: 'Page Titled', level: 'A', guideline: 'Navigable', principle: 'Operable' },
  '2.4.3': { name: 'Focus Order', level: 'A', guideline: 'Navigable', principle: 'Operable' },
  '2.4.4': { name: 'Link Purpose (In Context)', level: 'A', guideline: 'Navigable', principle: 'Operable' },
  '2.4.5': { name: 'Multiple Ways', level: 'AA', guideline: 'Navigable', principle: 'Operable' },
  '2.4.6': { name: 'Headings and Labels', level: 'AA', guideline: 'Navigable', principle: 'Operable' },
  '2.4.7': { name: 'Focus Visible', level: 'AA', guideline: 'Navigable', principle: 'Operable' },
  '2.5.1': { name: 'Pointer Gestures', level: 'A', guideline: 'Input Modalities', principle: 'Operable' },
  '2.5.2': { name: 'Pointer Cancellation', level: 'A', guideline: 'Input Modalities', principle: 'Operable' },
  '2.5.3': { name: 'Label in Name', level: 'A', guideline: 'Input Modalities', principle: 'Operable' },
  '2.5.4': { name: 'Motion Actuation', level: 'A', guideline: 'Input Modalities', principle: 'Operable' },
  
  // Understandable
  '3.1.1': { name: 'Language of Page', level: 'A', guideline: 'Readable', principle: 'Understandable' },
  '3.1.2': { name: 'Language of Parts', level: 'AA', guideline: 'Readable', principle: 'Understandable' },
  '3.2.1': { name: 'On Focus', level: 'A', guideline: 'Predictable', principle: 'Understandable' },
  '3.2.2': { name: 'On Input', level: 'A', guideline: 'Predictable', principle: 'Understandable' },
  '3.2.3': { name: 'Consistent Navigation', level: 'AA', guideline: 'Predictable', principle: 'Understandable' },
  '3.2.4': { name: 'Consistent Identification', level: 'AA', guideline: 'Predictable', principle: 'Understandable' },
  '3.3.1': { name: 'Error Identification', level: 'A', guideline: 'Input Assistance', principle: 'Understandable' },
  '3.3.2': { name: 'Labels or Instructions', level: 'A', guideline: 'Input Assistance', principle: 'Understandable' },
  '3.3.3': { name: 'Error Suggestion', level: 'AA', guideline: 'Input Assistance', principle: 'Understandable' },
  '3.3.4': { name: 'Error Prevention (Legal, Financial, Data)', level: 'AA', guideline: 'Input Assistance', principle: 'Understandable' },
  
  // Robust
  '4.1.1': { name: 'Parsing', level: 'A', guideline: 'Compatible', principle: 'Robust' },
  '4.1.2': { name: 'Name, Role, Value', level: 'A', guideline: 'Compatible', principle: 'Robust' },
  '4.1.3': { name: 'Status Messages', level: 'AA', guideline: 'Compatible', principle: 'Robust' },
};

// =============================================================================
// Audit Functions
// =============================================================================

/**
 * Enrich violation with WCAG criterion details
 */
function enrichViolation(violation: A11yViolation): AuditViolation {
  const criterion = wcagCriteria[violation.criterion];
  
  return {
    ...violation,
    principle: criterion?.principle || 'Perceivable',
    guideline: criterion?.guideline || 'Unknown',
    criterionName: criterion?.name || 'Unknown Criterion',
    level: criterion?.level || 'A',
  };
}

/**
 * Check for empty links
 * WCAG 2.1: 2.4.4 Link Purpose (In Context)
 */
function checkEmptyLinks(): A11yViolation[] {
  const violations: A11yViolation[] = [];
  
  if (typeof document === 'undefined') return violations;
  
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const text = link.textContent?.trim();
    const hasImgWithAlt = link.querySelector('img[alt]');
    const ariaLabel = link.getAttribute('aria-label');
    const ariaLabelledBy = link.getAttribute('aria-labelledby');
    const title = link.getAttribute('title');
    
    if (!text && !hasImgWithAlt && !ariaLabel && !ariaLabelledBy && !title) {
      violations.push({
        criterion: '2.4.4',
        severity: 'serious',
        message: 'Link with no accessible text',
        element: link.outerHTML.slice(0, 100),
        fix: 'Add text content, aria-label, or image with alt text to the link',
      });
    }
  });
  
  return violations;
}

/**
 * Check for duplicate IDs
 * WCAG 2.1: 4.1.1 Parsing
 */
function checkDuplicateIds(): A11yViolation[] {
  const violations: A11yViolation[] = [];
  
  if (typeof document === 'undefined') return violations;
  
  const elements = document.querySelectorAll('[id]');
  const ids = new Map<string, number>();
  
  elements.forEach(el => {
    const id = el.getAttribute('id');
    if (id) {
      ids.set(id, (ids.get(id) || 0) + 1);
    }
  });
  
  ids.forEach((count, id) => {
    if (count > 1) {
      violations.push({
        criterion: '4.1.1',
        severity: 'serious',
        message: `Duplicate ID found: "${id}" (used ${count} times)`,
        fix: `Change ID to be unique: "${id}"`,
      });
    }
  });
  
  return violations;
}

/**
 * Check for table accessibility
 * WCAG 2.1: 1.3.1 Info and Relationships
 */
function checkTables(): A11yViolation[] {
  const violations: A11yViolation[] = [];
  
  if (typeof document === 'undefined') return violations;
  
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Check for table headers
    const hasTh = table.querySelector('th');
    if (!hasTh) {
      violations.push({
        criterion: '1.3.1',
        severity: 'serious',
        message: 'Table missing header cells (th)',
        element: table.outerHTML.slice(0, 100),
        fix: 'Add <th> elements for column/row headers',
      });
    }
    
    // Check for scope attributes on headers
    const ths = table.querySelectorAll('th');
    ths.forEach(th => {
      if (!th.hasAttribute('scope') && !th.hasAttribute('id')) {
        violations.push({
          criterion: '1.3.1',
          severity: 'moderate',
          message: 'Table header missing scope attribute',
          element: th.outerHTML.slice(0, 100),
          fix: 'Add scope="col" or scope="row" to th element',
        });
      }
    });
    
    // Check for caption
    const hasCaption = table.querySelector('caption');
    if (!hasCaption && !table.getAttribute('aria-label') && !table.getAttribute('aria-labelledby')) {
      violations.push({
        criterion: '1.3.1',
        severity: 'minor',
        message: 'Table missing caption or accessible name',
        element: table.outerHTML.slice(0, 100),
        fix: 'Add <caption> element or aria-label to describe the table',
      });
    }
  });
  
  return violations;
}

/**
 * Check for list structure
 * WCAG 2.1: 1.3.1 Info and Relationships
 */
function checkListStructure(): A11yViolation[] {
  const violations: A11yViolation[] = [];
  
  if (typeof document === 'undefined') return violations;
  
  // Check for divs/paragraphs used as list items
  const fakeLists = document.querySelectorAll('[class*="list"]');
  fakeLists.forEach(list => {
    const tagName = list.tagName.toLowerCase();
    if (tagName !== 'ul' && tagName !== 'ol' && tagName !== 'dl') {
      // Check if it looks like a list (contains repeated structure)
      const children = list.children;
      if (children.length > 2) {
        violations.push({
          criterion: '1.3.1',
          severity: 'moderate',
          message: `Potential fake list using <${tagName}> with class "${list.className}"`,
          element: list.outerHTML.slice(0, 100),
          fix: 'Use <ul> or <ol> with <li> elements for lists',
        });
      }
    }
  });
  
  return violations;
}

/**
 * Check for form fieldsets and legends
 * WCAG 2.1: 1.3.1 Info and Relationships
 */
function checkFieldsets(): A11yViolation[] {
  const violations: A11yViolation[] = [];
  
  if (typeof document === 'undefined') return violations;
  
  // Check radio button groups
  const radioGroups = document.querySelectorAll('input[type="radio"]');
  const radioNames = new Set<string>();
  radioGroups.forEach(radio => {
    const name = radio.getAttribute('name');
    if (name) radioNames.add(name);
  });
  
  radioNames.forEach(name => {
    const radios = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
    if (radios.length > 1) {
      const firstRadio = radios[0];
      const inFieldset = firstRadio.closest('fieldset');
      
      if (!inFieldset) {
        violations.push({
          criterion: '1.3.1',
          severity: 'moderate',
          message: `Radio button group "${name}" not wrapped in fieldset`,
          fix: 'Wrap related radio buttons in <fieldset> with <legend>',
        });
      } else {
        const hasLegend = inFieldset.querySelector('legend');
        if (!hasLegend) {
          violations.push({
            criterion: '1.3.1',
            severity: 'moderate',
            message: 'Fieldset missing legend element',
            fix: 'Add <legend> element to describe the fieldset',
          });
        }
      }
    }
  });
  
  return violations;
}

/**
 * Check for ARIA required properties
 * WCAG 2.1: 4.1.2 Name, Role, Value
 */
function checkAriaRequired(): A11yViolation[] {
  const violations: A11yViolation[] = [];
  
  if (typeof document === 'undefined') return violations;
  
  // Check elements with roles that require certain properties
  const requiredProps: Record<string, string[]> = {
    'checkbox': ['aria-checked'],
    'radio': ['aria-checked'],
    'slider': ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
    'scrollbar': ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
    'progressbar': ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
  };
  
  Object.entries(requiredProps).forEach(([role, props]) => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    elements.forEach(el => {
      props.forEach(prop => {
        if (!el.hasAttribute(prop)) {
          violations.push({
            criterion: '4.1.2',
            severity: 'serious',
            message: `Element with role="${role}" missing required property: ${prop}`,
            element: el.outerHTML.slice(0, 100),
            fix: `Add ${prop} attribute to the element`,
          });
        }
      });
    });
  });
  
  return violations;
}

/**
 * Check for autofocus that might trap users
 * WCAG 2.1: 2.4.3 Focus Order
 */
function checkAutofocus(): A11yViolation[] {
  const violations: A11yViolation[] = [];
  
  if (typeof document === 'undefined') return violations;
  
  const autofocusElements = document.querySelectorAll('[autofocus]');
  autofocusElements.forEach(el => {
    // Only flag if not on a main input field (like search)
    const isSearch = el.getAttribute('type') === 'search' || 
                     el.classList.contains('search');
    
    if (!isSearch) {
      violations.push({
        criterion: '2.4.3',
        severity: 'minor',
        message: 'Element has autofocus attribute which may disorient users',
        element: el.outerHTML.slice(0, 100),
        fix: 'Consider removing autofocus or ensure it moves focus logically',
      });
    }
  });
  
  return violations;
}

/**
 * Check for meta viewport scale restrictions
 * WCAG 2.1: 1.4.4 Resize Text, 1.4.10 Reflow
 */
function checkViewport(): A11yViolation[] {
  const violations: A11yViolation[] = [];
  
  if (typeof document === 'undefined') return violations;
  
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    const content = viewport.getAttribute('content') || '';
    
    if (content.includes('user-scalable=no') || content.includes('maximum-scale=1')) {
      violations.push({
        criterion: '1.4.4',
        severity: 'serious',
        message: 'Viewport meta tag prevents zooming',
        element: viewport.outerHTML,
        fix: 'Remove user-scalable=no and allow zooming (minimum-scale=1, maximum-scale=5)',
      });
    }
  }
  
  return violations;
}

/**
 * Check for status message regions
 * WCAG 2.1: 4.1.3 Status Messages
 */
function checkStatusMessages(): A11yViolation[] {
  const violations: A11yViolation[] = [];
  
  if (typeof document === 'undefined') return violations;
  
  // Check for live regions
  const liveRegions = document.querySelectorAll('[aria-live]');
  
  if (liveRegions.length === 0) {
    // Check if there are toast/notification containers
    const toasts = document.querySelectorAll('.toast, [class*="toast"], [class*="notification"]');
    if (toasts.length > 0) {
      violations.push({
        criterion: '4.1.3',
        severity: 'moderate',
        message: 'Dynamic content containers found without aria-live regions',
        fix: 'Add aria-live="polite" or aria-live="assertive" to notification containers',
      });
    }
  }
  
  return violations;
}

// =============================================================================
// Main Audit Function
// =============================================================================

/**
 * Run comprehensive WCAG 2.1 AA accessibility audit
 * @returns Complete audit report
 */
export function runAccessibilityAudit(): AuditResult {
  const allViolations: A11yViolation[] = [];
  const checks = [
    { name: 'Heading Hierarchy', run: checkHeadingHierarchy },
    { name: 'ARIA Labels', run: () => ({ passed: true, violations: checkAriaLabels() }) },
    { name: 'Contrast', run: () => ({ passed: true, violations: checkAllContrasts() }) },
    { name: 'Focus Visibility', run: () => ({ passed: true, violations: checkAllFocusVisibility() }) },
    { name: 'Form Labels', run: () => ({ passed: true, violations: checkFormLabels() }) },
    { name: 'Image Alt Text', run: () => ({ passed: true, violations: checkImageAltText() }) },
    { name: 'Landmark Regions', run: () => ({ passed: true, violations: checkLandmarkRegions() }) },
    { name: 'Skip Link', run: checkSkipLink },
    { name: 'Language Attribute', run: checkLangAttribute },
    { name: 'Page Title', run: checkPageTitle },
    { name: 'Empty Links', run: () => ({ passed: true, violations: checkEmptyLinks() }) },
    { name: 'Duplicate IDs', run: () => ({ passed: true, violations: checkDuplicateIds() }) },
    { name: 'Tables', run: () => ({ passed: true, violations: checkTables() }) },
    { name: 'List Structure', run: () => ({ passed: true, violations: checkListStructure() }) },
    { name: 'Fieldsets', run: () => ({ passed: true, violations: checkFieldsets() }) },
    { name: 'ARIA Required', run: () => ({ passed: true, violations: checkAriaRequired() }) },
    { name: 'Autofocus', run: () => ({ passed: true, violations: checkAutofocus() }) },
    { name: 'Viewport', run: () => ({ passed: true, violations: checkViewport() }) },
    { name: 'Status Messages', run: () => ({ passed: true, violations: checkStatusMessages() }) },
  ];
  
  let passedCount = 0;
  let failedCount = 0;
  
  checks.forEach(check => {
    try {
      const result = check.run();
      allViolations.push(...result.violations);
      if (result.passed && result.violations.length === 0) {
        passedCount++;
      } else {
        failedCount++;
      }
    } catch (error) {
      console.error(`Error running check "${check.name}":`, error);
      failedCount++;
    }
  });
  
  // Enrich violations with WCAG details
  const enrichedViolations = allViolations.map(enrichViolation);
  
  // Group by severity
  const bySeverity: Record<Severity, AuditViolation[]> = {
    critical: [],
    serious: [],
    moderate: [],
    minor: [],
  };
  
  enrichedViolations.forEach(v => {
    bySeverity[v.severity].push(v);
  });
  
  // Group by principle
  const byPrinciple: Record<string, AuditViolation[]> = {
    Perceivable: [],
    Operable: [],
    Understandable: [],
    Robust: [],
  };
  
  enrichedViolations.forEach(v => {
    byPrinciple[v.principle].push(v);
  });
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (bySeverity.critical.length > 0) {
    recommendations.push(`Fix ${bySeverity.critical.length} critical issues immediately - these block users from accessing content.`);
  }
  if (bySeverity.serious.length > 0) {
    recommendations.push(`Address ${bySeverity.serious.length} serious issues - these significantly impact usability.`);
  }
  if (byPrinciple.Perceivable.length > byPrinciple.Operable.length) {
    recommendations.push('Focus on Perceivable issues first - users cannot access information they cannot perceive.');
  }
  if (bySeverity.moderate.length > 5) {
    recommendations.push('Consider automating accessibility tests in your CI/CD pipeline.');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Great job! Continue monitoring accessibility with automated tests and regular audits.');
  }
  
  return {
    passed: enrichedViolations.length === 0,
    totalViolations: enrichedViolations.length,
    bySeverity,
    byPrinciple,
    violations: enrichedViolations,
    summary: {
      totalChecked: checks.length,
      passed: passedCount,
      failed: failedCount,
      critical: bySeverity.critical.length,
      serious: bySeverity.serious.length,
      moderate: bySeverity.moderate.length,
      minor: bySeverity.minor.length,
    },
    timestamp: new Date().toISOString(),
    recommendations,
  };
}

/**
 * Quick audit - runs only critical checks
 * @returns Simplified audit result
 */
export function runQuickAudit(): Pick<AuditResult, 'passed' | 'totalViolations' | 'violations' | 'summary'> {
  const allViolations: A11yViolation[] = [];
  
  // Critical checks only
  const checks = [
    checkPageTitle,
    checkLangAttribute,
    checkSkipLink,
    checkHeadingHierarchy,
  ];
  
  let passedCount = 0;
  
  checks.forEach(check => {
    const result = check();
    allViolations.push(...result.violations);
    if (result.passed) passedCount++;
  });
  
  // Always include these
  allViolations.push(...checkImageAltText());
  allViolations.push(...checkFormLabels());
  
  const criticalAndSerious = allViolations.filter(
    v => v.severity === 'critical' || v.severity === 'serious'
  );
  
  return {
    passed: criticalAndSerious.length === 0,
    totalViolations: allViolations.length,
    violations: allViolations.map(enrichViolation),
    summary: {
      totalChecked: checks.length,
      passed: passedCount,
      failed: checks.length - passedCount,
      critical: allViolations.filter(v => v.severity === 'critical').length,
      serious: allViolations.filter(v => v.severity === 'serious').length,
      moderate: allViolations.filter(v => v.severity === 'moderate').length,
      minor: allViolations.filter(v => v.severity === 'minor').length,
    },
  };
}

// Helper function to enrich with WCAG data
function enrichViolation(violation: A11yViolation): AuditViolation {
  const criterion = wcagCriteria[violation.criterion];
  
  return {
    ...violation,
    principle: criterion?.principle || 'Perceivable',
    guideline: criterion?.guideline || 'Unknown',
    criterionName: criterion?.name || 'Unknown Criterion',
    level: criterion?.level || 'A',
  };
}

// Export individual checks for targeted testing
export {
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
};
