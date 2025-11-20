#!/bin/bash

# OS 2.0 Global ~/.claude Cleanup Script
# Removes legacy v1 systems and archives old content

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧹 OS 2.0 Global ~/.claude Cleanup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Target: ~/.claude (global)"
echo ""

# Counter for actions taken
ACTIONS=0

# Create archive structure
echo "📁 Creating archive structure..."
mkdir -p ~/.claude/.deprecated-os1
echo "  ✓ Archive directory ready"

# 1. Move the nested .claude/.claude folder (MAJOR ISSUE)
echo ""
echo "🔴 Checking for nested .claude/.claude folder..."
if [ -d "$HOME/.claude/.claude" ]; then
    echo "  → Found nested .claude/.claude - THIS SHOULDN'T EXIST!"
    echo "  → Moving to archive..."
    mv ~/.claude/.claude ~/.claude/.deprecated-os1/nested-claude-folder
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Moved nested .claude folder"
else
    echo "  • No nested .claude folder found (good!)"
fi

# 2. Handle .claude-archive folder
echo ""
echo "📦 Checking .claude-archive folder..."
if [ -d "$HOME/.claude/.claude-archive" ]; then
    echo "  → Found .claude-archive - moving to deprecated"
    mv ~/.claude/.claude-archive ~/.claude/.deprecated-os1/claude-archive
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Moved .claude-archive"
else
    echo "  • No .claude-archive folder found"
fi

# 3. Clean up orchestration folder (keep only current phase configs)
echo ""
echo "📂 Cleaning orchestration folder..."
if [ -d "$HOME/.claude/orchestration" ]; then
    # Move old verification folder
    if [ -d "$HOME/.claude/orchestration/verification" ]; then
        echo "  → Found orchestration/verification - moving to archive"
        mkdir -p ~/.claude/.deprecated-os1/orchestration
        mv ~/.claude/orchestration/verification ~/.claude/.deprecated-os1/orchestration/
        ACTIONS=$((ACTIONS + 1))
        echo "  ✓ Moved verification folder"
    fi

    # Remove session-context.md if it exists
    if [ -f "$HOME/.claude/orchestration/session-context.md" ]; then
        echo "  → Removing old session-context.md"
        rm ~/.claude/orchestration/session-context.md
        ACTIONS=$((ACTIONS + 1))
        echo "  ✓ Removed session-context.md"
    fi
else
    echo "  • No orchestration folder cleanup needed"
fi

# 4. Clean up legacy scripts
echo ""
echo "📜 Cleaning scripts folder..."
if [ -d "$HOME/.claude/scripts" ]; then
    echo "  → Archiving legacy scripts..."
    mkdir -p ~/.claude/.deprecated-os1/scripts

    # List of scripts to archive (v1/legacy)
    LEGACY_SCRIPTS=(
        "migrate-to-claude-work.sh"
        "install-ace-playbooks.sh"
        "orchestrator_firewall.sh"
        "port-to-codex-cli.sh"
        "prepare-codex-cli-package.sh"
        "seo_auto_pipeline.py"
        "cleanup-daemon.ts.backup"
        "design-system-viewer.sh"
        "design-tweak.sh"
        "finalize.sh"
        "safe-archive.sh"
        "verification-mode.sh"
    )

    SCRIPTS_MOVED=0
    for script in "${LEGACY_SCRIPTS[@]}"; do
        if [ -f "$HOME/.claude/scripts/$script" ]; then
            mv "$HOME/.claude/scripts/$script" ~/.claude/.deprecated-os1/scripts/
            SCRIPTS_MOVED=$((SCRIPTS_MOVED + 1))
            echo "    • Archived: $script"
        fi
    done

    if [ $SCRIPTS_MOVED -gt 0 ]; then
        ACTIONS=$((ACTIONS + 1))
        echo "  ✓ Archived $SCRIPTS_MOVED legacy scripts"
    else
        echo "  • No legacy scripts found"
    fi
fi

# 5. Clean up hooks folder
echo ""
echo "🪝 Cleaning hooks folder..."
if [ -d "$HOME/.claude/hooks" ]; then
    # Archive old hooks
    if [ -f "$HOME/.claude/hooks/orchestrator-firewall.sh" ]; then
        echo "  → Archiving orchestrator-firewall.sh"
        mkdir -p ~/.claude/.deprecated-os1/hooks
        mv ~/.claude/hooks/orchestrator-firewall.sh ~/.claude/.deprecated-os1/hooks/
        ACTIONS=$((ACTIONS + 1))
        echo "  ✓ Archived legacy hook"
    fi

    # Remove backup files
    if [ -f "$HOME/.claude/hooks/pre-commit.backup" ]; then
        echo "  → Removing pre-commit.backup"
        rm ~/.claude/hooks/pre-commit.backup
        ACTIONS=$((ACTIONS + 1))
        echo "  ✓ Removed backup file"
    fi
