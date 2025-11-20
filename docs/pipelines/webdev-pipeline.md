# Webdev Domain Pipeline

**Status:** OS 2.0 Core Pipeline
**Last Updated:** 2025-11-19

## Overview

The webdev pipeline handles all frontend/web development work with strict context awareness, design system enforcement, and quality gates.

**Core Principles:**
1. Context is MANDATORY - No work without ContextBundle
2. Design-DNA is law - No inline styles, only tokens
3. Edit, never rewrite - Respect existing code
4. Gates are strict - Must pass ≥90 scores
5. Maximum 2 implementation passes

---

## Pipeline Architecture

```
Request
    ↓
[Phase 1: Context Query] ← MANDATORY
    ↓
[Phase 2: Planning & Spec]
    ↓
[GATE: Customization Gate] ← Blocks if needs customization
    ↓
[Phase 3: Analysis]
    ↓
[Phase 4: Implementation - Pass 1]
    ↓
[Phase 5: Gate Checks (Parallel Group)]
  ├─ Standards Enforcement (frontend-standards-enforcer)
  └─ Design QA (frontend-design-reviewer-agent)
      [+ Optional: a11y/perf/security gates]
    ↓
Decision Point:
├─ All required gates ≥ thresholds → [Phase 8: Verification]
└─ Any gate < threshold → [Phase 4b: Implementation - Pass 2] (ONE corrective pass only)
    ↓
[Phase 5b: Gate Re-checks (same parallel group)]
    ↓
[Phase 8: Verification] (Build + Test)
    ↓
[GATE: Build Gate] ← Must succeed
    ↓
[Phase 9: Completion]
```

---

## Phase Definitions

### Phase 1: Context Query (MANDATORY)

**Agent:** ProjectContextServer (MCP tool)

**Input:**
```json
{
  "domain": "webdev",
  "task": "<user request>",
  "projectPath": "<cwd>",
  "maxFiles": 10,
  "includeHistory": true
}
```

**Output:** ContextBundle containing:
- `relevantFiles`: Files semantically related to task
- `projectState`: Current component structure
- `pastDecisions`: Previous frontend decisions
- `relatedStandards`: Webdev standards from vibe.db
- `similarTasks`: Historical frontend task outcomes
- `designSystem`: design-dna.json + design system context

**Success Criteria:**
- ContextBundle received
- ≥3 relevant files found OR project structure loaded
- Design system context loaded (if exists)

**Artifacts:**
- Store ContextBundle in phase_state.json
- Log context query in vibe.db events

---

### Phase 2: Planning & Spec

**Agent:** Requirement Analyst (or Orca direct)

**Input:**
- User request
- ContextBundle from Phase 1

**Tasks:**
1. Understand request scope
2. Identify affected components (from ContextBundle.relevantFiles)
3. Check past decisions for similar work
4. Apply related standards
5. Create minimal spec (if needed for complex work)

**Output:**
- Clear understanding of:
  - What components need editing
  - What design tokens apply
  - What constraints exist (from standards)
  - Estimated complexity (simple/medium/complex)

**Success Criteria:**
- Scope is clear
- Components identified
- No ambiguity requiring user clarification

**Artifacts:**
- Update phase_state.json with planning notes
- Create spec file (only if complex): `.claude/orchestration/specs/YYYY-MM-DD-feature.md`

---

### GATE: Customization Gate

**Purpose:** Block implementation if customization/theming needs are detected

**Checks:**
1. Does request mention "custom colors/fonts/spacing"?
2. Does request require new design tokens?
3. Does request need new component variants?

**If YES to any:**
- BLOCK progression
- Require design system update first
- Update design-dna.json before implementation

**If NO:**
- ALLOW progression to Analysis phase

**Rationale:** Prevent inline styles by catching customization needs early

---

### Phase 3: Analysis

**Agent:** frontend-layout-analyzer

**Input:**
- User request
- ContextBundle
- Planning output

