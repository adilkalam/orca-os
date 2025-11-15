---
description: "Trigger the Design/FE lane via ORCA to (a) initialize or (b) migrate to a global class design system."
allowed-tools: ["AskUserQuestion", "Task", "Read", "Write", "Bash", "MultiEdit"]
---

# /design-dna — Class-Based Design System Pipeline

Single entry that routes into ORCA’s Design/FE lane. Produces tokens, global CSS classes, semantic markup templates, and verified components. No inline styles; no utilities.

## Inputs to Gather
- Mode: `init` | `migrate`
- Brief / Goals (e.g., “Modern SaaS hero and pricing”)
- Paths (for migrate): directories/files to refactor
- Framework: `react` | `html` (default: react)
- Brand/style refs or existing tokens (optional)

Ask for missing values before continuing.

## Team & Order (delegated by ORCA)
- design-system-architect → tokens
- css-system-architect → tokens.css, base.css, components/*.css, themes/*.css
- html-architect → semantic templates using approved classes
- ui-engineer/react-18-specialist/nextjs-14-specialist → integrate components/pages
- accessibility-specialist → axe/pa11y + keyboard/focus
- frontend-performance-specialist → Lighthouse budgets
- migration-specialist (only for migrate mode) → codemods and refactors
- verification-agent → verify files + gate outputs

### Task Tool Mapping (current environment)
The Task tool cannot dispatch some of the new agent types directly. Use the following mapping while keeping methodology from the new agents:

- Dispatch as `design-system-architect` (registered)
- Dispatch as `css-specialist` while following `agents/specialists/css-system-architect.md`
- Dispatch as `ui-engineer` while following `agents/specialists/html-architect.md`
- Mode=migrate: Dispatch as `ui-engineer` while following `agents/specialists/migration-specialist.md` (or `general-purpose` if UI engineer is busy)
- Continue to dispatch `accessibility-specialist`, `frontend-performance-specialist`, `verification-agent` as usual

## Execution Steps
1. Confirm inputs with the user; echo plan (mode, paths, outputs).
2. Dispatch to design-system-architect for tokens (or validate existing tokens).
3. css layer: Task to `css-specialist` with prompt "Follow methodology from agents/specialists/css-system-architect.md" to emit/update CSS: `src/styles/{tokens,base}.css`, `src/styles/components/*`, `src/styles/themes/*`.
4. markup layer: Task to `ui-engineer` with prompt "Follow methodology from agents/specialists/html-architect.md" to emit semantic templates/layout scaffolds (no utilities/inline styles).
5. Mode=migrate: Task to `ui-engineer` with prompt "Follow methodology from agents/specialists/migration-specialist.md" to run codemods and remove inline/utility.
6. ui/React/Next specialists: wire logic; do not touch styling policy.
7. Run gates (eslint, stylelint, html-validate, axe/pa11y, Lighthouse). Fail on any criticals.
8. verification-agent: summarize evidence and verdict.

### Example Task dispatches
Use these exact Task calls as a guide (adjust paths/mode as needed):

```ts
Task({
  subagent_type: "design-system-architect",
  prompt: "Produce/validate tokens per agents/specialists/design-system-architect.md; output src/styles/tokens.css; no inline styles; save evidence under .orchestration/evidence/"
})

Task({
  subagent_type: "css-specialist",
  prompt: "Follow methodology in agents/specialists/css-system-architect.md to emit src/styles/base.css, src/styles/components/*, src/styles/themes/* using tokens; enforce Stylelint tokens; tag #FILE_CREATED"
})

Task({
  subagent_type: "ui-engineer",
  prompt: "Follow methodology in agents/specialists/html-architect.md to produce semantic templates using only approved classes (no utilities/inline). If framework=react, provide component structure. Run html-validate and save outputs to .orchestration/evidence/"
})

// Migration mode only
Task({
  subagent_type: "ui-engineer",
  prompt: "Follow methodology in agents/specialists/migration-specialist.md to remove inline styles and utilities via codemods; refactor to global classes; capture diffs and gate outputs under .orchestration/evidence/"
})

Task({ subagent_type: "accessibility-specialist", prompt: "Run axe/pa11y; zero critical violations; save reports to .orchestration/evidence/" })
Task({ subagent_type: "frontend-performance-specialist", prompt: "Run Lighthouse with budgets; save reports to .orchestration/evidence/" })
Task({ subagent_type: "verification-agent", prompt: "Verify files in correct locations and summarize gate results; block on failures" })
```

## Deliverables to User
- Paths to: tokens.css, base.css, components/*.css, themes/*.css, markup/templates, components/pages
- Gate summaries (lint/a11y/perf) with pass/fail
- Migration report (mode=migrate): counts, diffs, residual items

## Non-Negotiables
- No inline styles; no utility classes
- All styling via tokens → global classes
- Block completion until gates pass
