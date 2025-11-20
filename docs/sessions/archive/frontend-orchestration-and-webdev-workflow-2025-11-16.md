# Vibe Code OS v2 – Orchestration & Frontend Workflow Log (2025‑11‑16)

**Scope:** Memory systems, orchestration architecture, and a concrete `/webdev` frontend workflow built on subagents for Next.js‑style projects.

> **2025‑11‑17 UPDATE – Rollback**
>
> The v2 frontend orchestration experiment described in this log (command‑driven `/webdev` as the primary orchestrator, v2 memory/ACE layering) did **not** work well in practice.  
> The system has been rolled back to the **older `/orca` orchestration model**, with only the **new dev agents** kept:
> - Frontend: `frontend-layout-analyzer`, `frontend-builder-agent`, `frontend-standards-enforcer`, `frontend-design-reviewer-agent`.
> - iOS: `ios-builder-agent`.
>
> `/orca` is once again the main multi‑agent orchestrator for complex work.  
> `/webdev` remains as a **narrow, frontend‑only helper** for stubborn UI/layout issues when you explicitly want that pipeline, but it is **no longer the primary orchestration layer**.
>
> Non‑dev teams (data, SEO, etc.) will be restored separately and wired back into `/orca`.  
> Treat the rest of this document as historical research/notes rather than the current source of truth.

---

## 1. Memory & Orchestration Research Pass

### Response Awareness & ACE

Reviewed:
- `_explore/LLM-research/Response-Awareness-Framework/README.md`
- `Claude Code Subagents_ The Orchestrator’s Dilemma.md`
- `Claude AI Response Awareness Early Slash Command Break Down v2.md`
- `Additional Response Awareness Tags.md`
- `LLMs as Interpreters_ The Probabilistic Runtime for English Programs.md`
- `Response Awareness and Meta Cognition in Claude.md`

Key ideas:
- Main agent = pure orchestrator, never implements.
- 5–6 phase pipeline: survey → parallel planning → synthesis → implementation → verification → final report.
- Metacognitive tags (`#COMPLETION_DRIVE`, `#POISON_PATH`, etc.) as explicit signals to drive verification and learning.
- Explicit vs implicit control; tags vs latent context (LCL).

### Frameworks & Learning Systems

- **ACE-Playbook**, **Pantheon-Framework**, **BMad-Core**, **Cybergenic-Framework**:
  - Emphasize multi-phase planning, verification, and explicit process artifacts (plans, blueprints, playbooks).
  - v1 agents (`engineering-director`, `workflow-orchestrator`, `orchestration-reflector`, `playbook-curator`, `meta-orchestrator`) already mirror ACE’s Generator/Reflector/Curator and Pantheon’s glass‑box processes.

### EquilateralAgents (Standards/Learning)

- `_explore/LLM-research/equilateral-agents-open-core/README.md`

Key insight: institutional knowledge via standards:
- “What happened, the cost, the rule” as canonical pattern.
- Multi-tier standards: `.standards/`, `.standards-community/`, `.standards-local/`.
- Agents and workflows surface recurring issues; humans encode them as standards; agents enforce them.

### Memory Systems

- `_explore/_memory/claude-code-vector-memory-main` → global semantic memory over session summaries.
- `_explore/_memory/workshop-main` → per‑project decisions/gotchas via `workshop` DB.
- `_explore/_memory/claude-self-reflect-main` → heavy, Dockerized global memory system with narratives and evals.
- `docs/memory/memory-systems-overview.md` → target architecture:
  - Native memory (`CLAUDE.md`).
  - Workshop DB per project.
  - `vibe-memory` MCP as bridge (`memory.search` tool).

### Claude Code Internals (Agiflow)

- `_explore/LLM-research/system-prompts/Claude Code Internals_ Reverse Engineering Prompt Augmentation Mechanisms _ Agiflow Blog.md`

