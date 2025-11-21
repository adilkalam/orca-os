# Claude Vibe Code - Configuration Record — 2025-11-19

**Purpose:** Version-controlled record of what's configured in `~/.claude` (global Claude Code)

---

## Source of Truth

**~/.claude is SOURCE OF TRUTH** - This repo mirrors and documents it

**Global Config:** `~/.claude/` (what Claude Code reads)
**This Repository:** `/Users/adilkalam/claude-vibe-config` (version-controlled record)

This file documents the EXACT state of `~/.claude` for version control purposes.

---

## Architecture Flow

```
_explore/                      ← RESEARCH LAB (experiments, ideas)
    ↓
    │ (ideas feed into decisions)
    ↓
~/.claude/                     ← SOURCE OF TRUTH (configure here)
    ↓
    │ (then document what was done)
    ↓
claude-vibe-config/            ← RECORD/MIRROR (this repo)
```

**Configuration Workflow:**
1. Research/experiment in `_explore/`
2. Make configuration decision
3. **Configure DIRECTLY in ~/.claude or ~/.claude.json**
4. Update this repo to REFLECT/DOCUMENT what was done
5. This repo = version-controlled historical record

---

## System Counts (What's in ~/.claude) — OS 2.0

**Current State (2025-11-19):**
- **Agents:** 21 total (OS 2.0 focused set)
- **Commands:** 16 total (all active)
- **Hooks:** 5 total (startup, project detection, skills)
- **Scripts:** Minimal (statusline, verification)

**Note:** This represents OS 2.0 - a significantly leaner system compared to pre-v2 (which had 53 agents, 23 commands, 8 hooks). OS 2.0 focuses on core domain pipelines: frontend, iOS, Expo, SEO.

---

## What's Recorded in This Repo

### 1. Root Configuration Files

**What's mirrored:**
- `CLAUDE.md` (mirrored from `~/.claude/CLAUDE.md` - workshop integration docs)
- `QUICK_REFERENCE.md` (mirrored from `~/.claude/QUICK_REFERENCE.md`)
- `README.md` (repo documentation only - NOT in ~/.claude)

**Note:** Global user memory (`~/.claude/CLAUDE.md` for system-wide settings) is managed separately in `~/.claude/` and NOT tracked in this repo.

### 2. Agents (21 total) — OS 2.0

**What's in ~/.claude/agents/ (and recorded here):**

**Domain-Focused Agents:**
- **Design/A11y (2):** a11y-enforcer, design-token-guardian
- **Frontend (4):** frontend-builder-agent, frontend-design-reviewer-agent, frontend-layout-analyzer, frontend-standards-enforcer
- **iOS (4):** ios-architect-agent, ios-standards-enforcer, ios-ui-reviewer-agent, ios-verification-agent
- **Expo (3):** expo-architect-agent, expo-builder-agent, expo-verification-agent
- **SEO (4):** seo-brief-strategist, seo-draft-writer, seo-quality-guardian, seo-research-specialist
- **Performance/Security (3):** performance-enforcer, performance-prophet, security-specialist
- **Visual (1):** visual-layout-analyzer

**Total: 21 agents**

**Architecture Philosophy:**
- Each domain has architect → builder → standards → verification pipeline
- No general-purpose "orchestrators" or "meta-agents"
- Domain-specific expertise over generic coordination

### 3. Commands (16 total) — OS 2.0

**What's in ~/.claude/commands/ (and recorded here):**

**Orchestration:**
- `orca.md` - Main orchestrator
- `seo-orca.md` - SEO pipeline orchestrator

**Requirements System (6 commands):**
- `requirements-start.md` - Start requirements gathering
- `requirements-status.md` - Check status
- `requirements-current.md` - View current requirement
- `requirements-list.md` - List all requirements
- `requirements-remind.md` - Remind of rules
- `requirements-end.md` - End gathering

**Response Awareness (2 commands):**
- `response-awareness-plan.md` - Plan with RA
- `response-awareness-implement.md` - Implement from spec

**Tools:**
- `clone-website.md` - Clone website UI
- `design-review-from-screenshot.md` - Visual review
- `enhance.md` - Enhance prompts
- `ultra-think.md` - Deep analysis
- `session-resume.md` - Resume session
- `session-save.md` - Save session

**Total: 16 commands**

### 4. Hooks (5 total) — OS 2.0

**What's in ~/.claude/hooks/ (and recorded here):**

```
hooks/
├── auto-activate-skills.sh         ← Auto-activate skills
├── detect-project-type.sh          ← Detect project context
├── file-location-guard.sh          ← Prevent wrong file locations
├── gate-enforcement.sh             ← Quality gate enforcement
└── session-start.sh                ← Session initialization
```

**Note:** OS 2.0 uses fewer, more focused hooks. Pre-v2 had 8 hooks with more orchestration complexity.

### 5. Scripts

**What's in ~/.claude/scripts/ (and recorded here):**

```
scripts/
├── statusline-README.md            ← Documentation
├── statusline.sh                   ← Status line for Claude Code
└── verify-file-organization.sh     ← File organization checker
```

---

## What's NOT Recorded

**These exist in ~/.claude but are NOT tracked here:**

### Runtime Data
- `session-env/` (session variables)
- `ide/` (IDE state)
- `statsig/` (analytics)
- `todos/` (active todo tracking)
- `projects/` (project-specific data)
- `debug/` (debug logs)
- `shell-snapshots/` (shell state)
- `plans/` (runtime plans)

### Plugin System
- `plugins/` (installed plugins - managed by Claude Code)
- `skills/` (user skills - can be tracked separately)

---

## MCP Servers

### Architecture Overview

**Two types of MCPs:**

