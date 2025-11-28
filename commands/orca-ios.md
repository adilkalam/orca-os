---
description: "OS 2.4 orchestrator entrypoint for native iOS tasks"
argument-hint: "[-tweak] <task description or requirement ID>"
allowed-tools:
  - Task
  - AskUserQuestion
  - mcp__project-context__query_context
  - mcp__project-context__save_decision
  - mcp__project-context__save_task_history
  - Read
  - Bash
  - Grep
  - Glob
---

# /orca-ios – iOS Lane Orchestrator (OS 2.4)

Use this command for native iOS work (Swift/SwiftUI/UIKit, Xcode, device features).

## Usage

```bash
/orca-ios "add haptic feedback to save button"       # Default: light path + design gates
/orca-ios -tweak "fix button padding"                # Fast: light path, no gates
/orca-ios --complex "multi-screen feature"           # Full: grand-architect + all gates
/orca-ios "implement requirement 2025-11-25-0930-workspace-sharing"  # Full path with spec
```

## 🚨 CRITICAL ROLE BOUNDARY 🚨

**YOU ARE AN ORCHESTRATOR. YOU NEVER WRITE CODE.**

- **DO NOT** use Edit/Write tools
- **DO NOT** bypass the agent system
- **DELEGATE** via Task tool only
- Update phase_state.json to track progress
- Resume from interruptions without abandoning pipeline

---

## 0. Parse Arguments & Detect Mode

**Check for flags:**
```
$ARGUMENTS contains "-tweak" → Fast path (light, no gates)
$ARGUMENTS contains "--complex" → Full path (grand-architect, all gates)
No flag → Default path (light + design gates)
```

**Check for requirement ID:**
```
$ARGUMENTS matches "requirement <id>" or "<YYYY-MM-DD-HHMM-*>"
  → Look for .claude/requirements/<id>/06-requirements-spec.md
  → If found, this is a SPEC-DRIVEN task (see Section 1.3)
```

**Check for `--audit` / audit mode:**
```
$ARGUMENTS contains "--audit"
  OR starts with "audit" / "review"
  → Enter Deep Audit Mode (skip normal planning/implementation flow)
```

If `--audit` is present, run the Deep Audit flow in Section 0.5 and then
return a report instead of implementing changes.

**Check for visual context (UI tasks):**
```
If task involves UI/UX (keywords: "UI", "layout", "styling", "broken", "fucked", "spacing", "visual"):
  → Check if user attached screenshot/image
  → If YES: record has_visual_reference: true
  → If NO: record has_visual_reference: false (grand-architect will diagnose first)
```

Record in phase_state:
```json
{
  "visual_context": {
    "has_visual_reference": true|false,
    "user_provided_screenshot": true|false,
    "needs_diagnosis": true|false
  }
}
```

This is passed to grand-architect who uses it to decide whether to run
ios-ui-reviewer in DIAGNOSE mode before implementation.

---

## 0.5 Deep Audit Mode (Optional)

Use this mode when you want a **deep review/audit** of the existing iOS
codebase, not implementation:

- Architecture consistency
- Concurrency and safety
- Design DNA & UI/UX quality
- Performance/security/accessibility risks

**IMPORTANT:** Audit mode MUST NOT modify code. It only analyzes and
reports.

When `--audit` is detected:

1. **Clarify focus**
   - Use `AskUserQuestion` to ask what to prioritize:
     - Architecture & standards
     - UI/UX & design tokens
     - Concurrency & safety
     - Performance
     - Security & privacy
     - Accessibility

2. **Memory & ProjectContext**
   - Run memory-first search (Workshop + unified memory) for:
     - Past iOS incidents, RA tags, and standards.
   - Call `mcp__project-context__query_context` with a diagnostic task:
     - `domain: "ios"`
     - `task`: "Deep iOS codebase audit"
     - `maxFiles`: larger than usual (e.g. 30–50)
     - `includeHistory: true`

3. **Assemble an audit squad (via Task)**
   - Based on focus, delegate to relevant agents:
     - Standards/architecture:
       - `ios-standards-enforcer`
     - UI/UX & tokens:
       - `ios-ui-reviewer`
       - `design-dna-guardian`
     - Concurrency/safety:
       - `ios-performance-specialist`
       - `ios-security-specialist`
     - Accessibility:
       - `ios-accessibility-specialist`
     - Testing:
       - `ios-testing-specialist`
       - `ios-ui-testing-specialist`

   - In prompts, make it explicit that:
     - They are in **audit** mode.
     - They should use `Read`/`Grep`/`Glob` (+ ProjectContext) to inspect
       code and tests, not rely on `files_modified`.
     - They MUST NOT edit code; only analyze and report.

