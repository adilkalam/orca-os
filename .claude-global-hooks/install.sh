#!/bin/bash

# Global Hooks Installer for claude-vibe-code
# Installs global Claude Code hooks to ~/.claude/hooks/

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GLOBAL_HOOKS_DIR="$HOME/.claude/hooks"
GLOBAL_ASSETS_DIR="$HOME/.claude/ace"

echo "🔧 Installing global Claude Code hooks..."
echo

# Create global hooks directory
mkdir -p "$GLOBAL_HOOKS_DIR"
echo "✅ Created $GLOBAL_HOOKS_DIR"

# Install SessionStart hook (canonical)
cp "$SCRIPT_DIR/SessionStart.sh" "$GLOBAL_HOOKS_DIR/SessionStart.sh"
chmod +x "$GLOBAL_HOOKS_DIR/SessionStart.sh"
echo "✅ Installed SessionStart.sh (Workshop auto-loader)"

# Backward-compat wrapper: session-start.sh (lowercase + hyphen)
cat > "$GLOBAL_HOOKS_DIR/session-start.sh" <<'SH'
#!/bin/sh
exec "$(dirname "$0")/SessionStart.sh" "$@"
SH
chmod +x "$GLOBAL_HOOKS_DIR/session-start.sh"
echo "↪️  Installed session-start.sh wrapper"

# Install SessionEnd hook (canonical)
cp "$SCRIPT_DIR/SessionEnd.sh" "$GLOBAL_HOOKS_DIR/SessionEnd.sh"
chmod +x "$GLOBAL_HOOKS_DIR/SessionEnd.sh"
echo "✅ Installed SessionEnd.sh (Workshop auto-import)"

# Backward-compat wrapper: session-end.sh (lowercase + hyphen)
cat > "$GLOBAL_HOOKS_DIR/session-end.sh" <<'SH'
#!/bin/sh
exec "$(dirname "$0")/SessionEnd.sh" "$@"
SH
chmod +x "$GLOBAL_HOOKS_DIR/session-end.sh"
echo "↪️  Installed session-end.sh wrapper"

# Install ACE Playbooks global assets (~/.claude/ace)
# Also migrate from any previous ~/.claude-global/ace if present
LEGACY_GLOBAL_ASSETS="$HOME/.claude-global/ace"
if [ -d "$LEGACY_GLOBAL_ASSETS" ] && [ ! -d "$GLOBAL_ASSETS_DIR" ]; then
  mkdir -p "$(dirname "$GLOBAL_ASSETS_DIR")"
  mv "$LEGACY_GLOBAL_ASSETS" "$GLOBAL_ASSETS_DIR"
  echo "↪️  Migrated legacy assets from $LEGACY_GLOBAL_ASSETS to $GLOBAL_ASSETS_DIR"
fi

mkdir -p "$GLOBAL_ASSETS_DIR/templates" "$GLOBAL_ASSETS_DIR"
cp "$SCRIPT_DIR/../hooks/load-playbooks.sh" "$GLOBAL_ASSETS_DIR/load-playbooks.sh"
chmod +x "$GLOBAL_ASSETS_DIR/load-playbooks.sh"
rsync -a "$SCRIPT_DIR/../.orchestration/playbooks/" "$GLOBAL_ASSETS_DIR/templates/" >/dev/null 2>&1 || true
echo "✅ Installed ACE assets to $GLOBAL_ASSETS_DIR (loader + templates)"

echo
echo "🎉 Global hooks installed successfully!"
echo

# Verify Workshop is installed
if command -v workshop &> /dev/null; then
    WORKSHOP_VERSION=$(workshop --version 2>&1 || echo "unknown")
    echo "✅ Workshop CLI found: $WORKSHOP_VERSION"
else
    echo "⚠️  Workshop CLI not found"
    echo
    echo "Install Workshop to enable memory system:"
    echo "  pipx install claude-workshop"
    echo
fi

echo
echo "Next steps:"
echo "1. Start a new Claude Code session in any project"
echo "2. You should see: 📝 Workshop Context Available"
echo "3. Workshop will auto-initialize in new projects"
echo
