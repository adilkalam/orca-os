---
description: Visual QA review of implemented UI using chrome-devtools to screenshot and analyze with vision
allowed-tools: [Read, Bash, mcp__*]
argument-hint: [page-url] (e.g., "http://localhost:8080/protocols/injury")
---

# /visual-review - Visual QA of Implemented UI

**PURPOSE**: After implementing UI/UX, use chrome-devtools MCP to screenshot the actual result and analyze with vision to ensure it meets design standards.

**This is the FINAL step in any UI/UX workflow.**

---

## ⚠️ CRITICAL: ALWAYS Use Viewport Screenshots

**YOU MUST use `fullPage: false` when taking screenshots.**

If you use `fullPage: true` on pages > 8000px tall:
- Screenshot will exceed Claude's 8000px API limit
- API will reject the image
- Session will be "poisoned" and require restart
- No recovery possible without new session

**DEFAULT SAFE APPROACH:**
```javascript
mcp__chrome-devtools__take_screenshot({
  fullPage: false  // ← ALWAYS use this
})
```

---

## When to Use

Use `/visual-review` after:
- Completing a design implementation
- Fixing design issues
- Before marking UI work as complete
- After `/agentfeedback` design fixes

**NEVER skip this step for UI/UX work.**

---

## Target to Review

**Target:** $ARGUMENTS

### Detect Platform

Check if target is:
- **Web**: Starts with `http://` or `https://` or `localhost`
- **iOS**: Contains app name, screen name, or no URL protocol

**If no arguments provided, ask:**
```javascript
AskUserQuestion({
  questions: [{
    question: "What would you like to review?",
    header: "Platform",
    multiSelect: false,
    options: [
      {label: "Web page", description: "Review a web page (localhost or URL)"},
      {label: "iOS app screen", description: "Review iOS app in Simulator"},
      {label: "React Native", description: "Review React Native app (iOS/Android)"}
    ]
  }]
})
```

