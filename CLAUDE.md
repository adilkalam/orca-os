# Project: claude-vibe-config

# 🚨🚨🚨 DO NO EDIT THIS FILE 🚨🚨🚨
# ⚠️ THIS IS USER CONFIGURATION - READ ONLY ⚠️

## ⚠️ CRITICAL: WHAT THIS REPOSITORY IS ⚠️

**THIS IS A CONFIGURATION RECORD/MIRROR OF ~/.claude (GLOBAL CLAUDE CODE)**

### What this means:
- This repo MIRRORS and DOCUMENTS what's configured in `~/.claude` (the GLOBAL Claude Code directory)
- **~/.claude is the SOURCE OF TRUTH** - this repo records what's there
- Files in this repo are DOCUMENTATION/RECORDS of what exists in ~/.claude
- This is NOT a deployment tool - it's a VERSION-CONTROLLED RECORD

### The Actual Architecture:

```
~/.claude/                     ← SOURCE OF TRUTH (what Claude Code reads)
    ↑
    │ (you configure directly)
    │
_explore/                      ← RESEARCH LAB (experiments, ideas)
    ↓
    │ (ideas feed into decisions)
    │
    ↓
~/.claude/                     ← CONFIGURE IT HERE
    ↓
    │ (then document what was done)
    │
    ↓
claude-vibe-config/            ← RECORD/MIRROR (this repo)
```

### Directory Rules:

#### `_explore/` - DO NOT TOUCH - READ ONLY
- **THIS IS MY PERSONAL EXPLORATION FOLDER**
- **NEVER move files from here**
- **NEVER install anything here**
- **NEVER delete anything from here**
- **NEVER add anything to here**
- **NEVER point production configs to here**
- **TREAT AS READ-ONLY - NO EXCEPTIONS**

#### `mcp/` - Records of custom MCPs
- Contains RECORDS/COPIES of custom-built MCP servers
- Documents what's configured in ~/.claude
- Only custom MCPs (like vibe-memory) are recorded here
- Standard npm MCPs (playwright, context7, etc.) are NOT recorded here

#### Other directories
- `agents/` - Records of custom agent definitions from `~/.claude/agents/`
- `commands/` - Records of custom commands from `~/.claude/commands/`
- `scripts/` - Helper scripts and documentation

### Configuration Workflow:
1. Research/experiment in `_explore/`
2. Make configuration decision
3. **Configure DIRECTLY in ~/.claude or ~/.claude.json**
4. Update this repo to REFLECT/DOCUMENT what was done
5. This repo = version-controlled historical record

## CRITICAL RULES FOR WORKING IN THIS REPO

### When User Shares Logs/Feedback from Other Projects
- **YOU ARE NOT BEING ASKED TO WORK ON THAT PROJECT**
- **FOCUS ON THE CLAUDE CODE ORCHESTRATION/SETUP FAILURE**
- They're sharing evidence of Claude Code issues, NOT asking for help with the project
- Analyze the ORCHESTRATION failure, not the project code

### File Management - KEEP THIS REPO CLEAN
- **DO NOT scatter docs, audits, logs everywhere**
- **DO NOT delete agents, tools, skills, markdown files**
- If something needs removal: MOVE to a `deprecated/` folder
- Your temporary files (logs, audits): DELETE them when done
- This repo stays **CLEAN AS FUCK**

### Where Your Output Goes
- Temporary analysis: `.claude/orchestration/temp/` then DELETE
- Evidence/logs: `.claude/orchestration/evidence/` then CLEAN UP
- Reference materials: `.claude/orchestration/playbooks/`, `reference/`, `orca-commands/`
- Never leave your working files scattered in the root or main directories

### `.claude/orchestration/` Structure - ENFORCE THIS

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

## THE RULE

After ANY code change:
1. Run it
2. Show output
3. Then verify

If you skip step 1, session ends.

---

_Last updated: 2025-11-14_