else
    echo "  • No hooks cleanup needed"
fi

# 6. Clean up old database files
echo ""
echo "💾 Checking for old database files..."
OLD_DBS=$(find ~/.claude -name "workshop.db" -o -name "vibe.db" -o -name "memory.db" 2>/dev/null | wc -l)
if [ $OLD_DBS -gt 0 ]; then
    echo "  → Found $OLD_DBS old database files"
    mkdir -p ~/.claude/.deprecated-os1/databases
    find ~/.claude -name "workshop.db" -o -name "vibe.db" -o -name "memory.db" 2>/dev/null | while read db; do
        echo "    • Moving: $(basename $db)"
        mv "$db" ~/.claude/.deprecated-os1/databases/
    done
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Moved old database files"
else
    echo "  • No old database files found"
fi

# 7. Clean up unnecessary folders
echo ""
echo "🗑️  Checking for unnecessary folders..."
FOLDERS_TO_REMOVE=(
    "lib"
    "plans"
    "debug"
    "statsig"
    "session-env"
    "shell-snapshots"
    "git-hooks"
)

for folder in "${FOLDERS_TO_REMOVE[@]}"; do
    if [ -d "$HOME/.claude/$folder" ]; then
        echo "  → Moving $folder to archive"
        mv "$HOME/.claude/$folder" ~/.claude/.deprecated-os1/
        ACTIONS=$((ACTIONS + 1))
        echo "  ✓ Moved $folder"
    fi
done

# 8. Clean up old files in root
echo ""
echo "📄 Checking for old files..."
if [ -f "$HOME/.claude/agentfeedback-validation-schema.yml" ]; then
    echo "  → Archiving agentfeedback-validation-schema.yml"
    mv ~/.claude/agentfeedback-validation-schema.yml ~/.claude/.deprecated-os1/
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Archived validation schema"
fi

if [ -f "$HOME/.claude/CLAUDE.md.project" ]; then
    echo "  → Removing CLAUDE.md.project"
    rm ~/.claude/CLAUDE.md.project
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Removed project file"
fi

# 9. Create docs structure for OS 2.0 if needed
echo ""
echo "📚 Setting up OS 2.0 structure..."
if [ ! -d "$HOME/.claude/docs/reference/phase-configs" ]; then
    echo "  → Creating docs/reference/phase-configs directory"
    mkdir -p ~/.claude/docs/reference/phase-configs
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Created phase-configs directory"
else
    echo "  • Phase-configs directory already exists"
fi

# 10. Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ACTIONS -eq 0 ]; then
    echo "✨ Global ~/.claude already clean!"
else
    echo "✅ Cleanup complete - $ACTIONS actions taken"
    echo ""
    echo "📦 Archived in ~/.claude/.deprecated-os1/:"
    [ -d "$HOME/.claude/.deprecated-os1/nested-claude-folder" ] && echo "  • Nested .claude/.claude folder (MAJOR FIX)"
    [ -d "$HOME/.claude/.deprecated-os1/claude-archive" ] && echo "  • .claude-archive folder"
    [ -d "$HOME/.claude/.deprecated-os1/orchestration" ] && echo "  • Old orchestration files"
    [ -d "$HOME/.claude/.deprecated-os1/scripts" ] && echo "  • Legacy scripts"
    [ -d "$HOME/.claude/.deprecated-os1/hooks" ] && echo "  • Old hooks"
    [ -d "$HOME/.claude/.deprecated-os1/databases" ] && echo "  • Old database files"
    [ -d "$HOME/.claude/.deprecated-os1/lib" ] && echo "  • lib folder"
    [ -d "$HOME/.claude/.deprecated-os1/plans" ] && echo "  • plans folder"
    [ -d "$HOME/.claude/.deprecated-os1/debug" ] && echo "  • debug folder"

    echo ""
    echo "🎯 Current OS 2.0 Structure:"
    echo "  ~/.claude/"
    echo "    ├── agents/       (OS 2.0 agents)"
    echo "    ├── commands/     (orca, seo-orca, etc.)"
    echo "    ├── mcp/          (project-context-server)"
    echo "    ├── skills/       (current skills)"
    echo "    ├── hooks/        (cleaned)"
    echo "    ├── scripts/      (cleaned)"
    echo "    └── docs/         (OS 2.0 reference)"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Exit cleanly
exit 0