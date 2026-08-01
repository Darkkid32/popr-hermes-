# RFC-0006 Review Items Addressed

**Source Review:** RFC-0006-Architectural-Review.md (Principal Enterprise Architect Review)  
**Date:** 2026-07-24  
**RFC Version:** 1.0 → 1.1  
**Status:** All Critical and High items addressed (11/11)

---

## Critical Items (4/4 Addressed)

### C-01: Ingestion Idempotency Keys
**Review Finding:** "Exactly-once" claimed but no idempotency key design; content hash alone insufficient for partial updates

**Resolution in v1.1:**
- Added §5.5: Formal idempotency key composition
  ```
  ingestion_key = hash(tenant_id + "|" + source_id + "|" + document_path + "|" + content_hash + "|" + document_version)
  ```
- **Temporal Deduplication**: Workflow execution keyed by `ingestion_key`; duplicate events deduped at workflow start
- **Qdrant Upsert Idempotency**: Deterministic `chunk_id = hash(ingestion_key + "|" + chunk_index)`; upsert replaces existing
- **Kuzu Idempotent Merge**: `MERGE` with `event_id` as idempotency key (see §12.4)
- **Metadata Upsert**: PostgreSQL `ON CONFLICT DO UPDATE` on `document_id`
- **At-Least-Once Delivery**: NATS JetStream ack after all stores confirm; replay safe

**Sections Modified:** §5.5 (New), §7.5 (deterministic chunk_id), §12.4 (Kuzu idempotency)

---

### C-02: RAG Citation Verification
**Review Finding:** Claims "citation verification" but no mechanism to verify LLM didn't fabricate citations

**Resolution in v1.1:**
- Added `enable_citation_verification` flag to `RAGConfig` (§11.3)
- New §11.4: NLI-based verification pipeline
  ```
  For Each Citation in Generated Answer:
      1. Retrieve Cited Chunk (by chunk_id)
      2. Extract Answer Span (sentence containing citation)
      3. Compute NLI (Natural Language Inference)
         Premise: Cited chunk text
         Hypothesis: Answer span
         Model: cross-encoder NLI (e.g., DeBERTa-v3-large-mnli)
      4. Classify:
         ENTAILMENT → Citation verified ✓
         CONTRADICTION → Citation FALSE ✗ (flag/remove)
         NEUTRAL → Citation WEAK ⚠ (warn)
      5. Attach Verification Result to Citation Metadata
  ```
- Enhanced §11.5: Hallucination check now includes evidence grounding
  - For each claim in answer: find supporting chunks → compute entailment score
  - Unsupported claims → flag/remove
- §11.6: Added `citation_verifications` and `hallucination_check` to `RAGAnswer`
- §16: Added `VerifyCitations` gRPC method with `VerifyCitationsRequest/Response`

**Sections Modified:** §11.3, §11.4 (New), §11.5 (Enhanced), §11.6, §16

---

### C-03: Graph Population DLQ & Idempotency
**Review Finding:** Event-driven extraction → Kuzu with no idempotency, no replay, no dead-letter handling

**Resolution in v1.1:**
- New §12.4: Complete graph population DLQ design
- Per-stage DLQ topics:
  - `hermes.dlq.knowledge.entity_extraction`
  - `hermes.dlq.knowledge.relation_extraction`
  - `hermes.dlq.knowledge.entity_linking`
- Kuzu idempotent upserts using `MERGE` with `event_id` as idempotency key:
  ```cypher
  MERGE (e:Entity {id: $entity_id})
  ON CREATE SET e += $props, e.created_at = $timestamp, e.event_id = $event_id
  ON MATCH SET e += $props, e.updated_at = $timestamp, e.event_id = $event_id
  ```
- Relation upsert with event_id:
  ```cypher
  MATCH (a:Entity {id: $source_id}), (b:Entity {id: $target_id})
  MERGE (a)-[r:RELATED_TO {type: $relation_type}]->(b)
  ON CREATE SET r += $props, r.event_id = $event_id
  ON MATCH SET r += $props, r.event_id = $event_id
  ```
- Exponential backoff retry, alert on DLQ depth > 50, manual reprocess API
- §17.1: Added `v1.hermes.knowledge.graph.dlq` published event

