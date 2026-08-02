import type { SettingRow } from '../lib/demo-data'

const TONE_COLOR: Record<string, string> = {
  cyan: '#00e5ff',
  green: '#22d97a',
  purple: '#7c6cf5',
  pink: '#d946ef',
  dim: '#9ba4c0',
  default: '#e8eaf6',
}

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
    { label: 'Local Server Path', value: '~/mcp-servers/dev', tone: 'dim' },
    { label: 'Hot Reload Config', value: 'Enabled', tone: 'green' },
  ]

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> 6 connected</span>
        <span className="badge badge-cyan"><span className="mono">21 tools available</span></span>
        <span className="badge badge-purple"><span className="mono">8 servers</span></span>
        <span className="badge badge-gray"><span className="mono">99.8% uptime</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <SettingsPanel rows={MCP_GENERAL_SETTINGS} title="General" icon="◰" />
        <SettingsPanel rows={MCP_TRANSPORT_SETTINGS} title="Transports" icon="🔌" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <SettingsPanel rows={MCP_SECURITY_SETTINGS} title="Security" icon="⚠" />
        <SettingsPanel rows={MCP_DEVELOPMENT_SETTINGS} title="Development" icon="⌘" />
      </div>

      <div className="panel" style={{ marginTop: 12 }}>
        <div className="section-label"><span className="ico">⚙</span> ENVIRONMENT</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Env label="MCP_REGISTRY_ENABLED" value="true" tone="green" />
          <Env label="MCP_WS_URL" value="ws://localhost:8765/mcp" tone="cyan" />
          <Env label="MCP_SSE_URL" value="https://api.github.com/mcp" tone="dim" />
          <Env label="MCP_DEV_MODE" value="false" tone="amber" />
          <Env label="MCP_MAX_CONNECTIONS" value="10" tone="dim" />
          <Env label="MCP_TIMEOUT_MS" value="30000" tone="dim" />
        </div>
      </div>
    </div>
  )
}

function SettingsPanel({ rows, title, icon }: { rows: SettingRow[]; title: string; icon: string }) {
  return (
    <div className="panel">
      <div className="section-label"><span className="ico">{icon}</span> {title.toUpperCase()}</div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((row, i) => (
          <div key={i} className="table-row">
            <span style={{ fontSize: 13, color: '#e8eaf6', flex: 1 }}>{row.label}</span>
            <span style={{ fontSize: 12.5, color: TONE_COLOR[row.tone] ?? '#e8eaf6', fontWeight: row.tone === 'cyan' || row.tone === 'green' ? 600 : 400, fontFamily: row.tone === 'cyan' || row.tone === 'green' ? 'JetBrains Mono, monospace' : 'inherit' }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Env({ label, value, tone }: { label: string; value: string; tone: 'green' | 'red' | 'cyan' | 'dim' | 'amber' }) {
  const color = tone === 'green' ? '#22d97a' : tone === 'red' ? '#ff4d6d' : tone === 'cyan' ? '#00e5ff' : tone === 'dim' ? '#9ba4c0' : '#ffb347'
  return (
    <div className="panel-sm">
      <div style={{ fontSize: 10, color: '#6b7494', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }} className="mono">{label}</div>
      <div style={{ fontSize: 12.5, color, fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
    </div>
  )
}