---
description: Generate design mockups using learned personal design patterns
allowed-tools: ["Task", "Read", "Write", "TodoWrite", "Grep"]
---

# Generate-Mockup - Personal Style Mockup Generation

Generate design mockups that apply your learned personal design patterns with evidence-based decisions.

## Prerequisites

Before generating mockups, ensure training is complete:
```
Check: .design-memory/pattern-analysis/patterns.json
Requirement: totalExamples >= 5 AND trainingComplete = true
```

If not trained, run: `/train-design --initial`

## Usage

```
/generate-mockup "description of what you need"

Examples:
/generate-mockup "user dashboard with metrics and recent activity"
/generate-mockup "contact form with name, email, message"
/generate-mockup "profile page with avatar, bio, and stats"
```

## Generation Process

### Step 1: Context Analysis
```markdown
## Understanding the Request

#ASSUMPTION_BLINDNESS check - What do we know?

**Explicit Requirements:**
- [What user explicitly stated]

**Implicit Needs:**
- [What's implied by the request]

**Context Questions:**
- Target audience?
- Platform (desktop/mobile/both)?
- Information priority?
- Key user actions?
- Data density preference?

[If unclear, ask for clarification before proceeding]
```

### Step 2: Pattern Selection
```markdown
## Applying Learned Patterns

Task visual-mock-agent:
"Generate mockup for: [request]

Use patterns from .design-memory/ with:
1. Context matching (dashboard/form/profile/etc)
2. Confidence threshold >= 0.7
3. Evidence trail for all decisions

Patterns to apply:
- Colors: [from patterns.json]
- Spacing: [from patterns.json]
- Typography: [from patterns.json]
- Layout: [from patterns.json based on context]

Generate 3 variations:
A. Conservative (high confidence only)
B. Balanced (creative within bounds)
C. Exploratory (push one dimension)
"
```

### Step 3: Mockup Generation
```markdown
## Three Variations Strategy

**Variation A: Conservative**
- Only high-confidence patterns (>80%)
- Most common combinations from examples
- Safe, proven approach
- "This will definitely match your style"

**Variation B: Balanced**
- Mix high and medium confidence (>60%)
- Explores within established boundaries
- Creative but grounded
- "This likely matches with some freshness"

**Variation C: Exploratory**
- Tests one boundary while keeping rest safe
- Helps refine pattern understanding
- Innovative interpretation
- "This pushes your style in one direction"

Each variation must document:
- Applied patterns with confidence
- Source examples
- Reasoning for choices
- Alternatives considered
```

### Step 4: Evidence Documentation
```markdown
## Design Decisions Documentation

For each element, provide:

**Element: [Card Component]**
- Pattern Applied: card-layout-preference (confidence: 92%)
- Decision: 24px padding, 8px border-radius, subtle shadow
- Source: example_003.png, example_005.png
- Reasoning: "User consistently uses 24-32px padding on cards"
- Alternative: Could use 32px, but 24px fits tighter spaces better
- Evidence: 7/10 dashboard examples use 24px

#FALSE_COMPLETION prevention - Every pixel justified
```

## Output Format

```markdown
# Mockup Generation: [Request]

## Context Analysis
[What we're building and why]

## Pattern Summary
[Overview of patterns being applied]

---

## Variation A: Conservative

### Visual
[ASCII art or description of layout]

```
┌─────────────────────────────────────┐
│ Header (32px padding)               │
├─────────────────────────────────────┤
│                                     │
│  Card (24px padding)                │
│  ┌────────────────────────────┐   │
│  │ Content                     │   │
│  │ (#2563EB accent <10%)      │   │
│  └────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Design Specifications

**Colors:**
- Background: #FFFFFF (from all examples)
- Surface: #F9FAFB (from example_001, 003, 005)
- Primary: #2563EB (8% of surface, from 9/10 examples)
- Text: #111827 / #6B7280 (from all examples)

**Spacing:**
- Grid: 8px base (confidence: 95%)
- Container padding: 32px (confidence: 88%)
- Card padding: 24px (confidence: 92%)
- Section spacing: 48px (confidence: 85%)

**Typography:**
- Headers: Inter 20px, weight 600 (confidence: 87%)
- Body: Inter 14px, weight 400 (confidence: 90%)
- Small: Inter 12px, weight 400 (confidence: 82%)

**Layout:**
- Type: Card-based (confidence: 92%)
- Gaps: 24px row, 24px column (confidence: 85%)
- Information density: ~45% (confidence: 80%)

### Evidence Trail
[Detailed justification for major decisions]

---

## Variation B: Balanced
[Similar structure with more creative choices]

---

## Variation C: Exploratory
[Similar structure with boundary-pushing choice]

---

## Recommendation

Based on your patterns:
- **Try first**: Variation [A/B/C] because [reasoning]
- **Safest**: Variation A (proven patterns)
- **Most like [example]**: Variation [X]

## Next Steps

1. Review variations
2. Provide feedback: `/refine-mockup [variation] [feedback]`
3. Generate code: Task frontend-engineer with chosen variation
```

## Quality Checks

Before presenting mockups:
- [ ] All patterns have confidence >= 0.6
- [ ] Every decision traces to evidence
- [ ] Variations are distinctly different
- [ ] No anti-patterns applied
- [ ] Evidence documented for major choices

## Integration with Development

### Handoff to Implementation

```markdown
After mockup approval:

Task frontend-engineer:
"Implement [chosen variation] with these specifications:

Components needed:
- [List extracted components]

Styles to apply:
- [Design tokens from mockup]

Interactions:
- [Defined interactions]

Responsive behavior:
- [Breakpoint specifications]

Base on: .design-memory/generated/mockup_[id].md
"
```

## Continuous Learning

After generation:
```markdown
## Feedback Collection

User response:
- LOVED IT → Reinforce all patterns, increase confidence
- GOOD WITH TWEAKS → Identify specific adjustments
- WRONG DIRECTION → Mark as anti-pattern, ask for guidance

Store feedback in:
.design-memory/generated/mockup_[id]_feedback.md

Update patterns.json:
- Adjust confidence scores
- Refine boundaries
- Document learning
```

## Common Scenarios

### Dashboard Mockup
```
/generate-mockup "analytics dashboard with KPI cards and charts"

→ Applies dashboard layout patterns
→ Uses card-based components
→ Implements data visualization preferences
→ Follows information density limits
```

### Form Mockup
```
/generate-mockup "user registration form"

→ Applies form layout patterns
→ Uses spacing preferences for inputs
→ Implements button styling
→ Follows error state patterns
```

### Profile Page
```
/generate-mockup "user profile with avatar and activity"

→ Applies profile layout patterns
→ Uses image treatment preferences
→ Implements list styling
→ Follows content hierarchy
```

## Remember

Generated mockups are NOT generic templates - they're YOUR design language applied systematically.

Every element, every pixel, every color choice traces back to your examples.

#CARGO_CULT prevention: Not copying trends, applying YOUR learned patterns
#FALSE_COMPLETION prevention: Evidence required for every design decision