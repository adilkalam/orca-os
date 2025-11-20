# Repository Guidelines – Claude Vibe OS 2.0 Config

This file is for AI coding assistants (Codex, Cursor, Claude Code, etc.) working **inside this repo**. It explains what this repository is, how the agent system is structured, and how tools should behave when editing it.

---
## 1. Project Purpose & Scope

- This repo is the **configuration + docs hub** for the OS 2.0 orchestration system used by Claude Code.
- It defines:
  - Global **agent specifications** (under `agents/` and synced to `~/.claude/agents`).
  - **Domain pipelines** and quality gates (under `docs/pipelines/` and `docs/reference/`).
  - **Commands** that orchestrate work (`commands/` and `commands/_archive/`).
  - OS 2.0 **architecture docs** and design system integrations (`docs/`).
- Treat this repo as **meta‑infrastructure**, not a typical product app: most changes here affect how other projects behave.

When in doubt, prefer **small, surgical edits** to agents/commands/docs rather than large refactors.

---
## 2. Agent System Layout

Global agent definitions live in:

- `agents/*.md` – OS 2.0 agents for:
  - Webdev: `frontend-builder-agent`, `frontend-standards-enforcer`, `frontend-layout-analyzer`, `frontend-design-reviewer-agent`.
  - Expo/mobile: `expo-architect-agent`, `expo-builder-agent`, `expo-verification-agent`.
  - iOS: `ios-architect-agent`, `ios-standards-enforcer`, `ios-ui-reviewer-agent`, `ios-verification-agent`.
  - Cross-cutting: `design-token-guardian`, `a11y-enforcer`, `performance-enforcer`, `performance-prophet`, `security-specialist`.
  - SEO/content: `seo-*` agents.
- `~/.claude/agents/*.md` – the deployed copies used by Claude Code.

Agent files share a simple schema:

```yaml
---
name: frontend-builder-agent
description: "..."
tools: [Read, Edit, MultiEdit, Grep, Glob, Bash]
model: inherit
---

# Agent Title
...markdown body...
```

**When editing agents:**
- Do not change `name` values; other tools rely on these identifiers.
- Keep `tools` aligned with the agent’s role (no write tools on gate/review agents).
- Preserve the existing structure and terminology (ContextBundle, design-dna, phase_state, gates, etc.).

---
## 3. Pipelines, Gates & Constraints

OS 2.0 behavior is driven by documentation; do not casually change these without intent:

- **Pipelines:**
  - `docs/pipelines/webdev-pipeline.md`
  - `docs/pipelines/expo-pipeline.md`
  - `docs/pipelines/ios-pipeline.md`
  - `docs/pipelines/requirements-pipeline.md`
  - `docs/pipelines/design-pipeline.md` (design lane, design-dna, visual analysis)
- **Constraint Framework & Gates:**
  - `docs/reference/constraint-framework.md`
  - `docs/reference/standards-gate.md`
  - `docs/reference/design-qa-gate.md`
  - `docs/reference/customization-gate.md`
- **Design system schema:**
  - `docs/design/design-dna-schema.md` – JSON schema used by implementation/gate agents.

**Guidance for assistants:**
- When updating pipelines, keep phase ordering, gate semantics, and constraints consistent with the existing pattern (context → planning → analysis → implementation → gates → verification → completion).
- Any change that loosens constraints (e.g., allows inline styles, arbitrary spacing, or skipping gates) should be considered a **breaking change** and only done when explicitly requested.

---
## 4. Commands & Orchestration

High-level orchestration commands live in `commands/` and `commands/_archive/`:

- `/orca` – OS 2.0 pure orchestrator (`commands/orca.md`):
  - Does domain detection and calls domain pipelines.
  - Never writes code; delegates to named agents.
- Requirements lane:
  - `commands/requirements-start.md`, `requirements-status.md`, `requirements-end.md`, etc.
- Design review / visual workflows:
  - `commands/design-review-from-screenshot.md` – uses Playwright + `visual-layout-analyzer` + `frontend-design-reviewer-agent`.
- Other domain entrypoints (SEO, etc.) live alongside.

**When modifying commands:**
- Preserve the pattern of:
  - Small YAML header (`description`, `allowed-tools`).
  - Clear markdown instructions describing how to use Task/agents/tools.
- Do not introduce direct implementation work into orchestration commands; they should coordinate existing agents, not replace them.

---
## 5. Design & Visual System Integration

This repo also encodes **design-system-aware behavior** used across projects:

- Design docs (examples located in other repos, referenced from here) are mirrored into machine‑readable `design-dna.json` per project.
- `agents/frontend-*` and `agents/visual-layout-analyzer.md` assume:
  - Design tokens (typography, colors, spacing) are authoritative.
  - CSS architecture documents (e.g., `CSS-ARCHITECTURE.md` in target projects) define the layering of global tokens vs route-local modules.

When evolving these design-aware agents or docs:
- Keep rules strict and explicit (minimum font sizes, 4px grid, token‑only colors/spacing).
- Treat design docs as **law** for their domain; agents should adapt to the project’s design-dna, not redefine it inside this repo.

---
## 6. Editing Guidelines for This Repo

For Codex, Cursor, and other assistants working here:

- **Do:**
  - Make focused edits to agent specs, pipeline docs, and commands when asked.
  - Maintain consistency across agents, pipelines, and reference docs.
  - Use existing terminology (ContextBundle, phase_state, gates, design-dna).
  - Keep documentation as the source of truth; code/agents should follow docs.

- **Avoid:**
  - Large refactors of the overall OS 2.0 architecture without explicit instructions.
  - Adding new agents or commands that duplicate existing behavior.
  - Weakening constraints or bypassing gates for “convenience”.

This repo is primarily about **how** agents should think and coordinate, not about implementing a single product feature. Treat it as a shared operating system spec for other projects.***
