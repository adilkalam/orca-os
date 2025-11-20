#!/usr/bin/env bash
set -euo pipefail

# Evidence utilities shared by capture scripts

ensure_evidence_dirs() {
  mkdir -p .orchestration/evidence/screenshots \
           .orchestration/evidence/build \
           .orchestration/evidence/tests \
           .orchestration/evidence/requests \
           .orchestration/logs
}

timestamp() {
  date -u '+%Y%m%d-%H%M%S'
}

append_impl_log() {
  local line="$1"
  mkdir -p .orchestration
  if [ -f .orchestration/implementation-log.md ]; then
    printf '%s\n' "$line" >> .orchestration/implementation-log.md
  else
    printf '%s\n' "$line" >> .orchestration/implementation-log.md
  fi
}

