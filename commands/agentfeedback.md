---
description: Parse feedback and orchestrate improvements with quality gates and Response Awareness
allowed-tools: ["Task", "TodoWrite", "Read", "Write", "Grep", "Glob"]
---

# AgentFeedback - Systematic Feedback Processing with Quality Gates

Parse user feedback and orchestrate agents to address all points systematically using quality gates and Response Awareness.

## Response Awareness for Feedback

**Critical Patterns to Monitor:**
- `#COMPLETION_DRIVE` - Don't rush to mark feedback "addressed" without evidence
- `#FALSE_COMPLETION` - Verify fixes actually solve the reported issues
- `#IMPLEMENTATION_SKEW` - Stay aligned with original feedback intent
- `#ASSUMPTION_BLINDNESS` - Don't assume you understand the feedback

## Three-Phase Feedback Processing

### Phase 1: Feedback Analysis (95% Understanding Required)

**Parse and Categorize Feedback**

```markdown
## Feedback Analysis

### Raw Feedback
[User's exact feedback]

### Parsed Issues
#ASSUMPTION_BLINDNESS check - What are they actually saying?

1. **Issue Type:** [Bug/Feature/Enhancement/Style]
   **Specific Feedback:** [Exact quote]
   **Interpretation:** [What I understand]
   **Confidence:** [High/Medium/Low]
   **Evidence Needed:** [What proves it's fixed]

2. **Issue Type:** ...

### Clarifications Needed
#ASSUMPTION_BLINDNESS prevention:
- [Ambiguous point 1 - need to clarify]
- [Ambiguous point 2 - need to clarify]

### Priority Matrix
| Issue | Impact | Effort | Priority |
|-------|--------|--------|----------|
| Issue 1 | High | Low | P1 |
| Issue 2 | Medium | Medium | P2 |

### Success Criteria
#FALSE_COMPLETION prevention - How we know it's really fixed:
- [ ] Specific test that must pass
- [ ] Output that must be produced
- [ ] Behavior that must change
```

**Quality Gate 1: Understanding Verification**
- [ ] All feedback points parsed (100%)
- [ ] Interpretations validated (95%)
- [ ] Success criteria defined (100%)
- [ ] Priorities assigned (100%)

### Phase 2: Fix Implementation (80% Quality Required)

**Orchestrate Fixes Through Specialized Agents**

```markdown
## Fix Orchestration Plan

### Dispatch Strategy
#CONTEXT_ROT prevention - Use parallel execution:

**Batch 1: Independent Fixes (Parallel)**
- Task frontend-engineer: "Fix UI issue: [specific feedback]"
- Task backend-engineer: "Fix API issue: [specific feedback]"
- Task test-engineer: "Add test for: [specific case]"

**Batch 2: Dependent Fixes (Sequential)**
- After Batch 1 completes:
- Task quality-validator: "Verify all fixes against feedback"

### Evidence Collection
Store in .orchestration/feedback-fixes/:
- Before state (screenshots/logs)
- After state (screenshots/logs)
- Test results
- Performance metrics
```

**Implementation Tracking**
```markdown
## Fix Status Tracking

| Feedback Item | Assigned To | Status | Evidence |
|---------------|------------|--------|----------|
| UI alignment issue | frontend-engineer | ✅ Complete | screenshot_after.png |
| API timeout | backend-engineer | 🔄 In Progress | - |
| Missing test | test-engineer | ✅ Complete | test_results.log |
| Performance issue | infrastructure-engineer | 📋 Queued | - |

#COMPLETION_DRIVE check: Only mark complete with evidence
```

**Quality Gate 2: Implementation Verification**
- [ ] All P1 issues addressed (100%)
- [ ] All P2 issues addressed (80%)
- [ ] Evidence collected for each fix (100%)
- [ ] Tests pass for fixed issues (100%)

### Phase 3: Validation & Learning (85% Satisfaction Required)

**Comprehensive Validation**