**Then ask for specifics:**
- Web: URL (default: http://localhost:8080)
- iOS: App name + screen to navigate to (or "current screen in Simulator")
- React Native: Which platform and screen

---

## Phase 0: Read Project Design System Guide ⚠️ MANDATORY

**BEFORE analyzing ANYTHING**, you MUST locate and read the project's design system documentation.

### Step 1: Locate Design System Guide

**For Web Projects:**

Check these locations in order:
1. `/docs/design-guide-v3.md` (or similar version)
2. `/docs/design-system*.md`
3. `/docs/typography-rules.md` + `/docs/color-rules.md` + `/docs/alignment-rules.md`
4. `/ design-system-guide.md` (root directory)
5. `/design-system/` directory

**For iOS Projects:**

Check these locations:
1. `/docs/ios-design-guide.md` or `/docs/design-guide.md`
2. `/DesignSystem/` or `/Design/` folder (common in iOS projects)
3. `/README.md` - may contain design system reference
4. Xcode Asset Catalogs (`.xcassets`) for colors
5. SwiftUI `Theme.swift` or `DesignTokens.swift` files

**Additional iOS Considerations:**
- Check if project follows Apple Human Interface Guidelines
- Look for custom font files (`.ttf`, `.otf`) in project
- Check for Color Assets or UIColor extensions
- Look for spacing constants/tokens in Swift files

**If not found**: Use /clarify to ask user where the design system guide is located.

### Step 2: Read ALL Design System Files

**REQUIRED READING** (if they exist):
```bash
Read {project-root}/docs/design-guide-v3.md
Read {project-root}/docs/typography-rules.md
Read {project-root}/docs/color-rules.md
Read {project-root}/docs/alignment-rules.md
```

### Step 3: Extract Project-Specific Rules

From the design system docs, identify:

**Typography**:
- Authorized font families (with weights)
- Font usage rules (which font for what purpose)
- Minimum font sizes
- Hard rules (e.g., "Domaine Sans Display ONLY for card titles 24px+")

**Colors**:
- Background color (is it light or dark?)
- Text color hierarchy
- Accent colors
- Surface/border colors
- **CRITICAL**: Never assume light or dark - READ the actual values

**Spacing**:
- Grid system (4px, 8px, etc.)
- Spacing scale variables
- Section spacing rules

**Components**:
- Card styles
- Button styles
- Form elements
- Any project-specific patterns

### Step 4: Create Design System Summary

**Before proceeding**, create a brief summary:

```
PROJECT DESIGN SYSTEM CONFIRMED:

Typography:
- Font 1: {name} ({weights}) → {usage}
- Font 2: {name} ({weights}) → {usage}
- ...

Colors:
- Background: {hex/rgba} → {description}
- Text Primary: {hex/rgba}
- Accent: {hex/rgba}
- ...

Spacing:
- Base grid: {px}
- Scale: {values}

Critical Rules:
- {Rule 1}
- {Rule 2}
- ...
```

**This summary will be your SOURCE OF TRUTH for the visual review.**

---

## Phase 1: Capture Screenshot

### CRITICAL: Screenshot Strategy

**⚠️ API Limitation:** Claude cannot process images > 8000px in any dimension.

**General Rules:**
- Always use viewport-sized screenshots (not full page/full scroll)
- Web: 1440x900 viewport
- iOS: Native device resolution (iPhone 15 Pro: 393x852 pt)
- Capture "above the fold" primary screen for QA

**Why viewport is sufficient:**
- Design standards apply to visible viewport
- Typography, spacing, hierarchy visible in first screen
- Long scrolling content doesn't affect aesthetic evaluation

---

### Step 1A: WEB Screenshot (chrome-devtools or Chrome CLI)

**Option 1: chrome-devtools MCP (PREFERRED for web)**

```javascript
// Navigate to page
mcp__chrome-devtools__new_page({
  url: PAGE_URL,
  timeout: 10000
})

// Take VIEWPORT screenshot (NOT fullPage)
mcp__chrome-devtools__take_screenshot({
  fullPage: false  // ← CRITICAL: viewport only
})
```

**⚠️ NEVER use `fullPage: true` - it will fail on pages > 8000px**

---

**Option 2: Chrome Headless CLI (FALLBACK)**

```bash
# Check if dev server is running
curl -s http://localhost:8080 > /dev/null && echo "✅ Dev server running" || echo "❌ Start dev server first"

# Take viewport screenshot using Chrome headless
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUTPUT="/tmp/visual-review-web-$(date +%s).png"

"$CHROME" --headless --disable-gpu \
  --screenshot="$OUTPUT" \
  --window-size=1440,900 \
  --hide-scrollbars \
  "$PAGE_URL"

echo "📸 Screenshot saved: $OUTPUT"
```

---

### Step 1B: iOS Screenshot (Simulator)

**Prerequisites Check:**

```bash
# Verify xcode-select path is correct
XCODE_PATH=$(xcode-select -p)
if [[ "$XCODE_PATH" != "/Applications/Xcode.app/Contents/Developer" ]]; then
  echo "❌ xcode-select path incorrect: $XCODE_PATH"
  echo "Run: sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer"
  exit 1
fi

# Check if Simulator is running
xcrun simctl list devices | grep Booted
```

**If Simulator not running:**

```bash
# List available simulators
xcrun simctl list devices available

# Boot a simulator (iPhone 15 Pro recommended)
xcrun simctl boot "iPhone 15 Pro"

# Open Simulator.app
open -a Simulator
```

**Screenshot Methods:**

**Method 1: xcrun simctl (PREFERRED - works without UI focus)**

```bash
# Get booted device ID
DEVICE_ID=$(xcrun simctl list devices | grep Booted | grep -oE '[A-F0-9-]{36}' | head -1)

if [ -z "$DEVICE_ID" ]; then
  echo "❌ No booted simulator found"
  echo "Boot a simulator first: xcrun simctl boot 'iPhone 15 Pro'"
  exit 1
fi

# Take screenshot
OUTPUT="/tmp/visual-review-ios-$(date +%s).png"
xcrun simctl io "$DEVICE_ID" screenshot "$OUTPUT"

echo "📸 Screenshot saved: $OUTPUT"
ls -lh "$OUTPUT"
```

**Method 2: Simulator Screenshot Keyboard Shortcut (FALLBACK)**

If xcrun simctl fails:
1. Make sure Simulator.app has focus
2. Press `Cmd + S` to save screenshot
3. Default location: `~/Desktop/Simulator Screen Shot....png`
4. Use most recent screenshot

```bash
# Find most recent Simulator screenshot on Desktop
LATEST_SCREENSHOT=$(ls -t ~/Desktop/Simulator\ Screen\ Shot*.png 2>/dev/null | head -1)

if [ -n "$LATEST_SCREENSHOT" ]; then
  echo "📸 Found screenshot: $LATEST_SCREENSHOT"
  OUTPUT="$LATEST_SCREENSHOT"
else
  echo "❌ No Simulator screenshots found on Desktop"
  echo "Take screenshot with Cmd+S in Simulator"
fi
```

**Method 3: Manual Navigation + Screenshot**

If you need to navigate to a specific screen first:

```bash
# Launch app in Simulator
xcrun simctl launch "$DEVICE_ID" com.yourcompany.YourApp

# Wait for app to load
sleep 2

# Navigate to screen (you may need to describe manual steps)
echo "⚠️  Manual step: Navigate to [SCREEN_NAME] in Simulator"
echo "Then press Cmd+S or run: xcrun simctl io $DEVICE_ID screenshot /tmp/screenshot.png"
```

---

### Step 1C: React Native Screenshot

**For React Native on iOS:**
- Use iOS Simulator method above (Step 1B)
- Make sure Metro bundler is running
- App should be loaded in Simulator

**For React Native on Android:**
```bash
# Check if emulator is running
adb devices

# Take screenshot
OUTPUT="/tmp/visual-review-android-$(date +%s).png"
adb exec-out screencap -p > "$OUTPUT"

echo "📸 Screenshot saved: $OUTPUT"
```

---

### Step 2: Verify Screenshot Captured

**For chrome-devtools MCP:**
- Image appears inline in response
- No file path needed

**For CLI screenshots (Chrome, iOS, Android):**
```bash
# Verify file exists and check size
ls -lh "$OUTPUT"

# Check image dimensions (requires ImageMagick)
# If not installed: brew install imagemagick
if command -v identify &> /dev/null; then
  identify "$OUTPUT"
fi
```

**Expected dimensions:**
- Web: ~1440x900 pixels
- iPhone 15 Pro: ~1179x2556 pixels (3x scale) or ~393x852 points
- Android: Varies by device

---

## Phase 2: Visual Analysis

### Read Screenshot with Vision

```
Read $OUTPUT
```

**CRITICAL:** Actually analyze the visual with vision, don't just describe it textually.

---

## Phase 3: Design Standards Checklist

Analyze the screenshot against design standards in this EXACT order:

### 1. **PROJECT DESIGN SYSTEM COMPLIANCE** ⚠️ PRIMARY

**Compare against the design system summary you created in Phase 0.**

This is your SOURCE OF TRUTH. Any contradictions between project design system and /inspire principles are resolved in favor of the project design system.

**AUDIT METHODOLOGY:** Use category-based analysis (learned from design-reviewer specialist):

---

#### **A. COLOR SYSTEM** 🎨

**Background Colors:**
- [ ] Primary background matches design system exactly? (e.g., #0c051c not #FFFFFF)
- [ ] NO color scheme inversions (light ↔ dark)?
- [ ] Surface colors using design system variables?

**Text Colors:**
- [ ] Using design system text hierarchy? (Primary, High, Medium, Body, Subdued, Subtle, Faint)
- [ ] NO hardcoded rgba() colors outside system?
- [ ] Opacity levels match design system?

**Accent Colors:**
- [ ] Accent colors match design system values? (e.g., #C9A961 not arbitrary gold)
- [ ] Using variables (var(--color-accent-gold)) not hardcoded hex?
- [ ] Accent usage follows design system guidelines? (<10% of elements)

**Border/Surface Colors:**
- [ ] Border colors from design system? (Default, Subtle, Faint)
- [ ] Surface overlays match design system? (Raised, Base, Subtle)

**Line-by-Line Check:**
- [ ] Scan for hardcoded hex values (#RRGGBB)
- [ ] Scan for inline style={{backgroundColor: '...'}}
- [ ] Check global CSS variable definitions

**Score: __/10 points**

---

#### **B. TYPOGRAPHY SYSTEM** ✍️

**Font Families:**
- [ ] Using ONLY authorized fonts from design system?
- [ ] Each font used for correct purpose? (e.g., Domaine Sans Display ONLY for card titles)
- [ ] NO unauthorized fonts introduced? (Inter, Helvetica, Arial, system fonts)
- [ ] Monospace font correct? (e.g., Brown LL Mono not Söhne Mono)

**Font Weights:**
- [ ] Using ONLY available weights per font?
- [ ] Respecting default weight rules? (e.g., Supreme LL default 400)
- [ ] NO weight 300 unless explicitly allowed?
- [ ] NO arbitrary weight values (500, 600, 700) for fonts that don't have them?

**Font Sizes:**
- [ ] Following design system type scale?
- [ ] Respecting minimum sizes? (e.g., Domaine 24px minimum)
- [ ] NO arbitrary sizes outside scale? (17px, 19px, 23px, etc.)

**Line-by-Line Check:**
- [ ] Check all font-family declarations
- [ ] Check all font-weight values
- [ ] Check all font-size values
- [ ] Check global CSS variable definitions (--font-display, --font-body, etc.)

**Score: __/10 points**

---

#### **C. SPACING SYSTEM** 📏

**Grid System:**
- [ ] Following correct base grid? (4px vs 8px - check design system)
- [ ] All spacing values snap to grid?
- [ ] Using spacing variables (var(--space-X)) not arbitrary values?

**Spacing Scale:**
- [ ] Using ONLY spacing tokens from design system?
- [ ] NO random values? (15px, 35px, 42px, etc.)
- [ ] Section spacing matches design system? (e.g., 120px desktop, 80px tablet)

**Padding/Margin:**
- [ ] Card padding matches design system?
- [ ] Button padding correct?
- [ ] Container padding responsive per design system?

**Line-by-Line Check:**
- [ ] Scan for arbitrary padding values
- [ ] Scan for arbitrary margin values
- [ ] Check gap properties in grids/flex
- [ ] Check global CSS spacing variables

**Score: __/10 points**

---

#### **D. COMPONENT COMPLIANCE** 🧩

**Cards:**
- [ ] Background color matches design system?
- [ ] Border radius correct? (8px/12px/20px per system)
- [ ] Border color from design system?
- [ ] Hover states match design system? (2px lift, gold border, raised surface)

**Buttons:**
- [ ] Padding matches design system?
- [ ] Border radius correct?
- [ ] Colors from design system variables?
- [ ] Hover/active states correct?

**Forms:**
- [ ] Input height/padding correct?
- [ ] Focus states match design system?
- [ ] Label styles correct?

**Tables:**
- [ ] Header background matches design system?
- [ ] Row hover states correct?
- [ ] Cell padding matches design system?

**Line-by-Line Check:**
- [ ] Check component-specific CSS modules
- [ ] Scan for hardcoded component styles
- [ ] Check inline styles in JSX

**Score: __/10 points**

---

#### **E. ACCESSIBILITY & POLISH** ♿

**Contrast Ratios:**
- [ ] Text on background meets WCAG AA? (4.5:1 for body, 3:1 for large)
- [ ] Low opacity elements still readable? (check 0.3, 0.4 opacity)
- [ ] Accent colors have sufficient contrast?

**ARIA/Semantic HTML:**
- [ ] Proper heading hierarchy? (h1 → h2 → h3)
- [ ] ARIA landmarks present? (role="main", role="navigation")
- [ ] Alt text on images?

**Interaction States:**
- [ ] Hover states visible and consistent?
- [ ] Focus states keyboard-accessible?
- [ ] Active states clear?

**Score: __/10 points**

---

#### **F. ROOT CAUSE ANALYSIS** 🔍

**Critical:** Check files that might override or conflict with design system:

**Global CSS:**
- [ ] Check `/css/styles.css` for CSS variable definitions
- [ ] Verify global font variables match design system
- [ ] Check for global color overrides

**Module CSS:**
- [ ] Check `.module.css` files for local overrides
- [ ] Look for redefined CSS variables that conflict with global
- [ ] Check for !important that might break design system

**Inline Styles:**
- [ ] Scan JSX/TSX for style={{}} props with hardcoded values
- [ ] Check for component-level style overrides

**Imported Stylesheets:**
- [ ] Check for third-party CSS that might conflict
- [ ] Check reset.css or normalize.css interference

**Score: __/10 points**

---

### COMPREHENSIVE SCORE CALCULATION

**Total Score: __/60 points**

- **50-60 points**: Excellent compliance - minor polish needed
- **40-49 points**: Good compliance - some violations to fix
- **30-39 points**: Moderate compliance - significant work needed
- **20-29 points**: Poor compliance - major violations present
- **0-19 points**: Critical failure - design system not followed

**This scoring methodology learned from design-reviewer specialist's superior audit approach.**

---

### 1B. **iOS-SPECIFIC COMPLIANCE** (For iOS/React Native apps only)

**If reviewing iOS app, add these iOS-specific checks:**

---

#### **G. iOS HUMAN INTERFACE GUIDELINES** 📱

**Navigation Patterns:**
- [ ] Navigation bar height correct? (44pt standard, 96pt large title)
- [ ] Tab bar height correct? (49pt standard, 83pt with safe area)
- [ ] Back button present and properly styled?
- [ ] Navigation hierarchy clear? (push/modal patterns correct)

**Typography (iOS):**
- [ ] Using SF Pro (system font) or custom fonts properly loaded?
- [ ] Dynamic Type support? (text scales with user settings)
- [ ] Font weights match iOS standards? (Regular, Medium, Semibold, Bold)
- [ ] Line height appropriate for readability?

**Spacing (iOS):**
- [ ] Safe area insets respected? (notch, home indicator, etc.)
- [ ] Standard margins? (16pt minimum from edges, 20pt recommended)
- [ ] List row height appropriate? (44pt minimum for tap targets)
- [ ] Spacing consistent with HIG? (8pt, 16pt, 20pt, 24pt common values)

**Colors (iOS):**
- [ ] Using semantic colors? (UIColor.label, .systemBackground, etc.)
- [ ] Dark mode support? (colors adapt to light/dark appearance)
- [ ] NO hardcoded hex colors that don't adapt to dark mode?
- [ ] Tint color consistent throughout app?

**Score: __/10 points**

---

#### **H. iOS COMPONENTS & PATTERNS** 🧩

**Native Components:**
- [ ] Using standard iOS components? (UITableView, UICollectionView, etc.)
- [ ] Or SwiftUI equivalents? (List, LazyVStack, etc.)
- [ ] Custom components match iOS aesthetic?
- [ ] Buttons follow iOS style? (filled, tinted, bordered, plain)

**SF Symbols:**
- [ ] Using SF Symbols for icons? (not custom PNGs unless necessary)
- [ ] Symbol weight matches text weight?
- [ ] Symbol scaling appropriate? (.small, .medium, .large)
- [ ] Symbols semantically correct? (not confusing meanings)

**Gestures & Interactions:**
- [ ] Swipe actions implemented correctly? (delete, archive, etc.)
- [ ] Pull-to-refresh present where appropriate?
- [ ] Tap targets minimum 44x44pt?
- [ ] Haptic feedback for important actions?

**Scroll Behavior:**
- [ ] Scroll indicators visible?
- [ ] Bounce effect present? (native iOS scrolling)
- [ ] Keyboard avoidance working? (content shifts up when keyboard appears)

**Score: __/10 points**

---

#### **I. iOS ACCESSIBILITY (VoiceOver/Dynamic Type)** ♿

**VoiceOver Support:**
- [ ] Accessibility labels present on interactive elements?
- [ ] Accessibility hints provided where helpful?
- [ ] Reading order logical? (VoiceOver traversal makes sense)
- [ ] Images have accessibility descriptions?

**Dynamic Type:**
- [ ] Text scales with system font size settings?
- [ ] Layout adapts to larger text sizes?
- [ ] NO fixed heights that truncate large text?
- [ ] Using `.scaledFont()` or `.font(.body)` in SwiftUI?

**Reduce Motion:**
- [ ] Animations respect `reduceMotion` accessibility setting?
- [ ] Alternative non-animated UX available?

**Score: __/10 points**

---

**iOS TOTAL SCORE: __/30 points** (add to base 60 for total of 90)

---

### 2. **AESTHETIC SOPHISTICATION** (Secondary - /inspire principles)

**ONLY apply these if they don't contradict the project design system.**

Compare to `~/.claude/design-inspiration/AESTHETIC_PRINCIPLES.md`:

**Restraint:**
- [ ] Is 30% of elements removed vs. initial urge to add?
- [ ] Does it show restraint and confidence?
- [ ] Is information progressively disclosed vs. all at once?

**Whitespace:**
- [ ] 48-80px between major sections?
- [ ] 24-32px internal card padding?
- [ ] Is whitespace ALLOCATED intentionally vs. leftover?
- [ ] Does it feel spacious and premium?

**Typography:**
- [ ] Using 2 fonts maximum?
- [ ] 5 size levels or fewer?
- [ ] 3 weights maximum (400, 500, 600)?
- [ ] Decisive size jumps (16px → 24px, not 16px → 18px)?
- [ ] Clear hierarchy through scale and weight?

**Material Depth:**
- [ ] Subtle gradients (3-5% opacity shifts)?
- [ ] Soft shadows (12-24px blur, low opacity)?
- [ ] Frosted glass effects for layered UI?
- [ ] NOT flat, has tactile depth?

**Color Restraint:**
- [ ] 90% of design in grayscale?
- [ ] Accent color for <10% of elements?
- [ ] Safety colors muted (15% opacity backgrounds)?
- [ ] No more than 3 accent uses per screen?

**Hierarchy:**
- [ ] Only 4 hierarchy levels (not 7)?
- [ ] Decisive differences between levels?
- [ ] Clear visual scanning path?

**Interaction:**
- [ ] 300ms transitions (not instant)?
- [ ] Cubic-bezier easing for organic feel?
- [ ] Hover states: 2px lift + soft shadow?
- [ ] NO perpetual animations?

**Spacing System:**
- [ ] All spacing from 8px grid (8, 16, 24, 32, 48, 64, 96)?
- [ ] NO arbitrary values (20px, 35px, etc.)?
- [ ] Larger gaps for more important breaks?

---

### 3. **FUNCTIONALITY**

**Interactive Elements:**
- [ ] Do dropdowns/toggles look functional?
- [ ] Clear visual affordances (buttons look clickable)?
- [ ] Hover states visible in screenshot?

**Information Hierarchy:**
- [ ] Most important information prominent?
- [ ] Protocol/core content as hero (not buried)?
- [ ] Safety warnings visible but not dominating?

### 4. **COMPARE TO INSPIRATION**

Load relevant examples from gallery and compare:

```bash
# Load similar examples
ls ~/.claude/design-inspiration/protocols/*.png
ls ~/.claude/design-inspiration/landing/*.png
```

**Read inspiration screenshots:**
```
Read ~/.claude/design-inspiration/protocols/stripe-api.png
Read ~/.claude/design-inspiration/landing/vaayu.png
```

**Comparison Questions:**
- Does your implementation feel as sophisticated?
- Does it have the same level of restraint?
- Is spacing as generous?
- Is typography as confident?
- Does it create the same premium feel?

---

## Phase 4: Visual QA Report

**Create structured report:**

```
📊 VISUAL QA REPORT

Page: [URL]
Screenshot: [path]

✅ PASSES:
- [List what meets design standards]
- [What looks sophisticated and elegant]
- [What demonstrates restraint]

❌ VIOLATIONS:
- [List design system violations]
- [Typography issues]
- [Spacing problems]
- [Color violations]
- [Hierarchy issues]

⚠️ NEEDS IMPROVEMENT:
- [Not violations but could be better]
- [Opportunities for more sophistication]
- [Areas lacking restraint]

📐 COMPARISON TO INSPIRATION:
- [How it compares to gallery examples]
- [What makes inspiration better]
- [What we do better]

🎯 RECOMMENDATION:
- [ ] ✅ APPROVED - Ship it
- [ ] ⚠️  NEEDS FIXES - Address violations before shipping
- [ ] ❌ REDESIGN REQUIRED - Fundamental issues

PRIORITY FIXES:
1. [Most critical fix]
2. [Second priority]
3. [Third priority]
```

---

## Phase 5: Fix Issues (If Needed)

If violations found:

**For typography/spacing/color violations:**
1. Fix directly in CSS
2. Re-run visual review
3. Repeat until ✅ APPROVED

**For hierarchy/layout issues:**
1. May need design rethink
2. Consult AESTHETIC_PRINCIPLES.md
3. Look at inspiration gallery
4. Implement fixes
5. Re-run visual review

---

## Example Usage

### Example 1: Web Page Review

```
User: /visual-review http://localhost:8080/protocols/injury

Agent:
1. Detects: Web target (localhost URL)
2. Reads OBDN design system from ~/Desktop/OBDN/obdn_site/docs/
3. Takes chrome-devtools screenshot (viewport 1440x900)
4. Analyzes with vision
5. Checks against design system (6 categories: Color, Typography, Spacing, Components, Accessibility, Root Cause)
6. Scores: 42/60 points (Good compliance - some violations)
7. Compares to inspiration gallery examples
8. Lists specific violations:
   - Color: Background inverted (#FFFFFF should be #0c051c)
   - Typography: Using Inter instead of Domaine Sans Display
   - Spacing: Using 8px grid instead of 4px grid
9. Recommends: NEEDS FIXES - 3 critical violations
```

---

### Example 2: iOS App Review

```
User: /visual-review HomeScreen

Agent:
1. Detects: iOS target (no URL protocol)
2. Reads iOS design system from /docs/ios-design-guide.md
3. Checks if Simulator is running (xcrun simctl list devices)
4. Takes screenshot: xcrun simctl io [DEVICE_ID] screenshot /tmp/screenshot.png
5. Analyzes with vision
6. Checks against:
   - Project design system (6 categories: 60 points)
   - iOS HIG compliance (3 iOS categories: 30 points)
   - Total: 90 point scale
7. Scores: 72/90 points (Good compliance)
8. Lists specific findings:
   - ✅ Navigation bar height correct (44pt)
   - ✅ Using SF Symbols appropriately
   - ✅ Safe area insets respected
   - ❌ Missing Dynamic Type support
   - ❌ Tap targets below 44pt minimum on some buttons
   - ⚠️ Dark mode colors hardcoded (should use semantic colors)
9. Recommends: NEEDS FIXES - 2 important violations, 1 nice-to-have
```

---

### Example 3: React Native App Review

```
User: /visual-review react-native ProfileScreen

Agent:
1. Detects: React Native target
2. Asks: iOS or Android?
3. User: iOS
4. Reads design system from /docs/design-system.md
5. Takes iOS Simulator screenshot
6. Analyzes with vision
7. Checks against both:
   - Project design system (web-like components)
   - iOS patterns (navigation, gestures, etc.)
8. Scores: 68/90 points
9. Lists cross-platform violations:
   - Using web spacing (16px) instead of iOS points (16pt) - cosmetic but worth noting
   - Custom back button doesn't match iOS standard
   - Pull-to-refresh missing (expected on iOS)
10. Recommends: NEEDS FIXES - improve platform consistency
```

---

## Integration with Workflows

### After /agentfeedback (design work):

```
1. Implement design fixes
2. Build succeeds
3. **Run /visual-review** ← MANDATORY
4. Fix any violations found
5. Re-run /visual-review until APPROVED
6. THEN mark work complete
```

### After /concept → Design specialists:

```
1. Design specialists (ux-strategist, visual-designer, tailwind-specialist, design-reviewer) create design
2. Implementation complete
3. **Run /visual-review** ← MANDATORY
4. Verify it matches design brief
5. Check aesthetic sophistication
6. Fix violations
7. APPROVED → Ship
```

---

## Critical Rules

### DO:
- ✅ Use vision analysis on actual screenshot
- ✅ Check against AESTHETIC_PRINCIPLES.md
- ✅ Compare to inspiration gallery
- ✅ List SPECIFIC violations with line numbers/values
- ✅ Re-run after fixes until APPROVED

### DON'T:
- ❌ Skip visual review for "simple" UI changes
- ❌ Approve without checking spacing/typography
- ❌ Ignore violations "that don't matter"
- ❌ Trust that it looks good without seeing it
- ❌ Compare only to functional requirements (check aesthetics too!)

---

## Remember

> "What you withhold often matters more than what you display."

**Visual review ensures:**
- Design standards are met
- Sophistication through restraint
- No regressions in quality
- Consistent aesthetic across pages
- Premium feel is maintained

**Never skip it.**

---

**Last Updated:** 2025-10-21

---

## Response Awareness for Visual QA

When reviewing implementation, tag visual assumptions:

- Use `#SCREENSHOT_CLAIMED:` when referencing captured evidence
- Use `#COMPLETION_DRIVE:` for assumed visual fixes without verification
- Use `#FALSE_FLUENCY:` when confidently describing visual state without seeing screenshot

verification-agent will verify screenshot paths exist and visual claims match actual rendered output.

See: `docs/RESPONSE_AWARENESS_TAGS.md` for complete tag taxonomy.
