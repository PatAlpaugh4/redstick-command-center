/**
 * Workstream 5A: Mobile Layout Optimization
 * Modal Component with Mobile-First Responsive Design
 * 
 * Features:
 * - Full screen on phones < 375px
 * - Bottom sheet style on mobile
 * - Centered dialog on desktop
 * - Proper z-index stacking
 * - Focus trap and escape key handling
 */

'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

// ============================================
// TYPES
// ============================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  initialFocusRef?: React.RefObject<HTMLElement>;
  returnFocusRef?: React.RefObject<HTMLElement>;
}

// ============================================
// SIZE CONFIGURATIONS (Mobile-First Responsive)
// ============================================

const SIZE_CLASSES: Record<string, string> = {
  // Full screen on < 375px, bottom sheet on 375-639px, centered on 640px+
  sm: 'w-full h-[100dvh] max-h-[100dvh] rounded-none sm:h-auto sm:max-h-[90vh] sm:rounded-xl sm:max-w-sm',
  md: 'w-full h-[100dvh] max-h-[100dvh] rounded-none sm:h-auto sm:max-h-[90vh] sm:rounded-xl sm:max-w-lg',
  lg: 'w-full h-[100dvh] max-h-[100dvh] rounded-none sm:h-auto sm:max-h-[90vh] sm:rounded-xl sm:max-w-2xl',
  xl: 'w-full h-[100dvh] max-h-[100dvh] rounded-none sm:h-auto sm:max-h-[90vh] sm:rounded-xl sm:max-w-4xl',
  // Full screen option remains full screen
  full: 'w-full h-full sm:h-auto sm:max-w-full sm:m-4',
};

// ============================================
// FOCUS TRAP UTILITY
// ============================================

const useFocusTrap = (isOpen: boolean, containerRef: React.RefObject<HTMLElement>) => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus first focusable element
      const container = containerRef.current;
      if (container) {
        const focusableElements = container.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        firstElement?.focus();
      }

      return () => {
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, containerRef]);
};

// ============================================
// MODAL COMPONENT
// ============================================

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollBarCompensation = window.innerWidth - document.body.offsetWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarCompensation}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const content = contentRef.current;
    const focusableElements = content.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element on open
    setTimeout(() => firstElement?.focus(), 0);

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    content.addEventListener('keydown', handleTabKey);
    return () => content.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === overlayRef.current) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={`
        fixed inset-0 z-50
        flex items-end sm:items-center justify-center
        bg-black/60 backdrop-blur-sm
        animate-fade-in
        ${overlayClassName}
      `}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
      role="presentation"
    >
      <div
        ref={contentRef}
        className={`
          ${SIZE_CLASSES[size]}
          overflow-y-auto overflow-x-hidden
          bg-white
          shadow-2xl
          transform transition-all
          ${className}
        `}
        style={{ animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={`
            flex items-center justify-between
            px-4 sm:px-6 py-4
            border-b border-gray-200
            sticky top-0 bg-white z-10
          `}>
            <div className="flex-1 min-w-0">
              {title && (
                <h2 
                  id="modal-title" 
                  className="text-lg font-semibold text-gray-900 pr-8"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p 
                  id="modal-description" 
                  className="mt-1 text-sm text-gray-500"
                >
                  {description}
                </p>
              )}
            </div>
            
            {showCloseButton && (
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="
                  absolute right-4 top-4
                  p-2 rounded-lg
                  text-gray-400 hover:text-gray-600 hover:bg-gray-100
                  transition-colors
                  touch-target touch-comfortable
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                "
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`px-4 sm:px-6 py-4 ${contentClassName}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="
            px-4 sm:px-6 py-4
            border-t border-gray-200
            bg-gray-50
            sticky bottom-0
            flex flex-col-reverse sm:flex-row sm:justify-end gap-3
          ">
            {footer}
          </div>
        )}

        {/* Pull handle for mobile bottom sheet feel */}
        <div 
          className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full" 
          aria-hidden="true"
        />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(100%);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (min-width: 640px) {
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: scale(0.95) translateY(10px);
            }
            to { 
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        }
      `}</style>
    </div>
  );

  // Use portal to render at document body
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};

// ============================================
// CONFIRMATION MODAL PRESET
// ============================================

export interface ConfirmModalProps extends Omit<ModalProps, 'children' | 'footer'> {
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  confirmVariant?: 'primary' | 'danger' | 'secondary';
  isConfirming?: boolean;
  children: React.ReactNode;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  confirmVariant = 'primary',
  isConfirming = false,
  children,
  ...modalProps
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
  };

  const footer = (
    <>
      <button
        type="button"
        onClick={modalProps.onClose}
        className="
          w-full sm:w-auto
          px-4 py-3 sm:py-2
          text-sm font-medium
          text-gray-700 bg-white border border-gray-300
          rounded-lg
          hover:bg-gray-50
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
          touch-target touch-comfortable
        "
        disabled={isConfirming}
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={isConfirming}
        className={`
          w-full sm:w-auto
          px-4 py-3 sm:py-2
          text-sm font-medium
          rounded-lg
          focus:outline-none focus:ring-2 focus:ring-offset-2
          touch-target touch-comfortable
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[confirmVariant]}
        `}
      >
        {isConfirming ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          confirmLabel
        )}
      </button>
    </>
  );

  return (
    <Modal {...modalProps} footer={footer} size="sm">
      {children}
    </Modal>
  );
};

export default Modal;
