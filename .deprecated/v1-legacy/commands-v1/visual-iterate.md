---
description: Iterative visual development loop using Playwright MCP with spec-driven gates and evidence capture
allowed-tools: ["Read", "Write", "Edit", "MultiEdit", "Grep", "Glob", "LS", "Bash", "ListMcpResourcesTool", "ReadMcpResourceTool", "mcp__playwright__browser_install", "mcp__playwright__browser_close", "mcp__playwright__browser_tab_new", "mcp__playwright__browser_tab_select", "mcp__playwright__browser_tab_close", "mcp__playwright__browser_navigate", "mcp__playwright__browser_resize", "mcp__playwright__browser_click", "mcp__playwright__browser_type", "mcp__playwright__browser_press_key", "mcp__playwright__browser_wait_for", "mcp__playwright__browser_select_option", "mcp__playwright__browser_hover", "mcp__playwright__browser_drag", "mcp__playwright__browser_take_screenshot", "mcp__playwright__browser_snapshot", "mcp__playwright__browser_evaluate", "mcp__playwright__browser_console_messages", "mcp__playwright__browser_network_requests", "mcp__playwright__browser_file_upload"]
---

# /visual-iterate — Spec-Driven Iterative Loop

Run an iterative loop where each cycle: (a) renders UI, (b) captures screenshots, (c) compares to a fixed spec/validator, (d) applies focused edits, and (e) repeats until gates pass or limits hit.

## Inputs
- url: default `http://localhost:3000`
- spec_path: markdown spec or checklist (see `~/.claude/docs/visual/design-spec-template.md`)
- max_iterations: default 5
- breakpoints: `[ {1440,900}, {768,1024}, {375,812} ]`
- label: short run label (default `visual-iterate`)
- flows/selectors: optional interactions to execute before captures

## Preparation
1. Ensure app is running (Next/Storybook/dev server). If not, start it in a separate task.
2. Install browsers: `mcp__playwright__browser_install`
3. Create evidence dirs:
   - `.orchestration/evidence/screenshots/`
   - `.orchestration/evidence/logs/`
   - `.orchestration/evidence/iterations/`

## Iteration Loop
For i in 1..max_iterations:
1) Navigate + Interactions
- `mcp__playwright__browser_navigate(url)`
- Execute optional flow (click/type/wait/select) to reach the UI under test

2) Capture at breakpoints
- For each size, `mcp__playwright__browser_resize` → `mcp__playwright__browser_take_screenshot`
- Save as `.orchestration/evidence/screenshots/<ts>-<label>-iter<i>-{desktop|tablet|mobile}.png`
- Collect `mcp__playwright__browser_console_messages` → `.orchestration/evidence/logs/<ts>-<label>-iter<i>-console.json`

3) Compare vs Spec (spec_path)
- Read spec
- Summarize deltas: hierarchy, spacing scale, typography, color, states, responsiveness
- Tag issues with severity: [Blocker|High|Medium|Nit]

4) Decide
- If all acceptance criteria met → STOP (success)
- If deltas unchanged from last iteration → STOP (diminishing returns)
- Else → propose the smallest viable set of edits (max 10 lines per file; max 3 files) to move toward spec

5) Apply Edits (focused)
- Limit changes to relevant files under `src/` and `styles/`
- Prefer class/tokens over ad‑hoc css
- Avoid copy rewrites unless spec requires

6) Log iteration
- Save `.orchestration/evidence/iterations/<ts>-<label>-iter<i>.md` with:
  - What changed (files/lines)
  - Why (spec clause)
  - Screenshots + links
  - Open issues

Stop conditions hit → produce final summary and next steps.

## Acceptance Gates (default)
- Visual hierarchy matches spec (headings, emphasis, CTA prominence)
- Spacing follows scale (4/8/16/24/32)
- Typography scale + line lengths (45–75ch) sane
- Contrast ≥ 4.5:1 for body, ≥ 3:1 for large text
- No horizontal scroll at mobile/tablet/desktop
- Interactive states visible (hover, focus, active, disabled)

## Evidence Rules
- Always save screenshots and console logs per iteration
- Use consistent filenames for auditability

## Notes
- If spec includes target screenshots, link them in the iteration md for side‑by‑side reasoning
- When blocked by data/auth, stub deterministic content temporarily and mark it in the log
