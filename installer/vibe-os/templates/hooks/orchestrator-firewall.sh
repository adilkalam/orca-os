#!/usr/bin/env bash
# Wrapper for orchestrator firewall. Intended to be called before any write/edit/delete action
# in environments that support tool hooks. Exits non-zero (78) to block.

set -euo pipefail

export ORCHESTRATION_ACTOR="${ORCHESTRATION_ACTOR:-workflow-orchestrator}"
"$(git rev-parse --show-toplevel 2>/dev/null || pwd)/scripts/orchestrator_firewall.sh" "$@"

