import { LiveSourceMissingError, isConfigured } from './config'
import { subscribe, send } from './ws'

export interface ConversationTurn {
  id: string
  ts: number
  agentId: string
  content: string
  to?: string
}

export function subscribeConversations(
  listener: (turn: ConversationTurn) => void,
): () => void {
  if (!isConfigured()) {
    throw new LiveSourceMissingError()
  }
  return subscribe('conversations.stream', (event) => {
    if (event.type !== 'conversation') return
    const payload = event.payload as Partial<ConversationTurn> | undefined
    if (!payload || typeof payload !== 'object') return
    if (typeof payload.id !== 'string' || typeof payload.ts !== 'number' || typeof payload.content !== 'string') return
    listener(payload as ConversationTurn)
  })
}

export function sendConversation(turn: ConversationTurn): void {
  send({ type: 'conversation', payload: turn })
}