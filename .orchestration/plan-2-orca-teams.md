# Plan 2: /orca Team Composition

**Objective**: Update /orca to propose full specialized teams (6-7 agents) for each project type

---

## Current Team Compositions (WRONG)

### iOS Team (lines 124-132 in orca.md)
```markdown
- ios-engineer → Comprehensive iOS development
- quality-validator → Final verification
```
**Problems:**
- Only 2 agents (should be 6-7)
- Missing requirement-analyst, system-architect, design-engineer, test-engineer, verification-agent
- Treats ios-engineer as monolithic

### Frontend Team (lines 136-146)
```markdown
- workflow-orchestrator → Coordinates frontend work
- quality-validator → Final verification
```
**Problems:**
- Only 2 agents
- workflow-orchestrator shouldn't do implementation
- Missing all specialists

### Backend Team (lines 150-160)
```markdown
- workflow-orchestrator → Coordinates backend work
- quality-validator → Final verification
```
**Problems:**
- Only 2 agents
- Same issues as Frontend Team

---

## Correct Team Compositions (zhsama-aligned)

### 📱 iOS Team (CORRECTED)

**When to Use**: iOS/SwiftUI apps, native iOS development

**Team Composition (7 agents):**

1. **requirement-analyst** → Requirements analysis ONLY
   - Analyzes user request
   - Creates user stories with acceptance criteria
   - Defines scope and constraints
   - Hands off to: system-architect

2. **system-architect** → Architecture design ONLY
   - Designs iOS app architecture (MVVM, Clean Architecture, etc.)
   - Defines data models and navigation patterns
   - Makes tech decisions (SwiftUI vs UIKit, SwiftData vs Core Data)
   - Creates API contracts and service boundaries
   - Hands off to: design-engineer

3. **design-engineer** → UI/UX design ONLY
   - Creates design system (colors, typography, spacing)
   - Defines accessibility requirements (VoiceOver, Dynamic Type)
   - Specifies UI components and interaction patterns
   - Ensures WCAG 2.1 AA compliance
   - Hands off to: ios-engineer

4. **ios-engineer** → Swift/SwiftUI implementation ONLY
   - Implements code per architecture spec
   - Implements UI per design spec
   - Tags all assumptions with meta-cognitive tags
   - Does NOT make architecture/design/testing decisions
   - Hands off to: test-engineer

5. **test-engineer** → Testing ONLY
   - Writes unit tests (XCTest)
   - Writes UI tests (XCUITest)
   - Runs tests and reports results
   - Measures performance (Instruments)
   - Hands off to: verification-agent

