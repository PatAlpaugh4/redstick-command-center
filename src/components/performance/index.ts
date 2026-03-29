/**
 * Performance Components Index
 * ============================
 * Export all performance optimization components for easy importing.
 * 
 * @example
 * import { 
 *   LazyImage, 
 *   VirtualizedList, 
 *   WebVitals,
 *   WebVitalsDashboard,
 *   MemoizedDealCard,
 *   usePrefetchDeal
 * } from '@/components/performance';
 */

// =============================================================================
// Lazy Image Component
// =============================================================================

export { 
  LazyImage, 
  LazyAvatar, 
  LazyLogo 
} from './LazyImage';

export { 
  default as LazyImageDefault,
  default 
} from './LazyImage';

// =============================================================================
// Virtualized List Components
// =============================================================================

export { 
  VirtualizedList, 
  VirtualizedDealList, 
  VirtualizedActivityFeed,
  AutoSizer 
} from './VirtualizedList';

export { 
  default as VirtualizedListDefault 
} from './VirtualizedList';

// =============================================================================
// Web Vitals Components
// =============================================================================

export { 
  WebVitals, 
  WebVitalsDashboard,
  useWebVitals 
} from './WebVitals';

export type { 
  WebVitalMetric, 
  MetricRating,
  WebVitalsConfig 
} from './WebVitals';

// =============================================================================
// Memoized Components
// =============================================================================

export {
  MemoizedDealCard,
  MemoizedCompanyCard,
  MemoizedTableRow,
  MemoizedChartContainer,
  MemoizedActivityItem,
  // Non-memoized versions for reference
  DealCard,
  CompanyCard,
  TableRow,
  ChartContainer,
  ActivityItem,
} from './MemoizedComponents';

export type {
  Deal,
  DealCardProps,
  Company,
  CompanyCardProps,
  TableRowProps,
  ChartContainerProps,
  ActivityItemProps,
} from './MemoizedComponents';

// =============================================================================
// Re-export types
// =============================================================================

export type { 
  LazyImageProps 
} from './LazyImage';
