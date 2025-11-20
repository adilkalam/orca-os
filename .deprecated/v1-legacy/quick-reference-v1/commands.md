# Slash Commands Reference

**Complete command reference for Vibe Code OS**

---

## Overview

Slash commands are custom workflows that execute specific agent patterns. They're defined in `~/.claude/commands/` and loaded automatically by Claude Code.

**Usage:**
```bash
/command-name [arguments]
```

**Total Commands:** 31

---

## Core Orchestration (3)

### /orca

**Purpose:** Smart multi-agent orchestration with tech stack detection and team confirmation

**Usage:**
```bash
/orca "Build iOS weather app with local caching"
/orca "Analyze BFCM performance with product journeys"
/orca "Implement user authentication"
```

**What it does:**
1. Detects tech stack from keywords + project files
2. Proposes specialist team (6-15 agents)
3. Gets user confirmation (interactive, always)
4. Dispatches agents with chaos prevention (50 file limit)
5. Runs quality gates (0-5)
6. Captures evidence
7. Cleans up temp files

**When to use:** Complex, multi-domain work requiring multiple specialists

**See:** `quick-reference/orca.md` for full details

---

### /response-aware

**Purpose:** 6-phase evidence-based workflow (plan + implement + verify)

**Modes:**
```bash
# Full workflow
/response-aware "Add dark mode to dashboard"

# Plan only (review before code)
/response-aware -plan "iOS to React migration"

# Build from blueprint
/response-aware -build path/to/blueprint.md
```

**Phases:**
1. **Survey** — Map domains, integration points
2. **Parallel Planning** — Multiple planners propose paths
3. **Synthesis** — Create single blueprint, user approves
4. **Implementation** — Execute strictly from blueprint, tag assumptions
5. **Verification** — Resolve all tags via tests/build/screenshots
6. **Final Synthesis** — Summarize work, attach evidence

**When to use:** Features requiring planning → implementation → verification discipline

**See:** `.orchestration/reference/response-awareness.md`

---

### /seo-orca

**Purpose:** Full SEO research → brief → draft workflow with specialist agents

**Usage:**
```bash
/seo-orca "Write SEO-optimized guide for Next.js 14 App Router"
```

**What it does:**
1. Research (keyword analysis, competitor analysis)
2. Brief creation (outline, target keywords, meta descriptions)
3. Draft writing (SEO-optimized content)
4. Quality gates (content awareness, SEO validation)

**When to use:** SEO content creation requiring research-grounded writing

---

## Design & UI (10)

### /design-director

**Purpose:** Quiet-luxury layout and UI blueprints (blueprint-first, then code)

**Usage:**
```bash
/design-director "product detail page layout"
/design-director "dashboard with charts and filters"
```

**What it does:**
1. Loads design DNA (typography, spacing, grid)
2. Applies FRAME → STRUCTURE → SURFACE scaffold
3. Produces blueprint:
   - Mathematical spacing calculations
   - Component hierarchy
   - Token-based styling specs
   - No code (blueprint-first)

**When to use:** Layout design requiring precision and brand consistency

**Output:** Blueprint (not code) — implement separately

---

### /fox-designer

**Purpose:** PeptideFox design specialist (scientific premium minimal interfaces)

**Style:** Clean Future Blue + lavender, engineered spacing, Apple-grade polish

**Usage:**
```bash
/fox-designer "scientific data visualization layout"
```

**When to use:** PeptideFox-branded layouts (specific project)

---

### /obdn-designer

**Purpose:** OBDN design specialist (luxe-alchemy-minimal interfaces)

**Style:** Obsidian + gold, ultra-precise alignment

**Usage:**
```bash
/obdn-designer "premium product showcase layout"
```

**When to use:** OBDN-branded layouts (specific project)

---

### /design-review

**Purpose:** Interactive design review using Playwright MCP

**Usage:**
```bash
/design-review
```

