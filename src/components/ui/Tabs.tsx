/**
 * Tabs Component
 * ==============
 * Accessible tabs with keyboard navigation.
 * Supports horizontal and vertical orientations.
 */

"use client";

import React, { useState, useCallback, useRef } from "react";
import { useArrowKeyNavigation } from "@/hooks/useArrowKeyNavigation";

export interface Tab {
  /** Unique identifier */
  id: string;
  /** Tab label */
  label: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Whether tab is disabled */
  disabled?: boolean;
  /** Tab content */
  content: React.ReactNode;
  /** Badge count */
  badge?: number;
}

export interface TabsProps {
  /** Tab definitions */
  tabs: Tab[];
  /** Initially active tab */
  defaultTab?: string;
  /** Controlled active tab */
  activeTab?: string;
  /** Callback when tab changes */
  onChange?: (tabId: string) => void;
  /** Tab orientation */
  orientation?: "horizontal" | "vertical";
  /** Tab variant */
  variant?: "default" | "pills" | "underline";
  /** Additional CSS classes */
  className?: string;
  /** Tab list CSS classes */
  tabListClassName?: string;
  /** Panel CSS classes */
  panelClassName?: string;
  /** Whether to mount inactive tabs */
  mountInactive?: boolean;
}

export function Tabs({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  orientation = "horizontal",
  variant = "default",
  className = "",
  tabListClassName = "",
  panelClassName = "",
  mountInactive = false,
}: TabsProps) {
  const [uncontrolledActiveTab, setUncontrolledActiveTab] = useState(
    defaultTab || tabs[0]?.id
  );

  const activeTab = controlledActiveTab ?? uncontrolledActiveTab;
  const setActiveTab = useCallback(
    (tabId: string) => {
      setUncontrolledActiveTab(tabId);
      onChange?.(tabId);
    },
    [onChange]
  );

  // Filter out disabled tabs for navigation
  const navigableTabs = tabs.filter((tab) => !tab.disabled);

  // Use arrow key navigation
  const { focusedIndex, getItemProps, setFocusedIndex } = useArrowKeyNavigation({
    items: navigableTabs,
    orientation,
    onSelect: (tab) => {
      setActiveTab(tab.id);
    },
  });

  const handleTabClick = useCallback(
    (tab: Tab, index: number) => {
      if (tab.disabled) return;
      setActiveTab(tab.id);
      // Update focused index to match clicked tab
      const navIndex = navigableTabs.findIndex((t) => t.id === tab.id);
      setFocusedIndex(navIndex);
    },
    [setActiveTab, navigableTabs, setFocusedIndex]
  );

  // Generate IDs for accessibility
  const tabsId = useRef(`tabs-${Math.random().toString(36).substr(2, 9)}`);

  const variantClasses = {
    default: {
      list: orientation === "horizontal" 
        ? "flex border-b border-white/10" 
        : "flex flex-col border-r border-white/10",
      tab: `
        px-4 py-3 text-sm font-medium text-white/60
        hover:text-white hover:bg-white/5
        focus:outline-none focus:bg-white/5
        transition-colors
        ${orientation === "horizontal" ? "border-b-2 border-transparent -mb-px" : "border-r-2 border-transparent -mr-px"}
      `,
      active: "text-[#e94560] border-[#e94560]! bg-white/5",
      disabled: "opacity-50 cursor-not-allowed hover:text-white/60 hover:bg-transparent",
    },
    pills: {
      list: orientation === "horizontal"
        ? "flex gap-2"
        : "flex flex-col gap-2",
      tab: `
        px-4 py-2 text-sm font-medium text-white/70 rounded-lg
        hover:text-white hover:bg-white/10
        focus:outline-none focus:ring-2 focus:ring-[#e94560]/50
        transition-all
      `,
      active: "text-white bg-[#e94560] hover:bg-[#d63d56]",
      disabled: "opacity-50 cursor-not-allowed hover:text-white/70 hover:bg-transparent",
    },
    underline: {
      list: orientation === "horizontal"
        ? "flex gap-6 border-b border-white/10"
        : "flex flex-col gap-2 border-r border-white/10",
      tab: `
        px-1 py-3 text-sm font-medium text-white/60
        hover:text-white
        focus:outline-none
        transition-colors
        ${orientation === "horizontal" ? "border-b-2 border-transparent -mb-px" : "border-r-2 border-transparent -mr-px"}
      `,
      active: "text-white border-[#e94560]!",
      disabled: "opacity-50 cursor-not-allowed hover:text-white/60",
    },
  };

  const styles = variantClasses[variant];

  return (
    <div
      className={`${className} ${orientation === "horizontal" ? "" : "flex"}`}
      data-orientation={orientation}
    >
      {/* Tab List */}
      <div
        role="tablist"
        aria-orientation={orientation}
        className={`${styles.list} ${tabListClassName}`}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isDisabled = tab.disabled;
          const isFocused = navigableTabs[focusedIndex]?.id === tab.id;

          const navIndex = navigableTabs.findIndex((t) => t.id === tab.id);

          return (
            <button
              key={tab.id}
              role="tab"
              id={`${tabsId.current}-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`${tabsId.current}-panel-${tab.id}`}
              aria-disabled={isDisabled}
              tabIndex={isFocused ? 0 : -1}
              disabled={isDisabled}
              onClick={() => handleTabClick(tab, index)}
              onKeyDown={navIndex !== -1 ? getItemProps(navIndex).onKeyDown : undefined}
              onFocus={() => navIndex !== -1 && setFocusedIndex(navIndex)}
              ref={(el) => {
                if (navIndex !== -1) {
                  (getItemProps(navIndex).ref as React.MutableRefObject<HTMLElement | null>).current = el;
                }
              }}
              className={`
                ${styles.tab}
                ${isActive ? styles.active : ""}
                ${isDisabled ? styles.disabled : ""}
                inline-flex items-center gap-2
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className={`flex-1 ${orientation === "horizontal" ? "mt-4" : "ml-4"}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          if (!mountInactive && !isActive) {
            return null;
          }

          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={`${tabsId.current}-panel-${tab.id}`}
              aria-labelledby={`${tabsId.current}-tab-${tab.id}`}
              hidden={!isActive}
              tabIndex={0}
              className={`${panelClassName} ${isActive ? "animate-fade-in" : ""}`}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Tab Panel Component (for use outside of Tabs)
 */
export interface TabPanelProps {
  children: React.ReactNode;
  isActive: boolean;
  id: string;
  labelledBy: string;
  className?: string;
}

export function TabPanel({
  children,
  isActive,
  id,
  labelledBy,
  className = "",
}: TabPanelProps) {
  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={labelledBy}
      tabIndex={0}
      className={`animate-fade-in ${className}`}
    >
      {children}
    </div>
  );
}

export default Tabs;
