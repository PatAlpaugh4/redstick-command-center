/**
 * Dashboard Layout
 * ================
 * Layout wrapper for all dashboard pages.
 * Uses DashboardShell with sidebar navigation for consistent layout.
 * Includes ReducedMotionProvider for accessibility preferences.
 */

import { ReactNode } from "react";
import { Metadata } from "next";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ReducedMotionProvider } from "@/components/providers/ReducedMotionProvider";

export const metadata: Metadata = {
  title: {
    default: "Dashboard | Redstick Ventures",
    template: "%s | Redstick Ventures",
  },
  description: "Manage your venture capital portfolio and deals",
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ReducedMotionProvider>
      <DashboardShell>
        {children}
      </DashboardShell>
    </ReducedMotionProvider>
  );
}
