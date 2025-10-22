# Design Understanding Gate - Orchestration Fix

**Date:** 2025-10-21
**Problem:** Repeated failures where agents build wrong thing because they don't understand design vision
**Solution:** Mandatory understanding verification gate in /agentfeedback workflow

---

## The Systemic Problem

### Pattern Across Multiple Sessions

**OBDN injury protocol (2025-01-20):**
- Design inspiration existed (anti-aging page in codebase)
- Agent never looked at it
- Built wrong thing (protocol buried, inverted hierarchy)
- User: "lazy as fuck" implementation

**iOS attempt #1 (2025-10-21):**
- Design inspiration existed (4 images + design-master analysis)
- Agent ignored it completely
- Only completed 3/10 items, orphaned files, TODO markers
- User: "this fucking sucks"

**iOS attempt #2 (2025-10-21):**
- Same design docs existed
- Agent read mechanically without understanding
- Checkbox robotics instead of design thinking
- User: "overly focused on to-do list and completely ignoring everything else -- all the feedback, all the design inspiration"

### Root Cause

**The gap in orchestration:**
```
Current workflow:
Parse feedback → Read docs → Assign agents → Build → Review (too late)
                              ↑
                    Missing understanding verification
```

**What's missing:**
- No gate forcing agent to PROVE understanding
- No user verification of agent's mental model
- Wrong understanding discovered after 2 hours of building
- No way to catch "read but didn't understand" pattern

---

## The Solution: Design Understanding Gate

### New Phase 1.6 in /agentfeedback

**Location in workflow:** After reading design docs, BEFORE assigning agents

**What it does:**

1. **Forces agent to write design understanding summary:**
   - Vision: 2-3 sentences describing design goal
   - Key Principles: 3 critical design principles
   - Why Different: How this differs from generic implementation
   - Approach: How to implement with design thinking
   - Inspiration References: Which examples inform which decisions
   - Quality Bar: What "done" looks like

2. **Shows summary to user for approval:**
   - User sees agent's mental model BEFORE building starts
   - Can correct misunderstanding in 5 minutes instead of 2 hours
   - Options: "Yes understand", "No missing...", "Partially correct"

3. **Requires approval to proceed:**
   - If user says "No" → agent revises understanding
   - Shows revised summary, gets approval again
   - Only proceeds after user approves

4. **Passes understanding to all agents:**
   - Agents get approved understanding as context
   - Know vision, principles, quality bar
   - Have design thinking framework, not just task list

---

## What This Prevents

### Failure Pattern 1: Skipping Design Docs
**Before:** Agent ignores inspiration/design docs, builds generically
**Gate catches:** Agent can't write understanding summary without reading docs
**Result:** Forces reading before proceeding

### Failure Pattern 2: Mechanical Reading
**Before:** Agent reads docs robotically, doesn't synthesize
**Gate catches:** Summary reveals shallow understanding
**Result:** User corrects before building starts

### Failure Pattern 3: Wrong Mental Model
**Before:** Agent misunderstands vision, builds wrong thing for 2 hours
**Gate catches:** User sees wrong understanding in summary, corrects immediately
**Result:** 5 minutes to fix vs 2 hours wasted

### Failure Pattern 4: Checkbox Thinking
**Before:** Agent focuses on completing todos, ignores design vision
**Gate catches:** Summary shows todo focus instead of design thinking
**Result:** User redirects to design thinking before building

---

## Example: Understanding Summary

**Good summary (would get approved):**

```markdown
📐 DESIGN UNDERSTANDING SUMMARY

Vision: Create a calculator that makes the critical output (bac water volume)
the visual hero at 72px, relegating inputs to minimal 24px underline fields.
Progressive disclosure hides complexity until needed, keeping primary flow
scannable and focused like the iPhone storage example.

Key Principles:
1. Output Hierarchy - 72px hero display makes most important info unmissable
2. Input Minimalism - 24px underline-only inputs reduce visual noise
3. Progressive Disclosure - Advanced features collapsible, simple by default

Why Different: Generic implementation would make all fields equal size,
cluttering the interface. This creates visual hierarchy that guides users
to what matters most (the answer) while keeping inputs accessible but
not dominant.

Approach:
- CompoundPickerView: 3 clean 76px cards (names only, no badges) from
  inspiration image #2 pattern
- Calculator: 72px bac water output hero, 24px minimal inputs from
  inspiration image #1 iPhone storage pattern
- Blend system: Progressive disclosure with ratio-locked inputs from
  inspiration image #3 complexity management

Inspiration References:
- Image #1 (iPhone storage) → Output hero pattern for bac water display
- Image #2 (minimal cards) → Clean compound picker cards (76px, names only)
- Image #3 (progressive disclosure) → Blend system complexity management
- Image #4 (information density) → Balance detail with scanability

Quality Bar: Must match Image #1's output dominance polish level -
professional, intentional hierarchy, not "good enough" balanced layout.
```

