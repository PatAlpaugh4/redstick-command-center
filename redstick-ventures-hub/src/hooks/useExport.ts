"use client";

import { useState, useCallback, useMemo } from "react";
import {
  exportToCSV,
  exportToJSON,
  validateExportData,
  estimateFileSize,
} from "@/lib/export";

interface Toast {
  id: string;
  type: "loading" | "success" | "error";
  title: string;
  message?: string;
}

interface UseExportOptions {
  data: any[];
  filename?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseExportReturn {
  exportCSV: () => void;
  exportJSON: () => void;
  isExporting: boolean;
  progress: number;
  toasts: Toast[];
  dismissToast: (id: string) => void;
  estimatedSize: string;
}

export function useExport(options: UseExportOptions): UseExportReturn {
  const { data, filename = "export", onSuccess, onError } = options;
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const estimatedSize = useMemo(() => estimateFileSize(data, "csv"), [data]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const simulateProgress = useCallback(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 100);
    return interval;
  }, []);

  const exportCSV = useCallback(() => {
    const validation = validateExportData(data);
    if (!validation.valid) {
      const error = new Error(validation.error);
      addToast({
        type: "error",
        title: "Export Failed",
        message: validation.error,
      });
      onError?.(error);
      return;
    }

    setIsExporting(true);
    const toastId = addToast({
      type: "loading",
      title: "Exporting...",
      message: `Preparing ${data.length} records`,
    });

    const progressInterval = simulateProgress();

    // Simulate async export
    setTimeout(() => {
      try {
        clearInterval(progressInterval);
        exportToCSV(data, filename);
        setProgress(100);
        dismissToast(toastId);
        addToast({
          type: "success",
          title: "Export Complete",
          message: `${filename}.csv downloaded`,
        });
        onSuccess?.();
      } catch (err) {
        clearInterval(progressInterval);
        dismissToast(toastId);
        const error = err instanceof Error ? err : new Error("Export failed");
        addToast({
          type: "error",
          title: "Export Failed",
          message: error.message,
        });
        onError?.(error);
      } finally {
        setIsExporting(false);
        setTimeout(() => setProgress(0), 500);
      }
    }, 800);
  }, [data, filename, onSuccess, onError, addToast, dismissToast, simulateProgress]);

  const exportJSON = useCallback(() => {
    const validation = validateExportData(data);
    if (!validation.valid) {
      const error = new Error(validation.error);
      addToast({
        type: "error",
        title: "Export Failed",
        message: validation.error,
      });
      onError?.(error);
      return;
    }

    setIsExporting(true);
    const toastId = addToast({
      type: "loading",
      title: "Exporting...",
      message: `Preparing ${data.length} records`,
    });

    const progressInterval = simulateProgress();

    setTimeout(() => {
      try {
        clearInterval(progressInterval);
        exportToJSON(data, filename);
        setProgress(100);
        dismissToast(toastId);
        addToast({
          type: "success",
          title: "Export Complete",
          message: `${filename}.json downloaded`,
        });
        onSuccess?.();
      } catch (err) {
        clearInterval(progressInterval);
        dismissToast(toastId);
        const error = err instanceof Error ? err : new Error("Export failed");
        addToast({
          type: "error",
          title: "Export Failed",
          message: error.message,
        });
        onError?.(error);
      } finally {
        setIsExporting(false);
        setTimeout(() => setProgress(0), 500);
      }
    }, 600);
  }, [data, filename, onSuccess, onError, addToast, dismissToast, simulateProgress]);

  return {
    exportCSV,
    exportJSON,
    isExporting,
    progress,
    toasts,
    dismissToast,
    estimatedSize,
  };
}
