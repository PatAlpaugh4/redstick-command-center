/**
 * WebVitals Component
 * ===================
 * Core Web Vitals monitoring component using Next.js web-vitals API.
 * Tracks and reports performance metrics for analysis and optimization.
 * 
 * Metrics Tracked:
 * - CLS (Cumulative Layout Shift) - Visual stability
 * - FCP (First Contentful Paint) - Initial render time
 * - FID (First Input Delay) - Interactivity
 * - INP (Interaction to Next Paint) - Responsiveness
 * - LCP (Largest Contentful Paint) - Loading performance
 * - TTFB (Time to First Byte) - Server response time
 * 
 * Usage:
 * Add to your root layout:
 *   import { WebVitals } from '@/components/performance/WebVitals';
 *   
 *   export default function RootLayout({ children }) {
 *     return (
 *       <html>
 *         <body>
 *           {children}
 *           <WebVitals />
 *         </body>
 *       </html>
 *     );
 *   }
 */

'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { useCallback, useRef } from 'react';

// =============================================================================
// Types
// =============================================================================

/**
 * Web Vitals metric rating thresholds
 * Based on Google's Core Web Vitals standards
 */
export type MetricRating = 'good' | 'needs-improvement' | 'poor';

export interface WebVitalMetric {
  /** Metric name */
  name: string;
  /** Metric value (varies by metric type) */
  value: number;
  /** Rating based on thresholds */
  rating: MetricRating;
  /** Whether the value is final */
  delta: number;
  /** Unique ID for this metric instance */
  id: string;
  /** Navigation type */
  navigationType: string;
  /** Start time */
  startTime: number;
  /** Entries associated with this metric */
  entries: PerformanceEntry[];
}

export interface WebVitalsConfig {
  /** Analytics endpoint URL */
  analyticsUrl?: string;
  /** Debug mode - logs to console */
  debug?: boolean;
  /** Sample rate (0-1) - percentage of sessions to track */
  sampleRate?: number;
  /** Custom handler for metrics */
  onMetric?: (metric: WebVitalMetric) => void;
  /** Minimum metric value to report (filters out 0/undefined) */
  minValue?: number;
}

// =============================================================================
// Rating Thresholds (Core Web Vitals Standards)
// =============================================================================

const RATING_THRESHOLDS: Record<string, { good: number; poor: number }> = {
  CLS: { good: 0.1, poor: 0.25 },       // Layout shift score
  FCP: { good: 1800, poor: 3000 },      // milliseconds
  FID: { good: 100, poor: 300 },        // milliseconds
  INP: { good: 200, poor: 500 },        // milliseconds
  LCP: { good: 2500, poor: 4000 },      // milliseconds
  TTFB: { good: 800, poor: 1800 },      // milliseconds
};

/**
 * Get rating based on metric value and thresholds
 */
function getRating(name: string, value: number): MetricRating {
  const thresholds = RATING_THRESHOLDS[name];
  if (!thresholds) return 'good';

  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Get unit for metric value
 */
function getUnit(name: string): string {
  if (name === 'CLS') return '';
  return 'ms';
}

// =============================================================================
// Analytics Senders
// // =============================================================================

/**
 * Send metric to analytics endpoint
 */
async function sendToAnalytics(metric: WebVitalMetric, analyticsUrl: string): Promise<void> {
  const body = JSON.stringify({
    ...metric,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  });

  // Use sendBeacon if available, fallback to fetch
  if (navigator.sendBeacon) {
    navigator.sendBeacon(analyticsUrl, body);
  } else {
    try {
      await fetch(analyticsUrl, {
        body,
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.warn('[WebVitals] Failed to send metric:', error);
    }
  }
}

/**
 * Send metric to Google Analytics 4
 */
function sendToGA4(metric: WebVitalMetric, ga4Id?: string): void {
  // @ts-ignore - gtag might not be typed
  if (typeof gtag !== 'function') {
    console.warn('[WebVitals] gtag not found. GA4 tracking disabled.');
    return;
  }

  // @ts-ignore
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
    non_interaction: true,
    custom_parameter_1: metric.rating,
  });
}

/**
 * Send metric to Vercel Speed Insights
 */
function sendToVercel(metric: WebVitalMetric): void {
  // @ts-ignore - vercel function might not be typed
  if (typeof window !== 'undefined' && window.va) {
    // @ts-ignore
    window.va('event', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
    });
  }
}

