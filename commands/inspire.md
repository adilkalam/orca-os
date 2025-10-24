---
description: Analyze beautiful design examples to develop aesthetic taste before creating
allowed-tools: [Read, Glob, Bash]
argument-hint: [category] (protocols, landing, components, interactions)
---

# /inspire - Learn from Beautiful Design

**PURPOSE**: Study beautiful design examples to understand what makes design elegant, then create from that aesthetic foundation.

**This is about TASTE, not rules.**

**EXPECTED OUTCOME:**
1. Load screenshots from global inspiration gallery (`~/.claude/design-inspiration/`)
2. Analyze each screenshot with vision to understand aesthetic sophistication
3. Extract principles of beauty, elegance, and sophistication
4. Apply that aesthetic understanding to current work

**CRITICAL:** Must use vision analysis on screenshots, not just describe them textually.

**Difference from /discover:**
- **/discover** = Hunt for NEW examples in collections, save to gallery
- **/inspire** = Analyze EXISTING examples in your gallery

---

## ⚠️ CRITICAL: Relationship to Project Design Systems

**IMPORTANT HIERARCHY:**

```
Project Design System (RULES)
    ↓
    Takes precedence over
    ↓
/inspire Principles (TASTE)
```

### What /inspire Provides

**Aesthetic taste and sophistication principles:**
- How to create elegance and delight
- How to use space, rhythm, and flow
- What makes design feel refined
- How to create emotional resonance

**These are UNIVERSAL aesthetic principles applicable across projects.**

### What /inspire Does NOT Provide

**/inspire does NOT override:**
- ❌ Project-specific font families
- ❌ Project-specific color palettes
- ❌ Project-specific spacing systems
- ❌ Project-specific component styles
- ❌ Any hard rules in the project's design system guide

### How to Use Both Together

**Correct Workflow:**
1. **FIRST**: Read project design system guide (`/docs/design-guide-v3.md`, etc.)
2. **SECOND**: Run /inspire to learn aesthetic principles
3. **THIRD**: Apply /inspire principles WITHIN the constraints of the project design system

**Example - Typography:**
- ✅ CORRECT: "Use generous whitespace between headings" (/inspire principle)
  - Implement with Domaine Sans Display at 48px (project design system)
- ❌ WRONG: "Use Inter font for clean modern look" (/inspire example)
  - Violates OBDN design system which uses Domaine Sans Display

**Example - Colors:**
- ✅ CORRECT: "Use accent color sparingly for emphasis" (/inspire principle)
  - Implement with #C9A961 gold (project design system)
- ❌ WRONG: "Use white background for clean look" (/inspire example)
  - Violates OBDN design system which uses #0c051c dark background

**Example - Spacing:**
- ✅ CORRECT: "Create breathing room between sections" (/inspire principle)
  - Implement with var(--space-16) = 64px (project design system)
- ❌ WRONG: "Use 80px between sections" (/inspire specific value)
  - Must use project's spacing scale, not arbitrary values

### When to Use /clarify

**If you encounter a contradiction:**
1. Aesthetic principle from /inspire suggests something
2. Project design system has a different rule
3. **Use /clarify to ask the user how to resolve**

**Example /clarify scenario:**
```
/inspire analysis suggests: "Single accent color used sparingly"
Project design system shows: Two accent colors (gold + blue)

Use /clarify:
"The /inspire analysis recommends a single accent color, but the
project design system defines both gold (#C9A961) and blue.
Should I:
A) Use only gold as primary accent
B) Use both colors as defined in design system
C) Propose updating design system to single accent"
```

### Summary

**What /inspire teaches:** HOW to create beautiful, elegant, sophisticated design

**What it does NOT replace:** The specific typography, colors, spacing, and components defined in your project's design system

**Always:** Design system rules win. /inspire provides taste within those constraints.

---

## Source Options

**Arguments:** $ARGUMENTS

**Three clear sources:**

```bash
/inspire --taste              # Your global taste folder (default)
/inspire --folder [path]      # Custom folder path
/inspire --tag [tags]         # Search by tags in library
```

**Auto mode (no user feedback):**

