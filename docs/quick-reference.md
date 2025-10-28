# Quick Reference

## Slash Commands (Top)

- /finalize
  - Verifies completion via builds/tests/screenshots, design guard, atlas, and writes `.verified`.
  - Run: `bash scripts/finalize.sh`
  - Prototype profile: `FINALIZE_PROFILE=prototype bash scripts/finalize.sh`
- /ultra-think
  - Deep analysis and architectural reasoning (no code changes).
  - See: `commands/ultra-think.md`
- /enhance
  - Transform vague requests into structured implementation plans and TODOs.
  - See: `commands/enhance.md`
- /concept
  - Design brainstorming from references/screenshots.
  - See: `commands/concept.md`
- /visual-review
  - Multi-device screenshots + visual analysis (where available).
  - See: `commands/visual-review.md`
- /orca
  - Multi-agent orchestration (use sparingly; Start-Simple is default).
  - See: `commands/orca.md`

---

## Workflows

- Tweak Mode (fast loop, no screenshots)
  - Confirm changes: `bash scripts/design-tweak.sh run` (runs quick-confirm)
  - Toggle guard: `bash scripts/design-tweak.sh guard off|warn`
  - Set verify mode: `bash scripts/verification-mode.sh tweak|off|strict`
- Evidence Close-Out (Prototype)
  - Run finalize with lighter threshold: `FINALIZE_PROFILE=prototype bash scripts/finalize.sh`
  - Outputs: `.verified`, verification + design guard reports, refreshes atlas
- Full Strict Close-Out
  - Ensure `.orchestration/implementation-log.md` has tags, add screenshots if visual
  - `bash scripts/finalize.sh` (strict)
- Find and Map
  - Selectors/tokens to file:line: `python3 scripts/find-ui-refs.py "bento-card"`
  - Generate Design Atlas: `python3 scripts/generate-design-atlas.py`

---

## Agent Briefs

- workflow-orchestrator (pure)
  - Coordinates work; never implements; enforces gates. See: `agents/orchestration/workflow-orchestrator.md`
- nextjs-14-specialist
  - Next.js app routing, server actions, SSR/ISR. See: `agents/specialists/frontend-specialists/...`
- react-18-specialist
  - Components, state patterns, hooks for web. See: `agents/specialists/frontend-specialists/...`
- state-management-specialist
  - State graphs, context architecture, URL state.
- frontend-testing-specialist
  - Unit and integration tests for React. See: `agents/specialists/frontend-specialists/testing/frontend-testing-specialist.md`
- design-reviewer
  - Visual QA, accessibility checks (warn-only guard support). See: `agents/specialists/design-specialists/quality/design-reviewer.md`
- swiftui-developer
  - SwiftUI view implementation, modifiers, layout. See: `agents/specialists/ios-specialists/ui/swiftui-developer.md`
- swift-testing-specialist
  - XCTest/XCUITest for iOS. See: `agents/specialists/ios-specialists/testing/swift-testing-specialist.md`
- ui-testing-expert
  - End-to-end UI tests and accessibility IDs for iOS. See: `agents/specialists/ios-specialists/testing/ui-testing-expert.md`
- verification-agent
  - Verifies claims via tags and evidence. See: `agents/quality/verification-agent.md`
- quality-validator
  - Final review of reports and gate status. See: `agents/quality/quality-validator.md`

---

## Skills

- completion-checklist
  - Guides task completion checks. See: `skills/completion-checklist/`
- todowrite-first
  - Write TODOs before action to maintain focus. See: `skills/todowrite-first/`
- orca-confirm
  - Confirmation prompts around orchestration. See: `skills/orca-confirm/`

---

## MCPs

- Chrome DevTools MCP (local subrepo)
  - Path: `mcp/chrome-devtools-mcp/`
  - Use: browser inspection, DOM queries, screenshots (where applicable)
  - See: `mcp/chrome-devtools-mcp/README.md`
- XcodeBuild MCP (local subrepo)
  - Path: `mcp/xcodebuildmcp/`
  - Use: simulator/device build and test integrations
  - See: `mcp/xcodebuildmcp/README.md`

---

## Verification Modes (Hook-Aware)

- strict (default) → require `.verified`
- tweak → accept `.tweak_verified`
- off → bypass verification (trusted sprints)
- Set via: `bash scripts/verification-mode.sh [strict|tweak|off]`
- One-off bypass: `VERIFY_BYPASS=1 git commit ...` or `GIT_VERIFY=off git commit ...`

---

## Useful Scripts

- `scripts/design-tweak.sh` → prep|run|finalize|guard off|warn
- `scripts/quick-confirm.sh` → diff+guard confirmation (no screenshots)
- `scripts/finalize.sh` → full evidence verification and reports
- `hooks/session-start.sh` → write `.orchestration/session-context.md` (import into CLAUDE.md)
- `scripts/generate-design-atlas.py` → maps classes/tokens and resolves CSS variables
- `scripts/design_ui_guard.py` → lint CSS/SwiftUI spacing and typography
- `scripts/find-ui-refs.py` → find selectors/tokens across source and out/
- `scripts/verification-mode.sh` → set strict/tweak/off
- `scripts/memory-index.py` → index/update local memory (SQLite FTS)
- `scripts/memory-search.py` → query local memory (BM25; rerank if vectors available)
- `.claude/mcp/memory_server.py` → MCP server exposing `memory.search` tool
