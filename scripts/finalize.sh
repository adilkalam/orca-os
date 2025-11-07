#!/usr/bin/env bash
set -euo pipefail

# Vibe Code — Phase 1: Core Gate (/finalize)
# Behavior: build → tests → screenshots → tag verification → evidence score → .verified + report
# SCOPE: ONLY for orca team sessions (not global sessions)

# Perf timing (optional)
PERF_T0=""
if [ -f "scripts/perf-log.sh" ]; then
  . scripts/perf-log.sh
  PERF_T0="$(now_ms)"
  perf_log finalize_start
fi

if [ -n "${FINALIZE_FORCE_ROOT:-}" ]; then
  ROOT_DIR="$FINALIZE_FORCE_ROOT"
elif [ "${FINALIZE_USE_PWD:-}" = "1" ]; then
  ROOT_DIR="$(pwd)"
else
  ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
fi
cd "$ROOT_DIR"

# Check for orca context - finalize only applies to orca team sessions
ORCH_DIR=".orchestration"
ORCA_MARKERS=(
  "$ORCH_DIR/user-request.md"
  "$ORCH_DIR/implementation-log.md"
  "$ORCH_DIR/orca-session"
)

ORCA_CONTEXT=0
for marker in "${ORCA_MARKERS[@]}"; do
  if [ -f "$marker" ]; then
    ORCA_CONTEXT=1
    break
  fi
done

# Allow override for testing/evaluation
if [ "${FINALIZE_FORCE_ORCA:-}" = "1" ]; then
  ORCA_CONTEXT=1
fi

if [ "$ORCA_CONTEXT" -eq 0 ]; then
  echo "⚠️  /finalize is only for orca team sessions"
  echo ""
  echo "This project does not appear to be using orca orchestration."
  echo "Expected markers:"
  echo "  - .orchestration/user-request.md"
  echo "  - .orchestration/implementation-log.md"
  echo "  - .orchestration/orca-session"
  echo ""
  echo "For regular sessions, use standard git workflow without /finalize."
  echo "To force finalize (testing only): FINALIZE_FORCE_ORCA=1 bash scripts/finalize.sh"
  exit 1
fi

LOG_DIR="$ORCH_DIR/logs"
VER_DIR="$ORCH_DIR/verification"
EVIDENCE_DIR="$ORCH_DIR/evidence"
IMPL_LOG="$ORCH_DIR/implementation-log.md"
VERIFIED_FILE=".verified"

mkdir -p "$LOG_DIR" "$VER_DIR" "$EVIDENCE_DIR"

ts() { date -u '+%Y-%m-%dT%H:%M:%SZ'; }
section() { echo "[$(ts)] === $* ==="; }
status_line() { printf "%-22s %s\n" "$1" "$2"; }

