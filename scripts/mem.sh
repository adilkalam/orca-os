#!/usr/bin/env bash
set -euo pipefail

# /mem — Lightweight memory helpers for Codex
# Wraps the Workshop CLI when available; falls back to ripgrep for search.

usage() {
  cat <<'EOF'
Usage:
  /mem search <query> [-k N]     Search project memory (workshop → rg fallback)
  /mem decision "text" [-r why]  Record a decision
  /mem gotcha "text"            Record a gotcha
  /mem goal   "text" [-p prio]  Record a goal (prio: low|med|high)
  /mem note   "text"            Record a note
  /mem antipattern "text" [-r why] Record an antipattern
  /mem context                   Show recent session context

Notes:
  - Uses .claude/memory/workshop.db if present; otherwise instructs to init.
  - Requires `workshop` CLI for add commands. Install: pipx install claude-workshop
EOF
}

have() { command -v "$1" >/dev/null 2>&1; }

mem_db() {
  if [ -f .claude/memory/workshop.db ]; then
    echo .claude/memory/workshop.db
  elif [ -f .workshop/workshop.db ]; then
    echo .workshop/workshop.db
  elif [ -f .claude-work/memory/workshop.db ]; then
    echo .claude-work/memory/workshop.db
  else
    echo "" 
  fi
}

mem_search() {
  local query="$1"; shift
  local k=8
  while [ $# -gt 0 ]; do
    case "$1" in
      -k) k="$2"; shift 2;;
      *) shift;;
    esac
  done
  if have workshop; then
    # Prefer Workshop CLI
    workshop search "$query" | sed -n '1,200p'
  elif have rg; then
    # Fallback to ripgrep in the workspace
    rg -n --no-heading "$query" | head -n "$k"
  else
    echo "Neither workshop nor rg found. Install workshop (pipx install claude-workshop) or ripgrep."
    return 1
  fi
}

mem_context() {
  local sc=.claude/orchestration/session-context.md
  if [ -f "$sc" ]; then
    sed -n '1,200p' "$sc"
  else
    echo "No session context at $sc"
    echo "Tip: run scripts/codex-session-preamble.sh or hooks/session-start.sh"
  fi
}

mem_add() {
  local kind="$1"; shift || true
  if ! have workshop; then
    echo "workshop CLI not found. Install: pipx install claude-workshop"
    return 1
  fi
  if [ $# -eq 0 ]; then
    echo "Provide text. Example: /mem $kind \"Use Supabase for auth\" [-r why]"
    return 1
  fi
  local text="$1"; shift
  case "$kind" in
    decision) workshop decision "$text" "$@";;
    gotcha) workshop gotcha "$text" "$@";;
    goal) workshop goal "$text" "$@";;
    note) workshop note "$text" "$@";;
    antipattern) workshop antipattern "$text" "$@";;
    *) echo "Unknown kind: $kind"; return 1;;
  esac
}

main() {
  if [ $# -lt 1 ]; then usage; exit 1; fi
  local cmd="$1"; shift
  case "$cmd" in
    search)
      if [ $# -lt 1 ]; then echo "Provide a query"; exit 1; fi
      mem_search "$@"
      ;;
    decision|gotcha|goal|note|antipattern)
      mem_add "$cmd" "$@"
      ;;
    context)
      mem_context
      ;;
    help|-h|--help)
      usage
      ;;
    *)
      usage; exit 1
      ;;
  esac
}

main "$@"
