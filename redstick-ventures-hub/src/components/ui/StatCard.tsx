"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: "default" | "accent" | "success" | "warning";
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  variant = "default",
  className,
}: StatCardProps) {
  const variants = {
    default: {
      bg: "bg-surface",
      iconBg: "bg-surface-elevated",
      iconColor: "text-accent",
    },
    accent: {
      bg: "bg-accent/10 border-accent/20",
      iconBg: "bg-accent/20",
      iconColor: "text-accent",
    },
    success: {
      bg: "bg-success/5 border-success/10",
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
    warning: {
      bg: "bg-warning/5 border-warning/10",
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
  };

  const style = variants[variant];

  return (
    <div
      className={cn(
        "p-6 rounded-xl border border-border",
        style.bg,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <h3 className="text-2xl font-bold text-text-primary mt-2">{value}</h3>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  change >= 0 ? "text-success" : "text-error"
                )}
              >
                {change >= 0 ? "+" : ""}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-text-tertiary">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", style.iconBg)}>
          <Icon className={cn("w-6 h-6", style.iconColor)} />
        </div>
      </div>
    </div>
  );
}
