# Constraint Framework

**Version:** 2.0.0
**Last Updated:** 2025-11-19

## Overview

The Constraint Framework is OS 2.0's solution to v1's chaos problem. Instead of agents that "can do anything," every agent has explicit constraints defined as configuration.

**Core Principle:** Constraints are first-class, documented, and enforced - not buried in prompts.

---

## Why Constraints?

### Problem (v1)

Agents had no explicit boundaries:
- Could create unlimited files
- Could rewrite entire components
- Could use inline styles freely
- Could ignore design systems
- Could bypass quality checks
- Could expand scope arbitrarily

**Result:** Chaos, inconsistency, violations of core principles

### Solution (v2)

Every agent has three constraint sections:
1. **required_context** - What the agent MUST have before working
2. **forbidden_operations** - What the agent CANNOT do
3. **verification_required** - What the agent MUST check before claiming done

**Result:** Clear boundaries, predictable behavior, enforced standards

---

## Constraint Schema

### Standard YAML Format

```yaml
# Agent: <agent-name>
# Domain: <domain>
# Purpose: <one-line description>

constraints:
  required_context:
    # What agent needs before it can work
    - context_type: <type>
      source: <where it comes from>
      validation: <how to verify it's loaded>
      failure_mode: <what happens if missing>

  forbidden_operations:
    # What agent must never do
    - operation: <what's forbidden>
      rationale: <why it's forbidden>
      enforcement: <how it's enforced>
      violation_severity: <low|medium|high|critical>

  verification_required:
    # What agent must check before claiming done
    - check: <what to verify>
      method: <how to verify>
      threshold: <pass criteria>
      on_failure: <what happens if fails>

  file_limits:
    # How many files agent can create/modify
    simple_task: <number>
    medium_task: <number>
    complex_task: <number>
    hard_cap: <absolute maximum>

  scope_boundaries:
    # What agent is allowed to work on
    - allowed: <what's in scope>
      forbidden: <what's out of scope>
      ambiguous: <how to handle unclear cases>
```

### Minimal Example

```yaml
constraints:
  required_context:
    - ContextBundle from ProjectContextServer
    - design-dna.json (for webdev)
    - Related standards from vibe.db

  forbidden_operations:
    - inline_styles: "Use design-dna.json tokens only"
    - component_rewrites: "Edit existing, never rewrite"
    - scope_expansion: "Implement requested changes only"

  verification_required:
    - lint_check: "Must pass before claiming done"
    - build: "Must succeed before completion"
```

---

## Constraint Categories

### 1. Required Context

**Purpose:** Ensure agent has necessary information before working

**Format:**
```yaml
required_context:
  - context_type: "ContextBundle"
    source: "ProjectContextServer via query_context"
    validation: "Check contextBundle.relevantFiles.length > 0"
    failure_mode: "Block execution, require context query first"

  - context_type: "Design System"
    source: "design-dna.json from ContextBundle.designSystem"
    validation: "Check designSystem.tokens exists"
    failure_mode: "Warn if missing, proceed with caution"

  - context_type: "Related Standards"
    source: "vibe.db via ContextBundle.relatedStandards"
    validation: "Load standards for this domain"
    failure_mode: "Continue but log missing standards"
```

**Common Context Types:**
- `ContextBundle` - From ProjectContextServer (MANDATORY for all agents)
- `Design System` - design-dna.json, design tokens
- `Related Standards` - Domain-specific rules from vibe.db
- `Past Decisions` - Why things are this way
- `Similar Tasks` - Historical outcomes
- `Project State` - Current component structure
- `Dependencies` - What affects what

**Enforcement:**
- Pipeline checks for required context before agent dispatch
- Agent verifies context at startup
- Missing context blocks execution or downgrades capability

### 2. Forbidden Operations

**Purpose:** Explicitly ban operations that violate core principles

