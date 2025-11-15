---
description: Visual quality verification gate - captures responsive screenshots, checks console, and validates implementation against design specs
allowed-tools: ["Grep", "LS", "Read", "Edit", "MultiEdit", "Write", "Glob", "Bash", "ListMcpResourcesTool", "ReadMcpResourceTool", "mcp__playwright__browser_install", "mcp__playwright__browser_tab_list", "mcp__playwright__browser_tab_new", "mcp__playwright__browser_tab_select", "mcp__playwright__browser_tab_close", "mcp__playwright__browser_navigate", "mcp__playwright__browser_resize", "mcp__playwright__browser_click", "mcp__playwright__browser_type", "mcp__playwright__browser_wait_for", "mcp__playwright__browser_take_screenshot", "mcp__playwright__browser_console_messages", "mcp__playwright__browser_snapshot", "mcp__playwright__browser_network_requests", "mcp__playwright__browser_close"]
---

# /design-review — Visual Quality Gate

Purpose: Verify that implementations match design specs and maintain quality standards. This is the **verification phase** that follows implementation.

## Role in the Architecture

In the new two-phase system:
1. **Concept Agent** creates design spec (via /design-director or project commands)
2. **Builder Agent** implements the spec (via project --build commands)
3. **Design Review** verifies implementation quality (this command)

Use this command:
- After front-end implementation to verify quality
- Before marking features complete
- As a quality gate in the development workflow
- When visual regression testing is needed

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

## Verification Against Spec

If a spec exists from the Concept phase:
1. Load the spec from `.orchestration/specs/`
2. Check implementation against spec requirements:
   - Design tokens properly applied?
   - Component hierarchy matches?
   - Responsive behavior as specified?
   - Interaction patterns implemented?
3. Note any deviations in the report

## Report Template
```
### Design Review Summary
- URL: <url>
- Spec Reference: [if applicable]
- Evidence: screenshots (desktop/tablet/mobile), console log

### Spec Compliance [if spec exists]
✅ Matches spec:
- [Item from spec correctly implemented]

❌ Deviations from spec:
- [Item not matching spec + Screenshot]

### Visual Quality Findings
#### Blockers
- [Problem + Screenshot]

#### High-Priority
- [Problem + Screenshot]

#### Medium-Priority / Suggestions
- [Problem]

#### Nitpicks
- Nit: [Problem]

### Recommendation
- [ ] Ready to ship
- [ ] Needs fixes before shipping
- [ ] Major issues requiring redesign
```

## Notes
- Store all artifacts under `.orchestration/evidence/` to keep audits consistent.
- If the page requires auth or specific navigation, include those steps before screenshots.
