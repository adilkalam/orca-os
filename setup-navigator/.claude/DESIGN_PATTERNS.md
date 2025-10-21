# Design Pattern Reference Library

**Purpose:** Train agents on what makes designs elegant by providing curated examples from this codebase.

**Usage:** Agents MUST read relevant patterns before designing anything.

---

## Protocol Pages

### Reference: Anti-Aging Protocol
**File:** `app/protocols/anti-aging/page.tsx`

**Why This Works:**
1. **Timeline is Hero** - User's primary goal (see the protocol) is immediately visible
2. **Progressive Disclosure** - Details available but not overwhelming (modal/expand pattern)
3. **Compact Cards** - Information-dense but scannable, not dominating
4. **Visual Rhythm** - Clear hierarchy: Large (timeline) → Medium (cards) → Small (details)

**Visual Hierarchy:**
```
┌─────────────────────────────────────┐
│  TIMELINE (Hero, Domaine 48px)      │ ← Primary goal
│  [Phase 1] [Phase 2] [Phase 3]      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  COMPOUND CARDS (Compact)           │ ← Secondary info
│  [Card] [Card] [Card]                │
│  Click to expand mechanism details   │
└─────────────────────────────────────┘
```

**Spacing Pattern:**
- Hero to cards: 48px
- Card to card: 24px
- Inside cards: 16px padding
- Mathematical scale: 16 → 24 → 32 → 48

**Typography Scale:**
- Hero title: Domaine Sans Display 48px (sophisticated authority)
- Section headers: GT Pantheon 32px (readable structure)
- Card titles: GT Pantheon 24px (clear hierarchy)
- Body text: Supreme LL 16px (UI clarity)
- Labels: Supreme LL 14px (NOT 300 weight - maintain readability!)

**Typography Personality:**
- Domaine = Sophisticated, authoritative, elegant
- GT Pantheon = Readable, structured, timeless
- Supreme LL = Clear, functional, UI-focused

**Study font reviews:** See `~/.claude/design-inspiration/typography/REVIEWS.md` to understand
what makes these fonts beautiful and how they work together.

**Color Usage:**
- Gold accent (#D4AF37) for emphasis only (CTAs, highlights)
- White (#FFFFFF) for primary text
- Never faded white (rgba) - only use design system colors

**When to Use This Pattern:**
- Protocol reference pages
- Any information lookup page
- Dense content that needs scanning
- Reference sheets

**Anti-Pattern (Don't Do This):**
- ❌ Protocol buried below massive cards
- ❌ Two giant intro cards dominating screen
- ❌ Full bento grid taking vertical space
- ❌ Primary content hidden after scroll

---

## Landing Pages

### Reference: [To be documented]
**File:** `app/page.tsx` or similar

**Pattern:** [Document your best landing page pattern]

---

## Component Cards

### Reference: [To be documented]
**Pattern:** [Document card patterns that work]

---

## Navigation

### Reference: [To be documented]
**Pattern:** [Document navigation that works]

---

## How to Use This Library

### For Agents:

**BEFORE designing anything:**
1. Read relevant pattern from this file
2. Study the reference file path
3. Extract the "Why This Works" principles
4. Apply pattern to new context (don't copy blindly)

**DURING design:**
- Match visual hierarchy to reference
- Use same spacing scale
- Follow typography patterns
- Apply color usage rules

**AFTER implementation:**
- Compare to reference elegance
- Ask: "Does this have the same visual rhythm?"
- Verify spacing follows mathematical scale
- Check typography matches patterns

### For /concept Command:

When running `/concept`, automatically:
1. Search this file for relevant patterns
2. Read pattern details
3. Study reference implementation
4. Extract principles for new design
5. Show pattern adaptation in concept brief

### For design-master Agent:

Before any design work:
```
Read DESIGN_PATTERNS.md
Find relevant pattern
Study reference implementation
Extract elegance principles
Apply to current task
```

---

## Adding New Patterns

When you find a design that works beautifully:

1. Document it in this file
2. Include file path
3. Explain "Why This Works"
4. Show visual hierarchy (ASCII mockup)
5. Document spacing/typography/color rules
6. Provide anti-patterns (what NOT to do)

**Template:**
```markdown
## [Pattern Name]

### Reference: [Example Name]
**File:** path/to/file

**Why This Works:**
[Bullet points explaining principles]

**Visual Hierarchy:**
[ASCII mockup or description]

**Spacing Pattern:**
[Mathematical scale used]

**Typography Scale:**
[Font sizes and weights]

**Color Usage:**
[How colors create emphasis]

**When to Use:**
[Use cases]

**Anti-Pattern:**
[What not to do]
```

---

## Principles That Make Designs Elegant

From studying reference examples:

### Visual Hierarchy
- **Hero = User's primary goal** - Not decoration
- Clear progression: Large → Medium → Small
- Important things leap off page, details are subtle

### Spacing & Rhythm
- Mathematical scale (16 → 24 → 32 → 48 → 64)
- Consistent padding within components
- Breathing room between sections

### Typography
- 3-4 size scale maximum (not 7 different sizes)
- Domaine Sans Display for impact
- GT Pantheon for structure
- Supreme LL for UI labels (NOT at 300 weight excessively)

### Color
- Gold (#D4AF37) for emphasis only
- White (#FFFFFF) for primary text
- Never introduce unauthorized faded variations
- Color creates hierarchy, not decoration

### Information Density
- Compact but scannable
- Progressive disclosure (expand for details)
- Don't overwhelm with everything at once

### What Makes Something "Elegant"
1. **Clarity** - Purpose is immediately clear
2. **Simplicity** - No unnecessary elements
3. **Rhythm** - Visual flow feels natural
4. **Restraint** - Uses emphasis sparingly
5. **Breathing room** - Not cramped, not sparse

---

**Last Updated:** 2025-10-20
**Next:** Document landing page, card, and navigation patterns