```markdown
## Validation Report

### Fixes Completed
#FALSE_COMPLETION prevention - With evidence:

1. **Original Issue:** [Feedback quote]
   **Fix Applied:** [What was changed]
   **Evidence:** [Test result/screenshot/log]
   **Verification:** ✅ Confirmed working

### Regression Check
- [ ] Existing tests still pass
- [ ] No new issues introduced
- [ ] Performance unchanged/improved

### Learning Extraction (--learn flag)
#CARGO_CULT prevention - Understand why, not just what:

**Pattern Identified:**
- Issue Type: [Category]
- Root Cause: [Why it happened]
- Prevention: [How to avoid]

**Design Rule:**
```rule
When: [Condition]
Must: [Requirement]
Because: [Reasoning]
Example: [Code example]
```
```

**Quality Gate 3: User Satisfaction**
- [ ] All feedback points addressed (95%)
- [ ] Evidence provided for each fix (100%)
- [ ] No regressions introduced (100%)
- [ ] Learning captured if requested (100%)

## Feedback Response Format

```markdown
## Feedback Resolution Summary

### Feedback Received
[Original feedback summary]

### Actions Taken
#FALSE_COMPLETION - Each with evidence:

✅ **Fixed:** UI alignment issue
- Changed: Updated CSS grid layout
- Evidence: [screenshot comparison]
- Verified: Responsive on all breakpoints

✅ **Fixed:** API timeout
- Changed: Added connection pooling
- Evidence: Response time 200ms → 50ms
- Verified: Load test passed

⚠️ **Partial:** Complex feature request
- Implemented: Core functionality
- Pending: Advanced options
- Reason: Needs design clarification

### Quality Metrics
- Feedback Points: 12
- Addressed: 11 (91.6%)
- Verified: 11 (100% of addressed)
- Tests Added: 8
- Regressions: 0

### Learnings Applied (--learn flag)
- Created design rule: [rule_name]
- Updated checklist: [checklist_name]
- Documented pattern: [pattern_name]
```

## Orchestration Patterns for Common Feedback

### UI/UX Feedback
```
Dispatch pattern:
1. design-engineer: Analyze design feedback
2. frontend-engineer: Implement changes
3. quality-validator: Verify against design
```

### Performance Feedback
```
Dispatch pattern:
1. test-engineer: Create performance benchmarks
2. infrastructure-engineer: Optimize
3. test-engineer: Verify improvements
```

### Bug Reports
```
Dispatch pattern:
1. test-engineer: Reproduce and create failing test
2. [relevant]-engineer: Fix the bug
3. test-engineer: Verify test now passes
```

### Feature Requests
```
Dispatch pattern:
1. requirement-analyst: Clarify requirements
2. system-architect: Design approach
3. [relevant]-engineers: Implement
4. quality-validator: Verify completeness
```

## Learning Mode (--learn flag)

When --learn flag is used:

1. **Extract Patterns**
   - What type of feedback is common?
   - What mistakes keep recurring?
   - What standards need reinforcement?

2. **Create Design Rules**
   ```yaml
   rule: descriptive-name
   when: [trigger condition]
   must: [requirement]
   because: [reasoning]
   example: [code/pattern]
   ```

3. **Update Prevention Checklist**
   - Add pre-implementation checks
   - Add validation steps
   - Add testing requirements

4. **Store Learning**
   - Save to .orchestration/learnings/
   - Reference in future implementations
   - Apply in quality gates

## Common Feedback Anti-Patterns

**#COMPLETION_DRIVE:**
- Marking items "addressed" without verification
- Bulk closing issues without individual attention
- Rushing through feedback to "clear the list"

**#ASSUMPTION_BLINDNESS:**
- Misinterpreting what user meant
- Fixing the wrong thing
- Missing the underlying issue

**#FALSE_COMPLETION:**
- Claiming fixes without evidence
- Partial fixes marked as complete
- Not testing edge cases

**#IMPLEMENTATION_SKEW:**
- Fixing more/less than requested
- Adding unrequested features
- Changing unrelated code

## Remember

Feedback is a gift. Each piece of feedback is an opportunity to:
1. Improve the product
2. Learn patterns
3. Prevent future issues
4. Build user trust

Process feedback systematically, verify thoroughly, learn continuously.

Quality gates ensure we don't just handle feedback - we excel at it.