// Zustand is imported for potential future use
// import { create } from 'zustand'

export interface ApiClientConfig {
  baseUrl: string
  wsUrl: string
  timeout: number
  retries: number
}

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string>
  timeout?: number
}

export interface ApiResponse<T> {
  data: T
  status: number
  headers: Headers
}

export interface ServiceRegistration {
  id: string
  name: string
  version: string
  endpoint: string
  healthCheck?: string
  capabilities: string[]
  metadata?: Record<string, unknown>
}

export class ApiClient {
  private config: ApiClientConfig
  private abortControllers: Map<string, AbortController> = new Map()

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = {
      baseUrl: config.baseUrl || '',
      wsUrl: config.wsUrl || '',
      timeout: config.timeout || 30000,
      retries: config.retries || 3,
    }
  }

  setConfig(config: Partial<ApiClientConfig>) {
    this.config = { ...this.config, ...config }
  }

  private buildUrl(path: string, params?: Record<string, string>): string {
    const url = new URL(path, this.config.baseUrl)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
    }
    return url.toString()
  }

  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    const { params, timeout, ...fetchOptions } = options
    const url = this.buildUrl(path, params)
    const controller = new AbortController()
    const requestId = Math.random().toString(36).slice(2)
    this.abortControllers.set(requestId, controller)

    const timeoutMs = timeout || this.config.timeout
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      })

      clearTimeout(timeoutId)
      this.abortControllers.delete(requestId)

      const data = await response.json().catch(() => null)

      return {
        data: data as T,
        status: response.status,
        headers: response.headers,
      }
    } catch (error) {
      clearTimeout(timeoutId)
      this.abortControllers.delete(requestId)
      throw error
    }
  }

  async get<T>(path: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'GET' })
  }

  async post<T>(path: string, body: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) })
  }

  async put<T>(path: string, body: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'PUT', body: JSON.stringify(body) })
  }

  async patch<T>(path: string, body: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'PATCH', body: JSON.stringify(body) })
  }

  async delete<T>(path: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'DELETE' })
  }

  abortAll() {
    this.abortControllers.forEach((controller) => controller.abort())
    this.abortControllers.clear()
  }

  abortRequest(requestId: string) {
    const controller = this.abortControllers.get(requestId)
    if (controller) {
      controller.abort()
      this.abortControllers.delete(requestId)
    }
  }
}

export const apiClient = new ApiClient()

export function createApiClient(config: Partial<ApiClientConfig> = {}): ApiClient {
  return new ApiClient(config)
}