# Global Hooks for Claude Code

These hooks are installed in `~/.claude/hooks/` and apply to **ALL** Claude Code sessions, regardless of project.

## Why Global Hooks?

Global hooks enable cross-project functionality like:
- **Workshop auto-initialization** - Automatically loads Workshop context in every project
- **Universal memory** - Access Workshop knowledge across all projects
- **Zero setup** - Works immediately in new projects without manual configuration

## Installation

### Automatic Installation (Recommended)

```bash
# From claude-vibe-code root
bash .claude-global-hooks/install.sh
```

This will:
1. Create `~/.claude/hooks/` directory
2. Copy `SessionStart.sh` and `SessionEnd.sh` to `~/.claude/hooks/`
3. Make them executable
4. Verify Workshop CLI is installed

### Manual Installation

```bash
# Create global hooks directory
mkdir -p ~/.claude/hooks

# Copy hooks
cp .claude-global-hooks/SessionStart.sh ~/.claude/hooks/SessionStart.sh
cp .claude-global-hooks/SessionEnd.sh ~/.claude/hooks/SessionEnd.sh

# Make executable
chmod +x ~/.claude/hooks/SessionStart.sh
chmod +x ~/.claude/hooks/SessionEnd.sh
```

## What Each Hook Does

### SessionStart.sh

**Purpose:** Auto-loads Workshop context at the start of every Claude Code session

**How it works:**
1. Checks if Workshop CLI is installed
2. If Workshop not initialized (supports new `.claude-work/memory/workshop.db` or legacy `.workshop/`) → auto-runs `workshop init`
3. Performs a quiet catch-up import of any missed transcripts: `workshop import --execute`
4. Loads Workshop context and displays it as JSON for Claude to parse

**Why this fixes the Workshop problem:**

Before this fix:
- Global SessionStart hook had `exit 0` when `.workshop` didn't exist
- Workshop would **silently fail** in all new projects
- Users would never know Workshop wasn't working

After this fix:
- Hook **auto-initializes** Workshop in new projects
- Workshop works immediately without manual setup
- Users get Workshop context in every session

**Failure transparency:**
- If Workshop CLI is missing → emits a structured JSON message: "Workshop Not Installed" with next steps.
- If initialization fails → emits a structured JSON message: "Workshop Init Failed" including truncated init output and remediation steps.
- No more silent success; you always see what happened.

**Crash recovery (catch-up import):**
- If a previous session ended unexpectedly and SessionEnd didn’t run, the next SessionStart runs a quiet `workshop import --execute` to catch up.
- This keeps `.workshop/workshop.db` current even after crashes or abrupt closes.

### SessionEnd.sh

**Purpose:** Auto-imports new sessions into Workshop when each Claude Code session ends

**How it works:**
1. Checks if Workshop CLI is installed
2. If `.workshop/` exists in current project → runs `workshop import --execute`
3. Silently imports any new JSONL session transcripts from Claude Code

**Why this is needed:**

Workshop stores knowledge from sessions, but it needs to import from Claude Code's JSONL transcripts. Without this hook:
- Sessions wouldn't be captured automatically
- Users would need to manually run `workshop import` after every session
- Workshop knowledge would become stale

With this hook:
- Sessions are **automatically imported** when they end
- Workshop always has latest context from all projects
- Zero manual intervention required

## Verifying Installation

After installation, start a new Claude Code session in ANY project and you should see:

```
📝 Workshop Context Available
```

If you don't see this:
1. Check hooks exist: `ls -la ~/.claude/hooks/Session*.sh`
2. Check they're executable: `test -x ~/.claude/hooks/SessionStart.sh && echo "SessionStart: executable" || echo "SessionStart: not executable"`
3. Check Workshop is installed: `workshop --version`

After ending a session, verify automatic import works:
```bash
workshop sessions  # Should show recently captured sessions
```

## Updating Global Hooks

When the global hooks are updated in claude-vibe-code:

```bash
# From claude-vibe-code root
bash .claude-global-hooks/install.sh
```

This will overwrite your existing global hooks with the latest version.

## Uninstalling

To remove global hooks:

```bash
rm ~/.claude/hooks/SessionStart.sh
rm ~/.claude/hooks/SessionEnd.sh
```

Note: This will disable Workshop auto-loading and auto-import in all projects.
