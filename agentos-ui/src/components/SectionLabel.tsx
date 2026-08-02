import type { ReactNode } from 'react'

interface SectionLabelProps {
  children: ReactNode
  icon?: string
  className?: string
}

export function SectionLabel({ children, icon, className }: SectionLabelProps) {
  return (
    <div className={`section-label ${className || ''}`}>
      {icon && <span className="ico" aria-hidden="true">{icon}</span>}
      {children}
    </div>
  )
}