// Models Settings - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import type { SettingRow } from '../design-system/components/specialized/SettingsSection'
import { SettingsSection } from '../design-system/components/specialized/SettingsSection'
import { ProviderBadge } from '../design-system/components/specialized/ProviderBadge'
import { TokenUsageCard } from '../design-system/components/specialized/TokenUsageCard'
import { CostCard } from '../design-system/components/specialized/CostCard'

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

  const costBreakdown = [
    { label: 'OpenAI GPT-4o', cost: 8.45, percentage: 55.4, color: '#7c6cf5' },
    { label: 'Anthropic Claude 3.5', cost: 4.12, percentage: 27.0, color: '#ff4d6d' },
    { label: 'Groq Llama 3', cost: 1.89, percentage: 12.4, color: '#ffb347' },
    { label: 'Local (Ollama)', cost: 0.77, percentage: 5.2, color: '#00e5ff' },
  ]

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> models configured</span>
        <span className="badge badge-cyan"><span className="mono">4 providers active</span></span>
        <span className="badge badge-purple"><span className="mono">13 models available</span></span>
        <span className="badge badge-gray"><span className="mono">$15.23 spent today</span></span>
      </div>

      {/* Token Usage & Cost Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <TokenUsageCard
          usage={{ prompt: 1250000, completion: 890000, total: 2140000, cost: 15.23 }}
          limit={5000000}
          period="Today"
          showBreakdown={false}
          variant="compact"
        />
        <CostCard
          cost={15.23}
          period="Today"
          trend="up"
          trendValue={12.5}
          breakdown={costBreakdown}
          budget={50}
          variant="compact"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <SettingsSection title="Runtime" icon="◰" rows={MODEL_RUNTIME_SETTINGS} variant="card" columns={1} />
        <SettingsSection title="Providers" icon="⊕" rows={MODEL_PROVIDER_CONFIG} variant="card" columns={1} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <SettingsSection title="Routing" icon="⌘" rows={MODEL_ROUTING_CONFIG} variant="card" columns={1} />
        <SettingsSection title="Cost Control" icon="$" rows={MODEL_COST_CONFIG} variant="card" columns={1} />
      </div>

      <div className="panel" style={{ marginTop: 12 }}>
        <div className="section-label"><span className="ico">⊕</span> PROVIDER CONFIG</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <ProviderBadge
            provider={{ id: 'ollama', name: 'Ollama', icon: '◌', iconColor: '#00e5ff', status: 'connected', modelsCount: 5, apiEndpoint: 'http://localhost:11434' }}
            variant="detailed"
            size="md"
          />
          <ProviderBadge
            provider={{ id: 'openai', name: 'OpenAI', icon: '●', iconColor: '#7c6cf5', status: 'connected', modelsCount: 4, apiEndpoint: 'api.openai.com' }}
            variant="detailed"
            size="md"
          />
          <ProviderBadge
            provider={{ id: 'anthropic', name: 'Anthropic', icon: '◐', iconColor: '#ff4d6d', status: 'connected', modelsCount: 3, apiEndpoint: 'api.anthropic.com' }}
            variant="detailed"
            size="md"
          />
          <ProviderBadge
            provider={{ id: 'groq', name: 'Groq', icon: '⚡', iconColor: '#ffb347', status: 'connected', modelsCount: 2, apiEndpoint: 'api.groq.com' }}
            variant="detailed"
            size="md"
          />
          <ProviderBadge
            provider={{ id: 'google', name: 'Google AI', icon: '★', iconColor: '#f06292', status: 'disconnected', modelsCount: 0, apiEndpoint: 'generativelanguage.googleapis.com' }}
            variant="detailed"
            size="md"
          />
          <ProviderBadge
            provider={{ id: 'together', name: 'Together AI', icon: '◆', iconColor: '#00e5ff', status: 'disconnected', modelsCount: 0, apiEndpoint: 'api.together.xyz' }}
            variant="detailed"
            size="md"
          />
        </div>
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

function Env({ label, value, tone }: { label: string; value: string; tone: 'green' | 'red' | 'cyan' }) {
  const color = tone === 'green' ? '#22d97a' : tone === 'red' ? '#ff4d6d' : '#00e5ff'
  return (
    <div className="panel-sm">
      <div style={{ fontSize: 10, color: '#6b7494', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }} className="mono">{label}</div>
      <div style={{ fontSize: 12.5, color, fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
    </div>
  )
}