4. **Synthesize an iOS Audit Report**
   - Combine findings into a single report:
     - Architecture & standards issues
     - Concurrency/safety concerns
     - UI/UX & design DNA issues
     - Performance/security/accessibility gaps
     - Suggested follow-up tasks (each can become `/plan` + `/orca-ios` work).

5. **(Optional) Save audit history**
   - Use `mcp__project-context__save_task_history` with:
     - `domain: "ios"`
     - `task`: "audit: ios codebase"
     - `outcome`: `"diagnosed"` or `"reviewed"`
     - `learnings`: key bullets from the audit

Return this report to the user and **do not** proceed into the normal
implementation pipeline unless explicitly requested.

---

## 1. Memory-First Context & Complexity Classification

### 1.1 Memory Search (Before ProjectContext)

Before expensive ProjectContext queries, check local memory:

```bash
# Search Workshop for relevant iOS decisions/gotchas
workshop --workspace .claude/memory why "iOS $TASK_KEYWORDS"

# Search vibe.db for relevant code/symbols (if available)
python3 ~/.claude/scripts/memory-search-unified.py "$TASK_KEYWORDS" --mode all --top-k 5
```

If memory hits are relevant:
- Note them for context
- May skip or reduce ProjectContext query scope

### 1.2 Complexity Classification

Analyze the request using these heuristics:

**SIMPLE (complexity_tier: "simple")** - Route to Light Orchestrator
- Single file change
- Minor UI tweak (padding, color, text)
- Small bugfix with obvious location
- Copy/label changes
- Adding simple interaction (haptic, animation)
- Keywords: "tweak", "fix", "adjust", "change", "update" + single element

**MEDIUM (complexity_tier: "medium")** - Full Pipeline, Spec Recommended
- Single screen changes
- New simple component
- Modest logic changes
- Some tests needed
- 2-5 files affected

**COMPLEX (complexity_tier: "complex")** - Full Pipeline, Spec REQUIRED
- Multiple screens/flows
- Architecture/data layer changes
- New feature with state management
- Security/auth/payments
- Offline/sync functionality
- Migration work
- Keywords: "implement", "build", "create", "refactor" + feature/flow/system

**If uncertain:** Use AskUserQuestion:
```
"How would you classify this task?"
Options:
- Simple tweak (1-2 files, quick fix)
- Medium feature (single screen, some logic)
- Complex feature (multi-screen, architecture)
```

### 1.3 Spec Gating (Complex Tasks Only)

**If complexity_tier == "complex":**

1. Check if request references a requirement ID
2. Look for `.claude/requirements/<id>/06-requirements-spec.md`
3. **If spec NOT found:**
   ```
   ⛔ BLOCKED: Complex task requires a spec.

   This task appears to involve multiple screens/flows or architectural changes.
   Please run:
     /plan "<task description>"

   Then return with:
     /orca-ios "implement requirement <id>"
   ```
4. **If spec found:**
   - Record `requirement_id` and `requirements_spec_path` in phase_state
   - Spec becomes authoritative source for ios-architect

---

## 2. Flag Routing

### Default (no flag) - Light Path WITH Design Gates

Delegate to `ios-light-orchestrator`:

```
Task({
  subagent_type: "ios-light-orchestrator",
  description: "iOS task with design verification",
  prompt: `
Handle this iOS task via the light path WITH design verification gates.

REQUEST: $ARGUMENTS

MEMORY CONTEXT (if any):
<memory hits from 1.1>

ROUTING MODE: default (light + gates)
- Run ios-builder + specialists
- Run design verification gates (standards-enforcer, ui-reviewer)
- Ephemeral phase_state only (scores for this run, no ceremony)
- NO grand-architect, NO spec requirement
  `
})
```

---

### -tweak Flag - Light Path WITHOUT Gates (Pure Speed)

1. Memory-first context only (skip ProjectContext)
2. Delegate directly to `ios-builder`
3. Basic verification (build/lint)
4. NO design verification gates

**Fallback:** If memory can't locate files, MAY use narrow ProjectContext (maxFiles: 3)

```
Task({
  subagent_type: "ios-builder",
  description: "Fast iOS tweak (no gates)",
  prompt: `
