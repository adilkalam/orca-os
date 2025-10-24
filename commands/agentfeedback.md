---
description: Parse user feedback and orchestrate agents to address all points systematically. Use --learn flag to extract design rules and prevent repeated mistakes.
allowed-tools: [TodoWrite, Task, Read, Write, Edit, AskUserQuestion, Glob, Grep, Bash]
argument-hint: <your feedback on completed work> [--learn]
---

# /agentfeedback - Systematic Feedback Processing & Orchestration

**PURPOSE**: Parse user feedback on completed work, categorize issues, and orchestrate agents to fix ALL points before re-presenting.

**This prevents:**
- Jumping straight into fixing without planning
- Missing feedback points
- Skipping agent orchestration on iteration
- No quality review before re-presenting

---

## NEW: --learn Flag (Automated Rule Extraction & Enforcement)

**Usage:** `/agentfeedback --learn [your feedback]`

**What it does:**
1. **Extracts structured rules** from your feedback patterns
2. **Stores rules permanently** in DESIGN_RULES.md with adherence levels
3. **Auto-enforces rules** in future sessions via verification checklists
4. **Prevents repeating** the same design/workflow violations
5. **Learns from frustration** - recognizes repeated corrections

**When to use --learn:**
- You're giving the SAME feedback repeatedly (typography violations, spacing issues, etc.)
- You want rules extracted from this feedback to prevent future violations
- You've explained a workflow/principle that should be permanent

**Example:**
```
/agentfeedback --learn You used Supreme LL 300 weight again - I've told you 3 times
it must be 400. Also, you didn't study the anti-aging reference page before building.
This is the second time I've had to explain this workflow.
```

**Result:**
- Rule added: "Typography: Supreme LL ONLY 400 weight (NEVER 300)" → Adherence Level 5-3
- Rule added: "Workflow: BEFORE building UI, search for similar pages and study references" → All levels
- Violation check added: `grep -E 'font-weight: 300'` must return 0 results
- Future agents automatically verify these rules before claiming complete

---

## Phase 0: Detect --learn Flag & Extract Rules

**If --learn flag detected:**

### Step 0.1: Analyze Feedback for Repeated Patterns

**Look for indicators of repeated violations:**
- "I've told you X times..."
- "Again..."
- "This is the second/third time..."
- "We've been over this..."
- "You keep doing..."
- "Still seeing..."

**Frustration indicators:**
- "what the fuck"
- "jesus christ"
- "lazy as fuck"
- Multiple exclamation marks
- ALL CAPS emphasis

### Step 0.2: Extract Structured Rules

**Parse feedback into rule categories:**

1. **Typography Rules** (with adherence levels)
   - Font families and usage contexts
   - Authorized weights only
   - Minimum/maximum sizes
   - Color token usage

2. **Spacing Rules** (with adherence levels)
   - Grid system requirements
   - Token usage (var(--space-X))
   - Padding/margin standards
   - No arbitrary values

3. **Workflow Rules** (apply to ALL adherence levels)
   - Required steps before building
   - Discovery/research requirements
   - Approval gates
   - Quality checks

4. **Information Architecture Rules**
   - Content hierarchy principles
   - Progressive disclosure patterns
   - "Hero" content placement

5. **Code Quality Rules**
   - Build requirements
   - Testing standards
   - Documentation needs

### Step 0.3: Create Adherence Level Annotations

For each rule, determine which adherence levels it applies to:

**Level 5 (strict):** Typography tokens, spacing grid, authorized fonts
**Level 4:** Color experimentation allowed, but not typography
**Level 3:** Color + typography experimentation
**Level 2:** Color + typography + spacing exploration
**Level 1:** Creative freedom (minimal rules)

**Workflow rules:** ALL levels (non-negotiable process)

### Step 0.4: Generate Violation Checks

For each rule, create automated validation:

```yaml
# Example checks
typography_supremell_weight:
  check: "grep -E 'font-weight: 300' **/*.css **/*.module.css"
  expected: 0
  failure: "Supreme LL 300 found (unauthorized - must be 400)"
  applies_to_levels: [5, 4, 3]

spacing_arbitrary_values:
  check: "grep -E 'padding: [0-9]+px' **/*.css | grep -v 'var(--space'"
  expected: 0
  failure: "Arbitrary spacing values found (must use var(--space-X) tokens)"
  applies_to_levels: [5, 4, 3]

workflow_reference_study:
  check: "manual"
  criteria: "Agent must show evidence of studying similar pages before building"
  applies_to_levels: [5, 4, 3, 2, 1]
```

### Step 0.5: Check for Existing DESIGN_RULES.md

```bash
# Check project root first
if [ -f "./DESIGN_RULES.md" ]; then
  Read ./DESIGN_RULES.md
elif [ -f "./docs/DESIGN_RULES.md" ]; then
  Read ./docs/DESIGN_RULES.md
else
  # Create new DESIGN_RULES.md
  echo "No existing DESIGN_RULES.md found - will create new one"
fi
```

### Step 0.6: Update or Create DESIGN_RULES.md

**Structure:**

```markdown
# DESIGN_RULES.md

**Last Updated:** [date]
**Purpose:** Automatically enforce design/workflow rules to prevent repeated violations

---

## How Adherence Levels Work

When starting design/UI work, you'll be asked TWO questions:

1. **Design Guide Adherence (1-5):** How strictly should I follow YOUR design system?
   - 5 = ZERO deviation (strict compliance, MVP, speed)
   - 4 = Colors only (can experiment with color palette)
   - 3 = Colors + Typography (can play with fonts/weights/sizes)
   - 2 = Colors + Typography + Spacing + Layouts (significant freedom)
   - 1 = Go nuts, be creative (maximum exploration)

2. **Inspiration Adherence (1-5):** How closely should I follow EXTERNAL examples?
   - 5 = Copy this exactly (pixel-perfect recreation)
   - 4 = Follow layout/structure closely, adapt details
   - 3 = Take the pattern/approach, make it your own
   - 2 = Study the concept/principle, apply differently
   - 1 = Just for taste/aesthetic reference, inform thinking

---

## Typography Rules

### Supreme LL Font
**Applies to:** Levels 5-3 (strict enforcement)
**Added:** [date] (violation occurred 3 times)

**Rule:** Supreme LL may ONLY use weight 400 (NEVER 300)

**Validation:**
```bash
grep -E 'Supreme.*300|font-weight: 300' **/*.css **/*.module.css
# Expected: 0 matches
```

**Why:** Weight 300 is unauthorized per design system. Repeated violation.

**Adherence flexibility:**
- Levels 5-3: STRICT (must use 400)
- Levels 2-1: Can explore weights but must justify

---

### Color Tokens
**Applies to:** Levels 5-4 (strict enforcement)
**Added:** [date]

**Rule:** Colors must ONLY use var(--color-X) tokens (NO custom rgba/hex values)

**Validation:**
```bash
grep -E 'rgba\(|#[0-9a-fA-F]{3,6}' **/*.css | grep -v 'var(--color'
# Expected: 0 matches
```

**Adherence flexibility:**
- Levels 5-4: STRICT (tokens only)
- Level 3: Can experiment with new colors but maintain WCAG ratios
- Levels 2-1: Free to explore color palettes

---

## Spacing Rules

### Mathematical Grid System
**Applies to:** Levels 5-3 (strict enforcement)
**Added:** [date]

**Rule:** ALL spacing must use var(--space-X) tokens from 4px grid (NO arbitrary pixel values)

**Validation:**
```bash
grep -E 'padding: [0-9]+px|margin: [0-9]+px' **/*.css | grep -v 'var(--space'
# Expected: 0 matches
```

**Adherence flexibility:**
- Levels 5-3: STRICT (tokens only)
- Level 2: Can explore alternative spacing systems
- Level 1: Free exploration

---

## Workflow Rules (ALL LEVELS)

### BEFORE Building UI/UX Work
**Applies to:** ALL levels (non-negotiable)
**Added:** [date] (violation occurred 2 times)

**Required steps:**
1. **Search for similar pages** in codebase (`glob`, `ls`)
2. **Show found examples** to user
3. **Ask:** "Is [example] a good reference to base this on?"
4. **Ask:** "Do you want to provide inspiration via /inspire?"
5. **Ask:** "Design guide adherence (1-5)?"
6. **Ask:** "Inspiration adherence (1-5)?"
7. **Study reference implementations** (Read files)
8. **Brainstorm** creative approaches within constraints
9. **Show concept/approach** to user
10. **Get approval** before building

**Validation:** Manual verification - agent must show evidence of steps 1-7

**Why:** Prevents "lazy as fuck" implementations that skip research phase. Design work ≠ dev work.

---

### Discovery Research Scope
**Applies to:** ALL levels (non-negotiable)
**Added:** [date] (violation: narrow documentation focus instead of diverse examples)

**Rule:** When researching design examples, use DIVERSE industries (NOT narrow documentation focus)

**Required diversity:**
- E-commerce (product pages, checkout flows)
- Portfolios (case studies, project showcases)
- Agency sites (work presentations)
- Editorial (magazine layouts, article pages)
- SaaS (feature pages, comparison tables)
- Marketing (landing pages with dense info)
- Fashion/Lifestyle (lookbooks, collections)

**What to avoid:**
- ❌ Only looking at documentation sites
- ❌ Only technical/API references
- ❌ Narrow industry focus

**Validation:** Manual - check variety of site types analyzed

---

## Information Architecture Rules (ALL LEVELS)

### Content Hierarchy
**Applies to:** ALL levels
**Added:** [date]

**Rule:** Most important content = most prominent placement

**Principle:** Protocol pages → Protocol is hero (not buried below cards)

**Anti-pattern:** Inverted hierarchy where supporting info dominates, primary content buried

**Validation:** Manual review - primary content must be immediately visible

---

### Progressive Disclosure
**Applies to:** ALL levels
**Added:** [date]

**Rule:** Show essential information first, details on demand

**Pattern:**
- Hero section: Overview/quick-view of key info
- Smart defaults: Most urgent/common content visible by default
- Expandable sections: Additional details available without dominating

**Example:** Protocol phases - Phase 1 (immediate action) open by default, Phases 2-3 collapsed

---

## Violation Tracking

This section records when rules were violated to show patterns:

### [Date]: Supreme LL 300 Weight
- **File:** app/protocols/injury/page.module.css
- **Violation:** Used font-weight 300 (should be 400)
- **Impact:** User had to manually correct (3rd time)

### [Date]: Protocol Buried Below Cards
- **File:** app/protocols/injury/page.tsx
- **Violation:** Information hierarchy inverted - protocol hidden, compound cards dominate
- **Impact:** Complete redesign required

### [Date]: Discovery Scope Too Narrow
- **File:** Session log - injury protocol v5
- **Violation:** Looked at 12 documentation sites instead of 100+ diverse examples
- **Impact:** 2 hours wasted, 4 correction attempts needed

---

## Auto-Enforcement Checklist

Before presenting work, verify:

**Typography (Levels 5-3):**
- [ ] No Supreme LL 300 weight (must be 400)
- [ ] All colors use var(--color-X) tokens
- [ ] Font sizes from typography scale

**Spacing (Levels 5-3):**
- [ ] All spacing uses var(--space-X) tokens
- [ ] No arbitrary pixel values
- [ ] 4px grid compliance

**Workflow (ALL levels):**
- [ ] Searched for similar pages before building
- [ ] Asked user about references
- [ ] Asked about /inspire usage
- [ ] Got adherence levels (design + inspiration)
- [ ] Studied reference implementations
- [ ] Showed concept before building
- [ ] Got approval on approach

**Information Architecture (ALL levels):**
- [ ] Primary content is hero (immediately visible)
- [ ] Progressive disclosure implemented
- [ ] Content hierarchy not inverted

**Quality (ALL levels):**
- [ ] Build successful (0 errors, 0 warnings)
- [ ] Code review passed
- [ ] Visual review passed (if UI work)

---

## Usage in Workflow

### When Starting Design/UI Work:

1. **Read this file:** `Read DESIGN_RULES.md`
2. **Follow workflow rules** (search, ask, study, show, approve)
3. **Get adherence levels** from user (design 1-5, inspiration 1-5)
4. **Apply appropriate rules** based on adherence level
5. **Run validation checks** before claiming complete
6. **Show evidence** of rule compliance

### When --learn Flag Used:

1. **Extract new rules** from user feedback
2. **Update this file** with new rules and violation tracking
3. **Create validation checks** for automated enforcement
4. **Show user** what rules were extracted and how they'll be enforced

---

**This file prevents repeating the same mistakes. Rules accumulate over time as patterns emerge from feedback.**
```

### Step 0.7: Present Extracted Rules to User

```markdown
📚 RULE EXTRACTION COMPLETE

Extracted [X] rules from your feedback:

**Typography Rules:**
1. Supreme LL: ONLY 400 weight (NEVER 300) → Levels 5-3
   Validation: grep check for font-weight: 300

**Workflow Rules:**
2. BEFORE building UI: Search for similar pages, study references → ALL levels
   Validation: Manual verification of research phase

**Violation Tracking:**
- Supreme LL 300: 3rd occurrence
- Skipped reference study: 2nd occurrence

These rules are now stored in DESIGN_RULES.md and will be automatically
enforced in future work based on adherence level.

Proceeding with feedback processing...
```

### Step 0.8: Continue to Regular Workflow

After rule extraction, proceed to Phase 1 (Parse & Categorize Feedback) as normal.

---

---

## User Feedback

**Feedback received:** $ARGUMENTS

---

## Phase 1: Parse & Categorize Feedback

Read the feedback and extract ALL distinct points. Categorize each by:

### Severity Levels
- 🔴 **CRITICAL** - Breaks functionality, violates requirements, unacceptable
- 🟡 **IMPORTANT** - Needs fixing, degrades experience, violates best practices
- 🟢 **NICE-TO-HAVE** - Improvements, polish, optional enhancements

### Issue Types
- **Functionality** - Feature doesn't work, logic errors, missing features
- **Design** - Visual issues, spacing, typography, layout, colors
- **UX** - Interaction problems, confusing flows, accessibility
- **Performance** - Slow, inefficient, resource issues
- **Code Quality** - Poor structure, missing tests, security concerns

### Step 1.5: If Design/UX Issues Detected → Interactive Workflow ⚠️

**BEFORE presenting parsed feedback**, check if ANY issues are categorized as Design or UX.

**If Design OR UX issues exist:**

#### Step 1.5.1: Read Existing DESIGN_RULES.md

```bash
# Check for existing DESIGN_RULES.md
if [ -f "./DESIGN_RULES.md" ]; then
  Read ./DESIGN_RULES.md
elif [ -f "./docs/DESIGN_RULES.md" ]; then
  Read ./docs/DESIGN_RULES.md
else
  echo "No DESIGN_RULES.md found - will create after first --learn usage"
fi
```

**If DESIGN_RULES.md exists:**
- Extract workflow rules (search, ask, study, approve steps)
- Note adherence scale system (design 1-5, inspiration 1-5)
- Prepare to follow interactive workflow

#### Step 1.5.2: Search for Similar Pages (Required Workflow)

```bash
# Search for similar pages in codebase
# Example: If fixing "calculator page", search for other calculator/form pages
glob "*Calculator*" "app/"
glob "*Form*" "app/"
ls app/protocols/  # If protocol page work
```

**Document findings:**
```
🔍 SIMILAR PAGES FOUND:

1. app/protocols/anti-aging/page.tsx
   - Timeline hero pattern
   - Protocol modal implementation
   - Compact card layout

2. app/calculator/CalculatorView.swift
   - Form interaction patterns
   - Input validation flows

3. [Additional findings...]
```

#### Step 1.5.3: Interactive Questions (Use AskUserQuestion)

**Ask the user FOUR questions before proceeding:**

```javascript
AskUserQuestion({
  questions: [
    {
      question: "I found these similar pages in your codebase. Should I use any as a reference pattern?",
      header: "Reference",
      multiSelect: false,
      options: [
        {label: "Yes, use [page name]", description: "Follow this page's pattern/approach"},
        {label: "No, don't constrain", description: "Start fresh, explore new approaches"},
        {label: "Show me first", description: "Let me see the pages before deciding"}
      ]
    },
    {
      question: "Do you want to provide design inspiration directly via /inspire?",
      header: "Inspiration",
      multiSelect: false,
      options: [
        {label: "Yes, I'll /inspire", description: "Let me add examples to inspiration gallery"},
        {label: "No, proceed", description: "Use existing knowledge and references"}
      ]
    },
    {
      question: "Design guide adherence: How strictly should I follow YOUR design system? (if one exists)",
      header: "Guide (1-5)",
      multiSelect: false,
      options: [
        {label: "5 - Zero deviation", description: "Strict compliance, MVP speed, follow all rules"},
        {label: "4 - Colors only", description: "Can experiment with color palette"},
        {label: "3 - Colors + Typography", description: "Can play with fonts/weights/sizes"},
        {label: "2 - Significant freedom", description: "Colors + typography + spacing + layouts"},
        {label: "1 - Go nuts", description: "Maximum creative freedom, minimal rules"}
      ]
    },
    {
      question: "Inspiration adherence: How closely should I follow EXTERNAL examples? (if provided)",
      header: "Inspiration (1-5)",
      multiSelect: false,
      options: [
        {label: "5 - Copy exactly", description: "Pixel-perfect recreation of example"},
        {label: "4 - Follow closely", description: "Follow layout/structure, adapt details"},
        {label: "3 - Take pattern", description: "Take approach/pattern, make it your own"},
        {label: "2 - Study concept", description: "Study principle, apply differently"},
        {label: "1 - Just for taste", description: "Aesthetic reference only, inform thinking"}
      ]
    }
  ]
})
```

#### Step 1.5.4: Process User Responses

**Store adherence levels:**
```
🎯 DESIGN PARAMETERS CONFIRMED:

Reference: [User's choice]
Inspiration: [Yes/No]
Design Guide Adherence: [1-5]
Inspiration Adherence: [1-5]

These parameters will guide agent work and rule enforcement.
```

**If user chose "Yes, I'll /inspire":**
- Pause and wait for user to run /inspire
- After they provide examples, continue

**If user chose "Show me first":**
- Read and present the reference pages
- Ask follow-up: "Should I use these as references?"

#### Step 1.5.5: Read Design System (If Adherence ≥ 3)

**Only if Design Guide Adherence is 3, 4, or 5:**

1. **Locate project design system guide** (check in order):
   - `/docs/design-guide-v3.md` (or similar version)
   - `/docs/design-system*.md`
   - `/docs/typography-rules.md` + `/docs/color-rules.md` + `/docs/alignment-rules.md`
   - Root directory `design-system-guide.md`

2. **Read ALL design system files** (if they exist):
   ```bash
   Read {project-root}/docs/design-guide-v3.md
   Read {project-root}/docs/typography-rules.md
   Read {project-root}/docs/color-rules.md
   Read {project-root}/docs/alignment-rules.md
   ```

3. **Extract design system rules:**
   - Typography: Authorized fonts, weights, usage rules
   - Colors: Background, text hierarchy, accents, surfaces
   - Spacing: Grid system, spacing scale
   - Components: Card/button/form styles

4. **Create brief design system summary:**
   ```
   PROJECT DESIGN SYSTEM CONFIRMED:

   Typography:
   - Font 1: {name} ({weights}) → {usage}
   - ...

   Colors:
   - Background: {hex} → {description}
   - ...

   Spacing:
   - Base grid: {px}
   - ...

   Critical Rules:
   - {Rule 1}
   - ...
   ```

**If Adherence is 1 or 2:**
- Skip detailed design system read
- Note: "Low adherence level - creative freedom prioritized over design system compliance"

**Why this matters:**
- Design feedback may reference violations of design system
- Agents need to know the SOURCE OF TRUTH for typography/colors/spacing
- Prevents agents from applying /inspire principles that contradict project design system
- Adherence level determines how strictly to enforce rules

**If no design system found:**
- Use /clarify to ask user where design system documentation is located
- OR note that design system doesn't exist (proceed with inspiration/reference guidance only)

#### Step 1.6: Design Understanding Verification Gate ⚠️ CRITICAL

**BEFORE assigning any agents, AFTER reading all design docs:**

This gate prevents:
- Agent skipping design docs entirely
- Agent reading mechanically without understanding
- Building wrong thing because agent didn't get the vision
- Wasting 2 hours on misunderstood work
- Applying web design rules to iOS/mobile platforms

**Step 1.6.1: Detect Platform**

```bash
# Check file types to determine platform
if [ -f "*.xcodeproj" ] || [ -f "*.swift" ]; then
  PLATFORM="iOS"
elif [ -f "*.java" ] || [ -f "*.kt" ]; then
  PLATFORM="Android"
elif [ -f "package.json" ] && grep -q "react-native" package.json; then
  PLATFORM="React Native"
elif [ -f "*.tsx" ] || [ -f "*.jsx" ]; then
  PLATFORM="Web"
else
  PLATFORM="Unknown"
fi
```

**Platform-specific design considerations:**

```markdown
## Platform: iOS
- Uses 8pt grid (not 4px web grid)
- SwiftUI spacing conventions
- 44pt minimum touch targets
- SF Pro or custom fonts with iOS scales
- Platform-native interaction patterns

## Platform: Android
- Material Design 8dp grid
- Material typography scales
- 48dp minimum touch targets
- Roboto or custom fonts
- Material interaction patterns

## Platform: Web
- CSS spacing (px/rem/em)
- Custom grid systems (4px, 8px, etc.)
- Web typography scales
- Browser-native patterns

## Platform: React Native
- Flexbox layout
- dp units (device-independent pixels)
- Cross-platform considerations
- Platform-specific overrides
```

**Step 1.6.2: Required - Agent writes design understanding summary**

```markdown
📐 DESIGN UNDERSTANDING SUMMARY

**Platform:** [iOS / Android / Web / React Native / Other]

**Vision:** [2-3 sentences describing the design vision from inspiration/design docs]

**Key Principles:** [3 most critical design principles that apply to this work]
1. [Principle 1] - [Why it matters for this work]
2. [Principle 2] - [Why it matters for this work]
3. [Principle 3] - [Why it matters for this work]

**Why This Is Different:** [What makes this design work different from generic/lazy implementation]

**Approach:** [How I will implement each issue with design thinking, not just checkbox completion]

**Platform-Specific Considerations:**
- Spacing/Grid: [How spacing works on this platform - e.g., "8pt iOS grid, not web pixels"]
- Typography: [What typography system applies - e.g., "SF Pro with iOS scales"]
- Interactions: [Platform-native patterns - e.g., "SwiftUI native gestures"]
- Constraints: [Platform limitations/requirements]

**Design Guide Applicability:**
- What applies: [Typography principles, colors, alignment - list what transfers]
- What doesn't apply: [Web measurements, CSS tokens - list what's platform-specific]
- Platform conventions to use: [8pt grid, 44pt targets, etc.]

**Inspiration References:**
- Issue #1 → Informed by [inspiration example X]
- Issue #2 → Informed by [inspiration example Y]
- [etc.]

**Violations to Check** (platform-aware):
- ✅ [Applicable checks - e.g., font weights, colors, alignment]
- ❌ [Not applicable - e.g., CSS spacing on iOS]

**Quality Bar:** Must match [inspiration examples] level of polish, not "good enough" MVP
```

**Show this summary to user with AskUserQuestion:**

```javascript
AskUserQuestion({
  questions: [{
    question: "Before I start building, does this match your design vision?\n\n[Insert design understanding summary]\n\nShould I proceed with this understanding?",
    header: "Understanding",
    multiSelect: false,
    options: [
      {label: "Yes, you understand", description: "Proceed with building using this understanding"},
      {label: "No, you're missing...", description: "Revise understanding based on my correction"},
      {label: "Partially correct", description: "Some parts right, some need clarification"}
    ]
  }]
})
```

**If user says "No" or "Partially":**
1. Read user's correction
2. Revise design understanding summary
3. Show revised summary
4. Get approval again
5. Repeat until user approves

**If user says "Yes":**
1. Save design understanding summary
2. Pass this context to ALL agents when dispatching
3. Proceed to Phase 2 (agent assignment)

**Why this gate is critical:**

From OBDN injury protocol failure:
> "The anti-aging page was right there at app/protocols/anti-aging/ and I never looked at it. That's the entire failure in one sentence."

From iOS implementation failure:
> "it spent like 2 hours planning and executing and the only thing it got done was reanimating the logo and moving the search bar to the top"

**Pattern:** Agent doesn't understand design vision → builds wrong thing → wastes hours

**Solution:** Force agent to PROVE understanding before building → user catches misunderstanding in 5 minutes instead of seeing wrong work after 2 hours

**Only proceed past this gate after user approval.**

### Present Parsed Feedback

Format as:

```
📋 FEEDBACK ANALYSIS

🔴 CRITICAL (must fix):
1. [Issue description] - Type: [Functionality/Design/UX/etc.]
2. [Issue description] - Type: [...]

🟡 IMPORTANT (should fix):
1. [Issue description] - Type: [...]
2. [Issue description] - Type: [...]

🟢 NICE-TO-HAVE (optional):
1. [Issue description] - Type: [...]

Total: X critical, Y important, Z nice-to-have
```

---

## Phase 2: Confirm Parsing (Optional)

**Optional Step:** If you want confirmation that parsing was correct, add `--confirm` flag:

```
/agentfeedback --confirm [your feedback]
```

**With --confirm flag, show:**

```
📋 I parsed your feedback as:

🔴 CRITICAL (4):
1. Calculator functionality lost - Type: Functionality
   → Need to rebuild with correct flow

2. Tab structure wrong - Type: Functionality
   → Replace Protocols with GLP-1 tab

3. Library not populated - Type: Functionality
   → Add 28 peptides from website

4. Design system violations - Type: Design
   → Fix typography, colors, spacing

🟡 IMPORTANT (3):
5. Typography messy - Type: Design
   → Clean up heading structure

6. Wrong icon usage - Type: Design
   → Don't use syringe for vial size

7. Library messaging needs work - Type: UX
   → Improve copy and labels

Is this correct before I proceed?

Options:
- ✅ Yes, proceed with this plan
- 🔄 No, let me clarify: [user input]
- 📝 Mostly correct, but: [user input]
```

**Without --confirm flag (default):**
- Proceeds directly to discovery and agent assignment
- Faster workflow
- Use when confident parsing will be accurate

**Recommendation:**
- Use `--confirm` for complex feedback with 7+ points
- Skip `--confirm` for simple feedback (3-5 clear points)

---

## Phase 2.5: Confirm Scope

If there are 5+ issues OR mix of critical and nice-to-have, ask:

```javascript
AskUserQuestion({
  questions: [{
    question: "Should we address all feedback points or focus on critical/important only?",
    header: "Scope",
    multiSelect: false,
    options: [
      {label: "All points", description: "Fix everything including nice-to-haves"},
      {label: "Critical + Important", description: "Skip nice-to-have for now"},
      {label: "Critical only", description: "Just fix blocking issues"}
    ]
  }]
})
```

Otherwise, proceed with all points.

---

## Phase 3: Discovery - Find Existing Solutions

**CRITICAL:** Before assigning agents, discover what already exists to prevent wasted rebuild effort.

### Discovery Process

For each feedback item, check:

**1. Scan for Existing Components**

```bash
# Find similar components/views
find . -name "*[SimilarPattern]*" -type f

# Search for related functionality
grep -r "related_functionality" --include="*.swift" --include="*.tsx"

# Check recent git history
git log --all --oneline --grep="similar feature" | head -20
```

**2. Document Findings**

```
📋 DISCOVERY REPORT

Feedback Item: "Add GLP-1 tab with 3-step wizard"

Discovery:
  ✅ FOUND: GLPJourneyView.swift already exists!
    - Location: Views/GLPJourneyView.swift
    - Has: 3-step wizard implementation
    - Has: Agent selection
    - Has: Frequency options
    - Status: Fully implemented, just not exposed

  Plan Impact:
    BEFORE: Rebuild GLP-1 functionality (estimated 2-3 hours)
    AFTER: Expose existing view in tab bar (estimated 10 minutes)

  Time Saved: ~2.5 hours
  Agent Assignment Change: ios-dev (1 invocation vs 3)
```

**3. Update Agent Assignment Based on Discovery**

```
Original Plan:
  Wave 1: Build GLP-1 wizard → ios-dev
  Wave 2: Implement agent selection → ios-dev
  Wave 3: Add frequency options → ios-dev

Revised Plan (After Discovery):
  Wave 1: Modify ContentView to expose GLPJourneyView → ios-dev
  (Waves 2-3 eliminated - feature already exists!)
```

### Discovery Checklist

For each feedback item, ask:

- [ ] Does a similar component already exist?
- [ ] Is there related functionality we can reuse?
- [ ] Has this been implemented before (git history)?
- [ ] Are there existing patterns we should follow?
- [ ] Can we expose/modify existing vs rebuild?

**If existing solution found:**
- Update agent assignment to "modify existing" not "rebuild"
- Reduce estimated effort significantly
- Document what was found and where

**If no existing solution:**
- Proceed with agent assignment as planned
- Note that this is new functionality

### Present Discovery Findings

```
🔍 DISCOVERY PHASE COMPLETE

Items requiring NEW work:
1. Calculator rebuild (#1) - No existing implementation
2. Typography fixes (#2) - Design work needed

Items with EXISTING solutions:
3. GLP-1 tab (#3) - GLPJourneyView.swift exists, just expose it
4. Library data (#4) - PeptideDatabase.swift has structure, add missing peptides

Time Saved: ~3 hours by reusing existing work
```

---

## Phase 4: Agent Assignment

For each feedback point, determine which agent should fix it:

### Agent Selection by Issue Type

**Functionality Issues:**
- Business logic → Original implementation agent (e.g., iOS specialists like swiftui-developer, android-engineer, cross-platform-mobile, Frontend specialists like react-18-specialist or nextjs-14-specialist, backend-engineer)
- Missing features → Domain-specific agent
- Broken interactions → Frontend specialists (react-18-specialist/nextjs-14-specialist) or iOS specialists (swiftui-developer)

**Design Issues:**
- Visual/spacing/typography → Design specialists (tailwind-specialist, ui-engineer, design-reviewer)
- Layout problems → Design specialists (ux-strategist, ui-engineer, design-reviewer)
- Color/branding → Design specialists (visual-designer, design-system-architect, design-reviewer)
- All design → Run design-with-precision skill first

**IMPORTANT for Design/UX agents:**
- **Pass design understanding summary from Step 1.6** (CRITICAL - includes vision, principles, approach)
- Pass adherence levels from Step 1.5.4
- Provide DESIGN_RULES.md if it exists
- Include reference pages identified in Step 1.5.2
- Specify which rules apply based on adherence level

**Example agent dispatch with design context:**

```javascript
Task({
  subagent_type: "ux-strategist",  // Or tailwind-specialist, ui-engineer, design-reviewer based on issue type
  description: "Fix design issues with design thinking",
  prompt: `Fix these design issues using the approved design understanding.

DESIGN CONTEXT (from understanding gate approval):

Vision: [2-3 sentences from Step 1.6]

Key Principles:
1. [Principle 1] - [Why it matters]
2. [Principle 2] - [Why it matters]
3. [Principle 3] - [Why it matters]

Approach: [How to implement with design thinking from Step 1.6]

Inspiration References: [Which examples inform which decisions from Step 1.6]

Quality Bar: Must match [inspiration examples] level of polish

Adherence Levels:
- Design Guide: [1-5 from Step 1.5.4]
- Inspiration: [1-5 from Step 1.5.4]

DESIGN_RULES.md: [if exists, include key rules]

Reference Pages: [from Step 1.5.2]

---

DESIGN ISSUES TO FIX:
[list of categorized design issues]

---

REQUIREMENTS:

For EACH issue:
- Reference which inspiration example informs this fix
- Apply which design principle from approved understanding
- Explain design thinking, not just mechanical change
- Implement with same polish level as inspiration examples

Verify design quality BEFORE claiming complete:
- Does this match inspiration examples' quality?
- Did I apply design principles thoughtfully?
- Would user say "yes, this is what I wanted"?

Only claim complete when design quality verified.`
})
```

**This ensures agent has:**
- Approved design understanding (what user wants)
- Design principles (how to think about it)
- Inspiration references (quality bar)
- Adherence constraints (how strict to be)
- Quality verification criteria (how to know when done)

**UX Issues:**
- Interaction flows → Design specialists (ux-strategist, ui-engineer)
- Navigation problems → Design specialists (ux-strategist, design-reviewer)
- Accessibility → Design specialists (accessibility-specialist, design-reviewer)
- Confusing patterns → Design specialists (ux-strategist, ui-engineer)

**Performance Issues:**
- Optimization → Original implementation agent
- Resource usage → debugger agent
- Slow queries → Relevant backend agent

**Code Quality:**
- Structure/patterns → quality-validator agent
- Security → security-auditor agent
- Missing tests → Original implementation agent + test-driven-development skill

### Create Agent Assignment Map

```
AGENT ASSIGNMENT:

🔴 Critical Fixes:
1. [Issue] → Design specialists (tailwind-specialist, design-reviewer) - design problem
2. [Issue] → iOS specialists (swiftui-developer) - iOS functionality
3. [Issue] → Design specialists (ux-strategist, ui-engineer) - interaction flow/UX

🟡 Important Fixes:
1. [Issue] → Design specialists (tailwind-specialist, ui-engineer) - spacing
2. [Issue] → quality-validator agent (code quality)

🟢 Nice-to-Have:
1. [Issue] → Frontend specialists (react-18-specialist or nextjs-14-specialist) - polish
```

---

## Phase 4: Orchestration Plan

Create wave-based execution plan:

### Wave 1 - Critical Design/UX Fixes (Parallel if different agents)
```
If multiple design/UX issues → Design specialists handle ALL design and UX points
(Select appropriate specialists: ux-strategist, tailwind-specialist, ui-engineer, design-reviewer)
Run all critical design/UX fixes together
```

### Wave 2 - Critical Functionality Fixes (Sequential after Wave 1)
```
Implementation agent fixes ALL functionality issues
Can reference Wave 1 design/UX fixes if needed
```

### Wave 3 - Important Fixes (After Critical complete)
```
Relevant agents handle important issues
May be parallel if independent
```

### Wave 4 - MANDATORY Quality Gate
```
quality-validator agent reviews ALL changes
Verifies:
- All feedback addressed
- No new issues introduced
- Code quality maintained
- Tests updated if needed
- **DESIGN_RULES.md compliance** (if exists and design work done)
- **Adherence level requirements met** (enforce rules based on level)
```

**For Design/UX work, additional validation:**

If DESIGN_RULES.md exists and Design Guide Adherence ≥ 3:
- Run automated grep checks from DESIGN_RULES.md
- Verify typography compliance (fonts, weights, sizes)
- Verify spacing compliance (var(--space-X) tokens)
- Verify color compliance (var(--color-X) tokens)
- Check workflow compliance (evidence of reference study)

**Adherence-aware validation:**
- Level 5: ALL rules strictly enforced
- Level 4: Typography + spacing strict, colors flexible
- Level 3: Typography flexible, document deviations
- Level 2: Spacing + layouts flexible, document approach
- Level 1: Minimal rules, verify creative decisions intentional

### Present Plan

```
🎯 ORCHESTRATION PLAN

Wave 1 - Critical Design/UX:
  🔄 Design specialists (ux-strategist, tailwind-specialist, design-reviewer) → Fix all design/UX issues #1, #2, #3, #4, #5

Wave 2 - Critical Functionality (Sequential):
  → iOS specialists (swiftui-developer) → Fix issues #6, #7

Wave 3 - Important Fixes (Parallel):
  🔄 Design specialists (ui-engineer, design-reviewer) → Fix issue #8
  🔄 quality-validator → Address quality issue #9

Wave 4 - Quality Gate (MANDATORY):
  → quality-validator → Review ALL changes before re-presenting

Estimated: 3-4 waves, X agents
```

---

## Phase 4.5: Define Acceptance Criteria & Validation

**CRITICAL:** For each wave, define MEASURABLE acceptance criteria to prevent subjective "looks good" failures.

### Read Validation Framework

```
Read ~/.claude/agentfeedback-validation-schema.yml
```

### For Each Wave, Define:

**1. Measurable Acceptance Criteria**

NOT subjective:
- ❌ "Library should be populated"
- ❌ "Design should look good"
- ❌ "Calculator should work"

MEASURABLE:
- ✅ "Library must have exactly 28 peptides"
- ✅ "No unauthorized font weights (Supreme LL must be 400, not 300)"
- ✅ "Calculator must have compound selector (CompoundPickerView component present)"

**2. Automated Validation Commands**

```yaml
wave_1_design_fixes:
  acceptance_criteria:
    - no_supremell_300: true
    - only_system_colors: true
    - spacing_from_grid: true

  validation:
    - command: "grep -E 'font-weight: 300' styles.css"
      expected_count: 0
      failure: "Supreme LL 300 found (unauthorized)"

    - command: "grep -E 'rgba\\(' styles.css"
      expected_count: 0
      failure: "Hardcoded colors found (must use tokens)"

    - command: "npm run build"
      must_pass: true
      failure: "Build failed"
```

**3. On Failure Actions**

```
If validation fails:
  → REQUEST_REWORK from agent
  → Provide EXPLICIT requirements (not "fix the design")
  → Re-run validation after fixes
  → Only mark complete when ALL criteria pass
```

### Present Validation Plan

```
🔬 VALIDATION PLAN

Wave 1 - Design Fixes:
  Criteria:
    - No Supreme LL 300 weight
    - Only design system colors
    - Spacing from mathematical grid
  Validation:
    - Grep check for violations
    - Build verification
  On Fail: Request rework with specific requirements

Wave 2 - Library Population:
  Criteria:
    - Exactly 28 peptides
    - Matches website data structure
  Validation:
    - Count check: grep -c 'Peptide('
    - Build verification
  On Fail: "Need {actual} more peptides to reach 28"

Wave 3 - Quality Gate:
  Criteria:
    - All validations from Wave 1 & 2 pass
    - Code review passed
    - Build successful
  Validation:
    - Re-run all previous validations
    - quality-validator approval
```

---

## Phase 5: Create Todos with Agent Assignments

Use TodoWrite to create trackable tasks:

```javascript
TodoWrite([
  // Wave 1
  {
    content: "Use Design specialists (ux-strategist, tailwind-specialist, design-reviewer) to fix all design/UX issues: [issues #1, #2, #3, #4, #5]",
    status: "pending",
    activeForm: "Fixing design/UX issues with Design specialists"
  },

  // Wave 2
  {
    content: "Use iOS specialists (swiftui-developer) to fix: [issues #6, #7]",
    status: "pending",
    activeForm: "Fixing functionality with iOS specialists"
  },

  // Wave 3
  {
    content: "Use Design specialists (ui-engineer, design-reviewer) to fix: [issue #8]",
    status: "pending",
    activeForm: "Polishing design with Design specialists"
  },

  // Wave 4 - MANDATORY
  {
    content: "Use quality-validator to review ALL changes",
    status: "pending",
    activeForm: "Reviewing changes with quality-validator"
  }
])
```

---

## Phase 6: Execute Orchestration Plan

### For each wave:

1. **Mark todos as in_progress** for that wave
2. **Launch agents** (parallel if marked with 🔄)
3. **Wait for wave completion**
4. **GENERATE CHANGESET MANIFEST** ⚠️ NEW
5. **RUN AUTOMATED VALIDATION** ⚠️ NEW
6. **If validation fails** → Request rework, re-run wave
7. **If validation passes** → Mark todos as completed, save changeset
8. **HANDOFF changeset to next wave** ⚠️ NEW
9. **Move to next wave**

### Validation After Each Wave

**MANDATORY:** Run validation checks before marking complete

```bash
# Example: Wave 2 Library Population

echo "Running Wave 2 validation..."

# Check 1: Peptide count
actual=$(grep -c 'Peptide(' PeptideDatabase.swift)
if [ "$actual" -ne 28 ]; then
  echo "❌ VALIDATION FAILED: Only $actual peptides found, need 28"
  echo "Action: REQUEST_REWORK from ios-dev"
  exit 1
fi

# Check 2: Build verification
if ! xcodebuild -project X -scheme Y build; then
  echo "❌ VALIDATION FAILED: Build broken"
  echo "Action: REQUEST_REWORK from ios-dev"
  exit 1
fi

echo "✅ Wave 2 validation passed"
```

**On Validation Failure:**

```
❌ VALIDATION FAILED FOR WAVE 2

Check: Peptide count
Expected: 28
Actual: 8
Status: FAILED

Action: REQUEST_REWORK

Prompt to ios-dev:
"Validation failed: Only 8 peptides found, need 28.

Please add the remaining 20 peptides from website /lib/peptide-data.ts.

Required peptides total: 28
Current: 8
Missing: 20

Re-run validation after adding."
```

**Example: Design Rule Validation with Adherence Levels (Platform-Aware)**

```bash
# Read DESIGN_RULES.md to get checks
Read DESIGN_RULES.md

# Get user's adherence level from Step 1.5.4
ADHERENCE_LEVEL=5  # From user's choice

# Detect platform from Step 1.6.1
PLATFORM="iOS"  # or Web, Android, etc.

# Run platform-appropriate checks based on adherence level

if [ "$PLATFORM" = "Web" ]; then
  echo "Platform: Web - Running web-specific checks"

  # Check 1: Font weights (applies to levels 5-3, ALL platforms)
  if [ "$ADHERENCE_LEVEL" -ge 3 ]; then
    violations=$(grep -rE 'Supreme.*300|font-weight: 300' app/ --include="*.css" --include="*.module.css" | wc -l)
    if [ "$violations" -gt 0 ]; then
      echo "❌ VALIDATION FAILED: Supreme LL 300 weight found ($violations instances)"
      echo "DESIGN_RULES.md requires: Supreme LL ONLY 400 weight"
      echo "Adherence Level $ADHERENCE_LEVEL: STRICT enforcement"
      exit 1
    fi
  fi

  # Check 2: Spacing tokens (applies to levels 5-3, WEB ONLY)
  if [ "$ADHERENCE_LEVEL" -ge 3 ]; then
    violations=$(grep -rE 'padding: [0-9]+px|margin: [0-9]+px' app/ --include="*.css" | grep -v 'var(--space' | wc -l)
    if [ "$violations" -gt 0 ]; then
      echo "❌ VALIDATION FAILED: Arbitrary spacing values found ($violations instances)"
      echo "DESIGN_RULES.md requires: Use var(--space-X) tokens from 4px grid"
      echo "Adherence Level $ADHERENCE_LEVEL: STRICT enforcement"
      exit 1
    fi
  fi

  # Check 3: Color tokens (applies to levels 5-4, WEB ONLY)
  if [ "$ADHERENCE_LEVEL" -ge 4 ]; then
    violations=$(grep -rE 'rgba\(|#[0-9a-fA-F]{3,6}' app/ --include="*.css" | grep -v 'var(--color' | wc -l)
    if [ "$violations" -gt 0 ]; then
      echo "❌ VALIDATION FAILED: Hardcoded colors found ($violations instances)"
      echo "DESIGN_RULES.md requires: Use var(--color-X) tokens only"
      echo "Adherence Level $ADHERENCE_LEVEL: STRICT enforcement"
      exit 1
    fi
  fi

elif [ "$PLATFORM" = "iOS" ]; then
  echo "Platform: iOS - Running iOS-specific checks"

  # Check 1: Font weights (applies to ALL platforms if design guide specifies)
  # Example: If design guide says "Supreme LL only 400 weight"
  # This would check Swift code, not CSS
  echo "✓ Font weight check (manual): Verify authorized weights in Swift code"

  # Check 2: Typography principles (manual check - iOS uses different system)
  echo "✓ Typography hierarchy check (manual): SF Pro or custom fonts with iOS scales"

  # Check 3: Color usage principles (can check programmatically)
  echo "✓ Color usage check (manual): Verify accent color not overused, contrast maintained"

  # Check 4: Touch targets (iOS-specific)
  echo "✓ Touch target check (manual): Verify 44pt minimum for tappable elements"

  # SKIP web-specific checks (spacing tokens, CSS values)
  echo "⏭️  Skipping web-specific checks (CSS tokens, px values) - not applicable to iOS"

elif [ "$PLATFORM" = "Android" ]; then
  echo "Platform: Android - Running Android-specific checks"

  # Material Design checks
  echo "✓ Material Design compliance (manual): 8dp grid, 48dp touch targets"
  echo "⏭️  Skipping web-specific checks"

fi

# Check 4: Workflow compliance (applies to ALL levels, ALL platforms)
# Manual verification - ask agent to show evidence
echo "✓ Manual check required: Workflow compliance"
echo "  - Evidence of searching for similar pages?"
echo "  - Evidence of studying reference implementations?"
echo "  - Showed concept before building?"
echo "  - Platform-specific conventions understood and applied?"

echo "✅ All platform-appropriate DESIGN_RULES.md checks passed for $PLATFORM (Adherence Level $ADHERENCE_LEVEL)"
```

**Result if passing:**
```
✅ DESIGN_RULES.MD VALIDATION PASSED

Adherence Level: 5 (Zero deviation)
Checks run: 4
Checks passed: 4
Violations found: 0

Typography: ✅ No Supreme LL 300 weight
Spacing: ✅ All values use var(--space-X) tokens
Colors: ✅ All values use var(--color-X) tokens
Workflow: ✅ Evidence of reference study confirmed

Proceeding to final review...
```

**Only Mark Complete When:**
- ✅ All validation checks pass
- ✅ Build successful
- ✅ Acceptance criteria met
- ✅ DESIGN_RULES.md compliance (if applicable)
- ✅ Adherence level requirements met

**Don't mark complete when:**
- ❌ Validation failed
- ❌ Build broken
- ❌ Agent "thinks" it's done but criteria not met
- ❌ Design rule violations found (for adherence levels requiring them)

---

### Changeset Manifest Generation

**After validation passes, generate changeset manifest for next wave:**

```json
// changeset_wave_1.json

{
  "wave": 1,
  "agent": "ios-dev",
  "task": "Rebuild calculator with correct flow",
  "timestamp": "2025-10-21T05:15:00Z",

  "files_modified": [
    "CalculatorView.swift",
    "CalculatorViewModel.swift"
  ],

  "files_created": [
    "CompoundPickerView.swift"
  ],

  "files_deleted": [
    "DevicePickerView.swift",
    "SyringeVisualView.swift"
  ],

  "features_removed": [
    "frequency_picker (lines 145-189 in CalculatorView.swift)",
    "device_selector (lines 230-267)",
    "supply_planning (lines 300-345)"
  ],

  "features_added": [
    "compound_selection_modal (CompoundPickerView.swift)",
    "reconstitution_flow (CalculatorView.swift:89-156)",
    "dose_slider (CalculatorView.swift:200-245)"
  ],

  "state_changes": [
    "Added: @State var showingCompoundPicker: Bool = false",
    "Added: @State var selectedCompound: CommonPeptide? = nil",
    "Removed: @State var deviceType: DeviceType = .vial",
    "Removed: @State var frequency: Frequency = .daily"
  ],

  "components_available_for_reuse": [
    "CompoundPickerView - Use this for compound selection, don't recreate"
  ],

  "git_diff_summary": "See: git diff HEAD~1 CalculatorView.swift",

  "next_wave_context": "Calculator now uses CompoundPickerView for compound selection. Tab structure change can reference this component if needed. Don't recreate CompoundPickerView - it's ready for reuse."
}
```

**Handoff to Next Wave:**

```markdown
Before executing Wave 2, read changeset:

Read changeset_wave_1.json

Key information for Wave 2 agent:
- CompoundPickerView component exists (don't recreate)
- DevicePickerView was deleted (don't reference it)
- Calculator state structure changed
- New compound selection flow available

Use git diff to see exact code changes:
git diff HEAD~1 CalculatorView.swift CompoundPickerView.swift
```

**Benefits:**
- Next wave knows exactly what changed
- Prevents recreation of existing work
- Shows what's available for reuse
- Documents state changes
- Provides git diff reference for details

---

### Critical Rules:

**DO:**
- Launch Wave 1 agents in parallel if independent
- Wait for each wave to complete before validation
- **RUN VALIDATION after each wave** ⚠️ NEW
- Request rework if validation fails (don't continue)
- Pass context between waves (Wave 2 can reference Wave 1 outputs)
- ALWAYS run quality-validator in final wave
- Mark todos in_progress → completed only after validation passes

**DON'T:**
- Skip validation checks (never trust "looks good")
- Continue to next wave if validation failed
- Skip agent orchestration and fix directly
- Run waves out of order
- Skip quality-validator before re-presenting
- Mark todos as completed without validation

---

## Phase 6.5: Response Awareness Verification (MANDATORY After Implementation)

**CRITICAL**: After any wave that involves code changes, verification-agent MUST check all meta-cognitive tags.

### When to Deploy verification-agent

Deploy verification-agent if ANY agent in the wave:
- Created or modified code files
- Made implementation claims
- Referenced file paths or code structures
- Integrated components

**Wave examples requiring verification:**
- iOS specialists (swiftui-developer) fixed calculator view → verification-agent checks tags
- Frontend specialists (react-18-specialist, nextjs-14-specialist) updated design system → verification-agent checks tags
- Any "implementation" or "fix" work → verification-agent checks tags

### Verification Process

**Step 1: Check for implementation log**

```bash
ls .orchestration/implementation-log.md
```

If missing → implementation agents didn't tag assumptions → ask them to create log with tags

**Step 2: Deploy verification-agent**

Use Task tool:
```
Task with verification-agent:
"Verify all meta-cognitive tags in .orchestration/implementation-log.md. Check file existence, code claims, and integration assumptions. Create verification-report.md."
```

**Step 3: Read verification report**

```bash
Read .orchestration/verification-report.md
```

**Step 4: Check verdict**

**If verdict = BLOCKED:**
```markdown
❌ VERIFICATION FAILED

{N} failed verifications detected (see verification-report.md)

Failed assumptions:
- {List each failure}

**Required action:** Request rework from agents, fix failures, re-run verification

DO NOT proceed to next wave until verification passes.
```

**If verdict = PASSED:**
```markdown
✅ VERIFICATION PASSED

All implementation claims verified ✓

Proceeding to next wave / Phase 7 review gate.
```

**If verdict = CONDITIONAL:**
```markdown
⏳ VERIFICATION CONDITIONAL

Static checks passed, but {N} items need runtime testing.

Note for user: Manual tests required before production.

Proceeding to Phase 7 with conditions noted.
```

### Integration with Wave Validation

**Old flow:**
```
Wave completes → Run validation scripts → Next wave
```

**New flow (Response Awareness):**
```
Wave completes → verification-agent checks tags → Read report → If BLOCKED: rework → If PASSED: validation scripts → Next wave
```

**Why both?**
- **verification-agent** checks implementation claims (files exist, methods correct)
- **Validation scripts** check business logic (peptide count, build success)
- **Both required** for complete validation

### Blocking Conditions

**BLOCK and request rework if:**
- verification-report.md shows "BLOCKED" verdict
- Any #COMPLETION_DRIVE tags have FAILED_VERIFICATION
- Files claimed to exist don't exist
- Code structure claims don't match reality

**PROCEED only if:**
- verification-report.md shows "PASSED" or "CONDITIONAL"
- All meta-cognitive tags verified
- Custom validation scripts also pass

See: `docs/RESPONSE_AWARENESS_TAGS.md` for complete tag system.

---

## Phase 7: AGGRESSIVE REVIEW GATE (Mandatory Before Presenting)

**⚠️ CRITICAL: This gate prevents "understood but ignored" failures**

**Problem this solves:**
- Agent understands requirements ✅
- Agent promises to fix issues ✅
- Agent delivers something completely different ❌
- Agent presents as if they did what was asked ❌

**Example failure:**
```
Understanding: "Add floating BAC water card above inputs"
Delivered: Inline form (unchanged)
Claimed: "✅ Floating card implemented"
```

### Step 7.1: Capture BEFORE State

**Before any agent work started, capture:**

```bash
# For UI work - take BEFORE screenshots
BEFORE_SCREENSHOT="/tmp/before-$(date +%s).png"

# iOS: Use Simulator
xcrun simctl io booted screenshot "$BEFORE_SCREENSHOT"

# Web: Use Chrome headless
chrome --headless --screenshot="$BEFORE_SCREENSHOT" "http://localhost:8080/page"

# Save BEFORE code state
git stash push -m "BEFORE state for review"
BEFORE_COMMIT=$(git rev-parse HEAD)
```

**Store BEFORE state reference:**
- Screenshot path
- Git commit hash
- Current functionality inventory

### Step 7.2: Capture AFTER State

**After all agent work completed, capture:**

```bash
# Take AFTER screenshots
AFTER_SCREENSHOT="/tmp/after-$(date +%s).png"

# iOS: Use Simulator
xcrun simctl io booted screenshot "$AFTER_SCREENSHOT"

# Web: Use Chrome headless
chrome --headless --screenshot="$AFTER_SCREENSHOT" "http://localhost:8080/page"

# Get AFTER code state
AFTER_COMMIT=$(git rev-parse HEAD)
git diff $BEFORE_COMMIT $AFTER_COMMIT > /tmp/code-changes.diff
```

### Step 7.3: Line-by-Line Promise Verification

**For EACH promise/todo from Phase 1.6 Design Understanding Summary:**

```markdown
📋 VERIFICATION CHECKLIST

From Understanding Summary:
- [ ] Promise #1: Fix word overflow in compound cards
- [ ] Promise #2: Remove Profile from tab, add to corner
- [ ] Promise #3: Add floating BAC water card above inputs
- [ ] Promise #4: Apply minimal, clean design principles
- [ ] Promise #5: Fix input number alignment
- [ ] Promise #6: Remove visual noise (labels like "FEATURED")
- [ ] Promise #7: Preserve existing functionality
- [ ] Promise #8: Match inspiration quality level
```

**For each promise, verify with evidence:**

```markdown
### Promise #1: Fix word overflow in compound cards

**Expected:**
- "Retatrutide" and "Tirzepaptide" fit on single line
- No awkward mid-word breaks

**BEFORE Screenshot Analysis:**
Read $BEFORE_SCREENSHOT
- Shows "Retatrutide" wrapping awkwardly across two lines ❌

**AFTER Screenshot Analysis:**
Read $AFTER_SCREENSHOT
- Check if "Retatrutide" now fits on one line

**Verification Result:**
- [ ] ✅ FIXED - Single line, no wrapping
- [ ] ❌ NOT FIXED - Still wrapping (BLOCK PRESENTATION)
- [ ] ❌ WORSE - Different problem introduced (BLOCK PRESENTATION)

**Evidence:** [Screenshot comparison + code diff showing font size or card width change]
```

**Repeat for ALL promises.**

### Step 7.4: Diff Analysis

**Compare BEFORE vs AFTER:**

```markdown
🔍 DIFF ANALYSIS

Visual Changes (from screenshots):
- Profile removed from tab bar ✅
- Calculator still inline (NOT floating) ❌
- Word overflow still present ❌
- "FEATURED" label still present ❌
- Input alignment unchanged ❌
- Empty page still 60% white space ❌

Code Changes (from git diff):
- Removed Profile tab: +5 / -8 lines
- No other significant changes

Functionality Changes:
- Profile navigation removed
- No other changes

Completion Rate: 1/8 promises = 12.5%
```

### Step 7.5: BLOCKING DECISION

```markdown
📊 REVIEW GATE DECISION

Promises Made: 8
Promises Kept: 1
Completion Rate: 12.5%

REQUIRED: 100% completion

❌ GATE STATUS: BLOCKED

AGENT CANNOT PRESENT TO USER

Required Actions:
1. Fix remaining 7 promises
2. Re-run this review gate
3. Achieve 100% completion
4. Only then proceed to Phase 8
```

### Step 7.6: Basic Violation Checks (Platform-Aware)

**Even if promises are kept, check for basic violations:**

```markdown
🔍 BASIC VIOLATIONS (Non-negotiable on ALL platforms)

**Typography/Readability:**
- [ ] Any awkward word breaks? → Check screenshot
- [ ] Any text too small to read? → Check screenshot
- [ ] Font weights creating scan difficulty? → Check screenshot

**Alignment:**
- [ ] Any misaligned items that should line up? → Check screenshot
- [ ] Numbers not aligned on left edge? → Check screenshot
- [ ] Items not following visual grid? → Check screenshot

**Visual Hierarchy:**
- [ ] Most important info most prominent? → Check screenshot
- [ ] Decorative content more prominent than actual content? → Check screenshot
- [ ] Inverted hierarchy (icon > title > content)? → Check screenshot

**Information Architecture:**
- [ ] Any page 50%+ empty for no reason? → Check screenshot
- [ ] Content hidden that should be visible? → Check screenshot
- [ ] Hero content buried? → Check screenshot

**Platform-Specific (iOS):**
- [ ] Using iOS conventions (8pt grid, SwiftUI patterns)? → Check code
- [ ] Touch targets < 44pt? → Check code + screenshot
- [ ] Inappropriate fonts for platform? → Check code

**Platform-Specific (Web):**
- [ ] Using design system tokens (var(--space-X))? → Check code
- [ ] Hardcoded colors/spacing? → grep check
- [ ] Breaking grid system? → Check code

**Functionality Preservation:**
- [ ] Did functionality change without being asked? → Check diff
- [ ] Features removed that shouldn't be? → Test manually
- [ ] New bugs introduced? → Test manually
```

**If ANY basic violation found → BLOCK PRESENTATION**

### Step 7.7: Evidence Requirements

**Agent MUST provide:**

```markdown
📸 EVIDENCE PACKAGE

**Side-by-Side Screenshots:**
[BEFORE] | [AFTER]
- Compound picker
- Calculator view
- Any other changed screens

**Code Diff Summary:**
- Files changed: X
- Lines added: +Y
- Lines removed: -Z
- Key changes:
  - [Change 1 with file:line reference]
  - [Change 2 with file:line reference]

**Promise Fulfillment:**
✅ Promise #1: [Evidence]
✅ Promise #2: [Evidence]
...
✅ Promise #8: [Evidence]

**Basic Violations Check:**
✅ No word overflow
✅ Proper alignment
✅ Correct hierarchy
✅ No empty pages
✅ Platform conventions followed
✅ Functionality preserved

**Quality Bar:**
✅ Matches inspiration quality level (not "good enough" MVP)
```

### Step 7.8: Re-Work Loop

**If review gate blocked:**

```markdown
❌ REVIEW FAILED - Re-work required

Failed Promises:
- Promise #3: Floating card not implemented
- Promise #4: Visual noise still present
- Promise #5: Alignment not fixed

Basic Violations:
- Word overflow in compound cards
- 60% empty page in calculator

Required Actions:
1. Fix ALL failed promises
2. Fix ALL basic violations
3. Re-run FULL review gate (Steps 7.2-7.7)
4. Provide complete evidence package
5. Repeat until 100% completion

DO NOT present to user until review gate passes.
```

### Step 7.9: Gate Pass Criteria

**Review gate PASSES only when:**

✅ 100% of promises from understanding summary fulfilled
✅ Evidence provided for each promise (screenshots + code)
✅ Zero basic violations (alignment, hierarchy, readability)
✅ Platform conventions respected
✅ Functionality preserved (unless explicitly requested to change)
✅ Quality matches inspiration level
✅ BEFORE/AFTER diff shows meaningful change

**Only after gate PASSES → Proceed to Phase 8**

---

### Why This Gate Is Mandatory

**Previous failures:**

```
iOS Implementation #1:
- Understood: Output hierarchy, floating card, minimal design
- Promised: 10 design improvements
- Delivered: Logo reanimation, search bar moved
- Completion: 2/10 = 20%

iOS Implementation #2:
- Understood: Same requirements
- Promised: 8 improvements
- Delivered: Profile removed from tab
- Completion: 1/8 = 12.5%
```

**Pattern:** Agent understands → promises → ignores → presents garbage

**Solution:** Aggressive review gate with BEFORE/AFTER diff verification blocks presentation until 100% completion

**This gate prevents:**
- ❌ "Nothing actually changed" (identical before/after)
- ❌ "Different thing than promised" (changed X when promised Y)
- ❌ "Partial completion" (did 1/8 items, claimed done)
- ❌ "Understood but ignored" (agent knows what to do, doesn't do it)

**User feedback that triggered this:**
> "After all the instruction, the iOS agent literally just made the exact same piece of garbage as before but removed the profile option in the menu bar."

> "It needs to be more aggressive than that at the review stage. A review would be: look at previous state, then look at new state alongside plan/to-dos and check them off one by one."

---

## Phase 8: Present Fixed Work

After Wave 4 (quality-validator approval) AND Visual Review (if UI work):

```
✅ ALL FEEDBACK ADDRESSED

Fixed:
🔴 [X critical issues]
🟡 [Y important issues]
🟢 [Z nice-to-have issues]

Changes made:
- [Summary of design fixes]
- [Summary of functionality fixes]
- [Summary of UX improvements]

Quality gates:
✅ quality-validator approved
✅ Visual review passed (if UI work)

[Present updated work for review]
```

---

## Example Flow

**User feedback:**
```
/feedback The sticky nav blocks content, timeline is unreadable,
and clicking cards has confusing behavior. Also spacing feels off.
```

**Parsed:**
```
🔴 CRITICAL:
1. Sticky nav blocks content - Type: UX
2. Timeline unreadable - Type: Design
3. Card click behavior confusing - Type: UX

🟡 IMPORTANT:
1. Spacing feels off - Type: Design
```

**Agent Assignment:**
```
Wave 1:
  🔄 Design specialists (ux-strategist, tailwind-specialist, design-reviewer) → Fix all UX/design issues (#1, #2, #3)

Wave 2:
  → Design specialists (tailwind-specialist, ui-engineer) → Adjust spacing (#4)

Wave 3 (MANDATORY):
  → quality-validator → Review all changes
```

**Execution:**
- Launch Design specialists for all UX/design issues
- Wait for completion
- Launch Design specialists for spacing adjustments
- Launch quality-validator
- Present fixed work

---

## Summary

**The /feedback workflow ensures:**
1. ✅ All feedback points captured and categorized
2. ✅ Correct agents assigned to each issue type
3. ✅ Parallel execution where possible for speed
4. ✅ Quality gate (quality-validator) before re-presenting
5. ✅ Nothing gets missed or skipped

**This prevents the "direct coding" failure pattern:**
- ❌ Jump straight to fixing
- ❌ Miss some feedback points
- ❌ No agent orchestration
- ❌ No quality review
- ❌ Present garbage again

**Use /feedback after:**
- Agent-built work is reviewed
- You have comments/changes
- Multiple issues need addressing
- Want systematic fixes with quality gates
