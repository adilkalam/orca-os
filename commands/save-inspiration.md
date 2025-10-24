---
description: Save design examples to your personal gallery with tags and vision analysis - "this is an example of good spacing" or "engaging calculator UI"
allowed-tools: [Read, Write, Bash, AskUserQuestion]
argument-hint: [optional: description of what this demonstrates]
---

# /save-inspiration - Curate Your Design Library

**PURPOSE**: Save specific design examples with labels for what they demonstrate, building a searchable personal inspiration library.

**Use this when:**
- You see a design that demonstrates a specific principle
- You want to remember "this is how to do X well"
- You're building a reference library for your taste
- You find examples of patterns you want to reuse

**Examples:**
- "This is an example of engaging UI on a calculator"
- "This demonstrates good spacing and visual hierarchy"
- "This is the navigation style I want"
- "Perfect example of restrained color usage"

---

## User Input

**What does this demonstrate?** $ARGUMENTS

**If no arguments provided, will ask after image is shared**

---

## Step 1: Get the Image

### Option A: User Already Pasted Image

**If user pasted image in the conversation:**
```
✅ Image received

Proceeding to vision analysis...
```

### Option B: Ask for Image

**If no image detected, ask user:**

```javascript
AskUserQuestion({
  questions: [{
    question: "How would you like to share the design example?",
    header: "Image Source",
    multiSelect: false,
    options: [
      {
        label: "Paste image now",
        description: "I'll paste the image into the conversation"
      },
      {
        label: "File path",
        description: "I have a screenshot or image file on disk"
      },
      {
        label: "Take screenshot",
        description: "Screenshot a live site or app"
      }
    ]
  }]
})
```

**If "Paste image now":**
```
Please paste your design example image into the conversation.
```

**If "File path":**
```javascript
AskUserQuestion({
  questions: [{
    question: "What's the path to your design example?",
    header: "File Path",
    multiSelect: false,
    options: [
      {label: "~/Desktop/", description: "Desktop folder"},
      {label: "~/Downloads/", description: "Downloads folder"},
      {label: "~/Pictures/Screenshots/", description: "Screenshots folder"},
      // Other option for custom path
    ]
  }]
})
```

Then list files:
```bash
ls -la [user-provided-path]
```

And read the image:
```javascript
Read([selected-file-path])
```

**If "Take screenshot":**
```
I can help screenshot a live site or app.

For web:
  - Provide URL and I'll use WebFetch or browser automation

For iOS Simulator:
  - Use: xcrun simctl io booted screenshot /tmp/inspiration.png

For macOS app:
  - Use: screencapture -i /tmp/inspiration.png

Which would you like?
```

---

## Step 2: Get Description (If Not Provided)

**If user didn't provide description in $ARGUMENTS:**

```javascript
AskUserQuestion({
  questions: [{
    question: "What does this design example demonstrate?",
    header: "Description",
    multiSelect: false,
    options: [
      {label: "Good spacing/hierarchy", description: "Demonstrates effective use of whitespace and visual hierarchy"},
      {label: "Engaging UI pattern", description: "Shows an engaging, delightful user interface approach"},
      {label: "Navigation style", description: "Example of navigation pattern I want to use"},
      {label: "Color usage", description: "Demonstrates restrained or effective color usage"},
      {label: "Typography", description: "Shows effective typography and font pairing"},
      {label: "Component design", description: "Well-designed specific component (button, card, etc.)"},
      // "Other" for custom input
    ]
  }]
})
```

**If "Other" selected, ask for custom description:**
```
What does this design example demonstrate?
(e.g., "engaging calculator UI", "minimal form design", "bold CTA pattern")
```

---

## Step 3: Vision Analysis

**Analyze the image with vision:**

