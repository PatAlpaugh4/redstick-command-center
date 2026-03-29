"use client";

import { Suspense, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Download,
  Filter,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { ErrorBoundary } from "@/components/error";
import { ErrorFallback, ApiError } from "@/components/error";
import { TableSkeleton } from "@/components/skeletons";
import { DataTable, type ColumnDef, type BulkAction } from "@/components/ui";
import { Button } from "@/components/ui";
import { PortfolioChart } from "@/components/charts";
import { useToast } from "@/hooks/useToast";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useExport } from "@/hooks/useExport";
import type { Company, CompanyStatus } from "@/types";

// =============================================================================
// Helper Functions
// =============================================================================

const formatAmount = (amount: number | null | undefined): string => {
  if (!amount) return "$0";
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
};

const formatPercent = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "0%";
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
};

const getStatusColor = (status: CompanyStatus): string => {
  const colors: Record<CompanyStatus, string> = {
    ACTIVE: "#22c55e",
    ACQUIRED: "#3b82f6",
    IPO: "#8b5cf6",
    SHUTDOWN: "#dc2626",
    ZOMBIE: "#9ca3af",
  };
  return colors[status] || "#6b7280";
};

const getStatusLabel = (status: CompanyStatus): string => {
  const labels: Record<CompanyStatus, string> = {
    ACTIVE: "Active",
    ACQUIRED: "Acquired",
    IPO: "Public",
    SHUTDOWN: "Shutdown",
    ZOMBIE: "Zombie",
  };
  return labels[status] || status;
};

// =============================================================================
// Table Columns Configuration
// =============================================================================

const getCompanyColumns = (toast: ReturnType<typeof useToast>): ColumnDef<Company>[] => [
  {
    key: "name",
    header: "Company",
    sortable: true,
    filterable: true,
    width: "25%",
    render: (value, row) => (
      <div className="flex items-center gap-3">
        {row.logo ? (
          <img
            src={row.logo}
            alt={value}
            className="w-10 h-10 rounded-lg object-cover bg-white/5"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#e94560]/20 to-[#e94560]/5 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-[#e94560]" />
          </div>
        )}
        <div>
          <span className="font-medium text-white block">{value}</span>
          <span className="text-xs text-[#6a6a7a]">{row.sector || "Unknown Sector"}</span>
        </div>
      </div>
    ),
  },
  {
    key: "stage",
    header: "Stage",
    sortable: true,
    filterable: true,
    width: "12%",
    render: (value) => (
      <span className="text-[#a0a0b0]">{value || "Unknown"}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    filterable: true,
    width: "10%",
    render: (value) => (
      <span
        className="px-2.5 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: `${getStatusColor(value as CompanyStatus)}20`,
          color: getStatusColor(value as CompanyStatus),
        }}
      >
        {getStatusLabel(value as CompanyStatus)}
      </span>
    ),
  },
  {
    key: "investmentAmount",
    header: "Invested",
    sortable: true,
    width: "12%",
    render: (value) => (
      <span className="text-white font-medium">{formatAmount(value)}</span>
    ),
  },
  {
    key: "currentValuation",
    header: "Valuation",
    sortable: true,
    width: "12%",
    render: (value) => (
      <span className="text-white">{formatAmount(value)}</span>
    ),
  },
  {
    key: "growthRate",
    header: "Growth",
    sortable: true,
    width: "10%",
    render: (value) => {
      const growth = value as number | null;
      const isPositive = (growth || 0) >= 0;
      return (
        <div className={`flex items-center gap-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span className="font-medium">{formatPercent(growth)}</span>
        </div>
      );
    },
  },
  {
    key: "healthScore",
    header: "Health",
    sortable: true,
    width: "10%",
    render: (value) => {
      const score = value as number | null;
      const color =
        (score || 0) >= 80 ? "#22c55e" : (score || 0) >= 50 ? "#f59e0b" : "#dc2626";
      return (
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-12 rounded-full bg-white/10 overflow-hidden"
            title={`Health Score: ${score || 0}`}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${score || 0}%`, backgroundColor: color }}
            />
          </div>
          <span className="text-xs text-[#a0a0b0]">{score || 0}</span>
        </div>
      );
    },
  },
  {
    key: "lastCheckIn",
    header: "Last Check-in",
    sortable: true,
    width: "9%",
    render: (value) => (
      <span className="text-[#a0a0b0]">
        {value ? new Date(value).toLocaleDateString() : "-"}
      </span>
    ),
  },
];

// =============================================================================
// Main Page Component
// =============================================================================

