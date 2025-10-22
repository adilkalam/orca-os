# Concrete Violations Checklist

**Date:** 2025-10-21
**Purpose:** Observable, yes/no checks for basic design violations
**Applies to:** ALL platforms (iOS, Android, Web, React Native)

---

## Why This Exists

**Problem:** "Check for alignment violations" is too abstract

**Solution:** Concrete, observable questions with visual examples

**User feedback:**
> "Are the fucking numbers aligned on the left edge? Yes or no?"
> "Is text breaking awkwardly into multiple lines?"
> "Is there an empty page with only a decorative icon?"

These are **4th-grade level** problems that should NEVER make it to the user.

---

## How To Use This Checklist

**For every design/UI implementation:**

1. Take screenshot of your work
2. Go through checklist line by line
3. Answer YES or NO for each check
4. If ANY check fails → FIX BEFORE PRESENTING

**This is not negotiable.** These are basic violations that anyone with eyes should catch.

---

## Typography & Readability Violations

### 1. Awkward Word Breaks

**Question:** Is any text breaking awkwardly across lines?

**Examples of VIOLATIONS:**
- "Retatrutid/e" (breaks mid-word)
- "Tirzepati/de" (breaks mid-word)
- "Semag-/lutide" (breaks with hyphen at bad point)
- Word too long for container, wrapping badly

**How to check:**
- Look at screenshot
- Read all text labels
- Any word split awkwardly? → VIOLATION

**Fix:**
- Increase container width
- Reduce font size
- Use better wrapping strategy
- Abbreviate if appropriate

### 2. Text Too Small

**Question:** Is any text difficult to read due to size?

**Examples of VIOLATIONS:**
- Labels smaller than 11pt (iOS) / 12px (web)
- Secondary text so small it strains eyes
- Fine print that's actually unreadable

**How to check:**
- Look at screenshot at normal size
- Can you read all text comfortably? → If no, VIOLATION

**Fix:**
- Increase font size
- Use hierarchy (larger for important, but never unreadable)
- Remove text if not important enough to be readable

### 3. Font Weight Issues

**Question:** Are font weights creating difficulty scanning content?

**Examples of VIOLATIONS:**
- Everything bold (no hierarchy)
- Everything light (hard to read)
- Too many different weights (visual chaos)

**How to check:**
- Count font weights used (should be ≤ 3)
- More than 3? → VIOLATION
- All one weight? → Likely VIOLATION (no hierarchy)

**Fix:**
- Limit to 3 weights maximum
- Use heavier weight for important content
- Use normal weight for body text
- Use light weight sparingly

---

## Alignment Violations

### 4. Misaligned Items

**Question:** Are items that should line up misaligned?

**Examples of VIOLATIONS:**
- Input numbers not aligned on left edge:
  ```
  10    mg      ← Left edge here
    5   mg/ml   ← Left edge different (VIOLATION)
  ```
- Card edges not aligned vertically
- Text baselines not aligned when side-by-side
- Icons and text not center-aligned

**How to check:**
- Draw imaginary vertical lines on screenshot
- Do items that should align actually align? → If no, VIOLATION

**Fix:**
- Use layout guides/constraints
- Align on same edge (usually left)
- Use consistent padding
- Use grid system

### 5. Broken Grid

**Question:** Are items not following visual grid?

**Examples of VIOLATIONS:**
- Random spacing between items (16px, then 23px, then 11px)
- Items positioned arbitrarily
- No visual rhythm

**How to check:**
- Measure spacing between elements
- Spacing consistent with platform grid? (iOS: 8pt, Web: 4px/8px, Android: 8dp)
- If not → VIOLATION

**Fix:**
- Use platform grid system
- All spacing should be multiples of grid unit
- iOS: 8pt, 16pt, 24pt, 32pt, etc.
- Web: 4px, 8px, 16px, 24px, etc.

### 6. Optical Balance Broken

**Question:** Does the layout feel visually "off" or unbalanced?

**Examples of VIOLATIONS:**
- Everything pushed to one side
- Heavy visual weight on one edge
- Awkward empty spaces

**How to check:**
- Look at screenshot as a whole
- Does it feel balanced? → If no, investigate further

**Fix:**
- Center content when appropriate
- Distribute visual weight evenly
- Use symmetry or intentional asymmetry
- Don't leave random gaps

---

## Visual Hierarchy Violations

### 7. Inverted Hierarchy

**Question:** Is the most important content the most visually prominent?

**Examples of VIOLATIONS:**
- Decorative icon more prominent than title
  ```
  [HUGE BLUE ICON]  Small Title    ← Icon dominates (VIOLATION)
  ```
- Navigation more prominent than content
- Secondary info larger than primary info
- Input fields larger than output results

**How to check:**
- Identify most important info on screen
- Is it the largest/boldest/most prominent? → If no, VIOLATION

**Fix:**
- Make important content largest
- Make decorative elements smallest
- Use size to create hierarchy (72pt hero, 16pt secondary)
- Don't let UI chrome dominate content

### 8. Equal Visual Weight

