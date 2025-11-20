# Customization Gate

**Version:** 2.0.0
**Domain:** webdev
**Last Updated:** 2025-11-19

## Overview

The Customization Gate is a critical quality gate in the webdev pipeline that blocks implementation if customization/theming needs are detected without proper design system support.

**Purpose:** Prevent inline styles and arbitrary values by catching customization requirements early and forcing design system updates first.

---

## Problem Statement

### What Happens Without This Gate

**Scenario:** User requests "Add a blue accent color to the pricing cards"

**Without Customization Gate:**
1. Agent implements with inline styles: `style={{ color: '#3B82F6' }}`
2. Standards gate catches violation
3. Agent corrects to design token... but token doesn't exist
4. Agent either:
   - Creates token inline (violates design system)
   - Uses wrong existing token (semantic mismatch)
   - Asks user mid-implementation (breaks flow)

**Result:** Wasted implementation pass, violations, inconsistency

**With Customization Gate:**
1. Gate detects "blue accent" request
2. Blocks implementation phase
3. Requires design system update first
4. New token added: `--color-accent-blue`
5. Implementation proceeds with proper token
6. Standards gate passes on first try

**Result:** Clean implementation, no violations, consistent system

---

## Gate Specification

### Position in Pipeline

```
Context Query
    ↓
Planning & Spec
    ↓
[CUSTOMIZATION GATE] ← You are here
    ↓ (if PASS)
Analysis
    ↓
Implementation
```

**Blocking:** Yes - Implementation cannot proceed until gate passes

### When Gate Runs

- **Trigger:** After planning phase completes
- **Frequency:** Once per pipeline execution
- **Scope:** Analyzes user request + existing design system

### Pass/Fail Criteria

**PASS → Allow progression to Analysis:**
- No new colors requested
- No new spacing values requested
- No new typography styles requested
- No new component variants requested
- All customization needs satisfied by existing tokens

**FAIL → Block progression, require design system update:**
- Request mentions custom colors not in palette
- Request mentions spacing not in scale
- Request mentions typography not in system
- Request implies new component variant needed
- Any "make it look like X" where X differs from design system

---

## Detection Algorithm

### Input

```typescript
interface CustomizationGateInput {
  userRequest: string;
  contextBundle: ContextBundle;
  designSystem: DesignSystemContext;
  planningOutput: {
    scope: string;
    componentsAffected: string[];
    estimatedComplexity: 'simple' | 'medium' | 'complex';
  };
}
```

### Detection Checks

#### 1. Color Customization Detection

**Triggers:**
```typescript
const colorTriggers = [
  // Explicit color requests
  /\b(color|colour|hue|tint|shade|tone)\b/i,
  /\b(red|blue|green|yellow|purple|orange|pink|gray|black|white)\b/i,
  /\b(primary|secondary|accent|highlight)\s+(color|colour)\b/i,

  // Color codes
  /#[0-9A-Fa-f]{3,8}/,        // #RGB, #RRGGBB, #RRGGBBAA
  /rgb\(|rgba\(/,              // rgb(), rgba()
  /hsl\(|hsla\(/,              // hsl(), hsla()

  // Design language
  /\b(dark|light|muted|vibrant|saturated)\b.*\b(color|colour|theme)\b/i,
  /\bmake it (more|less) colorful\b/i
];
```

**Validation:**
```typescript
function validateColorRequest(request: string, designSystem: DesignSystemContext) {
  const mentionedColors = extractColors(request);

  for (const color of mentionedColors) {
    if (!designSystem.tokens.colors.hasOwnProperty(color)) {
      return {
        customizationNeeded: true,
        type: 'color',
        requested: color,
        reason: `Color "${color}" not in design system palette`,
        action: 'Add to design-dna.json colors before implementing'
      };
    }
  }

  return { customizationNeeded: false };
}
```

#### 2. Spacing Customization Detection

