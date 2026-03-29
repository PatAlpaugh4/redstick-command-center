"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ANIMATION } from "@/lib/animations";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "error" | "info";
  className?: string;
  animate?: boolean;
}

const variants = {
  default: "bg-surface-elevated text-text-secondary border border-border",
  primary: "bg-accent/10 text-accent border border-accent/20",
  success: "bg-success/10 text-success border border-success/20",
  warning: "bg-warning/10 text-warning border border-warning/20",
  error: "bg-error/10 text-error border border-error/20",
  info: "bg-info/10 text-info border border-info/20",
};

function Badge({ children, variant = "default", className, animate = false }: BadgeProps) {
  return (
    <motion.span
      initial={animate ? { opacity: 0, scale: 0.8 } : false}
      animate={animate ? { opacity: 1, scale: 1 } : false}
      transition={{ duration: ANIMATION.duration.fast, ease: ANIMATION.easing.default }}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200",
        variants[variant],
        className
      )}
    >
      {children}
    </motion.span>
  );
}

export { Badge };
