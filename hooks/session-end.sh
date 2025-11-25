#!/usr/bin/env bash
# SessionEnd Hook v2 - Extract actual session content
# - Runs workshop import to extract decisions/gotchas from JSONL transcripts
# - Falls back to git status note if import fails
# - Cleans up temp files
#
# This hook captures REAL session content, not just git status

set -uo pipefail  # Don't use -e, handle errors explicitly

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT_DIR" || exit 0

# All paths under .claude/
CLAUDE_DIR=".claude"
MEMORY_DIR="$CLAUDE_DIR/memory"
TEMP_DIR="$CLAUDE_DIR/orchestration/temp"
WORKSHOP_DB="$MEMORY_DIR/workshop.db"
ERROR_LOG="$TEMP_DIR/session-end-errors.log"

# Ensure directories exist
mkdir -p "$TEMP_DIR" 2>/dev/null || true

# Clear previous error log
> "$ERROR_LOG" 2>/dev/null || true

log_error() {
  echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] ERROR: $1" >> "$ERROR_LOG"
}

log_info() {
  echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] INFO: $1" >> "$ERROR_LOG"
}

# Check if Workshop is available
if ! command -v workshop >/dev/null 2>&1; then
  echo "Workshop not installed - session not captured"
  echo "Install: pip install claude-workshop"
  exit 0
fi

# Check if Workshop is initialized
if [ ! -f "$WORKSHOP_DB" ]; then
  echo "Workshop not initialized in .claude/memory/"
  echo "Run: workshop --workspace .claude/memory init"
  exit 0
fi

# ============================================================
# PRIMARY: Import from JSONL transcripts
# ============================================================

IMPORT_SUCCESS=false
IMPORT_COUNT=0

# Run workshop import to extract actual session content
# This parses JSONL transcripts and extracts decisions, gotchas, preferences
# NOTE: No --store-raw-messages - we only want extracted insights, not every message
if workshop --workspace "$MEMORY_DIR" import --execute 2>"$ERROR_LOG"; then
  IMPORT_SUCCESS=true
  # Try to get count from import output (this is best-effort)
  IMPORT_COUNT=$(workshop --workspace "$MEMORY_DIR" import-status 2>/dev/null | grep -c "entries" || echo "?")
  log_info "Import completed successfully"
else
  log_error "Workshop import failed - see error log"
fi

# ============================================================
# FALLBACK: Record git status note if import didn't capture anything
# ============================================================

BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "no-git")
CHANGED_FILES=$(git status --short 2>/dev/null | wc -l | tr -d ' ')

# Check for recent commits (last 2 hours)
RECENT_COMMIT=""
if git log -1 --since="2 hours ago" --oneline 2>/dev/null | grep -q .; then
  RECENT_COMMIT=$(git log -1 --oneline 2>/dev/null)
fi

# Only add a git status note if we have meaningful changes
if [ "$CHANGED_FILES" -gt 0 ] || [ -n "$RECENT_COMMIT" ]; then
  SESSION_SUMMARY="Session on branch: $BRANCH"
  if [ "$CHANGED_FILES" -gt 0 ]; then
    SESSION_SUMMARY="$SESSION_SUMMARY | $CHANGED_FILES file(s) changed"
  fi
  if [ -n "$RECENT_COMMIT" ]; then
    SESSION_SUMMARY="$SESSION_SUMMARY | Commit: $RECENT_COMMIT"
  fi

  workshop --workspace "$MEMORY_DIR" note "$SESSION_SUMMARY" \
    --tags "session" "auto-captured" 2>/dev/null || true
fi

# ============================================================
# CLEANUP: Remove old temp files
# ============================================================

if [ -d "$TEMP_DIR" ]; then
  # Remove temp files older than 24 hours
  find "$TEMP_DIR" -type f -mtime +1 -delete 2>/dev/null || true
  # Remove empty directories
  find "$TEMP_DIR" -type d -empty -delete 2>/dev/null || true
fi

# Manual pruning: workshop clear "30 days ago" --type note

# ============================================================
# SUMMARY
# ============================================================

echo ""
echo "==============================================================="
echo "SESSION END"
echo "==============================================================="
echo ""
if [ "$IMPORT_SUCCESS" = true ]; then
  echo "Workshop import: extracted content from JSONL transcripts"
else
  echo "Workshop import: skipped (no new content or error)"
fi
echo "Branch: $BRANCH"
if [ "$CHANGED_FILES" -gt 0 ]; then
  echo "Changed files: $CHANGED_FILES"
fi
if [ -n "$RECENT_COMMIT" ]; then
  echo "Recent commit: $RECENT_COMMIT"
fi
echo ""
echo "Review: workshop --workspace .claude/memory recent"
echo "==============================================================="

exit 0
