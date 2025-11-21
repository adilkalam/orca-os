#!/usr/bin/env bash
set -euo pipefail

# SessionStart Hook
# - Loads session context FROM Workshop (source of truth)
# - Displays CLAUDE.md instructions
# - Output: .claude/orchestration/temp/session-context.md

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT_DIR"

ORCH_DIR=".claude/orchestration"
TEMP_DIR="$ORCH_DIR/temp"
OUT_MD="$TEMP_DIR/session-context.md"
DB_PATH=".claude/workshop/workshop.db"

mkdir -p "$ORCH_DIR" "$TEMP_DIR"

ts() { date -u '+%Y-%m-%dT%H:%M:%SZ'; }

# Native memory status (CLAUDE.md)
NATIVE_PATH=""
if [ -f "CLAUDE.md" ]; then
  NATIVE_PATH="CLAUDE.md"
elif [ -f ".claude/CLAUDE.md" ]; then
  NATIVE_PATH=".claude/CLAUDE.md"
fi

NATIVE_NOTE="missing"
if [ -n "$NATIVE_PATH" ]; then
  NATIVE_NOTE="$(wc -l < "$NATIVE_PATH" | tr -d ' ') lines"
fi

# Load context from Workshop (source of truth)
WORKSHOP_CONTEXT=""
if [ -f "$DB_PATH" ] && command -v workshop >/dev/null 2>&1; then
  WORKSHOP_CONTEXT=$(workshop context 2>/dev/null || echo "Workshop available but no context yet")
else
  WORKSHOP_CONTEXT="Workshop not initialized - run: workshop init"
fi

# Generate session context from Workshop
{
  echo "# Session Context"
  echo
  echo "- Timestamp: $(ts)"
  echo "- Native Memory: ${NATIVE_PATH:-none} (${NATIVE_NOTE})"
  echo
  echo "## Workshop Context (Source of Truth)"
  echo
  echo "$WORKSHOP_CONTEXT"
  echo
} > "$OUT_MD"

echo "SessionStart context written: $OUT_MD"

# Output CLAUDE.md contents so Claude actually reads and follows instructions
if [ -n "$NATIVE_PATH" ]; then
  echo ""
  echo "═══════════════════════════════════════════════════════════"
  echo "PROJECT INSTRUCTIONS (CLAUDE.md) - FOLLOW THESE THROUGHOUT SESSION"
  echo "═══════════════════════════════════════════════════════════"
  echo ""
  cat "$NATIVE_PATH"
  echo ""
  echo "═══════════════════════════════════════════════════════════"
  echo "END OF PROJECT INSTRUCTIONS - THESE MUST BE FOLLOWED"
  echo "═══════════════════════════════════════════════════════════"
fi
