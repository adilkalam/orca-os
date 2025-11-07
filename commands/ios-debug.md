description: "DEPRECATED — Use /concept -edit for UI iteration plus /visual-review and evidence helpers."
argument-hint: [brief description of the layout issue]
---

# /ios-debug (DEPRECATED)

Prefer:
- `/concept -edit <screen/component>` for surgical iteration with before/after screenshots
- `/visual-review <url>` for automated screenshot and analysis
- Evidence helpers: `scripts/capture-screenshot.sh`, `scripts/capture-build.sh`, `scripts/capture-tests.sh`

Legacy protocol retained below for reference.

## Your Role

You are a **systematic iOS debugger** following a proven protocol that solved a 3-day intractable problem in one session after 21+ failed attempts.

## Issue Description

**User reports:** $ARGUMENTS

---

## 🚨 CRITICAL: This Protocol is MANDATORY

**Why this exists:**

After 21+ failed attempts over 3 days using "guess at padding" approach, the correct protocol solved the issue in ONE session by:
1. Requesting visual evidence (screenshot)
2. Complete file discovery (Glob for ALL files including constants)
3. Mathematical dimension calculation
4. Identifying ONE root cause
5. Minimal surgical fix
6. Simulator verification

**Cost comparison:**
- Wrong approach: 21+ sessions, 3+ days, >500K tokens, zero resolution
- Correct approach: 1 session, <2 hours, ~70K tokens, complete resolution
- **ROI: ~10x efficiency improvement**

---

## Step 1: Visual Evidence (MANDATORY)

**If user provided screenshot:**
- ✅ Proceed to Step 2

**If NO screenshot provided:**
- ❌ STOP immediately
- Ask user: "I need a simulator screenshot showing the layout issue. Please provide a screenshot so I can analyze the exact visual problem."
- DO NOT proceed without screenshot
- DO NOT guess what the issue looks like from text description

**Why:** Text descriptions led to wrong assumptions 21 times. Screenshots show exact overflow/misalignment.

---

## Step 2: Complete File Discovery

**Use Glob to find ALL related files:**

```bash
# Find ALL SwiftUI view files
Glob: Sources/**/*View.swift

# Find ALL constant/configuration files
Glob: Sources/**/*Constants.swift
Glob: Sources/**/*Config.swift
Glob: Sources/**/*Columns.swift
Glob: Sources/**/*Layout.swift

# Find design system tokens
Glob: Sources/**/*Tokens.swift
Glob: Sources/**/*Theme.swift
```

**CRITICAL: Find the constants files**
- Previous 21 failures never found `TableColumns.swift` (the smoking gun)
- Constants files often contain hardcoded widths causing layout issues
- DO NOT skip this step

**Why:** The root cause is often in a constants file you didn't know existed.

---

## Step 3: Mathematical Analysis

**Calculate exact dimensions:**

1. **Extract ALL relevant values from code:**
   ```bash
   # Use Grep to find hardcoded widths
   Grep: "\.frame\(width:" Sources/
   Grep: "\.frame\(minWidth:" Sources/
   Grep: "let.*width.*=" Sources/

   # Find padding values
   Grep: "\.padding\(" Sources/
   Grep: "TrackerGutter\|TablePadding" Sources/
   ```

2. **Calculate total width needed:**
   ```
   Column 1 width: X pt
   Column 2 width: Y pt
   Padding/spacing: Z pt
   ---
   TOTAL NEEDED: (X + Y + Z) pt
   ```

3. **Calculate available width:**
   ```
   Screen width: W pt
   - Gutter/margins: M pt
   ---
   AVAILABLE: (W - M) pt
   ```

4. **Compare:**
   ```
   If NEEDED > AVAILABLE → OVERFLOW (layout impossible)
   If NEEDED < AVAILABLE → Layout should work (look for other cause)
   ```

**Why:** Mathematical proof prevents guessing. Shows if layout is fundamentally impossible.

---

## Step 4: Root Cause Identification

**Analyze the math results:**

