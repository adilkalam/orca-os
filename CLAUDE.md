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

## OS 2.2 QUICK REFERENCE

**57 agents** (3 Opus grand-architects, 54 Sonnet specialists) across 6 domains: Next.js (13), iOS (18), Expo (10), Data (4), SEO (4), Design (2), Cross-cutting (6).

**Unified workflow:** `/plan` → `/orca-{domain}` → `/audit`

**Role boundaries enforced:** Orchestrators delegate only, never write code.

**State preservation:** Pipelines survive interruptions and clarification questions.

**Team confirmation:** User approves agents before work starts.

**See:** `quick-reference/*.md` for detailed workflows.

---

_Version: OS 2.2_
_Last updated: 2025-11-24_
