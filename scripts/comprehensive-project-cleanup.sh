#!/bin/bash

# Comprehensive Project Cleanup Script for OS 2.2
# Fixes ALL common issues with project structure
# Version: 2.0 - Complete cleanup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧹 Comprehensive Project Cleanup for OS 2.2${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Get current directory
PROJECT_DIR="$(pwd)"
echo -e "${YELLOW}📁 Project: $PROJECT_DIR${NC}"
echo ""

# Counter for actions
ACTIONS=0
FILES_MOVED=0

# Function to safely move files
safe_move() {
    local src="$1"
    local dest="$2"
    local desc="$3"

    if [ -e "$src" ]; then
        # Create destination directory if needed
        dest_dir=$(dirname "$dest")
        mkdir -p "$dest_dir"

        # Move the file/directory
        if mv "$src" "$dest" 2>/dev/null; then
            echo -e "  ${GREEN}✓${NC} $desc"
            ACTIONS=$((ACTIONS + 1))
            return 0
        else
            echo -e "  ${RED}✗${NC} Failed to move: $src"
            return 1
        fi
    else
        return 1
    fi
}

# ========================================
# PHASE 1: Create proper .claude structure
# ========================================
echo -e "${BLUE}📂 Phase 1: Setting up .claude directory structure...${NC}"

mkdir -p .claude/orchestration/temp
mkdir -p .claude/orchestration/evidence
mkdir -p .claude/orchestration/playbooks
mkdir -p .claude/orchestration/reference
mkdir -p .claude/memory
mkdir -p .claude/commands
mkdir -p .deprecated/pre-os2

echo -e "  ${GREEN}✓${NC} Directory structure created"
echo ""

# ========================================
# PHASE 2: Clean up misplaced orchestration folders
# ========================================
echo -e "${BLUE}🔍 Phase 2: Finding misplaced orchestration folders...${NC}"

