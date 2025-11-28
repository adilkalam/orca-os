# OS 2.4 Commands Quick Reference

**Last Updated:** 2025-11-27
**Version:** OS 2.4

## What's New in OS 2.4

**Major Changes:**
- ✅ **Three-tier routing** (default/tweak/complex) replaces simple/medium/complex
- ✅ **Default now runs gates** - light path includes quality checks
- ✅ **-tweak flag** for pure speed (skips gates, user verifies)
- ✅ **--complex flag** for full pipeline (requires spec)
- ✅ Unified `/plan` command (replaces 8+ requirements commands)
- ✅ New `/audit` command (meta-review with Response Awareness)
- ✅ Role boundary enforcement (orchestrators NEVER write code)
- ✅ Team confirmation via AskUserQuestion (interactive UI)
- ✅ State preservation across interruptions

**Deprecated Commands:**
- `/requirements-*` → Use `/plan`
- `/response-awareness-*` → Use `/plan` + `/orca-{domain}`

---

## Three-Tier Routing (OS 2.4)

All `/orca-*` commands support three execution modes:

| Mode | Flag | Path | Gates | Use Case |
|------|------|------|-------|----------|
| **Default** | (none) | Light + Gates | YES | Most work – fast with quality |
| **Tweak** | `-tweak` | Light (pure) | NO | Speed iteration, user verifies |
| **Complex** | `--complex` | Full pipeline | YES | Architecture, multi-file, specs |

### Examples

```bash
# Default: Light path WITH gates (most work)
/orca-nextjs "fix button spacing"
/orca-ios "add haptic feedback"

# Tweak: Light path WITHOUT gates (pure speed)
/orca-nextjs -tweak "try different padding"
/orca-ios -tweak "experiment with animation"

# Complex: Full pipeline WITH spec (architecture work)
/orca-nextjs --complex "implement auth flow"
/orca-ios --complex "implement offline sync"
```

### Gate Behavior by Mode

**Default Mode:**
- Light orchestrator handles execution
- Gates run after implementation (domain-specific)
- Scores must pass (≥90 for most)

**Tweak Mode:**
- Same light orchestrator
- Gates SKIPPED entirely
- User responsible for verification

**Complex Mode:**
- Full pipeline with grand-architect
- Spec REQUIRED (`.claude/requirements/<id>/06-requirements-spec.md`)
- All gates run with full verification

---

## Active Commands (OS 2.4)

### Planning Commands

#### `/plan` - Unified Requirements + RA Blueprint
**NEW in OS 2.2 - Replaces 8+ commands**

