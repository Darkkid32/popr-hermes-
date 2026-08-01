import { useCallback, useState } from 'react'
import { Canvas } from '../components/Canvas'
import { WORKFLOWS, WF_STEPS, WF_FLOW, EXECUTION_HISTORY, AGENTS } from '../lib/demo-data'
import { useUIStore } from '../stores/UIStore'

const STATUS_BADGE: Record<string, string> = { RUNNING: 'green', QUEUED: 'amber', FAILED: 'red', COMPLETED: 'purple' }

export function Workflows() {
  const [activeId, setActiveId] = useState(WORKFLOWS[0].id)
  const wf = WORKFLOWS.find((w) => w.id === activeId) ?? WORKFLOWS[0]
  const pushToast = useUIStore((s) => s.pushToast)

  const drawWF = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    ctx.clearRect(0, 0, W, H)
    WF_FLOW.forEach(([a, b]) => {
      const sa = WF_STEPS[a]
      const sb = WF_STEPS[b]
      ctx.beginPath()
      ctx.moveTo(sa.x * W, sa.y * H)
      ctx.lineTo(sb.x * W, sb.y * H)
      ctx.strokeStyle = 'rgba(124, 108, 245, 0.4)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([4, 5])
      ctx.stroke()
      ctx.setLineDash([])
    })
    WF_STEPS.forEach((s) => {
      const x = s.x * W
      const y = s.y * H
      const r = 32
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = s.color + '33'
      ctx.fill()
      ctx.strokeStyle = s.color
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.fillStyle = '#e8eaf6'
      ctx.font = '600 10px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(s.label, x, y - 6)
      ctx.fillStyle = '#9ba4c0'
      ctx.font = '9px JetBrains Mono, monospace'
      ctx.fillText(s.sub, x, y + 8)
    })
  }, [])

  const failureRate = wf.runs === 0 ? 0 : Math.round((wf.failures / wf.runs) * 100)

  return (
    <div className="page-body">
      <div className="status-pills" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className={'badge badge-' + STATUS_BADGE[wf.status]}>{wf.status}</span>
        <span className="badge badge-cyan"><span className="mono">{wf.latency} median latency</span></span>
        <span className="badge badge-green"><span className="mono">{wf.efficiency}% efficiency</span></span>
        <span className="badge badge-gray"><span className="mono">{wf.runs} runs · {wf.failures} failures</span></span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 260px', gap: 12, alignItems: 'stretch' }}>
        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">⌘</span> RUNNING WORKFLOWS · {WORKFLOWS.length}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {WORKFLOWS.map((w) => (
                <button
                  key={w.id}
                  className={'panel-sm ' + (w.id === wf.id ? 'selected' : '')}
                  style={{ borderLeft: `3px solid ${AGENTS.find((a) => a.color === w.ownerColor)?.hex ?? '#7c6cf5'}`, textAlign: 'left', cursor: 'pointer', background: w.id === wf.id ? '#1a1f38' : '#141830' }}
                  onClick={() => setActiveId(w.id)}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 13 }}>{w.name}</div>
                  <div style={{ fontSize: 10.5, color: '#9ba4c0' }}>{w.owner} · <span style={{ color: '#00e5ff' }}>{w.cost}</span></div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>
                    <span style={{ color: '#6b7494' }}>RUNS <b style={{ color: '#e8eaf6' }}>{w.runs}</b></span>
                    <span style={{ color: '#6b7494' }}>FAILS <b style={{ color: '#ff4d6d' }}>{w.failures}</b></span>
                    <span style={{ color: '#6b7494' }}>EFF <b style={{ color: w.efficiency > 80 ? '#22d97a' : '#ffb347' }}>{w.efficiency}%</b></span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-stack">
          <div className="panel">
            <div className="spread" style={{ marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 600, color: '#e8eaf6' }}>{wf.name}</div>
                <div style={{ fontSize: 11, color: '#9ba4c0', marginTop: 2 }}>{wf.description}</div>
              </div>
              <div className="row">
                <span className={'badge badge-' + STATUS_BADGE[wf.status]}>{wf.status}</span>
                <button className="btn-primary" onClick={() => pushToast({ title: 'Workflow running', message: `${wf.name} queued · ${wf.steps.length} steps · owner ${wf.owner}`, tone: 'info' })}>▶ Run workflow</button>
              </div>
            </div>
            <div className="grid4" style={{ marginBottom: 14 }}>
              <MetricTile label="PROGRESS" value={wf.progress + '%'} color="#00e5ff" />
              <MetricTile label="EFFICIENCY" value={wf.efficiency + '%'} color="#22d97a" />
              <MetricTile label="RUNS" value={wf.runs.toString()} color="#e8eaf6" />
              <MetricTile label="FAILURES" value={wf.failures.toString()} color={wf.failures > 0 ? '#ff4d6d' : '#e8eaf6'} />
            </div>
            <div className="canvas-wrap" style={{ height: 280 }}>
              <Canvas id="wf-canvas" height={280} draw={drawWF} />
            </div>
          </div>

          <div className="panel">
            <div className="section-label"><span className="ico">⌘</span> WORKFLOW DAG · {wf.steps.length} STEPS</div>
            <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
              {wf.steps.map((step, i) => (
                <div key={i} className="row" style={{ gap: 4 }}>
                  <span className={'badge badge-' + AGENTS[i % 4].color} style={{ fontSize: 10 }}>{step}</span>
                  {i < wf.steps.length - 1 && <span style={{ color: '#4a5170' }}>→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-stack">
          <div className="panel">
            <div className="section-label"><span className="ico">◴</span> EXECUTION HISTORY</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {EXECUTION_HISTORY.map((r, i) => (
                <div key={i} className="row" style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11.5 }}>
                  <span className={'dot ' + (r.ok ? 'dot-green' : 'dot-red')} />
                  <span style={{ color: '#e8eaf6', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>Run #{r.n}</span>
                  <span style={{ color: '#6b7494', fontSize: 10.5, flex: 1, marginLeft: 8 }}>{r.note ?? 'completed all steps'}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="section-label"><span className="ico">∿</span> METRICS</div>
            <div className="grid2">
              <div><div className="stat-label">MEDIAN LATENCY</div><div style={{ fontSize: 16, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>{wf.latency}</div></div>
              <div><div className="stat-label">FAILURE RATE</div><div style={{ fontSize: 16, fontWeight: 600, color: failureRate > 5 ? '#ff4d6d' : '#22d97a', fontFamily: 'Space Grotesk, sans-serif' }}>{failureRate}%</div></div>
              <div><div className="stat-label">AVG COST</div><div style={{ fontSize: 16, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>{wf.cost}</div></div>
              <div><div className="stat-label">STEPS</div><div style={{ fontSize: 16, fontWeight: 600, color: '#e8eaf6', fontFamily: 'Space Grotesk, sans-serif' }}>{wf.steps.length}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricTile({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="panel-sm">
      <div className="stat-label">{label}</div>
      <div className="stat-val" style={{ fontSize: 22, color }}>{value}</div>
    </div>
  )
}