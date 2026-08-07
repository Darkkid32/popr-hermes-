// MCPServerCard - Shared AI Component
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { Card } from '../data-display/Card'
import { Badge } from '../data-display/Badge'
import { Button } from '../data-display/Button'
import { ProviderBadge } from './ProviderBadge'

export interface MCPServer {
  id: string
  name: string
  description: string
  version: string
  author: string
  category: 'filesystem' | 'database' | 'api' | 'tool' | 'integration' | 'custom'
  status: 'connected' | 'disconnected' | 'connecting' | 'error'
  transport: 'stdio' | 'sse' | 'websocket'
  endpoint: string
  config: Record<string, any>
  tools: Array<{ name: string; description: string; inputSchema: any }>
  resources: Array<{ uri: string; name: string; description: string; mimeType: string }>
  prompts: Array<{ name: string; description: string; arguments: any }>
  capabilities: string[]
  installDate: string
  lastUpdate: string
  lastConnected: string
  uptime: string
  requestsTotal: number
  requestsSuccess: number
  requestsFailed: number
  avgLatency: string
  icon: string
  iconColor: string
  tags: string[]
}

export type MCPServerCardVariant = 'default' | 'compact' | 'detailed'

const CATEGORY_COLORS: Record<string, string> = {
  filesystem: '#7c6cf5',
  database: '#00e5ff',
  api: '#22d97a',
  tool: '#ffb347',
  integration: '#f06292',
  custom: '#9ba4c0',
}

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  connected: 'success',
  disconnected: 'error',
  connecting: 'warning',
  error: 'error',
}

const TRANSPORT_ICONS: Record<string, string> = {
  stdio: '📟',
  sse: '📡',
  websocket: '🔌',
}

function getConnectButtonVariant(status: string): 'primary' | 'secondary' {
  return status === 'connected' ? 'secondary' : 'primary'
}

function getConnectButtonText(status: string): string {
  return status === 'connected' ? 'Disconnect' : status === 'connecting' ? 'Connecting...' : 'Connect'
}

interface MCPServerCardProps {
  server: MCPServer
  variant?: MCPServerCardVariant
  onClick?: () => void
  onConnect?: () => void
  onDisconnect?: () => void
  onConfigure?: () => void
  onExploreTools?: () => void
  onRemove?: () => void
  showActions?: boolean
}