**Triggers:**
```typescript
const spacingTriggers = [
  // Explicit spacing requests
  /\b(spacing|padding|margin|gap|inset)\b/i,
  /\b(tight|loose|compact|spacious)\b/i,

  // Numeric values with units
  /\d+\s*(px|rem|em|%)/,

  // Spacing descriptors
  /\b(more|less|bigger|smaller)\s+(space|spacing|padding|margin|gap)\b/i,
  /\badd\s+(more|extra)\s+space\b/i
];
```

**Validation:**
```typescript
function validateSpacingRequest(request: string, designSystem: DesignSystemContext) {
  const mentionedSpacing = extractSpacingValues(request);

  for (const spacing of mentionedSpacing) {
    if (!designSystem.tokens.spacing.scale.includes(spacing)) {
      return {
        customizationNeeded: true,
        type: 'spacing',
        requested: spacing,
        reason: `Spacing value "${spacing}" not in design system scale`,
        action: 'Add to design-dna.json spacing scale before implementing'
      };
    }
  }

  return { customizationNeeded: false };
}
```

#### 3. Typography Customization Detection

**Triggers:**
```typescript
const typographyTriggers = [
  // Font family
  /\b(font|typeface|font-family)\b/i,
  /\b(serif|sans-serif|monospace)\b/i,

  // Font size
  /\b(font-size|text size|bigger|smaller|larger)\s+(text|font)\b/i,
  /\d+\s*(px|pt|rem|em)\s+(font|text)/i,

  // Font weight
  /\b(bold|bolder|light|lighter|normal|medium|semibold|heavy)\b/i,
  /\bfont-weight/i,

  // Font style
  /\b(italic|oblique|underline|strikethrough)\b/i
];
```

**Validation:**
```typescript
function validateTypographyRequest(request: string, designSystem: DesignSystemContext) {
  const typography = extractTypography(request);

  if (typography.fontFamily && !designSystem.tokens.typography.families.includes(typography.fontFamily)) {
    return {
      customizationNeeded: true,
      type: 'typography',
      subtype: 'font-family',
      requested: typography.fontFamily,
      reason: 'Font family not in design system',
      action: 'Add to design-dna.json typography.families'
    };
  }

  if (typography.fontSize && !designSystem.tokens.typography.scale.includes(typography.fontSize)) {
    return {
      customizationNeeded: true,
      type: 'typography',
      subtype: 'font-size',
      requested: typography.fontSize,
      reason: 'Font size not in typography scale',
      action: 'Add to design-dna.json typography.scale'
    };
  }

  return { customizationNeeded: false };
}
```

#### 4. Component Variant Detection

**Triggers:**
```typescript
const variantTriggers = [
  // New variants
  /\b(variant|version|style|type)\s+of\b/i,
  /\b(outlined|filled|ghost|link|solid|dashed)\s+(button|input|card|badge)\b/i,

  // Size variants
  /\b(small|medium|large|xl|xs|tiny|huge)\s+(button|input|card)\b/i,

  // State variants
  /\b(active|inactive|disabled|loading|error|success|warning)\s+(state|variant)\b/i,

  // Custom look
  /\bmake it look like\b/i,
  /\bstyle it as\b/i,
  /\bcustom (look|style|appearance)\b/i
];
```

**Validation:**
```typescript
function validateVariantRequest(request: string, designSystem: DesignSystemContext, componentsAffected: string[]) {
  const requestedVariants = extractVariants(request);

  for (const component of componentsAffected) {
    const componentDef = designSystem.components[component];

    if (!componentDef) {
      // Component not in design system at all
      return {
        customizationNeeded: true,
        type: 'component',
        requested: component,
        reason: 'Component not in design system',
        action: 'Add component definition to design-dna.json'
      };
    }

    for (const variant of requestedVariants) {
      if (!componentDef.variants?.includes(variant)) {
        return {
          customizationNeeded: true,
          type: 'variant',
          component: component,
          requested: variant,
          reason: `Variant "${variant}" not defined for ${component}`,
          action: `Add variant to design-dna.json components.${component}.variants`
        };
      }
    }
  }

  return { customizationNeeded: false };
}
```

---

## Gate Implementation

### Pseudocode

