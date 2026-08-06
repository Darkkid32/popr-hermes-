// Organization Settings Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'
import { Avatar } from '../design-system/components/data-display/Avatar'
import { Textarea } from '../design-system/components/forms/Input'

const workspaceOptions = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'development', label: 'Development' },
  { value: 'research', label: 'Research' },
  { value: 'sandbox', label: 'Sandbox' },
]

const roleOptions = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'member', label: 'Member' },
  { value: 'admin', label: 'Admin' },
]

const dataResidencyOptions = [
  { value: 'us', label: 'United States' },
  { value: 'eu', label: 'European Union' },
  { value: 'apac', label: 'Asia Pacific' },
  { value: 'global', label: 'Global (Multi-region)' },
]

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'members', label: 'Member Policies' },
  { id: 'security', label: 'Security' },
  { id: 'billing', label: 'Billing' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'advanced', label: 'Advanced' },
]

function TabButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      style={{
        padding: 'var(--spacing-2) var(--spacing-4)',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        backgroundColor: isActive ? 'var(--color-primary-glow)' : 'transparent',
        color: isActive ? 'var(--color-primary-base)' : 'var(--color-text-tertiary)',
        fontSize: 'var(--text-body-sm)',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all var(--motion-duration-snap) var(--motion-easing-standard)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '9999px',
        border: 'none',
        backgroundColor: checked ? 'var(--color-primary-base)' : 'var(--color-border-primary)',
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color var(--motion-duration-snap) var(--motion-easing-standard)',
      }}
    >
      <span
        style={{
          display: 'block',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          transition: 'left var(--motion-duration-snap) var(--motion-easing-standard)',
        }}
      />
    </button>
  )
}

