# ORCA - Smart Multi-Agent Orchestration

**Intelligent agent team orchestration with tech stack detection, chaos prevention, and evidence-based verification**

---

## Overview

ORCA is the primary multi-agent orchestrator for complex, cross-domain work. It automatically:
1. Detects the tech stack from request keywords and project files
2. Proposes an optimal specialist team
3. Gets user confirmation (always, no bypass)
4. Dispatches agents with strict file limits and chaos prevention
5. Runs quality gates and verification
6. Captures evidence of completion
7. Cleans up temporary files

**Philosophy:** Parallel planning with centralized decisions, bounded by hard file limits and standardized paths.

---

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    ORCA ORCHESTRATOR                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Phase 1: Tech Stack Detection                             │
│ ┌──────────────────────────────────────────────────┐       │
│ │ • Check prompt keywords (iOS, React, BFCM, etc.) │       │
│ │ • Scan project files (*.xcodeproj, package.json) │       │
│ │ • Determine stack: iOS / Frontend / Backend /    │       │
│ │   Data                                           │       │
│ └──────────────────────────────────────────────────┘       │
│                         ↓                                  │
│ Phase 2: Team Selection                                   │
│ ┌──────────────────────────────────────────────────┐       │
│ │ • Load team definitions from playbooks           │       │
│ │ • Select base team + specialists                 │       │
│ │ • iOS: 6-15 agents                               │       │
│ │ • Frontend: 10-15 agents                         │       │
│ │ • Backend: 6 agents                              │       │
│ │ • Data Analysis: 5-7 agents                      │       │
│ └──────────────────────────────────────────────────┘       │
│                         ↓                                  │
│ Phase 3: User Confirmation (MANDATORY)                    │
│ ┌──────────────────────────────────────────────────┐       │
│ │ • Interactive confirmation via AskUserQuestion   │       │
│ │ • Shows proposed team                            │       │
│ │ • User can confirm or modify                     │       │
│ │ • No bypass - always runs                        │       │
│ └──────────────────────────────────────────────────┘       │
│                         ↓                                  │
│ Phase 4: Agent Dispatch                                   │
│ ┌──────────────────────────────────────────────────┐       │
│ │ • Create /tmp/orca-[timestamp]/ session dir      │       │
│ │ • Initialize .orchestration/orca-session marker  │       │
│ │ • Dispatch agents with chaos prevention rules    │       │
│ │ • Track file creation via #FILE_CREATED tags     │       │
│ │ • Monitor file count (warn at 10, 25, block at   │       │
│ │   50)                                            │       │
│ └──────────────────────────────────────────────────┘       │
│                         ↓                                  │
│ Phase 5: Verification                                     │
│ ┌──────────────────────────────────────────────────┐       │
│ │ • Run builds, tests                              │       │
│ │ • Capture screenshots                            │       │
│ │ • Verify all meta-tags resolved                  │       │
│ │ • Evidence → .orchestration/evidence/            │       │
│ └──────────────────────────────────────────────────┘       │
│                         ↓                                  │
│ Phase 6: Quality Gates (0-5)                              │
│ ┌──────────────────────────────────────────────────┐       │
│ │ GATE 0: content-awareness-validator (if content- │       │
│ │         heavy)                                   │       │
│ │ GATE 1: verification-agent                       │       │
│ │ GATE 2: test-engineer (unit + integration)       │       │
│ │ GATE 3: ui-testing-expert (if UI work)           │       │
│ │ GATE 4: design-reviewer (if UI work)             │       │
│ │ GATE 5: quality-validator (final review)         │       │
│ └──────────────────────────────────────────────────┘       │
│                         ↓                                  │
│ Phase 7: Cleanup & Delivery                               │
│ ┌──────────────────────────────────────────────────┐       │
│ │ • Run /finalize (git hooks via bash scripts)     │       │
│ │ • Clean up /tmp/orca-[sessionid]/                │       │
│ │ • Present results with evidence                  │       │
│ │ • Show file count summary                        │       │
│ └──────────────────────────────────────────────────┘       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Chaos Prevention System

**The Problem:** Previous systems created 94,000+ planning documents, consuming millions of tokens and obscuring actual implementation.

**The Solution:** Hard limits and standardized paths.

### File Limits (Enforced)

```
Per Agent:
├── 2 files per task (implementation + test)
└── 10 files total per agent session (hard limit)

Per ORCA Session:
└── 50 files total (session blocks at this limit)

Warnings:
├── 10 files → "⚠️ Approaching file limit (10/50)"
├── 25 files → "⚠️ HIGH FILE COUNT - Review needed (25/50)"
└── 50 files → "❌ FILE LIMIT REACHED - Cannot proceed"
```

