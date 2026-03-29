/**
 * Dynamic Imports Setup
 * =====================
 * Centralized dynamic imports for heavy components to enable code splitting
 * and improve initial page load performance.
 * 
 * Usage:
 *   import { DynamicKanbanBoard } from '@/lib/dynamic';
 *   
 *   <DynamicKanbanBoard {...props} />
 * 
 * Benefits:
 * - Reduces initial bundle size
 * - Loads components only when needed
 * - Shows skeleton UI during load
 * - Disables SSR for browser-only components (drag-and-drop)
 */

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { KanbanSkeleton } from '@/components/skeletons/KanbanSkeleton';
import { ChartSkeleton } from '@/components/skeletons/ChartSkeleton';

// =============================================================================
// Pipeline Components
// =============================================================================

/**
 * Dynamic Kanban Board
 * - Heavy drag-and-drop component using @dnd-kit
 * - SSR disabled due to browser-only drag-and-drop APIs
 * - Shows KanbanSkeleton during load
 */
export const DynamicKanbanBoard = dynamic(
  () => import('@/components/pipeline/KanbanBoard'),
  {
    loading: () => <KanbanSkeleton columnCount={8} cardsPerColumn={2} />,
    ssr: false, // Drag-and-drop requires browser APIs
  }
);

// =============================================================================
// Chart Components
// =============================================================================

/**
 * Dynamic Portfolio Chart
 * - Heavy Recharts component with complex SVG rendering
 * - Shows ChartSkeleton during load
 */
export const DynamicPortfolioChart = dynamic(
  () => import('@/components/charts/PortfolioChart'),
  {
    loading: () => <ChartSkeleton height={300} variant="line" showLegend={true} />,
  }
);

/**
 * Dynamic Deal Flow Chart
 * - Recharts bar/area chart component
 */
export const DynamicDealFlowChart = dynamic(
  () => import('@/components/charts/DealFlowChart'),
  {
    loading: () => <ChartSkeleton height={300} variant="bar" showLegend={false} />,
  }
);

/**
 * Dynamic Sector Chart
 * - Recharts pie/donut chart component
 */
export const DynamicSectorChart = dynamic(
  () => import('@/components/charts/SectorChart'),
  {
    loading: () => <ChartSkeleton height={300} variant="pie" showLegend={true} />,
  }
);

/**
 * Dynamic Activity Chart
 * - Recharts area chart component
 */
export const DynamicActivityChart = dynamic(
  () => import('@/components/charts/ActivityChart'),
  {
    loading: () => <ChartSkeleton height={250} variant="area" showLegend={false} />,
  }
);

// =============================================================================
// Agent Components
// =============================================================================

/**
 * Dynamic Agent Control Panel
 * - Complex component with Monaco editor or heavy UI
 * - Lazy loaded on agent-related pages
 */
export const DynamicAgentControlPanel = dynamic(
  () => import('@/components/agents/AgentControlPanel'),
  {
    loading: () => (
      <div className="h-[400px] bg-[#0f0f1a] rounded-xl border border-white/10 animate-pulse flex items-center justify-center">
        <div className="text-white/30 text-sm">Loading Agent Panel...</div>
      </div>
    ),
    ssr: false,
  }
);

// =============================================================================
// Activity Components
// =============================================================================

/**
 * Dynamic Activity Feed
 * - Component with infinite scroll and complex filtering
 * - Lazy loaded when activity section is visible
 */
export const DynamicActivityFeed = dynamic(
  () => import('@/components/activity/ActivityFeed'),
  {
    loading: () => (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="ml-12 rounded-xl border border-white/10 bg-[#1a1a2e]/50 p-4 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="h-9 w-9 rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-white/10 rounded" />
                <div className="h-3 w-1/4 bg-white/5 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  }
);

// =============================================================================
// Utility Exports
// =============================================================================

/**
 * Preload function for eager loading components
 * Call this on hover or when component visibility is imminent
 * 
 * Example:
 *   <Link 
 *     href="/pipeline" 
 *     onMouseEnter={() => preloadKanbanBoard()}
 *   >
 *     Pipeline
 *   </Link>
 */
export const preloadKanbanBoard = () => {
  const KanbanBoard = import('@/components/pipeline/KanbanBoard');
};

export const preloadPortfolioChart = () => {
  const PortfolioChart = import('@/components/charts/PortfolioChart');
};

export const preloadDealFlowChart = () => {
  const DealFlowChart = import('@/components/charts/DealFlowChart');
};

export const preloadAgentControlPanel = () => {
  const AgentControlPanel = import('@/components/agents/AgentControlPanel');
};

// =============================================================================
// Suspense Wrapper for Client Components
// =============================================================================

interface WithSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Suspense boundary wrapper for dynamic components
 * Ensures consistent loading states across the app
 */
export function WithSuspense({ children, fallback }: WithSuspenseProps) {
  return (
    <Suspense
      fallback={
        fallback || (
          <div className="flex items-center justify-center p-8">
            <div className="w-8 h-8 border-2 border-[#e94560] border-t-transparent rounded-full animate-spin" />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
}
