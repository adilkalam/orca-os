# Standards Gate

**Version:** 2.0.0
**Domain:** webdev (applicable to all domains with domain-specific checks)
**Last Updated:** 2025-11-19

## Overview

The Standards Gate is a critical quality gate that enforces code quality standards compliance after implementation. It blocks progression if the standards score falls below the threshold (default: 90/100).

**Purpose:** Prevent code quality violations from reaching production by catching and fixing them during the implementation phase.

---

## Problem Statement

### What Happens Without This Gate

**Scenario:** Agent implements feature with code quality issues

**Without Standards Gate:**
1. Agent implements feature with inline styles
2. Agent implements with arbitrary values
3. Agent completes implementation
4. User discovers violations during review
5. Agent fixes violations manually
6. Multiple back-and-forth iterations

**Result:** Wasted time, inconsistent code, technical debt

**With Standards Gate:**
1. Agent implements feature
2. Standards gate audits implementation
3. Gate detects violations (score: 70/100)
4. Gate fails, blocks progression
5. Triggers corrective implementation pass
6. Agent fixes all violations systematically
7. Gate re-runs, passes (score: 100/100)
8. Progression allowed

**Result:** Clean code, no violations, automated enforcement

---

## Gate Specification

### Position in Pipeline

```
Context Query
    ↓
Planning
    ↓
[Customization Gate]
    ↓
Analysis
    ↓
Implementation Pass 1
    ↓
Standards Enforcement
    ↓
[STANDARDS GATE] ← You are here
    ↓ (if PASS)
Design QA
    ↓
[Design QA Gate]
    ↓
Decision: Both ≥90 → Verification
         Either <90 → Implementation Pass 2 (corrective)
```

**Blocking:** Yes - Progression blocked if score <90

### When Gate Runs

- **Trigger:** After standards_enforcement phase completes
- **Frequency:** After each implementation pass (pass 1, then potentially pass 2)
- **Scope:** All files modified in implementation pass

### Pass/Fail Criteria

**PASS → Allow progression to Design QA:**
- Standards score ≥90
- No critical violations
- All required checks passed

**CAUTION → Allow progression but warn:**
- Standards score ≥70 but <90
- Minor violations present
- User should review

**FAIL → Block progression:**
- Standards score <70 (strict mode: <90)
- Critical violations present
- Triggers corrective implementation pass

---

## Scoring Algorithm

### Base Score

```typescript
interface StandardsScore {
  score: number;        // 0-100
  violations: Violation[];
  checkResults: CheckResult[];
  gateResult: 'PASS' | 'CAUTION' | 'FAIL';
}

// Start at 100, deduct points for violations
let score = 100;
```

### Webdev Domain Checks

#### Check 1: No Inline Styles (Weight: 20, Severity: High)

**What it checks:**
- No `style={{...}}` in React/Vue components
- No `<div style="...">` in HTML
- All styling must use design system classes/tokens

**Detection:**
```typescript
function checkInlineStyles(files: ModifiedFile[]): CheckResult {
  const violations: Violation[] = [];

  for (const file of files) {
    // React inline styles
    const inlineStyleMatches = file.content.match(/style=\{\{[^}]+\}\}/g);
    if (inlineStyleMatches) {
      violations.push({
        file: file.path,
        line: getLineNumber(file.content, inlineStyleMatches[0]),
        violation: 'inline_style',
        severity: 'high',
        example: inlineStyleMatches[0],
        fix: 'Use className with design-dna tokens'
      });
    }

    // HTML inline styles
    const htmlStyleMatches = file.content.match(/style="[^"]+"/g);
    if (htmlStyleMatches) {
      violations.push({
        file: file.path,
        line: getLineNumber(file.content, htmlStyleMatches[0]),
        violation: 'inline_style_html',
        severity: 'high',
        example: htmlStyleMatches[0],
        fix: 'Use CSS classes with design tokens'
      });
    }
  }

  return {
    check: 'no_inline_styles',
    passed: violations.length === 0,
    violations,
    pointsDeducted: violations.length * 20  // -20 per violation
  };
}
```

**Scoring:**
- 0 violations: +0 (perfect)
- 1 violation: -20
- 2+ violations: -20 each

---

#### Check 2: No Arbitrary Values (Weight: 20, Severity: High)

**What it checks:**
- No arbitrary Tailwind values (`p-[16px]`, `text-[#FF0000]`)
- All values must come from design system
- Spacing, colors, typography from tokens only

