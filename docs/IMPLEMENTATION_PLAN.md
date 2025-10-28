# Vibe Code System Rebuild — Implementation Plan (Concise v1)

Purpose: Deliver a lean, evidence‑gated, design‑first orchestration system optimized for mobile‑first web and iOS/RN apps, with project‑scoped design rules, a navigable Design Atlas, and persistent project memory.

---

## Principles

- Evidence over claims: one `/finalize` gate; proof or not done.
- Design first: strict when Design‑DNA exists; graceful fallback otherwise.
- Start‑Simple, escalate on evidence: no heavy router; escalate only when triggers fire.
- Few, strong agents with clear I/O contracts; orchestrator never implements.
- Project‑level memory via Workshop; playbooks learn from outcomes.
- Predictable artifacts, standard locations, clean deploys.

---

## Scope (What we will build)

1) Finalization Gate
- Command: `commands/finalize.md`
- Script: `scripts/finalize.sh`
- Behavior: build → tests → screenshots (UI) → tag verification → evidence score → write `.verified` → summary.
- Output:
  - `.orchestration/logs/build.log`, `test-output.log`
  - `.orchestration/verification/verification-report.md`
  - `.orchestration/evidence/` (screenshots)
  - `.verified`
- Git hooks: pre‑commit, pre‑push reject if `.verified` missing.

2) Zero‑Tag Gate (structural)
- Required file: `.orchestration/implementation-log.md` authored by implementation agents.
- Block Gate‑1 if empty/missing; instructions to emit `#FILE_CREATED`, `#FILE_MODIFIED`, `#COMPLETION_DRIVE`, `#PATH_DECISION`, `#SCREENSHOT_CLAIMED`.

3) Design Gating (DNA‑scoped)
- UI Guard reads `.claude/design-dna/*.json` (project scope): enforce tokens‑only, 4px base grid, typography/weights/tracking, class‑based grid sizing.
- If no DNA → warn‑only checks; suggest scaffolding tokens and creating DNA file; do not hard‑block.
- `design-reviewer` mandatory when DNA present; optional in Prototype profile.

4) Design Atlas (per project)
- Generator: `scripts/generate-design-atlas.(ts|py)`
  - Web: parse TSX/CSS/Tailwind config to list tokens, classes, and usages by route.
  - iOS: parse `DesignTokens.swift` and SwiftUI usages.
  - RN: parse `StyleSheet.create` and token modules.
- Artifacts:
  - `docs/design-atlas.md` (overview)
  - `docs/atlas/route-*.md` (per page/screen)
  - File:line links (e.g., `app/(marketing)/page.tsx:42`, `Sources/DesignTokens.swift:120`)
  - Cross‑link screenshots in `.orchestration/evidence/design/`

5) Minimal, Robust Agent Set (I/O contracts)
- Orchestration: `workflow-orchestrator` (never implements).
- Frontend: `nextjs-14-specialist`, `react-18-specialist`, `state-management-specialist`, `frontend-testing-specialist`.
- Design: `design-system-architect`, `ui-engineer`, `design-reviewer` (mandatory), `accessibility-specialist`.
- iOS/RN: `swiftui-developer`, `swift-testing-specialist`, `ui-testing-expert`, `react-native-specialist`.
- Backend (lean): `backend-engineer` (REST/Server Actions), `payments-integrator` (Stripe), `auth-integrator` (NextAuth/OAuth/Apple Sign‑In).
- Quality: `verification-agent` (tags), `test-engineer` (unit/integration).
- I/O contract (per agent): Inputs, Outputs, Acceptance (tests/evidence), Self‑checks (rg/ls/wc snippet list).

6) Start‑Simple → Escalate on Evidence (no router)
- Triggers to escalate (add planning/design review): unresolved `#QUESTION_SUPPRESSION`, cross‑domain file touches, build/test failures, explicit `#COMPLEXITY_EXCEEDED`.
- Profiles:
  - Design‑Strict (default): enforcement on; evidence budget=5.
  - Prototype: lighter gates; evidence budget=3.

