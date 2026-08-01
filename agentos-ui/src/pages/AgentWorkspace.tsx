import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { AgentMesh3D } from '../components/AgentMesh3D'
import { useUIStore } from '../stores/UIStore'

type TabId = 'chat' | 'goal-mode' | 'workspace' | 'control-room'

const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'chat', label: 'Chat', icon: '◌' },
  { id: 'goal-mode', label: 'Goal Mode', icon: '◈' },
  { id: 'workspace', label: 'Workspace', icon: '◧' },
  { id: 'control-room', label: 'Control Room', icon: '◰' },
]

interface BootLine {
  tone: 'ok' | 'dim' | 'info' | 'warn' | 'err'
  text: string
}

interface AgentSpec {
  id: string
  meshId: 'hermes' | 'claude' | 'opencode' | 'openclaw'
  name: string
  subtitle: string
  color: string
  status: 'online' | 'busy' | 'offline' | 'live'
  meta: string
  runtime: string
  buckets: number
  prompts: string[]
  bootLines: BootLine[]
  storageKey: string
}

const AGENT_SPECS: Record<string, AgentSpec> = {
  hermes: {
    id: 'hermes', meshId: 'hermes',
    name: 'Hermes',
    subtitle: 'Nous Research agent. Sessions, skills, kanban — and a chat line.',
    color: '#7c6cf5', status: 'online',
    meta: 'qwen3 · Ollama (local)',
    runtime: 'Hermes Cloud · minimax-m3',
    buckets: 5,
    prompts: ['- AI workflow demo', '- Free AI tools Skool', '- AI automation vault', '- Hermes setup for AIPB members', '- "AI Profit Boardroom worth it"'],
    bootLines: [
      { tone: 'ok', text: '[booted] hermes v10.0.0 — pid 4821' },
      { tone: 'dim', text: '[vault] connected · 1,261 records · 3,408 links' },
      { tone: 'info', text: '[ollama] connected · qwen3:14b · ctx 8192' },
      { tone: 'ok', text: '[graphify] ready · 21 nodes · 29 edges' },
      { tone: 'dim', text: '[memory] loaded · last sync 4m ago' },
      { tone: 'warn', text: '[voice] no live source connected' },
      { tone: 'ok', text: '[system] all lanes green · telemetry streaming' },
    ],
    storageKey: 'agentos-hermes-goals',
  },
  claude: {
    id: 'claude', meshId: 'claude',
    name: 'Claude Code',
    subtitle: 'Deep engineering agent. Reviews, architecture, refactors, analysis.',
    color: '#ff4d6d', status: 'online',
    meta: '2.1.142 · 86ms',
    runtime: 'Claude Code · Opus 4',
    buckets: 4,
    prompts: ['- Review last 4 commits in agentos-ui', '- Audit sidebar nav for accessibility', '- Catch missing TypeScript strictness', '- Find any Math.random used as data'],
    bootLines: [
      { tone: 'ok', text: '[booted] claude-code v2.1.142 — pid 9013' },
      { tone: 'dim', text: '[git] connected · 14 branches tracked' },
      { tone: 'info', text: '[tools] 17 capabilities loaded · 12 enabled' },
      { tone: 'ok', text: '[tests] 412 passing · 0 failing' },
      { tone: 'dim', text: '[review queue] 3 PRs awaiting review' },
      { tone: 'warn', text: '[api] OpenRouter rate limit at 78%' },
      { tone: 'ok', text: '[session] streaming · ready' },
    ],
    storageKey: 'agentos-claude-goals',
  },
  opencode: {
    id: 'opencode', meshId: 'opencode',
    name: 'OpenCode',
    subtitle: 'Fast implementation lane. TypeScript, Vite, edits, commits, diffs.',
    color: '#ffb347', status: 'busy',
    meta: 'streaming · 310ms',
    runtime: 'OpenCode · ollama-cloud/minimax-m3',
    buckets: 4,
    prompts: ['- Compact MissionControl card row layout', '- Replace inline styles with CSS vars', '- Wire workspace tabs to setRoute', '- Add role-based default tab per agent'],
    bootLines: [
      { tone: 'ok', text: '[booted] opencode v10.0.0 — pid 3344' },
      { tone: 'dim', text: '[vite] dev server up · 280KB bundle' },
      { tone: 'info', text: '[tsc] strict mode · 0 errors · 0 warnings' },
      { tone: 'warn', text: '[worktree] 2 uncommitted patches' },
      { tone: 'ok', text: '[git] branch: feat/v10-pages' },
      { tone: 'dim', text: '[diffs] 14 files modified · 412 lines added' },
      { tone: 'ok', text: '[commits] 3 staged · 1 ahead of origin' },
    ],
    storageKey: 'agentos-opencode-goals',
  },
  openclaw: {
    id: 'openclaw', meshId: 'openclaw',
    name: 'OpenClaw',
    subtitle: 'Cloud execution surface. Connectors, automations, schedules, runtime.',
    color: '#00e5ff', status: 'offline',
    meta: 'awaiting runtime · 73 sessions',
    runtime: 'OpenClaw · Cloud runtime',
    buckets: 4,
    prompts: ['- Sweep all 7 connectors', '- Extend retry window for OpenClaw lane', '- Stream memory writes to Obsidian', '- Run scheduler for daily digest'],
    bootLines: [
      { tone: 'err', text: '[booted] openclaw v3.4.1 — pid 2210' },
      { tone: 'dim', text: '[connectors] 7 configured · 3 healthy' },
      { tone: 'warn', text: '[auth] token refresh failed · manual reconnect required' },
      { tone: 'err', text: '[scheduler] paused · 4 jobs pending' },
      { tone: 'dim', text: '[runtime] offline · no live source connected' },
      { tone: 'dim', text: '[webhook] 0 received · 0 sent (last 24h)' },
      { tone: 'ok', text: '[queue] 12 messages drained before disconnect' },
    ],
    storageKey: 'agentos-openclaw-goals',
  },
}

