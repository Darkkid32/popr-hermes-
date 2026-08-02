import type { NavLink } from './demo-data'

export interface MCPServer {
  id: string
  name: string
  description: string
  version: string
  author: string
  category: 'filesystem' | 'database' | 'api' | 'tool' | 'integration' | 'custom'
  status: 'connected' | 'disconnected' | 'connecting' | 'error'
  icon: string
  iconColor: string
  tags: string[]
  capabilities: string[]
  tools: MCPTool[]
  resources: MCPResource[]
  prompts: MCPPrompt[]
  transport: 'stdio' | 'sse' | 'websocket'
  endpoint: string
  config: Record<string, any>
  installDate: string
  lastUpdate: string
  lastConnected: string
  uptime: string
  requestsTotal: number
  requestsSuccess: number
  requestsFailed: number
  avgLatency: string
}

export interface MCPTool {
  name: string
  description: string
  inputSchema: Record<string, any>
}

export interface MCPResource {
  uri: string
  name: string
  description: string
  mimeType: string
}

export interface MCPPrompt {
  name: string
  description: string
  arguments: Record<string, any>
}

export const MCP_SERVERS: MCPServer[] = [
  {
    id: 'filesystem',
    name: 'Filesystem Server',
    description: 'Local filesystem access with read, write, list, and search capabilities.',
    version: '1.2.0',
    author: 'MCP Team',
    category: 'filesystem',
    status: 'connected',
    icon: '◧',
    iconColor: '#7c6cf5',
    tags: ['filesystem', 'local', 'read', 'write'],
    capabilities: ['read', 'write', 'list', 'search', 'watch'],
    tools: [
      { name: 'read_file', description: 'Read a file from the filesystem', inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] } },
      { name: 'write_file', description: 'Write a file to the filesystem', inputSchema: { type: 'object', properties: { path: { type: 'string' }, content: { type: 'string' } }, required: ['path', 'content'] } },
      { name: 'list_directory', description: 'List directory contents', inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] } },
      { name: 'search_files', description: 'Search for files by pattern', inputSchema: { type: 'object', properties: { pattern: { type: 'string' }, path: { type: 'string' } }, required: ['pattern'] } },
    ],
    resources: [
      { uri: 'file:///home/user', name: 'Home Directory', description: 'User home directory', mimeType: 'inode/directory' },
      { uri: 'file:///workspace', name: 'Workspace', description: 'Project workspace', mimeType: 'inode/directory' },
    ],
    prompts: [
      { name: 'create_project_structure', description: 'Create a standard project structure', arguments: { type: 'object', properties: { projectType: { type: 'string' } } } },
    ],
    transport: 'stdio',
    endpoint: 'npx @modelcontextprotocol/server-filesystem /workspace',
    config: { rootPath: '/workspace', allowedPaths: ['/workspace', '/home/user'] },
    installDate: '2026-06-15',
    lastUpdate: '2026-07-20',
    lastConnected: '2m ago',
    uptime: '99.9%',
    requestsTotal: 12450,
    requestsSuccess: 12380,
    requestsFailed: 70,
    avgLatency: '45ms',
  },
  {
    id: 'postgres',
    name: 'PostgreSQL Server',
    description: 'PostgreSQL database connector for queries, schema inspection, and migrations.',
    version: '1.0.3',
    author: 'MCP Team',
    category: 'database',
    status: 'connected',
    icon: '⬢',
    iconColor: '#336791',
    tags: ['postgres', 'database', 'sql', 'queries'],
    capabilities: ['query', 'schema', 'migrate', 'transaction'],
    tools: [
      { name: 'execute_query', description: 'Execute a SQL query', inputSchema: { type: 'object', properties: { sql: { type: 'string' }, params: { type: 'array' } }, required: ['sql'] } },
      { name: 'list_tables', description: 'List all tables in database', inputSchema: { type: 'object', properties: {} } },
      { name: 'describe_table', description: 'Get table schema', inputSchema: { type: 'object', properties: { table: { type: 'string' } }, required: ['table'] } },
      { name: 'run_migration', description: 'Run a migration script', inputSchema: { type: 'object', properties: { migration: { type: 'string' } }, required: ['migration'] } },
    ],
    resources: [
      { uri: 'postgres://localhost/hermes', name: 'Hermes Database', description: 'Main application database', mimeType: 'application/sql' },
    ],
    prompts: [
      { name: 'generate_migration', description: 'Generate migration from schema diff', arguments: { type: 'object', properties: { fromSchema: { type: 'string' }, toSchema: { type: 'string' } } } },
    ],
    transport: 'stdio',
    endpoint: 'npx @modelcontextprotocol/server-postgres postgresql://localhost/hermes',
    config: { connectionString: 'postgresql://localhost/hermes', maxConnections: 10 },
    installDate: '2026-06-20',
    lastUpdate: '2026-07-15',
    lastConnected: '5m ago',
    uptime: '99.8%',
    requestsTotal: 8720,
    requestsSuccess: 8650,
    requestsFailed: 70,
    avgLatency: '120ms',
  },
  {
    id: 'github',
    name: 'GitHub Server',
    description: 'GitHub API integration for repos, issues, PRs, and actions.',
    version: '0.9.1',
    author: 'MCP Team',
    category: 'api',
    status: 'connected',
    icon: '⌘',
    iconColor: '#22d97a',
    tags: ['github', 'api', 'issues', 'prs', 'actions'],
    capabilities: ['repos', 'issues', 'pulls', 'actions', 'releases', 'search'],
    tools: [
      { name: 'get_repo', description: 'Get repository info', inputSchema: { type: 'object', properties: { owner: { type: 'string' }, repo: { type: 'string' } }, required: ['owner', 'repo'] } },
      { name: 'list_issues', description: 'List repository issues', inputSchema: { type: 'object', properties: { owner: { type: 'string' }, repo: { type: 'string' }, state: { type: 'string' } }, required: ['owner', 'repo'] } },
      { name: 'create_pr', description: 'Create a pull request', inputSchema: { type: 'object', properties: { owner: { type: 'string' }, repo: { type: 'string' }, title: { type: 'string' }, body: { type: 'string' }, head: { type: 'string' }, base: { type: 'string' } }, required: ['owner', 'repo', 'title', 'head', 'base'] } },
      { name: 'search_code', description: 'Search code across repositories', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
    ],
    resources: [
      { uri: 'github://owner/repo', name: 'Repository', description: 'GitHub repository', mimeType: 'application/json' },
    ],
    prompts: [
      { name: 'create_issue_template', description: 'Create issue template', arguments: { type: 'object', properties: { type: { type: 'string' } } } },
    ],
    transport: 'sse',
    endpoint: 'https://api.github.com/mcp',
    config: { token: 'ghp_****', apiUrl: 'https://api.github.com' },
    installDate: '2026-07-01',
    lastUpdate: '2026-07-25',
    lastConnected: '1m ago',
    uptime: '99.5%',
    requestsTotal: 5430,
    requestsSuccess: 5380,
    requestsFailed: 50,
    avgLatency: '320ms',
  },
  {
    id: 'sqlite',
    name: 'SQLite Server',
    description: 'Lightweight SQLite database for local data storage and queries.',
    version: '1.0.0',
    author: 'MCP Team',
    category: 'database',
    status: 'connected',
    icon: '⬢',
    iconColor: '#00e5ff',
    tags: ['sqlite', 'database', 'local', 'embedded'],
    capabilities: ['query', 'schema', 'backup', 'vacuum'],
    tools: [
      { name: 'execute_query', description: 'Execute a SQL query', inputSchema: { type: 'object', properties: { sql: { type: 'string' } }, required: ['sql'] } },
      { name: 'list_tables', description: 'List all tables', inputSchema: { type: 'object', properties: {} } },
      { name: 'backup', description: 'Backup database to file', inputSchema: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] } },
    ],
    resources: [
      { uri: 'sqlite:///data/hermes.db', name: 'Hermes Local DB', description: 'Local application database', mimeType: 'application/x-sqlite3' },
    ],
    prompts: [],
    transport: 'stdio',
    endpoint: 'npx @modelcontextprotocol/server-sqlite /data/hermes.db',
    config: { databasePath: '/data/hermes.db', readOnly: false },
    installDate: '2026-06-25',
    lastUpdate: '2026-07-10',
    lastConnected: '30s ago',
    uptime: '100%',
    requestsTotal: 3210,
    requestsSuccess: 3210,
    requestsFailed: 0,
    avgLatency: '15ms',
  },
  {
    id: 'redis',
    name: 'Redis Server',
    description: 'Redis cache and pub/sub server for distributed caching and messaging.',
    version: '0.8.2',
    author: 'MCP Team',
    category: 'tool',
    status: 'disconnected',
    icon: '◉',
    iconColor: '#DC382D',
    tags: ['redis', 'cache', 'pubsub', 'distributed'],
    capabilities: ['get', 'set', 'del', 'pubsub', 'keys', 'expire'],
    tools: [
      { name: 'get', description: 'Get value by key', inputSchema: { type: 'object', properties: { key: { type: 'string' } }, required: ['key'] } },
      { name: 'set', description: 'Set key-value pair', inputSchema: { type: 'object', properties: { key: { type: 'string' }, value: { type: 'string' }, ttl: { type: 'number' } }, required: ['key', 'value'] } },
      { name: 'publish', description: 'Publish to channel', inputSchema: { type: 'object', properties: { channel: { type: 'string' }, message: { type: 'string' } }, required: ['channel', 'message'] } },
      { name: 'subscribe', description: 'Subscribe to channel', inputSchema: { type: 'object', properties: { channel: { type: 'string' } }, required: ['channel'] } },
    ],
    resources: [
      { uri: 'redis://localhost:6379', name: 'Redis Cache', description: 'Redis cache instance', mimeType: 'application/json' },
    ],
    prompts: [],
    transport: 'stdio',
    endpoint: 'npx @modelcontextprotocol/server-redis redis://localhost:6379',
    config: { url: 'redis://localhost:6379', maxRetries: 3 },
    installDate: '2026-07-10',
    lastUpdate: '2026-07-10',
    lastConnected: 'never',
    uptime: '0%',
    requestsTotal: 0,
    requestsSuccess: 0,
    requestsFailed: 0,
    avgLatency: '0ms',
  },
  {
    id: 'brave-search',
    name: 'Brave Search Server',
    description: 'Web search via Brave Search API with filtering and ranking.',
    version: '0.5.1',
    author: 'Brave',
    category: 'api',
    status: 'connected',
    icon: '◉',
    iconColor: '#FFB800',
    tags: ['search', 'web', 'brave', 'api'],
    capabilities: ['search', 'news', 'images', 'filter'],
    tools: [
      { name: 'web_search', description: 'Search the web', inputSchema: { type: 'object', properties: { query: { type: 'string' }, count: { type: 'number' } }, required: ['query'] } },
      { name: 'news_search', description: 'Search news', inputSchema: { type: 'object', properties: { query: { type: 'string' }, count: { type: 'number' } }, required: ['query'] } },
    ],
    resources: [],
    prompts: [],
    transport: 'sse',
    endpoint: 'https://api.search.brave.com/mcp',
    config: { apiKey: 'bs_****', endpoint: 'https://api.search.brave.com' },
    installDate: '2026-07-12',
    lastUpdate: '2026-07-20',
    lastConnected: '10m ago',
    uptime: '99.2%',
    requestsTotal: 1890,
    requestsSuccess: 1850,
    requestsFailed: 40,
    avgLatency: '450ms',
  },
  {
    id: 'custom-hermes',
    name: 'Hermes Custom Server',
    description: 'Custom MCP server exposing Hermes-specific tools and resources.',
    version: '0.1.0',
    author: 'Hermes Team',
    category: 'custom',
    status: 'connected',
    icon: '◬',
    iconColor: '#d946ef',
    tags: ['hermes', 'custom', 'agents', 'memory', 'graph'],
    capabilities: ['agents', 'memory', 'graph', 'skills', 'workflows'],
    tools: [
      { name: 'get_agent_status', description: 'Get agent fleet status', inputSchema: { type: 'object', properties: {} } },
      { name: 'search_memory', description: 'Search knowledge graph', inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] } },
      { name: 'run_skill', description: 'Execute a skill', inputSchema: { type: 'object', properties: { skillId: { type: 'string' }, params: { type: 'object' } }, required: ['skillId'] } },
      { name: 'trigger_workflow', description: 'Trigger a workflow', inputSchema: { type: 'object', properties: { workflowId: { type: 'string' } }, required: ['workflowId'] } },
    ],
    resources: [
      { uri: 'hermes://agents', name: 'Agent Fleet', description: 'All agent statuses', mimeType: 'application/json' },
      { uri: 'hermes://memory', name: 'Knowledge Graph', description: 'Memory graph data', mimeType: 'application/json' },
      { uri: 'hermes://skills', name: 'Skills Registry', description: 'Installed skills', mimeType: 'application/json' },
    ],
    prompts: [
      { name: 'analyze_codebase', description: 'Analyze codebase with Hermes', arguments: { type: 'object', properties: { path: { type: 'string' } } } },
    ],
    transport: 'websocket',
    endpoint: 'ws://localhost:8765/mcp',
    config: { wsUrl: 'ws://localhost:8765/mcp', reconnect: true },
    installDate: '2026-07-01',
    lastUpdate: '2026-07-30',
    lastConnected: '1m ago',
    uptime: '99.9%',
    requestsTotal: 4560,
    requestsSuccess: 4520,
    requestsFailed: 40,
    avgLatency: '80ms',
  },
]

