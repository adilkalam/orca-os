```
 __   __  _  _            ___   ___     ___    ____
 \ \ / / (_)| |__   ___  / _ \ / __|   |_  )  |__ /
  \ V /  | || '_ \ / -_)| (_) |\__ \    / /    |_ \
   \_/   |_||_.__/ \___| \___/ |___/   /___|  |___/

```

# A Context-Aware, Memory-Persistent OS for Claude Code

```
+------------------------------------------------------------------+
|                                                                  |
|   Make Claude Code remember, stay disciplined, and finish work   |
|                                                                  |
|   - Memory-first architecture (local vectors + Workshop)         |
|   - Response awareness (track assumptions, not just outputs)     |
|   - Evidence-based completion (tests pass or it is not done)     |
|   - Programmatic gate enforcement (hooks tied to artifacts)      |
|   - Multi-lane orchestration (9 domains, 85 agents)              |
|   - Complexity routing (simple tweaks to complex features)       |
|   - Self-improvement (agents learn from execution history)       |
|                                                                  |
+------------------------------------------------------------------+
```

---

## The Problem This Solves

**Claude Code is powerful. But has the memory of a goldfish and declares success prematurely.**

Without guardrails:

- "Done" when the code does not compile, UX is broken, or tests fail
- User defined concepts and systems hallucinated instead of followed
- Context re-gathered every single session & no memory 
- Zero improvement or tuning to user needs over time

The result: endless iteration loops, human frustration, and outputs that fall short of expectations.

**This system enforces discipline:**

- Projects indexed locally with persistent vectors for fast semantic queries
- An orchestration layer that coordinates specialists but never writes code itself
- Agents operating in strict lanes with hard-scoped responsibilities
- Memory persisting across sessions (no re-explaining decisions)
- Quality gates catching issues before humans see them
- Work not marked complete until evidence exists (tests, builds, screenshots)
  and gate decisions are backed by concrete artifacts or commands (e.g.
  design review reports and verification command logs for the Next.js lane)

---

## 1. The Default State – Why It Struggles

Most “agentic” setups look like this:

```text
          Single agent does everything
                     |
                     v
+---------+        +-------------+
|  You    | -----> |  LLM Agent  |  (1) No persistent memory
+---------+        +-------------+
                        |
                        |         
                        v
                +----------------+
                |  Project Files |  (2) Ad-hoc context loading
                +----------------+
                        |
                        |         
                        v
                 +---------------+  (3) Single agent context drift
                 | Execution     |   
                 +---------------+
```

Where it fails:

1. **No persistent memory**
   - Every session starts fresh.
   - Architectural decisions get re‑litigated.

2. **Context must be reloaded every session**
   - The agent “discovers” the project anew every time by reading
     arbitrary files.

3. **Single Agent**
   - The same agent plans, implements, verifies, and self‑audits in one
     long stream.
   - Any interruption (“quick question?”) derails the plan.
   - Novice questions, architecture design, implementation, and
     production fixes all share the same prompt.

4. **No response awareness**
   - Assumptions, bias, and uncertainty are not surfaced or fed into
     gates.

Vibe OS 2.4.1 answers: "What if context, memory, and orchestration were
part of the architecture, not just the prompt?"

---

## 2. High‑Level Architecture

At a high level, Vibe OS 2.4.1 is defined first by its environment:
memory and context on your machine. Everything else – planning,
orchestration, agents, and workflows – is layered on top of that
baseline.

```text
+------------------------------------------------------------------+
|               Memory and Context Environment                     |
|  - ProjectContextServer MCP → ContextBundle (single query)       |
|  - Workshop: decisions, standards, incidents                     |
|  - vibe.db: code index, history, optional local embeddings       |
|  - Context7 / external docs: framework and library knowledge     |
|  - All local → faster, cheaper, more consistent context          |
+------------------------------+-----------------------------------+
                               |
                               v
+------------------------------------------------------------------+
|          Orchestration and Response-Aware Planning               |
|  - Uses ContextBundle + your goal to produce a plan artifact     |
|  - Chooses lanes, depth (light vs full vs audit), parallelism    |
|  - Drives pipelines but does not edit code directly              |
+------------------------------+-----------------------------------+
                               |
                               v
+------------------------------------------------------------------+
|                 Agents, Specialists, and Gates                   |
|  - Architects, builders, reviewers                               |
|  - Domain specialists (iOS, Next.js, Expo, Shopify, OS-Dev, ...) |
|  - Standards, design, and verification gates                     |
+------------------------------+-----------------------------------+
                               |
                               v
+------------------------------------------------------------------+
|                 Workflows and Interactions                       |
|  - Spec-driven features, deep audits, root-cause analysis        |
|  - Interactive questions and clarifications                      |
+------------------------------+-----------------------------------+
```

