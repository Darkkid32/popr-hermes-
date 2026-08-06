// InspectorPanel - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import React from 'react'

export interface InspectorPanelProps {
  title: string
  children: React.ReactNode
  isOpen?: boolean
  onToggle?: (open: boolean) => void
  actions?: React.ReactNode
  defaultOpen?: boolean
  position?: 'right' | 'left'
  width?: string
}

export function InspectorPanel({
  title,
  children,
  isOpen: controlledIsOpen,
  onToggle,
  actions,
  defaultOpen = false,
  position = 'right',
  width = '380px',
}: InspectorPanelProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = React.useState(defaultOpen)
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen
  const isControlled = controlledIsOpen !== undefined
  const setIsOpen = isControlled ? (onToggle ?? (() => {})) : setUncontrolledIsOpen

  const handleToggle = (open: boolean) => {
    setIsOpen(open)
    if (onToggle) onToggle(open)
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: position === 'right' ? 'row-reverse' : 'row',
      }}
    >
      {/* Main content area */}
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>

      {/* Inspector Panel */}
      <div
        style={{
          width: isOpen ? width : 'auto',
          minWidth: isOpen ? width : '40px',
          maxWidth: isOpen ? width : '40px',
          backgroundColor: 'var(--color-surface)',
          borderLeft: position === 'right' ? '1px solid var(--color-border-primary)' : 'none',
          borderRight: position === 'left' ? '1px solid var(--color-border-primary)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width var(--motion-duration-smooth) var(--motion-easing-standard), min-width var(--motion-duration-smooth) var(--motion-easing-standard), max-width var(--motion-duration-smooth) var(--motion-easing-standard)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--spacing-3) var(--spacing-4)',
            borderBottom: '1px solid var(--color-border-primary)',
            flexShrink: 0,
            cursor: 'pointer',
          }}
          onClick={() => handleToggle(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="inspector-panel-content"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', overflow: 'hidden' }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                color: 'var(--color-text-tertiary)',
                flexShrink: 0,
                transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform var(--motion-duration-snap) var(--motion-easing-standard)',
              }}
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
            <span
              style={{
                fontSize: 'var(--text-label-sm)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-text-secondary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title.toUpperCase()}
            </span>
          </div>
          {actions && isOpen && <div>{actions}</div>}
        </div>

        <div
          id="inspector-panel-content"
          style={{
            flex: 1,
            overflow: isOpen ? 'auto' : 'hidden',
            opacity: isOpen ? 1 : 0,
            transition: 'opacity var(--motion-duration-snap) var(--motion-easing-standard)',
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
        >
          {isOpen && (
            <div style={{ padding: 'var(--spacing-4)' }}>{children}</div>
          )}
        </div>
      </div>
    </div>
  )
}

// Simplified version for use as a sidebar section
export function InspectorSection({
  title,
  children,
  isOpen = true,
  onToggle,
  actions,
}: {
  title: string
  children: React.ReactNode
  isOpen?: boolean
  onToggle?: (open: boolean) => void
  actions?: React.ReactNode
}) {
  return (
    <div style={{ borderBottom: '1px solid var(--color-border-primary)', overflow: 'hidden' }}>
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: 'var(--spacing-3) var(--spacing-4)',
          background: 'none',
          border: 'none',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--text-label-sm)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          textAlign: 'left',
        }}
        onClick={() => onToggle?.(!isOpen)}
        aria-expanded={isOpen}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{
              color: 'var(--color-text-tertiary)',
              flexShrink: 0,
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform var(--motion-duration-snap) var(--motion-easing-standard)',
            }}
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          {title.toUpperCase()}
        </span>
        {actions}
      </button>
      <div
        style={{
          maxHeight: isOpen ? '500px' : 0,
          opacity: isOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height var(--motion-duration-smooth) var(--motion-easing-standard), opacity var(--motion-duration-snap) var(--motion-easing-standard)',
        }}
      >
        <div style={{ padding: 'var(--spacing-0) var(--spacing-4) var(--spacing-4) var(--spacing-4)' }}>{children}</div>
      </div>
    </div>
  )
}