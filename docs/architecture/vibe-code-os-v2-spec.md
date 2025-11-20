# Vibe Code OS 2.0 – Architecture Specification

> This document promotes ideas from `vibe-code-os-v2-brainstorm.md` into a concrete, opinionated spec.  
> The brainstorm remains a scratchpad; this file is the source of truth for OS 2.0 behavior.

---

## 1. Goals & Non‑Goals

### 1.1 Goals

- **Structural quality guarantees** rather than best‑effort prompts.
- **Single orchestration system** (Orca 2.0) coordinating:
  - Requirements & planning.
  - Domain pipelines (frontend, SEO, later others).
  - Verification, standards, and claim checking.
- **OS‑level enforcement** of:
  - Iteration loops until quality thresholds.
  - Mandatory customization for UI primitives.
  - Claim verification and trust consequences.
  - Cost/iteration limits per command.
- **Context & memory**:
  - One canonical context snapshot for each project.
  - Early steps toward `vibe.db` (events, standards, learning signals).

### 1.2 Non‑Goals

- Replacing this repo with an external orchestration system (Agentwise, Agent Farm, etc.).
- Building a full context server or knowledge graph in v2 (we start with a snapshot file).
- Turning every workflow into a multi‑agent swarm; focus on small, purposeful teams.

---

## 2. High‑Level Architecture

At a high level, OS 2.0 is organized as:

```text
User Input
   ↓
Input Surface (commands: /orca, /requirements, /frontend-iterate, /clone-website, etc.)
   ↓
Global Guardrails (cost limits, safety checks)
   ↓
Orchestrator (Orca 2.0 – Project Manager)
   ↓
Phase/Task Engine (state machine + per-task metadata)
   ↓
Context Engine (ContextSnapshot v2 + future vibe.db)
   ↓
Domain Pipelines (frontend, SEO, later iOS/data)
   ↓
Verification & Standards (validators, claim verifier, trust system)
   ↓
Learning (visual preferences, events, future standards/memory)
```

Each layer has clear responsibilities and communicates via simple, inspectable artifacts (JSON, Markdown, logs).

---

## 3. Global Guardrails

**Purpose:** Prevent runaway cost or unsafe operations across all commands.

- **Per‑command limits** (declared in each command spec and enforced by Orca):
  - `token_budget`: soft limit on total tokens per command (e.g. 100k by default).
  - `iteration_max`: maximum iterations of any enforced loop (e.g. 5).
  - `parallel_agents_max`: maximum number of agents run in parallel (e.g. 3).
- **On budget exceed / approach:**
  - Orca must:
    - Pause the pipeline.
    - Summarize what has been done and what remains.
    - Provide a rough cost estimate for another iteration.
    - Ask the user whether to: **continue**, **narrow scope**, or **stop**.

Guardrails are intentionally simple and human‑visible; they are not a separate scheduler.

---

## 4. Phase/Task Engine (State Machine)

**Purpose:** Replace ad‑hoc “phases” with an explicit state machine and per‑task metadata.

- State is stored in `.claude/orchestration/temp/orca-phase-status.json`.
- Schema (conceptual):

```json
{
  "version": "2.0",
  "current_state": "implementation",
  "states": {
    "requirements":     { "next": ["planning"],        "parallel": false },
    "planning":         { "next": ["implementation"],  "parallel": true  },
    "implementation":   { "next": ["verification"],    "parallel": true  },
    "verification":     { "next": ["complete","implementation"], "parallel": false },
    "complete":         { "next": [],                  "parallel": false }
  },
  "tasks": [
    { "id": "req-1",  "state": "requirements",   "agent": "requirement-analyst",        "status": "done" },
    { "id": "impl-1", "state": "implementation", "agent": "frontend-builder-agent",     "status": "pending" },
    { "id": "val-1",  "state": "verification",   "agent": "frontend-standards-enforcer","status": "pending" }
  ]
}
```

