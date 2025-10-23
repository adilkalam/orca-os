---
description: Refine generated mockups based on feedback and update learned patterns
allowed-tools: ["Task", "Read", "Write", "Edit", "TodoWrite"]
---

# Refine-Mockup - Iterative Design Refinement

Refine generated mockups based on your feedback while updating learned design patterns.

## Usage

```
/refine-mockup [mockup-id] "feedback or adjustment request"

Examples:
/refine-mockup mockup_001 "increase whitespace by 20%"
/refine-mockup mockup_002 "use more color, feels too monochrome"
/refine-mockup mockup_003 "perfect! just make the buttons slightly larger"
```

## Refinement Process

### Step 1: Feedback Analysis
```markdown
## Understanding the Feedback

#ASSUMPTION_BLINDNESS check - What are they asking for?

**Feedback Type:**
- [ ] Positive (loves it, minor tweaks)
- [ ] Adjustment (specific change needed)
- [ ] Direction (wrong approach)

**Specific Changes Requested:**
1. [Parse explicit requests]
2. [Identify implicit needs]
3. [Note what's working]

**Pattern Implications:**
- Which patterns need adjustment?
- Is this context-specific or universal?
- Does this create new rules?
```

### Step 2: Pattern Adjustment
```markdown
## Updating Learned Patterns

Based on feedback, adjust:

**If "increase whitespace":**
```json
{
  "pattern": "spacing-preference",
  "adjustment": {
    "from": { "padding": 24 },
    "to": { "padding": 32 },
    "reason": "User prefers more breathing room",
    "confidence_change": "+5%"
  },
  "scope": "context-specific|universal"
}
```

**If "too much color":**
```json
{
  "pattern": "color-usage",
  "adjustment": {
    "from": { "usage": 15% },
    "to": { "usage": 10% },
    "reason": "User prefers even more restraint",
    "confidence_change": "+8%"
  }
}
```

**If "wrong layout":**
```json
{
  "pattern": "layout-preference",
  "adjustment": {
    "from": "sidebar",
    "to": "top-nav",
    "reason": "User prefers horizontal navigation",
    "context": "dashboard",
    "create_context_rule": true
  }
}
```
```

### Step 3: Regeneration
```markdown
## Apply Adjustments

Task visual-mock-agent:
"Refine mockup_[id] with these changes:

Original Feedback: [user's exact words]

Pattern Adjustments:
- [Specific pattern changes from analysis]

Maintain:
- [Elements that worked well]
- [Patterns to keep unchanged]

Generate:
- Updated mockup applying adjustments
- Explanation of changes
- Updated confidence scores
- Learning captured

#IMPLEMENTATION_SKEW prevention - Stay aligned with feedback"
```

### Step 4: Learning Capture
```markdown
## Update Pattern Database

1. **Modify patterns.json:**
   - Adjust confidence scores
   - Update pattern values
   - Add context rules if needed
   - Document change history

2. **Create/Update Rule:**
   ```markdown
   RULE: Generous Whitespace Preference
   WHEN: Creating any card-based layout
   MUST: Use minimum 32px padding (updated from 24px)
   BECAUSE: User feedback: "increase whitespace by 20%"
   EVIDENCE: mockup_001 adjustment, mockup_003 feedback
   CONFIDENCE: 88% (increased from 82%)
   UPDATED: 2025-01-15
   ```

3. **Store Feedback:**
   ```markdown
   File: .design-memory/generated/mockup_001_feedback.md

   ## Feedback Received
   "Increase whitespace by 20%"

   ## Interpretation
   User prefers more breathing room than originally learned

   ## Changes Applied
   - Padding: 24px → 32px
   - Section spacing: 48px → 64px
   - Card gaps: 16px → 24px

   ## Pattern Updates
   - spacing-preference confidence: 82% → 88%
   - Minimum padding rule updated

   ## Result
   User satisfaction: [pending|satisfied|needs more]
   ```
```

## Feedback Types & Responses

### Positive Feedback ("Perfect!")
```markdown
Response:
1. Reinforce ALL patterns used
2. Increase confidence scores (+5-10%)
3. Mark mockup as successful example
4. Add to visual-library/generated/ as reference

Task visual-mock-agent:
"Reinforce patterns from mockup_[id]:
- Mark as successful application
- Increase confidence for all patterns used
- Use as future reference example"
```

### Adjustment Feedback ("Change X")
```markdown
Response:
1. Parse specific change requested
2. Identify affected pattern(s)
3. Apply adjustment with multiplier
4. Regenerate with explanation
5. Update pattern confidence

If "increase whitespace by 20%":
- Multiply spacing values by 1.2
- Regenerate mockup
- Update spacing pattern
- Show before/after comparison
```

