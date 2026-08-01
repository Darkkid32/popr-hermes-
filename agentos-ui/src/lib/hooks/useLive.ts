import { useEffect, useRef, useState } from 'react'
import { LiveSourceMissingError, isConfigured } from '../services/config'

export type LiveStatus = 'idle' | 'loading' | 'live' | 'unconfigured' | 'error'

export interface UseLiveState<T> {
  status: LiveStatus
  data: T | null
  error: Error | null
}

export function useLive<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): UseLiveState<T> {
  const [state, setState] = useState<UseLiveState<T>>({
    status: isConfigured() ? 'loading' : 'unconfigured',
    data: null,
    error: null,
  })
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    if (!isConfigured()) {
      setState({ status: 'unconfigured', data: null, error: null })
      return
    }
    let cancelled = false
    setState({ status: 'loading', data: null, error: null })
    fetcherRef
      .current()
      .then((data) => {
        if (cancelled) return
        setState({ status: 'live', data, error: null })
      })
      .catch((err: Error) => {
        if (cancelled) return
        if (err instanceof LiveSourceMissingError) {
          setState({ status: 'unconfigured', data: null, error: null })
        } else {
          setState({ status: 'error', data: null, error: err })
        }
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}

export interface UseLiveStreamState<T> {
  status: LiveStatus
  events: T[]
  latest: T | null
  error: Error | null
}

export function useLiveStream<T>(
  subscribeFn: (listener: (value: T) => void) => () => void,
  options: { limit?: number } = {},
): UseLiveStreamState<T> {
  const limit = options.limit ?? 200
  const [state, setState] = useState<UseLiveStreamState<T>>({
    status: isConfigured() ? 'loading' : 'unconfigured',
    events: [],
    latest: null,
    error: null,
  })

  useEffect(() => {
    if (!isConfigured()) {
      setState({ status: 'unconfigured', events: [], latest: null, error: null })
      return
    }
    let cancelled = false
    setState({ status: 'loading', events: [], latest: null, error: null })
    let unsubscribe: (() => void) | null = null
    try {
      unsubscribe = subscribeFn((value) => {
        if (cancelled) return
        setState((prev) => {
          const events = [value, ...prev.events].slice(0, limit)
          return { ...prev, status: 'live', latest: value, events }
        })
      })
      setState((prev) => (prev.status === 'live' ? prev : { ...prev, status: 'live' }))
    } catch (err) {
      if (err instanceof LiveSourceMissingError) {
        setState({ status: 'unconfigured', events: [], latest: null, error: null })
      } else {
        setState({
          status: 'error',
          events: [],
          latest: null,
          error: err instanceof Error ? err : new Error(String(err)),
        })
      }
    }
    return () => {
      cancelled = true
      if (unsubscribe) unsubscribe()
    }
  }, [limit, subscribeFn])

  return state
}