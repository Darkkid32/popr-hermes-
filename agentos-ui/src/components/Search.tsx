import type { ChangeEvent, KeyboardEvent } from 'react'

interface SearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function Search({ value, onChange, placeholder = 'Search...', className }: SearchProps) {
  return (
    <div
      className={`search-input ${className || ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: '#141830',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 8,
        padding: '8px 12px',
        flex: 1,
        minWidth: 240,
      }}
    >
      <span style={{ color: '#6b7494', fontSize: 14 }}>⌕</span>
      <input
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
            e.preventDefault()
          }
        }}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: 'transparent',
          fontSize: 13,
          color: '#e8eaf6',
          border: 'none',
          outline: 'none',
        }}
      />
      <span style={{ fontSize: 10, color: '#4a5170' }} className="mono">⌘F</span>
    </div>
  )
}