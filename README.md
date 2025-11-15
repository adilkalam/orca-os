  /$$$$$$  /$$$$$$$   /$$$$$$   /$$$$$$ 
 /$$__  $$| $$__  $$ /$$__  $$ /$$__  $$
| $$  \ $$| $$  \ $$| $$  \__/| $$  \ $$
| $$  | $$| $$$$$$$/| $$      | $$$$$$$$
| $$  | $$| $$__  $$| $$      | $$__  $$
| $$  | $$| $$  \ $$| $$    $$| $$  | $$
|  $$$$$$/| $$  | $$|  $$$$$$/| $$  | $$
 \______/ |__/  |__/ \______/ |__/  |__/
                                                                
                                           


# Vibe Code / Claude Agentic OS

> **CRITICAL — Repo Purpose**
>
> This repo is a **version‑controlled mirror** of your global Claude config in `~/.claude`.  
> **`~/.claude` is the source of truth.**  
> You edit commands/agents/MCPs in `~/.claude`, then sync back here.

---

## 1. Why This Exists (Situation → Complication → Resolution)

### Situation

You’re using Claude Code to build real products:
- Brand systems (OBDN, PeptideFox, etc.)
- Web apps, dashboards, iOS apps
- Data/SEO tooling and design systems

Initially, everything goes through “one big smart chat” with a generic assistant.

### Complication

That model quickly hits hard limits:

- **AI deviance**
  - Says “done” when code doesn’t run, tests don’t pass, UI is broken.
  - Quietly ignores constraints or drifts away from the original request.

- **Janky UI/UX**
  - Generic agents hallucinate design systems, spacing, typography.
  - Orca + “design” personas produced chaotic, off‑brand layouts.

- **Chaos & token bloat**
  - Thousands of planning files, no file limits.
  - Repeatedly re‑explaining brand rules, design systems, and decisions.
  - No reliable memory; every session starts from scratch.

- **Unreliable orchestration**
  - Multi‑agent systems run without strong scopes or guardrails.
  - No hard requirement to prove work with tests/build/screenshots/logs.

### Resolution — A Personal AI OS for Claude

This system is a **constrained, evidence‑driven OS** around Claude:

- **Global OS in `~/.claude`**
  - Commands, agents, MCP servers, hooks.
  - This repo (`claude-vibe-config`) is a mirror of that OS.

- **Project DNA + memory**
  - Each project (OBDN, PeptideFox, etc.) has its own design system + brand docs.
  - A local memory database (via the `workshop` tool + `vibe-memory` MCP) stores decisions, gotchas, goals.

- **Orchestrators + narrow specialists**
  - Orchestrators (`/response-aware`, `/orca`) own planning + verification.
  - Narrow agents (`/creative-strategist`, `/design-director`, `/obdn-designer`, `/fox-designer`) stay in strict lanes with hard rules.

- **Evidence‑based completion**
  - Work is not “done” until there is proof: tests, builds, screenshots, logs, all reconciled against meta‑tags.

The rest of this README explains how that OS works.

---

## 2. Quickstart: Usage Recipes

For people who just want to use it, not study LLM research:

- **Design a new PeptideFox tool screen**
  - Plan:  
    ```text
    /response-aware -plan "PeptideFox dosing planner v1"
    ```
  - Tighten UI blueprint:  
    ```text
    /fox-designer -iterate "Refine layout for dosing results section"
    ```
  - Implement + verify from blueprint:  
    ```text
    /response-aware -build path/to/blueprint.md
    ```

- **Design an OBDN layout**
  ```text
  /obdn-designer "OBDN product detail page layout"
  ```

- **Full end‑to‑end implementation with proof**
  ```text
  /response-aware "Add dark mode to dashboard"
  ```

- **Analyze creative performance and strategy**
  ```text
  /creative-strategist "<paste performance data + ads>"
  ```

You can get real work done with just these commands; the rest of the README explains what they’re doing under the hood.

---

## 3. Mental Model: How a Request Flows

At a high level, every request goes through this pipeline:

```text
You
  ↓
Orchestrator Command
  (/response-aware, /orca)
  ↓
Context & Memory
  - Global docs (CLAUDE.md, design systems)
  - Project memory DB via vibe-memory MCP
  ↓
Specialist Agents
  (strategists, designers, implementors)
  ↓
Implementation & Tools
  - File edits via tools
  - MCPs (playwright, chromedevtools, iossimulator, etc.)
  ↓
Verification & Evidence
  - Tests / builds / screenshots / logs
  ↓
Final Synthesis
  - Decisions + proof
```

Key ideas:

- You talk mostly to **orchestrators** (`/response-aware`, `/orca`).
- They pull **memory** (project decisions + design DNA) into context.
- They dispatch **specialists** with narrow scopes and hard rules.
- Implementors write code; verifiers must capture **evidence**.

