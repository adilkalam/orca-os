# ORCA

**Multi-agent orchestration for Claude Code that learns from outcomes and prevents false completions**

ORCA (Orchestrated Research & Coordinated Agents) is a self-improving orchestration system that:
- Detects your tech stack and proposes specialist teams
- Requires **user confirmation** before dispatching agents
- Enforces evidence-based verification (screenshots, tests, builds)
- Learns from every session to improve future orchestration
- Prevents chaos through strict file creation limits

---

## The ORCA Workflow in Action

```
User: "Build iOS weather app with local caching"
                    │
                    ↓
┌────────────────────────────────────────────────────────────────┐
│ TECH DETECTION                                                 │
│ Keywords: "iOS", "caching" → iOS + data persistence           │
│ Files: *.xcodeproj found → Confirmed iOS                      │
└────────────────────┬───────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────────────────┐
│ TEAM PROPOSAL                                                  │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ Proposed iOS Team (6 agents):                           │   │
│ │                                                          │   │
│ │ Planning:                                                │   │
│ │ • requirement-analyst - Clarify weather data needs      │   │
│ │ • system-architect - Design cache strategy              │   │
│ │                                                          │   │
│ │ Implementation:                                          │   │
│ │ • swiftui-developer - Build UI                          │   │
│ │ • swiftdata-specialist - Local caching                  │   │
│ │ • urlsession-expert - Weather API integration           │   │
│ │                                                          │   │
│ │ Quality:                                                │   │
│ │ • verification-agent - Evidence collection              │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                                │
│ [✓] Proceed  [ ] Modify  [ ] Cancel                           │
└────────────────────┬───────────────────────────────────────────┘
                     ↓ User confirms
┌────────────────────────────────────────────────────────────────┐
│ PARALLEL AGENT EXECUTION                                      │
│                                                                │
│ requirement-analyst ──→ Creates requirements.md               │
│         ↓                                                      │
│ system-architect ────→ Designs WeatherCache protocol          │
│         ↓                                                      │
│    ┌────┴────┬──────────┬────────────┐                       │
│    ↓         ↓          ↓            ↓                       │
│ swiftui-  swiftdata-  urlsession-  verification-             │
│ developer specialist  expert       agent                      │
│    │         │          │            │                        │
│    ↓         ↓          ↓            ↓                       │
│ Views.swift Cache.swift API.swift  Evidence/                 │
└────────────────────┬───────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────────────────┐
│ EVIDENCE VERIFICATION GATES                                   │
│                                                                │
│ GATE 0: Content Awareness ✓ (understood weather + caching)    │
│    ↓                                                          │
│ GATE 1: Meta-tags verified ✓                                  │
│    #FILE_CREATED: WeatherView.swift                          │
│    #FILE_CREATED: WeatherCache.swift                         │
│    ↓                                                          │
│ GATE 2: Build succeeds ✓                                      │
│    xcodebuild clean && xcodebuild build → SUCCESS            │
│    ↓                                                          │
│ GATE 3: Tests pass ✓                                          │
│    swift test → 12/12 tests passed                           │
│    ↓                                                          │
│ GATE 4: Screenshot captured ✓                                 │
│    .orchestration/evidence/weather-app.png                   │
│    ↓                                                          │
│ GATE 5: Quality validated ✓                                   │
└────────────────────┬───────────────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────────────────┐
│ LEARNING & EVOLUTION                                          │
│                                                                │
│ Pattern: "ios-weather-pattern"                                │
│ Before: helpful_count: 5, harmful_count: 0                    │
│                                                                │
│ Outcome: SUCCESS (all gates passed)                           │
│ Update: helpful_count: 5 → 6                                  │
│                                                                │
│ Next time: Higher confidence in this pattern                  │
└────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

```bash
# 1. Install hooks (Workshop memory + session context)
bash .claude-global-hooks/install.sh

# 2. Open your project with Claude Code
cd your-project

