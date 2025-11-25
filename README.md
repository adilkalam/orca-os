```
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓███████▓▒░░▒▓████████▓▒░       ░▒▓██████▓▒░ ░▒▓███████▓▒░      ░▒▓███████▓▒░       ░▒▓████████▓▒░
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░             ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░                    ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░
 ░▒▓█▓▒▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░             ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░                    ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░
 ░▒▓█▓▒▒▓█▓▒░░▒▓█▓▒░▒▓███████▓▒░░▒▓██████▓▒░        ░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░        ░▒▓██████▓▒░       ░▒▓█▓▒░░▒▓█▓▒░
  ░▒▓█▓▓█▓▒░ ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░             ░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░             ░▒▓█▓▒░░▒▓█▓▒░
  ░▒▓█▓▓█▓▒░ ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░             ░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓██▓▒░▒▓█▓▒░░▒▓█▓▒░
   ░▒▓██▓▒░  ░▒▓█▓▒░▒▓███████▓▒░░▒▓████████▓▒░       ░▒▓██████▓▒░░▒▓███████▓▒░       ░▒▓████████▓▒░▒▓██▓▒░▒▓████████▓▒░
```

# OS 2.2: Context-Aware, Memory-Persistent Orchestration for Claude Code

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   Vibe Coding with High Quality Results and Outputs            │
│                                                                │
│   • Context & Memory-First Architecture                        │
│   • Introspective Response Awareness                           │
│   • Evidence-Based Completion with Quality Gates               │
│   • Multi-Agent Orchestration (Role Boundaries Enforced)       │
│   • Domain-Specific Pipelines with Phase Management            │
│   • Continuous Improvement via Meta-Audit                      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Version:** 2.2 (November 2024)
**New in 2.2:** Simplified memory architecture (Workshop + vibe.db), unified planning (`/plan`), meta-audit (`/audit`), strict role boundaries, team confirmation, state preservation across interruptions

---

## What Is This?

**Vibe OS 2.2** is a disciplined orchestration system for Claude Code that fixes the fundamental problems of generic AI assistants:

- ❌ **Memory loss** → ✅ Persistent knowledge graph (decisions, standards, failures)
- ❌ **Context thrashing** → ✅ Intelligent context bundles (ProjectContext MCP)
- ❌ **False completion** → ✅ Evidence-based verification (meta-tags + proof)
- ❌ **Scope drift** → ✅ Role boundaries + quality gates (≥90 scores to pass)
- ❌ **Agent amnesia** → ✅ State preservation (phase_state.json + session continuity)

**The core innovation:** Orchestrators NEVER write code. They only coordinate specialized agents via the Task tool, making role boundaries explicit and preventing the system from "taking over" during interruptions.

---

## The Problem This Solves

**Claude Code is extremely powerful but has the memory of a goldfish and breaks orchestration easily.**

**Generic AI assistants:**
- Start from zero every session
- Say "done" when code doesn't compile
- Forget constraints mid-task
- Hallucinate design systems
- Abandon orchestration when you ask a question

**OS 2.2 enforces discipline:**
- Projects are indexed with **persistent context** (vectors + semantic search)
- **Pure orchestration layer** (only coordinates, never codes)
- **Role boundaries** explicitly enforced (orchestrators vs specialists)
- **Memory persists** across sessions (Workshop knowledge graph)
- **Quality gates** catch issues before humans see them (standards ≥90, design QA ≥90, a11y, performance)
- **State preservation** maintains orchestration across interruptions
- Work isn't "done" until there's **evidence** (tests, builds, screenshots, logs)

---

## System Architecture: OS 2.2