Quick fix without design verification.

REQUEST: $ARGUMENTS

MEMORY CONTEXT (if any):
<memory hits from 1.1>

ROUTING MODE: tweak (pure speed)
- Make the change
- Basic verification only
- NO gates, NO UI review
  `
})
```

---

### --complex Flag - Full Pipeline (Grand-Architect + All Gates)

Continue with full orchestration below (Section 3).

---

## 3. Full Pipeline Flow

### 3.0 Complexity Detection (Effort Scaling)

Before confirming the team, assess task complexity:

#### Detection Heuristics

**Count affected scope:**
1. Estimate files likely to be created/modified
2. Count distinct concerns (UI, data, auth, networking, etc.)
3. Check for cross-cutting requirements

**Assign complexity tier:**

| Tier | Files | Concerns | Agents | Team Composition |
|------|-------|----------|--------|------------------|
| `simple` | 1-2 | 1 | 1-2 | Light orchestrator only (skip grand-architect) |
| `medium` | 3-10 | 2-3 | 3-5 | Grand-architect + architect + builder + 1-2 specialists |
| `complex` | 10+ | 4+ | 5-10 | Full team + all gates + verification |

**Automatic tier detection:**
- Single file change → `simple`
- Feature touching one module → `medium`
- Feature spanning multiple modules → `complex`
- Any security/auth work → minimum `medium`
- Performance optimization → minimum `medium`
- Architecture changes → `complex`

#### Team Size Scaling

Based on `complexity_tier`, adjust the team presented for confirmation:

**simple:**
- Skip full pipeline
- Use: `ios-builder` only
- Skip: grand-architect, verification, most gates

