# Claude Vibe Code - Quick Reference

**Fast lookup for all agents, commands, teams, and workflows**

---

## 🤖 Agents (47 Total)

### Implementation Specialists

| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **frontend-engineer (DEPRECATED)** | Legacy - use Frontend specialists below | Monolithic frontend agent - replaced by 5 specialists | `agents/implementation/frontend-engineer.md` (backup) |
| **backend-engineer** | Building APIs, server logic | Node.js, Python, Go, REST/GraphQL, databases, auth | `agents/implementation/backend-engineer.md` |
| **ios-engineer (DEPRECATED)** | Legacy - use iOS specialists below | Monolithic iOS agent - replaced by 21 specialists | `agents/implementation/ios-engineer.md` (backup) |
| **android-engineer** | Building Android apps | Kotlin, Jetpack Compose, Material 3, MVVM, coroutines | `agents/implementation/android-engineer.md` |
| **cross-platform-mobile** | Multi-platform mobile | React Native, Flutter, platform optimization | `agents/implementation/cross-platform-mobile.md` |

### iOS Specialists (21 Total)

#### UI Implementation
| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **swiftui-developer** | Modern iOS 15+ apps | SwiftUI, @Observable, Swift 6.2, MainActor | `agents/ios-specialists/ui/swiftui-developer.md` |
| **uikit-specialist** | Legacy iOS or complex controls | UIKit, Auto Layout, UIKit+SwiftUI interop | `agents/ios-specialists/ui/uikit-specialist.md` |
| **ios-accessibility-tester** | Accessibility compliance | VoiceOver, WCAG 2.1 AA, Dynamic Type | `agents/ios-specialists/ui/ios-accessibility-tester.md` |

#### Data Persistence
| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **swiftdata-specialist** | iOS 17+ data persistence | SwiftData, @Model, ModelContext, @Query | `agents/ios-specialists/data/swiftdata-specialist.md` |
| **coredata-expert** | iOS 16 or complex models | Core Data, CloudKit, NSManagedObject | `agents/ios-specialists/data/coredata-expert.md` |

#### Networking
| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **urlsession-expert** | REST APIs | URLSession, async/await, Codable, auth | `agents/ios-specialists/networking/urlsession-expert.md` |
| **combine-networking** | Reactive networking | Combine, publishers, operators, real-time | `agents/ios-specialists/networking/combine-networking.md` |
| **ios-api-designer** | API design for mobile | Pagination, caching, mobile-first design | `agents/ios-specialists/networking/ios-api-designer.md` |

#### Architecture
| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **state-architect** | State-first architecture (default) | @Observable, unidirectional flow, state composition | `agents/ios-specialists/architecture/state-architect.md` |
| **tca-specialist** | Complex apps with TCA | The Composable Architecture, @Reducer | `agents/ios-specialists/architecture/tca-specialist.md` |
| **observation-specialist** | Observation optimization | @Observable internals, performance tuning | `agents/ios-specialists/architecture/observation-specialist.md` |

#### Testing
| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **swift-testing-specialist** | Modern testing (default) | Swift Testing, @Test, #expect, #require | `agents/ios-specialists/testing/swift-testing-specialist.md` |
| **xctest-pro** | Legacy XCTest support | XCTest, XCTestCase, XCTAssert family | `agents/ios-specialists/testing/xctest-pro.md` |
| **ui-testing-expert** | UI automation | XCUITest, accessibility-based testing | `agents/ios-specialists/testing/ui-testing-expert.md` |

#### Quality & Debugging
| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **swift-code-reviewer** | Code review | Swift 6.2 concurrency, code quality, best practices | `agents/ios-specialists/quality/swift-code-reviewer.md` |
| **ios-debugger** | Complex debugging | LLDB, Instruments, memory/performance debugging | `agents/ios-specialists/quality/ios-debugger.md` |

#### DevOps
| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **xcode-cloud-expert** | Xcode Cloud CI/CD | Xcode Cloud workflows, TestFlight automation | `agents/ios-specialists/devops/xcode-cloud-expert.md` |
| **fastlane-specialist** | Complex deployments | Fastlane lanes, match, gym, scan, deliver | `agents/ios-specialists/devops/fastlane-specialist.md` |