- **Orca 2.0 responsibilities:**
  - Read and update `current_state` and task statuses.
  - On successful completion of all tasks in a state → advance to the next allowed state.
  - On validator failure → allowed transition back to `implementation`.
  - On repeated failures or timeouts → escalate to the user rather than looping silently.

The phase engine is small by design but gives us Agentwise‑style structure and visibility.

---

## 5. Context Engine – ContextSnapshot v2

**Purpose:** Provide a single, optimized view of the project so agents don’t constantly re‑scan the codebase.

- Snapshot file: `.claude/orchestration/temp/context-snapshot.json`.
- Example structure:

```json
{
  "version": "2.0",
  "timestamp": "2025-11-17T10:00:00Z",
  "project": {
    "type": "next-app-router",
    "key_directories": ["app", "components", "styles"],
    "hot_zones": [
      { "path": "app/page.tsx",        "edit_frequency": "high" },
      { "path": "components/ui/*",     "edit_frequency": "medium" }
    ]
  },
  "components": {
    "dependency_graph": {
      "Button": ["Card", "Page"],
      "Card":   ["Page"]
    },
    "customization_status": {
      "Button": "customized",
      "Card":   "default",
      "Input":  "customized"
    }
  },
  "design": {
    "tokens_used": ["--primary", "--surface"],
    "violations": ["inline-style at app/page.tsx:45"]
  }
}
```

- **ContextSnapshot responsibilities:**
  - Summarize project type and key directories.
  - Track “hot zones” (frequently edited or critical files).
  - Map components and dependencies.
  - Track customization status for UI primitives (used by the customization gate).
  - Provide a quick view of design token usage and obvious violations.

All major commands (e.g. `/orca`, `/requirements`, `/frontend-iterate`, `/clone-website`) should read the snapshot if present and only regenerate when explicitly needed or clearly stale.

---

## 6. Orca 2.0 – Project Manager

**Purpose:** Single orchestrator that coordinates planning, domain pipelines, and verification.

- Orca 2.0 replaces ad‑hoc multi‑tier orchestrators (workflow‑orchestrator, meta‑orchestrator, etc.) with a single, explicit role:
  - Reads context snapshot and phase/task state.
  - Runs requirements/planning agents when needed:
    - `requirement-analyst`, `system-architect`, `plan-synthesis-agent`.
  - Selects a small, domain‑appropriate agent team for each task.
  - Dispatches domain pipelines (frontend, SEO, etc.) via Task calls and state transitions.
  - Always finishes with verification:
    - Standards/validators.
    - `agent-claim-verifier` for claims.
    - Cost/iteration checks.

Orca can still use interactive `AskUserQuestion` for team selection and major trade‑offs, but its behavior is guided by this spec and the phase engine rather than free‑form prompt text.

---

## 7. Ingestion Surface (Docs, Images, Websites)

**Purpose:** Turn external artifacts into structured requirements and UI context.

OS 2.0 adds a coherent ingestion layer via commands:

- **Requirements from docs**
  - `commands/requirements-from-doc.md`:
    - Input: paths to PDFs, DOCX, Markdown, etc.
    - Behavior:
      - Extract text via `Read`/file tools/MCP.
      - Use planning agents to synthesize:
        - Problem statement, constraints, stakeholders.
        - User stories and acceptance criteria.
      - Store under `.claude/orchestration/evidence/requirements/YYYYMMDD-HHMM-[slug]/`.
      - Feed results into `/requirements` and Orca’s requirements state.

- **Context from docs**
  - `commands/context-from-doc.md` (similar pattern) for technical docs, architecture guides, etc.

- **Images & mockups**
  - `commands/frontend-from-mockup.md`:
    - Use uploaded mockups/screenshots as primary input.
    - `frontend-layout-analyzer` infers layout; `frontend-builder-agent` builds Same.new/Next.js components.
  - `commands/design-review-from-screenshot.md`:
    - Direct handoff to `frontend-design-reviewer-agent` for visual QA given a screenshot and route.