### Standardized Paths

```
.orchestration/
├── evidence/              ← FINAL artifacts (screenshots, reports)
│   └── YYYYMMDD-HHMMSS-*.png
├── logs/                  ← Agent execution logs
│   └── [agent]-[timestamp].log
├── implementation-log.md  ← Meta-cognitive tags tracking
└── orca-session          ← Session marker (enables /finalize)

/tmp/
└── orca-[sessionid]/      ← Temporary files (deleted after session)

Implementation Files:
→ Go where they belong in project structure
  (components/ for React, Sources/ for iOS, etc.)
```

### Banned Files (Never Created)

```
❌ PLAN.md, TODO.md, CHECKLIST.md, NOTES.md
❌ plan-*.md, *-plan.md, PLAN_*.md
❌ implementation-*.md, *-implementation.md
❌ verification-*.md, unified-*.md
❌ .backup, .bak, -old, -copy files
❌ Any "planning document" that isn't actual code
```

### Meta-Cognitive Tags (Required)

Every agent must tag file operations:

```markdown
#FILE_CREATED: /path/to/actual/file.tsx
#FILE_MODIFIED: /path/to/existing/file.py
#FILE_DELETED: /tmp/orca-session/temp.json
#EVIDENCE_CAPTURED: .orchestration/evidence/20251108-143022-screenshot.png
```

ORCA tracks these tags to monitor file count and enforce limits.

---

## Tech Stack Detection

### Prompt Keywords

```
Data Analysis:
- BFCM, sales, ads, causality, granular, data analysis
- product journey, price bands, direct vs marketplace
- baseline, organic, steady state, non-sale
- CPM, CTR, CPC, ad performance, copy effectiveness
- synthesize, strategy, recommendations

iOS:
- iOS, SwiftUI, Xcode, simulator, device
- Core Data, SwiftData, Observation

Frontend:
- React, Next.js, frontend, web app
- CSS, design system, component library

Backend:
- Python, Django, FastAPI, Node, Express
- API, database, authentication

Mobile:
- React Native, Flutter, mobile app
- Android, iOS native
```

### Project Files (via Glob)

```
iOS:
- *.xcodeproj, *.xcworkspace
- *.swift

Frontend:
- package.json + *.tsx
- next.config.js

Backend:
- requirements.txt, *.py
- package.json + *.ts (Node)

Mobile:
- pubspec.yaml (Flutter)
- android/ + ios/ (React Native)
```

---

## Agent Teams by Stack

**Full details:** `.orchestration/reference/team-definitions.md`

### Data Analysis Team (5-7 agents)

**Core (5):**
- merch-lifecycle-analyst — Master product journeys, month-by-month by price bands
- general-performance-analyst — Baseline/organic performance (non-sale periods)
- ads-creative-analyst — Granular ad analysis (CPM/CTR/CPC, copy effectiveness)
- bf-sales-analyst — BFCM/sale event analysis (verified actual sales)
- story-synthesizer — Connect all dots into causal chains

**Support (2):**
- verification-agent
- quality-validator

**Selection Rules:**
- Use general-performance-analyst for baseline/organic analysis
- Use bf-sales-analyst for BFCM/sale events
- Do NOT use both (they cover different time periods)

**Special Dispatch:**
Data analysts aren't in Task tool subagent types, so use:
```javascript
Task({
  subagent_type: "general-purpose",
  prompt: "Follow methodology in agents/specialists/data-analysts/merch-lifecycle-analyst.md. CHAOS RULES: Max 2 files, evidence in .orchestration/evidence/"
})
```

---

### iOS Team (6-15 agents)

**Base (4):**
- requirement-analyst
- system-architect
- verification-agent
- quality-validator

**Specialists (2-11):**
- swiftui-developer (UI implementation)
- swiftdata-specialist (iOS 17+ persistence)
- state-architect (modern state-first patterns)
- swift-testing-specialist (Swift Testing framework)
- ui-testing-expert (XCUITest automation)
- observation-specialist (@Observable patterns)
- coredata-expert (legacy support, iOS 16)
- combine-networking (reactive data flows)
- urlsession-expert (REST APIs with async/await)
- ios-performance-engineer (Instruments profiling)
- xcode-cloud-expert (CI/CD)

**Select based on requirements:**
- SwiftData vs Core Data (modern vs legacy)
- Testing needs (unit vs UI)
- Networking complexity
- CI/CD requirements

