/**
 * Error Boundary Integration Examples
 * ===================================
 * Comprehensive examples showing how to wrap existing components
 * with ErrorBoundary for error resilience.
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ActivityChart, 
  DealFlowChart, 
  PortfolioChart, 
  SectorChart 
} from "@/components/charts";
import { DataTable } from "@/components/ui/DataTable";
import { KanbanBoard } from "@/components/pipeline/KanbanBoard";
import AgentControlPanel from "@/components/agents/AgentControlPanel";
import { 
  ErrorBoundary, 
  ErrorFallback, 
  ErrorCard, 
  ErrorChip,
  ApiError 
} from "./";

// =============================================================================
// Chart Error Wrappers
// =============================================================================

/**
 * ActivityChart with Error Boundary
 * 
 * Wraps the ActivityChart component with an error boundary that displays
 * a compact error card suitable for dashboard widgets.
 */
export const ActivityChartWithErrorBoundary: React.FC<{
  data?: any[];
  isLoading?: boolean;
  height?: number;
}> = (props) => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorCard
          title="Chart Error"
          message="Failed to load activity chart data"
          onRetry={() => window.location.reload()}
          size="sm"
        />
      }
    >
      <ActivityChart {...props} />
    </ErrorBoundary>
  );
};

/**
 * DealFlowChart with Error Boundary
 */
export const DealFlowChartWithErrorBoundary: React.FC<{
  data?: any[];
  isLoading?: boolean;
  height?: number;
}> = (props) => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorCard
          title="Chart Error"
          message="Failed to load deal flow data"
          onRetry={() => window.location.reload()}
          size="sm"
        />
      }
    >
      <DealFlowChart {...props} />
    </ErrorBoundary>
  );
};

/**
 * PortfolioChart with Error Boundary
 */
export const PortfolioChartWithErrorBoundary: React.FC<{
  data?: any[];
  isLoading?: boolean;
  height?: number;
}> = (props) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="h-[300px] flex items-center justify-center">
          <ErrorCard
            title="Chart Error"
            message="Failed to load portfolio chart"
            onRetry={() => window.location.reload()}
            size="sm"
          />
        </div>
      }
    >
      <PortfolioChart {...props} />
    </ErrorBoundary>
  );
};

/**
 * SectorChart with Error Boundary
 */
export const SectorChartWithErrorBoundary: React.FC<{
  data?: any[];
  isLoading?: boolean;
  height?: number;
}> = (props) => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorChip
          message="Failed to load sector chart"
          onRetry={() => window.location.reload()}
        />
      }
    >
      <SectorChart {...props} />
    </ErrorBoundary>
  );
};

// =============================================================================
// DataTable Error Wrapper
// =============================================================================

/**
 * DataTable with Error Boundary
 * 
 * Displays a full-page error fallback since DataTable is typically
 * a main content component.
 */
export const DataTableWithErrorBoundary = <T extends Record<string, any>>(
  props: React.ComponentProps<typeof DataTable<T>>
) => {
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback
          title="Failed to Load Data"
          description="We couldn't load the table data. This might be a temporary issue with our servers."
          onRetry={() => window.location.reload()}
        />
      }
    >
      <DataTable {...props} />
    </ErrorBoundary>
  );
};

// =============================================================================
// KanbanBoard Error Wrapper
// =============================================================================

/**
 * KanbanBoard with Error Boundary
 * 
 * The KanbanBoard is a complex component with drag-and-drop functionality.
 * Errors here can crash the entire pipeline view, so we wrap it carefully.
 */
export const KanbanBoardWithErrorBoundary: React.FC = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="h-screen flex items-center justify-center bg-[#0f0f1a]">
          <ErrorFallback
            title="Pipeline Error"
            description="Unable to load the deal pipeline. Your data is safe, but we encountered an error displaying it."
            onRetry={() => window.location.reload()}
          />
        </div>
      }
      onError={(error, errorInfo) => {
        // Log additional context for Kanban-specific errors
        console.error("[KanbanBoard Error]", {
          error,
          errorInfo,
          component: "KanbanBoard",
          hasDnD: true,
        });
      }}
    >
      <KanbanBoard />
    </ErrorBoundary>
  );
};

// =============================================================================
// AgentControlPanel Error Wrapper
// =============================================================================

/**
 * AgentControlPanel with Error Boundary
 * 
 * Wraps the agent control panel with error handling specific to
 * agent management functionality.
 */
export const AgentControlPanelWithErrorBoundary: React.FC = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-[#0f0f1a] p-6">
          <ErrorFallback
            title="Agent Control Error"
            description="We couldn't load the agent control panel. Your agents are still running, but we can't display their status."
            onRetry={() => window.location.reload()}
          />
        </div>
      }
      onError={(error, errorInfo) => {
        // Log to agent-specific error tracking
        console.error("[AgentControl Error]", {
          error,
          errorInfo,
          component: "AgentControlPanel",
          severity: "high",
        });
      }}
    >
      <AgentControlPanel />
    </ErrorBoundary>
  );
};

