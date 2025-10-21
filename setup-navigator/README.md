# Claude Code Orchestration System

> From confusion to clarity: A complete system for multi-agent coordination, proven workflows, and catastrophic failure prevention.

**If you find agents, skills, MCPs, commands, and plugins overwhelming - you're not alone. This is the system that finally made it all click.**

---

## 🤔 The Confusion (Where We Started)

When you first open Claude Code, you're hit with:

- **Agents** - "Use design-master for UI work!"
- **Skills** - "Try the brainstorming skill!"
- **Subagents** - "Launch a subagent for code review!"
- **MCPs** - "Install this MCP server!"
- **Commands** - "Run /concept first!"
- **Plugins** - "Add this plugin for SEO!"

**Wait... what's the difference between an agent and a subagent? When do I use a skill vs a command? What even is an MCP?**

It's overwhelming. You end up either:
1. Asking Claude to "just do it" (solo execution, mediocre results)
2. Trying to orchestrate manually (cognitive overload, forgetting steps)
3. Reading docs for hours (still confused about when to use what)

**This system is the answer.** It came from real failures, real successes, and figuring out what actually matters.

---

## 📚 Let's Clarify: What Is Everything?

### The Claude Code Ecosystem

Think of it like a professional kitchen:

| **Claude Code Thing** | **Kitchen Analogy** | **What It Actually Is** |
|----------------------|---------------------|-------------------------|
| **Agent** | Specialist chef (pastry chef, sushi chef) | AI assistant with specific expertise (design-master, ios-dev, python-pro) |
| **Subagent** | Calling in a consultant chef mid-service | Launching another agent from within your conversation to handle a specific subtask |
| **Skill** | Recipe/technique (sous vide, knife skills) | Documented process/workflow that agents follow (brainstorming, test-driven-development) |
| **Command** | Kitchen order ticket (/fire, /plate, /expo) | Custom slash command that triggers specific workflows (/concept, /clarify, /enhance) |
| **MCP** | Specialized equipment (pasta extruder, smoker) | Tool that gives Claude new capabilities (file access, API integration) |
| **Plugin** | Recipe book collection | Pre-packaged set of agents/skills for specific domains (SEO, superpowers) |

**Still abstract? Here's a real example:**

```
You: "Build me an iOS app"

Without orchestration:
→ Claude writes some Swift code
→ Probably misses architecture patterns
→ No testing, no review
→ Works but isn't professional

With orchestration:
→ /enhance detects iOS work
→ Launches ios-dev agent (specialist)
→ ios-dev uses test-driven-development skill (proven process)
→ Launches swift-architect subagent (consultant for architecture)
→ Uses ios-simulator MCP (testing tool)
→ Launches code-reviewer-pro subagent (quality gate)
→ Professional, tested, production-ready code
```

**The difference? Orchestration.**

---

## 🎯 The Three Core Problems This System Solves

### Problem 1: "I Don't Know When to Use What"

**Before:**
- 29 agents. Which one for UI work? Design-master? Frontend-developer? React-pro? UI-designer?
- 40+ skills. Do I need brainstorming or systematic-debugging?
- 12 commands. Should I use /concept or /enhance?

**After (This System):**
- **Workflows** document proven patterns: "For iOS work, use these agents in this order"
- **Navigation** shows what to DO, not just what exists
- **Commands enforce process**: /enhance auto-detects design work → redirects to /concept

### Problem 2: "Sessions Lose Context and Produce Garbage"

**The Catastrophic Failure:**

```
Session 1: "Rebuild injury protocol page"
→ You brainstorm approach
→ Reference anti-aging page as inspiration
→ Plan multi-agent execution
→ Session runs out of context

Session 2: (Continuation)
→ Agent forgets everything
→ Invokes ZERO agents
→ Produces generic, unusable page
→ Complete failure
```

**This happened. Twice.**

**After (This System):**
- **SESSION_START.md** - Mandatory checklist for continuations
- **Failure prevention** catches context loss before work begins
- **Documented patterns** prevent "starting from scratch" amnesia

### Problem 3: "Solo Execution When Multi-Agent Would Excel"

**Example:**