```typescript
async function runCustomizationGate(input: CustomizationGateInput): Promise<GateResult> {
  const { userRequest, designSystem, planningOutput } = input;

  const checks = [
    validateColorRequest(userRequest, designSystem),
    validateSpacingRequest(userRequest, designSystem),
    validateTypographyRequest(userRequest, designSystem),
    validateVariantRequest(userRequest, designSystem, planningOutput.componentsAffected)
  ];

  const customizationNeeds = checks.filter(check => check.customizationNeeded);

  if (customizationNeeds.length === 0) {
    return {
      gate: 'PASS',
      message: 'No customization needs detected - design system adequate',
      allowProgression: true
    };
  }

  // Customization needed - BLOCK
  return {
    gate: 'FAIL',
    message: `Customization needs detected: ${customizationNeeds.length} items require design system updates`,
    allowProgression: false,
    customizationNeeds: customizationNeeds,
    requiredActions: customizationNeeds.map(need => ({
      type: need.type,
      requested: need.requested,
      action: need.action,
      priority: determinePriority(need.type)
    })),
    nextSteps: [
      'Update design-dna.json with required tokens/variants',
      'Regenerate design system assets if needed',
      'Re-run customization gate',
      'Proceed to implementation once gate passes'
    ]
  };
}
```

### Integration with Pipeline

```typescript
// In webdev-pipeline.md Phase 2 → Phase 3 transition

// After planning completes
const planningOutput = await planningPhase(request, contextBundle);

// Run customization gate
const gateResult = await runCustomizationGate({
  userRequest: request,
  contextBundle: contextBundle,
  designSystem: contextBundle.designSystem,
  planningOutput: planningOutput
});

if (gateResult.gate === 'FAIL') {
  // BLOCK progression
  updatePhaseState({
    current_phase: 'blocked_on_customization_gate',
    gates_failed: ['customization_gate'],
    blocking_reason: gateResult.message
  });

  // Report to user
  return {
    status: 'blocked',
    gate: 'customization_gate',
    result: gateResult,
    message: `
      Implementation blocked: Customization needs detected

      ${gateResult.message}

      Required actions:
      ${gateResult.requiredActions.map(a => `- ${a.action}`).join('\n')}

      Once design system updated, re-run pipeline.
    `
  };
}

// Gate passed - proceed to analysis
await analysisPhase(request, contextBundle);
```

---

## Example Scenarios

### Scenario 1: New Color Requested

**Request:** "Add a bright blue accent color to the CTA buttons"

**Gate Analysis:**
```typescript
{
  customizationNeeded: true,
  type: 'color',
  requested: 'bright blue accent',
  reason: 'Specific blue shade not in design system palette',
  action: 'Add --color-accent-blue to design-dna.json'
}
```

**Gate Result:** FAIL - Block implementation

**Required Action:**
```json
// design-dna.json update needed
{
  "tokens": {
    "colors": {
      "accent": {
        "blue": "#3B82F6",
        "blue-dark": "#2563EB"
      }
    }
  }
}
```

**After Update:** Gate passes, implementation proceeds with `var(--color-accent-blue)`

---

### Scenario 2: New Spacing Value

**Request:** "Add 12px padding to the card component"

**Gate Analysis:**
```typescript
{
  customizationNeeded: true,
  type: 'spacing',
  requested: '12px',
  reason: '12px not in spacing scale [4, 8, 16, 24, 32, 48, 64]',
  action: 'Either use existing scale value or add 12px to scale'
}
```

**Gate Result:** FAIL - Block implementation

**Options:**
1. **Use existing:** "12px is close to 16px, use --spacing-md (16px)"
2. **Add to scale:** Add `12: '12px'` to spacing scale
3. **Challenge request:** "Why 12px specifically? Design system uses 8px increments"

---

### Scenario 3: New Component Variant

**Request:** "Create an outlined version of the Button component"

**Gate Analysis:**
```typescript
{
  customizationNeeded: true,
  type: 'variant',
  component: 'Button',
  requested: 'outlined',
  reason: 'Button variants: [solid, ghost, link] - no outlined variant',
  action: 'Add outlined variant to Button component definition'
}
```

**Gate Result:** FAIL - Block implementation

