# OS v2.0 Nextjs Lane – Plan & Architecture (2025‑11‑24)

## 0. Scope & Goals

This document defines the plan for upgrading the **frontend lane** from a simple “webdev” setup into a full **Next.js‑centric lane** that is on par with (or stronger than) the iOS and Expo lanes.

We will:
- Treat **Next.js App Router + Tailwind + shadcn/ui + lucide** as the *default frontend architecture* when the project does not clearly specify otherwise.
- Make **design‑dna** and the design system a hard, structural constraint for all UI work (front end as important as back end).
- Replace the old ad‑hoc “webdev” lane (and any deprecated `/orca-webdev`) with a **Nextjs lane** that has:
  - A **grand orchestrator** (architecture + team assembly, no implementation) that runs on **Opus**,
  - A Next.js‑aware architect (Sonnet),
  - An implementation layer with a dedicated builder and **Nextjs‑specific specialists** (Sonnet),
  - Strong gates (standards, design QA, verification) backed by both project‑local standards and global knowledge via context7 + Skills.

All worker and specialist agents in this lane will use **Sonnet** by default (no Haiku).  
The **Nextjs grand orchestrator** will use **Opus** for maximum reasoning and coordination capacity.

---

## 1. Naming & Pipeline Alignment

### 1.1 Lane Naming

- We will stop using the term **“webdev”** in user‑facing commands and agents.
- The lane will be referred to as the **Nextjs lane** (or simply “dev lane” when clearly scoped to frontend).
- Internally, existing files using `webdev-` IDs can remain for now but will be treated as implementation details; a follow‑up refactor can rename them once everything is wired.

### 1.2 Pipeline Doc Rename

- Rename:
  - `docs/pipelines/webdev-pipeline.md`
  → `docs/pipelines/nextjs-pipeline.md`
- Update all references (commands, agents, docs) that point to `webdev-pipeline.md` to refer to `nextjs-pipeline.md`.

### 1.3 Phase Config

- Keep using `docs/reference/phase-configs/webdev-phase-config.yaml` as the **phase contract** for now, but conceptually treat it as the **Nextjs lane phase config**.
- Its `phase_state` contract already lines up with the lane we want:
  - `current_phase` ∈ {`context_query`, `requirements_impact`, `planning`, `analysis`, `implementation_pass1`, `gates`, `implementation_pass2`, `verification`, `completion`}.
  - Per‑phase fields for requirements/impact, planning, analysis, implementation, gates, verification, and completion.

Later we can add a `nextjs-phase-config.yaml` alias or rename the file once the new agents and commands are stable.

---

## 2. High‑Level Lane Topology

### 2.1 Commands & Entry

- Introduce a new **Nextjs lane command**:
  - `commands/orca-nextjs.md` (replacing the deprecated `/orca-webdev`).
- `/orca-nextjs` responsibilities:
  - Detect when a task is clearly frontend/Next.js,
  - Run ProjectContextServer (`context_query`),
  - Perform domain/team Q&A with the user (confirm lane, proposed agents, phase plan),
  - Delegate lane execution to **Nextjs agents** (never write code itself),
  - Maintain and write `phase_state.json` according to `webdev-phase-config.yaml` (Nextjs phase contract).

### 2.2 Phases

We keep the OS 2.2 phase sequence, expressed in Nextjs terms:

1. `context_query` – ProjectContextServer for `"dev"` / `"nextjs"`.
2. `requirements_impact` – restate request, classify change_type, identify affected routes/components.
3. `planning` – architectural decision + implementation plan.
4. `analysis` – structural/layout analysis before code changes.
5. `implementation_pass1` – initial implementation.
6. `gates` – parallel gate group:
   - Standards (code‑level),
   - Design QA (visual),
   - Optional: a11y, perf, security, SEO.
7. `implementation_pass2` – corrective pass (ONE pass only).
8. `verification` – lint/test/build verification.
9. `completion` – summarize outcome, record learnings.

All phases read and write `.claude/orchestration/phase_state.json`.

---

## 3. Nextjs Agent Team (New Agents)

We will design a **full agent team** for the Nextjs lane, inspired by the iOS lane structure and the external agent collections we reviewed (agentwise, design‑with‑claude, equilateral, zshama, sub‑agents).

All agents default to **Sonnet**; none use Haiku.

### 3.1 Orchestration & Architecture

#### 3.1.1 `nextjs-grand-architect` (Opus)

