---
description: Browse design collections when you DON'T have specific refs - fallback tool triggered by /concept to find industry examples
allowed-tools: [Read, WebFetch, Glob, Bash, mcp__*]
argument-hint: [project description] (e.g., "medical protocol page", "dashboard layout")
---

# /discover - Browse Design Collections (Fallback)

**PURPOSE**: Browse curated design collections to find industry examples when you DON'T have specific design references.

**⚠️ WHEN TO USE THIS:**
- Triggered automatically by `/concept` when user selects "Browse design collections"
- You need industry examples but have NO specific refs
- You want to see how others solved similar problems

**⚠️ WHEN NOT TO USE THIS:**
- You have specific design refs → Use `/design` instead
- You have codebase examples → Use `/concept` with "Search codebase"
- You just want to explore personal taste → Use `/inspire` instead

**This is a FALLBACK tool** - slower and broader than `/design`, use only when needed.

**EXPECTED OUTCOME:**
1. Browse design collections with chrome-devtools MCP (visual browsing)
2. Take viewport screenshots of relevant examples
3. Save screenshots to `~/.claude/design-inspiration/[category]/` (global gallery)
4. Analyze screenshots with vision to extract aesthetic principles
5. Create discovery report with actionable design principles

**CRITICAL:** Must use visual browsing (screenshots + vision analysis), not just WebFetch text parsing.

---

## Project Context

**What are we building?**
$ARGUMENTS

If no arguments provided, ask user:
- What are you building?
- What's the aesthetic goal? (sophisticated, minimal, data-rich, etc.)
- What industry/category? (health, enterprise, consumer, etc.)

---

## ⚠️ CRITICAL: Relationship to Project Design Systems

**IMPORTANT HIERARCHY:**

```
Project Design System (RULES)
    ↓
    Takes precedence over
    ↓
/discover Examples (INSPIRATION)
```

### What /discover Provides

**Visual inspiration and aesthetic direction:**
- How elegant sites in your industry look
- What patterns work for your use case
- How to create sophistication and delight
- What emotional tone successful examples achieve

**These examples show WHAT WORKS in your category.**

### What /discover Does NOT Provide

**/discover examples do NOT replace:**
- ❌ Your project's font families
- ❌ Your project's color palette
- ❌ Your project's spacing system
- ❌ Your project's component styles
- ❌ Any hard rules in your project's design system guide

### How to Use Examples Correctly

**Correct Workflow:**
1. **FIRST**: Understand your project design system (fonts, colors, spacing)
2. **SECOND**: Run /discover to find examples in your category
3. **THIRD**: Extract PRINCIPLES from examples (not specific implementations)
4. **FOURTH**: Apply those principles WITHIN your project's design system

**Example - Learning from Stripe:**
- ✅ CORRECT: "Stripe uses generous whitespace and clear hierarchy" (principle)
  - Implement generous whitespace with YOUR spacing system (var(--space-16))
  - Implement hierarchy with YOUR typography system (Domaine Sans Display, etc.)
- ❌ WRONG: "Stripe uses Inter font at 16px on white background"
  - Don't copy Inter if your system uses Domaine Sans Display
  - Don't copy white background if your system uses #0c051c dark

**Example - Learning from Linear:**
- ✅ CORRECT: "Linear makes roadmap the hero with timeline visualization" (principle)
  - Create timeline visualization with YOUR components and colors
- ❌ WRONG: "Linear uses these exact hex colors and font sizes"
  - Don't copy their color palette if you have your own

**Example - Learning from Apple:**
- ✅ CORRECT: "Apple uses restraint, showing one key message at a time" (principle)
  - Apply progressive disclosure with YOUR design system
- ❌ WRONG: "Apple uses San Francisco font"
  - Don't introduce San Francisco if your system has different fonts

### When Examples Conflict with Your Design System

**If an example uses something that contradicts your design system:**

1. **Extract the PRINCIPLE, not the implementation**
   - Example uses light background? → Principle: "clear, uncluttered canvas"
   - Your system has dark background → Apply same principle with dark palette

2. **Adapt the pattern to your constraints**
   - Example uses specific font? → Why does it work? (hierarchy, readability)
   - Apply same hierarchy with YOUR authorized fonts