iOS app development:
- ❌ One agent doing everything (6 hours, mediocre architecture)
- ✅ **9 agents orchestrated** (90 minutes, production-ready)

**The difference?** Knowing that complex work needs coordination, not heroics.

---

## 🏗️ The System Architecture

```
claude-vibe-code/
├── workflows/                      # Proven orchestration patterns
│   ├── ios-development.yml         # 9 agents, 5 phases, tested in production
│   ├── ui-ux-design.yml           # Concept → Design → Implement → Review
│   ├── debugging-workflow.yml     # Systematic investigation → fix
│   └── ... (8 workflows total)
│
├── .claude/
│   ├── SESSION_START.md           # Checklist to prevent context loss
│   ├── FAILURE_ANALYSIS.md        # Complete documentation of what went wrong
│   └── PROJECT_RULES_TEMPLATE.md  # Per-project agent requirements
│
├── cli/
│   ├── show-workflow.js           # Display workflow details
│   └── render-nav.js              # Action-oriented navigation
│
└── ~/.claude/commands/             # Process-enforcing commands
    ├── concept.md                 # Creative exploration phase (design work)
    ├── clarify.md                 # Quick questions without hijacking
    ├── agentfeedback.md           # Systematic feedback processing
    └── enhance.md                 # Enhanced with design detection
```

---

## 🚀 Quick Start

### Installation

```bash
cd ~/claude-vibe-code/setup-navigator
npm install
npm link
```

### Your First Orchestration

**1. See what's available:**
```bash
/nav
```

Shows workflows, agents, skills organized by action (not alphabetically).

**2. View a proven workflow:**
```bash
workflow show ui-ux-design
```

See phases, agents, skills, and actions for UI work.

**3. Start a design project the right way:**
```bash
/concept
```

Forces creative exploration before implementation (prevents generic designs).

---

## 📖 The Walkthrough: From Confusion to Orchestration

### Act 1: Understanding the Pieces

#### What's an Agent?

An **agent** is Claude with specialized knowledge and instructions.

**Example:**
- **design-master**: Expert in pixel-perfect UI, spacing systems, typography
- **ios-dev**: Knows Swift, SwiftUI, iOS patterns, App Store requirements
- **python-pro**: Python expert with knowledge of decorators, async/await, testing

**Think of it like:** Calling a specialist instead of a generalist.

**When to use:** When work requires deep expertise in a specific domain.

#### What's a Subagent?

A **subagent** is launching another specialist mid-conversation.

**Example:**
```
You're working with ios-dev building an app.
ios-dev needs architecture review.
ios-dev launches swift-architect subagent.
swift-architect reviews architecture, returns recommendations.
ios-dev continues with improvements.
```

**Think of it like:** Consultant brought in for specific expertise, then leaves.

**When to use:** Current agent needs specialized help but you don't want to switch contexts.

#### What's a Skill?

A **skill** is a documented process that agents follow.

**Example:**
- **test-driven-development**: Write test first, watch it fail, write code to pass
- **brainstorming**: Socratic exploration before coding
- **systematic-debugging**: Investigation → root cause → fix → verify

**Think of it like:** A recipe or protocol that ensures quality.

**When to use:** You want agents to follow proven processes, not invent approaches.

#### What's a Command?

A **command** is a custom workflow you trigger with `/commandname`.

**Example:**
- `/concept`: Creative exploration phase for design work
- `/clarify`: Quick question without hijacking workflow
- `/agentfeedback`: Process feedback systematically

**Think of it like:** Ordering from a menu instead of explaining what you want.

**When to use:** You want consistent, reliable processes triggered easily.

#### What's an MCP?

An **MCP** (Model Context Protocol) gives Claude new capabilities.

**Example:**
- **ios-simulator**: Control iOS simulator from Claude
- **filesystem**: Read/write files
- **postgres**: Query databases

**Think of it like:** Adding a new tool to the kitchen (pasta maker, smoker, etc.).

**When to use:** Claude needs to interact with systems beyond conversation.

#### What's a Plugin?

A **plugin** is a pre-packaged collection of agents, skills, and commands.

**Example:**
- **superpowers**: Collection of development skills (TDD, debugging, git workflows)
- **seo-specialist**: SEO agents and tools

