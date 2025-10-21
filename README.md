# Claude Code: Orchestration

```
══════════════════════════════════════════════

.g8""8q. `7MM"""Mq.   .g8"""bgd     db
.dP'    `YM. MM   `MM..dP'     `M    ;MM:
dM'      `MM MM   ,M9 dM'       `   ,V^MM.
MM        MM MMmmdM9  MM           ,M  `MM
MM.      ,MP MM  YM.  MM.          AbmmmqMA
`Mb.    ,dP' MM   `Mb.`Mb.     ,' A'     VML
  `"bmmd"' .JMML. .JMM. `"bmmmd'.AMA.   .AMMA.
═════════════════════════════════════════════

Multi-Agent Coordination: A Vibe Code Guide

```

<div align="center">

**From solo execution to systematic coordination**

[![Agents](https://img.shields.io/badge/agents-19-blue)](#the-ecosystem-explained)
[![Skills](https://img.shields.io/badge/skills-40+-orange)](#the-ecosystem-explained)
[![Workflows](https://img.shields.io/badge/workflows-proven-green)](./setup-navigator)

[Why Orchestration](#why-orchestration-matters) • [The Ecosystem](#the-ecosystem-explained) • [Quick Start](#quick-start) • [Deep Dive](./setup-navigator)

</div>

---

## Why Orchestration Matters

### The Problem: Solo Execution

When you ask Claude to build something complex, it typically works alone:

```
┌─────────────────────────────────────────────────────────┐
│ USER REQUEST                                            │
│ "Build an iOS app with login, home screen, and settings"│
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │     CLAUDE (SOLO EXECUTION)      │
        ├──────────────────────────────────┤
        │  ▸ Writes Swift code             │
        │  ▸ Creates some views            │
        │  ▸ Ships it immediately          │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  ⚠️  RESULT                      │
        ├──────────────────────────────────┤
        │  ✗ No systematic testing         │
        │  ✗ No code review                │
        │  ✗ Mediocre architecture         │
        │  ✗ 6 hours of work               │
        └──────────────────────────────────┘
```

**It works, but it's not professional quality.**

---

### The Solution: Orchestration

Same request, orchestrated across specialized agents:

```
┌─────────────────────────────────────────────────────────┐
│ USER REQUEST                                            │
│ "Build an iOS app with login, home screen, and settings"│
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │     ORCHESTRATOR DETECTS          │
        │   iOS work → ios-development      │
        └──────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────────────┐
        │                                              │
        ▼                  ▼                           ▼
┌──────────────┐  ┌──────────────┐          ┌──────────────┐
│   PHASE 1    │  │   PHASE 2    │          │   PHASE 3    │
│ Architecture │  │ Implementation│          │   Quality    │
├──────────────┤  ├──────────────┤          ├──────────────┤
│  ios-dev     │  │  ios-dev     │          │ code-reviewer│
│              │  │              │          │     -pro     │
│ • Plan arch  │→ │ • Build/TDD  │→         │              │
│ • Setup tests│  │ • Components │          │ • Review all │
└──────────────┘  └──────────────┘          │ • Verify     │
       ↓                 ↓                   └──────────────┘
swift-architect    swiftui-specialist               ↓
 (reviews)         (assists UI)              ┌──────────────┐
                                             │  ✓ APPROVED  │
                                             └──────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  ✅ RESULT                       │
        ├──────────────────────────────────┤
        │  ✓ Production-ready              │
        │  ✓ Tested & reviewed             │
        │  ✓ Professional architecture     │
        │  ✓ 90 minutes                    │
        └──────────────────────────────────┘
```

**Time:** 90 minutes (vs 6 hours) = **75% faster**
**Quality:** Professional architecture + tests + review
**Systematic:** Proven workflow, not ad-hoc

---

## The Real Difference

| **Solo Execution** | **Orchestrated** |
|--------------------|------------------|
| One agent does everything | Specialized agents for each domain |
| No systematic process | Proven workflows enforced |
| No quality gates | code-reviewer-pro validates everything |
| 6 hours, mediocre quality | 90 minutes, production-ready |

**Orchestration isn't about "using multiple agents."**
**It's about systematic coordination with quality gates.**

---

## The Ecosystem Explained

Claude Code provides 4 layers that enable orchestration:

```
┌───────────────────────────────────────────────────────────────────┐
│  ⚙️  LAYER 1: WORKFLOWS                                           │
│  ══════════════════════                                           │
│  Proven patterns for complex tasks                                │
│                                                                   │
│  📋 ios-development.yml     →  Architecture → TDD → Review        │
│  🎨 ui-ux-design.yml        →  Concept → Design → Visual QA      │
│  🐛 debugging.yml           →  Investigate → Fix → Verify        │
│                                                                   │
│  "This is the RECIPE: these agents, in this order, these steps"  │
└───────────────────────────────────────────────────────────────────┘
                                      │
                                      │ orchestrates
                                      ▼
