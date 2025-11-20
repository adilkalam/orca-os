---
description: Quick responsive screenshots + console capture with Playwright MCP
allowed-tools: ["LS", "Read", "Bash", "mcp__playwright__browser_install", "mcp__playwright__browser_navigate", "mcp__playwright__browser_resize", "mcp__playwright__browser_take_screenshot", "mcp__playwright__browser_console_messages", "mcp__playwright__browser_close"]
---

# /visual-smoke — Fast Evidence Pass

Inputs: url (default http://localhost:3000), label (default visual-smoke)

Steps:
1. Install browsers
2. Navigate to url
3. Capture desktop/tablet/mobile screenshots to `.orchestration/evidence/screenshots/`
4. Save console messages to `.orchestration/evidence/logs/`
