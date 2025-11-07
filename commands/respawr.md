---
description: "RespAwR — Full Response Awareness workflow (plan → build → verify). Alias of /response-awareness."
allowed-tools: ["Task", "Read", "Write", "Edit", "MultiEdit", "Grep", "Glob", "Bash", "AskUserQuestion", "TodoWrite"]
---

# /respawr — Response Awareness (Full)

Run the full Response Awareness protocol with meta‑cognitive tags and evidence capture to prevent false completion.

## Task

Feature/Request: $ARGUMENTS

## Phases

1) Phase 0 — Survey (optional, for unfamiliar/large scope)
2) Phase 1 — Parallel Planning (surface `#PATH_DECISION`, risks)
3) Phase 2 — Synthesis (single blueprint + AskUserQuestion for approval)
4) Phase 3 — Build (implement strictly from blueprint; tag assumptions)
5) Phase 4 — Verify (tests/build/screenshots/logs; resolve all tags deterministically)
6) Phase 5 — Final Synthesis (decisions + evidence)

Notes:
- Tags go to `.orchestration/implementation-log.md`.
- Evidence goes to `.orchestration/evidence/` (use helper scripts).
- Finalize with `bash scripts/finalize.sh` to produce `.verified`.

