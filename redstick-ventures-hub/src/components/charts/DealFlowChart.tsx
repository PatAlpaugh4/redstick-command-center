"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const data = [
  { stage: "Inbound", count: 45, percentage: 100 },
  { stage: "Screening", count: 28, percentage: 62 },
  { stage: "1st Meeting", count: 18, percentage: 40 },
  { stage: "Deep Dive", count: 12, percentage: 27 },
  { stage: "Due Diligence", count: 8, percentage: 18 },
  { stage: "IC Review", count: 5, percentage: 11 },
  { stage: "Term Sheet", count: 3, percentage: 7 },
  { stage: "Closed", count: 2, percentage: 4 },
];

const colors = [
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#f97316",
  "#ec4899",
  "#6366f1",
  "#10b981",
  "#6b7280",
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { stage: string; count: number; percentage: number } }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
        <p className="text-text-primary font-medium">{data.stage}</p>
        <p className="text-text-secondary text-sm">{data.count} deals</p>
        <p className="text-accent text-sm">{data.percentage}% conversion</p>
      </div>
    );
  }
  return null;
}

export default function DealFlowChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Deal Flow Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#6a6a7a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="stage"
                  stroke="#6a6a7a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={75}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
