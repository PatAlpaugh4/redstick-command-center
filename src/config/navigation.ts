/**
 * Navigation Configuration
 * ========================
 * Centralized navigation configuration for the application.
 * Includes dashboard sidebar navigation and utility functions.
 */

import {
  LayoutDashboard,
  GitBranch,
  Briefcase,
  Bot,
  Users,
  Palette,
  Settings,
  type LucideIcon,
} from "lucide-react";

// =============================================================================
// Types
// =============================================================================

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  external?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// =============================================================================
// Dashboard Navigation
// =============================================================================

/**
 * Main dashboard sidebar navigation items
 * Ordered by importance and frequency of use
 */
export const dashboardNav: NavItem[] = [
  {
    name: "Dashboard",
    href: "/app",
    icon: LayoutDashboard,
  },
  {
    name: "Pipeline",
    href: "/app/pipeline",
    icon: GitBranch,
    badge: "12 new",
  },
  {
    name: "Portfolio",
    href: "/app/portfolio",
    icon: Briefcase,
  },
  {
    name: "Agents",
    href: "/app/agents",
    icon: Bot,
    badge: "3 active",
  },
  {
    name: "LP Intelligence",
    href: "/app/lp-intelligence",
    icon: Users,
  },
  {
    name: "Content Studio",
    href: "/app/content-studio",
    icon: Palette,
  },
  {
    name: "Settings",
    href: "/app/settings",
    icon: Settings,
  },
];

// =============================================================================
// Grouped Navigation (Alternative Organization)
// =============================================================================

/**
 * Dashboard navigation organized by sections
 * Use this for sidebar with section headers
 */
export const dashboardNavSections: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        name: "Dashboard",
        href: "/app",
        icon: LayoutDashboard,
      },
      {
        name: "Pipeline",
        href: "/app/pipeline",
        icon: GitBranch,
        badge: "12 new",
      },
      {
        name: "Portfolio",
        href: "/app/portfolio",
        icon: Briefcase,
      },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        name: "Agents",
        href: "/app/agents",
        icon: Bot,
        badge: "3 active",
      },
      {
        name: "LP Intelligence",
        href: "/app/lp-intelligence",
        icon: Users,
      },
      {
        name: "Content Studio",
        href: "/app/content-studio",
        icon: Palette,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        name: "Settings",
        href: "/app/settings",
        icon: Settings,
      },
    ],
  },
];

// =============================================================================
// Public Navigation
// =============================================================================

/**
 * Public site header navigation
 */
export const publicNav: NavItem[] = [
  {
    name: "Features",
    href: "#features",
    icon: LayoutDashboard,
  },
  {
    name: "Pricing",
    href: "#pricing",
    icon: Briefcase,
  },
  {
    name: "About",
    href: "#about",
    icon: Users,
  },
  {
    name: "Contact",
    href: "#contact",
    icon: Settings,
  },
];

// =============================================================================
// Footer Navigation
// =============================================================================

export const footerNav = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Integrations", href: "#integrations" },
    { label: "Changelog", href: "#changelog" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Blog", href: "#blog" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
  ],
  resources: [
    { label: "Documentation", href: "#docs" },
    { label: "Help Center", href: "#help" },
    { label: "API Reference", href: "#api" },
    { label: "Status", href: "#status" },
  ],
  legal: [
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
    { label: "Security", href: "#security" },
    { label: "Cookies", href: "#cookies" },
  ],
};

// =============================================================================
// Settings Navigation
// =============================================================================

export const settingsNav: NavItem[] = [
  {
    name: "Profile",
    href: "/app/settings?tab=profile",
    icon: Users,
  },
  {
    name: "Firm Settings",
    href: "/app/settings?tab=firm",
    icon: Briefcase,
  },
  {
    name: "Notifications",
    href: "/app/settings?tab=notifications",
    icon: LayoutDashboard,
  },
  {
    name: "Integrations",
    href: "/app/settings?tab=integrations",
    icon: GitBranch,
  },
  {
    name: "Security",
    href: "/app/settings?tab=security",
    icon: Settings,
  },
];

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get the active navigation item based on current pathname
 */
export function getActiveNavItem(
  pathname: string,
  navItems: NavItem[] = dashboardNav
): NavItem | null {
  // Sort by href length (descending) to match more specific routes first
  const sorted = [...navItems].sort((a, b) => b.href.length - a.href.length);
  
  return sorted.find((item) => {
    // Exact match
    if (pathname === item.href) return true;
    // Sub-route match (but not root)
    if (item.href !== "/app" && pathname.startsWith(item.href + "/")) return true;
    return false;
  }) || null;
}

/**
 * Check if a nav item is active
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href !== "/app" && pathname.startsWith(href + "/")) return true;
  return false;
}

/**
 * Get page title from navigation
 */
export function getPageTitle(
  pathname: string,
  navItems: NavItem[] = dashboardNav
): string {
  const active = getActiveNavItem(pathname, navItems);
  return active?.name || "Dashboard";
}

export default dashboardNav;