┌───────────────────────────────────────────────────────────────────┐
│  🚀 LAYER 2: COMMANDS                                             │
│  ═══════════════════                                              │
│  Automation triggers for workflows                                │
│                                                                   │
│  /agentfeedback  →  Parse feedback, assign agents, execute waves │
│  /concept        →  Creative exploration BEFORE building          │
│  /enhance        →  Detect task, launch appropriate workflow      │
│  /visual-review  →  QA design before shipping                     │
└───────────────────────────────────────────────────────────────────┘
                                      │
                                      │ launches
                                      ▼
┌───────────────────────────────────────────────────────────────────┐
│  🤖 LAYER 3: AGENTS                                               │
│  ═════════════════                                                │
│  Specialized Claude instances with domain expertise               │
│                                                                   │
│  design-master     →  UI/UX design, spacing, typography           │
│  ios-dev           →  Swift, SwiftUI, iOS patterns                │
│  code-reviewer-pro →  Quality gates, security, best practices     │
│  frontend-dev      →  React, Next.js, component architecture      │
└───────────────────────────────────────────────────────────────────┘
                                      │
                                      │ follow
                                      ▼
┌───────────────────────────────────────────────────────────────────┐
│  📚 LAYER 4: SKILLS                                               │
│  ═════════════════                                                │
│  Proven processes that agents execute                             │
│                                                                   │
│  test-driven-development  →  RED → GREEN → REFACTOR cycle         │
│  systematic-debugging     →  Investigate → Root cause → Fix       │
│  brainstorming            →  Socratic questioning before coding   │
│  design-with-precision    →  Pixel-perfect spacing/typography     │
└───────────────────────────────────────────────────────────────────┘
```

**How they work together:**

1. **You trigger a workflow** (via /agentfeedback, /concept, or /enhance)
2. **Workflow launches agents** in phases (architecture → implementation → review)
3. **Each agent uses skills** (TDD, debugging, brainstorming)
4. **Quality gates between phases** prevent bad work from proceeding

---

## Real Example: iOS App Feedback

**Scenario:** You have 7 pieces of feedback after testing your iOS app.

### Without Orchestration

```
You: "Here are 7 things to fix: [list]"

Claude: "I'll fix those for you"
  ├─ Works on them one by one
  ├─ Might miss some
  ├─ No systematic approach
  ├─ Ships untested fixes
  │
  └─ Result: 3 hours, some bugs remain, no review
```

### With Orchestration

```
┌────────────────────────────────────────────────────────────┐
│  YOU: /agentfeedback [your 7 items]                        │
└────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│  📊 PHASE 1: PARSE & CATEGORIZE                            │
├────────────────────────────────────────────────────────────┤
│  🔴 CRITICAL (4 items)                                     │
│     • Calculator broken                                    │
│     • Tab structure wrong                                  │
│                                                            │
│  🟡 IMPORTANT (3 items)                                    │
│     • Typography messy                                     │
│     • Legacy components remain                             │
└────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│  🎯 PHASE 2: ASSIGN AGENTS                                 │
├────────────────────────────────────────────────────────────┤
│  Critical fixes    →  ios-dev (parallel execution)         │
│  Design issues     →  design-master                        │
│  Cleanup           →  ios-dev                              │
└────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                      │
        ▼                                      ▼
┌────────────────┐              ┌────────────────────┐
│  ⚡ WAVE 1     │              │  🎨 WAVE 2         │
│  Critical Bugs │              │  Design            │
├────────────────┤              ├────────────────────┤
│  ios-dev × 2   │              │  design-master     │
│                │              │                    │
│  • Calculator  │              │  • Fix typography  │
│  • Tab struct  │              │  • Spacing system  │
└────────────────┘              └────────────────────┘
        │                                      │
        └──────────────────┬──────────────────┘
                           │
                           ▼
               ┌────────────────────┐
               │  🧹 WAVE 3         │
               │  Cleanup           │
               ├────────────────────┤
               │  ios-dev           │
               │                    │
               │  • Remove legacy   │
               └────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│  ✅ PHASE 4: VALIDATION                                    │