#### Performance & Security
| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **ios-performance-engineer** | Performance optimization | Instruments, profiling, optimization | `agents/ios-specialists/performance/ios-performance-engineer.md` |
| **ios-security-tester** | Security hardening | Keychain, CryptoKit, certificate pinning, biometrics | `agents/ios-specialists/security/ios-security-tester.md` |
| **ios-penetration-tester** | Advanced security audits | OWASP Mobile Top 10, reverse engineering, Frida | `agents/ios-specialists/security/ios-penetration-tester.md` |

### Frontend Specialists (5 Total)

#### Frameworks
| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **react-18-specialist** | Modern React 18+ apps | Server Components, Suspense, hooks, React Query, concurrent rendering | `agents/frontend-specialists/frameworks/react-18-specialist.md` |
| **nextjs-14-specialist** | Next.js 14 apps | App Router, SSR/SSG/ISR, Server Actions, SEO, image optimization | `agents/frontend-specialists/frameworks/nextjs-14-specialist.md` |

#### State & Performance
| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **state-management-specialist** | Complex state needs | UI/server/URL state separation, Zustand, React Query, state colocation | `agents/frontend-specialists/state/state-management-specialist.md` |
| **frontend-performance-specialist** | Performance optimization | Code splitting, memoization, virtual scrolling, Core Web Vitals, bundle analysis | `agents/frontend-specialists/performance/frontend-performance-specialist.md` |

#### Testing
| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **frontend-testing-specialist** | Frontend testing (behavior-first) | React Testing Library, Vitest, Playwright, accessibility testing, E2E | `agents/frontend-specialists/testing/frontend-testing-specialist.md` |

### Planning Specialists

| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **requirement-analyst** | Need to clarify requirements | User stories, acceptance criteria, requirements docs | `agents/planning/requirement-analyst.md` |
| **system-architect** | Need system design | Architecture, tech stacks, API specs, data models, scalability | `agents/planning/system-architect.md` |

### Quality Specialists

| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **test-engineer** | Writing tests, QA | Unit, integration, E2E, security, performance testing | `agents/quality/test-engineer.md` |
| **quality-validator** | Final verification before delivery | Requirements compliance, evidence validation, blocking gates | `agents/quality/quality-validator.md` |

### Design Specialists (8 Total)

#### Foundation
| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **design-system-architect** | Creating design systems | Reference-based taste capture, design tokens, Tailwind v4 config, OKLCH colors | `agents/design-specialists/foundation/design-system-architect.md` |
| **ux-strategist** | UX optimization, journey mapping | Flow simplification, Hick's Law, progressive disclosure, interaction design, data viz | `agents/design-specialists/foundation/ux-strategist.md` |

#### Visual
| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **visual-designer** | Visual design, mockups | Visual hierarchy, typography, color theory, layout composition, OKLCH | `agents/design-specialists/visual/visual-designer.md` |

#### Implementation
| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **tailwind-specialist** | Tailwind CSS implementation | Tailwind v4, daisyUI 5, container queries, OKLCH, mobile-first | `agents/design-specialists/implementation/tailwind-specialist.md` |
| **css-specialist** | Complex CSS (when Tailwind insufficient) | CSS Grid, animations, CSS Variables, browser compatibility | `agents/design-specialists/implementation/css-specialist.md` |
| **ui-engineer** | Component engineering | React/Vue/Angular, TypeScript, state management, performance, a11y | `agents/design-specialists/implementation/ui-engineer.md` |

#### Quality
| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **accessibility-specialist** | WCAG compliance (ALWAYS use) | WCAG 2.1 AA, keyboard nav, screen readers, contrast, touch targets | `agents/design-specialists/quality/accessibility-specialist.md` |
| **design-reviewer** | Design QA before launch (MANDATORY) | 7-phase review (OneRedOak), Playwright MCP, visual verification, evidence-based feedback | `agents/design-specialists/quality/design-reviewer.md` |

### Specialized Agents

| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **design-engineer (DEPRECATED)** | Legacy - use design specialists above | Monolithic design agent - replaced by 8 specialists | `agents/specialized/design-engineer.md` (backup) |
| **infrastructure-engineer** | DevOps, deployment | CI/CD, Docker, Kubernetes, AWS/GCP/Azure, monitoring | `agents/specialized/infrastructure-engineer.md` |

### Orchestration & Learning

| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **workflow-orchestrator** | Complex multi-phase workflows | Pure coordination, quality gates, parallel dispatch, evidence collection | `agents/orchestration/workflow-orchestrator.md` |
| **orchestration-reflector** | After /orca sessions (automatic) | Session analysis, pattern performance evaluation, new pattern discovery (ACE Reflector) | `agents/specialized/orchestration-reflector.md` |
| **playbook-curator** | After reflection (automatic) | Delta updates, apoptosis, semantic de-duplication, playbook maintenance (ACE Curator) | `agents/specialized/playbook-curator.md` |