// =============================================================================
// Console Logger
// =============================================================================

/**
 * Log metric to console with color coding
 */
function logToConsole(metric: WebVitalMetric): void {
  const colorMap: Record<MetricRating, string> = {
    good: '#22c55e',
    'needs-improvement': '#f59e0b',
    poor: '#ef4444',
  };

  const unit = getUnit(metric.name);
  const formattedValue = metric.name === 'CLS' 
    ? metric.value.toFixed(4) 
    : Math.round(metric.value);

  console.log(
    `%c[WebVitals]%c ${metric.name}`,
    'color: #3b82f6; font-weight: bold;',
    'color: inherit;',
    `${formattedValue}${unit}`,
    `(${metric.rating})`,
    metric.id
  );

  // Detailed logging for poor metrics
  if (metric.rating === 'poor') {
    console.warn(
      `%c[WebVitals]%c ${metric.name} needs attention!`,
      'color: #ef4444; font-weight: bold;',
      'color: inherit;',
      `Value: ${formattedValue}${unit} exceeds threshold.`
    );
  }
}

// =============================================================================
// Main Component
// =============================================================================

export function WebVitals({
  analyticsUrl,
  debug = process.env.NODE_ENV === 'development',
  sampleRate = 1.0,
  onMetric,
  minValue = 0,
}: WebVitalsConfig) {
  // Track sent metrics to avoid duplicates
  const sentMetricsRef = useRef<Set<string>>(new Set());

  useReportWebVitals((metric: any) => {
    // Apply sample rate
    if (Math.random() > sampleRate) return;

    // Filter out invalid values
    if (!metric.value || metric.value < minValue) return;

    // Get rating for this metric
    const rating = getRating(metric.name, metric.value);

    // Construct our metric object
    const webVitalMetric: WebVitalMetric = {
      name: metric.name,
      value: metric.value,
      rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType || 'navigate',
      startTime: metric.startTime || 0,
      entries: metric.entries || [],
    };

    // Avoid duplicate reports for the same metric instance
    const metricKey = `${metric.name}-${metric.id}`;
    if (sentMetricsRef.current.has(metricKey)) return;
    sentMetricsRef.current.add(metricKey);

    // Debug logging
    if (debug) {
      logToConsole(webVitalMetric);
    }

    // Custom handler
    if (onMetric) {
      onMetric(webVitalMetric);
    }

    // Send to analytics endpoint
    if (analyticsUrl) {
      sendToAnalytics(webVitalMetric, analyticsUrl);
    }

    // Send to GA4 if available
    sendToGA4(webVitalMetric);

    // Send to Vercel Speed Insights
    sendToVercel(webVitalMetric);
  });

  // This component doesn't render anything
  return null;
}

// =============================================================================
// Hook for programmatic Web Vitals access
// =============================================================================

import { useState, useEffect } from 'react';

interface UseWebVitalsReturn {
  metrics: WebVitalMetric[];
  getMetric: (name: string) => WebVitalMetric | undefined;
  getPoorMetrics: () => WebVitalMetric[];
  getAverageMetric: (name: string) => number | undefined;
}

/**
 * Hook to access Web Vitals metrics in your components
 * Useful for displaying performance metrics in dev tools or dashboards
 */
