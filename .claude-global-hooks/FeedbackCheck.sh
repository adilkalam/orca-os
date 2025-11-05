#!/usr/bin/env bash
# FeedbackCheck hook - Loads recent feedback at session start

FEEDBACK_DIR="$PWD/.feedback"

if [ -d "$FEEDBACK_DIR" ] && [ -f "$FEEDBACK_DIR/session-feedback.md" ]; then
    # Check if there's critical feedback from last session
    if grep -q "CRITICAL\|STOP\|NEVER\|ALWAYS" "$FEEDBACK_DIR/session-feedback.md" 2>/dev/null; then
        echo "⚠️  Critical Feedback Reminder:"
        grep "CRITICAL\|STOP\|NEVER\|ALWAYS" "$FEEDBACK_DIR/session-feedback.md" | head -3
        echo "---"
        echo "Full feedback in .feedback/session-feedback.md"
    fi
fi

# Always remind about behavioral rules if they exist
if [ -f "$FEEDBACK_DIR/behavioral-rules.md" ]; then
    echo "📋 Behavioral Rules Active - Key reminder:"
    echo "• Stay in engineering role (build tools, don't use them)"
    echo "• /feedback is for behavior correction, not tasks"
fi