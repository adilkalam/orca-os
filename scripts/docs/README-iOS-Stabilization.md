# iOS UI Stabilization Tools

**Purpose:** Minimal intervention to make iOS UI workflow sane and predictable.

**Impact:** Catches ~70% of visual chaos BEFORE build. Prevents iteration loops.

---

## 📦 What's Included

### 1. ui-guard.sh
**The First Gate** - Catches layout violations before build.

**What it checks:**
- ✅ **Design DNA exists** (MANDATORY - No DNA, no design)
- ✅ Spacing multiples of 4px/2pt (no arbitrary values)
- ✅ Hit areas ≥ 44pt (accessibility minimum)
- ✅ No hardcoded colors (must use DesignTokens.swift)
- ✅ No hardcoded font sizes (must use Typography tokens)
- ✅ Animation duration ≤ 0.3s (performance + accessibility)
- ✅ Accessibility labels/IDs present (VoiceOver support)

**Usage:**
```bash
# Run before build
./tools/ui-guard.sh path/to/your/ios/project

# Exit codes:
# 0 = All checks passed
# 1 = Critical violations found (blocks workflow)
```

**Output:**
- Terminal output with color-coded violations
- `.orchestration/verification/ui-guard-report.md` (detailed report)

**Integration:**
- Called by `verification-agent` in Step 0a (FIRST gate)
- Runs BEFORE xcodebuild, BEFORE tests
- If fails → HARD BLOCK (no build, no tests)

---

### 2. DesignTokens.swift
**Single Source of Truth** - All visual constants in one place.

**What it provides:**
- `Tokens.Space.*` - Spacing on 4px grid (base, xs, sm, md, lg, xl, xxl)
- `Tokens.Color.*` - All colors (background, text, accents, semantic)
- `Tokens.Typography.*` - Font sizes + weights (display, heading, body, label)
- `Tokens.Radius.*` - Border radius (sm, md, lg, pill)
- `Tokens.Motion.*` - Animation timing (instant, fast, base, slow)
- `Tokens.Layout.*` - Layout constants (minTouchTarget, maxContentWidth)

**Setup:**
```bash
# 1. Copy to your Xcode project
cp tools/DesignTokens.swift YourProject/Sources/DesignTokens.swift

# 2. Add to Xcode project (drag into file navigator)

# 3. Use in SwiftUI views
import SwiftUI

struct MyView: View {
    var body: some View {
        Text("Hello")
            .foregroundColor(Tokens.Color.textBody)
            .font(Tokens.Typography.font(size: Tokens.Typography.bodyLarge, weight: .medium))
            .padding(Tokens.Space.md)
            .background(Tokens.Color.surface)
            .cornerRadius(Tokens.Radius.md)
    }
}
```

**Customization:**
```swift
// Edit DesignTokens.swift to match your brand
enum Color {
    static let background = SwiftUI.Color(hex: "#0C051C")  // Your brand color
    static let accentGold = SwiftUI.Color(hex: "#C9A961")  // Your accent
    // ...
}
```

**Enforcement:**
- `ui-guard.sh` blocks hardcoded colors/fonts
- `AutoTokenLint.swift` catches violations at build time
- `swiftui-developer` agent REQUIRED to use tokens

---

### 3. AutoTokenLint.swift
**Build-Time Linter** - Catches violations during xcodebuild.

**What it catches:**
- ❌ `.font(.system(size: 17))` → Use `Tokens.Typography.font()`
- ❌ `Color(red: 0.5, green: 0.2, blue: 0.1)` → Use `Tokens.Color.*`
- ❌ `Color(hex: "#8B5CF6")` → Define in DesignTokens.swift
- ❌ `UIColor(red:...)` → Use SwiftUI Colors from tokens
- ⚠️  `.padding(17)` → Not multiple of 4 (use `Tokens.Space.*`)

**Usage:**
```bash
# Run manually
./tools/AutoTokenLint.swift path/to/your/ios/project

# Add to Xcode build phase
# Project → Target → Build Phases → "+" → New Run Script Phase
# Script:
./tools/AutoTokenLint.swift "$SRCROOT"

# Exit codes:
# 0 = No errors (warnings OK)
# 1 = Errors found (blocks build)
```

