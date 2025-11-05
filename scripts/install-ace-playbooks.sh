#!/usr/bin/env bash
set -euo pipefail

# Install ACE Playbooks support into another project.
# - Copies the loader script into <target>/hooks/
# - Copies playbook templates into <target>/.orchestration/playbooks/
# - Does NOT overwrite existing files (safe-by-default)
#
# Usage:
#   ./scripts/install-ace-playbooks.sh /path/to/project
#

if [ "${1:-}" = "" ]; then
  echo "Usage: $0 /absolute/or/relative/path/to/project" >&2
  exit 2
fi

SRC_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET_ROOT="$(cd "$1" && pwd)"

LOADER_SRC="$SRC_ROOT/hooks/load-playbooks.sh"
TEMPLATES_SRC="$SRC_ROOT/.orchestration/playbooks"

LOADER_DEST_DIR="$TARGET_ROOT/hooks"
LOADER_DEST="$LOADER_DEST_DIR/load-playbooks.sh"
TEMPLATES_DEST="$TARGET_ROOT/.orchestration/playbooks"

if [ ! -f "$LOADER_SRC" ]; then
  echo "Missing loader in source repo: $LOADER_SRC" >&2
  exit 1
fi

if [ ! -d "$TEMPLATES_SRC" ]; then
  echo "Missing templates in source repo: $TEMPLATES_SRC" >&2
  exit 1
fi

mkdir -p "$LOADER_DEST_DIR"
mkdir -p "$TEMPLATES_DEST"

# Copy loader (do not overwrite)
if [ -f "$LOADER_DEST" ]; then
  echo "✓ Loader already present: $LOADER_DEST"
else
  cp -p "$LOADER_SRC" "$LOADER_DEST"
  chmod +x "$LOADER_DEST"
  echo "✓ Installed loader: $LOADER_DEST"
fi

# Copy templates (do not overwrite existing files)
if command -v rsync >/dev/null 2>&1; then
  rsync -a --ignore-existing "$TEMPLATES_SRC/" "$TEMPLATES_DEST/" >/dev/null
else
  # Fallback: cp -n where available (macOS BSD cp supports -n from 10.15+)
  # If -n unsupported, we copy only *-template.* to reduce risk.
  if cp -n --help >/dev/null 2>&1; then
    cp -Rn "$TEMPLATES_SRC/"* "$TEMPLATES_DEST/" 2>/dev/null || true
  else
    find "$TEMPLATES_SRC" -maxdepth 1 -type f \( -name "*-template.json" -o -name "*-template.md" -o -name "universal-patterns*" \) \
      -exec bash -c 'dst="$0/${1##*/}"; [ -e "$dst" ] || cp -p "$1" "$dst"' "$TEMPLATES_DEST" {} \;
  fi
fi
echo "✓ Ensured templates in: $TEMPLATES_DEST"

cat <<MSG

Done.

Next steps in $TARGET_ROOT:
  1) Initialize playbooks (creates .claude-work/memory/playbooks/*):
       bash hooks/load-playbooks.sh
  2) Verify files exist:
       ls .claude-work/memory/playbooks
  3) (Optional) Auto-run on session start everywhere:
       bash $SRC_ROOT/.claude-global-hooks/install.sh

MSG

