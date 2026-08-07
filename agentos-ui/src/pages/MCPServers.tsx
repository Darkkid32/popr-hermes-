// MCP Servers - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { MCP_SERVERS } from '../lib/mcp-data'
import { useMCPStore } from '../stores/MCPStore'
import { MCPServerCard } from '../design-system/components/specialized/MCPServerCard'
import { DetailDrawer } from '../design-system/components/specialized/DetailDrawer'
import { SearchFilters } from '../design-system/components/specialized/SearchFilters'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Table } from '../design-system/components/data-display/Table'
import { ProviderBadge } from '../design-system/components/specialized/ProviderBadge'

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  connected: 'success',
  disconnected: 'error',
  connecting: 'warning',
  error: 'error',
}

const CATEGORY_BADGE: Record<string, 'default' | 'info' | 'success' | 'warning' | 'error'> = {
  filesystem: 'default',
  database: 'info',
  api: 'success',
  tool: 'warning',
  integration: 'error',
  custom: 'default',
}

const TRANSPORT_ICON: Record<string, string> = {
  stdio: '📟',
  sse: '📡',
  websocket: '🔌',
}

export function MCPServers() {
  const { view, setView, filter, setFilter, selectedServer, setSelectedServer, toggleServer } = useMCPStore()
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'status' | 'version' | 'requests' | 'latency'>('name')

  const allCategories = [...new Set(MCP_SERVERS.map((s) => s.category))].sort()

  const filteredServers = MCP_SERVERS.filter((s) => {
    const matchCategory = filter.category === 'all' || s.category === filter.category
    const matchStatus = filter.status === 'all' || s.status === filter.status
    const matchSearch = !filter.search || s.name.toLowerCase().includes(filter.search.toLowerCase()) || s.description.toLowerCase().includes(filter.search.toLowerCase())
    return matchCategory && matchStatus && matchSearch
  })

  const sortedServers = [...filteredServers].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'category') return a.category.localeCompare(b.category)
    if (sortBy === 'status') return a.status.localeCompare(b.status)
    if (sortBy === 'version') return b.version.localeCompare(a.version)
    if (sortBy === 'requests') return b.requestsTotal - a.requestsTotal
    if (sortBy === 'latency') return parseFloat(a.avgLatency) - parseFloat(b.avgLatency)
    return 0
  })

  return (
    <div className="page-body">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <Badge variant="success" size="md" dot>{MCP_SERVERS.filter((s) => s.status === 'connected').length} connected</Badge>
        <Badge variant="error" size="md" dot>{MCP_SERVERS.filter((s) => s.status === 'error').length} errors</Badge>
        <Badge variant="info" size="md" dot>{MCP_SERVERS.length} servers</Badge>
        <Badge variant="primary" size="md" dot>{filteredServers.length} filtered</Badge>
      </div>

      <SearchFilters
        searchPlaceholder="Search servers..."
        onSearchChange={(value) => setFilter({ search: value })}
        filters={[
          {
            key: 'category',
            label: 'Category',
            type: 'select',
            options: [
              { value: 'all', label: 'All Categories' },
              ...allCategories.map((c) => ({ value: c, label: c })),
            ],
          },
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: 'all', label: 'All Statuses' },
              { value: 'connected', label: 'Connected' },
              { value: 'disconnected', label: 'Disconnected' },
              { value: 'connecting', label: 'Connecting' },
              { value: 'error', label: 'Error' },
            ],
          },
        ]}
        values={filter}
        onChange={(values) => setFilter(values)}
        viewMode={view}
        onViewModeChange={setView}
      />

      <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
          SORT BY
        </span>
        {(['name', 'category', 'status', 'requests', 'latency'] as const).map((key) => (
          <Button key={key} variant={sortBy === key ? 'primary' : 'tertiary'} size="sm" onClick={() => setSortBy(key)}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Button>
        ))}
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 'var(--spacing-3)' }}>
                  {sortedServers.map((server) => (
                    <MCPServerCard
                      key={server.id}
                      server={server}
                      variant="default"
                      onClick={() => setSelectedServer(server)}
                      onExploreTools={() => { setSelectedServer(server); }}
                      onConnect={() => toggleServer(server.id)}
                      onDisconnect={() => toggleServer(server.id)}
                      onConfigure={() => setSelectedServer(server)}
                      onRemove={() => console.log('Remove:', server.id)}
                    />
                  ))}
                </div>
      ) : (
        <Card variant="outlined" style={{ overflow: 'hidden' }}>
          <Table
            columns={[
              { key: 'name', header: 'SERVER', sortable: true, width: 220, render: (s: any) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <span style={{ fontSize: 'var(--text-display-sm)', color: s.iconColor }}>{s.icon}</span>
                  <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{s.name}</span>
                </div>
              )},
              { key: 'category', header: 'CATEGORY', sortable: true, width: 120, render: (s: any) => (
                <Badge variant={CATEGORY_BADGE[s.category] || 'default'} size="sm">{s.category}</Badge>
              )},
              { key: 'status', header: 'STATUS', sortable: true, width: 110, render: (s: any) => (
                <Badge variant={STATUS_BADGE[s.status] || 'default'} size="sm" dot>{s.status}</Badge>
              )},
              { key: 'transport', header: 'TRANSPORT', width: 110, render: (s: any) => (
                <span style={{ fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
                  {TRANSPORT_ICON[s.transport]} {s.transport}
                </span>
              )},
              { key: 'tools', header: 'TOOLS', align: 'right', width: 80, render: (s: any) => (
                <span style={{ fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{s.tools.length}</span>
              )},
              { key: 'requests', header: 'REQUESTS', sortable: true, align: 'right', width: 110, render: (s: any) => (
                <span style={{ fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{s.requestsTotal.toLocaleString()}</span>
              )},
              { key: 'latency', header: 'LATENCY', sortable: true, align: 'right', width: 90, render: (s: any) => (
                <span style={{ fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{s.avgLatency}ms</span>
              )},
              { key: 'version', header: 'VERSION', sortable: true, width: 90, render: (s: any) => (
                <span style={{ fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>v{s.version}</span>
              )},
            ]}
            rows={sortedServers}
            sortColumn={sortBy}
            sortDirection="asc"
            onSort={(column: string) => setSortBy(column as any)}
            selectable={false}
            emptyMessage="No servers match filters"
          />
        </Card>
      )}

      {selectedServer && (
        <ServerDetailDrawer server={selectedServer} onClose={() => setSelectedServer(null)} onToggle={() => toggleServer(selectedServer.id)} />
      )}
    </div>
  )
}

function ServerDetailDrawer({ server, onClose, onToggle }: { server: any; onClose: () => void; onToggle: () => void }) {
  return (
    <DetailDrawer
      isOpen={true}
      onClose={onClose}
      title={server.name}
      size="lg"
      headerIcon={<ProviderBadge simpleProvider={{ name: server.category, status: server.status, icon: server.icon, iconColor: server.iconColor }} size="sm" />}
      actions={
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <Button variant="secondary" onClick={onToggle}>
            {server.status === 'connected' ? 'Disconnect' : 'Connect'}
          </Button>
          <Button variant="primary" onClick={onClose}>Close</Button>
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <div className="panel-sm">
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>VERSION</div>
          <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>v{server.version}</div>
        </div>
        <div className="panel-sm">
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>AUTHOR</div>
          <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{server.author}</div>
        </div>
        <div className="panel-sm">
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>TRANSPORT</div>
          <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{TRANSPORT_ICON[server.transport]} {server.transport}</div>
        </div>
        <div className="panel-sm">
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>ENDPOINT</div>
          <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{server.endpoint}</div>
        </div>
        <div className="panel-sm">
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>UPTIME</div>
          <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{server.uptime}</div>
        </div>
        <div className="panel-sm">
          <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>LAST CONNECTED</div>
          <div style={{ fontSize: 'var(--text-body-md)', fontWeight: 500, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{server.lastConnected}</div>
        </div>
      </div>

      <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
        CAPABILITIES
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-4)' }}>
        {server.capabilities.map((cap: string) => (
          <Badge key={cap} variant="default" size="sm">{cap}</Badge>
        ))}
      </div>

      <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
        TOOLS · {server.tools.length}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)', marginBottom: 'var(--spacing-4)' }}>
        {server.tools.map((tool: any) => (
          <Badge key={tool.name} variant="info" size="sm" style={{ fontFamily: 'var(--font-mono)' }}>{tool.name}</Badge>
        ))}
      </div>

      <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
        RESOURCES · {server.resources.length}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)', maxHeight: 200, overflow: 'auto' }}>
        {server.resources.map((res: any) => (
          <div key={res.uri} style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-primary)' }}>
            <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{res.name}</div>
            <div style={{ fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{res.uri}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
        CONFIGURATION
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
        {Object.entries(server.config).map(([key, value]) => (
          <div key={key} style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-primary)' }}>
            <div style={{ fontSize: 'var(--text-label-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-1)' }}>
              {key}
            </div>
            <div style={{ fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>
              {String(value)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-2)', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--color-border-primary)' }}>
        <Button variant={server.status === 'connected' ? 'secondary' : 'primary'} onClick={onToggle}>
          {server.status === 'connected' ? 'Disconnect' : 'Connect'}
        </Button>
        <Button variant="secondary">Configure</Button>
        <Button variant="ghost" style={{ color: 'var(--color-error-base)', borderColor: 'var(--color-error-base)' }}>Remove</Button>
      </div>
    </DetailDrawer>
  )
}