import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  tone?: 'green' | 'cyan' | 'purple' | 'amber' | 'red' | 'gray' | 'pink' | 'blue' | 'pink'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
}

const toneColors: Record<string, { bg: string; color: string }> = {
  green: { bg: 'rgba(34, 217, 122, 0.12)', color: '#22d97a' },
  cyan: { bg: 'rgba(0, 229, 255, 0.10)', color: '#00e5ff' },
  purple: { bg: 'rgba(124, 108, 245, 0.12)', color: '#7c6cf5' },
  amber: { bg: 'rgba(255, 179, 71, 0.12)', color: '#ffb347' },
  red: { bg: 'rgba(255, 77, 109, 0.12)', color: '#ff4d6d' },
  gray: { bg: 'rgba(255, 255, 255, 0.06)', color: '#9ba4c0' },
  pink: { bg: 'rgba(217, 70, 239, 0.12)', color: '#d946ef' },
  blue: { bg: 'rgba(0, 112, 255, 0.12)', color: '#0070ff' },
}

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '2px 6px', fontSize: '9.5px' },
  md: { padding: '3px 8px', fontSize: '10.5px' },
  lg: { padding: '4px 10px', fontSize: '11.5px' },
}

export function Badge({ 
  children, 
  tone = 'gray', 
  size = 'md', 
  className = '', 
  style 
}: BadgeProps) {
  const colors = toneColors[tone] || toneColors.gray
  return (
    <span
      className={`badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        borderRadius: 5,
        fontWeight: 600,
        letterSpacing: '0.02em',
        background: colors.bg,
        color: colors.color,
        ...sizeStyles[size],
        ...style,
      }}
    >
      {children}
    </span>
  )
}