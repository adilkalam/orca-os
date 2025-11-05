---
description: "Full response-awareness workflow (plan → implement → verify)"
allowed-tools: ["Task", "Read", "Write", "Edit", "MultiEdit", "Grep", "Glob", "Bash", "AskUserQuestion", "TodoWrite"]
---

# Response Awareness – Full Workflow

Run the 6-phase protocol using meta-cognitive tags to prevent completion drift. Use `.orchestration/reference/response-awareness.md` as operating guide.

## Task

Feature/Request: $ARGUMENTS

## Phases

1) Phase 0 — Survey (if unfamiliar/large):
- Map domains, integration points, interfaces worth stabilizing.

2) Phase 1 — Parallel Planning:
- Dispatch domain planners in parallel; surface `#PATH_DECISION` and risks.

3) Phase 2 — Synthesis:
- Select paths; produce an implementation blueprint with explicit interfaces.
- AskUserQuestion to confirm blueprint.

4) Phase 3 — Implementation:
- Execute strictly against the blueprint; mark assumptions with tags.

5) Phase 4 — Verification:
- Resolve all tags deterministically (tests, builds, screenshots, logs).

6) Phase 5 — Final Synthesis:
- Report decisions, evidence, and remaining suggestions.

## Notes
- Every tag must be resolved in Phase 4.
- Orchestrator owns the plan; implementers don’t mutate it.

