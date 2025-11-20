# Vibe Code OS 2.0 (Claude Edition)

> A project-local “brain” and operating system for Claude Code – designed to make context and quality structurally mandatory, not optional.

If you’ve used agentic coding tools for anything non-trivial, you’ve probably seen the same failure mode:

- You ask the tool to “just extend yesterday’s feature”.
- It forgets what exists, ignores past decisions, and **rewrites half your stack**.
- Each session starts from zero – no project memory, no standards, no structural constraints.

In other words, most setups give you powerful but **amnesiac** agents:

- No persistent project brain (context amnesia).
- No record of “what happened / cost / rule” to prevent repeat mistakes.
- No enforced gates; quality checks are suggestions, not structure.

Vibe Code OS 2.0 is an answer to that problem: a seven-layer system that gives each project its own brain, standards, and orchestrated workflows so Claude:

- Always knows what already exists in the codebase.
- Respects past decisions and project-specific rules.
- Passes through hard gates before declaring anything “done”.
- Learns over time from validated fixes instead of repeating the same bugs.

This repo contains my personal Claude Code configuration plus the emerging **Vibe Code OS 2.0**. The focus here is **Claude-only** (Claude Code + MCP + Skills + custom agents). A future pass will generalize the core ideas to other CLIs like Codex.

---

## 1. High-Level Overview

At a glance, OS 2.0 turns each project into a small operating system around Claude:

```text
           +-------------------------------+
           |          Claude Code          |
           |   (main assistant + tools)    |
           +---------------+---------------+
                           |
                           v
                +---------------------+
                |  Orchestrator       |
                |     (/orca)         |
                +---------------------+
                           |
                           v
         +---------------------------------------+
         |          ProjectContextServer        |
         |  (per-project context & memory)      |
         +---------------------------------------+
             |          |                |
             v          v                v
     state.json   context-snapshot   vibe.db + standards
      (structure)     (hot zones)    (events, chunks, rules)
```

Every serious task flows through the same pattern:

1. **Project context is loaded first** (no work without it).
2. **Domain pipeline** (webdev, iOS, data, SEO, brand) runs with full awareness of what already exists.
3. **Quality gates** enforce standards and verification before work is “done”.
4. **Memory is updated** so the next session starts smarter, not fresh.

---

## 2. The Seven-Layer Architecture

### 2.1 Layer 1 – ProjectContextServer (Per‑Project Brain)

Each repository gets a **mandatory brain** under a project-local directory (e.g. `.claude/project/`):

```text
.claude/project/
  context-server/      # ProjectContextServer implementation
  state.json           # Files, components, dependencies, entrypoints
  context-snapshot.json# Hot zones, recent edits, relationships
  design-decisions.md  # “Why” log for architecture/UX/brand choices
  vibe.db              # SQLite: events, standards, chunks, tags
```

The brain is exposed to Claude via an MCP-style interface:

```text
ProjectContextServer.query(domain, task) -> ContextBundle

ContextBundle {
  relevantFiles   # from semantic search + indices
  projectState    # current structure & components
  pastDecisions   # design-decisions + events
  relatedStandards# rules likely relevant here
  similarTasks    # previous attempts in this area
}
```

**Hard rule:** no agent, command, or workflow touches the filesystem directly for serious work – it goes through `ProjectContextServer` so context/memory are guaranteed.

### 2.2 Layer 2 – Orchestration (/orca)

`/orca` is the primary orchestrator. It:

- **Never writes code.**
- Reads:
  - `phase_state.json` (current phase & blocking conditions)
  - Domain configs (`docs/domains/<lane>/config.yaml`)
  - Complexity/task metadata
- Manages:
  - Which **domain pipeline** to invoke.
  - Which **gates** must be satisfied.
  - How many agents / which coordination mode to use (centralized vs hierarchical, etc.).

The orchestrator is a **traffic cop**, not a coder.

### 2.3 Layer 3 – Domain Pipelines (“Lanes”)

Each major workflow is its own “lane” with phases and gates, but all lanes share the same ProjectContextServer.

#### Example: Webdev Lane

```text
User → /frontend-iterate
        |
        v
  [ProjectContextServer]  <-- loads state, history, patterns
        |
        v
  requirements → customization → implementation → verification → complete
                           ^                      ^
                           |                      |
                  customization gate       standards + visual QA gates
```

- **requirements** – understand task; fetch similar past features.
- **customization** – load all existing primitives and enforce “no generic UI”.
- **implementation** – build with full awareness of current components.
- **verification** – run visual QA + standards + claim verification.

Similar lanes exist for:

- **iOS** – Swift/SwiftUI workflows with UX, performance, and accessibility gates.
- **Data** – clarify → explore → model → validate → narrate, with leakage & metric sanity gates.
- **SEO** – research → brief → outline → draft → quality (already working well).
- **Brand/Creative** – brief → concept → copy → impact-estimate, constrained by brand and analytics docs.

### 2.4 Layer 4 – Documentation as Operating System

Behavior is driven by **docs and configs**, not just prompts:

```text
docs/
  os/
    vibe-code-os-v2-spec.md     # Architecture spec
    OS-2.0-*-state.md           # Current deployment snapshots
    OS v2.0 Codex - *.md        # Research & synthesis logs

  domains/
    webdev/
      pipeline.md               # Phases and gates
      standards.md              # Frontend rules / constraints
      agents.md                 # Webdev-specific agents
      config.yaml               # Orchestration config for /frontend-iterate
    ios/
    data/
    seo/
    brand/

  brands/
    <brand-name>/
      brief.md                  # Voice, positioning, creative constraints
      analytics.md              # Metrics & evaluation patterns
      standards.md              # On/off-brand examples and rules

requirements/
  YYYY-MM-DD-HHMM-name/
    00-initial-request.md
    01-clarifications.md
    ...
    06-requirements-spec.md     # Canonical spec for heavy work
```

