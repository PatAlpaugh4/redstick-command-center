import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// This would check auth in production
// For now, we'll just render the layout
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
