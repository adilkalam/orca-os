---
description: >
  Run a focused design review using a reference screenshot and the project
  design system. Captures the current live UI with Playwright, analyzes both
  via visual-layout-analyzer, then asks frontend-design-reviewer-agent to
  compare and score.
allowed-tools: [
  "Task",
  "Read",
  "Grep",
  "Glob",
  "Bash",
  "ListMcpResourcesTool",
  "ReadMcpResourceTool",
  "mcp__playwright__browser_install",
  "mcp__playwright__browser_tab_list",
  "mcp__playwright__browser_tab_new",
  "mcp__playwright__browser_tab_select",
  "mcp__playwright__browser_tab_close",
  "mcp__playwright__browser_navigate",
  "mcp__playwright__browser_resize",
  "mcp__playwright__browser_click",
  "mcp__playwright__browser_type",
  "mcp__playwright__browser_wait_for",
  "mcp__playwright__browser_take_screenshot",
  "mcp__playwright__browser_console_messages",
  "mcp__playwright__browser_snapshot",
  "mcp__playwright__browser_network_requests",
  "mcp__playwright__browser_close"
]
---

# /design-review-from-screenshot — Visual Diff vs Design System

Use this command when you have a **reference screenshot** of the desired UI
state (mockup, past build, or design export) and want to:
- Ensure the current live UI still matches that visual reference.
- Validate the live UI against the project’s design-dna and design rules.
- Get a scored, OS 2.0–style Design QA report.

This command:
1. Captures the current live UI with Playwright at matching breakpoints.
2. Runs `visual-layout-analyzer` on the reference (and optionally live)
   screenshots to produce structured layout + token mapping.
3. Calls `frontend-design-reviewer-agent` with both images and the analysis to
   compute a Design QA Score and gate.

---
## 1. Inputs

- Reference screenshot image:
  - Attached to the Claude Code session, or available at a file path.
- Target URL/route to review (default `http://localhost:3000`).
- Optional:
  - Label for this run (used in filenames).
  - Navigation steps or selectors to reach the relevant view.
  - Which breakpoints matter (desktop only vs desktop+mobile).

---
## 2. Capture Current Live UI (Playwright MCP)

Use the Playwright MCP tools to:
- Install browsers if needed.
- Navigate to the target URL/route.
- Set viewports that match the reference screenshot context (e.g. 1440×900
  desktop, 375×812 mobile).
- Capture screenshots at each relevant breakpoint.
- Save under:
  - `.claude/orchestration/evidence/screenshots/<ts>-<label>-live-{desktop|mobile}.png`

Also capture console and network diagnostics if helpful:
- `browser_console_messages`
- `browser_network_requests`

These artifacts become evidence for design QA but are not modified.

---
## 3. Analyze Reference & Live Screenshots

Next, invoke `visual-layout-analyzer` via `Task` to produce a structured
visual analysis aligned with the project’s design system:

- For the **reference screenshot** (required):
  - Generate:
    - `Visual Layout Tree` – hero/sections/cards/prose regions.
    - `Detected Components` – bento cards, prose containers, nav, etc.
    - `Token Candidates` – estimated typography/colors/spacing mapped into
      `design-dna` tokens where possible.

- For the **live screenshot(s)** (optional but recommended):
  - Optionally run `visual-layout-analyzer` again to produce a parallel
    analysis of the current UI.

Include:
- `design-dna.json` and authored design docs in context:
  - `design-system-vX.X.md`
  - `bento-system-vX.X.md`
  - `CSS-ARCHITECTURE.md`

The goal is to give downstream agents a machine-friendly view of what the
reference expresses and how the live UI aligns (or doesn’t).

---
## 4. Invoke Frontend Design Reviewer Agent

Call `frontend-design-reviewer-agent` via `Task` with a prompt that:
- Provides:
  - The reference screenshot path.
  - Live screenshot paths.
  - The visual-layout-analyzer outputs (for reference and, if available, live).
- Asks for:
  - A Design QA Score (0–100).
  - A gate: `PASS` / `CAUTION` / `FAIL`.
  - Specific differences between reference and live UI, mapped back to:
    - Layout/spacing.
    - Color/typography.
    - Component/structure (e.g. bento patterns).
    - Any violations of design-dna or CSS architecture rules.

Example:

```ts
Task({
  subagent_type: "frontend-design-reviewer-agent",
  prompt: `
Compare the reference screenshot and its visual-layout-analyzer output with
the current live UI screenshots and their analysis.

Goals:
- Identify visual differences in layout, spacing, color, typography, and
  component structure (including bento/prose patterns).
- Check compliance with design-dna.json and authored design docs.
- Compute a Design QA Score (0–100) and gate (PASS/CAUTION/FAIL).
- List specific mismatches with hints about likely files/areas to inspect.
`
})
```

---
## 5. Summarize Findings

Report back to the user:
- Where the live UI matches the reference well.
- Where it diverges materially (especially regressions vs the design system).
- The Design QA Score and gate.
- Concrete recommendations for bringing the live UI back in line with:
  - The reference screenshot.
  - `design-dna.json` and the design-system/bento/CSS-ARCHITECTURE rules.

If appropriate, suggest follow-up commands such as:
- `/frontend-iterate` focusing on this route.
- `/orca` with a webdev request that references this design review.