const GEMINI_SPEC: AgentSpec = {
  id: 'gemini', meshId: 'hermes',
  name: 'Gemini',
  subtitle: 'Google model runtime. Lightweight chat and reasoning surface.',
  color: '#f06292', status: 'offline',
  meta: 'no live source connected',
  runtime: 'Gemini · runtime offline',
  buckets: 0,
  prompts: ['- Say hello in exactly 2 words', '- Draft the launch announcement', '- Compare pricing tiers'],
  bootLines: [
    { tone: 'err', text: '[booted] gemini lane · runtime not configured' },
    { tone: 'dim', text: '[env] VITE_GEMINI_API_KEY missing' },
    { tone: 'warn', text: '[status] waiting for live source to connect' },
  ],
  storageKey: 'agentos-gemini-goals',
}

function getSpec(agentId: string): AgentSpec {
  return AGENT_SPECS[agentId] ?? GEMINI_SPEC
}

function statusBadgeTone(s: AgentSpec['status']) {
  if (s === 'online' || s === 'live') return 'green' as const
  if (s === 'busy') return 'amber' as const
  return 'red' as const
}

const BUCKETS = [
  { name: 'Goal Mode', count: 25, icon: '◈' },
  { name: 'Apps', count: 12, icon: '⊞' },
  { name: 'Videos', count: 3, icon: '▶' },
  { name: 'Images', count: 9, icon: '◧' },
  { name: 'Memory', count: 18, icon: '◉' },
]

const FILES = [
  { name: 'q3-goals.md', size: '4.2 KB', modified: '2h' },
  { name: 'launch-notes.md', size: '8.1 KB', modified: '4h' },
  { name: 'agentos-architecture.md', size: '12.4 KB', modified: '1d' },
  { name: 'graphify-design.md', size: '6.7 KB', modified: '2d' },
  { name: 'openclaw-connectors.md', size: '3.8 KB', modified: '3d' },
]

