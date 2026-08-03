# Known Limitations

## Hermes Platform v1.0-rc1

---

## Overview

This document catalogs known limitations in Hermes Platform v1.0-rc1. These are documented trade-offs, not bugs.

---

## Performance Limitations

### 1. AgentMesh3D Bundle Size
- **Issue**: AgentMesh3D chunk is 953 KB (258 KB gzipped)
- **Cause**: three.js not tree-shaken; entire library bundled
- **Impact**: Slower initial load for Mission Control
- **Mitigation**: Lazy-loaded with Mission Control; non-critical path
- **Planned Fix**: Tree-shake three.js imports in Phase 11

### 2. Heavy Library Chunks
| Library | Workspace | Size (gz) |
|---------|-----------|-----------|
| three.js | Mission Control | 258 KB |
| recharts | Models/Analytics | ~12 KB |
| @xyflow/react | Automation | ~15 KB |
| @react-three/fiber | Mission Control | Included in three.js |

**Impact**: Acceptable for RC1; optimization planned for GA.

### 3. Single Test File
- **Coverage**: Only ErrorBoundary tested (2 tests)
- **Risk**: Low for RC1; core error handling validated
- **Planned**: Store tests, component tests, E2E tests in Phase 11

---

## Accessibility Limitations

### 1. Three.js Canvas (AgentMesh3D)
- **Issue**: 3D visualization not screen reader accessible
- **Mitigation**: Text summary in status cards
- **Status**: Non-core feature; acceptable for RC1

### 2. Custom Chart Components
- **Issue**: SVG charts lack data table alternative
- **Mitigation**: Statistical summaries in text panels
- **Planned**: Data table alternative in Phase 11

### 3. Drag/Drop (react-flow)
- **Issue**: Keyboard alternative needed for drag operations
- **Mitigation**: Command Palette provides alternative actions
- **Planned**: Keyboard shortcuts for all drag actions in Phase 11

---

## Security Limitations

### 1. React Router CSRF Vulnerability
- **Issue**: GHSA-qwww-vcr4-c8h2 (RSC Mode CSRF Bypass)
- **Affected**: react-router 7.18.0
- **Impact**: Not exploitable - Hermes is pure SPA (CSR), not RSC
- **Status**: Accepted for RC1; upgrade to 8.3.0+ planned for GA

### 2. Dev Dependency Vulnerabilities
| Package | Severity | Issue |
|---------|----------|-------|
| vite | High | Path traversal in dev server |
| vitest | High | Path traversal in test runner |
| @vitest/mocker | High | Path traversal in mocker |

**Assessment**: Development-only tools, not in production bundle.

### 3. Token Storage
- **Current**: localStorage (encrypted in production)
- **Risk**: XSS could exfiltrate tokens
- **Planned**: Migrate to HttpOnly cookies for GA

### 4. CSP `unsafe-eval`
- **Required**: React development tools, hot module replacement
- **Risk**: Medium (eval allows arbitrary code execution)
- **Mitigation**: Only in development; production CSP can be stricter

### 5. Basic HTML Sanitization
- **Current**: `createSafeHtml()` basic regex-based
- **Risk**: May not catch all XSS vectors
- **Planned**: Replace with DOMPurify for GA

---

## Functional Limitations

### 1. No Server-Side Rendering
- **Type**: Pure SPA (Client-Side Rendering)
- **Impact**: SEO limited, initial load dependent on JS
- **Mitigation**: Acceptable for dashboard/application use case

### 2. Offline Queue Persistence
- **Storage**: localStorage only
- **Limit**: ~5-10 MB quota
- **Risk**: Large offline mutations may exceed quota
- **Mitigation**: Auto-cleanup after 5 minutes success

### 3. WebSocket Reconnection
- **Max attempts**: Unlimited with exponential backoff
- **Max delay**: 15 seconds
- **Risk**: Extended outages may cause delayed reconnection

### 4. Single Test File
- **Coverage**: Only ErrorBoundary (2 tests)
- **Gap**: No store tests, component tests, integration tests
- **Planned**: Comprehensive test suite in Phase 11

### 5. Dev Dependencies
| Package | Vulnerabilities | Impact |
|---------|-----------------|--------|
| vite | 3 (High/Moderate) | Dev server only |
| vitest | 3 (High) | Test runner only |

**Assessment**: Not in production bundle; acceptable for RC1.

---

## Browser Compatibility

### Supported
| Browser | Version |
|---------|---------|
| Chrome | 100+ |
| Firefox | 100+ |
| Safari | 15+ |
| Edge | 100+ |

### Required Features
- ES2020 (optional chaining, nullish coalescing)
- WebSocket
- localStorage
- Web Crypto API (CSP nonce)
- IntersectionObserver (lazy loading)

### Not Supported
- IE 11
- Safari < 15 (no top-level await support)

---

## Scalability Limits

| Dimension | Current Limit | Headroom |
|-----------|---------------|----------|
| Concurrent WS connections | 1000+/server | 10x |
| Zustand store size | ~10 MB | 100x |
| Event bus log | 1000 entries | Configurable |
| Offline queue | localStorage quota | 5-10 MB |
| Bundle chunks | 23 | 100+ |

---

## Maintenance Windows

### Scheduled Maintenance
- **Frequency**: Monthly (first Saturday)
- **Window**: 02:00-04:00 UTC
- **Duration**: 30 minutes typical
- **Notification**: 72 hours advance notice

### Emergency Maintenance
- **Trigger**: Security patches, critical bugs
- **Window**: Immediate
- **Notification**: Real-time via status page

---

## Data Retention

| Data Type | Retention | Location |
|-----------|-----------|----------|
| Event logs | 1000 entries | Memory (circular) |
| Offline mutations | 5 min (success) / until sync | localStorage |
| User preferences | Indefinite | localStorage |
| Auth tokens | Session + 30 days | localStorage |
| WebSocket diagnostics | 50 samples | Memory (rolling) |

---

## Feature Flags (Phase 11+)

| Feature | Status | Target |
|---------|--------|--------|
| High contrast mode | Planned | Phase 11 |
| Font size preference | Planned | Phase 11 |
| ARIA live regions | Planned | Phase 11 |
| Keyboard shortcuts help | Planned | Phase 11 |
| DOMPurify integration | Planned | Phase 11 |
| HttpOnly cookie auth | Planned | Phase 11 |
| Tree-shaken three.js | Planned | Phase 11 |
| E2E test suite | Planned | Phase 11 |

---

## Acceptance Criteria for GA

- [ ] Tree-shake three.js (< 200 KB gzipped)
- [ ] DOMPurify integration
- [ ] HttpOnly cookie authentication
- [ ] react-router 8.3.0+
- [ ] E2E test suite (Playwright)
- [ ] Visual regression testing
- [ ] Load testing (1000 concurrent WS)
- [ ] CSP report-uri endpoint
- [ ] High contrast mode
- [ ] Font size preference
- [ ] Full axe-core automation
- [ ] Migration guides
- [ ] API documentation

---

**Status**: All documented limitations are **accepted for RC1** with clear mitigation paths and Phase 11+ resolution plans.