7) Orchestrator Firewall (mode‑aware)
- Integrate the response‑awareness firewall hook (before Edit/Write/NotebookEdit) to prevent orchestrator from implementing in heavy moments; allow agents to implement; skip outside RA workflows.

8) Project Detection → Real Agent Teams
- Update `hooks/detect-project-type.sh` to map to real specialists per stack (iOS/Next.js/RN/Backend).

9) Memory & Learning
- Workshop hooks (SessionStart/SessionEnd) active for per‑project `.workshop/workshop.db`.
- `/finalize` outcome → `workshop decision/gotcha` with evidence score; playbook helpful/harmful++.
- Curator: simple script to apply apoptosis (delete patterns when harmful_count > helpful_count×3 after grace).
- (Optional) MCP server wrapper to expose Workshop search tools with index/full modes and citations (e.g., `workshop://entry/123`).

10) Inspiration Workflow (design brainstorming)
- `docs/inspiration/` for images/URLs + `docs/inspiration/index.md` with tags and notes.
- `/concept` and/or uxscii screenshot importer to extract components/spacing/typography into artifacts that feed the Design Atlas.

11) Deployment & Cleanup
- New clean deployment script: `scripts/deploy-to-global.sh` (backs up, archives runtime data, mirrors canonical files, verifies counts).
- Preserve user data: `plugins/`, `skills/`, `.orchestration/sessions/`, `.workshop/`.

12) Evaluation (evidence over anecdotes)
- `scripts/eval-run.sh`: run canned tasks (UI tweak, backend endpoint, auth flow), collect `/finalize` metrics (evidence score, time, failures), and write summary under `.orchestration/eval/`.

---

## Deliverables (File Map)

- Commands: `commands/finalize.md`
- Scripts: `scripts/finalize.sh`, `scripts/generate-design-atlas.(ts|py)`, `scripts/eval-run.sh`, `scripts/deploy-to-global.sh`
- Git hooks (templates): `.git/hooks/pre-commit`, `.git/hooks/pre-push` (installed by script)
- Docs: `docs/design-atlas.md` (+ `docs/atlas/*.md`), `docs/IMPLEMENTATION_PLAN.md` (this file)
- Hook updates: `hooks/detect-project-type.sh` (real teams), UI Guard enhancements
- Agent updates: I/O contracts + trimmed prompts (policy anchors)
- Settings: enable Workshop hooks; mode‑aware orchestrator firewall

---

## Phased Plan (Milestones)

Phase 0 — Prep
- Decide migration strategy (see Rebuild vs Patch below).
- Freeze scope; confirm agent roster and profiles.

Phase 1 — Core Gate
- Add `/finalize` + `.verified` + git hooks; implement Zero‑Tag Gate.

Phase 2 — Design Gating
- UI Guard DNA loader + warn‑only fallback; design‑reviewer wiring; detection mapping to real agents.

Phase 3 — Design Atlas
- Implement generator; produce initial `docs/design-atlas.md` for current project; link screenshots.

Phase 4 — Agent Hardening
- Add I/O contracts; trim prompts via policy anchors; ensure implementers always write implementation log.

Phase 5 — Orchestrator & Skills
- Integrate orchestrator firewall (mode‑aware); auto‑activate Fluxwing/uxscii for design tasks.

Phase 6 — Memory & Learning
- Ensure Workshop hooks active; `/finalize` → decisions/gotchas; curator for playbooks (apoptosis).

Phase 7 — Deployment & Cleanup
- Clean deploy to `~/.claude` with backup/archive; verify counts; preserve runtime data.

Phase 8 — Evaluation
- Run `eval-run.sh`; capture KPIs (false completion, evidence scores, time‑to‑proof). Iterate.

---

## Session Failures Observed (Scan) & Plan Adjustments