---

## 4. Example Flow: New PeptideFox Library Screen

Concrete story: designing and implementing a new PeptideFox peptide library screen.

### 4.1 Plan the work

You start with plan‑only mode:

```text
/response-aware -plan "Peptide library grid v2"
```

Response Awareness will:

- Load PeptideFox design DNA:
  - `design-system-v7.0.0.md`
  - `DESIGN_RULES.md`
- Query project memory via **vibe‑memory MCP**:
  - Decisions like “No Tailwind; use design tokens.”
  - Past gotchas and goals.
- Run parallel domain planners and synthesize:
  - One implementation blueprint with explicit interfaces and risks.
  - A question to you via `AskUserQuestion` to confirm the plan.

You review and approve the blueprint (or tweak it).

### 4.2 Refine the UI blueprint

Then you call the brand‑specific UI architect:

```text
/fox-designer -iterate "Refine card layout + spacing for peptide library grid"
```

`/fox-designer` will:

- Recall PeptideFox v7 design system and rules.
- Use its scaffold:
  - FRAME → STRUCTURE → SURFACE → CALCULATE → CODE GUIDANCE
- Enforce:
  - Brown LL / Brown Mono LL / Brown LL Inline rules.
  - Spacing tokens (2 → 4 → 8 → 12 → 16 → 24 → 32 → 48 → 64 → 96).
  - Card width math so badges don’t wrap jankily.

It returns a **PeptideFox Design Blueprint** for the UI layer.  
You fold this into the main implementation blueprint.

### 4.3 Build & verify

Once the blueprint is approved and updated, you run:

```text
/response-aware -build path/to/blueprint.md
```

Build mode will:

- Implement strictly from the blueprint (no plan mutation).
- Tag all assumptions and file operations
  (`#COMPLETION_DRIVE`, `#FILE_CREATED`, `#FILE_MODIFIED`, etc.).
- Use tools and MCPs to verify:
  - Unit/integration tests via `scripts/capture-tests.sh`.
  - Builds via `scripts/capture-build.sh`.
  - Visual checks and flows via MCPs:
    - `playwright` → drive a real browser, capture screenshots/videos.
    - `chromedevtools` → inspect DOM, network, console.
  - For native/iOS flows:
    - `iossimulator` → run iOS Simulator and capture evidence.
- Store evidence under:
  - `.orchestration/evidence/` (screenshots, logs)
  - `.orchestration/implementation-log.md` (tags + meta‑cognition)
- Run `bash scripts/finalize.sh` to produce a `.verified` marker.

The final synthesis step reports:
- What was done.
- What decisions were made.
- Where to find the evidence.

---

## 5. Memory & Vibe‑Memory MCP

Memory is a first‑class part of this system; it’s not just token context.

### 5.1 Workshop: Project Memory

Memory is managed via the **Workshop** tool:

- Repo: <https://github.com/zachswift615/workshop>
- It stores project knowledge in:
  - `project/.claude/memory/workshop.db`

You record:
- Decisions (“Use Supabase for auth.”)
- Gotchas (“iOS Simulator needs Xcode 15.4+ on macOS 15.”)
- Goals, notes, and anti‑patterns.

### 5.2 Vibe‑Memory MCP

The **vibe‑memory** MCP server exposes that database to Claude:

- Installed locally at:
  - `~/.claude/mcp/vibe-memory`
- Provides tools like:
  - `memory.search` for semantic + FTS search over `workshop.db`

Orchestrators and specialists call this MCP to:
- Recall prior decisions (“We banned Tailwind here.”)
- Surface relevant context for the current request.

Details: see `quick-reference/memory.md` in this repo for the full memory stack and CLI workflow.

---

## 6. Orchestrators: `/response-aware` and ORCA

### 6.1 `/response-aware` — Response Awareness Workflow

`/response-aware` is the primary orchestrator. It runs a 6‑phase protocol with meta‑tags and evidence:

Modes:
- Full: `/response-aware <feature>`
- Plan only: `/response-aware -plan <feature>`
- Build only: `/response-aware -build <blueprint.md>`

Phases:
1. **Phase 0 — Survey**  
   Map domains, integration points, interfaces.
2. **Phase 1 — Parallel Planning**  
   Multiple planners propose paths; record `#PATH_DECISION` and risks.
3. **Phase 2 — Synthesis**  
   Pick a path; produce a single implementation blueprint; ask user to approve.
4. **Phase 3 — Implementation**  
   Implement strictly from the blueprint; tag assumptions and file operations.
5. **Phase 4 — Verification**  
   Resolve every tag via tests/build/screenshots/logs; no unresolved claims.
6. **Phase 5 — Final Synthesis**  
   Summarize work, decisions, and attach evidence.