**Tasks:**
1. Read all relevant files (from ContextBundle.relevantFiles)
2. Analyze component structure and dependencies
3. Identify spacing/layout patterns
4. Map design tokens being used
5. Generate dependency map
6. Create implementation guidance

Optional (for image/mockup-driven work):
- When screenshots or mockups are provided, the `visual-layout-analyzer`
  agent may also be used to produce a `visual_layout_tree`,
  `detected_components` (including bento patterns), and `token_candidates`
  that align with `design-dna.json`. These artifacts can be referenced in
  planning, analysis, and downstream design/implementation phases.

**Output:**
- Dependency map (what affects what)
- Current design token usage
- Root-cause hypotheses for bugs (if bug fix)
- Safe change recommendations

**Success Criteria:**
- All relevant components read
- Dependency map complete
- Clear implementation guidance

**Artifacts:**
- Analysis report: `.claude/orchestration/temp/analysis-TIMESTAMP.md`
- Update phase_state.json with findings

---

### Phase 4: Implementation - Pass 1

**Agent:** frontend-builder-agent

**Input:**
- User request
- ContextBundle
- Analysis report from Phase 3
- Design-DNA from ContextBundle.designSystem

**Constraints (HARD):**
1. **Use design-dna.json tokens exclusively** - No inline styles
2. **Edit existing components** - Never rewrite
3. **Compose with primitives** - Use shadcn/ui + project components
4. **Minimal changes only** - Scope strictly to request
5. **Verification required** - Run lint/typecheck after changes

**Tasks:**
1. Load design-dna.json tokens
2. Read target components (from analysis)
3. Make minimal, safe edits
4. Use only design system tokens/classes
5. Run verification (lint, typecheck)
6. Document what changed and why

**Output:**
- Code changes (via Edit/MultiEdit tools)
- Verification results (lint/typecheck output)
- Change summary

**Success Criteria:**
- Files edited (not rewritten)
- Lint passes
- Typecheck passes
- Only design system tokens used

**Artifacts:**
- Modified files (tracked via git)
- Implementation log: `.claude/orchestration/temp/implementation-TIMESTAMP.md`
- Update phase_state.json: files_modified, changes_summary

**Limits:**
- Maximum 2 files edited (for simple tasks)
- Maximum 5 files edited (for medium tasks)
- Maximum 10 files edited (for complex tasks)

---

### Phase 5: Gate Checks (Standards & Design QA – Parallel Group)

After Implementation Pass 1, the pipeline runs code-level standards and visual
design checks as a **parallel gate group**. All gates read from the same
ContextBundle and modified files; they do not modify code.

#### 5a. Standards Enforcement

**Agent:** frontend-standards-enforcer

**Input:**
- Files modified in Phase 4
- ContextBundle.relatedStandards
- design-dna.json

**Tasks:**
1. Read all modified files
2. Check for standards violations:
   - Inline styles (FORBIDDEN)
   - Non-token values (FORBIDDEN)
   - Component rewrites (FORBIDDEN)
   - Spacing not from scale (FORBIDDEN)
   - Typography not from scale (FORBIDDEN)
3. Check design-dna cardinal rules
4. Compute Standards Score (0-100)
5. Generate violations report

**Scoring:**
- Start at 100
- -20 per inline style
- -15 per non-token value
- -30 per component rewrite
- -10 per spacing violation
- -10 per typography violation
- -5 per other violation

**Output:**
- Standards Score (0-100)
- Gate label: PASS (≥90), CAUTION (70-89), FAIL (<70)
- Violations list with locations and fixes

**Success Criteria:**
- All modified files checked
- Score calculated
- Violations documented

**Artifacts:**
- Standards report: `.claude/orchestration/evidence/standards-TIMESTAMP.md`
- Update phase_state.json: standards_score, violations

#### 5b. Design QA

**Agent:** frontend-design-reviewer-agent

**Input:**
- Files modified in Phase 4
- ContextBundle.designSystem
- design-dna.json

**Tasks:**
1. Analyze visual implementation
2. Check design system compliance:
   - Spacing follows scale
   - Typography follows scale
   - Colors are from palette
   - Components use proper variants
