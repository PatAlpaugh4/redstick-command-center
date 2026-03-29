/**
 * Contrast Ratio Utilities
 * ========================
 * WCAG 2.1 compliant contrast ratio calculation utilities.
 * 
 * @accessibility
 * - WCAG AA: 4.5:1 for normal text, 3:1 for large text
 * - WCAG AAA: 7:1 for normal text, 4.5:1 for large text
 * - WCAG 2.1 requires UI components and graphical objects to have 3:1 contrast
 * 
 * @see https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 * @see https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html
 */

// =============================================================================
// Types
// =============================================================================

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ContrastResult {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
  passesAAALarge: boolean;
}

// =============================================================================
// Color Parsing
// =============================================================================

/**
 * Parse a color string to RGB values
 * Supports hex (#rgb, #rrggbb), rgb(), rgba()
 */
export function parseColor(color: string): RGBColor {
  const trimmed = color.trim().toLowerCase();

  // Hex color
  if (trimmed.startsWith('#')) {
    return parseHexColor(trimmed);
  }

  // RGB/RGBA color
  if (trimmed.startsWith('rgb')) {
    return parseRgbColor(trimmed);
  }

  // Named colors (basic support)
  const namedColors: Record<string, RGBColor> = {
    white: { r: 255, g: 255, b: 255 },
    black: { r: 0, g: 0, b: 0 },
    red: { r: 255, g: 0, b: 0 },
    green: { r: 0, g: 128, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    transparent: { r: 0, g: 0, b: 0 },
  };

  if (namedColors[trimmed]) {
    return namedColors[trimmed];
  }

  throw new Error(`Unsupported color format: ${color}`);
}

/**
 * Parse hex color to RGB
 */
function parseHexColor(hex: string): RGBColor {
  let normalized = hex.slice(1);

  // Expand shorthand (e.g., #abc -> #aabbcc)
  if (normalized.length === 3) {
    normalized = normalized
      .split('')
      .map((c) => c + c)
      .join('');
  }

  // Expand 4-char hex with alpha (e.g., #abcd)
  if (normalized.length === 4) {
    normalized = normalized
      .split('')
      .map((c) => c + c)
      .join('');
  }

  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);

  return { r, g, b };
}

/**
 * Parse rgb/rgba color to RGB
 */
function parseRgbColor(rgb: string): RGBColor {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) {
    throw new Error(`Invalid RGB format: ${rgb}`);
  }

  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
  };
}

// =============================================================================
// Contrast Calculations
// =============================================================================

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 formula
 */
export function getLuminance(color: RGBColor): number {
  const { r, g, b } = color;

  // Convert to sRGB
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  // Apply gamma correction
  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value from 1 to 21 (higher is better contrast)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);

  // Ensure lighter color is first
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get detailed contrast analysis
 */
export function analyzeContrast(color1: string, color2: string): ContrastResult {
  const ratio = getContrastRatio(color1, color2);

  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA: passesAA(ratio),
    passesAAA: passesAAA(ratio),
    passesAALarge: passesAA(ratio, true),
    passesAAALarge: passesAAA(ratio, true),
  };
}

// =============================================================================
// WCAG Compliance Checks
// =============================================================================

/**
 * Check if contrast ratio passes WCAG AA
 * - Normal text: 4.5:1
 * - Large text (18pt+ or 14pt bold+): 3:1
 */