**Question:** Is everything the same size/weight (no hierarchy)?

**Examples of VIOLATIONS:**
- All text same size
- All buttons same prominence
- Can't tell what's important

**How to check:**
- Count distinct visual sizes used
- Only 1-2 sizes? → Likely VIOLATION (no hierarchy)
- 10+ sizes? → Likely VIOLATION (too chaotic)

**Fix:**
- Use 3-5 distinct text sizes
- Primary: Largest (hero number, page title)
- Secondary: Medium (section headers)
- Tertiary: Normal (body text)
- Quaternary: Small (labels, metadata)

### 9. Decorative Content Dominates

**Question:** Are decorative elements more prominent than actual content?

**Examples of VIOLATIONS:**
- Logo larger than page title
- Icon more prominent than the function it represents
- Background pattern competing with content
- Accent color used for > 10% of interface

**How to check:**
- Identify decorative vs functional elements
- Are decorative elements louder? → VIOLATION

**Fix:**
- Reduce decorative element size
- Use subtle colors for decoration
- Make functional content dominant
- Accent color should be < 10% of interface

---

## Information Architecture Violations

### 10. Empty Page

**Question:** Is > 50% of the screen empty space for no reason?

**Examples of VIOLATIONS:**
- Calculator with only 1 dropdown, rest is white void
- Page with header and nothing else
- Hiding content that should be visible

**How to check:**
- Look at screenshot
- Measure approximate % of empty space
- > 50% empty? → Likely VIOLATION

**Fix:**
- Show relevant content
- Don't hide entire form until input selected
- Use progressive disclosure properly (show essential, hide advanced)
- If truly minimal design, ensure it's intentional not lazy

### 11. Hidden Content

**Question:** Is important content hidden or collapsed by default?

**Examples of VIOLATIONS:**
- Hiding entire calculator form until compound selected
- Collapsing essential information
- Requiring clicks to see primary content

**How to check:**
- What's the primary task?
- Is everything needed for that task visible? → If no, VIOLATION

**Fix:**
- Show essential content by default
- Hide only advanced/optional features
- Progressive disclosure = hide complexity, not essentials

### 12. Buried Hero Content

**Question:** Is the most important content not immediately visible?

**Examples of VIOLATIONS:**
- Calculation result buried below inputs
- Primary action button hidden off-screen
- Hero content in footer instead of top

**How to check:**
- Identify hero content (most important info)
- Is it in the top 1/3 of screen? → If no, possible VIOLATION

**Fix:**
- Put hero content at top or center
- Make it largest visual element
- Don't bury important info below less important info

---

## Platform-Specific Violations

### iOS

#### 13. Touch Targets Too Small

**Question:** Are any tappable elements < 44pt?

**How to check:**
- Measure button/tap target heights in code
- < 44pt? → VIOLATION

**Fix:**
- Increase tap target to minimum 44pt × 44pt
- Can visually appear smaller with padding

#### 14. Not Using iOS Grid

**Question:** Is spacing using arbitrary values instead of 8pt grid?

**How to check:**
- Check spacing values in code
- Are they multiples of 8? (8, 16, 24, 32, 40, etc.)
- Random values like 15, 23, 37? → VIOLATION

**Fix:**
- Use 8pt grid system
- All spacing: 8, 16, 24, 32, 40, 48, etc.

#### 15. Inappropriate Fonts

**Question:** Are you using web fonts instead of iOS system fonts?

**How to check:**
- Check font usage in code
- Using system fonts (SF Pro) or authorized custom fonts? → OK
- Using web fonts or inappropriate choices? → VIOLATION

**Fix:**
- Use SF Pro (system font) by default
- If custom font, ensure it's iOS-appropriate
- Don't use web fonts on iOS

### Web

#### 16. Hardcoded Colors/Spacing

**Question:** Are you using hardcoded values instead of design tokens?

**How to check:**
```bash
# Check for hardcoded colors
grep -E 'rgba\\(|#[0-9a-fA-F]{3,6}' styles.css | grep -v 'var(--color'

# Check for hardcoded spacing
grep -E 'padding: [0-9]+px|margin: [0-9]+px' styles.css | grep -v 'var(--space'
```

**If matches found → VIOLATION**

**Fix:**
- Use design tokens: `var(--space-4)`, `var(--color-primary)`
- No hardcoded values

### Android

#### 17. Touch Targets Too Small

**Question:** Are any tappable elements < 48dp?

**How to check:**
- Measure tap target sizes in code
- < 48dp? → VIOLATION

**Fix:**
- Increase to minimum 48dp × 48dp

#### 18. Not Following Material Design

**Question:** Are you ignoring Material Design 8dp grid?

**How to check:**
- Check spacing values
- Multiples of 8dp? → OK
- Random values? → VIOLATION

**Fix:**
- Use 8dp grid system
- Follow Material Design guidelines

---

## Functionality Preservation Violations

### 19. Changed Functionality

**Question:** Did you change how things work without being asked?