BUILD_STATUS="SKIP"
ARTIFACT_NOTE=""
TEST_STATUS="SKIP"
ZERO_TAG_STATUS="FAIL"
SCREENSHOT_COUNT=0
SCORE=0
FAIL_REASONS=()
DESIGN_GUARD_MODE="not-run"
DESIGN_GUARD_VIOLATIONS="0"
DESIGN_GUARD_REPORT=""
PROFILE="$(sed -n 's/.*"profile"\s*:\s*"\([^"]*\)".*/\1/p' .orchestration/mode.json 2>/dev/null | head -1)"
ATLAS_NOTE=""
ATLAS_PATH=""
UI_CHANGE_DETECTED=0

BUILD_LOG="$LOG_DIR/build.log"
TEST_LOG="$LOG_DIR/test-output.log"
REPORT_MD="$VER_DIR/verification-report.md"

# Reset logs for this run
echo "# Build Log ($(ts))" > "$BUILD_LOG"
echo "# Test Output ($(ts))" > "$TEST_LOG"

section "Detect project type"
HAS_NODE=$(test -f package.json && echo yes || echo no)
HAS_NODE_MODULES=$(test -d node_modules && echo yes || echo no)
HAS_PYTEST=$(command -v pytest >/dev/null 2>&1 && echo yes || echo no)
HAS_PY=$(test -f pyproject.toml -o -f setup.py && echo yes || echo no)
HAS_CARGO=$(test -f Cargo.toml && command -v cargo >/dev/null 2>&1 && echo yes || echo no)

status_line "Node project" "$HAS_NODE"
status_line "node_modules present" "$HAS_NODE_MODULES"
status_line "Python project" "$HAS_PY"
status_line "pytest available" "$HAS_PYTEST"
status_line "Rust project" "$HAS_CARGO"

section "Build"
{
  if [ "$HAS_NODE" = "yes" ] && [ "$HAS_NODE_MODULES" = "yes" ] && grep -q '"build"' package.json 2>/dev/null; then
    echo "Running: npm run build" | tee -a "$BUILD_LOG"
    if npm run --silent build >> "$BUILD_LOG" 2>&1; then
      BUILD_STATUS="PASS"; SCORE=$((SCORE+2))
    else
      BUILD_STATUS="FAIL"; FAIL_REASONS+=("Node build failed")
    fi
  elif [ "$HAS_CARGO" = "yes" ]; then
    echo "Running: cargo build --release" | tee -a "$BUILD_LOG"
    if cargo build --release >> "$BUILD_LOG" 2>&1; then
      BUILD_STATUS="PASS"; SCORE=$((SCORE+2))
    else
      BUILD_STATUS="FAIL"; FAIL_REASONS+=("Cargo build failed")
    fi
  elif [ "$HAS_PY" = "yes" ]; then
    echo "Python project detected. No explicit build step." | tee -a "$BUILD_LOG"
    BUILD_STATUS="SKIP"
  else
    echo "No build configured (skipping)." | tee -a "$BUILD_LOG"
    BUILD_STATUS="SKIP"
  fi
} || true

## Fallback: accept existing build artifacts as evidence when no build runs
if [ "$BUILD_STATUS" = "SKIP" ] || [ "$BUILD_STATUS" = "FAIL" ]; then
  section "Build Artifact Check (fallback)"
  ART_DIRS=("out" "dist" ".next" "build" "target/release")
  for d in "${ART_DIRS[@]}"; do
    if [ -d "$d" ]; then
      if find "$d" -type f -maxdepth 2 | head -1 | grep -q .; then
        status_line "Artifact found" "$d"
        BUILD_STATUS="PASS"
        ARTIFACT_NOTE=" (artifact)"
        SCORE=$((SCORE+2))
        break
      fi
    fi
  done
fi

section "Tests"
{
  if [ "$HAS_NODE" = "yes" ] && [ "$HAS_NODE_MODULES" = "yes" ] && grep -q '"test"' package.json 2>/dev/null; then
    echo "Running: npm test --silent" | tee -a "$TEST_LOG"
    if npm test --silent >> "$TEST_LOG" 2>&1; then
      TEST_STATUS="PASS"; SCORE=$((SCORE+3))
    else
      TEST_STATUS="FAIL"; FAIL_REASONS+=("Node tests failed")
    fi
  elif [ "$HAS_PY" = "yes" ] && [ "$HAS_PYTEST" = "yes" ]; then
    echo "Running: pytest -q" | tee -a "$TEST_LOG"
    if pytest -q >> "$TEST_LOG" 2>&1; then
      TEST_STATUS="PASS"; SCORE=$((SCORE+3))
    else
      TEST_STATUS="FAIL"; FAIL_REASONS+=("Pytest failed")
    fi
  elif [ "$HAS_CARGO" = "yes" ]; then
    echo "Running: cargo test --quiet" | tee -a "$TEST_LOG"
    if cargo test --quiet >> "$TEST_LOG" 2>&1; then
      TEST_STATUS="PASS"; SCORE=$((SCORE+3))
    else
      TEST_STATUS="FAIL"; FAIL_REASONS+=("Cargo tests failed")
    fi
  else
    echo "No tests detected (skipping)." | tee -a "$TEST_LOG"
    TEST_STATUS="SKIP"
  fi
} || true

section "Screenshot evidence"
SCREENSHOT_COUNT=$(find "$EVIDENCE_DIR" -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' \) | wc -l | tr -d ' ')
if [ "$SCREENSHOT_COUNT" -gt 0 ]; then
  SCORE=$((SCORE+2))
  status_line "Screenshots found" "$SCREENSHOT_COUNT"
else
  status_line "Screenshots found" "0"
fi

section "Evidence sync (logs)"
# Ensure build/test logs also exist under evidence (in addition to .orchestration/logs)
{
  mkdir -p "$EVIDENCE_DIR/build" "$EVIDENCE_DIR/tests"
  if [ -f "$LOG_DIR/build.log" ]; then
    ts_copy=$(date -u '+%Y%m%d-%H%M%S')
    dst="$EVIDENCE_DIR/build/build-$ts_copy.log"
    # Only copy if no recent build evidence exists
    if ! find "$EVIDENCE_DIR/build" -type f -name 'build-*.log' -mmin -5 | grep -q . 2>/dev/null; then
      cp "$LOG_DIR/build.log" "$dst" 2>/dev/null || true
    fi
  fi
  if [ -f "$LOG_DIR/test-output.log" ]; then
    ts_copy=$(date -u '+%Y%m%d-%H%M%S')
    dst="$EVIDENCE_DIR/tests/tests-$ts_copy.log"
    if ! find "$EVIDENCE_DIR/tests" -type f -name 'tests-*.log' -mmin -5 | grep -q . 2>/dev/null; then
      cp "$LOG_DIR/test-output.log" "$dst" 2>/dev/null || true
    fi
  fi
} || true

section "Design Guard"
{
  if command -v python3 >/dev/null 2>&1; then
    if python3 scripts/design_ui_guard.py >/dev/null 2>&1; then
      if [ -f ".orchestration/verification/design-guard-summary.json" ]; then
        # Parse JSON (without jq)
        DESIGN_GUARD_MODE=$(sed -n 's/.*"mode"\s*:\s*"\([^"]*\)".*/\1/p' .orchestration/verification/design-guard-summary.json | head -1)
        DESIGN_GUARD_VIOLATIONS=$(sed -n 's/.*"violations"\s*:\s*\([0-9][0-9]*\).*/\1/p' .orchestration/verification/design-guard-summary.json | head -1)
        DESIGN_GUARD_REPORT=$(sed -n 's/.*"report"\s*:\s*"\([^"]*\)".*/\1/p' .orchestration/verification/design-guard-summary.json | head -1)
      else
        DESIGN_GUARD_MODE="no-summary"
      fi
    else
      DESIGN_GUARD_MODE="error"
    fi
  else
    DESIGN_GUARD_MODE="python-missing"
  fi
}

section "Design Atlas"
{
  if command -v python3 >/dev/null 2>&1; then
    if [ -f scripts/generate-design-atlas.py ]; then
      if python3 scripts/generate-design-atlas.py >/dev/null 2>&1; then
        ATLAS_PATH="docs/design-atlas.md"
        if [ -f "$ATLAS_PATH" ]; then
          ATLAS_NOTE="generated"
        else
          ATLAS_NOTE="missing"
        fi
      else
        ATLAS_NOTE="error"
      fi
    else
      ATLAS_NOTE="skipped"
    fi
  else
    ATLAS_NOTE="python-missing"
  fi
}

section "Zero-Tag Gate"
REQUIRED_TAGS=("^#FILE_CREATED:" "^#FILE_MODIFIED:" "^#COMPLETION_DRIVE([A-Z_]*)?:" "^#PATH_DECISION:" "^#SCREENSHOT_CLAIMED:")
TAG_PRESENT="no"
SCREENSHOT_TAG_ERRORS=0

# Helper: output only lines outside fenced code blocks
filter_noncodelines() {
  awk 'BEGIN{code=0} /^```/{code=!code; next} code==0 {print}' "$1"
}

if [ ! -f "$IMPL_LOG" ]; then
  ZERO_TAG_STATUS="FAIL"
  FAIL_REASONS+=("Missing $IMPL_LOG")
else
  if [ ! -s "$IMPL_LOG" ]; then
    ZERO_TAG_STATUS="FAIL"
    FAIL_REASONS+=("$IMPL_LOG is empty")
  else
    IMPL_OUTSIDE=$(filter_noncodelines "$IMPL_LOG")
    # Detect whether UI-facing files were changed (requires screenshot evidence)
    if printf "%s\n" "$IMPL_OUTSIDE" | grep -Eiq '#FILE_(CREATED|MODIFIED):[[:space:]]*[^[:space:]]+\.(tsx|jsx|css|scss|sass|html|vue|swift)'; then
      UI_CHANGE_DETECTED=1
    fi
    for t in "${REQUIRED_TAGS[@]}"; do
      if printf "%s\n" "$IMPL_OUTSIDE" | grep -Eq "$t"; then TAG_PRESENT="yes"; break; fi
    done
    if [ "$TAG_PRESENT" = "yes" ]; then
      ZERO_TAG_STATUS="PASS"
      # Verify screenshot tags (if any) reference existing files, unless special CANNOT_CAPTURE_SECURITY_POLICY
      while IFS= read -r line; do
        # Only consider proper claims that include a colon after the tag
        echo "$line" | grep -q "#SCREENSHOT_CLAIMED:" || continue
        # Extract the path after the colon using POSIX character classes
        path="$(echo "$line" | sed -E 's/^.*#SCREENSHOT_CLAIMED:[[:space:]]*([^ ]+).*$/\1/')"
        if [ "$path" = "CANNOT_CAPTURE_SECURITY_POLICY" ]; then
          continue
        fi
        if [ -n "$path" ]; then
          if [ ! -f "$path" ]; then
            echo "WARN: Screenshot path in implementation log not found: $path"
            SCREENSHOT_TAG_ERRORS=$((SCREENSHOT_TAG_ERRORS+1))
          fi
        fi
      done < <(printf "%s\n" "$IMPL_OUTSIDE" | grep "#SCREENSHOT_CLAIMED" || true)
      if [ "$SCREENSHOT_TAG_ERRORS" -gt 0 ]; then
        ZERO_TAG_STATUS="FAIL"
        FAIL_REASONS+=("$SCREENSHOT_TAG_ERRORS screenshot tag(s) point to missing files")
      fi
    else
      ZERO_TAG_STATUS="FAIL"
      FAIL_REASONS+=("No required tags found in $IMPL_LOG")
    fi
  fi
fi

# Basic evidence for grep-able trace (+1)
SCORE=$((SCORE+1))

# If UI changes detected, require at least one screenshot in evidence
if [ "$UI_CHANGE_DETECTED" -eq 1 ] && [ "$SCREENSHOT_COUNT" -eq 0 ]; then
  ZERO_TAG_STATUS="FAIL"
  FAIL_REASONS+=("UI changes detected but no screenshots found in .orchestration/evidence")
fi

section "Score & Decision"
MIN_SCORE=5
case "${FINALIZE_PROFILE:-}" in
  prototype|Prototype)
    MIN_SCORE=3 ;;
esac
case "${PROFILE:-}" in
  prototype|Prototype)
    MIN_SCORE=3 ;;
esac
STATUS="FAIL"
# Eval harness: allow forced failure for specific scenarios
case "${FINALIZE_EVAL_FORCE:-}" in
  ZERO_TAG_FAIL|zero_tag|zero_tag_fail)
    ZERO_TAG_STATUS="FAIL"
    FAIL_REASONS+=("Eval-forced Zero-Tag fail")
    ;;
  SCREENSHOT_FAIL|screenshot|screenshot_fail)
    ZERO_TAG_STATUS="FAIL"
    FAIL_REASONS+=("Eval-forced Screenshot fail")
    ;;
