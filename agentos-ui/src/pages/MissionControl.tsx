// Machine Control Migration - MissionControl
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { AgentMesh3D } from '../components/AgentMesh3D'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Avatar } from '../design-system/components/data-display/Avatar'
import { Button } from '../design-system/components/data-display/Button'

const STATUS_CARDS = [
  { key: 'claude', name: 'CLAUDE', status: 'Online', tone: 'success' as const, meta: '2.1.142 · 86ms', initial: 'C', color: '#ff4d6d', detail: 'reviewing the agent workspace rebuild', tasks: 3, meshId: 'claude' as const, route: '/claude' },
  { key: 'openclaw', name: 'OPENCLAW', status: 'Offline', tone: 'error' as const, meta: '3 agents · 73 sessions', initial: 'X', color: '#00e5ff', detail: 'no live source connected', tasks: 0, meshId: 'openclaw' as const, route: '/openclaw' },
  { key: 'hermes', name: 'HERMES', status: 'Online', tone: 'success' as const, meta: 'qwen3 · Ollama (local)', initial: 'H', color: '#7c6cf5', detail: 'drafting the v10 launch notes', tasks: 4, meshId: 'hermes' as const, route: '/hermes' },
  { key: 'system', name: 'SYSTEM', status: 'Online', tone: 'success' as const, meta: '2 poll ticks · 4s', initial: 'S', color: '#22d97a', detail: 'telemetry + graphify heartbeat', tasks: 0, meshId: null, route: '/analytics' },
  { key: 'free', name: 'FREE CLAUDE CODE', status: 'Live', tone: 'success' as const, meta: 'owl-alpha · OpenRouter', initial: 'F', color: '#f06292', detail: 'sweeping tasks across the vault', tasks: 2, meshId: null, route: '/hermes' },
  { key: 'gpt', name: 'GPT-5', status: 'Offline', tone: 'error' as const, meta: 'awaiting runtime', initial: 'G', color: '#ffb347', detail: 'no live source connected', tasks: 0, meshId: null, route: '/hermes' },
]

const SELF_GOALS = [
  { name: 'Ship AgentOS v9', sub: 'Production release', due: 'Jul 2026', pct: 78, tone: 'success' as const },
  { name: 'Agentic OS public launch', sub: 'Public release', due: 'Sep 2026', pct: 45, tone: 'purple' as const },
  { name: '100 paying users', sub: 'Revenue milestone', due: 'Dec 2026', pct: 18, tone: 'warning' as const },
]

const FLEET = [
  { name: 'Hermes', role: 'Local-first orchestrator', hex: '#7c6cf5', initial: 'H', session: '12 sessions today', tag: 'Online', tagTone: 'success' as const },
  { name: 'Claude Code', role: 'Deep engineering agent', hex: '#ff4d6d', initial: 'C', session: '8 sessions today', tag: 'Online', tagTone: 'success' as const },
  { name: 'OpenCode', role: 'Fast implementation lane', hex: '#ffb347', initial: 'O', session: '5 sessions today', tag: 'Busy', tagTone: 'warning' as const },
  { name: 'OpenClaw', role: 'Cloud execution surface', hex: '#00e5ff', initial: 'X', session: '0 sessions today', tag: 'Offline', tagTone: 'error' as const },
]

const STATUS_TONE_MAP: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  green: 'success',
  amber: 'warning',
  red: 'error',
  purple: 'info',
  cyan: 'info',
}

const PROGRESS_TONE_MAP: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  green: 'success',
  purple: 'info',
  amber: 'warning',
}