**Detection:**
```typescript
function checkArbitraryValues(files: ModifiedFile[]): CheckResult {
  const violations: Violation[] = [];

  for (const file of files) {
    // Tailwind arbitrary values
    const arbitraryMatches = file.content.match(/\w+-\[[^\]]+\]/g);

    if (arbitraryMatches) {
      for (const match of arbitraryMatches) {
        violations.push({
          file: file.path,
          line: getLineNumber(file.content, match),
          violation: 'arbitrary_value',
          severity: 'high',
          example: match,
          fix: 'Use design system token (e.g., p-md, text-primary)'
        });
      }
    }
  }

  return {
    check: 'no_arbitrary_values',
    passed: violations.length === 0,
    violations,
    pointsDeducted: violations.length * 15  // -15 per violation
  };
}
```

**Scoring:**
- 0 violations: +0
- 1 violation: -15
- Each additional: -15

---

#### Check 3: No Component Rewrites (Weight: 30, Severity: Critical)

**What it checks:**
- Git diff shows <80% line changes
- Edits should be surgical, not wholesale rewrites
- Preserves existing component structure

**Detection:**
```typescript
function checkComponentRewrites(files: ModifiedFile[]): CheckResult {
  const violations: Violation[] = [];

  for (const file of files) {
    const gitDiff = execSync(`git diff ${file.path}`).toString();

    // Parse diff to count changed lines
    const addedLines = (gitDiff.match(/^\+(?!\+)/gm) || []).length;
    const removedLines = (gitDiff.match(/^-(?!-)/gm) || []).length;
    const totalLines = file.totalLines;

    const changePercent = ((addedLines + removedLines) / totalLines) * 100;

    if (changePercent > 80) {
      violations.push({
        file: file.path,
        violation: 'component_rewrite',
        severity: 'critical',
        example: `${changePercent.toFixed(0)}% of file changed (threshold: 80%)`,
        fix: 'Use Edit tool for surgical changes, not rewriting entire file'
      });
    }
  }

  return {
    check: 'no_component_rewrites',
    passed: violations.length === 0,
    violations,
    pointsDeducted: violations.length * 30  // -30 per violation (CRITICAL)
  };
}
```

**Scoring:**
- 0 violations: +0
- 1 violation: -30 (critical)

---

#### Check 4: Spacing From Scale (Weight: 10, Severity: Medium)

**What it checks:**
- All spacing uses design system scale (p-xs, p-sm, p-md, p-lg, p-xl)
- No custom spacing values
- Consistent spacing hierarchy

**Detection:**
```typescript
function checkSpacingFromScale(files: ModifiedFile[], designSystem: DesignSystem): CheckResult {
  const violations: Violation[] = [];
  const validSpacing = Object.keys(designSystem.tokens.spacing);  // ['xs', 'sm', 'md', 'lg', 'xl', ...]

  for (const file of files) {
    // Check for spacing classes
    const spacingMatches = file.content.match(/\b(p|m|gap|space)-(\w+)/g);

    if (spacingMatches) {
      for (const match of spacingMatches) {
        const [, type, value] = match.match(/\b(p|m|gap|space)-(\w+)/) || [];

        if (value && !validSpacing.includes(value)) {
          violations.push({
            file: file.path,
            line: getLineNumber(file.content, match),
            violation: 'spacing_not_in_scale',
            severity: 'medium',
            example: match,
            fix: `Use design system spacing: ${validSpacing.join(', ')}`
          });
        }
      }
    }
  }

  return {
    check: 'spacing_from_scale',
    passed: violations.length === 0,
    violations,
    pointsDeducted: violations.length * 10
  };
}
```

**Scoring:**
- 0 violations: +0
- Each violation: -10

---

#### Check 5: Typography From Scale (Weight: 10, Severity: Medium)

**What it checks:**
- All typography uses design system (text-xs, text-sm, text-base, text-lg, etc.)
- Font weights from scale (font-normal, font-medium, font-semibold)
- No arbitrary font sizes

**Detection:**
```typescript
function checkTypographyFromScale(files: ModifiedFile[], designSystem: DesignSystem): CheckResult {
  const violations: Violation[] = [];
  const validSizes = Object.keys(designSystem.tokens.typography.scale);

  for (const file of files) {
    const textMatches = file.content.match(/\btext-(\w+)/g);

    if (textMatches) {
      for (const match of textMatches) {
        const [, size] = match.match(/\btext-(\w+)/) || [];

        if (size && !validSizes.includes(size) && !['primary', 'secondary', 'accent'].includes(size)) {
          violations.push({
            file: file.path,
            line: getLineNumber(file.content, match),
            violation: 'typography_not_in_scale',
            severity: 'medium',
            example: match,
            fix: `Use design system typography: ${validSizes.join(', ')}`
          });
        }
      }
    }
  }

  return {
    check: 'typography_from_scale',
    passed: violations.length === 0,
    violations,
    pointsDeducted: violations.length * 10
  };
}
```

