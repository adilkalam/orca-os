#!/usr/bin/env bash
set -euo pipefail

# Codex Session Preamble
# - Prints CLAUDE.md prominently
# - Shows recent session context from .claude/orchestration/session-context.md
# - Safe to run in any repo; degrades gracefully if files are missing

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT_DIR"

banner() {
  local title="$1"
  echo "═══════════════════════════════════════════════════════════"
  echo "$title"
  echo "═══════════════════════════════════════════════════════════"
}

# 1) Project instructions (CLAUDE.md)
CLAUDE_MD=""
if [ -f "CLAUDE.md" ]; then
  CLAUDE_MD="CLAUDE.md"
elif [ -f ".claude/CLAUDE.md" ]; then
  CLAUDE_MD=".claude/CLAUDE.md"
fi

if [ -n "${CLAUDE_MD}" ]; then
  banner "PROJECT INSTRUCTIONS (CLAUDE.md) - FOLLOW THESE THROUGHOUT SESSION"
  cat "${CLAUDE_MD}"
  banner "END OF PROJECT INSTRUCTIONS - THESE MUST BE FOLLOWED"
else
  echo "(No CLAUDE.md found in project root or .claude/)"
fi

echo

# 2) Session context summary
SC=".claude/orchestration/session-context.md"
if [ -f "${SC}" ]; then
  banner "SESSION CONTEXT (LATEST)"
  # Show first ~120 lines to keep concise
  sed -n '1,120p' "${SC}"
  banner "END OF SESSION CONTEXT"
else
  echo "(No session context at .claude/orchestration/session-context.md)"
  echo "Tip: run hooks/session-start.sh or your project's SessionStart to generate it."
fi

echo
echo "Hint: use scripts/mem.sh for /mem commands (search/add/context)."

