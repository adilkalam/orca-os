# Design QA Gate

**Version:** 2.0.0
**Domain:** webdev
**Last Updated:** 2025-11-19

## Overview

The Design QA Gate is a critical quality gate that enforces visual design system compliance after implementation. It blocks progression if the design QA score falls below the threshold (default: 90/100).

**Purpose:** Prevent visual inconsistencies and design system violations from reaching production by catching them during implementation.

---

## Problem Statement

### What Happens Without This Gate

**Scenario:** Agent implements feature with visual design issues

**Without Design QA Gate:**
1. Agent implements with correct tokens but wrong hierarchy
2. Spacing looks "off" but builds successfully
3. Typography hierarchy inconsistent
4. User notices visual issues during manual review
5. Multiple back-and-forth fixes
6. Design drift accumulates

**Result:** Visual inconsistency, degraded user experience, design system erosion

**With Design QA Gate:**
1. Agent implements feature
2. Design QA gate analyzes visual compliance
3. Gate detects issues (score: 75/100)
4. Gate fails, blocks progression
5. Triggers corrective implementation pass
6. Agent fixes all visual issues systematically
7. Gate re-runs, passes (score: 95/100)
8. Progression allowed

**Result:** Pixel-perfect implementation, design system integrity maintained

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
[Standards Gate ≥90]
    ↓
Design QA
    ↓
[DESIGN QA GATE] ← You are here
    ↓ (if both ≥90)
Verification
```

**Blocking:** Yes - Progression blocked if score <90

### When Gate Runs

- **Trigger:** After design_qa phase completes
- **Frequency:** After each implementation pass
- **Scope:** All modified UI components

### Pass/Fail Criteria

**PASS → Allow progression to Verification:**
- Design QA score ≥90
- No critical visual violations
- Design system cardinal rules followed

**CAUTION → Allow progression but warn:**
- Design QA score ≥70 but <90
- Minor visual issues present
- User should review visually

**FAIL → Block progression:**
- Design QA score <70 (strict mode: <90)
- Critical visual violations
- Cardinal rules violated
- Triggers corrective implementation pass

---

## Scoring Algorithm

### Base Score

```typescript
interface DesignQAScore {
  score: number;        // 0-100
  visualIssues: VisualIssue[];
  checkResults: CheckResult[];
  gateResult: 'PASS' | 'CAUTION' | 'FAIL';
}