3. **Use /clarify if truly stuck**
   - Example demonstrates something valuable
   - But implementation requires design system change
   - Ask user if design system should be updated

### Examples of Correct Discovery

**Medical Protocol Page Discovery:**
```
/discover medical protocol with timeline and data

→ Finds: Stripe Docs (technical content), Notion (information density)
→ Extracts: "Progressive disclosure, scannable cards, timeline as hero"
→ Applies: Create timeline with YOUR gold accent (#C9A961), YOUR fonts
→ Result: Beautiful protocol page using YOUR design system
```

**Landing Page Discovery:**
```
/discover sophisticated health/wellness landing

→ Finds: Vaayu (minimal elegance), MOHEIM (dark sophistication)
→ Extracts: "Restraint, one focal point, generous spacing"
→ Applies: Hero section with YOUR dark background, YOUR typography
→ Result: Sophisticated landing using YOUR design system
```

### Summary

**What /discover teaches:** WHAT works aesthetically in your industry/category

**What it does NOT replace:** The specific design system rules for your project

**Always:** Extract principles from examples, implement with your design system

**Never:** Copy fonts, colors, spacing values just because an example uses them

---

## Phase 1: Understand Project & Map to Collections

### Extract Project Characteristics

From the project description, identify:

1. **Industry/Category**
   - Health/Medical → AREA 17 "Health and life sciences"
   - AI/Tech → SEESAW "AI" category
   - Finance → SEESAW "Fintech"
   - E-commerce → SiteInspire "E-commerce"
   - Design/Portfolio → SiteInspire "Portfolio"

2. **Layout Pattern Needed**
   - Grid layout → Bento Grids collection
   - Timeline/Protocol → Look for data visualization examples
   - Dashboard → Look for information-dense layouts
   - Landing page → CSS Design Awards winners

3. **Aesthetic Goals**
   - Sophisticated → Black & white Awwwards collection
   - Minimal → SiteInspire "Minimal" style filter
   - Data-rich → Look for complex information displays
   - Typography-focused → Font-heavy examples

### Show Browsing Strategy

```
🔍 DISCOVERY STRATEGY

Project: [project description]

Characteristics identified:
- Industry: [e.g., Health/Medical]
- Pattern needed: [e.g., Timeline/data presentation]
- Aesthetic goal: [e.g., Sophisticated, scannable]

Collections to browse:
1. AREA 17 → Health and life sciences
2. CSS Design Awards → Data visualization winners
3. Bento Grids → IF grid layout appropriate
4. SiteInspire → Medical + Minimal filters

Starting discovery...
```

---

## Phase 2: Browse Collections

### For Each Relevant Collection

**Read collection documentation:**
```
Read ~/.claude/design-inspiration/COLLECTIONS.md
```

**Extract browsing instructions for each collection:**

#### AREA 17
- URL: https://area17.com/
- Filter by industry vertical matching project
- Look for case studies in relevant sector

#### SEESAW
- URL: https://www.seesaw.website/
- Filter by category (AI, Fintech, Design, etc.)
- Browse recently added entries
- Featured examples: Cursor, Linear, Ramp, etc.

#### CSS Design Awards
- URL: https://cssdesignawards.com/
- Browse Winners archive
- Look for high UI/UX scores in relevant industry
- Check "Website of the Day" for recent excellence

#### SiteInspire
- URL: https://www.siteinspire.com/
- Combine filters: Style + Type + Subject
- Example: "Minimal + Portfolio + Technology"
- Large archive for pattern recognition

#### Bento Grids
- URL: https://bentogrids.com/
- Filter by theme (dark/light)
- Separate UI vs. graphic examples
- Real implementations: Vercel, Linear, Framer

---

## Phase 3: Active Browsing & Selection

**For each collection, WebFetch to explore:**

```
WebFetch collection URLs with prompt:
"Find examples relevant to [project description]. Look for:
- [Industry-specific characteristics]
- [Layout pattern needed]
- [Aesthetic goals]

List 3-5 most relevant examples with:
- Name/title
- URL
- Why it's relevant to this project
- What specific techniques to study"
```

**Example for medical protocol page:**

