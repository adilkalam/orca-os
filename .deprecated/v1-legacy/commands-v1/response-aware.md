---
description: "Response-aware workflow (full / plan-only / build-from-blueprint via flags)"
allowed-tools: ["Task", "Read", "Write", "Edit", "MultiEdit", "Grep", "Glob", "Bash", "AskUserQuestion", "TodoWrite"]
argument-hint: "[-plan | -build] <feature or blueprint>"
---

# /response-aware — Response Awareness Workflow

Run the Response Awareness protocol with meta-cognitive tags and evidence capture to prevent false completion.

This is the preferred entrypoint, replacing `/respawr`, `/respawr-plan`, and `/respawr-build`.

## Task

Input: `$ARGUMENTS`

Interpret the **first argument** as a mode flag when present:
- No flag → **FULL MODE** (plan → implement → verify)
- `-plan` → **PLAN MODE** (blueprint only, no code)
- `-build` → **BUILD MODE** (implement + verify from an approved blueprint path)

---

## FULL MODE (no flag) — Plan → Implement → Verify

When called as:

```text
/response-aware <feature or request>
```

Run the full 6-phase Response Awareness workflow, using `.orchestration/reference/response-awareness.md` as the operating guide:

1. **Phase 0 — Survey (optional, for unfamiliar/large scope)**  
   - Map domains, integration points, interfaces worth stabilizing.

2. **Phase 1 — Parallel Planning**  
   - Dispatch domain planners in parallel.  
   - Record `#PATH_DECISION` and risks for each path.

3. **Phase 2 — Synthesis**  
   - Select the path; produce a single implementation blueprint with explicit interfaces and risks.  
   - Use `AskUserQuestion` to present the blueprint and get confirmation before code.

4. **Phase 3 — Implementation**  
   - Implement strictly against the approved blueprint.  
   - Tag assumptions and file operations with `#COMPLETION_DRIVE`, `#FILE_CREATED`, `#FILE_MODIFIED`, `#SCREENSHOT_CLAIMED`, etc.

5. **Phase 4 — Verification**  
   - Resolve all tags deterministically using tests, builds, screenshots, and logs.  
   - Evidence should be captured via helpers like `scripts/capture-build.sh`, `scripts/capture-tests.sh`, `scripts/capture-screenshot.sh` into `.orchestration/evidence/`.

6. **Phase 5 — Final Synthesis**  
   - Report decisions, tradeoffs, and attach evidence.  
   - Ensure `bash scripts/finalize.sh` has been run to produce `.verified` when appropriate.

Notes:
- Tags go to `.orchestration/implementation-log.md`.  
- The orchestrator owns the plan; implementers do not mutate it.

---

## PLAN MODE (`-plan`) — Blueprint Only, No Code

When called as:

```text
/response-aware -plan <feature or request>
```

Behave like the Response Awareness **plan-only** mode:

1. Optionally survey unfamiliar code to map domains and interfaces.  
2. Run parallel domain planners; record `#PATH_DECISION` with rationale.  
3. Synthesize into a single implementation blueprint with explicit interfaces and risks.  
4. Use `AskUserQuestion` to present the blueprint and wait for confirmation before **any** code changes.

You **must not** modify code or files in `-plan` mode; stop after producing the blueprint and getting/recording approval.

Tip: After approval, the user will typically run:

```text
/response-aware -build <path-to-blueprint.md>
```

---

## BUILD MODE (`-build`) — Implement & Verify from Blueprint

When called as:

```text
/response-aware -build <blueprint-path.md>
```

Treat `$ARGUMENTS` as the path to an approved blueprint markdown file and:

1. Load the blueprint and allocate focused work packages to implementers.  
2. Implement strictly from the blueprint without mutating it; tag assumptions and file operations with the standard Response Awareness tags (`#COMPLETION_DRIVE`, `#FILE_CREATED`, `#FILE_MODIFIED`, `#FILE_DELETED`, `#SCREENSHOT_CLAIMED`, etc.).  
3. Capture evidence with helpers (`scripts/capture-build.sh`, `scripts/capture-tests.sh`, `scripts/capture-screenshot.sh`) into `.orchestration/evidence/`.  
4. Run tests/builds and resolve every tag deterministically.  
5. Run `bash scripts/finalize.sh` to produce `.verified` and synthesize a final report summarizing decisions and evidence.

In `-build` mode you **do not** re-plan; you execute the existing blueprint and close the loop with real proof.

---

## Legacy Aliases

`/respawr`, `/respawr-plan`, and `/respawr-build` remain as aliases but are deprecated in favor of:
- `/response-aware <feature>` — full workflow  
- `/response-aware -plan <feature>` — plan-only  
- `/response-aware -build <blueprint.md>` — implement & verify from blueprint

