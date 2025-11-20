# Vibe Code OS v2 – Brainstorm Log

Running log of ideas and patterns for the next version of the vibe-code OS. Treat this as a scratchpad, not a spec; when concepts stabilize, promote them into dedicated architecture docs.

---

## 2025-11-16 – Orchestration & Memory Concepts

- **Three-tier orchestration model (v1 → v2)**  
  - Tier 1: Blueprint director (`engineering-director`) – frames work, produces `.orchestration/engineering-blueprint.md`, never implements.  
  - Tier 2: Workflow orchestrator (`workflow-orchestrator`) – pure Task/TodoWrite coordinator with gated phases (planning → implementation → validation).  
  - Tier 3: Meta/learning layer (`meta-orchestrator`, `orchestration-reflector`, `playbook-curator`) – learns which orchestration depth to use, reflects on sessions, updates playbooks, and prunes bad patterns (apoptosis).

- **Response Awareness & ACE integration**  
  - Keep “main agent only orchestrates” rule from Response Awareness (no implementation in orchestrators).  
  - Use RA tags (`#COMPLETION_DRIVE`, `#POISON_PATH`, etc.) as first-class data in logs/memory.  
  - Treat `orchestration-reflector` + `playbook-curator` as an ACE Generator/Reflector/Curator analogue focused on orchestration patterns.

- **Project memory: `vibe.db` direction**  
  - Single per-project SQLite DB (e.g. `./.claude/memory/vibe.db`) holding:  
    - Code/doc chunks (`chunks` + FTS + optional embeddings).  
    - Events/decisions (`events` table with “what happened, the cost, the rule”-style entries).  
    - Tags linking chunks/events to RA markers and standards.  
  - CLI + MCP surfaces: `memory-index` / `memory-search` over `vibe.db` for both Claude Code and Codex.

- **Standards layer inspired by EquilateralAgents**  
  - Adopt tri-level standards layout: `.standards/` (universal), `.standards-community/`, `.standards-local/`.  
  - Each standard captured as: **What Happened → The Cost → The Rule**.  
  - New gate for v2: `standards-enforcer` that checks code changes against standards before passing validation.

- **Global vs project memory (self-reflect + local)**  
  - Global: Claude Self-Reflect (MCP) for cross-project, long-horizon narrative memory.  
  - Project: `vibe.db` + standards + RA tags for this repo only.  
  - Orchestrators can query both: global “have we ever solved X?” vs local “what did we do in this project?”.

- **Subagents as the runtime shape of this architecture**  
  - Promote a small, stable set of orchestration subagents (project-level):  
    - `engineering-director`, `workflow-orchestrator`, `meta-orchestrator`, `orchestration-reflector`, `playbook-curator`.  
  - Use Claude Code subagent features explicitly:  
    - Tight `description` fields for auto-delegation.  
    - Minimal, role-appropriate tool sets per subagent.  
    - Resumable subagents for long-running blueprinting and meta-learning tasks.

---

## 2025-11-16 – Claude Code Prompt Augmentation Internals (Agiflow Blog)

- **Three injection layers to respect**  
  - System-level: Output styles mutate the system prompt (identity/format) for a session.  
  - Message-level: `CLAUDE.md`, slash commands, and skills inject instructions into user messages.  
  - Conversation-level: Sub-agents create fully separate conversations with their own system prompts.

- **CLAUDE.md behaviour**  
  - Auto-injected into every user message as a `<system-reminder>` block.  
  - Also injected into sub-agent conversations; large files bloat *all* calls (main + subagents).  
  - Design rule: keep `CLAUDE.md` concise; push bulk docs into separate files referenced via `@file` instead of dumping them in.

- **Slash commands vs skills vs MCP**  
  - Slash commands: user-explicit, deterministic prompt injection (best for repeatable workflows, checklists).  
  - Skills: model-decided activation, unstructured I/O, can run arbitrary Bash → good for local prototyping only.  
  - MCP: model-decided, structured JSON I/O + access control → should be the default for production integrations.  
  - Design rule: in vibe-codeOS v2, prefer slash commands for orchestration workflows and MCP for all tool-like integrations; avoid Skills for anything shared or sensitive.

- **Subagents as conversation delegation**  
  - Main assistant uses `Task` tool to spawn subagents by `subagent_type`; each runs in its own conversation with its own system prompt.  
  - Subagents do *not* see main conversation history; all necessary context must be passed in the Task prompt.  
  - `CLAUDE.md` is still auto-injected into subagent messages, so project standards propagate.  
  - Design rule: orchestrator subagents must explicitly pass the right slice of context when delegating; do not assume shared history.

- **Performance + cost implications**  
  - Tool calls (skills, subagents, MCP) are effectively double LLM calls: model decides → tool_use → tool_result → continuation.  
  - Subagents + large `CLAUDE.md` multiply token usage due to duplicated context per conversation.  
  - Design rule: reserve tools/subagents for tasks where isolation or external capabilities justify the extra latency and token cost; keep standards/context lean.

---

## 2025-11-17 – External Multi‑Agent Pattern Survey

