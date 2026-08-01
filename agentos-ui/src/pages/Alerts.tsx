import { useState } from 'react'
import { ALERTS as RAW_ALERTS, INCIDENT_TRENDS, RESOLUTIONS, AGENTS } from '../lib/demo-data'
import { useUIStore } from '../stores/UIStore'

const STATUS_BADGE: Record<string, string> = { Assigned: 'purple', Open: 'cyan', Resolved: 'green' }
const ALERT_BORDER: Record<string, string> = { critical: '#ff4d6d', warning: '#ffb347', info: '#22d97a', success: '#22d97a' }

export function Alerts() {
  const [alerts, setAlerts] = useState(RAW_ALERTS)
  const pushToast = useUIStore((s) => s.pushToast)

  const resolve = (id: string, title: string) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: 'Resolved' as const } : a))
    pushToast({ title: 'Alert resolved', message: title, tone: 'success' })
  }

  const openCount = alerts.filter((a) => a.status !== 'Resolved').length
  const resolvedCount = alerts.filter((a) => a.status === 'Resolved').length
  const assignedCount = alerts.filter((a) => a.status === 'Assigned').length
  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="badge badge-red"><span className="dot dot-red" /> {openCount} open incidents</span>
        <span className="badge badge-amber"><span className="mono">MTTR 18m</span></span>
        <span className="badge badge-purple"><span className="mono">{assignedCount} assigned</span></span>
        <span className="badge badge-green"><span className="mono">{resolvedCount} resolved 24h</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 12, alignItems: 'stretch' }}>
        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">⏱</span> LIVE INCIDENT TIMELINE</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {alerts.map((alert) => (
                <div key={alert.id} className="table-row" style={{ opacity: alert.status === 'Resolved' ? 0.55 : 1 }}>
                  <span className={`dot dot-${alert.dot}`} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#e8eaf6', textDecoration: alert.status === 'Resolved' ? 'line-through' : 'none' }}>{alert.title}</div>
                    <div style={{ fontSize: 11, color: '#6b7494' }} className="mono">owner · {alert.owner.id} · sequence #{alert.sequence}</div>
                  </div>
                  {alert.status !== 'Resolved' && (
                    <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={() => resolve(alert.id, alert.title)} aria-label={`Resolve ${alert.title}`}>Resolve</button>
                  )}
                  <span className="badge badge-gray">{alert.age}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">⊕</span> OWNERSHIP & ASSIGNMENT</div>
            <div className="grid2">
              {alerts.filter((a) => a.status !== 'Resolved').map((alert) => (
                <div key={alert.id} className="panel-sm" style={{ borderLeft: `3px solid ${ALERT_BORDER[alert.type]}` }}>
                  <div className="row">
                    <span className={`dot dot-${alert.dot}`} />
                    <span style={{ fontSize: 12.5, fontWeight: 500, color: '#e8eaf6' }}>{alert.title}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#9ba4c0', marginTop: 4, lineHeight: 1.5 }}>{alert.subtitle}</div>
                  <div className="row" style={{ marginTop: 8 }}>
                    <span className={`badge badge-${alert.owner.color}`} style={{ fontSize: 9.5 }}>{alert.owner.name}</span>
                    <div className="spacer" />
                    <span className={`badge badge-${STATUS_BADGE[alert.status]}`} style={{ fontSize: 9.5 }}>{alert.status}</span>
                    <button className="btn-secondary" style={{ fontSize: 10, padding: '3px 8px' }} onClick={() => resolve(alert.id, alert.title)}>Resolve</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">⇄</span> ESCALATION PATHS</div>
            <div className="row" style={{ justifyContent: 'space-around', padding: '8px 0', flexWrap: 'wrap' }}>
              {AGENTS.map((agent, i) => (
                <div key={agent.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div className="agent-circle" style={{ background: agent.hex, color: agent.color === 'amber' ? '#1a1000' : '#fff', borderColor: agent.hex, width: 36, height: 36, fontSize: 13 }}>{agent.initial}</div>
                  <div style={{ fontSize: 12, color: '#e8eaf6', fontWeight: 500 }}>{agent.name}</div>
                  <div style={{ fontSize: 10, color: '#6b7494' }} className="mono">{3 - i} queued</div>
                  {i < AGENTS.length - 1 && <span style={{ color: '#4a5170', fontSize: 18 }}>→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">∿</span> INCIDENT TRENDS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
              {INCIDENT_TRENDS.map((t) => (
                <div key={t.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ba4c0', marginBottom: 4 }}>
                    <span>{t.label}</span>
                    <span className="mono">{t.count}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: t.pct + '%', background: t.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="row" style={{ gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <Stat label="OPEN" value={String(openCount)} color="#ff4d6d" />
              <Stat label="ASSIGNED" value={String(assignedCount)} color="#7c6cf5" />
              <Stat label="RESOLVED" value={String(resolvedCount)} color="#22d97a" />
              <Stat label="MTTR" value="18m" color="#00e5ff" />
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">◴</span> RESOLUTION HISTORY</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {RESOLUTIONS.map((r, i) => (
                <div key={i} className="table-row">
                  <span className="dot dot-green" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#e8eaf6' }}>{r.title}</div>
                    <div style={{ fontSize: 10.5, color: '#6b7494' }}>{r.owner}: {r.resolution}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="stat-val" style={{ fontSize: 18, color }}>{value}</div>
      <div style={{ fontSize: 10, color: '#6b7494' }}>{label}</div>
    </div>
  )
}