- **Purpose:** Complete requirements gathering + Response Awareness planning
- **Usage:** `/plan "feature description"`
- **What it does:**
  - 5 discovery questions (high-level, via AskUserQuestion)
  - Context analysis (ProjectContextServer query)
  - 5 detail questions (specific, via AskUserQuestion)
  - RA tagging (#PATH_DECISION, #COMPLETION_DRIVE, etc.)
  - Blueprint generation at `.claude/requirements/<id>/06-requirements-spec.md`
- **Never implements** - only plans
- **Location:** `~/.claude/commands/plan.md`

**Example:**
```bash
/plan "Add user profile editing with avatar upload"

# Creates:
.claude/requirements/2025-11-24-1430-user-profile-editing/06-requirements-spec.md

# Then implement:
/orca-nextjs "Implement requirement 2025-11-24-1430-user-profile-editing using that spec"
```

---

### Orchestration Commands

#### `/orca` - Pure Domain Router
- **Purpose:** Detect domain and delegate to specialized lane
- **Usage:** `/orca "task description"`
- **What it does:**
  - Detects domain (nextjs, ios, expo, data, seo)
  - Confirms team with user (AskUserQuestion)
  - Delegates to `/orca-{domain}`
- **Role:** NEVER writes code, only routes
- **Location:** `~/.claude/commands/orca.md`

#### `/orca-nextjs` - Next.js Lane Orchestrator
**UPDATED in OS 2.4 - Three-tier routing**

- **Purpose:** Next.js/React frontend implementation
- **Usage:**
  ```bash
  /orca-nextjs "fix button spacing"                    # Default: light + gates
  /orca-nextjs -tweak "try different padding"         # Tweak: light, no gates
  /orca-nextjs --complex "implement auth flow"        # Complex: full pipeline
  /orca-nextjs "implement requirement <id>"           # With spec
  ```
- **Three-Tier Routing:**
  - **Default** (no flag): Light orchestrator WITH gates (`nextjs-standards-enforcer` + `nextjs-design-reviewer`)
  - **-tweak**: Light orchestrator WITHOUT gates (user verifies)
  - **--complex**: Full pipeline with grand-architect, spec required
- **Team (Complex Mode):**
  - Grand Architect (Opus) - Architecture & coordination
  - Layout Analyzer - Structure analysis
  - Builder - Implementation
  - 6 Specialists (CSS, TypeScript, layout, performance, a11y, + Tailwind if detected)
  - 2 Gates (standards ≥90, design QA ≥90)
  - Verification Agent (build/test/lint)
- **Role Boundaries:** ENFORCED (orchestrator never codes)
- **State Preservation:** YES (survives interruptions)
- **Location:** `~/.claude/commands/orca-nextjs.md`

#### `/orca-ios` - iOS Lane Orchestrator
**UPDATED in OS 2.4 - Three-tier routing**

- **Purpose:** Native iOS (Swift/SwiftUI/UIKit) implementation
- **Usage:**
  ```bash
  /orca-ios "fix button padding"                       # Default: light + gates
  /orca-ios -tweak "experiment with animation"        # Tweak: light, no gates
  /orca-ios --complex "implement auth flow"           # Complex: full pipeline
  /orca-ios "implement requirement <id>"              # With spec
  ```
- **Three-Tier Routing:**
  - **Default** (no flag): Light orchestrator WITH gates (`ios-standards-enforcer` + `ios-ui-reviewer`)
  - **-tweak**: Light orchestrator WITHOUT gates (user verifies)
  - **--complex**: Full pipeline with grand-architect, spec required
- **Team (Complex Mode):**
  - Grand Architect (Opus) - Architecture planning
  - Architect - Implementation planning
  - Builder - Implementation
  - 8 Specialists (SwiftUI, UIKit, persistence, networking, testing, performance, security, a11y)
  - 2 Gates (standards ≥90, UI review ≥90)
  - Verification Agent (xcodebuild/tests)
- **Role Boundaries:** ENFORCED (orchestrator never codes)
- **State Preservation:** YES (survives interruptions)
- **Location:** `~/.claude/commands/orca-ios.md`

#### `/orca-expo` - Expo/React Native Lane Orchestrator
**UPDATED in OS 2.4 - Three-tier routing**

- **Purpose:** Expo/React Native mobile implementation
- **Usage:**
  ```bash
  /orca-expo "fix button spacing"                      # Default: light + gates
  /orca-expo -tweak "try different padding"           # Tweak: light, no gates
  /orca-expo --complex "implement auth flow"          # Complex: full pipeline
  /orca-expo "implement requirement <id>"             # With spec
  ```
- **Three-Tier Routing:**
  - **Default** (no flag): Light orchestrator WITH gates (`design-token-guardian` + `expo-aesthetics-specialist`)
  - **-tweak**: Light orchestrator WITHOUT gates (user verifies)
  - **--complex**: Full pipeline with grand-orchestrator, spec required
- **Team (Complex Mode):**
  - Grand Orchestrator (Opus) - For complex/high-risk work
  - Architect - Planning
  - Builder - Implementation
  - Design Token Guardian - Token enforcement
  - A11y Enforcer - Accessibility checks
  - Performance Enforcer - Bundle/performance budgets
  - Security Specialist - Security checks
  - Verification Agent (build/test/expo doctor)
- **Role Boundaries:** ENFORCED (orchestrator never codes)
- **State Preservation:** YES (survives interruptions)
- **Location:** `~/.claude/commands/orca-expo.md`

#### `/orca-data` - Data/Analytics Lane Orchestrator
**UPDATED in OS 2.2 - Role boundaries enforced**

- **Purpose:** Data analysis and insights
- **Usage:** `/orca-data "implement requirement <id> using spec"`
- **Team:**
  - Data Researcher - Discovery
  - Python Analytics Expert - Python-based analysis
  - Competitive Analyst - Market/competitor analysis
  - Research Specialist - Deep research
- **Gates:** Data quality, verification, narrative coherence
- **Role Boundaries:** ENFORCED (orchestrator never codes)
- **Location:** `~/.claude/commands/orca-data.md`

---

### Meta-Audit Command

#### `/audit` - Response-Aware Behavior Review
**NEW in OS 2.2**

- **Purpose:** Meta-review of recent agent behavior
- **Usage:** `/audit "last 10 tasks"` or `/audit "recent iOS work"`
- **What it does:**
  - Loads recent task history from phase_state.json
  - Applies Response Awareness lens (#PATH_DECISION, #COMPLETION_DRIVE, etc.)
  - Identifies patterns (scope creep, skipped steps, misused context)
  - Creates standards from failures (via mcp__project-context__save_standard)
  - Records learnings (via mcp__project-context__save_task_history)
- **Output:** `.claude/orchestration/evidence/audit-<timestamp>.md`
- **Location:** `~/.claude/commands/audit.md`

**Example:**
```bash
/audit "last 10 tasks"

# Analyzes:
- Which gates were bypassed
- Where scope crept
- What assumptions were made
- What patterns failed

# Creates:
- New standards from failures
- Learnings for future tasks
```

---

### Utility Commands

#### `/enhance` - Prompt Enhancement
- **Purpose:** Transform vague requests into well-structured prompts
- **Usage:** `/enhance "make the UI better"`
- **Features:** Claude 4 best practices, clarify-only mode with `-clarify`
- **Location:** `~/.claude/commands/enhance.md`

#### `/ultra-think` - Deep Analysis
- **Purpose:** Multi-dimensional problem analysis
- **Usage:** `/ultra-think "complex problem"`
- **Location:** `~/.claude/commands/ultra-think.md`

#### `/session-save` / `/session-resume`
- **Purpose:** Manual session context management
- **Usage:** `/session-save` then later `/session-resume`
- **Location:** `~/.claude/commands/session-*.md`

#### `/design-dna` - Design System Management
- **Purpose:** Initialize/update project design system
- **Usage:**
  - `/design-dna init` - First-time setup
  - `/design-dna audit` - Check current state
  - `/design-dna generate "spacing"` - Generate tokens
- **Location:** `~/.claude/commands/design-dna.md`

#### `/seo` - SEO Content Pipeline
- **Purpose:** SEO research → brief → draft → quality review
- **Usage:** `/seo "<keyword or topic>"`
- **Location:** `~/.claude/commands/seo.md`

#### `/clone-website` - Website Cloning
- **Purpose:** Clone website UI into OS 2.2 project structure
- **Usage:** `/clone-website <url>`
- **Location:** `~/.claude/commands/clone-website.md`

---

## Deprecated Commands (Backward Compatible)

**Use `/plan` instead:**
- `/requirements-start` - Start requirements gathering
- `/requirements-status` - Continue requirements
- `/requirements-end` - Finalize requirements
- `/requirements-current` - View active requirement
- `/requirements-list` - List all requirements
- `/requirements-remind` - Remind of requirements rules

**Use `/plan` + `/orca-{domain}` instead:**
- `/response-awareness-plan` - RA planning
- `/response-awareness-implement` - RA implementation

**Note:** These commands still work but redirect to the new workflow.

---

## OS 2.4 Workflow Patterns

### Quick Tasks (Most Work)

```bash
# Default mode: Light path WITH quality gates
/orca-nextjs "fix button spacing"
/orca-ios "add haptic feedback"
/orca-expo "update card styling"
/orca-shopify "fix cart drawer"
```

### Rapid Iteration (-tweak)

```bash
# Tweak mode: Light path WITHOUT gates (you verify)
/orca-nextjs -tweak "try different padding"
/orca-ios -tweak "experiment with animation"
```

### Full Features (--complex or /plan)

```bash
# Complex work: Plan first, then full pipeline
/plan "implement user authentication"
/orca-nextjs --complex "implement requirement <id>"

# Or explicitly request complex mode
/orca-ios --complex "implement offline sync"
```

### Meta-Audit (Periodic)

```bash
/audit "last 10 tasks"
# Creates standards from failures, learnings for future
```

### Workflow Summary

```
✅ Quick fix      → /orca-{domain} "task"              → light + gates
✅ Exploration    → /orca-{domain} -tweak "task"       → light, no gates
✅ Features       → /plan → /orca-{domain} --complex   → full pipeline
✅ Review         → /audit "scope"                      → meta-analysis
```

### Old Workflow (Deprecated)
```
❌ /requirements-start → /requirements-status → /response-awareness-implement
```

---

## Command Architecture

### Role Boundaries (NEW in OS 2.2)

**Orchestrators:**
- NEVER write code
- ONLY coordinate agents via Task tool
- Read phase_state.json to track progress
- Survive interruptions (questions, pauses, clarifications)

**Agents:**
- Specialized workers
- Write code, run tests, analyze
- Report back to orchestrator
- Never orchestrate themselves

**Enforcement:**
Every orca command includes:
```markdown
## 🚨 CRITICAL ROLE BOUNDARY 🚨

YOU ARE AN ORCHESTRATOR. YOU NEVER WRITE CODE.

If you find yourself about to use Edit/Write tools: STOP. You've broken role.
```

### Team Confirmation (NEW in OS 2.2)

Before any pipeline executes:
1. Orchestrator detects domain
2. Proposes agent team
3. Uses AskUserQuestion tool (interactive UI)
4. Waits for user confirmation/adjustment
5. Proceeds with approved team

**Benefits:**
- No surprise agent teams
- User controls scope
- Clear expectations

### State Preservation (NEW in OS 2.2)

Orchestrators maintain state across interruptions:
- Read `phase_state.json` after user input
- "DO NOT ABANDON THE PIPELINE" directive
- Resume at correct phase
- Delegate to appropriate agent

**Survives:**
- User questions
- Clarifications
- Test result reviews
- Pauses

### Phase Structure

```yaml
phase_1_context:
  agent: project-context-server
  mandatory: true

phase_2_team_confirmation:
  tool: AskUserQuestion
  mandatory: true

phase_3_planning:
  agent: grand-architect
  context_required: true

phase_4_implementation:
  agent: builder
  dependencies: [phase_3]

phase_5_gates:
  agents: [standards-enforcer, design-reviewer]
  gates:
    - standards: 90
    - design_qa: 90

phase_6_verification:
  agent: verification-agent
  evidence_required: true
```

### Context Integration

All OS 2.2 commands MUST:
1. Query ProjectContextServer first (mandatory)
2. Pass context to agents
3. Maintain context through phases
4. Update vibe.db with learnings
5. Read phase_state.json for resumption

### Quality Gates

Commands enforce:
- **Standards:** Minimum score 90/100
- **Design QA:** Minimum score 90/100 (UI work)
- **Accessibility:** Minimum score 90/100 (UI work)
- **Performance:** Budget compliance (mobile work)
- **Build/Test:** Must pass (all domains)

---

## Command Patterns

### Domain Detection
```
/orca "build a React component"  → /orca-nextjs
/orca "create iOS view"          → /orca-ios
/orca "add Expo navigation"      → /orca-expo
/orca "analyze user metrics"     → /orca-data
/orca "write about AI safety"    → /seo
```

### Phase Execution
```
START → Context Query → Team Confirm → Planning → Implementation → Gates → Verify → OUTPUT
```

### Error Handling
- Context failures → Block execution
- Agent failures → Retry with context
- Quality failures → Iterate or escalate
- Orchestrator role violations → Stop and delegate

---

## Configuration

### Command Locations
- **Global commands:** `~/.claude/commands/`
- **Project commands:** `<project>/.claude/commands/` (project-specific overrides)

### Phase Configs Location
`~/.claude/docs/reference/phase-configs/`
- `nextjs-phase-config.yaml`
- `ios-phase-config.yaml`
- `expo-phase-config.yaml`
- `data-phases.yaml`
- `seo-phase-config.yaml`

### Pipeline Specifications
`~/.claude/docs/pipelines/`
- `nextjs-pipeline.md`
- `ios-pipeline.md`
- `expo-pipeline.md`
- `data-pipeline.md`
- `design-pipeline.md`
- `seo-pipeline.md`

### Global Settings
- `~/.claude.json` - MCP server registration
- `~/.claude/settings.json` - Command settings
- `<project>/CLAUDE.md` - Project-specific instructions

---

## Examples

### Full Feature Implementation
```bash
# 1. Plan
/plan "Add dark mode support with user preference persistence"

# Output: .claude/requirements/2025-11-24-1500-dark-mode-support/06-requirements-spec.md

# 2. Implement
/orca-nextjs "Implement requirement 2025-11-24-1500-dark-mode-support using that spec"

# Executes:
- Context query
- Team confirmation (nextjs-grand-architect, nextjs-builder, etc.)
- Planning phase
- Implementation phase
- Standards gate (≥90)
- Design QA gate (≥90)
- Build verification
- Evidence capture

# 3. Later: Audit
/audit "last 5 tasks"

# Analyzes recent behavior, creates standards from failures
```

### Quick Task (No Planning)
```bash
# For trivial tasks, skip /plan
/orca-nextjs "Fix typo in homepage title"
```

### Domain-Specific
```bash
# iOS
/plan "Add biometric authentication"
/orca-ios "Implement requirement <id>"

# Expo
/plan "Add offline mode to mobile app"
/orca-expo "Implement requirement <id>"

# Data
/plan "Analyze Q4 sales trends"
/orca-data "Implement requirement <id>"
```

---

## Troubleshooting

### Orchestrator Started Coding Directly
**Problem:** Orchestrator used Edit/Write tools instead of delegating.
**Fix:** OS 2.4 role boundaries should prevent this. If it happens:
1. Check phase_state.json
2. Remind orchestrator of role
3. Report as bug (shouldn't happen in 2.1)

### Agent Team Not Confirmed
**Problem:** Pipeline started without team confirmation.
**Fix:** OS 2.4 mandates AskUserQuestion before execution. Should not skip.

### State Lost After Interruption
**Problem:** Orchestrator forgot what phase it was in.
**Fix:** OS 2.4 state preservation should prevent this:
1. Check phase_state.json exists
2. Orchestrator should read it automatically

### Quality Gate Failed
**Problem:** Standards gate score 85 (need ≥90).
**Fix:** Orchestrator delegates to standards-enforcer to fix issues, then re-runs gate.

---

_This reference covers OS 2.4 commands with three-tier routing. Legacy v1 commands archived. OS 2.2 commands deprecated but backward compatible._
