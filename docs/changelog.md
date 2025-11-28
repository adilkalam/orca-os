# Changelog

## v2.4.0 (2025-11-27)

### Response Awareness Simplification

**RA is Instrumentation, Not Scoring**
- Clarified that RA tags are diagnostic breadcrumbs, not compliance metrics
- Gates MAY downgrade to CAUTION/FAIL for high-risk unresolved tags
- Gates MUST NOT derive standalone "RA accuracy percentages"
- Final quality comes from tests, builds, measurements—not tag counts

**Core RA Tags Defined**
- `#COMPLETION_DRIVE` - assumed behavior without confirmation
- `#PATH_DECISION` / `#PATH_RATIONALE` - architectural choices with reasoning
- `#POISON_PATH` - flagged anti-patterns or unsafe framing
- `#Potential_Issue` - out-of-scope problems noticed
- Additional tags documented for lane-specific use

### Next.js CSS Architecture Refactor Mode

**New Sub-Mode Under `--complex`**
- Structural CSS/layout refactors now have a dedicated mode
- Relaxes "edit, don't rewrite" for style/layout layers when refactoring
- Allows targeted rewrites of CSS modules, layout components, global styles

**New Gate: `nextjs-css-architecture-gate`**
- Scores structural CSS quality (0-100)
- Checks: global CSS minimization, Tailwind/shadcn adoption, duplication, naming
- Runs alongside standards-enforcer and design-reviewer in refactor mode

### Three-Tier Planning (`/plan`)

**Flags Added to `/plan`**
- `-tweak`: Quick planning (2-3 scope questions, minimal spec)
- (default): Standard planning (5+5 questions, full spec)
- `-complex`: Deep planning (extended analysis, risk assessment, multi-phase)

**Tier Passthrough**
- Spec metadata includes `tier` field
- `/orca-*` reads tier and matches execution depth
- Symmetry: `-tweak` plan → `-tweak` execution

**Auto-Detection**
- `/plan` analyzes task and recommends tier
- User can override recommendation

### Documentation Updates

- Updated all pipeline docs to v2.4
- Updated all phase-configs to reflect three-tier routing
- Clarified RA instrumentation vs scoring throughout

---

## v2.3.1 (2025-11-27)

### Anthropic Best Practices Alignment

**Extended Thinking Triggers**
- Grand-architects now use thinking prompts for complex decisions
- Medium tasks: "Let me think through the architecture..."
- Complex tasks: "Think harder about implications, dependencies..."
- Added to: `ios-grand-architect`, `nextjs-grand-architect`, `expo-grand-orchestrator`, `shopify-grand-architect`

**Complexity Detection Heuristics**
- `/orca-{domain}` commands now detect task complexity before delegation
- Heuristics: file count estimates, scope indicators, concern count
- Team size scales with complexity tier (1-2 → 3-5 → 5-10 agents)
- Added to: `orca-ios`, `orca-nextjs`, `orca-expo`, `orca-shopify`

### Agent Self-Improvement System

**Outcome Recording**
- Grand-architects record task outcomes at pipeline end
- Schema: `{task_id, domain, agents_used, outcome, issues, files_modified}`
- Storage: Workshop `task_history` entries
- Enables pattern recognition across executions

**Pattern Analysis**
- `/audit` now includes self-improvement analysis
- Identifies recurring issues (3+ occurrences same agent + issue type)
- Generates improvement proposals in Pantheon-inspired schema
- User approval required before applying changes

**New Scripts**
- `scripts/analyze-patterns.py` - Query Workshop, identify patterns, generate proposals
- `scripts/apply-improvement.py` - Apply approved improvements to agent YAML

**Self-Improvement Loop**
```
Execute → Record Outcome → Analyze Patterns → Propose Improvement
    → User Approves → Apply to Agent → Measure Impact
```

See [Self-Improvement](concepts/self-improvement.md) for details.

### Bug Fixes

**Critical: Agent Tools Format**
- Fixed silent failure where agents completed with 0 tool uses
- Root cause: YAML array format (`tools:\n  - Task`) doesn't work
- Fix: Comma-separated strings (`tools: Task, Read, Edit`)
- Applied to all 68 agents

### Documentation

- New: `docs/concepts/self-improvement.md`
- Updated: `docs/concepts/complexity-routing.md` (team scaling)
- Updated: `docs/changelog.md` (this file)

---

## v2.3 (2025-11-25)

### New Features

**Complexity Routing**
- Automatic simple/medium/complex classification
- Heuristics based on file count, keywords, and scope

**Light Orchestrators**
- Fast path for simple tasks
- `-tweak` flag forces light path
- Skip team confirmation, gates, verification
- Per-domain: `ios-light-orchestrator`, `nextjs-light-orchestrator`, `expo-light-orchestrator`, `shopify-light-orchestrator`

**Deep Audit Mode**
- `--audit` flag for review without implementation
- Per-domain audit squads
- Clarify focus areas with user
- Produce audit report with findings and follow-up tasks

**Spec Gating**
- Complex tasks blocked without requirements spec
- Spec created by `/plan`, stored at `.claude/requirements/<id>/06-requirements-spec.md`
- Medium tasks: spec recommended
- Simple tasks: spec not needed

**Memory-First Context**
- Check Workshop + vibe.db before ProjectContext
- Surfaces past decisions and gotchas early
- Reduces token usage and latency

**Response Awareness (RA) Integration**
- `ra_events` field in `phase_state.json`
- RA tags: `#COMPLETION_DRIVE`, `#CARGO_CULT`, `#PATH_DECISION`, `#POISON_PATH`, `#TOKEN_VIOLATION`
- Gates report `ra_status` in output
- `/audit` mines RA events across tasks

**New Commands**
- `/root-cause` - Multi-lane diagnostic investigation
- Domain audit: `/orca-ios --audit`, `/orca-nextjs --audit`, etc.

### Lane Updates

**All Lanes (iOS, Next.js, Expo, Shopify)**
- Upgraded to v2.3 with complexity routing
- Added light orchestrators
- Added `--audit` mode
- Added RA integration to specialists and gates
- Memory-first context pattern

**OS-Dev Lane**
- New lane for OS configuration work
- LOCAL to claude-vibe-config repo only
- NOT wired into main `/orca` routing
- Components: grand-architect, architect, builder, standards-enforcer, verification

**Specialist Pipelines (Data, SEO, Design)**
- Updated to v2.3 patterns
- Route directly to specialists (no grand-architect)

### Agent Changes

- Light orchestrators added (4 new agents)
- RA tagging added to all specialists
- RA status checking added to all gates
- Agent tools format standardized (comma-separated strings)

### Technical Changes

- `phase_state.json` schema updated with `ra_events`, `complexity_tier`
- Phase configs updated with `memory_first: true`, complexity routing
- Gate output includes `ra_status` field

### Documentation

- Complete docs overhaul
- New `docs/concepts/` with core mental models
- Clean `docs/pipelines/` per lane
- Archived pre-v2.3 docs to `.archive/`

### Breaking Changes

None. v2.3 is backward compatible with v2.2.

---

## v2.2 (2025-11-24)

Initial multi-lane orchestration release.

- Domain-specific pipelines (iOS, Next.js, Expo, Shopify, Data, SEO, Design)
- Grand architect pattern (Opus coordination)
- Specialist agents per domain
- Gate and verification patterns
- ProjectContext MCP integration
- Phase state management
- Team confirmation before execution
- State preservation across interruptions

---

## v2.1 and Earlier

Pre-orchestration versions. See `.archive/` for historical context.