# Check for .playwright-mcp/.orchestration
if [ -d ".playwright-mcp/.orchestration" ]; then
    echo -e "  ${YELLOW}→${NC} Found .playwright-mcp/.orchestration - migrating..."

    # Move evidence files
    if [ -d ".playwright-mcp/.orchestration/evidence" ]; then
        for file in .playwright-mcp/.orchestration/evidence/*; do
            if [ -f "$file" ]; then
                filename=$(basename "$file")
                safe_move "$file" ".claude/orchestration/evidence/$filename" "Moved evidence: $filename"
                FILES_MOVED=$((FILES_MOVED + 1))
            fi
        done
    fi

    # Clean up empty directories
    rmdir ".playwright-mcp/.orchestration/evidence" 2>/dev/null || true
    rmdir ".playwright-mcp/.orchestration" 2>/dev/null || true
    rmdir ".playwright-mcp" 2>/dev/null || true
else
    echo -e "  ${GREEN}•${NC} No .playwright-mcp/.orchestration found"
fi

# Check for other common misplaced folders
for dir in .orchestration orchestration; do
    if [ -d "$dir" ]; then
        echo -e "  ${YELLOW}→${NC} Found $dir in root - moving to .claude/"
        safe_move "$dir" ".claude/orchestration-migrated" "Moved $dir to .claude/"
        FILES_MOVED=$((FILES_MOVED + 1))
    fi
done

echo ""

# ========================================
# PHASE 3: Consolidate Workshop/Memory
# ========================================
echo -e "${BLUE}🔧 Phase 3: Consolidating Workshop and Memory...${NC}"

# If both .claude/workshop and .claude/memory exist, merge them
if [ -d ".claude/workshop" ] && [ -d ".claude/memory" ]; then
    echo -e "  ${YELLOW}→${NC} Found both .claude/workshop and .claude/memory - merging..."

    # Merge workshop.db files if both exist
    if [ -f ".claude/workshop/workshop.db" ] && [ -f ".claude/memory/workshop.db" ]; then
        # Backup the memory one, use workshop as primary
        cp .claude/memory/workshop.db .claude/memory/workshop.db.backup
        mv .claude/workshop/workshop.db .claude/memory/workshop.db.merged
        echo -e "  ${GREEN}✓${NC} Merged workshop.db files (backup created)"
    elif [ -f ".claude/workshop/workshop.db" ]; then
        mv .claude/workshop/workshop.db .claude/memory/
        echo -e "  ${GREEN}✓${NC} Moved workshop.db to memory/"
    fi

    # Move any remaining files from workshop to memory
    for file in .claude/workshop/*; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            if [ ! -f ".claude/memory/$filename" ]; then
                mv "$file" ".claude/memory/"
                echo -e "  ${GREEN}✓${NC} Moved $filename to memory/"
            fi
        fi
    done

    # Archive the workshop directory
    if [ "$(ls -A .claude/workshop 2>/dev/null)" ]; then
        safe_move ".claude/workshop" ".deprecated/pre-os2/workshop" "Archived .claude/workshop"
    else
        rmdir .claude/workshop
        echo -e "  ${GREEN}✓${NC} Removed empty .claude/workshop"
    fi
    ACTIONS=$((ACTIONS + 1))
elif [ -d ".claude/workshop" ]; then
    # Only workshop exists, rename to memory
    echo -e "  ${YELLOW}→${NC} Found .claude/workshop - renaming to .claude/memory"
    mv .claude/workshop .claude/memory
    echo -e "  ${GREEN}✓${NC} Renamed workshop to memory"
    ACTIONS=$((ACTIONS + 1))
else
    echo -e "  ${GREEN}•${NC} Memory structure already clean"
fi

# Handle old .workshop in root
if [ -d ".workshop" ]; then
    echo -e "  ${YELLOW}→${NC} Found .workshop in root - moving to .claude/memory"

    # If .claude/memory/workshop.db exists, backup first
    if [ -f ".claude/memory/workshop.db" ]; then
        cp .claude/memory/workshop.db .claude/memory/workshop.db.pre-migration
    fi

    # Copy workshop.db if it exists
    if [ -f ".workshop/workshop.db" ]; then
        cp .workshop/workshop.db .claude/memory/
        echo -e "  ${GREEN}✓${NC} Migrated workshop.db"
    fi

    # Archive old .workshop
    safe_move ".workshop" ".deprecated/pre-os2/workshop-root" "Archived root .workshop"
fi

echo ""

# ========================================
# PHASE 4: Clean up root-level Claude files
# ========================================
echo -e "${BLUE}📄 Phase 4: Organizing root-level files...${NC}"

# Move Claude-related .md files from root to .claude/
for file in CLAUDE.md AGENTS.md ORCA.md WARP.md KG-use.md; do
    if [ -f "$file" ] && [ "$file" != ".claude/CLAUDE.md" ]; then
        if [ "$file" = "CLAUDE.md" ] && [ -f ".claude/CLAUDE.md" ]; then
            # Special handling for CLAUDE.md - check if they're different
            if ! cmp -s "$file" ".claude/CLAUDE.md"; then
                echo -e "  ${YELLOW}⚠${NC}  Root CLAUDE.md differs from .claude/CLAUDE.md"
                safe_move "$file" ".deprecated/pre-os2/CLAUDE.md.root" "Archived root CLAUDE.md (different version)"
            else
                rm "$file"
                echo -e "  ${GREEN}✓${NC} Removed duplicate CLAUDE.md from root"
                ACTIONS=$((ACTIONS + 1))
            fi
        else
            safe_move "$file" ".claude/reference/$file" "Moved $file to .claude/reference/"
            FILES_MOVED=$((FILES_MOVED + 1))
        fi
    fi
done

echo ""

# ========================================
# PHASE 5: Clean up old session files
# ========================================
echo -e "${BLUE}🗑️  Phase 5: Cleaning session backups...${NC}"

BACKUPS_FOUND=0
for file in .claude-session-context.md.backup* .session-context-*.md *-session-*.md; do
    if [ -f "$file" ]; then
        rm -f "$file"
        BACKUPS_FOUND=$((BACKUPS_FOUND + 1))
        echo -e "  ${GREEN}•${NC} Removed: $file"
    fi
done

if [ $BACKUPS_FOUND -gt 0 ]; then
    echo -e "  ${GREEN}✓${NC} Removed $BACKUPS_FOUND backup files"
    ACTIONS=$((ACTIONS + 1))
else
    echo -e "  ${GREEN}•${NC} No backup files found"
fi

echo ""

# ========================================
# PHASE 6: Archive old Claude folders
# ========================================
echo -e "${BLUE}📦 Phase 6: Archiving legacy folders...${NC}"

for dir in .claude-work .claude.bak .vibe .claude-sessions; do
    if [ -d "$dir" ]; then
        safe_move "$dir" ".deprecated/pre-os2/$dir" "Archived $dir"
    fi
done

echo ""

# ========================================
# PHASE 7: Clean temp directories
# ========================================
echo -e "${BLUE}🧹 Phase 7: Cleaning temp directories...${NC}"

if [ -d ".claude/orchestration/temp" ]; then
    temp_count=$(find .claude/orchestration/temp -type f 2>/dev/null | wc -l)
    if [ $temp_count -gt 0 ]; then
        echo -e "  ${YELLOW}→${NC} Found $temp_count files in temp/ - cleaning..."
        rm -rf .claude/orchestration/temp/*
        echo -e "  ${GREEN}✓${NC} Cleaned temp directory"
        ACTIONS=$((ACTIONS + 1))
    else
        echo -e "  ${GREEN}•${NC} Temp directory already clean"
    fi
else
    echo -e "  ${GREEN}•${NC} No temp directory found"
fi

echo ""

# ========================================
# PHASE 8: Update .gitignore
# ========================================
echo -e "${BLUE}📝 Phase 8: Updating .gitignore...${NC}"

if [ -f ".gitignore" ]; then
    # Check if .deprecated is already in gitignore
    if ! grep -q "^\.deprecated" .gitignore 2>/dev/null; then
        echo -e "\n# OS 2.2 Cleanup\n.deprecated/" >> .gitignore
        echo -e "  ${GREEN}✓${NC} Added .deprecated/ to .gitignore"
        ACTIONS=$((ACTIONS + 1))
    else
        echo -e "  ${GREEN}•${NC} .gitignore already updated"
    fi

    # Add .claude/orchestration/temp if not present
    if ! grep -q "^\.claude/orchestration/temp" .gitignore 2>/dev/null; then
        echo ".claude/orchestration/temp/" >> .gitignore
        echo -e "  ${GREEN}✓${NC} Added .claude/orchestration/temp/ to .gitignore"
        ACTIONS=$((ACTIONS + 1))
    fi
else
    echo -e "  ${YELLOW}⚠${NC}  No .gitignore file found"
fi

echo ""

# ========================================
# PHASE 9: Verify final structure
# ========================================
echo -e "${BLUE}✅ Phase 9: Verifying final structure...${NC}"

ISSUES=0

# Check that .claude exists and has proper structure
if [ ! -d ".claude/orchestration/evidence" ]; then
    echo -e "  ${RED}✗${NC} Missing .claude/orchestration/evidence"
    ISSUES=$((ISSUES + 1))
fi

if [ ! -d ".claude/memory" ]; then
    echo -e "  ${RED}✗${NC} Missing .claude/memory"
    ISSUES=$((ISSUES + 1))
fi

# Check for remaining bad patterns
if [ -d ".workshop" ] || [ -d ".claude/workshop" ]; then
    echo -e "  ${RED}✗${NC} Old workshop directory still exists"
    ISSUES=$((ISSUES + 1))
fi

if [ -d ".playwright-mcp" ]; then
    echo -e "  ${RED}✗${NC} .playwright-mcp still exists"
    ISSUES=$((ISSUES + 1))
fi

if [ $ISSUES -eq 0 ]; then
    echo -e "  ${GREEN}✓${NC} All structures verified correct!"
else
    echo -e "  ${YELLOW}⚠${NC}  Found $ISSUES remaining issues"
fi

echo ""

# ========================================
# Summary
# ========================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ $ACTIONS -eq 0 ] && [ $FILES_MOVED -eq 0 ]; then
    echo -e "${GREEN}✨ Project already clean - no changes needed!${NC}"
else
    echo -e "${GREEN}✅ Cleanup complete!${NC}"
    echo ""
    echo -e "  ${BLUE}Actions taken:${NC} $ACTIONS"
    echo -e "  ${BLUE}Files moved:${NC} $FILES_MOVED"

    if [ -d ".deprecated/pre-os2" ]; then
        echo ""
        echo -e "${YELLOW}📦 Archived items in .deprecated/pre-os2/:${NC}"
        ls -1 .deprecated/pre-os2/ 2>/dev/null | while read item; do
            echo -e "  • $item"
        done
    fi

    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "  1. Run: ${BLUE}git status${NC}"
    echo -e "  2. Review changes"
    echo -e "  3. Commit: ${BLUE}git add -A && git commit -m \"Clean up project structure for OS 2.2\"${NC}"
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

exit 0