The core idea: **no more “done” without proof.**

### 6.2 ORCA — Smart Multi‑Agent Orchestration

ORCA is the higher‑level multi‑agent orchestrator focused on:

- **Tech stack detection**
  - Inspect project files to infer stack (Next.js, iOS, etc.).
- **Team proposal + user confirmation**
  - Proposes a specialist team (planners, implementors, verifiers).
  - Always uses `AskUserQuestion` for interactive confirmation.
- **Parallel agent execution**
  - Domain‑specific agents work in parallel under strict file limits.
- **Chaos prevention**
  - Max files per agent/session.
  - Required meta‑tags.
  - Standardized directories for evidence, logs, and temp files.

ORCA and `/response-aware` can be combined: ORCA for stack‑aware team building, `/response-aware` for plan/implement/verify discipline.

---

## 7. Custom Agents with Scopes & Guardrails

One of the biggest lessons: **generic agents drift; narrow agents behave.**

### 7.1 What went wrong

- Broad “design” agents plugged into ORCA tried to:
  - Invent entire design systems.
  - Overstep into implementation without clear specs.
  - Produce visually and structurally janky UI.

### 7.2 The pattern that works

Specialist agents now follow a consistent pattern:

1. **Narrow role**
   - `/creative-strategist` → strategy and performance analysis only.
   - `/design-director` → layout, hierarchy, critique.
   - `/obdn-designer` → OBDN luxury UI architect (no orchestration).
   - `/fox-designer` → PeptideFox scientific UI architect.

2. **Mandatory context recall**
   - Read `CLAUDE.md` and project design DNA:
     - OBDN: `design-dna-v2.0.md`, `system_rules-v2.0.md`, `design-system-v2.0.md`.
     - PeptideFox: `design-system-v7.0.0.md`, `DESIGN_RULES.md`.
   - Summarize brand voice, typography, color, layout rules, constraints.

3. **Thinking scaffold**
   - `/design-director`, `/obdn-designer`:  
     `FRAME → STRUCTURE → SURFACE → CODE`
   - `/fox-designer`:  
     `FRAME → STRUCTURE → SURFACE → CALCULATE → CODE GUIDANCE`

4. **Hard rules**
   - Type scales, color usage, spacing tokens.
   - Card/bento architectures.
   - “Calculate, don’t guess” for spacing and width.
   - Blueprint‑first, code‑second; code only if explicitly requested.

5. **Structured output**
   - Fixed blueprint templates:
     - CONTEXT RECALL
     - MODE
     - FRAME / STRUCTURE / SURFACE / CALCULATIONS / COMPONENTS
     - RECOMMENDATIONS
     - RISKS / WARNINGS

Result: agents stay in their lane and produce consistent, brand‑true outputs that implementation agents can consume reliably.

---

## 8. Parallel Orchestration & Chaos Prevention

Parallelism is powerful but dangerous; this OS uses it carefully.

### 8.1 Parallel reasoning, serialized decisions

- ORCA and `/response-aware` can dispatch multiple planners or specialists in parallel.
- The orchestrator:
  - Gathers outputs.
  - Synthesizes them into a single blueprint.
  - Owns the decision; implementors **do not** mutate the plan.

### 8.2 Chaos prevention rules

To avoid runaway file/plan creation:

- **File limits**
  - Max files per agent per task.
  - Max files per ORCA session.

- **Meta‑tags required**
  - `#FILE_CREATED`, `#FILE_MODIFIED`, `#FILE_DELETED`
  - `#COMPLETION_DRIVE`, `#SCREENSHOT_CLAIMED`, etc.

- **Standard paths**
  - Evidence: `.orchestration/evidence/`
  - Logs: `.orchestration/logs/`
  - Temp: `/tmp/orca-[sessionid]/`

- **Banned planning docs**
  - No `PLAN.md`, `TODO.md`, `*-plan.md`, etc.
  - Work directly in code + blueprints; no explosion of meta‑documents.

This keeps multi‑agent work observable and bounded.

---

## 9. MCP Tools & IO Safety

Agents only interact with your system via declared tools.  
Commands specify `allowed-tools`, which acts as a hard permission boundary.

### 9.1 Core MCPs in this setup

- **vibe-memory** (local)
  - Path: `~/.claude/mcp/vibe-memory`
  - Exposes project memory (`.claude/memory/workshop.db`) via `memory.search`.
  - Used by orchestrators and specialists to recall decisions and context.

- **playwright**
  - Drives real browsers for end‑to‑end flows.
  - Captures screenshots and videos for evidence.

- **chromedevtools**
  - Inspects live pages (DOM, network, console).
  - Useful for UI debugging and layout verification.

- **iossimulator**
  - Controls iOS Simulator to run native flows.
  - Used for visual and functional evidence on iOS.