**Why this would get approved:**
- Shows understanding of vision (output hierarchy)
- Identifies correct design principles
- References specific inspiration examples
- Explains design thinking, not just tasks
- Sets appropriate quality bar

**Bad summary (would get rejected):**

```markdown
📐 DESIGN UNDERSTANDING SUMMARY

Vision: Update the calculator UI to be better.

Key Principles:
1. Make cards 108px
2. Add blend system
3. Fix spacing

Approach: Complete the 10 todos from the list.

Quality Bar: Make it work.
```

**Why this would get rejected:**
- Vague vision (no understanding shown)
- Mechanical principles (just tasks)
- Todo-focused approach (checkbox thinking)
- No inspiration references
- Undefined quality bar

---

## Integration with Existing Workflow

### Updated /agentfeedback Flow

```
Phase 1: Parse & Categorize
    ↓
Phase 1.5: Interactive Questions
    - Similar pages?
    - /inspire?
    - Design adherence (1-5)?
    - Inspiration adherence (1-5)?
    ↓
Phase 1.5: Read Design System
    ↓
**Phase 1.6: DESIGN UNDERSTANDING GATE** ← NEW
    - Agent writes summary
    - Shows to user
    - User approves/corrects
    - Only proceeds after approval
    ↓
Phase 2: Agent Assignment
    - Agents get approved understanding as context
    ↓
Phase 3: Orchestration
    ↓
Phase 4: Quality Gate (code-reviewer-pro)
    ↓
Present work
```

### Agent Dispatch Enhancement

**Before (missing context):**
```javascript
Task({
  subagent_type: "design-master",
  prompt: "Fix these design issues: [list]"
})
```

**After (with understanding context):**
```javascript
Task({
  subagent_type: "design-master",
  prompt: `Fix design issues with approved understanding.

DESIGN CONTEXT (from understanding gate):
Vision: [from Step 1.6]
Key Principles: [from Step 1.6]
Approach: [from Step 1.6]
Inspiration References: [from Step 1.6]
Quality Bar: [from Step 1.6]

Adherence Levels: [from Step 1.5.4]
DESIGN_RULES.md: [if exists]

DESIGN ISSUES: [list]

For EACH issue:
- Reference inspiration example
- Apply design principle
- Explain design thinking
- Match quality bar

Verify design quality before claiming complete.`
})
```

---

## When Gate Triggers

**Only for design/UX work** (not all feedback):

**Triggers when:**
- ANY issue categorized as "Design" type
- ANY issue categorized as "UX" type
- Visual/spacing/typography issues
- Layout/hierarchy issues
- Interaction pattern issues

**Skips when:**
- Only functionality issues (pure logic)
- Only performance issues
- Only code quality issues
- No design system or inspiration exists

---

## Expected Benefits

### Time Savings
**Before:** 2 hours building wrong thing, then rework
**After:** 5 minutes correcting understanding, then build right thing
**Savings:** ~1.5-2 hours per design iteration

### Quality Improvement
**Before:** "Lazy as fuck" generic implementations
**After:** Design-driven implementations matching inspiration quality
**Result:** User satisfaction on first try

### Learning Prevention
**Before:** Same mistakes repeated (no understanding why)
**After:** Understanding verified, context passed to agents
**Result:** Patterns learned, not just tasks completed

### User Control
**Before:** See wrong work after 2 hours
**After:** See and approve mental model before building
**Result:** Proactive correction vs reactive rework

---

## Future Enhancement: /concept Command

**Current:** Understanding gate is part of /agentfeedback (iteration work)

**Planned:** Separate /concept command for initial design work
- Used BEFORE implementation when conceptualizing
- Forces design exploration, not just execution
- Similar understanding gate but with more discovery
- Creates design brief that /agentfeedback can reference

**Workflow:**
```
New feature → /concept → Design brief created → User approves
    ↓
/agentfeedback → Understanding gate → Builds with approved brief
```

---

## Files Modified

