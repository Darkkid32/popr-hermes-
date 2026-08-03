# Rollback Guide

## Hermes Platform v1.0-rc1

---

## Overview

This guide covers rollback procedures for Hermes Platform deployments.

---

## Rollback Types

| Type | Time | When to Use |
|------|------|-------------|
| **Quick Rollback** | < 2 min | Bad deploy, immediate issues |
| **Full Rollback** | 5-15 min | Major issues, data corruption |
| **Git Revert** | 15-30 min | Code defects, partial features |

---

## Quick Rollback (< 2 min)

### Docker Swarm
```bash
# 1. Check current image
docker service inspect hermes_web --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}'

# 2. Rollback to previous image
docker service update --image hermes-frontend:previous hermes_web

# 3. Verify
docker service ps hermes_web
```

### Kubernetes
```bash
# 1. Check current revision
kubectl rollout history deployment/hermes-frontend

# 2. Rollback to previous
kubectl rollout undo deployment/hermes-frontend

# 3. Verify
kubectl rollout status deployment/hermes-frontend
```

### Nginx (Symlink Swap)
```bash
# 1. Check current symlink
ls -la /var/www/hermes/current

# 2. Swap to previous
ln -sfn /var/www/hermes/previous /var/www/hermes/current

# 3. Reload nginx
nginx -s reload
```

### Static Hosting (Netlify/Vercel/Cloudflare)
```bash
# Netlify
netlify rollback <deploy-id>

# Vercel
vercel rollback <deployment-url>

# Cloudflare Pages
# Dashboard → Deployments → Rollback
```

---

## Full Rollback (5-15 min)

### When to Use
- Data corruption detected
- Major feature regression
- Security vulnerability
- Quick rollback insufficient

### Procedure

#### 1. Stop Traffic
```bash
# Nginx
nginx -s quit

# Kubernetes
kubectl scale deployment hermes-frontend --replicas=0

# Docker Swarm
docker service scale hermes_web=0
```

#### 2. Restore Previous Version
```bash
# Git revert
git revert <bad-commit> --no-edit
git push origin main

# CI/CD will rebuild and deploy
# Wait for build to complete
```

#### 3. Restore Data (if applicable)
```bash
# Frontend has no server-side database
# User data in localStorage - no server restore needed

# If using backend API:
# pg_restore -d hermes_db backup.sql
```

#### 4. Restart Services
```bash
# Nginx
nginx

# Kubernetes
kubectl scale deployment hermes-frontend --replicas=3

# Docker Swarm
docker service scale hermes_web=3
```

#### 5. Verify
```bash
# Health checks
curl -I https://hermes.example.com/

# Smoke tests
# - Homepage loads
# - All 10 workspaces accessible
# - WebSocket connects
# - No console errors
```

---

## Git Revert Rollback (15-30 min)

### When to Use
- Code defects that need proper fix
- Partial feature rollback
- Need to preserve history

### Procedure

#### 1. Identify Bad Commit
```bash
git log --oneline -20
# Find the commit to revert
```

#### 2. Revert
```bash
# Single commit
git revert <commit-hash> --no-edit

# Multiple commits
git revert <oldest>..<newest> --no-edit

# Merge commit
git revert -m 1 <merge-commit-hash>
```

#### 3. Push and Deploy
```bash
git push origin main
# CI/CD triggers build and deploy
```

#### 4. Verify
- Wait for CI/CD pipeline
- Run smoke tests
- Monitor error rates

---

## Data Rollback

### Frontend State (localStorage)
| Data | Key | Rollback Method |
|------|-----|-----------------|
| User Preferences | `hermes-preferences` | User can reset in Settings |
| Offline Queue | `hermes-offline-queue` | Auto-cleared on app load |
| Auth Token | `hermes-auth` | Auto-cleared on logout |
| Theme | `hermes-theme` | User can reset in Settings |

### No Server-Side Data
- **No database** in frontend
- All persistent data in localStorage
- User can clear via browser DevTools or Settings

---

## Database Rollback (If Applicable)

> **Note**: Hermes frontend has no database. This section only applies if you have a separate backend.

```bash
# PostgreSQL
pg_dump -h localhost -U postgres hermes > backup_$(date +%Y%m%d).sql
pg_restore -d hermes_db -c backup_file.sql

# With PITR (Point-in-Time Recovery)
# Configure WAL archiving + base backup
# Recovery target time
```

---

## Verification Checklist

After any rollback:

- [ ] Homepage loads (200 OK)
- [ ] All 10 workspaces accessible
- [ ] WebSocket connects successfully
- [ ] No console errors
- [ ] Authentication works
- [ ] Navigation works
- [ ] Real-time features work
- [ ] Offline mode works
- [ ] Error boundary catches errors

### Automated Verification
```bash
#!/bin/bash
# rollback-verify.sh

BASE_URL="https://hermes.example.com"

check() {
  local url=$1
  local expected=$2
  local actual=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url")
  
  if [ "$actual" = "$expected" ]; then
    echo "✅ $url: $actual"
  else
    echo "❌ $url: $actual (expected $expected)"
    exit 1
  fi
}

check "/" "200"
check "/mission" "200"
check "/models" "200"
check "/security" "200"

echo "✅ All checks passed"
```

---

## Post-Rollback Actions

### 1. Communicate
- Notify team in #hermes-platform
- Update status page
- Notify stakeholders if user-facing

### 2. Investigate
- Root cause analysis
- Create incident report
- Link to commit/PR

### 3. Prevent Recurrence
- Add test case
- Update runbook
- Code review process improvement

### 4. Re-deploy Fix
```bash
# Fix the issue
git commit -m "fix: <description>"

# Push
git push origin main

# Monitor deployment
```

---

## Rollback Decision Matrix

| Scenario | Recommended Rollback |
|----------|---------------------|
| Build fails | Don't deploy |
| Deploy succeeds, immediate errors | Quick rollback |
| Major feature broken | Quick rollback |
| Security issue | Quick rollback + patch |
| Minor bug | Git revert + redeploy |
| Data corruption | Full rollback + data restore |
| Performance regression | Git revert + profile |

---

## Contacts

| Role | Contact |
|------|---------|
| Release Manager | - |
| SRE On-call | - |
| Platform Lead | - |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-04 | Release Manager | Initial |

---

**Runbook Status**: ✅ COMPLETE