export function passesAA(ratio: number, isLargeText = false): boolean {
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast ratio passes WCAG AAA
 * - Normal text: 7:1
 * - Large text (18pt+ or 14pt bold+): 4.5:1
 */
export function passesAAA(ratio: number, isLargeText = false): boolean {
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Check if contrast passes WCAG 2.1 non-text contrast (3:1)
 * For UI components, graphical objects, and focus indicators
 */
export function passesNonTextContrast(ratio: number): boolean {
  return ratio >= 3;
}

// =============================================================================
// Color Recommendations
// =============================================================================

/**
 * Lighten or darken a color by a percentage
 */
export function adjustBrightness(color: string, percent: number): string {
  const rgb = parseColor(color);
  const amount = Math.floor(255 * (percent / 100));

  const r = Math.max(0, Math.min(255, rgb.r + amount));
  const g = Math.max(0, Math.min(255, rgb.g + amount));
  const b = Math.max(0, Math.min(255, rgb.b + amount));

  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Get a recommended color that meets the minimum contrast ratio
 * Tries to adjust the foreground color to meet the requirement
 */
export function getRecommendedColor(
  background: string,
  minRatio: number,
  preferLight = true
): string {
  const bgLum = getLuminance(parseColor(background));
  const isDarkBg = bgLum < 0.5;

  // Start with white or black based on background
  let candidate = preferLight && isDarkBg ? '#ffffff' : '#000000';
  let ratio = getContrastRatio(background, candidate);

  if (ratio >= minRatio) {
    return candidate;
  }

  // If black/white doesn't work, try adjusting
  const startColor = isDarkBg ? '#ffffff' : '#000000';
  const direction = isDarkBg ? -1 : 1; // Darken for light bg, lighten for dark bg

  // Binary search for appropriate brightness
  let low = 0;
  let high = 100;
  let bestMatch = startColor;
  let bestRatio = ratio;

  for (let i = 0; i < 10; i++) {
    const mid = (low + high) / 2;
    const adjusted = adjustBrightness(startColor, direction * mid);
    const newRatio = getContrastRatio(background, adjusted);

    if (newRatio >= minRatio && newRatio < bestRatio) {
      bestMatch = adjusted;
      bestRatio = newRatio;
    }

    if (newRatio >= minRatio) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return bestMatch;
}

/**
 * Find the closest accessible color
 * Adjusts the given color to meet minimum contrast while staying similar
 */
export function findAccessibleColor(
  foreground: string,
  background: string,
  minRatio = 4.5
): string {
  const currentRatio = getContrastRatio(foreground, background);

  if (currentRatio >= minRatio) {
    return foreground;
  }

  const isDarkBg = getLuminance(parseColor(background)) < 0.5;
  const direction = isDarkBg ? 1 : -1; // Lighten for dark bg, darken for light bg

  // Try adjusting brightness
  for (let i = 5; i <= 100; i += 5) {
    const adjusted = adjustBrightness(foreground, direction * i);
    if (getContrastRatio(adjusted, background) >= minRatio) {
      return adjusted;
    }
  }

  // Fall back to white or black
  return isDarkBg ? '#ffffff' : '#000000';
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Format contrast ratio for display
 */
export function formatContrastRatio(ratio: number): string {
  return `${ratio.toFixed(1)}:1`;
}

/**
 * Get WCAG level achieved
 */
export function getWCAGLevel(ratio: number, isLargeText = false): 'fail' | 'AA' | 'AAA' {
  if (passesAAA(ratio, isLargeText)) return 'AAA';
  if (passesAA(ratio, isLargeText)) return 'AA';
  return 'fail';
}

/**
 * Validate a color palette against accessibility standards
 */
export function validatePalette(
  background: string,
  foregrounds: Record<string, string>
): Record<string, ContrastResult> {
  const results: Record<string, ContrastResult> = {};

  for (const [name, color] of Object.entries(foregrounds)) {
    results[name] = analyzeContrast(background, color);
  }

  return results;
}

// =============================================================================
// Constants
// =============================================================================

/** WCAG AA minimum contrast for normal text */
export const WCAG_AA_NORMAL = 4.5;

/** WCAG AA minimum contrast for large text */
export const WCAG_AA_LARGE = 3;

/** WCAG AAA minimum contrast for normal text */
export const WCAG_AAA_NORMAL = 7;

/** WCAG AAA minimum contrast for large text */
export const WCAG_AAA_LARGE = 4.5;

/** WCAG 2.1 non-text contrast (UI components, focus indicators) */
export const WCAG_NON_TEXT = 3;

// =============================================================================
// Default Export
// =============================================================================

export default {
  getContrastRatio,
  passesAA,
  passesAAA,
  passesNonTextContrast,
  getRecommendedColor,
  findAccessibleColor,
  analyzeContrast,
  parseColor,
  getLuminance,
  adjustBrightness,
  formatContrastRatio,
  getWCAGLevel,
  validatePalette,
  WCAG_AA_NORMAL,
  WCAG_AA_LARGE,
  WCAG_AAA_NORMAL,
  WCAG_AAA_LARGE,
  WCAG_NON_TEXT,
};
