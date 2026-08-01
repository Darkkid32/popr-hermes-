# RFC-0006: Hermes Knowledge Architecture — Principal Enterprise Architect Review

**Reviewer:** Principal Enterprise Architect  
**Date:** 2026-07-24  
**RFC Version:** 1.0  
**Status:** Draft  
**Depends On:** RFC-0001, RFC-0002 v1.1, RFC-0003 v1.1, RFC-0004 v1.1, RFC-0005 v1.1

---

## 1. Executive Summary

RFC-0006 is a **comprehensive, production-grade specification** for the Hermes Knowledge Architecture that demonstrates strong systems thinking across ingestion, processing, retrieval, and RAG pipelines. The document correctly positions Knowledge as a first-class platform capability (not just a RAG add-on) and provides detailed technical specifications for every layer.

**Overall Assessment: APPROVED WITH CHANGES**

The architecture is fundamentally sound but has **4 Critical** and **7 High-priority** gaps that must be resolved before implementation begins. These center on ingestion reliability, RAG quality guarantees, graph population consistency, and cross-RFC contract alignment.

---

## 2. Strengths

| Area | Strength |
|------|----------|
| **Architecture Cohesion** | Clean 4-layer separation (Ingestion → Processing → Storage → Retrieval) with clear boundaries |
| **Ingestion Flexibility** | 6 source types, webhook + polling + manual triggers, Temporal workflows for reliability |
| **Format Coverage** | 15+ formats with parser-specific selection (Marker for PDF, Tree-sitter for code, Tika for Office) |
| **Chunking Intelligence** | Semantic (heading-aware) default + code-aware (AST-based) + table-aware strategies |
| **Multi-Model Embeddings** | Per-content-type model routing (voyage-code-2 for code, bge-m3 for dense+sparse) |
| **Hybrid Search Rigor** | 4-way retrieval (dense + sparse + keyword + graph) → RRF → cross-encoder re-rank → MMR |
| **RAG Quality Pipeline** | Citation enforcement, hallucination check, self-consistency (3 samples), confidence scoring |
| **Graph Integration** | Kuzu schema with entity/relation extraction, neighborhood/concept expansion queries |
| **Source Attribution** | Full provenance per chunk (content_hash, source_modified_at, credibility_score) |
| **Freshness Strategies** | Real-time (CDC/webhook), scheduled, manual, full re-index — with SLA targets |
| **Model Migration** | Dual-write → shadow validation → canary → full cutover with 30-day rollback |
| **Multi-Tenant Isolation** | Physical (separate Qdrant collections, Kuzu DBs) + Logical (PG RLS, payload filters) |
| **Observability** | Per-operation metrics, span linking, ingestion monitoring, freshness alerting |
| **Cross-RFC Alignment** | Explicit integration points with RFC-0002 (KnowledgeEngine), RFC-0003 (events), RFC-0004 (Gateway RAG), RFC-0005 (Semantic Memory source) |

---

## 3. Weaknesses

| Area | Weakness |
|------|----------|
| **Ingestion Exactly-Once** | "Exactly-once" claimed but no idempotency key design; content hash alone insufficient for partial updates |
| **Partial Document Updates** | No strategy for updating only changed sections of large documents (re-chunks entire doc) |
| **RAG Hallucination Check** | "Self-consistency (3 samples)" vague — no verification against retrieved evidence |
| **Citation Verification** | Claims "citation verification" but no mechanism to verify LLM didn't fabricate citations |
| **Graph Population Reliability** | Event-driven extraction → Kuzu with no idempotency, no replay, no dead-letter handling |
| **Entity Linking Quality** | "Fuzzy match to existing entities" — no disambiguation strategy for common names |
| **Query Decomposition** | "Multi-hop?" placeholder — no actual multi-hop retrieval implementation |
| **Sparse Vector Details** | SPLADE mentioned but no index config, no token weighting strategy |
| **Conflict Detection** | "Conflict detection (contradicting sources)" listed but no algorithm or threshold |
| **Authority Boosting** | "Source credibility score" referenced but no credibility model defined |
| **Temporal Consistency** | No snapshot isolation for RAG — reads can see partially updated state during incremental sync |

---

## 4. Missing Components