**Format:**
```yaml
forbidden_operations:
  - operation: "inline_styles"
    rationale: "Violates design system, creates inconsistency"
    enforcement: "Standards enforcer audits all modified files"
    violation_severity: "high"
    violation_action: "Block gate passage, save as standard"

  - operation: "component_rewrites"
    rationale: "Loses git history, creates review burden"
    enforcement: "Diff analysis checks for complete file replacements"
    violation_severity: "critical"
    violation_action: "Reject changes, require edit-only approach"

  - operation: "arbitrary_values"
    rationale: "Values must come from design system"
    enforcement: "Token usage validator checks all CSS/styles"
    violation_severity: "high"
    violation_action: "Standards gate fails, require token usage"

  - operation: "scope_expansion"
    rationale: "Agents must implement requested changes only"
    enforcement: "Change scope analyzer compares intent vs execution"
    violation_severity: "medium"
    violation_action: "Flag expansion, require justification"

  - operation: "third_implementation_pass"
    rationale: "Max 2 passes allowed (initial + corrective)"
    enforcement: "Phase state tracks implementation pass count"
    violation_severity: "critical"
    violation_action: "Hard block, report completion state"
```

**Common Forbidden Operations:**

**Webdev Domain:**
- `inline_styles` - Use design system tokens
- `component_rewrites` - Edit existing components
- `arbitrary_values` - All values from design system
- `scope_expansion` - Requested changes only
- `magic_numbers` - No hardcoded values
- `css_in_js_literals` - Use design tokens
- `third_pass` - Max 2 implementation passes

**iOS Domain:**
- `uikit_usage` - SwiftUI only
- `force_unwrapping` - Use proper optionals
- `legacy_patterns` - Modern Swift concurrency only
- `storyboards` - SwiftUI only
- `objective_c_bridges` - Pure Swift

**Data Domain:**
- `untraced_metrics` - Every number traces to source
- `assumptions_without_data` - Data-driven only
- `causality_without_evidence` - Require proof
- `incomplete_verification` - All claims verified

**Severity Levels:**
- `critical` - Blocks immediately, requires manual intervention
- `high` - Fails quality gate, requires correction
- `medium` - Warning, requires justification
- `low` - Logged for review, non-blocking

### 3. Verification Required

**Purpose:** Define what agent must check before claiming completion

**Format:**
```yaml
verification_required:
  - check: "lint_check"
    method: "Run `npm run lint` or equivalent"
    threshold: "Exit code 0, no errors"
    on_failure: "Fix all lint errors before claiming done"

  - check: "typecheck"
    method: "Run `tsc --noEmit` or equivalent"
    threshold: "Exit code 0, no type errors"
    on_failure: "Fix all type errors before claiming done"

  - check: "build"
    method: "Run `npm run build` or equivalent"
    threshold: "Exit code 0, successful build"
    on_failure: "Fix build errors before claiming done"

  - check: "standards_audit"
    method: "Run frontend-standards-enforcer agent"
    threshold: "Score ≥ 90"
    on_failure: "Fix violations or accept score with justification"

  - check: "design_qa"
    method: "Run frontend-design-reviewer-agent"
    threshold: "Score ≥ 90"
    on_failure: "Fix visual issues or accept score with justification"

  - check: "test_suite"
    method: "Run `npm test` if tests exist"
    threshold: "All tests pass"
    on_failure: "Fix failing tests or document known failures"
```

**Common Verification Checks:**

**Code Quality:**
- `lint_check` - Linting passes
- `typecheck` - Type checking passes
- `build` - Build succeeds
- `test_suite` - Tests pass

**Standards Compliance:**
- `standards_audit` - Standards score ≥ threshold
- `design_qa` - Design score ≥ threshold
- `token_usage` - All values from design system
- `dependency_check` - No new dependencies without approval

**Functional:**
- `smoke_test` - Basic functionality works
- `regression_check` - Existing features still work
- `performance_check` - No significant regressions

**Documentation:**
- `change_summary` - What changed and why
- `artifact_creation` - Required files created
- `decision_logging` - Decisions recorded in vibe.db

### 4. File Limits

**Purpose:** Prevent file creation chaos

**Format:**
```yaml
file_limits:
  simple_task: 2        # Edit 1-2 files max
  medium_task: 5        # Edit 3-5 files max
  complex_task: 10      # Edit 6-10 files max
  hard_cap: 15          # Absolute maximum regardless of complexity
```

**Enforcement:**
- Agent tags all file operations: `#FILE_CREATED`, `#FILE_MODIFIED`, `#FILE_DELETED`
- Orchestrator tracks total file count
- Warnings at thresholds
- Hard block at hard_cap

**Rationale:**
- Prevents sprawling changes
- Keeps work focused
- Easier to review
- Reduces merge conflicts