**Scoring:**
- 0 violations: -10
- Each violation: -10

---

#### Check 6: Proper Token Usage (Weight: 10, Severity: Medium)

**What it checks:**
- CSS variables used correctly (`var(--color-primary)`)
- Tokens not hardcoded
- Semantic token usage (use `--color-text-primary` not `--color-gray-900`)

**Detection:**
```typescript
function checkProperTokenUsage(files: ModifiedFile[]): CheckResult {
  const violations: Violation[] = [];

  for (const file of files) {
    // Check for hardcoded color values
    const hexColors = file.content.match(/#[0-9A-Fa-f]{3,8}/g);
    if (hexColors) {
      violations.push({
        file: file.path,
        violation: 'hardcoded_color',
        severity: 'medium',
        example: hexColors[0],
        fix: 'Use design token (e.g., var(--color-primary))'
      });
    }

    // Check for hardcoded pixel values in CSS
    const pxValues = file.content.match(/:\s*\d+px/g);
    if (pxValues) {
      violations.push({
        file: file.path,
        violation: 'hardcoded_spacing',
        severity: 'medium',
        example: pxValues[0],
        fix: 'Use design token (e.g., var(--spacing-md))'
      });
    }
  }

  return {
    check: 'proper_token_usage',
    passed: violations.length === 0,
    violations,
    pointsDeducted: violations.length * 5
  };
}
```

**Scoring:**
- 0 violations: +0
- Each violation: -5

---

## Gate Implementation

### Running Standards Enforcement

```typescript
async function runStandardsEnforcement(
  filesModified: ModifiedFile[],
  designSystem: DesignSystem,
  relatedStandards: Standard[]
): Promise<StandardsGateResult> {

  // Run all checks
  const checks = [
    checkInlineStyles(filesModified),
    checkArbitraryValues(filesModified),
    checkComponentRewrites(filesModified),
    checkSpacingFromScale(filesModified, designSystem),
    checkTypographyFromScale(filesModified, designSystem),
    checkProperTokenUsage(filesModified)
  ];

  // Calculate score
  let score = 100;
  const allViolations: Violation[] = [];

  for (const check of checks) {
    score -= check.pointsDeducted;
    allViolations.push(...check.violations);
  }

  // Determine gate result
  let gateResult: 'PASS' | 'CAUTION' | 'FAIL';
  if (score >= 90) {
    gateResult = 'PASS';
  } else if (score >= 70) {
    gateResult = 'CAUTION';
  } else {
    gateResult = 'FAIL';
  }

  return {
    score,
    violations: allViolations,
    checkResults: checks,
    gateResult,
    allowProgression: gateResult === 'PASS',
    requiresCorrectivePass: gateResult === 'FAIL'
  };
}
```

---

### Integration with Pipeline

```typescript
// After implementation_pass_1 completes

const standardsResult = await runStandardsEnforcement(
  filesModified,
  contextBundle.designSystem,
  contextBundle.relatedStandards
);

console.log(`📊 Standards Score: ${standardsResult.score}/100`);
console.log(`🚦 Gate Result: ${standardsResult.gateResult}`);

if (standardsResult.gateResult === 'FAIL') {
  // Block progression, trigger corrective pass
  updatePhaseState({
    current_phase: 'blocked_on_standards_gate',
    gates_failed: ['standards_gate'],
    blocking_reason: `Standards score ${standardsResult.score}/100 (threshold: 90)`
  });

  // Save violations for corrective pass
  await saveArtifact({
    type: 'standards_violations',
    path: `.claude/orchestration/temp/violations-${timestamp}.json`,
    data: standardsResult.violations
  });

  // Trigger implementation_pass_2 (corrective)
  await runImplementationPass2({
    violations: standardsResult.violations,
    contextBundle,
    designSystem
  });

} else if (standardsResult.gateResult === 'CAUTION') {
  // Allow progression but warn user
  console.warn(`⚠️ Standards score is ${standardsResult.score}/100 (passing but below ideal)`);
  console.warn(`Violations: ${standardsResult.violations.length}`);

  await proceedToDesignQA();

} else {
  // PASS - proceed to Design QA
  console.log('✅ Standards gate passed');
  await proceedToDesignQA();
}
```

---

## Example Scenarios

### Scenario 1: Inline Styles Detected (FAIL)

**Implementation:**
```tsx
// implementation_pass_1 result
<div style={{ padding: '16px', color: '#3B82F6' }}>
  <h1>Pricing</h1>
</div>
```

