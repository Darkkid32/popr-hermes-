import type { NavLink } from './demo-data'

export interface ModelProvider {
  id: string
  name: string
  icon: string
  iconColor: string
  status: 'connected' | 'disconnected' | 'degraded'
  modelsCount: number
  apiEndpoint: string
}

export const MODEL_PROVIDERS: ModelProvider[] = [
  { id: 'ollama', name: 'Ollama', icon: '⬢', iconColor: '#00e5ff', status: 'connected', modelsCount: 12, apiEndpoint: 'http://localhost:11434' },
  { id: 'openai', name: 'OpenAI', icon: '⌘', iconColor: '#7c6cf5', status: 'connected', modelsCount: 8, apiEndpoint: 'https://api.openai.com' },
  { id: 'anthropic', name: 'Anthropic', icon: '◉', iconColor: '#ff4d6d', status: 'connected', modelsCount: 6, apiEndpoint: 'https://api.anthropic.com' },
  { id: 'google', name: 'Google AI', icon: '⊕', iconColor: '#f06292', status: 'disconnected', modelsCount: 0, apiEndpoint: 'https://generativelanguage.googleapis.com' },
  { id: 'groq', name: 'Groq', icon: '◬', iconColor: '#ffb347', status: 'connected', modelsCount: 4, apiEndpoint: 'https://api.groq.com' },
  { id: 'together', name: 'Together AI', icon: '☁', iconColor: '#00e5ff', status: 'degraded', modelsCount: 3, apiEndpoint: 'https://api.together.xyz' },
]

export interface Model {
  id: string
  name: string
  provider: string
  providerId: string
  type: 'chat' | 'embedding' | 'completion' | 'multimodal'
  contextWindow: number
  maxOutput: number
  pricing: { input: string; output: string } | null
  status: 'available' | 'busy' | 'unavailable' | 'deprecated' | 'degraded'
  tags: string[]
  capabilities: string[]
  lastUsed: string
  usage: { requests: number; tokens: number; cost: string }
}