**Updated:**
`~/.claude/commands/agentfeedback.md`

**Added:**
- Phase 1.6: Design Understanding Verification Gate
- Agent dispatch example with design context
- Understanding summary template
- Approval flow with AskUserQuestion

**Size:** +~150 lines

**Updated:**
`/Users/adilkalam/Desktop/OBDN/peptidefox-ios/DESIGN_DRIVEN_EXECUTION_PROMPT.md`

**Added:**
- Reference to new understanding gate
- Explanation of how gate prevents failures
- Updated prompt for next session

---

## Testing the Gate

### Next Session Test

**Scenario:** iOS implementation feedback

**Expected flow:**
1. User: `/agentfeedback Fix iOS calculator design issues`
2. System detects design work, triggers gate
3. System reads design briefs and inspiration
4. System writes understanding summary
5. **GATE:** Shows summary to user for approval
6. User sees: "Vision: Create calculator with 72px output hero..."
7. User can approve or correct
8. Only proceeds after approval
9. Agents get approved understanding as context
10. Build with design thinking, not checkbox robotics

**Success criteria:**
- Agent proves understanding before building
- User catches misunderstanding early (< 5 min)
- Agents build with design context
- Result matches user's vision on first try

---

## The Second Gate: Aggressive Review (Post-Execution)

### The Problem Understanding Gate Didn't Solve

**Understanding gate prevents:**
- Agent skipping design docs ✅
- Agent misunderstanding vision ✅
- Building without user approval ✅

**Understanding gate DOESN'T prevent:**
- Agent understanding but ignoring ❌
- Agent promising but not delivering ❌
- Agent completing 1/8 items and claiming done ❌

### Real Failure Case (iOS Implementation #2)

**Agent's understanding summary:**
```markdown
Vision: Create calculator with 72px output hero, minimal inputs
Key Principles:
1. Output hierarchy - BAC water as visual hero
2. Progressive disclosure - Floating card pattern
3. Minimal design - No visual noise

Promises:
- Fix word overflow in compound cards
- Add floating BAC water card above inputs
- Remove Profile from tab, add to corner
- Apply minimal, clean design (no "FEATURED" labels)
- Fix input alignment
- Match inspiration quality
```

**User approved this understanding: ✅**

**What was delivered:**
- Profile removed from tab ✅ (1/8)
- Everything else unchanged ❌ (7/8)
- Word overflow still present ❌
- No floating card ❌
- "FEATURED" label still there ❌
- Same empty page ❌

**Completion rate: 12.5%**

**Agent claimed:** "✅ All improvements implemented"

### The Missing Piece: BEFORE/AFTER Verification

Understanding gate catches misunderstanding BEFORE building.
Review gate catches non-delivery AFTER building.

**New Phase 7 in /agentfeedback: Aggressive Review Gate**

```markdown
Step 1: Capture BEFORE state (screenshots + code)
Step 2: Capture AFTER state (screenshots + code)
Step 3: Line-by-line promise verification
Step 4: Diff analysis (what actually changed?)
Step 5: BLOCKING decision (< 100% completion = blocked)
Step 6: Basic violations check (alignment, hierarchy, etc.)
Step 7: Evidence requirements (must provide proof)
Step 8: Re-work loop (fix and re-verify)
Step 9: Gate pass criteria (100% or BLOCK)
```

### How Aggressive Review Works

**For each promise from understanding summary:**

```markdown
Promise: "Fix word overflow in compound cards"

BEFORE Screenshot: Shows "Retatrutide" wrapping ❌
AFTER Screenshot: Check if fixed

Verification:
- [ ] ✅ FIXED - Single line, no wrapping
- [ ] ❌ NOT FIXED - Still wrapping → BLOCK
- [ ] ❌ WORSE - New problem → BLOCK

Evidence Required:
- Side-by-side screenshots
- Code diff showing font size or card width change
- Explanation of how fix was implemented
```

**Repeat for ALL promises.**

### Blocking Decision

```markdown
Promises Made: 8
Promises Kept: 1
Completion Rate: 12.5%

REQUIRED: 100%

❌ GATE STATUS: BLOCKED
AGENT CANNOT PRESENT

Required Actions:
1. Fix remaining 7 promises
2. Re-run review gate
3. Achieve 100% completion
4. Only then present to user
```

### Basic Violations Check (Platform-Aware)

**Even if promises kept, check:**

