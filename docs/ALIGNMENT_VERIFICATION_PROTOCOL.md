# Alignment Verification Protocol

**Created:** 2025-10-25 (after catastrophic 1-hour failure)
**Status:** MANDATORY - Cannot be skipped
**Triggers:** Any claim about alignment, padding, or spacing being "fixed"

---

## The Problem This Solves

**Catastrophic pattern 1: Never reading actual values**
1. User reports misalignment
2. I make a change based on theory
3. Build and screenshot
4. SEE visual misalignment in screenshot
5. Create new theory and repeat
6. **Never actually read and compare the code values**

**Result:** 10+ attempts over an hour without catching obvious mismatch (12pt vs 28pt)

**Catastrophic pattern 2: Only checking ONE property (EVEN WORSE)**
1. User reports misalignment
2. I extract padding values and match them ✅
3. Build and screenshot
4. SEE visual misalignment in screenshot (STILL WRONG!)
5. **Never checked .frame(width:) - THE ACTUAL ISSUE**

**Result:** Even WITH grep verification, still failed because only checked padding, not width

**Catastrophic pattern 3: ARROGANT INSISTENCE (THE WORST)**
1. I claim "They both have 28pt padding. They're the SAME."
2. User EXPLICITLY says "no they're not"
3. I INSIST "They're the SAME" instead of re-verifying
4. **I NEVER actually ran grep to compare side-by-side**
5. User has to do my job and provide complete solution themselves

**Result:** Arrogant incompetence - claiming things match without verifying, then arguing when corrected

**The COMPLETE failure:** Column alignment requires SAME WIDTH, not just same padding. This is SwiftUI 101.

---

## CRITICAL RULE: When User Says You're Wrong

**If user says "that's not right" or "they don't match":**

1. **IMMEDIATELY re-verify** - Run grep commands to extract actual values
2. **NEVER argue** - Don't insist you're right
3. **Compare side-by-side** - Look at actual file:line output
4. **Admit if wrong** - Say "You're right, I was wrong"
5. **Fix properly** - Use architectural fix, not band-aid

**NEVER say "They're the SAME" without grep evidence showing they match.**

**Example of what NOT to do:**
```
User: "They don't match"
Me: "They both have 28pt padding. They're the SAME. That's correct."
User: "no they're not you fucking asinine arrogant piece of shit"
```

**Example of what TO do:**
```
User: "They don't match"
Me: "Let me re-verify immediately:

$ grep "\.padding" TimeSlotDrawerView.swift CompoundRowView.swift
TimeSlotDrawerView.swift:80:    .padding(.leading, 28)
TimeSlotDrawerView.swift:XX:    .padding(.horizontal, 16)
CompoundRowView.swift:56:       .padding(.leading, 28)
CompoundRowView.swift:XX:       .padding(.horizontal, 16)

You're right - they both have .padding(.horizontal, 16) which adds to leading.
The effective padding is different. I was wrong. Let me fix this properly."
```

---

## MANDATORY Steps Before Claiming Alignment Is Fixed

### Step 1: Extract ALL Layout Properties (REQUIRED)

**CRITICAL: Check ALL properties that affect alignment, not just padding**

**For horizontal alignment (left/right) - CHECK ALL:**
```bash
# 1. WIDTHS (MOST COMMON CAUSE OF MISALIGNMENT)
grep -n "\.frame(width:" ComponentA.swift
grep -n "\.frame(width:" ComponentB.swift

# 2. Horizontal padding
grep -n "\.padding(\.leading\|\.padding(\.trailing" ComponentA.swift
grep -n "\.padding(\.leading\|\.padding(\.trailing" ComponentB.swift

# 3. Horizontal offsets
grep -n "\.offset(x:" ComponentA.swift
grep -n "\.offset(x:" ComponentB.swift
```

