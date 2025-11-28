# Shopify Domain Pipeline

**Status:** OS 2.4 Core Pipeline
**Last Updated:** 2025-11-27

## Overview

The Shopify pipeline handles **Shopify theme development** using Liquid templating, CSS tokens, Web Components, and Online Store 2.0 patterns. It combines:

- OS 2.4 primitives (ProjectContextServer, phase_state.json, Workshop, constraint framework)
- Memory-first context (Workshop + vibe.db checked before ProjectContext)
- Complexity-based routing (simple → light orchestrator, medium/complex → full pipeline)
- Shopify specialist agents (CSS, Liquid, sections, JS, verification)
- Response Awareness (RA) tagging for assumptions and decisions
- Project design DNA/tokens (for CSS/styling work) and WARP.md architecture docs when present

Goal: implement and evolve Shopify theme features with **design token enforcement**, **Liquid best practices**, **structured gates**, and **RA-tracked assumptions**.

---

## Scope & Domain

Use this pipeline when:
- The task clearly concerns a Shopify theme:
  - Keywords: "Shopify", "Liquid", "theme", "section", "snippet", "CSS tokens"
  - Files: `layout/theme.liquid`, `sections/*.liquid`, `snippets/*.liquid`, `assets/*.css`, `config/settings_schema.json`

If the request is for:
- Next.js web work → use the **nextjs** pipeline
- iOS app → use the **ios** pipeline
- Expo/React Native → use the **expo** pipeline

---

## Three-Tier Routing (OS 2.4)

The Shopify pipeline uses three-tier routing:

| Mode | Flag | Path | Gates | Use Case |
|------|------|------|-------|----------|
| **Default** | (none) | Light + Gates | YES | Most work – fast with quality |
| **Tweak** | `-tweak` | Light (pure) | NO | Speed iteration, user verifies |
| **Complex** | `--complex` | Full pipeline | YES | Architecture, multi-file, specs |

### Default Mode (Light + Gates)

Most tasks take this path. Fast execution with automated quality checks.

```bash
/orca-shopify "fix card spacing"        # → light orchestrator → specialist → gates
/orca-shopify "update button color"     # → light orchestrator → specialist → gates
```

**Gate run:** `shopify-theme-checker`

### Tweak Mode (`-tweak`)

Pure speed path. User explicitly accepts responsibility for verification.

```bash
/orca-shopify -tweak "fix padding"        # → light orchestrator → specialist → done
```

### Complex Mode (`--complex`)

Full pipeline with grand-architect planning. Spec required.

```bash
/orca-shopify --complex "implement new section"   # → full pipeline
/orca-shopify "build cart drawer component"       # Auto-routes to --complex
```

| Tier | Files | Spec Required | Example |
|------|-------|---------------|---------|
| Default | 1-3 | No | Fix spacing, update color, change text |
| Tweak | 1-2 | No | Rapid iteration, exploring options |
| Complex | 3+ | **Required** | New sections, JS components, cart work |

---

## Pipeline Architecture (Complex Mode)

```text
Request (Shopify theme feature/bug/refactor)
    ↓
[Phase 0: Memory-First Context] ← Workshop + vibe.db
    ↓
[Phase 0.5: Complexity Classification]
    ↓
├─ DEFAULT → [Light Orchestrator] → Specialist → Theme Check Gate → Done
│
├─ TWEAK → [Light Orchestrator] → Specialist → Done (skip gates)
│
├─ COMPLEX:
    ↓
[Phase 1: Spec Check] ← Complex requires .claude/requirements/<id>/06-requirements-spec.md
    ↓
[Phase 2: Team Confirmation] ← User approves agent team
    ↓
[Phase 3: ProjectContext Query] ← MANDATORY (ProjectContextServer)
    ↓
[Phase 4: Task Analysis (Shopify Grand Architect)]
    ↓
[Phase 5: Implementation (Specialists via delegation)]
    ↓
[Phase 6: Verification Gate (Theme Checker)]
    ↓
Decision Point:
├─ Theme Check passes → [Phase 7: Completion]
└─ Theme Check fails → [Phase 5b: Corrective Pass] (ONE corrective pass)
    ↓
[Phase 6b: Re-verification]
    ↓
[Phase 7: Completion & Learning]
```