**Think of it like:** Installing a cookbook collection (French cuisine, Italian cuisine).

**When to use:** You need coordinated expertise in a specific domain.

---

### Act 2: Why Orchestration Matters

#### Solo Execution (The Default)

```
You: "Build an iOS app with login, home screen, and profile"

Claude (solo):
1. Writes Swift code
2. Creates some views
3. Probably works
4. Might miss architecture patterns
5. No systematic testing
6. No code review
7. Ships it

Result: Works, but not professional quality.
```

#### Orchestrated Execution (This System)

```
You: "Build an iOS app with login, home screen, and profile"

System detects iOS work → uses ios-development workflow:

Phase 1: Setup & Architecture
  → ios-dev: Create worktree, plan architecture
  → swift-architect (subagent): Review architecture
  → Using git-worktrees skill

Phase 2: Core Implementation
  → ios-dev: Implement features with TDD
  → swiftui-specialist (subagent): Build UI components
  → Using test-driven-development skill

Phase 3: Testing
  → ios-dev: Integration testing
  → Using ios-simulator MCP

Phase 4: Polish & Review
  → code-reviewer-pro (subagent): Quality gate
  → ios-dev: Address feedback

Result: Production-ready, tested, reviewed, professional.
Time: 90 minutes vs 6 hours solo.
```

**The difference: Specialization + Process + Quality Gates**

---

### Act 3: Real-World Example - The Injury Protocol Failure

**This actually happened. It's why this system exists.**

#### Attempt 1: Generic Disaster

```
Session 1:
You: "Rebuild injury protocol page like the anti-aging page"
Claude: *brainstorms approach, references anti-aging timeline pattern*
You: "Perfect, do it"
*Session runs out of context*

Session 2 (Continuation):
Claude: *forgets everything*
Claude: *invokes ZERO agents*
Claude: *builds generic page with massive bento grid dominating timeline*
You: "This is completely wrong. The timeline should be the hero like anti-aging."

Result: Complete failure. Had to start over.
```

**What went wrong:**
1. Session continuation lost original instructions
2. No reference to anti-aging pattern studied in Session 1
3. Zero agent orchestration
4. Generic implementation without concept phase

#### Attempt 2: With Prevention System

```
Session 1:
You: "Rebuild injury protocol page"

System: /enhance detects design work → redirects to /concept

/concept:
  1. Reads DESIGN_PATTERNS.md
  2. Finds anti-aging protocol pattern
  3. Studies: "Timeline as hero, compact cards, progressive disclosure"
  4. Brainstorms approach maintaining these principles
  5. Presents concept brief
You: "Approve"

Session runs out of context.

Session 2 (Continuation):
System: SESSION_START.md checklist
  ✓ Original request: Rebuild injury protocol page
  ✓ Reference: Anti-aging protocol (timeline as hero)
  ✓ Concept: Timeline-first, compact cards
  ✓ Agents: design-master → frontend-developer → code-reviewer-pro

Claude: *builds with timeline as hero, references anti-aging pattern*

Result: "Miles and miles better - gave me something to work with"
```

**What changed:**
1. `/concept` forced reference pattern study
2. SESSION_START.md prevented context loss
3. Design patterns documented and referenced
4. Agent orchestration maintained across sessions

---

## 🔄 The 8 Proven Workflows

### 1. iOS Development
**Use when:** Building iOS apps with Swift/SwiftUI

**Phases:**
1. Setup & Architecture → ios-dev + swift-architect
2. Core Implementation → ios-dev + swiftui-specialist (TDD)
3. Testing → ios-dev + ios-simulator MCP
4. Polish & Review → code-reviewer-pro

**Real result:** 90-minute production-ready app

---

### 2. UI/UX Design
**Use when:** Building or redesigning user interfaces

**Phases:**
1. Concept & Discovery → /concept (study references, brainstorm)
2. Design System → design-master (spacing, typography, colors)
3. Implementation → frontend-developer + react-pro
4. Review & Iteration → /agentfeedback
5. Quality Assurance → code-reviewer-pro

**Prevents:** Generic designs, bento grid disasters

---

### 3. Debugging Workflow
**Use when:** Fixing bugs or unexpected behavior

