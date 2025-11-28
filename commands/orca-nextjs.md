---
description: "OS 2.4 orchestrator entrypoint for Next.js frontend tasks"
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

# /orca-nextjs – Next.js Lane Orchestrator (OS 2.4)

Use this command for Next.js / frontend UI work.

## Usage

```bash
/orca-nextjs "update the pricing page layout"           # Default: light path + design gates
/orca-nextjs -tweak "fix button spacing"                # Fast: light path, no gates
/orca-nextjs --complex "multi-page feature"             # Full: grand-architect + all gates
/orca-nextjs "implement requirement 2025-11-25-0930-dashboard"  # Full path with spec
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
design-reviewer in DIAGNOSE mode before implementation.

---

## 0.5 Deep Audit Mode (Optional)

Use this mode when you want a **deep review/audit** of the existing
Next.js codebase, not implementation:

- Structural issues
- Standards violations
- Design/UX consistency problems
- Perf/a11y/SEO risks

**IMPORTANT:** Audit mode MUST NOT modify code. It only analyzes and
reports.

When `--audit` is detected:

1. **Clarify focus**
   - Use `AskUserQuestion` to ask what to prioritize:
     - Standards & architecture
     - Design & UX
     - Performance
     - Accessibility
     - SEO

2. **Memory & ProjectContext**
   - Run memory-first search (Workshop + unified memory) for:
     - Past Next.js incidents, RA tags, and standards.
   - Call `mcp__project-context__query_context` with a diagnostic task:
     - `domain: "nextjs"`
     - `task`: "Deep Next.js codebase audit"
     - `maxFiles`: larger than usual (e.g. 30–50)
     - `includeHistory: true`

3. **Assemble an audit squad (via Task)**
   - Based on user focus, delegate to relevant agents:
     - Standards:
       - `nextjs-standards-enforcer` – scan key app/routes/components for standards violations.
     - Design & UX:
       - `nextjs-design-reviewer` – visual/layout/design DNA review.
     - Performance:
       - `nextjs-performance-specialist` – hotspots, bundle/perf issues.
     - Accessibility:
       - `nextjs-accessibility-specialist` – WCAG/a11y issues.
     - SEO:
       - `nextjs-seo-specialist` – metadata, structure, crawlability.

   - In prompts, make it explicit that:
     - They are in **audit** mode.
     - They should use `Read`/`Grep`/`Glob` (+ ProjectContext) to inspect
       code, not rely on `files_modified`.
     - They MUST NOT edit code; only analyze and report.

4. **Synthesize a Next.js Audit Report**
   - Combine agent findings into a single report:
     - Structural/standards issues
     - Design inconsistencies
     - Perf/a11y/SEO risks
     - Suggested follow-up tasks (each one can become a `/plan` + `/orca-nextjs` implementation later).

5. **(Optional) Save audit history**
   - Use `mcp__project-context__save_task_history` with:
     - `domain: "nextjs"`
     - `task`: "audit: nextjs codebase"
     - `outcome`: `"diagnosed"` or `"reviewed"`
     - `learnings`: key bullets from the audit

Return this report to the user and **do not** proceed into the normal
implementation pipeline unless explicitly requested.

---

## 1. Memory-First Context & Complexity Classification

### 1.1 Memory Search (Before ProjectContext)

Before expensive ProjectContext queries, check local memory:

```bash
# Search Workshop for relevant Next.js decisions/gotchas
workshop --workspace .claude/memory why "nextjs $TASK_KEYWORDS"

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
- Adding simple element (icon, button text)
- Keywords: "tweak", "fix", "adjust", "change", "update" + single element

**MEDIUM (complexity_tier: "medium")** - Full Pipeline, Spec Recommended
- Single page/route changes
- New simple component
- Modest styling changes
- 2-5 files affected

