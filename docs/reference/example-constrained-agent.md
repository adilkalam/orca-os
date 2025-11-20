# Example: Constrained Agent Template

**Version:** 2.0.0
**Purpose:** Reference implementation showing constraint framework application

This document demonstrates how to apply the constraint framework to create an agent with explicit boundaries, mandatory context requirements, and enforced quality standards.

---

## Agent Specification

**Agent Name:** example-feature-builder
**Domain:** webdev
**Purpose:** Implement new features in React/Next.js applications with full constraint compliance

---

## Constraints

Following the [Constraint Framework](./constraint-framework.md), this agent has explicit constraints:

```yaml
# Agent: example-feature-builder
# Domain: webdev
# Purpose: Implement new features in React/Next.js with design system compliance

constraints:
  required_context:
    - context_type: "ContextBundle"
      source: "ProjectContextServer via query_context"
      validation: |
        - contextBundle.relevantFiles.length > 0
        - contextBundle.projectState exists
        - contextBundle.relatedStandards loaded
      failure_mode: "BLOCK - Cannot proceed without project context"

    - context_type: "Design System"
      source: "design-dna.json via contextBundle.designSystem"
      validation: |
        - designSystem.tokens exists
        - designSystem.components exists
        - designSystem.spacing scale defined
      failure_mode: "WARN - Proceed with caution if legacy project"

    - context_type: "Feature Specification"
      source: "User request or spec file from .claude/orchestration/specs/"
      validation: |
        - Feature scope is clear
        - Acceptance criteria defined
        - No ambiguity in requirements
      failure_mode: "ASK USER - Clarify requirements before proceeding"

    - context_type: "Related Standards"
      source: "vibe.db via contextBundle.relatedStandards"
      validation: "Load all webdev standards for this project"
      failure_mode: "CONTINUE - Log missing standards as gap"

    - context_type: "Past Decisions"
      source: "vibe.db via contextBundle.pastDecisions"
      validation: "Load decisions related to architecture, patterns, tech choices"
      failure_mode: "CONTINUE - May repeat past decisions without awareness"

  forbidden_operations:
    - operation: "inline_styles"
      rationale: "Violates design system single source of truth principle"
      enforcement: "frontend-standards-enforcer audits all className/style usage"
      violation_severity: "high"
      violation_action: "Standards gate fails, require design token usage"
      examples:
        - ❌ style={{ padding: '16px' }}
        - ✅ className="p-md" (where p-md is design token)

    - operation: "component_rewrites"
      rationale: "Loses git history, hard to review, violates incremental principle"
      enforcement: "Git diff analysis checks for >80% line changes in single file"
      violation_severity: "critical"
      violation_action: "Reject entire change, require edit-only approach"
      examples:
        - ❌ Delete entire component file and rewrite
        - ✅ Edit specific sections of existing component

    - operation: "arbitrary_values"
      rationale: "All spacing, colors, typography must come from design system"
      enforcement: "Token validator scans for hardcoded values in styles"
      violation_severity: "high"
      violation_action: "Standards gate fails at score calculation"
      examples:
        - ❌ margin: 12px (arbitrary)
        - ✅ margin: var(--spacing-sm) (design token)
        - ❌ color: #3B82F6 (hardcoded)
        - ✅ color: var(--color-primary) (design token)

    - operation: "scope_expansion"
      rationale: "Implement requested feature only, no extra features"
      enforcement: "Change analyzer compares request scope vs implementation"
      violation_severity: "medium"
      violation_action: "Flag for review, require justification"
      examples:
        - ❌ Asked for dark mode toggle, also refactored entire theme system
        - ✅ Asked for dark mode toggle, implemented toggle component only

    - operation: "magic_numbers"
      rationale: "No hardcoded numeric values, use named constants"
      enforcement: "Static analysis flags numeric literals in business logic"
      violation_severity: "medium"
      violation_action: "Code review flag, suggest constants"
      examples:
        - ❌ if (items.length > 10) // magic number
        - ✅ if (items.length > MAX_VISIBLE_ITEMS) // named constant

    - operation: "third_implementation_pass"
      rationale: "Maximum 2 implementation passes (initial + corrective)"
      enforcement: "phase_state.json tracks implementation_pass_count"
      violation_severity: "critical"
      violation_action: "Hard block, report final state as-is"

    - operation: "new_dependencies"
      rationale: "Cannot add npm packages without approval"
      enforcement: "package.json diff checked by orchestrator"
      violation_severity: "high"
      violation_action: "Block and request approval for new dependencies"
      examples:
        - ❌ npm install some-library (without approval)
        - ✅ Ask user: "Need lodash for X, approved?"

  verification_required:
    - check: "lint_check"
      method: "npm run lint (or project equivalent)"
      threshold: "Exit code 0, no lint errors"
      on_failure: "Fix all lint errors before claiming done"
      when: "After any code changes"

    - check: "typecheck"
      method: "tsc --noEmit (or project equivalent)"
      threshold: "Exit code 0, no type errors"
      on_failure: "Fix all type errors before claiming done"
      when: "After any TypeScript changes"

    - check: "build"
      method: "npm run build (or project equivalent)"
      threshold: "Exit code 0, successful build"
      on_failure: "Fix build errors, cannot proceed to completion"
      when: "Before marking implementation complete"

    - check: "standards_audit"
      method: "frontend-standards-enforcer agent review"
      threshold: "Score ≥ 90"
      on_failure: |
        - If pass 1: Proceed to corrective pass
        - If pass 2: Report final score, mark as partial
      when: "After implementation pass completes"

    - check: "design_qa"
      method: "frontend-design-reviewer-agent visual review"
      threshold: "Score ≥ 90"
      on_failure: |
        - If pass 1: Proceed to corrective pass
        - If pass 2: Report final score, mark as partial
      when: "After implementation pass completes"

    - check: "test_suite"
      method: "npm test (if tests exist)"
      threshold: "All tests pass, no new failures"
      on_failure: "Fix failing tests or document known failures"
      when: "Before claiming done (if tests exist)"

    - check: "file_tagging"
      method: "Tag all file operations with meta-cognitive tags"
      threshold: |
        - All created files: #FILE_CREATED: path
        - All modified files: #FILE_MODIFIED: path
        - All deleted files: #FILE_DELETED: path
      on_failure: "Cannot track file changes without tags"
      when: "During every file operation"

  file_limits:
    simple_task: 2
      # Definition: Single component change, isolated fix
      # Examples: Add prop, fix styling, update text
      # Typical files: component.tsx, component.test.tsx

    medium_task: 5
      # Definition: Feature spanning 2-3 components
      # Examples: Add form validation, new UI section
      # Typical files: 2-3 components + tests + types

    complex_task: 10
      # Definition: Feature spanning multiple components/pages
      # Examples: New page with multiple components, major refactor
      # Typical files: 5-7 components + tests + types + utils

    hard_cap: 15
      # Absolute maximum regardless of complexity
      # Exceeding this requires splitting into multiple tasks

  scope_boundaries:
    - allowed: "Implement requested feature as specified"
      forbidden: "Add features not requested"
      ambiguous: "If unclear if feature needed, ask user first"

    - allowed: "Edit components identified in analysis phase"
      forbidden: "Modify unrelated components"
      ambiguous: "If component relationship unclear, verify with analysis"

    - allowed: "Use existing design tokens from design-dna.json"
      forbidden: "Create new design tokens inline"
      ambiguous: "Propose new tokens to design system, await approval"

    - allowed: "Fix bugs discovered during implementation"
      forbidden: "Refactor unrelated code 'while we're here'"
      ambiguous: "Note refactoring opportunities for future work"

    - allowed: "Update tests for changed behavior"
      forbidden: "Rewrite entire test suite"
      ambiguous: "Propose test improvements as separate task"
```

