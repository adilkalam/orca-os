# /agentfeedback --learn Build Summary

**Date:** 2025-10-21
**Purpose:** Automated design rule extraction and enforcement system
**Status:** ✅ Complete and ready to use

---

## What Was Built

A comprehensive automation system that learns from your feedback and prevents repeated violations.

### Core Features

1. **Rule Extraction** - Automatically extracts structured rules from feedback
2. **Persistent Storage** - DESIGN_RULES.md stores rules with adherence levels
3. **Interactive Workflow** - Conversational questions before building UI/UX
4. **Two Adherence Scales** - Independent control over design guide and inspiration
5. **Automated Validation** - Grep-based checks catch violations before presenting
6. **Frustration Detection** - Recognizes repeated corrections ("again", "3rd time")
7. **Violation Tracking** - Records when/where/how often rules violated

---

## Files Created/Modified

### 1. Enhanced /agentfeedback Command
**Location:** `~/.claude/commands/agentfeedback.md`

**Added:**
- Phase 0: --learn flag detection and rule extraction
- Phase 1.5: Interactive workflow for design/UX work
- Adherence level system (design 1-5, inspiration 1-5)
- Automated validation examples
- DESIGN_RULES.md integration

**Size:** ~1400 lines (from ~850 lines)

### 2. DESIGN_RULES.md Template
**Location:** `~/claude-vibe-code/docs/DESIGN_RULES_TEMPLATE.md`

**Contents:**
- Adherence scale explanation (both scales)
- Rule structure templates
- Violation tracking format
- Auto-enforcement checklist
- Automated validation script example
- Usage instructions

**Size:** ~400 lines

### 3. System Documentation
**Location:** `~/claude-vibe-code/docs/AGENTFEEDBACK_LEARN_SYSTEM.md`

**Contents:**
- Problem/solution overview
- How it works (workflow diagrams)
- Two-dimensional creative control explanation
- Usage examples
- Rule extraction details
- Automated validation details
- Real-world example walkthrough
- Benefits and success metrics

**Size:** ~500 lines

### 4. Build Summary
**Location:** `~/claude-vibe-code/docs/AGENTFEEDBACK_LEARN_BUILD_SUMMARY.md` (this file)

---

## How To Use

### First Time: Extract Rules from Feedback

```bash
/agentfeedback --learn You used Supreme LL 300 again - I've told you 3 times
it must be 400. Also, you didn't study the anti-aging reference page before
building. This is the second time I've had to explain this workflow.
```

**System will:**
1. Detect repeated violations ("again", "3rd time", "second time")
2. Extract structured rules:
   - Typography: Supreme LL ONLY 400 weight → Levels 5-3
   - Workflow: Study references BEFORE building → ALL levels
3. Create DESIGN_RULES.md in project root (or docs/)
4. Add automated validation checks
5. Track violation occurrences
6. Show you what was learned
7. Proceed with normal feedback processing

### Subsequent Design/UX Work

When you provide feedback with design/UX issues:

```bash
/agentfeedback Fix the recomposition protocol page spacing
```

**System will automatically:**
1. Detect design/UX work
2. Read DESIGN_RULES.md (if exists)
3. Search for similar pages in codebase
4. Ask you 4 questions:
   - "Use [found page] as reference?"
   - "Provide inspiration via /inspire?"
   - "Design guide adherence (1-5)?"
   - "Inspiration adherence (1-5)?"
5. Load design system docs (if adherence ≥ 3)
6. Orchestrate agents with rules + adherence levels
7. Run automated validation before presenting
8. Catch violations BEFORE you see them

---

## The Two Adherence Scales

### Design Guide Adherence (1-5)
**"How strictly should I follow YOUR design system?"**

| Level | Meaning | Use Case |
|-------|---------|----------|
| 5 | Zero deviation | MVP, speed, strict compliance |
| 4 | Colors only | Experiment with palette |
| 3 | Colors + Typography | Play with fonts/weights |
| 2 | Significant freedom | Colors + typography + spacing + layouts |
| 1 | Go nuts | Maximum creative exploration |

### Inspiration Adherence (1-5)
**"How closely should I follow EXTERNAL examples?"**

