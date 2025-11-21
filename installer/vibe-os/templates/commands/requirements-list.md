---
description: "List all OS 2.0 requirements and their status"
allowed-tools: ["Read", "Glob"]
---

# /requirements-list – List Requirements

Show all requirements in `requirements/` with their status and key info.

---

## Instructions

1. Check `requirements/.current-requirement` for an active requirement.
2. List all folders under `requirements/` (excluding files like `.current-requirement` and `index.md`).
3. For each requirement folder:
   - Read its `metadata.json` (if present).
   - Extract:
     - `id`, `status`, `phase`, `started`, `lastUpdated`.
     - Progress (`discovery` and `detail` answered/total).
   - Prepare a brief summary line.
4. Sort:
   - Active first (if any), then complete, then incomplete, then by date (newest first).
5. Render a human-friendly summary similar to:

```text
📚 Requirements Documentation

🔴 ACTIVE: profile-picture-upload
   Phase: discovery (3/5) | Started: 30m ago
   Next: Discovery Q4

✅ COMPLETE:
2025-01-26-0900-dark-mode-toggle
   Status: Ready for implementation | 10 questions answered

⚠️ INCOMPLETE:
2025-01-24-1100-notification-system
   Status: Paused at detail (2/5) | Last: 2 days ago
```

Use `requirements/index.md` as a canonical list if present; otherwise reconstruct from folders.