---

## Implementation Methodology

### Phase 1: Context Loading

**Before any work:**

```typescript
// 1. Verify ContextBundle received
if (!contextBundle) {
  throw new Error("ContextBundle required - query ProjectContextServer first");
}

// 2. Load design system
const designSystem = contextBundle.designSystem;
if (!designSystem || !designSystem.tokens) {
  console.warn("No design system found - proceeding with caution");
}

// 3. Load standards
const standards = contextBundle.relatedStandards;
console.log(`Loaded ${standards.length} webdev standards to enforce`);

// 4. Load past decisions
const decisions = contextBundle.pastDecisions;
console.log(`Aware of ${decisions.length} past architectural decisions`);

// 5. Verify feature spec clarity
if (requestIsAmbiguous) {
  askUserForClarification();
  // BLOCK until clarity achieved
}
```

### Phase 2: Planning with Constraints

**Plan implementation respecting boundaries:**

```typescript
// 1. Identify scope from request
const scope = parseFeatureRequest(request);

// 2. Estimate complexity
const complexity = estimateComplexity(scope, contextBundle.relevantFiles);
// Returns: 'simple' | 'medium' | 'complex'

// 3. Determine file limit
const fileLimit = constraints.file_limits[complexity + '_task'];
console.log(`Complexity: ${complexity}, File limit: ${fileLimit}`);

// 4. Plan changes within limit
const plannedChanges = planChangesWithinLimit(scope, fileLimit);

// 5. Verify no forbidden operations planned
validateAgainstForbiddenOps(plannedChanges, constraints.forbidden_operations);
```

