# Agents and Teams Reference

**Complete agent hierarchy and team composition patterns for Vibe Code OS**

---

## Overview

The agent system is organized in layers:
- **Orchestrators** (3) → Own planning, synthesis, decisions
- **Planning** (2) → Requirements and architecture
- **Implementation** (20+) → Platform-specific builders
- **Quality** (6) → Verification and testing
- **Specialists** (50+) → Domain experts for specific technologies

**Total:** 80+ agents across all categories

**Key Principle:** Narrow agents with hard scopes behave predictably. Generic agents drift.

---

## Agent Hierarchy

```
┌────────────────────────────────────────────────────────────┐
│                    ORCHESTRATORS                           │
│  (Own planning, synthesis, decision-making)                │
├────────────────────────────────────────────────────────────┤
│  • engineering-director (blueprint creation)               │
│  • workflow-orchestrator (multi-phase coordination)        │
│  • meta-orchestrator (strategy selection)                  │
└────────────────────────────────────────────────────────────┘
                          │
                          │ Dispatches
                          ▼
┌────────────────────────────────────────────────────────────┐
│                    PLANNING LAYER                          │
├────────────────────────────────────────────────────────────┤
│  • requirement-analyst (elicit requirements)               │
│  • system-architect (technical design)                     │
└────────────────────────────────────────────────────────────┘
                          │
                          │ Feeds into
                          ▼
┌────────────────────────────────────────────────────────────┐
│                IMPLEMENTATION LAYER                        │
├────────────────────────────────────────────────────────────┤
│  iOS (10):                                                 │
│  • swiftui-developer                                       │
│  • swiftdata-specialist                                    │
│  • state-architect                                         │
│  • swift-testing-specialist                                │
│  • ui-testing-expert                                       │
│  • observation-specialist                                  │
│  • tca-specialist                                          │
│  • coredata-expert                                         │
│  • combine-networking                                      │
│  • urlsession-expert                                       │
│                                                            │
│  Frontend (2):                                             │
│  • react-18-specialist                                     │
│  • nextjs-14-specialist                                    │
│                                                            │
│  Backend (3):                                              │
│  • backend-engineer (Node, Go, Python)                     │
│  • infrastructure-engineer (DevOps, CI/CD)                 │
│  • ios-api-designer (mobile-optimized APIs)                │
│                                                            │
│  Mobile (2):                                               │
│  • android-engineer (Kotlin, Jetpack Compose)              │
│  • cross-platform-mobile (RN, Flutter)                     │
└────────────────────────────────────────────────────────────┘
                          │
                          │ Verifies
                          ▼
┌────────────────────────────────────────────────────────────┐
│                    QUALITY LAYER                           │
├────────────────────────────────────────────────────────────┤
│  • verification-agent (meta-tag resolution)                │
│  • test-engineer (test creation + execution)               │
│  • design-reviewer (visual verification)                   │
│  • content-awareness-validator (brand/voice)               │
│  • quality-validator (final production check)              │
│  • design-ocd-enforcer (precision validation)              │
└────────────────────────────────────────────────────────────┘
                          │
                          │ Supports
                          ▼
┌────────────────────────────────────────────────────────────┐
│                   SPECIALIST LAYER                         │
│  (Domain experts for specific needs)                       │
├────────────────────────────────────────────────────────────┤
│  Design (10):                                              │
│  • design-director                                         │
│  • design-system-architect                                 │
│  • ux-strategist                                           │
│  • creative-strategist                                     │
│  • brand-guidelines-creator                                │
│  • design-compiler                                         │
│  • design-dna-linter                                       │
│  • css-system-architect                                    │
│  • motion-director                                         │
│  • migration-specialist                                    │
│                                                            │
│  iOS Specialists (10):                                     │
│  • ios-performance-engineer                                │
│  • ios-security-tester                                     │
│  • ios-penetration-tester                                  │
│  • ios-accessibility-tester                                │
│  • ios-debugger                                            │
│  • fastlane-specialist                                     │
│  • xcode-cloud-expert                                      │
│  • swift-code-reviewer                                     │
│  • xctest-pro                                              │
│  • ios-api-designer                                        │
│                                                            │
│  Data Analysts (7):                                        │
│  • merch-lifecycle-analyst                                 │
│  • general-performance-analyst                             │
│  • ads-creative-analyst                                    │
│  • bf-sales-analyst                                        │
│  • story-synthesizer                                       │
│  • creative-strategist (overlap with design)               │
│  • mm-market-researcher                                    │
│                                                            │
│  Business Domain (5):                                      │
│  • mm-merchandising-specialist                             │
│  • mm-casting-visual-auditor                               │
│  • mm-marketplace-routing-strategist                       │
│  • mm-creative-copy-strategist                             │
│  • mm-accessories-optimizer                                │
└────────────────────────────────────────────────────────────┘
```

