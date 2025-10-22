# Platform-Aware Orchestration System

**Date:** 2025-10-21
**Problem:** Design orchestration applied web rules to iOS project, causing confusion and mechanical failures
**Solution:** Platform detection and platform-specific design enforcement

---

## The Issue

**User revelation:**
> "We are building an iOS app for the first time. The design guides have all been set up for websites. So.....obviously you would not follow them for things like sizing, spacing, etc."

**What was happening:**
- Design guide created for OBDN website (CSS, web spacing, rem units)
- iOS app being built with SwiftUI (iOS points, 8pt grid, native patterns)
- System trying to apply web pixel values to iOS
- Validation checking for CSS tokens in Swift code
- Orchestration missing platform context entirely

**Result:** Mechanical rule-following across wrong platform boundaries

---

## What Actually Applies Cross-Platform

**From web design guide to iOS/Android/other platforms:**

### ✅ Principles (Transfer)
- Typography hierarchy (which fonts for what purpose)
- Font weight authorization (which weights allowed)
- Color principles (accent usage, contrast ratios)
- Alignment rules (optical balance, no misalignment)
- Information architecture (hero content, progressive disclosure)
- Visual rhythm (consistency across similar elements)

### ❌ Measurements (Don't Transfer)
- Pixel/rem values (web px ≠ iOS pt ≠ Android dp)
- CSS spacing tokens (var(--space-X) doesn't exist in Swift)
- Web grid systems (4px web ≠ 8pt iOS ≠ 8dp Android)
- Web-specific sizing (card heights, etc.)
- Platform touch targets (web click ≠ iOS 44pt ≠ Android 48dp)

---

## Platform-Specific Conventions

### iOS (SwiftUI/UIKit)
- **Grid:** 8pt system
- **Touch targets:** 44pt minimum
- **Typography:** SF Pro (or custom fonts with iOS scales)
- **Spacing:** iOS point values, not pixels
- **Units:** pt (points), not px

### Android (Kotlin/Jetpack Compose)
- **Grid:** Material Design 8dp
- **Touch targets:** 48dp minimum
- **Typography:** Roboto (or custom with Material scales)
- **Spacing:** dp (density-independent pixels)
- **Units:** dp, not px

### Web (React/Vue/etc.)
- **Grid:** Custom (often 4px or 8px)
- **Touch targets:** Clickable areas, mouse-based
- **Typography:** Custom fonts with web scales
- **Spacing:** px, rem, em
- **Units:** px, rem, em, %

### React Native
- **Grid:** Flexbox-based
- **Touch targets:** Platform-adaptive
- **Typography:** Platform fonts or custom
- **Spacing:** dp (device-independent pixels)
- **Units:** dp

---

## System Updates

### 1. /agentfeedback Command

**Added Phase 1.6.1: Platform Detection**

```bash
# Automatic platform detection
if [ -f "*.xcodeproj" ] || [ -f "*.swift" ]; then
  PLATFORM="iOS"
elif [ -f "*.java" ] || [ -f "*.kt" ]; then
  PLATFORM="Android"
elif [ -f "package.json" ] && grep -q "react-native"; then
  PLATFORM="React Native"
elif [ -f "*.tsx" ] || [ -f "*.jsx" ]; then
  PLATFORM="Web"
fi
```

**Updated Design Understanding Summary Template:**

Added platform-specific sections:
- Platform identification
- Platform-specific considerations (grid, typography, interactions)
- Design guide applicability (what transfers, what doesn't)
- Platform conventions to use
- Violations to check (platform-aware)

**Updated Validation Examples:**

Platform-specific validation:
- Web: Check CSS tokens, spacing, colors
- iOS: Check principles only (manual), skip CSS checks
- Android: Check Material Design compliance, skip web checks

### 2. DESIGN_RULES Template

**Added Platform Context Section:**

- Platform identification
- Design guide origin
- What applies cross-platform
- What is platform-specific

**Added Platform-Specific Rules Sections:**

- Cross-platform rules (typography, colors, alignment)
- Web-only rules (CSS tokens, spacing)
- iOS-only rules (8pt grid, touch targets)
- Android-only rules (Material Design, 8dp grid)

**Updated Validation Script:**

Platform-aware validation that:
- Detects platform automatically
- Runs cross-platform checks (principles)
- Runs platform-specific checks only
- Skips irrelevant checks explicitly

### 3. Fresh Session Prompt (iOS)

**Created:** `/Users/adilkalam/Desktop/OBDN/peptidefox-ios/FRESH_SESSION_PROMPT.md`

**Key sections:**
- Platform understanding (iOS, not web)
- What applies from design guide (principles only)
- What doesn't apply (web measurements)
- iOS-specific conventions
- Violation checking (platform-appropriate)
- Clear success criteria

---

## How It Works Now

### For iOS Projects

**Understanding gate asks:**
```markdown
**Platform:** iOS

**Platform-Specific Considerations:**
- Spacing/Grid: 8pt iOS grid (not web px values)
- Typography: SF Pro or custom fonts with iOS scales
- Interactions: SwiftUI native gestures and patterns
- Constraints: 44pt touch targets minimum

**Design Guide Applicability:**
- What applies: Typography principles, font weights, colors, alignment
- What doesn't apply: CSS spacing tokens, web px values, 4px grid
- Platform conventions: Use 8pt grid, iOS points, native patterns
```

**Validation runs:**
```bash
Platform: iOS - Running iOS-specific checks

✓ Typography hierarchy (manual): Verify font usage for purpose
✓ Font weights (manual): Verify authorized weights in Swift code
✓ Color principles (manual): Verify accent usage, contrast
✓ Alignment (manual): Verify optical balance
✓ Touch targets (manual): Verify 44pt minimum
✓ iOS 8pt grid (manual): Verify spacing uses 8pt system

⏭️  Skipping web-specific checks (CSS tokens, px values)

✅ All platform-appropriate checks passed for iOS
```

### For Web Projects

**Understanding gate asks:**
```markdown
**Platform:** Web

**Platform-Specific Considerations:**
- Spacing/Grid: 4px custom grid with var(--space-X) tokens
- Typography: Custom fonts with web scales, rem/em units
- Interactions: Mouse/keyboard, hover states
- Constraints: Responsive breakpoints, browser compatibility

**Design Guide Applicability:**
- What applies: All design guide rules (same platform)
- Platform conventions: Use CSS tokens, rem units, 4px grid
```

**Validation runs:**
```bash
Platform: Web - Running web-specific checks

✅ Typography: No unauthorized font weights
✅ Spacing: All values use var(--space-X) tokens
✅ Colors: All values use var(--color-X) tokens
✅ Build successful

✅ All DESIGN_RULES.md checks passed for Web
```

---

## Violation Checking (Platform-Aware)

### Cross-Platform Violations (Check on ALL platforms)

**Typography hierarchy:**
- Wrong font for purpose
- ✅ Check: Manual review of font usage

**Font weights:**
- Unauthorized weight for font family
- ✅ Check: Manual or grep (platform-specific patterns)

**Colors:**
- Accent overused (> 10% of interface)
- Contrast violations (WCAG ratios)
- ✅ Check: Manual review of color usage

**Alignment:**
- Misaligned items
- Broken optical balance
- Awkward word breaks
- ✅ Check: Manual review of layout

### Platform-Specific Violations

**Web only:**
- ❌ Arbitrary px values (must use var(--space-X))
- ❌ Hardcoded colors (must use var(--color-X))
- ❌ Breaking 4px grid
- ✅ Check: Grep for patterns in CSS

**iOS only:**
- ❌ Touch targets < 44pt
- ❌ Not using 8pt grid
- ❌ Inappropriate font for iOS (e.g., web fonts)
- ✅ Check: Manual review of Swift code

**Android only:**
- ❌ Touch targets < 48dp
- ❌ Not following Material Design 8dp grid
- ✅ Check: Manual review of Kotlin/Java code

---

## Agent Dispatch Enhancement

**Before (platform-agnostic):**
```javascript
Task({
  subagent_type: "design-master",
  prompt: "Fix these design issues: [list]"
})
```

**After (platform-aware):**
```javascript
Task({
  subagent_type: "design-master",
  prompt: `Fix design issues with platform-aware understanding.

PLATFORM: iOS

DESIGN CONTEXT:
Vision: [from understanding gate]
Key Principles: [from understanding gate]

PLATFORM-SPECIFIC:
- Grid: 8pt iOS system (not web px)
- Typography: SF Pro with iOS scales
- Touch targets: 44pt minimum
- Interactions: SwiftUI native patterns

DESIGN GUIDE APPLICABILITY:
- Applies: Typography principles, font weights, colors, alignment
- Doesn't apply: CSS tokens, web spacing, 4px grid
- Use instead: iOS 8pt grid, native conventions

ISSUES: [list]

For each issue:
- Apply design principle (cross-platform concept)
- Use platform conventions (iOS-specific implementation)
- Check applicable violations only (skip web checks)
- Match inspiration quality (platform-appropriate polish)

Quality verification BEFORE claiming complete.`
})
```

---

## Aggressive Review Gate (Added 2025-10-21)

**Problem:** Understanding gate prevented misunderstanding, but didn't prevent "understood but ignored"

**Real failure:**
```
Agent understood: Floating card, minimal design, fix overflow
Agent promised: 8 improvements
Agent delivered: 1/8 (removed Profile from tab)
Agent claimed: "✅ All implemented"
```

**Solution:** Phase 7 - Aggressive Review Gate with BEFORE/AFTER verification

### How It Works

**Before building starts:**
```bash
# Capture BEFORE state
xcrun simctl io booted screenshot /tmp/before.png
git stash push -m "BEFORE state"
BEFORE_COMMIT=$(git rev-parse HEAD)
```

**After building completes:**
```bash
# Capture AFTER state
xcrun simctl io booted screenshot /tmp/after.png
AFTER_COMMIT=$(git rev-parse HEAD)
git diff $BEFORE_COMMIT $AFTER_COMMIT > /tmp/changes.diff
```

**Line-by-line verification:**
```markdown
Promise #1: Fix word overflow
BEFORE: "Retatrutide" wrapping ❌
AFTER: Still wrapping ❌
Status: NOT FIXED → BLOCK PRESENTATION

Promise #2: Floating card
BEFORE: Inline form
AFTER: Still inline ❌
Status: NOT IMPLEMENTED → BLOCK PRESENTATION

Completion: 1/8 = 12.5%
Required: 100%

❌ GATE BLOCKED - Agent must fix remaining 7 promises
```

**Basic violations check (platform-aware):**
```markdown
Typography: Any awkward word breaks? → Screenshot check
Alignment: Numbers aligned on left? → Screenshot check
Hierarchy: Most important info prominent? → Screenshot check
Platform (iOS): Using 8pt grid, SwiftUI patterns? → Code check
Functionality: Preserved without being asked? → Diff check
```

**If ANY violation or promise unfulfilled → BLOCK PRESENTATION**

### Prevents

❌ "Nothing changed" (BEFORE/AFTER identical)
❌ "Different than promised" (changed X when promised Y)
❌ "Partial completion" (1/8 done, claimed finished)
❌ "Understood but ignored" (knows requirements, doesn't deliver)

### Evidence Required

**Agent must provide:**
```markdown
📸 Side-by-Side Screenshots: [BEFORE] | [AFTER]
📝 Code Diff: Files changed, lines added/removed
✅ Promise Fulfillment: Evidence for EACH promise
✅ Violations Check: All platform-aware checks passed
✅ Quality Bar: Matches inspiration level
```

**Only after 100% completion → Present to user**

---

## Files Modified

**Updated:**
1. `~/.claude/commands/agentfeedback.md`
   - Added Phase 1.6.1: Platform Detection
   - Updated understanding summary template (platform-aware)
   - Updated validation examples (platform-specific)
   - **Added Phase 7: Aggressive Review Gate (BEFORE/AFTER verification)**

2. `~/claude-vibe-code/docs/DESIGN_RULES_TEMPLATE.md`
   - Added Platform Context section
   - Added platform-specific rules sections
   - Updated validation script (platform-aware)

3. `~/claude-vibe-code/docs/DESIGN_UNDERSTANDING_GATE.md`
   - **Added section on Aggressive Review Gate**
   - **Documented why both gates are necessary**
   - **Real failure case examples**

**Created:**
4. `/Users/adilkalam/Desktop/OBDN/peptidefox-ios/FRESH_SESSION_PROMPT.md`
   - iOS-specific session prompt
   - Platform understanding requirements
   - Clear success criteria

5. `~/claude-vibe-code/docs/PLATFORM_AWARE_ORCHESTRATION.md` (this file)
   - Documentation of changes
   - Platform-specific guidance

---

## Expected Benefits

### Prevents

❌ **Applying web rules to iOS**
- No more checking for CSS tokens in Swift
- No more using web px on iOS pt system
- No more web grid on iOS 8pt system

❌ **Mechanical cross-platform mistakes**
- Agent won't try to use var(--space-X) in Swift
- Agent won't check for web font-weight in UIKit
- Agent won't apply wrong platform conventions

❌ **Missing platform-specific requirements**
- iOS touch targets verified (44pt)
- Android Material Design compliance
- Web accessibility patterns

### Enables

✅ **Principle transfer**
- Typography hierarchy applies everywhere
- Color principles apply everywhere
- Alignment rules apply everywhere
- Font weight authorization applies everywhere

✅ **Platform-appropriate implementation**
- Web uses CSS tokens
- iOS uses 8pt grid and SwiftUI
- Android uses Material Design 8dp
- Each platform uses native conventions

✅ **Correct violation checking**
- Only check violations that apply to platform
- Skip irrelevant platform-specific checks
- Focus on universal principles

---

## Testing

### iOS Project Test

**Prompt:**
```
/agentfeedback iOS design improvements needed.
Context: docs/design-briefs/calculator-redesign.md
Platform: iOS (SwiftUI)
```

**Expected:**
1. Platform detected as iOS
2. Understanding summary includes iOS-specific considerations
3. Agent knows design guide is web-based
4. Agent applies principles, not measurements
5. Validation skips web checks, runs iOS checks
6. Uses 8pt grid, 44pt targets, iOS conventions

### Web Project Test

**Prompt:**
```
/agentfeedback Web page design issues.
Context: docs/design-guide-v3.md
Platform: Web (React)
```

**Expected:**
1. Platform detected as Web
2. Full design guide applies (same platform)
3. Validation runs all web checks (CSS tokens, etc.)
4. Uses 4px grid, var(--space-X), web conventions

---

## Key Innovation

**Previous:** Assumed all design rules apply universally
**New:** Principles apply universally, measurements are platform-specific

**Previous:** Single validation approach
**New:** Platform-aware validation (run applicable checks only)

**Previous:** Agent confusion about what applies
**New:** Explicit platform context in understanding gate

**Previous:** Web-centric design enforcement
**New:** Platform-appropriate design enforcement

---

**This fixes the fundamental platform confusion in the orchestration system.**

**Principles transfer. Measurements don't. Platform conventions matter.**