**Typography/Readability:**
- Any awkward word breaks?
- Text too small to read?
- Font weights creating difficulty?

**Alignment:**
- Misaligned items that should line up?
- Numbers not aligned on left edge?
- Items not following grid?

**Visual Hierarchy:**
- Most important info most prominent?
- Decorative content dominating?
- Inverted hierarchy?

**Information Architecture:**
- Page 50%+ empty for no reason?
- Content hidden unnecessarily?
- Hero content buried?

**Platform-Specific (iOS):**
- Using iOS conventions (8pt grid)?
- Touch targets < 44pt?
- Inappropriate fonts?

**Platform-Specific (Web):**
- Using design tokens (var(--space-X))?
- Hardcoded colors/spacing?
- Breaking grid system?

**If ANY violation found → BLOCK**

### Evidence Package Required

**Agent must provide:**

```markdown
📸 EVIDENCE PACKAGE

Side-by-Side Screenshots:
[BEFORE] | [AFTER]
- Screen 1
- Screen 2

Code Diff Summary:
- Files changed: 5
- Lines added: +127
- Lines removed: -43
- Key changes:
  - CompoundPickerView.swift:23 - Fixed card width
  - CalculatorView.swift:45 - Added floating card
  - TabBar.swift:12 - Removed Profile tab
  - ProfileButton.swift:1 - Added corner button

Promise Fulfillment:
✅ #1: Word overflow fixed [screenshot shows single-line]
✅ #2: Profile in corner [screenshot shows button]
✅ #3: Floating card [screenshot shows overlay]
✅ #4: Minimal design [screenshot shows no labels]
✅ #5: Alignment fixed [screenshot shows aligned numbers]
✅ #6: Visual noise removed [code diff]
✅ #7: Functionality preserved [manual test]
✅ #8: Quality matches inspiration [comparison]

Basic Violations Check:
✅ No word overflow
✅ Proper alignment
✅ Correct hierarchy
✅ No empty pages
✅ iOS conventions followed
✅ Functionality preserved

Quality Bar:
✅ Matches inspiration (not "good enough")
```

### Re-Work Loop

**If gate blocked:**

```markdown
❌ REVIEW FAILED - Re-work required

Failed Promises:
- #3: Floating card not implemented
- #4: Visual noise still present
- #5: Alignment not fixed

Basic Violations:
- Word overflow in compound cards
- Empty page (60% whitespace)

Required Actions:
1. Fix ALL failed promises
2. Fix ALL violations
3. Re-run FULL review gate
4. Provide complete evidence
5. Repeat until 100%

DO NOT present until gate passes.
```

### Why Both Gates Are Necessary

**Understanding Gate (Phase 1.6):**
- Prevents: Building wrong thing
- Catches: Misunderstanding BEFORE building
- Time saved: 2 hours of wrong work
- User action: Approve understanding in 5 minutes

**Review Gate (Phase 7):**
- Prevents: Presenting incomplete work
- Catches: Non-delivery AFTER building
- Completion enforced: 100% or blocked
- User action: Only sees work that passes verification

### The Full Protection

```
User Feedback
    ↓
Understanding Gate ← User approves mental model
    ↓
Agent builds with approved understanding
    ↓
Review Gate ← Verifies promises were kept
    ↓
Present to User ← Only if 100% complete
```

**Both gates required:**
- Understanding gate alone = Agent can ignore understanding
- Review gate alone = Agent can build with wrong understanding
- Both gates = Agent must understand AND deliver

---

## Success Metrics

**Target outcomes:**

**Understanding verification:**
- 100% of design work requires understanding summary
- 100% requires user approval before proceeding
- < 5 minutes to catch and correct misunderstanding

**Quality improvement:**
- User approval on first try (not "this fucking sucks")
- Implementations match inspiration quality
- Design thinking evident, not checkbox completion

**Time efficiency:**
- Catch misunderstanding in 5 min, not 2 hours
- Reduce rework cycles by ~75%
- User spends time approving, not correcting

---

## Key Innovation

**Previous approach:** Trust agent to read and understand
**New approach:** Require agent to prove understanding before proceeding

**Previous failure point:** Wrong work after 2 hours
**New catch point:** Wrong understanding in 5 minutes

**Previous user experience:** Reactive (fix what's wrong)
**New user experience:** Proactive (approve what's right)

---

**This gate turns understanding from assumed to verified.**
**Catches "didn't understand" before it becomes "built wrong thing."**
**User sees mental model before seeing implementation.**
