// Sources - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { MEMORY_SOURCES } from '../lib/memory-data'
import { SourceCard } from '../design-system/components/specialized/SourceCard'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'

const addSourceOptions = [
  { type: 'obsidian', label: 'Obsidian Vault', description: 'Local markdown vault', icon: '◧', color: '#7c6cf5' },
  { type: 'omi', label: 'Omi Device', description: 'Voice capture device', icon: '◉', color: '#00e5ff' },
  { type: 'github', label: 'GitHub', description: 'Import from repositories', icon: '⌘', color: '#22d97a' },
  { type: 'notion', label: 'Notion', description: 'Notion workspace sync', icon: '◈', color: '#f06292' },
  { type: 'linear', label: 'Linear', description: 'Issue tracker import', icon: '◬', color: '#ffb347' },
  { type: 'readwise', label: 'Readwise', description: 'Highlights & notes', icon: '◉', color: '#ff4d6d' },
  { type: 'telegram', label: 'Telegram', description: 'Saved messages', icon: '➤', color: '#2ca5e0' },
  { type: 'rss', label: 'RSS Feeds', description: 'Blog & newsletter feeds', icon: '⊕', color: '#22d97a' },
  { type: 'api', label: 'Custom API', description: 'Generic REST/GraphQL', icon: '⌘', color: '#9ba4c0' },
]

export function MemorySources() {
  const connectedCount = MEMORY_SOURCES.filter((s) => s.status === 'connected').length
  const syncingCount = MEMORY_SOURCES.filter((s) => s.status === 'syncing').length
  const disconnectedCount = MEMORY_SOURCES.filter((s) => s.status === 'disconnected').length

  return (
    <div className="page-body">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <Badge variant="success" size="md" dot>{connectedCount} connected</Badge>
        <Badge variant="warning" size="md" dot>{syncingCount} syncing</Badge>
        <Badge variant="error" size="md" dot>{disconnectedCount} disconnected</Badge>
        <Badge variant="info" size="md" dot>{MEMORY_SOURCES.length} sources total</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 'var(--spacing-3)' }}>
        {MEMORY_SOURCES.map((source) => (
          <SourceCard
            key={source.id}
            source={{
              id: source.id,
              name: source.name,
              type: source.type,
              status: source.status,
              notesCount: source.notesCount,
              lastSync: source.lastSync,
              config: source.config,
            }}
            variant="default"
            onSync={() => console.log('Sync:', source.id)}
            onConfigure={() => console.log('Configure:', source.id)}
            onDisconnect={() => console.log('Disconnect:', source.id)}
            showActions={true}
          />
        ))}
      </div>

      <Card variant="outlined" style={{ marginTop: 'var(--spacing-4)' }}>
        <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
          ADD NEW SOURCE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--spacing-3)' }}>
          {addSourceOptions.map((option) => (
            <Card key={option.type} variant="outlined" style={{ cursor: 'pointer', borderColor: option.color + '44', transition: 'all var(--motion-duration-snap) var(--motion-easing-standard)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                <span style={{ fontSize: 'var(--text-display-md)', color: option.color, fontFamily: 'var(--font-heading)' }}>{option.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}>{option.label}</div>
                  <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', marginTop: 'var(--spacing-1)' }}>{option.description}</div>
                </div>
                <Badge variant="info" size="sm">Add</Badge>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}