import { useNavigate } from 'react-router-dom'
import { AgentMesh3D } from '../components/AgentMesh3D'

const STATUS_CARDS = [
  { key: 'claude', name: 'CLAUDE', status: 'Online', tone: 'green' as const, meta: '2.1.142 · 86ms', initial: 'C', color: '#ff4d6d', detail: 'reviewing the agent workspace rebuild', tasks: 3, meshId: 'claude' as const, route: '/claude' },
  { key: 'openclaw', name: 'OPENCLAW', status: 'Offline', tone: 'red' as const, meta: '3 agents · 73 sessions', initial: 'X', color: '#00e5ff', detail: 'no live source connected', tasks: 0, meshId: 'openclaw' as const, route: '/openclaw' },
  { key: 'hermes', name: 'HERMES', status: 'Online', tone: 'green' as const, meta: 'qwen3 · Ollama (local)', initial: 'H', color: '#7c6cf5', detail: 'drafting the v10 launch notes', tasks: 4, meshId: 'hermes' as const, route: '/hermes' },
  { key: 'system', name: 'SYSTEM', status: 'Online', tone: 'green' as const, meta: '2 poll ticks · 4s', initial: 'S', color: '#22d97a', detail: 'telemetry + graphify heartbeat', tasks: 0, meshId: null, route: '/analytics' },
  { key: 'free', name: 'FREE CLAUDE CODE', status: 'Live', tone: 'green' as const, meta: 'owl-alpha · OpenRouter', initial: 'F', color: '#f06292', detail: 'sweeping tasks across the vault', tasks: 2, meshId: null, route: '/hermes' },
  { key: 'gpt', name: 'GPT-5', status: 'Offline', tone: 'red' as const, meta: 'awaiting runtime', initial: 'G', color: '#ffb347', detail: 'no live source connected', tasks: 0, meshId: null, route: '/hermes' },
]

const SELF_GOALS = [
  { name: 'Ship AgentOS v9', sub: 'Production release', due: 'Jul 2026', pct: 78, tone: 'green' as const },
  { name: 'Agentic OS public launch', sub: 'Public release', due: 'Sep 2026', pct: 45, tone: 'purple' as const },
  { name: '100 paying users', sub: 'Revenue milestone', due: 'Dec 2026', pct: 18, tone: 'amber' as const },
]

const FLEET = [
  { name: 'Hermes', role: 'Local-first orchestrator', hex: '#7c6cf5', initial: 'H', session: '12 sessions today', tag: 'Online', tagTone: 'green' as const },
  { name: 'Claude Code', role: 'Deep engineering agent', hex: '#ff4d6d', initial: 'C', session: '8 sessions today', tag: 'Online', tagTone: 'green' as const },
  { name: 'OpenCode', role: 'Fast implementation lane', hex: '#ffb347', initial: 'O', session: '5 sessions today', tag: 'Busy', tagTone: 'amber' as const },
  { name: 'OpenClaw', role: 'Cloud execution surface', hex: '#00e5ff', initial: 'X', session: '0 sessions today', tag: 'Offline', tagTone: 'red' as const },
]

