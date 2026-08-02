interface PageHeaderProps {
  roman?: string
  eyebrow?: string
  title: string
  sub?: string
  icon?: string
}

export function PageHeader({ roman, eyebrow, title, sub, icon }: PageHeaderProps) {
  return (
    <div className="page-header">
      {(eyebrow || roman) && (
        <div className="page-eyebrow">
          {roman && <span className="roman">{roman}</span>}
          {roman && eyebrow && <span className="sep">/</span>}
          {eyebrow && <span>{eyebrow}</span>}
          {icon && <span className="ico" aria-hidden="true">{icon}</span>}
        </div>
      )}
      <h1 className="page-title">{title}</h1>
      {sub && <p className="page-sub">{sub}</p>}
    </div>
  )
}