| Level | Meaning | Use Case |
|-------|---------|----------|
| 5 | Copy exactly | Pixel-perfect recreation |
| 4 | Follow closely | Layout/structure, adapt details |
| 3 | Take pattern | Make it your own |
| 2 | Study concept | Apply differently |
| 1 | Just for taste | Inform thinking only |

### Example Combinations

**Design: 5, Inspiration: 1**
→ Follow OUR rules strictly, use examples for taste only
→ *Perfect for: MVP that needs to ship fast*

**Design: 1, Inspiration: 5**
→ Break our rules, copy this example exactly
→ *Perfect for: Found perfect reference, want that exact UX*

**Design: 3, Inspiration: 3**
→ Moderate flexibility on both
→ *Perfect for: Balanced approach, some experimentation*

---

## What Gets Automated

### Typography Violations
**Before:** User manually catches "Supreme LL 300" every time
**After:** Grep check catches it automatically if adherence ≥ 3

```bash
grep -rE 'font-weight: 300' **/*.css
# Expected: 0 matches
# Auto-run when adherence ≥ 3
```

### Spacing Violations
**Before:** User manually catches arbitrary pixel values
**After:** Grep check enforces var(--space-X) tokens if adherence ≥ 3

```bash
grep -rE 'padding: [0-9]+px' **/*.css | grep -v 'var(--space'
# Expected: 0 matches
```

### Color Violations
**Before:** User manually catches hardcoded colors
**After:** Grep check enforces var(--color-X) tokens if adherence ≥ 4

```bash
grep -rE 'rgba\(|#[0-9a-fA-F]{3,6}' **/*.css | grep -v 'var(--color'
# Expected: 0 matches
```

### Workflow Violations
**Before:** User repeatedly explains "study references first"
**After:** System requires evidence of:
- Searching for similar pages
- Showing examples to user
- Getting approval on approach
- Studying reference implementations

**Applies to ALL adherence levels** (non-negotiable process)

---

## Rule Examples from Your Logs

Based on the OBDN failure logs you showed me, these rules would be extracted:

### From CRITICAL_FAILURE_ANALYSIS

**Rule 1: Workflow - Study References Before Building**
```markdown
**Applies to:** ALL levels (non-negotiable)
**Added:** 2025-01-20 (violation occurred 2 times)

**Rule:** BEFORE building any UI/UX, must:
1. Search for similar pages (`glob`, `ls`)
2. Study reference implementations (Read files)
3. Show understanding to user
4. Get approval on approach

**Why:** "The anti-aging page was right there at app/protocols/anti-aging/
and I never looked at it. That's the entire failure in one sentence."

**Validation:** Manual - agent must show evidence of steps 1-4
```

**Rule 2: Typography - Supreme LL Weight**
```markdown
**Applies to:** Levels 5-3 (strict enforcement)
**Added:** 2025-01-20 (violation occurred 3 times)

**Rule:** Supreme LL may ONLY use weight 400 (NEVER 300)

**Validation:**
grep -E 'Supreme.*300|font-weight: 300' **/*.css
# Expected: 0 matches

**Violation history:**
- 2025-01-20: app/protocols/injury/page.module.css
```

**Rule 3: Information Architecture - Content Hierarchy**
```markdown
**Applies to:** ALL levels

**Rule:** Most important content = most prominent placement

**Principle:** Protocol pages → Protocol is hero (not buried below cards)

**Anti-pattern:** "Protocol buried and nearly invisible. Protocol was the
MOST IMPORTANT content but hidden below massive cards. Users had to scroll
through overwhelming intro content to reach it."

**Validation:** Manual review - primary content immediately visible
```

### From SESSION_LOG_v5_discovery

**Rule 4: Discovery Research Scope**
```markdown
**Applies to:** ALL levels (non-negotiable)
**Added:** 2025-10-21 (violation: 4 correction attempts needed)

**Rule:** When researching design examples, use DIVERSE industries
(NOT narrow documentation focus)

**Required diversity:**
- E-commerce (product pages, checkout)
- Portfolios (case studies, showcases)
- Agency sites (work presentations)
- Editorial (magazine layouts)
- SaaS (feature pages)
- Marketing (landing pages)
- Fashion/Lifestyle (lookbooks)

**Anti-pattern:** "you looked through 12 sites and were narrowly focused
on...documentation. what the fuck? 100 examples OF GENERAL LAYOUT OF
INFORMATION ON A PAGE. Not fucking documentation, jesus christ."

**Validation:** Manual - check variety of site types analyzed
```