These commands are first‑class entry points into requirements and the frontend pipeline, not afterthoughts.

---

## 8. Clone Website – Frontend Import Pipeline

**Purpose:** Clone or reinterpret external sites into this project’s stack and design DNA.

- Command: `commands/clone-website.md`
  - Args:
    - `url`: site to clone.
    - `mode`: `"exact"` (1:1 replica) or `"similar"` (keep structure, change brand/style).
  - Behavior:
    - Fetch HTML/CSS for the URL via MCP (Fetch/Firecrawl or equivalent).
    - `frontend-layout-analyzer` builds a dependency/structure map from the live DOM.
    - `frontend-builder-agent`:
      - `exact`: replicate layout and structure as faithfully as possible within the design system.
      - `similar`: preserve flows/structure but re‑skin with design DNA and tokens.
    - Write outputs to appropriate files (e.g., `app/clone/[slug]/page.tsx` plus components) with chaos‑prevention rules.
  - Post‑processing:
    - Run the frontend enforcement pipeline (`/frontend-iterate`) before declaring success.

This provides an Agentwise‑style `/clone-website` but integrated with Vibe’s frontend agents and standards.

---

## 9. Frontend Pipeline v2 – Mandatory Customization & Enforcement

**Purpose:** Enforce Same.new‑style quality for frontend work; no generic UIs, no “looks good” on first pass.

Command: `commands/frontend-iterate.md`

### 9.1 Phases (mapped into PhaseEngine states)

1. **Customization Gate (`customization`)**
   - Load design‑DNA, design system docs, context snapshot.
   - Scan all UI primitives (buttons, cards, inputs, etc.).
   - Create a `customization-plan.md` under `.claude/orchestration/temp/frontend/` describing:
     - Current state of each primitive.
     - Planned customizations to align with design DNA.
   - Modify every primitive accordingly.
   - Update `customization_status` in ContextSnapshot:
     - All must be `"customized"`; any `"default"` is a violation.
   - If any default remains, **block** progression and stay in `customization` until resolved.

2. **Implementation (`implementation`)**
   - `frontend-builder-agent`:
     - Implements or refines components/pages using customized primitives, context snapshot, and design DNA.
     - Avoids raw spacing/colors when tokens exist.
   - Work is chunked to respect cost and phase/task limits.

3. **Visual Analysis (`visual_analysis`)**
   - `frontend-design-reviewer-agent`:
     - Takes screenshots at multiple breakpoints.
     - Extracts pixel measurements for key elements (spacing, padding, alignment).
     - Computes a **Design QA Score (0–100)** and per‑phase verdicts.

4. **Standards Audit (`standards`)**
   - `frontend-standards-enforcer`:
     - Scans diffs for violations of design DNA and global CSS/tokens standards.
     - Computes a **Standards Score (0–100)** and gate (PASS/CAUTION/FAIL).

5. **Iteration Loop (`iteration`)**
   - Enforced loop with minimum and maximum iterations:
     - `min_iterations`: at least 3 passes.
     - `max_iterations`: bounded by global cost/iteration limits.
   - Loop condition (conceptual):
     - While `(DesignScore < 90 OR StandardsScore < 90 OR iterations < min_iterations)` AND under cost limits:
       - Aggregates concrete issues from both validators.
       - Forces validators to list specific, measurable issues (pixel deltas, token misuses, file/line).
       - Calls `frontend-builder-agent` with a **fix‑list‑only** prompt.
       - Reruns Visual Analysis and Standards Audit.
   - No “looks good” exits; the loop is a structural requirement.

6. **Verification & Claims (`verification`)**
   - `agent-claim-verifier` validates key claims (tests passing, bug fixes, performance improvements, etc.).
   - Final gating:
     - Only allow PhaseEngine to move to `complete` if:
       - Design and Standards scores meet thresholds.
       - Validators report no remaining blocking issues.
       - Claims are either verified or explicitly marked as unverified with caveats.

