#!/bin/bash

# OS 2.0 Home Directory Cleanup Script
# Removes Claude-related legacy files from ~/ that shouldn't be there

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏠 Home Directory Claude Cleanup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Target: ~/ (home directory)"
echo "Goal: Move Claude stuff to proper locations"
echo ""

# Counter for actions taken
ACTIONS=0

# Create archive structure
echo "📁 Creating archive structure..."
mkdir -p ~/.claude/.deprecated-home
echo "  ✓ Archive directory ready"

# 1. Move .claude-archive from home to inside .claude
echo ""
echo "📦 Checking for misplaced .claude-archive..."
if [ -d "$HOME/.claude-archive" ]; then
    echo "  → Found .claude-archive in home directory"
    echo "  → Moving to ~/.claude/.deprecated-home/"
    mv ~/.claude-archive ~/.claude/.deprecated-home/claude-archive
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Moved .claude-archive"
else
    echo "  • No .claude-archive in home"
fi

# 2. Move .claude-self-reflect
echo ""
echo "🤔 Checking for .claude-self-reflect..."
if [ -d "$HOME/.claude-self-reflect" ]; then
    echo "  → Found .claude-self-reflect (legacy reflection system)"
    echo "  → Moving to archive..."
    mv ~/.claude-self-reflect ~/.claude/.deprecated-home/claude-self-reflect
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Moved .claude-self-reflect"
else
    echo "  • No .claude-self-reflect found"
fi

# 3. Move .workshop from home
echo ""
echo "🔧 Checking for .workshop in home..."
if [ -d "$HOME/.workshop" ]; then
    echo "  → Found .workshop in home directory"
    echo "  → Moving to archive..."
    mv ~/.workshop ~/.claude/.deprecated-home/workshop-from-home
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Moved .workshop"
else
    echo "  • No .workshop in home"
fi

# 4. Clean up .claude.json backups
echo ""
echo "📄 Cleaning .claude.json backups..."
BACKUP_COUNT=0
for backup in ~/.claude.json.backup*; do
    if [ -f "$backup" ]; then
        if [ $BACKUP_COUNT -eq 0 ]; then
            echo "  → Found .claude.json backup files:"
            mkdir -p ~/.claude/.deprecated-home/json-backups
        fi
        echo "    • Moving: $(basename $backup)"
        mv "$backup" ~/.claude/.deprecated-home/json-backups/
        BACKUP_COUNT=$((BACKUP_COUNT + 1))
    fi
done
if [ $BACKUP_COUNT -gt 0 ]; then
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Moved $BACKUP_COUNT backup files"
else
    echo "  • No backup files found"
fi

# 5. Check for any stray Claude-related files
echo ""
echo "🔍 Checking for other Claude-related files..."

# Check for any session context files
SESSION_COUNT=0
for session in ~/.claude-session-context* ~/*session-context*; do
    if [ -f "$session" ] && [ "$session" != "$HOME/*session-context*" ]; then
        if [ $SESSION_COUNT -eq 0 ]; then
            echo "  → Found session files:"
            mkdir -p ~/.claude/.deprecated-home/session-files
        fi
        echo "    • Moving: $(basename $session)"
        mv "$session" ~/.claude/.deprecated-home/session-files/
        SESSION_COUNT=$((SESSION_COUNT + 1))
    fi
done
if [ $SESSION_COUNT -gt 0 ]; then
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Moved $SESSION_COUNT session files"
else
    echo "  • No stray session files"
fi

# Check for any .vibe folders
if [ -d "$HOME/.vibe" ]; then
    echo "  → Found .vibe folder"
    mv ~/.vibe ~/.claude/.deprecated-home/vibe
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Moved .vibe"
fi

# Check for any .orca folders
if [ -d "$HOME/.orca" ]; then
    echo "  → Found .orca folder"
    mv ~/.orca ~/.claude/.deprecated-home/orca
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Moved .orca"
fi

# 6. Verify what should remain
echo ""
echo "✅ Verifying correct structure..."
echo ""
echo "Should remain in ~/:"
echo "  • ~/.claude/         (global Claude config) ✓"
echo "  • ~/.claude.json     (MCP server config) ✓"
echo "  • ~/claude-vibe-config/  (your config repo) ✓"
echo ""

# List any remaining Claude-related items
REMAINING=$(ls -la ~/ | grep -i claude | grep -v ".claude.json$" | grep -v "^d.*\.claude$" | grep -v "claude-vibe-config" | wc -l)
if [ $REMAINING -gt 0 ]; then
    echo "⚠️  Still found some Claude-related items:"
    ls -la ~/ | grep -i claude | grep -v ".claude.json$" | grep -v "^d.*\.claude$" | grep -v "claude-vibe-config"
    echo ""
    echo "Review these manually if needed."
else
    echo "✨ No other Claude-related items in home!"
fi

# 7. Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ACTIONS -eq 0 ]; then
    echo "✨ Home directory already clean!"
else
    echo "✅ Cleanup complete - $ACTIONS actions taken"
    echo ""
    if [ -d "$HOME/.claude/.deprecated-home" ]; then
        echo "📦 Moved to ~/.claude/.deprecated-home/:"
        [ -d "$HOME/.claude/.deprecated-home/claude-archive" ] && echo "  • .claude-archive/"
        [ -d "$HOME/.claude/.deprecated-home/claude-self-reflect" ] && echo "  • .claude-self-reflect/"
        [ -d "$HOME/.claude/.deprecated-home/workshop-from-home" ] && echo "  • .workshop/"
        [ -d "$HOME/.claude/.deprecated-home/json-backups" ] && echo "  • .claude.json backups"
        [ -d "$HOME/.claude/.deprecated-home/session-files" ] && echo "  • Session context files"
        [ -d "$HOME/.claude/.deprecated-home/vibe" ] && echo "  • .vibe/"
        [ -d "$HOME/.claude/.deprecated-home/orca" ] && echo "  • .orca/"
    fi
    echo ""
    echo "🎯 Clean Home Directory Structure:"
    echo "  ~/"
    echo "  ├── .claude/            (global config)"
    echo "  ├── .claude.json        (MCP servers)"
    echo "  └── claude-vibe-config/ (your repo)"
    echo ""
    echo "Everything else has been archived!"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Exit cleanly
exit 0