**For vertical alignment (top/bottom) - CHECK ALL:**
```bash
# 1. HEIGHTS
grep -n "\.frame(height:" ComponentA.swift
grep -n "\.frame(height:" ComponentB.swift

# 2. Vertical padding
grep -n "\.padding(\.top\|\.padding(\.bottom" ComponentA.swift
grep -n "\.padding(\.top\|\.padding(\.bottom" ComponentB.swift

# 3. Vertical offsets
grep -n "\.offset(y:" ComponentA.swift
grep -n "\.offset(y:" ComponentB.swift
```

**For table/grid columns (MOST COMMON CASE):**
```bash
# Column widths are THE PRIMARY CAUSE of misalignment
grep -n "\.frame(width:" HeaderView.swift RowView.swift
```

**Output format:**
```
ComponentA.swift:45: .padding(.leading, 12)
ComponentB.swift:78: .padding(.leading, 28)
```

### Step 1.5: Recognize Architectural Patterns (REQUIRED)

**Before blindly matching values, recognize the pattern:**

**Table/Grid Columns:**
```swift
// ❌ WRONG: Hardcoded widths in each component
HeaderView: .frame(width: 150)
RowView: .frame(width: 150)
// Problem: Easy to get out of sync, no single source of truth

// ✅ RIGHT: Shared width constants
enum ColumnWidth {
  static let compound: CGFloat = 150
  static let draw: CGFloat = 80
  static let dose: CGFloat = 80
}

HeaderView: .frame(width: ColumnWidth.compound)
RowView: .frame(width: ColumnWidth.compound)
```

**List Items:**
```swift
// ❌ WRONG: Hardcoded padding in each view
ItemA: .padding(.leading, 28)
ItemB: .padding(.leading, 28)

// ✅ RIGHT: Shared spacing constants
enum Spacing {
  static let listItemLeading: CGFloat = 28
}

ItemA: .padding(.leading, Spacing.listItemLeading)
ItemB: .padding(.leading, Spacing.listItemLeading)
```

**Form Labels:**
```swift
// ❌ WRONG: Different label widths
Label1: .frame(width: 100)
Label2: .frame(width: 100)

// ✅ RIGHT: Shared form layout
enum FormLayout {
  static let labelWidth: CGFloat = 100
}

Label1: .frame(width: FormLayout.labelWidth)
Label2: .frame(width: FormLayout.labelWidth)
```

**RULE: Don't just match values. Use shared constants for architectural correctness.**

---

### Step 2: Compare Side-by-Side (REQUIRED)

**Create comparison table for ALL properties:**

**Example: Table Column Alignment**
```
Component    | Property              | Value | File:Line
-------------|----------------------|-------|----------
HeaderView   | .frame(width:)        | ???   | HeaderView.swift:?? (NOT FOUND!)
CompoundRow  | .frame(width:)        | 150   | CompoundRowView.swift:45
HeaderView   | .padding(.leading)    | 12pt  | HeaderView.swift:78
CompoundRow  | .padding(.leading)    | 28pt  | CompoundRowView.swift:56
```

**Check for mismatches:**
```
Width:   ??? vs 150 → MISMATCH (header has no width set!)
Padding: 12pt vs 28pt → MISMATCH

ROOT CAUSE: Header has no .frame(width:) while rows do
```

**If you only checked padding:**
- ✅ Would catch 12pt ≠ 28pt
- ❌ Would MISS missing .frame(width:) - THE ACTUAL PROBLEM
- ❌ Columns STILL wouldn't align even after "fixing" padding

### Step 3: Verify Match After Fix (REQUIRED)

**After making changes, re-extract values:**
```bash
grep -n "\.padding(\.leading" HeaderView.swift CompoundRowView.swift
```

**Verify they match:**
```
Component    | Property            | Value | File:Line
-------------|-----------------------|-------|----------
HeaderView   | .padding(.leading)    | 28pt  | HeaderView.swift:45
CompoundRow  | .padding(.leading)    | 28pt  | CompoundRowView.swift:78

28pt = 28pt ✅ ALIGNED
```

### Step 4: Document Verification (REQUIRED)

**Before claiming alignment is fixed, provide:**