Core model:
- System-level: Output Styles.
- Message-level: `CLAUDE.md`, slash commands, skills.
- Conversation-level: subagents (Task → isolated conversation).
- `CLAUDE.md` auto‑injected as `<system-reminder>` into *every* user message, including subagents.
- Skills vs slash commands vs MCP:
  - Skills: model-decided, unstructured, direct Bash → local prototyping.
  - Slash commands: user-explicit workflows.
  - MCP: structured JSON, proper security → ideal for real integrations.

### Subagents

Pulled in the official subagents doc:
- Subagents = separate conversations, their own system prompts & tool sets.
- Stored as Markdown with YAML frontmatter in `~/.claude/agents` or `.claude/agents/`.
- Automatic delegation based on `description` + tools; resumable via `agentId`.

---

## 2. Vibe Memory & v2 Architecture

Documented in `docs/architecture/vibe-code-os-v2-brainstorm.md`:

### Three-Tier Orchestration

1. **Blueprint director** (`engineering-director`) → `.orchestration/engineering-blueprint.md`.
2. **Workflow orchestrator** (`workflow-orchestrator`) → phases + quality gates.
3. **Meta & learning**:
   - `meta-orchestrator` → chooses fast/medium/deep orchestration paths from telemetry.
   - `orchestration-reflector` → turns sessions into pattern outcome data.
   - `playbook-curator` → updates playbooks, applies apoptosis and dedupe.

### `vibe.db` Concept

- Project-local SQLite DB: `./.claude/memory/vibe.db`.
- Tables:
  - `chunks`, `chunks_fts`, `chunk_vectors` for code/docs.
  - `events` for incidents/decisions (“What happened, the cost, the rule”).
  - `tags` connecting chunks/events to RA markers and standards.
- Tied to:
  - `scripts/memory-index.py`, `scripts/memory-search.py`.
  - `vibe-memory` MCP server for `memory.search`.

### Standards Layer (Equilateral-Inspired)

- Tri-level standards:
  - `.standards/` (universal).
  - `.standards-community/` (shared/community).
  - `.standards-local/` (project/team-specific).
- Each standard: “What Happened / The Cost / The Rule”.
- Future `standards-enforcer` gate integrated into orchestration.

### Global vs Project Memory

- Global:
  - Self-reflect and/or vector memory (cross-project narratives).
- Project:
  - `vibe.db` + Workshop DB + `.standards-*` + `.orchestration/*`.
- Orchestrators query both:
  - Global: “have we ever solved X anywhere?”
  - Project: “what did we decide/do in this repo?”

---

## 3. Frontend Agents (v2) – Same.new / Next.js Model

All agents live under `agents/` and are tuned for a Next.js App Router + TypeScript + Tailwind+shadcn-type environment.

### `frontend-layout-analyzer.md`

- Subagent metadata:
  - `name: frontend-layout-analyzer`
  - `tools: Read, Grep, Glob`
  - `model: inherit`
- Role:
  - Structure-first layout analyzer, **read-only**.
  - Used BEFORE any CSS/HTML change for layout/spacing/alignment bugs.
- Behavior:
  - Locate target elements via glob/grep in `src/components`, `app`, `pages`, `ui`, etc.
  - Map structural context: containers, classes, parent components.
  - Trace styles to CSS sources: `src/styles/globals.css`, `tokens.css`, `components/*.css`, etc.
  - Detect anti-patterns:
    - Inline styles, hard-coded px values where tokens should be used.
    - Local overrides fighting global layout.
  - Output a “Layout Dependency Map” summarizing:
    - Render locations, containers, classes, CSS files, tokens, anti-patterns, and implications for where fixes belong.

### `frontend-standards-enforcer.md`

- Subagent metadata:
  - `name: frontend-standards-enforcer`
  - `tools: Read, Grep, Glob, Bash`
- Role:
  - Standards/layout guard.
  - Used AFTER implementation to enforce global CSS + tokens + standards.
