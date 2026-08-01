import { useState } from 'react'
import { LOGS } from '../lib/demo-data'

const LEVEL_FILTERS = ['all', 'info', 'warn', 'error', 'debug'] as const

const AGENT_COLORS: Record<string, string> = {
  hermes: '#7c6cf5',
  claude: '#ff4d6d',
  opencode: '#ffb347',
  openclaw: '#00e5ff',
  system: '#22d97a',
  dev: '#00e5ff',
}

const LEVEL_COLOR: Record<string, string> = {
  INFO: 'cyan',
  WARN: 'amber',
  ERROR: 'red',
  DEBUG: 'gray',
}

export function Logs() {
  const [filter, setFilter] = useState<typeof LEVEL_FILTERS[number]>('all')
  const [search, setSearch] = useState('')

  const filtered = LOGS.filter((l) => {
    const matchLevel = filter === 'all' || l.level.toLowerCase() === filter
    const matchSearch = !search || l.message.toLowerCase().includes(search.toLowerCase())
    return matchLevel && matchSearch
  })

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-green"><span className="dot dot-green" /> streaming</span>
        <span className="badge badge-cyan"><span className="mono">{filtered.length} entries</span></span>
        <span className="badge badge-purple"><span className="mono">4 sources · 4 levels</span></span>
        <span className="badge badge-gray"><span className="mono">tail -f /var/log/agentos</span></span>
      </div>

      <div className="row" style={{ marginBottom: 14, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#141830', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, padding: '8px 12px', flex: 1 }}>
          <span style={{ color: '#6b7494', fontSize: 14 }}>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs..."
            style={{ flex: 1, background: 'transparent', fontSize: 13, color: '#e8eaf6', border: 'none', outline: 'none' }}
          />
          <span style={{ fontSize: 10, color: '#4a5170' }} className="mono">⌘F</span>
        </div>
        {LEVEL_FILTERS.map((level) => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={'badge ' + (filter === level ? 'badge-pink' : 'badge-gray')}
            style={{ fontSize: 11, padding: '6px 12px', border: 'none', cursor: 'pointer', textTransform: 'lowercase', fontWeight: 600 }}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', fontSize: 9.5, color: '#6b7494', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600 }} className="mono">
          <span style={{ minWidth: 50 }}>TIME</span>
          <span style={{ minWidth: 60 }}>LEVEL</span>
          <span style={{ minWidth: 80 }}>SOURCE</span>
          <span style={{ flex: 1 }}>MESSAGE</span>
        </div>
        <div style={{ padding: '4px 16px' }}>
          {filtered.map((log) => (
            <div key={log.id} className="log-row">
              <span className="log-time">{log.time}</span>
              <span className="log-level">
                <span className={'badge badge-' + LEVEL_COLOR[log.level]} style={{ fontSize: 9.5 }}>{log.level}</span>
              </span>
              <span className="log-src" style={{ color: AGENT_COLORS[log.source] ?? '#9ba4c0' }}>{log.source}</span>
              <span className="log-msg">{log.message}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: '#6b7494', fontSize: 13 }}>No logs match the current filter.</div>
          )}
        </div>
      </div>
    </div>
  )
}