---

## Orchestrators (3)

### engineering-director

**Role:** Cross-stack engineering director who frames work and produces blueprint-level implementation plans.

**Responsibilities:**
- Frame multi-phase work
- Produce `.orchestration/engineering-blueprint.md`
- Define which planning agents needed
- Specify execution order and integration points

**Tools:** Read, Write, Grep, Glob, TodoWrite

**When to use:** Multi-step, cross-domain work before dispatching specialists

---

### workflow-orchestrator

**Role:** Pure orchestration coordinator for development work. NEVER implements.

**Responsibilities:**
- Coordinate multi-phase workflows
- Enforce quality gates
- Maintain user requirement integrity
- Dispatch via Task tool delegation

**Tools:** Read, Task, TodoWrite

**When to use:** Complex workflows requiring multiple coordinated phases

---

### meta-orchestrator

**Role:** Meta-learning orchestration that selects fast-path vs deep-path strategies.

**Responsibilities:**
- Learn when to apply different strategies
- Track telemetry and historical outcomes
- Optimize orchestration approach

**Tools:** All tools

**When to use:** Adaptive strategy selection based on task complexity

---

## Planning Layer (2)

### requirement-analyst

**Role:** Requirements elicitation and analysis specialist.

**Responsibilities:**
- Transform vague ideas into comprehensive specs
- Create user stories with acceptance criteria
- Clarify needs and prevent requirement drift
- Structured questioning

**Tools:** Read, Write, Glob, Grep, WebFetch, TodoWrite

**Context Recall:** Always reads CLAUDE.md first

**Output:** Structured requirements document with user stories

---

### system-architect

**Role:** System architecture specialist for technical design.

**Responsibilities:**
- Create comprehensive architectures
- Technology stack recommendations
- API specifications and data models
- Ensure scalability, security, maintainability

**Tools:** Read, Write, Glob, Grep, WebFetch, TodoWrite, sequential-thinking MCP

**Context Recall:** Always reads CLAUDE.md + project context

**Output:** Architecture document with stack decisions, API specs, data models

---

## Implementation Layer

### iOS Team (10 agents)

#### swiftui-developer
- Modern declarative UI for iOS 15+
- Swift 6.2
- SwiftUI best practices

#### swiftdata-specialist
- iOS 17+ persistence
- CloudKit sync
- Modern data layer

#### state-architect
- Modern state-first patterns (replaces MVVM)
- Swift 6.2 state management
- Observation framework integration

#### swift-testing-specialist
- Swift Testing framework (default for Swift 6.2)
- Modern test patterns
- Async testing

#### ui-testing-expert
- XCUITest framework
- Accessibility-based automation
- Screenshot testing

#### observation-specialist
- @Observable patterns
- Swift Observation framework
- State optimization

#### tca-specialist
- The Composable Architecture
- Complex app state management
- Swift 6.2 integration

#### coredata-expert
- Legacy Core Data support
- Complex models
- iOS 16 compatibility

#### combine-networking
- Reactive networking with Combine
- Complex data flows
- Publisher-based APIs

#### urlsession-expert
- REST API networking
- URLSession with async/await
- Swift 6.2 concurrency

---

### Frontend Team (10 agents)

#### react-18-specialist
- Modern React 18+ with Server Components
- Suspense, hooks mastery
- Client-side React apps

#### nextjs-14-specialist
- Next.js 14 App Router
- SSR/SSG/ISR
- Server Actions, optimization

---

### Backend Team (3 agents)

#### backend-engineer
- Node.js, Go, Python servers
- REST/GraphQL APIs
- PostgreSQL, MongoDB, Redis

#### infrastructure-engineer
- CI/CD pipelines
- Docker/Kubernetes
- AWS/GCP/Azure, monitoring

#### ios-api-designer
- Mobile-optimized API design
- Efficient data transfer
- iOS-specific considerations

---

### Mobile Team (2 agents)

#### android-engineer
- Kotlin, Jetpack Compose
- Material Design 3
- MVVM, MVI patterns

#### cross-platform-mobile
- React Native, Flutter
- Platform-specific optimizations
- Native bridges

---

## Quality Layer (6 agents)

### verification-agent

**Role:** Meta-tag resolution and evidence capture.

**Responsibilities:**
- Resolve ALL meta-cognitive tags
- Run verification commands (grep, bash)
- Capture evidence (screenshots, logs)
- Prove every claim