---

## ⚡ Commands (17 Total)

### Core Orchestration

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| **/orca** | Complex multi-step tasks | Smart multi-agent orchestration with tech stack detection and team confirmation |
| **/enhance** | Vague or unclear requests | Transforms requests into well-structured prompts and executes |
| **/ultra-think** | Need deep analysis without code changes | Multi-dimensional problem analysis and reasoning |

### Design Workflow

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| **/concept** | Before building UI/UX | Creative exploration - study references, extract patterns, get approval BEFORE building |
| **/design** | Design brainstorming | Conversational design with project-specific references, establishes design system baseline |
| **/inspire** | Need design inspiration | Analyze beautiful design examples to develop aesthetic taste |
| **/save-inspiration** | Found good design example | Save to personal gallery with tags and vision analysis |
| **/visual-review** | After implementing UI | Visual QA review using chrome-devtools to screenshot and analyze |

### ACE Playbook System

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| **/playbook-review** | After /orca sessions | Manually trigger reflection and curation to update playbooks with learned patterns |
| **/playbook-pause** | Debugging or testing | Temporarily disable playbook system to run /orca without pattern influence |

### Workflow & Utilities

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| **/agentfeedback** | Providing feedback on completed work | Parses feedback and orchestrates agents to address all points systematically |
| **/clarify** | Quick mid-workflow question | Focused clarification without full orchestration |
| **/session-save** | End of session | Save current session context for automatic resumption |
| **/session-resume** | Start of session | Manually reload session context (normally auto-loads) |

---

## 🎯 Suggested Teams by Project Type

### iOS/Swift Project
**Auto-detected when:** `*.xcodeproj` or `*.xcworkspace` found

**Team Composition:** Dynamic (7-15 agents based on complexity)

#### Core Planning Agents (Always - 2):
1. requirement-analyst → Requirements analysis
2. system-architect → iOS architecture design + specialist recommendation

#### iOS Specialists (2-10 agents - chosen by system-architect):
- See "iOS Specialists (21 Total)" section above for full list
- system-architect recommends specialists based on app complexity and keywords

#### Quality Gates (Always - 2):
- verification-agent → Meta-cognitive tag verification (MANDATORY)
- quality-validator → Final validation gate (MANDATORY)

**Dynamic Team Sizing Examples:**

**Simple App (Calculator):** 7 total
- Core: requirement-analyst, system-architect (2)
- iOS: swiftui-developer, swift-testing-specialist (2)
- Quality: verification-agent, quality-validator (2)
- Optional: test-engineer for comprehensive testing (1)

**Medium App (Notes):** 9-10 total
- Core: requirement-analyst, system-architect (2)
- iOS: swiftui-developer, swiftdata-specialist, state-architect, swift-testing-specialist (4)
- Quality: test-engineer, verification-agent, quality-validator (3)

**Complex App (Social Network):** 12-14 total
- Core: requirement-analyst, system-architect (2)
- iOS: swiftui-developer, swiftdata-specialist, urlsession-expert, tca-specialist, swift-testing-specialist, ui-testing-expert, ios-performance-engineer (7+)
- Quality: test-engineer, verification-agent, quality-validator (3)

**Enterprise App (Banking):** 15+ total
- Core: requirement-analyst, system-architect (2)
- iOS: 10+ specialists including security, performance, DevOps (10+)
- Quality: test-engineer, verification-agent, quality-validator (3)

**See /orca command for full specialist selection logic**

**Cannot skip (mandatory):**
- Core planning agents (2)
- At least 1 UI specialist
- At least 1 testing specialist
- verification-agent (Response Awareness)
- quality-validator (Final gate)

**Recommended Commands:**
- /orca (complex features)
- /enhance (quick tasks)

---

### Frontend/React/Next.js Project
**Auto-detected when:** `package.json` with "react" or "next"

**Team Composition:** Dynamic (8-13 agents based on complexity)

#### Core Planning Agents (Always):
1. requirement-analyst → Requirements analysis
2. system-architect → Frontend architecture + specialist recommendation

#### Design Agents (Choose Based on Need):
3. design-system-architect → If new project or design system work
4. visual-designer → If design work needed
5. accessibility-specialist → WCAG 2.1 AA compliance (ALWAYS for production)