3. Check optical alignment (not just geometric)
4. Check responsive behavior (if applicable)
5. Compute Design QA Score (0-100)
6. Generate visual issues report

**Scoring:**
- Start at 100
- -15 per spacing hierarchy issue
- -10 per typography hierarchy issue
- -20 per color palette violation
- -10 per optical alignment issue
- -5 per responsive issue

**Output:**
- Design QA Score (0-100)
- Gate label: PASS (≥90), CAUTION (70-89), FAIL (<70)
- Visual issues list with locations and fixes

**Success Criteria:**
- Visual analysis complete
- Score calculated
- Issues documented

**Artifacts:**
- Design QA report: `.claude/orchestration/evidence/design-qa-TIMESTAMP.md`
- Update phase_state.json: design_qa_score, visual_issues

---

### GATE: Standards Gate

**Threshold:** Standards Score ≥ 90

**If PASS:**
- Proceed to Design QA Gate check

**If FAIL:**
- If this is Pass 1 → Allow ONE corrective implementation pass (Phase 4b)
- If this is Pass 2 → Block and report "Standards not met after 2 passes"
- Record violations in vibe.db as standards
- Update phase_state.json: gates_failed

---

### GATE: Design QA Gate

**Threshold:** Design QA Score ≥ 90

**If PASS (and Standards Gate also passed):**
- Proceed to Verification phase

**If FAIL:**
- If this is Pass 1 → Allow ONE corrective implementation pass (Phase 4b)
- If this is Pass 2 → Block and report "Design QA not met after 2 passes"
- Record issues in vibe.db as standards
- Update phase_state.json: gates_failed

---

### Phase 4b: Implementation - Pass 2 (Corrective)

**Agent:** frontend-builder-agent

**Input:**
- Original request
- ContextBundle
- Standards violations from Phase 5
- Design QA issues from Phase 6

**Constraints:**
- ALL constraints from Phase 4 still apply
- **FOCUS ONLY on fixing violations/issues**
- Do NOT expand scope
- Do NOT introduce new changes

**Tasks:**
1. Read violations and issues
2. Fix each violation systematically
3. Fix each design issue systematically
4. Run verification (lint, typecheck)
5. Document fixes

**Output:**
- Code fixes (via Edit tools)
- Verification results
- Fixes summary

**Success Criteria:**
- All violations addressed
- All design issues addressed
- Lint passes
- Typecheck passes

**Artifacts:**
- Modified files (tracked via git)
- Fixes log: `.claude/orchestration/temp/fixes-TIMESTAMP.md`
- Update phase_state.json: corrective_pass_complete

**This is the FINAL implementation pass. No third pass allowed.**

---

### Phase 5b & 6b: Re-validation

**Agents:** frontend-standards-enforcer + frontend-design-reviewer-agent

**Process:** Same as Phase 5 & 6, but after corrective pass

**Gate Thresholds:** Same (≥90)

**If gates still fail:**
- Do NOT loop again
- Report final scores
- Mark work as "Completed with caveats" or "Standards not met"
- Save all violations as new standards in vibe.db
- Allow user to decide next steps

---

### Phase 8: Verification (Build + Test)

**Agent:** Orca (direct) or verification-agent

**Input:**
- All modified files
- ContextBundle

**Tasks:**
1. Run build: `npm run build` (or project equivalent)
2. Capture build output
3. Run tests (if they exist): `npm test`
4. Capture test output
5. Check for warnings/errors

**Output:**
- Build status (success/failure)
- Build output
- Test results (if run)

**Success Criteria:**
- Build succeeds with no errors
- Tests pass (if run)
- No new warnings introduced

**Artifacts:**
- Build log: `.claude/orchestration/evidence/build-TIMESTAMP.log`
- Test results: `.claude/orchestration/evidence/test-TIMESTAMP.log`
- Update phase_state.json: build_status, test_status

---

### GATE: Build Gate

**Threshold:** Build must succeed (exit code 0)

