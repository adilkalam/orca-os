---
description: Conversational design brainstorming with user-provided project-specific references - establishes design system baseline, flexibility scale, and optional personal taste before extracting principles
allowed-tools: [Read, Write, AskUserQuestion, Glob, Bash]
argument-hint: [design request OR --list OR --clear OR --remove [name]]
---

# /design - Project Design Direction

**PURPOSE**: Quick, conversational design brainstorming using YOUR specific references for THIS project.

**Use this when:**
- You have specific design examples you want to reference
- You want conversational exploration of which elements to use
- You need project direction, not just general taste

**DO NOT use when:**
- Just exploring your personal aesthetic → Use `/inspire`
- Need industry examples but have no specific refs → Use `/discover` (triggered by `/concept`)

---

## Management Commands

**Manage saved design briefs:**

```bash
/design --list              # List all saved design briefs
/design --clear             # Clear all saved design briefs
/design --remove [name]     # Remove specific design brief
```

### If Arguments are Management Commands:

**Parse arguments:**

```javascript
const args = $ARGUMENTS.trim();

if (args === '--list') {
  // List saved design briefs
  command = 'list';

} else if (args === '--clear') {
  // Clear all saved design briefs
  command = 'clear';

} else if (args.startsWith('--remove ')) {
  // Remove specific design brief
  command = 'remove';
  const nameMatch = args.match(/--remove\s+(.+)/);
  briefName = nameMatch ? nameMatch[1].trim() : null;

  if (!briefName) {
    echo "❌ --remove requires a brief name";
    echo "Usage: /design --remove landing-hero-2025-10-21";
    echo "Use /design --list to see available briefs";
    exit;
  }

} else {
  // Regular design request
  command = 'design';
  designRequest = args;
}
```

---

### Execute Management Command

**If command = 'list':**

```bash
echo "📋 SAVED DESIGN BRIEFS"
echo ""

# Check if design briefs directory exists
if [ ! -d "docs/design-briefs/" ]; then
  echo "No design briefs saved yet"
  echo ""
  echo "Design briefs are saved to: docs/design-briefs/"
  echo "They're created when you approve a design brief in /design"
  exit
fi

# List all design briefs
ls -1t docs/design-briefs/*.md 2>/dev/null | while read file; do
  filename=$(basename "$file")
  date=$(echo "$filename" | grep -oE '[0-9]{8}' | head -1)
  name=$(echo "$filename" | sed 's/-[0-9]\{8\}\.md$//')

  echo "📄 $filename"
  echo "   Name: $name"
  echo "   Date: $date"
  echo ""
done

echo "---"
echo "To remove a brief: /design --remove [filename]"
echo "To clear all briefs: /design --clear"

exit
```

**If command = 'clear':**

```bash
echo "⚠️  CLEAR ALL DESIGN BRIEFS"
echo ""

# Check if design briefs directory exists
if [ ! -d "docs/design-briefs/" ]; then
  echo "No design briefs to clear"
  exit
fi

# Count briefs
count=$(ls -1 docs/design-briefs/*.md 2>/dev/null | wc -l)

if [ $count -eq 0 ]; then
  echo "No design briefs to clear"
  exit
fi

echo "Found $count design brief(s)"
echo ""
```

**Ask for confirmation:**

```javascript
AskUserQuestion({
  questions: [{
    question: "Are you sure you want to delete all $count design brief(s)?",
    header: "Confirm Clear",
    multiSelect: false,
    options: [
      {label: "Yes, delete all", description: "Permanently delete all design briefs"},
      {label: "No, cancel", description: "Keep the design briefs"}
    ]
  }]
})
```

**If confirmed:**

```bash
echo "Deleting all design briefs..."
rm -f docs/design-briefs/*.md

echo "✅ All design briefs cleared"
echo ""
echo "docs/design-briefs/ is now empty"
```

**If command = 'remove':**

```bash
echo "🗑️  REMOVE DESIGN BRIEF"
echo ""

# Check if file exists
file="docs/design-briefs/$briefName"

if [ ! -f "$file" ]; then
  echo "❌ Design brief not found: $briefName"
  echo ""
  echo "Available briefs:"
  ls -1 docs/design-briefs/*.md 2>/dev/null | xargs -n 1 basename
  echo ""
  echo "Usage: /design --remove landing-hero-2025-10-21.md"
  exit
fi

echo "Found: $file"
echo ""
```

**Ask for confirmation:**

```javascript
AskUserQuestion({
  questions: [{
    question: "Delete design brief '$briefName'?",
    header: "Confirm Delete",
    multiSelect: false,
    options: [
      {label: "Yes, delete", description: "Permanently delete this design brief"},
      {label: "No, cancel", description: "Keep the design brief"}
    ]
  }]
})
```

**If confirmed:**

```bash
echo "Deleting $briefName..."
rm -f "$file"

echo "✅ Design brief removed"
echo ""
echo "Remaining briefs:"
ls -1 docs/design-briefs/*.md 2>/dev/null | xargs -n 1 basename || echo "  (none)"
```

