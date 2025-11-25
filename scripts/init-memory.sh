#!/usr/bin/env bash
#
# init-memory.sh - Initialize OS 2.2 Memory Architecture
#
# Sets up the complete .claude/ memory system in a project:
# - Directory structure
# - Workshop database (session memory)
# - vibe.db (code context)
# - project-meta initialization
# - CLAUDE.md template
#
# Usage:
#   bash ~/.claude/scripts/init-memory.sh [project_path]
#
# If project_path not provided, uses current directory or git root

set -uo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_status() { echo -e "${BLUE}→${NC} $1"; }
echo_success() { echo -e "  ${GREEN}✓${NC} $1"; }
echo_warning() { echo -e "  ${YELLOW}⚠${NC} $1"; }
echo_error() { echo -e "  ${RED}✗${NC} $1"; }

# ═══════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════

# Get project root
if [ -n "${1:-}" ]; then
    ROOT_DIR="$1"
elif git rev-parse --show-toplevel >/dev/null 2>&1; then
    ROOT_DIR="$(git rev-parse --show-toplevel)"
else
    ROOT_DIR="$(pwd)"
fi

cd "$ROOT_DIR" || exit 1
PROJECT_NAME="$(basename "$ROOT_DIR")"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Initializing OS 2.2 Memory Architecture"
echo "═══════════════════════════════════════════════════════════"
echo "  Project: $PROJECT_NAME"
echo "  Path: $ROOT_DIR"
echo "═══════════════════════════════════════════════════════════"
echo ""

# ═══════════════════════════════════════════════════════════
# STEP 1: Create Directory Structure
# ═══════════════════════════════════════════════════════════

echo_status "Creating .claude/ directory structure..."

mkdir -p .claude/memory
mkdir -p .claude/orchestration/temp
mkdir -p .claude/orchestration/evidence
mkdir -p .claude/cache
mkdir -p .claude/hooks

echo_success "Directory structure created"

# ═══════════════════════════════════════════════════════════
# STEP 2: Initialize Workshop
# ═══════════════════════════════════════════════════════════

echo_status "Initializing Workshop database..."

# Migrate existing .workshop if present
if [ -d ".workshop" ] && [ -f ".workshop/workshop.db" ] && [ ! -f ".claude/memory/workshop.db" ]; then
    cp .workshop/workshop.db .claude/memory/workshop.db 2>/dev/null || true
    echo_success "Migrated existing Workshop database"
fi

# Initialize Workshop
if command -v workshop >/dev/null 2>&1; then
    if [ ! -f ".claude/memory/workshop.db" ]; then
        workshop --workspace .claude/memory init >/dev/null 2>&1 || true
    fi

    # Clean up redundant Workshop files (we use global hooks instead)
    rm -f .claude/workshop-session-start.sh 2>/dev/null
    rm -f .claude/workshop-session-end.sh 2>/dev/null
    rm -f .claude/workshop-pre-compact.sh 2>/dev/null
    rm -f .claude/settings.json 2>/dev/null
    rm -f .claude/settings.local.json 2>/dev/null
    rm -f .claude/README.md 2>/dev/null
    rm -rf .claude/commands 2>/dev/null

    echo_success "Workshop ready at .claude/memory/workshop.db"
else
    echo_warning "Workshop CLI not found - install with: cargo install workshop"
fi

# ═══════════════════════════════════════════════════════════
# STEP 3: Initialize vibe.db
# ═══════════════════════════════════════════════════════════

echo_status "Initializing vibe.db (code context)..."

if [ -f "$HOME/.claude/scripts/vibe-sync.py" ]; then
    if [ ! -f ".claude/memory/vibe.db" ]; then
        python3 "$HOME/.claude/scripts/vibe-sync.py" init 2>/dev/null || true
    fi
    if [ -f ".claude/memory/vibe.db" ]; then
        echo_success "vibe.db ready at .claude/memory/vibe.db"
    else
        echo_warning "vibe.db initialization failed (run: python3 ~/.claude/scripts/vibe-sync.py init)"
    fi
else
    echo_warning "vibe-sync.py not found - vibe.db not initialized"
fi

# ═══════════════════════════════════════════════════════════
# STEP 4: Create project-meta marker
# ═══════════════════════════════════════════════════════════