**If PASS:**
- Proceed to Completion

**If FAIL:**
- Block completion
- Report build errors
- Require manual fix (beyond pipeline scope)
- Update phase_state.json: gates_failed

---

### Phase 9: Completion

**Agent:** Orca (direct)

**Tasks:**
1. Verify all gates passed
2. Collect all artifacts
3. Save task history to vibe.db
4. Update phase_state.json to "completed"
5. Generate final summary

**Task History Record:**
```json
{
  "domain": "webdev",
  "task": "<original request>",
  "outcome": "success" | "partial" | "failure",
  "learnings": "Standards scores: X, Design QA scores: Y, Build: pass",
  "files_modified": ["list", "of", "files"]
}
```

**Final Summary Format:**
```markdown
## Webdev Pipeline Complete

**Request:** <original request>

**Outcome:** Success / Partial / Failure

**Phases:**
- ✅ Context Query: X relevant files, Y standards
- ✅ Planning: Z components identified
- ✅ Analysis: Dependency map created
- ✅ Implementation Pass 1: A files modified
- ✅ Standards Enforcement: Score 95 (PASS)
- ✅ Design QA: Score 92 (PASS)
- [✅/❌] Implementation Pass 2: B files fixed
- [✅/❌] Re-validation: Scores X/Y
- ✅ Verification: Build passed, tests passed
- ✅ Completion: Task recorded

**Gates Passed:**
- ✅ Customization Gate
- ✅ Standards Gate (Score: 95)
- ✅ Design QA Gate (Score: 92)
- ✅ Build Gate

**Files Modified:**
- path/to/component1.tsx
- path/to/component2.tsx

**Artifacts:**
- Analysis: .claude/orchestration/temp/analysis-TIMESTAMP.md
- Standards Report: .claude/orchestration/evidence/standards-TIMESTAMP.md
- Design QA Report: .claude/orchestration/evidence/design-qa-TIMESTAMP.md
- Build Log: .claude/orchestration/evidence/build-TIMESTAMP.log

**Next Steps:**
- [Optional follow-up items if partial success]
```

---

## Constraint Framework

Every agent in this pipeline MUST adhere to these constraints:

### Required Context

```yaml
required_context:
  - ContextBundle from ProjectContextServer
  - design-dna.json (if exists)
  - Related standards from vibe.db
  - Past decisions for this domain
```

### Forbidden Operations

```yaml
forbidden_operations:
  - inline_styles: "Use design-dna.json tokens only"
  - component_rewrites: "Edit existing components, never rewrite"
  - arbitrary_values: "All values must come from design system"
  - scope_expansion: "Strictly implement requested changes only"
  - third_pass: "Maximum 2 implementation passes allowed"
```

### Verification Required

```yaml
verification_required:
  - lint_check: "Run before claiming done"
  - typecheck: "Run before claiming done"
  - standards_audit: "Via frontend-standards-enforcer"
  - design_qa: "Via frontend-design-reviewer-agent"
  - build: "Must succeed to complete"
```

---

## Configuration

### Default Stack Assumption

```yaml
stack:
  framework: "Next.js App Router"
  language: "TypeScript"
  styling: "Tailwind CSS"
  components: "shadcn/ui"
  design_system: "design-dna.json"
```

### File Limits

```yaml
file_limits:
  simple_task:
    max_files_edited: 2
  medium_task:
    max_files_edited: 5
  complex_task:
    max_files_edited: 10
```

### Gate Thresholds

```yaml
gate_thresholds:
  standards_score: 90
  design_qa_score: 90
  build_status: "success"
  test_status: "success"  # if tests exist
```

### Implementation Pass Limits

```yaml
implementation:
  max_passes: 2
  pass_1: "Initial implementation"
  pass_2: "Corrective only (if gates fail)"
  pass_3: "FORBIDDEN - Never allowed"
```

---

## Integration with Other Systems

### ProjectContextServer

