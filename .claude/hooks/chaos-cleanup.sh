#!/bin/bash

# Chaos Cleanup - Removes common mess patterns
# Run manually when chaos-monitor detects issues

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"

echo "🧹 Chaos Cleanup - Interactive mess removal"
echo ""

# Function to ask for confirmation
confirm() {
    read -p "$1 [y/N] " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

# 1. Planning documents
PLANNING_DOCS=$(find "$PROJECT_DIR" -type f \( -name "*PLAN*.md" -o -name "*plan-*.md" -o -name "*IMPLEMENTATION*.md" -o -name "*implementation-*.md" -o -name "*VERIFICATION*.md" -o -name "*unified-*.md" -o -name "*CHECKLIST*.md" \) 2>/dev/null | grep -v node_modules || true)

if [[ -n "$PLANNING_DOCS" ]]; then
    echo "📝 Found planning documents:"
    echo "$PLANNING_DOCS" | sed 's/^/   /'
    if confirm "Delete all planning documents?"; then
        echo "$PLANNING_DOCS" | xargs rm -f
        echo "   ✅ Deleted planning documents"
    fi
    echo ""
fi

# 2. Backup files
BACKUP_FILES=$(find "$PROJECT_DIR" \( -name "*.backup*" -o -name "*.bak" -o -name "*-old" -o -name "*-copy" -o -name "*.tmp" \) -type f 2>/dev/null | grep -v node_modules || true)

if [[ -n "$BACKUP_FILES" ]]; then
    echo "💾 Found backup/temp files:"
    echo "$BACKUP_FILES" | head -20 | sed 's/^/   /'
    BACKUP_COUNT=$(echo "$BACKUP_FILES" | wc -l)
    if [[ $BACKUP_COUNT -gt 20 ]]; then
        echo "   ... and $((BACKUP_COUNT - 20)) more"
    fi
    if confirm "Delete all backup/temp files?"; then
        echo "$BACKUP_FILES" | xargs rm -f
        echo "   ✅ Deleted $BACKUP_COUNT backup/temp files"
    fi
    echo ""
fi

# 3. Empty directories
EMPTY_DIRS=$(find "$PROJECT_DIR" -type d -empty 2>/dev/null | grep -v -E '(node_modules|.git)' || true)

if [[ -n "$EMPTY_DIRS" ]]; then
    EMPTY_COUNT=$(echo "$EMPTY_DIRS" | wc -l)
    echo "📁 Found $EMPTY_COUNT empty directories"
    if confirm "Delete all empty directories?"; then
        echo "$EMPTY_DIRS" | xargs rmdir 2>/dev/null || true
        echo "   ✅ Deleted empty directories"
    fi
    echo ""
fi

# 4. Experimental directories
EXPERIMENTAL_DIRS=$(find "$PROJECT_DIR" -type d \( -name "*experimental*" -o -name "*proof-of-concept*" -o -name "*test-framework*" -o -name "*verification-system*" \) 2>/dev/null | head -10)

if [[ -n "$EXPERIMENTAL_DIRS" ]]; then
    echo "🧪 Found experimental directories:"
    echo "$EXPERIMENTAL_DIRS" | sed 's/^/   /'
    if confirm "Delete these experimental directories?"; then
        echo "$EXPERIMENTAL_DIRS" | xargs rm -rf
        echo "   ✅ Deleted experimental directories"
    fi
    echo ""
fi

# 5. Check for project files in global ~/.claude (if not in global dir)
if [[ "$PROJECT_DIR" != "$HOME/.claude" ]]; then
    # Look for recently modified files that might be project-specific
    GLOBAL_PROJECT_FILES=$(find ~/.claude -type f -mtime -1 \( -name "*.md" -o -name "*.json" -o -name "*.yaml" \) 2>/dev/null | grep -v -E '(CLAUDE.md|README.md|QUICK_REFERENCE.md|settings.json|history.jsonl|todos|debug|projects|session-env)' || true)

    if [[ -n "$GLOBAL_PROJECT_FILES" ]]; then
        echo "🚨 Found possible project files in global ~/.claude:"
        echo "$GLOBAL_PROJECT_FILES" | sed 's/^/   /'
        echo "⚠️  Review these carefully - they might be legitimate global files"
        if confirm "Delete these files from global directory?"; then
            echo "$GLOBAL_PROJECT_FILES" | xargs rm -f
            echo "   ✅ Deleted project files from global directory"
        fi
        echo ""
    fi
fi

# 6. Large log files
LARGE_LOGS=$(find "$PROJECT_DIR" -name "*.log" -size +10M 2>/dev/null || true)

if [[ -n "$LARGE_LOGS" ]]; then
    echo "📊 Found large log files (>10MB):"
    echo "$LARGE_LOGS" | sed 's/^/   /'
    if confirm "Delete large log files?"; then
        echo "$LARGE_LOGS" | xargs rm -f
        echo "   ✅ Deleted large log files"
    fi
    echo ""
fi

# Summary
echo "✨ Cleanup complete!"
echo ""
echo "Tips to avoid future chaos:"
echo "  - Don't create planning documents, just do the work"
echo "  - Delete temp files immediately after use"
echo "  - Keep project files in project directories"
echo "  - Use existing tools instead of building new ones"
echo "  - Run 'chaos-monitor' periodically to check for mess"