"use client";

import { Suspense, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List,
  Filter,
  Plus,
  Download,
  Trash2,
  Edit,
  MoreHorizontal,
} from "lucide-react";

import { ErrorBoundary } from "@/components/error";
import { ErrorFallback } from "@/components/error";
import { ApiError } from "@/components/error";
import { KanbanSkeleton, TableSkeleton } from "@/components/skeletons";
import KanbanBoard from "@/components/pipeline/KanbanBoard";
import { DataTable, type ColumnDef, type BulkAction } from "@/components/ui";
import { Button } from "@/components/ui";
import { BulkActionsBar } from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import { useDeals } from "@/hooks/useDeals";
import { useExport } from "@/hooks/useExport";
import type { Deal, DealStatus } from "@/types";

// =============================================================================
// Types & Constants
// =============================================================================

type ViewMode = "board" | "list";

const DEAL_STAGES: { value: DealStatus; label: string; color: string }[] = [
  { value: "SOURCED", label: "Sourced", color: "#6366f1" },
  { value: "SCREENING", label: "Screening", color: "#8b5cf6" },
  { value: "FIRST_MEETING", label: "1st Meeting", color: "#ec4899" },
  { value: "PARTNER_MEETING", label: "Partner Meeting", color: "#f59e0b" },
  { value: "IC_PREP", label: "IC Prep", color: "#10b981" },
  { value: "IC_PRESENTED", label: "IC Presented", color: "#0ea5e9" },
  { value: "DILIGENCE", label: "Due Diligence", color: "#e94560" },
  { value: "TERM_SHEET", label: "Term Sheet", color: "#22c55e" },
  { value: "NEGOTIATING", label: "Negotiating", color: "#f97316" },
  { value: "COMMITMENT", label: "Commitment", color: "#14b8a6" },
  { value: "CLOSED", label: "Closed", color: "#22c55e" },
  { value: "PASSED", label: "Passed", color: "#6b7280" },
  { value: "STALE", label: "Stale", color: "#9ca3af" },
];

// =============================================================================
// Helper Functions
// =============================================================================

const formatAmount = (amount: number | null | undefined): string => {
  if (!amount) return "$0";
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
};

const getStageColor = (stage: string): string => {
  const stageConfig = DEAL_STAGES.find((s) => s.value === stage);
  return stageConfig?.color || "#6b7280";
};

const getStageLabel = (stage: string): string => {
  const stageConfig = DEAL_STAGES.find((s) => s.value === stage);
  return stageConfig?.label || stage;
};

// =============================================================================
// Table Columns Configuration
// =============================================================================

