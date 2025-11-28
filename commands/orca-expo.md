---
description: "OS 2.4 Expo/React Native Orchestrator – coordinates the Expo lane pipeline, never writes code"
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

# /orca-expo – Expo Lane Orchestrator (OS 2.4)

Use this command for Expo/React Native mobile work.

## Usage

```bash
/orca-expo "add pull-to-refresh to product list"        # Default: light path + design gates
/orca-expo -tweak "fix button spacing"                  # Fast: light path, no gates
/orca-expo --complex "multi-screen auth flow"           # Full: grand-architect + all gates
/orca-expo "implement requirement 2025-11-25-auth"      # Full path with spec
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
  → If NO: record has_visual_reference: false (grand-orchestrator will diagnose first)
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

This is passed to grand-orchestrator who uses it to decide whether to run
expo-aesthetics-specialist in DIAGNOSE mode before implementation.

---

## 0.5 Deep Audit Mode (Optional)

Use this mode when you want a **deep review/audit** of the existing
Expo/React Native codebase, not implementation:

- Navigation and architecture
- API usage and state management
- Design DNA, aesthetics, accessibility
- Performance and bundle health

**IMPORTANT:** Audit mode MUST NOT modify code. It only analyzes and
reports.

When `--audit` is detected:

1. **Clarify focus**
   - Use `AskUserQuestion` to ask what to prioritize:
     - Architecture & navigation
     - Design & aesthetics
     - Accessibility
     - Performance & bundle size
     - API usage & error handling

2. **Memory & ProjectContext**
   - Run memory-first search (Workshop + unified memory) for:
     - Past Expo incidents, RA tags, and standards.
   - Call `mcp__project-context__query_context` with a diagnostic task:
     - `domain: "expo"`
     - `task`: "Deep Expo/React Native codebase audit"
     - `maxFiles`: larger than usual (e.g. 30–50)
     - `includeHistory: true`

3. **Assemble an audit squad (via Task)**
   - Based on focus, delegate to relevant agents:
     - Architecture/navigation:
       - `expo-architect-agent`
     - Design & tokens:
       - `design-dna-guardian`
       - `expo-aesthetics-specialist`
     - Accessibility:
       - `a11y-enforcer`
     - Performance:
       - `performance-enforcer`
       - `bundle-assassin`
     - API/state & testing:
       - `api-guardian`
       - `test-generator`

   - In prompts, make it explicit that:
     - They are in **audit** mode.
     - They should use `Read`/`Grep`/`Glob` (+ ProjectContext) to inspect
       code, not rely on `modified_files`.
     - They MUST NOT edit code; only analyze and report.

4. **Synthesize an Expo Audit Report**
   - Combine findings into a unified report:
     - Navigation/architecture issues
     - Design/aesthetics/a11y gaps
     - Performance & bundle risks
     - API/state/testing issues
     - Suggested follow-up tasks for targeted improvements.

5. **(Optional) Save audit history**
   - Use `mcp__project-context__save_task_history` with:
     - `domain: "expo"`
     - `task`: "audit: expo codebase"
     - `outcome`: `"diagnosed"` or `"reviewed"`
     - `learnings`: key bullets from the audit

Return this report to the user and **do not** proceed into the normal
implementation pipeline unless explicitly requested.

---

## 1. Memory-First Context & Complexity Classification

### 1.1 Memory Search (Before ProjectContext)

Before expensive ProjectContext queries, check local memory:

```bash
# Search Workshop for relevant Expo decisions/gotchas
workshop --workspace .claude/memory why "expo $TASK_KEYWORDS"

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
- Adding simple element (icon, haptic)
- Keywords: "tweak", "fix", "adjust", "change", "update" + single element

**MEDIUM (complexity_tier: "medium")** - Full Pipeline, Spec Recommended
- Single screen/component changes
- New simple component
- Modest styling changes
- 2-5 files affected