export const MODELS: Model[] = [
  {
    id: 'qwen3-14b',
    name: 'Qwen3 14B',
    provider: 'Ollama',
    providerId: 'ollama',
    type: 'chat',
    contextWindow: 8192,
    maxOutput: 2048,
    pricing: null,
    status: 'available',
    tags: ['local', 'reasoning', 'code'],
    capabilities: ['chat', 'reasoning', 'code-generation', 'function-calling'],
    lastUsed: '2m ago',
    usage: { requests: 1247, tokens: 2.4e6, cost: '$0.00' }
  },
  {
    id: 'llama3-8b',
    name: 'Llama 3 8B',
    provider: 'Ollama',
    providerId: 'ollama',
    type: 'chat',
    contextWindow: 8192,
    maxOutput: 2048,
    pricing: null,
    status: 'available',
    tags: ['local', 'general'],
    capabilities: ['chat', 'summarization', 'code-generation'],
    lastUsed: '1h ago',
    usage: { requests: 892, tokens: 1.8e6, cost: '$0.00' }
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    provider: 'Ollama',
    providerId: 'ollama',
    type: 'chat',
    contextWindow: 32768,
    maxOutput: 4096,
    pricing: null,
    status: 'available',
    tags: ['local', 'long-context'],
    capabilities: ['chat', 'long-context', 'reasoning'],
    lastUsed: '3d ago',
    usage: { requests: 234, tokens: 5.1e5, cost: '$0.00' }
  },
  {
    id: 'deepseek-coder-6b',
    name: 'DeepSeek Coder 6B',
    provider: 'Ollama',
    providerId: 'ollama',
    type: 'completion',
    contextWindow: 16384,
    maxOutput: 4096,
    pricing: null,
    status: 'available',
    tags: ['local', 'code'],
    capabilities: ['code-completion', 'code-generation', 'refactoring'],
    lastUsed: '4h ago',
    usage: { requests: 567, tokens: 1.2e6, cost: '$0.00' }
  },
  {
    id: 'nomic-embed-text',
    name: 'Nomic Embed Text',
    provider: 'Ollama',
    providerId: 'ollama',
    type: 'embedding',
    contextWindow: 8192,
    maxOutput: 768,
    pricing: null,
    status: 'available',
    tags: ['local', 'embedding'],
    capabilities: ['text-embedding', 'semantic-search'],
    lastUsed: '30m ago',
    usage: { requests: 2100, tokens: 8.4e6, cost: '$0.00' }
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    providerId: 'openai',
    type: 'multimodal',
    contextWindow: 128000,
    maxOutput: 4096,
    pricing: { input: '$2.50/1M', output: '$10.00/1M' },
    status: 'available',
    tags: ['cloud', 'multimodal', 'reasoning'],
    capabilities: ['chat', 'vision', 'function-calling', 'reasoning', 'code-generation'],
    lastUsed: '5m ago',
    usage: { requests: 3421, tokens: 15.2e6, cost: '$42.18' }
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    providerId: 'openai',
    type: 'chat',
    contextWindow: 128000,
    maxOutput: 16384,
    pricing: { input: '$0.15/1M', output: '$0.60/1M' },
    status: 'available',
    tags: ['cloud', 'fast', 'cost-effective'],
    capabilities: ['chat', 'function-calling', 'code-generation'],
    lastUsed: '1m ago',
    usage: { requests: 8742, tokens: 42.1e6, cost: '$8.92' }
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    providerId: 'anthropic',
    type: 'multimodal',
    contextWindow: 200000,
    maxOutput: 8192,
    pricing: { input: '$3.00/1M', output: '$15.00/1M' },
    status: 'available',
    tags: ['cloud', 'reasoning', 'code'],
    capabilities: ['chat', 'vision', 'function-calling', 'reasoning', 'code-generation', 'analysis'],
    lastUsed: '3m ago',
    usage: { requests: 1834, tokens: 8.7e6, cost: '$31.42' }
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    providerId: 'anthropic',
    type: 'chat',
    contextWindow: 200000,
    maxOutput: 4096,
    pricing: { input: '$0.25/1M', output: '$1.25/1M' },
    status: 'available',
    tags: ['cloud', 'fast'],
    capabilities: ['chat', 'vision', 'function-calling'],
    lastUsed: '2h ago',
    usage: { requests: 2156, tokens: 5.4e6, cost: '$2.84' }
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google AI',
    providerId: 'google',
    type: 'multimodal',
    contextWindow: 1000000,
    maxOutput: 8192,
    pricing: { input: '$1.25/1M', output: '$5.00/1M' },
    status: 'unavailable',
    tags: ['cloud', 'long-context', 'multimodal'],
    capabilities: ['chat', 'vision', 'audio', 'video', 'function-calling', 'long-context'],
    lastUsed: 'never',
    usage: { requests: 0, tokens: 0, cost: '$0.00' }
  },
  {
    id: 'llama-3.1-70b',
    name: 'Llama 3.1 70B',
    provider: 'Groq',
    providerId: 'groq',
    type: 'chat',
    contextWindow: 131072,
    maxOutput: 8192,
    pricing: { input: '$0.59/1M', output: '$0.79/1M' },
    status: 'available',
    tags: ['cloud', 'fast', 'reasoning'],
    capabilities: ['chat', 'function-calling', 'reasoning', 'code-generation'],
    lastUsed: '10m ago',
    usage: { requests: 1456, tokens: 3.2e6, cost: '$2.34' }
  },
  {
    id: 'mixtral-8x7b',
    name: 'Mixtral 8x7B',
    provider: 'Groq',
    providerId: 'groq',
    type: 'chat',
    contextWindow: 32768,
    maxOutput: 4096,
    pricing: { input: '$0.27/1M', output: '$0.27/1M' },
    status: 'available',
    tags: ['cloud', 'moe', 'fast'],
    capabilities: ['chat', 'function-calling', 'reasoning'],
    lastUsed: '45m ago',
    usage: { requests: 892, tokens: 1.8e6, cost: '$0.48' }
  },
  {
    id: 'qwen2-72b',
    name: 'Qwen2 72B',
    provider: 'Together AI',
    providerId: 'together',
    type: 'chat',
    contextWindow: 32768,
    maxOutput: 4096,
    pricing: { input: '$0.90/1M', output: '$0.90/1M' },
    status: 'degraded',
    tags: ['cloud', 'reasoning', 'multilingual'],
    capabilities: ['chat', 'function-calling', 'reasoning', 'code-generation', 'multilingual'],
    lastUsed: '1d ago',
    usage: { requests: 342, tokens: 8.7e5, cost: '$0.82' }
  },
]