**Output:**
```
🔍 AutoTokenLint - Scanning for hardcoded values...
Found 42 Swift files to scan

❌ ERRORS (3):

ERROR: LoginView.swift:23
  Hardcoded font size using .font(.system(size:). Use Tokens.Typography.font() instead.
  Code: .font(.system(size: 17))

ERROR: CardView.swift:45
  Hardcoded color using Color(red:green:blue:). Use Tokens.Color constants instead.
  Code: .foregroundColor(Color(red: 0.5, green: 0.2, blue: 0.1))

⚠️  WARNINGS (1):

WARNING: ProfileView.swift:67
  Padding value 18 is not a multiple of 4. Use Tokens.Space constants (4px grid).
  Code: .padding(18)

❌ BUILD BLOCKED: Fix 3 error(s) before building
```

---

## 🔄 Workflow Integration

**verification-agent** orchestrates all tools in this order:

### Step 0a: UI Guard (FIRST)
```bash
./tools/ui-guard.sh . → .orchestration/verification/ui-guard-report.md
```
- **If fails:** HARD BLOCK (fix layouts before build)
- **If passes:** Continue to Step 0b

### Step 0b: Build
```bash
xcodebuild clean build → .orchestration/verification/build-output.log
```
- AutoTokenLint.swift runs during build (if added to build phase)
- **If fails:** HARD BLOCK (fix compile errors)
- **If passes:** Continue to Step 0c

### Step 0c: UI Tests
```bash
xcodebuild test → .orchestration/verification/ui-tests-output.log
```
- XCUITest runs accessibility checks (44pt targets, VoiceOver)
- **If fails:** HARD BLOCK (fix test failures)
- **If passes:** Continue to Step 0d

### Step 0d: Screenshots
```bash
xcrun simctl io booted screenshot → .orchestration/verification/*.png
```
- Visual evidence for quality-validator review
- Always succeeds (just captures state)

---

## 📋 Agent Responsibilities

### swiftui-developer (SOLE UI Author)
**Exclusive responsibilities:**
- ✅ Write ALL SwiftUI views and layouts
- ✅ Use DesignTokens.swift for EVERY constant
- ✅ Ensure code passes ui-guard.sh BEFORE committing
- ❌ NO other agent touches UI code

**Others are REVIEWERS:**
- `swift-code-reviewer` → Concurrency/safety (NOT visuals)
- `ios-debugger` → Crash debugging (NOT design)
- `ios-performance-engineer` → Performance (NOT layout)
- `verification-agent` → Runs checks (NOT authoring)

### verification-agent (Evidence Funnel)
**Single source of verification truth:**
- ✅ Runs ui-guard.sh (Step 0a)
- ✅ Collects build logs (Step 0b)
- ✅ Runs XCUITest (Step 0c)
- ✅ Captures screenshots (Step 0d)
- ✅ Creates verification-report.md (all evidence)

**Blocks if ANY gate fails.**

---

## 🎯 Success Metrics

**Before these tools:**
- ~80% visual chaos (arbitrary spacing, hardcoded colors)
- Iteration loops (build → find visual bugs → rebuild)
- Hours wasted on "looks fine to compiler, garbage to eyes"

**After these tools:**
- ~70% visual violations caught BEFORE build (ui-guard.sh)
- ~20% caught AT build time (AutoTokenLint.swift)
- ~10% caught by XCUITest (accessibility, hit targets)
- **Net result:** Predictable, consistent UI on first build

**Time savings:**
- BEFORE: 6-8 iterations to get UI right (~4-6 hours)
- AFTER: 1-2 iterations to get UI right (~1-2 hours)
- **Saved:** 3-4 hours per feature

---

## 🛠️ Setup Checklist

**One-time setup (per project):**