export function MissionControl() {
  const navigate = useNavigate()
  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> online</span>
        <span className="badge badge-cyan"><span className="mono">Hermes Cloud · minimax-m3</span></span>
        <span className="badge badge-green"><span className="mono">Ollama live</span></span>
        <span className="badge badge-gray"><span className="mono">v10.0.0 · 4 agents · 1,261 memories</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {STATUS_CARDS.map((c) => (
          <div key={c.key} className="mesh-card" onClick={() => navigate(c.route)} role="button" tabIndex={0} aria-label={`${c.name} status — ${c.status}. Click to open.`}>
            {c.meshId && (
              <div className="mesh-canvas">
                <AgentMesh3D agentId={c.meshId} size={110} autoRotate />
              </div>
            )}
            <div className="mesh-info">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div className="agent-circle" style={{ background: c.color + '22', color: c.color, borderColor: c.color + '44', fontSize: 12, width: 32, height: 32 }}>{c.initial}</div>
                <span className={'badge badge-' + c.tone}>{c.status}</span>
              </div>
              <div className="stat-label">{c.name}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: '#9ba4c0', marginBottom: 4 }}>{c.meta}</div>
              <div style={{ fontSize: 11.5, color: '#6b7494', marginTop: 6, lineHeight: 1.4 }}>{c.detail}</div>
              {c.tasks > 0 && (
                <div className="progress-bar" style={{ marginTop: 10 }}>
                  <div className="progress-fill" style={{ width: '60%', background: c.color }} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="panel" onClick={() => navigate('/goals')} role="button" tabIndex={0} style={{ cursor: 'pointer' }}>
          <div className="section-label">
            <span className="ico">◈</span>
            SELF · GOALS
            <button className="badge badge-gray" style={{ marginLeft: 'auto', cursor: 'pointer', border: 'none' }} onClick={(e) => { e.stopPropagation(); navigate('/goals') }}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {SELF_GOALS.map((g) => (
              <div key={g.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 600, color: '#e8eaf6' }}>{g.name}</div>
                    <div style={{ fontSize: 10.5, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace' }}>{g.due} · {g.sub}</div>
                  </div>
                  <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 600, color: '#e8eaf6' }}>{g.pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className={'progress-fill ' + g.tone} style={{ width: g.pct + '%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-label">
            <span className="ico">⊕</span>
            AGENT FLEET · 4
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FLEET.map((f) => (
              <div key={f.name} className="row" onClick={() => navigate('/' + f.name.toLowerCase())} role="button" tabIndex={0} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                <div className="agent-circle" style={{ background: f.hex + '22', color: f.hex, borderColor: f.hex + '44' }}>{f.initial}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eaf6' }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: '#9ba4c0' }}>{f.role}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={'badge badge-' + f.tagTone}>{f.tag}</span>
                  <div style={{ fontSize: 10, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace', marginTop: 4 }}>{f.session}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
        <div className="panel">
          <div className="section-label">
            <span className="ico">∿</span>
            LIVE TELEMETRY · LAST 60 MIN
          </div>
          <div className="canvas-wrap" style={{ height: 200 }}>
            <Sparkline />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 16 }}>
            <div><div className="stat-label">Tasks</div><div className="stat-val">412</div><div className="stat-sub">+18 last hour</div></div>
            <div><div className="stat-label">Latency</div><div className="stat-val">640ms</div><div className="stat-sub">p95 · all agents</div></div>
            <div><div className="stat-label">Tokens</div><div className="stat-val">2.4M</div><div className="stat-sub">today · across fleet</div></div>
            <div><div className="stat-label">Cost</div><div className="stat-val">$14.20</div><div className="stat-sub">today · est.</div></div>
          </div>
        </div>

        <div className="panel">
          <div className="section-label">
            <span className="ico">⚠</span>
            RECENT INCIDENTS
            <button className="badge badge-gray" style={{ marginLeft: 'auto', cursor: 'pointer', border: 'none' }} onClick={() => navigate('/alerts')}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="panel-sm" onClick={() => navigate('/alerts')} role="button" tabIndex={0} style={{ cursor: 'pointer' }}>
              <div className="row"><span className="badge badge-red">SEV-2</span><span style={{ fontSize: 12, color: '#e8eaf6' }}>OpenClaw session expired</span><span className="spacer" /><span style={{ fontSize: 10, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace' }}>4m</span></div>
              <div style={{ fontSize: 11, color: '#9ba4c0', marginTop: 4 }}>Token refresh failed; manual reconnect required.</div>
            </div>
            <div className="panel-sm" onClick={() => navigate('/alerts')} role="button" tabIndex={0} style={{ cursor: 'pointer' }}>
              <div className="row"><span className="badge badge-amber">SEV-3</span><span style={{ fontSize: 12, color: '#e8eaf6' }}>Hermes vault slow write</span><span className="spacer" /><span style={{ fontSize: 10, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace' }}>22m</span></div>
              <div style={{ fontSize: 11, color: '#9ba4c0', marginTop: 4 }}>IndexedDB compaction queued; user not blocked.</div>
            </div>
            <div className="panel-sm" onClick={() => navigate('/alerts')} role="button" tabIndex={0} style={{ cursor: 'pointer' }}>
              <div className="row"><span className="badge badge-purple">SEV-4</span><span style={{ fontSize: 12, color: '#e8eaf6' }}>OpenCode tool timeout</span><span className="spacer" /><span style={{ fontSize: 10, color: '#6b7494', fontFamily: 'JetBrains Mono, monospace' }}>1h</span></div>
              <div style={{ fontSize: 11, color: '#9ba4c0', marginTop: 4 }}>Retry succeeded on attempt 2.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Sparkline() {
  const w = 800, h = 200
  const series = [
    { name: 'Hermes', color: '#7c6cf5', data: generate(60, 0.5, 0.7) },
    { name: 'Claude', color: '#ff4d6d', data: generate(60, 0.4, 0.6) },
    { name: 'OpenCode', color: '#ffb347', data: generate(60, 0.55, 0.5) },
    { name: 'OpenClaw', color: '#00e5ff', data: generate(60, 0.3, 0.4) },
  ]
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      {series.map((s) => {
        const pts = s.data.map((v, i) => `${(i / (s.data.length - 1)) * w},${h - v * h}`).join(' ')
        const area = `M0,${h} L${pts} L${w},${h} Z`
        return (
          <g key={s.name}>
            <path d={area} fill={s.color} opacity={0.06} />
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth="1.5" />
          </g>
        )
      })}
    </svg>
  )
}

function generate(n: number, base: number, amp: number) {
  const arr: number[] = []
  for (let i = 0; i < n; i++) {
    const t = i / n
    arr.push(base + amp * 0.3 * Math.sin(t * Math.PI * 2) + (Math.random() - 0.5) * amp * 0.2)
  }
  return arr
}