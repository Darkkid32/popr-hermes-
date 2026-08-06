// Organization SSO Configuration Tab
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState, useMemo, type ChangeEvent } from 'react'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { Select } from '../design-system/components/forms/Select'
import { Table } from '../design-system/components/data-display/Table'
import { Modal } from '../design-system/components/overlay/Modal'
import { Textarea } from '../design-system/components/forms/Input'

const SSO_PROVIDERS_DATA = [
  { id: '1', name: 'Okta', type: 'oidc', displayName: 'Okta', status: 'active', domains: ['hermes.ai', 'company.com'], users: 187, lastSync: '2026-07-15 14:30', autoProvision: true, jitProvision: true, color: '#007dc3' },
  { id: '2', name: 'Azure AD', type: 'saml', displayName: 'Microsoft Azure AD', status: 'active', domains: ['corp.company.com'], users: 42, lastSync: '2026-07-15 12:15', autoProvision: true, jitProvision: false, color: '#0078d4' },
  { id: '3', name: 'Google Workspace', type: 'oidc', displayName: 'Google Workspace', status: 'configured', domains: ['company.com'], users: 18, lastSync: '2026-07-14 16:45', autoProvision: false, jitProvision: true, color: '#4285f4' },
  { id: '4', name: 'Auth0', type: 'oidc', displayName: 'Auth0', status: 'inactive', domains: ['auth.company.com'], users: 0, lastSync: '—', autoProvision: false, jitProvision: false, color: '#eb5424' },
]