// Start at 100, deduct points for visual issues
let score = 100;
```

### Design QA Checks

#### Check 1: Spacing Hierarchy (Weight: 15, Severity: High)

**What it checks:**
- Spacing progression follows design system scale
- Related elements use consistent spacing
- Optical spacing (visual weight) vs geometric spacing
- No arbitrary spacing combinations

**Analysis:**
```typescript
function checkSpacingHierarchy(components: Component[], designSystem: DesignSystem): CheckResult {
  const issues: VisualIssue[] = [];

  for (const component of components) {
    const spacingUsed = extractSpacingClasses(component.content);

    // Check for spacing jumps (e.g., xs → xl without intermediate steps)
    const spacingScale = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const usedIndexes = spacingUsed.map(s => spacingScale.indexOf(s)).sort((a, b) => a - b);

    for (let i = 1; i < usedIndexes.length; i++) {
      const gap = usedIndexes[i] - usedIndexes[i - 1];
      if (gap > 2) {
        issues.push({
          component: component.name,
          file: component.path,
          issue: 'spacing_hierarchy_jump',
          severity: 'high',
          example: `Jumps from ${spacingScale[usedIndexes[i-1]]} to ${spacingScale[usedIndexes[i]]}`,
          fix: 'Use intermediate spacing values for smooth hierarchy'
        });
      }
    }

    // Check for inconsistent spacing in similar elements
    if (component.type === 'list' || component.type === 'grid') {
      const childSpacing = component.children.map(c => extractSpacing(c));
      const uniqueSpacing = new Set(childSpacing);

      if (uniqueSpacing.size > 1) {
        issues.push({
          component: component.name,
          issue: 'inconsistent_spacing',
          severity: 'medium',
          example: `Children use different spacing: ${Array.from(uniqueSpacing).join(', ')}`,
          fix: 'Use consistent spacing for similar elements'
        });
      }
    }
  }

  return {
    check: 'spacing_hierarchy',
    passed: issues.length === 0,
    issues,
    pointsDeducted: issues.length * 15
  };
}
```

**Scoring:**
- 0 issues: +0
- Each issue: -15

---

#### Check 2: Typography Hierarchy (Weight: 10, Severity: Medium)

**What it checks:**
- Heading hierarchy follows logical progression (h1 > h2 > h3)
- Font sizes appropriate for content type
- Line heights proportional to font sizes
- Font weights create clear hierarchy

**Analysis:**
```typescript
function checkTypographyHierarchy(components: Component[]): CheckResult {
  const issues: VisualIssue[] = [];

  for (const component of components) {
    // Extract all headings
    const headings = extractHeadings(component.content);

    // Check heading size progression
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i];
      const previous = headings[i - 1];

      const currentSize = getTypographySize(current.className);
      const previousSize = getTypographySize(previous.className);

      if (currentSize >= previousSize && current.level > previous.level) {
        issues.push({
          component: component.name,
          issue: 'inverted_heading_hierarchy',
          severity: 'high',
          example: `${previous.tag} (${previousSize}) → ${current.tag} (${currentSize})`,
          fix: 'Lower-level headings must be smaller than higher-level headings'
        });
      }
    }

    // Check for skipped heading levels
    const levels = headings.map(h => h.level).sort();
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i - 1] > 1) {
        issues.push({
          component: component.name,
          issue: 'skipped_heading_level',
          severity: 'medium',
          example: `Jumps from h${levels[i-1]} to h${levels[i]}`,
          fix: 'Use sequential heading levels'
        });
      }
    }
  }

  return {
    check: 'typography_hierarchy',
    passed: issues.length === 0,
    issues,
    pointsDeducted: issues.length * 10
  };
}
```

**Scoring:**
- 0 issues: +0
- Each issue: -10

---

#### Check 3: Color Palette Compliance (Weight: 20, Severity: High)

**What it checks:**
- All colors from design system palette
- Semantic color usage (primary for CTAs, danger for errors)
- Sufficient contrast ratios (WCAG AA: 4.5:1 for text)
- No color-only information conveyance

**Analysis:**
```typescript
function checkColorPaletteCompliance(
  components: Component[],
  designSystem: DesignSystem
): CheckResult {
  const issues: VisualIssue[] = [];
  const validColors = Object.keys(designSystem.tokens.colors);

  for (const component of components) {
    // Extract color classes
    const colorClasses = extractColorClasses(component.content);

    for (const colorClass of colorClasses) {
      const colorName = extractColorName(colorClass);

      // Check if color exists in design system
      if (!validColors.includes(colorName)) {
        issues.push({
          component: component.name,
          issue: 'color_not_in_palette',
          severity: 'critical',
          example: colorClass,
          fix: `Use design system color: ${validColors.join(', ')}`
        });
      }

      // Check semantic usage
      if (component.type === 'button' && component.intent === 'primary') {
        if (!colorName.includes('primary')) {
          issues.push({
            component: component.name,
            issue: 'incorrect_semantic_color',
            severity: 'high',
            example: `Primary button using ${colorClass} instead of primary color`,
            fix: 'Use text-primary-inverse and bg-primary for primary buttons'
          });
        }
      }
    }

    // Check contrast ratios
    const contrastIssues = checkContrastRatios(component, designSystem);
    issues.push(...contrastIssues);
  }

  return {
    check: 'color_palette_compliance',
    passed: issues.length === 0,
    issues,
    pointsDeducted: issues.length * 20
  };
}
```

**Scoring:**
- 0 issues: +0
- Each issue: -20

---

#### Check 4: Optical Alignment (Weight: 10, Severity: Medium)

**What it checks:**
- Visual weight balanced (icons aligned with text baseline)
- Optical centering vs geometric centering
- Padding adjusted for visual elements
- Elements feel aligned even if geometrically offset

**Analysis:**
```typescript
function checkOpticalAlignment(components: Component[]): CheckResult {
  const issues: VisualIssue[] = [];

  for (const component of components) {
    // Check icon-text alignment
    const iconTextPairs = findIconTextPairs(component);

    for (const pair of iconTextPairs) {
      if (!hasBaselineAlignment(pair.icon, pair.text)) {
        issues.push({
          component: component.name,
          issue: 'icon_not_baseline_aligned',
          severity: 'medium',
          example: `Icon and text not visually aligned`,
          fix: 'Align icon to text baseline (not top/center)'
        });
      }
    }

    // Check button text centering
    if (component.type === 'button') {
      const hasIcon = component.content.includes('<svg') || component.content.includes('Icon');

      if (hasIcon) {
        // Icon buttons need optical centering
        const padding = extractPadding(component.content);
        if (!hasOpticalCentering(padding)) {
          issues.push({
            component: component.name,
            issue: 'geometric_centering_with_icon',
            severity: 'low',
            example: 'Icon button uses geometric centering',
            fix: 'Adjust padding for optical centering (visual weight)'
          });
        }
      }
    }
  }

  return {
    check: 'optical_alignment',
    passed: issues.length === 0,
    issues,
    pointsDeducted: issues.length * 10
  };
}
```

**Scoring:**
- 0 issues: +0
- Each issue: -10

---

#### Check 5: Responsive Behavior (Weight: 5, Severity: Low)

**What it checks:**
- Responsive classes present (sm:, md:, lg:)
- Mobile-first approach
- Breakpoints from design system
- No hardcoded viewport widths

**Analysis:**
```typescript
function checkResponsiveBehavior(components: Component[]): CheckResult {
  const issues: VisualIssue[] = [];

  for (const component of components) {
    // Check if component has responsive classes
    const hasResponsiveClasses = /\b(sm|md|lg|xl|2xl):/.test(component.content);

    if (!hasResponsiveClasses && component.requiresResponsive) {
      issues.push({
        component: component.name,
        issue: 'missing_responsive_classes',
        severity: 'medium',
        example: 'Component has no responsive variants',
        fix: 'Add responsive classes (e.g., sm:flex-row, md:grid-cols-3)'
      });
    }

    // Check for hardcoded widths
    const hardcodedWidths = component.content.match(/w-\[\d+px\]/g);
    if (hardcodedWidths) {
      issues.push({
        component: component.name,
        issue: 'hardcoded_width',
        severity: 'low',
        example: hardcodedWidths[0],
        fix: 'Use responsive width classes (w-full, md:w-1/2)'
      });
    }
  }

  return {
    check: 'responsive_behavior',
    passed: issues.length === 0,
    issues,
    pointsDeducted: issues.length * 5
  };
}
```

**Scoring:**
- 0 issues: +0
- Each issue: -5

---

#### Check 6: Component Variant Correctness (Weight: 15, Severity: Medium)

**What it checks:**
- Component variants match design system definitions
- Props used correctly
- Variant combinations are valid
- No custom variants without design system support

**Analysis:**
```typescript
function checkComponentVariantCorrectness(
  components: Component[],
  designSystem: DesignSystem
): CheckResult {
  const issues: VisualIssue[] = [];

  for (const component of components) {
    const componentDef = designSystem.components[component.type];

    if (!componentDef) {
      continue;  // Component not in design system
    }

    // Check if variant exists
    if (component.variant && !componentDef.variants.includes(component.variant)) {
      issues.push({
        component: component.name,
        issue: 'invalid_variant',
        severity: 'high',
        example: `Variant "${component.variant}" not in design system`,
        fix: `Use valid variant: ${componentDef.variants.join(', ')}`
      });
    }

    // Check props usage
    const usedProps = extractProps(component.content);
    const validProps = componentDef.props || [];

    for (const prop of usedProps) {
      if (!validProps.includes(prop)) {
        issues.push({
          component: component.name,
          issue: 'invalid_prop',
          severity: 'medium',
          example: `Prop "${prop}" not in design system`,
          fix: `Use valid props: ${validProps.join(', ')}`
        });
      }
    }
  }

  return {
    check: 'component_variant_correctness',
    passed: issues.length === 0,
    issues,
    pointsDeducted: issues.length * 15
  };
}
```

**Scoring:**
- 0 issues: +0
- Each issue: -15

---

#### Check 7: Design-DNA Cardinal Rules (Weight: 25, Severity: Critical)

**What it checks:**
- Mathematical spacing system followed
- No arbitrary values anywhere
- Consistent visual rhythm
- Proper use of whitespace
- Design system source of truth respected

**Analysis:**
```typescript
function checkCardinalRules(
  components: Component[],
  designSystem: DesignSystem
): CheckResult {
  const issues: VisualIssue[] = [];

  const cardinalRules = [
    {
      name: 'mathematical_spacing',
      check: (c: Component) => hasOnlyScaleSpacing(c, designSystem),
      fix: 'Use design system spacing scale (xs, sm, md, lg, xl)'
    },
    {
      name: 'no_arbitrary_values',
      check: (c: Component) => !hasArbitraryValues(c),
      fix: 'Remove arbitrary values (e.g., p-[16px], text-[#FF0000])'
    },
    {
      name: 'visual_rhythm',
      check: (c: Component) => hasConsistentRhythm(c, designSystem),
      fix: 'Maintain consistent spacing rhythm throughout component'
    },
    {
      name: 'whitespace_usage',
      check: (c: Component) => hasProperWhitespace(c),
      fix: 'Add proper whitespace for breathing room'
    }
  ];

  for (const component of components) {
    for (const rule of cardinalRules) {
      if (!rule.check(component)) {
        issues.push({
          component: component.name,
          issue: `cardinal_rule_violation_${rule.name}`,
          severity: 'critical',
          example: `Violates design-DNA cardinal rule: ${rule.name}`,
          fix: rule.fix
        });
      }
    }
  }

  return {
    check: 'design_dna_cardinal_rules',
    passed: issues.length === 0,
    issues,
    pointsDeducted: issues.length * 25  // CRITICAL
  };
}
```

**Scoring:**
- 0 issues: +0
- Each violation: -25 (CRITICAL)

---

## Gate Implementation

### Running Design QA

```typescript
async function runDesignQA(
  filesModified: ModifiedFile[],
  designSystem: DesignSystem,
  contextBundle: ContextBundle
): Promise<DesignQAResult> {

  // Parse components from modified files
  const components = parseComponents(filesModified);

  // Run all visual checks
  const checks = [
    checkSpacingHierarchy(components, designSystem),
    checkTypographyHierarchy(components),
    checkColorPaletteCompliance(components, designSystem),
    checkOpticalAlignment(components),
    checkResponsiveBehavior(components),
    checkComponentVariantCorrectness(components, designSystem),
    checkCardinalRules(components, designSystem)
  ];

  // Calculate score
  let score = 100;
  const allIssues: VisualIssue[] = [];

  for (const check of checks) {
    score -= check.pointsDeducted;
    allIssues.push(...check.issues);
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
    visualIssues: allIssues,
    checkResults: checks,
    gateResult,
    allowProgression: gateResult === 'PASS',
    requiresCorrectivePass: gateResult === 'FAIL'
  };
}
```

---

## Integration with Pipeline

```typescript
// After design_qa phase completes

