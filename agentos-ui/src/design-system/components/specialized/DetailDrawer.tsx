// DetailDrawer - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useEffect, useRef } from 'react'
import { Button } from '../data-display/Button'

export type DetailDrawerSize = 'sm' | 'md' | 'lg' | 'full'

const SIZE_STYLES: Record<DetailDrawerSize, { width: string; maxWidth: string }> = {
  sm: { width: '320px', maxWidth: '320px' },
  md: { width: '480px', maxWidth: '480px' },
  lg: { width: '640px', maxWidth: '640px' },
  full: { width: '100%', maxWidth: '100%' },
}

interface DetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: React.ReactNode
  subtitle?: React.ReactNode
  children: React.ReactNode
  actions?: React.ReactNode
  size?: DetailDrawerSize
  headerIcon?: React.ReactNode
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

export function DetailDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  actions,
  size = 'md',
  headerIcon,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: DetailDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
      setTimeout(() => drawerRef.current?.focus(), 0)
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus()
    }
  }, [isOpen])

  // Escape key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape && isOpen) {
        onClose()
      }
      if (e.key === 'Tab' && isOpen && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<
          HTMLElement
        >(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeOnEscape])

  if (!isOpen) return null

  const sizeStyle = SIZE_STYLES[size]

  return (
    <>
      <div
        className="drawer-overlay"
        onClick={closeOnOverlayClick ? onClose : undefined}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          animation: 'fadeIn var(--motion-duration-snap) var(--motion-easing-standard)',
        }}
      />
      <div
        ref={drawerRef}
        className="drawer"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: sizeStyle.width,
          maxWidth: sizeStyle.maxWidth,
          backgroundColor: 'var(--color-background-base)',
          borderLeft: '1px solid var(--color-border-primary)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight var(--motion-duration-smooth) var(--motion-easing-standard)',
          overflow: 'hidden',
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: 'var(--spacing-4) var(--spacing-5)',
            borderBottom: '1px solid var(--color-border-primary)',
            backgroundColor: 'var(--color-surface)',
            flexShrink: 0,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            {headerIcon && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                <span style={{ fontSize: 'var(--text-display-sm)' }}>{headerIcon}</span>
              </div>
            )}
            <h2
              id="drawer-title"
              style={{
                fontSize: 'var(--text-body-lg)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-heading)',
                margin: 0,
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', margin: 'var(--spacing-1) 0 0 0' }}>
                {subtitle}
              </p>
            )}
          </div>
          {showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close drawer"
              style={{
                padding: 'var(--spacing-1)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Button>
          )}
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 'var(--spacing-5)',
          }}
        >
          {children}
        </div>

        {/* Actions Footer */}
        {actions && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--spacing-3)',
              padding: 'var(--spacing-4) var(--spacing-5)',
              borderTop: '1px solid var(--color-border-primary)',
              backgroundColor: 'var(--color-surface)',
              flexShrink: 0,
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </>
  )
}

// Convenience component for simple detail drawers
export function SimpleDetailDrawer({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: DetailDrawerSize
}) {
  return (
    <DetailDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      actions={
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      }
    >
      {children}
    </DetailDrawer>
  )
}