Observed in local logs (dev-logs, ~/.claude/debug, ~/.claude/projects):

- Hooks not active for RA enforcement (debug: "Found 0 hook matchers"): orchestrator/verification hooks weren’t firing → no tool‑level constraints.
  - Fix: enable mode‑aware orchestrator firewall and finalize gate; ensure settings.local.json registers hooks.

- Missing tags → manual verification (dev-logs: “verification-agent found no tag, had to manually verify”).
  - Fix: Zero‑Tag Gate + structural `.orchestration/implementation-log.md` requirements.

- Skipped design-reviewer “to save time” leading to visual drift.
  - Fix: make design‑reviewer mandatory in Design‑Strict profile; enforce via finalize evidence budget.

- /orca inconsistency and lack of reliable playbooks → “DO NOT use /orca for implementation” notes.
  - Fix: Start‑Simple escalation (no scoring router) + playbooks updated from `/finalize` outcomes; avoid brittle up‑front orchestration.

- Rate‑limit 429s in debug.
  - Fix: add backoff on heavy steps; prefer tools-first verification; cache file scans per session.

These map directly to Phase 1–3 deliverables (finalize + Zero‑Tag + DNA‑scoped design gates) and Phase 5 (mode‑aware firewall / hooks), which remove the root causes.

---

## Rebuild vs Patch (Recommendation)

Option A — Greenfield (parallel clean build) [Recommended]
- Create a clean “v5” system in a new directory (e.g., `system/v5/`) with only the scoped files above.
- Deploy v5 to `~/.claude` with backup/archival; disable older hooks/commands by default.
- Port only what’s needed from the old system (agents, skills, docs) after v5 passes evaluation.
Pros: aligns with “build it right first,” avoids legacy drift, faster to reason about; cleaner user experience.
Cons: initial cutover effort; temporary duplication until decommission.

Option B — Patch In‑Place
- Incrementally add `/finalize`, Zero‑Tag, design gating, then refactor agents/prompts.
Pros: fewer moving parts during transition.
Cons: higher risk of residual drift; more time spent untangling legacy; violates “do it right first” ethos.

Given your priorities (upfront quality, auditability, minimal iteration loops), choose Option A (Greenfield v5) with a staged cutover.

---

## Risks & Mitigations

- Risk: Over‑gating slows first passes → Profiles (Prototype vs Design‑Strict) and dynamic escalation keep velocity.
- Risk: DNA absence blocks UI → Warn‑only fallback with token scaffolding.
- Risk: Prompt drift → Policy anchors + I/O contracts reduce text and drift.
- Risk: Learning stagnation → `/finalize` → Workshop entries and curator apoptosis keep playbooks fresh.

---

## Acceptance Criteria

- `/finalize` produces `.verified` with unified summary; git hooks enforce it.
- Design Atlas generated with clickable file:line links for all key pages/screens.
- DNA‑scoped UI Guard passes for compliant projects; warn‑only fallback otherwise.
- Implementers produce `.orchestration/implementation-log.md` with required tags; Zero‑Tag Gate enforced.
- Minimal agent roster completes a representative UI feature, auth, and Stripe integration with evidence.
- Workshop shows decisions/gotchas from finalize; playbooks updated accordingly.

---

## Timeline (Rough)

- Week 1: Phase 1–2 (Finalize + Design gating + detection mapping)
- Week 2: Phase 3–4 (Design Atlas + agent hardening)
- Week 3: Phase 5–6 (Orchestrator firewall + skills + memory/curator)
- Week 4: Phase 7–8 (Deploy + evaluate + iterate)

---

## Next Steps (Actionable)

1) Approve Greenfield v5 approach.
2) I’ll scaffold `/finalize`, git hooks, and Zero‑Tag Gate.
3) Implement DNA‑scoped UI Guard + warn‑only fallback.
4) Deliver first Design Atlas for current project; review together.