**Sections Modified:** §12.4 (New), §17.1

---

### C-04: Snapshot Isolation for RAG Reads
**Review Finding:** No snapshot isolation for RAG — reads can see partially updated state during incremental sync

**Resolution in v1.1:**
- New §15.3: Collection alias strategy
  ```
  knowledge_chunks_v1  ← Active read alias (RAG reads pinned here)
  knowledge_chunks_v2  ← Write target (incremental sync writes here)
  
  Sync Cycle:
      1. Incremental sync writes to knowledge_chunks_v2
      2. On sync complete: atomic alias swap (v1 ↔ v2)
      3. RAG reads continue on new alias with consistent snapshot
      4. Old alias becomes next write target
  ```
- Benefits:
  - Zero-downtime reads
  - Consistent snapshot during sync
  - Instant rollback (swap alias back)
  - No mixed-version reads
- §20: Performance targets unchanged (alias swap is O(1))

**Sections Modified:** §15.3 (New), §20

---

## High-Priority Items (7/7 Addressed)

### H-01: Entity Disambiguation Pipeline
**Review Finding:** "Fuzzy match to existing entities" — no disambiguation strategy for common names

**Resolution in v1.1:**
- §12.2 Enhanced: Full disambiguation pipeline
  - **Candidate Generation**: Fuzzy match (name + type) → top 10
  - **Context Scoring**:
    - Chunk context similarity (embedding cosine): weight 0.5
    - Type compatibility: weight 0.3
    - Co-occurrence frequency (tenant-wide): weight 0.2
  - **Scoring**: Weighted sum
  - **Thresholds**:
    - > 0.85 → Auto-merge
    - 0.60-0.85 → Human review queue (Mission Control)
    - < 0.60 → Create new entity
  - **Confidence** = max(candidate_score)
- §12.4: Human review queue integrated into DLQ processing

**Sections Modified:** §12.2, §12.4

---

### H-02: Multi-Hop Retrieval Implementation
**Review Finding:** "Multi-hop?" placeholder — no actual multi-hop retrieval implementation

**Resolution in v1.1:**
- §11.1: Added "Decomposition (multi-hop)" to Query Understanding
- New §11.2: Complete multi-hop implementation
  ```
  Complex Query
      │
      ├─▶ Query Decomposition (LLM)
      │       ├─▶ Identify sub-questions
      │       ├─▶ Determine dependencies
      │       └─▶ Plan retrieval order
      │
      ├─▶ Parallel Sub-Query Execution
      │       ├─▶ Sub-query 1 → Hybrid Search → Results 1
      │       ├─▶ Sub-query 2 → Hybrid Search → Results 2
      │       └─▶ ...
      │
      ├─▶ Cross-Document Synthesis
      │       ├─▶ Merge results preserving provenance
      │       ├─▶ Resolve entity references across docs
      │       ├─▶ Detect contradictions (H-04)
      │       └─▶ Build unified context
      │
      └─▶ Final Answer Generation
  ```
- §16: Added `DecomposeQuery` gRPC with `SubQuery`, `QueryPlan` messages

**Sections Modified:** §11.1, §11.2 (New), §16

---

### H-03: Source Credibility Model
**Review Finding:** "Source credibility score" referenced but no credibility model defined

**Resolution in v1.1:**
- New §13.2: Complete `CredibilityScore` model
  ```protobuf
  message CredibilityScore {
      float overall_score = 1;              // 0-1 (weighted composite)
      float domain_authority = 2;           // 0-1 (e.g., github.com=0.9, random-blog=0.3)
      float recency = 3;                    // 0-1 (exponential decay, half-life 90 days)
      float user_feedback = 4;              // 0-1 (thumbs up/down, weighted by user expertise)
      float verification_status = 5;        // 0-1 (verified=1, unverified=0.5, disputed=0)
      int64 computed_at_us = 6;
      string model_version = 7;
  }
  ```
- **Computation**: `overall_score = 0.4×domain_authority + 0.2×recency + 0.2×user_feedback + 0.2×verification_status`
- **Domain Authority Sources**:
  - Pre-seeded list (github.com=0.95, docs.aws.amazon.com=0.9, etc.)
  - Learned from user feedback over time
  - Configurable per tenant
