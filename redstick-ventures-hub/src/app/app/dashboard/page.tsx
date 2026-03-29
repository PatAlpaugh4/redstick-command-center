"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  TrendingUp,
  Briefcase,
  Users,
  Bot,
  ArrowUpRight,
  Clock,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { ANIMATION } from "@/lib/animations";

// Mock data
const portfolioStats = {
  companies: 12,
  portfolioValue: "$47.2M",
  deployed: "$23.1M",
  multiple: "2.04x",
  irr: "31%",
  activeDeals: 8,
};

const recentDeals = [
  {
    id: "1",
    company: "AquaCulture Labs",
    stage: "Series A",
    amount: "$4.2M",
    status: "DUE_DILIGENCE",
    lead: "Sarah Chen",
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    company: "FarmGrid Analytics",
    stage: "Seed",
    amount: "$1.8M",
    status: "IC_REVIEW",
    lead: "Marcus Johnson",
    updatedAt: "5 hours ago",
  },
  {
    id: "3",
    company: "VerticalHarvest",
    stage: "Series B",
    amount: "$12M",
    status: "TERM_SHEET",
    lead: "Sarah Chen",
    updatedAt: "1 day ago",
  },
];

const agentAlerts = [
  {
    id: "1",
    agent: "Deal Screener",
    message: "New deal matches investment criteria: FoodTech Co",
    severity: "info",
    time: "10 min ago",
  },
  {
    id: "2",
    agent: "Portfolio Monitor",
    message: "AquaCulture Labs exceeded quarterly revenue target",
    severity: "success",
    time: "2 hours ago",
  },
  {
    id: "3",
    agent: "Market Intel",
    message: "Competitor funding alert: $50M Series C in vertical farming",
    severity: "warning",
    time: "4 hours ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: ANIMATION.easing.default }}
      >
        <h2 className="text-h2 font-bold text-text-primary">
          Welcome back, Sarah
        </h2>
        <p className="text-body text-text-secondary mt-1">
          Here&apos;s what&apos;s happening at Redstick today
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: ANIMATION.easing.default }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small text-text-secondary">Portfolio Value</p>
                <p className="text-h3 font-bold text-text-primary mt-1">
                  {portfolioStats.portfolioValue}
                </p>
                <p className="text-xs text-success flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" />
                  {portfolioStats.irr} IRR
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small text-text-secondary">Active Deals</p>
                <p className="text-h3 font-bold text-text-primary mt-1">
                  {portfolioStats.activeDeals}
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  3 in IC review
                </p>
              </div>
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small text-text-secondary">Portfolio Co&apos;s</p>
                <p className="text-h3 font-bold text-text-primary mt-1">
                  {portfolioStats.companies}
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  2 new this quarter
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small text-text-secondary">Agent Tasks</p>
                <p className="text-h3 font-bold text-text-primary mt-1">24</p>
                <p className="text-xs text-text-tertiary mt-1">
                  3 pending review
                </p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Deals & Agent Alerts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: ANIMATION.easing.default }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Deals</CardTitle>
              <Link
                href="/app/pipeline"
                className="text-small text-accent hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentDeals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    className="flex items-center justify-between p-4 hover:bg-surface-elevated/50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-surface-elevated rounded-lg flex items-center justify-center">
                        <span className="font-semibold text-accent">
                          {deal.company.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">
                          {deal.company}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {deal.stage} • {deal.amount}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        deal.status === "TERM_SHEET"
                          ? "success"
                          : deal.status === "DUE_DILIGENCE"
                          ? "info"
                          : "warning"
                      }
                    >
                      {deal.status.replace("_", " ")}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: ANIMATION.easing.default }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Agent Alerts</CardTitle>
              <Link
                href="/app/agents"
                className="text-small text-accent hover:underline"
              >
                Manage agents
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {agentAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    className="flex items-start gap-4 p-4 hover:bg-surface-elevated/50 transition-colors duration-200"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        alert.severity === "success"
                          ? "bg-success"
                          : alert.severity === "warning"
                          ? "bg-warning"
                          : "bg-info"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-small font-medium text-text-primary">
                        {alert.agent}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {alert.message}
                      </p>
                      <p className="text-xs text-text-tertiary mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: ANIMATION.easing.default }}
      >
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Add Deal", href: "/app/pipeline?action=new", icon: Briefcase },
            { label: "Run Agent", href: "/app/agents", icon: Bot },
            { label: "Schedule IC", href: "#", icon: Clock },
            { label: "Generate Report", href: "#", icon: Zap },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              >
                <Link
                  href={action.href}
                  className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl hover:border-accent/30 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-surface-elevated rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-medium text-text-primary">
                    {action.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
