# RFC-0008 Deferred Items
# v1.1

**Date:** 2026-07-25  
**Author:** Chief System Architect  
**Source:** Principal Enterprise Architect Review (RFC-0008-Architectural-Review.md)

---

## Deferred Items

The following items from the Principal Enterprise Architect review were evaluated and **deferred** to future RFCs or implementation phases. Each includes justification for deferral.

---

### L-01: Context Assembly Token Counting

**Review Observation:** "The RFC specifies token budget tracking but does not define how token counting works across providers with different tokenizers."

**Deferred To:** RFC-0010 (Observability & Telemetry)

**Justification:**
- Token counting methodology is provider-specific (each provider uses different tokenizer: cl100k_base for OpenAI, claude_tokenizer for Anthropic, etc.)
- The Runtime's responsibility is **enforcement** of budgets, not **counting methodology**
- Provider adapters (RFC-0004) already handle provider-specific token counting
- Observability layer (RFC-0010) will standardize token metrics across providers
- Premature standardization here would constrain provider adapter flexibility

---

### L-02: Agent Process Isolation Specification

**Review Observation:** "The RFC mentions WASM sandbox for tools but does not specify process isolation for the agent core itself (container vs WASM vs native)."

**Deferred To:** RFC-0009 (Plugin SDK & WASM Sandbox)

**Justification:**
- Agent isolation strategy is a platform deployment concern, not a Runtime contract
- Current RFC-0002 specifies "Wasmtime + WASI 0.2" for tool execution; agent core isolation is analogous
- RFC-0009 will define the plugin manifest, capability model, and isolation boundary (container vs WASM component vs native process)
- Premature specification here would constrain deployment model options (e.g., firecracker microVMs, gVisor, WASM component model)

---

### L-03: Per-Provider Tokenizers

**Review Observation:** "Token budget enforcement requires per-provider tokenizer integration."

**Deferred To:** Provider Adapter Implementations (RFC-0004)

**Justification:**
- Each provider adapter already implements `ProviderParameters` and `Usage` tracking (Section 23.1)
- Tokenizer is an implementation detail of the provider adapter, not a Runtime contract
- The Runtime enforces the budget; the adapter reports usage in its native token units
- Cross-provider token normalization belongs in Observability (RFC-0010), not Runtime

---

### L-04: Observability Metrics Specification

**Review Observation:** "The RFC references OpenTelemetry but does not specify required metrics, traces, or log formats."

**Deferred To:** RFC-0010 (Observability & Telemetry)

**Justification:**
- OpenTelemetry semantic conventions are evolving; RFC-0010 will define the canonical metric/trace/log schema
- Current RFC references "Observability by Design" as a principle; concrete schema belongs in the observability RFC
- Premature specification would create coupling between Runtime and Observability that should be avoided
- RFC-0010 will specify: required spans, metric names, log attributes, dashboard templates

---

### L-05: Agent Lifecycle Webhooks / External Callbacks

**Review Observation:** "No mechanism for external systems to hook into agent lifecycle events (spawn, terminate, scale)."

**Deferred To:** RFC-0011 (Automation Platform) or post-v1 extension

**Justification:**
- Current event system (Section 25) provides all lifecycle events via NATS
- External systems can subscribe to `hermes.{tenant}.agent.runtime.*` events directly
- Webhook delivery layer is a Gateway concern (RFC-0004), not Runtime
- If a dedicated callback mechanism is needed, it will be added in Automation Platform (RFC-0011)

---

### L-06: Agent Code Signing / Supply Chain Verification

**Review Observation:** "WASM module signing is mentioned but container image scanning is underspecified."

**Deferred To:** RFC-0009 (Plugin SDK) / Security Hardening Phase 2

**Justification:**
- Current RFC specifies "WASM module signed & verified; or container image scanned" (Section 8.2)
- Detailed supply chain verification (sigstore, SLSA, in-toto) is a security hardening concern
- Phase 1: Basic signature verification (current spec)
- Phase 2: Full SLSA Level 3+ supply chain (post-v1)

---

### L-07: Advanced Scheduling (Gang Scheduling, Priority Preemption)

**Review Observation:** "The scheduler supports priority queues but not gang scheduling or priority preemption."

**Deferred To:** Post-v1 Scheduler Enhancements

**Justification:**
- Current priority queue + fair share + capability-aware scheduling covers 95% of use cases
- Gang scheduling (co-locating related agents) and priority preemption (evicting lower-priority tasks) add significant complexity
- These are advanced features for multi-tenant clusters with bursty workloads
- Can be added incrementally without breaking changes to the scheduling API

---

### L-08: Agent-to-Agent Encryption Beyond mTLS

**Review Observation:** "ACP uses mTLS but payload encryption at rest is not specified."

**Deferred To:** Security Hardening Phase 2

**Justification:**
- mTLS provides encryption in transit (SPIFFE SVID per RFC-0007)
- Payload encryption at rest would require key management per message, adding latency
- Current threat model: NATS JetStream persistence is encrypted at disk level
- If application-layer encryption is needed, it will be a capability (`message.encrypt`) added post-v1

---

### L-09: Multi-Cluster Federation (Beyond Multi-Region)

**Review Observation:** "Multi-region is addressed but multi-cluster federation (independent NATS clusters) is not."

**Deferred To:** Post-v1 / Enterprise Deployment

**Justification:**
- Current design assumes NATS supercluster (single logical NATS across regions)
- Multi-cluster federation (independent clusters with gateway links) is a different topology
- Needed for air-gapped environments, regulatory boundaries, or separate data centers
- Requires separate design for cluster identity, trust domains, and cross-cluster ACP routing

---

### L-10: Agent Marketplace / Manifest Registry

**Review Observation:** "No specification for a shared agent manifest registry or marketplace."

**Deferred To:** RFC-0011 (Automation Platform) or Product Feature

**Justification:**
- Current Registry (Section 6) is per-tenant, operational
- Marketplace implies cross-tenant discovery, ratings, versioning, monetization
- This is a product feature, not a Runtime architectural requirement
- Can be built on top of existing Registry API without changes

---

## Summary

| Category | Count | Items |
|----------|-------|-------|
| **Critical (C-01 to C-04)** | 4 | All addressed in v1.1 |
| **High (H-01 to H-07)** | 7 | All addressed in v1.1 |
| **Medium (M-01 to M-07)** | 7 | All addressed in v1.1 |
| **Low / Deferred (L-01 to L-10)** | 10 | Deferred with justification |

**Total Review Items:** 28  
**Addressed in v1.1:** 18 (100% of Critical + High + Medium)  
**Deferred:** 10 (Low priority, justified)

---

## Next Steps for Deferred Items

| Item | Target | Owner | Timeline |
|------|--------|-------|----------|
| L-01, L-04 | RFC-0010 (Observability) | Observability Team | Q3 2026 |
| L-02, L-06 | RFC-0009 (Plugin SDK) | Platform Team | Q3 2026 |
| L-03 | Provider Adapter Refinement | Integration Team | Q3 2026 |
| L-05 | RFC-0011 (Automation) | Automation Team | Q4 2026 |
| L-07 | Scheduler v2 | Platform Team | Q4 2026 |
| L-08 | Security Hardening Phase 2 | Security Team | Q4 2026 |
| L-09 | Multi-Cluster Design | Architecture Team | 2027 |
| L-10 | Product Feature | Product Team | 2027 |