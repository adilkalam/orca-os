#!/bin/bash
#
# Skill Catalog Setup Script
#
# Sets up the semantic skill catalog for Claude Code.
# Run this once after installation.
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_CATALOG_DIR="$SCRIPT_DIR"
CLAUDE_DIR="$(dirname "$SCRIPT_DIR")"

echo "============================================"
echo "Skill Catalog Setup"
echo "============================================"
echo ""

# Check Python
echo "[1/5] Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is required but not found."
    echo "Please install Python 3 and try again."
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
echo "       Found: $PYTHON_VERSION"

# Create/check virtual environment
echo ""
echo "[2/5] Setting up virtual environment..."
VENV_DIR="$SKILL_CATALOG_DIR/.venv"
VENV_PYTHON="$VENV_DIR/bin/python3"

if [ -d "$VENV_DIR" ] && [ -f "$VENV_PYTHON" ]; then
    echo "       Virtual environment exists"
else
    echo "       Creating virtual environment..."
    python3 -m venv "$VENV_DIR"
    echo "       Created at $VENV_DIR"
fi

# Install/check sentence-transformers in venv
echo ""
echo "[3/6] Checking sentence-transformers..."
if "$VENV_PYTHON" -c "import sentence_transformers" 2>/dev/null; then
    echo "       Already installed"
else
    echo "       Installing sentence-transformers..."
    "$VENV_DIR/bin/pip" install sentence-transformers --quiet
    echo "       Installed successfully"
fi

# Update shebangs to use venv python
echo ""
echo "[4/6] Configuring scripts..."
sed -i '' "1s|.*|#!$VENV_PYTHON|" "$SKILL_CATALOG_DIR/skill-index.py"
sed -i '' "1s|.*|#!$VENV_PYTHON|" "$SKILL_CATALOG_DIR/skill-discovery.py"
echo "       Updated script shebangs"

# Verify directories
echo ""
echo "[5/6] Verifying directories..."
mkdir -p "$SKILL_CATALOG_DIR/logs"
mkdir -p "$CLAUDE_DIR/skills"
echo "       $SKILL_CATALOG_DIR"
echo "       $SKILL_CATALOG_DIR/logs"
echo "       $CLAUDE_DIR/skills"

# Verify config
echo ""
echo "[6/6] Checking configuration..."
if [ -f "$SKILL_CATALOG_DIR/config.json" ]; then
    echo "       config.json exists"
else
    echo "       Creating default config.json..."
    cat > "$SKILL_CATALOG_DIR/config.json" << 'EOF'
{
  "enabled": true,
  "relevance_threshold": 0.25,
  "renotify_delta": 0.20,
  "max_skills_per_notification": 3,
  "hook_timeout_ms": 100,
  "model_name": "all-MiniLM-L6-v2",
  "skill_sources": [
    "~/.claude/skills",
    "<project>/.claude/skills"
  ],
  "precedence": "project-first",
  "log_level": "info"
}
EOF
    echo "       Created config.json"
fi

# Run initial index
echo ""
echo "Building skill index..."
echo "(This may take a moment on first run as the model downloads)"
"$SKILL_CATALOG_DIR/skill-index.py" index

# Summary
echo ""
echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "Available commands:"
echo "  /list-skills      - List all indexed skills"
echo "  /load-skill NAME  - Load a skill into context"
echo "  /reindex-skills   - Rebuild the index"
echo "  /skill-health     - Check system health"
echo ""
echo "To enable the discovery hook, add to ~/.claude/settings.json:"
echo ""
echo '  "hooks": {'
echo '    "PostToolUse": ['
echo '      {'
echo '        "matcher": "Read",'
echo '        "hooks": ['
echo '          {'
echo '            "type": "command",'
echo '            "command": "~/.claude/skill-catalog/skill-discovery.py"'
echo '          }'
echo '        ]'
echo '      }'
echo '    ]'
echo '  }'
echo ""
echo "Note: The hook is optional. Skills work without it via /load-skill."
echo ""