Every pipeline execution starts with:
```typescript
const contextBundle = await queryContext({
  domain: 'webdev',
  task: request,
  projectPath: cwd,
  maxFiles: 10,
  includeHistory: true
});
```

### vibe.db (Memory Store)

Pipeline records:
1. **Decisions:** When novel architectural choices are made
2. **Standards:** When new violations are discovered
3. **Task History:** At completion, with outcome and learnings
4. **Events:** At each phase transition

### phase_state.json

Pipeline maintains:
```json
{
  "domain": "webdev",
  "request": "...",
  "current_phase": "implementation",
  "phases": {
    "context_query": { "status": "completed", "context_bundle_id": "..." },
    "planning": { "status": "completed" },
    "analysis": { "status": "completed" },
    "implementation_pass_1": { "status": "completed", "files_modified": [...] },
    "standards_enforcement": { "status": "completed", "score": 95 },
    "design_qa": { "status": "completed", "score": 92 },
    "verification": { "status": "in_progress" }
  },
  "gates_passed": ["customization_gate", "standards_gate", "design_qa_gate"],
  "gates_failed": [],
  "artifacts": [
    ".claude/orchestration/evidence/standards-20251119.md",
    ".claude/orchestration/evidence/design-qa-20251119.md"
  ]
}
```

---

## Success Metrics

Track over time (via vibe.db task_history):

1. **Gate Pass Rate:**
   - Standards Gate first-pass: Target ≥70%
   - Design QA Gate first-pass: Target ≥70%
   - Build Gate: Target 100%

2. **Implementation Efficiency:**
   - Single-pass success rate: Target ≥60%
   - Two-pass success rate: Target ≥95%

3. **Standards Compliance:**
   - Zero inline styles: Target 100%
   - Zero non-token values: Target 100%
   - Zero component rewrites: Target 100%

4. **Build Success:**
   - Clean builds: Target 100%
   - Zero new warnings: Target ≥90%

---

## Pipeline Evolution

As the pipeline runs, it learns:

1. **New Standards:** Violations → Standards in vibe.db
2. **Common Patterns:** Task history reveals recurring work
3. **Gate Calibration:** Adjust thresholds if too strict/loose
4. **Agent Performance:** Track which agents need improvement

**Review quarterly:** Analyze task_history to improve pipeline phases, gates, and constraints.

---

## Example Execution

**Request:** "Fix spacing on the pricing card component"

**Phase 1:** Context Query
- Finds: pricing-card.tsx, design-dna.json, 3 past pricing decisions
- Standards: "Use 8px spacing scale", "Mobile spacing increases 1.5x"

**Phase 2:** Planning
- Component: src/components/pricing-card.tsx
- Tokens: spacing.sm, spacing.md (from design-dna.json)
- Complexity: Simple (1 component)

**GATE:** Customization
- No custom colors/fonts/spacing requested → PASS

**Phase 3:** Analysis
- Current spacing: Uses hardcoded values (violation!)
- Dependencies: Imported by pricing-page.tsx
- Recommendation: Replace with spacing tokens

**Phase 4:** Implementation Pass 1
- Edit: Replace `padding: 12px` with `className="p-sm"`
- Edit: Replace `gap: 16px` with `className="gap-md"`
- Verify: Lint passes, typecheck passes

**Phase 5:** Standards Enforcement
- Check: No inline styles ✅
- Check: All values from tokens ✅
- Check: No rewrites ✅
- Score: 100 (PASS)

**Phase 6:** Design QA
- Check: Spacing hierarchy correct ✅
- Check: Mobile spacing increased ✅
- Check: Optical alignment good ✅
- Score: 95 (PASS)

**GATES:** Both ≥90 → Skip Pass 2, proceed to verification

**Phase 8:** Verification
- Build: Success ✅
- Tests: 0 tests (none exist)

**GATE:** Build → PASS

**Phase 9:** Completion
- Task history saved
- Summary generated
- Clean exit

**Result:** Success in 1 pass, both gates passed first try ✅

---

_Last updated: 2025-11-19_
_Version: 2.0.0_