export function MCPServerCard({
  server,
  variant = 'default',
  onClick,
  onConnect,
  onDisconnect,
  onConfigure,
  onExploreTools,
  onRemove,
  showActions = true,
}: MCPServerCardProps) {
  const categoryColor = CATEGORY_COLORS[server.category] || '#9ba4c0'
  const statusVariant = STATUS_BADGE[server.status] || 'default'

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
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={onClick}
      >
        <span
          style={{
            fontSize: 'var(--text-display-sm)',
            color: server.iconColor,
            fontFamily: 'var(--font-heading)',
          }}
        >
          {server.icon}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-md)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {server.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-1)' }}>
            <ProviderBadge simpleProvider={{ name: server.category, status: server.status, icon: server.icon, iconColor: server.iconColor }} size="sm" />
            <Badge variant="info" size="sm">{server.tools.length} tools</Badge>
          </div>
        </div>
        {showActions && onConnect && (
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onConnect?.() }} disabled={server.status === 'connected' || server.status === 'connecting'}>
            {server.status === 'connected' ? 'Connected' : server.status === 'connecting' ? 'Connecting...' : 'Connect'}
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
          borderLeft: `4px solid ${categoryColor}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <span
              style={{
                fontSize: 'var(--text-display-lg)',
                color: categoryColor,
                fontFamily: 'var(--font-heading)',
              }}
            >
              {server.icon}
            </span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-lg)', fontFamily: 'var(--font-heading)' }}>
                {server.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-1)' }}>
                <Badge variant="default" size="sm">
                  {server.category.toUpperCase()}
                </Badge>
                <Badge variant={STATUS_BADGE[server.status] || 'default'} size="sm" dot>
                  {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                </Badge>
                <Badge variant="info" size="sm">v{server.version}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              Tools
            </div>
            <div style={{ fontSize: 'var(--text-body-lg)', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
              {server.tools.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              Resources
            </div>
            <div style={{ fontSize: 'var(--text-body-lg)', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
              {server.resources.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              Prompts
            </div>
            <div style={{ fontSize: 'var(--text-body-lg)', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
              {server.prompts.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              Total Requests
            </div>
            <div style={{ fontSize: 'var(--text-body-lg)', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
              {server.requestsTotal.toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
            Transport
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <span style={{ fontSize: 'var(--text-display-md)' }}>{TRANSPORT_ICONS[server.transport] || '📟'}</span>
            <span style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              {server.transport}
            </span>
            <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              {server.endpoint}
            </span>
          </div>
        </div>

        {server.capabilities.length > 0 && (
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
              Capabilities
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
              {server.capabilities.map((cap) => (
                <Badge key={cap} variant="default" size="sm">{cap}</Badge>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
            Configuration
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-2)' }}>
            {Object.entries(server.config).map(([key, value]) => (
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

        {showActions && (
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
            <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); onExploreTools?.() }}>
              Explore Tools
            </Button>
            <Button variant={getConnectButtonVariant(server.status)} size="sm" onClick={(e) => { e.stopPropagation(); server.status === 'connected' ? onDisconnect?.() : onConnect?.() }} disabled={server.status === 'connecting'}>
              {getConnectButtonText(server.status)}
            </Button>
            <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); onConfigure?.() }}>
              Configure
            </Button>
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onRemove?.() }} style={{ color: 'var(--color-error-base)', borderColor: 'var(--color-error-base)' }}>
              Remove
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
        borderLeft: `3px solid ${categoryColor}`,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
          <span
            style={{
              fontSize: 'var(--text-display-md)',
              color: categoryColor,
              fontFamily: 'var(--font-heading)',
            }}
          >
            {server.icon}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 'var(--text-body-md)', fontFamily: 'var(--font-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {server.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', marginTop: 'var(--spacing-1)' }}>
              <Badge variant="default" size="sm">
                {server.category.toUpperCase()}
              </Badge>
              <Badge variant={statusVariant} size="sm" dot>
                {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-3)', lineHeight: 1.5 }}>
        {server.description}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
        <div className="panel-sm">
          <div className="stat-label">TOOLS</div>
          <div className="stat-val" style={{ fontSize: 18 }}>{server.tools.length}</div>
        </div>
        <div className="panel-sm">
          <div className="stat-label">REQUESTS</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>{server.requestsTotal.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
        <span style={{ fontSize: 'var(--text-display-md)', color: server.iconColor }}>{TRANSPORT_ICONS[server.transport] || '📟'}</span>
        <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
          {server.transport.toUpperCase()}
        </span>
        <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          {server.endpoint}
        </span>
      </div>

      <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
        TOOLS · {server.tools.length} · RESOURCES · {server.resources.length} · PROMPTS · {server.prompts.length}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-3)' }}>
        {server.tools.slice(0, 3).map((tool) => (
          <Badge key={tool.name} variant="default" size="sm">{tool.name}</Badge>
        ))}
        {server.tools.length > 3 && <Badge variant="default" size="sm">+{server.tools.length - 3}</Badge>}
      </div>

      {showActions && (
        <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
          <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); onExploreTools?.() }}>
            Explore Tools
          </Button>
          <Button variant={getConnectButtonVariant(server.status)} size="sm" onClick={(e) => { e.stopPropagation(); server.status === 'connected' ? onDisconnect?.() : onConnect?.() }} disabled={server.status === 'connecting'}>
            {getConnectButtonText(server.status)}
          </Button>
          <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); onConfigure?.() }}>
            Configure
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onRemove?.() }} style={{ color: 'var(--color-error-base)', borderColor: 'var(--color-error-base)' }}>
            Remove
          </Button>
        </div>
      )}
    </Card>
  )
}