"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { ANIMATION } from "@/lib/animations";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, borderColor: "rgba(233, 69, 96, 0.3)" } : {}}
      transition={{ duration: ANIMATION.duration.fast, ease: ANIMATION.easing.default }}
      onClick={onClick}
      className={cn(
        "bg-surface border border-border rounded-xl shadow-card overflow-hidden",
        hover && "cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("px-6 py-4 border-b border-border", className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn("font-semibold text-text-primary", className)}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn("px-6 py-4 border-t border-border bg-surface-elevated/50", className)}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
