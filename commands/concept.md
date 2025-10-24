---
description: Creative exploration phase for design/UX work - study references, extract patterns, brainstorm approach, get approval BEFORE building
allowed-tools: [Read, Glob, Bash, Skill, AskUserQuestion, exit_plan_mode]
argument-hint: <design/UX request to conceptualize>
---

# /concept - Creative Concept Phase (Design/UX Only)

**PURPOSE**: Bridge the gap between vague design request and elegant execution through systematic reference study and creative exploration.

**Use this for:**
- Page redesigns
- New UI features
- UX flows
- Information architecture
- Visual design work

**DO NOT use for:**
- Pure development work (use /enhance directly)
- Bug fixes
- Performance optimization
- Backend work

---

## User Request

**Design request:** $ARGUMENTS

---

## ⚠️ CRITICAL DESIGN PHILOSOPHY

**Reference examples are NOT templates to copy.**

Your job:
1. **Study reference** → Extract WHY it works (principles)
2. **Understand elegance** → What creates sophistication, clarity, flow
3. **Design something MORE thoughtful** → Improve on the reference
4. **Creative UX thinking required** → Not layout copying

**Anti-pattern:**
- ❌ "Anti-aging page has timeline → copy that layout"
- ❌ Treating references as templates
- ❌ Generic, uninspired copying

**Correct pattern:**
- ✅ "Anti-aging timeline works because it makes protocol the hero"
- ✅ "Can I design something EVEN BETTER that makes protocol more accessible?"
- ✅ Creative, thoughtful improvement

**User feedback from real session:**
> "The anti-aging page is NOT a bible for UI. It's just better than what you had made. What you SHOULD be building is something that's a much more thoughtful and improved UI/UX."

Lesson: Use references to understand what works better, then design something MORE elegant.

---

## Phase 0: Confirm Project Design System ⚠️ MANDATORY

**BEFORE any reference discovery or design work**, you MUST establish the project's design system as your foundation.

### Step 0.1: Locate Design System Guide

Check these locations in order:
1. `/docs/design-guide-v3.md` (or similar version)
2. `/docs/design-system*.md`
3. `/docs/typography-rules.md` + `/docs/color-rules.md` + `/docs/alignment-rules.md`
4. Root directory `design-system-guide.md`
5. `/design-system/` directory

**If not found**: Use /clarify to ask user where the design system guide is located.

### Step 0.2: Read ALL Design System Files

**REQUIRED READING** (if they exist):
```bash
Read {project-root}/docs/design-guide-v3.md
Read {project-root}/docs/typography-rules.md
Read {project-root}/docs/color-rules.md
Read {project-root}/docs/alignment-rules.md
```

### Step 0.3: Extract & Confirm Design System Rules

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

### Step 0.4: Present Design System Summary

**Before proceeding to Phase 1**, create and present this summary:

```
✅ PROJECT DESIGN SYSTEM CONFIRMED

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

Components:
- Cards: {style specs}
- Buttons: {style specs}
- ...

Critical Rules:
- {Rule 1}
- {Rule 2}
- ...

This design system is the SOURCE OF TRUTH for all design decisions.
References and /inspire principles will be applied WITHIN these constraints.
```

**This summary establishes the guardrails for all creative exploration.**

---

## Phase 1: Reference Strategy (Choose Approach)

**CRITICAL: Ask user which reference approach to use**

### Step 1.0: Ask About References

**Before searching anywhere, ask user:**

```javascript
AskUserQuestion({
  questions: [{
    question: "Do you have specific design references for this project, or should I find them?",
    header: "References",
    multiSelect: false,
    options: [
      {
        label: "I have specific refs",
        description: "I have screenshots, folder of examples, or URLs I want to use as inspiration"
      },
      {
        label: "Search our codebase",
        description: "Look for similar work in this project (existing pages, components, patterns)"
      },
      {
        label: "Browse design collections",
        description: "Find industry examples from curated design galleries (CSS Awards, etc.)"
      }
    ]
  }]
})
```

### Step 1.1: Route to Appropriate Tool

**Based on user selection:**

**If "I have specific refs" → Trigger `/design`:**

```
✅ ROUTING TO /DESIGN

You have specific design references. I'll use the /design command for conversational brainstorming with your refs.

/design will:
1. Confirm design system and flexibility scale (already done in Phase 0)
2. Ask where your refs are (folder/paste/URLs)
3. Analyze your refs with vision
4. Ask clarifying questions about which elements to use
5. Generate actionable design brief

Triggering /design now...

[Execute: SlashCommand("/design $ARGUMENTS")]

[After /design completes, skip to Phase 5: After Approval]
```

**If "Search our codebase" → Continue to Phase 2 (current flow):**

```
✅ SEARCHING CODEBASE FOR REFERENCES

I'll look for similar work in this project to use as reference patterns.

Proceeding to codebase reference discovery...

[Continue to current Phase 1.0-1.3 below, now renumbered as Phase 2]
```

**If "Browse design collections" → Trigger `/discover`:**

```
✅ ROUTING TO /DISCOVER

You don't have specific refs, so I'll browse curated design collections to find relevant examples.

/discover will:
1. Map your request to relevant collections (CSS Awards, SiteInspire, etc.)
2. Browse collections strategically
3. Find 3-5 relevant examples
4. Analyze with vision (if possible)
5. Extract common patterns
6. Create application plan

Triggering /discover now...

[Execute: SlashCommand("/discover $ARGUMENTS")]

[After /discover completes, proceed to Phase 3: Brainstorm with discovered examples]
```

---

## Phase 2: Codebase Reference Discovery

**ONLY IF user selected "Search our codebase" in Phase 1**

**CRITICAL: Do this FIRST before any planning**

### Step 2.0: Read Design Pattern Library

**ALWAYS read this first:**
```
Read .claude/DESIGN_PATTERNS.md
```

This contains curated examples of elegant designs with:
- What makes them work (PRINCIPLES, not layouts)
- Visual hierarchy patterns
- Spacing/typography rules
- Anti-patterns to avoid

Check if there's a relevant pattern for this request.

### Step 2.1: Search Codebase for Similar Work

```bash
# If request mentions specific page/feature, find it
ls -la app/*/  # All app routes
ls -la app/protocols/  # If protocol-related
ls -la components/  # Component patterns
ls -la app/(marketing)/  # Marketing pages
```

### Step 2.2: Identify Reference Files

Based on the request, identify similar existing work:

**Request patterns → Reference locations:**
- "protocol page" → Check app/protocols/ for existing protocols
- "landing page" → Check app/ for homepage patterns
- "component redesign" → Check components/ for similar components
- "form" → Search for existing form patterns
- "navigation" → Find existing nav implementations

### Step 2.3: Present Discovered References

```
🔍 REFERENCE DISCOVERY

Found similar work in codebase:
1. app/protocols/anti-aging/page.tsx - Existing protocol page
2. app/protocols/[slug]/page.tsx - Protocol template
3. components/ProtocolCard.tsx - Related component

Should I study these as references? (If no, please provide reference URLs/files)
```

**Wait for user confirmation before proceeding.**

---

## Phase 3: Study References & Extract Patterns

**For codebase references OR /discover results**

**Note:** If `/design` was used in Phase 1, skip this phase (design brief already generated)

For each confirmed reference file:

### Step 3.1: Deep Read & Analysis

```javascript
// Read the reference file completely
Read(file_path)

// Analyze for patterns:
- Layout structure (what comes first, what's prominent)
- Information hierarchy (what's hero, what's secondary)
- Interaction patterns (how do users engage)
- Visual rhythm (spacing, typography, color usage)
- Component composition (how it's built)
```

### Step 3.2: Extract "What Makes It Work"

Ask yourself:
- **Why is this effective?** What makes users successful?
- **What's the pattern?** Timeline first? Modal for details? Cards grid?
- **What's the hierarchy?** What leaps off the page vs. what's subtle?
- **How does it flow?** User journey from landing to action
- **What makes it elegant?** Simple? Compact? Scannable?

### Step 3.3: Document Pattern Analysis

```
📚 PATTERN ANALYSIS: [Reference Name]

PURPOSE:
[What this reference accomplishes for users]

KEY PATTERNS:
1. [Pattern name]: [How it works]
   Why it works: [User benefit]

2. [Pattern name]: [How it works]
   Why it works: [User benefit]

LAYOUT STRUCTURE:
- Hero: [What's prominent]
- Secondary: [Supporting information]
- Tertiary: [Nice-to-have details]

INTERACTION PATTERNS:
- [How users engage with content]
- [Progressive disclosure approach]

VISUAL HIERARCHY:
- Typography: [Header scales, body text]
- Spacing: [Rhythm and breathing room]
- Color: [Emphasis strategy]

WHAT MAKES IT ELEGANT:
[The secret sauce - why users love it]
```

Repeat for all reference files.

---

## Phase 4: Brainstorm Creative Approach

**Note:** If `/design` was used in Phase 1, skip this phase (design brief already generated)

**Now use the brainstorming skill to explore approaches:**

```javascript
Skill("superpowers:brainstorming")

Prompt for brainstorming:
"Based on the reference patterns I've studied:
- [Reference 1] uses [pattern] for [purpose]
- [Reference 2] uses [pattern] for [purpose]

For this new request: $ARGUMENTS

How should we adapt these patterns?
- What should be the hero?
- What's the user's primary goal?
- How do we make it elegant and simple?
- What makes this different from the references?"
```

**During brainstorming, explore:**
- Multiple creative approaches
- Adaptation of reference patterns
- User journey and flow
- What makes this unique vs. reference

**Outcome:** Refined creative direction with clear vision

---

## Phase 5: Present Concept Brief

**Note:** If `/design` was used in Phase 1, the design brief from `/design` becomes the concept brief

Create a comprehensive concept brief showing:

### 5.1: References Studied
```
📖 REFERENCES STUDIED:

1. app/protocols/anti-aging/page.tsx
   - Pattern: Timeline-first with modal protocol
   - Why it works: Protocol accessible, not buried
   - Key takeaway: Make protocol the hero

2. [Other references]
```

### 5.2: Proposed Approach
```
🎨 PROPOSED APPROACH:

CONCEPT:
[One paragraph describing the vision]
Example: "Protocol reference page where the 3-phase protocol is
immediately visible via interactive timeline, with compound details
in compact problem→solution cards that expand on demand."

USER JOURNEY:
1. Land → See timeline visually
2. Click phase → Protocol details expand
3. Scan compounds → Problem→peptide cards
4. Deep dive → Click to expand mechanism details

VISUAL HIERARCHY:
- HERO: 3-phase timeline (Domaine Sans Display, large)
- Secondary: Compound problem→solution cards (compact grid)
- Tertiary: Safety warnings (visible but not dominant)
- Background: Detailed mechanisms (on-demand)

INTERACTION PATTERNS:
- Timeline phases: Click to expand protocol details
- Compound cards: Hover for preview, click for full mechanism
- Safety: Persistent subtle callout, expands for full details

LAYOUT STRUCTURE:
[ASCII mockup or description]

┌─────────────────────────────────────┐
│  3-PHASE INJURY RECOVERY TIMELINE   │ ← Hero
│  [Phase 1] [Phase 2] [Phase 3]      │
│  Click phase → Protocol expands      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  COMPOUND REFERENCE                  │ ← Secondary
│  [Problem → BPC-157 fixes it]        │
│  [Problem → TB-500 fixes it]         │
│  Click for mechanisms →              │
└─────────────────────────────────────┘

DESIGN SYSTEM COMPLIANCE:
- Typography: Domaine Sans Display headers, GT Pantheon body, Supreme LL labels
- Spacing: 8px base unit, mathematical scale
- Colors: Gold accent (#D4AF37) for emphasis
- All design-with-precision rules followed
```

### 5.3: Adaptations from Reference
```
🔄 ADAPTATIONS FROM ANTI-AGING PAGE:

What we're keeping:
- Timeline pattern (proven effective)
- Protocol modal/expansion (keeps it accessible)
- Compact cards (not overwhelming)

What we're changing:
- 3 phases instead of timeline progression
- Problem→solution cards instead of benefit cards
- Interactive phase expansion instead of modal

Why these changes:
- Injury recovery is phase-based, not time-based
- Users need to match problem to solution quickly
- Phase details need to be inline, not in modal
```

### 5.4: Seek Approval

```
✅ CONCEPT BRIEF COMPLETE

This concept is based on:
- Studying [X] reference files
- Brainstorming creative adaptations
- User journey mapping
- Design system compliance

Approve this concept before I proceed to /enhance and build?

[Present using exit_plan_mode for Yes/No selection]
```

---

## Phase 6: After Approval

Once approved, output:

```
✅ CONCEPT APPROVED

Next steps:
1. Run /enhance with this concept as foundation
2. Agents will build following this creative direction
3. design-with-precision skill will enforce elegance
4. quality-validator will verify pattern compliance

Ready to proceed to /enhance?
```

---

## Critical Rules

### DO:
- ✅ Search codebase for references FIRST (ls app/protocols/)
- ✅ Read ALL reference files completely
- ✅ Extract patterns and explain why they work
- ✅ Use brainstorming skill for creative exploration
- ✅ Present concept brief with mockup/description
- ✅ Get approval BEFORE building

### DON'T:
- ❌ Skip reference discovery
- ❌ Assume you know the pattern without studying references
- ❌ Jump straight to /enhance without concept
- ❌ Build generically without creative direction
- ❌ Ignore what makes references elegant

### For /enhance Integration:

When /concept is approved, the enhanced prompt should include:

```
CREATIVE DIRECTION (from /concept):
- References studied: [list]
- Pattern to follow: [description]
- Visual hierarchy: [hero, secondary, tertiary]
- Interaction patterns: [specific behaviors]
- User journey: [flow]

AGENTS MUST:
- Read concept brief
- Follow established patterns
- Apply creative direction
- Verify against reference elegance
```

---

## When to Use /concept

**ALWAYS use for:**
- Page redesigns
- New page layouts
- Complex UI features
- Information architecture changes
- "Make it elegant" requests

**NEVER use for:**
- Bug fixes (use /enhance directly)
- Performance work (not creative)
- Backend logic (not design)
- Simple CSS tweaks (too small)

**The test:**
If the request needs creative thinking about "how it should feel" or "what makes it elegant" → Use /concept

---

## Example Flow

**User:** "Redesign the injury protocol page"

**Phase 1:** Search codebase
```bash
ls app/protocols/
# Found: anti-aging/, [slug]/
```

**Phase 2:** Study anti-aging page
```
Pattern: Timeline-first, protocol in modal, compact cards
Why it works: Protocol accessible, not buried
```

**Phase 3:** Brainstorm
```
Use brainstorming to explore:
- How to adapt timeline for 3 phases
- Problem→solution card pattern
- Where protocol should live
```

**Phase 4:** Present concept
```
CONCEPT: 3-phase timeline hero, protocol expands inline,
compound cards show problem→peptide solution

[ASCII mockup]

Approve? → Yes
```

**Phase 5:** Proceed to /enhance with concept
```
Enhanced prompt includes creative direction
Agents build following the concept
Result: Elegant, not generic
```

---

## Integration with Design Commands

**/concept now orchestrates three reference approaches:**

1. **/inspire** → Personal design aesthetic (global gallery)
   - Use when: Understanding your aesthetic preferences
   - Trigger: Optionally during `/design` pre-flight
   - Output: Taste principles to inform design brief

2. **/design** → Project direction (user-provided refs)
   - Use when: You have specific screenshots/examples/URLs
   - Trigger: Phase 1 → "I have specific refs"
   - Output: Actionable design brief with conversational brainstorming

3. **/discover** → Fallback (browse collections)
   - Use when: No specific refs, need industry examples
   - Trigger: Phase 1 → "Browse design collections"
   - Output: Curated examples from CSS Awards, SiteInspire, etc.

**The decision tree:**

```
/concept starts
    ↓
Phase 0: Load design system (MANDATORY)
    ↓
Phase 1: "Do you have specific refs?"
    ├─ "Yes, I have refs" → /design (conversational, 5-10 min)
    ├─ "Search codebase" → Phase 2-6 (current flow, 10-15 min)
    └─ "Browse collections" → /discover (curated search, 20-30 min)
    ↓
Phase 2-6: (varies based on Phase 1 choice)
    ↓
Output: Concept brief → Approve → /enhance
```

---

## Summary

**/concept solves:**
1. ❌ "I didn't study references" → ✅ Three reference strategies (design/codebase/discover)
2. ❌ "I didn't understand the pattern" → ✅ Pattern extraction & analysis
3. ❌ "I built generically" → ✅ Creative brainstorming & direction
4. ❌ "No approval before building" → ✅ Concept brief with user approval

**/concept ensures:**
- Design system loaded FIRST (Phase 0)
- User chooses reference strategy (Phase 1)
- References are studied thoroughly (Phase 2-4)
- Patterns are understood, not assumed (Phase 3)
- Creative direction is established (Phase 4)
- User approves vision before building (Phase 5)
- Agents get clear creative direction (Phase 6)

**The complete workflow:**
```
Design Request → /concept → Choose refs → Concept brief → Approve → /enhance → Build → /visual-review → Ship
```

**Three paths through /concept:**

**Path A: User has specific refs**
```
Phase 0: Design system → Phase 1: User selects "I have refs" → /design → Design brief → Phase 6: Approve
```

**Path B: Search codebase**
```
Phase 0: Design system → Phase 1: "Search codebase" → Phase 2: Find refs → Phase 3: Extract → Phase 4: Brainstorm → Phase 5: Brief → Phase 6: Approve
```

**Path C: Browse collections**
```
Phase 0: Design system → Phase 1: "Browse collections" → /discover → Examples → Phase 3: Extract → Phase 4: Brainstorm → Phase 5: Brief → Phase 6: Approve
```

**After building, ALWAYS run /visual-review:**

This ensures the implemented design:
- Matches the approved concept
- Follows AESTHETIC_PRINCIPLES.md
- Has proper spacing, typography, colors
- Demonstrates sophistication through restraint
- Compares favorably to inspiration gallery examples

**Visual review workflow:**
1. Build implementation from concept brief
2. Run /visual-review [page-url]
3. Fix any violations found
4. Re-run visual review until ✅ APPROVED
5. THEN present to user

No more jumping straight to /enhance for design work.
No more generic layouts.
No more missing the point.
No more shipping without visual QA.

---

## Response Awareness for Conceptual Work

During design exploration, tag uncertainties:

- Use `#PATTERN_CONFLICT:` when multiple design approaches compete
- Use `#COMPLETION_DRIVE:` for assumed design patterns without user confirmation
- Use `#CONTEXT_DEGRADED:` when earlier design context becomes unclear

When concept work leads to implementation, verification-agent verifies all tagged assumptions.

See: `docs/RESPONSE_AWARENESS_TAGS.md` for complete tag taxonomy.
