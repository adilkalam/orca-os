#!/bin/bash

# Global Hooks Installer for claude-vibe-code
# Installs global Claude Code hooks to ~/.claude/hooks/

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GLOBAL_HOOKS_DIR="$HOME/.claude/hooks"

echo "🔧 Installing global Claude Code hooks..."
echo

# Create global hooks directory
mkdir -p "$GLOBAL_HOOKS_DIR"
echo "✅ Created $GLOBAL_HOOKS_DIR"

# Install SessionStart hook
cp "$SCRIPT_DIR/SessionStart.sh" "$GLOBAL_HOOKS_DIR/SessionStart.sh"
chmod +x "$GLOBAL_HOOKS_DIR/SessionStart.sh"
echo "✅ Installed SessionStart.sh (Workshop auto-loader)"

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
