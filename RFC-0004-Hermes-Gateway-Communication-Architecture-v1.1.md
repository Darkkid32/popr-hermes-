---

## 28. References

- RFC-0001: Hermes Agent OS v2 — Foundation Architecture
- RFC-0002: Hermes Core Architecture v1.1
- RFC-0003: Hermes Event Bus & Messaging Architecture v1.1
- RFC-0005: Memory Engine Architecture (planned)
- RFC-0006: Knowledge Engine & RAG Architecture (planned)
- RFC-0007: Security & Tenancy Model (planned)
- RFC-0008: Plugin/Tool SDK & WASM Sandbox (planned)
- RFC-0009: Automation Platform (planned)
- OpenID Connect Core 1.0
- WebSocket Protocol (RFC 6455)
- Server-Sent Events (WHATWG)
- gRPC HTTP/2 Protocol
- Automerge CRDT
- NATS JetStream Documentation

---

## 29. Glossary

| Term | Definition |
|------|------------|
| **Gateway** | Unified ingress/egress for all client communication |
| **Protocol Adapter** | Translates client protocol → internal gRPC/NATS |
| **Session** | Authenticated client context (24h TTL, sliding) |
| **CRDT** | Conflict-free Replicated Data Type (Automerge) |
| **Backpressure** | Signal to slow down when downstream saturated |
| **Chunked Upload** | Resumable large file upload in pieces |
| **Sync Token** | Opaque token for incremental synchronization |
| **GeoDNS** | DNS-based geographic routing |
| **NATS Supercluster** | Multi-region NATS with global topic replication |
| **Span Linking** | Creating child spans linked to parent trace |
| **Baggage** | Key-value pairs propagated across service boundaries |
| **Circuit Breaker** | Pattern to fail fast when dependency is unhealthy |
| **Hedging** | Sending duplicate request to reduce tail latency |
| **Retry Budget** | Token bucket limiting retry attempts |
| **Hedged Request** | Duplicate request sent after short delay |
| **Single-Flight** | Pattern ensuring only one operation executes for a key |

---

**End of RFC-0004 v1.1**

*This document is the canonical communication specification for Hermes Agent OS. No implementation shall begin until this RFC is reviewed and approved.*