**Phases:**
1. Investigation → debugger (systematic-debugging skill)
2. Root Cause → root-cause-tracing skill
3. Fix → Language-specific agent
4. Verification → verification-before-completion skill

**Prevents:** Guess-and-check debugging

---

### 4. Code Review & Refactoring
**Use when:** Reviewing code or improving existing code

**Phases:**
1. Initial Review → code-reviewer-pro
2. Refactoring → Language-specific agent
3. Testing → test-driven-development skill
4. Final Review → code-reviewer-pro again

**Ensures:** Quality gates before merging

---

### 5. Feature Development
**Use when:** Adding new features to existing projects

**Phases:**
1. Design → /concept or brainstorming
2. Implementation → Specialized agents in parallel
3. Integration → Senior agent coordinates
4. Review → code-reviewer-pro

---

### 6. Database & Backend
**Use when:** Building APIs, databases, backend services

**Agents:** python-pro, data-scientist, backend specialists
**Skills:** test-driven-development, systematic-debugging

---

### 7. Content & SEO
**Use when:** Creating content, optimizing for search

**Agents:** seo-specialist agents (content-writer, keyword-strategist, etc.)
**Skills:** SEO-specific optimization patterns

---

### 8. Full-Stack Project
**Use when:** Building complete applications

**Combines multiple workflows:**
- Database setup
- Backend API
- Frontend UI
- Testing & deployment

---

## 🛡️ Failure Prevention System

### The Core Problem

**Session continuations lose context.**

When Claude Code restarts mid-project:
- Original instructions forgotten
- Reference patterns lost
- Orchestration plans abandoned
- Results: Generic, solo execution

### The Solution: SESSION_START.md

**Mandatory checklist for ANY continuation session:**

```markdown
⚠️ CONTINUATION SESSION - STOP AND READ

Before doing ANY work:

1. [ ] What was the ORIGINAL user request?
2. [ ] What design/implementation decisions were made?
3. [ ] What orchestration pattern was planned?
4. [ ] Which agents were assigned to which tasks?
5. [ ] Are there reference implementations to study?
6. [ ] What concept/brainstorming was done previously?

IF ANY ANSWER IS UNCLEAR:
→ Ask user for original instructions
→ Read previous session context
→ Review DESIGN_PATTERNS.md for references

NEVER start coding in a continuation without this context.
```

### PROJECT_RULES.md Template

**Per-project enforcement:**

```markdown
# Project Agent Requirements

## Mandatory Agent Usage

UI/UX Work:
  → MUST run /concept first
  → MUST use design-master agent
  → MUST study reference patterns

Code Changes:
  → MUST use code-reviewer-pro
  → MUST write tests (TDD)

Complex Features:
  → MUST orchestrate multiple agents
  → MUST use proven workflows
```

### FAILURE_ANALYSIS.md

**Complete documentation of failure modes:**

- What went wrong (injury protocol failure)
- Why it went wrong (context loss, zero agents)
- How to prevent it (SESSION_START, /concept, workflows)
- Real examples (before/after)

---

## 💬 The Command System

### `/concept` - Creative Exploration Phase

**Problem:** Agents jump straight to implementation, producing generic work.

**Solution:** Force creative exploration first.

**How it works:**

```
1. Reads DESIGN_PATTERNS.md (reference patterns in your codebase)
2. Discovers similar implementations to study
3. Extracts what makes them elegant
4. Uses brainstorming skill to explore approaches
5. Presents concept brief for approval
6. THEN implements
```

**Example:**

```
You: "Build a medical protocol page"

/concept:
  → Reads DESIGN_PATTERNS.md
  → Finds anti-aging protocol pattern
  → Studies: "Timeline as hero, compact cards, progressive disclosure"
  → Brainstorms variations
  → Presents: "Timeline-first approach with phase cards, not bento grid"
You: "Approve"
  → Now /enhance implements with this concept
```

**Prevents:** Generic bento grid disasters, missing the user's primary goal

---

### `/clarify` - Quick Questions Without Hijacking

**Problem:** Brainstorming hijacks workflow when you just need a quick answer.

**Solution:** AskUserQuestion for focused options.

**Example:**