**Tools:** Read, Grep, Glob, Bash, TodoWrite

**When to use:** ALWAYS (GATE 1)

---

### test-engineer

**Role:** Comprehensive testing specialist.

**Responsibilities:**
- Unit, integration, E2E tests
- Security and performance testing
- High coverage test suites
- Response Awareness (prevents testing failures)

**Tools:** Read, Write, Edit, Bash, Glob, Grep, TodoWrite, Task

**When to use:** ALWAYS (GATE 2)

---

### design-reviewer

**Role:** Final quality validation and production readiness specialist.

**Responsibilities:**
- Requirements compliance check
- Code quality verification
- Test coverage analysis
- Security and performance benchmarks
- Quality scoring

**Tools:** Read, Write, Glob, Grep, Bash, Task, getDiagnostics, sequential-thinking

**When to use:** ALWAYS (GATE 5)

---

### content-awareness-validator

**Role:** Validates implementation understood user's request beyond surface-level.

**Responsibilities:**
- Content awareness check
- Audience understanding
- Purpose alignment
- Tone/brand compliance

**Tools:** Read, Write, Grep, Glob, sequential-thinking

**When to use:** Content-heavy work (GATE 0, conditional)

---

### quality-validator

**Role:** Visual verification and interaction testing.

**Responsibilities:**
- Grid compliance (4px system)
- Token-based styling verification
- Accessibility audit
- Interaction states
- Playwright MCP integration

**Tools:** Read, Grep, Glob, Edit, MultiEdit, Write, TodoWrite, Bash, Playwright MCP, chrome-devtools MCP

**When to use:** UI work (GATE 4, conditional)

---

### design-ocd-enforcer

**Role:** Polish and precision enforcer for Design-OCD standards.

**Responsibilities:**
- 4px grid compliance
- No magic numbers (token-based only)
- Interaction/motion presence
- Optical alignment heuristics

**Tools:** Read, Grep, Glob, Bash, sequential-thinking

**When to use:** Design-critical work, pre/post-implementation

---

## Specialist Layer

### Design Specialists (10 agents)

#### design-director
- Layout, hierarchy, critique
- FRAME → STRUCTURE → SURFACE scaffold
- Blueprint-first, code-second

#### creative-strategist
- Brand strategy and advertising analysis
- Performance data connection
- Psychology + market context

#### design-compiler
- Design system → code implementation
- Component generation
- Token application

#### motion-director
- Motion design orchestration
- Semantic animation classes
- Reduced-motion fallbacks

---

### iOS Specialists (10 agents)

#### ios-performance-engineer
- Performance optimization
- Instruments profiling
- Swift profiling tools

#### ios-security-tester
- Security testing and hardening
- Vulnerability assessment
- Secure coding practices

#### ios-penetration-tester
- Advanced penetration testing
- Vulnerability scanning
- Security audit

#### ios-accessibility-tester
- VoiceOver testing
- Dynamic Type support
- WCAG compliance

#### ios-debugger
- Complex debugging
- Xcode tools mastery
- Swift 6.2 debugging

#### fastlane-specialist
- Fastlane automation
- Deployment pipelines
- App Store automation

#### xcode-cloud-expert
- Xcode Cloud CI/CD
- Automated builds
- TestFlight distribution

#### swift-code-reviewer
- Code quality enforcement
- Swift 6.2 best practices
- Concurrency safety

#### xctest-pro
- XCTest framework expert
- Legacy test support
- iOS 16+ compatibility

---

### Data Analysts (7 agents)

#### merch-lifecycle-analyst
- Master product journeys
- Month-by-month tracking
- Price bands and channels
- Granular entity-level analysis

#### general-performance-analyst
- Baseline/organic performance
- Non-sale periods
- Seasonal patterns
- Steady-state operations

#### ads-creative-analyst
- Granular ad analysis
- CPM/CTR/CPC tracking
- Copy effectiveness (first 8 words)
- Timing degradation

#### bf-sales-analyst
- BFCM/sale event analysis
- Actual sales verification
- Layer onto product journeys
- Channel splits

#### story-synthesizer
- Connect all analyst findings
- Causal chains
- Actionable recommendations
- Evidence-backed claims

#### creative-strategist
- (Same as design specialist, dual role)
- Strategic analysis
- Performance data connection

#### mm-market-researcher
- Competitor research
- Prices, lookbooks, visuals
- Editorial analysis
- Story arcs

---

### Business Domain Specialists (5 agents - Marina Moscone specific)

These are highly specialized agents for specific business domains. Examples:

#### mm-merchandising-specialist
- Seasonal assortments
- Price strategies
- Shoot pre-plans