Quick notes from surveying external orchestration systems under `_explore/_AGENTS/_repositories/`. These are **pattern references**, not decisions.

### zshama_claude-sub-agent – Spec Workflow System

- **Repo:** `_explore/_AGENTS/_repositories/zshama_claude-sub-agent`  
- **Core idea:** Single, opinionated spec pipeline driven by a slash command (`agent-workflow.md`) that chains “spec‑agents” with explicit quality gates.
- **Pipeline shape:**  
  - `spec-analyst` → `spec-architect` → `spec-developer` → `spec-validator` → (loop) → `spec-tester`.  
  - Orchestration lives in the **command**, not in agents; `spec-orchestrator` is mostly coordination/standards, not a heavy subagent orchestrator.
- **Quality gate pattern:**  
  - `spec-validator` computes a **numeric quality score** with a weighted rubric and labels (`EXCELLENT` / `PASS` / `CONDITIONAL_PASS` / `FAIL`).  
  - Command logic: if score ≥ threshold (e.g. 95) → proceed to next phase; else → loop the chain once more, with a **hard cap on iterations** (e.g. max 3 passes).
- **Artifact discipline:**  
  - Each phase has fixed outputs: `requirements.md`, `architecture.md`, `tasks.md`, validation report, tests, etc.  
  - There are no free‑form “plan docs”; artifacts are named, phase‑specific, and reused by later agents.
- **Takeaways for Vibe:**  
  - Use **validator agents** with explicit scoring + thresholds; let orchestrators only reason about “score vs threshold vs loop count”.  
  - Prefer fixed artifact names per phase over generic planning docs to control file explosion.  
  - Keep orchestration in commands (`/orca`, `/seo-orca`, `/webdev`) and treat subagents as narrow specialists.

### agentwise-main – External Orchestrator & Task Files

- **Repo:** `_explore/_AGENTS/_repositories/agentwise-main`  
- **Core idea:** A Node/TS orchestrator that owns project creation, phase analysis, task distribution, MCP wiring, and monitoring; LLM agents operate inside the filesystem structure it creates.
- **Orchestration model:**  
  - `SpecGenerator` → `PhaseController` (complexity → phases) → `DynamicTaskDistributor` (per‑agent tasks) → `DynamicAgentManager` (only launch agents with work).  
  - Each agent gets `agent-todos/<agent>/phaseN-todo.md` + `phase-status.json` with `current_phase`, `tasks_total`, `tasks_completed`, etc.
- **Behavior control:**  
  - Tasks are rendered as checklists (with optional MCP tool hints), plus explicit validation reminders after each item.  
  - A separate monitor (`EnhancedPhaseManager`, WebSocket dashboard) watches status files and coordinates phase transitions.
- **Takeaways for Vibe:**  
  - Treat **per‑agent, per‑phase checklists** (or TodoWrite entries) as the ground truth for progress, not model narration.  
  - Orca can generate small, explicit task lists and require itself to mark them off before advancing phases.  
  - Dynamic agent selection (only dispatch agents with assigned tasks) keeps teams small and purposeful.

### claude-code-requirements-builder-main – Hard Requirements Mode

- **Repo:** `_explore/_AGENTS/_repositories/claude-code-requirements-builder-main/claude-code-requirements-builder-main`  
- **Core idea:** Strongly opinionated **requirements-only** workflow, enforced by commands; implementation is explicitly out of scope.
- **Phase structure (`requirements-start.md`):**  
  - Phase 1: Create a timestamped folder under `requirements/YYYY-MM-DD-HHMM-slug/`, write `00-initial-request.md` + `metadata.json`.  
  - Phase 2: Ask **exactly 5** high‑level yes/no questions with defaults, write all questions to `01-discovery-questions.md`, then answers to `02-discovery-answers.md`.  
  - Phase 3: Autonomous context/code analysis, results in `03-context-findings.md`.  
  - Phase 4: **Exactly 5** expert yes/no questions, written to `04-detail-questions.md`, answers to `05-detail-answers.md`.  
  - Phase 5: Final spec in `06-requirements-spec.md`.
- **Interaction constraints:**  
  - Only yes/no questions with **smart defaults** and rationale; “idk” uses the default.  
  - ONE question at a time; **write all questions before asking any**, and only write answers after all have been asked.  
  - `/requirements-status`, `/requirements-current`, `/requirements-end`, `/requirements-remind` commands enforce the protocol.
- **Takeaways for Vibe:**  
  - Introduce a **requirements‑only mode** for Orca/commands: no implementation allowed, capped number of questions, yes/no with defaults, structured files.  
  - This is a good template for an Orca “Phase 0: requirements” variant that feeds later phases without letting planning explode.

### equilateral-agents-open-core – Standards & Learning System

- **Repo:** `_explore/_AGENTS/_repositories/equilateral-agents-open-core`  
- **Core idea:** 22 agents + workflows + a full methodology for turning repeated incidents into enforceable standards (“What Happened / The Cost / The Rule”).
- **Key patterns:**  
  - Three‑tier standards: `.standards/` (official), `.standards-community/`, `.standards-local/`.  
  - Workflows (`npm run workflow:security`, `workflow:quality`, etc.) produce findings; humans harvest patterns into standards; agents then **enforce** standards on future work.  
  - `CLAUDE.md` integration: AI is instructed to consult standards before changing code.
