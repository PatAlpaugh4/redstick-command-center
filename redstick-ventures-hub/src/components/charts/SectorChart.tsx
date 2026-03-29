"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const data = [
  { name: "AgTech", value: 35, color: "#e94560" },
  { name: "FoodTech", value: 28, color: "#3b82f6" },
  { name: "Sustainability", value: 18, color: "#10b981" },
  { name: "Supply Chain", value: 12, color: "#f59e0b" },
  { name: "Other", value: 7, color: "#6b7280" },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: payload[0].payload.color }}
          />
          <span className="text-text-primary font-medium">{payload[0].name}</span>
        </div>
        <p className="text-text-secondary text-sm mt-1">{payload[0].value}% of portfolio</p>
      </div>
    );
  }
  return null;
}

export default function SectorChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Sector Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="rgba(0,0,0,0.3)"
                      strokeWidth={2}
                      style={{
                        filter: activeIndex === index ? "brightness(1.2)" : "none",
                        transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                        transformOrigin: "center",
                        transition: "all 0.2s",
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">{total}%</p>
                <p className="text-xs text-text-secondary">Total</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {data.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center gap-2 text-sm"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-text-secondary">{item.name}</span>
                <span className="text-text-primary font-medium ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
