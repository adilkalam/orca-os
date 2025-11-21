# I/O Contract Template (Include in Agent Docs)

- Inputs:
  - Required files/artifacts (paths)
  - Assumptions or preconditions
- Outputs:
  - Code artifacts (paths, naming)
  - Evidence/logs locations under `.orchestration/`
  - Documentation updates (if any)
- Acceptance:
  - Build/tests pass (or equivalent for stack)
  - Evidence score via `/finalize` meets profile threshold
  - No design guard critical issues (warn-only in Phase 2)
- Self-checks:
  - ls/rg/wc snippets to confirm outputs exist and are referenced
  - Add tags in `.orchestration/implementation-log.md` (#FILE_CREATED, #FILE_MODIFIED, #PATH_DECISION, #SCREENSHOT_CLAIMED)

Example Self-checks:
```bash
# Files exist
ls src/**/* | wc -l

# Tags present
rg -n "#FILE_CREATED|#FILE_MODIFIED|#PATH_DECISION|#SCREENSHOT_CLAIMED" .orchestration/implementation-log.md

# Evidence and logs
ls .orchestration/evidence/*
ls .orchestration/logs/*
```
