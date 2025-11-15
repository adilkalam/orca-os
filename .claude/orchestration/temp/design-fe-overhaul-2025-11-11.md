# Design/FE Overhaul — Change Log (2025-11-11)

Scope: Introduce class-based Design/FE lane, add enforcement configs, retire Tailwind specialist, and add optional command trigger.

## Changes

### Added Agents
- #FILE_CREATED: agents/specialists/html-architect.md
- #FILE_CREATED: agents/specialists/css-system-architect.md
- #FILE_CREATED: agents/specialists/migration-specialist.md

### Updated/Retired Agents
- #FILE_CREATED: agents/specialists/_retired/tailwind-specialist.md (moved + marked RETIRED)
- Updated: agents/orchestration/workflow-orchestrator.md — added "Design/FE Lane" section with strict gates

### Commands
- #FILE_CREATED: .claude/commands/design-dna.md — optional entry to trigger ORCA’s Design/FE lane (init|migrate)

### Enforcement Configs
- #FILE_CREATED: .eslintrc.cjs — forbids inline styles via react/forbid-dom-props
- #FILE_CREATED: .stylelintrc.cjs — enforces token usage (var(--token-*)) and other CSS rules
- #FILE_CREATED: .htmlvalidate.json — enforces semantic HTML, no inline styles

### Baseline Scan
- #FILE_CREATED: scripts/lint/run-baseline-scan.sh — ripgrep-based baseline for inline styles, utility-like classes, raw hex, px units
- Result snapshot (excluding node_modules/.next/dist/build):
  - Inline styles: 26
  - Utility-like classes: 612
  - Raw hex colors: 74
  - px units in CSS: 47
  - Top hotspots: _explore/design-with-claude/web/app/page.tsx, _explore/design-with-claude/web/components/GettingStarted.tsx, and various workshop templates under _explore/_memory/** (not production code)

## Notes
- Design-with-claude is a reference under _explore/; not targeted for refactor unless requested.
- Recommend excluding _explore/** and _memory/** from CI gates to focus on active app code.

## Next Steps (proposed)
- Confirm active frontend directories to target first (e.g., src/, app/).
- Wire CI to run ESLint/Stylelint/html-validate and fail on violations (scoped to active dirs).
- Run migration-specialist on first slice (component/page) and re-baseline.