---

## Design Request (Regular Flow)

**If command = 'design' (not a management command):**

**What are we designing?** $designRequest

If no arguments provided, ask:
- What are you designing? (landing hero, protocol page, dashboard, etc.)
- What's the goal? (clarity, sophistication, engagement, etc.)

---

## PRE-FLIGHT PHASE: Establish Design Baseline

### Step 0.0: Check for Recent /inspire Folder (Cache)

**Before asking for refs, check if user just ran `/inspire --folder`:**

```bash
# Check for cached folder from /inspire
if [ -f ~/.claude/design-inspiration/.last-inspire-folder ]; then
  cacheData=$(cat ~/.claude/design-inspiration/.last-inspire-folder)
  cachedFolder=$(echo "$cacheData" | grep -o '"folder": "[^"]*"' | cut -d'"' -f4)
  cachedTimestamp=$(echo "$cacheData" | grep -o '"timestamp": "[^"]*"' | cut -d'"' -f4)
  cachedCount=$(echo "$cacheData" | grep -o '"count": [0-9]*' | grep -o '[0-9]*')

  # Check if cache is recent (within last 30 minutes)
  cacheAge=$(( $(date +%s) - $(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$cachedTimestamp" +%s) ))

  if [ $cacheAge -lt 1800 ]; then
    # Cache is fresh (< 30 min)
    echo "🔍 DETECTED RECENT /inspire SESSION"
    echo ""
    echo "You recently analyzed: $cachedFolder"
    echo "Found: $cachedCount screenshots"
    echo "Time: $(( $cacheAge / 60 )) minutes ago"
    echo ""

    recentInspireFolder="$cachedFolder"
    hasRecentInspire=true
  else
    hasRecentInspire=false
  fi
else
  hasRecentInspire=false
fi
```

**If hasRecentInspire = true, we'll offer this in the refs step.**

---

### Step 0.1: Detect Project Design System

**Check these locations in order:**

```bash
# Web projects
ls -la docs/design-guide*.md
ls -la docs/design-system*.md
ls -la docs/typography-rules.md docs/color-rules.md docs/alignment-rules.md
ls -la design-system-guide.md
ls -la design-system/

# iOS projects
ls -la docs/ios-design-guide.md
ls -la DesignSystem/
ls -la Design/
find . -name "Theme.swift" -o -name "DesignTokens.swift" 2>/dev/null | head -5
find . -name "*.xcassets" 2>/dev/null | head -3
```

**If design system files found:**
- List all discovered files
- Note primary design system file

**If NOT found:**
- Note: "No design system detected in standard locations"

---

### Step 0.2: Confirm Design System with User

**Present what you found:**

```
📋 DESIGN SYSTEM DETECTION

Found potential design system files:
1. docs/design-guide-v3.md
2. docs/typography-rules.md
3. docs/color-rules.md

Which file contains your design system rules?
```

**Use AskUserQuestion:**

```javascript
AskUserQuestion({
  questions: [{
    question: "Which file contains your design system rules for this project?",
    header: "Design System",
    multiSelect: false,
    options: [
      {label: "docs/design-guide-v3.md", description: "Main design guide"},
      {label: "docs/typography-rules.md + color-rules.md", description: "Multiple rule files"},
      {label: "No design system", description: "This project has no design system yet"},
      // Add discovered files as options
    ]
  }]
})
```

**If "No design system" selected:**
- Note: Will create design brief without design system constraints
- Proceed to Step 0.4 (skip Step 0.3)

**If design system file(s) selected:**
- Proceed to Step 0.3

---

### Step 0.3: Read Design System Files

**Read ALL selected design system files:**

```javascript
Read("docs/design-guide-v3.md")
Read("docs/typography-rules.md")
Read("docs/color-rules.md")
// etc.
```

**Extract and summarize:**

```
✅ DESIGN SYSTEM LOADED

Typography:
- Font 1: Domaine Sans Display (400, 600) → Card titles 24px+, headers
- Font 2: GT Pantheon (400, 500) → Body text, paragraphs
- Font 3: Supreme LL (400) → Labels, metadata
- Hard rule: NEVER use fonts outside this list

Colors:
- Background: #0c051c (dark purple)
- Text Primary: #ffffff
- Accent: #C9A961 (gold)
- Hard rule: Dark mode ONLY, no light backgrounds

Spacing:
- Base grid: 8px
- Scale: 8, 16, 24, 32, 40, 48, 64
- Hard rule: ALL spacing must be multiples of 8px

Components:
- Cards: 20px padding minimum, gold accent line
- Buttons: Gold background, white text
- Hard rule: No Material-UI or generic component styles

Critical Rules:
1. Dark background (#0c051c) is NON-NEGOTIABLE
2. Only 3 fonts, no exceptions
3. 8px grid system, no arbitrary spacing
4. Gold (#C9A961) is primary accent
```

**This summary becomes the BASELINE for all design decisions.**

---

### Step 0.4: Ask About Flexibility Scale

**Now ask how rigidly to apply the design system:**

