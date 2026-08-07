// MCP Tools Explorer - Migrated to use shared AI components
// Source: Google Stitch Project 10866743485103090405
// Design System: Hermes AI OS

import { useState } from 'react'
import { MCP_SERVERS } from '../lib/mcp-data'
import { ToolCard } from '../design-system/components/specialized/ToolCard'
import { ResourceCard } from '../design-system/components/specialized/ResourceCard'
import { PromptCard } from '../design-system/components/specialized/PromptCard'
import { DetailDrawer } from '../design-system/components/specialized/DetailDrawer'
import { Card } from '../design-system/components/data-display/Card'
import { Badge } from '../design-system/components/data-display/Badge'
import { Button } from '../design-system/components/data-display/Button'
import { Input } from '../design-system/components/forms/Input'
import { ProviderBadge } from '../design-system/components/specialized/ProviderBadge'

type ExplorerTab = 'tools' | 'resources' | 'prompts'

export function MCPTools() {
  const allTools = MCP_SERVERS.flatMap((server) =>
    server.tools.map((tool) => ({ ...tool, serverId: server.id, serverName: server.name, serverIcon: server.icon, serverColor: server.iconColor }))
  )

  const allResources = MCP_SERVERS.flatMap((server) =>
    server.resources.map((resource) => ({ ...resource, serverId: server.id, serverName: server.name, serverIcon: server.icon, serverColor: server.iconColor }))
  )

  const allPrompts = MCP_SERVERS.flatMap((server) =>
    server.prompts.map((prompt) => ({ ...prompt, serverId: server.id, serverName: server.name, serverIcon: server.icon, serverColor: server.iconColor }))
  )

  const [tab, setTab] = useState<ExplorerTab>('tools')
  const [search, setSearch] = useState('')
  const [selectedTool, setSelectedTool] = useState<any>(null)
  const [selectedResource, setSelectedResource] = useState<any>(null)
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null)

  const filteredTools = allTools.filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
  const filteredResources = allResources.filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()))
  const filteredPrompts = allPrompts.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))

  const TABS: Array<{ id: ExplorerTab; label: string; count: number }> = [
    { id: 'tools', label: 'Tools', count: allTools.length },
    { id: 'resources', label: 'Resources', count: allResources.length },
    { id: 'prompts', label: 'Prompts', count: allPrompts.length },
  ]

  return (
    <div className="page-body">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
        <Badge variant="success" size="md" dot>{allTools.length} tools</Badge>
        <Badge variant="info" size="md" dot>{allResources.length} resources</Badge>
        <Badge variant="primary" size="md" dot>{allPrompts.length} prompts</Badge>
        <Badge variant="default" size="md" dot>{MCP_SERVERS.length} servers</Badge>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)' }}>
        {TABS.map((t) => (
          <Button key={t.id} variant={tab === t.id ? 'primary' : 'tertiary'} size="sm" onClick={() => { setTab(t.id); setSearch('') }}>
            {t.label} ({t.count})
          </Button>
        ))}
      </div>

      <div style={{ position: 'relative', marginBottom: 'var(--spacing-3)', maxWidth: 480 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-quaternary)', pointerEvents: 'none' }}>
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16" y2="16"></line>
        </svg>
        <Input
          placeholder={`Search ${tab}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '40px', width: '100%' }}
          size="sm"
        />
      </div>

      {tab === 'tools' && (
        <Card variant="outlined" style={{ overflow: 'hidden' }}>
          <div style={{ padding: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border-primary)' }}>
            <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
              TOOL CATALOG · {filteredTools.length}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', padding: 'var(--spacing-2)' }}>
            {filteredTools.map((tool) => (
              <ToolCard key={`${tool.serverId}-${tool.name}`} tool={tool} variant="default" onClick={() => setSelectedTool(tool)} isSelected={selectedTool?.name === tool.name} />
            ))}
            {filteredTools.length === 0 && (
              <div style={{ padding: 'var(--spacing-4)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>No tools match your search</div>
            )}
          </div>
        </Card>
      )}

      {tab === 'resources' && (
        <Card variant="outlined" style={{ overflow: 'hidden' }}>
          <div style={{ padding: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border-primary)' }}>
            <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
              RESOURCE BROWSER · {filteredResources.length}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', padding: 'var(--spacing-2)' }}>
            {filteredResources.map((resource) => (
              <ResourceCard key={`${resource.serverId}-${resource.uri}`} resource={resource} variant="default" onClick={() => setSelectedResource(resource)} isSelected={selectedResource?.uri === resource.uri} />
            ))}
            {filteredResources.length === 0 && (
              <div style={{ padding: 'var(--spacing-4)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>No resources match your search</div>
            )}
          </div>
        </Card>
      )}

      {tab === 'prompts' && (
        <Card variant="outlined" style={{ overflow: 'hidden' }}>
          <div style={{ padding: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border-primary)' }}>
            <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)' }}>
              PROMPT LIBRARY · {filteredPrompts.length}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', padding: 'var(--spacing-2)' }}>
            {filteredPrompts.map((prompt) => (
              <PromptCard key={`${prompt.serverId}-${prompt.name}`} prompt={prompt} variant="default" onClick={() => setSelectedPrompt(prompt)} isSelected={selectedPrompt?.name === prompt.name} />
            ))}
            {filteredPrompts.length === 0 && (
              <div style={{ padding: 'var(--spacing-4)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>No prompts match your search</div>
            )}
          </div>
        </Card>
      )}

      {selectedTool && (
        <DetailDrawer
          isOpen={true}
          onClose={() => setSelectedTool(null)}
          title={selectedTool.name}
          size="md"
          headerIcon={<ProviderBadge simpleProvider={{ name: selectedTool.serverName, status: 'connected', icon: selectedTool.serverIcon, iconColor: selectedTool.serverColor }} size="sm" />}
        >
          <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
            {selectedTool.description}
          </div>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
            INPUT SCHEMA
          </div>
          <pre style={{ backgroundColor: 'var(--color-background-base)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3)', maxHeight: 400, overflow: 'auto', fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(selectedTool.inputSchema, null, 2)}
          </pre>
        </DetailDrawer>
      )}

      {selectedResource && (
        <DetailDrawer
          isOpen={true}
          onClose={() => setSelectedResource(null)}
          title={selectedResource.name}
          size="md"
          headerIcon={<ProviderBadge simpleProvider={{ name: selectedResource.serverName, status: 'connected', icon: selectedResource.serverIcon, iconColor: selectedResource.serverColor }} size="sm" />}
        >
          <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
            {selectedResource.description}
          </div>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
            URI
          </div>
          <div style={{ backgroundColor: 'var(--color-background-base)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3)', fontSize: 'var(--text-body-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', wordBreak: 'break-all', marginBottom: 'var(--spacing-4)' }}>
            {selectedResource.uri}
          </div>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
            MIME TYPE
          </div>
          <Badge variant="info" size="sm">{selectedResource.mimeType}</Badge>
        </DetailDrawer>
      )}

      {selectedPrompt && (
        <DetailDrawer
          isOpen={true}
          onClose={() => setSelectedPrompt(null)}
          title={selectedPrompt.name}
          size="md"
          headerIcon={<ProviderBadge simpleProvider={{ name: selectedPrompt.serverName, status: 'connected', icon: selectedPrompt.serverIcon, iconColor: selectedPrompt.serverColor }} size="sm" />}
        >
          <div style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
            {selectedPrompt.description}
          </div>
          <div style={{ fontSize: 'var(--text-label-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
            ARGUMENTS
          </div>
          <pre style={{ backgroundColor: 'var(--color-background-base)', border: '1px solid var(--color-border-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3)', maxHeight: 400, overflow: 'auto', fontSize: 'var(--text-body-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(selectedPrompt.arguments, null, 2)}
          </pre>
        </DetailDrawer>
      )}
    </div>
  )
}