| # | Component | Required By | Impact |
|---|-----------|-------------|--------|
| 1 | **Ingestion Idempotency Keys** | §5, §15 | Duplicate documents on retry/webhook replay |
| 2 | **Partial Document Update Strategy** | §5, §14 | Full re-chunk of large docs on minor changes |
| 3 | **RAG Citation Verification Algorithm** | §11, §13 | Fabricated citations undetectable |
| 4 | **Hallucination Detection vs Evidence** | §11 | Self-consistency ≠ factual grounding |
| 5 | **Graph Population DLQ & Replay** | §12, §17 | Failed entity extraction loses data silently |
| 6 | **Entity Disambiguation Pipeline** | §12 | Entity conflation (e.g., "Apple" company vs fruit) |
| 7 | **Multi-Hop Retrieval Implementation** | §11 | Complex queries fail (no decomposition) |
| 8 | **Source Credibility Model** | §10, §13 | Authority boost arbitrary without model |
| 9 | **Conflict Detection Algorithm** | §11 | Contradicting sources handled inconsistently |
| 10 | **Snapshot Isolation for RAG Reads** | §11, §15 | Stale/partial reads during incremental sync |
| 11 | **Sparse Vector Index Config** | §9, §10 | SPLADE/BM25 not configured in Qdrant |
| 12 | **Ingestion Backpressure / Rate Limiting** | §5 | Source overload cascades to pipeline |
| 13 | **Document Deletion Propagation** | §14, §15 | Orphaned vectors/graph nodes on delete |
| 14 | **Cost Attribution / Token Budgeting** | §9, §11 | No per-tenant embedding/LLM cost tracking |
| 15 | **Knowledge Versioning / Time Travel** | §14, §15 | No point-in-time query capability |

---

## 5. Architectural Risks

| Risk ID | Risk | Likelihood | Impact | Mitigation |
|---------|------|------------|--------|------------|
| **KNW-001** | **Ingestion Duplicate Storm** — Webhook retries + no idempotency = exponential duplicates | High | Critical | Add `ingestion_key = hash(source_id + content_hash + version)`; deduplicate at Temporal + Qdrant |
| **KNW-002** | **Graph Corruption via Failed Extractions** — Entity extraction failures silently drop relations | High | High | Per-stage DLQ (NATS); idempotent Kuzu upserts with `event_id`; replay API |
| **KNW-003** | **RAG Hallucination with Citations** — LLM invents plausible-looking citations | Medium | Critical | Post-generation verification: retrieve cited chunks → verify semantic entailment |
| **KNW-004** | **Entity Conflation** — "Apple" merges tech company + fruit + record label | Medium | High | Context-aware disambiguation (chunk context + type + co-occurrence) |
| **KNW-005** | **Stale RAG Context During Sync** — Incremental upsert creates mixed-version reads | Medium | High | Snapshot isolation via Qdrant collection aliases; versioned reads |
| **KNW-006** | **Embedding Model Drift** — No monitoring of relevance decay over time | Low | High | Periodic eval sets; A/B shadow traffic; automated drift alerts |
| **KNW-007** | **Multi-Hop Query Failure** — Complex queries return shallow results | Medium | High | Implement query decomposition → parallel sub-queries → synthesis |
| **KNW-008** | **Source Credential Rotation** — Connectors break when OAuth tokens expire | High | Medium | Credential manager integration (RFC-0007); automatic refresh + alerting |
| **KNW-009** | **Tenant Noisy Neighbor** — One tenant's bulk ingest starves others | Medium | High | Per-tenant Temporal namespace quotas; priority queues |
| **KNW-010** | **Legal/Compliance Delete Failure** — GDPR delete doesn't purge vectors/graph | Low | Critical | Cascading delete with verification; audit trail |

---

## 6. Recommendations

### 6.1 Structural Changes (Do Before Approval)

| # | Recommendation | Priority | Effort |
|---|----------------|----------|--------|
| 1 | **Add Ingestion Idempotency Design** — Define `ingestion_key` composition; Temporal deduplication; Qdrant upsert idempotency | Critical | Medium |
| 2 | **Define RAG Citation Verification** — Post-generation retrieval of cited chunks + NLI entailment check | Critical | Medium |
| 3 | **Add Graph Population DLQ** — Per-extractor NATS DLQ; idempotent Kuzu `MERGE` with `event_id`; replay API | Critical | Medium |
| 4 | **Implement Snapshot Isolation for RAG** — Qdrant collection aliases for versioned reads during sync | Critical | Low |
| 5 | **Add Entity Disambiguation Pipeline** — Context + type + co-occurrence scoring before merge | High | Medium |
| 6 | **Define Multi-Hop Retrieval** — Query decomposition → parallel retrieval → cross-document synthesis | High | Medium |
| 7 | **Define Source Credibility Model** — Scored attributes (domain authority, recency, user feedback, verification) | High | Low |
| 8 | **Add Conflict Detection Algorithm** — Pairwise NLI on top-K chunks; flag contradictions > threshold | High | Low |