```
Agent: "Should the card spacing be 16px or 24px?"
/clarify:
  → Presents options with descriptions
  → You pick
  → Work continues immediately
```

**Use when:** Simple decision, don't need full brainstorming session

---

### `/agentfeedback` - Systematic Feedback Processing

**Problem:** You have 10 pieces of feedback after implementation. Chaos ensues.

**Solution:** Parse, categorize, assign agents, orchestrate fixes.

**How it works:**

```
You: [provides feedback list]

/agentfeedback:
  1. Parse feedback into:
     - Critical (breaks functionality)
     - Important (UX/design issues)
     - Nice-to-have (polish)

  2. Assign specialized agents:
     - Critical bugs → debugger
     - Design issues → design-master
     - Code quality → code-reviewer-pro

  3. Execute in parallel waves:
     - Wave 1: Critical fixes
     - Wave 2: Important improvements
     - Wave 3: Nice-to-haves

  4. Quality gate: code-reviewer-pro reviews everything
```

**Result:** Systematic fixes instead of "I'll handle those 10 things" chaos

---

### `/enhance` - Smart Routing

**Enhanced with design detection:**

```
You: "Redesign the protocol page"

/enhance detects design work:
  ⚠️ DESIGN/UX WORK DETECTED

  You MUST run /concept first to:
  1. Study reference patterns
  2. Extract elegance principles
  3. Explore creative approaches
  4. Present concept for approval

  Running /concept now...
```

**Prevents:** Jumping to implementation without concept phase

---

## 📊 Scaling Patterns

### Small Task (1-2 agents)
```
Task: "Add dark mode toggle"

/enhance
  → frontend-developer implements
  → code-reviewer-pro reviews

Time: 15-20 minutes
```

### Medium Task (3-5 agents)
```
Task: "Build user dashboard"

/concept
  → Explore approaches
  → Approve concept

/enhance
  Wave 1 (parallel):
    → design-master (spacing, typography, layout)
    → frontend-developer (component structure)

  Quality gate: code-reviewer-pro

  Wave 2:
    → Integration & polish

Time: 45-60 minutes
```

### Large Task (6+ agents)
```
Task: "Build iOS app"

Use workflow: ios-development.yml

Phase 1: Setup & Architecture
  → ios-dev + swift-architect (subagent)

Phase 2: Core Implementation
  → ios-dev + swiftui-specialist (parallel)

Phase 3: Testing
  → ios-dev + ios-simulator MCP

Phase 4: Polish
  → code-reviewer-pro (quality gate)

Time: 90 minutes
```

---

## 🎓 Best Practices

### 1. Always Start with Context (Continuation Sessions)

```
✅ DO:
  - Read SESSION_START.md checklist
  - Verify original request understanding
  - Review reference patterns
  - Confirm orchestration plan

❌ DON'T:
  - Start coding immediately
  - Assume you remember everything
  - Skip reference pattern study
```

### 2. Use Workflows as Templates

```
✅ DO:
  - iOS app? → ios-development.yml
  - UI work? → ui-ux-design.yml
  - Bug? → debugging-workflow.yml

❌ DON'T:
  - Reinvent orchestration patterns
  - Solo execution for complex work
  - Skip proven processes
```

### 3. Enforce Process Through Commands

```
✅ DO:
  Design work: /concept → explore → approve → /enhance
  Feedback: /agentfeedback → parse → assign → execute
  Questions: /clarify → options → pick → continue

❌ DON'T:
  - Jump straight to /enhance for design work
  - Handle feedback chaotically
  - Use brainstorming for simple questions
```

### 4. Orchestrate Deliberately

```
✅ DO:
  - Parallel independent tasks
  - Quality gates between phases
  - Specialized agents for domains
  - Code review before completion

❌ DON'T:
  - One agent doing everything
  - Skip code review "to save time"
  - Sequential when parallel works
```

---

## 🔍 Troubleshooting

### "Agent didn't use other agents"

**Check:**
1. Is this a continuation session? → Read SESSION_START.md
2. Is this design work? → Should have run /concept
3. Is orchestration documented? → Check workflows/

**Fix:** Explicitly request multi-agent orchestration or use workflow commands

---

### "Generic/uninspired design"