**COMPLEX (complexity_tier: "complex")** - Full Pipeline, Spec REQUIRED
- Multiple pages/routes
- New feature with state
- Architecture decisions (RSC vs client, data fetching)
- SEO-critical changes
- Authentication/payments
- Major layout restructuring
- Keywords: "implement", "build", "create", "refactor" + feature/flow/system

**If uncertain:** Use AskUserQuestion:
```
"How would you classify this task?"
Options:
- Simple tweak (1-2 files, quick fix)
- Medium feature (single page, some logic)
- Complex feature (multi-page, architecture)
```

### 1.3 Spec Gating (Complex Tasks Only)

**If complexity_tier == "complex":**

1. Check if request references a requirement ID
2. Look for `.claude/requirements/<id>/06-requirements-spec.md`
3. **If spec NOT found:**
   ```
   ⛔ BLOCKED: Complex task requires a spec.

   This task appears to involve multiple pages or architectural decisions.
   Please run:
     /plan "<task description>"

   Then return with:
     /orca-nextjs "implement requirement <id>"
   ```
4. **If spec found:**
   - Record `requirement_id` and `requirements_spec_path` in phase_state
   - Spec becomes authoritative source for nextjs-architect

---

## 2. Flag Routing

### Default (no flag) - Light Path WITH Design Gates

Delegate to `nextjs-light-orchestrator`:

```
Task({
  subagent_type: "nextjs-light-orchestrator",
  description: "Next.js task with design verification",
  prompt: `
Handle this Next.js task via the light path WITH design verification gates.

REQUEST: $ARGUMENTS

MEMORY CONTEXT (if any):
<memory hits from 1.1>

ROUTING MODE: default (light + gates)
- Run nextjs-builder + specialists
- Run design verification gates (standards-enforcer, design-reviewer)
- Ephemeral phase_state only (scores for this run, no ceremony)
- NO grand-architect, NO spec requirement
  `
})
```

---

### -tweak Flag - Light Path WITHOUT Gates (Pure Speed)

1. Memory-first context only (skip ProjectContext)
2. Delegate directly to `nextjs-builder`
3. Basic verification (lint/type/build)
4. NO design verification gates

**Fallback:** If memory can't locate files, MAY use narrow ProjectContext (maxFiles: 3)

```
Task({
  subagent_type: "nextjs-builder",
  description: "Fast Next.js tweak (no gates)",
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
- Use: `nextjs-builder` only
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

**⛔ DO NOT PROCEED TO SECTION 3.2 WITHOUT USER CONFIRMATION**

Use AskUserQuestion to confirm. **WAIT FOR RESPONSE.**

```
Detected: Next.js task (complexity: medium/complex)

Proposed Pipeline:
1. Context Query (ProjectContext)
2. Grand Architect (nextjs-grand-architect) - architecture decisions
3. Planning (nextjs-architect) - detailed plan
4. Analysis (nextjs-layout-analyzer) - structure mapping
5. Implementation (nextjs-builder + specialists)
6. Gates (nextjs-standards-enforcer, nextjs-design-reviewer)
7. Verification (nextjs-verification-agent)

Proposed Agents:
- nextjs-grand-architect
- nextjs-architect
- nextjs-layout-analyzer
- nextjs-builder
- [specialists based on task - see 3.1.1]
- nextjs-standards-enforcer
- nextjs-design-reviewer
- nextjs-verification-agent

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
| "remove/eliminate/migrate from Tailwind" | `nextjs-tailwind-specialist` | `nextjs-css-specialist`, `design-token-guardian` |
| "remove/eliminate inline styles" | — | `nextjs-css-specialist`, `design-token-guardian` |
| "CSS architecture/semantic CSS/@layer" | `nextjs-tailwind-specialist` | `nextjs-css-specialist` |
| "audit/review" (not implement) | `nextjs-builder` | Appropriate reviewer/enforcer agents |

