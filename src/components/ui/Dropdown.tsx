/**
 * Dropdown Component
 * ==================
 * Accessible dropdown menu with keyboard navigation,
 * arrow key support, and focus management.
 */

"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useArrowKeyNavigation } from "@/hooks/useArrowKeyNavigation";

export interface DropdownItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Divider before this item */
  divider?: boolean;
  /** Keyboard shortcut hint */
  shortcut?: string;
  /** Action callback */
  onClick?: () => void;
  /** Link URL (renders as anchor) */
  href?: string;
  /** Whether item is active/selected */
  active?: boolean;
}

export interface DropdownProps {
  /** Trigger element */
  children: React.ReactElement;
  /** Dropdown items */
  items: DropdownItem[];
  /** Placement relative to trigger */
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end";
  /** Whether dropdown is controlled */
  isOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (isOpen: boolean) => void;
  /** Additional CSS classes */
  className?: string;
  /** Item width (default: auto) */
  width?: number | "auto";
  /** Align items */
  align?: "left" | "right";
  /** Called when item is selected */
  onSelect?: (item: DropdownItem) => void;
}

const placementClasses = {
  "bottom-start": "top-full left-0 mt-2",
  "bottom-end": "top-full right-0 mt-2",
  "top-start": "bottom-full left-0 mb-2",
  "top-end": "bottom-full right-0 mb-2",
};

export function Dropdown({
  children,
  items,
  placement = "bottom-start",
  isOpen: controlledIsOpen,
  onOpenChange,
  className = "",
  width = "auto",
  onSelect,
}: DropdownProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;
  const setIsOpen = useCallback(
    (value: boolean) => {
      setUncontrolledIsOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange]
  );

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLElement>(null);

  // Filter out disabled items for navigation
  const navigableItems = items.filter((item) => !item.disabled && !item.divider);

  // Use arrow key navigation
  const { focusedIndex, getItemProps, setFocusedIndex } = useArrowKeyNavigation({
    items: navigableItems,
    orientation: "vertical",
    enabled: isOpen,
    onSelect: (item, index) => {
      handleSelect(item);
    },
  });

  // Use focus trap
  const { containerRef } = useFocusTrap({
    isActive: isOpen,
    onEscape: () => setIsOpen(false),
    focusFirstOnActivate: false,
  });

  // Handle select
  const handleSelect = useCallback(
    (item: DropdownItem) => {
      if (item.disabled) return;

      item.onClick?.();
      onSelect?.(item);
      setIsOpen(false);

      // Return focus to trigger
      setTimeout(() => {
        triggerButtonRef.current?.focus();
      }, 0);
    },
    [onSelect, setIsOpen]
  );

  // Handle trigger click
  const handleTriggerClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isOpen) {
        // Store trigger element
        triggerButtonRef.current = e.currentTarget as HTMLElement;
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    },
    [isOpen, setIsOpen]
  );

  // Handle trigger keydown
  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!isOpen) {
          triggerButtonRef.current = e.currentTarget as HTMLElement;
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
      } else if (e.key === "ArrowDown" && !isOpen) {
        e.preventDefault();
        triggerButtonRef.current = e.currentTarget as HTMLElement;
        setIsOpen(true);
        // Focus first item
        setTimeout(() => {
          const firstItem = menuRef.current?.querySelector('[role="menuitem"]') as HTMLElement;
          firstItem?.focus();
        }, 0);
      } else if (e.key === "ArrowUp" && !isOpen) {
        e.preventDefault();
        triggerButtonRef.current = e.currentTarget as HTMLElement;
        setIsOpen(true);
        // Focus last item
        setTimeout(() => {
          const menuItems = menuRef.current?.querySelectorAll('[role="menuitem"]');
          const lastItem = menuItems?.[menuItems.length - 1] as HTMLElement;
          lastItem?.focus();
        }, 0);
      }
    },
    [isOpen, setIsOpen, setFocusedIndex]
  );

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  // Close on window resize
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => setIsOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, setIsOpen]);

  // Clone trigger with event handlers
  const trigger = React.cloneElement(children, {
    onClick: handleTriggerClick,
    onKeyDown: handleTriggerKeyDown,
    "aria-haspopup": "menu",
    "aria-expanded": isOpen,
    ref: (node: HTMLElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
    },
  });

  const menuId = `dropdown-menu-${React.useId()}`;

  return (
    <div className="relative inline-block" ref={triggerRef}>
      {trigger}

      {isOpen &&
        createPortal(
          <div
            ref={(node) => {
              (menuRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
              (containerRef as React.MutableRefObject<HTMLElement | null>).current = node;
            }}
            id={menuId}
            role="menu"
            aria-orientation="vertical"
            className={`
              absolute z-50 min-w-[12rem] py-1
              bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl
              animate-scale-in origin-top
              ${placementClasses[placement]}
              ${className}
            `}
            style={{ width: typeof width === "number" ? width : undefined }}
          >
            {items.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={`divider-${index}`}
                    className="my-1 border-t border-white/10"
                    role="separator"
                  />
                );
              }

              const isDisabled = item.disabled;
              const isActive = item.active;

              const itemContent = (
                <>
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  <span className="flex-1">{item.label}</span>
                  {item.shortcut && (
                    <kbd className="ml-3 text-xs text-white/40 font-mono">
                      {item.shortcut}
                    </kbd>
                  )}
                </>
              );

              const itemClasses = `
                flex items-center w-full px-4 py-2 text-sm
                ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-white/10"}
                ${isActive ? "bg-white/10 text-white" : "text-white/90"}
                focus:bg-white/10 focus:outline-none
              `;

              // Find the index in navigable items for this item
              const navIndex = navigableItems.findIndex((navItem) => navItem.id === item.id);

              const commonProps = {
                role: "menuitem",
                tabIndex: navIndex === focusedIndex ? 0 : -1,
                "aria-disabled": isDisabled,
                className: itemClasses,
                ...(navIndex !== -1 ? getItemProps(navIndex) : {}),
              };

              if (item.href && !isDisabled) {
                return (
                  <a key={item.id} href={item.href} {...commonProps}>
                    {itemContent}
                  </a>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelect(item)}
                  {...commonProps}
                >
                  {itemContent}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}

/**
 * Dropdown Button Trigger
 */
export interface DropdownButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export const DropdownButton = React.forwardRef<HTMLButtonElement, DropdownButtonProps>(
  ({ children, className = "", variant = "secondary", size = "md", disabled }, ref) => {
    const variantClasses = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      ghost: "btn-ghost",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={`
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          inline-flex items-center gap-2
          ${className}
        `}
      >
        {children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );
  }
);

DropdownButton.displayName = "DropdownButton";

export default Dropdown;
