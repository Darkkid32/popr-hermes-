import { create } from 'zustand';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';
export type MetricUnit = 'req/s' | 'ms' | 'pct' | 'count' | 'bytes' | 'mb' | 'gb';

export interface MetricPoint {
  timestamp: string;
  value: number;
}

export interface Metric {
  id: string;
  name: string;
  type: MetricType;
  unit: MetricUnit;
  serviceId: string;
  current: number;
  min: number;
  max: number;
  avg: number;
  sparkline: MetricPoint[];
  status: 'healthy' | 'warning' | 'critical';
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  metricIds: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogSource = 'agent' | 'gateway' | 'database' | 'connector' | 'system';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: LogSource;
  service: string;
  message: string;
  traceId?: string;
  metadata?: Record<string, string>;
}

export type TraceStatus = 'ok' | 'error' | 'timeout' | 'cancelled';

export interface TraceSpan {
  id: string;
  parentId: string | null;
  name: string;
  service: string;
  duration: number;
  startOffset: number;
  status: TraceStatus;
}

export interface Trace {
  id: string;
  operation: string;
  service: string;
  duration: number;
  status: TraceStatus;
  timestamp: string;
  spans: TraceSpan[];
}

export type EventType = 'deploy' | 'config' | 'scale' | 'restart' | 'alert' | 'user' | 'system';

export interface ObsEvent {
  id: string;
  type: EventType;
  title: string;
  detail: string;
  service: string;
  timestamp: string;
  icon: string;
}

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertState = 'firing' | 'pending' | 'resolved' | 'silenced';

export interface Alert {
  id: string;
  name: string;
  severity: AlertSeverity;
  state: AlertState;
  service: string;
  metric: string;
  condition: string;
  firedAt: string;
  resolvedAt?: string;
  acknowledged: boolean;
}

export type IncidentStatus = 'open' | 'investigating' | 'identified' | 'monitoring' | 'resolved';
export type IncidentSeverity = 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4';

export interface IncidentUpdate {
  timestamp: string;
  status: IncidentStatus;
  message: string;
  author: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  service: string;
  createdAt: string;
  updatedAt: string;
  updates: IncidentUpdate[];
}

export type ServiceStatus = 'healthy' | 'degraded' | 'down' | 'maintenance';

export interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  region: string;
  version: string;
  uptime: number;
  latency: number;
  errorRate: number;
  requestRate: number;
  lastDeploy: string;
  dependencies: string[];
}

export type InfraType = 'compute' | 'storage' | 'network' | 'database' | 'cache';

export interface InfrastructureNode {
  id: string;
  name: string;
  type: InfraType;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  region: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: string;
}

export interface HealthCheck {
  id: string;
  service: string;
  endpoint: string;
  status: 'passing' | 'failing' | 'degraded';
  latency: number;
  lastChecked: string;
  consecutiveFails: number;
}

export type PerfMetric = 'latency' | 'throughput' | 'error_rate' | 'saturation';

export interface PerformanceSnapshot {
  id: string;
  service: string;
  timestamp: string;
  latencyP50: number;
  latencyP95: number;
  latencyP99: number;
  throughput: number;
  errorRate: number;
  saturation: number;
}

export interface CapacityPool {
  id: string;
  resource: string;
  allocated: number;
  used: number;
  unit: string;
  region: string;
  trend: 'up' | 'down' | 'stable';
  projectedDays: number;
}

export interface AnalyticsRecord {
  id: string;
  label: string;
  value: number;
  delta: number;
  deltaTone: 'up' | 'down' | 'neutral';
  period: string;
}

export interface ObservabilitySettings {
  retentionDays: number;
  samplingRate: number;
  alertNotifications: boolean;
  dashboardRefreshInterval: number;
  logLevel: LogLevel;
  tracingEnabled: boolean;
  metricsEnabled: boolean;
  autoResolveAlerts: boolean;
}

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */

const MOCK_METRICS: Metric[] = [
  { id: 'met1', name: 'Request Rate', type: 'counter', unit: 'req/s', serviceId: 'svc1', current: 1247, min: 340, max: 2100, avg: 1120, status: 'healthy', sparkline: [{ timestamp: '5m', value: 1180 }, { timestamp: '4m', value: 1210 }, { timestamp: '3m', value: 1250 }, { timestamp: '2m', value: 1240 }, { timestamp: '1m', value: 1247 }] },
  { id: 'met2', name: 'Latency P95', type: 'histogram', unit: 'ms', serviceId: 'svc1', current: 142, min: 80, max: 320, avg: 135, status: 'healthy', sparkline: [{ timestamp: '5m', value: 138 }, { timestamp: '4m', value: 135 }, { timestamp: '3m', value: 145 }, { timestamp: '2m', value: 140 }, { timestamp: '1m', value: 142 }] },
  { id: 'met3', name: 'Error Rate', type: 'counter', unit: 'pct', serviceId: 'svc1', current: 0.3, min: 0.1, max: 2.1, avg: 0.4, status: 'healthy', sparkline: [{ timestamp: '5m', value: 0.4 }, { timestamp: '4m', value: 0.3 }, { timestamp: '3m', value: 0.35 }, { timestamp: '2m', value: 0.28 }, { timestamp: '1m', value: 0.3 }] },
  { id: 'met4', name: 'CPU Usage', type: 'gauge', unit: 'pct', serviceId: 'svc1', current: 42, min: 18, max: 78, avg: 44, status: 'healthy', sparkline: [{ timestamp: '5m', value: 40 }, { timestamp: '4m', value: 41 }, { timestamp: '3m', value: 45 }, { timestamp: '2m', value: 43 }, { timestamp: '1m', value: 42 }] },
  { id: 'met5', name: 'Memory Usage', type: 'gauge', unit: 'pct', serviceId: 'svc1', current: 67, min: 45, max: 85, avg: 64, status: 'warning', sparkline: [{ timestamp: '5m', value: 62 }, { timestamp: '4m', value: 64 }, { timestamp: '3m', value: 65 }, { timestamp: '2m', value: 66 }, { timestamp: '1m', value: 67 }] },
  { id: 'met6', name: 'Request Rate', type: 'counter', unit: 'req/s', serviceId: 'svc2', current: 890, min: 200, max: 1500, avg: 810, status: 'healthy', sparkline: [{ timestamp: '5m', value: 850 }, { timestamp: '4m', value: 870 }, { timestamp: '3m', value: 885 }, { timestamp: '2m', value: 880 }, { timestamp: '1m', value: 890 }] },
  { id: 'met7', name: 'Latency P95', type: 'histogram', unit: 'ms', serviceId: 'svc2', current: 89, min: 30, max: 200, avg: 85, status: 'healthy', sparkline: [{ timestamp: '5m', value: 82 }, { timestamp: '4m', value: 85 }, { timestamp: '3m', value: 90 }, { timestamp: '2m', value: 87 }, { timestamp: '1m', value: 89 }] },
  { id: 'met8', name: 'Error Rate', type: 'counter', unit: 'pct', serviceId: 'svc2', current: 1.2, min: 0.2, max: 5.0, avg: 1.1, status: 'warning', sparkline: [{ timestamp: '5m', value: 0.9 }, { timestamp: '4m', value: 1.0 }, { timestamp: '3m', value: 1.1 }, { timestamp: '2m', value: 1.15 }, { timestamp: '1m', value: 1.2 }] },
  { id: 'met9', name: 'Throughput', type: 'counter', unit: 'req/s', serviceId: 'svc3', current: 340, min: 100, max: 600, avg: 310, status: 'healthy', sparkline: [{ timestamp: '5m', value: 320 }, { timestamp: '4m', value: 325 }, { timestamp: '3m', value: 335 }, { timestamp: '2m', value: 338 }, { timestamp: '1m', value: 340 }] },
  { id: 'met10', name: 'Latency P99', type: 'histogram', unit: 'ms', serviceId: 'svc4', current: 450, min: 200, max: 900, avg: 420, status: 'critical', sparkline: [{ timestamp: '5m', value: 380 }, { timestamp: '4m', value: 400 }, { timestamp: '3m', value: 420 }, { timestamp: '2m', value: 440 }, { timestamp: '1m', value: 450 }] },
];

const MOCK_DASHBOARDS: Dashboard[] = [
  { id: 'db1', name: 'Service Overview', description: 'Key metrics for all production services', metricIds: ['met1', 'met2', 'met3', 'met6', 'met7'], isDefault: true, createdAt: '2026-06-01', updatedAt: '2026-07-28' },
  { id: 'db2', name: 'Infrastructure', description: 'CPU, memory, disk, and network across all nodes', metricIds: ['met4', 'met5'], isDefault: false, createdAt: '2026-06-15', updatedAt: '2026-07-20' },
  { id: 'db3', name: 'Agent Runtime', description: 'Agent-specific metrics: throughput, latency, error rate', metricIds: ['met1', 'met2', 'met3', 'met9'], isDefault: false, createdAt: '2026-07-01', updatedAt: '2026-07-25' },
  { id: 'db4', name: 'Database Performance', description: 'Query latency, connection pool, slow queries', metricIds: ['met10'], isDefault: false, createdAt: '2026-07-10', updatedAt: '2026-07-28' },
];