**Likely causes:**
1. Skipped /concept phase
2. No reference patterns studied
3. Solo execution without creative exploration

**Fix:** Always run /concept for design work, study DESIGN_PATTERNS.md

---

### "Session lost context"

**Symptoms:**
- Forgot original request
- Didn't reference previously discussed patterns
- Started from scratch instead of continuing

**Prevention:**
- SESSION_START.md checklist mandatory
- Document decisions in project
- Reference original instructions explicitly

**Fix:** Ask user for context, read previous session notes, review patterns

---

## ✅ Validation & Quality Assurance System

### The Problem: "Looks Good" Subjective Failures

**Real failure from iOS session:**
```
Agent: "Library populated with peptides" ✅
Reality: Only 8 peptides (needed 28)
Caught by: code-reviewer-pro (lucky catch)
```

**Why it happened:** Agent can't judge "complete" without explicit, measurable criteria.

### The Solution: Automated Validation Framework

**Framework file:** `~/.claude/agentfeedback-validation-schema.yml`

**Key principle:** Acceptance criteria must be **MEASURABLE**, not subjective.

```yaml
wave_example_populate_library:
  task: "Populate peptide library with data from website"

  acceptance_criteria:
    - peptide_count: 28              # ✅ Measurable
    - source_match: /lib/peptide-data.ts
    - categories_minimum: 9
    # NOT: "library should be good"  # ❌ Subjective

  automated_validation:
    # Count check
    - type: count
      command: "grep -c 'Peptide(' PeptideDatabase.swift"
      expected: 28
      failure_message: "Only {actual} peptides found, need 28"

    # Build verification (mandatory)
    - type: build
      command: "xcodebuild -project X.xcodeproj -scheme Y build"
      must_pass: true
      failure_message: "Build failed after data population"

  on_failure:
    action: REQUEST_REWORK
    agent: ios-dev
    prompt: |
      Validation failed: Only {actual} peptides, need 28.
      Requirements:
      - Must have exactly 28 peptides
      - Must match website data structure
      - Build must pass

      Please fix and re-run validation.
```

### Validation Types Available

| **Type** | **Purpose** | **Example** |
|----------|-------------|-------------|
| `count` | Count occurrences, compare to expected | Peptide count, component count |
| `grep` | Search for pattern, verify matches | Check for unauthorized code |
| `file_exists` | Verify file was created | New component files |
| `file_not_exists` | Verify file was deleted | Legacy components removed |
| `build` | Run build command (mandatory) | `xcodebuild build`, `npm run build` |
| `test` | Run test suite | `xcodebuild test`, `npm test` |
| `structure` | Validate data structure | Check required fields present |
| `diff` | Compare two sources | Verify data matches reference |
| `custom` | Custom validation script | Complex validation logic |

### Build Verification (Mandatory)

**Every wave must verify build passes before approval:**

```bash
# iOS example
xcodebuild -project peptidefox-ios.xcodeproj -scheme PeptideFox build

# Web example
npm run build

# If build fails → REQUEST_REWORK (not approve)
```

**Why this matters:**
- Prevents shipping code that doesn't compile
- Catches broken dependencies from deletions
- Validates imports still resolve
- No more "assumed it compiles"

### Discovery Phase (Prevents Rebuilding What Exists)

**Real failure from iOS session:**
```
Planned: "Rebuild GLP-1 tab with 3-step wizard"
Discovery (later): "GLPJourneyView already exists!"
Impact: Wasted planning, could have just exposed existing view
```

**Solution: Phase 3 in /agentfeedback**

```bash
# Before agent assignment, discover existing implementations:

# Find similar components/views
find . -name "*[SimilarPattern]*" -type f

# Search for related functionality
grep -r "related_functionality" --include="*.swift"

# Check git history for similar work
git log --all --oneline --grep="similar feature"
```

**Discovery output:**
```
📋 DISCOVERY REPORT

Feedback: "Add GLP-1 tab"
Found: GLPJourneyView.swift already exists!
  - Has 3-step wizard
  - Implements agent selection
  - Just needs to be exposed in tab bar

Plan: Expose existing view (not rebuild)
Time saved: ~2 hours
```

### Changeset Manifests (Wave-to-Wave Context)

