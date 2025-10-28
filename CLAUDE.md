# Project Memory: claude-vibe-code

**Project Type:** AI orchestration system for Claude Code
**Last Updated:** 2025-10-26

@.orchestration/session-context.md

---

## CRITICAL: Project History - Pattern of Failures

**Trust Status:** Rebuilding. Was completely destroyed through 21+ sessions of catastrophic failures.

### Major Incidents

**Session #21 (2025-10-26):** Deleted 1,678 committed files thinking they were "cleanup"
- User: "ARE YOU FUCKING KIDDING ME"
- Had to restore everything with `git restore .`
- Pattern: Didn't clarify, didn't check .gitignore, made assumptions

**Session #22:** Wasted 10+ attempts on simple CSS without using /ultra-think or /visual-review
- User: "why does it take 10 attempts and me having to invoke ultrathink for you to accomplish literally the most basic of tasks?"

**This Session (#23):** Discovered native CLAUDE.md memory system was completely empty
- User: "No wonder this hasn't been fucking working, you literally didn't implement any of the shit we did."
- Built elaborate workarounds (claude-mem, Behavior Guard) while ignoring native system

### Core Problem Pattern

**Having tools ≠ using tools. Loading context ≠ following context.**

- Documented design-dna-linter as "available" but never deployed it
- Had Workshop integration instructions but didn't follow them
- Loaded session context but didn't use it to prevent repeated mistakes

### Critical User Quotes

> "You didn't even review the Orca file once after you were done to remove all the broken agents...even though that was the crux of the problem presented."

> "If I didn't force you to do a deep audit, it would just been totally fucked. You need to do something re: your OWN processes to ensure that doesn't happen."

> "you decided to assume like you always do you arrogant prick"

### Cost

~10 million tokens burned across 21+ sessions on:
- False completions requiring rework
- Catastrophic failures requiring restoration
- Iteration loops that could have been prevented
- Explaining the same failures repeatedly

---

## Project Goal

Build a self-improving AI orchestration system with **<5% false completion rate** (down from ~80%).

**Core problem:** Claude doesn't remember context across sessions, makes same mistakes repeatedly, and has no learning mechanism.

---

## Architecture

### Agents (51 total)

**Orchestration (4):**
- workflow-orchestrator, orchestration-reflector, playbook-curator, meta-orchestrator

**Planning (3):**
- requirement-analyst, system-architect, plan-synthesis-agent

**Quality (3):**
- verification-agent, quality-validator, test-engineer

**Implementation (4):**
- backend-engineer, infrastructure-engineer, android-engineer, cross-platform-mobile

**Design (11), Frontend (5), iOS (21)**

### Commands (15 total - 13 active, 2 deprecated)

**Active:**
/orca, /ultra-think, /enhance, /concept, /visual-review, /force, /completion-drive, /memory-learn, /memory-pause, /clarify, /organize, /cleanup, /all-tools

**Deprecated:**
/session-save, /session-resume (replaced by Workshop auto-capture)

### ACE Playbook System

Generator-Reflector-Curator architecture (arXiv-2510.04618v1)
- Patterns with helpful_count/harmful_count
- Apoptosis: harmful > helpful × 3 → deleted
- Evidence-First Dispatch (HARD BLOCK until verification)

---

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind v4 + daisyUI 5
- SQLite (playbooks, Workshop memory)

---

## Design System

**Typography:**
- GT Pantheon: Text headings, taglines
- Domaine Sans: CARD HEADINGS ONLY
- Supreme LL: Body text
- Unica77 Mono: Monospace

**ASCII Diagrams:**
- Box widths: 20, 30, 40, 60 ONLY
- 4-space grid, mathematical centering
- Chars: ┌ ┐ └ ┘ ─ │ ┬ ┴ ├ ┤ ┼ ▼

---

## Quality Gates (MANDATORY)

1. verification-agent (grep/bash verification)
2. quality-validator (evidence budget ≥5 points)
3. design-reviewer (if UI changes)
4. SELF_AUDIT_PROTOCOL (if 3+ agents or deprecations)

---

## Known Issues from 21+ Sessions

1. False completions (claiming done without evidence)
2. Tool existence ≠ usage (/visual-review not used)
3. Incremental blindness (perfect parts, broken whole)
4. Documentation drift
5. Empty native memory (CLAUDE.md was 0 bytes!)

---

## Memory System (NEW - Session 2025-10-26)

**Two-Tier Architecture:**

### 1. CLAUDE.md (Native Memory)
- **Location:** `~/.claude/CLAUDE.md` (system-wide) + `./CLAUDE.md` (project-specific)
- **Purpose:** Static, curated knowledge that auto-loads every session
- **Content:**
  - Design-OCD standards (20/30/40/60 box widths, mathematical centering)
  - ASCII diagram system
  - Typography rules (GT Pantheon, Domaine Sans, Supreme LL, Unica77 Mono)
  - Communication preferences
  - Tool usage protocols
  - Quality gate definitions
  - Evidence-based verification requirements

### 2. Workshop (Dynamic Memory)
- **Location:** `.workshop/workshop.db` (per-project SQLite)
- **Purpose:** Searchable, dynamic knowledge captured automatically
- **Content:**
  - Decisions with reasoning ("We chose X because Y")
  - Gotchas and constraints discovered during work
  - User preferences revealed in sessions
  - Session summaries (what was worked on, files changed)
  - Historical import of 21+ past sessions

**Installation:**
```bash
pip install claude-workshop
workshop init
workshop import --execute  # Import historical sessions
```

**Usage:**
```bash
# Query knowledge
workshop why "database choice"
workshop search "authentication"
workshop recent

# Workshop context loads automatically at session start
```

**Integration:**
- SessionStart hook: Loads Workshop context
- During conversation: Automatic capture of decisions/gotchas
- SessionEnd hook: Captures session summary

**Database:**
- SQLite with FTS5 full-text search
- Per-project isolation (`.workshop/workshop.db`)
- Zero cost (no APIs, no embeddings)
- 666 entries imported from 46 session files

**Why Both?**
- **CLAUDE.md = The Constitution** (static rules, load every session)
- **Workshop = The Case Law** (searchable history with full context)
- Together: Static baselines + dynamic learned patterns

---

## Next Steps

Per-project memory with historical import. Zero cost, zero complexity.