```javascript
AskUserQuestion({
  questions: [{
    question: "How strictly should I follow the design system rules?",
    header: "Flexibility",
    multiSelect: false,
    options: [
      {
        label: "Rigid adherence (0%)",
        description: "Follow design system exactly. No departures allowed. Extract principles only."
      },
      {
        label: "Slight flexibility (20%)",
        description: "Core rules locked (fonts, colors), but can adapt spacing/layout patterns."
      },
      {
        label: "Room to maneuver (40%)",
        description: "Can propose new patterns if they enhance the system. Justify departures."
      },
      {
        label: "Experimental (60%+)",
        description: "Use design system as inspiration, not constraint. Propose improvements."
      }
    ]
  }]
})
```

**Record flexibility level:**

```
🎚️ FLEXIBILITY SCALE: [Selected level]

What this means:
- [Explanation of what's locked vs flexible]
- [How to handle conflicts between refs and design system]
```

**Examples:**

**Rigid (0%):**
- Design system fonts → LOCKED
- Design system colors → LOCKED
- Design system spacing → LOCKED
- Refs provide PRINCIPLES only (hierarchy, flow, layout patterns)

**Slight (20%):**
- Design system fonts → LOCKED
- Design system colors → LOCKED
- Design system spacing → Can adapt if refs show better rhythm
- Refs can suggest layout patterns not in design system

**Room to maneuver (40%):**
- Design system fonts → LOCKED (unless refs show critical typography need)
- Design system colors → Can propose new accent if refs justify
- Design system spacing → Can adapt to ref patterns
- Refs can suggest new components if they enhance system

**Experimental (60%+):**
- Design system fonts → Can propose alternatives if refs justify
- Design system colors → Can expand palette if refs show need
- Design system spacing → Free to adapt
- Refs can suggest significant improvements to design system

---

### Step 0.5: Ask About Personal Taste (/inspire)

**Ask if user wants to incorporate /inspire gallery:**

```javascript
AskUserQuestion({
  questions: [{
    question: "Should I also review your /inspire gallery for your personal aesthetic preferences?",
    header: "Personal Taste",
    multiSelect: false,
    options: [
      {
        label: "Yes, include /inspire",
        description: "Review my inspiration gallery to understand my personal taste and aesthetic preferences."
      },
      {
        label: "No, skip /inspire",
        description: "Focus only on the design system and the specific references I'm about to provide."
      }
    ]
  }]
})
```

**If "Yes, include /inspire":**

```bash
# Check if inspiration gallery exists
ls -la ~/.claude/design-inspiration/

# List categories
ls -la ~/.claude/design-inspiration/landing/
ls -la ~/.claude/design-inspiration/protocols/
ls -la ~/.claude/design-inspiration/components/
# etc.
```

**Read recent inspiration analysis (if exists):**

```javascript
Read("~/.claude/design-inspiration/LATEST_ANALYSIS.md")
// OR run quick /inspire scan
```

**Extract personal taste principles:**

```
✅ PERSONAL TASTE LOADED (from /inspire)

Your aesthetic preferences:
- Sophistication through restraint
- Generous whitespace over density
- Typography as primary design element
- Muted color palettes with single accent
- Progressive disclosure over information dump

These will inform how I interpret your references.
```

**If "No, skip /inspire":**
- Proceed directly to Main Phase
- Note: Design brief will use design system + refs only

---

### Step 0.6: Present Complete Baseline

**Before moving to Main Phase, present complete baseline:**

```
🎯 DESIGN BASELINE ESTABLISHED

1. DESIGN SYSTEM:
   [Summary from Step 0.3]

2. FLEXIBILITY SCALE:
   [Level from Step 0.4]

3. PERSONAL TASTE:
   [Yes/No from Step 0.5]
   [Principles if Yes]

4. DECISION FRAMEWORK:
   When your references conflict with design system:
   - [How conflicts will be resolved based on flexibility]
   - [What's locked vs what's adaptable]
   - [How personal taste informs interpretation]

Ready to proceed to design references?
```

**Wait for user confirmation before Main Phase.**

---

## MAIN PHASE: Conversational Brainstorming with References

### Step 1: Ask for Design References

**Build options based on cache:**

```javascript
const options = [];

// If recent /inspire folder detected, offer it first
if (hasRecentInspire) {
  options.push({
    label: `Use recent /inspire folder`,
    description: `${recentInspireFolder} (${cachedCount} screenshots, analyzed ${cacheAge/60} min ago)`
  });
}

// Always offer these options
options.push(
  {
    label: "Folder path",
    description: "I have screenshots/images in a specific folder (e.g., ~/Desktop/refs/)"
  },
  {
    label: "Paste into Claude Code",
    description: "I'll paste images directly into the conversation"
  },
  {
    label: "URLs",
    description: "I have URLs to live examples I want to reference"
  }
);
```

**Ask where the references are:**

```javascript
AskUserQuestion({
  questions: [{
    question: "Where are your design references for this project?",
    header: "References",
    multiSelect: false,
    options: options
  }]
})
```

