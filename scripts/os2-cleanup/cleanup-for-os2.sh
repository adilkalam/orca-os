#!/bin/bash

# OS 2.2 Project Cleanup Script
# Run this in any project directory to clean up pre-OS2 structures

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧹 OS 2.2 Project Cleanup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Project: $(pwd)"
echo ""

# Counter for actions taken
ACTIONS=0

# 1. Create archive structure
echo "📁 Creating archive structure..."
mkdir -p .deprecated/pre-os2
echo "  ✓ Archive directory ready"

# 2. Move old Claude folders
echo "🔍 Checking for legacy folders..."

if [ -d ".claude-work" ]; then
    echo "  → Found .claude-work - moving to archive"
    mv .claude-work .deprecated/pre-os2/claude-work
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Moved .claude-work"
else
    echo "  • No .claude-work folder found"
fi

if [ -d ".workshop" ]; then
    echo "  → Found .workshop - moving to archive"
    mv .workshop .deprecated/pre-os2/workshop
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Moved .workshop"
else
    echo "  • No .workshop folder found"
fi

if [ -d ".claude.bak" ]; then
    echo "  → Found .claude.bak - moving to archive"
    mv .claude.bak .deprecated/pre-os2/claude.bak
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Moved .claude.bak"
else
    echo "  • No .claude.bak folder found"
fi

# Check for other legacy folders
if [ -d ".vibe" ]; then
    echo "  → Found .vibe - moving to archive"
    mv .vibe .deprecated/pre-os2/vibe
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Moved .vibe"
else
    echo "  • No .vibe folder found"
fi

if [ -d ".claude-sessions" ]; then
    echo "  → Found .claude-sessions - moving to archive"
    mv .claude-sessions .deprecated/pre-os2/claude-sessions
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Moved .claude-sessions"
else
    echo "  • No .claude-sessions folder found"
fi

# 3. Clean .claude folder if it exists
if [ -d ".claude" ]; then
    echo ""
    echo "📂 Cleaning .claude folder..."

    # Archive old orchestration evidence
    if [ -d ".claude/orchestration/evidence" ]; then
        echo "  → Found .claude/orchestration/evidence - moving to archive"
        mkdir -p .deprecated/pre-os2
        mv .claude/orchestration/evidence .deprecated/pre-os2/orchestration-evidence
        ACTIONS=$((ACTIONS + 1))
        echo "  ✓ Moved orchestration/evidence"
    else
        echo "  • No orchestration/evidence folder found"
    fi

    # Clean temp files
    if [ -d ".claude/orchestration/temp" ]; then
        if [ "$(ls -A .claude/orchestration/temp 2>/dev/null)" ]; then
            echo "  → Found temp files - cleaning"
            rm -rf .claude/orchestration/temp/*
            ACTIONS=$((ACTIONS + 1))
            echo "  ✓ Cleaned temp files"
        else
            echo "  • Temp folder is already clean"
        fi
    else
        echo "  • No orchestration/temp folder found"
    fi

    # Archive old memory/playbooks
    if [ -d ".claude/memory/playbooks" ]; then
        echo "  → Found .claude/memory/playbooks - moving to archive"
        mkdir -p .deprecated/pre-os2
        mv .claude/memory/playbooks .deprecated/pre-os2/memory-playbooks
        ACTIONS=$((ACTIONS + 1))
        echo "  ✓ Moved memory/playbooks"
    else
        echo "  • No memory/playbooks folder found"
    fi

    # Archive old memory database files
    if [ -d ".claude/memory" ]; then
        MEMORY_FILES_MOVED=0
        for file in .claude/memory/*.db .claude/memory/*.jsonl; do
            if [ -f "$file" ]; then
                if [ $MEMORY_FILES_MOVED -eq 0 ]; then
                    echo "  → Found memory database files - moving to archive"
                    mkdir -p .deprecated/pre-os2/memory-files
                fi
                echo "    • Moving: $(basename $file)"
                mv "$file" .deprecated/pre-os2/memory-files/
                MEMORY_FILES_MOVED=$((MEMORY_FILES_MOVED + 1))
            fi
        done
        if [ $MEMORY_FILES_MOVED -gt 0 ]; then
            ACTIONS=$((ACTIONS + 1))
            echo "  ✓ Moved $MEMORY_FILES_MOVED memory files"
        else
            echo "  • No memory database files found"
        fi
    fi
else
    echo ""
    echo "📂 No .claude folder found - skipping internal cleanup"
fi

# 4. Remove old session contexts
echo ""
echo "🗑️  Checking for old session backups..."
BACKUPS_FOUND=0
for file in .claude-session-context.md.backup* .session-context-*.md; do
    if [ -f "$file" ]; then
        rm -f "$file"
        BACKUPS_FOUND=$((BACKUPS_FOUND + 1))
        echo "  • Removed: $file"
    fi
done
if [ $BACKUPS_FOUND -gt 0 ]; then
    ACTIONS=$((ACTIONS + 1))
    echo "  ✓ Removed $BACKUPS_FOUND backup files"
else
    echo "  • No backup files found"
fi

# 5. Update .gitignore if needed
echo ""
echo "📝 Checking .gitignore..."
if [ -f ".gitignore" ]; then
    if ! grep -q "^\.deprecated" .gitignore 2>/dev/null; then
        echo "  → Adding .deprecated/ to .gitignore"
        echo -e "\n# OS 2.2 Cleanup\n.deprecated/" >> .gitignore
        ACTIONS=$((ACTIONS + 1))
        echo "  ✓ Updated .gitignore"
    else
        echo "  • .gitignore already contains .deprecated/"
    fi
else
    echo "  • No .gitignore file found"
fi

# 6. Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ACTIONS -eq 0 ]; then
    echo "✨ Project already clean - no changes needed!"
else
    echo "✅ Cleanup complete - $ACTIONS actions taken"
    echo ""
    if [ -d ".deprecated/pre-os2" ]; then
        echo "📦 Archived in .deprecated/pre-os2/:"
        [ -d ".deprecated/pre-os2/claude-work" ] && echo "  • .claude-work/"
        [ -d ".deprecated/pre-os2/workshop" ] && echo "  • .workshop/"
        [ -d ".deprecated/pre-os2/orchestration-evidence" ] && echo "  • .claude/orchestration/evidence/"
        [ -d ".deprecated/pre-os2/memory-playbooks" ] && echo "  • .claude/memory/playbooks/"
        [ -d ".deprecated/pre-os2/memory-files" ] && echo "  • Memory database files"
        [ -d ".deprecated/pre-os2/vibe" ] && echo "  • .vibe/"
        [ -d ".deprecated/pre-os2/claude-sessions" ] && echo "  • .claude-sessions/"
    fi
    echo ""
    echo "Next steps:"
    echo "  1. Run: git status"
    echo "  2. Review changes"
    echo "  3. Commit: git add -A && git commit -m \"Clean up for OS 2.2\""
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Exit cleanly
exit 0