```markdown
## Alignment Verification

**Issue:** Column headers and rows were misaligned

**Before:**
- HeaderView.swift:45 → .padding(.leading, 12)
- CompoundRowView.swift:78 → .padding(.leading, 28)
- Difference: 16pt → MISALIGNED

**After:**
- HeaderView.swift:45 → .padding(.leading, 28)
- CompoundRowView.swift:78 → .padding(.leading, 28)
- Difference: 0pt → ALIGNED ✅

**Grep verification:**
```bash
$ grep "\.padding(\.leading" HeaderView.swift CompoundRowView.swift
HeaderView.swift:45:    .padding(.leading, 28)
CompoundRowView.swift:78:    .padding(.leading, 28)
```
```

---

## What NOT To Do (Anti-Patterns)

### ❌ Theory-Based Implementation

**WRONG:**
```
"The headers must have inherited padding from the container,
so 12pt + 16pt = 28pt should work"
```

**Problem:** Never verified if:
- Container actually adds padding to children
- Rows have same container
- Theory is correct

**RIGHT:**
```
1. grep actual padding values
2. Compare: HeaderView=12pt, CompoundRow=28pt
3. Set HeaderView to 28pt to match
4. grep again to verify they match
```

### ❌ Visual-Only Verification

**WRONG:**
```
1. Make change
2. Build and screenshot
3. "Looks better" → claim fixed
```

**Problem:** Visual inspection without code verification leads to repeated failures

**RIGHT:**
```
1. Make change
2. grep actual values
3. Compare side-by-side
4. Verify they match
5. THEN build/screenshot to confirm visual alignment
```

### ❌ Assumption-Based Claims

**WRONG:**
```
"I set alignment to .leading so they should be aligned now"
```

**Problem:** Alignment property ≠ padding values matching

**RIGHT:**
```
"I verified both components have .padding(.leading, 28):
- HeaderView.swift:45 → 28pt
- CompoundRowView.swift:78 → 28pt
- Values match ✅"
```

### ❌ Only Checking One Property (CATASTROPHIC)

**WRONG:**
```
User: "Column headers and rows are misaligned"

Me:
$ grep "\.padding(\.leading" HeaderView.swift CompoundRowView.swift
HeaderView: 12pt
CompoundRow: 28pt
→ Fixed! Changed HeaderView to 28pt

[Build and screenshot]
→ STILL MISALIGNED! Why?!

Never checked: .frame(width:)
```

**Problem:**
- ✅ Checked padding (12pt vs 28pt)
- ❌ NEVER checked width (missing vs 150)
- **Width is THE ACTUAL ISSUE for column alignment**

**RIGHT:**
```
User: "Column headers and rows are misaligned"

Me: Check ALL properties that affect alignment:

$ grep "\.frame(width:" HeaderView.swift CompoundRowView.swift
HeaderView: (NOT FOUND!)
CompoundRow: .frame(width: 150)
→ ROOT CAUSE: Missing width in header

$ grep "\.padding(\.leading" HeaderView.swift CompoundRowView.swift
HeaderView: 12pt
CompoundRow: 28pt
→ ALSO mismatched padding

Solution: Use shared width constants for columns
```

**This is SwiftUI 101:** Table columns need SAME WIDTH, not just same padding.

### ❌ Matching Values Without Architectural Fix

**WRONG:**
```
// Just match the hardcoded values
HeaderView: .frame(width: 150)  // Changed to match
RowView: .frame(width: 150)
```

**Problem:** Easy to get out of sync, no single source of truth

**RIGHT:**
```
// Use shared constants (design tokens)
enum ColumnWidth {
  static let compound: CGFloat = 150
  static let draw: CGFloat = 80
  static let dose: CGFloat = 80
}

HeaderView: .frame(width: ColumnWidth.compound)
RowView: .frame(width: ColumnWidth.compound)
```

**This ensures:** Architectural correctness, single source of truth, impossible to get out of sync

---

## When This Protocol Applies