#### mm-casting-visual-auditor
- Ad/ecomm visual audits
- Invite vs intimidate calibration
- Reshoot direction

#### mm-marketplace-routing-strategist
- Per-SKU channel routing
- Break-even CVR calculations
- A/B test design

#### mm-creative-copy-strategist
- Copy variant generation
- Craft+benefit formulas
- Quiet luxury tone

#### mm-accessories-optimizer
- Accessories portfolio optimization
- Stockout loss quantification
- Detail-shot strategy

---

## Team Composition Patterns

### Minimal Team (3-5 agents)

**Use for:** Simple features, single-domain work

```
Planning:
- system-architect

Implementation:
- react-18-specialist OR swiftui-developer OR backend-engineer

Quality:
- verification-agent
- quality-validator
```

---

### Standard Team (6-10 agents)

**Use for:** Full features, moderate complexity

```
Planning:
- requirement-analyst
- system-architect

Implementation:
- swiftui-developer + swiftdata-specialist
  OR
- nextjs-14-specialist

Quality:
- test-engineer
- verification-agent
- quality-validator
```

---

### Large Team (10-15 agents)

**Use for:** Cross-domain work, high complexity

```
Planning:
- requirement-analyst
- system-architect

Implementation (parallel):
- Frontend: nextjs-14-specialist
- Backend: backend-engineer, infrastructure-engineer

Quality:
- test-engineer
- design-reviewer (if UI)
- verification-agent
- quality-validator
```

---

### Data Analysis Team (5-7 agents)

**Use for:** Business intelligence, performance analysis

```
Data Collection (parallel):
- merch-lifecycle-analyst
- general-performance-analyst OR bf-sales-analyst (not both)
- ads-creative-analyst

Synthesis (sequential after data):
- story-synthesizer

Quality:
- verification-agent
- quality-validator
```

**Note:** Use general-performance for baseline, bf-sales for BFCM/events

---

## Agent Selection Rules

### 1. Start Minimal

✓ Begin with 3-5 agents for most tasks
✓ Add specialists only when risks identified
✓ User confirms team (always)

---

### 2. Layer-Based Selection

```
Required (always):
- verification-agent
- quality-validator

Planning (if multi-step):
- requirement-analyst
- system-architect

Implementation (pick based on stack):
- iOS: swiftui-developer + specialists
- Frontend: react-18-specialist OR nextjs-14-specialist
- Backend: backend-engineer

Quality (conditional):
- test-engineer (if tests needed)
- design-reviewer (if UI work)
- content-awareness-validator (if content-heavy)
```

---

### 3. Specialist Addition Triggers

**Add iOS specialists when:**
- Complex state management → state-architect
- Performance critical → ios-performance-engineer
- Security requirements → ios-security-tester
- Legacy support → coredata-expert
- CI/CD needs → xcode-cloud-expert

**Add frontend specialists when:**
- Performance critical → frontend-performance-specialist
- Design system work → design-system-architect
- Migration work → tailwind-specialist, migration-specialist
- Motion/animation → motion-director

**Add data specialists when:**
- Product journey analysis → merch-lifecycle-analyst
- Baseline performance → general-performance-analyst
- Sale events → bf-sales-analyst
- Ad performance → ads-creative-analyst
- Strategic synthesis → story-synthesizer

---

## Common Anti-Patterns

### ❌ Too Many Agents

**Problem:** 20+ agents for simple feature
**Solution:** Start with 3-5, add only if needed

---

### ❌ Wrong Specialists

**Problem:** Using coredata-expert for new iOS 17+ app
**Solution:** Use swiftdata-specialist for modern apps

---

### ❌ Skipping Verification

**Problem:** No verification-agent in team
**Solution:** ALWAYS include verification-agent and quality-validator

---

### ❌ Both Data Analysts

**Problem:** Using both general-performance-analyst AND bf-sales-analyst
**Solution:** Use general-performance for baseline, bf-sales for events (not both)

---

## Summary

**Total Agents:** 80+
**Orchestrators:** 3
**Planning:** 2
**Implementation:** 25
**Quality:** 6
**Specialists:** 50+

**Key Principles:**
1. Narrow scopes prevent drift
2. Mandatory context recall (read CLAUDE.md first)
3. Structured output (blueprint templates)
4. Hard rules (spacing, tokens, banned patterns)
5. Layer-based selection (planning → implementation → quality)

**Team Sizes:**
- Minimal: 3-5 agents
- Standard: 6-10 agents
- Large: 10-15 agents
- Data: 5-7 agents

**Always Include:**
- verification-agent
- quality-validator

---

_Last updated: 2025-11-14_
_Update after: New agents added or team patterns change_