const designQAResult = await runDesignQA(
  filesModified,
  contextBundle.designSystem,
  contextBundle
);

console.log(`🎨 Design QA Score: ${designQAResult.score}/100`);
console.log(`🚦 Gate Result: ${designQAResult.gateResult}`);

if (designQAResult.gateResult === 'FAIL') {
  // Block progression, trigger corrective pass
  updatePhaseState({
    current_phase: 'blocked_on_design_qa_gate',
    gates_failed: ['design_qa_gate'],
    blocking_reason: `Design QA score ${designQAResult.score}/100 (threshold: 90)`
  });

  // Save visual issues for corrective pass
  await saveArtifact({
    type: 'design_qa_issues',
    path: `.claude/orchestration/temp/design-issues-${timestamp}.json`,
    data: designQAResult.visualIssues
  });

  // If standards also failed, combine fixes in pass 2
  const combinedIssues = {
    violations: await loadArtifact('standards_violations'),
    visualIssues: designQAResult.visualIssues
  };

  await runImplementationPass2(combinedIssues);

} else if (designQAResult.gateResult === 'CAUTION') {
  console.warn(`⚠️ Design QA score is ${designQAResult.score}/100`);
  console.warn(`Visual issues: ${designQAResult.visualIssues.length}`);

  await proceedToVerification();

} else {
  console.log('✅ Design QA gate passed');
  await proceedToVerification();
}
```

---

## Example Scenarios

### Scenario 1: Spacing Hierarchy Jump (FAIL)

**Implementation:**
```tsx
<div className="p-xs">           {/* 4px */}
  <h1 className="mb-2xl">       {/* 48px - HUGE JUMP */}
    Pricing
  </h1>
  <p className="text-base">...</p>