// =============================================================================
// Dashboard Composition Example
// =============================================================================

/**
 * Dashboard with Multiple Protected Components
 * 
 * This example shows how to compose a dashboard where each widget
 * has its own error boundary, preventing one failed widget from
 * crashing the entire dashboard.
 */
export const ResilientDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f0f1a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-[#a0a0b0]">
            Each widget below is protected by its own error boundary
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Chart Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1a2e] rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Activity</h2>
            <ActivityChartWithErrorBoundary height={280} />
          </motion.div>

          {/* Portfolio Chart Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1a1a2e] rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Portfolio</h2>
            <PortfolioChartWithErrorBoundary height={280} />
          </motion.div>

          {/* Deal Flow Chart Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1a1a2e] rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Deal Flow</h2>
            <DealFlowChartWithErrorBoundary height={280} />
          </motion.div>

          {/* Sector Chart Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1a1a2e] rounded-xl p-6 border border-white/10"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Sectors</h2>
            <SectorChartWithErrorBoundary height={280} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// API Error Handling Examples
// =============================================================================

/**
 * Example component showing API error states
 */
export const ApiErrorExamples: React.FC = () => {
  const [retryCount, setRetryCount] = React.useState(0);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    console.log("Retrying...", retryCount);
  };

  return (
    <div className="space-y-4 p-6">
      {/* 404 Error */}
      <ApiError
        status={404}
        message="The requested deal could not be found. It may have been deleted or moved."
        onRetry={handleRetry}
      />

      {/* 500 Error */}
      <ApiError
        status={500}
        message="An internal server error occurred while loading your portfolio."
        onRetry={handleRetry}
      />

      {/* 401 Error */}
      <ApiError
        status={401}
        message="Your session has expired. Please sign in again."
        onRetry={handleRetry}
      />

      {/* 429 Rate Limit */}
      <ApiError
        status={429}
        message="You've made too many requests. Please wait a moment."
        onRetry={handleRetry}
      />
    </div>
  );
};

// =============================================================================
// Error Card Examples
// =============================================================================

/**
 * Example component showing different ErrorCard configurations
 */
export const ErrorCardExamples: React.FC = () => {
  return (
    <div className="space-y-4 p-6 bg-[#0f0f1a]">
      {/* Small Error Card */}
      <ErrorCard
        size="sm"
        message="Failed to refresh data"
        onRetry={() => console.log("Retrying...")}
        onDismiss={() => console.log("Dismissed")}
      />

      {/* Medium Error Card (default) */}
      <ErrorCard
        size="md"
        title="Sync Failed"
        message="Unable to synchronize with Salesforce. Your changes are saved locally and will sync when connection is restored."
        onRetry={() => console.log("Retrying...")}
      />

      {/* Large Error Card */}
      <ErrorCard
        size="lg"
        title="Import Error"
        message="We encountered an error while importing your data. Please check your file format and try again."
        variant="error"
        onRetry={() => console.log("Retrying...")}
      />

      {/* Warning Variant */}
      <ErrorCard
        size="md"
        title="Partial Data Loaded"
        message="Some records could not be loaded due to permissions."
        variant="warning"
        onDismiss={() => console.log("Dismissed")}
      />

      {/* Info Variant */}
      <ErrorCard
        size="md"
        title="Connection Lost"
        message="Working in offline mode. Changes will sync when connection is restored."
        variant="info"
      />

      {/* Error Chip */}
      <div className="flex justify-end">
        <ErrorChip
          message="Sync failed"
          onRetry={() => console.log("Retrying...")}
        />
      </div>
    </div>
  );
};

// =============================================================================
// Full Page Error Examples
// =============================================================================

/**
 * Example of a full page error fallback
 */
export const FullPageErrorExample: React.FC = () => {
  return (
    <ErrorFallback
      error={new Error("Failed to initialize dashboard components")}
      onRetry={() => window.location.reload()}
      title="Dashboard Unavailable"
      description="We're having trouble loading the dashboard. This might be a temporary issue."
    />
  );
};

// =============================================================================
// Export all examples
// =============================================================================

export default {
  ActivityChartWithErrorBoundary,
  DealFlowChartWithErrorBoundary,
  PortfolioChartWithErrorBoundary,
  SectorChartWithErrorBoundary,
  DataTableWithErrorBoundary,
  KanbanBoardWithErrorBoundary,
  AgentControlPanelWithErrorBoundary,
  ResilientDashboard,
  ApiErrorExamples,
  ErrorCardExamples,
  FullPageErrorExample,
};
