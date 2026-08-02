import type { ReactNode, CSSProperties } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
  bordered?: boolean
  elevated?: boolean
  accentColor?: string
}

export function Card({ 
  children, 
  className = '', 
  style, 
  onClick, 
  bordered = true, 
  elevated = false, 
  accentColor 
}: CardProps) {
  const baseStyle: React.CSSProperties = {
    background: elevated ? 'var(--bg-1)' : 'var(--bg-2)',
    border: bordered ? '1px solid var(--border)' : 'none',
    borderRadius: 10,
    padding: 16,
    ...(accentColor && { borderLeft: `3px solid ${accentColor}` }),
    ...style,
  }

  return (
    <div
      className={`panel ${elevated ? 'elevated' : ''} ${className}`}
      style={baseStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={onClick ? false : undefined}
    >
      {children}
    </div>
  )
}

interface CardSmallProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export function CardSmall({ children, className = '', style }: CardSmallProps) {
  return (
    <div className={`panel-sm ${className}`} style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, ...style }}>
      {children}
    </div>
  )
}