const MOCK_LOGS: LogEntry[] = [
  { id: 'log1', timestamp: '18s ago', level: 'info', source: 'agent', service: 'hermes-agent', message: 'Workflow "Prompt to Production" started', traceId: 'tr-001' },
  { id: 'log2', timestamp: '42s ago', level: 'warn', source: 'gateway', service: 'api-gateway', message: 'Rate limit exceeded for key hrs_live_a1b2', metadata: { key: 'hrs_live_a1b2', limit: '100/min' } },
  { id: 'log3', timestamp: '1m ago', level: 'error', source: 'connector', service: 'openclaw-connector', message: 'Connector health check failed: timeout after 30s', traceId: 'tr-002', metadata: { target: 'connector/telegram' } },
  { id: 'log4', timestamp: '2m ago', level: 'info', source: 'system', service: 'deployment', message: 'Deploy v2.4.1 completed on staging-agentmesh', metadata: { version: 'v2.4.1', env: 'staging' } },
  { id: 'log5', timestamp: '3m ago', level: 'debug', source: 'agent', service: 'hermes-agent', message: 'Memory sync: 142 entities extracted, 38 updated', traceId: 'tr-003' },
  { id: 'log6', timestamp: '4m ago', level: 'info', source: 'database', service: 'postgres-primary', message: 'Checkpoint completed: 1.2GB WAL processed', metadata: { size: '1.2GB' } },
  { id: 'log7', timestamp: '5m ago', level: 'warn', source: 'system', service: 'kubernetes', message: 'Pod hermes-agent-7f4d8b restarted (OOMKilled)', metadata: { pod: 'hermes-agent-7f4d8b', reason: 'OOMKilled' } },
  { id: 'log8', timestamp: '6m ago', level: 'error', source: 'connector', service: 'telegram-bridge', message: 'Failed to send message: chat not found', traceId: 'tr-004', metadata: { chatId: '-1001234567' } },
  { id: 'log9', timestamp: '8m ago', level: 'info', source: 'agent', service: 'claude-code', message: 'Code review completed: 3 files changed, 0 issues', traceId: 'tr-005' },
  { id: 'log10', timestamp: '10m ago', level: 'info', source: 'gateway', service: 'api-gateway', message: 'Health check: all upstream services OK', metadata: { upstreams: '12' } },
  { id: 'log11', timestamp: '12m ago', level: 'debug', source: 'system', service: 'redis-cache', message: 'Cache hit ratio: 94.2% over last 5 minutes', metadata: { ratio: '94.2%' } },
  { id: 'log12', timestamp: '15m ago', level: 'info', source: 'agent', service: 'opencode', message: 'TypeScript build passed: 0 errors', traceId: 'tr-006' },
];