export default function PortfolioPage() {
  const toast = useToast();
  const [timeRange, setTimeRange] = useState<"1m" | "3m" | "6m" | "1y" | "all">("1y");
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);

  // Fetch portfolio data
  const {
    metrics,
    companies,
    performance,
    chartData,
    topPerformers,
    worstPerformers,
    isLoading,
    isError,
    error,
    refetch,
  } = usePortfolio({ timeRange });

  // Export functionality
  const { exportCSV, exportJSON, isExporting } = useExport({
    data: selectedCompanies.length > 0 ? selectedCompanies : companies,
    filename: `portfolio-${new Date().toISOString().split("T")[0]}`,
    onSuccess: () => {
      toast.success("Export Complete", "Portfolio data exported successfully");
    },
    onError: (err) => {
      toast.error("Export Failed", err.message);
    },
  });

  // Handle bulk export
  const handleExport = useCallback(
    async (format: "csv" | "json") => {
      if (format === "csv") {
        await exportCSV();
      } else {
        await exportJSON();
      }
    },
    [exportCSV, exportJSON]
  );

  // Bulk actions for DataTable
  const bulkActions: BulkAction<Company>[] = [
    {
      label: "Export CSV",
      icon: <Download className="h-4 w-4 mr-2" />,
      onClick: () => handleExport("csv"),
    },
    {
      label: "Export JSON",
      icon: <Download className="h-4 w-4 mr-2" />,
      onClick: () => handleExport("json"),
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
          </div>
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
          {/* Table Skeleton */}
          <TableSkeleton />
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
            <h1 className="text-3xl font-bold text-white mb-1">Portfolio</h1>
            <p className="text-[#a0a0b0]">
              Track your portfolio companies and their performance
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="flex items-center bg-[#1a1a2e] rounded-lg border border-white/10 p-1">
              {(["1m", "3m", "6m", "1y", "all"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    timeRange === range
                      ? "bg-[#e94560] text-white"
                      : "text-[#a0a0b0] hover:text-white"
                  }`}
                >
                  {range === "all" ? "All Time" : range}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="border-white/10 text-[#a0a0b0] hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            {/* Export Button */}
            <Button
              variant="outline"
              onClick={() => handleExport("csv")}
              disabled={isExporting}
              className="border-white/10 text-[#a0a0b0] hover:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <StatCard
            icon={<Building2 className="h-5 w-5" />}
            label="Portfolio Companies"
            value={metrics?.totalCompanies.toString() || "0"}
            subtext={`${companies.filter((c) => c.status === "ACTIVE").length} active`}
            color="#e94560"
          />
          <StatCard
            icon={<DollarSign className="h-5 w-5" />}
            label="Portfolio Value"
            value={formatAmount(metrics?.totalValue)}
            subtext={`Across ${metrics?.totalDeals || 0} deals`}
            color="#22c55e"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Portfolio Growth"
            value={formatPercent(performance?.totalChangePercent)}
            subtext={`${formatAmount(performance?.totalChange)} change`}
            color={performance?.totalChangePercent && performance.totalChangePercent >= 0 ? "#22c55e" : "#dc2626"}
          />
          <StatCard
            icon={<AlertCircle className="h-5 w-5" />}
            label="Need Attention"
            value={companies.filter((c) => (c.healthScore || 100) < 50).length.toString()}
            subtext="Low health score"
            color="#f59e0b"
          />
        </motion.div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
        >
          {/* Performance Chart */}
          <div className="lg:col-span-2 bg-[#1a1a2e] rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Portfolio Performance</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                  <span className="text-sm text-[#a0a0b0]">Portfolio Value</span>
                </div>
              </div>
            </div>
            {chartData && chartData.length > 0 ? (
              <PortfolioChart data={chartData} />
            ) : (
              <div className="h-64 flex items-center justify-center text-[#6a6a7a]">
                No performance data available
              </div>
            )}
          </div>

          {/* Top/Worst Performers */}
          <div className="bg-[#1a1a2e] rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Top Performers</h2>
            <div className="space-y-3">
              {topPerformers?.slice(0, 5).map((performer, idx) => (
                <div
                  key={performer.companyId}
                  className="flex items-center justify-between p-3 bg-[#0f0f1a] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#6a6a7a] text-sm w-5">{idx + 1}</span>
                    <span className="text-white text-sm font-medium truncate max-w-[120px]">
                      {performer.companyName}
                    </span>
                  </div>
                  <span className="text-green-400 text-sm font-medium">
                    +{performer.changePercent.toFixed(1)}%
                  </span>
                </div>
              ))}
              {(!topPerformers || topPerformers.length === 0) && (
                <div className="text-center text-[#6a6a7a] py-8">
                  No performance data available
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Companies Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-[#1a1a2e] rounded-xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Portfolio Companies</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-white/10 text-[#a0a0b0]">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <ErrorBoundary
              fallback={<ErrorFallback onRetry={refetch} />}
              onError={(error) => {
                console.error("Portfolio table error:", error);
                toast.error("Error", "Something went wrong loading companies");
              }}
            >
              <Suspense fallback={<TableSkeleton />}>
                <DataTable
                  data={companies}
                  columns={getCompanyColumns(toast)}
                  pageSize={10}
                  onSelectionChange={setSelectedCompanies}
                  bulkActions={bulkActions}
                  rowKey="id"
                  emptyState={{
                    title: "No companies found",
                    description: "Your portfolio is empty. Add companies to track their performance.",
                  }}
                />
              </Suspense>
            </ErrorBoundary>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// =============================================================================
// Stat Card Component
// =============================================================================

function StatCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: string;
}) {
  return (
    <div className="bg-[#1a1a2e] rounded-xl p-5 border border-white/10">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {icon}
        </div>
      </div>
      <p className="text-[#a0a0b0] text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-[#6a6a7a]">{subtext}</p>
    </div>
  );
}