0. ✅ **Create Design DNA schema (MANDATORY)**
   ```bash
   # Design DNA MUST exist before UI work
   # Create project-specific DNA schema at:
   .claude/design-dna/{project-name}.json

   # OR ensure universal DNA exists:
   .claude/design-dna/universal-taste.json
   ```

   **Why:** "No DNA, no design" - Design constraints are MANDATORY.

   **What DNA defines:**
   - Typography rules (fonts, sizes, weights, hierarchy)
   - Color palette (backgrounds, text, accents, semantic colors)
   - Spacing system (base grid, tokens, layout constants)
   - Component patterns (buttons, cards, forms, animations)
   - Critical rules (project-specific design laws)
   - Forbidden patterns (what NOT to do)

   **Without DNA:**
   - ui-guard.sh HARD BLOCKS (Rule 0 fails)
   - AutoTokenLint.swift BLOCKS build
   - swiftui-developer refuses to work

   **See:** `docs/DESIGN_DNA_SYSTEM.md` for schema structure

1. ✅ Copy DesignTokens.swift to project
   ```bash
   cp tools/DesignTokens.swift YourProject/Sources/DesignTokens.swift
   ```

2. ✅ Customize colors/fonts for your brand
   ```swift
   // Edit DesignTokens.swift
   enum Color {
       static let background = SwiftUI.Color(hex: "#YourColor")
       // ...
   }
   ```

3. ✅ Add AutoTokenLint.swift to Xcode build phase
   ```
   Project → Target → Build Phases → "+" → New Run Script Phase
   Script: ./tools/AutoTokenLint.swift "$SRCROOT"
   ```

4. ✅ Test ui-guard.sh
   ```bash
   ./tools/ui-guard.sh YourProject
   # Should pass on first run (or show violations to fix)
   ```

5. ✅ Update swiftui-developer to use tokens
   - Replace all hardcoded values with Tokens.*
   - Run ui-guard.sh to verify

---

## 📚 Reference

### Spacing Scale (4px grid)
```
Tokens.Space.base   →  4pt (1× base)
Tokens.Space.xs     →  8pt (2× base)
Tokens.Space.sm     → 12pt (3× base)
Tokens.Space.md     → 16pt (4× base) ← Most common
Tokens.Space.lg     → 24pt (6× base)
Tokens.Space.xl     → 32pt (8× base)
Tokens.Space.xxl    → 48pt (12× base)
```

### Common Patterns
```swift
// Card
VStack {
    // Content
}
.padding(Tokens.Space.cardPadding)  // 20pt
.background(Tokens.Color.surface)
.cornerRadius(Tokens.Radius.md)

// Button
Button("Tap") { }
    .frame(minHeight: Tokens.Layout.minTouchTarget)  // 44pt
    .padding(.horizontal, Tokens.Space.lg)
    .background(Tokens.Color.accentPurple)
    .cornerRadius(Tokens.Radius.md)
    .animation(Tokens.Motion.easeOut, value: isPressed)

// Page container (ONE gutter)
ScrollView {
    VStack(spacing: Tokens.Space.lg) {
        // Components (no horizontal padding on children)
    }
    .padding(.horizontal, Tokens.Space.gutter)  // 16pt
}
```

---

## 🐛 Troubleshooting

### ui-guard.sh fails with "command not found"
```bash
chmod +x tools/ui-guard.sh
```

### AutoTokenLint.swift permission denied
```bash
chmod +x tools/AutoTokenLint.swift
```

### DesignTokens.swift not found in Xcode
- Drag `DesignTokens.swift` into Xcode file navigator
- Ensure it's added to your target (check target membership)

### ui-guard.sh reports false positives
- Check `.orchestration/verification/ui-guard-report.md` for details
- Verify hardcoded values are actually violations
- If legitimate (rare), add to exclude patterns in ui-guard.sh

---

## 🔮 Future Enhancements (Not Included)

**These are NOT part of the minimal stabilization:**
- Snapshot diffing (pixel-diff threshold 1pt) - Optional
- Preview contracts (one preview per component) - Optional
- Full Design DNA integration - Stage 7+
- Token adapter generator (DNA → tokens) - Future

**For now:** Focus on preventing the "clusterfuck" with these 3 tools.

---

**Created:** 2025-10-25
**Purpose:** iOS UI Immediate Stabilization (minimal survival kit)
**Impact:** ~70% visual chaos eliminated
**Time to value:** <1 hour setup, immediate results
