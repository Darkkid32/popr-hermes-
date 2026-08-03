# Deployment Guide

## Hermes Platform v1.0-rc1

---

## Prerequisites

### System Requirements
- Node.js 20+
- pnpm 9.x
- 2GB+ RAM for build
- 1GB+ disk space for build artifacts

### Network Requirements
- HTTPS (TLS 1.2+) for production
- WSS for WebSocket connections
- Outbound access to API endpoints
- CDN for static assets (recommended)

---

## Build Process

### 1. Install Dependencies
```bash
pnpm install --frozen-lockfile
```

### 2. Verify Environment
```bash
# Check Node version
node --version  # >= 20.0.0

# Check pnpm version
pnpm --version  # >= 9.0.0
```

### 3. Build
```bash
# Clean build
rm -rf dist
pnpm build

# Output: dist/ directory with production assets
```

### 4. Verify Build
```bash
# Check output
ls -la dist/assets/

# Expected: 23 JS chunks + 1 CSS + index.html
# Main bundle: ~297 KB (92 KB gzipped)
# Largest chunk: AgentMesh3D ~953 KB (258 KB gzipped)
```

---

## Deployment Targets

### Static Hosting (Netlify, Vercel, Cloudflare Pages)
```bash
# Build command
pnpm build

# Output directory
dist/

# SPA redirects: /* → /index.html
```

### Nginx/Apache
```bash
# Copy dist/ to web root
cp -r dist/* /var/www/hermes/

# Configure nginx (see OPERATIONS_RUNBOOK.md)
```

### Docker
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
```

### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hermes-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hermes-frontend
  template:
    metadata:
      labels:
        app: hermes-frontend
    spec:
      containers:
      - name: frontend
        image: hermes-frontend:v1.0-rc1
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: hermes-frontend
spec:
  selector:
    app: hermes-frontend
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

---

## Environment Configuration

### Required Variables
```bash
# .env.production
VITE_WS_URL=wss://api.example.com/ws
VITE_API_URL=https://api.example.com
VITE_APP_TITLE="Hermes Platform"
VITE_CSP_REPORT_URI=https://csp.example.com/report
```

### Build-time Injection
Vite replaces `import.meta.env.VITE_*` at build time.

---

## SSL/TLS Configuration

### Certificates
- Use Let's Encrypt (auto-renew) or valid CA cert
- TLS 1.2 minimum, TLS 1.3 preferred
- HSTS with preload recommended

### HSTS
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

---

## CDN Configuration

### Cloudflare / CloudFront / Akamai
- Cache `/assets/*` with 1 year TTL
- Cache `index.html` with no-cache
- Enable Brotli/Gzip compression
- Enable HTTP/2 or HTTP/3

### Cache Rules
| Path | TTL | Headers |
|------|-----|---------|
| `/assets/*.js` | 1 year | `Cache-Control: public, max-age=31536000, immutable` |
| `/assets/*.css` | 1 year | `Cache-Control: public, max-age=31536000, immutable` |
| `/index.html` | 0 | `Cache-Control: no-cache, must-revalidate` |

---

## Security Configuration

### Content Security Policy
CSP is embedded in `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https: wss:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" />
```

### Additional Headers (Server-side)
```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

---

## WebSocket Configuration

### Production Endpoint
```bash
VITE_WS_URL=wss://api.example.com/ws
```

### Proxy Configuration (nginx)
```nginx
location /ws/ {
    proxy_pass http://websocket-backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 86400;
    proxy_send_timeout 86400;
}
```

### Load Balancer
- Enable WebSocket support
- Sticky sessions not required (stateless)
- Health check: `/ws/health` (101 Switching Protocols)

---

## Post-Deployment Verification

### Smoke Tests
```bash
# 1. Homepage loads
curl -I https://hermes.example.com/
# Expect: 200 OK, text/html

# 2. Assets load
curl -I https://hermes.example.com/assets/index-*.js
# Expect: 200 OK, application/javascript

# 3. CSS loads
curl -I https://hermes.example.com/assets/index-*.css
# Expect: 200 OK, text/css

# 4. WebSocket
# Use wscat or browser console
wscat -c wss://api.example.com/ws
# Expect: 101 Switching Protocols
```

### Functional Tests
1. Navigate to all 10 workspaces
2. Verify lazy loading works (Network tab)
3. Test WebSocket reconnect (disconnect/reconnect)
4. Test offline mode (disconnect network)
5. Verify CSP headers present

---

## Rollback Procedure

### Quick Rollback (< 2 min)
```bash
# Docker
docker service update --image hermes-frontend:previous hermes_frontend

# Nginx (symlink swap)
ln -sfn /var/www/hermes/previous /var/www/hermes/current
nginx -s reload
```

### Full Rollback
```bash
git revert <bad-commit>
git push origin main
# CI/CD rebuilds and deploys automatically
```

---

## Troubleshooting

| Issue | Check | Fix |
|-------|-------|-----|
| White screen | JS errors in console | Check CSP, build errors |
| WebSocket fails | Network tab, WS handshake | Check proxy, CSP `connect-src` |
| Assets 404 | Nginx config, base path | Check `base` in vite.config.ts |
| CSP errors | Browser console | Add domains to CSP |
| Slow load | Network tab, Lighthouse | Enable CDN, check chunk sizes |

---

## Support Contacts

| Issue | Contact |
|-------|---------|
| Deployment | Platform Team |
| Security | Security Team |
| Performance | SRE Team |
| General | #hermes-platform |

---

**Deployment Guide Version**: 1.0  
**Last Updated**: 2026-08-04  
**Next Review**: Post-GA