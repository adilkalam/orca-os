#!/bin/bash

# Session Chaos Check - Runs at session end to warn about mess
# Integrate with SessionEnd hook

SESSION_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
SESSION_TIME="${CLAUDE_SESSION_TIME:-$(date +%Y%m%d-%H%M%S)}"

# Count files created/modified in this session (approximate by last 2 hours)
RECENT_FILES=$(find "$SESSION_DIR" -type f -mmin -120 2>/dev/null | grep -v -E '(node_modules|.git|.next|dist|build|\.workshop)' || true)
FILE_COUNT=$(echo "$RECENT_FILES" | grep -c . || echo "0")

# Only show warning if there's actual mess
if [[ $FILE_COUNT -gt 15 ]]; then
    echo ""
    echo "🚨 Session Chaos Report"
    echo "━━━━━━━━━━━━━━━━━━━━━"
    echo "Files created/modified: $FILE_COUNT"

    # Check for planning docs
    PLANNING_COUNT=$(echo "$RECENT_FILES" | grep -E "(PLAN|IMPLEMENTATION|VERIFICATION|TODO|CHECKLIST)" | wc -l || echo "0")
    if [[ $PLANNING_COUNT -gt 0 ]]; then
        echo "⚠️  Planning documents created: $PLANNING_COUNT"
    fi

    # Check for backups
    BACKUP_COUNT=$(echo "$RECENT_FILES" | grep -E "\.(bak|backup|tmp|old)$" | wc -l || echo "0")
    if [[ $BACKUP_COUNT -gt 0 ]]; then
        echo "⚠️  Backup/temp files left: $BACKUP_COUNT"
    fi

    echo ""
    echo "💡 Run 'chaos-cleanup' to clean up"
    echo "━━━━━━━━━━━━━━━━━━━━━"
fi

# Save session stats for tracking patterns
echo "$(date +%Y-%m-%d-%H:%M:%S) | Files: $FILE_COUNT | Planning: $PLANNING_COUNT | Backups: $BACKUP_COUNT | Dir: $SESSION_DIR" >> ~/.claude/chaos-stats.log

exit 0