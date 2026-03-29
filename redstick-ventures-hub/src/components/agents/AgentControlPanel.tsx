"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ANIMATION } from "@/lib/animations";
import {
  Play,
  Square,
  Settings,
  Terminal,
  Clock,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Cpu,
  Zap,
  BarChart3,
  Trash2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  type: string;
  status: "ACTIVE" | "INACTIVE" | "ERROR" | "RUNNING" | "MAINTENANCE";
  config: Record<string, any>;
  lastRun: string | null;
  successRate: number;
  totalRuns: number;
  tokenUsage: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "SUCCESS";
  message: string;
  agentId: string;
}

interface RunHistory {
  id: string;
  agentId: string;
  startedAt: string;
  completedAt: string | null;
  duration: number;
  tokensUsed: number;
  status: "success" | "failed" | "cancelled";
  output?: string;
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Deal Screener",
    description: "Automatically screens inbound deals against investment criteria",
    type: "SCREENING",
    status: "ACTIVE",
    config: { threshold: 0.7, autoRun: true },
    lastRun: "2024-01-15T10:30:00Z",
    successRate: 94,
    totalRuns: 1247,
    tokenUsage: 456000,
  },
  {
    id: "2",
    name: "Market Intel",
    description: "Monitors market trends and competitor movements",
    type: "RESEARCH",
    status: "RUNNING",
    config: { frequency: "hourly", sectors: ["agtech", "food"] },
    lastRun: "2024-01-15T09:15:00Z",
    successRate: 88,
    totalRuns: 3420,
    tokenUsage: 890000,
  },
  {
    id: "3",
    name: "Portfolio Monitor",
    description: "Tracks portfolio company metrics and alerts on anomalies",
    type: "PORTFOLIO",
    status: "INACTIVE",
    config: { checkInterval: 30, metrics: ["arr", "burn", "growth"] },
    lastRun: "2024-01-14T08:45:00Z",
    successRate: 96,
    totalRuns: 876,
    tokenUsage: 234000,
  },
  {
    id: "4",
    name: "Due Diligence Assistant",
    description: "Assists with market sizing and competitor analysis",
    type: "DILIGENCE",
    status: "ERROR",
    config: { depth: "comprehensive", autoReport: true },
    lastRun: "2024-01-15T07:20:00Z",
    successRate: 76,
    totalRuns: 156,
    tokenUsage: 89000,
  },
];

const mockLogs: LogEntry[] = [
  { id: "1", timestamp: "2024-01-15T10:30:15Z", level: "INFO", message: "Starting batch analysis of 24 inbound deals", agentId: "1" },
  { id: "2", timestamp: "2024-01-15T10:30:45Z", level: "SUCCESS", message: "Processed deal #1234: AquaCulture Labs - Score 8.5/10", agentId: "1" },
  { id: "3", timestamp: "2024-01-15T10:31:12Z", level: "INFO", message: "Processing deal #1235: GreenField Ag", agentId: "1" },
  { id: "4", timestamp: "2024-01-15T10:31:30Z", level: "WARN", message: "Score 5.2/10 - Below threshold, flagged for review", agentId: "1" },
  { id: "5", timestamp: "2024-01-15T09:15:20Z", level: "INFO", message: "Fetching latest agtech news from 12 sources", agentId: "2" },
  { id: "6", timestamp: "2024-01-15T09:16:45Z", level: "SUCCESS", message: "Generated market summary report", agentId: "2" },
  { id: "7", timestamp: "2024-01-15T07:20:10Z", level: "ERROR", message: "API rate limit exceeded for Crunchbase", agentId: "4" },
];

const mockRunHistory: RunHistory[] = [
  { id: "run_001", agentId: "1", startedAt: "2024-01-15T10:30:00Z", completedAt: "2024-01-15T10:32:15Z", duration: 135, tokensUsed: 2340, status: "success" },
  { id: "run_002", agentId: "2", startedAt: "2024-01-15T09:15:00Z", completedAt: null, duration: 0, tokensUsed: 890, status: "success" },
  { id: "run_003", agentId: "4", startedAt: "2024-01-15T07:20:00Z", completedAt: "2024-01-15T07:22:30Z", duration: 150, tokensUsed: 1200, status: "failed" },
];

const logColors = {
  INFO: "text-blue-400",
  WARN: "text-amber-400",
  ERROR: "text-red-400",
  SUCCESS: "text-emerald-400",
};

const statusColors = {
  ACTIVE: "bg-emerald-500",
  INACTIVE: "bg-gray-500",
  ERROR: "bg-red-500",
  RUNNING: "bg-blue-500",
  MAINTENANCE: "bg-amber-500",
};