export function MissionControl() {
  const navigate = useNavigate()

  // Status bar badges
  const statusBadges = useMemo(() => [
    { variant: 'success' as const, label: 'online', dot: true },
    { variant: 'info' as const, label: 'Hermes Cloud · minimax-m3' },
    { variant: 'success' as const, label: 'Ollama live' },
    { variant: 'default' as const, label: 'v10.0.0 · 4 agents · 1,261 memories' },
  ], [])

  // Sparkline data
  const sparklineData = useMemo(() => {
    const generate = (n: number, base: number, amp: number) => {
      const arr: number[] = []
      for (let i = 0; i < n; i++) {
        const t = i / n
        arr.push(base + amp * 0.3 * Math.sin(t * Math.PI * 2) + (Math.random() - 0.5) * amp * 0.2)
      }
      return arr
    }

    return [
      { name: 'Hermes', color: '#7c6cf5', data: generate(60, 0.5, 0.7) },
      { name: 'Claude', color: '#ff4d6d', data: generate(60, 0.4, 0.6) },
      { name: 'OpenCode', color: '#ffb347', data: generate(60, 0.55, 0.5) },
      { name: 'OpenClaw', color: '#00e5ff', data: generate(60, 0.3, 0.4) },
    ]
  }, [])

  const renderSparkline = () => {
    const w = 800, h = 200
    return (
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }} aria-hidden="true">
        {sparklineData.map((s) => {
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

  return (
    <div className="page-body" style={{ padding: 'var(--spacing-6)' }}>
      {/* Status Bar */}
      <div className="status-bar" style={{ marginBottom: 'var(--spacing-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center' }}>
        {statusBadges.map((badge, index) => (
          <Badge key={index} variant={badge.variant} size="sm" dot={badge.dot}>
            {badge.label}
          </Badge>
        ))}
      </div>

      {/* Agent Status Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: 'var(--spacing-4)', 
        marginBottom: 'var(--spacing-6)' 
      }}>
        {STATUS_CARDS.map((c) => (
          <Card
            key={c.key}
            variant="elevated"
            hoverable
            onClick={() => navigate(c.route)}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            aria-label={`${c.name} status — ${c.status}. Click to open.`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(c.route); } }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {c.meshId && (
                <div className="mesh-canvas" style={{ marginBottom: 'var(--spacing-4)' }}>
                  <AgentMesh3D agentId={c.meshId} size={110} autoRotate />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                  <Avatar
                    size="sm"
                    name={c.name}
                    src=""
                    style={{ backgroundColor: c.color + '22', color: c.color, borderColor: c.color + '44' }}
                  >
                    {c.initial}
                  </Avatar>
                  <Badge variant={STATUS_TONE_MAP[c.tone] || 'default'} size="sm">
                    {c.status}
                  </Badge>
                </div>
                <div style={{ fontSize: 'var(--text-title-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>{c.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>{c.meta}</div>
                <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)', lineHeight: 1.4 }}>{c.detail}</div>
                {c.tasks > 0 && (
                  <div style={{ marginTop: 'var(--spacing-3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-1)', fontSize: 'var(--text-body-xs)' }}>
                      <span>Active Tasks</span>
                      <span>{c.tasks}</span>
                    </div>
                    <div className="progress-bar" style={{ height: 6, backgroundColor: 'var(--color-surface-container-high)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div className="progress-fill" style={{ width: '60%', height: '100%', backgroundColor: c.color, borderRadius: 'var(--radius-full)', transition: 'width var(--motion-duration-normal) var(--motion-easing-standard)' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Goals & Fleet Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <Card variant="elevated" hoverable onClick={() => navigate('/goals')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/goals'); } }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-sm)', lineHeight: 1 }}>◈</span>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>SELF · GOALS</span>
            </div>
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate('/goals'); }}>
              View all →
            </Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            {SELF_GOALS.map((g) => (
              <div key={g.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--spacing-2)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-body-md)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{g.name}</div>
                    <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)', fontFamily: 'var(--font-mono)' }}>{g.due} · {g.sub}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-title-md)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{g.pct}%</span>
                </div>
                <div className="progress-bar" style={{ height: 6, backgroundColor: 'var(--color-surface-container-high)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div className={'progress-fill ' + (PROGRESS_TONE_MAP[g.tone] || '')} style={{ width: g.pct + '%', height: '100%', borderRadius: 'var(--radius-full)', transition: 'width var(--motion-duration-slow) var(--motion-easing-standard)' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-sm)', lineHeight: 1 }}>⊕</span>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>AGENT FLEET · 4</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            {FLEET.map((f) => (
              <div 
                key={f.name} 
                className="row" 
                onClick={() => navigate('/' + f.name.toLowerCase().replace(' ', ''))} 
                role="button" 
                tabIndex={0} 
                style={{ padding: 'var(--spacing-2) 0', borderBottom: '1px solid var(--color-border-primary)', cursor: 'pointer' }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/' + f.name.toLowerCase().replace(' ', '')); } }}
              >
                <Avatar
                  size="sm"
                  name={f.name}
                  src=""
                  style={{ backgroundColor: f.hex + '22', color: f.hex, borderColor: f.hex + '44' }}
                >
                  {f.initial}
                </Avatar>
                <div style={{ flex: 1, marginLeft: 'var(--spacing-3)' }}>
                  <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{f.name}</div>
                  <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>{f.role}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Badge variant={f.tagTone} size="sm">{f.tag}</Badge>
                  <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)', fontFamily: 'var(--font-mono)', marginTop: 'var(--spacing-1)' }}>{f.session}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Telemetry & Incidents Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--spacing-4)' }}>
        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-sm)', lineHeight: 1 }}>∿</span>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>LIVE TELEMETRY · LAST 60 MIN</span>
            </div>
          </div>
          <div className="canvas-wrap" style={{ height: 200, marginBottom: 'var(--spacing-4)' }}>
            {renderSparkline()}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--spacing-4)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Tasks</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>412</div>
              <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)' }}>+18 last hour</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Latency</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>640ms</div>
              <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)' }}>p95 · all agents</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Tokens</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>2.4M</div>
              <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)' }}>today · across fleet</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-label-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>Cost</div>
              <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>$14.20</div>
              <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)' }}>today · est.</div>
            </div>
          </div>
        </Card>

        <Card variant="elevated">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--text-display-sm)', lineHeight: 1 }}>⚠</span>
              <span style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>RECENT INCIDENTS</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/alerts')}>
              View all →
            </Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <Card variant="outlined" hoverable onClick={() => navigate('/alerts')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/alerts'); } }} style={{ padding: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                <Badge variant="error" size="sm">SEV-2</Badge>
                <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-primary)', flex: 1 }}>OpenClaw session expired</span>
                <span style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)', fontFamily: 'var(--font-mono)' }}>4m</span>
              </div>
              <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>Token refresh failed; manual reconnect required.</div>
            </Card>
            <Card variant="outlined" hoverable onClick={() => navigate('/alerts')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/alerts'); } }} style={{ padding: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                <Badge variant="warning" size="sm">SEV-3</Badge>
                <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-primary)', flex: 1 }}>Hermes vault slow write</span>
                <span style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)', fontFamily: 'var(--font-mono)' }}>22m</span>
              </div>
              <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>IndexedDB compaction queued; user not blocked.</div>
            </Card>
            <Card variant="outlined" hoverable onClick={() => navigate('/alerts')} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/alerts'); } }} style={{ padding: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                <Badge variant="info" size="sm">SEV-4</Badge>
                <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-primary)', flex: 1 }}>OpenCode tool timeout</span>
                <span style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-quaternary)', fontFamily: 'var(--font-mono)' }}>1h</span>
              </div>
              <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)' }}>Retry succeeded on attempt 2.</div>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  )
}