const TYPE_OPTIONS = [
  { value: 'oidc', label: 'OpenID Connect (OIDC)' },
  { value: 'saml', label: 'SAML 2.0' },
  { value: 'ldap', label: 'LDAP / Active Directory' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'configured', label: 'Configured' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'error', label: 'Error' },
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

export function OrganizationSSO() {
  const [activeTab, setActiveTab] = useState('providers')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedProviders, setSelectedProviders] = useState<Set<string>>(new Set())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProvider, setEditingProvider] = useState<typeof SSO_PROVIDERS_DATA[0] | null>(null)

  // SAML settings
  const [samlEntityId, setSamlEntityId] = useState('https://hermes.ai/saml/metadata')
  const [samlAcsUrl, setSamlAcsUrl] = useState('https://hermes.ai/saml/acs')
  const [samlSloUrl, setSamlSloUrl] = useState('https://hermes.ai/saml/slo')
  const [samlCertificate, setSamlCertificate] = useState('')

  // OIDC settings
  const [oidcIssuer, setOidcIssuer] = useState('https://company.okta.com')
  const [oidcClientId, setOidcClientId] = useState('hermes-client-id')
  const [oidcClientSecret, setOidcClientSecret] = useState('••••••••')
  const [oidcScopes, setOidcScopes] = useState('openid profile email groups')

  // General settings
  const [enforceSso, setEnforceSso] = useState(false)
  const [allowPasswordFallback, setAllowPasswordFallback] = useState(true)
  const [sessionDuration, setSessionDuration] = useState(8)
  const [requireMfa, setRequireMfa] = useState(true)

  const filteredProviders = useMemo(() => {
    return SSO_PROVIDERS_DATA.filter(provider => {
      const matchesSearch = provider.displayName.toLowerCase().includes(search.toLowerCase()) ||
        provider.name.toLowerCase().includes(search.toLowerCase()) ||
        provider.domains.some(d => d.toLowerCase().includes(search.toLowerCase()))
      const matchesStatus = !statusFilter || provider.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const openEditModal = (provider: typeof SSO_PROVIDERS_DATA[0]) => {
    setEditingProvider(provider)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setEditingProvider(null)
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleStatusFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleSelectionChange = (selected: string[]) => {
    setSelectedProviders(new Set(selected))
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'configured': return 'info'
      case 'inactive': return 'default'
      case 'error': return 'error'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'configured': return 'Configured'
      case 'inactive': return 'Inactive'
      case 'error': return 'Error'
      default: return status
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'oidc': return 'OIDC'
      case 'saml': return 'SAML'
      case 'ldap': return 'LDAP'
      default: return type.toUpperCase()
    }
  }

  const tabs = [
    { id: 'providers', label: 'Providers' },
    { id: 'saml', label: 'SAML Settings' },
    { id: 'oidc', label: 'OIDC Settings' },
    { id: 'general', label: 'General' },
  ]

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
        aria-label="SSO configuration tabs"
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

      {/* Providers Tab */}
      {activeTab === 'providers' && (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
            <Card variant="elevated" padding="md">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Total Providers</div>
                  <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                    {SSO_PROVIDERS_DATA.length}
                  </div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-base)', fontSize: 'var(--text-display-sm)' }}>🔗</div>
              </div>
            </Card>
            <Card variant="elevated" padding="md">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Active Providers</div>
                  <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-success-base)' }}>
                    {SSO_PROVIDERS_DATA.filter(p => p.status === 'active').length}
                  </div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-success-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success-base)', fontSize: 'var(--text-display-sm)' }}>✅</div>
              </div>
            </Card>
            <Card variant="elevated" padding="md">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>SSO Users</div>
                  <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                    {SSO_PROVIDERS_DATA.reduce((sum, p) => sum + p.users, 0)}
                  </div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-info-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-info-base)', fontSize: 'var(--text-display-sm)' }}>👥</div>
              </div>
            </Card>
            <Card variant="elevated" padding="md">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>Domains Covered</div>
                  <div style={{ fontSize: 'var(--text-display-md)', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
                    {new Set(SSO_PROVIDERS_DATA.flatMap(p => p.domains)).size}
                  </div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-warning-base)/15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-warning-base)', fontSize: 'var(--text-display-sm)' }}>🌐</div>
              </div>
            </Card>
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <Input
                placeholder="Search providers..."
                value={search}
                onChange={handleSearchChange}
                prefix={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16" y2="16"></line></svg>}
                size="sm"
              />
            </div>
            <Select
              value={statusFilter}
              onChangeRaw={handleStatusFilterChange}
              placeholder="All Status"
              options={STATUS_OPTIONS}
              size="sm"
              style={{ minWidth: 160 }}
            />
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-2)' }}>
              <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
                <span style={{ marginRight: 'var(--spacing-1)' }}>➕</span>
                Add Provider
              </Button>
            </div>
          </div>

          {/* Provider Count */}
          <div style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
            {filteredProviders.length} of {SSO_PROVIDERS_DATA.length} providers
            {selectedProviders.size > 0 && <span style={{ marginLeft: 'var(--spacing-3)' }}>{selectedProviders.size} selected</span>}
          </div>

          {/* Providers Table */}
          <Card variant="elevated" padding="none">
            <Table
              columns={[
                { key: 'avatar', header: '', width: 48, render: (provider: typeof SSO_PROVIDERS_DATA[0]) => (
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: provider.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: provider.color, fontWeight: 600, fontSize: 'var(--text-body-sm)' }}>
                    {provider.name.charAt(0)}
                  </div>
                )},
                { key: 'name', header: 'Provider', sortable: true, render: (provider: typeof SSO_PROVIDERS_DATA[0]) => (
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{provider.displayName}</div>
                    <Badge variant="default" size="sm">{getTypeLabel(provider.type)}</Badge>
                  </div>
                )},
                { key: 'domains', header: 'Domains', sortable: true, render: (provider: typeof SSO_PROVIDERS_DATA[0]) => (
                  <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>
                    {provider.domains.join(', ')}
                  </div>
                )},
                { key: 'users', header: 'Users', sortable: true, render: (provider: typeof SSO_PROVIDERS_DATA[0]) => (
                  <Badge variant="default" size="sm">{provider.users}</Badge>
                )},
                { key: 'lastSync', header: 'Last Sync', sortable: true, render: (provider: typeof SSO_PROVIDERS_DATA[0]) => (
                  <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{provider.lastSync}</div>
                )},
                { key: 'provisioning', header: 'Provisioning', sortable: true, render: (provider: typeof SSO_PROVIDERS_DATA[0]) => (
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)', fontSize: 'var(--text-body-xs)' }}>
                    <Badge variant={provider.autoProvision ? 'success' : 'default'} size="sm" dot>Auto</Badge>
                    <Badge variant={provider.jitProvision ? 'info' : 'default'} size="sm" dot>JIT</Badge>
                  </div>
                )},
                { key: 'status', header: 'Status', sortable: true, render: (provider: typeof SSO_PROVIDERS_DATA[0]) => (
                  <Badge variant={getStatusVariant(provider.status)} size="sm" dot>
                    {getStatusLabel(provider.status)}
                  </Badge>
                )},
                { key: 'actions', header: '', width: 100, render: (provider: typeof SSO_PROVIDERS_DATA[0]) => (
                  <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditModal(provider) }}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation() }}>
                      {provider.status === 'active' ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                )},
              ]}
              rows={filteredProviders}
              selectedRows={Array.from(selectedProviders)}
              onSelectionChange={handleSelectionChange}
              emptyMessage="No SSO providers configured"
              selectable
            />
          </Card>

          {/* Add Provider Modal */}
          <Modal
            isOpen={showCreateModal}
            onClose={closeModals}
            title="Add SSO Provider"
            size="lg"
          >
            <form>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <Select
                  label="Provider Type"
                  placeholder="Select provider type"
                  options={TYPE_OPTIONS}
                  required
                />
                <Input label="Display Name" placeholder="e.g., Okta" required />
                <Input label="Domains (comma-separated)" placeholder="hermes.ai, company.com" required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Auto-provision users</label>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Just-in-time provisioning</label>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
                  <Button variant="ghost" onClick={closeModals}>Cancel</Button>
                  <Button variant="primary" type="submit">Add Provider</Button>
                </div>
              </div>
            </form>
          </Modal>

          {/* Edit Provider Modal */}
          <Modal
            isOpen={!!editingProvider}
            onClose={closeModals}
            title="Edit SSO Provider"
            size="lg"
          >
            {editingProvider && (
              <form>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <Input label="Display Name" defaultValue={editingProvider.displayName} />
                  <Input label="Domains (comma-separated)" defaultValue={editingProvider.domains.join(', ')} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Auto-provision users</label>
                      <Toggle checked={editingProvider.autoProvision} onChange={() => {}} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Just-in-time provisioning</label>
                      <Toggle checked={editingProvider.jitProvision} onChange={() => {}} />
                    </div>
                  </div>
                  <Select
                    label="Status"
                    value={editingProvider.status}
                    onChangeRaw={() => { /* update status */ }}
                    options={STATUS_OPTIONS}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
                    <Button variant="ghost" onClick={closeModals}>Cancel</Button>
                    <Button variant="primary">Save Changes</Button>
                  </div>
                </div>
              </form>
            )}
          </Modal>
        </>
      )}

      {/* SAML Settings Tab */}
      {activeTab === 'saml' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                SAML 2.0 CONFIGURATION
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <Input label="Entity ID" value={samlEntityId} onChange={(e) => setSamlEntityId(e.target.value)} placeholder="https://hermes.ai/saml/metadata" />
                <Input label="ACS URL (Assertion Consumer Service)" value={samlAcsUrl} onChange={(e) => setSamlAcsUrl(e.target.value)} placeholder="https://hermes.ai/saml/acs" />
                <Input label="SLO URL (Single Logout)" value={samlSloUrl} onChange={(e) => setSamlSloUrl(e.target.value)} placeholder="https://hermes.ai/saml/slo" />
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-label-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
                    X.509 Certificate
                  </label>
                  <Textarea
                    value={samlCertificate}
                    onChange={(e) => setSamlCertificate(e.target.value)}
                    rows={6}
                    placeholder="Paste your IdP certificate here..."
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-3)' }}>
                SP METADATA (Share with IdP)
              </div>
              <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', whiteSpace: 'pre-wrap' }}>
{`<?xml version="1.0"?>
<EntityDescriptor entityID="${samlEntityId}">
  <SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${samlAcsUrl}" index="1"/>
    <SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="${samlSloUrl}"/>
  </SPSSODescriptor>
</EntityDescriptor>`}
              </div>
              <Button variant="secondary" size="sm" style={{ marginTop: 'var(--spacing-3)' }}>Download Metadata XML</Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary">Save SAML Settings</Button>
            </div>
          </div>
        </Card>
      )}

      {/* OIDC Settings Tab */}
      {activeTab === 'oidc' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                OPENID CONNECT CONFIGURATION
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <Input label="Issuer URL" value={oidcIssuer} onChange={(e) => setOidcIssuer(e.target.value)} placeholder="https://company.okta.com" />
                <Input label="Client ID" value={oidcClientId} onChange={(e) => setOidcClientId(e.target.value)} placeholder="hermes-client-id" />
                <Input label="Client Secret" type="password" value={oidcClientSecret} onChange={(e) => setOidcClientSecret(e.target.value)} placeholder="••••••••" />
                <Input label="Scopes (space-separated)" value={oidcScopes} onChange={(e) => setOidcScopes(e.target.value)} placeholder="openid profile email groups" />
              </div>
            </div>

            <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
              <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-3)' }}>
                REDIRECT URIS (Configure in IdP)
              </div>
              <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', backgroundColor: 'var(--color-surface)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', whiteSpace: 'pre-wrap' }}>
{`https://hermes.ai/auth/callback
https://hermes.ai/auth/silent-callback
https://staging.hermes.ai/auth/callback`}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary">Save OIDC Settings</Button>
            </div>
          </div>
        </Card>
      )}

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <Card variant="elevated">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                SSO ENFORCEMENT
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Enforce SSO for all members</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Require SSO login, disable password authentication</div>
                  </div>
                  <Toggle checked={enforceSso} onChange={(checked) => setEnforceSso(checked)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Allow password fallback</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Allow password login when SSO is unavailable</div>
                  </div>
                  <Toggle checked={allowPasswordFallback} onChange={(checked) => setAllowPasswordFallback(checked)} disabled={enforceSso} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Require MFA for SSO</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Enforce multi-factor authentication</div>
                  </div>
                  <Toggle checked={requireMfa} onChange={(checked) => setRequireMfa(checked)} />
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 'var(--text-label-lg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                SESSION SETTINGS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>Session Duration</div>
                    <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-tertiary)' }}>Hours before re-authentication required</div>
                  </div>
                  <Select
                    value={String(sessionDuration)}
                    onChangeRaw={(e) => setSessionDuration(parseInt(e.target.value))}
                    options={[
                      { value: '1', label: '1 hour' },
                      { value: '4', label: '4 hours' },
                      { value: '8', label: '8 hours' },
                      { value: '12', label: '12 hours' },
                      { value: '24', label: '24 hours' },
                    ]}
                    style={{ minWidth: 140 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary">Save General Settings</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}