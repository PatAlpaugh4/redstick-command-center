"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const data = [
  { month: "Jan", new: 8, closed: 2, passed: 1 },
  { month: "Feb", new: 12, closed: 3, passed: 2 },
  { month: "Mar", new: 10, closed: 4, passed: 1 },
  { month: "Apr", new: 15, closed: 5, passed: 3 },
  { month: "May", new: 18, closed: 6, passed: 2 },
  { month: "Jun", new: 14, closed: 4, passed: 4 },
  { month: "Jul", new: 20, closed: 7, passed: 2 },
  { month: "Aug", new: 16, closed: 5, passed: 3 },
  { month: "Sep", new: 22, closed: 8, passed: 2 },
  { month: "Oct", new: 19, closed: 6, passed: 4 },
  { month: "Nov", new: 24, closed: 9, passed: 3 },
  { month: "Dec", new: 21, closed: 7, passed: 2 },
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
            <span className="text-text-primary font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function ActivityChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Monthly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="new" name="New Deals" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                <Bar dataKey="closed" name="Closed" stackId="a" fill="#10b981" />
                <Bar dataKey="passed" name="Passed" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