- Stored per source; used in `authority_boost` (§10.2)

**Sections Modified:** §13.1 (CredibilityScore field), §13.2 (New), §10.2

---

### H-04: Conflict Detection Algorithm
**Review Finding:** "Conflict detection (contradicting sources)" listed but no algorithm or threshold

**Resolution in v1.1:**
- Added "Conflict detection" to Context Assembly (§11.1)
- Algorithm:
  - For top-K chunks: pairwise NLI
  - Flag pairs with contradiction score > 0.8
  - Include contradictions in RAG context with warning for LLM to address
- Triggered during context assembly after re-ranking, before answer generation

**Sections Modified:** §11.1, §11.3 (reference)

---

### H-05: Sparse Vector Index Configuration
**Review Finding:** SPLADE mentioned but no index config, no token weighting strategy

**Resolution in v1.1:**
- New §10.4: Complete Qdrant sparse vector configuration
  ```yaml
  collections:
    knowledge_chunks:
      vectors:
        dense:
          size: 1536
          distance: Cosine
        sparse:
          # SPLADE sparse vectors
          size: 30522  # vocab size
          # Or BM25: use Qdrant's built-in BM25
      
      hnsw_config:
        m: 32
        ef_construct: 256
        full_scan_threshold: 10000
        on_disk: false
      
      quantization:
        scalar:
          type: int8
          always_ram: true
      
      sharding:
        shard_number: 8
        replication_factor: 2
  ```
- §9.3: `generate_sparse` and `sparse_model` in `EmbeddingConfig` (bge-m3 or splade)

**Sections Modified:** §9.3, §10.4 (New)

---

### H-06: Ingestion Backpressure & Rate Limiting
**Review Finding:** No backpressure; source overload cascades to pipeline

**Resolution in v1.1:**
- New §5.6: Complete backpressure & rate limiting design
  - **Per-Source Rate Limits**: Temporal activity heartbeats + token bucket per source (configurable req/s, burst)
  - **Priority Queues**: Real-time (webhook/CDC) > Scheduled (polling) > Manual (upload)
  - **Circuit Breaker**: On source errors > 50% in 30s → pause source for 60s; exponential backoff
  - **Concurrency Limits**: Max parallel workflows per tenant (default: 50); per source (default: 10)
  - **Resource Quotas**: Per-tenant ingestion rate limit (default: 10K docs/hour); enforced at Temporal namespace

**Sections Modified:** §5.6 (New)

---

### H-07: Document Deletion Cascading & Verification
**Review Finding:** GDPR delete doesn't purge vectors/graph; orphaned data risk

**Resolution in v1.1:**
- New §14.3: Async cascading delete job
  ```
  Document Deletion Requested
      │
      ├─▶ Soft Delete (mark deleted, retain for audit)
      │
      ├─▶ Async Cascading Delete Job:
      │       ├─▶ Delete Qdrant points (filter: document_id)
      │       ├─▶ Delete Kuzu nodes (MATCH (d:Document {id: $id}) DETACH DELETE d)
      │       ├─▶ Delete PostgreSQL rows (document, chunks, metadata)
      │       │
      │       └─▶ Verification Queries:
      │               ├─▶ Qdrant: count points with document_id = 0
      │               ├─▶ Kuzu: count nodes with document_id = 0
      │               ├─▶ PG: count rows with document_id = 0
      │               └─▶ All must return 0
      │
      ├─▶ If Verification Fails:
      │       ├─▶ Retry up to 3 times
      │       ├─▶ Alert on-call
      │       └─▶ Manual intervention queue
      │
      └─▶ Emit Deletion Verified Event → v1.hermes.knowledge.document.deletion_verified
  ```
- §14.4: Added "Deletion Verification < 60 seconds" metric
- §17.1: Added `v1.hermes.knowledge.document.deletion_verified` event

**Sections Modified:** §14.3 (New), §14.4, §17.1

---

## Summary

| Priority | Total | Addressed | Deferred |
|----------|-------|-----------|----------|
| Critical | 4 | 4 | 0 |
| High | 7 | 7 | 0 |
| **Total** | **11** | **11** | **0** |

**All 11 Critical and High-priority review items have been fully incorporated into RFC-0006 v1.1.**