The rest of this document walks those layers in that order, starting
from the environment.

---

## 3. Memory and Context Layer

The memory and context layer is the baseline. Everything else sits on
top of it.

### 3.1 Components

- **Workshop** (`/project-memory`)
  - Human‑readable project memory:
    - Decisions (“We use SwiftData for new iOS persistence”).
    - Gotchas (“Shopify theme CSS must never use inline styles”).
    - Standards, notes, antipatterns.
  - Stored in `.claude/memory/workshop.db`.

- **vibe.db** (`/project-code`)
  - Code intelligence:
    - Chunked code (functions, classes, components).
    - Symbols for fast lookup.
    - Events and task history.
    - Optional embeddings for semantic search (via local models).
  - Stored in `.claude/memory/vibe.db`.

- **ProjectContextServer MCP**
  - Gateway that produces a `ContextBundle` for any task:
    - `relevantFiles`
    - `projectState`
    - `pastDecisions`
    - `relatedStandards`
    - `similarTasks`
    - `designSystem` (for frontend lanes)
  - Every orchestrator calls this once per task.

### 3.2 Memory Architecture Diagram

```text
          +------------------------------------------------------+
          |            ProjectContextServer (MCP)                |
          |  query_context / save_* / task_history tools        |
          +------------------+----------------+------------------+
                             |                |
              +--------------+--------------+ |
              |                             | |
              v                             v v
   +---------------------------+   +---------------------------+
   |  Workshop (session memory)|   |  vibe.db (code memory)    |
   |  .claude/memory/          |   |  .claude/memory/vibe.db   |
   |                           |   |                           |
   |  - decisions / standards  |   |  - code_chunks / symbols  |
   |  - notes / incidents      |   |  - task_history / events  |
   +---------------------------+   +---------------------------+
                                        |
                                        v
                              +-----------------------------+
                              |  Optional embeddings layer  |
                              |  (local semantic search)    |
                              +-----------------------------+
                                        |
                                        v
                              +-----------------------------+
                              |  Context7 / external docs   |
                              |  (framework & library info) |
                              +-----------------------------+
```

Key properties:

- **Context is mandatory** – No lane runs without calling
  `query_context` first.
- **Local first** – Workshop and `vibe.db` reduce how much code the
  model needs to read, and how often.
- **Embeddings are optional** – If present, they improve relevance;
  they do not change the architecture.

You interact directly with this layer via:

- `/project-memory` – managing Workshop and overall memory health.
- `/project-code` – indexing and searching code (and embeddings).

---

## 4. Planning and Response Awareness Layer

The planning layer is the bridge between raw context and orchestration.
It turns a `ContextBundle` and your goal into a stable, response‑aware
plan that everything else follows.

### 4.1 Response‑aware planning

```text
           +----------------------------------------+
           |    Memory and Context Environment     |
           |  (ContextBundle from ProjectContext)  |
           +-------------------------+--------------+
                                     |
                                     v
                       +-----------------------------+
                       |   Response-aware Planner    |
                       |   - interprets your goal    |
                       |   - uses ContextBundle      |
                       |   - surfaces risks & gaps   |
                       +-----------------------------+
                                     |
                                     v
                       +-----------------------------+
                       |        Plan Artifact        |
                       |   - phases and targets      |
                       |   - lane choices            |
                       |   - RA tags (assumptions,   |
                       |     risks, completion drive)|
                       +-----------------------------+
                                     |
                      +--------------+--------------+
                      |                             |
                      v                             v
            +---------------------+       +----------------------+
            | Lane orchestrators  |       | Verification & gates |
            | (/orca-*)           |       | (read RA + context)  |
            +---------------------+       +----------------------+
```

Because the plan is an explicit artifact (not just “thoughts in a
single reply”), orchestrators, builders, and gates all share the same
decisions and rationales without recomputing them or reloading the
entire project each time.

---

## 5. Orchestration and Pipelines Layer

On top of memory, context, and planning sits the orchestration layer. It
runs lane‑specific pipelines described by phase configs.

### 5.1 Lane‑specific orchestration

