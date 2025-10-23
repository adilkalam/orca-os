---
description: Transform vague requests into well-structured implementations with Response Awareness
allowed-tools: ["Task", "TodoWrite", "Read", "Write", "Edit", "Grep", "Glob"]
---

# Enhance - Intelligent Request Enhancement with Response Awareness

Transform vague or incomplete requests into well-structured, implementable specifications using Response Awareness patterns.

## Response Awareness Integration

Before enhancing any request, check for these patterns:

**Metacognitive Checks:**
- `#ASSUMPTION_BLINDNESS` - What assumptions am I making about this request?
- `#CARGO_CULT` - Am I applying patterns just because they're common?
- `#PREMATURE_OPTIMIZATION` - Am I adding unnecessary complexity?
- `#TOOL_OBSESSION` - Am I suggesting complex tools when simple ones suffice?

## Enhancement Process

### Step 1: Analyze Request (with #ASSUMPTION_BLINDNESS check)
```
Before assuming what the user wants:
1. Identify explicit requirements
2. List implicit assumptions
3. Note ambiguities that need clarification
4. Check for missing context
```

### Step 2: Clarify Intent (with #COMPLETION_DRIVE resistance)
```
Don't rush to implement. First ensure understanding:
1. What problem is being solved?
2. Who are the users?
3. What are the success criteria?
4. What are the constraints?
```

### Step 3: Structure Enhancement

**Transform vague request into:**

```markdown
## Enhanced Specification

### Original Request
[User's original request verbatim]

### Clarified Intent
#ASSUMPTION_BLINDNESS check - These assumptions need verification:
- [List all assumptions being made]
- [Identify what needs user confirmation]

### Requirements Breakdown
#CARGO_CULT check - Using patterns because they fit, not because they're trendy:

#### Functional Requirements
1. [Specific, measurable requirement]
2. [Include acceptance criteria]
3. [Define edge cases]

#### Non-Functional Requirements
1. Performance targets
2. Security requirements
3. Accessibility standards

### Technical Approach
#PREMATURE_OPTIMIZATION check - Starting simple:
1. MVP first approach
2. Iterative enhancement
3. Avoid over-engineering

### Implementation Plan
#TOOL_OBSESSION check - Using appropriate tools:
- Simple solutions where possible
- Complex tools only when necessary
- Clear justification for each choice

### Quality Criteria
#FALSE_COMPLETION prevention - Evidence required:
- Specific test cases
- Measurable outcomes
- Verification methods

### Risk Assessment
#IMPLEMENTATION_SKEW prevention:
- Potential drift points
- Mitigation strategies
- Checkpoints for alignment
```

## Enhancement Patterns

### For Feature Requests
```
Original: "Add a search feature"

Enhanced:
- Search scope (what's searchable?)
- Search algorithm (fuzzy? exact?)
- Performance requirements (<200ms?)
- Result presentation (pagination? filters?)
- Edge cases (empty results? special characters?)
```

### For Bug Reports
```
Original: "The app crashes sometimes"

Enhanced:
- Reproduction steps
- Environment details
- Expected vs actual behavior
- Error messages/logs
- Frequency and impact
```

### For Performance Issues
```
Original: "Make it faster"

Enhanced:
- Current performance metrics
- Target performance goals
- Bottleneck identification
- Optimization priorities
- Measurement methods
```

## Multi-Phase Enhancement

### Phase 1: Requirement Enhancement
Dispatch to requirement-analyst:
- Elicit hidden requirements
- Create user stories
- Define acceptance criteria

### Phase 2: Technical Enhancement
Dispatch to system-architect:
- Design technical approach
- Identify components
- Define interfaces

### Phase 3: Implementation Enhancement
Create detailed specifications for:
- Frontend components
- Backend services
- Database schemas
- API contracts

## Quality Gates for Enhancement

**Enhancement Completeness (Must achieve 95%):**
- [ ] All assumptions explicitly stated
- [ ] Success criteria defined
- [ ] Edge cases identified
- [ ] Technical approach clear
- [ ] Risks assessed
- [ ] Evidence requirements specified

## Common Enhancement Mistakes to Avoid

**#ASSUMPTION_BLINDNESS:**
- Don't assume technology stack
- Don't assume user expertise
- Don't assume scope

**#CARGO_CULT:**
- Don't add microservices because it's trendy
- Don't use complex patterns for simple problems
- Don't copy solutions without understanding context

**#PREMATURE_OPTIMIZATION:**
- Start with working solution
- Optimize based on actual metrics
- Don't guess performance bottlenecks

## Output Format

Enhanced specifications should be:
1. **Clear** - No ambiguity
2. **Complete** - All aspects covered
3. **Testable** - Verifiable outcomes
4. **Prioritized** - MVP vs nice-to-have
5. **Evidenced** - Proof requirements defined

## Remember

Enhancement is about clarity and completeness, not complexity. Simple, clear specifications lead to better implementations than complex, ambiguous ones.

#CONTEXT_ROT prevention: Keep specifications separate from implementation details.