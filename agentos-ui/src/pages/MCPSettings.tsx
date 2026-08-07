// MCP Settings - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { SettingsSection, type SettingRow } from '../design-system/components/specialized/SettingsSection'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'

export function MCPSettings() {
  const MCP_GENERAL_SETTINGS: SettingRow[] = [
    { label: 'MCP Registry Enabled', value: 'On', tone: 'green' },
    { label: 'Auto-connect on Startup', value: 'Enabled', tone: 'green' },
    { label: 'Max Concurrent Connections', value: '10', tone: 'dim' },
    { label: 'Connection Timeout', value: '30 seconds', tone: 'dim' },
    { label: 'Reconnect Interval', value: '5 seconds', tone: 'dim' },
    { label: 'Health Check Interval', value: '60 seconds', tone: 'dim' },
  ]

  const MCP_TRANSPORT_SETTINGS: SettingRow[] = [
    { label: 'Default Transport', value: 'stdio', tone: 'cyan' },
    { label: 'SSE Endpoint', value: 'https://api.example.com/mcp', tone: 'dim' },
    { label: 'WebSocket URL', value: 'ws://localhost:8765/mcp', tone: 'cyan' },
    { label: 'TLS Verification', value: 'Strict', tone: 'green' },
    { label: 'Proxy Support', value: 'System proxy', tone: 'dim' },
  ]

  const MCP_SECURITY_SETTINGS: SettingRow[] = [
    { label: 'Allow Unverified Servers', value: 'Disabled', tone: 'red' },
    { label: 'Require Signed Manifests', value: 'Enabled', tone: 'green' },
    { label: 'Token Rotation', value: 'Every 30 days', tone: 'dim' },
    { label: 'Audit Logging', value: 'Enabled', tone: 'green' },
    { label: 'Rate Limiting', value: '100 req/s per server', tone: 'dim' },
  ]

  const MCP_DEVELOPMENT_SETTINGS: SettingRow[] = [
    { label: 'Developer Mode', value: 'Disabled', tone: 'amber' },
    { label: 'Debug Logging', value: 'Disabled', tone: 'amber' },
    { label: 'Mock Server Mode', value: 'Disabled', tone: 'amber' },
  ]

  const MCP_ENV_VARS: SettingRow[] = [
    { label: 'MCP_LOG_LEVEL', value: 'info', tone: 'cyan' },
    { label: 'MCP_MAX_PAYLOAD', value: '10 MB', tone: 'dim' },
    { label: 'MCP_DEFAULT_TIMEOUT', value: '30000 ms', tone: 'dim' },
    { label: 'MCP_AUTH_MODE', value: 'token', tone: 'cyan' },
  ]

  return (
    <div className="page-body">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <Badge variant="success" size="md" dot>registry on</Badge>
        <Badge variant="info" size="md" dot>10 max connections</Badge>
        <Badge variant="warning" size="md" dot>strict TLS</Badge>
        <Badge variant="default" size="md" dot>token auth</Badge>
      </div>

      <SettingsSection
        title="General"
        icon="⚙"
        rows={MCP_GENERAL_SETTINGS}
        columns={2}
      />

      <SettingsSection
        title="Transport"
        icon="📡"
        rows={MCP_TRANSPORT_SETTINGS}
        columns={2}
      />

      <SettingsSection
        title="Security"
        icon="🔒"
        rows={MCP_SECURITY_SETTINGS}
        columns={2}
      />

      <SettingsSection
        title="Development"
        icon="🛠"
        rows={MCP_DEVELOPMENT_SETTINGS}
        columns={2}
      />

      <SettingsSection
        title="Environment Variables"
        icon="⌘"
        rows={MCP_ENV_VARS}
        columns={2}
      />

      <Card variant="outlined" style={{ padding: 'var(--spacing-4)', marginTop: 'var(--spacing-4)' }}>
        <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
          MCP PROTOCOL INFO
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-3)' }}>
          <div className="panel-sm">
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>PROTOCOL VERSION</div>
            <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>2025-06-18</div>
          </div>
          <div className="panel-sm">
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>CLIENT</div>
            <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>@modelcontextprotocol/sdk</div>
          </div>
          <div className="panel-sm">
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>SUPPORTED TRANSPORTS</div>
            <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>stdio · sse · websocket</div>
          </div>
        </div>
      </Card>
    </div>
  )
}