export interface ModelEndpoint {
  id: string
  modelId: string
  name: string
  url: string
  type: 'chat' | 'completion' | 'embedding'
  auth: 'bearer' | 'api-key' | 'none'
  headers: Record<string, string>
  status: 'healthy' | 'degraded' | 'down'
  latency: string
  uptime: string
}

export const MODEL_ENDPOINTS: ModelEndpoint[] = [
  { id: 'ep-1', modelId: 'qwen3-14b', name: 'Ollama Chat', url: 'http://localhost:11434/api/chat', type: 'chat', auth: 'none', headers: {}, status: 'healthy', latency: '420ms', uptime: '99.9%' },
  { id: 'ep-2', modelId: 'qwen3-14b', name: 'Ollama Generate', url: 'http://localhost:11434/api/generate', type: 'completion', auth: 'none', headers: {}, status: 'healthy', latency: '380ms', uptime: '99.9%' },
  { id: 'ep-3', modelId: 'nomic-embed-text', name: 'Ollama Embeddings', url: 'http://localhost:11434/api/embeddings', type: 'embedding', auth: 'none', headers: {}, status: 'healthy', latency: '180ms', uptime: '99.9%' },
  { id: 'ep-4', modelId: 'gpt-4o', name: 'OpenAI Chat Completions', url: 'https://api.openai.com/v1/chat/completions', type: 'chat', auth: 'bearer', headers: { 'Authorization': 'Bearer ***' }, status: 'healthy', latency: '1.2s', uptime: '99.95%' },
  { id: 'ep-5', modelId: 'gpt-4o-mini', name: 'OpenAI Chat Completions', url: 'https://api.openai.com/v1/chat/completions', type: 'chat', auth: 'bearer', headers: { 'Authorization': 'Bearer ***' }, status: 'healthy', latency: '890ms', uptime: '99.95%' },
  { id: 'ep-6', modelId: 'claude-3-5-sonnet', name: 'Anthropic Messages', url: 'https://api.anthropic.com/v1/messages', type: 'chat', auth: 'api-key', headers: { 'x-api-key': '***' }, status: 'healthy', latency: '1.4s', uptime: '99.9%' },
  { id: 'ep-7', modelId: 'llama-3.1-70b', name: 'Groq Chat', url: 'https://api.groq.com/openai/v1/chat/completions', type: 'chat', auth: 'bearer', headers: { 'Authorization': 'Bearer ***' }, status: 'healthy', latency: '320ms', uptime: '99.99%' },
  { id: 'ep-8', modelId: 'mixtral-8x7b', name: 'Groq Chat', url: 'https://api.groq.com/openai/v1/chat/completions', type: 'chat', auth: 'bearer', headers: { 'Authorization': 'Bearer ***' }, status: 'healthy', latency: '280ms', uptime: '99.99%' },
]

export interface ModelRoutingRule {
  id: string
  name: string
  condition: string
  targetModel: string
  fallbackModel: string | null
  priority: number
  enabled: boolean
}

export const MODEL_ROUTING_RULES: ModelRoutingRule[] = [
  { id: 'rr-1', name: 'Code tasks → DeepSeek Coder', condition: 'task.type === "code" && context.length < 8000', targetModel: 'deepseek-coder-6b', fallbackModel: 'qwen3-14b', priority: 1, enabled: true },
  { id: 'rr-2', name: 'Long context → Mistral 7B', condition: 'context.length > 16000', targetModel: 'mistral-7b', fallbackModel: 'gpt-4o', priority: 2, enabled: true },
  { id: 'rr-3', name: 'Reasoning → Qwen3 14B', condition: 'task.requiresReasoning === true', targetModel: 'qwen3-14b', fallbackModel: 'claude-3-5-sonnet', priority: 3, enabled: true },
  { id: 'rr-4', name: 'Embeddings → Nomic Embed', condition: 'task.type === "embedding"', targetModel: 'nomic-embed-text', fallbackModel: null, priority: 4, enabled: true },
  { id: 'rr-5', name: 'Vision → GPT-4o', condition: 'task.hasImages === true', targetModel: 'gpt-4o', fallbackModel: 'claude-3-5-sonnet', priority: 5, enabled: true },
  { id: 'rr-6', name: 'Default → Qwen3 14B', condition: 'true', targetModel: 'qwen3-14b', fallbackModel: 'gpt-4o-mini', priority: 10, enabled: true },
]

