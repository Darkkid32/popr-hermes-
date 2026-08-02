import type { SettingRow } from '../lib/demo-data'

const TONE_COLOR: Record<string, string> = {
  cyan: '#00e5ff',
  green: '#22d97a',
  purple: '#7c6cf5',
  pink: '#d946ef',
  dim: '#9ba4c0',
  default: '#e8eaf6',
}

export function SkillsSettings() {
  const SKILL_RUNTIME_SETTINGS: SettingRow[] = [
    { label: 'Skill Execution Engine', value: 'Node.js 20 LTS', tone: 'cyan' },
    { label: 'Max Concurrent Skills', value: '5', tone: 'dim' },
    { label: 'Execution Timeout', value: '5 minutes', tone: 'dim' },
    { label: 'Memory Limit per Skill', value: '256 MB', tone: 'dim' },
    { label: 'Auto-restart on Failure', value: 'Enabled (3 retries)', tone: 'green' },
    { label: 'Skill Isolation', value: 'Process sandbox', tone: 'green' },
  ]

  const SKILL_SCHEDULE_SETTINGS: SettingRow[] = [
    { label: 'Scheduler Enabled', value: 'On', tone: 'green' },
    { label: 'Default Timezone', value: 'UTC', tone: 'dim' },
    { label: 'Catch-up Missed Runs', value: 'Enabled', tone: 'green' },
    { label: 'Max Concurrent Scheduled', value: '3', tone: 'dim' },
    { label: 'Schedule Precision', value: 'Second', tone: 'dim' },
  ]

  const SKILL_STORAGE_SETTINGS: SettingRow[] = [
    { label: 'Skill Install Directory', value: '~/.hermes/skills', tone: 'cyan' },
    { label: 'Skill Cache Directory', value: '~/.hermes/cache/skills', tone: 'cyan' },
    { label: 'Max Skill Size', value: '100 MB', tone: 'dim' },
    { label: 'Auto-cleanup Old Versions', value: 'Enabled (keep 3)', tone: 'green' },
    { label: 'Backup Before Update', value: 'Enabled', tone: 'green' },
  ]

  const SKILL_DEVELOPMENT_SETTINGS: SettingRow[] = [
    { label: 'Developer Mode', value: 'Disabled', tone: 'amber' },
    { label: 'Hot Reload', value: 'Disabled', tone: 'amber' },
    { label: 'Debug Logging', value: 'Disabled', tone: 'amber' },
    { label: 'Local Skill Path', value: '~/hermes-skills/dev', tone: 'dim' },
    { label: 'TypeScript Compile on Save', value: 'Enabled', tone: 'green' },
  ]

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> engine ready</span>
        <span className="badge badge-cyan"><span className="mono">9 skills installed</span></span>
        <span className="badge badge-purple"><span className="mono">scheduler active</span></span>
        <span className="badge badge-gray"><span className="mono">dev mode off</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <SettingsPanel rows={SKILL_RUNTIME_SETTINGS} title="Runtime" icon="◰" />
        <SettingsPanel rows={SKILL_SCHEDULE_SETTINGS} title="Scheduler" icon="◴" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <SettingsPanel rows={SKILL_STORAGE_SETTINGS} title="Storage" icon="◧" />
        <SettingsPanel rows={SKILL_DEVELOPMENT_SETTINGS} title="Development" icon="⌘" />
      </div>

      <div className="panel" style={{ marginTop: 12 }}>
        <div className="section-label"><span className="ico">⚙</span> ENVIRONMENT</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Env label="SKILL_DIR" value="~/.hermes/skills" tone="green" />
          <Env label="SKILL_CACHE_DIR" value="~/.hermes/cache/skills" tone="green" />
          <Env label="NODE_ENV" value="development" tone="cyan" />
          <Env label="SKILL_SANDBOX" value="process" tone="green" />
          <Env label="SKILL_DEV_MODE" value="false" tone="amber" />
          <Env label="SKILL_MAX_CONCURRENT" value="5" tone="dim" />
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