interface GoalRun { id: number; name: string; state: 'RUNNING' | 'QUEUED' | 'COMPLETED' | 'FAILED'; progress: number }

const DEFAULT_RUNS: GoalRun[] = [
  { id: 1, name: 'Audit agent workspace for production', state: 'RUNNING', progress: 64 },
  { id: 2, name: 'Draft Q3 goals essay for distribution', state: 'QUEUED', progress: 0 },
]

interface ChatTurn { id: string; role: 'user' | 'agent'; content: string }

function loadRuns(key: string): GoalRun[] {
  try {
    const stored = localStorage.getItem(key)
    if (stored) return JSON.parse(stored)
  } catch {}
  return DEFAULT_RUNS
}

function saveRuns(key: string, runs: GoalRun[]) {
  try { localStorage.setItem(key, JSON.stringify(runs)) } catch {}
}

export function AgentWorkspaceRoute({ agentId: propAgentId }: { agentId?: string }) {
  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const agentKey = (propAgentId || params.agentId || 'hermes') as string
  const spec = getSpec(agentKey)
  const tabParam = (searchParams.get('tab') as TabId) || 'chat'
  const validTab = (['chat', 'goal-mode', 'workspace', 'control-room'].includes(tabParam) ? tabParam : 'chat') as TabId
  const setTab = (t: TabId) => setSearchParams({ tab: t })

  return (
    <AgentWorkspace
      spec={spec}
      tab={validTab}
      setTab={setTab}
    />
  )
}

function AgentWorkspace({ spec, tab, setTab }: { spec: AgentSpec; tab: TabId; setTab: (t: TabId) => void }) {
  return (
    <>
      <div className="status-pills">
        <span className={'badge badge-' + statusBadgeTone(spec.status)}><span className={'dot dot-' + statusBadgeTone(spec.status)} /> {spec.status}</span>
        <span className="badge badge-cyan"><span className="mono">{spec.runtime}</span></span>
        <span className="badge badge-green"><span className="mono">{spec.meta}</span></span>
        <span className="badge badge-gray"><span className="mono">{spec.buckets} buckets · 1,261 memories</span></span>
      </div>

      <div className="ws-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={'ws-tab ' + (tab === t.id ? 'active' : '')} onClick={() => setTab(t.id)} aria-pressed={tab === t.id}>
            <span className="ico" aria-hidden="true">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="ws-body">
        {tab === 'chat' && <ChatTab spec={spec} />}
        {tab === 'goal-mode' && <GoalModeTab spec={spec} />}
        {tab === 'workspace' && <WorkspaceTab spec={spec} />}
        {tab === 'control-room' && <ControlRoomTab spec={spec} />}
      </div>
    </>
  )
}

