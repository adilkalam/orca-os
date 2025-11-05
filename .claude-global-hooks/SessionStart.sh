#!/bin/bash

# Workshop SessionStart Hook
# Provides Workshop status/context at the beginning of each Claude Code session

# Always emit a structured JSON status so the client knows what happened.

# 1) Workshop CLI availability
if ! command -v workshop &> /dev/null; then
  echo '{
    "role": "system_context",
    "message": "📝 Workshop Not Installed",
    "details": "Install the Workshop CLI to enable persistent context across sessions.\n\nInstall with:\n- pipx install claude-workshop\n  or\n- pip install claude-workshop\n\nAfter installation, restart the session.",
    "context": ""
  }'
  exit 0
fi

# 2) Ensure project is initialized (supports new and legacy layouts)
has_workshop() {
  [ -d ".workshop" ] || [ -f ".claude-work/memory/workshop.db" ]
}

if ! has_workshop; then
  echo ""
  echo "📝 Workshop: Initializing for this project..."
  init_output=$(workshop init --quiet 2>&1 | head -3)
  if ! has_workshop; then
    # Initialization failed — report clearly instead of silent success
    # Include the (first lines of) init output for debugging
    esc_init_output=$(printf "%s" "$init_output" | sed 's/"/\\"/g' | tr '\n' ' ')
    echo '{
      "role": "system_context",
      "message": "⚠️ Workshop Init Failed",
      "details": "Attempted to initialize Workshop for this project but .workshop was not created.\n\nNext steps:\n- Run: `workshop init` and check output\n- Ensure write permissions in the project directory\n- Verify Python env and Workshop install\n\nInit output (truncated): '"$esc_init_output"'",
      "context": ""
    }'
    exit 0
  fi
fi

# 3) Catch-up import (in case last session ended unexpectedly)
#    Run quietly; do not block the session if it fails
workshop import --execute >/dev/null 2>&1 || true

# 3.5) Ensure ACE Playbooks are initialized (quietly)
# If project provides the loader, seed playbooks to the canonical path.
if [ -f "hooks/load-playbooks.sh" ]; then
  bash hooks/load-playbooks.sh >/dev/null 2>&1 || true
else
  # Fallback: use globally installed loader + templates if available (~/.claude/ace)
  if [ -f "$HOME/.claude/ace/load-playbooks.sh" ]; then
    ACE_TEMPLATES_FALLBACK="$HOME/.claude/ace/templates" \
      bash "$HOME/.claude/ace/load-playbooks.sh" >/dev/null 2>&1 || true
  fi
fi

# 4) Display Workshop context as JSON for Claude to parse
ctx=$(workshop context 2>&1)
status=$?
esc_ctx=$(printf "%s" "$ctx" | sed 's/"/\\"/g' | tr '\n' ' ')
if [ $status -ne 0 ]; then
  echo '{
    "role": "system_context",
    "message": "⚠️ Workshop Context Error",
    "details": "`workshop context` returned a non-zero status.\n\nOutput (truncated): '"$esc_ctx"'\n\nCheck:\n- `workshop --version`\n- `ls -la .workshop` or `ls -la .claude-work/memory/`\n- Run `workshop init` to set up this project.",
    "context": ""
  }'
else
  echo '{
    "role": "system_context",
    "message": "📝 Workshop Context Available",
    "details": "Use the `workshop` CLI to access project context. Key commands:\n\n- `workshop context` - View session summary\n- `workshop search <query>` - Search entries\n- `workshop note <text>` - Add a note\n- `workshop decision <text> -r <reasoning>` - Record a decision\n- `workshop gotcha <text>` - Record a gotcha/constraint\n\nWorkshop maintains context across sessions. Use it to:\n- Record decisions and their reasoning\n- Document gotchas and constraints\n- Track goals and next steps\n- Save user preferences\n\nCurrent context:",
    "context": '"'$esc_ctx'"'
  }'
fi
