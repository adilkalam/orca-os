---
description: Full spec-based development workflow with quality gates and Response Awareness
allowed-tools: ["Task", "TodoWrite", "Read", "Write", "Grep", "Glob"]
---

# Spec-Workflow - Complete Three-Phase Development Pipeline

Execute the proven spec-agent workflow with quality gates, Response Awareness, and parallel execution.

## Workflow Overview

```
Planning Phase (25%) → Quality Gate 1 (95%) →
Development Phase (60%) → Quality Gate 2 (80%) →
Validation Phase (15%) → Quality Gate 3 (85%) →
Success or Loop Back with Feedback
```

## Response Awareness Throughout

**Monitor these patterns at each phase:**
- `#COMPLETION_DRIVE` - Resist premature completion
- `#CONTEXT_ROT` - Keep phases separate
- `#ASSUMPTION_BLINDNESS` - Verify at each gate
- `#FALSE_COMPLETION` - Evidence required
- `#IMPLEMENTATION_SKEW` - Stay aligned with specs

## Phase 1: Planning & Specification (25% of time)

### Step 1.1: Requirements Analysis

```markdown
## Dispatch requirement-analyst

Task requirement-analyst:
"Analyze the request: [$ARGUMENTS]

Produce:
- requirements.md with functional/non-functional requirements
- user-stories.md with acceptance criteria
- edge-cases.md with boundary conditions
- assumptions.md listing all assumptions made

#ASSUMPTION_BLINDNESS check: List every assumption explicitly"
```

### Step 1.2: Architecture Design (Parallel)

```markdown
## Dispatch system-architect

Task system-architect:
"Design system architecture for requirements in requirements.md

Produce:
- architecture.md with system design
- api-spec.md with endpoint definitions
- data-model.md with schemas
- tech-stack.md with technology choices

#CARGO_CULT check: Justify each technology choice"
```

### Step 1.3: Task Planning (After 1.1 & 1.2)

```markdown
## Create implementation plan

Based on requirements and architecture:
- task-breakdown.md with 2-hour chunks
- dependencies.md showing task relationships
- resource-plan.md with agent assignments
- risk-assessment.md with mitigation strategies

#PREMATURE_OPTIMIZATION check: Start with MVP approach"
```

### Quality Gate 1: Planning Completeness (95% Required)

```markdown
## Planning Validation Checklist

**Requirements (must be 100% complete):**
- [ ] All user stories have acceptance criteria
- [ ] Edge cases identified and documented
- [ ] Non-functional requirements specified
- [ ] Success metrics defined

**Architecture (must be 95% complete):**
- [ ] System components defined
- [ ] APIs fully specified
- [ ] Data models complete
- [ ] Technology stack justified

**Planning (must be 90% complete):**
- [ ] Tasks broken into 2-hour chunks
- [ ] Dependencies mapped
- [ ] Risks identified with mitigations

**Score: ___/100**

If score < 95%: Loop back to Planning with specific feedback
If score ≥ 95%: Proceed to Development
```

## Phase 2: Development & Implementation (60% of time)

### Step 2.1: Parallel Development Dispatch

```markdown
## Orchestrate Implementation

**Batch 1: Independent Components (Parallel)**
#CONTEXT_ROT prevention - Each in separate context:

Task frontend-engineer:
"Implement UI based on:
- requirements.md for functionality
- api-spec.md for integration
- user-stories.md for acceptance criteria"

Task backend-engineer:
"Implement API based on:
- api-spec.md for endpoints
- data-model.md for schemas
- requirements.md for business logic"

Task test-engineer:
"Create test suite based on:
- user-stories.md for test cases
- edge-cases.md for boundary testing
- api-spec.md for integration tests"

**Batch 2: Integration (After Batch 1)**
Task infrastructure-engineer:
"Set up deployment based on:
- architecture.md for infrastructure
- tech-stack.md for services"
```

### Step 2.2: Evidence Collection

```markdown
## Development Evidence

Store in .orchestration/development/:
- code/frontend/ - UI implementation
- code/backend/ - API implementation
- tests/unit/ - Unit test results
- tests/integration/ - Integration test results
- metrics/performance/ - Performance benchmarks
- logs/build/ - Build success logs

#FALSE_COMPLETION prevention: No claims without evidence
```

### Quality Gate 2: Development Quality (80% Required)

