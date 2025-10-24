# Component Library - Universal Design System Primitives

**Status:** Phase 2 - Component Library
**Purpose:** Make correct code EASIER than incorrect code
**Prevention Rate:** +7% (Layer 3 of Hybrid Approach)

---

## Overview

This component library provides **type-safe primitives** that make design system violations **impossible at compile time**.

Instead of:
```jsx
// ❌ Hardcoded, error-prone
<div style={{ padding: '23px', color: '#D4AF37', gap: '5px' }}>
  <span style={{ fontSize: '18px', fontFamily: 'Domaine' }}>Title</span>
  <div>Content</div>
</div>
```

Use:
```jsx
// ✅ Type-safe, design-system-compliant
<Box padding="8" color="accent-gold-bright">
  <Stack spacing="tight">
    <Text variant="card-title">Title</Text>
    <Text variant="body">Content</Text>
  </Stack>
</Box>
```

---

## Primitives

### Stack - Semantic Spacing

**Prevents:** Wrong spacing hierarchy violations

**Usage:**
```jsx
import { Stack, VStack, HStack } from '@/components/primitives';

// Separate cards
<Stack spacing="cards">
  <Card />
  <Card />
  <Card />
</Stack>

// Navigation to content
<Stack spacing="sections">
  <Navigation />
  <MainContent />
</Stack>

// Tight icon + label
<HStack spacing="tight" align="center">
  <Icon />
  <span>Label</span>
</HStack>
```

**Spacing Levels:**
- `tight` (4px) - Very related elements
- `list` (8px) - List items
- `related` (16px) - Related elements
- `cards` (16px) - Separate cards
- `sections` (32px) - Major sections
- `page` (120px) - Page sections

**Benefits:**
- Developer thinks "cards" → system applies correct token
- Self-documenting code
- Can't use wrong spacing for context (type-safe)

---

### Box - Universal Layout

**Prevents:** Hardcoded padding, margins, colors

**Usage:**
```jsx
import { Box } from '@/components/primitives';

// Card
<Box
  padding="8"
  background="surface"
  borderColor="border"
  borderRadius="card"
>
  Content
</Box>

// Section
<Box paddingY="16" background="background">
  <h1>Section</h1>
</Box>

// Badge
<Box
  display="inline-flex"
  paddingX="3"
  paddingY="1"
  background="accent-gold-soft"
  borderRadius="pill"
>
  Badge
</Box>
```

**Props:**
- **Spacing:** `padding`, `paddingX`, `paddingY`, `padding{Top|Right|Bottom|Left}`
- **Colors:** `color`, `background`, `borderColor`
- **Border:** `borderRadius`, `borderWidth`
- **Sizing:** `width`, `height`, `maxWidth`

**Benefits:**
- Can't use `padding="23px"` → Type error
- Must use `padding="8"` → Maps to `var(--space-8)`
- All values are design tokens (zero hardcoded values)

---

### Text - Typography Primitive

**Prevents:** Typography violations (wrong fonts, sizes, weights)

**Usage:**
```jsx
import { Text } from '@/components/primitives';

// Page title
<Text variant="h1">Protocol Tracker</Text>

// Section heading
<Text variant="h2" color="muted">Getting Started</Text>

// Body text
<Text variant="body">
  This protocol helps you track compounds.
</Text>

// Label
<Text variant="label" color="muted">Week 1</Text>

// Card title
<Text variant="card-title">BPC-157</Text>

// Data
<Text variant="mono" color="accent-gold">250mcg</Text>
```

**Variants:**
- `display` - Hero text (Domaine 48-280px)
- `h1` - Page titles (Domaine 36-72px)
- `h2` - Section headings (GT Pantheon 24-32px)
- `h3` - Subsection headings (GT Pantheon 18-24px)
- `body` - Body text (Supreme LL 14-16px)
- `label` - Labels (Supreme LL 12-14px, uppercase)
- `mono` - Code/data (Brown LL Mono 14-15px)
- `card-title` - Card titles (Domaine 24-32px)

**Benefits:**
- Can't use Domaine below 24px (not in variants)
- Can't make labels italic (not in styles)
- Responsive by default (clamp)
- Self-documenting variants

---

## Installation

### Step 1: Copy Primitives to Project

```bash
# Copy to your project
cp -r ~/claude-vibe-code/obdn-design-automation/component-library/primitives \
      ~/your-project/src/components/
```

### Step 2: Customize Token Mappings

Edit each primitive to match your design system:

**Stack.tsx:**
```typescript
const SPACING_MAP: Record<SpacingLevel, string> = {
  tight: 'var(--space-1)',      // Customize for your tokens
  list: 'var(--space-2)',
  related: 'var(--space-4)',
  cards: 'var(--space-4)',
  sections: 'var(--space-8)',
  page: 'var(--space-30)',
};
```

**Box.tsx:**
```typescript
export type SpacingToken =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12'
  | '16' | '20' | '24' | '30' | '36' | '40' | '64';  // Add your tokens

export type ColorToken =
  | 'primary' | 'secondary' | 'accent-gold'          // Add your colors
  | 'text-primary' | 'text-secondary'
  | 'background' | 'surface';
```

**Text.tsx:**
```typescript
const VARIANT_STYLES: Record<TextVariant, React.CSSProperties> = {
  h1: {
    fontFamily: 'var(--font-display)',      // Customize fonts
    fontSize: 'clamp(36px, 5vw, 72px)',     // Customize sizes
    fontWeight: 200,                        // Customize weights
    // ...
  },
  // ...
};
```

