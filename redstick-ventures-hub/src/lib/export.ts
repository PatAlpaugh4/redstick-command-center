/**
 * Export utilities for CSV, JSON, and Excel formats
 */

interface ExportOptions {
  filename?: string;
  includeBOM?: boolean;
}

/**
 * Flattens nested objects using dot notation
 * { a: { b: 1 } } => { "a.b": 1 }
 */
function flattenObject(obj: any, prefix = ""): Record<string, any> {
  const flattened: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (value === null || value === undefined) {
        flattened[newKey] = "";
      } else if (typeof value === "object" && !Array.isArray(value)) {
        Object.assign(flattened, flattenObject(value, newKey));
      } else if (Array.isArray(value)) {
        flattened[newKey] = value.join("; ");
      } else {
        flattened[newKey] = value;
      }
    }
  }

  return flattened;
}

/**
 * Escapes CSV values properly
 */
function escapeCSV(value: any): string {
  const str = String(value ?? "");
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Converts array of objects to CSV string
 */
export function convertToCSV(data: any[]): string {
  if (!data.length) return "";

  // Flatten all rows to get consistent headers
  const flattenedRows = data.map((row) => flattenObject(row));
  const headers = Array.from(
    new Set(flattenedRows.flatMap((row) => Object.keys(row)))
  );

  // Build CSV
  const rows = flattenedRows.map((row) =>
    headers.map((header) => escapeCSV(row[header])).join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

/**
 * Triggers browser download of a file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports data as CSV file
 */
export function exportToCSV(
  data: any[],
  filename = "export",
  options: ExportOptions = {}
): void {
  const { includeBOM = true } = options;

  if (!data.length) {
    throw new Error("No data to export");
  }

  let csv = convertToCSV(data);

  // Add UTF-8 BOM for Excel compatibility
  if (includeBOM) {
    csv = "\uFEFF" + csv;
  }

  downloadFile(csv, `${filename}.csv`, "text/csv;charset=utf-8;");
}

/**
 * Exports data as JSON file
 */
export function exportToJSON(data: any[], filename = "export"): void {
  if (!data.length) {
    throw new Error("No data to export");
  }

  const json = JSON.stringify(data, null, 2);
  downloadFile(json, `${filename}.json`, "application/json");
}

/**
 * Exports data as Excel-compatible CSV
 * (Same as CSV but with explicit Excel MIME type)
 */
export function exportToExcel(data: any[], filename = "export"): void {
  exportToCSV(data, filename, { includeBOM: true });
}

/**
 * Estimates file size before export
 */
export function estimateFileSize(data: any[], format: "csv" | "json" = "csv"): string {
  if (!data.length) return "0 B";

  let size: number;
  if (format === "csv") {
    const csv = convertToCSV(data);
    size = new Blob([csv]).size;
  } else {
    const json = JSON.stringify(data);
    size = new Blob([json]).size;
  }

  // Format size
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validates export data
 */
export function validateExportData(data: any[]): { valid: boolean; error?: string } {
  if (!Array.isArray(data)) {
    return { valid: false, error: "Data must be an array" };
  }
  if (data.length === 0) {
    return { valid: false, error: "No data to export" };
  }
  if (!data.every((item) => typeof item === "object" && item !== null)) {
    return { valid: false, error: "All items must be objects" };
  }
  return { valid: true };
}
