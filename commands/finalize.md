name: /finalize
summary: Evidence-based completion gate that enforces proof before "done"
usage:
  - Run before committing or claiming work is complete
  - Verifies build/tests, screenshots, and implementation tags
  - Creates `.verified` on success; git hooks block without it

steps:
  1. Auto-detect project type (Node/Python/Rust) and try builds/tests
  2. Check `.orchestration/evidence/` for screenshots (UI work)
  3. Enforce Zero-Tag Gate: `.orchestration/implementation-log.md` with required tags
  4. Score evidence and write report to `.orchestration/verification/verification-report.md`
  5. If score >= 5 and Zero-Tag Gate passes, write `.verified`

evidence_scoring:
  - Build success: +2
  - Tests passing: +3
  - Screenshots present: +2
  - Grep-able trace: +1
  - Minimum to pass: 5

zero_tag_gate:
  - Required file: `.orchestration/implementation-log.md` (non-empty)
  - Must contain at least one of:
    - `#FILE_CREATED`, `#FILE_MODIFIED`, `#COMPLETION_DRIVE`, `#PATH_DECISION`, `#SCREENSHOT_CLAIMED`
  - If `#SCREENSHOT_CLAIMED` is used (and not `CANNOT_CAPTURE_SECURITY_POLICY`), file must exist

git_hooks:
  - `githooks/pre-commit` blocks commit if `.verified` missing or stale
  - `githooks/pre-push` blocks push if `.verified` missing or stale
  - Install with: `scripts/install-git-hooks.sh`

examples:
  - Run finalize: `bash scripts/finalize.sh`
  - Install hooks: `bash scripts/install-git-hooks.sh`

notes:
  - Build/tests auto-skip when no configuration is detected
  - This repository includes minimal local enforcement; no global deps required
  - See `docs/RESPONSE_AWARENESS_TAGS.md` for tag definitions and usage examples