---

### Frontend Team (10-15 agents)

For this repo’s Same.new/Next.js-style UI/layout work, `/orca` now treats the **v2 frontend agents** as the default spine:
- Analysis: `frontend-layout-analyzer`
- Implementation: `frontend-builder-agent`
- Standards: `frontend-standards-enforcer`
- Visual QA: `frontend-design-reviewer-agent`

The more general Frontend Team below remains a reference for larger cross‑domain/frontend‑heavy efforts or for stacks where the v2 agents don’t apply.

**Planning (2):**
- requirement-analyst
- system-architect

**Design (5):**
- ux-strategist (user flows, interaction design)
- design-system-architect (design tokens, component patterns)
- css-specialist (global CSS, no Tailwind)
- ui-engineer (component implementation)
- accessibility-specialist (WCAG 2.1 AA)

**Implementation (2-4):**
- react-18-specialist OR nextjs-14-specialist (pick one, not both)
- state-management-specialist (UI/server/URL state separation)
- frontend-performance-specialist (code splitting, Core Web Vitals)

**QA (3):**
- frontend-testing-specialist (Vitest, React Testing Library)
- design-reviewer (visual verification, Playwright)
- verification-agent
- quality-validator

**Selection Rules:**
- React 18 specialist for client-side React apps
- Next.js 14 specialist for SSR/SSG apps
- Both teams include design-system-architect for token-driven styling

---

### Backend Team (6 agents)

**Full Team:**
- requirement-analyst
- system-architect
- backend-engineer (Node.js, Go, Python)
- test-engineer (unit + integration tests)
- verification-agent
- quality-validator

**Stack Support:**
- Node.js (Express, NestJS)
- Go (net/http, Gin, Chi)
- Python (FastAPI, Django)

**Database Support:**
- PostgreSQL, MongoDB, Redis
- Supabase (auth + DB)

---

### Mobile Team (7 agents)

**Planning (2):**
- requirement-analyst
- system-architect

**Implementation (3):**
- cross-platform-mobile (React Native, Flutter)
  OR
- android-engineer (native Android, Kotlin, Jetpack Compose)
- backend-engineer (API implementation)

**QA (2):**
- test-engineer (unit + E2E)
- verification-agent
- quality-validator

---

### Design Team (3-8 agents)

**Core (3):**
- ux-strategist
- design-system-architect
- visual-designer (or design-director)

**Extended (5):**
- ui-engineer
- css-specialist
- frontend-performance-specialist
- accessibility-specialist
- design-ocd-enforcer (precision validation)

**Use When:**
- Major redesign or rebrand
- New design system creation
- Design migration (Tailwind → global CSS)

---

## Parallel vs Sequential Execution

### Run in Parallel (Same Message)

✅ **Independent data sources** — Analysts working on different datasets
✅ **Different layers** — Backend + Frontend implementation
✅ **Different domains** — Unit tests + Integration tests + UI tests
✅ **Complementary analysis** — requirement-analyst + design-director

**Example:**
```javascript
// Data Analysis - All analysts in parallel
Task({ subagent_type: "general-purpose", prompt: "Follow merch-lifecycle-analyst.md..." })
Task({ subagent_type: "general-purpose", prompt: "Follow ads-creative-analyst.md..." })
Task({ subagent_type: "general-purpose", prompt: "Follow bf-sales-analyst.md..." })
```

---

### Run Sequentially (Separate Messages)

❌ **Direct dependencies** — system-architect needs requirement-analyst output
❌ **Build on prior work** — story-synthesizer needs all analyst data
❌ **Verification chains** — quality-validator needs verification-agent results
❌ **Progressive refinement** — design-reviewer after UI implementation

**Example:**
```javascript
// Group 1: Requirements (parallel)
Task({ subagent_type: "requirement-analyst", prompt: "..." })
Task({ subagent_type: "design-director", prompt: "..." })

// Wait for Group 1, then...

// Group 2: Architecture (sequential, needs requirements)
Task({ subagent_type: "system-architect", prompt: "..." })

// Wait for architecture, then...

// Group 3: Implementation (parallel)
Task({ subagent_type: "react-18-specialist", prompt: "..." })
```

---

## Quality Gates (Sequential Enforcement)

**Read:** `.orchestration/reference/quality-gates.md` for full details