# 3. Use ORCA orchestration
/orca "Build iOS weather app with local caching"

# ORCA will:
# - Detect "iOS" from keywords
# - Propose team: swiftui-developer, swiftdata-specialist, state-architect
# - Ask you to confirm
# - Dispatch agents with quality gates
# - Verify with build + tests + screenshots
# - Learn from outcome
```

---

## The Self-Learning Engine: ACE Playbooks

**Problem:** Traditional orchestration uses static rules that never improve.

**ORCA's Solution:** Agentic Context Engineering (ACE) — patterns that evolve based on outcomes.

```
Generator-Reflector-Curator Architecture
─────────────────────────────────────────

Session Start
   ↓
┌────────────────┐
│   Generator    │  Loads playbooks → Selects patterns
│   (ORCA)       │  "iOS 17+ → swiftui + swiftdata"
└──┬─────────────┘
   ↓
 Work Executed
   ↓
┌────────────────┐
│   Reflector    │  Analyzes outcome → Was pattern helpful?
│                │  "Pattern worked → helpful_count +1"
└───┬────────────┘
    ↓
┌────────────────┐
│    Curator     │  Updates playbooks (delta only)
│                │  "ios-pattern-001: 5 → 6 sessions"
└────────────────┘
```

### Pattern Evolution

Each pattern tracks:
- `helpful_count` — Times it succeeded
- `harmful_count` — Times it failed
- `evidence` — Why it works/fails
- `learned_from` — Which sessions proved it

**Pattern Death:**
```
IF harmful_count > helpful_count × 3
THEN schedule_deletion(7_days_grace_period)
```

Bad patterns self-destruct. Good patterns accumulate evidence.

---

## Evidence-Based Verification

**Problem:** AI says "done" but code doesn't compile / tests fail / UI is broken.

**ORCA's Solution:** Meta-cognitive tagging + mandatory verification gates.

### Meta-Cognitive Tags

Agents must tag their work:
```markdown
#FILE_CREATED: /path/to/file.swift
#COMPLETION_DRIVE: Assuming API endpoint exists
#SCREENSHOT_CLAIMED: .orchestration/evidence/weather-app.png
```

### Evidence Capture Helpers (New)

Use these helper scripts to capture evidence in the correct locations automatically:

```bash
# Build logs (auto-detects project type or pass your command after --)
bash scripts/capture-build.sh
# or
bash scripts/capture-build.sh -- npm run build

# Test output (auto-detects or pass your command after --)
bash scripts/capture-tests.sh
# or
bash scripts/capture-tests.sh -- pytest -q

# Screenshots via MCP (requests a browser screenshot, optionally waits)
bash scripts/capture-screenshot.sh http://localhost:3000/page --wait-for 20
# Custom output name
bash scripts/capture-screenshot.sh http://localhost:3000/page --out after.png --wait-for 20
```

### Verification Gates (Sequential)

```
GATE 0: Content Awareness
    ↓
GATE 1: Response Awareness (verify tags)
    ↓
GATE 2: Tests (unit + integration)
    ↓
GATE 3: UI Testing (if visual work)
    ↓
GATE 4: Design Review (if visual work)
    ↓
GATE 5: Quality Validation

If ANY gate fails → BLOCK completion

Notes:
- UI changes require at least one screenshot saved under `.orchestration/evidence/`.
- Commits are blocked for active ORCA sessions until `bash scripts/finalize.sh` creates `.verified`.
- Agents must not self-score quality; `/finalize` is the source of truth.

### Updated Slash Commands (Simplified)

- Core: `/respawr` (response awareness), with companions `/respawr-plan` and `/respawr-build` for plan-only and build/capture flows. `or/seo-orca` remain available.
- Modes: `/mode -on` and `/mode -off` replace multiple strict/tweak variants.
- Prompting: `/enhance -clarify` replaces standalone `/clarify`.
- Maintenance: `/cleanup` now covers organize/safe tidy (no destructive deletes by default).
- Brand tools: `/mm-copy` (brand-calibrated ad copy), `/mm-comps` (competitor dossiers incl. press + collection reviews).