```
🔬 ANALYZING DESIGN EXAMPLE

[Read image with vision]

VISION ANALYSIS:

1. FIRST IMPRESSION:
   - What immediately stands out?
   - What creates the effect user described?

2. LAYOUT & HIERARCHY:
   - How is information organized?
   - What creates the visual flow?
   - Spacing patterns observed

3. TYPOGRAPHY:
   - Font choices and scale
   - How type creates hierarchy
   - Readability approach

4. COLOR & MATERIAL:
   - Color palette and usage
   - Background treatments
   - Depth techniques (shadows, gradients)

5. WHAT MAKES IT WORK:
   - Core principle that creates the effect
   - Why this demonstrates what user described
   - Specific techniques to extract

6. EXTRACTED PRINCIPLES:
   [3-5 specific, actionable principles]

   Example:
   - "16px spacing between buttons creates breathing room"
   - "Color-coded operators (orange) vs numbers (white) for hierarchy"
   - "Generous padding (24px) makes buttons feel premium"
   - "Rounded corners (12px) soften the technical feel"
   - "Drop shadow (0 2px 8px rgba(0,0,0,0.15)) adds depth"
```

---

## Step 4: Determine Category

**Ask user which category this belongs to:**

```javascript
AskUserQuestion({
  questions: [{
    question: "Which category best fits this example?",
    header: "Category",
    multiSelect: false,
    options: [
      {
        label: "components",
        description: "Specific UI components (buttons, cards, forms, modals)"
      },
      {
        label: "navigation",
        description: "Navigation patterns (sidebar, tabs, breadcrumbs, menus)"
      },
      {
        label: "spacing",
        description: "Spacing, rhythm, whitespace examples"
      },
      {
        label: "typography",
        description: "Font usage, type hierarchy, readability"
      },
      {
        label: "color",
        description: "Color palettes, usage, restraint, accents"
      },
      {
        label: "layouts",
        description: "Page layouts, grid systems, information architecture"
      },
      {
        label: "interactions",
        description: "Animations, transitions, micro-interactions"
      },
      {
        label: "landing",
        description: "Landing page heroes, marketing pages"
      },
      {
        label: "protocols",
        description: "Protocol pages, timelines, data presentation (if relevant to your work)"
      },
      // "Other" for custom category
    ]
  }]
})
```

**If "Other" selected:**
```
What category should this go in?
(Will create new folder: ~/.claude/design-inspiration/[category]/)
```

---

## Step 5: Extract and Confirm Tags

**Auto-extract tags from description + vision analysis:**

```
📋 AUTO-EXTRACTED TAGS

From your description: "[user description]"
From vision analysis: [principles found]

Suggested tags:
- [tag1]
- [tag2]
- [tag3]
- [tag4]
- [tag5]

Example for "engaging calculator UI":
- engaging
- calculator
- UI
- buttons
- color-coded
- hierarchy
```

**Ask user to confirm/modify tags:**

```javascript
AskUserQuestion({
  questions: [{
    question: "Do you want to modify the tags?",
    header: "Tags",
    multiSelect: false,
    options: [
      {
        label: "Use suggested tags",
        description: "Save with the auto-extracted tags above"
      },
      {
        label: "Add more tags",
        description: "Keep suggested tags but add additional ones"
      },
      {
        label: "Custom tags",
        description: "Replace with my own tag list"
      }
    ]
  }]
})
```

**If "Add more tags" or "Custom tags":**
```
Enter tags (comma-separated):
(e.g., "minimal, elegant, premium, dark-mode")
```

---

## Step 6: Generate Filename

**Create descriptive filename from tags:**

```javascript
// Sanitize description for filename
const description = userDescription
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .substring(0, 50);

// Example:
// "engaging calculator UI" → "engaging-calculator-ui"
// "good spacing and visual hierarchy" → "good-spacing-and-visual-hierarchy"

const filename = `${description}.png`;
const metadataFilename = `${description}.json`;
```

**Present to user:**

```
💾 SAVING AS:

Filename: [filename]
Category: [category]
Full path: ~/.claude/design-inspiration/[category]/[filename]

This filename is based on your description.
Would you like to use a different name?
```

```javascript
AskUserQuestion({
  questions: [{
    question: "Use this filename?",
    header: "Filename",
    multiSelect: false,
    options: [
      {label: "Yes, use generated name", description: filename},
      {label: "Custom filename", description: "I'll provide a different name"}
    ]
  }]
})
```

**If "Custom filename":**
```
Enter filename (without extension):
(e.g., "calculator-engaging-ui", "stripe-spacing-example")
```

---

## Step 7: Save Files

### Step 7.1: Create Category Directory (If Needed)