---

## Phase Definitions

### Phase 0: Memory-First Context

**Agent:** `/orca-shopify`
**Purpose:** Check local memory before expensive ProjectContext queries

**Actions:**
```bash
# Search Workshop for relevant Shopify decisions/gotchas
workshop --workspace .claude/memory why "Shopify $TASK_KEYWORDS"

# Search vibe.db for relevant code/symbols
python3 ~/.claude/scripts/memory-search-unified.py "$TASK_KEYWORDS" --mode all --top-k 5
```

**Output:** Memory hints that may inform complexity and reduce context needs.

---

### Phase 0.5: Complexity Classification

**Agent:** `/orca-shopify`
**Purpose:** Route to appropriate path based on task complexity

**Heuristics:**

| Tier | Criteria | Route |
|------|----------|-------|
| SIMPLE | Single file, minor tweak, copy change | `shopify-light-orchestrator` |
| MEDIUM | Single section, 2-5 files, needs Theme Check | Full pipeline |
| COMPLEX | Multiple sections, JS work, cart/checkout | Full pipeline + spec required |

**Keywords:**
- Simple: "tweak", "fix", "adjust", "change" + single element
- Complex: "implement", "build", "create", "refactor" + feature/system

---

### Phase 1: Spec Check (Complex Only)

**Agent:** `/orca-shopify`
**Purpose:** Gate complex work behind requirements specs

**Check:**
```bash
ls .claude/requirements/*/06-requirements-spec.md 2>/dev/null | head -5
```

**If complex and no spec:** Stop and instruct user to run `/plan` first.

---

### Phase 2: Team Confirmation

**Agent:** `/orca-shopify`
**Purpose:** Get user approval before proceeding

Present proposed team and allow adjustments before execution.

---

### Phase 3: ProjectContext Query (MANDATORY)

**Agent:** ProjectContextServer (MCP tool)
**Invoker:** `/orca-shopify`

**Input:**
```json
{
  "domain": "shopify",
  "task": "<user request>",
  "projectPath": "<cwd>",
  "maxFiles": 15,
  "includeHistory": true
}
```

**Output:** ContextBundle containing:
- `relevantFiles` – Liquid, CSS, JS files for the feature/bug.
- `projectState` – theme structure, sections, snippets, assets.
- `pastDecisions` – prior Shopify decisions, gotchas.
- `relatedStandards` – Shopify standards from Workshop (design tokens, Liquid patterns).
- `similarTasks` – previous Shopify tasks and outcomes.

**Artifacts:**
- ContextBundle stored in `phase_state.json`.
- Context event logged in Workshop.

---

### Phase 2: Task Analysis

**Agent:** `shopify-grand-architect`

**Tasks:**
1. Analyze the request scope.
2. Identify which specialists are needed:
   - CSS work → `shopify-css-specialist`
   - Liquid templates → `shopify-liquid-specialist`
   - Sections → `shopify-section-builder`
   - JavaScript → `shopify-js-specialist`
3. Check for design DNA/token sources.
4. Plan delegation order and dependencies.

**Artifacts:**
- Task breakdown in `phase_state.json`.
- Decision saved via ProjectContextServer.

---

### Phase 3: Implementation

**Agent:** `shopify-grand-architect` (delegating to specialists)

**Specialists:**
- `shopify-css-specialist` – CSS refactoring, tokens, !important cleanup
- `shopify-liquid-specialist` – Liquid templates, objects, filters, control flow
- `shopify-section-builder` – Sections with schemas, blocks, presets
- `shopify-js-specialist` – Web Components, PubSub, cart interactions

**Constraints (HARD):**
- Use design tokens where defined; no hardcoded colors/spacing.
- Follow Liquid best practices (render not include, translations, etc.).
- Keep edits scoped to the task; no unnecessary refactors.

**Tasks:**
1. Grand architect delegates to appropriate specialist(s) via Task tool.
2. Each specialist reads files, makes changes, reports what was modified.
3. Grand architect coordinates multiple specialists if needed.