```bash
/inspire --taste --auto              # Quick taste analysis
/inspire --folder [path] --auto      # Quick folder analysis
/inspire --tag [tags] --auto         # Quick tag search
```

### Parse Arguments

```javascript
const args = $ARGUMENTS.trim();

// Check for --auto flag
autoMode = args.includes('--auto');
if (autoMode) {
  // Remove --auto from args for further parsing
  args = args.replace(/--auto/g, '').trim();
}

if (args.startsWith('--taste') || args === '') {
  // Default: Global taste folder
  source = 'taste';
  path = '~/.claude/design-inspiration/';

} else if (args.startsWith('--folder')) {
  // Custom folder
  source = 'folder';
  // Extract path: "--folder ~/Desktop/design-refs/" → "~/Desktop/design-refs/"
  const pathMatch = args.match(/--folder\s+(.+)/);
  path = pathMatch ? pathMatch[1].trim() : null;

  if (!path) {
    echo "❌ --folder requires a path";
    echo "Usage: /inspire --folder ~/Desktop/design-refs/ [--auto]";
    exit;
  }

} else if (args.startsWith('--tag')) {
  // Tag search
  source = 'tag';
  // Extract tags: "--tag calculator,premium" → ["calculator", "premium"]
  const tagMatch = args.match(/--tag\s+(.+)/);
  const tagString = tagMatch ? tagMatch[1].trim() : null;
  tags = tagString ? tagString.split(',').map(t => t.trim()) : [];

  if (tags.length === 0) {
    echo "❌ --tag requires at least one tag";
    echo "Usage: /inspire --tag calculator,premium [--auto]";
    exit;
  }

} else {
  // Invalid argument
  echo "❌ Invalid argument: $args";
  echo "";
  echo "Valid options:";
  echo "  /inspire --taste [--auto]             (your global taste folder)";
  echo "  /inspire --folder [path] [--auto]     (custom folder)";
  echo "  /inspire --tag [tags] [--auto]        (search by tags)";
  exit;
}

if (autoMode) {
  echo "⚡ AUTO MODE: Fast analysis without user interaction";
}
```

---

## Load Screenshots Based on Source

**Source:** [source]

### If source = 'taste':

```bash
echo "📂 LOADING FROM GLOBAL TASTE FOLDER"
echo "Path: ~/.claude/design-inspiration/"

# List all PNG files
find ~/.claude/design-inspiration -name "*.png" 2>/dev/null | grep -v "COLLECTIONS\|README\|INDEX"
```

### If source = 'folder':

```bash
echo "📂 LOADING FROM CUSTOM FOLDER"
echo "Path: $path"

# Verify folder exists
if [ ! -d "$path" ]; then
  echo "❌ Folder not found: $path"
  exit
fi

# List all PNG files
find "$path" -name "*.png" 2>/dev/null
```

### If source = 'tag':

```bash
echo "🏷️ SEARCHING BY TAGS: ${tags[@]}"

# Check if INDEX.json exists
if [ ! -f ~/.claude/design-inspiration/INDEX.json ]; then
  echo "❌ No INDEX.json found"
  echo "Tag search requires /save-inspiration to create tagged examples"
  exit
fi

# Read and parse INDEX.json
[Read ~/.claude/design-inspiration/INDEX.json]

# Filter by tags
# For each entry in INDEX.json:
#   If entry.tags includes ANY of the requested tags:
#     Add to results

# Example:
# User requested: --tag calculator,premium
# Entry has tags: ["calculator", "UI", "buttons"]
# Match: YES (has "calculator")

matchingFiles = []
for entry in INDEX.json:
  if any tag in tags is in entry.tags:
    matchingFiles.push(entry.filename)

if matchingFiles.length === 0:
  echo "❌ No examples found with tags: ${tags[@]}"
  echo ""
  echo "Available tags in your library:"
  [List all unique tags from INDEX.json]
  exit
else:
  echo "✅ Found ${matchingFiles.length} examples"
  for file in matchingFiles:
    echo "  - $file (tags: ${entry.tags})"
```

---

## Cache Last Folder (For /design Integration)

**If source = 'folder':**

