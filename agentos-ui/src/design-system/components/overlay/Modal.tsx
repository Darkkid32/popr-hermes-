// Modal Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import React, { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils';
import { Button } from '../data-display/Button';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useClickOutside } from '../../hooks/useClickOutside';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className,
  style,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Focus trap
  useFocusTrap(modalRef, { enabled: isOpen });

  // Click outside to close
  useClickOutside(modalRef, onClose, isOpen && closeOnOverlayClick);

  // Escape key to close
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Manage focus on open/close
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        modalRef.current?.focus();
      }, 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={cn(
        'fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4',
        'animate-fade-in'
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        aria-hidden="true"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'relative w-full bg-[var(--color-surface-container)] border border-[var(--color-border-primary)]',
          'rounded-[var(--radius-xl)] shadow-[var(--shadow-level4)]',
          'animate-scale-in',
          sizeStyles[size],
          className
        )}
        style={style}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between px-6 py-4 border-b border-[var(--color-border-primary)]">
            <div>
              <h2 id="modal-title" className="text-[var(--text-title-lg)] font-semibold text-[var(--color-text-primary)]">
                {title}
              </h2>
              {description && (
                <p id="modal-description" className="mt-1 text-[var(--text-body-sm)] text-[var(--color-text-tertiary)]">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                className="p-1 rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-high)] transition-colors"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4" style={{ maxHeight: '60vh', overflow: 'auto' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--color-border-primary)] bg-[var(--color-surface-container-high)] rounded-b-[var(--radius-xl)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

Modal.displayName = 'Modal';

// Alert Modal - specialized for confirmations
export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  confirmLoading?: boolean;
}

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  confirmLoading = false,
}: AlertModalProps) => {
  const variantStyles = {
    danger: { button: 'bg-[var(--color-error-base)] hover:bg-[var(--color-error-base)]/90 text-white', icon: '⚠️' },
    warning: { button: 'bg-[var(--color-warning-base)] hover:bg-[var(--color-warning-base)]/90 text-black', icon: '⚠️' },
    info: { button: 'bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-base)]/90 text-white', icon: 'ℹ️' },
  };

  const style = variantStyles[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={confirmLoading}>
            {cancelText}
          </Button>
          <Button
            style={{ backgroundColor: style.button.split(' ')[0].replace('bg-', ''), color: style.button.includes('text-black') ? 'black' : 'white' }}
            onClick={onConfirm}
            disabled={confirmLoading}
          >
            {confirmLoading ? 'Confirming...' : confirmText}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 'var(--text-display-lg)', marginTop: 'var(--spacing-1)' }}>{style.icon}</span>
        <div>
          <p className="text-[var(--text-body-md)] text-[var(--color-text-primary)]">{message}</p>
        </div>
      </div>
    </Modal>
  );
};

AlertModal.displayName = 'AlertModal';