**Artifacts:**
- Modified files recorded in `phase_state.json`.
- Changes summary from each specialist.

---

### Phase 4: Verification Gate

**Agent:** `shopify-theme-checker`

**Tasks:**
1. Run `shopify theme check` on the theme.
2. Parse results by severity (error/warning/info).
3. Check design token compliance (warn only, don't block).
4. Report Theme Check results.

**Gate Thresholds:**
- **Theme Check:** PASS if no errors (warnings acceptable).
- **Design Tokens:** Soft warning only (4px grid compliance).

**Artifacts:**
- Theme Check report in `phase_state.gates`.
- Design token warnings list.

---

### Phase 3b: Corrective Pass (if needed)

**Agent:** `shopify-grand-architect` (delegating to specialists)

**Trigger:** Theme Check gate fails with errors.

**Constraints:**
- Scope strictly to fixing Theme Check errors.
- No new features or scope expansion.
- Maximum ONE corrective pass.

**Tasks:**
1. Grand architect analyzes Theme Check errors.
2. Delegates fixes to appropriate specialist(s).
3. Specialists apply minimal fixes.

---

### Phase 4b: Re-verification

**Agent:** `shopify-theme-checker`

**Tasks:**
1. Re-run Theme Check.
2. Verify errors are resolved.

**If still failing:**
- Mark outcome as "partial / Theme Check errors remain".
- Document remaining issues for user decision.

---

### Phase 5: Completion & Learning

**Agent:** `shopify-grand-architect` + ProjectContextServer

**Tasks:**
1. Confirm gate outcomes.
2. Save task history:
   - Domain: `shopify`
   - Task description
   - Outcome (`success` | `partial` | `failure`)
   - Files modified
   - Gate results
3. Update memory:
   - Insert decisions into Workshop.
   - Save learnings via ProjectContextServer.

---

## Failure Scenarios & Recovery

### Scenario 1: Theme Check Fails After Corrective Pass

**What happened:** Corrective pass didn't resolve all Theme Check errors.

**Recovery:**
1. Mark task as "partial completion".
2. Document remaining errors with file/line references.
3. Present user with options:
   - Manual fix required
   - Accept partial state
   - Rollback changes

---

### Scenario 2: Design Token Violations Widespread

**What happened:** Many hardcoded colors/spacing found, but Theme Check passes.

**Recovery:**
1. Report violations as warnings (not blockers).
2. Suggest follow-up task to address token compliance.
3. Save as Workshop gotcha for future awareness.

---

### Scenario 3: Specialist Cannot Complete

**What happened:** Specialist encounters blocking issue (missing file, schema error, etc.).

**Recovery:**
1. Specialist reports blocker to grand architect.
2. Grand architect may:
   - Route to different specialist
   - Request user input via AskUserQuestion
   - Document as partial completion

---

### Scenario 4: ProjectContextServer Timeout

**What happened:** MCP tool doesn't respond within timeout.

**Recovery:**
1. Retry once with extended timeout.
2. If still fails, enter DEGRADED mode:
   - Use Read/Grep to manually locate relevant files.
   - Warn: "Context quality reduced".
3. Proceed with available context.

---

## Agent Communication Protocol

### Phase State Structure

Agents communicate via `phase_state.json` at `.claude/orchestration/phase_state.json`.

**Structure:**
```json
{
  "domain": "shopify",
  "task": "Refactor CSS to use design tokens",
  "phase": "implementation",
  "status": "in_progress",

  "context": {
    "relevantFiles": ["assets/base.css", "snippets/global-theme-styles.liquid"],
    "designTokens": "snippets/global-theme-styles.liquid"
  },

  "task_analysis": {
    "specialists_needed": ["shopify-css-specialist", "shopify-liquid-specialist"],
    "task_breakdown": [
      "Add missing tokens to global-theme-styles.liquid",
      "Replace hardcoded values in base.css with tokens"
    ]
  },

  "implementation": {
    "pass": 1,
    "filesModified": [
      "snippets/global-theme-styles.liquid",
      "assets/base.css"
    ],
    "changesApplied": "Added spacing tokens, replaced 45 hardcoded values"
  },

  "gates": {
    "theme_check": {
      "status": "PASS",
      "errors": 0,
      "warnings": 3
    },
    "design_tokens": {
      "status": "WARN",
      "violations": 12
    }
  },

  "artifacts": {
    "theme_check_report": ".claude/orchestration/evidence/theme-check-20251125.md"
  }
}
```

---

### Handoff Protocol

**Phase 1: /orca-shopify → shopify-grand-architect**
- **Input:** User request + ContextBundle from ProjectContextServer.
- **Output:** Task analysis with specialists needed.
- **Signal:** `phase_state.json` updated with `task_analysis`.

**Phase 2: shopify-grand-architect → Specialists**
- **Input:** Task assignment + ContextBundle + design token sources.
- **Output:** Modified files + changes summary.
- **Signal:** `phase_state.json` updated with `implementation`.

**Phase 3: shopify-grand-architect → shopify-theme-checker**
- **Input:** Request to run Theme Check.
- **Output:** Theme Check results + gate decision.
- **Signal:** `phase_state.json` updated with `gates`.

**Phase 4: Gates → Corrective Pass (if needed)**
- **Trigger:** `gates.theme_check.status === "FAIL"` AND `implementation.pass === 1`.
- **Input:** Theme Check errors to fix.
- **Output:** Scoped fixes addressing only errors.
- **Signal:** `implementation.pass` incremented to 2.

---

## Specialist Routing

| Task Type | Agent | Description |
|-----------|-------|-------------|
| CSS/token work | `shopify-css-specialist` | CSS refactoring, tokens, !important cleanup |
| Liquid templates | `shopify-liquid-specialist` | Objects, filters, control flow |
| New/modify sections | `shopify-section-builder` | Schema, blocks, presets |
| JavaScript work | `shopify-js-specialist` | Web Components, PubSub |
| Quality check | `shopify-theme-checker` | Theme Check, linting |

---

## Design Constraints

### Spacing
- 4px grid (all values must be multiples of 4px)
- Allowed: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px

### Design Tokens
- No hardcoded colors → use `var(--color-*)`
- No hardcoded spacing → use CSS custom properties
- No inline styles → use design system classes

### Enforcement
- **Warn** on violations (don't block)
- Format: `Design Token Warning: [file:line] - Issue - Suggestion`

---

## Quality Gates

| Gate | Requirement | Enforcement |
|------|-------------|-------------|
| Theme Check | No errors | Hard (errors must be fixed) |
| Design Tokens | 4px grid compliance | Soft (warn only) |
| Accessibility | Alt text, labels | Warn |

---

## Commands Reference

```bash
# Development
shopify theme dev --store=STORE_DOMAIN

# Push changes (unpublished)
shopify theme push --unpublished

# Pull latest from live
shopify theme pull --live

# Lint theme
shopify theme check

# Auto-fix safe issues
shopify theme check --auto-correct

# Open theme in browser
shopify theme open
```

---

## Memory Integration

Decisions and learnings stored in Workshop:
```bash
workshop decision "Shopify: [decision]" -r "[reasoning]" -t shopify
workshop gotcha "Shopify: [issue]" -t shopify -t liquid
```

---

---

## Response Awareness (RA) Integration

Specialists should tag assumptions and decisions:

| Tag | Meaning | Example |
|-----|---------|---------|
| `#COMPLETION_DRIVE` | Assumed behavior without explicit confirmation | "Assuming mobile breakpoint is 768px" |
| `#CARGO_CULT` | Copied pattern from elsewhere | "Mirroring header section's token usage" |
| `#TOKEN_VIOLATION` | Design token rule not followed | "Using hardcoded #333 - token not available" |
| `#PATH_DECISION` | Architectural choice made | "Using Web Component over vanilla JS" |

**Gate Integration:** `shopify-theme-checker` should check for unresolved RA tags and report in gate output.

---

_Last updated: 2025-11-27_
_Version: 2.4.0_
