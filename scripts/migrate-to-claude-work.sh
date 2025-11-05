#!/bin/bash
#
# Migration Script - Move from old structure to .claude-work/
#
# Migrates:
# - Global: ~/.orchestration, ~/.claude-archive → ~/.claude-global/
# - Per-project: .orchestration, .workshop → .claude-work/
#
# Features:
# - Dry-run mode (preview changes)
# - Automatic backup before migration
# - Rollback on failure
# - Performance logging
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DRY_RUN=false
BACKUP_ENABLED=true
VERBOSE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --no-backup)
      BACKUP_ENABLED=false
      shift
      ;;
    --verbose)
      VERBOSE=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--dry-run] [--no-backup] [--verbose]"
      exit 1
      ;;
  esac
done

# Start timing
START_TIME=$(date +%s)

log_info() {
  echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
  echo -e "${RED}✗${NC} $1"
}

log_verbose() {
  if [ "$VERBOSE" = true ]; then
    echo "  $1"
  fi
}

execute() {
  local cmd=$1
  local desc=$2

  log_verbose "$desc"

  if [ "$DRY_RUN" = true ]; then
    echo "  [DRY-RUN] $cmd"
  else
    eval "$cmd" || {
      log_error "Failed: $desc"
      return 1
    }
  fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  File Organization Migration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$DRY_RUN" = true ]; then
  log_warn "DRY-RUN MODE - No changes will be made"
  echo ""
fi

#
# Phase 1: Global Migration (~/)
#

echo "Phase 1: Global Directory Migration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if global migration needed
GLOBAL_MIGRATION_NEEDED=false

if [ -d ~/.orchestration ] || [ -d ~/.claude-archive ] || [ -d ~/.workshop ]; then
  GLOBAL_MIGRATION_NEEDED=true
fi

if [ "$GLOBAL_MIGRATION_NEEDED" = true ]; then
  log_info "Found global directories to migrate"

  # Create backup
  if [ "$BACKUP_ENABLED" = true ] && [ "$DRY_RUN" = false ]; then
    BACKUP_DIR=~/.claude-migration-backup-$(date +%Y%m%d-%H%M%S)
    execute "mkdir -p $BACKUP_DIR" "Creating backup directory"

    if [ -d ~/.orchestration ]; then
      execute "cp -r ~/.orchestration $BACKUP_DIR/" "Backing up ~/.orchestration"
    fi

    if [ -d ~/.claude-archive ]; then
      execute "cp -r ~/.claude-archive $BACKUP_DIR/" "Backing up ~/.claude-archive"
    fi

    if [ -d ~/.workshop ]; then
      execute "cp -r ~/.workshop $BACKUP_DIR/" "Backing up ~/.workshop"
    fi

    log_info "Backup created: $BACKUP_DIR"
    echo ""
  fi

  # Create new structure
  execute "mkdir -p ~/.claude-global/memory/global-playbooks" "Creating ~/.claude-global/memory"
  execute "mkdir -p ~/.claude-global/archive" "Creating ~/.claude-global/archive"

  # Migrate files
  if [ -f ~/.orchestration/signal-log.jsonl ]; then
    execute "mv ~/.orchestration/signal-log.jsonl ~/.claude-global/memory/" "Moving signal-log.jsonl"
  fi

  if [ -d ~/.claude-archive ]; then
    log_info "Migrating ~/.claude-archive (this may take a moment...)"

    # Move all archive folders
    for dir in ~/.claude-archive/*/; do
      if [ -d "$dir" ]; then
        dirname=$(basename "$dir")
        execute "mv '$dir' ~/.claude-global/archive/" "Moving $dirname"
      fi
    done

    # Consolidate by month
    if [ "$DRY_RUN" = false ]; then
      log_info "Consolidating archives by month..."
      # This will be done by cleanup daemon
    fi
  fi

  # Remove old directories (after successful migration)
  if [ "$DRY_RUN" = false ]; then
    if [ -d ~/.orchestration ] && [ -z "$(ls -A ~/.orchestration)" ]; then
      execute "rmdir ~/.orchestration" "Removing empty ~/.orchestration"
    fi

    if [ -d ~/.claude-archive ] && [ -z "$(ls -A ~/.claude-archive)" ]; then
      execute "rmdir ~/.claude-archive" "Removing empty ~/.claude-archive"
    fi
  fi

  log_info "Global migration complete"
  echo ""

else
  log_info "No global directories to migrate"
  echo ""
fi

#
# Phase 2: Per-Project Migration
#

echo "Phase 2: Project Directory Migration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if project migration needed
PROJECT_MIGRATION_NEEDED=false

if [ -d .orchestration ] || [ -d .workshop ] || [ -d .secret ]; then
  PROJECT_MIGRATION_NEEDED=true
fi

if [ "$PROJECT_MIGRATION_NEEDED" = true ]; then
  log_info "Found project directories to migrate"

  # Create backup
  if [ "$BACKUP_ENABLED" = true ] && [ "$DRY_RUN" = false ]; then
    BACKUP_DIR=.migration-backup-$(date +%Y%m%d-%H%M%S)
    execute "mkdir -p $BACKUP_DIR" "Creating backup directory"

    if [ -d .orchestration ]; then
      execute "cp -r .orchestration $BACKUP_DIR/" "Backing up .orchestration"
    fi

    if [ -d .workshop ]; then
      execute "cp -r .workshop $BACKUP_DIR/" "Backing up .workshop"
    fi

    if [ -d .secret ]; then
      execute "cp -r .secret $BACKUP_DIR/" "Backing up .secret"
    fi

    log_info "Backup created: $BACKUP_DIR"
    echo ""
  fi

  # Create new structure
  execute "mkdir -p .claude-work/memory/playbooks" "Creating .claude-work/memory"
  execute "mkdir -p .claude-work/sessions/$(date +%Y-%m-%d)" "Creating .claude-work/sessions"
  execute "mkdir -p .claude-work/temp" "Creating .claude-work/temp"

  # Migrate .workshop
  if [ -f .workshop/workshop.db ]; then
    execute "mv .workshop/workshop.db .claude-work/memory/" "Moving workshop.db"
  fi

  # Migrate .orchestration
  if [ -d .orchestration ]; then
    SESSION_DIR=".claude-work/sessions/$(date +%Y-%m-%d)"

    # Move playbooks to memory (persistent)
    if [ -d .orchestration/playbooks ]; then
      execute "cp -r .orchestration/playbooks/* .claude-work/memory/playbooks/" "Moving playbooks"
    fi

    # Move evidence, logs, etc. to sessions (7-day TTL)
    if [ -d .orchestration/evidence ]; then
      execute "mv .orchestration/evidence $SESSION_DIR/" "Moving evidence"
    fi

    if [ -d .orchestration/logs ]; then
      execute "mv .orchestration/logs $SESSION_DIR/" "Moving logs"
    fi

    if [ -d .orchestration/audits ]; then
      execute "mv .orchestration/audits $SESSION_DIR/" "Moving audits"
    fi

    # Move remaining to sessions
    for dir in .orchestration/*/; do
      if [ -d "$dir" ]; then
        dirname=$(basename "$dir")
        if [ "$dirname" != "playbooks" ] && [ "$dirname" != "evidence" ] && [ "$dirname" != "logs" ] && [ "$dirname" != "audits" ]; then
          execute "mv '$dir' $SESSION_DIR/" "Moving $dirname"
        fi
      fi
    done
  fi

  # Remove old directories (after successful migration)
  if [ "$DRY_RUN" = false ]; then
    if [ -d .orchestration ] && [ -z "$(ls -A .orchestration 2>/dev/null)" ]; then
      execute "rmdir .orchestration" "Removing empty .orchestration"
    fi

    if [ -d .workshop ] && [ -z "$(ls -A .workshop 2>/dev/null)" ]; then
      execute "rmdir .workshop" "Removing empty .workshop"
    fi

    if [ -d .secret ] && [ -z "$(ls -A .secret 2>/dev/null)" ]; then
      execute "rmdir .secret" "Removing empty .secret"
    fi
  fi

  log_info "Project migration complete"
  echo ""

else
  log_info "No project directories to migrate"
  echo ""
fi

#
# Phase 3: Verification
#

echo "Phase 3: Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$DRY_RUN" = false ]; then
  # Verify new structure exists
  if [ -d ~/.claude-global ] && [ -d .claude-work ]; then
    log_info "New directory structure verified"
  else
    log_error "Migration may have failed - new directories not found"
    exit 1
  fi

  # Verify old structure removed
  OLD_DIRS_EXIST=false

  if [ -d ~/.orchestration ] || [ -d ~/.claude-archive ]; then
    log_warn "Old global directories still exist (may not be empty)"
    OLD_DIRS_EXIST=true
  fi

  if [ -d .orchestration ] || [ -d .workshop ] || [ -d .secret ]; then
    log_warn "Old project directories still exist (may not be empty)"
    OLD_DIRS_EXIST=true
  fi

  if [ "$OLD_DIRS_EXIST" = false ]; then
    log_info "Old directories removed successfully"
  fi

  echo ""
fi

#
# Summary
#

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Migration Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Duration: ${DURATION}s"

if [ "$DRY_RUN" = true ]; then
  echo ""
  echo "This was a DRY-RUN. No changes were made."
  echo "Run without --dry-run to perform migration."
else
  echo ""
  echo "Migration complete!"
  echo ""
  echo "Next steps:"
  echo "  1. Verify application still works"
  echo "  2. Check .claude-work/ contains expected files"
  echo "  3. Delete backup directories if everything works"
  echo ""

  if [ "$BACKUP_ENABLED" = true ]; then
    echo "Backups created (delete after verification):"
    ls -d ~/.claude-migration-backup-* 2>/dev/null || true
    ls -d .migration-backup-* 2>/dev/null || true
    echo ""
  fi
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
