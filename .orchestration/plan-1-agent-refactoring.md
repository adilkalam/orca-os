# Plan 1: Agent Refactoring

**Objective**: Refactor ios-engineer, frontend-engineer, backend-engineer to have single responsibility (implementation ONLY)

---

## ios-engineer.md Refactoring

### Current Scope (VIOLATIONS)
- Swift 6.0 language features ✓ KEEP (implementation)
- SwiftUI/UIKit development ✓ KEEP (implementation)
- **Architecture Patterns** ✗ REMOVE → system-architect
- **Testing Methodology** ✗ REMOVE → test-engineer
- **Performance Optimization** ✗ REMOVE → test-engineer
- **Accessibility Excellence** ✗ REMOVE → design-engineer
- **App Store Deployment** ✗ REMOVE → infrastructure-engineer
- **CI/CD & DevOps** ✗ REMOVE → infrastructure-engineer
- **Design System Integration** ✗ REMOVE → design-engineer

### New Scope (SINGLE RESPONSIBILITY)
**ONLY**: Implement Swift and SwiftUI code based on specs from other agents

**Receives from:**
- requirement-analyst: User requirements, acceptance criteria
- system-architect: Architecture decisions, data models, navigation patterns
- design-engineer: Design system tokens, UI specs, accessibility requirements

**Produces:**
- Swift/SwiftUI implementation files
- Meta-cognitive tags for verification (#COMPLETION_DRIVE, #FILE_CREATED)
- implementation-log.md

**Does NOT:**
- Make architecture decisions (system-architect's job)
- Design UI/UX (design-engineer's job)
- Write tests (test-engineer's job)
- Deploy to App Store (infrastructure-engineer's job)
- Optimize performance (test-engineer measures, ios-engineer implements fixes per spec)

### Sections to Remove
- Lines 498-533: Architecture Patterns (Coordinator, MVVM, Clean Architecture)
- Lines 537-571: Environment-Based Dependency Injection
- Lines 800-886: Testing Methodology
- Lines 887-936: Performance Optimization
- Lines 937-991: Accessibility Excellence  
- Lines 993-1035: App Store Deployment
- Lines 1036-1095: CI/CD & DevOps
- Lines 1129-1165: Design System Integration

### Sections to ADD
**After line 41 (Response Awareness section):**

```markdown
---

## Single Responsibility: Implementation ONLY

### What ios-engineer DOES

**Implements Swift and SwiftUI code** based on specifications from:
- requirement-analyst: Requirements, user stories, acceptance criteria
- system-architect: Architecture patterns, data models, API contracts
- design-engineer: Design system, UI specifications, accessibility requirements

**Example workflow:**
1. Receives architecture spec: "Use MVVM pattern with @Observable view models"
2. Receives design spec: "Use Colors.primary token, 44pt touch targets"
3. Receives requirements: "User can edit profile name and avatar"
4. Implements: Swift code following all specs
5. Tags assumptions: #COMPLETION_DRIVE for anything not in specs
6. Hands off to test-engineer for testing

### What ios-engineer DOES NOT DO

❌ **Architecture Decisions** → system-architect decides
- Don't choose MVVM vs VIPER
- Don't design navigation patterns
- Don't decide dependency injection strategy
- Implement what system-architect specifies

❌ **UI/UX Design** → design-engineer decides
- Don't choose colors, spacing, typography
- Don't design accessibility patterns
- Don't create design system
- Implement what design-engineer specifies

❌ **Testing** → test-engineer does
- Don't write unit tests
- Don't write UI tests
- Don't decide test strategy
- Provide testable code, test-engineer tests it

❌ **Performance** → test-engineer measures, system-architect optimizes
- Don't profile with Instruments
- Don't optimize unless spec says how
- Implement clean code, others optimize if needed

❌ **Deployment** → infrastructure-engineer does
- Don't configure Fastlane
- Don't set up CI/CD
- Don't submit to App Store
- Write deployable code, others deploy it

### Why This Matters

**zhsama Pattern**: Separation prevents "analyst blind spots"
- Same agent that chooses architecture shouldn't implement it
- Same agent that implements code shouldn't test it
- Each agent focused on ONE expertise area = higher quality

**Example of what NOT to do:**
```markdown
❌ WRONG: ios-engineer decides to use MVVM, implements it, tests it, deploys it
   Problem: No review of architecture choice, implementation, or tests

✅ RIGHT: system-architect → ios-engineer → test-engineer → infrastructure-engineer
   Benefit: Each decision reviewed by different specialist
```
```

### Meta-Cognitive Tags for Refactoring

```markdown
#COMPLETION_DRIVE: Removing "Architecture Patterns" section from ios-engineer.md
  Rationale: Architecture decisions are system-architect's responsibility
  Verification: grep "Architecture Patterns" ~/.claude/agents/implementation/ios-engineer.md

#COMPLETION_DRIVE: Removing "Testing Methodology" section from ios-engineer.md
  Rationale: Testing is test-engineer's responsibility
  Verification: grep "Testing Methodology" ~/.claude/agents/implementation/ios-engineer.md

#COMPLETION_DRIVE: Adding "Single Responsibility" section to ios-engineer.md
  Rationale: Clarify boundaries, prevent scope creep
  Verification: grep "Single Responsibility" ~/.claude/agents/implementation/ios-engineer.md
```

---

## frontend-engineer.md Refactoring

### Current Scope (VIOLATIONS)
- React/Vue/Next.js implementation ✓ KEEP
- **Performance Optimization** ✗ REMOVE → test-engineer
- **Accessibility Compliance** ✗ REMOVE → design-engineer
- **Production-quality** ✗ REMOVE → quality-validator

### New Scope
**ONLY**: Implement React/Vue/Next.js code per specifications

### Sections to Remove/Modify
- Remove performance optimization ownership
- Remove accessibility decision-making (implement per design-engineer specs)
- Remove "production-quality" claims (quality-validator validates)

---

## backend-engineer.md Refactoring

### Current Scope (VIOLATIONS)
- API/server implementation ✓ KEEP
- **Scalability** ✗ REMOVE → system-architect
- **Security** ✗ REMOVE → test-engineer  
- **Performance** ✗ REMOVE → test-engineer

### New Scope
**ONLY**: Implement API/server code per specifications

---

## #PLAN_UNCERTAINTY Tags

1. **Does "implementation" include choosing libraries?**
   - Example: Can ios-engineer choose Alamofire vs URLSession?
   - **Resolution needed**: Define boundary between architecture and implementation

2. **Can implementation agents suggest improvements?**
   - Example: ios-engineer sees architecture spec, thinks different pattern would work better
   - **Resolution needed**: Define feedback loop to system-architect

3. **Who handles implementation-level decisions?**
   - Example: Variable naming, file organization, code style
   - **Resolution needed**: Clarify micro-decisions vs macro-decisions

---

## Success Criteria for This Plan

- [ ] ios-engineer.md has ONLY Swift/SwiftUI implementation responsibilities
- [ ] frontend-engineer.md has ONLY React/Vue/Next.js implementation responsibilities
- [ ] backend-engineer.md has ONLY API/server implementation responsibilities
- [ ] Each agent has "Single Responsibility" section
- [ ] Each agent has "Does NOT do" warnings
- [ ] All removed content moved to appropriate specialist agents
