# Plan Validation Protocol

## THE FUNDAMENTAL PROBLEM

**Original Issue**: Agents don't follow plans
**New Issue**: Plans themselves are corrupted - agents that FOLLOW corrupted plans build wrong things

This is WORSE. A corrupted plan poisons all downstream work.

---

## MANDATORY: Before Creating ANY Implementation Plan

### Step 1: Read User Specifications EXACTLY AS WRITTEN

- Use Read tool if specifications are in a file
- Copy user's exact words if in chat
- DO NOT paraphrase
- DO NOT interpret
- DO NOT "improve"

### Step 2: Create Plan Outline WITHOUT Details

**Structure only**:
```
1. Core logic to port
2. UI components to adapt
3. Data models
4. User flows
5. Testing requirements
```

NO implementation details yet.

### Step 3: For EACH Section - Quote User Directly

**Format**:
```markdown
## UI Components

**User's Specification (EXACT QUOTE)**:
> "Dropdown peptide selector → searchable() above input fields to load/access"

**Implementation**:
[Only now write how to implement what user specified]
```

### Step 4: Identify Creative Freedom vs. Hard Requirements

**Mark clearly**:
- ✅ **REQUIRED**: "search bar with auto-filtering dropdown"
- 🎨 **CREATIVE FREEDOM**: "explore thoughtful layouts for UX experience, e.g., half-circle dial"

### Step 5: Red Flag Check - Did I Add Anything Not Specified?

**PROHIBITED ADDITIONS**:
- ❌ Quick-select buttons (user didn't specify)
- ❌ Multiple dropdowns (user specified ONE search bar)
- ❌ Specific color schemes (unless specified)
- ❌ Specific layouts (unless required, not suggested as example)
- ❌ Implementation patterns user didn't ask for

**If I added ANYTHING not in user's spec**:
1. Remove it immediately
2. Ask user if they want it
3. Never assume

---

## VALIDATION CHECKLIST (Run Before Saving Plan)

### 1. Quote Compliance Test

For every feature in the plan:
- [ ] Can I quote the user's specification for this?
- [ ] Did I turn a suggestion into a requirement?
- [ ] Did I turn creative freedom into prescriptive details?

### 2. Invention Detection

- [ ] Did I add UI patterns not specified? (buttons, tabs, cards, etc.)
- [ ] Did I add features not requested?
- [ ] Did I specify exact layouts where user wanted creativity?

### 3. Example vs. Requirement Confusion

User says: "e.g., half-circle dial"
- ✅ CORRECT: "Agent has freedom to explore layouts (example: dial)"
- ❌ WRONG: "Implement half-circle dial design"

### 4. Simplicity Check

User says: "search bar with dropdown"
- ✅ CORRECT: One search bar, one dropdown
- ❌ WRONG: Search bar + quick-select buttons + multiple dropdowns

**Rule**: If user describes something simply, the plan must be simple.

### 5. Word-for-Word Comparison

Take user's specification section by section:

**User said**: [exact quote]
**Plan says**: [what I wrote]
**Match?**: YES / NO / DIFFERS IN: [specific difference]

If NO or DIFFERS: Fix immediately or ask user.

---

## EXAMPLE: Right vs. Wrong

### User's Specification
```
"Dropdown peptide selector → searchable() above input fields to load/access"
```

### ❌ WRONG Plan (What I Did)
```
**Searchable Compound Selector** (above input fields):
- Two selection mechanisms:
  1. Quick-select buttons for common compounds
  2. Dropdown selector for all other peptides
  3. GLOW/KLOW dropdown
```

**ERRORS**:
- Added quick-select buttons (not specified)
- Added separate GLOW/KLOW dropdown (not specified)
- Created complex multi-mechanism UI (not specified)
- Turned "dropdown selector" into THREE different components

### ✅ CORRECT Plan
```
**Compound Selector**:

**User's Specification (EXACT)**:
> "Dropdown peptide selector → searchable() above input fields to load/access"

**Implementation**:
- Search bar above input fields
- Clicking search bar opens dropdown
- Real-time filtering as user types
- Dropdown includes all peptides + GLOW/KLOW options

**iOS Adaptation**:
- TextField with `.searchable()` or custom implementation
- SwiftUI Picker or UIPickerView for dropdown
```

---

## EMERGENCY BRAKE: Signs of Plan Corruption

**STOP and re-read user spec if you find yourself writing**:
- "Two/three selection mechanisms"
- "Quick-select buttons for common..."
- "Separate dropdown for..."
- Complex multi-step flows user didn't describe
- Specific layouts where user said "explore ideas"
- Prescriptive details where user said "creative freedom"

---

## Token Cost of Plan Corruption

**This specific failure**:
- Corrupted plan: ~10K tokens to write
- Wrong implementation: 60K tokens wasted
- Fixing plan: 5K tokens
- Re-implementing: 60K+ tokens (future cost)

**TOTAL WASTE**: ~135K tokens from one corrupted plan

**Cascade effect**: Every agent reading corrupted plan builds wrong thing.

---

## Enforcement: How to Use This Protocol

### For workflow-orchestrator (Plan Creator)

1. Before writing plan, read this protocol
2. Create plan section by section with quote validation
3. Run validation checklist before saving
4. If ANY checkbox fails, fix before proceeding

### For All Agents (Plan Consumers)

1. If plan contradicts user's words in chat, FLAG IT
2. Ask: "Plan says X but user said Y - which is correct?"
3. Never blindly follow plan if it seems wrong

### For User (Plan Reviewer)

If you see plan drift:
- Point it out immediately (like you did)
- Demand validation protocol be run
- Require quote-by-quote comparison

---

## Summary: The Rule

**User's words = source of truth**
**Plan = faithful translation, not creative reinterpretation**
**Examples ≠ requirements**
**Simple specs = simple plans**
**Creative freedom ≠ license to over-specify**

If I can't quote the user to justify something in the plan, it shouldn't be in the plan.
