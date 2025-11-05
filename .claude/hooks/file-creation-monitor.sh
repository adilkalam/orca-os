#!/bin/bash

# File Creation Monitor Hook
# Prevents Claude from creating chaos with excessive files and wrong locations

# Get the file being created/written from tool call
FILE_PATH="$1"
OPERATION="$2"  # "create" or "write"

# Check if this is a file operation we should monitor
if [[ -z "$FILE_PATH" ]]; then
    exit 0
fi

# Convert to absolute path if relative
if [[ ! "$FILE_PATH" = /* ]]; then
    FILE_PATH="$(pwd)/$FILE_PATH"
fi

# Rule 1: Block writing to ~/.claude from project contexts
GLOBAL_CLAUDE="$HOME/.claude"
CURRENT_DIR="$(pwd)"

if [[ "$FILE_PATH" == "$GLOBAL_CLAUDE"/* ]] && [[ "$CURRENT_DIR" != "$GLOBAL_CLAUDE"* ]]; then
    echo "❌ BLOCKED: Cannot create files in global ~/.claude from project context"
    echo "   Attempted: $FILE_PATH"
    echo "   From: $CURRENT_DIR"
    echo "   Rule: Project files stay in project directories"
    exit 1
fi

# Rule 2: Count files created in this session
SESSION_FILE_COUNT_FILE="/tmp/claude-session-files-$(date +%Y%m%d).count"

# Initialize counter if doesn't exist
if [[ ! -f "$SESSION_FILE_COUNT_FILE" ]]; then
    echo "0" > "$SESSION_FILE_COUNT_FILE"
fi

# Increment counter
CURRENT_COUNT=$(cat "$SESSION_FILE_COUNT_FILE")
NEW_COUNT=$((CURRENT_COUNT + 1))
echo "$NEW_COUNT" > "$SESSION_FILE_COUNT_FILE"

# Warn at thresholds
if [[ "$NEW_COUNT" -eq 10 ]]; then
    echo "⚠️  File Creation Warning: 10 files created this session"
    echo "   Consider: Do you really need all these files?"
elif [[ "$NEW_COUNT" -eq 25 ]]; then
    echo "⚠️  File Creation Warning: 25 files created this session"
    echo "   This is getting excessive. Stop creating planning documents."
elif [[ "$NEW_COUNT" -eq 50 ]]; then
    echo "🚨 File Creation Alert: 50 files created this session!"
    echo "   You're creating a mess. Focus on implementation, not documentation."
elif [[ "$NEW_COUNT" -ge 100 ]]; then
    echo "🔥 CHAOS ALERT: $NEW_COUNT files created this session!"
    echo "   This is exactly the problem we're trying to prevent."
    echo "   STOP CREATING FILES AND DO THE ACTUAL WORK."
fi

# Rule 3: Warn about planning/documentation files
if [[ "$FILE_PATH" == *"PLAN"* ]] || [[ "$FILE_PATH" == *"plan-"* ]] || \
   [[ "$FILE_PATH" == *"IMPLEMENTATION"* ]] || [[ "$FILE_PATH" == *"implementation-"* ]] || \
   [[ "$FILE_PATH" == *"VERIFICATION"* ]] || [[ "$FILE_PATH" == *"unified-"* ]] || \
   [[ "$FILE_PATH" == *"TODO"* ]] || [[ "$FILE_PATH" == *"CHECKLIST"* ]]; then
    echo "⚠️  Planning Document Detected: $(basename $FILE_PATH)"
    echo "   Ask yourself: Is this necessary or just procrastination?"
    echo "   Remember: GPT didn't create 94,000 planning files."
fi

# Rule 4: Warn about experimental directories
if [[ "$FILE_PATH" == *"/experimental/"* ]] || [[ "$FILE_PATH" == *"/proof-of-concept/"* ]] || \
   [[ "$FILE_PATH" == *"/test-framework/"* ]] || [[ "$FILE_PATH" == *"/verification-system/"* ]]; then
    echo "⚠️  Experimental System Detected"
    echo "   Use existing tools instead of building new frameworks."
fi

# Log file creation for potential cleanup
echo "$(date +%Y-%m-%d-%H:%M:%S) $FILE_PATH" >> "/tmp/claude-created-files-$(date +%Y%m%d).log"

exit 0