**Role:** Tier‑S orchestrator for the Nextjs lane (analog of `ios-grand-architect`, but Nextjs‑specific, running on **Opus** like the Expo grand orchestrator).

- Model: **Opus** (for deep, cross‑phase reasoning and multi‑agent coordination).
- Tools: `Task`, `AskUserQuestion`, `mcp__project-context__query_context`, `mcp__project-context__save_decision`, `mcp__context7__resolve-library-id`, `mcp__context7__get-library-docs`.
- Responsibilities:
  - Detect tasks that belong to the Nextjs lane (based on request + repo structure).
  - Ensure **ContextBundle** exists (run ProjectContextServer if missing).
  - Confirm design‑dna presence when UI changes are in scope (block and delegate to design system agents if missing or incomplete).
  - Classify task complexity and risk:
    - `change_type`: `bugfix | small_feature | page_feature | multi_page_feature | architecture_change`.
    - Risk flags: auth, payments, SEO‑critical page, performance‑sensitive flows, etc.
  - Choose high‑level architecture path:
    - Next.js App Router vs legacy Pages Router (if present),
    - RSC vs client boundaries,
    - Data/state stack patterns (React Query, Zustand, etc.), respecting existing project patterns.
  - Assemble the agent team:
    - `nextjs-architect` for planning,
    - `nextjs-builder` + specialists for implementation,
    - `nextjs-standards-enforcer`, `nextjs-design-reviewer`, `nextjs-verification-agent` for gates,
    - Optional: a11y, perf, security, SEO specialists.
  - Keep **plan + gates** in its context (no code editing).
  - Save decisions via ProjectContextServer (`save_decision`) for long‑term learning.

#### 3.1.2 `nextjs-architect`

**Role:** Lane architect; decides *how* to implement the task in the Next.js stack.

- Tools: `Read`, `Grep`, `Glob`, `Bash`, ProjectContextServer tools, context7 tools.
- Responsibilities:
  - Use ContextBundle to:
    - Identify routing structure (App Router layouts, route groups, entry points),
    - Detect current state/data patterns (React Query, Zustand, etc.),
    - Locate design‑dna and CSS architecture docs.
  - Call context7 to load **global Next.js knowledge**:
    - e.g., libraries `nextjs-best-practices`, `tailwind-shadcn-patterns`, `os2-nextjs-lane` (concrete IDs to be defined).
  - Produce a **requirements & impact** summary:
    - `change_type`,
    - `affected_routes`, `affected_components`,
    - Risks and dependencies.
  - Produce an **architecture & implementation plan**:
    - Rendering strategy (SSR/SSG/ISR/PPR, RSC vs client),
    - Data/state approach (server actions, React Query, etc.),
    - File/component‑level changes (what to edit/create),
    - Which specialists to involve (Tailwind/CSS/TS/SEO/perf).
  - Write outputs into:
    - `phase_state.requirements_impact` (scope, change_type, affected routes/components, risks),
    - `phase_state.planning` (architecture_path, plan_summary, assigned_agents).

The architect never edits code; it only plans and routes.

---

### 3.2 Design System & Design‑DNA

#### 3.2.1 `design-system-architect` (shared)

**Role:** Owns design‑dna creation and evolution across lanes, with a strong focus on Next.js frontends.

- Tools: `Read`, `Bash`, ProjectContextServer tools, context7 tools.
- Responsibilities:
  - When design‑dna is missing or clearly incomplete for the requested UI work:
    - Discover existing design system docs (e.g., `design-system.md`, `CSS-ARCHITECTURE.md`, `bento-system-*.md`),
    - Use `commands/design-dna.md` to generate or extend `/.claude/design-dna/*.json`,
    - Use context7 to load relevant design libraries (from design‑with‑claude, design principles checklists, brand guidelines).
  - When design‑dna exists:
    - Evaluate whether new requirements require:
      - New tokens,
      - New component variants,
      - Or can be expressed using existing patterns.
    - Provide clear, structural constraints (minimum font sizes, spacing grid, color usage rules, pattern definitions) to the Nextjs lane.
  - Record design system decisions in:
    - `phase_state` (e.g., `planning` and/or dedicated `design_system` entries),
    - ProjectContextServer decisions for reuse.

#### 3.2.2 Customization Gate Integration

- `nextjs-grand-architect` and/or `nextjs-architect`:
  - Run a **Customization Gate** based on:
    - Presence and completeness of design‑dna,
    - Whether the request implies new visual customizations (tokens, variants, theming).