export interface ModelBenchmark {
  modelId: string
  modelName: string
  provider: string
  mmlu: number
  humaneval: number
  gsm8k: number
  bbh: number
  latency: string
  costPer1k: string
}

export const MODEL_BENCHMARKS: ModelBenchmark[] = [
  { modelId: 'gpt-4o', modelName: 'GPT-4o', provider: 'OpenAI', mmlu: 88.7, humaneval: 90.2, gsm8k: 94.2, bbh: 95.1, latency: '1.2s', costPer1k: '$0.0125' },
  { modelId: 'claude-3-5-sonnet', modelName: 'Claude 3.5 Sonnet', provider: 'Anthropic', mmlu: 88.3, humaneval: 92.0, gsm8k: 96.4, bbh: 95.4, latency: '1.4s', costPer1k: '$0.015' },
  { modelId: 'qwen3-14b', modelName: 'Qwen3 14B', provider: 'Ollama', mmlu: 82.1, humaneval: 78.5, gsm8k: 88.3, bbh: 84.2, latency: '420ms', costPer1k: '$0.00' },
  { modelId: 'llama-3.1-70b', modelName: 'Llama 3.1 70B', provider: 'Groq', mmlu: 86.1, humaneval: 84.2, gsm8k: 91.5, bbh: 89.8, latency: '320ms', costPer1k: '$0.00059' },
  { modelId: 'gemini-1.5-pro', modelName: 'Gemini 1.5 Pro', provider: 'Google', mmlu: 86.5, humaneval: 84.8, gsm8k: 92.1, bbh: 89.2, latency: '2.1s', costPer1k: '$0.00125' },
  { modelId: 'gpt-4o-mini', modelName: 'GPT-4o Mini', provider: 'OpenAI', mmlu: 82.0, humaneval: 87.2, gsm8k: 87.0, bbh: 83.4, latency: '890ms', costPer1k: '$0.00015' },
  { modelId: 'llama3-8b', modelName: 'Llama 3 8B', provider: 'Ollama', mmlu: 75.2, humaneval: 68.4, gsm8k: 78.9, bbh: 72.1, latency: '310ms', costPer1k: '$0.00' },
  { modelId: 'mistral-7b', modelName: 'Mistral 7B', provider: 'Ollama', mmlu: 73.8, humaneval: 65.2, gsm8k: 72.4, bbh: 70.8, latency: '280ms', costPer1k: '$0.00' },
]

export interface ModelUsageStats {
  date: string
  requests: number
  tokens: number
  cost: number
  avgLatency: number
  errors: number
}

export const MODEL_USAGE_HISTORY: ModelUsageStats[] = [
  { date: '2026-07-26', requests: 12450, tokens: 52.3e6, cost: 12.45, avgLatency: 890, errors: 3 },
  { date: '2026-07-27', requests: 14200, tokens: 61.8e6, cost: 14.82, avgLatency: 920, errors: 5 },
  { date: '2026-07-28', requests: 11890, tokens: 48.2e6, cost: 10.94, avgLatency: 870, errors: 2 },
  { date: '2026-07-29', requests: 15600, tokens: 68.4e6, cost: 18.23, avgLatency: 950, errors: 8 },
  { date: '2026-07-30', requests: 13750, tokens: 55.1e6, cost: 13.67, avgLatency: 910, errors: 4 },
  { date: '2026-07-31', requests: 16200, tokens: 72.8e6, cost: 19.45, avgLatency: 980, errors: 6 },
  { date: '2026-08-01', requests: 14890, tokens: 63.4e6, cost: 15.23, avgLatency: 930, errors: 3 },
]

export const MODEL_NAV_LINKS: NavLink[] = [
  { id: 'models-overview', label: 'Overview', icon: '◎', group: 'self' },
  { id: 'models-catalog', label: 'Model Catalog', icon: '◧', group: 'self' },
  { id: 'models-routing', label: 'Routing', icon: '⌘', group: 'self' },
  { id: 'models-endpoints', label: 'Endpoints', icon: '⊕', group: 'self' },
  { id: 'models-benchmarks', label: 'Benchmarks', icon: '∿', group: 'self' },
  { id: 'models-settings', label: 'Settings', icon: '⚙', group: 'self' },
]