/**
 * KeyboardHelp Component
 * ======================
 * A searchable, categorized keyboard shortcuts help modal.
 * Provides quick reference for all keyboard shortcuts in the application.
 */

"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Keyboard, Command, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react";
import { Modal, ModalFooter } from "@/components/ui/modal";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

// =============================================================================
// Types
// =============================================================================

export interface Shortcut {
  /** Unique identifier */
  id: string;
  /** Keyboard keys */
  keys: string[];
  /** Description of what the shortcut does */
  description: string;
  /** Category for grouping */
  category: string;
  /** Context where shortcut works */
  context?: "global" | "table" | "kanban" | "modal" | "form";
}

export interface KeyboardHelpProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal closes */
  onClose: () => void;
  /** Additional shortcuts to display */
  customShortcuts?: Shortcut[];
  /** Categories to hide */
  hiddenCategories?: string[];
  /** Title of the modal */
  title?: string;
}

// =============================================================================
// Default Shortcuts
// =============================================================================

const DEFAULT_SHORTCUTS: Shortcut[] = [
  // Global Shortcuts
  { id: "search", keys: ["Ctrl", "K"], description: "Open search", category: "Global", context: "global" },
  { id: "help", keys: ["Shift", "?"], description: "Show keyboard shortcuts", category: "Global", context: "global" },
  { id: "escape", keys: ["Esc"], description: "Close modal / Cancel action", category: "Global", context: "global" },
  { id: "new", keys: ["Ctrl", "N"], description: "Create new item", category: "Global", context: "global" },
  { id: "save", keys: ["Ctrl", "S"], description: "Save current form", category: "Global", context: "form" },
  
  // Navigation Shortcuts
  { id: "next-item", keys: ["↓"], description: "Navigate to next item", category: "Navigation", context: "global" },
  { id: "prev-item", keys: ["↑"], description: "Navigate to previous item", category: "Navigation", context: "global" },
  { id: "first-item", keys: ["Home"], description: "Go to first item", category: "Navigation", context: "global" },
  { id: "last-item", keys: ["End"], description: "Go to last item", category: "Navigation", context: "global" },
  { id: "page-up", keys: ["PageUp"], description: "Page up", category: "Navigation", context: "global" },
  { id: "page-down", keys: ["PageDown"], description: "Page down", category: "Navigation", context: "global" },
  
  // Table Shortcuts
  { id: "select-all", keys: ["Ctrl", "A"], description: "Select all rows", category: "Table", context: "table" },
  { id: "select-row", keys: ["Space"], description: "Select current row", category: "Table", context: "table" },
  { id: "edit-row", keys: ["Enter"], description: "Edit current row", category: "Table", context: "table" },
  { id: "next-cell", keys: ["→"], description: "Move to next cell", category: "Table", context: "table" },
  { id: "prev-cell", keys: ["←"], description: "Move to previous cell", category: "Table", context: "table" },
  { id: "next-row", keys: ["↓"], description: "Move to next row", category: "Table", context: "table" },
  { id: "prev-row", keys: ["↑"], description: "Move to previous row", category: "Table", context: "table" },
  { id: "export", keys: ["Ctrl", "E"], description: "Export to CSV", category: "Table", context: "table" },
  { id: "focus-search", keys: ["Ctrl", "F"], description: "Focus search input", category: "Table", context: "table" },
  
  // Kanban Shortcuts
  { id: "grab-card", keys: ["Space"], description: "Grab/Drop card", category: "Kanban", context: "kanban" },
  { id: "move-left", keys: ["←"], description: "Move card left", category: "Kanban", context: "kanban" },
  { id: "move-right", keys: ["→"], description: "Move card right", category: "Kanban", context: "kanban" },
  { id: "move-up", keys: ["↑"], description: "Move card up", category: "Kanban", context: "kanban" },
  { id: "move-down", keys: ["↓"], description: "Move card down", category: "Kanban", context: "kanban" },
  { id: "cancel-grab", keys: ["Esc"], description: "Cancel card grab", category: "Kanban", context: "kanban" },
  
  // Modal Shortcuts
  { id: "close-modal", keys: ["Esc"], description: "Close modal", category: "Modal", context: "modal" },
  { id: "confirm-modal", keys: ["Enter"], description: "Confirm action", category: "Modal", context: "modal" },
  { id: "tab-next", keys: ["Tab"], description: "Next focusable element", category: "Modal", context: "modal" },
  { id: "tab-prev", keys: ["Shift", "Tab"], description: "Previous focusable element", category: "Modal", context: "modal" },
];