echo_status "Setting up project-meta..."

# Create a marker file for project-meta initialization
# Actual initialization happens via MCP on first use
INIT_MARKER=".claude/cache/.project-meta-init"
if [ ! -f "$INIT_MARKER" ]; then
    cat > "$INIT_MARKER" << EOF
{
  "initialized": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "2.2",
  "projectPath": "$ROOT_DIR"
}
EOF
fi
echo_success "project-meta marker created"

# ═══════════════════════════════════════════════════════════
# STEP 5: Create CLAUDE.md Template
# ═══════════════════════════════════════════════════════════

echo_status "Checking CLAUDE.md..."

if [ ! -f ".claude/CLAUDE.md" ] && [ ! -f "CLAUDE.md" ]; then
    cat > ".claude/CLAUDE.md" << 'EOF'
# Project Instructions

## Overview
[Brief project description - what this project does]

## Architecture
[Key architectural decisions and patterns]

## Conventions
[Coding standards and naming conventions]

## Important Context
[Any context Claude should know for this project]

---

## Memory System (OS 2.2)

This project uses the OS 2.2 memory architecture:

| Component | Location | Purpose |
|-----------|----------|---------|
| Workshop | `.claude/memory/workshop.db` | Session memory (decisions, gotchas, learnings) |
| vibe.db | `.claude/memory/vibe.db` | Code context (embeddings, components) |
| project-meta | MCP cache | Stable project metadata |
| ProjectContext | MCP | Task bundler (reads from all sources) |

### Quick Commands

```bash
# Find past decisions
workshop --workspace .claude/memory why "<topic>"

# Record a decision
workshop --workspace .claude/memory decision "<decision>" -r "<reasoning>"

# Record a gotcha/warning
workshop --workspace .claude/memory gotcha "<warning>"

# View recent activity
workshop --workspace .claude/memory recent
```
EOF
    echo_success "Created .claude/CLAUDE.md template"
else
    echo_success "CLAUDE.md already exists"
fi

# ═══════════════════════════════════════════════════════════
# STEP 6: Update .gitignore
# ═══════════════════════════════════════════════════════════

echo_status "Updating .gitignore..."

GITIGNORE_ADDITIONS="
# Claude Code memory system (OS 2.2)
.claude/cache/
.claude/orchestration/temp/
.claude/memory/*.db-shm
.claude/memory/*.db-wal
"

if [ -f ".gitignore" ]; then
    if ! grep -q "Claude Code memory system" .gitignore 2>/dev/null; then
        echo "$GITIGNORE_ADDITIONS" >> .gitignore
        echo_success ".gitignore updated"
    else
        echo_success ".gitignore already configured"
    fi
else
    echo "$GITIGNORE_ADDITIONS" > .gitignore
    echo_success "Created .gitignore"
fi

# ═══════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════

echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "  ${GREEN}✓ Memory Architecture Initialized${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  .claude/"
echo "  ├── memory/"
echo "  │   ├── workshop.db    → Session memory (decisions, gotchas)"
echo "  │   └── vibe.db        → Code context (embeddings, components)"
echo "  ├── orchestration/"
echo "  │   ├── temp/          → Working files (auto-cleaned)"
echo "  │   └── evidence/      → Final artifacts"
echo "  ├── cache/             → Context caching"
echo "  └── CLAUDE.md          → Project instructions"
echo ""
echo "  MCPs (active in Claude Code):"
echo "  • project-meta         → Stable project metadata"
echo "  • project-context      → Task bundler"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Next Steps"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  1. Edit .claude/CLAUDE.md with project details"
echo ""
echo "  2. Record initial decision:"
echo "     workshop --workspace .claude/memory decision \\"
echo "       \"Initialized with OS 2.2 memory architecture\" \\"
echo "       -r \"Clean separation: Workshop for sessions, vibe.db for code\""
echo ""
echo "  3. Memory will auto-load on next Claude Code session"
echo ""

# Show Workshop status if available
if command -v workshop >/dev/null 2>&1; then
    echo "─────────────────────────────────────────────────────────────"
    echo "  Workshop Status:"
    workshop --workspace .claude/memory info 2>/dev/null || echo "  (No entries yet)"
fi
