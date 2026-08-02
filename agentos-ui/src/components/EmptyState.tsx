import type { ReactNode, CSSProperties } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
  }
  className?: string
  style?: CSSProperties
}

export function EmptyState({ 
  title, 
  description, 
  icon, 
  action, 
  className = '', 
  style 
}: EmptyStateProps) {
  return (
    <div
      className={`empty-state ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 64,
        textAlign: 'center',
        color: 'var(--text-3)',
        ...style,
      }}
    >
      {icon && (
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--bg-3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            color: 'var(--text-3)',
          }}
        >
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8, fontFamily: 'Space Grotesk, sans-serif' }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: 13, color: 'var(--text-2)', maxWidth: 320, lineHeight: 1.6, marginBottom: 24 }}>
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className={`btn-${action.variant || 'primary'}`}
          style={{
            padding: '8px 20px',
            fontSize: '12px',
            borderRadius: 6,
            fontWeight: 600,
            cursor: 'pointer',
            background: action.variant === 'primary' 
              ? 'linear-gradient(135deg, #d946ef 0%, #f06292 100%)'
              : 'var(--bg-3)',
            color: action.variant === 'primary' ? '#fff' : 'var(--text)',
            border: action.variant === 'primary' ? 'none' : '1px solid var(--border-2)',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}