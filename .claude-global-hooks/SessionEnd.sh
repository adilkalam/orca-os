#!/bin/bash
# Workshop SessionEnd Hook - Auto-import new sessions
# Triggered at session end to capture session data

# Check if workshop is installed
if ! command -v workshop &> /dev/null; then
    exit 0  # Silent fail if workshop not installed
fi

# Check if .workshop exists (initialized)
if [ ! -d ".workshop" ]; then
    exit 0  # Not a Workshop-enabled project
fi

# Auto-import new sessions since last import
workshop import --execute &> /dev/null

exit 0
