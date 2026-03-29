"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Play,
  Pause,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  RefreshCw,
  Plus,
  Settings,
  Activity,
} from "lucide-react";

import { ErrorBoundary } from "@/components/error";
import { ErrorFallback, ApiError } from "@/components/error";
import { CardSkeleton } from "@/components/skeletons";
import AgentControlPanel from "@/components/agents/AgentControlPanel";
import { Button } from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import { useAgents } from "@/hooks/useAgents";
import type { Agent, AgentStatus } from "@/types";

// =============================================================================
// Helper Functions
// =============================================================================

const getStatusIcon = (status: AgentStatus) => {
  switch (status) {
    case "ACTIVE":
    case "active":
      return <CheckCircle2 className="h-5 w-5 text-green-400" />;
    case "RUNNING":
    case "running":
      return <Zap className="h-5 w-5 text-blue-400" />;
    case "ERROR":
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-400" />;
    case "INACTIVE":
    case "inactive":
    case "paused":
    default:
      return <Pause className="h-5 w-5 text-gray-400" />;
  }
};

const getStatusColor = (status: AgentStatus): string => {
  switch (status) {
    case "ACTIVE":
    case "active":
      return "#22c55e";
    case "RUNNING":
    case "running":
      return "#3b82f6";
    case "ERROR":
    case "error":
      return "#dc2626";
    case "INACTIVE":
    case "inactive":
    case "paused":
    default:
      return "#6b7280";
  }
};

const getStatusLabel = (status: AgentStatus): string => {
  switch (status) {
    case "ACTIVE":
    case "active":
      return "Active";
    case "RUNNING":
    case "running":
      return "Running";
    case "ERROR":
    case "error":
      return "Error";
    case "INACTIVE":
    case "inactive":
      return "Inactive";
    case "paused":
      return "Paused";
    case "MAINTENANCE":
      return "Maintenance";
    default:
      return status;
  }
};

// =============================================================================
// Main Page Component
// =============================================================================

export default function AgentsPage() {
  const toast = useToast();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // Fetch agents data
  const {
    agents,
    isLoading,
    isError,
    error,
    refetch,
    toggleActive,
    updateAgent,
  } = useAgents();

  // Calculate stats
  const stats = {
    total: agents.length,
    active: agents.filter((a) => a.status === "ACTIVE" || a.status === "active").length,
    running: agents.filter((a) => a.status === "RUNNING" || a.status === "running").length,
    error: agents.filter((a) => a.status === "ERROR" || a.status === "error").length,
    totalRuns: agents.reduce((sum, a) => sum + (a.totalRuns || 0), 0),
    avgSuccessRate:
      agents.length > 0
        ? Math.round(
            agents.reduce((sum, a) => sum + (a.successRate || 0), 0) / agents.length
          )
        : 0,
  };

  // Handle agent toggle
  const handleToggleAgent = async (agent: Agent) => {
    try {
      const newStatus = agent.status === "ACTIVE" || agent.status === "active" ? false : true;
      await toggleActive.mutateAsync({ id: agent.id, isActive: newStatus });
      toast.success(
        "Agent Updated",
        `${agent.name} is now ${newStatus ? "active" : "inactive"}`
      );
    } catch (err) {
      toast.error(
        "Update Failed",
        err instanceof Error ? err.message : "Failed to update agent status"
      );
    }
  };

  // Handle agent run
  const handleRunAgent = async (agent: Agent) => {
    toast.info("Coming Soon", `Running ${agent.name} will be available soon`);
  };

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
          {/* Control Panel Skeleton */}
          <div className="h-[600px] bg-white/5 rounded-xl animate-pulse" />
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
            <h1 className="text-3xl font-bold text-white mb-1">AI Agents</h1>
            <p className="text-[#a0a0b0]">
              Manage and monitor your AI-powered investment agents
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="border-white/10 text-[#a0a0b0] hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            {/* Add Agent Button */}
            <Button
              className="bg-[#e94560] hover:bg-[#d63d56] text-white"
              onClick={() => {
                toast.info("Coming Soon", "Add agent functionality will be available soon");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Agent
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
            icon={<Bot className="h-5 w-5" />}
            label="Total Agents"
            value={stats.total.toString()}
            subtext={`${stats.active} active, ${stats.running} running`}
            color="#e94560"
          />
          <StatCard
            icon={<Activity className="h-5 w-5" />}
            label="Total Runs"
            value={stats.totalRuns.toLocaleString()}
            subtext="All time executions"
            color="#3b82f6"
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Success Rate"
            value={`${stats.avgSuccessRate}%`}
            subtext="Average across all agents"
            color="#22c55e"
          />
          <StatCard
            icon={stats.error > 0 ? <AlertCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            label={stats.error > 0 ? "Needs Attention" : "All Systems Normal"}
            value={stats.error > 0 ? stats.error.toString() : "0"}
            subtext={stats.error > 0 ? "agents with errors" : "no issues detected"}
            color={stats.error > 0 ? "#dc2626" : "#22c55e"}
          />
        </motion.div>

        {/* Agent Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ErrorBoundary
            fallback={<ErrorFallback onRetry={refetch} />}
            onError={(error) => {
              console.error("Agent control panel error:", error);
              toast.error("Error", "Something went wrong loading agents");
            }}
          >
            <Suspense
              fallback={
                <div className="h-[600px] bg-[#1a1a2e] rounded-xl border border-white/10 p-6">
                  <div className="h-full bg-white/5 rounded animate-pulse" />
                </div>
              }
            >
              <AgentControlPanel />
            </Suspense>
          </ErrorBoundary>
        </motion.div>

        {/* Agents List (Quick Overview) - Responsive Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 container-query"
        >
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`bg-[#1a1a2e] rounded-xl p-5 border transition-all cursor-pointer hover:border-[#e94560]/30 ${
                selectedAgentId === agent.id
                  ? "border-[#e94560] ring-1 ring-[#e94560]/20"
                  : "border-white/10"
              }`}
              onClick={() => setSelectedAgentId(agent.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${getStatusColor(agent.status)}20` }}
                >
                  <Bot
                    className="h-5 w-5"
                    style={{ color: getStatusColor(agent.status) }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(agent.status)}
                  <span
                    className="text-xs font-medium"
                    style={{ color: getStatusColor(agent.status) }}
                  >
                    {getStatusLabel(agent.status)}
                  </span>
                </div>
              </div>

              <h3 className="text-white font-semibold mb-1">{agent.name}</h3>
              <p className="text-[#6a6a7a] text-sm mb-4 line-clamp-2">
                {agent.description || "No description available"}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[#6a6a7a] text-xs mb-0.5">Total Runs</p>
                  <p className="text-white font-medium">{(agent.totalRuns || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[#6a6a7a] text-xs mb-0.5">Success Rate</p>
                  <p className="text-white font-medium">{agent.successRate || 0}%</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/10 text-[#a0a0b0] hover:text-white touch-target min-h-[44px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleAgent(agent);
                  }}
                  disabled={toggleActive.isPending}
                >
                  {agent.status === "ACTIVE" || agent.status === "active" ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Start</span>
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/10 text-[#a0a0b0] hover:text-white touch-target min-h-[44px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRunAgent(agent);
                  }}
                >
                  <Zap className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Run Now</span>
                </Button>
              </div>
            </motion.div>
          ))}
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