### 5. Scope Boundaries

**Purpose:** Define what agent is allowed to work on

**Format:**
```yaml
scope_boundaries:
  - allowed: "Edit components related to user request"
    forbidden: "Modify unrelated components"
    ambiguous: "Ask user if component relevance unclear"

  - allowed: "Use existing design tokens from design-dna.json"
    forbidden: "Create new design tokens without design system update"
    ambiguous: "Propose new tokens, get approval before using"

  - allowed: "Fix bugs in requested feature"
    forbidden: "Refactor unrelated code"
    ambiguous: "Note refactoring opportunity, don't implement"
```

**Common Scope Rules:**
- Implement requested changes only
- Don't refactor unrelated code
- Don't add features not requested
- Don't modify build configuration without approval
- Don't update dependencies without approval
- Don't change project structure without approval

---

## Constraint Application

### How Constraints are Used

**1. At Agent Creation:**
```markdown
# Agent: frontend-builder-agent

## Constraints

{constraint YAML here}

## Implementation

[Agent methodology that respects constraints]
```

**2. At Pipeline Dispatch:**
```typescript
Task({
  subagent_type: "frontend-builder-agent",
  prompt: `
    Follow frontend-builder-agent.md methodology.

    Constraints are enforced:
    - Required Context: ContextBundle loaded (verified)
    - Forbidden: inline styles, rewrites, scope expansion
    - Verification: lint, typecheck, build before claiming done
    - File Limit: Max 5 files for this medium task

    Task: ${request}
  `
});
```

**3. At Quality Gates:**
```typescript
// Standards Gate checks forbidden operations
const violations = await checkForbiddenOperations({
  modifiedFiles: filesModified,
  constraints: agent.constraints.forbidden_operations
});

if (violations.length > 0) {
  // Save as standards
  for (const violation of violations) {
    await saveStandard({
      what_happened: violation.operation,
      cost: violation.impact,
      rule: violation.rationale,
      domain: agent.domain
    });
  }

  // Fail gate
  return { score: 0, gate: 'FAIL', violations };
}
```

**4. At Completion:**
```typescript
// Verify all required checks completed
const verificationResults = await runVerificationChecks(
  agent.constraints.verification_required
);

if (!allPassed(verificationResults)) {
  return {
    status: 'incomplete',
    message: 'Required verification checks failed',
    results: verificationResults
  };
}
```

---

## Example: Frontend Builder Agent Constraints

Complete constraint specification for reference implementation:

```yaml
# Agent: frontend-builder-agent
# Domain: webdev
# Purpose: Implement frontend UI/UX changes with design system compliance

constraints:
  required_context:
    - context_type: "ContextBundle"
      source: "ProjectContextServer via query_context"
      validation: "contextBundle.relevantFiles.length > 0"
      failure_mode: "Block execution - context is mandatory"

    - context_type: "Design System"
      source: "design-dna.json via contextBundle.designSystem"
      validation: "designSystem.tokens !== undefined"
      failure_mode: "Warn and proceed (legacy projects may not have)"

    - context_type: "Related Standards"
      source: "vibe.db via contextBundle.relatedStandards"
      validation: "Load all webdev standards"
      failure_mode: "Continue but log missing standards"

    - context_type: "Past Decisions"
      source: "vibe.db via contextBundle.pastDecisions"
      validation: "Load decisions related to components being modified"
      failure_mode: "Continue but may repeat past mistakes"

  forbidden_operations:
    - operation: "inline_styles"
      rationale: "Violates design system, creates inconsistency"
      enforcement: "frontend-standards-enforcer audits all styles"
      violation_severity: "high"
      violation_action: "Standards gate fails, require token usage"

    - operation: "component_rewrites"
      rationale: "Loses git history, hard to review, violates edit-only principle"
      enforcement: "Diff analysis checks for >80% line changes in single file"
      violation_severity: "critical"
      violation_action: "Reject changes, require incremental edits"

    - operation: "arbitrary_values"
      rationale: "All spacing/colors/typography must come from design system"
      enforcement: "Token validator checks all CSS properties"
      violation_severity: "high"
      violation_action: "Standards gate fails, require design tokens"

    - operation: "scope_expansion"
      rationale: "Implement requested changes only, no extra features"
      enforcement: "Change scope analyzer compares request vs implementation"
      violation_severity: "medium"
      violation_action: "Flag for review, require justification"

    - operation: "magic_numbers"
      rationale: "No hardcoded values, use design system constants"
      enforcement: "Static analysis checks for numeric literals in styles"
      violation_severity: "medium"
      violation_action: "Standards gate caution, prefer tokens"

    - operation: "third_implementation_pass"
      rationale: "Maximum 2 passes allowed (initial + corrective)"
      enforcement: "phase_state.json tracks implementation_pass_count"
      violation_severity: "critical"
      violation_action: "Hard block, report final state"

  verification_required:
    - check: "lint_check"
      method: "npm run lint"
      threshold: "Exit code 0"
      on_failure: "Fix lint errors before claiming done"

    - check: "typecheck"
      method: "tsc --noEmit"
      threshold: "Exit code 0"
      on_failure: "Fix type errors before claiming done"

    - check: "build"
      method: "npm run build"
      threshold: "Exit code 0"
      on_failure: "Fix build errors before completion"

    - check: "standards_audit"
      method: "frontend-standards-enforcer agent"
      threshold: "Score ≥ 90"
      on_failure: "Fix violations or proceed to corrective pass"

    - check: "design_qa"
      method: "frontend-design-reviewer-agent"
      threshold: "Score ≥ 90"
      on_failure: "Fix visual issues or proceed to corrective pass"

  file_limits:
    simple_task: 2        # 1-2 component edits
    medium_task: 5        # 3-5 component edits
    complex_task: 10      # 6-10 component edits
    hard_cap: 15          # Absolute maximum

  scope_boundaries:
    - allowed: "Edit components identified in analysis phase"
      forbidden: "Modify unrelated components"
      ambiguous: "Ask orchestrator if component relevance unclear"

    - allowed: "Use existing design tokens from design-dna.json"
      forbidden: "Create new design tokens inline"
      ambiguous: "Propose new tokens to design system, get approval"

    - allowed: "Fix bugs in implemented feature"
      forbidden: "Refactor unrelated code"
      ambiguous: "Note refactoring opportunity for future"

    - allowed: "Update related tests for changed behavior"
      forbidden: "Rewrite entire test suite"
      ambiguous: "Propose test improvements for future"
```

---

## Constraint Enforcement

### Automated Enforcement

**1. Pre-Execution (Pipeline):**
- Verify required context loaded
- Check agent has necessary permissions
- Validate prerequisites met

**2. During Execution (Agent):**
- Tag all file operations
- Track file count against limits
- Self-check against forbidden operations

**3. Post-Execution (Quality Gates):**
- Run verification checks
- Audit for forbidden operations
- Calculate scores
- Block progression if gates fail

**4. Completion (Orchestrator):**
- Verify all checks passed
- Record violations as standards
- Update phase_state.json
- Save task history

### Manual Enforcement

**Code Review:**
- Reviewer checks constraint compliance
- Violations noted and addressed
- Pattern violations saved as standards

**Orchestrator Oversight:**
- Monitors file creation counts
- Watches for scope expansion
- Intervenes if limits exceeded

**User Override:**
- User can approve constraint violations
- Requires explicit justification
- Logged for future analysis

---

## Constraint Evolution

### Adding New Constraints

**Process:**
1. Identify recurring violation or failure pattern
2. Document what happened and cost
3. Define constraint to prevent recurrence
4. Add to agent specification
5. Update quality gates to enforce
6. Save to vibe.db as standard

**Example Flow:**
```
Violation: Agent created 20 new files for simple button change
Cost: 2 hours of cleanup, review burden
Constraint: file_limits.simple_task = 2
Enforcement: Orchestrator hard blocks at limit
Standard: "Simple tasks: max 2 file edits"
```

### Relaxing Constraints

**When to Consider:**
- Constraint blocks legitimate work repeatedly
- False positive rate >20%
- User frequently overrides

**Process:**
1. Analyze violation patterns
2. Determine if constraint too strict
3. Propose relaxation with justification
4. Update threshold or severity
5. Monitor impact over time
6. Revert if problems increase

---

## Constraint Templates

### Template: New Agent Constraints

