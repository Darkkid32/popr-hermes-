import { useState } from 'react';
import { clsx } from 'clsx';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useObservabilityStore } from '../../stores/observabilityStore';

const LEVEL_VARIANT = {
  debug: 'neutral' as const,
  info: 'info' as const,
  warn: 'warning' as const,
  error: 'error' as const,
  fatal: 'error' as const,
};

const SOURCE_VARIANT = {
  agent: 'brand' as const,
  gateway: 'success' as const,
  database: 'info' as const,
  connector: 'warning' as const,
  system: 'neutral' as const,
};

interface LogViewerProps {
  maxLines?: number;
}

export function LogViewer({ maxLines = 50 }: LogViewerProps) {
  const logs = useObservabilityStore((s) => s.logs);
  const [filterLevel, setFilterLevel] = useState<'all' | LogLevel>('all');
  const [filterSource, setFilterSource] = useState<'all' | LogSource>('all');
  const [filterService, setFilterService] = useState<string>('');

  const filtered = logs
    .filter(l => filterLevel === 'all' || l.level === filterLevel)
    .filter(l => filterSource === 'all' || l.source === filterSource)
    .filter(l => !filterService || l.service.toLowerCase().includes(filterService.toLowerCase()))
    .slice(0, maxLines);

  const levels: ('all' | LogLevel)[] = ['all', 'debug', 'info', 'warn', 'error', 'fatal'];
  const sources: ('all' | LogSource)[] = ['all', 'agent', 'gateway', 'database', 'connector', 'system'];

  return (
    <Card className="flex flex-col h-full">
      <div className="flex flex-wrap gap-2 mb-4 p-4 border-b border-[var(--color-surface-border)]">
        <div className="flex gap-1 flex-wrap">
          {levels.map(l => (
            <button
              key={l}
              onClick={() => setFilterLevel(l)}
              className={clsx(
                'px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-medium capitalize transition-colors',
                filterLevel === l
                  ? 'bg-[var(--color-brand-500)] text-[var(--color-text-inverse)]'
                  : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
              )}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {sources.map(s => (
            <button
              key={s}
              onClick={() => setFilterSource(s)}
              className={clsx(
                'px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-xs)] font-medium capitalize transition-colors',
                filterSource === s
                  ? 'bg-[var(--color-brand-500)] text-[var(--color-text-inverse)]'
                  : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Filter service..."
          value={filterService}
          onChange={e => setFilterService(e.target.value)}
          className="flex-1 min-w-[180px] px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-sm)] bg-[var(--color-surface-primary)] border border-[var(--color-surface-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)]"
        />
      </div>

      <div className="flex-1 overflow-auto font-mono text-[var(--text-xs)]">
        {filtered.map(log => (
          <LogRow key={log.id} log={log} />
        ))}
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-full text-[var(--color-text-tertiary)]">
            No logs match the current filters
          </div>
        )}
      </div>
    </Card>
  );
}

function LogRow({ log }: { log: LogEntry }) {
  const levelColors = {
    debug: 'var(--color-text-tertiary)',
    info: 'var(--color-status-info)',
    warn: 'var(--color-status-warning)',
    error: 'var(--color-status-error)',
    fatal: 'var(--color-status-error)',
  };

  return (
    <div className="border-b border-[var(--color-surface-border)] p-3 hover:bg-[var(--color-surface-hover)] transition-colors">
      <div className="flex flex-wrap items-center gap-3 mb-1">
        <span className="font-mono text-[var(--color-text-tertiary)]">{log.timestamp}</span>
        <Badge size="xs" variant={LEVEL_VARIANT[log.level]} style={{ backgroundColor: levelColors[log.level] + '20', color: levelColors[log.level] }}>
          {log.level.toUpperCase()}
        </Badge>
        <Badge size="xs" variant={SOURCE_VARIANT[log.source]}>{log.source}</Badge>
        <span className="font-mono text-[var(--color-text-secondary)]">{log.service}</span>
        {log.traceId && (
          <span className="px-2 py-0.5 bg-[var(--color-surface-tertiary)] rounded-[var(--radius-sm)] text-[var(--text-xs)]">
            {log.traceId}
          </span>
        )}
      </div>
      <p className="text-[var(--color-text-primary)] break-all">{log.message}</p>
      {log.metadata && (
        <details className="mt-2">
          <summary className="text-[var(--text-xs)] text-[var(--color-text-tertiary)] cursor-pointer">Metadata</summary>
          <pre className="mt-1 p-2 bg-[var(--color-surface-tertiary)] rounded-[var(--radius-sm)] text-[var(--text-xs)] overflow-auto">
            {JSON.stringify(log.metadata, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}

type LogEntry = {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  source: 'agent' | 'gateway' | 'database' | 'connector' | 'system';
  service: string;
  message: string;
  traceId?: string;
  metadata?: Record<string, string>;
};

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
type LogSource = 'agent' | 'gateway' | 'database' | 'connector' | 'system';