### Phase 3: Implementation with Tags

**Execute changes with full tracking:**

```typescript
// 1. Read target files (from analysis)
const targetFiles = contextBundle.relevantFiles.slice(0, 3);
for (const file of targetFiles) {
  const content = await readFile(file.path);
  analyzeCurrentImplementation(content);
}

// 2. Make changes (EDIT, never REWRITE)
await editFile({
  path: 'src/components/FeatureCard.tsx',
  changes: [
    {
      find: 'className="card"',
      replace: 'className="card dark:bg-gray-800"' // Using design tokens
    }
  ]
});
console.log('#FILE_MODIFIED: src/components/FeatureCard.tsx');

// 3. Verify design token usage
const usedTokens = extractTokens(modifiedContent);
const allFromDesignSystem = usedTokens.every(token =>
  designSystem.tokens.hasOwnProperty(token)
);

if (!allFromDesignSystem) {
  throw new Error('Non-design-system tokens used - violates constraints');
}

// 4. Track file count
fileCount++;
if (fileCount > fileLimit) {
  throw new Error(`File limit exceeded: ${fileCount} > ${fileLimit}`);
}
```

### Phase 4: Verification

**Run all required checks:**

```typescript
// 1. Lint check
const lintResult = await runCommand('npm run lint');
if (lintResult.exitCode !== 0) {
  throw new Error('Lint failed - fix errors before proceeding');
}
console.log('✓ Lint check passed');

// 2. Type check
const typeCheckResult = await runCommand('tsc --noEmit');
if (typeCheckResult.exitCode !== 0) {
  throw new Error('Type check failed - fix errors before proceeding');
}
console.log('✓ Type check passed');

// 3. Build
const buildResult = await runCommand('npm run build');
if (buildResult.exitCode !== 0) {
  throw new Error('Build failed - cannot complete without successful build');
}
console.log('✓ Build successful');

// 4. Self-audit for forbidden operations
const violations = await selfAuditForbiddenOps(
  modifiedFiles,
  constraints.forbidden_operations
);
if (violations.length > 0) {
  console.warn(`Self-audit found ${violations.length} potential violations`);
  reportViolations(violations);
}
```

### Phase 5: Completion Report

**Document what was done:**

```typescript
const completionReport = {
  feature: request,
  complexity: complexity,
  filesModified: modifiedFiles.map(f => ({
    path: f.path,
    changes: f.changeCount,
    tokensUsed: extractTokens(f.content)
  })),
  constraintsRespected: {
    no_inline_styles: true,
    no_rewrites: true,
    no_arbitrary_values: true,
    within_scope: true,
    within_file_limit: fileCount <= fileLimit
  },
  verificationResults: {
    lint: 'passed',
    typecheck: 'passed',
    build: 'passed',
    standards_score: '<awaiting gate>',
    design_qa_score: '<awaiting gate>'
  },
  nextSteps: [
    'Awaiting standards gate (frontend-standards-enforcer)',
    'Awaiting design QA gate (frontend-design-reviewer-agent)',
    'Will proceed to corrective pass if either gate <90'
  ]
};

return completionReport;
```

---

## Constraint Enforcement Flow

```
┌─────────────────────────────────────────────┐
│ 1. Context Loading (required_context)      │
│    - Verify ContextBundle exists           │
│    - Load design system                    │
│    - Load standards                        │
│    - Verify feature spec clarity           │
│    FAIL → BLOCK execution                  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 2. Planning (scope_boundaries + limits)    │
│    - Determine complexity                  │
│    - Check file limits                     │
│    - Plan within boundaries                │
│    VIOLATES → REPLAN                       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 3. Implementation (forbidden_operations)   │
│    - Make changes (edit only)              │
│    - Use design tokens only                │
│    - Tag all file operations               │
│    - Track file count                      │
│    VIOLATES → STOP and FIX                 │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 4. Verification (verification_required)    │
│    - Run lint                              │
│    - Run typecheck                         │
│    - Run build                             │
│    - Self-audit for violations             │
│    FAIL → FIX before proceeding            │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 5. Quality Gates (external enforcement)    │
│    - Standards enforcer audit              │
│    - Design QA review                      │
│    <90 → Corrective pass                   │
│    ≥90 → Proceed to completion             │
└─────────────────────────────────────────────┘
```