**COMPLEX (complexity_tier: "complex")** - Full Pipeline, Spec REQUIRED
- Multi-screen flows
- New feature with navigation/state
- Architecture decisions (offline, auth, navigation)
- Security-critical changes (auth, payments, PII)
- Major refactoring
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

   This task appears to involve multiple screens or architectural decisions.
   Please run:
     /plan "<task description>"

   Then return with:
     /orca-expo "implement requirement <id>"
   ```
4. **If spec found:**
   - Record `requirement_id` and `requirements_spec_path` in phase_state
   - Spec becomes authoritative source for expo-architect-agent

---

## 2. Flag Routing

### Default (no flag) - Light Path WITH Design Gates

Delegate to `expo-light-orchestrator`:

```
Task({
  subagent_type: 'expo-light-orchestrator',
  description: 'Expo task with design verification',
  prompt: `
Handle this Expo/React Native task via the light path WITH design verification gates.

REQUEST: $ARGUMENTS

MEMORY CONTEXT (if any):
<memory hits from 1.1>

ROUTING MODE: default (light + gates)
- Run expo-builder-agent + specialists
- Run design verification gates (design-token-guardian, a11y-enforcer, expo-aesthetics-specialist)
- Ephemeral phase_state only (scores for this run, no ceremony)
- NO grand-architect, NO spec requirement
  `
})
```

---

### -tweak Flag - Light Path WITHOUT Gates (Pure Speed)

1. Memory-first context only (skip ProjectContext)
2. Delegate directly to `expo-builder-agent`
3. Basic verification (npm test / expo doctor)
4. NO design verification gates

**Fallback:** If memory can't locate files, MAY use narrow ProjectContext (maxFiles: 3)

```
Task({
  subagent_type: 'expo-builder-agent',
  description: 'Fast Expo tweak (no gates)',
  prompt: `
Quick fix without design verification.

REQUEST: $ARGUMENTS

MEMORY CONTEXT (if any):
<memory hits from 1.1>

ROUTING MODE: tweak (pure speed)
- Make the change
- Basic verification only
- NO gates, NO design review
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
- Use: `expo-builder-agent` only
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
Detected: Expo/React Native task (complexity: medium/complex)

Proposed Pipeline:
1. Context Query (ProjectContext)
2. Grand Architect (expo-grand-orchestrator) - architecture decisions
3. Planning (expo-architect-agent) - detailed plan
4. Implementation (expo-builder-agent + specialists)
5. Gates (design-token-guardian, a11y-enforcer, performance-enforcer)
6. Power Checks (performance-prophet, security-specialist) - if needed
7. Verification (expo-verification-agent)

Proposed Agents:
- expo-grand-orchestrator
- expo-architect-agent
- expo-builder-agent
- [specialists based on task - see 3.1.1]
- design-token-guardian
- a11y-enforcer
- performance-enforcer
- expo-verification-agent

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
- Showing the team then immediately delegating to grand-orchestrator
- "I'll proceed with this team..." without waiting
- Any delegation before explicit user confirmation

#### 3.1.1 Intent-Aware Specialist Selection

**Before proposing specialists, check task intent:**

| Task Intent | EXCLUDE from team | USE instead |
|-------------|-------------------|-------------|
| "remove/eliminate inline styles" | — | `design-token-guardian` |
| "remove/migrate from Redux" | — | Use context/zustand patterns |
| "audit/review" (not implement) | `expo-builder-agent` | Appropriate reviewer/enforcer agents |
| "accessibility audit" | `expo-builder-agent` | `a11y-enforcer` |
| "performance audit" | `expo-builder-agent` | `performance-enforcer`, `bundle-assassin` |
| "security audit" | `expo-builder-agent` | `security-specialist` |

**Detection keywords:**
- "remove", "eliminate", "get rid of", "migrate away from", "replace" → EXCLUDE that specialist
- "audit", "review", "analyze", "check" → Use reviewers, NOT builders

### 3.2 Context Query

Call ProjectContextServer (unless memory-first gave sufficient context):

```
mcp__project-context__query_context({
  domain: "expo",
  task: <sanitized task description>,
  projectPath: <repo root>,
  maxFiles: 15,
  includeHistory: true
})
```

**FTS5 Sanitization:** Remove special characters that cause FTS5 syntax errors:
```
sanitizedTask = task.replace(/[\\/+\-()"*]/g, ' ').trim()
```

Initialize phase_state.json:
```json
{
  "domain": "expo",
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

Delegate to `expo-grand-orchestrator`:

Inputs:
- ContextBundle
- Memory summary
- Requirements spec (if complex)
- **Visual context** (from Section 0):
  - `has_visual_reference`: Did user provide screenshot?
  - `needs_diagnosis`: Should reviewer diagnose first?

**CRITICAL:** Grand-orchestrator will use visual context to decide flow:
- If `has_visual_reference: true` → Builder gets user's visual context directly
- If `needs_diagnosis: true` → Run `expo-aesthetics-specialist` in DIAGNOSE mode first

Outputs:
- Architecture path (navigation, state, data patterns)
- Design DNA presence check
- Risk assessment
- Task force plan

Save decision via `mcp__project-context__save_decision`.

### 3.4 Planning (expo-architect-agent)

Delegate to `expo-architect-agent`:

**If requirements_spec_path exists:**
- expo-architect-agent MUST read spec first
- Spec's constraints and acceptance criteria are authoritative
- Note any out-of-scope or ambiguous items

Outputs:
- Change type classification
- Impact analysis (screens, modules, risks)
- Detailed plan with steps
- Assigned agents

Update phase_state.planning.

### 3.5 Implementation (expo-builder-agent + specialists)

Delegate to `expo-builder-agent`:

Specialists as needed:
- Performance: `performance-prophet`
- Security: `security-specialist`
- Tokens: `design-token-guardian`

**Parallel deployment available** for independent components (see playbooks).

Update phase_state.implementation_pass1.

### 3.6 Gates (Parallel)

Run gate agents in parallel:

1. **design-token-guardian** - Design system compliance
   - Threshold: 90/100
   - Hard block if < 90

2. **a11y-enforcer** - WCAG 2.2 accessibility
   - Threshold: 0 critical violations
   - Hard block on any critical

3. **expo-aesthetics-specialist** - Visual quality
   - Threshold: 75/100 (soft gate)
   - Block if < 60 (AI slop)

4. **performance-enforcer** - Bundle/runtime budgets
   - Threshold: within budgets
   - Hard block on budget violations

Update phase_state.standards_budgets.

**If gates fail:** Allow one corrective pass (implementation_pass2) scoped to violations only.

### 3.7 Power Checks (Optional)

For high-risk work (auth, payments, offline, perf-sensitive):

1. **performance-prophet** - Predictive performance analysis
2. **security-specialist** - OWASP Mobile Top 10 audit

Update phase_state.power_checks.

### 3.8 Verification

Delegate to `expo-verification-agent`:
- Run npm test / expo doctor
- Record verification status

Update phase_state.verification.

### 3.9 Completion

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
   - "Let me write this code" → WRONG. Delegate to expo-builder-agent
   - "I'll fix this directly" → WRONG. Delegate to specialist
   - Using Edit/Write tools → WRONG. You're an orchestrator
   - Resuming without confirmation → WRONG. Must re-confirm first
   - "Based on feedback, re-confirming plan..." → CORRECT
   - "Based on feedback, delegating to expo-builder-agent..." → WRONG (skipped confirmation)

---

## 5. Standards Inputs (OS 2.4 Learning Loop)

### Gate Enforcement

`design-token-guardian`, `a11y-enforcer`, `performance-enforcer` MUST:
- Read `relatedStandards` from ContextBundle
- Treat them as **enforceable rules**, not suggestions
- Tag violations to the specific standard they break

### Learning Loop Closure

After task completion:
1. Recurring violations → `mcp__project-context__save_standard` (via /audit)
2. New standards flow into future `relatedStandards`
3. Future tasks see and enforce the new standard

```
violation → /audit → save_standard → vibe.db → future relatedStandards → gate enforcement
```

---

## 6. Notes

- Use **Customization Gate** to block when design-dna is missing for UI work
- Keep expo-grand-orchestrator in pure orchestration mode (Opus)
- All agents use Opus 4.5 (default model)
- Complex tasks MUST have specs
- Simple tasks use light path for speed
- High-risk domains (auth, payments, PII) → mandatory security-specialist
- **Visual Context Flow:** If UI task has no screenshot, diagnose before building

Begin orchestration for: **$ARGUMENTS**