function ChatTab({ spec }: { spec: AgentSpec }) {
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [draft, setDraft] = useState('')
  const logRef = useRef<HTMLDivElement>(null)
  const pushToast = useUIStore((s) => s.pushToast)

  useEffect(() => {
    setTurns([
      { id: 'sys-1', role: 'agent', content: `[booted] ${spec.name.toLowerCase()} ${spec.runtime} · ready` },
      { id: 'sys-2', role: 'agent', content: '[vault] connected · 1,261 records · 3,408 links' },
      { id: 'sys-3', role: 'agent', content: `${spec.name} lane is ready. Tell me what to do next.` },
    ])
  }, [spec.id, spec.name, spec.runtime])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns])

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setTurns((p) => [...p, { id: 'u-' + Date.now(), role: 'user', content: text }])
    setDraft('')
    setTimeout(() => {
      setTurns((p) => [
        ...p,
        {
          id: 'a-' + Date.now(),
          role: 'agent',
          content: `${spec.name} received "${text.slice(0, 60)}${text.length > 60 ? '…' : ''}". Streaming response once VITE_AGENTOS_WS_URL is configured for ${spec.id}.`,
        },
      ])
      pushToast({ title: `${spec.name} responded`, message: `Echoed ${text.length} chars · 420ms`, tone: 'success' })
    }, 420)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div ref={logRef} style={{ flex: 1, overflowY: 'auto', paddingBottom: 24 }}>
        <div className="agent-hero">
          <div className="agent-hero-text">
            <h1 className="hero-title" style={{ textAlign: 'left', marginBottom: 8 }}>{spec.name}</h1>
            <p className="hero-sub" style={{ textAlign: 'left', margin: 0, maxWidth: 'none' }}>{spec.subtitle}</p>
          </div>
          <div className="agent-hero-mesh">
            <AgentMesh3D agentId={spec.meshId} size={200} />
          </div>
        </div>

        <div className="mini-stats" style={{ marginBottom: 24 }}>
          <div className="mini-stat">
            <div className="label">STATUS</div>
            <div className="val ok">● {spec.status}</div>
          </div>
          <div className="mini-stat">
            <div className="label">VAULT</div>
            <div className="val">1,261</div>
          </div>
          <div className="mini-stat">
            <div className="label">BUCKETS</div>
            <div className="val">{spec.buckets}</div>
          </div>
        </div>

        <div className="chat-log">
          {turns.map((t) => (
            <div key={t.id} className={'chat-bubble ' + t.role}>
              <div className="chat-avatar">{t.role === 'user' ? 'Y' : spec.name[0]}</div>
              <div>
                <div className="chat-meta">{t.role === 'user' ? 'you · just now' : spec.name + ' · ' + spec.runtime.split('·')[0].trim()}</div>
                <div className="chat-text">{t.content}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 720, margin: '32px auto 0', padding: 14, background: '#06080f', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 10 }}>
          <div style={{ fontSize: 9.5, color: '#6b7494', textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 8, fontWeight: 600 }}>Suggested prompts</div>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#9ba4c0', lineHeight: 1.7 }}>{spec.prompts.join('\n')}</pre>
        </div>
      </div>

      <div className="composer">
        <div className="composer-inner">
          <textarea
            className="composer-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send() }
            }}
            placeholder={`Message ${spec.name}… (⌘+Enter)`}
            rows={2}
            aria-label={`Message ${spec.name}`}
          />
          <div className="composer-bar">
            <button className="composer-pill"><span className="ico" aria-hidden="true">◉</span><span>memory</span></button>
            <button className="composer-pill"><span className="ico" aria-hidden="true">◧</span><span>workspace</span></button>
            <button className="composer-pill"><span className="ico" aria-hidden="true">◈</span><span>goal mode</span></button>
            <span className="spacer" />
            <span style={{ fontSize: 11, color: '#6b7494' }} className="mono">{draft.length} chars</span>
            <button className="composer-send" onClick={send} aria-label={`Send message to ${spec.name}`} disabled={!draft.trim()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function GoalModeTab({ spec }: { spec: AgentSpec }) {
  const [title, setTitle] = useState('')
  const [prompt, setPrompt] = useState('')
  const [runs, setRuns] = useState<GoalRun[]>(() => loadRuns(spec.storageKey))
  const pushToast = useUIStore((s) => s.pushToast)

  useEffect(() => {
    const interval = setInterval(() => {
      setRuns((prev) => {
        const next = prev.map((r) => {
          if (r.state === 'RUNNING' && r.progress < 100) {
            const delta = Math.min(8, Math.random() * 6 + 2)
            const np = Math.min(100, r.progress + delta)
            return { ...r, progress: np, state: np >= 100 ? 'COMPLETED' as const : r.state }
          }
          if (r.state === 'QUEUED' && Math.random() < 0.3) {
            return { ...r, state: 'RUNNING' as const, progress: 5 }
          }
          return r
        })
        saveRuns(spec.storageKey, next)
        return next
      })
    }, 1200)
    return () => clearInterval(interval)
  }, [spec.storageKey])

  const launch = () => {
    const name = title.trim() || (prompt.trim().slice(0, 60) || 'New goal')
    const id = Date.now()
    const next = [...runs, { id, name, state: 'QUEUED' as const, progress: 0 }]
    setRuns(next)
    saveRuns(spec.storageKey, next)
    setTitle('')
    setPrompt('')
    pushToast({ title: 'Goal queued', message: `${spec.name} will run "${name}" shortly.`, tone: 'success' })
  }

  const cancel = (id: number) => {
    const next = runs.filter((r) => r.id !== id)
    setRuns(next)
    saveRuns(spec.storageKey, next)
    pushToast({ title: 'Goal cancelled', message: 'Run removed from queue.', tone: 'info' })
  }

  const running = runs.filter((r) => r.state === 'RUNNING').length
  const total = runs.length

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 600, marginBottom: 8, color: '#e8eaf6' }}>Goal Mode</h2>
      <p style={{ fontSize: 13.5, color: '#9ba4c0', marginBottom: 24, lineHeight: 1.55 }}>
        Launch a long-running goal in {spec.name}. {spec.name} will keep working until the goal is finished or you cancel it.
      </p>

      <div style={{ marginBottom: 18 }}>
        <label className="field-label" htmlFor="goal-title">Goal title (optional — auto-derived from prompt)</label>
        <input
          id="goal-title"
          className="field-input"
          placeholder="e.g. Ship AgentOS v10 launch page"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 18 }}>
        <label className="field-label" htmlFor="goal-prompt">Goal prompt</label>
        <textarea
          id="goal-prompt"
          className="field-textarea"
          placeholder={`Describe what ${spec.name} should accomplish. Include constraints, sources of truth, and how you'll know it's done.`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="row" style={{ marginBottom: 28 }}>
        <button className="btn-primary" onClick={launch} disabled={spec.status === 'offline'} aria-label="Launch goal">
          {spec.status === 'offline' ? 'Runtime offline — cannot launch' : 'Launch goal'}
        </button>
        <span className="badge badge-purple">{running} running · {total} total</span>
        <span className="spacer" />
        <span style={{ fontSize: 11, color: '#6b7494' }} className="mono">{spec.runtime}</span>
      </div>

      <div className="section-label" style={{ marginBottom: 14 }}>
        <span className="ico" aria-hidden="true">◈</span>
        GOAL MODE · {running}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {runs.length === 0 && (
          <div className="panel-sm" style={{ textAlign: 'center', color: '#6b7494', fontSize: 12.5, padding: 24 }}>No goals yet. Launch one above to get started.</div>
        )}
        {runs.map((g) => (
          <div key={g.id} className="panel-sm">
            <div className="spread" style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6' }}>{g.name}</div>
              <div className="row" style={{ gap: 6 }}>
                <span className={'badge badge-' + (g.state === 'RUNNING' ? 'green' : g.state === 'COMPLETED' ? 'purple' : g.state === 'FAILED' ? 'red' : 'gray')}>{g.state}</span>
                {g.state !== 'COMPLETED' && (
                  <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={() => cancel(g.id)} aria-label={`Cancel goal ${g.name}`}>Cancel</button>
                )}
              </div>
            </div>
            <div className="progress-bar">
              <div className={'progress-fill ' + (g.state === 'RUNNING' ? 'green' : g.state === 'COMPLETED' ? 'purple' : g.state === 'FAILED' ? 'red' : 'gray')} style={{ width: g.progress + '%' }} />
            </div>
            <div style={{ fontSize: 11, color: '#6b7494', marginTop: 6 }} className="mono">{Math.round(g.progress)}% · {g.state === 'RUNNING' ? 'streaming updates every 1.2s' : g.state === 'COMPLETED' ? 'done' : g.state === 'FAILED' ? 'failed' : 'waiting for runtime'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WorkspaceTab({ spec }: { spec: AgentSpec }) {
  const [selected, setSelected] = useState('Goal Mode')
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 12, height: '100%' }}>
      <div className="panel" style={{ overflowY: 'auto' }}>
        <div className="section-label">
          <span className="ico" aria-hidden="true">◧</span>
          BUCKETS · {spec.buckets}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {BUCKETS.map((b) => (
            <div key={b.name} className={'folder-row ' + (selected === b.name ? 'selected' : '')} onClick={() => setSelected(b.name)} role="button" tabIndex={0}>
              <span className="ico" style={{ color: '#ffb347' }} aria-hidden="true">{b.icon}</span>
              <span className="name">{b.name}</span>
              <span className="count">{b.count} files</span>
            </div>
          ))}
        </div>

        <div className="section-label" style={{ marginTop: 24 }}>
          <span className="ico" aria-hidden="true">◰</span>
          TAGS
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {['build', 'ship', 'growth', 'distribution', 'hermes', 'claude', 'opencode', 'openclaw', 'vault', 'graphify', 'omi'].map((t) => (
            <span key={t} className="collab-chip">#{t}</span>
          ))}
        </div>
      </div>

      <div className="panel" style={{ overflowY: 'auto' }}>
        <div className="spread" style={{ marginBottom: 16 }}>
          <div>
            <div className="section-label" style={{ marginBottom: 4 }}>
              <span className="ico" aria-hidden="true">◧</span>
              {selected.toUpperCase()}
            </div>
            <div style={{ fontSize: 11, color: '#6b7494' }} className="mono">{BUCKETS.find((b) => b.name === selected)?.count} files</div>
          </div>
          <div className="row">
            <button className="btn-secondary">+ New file</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {FILES.map((f) => (
            <div key={f.name} className="table-row" style={{ cursor: 'pointer' }}>
              <span style={{ fontSize: 14, color: '#9ba4c0' }} aria-hidden="true">◧</span>
              <span style={{ fontSize: 13, color: '#e8eaf6', fontWeight: 500, flex: 1 }}>{f.name}</span>
              <span style={{ fontSize: 11, color: '#6b7494' }} className="mono">{f.size}</span>
              <span style={{ fontSize: 11, color: '#6b7494', minWidth: 30 }} className="mono">{f.modified}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ControlRoomTab({ spec }: { spec: AgentSpec }) {
  return (
    <div>
      <div className="terminal">
        {spec.bootLines.map((l, i) => (
          <div key={i} className={'line ' + l.tone}>
            <span style={{ color: '#4a5170' }}>{String(i + 1).padStart(2, '0')}</span>
            <span>{l.text}</span>
          </div>
        ))}
        <div className="line prompt-row">
          <span className="ps">{spec.id}$</span>
          <span className="cursor" />
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '24px auto 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="panel-sm">
          <div style={{ fontSize: 9.5, color: '#6b7494', textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 8, fontWeight: 600 }}>Tools</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['vault.read', 'vault.write', 'graphify.mutate', 'memory.search', 'telegram.send', 'discord.send', 'git.commit', 'shell.run'].map((t) => (
              <span key={t} style={{ padding: '3px 8px', borderRadius: 5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', fontSize: 11.5, color: '#9ba4c0', fontFamily: 'JetBrains Mono, monospace' }}>{t}</span>
            ))}
          </div>
        </div>
        <div className="panel-sm">
          <div style={{ fontSize: 9.5, color: '#6b7494', textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 8, fontWeight: 600 }}>Command bar</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#9ba4c0', lineHeight: 1.7 }}>
            <div>run <span style={{ color: '#d946ef' }}>"hermes {'{prompt}'}"</span></div>
            <div>help</div>
            <div>clear</div>
            <div>status</div>
            <div>vault.search</div>
          </div>
        </div>
      </div>
    </div>
  )
}