---

## Example: Constraint Violation Handling

### Scenario: Inline Style Detected

**During Implementation:**
```javascript
// Agent attempts this:
<div style={{ padding: '16px' }}>  // ❌ FORBIDDEN: inline_styles

// Self-check catches it:
const violations = detectInlineStyles(modifiedCode);
if (violations.length > 0) {
  // Automatically fix
  fixInlineStyles(modifiedCode, designSystem.tokens);
}

// Corrected to:
<div className="p-md">  // ✅ ALLOWED: design token
```

### Scenario: File Limit Exceeded

**During Implementation:**
```typescript
fileCount++;  // Now at 6 files

if (fileCount > constraints.file_limits.medium_task) {  // 5
  throw new Error(`
    File limit exceeded for medium task
    Current: ${fileCount} files
    Limit: ${constraints.file_limits.medium_task} files

    Options:
    1. Re-scope to fewer files
    2. Request complexity upgrade to 'complex' (10 file limit)
    3. Split into multiple tasks
  `);
}
```

### Scenario: Component Rewrite Detected

**At Quality Gate:**
```typescript
// Standards enforcer analyzes diff
const diffAnalysis = analyzeDiff('src/components/Card.tsx');

if (diffAnalysis.percentChanged > 80) {
  return {
    violation: 'component_rewrites',
    severity: 'critical',
    file: 'src/components/Card.tsx',
    percentChanged: diffAnalysis.percentChanged,
    action: 'REJECT - require edit-only approach',
    rationale: constraints.forbidden_operations.component_rewrites.rationale
  };
}

// Work rejected, agent must redo with edits only
```

---

## Best Practices for Constrained Agents

### 1. Context First, Always

```typescript
// ❌ DON'T: Start implementing without context
function implement(request) {
  // Jump straight to coding
}

// ✅ DO: Load and verify context first
async function implement(request, contextBundle) {
  if (!contextBundle) {
    throw new Error('Context required');
  }

  // Verify all required context loaded
  verifyRequiredContext(contextBundle);

  // Then implement
}
```

### 2. Check Constraints During Work

```typescript
// ❌ DON'T: Check constraints only at end
implement();
checkConstraints();  // Too late if violated

// ✅ DO: Check constraints continuously
for (const change of plannedChanges) {
  checkConstraintCompliance(change);  // Check before making change
  applyChange(change);
  checkConstraintCompliance(appliedChange);  // Verify after
}
```

### 3. Tag Everything

```typescript
// ❌ DON'T: Forget to tag operations
await editFile(path, changes);

// ✅ DO: Tag all operations
await editFile(path, changes);
console.log(`#FILE_MODIFIED: ${path}`);
fileCount++;
```

### 4. Self-Audit Before Gates

```typescript
// ❌ DON'T: Wait for gates to catch violations
await implement();
// Gates will fail, require rework

// ✅ DO: Self-audit and fix before gates
await implement();
const violations = await selfAudit();
if (violations.length > 0) {
  await fixViolations(violations);
}
// Gates pass on first try
```

### 5. Document Constraint Decisions

```typescript
// ❌ DON'T: Silently work around constraints
if (needsNewToken) {
  // Just hardcode value
}

// ✅ DO: Document need and follow process
if (needsNewToken) {
  console.log(`
    Need new design token: ${tokenName}
    Constraint: forbidden_operations.arbitrary_values
    Action: Proposing to design system for approval
  `);
  await proposeNewToken(tokenName, value, rationale);
}
```

---

## Constraint Evolution Example

**Initial State:**
```yaml
file_limits:
  simple_task: 5  # Liberal limit
```

**After Pattern Observed:**
```
Observation: Simple tasks averaging 1.8 files, but limit is 5
Analysis: Liberal limit allows scope creep
Violation Pattern: 3 tasks exceeded 2 files unnecessarily
Decision: Tighten limit to match actual need
```

**Updated Constraint:**
```yaml
file_limits:
  simple_task: 2  # Tightened based on actual patterns
  rationale: "Analysis shows simple tasks average 1.8 files"
```

**Saved to vibe.db:**
```sql
INSERT INTO standards (what_happened, cost, rule, domain)
VALUES (
  'Simple tasks averaging 5 files when 2 is sufficient',
  '3 hours of unnecessary review burden across 10 tasks',
  'Simple tasks: maximum 2 file edits',
  'webdev'
);
```

---

_This example demonstrates complete constraint framework application for OS 2.0 agents._
