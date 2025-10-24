---
name: completion-drive
description: Meta-cognitive strategy for two-tier assumption tracking - use when making assumptions mid-generation or wishing you'd committed differently (project, gitignored)
---

# /completion-drive - Assumption Control Strategy

## Purpose

Meta-Cognitive strategy to harness completion drive productively through two-tier assumption tracking and specialized agent orchestration, maintaining flow state while ensuring systematic accuracy.

Claude should use this strategy whenever it feels it is missing information or making assumptions mid generation and cannot stop to verify. This includes if you find yourself wishing you had committed to a different implementation part way through.

**Complete tag system**: See `docs/RESPONSE_AWARENESS_TAGS.md` for full taxonomy of meta-cognitive tags including COMPLETION_DRIVE variants, CARGO_CULT detection, PATTERN_CONFLICT handling, and all 27+ tag types.

## Usage

```
/completion-drive [task description]
```

## Core Workflow

### Phase 1: Parallel Domain Planning

- Deploy specialized domain agents in parallel
- Each agent creates detailed plan in `docs/completion_drive_plans/`
- Domain agents mark uncertainties with `PLAN_UNCERTAINTY` tags using this same completion drive methodology
- Focus on their domain expertise, flag cross-domain interfaces

### Phase 2: Plan Synthesis & Integration

- Deploy dedicated **plan synthesis agent** to review all domain plans
- Validate interface contracts between plan segments
- Resolve cross-domain uncertainties where possible
- Produce unified implementation blueprint with:
  - Validated integration points
  - Resolved planning assumptions
  - Remaining uncertainties for implementation phase
  - Risk assessment for unresolved items

### Phase 3: Implementation

- Main agent receives synthesized, pre-validated plan
- Mark implementation uncertainties with `COMPLETION_DRIVE` tags
- No cognitive load from plan reconciliation
- Pure focus on code execution

### Phase 4: Systematic Verification

- Deploy verification agents to search for all remaining `COMPLETION_DRIVE` tags
- Validate implementation assumptions
- Cross-reference with original `PLAN_UNCERTAINTY` resolutions
- Fix errors, clean up tags with explanatory comments, once addressed the tag should be removed

### Phase 5: Process Cleanup

- Confirm zero COMPLETION_DRIVE tags remain
- Archive successful assumption resolutions for future reference

## Key Benefits

- **Maintains flow state** - no mental context switching
- **Two-tier assumption control** - catch uncertainties at planning AND implementation
- **Systematic accuracy** - all uncertainties tracked and verified
- **Better code quality** - assumptions become documented decisions
- **Reduced cognitive load** - synthesis agent handles integration complexity

## Plan Synthesis Agent Responsibilities

- **Interface validation** - Ensure data flows correctly between plan segments
- **Dependency resolution** - Identify cross-domain dependencies individual agents miss
- **Conflict detection** - Catch where different domain plans clash
- **Integration mapping** - Document explicit handoff points between systems
- **Assumption alignment** - Ensure consistent assumptions across all plans

## Command Execution

When you use `/completion-drive [task]`, I will:

1. **Deploy domain planning agents in parallel** → create plan files with PLAN_UNCERTAINTY tags as needed
2. **Deploy plan synthesis agent** → validate, integrate, and resolve cross-domain uncertainties
3. **Receive unified blueprint** → pre-validated plan with clear integration points
4. **Implement** → mark only implementation uncertainties with COMPLETION_DRIVE tags
5. **Deploy verification agents** → validate remaining assumptions systematically
6. **Clean up all tags** → replace with proper explanations and documentation

## Completion Drive Report

At the end of each session, I'll provide a comprehensive report:

```
═══════════════════════════════════════
COMPLETION DRIVE REPORT
═══════════════════════════════════════

Planning Phase:
  PLAN_UNCERTAINTY tags created: X
  ✅ Resolved by synthesis: X
  ⚠️  Carried to implementation: X

Implementation Phase:
  COMPLETION_DRIVE tags created: X
  ✅ Correct assumptions: X
  ❌ Incorrect assumptions: X

Final Status:
  🧹 All tags cleaned: ✅/❌
  📊 Accuracy rate: X%
═══════════════════════════════════════
```

---

## ⚠️ CRITICAL: Orchestration Instructions for Claude

When this command is invoked with `/completion-drive [task]`, you MUST follow this exact workflow:

### Step 1: Parse Task and Identify Domains

