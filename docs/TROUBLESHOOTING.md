# Troubleshooting Guide

**Common problems and solutions**

---

## Table of Contents

- [Setup Issues](#setup-issues)
- [Command Issues](#command-issues)
- [Agent Issues](#agent-issues)
- [Performance Issues](#performance-issues)
- [iOS Development Issues](#ios-development-issues)

---

## Setup Issues

### MCP Servers Not Loading

**Symptom:**
- No MCP badge in Claude Desktop
- Commands that require MCP tools fail

**Diagnosis:**

```bash
# Check MCP config exists
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Check MCP server logs
cat ~/Library/Logs/Claude/mcp*.log
```

**Solutions:**

**1. Verify JSON syntax:**

```bash
# Use JSONLint to validate config
# Copy config contents to: https://jsonlint.com/

# Common errors:
# - Missing commas between objects
# - Trailing comma on last item
# - Unclosed brackets
```

**Example - Invalid:**
```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },  ← Trailing comma causes error
  }
}
```

**Example - Valid:**
```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

**2. Restart Claude Desktop:**

```bash
# Quit completely (not just close window)
# Cmd+Q or Quit from menu

# Relaunch from Applications
open -a Claude
```

**3. Check server installation:**

```bash
# Test MCP server manually
npx -y @modelcontextprotocol/server-sequential-thinking

# Should not show errors
# If errors: npm install issues, check Node.js version
```

---

### Commands Not Recognized

**Symptom:**
```
You: /enhance "build dashboard"
Claude: I don't recognize that command
```

**Diagnosis:**

```bash
# Check commands directory exists
ls ~/.claude/commands/

# Check command files exist
ls ~/.claude/commands/enhance.md

# Check symlinks are correct
ls -la ~/.claude/commands/
```

**Solutions:**

**1. Verify command files:**

```bash
# List all commands
find ~/.claude/commands -name "*.md"

# Should show:
# enhance.md
# concept.md
# agentfeedback.md
# visual-review.md
# nav.md
# etc.

# If missing: Re-clone repository and link commands
```

**2. Fix symlinks:**

```bash
# Remove broken symlinks
rm ~/.claude/commands

# Re-create symlink
ln -s ~/path/to/claude-vibe-code/.claude/commands ~/.claude/commands

# Verify
ls -la ~/.claude/commands/
```

**3. Restart Claude Desktop:**

Commands are loaded on startup. Restart after fixing symlinks.

---

### Plugins Not Loading

**Symptom:**
- Skills not available
- Superpowers not working

**Diagnosis:**

```bash
# Check settings.json
cat ~/.claude/settings.json
```

**Solutions:**

**1. Enable plugins:**

Edit `~/.claude/settings.json`:

```json
{
  "enabledPlugins": {
    "superpowers@superpowers-marketplace": true,
    "claude-mem@thedotmack": true
  }
}
```

**2. Install missing plugins:**

```bash
# Install superpowers
# Visit: https://marketplace.claudecode.dev/

# Or use Leamas
~/leamas/leamas plugin@superpowers-marketplace
```

**3. Restart Claude Desktop**

---

## Command Issues

### /enhance Doesn't Auto-Detect Task

**Symptom:**

```
You: /enhance "build feature"
Claude: I'm not sure what type of task this is
```

**Solution:**

Be more specific in your prompt:

**❌ Vague:**
```bash
/enhance "make it better"
/enhance "fix the app"
```

**✅ Specific:**
```bash
/enhance "build React dashboard with charts and user table"
/enhance "fix iOS login button tap issue on mobile Safari"
/enhance "optimize API performance for slow dashboard queries"
```

---

### /concept Asks Too Many Questions

**Symptom:**
- Brainstorming phase is too long
- Too many clarifying questions

**Solution:**

Provide more context upfront:

**Before:**
```bash
/concept "add notifications"
```

**After:**
```bash
/concept "add real-time notifications dropdown in header with:
- Badge count for unread
- Toast for immediate actions
- WebSocket for real-time
- Store in database for history
"
```

The more context you provide, the fewer questions needed.

---

### /agentfeedback Mis-Categorizes Items

**Symptom:**
- Low-priority bug marked as critical
- Critical bug marked as polish

**Solution:**

Add severity indicators in your feedback:

```bash
/agentfeedback "
CRITICAL: Login broken on mobile
IMPORTANT: Dashboard loads slowly
POLISH: Footer color wrong
"
```

Or number by priority:

```bash
/agentfeedback "
P0 (Critical): Login broken
P1 (Important): Dashboard slow
P2 (Nice to have): Footer color
"
```

---

## Agent Issues

### Wrong Agent Selected

**Symptom:**
```
Task: iOS development
Agent: frontend-developer (should be ios-dev)
```

**Solution:**

**1. Be explicit about platform:**

```bash
# Instead of:
/enhance "build login page"

# Specify platform:
/enhance "build iOS login screen in SwiftUI"
/enhance "build React login page"
```

**2. Check agent availability:**

```bash
/nav

# Verify ios-dev is installed
# If missing: Install ios agents
~/leamas/leamas agent@ios-development
```

---

### Agent Doesn't Follow Skill

**Symptom:**
- Agent skips TDD (test-driven-development)
- Agent doesn't brainstorm (brainstorming skill)

**Diagnosis:**

```bash
# Check if skills are loaded
# In Claude Code:
"List available skills"

# Should show:
# - test-driven-development
# - systematic-debugging
# - brainstorming
```

**Solution:**

**1. Enable superpowers plugin:**

See [Plugins Not Loading](#plugins-not-loading)

**2. Explicitly request skill:**

```bash
# Instead of:
/enhance "build feature"

# Request skill explicitly:
/enhance "build feature using TDD"
/concept "explore approaches with brainstorming"
```

---

### Agent Quality Gate Fails

**Symptom:**
```
🛡️ QUALITY GATE
   code-reviewer-pro: ❌ REQUEST_CHANGES

   Issues:
   - Build fails
   - 3 tests failing
   - Security: SQL injection risk
```

**This is actually GOOD!** Quality gate caught issues before shipping.

**What happens next:**

```
Agent: frontend-developer
Task: Fix issues identified by code-reviewer-pro

✓ Fixed build error (missing import)
✓ Fixed 3 failing tests
✓ Fixed SQL injection (use parameterized queries)

Re-running quality gate...

🛡️ QUALITY GATE
   code-reviewer-pro: ✅ APPROVED
```

**No action needed** - agent automatically fixes and re-submits.

---

## Performance Issues

### Commands Take Too Long

**Symptom:**
- /enhance takes 3+ hours
- /agentfeedback runs for 2 hours

**Diagnosis:**

```bash
# Check token usage
# In Claude Code:
/nav --analytics

# Look for:
# - High token counts (>100K)
# - Excessive agent launches
# - Context caching disabled
```

**Solutions:**

**1. Enable context caching:**

```bash
# Check if installed
ls ~/.claude/lib/context-cache.js

# If missing:
cp -r ~/path/to/claude-vibe-code/lib ~/.claude/lib
```

**2. Use model tiering:**

See [OPTIMIZATION.md](OPTIMIZATION.md#model-selection) for details.

**3. Break up large tasks:**

Instead of:

```bash
/agentfeedback "50 items"  # Too many
```

Do:

```bash
/agentfeedback "10 critical items"  # Batch 1
# Wait for completion
/agentfeedback "10 important items"  # Batch 2
```

---

### High Token Usage

**Symptom:**
- Session uses 150K+ tokens
- Hitting context limits

**Solution:**

**1. Enable optimizations:**

Follow [OPTIMIZATION.md](OPTIMIZATION.md)

Key optimizations:
- Context caching (save 15-20K tokens)
- Agent compression (save 20K tokens)
- Lazy-loading examples (save 8K tokens)

**2. Reduce agent count:**

```bash
# Instead of launching 10 agents:
/agentfeedback "100 items"  # Overkill

# Launch fewer agents:
/agentfeedback "10 items"  # Right-sized
```

**3. Use Sonnet for deterministic tasks:**

Sonnet uses fewer tokens than Opus for same work.

See [OPTIMIZATION.md#model-selection](OPTIMIZATION.md#model-selection)

---

## iOS Development Issues

### xcodebuild Not Working

**Symptom:**

```bash
xcode-select: error: tool 'xcodebuild' requires Xcode,
but active developer directory '/Library/Developer/CommandLineTools'
is a command line tools instance
```

**Cause:**

Your `xcode-select` path points to Command Line Tools, not full Xcode.

**Fix:**

```bash
# Switch to full Xcode
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer

# Verify the fix
xcode-select -p
# Should show: /Applications/Xcode.app/Contents/Developer

# Test xcodebuild
xcodebuild -version
# Should show: Xcode 15.x
```

**Why this matters:**

- ✅ Xcode GUI works (finds its own tools)
- ❌ Terminal `xcodebuild` fails
- ❌ iOS Simulator CLI broken
- ❌ Agent automation fails

**After fix:**

- ✅ All xcodebuild commands work
- ✅ Agents can build iOS apps
- ✅ Automated testing works

---

### iOS Simulator Not Found

**Symptom:**

```
Agent: ios-dev
Error: No iOS simulators found
```

**Diagnosis:**

```bash
# List available simulators
xcrun simctl list devices

# Should show iPhone/iPad simulators
# If empty: Xcode not installed or simulators deleted
```

**Solution:**

**1. Install simulators:**

```bash
# Open Xcode
open -a Xcode

# Settings → Platforms → iOS
# Download iOS 17.x Simulator
```

**2. Create simulator:**

```bash
# Create iPhone 15 Pro simulator
xcrun simctl create "iPhone 15 Pro" "iPhone 15 Pro" "iOS 17.0"

# Boot simulator
xcrun simctl boot "iPhone 15 Pro"

# Verify
xcrun simctl list | grep Booted
```

---

## Web Development Issues

### Screenshots Too Large (MCP chrome-devtools)

**Symptom:**

```
API Error: 400 {"type":"error","error":{"type":"invalid_request_error",
"message":"...image dimensions exceed max allowed size: 8000 pixels"}}
```

**Cause:**

Using `fullPage: true` on long pages (> 8000px height).

**Fix:**

Use viewport screenshots instead:

```javascript
// ❌ WRONG: fullPage on long pages
mcp__chrome-devtools__take_screenshot({
  fullPage: true  // Fails on pages > 8000px
})

// ✅ CORRECT: viewport only
mcp__chrome-devtools__take_screenshot({
  fullPage: false  // Always works
})
```

**Why viewport is sufficient:**

- Design QA focuses on visible viewport (1440x900)
- Typography, spacing visible in first 900px
- Long scrolling content doesn't affect design quality

**Alternative (headless Chrome):**

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless \
  --screenshot=output.png \
  --window-size=1440,900 \
  --hide-scrollbars \
  "http://localhost:3000"
```

---

## Getting More Help

### Run Verification Script

```bash
# Create verification script
cat > verify-setup.sh << 'EOF'
#!/bin/bash
echo "🔍 VERIFYING CLAUDE CODE SETUP"

# Check Xcode (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "📱 iOS Development:"
  xcode-select -p
  xcodebuild -version 2>/dev/null | head -1
fi

# Check agents
echo "🤖 Agents:"
find ~/.claude/agents -name "*.md" 2>/dev/null | wc -l | tr -d ' '

# Check commands
echo "📝 Commands:"
find ~/.claude/commands -name "*.md" 2>/dev/null | wc -l | tr -d ' '

# Check plugins
echo "🔌 Plugins:"
cat ~/.claude/settings.json 2>/dev/null | grep -A 5 "enabledPlugins"

echo "✅ VERIFICATION COMPLETE"
EOF

chmod +x verify-setup.sh
./verify-setup.sh
```

---

### Enable Debug Mode

For detailed agent logs:

Edit `~/.claude/settings.json`:

```json
{
  "debug": true,
  "verboseLogging": true
}
```

Restart Claude Desktop. Check logs:

```bash
tail -f ~/Library/Logs/Claude/main.log
```

---

### Check Analytics

View performance metrics:

```bash
# Dashboard
node ~/.claude/lib/analytics-viewer.js dashboard

# Agent performance
node ~/.claude/lib/analytics-viewer.js agents

# Token usage
node ~/.claude/lib/analytics-viewer.js tokens
```

---

### Still Stuck?

**Check the docs:**
- [SETUP.md](SETUP.md) - Installation
- [QUICKSTART.md](QUICKSTART.md) - Command examples
- [WORKFLOWS.md](WORKFLOWS.md) - Detailed scenarios
- [OPTIMIZATION.md](OPTIMIZATION.md) - Performance tuning

**Report an issue:**
- GitHub Issues: [claude-vibe-code/issues](https://github.com/your-repo/claude-vibe-code/issues)
