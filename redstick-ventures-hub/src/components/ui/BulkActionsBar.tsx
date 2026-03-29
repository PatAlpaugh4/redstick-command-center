"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckSquare, Square } from "lucide-react";

export interface BulkAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger" | "primary";
  disabled?: boolean;
}

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  actions: BulkAction[];
}

export function BulkActionsBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  actions,
}: BulkActionsBarProps) {
  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-4 px-6 py-3 bg-surface/95 backdrop-blur-lg border border-border rounded-2xl shadow-2xl">
            {/* Selection Info */}
            <div className="flex items-center gap-3 pr-4 border-r border-border">
              <button
                onClick={isAllSelected ? onClearSelection : onSelectAll}
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                {isAllSelected ? (
                  <CheckSquare className="w-5 h-5 text-accent" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
                <span className="font-medium">
                  {selectedCount} selected
                </span>
              </button>
              <button
                onClick={onClearSelection}
                className="p-1 hover:bg-surface-elevated rounded-lg text-text-tertiary hover:text-text-secondary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      action.variant === "danger"
                        ? "bg-error/10 text-error hover:bg-error/20"
                        : action.variant === "primary"
                        ? "bg-accent text-white hover:bg-accent-hover"
                        : "bg-surface-elevated text-text-primary hover:bg-surface"
                    }
                  `}
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