```
┌────────────────────────────────────────────────────────────┐
│ GATE 0: Content Awareness (if content-heavy)               │
│ ├─ content-awareness-validator                             │
│ └─ Validates brand voice, audience, purpose alignment      │
└────────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────────┐
│ GATE 1: Verification                                       │
│ ├─ verification-agent                                      │
│ └─ Resolves all meta-tags, captures evidence               │
└────────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────────┐
│ GATE 2: Testing                                            │
│ ├─ test-engineer                                           │
│ └─ Unit + integration tests                                │
└────────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────────┐
│ GATE 3: UI Testing (if UI work)                            │
│ ├─ ui-testing-expert                                       │
│ └─ XCUITest (iOS) or E2E (web)                             │
└────────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────────┐
│ GATE 4: Design Review (if UI work)                         │
│ ├─ design-reviewer                                         │
│ └─ Visual verification via Playwright                      │
└────────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────────┐
│ GATE 5: Quality Validation                                 │
│ ├─ quality-validator                                       │
│ └─ Final production readiness check                        │
└────────────────────────────────────────────────────────────┘
```

**Enforcement:**
- Gates run in order (0 → 5)
- Session blocks if any gate fails
- GATE 0, 3, 4 conditional (content-heavy, UI work)
- GATE 1, 2, 5 always run

---

## Evidence Capture by Stack

### iOS Evidence

```bash
# Clean slate
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Clean build
xcodebuild clean && xcodebuild build

# Install to simulator
xcrun simctl install booted app.app

# Screenshot
xcrun simctl io booted screenshot .orchestration/evidence/$(date +%Y%m%d-%H%M%S)-ios.png
```

---

### Frontend Evidence

```bash
# Build
npm run build > .orchestration/evidence/build-output.txt

# Dev server
npm run dev &

# Screenshot (via MCP)
# Playwright or chrome-devtools MCP captures screenshot
# Saved to .orchestration/evidence/$(date +%Y%m%d-%H%M%S)-frontend.png
```

---

### Backend Evidence

```bash
# Run tests
npm test > .orchestration/evidence/test-output.txt

# Start server
npm run dev &

# Test endpoints
curl http://localhost:3000/api/health > .orchestration/evidence/api-test.txt
```

---

### Data Analysis Evidence

```bash
# Verify every number with grep
grep -A 5 "Total Sales" report.md > .orchestration/evidence/sales-verification.txt

# Check calculations
python -c "print(12 + 38)"  # = 50 ✓

# Verify data sources
grep "data/" report.md | sort -u > .orchestration/evidence/data-sources.txt
```

---

## File Location Policy

### Fixed Locations (Don't Ask User)

```
Evidence:
→ .orchestration/evidence/ (ALWAYS)

Temp files:
→ /tmp/orca-[sessionid]/ (ALWAYS)

Implementation code:
→ Where it belongs in project structure
  (components/, Sources/, api/, etc.)

Meta-cognitive logs:
→ .orchestration/implementation-log.md
```

### Ask User for Location

```
Reports, documentation, analysis files:
→ Ask user via interactive confirmation:
  "Where should these files be saved?"
  1. Project root (clean and visible)
  2. /tmp/ for review first
  3. Custom location (user specifies)
  4. Cancel - don't create
```

**Why:** User got tired of hunting through nested directories for misplaced files.

---

## Special Features

### Reference Capture (Phase 0)

**When to use:** User mentions "reference app/design" or "build like [X]"

**Workflow:**
1. Read `.orchestration/reference/reference-capture.md`
2. Capture screenshots of reference app/design BEFORE implementation
3. Get design agent analysis and checklist
4. Get user approval
5. Mid-implementation checkpoints for fidelity

**Purpose:** Prevent "build vague approximation" → ensures high-fidelity implementation

---

### Engineering Blueprint (Phase 0.5)

**When to use:** Multi-step, cross-domain work

**Workflow:**
1. Dispatch engineering-director agent (via Task)
2. Produces `.orchestration/engineering-blueprint.md`
3. Blueprint defines:
   - Which planning agents needed
   - Execution order
   - Integration points
   - Verification requirements

**Purpose:** High-level plan before dispatching specialists

---

### Content Detection (GATE 0)

**Run content-awareness-validator if request mentions:**
- "documentation" + ("polished", "professional", "internal use")
- "marketing" (materials, strategy, campaign)
- "UI copy", "microcopy", "content"
- "for [specific audience]"
- Content creation of any kind

**Skip GATE 0 for:**
- Pure backend/API work
- Database operations
- Infrastructure changes
- Bug fixes
- Code refactoring

---

## Usage Examples

### Example 1: iOS Weather App

```bash
/orca "Build iOS weather app with local caching"
```