const MOCK_TRACES: Trace[] = [
  { id: 'tr-001', operation: 'workflow.execute', service: 'hermes-agent', duration: 3420, status: 'ok', timestamp: '18s ago', spans: [
    { id: 'sp1', parentId: null, name: 'workflow.execute', service: 'hermes-agent', duration: 3420, startOffset: 0, status: 'ok' },
    { id: 'sp2', parentId: 'sp1', name: 'llm.complete', service: 'hermes-agent', duration: 1800, startOffset: 100, status: 'ok' },
    { id: 'sp3', parentId: 'sp1', name: 'tool.call', service: 'claude-code', duration: 1200, startOffset: 2000, status: 'ok' },
    { id: 'sp4', parentId: 'sp1', name: 'db.write', service: 'postgres-primary', duration: 200, startOffset: 3300, status: 'ok' },
  ]},
  { id: 'tr-002', operation: 'connector.health', service: 'openclaw-connector', duration: 30012, status: 'timeout', timestamp: '1m ago', spans: [
    { id: 'sp5', parentId: null, name: 'connector.health', service: 'openclaw-connector', duration: 30012, startOffset: 0, status: 'timeout' },
    { id: 'sp6', parentId: 'sp5', name: 'http.get', service: 'openclaw-connector', duration: 30000, startOffset: 10, status: 'timeout' },
  ]},
  { id: 'tr-003', operation: 'memory.sync', service: 'hermes-agent', duration: 890, status: 'ok', timestamp: '3m ago', spans: [
    { id: 'sp7', parentId: null, name: 'memory.sync', service: 'hermes-agent', duration: 890, startOffset: 0, status: 'ok' },
    { id: 'sp8', parentId: 'sp7', name: 'llm.extract', service: 'hermes-agent', duration: 650, startOffset: 20, status: 'ok' },
    { id: 'sp9', parentId: 'sp7', name: 'graph.write', service: 'postgres-primary', duration: 180, startOffset: 700, status: 'ok' },
  ]},
  { id: 'tr-004', operation: 'message.send', service: 'telegram-bridge', duration: 450, status: 'error', timestamp: '6m ago', spans: [
    { id: 'sp10', parentId: null, name: 'message.send', service: 'telegram-bridge', duration: 450, startOffset: 0, status: 'error' },
    { id: 'sp11', parentId: 'sp10', name: 'http.post', service: 'telegram-bridge', duration: 440, startOffset: 5, status: 'error' },
  ]},
  { id: 'tr-005', operation: 'code.review', service: 'claude-code', duration: 12400, status: 'ok', timestamp: '9m ago', spans: [
    { id: 'sp12', parentId: null, name: 'code.review', service: 'claude-code', duration: 12400, startOffset: 0, status: 'ok' },
    { id: 'sp13', parentId: 'sp12', name: 'llm.analyze', service: 'claude-code', duration: 11000, startOffset: 100, status: 'ok' },
  ]},
];

const MOCK_EVENTS: ObsEvent[] = [
  { id: 'ev1', type: 'deploy', title: 'Staging deploy completed', detail: 'v2.4.1 deployed to staging-agentmesh', service: 'deployment', timestamp: '2m ago', icon: '🚀' },
  { id: 'ev2', type: 'scale', title: 'HPA scaled up', detail: 'hermes-agent replicas 3 → 5', service: 'kubernetes', timestamp: '5m ago', icon: '📈' },
  { id: 'ev3', type: 'alert', title: 'Memory pressure detected', detail: 'hermes-agent pod OOMKilled', service: 'kubernetes', timestamp: '7m ago', icon: '⚠️' },
  { id: 'ev4', type: 'config', title: 'Feature flag updated', detail: 'enable_v2_mesh = true', service: 'feature-flags', timestamp: '12m ago', icon: '⚙️' },
  { id: 'ev5', type: 'restart', title: 'Service restarted', detail: 'redis-cache restarted by health monitor', service: 'redis-cache', timestamp: '18m ago', icon: '🔄' },
  { id: 'ev6', type: 'user', title: 'API key rotated', detail: 'graphify-sync key rotated by Priya Raman', service: 'api-gateway', timestamp: '25m ago', icon: '🔑' },
  { id: 'ev7', type: 'deploy', title: 'Production deploy started', detail: 'v2.5.0 rolling out to prod', service: 'deployment', timestamp: '32m ago', icon: '🚀' },
  { id: 'ev8', type: 'system', title: 'Backup completed', detail: 'Database backup: 2.4GB compressed', service: 'postgres-primary', timestamp: '1h ago', icon: '💾' },
];

const MOCK_ALERTS: Alert[] = [
  { id: 'al1', name: 'HighLatencyP99', severity: 'critical', state: 'firing', service: 'postgres-primary', metric: 'Latency P99', condition: '> 400ms for 5m', firedAt: '8m ago', acknowledged: false },
  { id: 'al2', name: 'HighMemoryUsage', severity: 'medium', state: 'firing', service: 'hermes-agent', metric: 'Memory Usage', condition: '> 80% for 10m', firedAt: '12m ago', acknowledged: true },
  { id: 'al3', name: 'ConnectorTimeout', severity: 'high', state: 'firing', service: 'openclaw-connector', metric: 'Connector Health', condition: 'timeout > 30s', firedAt: '1m ago', acknowledged: false },
  { id: 'al4', name: 'HighErrorRate', severity: 'medium', state: 'resolved', service: 'telegram-bridge', metric: 'Error Rate', condition: '> 3% for 5m', firedAt: '20m ago', resolvedAt: '15m ago', acknowledged: false },
  { id: 'al5', name: 'DiskSpaceLow', severity: 'low', state: 'silenced', service: 'redis-cache', metric: 'Disk Usage', condition: '> 90%', firedAt: '2d ago', acknowledged: true },
  { id: 'al6', name: 'CertExpiringSoon', severity: 'low', state: 'pending', service: 'api-gateway', metric: 'Certificate Expiry', condition: '< 14 days', firedAt: '1h ago', acknowledged: false },
];