Evidence policy remains unchanged: control files and all proof live under `.orchestration/` (evidence in `.orchestration/evidence/`). Human‑facing reports may live under project folders (e.g., `minisite/data/reports/`).

---

## SEO Workflow Quick Start

For the internal SEO automation (SEO‑ORCA), use the quick reference below. The public‑facing overview remains in docs/architecture/seo-orca.md.

- Quick reference: quick-reference/SEO-Quick-Reference.md
- Public overview: docs/architecture/seo-orca.md

Minimal keyless run (CLI)

```
python3 scripts/seo_auto_pipeline.py "<KEYWORD>" \
  --max-results 0 --allowlist-only --draft \
  --research-doc "/path/to/curated1.md" \
  --research-doc "/path/to/curated2.md" \
  --knowledge-graph "/path/to/kg.json" \
  --knowledge-root "/path/to/kg/root" \
  --focus-term Term1 --focus-term Term2
```

Outputs land in `outputs/seo/<slug>-{report.json,brief.json,brief.md,draft.md}`. No API keys required; SERP is optional and filtered via allowlist/vendor rules.
```

### Platform-Specific Evidence

**iOS:**
```bash
# Clean build from scratch
rm -rf DerivedData
xcodebuild clean && xcodebuild build

# Install to simulator
xcrun simctl install booted app.app

# Capture screenshot
xcrun simctl io booted screenshot evidence.png
```

**Frontend:**
```bash
# Build succeeds
npm run build

# Dev server runs
npm run dev &

# Browser screenshot captured
```

**Data Analysis:**
```bash
# Every number verified with grep
grep -A 5 "Total Sales" report.md

# Calculations checked
python -c "print(12 + 38)"  # = 50 ✓
```

---

## Workshop Memory: Durable Project Knowledge

**Problem:** AI forgets decisions, gotchas, and context between sessions.

**ORCA's Solution:** Workshop — SQLite-backed memory per project.

```
Session 1: Build calculator
    ↓
Workshop Records:
- decision: "Use global CSS, not Tailwind"
- gotcha: "Vercel requires Node 18+"
- goal: "Add scientific mode next"
    ↓
Session 2 (weeks later):
Claude loads Workshop context automatically
→ Remembers CSS decision
→ Avoids Vercel gotcha
→ Knows scientific mode is next
```

### Workshop Architecture

```
┌──────────────────────────────────────────────────────┐
│  Session Start Hook                                  │
│  ↓                                                   │
│  workshop init (if needed)                           │
│  workshop import (catch-up after crashes)            │
│  ↓                                                   │
│  Load recent:                                        │
│  - Decisions (last 5)                                │
│  - Gotchas (last 3)                                  │
│  - Goals (active)                                    │
│  ↓                                                   │
│  Inject into Claude context                          │
└──────────────────────────────────────────────────────┘
```

### Memory Commands

```bash
# Search memory
workshop search "CSS"

# Add decision
workshop decision "Use Supabase for auth" -r "Self-hosted requirement"

# Record gotcha
workshop gotcha "iOS Simulator needs Xcode 15.4+"

# View context
workshop context
```

---

## Chaos Prevention

**LLM File Chaos:**

AI agents left to their own devices create:
- Excessive planning documents
- Elaborate frameworks
- Verification systems for verification systems
- **Zero actual work**

**ORCA's Solution:** Strict limits + monitoring.

```
Rules per Agent:
┌────────────────────────┐
│ Max 2 files per task   │  (implementation + test)
│ NO planning documents  │  (PLAN.md, TODO.md banned)
│ Evidence → dedicated   │  (.orchestration/evidence/)
│ Delete temps instantly │
└────────────────────────┘