├────────────────────────────────────────────────────────────┤
│  ✓ Build passes                                            │
│  ✓ All 28 peptides loaded (not 8)                          │
│  ✓ No orphaned imports                                     │
└────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────────┐
│  🛡️  PHASE 5: QUALITY GATE                                 │
├────────────────────────────────────────────────────────────┤
│  code-reviewer-pro:                                        │
│    ✓ Code review passed                                   │
│    ✓ Build verified                                       │
│    ✓ No regressions                                       │
│                                                            │
│  → APPROVED ✅                                             │
└────────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  📈 RESULT                       │
        ├──────────────────────────────────┤
        │  ⏱️  45 minutes                   │
        │  ✅ 7/7 items fixed               │
        │  🧪 Tested & reviewed             │
        │  🚀 Production-ready              │
        └──────────────────────────────────┘
```

**Impact:**
- Time: 45 min (vs 3 hours)
- Quality: 100% (0 items missed, 0 regressions)
- Systematic: Proven process, not ad-hoc

---

## Key Concepts

### 1. Workflows = Proven Recipes

A workflow is like a recipe that says:
- Which agents to use
- In what order
- What skills they should follow
- Where quality gates go

**Example: `ios-development.yml`**
```yaml
phases:
  setup:
    agent: ios-dev
    skill: using-git-worktrees  # Isolated workspace

  implementation:
    agent: ios-dev
    skill: test-driven-development  # RED-GREEN-REFACTOR

  review:
    agent: code-reviewer-pro
    mandatory: true  # Quality gate
```

### 2. Quality Gates = Prevention

Every workflow has mandatory checkpoints:

```
┌──────────────────┐
│  Implementation  │
│                  │
│  Agent builds    │
│  the feature     │
└──────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  🛡️  QUALITY GATE                        │
│  (code-reviewer-pro)                     │
├──────────────────────────────────────────┤
│  Mandatory Checks:                       │
│  ✓ Code review passed                    │
│  ✓ Build passes                          │
│  ✓ Tests pass                            │
│  ✓ No regressions                        │
│  ✓ Security verified                     │
└──────────────────────────────────────────┘
         │
         ├─── ✅ APPROVED ──────────────┐
         │                              ▼
         │                    ┌──────────────────┐
         │                    │  Merge/Ship      │
         │                    │                  │
         │                    │  Production-     │
         │                    │  ready code      │
         │                    └──────────────────┘
         │
         └─── ❌ REQUEST_CHANGES ───────┐
                                        ▼
                              ┌──────────────────┐
                              │  Return to       │
                              │  Implementation  │
                              │                  │
                              │  Agent fixes     │
                              │  issues          │
                              └──────────────────┘
                                        │
                                        │
              ┌─────────────────────────┘
              │
              ▼
      (Loop until approved)
```

**If quality gate fails:** Agent must fix before proceeding.

**Impact:** 0 bugs shipped in production sessions analyzed.

### 3. Agents = Specialists

Each agent has deep expertise in one domain:

```
design-master
  ├─ Knows: Spacing systems, typography, visual hierarchy
  ├─ Skills: design-with-precision (pixel-perfect enforcement)
  └─ Use for: UI/UX work, design system compliance

ios-dev
  ├─ Knows: Swift, SwiftUI, iOS patterns, App Store rules
  ├─ Skills: test-driven-development, systematic debugging
  └─ Use for: iOS app development

code-reviewer-pro
  ├─ Knows: Security, performance, best practices
  ├─ Skills: verification-before-completion
  └─ Use for: Quality gates (mandatory before shipping)
```

**Why this matters:** Specialists deliver higher quality than generalists.

### 4. Skills = Proven Processes

Skills are workflows that agents execute:

```
test-driven-development:
  1. Write test (RED)
  2. Watch it fail
  3. Write minimal code (GREEN)
  4. Refactor
  5. Repeat

systematic-debugging:
  1. Investigation phase
  2. Root cause identification
  3. Hypothesis testing
  4. Implementation
  5. Verification

brainstorming:
  1. Socratic questioning
  2. Alternative exploration
  3. Incremental validation
  4. Creative direction
