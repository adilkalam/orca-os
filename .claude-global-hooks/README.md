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
2. Copy `SessionStart.sh` to `~/.claude/hooks/SessionStart.sh`
3. Make it executable
4. Verify Workshop CLI is installed

### Manual Installation

```bash
# Create global hooks directory
mkdir -p ~/.claude/hooks

# Copy SessionStart hook
cp .claude-global-hooks/SessionStart.sh ~/.claude/hooks/SessionStart.sh

# Make executable
chmod +x ~/.claude/hooks/SessionStart.sh
```

## What Each Hook Does

### SessionStart.sh

**Purpose:** Auto-loads Workshop context at the start of every Claude Code session

**How it works:**
1. Checks if Workshop CLI is installed
2. If `.workshop/` doesn't exist in current project → auto-runs `workshop init`
3. Loads Workshop context and displays it as JSON for Claude to parse

**Why this fixes the Workshop problem:**

Before this fix:
- Global SessionStart hook had `exit 0` when `.workshop` didn't exist
- Workshop would **silently fail** in all new projects
- Users would never know Workshop wasn't working

After this fix:
- Hook **auto-initializes** Workshop in new projects
- Workshop works immediately without manual setup
- Users get Workshop context in every session

## Verifying Installation

After installation, start a new Claude Code session in ANY project and you should see:

```
📝 Workshop Context Available
```

If you don't see this:
1. Check hook exists: `ls -la ~/.claude/hooks/SessionStart.sh`
2. Check it's executable: `test -x ~/.claude/hooks/SessionStart.sh && echo "executable" || echo "not executable"`
3. Check Workshop is installed: `workshop --version`

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
```

Note: This will disable Workshop auto-loading in all projects.
