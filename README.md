# Vibe Code for Claude Code

Auto‑orchestration, durable memory, and disciplined verification for building software with Claude Code. Vibe Code detects your stack, assembles the right specialists, remembers hard‑won knowledge, and prevents chaos.

---

## Quick Start

1) Open your project with Claude Code
2) Run `/orca "what you want built"` and confirm the proposed team
3) Use memory as needed: `/memory-search terms`
4) For complex or risky work: `/response-awareness-plan` then `/response-awareness-implement`

Optional (recommended):
- Install global hooks: `bash .claude-global-hooks/install.sh`
- Enable optional MCP tools in your global config (see “MCP Servers”)

---

## System Overview

Vibe Code combines four pillars:

- Workshop (project memory): `.workshop/workshop.db` stores decisions, gotchas, goals, and notes.
- ACE Playbooks (learning): `.orchestration/playbooks/` records helpful/neutral/anti‑patterns with counts.
- Orchestration (orca): `/orca` proposes a focused team and coordinates plan → implement → verify.
- Guardrails (hooks): session context, path enforcement, and an optional introspection gate.

Typical flow:
1) SessionStart detects the stack, loads playbooks, and surfaces recent context
2) `/orca` proposes a minimal team and plan; you confirm before dispatch
3) Implementers code; verifiers demand evidence (tests/build logs/screenshots)
4) Reflection updates Workshop and playbooks so future sessions avoid known failure paths

---

## Core Workflow

- `/orca` — Orchestrate multi‑agent development with team confirmation
- `/response-awareness` — Full plan → implement → verify using meta‑cognitive tags
- `/response-awareness-plan` — Produce and confirm a blueprint; no code changes
- `/response-awareness-implement` — Implement from an approved blueprint
- `/introspect` — Predict failure modes; emit risk, tags, and a gate decision

When work is straightforward, `/orca` is enough. As ambiguity or risk grows, add `/introspect` and Response Awareness to tighten control.

---

## Memory System Details

### Workshop (Project Memory)
Location: `.workshop/workshop.db`

Workshop captures decisions, gotchas, goals, and session context. You can use the `workshop` CLI directly, or `/memory-search` for quick recall. Hooks show a brief summary at session start.

### ACE Playbooks (Learning)
Location: `.orchestration/playbooks/`

Playbooks evolve with use. Helpful/neutral/anti‑patterns accrue counts. After work completes, reflection updates counts and adds new patterns so future sessions pick what works and avoid what fails.

### Design DNA (Taste)
Location: `.claude/design-dna/`

For UI work, shared design rules keep output consistent (colors, spacing, typography). See AGENTS.md for the styling policy (global CSS with tokens—no Tailwind).

---

## Commands

### Core
- `/orca` — Orchestrate team and phases
- `/response-awareness` — Full protocol with tags
- `/response-awareness-plan` — Plan/blueprint only
- `/response-awareness-implement` — Implement approved blueprint
- `/introspect` — Assess risk and recommend the next step

### Quality & Verification
- `/visual-review` — Capture and compare UI evidence
- `/finalize` — Close‑out report with evidence links (orca sessions only)

### Memory & Learning
- `/memory-search` — Query Workshop memory (no MCP required)
- `/memory-learn` — Reflect and update playbooks

### Organization & Cleanup
- `/organize` — Tidy files and folders with references
- `/cleanup` — Remove stale logs and artifacts

### Design
- `/concept` — Iterate on an existing layout
- `/concept-new` — Explore a brand‑new layout direction
- `/creative-strategist` — Brand + performance strategy consult

For fast lookups, see: `docs/quick-reference/commands.md`.

---

## Agents (Auto‑Selected)

Agents live under `agents/` (planning, orchestration, implementation, design, and quality). Orca selects a minimal team per task and asks you to confirm before dispatch.

Categories at a glance:
- Planning: requirement analyst, plan synthesis
- Orchestration: workflow orchestrator, playbook curator, reflector
- Implementation: iOS, frontend, backend, mobile, etc.
- Design: system architect, UI, verification (design DNA)
- Quality: verification agent, testing engineers, validators