**Standards Gate Analysis:**
```typescript
{
  score: 60,  // 100 - 20 (inline style) - 20 (another inline style)
  violations: [
    {
      file: 'src/components/PricingCard.tsx',
      line: 42,
      violation: 'inline_style',
      severity: 'high',
      example: 'style={{ padding: \'16px\', color: \'#3B82F6\' }}',
      fix: 'Use className="p-md text-primary"'
    }
  ],
  gateResult: 'FAIL'
}
```

**Gate Action:** Block, trigger implementation_pass_2

**Corrective Pass:**
```tsx
// implementation_pass_2 fixes
<div className="p-md text-primary">
  <h1>Pricing</h1>
</div>
```

**Re-run Gate:** Score 100, PASS ✅

---

### Scenario 2: Arbitrary Values (FAIL)

**Implementation:**
```tsx
<button className="p-[14px] text-[#FF5733] rounded-[12px]">
  Submit
</button>
```

**Standards Gate:**
```typescript
{
  score: 55,  // 100 - 15 (p-[14px]) - 15 (text-[#FF5733]) - 15 (rounded-[12px])
  violations: [
    { violation: 'arbitrary_value', example: 'p-[14px]' },
    { violation: 'arbitrary_value', example: 'text-[#FF5733]' },
    { violation: 'arbitrary_value', example: 'rounded-[12px]' }
  ],
  gateResult: 'FAIL'
}
```

**Corrective Pass:**
```tsx
<button className="p-md text-accent rounded-lg">
  Submit
</button>
```

**Re-run Gate:** Score 100, PASS ✅

---

### Scenario 3: Component Rewrite (FAIL - Critical)

**Git Diff Analysis:**
```
File: src/components/FeatureCard.tsx
Total Lines: 120
Added Lines: 95
Removed Lines: 90
Change Percent: 154% (>80% threshold)
```

**Standards Gate:**
```typescript
{
  score: 70,  // 100 - 30 (component rewrite - CRITICAL)
  violations: [
    {
      file: 'src/components/FeatureCard.tsx',
      violation: 'component_rewrite',
      severity: 'critical',
      example: '154% of file changed (threshold: 80%)',
      fix: 'Use Edit tool for surgical changes'
    }
  ],
  gateResult: 'FAIL'
}
```

**Action:** Block, require manual review or rebuild with Edit tool

---

### Scenario 4: Perfect Implementation (PASS)

**Implementation:**
```tsx
<div className="p-md bg-surface-primary rounded-lg shadow-sm">
  <h2 className="text-xl font-semibold text-primary mb-sm">
    Premium Plan
  </h2>
  <p className="text-base text-secondary">
    All features included
  </p>
</div>
```

**Standards Gate:**
```typescript
{
  score: 100,
  violations: [],
  gateResult: 'PASS'
}
```

**Action:** Proceed to Design QA ✅

---

## Configuration

### Gate Thresholds

```yaml
standards_gate:
  pass_threshold: 90
  caution_threshold: 70
  blocking: true

  strictness: standard  # relaxed | standard | strict

  # Relaxed: Pass at 70+
  relaxed:
    pass_threshold: 70
    caution_threshold: 50

  # Standard: Pass at 90+ (DEFAULT)
  standard:
    pass_threshold: 90
    caution_threshold: 70

  # Strict: Pass at 95+, no CAUTION
  strict:
    pass_threshold: 95
    caution_threshold: 95
```

---

## Violation Recording to vibe.db

**When gate fails, violations become standards:**

```sql
-- Record violation as learned standard
INSERT INTO standards (
  domain,
  category,
  rule,
  rationale,
  examples,
  enforcement_level,
  created_at
) VALUES (
  'webdev',
  'code_quality',
  'no_inline_styles',
  'Inline styles bypass design system and create inconsistency',
  '{"bad": "style={{ padding: ''16px'' }}", "good": "className=\"p-md\""}',
  'automated',
  datetime('now')
);
```

**Future enforcement:**
- Standards gate automatically checks new violations
- Violations in vibe.db = enforced in future pipelines
- Self-improving system

---

## Success Metrics

```sql
-- Track gate effectiveness
SELECT
  COUNT(*) as total_runs,
  SUM(CASE WHEN result = 'PASS' THEN 1 ELSE 0 END) as passed,
  SUM(CASE WHEN result = 'FAIL' THEN 1 ELSE 0 END) as failed,
  AVG(score) as avg_score
FROM events
WHERE type = 'standards_gate'
  AND timestamp > date('now', '-30 days');
```

**Healthy Metrics:**
- Pass rate: 60-70% on first pass
- Avg score: 85-95
- Failed violations caught before user review

---

_Standards Gate: Enforcing code quality through automated compliance checks._
