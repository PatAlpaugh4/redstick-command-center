/**
 * Breadcrumbs
 * ===========
 * Dynamic breadcrumbs component based on current route.
 * Shows Home > Section > Page hierarchy with clickable links.
 * Includes responsive truncation for mobile views.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  className?: string;
  homeLabel?: string;
  maxItems?: number;
}

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

// Route label mappings
const routeLabels: Record<string, string> = {
  app: "Dashboard",
  pipeline: "Pipeline",
  portfolio: "Portfolio",
  agents: "Agents",
  "lp-intelligence": "LP Intelligence",
  "content-studio": "Content Studio",
  settings: "Settings",
  notifications: "Notifications",
  profile: "Profile",
  deals: "Deals",
  companies: "Companies",
  contacts: "Contacts",
  reports: "Reports",
  analytics: "Analytics",
  team: "Team",
  billing: "Billing",
  integrations: "Integrations",
  security: "Security",
};

/**
 * Generate breadcrumb items from current pathname
 */
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Remove query parameters and split path
  const pathWithoutQuery = pathname.split("?")[0];
  const segments = pathWithoutQuery.split("/").filter(Boolean);

  const items: BreadcrumbItem[] = [];
  let currentPath = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Get label from mapping or format the segment
    const label = routeLabels[segment] || formatSegmentLabel(segment);
    
    items.push({
      label,
      href: currentPath,
      isLast: index === segments.length - 1,
    });
  });

  return items;
}

/**
 * Format a URL segment into a readable label
 */
function formatSegmentLabel(segment: string): string {
  // Handle kebab-case and camelCase
  return segment
    .replace(/-/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Truncate breadcrumbs for mobile responsiveness
 */
function truncateItems(items: BreadcrumbItem[], maxItems: number): BreadcrumbItem[] {
  if (items.length <= maxItems) {
    return items;
  }

  // Always keep first and last items, truncate middle
  const firstItems = items.slice(0, 1);
  const lastItems = items.slice(-2);

  return [
    ...firstItems,
    { label: "...", href: "#", isLast: false },
    ...lastItems,
  ];
}

export function Breadcrumbs({
  className,
  homeLabel = "Home",
  maxItems = 4,
}: BreadcrumbsProps) {
  const pathname = usePathname();
  const items = generateBreadcrumbs(pathname);
  const displayItems = truncateItems(items, maxItems);
  const isTruncated = items.length > maxItems;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center", className)}
    >
      <ol className="flex items-center flex-wrap gap-1 sm:gap-2">
        {/* Home Link */}
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-[#6a6a7a] hover:text-white transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{homeLabel}</span>
          </Link>
        </li>

        {/* Separator after home (only if there are items) */}
        {displayItems.length > 0 && (
          <li className="flex items-center text-[#6a6a7a]">
            <ChevronRight className="w-3.5 h-3.5" />
          </li>
        )}

        {/* Breadcrumb Items */}
        {displayItems.map((item, index) => {
          const isEllipsis = item.label === "...";

          return (
            <li key={`${item.href}-${index}`} className="flex items-center">
              {isEllipsis ? (
                <span className="flex items-center px-1 text-[#6a6a7a]">
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              ) : item.isLast ? (
                <span
                  className="text-sm font-medium text-white truncate max-w-[120px] sm:max-w-[200px]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm text-[#a0a0b0] hover:text-white transition-colors truncate max-w-[100px] sm:max-w-[150px]"
                >
                  {item.label}
                </Link>
              )}

              {/* Separator */}
              {!item.isLast && (
                <span className="flex items-center ml-1 sm:ml-2 text-[#6a6a7a]">
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Hidden full path for accessibility */}
      {isTruncated && (
        <span className="sr-only">
          Full path: {homeLabel} {" > "}
          {items.map((item) => item.label).join(" > ")}
        </span>
      )}
    </nav>
  );
}

export default Breadcrumbs;