const MOCK_INCIDENTS: Incident[] = [
  { id: 'inc1', title: 'Agent Memory Pressure', severity: 'SEV2', status: 'investigating', service: 'hermes-agent', createdAt: '12m ago', updatedAt: '5m ago', updates: [
    { timestamp: '12m ago', status: 'open', message: 'OOMKilled event detected on hermes-agent pod', author: 'System' },
    { timestamp: '10m ago', status: 'investigating', message: 'HPA scaled replicas from 3 to 5 to absorb load', author: 'Alex Operator' },
    { timestamp: '5m ago', status: 'investigating', message: 'Monitoring memory trend; waiting for scale-up to stabilize', author: 'Alex Operator' },
  ]},
  { id: 'inc2', title: 'OpenClaw Connector Down', severity: 'SEV3', status: 'identified', service: 'openclaw-connector', createdAt: '3m ago', updatedAt: '1m ago', updates: [
    { timestamp: '3m ago', status: 'open', message: 'Connector health check timing out consistently', author: 'System' },
    { timestamp: '1m ago', status: 'identified', message: 'Upstream Telegram API rate limiting; implementing backoff', author: 'Vikram Joshi' },
  ]},
  { id: 'inc3', title: 'PostgreSQL Slow Queries', severity: 'SEV2', status: 'monitoring', service: 'postgres-primary', createdAt: '45m ago', updatedAt: '20m ago', updates: [
    { timestamp: '45m ago', status: 'open', message: 'P99 latency exceeded 400ms threshold', author: 'System' },
    { timestamp: '30m ago', status: 'investigating', message: 'Identified missing index on events table', author: 'Meera Krishnan' },
    { timestamp: '20m ago', status: 'monitoring', message: 'Index created; latency returning to baseline', author: 'Meera Krishnan' },
  ]},
];

const MOCK_SERVICES: Service[] = [
  { id: 'svc1', name: 'hermes-agent', description: 'Local-first agent orchestration runtime', status: 'degraded', region: 'ap-south-1', version: 'v2.5.0', uptime: 99.92, latency: 142, errorRate: 0.3, requestRate: 1247, lastDeploy: '32m ago', dependencies: ['svc3', 'svc5', 'svc6'] },
  { id: 'svc2', name: 'api-gateway', description: 'Unified API surface for all agents and tools', status: 'healthy', region: 'ap-south-1', version: 'v3.1.2', uptime: 99.98, latency: 89, errorRate: 1.2, requestRate: 890, lastDeploy: '2d ago', dependencies: ['svc1', 'svc3'] },
  { id: 'svc3', name: 'postgres-primary', description: 'Primary relational database for all services', status: 'degraded', region: 'ap-south-1', version: 'v16.3', uptime: 99.95, latency: 450, errorRate: 0.1, requestRate: 340, lastDeploy: '14d ago', dependencies: [] },
  { id: 'svc4', name: 'claude-code', description: 'Deep engineering agent runtime', status: 'healthy', region: 'us-east-1', version: 'v1.8.0', uptime: 99.99, latency: 35, errorRate: 0.05, requestRate: 210, lastDeploy: '1d ago', dependencies: ['svc2'] },
  { id: 'svc5', name: 'redis-cache', description: 'In-memory cache for sessions and hot data', status: 'healthy', region: 'ap-south-1', version: 'v7.2.4', uptime: 100.0, latency: 2, errorRate: 0, requestRate: 4500, lastDeploy: '30d ago', dependencies: [] },
  { id: 'svc6', name: 'openclaw-connector', description: 'Cloud execution surface and external connectors', status: 'down', region: 'ap-south-1', version: 'v2.1.0', uptime: 98.5, latency: 320, errorRate: 5.2, requestRate: 180, lastDeploy: '5d ago', dependencies: ['svc2', 'svc5'] },
  { id: 'svc7', name: 'telegram-bridge', description: 'Telegram bot messaging integration', status: 'degraded', region: 'ap-south-1', version: 'v1.4.2', uptime: 99.7, latency: 450, errorRate: 0.8, requestRate: 320, lastDeploy: '7d ago', dependencies: ['svc2'] },
  { id: 'svc8', name: 'graphify-neo4j', description: 'Knowledge graph engine', status: 'healthy', region: 'us-east-1', version: 'v5.22', uptime: 99.99, latency: 12, errorRate: 0, requestRate: 150, lastDeploy: '21d ago', dependencies: [] },
];