**If "Use recent /inspire folder":**

```bash
echo "✅ Using cached folder from /inspire"
echo "Path: $recentInspireFolder"
echo "Found: $cachedCount screenshots"
echo ""

# Use the cached folder path
refsPath="$recentInspireFolder"
ls -la "$refsPath"
```

**If "Folder path":**

```javascript
AskUserQuestion({
  questions: [{
    question: "What's the folder path containing your design references?",
    header: "Folder Path",
    multiSelect: false,
    options: [
      {label: "~/Desktop/design-refs/", description: "Desktop folder"},
      {label: "~/Downloads/", description: "Downloads folder"},
      {label: "./design-refs/", description: "Project folder"},
      // Other option is for user to type custom path
    ]
  }]
})
```

Then:
```bash
ls -la [user-provided-path]
```

**If "Paste into Claude Code":**
```
Please paste your design reference images into the conversation.

I'll analyze them with vision once you've shared them.
```

**If "URLs":**
```
Please share the URLs of the design examples you want to reference.

I can fetch and analyze them, or take screenshots if they're live sites.
```

---

### Step 2: Vision Analysis of References

**For each reference image/screenshot:**

```javascript
Read([reference-image-path])
```

**Vision analysis questions:**

```
🔬 ANALYZING REFERENCE: [filename]

1. FIRST IMPRESSION:
   - What immediately stands out?
   - What's the emotional tone? (elegant, technical, warm, bold)

2. LAYOUT & HIERARCHY:
   - What's the hero element?
   - How is information organized?
   - What creates the visual flow?

3. TYPOGRAPHY:
   - Font choices and why they work
   - Type scale and hierarchy
   - How text creates personality

4. COLOR & MATERIAL:
   - Color palette and usage
   - Background treatments
   - Depth techniques (gradients, shadows, blur)

5. SPACING & RHYTHM:
   - How does spacing create breathing room?
   - What's the spacing scale? (tight, generous, mixed)
   - How does rhythm guide the eye?

6. INTERACTION PATTERNS (if visible):
   - How does user engage with content?
   - Progressive disclosure patterns?
   - Call-to-action placement?

7. WHAT MAKES IT WORK:
   - Core principle that creates effectiveness
   - Why this approach succeeds for this use case
```

**Create vision analysis summary for ALL references:**

```
📊 VISION ANALYSIS SUMMARY

Reference 1: landing-hero-example.png
- Hero: Full-width image with overlay text
- Principle: Single focal point, restraint
- Typography: Large display type, minimal body
- Spacing: Generous (appears to be 80-120px sections)
- Color: Muted palette, single accent

Reference 2: protocol-timeline.png
- Hero: Horizontal timeline with phases
- Principle: Protocol as primary, details secondary
- Typography: Bold phase labels, compact details
- Spacing: Tight within cards, generous between sections
- Color: Color-coded phases

Reference 3: [...]
```

---

### Step 3: Clarifying Questions

**Ask user which elements they want to use:**

```javascript
AskUserQuestion({
  questions: [
    {
      question: "Which layout patterns resonate with you?",
      header: "Layout",
      multiSelect: true,
      options: [
        {label: "Timeline as hero (Ref 2)", description: "Protocol/timeline is the primary focus"},
        {label: "Full-width hero (Ref 1)", description: "Single focal point with overlay"},
        {label: "Grid of cards (Ref 3)", description: "Information in scannable cards"},
        // Generate from vision analysis
      ]
    },
    {
      question: "What typography approach should we use?",
      header: "Typography",
      multiSelect: false,
      options: [
        {label: "Display-focused (Ref 1)", description: "Large, bold headlines as primary design element"},
        {label: "Balanced hierarchy (Ref 2)", description: "Clear scale from display to body"},
        {label: "Compact & dense (Ref 3)", description: "Emphasis on readability over display"},
      ]
    },
    {
      question: "What spacing rhythm feels right?",
      header: "Spacing",
      multiSelect: false,
      options: [
        {label: "Generous whitespace (Ref 1)", description: "80-120px between sections, breathing room"},
        {label: "Balanced (Ref 2)", description: "32-48px sections, compact cards"},
        {label: "Dense (Ref 3)", description: "16-24px sections, information-rich"},
      ]
    },
    {
      question: "Which interaction patterns should we adopt?",
      header: "Interactions",
      multiSelect: true,
      options: [
        {label: "Progressive disclosure (Ref 2)", description: "Click to expand details"},
        {label: "Hover previews (Ref 3)", description: "Hover for more info"},
        {label: "Static hierarchy (Ref 1)", description: "All info visible, no expansion"},
      ]
    }
  ]
})
```

**Follow-up questions based on answers:**

```
📋 FOLLOW-UP QUESTIONS

You selected:
- Timeline as hero (Ref 2)
- Generous whitespace (Ref 1)
- Progressive disclosure (Ref 2)

Clarifications needed:
1. Timeline shows phases - should they be clickable or always visible?
2. Generous spacing conflicts with dense compound cards in Ref 2 - which takes priority?
3. Progressive disclosure for what content? (compound details, mechanisms, protocols)
```