### Direction Feedback ("Wrong approach")
```markdown
Response:
1. Identify which pattern(s) failed
2. Mark as anti-pattern or context-specific
3. Request clarification on preferred direction
4. Regenerate from different angle

#CARGO_CULT check - Don't assume, ask:
"I applied [pattern X] based on [evidence Y].
 What would better match your vision for this?"
```

## Output Format

```markdown
# Refinement: mockup_[id]

## Original Feedback
"[User's exact feedback]"

## Interpretation
#ASSUMPTION_BLINDNESS check performed:
- What user explicitly said: [parse]
- What this implies: [infer]
- Confidence in interpretation: [high|medium|low]
- [If low] Questions for clarification: [list]

## Changes Applied

### Pattern Adjustments
| Pattern | Before | After | Reason |
|---------|--------|-------|--------|
| Padding | 24px | 32px | User requested 20% more whitespace |
| Color usage | 12% | 8% | User felt it was too prominent |
| Typography scale | [16,20,24] | [14,18,24] | User preferred smaller body text |

### Confidence Updates
- spacing-preference: 82% → 88% (+6%)
- color-restraint: 85% → 92% (+7%)
- typography-scale: 78% → 75% (-3% due to contradiction)

## Refined Mockup

### Visual
[Updated ASCII or description]

### Specifications
[Updated design specs]

### What Changed
1. **Spacing**: Increased all padding by 20%
2. **Color**: Reduced primary color to 8% of surface
3. **Typography**: Slightly reduced body text size

### What Stayed
1. **Layout**: Card-based approach maintained
2. **Color palette**: Same colors, just less usage
3. **Grid system**: 8px base grid unchanged

## Evidence Trail

**Why these changes:**
- Padding increase: User feedback + similar adjustment in mockup_003
- Color reduction: Aligns with 9/10 original examples showing <10% usage
- Body text: Exploring boundary, can revert if too small

## Learning Captured

**New/Updated Rules:**
1. Minimum padding: 24px → 32px for cards
2. Maximum color usage: 15% → 10% for primary
3. Body text range: 14-16px (context-dependent)

**Pattern Confidence:**
- Strengthened: whitespace-preference, color-restraint
- Weakened: typography-size (contradiction detected)
- New: context-specific-spacing (cards need more than forms)

## Validation

Please review and provide feedback:
- ✅ "Perfect now!" → Will reinforce all changes
- ↗️ "Better, but..." → Will continue refining
- ↩️ "Went too far" → Will dial back changes

## Next Steps

1. Review refined mockup
2. Provide additional feedback if needed
3. When satisfied: Task frontend-engineer for implementation
4. Pattern updates already saved to .design-memory/
```

## Iterative Refinement

### Maximum Iterations

```markdown
Refinement rounds:
- Round 1: Initial generation
- Round 2: First refinement (current)
- Round 3: Second refinement
- Round 4+: Flag for deeper discussion

If >= 4 rounds:
"We've refined this multiple times. Let's step back:
 - What's the core issue?
 - Should we start fresh with different patterns?
 - Do we need to adjust training examples?"
```

### Convergence Detection

```markdown
If feedback patterns repeat:
"I notice you've asked for more whitespace twice.
 Should I update my baseline preference?

 Current: 24px padding minimum
 Proposed: 32px padding minimum

 This would affect all future mockups."
```

## Learning From Corrections

### Pattern Refinement

```typescript
interface PatternCorrection {
  mockupId: string;
  pattern: string;
  feedback: string;
  before: any;
  after: any;
  confidenceDelta: number;
  universal: boolean;  // Apply to all contexts?
  contextSpecific: string[];  // Or just these contexts?
}

// Example correction
{
  mockupId: "mockup_003",
  pattern: "spacing-preference",
  feedback: "increase whitespace by 20%",
  before: { padding: 24 },
  after: { padding: 32 },
  confidenceDelta: +6,
  universal: false,
  contextSpecific: ["dashboard", "profile"]
}
```

### Contradiction Resolution

```markdown
If feedback contradicts previous patterns:

"I notice a potential contradiction:

 Previous learning (example_001): 24px padding preferred
 Current feedback: 32px padding preferred

 Options:
 A. Update universal preference to 32px
 B. Create context rule (dashboards use 32px, forms use 24px)
 C. This was an exception for this specific mockup

 Which best matches your intent?"
```

## Integration with Training

### Feedback as Training Data

```markdown
Every refinement improves future generations:

1. **Successful refinements** → Strengthen patterns
2. **Repeated adjustments** → Update baselines
3. **Context-specific changes** → Create rules
4. **Contradictions** → Flag for clarification

Stored in:
.design-memory/pattern-analysis/refinement-history.json
```

## Remember

Refinement isn't failure - it's learning. Each adjustment makes the agent understand your taste better.

The goal is convergence: fewer refinements needed over time as patterns stabilize.

#FALSE_COMPLETION prevention: Don't claim "perfect" until user confirms
#IMPLEMENTATION_SKEW prevention: Apply only requested changes, don't drift