1. **Global MCPs** (in `~/.claude.json`)
   - Standard npm-based servers
   - Available in ALL projects
   - Examples: XcodeBuildMCP, chrome-devtools, playwright, context7, bright-data-web, sequential-thinking

2. **Per-Project MCPs** (in `~/.claude.json` under `projects[<abs path>].mcpServers`)
   - Project-specific configurations, additive to global MCPs
   - Each project can have unique setup
   - Example: vibe-memory (per-project memory database)

### vibe-memory: Per-Project Setup

**Architecture:**
```
~/.claude/mcp/vibe-memory/memory_server.py    ← Server code (shared)
    ↓ (referenced by)
~/.claude.json → projects["/abs/path/to/project"].mcpServers   ← Per-project config
    ↓ (accesses)
Project/.claude/memory/vibe.db                ← Per-project data (OS 2.0)
```

**Why per-project:**
- Each project has its own `.claude/memory/vibe.db` (OS 2.0 uses vibe.db, not workshop.db)
- Memory is project-specific (not global)
- Server finds database by walking up from CWD
- Semantic search + events + cognitive tags

**Source code in this repo:**
- `mcp/vibe-memory/memory_server.py` - Server implementation
- This gets copied to `~/.claude/mcp/vibe-memory/`
- Projects reference the global server location

**Per-project configuration in ~/.claude.json:**
```json
{
  "projects": {
    "/absolute/path/to/your-project": {
      "mcpServers": {
        "vibe-memory": {
          "command": "python3",
          "args": ["/Users/adilkalam/.claude/mcp/vibe-memory/memory_server.py"],
          "env": { "PYTHONUNBUFFERED": "1" }
        }
      }
    }
  }
}
```

### Global MCPs (in ~/.claude.json)

**Standard npm-based MCPs configured globally:**
- `XcodeBuildMCP` (npx-based, iOS/macOS development)
- `chrome-devtools` (npx-based, browser automation)
- `bright-data-web` (npx-based, web scraping)
- `playwright` (npx-based, browser testing)
- `context7` (npx-based, documentation lookup)
- `sequential-thinking` (npx-based, deep reasoning)
- `shared-context` (npx-based, cross-session context)
- `project-context` (npx-based, project memory)

**Pattern:**
- Standard npm MCPs → top‑level `mcpServers` in `~/.claude.json` (global)
- Custom per-project MCPs → `~/.claude.json` under `projects[<abs path>].mcpServers`
- Server code → `~/.claude/mcp/[name]/` (shared location)

---

## Keeping This Repo in Sync

### When ~/.claude Changes

**After configuring something in ~/.claude:**
1. Update the corresponding file in this repo
2. Commit with clear message: "Record: Added X to ~/.claude"
3. This creates version-controlled history

**Example workflow:**
```bash
# 1. Configure in ~/.claude
vim ~/.claude/agents/new-agent.md

# 2. Copy to repo for recording
cp ~/.claude/agents/new-agent.md /Users/adilkalam/claude-vibe-config/agents/

# 3. Document the change
cd /Users/adilkalam/claude-vibe-config
git add agents/new-agent.md
git commit -m "Record: Added new-agent to ~/.claude/agents/"
```

### Sync Strategy

**The `scripts/deploy-to-global.sh` script:**
- **WARNING:** Name is misleading (legacy from old architecture)
- **Actual purpose:** Syncs FROM this repo TO ~/.claude
- **When to use:** When you want to restore ~/.claude from this repo's record
- **NOT for normal workflow** - Normal workflow is: configure ~/.claude → record here

**What the script does:**
1. Creates safety backup of ~/.claude
2. Copies files FROM this repo TO ~/.claude
3. Useful for: Restoring ~/.claude, setting up new machine, recovering from issues

**When to run:**
```bash
# Setting up new machine
./scripts/deploy-to-global.sh

# Restoring ~/.claude from this record
./scripts/deploy-to-global.sh

# NOT for regular use - regular use is:
# 1. Edit ~/.claude directly
# 2. Copy changes to this repo for recording
```

---

## Verification Commands

**Check what's actually in ~/.claude:**

```bash
# Count agents (OS 2.0)
find ~/.claude/agents -name "*.md" | wc -l  # Should be 21

# Count commands (OS 2.0)
find ~/.claude/commands -name "*.md" | wc -l  # Should be 16

# Verify hooks (OS 2.0)
ls ~/.claude/hooks/*.sh | wc -l  # Should be 5

# List specific agents
ls -1 ~/.claude/agents/*.md

# List specific commands
ls -1 ~/.claude/commands/*.md
```

**Check what's recorded in this repo:**

```bash
# From this repo root
find agents -name "*.md" | wc -l
find commands -name "*.md" | wc -l
ls hooks/*.sh | wc -l
```

**Note:** This repo may contain more files than ~/.claude (historical agents, archived commands, etc.). The verification is to ensure ~/.claude content is RECORDED here, not that they're identical.

---

## Verification Checklist

**When syncing, verify ~/.claude content is recorded:**

- [ ] `find ~/.claude/agents -name "*.md" | wc -l` returns 21 (OS 2.0)
- [ ] `find ~/.claude/commands -name "*.md" | wc -l` returns 16 (OS 2.0)
- [ ] `ls ~/.claude/hooks/*.sh | wc -l` returns 5 (OS 2.0)
- [ ] All files in ~/.claude/agents/ exist in this repo's agents/
- [ ] All files in ~/.claude/commands/ exist in this repo's commands/
- [ ] All files in ~/.claude/hooks/ exist in this repo's hooks/

---

**This file documents what's configured in ~/.claude. Update this file when ~/.claude changes to maintain version-controlled history.**

_Last updated: 2025-11-19 (OS 2.0)_
