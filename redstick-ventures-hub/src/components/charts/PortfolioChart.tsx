"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const data = [
  { month: "Jan", deployed: 12, realized: 2, unrealized: 10 },
  { month: "Feb", deployed: 15, realized: 3, unrealized: 12 },
  { month: "Mar", deployed: 18, realized: 4, unrealized: 14 },
  { month: "Apr", deployed: 22, realized: 5, unrealized: 17 },
  { month: "May", deployed: 25, realized: 6, unrealized: 19 },
  { month: "Jun", deployed: 28, realized: 7, unrealized: 21 },
  { month: "Jul", deployed: 32, realized: 8, unrealized: 24 },
  { month: "Aug", deployed: 35, realized: 9, unrealized: 26 },
  { month: "Sep", deployed: 38, realized: 10, unrealized: 28 },
  { month: "Oct", deployed: 42, realized: 11, unrealized: 31 },
  { month: "Nov", deployed: 45, realized: 12, unrealized: 33 },
  { month: "Dec", deployed: 47, realized: 13, unrealized: 34 },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
        <p className="text-text-primary font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-text-secondary">{entry.name}:</span>
            <span className="text-text-primary font-medium">${entry.value}M</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function PortfolioChart() {
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-64 bg-surface-elevated rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDeployed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e94560" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e94560" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRealized" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUnrealized" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="month"
                  stroke="#6a6a7a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6a6a7a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="deployed"
                  name="Deployed"
                  stroke="#e94560"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDeployed)"
                />
                <Area
                  type="monotone"
                  dataKey="realized"
                  name="Realized"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRealized)"
                />
                <Area
                  type="monotone"
                  dataKey="unrealized"
                  name="Unrealized"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUnrealized)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