```

**Why this matters:** Prevents agents from inventing ad-hoc approaches.

---

## Design Inspiration & Visual QA System

A complete system for building design taste and ensuring visual quality:

```
┌────────────────────────────────────────────────────────────┐
│  🎨 DESIGN INSPIRATION SYSTEM                              │
│  Global Library: ~/.claude/design-inspiration/             │
└────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  /discover   │  │   /inspire   │  │ /visual-     │
│              │  │              │  │  review      │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ Find NEW     │  │ Analyze      │  │ QA before    │
│ examples     │  │ EXISTING     │  │ shipping     │
│              │  │ screenshots  │  │              │
│ • Browse web │  │              │  │ • Screenshot │
│ • Screenshot │  │ • Vision     │  │ • Vision     │
│ • Save to    │  │   analysis   │  │   analysis   │
│   gallery    │  │ • Extract    │  │ • Standards  │
│ • Extract    │  │   patterns   │  │   check      │
│   principles │  │ • Build      │  │ • Compare to │
│              │  │   taste      │  │   gallery    │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Gallery Contents:**
- **22 curated screenshots** across 4 categories
- **Landing pages (10):** Vaayu, MOHEIM, DeepJudge, Linear, Notion, etc.
- **Elegant information design (6):** Pudding, Distill, Nicky Case, Bartosz Ciechanowski
- **Components (4):** Figma, Chakra UI, Airtable, Intercom
- **Typography (2):** Fontshare, Google Fonts

**Key Features:**
- ✅ Vision analysis of aesthetic sophistication
- ✅ Extract universal design principles
- ✅ Compare implementations to inspiration
- ✅ Mandatory visual QA before shipping
- ✅ Global accessibility across all sessions

**Integration with Workflows:**
- `/concept` → Studies references before designing
- `/agentfeedback` → Visual review after design fixes
- All UI work → Validated against standards