- **Takeaways for Vibe:**  
  - Our existing Equilateral‑inspired standards plan aligns well; this repo is the reference implementation.  
  - For v2, validators like `frontend-standards-enforcer` / `seo-quality-guardian` should explicitly load standards and report per‑standard pass/fail, not just free‑form audits.  
  - Orchestration should treat “standards gates passed?” as a first‑class condition before claiming completion.

### claude_code_agent_farm-main – External Agent Farm & File-Level Coordination

- **Repo:** `_explore/_AGENTS/_orchestration_repositories/claude_code_agent_farm-main/claude_code_agent_farm-main`  
- **Core idea:** A Python “agent farm” that launches many Claude Code sessions in parallel (via tmux) and coordinates them using:
  - An external orchestrator (`claude_code_agent_farm.py`) for monitoring, restarts, and context/idle control.
  - A **prompt-defined file protocol** under `/coordination/` (active registry, completed log, locks, planned work).
- **External orchestrator pattern:**  
  - Tracks each agent’s status (cycles, last activity, errors, restarts, heartbeats) via a monitor class.  
  - Uses heartbeats (`.heartbeats/agentNN.heartbeat`) and adaptive idle timeouts to decide when to restart or intervene.  
  - Sends keystrokes and captures output from tmux panes; LLM sessions are “dumb terminals” driven by this host process.
- **/coordination/ protocol (prompt-only multi-agent coordination):**  
  - Directory structure:
    - `active_work_registry.json` → who is working on what (files, features, plan file, timestamps).  
    - `completed_work_log.json` → what’s done, with summaries, files, and git hashes.  
    - `agent_locks/{agent_id}_{timestamp}.lock` → claimed files/features + status.  
    - `planned_work_queue.json` → tasks queued for later, plus stale locks/alerts logs.  
  - Agents must:
    - Generate a unique `agent_{timestamp}_{random}` ID.  
    - Claim work by writing a lock + registry entry **before** planning/implementation.  
    - Check for conflicts and stale locks; never touch locked files.  
    - Update lock status during work and clean up (registry + lock + completed log) on completion.
- **Takeaways for Vibe:**  
  - When/if Orca ever runs truly parallel multi‑agent workflows on the same repo, use a **simple, file‑based locking + registry scheme** to prevent overlapping edits and duplicate work.  
  - Keep coordination rules in prompts + simple JSON/lock files; let commands/scripts enforce their existence and basic integrity, while agents agree to follow them.

### Other Libraries – Specialists vs Orchestrators

- **sub-agents-awesome:**  
  - Huge library of specialized agents (core dev, infra, meta‑orchestration).  
  - Meta‑orchestration agents (workflow‑orchestrator, task‑distributor, context‑manager, etc.) assume a broader infra/tooling stack than Vibe uses; better as **design inspiration** than something to copy verbatim.

- **sub-agents-elite:**  
  - ~100 single‑purpose elite agents (React, AWS, Kubernetes, etc.), designed to let Claude auto‑assemble teams based on prompts.  
  - Little explicit orchestration or gating; good source for **narrow specialist roles**, not for process control patterns.

- **design-with-claude:**  
  - Split between a **design agent collection** and a CLI (`design-create`) that orchestrates agents to generate real artifacts (tokens, components, exports).  
  - Uses an explicit **agent selection matrix**: command → primary design agent + 1–2 supporting specialists.  
  - Mirrors the “orchestration in CLI, agents as specialists” pattern we want.

---

## 2025-11-17 – Emerging Design Principles (Meta)

Not decisions yet, but recurring themes across all surveyed systems:

- **Orchestration lives outside agents.**  
  - Commands, CLIs, or small orchestrator scripts control phases, loops, and file layout.  
  - Agents stay domain‑narrow and avoid orchestrating each other.

- **Validators own quality; orchestrators only compare scores.**  
  - Validators produce numeric scores, thresholds, and checklists; orchestrators use simple rules like “score ≥ X?” and “iterations < N?”.

- **Files/checklists/standards are ground truth.**  
  - Phase checklists, requirements folders, standards files, and status JSONs define reality; model narration is secondary.  
  - Progress and phase changes are tied to these artifacts.

- **File-based coordination for parallel work.**  
   - Simple lock files + active/complete registries (Agent Farm style) let multiple agents safely share a codebase.  
   - Coordination protocol can live almost entirely in prompts + JSON; host scripts only need to enforce basic invariants.

- **Bounded loops and capped questions.**  
  - Max iterations per loop, max questions per phase, strict yes/no formats in requirements mode—these are key to preventing “belligerent” overreach.

- **Small, purposeful teams.**  
  - Dynamic agent selection per task; avoid defaulting to 10–15 agent “super teams” unless truly necessary.

These notes should inform future revisions of `/orca`, `/seo-orca`, `/webdev`, and v2 memory/standards orchestration, but do **not** imply any immediate config changes.
