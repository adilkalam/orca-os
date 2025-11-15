# Claude Vibe Code - Configuration Record

**Purpose:** Version-controlled record of what's configured in `~/.claude` (global Claude Code)

**Last Updated:** 2025-11-12

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

## System Counts (What's in ~/.claude)

- **Agents:** 53 total (excludes 3 template/policy files)
- **Commands:** 23 total (all active)
- **Hooks:** 8 total
- **Scripts:** 3 total
- **Playbooks:** 7 JSON files

---

## What's Recorded in This Repo

### 1. Root Configuration Files

**What's mirrored:**
- `CLAUDE.md` (mirrored from `~/.claude/CLAUDE.md` - project memory)
- `QUICK_REFERENCE.md` (mirrored from `~/.claude/QUICK_REFERENCE.md`)
- `README.md` (repo documentation only - NOT in ~/.claude)

**Note:** Global user memory (`~/.claude/CLAUDE.md` for system-wide settings) is managed separately in `~/.claude/` and NOT tracked in this repo.

### 2. Agents (53 total)

**What's in ~/.claude/agents/ (and recorded here):**
```
agents/
├── implementation/
│   ├── backend-engineer.md
│   ├── infrastructure-engineer.md
│   ├── android-engineer.md
│   └── cross-platform-mobile.md
├── orchestration/
│   ├── workflow-orchestrator.md
│   ├── orchestration-reflector.md
│   ├── playbook-curator.md
│   └── meta-orchestrator.md
├── planning/
│   ├── requirement-analyst.md
│   ├── system-architect.md
│   └── plan-synthesis-agent.md
├── quality/
│   ├── verification-agent.md
│   ├── quality-validator.md
│   ├── test-engineer.md
│   └── content-awareness-validator.md
└── specialists/
    ├── design-specialists/ (12 agents including design-ocd-enforcer)
    ├── frontend-specialists/ (5 agents)
    └── ios-specialists/ (21 agents)
```

**Agent Categories:**
- Implementation: 4
- Orchestration: 4
- Planning: 3
- Quality: 4
- Design: 12
- Frontend: 5
- iOS: 21

**Total: 53**

### 3. Commands (23 total)

**What's in ~/.claude/commands/ (and recorded here):**
```
commands/
├── all-tools.md
├── ascii-mockup.md
├── clarify.md
├── cleanup.md
├── completion-drive.md
├── concept-new.md
├── concept.md
├── creative-strategist.md
├── enhance.md
├── finalize.md
├── force.md
├── ios-debug.md
├── memory-learn.md
├── memory-pause.md
├── mode-off.md
├── mode-strict.md
├── mode-tweak.md
├── orca.md
├── organize.md
├── session-resume.md
├── session-save.md
├── ultra-think.md
└── visual-review.md
```

**Active Commands:** 23
**Deprecated:** 0

### 4. Hooks (8 total)

**What's in ~/.claude/hooks/ (and recorded here):**
```
hooks/
├── auto-activate-skills.sh
├── detect-project-type.sh
├── load-design-dna.sh
├── load-playbooks.sh
├── orchestrator-firewall.sh
├── session-start.sh
├── SessionEnd.sh
└── SessionStart.sh
```

### 5. Scripts (3 total)

**What's in ~/.claude/scripts/ (and recorded here):**
```
scripts/
├── statusline-README.md
├── statusline.js
└── verify-file-organization.sh
```

### 6. Orchestration System

**What's in ~/.claude/.orchestration/ (partially recorded):**
```
.orchestration/
├── playbooks/                 ← RECORDED in this repo
│   ├── universal-patterns.json
│   ├── frontend-patterns.json
│   ├── git-patterns.json
│   ├── ios-development-template.json
│   ├── nextjs-patterns-template.json
│   ├── universal-patterns-template.json
│   └── taste-obdn-template.json
├── sessions/                  ← NOT recorded (runtime data)
├── signals/                   ← NOT recorded (runtime data)
└── verification-system/       ← NOT recorded
```

**Note:** Some .orchestration subdirectories contain runtime data (sessions/, signals/) that are NOT tracked in this repo.

---

## What's NOT Recorded

**These exist in ~/.claude but are NOT tracked here:**

