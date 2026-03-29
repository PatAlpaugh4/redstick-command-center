/**
 * Modal Component
 * ===============
 * Accessible modal/dialog component with reduced motion support.
 * Uses Framer Motion for animations that respect user preferences.
 * 
 * @example
 * <Modal isOpen={isOpen} onClose={handleClose} title="Confirm Action">
 *   <p>Are you sure you want to proceed?</p>
 *   <ModalFooter>
 *     <Button onClick={handleClose}>Cancel</Button>
 *     <Button onClick={handleConfirm}>Confirm</Button>
 *   </ModalFooter>
 * </Modal>
 */

"use client";

import { ReactNode, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  modalOverlayVariants,
  modalContentVariants,
  modalContentVariantsReduced,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

// =============================================================================
// Types
// =============================================================================

export interface ModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal description/subtitle */
  description?: string;
  /** Modal content */
  children: ReactNode;
  /** Optional footer content (usually buttons) */
  footer?: ReactNode;
  /** Modal size variant */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** Whether to close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Whether to close on Escape key */
  closeOnEscape?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Hide the default close button */
  hideCloseButton?: boolean;
  /** Callback when modal finishes opening */
  onOpenComplete?: () => void;
  /** Callback when modal finishes closing */
  onCloseComplete?: () => void;
}

// =============================================================================
// Size Configurations
// =============================================================================

const sizeClasses: Record<string, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[90vw]",
};

// =============================================================================
// Component
// =============================================================================

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  hideCloseButton = false,
  onOpenComplete,
  onCloseComplete,
}: ModalProps) {
  const prefersReducedMotion = useReducedMotion();

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape && isOpen) {
        onClose();
      }
    },
    [closeOnEscape, isOpen, onClose]
  );

  // Add/remove keyboard listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && closeOnOverlayClick) {
        onClose();
      }
    },
    [closeOnOverlayClick, onClose]
  );

  // Select appropriate variants based on reduced motion preference
  const contentVariants = prefersReducedMotion
    ? modalContentVariantsReduced
    : modalContentVariants;

  return (
    <AnimatePresence
      onExitComplete={onCloseComplete}
      {...(onOpenComplete && { onExitComplete: onCloseComplete })}
    >
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-description" : undefined}
        >
          {/* Backdrop */}
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleOverlayClick}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onAnimationComplete={onOpenComplete}
            className={cn(
              "relative z-10 w-full mx-4",
              "bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl",
              "max-h-[90vh] overflow-y-auto",
              sizeClasses[size],
              className
            )}
          >
            {/* Header */}
            {(title || !hideCloseButton) && (
              <div className="flex items-start justify-between p-6 pb-0">
                <div className="flex-1 pr-4">
                  {title && (
                    <h2
                      id="modal-title"
                      className="text-xl font-semibold text-white"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id="modal-description"
                      className="mt-1 text-sm text-[#a0a0b0]"
                    >
                      {description}
                    </p>
                  )}
                </div>
                {!hideCloseButton && (
                  <button
                    onClick={onClose}
                    className={cn(
                      "p-2 rounded-lg text-[#6a6a7a] hover:text-white",
                      "hover:bg-white/10 transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-[#e94560]"
                    )}
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className={cn("p-6", !title && "pt-6")}>{children}</div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// =============================================================================
// Modal Sub-components
// =============================================================================

/**
 * ModalFooter - Pre-styled footer container for modal actions
 */
export function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-end gap-3", className)}>
      {children}
    </div>
  );
}

/**
 * ModalHeader - Pre-styled header for modals without using the title prop
 */
export function ModalHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

/**
 * ConfirmModal - Pre-configured modal for confirmation dialogs
 */
export interface ConfirmModalProps extends Omit<ModalProps, "children" | "footer"> {
  /** The message to display */
  message: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button variant */
  confirmVariant?: "primary" | "danger" | "secondary";
  /** Callback when confirmed */
  onConfirm: () => void;
  /** Whether the action is loading */
  isLoading?: boolean;
}

export function ConfirmModal({
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  onConfirm,
  isLoading = false,
  ...modalProps
}: ConfirmModalProps) {
  const confirmClasses = {
    primary: "bg-[#e94560] hover:bg-[#d63d56] text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    secondary: "bg-white/10 hover:bg-white/20 text-white",
  };

  return (
    <Modal
      size="sm"
      {...modalProps}
      footer={
        <>
          <button
            onClick={modalProps.onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              confirmClasses[confirmVariant],
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? "Loading..." : confirmText}
          </button>
        </>
      }
    >
      <p className="text-[#a0a0b0]">{message}</p>
    </Modal>
  );
}

export default Modal;
