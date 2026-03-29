/**
 * useExport Hook
 * ==============
 * React hook for exporting data with progress tracking and toast notifications.
 * Provides CSV and JSON export functionality with error handling.
 */

import { useState, useCallback, useRef } from 'react'
import { exportToCSV, exportToJSON, validateExportData, estimateExportSize, formatFileSize } from '@/lib/export'

/**
 * Toast notification type
 */
interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'loading'
  title: string
  message?: string
}

/**
 * Options for the useExport hook
 */
export interface UseExportOptions {
  /** Data array to export */
  data: unknown[]
  /** Base filename without extension */
  filename?: string
  /** Callback when export succeeds */
  onSuccess?: () => void
  /** Callback when export fails */
  onError?: (error: Error) => void
  /** Show toast notifications */
  showToasts?: boolean
  /** Custom toast handler (defaults to internal state) */
  onToast?: (toast: Toast) => void
}

/**
 * Export state and controls
 */
export interface UseExportReturn {
  /** Export data as CSV */
  exportCSV: () => Promise<void>
  /** Export data as JSON */
  exportJSON: () => Promise<void>
  /** Whether an export is in progress */
  isExporting: boolean
  /** Current export progress (0-100) */
  progress: number
  /** Current toast notifications */
  toasts: Toast[]
  /** Dismiss a toast by ID */
  dismissToast: (id: string) => void
  /** Clear all toasts */
  clearToasts: () => void
  /** Estimated file size */
  estimatedSize: string
  /** Whether data is valid for export */
  isValid: boolean
  /** Validation error message */
  validationError?: string
}

/**
 * Hook for exporting data with progress tracking and notifications
 * 
 * @example
 * ```tsx
 * const { exportCSV, exportJSON, isExporting, progress, toasts, dismissToast } = useExport({
 *   data: deals,
 *   filename: 'vc-deals',
 *   onSuccess: () => console.log('Export complete'),
 *   onError: (err) => console.error('Export failed:', err),
 * })
 * ```
 */
export function useExport(options: UseExportOptions): UseExportReturn {
  const { 
    data, 
    filename = 'export', 
    onSuccess, 
    onError, 
    showToasts = true,
    onToast 
  } = options

  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [toasts, setToasts] = useState<Toast[]>([])
  const exportTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Validate data
  const validation = validateExportData(data)
  const estimatedSize = formatFileSize(estimateExportSize(data))

  /**
   * Generate unique ID for toasts
   */
  const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Add a toast notification
   */
  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const newToast = { ...toast, id: generateId() }
    
    if (onToast) {
      onToast(newToast)
    } else {
      setToasts(prev => [...prev, newToast])
    }
    
    return newToast.id
  }, [onToast])

  /**
   * Remove a toast by ID
   */
  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  /**
   * Clear all toasts
   */
  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  /**
   * Simulate progress for large datasets
   */
  const simulateProgress = useCallback((duration: number): Promise<void> => {
    return new Promise((resolve) => {
      const startTime = Date.now()
      const interval = 50 // Update every 50ms
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime
        const newProgress = Math.min((elapsed / duration) * 100, 95)
        
        setProgress(newProgress)
        
        if (elapsed < duration) {
          exportTimeoutRef.current = setTimeout(updateProgress, interval)
        } else {
          resolve()
        }
      }
      
      updateProgress()
    })
  }, [])

  /**
   * Cleanup timeout on unmount
   */
  const cleanup = useCallback(() => {
    if (exportTimeoutRef.current) {
      clearTimeout(exportTimeoutRef.current)
      exportTimeoutRef.current = null
    }
  }, [])

  /**
   * Perform export with progress tracking
   */
  const performExport = useCallback(async (
    exportFn: () => void,
    extension: string
  ): Promise<void> => {
    if (isExporting) return
    if (!validation.valid) {
      const error = new Error(validation.error || 'Invalid data')
      if (showToasts) {
        addToast({
          type: 'error',
          title: 'Export Failed',
          message: error.message,
        })
      }
      onError?.(error)
      return
    }

    setIsExporting(true)
    setProgress(0)
    
    const fullFilename = `${filename}.${extension}`
    let loadingToastId: string | undefined

    try {
      // Show loading toast for large datasets
      if (data.length > 1000 && showToasts) {
        loadingToastId = addToast({
          type: 'loading',
          title: 'Preparing Export...',
          message: `Exporting ${data.length.toLocaleString()} records (${estimatedSize})`,
        })
      }

      // Simulate progress for UX on larger datasets
      if (data.length > 500) {
        await simulateProgress(300)
      }

      // Perform the actual export
      exportFn()

      // Complete progress
      setProgress(100)

      // Dismiss loading toast
      if (loadingToastId) {
        dismissToast(loadingToastId)
      }

      // Show success toast
      if (showToasts) {
        addToast({
          type: 'success',
          title: 'Export Complete',
          message: `${fullFilename} has been downloaded`,
        })
      }

      onSuccess?.()
    } catch (error) {
      // Dismiss loading toast
      if (loadingToastId) {
        dismissToast(loadingToastId)
      }

      const exportError = error instanceof Error ? error : new Error('Export failed')
      
      if (showToasts) {
        addToast({
          type: 'error',
          title: 'Export Failed',
          message: exportError.message,
        })
      }

      onError?.(exportError)
    } finally {
      setIsExporting(false)
      // Reset progress after a delay
      exportTimeoutRef.current = setTimeout(() => setProgress(0), 1000)
    }
  }, [
    data.length, 
    filename, 
    isExporting, 
    validation, 
    estimatedSize,
    showToasts, 
    addToast, 
    dismissToast, 
    simulateProgress, 
    onSuccess, 
    onError
  ])

  /**
   * Export data as CSV
   */
  const exportCSV = useCallback(async (): Promise<void> => {
    await performExport(() => exportToCSV(data, `${filename}.csv`), 'csv')
  }, [performExport, data, filename])

  /**
   * Export data as JSON
   */
  const exportJSON = useCallback(async (): Promise<void> => {
    await performExport(() => exportToJSON(data, `${filename}.json`), 'json')
  }, [performExport, data, filename])

  return {
    exportCSV,
    exportJSON,
    isExporting,
    progress,
    toasts,
    dismissToast,
    clearToasts,
    estimatedSize,
    isValid: validation.valid,
    validationError: validation.error,
  }
}

export default useExport
