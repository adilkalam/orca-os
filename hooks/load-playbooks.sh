#!/bin/bash
# ACE Playbook Auto-Loader for SessionStart Hook
# Loads project-specific and universal playbooks automatically

set -e

PLAYBOOK_DIR=".orchestration/playbooks"
SIGNAL_LOG=".orchestration/signals/signal-log.jsonl"
OUTPUT_FILE=".claude-playbook-context.md"

# Detect project type (fast file existence checks)
detect_project_type() {
  # iOS/Swift
  if ls *.xcodeproj >/dev/null 2>&1 || ls *.xcworkspace >/dev/null 2>&1; then
    echo "ios"
    return
  fi

  # Next.js
  if [ -f "package.json" ] && grep -q "\"next\"" package.json 2>/dev/null; then
    echo "nextjs"
    return
  fi

  # React (fallback if not Next.js)
  if [ -f "package.json" ] && grep -q "\"react\"" package.json 2>/dev/null; then
    echo "react"
    return
  fi

  # Python/Backend
  if [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
    echo "python"
    return
  fi

  # Flutter
  if [ -f "pubspec.yaml" ]; then
    echo "flutter"
    return
  fi

  # React Native
  if [ -f "package.json" ] && [ -d "ios" ] && [ -d "android" ]; then
    echo "react-native"
    return
  fi

  # Unknown/Generic
  echo "unknown"
}

# Get playbook filename for project type
get_playbook_name() {
  case "$1" in
    ios)
      echo "ios-development"
      ;;
    nextjs)
      echo "nextjs-patterns"
      ;;
    react)
      echo "react-patterns"
      ;;
    python)
      echo "backend-patterns"
      ;;
    flutter|react-native)
      echo "mobile-patterns"
      ;;
    *)
      echo "universal-patterns"
      ;;
  esac
}

# Initialize playbook from template if not exists
initialize_playbook() {
  local playbook_name="$1"
  local playbook_json="$PLAYBOOK_DIR/${playbook_name}.json"
  local template_json="$PLAYBOOK_DIR/${playbook_name}-template.json"

  # If active playbook doesn't exist but template does, copy it
  if [ ! -f "$playbook_json" ] && [ -f "$template_json" ]; then
    cp "$template_json" "$playbook_json"
    echo "Initialized $playbook_name from template" >&2
  fi
}

# Log signal to signal-log.jsonl
log_signal() {
  local signal="$1"
  local data="$2"

  if [ -f "$SIGNAL_LOG" ]; then
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    echo "{\"timestamp\":\"$timestamp\",\"signal\":\"$signal\"$data}" >> "$SIGNAL_LOG"
  fi
}

# Load playbook and generate context
load_playbook() {
  local project_type="$1"
  local playbook_name=$(get_playbook_name "$project_type")
  local playbook_json="$PLAYBOOK_DIR/${playbook_name}.json"
  local universal_json="$PLAYBOOK_DIR/universal-patterns.json"

  # Check if orchestration directory exists
  if [ ! -d "$PLAYBOOK_DIR" ]; then
    echo "# Playbook System: Not initialized (run Phase 1 first)"
    return
  fi

  # Initialize playbooks if needed
  initialize_playbook "$playbook_name"
  initialize_playbook "universal-patterns"

  # Log session start
  log_signal "SESSION_START" ",\"project_type\":\"$project_type\""

  # Start building context
  cat > "$OUTPUT_FILE" << 'HEADER'
# ACE Playbook System - Loaded Patterns

**System:** Agentic Context Engineering (ACE) with Generator-Reflector-Curator architecture
**Status:** Active and learning

---

## What Are Playbooks?

Playbooks are collections of **proven strategies** that /orca has learned from past sessions. They contain:
- ✓ **Helpful patterns** (strategies that worked)
- ✗ **Anti-patterns** (strategies that failed)
- ○ **Neutral patterns** (context-dependent)

Each pattern includes:
- **Context:** When to use this pattern
- **Strategy:** What to do (or avoid)
- **Evidence:** Why it works/fails
- **Counts:** helpful_count / harmful_count (updated by curator)

---

HEADER

  # Add project-specific patterns
  if [ -f "$playbook_json" ]; then
    pattern_count=$(cat "$playbook_json" | jq '.patterns | length' 2>/dev/null || echo "0")
    playbook_version=$(cat "$playbook_json" | jq -r '.playbook_version' 2>/dev/null || echo "1.0.0")

    log_signal "PLAYBOOK_LOADED" ",\"playbook\":\"${playbook_name}.json\",\"pattern_count\":$pattern_count"

    cat >> "$OUTPUT_FILE" << EOF
## Project-Specific Playbook: $project_type

**Playbook:** ${playbook_name}.json
**Version:** $playbook_version
**Patterns Loaded:** $pattern_count

EOF

    # Extract top 5 helpful patterns
    cat "$playbook_json" | jq -r '.patterns[] | select(.type=="helpful") | "- ✓ \(.title) (helpful: \(.helpful_count), harmful: \(.harmful_count))"' 2>/dev/null | head -5 >> "$OUTPUT_FILE" || true

    echo "" >> "$OUTPUT_FILE"
  fi

  # Add universal patterns
  if [ -f "$universal_json" ]; then
    universal_count=$(cat "$universal_json" | jq '.patterns | length' 2>/dev/null || echo "0")

    log_signal "PLAYBOOK_LOADED" ",\"playbook\":\"universal-patterns.json\",\"pattern_count\":$universal_count"

    cat >> "$OUTPUT_FILE" << EOF
## Universal Patterns (All Projects)

**Playbook:** universal-patterns.json
**Patterns Loaded:** $universal_count

EOF

    # Extract top 5 universal helpful patterns
    cat "$universal_json" | jq -r '.patterns[] | select(.type=="helpful") | "- ✓ \(.title) (helpful: \(.helpful_count), harmful: \(.harmful_count))"' 2>/dev/null | head -5 >> "$OUTPUT_FILE" || true

    echo "" >> "$OUTPUT_FILE"
  fi

  # Add usage instructions
  cat >> "$OUTPUT_FILE" << 'FOOTER'

---

## How /orca Uses Playbooks

When you run `/orca`, it will:

1. **Match patterns** to your request using context keywords
2. **Select specialists** based on proven strategies
3. **Avoid anti-patterns** that have failed before
4. **Dispatch team** in parallel when possible
5. **Log outcomes** to signal log
6. **Reflect on session** (orchestration-reflector)
7. **Update playbooks** (playbook-curator)

**Example:**

User: "Build iOS app with local data storage"

Pattern matched: `ios-pattern-001` (SwiftUI + SwiftData + State-First)
Strategy: Dispatch swiftui-developer + swiftdata-specialist + state-architect
Evidence: Modern iOS development best practice, proven across X sessions

---

## Pattern Evolution

Patterns evolve based on real outcomes:

- **Successful session** → helpful_count incremented
- **Failed session** → harmful_count incremented
- **harmful_count > helpful_count × 3** → Apoptosis (pattern deleted after 7-day grace period)
- **New pattern discovered** → Appended to playbook with evidence

---

## Available Commands

- `/orca` - Multi-agent orchestration (uses playbooks automatically)
- `/playbook-review` - Manually trigger reflection and curation
- `/playbook-pause` - Temporarily disable playbook system

---

**Full Documentation:** `.orchestration/playbooks/README.md`

FOOTER

  # Output context
  cat "$OUTPUT_FILE"
}

# Main execution
PROJECT_TYPE=$(detect_project_type)
load_playbook "$PROJECT_TYPE"