```yaml
# Agent: <agent-name>
# Domain: <domain>
# Purpose: <one-line description>

constraints:
  required_context:
    - context_type: "ContextBundle"
      source: "ProjectContextServer"
      validation: "<how to verify>"
      failure_mode: "Block execution"

    # Add domain-specific context requirements

  forbidden_operations:
    # Start with domain defaults, add agent-specific
    - operation: "scope_expansion"
      rationale: "Implement requested changes only"
      enforcement: "<how it's checked>"
      violation_severity: "medium"
      violation_action: "<what happens>"

    # Add more as needed

  verification_required:
    # Standard checks
    - check: "lint_check"
      method: "<command>"
      threshold: "Pass"
      on_failure: "Fix before done"

    # Add domain/agent-specific checks

  file_limits:
    simple_task: <number>
    medium_task: <number>
    complex_task: <number>
    hard_cap: <max>

  scope_boundaries:
    - allowed: "<what's in scope>"
      forbidden: "<what's out of scope>"
      ambiguous: "<how to handle unclear>"
```

### Template: Domain Defaults

**Webdev Domain:**
```yaml
webdev_defaults:
  forbidden_operations:
    - inline_styles
    - component_rewrites
    - arbitrary_values
    - magic_numbers

  verification_required:
    - lint_check
    - typecheck
    - build
    - standards_audit (≥90)
    - design_qa (≥90)

  file_limits:
    simple: 2
    medium: 5
    complex: 10
```

**iOS Domain:**
```yaml
ios_defaults:
  forbidden_operations:
    - uikit_usage
    - force_unwrapping
    - legacy_patterns
    - storyboards

  verification_required:
    - swift_lint
    - build
    - unit_tests
    - ui_tests

  file_limits:
    simple: 3
    medium: 7
    complex: 12
```

**Data Domain:**
```yaml
data_defaults:
  forbidden_operations:
    - untraced_metrics
    - assumptions_without_data
    - causality_without_evidence

  verification_required:
    - data_quality_check
    - metric_verification
    - source_tracing

  file_limits:
    simple: 2
    medium: 4
    complex: 8
```

---

## Integration with vibe.db

### Storing Constraint Violations

```sql
-- When constraint violated, save as standard
INSERT INTO standards (
  what_happened,
  cost,
  rule,
  domain,
  created
) VALUES (
  'inline styles used in Button.tsx',
  '30 minutes to fix in standards audit',
  'Use design-dna.json tokens only - no inline styles',
  'webdev',
  CURRENT_TIMESTAMP
);
```

### Auto-Enforcement

```typescript
// Load standards from vibe.db
const standards = await queryStandards('webdev');

// Check current work against standards
for (const standard of standards) {
  if (violatesStandard(modifiedFiles, standard)) {
    // Fail quality gate
    // Increment enforced_count
    // Report violation
  }
}
```

---

## Best Practices

### For Agent Authors

1. **Start with domain defaults** - Don't reinvent constraints
2. **Document rationale** - Why is this forbidden?
3. **Make enforcement clear** - How will it be checked?
4. **Set appropriate severity** - Match impact to consequence
5. **Test constraints** - Verify they catch violations

### For Pipeline Designers

1. **Verify context first** - Check required context before dispatch
2. **Monitor file counts** - Warn early, block at limits
3. **Run quality gates** - Enforce verification requirements
4. **Save violations** - Turn violations into standards
5. **Evolve constraints** - Learn from patterns

### For Orchestrators

1. **Load constraints** - Read agent constraints before dispatch
2. **Pass context** - Ensure agents have required context
3. **Track operations** - Monitor for forbidden operations
4. **Enforce limits** - Hard block at file limits
5. **Record outcomes** - Save what happened to vibe.db

---

## FAQ

**Q: What if agent needs to violate a constraint?**
A: Agent must ask orchestrator/user for approval, provide justification, and log the override.

**Q: Can constraints be disabled?**
A: Not recommended. If constraint blocks legitimate work repeatedly, relax it rather than disable.

**Q: What happens if agent violates critical constraint?**
A: Work is rejected, agent must retry with correct approach, violation saved as standard.

**Q: How are new constraints added?**
A: Identify pattern → Document violation → Define constraint → Update agent → Deploy → Monitor

**Q: Do all agents need all constraint types?**
A: No. Start with required_context and forbidden_operations. Add others as needed.

**Q: Can constraints reference each other?**
A: Yes. Common pattern: "forbidden_operations enforced via verification_required checks"

---

_Constraints make chaos structurally impossible._
