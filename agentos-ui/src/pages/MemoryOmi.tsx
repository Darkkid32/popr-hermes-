// Omi - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { MEMORY_NOTES } from '../lib/memory-data'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { ProviderBadge } from '../design-system/components/specialized/ProviderBadge'

const omiNotes = MEMORY_NOTES.filter((n) => n.source === 'omi')
const totalDuration = omiNotes.reduce((sum, n) => sum + Math.floor(n.size / 100), 0)
const totalWords = omiNotes.reduce((sum, n) => sum + n.wordCount, 0)

export function MemoryOmi() {
  return (
    <div className="page-body">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <ProviderBadge simpleProvider={{ name: 'Omi', status: 'connected', icon: '◉', iconColor: '#00e5ff' }} size="md" label="device connected" />
        <Badge variant="info" size="md" dot>{omiNotes.length} captures</Badge>
        <Badge variant="primary" size="md" dot>{totalWords.toLocaleString()} words</Badge>
        <Badge variant="default" size="md" dot>~{totalDuration}m audio</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <Card variant="outlined">
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
            DEVICE STATUS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
            <div className="panel-sm">
              <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>DEVICE ID</div>
              <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>omi-001</div>
            </div>
            <div className="panel-sm">
              <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>FIRMWARE</div>
              <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>v2.4.1</div>
            </div>
            <div className="panel-sm">
              <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>BATTERY</div>
              <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: '#22d97a', fontFamily: 'var(--font-mono)' }}>87%</div>
            </div>
            <div className="panel-sm">
              <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>STORAGE</div>
              <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>2.3 GB / 8 GB</div>
            </div>
          </div>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
            CAPTURE SETTINGS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> Auto-transcribe on capture</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> Segment by speaker</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> Remove filler words</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}><input type="checkbox" /> Auto-link to projects</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}><input type="checkbox" defaultChecked /> Sync to vault on WiFi</label>
          </div>
        </Card>

        <Card variant="outlined">
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
            CAPTURE STATISTICS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
            <div className="panel-sm">
              <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>TODAY</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>3</div>
              <div style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-quaternary)' }}>captures</div>
            </div>
            <div className="panel-sm">
              <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>THIS WEEK</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>18</div>
              <div style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-quaternary)' }}>captures</div>
            </div>
            <div className="panel-sm">
              <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>TOTAL DURATION</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>4.2h</div>
              <div style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-quaternary)' }}>audio</div>
            </div>
            <div className="panel-sm">
              <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>AVG LENGTH</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>14m</div>
              <div style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-quaternary)' }}>per capture</div>
            </div>
          </div>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
            RECENT CAPTURES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {[
              { title: 'Team standup — Q3 planning', time: '2h ago', duration: '23m', status: 'transcribed' },
              { title: 'Design review — Agent workspace', time: '5h ago', duration: '45m', status: 'transcribed' },
              { title: 'Walk & think — Distribution ideas', time: '1d ago', duration: '12m', status: 'processing' },
              { title: 'Client call — API integration', time: '2d ago', duration: '38m', status: 'transcribed' },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-2)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                <span style={{ fontSize: 'var(--text-body-lg)', color: '#00e5ff' }}>◉</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{c.title}</div>
                  <div style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-text-tertiary)' }}>{c.time} · {c.duration}</div>
                </div>
                <Badge variant={c.status === 'transcribed' ? 'success' : 'warning'} size="sm">{c.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card variant="outlined">
        <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
          OMI NOTES · {omiNotes.length}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          {omiNotes.map((n) => (
            <div key={n.id} style={{ padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)', backgroundColor: 'var(--color-surface-container)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                <span style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', flex: 1 }}>{n.title}</span>
                <Badge variant="info" size="sm">{n.wordCount} words</Badge>
                <span style={{ fontSize: 'var(--text-label-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{n.modified}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-2)' }}>
                {n.tags.map((t) => (
                  <Badge key={t} variant="default" size="sm">{t}</Badge>
                ))}
              </div>
              <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', lineHeight: 1.5 }}>
                {n.content.slice(0, 200)}...
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}