The frontend pipeline can be invoked independently (`/frontend-iterate`) or as part of a broader `/orca` workflow.

---

## 10. Claim Verification System & Trust

**Purpose:** Make agent claims testable and track trust over time.

### 10.1 Claim Verifier Agent

- Agent: `agents/agent-claim-verifier.md`
- Tools: `Read`, `Grep`, `Bash`, optional `Git`, `TodoWrite`.
- Responsibilities:
  - Input: an agent’s summary or Orca’s final report.
  - Extract **testable claims**, such as:
    - “All tests pass.”
    - “Bug X is fixed.”
    - “API latency improved by 20%.”
    - “Security issue Y addressed.”
  - For each claim:
    - Run appropriate checks (tests, commands, file inspections).
    - Classify as `verified`, `falsified`, or `untestable`.
  - Output:
    - List of claims with verdicts and evidence paths.
    - Trust deltas for involved agents.

### 10.2 Claims Log & Trust Scores

- Claims log:
  - `.claude/orchestration/evidence/claims/agent-claims-log.jsonl`
  - Each entry: `timestamp`, `agent`, `claim`, `result`, `evidence_path`, `trust_delta`.
- Trust scores:
  - Stored in `.claude/orchestration/evidence/claims/trust-scores.json`:

```json
{
  "frontend-builder-agent": 78,
  "frontend-standards-enforcer": 92,
  "agent-claim-verifier": 95
}
```

- Adjustment rules (initial):
  - `verified_claim`: +2.
  - `falsified_claim`: −10.
  - `untestable_claim`: −1.

### 10.3 Behavioral Effects

- Orca must consult trust scores when dispatching agents:
  - Score < 50:
    - Always run Claim Verifier on that agent’s outputs.
  - Score < 30:
    - Require a second validator or human confirmation for critical operations.
  - Score < 10:
    - Block that agent from critical operations; explain why and suggest alternatives.

This turns trust into a real constraint on behavior, not just logging.

---

## 11. Learning – Visual Preferences & Events

**Purpose:** Let OS 2.0 adapt to user taste and capture lessons for future standards.

- Visual preferences file:
  - `.claude/orchestration/learning/visual-preferences.json`
  - Stores:
    - Spacing/grid preferences.
    - Color/contrast tendencies.
    - History of design reviews and user decisions (ship/tweak/redo).
- Validators (especially `frontend-design-reviewer-agent`) read this file to:
  - Explain scores relative to user preferences.
  - Highlight when changes diverge from historically accepted patterns.
- Events and RA tags:
  - Critical incidents (false completions, repeated violations) are logged as events.
  - RA tags (`#COMPLETION_DRIVE`, `#POISON_PATH`, `#FALSE_COMPLETION`, etc.) can be attached for future `vibe.db` indexing.

The learning layer is intentionally light in v2; its main job is to centralize preferences and event signals so future standards/memory systems have something to build on.

---

## 12. Implementation Notes & Rollout

This spec describes the target OS 2.0 behavior. Implementation can proceed module‑by‑module, but changes must respect this architecture:

- Orca 2.0 should:
  - Use the Phase/Task Engine.
  - Read ContextSnapshot.
  - Invoke domain pipelines and Claim Verifier as described.
- New commands (`/frontend-iterate`, `/clone-website`, `/requirements-from-doc`, etc.) should:
  - Follow the ingestion, pipeline, and verification patterns above.
- Agents revived from `.deprecated/agents_old` (planning/quality) must:
  - Fit into this orchestration model rather than reintroducing free‑form orchestration.

As OS 2.0 is implemented, this spec should be updated when behavior changes materially; the brainstorm doc should remain the place for exploratory ideas and external pattern notes. 