- **context7**
  - Provides rich repository/codebase context and search.
  - Lets agents reason about large projects without manual grepping.

Some of these MCPs are configured as external services (via Claude settings), others (like `vibe-memory`) are installed locally. All of them are treated as **structured tools**, not magical abilities.

### 9.2 File + shell tools

Commands use tool‑based IO:

- `Read`, `Write`, `Edit`, `MultiEdit` — code and file operations.
- `Grep`, `Glob` — search within the repo.
- `Bash` — controlled shell commands.

Combined with MCPs and meta‑tags, this makes agent behavior observable and auditable.

---

## 10. Design Principles: AI Deviance & Token Efficiency

This OS exists to fix two things:

1. **AI deviance**
   - Models drifting away from the request.
   - Saying “done” when reality disagrees.

2. **Token bloat**
   - Massive, unfocused chats.
   - Repeating the same context and decisions in every session.

Design principles baked into this setup:

- **Blueprint‑first, code‑second**
  - For UI and complex systems, always design the blueprint (structure, spacing, tokens) before implementing code.

- **Evidence‑based “done”**
  - Work is complete only when tags are resolved and evidence is captured: tests, builds, screenshots, logs.

- **Narrow agents with hard scopes**
  - Each agent has a single job, strict inputs, and explicit non‑responsibilities.

- **Memory as ground truth**
  - Decisions live in Workshop (via `vibe-memory` MCP), not ephemeral chat.
  - Brand/design DNA lives in design system docs.

- **MCP tools + logs over magic**
  - All I/O goes through tools and is logged.
  - Behavior is inspectable and debuggable.

- **Parallel planning, centralized decisions**
  - Many agents can explore, but one orchestrator decides and enforces.

In practice this is also more **token‑efficient**:
- Less repetition of context and decisions.
- Fewer iterations caused by drift and janky proposals.
- Smaller, reusable specialist prompts instead of one giant general persona.

---

## 11. What Lives Where (File/Folder Map)

### 11.1 Global OS (`~/.claude`)

Live config used by Claude Code:

- `~/.claude/commands/*.md`
  - Live command definitions:
    - `creative-strategist.md`
    - `design-director.md`
    - `fox-designer.md`
    - `obdn-designer.md`
    - `response-aware.md`
    - `orca.md`
    - and others.

- `~/.claude/agents/`
  - Custom agents, if any, used by ORCA and orchestrators.

- `~/.claude/mcp/`
  - MCP servers:
    - `vibe-memory/` (local project memory MCP)
    - Other MCPs are typically configured externally (playwright, chromedevtools, iossimulator, context7).

- `~/.claude/hooks/`
  - Shell hooks (e.g. session start) that wire in memory, project detection, etc.

- `~/.claude/CLAUDE.md`
  - Global brain/config document (design OCD, verification rules, etc.).

### 11.2 This repo (`claude-vibe-config`)

This repo mirrors `~/.claude` for version control:

- `commands/`
  - Snapshots of your live custom commands (`fox-designer.md`, `obdn-designer.md`, `response-aware.md`, etc.).

- `agents/`
  - Snapshots of custom agents.

- `docs/`, `quick-reference/`
  - Methodology and deep dives:
    - `quick-reference/memory.md` → full memory + vibe‑memory + Workshop workflow.
    - `quick-reference/agents-teams.md`, `quick-reference/triggers-tools.md`, etc.

- `scripts/`, `hooks/`
  - Helper scripts used by commands and hooks (capture tests, builds, screenshots, verification, etc.).

Remember: you change the live config in `~/.claude`, then sync back into this repo.

### 11.3 Per‑project configs

Each project has its own DNA and memory:

- **PeptideFox**
  - Design DNA:
    - `Desktop/peptidefox/design-dna/design-system-v7.0.0.md`
    - `Desktop/peptidefox/design-dna/DESIGN_RULES.md`
  - Project prompt:
    - `Desktop/peptidefox/design-dna/peptidefox_designer_prompt.md`
  - Memory:
    - `project/.claude/memory/workshop.db` (once initialized via Workshop).

- **OBDN**
  - Design DNA:
    - `Desktop/OBDN/obdn_site/design-system/design-dna-v2.0.md`
    - `Desktop/OBDN/obdn_site/design-system/system_rules-v2.0.md`
    - `Desktop/OBDN/obdn_site/design-system/design-system-v2.0.md`
  - Project prompt:
    - `Desktop/OBDN/obdn_site/design-system/obdn_designer_prompt.md`

Other projects follow the same pattern:
- Project design DNA + brand docs under `design-*` or `docs/`.
- Project memory under `.claude/memory/workshop.db`.

---

This README is the high‑level map.  
For operational details (exact tags, scripts, or team patterns), see the files under `quick-reference/` and the individual command files in `commands/`.***
