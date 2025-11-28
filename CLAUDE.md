# Project: claude-vibe-config

**This repo:** Records the OS 2.2 configuration that solves orchestration breakdown.

## ⚠️ CRITICAL: WHAT THIS REPOSITORY IS ⚠️

**THIS IS A CONFIGURATION OF `~/.claude` (GLOBAL CLAUDE CODE)**

### What this means:
- This repo is where we design the system we deploy to `~/.claude` (the GLOBAL Claude Code directory)
- **We build in this repo and then deploy to `~/.claude`** - this repo records what's there
- **We update the global config file `~/.claude.json`**

### Directory Guide:
- **Files in this repo's main folders are a reflective record of what exists in`~/.claude`**
-- `/agents`
-- `/commands`
-- `/scripts`
-- `/hooks`
-- `/mcps`
-- `/docs/reference`
-- `/docs/pipeline`

#### `mcp/` - Records of custom MCPs
- Contains RECORDS/COPIES of custom-built MCP servers
- Documents what's configured in ~/.claude
- Only custom MCPs (like vibe-memory) are recorded here
- Standard npm MCPs (playwright, context7, etc.) are NOT recorded here

#### Other directories
- `agents/` - Records of custom agent definitions from `~/.claude/agents/`
- `commands/` - Records of custom commands from `~/.claude/commands/`
- `scripts/` - Helper scripts and documentation


#### `_explore/` & `_LLM-research/` - DO NOT TOUCH - READ ONLY
- **THIS IS MY PERSONAL EXPLORATION FOLDER**
- **NEVER move files from here**
- **NEVER install anything here**
- **NEVER delete anything from here**
- **NEVER add anything to here**
- **NEVER point production configs to here**
- **TREAT AS READ-ONLY - NO EXCEPTIONS**


## YOUR ROLE WORKING HERE (OS 2.2)

**Just like orchestrators don't write code, YOU don't fix user projects.**

When user shares logs/feedback from other projects:
- **YOU ARE NOT BEING ASKED TO WORK ON THAT PROJECT**
- **FOCUS ON THE CLAUDE CODE ORCHESTRATION/SETUP FAILURE**
- They're sharing evidence of orchestration breakdown, NOT asking for help with their project
- Analyze the ORCHESTRATION failure, not the project code

**Role boundaries matter here too.**

## CRITICAL RULES FOR WORKING IN THIS REPO

### 0. Agent YAML Format (CRITICAL - CAUSES SILENT FAILURES)

**Agent tools MUST be comma-separated strings, NOT YAML arrays.**

```yaml
# WRONG - causes 0 tool uses, agents silently fail
tools: ["Read", "Edit", "MultiEdit"]

# RIGHT - tools actually work
tools: Read, Edit, MultiEdit, Grep, Glob, Bash
```

**If an agent reports success but files don't change, CHECK THE TOOLS FORMAT FIRST.**

### 0.1 Agent Model (CRITICAL - OPUS ONLY)

**ALL agents use Opus 4.5. NEVER specify `model: sonnet` or `model: haiku`.**

```yaml
# WRONG - we don't use sonnet/haiku anymore
model: sonnet

# RIGHT - omit the model line entirely, Opus is default
# (no model line needed)
```

**Opus 4.5 is the default. No exceptions. No cost/speed tradeoffs.**

### 0.2 NO FILES OUTSIDE `.claude/` (CRITICAL - CAUSES ROOT POLLUTION)

**In ANY project, NEVER create:**
- `requirements/` in root → USE `.claude/requirements/`
- `.claude-session-context.md` in root → USE `.claude/orchestration/temp/session-context.md`
- `orchestration/`, `evidence/`, `temp/` in root → USE `.claude/orchestration/*`

**Before ANY Write/mkdir that isn't source code:**
1. Verify path starts with `.claude/`
2. If NOT → STOP and fix the path

**This applies to /plan, /orca-*, session hooks, and ALL agents.**

---

