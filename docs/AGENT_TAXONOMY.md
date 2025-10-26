# Agent Taxonomy & Integration Guide

**Purpose:** Define clear boundaries between Design, Frontend, iOS, and Backend specialist categories to prevent duplicates and ensure proper integration.

**Date:** 2025-10-23
**Status:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [The 4 Specialist Categories](#the-4-specialist-categories)
3. [Category Boundaries](#category-boundaries)
4. [Integration Workflows](#integration-workflows)
5. [Decision Framework](#decision-framework)
6. [Common Patterns](#common-patterns)
7. [Anti-Patterns](#anti-patterns)
8. [FAQ](#faq)

---

## Overview

### Why We Need a Taxonomy

**The Problem:**
- 47 total agents across 5 specialist categories
- Overlapping responsibilities (styling, components, UX)
- Risk of duplicates (e.g., styling-specialist vs tailwind-specialist)
- Unclear when to use design specialists vs frontend specialists

**The Solution:**
- Clear category boundaries based on **responsibility domain**
- Integration workflows showing how specialists collaborate
- Decision framework for selecting the right specialists

---

## The 5 Specialist Categories

### 1. Design Specialists (8 Total)
**Location:** `~/.claude/agents/design-specialists/`

**Domain:** Visual design, UX, styling, design systems, components (UI implementation-agnostic)

**Responsibilities:**
- User experience and interaction design
- Visual design and aesthetics
- Design systems and component architecture
- Tailwind CSS implementation (v4 + daisyUI 5)
- CSS styling (complex animations, grid systems)
- Accessibility compliance (WCAG 2.1 AA)
- Design QA and review

**Key Specialists:**
1. **design-system-architect** - Design tokens, component architecture, reference taste capture
2. **ux-strategist** - UX flows, information architecture, interaction design
3. **visual-designer** - Visual hierarchy, typography, color theory, OKLCH
4. **tailwind-specialist** - Tailwind v4 + daisyUI 5 implementation
5. **css-specialist** - Complex CSS (Grid, animations, browser compat)
6. **ui-engineer** - Component engineering (React/Vue/Angular framework-agnostic patterns)
7. **accessibility-specialist** - WCAG 2.1 AA, keyboard nav, screen readers
8. **design-reviewer** - 7-phase design QA, visual verification (MANDATORY)

**Output:** Design specs, Figma files, Tailwind configs, component specifications, accessibility requirements

---

### 2. Frontend Specialists (5 Total)
**Location:** `~/.claude/agents/frontend-specialists/`

**Domain:** Framework-specific patterns (React/Next.js), state management, performance, testing

**Responsibilities:**
- React 18+ Server Components
- Next.js 14 App Router (SSR/SSG/ISR)
- State management (UI vs server vs URL state)
- Performance optimization (Core Web Vitals, bundle analysis)
- Frontend testing (React Testing Library, Vitest, Playwright)

**Key Specialists:**
1. **react-18-specialist** - React 18+ patterns, hooks, Server Components
2. **nextjs-14-specialist** - Next.js 14 App Router, SSR/SSG/ISR, SEO
3. **state-management-specialist** - State type separation, Zustand, React Query
4. **frontend-performance-specialist** - Code splitting, optimization, Core Web Vitals
5. **frontend-testing-specialist** - Behavior-first testing, accessibility testing

**Output:** React/Next.js code, state management logic, performance optimizations, test suites

---

### 3. iOS Specialists (21 Total)
**Location:** `~/.claude/agents/ios-specialists/`

**Domain:** iOS app development (Swift 6.2, SwiftUI, iOS frameworks)

**Responsibilities:**
- SwiftUI and UIKit development
- Swift 6.2 concurrency (@Observable, async/await, actors)
- iOS data persistence (SwiftData, Core Data)
- iOS networking (URLSession, Combine)
- iOS architecture (state-first, TCA)
- iOS testing (Swift Testing, XCTest, XCUITest)
- iOS security and performance

**Categories:**
- **UI Implementation (2):** swiftui-developer, ios-accessibility-tester
- **Data Persistence (2):** swiftdata-specialist, coredata-expert
- **Networking (3):** urlsession-expert, combine-networking, ios-api-designer
- **Architecture (3):** state-architect, tca-specialist, observation-specialist
- **Testing (3):** swift-testing-specialist, xctest-pro, ui-testing-expert
- **Quality (2):** swift-code-reviewer, ios-debugger
- **DevOps (2):** xcode-cloud-expert, fastlane-specialist
- **Performance (1):** ios-performance-engineer
- **Security (2):** ios-security-tester, ios-penetration-tester

**Output:** Swift/SwiftUI code, Xcode projects, iOS tests, CI/CD configs

---

### 4. Backend Specialists (1 Core)
**Location:** `~/.claude/agents/implementation/`

**Domain:** Server-side logic, APIs, databases

**Responsibilities:**
- REST/GraphQL API design and implementation
- Database schema and queries
- Authentication and authorization
- Server-side business logic

**Key Specialist:**
1. **backend-engineer** - Node.js, Python, Go, REST/GraphQL, databases

**Integration with Design:** Backend can add design specialists for admin UI (ux-strategist, tailwind-specialist, ui-engineer, design-reviewer)

**Output:** API code, database schemas, server configurations

---

### 5. Orchestration & Learning Specialists (2 Total)
**Location:** `~/.claude/agents/specialized/`

**Domain:** Multi-agent orchestration and self-improvement (ACE Playbook System)

**Responsibilities:**
- Post-session analysis and reflection
- Playbook maintenance and pattern curation
- Delta updates and apoptosis
- Semantic de-duplication
- Learning from orchestration outcomes

**Key Specialists:**
1. **orchestration-reflector** - Analyzes "why it worked/failed" after /orca sessions (ACE Reflector)
2. **playbook-curator** - Applies delta updates to playbooks, manages apoptosis (ACE Curator)

**Part of:** Agentic Context Engineering (ACE) three-agent architecture:
- **Generator** (/orca) - Executes tasks using playbook strategies
- **Reflector** (orchestration-reflector) - Analyzes outcomes
- **Curator** (playbook-curator) - Updates playbooks with learned patterns

**Output:** Reflection reports, updated playbooks (JSON + Markdown), signal logs

**Automatic Activation:** Triggered by `/memory` after /orca sessions

---

## Category Boundaries

### Design vs Frontend: The Key Distinction

| Aspect | Design Specialists | Frontend Specialists |
|--------|-------------------|---------------------|
| **Focus** | What it looks like, how users interact | How it's built with React/Next.js |
| **Output** | Tailwind classes, component specs, UX flows | React components, state logic, hooks |
| **Tools** | Tailwind v4, daisyUI, OKLCH, Figma | React 18, Next.js 14, Zustand, React Query |
| **Questions** | "Is this accessible?", "Does this feel right?" | "Is this performant?", "Is state managed correctly?" |
| **Examples** | Button styling, spacing system, color palette | Server Component vs Client Component, useEffect optimization |

**Rule of Thumb:**
- If it's about **visual design, UX, or styling** → Design specialists
- If it's about **React/Next.js patterns or state** → Frontend specialists

---

### Design vs iOS: Native Platform Styling

| Aspect | Design Specialists | iOS Specialists |
|--------|-------------------|-----------------|
| **Styling** | Web styling (Tailwind, CSS) | iOS styling (SwiftUI modifiers, UIKit Auto Layout) |
| **UX** | Web UX patterns | iOS-specific UX (gestures, navigation, HIG) |
| **Components** | Web components (React, daisyUI) | iOS components (SwiftUI Views, UIKit controls) |

**Rule of Thumb:**
- iOS apps **do NOT use design specialists** for styling (SwiftUI has its own styling system)
- iOS apps **may use** ux-strategist for high-level UX flows (platform-agnostic)

---

### Overlapping Responsibilities: Who Owns What?

| Responsibility | Owner | Notes |
|---------------|-------|-------|
| **Tailwind CSS** | tailwind-specialist (design) | Frontend specialists consume Tailwind classes |
| **Component Architecture** | ui-engineer (design) | Defines component patterns, frontend implements |
| **Accessibility** | accessibility-specialist (design) | Frontend/iOS implement accessibility requirements |
| **UX Flows** | ux-strategist (design) | Frontend/iOS implement flows |
| **State Management** | state-management-specialist (frontend) | Design doesn't touch state logic |
| **Performance** | frontend-performance-specialist OR ios-performance-engineer | Platform-specific |
| **Testing** | frontend-testing-specialist OR ios testing specialists | Platform-specific |

---

## Integration Workflows

### Workflow 1: Frontend + Design Integration

**Scenario:** Build a React dashboard with Tailwind styling

**Team:**
1. **requirement-analyst** → User stories
2. **system-architect** → Architecture design
3. **ux-strategist** (design) → UX flows, navigation
4. **tailwind-specialist** (design) → Tailwind config, daisyUI components
5. **ui-engineer** (design) → Component specifications
6. **react-18-specialist** (frontend) → React implementation
7. **frontend-testing-specialist** (frontend) → Tests
8. **design-reviewer** (design) → Final QA
9. **verification-agent** → Verification
10. **quality-validator** → Final gate

**Workflow:**
```
1. requirement-analyst → Creates user stories
2. system-architect → Recommends specialists
3. ux-strategist → Designs UX flows (parallel)
4. tailwind-specialist → Creates Tailwind config (parallel)
5. ui-engineer → Defines component specs (parallel)
6. react-18-specialist → Implements React components using design specs
7. frontend-testing-specialist → Writes tests
8. design-reviewer → Reviews visual quality
9. verification-agent → Verifies meta-cognitive tags
10. quality-validator → Final check
```

**Key Integration Points:**
- tailwind-specialist creates Tailwind config → react-18-specialist uses classes
- ui-engineer defines component API → react-18-specialist implements logic
- ux-strategist defines flows → react-18-specialist implements navigation

---

### Workflow 2: iOS Team (No Design Specialists for Styling)

**Scenario:** Build an iOS notes app

**Team:**
1. **requirement-analyst** → User stories
2. **system-architect** → Architecture + specialist recommendation
3. **swiftui-developer** (iOS) → SwiftUI implementation
4. **swiftdata-specialist** (iOS) → Data persistence
5. **state-architect** (iOS) → State management
6. **swift-testing-specialist** (iOS) → Tests
7. **verification-agent** → Verification
8. **quality-validator** → Final gate

**Workflow:**
```
1. requirement-analyst → Creates user stories
2. system-architect → Recommends iOS specialists
3. swiftui-developer → Designs and implements SwiftUI views (parallel)
4. swiftdata-specialist → Implements data models (parallel)
5. state-architect → Implements state-first architecture (parallel)
6. swift-testing-specialist → Writes Swift Testing tests
7. verification-agent → Verifies meta-cognitive tags
8. quality-validator → Final check
```

**Why No Design Specialists:**
- SwiftUI has built-in styling (modifiers, not CSS)
- iOS Human Interface Guidelines (HIG) define iOS UX patterns
- SwiftUI developers handle both logic and styling

**Exception:** Complex UX flows may benefit from ux-strategist (platform-agnostic UX design)

---

### Workflow 3: Backend + Admin UI

**Scenario:** Build a REST API with admin dashboard

**Team:**
1. **requirement-analyst** → User stories
2. **system-architect** → API architecture
3. **ux-strategist** (design) → Admin UX flows
4. **tailwind-specialist** (design) → Admin UI styling
5. **ui-engineer** (design) → Admin component specs
6. **backend-engineer** → API implementation
7. **design-reviewer** (design) → Admin UI QA
8. **test-engineer** → API tests
9. **verification-agent** → Verification
10. **quality-validator** → Final gate

**Workflow:**
```
1. requirement-analyst → Creates API specs + admin UI stories
2. system-architect → Recommends design specialists for admin UI
3. ux-strategist → Designs admin UX (parallel with backend)
4. backend-engineer → Implements API
5. tailwind-specialist + ui-engineer → Admin UI components
6. test-engineer → API tests + admin UI tests
7. design-reviewer → Admin UI QA
8. verification-agent → Verifies meta-cognitive tags
9. quality-validator → Final check
```

---

### Workflow 4: Mobile (React Native) + Design Integration

**Scenario:** Build a React Native cross-platform app

**Team:**
1. **requirement-analyst** → User stories
2. **system-architect** → Mobile architecture
3. **ux-strategist** (design) → Mobile UX flows
4. **ui-engineer** (design) → React Native component specs
5. **accessibility-specialist** (design) → Mobile accessibility
6. **cross-platform-mobile** → React Native implementation
7. **design-reviewer** (design) → Final QA
8. **test-engineer** → Multi-platform tests
9. **verification-agent** → Verification
10. **quality-validator** → Final gate

**Workflow:**
```
1. requirement-analyst → Creates mobile user stories
2. system-architect → Recommends specialists
3. ux-strategist → Designs mobile-first UX (parallel)
4. ui-engineer → Defines React Native component patterns (parallel)
5. cross-platform-mobile → Implements React Native components
6. test-engineer → iOS/Android tests
7. design-reviewer → Visual QA (iOS/Android screenshots)
8. verification-agent → Verifies meta-cognitive tags
9. quality-validator → Final check
```

**Design Integration:**
- ux-strategist: Mobile-first UX, gesture interactions
- ui-engineer: React Native component patterns
- accessibility-specialist: VoiceOver (iOS), TalkBack (Android)
- design-reviewer: Platform design guideline compliance

---

## Decision Framework

### When to Add Design Specialists

Use this decision tree to determine which design specialists to add:

```
Building a feature?
│
├─ Does it have a user interface?
│  ├─ Yes, it's a web app (React/Next.js)
│  │  │
│  │  ├─ New project or design system work?
│  │  │  └─ Yes → Add design-system-architect
│  │  │
│  │  ├─ Need custom visual design (not using templates)?
│  │  │  └─ Yes → Add visual-designer
│  │  │
│  │  ├─ Complex UX flows or navigation?
│  │  │  └─ Yes → Add ux-strategist
│  │  │
│  │  ├─ Need styling? (ALWAYS YES for web)
│  │  │  └─ Yes → Add tailwind-specialist (MANDATORY)
│  │  │
│  │  ├─ Complex CSS (animations, grid)?
│  │  │  └─ Yes → Add css-specialist
│  │  │
│  │  ├─ React component implementation?
│  │  │  └─ Yes → Add ui-engineer
│  │  │
│  │  ├─ Accessibility required? (ALWAYS YES for production)
│  │  │  └─ Yes → Add accessibility-specialist (MANDATORY)
│  │  │
│  │  └─ Final design QA before launch?
│  │     └─ Yes → Add design-reviewer (MANDATORY)
│  │
│  ├─ Yes, it's an iOS app (Swift/SwiftUI)
│  │  │
│  │  ├─ Complex UX flows? (platform-agnostic)
│  │  │  └─ Yes → Add ux-strategist (optional)
│  │  │
│  │  └─ DO NOT add: tailwind-specialist, css-specialist (iOS uses SwiftUI styling)
│  │
│  ├─ Yes, it's a React Native app (cross-platform)
│  │  │
│  │  ├─ Mobile-first UX design?
│  │  │  └─ Yes → Add ux-strategist
│  │  │
│  │  ├─ React Native component patterns?
│  │  │  └─ Yes → Add ui-engineer
│  │  │
│  │  ├─ Mobile accessibility?
│  │  │  └─ Yes → Add accessibility-specialist (MANDATORY)
│  │  │
│  │  └─ Platform design guideline QA?
│  │     └─ Yes → Add design-reviewer (MANDATORY)
│  │
│  └─ No UI (backend API only)
│     └─ Skip design specialists (unless building admin UI)
```

---

### When to Add Frontend Specialists

Use this decision tree for frontend specialists:

```
Building a web frontend?
│
├─ What framework?
│  ├─ React 18+ (standalone) → react-18-specialist
│  └─ Next.js 14 → nextjs-14-specialist
│
├─ Complex state management?
│  └─ Yes → Add state-management-specialist
│
├─ Performance issues or large datasets?
│  └─ Yes → Add frontend-performance-specialist
│
└─ Writing tests? (ALWAYS YES for production)
   └─ Yes → Add frontend-testing-specialist (MANDATORY)
```

---

### When to Add iOS Specialists

Use this decision tree for iOS specialists (system-architect handles this):

```
Building an iOS app?
│
├─ UI layer?
│  └─ SwiftUI (iOS 15+) → swiftui-developer
│
├─ Data persistence?
│  ├─ iOS 17+ → swiftdata-specialist
│  └─ iOS 16 or complex models → coredata-expert
│
├─ Networking?
│  ├─ REST APIs → urlsession-expert
│  ├─ Reactive patterns → combine-networking
│  └─ API design → ios-api-designer
│
├─ Architecture?
│  ├─ State-first (default) → state-architect
│  ├─ Complex apps with TCA → tca-specialist
│  └─ Observation optimization → observation-specialist
│
├─ Testing?
│  ├─ Modern testing (default) → swift-testing-specialist
│  ├─ Legacy XCTest → xctest-pro
│  └─ UI automation → ui-testing-expert
│
├─ Performance?
│  └─ Slow or optimization → ios-performance-engineer
│
├─ Security?
│  ├─ Security hardening → ios-security-tester
│  └─ Advanced audits → ios-penetration-tester
│
└─ DevOps?
   ├─ Xcode Cloud CI/CD → xcode-cloud-expert
   └─ Fastlane automation → fastlane-specialist
```

---

## Common Patterns

### Pattern 1: Web Frontend (Simple)
**Specialists:** 8-10 agents
- requirement-analyst, system-architect
- accessibility-specialist (design)
- react-18-specialist OR nextjs-14-specialist (frontend)
- tailwind-specialist (design)
- frontend-testing-specialist (frontend)
- verification-agent, quality-validator

---

### Pattern 2: Web Frontend (Complex)
**Specialists:** 12-15 agents
- requirement-analyst, system-architect
- design-system-architect, ux-strategist, visual-designer (design)
- tailwind-specialist, ui-engineer, accessibility-specialist, design-reviewer (design)
- react-18-specialist OR nextjs-14-specialist, state-management-specialist, frontend-performance-specialist, frontend-testing-specialist (frontend)
- verification-agent, quality-validator

---

### Pattern 3: iOS App (Simple)
**Specialists:** 7 agents
- requirement-analyst, system-architect
- swiftui-developer, swift-testing-specialist (iOS)
- Optional: test-engineer (if comprehensive testing needed)
- verification-agent, quality-validator

---

### Pattern 4: iOS App (Enterprise)
**Specialists:** 15+ agents
- requirement-analyst, system-architect
- swiftui-developer, swiftdata-specialist, urlsession-expert, state-architect OR tca-specialist (iOS)
- swift-testing-specialist, ui-testing-expert (iOS testing)
- ios-security-tester, ios-performance-engineer, xcode-cloud-expert (iOS DevOps/Security/Performance)
- test-engineer, verification-agent, quality-validator

---

### Pattern 5: Backend with Admin UI
**Specialists:** 10 agents
- requirement-analyst, system-architect
- ux-strategist, tailwind-specialist, ui-engineer, design-reviewer (design)
- backend-engineer
- test-engineer, verification-agent, quality-validator

---

## Anti-Patterns

### Anti-Pattern 1: Duplicate Styling Specialists ❌
**Problem:** Creating framework-specific styling specialists

**Example:**
```
❌ BAD: styling-specialist (frontend) + tailwind-specialist (design)
```

**Why It's Wrong:**
- Styling is a design responsibility, NOT a framework responsibility
- Creates duplication and confusion

**Correct Approach:**
```
✅ GOOD: tailwind-specialist (design) only
- Frontend specialists consume Tailwind classes
- Design specialists own Tailwind config and implementation
```

---

### Anti-Pattern 2: Using Design Specialists for iOS Styling ❌
**Problem:** Adding tailwind-specialist to iOS teams

**Example:**
```
❌ BAD: swiftui-developer + tailwind-specialist
```

**Why It's Wrong:**
- iOS uses SwiftUI styling (modifiers), not CSS/Tailwind
- tailwind-specialist has no iOS knowledge

**Correct Approach:**
```
✅ GOOD: swiftui-developer handles both logic and styling
- Optional: ux-strategist for high-level UX flows
- NO tailwind-specialist, css-specialist, or ui-engineer (web-specific)
```

---

### Anti-Pattern 3: Using Monolithic Agents ❌
**Problem:** Using deprecated monolithic agents instead of specialists

**Example:**
```
❌ BAD: design-engineer (deprecated) for all design work
❌ BAD: frontend-engineer (deprecated) for all frontend work
❌ BAD: ios-engineer (deprecated) for all iOS work
```

**Why It's Wrong:**
- Shallow expertise across many domains
- Outdated patterns
- No dynamic team composition

**Correct Approach:**
```
✅ GOOD: Use focused specialists
- Design: 8 specialists (design-system-architect, ux-strategist, tailwind-specialist, etc.)
- Frontend: 5 specialists (react-18, nextjs-14, state-management, performance, testing)
- iOS: 21 specialists (swiftui-developer, swiftdata-specialist, etc.)
```

---

### Anti-Pattern 4: Skipping Mandatory Specialists ❌
**Problem:** Omitting mandatory specialists to save costs

**Example:**
```
❌ BAD: Frontend team without accessibility-specialist
❌ BAD: Frontend team without design-reviewer
❌ BAD: Frontend team without frontend-testing-specialist
❌ BAD: Any team without verification-agent
```

**Why It's Wrong:**
- accessibility-specialist: Legal compliance (ADA, WCAG)
- design-reviewer: Catches visual bugs before production
- frontend-testing-specialist: Prevents functionality regressions
- verification-agent: Response Awareness requirement

**Correct Approach:**
```
✅ GOOD: Always include MANDATORY specialists
- accessibility-specialist (design) - MANDATORY for production
- design-reviewer (design) - MANDATORY for final QA
- frontend-testing-specialist (frontend) - MANDATORY for production
- verification-agent - MANDATORY for ALL teams
- quality-validator - MANDATORY for ALL teams
```

---

## FAQ

### Q1: Can I use design specialists with iOS apps?

**A:** Partially. iOS apps can use:
- ✅ **ux-strategist** - High-level UX flows (platform-agnostic)
- ❌ **tailwind-specialist** - iOS doesn't use CSS/Tailwind
- ❌ **css-specialist** - iOS doesn't use CSS
- ❌ **ui-engineer** - iOS uses SwiftUI views, not React components

iOS specialists (swiftui-developer) handle both logic and styling.

---

### Q2: Why is tailwind-specialist in design team, not frontend team?

**A:** Styling is a **design responsibility**, not a framework responsibility.

**Rationale:**
- Design owns the visual language (colors, spacing, typography)
- Design creates design tokens and Tailwind config
- Frontend consumes Tailwind classes created by design
- Prevents duplicates like styling-specialist (frontend) vs tailwind-specialist (design)

**Analogy:**
- Design = Architect (creates blueprints, defines materials)
- Frontend = Builder (constructs using blueprints and materials)

---

### Q3: When should I use ui-engineer vs react-18-specialist?

**A:**
- **ui-engineer** (design): Component architecture, component API design (framework-agnostic patterns)
- **react-18-specialist** (frontend): React-specific implementation (hooks, Server Components, React patterns)

**Example:**
```
ui-engineer defines:
- Button component should have variants: primary, secondary, ghost
- Button should support loading state
- Button should be keyboard accessible

react-18-specialist implements:
<Button variant="primary" loading={isLoading} onClick={handleClick}>
  Submit
</Button>
```

---

### Q4: Do I need both tailwind-specialist and css-specialist?

**A:** Depends on complexity.

**Simple projects:** tailwind-specialist only
- daisyUI components + utility classes handle 95% of styling

**Complex projects:** tailwind-specialist + css-specialist
- tailwind-specialist: Base styling, daisyUI, responsive
- css-specialist: Complex animations, CSS Grid, browser-specific hacks

---

### Q5: What's the difference between ux-strategist and design-system-architect?

**A:**
- **ux-strategist**: User experience flows, interaction design, information architecture
  - Answers: "How do users accomplish tasks?", "What's the navigation structure?"

- **design-system-architect**: Design tokens, component architecture, design system governance
  - Answers: "What are our spacing values?", "How do we capture reference taste?"

**Use both for:** New projects requiring both UX design and design system creation

---

### Q6: Can backend-engineer use design specialists?

**A:** Yes, for admin UI only.

**When backend builds admin UI:**
```
Add design specialists:
- ux-strategist (admin UX flows)
- tailwind-specialist (admin UI styling)
- ui-engineer (admin component patterns)
- design-reviewer (admin UI QA)
```

**When backend is API-only:**
```
Skip design specialists entirely
```

---

### Q7: How do I prevent duplicates in the future?

**A:** Follow these rules:

1. **Check existing specialists** before creating new ones
   - Search `~/.claude/agents/` for similar specialists
   - Check QUICK_REFERENCE.md agent list

2. **Respect category boundaries**
   - Design = visual, UX, styling
   - Frontend = React/Next.js patterns
   - iOS = Swift/SwiftUI
   - Backend = server-side logic

3. **Use this taxonomy document** as decision reference
   - When in doubt, check "When to Add [Category] Specialists" sections

4. **Consult AGENT_TAXONOMY.md** before creating specialists
   - This document defines canonical specialist categories

---

### Q8: What about Vue, Svelte, or Angular?

**A:** Current state:
- Frontend specialists focus on **React 18+ and Next.js 14** (most common)
- For Vue/Svelte/Angular: Use deprecated frontend-engineer (has knowledge) OR create new specialists

**Future:**
- vue-specialist, svelte-specialist, angular-specialist (based on demand)
- Would follow same pattern as react-18-specialist
- Would integrate with same design specialists (tailwind-specialist, ui-engineer, etc.)

---

## Summary

### Key Takeaways

1. **4 Specialist Categories:**
   - Design (8) - Visual, UX, styling, components
   - Frontend (5) - React/Next.js patterns, state, performance, testing
   - iOS (21) - Swift, SwiftUI, iOS frameworks
   - Backend (1) - Server-side logic, APIs

2. **Clear Boundaries:**
   - Design owns styling → tailwind-specialist (NOT frontend-specific)
   - Frontend owns framework patterns → react-18-specialist, nextjs-14-specialist
   - iOS owns native patterns → swiftui-developer (handles both logic and styling)

3. **Integration Workflows:**
   - Design specialists create specs → Frontend/iOS implement
   - Design specialists work in parallel with implementation specialists
   - MANDATORY specialists: accessibility-specialist, design-reviewer, frontend-testing-specialist, verification-agent, quality-validator

4. **Anti-Patterns to Avoid:**
   - ❌ Creating duplicate specialists (styling-specialist vs tailwind-specialist)
   - ❌ Using design specialists for iOS styling (iOS uses SwiftUI, not CSS)
   - ❌ Using monolithic agents (design-engineer, frontend-engineer, ios-engineer are DEPRECATED)
   - ❌ Skipping mandatory specialists

5. **Decision Framework:**
   - Use decision trees in this document to select specialists
   - When in doubt, consult QUICK_REFERENCE.md or this taxonomy

---

**Last Updated:** 2025-10-23
**Version:** 1.0
**Status:** Production Ready