Enforcement:
┌────────────────────────┐
│ Warnings at:           │
│ - 10 files             │
│ - 25 files             │
│ - 50 files (BLOCK)     │
└────────────────────────┘

Monitoring:
┌────────────────────────┐
│ chaos-monitor          │  (detect mess patterns)
│ chaos-cleanup          │  (interactive cleanup)
│ agent-chaos-monitor    │  (agent-specific tracking)
└────────────────────────┘
```

**Philosophy:** *Just do the work, don't document plans to maybe do work.*

---

## Tech Stack Auto-Detection

ORCA detects your stack from keywords + project files:

```
Keywords Checked:
────────────────
"iOS" / "SwiftUI"     → iOS Team (6-15 agents)
"React" / "Next.js"   → Frontend Team (10-15 agents)
"Python" / "FastAPI"  → Backend Team (6 agents)
"sales" / "ads data"      → Data Analysis Team (5-7 agents)

Files Checked:
─────────────
*.xcodeproj           → iOS
package.json + *.tsx  → Frontend
requirements.txt      → Backend
*.csv + "revenue"     → Data Analysis
```

### Specialized Teams

**iOS Team:**
- swiftui-developer, swiftdata-specialist, state-architect
- swift-testing-specialist, ui-testing-expert
- urlsession-expert (if API work)
- xcode-cloud-expert (if CI/CD)

**Frontend Team:**
- react-18-specialist OR nextjs-14-specialist
- css-specialist (global CSS, no Tailwind)
- state-management-specialist
- frontend-performance-specialist
- accessibility-specialist

**Data Analysis Team:**
- merch-lifecycle-analyst (product journeys)
- ads-creative-analyst (ad performance, granular)
- sales-analyst (sales events)
- story-synthesizer (causality, recommendations)

**Backend Team:**
- backend-engineer (Python/Node/Go)
- test-engineer (pytest, vitest)

---

## User Confirmation: Humans Stay in Control

**CRITICAL:** ORCA always asks before dispatching agents.

```
You: /orca "Build weather app"

ORCA analyzes:
- Keywords: "weather" → API integration
- Files: *.xcodeproj → iOS detected
    ↓
Proposes Team:
┌─────────────────────────────────────┐
│ iOS Team (6 agents):                │
│                                     │
│ Planning:                           │
│ - requirement-analyst               │
│ - system-architect                  │
│                                     │
│ Implementation:                     │
│ - swiftui-developer                 │
│ - swiftdata-specialist (caching)    │
│ - urlsession-expert (weather API)   │
│ - state-architect (state design)    │
│                                     │
│ Quality:                            │
│ - verification-agent                │
│ - quality-validator                 │
└─────────────────────────────────────┘

Interactive Prompt:
┌─────────────────────────────────────┐
│ Confirm proposed team?              │
│                                     │
│ [✓] Proceed with team               │
│ [ ] Modify team (adjust agents)     │
│ [ ] Other                           │
└─────────────────────────────────────┘
```

**You choose. Always.**

No blind automation. No surprise agent spawns.

---

## Installation

```bash
# 1. Clone repo
git clone https://github.com/yourusername/claude-vibe-code.git
cd claude-vibe-code

# 2. Install global hooks (Workshop + session context)
bash .claude-global-hooks/install.sh

# 3. (Optional) Install Workshop CLI
# Follow: docs/workshop.md

# 4. (Optional) Enable MCP servers
# - XcodeBuild MCP (iOS/macOS builds)
# - Chrome DevTools MCP (browser automation)
# - vibe-memory MCP (memory.search tool)
# See: docs/mcp-memory.md

# 5. (Recommended) Install repo git hooks (finalize gate)
bash scripts/install-git-hooks.sh

# Finalize before committing work from an ORCA session
bash scripts/finalize.sh
```

---

## Core Commands

```bash
# Orchestration
/orca "what you want built"              # Smart team selection + dispatch
/orca [COMPLEX] "complex multi-phase"    # Use Opus for planning
/respawr "…"                             # Response Awareness (full: plan → build → verify)

