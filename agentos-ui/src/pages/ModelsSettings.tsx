import type { SettingRow } from '../lib/demo-data'

const TONE_COLOR: Record<string, string> = {
  cyan: '#00e5ff',
  green: '#22d97a',
  purple: '#7c6cf5',
  pink: '#d946ef',
  dim: '#9ba4c0',
  default: '#e8eaf6',
}

export function ModelsSettings() {
  const MODEL_RUNTIME_SETTINGS: SettingRow[] = [
    { label: 'Default Chat Model', value: 'qwen3-14b (Ollama)', tone: 'cyan' },
    { label: 'Default Embedding Model', value: 'nomic-embed-text (Ollama)', tone: 'cyan' },
    { label: 'Default Reasoning Model', value: 'qwen3-14b (Ollama)', tone: 'cyan' },
    { label: 'Fallback Cloud Model', value: 'gpt-4o-mini (OpenAI)', tone: 'purple' },
    { label: 'Max Context Window', value: '32,768 tokens', tone: 'dim' },
    { label: 'Request Timeout', value: '120 seconds', tone: 'dim' },
    { label: 'Enable Streaming', value: 'On', tone: 'green' },
    { label: 'Cache Responses', value: 'Off', tone: 'amber' },
  ]

  const MODEL_PROVIDER_CONFIG: SettingRow[] = [
    { label: 'Ollama Host', value: 'http://localhost:11434', tone: 'cyan' },
    { label: 'OpenAI API Key', value: 'sk-**** (configured)', tone: 'green' },
    { label: 'Anthropic API Key', value: 'sk-ant-**** (configured)', tone: 'green' },
    { label: 'Google AI API Key', value: 'Not configured', tone: 'red' },
    { label: 'Groq API Key', value: 'gsk_**** (configured)', tone: 'green' },
    { label: 'Together AI API Key', value: 'Not configured', tone: 'red' },
  ]

  const MODEL_ROUTING_CONFIG: SettingRow[] = [
    { label: 'Smart Routing', value: 'Enabled', tone: 'green' },
    { label: 'Routing Rules', value: '6 active', tone: 'cyan' },
    { label: 'Default Fallback', value: 'gpt-4o-mini', tone: 'purple' },
    { label: 'Cost Optimization', value: 'Balanced', tone: 'amber' },
    { label: 'Latency Preference', value: 'Fast (<1s)', tone: 'cyan' },
  ]

  const MODEL_COST_CONFIG: SettingRow[] = [
    { label: 'Daily Budget', value: '$50.00', tone: 'cyan' },
    { label: 'Monthly Budget', value: '$1,000.00', tone: 'cyan' },
    { label: 'Cost Alerts', value: 'Enabled (80% threshold)', tone: 'green' },
    { label: 'Auto-fallback on Budget', value: 'Enabled', tone: 'green' },
    { label: 'Track Local Models', value: 'Free (no cost)', tone: 'green' },
  ]

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> models configured</span>
        <span className="badge badge-cyan"><span className="mono">4 providers active</span></span>
        <span className="badge badge-purple"><span className="mono">13 models available</span></span>
        <span className="badge badge-gray"><span className="mono">$15.23 spent today</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <SettingsPanel rows={MODEL_RUNTIME_SETTINGS} title="Runtime" icon="◰" />
        <SettingsPanel rows={MODEL_PROVIDER_CONFIG} title="Providers" icon="⊕" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <SettingsPanel rows={MODEL_ROUTING_CONFIG} title="Routing" icon="⌘" />
        <SettingsPanel rows={MODEL_COST_CONFIG} title="Cost Control" icon="$" />
      </div>

      <div className="panel" style={{ marginTop: 12 }}>
        <div className="section-label"><span className="ico">⚙</span> ENVIRONMENT</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Env label="OLLAMA_HOST" value="http://127.0.0.1:11434" tone="green" />
          <Env label="OPENAI_API_KEY" value="sk-**** (configured)" tone="green" />
          <Env label="ANTHROPIC_API_KEY" value="sk-ant-**** (configured)" tone="green" />
          <Env label="GOOGLE_AI_API_KEY" value="Not configured" tone="red" />
          <Env label="GROQ_API_KEY" value="gsk_**** (configured)" tone="green" />
          <Env label="TOGETHER_API_KEY" value="Not configured" tone="red" />
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