import { create } from 'zustand';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type WorkflowStatus = 'active' | 'draft' | 'paused' | 'archived';
export type WorkflowCategory = 'deploy' | 'data' | 'ops' | 'ai' | 'integration' | 'custom';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: WorkflowCategory;
  status: WorkflowStatus;
  triggerId: string;
  actionIds: string[];
  executionsCount: number;
  successRate: number;
  avgDuration: number;
  lastRun: string;
  updatedAt: string;
  version: number;
}

export type TriggerType = 'schedule' | 'webhook' | 'event' | 'file' | 'manual' | 'http';

export interface WorkflowTrigger {
  id: string;
  name: string;
  type: TriggerType;
  config: string;
  enabled: boolean;
  lastFired: string;
  fireCount: number;
  workflowIds: string[];
}

export type ActionType = 'http' | 'transform' | 'notify' | 'database' | 'ai' | 'branch' | 'code' | 'delay';

export interface WorkflowAction {
  id: string;
  name: string;
  type: ActionType;
  description: string;
  icon: string;
  inputCount: number;
  outputCount: number;
  usageCount: number;
  color: string;
}

export type ExecutionStatus = 'running' | 'success' | 'failed' | 'cancelled' | 'pending';

export interface ExecutionStep {
  id: string;
  actionId: string;
  actionName: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  durationMs: number;
  startedAt: string;
}

export interface Execution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: ExecutionStatus;
  trigger: TriggerType;
  startedAt: string;
  finishedAt?: string;
  durationMs: number;
  initiatedBy: string;
  steps: ExecutionStep[];
}

export type ScheduleStatus = 'active' | 'paused' | 'disabled';
export type ScheduleFreq = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'cron';

export interface Schedule {
  id: string;
  name: string;
  workflowId: string;
  frequency: ScheduleFreq;
  cronExpression: string;
  timezone: string;
  nextRun: string;
  lastRun: string;
  status: ScheduleStatus;
  enabled: boolean;
}

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface Job {
  id: string;
  name: string;
  workflowId: string;
  status: JobStatus;
  priority: 'high' | 'normal' | 'low';
  queuedAt: string;
  startedAt?: string;
  finishedAt?: string;
  attempts: number;
  maxAttempts: number;
  owner: string;
}

export type QueueStatus = 'healthy' | 'degraded' | 'backed-up' | 'empty';

export interface Queue {
  id: string;
  name: string;
  status: QueueStatus;
  depth: number;
  throughput: number;
  lag: number;
  oldestAge: string;
  consumers: number;
  processed24h: number;
  failed24h: number;
}

export type TemplateCategory = 'starter' | 'deploy' | 'data' | 'ops' | 'ai' | 'integration';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  steps: number;
  uses: number;
  rating: number;
  createdAt: string;
  tags: string[];
}

export interface Variable {
  id: string;
  name: string;
  value: string;
  environment: 'production' | 'staging' | 'development' | 'all';
  description: string;
  sensitive: boolean;
  updatedAt: string;
  usedBy: string[];
}

export interface AutomationSecret {
  id: string;
  name: string;
  reference: string;
  environment: 'production' | 'staging' | 'development' | 'all';
  rotationDays: number;
  lastRotated: string;
  status: 'ok' | 'expiring' | 'overdue';
  owner: string;
}

export interface AutomationAnalyticsRecord {
  id: string;
  label: string;
  value: number;
  delta: number;
  deltaTone: 'up' | 'down' | 'neutral';
  period: string;
}

export interface AutomationSettings {
  maxConcurrentExecutions: number;
  defaultTimeoutSec: number;
  maxRetries: number;
  retryBackoffMs: number;
  notificationsEnabled: boolean;
  notifyOnFailure: boolean;
  notifyOnSuccess: boolean;
  auditTrailEnabled: boolean;
  executionRetentionDays: number;
  variableEncryptionEnabled: boolean;
  webhookSecretEnabled: boolean;
  scheduleTimezone: string;
}

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */

const MOCK_WORKFLOWS: Workflow[] = [
  { id: 'wf1', name: 'Nightly Backup', description: 'Back up databases and artifacts to object storage.', category: 'data', status: 'active', triggerId: 'trg1', actionIds: ['act1', 'act2'], executionsCount: 342, successRate: 99.1, avgDuration: 840, lastRun: '18m ago', updatedAt: '2d ago', version: 4 },
  { id: 'wf2', name: 'Deploy to Staging', description: 'Build, test, and deploy the agentos-ui to staging.', category: 'deploy', status: 'active', triggerId: 'trg2', actionIds: ['act1', 'act3', 'act4'], executionsCount: 128, successRate: 96.8, avgDuration: 1240, lastRun: '32m ago', updatedAt: '5d ago', version: 7 },
  { id: 'wf3', name: 'Alert Onboarding', description: 'Notify the on-call rotation when a new alert fires.', category: 'ops', status: 'active', triggerId: 'trg3', actionIds: ['act5', 'act6'], executionsCount: 89, successRate: 100, avgDuration: 120, lastRun: '6m ago', updatedAt: '1w ago', version: 2 },
  { id: 'wf4', name: 'Weekly Report', description: 'Aggregate metrics and email the weekly report.', category: 'data', status: 'paused', triggerId: 'trg4', actionIds: ['act7', 'act5', 'act8'], executionsCount: 64, successRate: 98.4, avgDuration: 460, lastRun: '3d ago', updatedAt: '2w ago', version: 3 },
  { id: 'wf5', name: 'Model Retraining', description: 'Retrain the intent classifier with new examples.', category: 'ai', status: 'draft', triggerId: 'trg5', actionIds: ['act9', 'act7'], executionsCount: 0, successRate: 0, avgDuration: 0, lastRun: 'Never', updatedAt: '4d ago', version: 1 },
  { id: 'wf6', name: 'User Sync', description: 'Sync users from the identity provider to all tools.', category: 'integration', status: 'active', triggerId: 'trg6', actionIds: ['act3', 'act2', 'act8'], executionsCount: 512, successRate: 99.6, avgDuration: 210, lastRun: '2h ago', updatedAt: '3d ago', version: 5 },
  { id: 'wf7', name: 'Onboarding Playbook', description: 'Provision workspace, credentials, and welcome message.', category: 'custom', status: 'archived', triggerId: 'trg7', actionIds: ['act10', 'act2', 'act5'], executionsCount: 22, successRate: 95.5, avgDuration: 380, lastRun: '30d ago', updatedAt: '30d ago', version: 2 },
];

const MOCK_TRIGGERS: WorkflowTrigger[] = [
  { id: 'trg1', name: 'Daily at 02:00', type: 'schedule', config: 'cron: 0 2 * * *', enabled: true, lastFired: '18m ago', fireCount: 342, workflowIds: ['wf1'] },
  { id: 'trg2', name: 'Push to main', type: 'event', config: 'repo: agentos-ui, branch: main', enabled: true, lastFired: '32m ago', fireCount: 128, workflowIds: ['wf2'] },
  { id: 'trg3', name: 'Alert fired', type: 'event', config: 'source: prometheus, severity: >= high', enabled: true, lastFired: '6m ago', fireCount: 89, workflowIds: ['wf3'] },
  { id: 'trg4', name: 'Monday 09:00', type: 'schedule', config: 'cron: 0 9 * * 1', enabled: false, lastFired: '3d ago', fireCount: 64, workflowIds: ['wf4'] },
  { id: 'trg5', name: 'New training data', type: 'file', config: 'bucket: training-data, prefix: new/', enabled: true, lastFired: 'Never', fireCount: 0, workflowIds: ['wf5'] },
  { id: 'trg6', name: 'User updated', type: 'webhook', config: 'POST /hooks/user-sync', enabled: true, lastFired: '2h ago', fireCount: 512, workflowIds: ['wf6'] },
  { id: 'trg7', name: 'Manual launch', type: 'manual', config: 'console: Run now', enabled: true, lastFired: '30d ago', fireCount: 22, workflowIds: ['wf7'] },
];

