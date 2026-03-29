"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Terminal,
  Clock,
  Zap,
  TrendingUp,
  Filter,
  Plus
} from "lucide-react";
import { ANIMATION } from "@/lib/animations";

// Mock agents data
const agentsData = [
  {
    id: "1",
    name: "Deal Screener",
    description: "Automatically screens inbound deals against investment criteria",
    type: "SCREENING",
    status: "ACTIVE",
    lastRun: "2 min ago",
    successRate: 94,
    totalRuns: 1247,
    tokenUsage: 456000,
    tools: ["web_search", "document_parser", "crm_api"],
    config: { autoRun: true, threshold: 0.7 },
  },
  {
    id: "2",
    name: "Market Intel",
    description: "Monitors market trends, competitor movements, and industry news",
    type: "RESEARCH",
    status: "ACTIVE",
    lastRun: "5 min ago",
    successRate: 98,
    totalRuns: 3420,
    tokenUsage: 890000,
    tools: ["web_search", "news_api", "data_source"],
    config: { frequency: "hourly", sectors: ["agtech", "food"] },
  },
  {
    id: "3",
    name: "Portfolio Monitor",
    description: "Tracks portfolio company metrics and alerts on anomalies",
    type: "PORTFOLIO",
    status: "ACTIVE",
    lastRun: "15 min ago",
    successRate: 99,
    totalRuns: 876,
    tokenUsage: 234000,
    tools: ["database_query", "alert_system", "reporting"],
    config: { checkInterval: 30, metrics: ["arr", "burn", "growth"] },
  },
  {
    id: "4",
    name: "Outreach Assistant",
    description: "Drafts personalized outreach emails to potential founders",
    type: "OUTREACH",
    status: "INACTIVE",
    lastRun: "2 hours ago",
    successRate: 87,
    totalRuns: 156,
    tokenUsage: 89000,
    tools: ["email_api", "crm_api", "template_engine"],
    config: { tone: "professional", maxPerDay: 10 },
  },
  {
    id: "5",
    name: "Due Diligence",
    description: "Assists with market sizing, competitor analysis, and reference checks",
    type: "DILIGENCE",
    status: "ACTIVE",
    lastRun: "1 hour ago",
    successRate: 92,
    totalRuns: 89,
    tokenUsage: 567000,
    tools: ["web_search", "database_query", "document_parser", "analytics"],
    config: { depth: "comprehensive", autoReport: true },
  },
  {
    id: "6",
    name: "LP Reporter",
    description: "Generates quarterly LP reports with portfolio performance",
    type: "REPORTING",
    status: "MAINTENANCE",
    lastRun: "3 days ago",
    successRate: 100,
    totalRuns: 12,
    tokenUsage: 123000,
    tools: ["database_query", "chart_generator", "document_writer"],
    config: { format: "pdf", includeCharts: true },
  },
];