6. **verification-agent** → Tag verification ONLY
   - Searches for meta-cognitive tags (#COMPLETION_DRIVE, #FILE_CREATED, etc.)
   - Runs actual verification commands (ls, grep, xcodebuild)
   - Creates verification-report.md
   - Blocks if any verification fails
   - Hands off to: quality-validator

7. **quality-validator** → Final validation ONLY
   - Reads user-request.md to verify ALL requirements met
   - Reviews verification-report.md for evidence
   - Checks all acceptance criteria
   - Blocks if <100% complete
   - Approves delivery to user

**Verification**: Simulator screenshots + build verification + tests passing

**Workflow**:
```
requirement-analyst → system-architect → design-engineer → 
ios-engineer → test-engineer → verification-agent → quality-validator
```

---

### 🎨 Frontend Team (CORRECTED)

**When to Use**: React, Next.js, Vue.js web frontends

**Team Composition (7 agents):**

1. **requirement-analyst** → Requirements ONLY
2. **system-architect** → Frontend architecture ONLY (state management, routing, etc.)
3. **design-engineer** → UI/UX design ONLY (Tailwind v4 + daisyUI 5 system)
4. **frontend-engineer** → React/Vue implementation ONLY
5. **test-engineer** → Testing ONLY (Vitest, Playwright, accessibility)
6. **verification-agent** → Tag verification ONLY
7. **quality-validator** → Final validation ONLY

**Verification**: Browser screenshots + build verification + tests passing

---

### 🐍 Backend Team (CORRECTED)

**When to Use**: APIs, server-side applications

**Team Composition (6 agents):**

1. **requirement-analyst** → Requirements ONLY
2. **system-architect** → Backend architecture ONLY (API design, database schema)
3. **backend-engineer** → API/server implementation ONLY
4. **test-engineer** → Testing ONLY (Supertest, k6 load testing)
5. **verification-agent** → Tag verification ONLY
6. **quality-validator** → Final validation ONLY

**Note**: May add design-engineer if building admin UI

**Verification**: API tests + load tests + database verification

---

### 📱 Mobile Team (CORRECTED)

**When to Use**: React Native, Flutter cross-platform

**Team Composition (7 agents):**

1. **requirement-analyst** → Requirements ONLY
2. **system-architect** → Mobile architecture ONLY
3. **design-engineer** → UI/UX design ONLY
4. **cross-platform-mobile** → React Native/Flutter implementation ONLY
5. **test-engineer** → Testing ONLY (Detox, integration_test)
6. **verification-agent** → Tag verification ONLY
7. **quality-validator** → Final validation ONLY

---

## Changes Required in orca.md

### Section: Phase 2: Agent Team Selection (lines 120-176)

**Replace entire section with corrected teams above**

**Key changes:**
1. iOS Team: 2 agents → 7 agents
2. Frontend Team: 2 agents → 7 agents
3. Backend Team: 2 agents → 6-7 agents
4. Mobile Team: 2 agents → 7 agents
5. Add workflow diagrams showing agent sequence
6. Remove "workflow-orchestrator" from team compositions (it coordinates, doesn't implement)

### Section: Phase 3: User Confirmation (lines 177-203)

**Update confirmation format:**
```markdown
Question: "I've detected an iOS/SwiftUI project. Should I proceed with the iOS Team?"

Show proposed team:
1. requirement-analyst → Requirements analysis
2. system-architect → iOS architecture design
3. design-engineer → UI/UX design & accessibility
4. ios-engineer → Swift/SwiftUI implementation
5. test-engineer → Unit/UI testing
6. verification-agent → Meta-cognitive tag verification
7. quality-validator → Final validation

Options:
1. "Yes, use full iOS Team (recommended)"
2. "Skip requirement-analyst (I have detailed requirements)"
3. "Skip design-engineer (I have design mocks)"
4. "Customize team composition"
```

**Allow skipping only when specs exist:**
- Skip requirement-analyst IF user provides detailed requirements
- Skip system-architect IF architecture already defined
- Skip design-engineer IF design system exists
- NEVER skip: implementation agent, test-engineer, verification-agent, quality-validator

---

## #PLAN_UNCERTAINTY Tags

1. **When can agents be skipped?**
   - Can user skip requirement-analyst if requirements are clear?
   - Can user skip design-engineer if using default design system?
   - **Resolution needed**: Define conditions for safe agent skipping

2. **Can agents run in parallel?**
   - Can design-engineer and system-architect work simultaneously?
   - Can test-engineer start before ios-engineer finishes?
   - **Resolution needed**: Define parallel vs sequential execution

3. **Who coordinates multi-agent workflow?**
   - Is this /orca's job or workflow-orchestrator's job?
   - **Resolution needed**: Clarify orchestration vs implementation

---

## Success Criteria for This Plan

- [ ] iOS Team lists 7 agents with single responsibilities
- [ ] Frontend Team lists 7 agents with single responsibilities
- [ ] Backend Team lists 6-7 agents with single responsibilities
- [ ] Mobile Team lists 7 agents with single responsibilities
- [ ] Each team has workflow diagram showing agent sequence
- [ ] User confirmation shows full team before proceeding
- [ ] verification-agent included in ALL team compositions