const MOCK_INFRA: InfrastructureNode[] = [
  { id: 'inf1', name: 'prod-node-1', type: 'compute', status: 'healthy', region: 'ap-south-1', cpu: 42, memory: 67, disk: 34, network: 58, uptime: '45d' },
  { id: 'inf2', name: 'prod-node-2', type: 'compute', status: 'healthy', region: 'ap-south-1', cpu: 38, memory: 55, disk: 29, network: 42, uptime: '45d' },
  { id: 'inf3', name: 'staging-node-1', type: 'compute', status: 'warning', region: 'ap-south-1', cpu: 78, memory: 82, disk: 61, network: 71, uptime: '12d' },
  { id: 'inf4', name: 'prod-db-primary', type: 'database', status: 'healthy', region: 'ap-south-1', cpu: 25, memory: 72, disk: 45, network: 30, uptime: '120d' },
  { id: 'inf5', name: 'prod-db-replica', type: 'database', status: 'healthy', region: 'us-east-1', cpu: 18, memory: 68, disk: 45, network: 25, uptime: '120d' },
  { id: 'inf6', name: 'prod-redis-1', type: 'cache', status: 'healthy', region: 'ap-south-1', cpu: 12, memory: 45, disk: 10, network: 80, uptime: '90d' },
  { id: 'inf7', name: 'prod-s3-bucket', type: 'storage', status: 'healthy', region: 'ap-south-1', cpu: 0, memory: 0, disk: 62, network: 15, uptime: '365d' },
  { id: 'inf8', name: 'prod-lb', type: 'network', status: 'healthy', region: 'ap-south-1', cpu: 8, memory: 15, disk: 0, network: 88, uptime: '120d' },
];

const MOCK_HEALTH: HealthCheck[] = [
  { id: 'hc1', service: 'hermes-agent', endpoint: '/health', status: 'passing', latency: 12, lastChecked: '18s ago', consecutiveFails: 0 },
  { id: 'hc2', service: 'api-gateway', endpoint: '/health', status: 'passing', latency: 5, lastChecked: '18s ago', consecutiveFails: 0 },
  { id: 'hc3', service: 'postgres-primary', endpoint: '/health', status: 'passing', latency: 3, lastChecked: '18s ago', consecutiveFails: 0 },
  { id: 'hc4', service: 'claude-code', endpoint: '/health', status: 'passing', latency: 8, lastChecked: '18s ago', consecutiveFails: 0 },
  { id: 'hc5', service: 'redis-cache', endpoint: '/health', status: 'passing', latency: 1, lastChecked: '18s ago', consecutiveFails: 0 },
  { id: 'hc6', service: 'openclaw-connector', endpoint: '/health', status: 'failing', latency: 30000, lastChecked: '18s ago', consecutiveFails: 12 },
  { id: 'hc7', service: 'telegram-bridge', endpoint: '/health', status: 'degraded', latency: 2500, lastChecked: '18s ago', consecutiveFails: 3 },
  { id: 'hc8', service: 'graphify-neo4j', endpoint: '/health', status: 'passing', latency: 4, lastChecked: '18s ago', consecutiveFails: 0 },
];

const MOCK_PERFORMANCE: PerformanceSnapshot[] = [
  { id: 'ps1', service: 'hermes-agent', timestamp: '5m ago', latencyP50: 85, latencyP95: 142, latencyP99: 380, throughput: 1247, errorRate: 0.3, saturation: 42 },
  { id: 'ps2', service: 'api-gateway', timestamp: '5m ago', latencyP50: 32, latencyP95: 89, latencyP99: 210, throughput: 890, errorRate: 1.2, saturation: 28 },
  { id: 'ps3', service: 'postgres-primary', timestamp: '5m ago', latencyP50: 15, latencyP95: 450, latencyP99: 890, throughput: 340, errorRate: 0.1, saturation: 25 },
  { id: 'ps4', service: 'claude-code', timestamp: '5m ago', latencyP50: 18, latencyP95: 35, latencyP99: 85, throughput: 210, errorRate: 0.05, saturation: 15 },
  { id: 'ps5', service: 'redis-cache', timestamp: '5m ago', latencyP50: 1, latencyP95: 2, latencyP99: 5, throughput: 4500, errorRate: 0, saturation: 12 },
  { id: 'ps6', service: 'openclaw-connector', timestamp: '5m ago', latencyP50: 120, latencyP95: 320, latencyP99: 4500, throughput: 180, errorRate: 5.2, saturation: 65 },
];