```bash
# Save folder path to cache for /design to use
mkdir -p ~/.claude/design-inspiration/
cat > ~/.claude/design-inspiration/.last-inspire-folder << EOF
{
  "folder": "$path",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "count": ${screenshotCount}
}
EOF
```

**This allows `/design` to auto-suggest using these refs.**

---

## Present Source Summary

**If autoMode:**
```
⚡ AUTO MODE ENGAGED

Source: [taste|folder|tag]
Found: [X] screenshots

Running fast analysis → principles only
```

**If source = 'folder':**
```
💾 Cached folder path for /design to use
```

**If NOT autoMode:**
```
📊 INSPIRATION SOURCE

Source: [taste|folder|tag]
Path: [path or "Tag search"]
Found: [X] screenshots

Proceeding to vision analysis...
```

---

## Phase 1: Load Inspiration

### Step 1: Read Each Screenshot with Vision

**CRITICAL:** Actually READ the screenshots with vision analysis, don't just list them.

**AUTO MODE BEHAVIOR:**
- Skip detailed analysis output
- Skip metadata display
- Go straight to extracting principles
- Output final synthesis only

For each screenshot found:

**1.1: Check for metadata (from /save-inspiration)**

```bash
# Check if metadata JSON exists
metadataFile="${screenshot%.png}.json"

if [ -f "$metadataFile" ]; then
  echo "✅ Metadata found - loading saved analysis"
  cat "$metadataFile"
else
  echo "ℹ️ No metadata - performing fresh vision analysis"
fi
```

**2.2: Read screenshot with vision**

```
Read ~/.claude/design-inspiration/[category]/[filename].png
```

**2.3: Enhance with metadata (if exists)**

If metadata exists, use saved principles as foundation:

```
📋 SAVED ANALYSIS AVAILABLE

This example was saved with /save-inspiration:
- Demonstrates: "[demonstrates field from metadata]"
- Tags: [tags array]
- Principles already extracted: [count]

Saved principles:
1. [principle 1 from metadata]
2. [principle 2 from metadata]
...

Performing vision analysis to confirm and expand...
```

The Read tool supports vision analysis for images. Use it to analyze each screenshot visually.

**Vision analysis should:**
- Confirm saved principles if metadata exists
- Add any new insights from fresh analysis
- Provide full aesthetic analysis even for saved examples

---

## Phase 2: Analyze Beautiful Design

**If NOT autoMode:**

For each screenshot, analyze with vision and present full analysis:

### What Makes This Beautiful?

**Visual Analysis:**
- What immediately catches the eye?
- How does the design create hierarchy?
- What's the rhythm and flow?
- How does spacing create breathing room?

**Aesthetic Qualities:**
- Effortless clarity - How is it immediately understandable?
- Sophistication - What makes it feel refined?
- Restraint - Where does it NOT use emphasis?
- Delight - What makes it joyful to use?

**Emotional Response:**
- How does this make you FEEL?
- Confident? Calm? Excited? Focused?
- What creates that feeling?

**If autoMode:**

Analyze silently, extract principles only. No detailed output per screenshot.

---

## Phase 3: Extract Principles

After analyzing all screenshots, synthesize:

**If autoMode:**

Skip to final output (Phase 4), present ONLY:
- Core principles
- Actionable takeaways
- No verbose synthesis

**If NOT autoMode:**

Present full synthesis:

### Common Aesthetic Patterns

```
🎨 INSPIRATION ANALYSIS

Analyzed [X] beautiful designs in [category]

SHARED AESTHETIC QUALITIES:
- [What they all have in common]
- [Recurring visual patterns]
- [Common use of space/color/typography]

WHAT CREATES ELEGANCE:
- [Principle 1: e.g., "generous whitespace creates calm"]
- [Principle 2: e.g., "subtle shadows add depth without noise"]
- [Principle 3: e.g., "one accent color used sparingly"]

THE FEELING THEY CREATE:
- [How these designs make users feel]
- [Why they're delightful to use]

CONTRAST WITH MEDIOCRE DESIGN:
Beautiful design does:
- [What makes these stand out]
- [What they don't do that mediocre designs do]

Mediocre design does:
- [Common mistakes these avoid]
- [What clutters vs. what clarifies]
```

