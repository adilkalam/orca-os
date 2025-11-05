# Memory Systems Overview (Claude Code)

Purpose: Quick, practical guide to all memory systems used by Claude Code in this repo (global and project-level), how they interact, how to verify they work, and how to recover from crashes.

---

## Layers at a Glance

- Native Memory (static)
  - Global: `~/.claude/CLAUDE.md`
  - Project: `./CLAUDE.md`
  - Auto-loaded every session by Claude Code. Curated rules, standards, and operating procedures.

- Workshop (dynamic)
  - Per-project SQLite DB: `.claude-work/memory/workshop.db` (new) or legacy `.workshop/workshop.db`
  - Auto-initialized and auto-imported via global hooks (supports both layouts).
  - Search and record decisions/gotchas via `workshop` CLI.

- vibe-memory MCP (tool bridge)
  - MCP server that exposes `memory.search` backed by Workshop DB.
  - Lets Claude call memory search as a first-class tool.

- Session Save/Resume (manual fallback)
  - Markdown-based snapshot and reload of session context.
  - Kept for fallback/debug; largely superseded by Workshop.

---

## 1) Native Memory: CLAUDE.md (Static)

- Where
  - Global: `~/.claude/CLAUDE.md`
  - Project: `./CLAUDE.md`

- What
  - Static, curated knowledge that loads every session (rules, standards, quality gates, preferences).

- Verify
  - Open a new session and ensure content from both global and project CLAUDE.md is referenced by the assistant.

---

## 2) Workshop: Dynamic Memory (Per Project)

- Where
  - DB (new): `.claude-work/memory/workshop.db`
  - DB (legacy): `.workshop/workshop.db`
  - CLI: `workshop` (must be installed and on PATH)

- Hooks (installed globally)
  - SessionStart: auto-init `.workshop` if missing; on error emits a structured failure message. Performs a quiet catch-up import to recover missed sessions after crashes.
  - SessionEnd: imports new transcripts on session close.

- Install/Configure
  - Install hooks from project root:
    - `bash .claude-global-hooks/install.sh`
  - This copies hooks to `~/.claude/hooks/` and ensures they’re executable.

- Verify
  - `workshop --version`
  - Start a new session: expect a structured message with “📝 Workshop Context Available”. If init fails, you’ll see a clear “Workshop Init Failed” with next steps.
  - `workshop context`, `workshop recent`

- Crash Recovery
  - If a session closes unexpectedly and SessionEnd doesn’t run, the next SessionStart runs a quiet `workshop import --execute` to catch up.

---

## 3) vibe-memory MCP (Search Tool Over Workshop)

- What
  - Minimal MCP server exposing `memory.search` that queries the Workshop DB (new or legacy path) with optional vector rerank.

- Where
  - Server script: `mcp/vibe-memory/memory_server.py`
  - Config (global):
    - Claude Code CLI: `~/.claude.json`
    - Claude Desktop (macOS): `~/Library/Application Support/Claude/claude_desktop_config.json`

- DB Resolution (robust order)
  1. `WORKSHOP_DB` env (absolute path)
  2. `WORKSHOP_ROOT` env + `/.claude-work/memory/workshop.db` (then legacy `/.workshop/workshop.db`)
  3. Walk up from client CWD (prefer new layout, then legacy)
  4. Walk up from script location (prefer new layout, then legacy)
  5. Fallback: `CWD/.claude-work/memory/workshop.db`

- Verify (in Claude Code)
  - Check MCP tools: `memory.search` should be available under `vibe-memory`.
  - Call the tool with a simple query (e.g., a file or decision text stored by Workshop).
  - If it says DB missing, ensure `.workshop/` exists or set `WORKSHOP_DB`/`WORKSHOP_ROOT` in your global config entry (`~/.claude.json`).

- For Other Projects
  - Use global config; the server infers the current workspace via `initialize.rootUri`. No per-project config is required.

---

## 4) Session Save / Session Resume (Manual Fallback)

- Where
  - `commands/session-save.md`
  - `commands/session-resume.md`

- What
  - Markdown snapshot and reload of a session context. Useful if Workshop is intentionally paused or for debugging.

- Status
  - Superseded in normal use by Workshop auto-load/import; kept for manual fallback.

---

## 5) Learning + Control (Adjacent Systems)

- `/memory-learn`
  - Manual trigger for reflection + curation over recent sessions (not limited to `/orca`).
  - Consumes `.orchestration/signals/signal-log.jsonl` and updates playbooks.

- `/memory-pause`
  - Temporarily disables learned patterns from influencing orchestration (useful for testing changes in isolation).

---

## Quick Start (New Project)

1) Ensure hooks are installed globally
   - `bash .claude-global-hooks/install.sh`

2) Initialize Workshop in the project
   - `workshop init`
   - Optional historical import: `workshop import --execute`

3) Start a Claude Code session in the project
   - Expect a structured message: "📝 Workshop Context Available" (or a clear failure message with next steps)

4) (Optional) Enable vibe-memory MCP globally
   - Add the server to `~/.claude.json` (or Desktop config) and, if needed, set `WORKSHOP_DB`/`WORKSHOP_ROOT` env there.

---

## Troubleshooting Checklist

- No Workshop context message on start
  - `workshop --version`
  - `ls -la .workshop` (exists?)
  - Reinstall hooks: `bash .claude-global-hooks/install.sh`

- Session not captured after accidental close
  - Next session start should auto catch-up import
  - Manually: `workshop import --execute`

- `memory.search` not available
  - Check global config `~/.claude.json` entry and env (`WORKSHOP_DB`, `WORKSHOP_ROOT`)
  - Confirm `.workshop/workshop.db` exists

- CLAUDE.md not reflected
  - Confirm global `~/.claude/CLAUDE.md` and project `./CLAUDE.md` exist and are not empty

---

## File Map (Key)

- Global hooks
  - `~/.claude/hooks/SessionStart.sh`
  - `~/.claude/hooks/SessionEnd.sh`

- Project code
  - `.claude-global-hooks/SessionStart.sh`
  - `.claude-global-hooks/SessionEnd.sh`
  - `mcp/vibe-memory/memory_server.py`
  - Global config: `~/.claude.json` (CLI) or Desktop config
  - `.workshop/workshop.db`
  - `CLAUDE.md`
  - `commands/session-save.md`, `commands/session-resume.md`