```text
                      +------------------------------+
                      |      Plan Artifact (RA)      |
                      +---------------+--------------+
                                      |
                          Lane selection, mode, depth
                                      |
                                      v
               +---------------------------------------------+
               |        Lane orchestrator (/orca-<lane>)     |
               +-----------+-----------+---------------------+
                           |           |
                           |           |
                  Light path           Full / audit pipeline
                (small, localized)     (multi-phase, gated)
                           |           |
                           v           v
                 +---------------+   +------------------------+
                 | Single builder|   | Parallel agent squads  |
                 | + quick checks|   |  architects, builders, |
                 +-------+-------+   |  specialists, gates    |
                         |           +-----------+------------+
                         |                       |
                         v                       v
              +-------------------+   +------------------------+
              | Minimal checks    |   | Verification & gates   |
              | (lint/tests)      |   | (standards, design,    |
              +-------------------+   |  tests, audits)        |
                                      +-----------+------------+
                                                  |
                                                  v
                                      +------------------------+
                                      | Learning and memory    |
                                      | save_* → Workshop,     |
                                      | vibe.db, task history  |
                                      +------------------------+
```

Each lane (iOS, Next.js, Expo, Shopify, OS‑Dev, data, SEO, …) has its
own phase config and set of agents, but they all follow this pattern:

- Start from a shared, response‑aware plan.
- Choose an appropriate mode (light change, full pipeline, deep audit).
- Delegate in parallel to builders, specialists, and gates.
- Feed results and standards back into memory for the next task.

---

## 6. Agents and Skills Layer

Below orchestration are the agents and skills. They are the workers of
the system.

### 6.1 Agent Roles

Across lanes, agent roles follow a common pattern:

```text
Grand Architect
    |
    v
Architect  -->  Builder  -->  Gates (standards, design, verification)
                    ^
                    |
              Specialists
```

- **Grand Architect (per lane)**
  - Holds the high‑level plan.
  - Coordinates phases and delegates to sub‑agents.
  - Never writes code.

- **Architect**
  - Performs requirements & impact analysis.
  - Chooses architecture and data strategies.
  - Writes a plan with RA tags (`#PATH_DECISION`, `#PATH_RATIONALE`).

- **Builder**
  - Implements according to the plan.
  - Produces code changes and RA events (`ra_events`).

- **Gates**
  - Standards enforcers check code against rules.
  - Design QA agents check design DNA and visual quality.
  - Verification agents run tests/builds.

- **Specialists**
  - Domain‑specific helpers (e.g. SwiftUI, Tailwind, Liquid, MCP
    config).
  - Called by builders or architects for narrow tasks.

### 6.2 Skills

Skills are structured knowledge packs:

- `nextjs-knowledge-skill` – Next.js architecture patterns.
- `ios-knowledge-skill` – iOS architecture and data patterns.
- `design-dna-skill` – design tokens and design system rules.
- `os-dev-knowledge-skill` – OS/Claude config patterns and safety.

Agents load skills as needed, not by default. This keeps prompts lean
while still enabling deep domain expertise when required.

### 6.3 Self-Improvement Loop (v2.4.1)

Agents now learn from execution history:

```text
Execute Pipeline
    |
    v
Grand-Architect Records Outcome
    |
    | workshop task_history add --domain <domain> --outcome <success|failure|partial>
    v
Workshop task_history Entry
    |
    v
/audit Triggers Pattern Analysis
    |
    | scripts/analyze-patterns.py
    v
Identify Patterns (3+ occurrences)
    |
    v
Generate Improvement Proposal
    |
    v
User Approves/Rejects
    |
    | scripts/apply-improvement.py --deploy
    v
Apply to Agent Definition ("Learned Rules" section)
```

Key properties:

- **Outcome recording** – Grand-architects record task results at pipeline end.
- **Pattern detection** – Same issue from same agent 3+ times triggers proposal.
- **User approval required** – Agents are never auto-modified.
- **Learned Rules** – Applied improvements appear in agent YAML.

---

## 7. Example Workflows

With the layers in place, we can now look at how they compose in
practice.

### 7.1 Spec‑Driven iOS Feature

Goal: add workspace sharing to the iOS app.

```text
You
  |
  | 1) /plan "Workspace sharing in iOS app"
  v
/plan
  |
  |  Creates .claude/requirements/<id>/06-requirements-spec.md
  v
  | 2) /orca "implement requirement <id>"
  v
/orca
  |
  |  Memory-first lookup (Workshop + vibe.db)
  |  ProjectContext query (domain: ios)
  |  Domain detection
  v
/orca-ios
  |
  |  Complexity classification (likely complex)
  |  Spec gating (requires spec)
  |  Team confirmation (AskUserQuestion)
  v
ios-grand-architect
  |
  |  Reads spec + ContextBundle
  |  Chooses architecture (SwiftUI vs existing patterns)
  |  Chooses data strategy (SwiftData/Core Data/GRDB)
  v
ios-architect  -->  ios-builder  -->  ios-standards-enforcer → ios-ui-reviewer → ios-verification
                       |
                       v
                   RA events
```