```bash
mkdir -p ~/.claude/design-inspiration/[category]/
```

### Step 7.2: Save Image

**If image was pasted:**
```
[Image is already in conversation context - note that it's saved]
Note: Image pasted in conversation will be saved to:
~/.claude/design-inspiration/[category]/[filename]
```

**If image was from file path:**
```bash
cp [source-path] ~/.claude/design-inspiration/[category]/[filename]
```

**If image was screenshot:**
```bash
mv /tmp/inspiration.png ~/.claude/design-inspiration/[category]/[filename]
```

### Step 7.3: Create Metadata JSON

```javascript
const metadata = {
  demonstrates: userDescription,
  tags: [tag1, tag2, tag3, ...],
  category: selectedCategory,
  principles: [
    // From vision analysis
    "16px spacing between buttons creates breathing room",
    "Color-coded operators for hierarchy",
    // ... etc
  ],
  vision_analysis: {
    first_impression: "...",
    layout: "...",
    typography: "...",
    color: "...",
    what_makes_it_work: "..."
  },
  date_added: "2025-10-21",
  analyzed: true,
  source: "user-saved", // vs "discover" or "inspire"
  filename: filename
};
```

**Write metadata file:**

```javascript
Write(
  `~/.claude/design-inspiration/[category]/[metadata-filename]`,
  JSON.stringify(metadata, null, 2)
)
```

### Step 7.4: Update Global Index

**Read existing index (if exists):**

```bash
cat ~/.claude/design-inspiration/INDEX.json 2>/dev/null || echo '{}'
```

**Update index:**

```javascript
const index = JSON.parse(existingIndex || '{}');

// Add to index
index[`${category}/${filename}`] = {
  demonstrates: userDescription,
  tags: tags,
  category: category,
  date_added: "2025-10-21",
  principles_count: principles.length
};

// Write updated index
Write(
  '~/.claude/design-inspiration/INDEX.json',
  JSON.stringify(index, null, 2)
)
```

---

## Step 8: Confirm Saved

**Present success message:**

```
✅ DESIGN EXAMPLE SAVED

Location: ~/.claude/design-inspiration/[category]/[filename]

Saved with:
- Category: [category]
- Tags: [tag1, tag2, tag3]
- Principles extracted: [count]
- Metadata: JSON file created

This example is now available in:
- /inspire --filter [category]
- /inspire --tags [tag1,tag2]
- /design (will show when relevant to project)

Quick preview of extracted principles:
1. [principle 1]
2. [principle 2]
3. [principle 3]

---

NEXT STEPS:

Want to save another example?
  → Run /save-inspiration again

Want to review your gallery?
  → Run /inspire to see all saved examples

Want to use this in a project?
  → Run /design and reference this example
```

---

## Integration with Existing Commands

### Integration with `/inspire`

**Updated `/inspire` to support filtering:**

```bash
# View all inspiration
/inspire

# Filter by category
/inspire --filter components
/inspire --filter navigation

# Filter by tags
/inspire --tags engaging,minimal
/inspire --tags calculator

# Filter by date
/inspire --recent  # Last 30 days
```

**How `/inspire` uses saved examples:**

1. Reads INDEX.json for all examples
2. Filters by category/tags if specified
3. Reads metadata JSON for each example
4. Includes principles in analysis
5. Shows which examples demonstrate which patterns

### Integration with `/design`

**Updated `/design` to reference saved examples:**

**When user says "Use my gallery":**

```
/design "calculator app"

Pre-flight: [design system, flexibility, etc.]

Main:
  "Where are your refs?"
    → User: "Use my gallery - show calculator examples"

Searches INDEX.json for tags: ["calculator", "engaging", "UI"]

Finds:
  - components/engaging-calculator-ui.png
  - [loads metadata and principles]

Vision analysis uses saved principles as starting point

Conversational brainstorming proceeds with these examples
```

**Auto-suggest from gallery:**

```
/design "calculator app"

Agent automatically searches INDEX.json for "calculator"

Finds relevant examples, asks:
  "I found 2 calculator examples in your gallery. Use them as refs?"
    → Yes: Load and use
    → No: Ask for other refs
```

---

## Example Sessions