- If the gate fails:
  - Block implementation,
  - Route through `design-system-architect` + `commands/design-dna.md` to bring design‑dna up to spec,
  - Only then proceed to analysis/implementation.

---

### 3.3 Implementation Layer

#### 3.3.1 `nextjs-builder`

**Role:** Primary implementation agent for Next.js UI/UX changes.

- Tools: `Read`, `Edit`, `MultiEdit`, `Grep`, `Glob`, `Bash` (no direct MCP tools; it should consume context prepared by the architect and design system).
- Responsibilities:
  - Use **Next.js App Router + Tailwind + shadcn/ui + lucide** as the default stack when project context is ambiguous.
  - Work from:
    - ContextBundle (`relevantFiles`, `designSystem`, `relatedStandards`),
    - `phase_state.requirements_impact` (scope, change_type),
    - `phase_state.planning` (architecture_path, assigned_agents),
    - `phase_state.analysis` (layout structure, component hierarchy, style sources).
  - Implementation constraints:
    - **Design‑dna first**:
      - Use design‑dna tokens for colors/spacing/typography wherever available,
      - Avoid inline styles and raw hex/spacing values when token equivalents exist.
    - **QuickEdit by default**:
      - Prefer small, localized diffs using Edit/MultiEdit semantics;
      - Avoid full‑file rewrites except when explicitly requested in the plan.
    - **File limits**:
      - Respect file limits based on `change_type` and `webdev/Nextjs phase config` (simple/medium/complex).
    - **Verification**:
      - Run lint/typecheck (and local tests where configured) within each implementation pass, capturing outputs for the verification phase.
  - Delegate to specialists when needed:
    - `_AGENTS/Web-Dev/tailwind-artist`, `tailwind-expert` for complex layouts/Tailwind grids,
    - `_AGENTS/Web-Dev/css-expert` for non‑Tailwind CSS refactors,
    - `_AGENTS/Web-Dev/typescript-pro` for advanced TS/type‑safety tasks,
    - `nextjs-architect` again when architectural questions arise.

The builder never changes architecture on the fly; it implements the architect’s plan within the lane’s constraints.

---

### 3.3.2 Nextjs Specialist Agents (New, In‑Repo)

Rather than delegating to pre‑existing agents in `_explore/_AGENTS`, we will define our own **Nextjs‑specific specialist agents** under `agents/dev` (or a `agents/dev/nextjs` subfolder). These will be inspired by the external agents we studied (tailwind‑artist, nextjs‑architect, typescript‑pro, etc.), but will be **first‑class OS 2.2 agents** tuned to our lane:

- `nextjs-tailwind-specialist`
  - Focus: Tailwind utility composition, responsive layouts, design‑dna token mapping, grid systems, and shadcn/ui integration.
  - Draws from: `_AGENTS/Web-Dev/tailwind-artist.md`, `tailwind-expert.md`, sub‑agents‑elite `tailwind-artist.md`.

- `nextjs-layout-specialist`
  - Focus: Complex layout problems (App Router layouts, nested layouts, content structure), CSS architecture alignment, flex/grid semantics.
  - Draws from: `_AGENTS/Web-Dev/css-expert.md`, design-with-claude layout patterns, S‑tier dashboard checklist.

- `nextjs-typescript-specialist`
  - Focus: Advanced TS patterns in Next.js (App Router types, RSC props, server actions, shared types between API/routes/components).
  - Draws from: `_AGENTS/Web-Dev/typescript-pro.md`, sub‑agents‑awesome `typescript-pro.md`.

- `nextjs-performance-specialist`
  - Focus: Core Web Vitals, bundle analysis, code‑splitting, streaming, RSC perf, image/font optimization.
  - Draws from: equilateral `CodeAnalyzerAgent`, `UIUXSpecialistAgent` perf sections, Nextjs optimization guides.

- `nextjs-accessibility-specialist`
  - Focus: WCAG 2.1+/2.2 for Next.js UIs, ARIA where appropriate, focus management, keyboard flows.
  - Draws from: design-with-claude `accessibility-specialist.md`, a11y‑enforcer patterns.

- (Optional) `nextjs-seo-specialist`
  - Focus: route metadata, structured data, canonical URLs, content hierarchy for SEO‑critical pages.
  - Draws from: existing SEO agents, S‑tier dashboard design principles doc, NEXT SEO patterns.

All of these specialists:
- Will be **implemented as dedicated agent specs in this repo**, not by delegating directly to `_explore/_AGENTS` definitions.
- Will default to **Sonnet**,
- Will be invoked by `nextjs-architect` / `nextjs-builder` / gates when their specialty is required, using `Task` with clear scopes.

