# Project: claude-vibe-code

# 🚨🚨🚨 DO NOT FUCKING EDIT THIS FILE 🚨🚨🚨
# ⚠️ THIS IS USER CONFIGURATION - READ ONLY ⚠️
# 🛑 DO NOT ADD SECTIONS 🛑
# 🛑 DO NOT REMOVE SECTIONS 🛑
# 🛑 DO NOT MODIFY ANYTHING 🛑
# ❌ EDITING THIS FILE = SESSION TERMINATION ❌

## ⚠️ CRITICAL: WHAT THIS REPOSITORY IS ⚠️

**THIS IS A CONFIGURATION ADMINISTRATIVE TOOL FOR GLOBAL CLAUDE CODE**

### What this means:
- This repo MANAGES configurations that get deployed to `~/.claude` (the GLOBAL Claude Code directory)
- Agents, commands, MCPs, skills, etc. are INSTALLED GLOBALLY to `~/.claude`
- Files in this repo are CONFIGURATION SOURCES that get deployed globally
- This is NOT a regular project - it's an ADMIN TOOL for Claude Code itself

### Directory Rules:

#### `_explore/` - DO NOT TOUCH - READ ONLY
- **THIS IS MY PERSONAL EXPLORATION FOLDER**
- **NEVER move files from here**
- **NEVER install anything here**
- **NEVER delete anything from here**
- **NEVER add anything to here**
- **NEVER point production configs to here**
- **TREAT AS READ-ONLY - NO EXCEPTIONS**

#### `mcp/` - Local development copies
- Contains LOCAL COPIES of MCP servers for development
- These get DEPLOYED to appropriate global locations
- The `.mcp.json` should point to production paths, NOT _explore

#### Other directories
- `agents/` - Agent definitions that deploy to `~/.claude/agents/`
- `.claude/commands/` - Commands that deploy to `~/.claude/commands/`
- `scripts/` - Admin scripts for managing the global Claude Code setup

### Installation Pattern:
1. Develop/configure in this repo
2. Deploy to `~/.claude` globally
3. All Claude Code sessions use the global configs

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
- Temporary analysis: `.orchestration/temp/` then DELETE
- Evidence/logs: `.orchestration/evidence/` then CLEAN UP
- Never leave your working files scattered in the root or main directories

## THE RULE

After ANY code change:
1. Run it
2. Show output
3. Then verify

If you skip step 1, session ends.

---

_Last updated: 2025-11-12_