To change behavior, you edit docs/configs, not a buried system prompt.

### 2.5 Layer 5 – Constraint Framework

Every Claude agent or Skill in this OS is constrained structurally:

```yaml
# Example: domain agent frontmatter (simplified)
required_context:
  - ProjectContextServer.query()  # Mandatory per-task bundle
  - design-dna.json               # Design system / tokens
  - .standards-local/             # Project-specific rules

forbidden_operations:
  - inline_styles                 # Structurally impossible
  - arbitrary_values              # Layout/math via tokens only
  - raw_filesystem_access         # Must go through context server

verification_required:
  - screenshot_before_after
  - design_compliance_check
  - standards_audit
  - claim_verification
```

Constraints shrink the possibility space so low-quality outcomes simply aren’t reachable.

### 2.6 Layer 6 – Learning (Within Safe Boundaries)

Learning is **bounded and auditable**:

- `vibe.db` tables (conceptual):
  - `events` – what happened (gates, RA tags, errors, successes).
  - `standards` – What Happened → Cost → Rule, derived from recurring issues.
  - `chunks` – semantic index of this project’s code/docs.
- Learning pipeline:

```text
Execute → Log events → Extract patterns → Propose standards → Human review → Enforce
```

The system doesn’t learn from arbitrary failures; it learns from **validated corrections and enforced standards**.

### 2.7 Layer 7 – Performance (Opt-in Power-Ups)

For large or demanding projects, OS 2.0 can optionally plug in:

- **Claude Context MCP / similar** – semantic code search at scale.
- **AgentDB-style vector search** – faster, smarter context retrieval when needed.
- **Claude-Flow-inspired coordination modes** – centralized / hierarchical / mesh / hybrid orchestration for multi-agent workflows.

These enhance the context layer; they don’t replace it.

---

## 3. Example Flows

### 3.1 Web Application Feature

```text
You:   /frontend-iterate "Add multi-step signup flow"

1) ProjectContextServer:
   - Finds existing auth components and routes
   - Loads state.json and context-snapshot.json
   - Pulls past auth-related decisions + standards from vibe.db

2) Orchestrator (/orca):
   - Selects webdev lane
   - Loads docs/domains/webdev/pipeline.md + config.yaml
   - Enters requirements → customization → implementation → verification

3) Frontend agents:
   - Reuse and extend existing primitives (no 4th Button component)
   - Respect design tokens and spacing rules
   - Emit RA tags and structured claims

4) Gates:
   - Customization gate enforces a non-generic UI
   - Standards gate enforces layout and design rules
   - Visual QA reviews screenshots and CSS

5) Memory:
   - Update project state and snapshot
   - Log events and new standards into vibe.db
```

### 3.2 iOS Feature

```text
You:   /ios "Add offline caching to article list"

Context:
  - ProjectContextServer returns existing networking stack,
    cache abstractions, and previous performance decisions.

Pipeline:
  - clarify → plan → implement → test → verify

Gates:
  - Architecture consistency (reuse existing layers)
  - UX: loading / offline states handled gracefully
  - Performance: basic benchmarks stay within bounds
  - Accessibility: labels & navigation remain correct
```

### 3.3 Data + Brand Campaign

```text
You:   /brand-campaign "Concept + copy for product launch"

Context:
  - Brand brief + analytics docs
  - Past campaigns and their performance from vibe.db

Phases:
  - brief → concept → copy → impact-estimate

Gates:
  - Brand standards (voice, messaging, constraints)
  - Analytics sanity (no magical unrealistic metrics)
  - Claim verification against known data where possible

Outcome:
  - Creative work that’s visually and tonally consistent
  - Data-informed expectations and tradeoffs documented
```

---

## 4. Influences & Credits

This OS builds on a lot of excellent public work. Concepts, patterns, and specific mechanisms are adapted (with tweaks) from:

- **Pantheon Framework / Glass Box Process**  
  - Transparent, auditable workflows; process as the primary artifact.
- **Agentwise**  
  - Multi-agent orchestration, project wizards, smart model routing, MCP-centric integrations.
- **Claude-Flow (swarm benchmarking)**  
  - Coordination modes, concurrent execution patterns, and performance analysis.
- **Response Awareness Framework (Michael Jovanovich)**  
  - Response-awareness tags, metacognitive orchestration, and tiered instruction sets.
- **Equilateral Agents**  
  - Standards as “What happened / Cost / Rule” and multi-tier standards layout.
- **Claude Context MCP (Zilliz)**  
  - Semantic code search as a first-class part of project context.
- **Anthropic’s Claude Code Best Practices & Agent Engineering Guides**  
  - CLAUDE.md patterns, agent design, and best practices around planning and hooks.

The goal of Vibe Code OS 2.0 is not to replace these systems, but to **compose and adapt** their ideas into a cohesive, project-local operating system that fits day-to-day coding work.

---

## 5. Status & Next Steps

This README describes the **target architecture** for the Claude-only system in this repo:

- Some pieces already exist (custom agents, commands, SEO and frontend flows).
- Others are in active development:
  - ProjectContextServer implementation.
  - Per-lane configs and docs.
  - vibe.db schema and events/standards loop.

As OS 2.0 solidifies, this document will track:

- Which layers are implemented.
- How to enable them in your own projects.
- Concrete examples and templates you can copy.

For now, treat this as both **design doc** and **public-facing explanation** of where the system is headed. If you’re exploring similar ideas, feel free to borrow structures and adapt them to your own tooling. 
