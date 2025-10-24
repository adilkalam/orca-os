---
description: Quick focused clarification for mid-workflow questions without interrupting agent orchestration
allowed-tools: [AskUserQuestion, Read]
argument-hint: <what needs clarification>
---

# /clarify - Quick Mid-Workflow Clarification

**PURPOSE**: Get a quick, focused answer to a specific question WITHOUT hijacking the current workflow.

**DO NOT**:
- Explore alternatives (that's brainstorming)
- Challenge assumptions (that's brainstorming)
- Refine the entire concept (that's brainstorming)
- Take over the workflow

**DO**:
- Ask ONE focused question
- Present clear options if applicable
- Get the answer
- Return to work IMMEDIATELY

---

## What Needs Clarification?

**User's question:** $ARGUMENTS

## Quick Analysis

Read the question and determine:
1. What specifically is unclear?
2. What are the likely options?
3. Can this be answered with a simple choice?

## Present Options

Use AskUserQuestion with:
- **Question**: Rephrase user's clarification need clearly
- **Header**: Short label (max 12 chars)
- **Options**: 2-4 clear choices
- **MultiSelect**: Only if multiple options can be chosen

**Example patterns:**

**Which reference doc?**
```javascript
AskUserQuestion({
  questions: [{
    question: "Which document should we use as the source of truth?",
    header: "Reference",
    multiSelect: false,
    options: [
      {label: "CLAUDE.md", description: "Project-specific rules"},
      {label: "Design System", description: "OBDN Design System v3.0"},
      {label: "API Docs", description: "Backend API specification"}
    ]
  }]
})
```

**Which approach for implementation?**
```javascript
AskUserQuestion({
  questions: [{
    question: "Which implementation approach should we use?",
    header: "Approach",
    multiSelect: false,
    options: [
      {label: "Option A", description: "Faster but less flexible"},
      {label: "Option B", description: "More robust but takes longer"},
      {label: "Hybrid", description: "Combine both approaches"}
    ]
  }]
})
```

**Which agents should handle this?**
```javascript
AskUserQuestion({
  questions: [{
    question: "Which platform are we building for?",
    header: "Platform",
    multiSelect: false,
    options: [
      {label: "Web Frontend", description: "React/Next.js with design specialists (tailwind-specialist, ui-engineer, design-reviewer)"},
      {label: "iOS Native", description: "iOS specialists (swiftui-developer, swiftdata-specialist, swift-testing-specialist)"},
      {label: "React Native", description: "Cross-platform with design specialists (ux-strategist, ui-engineer, accessibility-specialist)"}
    ]
  }]
})
```

**What features are in scope?**
```javascript
AskUserQuestion({
  questions: [{
    question: "Which features should we include in this release?",
    header: "Features",
    multiSelect: true,  // Allow multiple selections
    options: [
      {label: "Authentication", description: "User login/signup"},
      {label: "Payment", description: "Stripe integration"},
      {label: "Analytics", description: "Usage tracking"},
      {label: "Notifications", description: "Push notifications"}
    ]
  }]
})
```

## After Getting Answer

1. Acknowledge the answer briefly
2. State how this clarification affects the current work
3. **Continue with the original agent orchestration** - don't restart from scratch

**Example:**
```
✅ Got it - we'll use the OBDN Design System v3.0 as reference.

This means the design specialists (tailwind-specialist, ui-engineer) will apply
the existing spacing and typography rules rather than creating new ones.

Continuing with agent orchestration...
```

## Important Rules

**This is NOT brainstorming:**
- Don't ask "why" repeatedly
- Don't explore alternatives the user didn't ask about
- Don't challenge the premise
- Don't turn one question into a full design session

**This IS clarification:**
- One focused question
- Clear options
- Quick answer
- Back to work

**When to use /clarify vs brainstorming:**
- `/clarify` → Mid-workflow, specific question, agent work in progress
- `brainstorming` → New project, concept undefined, need to explore alternatives

---

## Summary

1. Read what needs clarification
2. Create focused AskUserQuestion with 2-4 clear options
3. Get answer
4. State how it affects current work
5. **Continue with existing agent orchestration**

The goal is speed and focus - not exploration.

---

**Response Awareness**: For implementation workflows, see `docs/RESPONSE_AWARENESS_TAGS.md` for meta-cognitive tag system used by verification-agent and quality-validator.