```
WebFetch https://area17.com/ with:
"Find examples in Health and life sciences category relevant to medical protocol reference pages.
Look for:
- Medical/pharmaceutical data presentation
- Timeline or protocol visualization
- Information-dense but scannable layouts
- Sophisticated, professional aesthetic

List 3-5 relevant examples with URLs and relevance explanation."
```

---

## Phase 3: Visual Browsing with Browser MCP (REQUIRED)

**CRITICAL:** /discover MUST use visual browsing, not just WebFetch text analysis.

### Browser Automation Workflow:

**For each site in COLLECTIONS.md:**

1. **Navigate** to the URL
2. **Wait** for page load (2-3 seconds)
3. **Take viewport screenshot** (NOT fullPage - causes timeouts)
4. **Save screenshot** to `~/.claude/design-inspiration/[category]/`
5. **Analyze with vision** to extract aesthetic principles

### Screenshot Best Practices:

```javascript
// Use viewport screenshots (faster, no timeout)
chrome-devtools - take_screenshot (fullPage: false)

// If timeout occurs, reduce viewport size
chrome-devtools - set_viewport (width: 1280, height: 800)

// Save to global inspiration gallery
Save screenshot to: ~/.claude/design-inspiration/[category]/[sitename].png
```

### Example: Browsing Aspirational Excellence

```
1. Navigate to https://www.vaayu.tech/
2. Wait 3s for load
3. Take viewport screenshot
4. Save to ~/.claude/design-inspiration/landing/vaayu.png
5. Analyze screenshot with vision:
   - What creates emotional resonance?
   - How does spacing create sophistication?
   - What typography creates premium feel?
   - How is restraint used as design principle?

6. Repeat for MOHEIM, DeepJudge, Fey, Endex
```

### Category Mapping:

- **Aspirational Excellence** → `landing/`
- **Protocol/Data pages** → `protocols/`
- **UI Components** → `components/`
- **Interactions** → `interactions/`
- **Typography examples** → `typography/`

**For CSS Design Awards:**
```
1. Navigate to https://cssdesignawards.com/
2. Browse Winners or Nominees section
3. Screenshot individual winning sites
4. Look for data visualization / information architecture
```

**For SiteInspire:**
```
1. Navigate to https://www.siteinspire.com/
2. Use filters: Style + Type + Subject
3. Screenshot filtered results
4. Capture examples that match project needs
```

**For Bento Grids:**
```
1. Navigate to https://bentogrids.com/
2. Filter by dark/light theme
3. Filter by UI vs graphic
4. Screenshot relevant grid examples
```

**Benefits of Browser Automation:**
- Can browse JavaScript-heavy sites
- Take screenshots for vision analysis
- Interact with filters and navigation
- Capture actual rendered designs

### If No Browser MCP Available:

Fall back to WebFetch for text-based analysis of collection pages.

---

## Phase 4: Analyze Screenshots with Vision

**After capturing screenshots, ANALYZE them:**

For each screenshot saved to the inspiration gallery:

```
Read ~/.claude/design-inspiration/[category]/[sitename].png with vision
```

**Vision Analysis Questions:**

1. **FIRST IMPRESSION:**
   - What immediately catches the eye?
   - How does it feel? (sophisticated, warm, technical, elegant)

2. **LAYOUT & HIERARCHY:**
   - How is information organized?
   - What's the visual flow?
   - How does spacing create clarity?
   - What creates breathing room vs. cramping?

3. **TYPOGRAPHY:**
   - What fonts/scale create personality?
   - How does type hierarchy work?
   - What creates emphasis?

4. **COLOR & MATERIAL:**
   - Color palette and usage
   - Background treatments
   - Depth/layering techniques (gradients, shadows, blur)
   - How is restraint used?

5. **AESTHETIC SOPHISTICATION:**
   - What makes this feel premium/sophisticated?
   - How is restraint used as design principle?
   - What creates emotional resonance?
   - What invisible craft creates polish?

6. **TECHNIQUES TO EXTRACT:**
   - Specific spacing patterns (e.g., "80px between sections")
   - Typography scales
   - Color accent usage
   - Material depth techniques
   - Progressive disclosure patterns

7. **APPLICABLE TO YOUR PROJECT:**
   - How to adapt this approach
   - What to avoid
   - Core principle to apply

---

## Phase 5: Curate & Document Findings

**Create discovery report:**

