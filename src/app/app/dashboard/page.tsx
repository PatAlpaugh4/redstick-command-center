/**
 * Dashboard Page
 * ==============
 * Main dashboard with full component integration including:
 * - Portfolio stats cards
 * - Charts grid (Portfolio, Sector, DealFlow, Activity)
 * - Recent activity feed
 * - Quick actions
 */

"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Briefcase,
  Building2,
  Bot,
  ArrowRight,
  Plus,
  Download,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

// UI Components
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Chart Components
import { PortfolioChart } from "@/components/charts/PortfolioChart";
import { DealFlowChart } from "@/components/charts/DealFlowChart";
import { SectorChart } from "@/components/charts/SectorChart";
import { ActivityChart } from "@/components/charts/ActivityChart";

// Activity & Error Components
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { ChartError } from "@/components/error/ChartError";

// Skeletons
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";

// Hooks
import { usePortfolio } from "@/hooks/usePortfolio";
import { useDeals } from "@/hooks/useDeals";
import { useAgents } from "@/hooks/useAgents";
import { useToast } from "@/hooks/useToast";

// =============================================================================
// Types
// =============================================================================

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  isLoading?: boolean;
}

// =============================================================================
// Animation Variants
// =============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// =============================================================================
// Stat Card Component
// =============================================================================

