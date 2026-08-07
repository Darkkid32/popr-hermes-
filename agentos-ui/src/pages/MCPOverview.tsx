// MCP Overview - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { MCP_SERVERS } from '../lib/mcp-data'
import { useMCPStore } from '../stores/MCPStore'
import { MCPServerCard } from '../design-system/components/specialized/MCPServerCard'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'

export function MCPOverview() {
  const { setActiveTab, setSelectedServer } = useMCPStore()

  const connectedCount = MCP_SERVERS.filter((s) => s.status === 'connected').length
  const disconnectedCount = MCP_SERVERS.filter((s) => s.status === 'disconnected').length
  const errorCount = MCP_SERVERS.filter((s) => s.status === 'error').length
  const totalRequests = MCP_SERVERS.reduce((sum, s) => sum + s.requestsTotal, 0)
  const totalTools = MCP_SERVERS.reduce((sum, s) => sum + s.tools.length, 0)
  const totalResources = MCP_SERVERS.reduce((sum, s) => sum + s.resources.length, 0)
  const totalPrompts = MCP_SERVERS.reduce((sum, s) => sum + s.prompts.length, 0)

  const stats = [
    { label: 'Connected', value: connectedCount, tone: 'var(--color-success-base)' },
    { label: 'Disconnected', value: disconnectedCount, tone: 'var(--color-error-base)' },
    { label: 'Errors', value: errorCount, tone: 'var(--color-error-base)' },
    { label: 'Total Tools', value: totalTools, tone: 'var(--color-info-base)' },
    { label: 'Resources', value: totalResources, tone: 'var(--color-purple-base)' },
    { label: 'Prompts', value: totalPrompts, tone: 'var(--color-pink-base)' },
  ]

  return (
    <div className="page-body">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <Badge variant="success" size="md" dot>{connectedCount} connected</Badge>
        <Badge variant="error" size="md" dot>{disconnectedCount + errorCount} offline</Badge>
        <Badge variant="info" size="md" dot>{MCP_SERVERS.length} servers</Badge>
        <Badge variant="primary" size="md" dot>{totalRequests.toLocaleString()} requests</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        {stats.map((stat) => (
          <Card key={stat.label} variant="outlined" style={{ padding: 'var(--spacing-3)' }}>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, color: stat.tone, fontFamily: 'var(--font-mono)' }}>
              {stat.value.toLocaleString()}
            </div>
          </Card>
        ))}
      </div>

      <Card variant="elevated" style={{ marginBottom: 'var(--spacing-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
            CONNECTED SERVERS · {MCP_SERVERS.length}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setActiveTab('servers')}>
            View All →
          </Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          {MCP_SERVERS.slice(0, 8).map((server) => (
            <MCPServerCard
              key={server.id}
              server={server}
              variant="compact"
              onClick={() => { setSelectedServer(server); setActiveTab('servers') }}
              showActions={false}
            />
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--spacing-3)' }}>
        <Card variant="outlined" style={{ padding: 'var(--spacing-4)' }}>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
            REQUEST BREAKDOWN
          </div>
          {MCP_SERVERS.slice(0, 5).map((server) => {
            const pct = server.requestsTotal > 0 ? Math.min((server.requestsTotal / Math.max(totalRequests, 1)) * 100, 100) : 0
            return (
              <div key={server.id} style={{ marginBottom: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-1)' }}>
                  <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    <span style={{ color: server.iconColor }}>{server.icon}</span> {server.name}
                  </span>
                  <span style={{ fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                    {server.requestsTotal.toLocaleString()} ({pct.toFixed(1)}%)
                  </span>
                </div>
                <div style={{ height: 6, backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, backgroundColor: server.iconColor, borderRadius: 'var(--radius-full)', transition: 'width var(--motion-duration-standard) var(--motion-easing-standard)' }} />
                </div>
              </div>
            )
          })}
        </Card>

        <Card variant="outlined" style={{ padding: 'var(--spacing-4)' }}>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
            TRANSPORT DISTRIBUTION
          </div>
          {(['stdio', 'sse', 'websocket'] as const).map((transport) => {
            const count = MCP_SERVERS.filter((s) => s.transport === transport).length
            const pct = count > 0 ? (count / MCP_SERVERS.length) * 100 : 0
            const colors = { stdio: '#7c6cf5', sse: '#00e5ff', websocket: '#22d97a' }
            return (
              <div key={transport} style={{ marginBottom: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-1)' }}>
                  <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    {transport}
                  </span>
                  <span style={{ fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                    {count} servers ({pct.toFixed(0)}%)
                  </span>
                </div>
                <div style={{ height: 6, backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, backgroundColor: colors[transport], borderRadius: 'var(--radius-full)', transition: 'width var(--motion-duration-standard) var(--motion-easing-standard)' }} />
                </div>
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}