### Example 1: Save Calculator UI

```
User: *pastes calculator screenshot*
"This is an example of engaging UI on a calculator"

Agent:
✅ Image received
🔬 Analyzing design example...

VISION ANALYSIS:
- Color-coded operators (orange) create clear visual hierarchy
- Generous button spacing (16px) creates breathing room
- Large buttons (60x60px) feel premium and easy to tap
- Drop shadows add depth without clutter

Extracted principles:
1. Color coding for functional grouping (orange = operators)
2. 16px spacing between buttons creates breathing room
3. 60x60px button size for comfortable tapping
4. Subtle shadows (0 2px 8px) add depth
5. Dark theme reduces eye strain for frequent use

Which category?
  → User selects: "components"

Tags: engaging, calculator, UI, buttons, color-coded, hierarchy
  → User selects: "Use suggested tags"

Filename: engaging-calculator-ui.png
  → User selects: "Yes, use generated name"

✅ SAVED: ~/.claude/design-inspiration/components/engaging-calculator-ui.png

Available in /inspire and /design
```

### Example 2: Save Navigation Pattern

```
User: "This demonstrates the navigation style I want"
*shares sidebar screenshot*

Agent:
How would you like to share?
  → User: "Paste image now"

Please paste the image...
  → User pastes sidebar screenshot

🔬 Analyzing design example...

VISION ANALYSIS:
- Collapsible sidebar with icons + labels
- Minimal decoration, focus on clarity
- Active state: subtle background, not bold colors
- Grouped by function (Dashboard, Analytics, Settings)

Extracted principles:
1. Icon + label pattern for clarity
2. 40px item height for comfortable clicking
3. 8px padding, 4px border-radius for subtle focus
4. Grouped navigation (visual separators between groups)
5. Collapsed state shows icons only (saves space)

Which category?
  → User selects: "navigation"

Tags: sidebar, navigation, collapsible, minimal, icons
  → User selects: "Use suggested tags"

Filename: navigation-style-sidebar-minimal.png
  → User selects: "Yes, use generated name"

✅ SAVED: ~/.claude/design-inspiration/navigation/navigation-style-sidebar-minimal.png
```

### Example 3: Use Saved Examples in Design

```
User: "/design calculator app"

/design:
Pre-flight:
  - Design system: docs/design-guide.md
  - Flexibility: Slight (20%)
  - Personal taste: No

Main:
  Where are your refs?
    → User: "Use my gallery - show calculator examples"

Searching gallery for "calculator"...

Found:
  - components/engaging-calculator-ui.png
    Tags: engaging, calculator, UI, buttons
    Principles: 5 extracted

Loading example + metadata...

Vision analysis (enhanced with saved principles):
✅ Already analyzed: "Color coding for functional grouping"
✅ Already analyzed: "16px spacing creates breathing room"

Clarifying questions:
  - Use color-coded buttons like the example? → User: Yes
  - Use 16px spacing? → User: Yes, but adapt to our 8px grid
  - Use drop shadows? → User: No, keep it flat per our design system

Design brief:
  - Color coding: Adapt example's orange to our gold (#C9A961)
  - Spacing: Use 16px (2x our 8px base) for button gaps
  - Buttons: 60x60px adapted to our touch target rules
  - NO shadows: Flat design per our design system
  - [Full brief with implementation specs]

✅ Design brief complete
```

---

## File Structure

**Gallery Structure:**

```
~/.claude/design-inspiration/
├── INDEX.json                           ← Global searchable index
├── components/
│   ├── engaging-calculator-ui.png       ← Image
│   ├── engaging-calculator-ui.json      ← Metadata
│   ├── button-premium-feel.png
│   └── button-premium-feel.json
├── navigation/
│   ├── sidebar-minimal.png
│   ├── sidebar-minimal.json
│   ├── tabs-clean.png
│   └── tabs-clean.json
├── spacing/
│   ├── generous-whitespace.png
│   └── generous-whitespace.json
├── typography/
│   ├── heading-hierarchy.png
│   └── heading-hierarchy.json
├── color/
│   ├── restrained-palette.png
│   └── restrained-palette.json
├── layouts/
├── interactions/
├── landing/
└── protocols/
```