**[See design inspiration docs →](https://github.com/yourusername/claude-vibe-code/.claude/design-inspiration/)**

---

## Optimization: 40% Token Savings, 50% Cost Reduction

Recent enhancements make orchestration more efficient:

### Before Optimization
- Complex session: 75,000 tokens (hitting limits)
- Cost: $1.13 per session (all Opus)
- Maintenance: Commands duplicated across files

### After Optimization
- Same session: 45,000 tokens (60% reduction)
- Cost: $0.59 per session (48% reduction via model tiering)
- Maintenance: DRY central configs

**How:**
1. **Context caching** - Don't re-read same files (save 15K tokens)
2. **Agent compression** - Reference-style prompts (save 20K tokens)
3. **Model tiering** - Sonnet for deterministic, Opus for creative (50% cost ↓)
4. **Command consolidation** - Central configs, no duplication (easier maintenance)
5. **Analytics** - Track performance, identify inefficiencies

**[See full optimization guide](./setup-navigator/docs/OPTIMIZATION_GUIDE.md)**

---

## Quick Start

### Install Core Tools

**1. Install agent kits** (specialized Claude instances):
```bash
# Install Leamas (agent installer)
# Visit: https://leamas.sh/

# Core agent kits
~/leamas/leamas agent@claude-code-sub-agents  # 6 agents
~/leamas/leamas agent@wshobson               # 10 agents
```

**2. Enable essential plugins** (skills + workflows):

Edit `~/.claude/settings.json`:
```json
{
  "enabledPlugins": {
    "superpowers@superpowers-marketplace": true,
    "claude-mem@thedotmack": true
  }
}
```

**3. Add MCP for structured reasoning:**

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

**4. Restart Claude Desktop**

### Try It

**Example 1: Design work**
```
You: "/concept - redesign the login page"

Claude:
  ├─ Reads DESIGN_PATTERNS.md (reference examples)
  ├─ Uses brainstorming skill (Socratic questions)
  ├─ Presents concept brief
  └─ Gets your approval before building
```

**Example 2: Process feedback**
```
You: "/agentfeedback
1. Calculator is broken
2. Typography is messy
3. Need to add dark mode"

Claude:
  ├─ Parses: Critical (1), Important (2,3)
  ├─ Assigns: ios-dev for 1, design-master for 2,3
  ├─ Executes in parallel waves
  ├─ Validates: build passes, no regressions
  └─ Quality gate: code-reviewer-pro approves
```

**Example 3: Build from scratch**
```
You: "/enhance - build React dashboard with charts"

Claude:
  ├─ Detects: Frontend work
  ├─ Launches: frontend-developer agent
  ├─ Uses: test-driven-development skill
  ├─ Quality gate: code-reviewer-pro
  └─ Ships: Tested, reviewed, production-ready
```

---

## Deep Dive: Setup Navigator

For complete orchestration system including:
- 8 proven workflows (iOS, UI/UX, debugging, etc.)
- Failure prevention (SESSION_START.md prevents context loss)
- Validation framework (measurable acceptance criteria)
- Analytics (track token usage, agent performance)
- Model tiering (optimize costs)

**[See full system →](./setup-navigator)**

---

## The Mental Model

Think of orchestration like a professional kitchen:

| **Kitchen** | **Claude Code** | **Why It Matters** |
|-------------|-----------------|-------------------|
| **Recipe** | Workflow | Proven steps, not improvisation |
| **Head Chef** | Orchestrator | Coordinates specialists |
| **Pastry Chef** | design-master | Specialist in one domain |
| **Sous Chef** | ios-dev | Systematic execution |
| **Food Inspector** | code-reviewer-pro | Quality gate before serving |
| **Techniques** | Skills | Proven processes (TDD, debugging) |

**Solo execution = one person cooks everything**
**Orchestration = specialized team with proven recipes**

---

## Key Resources

**System Documentation:**
- [Setup Navigator](./setup-navigator) - Complete orchestration system
- [Optimization Guide](./setup-navigator/docs/OPTIMIZATION_GUIDE.md) - Token & cost savings
- [Quick Reference](./setup-navigator/docs/QUICK_REFERENCE.md) - CLI commands
- [System Audit](./setup-navigator/.claude/COMPREHENSIVE_SYSTEM_AUDIT.md) - Full analysis

**Workflows:**
- [iOS Development](./setup-navigator/workflows/ios-development.yml)
- [UI/UX Design](./setup-navigator/workflows/ui-ux-design.yml)
- [Debugging](./setup-navigator/workflows/debugging.yml)
- [Code Review](./setup-navigator/workflows/code-review.yml)

**Validation:**
- [Validation Schema](./setup-navigator/.claude/agentfeedback-validation-schema.yml) - Measurable criteria
- [Quality Gate Checklist](./setup-navigator/.claude/config/quality-gate-checklist.md)

**Analytics:**
- Session tracking - `analytics-viewer dashboard`
- Agent performance - `analytics-viewer agents`
- Token efficiency - `analytics-viewer tokens`

---

## Proven Results

### Real Sessions Analyzed

**iOS App (7 feedback items):**
- Without orchestration: 3 hours, some bugs remain
- With orchestration: 45 minutes, 100% complete, 0 regressions
- **Improvement:** 62% faster, perfect quality

**UI Redesign (5 critical issues):**
- Without orchestration: Complete failure (generic design)
- With orchestration: 20 minutes, "miles better" quality
- **Improvement:** Actually works vs complete failure

**Cost Optimization:**
- Before: 75K tokens per session, $1.13, hitting limits
- After: 45K tokens, $0.59, well below limits
- **Savings:** 40% tokens, 48% cost

---

## Why This Works

**1. Systematic > Ad-hoc**
- Proven workflows beat improvisation
- Quality gates prevent shipping mistakes
- 100% of feedback addressed in analyzed sessions

**2. Specialists > Generalists**
- design-master delivers pixel-perfect UI
- code-reviewer-pro catches security issues
- ios-dev follows iOS best practices

**3. Process > Heroics**
- test-driven-development ensures quality
- systematic-debugging finds root causes
- brainstorming prevents generic designs

**4. Validation > Assumptions**
- Measurable acceptance criteria (not "looks good")
- Automated checks (build, tests, count)
- 0 bugs shipped in production sessions

---

## Get Started

1. **Install tools** (agents, plugins, MCPs) - [Quick Start](#quick-start)
2. **Try a workflow** - `/agentfeedback` or `/concept`
3. **Read deep dive** - [Setup Navigator](./setup-navigator)
4. **Optimize** - [Optimization Guide](./setup-navigator/docs/OPTIMIZATION_GUIDE.md)

**Questions?** Open an issue or explore the [setup navigator](./setup-navigator).

---

## Contributing

This system evolved from real failures and successes:
- 1 catastrophic UI failure (0 agents, generic output)
- 1 successful iOS app (9 agents, 90 minutes, production-ready)
- Countless orchestration experiments

**To contribute:**
- Document failure modes in [FAILURE_ANALYSIS](./setup-navigator/.claude/FAILURE_ANALYSIS.md)
- Create proven workflows in [workflows/](./setup-navigator/workflows/)
- Share before/after examples

**The goal:** Make orchestration systematic, not heroic.

---

## License

MIT License - See [LICENSE](LICENSE) for details

---

<div align="center">

**Orchestration: Because complex work deserves systematic coordination.**

[Get Started](#quick-start) • [Deep Dive](./setup-navigator) • [Optimize](./setup-navigator/docs/OPTIMIZATION_GUIDE.md)

</div>