export interface MCPMarketplaceEntry {
  id: string
  name: string
  description: string
  version: string
  author: string
  category: MCPServer['category']
  icon: string
  iconColor: string
  tags: string[]
  downloads: number
  rating: number
  verified: boolean
  price: 'free' | 'paid'
}

export const MCP_MARKETPLACE: MCPMarketplaceEntry[] = [
  {
    id: 'aws',
    name: 'AWS Server',
    description: 'AWS service integration for EC2, S3, Lambda, DynamoDB, and more.',
    version: '1.0.0',
    author: 'AWS',
    category: 'api',
    icon: '☁',
    iconColor: '#FF9900',
    tags: ['aws', 'cloud', 'ec2', 's3', 'lambda'],
    downloads: 2340,
    rating: 4.6,
    verified: true,
    price: 'free',
  },
  {
    id: 'gcp',
    name: 'Google Cloud Server',
    description: 'GCP integration for Compute, Storage, BigQuery, and AI Platform.',
    version: '0.9.0',
    author: 'Google',
    category: 'api',
    icon: '☁',
    iconColor: '#4285F4',
    tags: ['gcp', 'cloud', 'bigquery', 'ai'],
    downloads: 1890,
    rating: 4.4,
    verified: true,
    price: 'free',
  },
  {
    id: 'azure',
    name: 'Azure Server',
    description: 'Microsoft Azure integration for VMs, Functions, Cosmos DB, and more.',
    version: '0.8.1',
    author: 'Microsoft',
    category: 'api',
    icon: '☁',
    iconColor: '#0078D4',
    tags: ['azure', 'cloud', 'functions', 'cosmosdb'],
    downloads: 1560,
    rating: 4.3,
    verified: true,
    price: 'free',
  },
  {
    id: 'mongodb',
    name: 'MongoDB Server',
    description: 'MongoDB database connector with aggregation and change streams.',
    version: '1.1.0',
    author: 'MongoDB',
    category: 'database',
    icon: '⬢',
    iconColor: '#47A248',
    tags: ['mongodb', 'database', 'nosql', 'aggregation'],
    downloads: 2100,
    rating: 4.5,
    verified: true,
    price: 'free',
  },
  {
    id: 'elasticsearch',
    name: 'Elasticsearch Server',
    description: 'Elasticsearch cluster management and search operations.',
    version: '0.7.0',
    author: 'Elastic',
    category: 'database',
    icon: '◉',
    iconColor: '#005571',
    tags: ['elasticsearch', 'search', 'logs', 'analytics'],
    downloads: 980,
    rating: 4.2,
    verified: true,
    price: 'free',
  },
  {
    id: 'docker',
    name: 'Docker Server',
    description: 'Docker container management for build, run, and orchestrate.',
    version: '0.6.0',
    author: 'Docker',
    category: 'tool',
    icon: '⬢',
    iconColor: '#2496ED',
    tags: ['docker', 'containers', 'orchestration', 'build'],
    downloads: 1750,
    rating: 4.4,
    verified: true,
    price: 'free',
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes Server',
    description: 'Kubernetes cluster management for deployments, pods, and services.',
    version: '0.5.0',
    author: 'CNCF',
    category: 'tool',
    icon: '⬢',
    iconColor: '#326CE5',
    tags: ['kubernetes', 'k8s', 'orchestration', 'deployments'],
    downloads: 1320,
    rating: 4.1,
    verified: true,
    price: 'free',
  },
  {
    id: 'prometheus',
    name: 'Prometheus Server',
    description: 'Prometheus metrics querying and alerting rules management.',
    version: '0.4.0',
    author: 'CNCF',
    category: 'tool',
    icon: '∿',
    iconColor: '#E6522C',
    tags: ['prometheus', 'metrics', 'monitoring', 'alerting'],
    downloads: 890,
    rating: 4.0,
    verified: true,
    price: 'free',
  },
]

export const MCP_NAV_LINKS: NavLink[] = [
  { id: 'mcp-overview', label: 'Overview', icon: '◎', group: 'self' },
  { id: 'mcp-servers', label: 'Servers', icon: '⬢', group: 'self' },
  { id: 'mcp-marketplace', label: 'Marketplace', icon: '⊕', group: 'self' },
  { id: 'mcp-tools', label: 'Tools Explorer', icon: '✦', group: 'self' },
  { id: 'mcp-settings', label: 'Settings', icon: '⚙', group: 'self' },
]