**What it does:**
1. Captures responsive screenshots (mobile, tablet, desktop)
2. Checks console for errors
3. Tests accessibility (keyboard nav, screen reader)
4. Verifies grid compliance (4px system)
5. Validates token-based styling
6. Produces comprehensive review report

**When to use:** UI implementation verification before merge/launch

**See:** Design review implements OneRedOak 7-phase process

---

### /ascii-mockup

**Purpose:** Generate Fluxwing-style ASCII mockups on 4-space grid

**Usage:**
```bash
/ascii-mockup "login form with social auth buttons"
```

**What it does:**
- Creates ASCII art representation of UI
- Fixed box widths, calculated alignment
- 4-space grid system
- Allowed characters only (no arbitrary symbols)

**When to use:** Quick layout sketching, planning UI structure

---

### /frontend-from-mockup

**Purpose:** Build or refine frontend implementation from a design mockup/screenshot

**Usage:**
```bash
/frontend-from-mockup "Pricing page layout"
```

**What it does:**
- Uses `frontend-layout-analyzer` to map sections and components from the attached image
- Uses `frontend-builder-agent` to implement the UI in this project’s stack
- Recommends running `/frontend-iterate` to enforce quality gates

**When to use:** You have a visual mockup and want real components/pages

---

### /design-review-from-screenshot

**Purpose:** Compare live UI against a reference screenshot

**Usage:**
```bash
/design-review-from-screenshot http://localhost:3000
```

**What it does:**
- Uses Playwright MCP to capture current live screenshots
- Invokes `frontend-design-reviewer-agent` to compare reference vs live
- Reports specific visual regressions and a Design QA score

**When to use:** Guard against visual regressions relative to a known-good state

---

### /clone-website

**Purpose:** Clone or reinterpret an external website into this project’s stack

**Usage:**
```bash
/clone-website https://example.com exact
/clone-website https://site.com similar
```

**What it does:**
- Fetches HTML/CSS for the URL (via MCP or curl)
- Uses `frontend-layout-analyzer` to build a layout map
- Uses `frontend-builder-agent` to implement clone pages/components
- Intended to be followed by `/frontend-iterate` for enforced quality

**When to use:** Import proven layouts/flows into your Same.new/Next.js stack

---

### /frontend-iterate

**Purpose:** Enforced Same.new-style frontend pipeline with mandatory customization and iteration

**Usage:**
```bash
/frontend-iterate "Refine dashboard layout"
```

**What it does:**
- Enforces customization of UI primitives based on design DNA
- Runs `frontend-builder-agent` → design/standards validators
- Iterates until Design + Standards scores ≥ 90 and ≥ 3 passes (or budget reached)
- Runs claim verification on “tests pass”/“bug fixed” claims

**When to use:** High-stakes UI work that must meet a very high visual/standards bar

---

### /frontend-analyze

**Purpose:** Diagnose frontend visual bugs by combining screenshot evidence with code analysis

**Usage:**
```bash
/frontend-analyze "Checkout card alignment looks wrong"
```

**What it does:**
- Uses `frontend-design-reviewer-agent` to identify specific visual issues from the screenshot
- Uses `frontend-layout-analyzer` to map those issues to routes/components/styles
- Produces a root-cause report and minimal fix plan (no code changes)

**When to use:** You have a screenshot of a broken layout and want to know which files/components are likely responsible

---

## Verification & Quality (5)

### /visual-review

**Purpose:** Browser screenshot and visual QA review

**Usage:**
```bash
/visual-review http://localhost:3000
/visual-review http://localhost:8080/protocols/injury
```

**What it does:**
1. Opens URL in browser (via chrome-devtools MCP)
2. Takes screenshot
3. Analyzes with vision
4. Reports visual issues, layout problems

**When to use:** Quick visual verification of implemented UI

---

### /visual-smoke

**Purpose:** Quick responsive screenshots + console capture

**Usage:**
```bash
/visual-smoke
```

**What it does:**
- Screenshots at multiple breakpoints
- Console error capture
- Fast smoke test (no deep analysis)

