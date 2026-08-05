// Automation Settings Tab
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
  { id: 'execution', title: 'Execution', icon: '▶️' },
  { id: 'queue', title: 'Queue', icon: '⏳' },
  { id: 'notifications', title: 'Notifications', icon: '🔔' },
  { id: 'security', title: 'Security', icon: '🔐' },
  { id: 'integrations', title: 'Integrations', icon: '🔗' },
]

export function AutomationSettings() {
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
                  Default Timezone
                </label>
                <Select
                  value="UTC"
                  onChange={() => {}}
                  options={['UTC', 'PST', 'EST', 'CET', 'JST'].map(t => ({ value: t, label: t }))}
                  style={{ maxWidth: 200 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)', color: 'var(--color-text-secondary)' }}>
                  Default Timeout
                </label>
                <Select
                  value="30m"
                  onChange={() => {}}
                  options={['5m', '15m', '30m', '1h', '2h'].map(t => ({ value: t, label: t }))}
                  style={{ maxWidth: 200 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)', color: 'var(--color-text-secondary)' }}>
                  Max Concurrent Executions
                </label>
                <Input type="number" value="50" min="1" max="1000" step="1" style={{ maxWidth: 200 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Enable workflow versioning</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Auto-cleanup completed executions</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', cursor: 'pointer' }}>
                  <input type="checkbox" />
                  <span>Enable debug logging by default</span>
                </label>
              </div>
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>
        )}

        {activeSection === 'execution' && (
          <Card variant="elevated" padding="lg">
            <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, marginBottom: 'var(--spacing-6)' }}>Execution Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
              <Card variant="outlined" padding="md">
                <h4 style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Default Retry Policy</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Max Retries
                    </label>
                    <Input type="number" value="3" min="0" max="10" step="1" style={{ maxWidth: 120 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Retry Backoff (ms)
                    </label>
                    <Input type="number" value="1000" min="100" max="60000" step="100" style={{ maxWidth: 120 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Backoff Multiplier
                    </label>
                    <Input type="number" value="2" min="1" max="5" step="0.1" style={{ maxWidth: 120 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Max Backoff (ms)
                    </label>
                    <Input type="number" value="30000" min="1000" max="300000" step="1000" style={{ maxWidth: 120 }} />
                  </div>
                </div>
              </Card>
              <Card variant="outlined" padding="md">
                <h4 style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Execution Limits</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Default Step Timeout
                    </label>
                    <Input type="number" value="5m" style={{ maxWidth: 120 }} placeholder="5m" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Max Workflow Duration
                    </label>
                    <Input type="number" value="1h" style={{ maxWidth: 120 }} placeholder="1h" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Max Steps per Workflow
                    </label>
                    <Input type="number" value="100" min="1" max="1000" step="1" style={{ maxWidth: 120 }} />
                  </div>
                </div>
              </Card>
            </div>
            <Button variant="primary" style={{ marginTop: 'var(--spacing-4)' }}>Save Execution Settings</Button>
          </Card>
        )}

        {activeSection === 'queue' && (
          <Card variant="elevated" padding="lg">
            <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, marginBottom: 'var(--spacing-6)' }}>Queue Configuration</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
              <Card variant="outlined" padding="md">
                <h4 style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Queue Definitions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  {[
                    { name: 'high-priority', workers: 10, priority: 'high', retry: '3' },
                    { name: 'default', workers: 50, priority: 'normal', retry: '3' },
                    { name: 'batch', workers: 5, priority: 'low', retry: '5' },
                    { name: 'scheduled', workers: 20, priority: 'normal', retry: '2' },
                  ].map((q, idx) => (
                    <Card key={idx} variant="outlined" padding="sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                        <span style={{ fontWeight: 500, fontFamily: 'var(--font-mono)' }}>{q.name}</span>
                        <Badge variant={q.priority === 'high' ? 'error' : q.priority === 'low' ? 'info' : 'default'} size="sm">{q.priority}</Badge>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)' }}>
                        <span>👥 <span style={{ fontFamily: 'var(--font-mono)' }}>{q.workers}</span> workers</span>
                        <span>🔄 <span style={{ fontFamily: 'var(--font-mono)' }}>{q.retry}</span> retries</span>
                      </div>
                    </Card>
                  ))}
                </div>
                <Button variant="secondary" size="sm" style={{ marginTop: 'var(--spacing-4)' }}>➕ Add Queue</Button>
              </Card>
              <Card variant="outlined" padding="md">
                <h4 style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Global Queue Settings</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Default Queue
                    </label>
                    <Select value="default" onChange={() => {}} options={[{ value: 'default', label: 'default' }, { value: 'high-priority', label: 'high-priority' }, { value: 'batch', label: 'batch' }, { value: 'scheduled', label: 'scheduled' }]} style={{ maxWidth: 200 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Job TTL
                    </label>
                    <Input type="number" value="86400" min="60" step="60" style={{ maxWidth: 120 }} placeholder="seconds" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Max Queue Size
                    </label>
                    <Input type="number" value="100000" min="1000" step="1000" style={{ maxWidth: 120 }} />
                  </div>
                </div>
              </Card>
            </div>
            <Button variant="primary" style={{ marginTop: 'var(--spacing-4)' }}>Save Queue Settings</Button>
          </Card>
        )}

        {activeSection === 'notifications' && (
          <Card variant="elevated" padding="lg">
            <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, marginBottom: 'var(--spacing-6)' }}>Notification Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
              <Card variant="outlined" padding="md">
                <h4 style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Event Notifications</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  {[
                    { event: 'Workflow Started', channels: ['slack', 'email'], enabled: true },
                    { event: 'Workflow Completed', channels: ['slack'], enabled: true },
                    { event: 'Workflow Failed', channels: ['slack', 'pagerduty', 'email'], enabled: true },
                    { event: 'Workflow Retrying', channels: ['slack'], enabled: false },
                    { event: 'Queue Backlog', channels: ['slack', 'pagerduty'], enabled: true },
                    { event: 'Execution Timeout', channels: ['slack', 'pagerduty', 'email'], enabled: true },
                  ].map((e, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                        <span style={{ fontWeight: 500 }}>{e.event}</span>
                        <Badge variant="default" size="sm">{e.channels.join(', ')}</Badge>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        <input type="checkbox" defaultChecked={e.enabled} />
                        <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Enabled</span>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>
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
            </div>
            <Button variant="primary" style={{ marginTop: 'var(--spacing-4)' }}>Save Notification Settings</Button>
          </Card>
        )}

        {activeSection === 'security' && (
          <Card variant="elevated" padding="lg">
            <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, marginBottom: 'var(--spacing-6)' }}>Security Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
              <Card variant="outlined" padding="md">
                <h4 style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Authentication</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Require MFA for workflow execution
                    </label>
                    <Select value="required" onChange={() => {}} options={[{ value: 'required', label: 'Required' }, { value: 'optional', label: 'Optional' }, { value: 'disabled', label: 'Disabled' }]} style={{ maxWidth: 200 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Session Timeout
                    </label>
                    <Input type="number" value="30" min="5" max="480" step="5" style={{ maxWidth: 120 }} placeholder="minutes" />
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked />
                      <span>Enforce RBAC on all workflows</span>
                    </label>
                  </div>
                </div>
              </Card>
              <Card variant="outlined" padding="md">
                <h4 style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, marginBottom: 'var(--spacing-4)' }}>Secrets Management</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked />
                      <span>Require secret rotation every 90 days</span>
                    </label>
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked />
                      <span>Audit all secret access</span>
                    </label>
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', cursor: 'pointer' }}>
                      <input type="checkbox" />
                      <span>Encrypt secrets at rest (AES-256)</span>
                    </label>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, marginBottom: 'var(--spacing-2)' }}>
                      Default secret TTL
                    </label>
                    <Input type="number" value="90" min="1" max="365" step="1" style={{ maxWidth: 120 }} placeholder="days" />
                  </div>
                </div>
              </Card>
            </div>
            <Button variant="primary" style={{ marginTop: 'var(--spacing-4)' }}>Save Security Settings</Button>
          </Card>
        )}

        {activeSection === 'integrations' && (
          <Card variant="elevated" padding="lg">
            <h3 style={{ fontSize: 'var(--text-body-lg)', fontWeight: 600, marginBottom: 'var(--spacing-6)' }}>External Integrations</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
              {[
                { name: 'Kubernetes', status: 'connected', type: 'orchestration', endpoint: 'https://k8s.hermes.ai' },
                { name: 'GitHub', status: 'connected', type: 'source_control', endpoint: 'https://github.com/hermes' },
                { name: 'Slack', status: 'connected', type: 'messaging', endpoint: 'https://slack.com/team/hermes' },
                { name: 'PagerDuty', status: 'connected', type: 'alerting', endpoint: 'https://pagerduty.com/hermes' },
                { name: 'Prometheus', status: 'connected', type: 'monitoring', endpoint: 'https://prometheus.hermes.ai' },
                { name: 'Grafana', status: 'connected', type: 'visualization', endpoint: 'https://grafana.hermes.ai' },
                { name: 'Datadog', status: 'disconnected', type: 'apm', endpoint: 'Not configured' },
                { name: 'Jira', status: 'disconnected', type: 'ticketing', endpoint: 'Not configured' },
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
            <Button variant="primary" style={{ marginTop: 'var(--spacing-4)' }}>Save Integrations</Button>
          </Card>
        )}
      </div>
    </div>
  )
}