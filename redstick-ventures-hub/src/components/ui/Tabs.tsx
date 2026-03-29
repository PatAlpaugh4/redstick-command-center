"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={cn("w-full", className)} data-active-tab={activeTab}>
      {children}
    </div>
  );
}

function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 p-1 bg-surface rounded-lg border border-border",
        className
      )}
    >
      {children}
    </div>
  );
}

function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  // Note: In a real implementation, we'd use context to get the active state
  // This is a simplified version
  return (
    <button
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
        "text-text-secondary hover:text-text-primary",
        "data-[state=active]:bg-accent data-[state=active]:text-white",
        className
      )}
      data-value={value}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children, className }: TabsContentProps) {
  return (
    <div
      className={cn("mt-4", className)}
      data-value={value}
      role="tabpanel"
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
