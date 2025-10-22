# /agentfeedback --learn System

**Created:** 2025-10-21
**Purpose:** Automated design rule extraction and enforcement to prevent repeated violations

---

## The Problem This Solves

### Before This System

**Repeated corrections:**
- "Supreme LL 300 again - I've told you 3 times it must be 400"
- "You didn't study the anti-aging reference page BEFORE building (2nd time explaining this)"
- "Discovery scope too narrow - asked for 100+ diverse examples, got 12 documentation sites"

**Manual enforcement:**
- User has to catch every typography violation
- User has to explain same workflow rules repeatedly
- No learning from frustration patterns
- Rules exist in design system docs but aren't automatically enforced

**Result:** Wasted time, frustration, repeated mistakes

### After This System

**Automated learning:**
- System detects repeated corrections ("again", "3rd time", "still seeing...")
- Extracts structured rules from feedback
- Stores permanently in DESIGN_RULES.md
- Auto-enforces based on adherence level

**Adaptive enforcement:**
- Level 5: Zero deviation (strict MVP compliance)
- Level 1: Creative freedom (minimal rules)
- Rules flex based on creative constraints

**Result:** Mistakes caught BEFORE presenting to user

---

## How It Works

### Overview

```
User Feedback with --learn
         ↓
    Analyze Patterns
  (repeated violations?)
         ↓
   Extract Rules
 (typography, spacing,
  workflow, etc.)
         ↓
  Store in DESIGN_RULES.md
  (with adherence levels)
         ↓
Future Design/UX Work
         ↓
   Interactive Workflow
  (find, ask, approve)
         ↓
  Get Adherence Levels
  (design 1-5, inspiration 1-5)
         ↓
   Build with Agents
  (agents know rules)
         ↓
   Automated Validation
  (grep checks, build verify)
         ↓
  Rules Enforced Based on Level
  (strict at 5, flexible at 1)
         ↓
   Present Work
 (violations caught early)
```

### Two-Dimensional Creative Control

**Design Guide Adherence (1-5):** How strictly follow YOUR design system?
- 5 = ZERO deviation (MVP, speed, strict compliance)
- 4 = Colors only (can experiment with palette)
- 3 = Colors + Typography (can play with fonts)
- 2 = Significant freedom (colors + typography + spacing + layouts)
- 1 = Go nuts (maximum creative exploration)

**Inspiration Adherence (1-5):** How closely follow EXTERNAL examples?
- 5 = Copy exactly (pixel-perfect)
- 4 = Follow closely (layout/structure)
- 3 = Take pattern (make it your own)
- 2 = Study concept (apply differently)
- 1 = Just for taste (inform thinking)

### Example Combinations

**Design: 5, Inspiration: 1**
→ "Follow OUR rules strictly, browse examples for aesthetic taste only"
→ Use case: MVP that needs to ship fast

**Design: 1, Inspiration: 5**
→ "Break our rules, copy this example exactly"
→ Use case: Found perfect reference, want that exact UX

**Design: 3, Inspiration: 3**
→ "Moderate flexibility on both"
→ Use case: Take approach from examples, adapt to our style

---

## Usage

### Basic Workflow (Without --learn)

```bash
# User provides feedback
/agentfeedback The sticky nav blocks content, timeline is unreadable

# System:
# 1. Parses feedback
# 2. Categorizes issues
# 3. Assigns agents
# 4. Orchestrates fixes
# 5. Quality gates
# 6. Re-presents work
```

### Enhanced Workflow (With --learn)

```bash
# User provides feedback with --learn flag
/agentfeedback --learn You used Supreme LL 300 again - 3rd time I've told you
it must be 400. Also didn't study references before building.

# System additionally:
# 1. Detects repeated violations ("again", "3rd time")
# 2. Extracts structured rules:
#    - Typography: Supreme LL ONLY 400 weight
#    - Workflow: Study references BEFORE building
# 3. Stores in DESIGN_RULES.md with adherence levels
# 4. Creates automated validation checks
# 5. Tracks violation occurrences
# 6. Shows user what was learned
# 7. Proceeds with normal feedback processing
```

### Interactive Workflow for Design/UX Work

When design/UX issues are detected, system asks:

**Question 1:** "Found similar pages - use as reference?"
- Shows found examples
- User chooses which to follow

**Question 2:** "Provide inspiration via /inspire?"
- User can add examples to gallery
- Or proceed with existing knowledge

**Question 3:** "Design guide adherence (1-5)?"
- User sets strictness level
- Determines which rules apply