Outputs:

- Implementation with RA tags.
- Standards + UI gate scores.
- Verification results.
- Task history saved via ProjectContext and persisted to `vibe.db`.

### 7.2 Deep Next.js Audit (`--audit`)

Goal: audit the frontend architecture and design tokens without changing
code.

```text
/orca-nextjs --audit "audit frontend architecture, design tokens, a11y"
  |
  | Clarify focus (AskUserQuestion)
  | Memory-first search (Workshop + vibe.db)
  | ProjectContext diagnostic query (domain: nextjs)
  v
  Assemble audit squad via Task:
    - nextjs-standards-enforcer
    - nextjs-design-reviewer
    - nextjs-performance-specialist
    - nextjs-accessibility-specialist
    - nextjs-seo-specialist
  |
  | Agents run in audit mode:
  |   - Use Read/Grep/Glob + ContextBundle
  |   - No edits, only analysis
  v
Synthesize Next.js Audit Report
  |
  | Optional: save_task_history(domain: nextjs, task: "audit: frontend")
  v
Return report and suggested follow-up tasks
```

### 7.3 OS‑Dev Change (Configuring the OS Safely)

Goal: adjust OS 2.3 behavior (e.g., new lane, MCP config, or safety
defaults).

```text
/plan "Add backend lane for Go services"
  |
  v
/orca-os-dev "implement requirement <id>"
  |
  |  Complexity classification (likely complex)
  |  Memory-first context (Workshop + vibe.db)
  |  ProjectContext diagnostic query (domain: os-dev)
  v
os-dev-grand-architect
  |
  |  Ensures spec present
  |  Delegates to os-dev-architect for plan and constraints
  v
os-dev-architect
  |
  |  Plan:
  |    - which commands/agents/phase configs to touch
  |    - safety envelope
  |    - rollback strategy
  v
os-dev-builder  -->  os-dev-standards-enforcer  -->  os-dev-verification
                      |
                      v
                os-dev-standards.md
```

This ensures OS/Claude config changes go through the same kind of
spec‑gated, RA‑aware pipeline as application code, with dedicated
standards and verification.

---

## 8. Design Decisions and Novelty

Some of the key choices behind Vibe OS 2.4.1:

1. **Context and memory as first‑class architecture**
   - ProjectContextServer MCP, Workshop, and `vibe.db` form a shared
     memory layer that all lanes must use.
   - Context is not a suggestion; it is a structural requirement.

2. **Local‑first efficiency**
   - Code indexing and (optional) embeddings are done on your machine.
   - ProjectContext uses local search and `vibe.db` to pre‑chew context
     before the model sees anything.

3. **Pure orchestrators**
   - `/orca`, `/orca-<lane>`, `/orca-os-dev`, `/root-cause`,
     `/audit`:
     - Only coordinate; never edit code.
     - Use Task, AskUserQuestion, and MCP tools.
   - This separates planning and coordination from implementation and
     keeps plans stable across interruptions.

4. **Lane‑specific orchestration commands**
   - Each domain gets its own `/orca-<lane>`:
     - Encodes complexity rules (simple vs medium vs complex).
     - Enforces spec gating.
     - Provides audit and light modes.
   - This avoids one mega‑prompt trying to manage every domain at once.

5. **Deep specialist rosters**
   - Agents are narrow and domain‑specific:
     - SwiftUI vs UIKit specialists.
     - Tailwind vs Liquid vs MCP config specialists.
   - This encourages real delegation rather than expanding one
     generalist prompt.

6. **Integrated response awareness**
   - RA tags are written into phase_state and inspected at gates.
   - `/audit` and OS‑Dev can use RA events and violations to promote
     new standards over time.

7. **First‑class audit and diagnostic workflows**
   - Deep audit modes in each lane (`--audit`).
   - `/root-cause` to assemble lane‑specific diagnostic squads (e.g.,
     iOS testing + SPM config specialists) when things fail.

8. **Self‑improvement loop (v2.4.1)**
   - Grand-architects record execution outcomes at pipeline end.
   - Pattern detection identifies recurring issues (3+ occurrences).
   - Improvement proposals generated in structured format.
   - User approval required before applying changes to agents.
   - Learned rules accumulate in agent definitions over time.

Taken together, these decisions turn Vibe OS 2.4.1 from "a pile of
prompts and agents" into a coherent, layered system:

- Memory and context as the foundation.
- Orchestration and pipelines as the control plane.
- Agents and skills as the workers.
- Audits and root‑cause workflows as the self‑reflection layer.
- Self-improvement loop as the learning layer.