# Response Awareness aliases
/respawr -plan "…"                      # Plan-only; produce blueprint for approval
/respawr -build <blueprint.md>           # Implement + verify from approved blueprint

# Planning (for risky work)
/enhance -clarify "…"                   # Ask 2–3 crisp questions, summarize, stop
/response-awareness-plan                 # Plan → user approval → implement (original)
/response-awareness-implement <path>     # Execute approved plan (original)
/introspect                              # Predict failure modes

# Verification
/finalize                                # Final evidence check (orca sessions)
/visual-review <url>                     # Browser screenshot + analysis

# Modes
/mode -on                                # Strict: require .verified from finalize
/mode -off                               # Disable checks temporarily (trusted sprint)

# Memory
/memory-search <query>                   # Search Workshop memory
/memory-learn                            # Reflect + update playbooks
/memory-pause                            # Disable learning (testing mode)

# Organization
/cleanup                                 # Verify organization + archive stale evidence/logs (safe)
```

---

## Project Structure

```
claude-vibe-code/
├── agents/                     # 65 specialist agents
│   ├── core/                   # Core orchestrators
│   ├── planning/               # requirement-analyst, system-architect
│   ├── implementation/         # backend-engineer, android-engineer
│   ├── quality/                # verification-agent, quality-validator
│   └── specialists/            # Platform-specific specialists
│       ├── ios/                # 20 iOS specialists
│       ├── frontend/           # 15 frontend specialists
│       └── data/               # 7 data analysis specialists
│
├── commands/                   # 30 slash commands
│   ├── orca.md                 # Main orchestrator
│   ├── enhance.md              # Request enhancer
│   ├── memory-learn.md         # Learning trigger
│   └── finalize.md             # Evidence verification
│
├── hooks/                      # 8 session hooks
│   ├── load-playbooks.sh       # ACE playbook loader
│   ├── detect-project-type.sh  # Tech stack detection
│   └── session-start.sh        # Context initialization
│
├── scripts/                    # 41 utilities
│   ├── workshop-*.sh           # Workshop memory scripts
│   ├── finalize.sh             # Evidence check script
│   ├── memory-*.py             # Memory operations
│   └── deploy-to-global.sh     # Install to ~/.claude/
│
├── docs/                       # Organized documentation
│   ├── architecture/           # System design docs
│   ├── design/                 # UI/design system docs
│   └── memory/                 # Workshop/memory docs
│
├── quick-reference/            # Quick access guides
│   ├── agents-teams.md         # Team compositions
│   ├── commands.md             # Command reference
│   └── triggers-tools.md       # Natural language triggers
│
├── .orchestration/             # Per-project runtime
│   ├── playbooks/              # ACE patterns (evolve)
│   ├── evidence/               # Screenshots, artifacts
│   └── signals/                # Outcome tracking
│
├── .workshop/                  # Per-project memory
│   └── workshop.db             # SQLite FTS database
│
└── .claude-global-hooks/       # Global hook installer
    ├── install.sh              # One-time setup
    └── SessionStart.sh         # Auto-loads Workshop
```

---

## How ORCA Learns: Example Session

```
Session 1: Build iOS weather app
─────────────────────────────────

1. ORCA loads playbooks
   → Pattern: "ios-pattern-001" (SwiftUI + SwiftData + State-First)
   → helpful_count: 5, harmful_count: 0

2. User confirms team
   → swiftui-developer, swiftdata-specialist, state-architect

3. Agents execute
   → Build succeeds
   → Tests pass
   → Screenshots captured

4. Reflector analyzes
   → Pattern worked again
   → Recommendation: helpful_count 5 → 6

5. Curator updates playbook
   {
     "id": "ios-pattern-001",
     "helpful_count": 6,  // ← incremented
     "evidence": "proven across 6 sessions",
     "learned_from": [..., "weather-app-2025-11-06"]
   }

