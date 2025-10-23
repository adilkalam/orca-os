---
description: Design exploration with spec-based planning and Response Awareness
allowed-tools: ["Task", "TodoWrite", "Read", "Write", "WebSearch", "WebFetch"]
---

# Concept - Design Exploration with Spec-Based Planning

Creative exploration phase for design/UX work using spec-analyst patterns and Response Awareness.

## Response Awareness for Design

Monitor these patterns during conceptualization:
- `#ASSUMPTION_BLINDNESS` - Don't assume user preferences
- `#CARGO_CULT` - Don't copy designs without understanding why
- `#FALSE_COMPLETION` - Concepts need validation, not just creation
- `#IMPLEMENTATION_SKEW` - Keep designs aligned with requirements

## Three-Phase Concept Development

### Phase 1: Discovery & Analysis (Spec-Analyst Pattern)

**1. Understand the Context**
```
#ASSUMPTION_BLINDNESS check:
- Who are the actual users?
- What problem are we solving?
- What are the constraints?
- What success looks like?
```

**2. Research & Reference Gathering**
```
Dispatch research tasks:
- Industry patterns
- Competitor analysis
- User expectations
- Accessibility requirements
```

**3. Create Concept Brief**
```markdown
## Concept Brief

### Problem Statement
[Clear problem definition]

### User Personas
#ASSUMPTION_BLINDNESS - Based on research, not assumptions:
- Primary users
- Use cases
- Pain points
- Goals

### Design Constraints
- Technical limitations
- Brand guidelines
- Accessibility requirements
- Performance targets

### Success Metrics
#FALSE_COMPLETION prevention - How we'll measure success:
- User engagement metrics
- Task completion rates
- Accessibility scores
- Performance benchmarks
```

### Phase 2: Concept Generation (Spec-Architect Pattern)

**1. Design Exploration**
```
#CARGO_CULT check - Original thinking, not copying:
- Generate 3-5 distinct concepts
- Each solving the problem differently
- Document rationale for each approach
- Consider trade-offs explicitly
```

**2. Concept Documentation**
```markdown
## Concept Options

### Concept A: [Descriptive Name]
**Approach:** [Design philosophy]
**Key Features:**
- [Feature 1 and why]
- [Feature 2 and why]

**Pros:**
- [Advantage 1]
- [Advantage 2]

**Cons:**
- [Trade-off 1]
- [Trade-off 2]

**Evidence Required:**
#FALSE_COMPLETION - What proves this works:
- User testing results
- Accessibility audit
- Performance metrics
```

**3. Pattern Extraction**
```
From research, identify:
- Successful patterns to adapt
- Failed patterns to avoid
- Innovation opportunities
- Industry standards to follow/break
```

### Phase 3: Concept Validation (Spec-Validator Pattern)

**1. Evaluation Criteria**
```
Rate each concept (0-100%):
- Solves user problem: ___%
- Technically feasible: ___%
- Meets accessibility: ___%
- Aligns with brand: ___%
- Implementation effort: ___%
```

**2. Quality Gates**
```
Concept must achieve:
- Problem-Solution Fit: ≥90%
- Technical Feasibility: ≥85%
- Accessibility: ≥95%
- User Desirability: ≥80%
```

**3. Recommendation**
```markdown
## Recommended Concept

### Selected: [Concept Name]

### Rationale
#ASSUMPTION_BLINDNESS - Evidence-based selection:
- [Research supporting this choice]
- [User feedback if available]
- [Technical validation]

### Implementation Approach
#IMPLEMENTATION_SKEW prevention - Clear guidelines:
- Design principles to follow
- Patterns to implement
- Anti-patterns to avoid

### Validation Plan
#FALSE_COMPLETION prevention - How to verify success:
- Prototype testing
- User feedback sessions
- A/B testing approach
- Success metrics
```

## Concept Workflow Integration

### Dispatch Pattern for Concepts

```
1. Research Phase:
   Task research-specialist: "Research [industry] design patterns for [use case]"
   Task requirement-analyst: "Define user requirements for [feature]"
   [Run in parallel]

2. Design Phase:
   Task design-engineer: "Create design concepts based on research"
   Task system-architect: "Validate technical feasibility"

3. Validation Phase:
   Task quality-validator: "Evaluate concepts against criteria"
   Task test-engineer: "Create prototype test plan"
```

## Common Concept Pitfalls

**#CARGO_CULT in Design:**
- "Let's do it like [Big Company]" without understanding why
- Using patterns that don't fit the context
- Copying without adaptation

**#ASSUMPTION_BLINDNESS in UX:**
- Assuming users think like designers
- Skipping user research
- Designing for yourself

**#FALSE_COMPLETION in Concepts:**
- Beautiful mockups with no validation
- Concepts without feasibility checks
- Designs without accessibility consideration

## Concept Deliverables

### Required Outputs
1. **Concept Brief** - Problem and context
2. **Research Findings** - Evidence base
3. **Concept Options** - 3-5 alternatives
4. **Evaluation Matrix** - Scored comparison
5. **Recommendation** - Selected concept with rationale
6. **Validation Plan** - How to verify success

### Quality Requirements
- Each concept must be complete (not just visual)
- Include interaction patterns
- Define error states
- Consider edge cases
- Specify responsive behavior

## Integration with Development

After concept approval:
1. Create detailed specifications
2. Break into implementable components
3. Define acceptance criteria
4. Establish testing approach
5. Set up monitoring plan

## Remember

Good concepts are:
- **Research-based** (not assumption-based)
- **Problem-focused** (not feature-focused)
- **Validated** (not just created)
- **Complete** (not just pretty)
- **Feasible** (not just innovative)

#CONTEXT_ROT prevention: Keep concepts at the right abstraction level - detailed enough to evaluate, abstract enough to allow implementation flexibility.