**Use additional AskUserQuestion calls as needed to clarify:**

```javascript
AskUserQuestion({
  questions: [{
    question: "You chose generous whitespace (Ref 1) but also compact cards (Ref 2). How should we balance these?",
    header: "Spacing Balance",
    multiSelect: false,
    options: [
      {label: "Generous between sections, compact within", description: "80px section spacing, 16px card spacing"},
      {label: "Generous everywhere", description: "80px sections, 32px card spacing"},
      {label: "Compromise", description: "48px sections, 20px card spacing"},
    ]
  }]
})
```

---

### Step 4: Generate Design Brief

**Create comprehensive, actionable design brief:**

```
🎨 DESIGN BRIEF: [Design request]

Generated: [date]
Based on: [X] user-provided references
Design system: [file] (Flexibility: [level])
Personal taste: [Yes/No - from /inspire]

---

## DESIGN CONCEPT

[One paragraph describing the vision, synthesizing user selections]

Example:
"Protocol reference page where the 3-phase injury recovery timeline is the hero element, with generous whitespace between major sections (80px) creating breathing room and sophistication. Compound details are presented in compact problem→solution cards (20px spacing) that expand on click for mechanisms. The design uses [design system fonts] with large display type for phases and balanced body text for details, all on the dark background (#0c051c) with gold accents (#C9A961) for interactive elements."

---

## BASELINE COMPLIANCE

### Design System Rules Applied:

**LOCKED (Cannot change per flexibility level):**
- Typography: [fonts from design system]
- Colors: [palette from design system]
- [Other locked elements based on flexibility]

**ADAPTED (From references):**
- Spacing rhythm: Generous between sections (80px) - from Ref 1
- Layout pattern: Timeline as hero - from Ref 2
- Interaction: Progressive disclosure - from Ref 2

**CONFLICTS RESOLVED:**
1. Ref 1 uses light background → Adapted to dark (#0c051c) per design system
2. Ref 2 uses tight spacing → Increased to 80px per user preference for generous whitespace
3. Ref 2 uses modal for details → Changed to inline expansion for better flow

### Personal Taste Applied (if /inspire was used):

- Sophistication through restraint → Minimal card decorations
- Typography as design element → Large display headers (48px+)
- Progressive disclosure → Details hidden until clicked

---

## LAYOUT STRUCTURE

[ASCII mockup or detailed description]

```
┌─────────────────────────────────────────────────────┐
│  INJURY RECOVERY PROTOCOL                           │ ← Domaine Sans Display, 64px
│  [Phase 1] ──── [Phase 2] ──── [Phase 3]           │ ← Timeline (horizontal, clickable)
│  Click phase to view protocol details ↓             │ ← Supreme LL, 14px, subtle
└─────────────────────────────────────────────────────┘
                    ↕ 80px (generous whitespace)