// =============================================================================
// Helper Functions
// =============================================================================

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Global":
      return <Command className="w-4 h-4" />;
    case "Navigation":
      return <ArrowUp className="w-4 h-4" />;
    case "Table":
      return <CornerDownLeft className="w-4 h-4" />;
    case "Kanban":
      return <ArrowDown className="w-4 h-4" />;
    case "Modal":
      return <X className="w-4 h-4" />;
    default:
      return <Keyboard className="w-4 h-4" />;
  }
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Global: "#e94560",
    Navigation: "#0ea5e9",
    Table: "#10b981",
    Kanban: "#f59e0b",
    Modal: "#8b5cf6",
  };
  return colors[category] || "#6a6a7a";
};

// =============================================================================
// Key Component
// =============================================================================

const Key: React.FC<{ keyName: string }> = ({ keyName }) => {
  const displayKey = keyName === "Ctrl" || keyName === "Cmd" ? "⌘" : 
                     keyName === "Shift" ? "⇧" :
                     keyName === "Alt" ? "⌥" :
                     keyName === "Enter" ? "↵" :
                     keyName === "Esc" ? "⎋" :
                     keyName === "ArrowUp" || keyName === "↑" ? "↑" :
                     keyName === "ArrowDown" || keyName === "↓" ? "↓" :
                     keyName === "ArrowLeft" || keyName === "←" ? "←" :
                     keyName === "ArrowRight" || keyName === "→" ? "→" :
                     keyName;

  return (
    <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-white/10 border border-white/20 rounded text-xs font-mono text-white/90">
      {displayKey}
    </kbd>
  );
};

// =============================================================================
// Shortcut Item Component
// =============================================================================

interface ShortcutItemProps {
  shortcut: Shortcut;
}