---

## Phase 4: Output

**If autoMode:**

**Present concise, actionable output only:**

```
⚡ INSPIRE AUTO - QUICK PRINCIPLES

Source: [taste|folder|tag]
Analyzed: [X] examples

CORE PRINCIPLES:
1. [Actionable principle 1]
2. [Actionable principle 2]
3. [Actionable principle 3]
4. [Actionable principle 4]
5. [Actionable principle 5]

WHAT TO DO:
→ [Direct action 1]
→ [Direct action 2]
→ [Direct action 3]

AVOID:
✗ [Anti-pattern 1]
✗ [Anti-pattern 2]
```

**End. No follow-up questions.**

---

**If NOT autoMode:**

**Present full analysis and ask for direction:**

```
I've analyzed [X] examples of beautiful [category] design.

Key aesthetic principles:
- [Principle 1]
- [Principle 2]
- [Principle 3]

These designs create a feeling of [emotion/quality].

For your current design, should I:
1. Apply these exact aesthetic principles
2. Show you the analysis and let you decide
3. Design something that FEELS like these examples

What would you like?
```

---

## Phase 5: Vision-Based Quality Check

**After implementation, compare:**

```
Take screenshot of your implementation
Compare to inspiration gallery

QUALITY CHECK:
Does this FEEL as good as the inspiration?
- [ ] Has the same effortless clarity
- [ ] Uses space with similar sophistication
- [ ] Creates a similar emotional response
- [ ] Has comparable visual rhythm
- [ ] Feels as delightful to use

IF NO:
What's missing that the inspiration has?
- [Specific gap 1]
- [Specific gap 2]

Recommend adjustments to match inspiration quality.
```

---

## Examples

**Protocol page design:**
```
/inspire protocols

→ Analyzes Linear roadmap, Stripe docs, Notion database
→ Extracts: "Timeline as hero, progressive disclosure, scannable cards"
→ Creates design that FEELS like these examples
```

**Landing page:**
```
/inspire landing

→ Studies Vercel homepage, Arc browser, Linear landing
→ Identifies: "Bold hero, clear value prop, confident simplicity"
→ Designs landing that captures that aesthetic
```

**Component design:**
```
/inspire components

→ Reviews Radix UI, shadcn/ui, Framer
→ Learns: "Subtle depth, perfect padding, refined interactions"
→ Builds components with that sophistication
```

---

## Critical Rules

### DO:
- ✅ Analyze the FEELING, not just the layout
- ✅ Extract what makes it delightful, not just what it looks like
- ✅ Study how space creates sophistication
- ✅ Understand restraint and emphasis
- ✅ Compare final result to inspiration quality

### DON'T:
- ❌ Just list technical specs ("font size 24px")
- ❌ Copy the design without understanding WHY it works
- ❌ Focus only on layout, ignore aesthetic quality
- ❌ Skip the vision-based comparison after implementation

---

## If No Inspiration Exists Yet

If the category is empty:

```
📂 INSPIRATION NEEDED

No examples found in ~/.claude/design-inspiration/[category]/

To build aesthetic taste, add screenshots of beautiful designs:
1. Find designs you find elegant and delightful
2. Take screenshots
3. Save to ~/.claude/design-inspiration/[category]/
4. Name descriptively (e.g., "linear-roadmap.png")

Recommendations to start:
[Category-specific suggestions]

For now, I'll work without inspiration references, but the
result may lack the refined aesthetic that studying beautiful
examples would provide.
```

---

## Summary

**/inspire teaches agents taste through:**
1. Vision-based analysis of beautiful design
2. Extraction of aesthetic principles
3. Understanding of what creates delight
4. Application of that taste to new work
5. Quality comparison to inspiration

**It's not rules - it's developing an eye for beauty.**

Over time, as you populate the inspiration gallery, agents will
learn your aesthetic preferences and create designs that FEEL
as good as the examples you love.

---

**Response Awareness**: For implementation workflows, see `docs/RESPONSE_AWARENESS_TAGS.md` for meta-cognitive tag system used by verification-agent and quality-validator.
