import type { ReactNode, CSSProperties } from 'react'

interface TableColumn<T> {
  key: string
  header: string
  render: (item: T, index: number) => ReactNode
  width?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (item: T, index: number) => string
  onRowClick?: (item: T, index: number) => void
  selectedKey?: string | null
  emptyMessage?: string
  className?: string
  style?: CSSProperties
  stickyHeader?: boolean
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  selectedKey,
  emptyMessage = 'No data available',
  className = '',
  style,
  stickyHeader = false,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="empty-state" style={{ padding: 48, textAlign: 'center', color: 'var(--text-3)' }}>
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={`table-container ${className}`} style={style}>
      <div className="table-header" style={{ display: 'flex', borderBottom: '1px solid var(--border)', fontSize: '9.5px', color: 'var(--text-3)', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', position: stickyHeader ? 'sticky' : 'static', top: 0, background: 'var(--bg-2)', zIndex: 1 }}>
        {columns.map((col) => (
          <div
            key={col.key}
            style={{
              minWidth: col.width,
              textAlign: col.align || 'left',
              padding: '12px 16px',
              cursor: col.sortable ? 'pointer' : undefined,
            }}
          >
            {col.header}
          </div>
        ))}
      </div>
      <div className="table-body" style={{ maxHeight: 600, overflowY: 'auto' }}>
        {data.map((item, index) => {
          const key = keyExtractor(item, index)
          const isSelected = selectedKey === key
          return (
            <div
              key={key}
              className="table-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                borderBottom: '1px solid var(--border)',
                background: isSelected ? 'rgba(217, 70, 239, 0.08)' : undefined,
                cursor: onRowClick ? 'pointer' : undefined,
              }}
              onClick={() => onRowClick?.(item, index)}
              role={onRowClick ? 'button' : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick?.(item, index) } }}
            >
              {columns.map((col) => (
                <div
                  key={col.key}
                  style={{
                    minWidth: col.width,
                    textAlign: col.align || 'left',
                    flex: col.width ? 0 : 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.render(item, index)}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}