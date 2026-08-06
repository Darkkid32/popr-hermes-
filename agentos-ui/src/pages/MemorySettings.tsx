// Settings - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { SettingsSection, type SettingRow } from '../design-system/components/specialized/SettingsSection'
import { TokenUsageCard } from '../design-system/components/specialized/TokenUsageCard'
import { CostCard } from '../design-system/components/specialized/CostCard'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'

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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <Badge variant="success" size="md" dot>vault synced</Badge>
        <Badge variant="info" size="md" dot>4m ago</Badge>
        <Badge variant="primary" size="md" dot>1,261 notes indexed</Badge>
        <Badge variant="default" size="md" dot>3,408 links</Badge>
      </div>

      <SettingsSection
        title="Vault"
        icon={<span style={{ fontSize: 'var(--text-body-lg)', fontFamily: 'var(--font-heading)' }}>◧</span>}
        rows={MEMORY_VAULT_SETTINGS}
        variant="default"
      />

      <SettingsSection
        title="Omi"
        icon={<span style={{ fontSize: 'var(--text-body-lg)', fontFamily: 'var(--font-heading)' }}>◉</span>}
        rows={MEMORY_OMI_SETTINGS}
        variant="default"
      />

      <SettingsSection
        title="Graph"
        icon={<span style={{ fontSize: 'var(--text-body-lg)', fontFamily: 'var(--font-heading)' }}>◬</span>}
        rows={MEMORY_GRAPH_SETTINGS}
        variant="default"
      />

      <SettingsSection
        title="Sync Sources"
        icon={<span style={{ fontSize: 'var(--text-body-lg)', fontFamily: 'var(--font-heading)' }}>⊕</span>}
        rows={MEMORY_SYNC_SETTINGS}
        variant="default"
      />

      <Card variant="outlined" style={{ marginTop: 'var(--spacing-3)' }}>
        <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
          ENVIRONMENT
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-3)' }}>
          <div className="panel-sm">
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-quaternary)', marginBottom: 'var(--spacing-1)' }}>OBSIDIAN_VAULT_PATH</div>
            <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: '#22d97a' }}>~/Obsidian Vault</div>
          </div>
          <div className="panel-sm">
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-quaternary)', marginBottom: 'var(--spacing-1)' }}>OMI_DEVICE_ID</div>
            <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: '#00e5ff' }}>omi-001</div>
          </div>
          <div className="panel-sm">
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-quaternary)', marginBottom: 'var(--spacing-1)' }}>GITHUB_TOKEN</div>
            <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: '#22d97a' }}>ghp_**** (configured)</div>
          </div>
          <div className="panel-sm">
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-quaternary)', marginBottom: 'var(--spacing-1)' }}>READWISE_TOKEN</div>
            <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: '#22d97a' }}>configured</div>
          </div>
          <div className="panel-sm">
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-quaternary)', marginBottom: 'var(--spacing-1)' }}>TELEGRAM_BOT_TOKEN</div>
            <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: '#22d97a' }}>configured</div>
          </div>
          <div className="panel-sm">
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-quaternary)', marginBottom: 'var(--spacing-1)' }}>LINEAR_API_KEY</div>
            <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: '#ff4d6d' }}>Not configured</div>
          </div>
          <div className="panel-sm">
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-quaternary)', marginBottom: 'var(--spacing-1)' }}>NOTION_API_KEY</div>
            <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: '#ff4d6d' }}>Not configured</div>
          </div>
          <div className="panel-sm">
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-quaternary)', marginBottom: 'var(--spacing-1)' }}>MEMORY_GRAPH_ALGO</div>
            <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>leiden</div>
          </div>
          <div className="panel-sm">
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-quaternary)', marginBottom: 'var(--spacing-1)' }}>MEMORY_SYNC_INTERVAL</div>
            <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>300000</div>
          </div>
        </div>
      </Card>

      <Card variant="outlined" style={{ marginTop: 'var(--spacing-3)' }}>
        <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
          TOKEN USAGE
        </div>
        <TokenUsageCard
          usage={{ prompt: 1250000, completion: 890000, total: 2140000, cost: 12.45 }}
          limit={5000000}
          period="This Month"
          showCost={true}
          showBreakdown={true}
          variant="default"
        />
      </Card>

      <Card variant="outlined" style={{ marginTop: 'var(--spacing-3)' }}>
        <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
          STORAGE COST
        </div>
        <CostCard
          cost={47.20}
          period="This Month"
          trend="up"
          trendValue={12.5}
          budget={100}
          variant="default"
          showTrend={true}
        />
      </Card>
    </div>
  )
}