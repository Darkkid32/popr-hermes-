# Operations Runbook

## Hermes Platform v1.0-rc1

**Version**: 1.0-rc1  
**Date**: 2026-08-04  
**Audience**: Platform Operators, SRE, DevOps

---

## Quick Reference

| Item | Value |
|------|-------|
| **Application** | Hermes Platform |
| **Repository** | https://github.com/Darkkid32/popr-hermes-.git |
| **Current Release** | v1.0-rc1 (commit e337bb2) |
| **Build Command** | `pnpm build` |
| **Dev Server** | `pnpm dev` |
| **Preview** | `pnpm preview` |
| **Test** | `pnpm test` |
| **TypeCheck** | `pnpm typecheck` |
| **Lint** | `pnpm lint` |

---

## System Overview

### Architecture
- **Frontend**: React 19 + TypeScript 6 + Vite 8 + Rolldown
- **State**: Zustand (18 stores)
- **Routing**: React Router 7 (17 lazy-loaded routes)
- **Real-time**: WebSocket + EventBus + Presence + Offline Queue
- **Styling**: Tailwind CSS 4 + Design Tokens
- **Build**: Vite 8 + Rolldown (823ms build)

### Components
- 10 Workspaces (all lazy-loaded)
- 30 Platform Services
- 18 Zustand Stores (6 core + 12 integration)
- 205 Components (47 shared + ~150 workspace + 8 layout)

---

## Quick Start

### Development
```bash
# Install
pnpm install

# Start dev server
pnpm dev
# Runs on http://localhost:5173

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint

# Build
pnpm build

# Preview production build
pnpm preview
```

### Production Build
```bash
# Clean build
rm -rf dist
pnpm build

# Verify build
pnpm preview
```

---

## Configuration

### Environment Variables
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_WS_URL` | Yes | - | WebSocket endpoint |
| `VITE_API_URL` | Yes | - | REST API endpoint |
| `VITE_APP_TITLE` | No | "Hermes Platform" | Page title |
| `VITE_CSP_REPORT_URI` | No | - | CSP report endpoint |

### Build Configuration
- **Vite Config**: `vite.config.ts`
- **TypeScript**: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- **Tailwind**: `@tailwindcss/vite` plugin
- **Output**: `dist/` directory

---

## Deployment

### Prerequisites
- Node.js 20+
- pnpm 9.x
- HTTPS + WSS endpoints
- Reverse proxy (nginx/Cloudflare)
- CSP report endpoint (recommended)

### Build Artifacts
```
dist/
├── index.html
├── assets/
│   ├── index-CUX5z0Qu.js      (297 KB / 92 KB gz)  ← Main bundle
│   ├── AgentMesh3D-*.js       (953 KB / 258 KB gz) ← three.js
│   ├── MissionControl-*.js    (11 KB / 3 KB gz)
│   ├── AgentWorkspace-*.js    (19 KB / 6 KB gz)
│   ├── Models-*.js            (58 KB / 12 KB gz)
│   ├── Skills-*.js            (66 KB / 13 KB gz)
│   ├── Memory-*.js            (49 KB / 11 KB gz)
│   ├── Plugins-*.js           (51 KB / 10 KB gz)
│   ├── MCP-*.js               (55 KB / 10 KB gz)
│   └── 15 more workspace chunks
```

### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name hermes.example.com;
    
    root /var/www/hermes/dist;
    index index.html;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    
    # CSP is in index.html meta tag
    
    # Static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy (if needed)
    location /api/ {
        proxy_pass http://localhost:8765;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # WebSocket proxy
    location /ws/ {
        proxy_pass http://localhost:8765;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Docker Deployment
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Runtime stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
```

---

## Startup Procedure

### Pre-flight Checks
```bash
# 1. Verify dependencies
pnpm install --frozen-lockfile

# 2. Type check
pnpm typecheck

# 3. Lint
pnpm lint

# 4. Test
pnpm test

# 5. Build
pnpm build

# 6. Verify build size
ls -lh dist/assets/
```

### Startup Sequence
1. **Pre-deploy**: Run pre-flight checks
2. **Build**: Generate production assets
3. **Deploy**: Copy `dist/` to web server
4. **Configure**: Update nginx/reverse proxy
5. **Reload**: Reload nginx
6. **Verify**: Health check endpoints
7. **Smoke test**: Critical user flows

### Health Checks
| Endpoint | Expected | Timeout |
|----------|----------|---------|
| `/` | 200 OK, HTML | 5s |
| `/assets/*.js` | 200 OK, JS | 5s |
| `/assets/*.css` | 200 OK, CSS | 5s |
| WebSocket `/ws` | 101 Switching | 10s |

---

## Shutdown Procedure

### Graceful Shutdown
```bash
# 1. Drain connections
nginx -s quit

# 2. Wait for connections to drain
sleep 30

# 3. Force stop if needed
nginx -s stop
```

### WebSocket Cleanup
The application handles graceful WebSocket shutdown:
- `disconnect()` called on unload
- Message queue persisted to localStorage
- Reconnect state saved

---

## Monitoring

