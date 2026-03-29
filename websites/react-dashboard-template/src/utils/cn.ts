/**
 * Utility function for merging Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge multiple class names with Tailwind CSS support
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
