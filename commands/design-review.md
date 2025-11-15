---
description: Run an interactive design review using Playwright MCP to capture responsive screenshots, check console, and summarize findings
allowed-tools: ["Grep", "LS", "Read", "Edit", "MultiEdit", "Write", "Glob", "Bash", "ListMcpResourcesTool", "ReadMcpResourceTool", "mcp__playwright__browser_install", "mcp__playwright__browser_tab_list", "mcp__playwright__browser_tab_new", "mcp__playwright__browser_tab_select", "mcp__playwright__browser_tab_close", "mcp__playwright__browser_navigate", "mcp__playwright__browser_resize", "mcp__playwright__browser_click", "mcp__playwright__browser_type", "mcp__playwright__browser_wait_for", "mcp__playwright__browser_take_screenshot", "mcp__playwright__browser_console_messages", "mcp__playwright__browser_snapshot", "mcp__playwright__browser_network_requests", "mcp__playwright__browser_close"]
---

# /design-review — Visual QA with Playwright MCP

Use this command after front-end changes to verify visuals and capture evidence. Requires Playwright MCP configured in `.mcp.json`.

## Inputs
- URL to review (default: http://localhost:3000)
- Optional: label for run (default: design-review)
- Optional: pages/selectors to navigate after landing

## Steps
1. Ensure Playwright browsers installed
   - mcp__playwright__browser_install
2. Open target URL
   - mcp__playwright__browser_navigate(url: "<URL>")
3. Capture responsive evidence
   - Desktop 1440x900 → `.orchestration/evidence/screenshots/<ts>-<label>-desktop.png`
   - Tablet 768x1024 → `.orchestration/evidence/screenshots/<ts>-<label>-tablet.png`
   - Mobile 375x812 → `.orchestration/evidence/screenshots/<ts>-<label>-mobile.png`
   - Use mcp__playwright__browser_resize + mcp__playwright__browser_take_screenshot
4. Collect console diagnostics
   - mcp__playwright__browser_console_messages → save under `.orchestration/evidence/logs/<ts>-<label>-console.json`
5. Optional interactions (click/type/select) to exercise key flows, then re‑capture screenshots
6. Summarize findings using the structure below

## Report Template
```
### Design Review Summary
- URL: <url>
- Evidence: screenshots (desktop/tablet/mobile), console log

### Findings
#### Blockers
- [Problem + Screenshot]

#### High-Priority
- [Problem + Screenshot]

#### Medium-Priority / Suggestions
- [Problem]

#### Nitpicks
- Nit: [Problem]
```

## Notes
- Store all artifacts under `.orchestration/evidence/` to keep audits consistent.
- If the page requires auth or specific navigation, include those steps before screenshots.
