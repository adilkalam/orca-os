---
description: Display your learned design system with patterns, rules, and confidence levels
allowed-tools: ["Read", "Grep", "TodoWrite"]
---

# Show-Design-System - View Your Personal Design Language

Display your complete learned design system including patterns, rules, confidence scores, and usage guidelines.

## Usage

```
/show-design-system

Options:
/show-design-system --patterns    # Show only patterns
/show-design-system --rules       # Show only rules
/show-design-system --confidence  # Show confidence report
/show-design-system --generate    # Generate design system files
```

## Output Format

```markdown
# Your Personal Design System

Generated from: [X] liked examples, [Y] disliked examples
Last updated: [timestamp]
Training completeness: [percentage]

---

## Color Patterns

### Primary Palette
**Confidence: 92%** (based on 10 examples)

- Primary: #2563EB
  - Usage: < 10% of surface
  - Context: CTAs, active states, links
  - Evidence: example_001, 003, 005, 007

- Surface: #F9FAFB
  - Usage: Cards, containers
  - Context: Background surfaces
  - Evidence: example_001, 002, 003, 005, 006

- Text: #111827 (primary), #6B7280 (secondary)
  - Usage: Content hierarchy
  - Context: All text content
  - Evidence: All examples

### Color Relationships
- Background → Surface → Primary (3-level depth)
- Accent usage: < 5% additional color
- Monochrome bias with strategic color

---

## Spacing Patterns

### Grid System
**Confidence: 88%** (based on 8 examples)

- Base unit: 8px
- Scale: [8, 16, 24, 32, 48, 64, 96]
- Evidence: example_001, 002, 003, 005, 006, 007

### Component Spacing
**Confidence: 90%** (based on 9 examples)

- Card padding: 32px (preferred), 24-48px (range)
- Section spacing: 64px between major sections
- Element spacing: 16px between related items
- Evidence: example_001, 003, 005, mockup_001 feedback

### Whitespace Ratio
**Confidence: 85%** (based on 7 examples)

- Preferred: 45-55% content, 45-55% whitespace
- Maximum density: 65% content
- Minimum density: 35% content
- Evidence: example_001, 003, 005, 007

---

## Typography Patterns

### Font Families
**Confidence: 87%** (based on 9 examples)

- Sans: Inter (primary)
- Fallback: system-ui, -apple-system, sans-serif
- Mono: JetBrains Mono (code contexts)
- Evidence: example_001, 002, 003, 005, 006

### Type Scale
**Confidence: 85%** (based on 8 examples)

| Size | Usage | Weight |
|------|-------|--------|
| 32px | Page headers | 700 |
| 24px | Section headers | 600 |
| 20px | Card headers | 600 |
| 16px | Body text | 400 |
| 14px | Secondary text | 400 |
| 12px | Labels, captions | 400 |

Evidence: example_001, 002, 003, 005, 006, 007

### Hierarchy Rules
**Confidence: 90%** (based on 10 examples)

- Maximum 4 distinct sizes per screen
- Clear visual hierarchy (1.5-2x size jumps)
- Weight variation: 400 (normal), 600 (medium), 700 (bold)
- Evidence: All examples

---

## Layout Patterns

### Dashboard Layout
**Confidence: 88%** (based on 6 examples)

- Type: Card-based grid
- Columns: 12-column system
- Gaps: 24px between cards
- Max width: 1200px, centered
- Evidence: example_001, 003, 005, 007

### Form Layout
**Confidence: 72%** (based on 4 examples - need more!)

- Type: Single column, left-aligned
- Input spacing: 24px vertical gap
- Label position: Above input
- Button alignment: Left-aligned primary action
- Evidence: example_002, 004, 006

⚠️ Low confidence - consider adding more form examples

### Mobile Layout
**Confidence: 52%** (based on 3 examples - need more!)

- Single column stacking
- Touch targets: 44px minimum
- Reduced padding: 16-24px
- Evidence: example_006, 008

❌ Low confidence - need more mobile examples

---

## Design Rules

### Rule 1: Restrained Color Usage
**Category:** Color | **Confidence:** 92%

WHEN: Creating any interface
MUST: Use primary color for < 10% of surface area
BECAUSE: 9/10 examples show this restraint
EVIDENCE: example_001, 003, 005, 007, 008, 009
EXCEPTIONS: Marketing/landing pages

### Rule 2: Generous Whitespace
**Category:** Spacing | **Confidence:** 88%

WHEN: Creating card-based layouts
MUST: Use minimum 32px padding on cards
BECAUSE: Consistent preference, reinforced by mockup feedback
EVIDENCE: example_001, 003, 005, mockup_001 feedback
EXCEPTIONS: Mobile (<640px) can reduce to 24px

### Rule 3: Clear Visual Hierarchy
**Category:** Typography | **Confidence:** 90%

WHEN: Displaying content
MUST: Use maximum 4 distinct text sizes per screen
BECAUSE: Clarity over variety across all examples
EVIDENCE: example_001, 002, 003, 005, 006, 007, 008
EXCEPTIONS: Marketing content can use more variation

### Rule 4: Subtle Depth
**Category:** Visual Treatment | **Confidence:** 78%

WHEN: Creating elevation
MUST: Use subtle shadows, not borders
BECAUSE: Consistent preference for soft depth
EVIDENCE: example_001, 003, 005, 007
EXCEPTIONS: Form inputs can use borders

### Rule 5: Information Density Limit
**Category:** Layout | **Confidence:** 85%

WHEN: Displaying information
MUST: Keep content density < 65%
BECAUSE: Higher density consistently disliked
EVIDENCE: antiexample_001, 002 (avoided), example_001, 003 (preferred)
EXCEPTIONS: Data tables can be denser if necessary

---

## Anti-Patterns (To Avoid)

### Anti-Pattern 1: Excessive Color
**Confidence:** 88%

AVOID: Using color for > 15% of surface
CREATES: Visual noise, unclear hierarchy
EVIDENCE: antiexample_003, mockup_002 negative feedback

### Anti-Pattern 2: High Information Density
**Confidence:** 90%

AVOID: Content density > 70%
CREATES: Overwhelming, cramped feeling
EVIDENCE: antiexample_001, 002

### Anti-Pattern 3: Too Many Type Sizes
**Confidence:** 82%

AVOID: > 5 distinct text sizes per screen
CREATES: Hierarchy confusion
EVIDENCE: antiexample_004, preference for simplicity

---

## Confidence Report

### Pattern Strength

**Very Strong (>= 85%):**
- ✅ Color restraint: 92%
- ✅ Typography hierarchy: 90%
- ✅ Card patterns: 92%
- ✅ Spacing system: 88%
- ✅ Information density: 85%

**Strong (75-84%):**
- ✅ Shadow usage: 78%
- ✅ Anti-pattern identification: 82%
- ✅ Border radius: 80%

**Developing (60-74%):**
- ⚠️ Form patterns: 72%
- ⚠️ Button styling: 70%

**Needs More Data (< 60%):**
- ❌ Mobile navigation: 52%
- ❌ Animation preferences: 45%
- ❌ Data visualization: 38%

### Recommendations

To improve confidence:
1. **Add 3-5 more form examples** (currently only 4)
2. **Provide mobile navigation examples** (currently only 3)
3. **Share examples with animations** to learn motion preferences
4. **Include data visualization** examples (charts, graphs)

---

## Usage Guidelines

### When Generating Mockups

1. **High confidence patterns (>80%)**: Apply automatically
2. **Medium confidence (60-80%)**: Apply with variations to explore
3. **Low confidence (<60%)**: Ask for clarification first

### In Implementation

```html
<!-- Example using learned patterns -->
<div class="bg-surface p-8 rounded-lg shadow-sm max-w-4xl">
  <!-- Using spacing-system: 32px padding (88% confidence) -->
  <!-- Using border-radius: 8px (80% confidence) -->
  <!-- Using shadow: subtle depth (78% confidence) -->

  <h2 class="text-xl font-semibold text-gray-900">
    <!-- Using typography: 20px / 600 (85% confidence) -->
    Card Header
  </h2>

  <p class="text-sm text-gray-600 mt-4">
    <!-- Using typography: 14px / 400 (85% confidence) -->
    <!-- Using spacing: 16px gap (90% confidence) -->
    Card content with learned spacing and typography
  </p>

  <button class="bg-primary text-white px-6 py-3 rounded-lg mt-6">
    <!-- Using color: < 10% surface (92% confidence) -->
    <!-- Using spacing: 24px/12px padding (88% confidence) -->
    Primary Action
  </button>
</div>
```

---

## Export Options

### Generate Design System Files
```
/show-design-system --generate
```

Creates:
- `tokens.json` - Design tokens for code
- `components.md` - Component patterns
- `rules.md` - Design rules documentation
- `tailwind.config.js` - Tailwind configuration

### Integration

Use in your projects:
1. Import tokens into your build system
2. Reference rules in design reviews
3. Share with team members
4. Sync with Figma/design tools

---

## Next Steps

1. **If training incomplete:** `/train-design --initial`
2. **To add examples:** `/train-design --add-liked [path]`
3. **To generate mockups:** `/generate-mockup [description]`
4. **To export system:** `/show-design-system --generate`

Your design system evolves with every example and feedback!
```

## Remember

This is YOUR personal design language - not generic principles, but patterns extracted from what YOU love.

Confidence scores show how certain we are about each pattern. Higher confidence = more consistent across your examples.

Low confidence patterns are opportunities to add more examples and strengthen learning.