**The problem:** Wave 2 doesn't know what Wave 1 changed.

**Solution: Auto-generated JSON manifests**

```json
// changeset_wave_1.json (generated after Wave 1 completion)
{
  "wave": 1,
  "agent": "ios-dev",
  "task": "Rebuild calculator",
  "timestamp": "2025-10-21T05:15:00Z",

  "files_modified": [
    "CalculatorView.swift",
    "CalculatorViewModel.swift"
  ],

  "files_created": [
    "CompoundPickerView.swift"
  ],

  "files_deleted": [
    "DevicePickerView.swift",
    "SyringeVisualView.swift"
  ],

  "features_removed": [
    "frequency_picker (lines 145-189)",
    "device_selector (lines 230-267)"
  ],

  "features_added": [
    "compound_selection_modal (CompoundPickerView.swift)",
    "reconstitution_flow (CalculatorView.swift:89-156)"
  ],

  "components_available_for_reuse": [
    "CompoundPickerView - DO NOT recreate this component"
  ],

  "next_wave_context": "Calculator now uses CompoundPickerView for selection. Reuse this component."
}
```

**Wave 2 reads this before executing:**
```
I see Wave 1 created CompoundPickerView.
I won't recreate it - I'll use the existing component.
```

**Prevents:** Duplication, conflicts, context loss between waves

### Parse Confirmation (Optional)

**The risk:** Agent misunderstands feedback, wastes work.

**Solution: Optional confirmation step**

```bash
/agentfeedback --confirm [your feedback]
```

**Shows parsed feedback with options:**
```
📋 I parsed your feedback as:

🔴 CRITICAL (4):
1. Calculator functionality lost - Type: Functionality
   → Agent: ios-dev (rebuild calculator)

2. Tab structure wrong - Type: Functionality
   → Agent: ios-dev (replace Protocols with GLP-1)

🟡 IMPORTANT (3):
5. Typography/layout messy - Type: Design
   → Agent: ios-dev (fix heading structure)

Is this correct before I proceed?

Options:
- ✅ Yes, proceed with this plan
- 🔄 No, let me clarify
- 📝 Mostly correct, but...
```

**Trade-off:** Adds checkpoint (slower) vs prevents misunderstanding (safer)

**Default:** Auto-proceed (like before)
**Optional:** `--confirm` flag for safety

### Enhanced /agentfeedback Workflow

**All phases with new enhancements:**

```
Phase 1: Parse Feedback
  → Categorize: Critical/Important/Nice-to-have
  → Classify: Functionality/Design/Performance

Phase 2: Confirm Parsing (if --confirm flag)
  → Present parsed feedback
  → Wait for user approval
  → Adjust if needed

Phase 3: DISCOVERY (NEW)
  → Scan codebase for existing implementations
  → Check for reusable components
  → Update plan based on findings
  → Present discovery report

Phase 4: Agent Assignment
  → Match agents to task types
  → Group into waves

Phase 4.5: Define Acceptance Criteria (NEW)
  → Read agentfeedback-validation-schema.yml
  → Define MEASURABLE criteria
  → Create automated validation checks

Phase 5: Execute Waves
  → Wave 1: Critical fixes (parallel)
  → Wave 2: Important improvements
  → Wave 3: Nice-to-haves

Phase 6: Validate & Verify (NEW)
  → Run automated validation checks
  → Verify build passes (mandatory)
  → Generate changeset manifest
  → If validation fails → REQUEST_REWORK

Phase 7: Quality Gate
  → code-reviewer-pro reviews all changes
  → Must verify build passes
  → Approve or request changes
```

### Quality Gate Enhancements

**code-reviewer-pro now verifies:**

```markdown
Before APPROVE verdict:

1. [ ] Code review passed (style, patterns, best practices)

2. [ ] Build verification passed:
   iOS: xcodebuild -project X -scheme Y build
   Web: npm run build
   Backend: pytest / cargo build

   If build fails → REQUEST CHANGES with error output

3. [ ] Tests passed (if applicable)

4. [ ] Acceptance criteria met:
   - All measurable thresholds verified
   - All automated checks passed

5. [ ] No regressions:
   - Deleted files not referenced elsewhere
   - Imports still resolve
   - No orphaned dependencies

IF ANY FAIL → REQUEST CHANGES (do not approve)
```