**Execution:**
1. Detect: iOS (keywords + *.xcodeproj)
2. Team: 8 agents (requirement-analyst, system-architect, swiftui-developer, swiftdata-specialist, swift-testing-specialist, ui-testing-expert, verification-agent, quality-validator)
3. User confirms team
4. Dispatch with chaos rules
5. Build + screenshot evidence
6. Quality gates (1-5)
7. Cleanup, present results

---

### Example 2: BFCM Data Analysis

```bash
/orca "Analyze BFCM performance with product journeys, ads, and sales data"
```

**Execution:**
1. Detect: Data Analysis (keywords: BFCM, product journeys, ads, sales)
2. Team: 6 agents (merch-lifecycle-analyst, ads-creative-analyst, bf-sales-analyst, story-synthesizer, verification-agent, quality-validator)
3. User confirms team
4. Ask user where to save reports
5. Dispatch analysts in parallel (different data sources)
6. Wait for all data, then dispatch story-synthesizer
7. Verify every number with grep
8. Quality gates (1, 5)
9. Present results with evidence

---

### Example 3: Next.js Dashboard

```bash
/orca "Build analytics dashboard with charts and filters"
```

**Execution:**
1. Detect: Frontend (keywords + package.json)
2. Team: 7 agents (requirement-analyst, system-architect, nextjs-14-specialist, react-18-specialist, design-reviewer, verification-agent, quality-validator)
3. User confirms team
4. Dispatch in groups:
   - Group 1 (parallel): requirement-analyst
   - Group 2 (sequential): system-architect
   - Group 3 (parallel): nextjs-14-specialist, react-18-specialist
5. Build + screenshot evidence
6. Quality gates (1-5)
7. Cleanup, present results

---

## Troubleshooting

### "File limit reached" Error

```
Problem: Session blocked at 50 files
Solution:
1. Review .orchestration/implementation-log.md
2. Check for planning doc creation (should be banned)
3. Verify agents following 2-file-per-task rule
4. Clean up /tmp/orca-session/ if files stuck
```

---

### "Quality gate failed" Error

```
Problem: GATE X failed
Solution:
1. Read gate failure message
2. Fix issues reported by gate agent
3. Re-run verification
4. Gates run sequentially, fix in order
```

---

### Evidence Missing

```
Problem: .verified file not created by /finalize
Solution:
1. Check .orchestration/evidence/ exists
2. For UI work, verify at least one screenshot present
3. Run verification commands manually
4. Ensure all #SCREENSHOT_CLAIMED tags resolved
```

---

## Best Practices

### 1. Use ORCA for Complex, Multi-Domain Work

✓ iOS app with networking, persistence, UI
✓ Full-stack feature (frontend + backend + tests)
✓ Data analysis with multiple data sources
✓ Design system creation/migration

❌ Single-file bug fix (use /response-aware or direct edit)
❌ Simple UI tweak (use /design-director)
❌ Documentation update (direct edit)

---

### 2. Trust the Team Selection

✓ ORCA selects teams based on proven patterns
✓ User confirmation allows customization
✓ Teams are sized for the work (6-15 agents typical)

❌ Don't manually micro-manage agent selection
❌ Don't skip verification agents (they're required)

---

### 3. Monitor File Count

✓ Check .orchestration/implementation-log.md during execution
✓ Watch for warnings (10, 25 files)
✓ If approaching limit, review for planning docs

❌ Don't ignore file count warnings
❌ Don't create planning docs (banned)

---

### 4. Verify with Evidence

✓ Every claim backed by screenshot/test/build log
✓ Evidence in .orchestration/evidence/
✓ Verification before claiming "done"

❌ Don't skip verification phase
❌ Don't claim completion without evidence

---

## Summary

**ORCA provides:**
- Automatic tech stack detection
- Intelligent team selection
- User confirmation (always)
- Chaos prevention (file limits, standardized paths)
- Quality gates (0-5, enforced)
- Evidence capture (screenshots, tests, logs)
- Clean execution and cleanup

**Key Principles:**
1. Parallel planning, centralized decisions
2. Hard file limits (50 max)
3. Standardized paths (evidence, temp, logs)
4. Meta-tag tracking (#FILE_CREATED)
5. Quality gates enforced sequentially
6. Evidence required before "done"
7. Cleanup after completion

**Use when:** Complex, multi-domain work requiring multiple specialists and evidence-based verification.

---

_Last updated: 2025-11-14_
_Update after: Team definitions change, new quality gates, or chaos prevention updates_
