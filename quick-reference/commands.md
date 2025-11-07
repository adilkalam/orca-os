# Command Quick Reference

Essential commands for ORCA orchestration and workflow control.

## Core Orchestration
- `/orca` — Multi-agent orchestration with team confirmation
- `/respawr` — Response awareness (plan + implement)
- `/respawr-plan` — Create blueprint only (no code)
- `/respawr-build` — Execute approved blueprint and capture evidence
- `/ultra-think` — Deep analysis and problem solving

## Planning & Prompting
- `/enhance -clarify` — Clarify and structure requests
- `/introspect` — Predict failure modes and risks

## Verification & Evidence
- `/finalize` — Evidence check: build + tests + screenshots
- `/visual-review` — Browser screenshot and visual QA
- `/ios-debug` — iOS layout debugging with evidence (optional)

## Memory & Learning
- `/memory-search` — Query Workshop memory
- `/memory-learn` — Reflect and update playbooks
- `/memory-pause` — Temporarily disable learning
- `/session-save` — Save session context
- `/session-resume` — Restore session context

## UI & Design
- `/concept` — Iterate on existing layout
- `/concept -edit` — Edit an existing concept (optional)
- `/ascii-mockup` — Generate ASCII UI mockups

## Verification Modes
- `/mode -on` — Enable verification gates
- `/mode -off` — Disable verification (development)

## Maintenance
- `/cleanup` — Safe organize + tidy (non-destructive by default)

## Specialized
- `/mm-copy` — Data‑aware, brand‑calibrated ad copy
- `/mm-comps` — Competitor dossiers (press, lookbooks, ecommerce visuals)
- `/creative-strategist` — Brand and performance analysis
- `/all-tools` — List all available tools

## Examples
```bash
# Start feature with orchestration
/respawr "Add dark mode to settings"

# Plan complex work first
/respawr-plan Build OAuth with Google + Apple Sign-In

# Debug iOS layouts
/ios-debug Navigation bar overlaps content

# Check visual implementation
/visual-review http://localhost:3000

# Search past decisions
/memory-search "CSS framework decision"
```
