// Security Settings Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'network', label: 'Network' },
  { id: 'encryption', label: 'Encryption' },
  { id: 'monitoring', label: 'Monitoring' },
  { id: 'advanced', label: 'Advanced' },
]

export function SecuritySettings() {
  const [activeTab, setActiveTab] = useState('general')
  
  // General settings
  const [orgName, setOrgName] = useState('Hermes AI')
  const [securityContact, setSecurityContact] = useState('security@hermes.ai')
  const [incidentResponseUrl, setIncidentResponseUrl] = useState('https://hermes.ai/incident-response')
  const [bugBountyUrl, setBugBountyUrl] = useState('https://hackerone.com/hermes-ai')
  
  // Authentication settings
  const [requireMfa, setRequireMfa] = useState(true)
  const [mfaMethods, setMfaMethods] = useState(['totp', 'webauthn', 'sms'])
  const [sessionTimeout, setSessionTimeout] = useState(8)
  const [maxConcurrentSessions, setMaxConcurrentSessions] = useState(5)
  const [passwordMinLength, setPasswordMinLength] = useState(12)
  const [passwordRequireSpecial, setPasswordRequireSpecial] = useState(true)
  const [passwordRotationDays, setPasswordRotationDays] = useState(90)
  const [lockoutThreshold, setLockoutThreshold] = useState(5)
  const [lockoutDuration, setLockoutDuration] = useState(30)
  
  // Network settings
  const [ipAllowlist] = useState(['192.168.1.0/24', '10.0.0.0/8'])
  const [blockTor, setBlockTor] = useState(true)
  const [blockVpn, setBlockVpn] = useState(false)
  const [geoBlocking, setGeoBlocking] = useState(['KP', 'IR', 'SY'])
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true)
  const [rateLimitRequests, setRateLimitRequests] = useState(1000)
  const [rateLimitWindow, setRateLimitWindow] = useState(60)
  
  // Encryption settings
  const [encryptionAtRest, setEncryptionAtRest] = useState(true)
  const [encryptionInTransit, setEncryptionInTransit] = useState(true)
  const [keyRotationDays, setKeyRotationDays] = useState(90)
  const [algorithm, setAlgorithm] = useState('AES-256-GCM')
  
  // Monitoring settings
  const [threatDetectionEnabled, setThreatDetectionEnabled] = useState(true)
  const [vulnScanningEnabled, setVulnScanningEnabled] = useState(true)
  const [vulnScanSchedule, setVulnScanSchedule] = useState('weekly')
  const [auditLogRetention, setAuditLogRetention] = useState(365)
  const [alertingEnabled, setAlertingEnabled] = useState(true)
  const [alertChannels, setAlertChannels] = useState(['email', 'slack', 'pagerduty'])

  const handleSave = (section: string) => {
    console.log(`Saving ${section} settings...`)
  }

  return (
    <div>
      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--spacing-2)',
          marginBottom: 'var(--spacing-6)',
          borderBottom: '1px solid var(--color-border-primary)',
          paddingBottom: 'var(--spacing-2)'
        }}
        role="tablist"
        aria-label="Security settings tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: 'var(--spacing-2) var(--spacing-4)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: activeTab === tab.id ? 'var(--color-primary-glow)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-primary-base)' : 'var(--color-text-tertiary)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--motion-duration-snap) var(--motion-easing-standard)',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                ORGANIZATION SECURITY PROFILE
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                <Input label="Organization Name" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Hermes AI" />
                <Input label="Security Contact Email" type="email" value={securityContact} onChange={(e) => setSecurityContact(e.target.value)} placeholder="security@hermes.ai" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                <Input label="Incident Response URL" value={incidentResponseUrl} onChange={(e) => setIncidentResponseUrl(e.target.value)} placeholder="https://hermes.ai/incident-response" />
                <Input label="Bug Bounty URL" value={bugBountyUrl} onChange={(e) => setBugBountyUrl(e.target.value)} placeholder="https://hackerone.com/hermes-ai" />
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                DEFAULT SECURITY POSTURE
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Security by Default</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>New workspaces inherit secure defaults</div>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Auto-Enable Threat Detection</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Enable threat detection for new deployments</div>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Require Approval for Policy Changes</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Require admin approval before enforcing new policies</div>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={() => handleSave('general')}>Cancel</Button>
              <Button variant="primary" onClick={() => handleSave('general')}>Save General Settings</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Authentication Tab */}
      {activeTab === 'authentication' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                MULTI-FACTOR AUTHENTICATION
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Require MFA for All Users</div>
                  <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Enforce multi-factor authentication organization-wide</div>
                </div>
                <input type="checkbox" defaultChecked={requireMfa} onChange={(e) => setRequireMfa(e.target.checked)} />
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                ALLOWED MFA METHODS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
                {['totp', 'webauthn', 'sms', 'email', 'push'].map(method => (
                  <label key={method} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', padding: 'var(--spacing-3) var(--spacing-4)', backgroundColor: mfaMethods.includes(method) ? 'var(--color-primary-base)/15' : 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: `1px solid ${mfaMethods.includes(method) ? 'var(--color-primary-base)' : 'var(--color-border-primary)'}`, cursor: 'pointer' }}>
                    <input type="checkbox" checked={mfaMethods.includes(method)} onChange={(e) => setMfaMethods(e.target.checked ? [...mfaMethods, method] : mfaMethods.filter(m => m !== method))} />
                    <span style={{ fontWeight: 500, color: 'var(--color-text-primary)', textTransform: 'uppercase' }}>{method.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                SESSION MANAGEMENT
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                    Session Timeout (hours)
                  </label>
                  <Select
                    value={String(sessionTimeout)}
                    onChangeRaw={(e) => setSessionTimeout(parseInt(e.target.value))}
                    options={[
                      { value: '1', label: '1 hour' },
                      { value: '4', label: '4 hours' },
                      { value: '8', label: '8 hours' },
                      { value: '12', label: '12 hours' },
                      { value: '24', label: '24 hours' },
                    ]}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                    Max Concurrent Sessions
                  </label>
                  <Select
                    value={String(maxConcurrentSessions)}
                    onChangeRaw={(e) => setMaxConcurrentSessions(parseInt(e.target.value))}
                    options={[
                      { value: '1', label: '1 session' },
                      { value: '3', label: '3 sessions' },
                      { value: '5', label: '5 sessions' },
                      { value: '10', label: '10 sessions' },
                      { value: 'unlimited', label: 'Unlimited' },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                PASSWORD POLICY
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                    Minimum Length
                  </label>
                  <Select
                    value={String(passwordMinLength)}
                    onChangeRaw={(e) => setPasswordMinLength(parseInt(e.target.value))}
                    options={[
                      { value: '8', label: '8 characters' },
                      { value: '10', label: '10 characters' },
                      { value: '12', label: '12 characters' },
                      { value: '14', label: '14 characters' },
                      { value: '16', label: '16 characters' },
                    ]}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                    Require Special Characters
                  </label>
                  <Select
                    value={String(passwordRequireSpecial)}
                    onChangeRaw={(e) => setPasswordRequireSpecial(e.target.value === 'true')}
                    options={[
                      { value: 'true', label: 'Yes' },
                      { value: 'false', label: 'No' },
                    ]}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                    Rotation Period (days)
                  </label>
                  <Select
                    value={String(passwordRotationDays)}
                    onChangeRaw={(e) => setPasswordRotationDays(parseInt(e.target.value))}
                    options={[
                      { value: '30', label: '30 days' },
                      { value: '60', label: '60 days' },
                      { value: '90', label: '90 days' },
                      { value: '180', label: '180 days' },
                      { value: '365', label: '365 days' },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                ACCOUNT LOCKOUT
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                    Failed Attempts Before Lockout
                  </label>
                  <Select
                    value={String(lockoutThreshold)}
                    onChangeRaw={(e) => setLockoutThreshold(parseInt(e.target.value))}
                    options={[
                      { value: '3', label: '3 attempts' },
                      { value: '5', label: '5 attempts' },
                      { value: '10', label: '10 attempts' },
                    ]}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                    Lockout Duration (minutes)
                  </label>
                  <Select
                    value={String(lockoutDuration)}
                    onChangeRaw={(e) => setLockoutDuration(parseInt(e.target.value))}
                    options={[
                      { value: '15', label: '15 minutes' },
                      { value: '30', label: '30 minutes' },
                      { value: '60', label: '1 hour' },
                      { value: '0', label: 'Until admin unlock' },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={() => handleSave('authentication')}>Cancel</Button>
              <Button variant="primary" onClick={() => handleSave('authentication')}>Save Authentication Settings</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Network Tab */}
      {activeTab === 'network' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                IP ALLOWLIST
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {ipAllowlist.map((ip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                    <Input placeholder="CIDR notation" defaultValue={ip} style={{ minWidth: 200 }} disabled />
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                ))}
                <Button variant="secondary" size="sm" style={{ alignSelf: 'flex-start' }}>
                  <span style={{ marginRight: 'var(--spacing-1)' }}>➕</span>
                  Add IP Range
                </Button>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                TRAFFIC FILTERING
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Block Tor Exit Nodes</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Block traffic from known Tor exit nodes</div>
                  </div>
                  <input type="checkbox" defaultChecked={blockTor} onChange={(e) => setBlockTor(e.target.checked)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Block Known VPN/Proxy</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Block traffic from commercial VPN/proxy services</div>
                  </div>
                  <input type="checkbox" defaultChecked={blockVpn} onChange={(e) => setBlockVpn(e.target.checked)} />
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                GEOGRAPHIC BLOCKING
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                  {['KP', 'IR', 'SY', 'CU', 'SD', 'BY', 'RU', 'CN'].map(country => (
                    <label key={country} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', padding: 'var(--spacing-2) var(--spacing-3)', backgroundColor: geoBlocking.includes(country) ? 'var(--color-error-base)/15' : 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: `1px solid ${geoBlocking.includes(country) ? 'var(--color-error-base)' : 'var(--color-border-primary)'}`, cursor: 'pointer' }}>
                      <input type="checkbox" checked={geoBlocking.includes(country)} onChange={(e) => setGeoBlocking(e.target.checked ? [...geoBlocking, country] : geoBlocking.filter(c => c !== country))} />
                      <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{country}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                RATE LIMITING
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Enable Rate Limiting</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Limit requests per IP per time window</div>
                  </div>
                  <input type="checkbox" defaultChecked={rateLimitEnabled} onChange={(e) => setRateLimitEnabled(e.target.checked)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                      Requests per Window
                    </label>
                    <Select
                      value={String(rateLimitRequests)}
                      onChangeRaw={(e) => setRateLimitRequests(parseInt(e.target.value))}
                      options={[
                        { value: '100', label: '100' },
                        { value: '500', label: '500' },
                        { value: '1000', label: '1,000' },
                        { value: '5000', label: '5,000' },
                        { value: '10000', label: '10,000' },
                      ]}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                      Time Window (seconds)
                    </label>
                    <Select
                      value={String(rateLimitWindow)}
                      onChangeRaw={(e) => setRateLimitWindow(parseInt(e.target.value))}
                      options={[
                        { value: '60', label: '60 seconds (1 min)' },
                        { value: '300', label: '300 seconds (5 min)' },
                        { value: '600', label: '600 seconds (10 min)' },
                        { value: '3600', label: '3,600 seconds (1 hour)' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={() => handleSave('network')}>Cancel</Button>
              <Button variant="primary" onClick={() => handleSave('network')}>Save Network Settings</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Encryption Tab */}
      {activeTab === 'encryption' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                ENCRYPTION SETTINGS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Encryption at Rest</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Encrypt all stored data using AES-256</div>
                  </div>
                  <input type="checkbox" defaultChecked={encryptionAtRest} onChange={(e) => setEncryptionAtRest(e.target.checked)} disabled />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Encryption in Transit</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Force TLS 1.3 for all connections</div>
                  </div>
                  <input type="checkbox" defaultChecked={encryptionInTransit} onChange={(e) => setEncryptionInTransit(e.target.checked)} disabled />
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                KEY MANAGEMENT
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                    Key Rotation Period (days)
                  </label>
                  <Select
                    value={String(keyRotationDays)}
                    onChangeRaw={(e) => setKeyRotationDays(parseInt(e.target.value))}
                    options={[
                      { value: '30', label: '30 days' },
                      { value: '60', label: '60 days' },
                      { value: '90', label: '90 days' },
                      { value: '180', label: '180 days' },
                      { value: '365', label: '365 days' },
                    ]}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                    Encryption Algorithm
                  </label>
                  <Select
                    value={algorithm}
                    onChangeRaw={(e) => setAlgorithm(e.target.value)}
                    options={[
                      { value: 'AES-256-GCM', label: 'AES-256-GCM (Recommended)' },
                      { value: 'AES-256-CBC', label: 'AES-256-CBC' },
                      { value: 'ChaCha20-Poly1305', label: 'ChaCha20-Poly1305' },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                HSM / KMS INTEGRATION
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>AWS KMS</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Connected • us-east-1 • key-xyz789</div>
                  </div>
                  <Badge variant="success" size="sm" dot>Active</Badge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>HashiCorp Vault</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Connected • vault.hermes.ai • transit engine</div>
                  </div>
                  <Badge variant="success" size="sm" dot>Active</Badge>
                </div>
                <Button variant="secondary" size="sm" style={{ alignSelf: 'flex-start' }}>
                  <span style={{ marginRight: 'var(--spacing-1)' }}>➕</span>
                  Add HSM/KMS
                </Button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={() => handleSave('encryption')}>Cancel</Button>
              <Button variant="primary" onClick={() => handleSave('encryption')}>Save Encryption Settings</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                THREAT DETECTION
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Real-time Threat Detection</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Continuous monitoring for suspicious activity</div>
                  </div>
                  <input type="checkbox" defaultChecked={threatDetectionEnabled} onChange={(e) => setThreatDetectionEnabled(e.target.checked)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Automated Vulnerability Scanning</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Scheduled scans for infrastructure and applications</div>
                  </div>
                  <input type="checkbox" defaultChecked={vulnScanningEnabled} onChange={(e) => setVulnScanningEnabled(e.target.checked)} />
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                VULNERABILITY SCANNING SCHEDULE
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                    Scan Frequency
                  </label>
                  <Select
                    value={vulnScanSchedule}
                    onChangeRaw={(e) => setVulnScanSchedule(e.target.value)}
                    options={[
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' },
                      { value: 'monthly', label: 'Monthly' },
                    ]}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                    Scan Depth
                  </label>
                  <Select
                    value="standard"
                    onChangeRaw={() => {}}
                    options={[
                      { value: 'quick', label: 'Quick (surface only)' },
                      { value: 'standard', label: 'Standard (recommended)' },
                      { value: 'deep', label: 'Deep (comprehensive)' },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                AUDIT LOGGING
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                    Retention Period (days)
                  </label>
                  <Select
                    value={String(auditLogRetention)}
                    onChangeRaw={(e) => setAuditLogRetention(parseInt(e.target.value))}
                    options={[
                      { value: '90', label: '90 days' },
                      { value: '180', label: '180 days' },
                      { value: '365', label: '365 days (1 year)' },
                      { value: '730', label: '730 days (2 years)' },
                      { value: '1095', label: '1095 days (3 years)' },
                    ]}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                    Log Level
                  </label>
                  <Select
                    value="standard"
                    onChangeRaw={() => {}}
                    options={[
                      { value: 'minimal', label: 'Minimal (security events only)' },
                      { value: 'standard', label: 'Standard (recommended)' },
                      { value: 'verbose', label: 'Verbose (all events)' },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                ALERTING
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Enable Security Alerts</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Send notifications for security events</div>
                  </div>
                  <input type="checkbox" defaultChecked={alertingEnabled} onChange={(e) => setAlertingEnabled(e.target.checked)} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
                  {['email', 'slack', 'pagerduty', 'webhook', 'teams', 'sms'].map(channel => (
                    <label key={channel} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', padding: 'var(--spacing-2) var(--spacing-3)', backgroundColor: alertChannels.includes(channel) ? 'var(--color-primary-base)/15' : 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: `1px solid ${alertChannels.includes(channel) ? 'var(--color-primary-base)' : 'var(--color-border-primary)'}`, cursor: 'pointer' }}>
                      <input type="checkbox" checked={alertChannels.includes(channel)} onChange={(e) => setAlertChannels(e.target.checked ? [...alertChannels, channel] : alertChannels.filter(c => c !== channel))} />
                      <span style={{ fontWeight: 500, color: 'var(--color-text-primary)', textTransform: 'capitalize' }}>{channel}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={() => handleSave('monitoring')}>Cancel</Button>
              <Button variant="primary" onClick={() => handleSave('monitoring')}>Save Monitoring Settings</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                SECURITY FEATURE FLAGS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {[
                  { name: 'Zero Trust Network Access', enabled: true, desc: 'Enforce zero trust for all network connections' },
                  { name: 'Runtime Application Self-Protection (RASP)', enabled: false, desc: 'Monitor and protect applications at runtime' },
                  { name: 'Software Bill of Materials (SBOM)', enabled: true, desc: 'Generate SBOM for all deployments' },
                  { name: 'Container Image Signing', enabled: true, desc: 'Require signed container images' },
                  { name: 'Egress Traffic Control', enabled: true, desc: 'Control and monitor outbound traffic' },
                  { name: 'File Integrity Monitoring (FIM)', enabled: false, desc: 'Monitor critical file changes' },
                ].map((flag, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>{flag.name}</div>
                      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>{flag.desc}</div>
                    </div>
                    <input type="checkbox" defaultChecked={flag.enabled} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                INTEGRATIONS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {[
                  { name: 'SIEM (Splunk)', status: 'connected', detail: 'Forwarding security events', color: '#000000' },
                  { name: 'SOAR (Cortex XSOAR)', status: 'disconnected', detail: 'Not configured', color: '#d62828' },
                  { name: 'Vuln Scanner (Qualys)', status: 'connected', detail: 'Weekly scans scheduled', color: '#0071c5' },
                  { name: 'Threat Intel (AlienVault OTX)', status: 'connected', detail: 'Feeds updated hourly', color: '#e84d1a' },
                  { name: 'CSPM (Wiz)', status: 'disconnected', detail: 'Not configured', color: '#00c896' },
                ].map((integration, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: integration.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: integration.color, fontWeight: 700 }}>
                        {integration.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{integration.name}</div>
                        <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>{integration.detail}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                      <Badge variant={integration.status === 'connected' ? 'success' : 'default'} size="sm" dot>
                        {integration.status === 'connected' ? 'Connected' : 'Disconnected'}
                      </Badge>
                      <Button variant="ghost" size="sm">{integration.status === 'connected' ? 'Manage' : 'Configure'}</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                DANGER ZONE
              </div>
              <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-error-base)/10', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-error-base)/30' }}>
                <div style={{ fontWeight: 600, color: 'var(--color-error-base)', marginBottom: 'var(--spacing-2)' }}>⚠️ Irreversible Security Actions</div>
                <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-4)' }}>
                  These actions cannot be undone. Use with extreme caution.
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                  <Button variant="danger" size="sm">Reset All Security Policies</Button>
                  <Button variant="ghost" size="sm">Revoke All Sessions</Button>
                  <Button variant="ghost" size="sm">Disable All MFA</Button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={() => handleSave('advanced')}>Cancel</Button>
              <Button variant="primary" onClick={() => handleSave('advanced')}>Save Advanced Settings</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}