export default function AgentControlPanel() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [activeTab, setActiveTab] = useState<"logs" | "config" | "history">("logs");
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedRun, setSelectedRun] = useState<RunHistory | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Simulate log streaming
  useEffect(() => {
    if (!isSimulating) return;
    
    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        level: Math.random() > 0.8 ? "WARN" : "INFO",
        message: `Processing batch ${Math.floor(Math.random() * 100)}...`,
        agentId: selectedAgent?.id || "1",
      };
      setLogs((prev) => [...prev.slice(-50), newLog]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, selectedAgent]);

  const handleToggleAgent = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId
          ? { ...agent, status: agent.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
          : agent
      )
    );
  };

  const handleRunAgent = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId ? { ...agent, status: "RUNNING" } : agent
      )
    );
    setIsSimulating(true);
    
    // Simulate run completion
    setTimeout(() => {
      setAgents((prev) =>
        prev.map((agent) =>
          agent.id === agentId
            ? { ...agent, status: "ACTIVE", lastRun: new Date().toISOString(), totalRuns: agent.totalRuns + 1 }
            : agent
        )
      );
      setIsSimulating(false);
    }, 5000);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const selectedAgentLogs = logs.filter((log) => log.agentId === selectedAgent?.id);
  const selectedAgentRuns = mockRunHistory.filter((run) => run.agentId === selectedAgent?.id);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Agent List */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">AI Agents</h3>
          <Badge variant="primary">{agents.filter((a) => a.status === "ACTIVE" || a.status === "RUNNING").length} Active</Badge>
        </div>

        <div className="space-y-3">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-200 ${
                  selectedAgent?.id === agent.id ? "ring-2 ring-accent" : "hover:border-accent/30"
                }`}
                onClick={() => setSelectedAgent(agent)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Cpu className="w-5 h-5 text-accent" />
                        </div>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface ${statusColors[agent.status]} ${
                            agent.status === "RUNNING" || agent.status === "ACTIVE" ? "animate-pulse" : ""
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary">{agent.name}</h4>
                        <p className="text-xs text-text-secondary">{agent.type}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {agent.status === "RUNNING" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAgent(agent.id);
                          }}
                          className="p-2 hover:bg-surface-elevated rounded-lg text-error transition-colors"
                        >
                          <Square className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRunAgent(agent.id);
                          }}
                          className="p-2 hover:bg-surface-elevated rounded-lg text-success transition-colors"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-surface-elevated rounded-lg p-2">
                      <p className="text-xs text-text-tertiary">Success</p>
                      <p className={`text-sm font-semibold ${agent.successRate >= 90 ? "text-success" : agent.successRate >= 70 ? "text-warning" : "text-error"}`}>
                        {agent.successRate}%
                      </p>
                    </div>
                    <div className="bg-surface-elevated rounded-lg p-2">
                      <p className="text-xs text-text-tertiary">Runs</p>
                      <p className="text-sm font-semibold text-text-primary">{agent.totalRuns.toLocaleString()}</p>
                    </div>
                    <div className="bg-surface-elevated rounded-lg p-2">
                      <p className="text-xs text-text-tertiary">Tokens</p>
                      <p className="text-sm font-semibold text-text-primary">{(agent.tokenUsage / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Agent Detail Panel */}
      <div className="lg:col-span-2">
        {selectedAgent ? (
          <Card className="h-full">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedAgent.name}
                    <Badge
                      variant={
                        selectedAgent.status === "ACTIVE" || selectedAgent.status === "RUNNING"
                          ? "success"
                          : selectedAgent.status === "ERROR"
                          ? "error"
                          : "default"
                      }
                    >
                      {selectedAgent.status}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-text-secondary mt-1">{selectedAgent.description}</p>
                </div>
                <div className="flex gap-2">
                  {selectedAgent.status === "RUNNING" ? (
                    <Button variant="danger" onClick={() => handleToggleAgent(selectedAgent.id)}>
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  ) : (
                    <Button onClick={() => handleRunAgent(selectedAgent.id)}>
                      <Play className="w-4 h-4 mr-2" />
                      Run Now
                    </Button>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mt-4">
                {(["logs", "config", "history"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-accent text-accent"
                        : "border-transparent text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Logs Tab */}
              {activeTab === "logs" && (
                <div className="h-96 flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-text-tertiary" />
                      <span className="text-sm text-text-secondary">Live Logs</span>
                      {isSimulating && (
                        <span className="flex items-center gap-1 text-xs text-accent">
                          <Activity className="w-3 h-3 animate-pulse" />
                          Streaming...
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleClearLogs}
                      className="p-2 hover:bg-surface-elevated rounded-lg text-text-tertiary hover:text-error transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2">
                    {selectedAgentLogs.length === 0 ? (
                      <p className="text-text-tertiary text-center py-8">No logs available</p>
                    ) : (
                      selectedAgentLogs.map((log, index) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex gap-3"
                        >
                          <span className="text-text-tertiary shrink-0">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          <span className={`font-semibold shrink-0 ${logColors[log.level]}`}>
                            {log.level}
                          </span>
                          <span className="text-text-secondary">{log.message}</span>
                        </motion.div>
                      ))
                    )}
                    <div ref={logsEndRef} />
                  </div>
                </div>
              )}

              {/* Config Tab */}
              {activeTab === "config" && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-text-primary">Auto-Start</h4>
                      <p className="text-sm text-text-secondary">Start agent automatically on system boot</p>
                    </div>
                    <button
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        selectedAgent.config.autoRun ? "bg-accent" : "bg-surface-elevated"
                      }`}
                    >
                      <motion.div
                        animate={{ x: selectedAgent.config.autoRun ? 24 : 2 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-medium text-text-primary mb-2">Confidence Threshold</h4>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue={selectedAgent.config.threshold * 100}
                      className="w-full accent-accent"
                    />
                    <div className="flex justify-between text-xs text-text-tertiary mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-text-primary mb-2">Monitored Sectors</h4>
                    <div className="flex flex-wrap gap-2">
                      {["AgTech", "FoodTech", "Sustainability", "Supply Chain", "AI/ML"].map((sector) => (
                        <button
                          key={sector}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedAgent.config.sectors?.includes(sector.toLowerCase())
                              ? "bg-accent text-white"
                              : "bg-surface-elevated text-text-secondary hover:bg-surface"
                          }`}
                        >
                          {sector}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              )}

              {/* History Tab */}
              {activeTab === "history" && (
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-text-tertiary uppercase">
                        <th className="pb-3">Run ID</th>
                        <th className="pb-3">Started</th>
                        <th className="pb-3">Duration</th>
                        <th className="pb-3">Tokens</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3"></th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {selectedAgentRuns.map((run) => (
                        <tr key={run.id} className="border-t border-border">
                          <td className="py-3 font-mono text-text-secondary">{run.id}</td>
                          <td className="py-3 text-text-secondary">
                            {new Date(run.startedAt).toLocaleString()}
                          </td>
                          <td className="py-3 text-text-secondary">{run.duration}s</td>
                          <td className="py-3 text-text-secondary">{run.tokensUsed.toLocaleString()}</td>
                          <td className="py-3">
                            <Badge
                              variant={
                                run.status === "success"
                                  ? "success"
                                  : run.status === "failed"
                                  ? "error"
                                  : "warning"
                              }
                            >
                              {run.status}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => setSelectedRun(run)}
                              className="text-accent hover:underline text-sm"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <div className="text-center">
              <Cpu className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
              <p className="text-text-secondary">Select an agent to view details</p>
            </div>
          </Card>
        )}
      </div>

      {/* Run Details Modal */}
      <AnimatePresence>
        {selectedRun && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedRun(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface rounded-xl border border-border max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold text-text-primary">Run Details: {selectedRun.id}</h3>
                <button
                  onClick={() => setSelectedRun(null)}
                  className="p-2 hover:bg-surface-elevated rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-elevated rounded-lg p-3">
                    <p className="text-xs text-text-tertiary">Status</p>
                    <Badge
                      variant={
                        selectedRun.status === "success"
                          ? "success"
                          : selectedRun.status === "failed"
                          ? "error"
                          : "warning"
                      }
                    >
                      {selectedRun.status}
                    </Badge>
                  </div>
                  <div className="bg-surface-elevated rounded-lg p-3">
                    <p className="text-xs text-text-tertiary">Duration</p>
                    <p className="font-semibold text-text-primary">{selectedRun.duration}s</p>
                  </div>
                  <div className="bg-surface-elevated rounded-lg p-3">
                    <p className="text-xs text-text-tertiary">Tokens Used</p>
                    <p className="font-semibold text-text-primary">{selectedRun.tokensUsed.toLocaleString()}</p>
                  </div>
                  <div className="bg-surface-elevated rounded-lg p-3">
                    <p className="text-xs text-text-tertiary">Started</p>
                    <p className="font-semibold text-text-primary">
                      {new Date(selectedRun.startedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary mb-2">Output</p>
                  <div className="bg-background rounded-lg p-4 font-mono text-sm text-text-secondary max-h-48 overflow-y-auto">
                    {selectedRun.status === "success" ? (
                      <p>Successfully processed 42 deals. 8 matched criteria and were flagged for review.</p>
                    ) : (
                      <p className="text-error">Error: API rate limit exceeded. Retry after 60 seconds.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