#### Frontend Implementation Specialists:

**Category 1: Framework (choose 1-2):**
6. react-18-specialist → React 18+ apps
7. nextjs-14-specialist → Next.js App Router apps

**Category 2: State & Performance (choose 0-2):**
8. state-management-specialist → Complex state needs
9. frontend-performance-specialist → Optimization required

**Category 3: Styling (MANDATORY - from design-specialists/):**
10. tailwind-specialist → Tailwind v4 + daisyUI 5 implementation

**Category 4: Testing (MANDATORY):**
11. frontend-testing-specialist → Behavior-first testing

#### Quality Gates (Always):
12. verification-agent → Meta-cognitive tag verification (MANDATORY)
13. quality-validator → Final validation gate (MANDATORY)

#### Example Team Compositions:

**Simple React App (8 agents):**
- Core: requirement-analyst, system-architect
- Design: accessibility-specialist
- Implementation: react-18-specialist, tailwind-specialist, frontend-testing-specialist
- Quality: verification-agent, quality-validator

**Complex React App (10 agents):**
- Add: design-system-architect, state-management-specialist

**Next.js App (9 agents):**
- Use nextjs-14-specialist (replaces react-18-specialist)

**Performance-Critical App (11 agents):**
- Add: visual-designer, frontend-performance-specialist

**When to add:**
- backend-engineer → If full-stack
- infrastructure-engineer → Deployment, SEO optimization

**Can skip (if specs exist):**
- requirement-analyst, system-architect, design specialists

**Cannot skip:**
- At least 1 framework specialist (react-18 or nextjs-14)
- tailwind-specialist (from design-specialists/)
- frontend-testing-specialist
- verification-agent, quality-validator

**See /orca command for full specialist selection logic**

**Recommended Commands:**
- /orca (full features)
- /concept (design exploration)
- /enhance (component work)

---

### Backend/Python Project
**Auto-detected when:** `requirements.txt` or `*.py` files

**Primary Team (6 agents):**
1. requirement-analyst → Requirements analysis
2. system-architect → Backend architecture (API design, database schema)
3. backend-engineer → API/server implementation ONLY
4. test-engineer → Supertest/k6 load testing
5. verification-agent → Meta-cognitive tag verification
6. quality-validator → Final validation gate

**When to add (admin UI):**
- Design specialists: ux-strategist, tailwind-specialist, ui-engineer, design-reviewer
- infrastructure-engineer → Docker, Kubernetes, cloud deployment

**Can skip (if specs exist):**
- requirement-analyst, system-architect

**Cannot skip:**
- backend-engineer, test-engineer, verification-agent, quality-validator

**Recommended Commands:**
- /orca (API development)
- /enhance (endpoint work)
- /ultra-think (performance analysis)

---

### React Native/Flutter Project
**Auto-detected when:** `package.json` with `ios/` and `android/` dirs, or `pubspec.yaml`

**Primary Team (10-13 agents):**
- Core: requirement-analyst, system-architect
- Design: ux-strategist, ui-engineer, accessibility-specialist, design-reviewer
- Implementation: cross-platform-mobile
- Quality: test-engineer, verification-agent, quality-validator

**When to add:**
- iOS specialists like swiftui-developer (iOS-specific features)
- android-engineer (Android-specific features)
- infrastructure-engineer (app store deployment)

**Recommended Commands:**
- /orca (cross-platform features)
- /concept (design exploration)
- /visual-review (multi-device verification)

---

### Unknown/General Project
**Auto-detected when:** No specific project markers found

**Primary Team:**
- system-architect (figure out the architecture)
- test-engineer (testing)
- quality-validator (verification)

**When to add:**
- Appropriate implementation specialist once project type is known

**Recommended Commands:**
- /ultra-think (understand the codebase)
- /orca (with explicit agent selection)
- /enhance (after understanding project)

---

## 🔄 Common Workflows

### Workflow 1: Add a New Feature

```
1. /orca "Add [feature name]"
   └─ Auto-detects project type
   └─ Dispatches: requirement-analyst → system-architect
   └─ Implementation agents in parallel
   └─ test-engineer writes tests
   └─ quality-validator verifies

2. Review evidence
   └─ Screenshots (UI changes)
   └─ Test output (functionality)
   └─ Build logs (compilation)

3. Done!
```

---

### Workflow 2: Fix a Bug

