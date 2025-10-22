# Universal Design Guidelines
**A Generic Design System Based on Professional Patterns**

*Created from battle-tested principles*

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Typography System](#typography-system)
3. [Color System](#color-system)
4. [Spacing & Layout](#spacing--layout)
5. [Alignment Rules](#alignment-rules)
6. [Component Patterns](#component-patterns)
7. [Animation & Motion](#animation--motion)
8. [Implementation Guide](#implementation-guide)
9. [Quality Checklist](#quality-checklist)

---

## Design Philosophy

### Three Core Principles

1. **Alignment**: Everything aligns to a 4px grid. Rounded elements get optical alignment adjustments. No exceptions.

2. **Balance**: Spacing, typography, color work in harmony. Dense when focused, spacious when scanning. Never cluttered, never empty.

3. **The "Eyes Test"**: Close your eyes. Open them. Attention snaps to the most important element instantly. If it doesn't, redesign.

### Design Values

- **Clarity over cleverness**: Every element serves a purpose
- **Hierarchy through restraint**: Not everything can be important
- **Breathing room**: White space is a feature, not waste
- **Consistency builds trust**: Patterns should be predictable
- **Performance is design**: Speed is a feature

---

## Typography System

### Font Role Categories

Instead of specific fonts, define roles that any font family can fill:

#### Display Font (Role 1)
- **Purpose**: Brand moments, hero titles, major headings
- **Characteristics**: Distinctive, elegant, often lighter weight
- **Sizes**: Large scale (48px-280px for heroes, 24px-48px for cards)
- **Minimum Size**: 24px (critical - never smaller)
- **Usage**: Card titles, page heroes, feature names
- **Note**: Choose a font that's readable at thin weights

#### Heading Font (Role 2)
- **Purpose**: Section headers in content/prose
- **Characteristics**: Clear, professional, good weight range
- **Sizes**: 20px-36px
- **Usage**: Article headings, section dividers
- **Note**: Should contrast with body font

#### Body Font (Role 3)
- **Purpose**: Primary content, descriptions, UI labels
- **Characteristics**: Highly readable, multiple weights
- **Sizes**: 14px-18px
- **Usage**: Paragraphs, lists, labels, descriptions
- **Note**: Must have excellent readability at small sizes

#### Accent Font (Role 4)
- **Purpose**: Quotes, taglines, special callouts
- **Characteristics**: Can be italic or distinctive style
- **Sizes**: 14px-24px
- **Usage**: Taglines, pull quotes, emphasis
- **Note**: Use sparingly for impact

#### Mono Font (Role 5)
- **Purpose**: Code, technical specs, data tables
- **Characteristics**: Fixed-width, clear character distinction
- **Sizes**: 14px-15px
- **Usage**: Code blocks, technical data
- **Note**: Never use for regular content

### Type Scale Framework

Create a consistent scale using these ratios:

#### Display Sizes
- **Hero**: Base × 4.5 (e.g., 16px × 4.5 = 72px)
- **Title**: Base × 3 (e.g., 16px × 3 = 48px)
- **Headline**: Base × 2.25 (e.g., 16px × 2.25 = 36px)

#### Content Sizes
- **Large**: Base × 1.5 (e.g., 16px × 1.5 = 24px)
- **Body**: Base × 1 (e.g., 16px)
- **Small**: Base × 0.875 (e.g., 16px × 0.875 = 14px)
- **Caption**: Base × 0.75 (e.g., 16px × 0.75 = 12px)

### Typography Rules

#### Hard Rules (Never Break)
- **Minimum readable size**: 14px for body text
- **Maximum line length**: 700px (45-75 characters)
- **Line height**: 1.5-1.8 for body, 1.1-1.3 for headings
- **Letter spacing for uppercase**: 0.08em-0.2em
- **Labels are NEVER italic**: Uppercase labels must be regular weight

#### Weight Guidelines
- **Thin/Light (200-300)**: Large display text only (24px+)
- **Regular (400)**: Default for most text
- **Medium (500)**: Emphasis without bold
- **Bold (600-700)**: Strong emphasis, buttons

### Responsive Typography

Use fluid typography with clamps:

```css
/* Example fluid scale */
--text-hero: clamp(36px, 5vw, 72px);
--text-title: clamp(24px, 4vw, 48px);
--text-heading: clamp(20px, 3vw, 36px);
--text-body: clamp(14px, 1.5vw, 18px);
```

---

## Color System

### Color Roles (Not Specific Colors)

Define colors by their function, not their hue:

#### Foundation Colors
- **Background-Primary**: Main page background
- **Background-Secondary**: Slightly elevated surfaces
- **Background-Tertiary**: Further elevated/modal backgrounds

#### Text Hierarchy (Using Opacity)
- **Text-Primary**: 100% opacity - Titles, headings
- **Text-High**: 90% opacity - Important content
- **Text-Medium**: 85% opacity - Descriptions
- **Text-Body**: 75% opacity - Main content
- **Text-Subdued**: 60% opacity - Labels, helpers
- **Text-Subtle**: 50% opacity - Low emphasis
- **Text-Faint**: 40% opacity - Minimal emphasis

#### Accent Colors
- **Accent-Primary**: Main brand color for CTAs, highlights
- **Accent-Secondary**: Supporting accent
- **Accent-Success**: Positive states
- **Accent-Warning**: Caution states
- **Accent-Error**: Error states

#### Surface Colors
- **Surface-Raised**: 5% opacity white/black - Hover states
- **Surface-Base**: 3% opacity - Default cards
- **Surface-Subtle**: 2% opacity - Subtle containers

#### Border Colors
- **Border-Default**: 10% opacity - Primary borders
- **Border-Subtle**: 8% opacity - Low emphasis
- **Border-Faint**: 5% opacity - Minimal separation

### Color Application Rules

1. **Use opacity for hierarchy**: Higher opacity = more important
2. **Reserve accent colors**: Use sparingly for impact
3. **Maintain WCAG AA contrast**: 4.5:1 for body, 3:1 for large text
4. **Layer surfaces subtly**: Each elevation is barely noticeable
5. **Test in both light and dark**: Ensure system works in both modes

---

## Spacing & Layout

### 4px Base Grid System

All spacing must be multiples of 4px:

```css
--space-1: 4px;    /* Micro adjustments */
--space-2: 8px;    /* Tight spacing */
--space-3: 12px;   /* Small gaps */
--space-4: 16px;   /* Default spacing */
--space-5: 20px;   /* Medium gaps */
--space-6: 24px;   /* Comfortable spacing */
--space-8: 32px;   /* Section spacing */
--space-10: 40px;  /* Large spacing */
--space-12: 48px;  /* Major gaps */
--space-16: 64px;  /* Section dividers */
--space-20: 80px;  /* Large sections */
--space-24: 96px;  /* Page sections */
```

### Container System

```css
/* Responsive container */
.container {
  max-width: 1600px;  /* Prevent excessive width */
  margin: 0 auto;
  padding: var(--space-10) var(--space-5); /* 40px 20px */
}

@media (min-width: 768px) {
  .container {
    padding: var(--space-16) var(--space-8); /* 64px 32px */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: var(--space-20) var(--space-10); /* 80px 40px */
  }
}
```

### Content Width Rules

- **Body text max-width**: 700px (optimal reading)
- **Card max-width**: 400px (small), 600px (medium), 100% (large)
- **Form max-width**: 480px (single column)
- **Table max-width**: 100% (responsive scroll)

---

## Alignment Rules

### Optical Alignment Principles

#### Mathematical ≠ Visual
Human perception differs from geometric center. Always trust your eyes over the ruler.

#### Triangle/Pointed Shapes
Shift 5-8% toward the pointed direction:
```css
.play-icon {
  /* Shift right for optical center */
  transform: translateX(2px);
}
```

#### Icon-to-Text Alignment
- Icons need 1-2px upward nudge to align with x-height
- Use 50% more spacing between icon and text than text-only
- Maximum icon size: 20px (24px for heroes only)

#### Border Weight Compensation
```css
/* Without border */
.card { padding: 24px; }

/* With 2px border */
.card-bordered {
  padding: 22px; /* 24px - 2px */
  border: 2px solid var(--border-default);
}
```

### Grid Alignment for Cards

#### Method 1: CSS Grid with Spacer Rows
```css
.card {
  display: grid;
  grid-template-rows:
    auto    /* Header */
    auto    /* Content */
    1fr     /* Spacer - absorbs height differences */
    auto;   /* Footer - aligns across siblings */
}
```

#### Method 2: Fixed Internal Structure
Every card type must have:
1. Identical grid template
2. Same number of children
3. Flexible spacer before footer
4. No wrapper divs

### The Eyes Test

**Verification method:**
1. Close your eyes
2. Open them quickly
3. Note what grabs attention first
4. If it's not the primary action/info, adjust hierarchy

---

## Component Patterns

### Cards

```css
.card {
  background: var(--surface-base);
  border: 1px solid var(--border-default);
  border-radius: 12px;
  padding: var(--space-6);
  transition: all 0.2s ease-out;
}

.card:hover {
  background: var(--surface-raised);
  transform: translateY(-2px);
  border-color: var(--accent-primary-soft);
}
```

### Buttons

```css
.button {
  padding: var(--space-3) var(--space-6);
  border-radius: 8px;
  font-weight: 500;
  text-transform: none; /* or uppercase for labels */
  letter-spacing: 0.02em;
  transition: all 0.2s ease-out;
  min-height: 44px; /* Touch target */
}

.button-primary {
  background: var(--accent-primary);
  color: var(--text-on-accent);
}

.button-secondary {
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-primary);
}
```

### Forms

```css
.input {
  padding: var(--space-3) var(--space-4);
  background: var(--surface-base);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  min-height: 48px;
  font-size: 16px; /* Prevents zoom on mobile */
}

.input:focus {
  background: var(--surface-raised);
  border-color: var(--accent-primary);
  outline: 3px solid var(--accent-primary-faint);
}

.label {
  display: block;
  margin-bottom: var(--space-2);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 12px;
}
```

### Tables

```css
.table {
  width: 100%;
  border: 1px solid var(--border-default);
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  background: var(--surface-raised);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-default);
}

.table-row {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-faint);
}

.table-row:hover {
  background: var(--surface-subtle);
}
```

---

## Animation & Motion

### Core Principles

- **Purposeful**: Every animation serves a function
- **Subtle**: Maximum 2px translate, 0.3s duration
- **Consistent**: Same easing throughout (ease-out)
- **Performance**: Use transform and opacity only

### Standard Transitions

```css
:root {
  --transition-fast: 0.15s ease-out;
  --transition-base: 0.2s ease-out;
  --transition-slow: 0.3s ease-out;
}
```

### Hover States

```css
/* Lift pattern */
.card:hover {
  transform: translateY(-2px);
}

/* Scale pattern (icons) */
.icon:hover {
  transform: scale(1.05);
}

/* Opacity pattern (images) */
.image:hover {
  opacity: 0.9;
}
```

### Loading States

```css
/* Spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-default);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Skeleton */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.skeleton {
  background: var(--surface-base);
  animation: pulse 1.5s ease-in-out infinite;
}
```

---

## Implementation Guide

### CSS Custom Properties Setup

```css
:root {
  /* Base unit */
  --base-unit: 4px;

  /* Typography scale */
  --text-scale-ratio: 1.25;

  /* Spacing scale (4px base) */
  --space-1: calc(var(--base-unit) * 1);    /* 4px */
  --space-2: calc(var(--base-unit) * 2);    /* 8px */
  --space-3: calc(var(--base-unit) * 3);    /* 12px */
  --space-4: calc(var(--base-unit) * 4);    /* 16px */
  --space-5: calc(var(--base-unit) * 5);    /* 20px */
  --space-6: calc(var(--base-unit) * 6);    /* 24px */
  --space-8: calc(var(--base-unit) * 8);    /* 32px */

  /* Border radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;

  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);

  /* Z-index scale */
  --z-base: 1;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;
}
```

### Responsive Breakpoints

```css
/* Mobile-first approach */
/* Base styles: 0-479px */

/* Small tablets */
@media (min-width: 480px) { }

/* Tablets */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large screens */
@media (min-width: 1600px) { }
```

---

## Quality Checklist

### Before Shipping

#### Typography
- [ ] All text meets minimum size requirements (14px body)
- [ ] Line lengths don't exceed 700px
- [ ] Uppercase labels have proper letter-spacing
- [ ] Font weights appropriate for size
- [ ] Responsive scaling works on all devices

#### Colors
- [ ] Contrast ratios meet WCAG AA
- [ ] Hierarchy clear through opacity
- [ ] Accent colors used sparingly
- [ ] Works in light and dark modes
- [ ] No random colors outside system

#### Spacing
- [ ] Everything snaps to 4px grid
- [ ] Consistent use of spacing variables
- [ ] No arbitrary values (17px, 23px, etc.)
- [ ] Padding compensates for borders
- [ ] Sections have breathing room

#### Alignment
- [ ] Cards in same row have equal height
- [ ] Footers align across siblings
- [ ] Icons optically aligned with text
- [ ] Triangular shapes shifted appropriately
- [ ] The Eyes Test passes

#### Components
- [ ] Touch targets ≥44px
- [ ] Hover states subtle (2px max)
- [ ] Focus states visible
- [ ] Loading states implemented
- [ ] Error states designed

#### Performance
- [ ] Animations use transform/opacity only
- [ ] Transitions ≤0.3s
- [ ] No layout thrashing
- [ ] Images optimized
- [ ] Fonts loaded efficiently

### Do's and Don'ts

#### Do's ✓
- Use the spacing scale consistently
- Test the Eyes Test frequently
- Document optical adjustments
- Maintain consistent patterns
- Prioritize readability

#### Don'ts ✗
- Mix arbitrary values
- Use excessive animation
- Ignore optical alignment
- Break the grid without reason
- Sacrifice usability for aesthetics

---

## Implementation Tips

### Start With Structure
1. Define your base unit (4px recommended)
2. Create your spacing scale
3. Set up your type scale
4. Define color roles
5. Build components using the system

### Maintain Discipline
- Every spacing value must come from the scale
- Every color must have a role
- Every animation must have a purpose
- Every break from the system needs justification

### Test Constantly
- Close your eyes, open them (Eyes Test)
- Check on real devices
- Test with real content
- Verify accessibility
- Measure performance

---

This design system provides a foundation for consistent, professional interfaces. It's not about specific fonts or colors—it's about the principles and patterns that make designs feel cohesive and intentional.

Remember: **Great design is invisible. When done right, users don't think about the interface—they accomplish their goals.**