```
📋 DISCOVERY REPORT

Project: [description]
Collections browsed: [list]
Examples found: [count]

RELEVANT EXAMPLES:

1. [Example Name] - [Source]
   URL: [link]

   Why relevant:
   - [Relevance to project]

   What to study:
   - [Specific technique 1]
   - [Specific technique 2]
   - [Layout approach]

2. [Example Name] - [Source]
   URL: [link]

   Why relevant:
   - [Relevance to project]

   What to study:
   - [Specific technique]

[Continue for all examples...]
```

---

## Phase 5: Vision Analysis (If Screenshots Available)

**If user has screenshots or you can access examples:**

For each example, analyze with vision:

```
🔬 VISION ANALYSIS: [Example Name]

FIRST IMPRESSION:
- What immediately catches the eye?
- How does it feel? (sophisticated, warm, technical, etc.)

LAYOUT & HIERARCHY:
- How is information organized?
- What's the visual flow?
- How does spacing create clarity?

TYPOGRAPHY:
- What fonts/scale create personality?
- How does type hierarchy work?
- Readable or display-focused?

COLOR & MATERIAL:
- Color palette and usage
- Background treatments
- Depth/layering techniques

TECHNIQUES TO EXTRACT:
- [Specific technique 1]
- [Specific technique 2]
- [Layout principle]

APPLICABLE TO YOUR PROJECT:
- How to adapt this approach
- What to avoid
- Core principle to apply
```

---

## Phase 6: Extract Common Patterns

**After analyzing all examples, synthesize:**

```
🎨 EXTRACTED PRINCIPLES

Analyzed [X] relevant examples from [collections]

COMMON PATTERNS:
- [Pattern 1 across multiple examples]
- [Pattern 2 seen repeatedly]
- [Layout approach that works]

AESTHETIC QUALITIES:
- [What creates sophistication in these examples]
- [How they balance complexity with clarity]
- [Material/depth techniques used]

SPECIFIC TECHNIQUES FOR YOUR PROJECT:
1. [Technique 1]: [How to apply]
2. [Technique 2]: [How to apply]
3. [Layout approach]: [How to adapt]

WHAT TO AVOID:
- [Anti-pattern from mediocre examples]
- [What doesn't work for this context]
```

---

## Phase 7: Apply to Current Project

**Present application plan:**

```
📐 APPLICATION PLAN

For your [project description]:

LAYOUT APPROACH:
Based on [Example X] and [Example Y]:
- [Layout structure to use]
- [Spacing system to apply]
- [Grid/organization pattern]

TYPOGRAPHY SYSTEM:
Inspired by [Example Z]:
- [Font pairing approach]
- [Type scale to use]
- [Hierarchy pattern]

COLOR & MATERIAL:
From [Example A]:
- [Color usage strategy]
- [Background treatment]
- [Depth/layering approach]

SPECIFIC IMPLEMENTATIONS:
1. [Feature X]: Use [technique] from [Example Y]
2. [Feature Y]: Adapt [approach] from [Example Z]
3. [Layout]: Apply [pattern] from [Example A]

Should I proceed with implementation using these principles?
```

---

## Example: Medical Protocol Page

```
User: /discover medical protocol reference page

Phase 1: Understanding
  Project: Medical protocol reference page
  Industry: Health/Medical
  Pattern: Timeline/protocol visualization
  Aesthetic: Sophisticated, professional, scannable

Phase 2: Collections to Browse
  → AREA 17: Health and life sciences
  → CSS Design Awards: Data visualization
  → Bento Grids: IF appropriate for feature cards
  → SiteInspire: Medical + Minimal

Phase 3: Active Browsing
  WebFetch AREA 17 health category
  → Found: Pharmaceutical dashboard example
  → Found: Medical research data visualization

  WebFetch CSS Design Awards medical
  → Found: Hospital website with protocol display
  → Found: Health tech platform with timelines

Phase 4: Discovery Report
  📋 Found 5 relevant examples:
  1. Pharmaceutical Data Dashboard (AREA 17)
  2. Medical Timeline Viz (CSS Design Awards)
  3. [etc...]

Phase 5: Vision Analysis (if screenshots)
  🔬 Analyzing pharmaceutical dashboard:
  - Timeline as hero element
  - Compact cards for compound info
  - Progressive disclosure pattern
  - Spacing: 32px between phases (not 24px)
  - Cards: 20px padding minimum

Phase 6: Extract Patterns
  🎨 COMMON ACROSS EXAMPLES:
  - Timeline/protocol is primary focus
  - Supporting info in compact cards
  - Progressive disclosure (don't show everything)
  - Generous spacing for medical content
  - Sophisticated color restraint

Phase 7: Application Plan
  📐 FOR YOUR INJURY PROTOCOL PAGE:

  Layout: Timeline-first (like anti-aging page)
  - Horizontal timeline as hero
  - Phase cards below, compact
  - Progressive disclosure for compound details

  Spacing: 32px between timeline phases
  Cards: 20px padding minimum

  Should I implement with these principles?
```