</div>
```

**Design QA:**
```typescript
{
  score: 85,  // 100 - 15 (spacing hierarchy jump)
  visualIssues: [
    {
      component: 'PricingCard',
      issue: 'spacing_hierarchy_jump',
      severity: 'high',
      example: 'Jumps from xs (4px) to 2xl (48px)',
      fix: 'Use intermediate spacing (xs → sm → md → lg → xl → 2xl)'
    }
  ],
  gateResult: 'CAUTION'
}
```

**Corrective Pass:**
```tsx
<div className="p-md">           {/* 16px */}
  <h1 className="mb-lg">        {/* 24px - smooth progression */}
    Pricing
  </h1>
  <p className="text-base">...</p>
</div>
```

**Re-run:** Score 100, PASS ✅

---

### Scenario 2: Cardinal Rule Violation (FAIL - Critical)

**Implementation:**
```tsx
<button className="p-[18px] text-[#3B82F6] rounded-[10px]">
  Submit
</button>
```

**Design QA:**
```typescript
{
  score: 25,  // 100 - 25 (arbitrary p) - 25 (arbitrary color) - 25 (arbitrary rounded)
  visualIssues: [
    { issue: 'cardinal_rule_violation_no_arbitrary_values', severity: 'critical' },
    { issue: 'cardinal_rule_violation_no_arbitrary_values', severity: 'critical' },
    { issue: 'cardinal_rule_violation_no_arbitrary_values', severity: 'critical' }
  ],
  gateResult: 'FAIL'
}
```

**Corrective Pass:**
```tsx
<button className="p-md text-primary rounded-lg">
  Submit