const agentRuns = [
  { id: "run_001", agent: "Deal Screener", status: "COMPLETED", duration: "45s", tokens: 2340, time: "2 min ago" },
  { id: "run_002", agent: "Market Intel", status: "RUNNING", duration: "12s", tokens: 890, time: "5 min ago" },
  { id: "run_003", agent: "Portfolio Monitor", status: "COMPLETED", duration: "23s", tokens: 1200, time: "15 min ago" },
  { id: "run_004", agent: "Due Diligence", status: "FAILED", duration: "2m 15s", tokens: 5600, time: "1 hour ago" },
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"agents" | "runs" | "logs">("agents");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "success";
      case "INACTIVE": return "default";
      case "ERROR": return "error";
      case "MAINTENANCE": return "warning";
      default: return "default";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h2 font-bold text-text-primary">AI Agents</h2>
          <p className="text-body text-text-secondary">Manage and monitor your AI workforce</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="btn-hover flex items-center gap-2 px-6 py-3 bg-accent text-white font-medium rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Create Agent
        </motion.button>
      </div>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: ANIMATION.easing.default }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small text-text-secondary">Active Agents</p>
                <p className="text-h3 font-bold text-text-primary mt-1">4</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small text-text-secondary">Total Runs Today</p>
                <p className="text-h3 font-bold text-text-primary mt-1">1,247</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small text-text-secondary">Success Rate</p>
                <p className="text-h3 font-bold text-text-primary mt-1">94.2%</p>
              </div>
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small text-text-secondary">Token Usage</p>
                <p className="text-h3 font-bold text-text-primary mt-1">2.4M</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Terminal className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        {(["agents", "runs", "logs"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-small font-medium border-b-2 transition-colors duration-200 ${
              activeTab === tab
                ? "border-accent text-accent"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Agents Grid */}
      {activeTab === "agents" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {agentsData.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.08,
                ease: ANIMATION.easing.default 
              }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 ${
                  selectedAgent === agent.id ? "ring-2 ring-accent" : ""
                }`}
                onClick={() => setSelectedAgent(agent.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary">{agent.name}</h3>
                        <p className="text-xs text-text-tertiary">{agent.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(agent.status)}>{agent.status}</Badge>
                      {agent.status === "ACTIVE" && (
                        <span className="w-2 h-2 bg-success rounded-full agent-pulse" />
                      )}
                    </div>
                  </div>

                  <p className="text-small text-text-secondary mb-4 line-clamp-2">
                    {agent.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-text-tertiary">Success Rate</p>
                      <p className="text-lg font-semibold text-text-primary">{agent.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-tertiary">Total Runs</p>
                      <p className="text-lg font-semibold text-text-primary">{agent.totalRuns.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-text-tertiary">
                      <Clock className="w-3 h-3" />
                      {agent.lastRun}
                    </div>
                    <div className="flex gap-2">
                      {agent.status === "ACTIVE" ? (
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-surface-elevated rounded-lg transition-colors duration-200"
                        >
                          <Pause className="w-4 h-4 text-text-secondary" />
                        </motion.button>
                      ) : (
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-surface-elevated rounded-lg transition-colors duration-200"
                        >
                          <Play className="w-4 h-4 text-success" />
                        </motion.button>
                      )}
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-surface-elevated rounded-lg transition-colors duration-200"
                      >
                        <Settings className="w-4 h-4 text-text-secondary" />
                      </motion.button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Runs Table */}
      {activeTab === "runs" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Runs</CardTitle>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 text-small text-text-secondary border border-border rounded-lg hover:bg-surface-elevated transition-colors duration-200">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  <th className="pb-3">Run ID</th>
                  <th className="pb-3">Agent</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Tokens</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody className="text-small">
                {agentRuns.map((run, index) => (
                  <motion.tr 
                    key={run.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      ease: ANIMATION.easing.default 
                    }}
                    className="border-t border-border"
                  >
                    <td className="py-4 font-mono text-text-secondary">{run.id}</td>
                    <td className="py-4 text-text-primary">{run.agent}</td>
                    <td className="py-4">
                      <Badge 
                        variant={
                          run.status === "COMPLETED" ? "success" :
                          run.status === "FAILED" ? "error" : "info"
                        }
                      >
                        {run.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-text-secondary">{run.duration}</td>
                    <td className="py-4 text-text-secondary">{run.tokens.toLocaleString()}</td>
                    <td className="py-4 text-text-tertiary">{run.time}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Logs View */}
      {activeTab === "logs" && (
        <Card>
          <CardHeader>
            <CardTitle>Agent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-background rounded-lg p-4 font-mono text-small space-y-2 max-h-96 overflow-y-auto">
              <div className="text-text-tertiary">[2024-01-15 09:23:45] Deal Screener: Starting batch analysis...</div>
              <div className="text-text-secondary">[2024-01-15 09:23:46] Deal Screener: Processing deal #1234: AquaCulture Labs</div>
              <div className="text-success">[2024-01-15 09:23:47] Deal Screener: Score 8.5/10 - Passed initial screening</div>
              <div className="text-text-secondary">[2024-01-15 09:23:48] Deal Screener: Processing deal #1235: GreenField Ag</div>
              <div className="text-warning">[2024-01-15 09:23:49] Deal Screener: Score 5.2/10 - Below threshold</div>
              <div className="text-text-tertiary">[2024-01-15 09:24:01] Market Intel: Fetching latest agtech news...</div>
              <div className="text-text-secondary">[2024-01-15 09:24:02] Market Intel: Found 12 relevant articles</div>
              <div className="text-info">[2024-01-15 09:24:15] Market Intel: Generated summary for team</div>
              <div className="text-text-tertiary">[2024-01-15 09:30:00] Portfolio Monitor: Running daily check...</div>
              <div className="text-success">[2024-01-15 09:30:15] Portfolio Monitor: All metrics within expected range</div>
              <div className="text-warning">[2024-01-15 09:30:16] Portfolio Monitor: Alert: VerticalHarvest burn rate +15%</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
