"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  Briefcase,
  Building2,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
  FileText,
  Globe,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { label: "AI Agents", href: "/app/agents", icon: Bot, badge: 3 },
  { label: "Pipeline", href: "/app/pipeline", icon: Briefcase, badge: 12 },
  { label: "Portfolio", href: "/app/portfolio", icon: Building2 },
  { label: "LP Intelligence", href: "/app/lp-intelligence", icon: Globe },
  { label: "Content Studio", href: "/app/content-studio", icon: FileText },
];

const secondaryNavItems: NavItem[] = [
  { label: "Settings", href: "/app/settings", icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/app/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <div>
              <span className="font-bold text-lg text-text-primary block">
                Redstick
              </span>
              <span className="text-xs text-text-tertiary">Command Center</span>
            </div>
          </Link>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider px-3 mb-2">
            Main
          </div>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider px-3 mb-2 mt-6">
            System
          </div>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1 text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Avatar alt="User Name" size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                Alex Chen
              </p>
              <p className="text-xs text-text-tertiary">Partner</p>
            </div>
            <Link href="/" className="p-1.5 text-text-tertiary hover:text-text-primary transition-colors">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-surface/50 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">
              {mainNavItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label || 
               secondaryNavItems.find((item) => pathname === item.href)?.label || 
               "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            </button>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm text-text-secondary">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
