const GOALS = [
  { id: 1, name: 'Ship Hermes v2 desktop', sub: 'Local-first agent runtime', due: 'Jul 2026', pct: 72, tone: 'green' as const, track: 'Build', milestone: 'Beta · 6 weeks remaining' },
  { id: 2, name: 'Agentic OS public release', sub: 'Public release of AgentOS v9', due: 'Sep 2026', pct: 45, tone: 'purple' as const, track: 'Ship', milestone: 'Closed beta · 3 partners onboard' },
  { id: 3, name: '100 paying users', sub: 'Revenue milestone', due: 'Dec 2026', pct: 18, tone: 'amber' as const, track: 'Growth', milestone: '8 paid · 12 in trial' },
  { id: 4, name: 'Speak at AI Engineer Summit', sub: 'Conference talk + workshop', due: 'Aug 2026', pct: 60, tone: 'cyan' as const, track: 'Distribution', milestone: 'Talk submitted · slides 60% done' },
  { id: 5, name: 'Write 12 long-form essays', sub: 'Audience + distribution', due: 'Dec 2026', pct: 33, tone: 'pink' as const, track: 'Distribution', milestone: '4 published · 3 in draft' },
]

const TRACKS = [
  { name: 'Build', pct: 62, color: 'green' as const },
  { name: 'Ship', pct: 45, color: 'purple' as const },
  { name: 'Growth', pct: 18, color: 'amber' as const },
  { name: 'Distribution', pct: 47, color: 'cyan' as const },
]

export function Goals() {
  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> 5 active</span>
        <span className="badge badge-cyan"><span className="mono">Q3 · 2026</span></span>
        <span className="badge badge-purple"><span className="mono">auto-tracked from vault</span></span>
        <span className="badge badge-gray"><span className="mono">avg progress 45.6%</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="col-stack">
          {GOALS.map((g) => (
            <div key={g.id} className="goal-card">
              <div className="head">
                <div>
                  <div className="name">{g.name}</div>
                  <div className="due">{g.due} · {g.sub}</div>
                </div>
                <div>
                  <div className="pct">{g.pct}%</div>
                  <div className="pct-label">{g.track.toUpperCase()}</div>
                </div>
              </div>
              <div className="progress-bar">
                <div className={'progress-fill ' + g.tone} style={{ width: g.pct + '%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                <span style={{ fontSize: 11, color: '#6b7494' }}>{g.milestone}</span>
                <span style={{ fontSize: 11, color: '#9ba4c0' }} className="mono">{g.due}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="col-stack">
          <div className="panel">
            <div className="section-label">
              <span className="ico">∿</span>
              TRACK SUMMARY
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {TRACKS.map((t) => (
                <div key={t.name}>
                  <div className="spread" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: '#e8eaf6', fontWeight: 500 }}>{t.name}</span>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 600, color: '#e8eaf6' }}>{t.pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className={'progress-fill ' + t.color} style={{ width: t.pct + '%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-label">
              <span className="ico">◉</span>
              AGENTS WATCHING
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="row">
                <div className="agent-circle" style={{ background: '#7c6cf522', color: '#7c6cf5', borderColor: '#7c6cf544' }}>H</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>Hermes</div>
                  <div style={{ fontSize: 11, color: '#9ba4c0' }}>tracking 5 goals · 14 tasks</div>
                </div>
                <span className="badge badge-green">Active</span>
              </div>
              <div className="row">
                <div className="agent-circle" style={{ background: '#ff4d6d22', color: '#ff4d6d', borderColor: '#ff4d6d44' }}>C</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>Claude Code</div>
                  <div style={{ fontSize: 11, color: '#9ba4c0' }}>tracking 3 goals · 6 tasks</div>
                </div>
                <span className="badge badge-green">Active</span>
              </div>
              <div className="row">
                <div className="agent-circle" style={{ background: '#00e5ff22', color: '#00e5ff', borderColor: '#00e5ff44' }}>X</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>OpenClaw</div>
                  <div style={{ fontSize: 11, color: '#9ba4c0' }}>tracking 0 goals · 0 tasks</div>
                </div>
                <span className="badge badge-red">Offline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}