---

## Integration with Inspiration Gallery

**After discovery, optionally save examples:**

```
Would you like to save these examples to your inspiration gallery?

If yes:
1. Download/screenshot examples
2. Save to ~/.claude/design-inspiration/protocols/
3. Name descriptively (e.g., "area17-pharma-timeline.png")
4. These become permanent references for /inspire
```

---

## Critical Rules

### DO:
- ✅ Browse multiple collections for comprehensive view
- ✅ Use vision analysis if screenshots available
- ✅ Extract PRINCIPLES not just aesthetics
- ✅ Explain HOW to adapt, not just WHAT to copy
- ✅ Show browsing strategy before diving in
- ✅ Synthesize patterns across examples

### DON'T:
- ❌ Just list URLs without relevance explanation
- ❌ Copy designs without understanding WHY they work
- ❌ Skip vision analysis if examples are accessible
- ❌ Browse randomly - be strategic based on project
- ❌ Forget to connect findings back to user's project

---

## When to Use /discover

**✅ USE WHEN:**
- Triggered by `/concept` when user selects "Browse design collections"
- User has NO specific design refs but needs industry examples
- Need to see current trends in specific industry (health, fintech, AI, etc.)
- Want examples for specific pattern (timeline, dashboard, protocol, etc.)
- Looking for inspiration for specific aesthetic goal

**❌ DON'T USE WHEN:**
- User HAS specific design refs → Use `/design` instead (faster, conversational)
- Codebase has similar work → Use `/concept` with "Search codebase"
- User wants to explore personal taste → Use `/inspire` instead
- You already have clear reference patterns → No need to browse
- Just need to execute existing design → Skip discovery entirely

**DECISION TREE:**

```
Need design direction?
    ├─ Have specific refs? → /design (5-10 min, conversational)
    ├─ Have codebase examples? → /concept "Search codebase" (10-15 min)
    ├─ Have NO refs? → /discover (20-30 min, broad search) ← YOU ARE HERE
    └─ Just exploring taste? → /inspire (15-20 min, monthly)
```

**RELATIONSHIP TO OTHER COMMANDS:**

- **/inspire**: Global taste, personal aesthetic (monthly, gallery-based)
- **/design**: Project direction with YOUR refs (per-project, conversational)
- **/discover**: Fallback when you have NO refs (rare, broad search)
- **/concept**: Orchestrates all three (decides which tool to use)

---

## Summary

**/discover is the FALLBACK for when you have NO refs:**

**The Process:**
1. Understand project (industry, pattern, aesthetic)
2. Map to relevant collections (CSS Awards, SiteInspire, etc.)
3. Browse strategically (WebFetch collections)
4. Find 3-5 relevant examples
5. Analyze with vision (if possible)
6. Extract common patterns
7. Create application plan
8. Optionally save to inspiration gallery

**Comparison to other commands:**

| Command | Purpose | When to Use | Speed | Frequency |
|---------|---------|-------------|-------|-----------|
| `/inspire` | Build personal taste | Understand aesthetic preferences | 15-20 min | Monthly |
| `/design` | Project direction | You HAVE specific refs | 5-10 min | Per project |
| `/discover` | Find examples | You have NO refs | 20-30 min | Rare (fallback) |
| `/concept` | Orchestrate all three | Starting design work | Varies | Per design task |

**When to use /discover:**
- Only when triggered by `/concept` OR
- You explicitly have NO refs and need industry examples

**Result:** Curated industry examples with extracted principles for THIS project (slower than `/design` but broader).