```
┌─────────────────────────────────────────────────────────────────┐
│                         VIBE CODE OS 2.2                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Commands   │      │   Agents     │      │     MCPs     │  │
│  │  (/plan,     │◄────►│ (Specialized │◄────►│ (ProjectCtx, │  │
│  │   /orca-*,   │      │  Workers)    │      │  SharedCtx,  │  │
│  │   /audit)    │      │              │      │  Workshop)   │  │
│  └──────┬───────┘      └──────┬───────┘      └──────┬───────┘  │
│         │                     │                     │          │
│         └─────────────┬───────┴─────────────────────┘          │
│                       │                                        │
│                       ▼                                        │
│         ┌─────────────────────────────┐                        │
│         │   Orchestration Layer       │                        │
│         │  • Domain routing           │                        │
│         │  • Agent coordination       │                        │
│         │  • Role boundary enforce    │                        │
│         │  • Gate enforcement         │                        │
│         │  • State management         │                        │
│         └─────────────────────────────┘                        │
│                       │                                        │
│                       ▼                                        │
│         ┌─────────────────────────────┐                        │
│         │   Memory & Context Layer    │                        │
│         │  • ProjectContext (bundles) │                        │
│         │  • SharedContext (sessions) │                        │
│         │  • Workshop (knowledge)     │                        │
│         │  • Design DNA (standards)   │                        │
│         └─────────────────────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## New in OS 2.2 (November 2024)

### 1. Unified Planning Command
**Old (OS 2.0):**
```bash
/requirements-start → /requirements-status → /response-awareness-plan
```

**New (OS 2.2):**
```bash
/plan "feature description"
```

- **Combines** requirements gathering + Response Awareness into ONE command
- **Produces** blueprint-quality spec at `requirements/<id>/06-requirements-spec.md`
- **Uses** AskUserQuestion tool for interactive Q&A (no more scrolling hell)
- **Never implements** - only plans

### 2. Meta-Audit Command
```bash
/audit "last 10 tasks"
```

- **Analyzes** recent agent behavior using Response Awareness lens
- **Creates** standards from failures
- **Enables** continuous improvement loop
- **Records** learnings to ProjectContext

### 3. Role Boundary Enforcement

**Every orca command now has:**
```markdown
## 🚨 CRITICAL ROLE BOUNDARY 🚨

YOU ARE AN ORCHESTRATOR. YOU NEVER WRITE CODE.

If you find yourself about to use Edit/Write tools: STOP. You've broken role.
Your only job: coordinate agents via Task tool. That's it.
```

**Fixes the problem:** When you interrupt with a question, Claude no longer abandons orchestration and starts coding directly.

### 4. State Preservation & Session Continuity

**Every orca command includes:**
- Instructions to read `phase_state.json` after interruptions
- "DO NOT ABANDON THE PIPELINE" directive
- Phase-specific resumption guide
- Anti-pattern detection with examples

**Result:** Orchestration survives across:
- User questions
- Clarifications
- Test results
- Pauses for review

### 5. Team Confirmation (AskUserQuestion)

**Before activating any pipeline:**
```typescript
AskUserQuestion({
  questions: [{
    question: "I detect this as a [domain] task. Proposed agents: [list]. Proceed?",
    options: [
      {label: "Proceed as planned", description: "..."},
      {label: "Adjust domain", description: "..."},
      {label: "Modify agents", description: "..."}
    ]
  }]
})
```

**Benefits:**
- No surprise agent teams
- User controls scope
- Interactive UI (no text-based Q&A)

---

## Request Flow: OS 2.2 Workflow

```
User Request
    ↓
