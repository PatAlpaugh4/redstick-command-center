/**
 * Export Utilities
 * ================
 * Functions for exporting data to CSV, JSON, and other formats.
 * Supports nested object flattening, proper escaping, and browser downloads.
 */

/**
 * Flattens a nested object using dot notation for keys
 * Example: { user: { name: 'John' } } becomes { 'user.name': 'John' }
 */
function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const flattened: Record<string, unknown> = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = prefix ? `${prefix}.${key}` : key
      const value = obj[key]

      if (value === null || value === undefined) {
        flattened[newKey] = ''
      } else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        Object.assign(flattened, flattenObject(value as Record<string, unknown>, newKey))
      } else if (Array.isArray(value)) {
        // Handle arrays by joining with semicolon
        flattened[newKey] = value.map(item => 
          typeof item === 'object' ? JSON.stringify(item) : String(item)
        ).join('; ')
      } else if (value instanceof Date) {
        flattened[newKey] = value.toISOString()
      } else {
        flattened[newKey] = value
      }
    }
  }

  return flattened
}

/**
 * Escapes a CSV field value
 * - Wraps in quotes if contains comma, quote, or newline
 * - Doubles quotes to escape them
 */
function escapeCSVField(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  const stringValue = String(value)
  
  // Check if we need to escape
  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    // Replace quotes with double quotes and wrap in quotes
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

/**
 * Extracts all unique keys from flattened data
 */
function extractKeys(data: Record<string, unknown>[]): string[] {
  const keysSet = new Set<string>()
  
  for (const row of data) {
    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        keysSet.add(key)
      }
    }
  }

  return Array.from(keysSet)
}

/**
 * Converts an array of objects to CSV string
 * @param data - Array of objects to convert
 * @returns CSV formatted string with UTF-8 BOM
 */
export function convertToCSV(data: unknown[]): string {
  if (!Array.isArray(data) || data.length === 0) {
    return '\uFEFF' // Return just BOM for empty data
  }

  // Flatten all objects
  const flattenedData = data.map(item => {
    if (typeof item === 'object' && item !== null) {
      return flattenObject(item as Record<string, unknown>)
    }
    return { value: item }
  })

  // Get all unique keys
  const headers = extractKeys(flattenedData)

  // Create CSV rows
  const rows: string[] = []

  // Header row
  rows.push(headers.map(escapeCSVField).join(','))

  // Data rows
  for (const row of flattenedData) {
    const values = headers.map(header => escapeCSVField(row[header]))
    rows.push(values.join(','))
  }

  // Join with CRLF for Excel compatibility and add UTF-8 BOM
  return '\uFEFF' + rows.join('\r\n')
}

/**
 * Triggers a browser download of a file
 * @param content - File content
 * @param filename - Download filename
 * @param mimeType - MIME type of the file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  // Create blob with proper encoding
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
  const url = URL.createObjectURL(blob)

  // Create temporary link element
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'

  // Trigger download
  document.body.appendChild(link)
  link.click()

  // Cleanup
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export data to CSV file
 * @param data - Array of objects to export
 * @param filename - Download filename (defaults to 'export.csv')
 * @throws Error if data is invalid
 */
export function exportToCSV(data: unknown[], filename = 'export.csv'): void {
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array')
  }

  const csvContent = convertToCSV(data)
  downloadFile(csvContent, filename, 'text/csv')
}

/**
 * Export data to JSON file
 * @param data - Array or object to export
 * @param filename - Download filename (defaults to 'export.json')
 * @throws Error if data is invalid
 */
export function exportToJSON(data: unknown[], filename = 'export.json'): void {
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array')
  }

  const jsonContent = JSON.stringify(data, null, 2)
  downloadFile(jsonContent, filename, 'application/json')
}

/**
 * Export data to Excel-compatible CSV with custom formatting
 * @param data - Array of objects to export
 * @param filename - Download filename (defaults to 'export.xlsx')
 * @param options - Optional configuration
 * @throws Error if data is invalid
 */
export function exportToExcel(
  data: unknown[],
  filename = 'export.xlsx',
  options?: {
    sheetName?: string
    dateFormat?: string
  }
): void {
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array')
  }

  // Excel actually opens CSV files with .xlsx extension just fine
  // For true Excel files, you'd need a library like xlsx or exceljs
  const csvContent = convertToCSV(data)
  
  // Use .csv extension since we're creating CSV format
  const actualFilename = filename.endsWith('.xlsx') 
    ? filename.replace('.xlsx', '.csv') 
    : filename
  
  downloadFile(csvContent, actualFilename, 'text/csv')
}

/**
 * Export configuration options
 */
export interface ExportOptions {
  filename?: string
  includeHeaders?: boolean
  flattenNested?: boolean
  dateFormat?: string
}

/**
 * Validates export data
 * @param data - Data to validate
 * @returns Validation result
 */
export function validateExportData(data: unknown): { valid: boolean; error?: string } {
  if (!Array.isArray(data)) {
    return { valid: false, error: 'Data must be an array' }
  }

  if (data.length === 0) {
    return { valid: false, error: 'Data array is empty' }
  }

  return { valid: true }
}

/**
 * Get estimated file size for export
 * @param data - Data to estimate
 * @returns Estimated size in bytes
 */
export function estimateExportSize(data: unknown[]): number {
  if (!Array.isArray(data)) return 0
  
  const jsonString = JSON.stringify(data)
  // Rough estimate: CSV is typically smaller than JSON
  return Math.round(jsonString.length * 0.8)
}

/**
 * Format file size for display
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`
}