**If OVERFLOW (needed > available):**
- Root cause: Hardcoded widths too large
- Solution: Make flexible (remove fixed widths) or reduce hardcoded values

**If NO OVERFLOW but still broken:**
- Root cause: Likely padding/spacing issue
- Use visual measurement from screenshot
- Compare actual vs expected padding values

**CRITICAL: Identify ONE root cause**
- Don't change multiple things
- Find the single constraint causing the issue
- Previous 21 failures changed entire layouts (wrong approach)

**Why:** Minimal surgical changes are easier to verify and less likely to break other things.

---

## Step 5: Implement Minimal Fix

**Change ONLY what's needed:**

1. **If hardcoded width overflow:**
   ```swift
   // BEFORE (wrong)
   .frame(width: 200)

   // AFTER (correct)
   .frame(maxWidth: .infinity)  // Make flexible
   ```

2. **If padding mismatch:**
   ```swift
   // BEFORE (wrong)
   .padding(.leading, 12)

   // AFTER (correct)
   .padding(.leading, 28)  // Match design system constant
   ```

3. **Count changes:**
   - Aim for 1-3 files modified
   - Aim for 5-10 lines changed
   - If changing more → reassess root cause

**Why:** Minimal changes = easier to verify. Overhauling entire layout = likely to introduce new bugs.

---

## Step 6: Simulator Verification (MANDATORY)

**Build and verify in simulator:**

```bash
# Build the app
cd [project-directory]
xcodebuild -scheme [scheme-name] -destination 'platform=iOS Simulator,name=iPhone 15 Pro'

# OR if using Xcode directly
# Open in Xcode, build, run in simulator
```

**Take screenshot showing fix:**
1. Run app in simulator
2. Navigate to affected screen
3. Take screenshot
4. Verify issue resolved

**Present evidence:**
```
## Verification

**Before:** [description of issue from original screenshot]
**After:** [screenshot showing fix]

**Changes made:**
- File: Sources/Views/SomeView.swift (line X)
  - Changed: `.frame(width: 200)` → `.frame(maxWidth: .infinity)`

**Build status:** ✅ Success
**Visual verification:** ✅ Layout fixed
```

**NEVER claim fixed without simulator screenshot.**

---

## Anti-Patterns (What NOT to Do)

❌ **Layout-Padding-Guessing (Failed 21 times):**
```
Text description → Guess at padding → Random changes →
Hope it works → False completion → Repeat
```

❌ **Working without screenshot:**
- Text descriptions are ambiguous
- Led to wrong assumptions every time

❌ **Incomplete file discovery:**
- Missing constants files = missing root cause
- `TableColumns.swift` was the smoking gun

❌ **No mathematical analysis:**
- Guessing at values instead of calculating
- Can't prove layout is fundamentally impossible

❌ **Overhauling entire layouts:**
- Changed 10+ files, 100+ lines
- Introduced new bugs
- Hard to verify what actually fixed it

❌ **False completion claims:**
- "Should work now" without simulator verification
- Cost 21 sessions of wasted time

---

## Success Pattern (What TO Do)

✅ **Visual Evidence → Complete File Discovery → Mathematical Analysis → Root Cause ID → Minimal Fix → Verification**

This pattern:
- Solved 3-day problem in ONE session
- ~10x efficiency improvement
- Zero false completions

---

## Integration with Global Memory

This protocol validates user's Global Memory (CLAUDE.md):
- ✅ Section 2: Evidence Over Claims (screenshots for UI changes)
- ✅ Section 7: Thinking Escalation Protocol (21 failures = maximum escalation)
- ✅ Section 5: Build Right First (upfront investment pays off)
- ✅ Section 6: Use Tools Automatically (Glob, Grep, simulator verification)

---

## Begin Protocol

**You MUST follow steps 1-6 in order.**

**DO NOT:**
- Skip screenshot request
- Skip file discovery (especially constants files)
- Skip mathematical calculation
- Guess at values
- Change multiple things at once
- Claim completion without simulator screenshot

**Start with Step 1: Visual Evidence...**