Analyze the task to determine which specialized agents are needed:
- Web Frontend → Design specialists (tailwind-specialist, ui-engineer) + Frontend specialists (react-18-specialist or nextjs-14-specialist)
- Backend work → backend-engineer
- iOS work → iOS specialists (swiftui-developer, swiftdata-specialist, swift-testing-specialist, etc.)
- Android work → android-engineer
- Cross-platform mobile → cross-platform-mobile + Design specialists (ux-strategist, ui-engineer, accessibility-specialist)
- Architecture/design → system-architect
- Testing → test-engineer or frontend-testing-specialist (for web) or iOS testing specialists

### Step 2: Deploy Domain Planning Agents (PARALLEL)

For each identified domain, dispatch planning agents in a SINGLE message with multiple Task tool calls:

```markdown
I'm deploying domain planning agents in parallel to create detailed plans with PLAN_UNCERTAINTY tags.
```

**For each agent, use this prompt template:**

```
TASK: Create detailed implementation plan for [domain-specific aspect of task]

DELIVERABLE: Write plan to docs/completion_drive_plans/[domain]-plan.md

PLAN REQUIREMENTS:
1. Break task into concrete implementation steps
2. Identify all assumptions and mark with PLAN_UNCERTAINTY tags:
   - File/component existence assumptions
   - API contract assumptions
   - Cross-domain integration assumptions
   - Technology stack assumptions
3. Specify interface contracts with other domains
4. Flag risks and unknowns explicitly

PLAN_UNCERTAINTY TAG FORMAT:
```
PLAN_UNCERTAINTY: [assumption description]
  Type: [file_existence|api_contract|integration|tech_stack]
  Impact: [high|medium|low]
  Cross-domain: [yes|no]
  Needs verification: [what needs checking]
```

OUTPUT: Complete plan file at docs/completion_drive_plans/[domain]-plan.md
```

**Wait for ALL planning agents to complete before proceeding to Step 3.**

### Step 3: Deploy Plan Synthesis Agent

Once all domain plans exist, dispatch the plan-synthesis-agent:

```
TASK: Synthesize and validate all domain plans from docs/completion_drive_plans/

RESPONSIBILITIES:
1. Read ALL domain plans in docs/completion_drive_plans/
2. Validate interface contracts between plan segments
3. Identify and resolve cross-domain PLAN_UNCERTAINTY tags where possible
4. Catch conflicts where different domain plans clash
5. Ensure consistent assumptions across all plans

DELIVERABLE: Write unified implementation blueprint to docs/completion_drive_plans/SYNTHESIZED_PLAN.md

SYNTHESIZED PLAN MUST INCLUDE:
- ✅ Validated integration points between domains
- ✅ Resolved PLAN_UNCERTAINTY tags (mark with ✅ RESOLVED)
- ⚠️  Unresolved PLAN_UNCERTAINTY tags (carry to implementation)
- 🔴 Risk assessment for unresolved items
- 📋 Implementation order (which domain work happens first)

OUTPUT: Unified blueprint at docs/completion_drive_plans/SYNTHESIZED_PLAN.md
```

**Wait for plan synthesis to complete before proceeding to Step 4.**

### Step 4: Review Synthesized Plan

Read docs/completion_drive_plans/SYNTHESIZED_PLAN.md and present summary to user:

```markdown
## Plan Synthesis Complete

**Planning Phase Results:**
- PLAN_UNCERTAINTY tags created: X
- ✅ Resolved by synthesis: X
- ⚠️  Carried to implementation: X

**Implementation Order:**
[List domains in execution order from synthesis]

**Integration Points:**
[List validated cross-domain interfaces]

**Remaining Risks:**
[List unresolved uncertainties that will need runtime verification]

Ready to proceed with implementation? (yes/no)
```

### Step 5: Implementation with COMPLETION_DRIVE Tags

If user approves, dispatch implementation agents with the synthesized plan:

**For each domain in implementation order:**

```
TASK: Implement [domain-specific work] per synthesized plan

INPUT: Read docs/completion_drive_plans/SYNTHESIZED_PLAN.md for your domain

IMPLEMENTATION REQUIREMENTS:
1. Follow synthesized plan integration points
2. Mark NEW implementation uncertainties with COMPLETION_DRIVE tags
3. Cross-reference unresolved PLAN_UNCERTAINTY tags from synthesis
4. Write implementation log to .orchestration/implementation-log.md

COMPLETION_DRIVE TAG FORMAT:
```
// COMPLETION_DRIVE: [assumption description]
//   Original PLAN_UNCERTAINTY: [reference if applicable]
//   Needs verification: [what to check]
```

DO NOT re-plan. The synthesis agent already validated the approach.
Focus on code execution and marking runtime uncertainties.

OUTPUT:
- Implemented code
- .orchestration/implementation-log.md with all COMPLETION_DRIVE tags
```

**Wait for implementation to complete before proceeding to Step 6.**