---

### 3.4 Gate & Verification Layer

#### 3.4.1 `nextjs-standards-enforcer`

**Role:** Code‑level standards gate for the Nextjs lane.

- Tools: `Read`, `Grep`, `Glob`, `Bash`, context7 tools.
- Responsibilities:
  - Read:
    - `phase_state.implementation_pass1.files_modified` (and `implementation_pass2` when used),
    - ContextBundle `relatedStandards`,
    - design‑dna + CSS architecture docs,
    - context7 libraries containing web/frontend/Next.js standards.
  - Enforce:
    - No inline styles where design‑dna tokens exist,
    - No raw hex colors / spacing / font sizes where tokens exist,
    - Use of Next.js best practices (RSC boundaries, `next/image`, data fetching patterns, etc.),
    - TypeScript/lint rules (no reckless `any`, consistent imports),
    - Basic security hygiene for frontend code.
  - Scoring:
    - Compute `standards_score` 0–100 aligned with `webdev-phase-config.yaml` semantics:
      - ≥90 → PASS,
      - 70–89 → CAUTION,
      - <70 or any critical violations (inline styles, token violations, severe architecture breaks) → FAIL.
  - Outputs:
    - `standards_score`, `violations`, `gate_decision` into `phase_state.gates`,
    - Update `gates_passed` / `gates_failed` appropriately.

#### 3.4.2 `nextjs-design-reviewer`

**Role:** Visual/UX gate, Playwright‑driven, Nextjs‑aware.

- Tools: `Read`, `Bash`, Playwright MCP, context7 tools.
- Responsibilities:
  - Live environment first:
    - Use Playwright to:
      - Navigate to affected routes,
      - Capture screenshots at 375/768/1440/1920,
      - Exercise key flows,
      - Inspect console and network.
  - Apply the Patrick Ellis + Claude Code design‑review workflow:
    - Preparation → Interaction/User Flow → Responsiveness → Visual Polish → Accessibility → Robustness → Content/Console.
  - Use context7 to load:
    - Design principles libraries (e.g. S‑tier dashboard checklist),
    - Internal design QA checklists,
    - Any brand‑ or product‑specific design manuals.
  - Scoring:
    - `design_score` 0–100:
      - Penalize hierarchy/typography/spacing/color/responsive/accessibility/interaction issues,
      - Classify gate: PASS (≥90), CAUTION (80–89), FAIL (<80 or any blockers).
  - Outputs:
    - `design_score`, `visual_issues`, `gate_decision` into `phase_state.gates`,
    - Evidence paths (screenshots, reports) in `.claude/orchestration/evidence/…`.

#### 3.4.3 `nextjs-verification-agent`

**Role:** Build/test verification gate.

- Tools: `Read`, `Bash`.
- Responsibilities:
  - Run project‑appropriate verification commands:
    - `next lint`,
    - `next test` / jest / Playwright tests (if configured),
    - `npm/pnpm/bun run build` as defined in the repo’s tooling.
  - Summarize:
    - Build status,
    - Test results,
    - Key errors.
  - Record:
    - `verification_status` (pass/fail/partial),
    - `commands_run` in `phase_state.verification`,
    - Feed the `build_gate` as defined in `webdev/Nextjs phase config`.

#### 3.4.4 Optional Shared Specialists

These agents already exist and can be reused:
- `a11y-enforcer` – deeper accessibility checks.
- `performance-enforcer` / `performance-prophet` – performance budgets, bundle size analysis, runtime perf.
- `security-specialist` – web security audit.
- SEO agents – for content/landing page SEO correctness.

---

## 4. context7 Integration Plan

We will treat **context7** as the global knowledge layer for the Nextjs lane, accessed via the MCP tools:
- `mcp__context7__resolve-library-id`
- `mcp__context7__get-library-docs`

### 4.1 Where to Use context7

1. **Architecture & planning (nextjs-grand-architect, nextjs-architect)**
   - Load Next.js best practices, Tailwind/shadcn patterns, OS 2.2 lane docs.
   - Summarize constraints and patterns into `phase_state.planning` (architecture_path, plan_summary).

2. **Design system (design-system-architect + design-dna command)**
   - Load design‑with‑claude patterns, design principles checklists, brand guidelines.
   - Use them to inform design‑dna generation and updates.

