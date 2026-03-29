import React from "react";

export interface BulkAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger" | "primary";
  disabled?: boolean;
}

export interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  actions: BulkAction[];
}

const variantStyles = {
  default: {
    base: "bg-white/5 hover:bg-white/10 text-gray-300",
    disabled: "bg-white/5 text-gray-500 cursor-not-allowed",
  },
  primary: {
    base: "bg-[#e94560] hover:bg-[#d63d56] text-white",
    disabled: "bg-[#e94560]/50 text-white/70 cursor-not-allowed",
  },
  danger: {
    base: "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30",
    disabled: "bg-red-500/10 text-red-500/50 cursor-not-allowed border border-red-500/20",
  },
};

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  actions,
}) => {
  const isVisible = selectedCount > 0;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50
        flex items-center justify-center
        pointer-events-none
        transition-all duration-300 ease-out
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
      `}
    >
      <div
        className="
          pointer-events-auto
          mx-4 mb-4
          flex items-center gap-4
          h-[60px] px-6
          bg-[#1a1a2e]/95
          border border-white/10
          rounded-lg
          shadow-2xl
          backdrop-blur-sm
        "
      >
        {/* Selection Info */}
        <div className="flex items-center gap-3 min-w-fit">
          <span className="text-white font-medium whitespace-nowrap">
            {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
          </span>
          
          <button
            onClick={onClearSelection}
            className="
              text-sm text-gray-400 hover:text-white
              transition-colors duration-200
              underline underline-offset-2
            "
          >
            Clear
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10" />

        {/* Select All / Deselect All */}
        <button
          onClick={isAllSelected ? onClearSelection : onSelectAll}
          className="
            text-sm text-[#e94560] hover:text-[#ff6b6b]
            transition-colors duration-200
            whitespace-nowrap
          "
        >
          {isAllSelected ? "Deselect all" : `Select all ${totalCount}`}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {actions.map((action, index) => {
            const variant = action.variant || "default";
            const styles = variantStyles[variant];
            const isDisabled = action.disabled;

            return (
              <button
                key={index}
                onClick={action.onClick}
                disabled={isDisabled}
                aria-label={action.label}
                className={`
                  flex items-center gap-2
                  px-4 py-2
                  rounded-md
                  text-sm font-medium
                  transition-all duration-200
                  ${isDisabled ? styles.disabled : styles.base}
                `}
              >
                <span className="w-4 h-4 flex items-center justify-center" aria-hidden="true">
                  {action.icon}
                </span>
                <span className="whitespace-nowrap">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;
