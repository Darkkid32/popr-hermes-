import type { ReactNode } from 'react'

interface PillProps {
  children: ReactNode
  tone: 'green' | 'cyan' | 'purple' | 'amber' | 'red' | 'gray' | 'pink'
  dot?: boolean
  className?: string
}

export function StatusPill({ children, tone, dot, className }: PillProps) {
  return (
    <span className={`badge badge-${tone} ${className || ''}`}>
      {dot && <span className={`dot dot-${tone}`} aria-hidden="true" />}
      {children}
    </span>
  )
}

interface StatusPillsProps {
  pills: Array<{
    label: ReactNode
    tone: 'green' | 'cyan' | 'purple' | 'amber' | 'red' | 'gray' | 'pink'
    dot?: boolean
    className?: string
  }>
  className?: string
}

export function StatusPills({ pills, className }: StatusPillsProps) {
  return (
    <div className={`status-pills ${className || ''}`}>
      {pills.map((pill, i) => (
        <StatusPill key={i} tone={pill.tone} dot={pill.dot} className={pill.className}>
          {pill.label}
        </StatusPill>
      ))}
    </div>
  )
}