**Detection keywords:**
- "remove", "eliminate", "get rid of", "migrate away from", "replace" → EXCLUDE that specialist
- "audit", "review", "analyze", "check" → Use reviewers, NOT builders

### 3.2 Context Query

Call ProjectContextServer (unless memory-first gave sufficient context):

```
mcp__project-context__query_context({
  domain: "nextjs",
  task: <sanitized task description>,
  projectPath: <repo root>,
  maxFiles: 10-15,
  includeHistory: true
})
```

Initialize phase_state.json:
```json
{
  "domain": "nextjs",
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

Delegate to `nextjs-grand-architect`:

Inputs:
- ContextBundle
- Memory summary
- Requirements spec (if complex)
- **Visual context** (from Section 0):
  - `has_visual_reference`: Did user provide screenshot?
  - `needs_diagnosis`: Should reviewer diagnose first?

**CRITICAL:** Grand-architect will use visual context to decide flow:
- If `has_visual_reference: true` → Builder gets user's visual context directly
- If `needs_diagnosis: true` → Run `nextjs-design-reviewer` in DIAGNOSE mode first

Outputs:
- Architecture path (App Router structure, RSC vs client, data patterns)
- Design DNA presence check
- Risk assessment
- Task force plan

Save decision via `mcp__project-context__save_decision`.

### 3.4 Planning (nextjs-architect)

Delegate to `nextjs-architect`:

**If requirements_spec_path exists:**
- nextjs-architect MUST read spec first
- Spec's constraints and acceptance criteria are authoritative
- Note any out-of-scope or ambiguous items

Outputs:
- Change type classification
- Impact analysis (routes, components, risks)
- Detailed plan with steps
- Assigned agents

Update phase_state.planning.

### 3.5 Analysis (nextjs-layout-analyzer)

Delegate to `nextjs-layout-analyzer`:

Outputs:
- Layout structure
- Component hierarchy
- Style sources

Update phase_state.analysis.

### 3.6 Implementation (nextjs-builder + specialists)

Delegate to `nextjs-builder`:

**Specialists as needed (per confirmed team from 3.1):**
- CSS Architecture: `nextjs-css-specialist` (semantic CSS, @layer, design tokens)
- Layout: `nextjs-layout-specialist`
- Types: `nextjs-typescript-specialist`
- Tokens: `design-token-guardian`
- Performance: `nextjs-performance-specialist`
- Accessibility: `nextjs-accessibility-specialist`
- SEO: `nextjs-seo-specialist`

**⚠️ Use ONLY the specialists confirmed in Section 3.1.**
Do not add specialists that weren't in the confirmed team.

Update phase_state.implementation_pass1.

### 3.7 Gates

Run gate agents:

1. **nextjs-standards-enforcer** - Code standards, token usage
   - Threshold: 90/100
   - Hard block if < 90

2. **nextjs-design-reviewer** - Visual QA, design DNA
   - Threshold: 90/100
   - Hard block if < 90

Update phase_state.gates.

**If gates fail:** Allow one corrective pass (implementation_pass2) scoped to violations only.

### 3.8 Verification

Delegate to `nextjs-verification-agent`:
- Run lint/typecheck/build
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
   - "Let me write this code" → WRONG. Delegate to nextjs-builder
   - "I'll fix this directly" → WRONG. Delegate to specialist
   - Using Edit/Write tools → WRONG. You're an orchestrator
   - Resuming without confirmation → WRONG. Must re-confirm first
   - "Based on feedback, re-confirming plan..." → CORRECT
   - "Based on feedback, delegating to nextjs-builder..." → WRONG (skipped confirmation)

---

## 5. Notes

- Use **Customization Gate** to block when design-dna is missing for UI work
- Keep nextjs-grand-architect in pure orchestration mode
- All agents use Opus 4.5 (default model)
- Complex tasks MUST have specs
- Simple tasks use light path for speed
- **Visual Context Flow:** If UI task has no screenshot, diagnose before building