- Behavior:
  - Read:
    - `docs/architecture/agents.md`
    - Project `CLAUDE.md` / `.claude/CLAUDE.md`
    - (Via `/webdev`) design DNA docs.
  - `git diff` to scope changed files.
  - Scan for:
    - Inline styles (`style=`, `style={{`).
    - Utility-class regressions.
    - Hard-coded spacing where tokens exist.
  - Consult Workshop (`workshop search` / `workshop why`) when available for prior decisions.
  - Output a structured audit (scope, violations, Workshop context, recommendations).

### `frontend-builder-agent.md`

- Subagent metadata:
  - `name: frontend-builder-agent`
  - `tools: Read, Edit, Write, MultiEdit, Grep, Glob, Bash`
- Role:
  - Global frontend implementation specialist.
  - Implements UI/UX in production code using design system + analyzer’s dependency map.
- Behavior:
  - Default stack:
    - Next.js App Router + TypeScript.
    - Tailwind+shadcn components.
  - Reads design system sources:
    - `agents/agent-project-skills/*-design-system-SKILL.md`
    - `skills/*-design-system/SKILL.md`
    - `docs/design/design-dna/design-dna.json`
    - `docs/design/design-system-guide.md`
    - `docs/design/design-ocd-meta-rules.md`.
  - Summarizes design rules (color roles, typography, spacing grid, primitives).
  - Implements minimal, safe changes:
    - Fixes at token/container/component CSS level.
    - Avoids inline styles and raw px/color values when tokens exist.
  - Runs tests/lint/verification as available.
  - Self-audits for design compliance and consistency.

### `frontend-design-reviewer-agent.md`

- Metadata added:
  - `name: frontend-design-reviewer-agent`
  - `tools: Read, Grep, Glob, Bash`
- Role:
  - Visual QA gate; reuses design-dna + design-system rules as a quality gate for design-heavy changes.

### `frontend-workflow-orchestrator.md`

- Initially created as a pure orchestration subagent:
  - Called analyzer → builder → standards.
  - Used `TodoWrite` and internal AskUserQuestion.
- **Later deleted**:
  - In practice, Claude often narrated “I’m dispatching X” instead of actually calling tools inside this subagent.
  - This caused apparent “background” workflows that never ran.
  - Replaced by a command-driven model (`/webdev`) where the main agent orchestrates via `Task`.

---

## 4. `/webdev` Slash Command – Direct Analyzer → Builder → Standards Orchestration

- File: `commands/webdev.md`
- Description:
  - “Force web frontend multi-agent orchestration (analyzer → implementation → standards gates) for UI/layout issues.”
- Allowed tools:
  - `Task`, `Read`, `TodoWrite`, `AskUserQuestion`.

### Phase 0 – Agent Team Q&A (AskUserQuestion)

- Presents interactive choices:
  - Full pipeline (analyze → implement → standards).
  - Analysis only.
  - Customize scope.
- Behavior:
  - **Full pipeline** → run all three phases within this command.
  - **Analysis only** → call `frontend-layout-analyzer` only; summarize and stop.
  - **Customize scope** → ask clarifying questions, re-propose a team, re-run Q&A.

### Phase 1 – Analysis (Direct Subagent Call)

For full pipeline:

```ts
Task({
  subagent_type: "frontend-layout-analyzer",
  prompt: `
User request:
${$ARGUMENTS}

Context:
- This is a frontend/UI/layout/spacing/visual issue.
- Produce a clear dependency map for the relevant pages/components:
  - Where the elements are rendered.
  - Which containers and classes control layout/spacing.
  - Which tokens/variables and inline styles are involved.
  - The most likely root causes for the misalignment/spacing issues.
`
})
```

The main agent is instructed to briefly summarize analyzer output before moving to implementation.

### Phase 2 – Implementation (`frontend-builder-agent`)

```ts
Task({
  subagent_type: "frontend-builder-agent",
  prompt: `
User request:
${$ARGUMENTS}

You are the frontend implementation specialist.

Context:
- Before any edits, READ and apply the project's design DNA:
  - docs/design/design-dna/design-dna.json
  - docs/design/design-ocd-meta-rules.md
  - docs/design/design-system-guide.md (if present)
