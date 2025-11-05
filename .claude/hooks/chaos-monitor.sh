#!/bin/bash

# Chaos Monitor - Detects and warns about messy file creation patterns
# Can be run manually or from hooks to check session behavior

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
SESSION_ID="${CLAUDE_SESSION_ID:-$(date +%Y%m%d-%H%M%S)}"

echo "🔍 Chaos Monitor - Checking for messy patterns..."

# Check 1: Files created in last hour
RECENT_FILES=$(find "$PROJECT_DIR" -type f -mmin -60 2>/dev/null | grep -v -E '(node_modules|.git|.next|dist|build)' || true)
FILE_COUNT=$(echo "$RECENT_FILES" | grep -c . || echo "0")

if [[ $FILE_COUNT -gt 20 ]]; then
    echo "⚠️  HIGH FILE CREATION: $FILE_COUNT files created/modified in last hour"
    echo "   Remember: You created 94,000 files last time"
fi

# Check 2: Planning document detection
PLANNING_DOCS=$(echo "$RECENT_FILES" | grep -E "(PLAN|plan-|IMPLEMENTATION|implementation-|VERIFICATION|unified-|TODO|CHECKLIST)" || true)
if [[ -n "$PLANNING_DOCS" ]]; then
    echo "⚠️  PLANNING DOCUMENTS DETECTED:"
    echo "$PLANNING_DOCS" | sed 's/^/   - /'
    echo "   Stop planning, start doing!"
fi

# Check 3: Detect experimental directories
EXPERIMENTAL_DIRS=$(find "$PROJECT_DIR" -type d -name "*experimental*" -o -name "*proof-of-concept*" -o -name "*test-framework*" 2>/dev/null | head -5)
if [[ -n "$EXPERIMENTAL_DIRS" ]]; then
    echo "⚠️  EXPERIMENTAL SYSTEMS DETECTED:"
    echo "$EXPERIMENTAL_DIRS" | sed 's/^/   - /'
    echo "   Use existing tools instead!"
fi

# Check 4: Check for files in wrong locations
if [[ "$PROJECT_DIR" != "$HOME/.claude" ]]; then
    GLOBAL_POLLUTION=$(find ~/.claude -type f -mmin -60 2>/dev/null | grep -v -E '(history.jsonl|todos|debug|projects|session-env|statsig|shell-snapshots)' || true)
    if [[ -n "$GLOBAL_POLLUTION" ]]; then
        echo "🚨 GLOBAL DIRECTORY POLLUTION:"
        echo "$GLOBAL_POLLUTION" | sed 's/^/   - /'
        echo "   Project files don't belong in ~/.claude!"
    fi
fi

# Check 5: Backup accumulation
BACKUP_FILES=$(find "$PROJECT_DIR" -name "*.backup*" -o -name "*.bak" -o -name "*-old" -o -name "*-copy" 2>/dev/null | head -10)
if [[ -n "$BACKUP_FILES" ]]; then
    BACKUP_COUNT=$(echo "$BACKUP_FILES" | wc -l)
    echo "⚠️  BACKUP ACCUMULATION: $BACKUP_COUNT backup files found"
    echo "   Clean these up!"
fi

# Check 6: Deep nesting warning
DEEP_PATHS=$(find "$PROJECT_DIR" -type d -mindepth 6 2>/dev/null | grep -v -E '(node_modules|.git)' | head -5)
if [[ -n "$DEEP_PATHS" ]]; then
    echo "⚠️  DEEP DIRECTORY NESTING:"
    echo "$DEEP_PATHS" | sed 's/^/   - /'
    echo "   Overcomplicating the structure?"
fi

# Summary
if [[ $FILE_COUNT -lt 10 ]] && [[ -z "$PLANNING_DOCS" ]] && [[ -z "$EXPERIMENTAL_DIRS" ]] && [[ -z "$GLOBAL_POLLUTION" ]]; then
    echo "✅ Session looks clean - no chaos detected"
else
    echo ""
    echo "📊 Chaos Score: "
    if [[ $FILE_COUNT -gt 50 ]]; then
        echo "   🔥🔥🔥 EXTREME - You're recreating the 94,000 file disaster"
    elif [[ $FILE_COUNT -gt 30 ]]; then
        echo "   🔥🔥 HIGH - Slow down and focus"
    elif [[ $FILE_COUNT -gt 15 ]]; then
        echo "   🔥 MODERATE - Getting messy"
    else
        echo "   ✓ LOW - Acceptable"
    fi
fi

echo "---"
echo "Run 'chaos-cleanup' to clean up detected issues"