const MOCK_ACTIONS: WorkflowAction[] = [
  { id: 'act1', name: 'HTTP Request', type: 'http', description: 'Send an HTTP request to any endpoint.', icon: '🌐', inputCount: 4, outputCount: 1, usageCount: 214, color: 'var(--color-brand-500)' },
  { id: 'act2', name: 'Transform Data', type: 'transform', description: 'Map, filter, and reshape data with JSONata.', icon: '🔧', inputCount: 2, outputCount: 2, usageCount: 187, color: 'var(--color-accent-cyan-500)' },
  { id: 'act3', name: 'Run Shell', type: 'code', description: 'Execute a shell command or script.', icon: '💻', inputCount: 2, outputCount: 1, usageCount: 156, color: 'var(--color-status-warning)' },
  { id: 'act4', name: 'Notify Slack', type: 'notify', description: 'Post a message to a Slack channel.', icon: '💬', inputCount: 3, outputCount: 0, usageCount: 98, color: 'var(--color-status-info)' },
  { id: 'act5', name: 'Send Email', type: 'notify', description: 'Send an email via SMTP.', icon: '📧', inputCount: 3, outputCount: 0, usageCount: 76, color: 'var(--color-status-info)' },
  { id: 'act6', name: 'Conditional Branch', type: 'branch', description: 'Route execution based on a condition.', icon: '🔀', inputCount: 3, outputCount: 2, usageCount: 64, color: 'var(--color-accent-cyan-500)' },
  { id: 'act7', name: 'Query Database', type: 'database', description: 'Run a SQL query against a database.', icon: '🗄️', inputCount: 3, outputCount: 1, usageCount: 132, color: 'var(--color-status-success)' },
  { id: 'act8', name: 'Wait / Delay', type: 'delay', description: 'Pause execution for a duration.', icon: '⏳', inputCount: 1, outputCount: 0, usageCount: 41, color: 'var(--color-text-tertiary)' },
  { id: 'act9', name: 'AI Completion', type: 'ai', description: 'Call an LLM for text generation.', icon: '🧠', inputCount: 3, outputCount: 1, usageCount: 58, color: 'var(--color-brand-500)' },
  { id: 'act10', name: 'Create Workspace', type: 'http', description: 'Provision a new workspace via API.', icon: '🏗️', inputCount: 4, outputCount: 1, usageCount: 22, color: 'var(--color-status-warning)' },
];

const MOCK_EXECUTIONS: Execution[] = [
  { id: 'ex1', workflowId: 'wf3', workflowName: 'Alert Onboarding', status: 'running', trigger: 'event', startedAt: '6m ago', durationMs: 45000, initiatedBy: 'prometheus', steps: [
    { id: 'es1', actionId: 'act5', actionName: 'Send Email', status: 'success', durationMs: 1200, startedAt: '6m ago' },
    { id: 'es2', actionId: 'act6', actionName: 'Conditional Branch', status: 'running', durationMs: 300, startedAt: '5m ago' },
  ]},
  { id: 'ex2', workflowId: 'wf1', workflowName: 'Nightly Backup', status: 'success', trigger: 'schedule', startedAt: '18m ago', finishedAt: '16m ago', durationMs: 840000, initiatedBy: 'scheduler', steps: [
    { id: 'es3', actionId: 'act1', actionName: 'HTTP Request', status: 'success', durationMs: 420000, startedAt: '18m ago' },
    { id: 'es4', actionId: 'act2', actionName: 'Transform Data', status: 'success', durationMs: 380000, startedAt: '11m ago' },
  ]},
  { id: 'ex3', workflowId: 'wf2', workflowName: 'Deploy to Staging', status: 'failed', trigger: 'event', startedAt: '32m ago', finishedAt: '31m ago', durationMs: 1240000, initiatedBy: 'github', steps: [
    { id: 'es5', actionId: 'act1', actionName: 'HTTP Request', status: 'success', durationMs: 300000, startedAt: '32m ago' },
    { id: 'es6', actionId: 'act3', actionName: 'Run Shell', status: 'failed', durationMs: 940000, startedAt: '27m ago' },
  ]},
  { id: 'ex4', workflowId: 'wf6', workflowName: 'User Sync', status: 'success', trigger: 'webhook', startedAt: '2h ago', finishedAt: '2h ago', durationMs: 210000, initiatedBy: 'idp', steps: [
    { id: 'es7', actionId: 'act3', actionName: 'Run Shell', status: 'success', durationMs: 150000, startedAt: '2h ago' },
    { id: 'es8', actionId: 'act2', actionName: 'Transform Data', status: 'success', durationMs: 30000, startedAt: '2h ago' },
    { id: 'es9', actionId: 'act8', actionName: 'Wait / Delay', status: 'success', durationMs: 30000, startedAt: '2h ago' },
  ]},
  { id: 'ex5', workflowId: 'wf4', workflowName: 'Weekly Report', status: 'cancelled', trigger: 'schedule', startedAt: '3d ago', finishedAt: '3d ago', durationMs: 150000, initiatedBy: 'alex', steps: [
    { id: 'es10', actionId: 'act7', actionName: 'Query Database', status: 'skipped', durationMs: 0, startedAt: '3d ago' },
  ]},
  { id: 'ex6', workflowId: 'wf1', workflowName: 'Nightly Backup', status: 'success', trigger: 'schedule', startedAt: '1d ago', finishedAt: '1d ago', durationMs: 830000, initiatedBy: 'scheduler', steps: [
    { id: 'es11', actionId: 'act1', actionName: 'HTTP Request', status: 'success', durationMs: 410000, startedAt: '1d ago' },
    { id: 'es12', actionId: 'act2', actionName: 'Transform Data', status: 'success', durationMs: 370000, startedAt: '1d ago' },
  ]},
];