```
1. Describe the problem naturally
   "The login button doesn't work on mobile"

2. Auto-orchestration:
   └─ Appropriate agent investigates
   └─ Identifies root cause
   └─ Implements fix
   └─ test-engineer adds regression test
   └─ quality-validator verifies

3. Evidence provided:
   └─ Before/after screenshots
   └─ Test showing bug is fixed
```

---

### Workflow 3: Design Exploration

```
1. /concept "Dashboard with analytics"
   └─ Studies reference examples
   └─ Extracts design patterns
   └─ Brainstorms approach
   └─ Gets your approval

2. Once approved, /orca executes
   └─ Design specialists (design-system-architect, tailwind-specialist) create design system
   └─ Frontend specialists (react-18-specialist or nextjs-14-specialist) implement
   └─ test-engineer validates
   └─ quality-validator checks a11y

3. /visual-review for final check
```

---

### Workflow 4: Performance Investigation

```
1. /ultra-think "Why is the app slow?"
   └─ Deep analysis (no code changes)
   └─ Identifies bottlenecks
   └─ Provides recommendations

2. Review recommendations

3. /orca "Implement [specific optimization]"
   └─ Appropriate agents implement
   └─ test-engineer benchmarks
   └─ Evidence shows improvement
```

---

### Workflow 5: Iterative Feedback

```
1. Work gets completed

2. /agentfeedback "The spacing is too tight and colors are off"
   └─ Parses into actionable points:
      a) Increase spacing
      b) Adjust colors
   └─ Dispatches Design specialists (tailwind-specialist, design-reviewer)
   └─ Updates with evidence

3. Optionally: /agentfeedback --learn
   └─ Extracts design rules
   └─ Prevents repeated mistakes
```

---

## 🪝 Auto-Orchestration Hook

**File:** `hooks/detect-project-type.sh`

**Runs:** Every session start (< 50ms)

**Does:**
1. Checks for project markers (*.xcodeproj, package.json, requirements.txt, etc.)
2. Detects project type
3. Loads appropriate agent team
4. Sets evidence requirements
5. Writes `.claude-orchestration-context.md`

**Install:**
```bash
cp hooks/detect-project-type.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/detect-project-type.sh
```

**Configure in `.claude/settings.local.json`:**
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/detect-project-type.sh 2>/dev/null || echo '# Auto-Orchestration: Detection failed'"
          }
        ]
      }
    ]
  }
}
```

---

## 📊 Quick Decision Tree

```
Got a task?
│
├─ Is it a question? → Answer directly (no agents)
│
├─ Is it ideation/exploration?
│  └─ Use: /concept, /ultra-think, or /clarify
│
├─ Is it a code change?
│  │
│  ├─ Simple/focused?
│  │  └─ Use: /enhance (smart task execution)
│  │
│  └─ Complex/multi-step?
│     └─ Use: /orca (full orchestration)
│
└─ Is it design-related?
   ├─ Exploration: /concept
   ├─ Inspiration: /inspire or /save-inspiration
   ├─ Brainstorming: /design
   └─ Verification: /visual-review
```

---

## 💡 Pro Tips

**1. Trust Auto-Detection**
- The hook detects your project type automatically
- Loads the right agent team
- Just describe what you want

**2. Use Evidence**
- Screenshots for UI changes
- Test output for functionality
- Build logs for compilation
- No evidence = not done

**3. Leverage Parallel Execution**
- /orca dispatches multiple agents simultaneously
- 3-5x faster than sequential
- Same cost, better results

**4. Save Feedback as Rules**
- /agentfeedback --learn extracts design rules
- Prevents repeating mistakes
- Builds personal design language

**5. Browse the Repo**
- All agents in `agents/*/`
- All commands in `commands/`
- Easy to reference and edit

---

## 📁 File Locations

```
~/.claude/
├── agents/              ← Copy from repo: agents/*
├── commands/            ← Copy from repo: commands/*
├── hooks/               ← Copy from repo: hooks/*
└── settings.local.json  ← Configure hook here

claude-vibe-code/       (this repo)
├── agents/              ← All 45 agents (11 base + 21 iOS + 5 frontend + 8 design) organized by function
├── commands/            ← All 13 slash commands
├── hooks/               ← Auto-detection hook
├── skills/              ← Superpowers plugin skills
├── examples/            ← Real-world examples
└── archive/             ← Historical/deprecated files
```

---

**Need more details?** Check the full README.md or browse specific agent/command files.