const getDealColumns = (toast: ReturnType<typeof useToast>): ColumnDef<Deal>[] => [
  {
    key: "companyName",
    header: "Company",
    sortable: true,
    filterable: true,
    width: "25%",
    render: (value, row) => (
      <div className="flex items-center gap-3">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: getStageColor(row.stage) }}
        />
        <span className="font-medium text-white">{value}</span>
      </div>
    ),
  },
  {
    key: "stage",
    header: "Stage",
    sortable: true,
    filterable: true,
    width: "15%",
    render: (value) => (
      <span
        className="px-2.5 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: `${getStageColor(value)}20`,
          color: getStageColor(value),
        }}
      >
        {getStageLabel(value)}
      </span>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    sortable: true,
    width: "12%",
    render: (value) => (
      <span className="text-white font-medium">{formatAmount(value)}</span>
    ),
  },
  {
    key: "assignedTo",
    header: "Assigned To",
    sortable: true,
    filterable: true,
    width: "15%",
    render: (value) => (
      <span className="text-[#a0a0b0]">{value || "Unassigned"}</span>
    ),
  },
  {
    key: "priority",
    header: "Priority",
    sortable: true,
    width: "10%",
    render: (value) => {
      const colors: Record<string, string> = {
        high: "bg-red-500/20 text-red-400",
        medium: "bg-yellow-500/20 text-yellow-400",
        low: "bg-green-500/20 text-green-400",
      };
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs capitalize ${
            colors[value as string] || "bg-gray-500/20 text-gray-400"
          }`}
        >
          {value || "Medium"}
        </span>
      );
    },
  },
  {
    key: "expectedCloseDate",
    header: "Expected Close",
    sortable: true,
    width: "13%",
    render: (value) => (
      <span className="text-[#a0a0b0]">
        {value ? new Date(value).toLocaleDateString() : "-"}
      </span>
    ),
  },
  {
    key: "id",
    header: "Actions",
    width: "10%",
    render: (_, row) => (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-[#a0a0b0] hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            // Edit functionality
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-[#a0a0b0] hover:text-red-400"
          onClick={(e) => {
            e.stopPropagation();
            // Delete functionality
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

// =============================================================================
// Main Page Component
// =============================================================================

export default function PipelinePage() {
  const toast = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [selectedDeals, setSelectedDeals] = useState<Deal[]>([]);
  const [filters, setFilters] = useState({ status: "active" as const });

  // Fetch deals data
  const {
    deals,
    isLoading,
    isError,
    error,
    refetch,
    deleteDeal,
    updateDealStage,
  } = useDeals({ filters });

  // Export functionality
  const { exportCSV, isExporting } = useExport({
    data: selectedDeals.length > 0 ? selectedDeals : deals,
    filename: `deals-${new Date().toISOString().split("T")[0]}`,
    onSuccess: () => {
      toast.success("Export Complete", "Deals exported successfully");
    },
    onError: (err) => {
      toast.error("Export Failed", err.message);
    },
  });

  // Handle bulk delete
  const handleBulkDelete = useCallback(async (selectedRows: Deal[]) => {
    if (!confirm(`Delete ${selectedRows.length} deals? This action cannot be undone.`)) {
      return;
    }

    const deleteToastId = toast.loading(
      "Deleting Deals",
      `Deleting ${selectedRows.length} deals...`
    );

    try {
      await Promise.all(selectedRows.map((deal) => deleteDeal.mutateAsync(deal.id)));
      toast.update(deleteToastId, {
        type: "success",
        title: "Deals Deleted",
        message: `${selectedRows.length} deals deleted successfully`,
      });
      setSelectedDeals([]);
    } catch (err) {
      toast.update(deleteToastId, {
        type: "error",
        title: "Delete Failed",
        message: err instanceof Error ? err.message : "Failed to delete deals",
      });
    }
  }, [deleteDeal, toast]);

  // Handle stage update
  const handleStageUpdate = useCallback(
    async (dealId: string, stage: Deal["stage"]) => {
      try {
        await updateDealStage.mutateAsync({ id: dealId, stage });
        toast.success("Stage Updated", "Deal moved to " + getStageLabel(stage));
      } catch (err) {
        toast.error(
          "Update Failed",
          err instanceof Error ? err.message : "Failed to update stage"
        );
      }
    },
    [updateDealStage, toast]
  );

  // Bulk actions for DataTable
  const bulkActions: BulkAction<Deal>[] = [
    {
      label: "Export",
      icon: <Download className="h-4 w-4 mr-2" />,
      onClick: () => exportCSV(),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      variant: "destructive",
      onClick: handleBulkDelete,
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] p-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-8 w-48 bg-white/10 rounded animate-pulse mb-2" />
              <div className="h-4 w-64 bg-white/5 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-32 bg-white/10 rounded animate-pulse" />
              <div className="h-10 w-32 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
          {/* Content Skeleton */}
          {viewMode === "board" ? <KanbanSkeleton /> : <TableSkeleton />}
        </div>
      </div>
    );
  }

  // Error state
  if (isError && error) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] p-6">
        <div className="max-w-[1600px] mx-auto">
          <ApiError
            status={error.status || 500}
            message={error.message}
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Deal Pipeline</h1>
            <p className="text-[#a0a0b0]">
              Manage your investment opportunities across stages
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-[#1a1a2e] rounded-lg border border-white/10 p-1">
              <button
                onClick={() => setViewMode("board")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "board"
                    ? "bg-[#e94560] text-white"
                    : "text-[#a0a0b0] hover:text-white"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Board
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-[#e94560] text-white"
                    : "text-[#a0a0b0] hover:text-white"
                }`}
              >
                <List className="h-4 w-4" />
                List
              </button>
            </div>

            {/* Export Button */}
            <Button
              variant="outline"
              onClick={() => exportCSV()}
              disabled={isExporting}
              className="border-white/10 text-[#a0a0b0] hover:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            {/* Add Deal Button */}
            <Button
              className="bg-[#e94560] hover:bg-[#d63d56] text-white"
              onClick={() => {
                toast.info("Coming Soon", "Add deal functionality will be available soon");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Deal
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <StatCard
            label="Total Pipeline"
            value={formatAmount(
              deals.reduce((sum, deal) => sum + (deal.amount || 0), 0)
            )}
            trend="+12% from last month"
          />
          <StatCard
            label="Active Deals"
            value={deals.filter((d) => d.status === "active").length.toString()}
            trend="8 new this week"
          />
          <StatCard
            label="Avg Deal Size"
            value={formatAmount(
              deals.length
                ? deals.reduce((sum, deal) => sum + (deal.amount || 0), 0) /
                    deals.length
                : 0
            )}
            trend="+5% from last month"
          />
          <StatCard
            label="Closing This Month"
            value={deals
              .filter(
                (d) =>
                  d.expectedCloseDate &&
                  new Date(d.expectedCloseDate).getMonth() === new Date().getMonth()
              )
              .length.toString()}
            trend="3 require attention"
          />
        </motion.div>

        {/* Content */}
        <ErrorBoundary
          fallback={<ErrorFallback onRetry={refetch} />}
          onError={(error) => {
            console.error("Pipeline error:", error);
            toast.error("Error", "Something went wrong in the pipeline view");
          }}
        >
          <Suspense
            fallback={viewMode === "board" ? <KanbanSkeleton /> : <TableSkeleton />}
          >
            <AnimatePresence mode="wait">
              {viewMode === "board" ? (
                <motion.div
                  key="board"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <KanbanBoard
                    deals={deals}
                    onStageChange={handleStageUpdate}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <DataTable
                    data={deals}
                    columns={getDealColumns(toast)}
                    pageSize={10}
                    onSelectionChange={setSelectedDeals}
                    bulkActions={bulkActions}
                    rowKey="id"
                    emptyState={{
                      title: "No deals found",
                      description: "Get started by adding your first deal to the pipeline.",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>

        {/* Bulk Actions Bar */}
        <BulkActionsBar
          selectedCount={selectedDeals.length}
          totalCount={deals.length}
          onSelectAll={() => setSelectedDeals(deals)}
          onClearSelection={() => setSelectedDeals([])}
          actions={[
            {
              label: "Export Selected",
              icon: <Download className="h-4 w-4" />,
              onClick: () => exportCSV(),
              variant: "default",
            },
            {
              label: "Delete",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: () => handleBulkDelete(selectedDeals),
              variant: "danger",
            },
          ]}
        />
      </div>
    </div>
  );
}

// =============================================================================
// Stat Card Component
// =============================================================================

function StatCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/10">
      <p className="text-[#a0a0b0] text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-[#e94560]">{trend}</p>
    </div>
  );
}