**Required Action:**
```json
// design-dna.json update
{
  "components": {
    "Button": {
      "variants": ["solid", "ghost", "link", "outlined"],
      "variantStyles": {
        "outlined": {
          "border": "1px solid var(--color-border)",
          "background": "transparent",
          "color": "var(--color-text-primary)"
        }
      }
    }
  }
}
```

---

### Scenario 4: Request Uses Existing Tokens (PASS)

**Request:** "Make the heading text larger"

**Gate Analysis:**
```typescript
// Check typography scale
const currentSize = 'text-xl';  // 1.25rem
const requestImplies = 'larger'; // Next in scale: text-2xl (1.5rem)

{
  customizationNeeded: false,
  reason: 'text-2xl exists in typography scale',
  implementation: 'Use className="text-2xl"'
}
```

**Gate Result:** PASS - Proceed to implementation

**Implementation:**
```tsx
// No design system update needed
<h1 className="text-2xl">Heading</h1>  // Uses existing token
```

---

## Gate Configuration

### Sensitivity Levels

```yaml
customization_gate:
  sensitivity: medium  # low | medium | high

  # Low: Only block on explicit new token creation
  low:
    block_on:
      - New color hex codes in request
      - New spacing px values in request
      - Explicit "create new variant" requests

  # Medium: Block on implicit customization needs (DEFAULT)
  medium:
    block_on:
      - All low criteria
      - Color adjectives not mapping to palette (bright, muted, etc.)
      - Spacing descriptors not in scale (tight, loose, etc.)
      - Variant implications (outlined button, rounded card, etc.)

  # High: Block on any appearance change
  high:
    block_on:
      - All medium criteria
      - Any "make it look" requests
      - Any "style it as" requests
      - Any visual change not explicitly in design system
```

**Recommendation:** Use `medium` for most projects, `high` for strict design systems, `low` only for legacy projects without complete design systems.

---

## Bypass Mechanism

### When to Allow Bypass

**Legitimate bypass scenarios:**
1. Legacy project with no design system
2. Experimental/prototype work
3. Design system itself is being built
4. User explicitly approves inline implementation

### Bypass Process

```typescript
if (gateResult.gate === 'FAIL') {
  const userApproval = await askUserQuestion({
    question: `
      Customization gate detected needs for:
      ${gateResult.requiredActions.map(a => `- ${a.action}`).join('\n')}

      Options:
      1. Update design system first (recommended)
      2. Bypass gate and implement with inline values (not recommended)

      Which approach?
    `,
    options: [
      { label: 'Update design system', description: 'Proper approach, takes longer' },
      { label: 'Bypass (inline)', description: 'Quick but creates tech debt' }
    ]
  });

  if (userApproval === 'Bypass (inline)') {
    // Log bypass as tech debt
    await saveTechDebt({
      type: 'design_system_gap',
      description: 'Customization gate bypassed',
      items: gateResult.requiredActions,
      created: new Date()
    });

    // Allow progression with warning
    return {
      gate: 'BYPASSED',
      allowProgression: true,
      warning: 'Tech debt created - clean up later'
    };
  }
}
```

---

## Success Metrics

Track gate effectiveness:

```sql
-- In vibe.db events table
SELECT
  COUNT(*) as total_runs,
  SUM(CASE WHEN result = 'PASS' THEN 1 ELSE 0 END) as passed,
  SUM(CASE WHEN result = 'FAIL' THEN 1 ELSE 0 END) as blocked,
  SUM(CASE WHEN result = 'BYPASSED' THEN 1 ELSE 0 END) as bypassed
FROM events
WHERE type = 'customization_gate'
  AND timestamp > date('now', '-30 days');
```

**Healthy Metrics:**
- Pass rate: 70-80% (most requests use existing tokens)
- Block rate: 15-25% (catching real customization needs)
- Bypass rate: <5% (rare legitimate bypasses)

**Unhealthy Patterns:**
- Pass rate <50%: Gate too strict or design system incomplete
- Block rate >40%: Design system doesn't match real needs
- Bypass rate >20%: Gate being circumvented, not respected

---

_Customization Gate: Preventing inline styles through early detection._
