#!/usr/bin/env bash
set -euo pipefail

# Evidence utilities shared by capture scripts

ensure_evidence_dirs() {
  mkdir -p .claude/orchestration/evidence/screenshots \
           .claude/orchestration/evidence/build \
           .claude/orchestration/evidence/tests \
           .claude/orchestration/evidence/requests \
           .claude/orchestration/logs
}

timestamp() {
  date -u '+%Y%m%d-%H%M%S'
}

append_impl_log() {
  local line="$1"
  mkdir -p .orchestration
  if [ -f .claude/orchestration/temp/implementation-log.md ]; then
    printf '%s\n' "$line" >> .claude/orchestration/temp/implementation-log.md
  else
    printf '%s\n' "$line" >> .claude/orchestration/temp/implementation-log.md
  fi
}