---

## Expected Results

### Reduction in Repeated Corrections

**Targets:**
- 80% reduction in repeated corrections overall
- 90% of typography violations caught automatically
- 90% of spacing violations caught automatically
- 100% workflow compliance for design/UX work

### Time Savings

**Before:**
- User manually catches violations every iteration
- Explains same workflow rules repeatedly
- Multiple rework cycles per task

**After:**
- Automated checks catch 90% of violations
- Workflow enforced automatically
- Fewer rework cycles

**Estimated time saved:** 30-50% on design/UX iterations

### Quality Improvements

**Before:**
- Rules in design system docs but not enforced
- Agents don't know which rules apply when
- No adaptive enforcement based on context

**After:**
- Rules enforced automatically based on adherence level
- Agents know exactly what's required
- Creative freedom controlled by user (1-5 scales)

---

## Next Steps

### To Start Using:

1. **No setup needed** - system is ready to use immediately

2. **First /agentfeedback --learn:**
   - Next time you give repeated feedback, add --learn flag
   - System will extract rules and create DESIGN_RULES.md

3. **Subsequent design work:**
   - Normal /agentfeedback will automatically trigger interactive workflow
   - Answer 4 questions (reference, inspire, adherence scales)
   - Agents will follow rules + validation will run

### To Test:

1. **Simulate violation:**
   - Add `font-weight: 300` to a CSS file
   - Run validation: `grep -rE 'font-weight: 300' **/*.css`
   - Should catch violation

2. **Test --learn flag:**
   - Use real feedback with repeated violations
   - Verify DESIGN_RULES.md gets created
   - Check rule structure matches template

3. **Test interactive workflow:**
   - Provide feedback with design/UX issues
   - Verify 4 questions appear
   - Confirm adherence levels control enforcement

---

## Technical Specifications

### Rule Storage Format
- **Location:** `[project-root]/DESIGN_RULES.md` or `[project-root]/docs/DESIGN_RULES.md`
- **Format:** Markdown with frontmatter-style metadata
- **Sections:** Typography, Spacing, Colors, Workflow, Info Architecture, Code Quality
- **Per-rule:** Applies-to levels, validation check, flexibility matrix, violation history

### Validation Checks
- **Method:** Grep-based pattern matching + manual verification
- **Runtime:** Before presenting work (Wave 4 quality gate)
- **Adherence-aware:** Only runs checks applicable to chosen level
- **Failure handling:** Request rework with specific requirements

### Interactive Questions
- **Tool:** AskUserQuestion with 2-4 options per question
- **Timing:** After issue categorization, before agent assignment
- **Storage:** Answers passed to agents as context
- **Scope:** Only triggered for design/UX work

---

## Files Reference

**Command:**
- `~/.claude/commands/agentfeedback.md` (enhanced)

**Documentation:**
- `~/claude-vibe-code/docs/AGENTFEEDBACK_LEARN_SYSTEM.md` (how it works)
- `~/claude-vibe-code/docs/DESIGN_RULES_TEMPLATE.md` (template)
- `~/claude-vibe-code/docs/AGENTFEEDBACK_LEARN_BUILD_SUMMARY.md` (this file)

**Auto-generated (per project):**
- `[project-root]/DESIGN_RULES.md` (created by first --learn usage)

---

## Success Criteria

### ✅ Built
- [x] --learn flag detection
- [x] Rule extraction system
- [x] DESIGN_RULES.md template
- [x] Interactive workflow (4 questions)
- [x] Two adherence scales (design + inspiration)
- [x] Automated validation examples
- [x] Adherence-aware enforcement
- [x] Frustration detection
- [x] Violation tracking
- [x] Comprehensive documentation

### ✅ Ready For
- [x] First --learn usage (extract rules from real feedback)
- [x] Interactive workflow testing (answer 4 questions)
- [x] Adherence level testing (strict vs flexible)
- [x] Automated validation testing (grep checks)
- [x] Real-world usage (OBDN project)

---

**This system turns your frustration into automation. Every repeated correction becomes a permanent rule that prevents future violations while giving you adaptive control over creative freedom.**

**Ready to use immediately with `/agentfeedback --learn [your feedback]`**
