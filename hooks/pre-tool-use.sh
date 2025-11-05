#!/bin/bash
#
# Pre-Tool-Use Hook - File Path Enforcement (Layer 1)
#
# Intercepts Write/Edit tool calls and validates file paths BEFORE execution.
# This is the first line of defense - blocks violations before files are created.
#
# Performance target: <1ms per check
# Exit code 1 = HARD BLOCK (tool execution prevented)
#

# Start timing
START_TIME=$(perl -MTime::HiRes=time -e 'printf "%.6f", time')

# Configuration
ENFORCEMENT_ENABLED=true
INTROSPECTION_GATE="${INTROSPECTION_GATE:-0}"
INTROSPECTION_GATE_THRESHOLD="${INTROSPECTION_GATE_THRESHOLD:-0.40}"
PERFORMANCE_LOG=".claude-work/memory/hook-performance.jsonl"

# Allowed paths (source code + .claude-work)
ALLOWED_PATTERNS=(
  "^\.claude-work/"
  "^src/"
  "^docs/"
  "^tests/"
  "^agents/"
  "^commands/"
  "^hooks/"
)

# Forbidden paths (old structure)
FORBIDDEN_PATTERNS=(
  "^\.orchestration/"
  "^\.workshop/"
  "^\.secret/"
)

log_performance() {
  local operation=$1
  local path=$2
  local duration=$3
  local result=$4

  # Create log directory if needed
  mkdir -p "$(dirname "$PERFORMANCE_LOG")" 2>/dev/null

  # Append JSON line
  echo "{\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)\",\"layer\":\"pre-tool-use\",\"operation\":\"$operation\",\"path\":\"$path\",\"durationMs\":$duration,\"result\":\"$result\"}" >> "$PERFORMANCE_LOG"

  # Warn if slow (>1ms)
  if (( $(echo "$duration > 1.0" | bc -l) )); then
    echo "[PERFORMANCE WARNING] pre-tool-use hook took ${duration}ms for $path" >&2
  fi
}

check_path() {
  local file_path=$1

  # Check if path is allowed
  for pattern in "${ALLOWED_PATTERNS[@]}"; do
    if [[ "$file_path" =~ $pattern ]]; then
      return 0  # Allowed
    fi
  done

  # Check if path is explicitly forbidden
  for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
    if [[ "$file_path" =~ $pattern ]]; then
      echo "❌ BLOCKED: Forbidden directory detected"
      echo "   Path: $file_path"
      echo "   Reason: Old structure (.orchestration, .workshop, .secret) is deprecated"
      echo "   Use: .claude-work/memory/, .claude-work/sessions/, or .claude-work/temp/"
      return 1  # Blocked
    fi
  done

  # Path not in allowed list and not source code
  echo "❌ BLOCKED: File must be in .claude-work/ or source directories"
  echo "   Attempted: $file_path"
  echo "   Allowed:"
  echo "     - .claude-work/memory/    (persistent data)"
  echo "     - .claude-work/sessions/  (session artifacts, auto-delete after 7 days)"
  echo "     - .claude-work/temp/      (temporary files, auto-delete after 24 hours)"
  echo "     - src/, docs/, tests/     (source code)"
  return 1  # Blocked
}

# Main enforcement logic
if [[ "$ENFORCEMENT_ENABLED" == "true" ]]; then
  # Check if this is a Write or Edit tool call
  if [[ "$TOOL_NAME" == "Write" ]] || [[ "$TOOL_NAME" == "Edit" ]]; then
    # Optional: Introspection gate (soft block based on last recorded risk)
    if [[ "$INTROSPECTION_GATE" == "1" ]]; then
      LAST_INTRO_FILE=".orchestration/logs/introspection.jsonl"
      if [ -f "$LAST_INTRO_FILE" ] && command -v jq >/dev/null 2>&1; then
        last_json=$(tail -n 1 "$LAST_INTRO_FILE" 2>/dev/null || true)
        if [ -n "$last_json" ]; then
          risk=$(echo "$last_json" | jq -r 'select(.risk!=null) | .risk' 2>/dev/null || echo "")
          if [ -n "$risk" ]; then
            # Compare as floats using bc
            over=$(echo "$risk >= $INTROSPECTION_GATE_THRESHOLD" | bc -l)
            if [ "$over" = "1" ]; then
              echo "❌ BLOCKED: Introspection gate active (risk=$risk ≥ $INTROSPECTION_GATE_THRESHOLD)"
              echo "   Action: Run /response-awareness-plan or /introspect to reduce risk, then retry"
              # Log performance for visibility
              END_TIME=$(perl -MTime::HiRes=time -e 'printf "%.6f", time')
              DURATION=$(echo "($END_TIME - $START_TIME) * 1000" | bc)
              log_performance "block" "introspection-gate" "$DURATION" "blocked"
              exit 1
            fi
          fi
        fi
      fi
    fi

    FILE_PATH="$TOOL_ARG_file_path"

    if ! check_path "$FILE_PATH"; then
      # Calculate duration
      END_TIME=$(perl -MTime::HiRes=time -e 'printf "%.6f", time')
      DURATION=$(echo "($END_TIME - $START_TIME) * 1000" | bc)

      # Log blocked operation
      log_performance "block" "$FILE_PATH" "$DURATION" "blocked"

      echo ""
      echo "🛡️  File path enforcement blocked this operation"
      echo "   Layer: pre-tool-use hook (Layer 1/6)"
      echo "   Duration: ${DURATION}ms"
      echo ""
      echo "To disable enforcement temporarily (for migration):"
      echo "   export ENFORCEMENT_ENABLED=false"

      exit 1  # HARD BLOCK
    fi

    # Calculate duration
    END_TIME=$(perl -MTime::HiRes=time -e 'printf "%.6f", time')
    DURATION=$(echo "($END_TIME - $START_TIME) * 1000" | bc)

    # Log allowed operation
    log_performance "allow" "$FILE_PATH" "$DURATION" "allowed"

    # Silent success (don't spam output)
    # echo "[pre-tool-use] ✓ $FILE_PATH (${DURATION}ms)"
  fi
fi

# Exit 0 = allow tool execution
exit 0