const ShortcutItem: React.FC<ShortcutItemProps> = ({ shortcut }) => {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
      <span className="text-white/80 text-sm">{shortcut.description}</span>
      <div className="flex items-center gap-1">
        {shortcut.keys.map((key, index) => (
          <React.Fragment key={index}>
            <Key keyName={key} />
            {index < shortcut.keys.length - 1 && (
              <span className="text-white/40 mx-0.5">+</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// Category Section Component
// =============================================================================

interface CategorySectionProps {
  category: string;
  shortcuts: Shortcut[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, shortcuts }) => {
  const color = getCategoryColor(category);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {getCategoryIcon(category)}
        </div>
        <h3 className="font-semibold text-white">{category}</h3>
        <span className="text-xs text-white/40">({shortcuts.length})</span>
      </div>
      <div className="space-y-1">
        {shortcuts.map((shortcut) => (
          <ShortcutItem key={shortcut.id} shortcut={shortcut} />
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// Main KeyboardHelp Component
// =============================================================================

export function KeyboardHelp({
  isOpen,
  onClose,
  customShortcuts = [],
  hiddenCategories = [],
  title = "Keyboard Shortcuts",
}: KeyboardHelpProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContext, setSelectedContext] = useState<string>("all");

  // Combine default and custom shortcuts
  const allShortcuts = useMemo(() => {
    const shortcutMap = new Map<string, Shortcut>();
    
    // Add defaults
    DEFAULT_SHORTCUTS.forEach((s) => shortcutMap.set(s.id, s));
    
    // Override with custom
    customShortcuts.forEach((s) => shortcutMap.set(s.id, s));
    
    return Array.from(shortcutMap.values());
  }, [customShortcuts]);

  // Filter shortcuts based on search and context
  const filteredShortcuts = useMemo(() => {
    return allShortcuts.filter((shortcut) => {
      // Filter by hidden categories
      if (hiddenCategories.includes(shortcut.category)) return false;
      
      // Filter by context
      if (selectedContext !== "all" && shortcut.context !== selectedContext) return false;
      
      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          shortcut.description.toLowerCase().includes(query) ||
          shortcut.keys.some((k) => k.toLowerCase().includes(query)) ||
          shortcut.category.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [allShortcuts, hiddenCategories, selectedContext, searchQuery]);

  // Group shortcuts by category
  const groupedShortcuts = useMemo(() => {
    const groups = new Map<string, Shortcut[]>();
    
    filteredShortcuts.forEach((shortcut) => {
      const existing = groups.get(shortcut.category) || [];
      existing.push(shortcut);
      groups.set(shortcut.category, existing);
    });
    
    // Sort categories
    const categoryOrder = ["Global", "Navigation", "Table", "Kanban", "Modal", "Form"];
    return Array.from(groups.entries()).sort((a, b) => {
      const indexA = categoryOrder.indexOf(a[0]);
      const indexB = categoryOrder.indexOf(b[0]);
      if (indexA === -1 && indexB === -1) return a[0].localeCompare(b[0]);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [filteredShortcuts]);

  // Context filter options
  const contextOptions = [
    { value: "all", label: "All Contexts" },
    { value: "global", label: "Global" },
    { value: "table", label: "Table" },
    { value: "kanban", label: "Kanban" },
    { value: "modal", label: "Modal" },
    { value: "form", label: "Form" },
  ];

  // Close on escape
  useKeyboardShortcut("Escape", () => {
    if (isOpen) onClose();
  }, { enabled: isOpen });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      className="max-h-[80vh]"
    >
      <div className="space-y-4">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search shortcuts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0f0f1a] border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Context Filter */}
          <select
            value={selectedContext}
            onChange={(e) => setSelectedContext(e.target.value)}
            className="px-4 py-2 bg-[#0f0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:border-transparent"
          >
            {contextOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Shortcuts List */}
        <div className="overflow-y-auto max-h-[50vh] pr-2">
          {groupedShortcuts.length > 0 ? (
            groupedShortcuts.map(([category, shortcuts]) => (
              <CategorySection
                key={category}
                category={category}
                shortcuts={shortcuts}
              />
            ))
          ) : (
            <div className="text-center py-8 text-white/50">
              <Keyboard className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No shortcuts found matching your search.</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="pt-4 border-t border-white/10 text-center text-sm text-white/40">
          Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/60 font-mono">?</kbd> anywhere to show this help
        </div>
      </div>

      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
        >
          Close
        </button>
        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            setSelectedContext("all");
          }}
          className="btn-ghost"
        >
          Reset Filters
        </button>
      </ModalFooter>
    </Modal>
  );
}

/**
 * KeyboardHelp Button Component
 * A button that opens the keyboard help modal
 */
export interface KeyboardHelpButtonProps {
  /** Additional CSS classes */
  className?: string;
  /** Button variant */
  variant?: "default" | "ghost" | "outline";
  /** Button size */
  size?: "sm" | "md" | "lg";
  /** Additional shortcuts to display */
  customShortcuts?: Shortcut[];
}

export function KeyboardHelpButton({
  className = "",
  variant = "ghost",
  size = "md",
  customShortcuts,
}: KeyboardHelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  useKeyboardShortcut("?", () => setIsOpen(true), { shift: true });

  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  };

  const variantClasses = {
    default: "btn-secondary",
    ghost: "text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors",
    outline: "border border-white/20 hover:bg-white/5 rounded-lg transition-colors",
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard className={`${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"}`} />
      </button>

      <KeyboardHelp
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        customShortcuts={customShortcuts}
      />
    </>
  );
}

export default KeyboardHelp;