export function OrganizationSettings() {
  const [activeTab, setActiveTab] = useState('general')
  const [orgName, setOrgName] = useState('Hermes AI')
  const [orgSlug, setOrgSlug] = useState('hermes-ai')
  const [orgDescription, setOrgDescription] = useState('Building the future of AI infrastructure')
  const [orgWebsite, setOrgWebsite] = useState('https://hermes.ai')
  const [orgLocation, setOrgLocation] = useState('San Francisco, CA')
  const [defaultWorkspace, setDefaultWorkspace] = useState('development')
  const [defaultRole, setDefaultRole] = useState('member')
  const [requireEmailVerification, setRequireEmailVerification] = useState(true)
  const [allowPublicSignup, setAllowPublicSignup] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(8)
  const [passwordMinLength, setPasswordMinLength] = useState(12)
  const [requireMfa, setRequireMfa] = useState(true)
  const [allowApiKeys, setAllowApiKeys] = useState(true)
  const [auditLogRetention, setAuditLogRetention] = useState(365)
  const [dataResidency, setDataResidency] = useState('us')
  const [complianceMode, setComplianceMode] = useState(false)
  const [billingEmail, setBillingEmail] = useState('billing@hermes.ai')
  const [taxId, setTaxId] = useState('US-123456789')
  const [poNumber, setPoNumber] = useState('')

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
        aria-label="Organization settings tabs"
      >
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            {/* Organization Profile */}
            <div>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                ORGANIZATION PROFILE
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--spacing-6)', alignItems: 'start' }}>
                <div style={{ position: 'relative' }}>
                  <Avatar size="xl" name={orgName} src="" style={{ backgroundColor: 'var(--color-primary-base)/15', color: 'var(--color-primary-base)', borderColor: 'var(--color-primary-base)/30' }}>
                    {orgName.split(' ').map(w => w[0]).join('')}
                  </Avatar>
                  <Button variant="secondary" size="sm" style={{ position: 'absolute', bottom: 0, right: 0, transform: 'translate(50%, 50%)' }}>
                    Change Logo
                  </Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                    <Input label="Organization Name" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Hermes AI" />
                    <Input label="Slug" value={orgSlug} onChange={(e) => setOrgSlug(e.target.value)} placeholder="hermes-ai" disabled />
                  </div>
                  <Textarea
                    label="Description"
                    value={orgDescription}
                    onChange={(e) => setOrgDescription(e.target.value)}
                    placeholder="Building the future of AI infrastructure"
                    rows={3}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                    <Input label="Website" value={orgWebsite} onChange={(e) => setOrgWebsite(e.target.value)} placeholder="https://hermes.ai" />
                    <Input label="Location" value={orgLocation} onChange={(e) => setOrgLocation(e.target.value)} placeholder="San Francisco, CA" />
                  </div>
                </div>
              </div>
            </div>

            {/* Defaults */}
            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                DEFAULT SETTINGS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                <Select
                  label="Default Workspace"
                  value={defaultWorkspace}
                  onChangeRaw={(e) => setDefaultWorkspace(e.target.value)}
                  options={workspaceOptions}
                />
                <Select
                  label="Default Member Role"
                  value={defaultRole}
                  onChangeRaw={(e) => setDefaultRole(e.target.value)}
                  options={roleOptions}
                />
              </div>
            </div>

            {/* Member Policies */}
            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                MEMBER POLICIES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Require Email Verification</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>New members must verify email before accessing</div>
                  </div>
                  <Toggle checked={requireEmailVerification} onChange={(checked) => setRequireEmailVerification(checked)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Allow Public Signup</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Anyone with an @hermes.ai email can join</div>
                  </div>
                  <Toggle checked={allowPublicSignup} onChange={(checked) => setAllowPublicSignup(checked)} />
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

      {/* Member Policies Tab */}
      {activeTab === 'members' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                ACCESS CONTROL
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Require MFA for All Members</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Enforce multi-factor authentication</div>
                  </div>
                  <Toggle checked={requireMfa} onChange={(checked) => setRequireMfa(checked)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Allow API Keys</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Members can create personal API keys</div>
                  </div>
                  <Toggle checked={allowApiKeys} onChange={(checked) => setAllowApiKeys(checked)} />
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                SESSION MANAGEMENT
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Session Timeout</span>
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
                      style={{ minWidth: 140 }}
                    />
                  </label>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Password Min Length</span>
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
                      style={{ minWidth: 140 }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={() => handleSave('members')}>Cancel</Button>
              <Button variant="primary" onClick={() => handleSave('members')}>Save Member Policies</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                AUTHENTICATION PROVIDERS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>SSO / SAML</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Configure in SSO Config tab</div>
                  </div>
                  <Badge variant="success" size="sm" dot>Configured</Badge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>OIDC / OpenID Connect</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Configure in SSO Config tab</div>
                  </div>
                  <Badge variant="info" size="sm" dot>Configured</Badge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>LDAP / Active Directory</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Not configured</div>
                  </div>
                  <Badge variant="default" size="sm" dot>Not Configured</Badge>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                IP ALLOWLIST
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <Input placeholder="192.168.1.0/24" style={{ minWidth: 200 }} />
                    <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Office network</span>
                  </div>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <Input placeholder="10.0.0.0/8" style={{ minWidth: 200 }} />
                    <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>VPN range</span>
                  </div>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
                <Button variant="secondary" size="sm" style={{ alignSelf: 'flex-start' }}>
                  <span style={{ marginRight: 'var(--spacing-1)' }}>➕</span>
                  Add IP Range
                </Button>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                AUDIT LOG RETENTION
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Retention Period</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Days to retain audit logs</div>
                  </div>
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
                    style={{ minWidth: 180 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={() => handleSave('security')}>Cancel</Button>
              <Button variant="primary" onClick={() => handleSave('security')}>Save Security Settings</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                BILLING CONTACT
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                <Input label="Billing Email" value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} type="email" placeholder="billing@hermes.ai" />
                <Input label="Tax ID / VAT Number" value={taxId} onChange={(e) => setTaxId(e.target.value)} placeholder="US-123456789" />
              </div>
              <Input label="Purchase Order Number" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} placeholder="Optional PO number" />
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                PAYMENT METHOD
              </div>
              <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Visa ending in 4242</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Expires 12/2027</div>
                  </div>
                  <Badge variant="success" size="sm" dot>Default</Badge>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                  <Button variant="secondary" size="sm">Update Card</Button>
                  <Button variant="ghost" size="sm">Add New Method</Button>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                INVOICE SETTINGS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Email Invoices</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Send invoice copies to billing email</div>
                  </div>
                  <Toggle checked={true} onChange={() => {}} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Auto-pay Enabled</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Automatically pay invoices on due date</div>
                  </div>
                  <Toggle checked={true} onChange={() => {}} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={() => handleSave('billing')}>Cancel</Button>
              <Button variant="primary" onClick={() => handleSave('billing')}>Save Billing Settings</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                DATA RESIDENCY
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Primary Region</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Where organization data is stored</div>
                  </div>
                  <Select
                    value={dataResidency}
                    onChangeRaw={(e) => setDataResidency(e.target.value)}
                    options={dataResidencyOptions}
                    style={{ minWidth: 220 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                COMPLIANCE MODE
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Strict Compliance Mode</div>
                  <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Enforce additional controls for regulated environments</div>
                </div>
                <Toggle checked={complianceMode} onChange={(checked) => setComplianceMode(checked)} />
              </div>
              {complianceMode && (
                <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-info-base)/10', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-info-base)/30' }}>
                  <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-info-base)', marginBottom: 'var(--spacing-3)' }}>
                    <strong>Compliance Mode Enabled:</strong> Additional controls active including enhanced audit logging, data encryption at rest, and restricted data export.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    <Badge variant="info" size="sm" dot>SOC 2 Type II Controls Enforced</Badge>
                    <Badge variant="info" size="sm" dot>ISO 27001 Controls Enforced</Badge>
                    <Badge variant="info" size="sm" dot>GDPR Data Processing Addendum Active</Badge>
                    <Badge variant="info" size="sm" dot>HIPAA BAA Available</Badge>
                  </div>
                </div>
              )}
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                CERTIFICATIONS & ATTESTATIONS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
                <Card variant="outlined" padding="md">
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>SOC 2 Type II</div>
                  <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>Last audit: January 2026</div>
                  <Badge variant="success" size="sm" dot>Compliant</Badge>
                </Card>
                <Card variant="outlined" padding="md">
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>ISO 27001</div>
                  <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>Last audit: November 2025</div>
                  <Badge variant="success" size="sm" dot>Compliant</Badge>
                </Card>
                <Card variant="outlined" padding="md">
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>GDPR</div>
                  <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>Last review: October 2025</div>
                  <Badge variant="success" size="sm" dot>Compliant</Badge>
                </Card>
                <Card variant="outlined" padding="md">
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-2)' }}>HIPAA</div>
                  <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>In progress - Q3 2026 target</div>
                  <Badge variant="warning" size="sm" dot>In Progress</Badge>
                </Card>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={() => handleSave('compliance')}>Cancel</Button>
              <Button variant="primary" onClick={() => handleSave('compliance')}>Save Compliance Settings</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                CONFIGURED INTEGRATIONS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {[
                  { name: 'GitHub', status: 'connected', detail: '3 organizations connected', color: '#24292e' },
                  { name: 'GitLab', status: 'disconnected', detail: 'Not configured', color: '#fc6d26' },
                  { name: 'Slack', status: 'connected', detail: 'Workspace: hermes-ai', color: '#4a154b' },
                  { name: 'Jira', status: 'connected', detail: 'Cloud instance connected', color: '#0052cc' },
                  { name: 'PagerDuty', status: 'disconnected', detail: 'Not configured', color: '#06c' },
                  { name: 'Datadog', status: 'connected', detail: 'API key configured', color: '#632ca6' },
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
                WEBHOOKS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Deployment Events</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>https://api.hermes.ai/webhooks/deploy</div>
                  </div>
                  <Badge variant="success" size="sm" dot>Active</Badge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Security Alerts</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>https://api.hermes.ai/webhooks/security</div>
                  </div>
                  <Badge variant="success" size="sm" dot>Active</Badge>
                </div>
                <Button variant="secondary" size="sm" style={{ alignSelf: 'flex-start' }}>
                  <span style={{ marginRight: 'var(--spacing-1)' }}>➕</span>
                  Add Webhook
                </Button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
              <Button variant="ghost" onClick={() => handleSave('integrations')}>Cancel</Button>
              <Button variant="primary" onClick={() => handleSave('integrations')}>Save Integration Settings</Button>
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
                FEATURE FLAGS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {[
                  { name: 'Beta Features', enabled: true, desc: 'Enable access to beta features for all members' },
                  { name: 'Experimental Models', enabled: false, desc: 'Allow deployment of experimental model versions' },
                  { name: 'Advanced Analytics', enabled: true, desc: 'Enable detailed usage analytics and reporting' },
                  { name: 'Custom Domains', enabled: true, desc: 'Allow workspaces to use custom domains' },
                  { name: 'Private Model Registry', enabled: true, desc: 'Enable private model registry for organization' },
                  { name: 'AI Code Generation', enabled: false, desc: 'Enable AI-powered code generation features' },
                ].map((flag, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>{flag.name}</div>
                      <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>{flag.desc}</div>
                    </div>
                    <Toggle checked={flag.enabled} onChange={() => {}} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                API SETTINGS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                      Rate Limit (requests/minute)
                    </label>
                    <Input type="number" placeholder="1000" defaultValue="1000" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                      Burst Limit
                    </label>
                    <Input type="number" placeholder="2000" defaultValue="2000" />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Enable API Versioning</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Support multiple API versions simultaneously</div>
                  </div>
                  <Toggle checked={true} onChange={() => {}} />
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                DANGER ZONE
              </div>
              <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-error-base)/10', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-error-base)/30' }}>
                <div style={{ fontWeight: 600, color: 'var(--color-error-base)', marginBottom: 'var(--spacing-2)' }}>⚠️ Irreversible Actions</div>
                <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-4)' }}>
                  These actions cannot be undone. Please ensure you have proper backups before proceeding.
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                  <Button variant="danger" size="sm">Delete Organization</Button>
                  <Button variant="ghost" size="sm">Export All Data</Button>
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