**When to use:** Quick sanity check before deployment

---

### /visual-iterate

**Purpose:** Iterative visual development loop with spec-driven gates

**Usage:**
```bash
/visual-iterate
```

**What it does:**
1. Captures current state
2. Compares against spec/blueprint
3. Identifies gaps
4. Implements fixes
5. Repeats until spec satisfied

**When to use:** UI development requiring multiple iteration rounds

---

### /mode

**Purpose:** Toggle verification mode on/off

**Usage:**
```bash
# Enable strict verification gates
/mode -on

# Enable with note
/mode -on "Testing new quality pipeline"

# Disable for development
/mode -off

# Disable with note
/mode -off "Rapid prototyping phase"
```

**What it does:**
- `-on` → Enables all quality gates (strict)
- `-off` → Disables verification checks (development mode)

**When to use:** Control verification strictness based on phase (dev vs production)

---

### /tweak

**Purpose:** Quick tweak mode — fast confirmation without heavy gates

**Usage:**
```bash
/tweak "Fix button padding"
/tweak "Update copy on hero section"
```

**What it does:**
- Runs fast confirmation (no screenshots)
- Lightweight verification
- Quick iteration for small changes

**When to use:** Small UI tweaks, copy changes, minor fixes

---

## Memory & Learning (4)

### /memory-search

**Purpose:** Query Workshop memory database

**Usage:**
```bash
/memory-search "CSS framework decision"
/memory-search "authentication implementation"
```

**What it does:**
- Searches `.claude/memory/workshop.db`
- Uses vibe-memory MCP (semantic + FTS5)
- Returns decisions, gotchas, antipatterns

**When to use:** Recall prior decisions, look up project patterns

**See:** `quick-reference/memory-explainer.md`

---

### /memory-learn

**Purpose:** Manually trigger reflection and learning update

**Usage:**
```bash
/memory-learn
```

**What it does:**
1. Analyzes current session
2. Extracts patterns (what worked, what failed)
3. Updates playbooks in `.claude/memory/playbooks/`

**When to use:** End of session, after major work completion

---

### /memory-pause

**Purpose:** Temporarily disable learning system

**Usage:**
```bash
/memory-pause
```

**What it does:**
- Stops automatic learning
- Useful for debugging or testing

**When to use:** Testing workflows without affecting learned patterns

---

### /context-snapshot

**Purpose:** Build or refresh a compact ContextSnapshot for this project

**Usage:**
```bash
/context-snapshot
```

**What it does:**
- Detects project type and key directories
- Maps routes and components
- Tracks customization status for UI primitives
- Summarizes design token usage and obvious violations

**When to use:** Before heavy planning/orchestration so all agents share a single view of the codebase


---

## Analysis & Strategy (2)

### /creative-strategist

**Purpose:** Senior brand strategist and advertising analyst

**Usage:**
```bash
/creative-strategist "<paste performance data + ads>"
```

