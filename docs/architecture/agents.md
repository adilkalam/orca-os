# OS 2.0 Agent Architecture (Updated 2025-11-19)

This document describes the **agent layer** for OS 2.0: how agents are defined,
where they live, and how domain pipelines are expected to use them.

For orchestration behavior, see:
- `docs/architecture/vibe-code-os-v2-spec.md`
- `docs/pipelines/*`

For external tools (Codex, Cursor, etc.), see the repo‑root `AGENTS.md`.

---
## 1. Agent Definitions & Locations

### 1.1 Global Agent Specs (This Repo)

Global agents are defined as markdown files in:

- `agents/*.md`

Each file uses the same frontmatter + markdown pattern:

```yaml
---
name: frontend-builder-agent
description: >
  Frontend implementation specialist for webdev lane.
tools: [Read, Edit, MultiEdit, Grep, Glob, Bash]
model: inherit
---

# Frontend Builder – OS 2.0 Implementation Agent
...markdown body...
```

Key agent groups:
- **Webdev:** `frontend-builder-agent`, `frontend-layout-analyzer`,
  `frontend-standards-enforcer`, `frontend-design-reviewer-agent`.
- **Expo:** `expo-architect-agent`, `expo-builder-agent`,
  `expo-verification-agent`.
- **iOS:** `ios-architect-agent`, `ios-standards-enforcer`,
  `ios-ui-reviewer-agent`, `ios-verification-agent`.
- **Design/Visual:** `visual-layout-analyzer` (image-aware layout analysis).
- **SEO:** `seo-brief-strategist`, `seo-research-specialist`,
  `seo-draft-writer`, `seo-quality-guardian`.
- **Cross-cutting gates:** `design-token-guardian`, `a11y-enforcer`,
  `performance-enforcer`, `performance-prophet`, `security-specialist`.

### 1.2 Deployed Agents

When used by Claude Code, these specs are typically copied into:

- `~/.claude/agents/*.md`

The contents should remain structurally identical (same `name`, `tools`,
and core behavior), so updates in this repo can be propagated consistently.

---
## 2. Agent Roles by Domain

OS 2.0 uses **domain pipelines**; each pipeline declares a set of agents and
gates. High-level mapping:

- **Webdev (`docs/pipelines/webdev-pipeline.md`):**
  - Analysis: `frontend-layout-analyzer`
  - Implementation: `frontend-builder-agent`
  - Gate group (parallel):
    - Standards: `frontend-standards-enforcer`
    - Design QA: `frontend-design-reviewer-agent`
  - Optional gates: `a11y-enforcer`, `performance-enforcer`, `security-specialist`

- **Expo (`docs/pipelines/expo-pipeline.md`):**
  - Architecture: `expo-architect-agent`
  - Implementation: `expo-builder-agent`
  - Gates: `design-token-guardian`, `a11y-enforcer`, `performance-enforcer`,
    `performance-prophet`, `security-specialist`
  - Verification: `expo-verification-agent`

- **iOS (`docs/pipelines/ios-pipeline.md`):**
  - Architecture/plan: `ios-architect-agent`
  - Standards gate: `ios-standards-enforcer`
  - UI/interaction gate: `ios-ui-reviewer-agent`
  - Build/test gate: `ios-verification-agent`

- **Design (`docs/pipelines/design-pipeline.md`):**
  - Design exploration/system/components (conceptual agents, often mapped from
    the design-with-claude collection).
  - Visual analysis: `visual-layout-analyzer` (image → layout tree + tokens).
  - Handoff to webdev via `design-dna.json` and implementation specs.

- **SEO (`docs/pipelines/seo-pipeline.md`):**
  - Research: `seo-research-specialist`
  - Brief refinement: `seo-brief-strategist`
  - Drafting: `seo-draft-writer`
  - QA gate: `seo-quality-guardian`

Each pipeline’s phase-config (`docs/reference/phase-configs/*.yaml`) defines
which agent runs in which phase and what fields are written to
`.claude/project/phase_state.json`.

---
## 3. Tools & Constraints

Agents are distinguished by:

- **Tool access:**  
  - Implementation agents (`*-builder-agent`, `seo-draft-writer`) may use edit
    tools (`Edit`, `MultiEdit`, `Write`) and local checks (`Bash` for lint,
    tests, builds).
  - Gate/review agents (`*-standards-enforcer`, `frontend-design-reviewer-agent`,
    `seo-quality-guardian`, `ios-verification-agent`) are **read-only**:
    they should not use edit tools.
- **Scope & file limits:**  
  - Each agent doc describes allowed paths/areas (e.g. Expo lane paths, iOS
    sources, SEO outputs) and constraints (max files, forbidden operations).
- **Constraint Framework alignment:**  
  - Required context: ContextBundle, design-dna, related standards, etc.
  - Forbidden operations: inline styles, arbitrary spacing/typography, unsafe
    concurrency patterns, skipping gates.
  - Verification required: lint/typecheck/build for webdev, `expo doctor` /
    tests for Expo, Xcode build/tests for iOS, clarity/SEO gates for SEO.

The normative reference for constraints is:
- `docs/reference/constraint-framework.md`
- Agent-specific sections under `agents/*.md`.

---
## 4. Orchestration via `/orca`

The `/orca` command (`commands/orca.md`) is the **pure orchestrator**:

- Performs domain detection (webdev, expo, ios, seo, design, data, brand).
- Calls ProjectContextServer to obtain a ContextBundle.
- Consults the appropriate pipeline spec (`docs/pipelines/*`).
- Delegates each phase to the correct **named agents** (never generic
  “general-purpose” for real domain work).
- Tracks phase state in `.claude/project/phase_state.json`.

Agents themselves must:
- Assume they will receive a valid ContextBundle and phase-state context.
- Avoid cross-domain responsibilities (e.g. webdev agents do not adjust iOS
  projects directly).

---
## 5. Editing Guidelines for Agents

When modifying `agents/*.md` in this repo:

- Keep `name:` stable; other configs reference these ids.
- Ensure tools/constraints match the agent’s intended role:
  - No edit tools on standards/QA/verification agents.
  - No destructive shell usage.
- Align behavior with:
  - Relevant pipeline doc (`docs/pipelines/*`).
  - Phase config (`docs/reference/phase-configs/*`).
  - Constraint framework (`docs/reference/constraint-framework.md`).
- Prefer tightening constraints and clarifying responsibilities over making
  agents more generic.

This document is descriptive, not exhaustive; in case of conflict, the
pipeline docs and constraint framework are the authoritative sources for how
agents should behave in OS 2.0.