### Step 6: Deploy Verification Agent

Once implementation complete, verify all COMPLETION_DRIVE tags:

```
TASK: Verify all COMPLETION_DRIVE tags in codebase and implementation log

VERIFICATION PROCESS:
1. Search for all COMPLETION_DRIVE tags:
   - In .orchestration/implementation-log.md
   - In codebase (grep -r "COMPLETION_DRIVE" .)
2. For EACH tag found, run actual verification commands:
   - File existence: ls, wc -l, grep
   - API contracts: Read files, check signatures
   - Integration: Test cross-domain calls
3. Mark each tag:
   - ✅ VERIFIED: assumption was correct
   - ❌ FAILED: assumption was incorrect

DELIVERABLE: .orchestration/verification-report.md

IF ANY FAILURES:
  BLOCK WORKFLOW
  Report to user with exact command outputs
  DO NOT PROCEED

OUTPUT: Verification report with verdict (PASS/BLOCKED)
```

**Wait for verification to complete.**

### Step 7: Process Cleanup

If verification passes, clean up all tags:

1. Read verification report
2. For each ✅ VERIFIED tag:
   - Replace with explanatory comment
   - Remove the COMPLETION_DRIVE tag
3. Archive plans to docs/completion_drive_plans/archive/[date]/
4. Generate final Completion Drive Report

### Step 8: Generate Final Report

```markdown
═══════════════════════════════════════
COMPLETION DRIVE REPORT
═══════════════════════════════════════

Planning Phase:
  PLAN_UNCERTAINTY tags created: [count from all domain plans]
  ✅ Resolved by synthesis: [count from SYNTHESIZED_PLAN.md]
  ⚠️  Carried to implementation: [count from SYNTHESIZED_PLAN.md]

Implementation Phase:
  COMPLETION_DRIVE tags created: [count from implementation-log.md]
  ✅ Correct assumptions: [count from verification-report.md]
  ❌ Incorrect assumptions: [count from verification-report.md]

Final Status:
  🧹 All tags cleaned: [✅/❌]
  📊 Accuracy rate: [correct / total * 100]%

Learning:
  [List patterns from failed assumptions]
  [List successful assumption resolution strategies]
═══════════════════════════════════════
```

---

## Integration with Response Awareness

This command extends our Response Awareness methodology:

**Original Response Awareness (3 phases):**
1. Implementation with meta-cognitive tags
2. Verification by search-mode agent
3. Quality validation

**Completion Drive (5 phases):**
1. **Domain planning with PLAN_UNCERTAINTY tags** (NEW)
2. **Plan synthesis & integration** (NEW)
3. Implementation with COMPLETION_DRIVE tags (enhanced)
4. Verification by search-mode agent (same)
5. Process cleanup (NEW)

**Key Enhancement:** Two-tier assumption control catches uncertainties BEFORE implementation, reducing COMPLETION_DRIVE tag count and improving accuracy.

---

## When to Use This Command

**Use /completion-drive when:**
- You feel uncertain about file/component locations mid-generation
- You wish you'd committed to a different approach partway through
- Task involves multiple domains (frontend + backend, iOS + API, etc.)
- You're making assumptions that feel risky
- Task is complex enough that planning would help but you want to maintain flow

**DON'T use /completion-drive for:**
- Simple single-file edits
- Tasks where you have complete certainty
- Pure research/exploration tasks
- Tasks that don't involve code generation

---

## Files Created by This Workflow

```
docs/completion_drive_plans/
├── frontend-plan.md          # Domain-specific plans
├── backend-plan.md
├── ios-plan.md
├── SYNTHESIZED_PLAN.md       # Integrated blueprint
└── archive/
    └── 2025-10-23/           # Archived plans post-completion
        ├── frontend-plan.md
        ├── backend-plan.md
        └── SYNTHESIZED_PLAN.md

.orchestration/
├── implementation-log.md      # COMPLETION_DRIVE tags
└── verification-report.md     # Verification results
```

---

## Success Criteria

A successful /completion-drive session achieves:

✅ All PLAN_UNCERTAINTY tags either resolved or explicitly carried forward
✅ All COMPLETION_DRIVE tags verified (>95% accuracy)
✅ Zero tags remaining in final code
✅ Clear documentation of assumption resolutions
✅ Reduced cognitive load through plan synthesis
✅ Maintained flow state throughout implementation

---

## Notes

- **Plan synthesis is critical** - don't skip it
- **Parallel planning saves time** - deploy all domain agents at once
- **Tag cleanup is mandatory** - tags are scaffolding, not documentation
- **Accuracy matters more than speed** - verification catches mistakes early
- **Archive plans for learning** - patterns emerge over time