**What it does:**
1. Analyzes creative signals (copy, visuals, CTAs)
2. Maps to performance metrics (CTR, CPC, conversion)
3. Identifies patterns (what worked vs what didn't)
4. Provides recommendations grounded in data

**When to use:** Ad performance analysis, creative strategy

**Output:** Strategic analysis (not implementation)

---

### /ultra-think

**Purpose:** Deep analysis and problem solving with multi-dimensional thinking

**Usage:**
```bash
/ultra-think "How should we architect multi-tenant auth?"
/ultra-think "What's causing this performance regression?"
```

**What it does:**
- Uses sequential-thinking MCP
- Multi-step reasoning
- Hypothesis generation → verification → repeat
- Provides single correct answer

**When to use:** Complex problems requiring deep analysis

---

## Specialized Workflows (5)

### /mm-copy

**Purpose:** Marina Moscone copy strategist — generate brand-calibrated ad copy

**Usage:**
```bash
/mm-copy
/mm-copy "top:20"  # Top 20 SKUs
/mm-copy "SKU123 SKU456"  # Specific SKUs
```

**What it does:**
1. Loads SKU data from project
2. Generates copy variants per SKU
3. Craft+benefit formulas
4. Calibrated to quiet luxury tone

**When to use:** Ad copy generation for MM brand (specific project)

---

### /mm-comps

**Purpose:** Marina Moscone competitor research

**Usage:**
```bash
/mm-comps "Khaite, Toteme, The Row"
```

**What it does:**
1. Competitor dossiers (prices, lookbooks, visuals)
2. Press search, collection reviews
3. Story arcs (timeline of inflection points)

**When to use:** Market research for MM (specific project)

---

### /introspect

**Purpose:** Run introspection pass to predict failure modes and set risk gate

**Usage:**
```bash
/introspect
```

**What it does:**
1. Analyzes current plan/implementation
2. Predicts failure modes
3. Sets up risk gates
4. Provides recommendations

**When to use:** Before complex implementation, risk assessment

---

### /cleanup

**Purpose:** Review and clean up old evidence and log files with interactive options

**Usage:**
```bash
/cleanup
```

**What it does:**
1. Detects legacy folders (`.claude-work/`, `.orchestration/`)
2. Consolidates to `.claude/memory/` and `.claude/orchestration/`
3. Removes empty legacy folders
4. Reports consolidation

**When to use:** Periodic cleanup, migrate legacy structure

---

## Enhancement & Completion (3)

### /enhance

**Purpose:** Transform vague requests into well-structured prompts

**Usage:**
```bash
# Enhance and execute
/enhance "Make the UI better"

# Clarify only (no execution)
/enhance -clarify "Add authentication"

# Debug mode
/enhance --debug "Build dashboard"
```

**What it does:**
1. Analyzes request
2. Identifies missing information
3. Uses Claude 4 best practices
4. Produces structured prompt

**Modes:**
- Default: Enhance + execute
- `-clarify`: Enhance only, show structured prompt
- `--debug`: Show reasoning

**When to use:** Vague user requests requiring clarification

---

### /completion-drive

**Purpose:** Meta-cognitive strategy for two-tier assumption tracking

**Usage:**
```bash
/completion-drive
```

**What it does:**
- Tracks assumptions made during generation
- Marks uncertainties
- Prevents false completion

**When to use:** Used internally by orchestrators (not typically invoked directly)

---

### /vibe-feedback

**Purpose:** Collect user feedback on system performance

**Usage:**
```bash
/vibe-feedback
```

**What it does:**
- Interactive feedback collection
- Stores in `.claude/feedback/`

**When to use:** Report issues, suggest improvements

---

## Command Categories Summary

```
Orchestration (3):
├── /orca                    ← Multi-agent with team confirmation
├── /response-aware          ← 6-phase plan + implement + verify
└── /seo-orca                ← SEO research → brief → draft

Design & UI (10):
├── /design-director         ← Quiet luxury layouts (blueprint-first)
├── /fox-designer            ← PeptideFox brand specialist
├── /obdn-designer           ← OBDN brand specialist
├── /design-review           ← Interactive review via Playwright
├── /ascii-mockup            ← ASCII UI sketches
├── /frontend-from-mockup    ← Build frontend from mockup image
├── /design-review-from-screenshot ← Compare live UI to reference screenshot
├── /clone-website           ← Clone/import external website into this stack
├── /frontend-iterate        ← Enforced Same.new-style frontend pipeline
└── /frontend-analyze        ← Diagnose frontend issues from screenshot + code

Verification & Quality (5):
├── /visual-review           ← Browser screenshot + analysis
├── /visual-smoke            ← Quick responsive screenshots
├── /visual-iterate          ← Iterative visual dev loop
├── /mode                    ← Toggle verification on/off
└── /tweak                   ← Fast tweak mode (no heavy gates)

Memory & Learning (4):
├── /memory-search           ← Query Workshop database
├── /memory-learn            ← Update playbooks
├── /memory-pause            ← Disable learning
└── /context-snapshot        ← Build ContextSnapshot for project

Analysis & Strategy (2):
├── /creative-strategist     ← Brand + performance analysis
└── /ultra-think             ← Deep problem solving

Specialized (5):
├── /mm-copy                 ← MM ad copy generator
├── /mm-comps                ← MM competitor research
├── /mm-designer             ← MM quiet-luxury UI/layout design
├── /introspect              ← Risk assessment
└── /cleanup                 ← Folder consolidation

Enhancement (3):
├── /enhance                 ← Clarify vague requests
├── /completion-drive        ← Assumption tracking
└── /vibe-feedback           ← User feedback collection
```

---

## Usage Patterns

### Full Feature Development

```bash
# Option 1: ORCA (multi-agent)
/orca "Build user authentication with OAuth"

# Option 2: Response Aware (6-phase)
/response-aware "Add dark mode to settings"
```

---

### Plan Then Build

```bash
# 1. Plan only
/response-aware -plan "Complex multi-step feature"

# 2. Review blueprint, approve

# 3. Build from blueprint
/response-aware -build .orchestration/blueprint.md
```

---

### UI Design Workflow

```bash
# 1. Design blueprint
/design-director "product detail page layout"

# 2. Implement (manual or via /orca)

# 3. Visual review
/visual-review http://localhost:3000

# 4. Design review (comprehensive)
/design-review
```

---

### Quick Iteration

```bash
# Small changes
/tweak "Fix button hover state"

# Visual check
/visual-smoke
```

---

### Memory-Driven Development

```bash
# Before starting
/memory-search "authentication patterns"

# After completing
/memory-learn
```

---

## Best Practices

### 1. Choose the Right Command

✓ **/orca** — Complex, multi-domain work
✓ **/response-aware** — Features requiring evidence
✓ **/design-director** — Layout design (blueprint-first)
✓ **/creative-strategist** — Strategic analysis (not implementation)

---

### 2. Plan Before Building (When Complex)

```bash
# Don't:
/orca "Massive multi-step migration"

# Do:
/response-aware -plan "Massive multi-step migration"
# Review blueprint
/response-aware -build blueprint.md
```

---

### 3. Use Memory System

```bash
# Always search first
/memory-search "relevant topic"

# Record after completing
/memory-learn
```

---

### 4. Verify UI Work

```bash
# Quick check
/visual-smoke

# Before merge
/design-review

# Iteration loop
/visual-iterate
```

---

## Troubleshooting

### Command Not Found

```bash
Problem: "/command not found"
Solution:
1. Check ~/.claude/commands/ exists
2. Verify command-name.md file present
3. Restart Claude Code to reload commands
```

---

### ORCA File Limit

```bash
Problem: "❌ FILE LIMIT REACHED - Cannot proceed"
Solution:
1. Review .orchestration/implementation-log.md
2. Check for planning docs (should be banned)
3. Clean up /tmp/orca-session/
4. File limits: 2/task, 10/agent, 50/session
```

---

### Memory Search Returns Nothing

```bash
Problem: No results from /memory-search
Solution:
1. Check .claude/memory/workshop.db exists
2. Verify vibe-memory MCP configured
3. Add knowledge: workshop decision "your decision"
4. Rebuild index if needed
```

---

## Summary

**Total Commands:** 24

**Most Used:**
- `/orca` — Multi-agent orchestration
- `/response-aware` — Evidence-based workflow
- `/design-director` — Layout blueprints
- `/memory-search` — Recall decisions
- `/visual-review` — UI verification

**Quality Gates:**
- `/mode -on` — Enable verification
- `/design-review` — Comprehensive UI review
- `/visual-iterate` — Iterative refinement

**Specialized:**
- `/mm-copy`, `/mm-comps` — Marina Moscone specific
- `/fox-designer`, `/obdn-designer` — Brand-specific designs

**All commands defined in:** `~/.claude/commands/`

---

_Last updated: 2025-11-14_
_Update after: New commands added or command behavior changes_