const MOCK_SCHEDULES: Schedule[] = [
  { id: 'sch1', name: 'Nightly Backup', workflowId: 'wf1', frequency: 'daily', cronExpression: '0 2 * * *', timezone: 'UTC', nextRun: 'in 9h 42m', lastRun: '18m ago', status: 'active', enabled: true },
  { id: 'sch2', name: 'Deploy Trigger', workflowId: 'wf2', frequency: 'cron', cronExpression: '@every 30m', timezone: 'UTC', nextRun: 'in 22m', lastRun: '32m ago', status: 'active', enabled: true },
  { id: 'sch3', name: 'Weekly Report', workflowId: 'wf4', frequency: 'weekly', cronExpression: '0 9 * * 1', timezone: 'Asia/Kolkata', nextRun: 'in 5d', lastRun: '3d ago', status: 'paused', enabled: false },
  { id: 'sch4', name: 'User Sync', workflowId: 'wf6', frequency: 'hourly', cronExpression: '0 * * * *', timezone: 'UTC', nextRun: 'in 47m', lastRun: '2h ago', status: 'active', enabled: true },
  { id: 'sch5', name: 'Monthly Billing', workflowId: 'wf7', frequency: 'monthly', cronExpression: '0 0 1 * *', timezone: 'UTC', nextRun: 'in 29d', lastRun: '30d ago', status: 'disabled', enabled: false },
];

const MOCK_JOBS: Job[] = [
  { id: 'job1', name: 'Backup: postgres-primary', workflowId: 'wf1', status: 'running', priority: 'high', queuedAt: '2m ago', startedAt: '1m ago', attempts: 1, maxAttempts: 3, owner: 'scheduler' },
  { id: 'job2', name: 'Sync: IdP users batch 3', workflowId: 'wf6', status: 'queued', priority: 'normal', queuedAt: '30s ago', attempts: 0, maxAttempts: 3, owner: 'idp' },
  { id: 'job3', name: 'Report: weekly metrics', workflowId: 'wf4', status: 'queued', priority: 'low', queuedAt: '5m ago', attempts: 0, maxAttempts: 2, owner: 'alex' },
  { id: 'job4', name: 'Deploy: staging build 214', workflowId: 'wf2', status: 'failed', priority: 'high', queuedAt: '1h ago', startedAt: '1h ago', finishedAt: '1h ago', attempts: 2, maxAttempts: 3, owner: 'github' },
  { id: 'job5', name: 'Alert: notify on-call', workflowId: 'wf3', status: 'completed', priority: 'high', queuedAt: '7m ago', startedAt: '6m ago', finishedAt: '6m ago', attempts: 1, maxAttempts: 2, owner: 'prometheus' },
  { id: 'job6', name: 'Backup: redis dump', workflowId: 'wf1', status: 'completed', priority: 'normal', queuedAt: '25m ago', startedAt: '24m ago', finishedAt: '20m ago', attempts: 1, maxAttempts: 3, owner: 'scheduler' },
];