### Runtime Data
- `.orchestration/sessions/` (session history)
- `.orchestration/signals/` (runtime signals)
- `.orchestration/agent-skill-vectors/` (generated data)
- `.orchestration/knowledge-graph/` (generated data)
- `todos/` (active todo tracking)
- `session-env/` (session variables)
- `ide/` (IDE state)
- `statsig/` (analytics)
- `history.jsonl` (session history)

### Plugin System
- `plugins/` (installed plugins - managed by Claude Code)
- `skills/` (user skills - can be tracked separately)

### Archived/Cleaned Data
- `projects/` (archived - too large)
- `debug/` (archived - too large)
- `shell-snapshots/` (archived - too large)
- `file-history/` (archived - too large)

---

## MCP Servers

### Architecture Overview

**Two types of MCPs:**

1. **Global MCPs** (in `~/.claude.json`)
   - Standard npm-based servers
   - Available in ALL projects
   - Examples: XcodeBuildMCP, chrome-devtools, playwright, context7

2. **Per-Project MCPs** (in `~/.claude.json` under `projects[<abs path>].mcpServers`)
   - Project-specific configurations, additive to global MCPs
   - Each project can have unique setup
   - Example: vibe-memory (per-project Workshop database)

### vibe-memory: Per-Project Setup

**Architecture:**
```
~/.claude/mcp/vibe-memory/memory_server.py    ← Server code (shared)
    ↓ (referenced by)
~/.claude.json → projects["/abs/path/to/project"].mcpServers   ← Per-project config
    ↓ (accesses)
Project/.workshop/workshop.db                 ← Per-project data
```

**Why per-project:**
- Each project has its own `.workshop/workshop.db`
- Memory is project-specific (not global)
- Server finds database by walking up from CWD
- Follows Workshop's intended architecture

**Source code in this repo:**
- `mcp/vibe-memory/memory_server.py` - Server implementation
- This gets copied to `~/.claude/mcp/vibe-memory/`
- Projects reference the global server location

**Per-project configuration:** Add under `~/.claude.json`:
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

**Then initialize Workshop:**
```bash
cd /path/to/project
workshop init  # Creates .workshop/workshop.db
```

### Global MCPs (in ~/.claude.json)

**Standard npm-based MCPs configured globally:**
- `XcodeBuildMCP` (npx-based, iOS/macOS development)
- `chrome-devtools` (npx-based, browser automation)
- `bright-data-web` (npx-based, web scraping)
- `playwright` (npx-based, browser testing)
- `context7` (npx-based, context management)
- `sequential-thinking` (npx-based, reasoning)

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
# Count agents (excluding template/policy files)
find ~/.claude/agents -name "*.md" | grep -v "TEMPLATE\|README\|POLICY\|context" | wc -l  # Should be 53

# Count commands
find ~/.claude/commands -name "*.md" | wc -l  # Should be 23

# Verify hooks
ls ~/.claude/hooks/*.sh  # Should show 8 files

# Check playbooks
ls ~/.claude/.orchestration/playbooks/*.json | wc -l  # Should be 7

# Verify specific files exist
ls ~/.claude/QUICK_REFERENCE.md
ls ~/.claude/commands/session-*.md  # Should show 2 files
```

**Check what's recorded in this repo:**

```bash
# From this repo root
find agents -name "*.md" | grep -v "TEMPLATE\|README\|POLICY" | wc -l  # Should be 53
find commands -name "*.md" | wc -l  # Should be 23
ls hooks/*.sh | wc -l  # Should be 8
ls .orchestration/playbooks/*.json | wc -l  # Should be 7
```

---

## Verification Checklist

**When syncing, verify both sides match:**

- [ ] `find ~/.claude/agents -name "*.md" | grep -v "TEMPLATE\|README\|POLICY\|context" | wc -l` returns 53
- [ ] `find agents -name "*.md" | grep -v "TEMPLATE\|README\|POLICY" | wc -l` returns 53
- [ ] `find ~/.claude/commands -name "*.md" | wc -l` returns 23
- [ ] `find commands -name "*.md" | wc -l` returns 23
- [ ] `ls ~/.claude/hooks/*.sh | wc -l` returns 8
- [ ] `ls hooks/*.sh | wc -l` returns 8
- [ ] `ls ~/.claude/.orchestration/playbooks/*.json | wc -l` returns 7
- [ ] `ls .orchestration/playbooks/*.json | wc -l` returns 7

---

**This file documents what's configured in ~/.claude. Update this file when ~/.claude changes to maintain version-controlled history.**
