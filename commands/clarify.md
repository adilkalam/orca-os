---
description: Quick focused clarification with metacognitive assumption checking
allowed-tools: ["Read", "Grep", "Glob", "TodoWrite"]
---

# Clarify - Metacognitive Assumption Checking

Quick, focused clarification for mid-workflow questions using Response Awareness to identify and verify assumptions.

## Core Purpose

**Stop #ASSUMPTION_BLINDNESS before it causes problems.**

When you're unsure about something, this command helps you:
1. Identify what assumptions you're making
2. Check if those assumptions are valid
3. Get clear answers before proceeding
4. Prevent cascade failures from bad assumptions

## Metacognitive Checking Process

### Step 1: Identify the Assumption

```markdown
## What I Think I Know

**Explicit Statement:**
"I believe [specific assumption] because [reasoning]"

**Confidence Level:**
- Certain (90-100%) - Based on explicit evidence
- Probable (70-89%) - Based on strong patterns
- Possible (50-69%) - Based on weak signals
- Guessing (0-49%) - No real evidence

**Source:**
- User stated explicitly
- Inferred from context
- Common pattern
- Pure assumption

#ASSUMPTION_BLINDNESS check: Is this actually true or am I assuming?
```

### Step 2: Validate the Assumption

```markdown
## Validation Approach

**Can be verified by:**
- [ ] Reading existing code/documentation
- [ ] Checking project structure
- [ ] Reviewing previous decisions
- [ ] Testing the assumption
- [ ] Asking the user directly

**Evidence that would confirm:**
- [Specific file or pattern]
- [Test result]
- [Documentation excerpt]
- [User confirmation]

**Evidence that would refute:**
- [Contradicting pattern]
- [Alternative approach]
- [Missing expected structure]
```

### Step 3: Check for Cascading Assumptions

```markdown
## Assumption Dependencies

**If this assumption is wrong, what else breaks?**

Primary Assumption: [main assumption]
├── Dependent Assumption 1
│   └── Sub-assumption 1.1
├── Dependent Assumption 2
└── Dependent Assumption 3

#IMPLEMENTATION_SKEW risk: How far will we drift if this is wrong?
```

## Common Clarification Patterns

### Technology Stack Assumptions
```
ASSUME: "This is a React project"
CHECK:
- Look for package.json
- Check for React imports
- Find .jsx/.tsx files
VERIFY: Don't assume framework from file extensions alone
```

### Architecture Assumptions
```
ASSUME: "This uses microservices"
CHECK:
- Look for service boundaries
- Check deployment configuration
- Review API structure
VERIFY: Monolith with modules ≠ microservices
```

### User Intent Assumptions
```
ASSUME: "User wants a complete rewrite"
CHECK:
- Review exact wording
- Look for qualifiers ("update", "fix", "refactor")
- Check scope indicators
VERIFY: "Improve" doesn't mean "replace everything"
```

### State Assumptions
```
ASSUME: "The database exists and has this schema"
CHECK:
- Look for migrations
- Check schema files
- Review model definitions
VERIFY: Don't assume structure from code alone
```

## Quick Clarification Checklist

**Before proceeding with any assumption:**

1. **#ASSUMPTION_BLINDNESS**
   - [ ] Have I stated the assumption explicitly?
   - [ ] Is there evidence for this assumption?
   - [ ] What's my confidence level?

2. **#CARGO_CULT**
   - [ ] Am I assuming this because it's common?
   - [ ] Does this pattern actually apply here?
   - [ ] Am I copying without understanding?

3. **#FALSE_COMPLETION**
   - [ ] Will this assumption lead to incomplete work?
   - [ ] Can I verify completion without this being true?
   - [ ] What evidence would prove this assumption?

4. **#IMPLEMENTATION_SKEW**
   - [ ] Will this assumption cause drift from requirements?
   - [ ] How can I stay aligned if I'm wrong?
   - [ ] Where are the checkpoints?

## Clarification Response Format

```markdown
## Clarification Result

### Original Uncertainty
[What you were unsure about]

### Assumptions Identified
1. [Assumption 1] - Confidence: X%
2. [Assumption 2] - Confidence: X%

### Verification Results
✅ Confirmed: [What was verified]
❌ Refuted: [What was wrong]
⚠️ Uncertain: [Still needs clarification]

### Recommendation
Based on verification:
- Proceed with: [validated approach]
- Avoid: [invalidated approach]
- Ask user about: [remaining uncertainties]

### Impact if Wrong
If assumptions prove incorrect:
- Rework needed: [scope]
- Time impact: [estimate]
- Alternative approach: [backup plan]
```

## Integration with Workflow

### When to Use /clarify

**During Planning:**
- Before making architectural decisions
- When requirements seem ambiguous
- Before choosing technology stack

**During Implementation:**
- When multiple approaches seem valid
- Before making breaking changes
- When pattern isn't clear

**During Validation:**
- When success criteria unclear
- Before marking complete
- When evidence is ambiguous

### Quick Checks vs Deep Analysis

**Use /clarify for quick checks:**
- Single assumption verification
- Binary decisions (A or B?)
- Rapid validation (<2 minutes)

**Dispatch to agents for deep analysis:**
- Multiple interconnected assumptions
- Complex architectural decisions
- Comprehensive validation needed

## Common Mistakes to Avoid

**Don't Skip Clarification Because:**
- "It's probably fine" → #FALSE_COMPLETION risk
- "This is how it's usually done" → #CARGO_CULT risk
- "I'll fix it later if wrong" → #IMPLEMENTATION_SKEW risk
- "The user would have said" → #ASSUMPTION_BLINDNESS risk

## Remember

**Every assumption is a potential bug.**

Better to spend 30 seconds clarifying than 30 minutes fixing wrong assumptions.

When in doubt, check. When confident, still check.

#ASSUMPTION_BLINDNESS is the root of most failures. This command is your defense.