import { MEMORY_NOTES } from '../lib/memory-data'

export function MemoryOmi() {
  const omiNotes = MEMORY_NOTES.filter((n) => n.source === 'omi')
  const totalDuration = omiNotes.reduce((sum, n) => sum + Math.floor(n.size / 100), 0) // mock duration
  const totalWords = omiNotes.reduce((sum, n) => sum + n.wordCount, 0)

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> device connected</span>
        <span className="badge badge-cyan"><span className="mono">{omiNotes.length} captures</span></span>
        <span className="badge badge-purple"><span className="mono">{totalWords.toLocaleString()} words</span></span>
        <span className="badge badge-gray"><span className="mono">~{totalDuration}m audio</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="panel">
          <div className="section-label"><span className="ico">◉</span> DEVICE STATUS</div>
          <div className="grid2" style={{ marginBottom: 16 }}>
            <div className="panel-sm"><div className="stat-label">DEVICE ID</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>omi-001</div></div>
            <div className="panel-sm"><div className="stat-label">FIRMWARE</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>v2.4.1</div></div>
            <div className="panel-sm"><div className="stat-label">BATTERY</div><div style={{ fontSize: 14, fontWeight: 500, color: '#22d97a', fontFamily: 'JetBrains Mono, monospace' }}>87%</div></div>
            <div className="panel-sm"><div className="stat-label">STORAGE</div><div style={{ fontSize: 14, fontWeight: 500, color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace' }}>2.3 GB / 8 GB</div></div>
          </div>
          <div className="section-label"><span className="ico">⌘</span> CAPTURE SETTINGS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 11, color: '#9ba4c0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="checkbox" defaultChecked /> Auto-transcribe on capture</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="checkbox" defaultChecked /> Segment by speaker</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="checkbox" defaultChecked /> Remove filler words</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="checkbox" /> Auto-link to projects</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="checkbox" defaultChecked /> Sync to vault on WiFi</label>
          </div>
        </div>

        <div className="panel">
          <div className="section-label"><span className="ico">∿</span> CAPTURE STATISTICS</div>
          <div className="grid2" style={{ marginBottom: 16 }}>
            <Stat label="TODAY" value="3" sub="captures" />
            <Stat label="THIS WEEK" value="18" sub="captures" />
            <Stat label="TOTAL DURATION" value="4.2h" sub="audio" />
            <Stat label="AVG LENGTH" value="14m" sub="per capture" />
          </div>
          <div className="section-label"><span className="ico">◴</span> RECENT CAPTURES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { title: 'Team standup — Q3 planning', time: '2h ago', duration: '23m', status: 'transcribed' },
              { title: 'Design review — Agent workspace', time: '5h ago', duration: '45m', status: 'transcribed' },
              { title: 'Walk & think — Distribution ideas', time: '1d ago', duration: '12m', status: 'processing' },
              { title: 'Client call — API integration', time: '2d ago', duration: '38m', status: 'transcribed' },
            ].map((c, i) => (
              <div key={i} className="table-row">
                <span style={{ fontSize: 16, color: '#00e5ff' }}>◉</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: '#e8eaf6' }}>{c.title}</div>
                  <div style={{ fontSize: 10.5, color: '#6b7494' }}>{c.time} · {c.duration}</div>
                </div>
                <span className={'badge ' + (c.status === 'transcribed' ? 'badge-green' : 'badge-amber')} style={{ fontSize: 9.5 }}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="section-label"><span className="ico">◧</span> OMI NOTES · {omiNotes.length}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {omiNotes.map((n) => (
            <div key={n.id} style={{ padding: '12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: '#141830' }}>
              <div className="row" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6', flex: 1 }}>{n.title}</span>
                <span className="badge badge-cyan" style={{ fontSize: 9.5 }}>{n.wordCount} words</span>
                <span style={{ fontSize: 10, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace' }}>{n.modified}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                {n.tags.map((t) => <span key={t} className="collab-chip" style={{ fontSize: 9.5 }}>{t}</span>)}
              </div>
              <div style={{ fontSize: 11, color: '#9ba4c0', lineHeight: 1.5 }}>{n.content.slice(0, 200)}...</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="panel-sm">
      <div className="stat-label">{label}</div>
      <div className="stat-val" style={{ fontSize: 20 }}>{value}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  )
}