**Question 4:** "Inspiration adherence (1-5)?"
- User sets how closely to follow examples
- From pixel-perfect to taste-only

---

## Rule Extraction

### What Gets Extracted

**Typography Rules:**
- Font families and authorized usage
- Weight restrictions (e.g., "Supreme LL ONLY 400")
- Minimum/maximum sizes
- Color token requirements

**Spacing Rules:**
- Grid system (e.g., "4px grid, var(--space-X) only")
- No arbitrary pixel values
- Padding/margin standards

**Workflow Rules:**
- Required steps before building
- Discovery research requirements
- Approval gates
- Reference study mandates

**Information Architecture:**
- Content hierarchy principles
- Progressive disclosure patterns
- "Hero" content placement

**Code Quality:**
- Build requirements
- Testing standards
- Review processes

### Adherence Level Annotations

Each rule specifies which adherence levels it applies to:

```markdown
### Supreme LL Font Weight
**Applies to:** Levels 5-3 (strict enforcement)

**Rule:** Supreme LL may ONLY use weight 400 (NEVER 300)

**Adherence flexibility:**
- Levels 5-3: STRICT (must use 400)
- Levels 2-1: Can explore weights but must justify
```

**Workflow rules apply to ALL levels** (non-negotiable process).

---

## Automated Validation

### Grep-Based Checks

System generates automated validation for each rule:

```bash
# Typography: Supreme LL 300 check
grep -rE 'Supreme.*300|font-weight: 300' **/*.css **/*.module.css
# Expected: 0 matches
# Applies to: Levels 5-3

# Spacing: Arbitrary values check
grep -rE 'padding: [0-9]+px' **/*.css | grep -v 'var(--space'
# Expected: 0 matches
# Applies to: Levels 5-3

# Colors: Hardcoded values check
grep -rE 'rgba\(|#[0-9a-fA-F]{3,6}' **/*.css | grep -v 'var(--color'
# Expected: 0 matches
# Applies to: Levels 5-4
```

### Adherence-Aware Enforcement

```bash
ADHERENCE_LEVEL=5

# Run checks based on level
if [ "$ADHERENCE_LEVEL" -ge 3 ]; then
  # Strict typography enforcement
  violations=$(grep -rE 'font-weight: 300' app/ | wc -l)
  if [ "$violations" -gt 0 ]; then
    echo "❌ VALIDATION FAILED: Typography violations"
    exit 1
  fi
fi

if [ "$ADHERENCE_LEVEL" -ge 4 ]; then
  # Strict color enforcement
  violations=$(grep -rE '#[0-9a-fA-F]{6}' app/ | grep -v 'var(--color' | wc -l)
  if [ "$violations" -gt 0 ]; then
    echo "❌ VALIDATION FAILED: Color violations"
    exit 1
  fi
fi
```

### Workflow Checks

Manual verification required:
- Evidence of searching for similar pages?
- Evidence of studying references?
- Showed concept before building?
- Got user approval on approach?

---

## DESIGN_RULES.md Structure

```markdown
# DESIGN_RULES.md

## How Adherence Levels Work
[Explanation of 1-5 scales]

## Typography Rules
### [Rule Name]
**Applies to:** Levels X-Y
**Added:** [date] (violation occurred N times)
**Rule:** [Description]
**Validation:** [bash check]
**Adherence flexibility:** [How strict at each level]

## Spacing Rules
[Same structure]

## Workflow Rules (ALL LEVELS)
### BEFORE Building UI/UX Work
**Required steps:**
1. Search for similar pages
2. Show examples to user
3. Ask about references
4. Ask about /inspire
5. Get adherence levels (both scales)
6. Study references
7. Brainstorm approaches
8. Show concept
9. Get approval
10. Build

## Violation Tracking
### [Date]: [Rule Name]
- **File:** [path]
- **Violation:** [what was wrong]
- **Impact:** [consequences]

## Auto-Enforcement Checklist
[Checklist organized by adherence level]
```

---

## Real-World Example

### Initial Violation (No DESIGN_RULES.md)

```
User feedback:
"Supreme LL 300 used again - must be 400. Also protocol is buried,
should be hero. You didn't study anti-aging page before building."

Agent fixes issues manually.
User has to explain again next time.
```

### After --learn (DESIGN_RULES.md Created)