### Real-World Example: iOS Session With Validation

**Without validation framework:**
```
Wave 2 Agent: "Library populated" ✅
Reality: Only 8 peptides (need 28)
Detection: code-reviewer-pro (manual catch)
Risk: Could have been missed
```

**With validation framework:**
```
Wave 2 Agent: "Library populated" ✅

Automated Validation:
  CHECK 1: Peptide count
    Command: grep -c 'Peptide(' PeptideDatabase.swift
    Expected: 28
    Actual: 8
    Status: ❌ FAILED

  CHECK 2: Build verification
    Status: ⏭️ SKIPPED (previous check failed)

VALIDATION FAILED

Action: REQUEST_REWORK from ios-dev
Prompt: "Only 8 peptides found, need 28. Please add remaining 20."

Agent re-executes with explicit requirement.

Re-validation:
  CHECK 1: Peptide count → ✅ PASSED (28 found)
  CHECK 2: Build → ✅ PASSED

VALIDATION PASSED → Proceed to quality gate
```

**Impact:** Zero risk of critical misses, objective pass/fail criteria

---

## 📈 Real Results

### Before This System
- iOS app: Solo execution, 6 hours, mediocre architecture
- UI redesign: Generic bento grid, unusable, complete failure
- Debugging: Guess-and-check, hours wasted

### After This System
- iOS app: 9 agents, 90 minutes, production-ready
- UI redesign: "Miles better, gave me something to work with"
- Debugging: Systematic investigation, root cause found quickly

**The difference:** Orchestration, process, quality gates

---

## 🛠️ CLI Usage

### View Navigation
```bash
/nav
```
Action-oriented view of agents, skills, workflows

### View Workflow Details
```bash
workflow show ios-development
workflow show ui-ux-design
workflow list
```

### Use Commands
```bash
/concept          # Design/UX creative exploration
/clarify          # Quick questions
/agentfeedback    # Process feedback systematically
/enhance          # Build with design detection
```

---

## 🤝 Contributing

This system evolved from real failures and successes.

**To contribute:**

1. **Document Failure Modes**
   - Add to FAILURE_ANALYSIS.md
   - What went wrong, why, how to prevent

2. **Create Workflows**
   - Add proven patterns to workflows/
   - Document phases, agents, skills, results

3. **Improve Commands**
   - Enhance existing commands
   - Create new process enforcers

4. **Share Results**
   - Before/after examples
   - Time savings
   - Quality improvements

---

## 📝 License

MIT License

---

## 🙏 Acknowledgments

Built from:
- 1 catastrophic UI failure (0 agents, generic output)
- 1 successful iOS app (9 agents, 90 minutes)
- Countless orchestration experiments
- Real-world usage and iteration

**The insight:** Multi-agent orchestration isn't about having lots of agents. It's about coordination, process, and quality gates.

**The goal:** Make orchestration systematic, not heroic.

---

## 📚 Documentation

- [Workflows](workflows/) - All workflow YAML definitions
- [Failure Analysis](.claude/FAILURE_ANALYSIS.md) - Complete failure documentation
- [Session Start](.claude/SESSION_START.md) - Continuation checklist
- [Project Rules](.claude/PROJECT_RULES_TEMPLATE.md) - Per-project requirements

---

## 💡 Key Takeaways

If you only remember three things:

1. **Orchestration > Solo Execution**
   - Complex work needs coordination
   - Specialists excel in their domains
   - Quality gates prevent shipped mistakes

2. **Process Prevents Failures**
   - SESSION_START.md for continuations
   - /concept for design work
   - Workflows for proven patterns

3. **Context Is Everything**
   - Sessions lose context
   - Reference patterns matter
   - Documentation enables consistency

**Start here:**
1. Read the walkthrough above
2. Install the system (`npm install && npm link`)
3. Try `/nav` to see what you have
4. Run `/concept` on your next design task
5. Use a workflow for your next complex project

---

**Questions? Confused? Want to contribute?**

Open an issue or PR. This system improves through real-world usage.

**Remember:** You're not alone in finding agents/skills/MCPs confusing. This system is the path from confusion to clarity.
