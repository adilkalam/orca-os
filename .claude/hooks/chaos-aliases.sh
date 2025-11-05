#!/bin/bash

# Chaos Prevention Aliases
# Add to your shell configuration (.bashrc, .zshrc, etc.)

# Monitor for messy patterns
alias chaos-monitor='bash ~/.claude/hooks/chaos-monitor.sh 2>/dev/null || bash ./.claude/hooks/chaos-monitor.sh 2>/dev/null || echo "Chaos monitor not found"'

# Clean up detected mess
alias chaos-cleanup='bash ~/.claude/hooks/chaos-cleanup.sh 2>/dev/null || bash ./.claude/hooks/chaos-cleanup.sh 2>/dev/null || echo "Chaos cleanup not found"'

# Quick check - just show stats
alias chaos-check='echo "📊 Quick Chaos Check:" && echo "Files created in last hour: $(find . -type f -mmin -60 2>/dev/null | grep -v -E "(node_modules|.git|.next)" | wc -l)" && echo "Planning docs: $(find . -name "*PLAN*.md" -o -name "*IMPLEMENTATION*.md" 2>/dev/null | wc -l)" && echo "Backup files: $(find . -name "*.bak" -o -name "*.backup*" 2>/dev/null | wc -l)"'

# Show creation log for today
alias chaos-log='cat /tmp/claude-created-files-$(date +%Y%m%d).log 2>/dev/null || echo "No files logged today"'