const MOCK_QUEUES: Queue[] = [
  { id: 'q1', name: 'default', status: 'healthy', depth: 3, throughput: 12.4, lag: 40, oldestAge: '2s', consumers: 4, processed24h: 28450, failed24h: 12 },
  { id: 'q2', name: 'deployments', status: 'healthy', depth: 1, throughput: 1.2, lag: 1500, oldestAge: '12s', consumers: 2, processed24h: 3120, failed24h: 8 },
  { id: 'q3', name: 'notifications', status: 'healthy', depth: 12, throughput: 45.1, lag: 80, oldestAge: '500ms', consumers: 6, processed24h: 89200, failed24h: 3 },
  { id: 'q4', name: 'ai-tasks', status: 'degraded', depth: 45, throughput: 3.2, lag: 12000, oldestAge: '3m', consumers: 2, processed24h: 4800, failed24h: 21 },
  { id: 'q5', name: 'retry', status: 'empty', depth: 0, throughput: 0, lag: 0, oldestAge: '—', consumers: 1, processed24h: 410, failed24h: 410 },
  { id: 'q6', name: 'data-pipeline', status: 'backed-up', depth: 210, throughput: 8.1, lag: 60000, oldestAge: '8m', consumers: 3, processed24h: 15200, failed24h: 34 },
];

const MOCK_TEMPLATES: Template[] = [
  { id: 'tpl1', name: 'Database Backup', description: 'Scheduled backup with retention and verification.', category: 'data', steps: 4, uses: 182, rating: 4.8, createdAt: '2026-01-12', tags: ['backup', 'database', 'schedule'] },
  { id: 'tpl2', name: 'CI/CD Pipeline', description: 'Build, test, and deploy on every push.', category: 'deploy', steps: 6, uses: 145, rating: 4.9, createdAt: '2026-02-03', tags: ['ci', 'cd', 'github'] },
  { id: 'tpl3', name: 'Incident Response', description: 'Notify, page, and open a bridge on alerts.', category: 'ops', steps: 5, uses: 98, rating: 4.6, createdAt: '2026-02-21', tags: ['incident', 'oncall', 'alerts'] },
  { id: 'tpl4', name: 'ML Retraining Loop', description: 'Retrain, evaluate, and promote models.', category: 'ai', steps: 5, uses: 44, rating: 4.4, createdAt: '2026-03-15', tags: ['ml', 'training', 'colab'] },
  { id: 'tpl5', name: 'User Lifecycle', description: 'Provision and deprovision users everywhere.', category: 'integration', steps: 7, uses: 76, rating: 4.7, createdAt: '2026-04-02', tags: ['sso', 'provisioning'] },
  { id: 'tpl6', name: 'Data Enrichment', description: 'Enrich records with external sources.', category: 'data', steps: 3, uses: 51, rating: 4.2, createdAt: '2026-05-18', tags: ['enrichment', 'api'] },
];

const MOCK_VARIABLES: Variable[] = [
  { id: 'var1', name: 'APP_ENV', value: 'production', environment: 'production', description: 'Runtime environment selector.', sensitive: false, updatedAt: '2d ago', usedBy: ['wf2', 'wf6'] },
  { id: 'var2', name: 'DB_HOST', value: 'postgres-primary.internal', environment: 'production', description: 'Primary database hostname.', sensitive: false, updatedAt: '14d ago', usedBy: ['wf1', 'wf6'] },
  { id: 'var3', name: 'SLACK_WEBHOOK', value: 'https://hooks.slack.com/…', environment: 'all', description: 'Slack incoming webhook URL.', sensitive: true, updatedAt: '7d ago', usedBy: ['wf3'] },
  { id: 'var4', name: 'GITHUB_TOKEN', value: 'ghp_****', environment: 'production', description: 'GitHub fine-grained PAT.', sensitive: true, updatedAt: '3d ago', usedBy: ['wf2'] },
  { id: 'var5', name: 'MAX_RETRIES', value: '3', environment: 'all', description: 'Default retry count for actions.', sensitive: false, updatedAt: '30d ago', usedBy: ['wf1', 'wf2', 'wf4'] },
  { id: 'var6', name: 'MODEL_ID', value: 'hermes-intent-v2', environment: 'staging', description: 'Active intent classifier model.', sensitive: false, updatedAt: '5d ago', usedBy: ['wf5'] },
];

const MOCK_SECRETS: AutomationSecret[] = [
  { id: 'as1', name: 'DATABASE_URL', reference: 'vault:hermes/db-url', environment: 'production', rotationDays: 90, lastRotated: '2026-06-20', status: 'ok', owner: 'platform' },
  { id: 'as2', name: 'SLACK_SIGNING_SECRET', reference: 'vault:hermes/slack-secret', environment: 'production', rotationDays: 60, lastRotated: '2026-07-10', status: 'ok', owner: 'platform' },
  { id: 'as3', name: 'GITHUB_APP_KEY', reference: 'vault:hermes/gh-app-key', environment: 'staging', rotationDays: 30, lastRotated: '2026-07-28', status: 'expiring', owner: 'platform' },
  { id: 'as4', name: 'OPENAI_API_KEY', reference: 'vault:hermes/openai-key', environment: 'production', rotationDays: 90, lastRotated: '2026-05-02', status: 'overdue', owner: 'ai-team' },
  { id: 'as5', name: 'SMTP_PASSWORD', reference: 'vault:hermes/smtp-pass', environment: 'all', rotationDays: 120, lastRotated: '2026-04-15', status: 'overdue', owner: 'platform' },
  { id: 'as6', name: 'NEO4J_PASSWORD', reference: 'vault:hermes/neo4j-pass', environment: 'production', rotationDays: 90, lastRotated: '2026-07-01', status: 'ok', owner: 'graph-team' },
];

const MOCK_ANALYTICS: AutomationAnalyticsRecord[] = [
  { id: 'an1', label: 'Executions (24h)', value: 28450, delta: 12, deltaTone: 'up', period: 'last 24h' },
  { id: 'an2', label: 'Success Rate', value: 99.2, delta: 0.4, deltaTone: 'up', period: 'last 24h' },
  { id: 'an3', label: 'Avg Duration', value: 820, delta: -15, deltaTone: 'down', period: 'last 24h' },
  { id: 'an4', label: 'Active Workflows', value: 4, delta: 1, deltaTone: 'up', period: 'current' },
  { id: 'an5', label: 'Failed Executions', value: 34, delta: -8, deltaTone: 'down', period: 'last 24h' },
  { id: 'an6', label: 'Queued Jobs', value: 5, delta: 2, deltaTone: 'neutral', period: 'current' },
  { id: 'an7', label: 'Total Steps Run', value: 142350, delta: 11, deltaTone: 'up', period: 'last 24h' },
  { id: 'an8', label: 'Notifications Sent', value: 8920, delta: 5, deltaTone: 'up', period: 'last 24h' },
];

const DEFAULT_SETTINGS: AutomationSettings = {
  maxConcurrentExecutions: 10,
  defaultTimeoutSec: 300,
  maxRetries: 3,
  retryBackoffMs: 1000,
  notificationsEnabled: true,
  notifyOnFailure: true,
  notifyOnSuccess: false,
  auditTrailEnabled: true,
  executionRetentionDays: 90,
  variableEncryptionEnabled: true,
  webhookSecretEnabled: true,
  scheduleTimezone: 'UTC',
};

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

interface AutomationState {
  workflows: Workflow[];
  triggers: WorkflowTrigger[];
  actions: WorkflowAction[];
  executions: Execution[];
  schedules: Schedule[];
  jobs: Job[];
  queues: Queue[];
  templates: Template[];
  variables: Variable[];
  secrets: AutomationSecret[];
  analytics: AutomationAnalyticsRecord[];
  settings: AutomationSettings;

  // Selectors
  workflowById: (id: string) => Workflow | undefined;
  workflowsByStatus: (status: WorkflowStatus) => Workflow[];
  workflowsByCategory: (category: WorkflowCategory) => Workflow[];
  triggerById: (id: string) => WorkflowTrigger | undefined;
  actionById: (id: string) => WorkflowAction | undefined;
  executionsByWorkflow: (workflowId: string) => Execution[];
  executionsByStatus: (status: ExecutionStatus) => Execution[];
  scheduleById: (id: string) => Schedule | undefined;
  jobById: (id: string) => Job | undefined;
  jobsByStatus: (status: JobStatus) => Job[];
  variablesByEnv: (environment: Variable['environment']) => Variable[];
  secretsByStatus: (status: AutomationSecret['status']) => AutomationSecret[];
  templatesByCategory: (category: TemplateCategory) => Template[];
  activeWorkflows: () => number;
  runningExecutions: () => number;
  failedExecutions24h: () => number;

  // Actions
  setWorkflowStatus: (id: string, status: WorkflowStatus) => void;
  toggleTrigger: (id: string) => void;
  toggleSchedule: (id: string) => void;
  updateVariable: (id: string, patch: Partial<Variable>) => void;
  rotateSecret: (id: string) => void;
  updateSettings: (patch: Partial<AutomationSettings>) => void;
  cancelExecution: (id: string) => void;
  retryJob: (id: string) => void;
  cancelJob: (id: string) => void;
  resetAutomation: () => void;
}