You don’t need to pick these by hand—orca proposes a team you edit or confirm.

---

## Guardrails & Evidence

Hooks enforce file‑path rules and add session context. Verifiers require evidence—tests, build logs, and screenshots—before claims become facts.

Useful scripts:
```bash
# Detect and clean stray artifacts
chaos-monitor
chaos-cleanup

# Performance logs for hooks
bash scripts/perf-report.sh
```

Docs: `docs/CHAOS_PREVENTION.md`

Optional introspection gate (pre‑tool): set `INTROSPECTION_GATE=1` and (optionally) `INTROSPECTION_GATE_THRESHOLD=0.40`. When the last `/introspect` risk ≥ threshold, write/edit calls are blocked until you reduce risk or re‑plan.

---

## MCP Servers (Optional)

Enable these locally if you want Claude to call the tools directly:
- XcodeBuild MCP — iOS/macOS build, test, simulator (`mcp/xcodebuildmcp/`)
- Chrome DevTools MCP — browser automation and screenshots (`mcp/chrome-devtools-mcp/`)
- Vibe Memory MCP — `memory.search` over Workshop DB (`mcp/vibe-memory/`)
- Gmail MCP — email automation (`mcp/gmail-mcp/`)

Configure in your global Claude config:
- CLI: `~/.claude.json`
- Desktop (macOS): `~/Library/Application Support/Claude/claude_desktop_config.json`

Docs: `docs/mcp-memory.md`

---

## Hooks

Project hooks (always available): `hooks/`
- `session-start.sh` — Writes a session context summary (Workshop status, recent changes, playbooks).
- `pre-tool-use.sh` — Path enforcement (and optional introspection gate).
- `load-playbooks.sh` — Loads and initializes ACE playbooks.
- `orchestrator-firewall.sh` — Wrapper around write/edit/delete guardrails.

Global hooks (optional): `.claude-global-hooks/` → installed into `~/.claude/hooks/`
- `SessionStart.sh` and `SessionEnd.sh` add consistent behavior across projects.

Docs: `docs/session-start.md`

---

## Directory Structure (Key)

```
claude-vibe-code/
├── agents/                  # Specialists (planning, orchestration, impl, design, quality)
├── commands/                # Slash commands (markdown prompts)
├── docs/                    # Documentation
├── hooks/                   # Project hook scripts
├── mcp/                     # Optional MCP servers
├── scripts/                 # Utilities and verifiers
├── skills/                  # Claude Code skills (prompt snippets)
├── .orchestration/          # Playbooks, signals, logs (evolves with use)
└── .workshop/               # Project memory (SQLite FTS)
```

---

## Troubleshooting

- “memory.search” missing or empty: build the FTS index
  - `python3 scripts/memory-index.py index-all --include-out`
- High‑risk blocked by introspection gate
  - Run `/introspect`, adjust the plan, or `/response-awareness-plan` → re‑log risk
- Path enforcement blocked a write
  - Save under `.claude-work/memory/` or a source directory (`src/`, `docs/`, `tests/`, etc.)
- Agent parse errors
  - Ensure agent markdown includes valid frontmatter (`name`, `description`, `allowed-tools` when applicable)

---

## Documentation Index

- Memory systems: `docs/MEMORY_SYSTEMS_OVERVIEW.md`
- Workshop usage: `docs/workshop.md`
- Chaos prevention: `docs/CHAOS_PREVENTION.md`
- Design system guide: `docs/DESIGN_SYSTEM_GUIDE.md`
- Local memory detail: `docs/local-memory.md`
- Quick reference: `docs/quick-reference/commands.md`, `docs/quick-reference/agents-teams.md`, `docs/quick-reference/triggers-tools.md`
  and `docs/quick-reference/teams-by-stack.md`

---

## Key Principles

1) Confirm plans and teams before implementation
2) Provide evidence for claims (tests, logs, screenshots)
3) Keep memory fresh—record decisions and gotchas
4) Prefer small, reversible changes; scale rigor with risk
5) Learn continuously—update playbooks after outcomes

You describe what you want. The system handles the details—and proves it.