</button>
```

**Re-run:** Score 100, PASS ✅

---

### Scenario 3: Perfect Visual Implementation (PASS)

**Implementation:**
```tsx
<div className="p-lg bg-surface-primary rounded-lg shadow-sm">
  <h2 className="text-2xl font-semibold text-primary mb-md">
    Premium Plan
  </h2>
  <p className="text-base text-secondary leading-relaxed">
    All features included
  </p>
  <button className="mt-lg px-lg py-md bg-primary text-primary-inverse rounded-md">
    Get Started
  </button>
</div>
```

**Design QA:**
```typescript
{
  score: 100,
  visualIssues: [],
  checkResults: [
    { check: 'spacing_hierarchy', passed: true, pointsDeducted: 0 },
    { check: 'typography_hierarchy', passed: true, pointsDeducted: 0 },
    { check: 'color_palette_compliance', passed: true, pointsDeducted: 0 },
    { check: 'optical_alignment', passed: true, pointsDeducted: 0 },
    { check: 'responsive_behavior', passed: true, pointsDeducted: 0 },
    { check: 'component_variant_correctness', passed: true, pointsDeducted: 0 },
    { check: 'design_dna_cardinal_rules', passed: true, pointsDeducted: 0 }
  ],
  gateResult: 'PASS'
}
```

**Action:** Proceed to Verification ✅

---

## Summary

**Design QA Gate Purpose:**
- Enforce visual design system compliance
- Catch design inconsistencies before user sees them
- Maintain design system integrity
- Ensure pixel-perfect implementations

**Key Checks:**
1. Spacing hierarchy (mathematical progression)
2. Typography hierarchy (logical sizing)
3. Color palette compliance (semantic usage)
4. Optical alignment (visual weight)
5. Responsive behavior (mobile-first)
6. Component variants (design system definitions)
7. Cardinal rules (design-DNA compliance)

**Benefits:**
- Automated visual QA
- Consistent design quality
- No manual design review needed
- Self-improving through vibe.db

---

_Design QA Gate: Enforcing visual excellence through automated design compliance._