┌─────────────────────────────────────────────────────┐
│  COMPOUND REFERENCE                                  │ ← Domaine Sans Display, 32px
│                                                      │
│  ┌─────────────────┐  ┌─────────────────┐          │
│  │ Problem         │  │ Problem         │          │ ← Cards: 20px padding
│  │ BPC-157 fixes → │  │ TB-500 fixes →  │          │ ← GT Pantheon, 16px
│  └─────────────────┘  └─────────────────┘          │
│          ↕ 20px (compact within section)            │
│  ┌─────────────────┐  ┌─────────────────┐          │
│  │ Problem         │  │ Problem         │          │
│  │ Compound →      │  │ Compound →      │          │
│  └─────────────────┘  └─────────────────┘          │
└─────────────────────────────────────────────────────┘
```

---

## VISUAL HIERARCHY

### Hero (Most Prominent):
- 3-phase timeline (horizontal, spans full width)
- Domaine Sans Display, 64px for main title
- Domaine Sans Display, 24px for phase labels
- Gold accent (#C9A961) for active phase
- Spacing: 80px above and below

### Secondary (Supporting):
- "COMPOUND REFERENCE" section header
- Domaine Sans Display, 32px
- Compact card grid (2-3 columns)
- GT Pantheon, 16px for card content
- Spacing: 20px between cards, 80px before next section

### Tertiary (Background Details):
- Safety warnings (visible but not dominant)
- Metadata labels (Supreme LL, 12px)
- Expanded mechanism details (shown on click)
- Spacing: 16px within expanded content

---

## TYPOGRAPHY SYSTEM

**Following design system: [file]**

**Display (Domaine Sans Display):**
- Main title: 64px, weight 600
- Section headers: 32px, weight 600
- Phase labels: 24px, weight 600
- Usage: Titles, headers, phase names

**Body (GT Pantheon):**
- Card content: 16px, weight 400
- Paragraphs: 16px, weight 400, line-height 1.6
- Expanded details: 14px, weight 400, line-height 1.8
- Usage: All body text, descriptions, content

**Labels (Supreme LL):**
- Metadata: 12px, weight 400, uppercase, letter-spacing 0.05em
- Captions: 14px, weight 400
- Usage: Labels, metadata, subtle hints

**Hard Rules:**
- NEVER use fonts outside this list
- Minimum body text: 14px
- Line height: 1.6 minimum for body, 1.2 for display

---

## COLOR SYSTEM

**Following design system: [file]**

**Background:**
- Primary: #0c051c (dark purple) - NON-NEGOTIABLE
- Surface (cards): rgba(255, 255, 255, 0.05)
- Elevated: rgba(255, 255, 255, 0.08)

**Text:**
- Primary: #ffffff (100% opacity)
- Secondary: rgba(255, 255, 255, 0.7)
- Tertiary: rgba(255, 255, 255, 0.5)

**Accent:**
- Gold: #C9A961
- Usage: Active phase, hover states, CTAs, borders

**Adapted from references:**
- Ref 2 used color-coded phases → Use gold (#C9A961) for ALL phases, just vary opacity
- Ref 1 used light background → Dark (#0c051c) per design system

---

## SPACING SYSTEM

**Following design system: 8px base grid**

**Scale:**
- 8, 16, 24, 32, 40, 48, 64, 80

**Applied spacing (from user selections):**
- Between major sections: 80px (generous, from Ref 1 preference)
- Between cards within section: 20px (compact, from Ref 2)
- Card padding: 20px minimum
- Timeline to content: 80px
- Content to safety warnings: 64px

**Why this rhythm:**
- Generous section spacing (80px) creates sophistication and breathing room
- Compact card spacing (20px) keeps related info grouped
- Follows design system 8px grid (all values are multiples of 8)

---

## INTERACTION PATTERNS

**From user selections:**

1. **Timeline Phase Click:**
   - Click phase → Protocol details expand below timeline
   - Smooth accordion animation (300ms ease)
   - Gold accent highlights active phase
   - Details use 32px padding, 16px line-height

2. **Compound Card Expansion:**
   - Hover → Gold border appears (2px)
   - Click → Card expands to show:
     - Full mechanism description
     - Dosage details
     - Safety considerations
   - Expanded content: GT Pantheon 14px, line-height 1.8

3. **Progressive Disclosure Philosophy:**
   - Default view: Protocol overview + compound problems
   - One click: Protocol details OR compound mechanism
   - Two clicks: Full details visible
   - Goal: Scannable at a glance, deep-diveable on demand

---

## COMPONENT SPECIFICATIONS

**Timeline Component:**
```
- Horizontal flow (Flexbox, gap: 32px)
- Phase items:
  - Domaine Sans Display 24px
  - Gold underline (2px) on active
  - Clickable area: min 44px height
  - Spacing between phases: 32px
