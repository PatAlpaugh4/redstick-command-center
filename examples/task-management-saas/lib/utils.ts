// ============================================
// UTILITY FUNCTIONS
// ============================================
// Common utility functions used throughout the application.

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isPast, isToday, isTomorrow } from 'date-fns'
import { Priority, TaskStatus } from '@prisma/client'

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date for display
 */
export function formatDate(date: Date | string | null): string {
  if (!date) return 'No due date'
  
  const d = new Date(date)
  
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  if (isPast(d)) return `Overdue: ${format(d, 'MMM d')}`
  
  return format(d, 'MMM d, yyyy')
}

/**
 * Get color for priority level
 */
export function getPriorityColor(priority: Priority): string {
  const colors = {
    LOW: 'bg-blue-100 text-blue-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800'
  }
  return colors[priority]
}

/**
 * Get color for task status
 */
export function getStatusColor(status: TaskStatus): string {
  const colors = {
    TODO: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    IN_REVIEW: 'bg-purple-100 text-purple-800',
    DONE: 'bg-green-100 text-green-800'
  }
  return colors[status]
}

/**
 * Get label for priority level
 */
export function getPriorityLabel(priority: Priority): string {
  const labels = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent'
  }
  return labels[priority]
}

/**
 * Get label for task status
 */
export function getStatusLabel(status: TaskStatus): string {
  const labels = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    IN_REVIEW: 'In Review',
    DONE: 'Done'
  }
  return labels[status]
}

/**
 * Generate a random color for projects
 */
export function getRandomColor(): string {
  const colors = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#f59e0b', // Amber
    '#84cc16', // Lime
    '#10b981', // Emerald
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#d946ef', // Fuchsia
    '#f43f5e', // Rose
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Generate initials from name
 */
export function getInitials(name: string | null): string {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Group tasks by status
 */
export function groupTasksByStatus<T extends { status: TaskStatus }>(
  tasks: T[]
): Record<TaskStatus, T[]> {
  return {
    TODO: tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
    IN_REVIEW: tasks.filter(t => t.status === 'IN_REVIEW'),
    DONE: tasks.filter(t => t.status === 'DONE')
  }
}

/**
 * Calculate task completion percentage
 */
export function calculateCompletionPercentage(
  total: number,
  completed: number
): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}