### 6.2 Design Improvements (Post-Approval, Pre-Implementation)

| # | Recommendation | Priority | Effort |
|---|----------------|----------|--------|
| 9 | **Partial Document Update** — Diff-based chunk replacement for large docs | Medium | High |
| 10 | **Sparse Vector Index Config** — Add Qdrant sparse vector config for SPLADE/BM25 | Medium | Low |
| 11 | **Ingestion Backpressure** — Temporal rate limiting per source; circuit breakers | Medium | Medium |
| 12 | **Cascading Delete Verification** — Post-delete audit: verify zero orphaned vectors/nodes | Medium | Low |
| 13 | **Cost Attribution** — Per-tenant embedding token + LLM token tracking + budgets | Medium | Medium |
| 14 | **Knowledge Versioning** — Point-in-time queries via collection aliases + timestamp filters | Low | High |
| 15 | **Embedding Drift Monitoring** — Golden eval sets + periodic A/B relevance scoring | Low | Medium |

---

## 7. Required Changes Before Approval

### Critical (Must Fix — Blockers)

| ID | Change | Section | Description |
|----|--------|---------|-------------|
| **C-01** | **Ingestion Idempotency Keys** | §5, §15 | Define `ingestion_key = hash(tenant_id + source_id + document_path + content_hash + version)`; Temporal deduplication; Qdrant upsert with deterministic chunk IDs |
| **C-02** | **RAG Citation Verification** | §11, §13 | Add `VerifyCitations` step: for each citation, retrieve chunk → compute NLI (entailment/contradiction/neutral) vs answer span → reject/flag non-entailed |
| **C-03** | **Graph Population DLQ & Idempotency** | §12, §17 | Per-stage DLQ topics (`hermes.dlq.knowledge.entity_extraction`, etc.); Kuzu `MERGE` with `event_id` as idempotency key; admin replay API |
| **C-04** | **Snapshot Isolation for RAG Reads** | §11, §15 | Qdrant collection aliases (`knowledge_chunks_v{version}`); atomic alias swap on sync complete; RAG reads pinned to alias |

### High (Must Fix — Major Gaps)

| ID | Change | Section | Description |
|----|--------|---------|-------------|
| **H-01** | **Entity Disambiguation Pipeline** | §12 | Before entity merge: score candidates by (context similarity + type match + co-occurrence frequency); human review queue for ambiguous |
| **H-02** | **Multi-Hop Retrieval Implementation** | §11 | Query decomposition LLM → sub-queries → parallel hybrid search → cross-document synthesis → final answer |
| **H-03** | **Source Credibility Model** | §10, §13 | Define `CredibilityScore` = weighted (domain_authority × 0.4 + recency × 0.2 + user_feedback × 0.2 + verification_status × 0.2); store per source |
| **H-04** | **Conflict Detection Algorithm** | §11 | For top-K chunks: pairwise NLI; flag pairs with contradiction score > 0.8; include in RAG context with warning |
| **H-05** | **Sparse Vector Index Configuration** | §9, §10 | Add Qdrant sparse vector config for SPLADE/BM25; define token weighting; hybrid fusion with dense |
| **H-06** | **Ingestion Backpressure & Rate Limiting** | §5 | Per-source Temporal rate limits; circuit breaker on source errors; priority queue (real-time > scheduled > manual) |
| **H-07** | **Document Deletion Cascading & Verification** | §14, §15 | On delete: async job → delete Qdrant points + Kuzu nodes + PG rows → verification query → audit event |

---

## 8. Approval Decision

### **APPROVED WITH CHANGES**

**Conditions for Full Approval:**

1. **All 4 Critical changes (C-01 to C-04) implemented** in RFC-0006 v1.1
2. **All 7 High-priority changes (H-01 to H-07) documented** as follow-up ADRs with owners/timelines
3. **Cross-RFC contract tests signed off** with RFC-0002 (KnowledgeEngine), RFC-0003 (event envelopes), RFC-0004 (Gateway RAG), RFC-0005 (Semantic Memory consolidation)
4. **Security review** of ACL enforcement, PII redaction, multi-tenant isolation
5. **Capacity review** of Qdrant/Kuzu/PostgreSQL sizing for 50M vectors/tenant at P99 targets

---

> **RFC-0006 is approved as the architectural foundation for Hermes Knowledge and implementation planning may begin once the Critical conditions above are met.**

*Principal Enterprise Architect*  
*2026-07-24*