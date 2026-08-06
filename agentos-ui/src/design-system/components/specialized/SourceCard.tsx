// SourceCard - Shared AI Component (adapted from ModelCard for Memory sources)
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../data-display/Card'
import { Badge } from '../data-display/Badge'
import { Button } from '../data-display/Button'

export interface MemorySource {
  id: string
  name: string
  type: 'obsidian' | 'omi' | 'manual' | 'imported' | 'api' | 'github' | 'notion' | 'linear' | 'readwise' | 'telegram' | 'rss'
  status: 'connected' | 'disconnected' | 'syncing' | 'error'
  notesCount: number
  lastSync: string
  config: Record<string, any>
  syncEnabled?: boolean
  errorMessage?: string
}

export type SourceCardVariant = 'default' | 'compact' | 'detailed'

const SOURCE_TYPE_COLORS: Record<string, string> = {
  obsidian: '#7c6cf5',
  omi: '#00e5ff',
  manual: '#22d97a',
  imported: '#ffb347',
  api: '#f06292',
  github: '#22d97a',
  notion: '#f06292',
  linear: '#ff4d6d',
  readwise: '#ff4d6d',
  telegram: '#00e5ff',
  rss: '#22d97a',
}

const SOURCE_TYPE_ICONS: Record<string, string> = {
  obsidian: '◧',
  omi: '◉',
  manual: '✎',
  imported: '↻',
  api: '⊕',
  github: '⌘',
  notion: '◈',
  linear: '◬',
  readwise: '◉',
  telegram: '➤',
  rss: '⊕',
}

const STATUS_BADGE: Record<string, 'warning' | 'info' | 'success' | 'default' | 'error' | 'primary' | 'secondary'> = {
  connected: 'success',
  disconnected: 'error',
  syncing: 'warning',
  error: 'error',
}

interface SourceCardProps {
  source: MemorySource
  variant?: SourceCardVariant
  onSync?: () => void
  onConfigure?: () => void
  onDisconnect?: () => void
  showActions?: boolean
}

export function SourceCard({
  source,
  variant = 'default',
  onSync,
  onConfigure,
  onDisconnect,
  showActions = true,
}: SourceCardProps) {
  const typeColor = SOURCE_TYPE_COLORS[source.type] || '#9ba4c0'
  const typeIcon = SOURCE_TYPE_ICONS[source.type] || '⊕'
  const statusVariant = STATUS_BADGE[source.status] || 'default'

  if (variant === 'compact') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-3)',
          padding: 'var(--spacing-3)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface-container)',
          border: '1px solid var(--color-border-primary)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--text-display-sm)',
            color: typeColor,
            fontFamily: 'var(--font-heading)',
          }}
        >
          {SOURCE_TYPE_ICONS[source.type] || '⊕'}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-md)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {source.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-1)' }}>
            <Badge variant={statusVariant} size="sm" dot>
              {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
            </Badge>
            <span style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              {source.notesCount} notes
            </span>
          </div>
        </div>
        {showActions && onSync && (
          <Button variant="ghost" size="sm" onClick={onSync} disabled={source.status === 'syncing'}>
            {source.status === 'syncing' ? 'Syncing...' : 'Sync'}
          </Button>
        )}
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <Card
        variant="elevated"
        style={{
          borderLeft: `4px solid ${SOURCE_TYPE_COLORS[source.type] || '#9ba4c0'}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <span
              style={{
                fontSize: 'var(--text-display-lg)',
                color: typeColor,
                fontFamily: 'var(--font-heading)',
              }}
            >
              {SOURCE_TYPE_ICONS[source.type] || '⊕'}
            </span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-lg)', fontFamily: 'var(--font-heading)' }}>
                {source.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-1)' }}>
                <Badge variant="default" size="sm">
                  {source.type.toUpperCase()}
                </Badge>
                <Badge variant={STATUS_BADGE[source.status] || 'default'} size="sm" dot>
                  {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
          {source.errorMessage && (
            <Badge variant="error" size="sm" style={{ marginTop: 'var(--spacing-2)' }}>
              {source.errorMessage}
            </Badge>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              Notes
            </div>
            <div style={{ fontSize: 'var(--text-body-lg)', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
              {source.notesCount.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              Last Sync
            </div>
            <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
              {source.lastSync}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              Status
            </div>
            <Badge variant={STATUS_BADGE[source.status] || 'default'} size="sm" dot>
              {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
            </Badge>
          </div>
        </div>

        {source.config && Object.keys(source.config).length > 0 && (
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
              Configuration
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-2)' }}>
              {Object.entries(source.config).map(([key, value]) => (
                <div key={key} style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-primary)' }}>
                  <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
                    {key}
                  </div>
                  <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>
                    {String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showActions && (
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <Button variant="primary" size="sm" onClick={onSync} disabled={source.status === 'syncing'}>
              {source.status === 'syncing' ? 'Syncing...' : 'Sync Now'}
            </Button>
            <Button variant="secondary" size="sm" onClick={onConfigure}>
              Configure
            </Button>
            <Button variant="ghost" size="sm" onClick={onDisconnect} style={{ color: 'var(--color-error-base)', borderColor: 'var(--color-error-base)' }}>
              Disconnect
            </Button>
          </div>
        )}
      </Card>
    )
  }

  // Default variant
  return (
    <Card
      variant="outlined"
      style={{
        borderLeft: `3px solid ${typeColor}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <span
            style={{
              fontSize: 'var(--text-display-md)',
              color: typeColor,
              fontFamily: 'var(--font-heading)',
            }}
          >
            {typeIcon}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-md)', fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {source.name}
            </div>
            <Badge variant="default" size="sm">
              {source.type.toUpperCase()}
            </Badge>
          </div>
        </div>
        <Badge variant={statusVariant} size="sm" dot>
          {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
        </Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
        <div className="panel-sm">
          <div className="stat-label">NOTES</div>
          <div className="stat-val" style={{ fontSize: 18 }}>{source.notesCount.toLocaleString()}</div>
        </div>
        <div className="panel-sm">
          <div className="stat-label">LAST SYNC</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{source.lastSync}</div>
        </div>
      </div>

      <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
        CONFIGURATION
      </div>
      <div style={{ fontSize: 'var(--text-label-xs)', color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.8 }}>
        {Object.entries(source.config).map(([k, v]) => (
          <div key={k}><span style={{ color: '#6b7494' }}>{k}:</span> <span>{String(v)}</span></div>
        ))}
        {Object.keys(source.config).length === 0 && <div>No configuration</div>}
      </div>

      {showActions && (
        <div style={{ marginTop: 'var(--spacing-4)', display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="primary" size="sm" onClick={onSync} disabled={source.status === 'syncing'}>
            {source.status === 'syncing' ? 'Syncing...' : 'Sync Now'}
          </Button>
          <Button variant="secondary" size="sm" onClick={onConfigure}>
            Configure
          </Button>
          <Button variant="ghost" size="sm" onClick={onDisconnect} style={{ color: 'var(--color-error-base)', borderColor: 'var(--color-error-base)' }}>
            Disconnect
          </Button>
        </div>
      )}
    </Card>
  )
}