- Responsive: Stack vertical on mobile
```

**Compound Card:**
```
- Background: rgba(255, 255, 255, 0.05)
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Padding: 20px
- Border-radius: 8px
- Hover: Gold border (2px solid #C9A961)
- Click: Expand height (animate max-height)
- Width: min 280px, max 400px (2-3 col grid)
```

**Safety Warning Banner:**
```
- Background: rgba(201, 169, 97, 0.1) (gold tint)
- Border-left: 4px solid #C9A961
- Padding: 16px 20px
- Typography: GT Pantheon 14px
- Icon: ⚠️ or custom SVG
- Placement: Between timeline and compounds
```

---

## IMPLEMENTATION NOTES

### Design System Compliance:

**Rigid adherence (0%):**
- Typography: EXACT fonts from design system, no substitutions
- Colors: EXACT palette, no new colors
- Spacing: EXACT 8px grid, no arbitrary values
- Refs provide: Layout patterns, hierarchy principles, interaction ideas

**Slight flexibility (20%):**
- Typography: Design system fonts LOCKED
- Colors: Design system palette LOCKED
- Spacing: Can use 80px from Ref 1 (still follows 8px grid)
- Refs provide: Spacing rhythm, layout patterns, interaction patterns

**Room to maneuver (40%):**
- Typography: Design system fonts LOCKED
- Colors: Could propose new accent IF refs showed critical need (none found)
- Spacing: Free to adapt rhythm from refs (80px/20px combination used)
- Refs provide: Spacing, layout, interactions, component patterns

**Experimental (60%+):**
- Typography: Could propose font additions IF justified (current fonts sufficient)
- Colors: Could expand palette IF needed (current palette works)
- Spacing: Free to experiment with rhythm
- Refs provide: All aspects, can suggest design system improvements

**In this brief:**
- Applied: [flexibility level selected in pre-flight]
- No design system departures needed - refs adapted to system successfully

### Reference Adaptations:

**From Reference 1 (landing-hero-example.png):**
- ✅ EXTRACTED: Generous whitespace principle (80px sections)
- ✅ EXTRACTED: Single focal point approach (timeline as hero)
- ❌ NOT USED: Light background (conflicts with design system)
- ❌ NOT USED: Specific fonts (have design system fonts)

**From Reference 2 (protocol-timeline.png):**
- ✅ EXTRACTED: Timeline layout pattern
- ✅ EXTRACTED: Progressive disclosure (click to expand)
- ✅ EXTRACTED: Compact card approach (20px spacing)
- ⚠️ ADAPTED: Color-coded phases → Single gold accent per design system
- ⚠️ ADAPTED: Modal expansion → Inline expansion for better flow

**From Reference 3 (if applicable):**
- [...]

### Personal Taste Applied (if /inspire used):

**From your inspiration gallery:**
- Sophistication through restraint → Minimal card decorations, no gradients
- Generous whitespace → 80px section spacing confirmed
- Typography as design element → Large display headers (64px)
- Progressive disclosure → Hidden details until clicked

---

## NEXT STEPS

**Ready to implement:**

1. **Create timeline component** (Phase 1, 2, 3 clickable)
2. **Create compound card component** (problem→solution pattern)
3. **Build layout** following ASCII mockup
4. **Apply spacing** (80px sections, 20px cards)
5. **Add interactions** (click to expand, hover states)
6. **Test on mobile** (stack timeline vertically)

**Design system compliance verified:**
- ✅ Typography: Domaine Sans Display, GT Pantheon, Supreme LL
- ✅ Colors: #0c051c background, gold #C9A961 accent
- ✅ Spacing: 8px grid (all values are multiples)
- ✅ Components: Follow card patterns from design system

**Should I proceed to implementation or would you like to refine this brief?**
```

---

## Step 5: Present Brief & Get Approval

**Present the complete design brief above.**

**Ask:**

```javascript
AskUserQuestion({
  questions: [{
    question: "Should I proceed with implementation using this design brief?",
    header: "Approval",
    multiSelect: false,
    options: [
      {label: "Yes, implement", description: "Proceed with implementation following this brief"},
      {label: "Refine the brief", description: "I have feedback to improve the brief first"},
      {label: "Save brief only", description: "Just save the brief, I'll implement later"},
    ]
  }]
})
```

**If "Yes, implement":**
```
✅ BRIEF APPROVED

Proceeding to implementation...

[Call /enhance or proceed with implementation using brief as specification]
```

**If "Refine the brief":**
```
What would you like to change?

[Iterate on brief based on feedback]
```

**If "Save brief only":**
```bash
# Save to project docs
mkdir -p docs/design-briefs/
cat > docs/design-briefs/[design-request]-brief-$(date +%Y%m%d).md << 'EOF'
[Design brief content]
EOF

✅ DESIGN BRIEF SAVED

Saved to: docs/design-briefs/[design-request]-brief-[date].md

You can implement this later using:
/enhance "Implement design brief from docs/design-briefs/[file]"
```

---

## Critical Rules

### DO:
- ✅ ALWAYS establish design baseline FIRST (pre-flight phase)
- ✅ Ask about flexibility scale (rigid vs room to maneuver)
- ✅ Use vision analysis for ALL references
- ✅ Ask clarifying questions about which elements to use
- ✅ Generate ACTIONABLE brief (not just analysis)
- ✅ Show how you adapted refs to design system
- ✅ Show ASCII mockup or detailed layout description
- ✅ Specify exact typography, colors, spacing values
- ✅ Include component specifications (padding, borders, etc.)
- ✅ Get approval before implementing

### DON'T:
- ❌ Skip pre-flight phase (design system MUST be loaded first)
- ❌ Assume flexibility level (ALWAYS ask)
- ❌ Copy references without understanding principles
- ❌ Create vague brief ("make it nice") - BE SPECIFIC
- ❌ Ignore design system rules at low flexibility levels
- ❌ Forget to show which ref ideas you used vs didn't use
- ❌ Jump to implementation without approval

---

## Integration with Other Commands

### Relationship to /inspire:
- **/inspire**: Analyzes your global design gallery monthly, builds general taste
- **/design**: Uses YOUR specific refs for THIS project, with optional /inspire integration
- **Use /inspire first if:** You want to understand your aesthetic preferences
- **Use /design when:** You have project-specific refs and want conversational brainstorming

### Relationship to /discover:
- **/discover**: Browses design collections when you DON'T have specific refs
- **/design**: Uses refs you ALREADY have
- **Trigger /discover when:** /concept phase starts and you say "I don't have refs"
- **Trigger /design when:** You have screenshots, folder of examples, or URLs

### Relationship to /concept:
- **/concept** should ask: "Do you have specific design references for this?"
  - **Yes** → Trigger /design
  - **No** → Trigger /discover
- **/design** outputs design brief that feeds into /concept's creative direction

---

## Example Session

**User:** `/design landing page hero`

### PRE-FLIGHT PHASE:

**Step 0.1: Detect Design System**
```
Found:
- docs/design-guide-v3.md
- docs/typography-rules.md
```

**Step 0.2: Confirm with User**
```
Which file contains your design system?
→ User selects: "docs/design-guide-v3.md"
```

**Step 0.3: Read Design System**
```
✅ DESIGN SYSTEM LOADED
Typography: Domaine Sans Display, GT Pantheon, Supreme LL
Colors: Dark #0c051c, Gold #C9A961
Spacing: 8px grid
[...]
```

**Step 0.4: Flexibility Scale**
```
How strictly should I follow the design system?
→ User selects: "Slight flexibility (20%)"

🎚️ FLEXIBILITY: Slight (20%)
Fonts/colors LOCKED, spacing can adapt from refs
```

**Step 0.5: Personal Taste**
```
Should I review /inspire gallery?
→ User selects: "Yes, include /inspire"

✅ PERSONAL TASTE LOADED
- Sophistication through restraint
- Generous whitespace
- Typography as design element
[...]
```

**Step 0.6: Baseline Summary**
```
🎯 DESIGN BASELINE ESTABLISHED
1. Design system: docs/design-guide-v3.md
2. Flexibility: 20% (fonts/colors locked, spacing adaptable)
3. Personal taste: Yes (restraint, whitespace, typography-focused)

Ready to proceed to references? → Yes
```

### MAIN PHASE:

**Step 1: Ask for Refs**
```
Where are your design references?
→ User selects: "Folder path"

What's the folder path?
→ User types: "~/Desktop/landing-refs/"

Found:
- vaayu-hero.png
- linear-homepage.png
- stripe-landing.png
```

**Step 2: Vision Analysis**
```
🔬 ANALYZING: vaayu-hero.png
- Hero: Full-width image with centered text overlay
- Principle: Single focal point, absolute restraint
- Typography: Massive display (120px+), minimal body
- Spacing: Generous (appears 120px+ above/below)
- Color: Dark background, single accent

🔬 ANALYZING: linear-homepage.png
- Hero: Product screenshot with overlay text
- Principle: Show, don't tell
- Typography: Large display (80px), supportive body
- Spacing: Balanced (60-80px sections)
- Color: Dark theme, purple accent

🔬 ANALYZING: stripe-landing.png
[...]
```

**Step 3: Clarifying Questions**
```
Which layout pattern resonates?
→ User selects: "Full-width hero (Ref 1 - Vaayu)"

What typography approach?
→ User selects: "Display-focused (Ref 1)"

What spacing rhythm?
→ User selects: "Generous whitespace (Ref 1)"

Which interaction patterns?
→ User selects: "Static hierarchy (Ref 1)"
```

**Step 4: Generate Design Brief**
```
🎨 DESIGN BRIEF: Landing Page Hero

CONCEPT:
Full-width hero with massive display typography and absolute restraint, showing single focal message with generous breathing room...

LAYOUT STRUCTURE:
[ASCII mockup with Domaine Sans Display 96px hero, 80px spacing, etc.]

TYPOGRAPHY SYSTEM:
- Display: Domaine Sans Display 96px (from design system)
- Body: GT Pantheon 18px (from design system)
[...]

COLOR SYSTEM:
- Background: #0c051c (design system)
- Accent: #C9A961 (design system)
[...]

SPACING SYSTEM:
- Hero padding: 80px top/bottom (adapted from Ref 1's generous spacing)
- Follows 8px grid
[...]

IMPLEMENTATION NOTES:
- Flexibility (20%): Fonts/colors LOCKED, spacing adapted to 80px from refs
- From Ref 1: Generous spacing (80px), display-focused typography
- From /inspire: Restraint principle (no decorations), typography as design element
- Adapted: Ref 1's 120px spacing → 80px (still follows 8px grid)
[...]
```

**Step 5: Approval**
```
Should I proceed with implementation?
→ User selects: "Yes, implement"

✅ BRIEF APPROVED
Proceeding to implementation...
```

---

## Summary

**/design is conversational brainstorming with YOUR refs:**

1. **PRE-FLIGHT** (Establish Baseline):
   - Detect design system
   - Confirm file with user
   - Ask flexibility scale (rigid → experimental)
   - Ask about /inspire integration
   - Present complete baseline

2. **MAIN PHASE** (Conversational):
   - Ask where refs are (folder/paste/URLs)
   - Vision analysis of refs
   - Clarifying questions about which elements
   - Generate actionable design brief
   - Get approval

3. **OUTPUT**:
   - Design brief with:
     - Concept description
     - ASCII mockup
     - Typography/color/spacing specs
     - Component specifications
     - Implementation notes
     - Baseline compliance verification

**The workflow:**
```
User has refs → /design → Pre-flight (baseline) → Main (refs) → Brief → Approve → Implement
```

**The difference from /inspire and /discover:**
- **/inspire**: Analyzes your global gallery, builds general taste
- **/design**: Uses YOUR specific refs for THIS project, conversational
- **/discover**: Browses collections when you DON'T have refs (fallback)

---

## Response Awareness for Design Work

During design brainstorming, tag assumptions:

- Use `#PATTERN_CONFLICT:` for competing design system approaches
- Use `#CARGO_CULT:` when following design patterns without understanding necessity
- Use `#COMPLETION_DRIVE:` for assumed user preferences without confirmation

See: `docs/RESPONSE_AWARENESS_TAGS.md` for complete tag taxonomy.
