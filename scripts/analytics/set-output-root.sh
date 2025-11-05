#!/usr/bin/env bash
# Helper to set analytics output root to Dropbox minisite path.
# Usage: source scripts/analytics/set-output-root.sh

export ANALYTICS_OUTPUT_ROOT="$HOME/Dropbox/MM x Adil Kalam/minisite/data/outputs"
mkdir -p "$ANALYTICS_OUTPUT_ROOT"
echo "ANALYTICS_OUTPUT_ROOT -> $ANALYTICS_OUTPUT_ROOT"
