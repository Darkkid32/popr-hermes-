import { RUNTIME_SETTINGS, OPERATOR_SETTINGS } from '../lib/demo-data'
import type { SettingRow } from '../lib/demo-data'

const TONE_COLOR: Record<string, string> = {
  cyan: '#00e5ff',
  green: '#22d97a',
  purple: '#7c6cf5',
  pink: '#d946ef',
  dim: '#9ba4c0',
  default: '#e8eaf6',
}

export function SettingsPage() {
  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> system healthy</span>
        <span className="badge badge-cyan"><span className="mono">v9.0.0</span></span>
        <span className="badge badge-purple"><span className="mono">local · bangkok</span></span>
        <span className="badge badge-gray"><span className="mono">2 unsaved</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <SettingsPanel rows={RUNTIME_SETTINGS} title="Runtime" icon="◰" />
        <SettingsPanel rows={OPERATOR_SETTINGS} title="Operator" icon="◉" />
      </div>

      <div className="panel" style={{ marginTop: 12 }}>
        <div className="section-label"><span className="ico">⚙</span> ENVIRONMENT</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Env label="VITE_AGENTOS_WS_URL" value="not configured" tone="red" />
          <Env label="VITE_AGENTOS_API_URL" value="not configured" tone="red" />
          <Env label="VITE_GEMINI_API_KEY" value="not configured" tone="red" />
          <Env label="OLLAMA_HOST" value="http://127.0.0.1:11434" tone="green" />
          <Env label="NODE_ENV" value="development" tone="cyan" />
          <Env label="AGENTOS_REGION" value="bangkok" tone="green" />
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

function Env({ label, value, tone }: { label: string; value: string; tone: 'green' | 'red' | 'cyan' }) {
  const color = tone === 'green' ? '#22d97a' : tone === 'red' ? '#ff4d6d' : '#00e5ff'
  return (
    <div className="panel-sm">
      <div style={{ fontSize: 10, color: '#6b7494', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }} className="mono">{label}</div>
      <div style={{ fontSize: 12.5, color, fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
    </div>
  )
}