**medium:**
- Standard pipeline
- Use: grand-architect → architect → builder → standards-enforcer
- Optional: verification (recommend but don't require)

**complex:**
- Full pipeline with all specialists
- Use: grand-architect → architect → builder → ALL specialists → ALL gates → verification
- Required: verification, all standards gates
- Consider: parallel specialist execution

Record `complexity_tier` in `phase_state.intake.complexity_tier` before proceeding.

---

### 3.1 Team Confirmation (MANDATORY - BLOCKING)

**DO NOT PROCEED TO SECTION 3.2 WITHOUT USER CONFIRMATION**

Use AskUserQuestion to confirm. **WAIT FOR RESPONSE.**

```
Detected: iOS task (complexity: medium/complex)

Proposed Pipeline:
1. Context Query (ProjectContext)
2. Grand Architect (ios-grand-architect) - architecture decisions
3. Planning (ios-architect) - detailed plan
4. Implementation (ios-builder + specialists)
5. Gates (ios-standards-enforcer, ios-ui-reviewer)
6. Verification (ios-verification)

Proposed Agents:
- ios-grand-architect
- ios-architect
- ios-builder
- [specialists based on task - see 3.1.1]
- ios-standards-enforcer
- ios-ui-reviewer
- ios-verification

Options:
- Proceed as planned
- Adjust team/phases
- Switch to light path (-tweak)
```

**After presenting this:**
1. STOP and wait for user response
2. If user says "proceed" → continue to 3.2
3. If user modifies team → update and re-confirm
4. If user rejects → STOP pipeline

**Anti-patterns (WRONG):**
- Showing the team then immediately delegating to grand-architect
- "I'll proceed with this team..." without waiting
- Any delegation before explicit user confirmation

#### 3.1.1 Intent-Aware Specialist Selection

**Before proposing specialists, check task intent:**

| Task Intent | EXCLUDE from team | USE instead |
|-------------|-------------------|-------------|
| "remove/migrate from UIKit" | `ios-uikit-specialist` | `ios-swiftui-specialist` |
| "remove/eliminate Combine" | — | Use async/await patterns |
| "audit/review" (not implement) | `ios-builder` | Appropriate reviewer/enforcer agents |
| "security audit" | `ios-builder` | `ios-security-specialist` |
| "performance audit" | `ios-builder` | `ios-performance-specialist` |

**Detection keywords:**
- "remove", "eliminate", "get rid of", "migrate away from", "replace" → EXCLUDE that specialist
- "audit", "review", "analyze", "check" → Use reviewers, NOT builders

### 3.2 Context Query

Call ProjectContextServer (unless memory-first gave sufficient context):

```
mcp__project-context__query_context({
  domain: "ios",
  task: <sanitized task description>,
  projectPath: <repo root>,
  maxFiles: 10-20,
  includeHistory: true
})
```

Initialize phase_state.json:
```json
{
  "domain": "ios",
  "complexity_tier": "medium|complex",
  "requirement_id": "<if applicable>",
  "requirements_spec_path": "<if applicable>",
  "current_phase": "context_query",
  "memory_summary": "<hits from memory search>",
  "context_query": {
    "status": "completed",
    "summary": "<brief context summary>"
  }
}
```

### 3.3 Grand Architect (Opus)

Delegate to `ios-grand-architect`:

Inputs:
- ContextBundle
- Memory summary
- Requirements spec (if complex)
- **Visual context** (from Section 0):
  - `has_visual_reference`: Did user provide screenshot?
  - `needs_diagnosis`: Should reviewer diagnose first?

**CRITICAL:** Grand-architect will use visual context to decide flow:
- If `has_visual_reference: true` → Builder gets user's visual context directly
- If `needs_diagnosis: true` → Run `ios-ui-reviewer` in DIAGNOSE mode first

Outputs:
- Architecture path (SwiftUI vs MVVM/TCA/UIKit)
- Data strategy (SwiftData vs Core Data/GRDB)
- Design DNA presence check
- Risk assessment
- Task force plan

Save decision via `mcp__project-context__save_decision`.

### 3.4 Planning (ios-architect)

Delegate to `ios-architect`:

**If requirements_spec_path exists:**
- ios-architect MUST read spec first
- Spec's constraints and acceptance criteria are authoritative
- Note any out-of-scope or ambiguous items

Outputs:
- Change type classification
- Impact analysis (screens, flows, data, navigation)
- Detailed plan with steps
- Constraints and risks

Update phase_state.planning.

### 3.5 Implementation (ios-builder + specialists)

Delegate to `ios-builder`:

Specialists as needed:
- UI: `ios-swiftui-specialist` or `ios-uikit-specialist`
- Tokens: `design-dna-guardian`
- Data: `ios-persistence-specialist`
- Networking: `ios-networking-specialist`
- Testing: `ios-testing-specialist`, `ios-ui-testing-specialist`
- Risk: `ios-performance-specialist`, `ios-security-specialist`, `ios-accessibility-specialist`

Update phase_state.implementation_pass1.

### 3.6 Gates

Run gate agents:

1. **ios-standards-enforcer** - Code standards, Swift 6 concurrency
   - Threshold: 90/100
   - Hard block if < 90

2. **ios-ui-reviewer** - UI/UX quality
   - Threshold: 90/100
   - Hard block if < 90

3. **ios-verification** - Build/test
   - Must pass build
   - Must pass tests

Update phase_state.gates.

**If gates fail:** Allow one corrective pass (implementation_pass2) scoped to violations only.

### 3.7 Completion

- Summarize gate scores, verification results, risks
- Save task history via `mcp__project-context__save_task_history`
- Archive phase_state

---

## 4. State Preservation & Session Continuity

**When user interrupts (questions, clarifications, test results):**

1. Read phase_state.json:
   ```bash
   cat .claude/orchestration/phase_state.json
   ```

2. Acknowledge and process new information

3. **RE-CONFIRM BEFORE RESUMING (MANDATORY):**
   - Present updated plan based on feedback
   - Use AskUserQuestion or orca-confirm skill
   - Get explicit "proceed" before delegating
   - **NEVER resume delegation without confirmation**

4. **DO NOT ABANDON PIPELINE:**
   - You are STILL orchestrating
   - Resume from current phase AFTER confirmation
   - Delegate to appropriate agent

5. **Anti-Pattern Detection:**
   - "Let me write this code" → WRONG. Delegate to ios-builder
   - "I'll fix this directly" → WRONG. Delegate to specialist
   - Using Edit/Write tools → WRONG. You're an orchestrator
   - Resuming without confirmation → WRONG. Must re-confirm first
   - "Based on feedback, re-confirming plan..." → CORRECT
   - "Based on feedback, delegating to ios-builder..." → WRONG (skipped confirmation)

---

## 5. Notes

- Block UI work if design DNA/tokens missing
- Do not change data store without explicit plan
- Keep edits scoped; no scope creep
- Complex tasks MUST have specs
- Simple tasks use light path for speed
- All agents use Opus 4.5 (default model)
- **Visual Context Flow:** If UI task has no screenshot, diagnose before building
