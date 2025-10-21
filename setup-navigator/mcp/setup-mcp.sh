#!/bin/bash

# Setup Navigator - MCP Installation Script

echo "🚀 Setup Navigator - Installing MCP Server"
echo ""

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install --break-system-packages mcp

# Make server executable
chmod +x server.py

# Get the absolute path
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVER_PATH="$SCRIPT_DIR/server.py"

echo ""
echo "✅ MCP dependencies installed!"
echo ""
echo "📝 Next step: Add to your Claude Desktop config"
echo ""
echo "Add this to ~/Library/Application Support/Claude/claude_desktop_config.json:"
echo ""
echo "{"
echo "  \"mcpServers\": {"
echo "    \"setup-navigator\": {"
echo "      \"command\": \"python3\","
echo "      \"args\": [\"$SERVER_PATH\"]"
echo "    }"
echo "  }"
echo "}"
echo ""
echo "🔄 Then restart Claude Desktop"
echo ""