export const useAutomationStore = create<AutomationState>((set, get) => ({
  workflows: MOCK_WORKFLOWS,
  triggers: MOCK_TRIGGERS,
  actions: MOCK_ACTIONS,
  executions: MOCK_EXECUTIONS,
  schedules: MOCK_SCHEDULES,
  jobs: MOCK_JOBS,
  queues: MOCK_QUEUES,
  templates: MOCK_TEMPLATES,
  variables: MOCK_VARIABLES,
  secrets: MOCK_SECRETS,
  analytics: MOCK_ANALYTICS,
  settings: DEFAULT_SETTINGS,

  workflowById: (id) => get().workflows.find((w) => w.id === id),
  workflowsByStatus: (status) => get().workflows.filter((w) => w.status === status),
  workflowsByCategory: (category) => get().workflows.filter((w) => w.category === category),
  triggerById: (id) => get().triggers.find((t) => t.id === id),
  actionById: (id) => get().actions.find((a) => a.id === id),
  executionsByWorkflow: (workflowId) => get().executions.filter((e) => e.workflowId === workflowId),
  executionsByStatus: (status) => get().executions.filter((e) => e.status === status),
  scheduleById: (id) => get().schedules.find((s) => s.id === id),
  jobById: (id) => get().jobs.find((j) => j.id === id),
  jobsByStatus: (status) => get().jobs.filter((j) => j.status === status),
  variablesByEnv: (environment) => get().variables.filter((v) => v.environment === environment || v.environment === 'all'),
  secretsByStatus: (status) => get().secrets.filter((s) => s.status === status),
  templatesByCategory: (category) => get().templates.filter((t) => t.category === category),
  activeWorkflows: () => get().workflows.filter((w) => w.status === 'active').length,
  runningExecutions: () => get().executions.filter((e) => e.status === 'running' || e.status === 'pending').length,
  failedExecutions24h: () => get().executions.filter((e) => e.status === 'failed').length,

  setWorkflowStatus: (id, status) => {
    set((s) => ({
      workflows: s.workflows.map((w) => (w.id === id ? { ...w, status, updatedAt: 'just now' } : w)),
    }));
  },

  toggleTrigger: (id) => {
    set((s) => ({
      triggers: s.triggers.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
    }));
  },

  toggleSchedule: (id) => {
    set((s) => ({
      schedules: s.schedules.map((sch) =>
        sch.id === id
          ? { ...sch, enabled: !sch.enabled, status: sch.enabled ? 'disabled' : 'active' }
          : sch
      ),
    }));
  },

  updateVariable: (id, patch) => {
    set((s) => ({
      variables: s.variables.map((v) => (v.id === id ? { ...v, ...patch, updatedAt: 'just now' } : v)),
    }));
  },

  rotateSecret: (id) => {
    set((s) => ({
      secrets: s.secrets.map((sec) =>
        sec.id === id
          ? { ...sec, status: 'ok', lastRotated: new Date().toISOString().slice(0, 10) }
          : sec
      ),
    }));
  },

  updateSettings: (patch) => {
    set((s) => ({ settings: { ...s.settings, ...patch } }));
  },

  cancelExecution: (id) => {
    set((s) => ({
      executions: s.executions.map((e) =>
        e.id === id
          ? { ...e, status: 'cancelled', finishedAt: 'just now' }
          : e
      ),
    }));
  },

  retryJob: (id) => {
    set((s) => ({
      jobs: s.jobs.map((j) =>
        j.id === id
          ? { ...j, status: 'queued', attempts: 0, queuedAt: 'just now', startedAt: undefined, finishedAt: undefined }
          : j
      ),
    }));
  },

  cancelJob: (id) => {
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, status: 'cancelled', finishedAt: 'just now' } : j)),
    }));
  },

  resetAutomation: () => {
    set({
      workflows: MOCK_WORKFLOWS,
      triggers: MOCK_TRIGGERS,
      actions: MOCK_ACTIONS,
      executions: MOCK_EXECUTIONS,
      schedules: MOCK_SCHEDULES,
      jobs: MOCK_JOBS,
      queues: MOCK_QUEUES,
      templates: MOCK_TEMPLATES,
      variables: MOCK_VARIABLES,
      secrets: MOCK_SECRETS,
      analytics: MOCK_ANALYTICS,
      settings: DEFAULT_SETTINGS,
    });
  },
}));