**Examples of VIOLATIONS:**
- Combined GLOW/KLOW into one card (not requested)
- Removed features that should still exist
- Changed data structure without permission

**How to check:**
```bash
git diff BEFORE AFTER
```
- Review changes
- Only design changes should be present
- Functionality changes without request? → VIOLATION

**Fix:**
- Only change what was asked
- Preserve existing functionality
- If you think functionality should change, ask user first

### 20. Introduced Bugs

**Question:** Did you break something that was working?

**How to check:**
- Build the code → Any errors?
- Test manually → Any crashes or broken features?
- Run tests → Any failures?

**If yes to any → VIOLATION**

**Fix:**
- Fix the bug
- Run full test suite
- Don't present broken code

### 21. Orphaned Files

**Question:** Did you create files not integrated into project?

**How to check (iOS):**
```bash
# Check if Swift files are in Xcode project
# Files created but not in *.xcodeproj = orphaned
```

**How to check (Web):**
```bash
# Check if files are imported anywhere
# Files with no imports = orphaned
```

**Orphaned files → VIOLATION**

**Fix:**
- Add files to Xcode project (iOS)
- Import files where needed (Web)
- Delete if not needed

### 22. TODO Markers

**Question:** Did you leave TODO comments in code?

**How to check:**
```bash
grep -r "TODO" --include="*.swift" --include="*.tsx"
```

**If found → VIOLATION**

**Fix:**
- Complete the TODO
- Remove the marker
- Don't leave partially-completed work

---

## Quality Bar Violations

### 23. Doesn't Match Inspiration

**Question:** Does your implementation match the polish level of inspiration examples?

**Examples of VIOLATIONS:**
- Inspiration has clean, minimal cards → You have busy, cluttered cards
- Inspiration has huge hero numbers → You have equal-weight numbers
- Inspiration has generous whitespace → You have cramped layout

**How to check:**
- Put your screenshot next to inspiration screenshot
- Same quality level? → OK
- Clearly lower quality? → VIOLATION

**Fix:**
- Study inspiration examples more carefully
- Extract principles (not just copy)
- Match polish level, not pixel values

---

## How to Run This Checklist

**Step 1: Take screenshot of your work**

```bash
# iOS
xcrun simctl io booted screenshot /tmp/my-work.png

# Web
chrome --headless --screenshot=/tmp/my-work.png http://localhost:8080
```

**Step 2: Go through checklist**

```markdown
Typography & Readability:
- [ ] No awkward word breaks
- [ ] No text too small
- [ ] Font weights appropriate

Alignment:
- [ ] No misaligned items
- [ ] Following grid system
- [ ] Optical balance maintained

Visual Hierarchy:
- [ ] Not inverted
- [ ] Clear hierarchy exists
- [ ] Decorative elements subtle

Information Architecture:
- [ ] Not 50%+ empty
- [ ] No hidden essential content
- [ ] Hero content prominent

Platform-Specific (iOS):
- [ ] Touch targets ≥ 44pt
- [ ] Using 8pt grid
- [ ] Appropriate fonts

Functionality:
- [ ] No unauthorized changes
- [ ] No new bugs
- [ ] No orphaned files
- [ ] No TODO markers

Quality:
- [ ] Matches inspiration level
```

**Step 3: Fix ALL violations**

**Do not proceed until ALL checks pass.**

---

## Real Examples from iOS Failures

### Violation: Awkward Word Breaks

**BEFORE:**
```
┌─────────────────┐
│ Retatrutid     │
│ e              │  ← VIOLATION: Bad break
└─────────────────┘
```

**AFTER (Fixed):**
```
┌──────────────────┐
│ Retatrutide     │  ← Single line
└──────────────────┘
```

### Violation: Misaligned Numbers

**BEFORE:**
```
80     mg       ← Left edge here
  10   mg/ml    ← Left edge different (VIOLATION)
```

**AFTER (Fixed):**
```
80     mg       ← Both aligned
10     mg/ml    ← Same left edge
```

### Violation: Inverted Hierarchy

**BEFORE:**
```
[HUGE f(x) ICON]  Reconstitution Calculator
                  ↑ Icon dominates (VIOLATION)
```

**AFTER (Fixed):**
```
Reconstitution Calculator
[small f(x) icon]
↑ Title dominates
```

### Violation: Empty Page

**BEFORE:**
```
Select Compound [dropdown]

[60% empty white space]  ← VIOLATION
```

**AFTER (Fixed):**
```
Select Compound [dropdown]
Vial Size [input]
Concentration [input]
[Calculate button]
↑ Show the form
```

---

## Summary

**These are NOT negotiable:**

✅ No awkward word breaks
✅ Proper alignment
✅ Correct visual hierarchy
✅ No 50%+ empty pages
✅ Platform conventions followed
✅ Functionality preserved
✅ No bugs introduced
✅ Quality matches inspiration

**If ANY violation found → FIX BEFORE PRESENTING**

This is the difference between:
- "this fucking sucks" ❌
- "yes, this is what I wanted" ✅

**Use this checklist every time. No exceptions.**