export function useWebVitals(): UseWebVitalsReturn {
  const [metrics, setMetrics] = useState<WebVitalMetric[]>([]);

  useEffect(() => {
    const collectedMetrics: WebVitalMetric[] = [];

    const unsubscribe = useReportWebVitals((metric: any) => {
      const rating = getRating(metric.name, metric.value);
      const webVitalMetric: WebVitalMetric = {
        name: metric.name,
        value: metric.value,
        rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType || 'navigate',
        startTime: metric.startTime || 0,
        entries: metric.entries || [],
      };

      collectedMetrics.push(webVitalMetric);
      setMetrics([...collectedMetrics]);
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  const getMetric = useCallback(
    (name: string) => metrics.find((m) => m.name === name),
    [metrics]
  );

  const getPoorMetrics = useCallback(
    () => metrics.filter((m) => m.rating === 'poor'),
    [metrics]
  );

  const getAverageMetric = useCallback(
    (name: string) => {
      const metricValues = metrics
        .filter((m) => m.name === name)
        .map((m) => m.value);
      
      if (metricValues.length === 0) return undefined;
      
      const sum = metricValues.reduce((a, b) => a + b, 0);
      return sum / metricValues.length;
    },
    [metrics]
  );

  return { metrics, getMetric, getPoorMetrics, getAverageMetric };
}

// =============================================================================
// Performance Dashboard Component (Dev Only)
// =============================================================================

interface WebVitalsDashboardProps {
  /** Position on screen */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * Development dashboard for monitoring Web Vitals
 * Only renders in development mode
 */
export function WebVitalsDashboard({ position = 'bottom-right' }: WebVitalsDashboardProps) {
  const { metrics, getPoorMetrics } = useWebVitals();
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const poorMetrics = getPoorMetrics();
  const hasPoorMetrics = poorMetrics.length > 0;

  // Get latest value for each metric type
  const latestMetrics = metrics.reduce((acc, metric) => {
    acc[metric.name] = metric;
    return acc;
  }, {} as Record<string, WebVitalMetric>);

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 font-mono text-xs`}
      style={{ maxWidth: '320px' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg transition-colors ${
          hasPoorMetrics
            ? 'bg-red-500/90 text-white hover:bg-red-600'
            : 'bg-gray-900/90 text-white hover:bg-gray-800'
        }`}
      >
        <span className="font-bold">⚡ Web Vitals</span>
        {hasPoorMetrics && (
          <span className="bg-white text-red-500 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
            {poorMetrics.length}
          </span>
        )}
        <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div className="mt-2 bg-gray-900/95 rounded-lg shadow-lg p-3 text-white">
          <div className="space-y-2">
            {Object.entries(RATING_THRESHOLDS).map(([name]) => {
              const metric = latestMetrics[name];
              if (!metric) {
                return (
                  <div key={name} className="flex justify-between items-center opacity-50">
                    <span>{name}</span>
                    <span className="text-gray-500">-</span>
                  </div>
                );
              }

              const colorClass =
                metric.rating === 'good'
                  ? 'text-green-400'
                  : metric.rating === 'needs-improvement'
                  ? 'text-yellow-400'
                  : 'text-red-400';

              const unit = getUnit(name);
              const value =
                name === 'CLS'
                  ? metric.value.toFixed(4)
                  : Math.round(metric.value);

              return (
                <div key={name} className="flex justify-between items-center">
                  <span className="font-medium">{name}</span>
                  <span className={colorClass}>
                    {value}
                    {unit} ({metric.rating})
                  </span>
                </div>
              );
            })}
          </div>

          {hasPoorMetrics && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-red-400 font-bold mb-1">Needs Improvement:</p>
              <ul className="space-y-1">
                {poorMetrics.map((metric) => (
                  <li key={metric.id} className="text-red-300">
                    {metric.name}: {metric.name === 'CLS' ? metric.value.toFixed(4) : Math.round(metric.value)}
                    {getUnit(metric.name)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-gray-700 text-gray-400 text-[10px]">
            <p>Core Web Vitals Thresholds:</p>
            <ul className="mt-1 space-y-0.5">
              <li>LCP: &lt;2.5s good, &lt;4s needs improvement</li>
              <li>INP: &lt;200ms good, &lt;500ms needs improvement</li>
              <li>CLS: &lt;0.1 good, &lt;0.25 needs improvement</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default WebVitals;
