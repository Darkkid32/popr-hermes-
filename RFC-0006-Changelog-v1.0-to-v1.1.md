# RFC-0006 Changelog: v1.0 → v1.1

**Date:** 2026-07-24  
**Author:** Chief System Architect  
**Based On:** Principal Enterprise Architect Review (RFC-0006-Architectural-Review.md)

---

## Summary of Changes

| Category | Count | Items |
|----------|-------|-------|
| **Critical Changes** | 4 | C-01 through C-04 |
| **High-Priority Changes** | 7 | H-01 through H-07 |
| **Total Review Items Addressed** | 11 | 100% of Critical + High |

---

## Critical Changes (C-01 to C-04)

### C-01: Ingestion Idempotency Keys
**Sections Updated:** §5.5 (New), §7.5 (chunk_id deterministic), §12.4 (Kuzu idempotency)

**Changes:**
- Added §5.5: Formal idempotency key composition: `ingestion_key = hash(tenant_id + "|" + source_id + "|" + document_path + "|" + content_hash + "|" + document_version)`
- Guarantees: Temporal deduplication, Qdrant deterministic `chunk_id`, Kuzu `MERGE` with `event_id`, PostgreSQL `ON CONFLICT DO UPDATE`
- NATS JetStream ack only after all stores confirm; replay safe

### C-02: RAG Citation Verification
**Sections Updated:** §11.3 (RAGConfig), §11.4 (New), §11.5 (Enhanced), §11.6 (Response), §16 (APIs)

**Changes:**
- Added `enable_citation_verification` flag to `RAGConfig`
- New §11.4: NLI-based verification pipeline — for each citation, retrieve chunk → compute entailment (Premise: chunk, Hypothesis: answer span) → classify ENTAILMENT/VERIFIED, CONTRADICTION/FALSE, NEUTRAL/WEAK
- Enhanced §11.5: Hallucination check now includes evidence grounding (find supporting chunks → compute entailment)
- §11.6: Added `citation_verifications` and `hallucination_check` to `RAGAnswer`
- §16: Added `VerifyCitations` gRPC method with `VerifyCitationsRequest/Response`

### C-03: Graph Population DLQ & Idempotency
**Sections Updated:** §12.4 (New), §17.1 (DLQ event)

**Changes:**
- New §12.4: Complete graph population DLQ design with per-stage topics (`hermes.dlq.knowledge.entity_extraction`, `relation_extraction`, `entity_linking`)
- Kuzu idempotent upserts using `MERGE` with `event_id` as idempotency key
- Exponential backoff retry, alert on DLQ depth > 50, manual reprocess API
- §17.1: Added `v1.hermes.knowledge.graph.dlq` published event

### C-04: Snapshot Isolation for RAG Reads
**Sections Updated:** §15.3 (New), §20 (Performance)

**Changes:**
- New §15.3: Collection alias strategy (`knowledge_chunks_v1` ↔ `knowledge_chunks_v2`)
- Incremental sync writes to inactive alias; atomic alias swap on completion
- RAG reads pinned to active alias → consistent snapshot, zero-downtime, instant rollback
- No mixed-version reads during sync

---

## High-Priority Changes (H-01 to H-07)

### H-01: Entity Disambiguation Pipeline
**Sections Updated:** §12.2 (Enhanced), §12.4 (Human review queue)

**Changes:**
- §12.2: Added candidate generation (fuzzy match → top 10), context scoring (embedding cosine 0.5 + type 0.3 + co-occurrence 0.2), thresholds (auto-merge >0.85, human review 0.60-0.85, new entity <0.60)
- §12.4: Human review queue integrated into DLQ processing

### H-02: Multi-Hop Retrieval Implementation
**Sections Updated:** §11.1 (Pipeline), §11.2 (New), §16 (API)

**Changes:**
- §11.1: Added "Decomposition (multi-hop)" to Query Understanding
- New §11.2: Query Decomposition → Parallel Sub-Query Execution → Cross-Document Synthesis → Final Answer
- §16: Added `DecomposeQuery` gRPC with `SubQuery`, `QueryPlan` messages

### H-03: Source Credibility Model
**Sections Updated:** §13.2 (New), §13.1 (CredibilityScore field)

**Changes:**
- New §13.2: `CredibilityScore` = 0.4×domain_authority + 0.2×recency + 0.2×user_feedback + 0.2×verification_status
- Domain authority pre-seeded (github.com=0.95, docs.aws.amazon.com=0.9, etc.) + learned from feedback
- Configurable per tenant; stored per source; used in `authority_boost` (§10.2)

### H-04: Conflict Detection Algorithm
**Sections Updated:** §11.1 (Pipeline), §11.3 (Config reference)

**Changes:**
- Added "Conflict detection" to Context Assembly
- Algorithm: Pairwise NLI on top-K chunks; flag contradictions with score > 0.8
- Contradictions included in RAG context with warning for LLM to address

### H-05: Sparse Vector Index Configuration
**Sections Updated:** §10.4 (New), §9.3 (sparse_model config)

**Changes:**
- New §10.4: Complete Qdrant sparse vector config for SPLADE/BM25
- `vectors.sparse.size: 30522` (vocab) with HNSW + int8 quantization
- `generate_sparse` and `sparse_model` in `EmbeddingConfig` (§9.3)

### H-06: Ingestion Backpressure & Rate Limiting
**Sections Updated:** §5.6 (New)

**Changes:**
- Per-source token bucket rate limits (configurable req/s, burst)
- Priority queues: Real-time > Scheduled > Manual
- Circuit breaker: 50% errors in 30s → pause 60s with exponential backoff
- Concurrency limits: 50 workflows/tenant, 10/source
- Per-tenant ingestion quota: 10K docs/hour at Temporal namespace

### H-07: Document Deletion Cascading & Verification
**Sections Updated:** §14.3 (New), §14.4 (Metrics), §17.1 (Event)

**Changes:**
- New §14.3: Async cascading delete job → delete Qdrant points + Kuzu nodes + PG rows → verification queries (all must return 0) → retry 3x → alert → manual queue
- §14.4: Added "Deletion Verification < 60 seconds" metric
- §17.1: Added `v1.hermes.knowledge.document.deletion_verified` event

---

## Additional Improvements

| Area | Enhancement |
|------|-------------|
| **Design Principles** | Added "Resilient by Default" and "Consistency-Aware" |
| **Chunking** | §7.4: Partial document update strategy using section-level hashes |
| **Metadata** | §8.3: Added `section_hashes` for partial updates |
| **RAGConfig** | Added `enable_citation_verification` flag |
| **Events** | Added `deletion_verified`, `graph.dlq` events |
| **APIs** | Added `VerifyCitations`, `DecomposeQuery` gRPC methods |
| **Diagrams** | Updated Mermaid diagrams to reflect new components |

---

## Files Modified

| File | Description |
|------|-------------|
| `RFC-0006-Hermes-Knowledge-Architecture-v1.1.md` | Canonical RFC v1.1 |
| `RFC-0006-Changelog-v1.0-to-v1.1.md` | This document |
| `RFC-0006-Review-Items-Addressed.md` | Detailed mapping of all 11 items |
| `RFC-0006-Deferred-Items.md` | Zero Critical/High deferred; 15+ Medium as ADRs |
| `RFC-0006-Architectural-Review.md` | Original review (unchanged) |

---

**All 11 Critical and High-priority review items have been fully incorporated into RFC-0006 v1.1.**