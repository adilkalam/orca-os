#!/usr/bin/env bash
set -euo pipefail

# SessionStart Hook
# - Generates a lightweight session context for Claude Code to import
# - Summarizes native memory, local memory DB, design guard, atlas, and recent changes
# - Output: .claude/orchestration/temp/session-context.md

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT_DIR"

ORCH_DIR=".claude/orchestration/temp"
VER_DIR=".claude/orchestration/verification"
OUT_MD="$ORCH_DIR/session-context.md"
DB_PATH=".claude/workshop/workshop.db"

mkdir -p "$ORCH_DIR" "$VER_DIR"

ts() { date -u '+%Y-%m-%dT%H:%M:%SZ'; }

file_size() {
  if stat -f %z "$1" >/dev/null 2>&1; then stat -f %z "$1"; else stat -c %s "$1"; fi
}

file_mtime() {
  if stat -f %m "$1" >/dev/null 2>&1; then stat -f %m "$1"; else stat -c %Y "$1"; fi
}

bytes_human() {
  local b=${1:-0}
  local d=''
  local s=0
  local S=(B KB MB GB TB)
  while ((b > 1024 && s < ${#S[@]}-1)); do b=$((b/1024)); s=$((s+1)); done
  echo "$b ${S[$s]}"
}

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

# Local memory DB status
MEM_NOTE="(no DB)"
MEM_FILES="0"
MEM_ROWS="0"
if [ -f "$DB_PATH" ] && command -v sqlite3 >/dev/null 2>&1; then
  size=$(file_size "$DB_PATH")
  MEM_NOTE="$(bytes_human "$size")"
  MEM_FILES=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM memory_files;" 2>/dev/null || echo 0)
  MEM_ROWS=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM memory_fts;" 2>/dev/null || echo 0)
fi

# Design Guard summary
DG_MODE="-"
DG_VIOLATIONS="-"
if [ -f "$VER_DIR/design-guard-summary.json" ]; then
  DG_MODE=$(sed -n 's/.*"mode"\s*:\s*"\([^"]*\)".*/\1/p' "$VER_DIR/design-guard-summary.json" | head -1 || true)
  DG_VIOLATIONS=$(sed -n 's/.*"violations"\s*:\s*\([0-9][0-9]*\).*/\1/p' "$VER_DIR/design-guard-summary.json" | head -1 || true)
fi

# Atlas presence
ATLAS_NOTE="missing"
[ -f docs/design-atlas.md ] && ATLAS_NOTE="present"

# Recent uncommitted changes (short)
RECENT_CHANGES=$(git status --porcelain 2>/dev/null | head -20 || true)

# Recent implementation log tags (short)
IMPL_LOG="$ORCH_DIR/implementation-log.md"
IMPL_SNIPPET=""
if [ -f "$IMPL_LOG" ]; then
  IMPL_SNIPPET=$(grep -E "^#(FILE_CREATED|FILE_MODIFIED|PATH_DECISION|SCREENSHOT_CLAIMED):" "$IMPL_LOG" | tail -8 || true)
fi

{
  echo "# Session Context"
  echo
  echo "- Timestamp: $(ts)"
  echo "- Native Memory: ${NATIVE_PATH:-none} (${NATIVE_NOTE})"
  if [ -f "$DB_PATH" ]; then
    echo "- Local Memory DB: $DB_PATH (${MEM_NOTE}); files=$MEM_FILES, chunks=$MEM_ROWS"
  else
    echo "- Local Memory DB: (not yet created) — run: python3 scripts/memory-index.py index-all --include-out"
  fi
  echo "- Design Guard: violations=${DG_VIOLATIONS} (mode ${DG_MODE})"
  echo "- Design Atlas: ${ATLAS_NOTE}"
  echo
  echo "## Recent Changes (git status)"
  if [ -n "$RECENT_CHANGES" ]; then
    echo '```'
    echo "$RECENT_CHANGES"
    echo '```'
  else
    echo "(clean working tree)"
  fi
  echo
  if [ -n "$IMPL_SNIPPET" ]; then
    echo "## Recent Implementation Tags"
    echo '```'
    echo "$IMPL_SNIPPET"
    echo '```'
    echo
  fi
  echo "## Suggested Commands"
  echo "- Tweak fast: bash scripts/verification-mode.sh tweak && bash scripts/design-tweak.sh run"
  echo "- Strict close-out: FINALIZE_PROFILE=prototype bash scripts/finalize.sh"
  echo "- Memory search: python3 scripts/memory-search.py \"query terms\" --k 8"
  echo "- Generate atlas (on demand): python3 scripts/generate-design-atlas.py"
  echo
  echo "## MCP Tools"
  echo "- memory.search available if configured (see docs/mcp-memory.md)"
} > "$OUT_MD"

echo "SessionStart context written: $OUT_MD"
