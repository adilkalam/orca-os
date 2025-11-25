#!/usr/bin/env bash
#
# migrate-to-claude-dir.sh - DEPRECATED
#
# This script has been replaced by init-memory.sh
# Keeping for backwards compatibility
#

echo "Note: This script is deprecated. Using init-memory.sh instead."
echo ""

# Call the new init-memory script
exec bash "$(dirname "$0")/init-memory.sh" "$@"

# Original code below (no longer executed)
exit 0

set -euo pipefail

# Migrate to .claude/ directory structure
# Creates proper memory system layout and initializes databases

echo "═══════════════════════════════════════════════════════════"
echo "Migrating to .claude/ directory structure"
echo "═══════════════════════════════════════════════════════════"

# Get project root
ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT_DIR"

echo "Project: $(basename "$ROOT_DIR")"

# Create directory structure
echo "→ Creating .claude/ directories..."
mkdir -p .claude/memory
mkdir -p .claude/orchestration/{temp,evidence,playbooks,reference,orca-commands}
mkdir -p .claude/cache
mkdir -p .claude/hooks
mkdir -p .claude/scripts

# Migrate existing Workshop database if it exists
if [ -d ".workshop" ] && [ -f ".workshop/workshop.db" ]; then
    echo "→ Migrating existing Workshop database..."
    cp -r .workshop/* .claude/memory/ 2>/dev/null || true
    echo "  ✓ Workshop database migrated"
fi

# Initialize Workshop if needed
if [ ! -f ".claude/memory/workshop.db" ]; then
    echo "→ Initializing Workshop..."
    if command -v workshop >/dev/null 2>&1; then
        workshop --workspace .claude/memory init >/dev/null 2>&1 || true
        echo "  ✓ Workshop initialized"
    else
        echo "  ⚠ Workshop CLI not found - install with: npm install -g @workshop/cli"
    fi
fi

# Initialize vibe.db
if [ ! -f ".claude/memory/vibe.db" ]; then
    echo "→ Creating vibe.db..."
    python3 ~/.claude/scripts/memory-index.py --init --db .claude/memory/vibe.db
    echo "  ✓ vibe.db initialized"
fi

# Create CLAUDE.md if it doesn't exist
if [ ! -f ".claude/CLAUDE.md" ] && [ ! -f "CLAUDE.md" ]; then
    echo "→ Creating CLAUDE.md template..."
    cat > .claude/CLAUDE.md << 'EOF'
# Project Instructions

## Project Overview
[Add project description here]

## Key Decisions
[Document architectural decisions here]

## Important Context
[Add any context Claude should know]
EOF
    echo "  ✓ CLAUDE.md created"
fi

# Update .gitignore
if [ -f ".gitignore" ]; then
    if ! grep -q "^\.claude/cache/" .gitignore 2>/dev/null; then
        echo "→ Updating .gitignore..."
        cat >> .gitignore << 'EOF'

# Claude Code memory system
.claude/cache/
.claude/orchestration/temp/
.claude/memory/*.db-shm
.claude/memory/*.db-wal
EOF
        echo "  ✓ .gitignore updated"
    fi
fi

# Summary
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ Migration Complete"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Structure created:"
echo "  .claude/"
echo "  ├── memory/         → Databases (workshop.db, vibe.db)"
echo "  ├── orchestration/  → Working files"
echo "  ├── cache/          → Context caching"
echo "  └── CLAUDE.md       → Project instructions"
echo ""

# Test Workshop
if command -v workshop >/dev/null 2>&1; then
    echo "Workshop status:"
    workshop --workspace .claude/memory recent --limit 3 2>/dev/null || echo "  No entries yet"
fi

echo ""
echo "Next steps:"
echo "1. Add project context to .claude/CLAUDE.md"
echo "2. Start recording decisions: workshop --workspace .claude/memory decision '<text>'"
echo "3. Memory will auto-load on next session"