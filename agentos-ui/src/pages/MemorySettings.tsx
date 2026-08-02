import type { SettingRow } from '../lib/demo-data'

const TONE_COLOR: Record<string, string> = {
  cyan: '#00e5ff',
  green: '#22d97a',
  purple: '#7c6cf5',
  pink: '#d946ef',
  dim: '#9ba4c0',
  default: '#e8eaf6',
}

export function MemorySettings() {
  const MEMORY_VAULT_SETTINGS: SettingRow[] = [
    { label: 'Vault Path', value: '~/Obsidian Vault', tone: 'cyan' },
    { label: 'Auto-sync Interval', value: '5 minutes', tone: 'dim' },
    { label: 'Watch for Changes', value: 'Enabled', tone: 'green' },
    { label: 'Index on Startup', value: 'Enabled', tone: 'green' },
    { label: 'Max File Size', value: '10 MB', tone: 'dim' },
    { label: 'Exclude Patterns', value: '.git, .obsidian, node_modules', tone: 'dim' },
  ]

  const MEMORY_OMI_SETTINGS: SettingRow[] = [
    { label: 'Device ID', value: 'omi-001', tone: 'cyan' },
    { label: 'Auto-transcribe', value: 'Enabled', tone: 'green' },
    { label: 'Speaker Segmentation', value: 'Enabled', tone: 'green' },
    { label: 'Filler Word Removal', value: 'Enabled', tone: 'green' },
    { label: 'Sync on WiFi Only', value: 'Enabled', tone: 'cyan' },
    { label: 'Audio Quality', value: 'High (48kHz)', tone: 'dim' },
  ]

  const MEMORY_GRAPH_SETTINGS: SettingRow[] = [
    { label: 'Community Detection', value: 'Leiden (quality)', tone: 'cyan' },
    { label: 'Re-cluster Interval', value: '1 hour', tone: 'dim' },
    { label: 'Max Nodes in View', value: '500', tone: 'dim' },
    { label: 'Edge Threshold', value: '0.3 similarity', tone: 'dim' },
    { label: 'Auto-layout', value: 'Force-directed', tone: 'green' },
    { label: 'Persist Positions', value: 'Enabled', tone: 'green' },
  ]

  const MEMORY_SYNC_SETTINGS: SettingRow[] = [
    { label: 'GitHub Auto-import', value: 'Enabled (2 repos)', tone: 'green' },
    { label: 'Readwise Sync', value: 'Enabled (6h ago)', tone: 'green' },
    { label: 'Telegram Sync', value: 'Enabled (30m ago)', tone: 'green' },
    { label: 'Linear Sync', value: 'Disabled (no API key)', tone: 'red' },
    { label: 'Notion Sync', value: 'Disabled (no API key)', tone: 'red' },
    { label: 'Conflict Resolution', value: 'Keep newest', tone: 'amber' },
  ]

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> vault synced</span>
        <span className="badge badge-cyan"><span className="mono">4m ago</span></span>
        <span className="badge badge-purple"><span className="mono">1,261 notes indexed</span></span>
        <span className="badge badge-gray"><span className="mono">3,408 links</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <SettingsPanel rows={MEMORY_VAULT_SETTINGS} title="Vault" icon="◧" />
        <SettingsPanel rows={MEMORY_OMI_SETTINGS} title="Omi" icon="◉" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <SettingsPanel rows={MEMORY_GRAPH_SETTINGS} title="Graph" icon="◬" />
        <SettingsPanel rows={MEMORY_SYNC_SETTINGS} title="Sync Sources" icon="⊕" />
      </div>

      <div className="panel" style={{ marginTop: 12 }}>
        <div className="section-label"><span className="ico">⚙</span> ENVIRONMENT</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Env label="OBSIDIAN_VAULT_PATH" value="~/Obsidian Vault" tone="green" />
          <Env label="OMI_DEVICE_ID" value="omi-001" tone="green" />
          <Env label="GITHUB_TOKEN" value="ghp_**** (configured)" tone="green" />
          <Env label="READWISE_TOKEN" value="configured" tone="green" />
          <Env label="TELEGRAM_BOT_TOKEN" value="configured" tone="green" />
          <Env label="LINEAR_API_KEY" value="Not configured" tone="red" />
          <Env label="NOTION_API_KEY" value="Not configured" tone="red" />
          <Env label="MEMORY_GRAPH_ALGO" value="leiden" tone="dim" />
          <Env label="MEMORY_SYNC_INTERVAL" value="300000" tone="dim" />
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

function Env({ label, value, tone }: { label: string; value: string; tone: 'green' | 'red' | 'cyan' | 'dim' }) {
  const color = tone === 'green' ? '#22d97a' : tone === 'red' ? '#ff4d6d' : tone === 'cyan' ? '#00e5ff' : '#9ba4c0'
  return (
    <div className="panel-sm">
      <div style={{ fontSize: 10, color: '#6b7494', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }} className="mono">{label}</div>
      <div style={{ fontSize: 12.5, color, fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
    </div>
  )
}