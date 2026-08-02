import type { SettingRow } from '../lib/demo-data'

const TONE_COLOR: Record<string, string> = {
  cyan: '#00e5ff',
  green: '#22d97a',
  purple: '#7c6cf5',
  pink: '#d946ef',
  dim: '#9ba4c0',
  default: '#e8eaf6',
}

export function PluginsSettings() {
  const PLUGIN_GENERAL_SETTINGS: SettingRow[] = [
    { label: 'Auto-update Plugins', value: 'Enabled (daily check)', tone: 'green' },
    { label: 'Allow Community Plugins', value: 'Enabled', tone: 'cyan' },
    { label: 'Require Verification for Install', value: 'Disabled', tone: 'amber' },
    { label: 'Plugin Sandbox Mode', value: 'Strict', tone: 'green' },
    { label: 'Max Concurrent Plugins', value: '10', tone: 'dim' },
    { label: 'Plugin Cache TTL', value: '24 hours', tone: 'dim' },
  ]

  const PLUGIN_NETWORK_SETTINGS: SettingRow[] = [
    { label: 'Outbound Request Timeout', value: '30 seconds', tone: 'dim' },
    { label: 'Allowed Domains', value: '*.github.com, *.anthropic.com, *.openai.com, ...', tone: 'cyan' },
    { label: 'Blocked Domains', value: 'None', tone: 'green' },
    { label: 'Proxy Configuration', value: 'System proxy', tone: 'dim' },
    { label: 'TLS Verification', value: 'Strict', tone: 'green' },
  ]

  const PLUGIN_STORAGE_SETTINGS: SettingRow[] = [
    { label: 'Plugin Data Directory', value: '~/.hermes/plugins', tone: 'cyan' },
    { label: 'Max Storage per Plugin', value: '500 MB', tone: 'dim' },
    { label: 'Cleanup on Uninstall', value: 'Enabled', tone: 'green' },
    { label: 'Backup Before Update', value: 'Enabled', tone: 'green' },
  ]

  const PLUGIN_DEVELOPMENT_SETTINGS: SettingRow[] = [
    { label: 'Developer Mode', value: 'Disabled', tone: 'amber' },
    { label: 'Hot Reload', value: 'Disabled', tone: 'amber' },
    { label: 'Debug Logging', value: 'Disabled', tone: 'amber' },
    { label: 'Local Plugin Path', value: '~/hermes-plugins/dev', tone: 'dim' },
  ]

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> sandbox active</span>
        <span className="badge badge-cyan"><span className="mono">13 plugins</span></span>
        <span className="badge badge-purple"><span className="mono">4 permissions policies</span></span>
        <span className="badge badge-gray"><span className="mono">auto-update on</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <SettingsPanel rows={PLUGIN_GENERAL_SETTINGS} title="General" icon="◰" />
        <SettingsPanel rows={PLUGIN_NETWORK_SETTINGS} title="Network" icon="⊕" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <SettingsPanel rows={PLUGIN_STORAGE_SETTINGS} title="Storage" icon="◧" />
        <SettingsPanel rows={PLUGIN_DEVELOPMENT_SETTINGS} title="Development" icon="⌘" />
      </div>

      <div className="panel" style={{ marginTop: 12 }}>
        <div className="section-label"><span className="ico">⚙</span> ENVIRONMENT</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Env label="PLUGIN_DIR" value="~/.hermes/plugins" tone="green" />
          <Env label="PLUGIN_CACHE_DIR" value="~/.hermes/cache/plugins" tone="green" />
          <Env label="PLUGIN_AUTO_UPDATE" value="true" tone="green" />
          <Env label="PLUGIN_SANDBOX" value="strict" tone="green" />
          <Env label="PLUGIN_DEV_MODE" value="false" tone="amber" />
          <Env label="PLUGIN_MAX_CONCURRENT" value="10" tone="dim" />
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