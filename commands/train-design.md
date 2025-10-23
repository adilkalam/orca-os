---
description: Train the visual-mock-agent with your personal design preferences
allowed-tools: ["Task", "Read", "Write", "WebFetch", "TodoWrite"]
---

# Train-Design - Personal Design Language Training

Train the visual-mock-agent to understand and apply your unique design aesthetic through example-based learning.

## Training Overview

```
Collection → Analysis → Pattern Extraction → Validation → Refinement
```

## Training Protocol

### Step 1: Initial Setup

```markdown
## Create Design Memory Structure

.design-memory/
├── visual-library/
│   ├── liked/
│   └── disliked/
├── pattern-analysis/
├── design-rules/
└── design-system/

TodoWrite tasks:
- [ ] Collect 5-10 liked examples
- [ ] Collect 3-5 disliked examples
- [ ] Document explicit preferences
- [ ] Identify inspiration sources
```

### Step 2: Example Collection

```markdown
## Collecting Liked Examples

For each example you love, provide:

1. **The Visual**
   - Screenshot/image/URL
   - Full page or component
   - High quality capture

2. **The Context**
   "I love this Stripe dashboard because..."
   - What specifically appeals?
   - Which elements stand out?
   - How does it make you feel?

3. **The Use Case**
   "I'd want something like this for..."
   - When would you use this style?
   - What type of content?
   - Which users?

#ASSUMPTION_BLINDNESS check:
Don't say "it's clean" - say "the 32px padding creates breathing room"
Don't say "good colors" - say "blue used only for CTAs, not decoration"
```

### Step 3: Anti-Pattern Collection

```markdown
## Collecting Disliked Examples

For each example you dislike:

1. **Specific Issues**
   #CARGO_CULT prevention - Understand WHY

   Not: "This is cluttered"
   But: "Information density >70% feels overwhelming"

   Not: "Too colorful"
   But: "Color used for 40% of surface instead of <15%"

2. **Boundary Definition**
   "This crosses the line because..."
   - Where's the threshold?
   - What would fix it?
   - Could it work in any context?

3. **Learning Opportunity**
   What rule does this teach?
   - Maximum density threshold
   - Color usage limits
   - Spacing minimums
```

### Step 4: Pattern Extraction

```markdown
## Automated Pattern Analysis

Task visual-mock-agent:
"Analyze collected examples and extract patterns:

From liked examples, identify:
- Color relationships and usage ratios
- Spacing systems and consistency
- Typography scales and hierarchy
- Layout patterns and grids
- Information density ranges
- Visual rhythm and repetition

From disliked examples, identify:
- Violated boundaries
- Anti-patterns to avoid
- Context mismatches
- Execution issues

Generate:
- pattern-analysis/color-patterns.json
- pattern-analysis/spacing-patterns.json
- pattern-analysis/typography-patterns.json
- design-rules/learned-rules.md
- confidence-scores.json"
```

### Step 5: Rule Synthesis

```markdown
## Creating Your Design Rules

Format for extracted rules:

RULE: [Descriptive Name]
WHEN: [Context/Condition]
MUST: [Requirement]
BECAUSE: [Reasoning from examples]
EVIDENCE: [Examples supporting this]
CONFIDENCE: [0-100%]
EXCEPTIONS: [Context where it doesn't apply]

Example:
RULE: Restrained Color Usage
WHEN: Creating any interface
MUST: Use primary color for <15% of surface
BECAUSE: 9/10 liked examples show this pattern
EVIDENCE: stripe-dashboard.png, linear-app.png, notion-page.png
CONFIDENCE: 90%
EXCEPTIONS: Marketing pages can use more
```

### Step 6: Validation

```markdown
## Test Pattern Understanding

Generate test mockups:

Task visual-mock-agent:
"Create 3 test mockups for a [simple contact form]:

A. Conservative - strictly follow all high-confidence patterns
B. Balanced - mix patterns creatively within boundaries
C. Experimental - push one boundary to test understanding

Explain each design decision with:
- Which pattern applied
- Source example reference
- Confidence level
- Alternative considered"

Review and provide feedback:
- "A feels perfect, exactly my style"
- "B is good but spacing too tight"
- "C went too far with color"

This refines pattern boundaries and confidence scores.
```

## Training Commands

### Initial Training Session
```
/train-design --initial
→ Guided collection process
→ Structured example gathering
→ Pattern extraction
→ Rule generation
```

### Add Examples
```
/train-design --add-liked "url-or-path" --context "why I like this"
→ Adds to liked library
→ Updates patterns
→ Adjusts confidence
```

### Add Anti-Patterns
```
/train-design --add-disliked "url-or-path" --issue "what's wrong"
→ Adds to disliked library
→ Defines boundaries
→ Creates anti-rules
```

### Refine Patterns
```
/train-design --refine "pattern-name" --adjustment "increase spacing by 1.2x"
→ Updates specific pattern
→ Recalculates confidence
→ Documents change
```

### Show Learning
```
/train-design --show-patterns
→ Display extracted patterns
→ Show confidence levels
→ List evidence
→ Identify gaps
```

## Integration with Mockup Generation

After training, use learned patterns:

```
/generate-mockup "user dashboard"
→ Applies your learned patterns
→ Creates variations
→ Explains with evidence

/refine-mockup "increase whitespace"
→ Adjusts based on feedback
→ Updates patterns
→ Regenerates
```

## Quality Metrics

### Training Completeness

```markdown
## Minimum Training Requirements

Before generation is reliable:

**Examples:**
- [ ] At least 5 liked examples (ideally 10+)
- [ ] At least 3 disliked examples (ideally 5+)
- [ ] Covers main use cases (dashboard, forms, landing)

**Patterns:**
- [ ] Color patterns identified (confidence >70%)
- [ ] Spacing system extracted (confidence >70%)
- [ ] Typography hierarchy clear (confidence >70%)
- [ ] Layout preferences known (confidence >60%)

**Rules:**
- [ ] At least 10 learned rules
- [ ] Boundaries defined for main patterns
- [ ] Context dependencies identified

**Validation:**
- [ ] Test mockups reviewed
- [ ] Patterns refined based on feedback
- [ ] Confidence scores stabilized
```

## Continuous Learning

### Every Mockup Improves Training

```markdown
## Feedback Loop

After each generated mockup:

LOVED IT:
→ Reinforce all patterns used
→ Increase confidence scores
→ Document as successful example

NEEDS ADJUSTMENT:
→ Identify specific issue
→ Adjust relevant pattern
→ Document context

WRONG DIRECTION:
→ Mark as anti-pattern
→ Define boundary crossed
→ Request clarification
```

### Weekly Pattern Review

```markdown
## Pattern Health Check

Review weekly:
1. Low confidence patterns (<50%)
   → Need more examples

2. Contradicting patterns
   → Need context rules

3. Unused patterns
   → May be too specific

4. Frequently adjusted patterns
   → Need refinement
```

## Tips for Effective Training

### DO:
- Provide diverse examples (different contexts)
- Explain WHY you like/dislike something
- Be specific about measurements (pixels, ratios)
- Include edge cases and exceptions
- Show examples from similar contexts

### DON'T:
- Use vague feedback ("looks good")
- Provide only one type of example
- Skip the disliked examples
- Assume the agent knows generic principles
- Expect perfection immediately

## Remember

The visual-mock-agent is learning YOUR personal design language, not general design principles. The more specific and consistent your examples, the better it will understand your aesthetic.

This is a learning relationship - the agent gets better with every interaction, and you get a design partner that truly understands your vision.

#ASSUMPTION_BLINDNESS prevention: Always explain WHY, never just WHAT.