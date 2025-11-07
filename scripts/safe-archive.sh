#!/usr/bin/env bash
set -euo pipefail

# Safe archive utility: moves old evidence/log files to .orchestration/_deprecated/
# Defaults: days=7, both evidence and logs
#
# Usage:
#   bash scripts/safe-archive.sh                  # archive files older than 7 days
#   bash scripts/safe-archive.sh --days 30        # archive files older than 30 days
#   bash scripts/safe-archive.sh --what evidence  # only evidence
#   bash scripts/safe-archive.sh --dry-run        # show what would be moved
#   bash scripts/safe-archive.sh --force          # do not prompt

DAYS=7
WHAT="both"   # evidence|logs|both
DRY_RUN=0
FORCE=0

while [ $# -gt 0 ]; do
  case "$1" in
    --days) DAYS="${2:-7}"; shift 2 ;;
    --what) WHAT="${2:-both}"; shift 2 ;;
    --dry-run) DRY_RUN=1; shift ;;
    --force) FORCE=1; shift ;;
    -h|--help)
      echo "Usage: $0 [--days N] [--what evidence|logs|both] [--dry-run] [--force]"; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

BASE=".orchestration"
EVID="$BASE/evidence"
LOGS="$BASE/logs"
DEST_BASE="$BASE/_deprecated/$(date -u '+%Y%m%d-%H%M%S')"

mkdir -p "$DEST_BASE/evidence" "$DEST_BASE/logs"

list_candidates() {
  local dir="$1"
  if [ -d "$dir" ]; then
    find "$dir" -type f -mtime +$DAYS 2>/dev/null || true
  fi
}

move_one() {
  local src="$1"; local destdir="$2"
  local rel
  rel=$(basename "$src")
  local dest="$destdir/$rel"
  if [ $DRY_RUN -eq 1 ]; then
    echo "DRY: mv '$src' '$dest'"
  else
    mv "$src" "$dest"
  fi
}

EFILES=()
LFILES=()
if [ "$WHAT" = "evidence" ] || [ "$WHAT" = "both" ]; then
  while IFS= read -r f; do [ -n "$f" ] && EFILES+=("$f"); done < <(list_candidates "$EVID")
fi
if [ "$WHAT" = "logs" ] || [ "$WHAT" = "both" ]; then
  while IFS= read -r f; do [ -n "$f" ] && LFILES+=("$f"); done < <(list_candidates "$LOGS")
fi

echo "📦 Safe Archive Preview (>$DAYS days):"
echo "  Evidence: ${#EFILES[@]} files"
echo "  Logs:     ${#LFILES[@]} files"

TOTAL=$(( ${#EFILES[@]} + ${#LFILES[@]} ))
if [ $TOTAL -eq 0 ]; then
  echo "Nothing to archive."
  exit 0
fi

if [ $DRY_RUN -eq 1 ]; then
  for f in "${EFILES[@]}"; do move_one "$f" "$DEST_BASE/evidence"; done
  for f in "${LFILES[@]}"; do move_one "$f" "$DEST_BASE/logs"; done
  exit 0
fi

if [ $FORCE -eq 0 ]; then
  read -p "Proceed to move $TOTAL file(s) to '$DEST_BASE'? (y/N) " -n 1 -r; echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled. No files moved."
    exit 1
  fi
fi

for f in "${EFILES[@]}"; do move_one "$f" "$DEST_BASE/evidence"; done
for f in "${LFILES[@]}"; do move_one "$f" "$DEST_BASE/logs"; done

echo "✅ Archived $TOTAL file(s) to $DEST_BASE"