### Step 3: Add TypeScript Path Alias (Optional)

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/components/*": ["./src/components/*"]
    }
  }
}
```

### Step 4: Import and Use

```typescript
import { Stack, Box, Text } from '@/components/primitives';

export default function Page() {
  return (
    <Box padding="16" background="background">
      <Stack spacing="sections">
        <Text variant="h1">Welcome</Text>
        <Stack spacing="cards">
          <Card />
          <Card />
        </Stack>
      </Stack>
    </Box>
  );
}
```

---

## Migration Strategy

### Phase 1: Install and Test

1. Copy primitives to project
2. Customize token mappings
3. Create one test component using primitives
4. Verify it works and looks correct

### Phase 2: Gradual Adoption

1. Use primitives for ALL new components
2. Refactor existing components incrementally
3. Start with high-visibility pages
4. Track adoption rate (target: 80%+ in 2 months)

### Phase 3: Enforce Usage

1. Add ESLint rule: Prefer primitives over raw divs/spans
2. Pre-commit hook: Check for inline styles
3. Code review: Flag hardcoded values
4. Dashboard: Track primitive usage %

---

## Benefits

### 1. Compile-Time Prevention

```typescript
// ❌ Type error at compile time
<Box padding="23px">  // Error: "23px" is not assignable to SpacingToken

// ✅ Only valid tokens accepted
<Box padding="8">     // Maps to var(--space-8)
```

### 2. Self-Documenting Code

```jsx
// Before: What does this mean?
<div style={{ gap: '16px' }}>

// After: Semantic, clear intent
<Stack spacing="cards">
```

### 3. Design System Consistency

```typescript
// Change spacing globally
const SPACING_MAP = {
  cards: 'var(--space-5)',  // Changed from space-4 to space-5
};

// All <Stack spacing="cards"> update automatically
// No need to find/replace hardcoded values
```

### 4. Reduced Inline Styles

```jsx
// Before: Inline styles everywhere
<div style={{
  padding: 'var(--space-8)',
  gap: 'var(--space-4)',
  display: 'flex',
  flexDirection: 'column'
}}>

// After: Zero inline styles
<Box padding="8">
  <Stack spacing="related">
```

### 5. Faster Development

```jsx
// Before: Look up tokens, type var(--...)
<div style={{ padding: 'var(--space-8)' }}>  // Slow, error-prone

// After: Autocomplete + type-safe
<Box padding="8">  // Fast, can't typo
```

---

## Comparison: Before vs After

### Before (Without Primitives)

**tracker page (70/80 score):**
```css
/* page.module.css */
.weekSlider {
  margin-bottom: var(--space-2); /* ❌ Wrong context */
}

.timeBlocks {
  gap: var(--space-1); /* ❌ Cards squished */
}

.dayLinkActive {
  color: #D4AF37; /* ❌ Hardcoded */
}
```

**Issues:**
- Uses tokens but wrong context (space-2 for sections)
- Hardcoded colors
- No semantic meaning
- Easy to get wrong

### After (With Primitives)

```jsx
import { Stack, Box, Text } from '@/components/primitives';

export default function Tracker() {
  return (
    <Box padding="16" background="background">
      <Stack spacing="sections">
        <WeekSlider />
        <Stack spacing="sections">
          <DayNav />
          <Stack spacing="cards">
            <TimeBlock />
            <TimeBlock />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
```

**Benefits:**
- ✅ Correct spacing automatically (sections = 32px, cards = 16px)
- ✅ No hardcoded colors possible
- ✅ Semantic, self-documenting
- ✅ Type-safe, can't get wrong

---

## Expected Impact

### Adoption Metrics

| Metric | Without Primitives | With Primitives | Improvement |
|--------|-------------------|-----------------|-------------|
| Inline styles | 20+ per protocol | 0-2 per protocol | -90% |
| Hardcoded values | 3-6 per protocol | 0 per protocol | -100% |
| Spacing violations | 3+ per protocol | 0 per protocol | -100% |
| Dev time per component | 15-20 min | 10-12 min | -40% |
| First-attempt compliance | 70% | 95%+ | +25% |

### Compliance Improvement

| Project | Baseline | After Phase 1 | After Phase 2 | Target |
|---------|----------|---------------|---------------|--------|
| OBDN | 70/80 (87%) | 80/80 (100%) | 80/80 (100%) | 100% |
| peptide | 70/80 (87%) | 80/80 (100%) | 80/80 (100%) | 100% |

**Phase 2 maintains 100% compliance** by making violations impossible

---

## Roadmap

### Completed ✅
- Stack (semantic spacing)
- Box (universal layout)
- Text (typography primitive)

### Next Steps (Week 3-4)
- Button (primary, secondary, outline variants)
- Card (surface, elevated, tinted variants)
- Badge (info, featured, alert, neutral)
- Input (text, number with design tokens)

### Future (Month 2)
- Grid (bento grid system)
- Modal (overlays, dialogs)
- Navigation (header, sidebar)
- Form (complete form system)

---

## Resources

- **Ultra-Think Analysis:** Component library strategy (Layer 3)
- **Installation Guide:** enforcement/INSTALLATION_GUIDE.md
- **Phase 1 Report:** PHASE_01_DELIVERY_REPORT.md

---

**Status:** ✅ Ready to deploy
**Installation Time:** 15 minutes (copy + customize)
**Expected Adoption:** 80%+ in 2 months
**Compliance Impact:** Maintains 100% after Phase 1

---

**Questions?** Check individual component files for detailed documentation and examples.
