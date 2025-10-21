#!/bin/bash

# Setup Navigator - Automatic MCP Installation

set -e

echo "🚀 Setup Navigator - MCP Installation"
echo "======================================"
echo ""

# Get absolute paths
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVER_PATH="$SCRIPT_DIR/mcp/server.py"
CONFIG_PATH="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

# 1. Install Python dependencies
echo "📦 Step 1/3: Installing Python dependencies..."
pip3 install --break-system-packages mcp >/dev/null 2>&1
echo "   ✅ Installed"
echo ""

# 2. Make server executable
chmod +x "$SERVER_PATH"

# 3. Add to Claude Desktop config
echo "📝 Step 2/3: Configuring Claude Desktop..."

if [ ! -f "$CONFIG_PATH" ]; then
    echo "   Creating new config file..."
    mkdir -p "$(dirname "$CONFIG_PATH")"
    echo "{}" > "$CONFIG_PATH"
fi

# Check if setup-navigator already exists
if grep -q "setup-navigator" "$CONFIG_PATH" 2>/dev/null; then
    echo "   ⚠️  setup-navigator already in config, skipping..."
else
    # Use Python to safely merge JSON
    python3 - <<EOF
import json
from pathlib import Path

config_path = Path("$CONFIG_PATH")
server_path = "$SERVER_PATH"

# Load existing config
with open(config_path, 'r') as f:
    config = json.load(f)

# Ensure mcpServers exists
if 'mcpServers' not in config:
    config['mcpServers'] = {}

# Add setup-navigator
config['mcpServers']['setup-navigator'] = {
    'command': 'python3',
    'args': [server_path]
}

# Save config
with open(config_path, 'w') as f:
    json.dump(config, f, indent=2)

print("   ✅ Added to config")
EOF
fi

echo ""
echo "🎯 Step 3/3: Running initial scan..."
cd "$SCRIPT_DIR"
node cli/scan.js > /dev/null 2>&1
echo "   ✅ Registry built"
echo ""

echo "======================================"
echo "✅ Installation Complete!"
echo "======================================"
echo ""
echo "📋 Available MCP Tools:"
echo "   • setup_scan        - Scan ~/.claude/ directory"
echo "   • setup_query       - Natural language search"
echo "   • setup_list_agents - List all agents (with filters)"
echo "   • setup_analyze     - Analyze for optimization"
echo "   • setup_docs        - Generate documentation"
echo ""
echo "🔄 Next: Restart Claude Desktop to activate MCP server"
echo ""
echo "💡 Try in Claude Code:"
echo "   \"Which agent should I use for iOS development?\""
echo "   \"Show me all Opus agents\""
echo "   \"Analyze my setup\""
echo ""
