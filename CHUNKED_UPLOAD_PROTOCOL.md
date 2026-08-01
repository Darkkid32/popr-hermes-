# Chunked Upload Protocol — Session Summary

**Date:** 2025-07-23  
**Target:** `C:\Users\poove\.hermes\index.html` (served by `dashboard.py` on port 8765)  
**Status:** Protocol established — **no HTML uploaded yet**

---

## Protocol Established

| Item | Value |
|------|-------|
| **Staging dir** | `C:\Users\poove\.hermes\.staging\` |
| **Target file** | `C:\Users\poove\.hermes\index.html` |
| **Backup** | Skipped (no prior `index.html` exists) |
| **Chunk prefix** | `--- BEGIN CHUNK 4A PART X/N ---` |
| **Chunk suffix** | `--- END CHUNK 4A PART X/N ---` |
| **Receipt reply** | `got 4A part X/N` (no Ollama call) |
| **Assembly trigger** | `ASSEMBLE 4A` |
| **Atomic write** | `.tmp` → `os.replace()` |
| **Validation** | `<div>` balance, `<style>`/`<script>` closed, no truncated tail |
| **Ollama tuning** | `num_ctx=16384`, `num_predict=1024`, JSON-only replies |

---

## What Exists on Disk

```bash
C:\Users\poove\.hermes\
├── .staging\              # ✅ created, empty
├── dashboard.py           # ✅ serves index.html on :8765
├── dashboard_v1.0_backup.py  # old Python server backup
└── index.html             # ❌ NOT YET CREATED
```

---

## Next Steps

1. **You send** chunk 4A (wrapped in markers)
2. **I buffer** each part, reply `got 4A part X/N`
3. **You send** `ASSEMBLE 4A`
4. **I write** `index.html` atomically, validate, report bytes/lines
5. **Dashboard** at `http://localhost:8765` serves the new HTML

---

## Chunk 4A Design Spec (from earlier)

| Spec | Value |
|------|-------|
| **Lines** | ~800 |
| **Chunks** | 3 total (4A, 4B, 5) |
| **Style** | Dark glassmorphism |
| **Background** | `#15151F` |
| **Cards** | `rgba(31,31,43,0.55)` + backdrop blur |
| **Accents** | Violet `#A78BFA` + Cyan `#22D3EE` |
| **Fonts** | Inter Tight + JetBrains Mono |
| **Nav** | 5-tab pill navigation |
| **Vibe** | Apple-grade × NASA mission control |

---

**Ready when you are.** Send chunk 4A part 1/N.