// EndpointCard - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../data-display/Card'
import { Badge } from '../data-display/Badge'
import { Button } from '../data-display/Button'

export interface Model {
  id: string
  name: string
  provider: string
  providerId: string
}

export interface Endpoint {
  id: string
  name: string
  modelId: string
  type: 'chat' | 'completion' | 'embedding'
  status: 'healthy' | 'degraded' | 'down'
  latency: string
  uptime: string
  auth: 'bearer' | 'api-key' | 'none'
  url: string
  region?: string
}

export interface EndpointCardProps {
  endpoint: Endpoint
  model?: Model
  onTest?: () => void
  isTesting?: boolean
  showMetrics?: boolean
  variant?: 'default' | 'compact' | 'row'
}

const TYPE_COLORS: Record<string, string> = {
  chat: 'var(--color-info-base)',
  completion: 'var(--color-warning-base)',
  embedding: 'var(--color-purple-base)',
}

const TYPE_ICONS: Record<string, string> = {
  chat: '◌',
  completion: '◧',
  embedding: '◉',
}

const STATUS_BADGE: Record<string, 'warning' | 'info' | 'success' | 'default' | 'error' | 'primary' | 'secondary'> = {
  healthy: 'success',
  degraded: 'warning',
  down: 'error',
}

export function EndpointCard({
  endpoint,
  model,
  onTest,
  isTesting = false,
  showMetrics = true,
  variant = 'default',
}: EndpointCardProps) {
  const typeColor = TYPE_COLORS[endpoint.type] || 'var(--color-text-tertiary)'
  const typeIcon = TYPE_ICONS[endpoint.type] || '◌'
  const statusVariant = STATUS_BADGE[endpoint.status] || 'default'
  const modelName = model?.name || endpoint.modelId

  if (variant === 'compact') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
        <span style={{ fontSize: 'var(--text-display-sm)', color: typeColor, fontFamily: 'var(--font-heading)' }}>{typeIcon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-md)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{endpoint.name}</div>
          <div style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{modelName} · {endpoint.type}</div>
        </div>
        <Badge variant={statusVariant} size="sm">{endpoint.status}</Badge>
        {showMetrics && (
          <span style={{ fontSize: 'var(--text-label-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)', minWidth: 70, textAlign: 'right' }}>{endpoint.latency}</span>
        )}
        {onTest && (
          <Button variant="ghost" size="sm" onClick={onTest} disabled={isTesting}>
            {isTesting ? 'Testing...' : 'Test'}
          </Button>
        )}
      </div>
    )
  }

  if (variant === 'row') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-2) 0', borderBottom: '1px solid var(--color-border-primary)' }}>
        <span style={{ fontSize: 'var(--text-display-sm)', color: typeColor, fontFamily: 'var(--font-heading)' }}>{typeIcon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 500, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-sm)' }}>{endpoint.name}</div>
          <div style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{modelName} · {endpoint.type}</div>
        </div>
        <Badge variant={statusVariant} size="sm">{endpoint.status}</Badge>
        {showMetrics && (
          <>
            <span style={{ fontSize: 'var(--text-label-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', minWidth: 80, textAlign: 'right' }}>{endpoint.latency}</span>
            <span style={{ fontSize: 'var(--text-label-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)', minWidth: 60, textAlign: 'right' }}>{endpoint.uptime}</span>
          </>
        )}
        <Badge variant="default" size="sm" style={{ textTransform: 'uppercase' }}>{endpoint.auth}</Badge>
        {onTest && (
          <Button variant="ghost" size="sm" onClick={onTest} disabled={isTesting} style={{ fontSize: 'var(--text-label-xs)', padding: '2px 8px' }}>
            {isTesting ? 'Testing...' : 'Test'}
          </Button>
        )}
      </div>
    )
  }

  // Default variant - full card
  return (
    <Card variant="outlined">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <span style={{ fontSize: 'var(--text-display-lg)', color: typeColor, fontFamily: 'var(--font-heading)' }}>{typeIcon}</span>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-lg)' }}>{endpoint.name}</div>
            <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>{modelName} · {endpoint.type}</div>
          </div>
        </div>
        <Badge variant={statusVariant} size="md" dot>{endpoint.status}</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)' }}>
        {showMetrics && (
          <>
            <div>
              <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Latency</div>
              <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{endpoint.latency}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Uptime</div>
              <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{endpoint.uptime}</div>
            </div>
          </>
        )}
        <div>
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Auth</div>
          <Badge variant="default" size="sm" style={{ textTransform: 'uppercase' }}>{endpoint.auth}</Badge>
        </div>
        {endpoint.region && (
          <div>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Region</div>
            <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{endpoint.region}</div>
          </div>
        )}
      </div>

      <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)', fontFamily: 'var(--font-mono)' }}>
        Endpoint URL
      </div>
      <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-label-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>
        {endpoint.url}
      </div>

      {onTest && (
        <div style={{ marginTop: 'var(--spacing-4)', display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="primary" size="sm" onClick={onTest} disabled={isTesting}>
            {isTesting ? 'Testing...' : 'Test Endpoint'}
          </Button>
        </div>
      )}
    </Card>
  )
}