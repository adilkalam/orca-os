#!/bin/bash

# CRITICAL: Identify this repository's purpose at session start
if [[ "$PWD" == *"claude-vibe-code"* ]] || [[ "$PWD" == *"claude-vibe-config"* ]]; then
    echo "⚠️ CONFIG ADMIN TOOL - NOT A REGULAR PROJECT ⚠️"
    echo "This repo MANAGES configurations that deploy to ~/.claude"
    echo "- Agents/commands/MCPs install to ~/.claude GLOBALLY"
    echo "- _explore/ is READ-ONLY - personal folder"
    echo "- Check ~/.claude.json for global MCP configs, not local files"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi