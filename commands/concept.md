description: Context-aware UI concepting. Default = NEW concept (research → brainstorm → mockup → build). Use -edit for ITERATION on an existing layout.
allowed-tools: [Read, Glob, Bash, Skill, AskUserQuestion, exit_plan_mode, WebFetch]
argument-hint: [-edit] <page/component or goal>
---

# /concept — Context-Aware Concepting (new or edit)

By default, treats the request as a NEW concept (study references → brainstorm → mockup → build). Use `-edit` to iterate on an existing layout with surgical changes.

**Use this when:**
- Redesigning an existing page
- Improving current layout
- Exploring new ideas for something that already exists
- "Make this better/more elegant"

Tip: For low‑fi, try `/ascii-mockup` during brainstorming.

Modes:
- NEW (default): Fresh concept; study references, brainstorm, mock, build
- EDIT (-edit flag): Improve an existing implementation with precise changes

---

## Your Role

You are a design critic and creative partner. Your job:
1. Look at the current implementation
2. Give honest assessment (what works, what doesn't)
3. Suggest creative improvements
4. Iterate conversationally with user
5. Generate mockup when satisfied
6. Build it

---

## Mode Selection & User Request

If $ARGUMENTS starts with "-edit":
- Remove "-edit" from $ARGUMENTS and enter EDIT MODE
Else: NEW MODE

**Target:** $ARGUMENTS

---

## EDIT MODE — Phase 1: Assess Current Implementation

### Step 1.1: Find the Current File

Based on the request, locate the file:

```bash
# If it's a page
ls -la app/         # Next.js pages
ls -la app/**/*     # Nested routes

# If it's a component
ls -la components/
ls -la src/components/

# If mentioned by name
find . -name "*[keyword]*" -type f
```

### Step 1.2: Read Current Implementation

```bash
Read [filepath]
```

Read the ENTIRE current implementation. Understand:
- What it currently does
- How it's structured
- What components it uses
- Current layout approach

### Step 1.3: Take Screenshot (If Possible)

If there's a running dev server or the page is accessible:

```bash
# Check if server is running
lsof -i :3000  # or :8080, :4200, etc.

# If running, use visual-review to capture current state
bash scripts/capture-screenshot.sh http://localhost:3000/[route] --out before.png --wait-for 20
/visual-review http://localhost:3000/[route]
```

If screenshot available → Store in `.orchestration/evidence/screenshots/current-[name].png`

---

## EDIT MODE — Phase 2: AI Assessment & Ideas

**Present your analysis:**

```
🔍 CURRENT IMPLEMENTATION ASSESSMENT

FILE: [filepath]

WHAT IT DOES:
[Brief description of current purpose and functionality]

CURRENT LAYOUT:
[Describe the structure - hero, sections, components used]

WHAT WORKS:
✓ [Thing 1 that's good]
✓ [Thing 2 that's good]
✓ [Thing 3 that's good]

WHAT COULD BE BETTER:
⚠️ [Issue 1] - [Why this is a problem]
⚠️ [Issue 2] - [Why this is a problem]
⚠️ [Issue 3] - [Why this is a problem]

CREATIVE IDEAS FOR IMPROVEMENT:
💡 Idea 1: [Specific suggestion]
   - How: [How to implement]
   - Why: [What this improves for users]

💡 Idea 2: [Specific suggestion]
   - How: [How to implement]
   - Why: [What this improves for users]

💡 Idea 3: [Specific suggestion]
   - How: [How to implement]
   - Why: [What this improves for users]

[If screenshot exists, reference it]
Current state captured: .orchestration/evidence/screenshots/current-[name].png

---

What direction do you want to explore?
- Share any inspiration/examples you have
- React to these ideas
- Suggest your own approach
```

---

## EDIT MODE — Phase 3: Conversational Iteration

**Listen to user response and iterate:**

**If user shares inspiration/examples:**
```
📸 ANALYZING YOUR INSPIRATION

[If URL] → Use WebFetch to analyze
[If local file] → Read file
[If description] → Understand the pattern

What I see in your inspiration:
- Pattern: [Key layout pattern]
- Why it works: [User benefit]
- How we could adapt: [Specific application]

Should we go in this direction?
```

**If user reacts to your ideas:**
```
Great, let's explore [idea] further.

Here's how that could work:
[More detailed breakdown]

Thinking through the user journey:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Visual hierarchy:
- Hero: [What's prominent]
- Secondary: [Supporting elements]
- Tertiary: [Details]

Does this feel right? Any adjustments?
```

**If user suggests their own approach:**
```
I like that direction. Building on your idea:

[Expand on their suggestion with specific implementation details]

Potential challenges:
- [Challenge 1] → [How to solve]
- [Challenge 2] → [How to solve]

This could look like:
[Describe the vision]

Want me to mock this up?
```

**Keep iterating** until user is satisfied with the direction.

---

## EDIT MODE — Phase 4: Generate Mockup

**When user says they're happy with the direction:**

```
✅ DIRECTION CONFIRMED

Let me create a mockup of this concept.

CONCEPT SUMMARY:
[1-2 paragraph description of the approved direction]

LAYOUT STRUCTURE:
[ASCII diagram showing the layout]

┌─────────────────────────────────────────┐
│  [HERO SECTION]                         │
│  [Description of hero]                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  [SECONDARY SECTION]                    │
│  [Description]                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  [TERTIARY SECTION]                     │
│  [Description]                          │
└─────────────────────────────────────────┘

USER JOURNEY:
1. [Step 1]
2. [Step 2]
3. [Step 3]

INTERACTION PATTERNS:
- [Pattern 1]: [Behavior]
- [Pattern 2]: [Behavior]

VISUAL HIERARCHY:
- Typography: [Specific fonts and sizes]
- Spacing: [Grid and rhythm]
- Colors: [Emphasis strategy]

DESIGN SYSTEM COMPLIANCE:
[How this follows the project's design system]

IMPROVEMENTS FROM CURRENT:
✓ [Improvement 1]
✓ [Improvement 2]
✓ [Improvement 3]

---

Approve this mockup to proceed to implementation?
```

Use `exit_plan_mode` to present for approval.

---

## Phase 5: Build

**Once approved:**

```
✅ MOCKUP APPROVED

Proceeding to build this redesign.

Next steps:
1. Update [filepath] with new layout
2. Create/modify components as needed
3. Apply design system styles
4. Test interactions
5. Take screenshot of result
6. Compare before/after

Building now...
```

Then implement the redesign directly (don't call /enhance, you're already in a command).

---

## Critical Rules

**DO:**
- ✅ Read current implementation completely
- ✅ Give honest assessment (good AND bad)
- ✅ Suggest specific, creative improvements
- ✅ Iterate conversationally (not one-shot)
- ✅ Listen to user's vision and inspiration
- ✅ Generate mockup before building
- ✅ Get approval on mockup

**DON'T:**
- ❌ Jump straight to solutions without assessing current state
- ❌ Be vague ("make it better" - specify HOW)
- ❌ Ignore user's inspiration/examples
- ❌ Build without mockup approval
- ❌ Overcomplicate with routing to other commands

---

## Example Flow

**User:** `/concept injury protocol page`

**Phase 1: Assess**
```bash
Read app/protocols/injury/page.tsx

🔍 CURRENT IMPLEMENTATION
- Has injury intro, phases section, supplements grid
- Layout is vertical stack, no timeline
- Supplements are just cards in grid
```

**Phase 2: AI Ideas**
```
WHAT WORKS:
✓ Clear phases section
✓ Supplements are organized

WHAT COULD BE BETTER:
⚠️ No visual timeline - hard to see 3-phase structure at a glance
⚠️ Supplements lack problem→solution framing
⚠️ Protocol details buried in text

IDEAS:
💡 Interactive 3-phase timeline as hero
💡ompounds as problem→solution cards
💡 Protocol expands inline per phase

What do you think?
```

**Phase 3: User Responds**
```
User: "Love the timeline idea. Here's an example [shares screenshot]"

AI: Analyzes screenshot
"I see - compact timeline with phase badges.
Let me adapt that with our gold accent colors..."
```

**Phase 4: Iterate**
```
User: "What if we make clicking a phase scroll to its section?"

AI: "Great idea - smooth scroll anchor links.
Timeline stays fixed at top? Or scrolls away?"

User: "Fixed at top"

AI: "Perfect - sticky timeline. Ready for mockup?"
```

**Phase 5: Mockup**
```
[ASCII mockup with sticky timeline, scrollable sections, etc.]

User: Approves ✅
```

**Phase 6: Build**
```
Updates app/protocols/injury/page.tsx
Creates TimelineNav component
Implements smooth scroll
Takes screenshot
Shows before/after
```

---

## When to Use

**/concept (this command):**
- Redesigning existing page: ✅
- Improving current layout: ✅
- "Make [existing thing] better": ✅

**/concept-new:**
- Brand new page/layout: ✅
- Starting from scratch: ✅
- No current implementation: ✅

**The test:** If it exists already → Use `/concept`. If it's new → Use `/concept-new`.

---

## Integration with Design System

**Before generating mockup, verify design system compliance:**

1. Check project design system (if exists)
2. Ensure mockup uses authorized fonts, colors, spacing
3. Call out design system compliance in mockup

**If no design system exists:**
- Design freely but maintain consistency with existing pages
- Document the patterns you're establishing

---

## Summary

**/concept** is conversational design iteration:

1. ✅ Look at current implementation
2. ✅ Give assessment and creative ideas
3. ✅ User reacts, shares inspiration
4. ✅ Iterate until satisfied
5. ✅ Generate mockup
6. ✅ Get approval
7. ✅ Build it

**Simple. Conversational. No complex routing. Just design iteration.**
[In NEW MODE, consider `/ascii-mockup` first to sketch structure before building.]