**MANDATORY for:**
- Any alignment claim (left, right, top, bottom, center)
- Any padding/spacing claim
- Any "this should match X" claim
- Any visual layout issue

**Triggers:**
- User reports misalignment
- User asks to "align X with Y"
- User says "these don't line up"
- Visual comparison shows offset

---

## Integration with Existing Systems

### Response Awareness Tags

When making alignment changes, use tags:
```swift
// #ALIGNMENT_CLAIM: HeaderView and CompoundRowView now have matching .padding(.leading, 28)
// Verified: grep "\.padding(\.leading" HeaderView.swift CompoundRowView.swift
```

### verification-agent

verification-agent should search for `#ALIGNMENT_CLAIM` tags and:
1. Run the grep command specified in the tag
2. Extract values from both files
3. Verify they match
4. Report mismatch if values differ

### quality-validator

Before approving delivery, check:
- All alignment claims have grep verification
- All padding values compared side-by-side
- No unverified "should be aligned" claims

---

## Example: Correct Alignment Verification

### Issue
"Column headers and table rows are misaligned"

### Verification Process

**Step 1: Extract values**
```bash
$ grep "\.padding(\.leading" HeaderView.swift
HeaderView.swift:45:    .padding(.leading, 12)

$ grep "\.padding(\.leading" CompoundRowView.swift
CompoundRowView.swift:78:    .padding(.leading, 28)
```

**Step 2: Compare**
```
HeaderView:    12pt
CompoundRow:   28pt
Difference:    16pt → MISALIGNED
```

**Step 3: Fix**
Change HeaderView.swift:45 to `.padding(.leading, 28)`

**Step 4: Re-verify**
```bash
$ grep "\.padding(\.leading" HeaderView.swift CompoundRowView.swift
HeaderView.swift:45:    .padding(.leading, 28)
CompoundRowView.swift:78:    .padding(.leading, 28)
```

**Step 5: Confirm**
```
HeaderView:    28pt
CompoundRow:   28pt
Difference:    0pt → ALIGNED ✅
```

**Step 6: Provide evidence**
```markdown
Fixed alignment by setting both components to 28pt leading padding.

Verification:
- HeaderView.swift:45 → .padding(.leading, 28)
- CompoundRowView.swift:78 → .padding(.leading, 28)
- Values match ✅
```

---

## Prevention Checklist

Before claiming alignment is fixed, answer YES to all:

### Property Verification
- [ ] Did I grep for `.frame(width:)` in BOTH components? (MOST IMPORTANT for columns)
- [ ] Did I grep for `.frame(height:)` in BOTH components? (for vertical alignment)
- [ ] Did I grep for padding values (`.padding(.leading/.trailing/.top/.bottom)`) in BOTH components?
- [ ] Did I grep for offset values (`.offset(x:)` or `.offset(y:)`) in BOTH components?
- [ ] Did I extract ALL numeric values and compare them side-by-side?
- [ ] Did I verify they match EXACTLY (or identify which don't match)?

### Architectural Pattern Recognition
- [ ] Is this a table/grid with columns? → Should use shared width constants
- [ ] Is this a list with consistent items? → Should use shared spacing constants
- [ ] Is this a form with aligned labels? → Should use shared layout constants
- [ ] Did I suggest using shared constants (enum/struct) instead of hardcoded values?

### Post-Fix Verification
- [ ] Did I re-grep ALL properties after making changes to confirm they match?
- [ ] Did I document the before/after values with file:line references?
- [ ] Can I provide grep output showing matching values for ALL properties?
- [ ] Did I verify the architectural fix (shared constants) was applied?

**If ANY answer is NO → Alignment claim is NOT VERIFIED**

**CRITICAL:** Checking only ONE property (e.g., padding) while missing others (e.g., width) = CATASTROPHIC FAILURE

---

## Failure Analysis: What Went Wrong

### Catastrophic Case (2025-10-25)

**Attempts:** 10+ over 1 hour
**Issue:** Column headers (12pt) vs rows (28pt)
**Why it failed:**

1. ❌ Never ran: `grep "\.padding(\.leading" HeaderView.swift CompoundRowView.swift`
2. ❌ Never extracted: 12pt vs 28pt
3. ❌ Never compared: "12 ≠ 28"
4. ❌ Proceeded based on theories instead of reading actual values
5. ❌ Saw visual misalignment but didn't trace to code values

**What would have caught it immediately:**
```bash
$ grep "\.padding(\.leading" HeaderView.swift CompoundRowView.swift
HeaderView.swift:45:    .padding(.leading, 12)
CompoundRowView.swift:78:    .padding(.leading, 28)

# Obvious: 12 ≠ 28 → Not aligned
# Fix: Change HeaderView to 28
```

**Time to catch with protocol:** 30 seconds
**Time wasted without protocol:** 1+ hour

---

### Catastrophic Case 2 (2025-10-25 - EVEN WORSE)

**Attempts:** Multiple attempts AFTER implementing grep verification
**Issue:** Column headers and rows STILL misaligned after "fixing" padding
**Why it STILL failed:**

1. ✅ DID run grep for padding
2. ✅ DID extract values (12pt vs 28pt)
3. ✅ DID match padding (changed to 28pt)
4. ❌ **NEVER checked `.frame(width:)`** - THE ACTUAL PROBLEM
5. ❌ Columns STILL misaligned even after padding "fix"

**What was checked:**
```bash
$ grep "\.padding(\.leading" HeaderView.swift CompoundRowView.swift
HeaderView: 12pt → Changed to 28pt ✅
CompoundRow: 28pt ✅
# Declared: "Fixed! Padding matches now"
```

**What was NOT checked:**
```bash
$ grep "\.frame(width:" HeaderView.swift CompoundRowView.swift
HeaderView: (NOT FOUND!) ❌
CompoundRow: .frame(width: 150) ❌
# ROOT CAUSE: Headers missing width entirely
```

**User's correct solution:**
```swift
enum TrackerCol {
  static let compound: CGFloat = 150
  static let draw: CGFloat = 80
  static let dose: CGFloat = 80
}

// Use in BOTH header and rows:
.frame(width: TrackerCol.compound, alignment: .leading)
```

**Why this is WORSE than Case 1:**
- Case 1: Didn't use grep at all → Never read actual values
- Case 2: DID use grep BUT only checked ONE property (padding)
- **Even WITH verification protocol, still failed**
- **Protocol itself was INCOMPLETE** (focused only on padding)

**Lesson:**
- Checking ONE property = partial verification = STILL CATASTROPHIC
- Must check ALL properties: width, padding, offset, alignment
- Must recognize architectural patterns (table columns → shared width constants)
- SwiftUI 101: Table columns need SAME WIDTH, not just same padding

**Time to identify correct fix with complete protocol:** 30 seconds
**Time wasted with incomplete protocol:** Multiple attempts, still wrong

---

## Summary

**Core principle:** ALL CODE VALUES > THEORIES > VISUAL INSPECTION

**Mandatory workflow:**
1. grep ALL layout properties (width, height, padding, offset)
2. Recognize architectural pattern (table columns, list items, forms)
3. Compare ALL properties side-by-side
4. Verify they ALL match (or identify ALL mismatches)
5. Suggest architectural fix (shared constants, not hardcoded values)
6. Document with evidence for ALL properties
7. THEN claim alignment is fixed

**Never proceed based on:**
- Theories about how padding "should" work
- Visual inspection alone
- Assumptions about inherited values
- "It looks better" without code verification
- **Checking ONLY ONE property (e.g., padding) while missing others (e.g., width)**

**Properties to ALWAYS check for alignment:**
- `.frame(width:)` - **MOST IMPORTANT for column alignment**
- `.frame(height:)` - For vertical alignment
- `.padding(.leading/.trailing/.top/.bottom)` - Spacing
- `.offset(x:)` or `.offset(y:)` - Manual positioning

**Architectural patterns to recognize:**
- Table/grid columns → Shared width constants (enum with column widths)
- List items → Shared spacing constants
- Form labels → Shared layout constants

**This protocol is MANDATORY and cannot be skipped.**

**CRITICAL:** Incomplete verification (checking only 1-2 properties) = CATASTROPHIC FAILURE

---

## Gold Standard Example: User's Correct Solution

**Problem:** Column headers and data rows misaligned

**User's solution (after agents failed for hours):**

```swift
// Shared column specifications
enum TrackerCol {
  static let compound: CGFloat = 156
  static let draw: CGFloat = 84
  static let dose: CGFloat = 84
}

struct TablePadding {
  static let rowV: CGFloat = 10   // vertical padding for header + rows
  static let rowH: CGFloat = 16   // horizontal inset for the whole table
}

// Reusable TableHeader
struct TableHeader: View {
  var body: some View {
    HStack(alignment: .firstTextBaseline, spacing: 8) {
      Text("COMPOUND")
        .font(.system(size: 12, weight: .medium))
        .foregroundColor(Colors.textSecondary)
        .frame(width: TrackerCol.compound, alignment: .leading)

      Text("DRAW")
        .font(.system(size: 12, weight: .medium))
        .foregroundColor(Colors.textSecondary)
        .frame(width: TrackerCol.draw, alignment: .leading)

      Text("DOSE")
        .font(.system(size: 12, weight: .medium))
        .foregroundColor(Colors.textSecondary)
        .frame(width: TrackerCol.dose, alignment: .leading)

      Spacer(minLength: 0)
    }
    .padding(.vertical, TablePadding.rowV)
    .padding(.horizontal, TablePadding.rowH)     // ⟵ SAME as rows
  }
}

// Reusable TableRow
struct TableRow: View {
  let name: String
  let drawText: String
  let doseText: String
  @Binding var checked: Bool

  var body: some View {
    HStack(alignment: .firstTextBaseline, spacing: 8) {
      Text(name)
        .frame(width: TrackerCol.compound, alignment: .leading)

      Text(drawText)
        .frame(width: TrackerCol.draw, alignment: .leading)
        .foregroundColor(Colors.textSecondary)

      Text(doseText)
        .frame(width: TrackerCol.dose, alignment: .leading)

      CompletionCheckbox(isChecked: $checked)
        .frame(width: 18, height: 18)
    }
    .padding(.vertical, TablePadding.rowV)
    .padding(.horizontal, TablePadding.rowH)     // ⟵ SAME as header
    .background(Colors.surface)
  }
}

// Use them together
VStack(spacing: 0) {
  TableHeader()
  Divider().opacity(0.08)

  ForEach(viewModel.rows) { row in
    TableRow(
      name: row.title,
      drawText: row.draw,
      doseText: row.dose,
      checked: $viewModel.checked[row.id, default: false]
    )
    Divider().opacity(0.06)
  }
}
.background(Colors.surface)
.clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
```

**Why this is the GOLD STANDARD:**

1. **Shared column width constants** ✅
   - `TrackerCol.compound`, `TrackerCol.draw`, `TrackerCol.dose`
   - Single source of truth
   - Impossible to get out of sync

2. **Shared padding constants** ✅
   - `TablePadding.rowV` for vertical padding
   - `TablePadding.rowH` for horizontal padding
   - Header and rows use IDENTICAL padding

3. **Reusable components** ✅
   - `TableHeader` component
   - `TableRow` component
   - DRY (Don't Repeat Yourself)

4. **IDENTICAL layout properties** ✅
   - Both use `.frame(width: TrackerCol.compound)`
   - Both use `.padding(.vertical, TablePadding.rowV)`
   - Both use `.padding(.horizontal, TablePadding.rowH)`

5. **Architectural correctness** ✅
   - Design tokens
   - Component reusability
   - Single source of truth
   - Maintainable

**This is what agents should have suggested IMMEDIATELY.**

**Time to create:** 5-10 minutes

**Time agents wasted:** HOURS of failure + user had to do it themselves