- Use the dependency map produced by frontend-layout-analyzer in this conversation.
- Fix the issue at the correct layer (tokens, containers, or component CSS) without introducing inline styles or utility-class hacks.
- Enforce the 4px-based spacing grid and token-only rules from design DNA:
  - Spacing, radii, and layout values must be multiples of the base grid.
  - Colors and typography must use tokens/variables instead of raw literals.
- Respect the global CSS + design token rules from docs/architecture/agents.md and CLAUDE.md.
`
})
```

### Phase 3 – Standards (`frontend-standards-enforcer`)

```ts
Task({
  subagent_type: "frontend-standards-enforcer",
  prompt: `
User request:
${$ARGUMENTS}

You are the frontend standards guard.

Context:
- Before auditing, READ the design DNA + meta rules:
  - docs/design/design-dna/design-dna.json
  - docs/design/design-ocd-meta-rules.md
- Treat those as enforceable standards in addition to:
  - docs/architecture/agents.md
  - CLAUDE.md / .claude/CLAUDE.md
- Audit the recent changes made by frontend-builder-agent for this UI/layout issue.
- Check for:
  - Inline styles
  - Utility-class regressions
  - Hard-coded spacing/typography where tokens exist
  - Violations of any Workshop-derived standards
- Report any violations with file paths and concrete snippets.
`
})
```

The main agent is instructed to summarize any violations for the user and coordinate re-work if necessary.

---

## 5. Observed Runtime Issues & Fixes

### Subagents “Doing Nothing”

Problem:
- When orchestration logic lived inside `frontend-workflow-orchestrator`, Claude often narrated “the orchestrator has started / dispatching X” without actually calling `Task` from that subagent.
- From the CLI’s perspective, no further tool calls occurred after the narration, so workflows silently stalled.

Fix (initial v2 attempt):
- Deleted `agents/frontend-workflow-orchestrator.md`.
- Moved orchestration back into `/webdev` so the **main agent** calls subagents directly, just like `/orca`:
  - AskUserQuestion → `Task(frontend-layout-analyzer)` → `Task(frontend-builder-agent)` → `Task(frontend-standards-enforcer)`.

Rollback (current state – 2025‑11‑17):
- The `/webdev`‑first orchestration model proved brittle and hard to reason about.
- `/orca` has been restored as the **primary, cross‑domain orchestrator**, now updated to use the v2 frontend and iOS builder agents as its default dev specialists.
- `/webdev` is kept as an optional, narrow command for focused UI/layout debugging, but multi‑agent orchestration strategy lives under `/orca` again.

### HTML Minisite vs Same.new Stack

Problem:
- Early attempts to support raw `*.html` minisites inside these agents risked reintroducing the “do everything everywhere” trap and diluted the Same.new mental model.

Fix:
- Removed static-HTML-specific behavior from v2 frontend agents.
- Kept v2 flows strictly for component-based Next.js-style projects.
- Minisite HTML is treated as a separate context; the v2 agents are allowed to be “not very helpful” there by design.

### Node OOM in `claude` CLI

Problem:
- `claude --dangerously-skip-permissions` + heavy context + multiple MCP servers caused V8 heap OOM.

Mitigation:
- Restart `claude` to clear heap.
- Optionally increase heap: `NODE_OPTIONS="--max-old-space-size=4096" claude …`.
- Be mindful of combining large audits with heavy MCP stacks in a single session.

---

## 6. Next Steps

- Use `/orca` as the default entry point for complex, multi‑agent work (frontend, backend, iOS, data, etc.), relying on its team selection + interactive Q&A.
- Keep `/webdev` as a specialized command for stubborn UI/layout issues when you explicitly want the analyzer → builder → standards pipeline.
- Fold the v2 frontend agents into `/orca`’s team definitions (frontend layout analyzer/builder/standards/design‑review), and keep narrowing their scopes over time to avoid “belligerent” behavior.
- When `vibe.db` is ready, connect frontend events (incidents, decisions) into `events`/`tags` so repeated layout bugs and fixes contribute to institutional memory, but drive those workflows through `/orca` rather than a bespoke orchestrator.