const MOCK_CAPACITY: CapacityPool[] = [
  { id: 'cp1', resource: 'CPU Cores', allocated: 32, used: 14, unit: 'cores', region: 'ap-south-1', trend: 'stable', projectedDays: 180 },
  { id: 'cp2', resource: 'Memory', allocated: 128, used: 82, unit: 'GB', region: 'ap-south-1', trend: 'up', projectedDays: 95 },
  { id: 'cp3', resource: 'Disk', allocated: 2048, used: 890, unit: 'GB', region: 'ap-south-1', trend: 'up', projectedDays: 240 },
  { id: 'cp4', resource: 'Network Bandwidth', allocated: 10000, used: 5800, unit: 'Mbps', region: 'ap-south-1', trend: 'stable', projectedDays: 365 },
  { id: 'cp5', resource: 'API Connections', allocated: 5000, used: 3200, unit: 'connections', region: 'ap-south-1', trend: 'up', projectedDays: 120 },
  { id: 'cp6', resource: 'Database Connections', allocated: 200, used: 142, unit: 'connections', region: 'ap-south-1', trend: 'stable', projectedDays: 365 },
];

const MOCK_ANALYTICS: AnalyticsRecord[] = [
  { id: 'an1', label: 'Total Requests (24h)', value: 284750, delta: 12, deltaTone: 'up', period: 'last 24h' },
  { id: 'an2', label: 'Avg Latency (24h)', value: 98, delta: -5, deltaTone: 'down', period: 'last 24h' },
  { id: 'an3', label: 'Error Budget Remaining', value: 87, delta: -3, deltaTone: 'down', period: 'this month' },
  { id: 'an4', label: 'SLA Compliance', value: 99.94, delta: 0.01, deltaTone: 'up', period: 'this month' },
  { id: 'an5', label: 'Active Incidents', value: 2, delta: 1, deltaTone: 'up', period: 'current' },
  { id: 'an6', label: 'MTTR', value: 24, delta: -8, deltaTone: 'down', period: 'last 7 days' },
  { id: 'an7', label: 'Deploy Frequency', value: 4.2, delta: 0.8, deltaTone: 'up', period: 'last 7 days' },
  { id: 'an8', label: 'Change Failure Rate', value: 2.1, delta: -1.2, deltaTone: 'down', period: 'last 30 days' },
];

const DEFAULT_SETTINGS: ObservabilitySettings = {
  retentionDays: 30,
  samplingRate: 10,
  alertNotifications: true,
  dashboardRefreshInterval: 30,
  logLevel: 'info',
  tracingEnabled: true,
  metricsEnabled: true,
  autoResolveAlerts: false,
};

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

interface ObservabilityState {
  metrics: Metric[];
  dashboards: Dashboard[];
  logs: LogEntry[];
  traces: Trace[];
  events: ObsEvent[];
  alerts: Alert[];
  incidents: Incident[];
  services: Service[];
  infrastructure: InfrastructureNode[];
  health: HealthCheck[];
  performance: PerformanceSnapshot[];
  capacity: CapacityPool[];
  analytics: AnalyticsRecord[];
  settings: ObservabilitySettings;

  // Selectors
  metricById: (id: string) => Metric | undefined;
  metricsByService: (serviceId: string) => Metric[];
  dashboardById: (id: string) => Dashboard | undefined;
  serviceById: (id: string) => Service | undefined;
  firingAlerts: () => Alert[];
  openIncidents: () => Incident[];
  healthyServices: () => number;
  degradedServices: () => number;
  downServices: () => number;
  healthByService: (service: string) => HealthCheck[];
  infraByType: (type: InfraType) => InfrastructureNode[];
  logsByLevel: (level: LogLevel) => LogEntry[];
  logsByService: (service: string) => LogEntry[];
  tracesByService: (service: string) => Trace[];
  tracesByStatus: (status: TraceStatus) => Trace[];