┌────────────────────────────────────────────────────────────┐
│ PHASE 1: PLANNING (/plan)                                 │
│ • Requirements gathering (5 discovery + 5 detail Q&A)     │
│ • Response Awareness tagging (#PATH_DECISION, etc.)       │
│ • Blueprint generation (06-requirements-spec.md)          │
│ • Context query (ProjectContextServer - MANDATORY)        │
└────────────────────────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────────────────────────┐
│ PHASE 2: ORCHESTRATION (/orca-nextjs|ios|expo|data)      │
│ • Context query (MANDATORY - loads relevant files)        │
│ • Team confirmation (AskUserQuestion)                     │
│ • Grand Architect (Opus - architecture & planning)        │
│ • Agent delegation (Sonnet specialists)                   │
│ • Gate enforcement (standards ≥90, design QA ≥90, etc.)   │
│ • State tracking (phase_state.json)                       │
└────────────────────────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────────────────────────┐
│ PHASE 3: META-AUDIT (/audit)                             │
│ • Behavior analysis across recent tasks                   │
│ • Standard creation from failures                         │
│ • Continuous improvement                                  │
└────────────────────────────────────────────────────────────┘
```

---

## Domain Pipelines: Specialized Workflows

OS 2.2 includes **6 mature domain pipelines:**

### iOS Pipeline
- **Grand Architect** (Opus) - Architecture planning
- **Architect** (Sonnet) - Implementation planning
- **Builder** (Sonnet) - Implementation
- **8 Specialists** - SwiftUI, UIKit, persistence, networking, testing, performance, security, accessibility
- **4 Gates** - Architecture, standards ≥90, UI/interaction ≥90, build/test
- **Verification Agent** - Build/test evidence

### Next.js Pipeline
- **Grand Architect** (Opus) - Coordination & architecture
- **Architect** (Sonnet) - Planning
- **Layout Analyzer** (Sonnet) - Structure analysis
- **Builder** (Sonnet) - Implementation
- **5 Specialists** - TypeScript, Tailwind, layout, performance, accessibility
- **4 Gates** - Customization (design-dna), standards ≥90, design QA ≥90, build
- **Verification Agent** - Build/test/lint

### Expo Pipeline
- **Grand Orchestrator** (Opus) - For complex/high-risk work
- **Architect** (Sonnet) - Planning
- **Builder** (Sonnet) - Implementation
- **5 Gates** - Design tokens, a11y, aesthetics (soft), performance budgets, security
- **Verification Agent** - Build/test/expo doctor

### Data Pipeline
- **Researcher** - Discovery
- **4 Analysts** - Parallel analysis by specialization
- **3 Gates** - Data quality, verification, narrative coherence

### Design Pipeline
- **Design System Architect** - Token/component design
- **1 Gate** - Design QA review

### SEO Pipeline
- **Research Specialist** - SERP intelligence
- **Brief Strategist** - Content briefs
- **Draft Writer** - Long-form SEO content
- **Quality Guardian** - Compliance & clarity

**Total:** 50+ active agents across 6 domains

---

## Command Reference

### Active Commands (OS 2.2)

**Planning:**
- `/plan` - Unified requirements + RA blueprint (replaces 8+ commands)

**Orchestration:**
- `/orca` - Pure router (detects domain, delegates to lane)
- `/orca-nextjs` - Next.js lane orchestrator
- `/orca-ios` - iOS lane orchestrator
- `/orca-expo` - Expo/React Native lane orchestrator
- `/orca-data` - Data/analytics lane orchestrator

**Meta-Audit:**
- `/audit` - Response-aware behavior review

**Utilities:**
- `/enhance` - Transform vague requests into well-structured prompts
- `/ultra-think` - Deep multi-dimensional analysis
- `/session-save` / `/session-resume` - Manual session context control
- `/design-dna` - Initialize/update project design system
- `/seo` - SEO content pipeline
- `/clone-website` - Clone website UI into OS 2.2 project

### Deprecated (Backward Compatible)
- `/requirements-{start,status,end,current,list,remind}` → Use `/plan`
- `/response-awareness-{plan,implement}` → Use `/plan` + `/orca-{domain}`

---

## Memory & Context: Three-Layer System

### 1. ProjectContext MCP (Intelligent Context Bundles)

**What it does:**
- Returns relevant files for any task (semantic search via vectors)
- Provides project structure, decisions, standards, task history
- Prevents "let me read your entire codebase" waste

**Usage:**
```typescript
mcp__project-context__query_context({
  domain: "nextjs",
  task: "Add dark mode",
  projectPath: "/path/to/project",
  maxFiles: 10,
  includeHistory: true
})
```

**Returns:**
- Relevant files (semantically matched)
- Past decisions (from Workshop)
- Standards (learned rules)
- Similar tasks (history)
- Dependencies (what's connected)

### 2. SharedContext MCP (Cross-Session State)

**What it does:**
- Maintains context across sessions
- Compression (40-50% token reduction)
- Differential updates (only send changes)
- Versioned context

**Usage:**
```typescript
mcp__shared-context__get_shared_context({projectId: "/path"})
mcp__shared-context__update_shared_context({projectId: "/path", context: {...}})
```

### 3. Workshop Memory (Knowledge Graph)

**What it does:**
- Stores decisions, gotchas, goals, antipatterns
- Queryable via semantic (vectors) and keyword (FTS5) search
- Persists in `.claude/memory/workshop.db`

**Usage:**
```bash
workshop decision "Use Supabase for auth" -r "Team expertise + cost"
workshop gotcha "iOS Simulator needs Xcode 15.4+" -t ios -t xcode
workshop why "auth approach"
workshop search "CSS patterns"
```

---

## Quality Gates: Enforcement

All pipelines include numerical quality gates:

```
┌────────────────────────────────────────────────────────────────┐
│  QUALITY GATES (Numerical Scores, ≥90 to Pass)                │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Standards Gate (standards-enforcer)                           │
│  ✓ Design token usage (no magic numbers)                      │
│  ✓ No inline styles                                           │
│  ✓ Code quality (types, linting, formatting)                  │
│  ✓ Score: 0-100 (≥90 to pass)                                 │
│                                                                │
│  Design QA Gate (design-reviewer)                             │
│  ✓ Grid compliance (4px/8px/16px/24px/32px)                   │
│  ✓ Token-based styling                                        │
│  ✓ Interaction states (hover, focus, active, disabled)        │
│  ✓ Score: 0-100 (≥90 to pass)                                 │
│                                                                │
│  Accessibility Gate (a11y-enforcer)                           │
│  ✓ ARIA labels, semantic HTML                                 │
│  ✓ Keyboard navigation                                        │
│  ✓ Color contrast (WCAG AA)                                   │
│  ✓ Score: 0-100 (≥90 to pass)                                 │
│                                                                │
│  Performance Gate (performance-enforcer)                       │
│  ✓ Bundle size budgets                                        │
│  ✓ No heavy imports                                           │
│  ✓ Render performance                                         │
│  ✓ Score: 0-100 (≥90 to pass)                                 │
│                                                                │
│  Build/Test Gate (verification-agent)                         │
│  ✓ npm run build (success)                                    │
│  ✓ Tests pass                                                 │
│  ✓ No console errors                                          │
│  ✓ Evidence captured (logs, screenshots)                      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Usage Examples

### Full Implementation Workflow
```bash
# 1. Plan the work (creates requirements/<id>/06-requirements-spec.md)
/plan "Add user profile editing"

# 2. Implement via domain orchestrator
/orca-nextjs "Implement requirement <id> using that spec"

# 3. Later: Audit behavior
/audit "last 10 tasks"
```

### iOS Feature Implementation
```bash
/plan "Add biometric authentication"
/orca-ios "Implement requirement <id> using spec"
```

### Data Analysis
```bash
/plan "Analyze Q4 sales performance"
/orca-data "Implement requirement <id> using spec"
```

### Design System Updates
```bash
/design-dna init              # First-time setup
/design-dna audit            # Check current state
/design-dna generate "spacing"  # Generate new tokens
```

---

## File Organization

```
project-root/
├── .claude/
│   ├── memory/
│   │   └── workshop.db              ← Per-project knowledge graph
│   ├── orchestration/
│   │   ├── evidence/                ← FINAL artifacts (screenshots, reports)
│   │   ├── temp/                    ← Working files (DELETE after session)
│   │   ├── playbooks/               ← Reference patterns
│   │   └── reference/               ← Key docs
│   ├── project/
│   │   └── phase_state.json         ← Current pipeline state
│   └── hooks/
│       └── session-start.sh         ← Auto-loads context
│
├── requirements/                     ← Planning artifacts (/plan)
│   ├── .current-requirement
│   ├── index.md
│   └── YYYY-MM-DD-HHMM-slug/
│       ├── 00-initial-request.md
│       ├── 01-discovery-questions.md
│       ├── 02-discovery-answers.md
│       ├── 03-context-findings.md
│       ├── 04-detail-questions.md
│       ├── 05-detail-answers.md
│       └── 06-requirements-spec.md   ← Blueprint for /orca-*
│
├── CLAUDE.md                         ← Project-specific instructions
└── (source code...)

~/.claude/ (Global OS)
├── commands/                         ← Live slash commands
│   ├── plan.md
│   ├── audit.md
│   ├── orca.md
│   ├── orca-nextjs.md
│   ├── orca-ios.md
│   ├── orca-expo.md
│   └── ...
├── agents/                           ← Custom agent definitions
│   ├── iOS/
│   ├── nextjs/
│   ├── expo/
│   └── ...
├── mcp/
│   ├── project-context/              ← Context bundling
│   ├── shared-context/               ← Session state
│   └── vibe-memory/                  ← Workshop integration
└── CLAUDE.md                         ← Global instructions
```

---

## Getting Started

### 1. Install Prerequisites
```bash
# Workshop CLI (memory system)
cargo install workshop-cli

# Install Claude Code
# Follow: https://docs.anthropic.com/claude-code
```

### 2. Initialize Project
```bash
cd your-project

# Initialize Workshop memory
workshop init
mkdir -p .claude/memory
mv .workshop/workshop.db .claude/memory/workshop.db

# Create orchestration structure
mkdir -p .claude/orchestration/{evidence,temp,playbooks,reference}
mkdir -p .claude/project

# Create project instructions
cat > CLAUDE.md << 'EOF'
# Project: Your Project Name

## Stack
- Next.js 14 (App Router)
- Tailwind CSS
- shadcn/ui components

## Design System
See `.claude/design-dna/tokens.json`

## Standards
- Use design tokens exclusively
- No inline styles
- All spacing from 4px grid
EOF
```

### 3. Configure MCPs

Add to `~/.claude.json`:
```json
{
  "mcpServers": {
    "project-context": {
      "command": "node",
      "args": ["/path/to/.claude/mcp/project-context/dist/index.js"]
    },
    "shared-context": {
      "command": "node",
      "args": ["/path/to/.claude/mcp/shared-context/dist/index.js"]
    },
    "vibe-memory": {
      "command": "python3",
      "args": ["/path/to/.claude/mcp/vibe-memory/memory_server.py"],
      "env": {"PYTHONUNBUFFERED": "1"}
    }
  }
}
```

### 4. Index Your Project
```bash
# In Claude Code session:
mcp__project-context__index_project()
```

### 5. Start Using OS 2.2
```bash
# Plan work
/plan "Add dark mode support"

# Implement
/orca-nextjs "Implement requirement <id> using spec"

# Audit behavior
/audit "last 5 tasks"
```

---

## Documentation Structure

```
/
├── README.md                        ← You are here (OS 2.2 overview)
├── quick-reference/
│   ├── commands.md                  ← Command reference
│   ├── agents.md                    ← Agent teams
│   ├── os2-pipelines.md             ← Domain pipelines
│   └── memory.md                    ← Memory system
├── docs/
│   ├── pipelines/                   ← Pipeline specifications
│   │   ├── nextjs-pipeline.md
│   │   ├── ios-pipeline.md
│   │   ├── expo-pipeline.md
│   │   └── data-pipeline.md
│   ├── reference/                   ← Reference docs
│   │   ├── response-awareness.md
│   │   ├── quality-gates.md
│   │   └── phase-configs/
│   ├── architecture/                ← Architecture docs
│   └── memory/                      ← Memory system docs
├── commands/                        ← Slash command definitions
├── agents/                          ← Agent definitions
├── mcp/                             ← Custom MCP servers
└── scripts/                         ← Helper scripts
```

---

## Philosophy: Why This Exists

**Generic AI assistants are helpful but undisciplined.** They drift from requirements, hallucinate constraints, say "done" when reality disagrees, and abandon orchestration when interrupted.

**OS 2.2 treats Claude Code as a disciplined operating system:**
- **Commands** are system calls (orchestrators with role boundaries)
- **Agents** are processes (constrained, observable, specialized)
- **MCPs** are I/O interfaces (structured, permission-bounded)
- **Memory** is persistent state (queryable knowledge graph)
- **Verification** is syscall validation (evidence required)
- **State** is preserved across interruptions (phase_state.json)

**The result:** A disciplined, evidence-driven development system that produces reliable outputs, learns from failures, and maintains orchestration across the entire task lifecycle.

---

## Design Principles

### 1. Context-First Architecture
Every operation starts with ProjectContextServer query. No more "let me read your codebase."

### 2. Role Boundaries Are Sacred
Orchestrators coordinate. Specialists implement. Never both.

### 3. Evidence-Based Completion
Work is "done" when evidence exists: tests pass, builds succeed, screenshots captured.

### 4. State Preservation
Orchestration persists across interruptions. User questions don't reset roles.

### 5. Quality Gates Are Mandatory
Standards ≥90, design QA ≥90, tests pass. No exceptions.

### 6. Memory Is Ground Truth
Decisions live in Workshop, not ephemeral chat. Design DNA is versioned.

### 7. Calculate, Don't Guess
Spacing, typography, layout follow mathematical systems. No arbitrary values.

---

## What's Next?

**OS 2.2 focuses on:**
- ✅ Unified planning workflow
- ✅ Meta-audit for continuous improvement
- ✅ Role boundary enforcement
- ✅ State preservation across interruptions
- ✅ Team confirmation before execution

**Future directions:**
- Advanced parallel planning strategies
- Cross-domain handoff improvements
- Enhanced meta-learning from audits
- Tighter integration with external design tools

---

## Contributing

This is a personal framework that evolved through real-world usage. The patterns are generalizable:

- **Share agent definitions** that worked for you
- **Document failures** (antipatterns matter)
- **Contribute to MCPs** (project-context, shared-context, vibe-memory)
- **Refine pipelines** with your domain expertise

---

## License

MIT

---

**Build right first. Verify with evidence. Learn from memory. Maintain orchestration.**