**INDEX.json Structure:**

```json
{
  "components/engaging-calculator-ui.png": {
    "demonstrates": "engaging UI on a calculator",
    "tags": ["engaging", "calculator", "UI", "buttons", "color-coded"],
    "category": "components",
    "date_added": "2025-10-21",
    "principles_count": 5
  },
  "navigation/sidebar-minimal.png": {
    "demonstrates": "navigation style I want",
    "tags": ["sidebar", "navigation", "minimal", "collapsible"],
    "category": "navigation",
    "date_added": "2025-10-21",
    "principles_count": 5
  }
}
```

**Metadata JSON Structure:**

```json
{
  "demonstrates": "engaging UI on a calculator",
  "tags": ["engaging", "calculator", "UI", "buttons", "color-coded", "hierarchy"],
  "category": "components",
  "principles": [
    "Color coding for functional grouping (orange = operators)",
    "16px spacing between buttons creates breathing room",
    "60x60px button size for comfortable tapping",
    "Subtle shadows (0 2px 8px) add depth",
    "Dark theme reduces eye strain for frequent use"
  ],
  "vision_analysis": {
    "first_impression": "Bold, clear calculator with excellent visual hierarchy through color coding",
    "layout": "4x4 grid of buttons with display at top, operators in orange column on right",
    "typography": "Large, clear numbers (24px) on buttons, display uses 48px for entered numbers",
    "color": "Dark background (#1C1C1C), white numbers, orange operators (#FF9500)",
    "what_makes_it_work": "Color coding creates instant functional recognition - users know where operators are without thinking. Generous spacing prevents misclicks. Dark theme is premium and easy on eyes."
  },
  "date_added": "2025-10-21",
  "analyzed": true,
  "source": "user-saved",
  "filename": "engaging-calculator-ui.png"
}
```

---

## Search and Filter Capabilities

**Search by tags:**

```bash
# Find all examples tagged "engaging"
grep -l '"engaging"' ~/.claude/design-inspiration/*/*.json

# Find all calculator examples
grep -l '"calculator"' ~/.claude/design-inspiration/*/*.json
```

**Filter by category:**

```bash
# All navigation examples
ls ~/.claude/design-inspiration/navigation/
```

**Filter by date:**

```bash
# Added in last 30 days
find ~/.claude/design-inspiration -name "*.json" -mtime -30
```

**Full-text search in principles:**

```bash
# Find examples mentioning "spacing"
grep -r "spacing" ~/.claude/design-inspiration/*/*.json
```

---

## Critical Rules

### DO:
- ✅ Always do vision analysis before saving
- ✅ Extract specific, actionable principles
- ✅ Auto-suggest tags from description + analysis
- ✅ Create metadata JSON alongside image
- ✅ Update global INDEX.json for searchability
- ✅ Use descriptive filenames
- ✅ Confirm category and tags with user
- ✅ Show extracted principles in confirmation

### DON'T:
- ❌ Save without vision analysis
- ❌ Use vague principles ("looks nice")
- ❌ Skip metadata creation
- ❌ Forget to update INDEX.json
- ❌ Use generic filenames (image1.png)
- ❌ Auto-categorize without asking user
- ❌ Save duplicates without checking

---

## Summary

**/save-inspiration lets you curate your design library:**

1. Share image (paste, path, or screenshot)
2. Describe what it demonstrates
3. Vision analysis extracts principles
4. Choose category and tags
5. Save with metadata
6. Available in /inspire and /design

**Benefits:**
- Build searchable personal design library
- Tag examples by what they demonstrate
- Extract principles automatically
- Reference in future projects
- Filter by category, tags, or date
- No more "I saw a good example once but can't remember where"

**Integration:**
- `/inspire --filter components` - View by category
- `/inspire --tags engaging,minimal` - Search by tags
- `/design` auto-suggests relevant gallery examples
- All examples have vision analysis and extracted principles

**Result:** Personal design library that grows with your taste, searchable by what patterns demonstrate, ready to reference in any project.

---

**Response Awareness**: For implementation workflows, see `docs/RESPONSE_AWARENESS_TAGS.md` for meta-cognitive tag system used by verification-agent and quality-validator.