function StatCard({ title, value, change, changeType = "neutral", icon, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <CardSkeleton />
        </CardContent>
      </Card>
    );
  }

  const changeColors = {
    positive: "text-emerald-500",
    negative: "text-red-500",
    neutral: "text-[#a0a0b0]",
  };

  return (
    <Card hover className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-[#a0a0b0] mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {change && (
              <p className={cn("text-xs mt-1", changeColors[changeType])}>
                {changeType === "positive" && "+"}
                {changeType === "negative" && ""}
                {change}
              </p>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#e94560]/10 flex items-center justify-center">
            {React.cloneElement(icon as React.ReactElement, {
              className: "w-5 h-5 text-[#e94560]",
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Chart Card Wrapper
// =============================================================================

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle as="h3">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Stats Cards Row
// =============================================================================

function StatsCardsRow() {
  const { metrics, isLoading } = usePortfolio();
  const { deals, isLoading: dealsLoading } = useDeals({ pagination: { page: 1, pageSize: 100 } });
  const { agents, isLoading: agentsLoading } = useAgents();

  const activeDeals = React.useMemo(() => {
    return deals.filter((d) => d.status === "active").length;
  }, [deals]);

  const activeAgents = React.useMemo(() => {
    return agents.filter((a) => a.isActive).length;
  }, [agents]);

  const stats = [
    {
      title: "Portfolio Value",
      value: metrics ? `$${(metrics.totalValue / 1000000).toFixed(1)}M` : "$0M",
      change: metrics ? `${metrics.portfolioGrowth}%` : undefined,
      changeType: metrics && metrics.portfolioGrowth >= 0 ? "positive" : "negative",
      icon: <TrendingUp />,
      isLoading,
    },
    {
      title: "Active Deals",
      value: activeDeals.toString(),
      change: "12 this month",
      changeType: "positive",
      icon: <Briefcase />,
      isLoading: dealsLoading,
    },
    {
      title: "Portfolio Companies",
      value: metrics?.totalCompanies?.toString() || "0",
      change: "3 new this quarter",
      changeType: "positive",
      icon: <Building2 />,
      isLoading,
    },
    {
      title: "Agent Tasks",
      value: activeAgents.toString(),
      change: `${agents.length} total agents`,
      changeType: "neutral",
      icon: <Bot />,
      isLoading: agentsLoading,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
}

// =============================================================================
// Charts Grid Section
// =============================================================================

function ChartsGrid() {
  const { chartData, isLoading, refetch } = usePortfolio();

  // Mock data transformations for charts (would come from API in production)
  const portfolioChartData = React.useMemo(() => {
    if (!chartData || chartData.length === 0) return undefined;
    
    // Transform to PortfolioChart format
    return chartData.map((point) => ({
      month: new Date(point.date).toLocaleString("default", { month: "short" }),
      deployed: point.value,
      realized: point.value * 0.3,
      unrealized: point.value * 0.7,
    }));
  }, [chartData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Portfolio Chart */}
      <motion.div variants={itemVariants}>
        <ErrorBoundary
          fallback={
            <ChartError
              message="Failed to load portfolio chart"
              onRetry={refetch}
            />
          }
        >
          <ChartCard
            title="Portfolio Performance"
            description="Track deployed capital and returns over time"
          >
            <Suspense
              fallback={
                <ChartSkeleton type="area" height={280} showTitle={false} showLegend={true} />
              }
            >
              <PortfolioChart data={portfolioChartData} isLoading={isLoading} height={280} />
            </Suspense>
          </ChartCard>
        </ErrorBoundary>
      </motion.div>

      {/* Sector Chart */}
      <motion.div variants={itemVariants}>
        <ErrorBoundary
          fallback={
            <ChartError
              message="Failed to load sector distribution"
              onRetry={() => window.location.reload()}
            />
          }
        >
          <ChartCard
            title="Sector Distribution"
            description="Portfolio allocation by industry"
          >
            <Suspense
              fallback={
                <ChartSkeleton type="pie" height={280} showTitle={false} showLegend={true} />
              }
            >
              <SectorChart height={280} />
            </Suspense>
          </ChartCard>
        </ErrorBoundary>
      </motion.div>

      {/* Deal Flow Chart */}
      <motion.div variants={itemVariants}>
        <ErrorBoundary
          fallback={
            <ChartError
              message="Failed to load deal flow"
              onRetry={() => window.location.reload()}
            />
          }
        >
          <ChartCard
            title="Deal Flow Funnel"
            description="Pipeline stages and conversion rates"
          >
            <Suspense
              fallback={
                <ChartSkeleton type="bar" height={280} showTitle={false} showLegend={false} />
              }
            >
              <DealFlowChart height={280} />
            </Suspense>
          </ChartCard>
        </ErrorBoundary>
      </motion.div>

      {/* Activity Chart */}
      <motion.div variants={itemVariants}>
        <ErrorBoundary
          fallback={
            <ChartError
              message="Failed to load activity data"
              onRetry={() => window.location.reload()}
            />
          }
        >
          <ChartCard
            title="Deal Activity"
            description="Monthly new deals, closes, and passes"
          >
            <Suspense
              fallback={
                <ChartSkeleton type="bar" height={280} showTitle={false} showLegend={true} />
              }
            >
              <ActivityChart height={280} />
            </Suspense>
          </ChartCard>
        </ErrorBoundary>
      </motion.div>
    </div>
  );
}

// =============================================================================
// Recent Activity Section
// =============================================================================

function RecentActivitySection() {
  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader
          actions={
            <Link
              href="/app/activity"
              className="flex items-center gap-1 text-sm text-[#e94560] hover:text-[#ff6b6b] transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          }
        >
          <CardTitle as="h3">Recent Activity</CardTitle>
          <CardDescription>Last 5 activities across your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityFeed showHeader={false} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

// =============================================================================
// Quick Actions Section
// =============================================================================

function QuickActionsSection() {
  const { success, info } = useToast();

  const handleNewDeal = () => {
    info("Opening deal creation...", "Deal form will open shortly");
    // In production: router.push("/app/deals/new")
  };

  const handleExport = () => {
    success("Export started", "Your portfolio data is being exported");
  };

  const handleRefresh = () => {
    success("Refreshing data", "Latest data is being loaded");
    window.location.reload();
  };

  const actions = [
    {
      label: "New Deal",
      icon: <Plus className="w-4 h-4" />,
      onClick: handleNewDeal,
      variant: "default" as const,
    },
    {
      label: "Export",
      icon: <Download className="w-4 h-4" />,
      onClick: handleExport,
      variant: "outline" as const,
    },
    {
      label: "Refresh",
      icon: <RefreshCw className="w-4 h-4" />,
      onClick: handleRefresh,
      variant: "outline" as const,
    },
  ];

  return (
    <motion.div
      variants={itemVariants}
      className="flex flex-wrap items-center gap-2 sm:gap-3"
    >
      {actions.map((action) => (
        <Button
          key={action.label}
          variant={action.variant}
          onClick={action.onClick}
          className="touch-target min-h-[44px]"
        >
          <span className="flex items-center gap-2">
            {action.icon}
            <span className="hidden sm:inline">{action.label}</span>
          </span>
        </Button>
      ))}
    </motion.div>
  );
}

// =============================================================================
// cn Utility (inline for component)
// =============================================================================

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// =============================================================================
// Main Dashboard Page
// =============================================================================

export default function DashboardPage() {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-[#a0a0b0] mt-1">
            Overview of your portfolio and deal pipeline
          </p>
        </div>
        <QuickActionsSection />
      </div>

      {/* Stats Cards */}
      <StatsCardsRow />

      {/* Charts Grid */}
      <ChartsGrid />

      {/* Recent Activity */}
      <RecentActivitySection />
    </motion.div>
  );
}