### Key Metrics
| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Page Load | < 3s | > 5s |
| JS Bundle Load | < 500ms | > 1s |
| WebSocket Connect | < 2s | > 5s |
| API Response | < 200ms | > 1s |
| Error Rate | < 0.1% | > 1% |

### Log Locations
- **Application**: Browser console + `logger.ts` (5000 entries)
- **WebSocket**: `ws:connected`, `ws:disconnected`, `ws:error` events
- **Event Bus**: `error:occurred` events with context
- **Server**: Nginx access/error logs

### Key Dashboards
- **Web Vitals**: LCP, FID, CLS
- **WebSocket**: Connection state, latency, quality score
- **Error Rate**: By type, workspace, user
- **Bundle Size**: Track over time

---

## Backup & Restore

### What to Backup
| Data | Location | Frequency |
|------|----------|-----------|
| User preferences | localStorage | Real-time |
| Offline queue | localStorage | Real-time |
| Offline mutations | localStorage | Real-time |
| Build artifacts | CI/CD artifacts | Per deploy |
| Source code | Git repository | Continuous |

### Restore Procedure
```bash
# 1. Restore source
git clone <repo>
cd hermes

# 2. Install dependencies
pnpm install --frozen-lockfile

# 3. Build
pnpm build

# 4. Deploy
# (copy dist/ to web server)

# 4. Verify
# Health checks + smoke tests
```

### User Data Recovery
User data is stored in:
- `localStorage`: preferences, offline queue, auth tokens
- `sessionStorage`: transient session state
- **No server-side user data** in frontend

---

## Troubleshooting

### Common Issues

#### Build Fails
```bash
# Clear cache
rm -rf node_modules dist .pnpm-store
pnpm install --frozen-lockfile
pnpm build
```

#### WebSocket Connection Fails
1. Check `VITE_WS_URL` environment variable
2. Verify WebSocket endpoint accessible
3. Check firewall/proxy allows WSS
4. Check CSP `connect-src` includes `wss:`

#### Build Size Warning
```
(!) Some chunks are larger than 500 kB
```
- **AgentMesh3D**: 953 KB (three.js) - lazy loaded, non-critical
- **Mitigation**: Already lazy-loaded with Mission Control

#### CSP Violations
1. Check browser console for CSP errors
2. Verify `connect-src` includes all API/WebSocket endpoints
3. Verify `script-src` includes `unsafe-eval` for dev tools
4. Report violations to CSP report URI

#### WebSocket Reconnection Issues
1. Check network connectivity
2. Verify endpoint health
3. Check reconnect attempts in diagnostics
4. Max 15s backoff with jitter

---

## Incident Response

### Severity Levels
| Level | Criteria | Response Time |
|-------|----------|---------------|
| **SEV-1** | Complete outage, data loss | 15 min |
| **SEV-2** | Major feature down, partial outage | 1 hour |
| **SEV-3** | Minor issue, workaround exists | 4 hours |
| **SEV-4** | Minor bug, cosmetic | Next sprint |

### Escalation
1. **On-call**: PagerDuty/Slack alert
2. **Team Lead**: 30 min if unresolved
3. **Engineering Manager**: 1 hour if unresolved
4. **CTO**: 2 hours if unresolved

### Post-Incident
1. Blameless postmortem within 48 hours
2. Action items tracked in issue tracker
3. Runbook updated if needed

---

## Rollback Procedure

### Immediate Rollback (< 5 min)
```bash
# 1. Revert to previous Docker image
docker tag hermes:previous hermes:current
docker service update --image hermes:current hermes_web

# OR nginx
ln -sfn /var/www/hermes/previous /var/www/hermes/current
nginx -s reload
```

### Full Rollback (> 5 min)
```bash
# 1. Revert git
git revert <bad-commit>
git push origin main

# 2. CI/CD rebuilds
# 3. Auto-deploys on success
```

### Database Rollback
Not applicable - no frontend database. User data in localStorage.

---

## Security Operations

### Certificate Rotation
- TLS certs: Let's Encrypt (auto-renew) or manual
- Monitor expiry: 30-day alert
- HSTS preload: Submit to hstspreload.org

### CSP Updates
1. Test in report-only mode
2. Deploy to staging
3. Monitor violations
4. Deploy to production

### Dependency Updates
```bash
# Monthly
pnpm audit
pnpm update --latest

# Security
pnpm audit --prod
# Fix vulnerabilities
```

---

## Capacity Planning

### Current Capacity
| Resource | Current | Headroom |
|----------|---------|----------|
| Bundle (gz) | 92 KB | 10x |
| Chunks | 23 | 100+ |
| WebSocket connections | N/A | 1000+ per server |
| Static bandwidth | ~2 MB/user | CDN cached |

### Scaling Triggers
- WebSocket connections > 80% capacity
- Build time > 2s
- Bundle size > 150 KB gzipped
- Page load > 3s p95

---

## Contacts

| Role | Contact | Slack |
|------|---------|-------|
| Platform Lead | - | #hermes-platform |
| SRE On-call | - | #hermes-oncall |
| Security | - | #hermes-security |
| Platform Team | - | #hermes-team |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-04 | Chief Software Architect | Initial |

---

**Runbook Status**: ✅ COMPLETE  
**Next Review**: Post-RC1 validation