```bash
/agentfeedback --learn Supreme LL 300 used again - 3rd time. Must be 400.
Protocol buried - should be hero. Didn't study anti-aging page first.

# System extracts:
📚 RULE EXTRACTION COMPLETE

Extracted 3 rules from your feedback:

**Typography Rules:**
1. Supreme LL: ONLY 400 weight (NEVER 300) → Levels 5-3
   Validation: grep check for font-weight: 300

**Information Architecture Rules:**
2. Protocol pages: Protocol is hero (not buried) → ALL levels
   Validation: Manual review of hierarchy

**Workflow Rules:**
3. BEFORE building: Search for similar pages, study references → ALL levels
   Validation: Manual verification of research phase

**Violation Tracking:**
- Supreme LL 300: 3rd occurrence
- Skipped reference study: 2nd occurrence

Stored in DESIGN_RULES.md - will auto-enforce in future work.
```

### Next Design/UX Work (Auto-Enforcement)

```
User: /agentfeedback Fix recomposition protocol page spacing

# System detects design issue
# Reads DESIGN_RULES.md
# Finds similar pages (protocols/anti-aging)
# Asks user: "Use anti-aging as reference?"
# Asks: "Design adherence 1-5?"
# User chooses: 5 (strict compliance)

# Agent builds with design-master
# Knows: Supreme LL 400 only, protocol must be hero
# Follows workflow: studied anti-aging page first

# Before presenting:
# Runs validation:
violations=$(grep -rE 'font-weight: 300' app/ | wc -l)
if [ "$violations" -gt 0 ]; then
  # Agent catches violation BEFORE showing user
  # Fixes automatically
  # Re-validates
fi

# ✅ All checks pass
# User sees correct work on first try
```

---

## Benefits

### For You (The User)

**Stop repeating yourself:**
- Typography violations caught automatically
- Workflow skips prevented before building
- Spacing/color compliance enforced
- No need to explain same thing 3+ times

**Adaptive control:**
- Strict compliance when needed (Level 5)
- Creative freedom when wanted (Level 1)
- Fine-grained control over experimentation

**Learning system:**
- Rules accumulate over time
- Frustration patterns detected
- Violations tracked for analysis

### For Agents

**Clear guidelines:**
- Know which rules apply at which adherence level
- Understand flexibility boundaries
- Have examples of violations to avoid

**Automated validation:**
- Check work before presenting
- Catch mistakes early
- Reduce rework cycles

**Context preservation:**
- Reference pages identified up-front
- User preferences captured (adherence levels)
- Design system knowledge loaded when needed

---

## File Locations

**Command:**
`~/.claude/commands/agentfeedback.md` (enhanced with --learn support)

**Template:**
`~/claude-vibe-code/docs/DESIGN_RULES_TEMPLATE.md` (reference template)

**Project-specific rules:**
`[project-root]/DESIGN_RULES.md` (auto-generated by --learn)
OR
`[project-root]/docs/DESIGN_RULES.md` (alternative location)

**Documentation:**
`~/claude-vibe-code/docs/AGENTFEEDBACK_LEARN_SYSTEM.md` (this file)

---

## Future Enhancements

### Potential Additions

**Visual violation detection:**
- Screenshot analysis with vision
- Detect spacing/alignment issues visually
- Compare against reference pages

**Rule suggestions:**
- Proactively suggest rules based on patterns
- "I noticed you correct X often - should I add as rule?"

**Rule refinement:**
- Edit/remove rules via command
- Adjust adherence levels per-rule
- Merge duplicate rules

**Cross-project learning:**
- Share common rules across projects
- Global rules in `~/.claude/DESIGN_RULES.md`
- Project-specific overrides

**Analytics:**
- Most violated rules
- Time saved by auto-enforcement
- Adherence level usage patterns

---

## Success Metrics

**Before /agentfeedback --learn:**
- User repeats same corrections 3+ times
- Manual rule enforcement every session
- No learning from feedback patterns
- Wasted time catching predictable violations

**After /agentfeedback --learn:**
- Rules extracted automatically from feedback
- Violations caught BEFORE presenting work
- Learning system prevents repeated mistakes
- User sets creative freedom level (1-5 scales)
- Time saved on quality control

**Target:**
- 80% reduction in repeated corrections
- 90% of typography/spacing violations caught automatically
- 100% workflow compliance for design/UX work
- Adaptive enforcement based on user's creative needs

---

## Key Innovations

1. **Two adherence scales:** Design guide + Inspiration (independent control)
2. **Frustration detection:** Recognizes "again", "3rd time", "still seeing"
3. **Adherence-aware validation:** Rules flex based on creative constraints
4. **Interactive workflow:** Ask → Show → Approve before building
5. **Violation tracking:** Learn from patterns, not just single instances

---

**This system turns frustration into automation. Every repeated correction becomes a rule that prevents future violations.**
