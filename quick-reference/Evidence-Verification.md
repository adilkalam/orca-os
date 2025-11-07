#!/usr/bin/env markdown

# Evidence & Finalization Quick Reference

Prove it, or it didn’t happen. This guide shows exactly how to collect evidence, run gates, and pass `/finalize`.

## Where Evidence Lives

- Orchestration control files → `.orchestration/` (required for gating)
  - user-request.md, implementation-log.md, orca-session, verification/verification-report.md
- Screenshots, build logs, test output → `.orchestration/evidence/`
- Runtime logs (builder/testers) → `.orchestration/logs/`
- Human-facing docs (optional) → project root or `/tmp/`

Commits are blocked for active ORCA sessions unless `.verified` exists (created by `bash scripts/finalize.sh`).

## Required Tags (Zero‑Tag Gate)

Add at least one of these lines to `.orchestration/implementation-log.md`:

```markdown
#FILE_CREATED: path/to/file
#FILE_MODIFIED: path/to/file
#COMPLETION_DRIVE: Assumption text
#PATH_DECISION: Chose A over B (reason)
#SCREENSHOT_CLAIMED: .orchestration/evidence/screenshots/after.png
```

UI work must include `#SCREENSHOT_CLAIMED:` and the file must actually exist under `.orchestration/evidence/`.

## Helper Scripts (Recommended)

Use these helpers to capture evidence into the correct folders automatically.

```bash
# Build logs (auto-detects or pass command after --)
bash scripts/capture-build.sh
# or
bash scripts/capture-build.sh -- npm run build

# Test logs (auto-detects or pass command after --)
bash scripts/capture-tests.sh
# or
bash scripts/capture-tests.sh -- pytest -q

# Screenshots via MCP (requests a screenshot and optionally waits until saved)
bash scripts/capture-screenshot.sh http://localhost:3000/path --wait-for 20
# custom name
bash scripts/capture-screenshot.sh http://localhost:3000/path --out after.png --wait-for 20
```

The screenshot script writes a request JSON to `.orchestration/evidence/requests/…` that your MCP watcher can fulfill by saving the image at the specified `output` path.

## Finalize

Run the finalization gate to score evidence and write `.verified` (required by git hook during ORCA sessions).

```bash
bash scripts/finalize.sh
```

What finalize checks:
- Build/test status (auto-detected)
- Screenshot presence (UI work requires ≥1)
- Zero‑Tag Gate: required tags in `.orchestration/implementation-log.md`
- Evidence score (PASS if score ≥ 5; prototype profile lowers threshold)
- Writes report to `.orchestration/verification/verification-report.md`

## Typical Flows

### Frontend UI change

```bash
npm run dev &
bash scripts/capture-build.sh
bash scripts/capture-tests.sh
bash scripts/capture-screenshot.sh http://localhost:3000/page --wait-for 20
bash scripts/finalize.sh
```

### Using respawr (plan → build → verify)

```bash
# Plan only; no code changes
/respawr-plan Add a search bar to header

# Implement and capture evidence along the way
/respawr-build Add a search bar to header

# Finalize verification gates
bash scripts/finalize.sh
```

### iOS app

```bash
xcodebuild clean && xcodebuild build | tee .orchestration/evidence/build/build-$(date +%Y%m%d-%H%M%S).log
xcrun simctl io booted screenshot .orchestration/evidence/screenshots/after-$(date +%s).png
bash scripts/finalize.sh
```

### Backend

```bash
bash scripts/capture-tests.sh -- pytest -q
bash scripts/finalize.sh
```

## Gotchas

- Evidence dumped to `/tmp/` will not be discovered; save to `.orchestration/evidence/`.
- UI changes without screenshots will fail finalize.
- Tag lines inside code fences are ignored by Zero‑Tag Gate (write them as plain lines).
- If finalize says “/finalize is only for orca team sessions”, create `.orchestration/orca-session` or run during an ORCA workflow.

## Related Docs

- `commands/orca.md` → Workflow, file policy, verification gates
- `agents/quality/verification-agent.md` → Verification steps and commands
- `README.md` → Overview and concepts
