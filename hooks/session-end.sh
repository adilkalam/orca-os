#!/usr/bin/env bash
# SessionEnd Hook - Auto-import new session to Workshop
set -euo pipefail

TRANSCRIPT_FILE="${1:-}"

# Workshop auto-imports new JSONL files since last import
# This runs after each session ends to keep Workshop up-to-date
workshop import --execute --since last-import > /dev/null 2>&1 || true

echo "SessionEnd: Workshop updated"