3. **Standards gates (nextjs-standards-enforcer)**
   - Load global standards libraries (front‑end coding standards, Next.js patterns, internal standards).
   - Combine them with repo‑local standards (workshop/vibe) for enforcement.

4. **Design QA (nextjs-design-reviewer)**
   - Load design QA libraries from context7 (dashboard checklists, responsiveness/a11y patterns).
   - Apply them to live UI via Playwright.

### 4.2 Skills + context7

To keep agent prompts lightweight, we will express context7 usage in **Agent Skills**:

- `nextjs-knowledge-skill`:
  - SKILL.md describes which context7 libraries hold Next.js patterns and when to load them.
- `design-qa-skill`:
  - SKILL.md points to design principles and QA checklists in context7.
- `design-dna-skill`:
  - SKILL.md explains how to interpret and enforce design‑dna, with optional context7 links.

Agents then reference these Skills (“Use nextjs-knowledge-skill when planning architecture”) rather than directly scripting context7 behavior in every prompt.

---

## 5. Implementation Roadmap

1. **Rename pipeline doc**
   - Rename `docs/pipelines/webdev-pipeline.md` → `docs/pipelines/nextjs-pipeline.md`.
   - Update references in commands and agents.

2. **Define new Nextjs agents**
   - Add agent specs under `agents/dev` (or a `agents/dev/nextjs` subfolder):
     - `nextjs-grand-architect.md`
     - `nextjs-architect.md`
     - `design-system-architect.md` (cross‑lane, if not already present)
     - `nextjs-builder.md`
     - `nextjs-standards-enforcer.md`
     - `nextjs-design-reviewer.md`
     - `nextjs-verification-agent.md`
   - Ensure:
     - `model: sonnet` (no Haiku),
     - Tools are minimal and appropriate for each role,
     - They reference `nextjs-pipeline.md`, `webdev/Nextjs phase config`, and any relevant Skills.

3. **Create `/orca-nextjs` command**
   - Add `commands/orca-nextjs.md`:
     - Domain detection for Next.js,
     - Context query,
     - Domain/team Q&A,
     - Delegation to Nextjs agents per phase,
     - `phase_state.json` updates for each phase.
   - Remove or archive any old `/orca-webdev` usage.

4. **Wire Customization Gate to design-dna workflow**
   - Make `nextjs-architect` and/or `nextjs-grand-architect` enforce the Customization Gate.
   - Use `design-system-architect` + `commands/design-dna.md` to generate/extend `design-dna.json` as needed before implementation.

5. **Author Nextjs Skills**
   - Create Skills under `_SKILLS` or equivalent for:
     - `nextjs-knowledge-skill`,
     - `design-qa-skill`,
     - `design-dna-skill`,
     - `nextjs-perf-skill` (optional).
   - Each SKILL.md:
     - Includes name/description,
     - References context7 libraries for deeper knowledge,
     - Keeps itself small, with extra detail pushed into additional files/scripts.

6. **Integrate gates with phase_state**
   - Ensure `nextjs-standards-enforcer`, `nextjs-design-reviewer`, and `nextjs-verification-agent`:
     - Read from `phase_state.implementation_pass1`/`implementation_pass2`,
     - Write scores, decisions, and artifacts into `phase_state.gates`, `verification`, and `completion`,
     - Respect the thresholds and semantics from `webdev-phase-config.yaml` (Nextjs phase config).

7. **Cross-lane design QA convergence (later)**
   - Once Nextjs design QA is stable, harmonize `nextjs-design-reviewer` with iOS/Expo visual review agents so there is a unified design QA framework (Playwright + design‑dna + principles) across OS 2.2.

---

## 6. Non‑Goals / Deferred Decisions

- We are **not** attempting to:
  - Rewrite all existing frontend agents immediately; instead we introduce Nextjs‑specific agents and treat old `frontend-*` as deprecated.
  - Rename every `webdev-*` filename all at once; we will first stand up the new Nextjs lane and then consolidate naming once it is stable.
  - Replace all ad‑hoc usage of context7; initial focus is on the Nextjs lane (architect, design system, standards, design QA).

- We can revisit:
  - Whether to split the lane into multiple flavors (e.g., marketing/SEO vs app dashboards),
  - Whether to add a dedicated **Nextjs grand orchestrator** agent type in `~/.claude/agents` for use beyond this repo.

This plan captures the current OS v2.0 direction for the frontend lane: **Next.js‑centric, design‑dna‑first, orchestrator‑driven, and context7‑backed**, with Sonnet‑only agents and a clear state/phase/gate architecture.
