// Observability Settings Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const SETTINGS_SECTIONS = [
  { id: 'general', title: 'General', icon: '⚙️' },
  { id: 'retention', title: 'Data Retention', icon: '🗄️' },
  { id: 'sampling', title: 'Sampling', icon: '📊' },
  { id: 'alerting', title: 'Alerting', icon: '🔔' },
  { id: 'integrations', title: 'Integrations', icon: '🔗' },
  { id: 'access', title: 'Access Control', icon: '🔐' },
]

export function ObservabilitySettings() {
  const [activeSection, setActiveSection] = useState('general')

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-6)' }}>
      {/* Sidebar Navigation */}
      <Card variant="outlined" style={{ width: 280, flexShrink: 0, height: 'fit-content' }}>
        <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border-primary)' }}>
          <h3 style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
            Settings
          </h3>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {SETTINGS_SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-3)',
                width: '100%',
                padding: 'var(--spacing-3) var(--spacing-4)',
                border: 'none',
                backgroundColor: activeSection === section.id ? 'var(--color-primary-glow)' : 'transparent',
                color: activeSection === section.id ? 'var(--color-primary-base)' : 'var(--color-text-secondary)',
                fontSize: 'var(--text-body-sm)',
                fontWeight: activeSection === section.id ? 600 : 500,
                textAlign: 'left',
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                margin: 'var(--spacing-1) var(--spacing-2)',
                transition: 'all var(--motion-duration-snap) var(--motion-easing-standard)',
              }}
            >
              <span style={{ fontSize: 'var(--text-body-lg)' }}>{section.icon}</span>
              <span>{section.title}</span>
            </button>
          ))}
        </nav>
      </Card>

      {/* Settings Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {activeSection === 'general' && (
          <Card variant="elevated" padding="lg">
            <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, marginBottom: 'var(--spacing-6)' }}>General Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)', color: 'var(--color-text-secondary)' }}>
                  Default Time Range
                </label>
                <Select
                  value="1h"
                  onChange={() => {}}
                  options={['5m', '15m', '1h', '6h', '24h', '7d'].map(t => ({ value: t, label: t }))}
                  style={{ maxWidth: 200 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)', color: 'var(--color-text-secondary)' }}>
                  Refresh Interval
                </label>
                <Select
                  value="30s"
                  onChange={() => {}}
                  options={['10s', '30s', '1m', '5m', '15m'].map(t => ({ value: t, label: t }))}
                  style={{ maxWidth: 200 }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Auto-refresh dashboards</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Show relative time</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', cursor: 'pointer' }}>
                  <input type="checkbox" />
                  <span>Enable debug mode</span>
                </label>
              </div>
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>
        )}

        {activeSection === 'retention' && (
          <Card variant="elevated" padding="lg">
            <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, marginBottom: 'var(--spacing-6)' }}>Data Retention Policies</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                    <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600 }}>Data Type</th>
                    <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600 }}>Hot Storage</th>
                    <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600 }}>Warm Storage</th>
                    <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600 }}>Cold Storage</th>
                    <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600 }}>Delete After</th>
                    <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'Metrics', hot: '2h', warm: '7d', cold: '90d', delete: '1y' },
                    { type: 'Logs', hot: '1h', warm: '3d', cold: '30d', delete: '90d' },
                    { type: 'Traces', hot: '30m', warm: '1d', cold: '7d', delete: '30d' },
                    { type: 'Events', hot: '1h', warm: '7d', cold: '90d', delete: '1y' },
                    { type: 'Profiles', hot: '15m', warm: '6h', cold: '3d', delete: '7d' },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                      <td style={{ padding: 'var(--spacing-3)', fontWeight: 500 }}>{row.type}</td>
                      <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                        <Input value={row.hot} size="sm" style={{ width: 80 }} />
                      </td>
                      <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                        <Input value={row.warm} size="sm" style={{ width: 80 }} />
                      </td>
                      <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                        <Input value={row.cold} size="sm" style={{ width: 80 }} />
                      </td>
                      <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                        <Input value={row.delete} size="sm" style={{ width: 80 }} />
                      </td>
                      <td style={{ padding: 'var(--spacing-3)', textAlign: 'center' }}>
                        <Button variant="ghost" size="sm">✏️ Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 'var(--spacing-6)' }}>
              <Button variant="primary">Save Retention Policies</Button>
            </div>
          </Card>
        )}

        {activeSection === 'sampling' && (
          <Card variant="elevated" padding="lg">
            <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, marginBottom: 'var(--spacing-6)' }}>Trace Sampling Configuration</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
              <Card variant="outlined" padding="md">
                <h4 style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Head-Based Sampling</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Default Sample Rate
                    </label>
                    <Input type="number" value="0.1" min="0" max="1" step="0.01" style={{ maxWidth: 120 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Error Sample Rate
                    </label>
                    <Input type="number" value="1.0" min="0" max="1" step="0.01" style={{ maxWidth: 120 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Slow Request Threshold
                    </label>
                    <Input type="number" value="500" min="0" step="10" style={{ maxWidth: 120 }} placeholder="ms" />
                  </div>
                </div>
              </Card>
              <Card variant="outlined" padding="md">
                <h4 style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Tail-Based Sampling</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Enabled
                    </label>
                    <Select value="true" onChange={() => {}} options={[{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }]} style={{ maxWidth: 120 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Policy
                    </label>
                    <Select value="latency" onChange={() => {}} options={[{ value: 'latency', label: 'Latency-based' }, { value: 'error', label: 'Error-based' }, { value: 'probabilistic', label: 'Probabilistic' }]} style={{ maxWidth: 200 }} />
                  </div>
                </div>
              </Card>
            </div>
            <Button variant="primary" style={{ marginTop: 'var(--spacing-4)' }}>Save Sampling Config</Button>
          </Card>
        )}

        {activeSection === 'alerting' && (
          <Card variant="elevated" padding="lg">
            <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, marginBottom: 'var(--spacing-6)' }}>Alerting Configuration</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
              <Card variant="outlined" padding="md">
                <h4 style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Notification Channels</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  {[
                    { name: 'Slack', status: 'connected', webhook: 'https://hooks.slack.com/...' },
                    { name: 'PagerDuty', status: 'connected', webhook: 'https://events.pagerduty.com/...' },
                    { name: 'Email', status: 'connected', webhook: 'smtp://alerts@hermes.ai' },
                    { name: 'Webhook', status: 'disconnected', webhook: 'Not configured' },
                  ].map((ch, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: ch.status === 'connected' ? 'var(--color-success-base)' : 'var(--color-text-quaternary)' }} />
                        <span style={{ fontWeight: 500 }}>{ch.name}</span>
                      </div>
                      <Badge variant={ch.status === 'connected' ? 'success' : 'default'} size="sm">{ch.status}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="secondary" size="sm" style={{ marginTop: 'var(--spacing-4)' }}>➕ Add Channel</Button>
              </Card>
              <Card variant="outlined" padding="md">
                <h4 style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Global Alert Settings</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Default Notification Delay
                    </label>
                    <Input type="number" value="5" min="0" step="1" style={{ maxWidth: 100 }} placeholder="minutes" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Auto-resolve Timeout
                    </label>
                    <Input type="number" value="15" min="1" step="1" style={{ maxWidth: 100 }} placeholder="minutes" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Grouping Interval
                    </label>
                    <Input type="number" value="5" min="1" step="1" style={{ maxWidth: 100 }} placeholder="minutes" />
                  </div>
                </div>
              </Card>
            </div>
            <Button variant="primary" style={{ marginTop: 'var(--spacing-4)' }}>Save Alerting Config</Button>
          </Card>
        )}

        {activeSection === 'integrations' && (
          <Card variant="elevated" padding="lg">
            <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, marginBottom: 'var(--spacing-6)' }}>External Integrations</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
              {[
                { name: 'Prometheus', status: 'connected', type: 'metrics', endpoint: 'https://prometheus.hermes.ai' },
                { name: 'Grafana', status: 'connected', type: 'visualization', endpoint: 'https://grafana.hermes.ai' },
                { name: 'Jaeger', status: 'connected', type: 'tracing', endpoint: 'https://jaeger.hermes.ai' },
                { name: 'Loki', status: 'connected', type: 'logs', endpoint: 'https://loki.hermes.ai' },
                { name: 'OpenTelemetry', status: 'connected', type: 'instrumentation', endpoint: 'otel://collector:4317' },
                { name: 'Datadog', status: 'disconnected', type: 'apm', endpoint: 'Not configured' },
              ].map((int, idx) => (
                <Card key={idx} variant="outlined" padding="md">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
                    <h4 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600 }}>{int.name}</h4>
                    <Badge variant={int.status === 'connected' ? 'success' : 'default'} size="sm" dot>{int.status}</Badge>
                  </div>
                  <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-3)' }}>
                    Type: {int.type} • {int.endpoint}
                  </div>
                  <Button variant={int.status === 'connected' ? 'ghost' : 'primary'} size="sm" style={{ width: '100%' }}>
                    {int.status === 'connected' ? '⚙️ Configure' : '🔗 Connect'}
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {activeSection === 'access' && (
          <Card variant="elevated" padding="lg">
            <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, marginBottom: 'var(--spacing-6)' }}>Access Control</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                    <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', fontWeight: 600 }}>Role</th>
                    <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600 }}>Metrics</th>
                    <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600 }}>Logs</th>
                    <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600 }}>Traces</th>
                    <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600 }}>Dashboards</th>
                    <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600 }}>Alerts</th>
                    <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', fontWeight: 600 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { role: 'Admin', metrics: true, logs: true, traces: true, dashboards: true, alerts: true },
                    { role: 'Operator', metrics: true, logs: true, traces: true, dashboards: true, alerts: true },
                    { role: 'Developer', metrics: true, logs: true, traces: true, dashboards: false, alerts: false },
                    { role: 'Viewer', metrics: true, logs: false, traces: false, dashboards: false, alerts: false },
                  ].map((r, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-primary)' }}>
                      <td style={{ padding: 'var(--spacing-3)', fontWeight: 500 }}>{r.role}</td>
                      <td style={{ textAlign: 'center' }}>{r.metrics ? '✅' : '❌'}</td>
                      <td style={{ textAlign: 'center' }}>{r.logs ? '✅' : '❌'}</td>
                      <td style={{ textAlign: 'center' }}>{r.traces ? '✅' : '❌'}</td>
                      <td style={{ textAlign: 'center' }}>{r.dashboards ? '✅' : '❌'}</td>
                      <td style={{ textAlign: 'center' }}>{r.alerts ? '✅' : '❌'}</td>
                      <td style={{ textAlign: 'center' }}><Button variant="ghost" size="sm">✏️</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button variant="primary" style={{ marginTop: 'var(--spacing-6)' }}>Save Access Rules</Button>
          </Card>
        )}
      </div>
    </div>
  )
}