```markdown
## Development Validation Checklist

**Code Implementation (must be 85% complete):**
- [ ] All user stories implemented
- [ ] API endpoints functional
- [ ] UI responsive and accessible
- [ ] Database operations working

**Testing (must be 80% complete):**
- [ ] Unit test coverage ≥80%
- [ ] Integration tests passing
- [ ] Edge cases handled
- [ ] Performance acceptable

**Documentation (must be 75% complete):**
- [ ] Code documented
- [ ] API documented
- [ ] Setup instructions clear

**Score: ___/100**

If score < 80%: Fix identified issues
If score ≥ 80%: Proceed to Validation
```

## Phase 3: Validation & Production Readiness (15% of time)

### Step 3.1: Quality Review

```markdown
## Dispatch quality-validator

Task quality-validator:
"Review implementation against specifications:
- Verify requirements.md satisfied
- Validate against user-stories.md
- Check architecture.md compliance
- Assess production readiness

Produce:
- review-report.md with findings
- quality-score.md with metrics
- recommendations.md with improvements"
```

### Step 3.2: Security & Performance Validation

```markdown
## Specialized Validation (Parallel)

Task test-engineer:
"Run security validation:
- Vulnerability scanning
- Penetration testing
- Dependency auditing"

Task infrastructure-engineer:
"Run performance validation:
- Load testing
- Stress testing
- Resource monitoring"
```

### Quality Gate 3: Production Readiness (85% Required)

```markdown
## Final Validation Checklist

**Functional Completeness (must be 95%):**
- [ ] All requirements implemented
- [ ] All tests passing
- [ ] No critical bugs
- [ ] Documentation complete

**Non-Functional Requirements (must be 85%):**
- [ ] Performance targets met
- [ ] Security validated
- [ ] Accessibility compliant
- [ ] Scalability confirmed

**Operational Readiness (must be 80%):**
- [ ] Monitoring configured
- [ ] Logging implemented
- [ ] Deployment automated
- [ ] Rollback plan exists

**Score: ___/100**

If score < 85%: Address critical issues
If score ≥ 85%: Ready for production
```

## Feedback Loop Implementation

### When Quality Gates Fail

```markdown
## Intelligent Feedback Loop

**Failure at Gate 1 (Planning):**
#ASSUMPTION_BLINDNESS was the cause
→ Re-dispatch requirement-analyst with:
  - Specific gaps identified
  - Assumptions to verify
  - Clarifications needed

**Failure at Gate 2 (Development):**
#IMPLEMENTATION_SKEW was the cause
→ Re-dispatch relevant engineers with:
  - Specific fixes required
  - Test failures to address
  - Performance issues to resolve

**Failure at Gate 3 (Validation):**
#FALSE_COMPLETION was the cause
→ Focus on evidence collection:
  - Missing tests to add
  - Security issues to fix
  - Documentation to complete
```

### Maximum Iterations

**Prevent infinite loops:**
- Round 1: Expected 75-85% quality
- Round 2: Expected 85-95% quality
- Round 3: Must achieve targets
- Round 4+: Escalate to user for guidance

## Success Metrics

```markdown
## Workflow Success Report

### Time Distribution
- Planning: 25% (Target: 20-25%)
- Development: 60% (Target: 60-65%)
- Validation: 15% (Target: 15-20%)

### Quality Achievements
- Gate 1 Score: 97% (Required: 95%)
- Gate 2 Score: 86% (Required: 80%)
- Gate 3 Score: 91% (Required: 85%)

### Iteration Efficiency
- Rounds Required: 2
- Feedback Incorporated: 100%
- Rework Minimized: <10%

### Evidence Collected
- Test Coverage: 87%
- Documentation: Complete
- Performance: Verified
- Security: Validated
```

## Integration with Other Commands

**Can be combined with:**
- `/enhance` - First enhance vague requests
- `/concept` - For design-heavy projects
- `/clarify` - When assumptions need checking
- `/agentfeedback` - After initial implementation

**Triggers for /spec-workflow:**
- New feature development
- Major refactoring
- Complex bug fixes
- System redesigns
- Performance overhauls

## Remember

The spec-workflow is proven to deliver:
- **95%+ quality** through gates
- **Reduced rework** through planning
- **Parallel efficiency** through orchestration
- **Evidence-based** completion
- **Continuous improvement** through feedback

Trust the process. The gates exist to ensure success, not slow progress.

#CONTEXT_ROT prevention: Each phase operates in its own context, preventing contamination.