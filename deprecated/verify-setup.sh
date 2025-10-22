#!/bin/bash

echo "🔍 VERIFYING CLAUDE CODE SETUP"
echo ""

ALL_GOOD=true

# Check Xcode path
echo "📱 iOS Development:"
XCODE_PATH=$(xcode-select -p 2>/dev/null)
if [[ "$XCODE_PATH" == "/Applications/Xcode.app/Contents/Developer" ]]; then
    echo "✅ Xcode path: $XCODE_PATH"
    XCODE_VERSION=$(xcodebuild -version 2>/dev/null | head -1)
    echo "   $XCODE_VERSION"
else
    echo "❌ Xcode path incorrect: $XCODE_PATH"
    echo "   Run: sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer"
    ALL_GOOD=false
fi
echo ""

# Check agents
echo "🤖 Agents:"
if [ -d ~/.claude/agents ]; then
    AGENT_COUNT=$(find ~/.claude/agents -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$AGENT_COUNT" -gt 0 ]; then
        echo "✅ Found: $AGENT_COUNT agent(s)"
    else
        echo "⚠️  No agents found in ~/.claude/agents"
    fi
else
    echo "❌ Directory not found: ~/.claude/agents"
    ALL_GOOD=false
fi
echo ""

# Check commands
echo "📝 Commands:"
if [ -d ~/.claude/commands ]; then
    CMD_COUNT=$(find ~/.claude/commands -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$CMD_COUNT" -gt 0 ]; then
        echo "✅ Found: $CMD_COUNT command(s)"
    else
        echo "⚠️  No commands found in ~/.claude/commands"
    fi
else
    echo "❌ Directory not found: ~/.claude/commands"
    ALL_GOOD=false
fi
echo ""

# Check skills
echo "📚 Skills:"
if [ -d ~/.claude/skills ]; then
    SKILL_COUNT=$(find ~/.claude/skills -name "SKILL.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$SKILL_COUNT" -gt 0 ]; then
        echo "✅ Found: $SKILL_COUNT skill(s)"
    else
        echo "⚠️  No skills found in ~/.claude/skills"
    fi
else
    echo "⚠️  Directory not found: ~/.claude/skills"
fi
echo ""

# Check design inspiration
echo "🎨 Design Inspiration:"
if [ -d ~/.claude/design-inspiration ]; then
    SCREENSHOT_COUNT=$(find ~/.claude/design-inspiration -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$SCREENSHOT_COUNT" -gt 0 ]; then
        echo "✅ Gallery exists: $SCREENSHOT_COUNT screenshots"

        # Check categories
        for category in landing protocols components typography interactions; do
            CAT_COUNT=$(find ~/.claude/design-inspiration/$category -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
            if [ "$CAT_COUNT" -gt 0 ]; then
                echo "   $category/: $CAT_COUNT screenshots"
            fi
        done
    else
        echo "⚠️  Gallery exists but no screenshots found"
    fi
else
    echo "⚠️  Gallery not found: ~/.claude/design-inspiration"
fi
echo ""

# Check MCP config
echo "🔌 MCP Servers:"
MCP_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
if [ -f "$MCP_CONFIG" ]; then
    echo "✅ Config found: claude_desktop_config.json"

    # Count MCP servers
    if command -v jq &> /dev/null; then
        MCP_COUNT=$(jq '.mcpServers | length' "$MCP_CONFIG" 2>/dev/null)
        if [ "$MCP_COUNT" ]; then
            echo "   Configured servers: $MCP_COUNT"
        fi
    else
        echo "   (Install 'jq' to see server count)"
    fi
else
    echo "⚠️  MCP config not found"
fi
echo ""

# Final verdict
if [ "$ALL_GOOD" = true ]; then
    echo "✅ VERIFICATION COMPLETE - All critical components ready"
    exit 0
else
    echo "⚠️  VERIFICATION COMPLETE - Some issues found (see above)"
    exit 1
fi