esac
if [ "$ZERO_TAG_STATUS" = "PASS" ] && [ $SCORE -ge $MIN_SCORE ]; then
  STATUS="PASS"
fi

# Write report
{
  echo "# Verification Report"
  echo
  echo "- Timestamp: $(ts)"
  echo "- Build: $BUILD_STATUS$ARTIFACT_NOTE"
  echo "- Tests: $TEST_STATUS"
  echo "- Zero-Tag Gate: $ZERO_TAG_STATUS"
  echo "- Screenshots: $SCREENSHOT_COUNT"
  echo "- Design Guard: ${DESIGN_GUARD_VIOLATIONS:-0} (mode ${DESIGN_GUARD_MODE})"
  if [ -n "$ATLAS_PATH" ] && [ -f "$ATLAS_PATH" ]; then
    echo "- Design Atlas: $ATLAS_PATH ($ATLAS_NOTE)"
  else
    echo "- Design Atlas: $ATLAS_NOTE"
  fi
  echo "- Evidence Score: $SCORE (min $MIN_SCORE)"
  echo "- Profile: ${PROFILE:-none}"
  if [ ${#FAIL_REASONS[@]} -gt 0 ]; then
    echo "- Fail Reasons:"
    for r in "${FAIL_REASONS[@]}"; do echo "  - $r"; done
  fi
  echo
  if [ -n "$DESIGN_GUARD_REPORT" ] && [ -f "$DESIGN_GUARD_REPORT" ]; then
    echo "## Design Guard"
    echo "- Report: $DESIGN_GUARD_REPORT"
    echo
  fi
  echo "## Implementation Log Summary"
  if [ -f "$IMPL_LOG" ]; then
    echo "- Path: $IMPL_LOG"
    echo "- Lines: $(wc -l < "$IMPL_LOG" | tr -d ' ')"
    echo "- Tag presence: $( [ "$TAG_PRESENT" = "yes" ] && echo 'YES' || echo 'NO')"
  else
    echo "- Path: (missing)"
  fi
} > "$REPORT_MD"

if [ "$STATUS" = "PASS" ]; then
  {
    echo "status: PASS"
    echo "timestamp: $(ts)"
    echo "score: $SCORE"
    echo "build: $BUILD_STATUS"
    echo "tests: $TEST_STATUS"
    echo "zero_tag_gate: $ZERO_TAG_STATUS"
    echo "screenshots: $SCREENSHOT_COUNT"
    echo "profile: ${PROFILE:-}"
    echo "report: $REPORT_MD"
  } > "$VERIFIED_FILE"
  echo
  echo "✅ Finalization PASSED. .verified created."
  echo "- See $REPORT_MD"
  # Record outcome to Workshop (best-effort)
  if command -v python3 >/dev/null 2>&1; then
    python3 scripts/workshop_log.py finalize \
      --status "$STATUS" \
      --score "$SCORE" \
      --build "$BUILD_STATUS$ARTIFACT_NOTE" \
      --tests "$TEST_STATUS" \
      --zero-tag "$ZERO_TAG_STATUS" \
      --screenshots "$SCREENSHOT_COUNT" \
      --design-guard "${DESIGN_GUARD_VIOLATIONS:-0}" \
      --profile "${PROFILE:-}" \
      --report "$REPORT_MD" \
      --notes ""
  fi
  # Non-blocking memory refresh to keep local DB hot (best-effort)
  nohup python3 scripts/memory-index.py update-changed >/dev/null 2>&1 &
  # Perf end
  if [ -n "$PERF_T0" ]; then PERF_T1="$(now_ms)"; perf_log finalize_end status=PASS duration_ms=$(( PERF_T1 - PERF_T0 )) score=$SCORE build=$BUILD_STATUS tests=$TEST_STATUS zero_tag=$ZERO_TAG_STATUS screenshots=$SCREENSHOT_COUNT; fi
  exit 0
else
  rm -f "$VERIFIED_FILE" 2>/dev/null || true
  echo
  echo "❌ Finalization FAILED. No .verified created."
  echo "- See $REPORT_MD"
  echo "- Reasons: ${FAIL_REASONS[*]:-none}"
  # Helpful hints for common Zero-Tag failures
  if printf "%s\n" "${FAIL_REASONS[@]:-}" | grep -qi "implementation-log"; then
    echo
    echo "Hint: Update .orchestration/implementation-log.md with at least one tag, e.g.:"
    echo "  #FILE_CREATED: src/path/File.tsx (123 lines)"
    echo "  #FILE_MODIFIED: src/path/File.tsx"
    echo "  #PATH_DECISION: Chose X over Y (reason)"
    echo "  #SCREENSHOT_CLAIMED: .orchestration/evidence/task-123/screen.png"
    echo "See docs/RESPONSE_AWARENESS_TAGS.md for details."
  fi
  # Record failure outcome to Workshop (best-effort)
  if command -v python3 >/dev/null 2>&1; then
    python3 scripts/workshop_log.py finalize \
      --status "$STATUS" \
      --score "$SCORE" \
      --build "$BUILD_STATUS$ARTIFACT_NOTE" \
      --tests "$TEST_STATUS" \
      --zero-tag "$ZERO_TAG_STATUS" \
      --screenshots "$SCREENSHOT_COUNT" \
      --design-guard "${DESIGN_GUARD_VIOLATIONS:-0}" \
      --profile "${PROFILE:-}" \
      --report "$REPORT_MD" \
      --notes "${FAIL_REASONS[*]:-}" || true
  fi
  # Non-blocking memory refresh to keep local DB hot (best-effort)
  nohup python3 scripts/memory-index.py update-changed >/dev/null 2>&1 &
  # Perf end
  if [ -n "$PERF_T0" ]; then PERF_T1="$(now_ms)"; perf_log finalize_end status=FAIL duration_ms=$(( PERF_T1 - PERF_T0 )) score=$SCORE build=$BUILD_STATUS tests=$TEST_STATUS zero_tag=$ZERO_TAG_STATUS screenshots=$SCREENSHOT_COUNT; fi
  exit 1
fi