### 1. File Management - KEEP THIS REPO CLEAN
- **DO NOT scatter docs, audits, logs everywhere**
- **DO NOT delete agents, tools, skills, markdown files**
- If something needs removal: MOVE to a `deprecated/` folder
- Your temporary files (logs, audits): DELETE them when done
- This repo stays **CLEAN AS FUCK**

### 2.Where Your Output Goes
- Temporary analysis: `.claude/orchestration/temp/` then DELETE
- Evidence/logs: `.claude/orchestration/evidence/` then CLEAN UP
- Reference materials: `.claude/orchestration/playbooks/`, `reference/`, `orca-commands/`
- Never leave your working files scattered in the root or main directories

### 3.`.claude/orchestration/` Structure - ENFORCE THIS

```
.claude/orchestration/
├── evidence/       ← FINAL ARTIFACTS ONLY (screenshots, final reports, design reviews)
├── temp/           ← WORKING FILES (audits, analysis, logs, session notes) - DELETE AFTER SESSION
├── playbooks/      ← REFERENCE: Pattern templates (git, frontend, data, etc.)
├── reference/      ← REFERENCE: Key reference docs
└── orca-commands/  ← REFERENCE: ORCA command definitions
```

**RULES:**
1. **NEVER create files in `.claude/orchestration/` root** - use `temp/`, `evidence/`, or appropriate reference folder
2. **Working files go in `temp/`** - audits, analysis, session logs, notes, signal logs
3. **Final artifacts go in `evidence/`** - screenshots, design reviews, final reports
4. **Clean up `temp/` after sessions** - delete or archive old working files
5. **DO NOT create new subdirectories** - use existing structure

**Anti-Pattern:**
```
❌ .claude/orchestration/implementation-log.md
❌ .claude/orchestration/root-cause-analysis.md
❌ .claude/orchestration/session-context.md
```

**Correct Pattern:**
```
✅ .claude/orchestration/temp/implementation-log.md
✅ .claude/orchestration/temp/root-cause-analysis.md
✅ .claude/orchestration/evidence/design-review-final.md
```

### 4. `.claude/research/` Structure

Research artifacts that persist across sessions:

```
.claude/research/
├── evidence/       ← Evidence Notes from subagents
├── reports/        ← Final and draft research reports
└── cache/          ← Cached search results (optional)
```

**Note:** Unlike `.claude/orchestration/temp/`, research artifacts may be reused
across sessions for related queries.

## OS 2.4.0 QUICK REFERENCE

**82 agents** (all Opus 4.5) across 9 domains: Next.js (14), iOS (19), Expo (11), Shopify (7), Data (4), SEO (4), Research (8), OBDN (4), Design (2), OS-Dev (5), Cross-cutting (6).

**Unified workflow:** `/plan` → `/orca-{domain}` → `/audit`

**Role boundaries enforced:** Orchestrators delegate only, never write code.

**State preservation:** Pipelines survive interruptions and clarification questions.

**Team confirmation:** User approves agents before work starts.

**See:** `quick-reference/*.md` for detailed workflows.

---

_Version: OS 2.4.0_
_Last updated: 2025-11-27_

## Learned Rules (via /reflect)
<!-- Auto-managed by /reflect - manual edits may be overwritten -->

### Active Rules

**[rule-001] Version Sync Rule** (2025-11-27)
When updating OS version (e.g., 2.3 → 2.4), grep ALL phase-configs in `docs/reference/phase-configs/` and update versions together. Never leave configs at mixed versions.

**[rule-002] Model Reference Cleanup** (2025-11-27)
When changing model policy (e.g., "all Opus"), grep all docs (`quick-reference/`, `docs/`, `agents/`) for old model names (Sonnet, Haiku) and update. Documentation drift causes confusion.

**[rule-003] No Root Pollution** (2025-11-27)
NEVER create `requirements/`, `.claude-session-context.md`, `orchestration/`, `evidence/`, or `temp/` in project root. ALL orchestration artifacts go in `.claude/`. Check every Write/mkdir path starts with `.claude/` before executing.

### Archived Rules
<!-- Rules no longer active but kept for history -->