  // Actions
  ackAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  silenceAlert: (id: string) => void;
  addIncidentUpdate: (incidentId: string, update: Omit<IncidentUpdate, 'timestamp'>) => void;
  resolveIncident: (incidentId: string) => void;
  updateSettings: (patch: Partial<ObservabilitySettings>) => void;
  logEvent: (event: Omit<ObsEvent, 'id' | 'timestamp'>) => void;
  resetObservability: () => void;
}

export const useObservabilityStore = create<ObservabilityState>((set, get) => ({
  metrics: MOCK_METRICS,
  dashboards: MOCK_DASHBOARDS,
  logs: MOCK_LOGS,
  traces: MOCK_TRACES,
  events: MOCK_EVENTS,
  alerts: MOCK_ALERTS,
  incidents: MOCK_INCIDENTS,
  services: MOCK_SERVICES,
  infrastructure: MOCK_INFRA,
  health: MOCK_HEALTH,
  performance: MOCK_PERFORMANCE,
  capacity: MOCK_CAPACITY,
  analytics: MOCK_ANALYTICS,
  settings: DEFAULT_SETTINGS,

  metricById: (id) => get().metrics.find((m) => m.id === id),
  metricsByService: (serviceId) => get().metrics.filter((m) => m.serviceId === serviceId),
  dashboardById: (id) => get().dashboards.find((d) => d.id === id),
  serviceById: (id) => get().services.find((s) => s.id === id),
  firingAlerts: () => get().alerts.filter((a) => a.state === 'firing'),
  openIncidents: () => get().incidents.filter((i) => i.status !== 'resolved'),
  healthyServices: () => get().services.filter((s) => s.status === 'healthy').length,
  degradedServices: () => get().services.filter((s) => s.status === 'degraded').length,
  downServices: () => get().services.filter((s) => s.status === 'down').length,
  healthByService: (service) => get().health.filter((h) => h.service === service),
  infraByType: (type) => get().infrastructure.filter((n) => n.type === type),
  logsByLevel: (level) => get().logs.filter((l) => l.level === level),
  logsByService: (service) => get().logs.filter((l) => l.service === service),
  tracesByService: (service) => get().traces.filter((t) => t.service === service),
  tracesByStatus: (status) => get().traces.filter((t) => t.status === status),

  ackAlert: (id) => {
    set((s) => ({
      alerts: s.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    }));
  },

  resolveAlert: (id) => {
    set((s) => ({
      alerts: s.alerts.map((a) =>
        a.id === id
          ? { ...a, state: 'resolved', resolvedAt: 'just now' }
          : a
      ),
    }));
  },

  silenceAlert: (id) => {
    set((s) => ({
      alerts: s.alerts.map((a) => (a.id === id ? { ...a, state: 'silenced' } : a)),
    }));
  },

  addIncidentUpdate: (incidentId, update) => {
    const entry: IncidentUpdate = {
      ...update,
      timestamp: 'just now',
    };
    set((s) => ({
      incidents: s.incidents.map((i) =>
        i.id === incidentId
          ? { ...i, status: update.status, updatedAt: 'just now', updates: [...i.updates, entry] }
          : i
      ),
    }));
  },

  resolveIncident: (incidentId) => {
    set((s) => ({
      incidents: s.incidents.map((i) =>
        i.id === incidentId
          ? { ...i, status: 'resolved', updatedAt: 'just now' }
          : i
      ),
    }));
  },

  updateSettings: (patch) => {
    set((s) => ({ settings: { ...s.settings, ...patch } }));
  },

  logEvent: (event) => {
    const entry: ObsEvent = {
      ...event,
      id: `ev${Date.now()}`,
      timestamp: 'just now',
    };
    set((s) => ({ events: [entry, ...s.events].slice(0, 60) }));
  },

  resetObservability: () => {
    set({
      metrics: MOCK_METRICS,
      dashboards: MOCK_DASHBOARDS,
      logs: MOCK_LOGS,
      traces: MOCK_TRACES,
      events: MOCK_EVENTS,
      alerts: MOCK_ALERTS,
      incidents: MOCK_INCIDENTS,
      services: MOCK_SERVICES,
      infrastructure: MOCK_INFRA,
      health: MOCK_HEALTH,
      performance: MOCK_PERFORMANCE,
      capacity: MOCK_CAPACITY,
      analytics: MOCK_ANALYTICS,
      settings: DEFAULT_SETTINGS,
    });
  },
}));