─────────────────────────────────
Session 27: Another iOS app
─────────────────────────────────

1. ORCA loads playbooks
   → Pattern: "ios-pattern-001"
   → helpful_count: 23, harmful_count: 1
   → High confidence (23:1 ratio)

2. User confirms (same pattern proven 23× before)

Result: Faster decisions. Better outcomes.
```

---

## Evidence Requirements by Platform

### iOS
```bash
✓ Clean build (DerivedData deleted)
✓ Simulator install successful
✓ Screenshot captured
✓ Tests pass (Swift Testing or XCTest)
```

### Frontend
```bash
✓ npm run build succeeds
✓ Dev server runs
✓ Browser screenshot captured
✓ Lighthouse score (if performance work)
```

### Backend
```bash
✓ pytest passes
✓ Server starts
✓ API endpoints respond
✓ Logs show no errors
```

### Data Analysis
```bash
✓ All numbers grep-verified from source
✓ Calculations checked (no fabrication)
✓ Source citations included
✓ Granular (not aggregated)
```

---

## Troubleshooting

**Workshop context not loading:**
```bash
# Check Workshop installed
workshop --version

# Reinitialize
workshop init

# Verify hooks installed
ls -la ~/.claude/hooks/SessionStart.sh
```

**Agents creating too many files:**
```bash
# Monitor chaos
chaos-monitor

# Clean up
chaos-cleanup

# Check agent limits
grep "Max 2 files" agents/**/*.md
```

**Playbooks not updating:**
```bash
# Manually trigger learning
/memory-learn

# Check signal log
cat .orchestration/signals/signal-log.jsonl | tail -20

# Verify reflection exists
ls .orchestration/sessions/*-reflection.md
```

**Memory search not working (MCP):**
```bash
# Check MCP config
cat ~/.claude.json | grep vibe-memory

# Verify database exists
ls .workshop/workshop.db

# Set WORKSHOP_DB env (if needed)
export WORKSHOP_DB="/path/to/project/.workshop/workshop.db"
```

---

## Key Principles

1. **User confirmation before automation** — You're in control, always
2. **Evidence beats claims** — Tests, builds, screenshots required
3. **Learn from outcomes** — Patterns evolve with proof
4. **Prevent chaos** — Strict limits on file creation
5. **Durable memory** — Workshop remembers across sessions

---

## Documentation

- **Quick Start:** This README
- **Workshop Memory:** `docs/memory/workshop.md`
- **ACE Playbooks:** `.orchestration/playbooks/readme.md`
- **Chaos Prevention:** `docs/architecture/chaos-prevention.md`
- **MCP Servers:** `docs/memory/mcp-memory.md`
- **Quick Reference:** `quick-reference/commands.md`
- **Evidence & Finalize:** `quick-reference/Evidence-Verification.md`

---

## What Makes ORCA Novel?

**1. Self-Learning Patterns**
- Not static rules — patterns evolve based on outcomes
- Apoptosis deletes bad patterns automatically
- Evidence accumulates over time

**2. Mandatory Human Gates**
- User confirms teams before dispatch
- No blind automation
- Interactive Q&A for critical decisions

**3. Evidence-Based Verification**
- Meta-cognitive tags prevent false completions
- Platform-specific evidence (builds, tests, screenshots)
- 5-gate quality pipeline

**4. Durable Project Memory**
- Workshop SQLite database per project
- Auto-loaded at session start
- Survives crashes (catch-up import)

**5. Chaos Prevention**
- Learned from 94,000 file disaster
- Max 2 files per agent
- Real-time monitoring

**6. Tech Stack Auto-Detection**
- Keywords + file analysis
- Specialized teams per stack
- Minimal teams (not kitchen sink)

---

## Credits

Built by [@adilkalam](https://github.com/adilkalam) after learning the hard way what happens when AI creates 94,000 planning documents.

**Philosophy:** *Make AI prove it, or it didn't happen.*

---

## License

MIT
