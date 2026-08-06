// SettingsSection - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../data-display/Card'

export interface SettingRow {
  label: string
  value: string | React.ReactNode
  tone?: 'cyan' | 'green' | 'purple' | 'pink' | 'dim' | 'amber' | 'red' | 'blue' | 'orange'
  action?: React.ReactNode
  description?: string
}

export type SettingsSectionColumns = 1 | 2 | 3

const TONE_COLORS: Record<string, string> = {
  cyan: 'var(--color-info-base)',
  green: 'var(--color-success-base)',
  purple: 'var(--color-purple-base)',
  pink: 'var(--color-pink-base)',
  dim: 'var(--color-text-tertiary)',
  amber: 'var(--color-warning-base)',
  red: 'var(--color-error-base)',
  blue: 'var(--color-blue-base)',
  orange: 'var(--color-orange-base)',
  undefined: 'var(--color-text-primary)',
}

const getToneColor = (tone?: string) => TONE_COLORS[tone || ''] || TONE_COLORS.undefined

interface SettingsSectionProps {
  title: string
  icon?: React.ReactNode
  rows: SettingRow[]
  columns?: SettingsSectionColumns
  variant?: 'default' | 'compact' | 'card'
  className?: string
  actions?: React.ReactNode
}

export function SettingsSection({
  title,
  icon,
  rows,
  columns = 1,
  variant = 'default',
  className = '',
  actions,
}: SettingsSectionProps) {
  if (variant === 'compact') {
    return (
      <div className={`settings-section-compact ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            {icon && <span style={{ fontSize: 'var(--text-body-lg)' }}>{icon}</span>}
            <span style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
              {title.toUpperCase()}
            </span>
          </div>
          {actions}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
          {rows.map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-2) var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
              <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', flex: 1 }}>{row.label}</span>
              <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: getToneColor(row.tone), fontFamily: row.tone === 'cyan' || row.tone === 'green' ? 'var(--font-mono)' : 'inherit' }}>
                {row.value}
              </span>
              {row.action}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <Card variant="outlined" className={`settings-section-card ${className}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            {icon && <span style={{ fontSize: 'var(--text-display-sm)' }}>{icon}</span>}
            <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
              {title.toUpperCase()}
            </span>
          </div>
          {actions}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 'var(--spacing-4)' }}>
          {rows.map((row, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
                {row.label}
              </div>
              <div style={{ fontSize: 'var(--text-body-md)', fontWeight: row.tone === 'cyan' || row.tone === 'green' ? 600 : 400, color: getToneColor(row.tone), fontFamily: row.tone === 'cyan' || row.tone === 'green' ? 'var(--font-mono)' : 'inherit' }}>
                {row.value}
              </div>
              {row.description && (
                <div style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-quaternary)' }}>
                  {row.description}
                </div>
              )}
              {row.action}
            </div>
          ))}
        </div>
      </Card>
    )
  }

  // Default variant - table rows
  return (
    <Card variant="elevated" className={`settings-section ${className}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          {icon && <span style={{ fontSize: 'var(--text-display-sm)' }}>{icon}</span>}
          <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
            {title.toUpperCase()}
          </span>
        </div>
        {actions}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--spacing-3) 0',
              borderBottom: i < rows.length - 1 ? '1px solid var(--color-border-primary)' : 'none',
            }}
          >
            <span style={{ fontSize: 'var(--text-body-md)', color: 'var(--color-text-primary)', flex: 1 }}>{row.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <span style={{ fontSize: 'var(--text-body-md)', fontWeight: row.tone === 'cyan' || row.tone === 'green' ? 600 : 400, color: getToneColor(row.tone), fontFamily: row.tone === 'cyan' || row.tone === 'green' ? 'var(--font-mono)' : 'inherit' }}>
                {row.value}
              </span>
              {row.action}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// Simple settings panel for grid layouts
export function SettingsPanel({
  title,
  icon,
  rows,
}: {
  title: string
  icon?: React.ReactNode
  rows: SettingRow[]
}) {
  return (
    <Card variant="elevated">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
        {icon && <span style={{ fontSize: 'var(--text-display-sm)' }}>{icon}</span>}
        <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
          {title.toUpperCase()}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--spacing-2) 0',
              borderBottom: i < rows.length - 1 ? '1px solid var(--color-border-primary)' : 'none',
            }}
          >
            <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)' }}>{row.label}</span>
            <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: row.tone === 'cyan' || row.tone === 'green' ? 600 : 400, color: getToneColor(row.tone), fontFamily: row.tone === 'cyan' || row.tone === 'green' ? 'var(--font-mono)' : 'inherit' }}>
              {row.value}
            </span>
            {row.action}
          </div>
        ))}
      </div>
    </Card>
  )
}