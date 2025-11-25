# OS 2.2 Agents Quick Reference

**Last Updated:** 2025-11-24
**Version:** OS 2.2 (v2.2)

---

## What's New in OS 2.2

**Agent Architecture Changes:**
- ✅ **Grand Architect Pattern** - Opus for coordination, Sonnet for implementation
- ✅ **Role Boundaries Enforced** - Clear separation between orchestrators and workers
- ✅ **State Preservation** - Agents survive interruptions across sessions
- ✅ **50+ Specialized Agents** - Comprehensive coverage across 6 domains

**Key Improvements:**
- Orchestrators NEVER write code (only coordinate via Task tool)
- Agents maintain context through phase_state.json
- Team confirmation before pipeline execution
- Explicit anti-patterns to prevent drift

---

## Agent Architecture (OS 2.2)

### Grand Architect Pattern (NEW in v2.2)

**Opus Agents (Coordination & Architecture):**
- Complex planning and architecture decisions
- Pipeline coordination and synthesis
- Strategic decision-making
- Examples: `ios-grand-architect`, `nextjs-grand-architect`, `expo-grand-orchestrator`

**Sonnet Agents (Implementation & Verification):**
- Code implementation
- Quality gates and verification
- Specialized tasks
- Examples: `ios-builder`, `nextjs-builder`, `standards-enforcer`, `design-reviewer`

**Benefits:**
- Optimal cost/performance (expensive model for strategy, efficient for work)
- Clear separation of concerns
- Predictable behavior

### Role Boundaries (NEW in v2.2)

**Orchestrators (NEVER write code):**
- Pure coordination via Task tool only
- Read phase_state.json to track progress
- Survive interruptions (questions, pauses, clarifications)
- Examples: `/orca-nextjs`, `/orca-ios`, `/orca-expo`, `/orca-data`

**Agents (Implementation workers):**
- Write code, run tests, analyze
- Report back to orchestrator
- Specialized and scoped
- Examples: All agents listed below

**Enforcement:**
- Explicit role boundaries in all orca commands
- Anti-pattern detection
- State preservation mechanisms

### State Preservation (NEW in v2.2)

All agents work with `phase_state.json`:
- Current phase tracking
- Completed phases log
- Agent assignments
- Gate results
- Enables resumption after interruptions

---

## Domain Agent Teams (50+ Total)

### iOS Pipeline (18 Agents)

#### Grand Architect (Opus)
**`ios-grand-architect`**
- **Purpose:** High-level architecture planning and coordination
- **Phase:** Architecture (Phase 1)
- **Key Features:** SwiftUI vs UIKit decision, SwiftData vs Core Data/GRDB choice, risk assessment, task force assembly
- **Model:** Opus (coordination)
- **Location:** `~/.claude/agents/iOS/ios-grand-architect.md`

#### Architect (Sonnet)
**`ios-architect`**
- **Purpose:** Implementation planning and impact analysis
- **Phase:** Planning (Phase 2)
- **Key Features:** ProjectContextServer integration, detailed plan generation, constraint mapping
- **Model:** Sonnet (planning)
- **Location:** `~/.claude/agents/iOS/ios-architect.md`

#### Builder (Sonnet)
**`ios-builder`**
- **Purpose:** iOS implementation specialist
- **Phase:** Implementation (Phase 3)
- **Key Features:** Swift/SwiftUI/UIKit implementation, follows architecture plan, prepares for gates
- **Model:** Sonnet (implementation)
- **Location:** `~/.claude/agents/iOS/ios-builder.md`

#### Specialists (8 agents, Sonnet)
1. **`ios-swiftui-specialist`** - SwiftUI-specific features and best practices
2. **`ios-uikit-specialist`** - UIKit implementation for legacy/complex UI
3. **`ios-persistence-specialist`** - SwiftData/Core Data/GRDB data layer
4. **`ios-networking-specialist`** - URLSession, async/await networking
5. **`ios-testing-specialist`** - Swift Testing framework
6. **`ios-performance-specialist`** - Instruments, optimization
7. **`ios-security-specialist`** - Keychain, biometrics, secure storage
8. **`ios-accessibility-specialist`** - VoiceOver, accessibility compliance

#### Gates (4 agents, Sonnet)
1. **`ios-standards-enforcer`** - Code standards, Swift 6 concurrency (≥90)
2. **`ios-ui-reviewer`** - UI/interaction quality gate (≥90)
3. **`ios-verification`** - Build/test verification (xcodebuild)
4. **Architecture review** - Embedded in ios-grand-architect

**Total iOS Team:** 18 agents (1 Opus + 17 Sonnet)

---

### Next.js Pipeline (13 Agents)

#### Grand Architect (Opus)
**`nextjs-grand-architect`**
- **Purpose:** Next.js architecture coordination and planning
- **Phase:** Architecture (Phase 1)
- **Key Features:** App Router vs Pages Router, RSC strategy, coordination of planning phase
- **Model:** Opus (coordination)
- **Location:** `~/.claude/agents/nextjs/nextjs-grand-architect.md`

#### Architect (Sonnet)
**`nextjs-architect`**
- **Purpose:** Implementation planning
- **Phase:** Planning (Phase 2)
- **Key Features:** Detailed plan with constraints, file-level changes, integration points
- **Model:** Sonnet (planning)
- **Location:** `~/.claude/agents/nextjs/nextjs-architect.md`

#### Layout Analyzer (Sonnet)
**`nextjs-layout-analyzer`**
- **Purpose:** Structure-first layout analysis
- **Phase:** Analysis (Phase 2.5)
- **Key Features:** Component hierarchy mapping, CSS/token analysis, no code changes
- **Model:** Sonnet (analysis)
- **Location:** `~/.claude/agents/nextjs/nextjs-layout-analyzer.md`

#### Builder (Sonnet)
**`nextjs-builder`**
- **Purpose:** Next.js implementation specialist
- **Phase:** Implementation (Phase 3)
- **Key Features:** React/Next.js implementation, design-dna enforcement, scoped changes
- **Model:** Sonnet (implementation)
- **Location:** `~/.claude/agents/nextjs/nextjs-builder.md`

#### Specialists (5 agents, Sonnet)
1. **`nextjs-typescript-specialist`** - TypeScript best practices, type safety
2. **`nextjs-tailwind-specialist`** - Tailwind + design token integration
3. **`nextjs-layout-specialist`** - Complex layout implementation
4. **`nextjs-performance-specialist`** - Bundle optimization, lazy loading
5. **`nextjs-accessibility-specialist`** - WCAG compliance, semantic HTML

#### Gates (3 agents, Sonnet)
1. **`nextjs-standards-enforcer`** - Code standards, token usage (≥90)
2. **`nextjs-design-reviewer`** - Design QA, visual compliance (≥90)
3. **`nextjs-verification-agent`** - Build/test/lint verification

**Total Next.js Team:** 13 agents (1 Opus + 12 Sonnet)

---

### Expo Pipeline (10 Agents)

#### Grand Orchestrator (Opus)
**`expo-grand-orchestrator`**
- **Purpose:** Expo/React Native high-complexity coordinator
- **Phase:** Architecture (Phase 1, complex tasks only)
- **Key Features:** Complexity-based delegation, risk assessment, coordinates Opus planning when needed
- **Model:** Opus (coordination)
- **Location:** `~/.claude/agents/expo/expo-grand-orchestrator.md`

#### Architect (Sonnet)
**`expo-architect-agent`**
- **Purpose:** Expo planning and impact analysis
- **Phase:** Planning (Phase 2)
- **Key Features:** React Native best practices, architecture choice, impact mapping
- **Model:** Sonnet (planning)
- **Location:** `~/.claude/agents/expo/expo-architect-agent.md`

#### Builder (Sonnet)
**`expo-builder-agent`**
- **Purpose:** Expo/React Native implementation
- **Phase:** Implementation (Phase 3)
- **Key Features:** Mobile-first implementation, design token respect, local checks
- **Model:** Sonnet (implementation)
- **Location:** `~/.claude/agents/expo/expo-builder-agent.md`

#### Specialists (6 agents, Sonnet)
1. **`design-token-guardian`** - Design token enforcement, no hardcoded values
2. **`a11y-enforcer`** - Accessibility compliance (WCAG 2.2, screen readers)
3. **`performance-enforcer`** - Bundle size, performance budgets
4. **`performance-prophet`** - Predictive performance analysis
5. **`security-specialist`** - OWASP Mobile Top 10, secure storage
6. **`expo-aesthetics-specialist`** - Visual polish and interaction design

#### Verification (1 agent, Sonnet)
1. **`expo-verification-agent`** - Build/test/expo doctor verification

**Total Expo Team:** 10 agents (1 Opus + 9 Sonnet)

**Complexity Bands:**
- **Low/Medium:** expo-architect → expo-builder → gates
- **High/Critical:** expo-grand-orchestrator → expo-architect (Opus) → expo-builder → gates

---

### Data Pipeline (4 Agents)

#### Researchers (2 agents, Sonnet)
1. **`data-researcher`** - Data discovery, exploration, question formulation
2. **`research-specialist`** - Deep research, context gathering, hypothesis generation

#### Analysts (2 agents, Sonnet)
1. **`python-analytics-expert`** - Python-based data analysis, pandas, numpy
2. **`competitive-analyst`** - Market analysis, competitor research

**Gates:**
- Data quality verification
- Narrative coherence check

**Total Data Team:** 4 agents (all Sonnet)

---

### Design Pipeline (2 Agents)

#### Design System (1 agent, Sonnet)
**`design-system-architect`**
- **Purpose:** Design token and component system design
- **Phase:** System Design
- **Key Features:** Token generation, component specs, global class systems
- **Location:** `~/.claude/agents/design-system-architect.md`

#### Design Guardian (1 agent, Sonnet)
**`design-dna-guardian`**
- **Purpose:** Design system compliance enforcement
- **Phase:** Quality Gate
- **Key Features:** Token usage verification, no magic numbers, grid compliance
- **Location:** `~/.claude/agents/design-dna-guardian.md`

**Total Design Team:** 2 agents (all Sonnet)

---

### SEO Pipeline (4 Agents)

#### Research (1 agent, Sonnet)
**`seo-research-specialist`**
- **Purpose:** SERP analysis, keyword research, knowledge graph reading
- **Phase:** Research (Phase 1)
- **Key Features:** ProjectContextServer integration, competitive analysis
- **Location:** `~/.claude/agents/seo/seo-research-specialist.md`

#### Strategy (1 agent, Sonnet)
**`seo-brief-strategist`**
- **Purpose:** Content strategy and brief generation
- **Phase:** Strategy (Phase 2)
- **Key Features:** MECE analysis, semantic frameworks, H1-H6 structure
- **Location:** `~/.claude/agents/seo/seo-brief-strategist.md`

#### Writing (1 agent, Sonnet)
**`seo-draft-writer`**
- **Purpose:** Long-form SEO content creation
- **Phase:** Writing (Phase 3)
- **Key Features:** E-E-A-T compliance, adaptive tone, structured content
- **Location:** `~/.claude/agents/seo/seo-draft-writer.md`

#### Quality (1 agent, Sonnet)
**`seo-quality-guardian`**
- **Purpose:** SEO content quality assurance
- **Phase:** Quality (Phase 4)
- **Key Features:** Clarity gates (≥70), compliance checks, readability
- **Location:** `~/.claude/agents/seo/seo-quality-guardian.md`

**Total SEO Team:** 4 agents (all Sonnet)

---

### Cross-Cutting Specialists (6 Agents)

These agents work across multiple pipelines:

1. **`design-token-guardian`** - Used in Expo/Next.js for token enforcement
2. **`design-system-architect`** - Used in all UI pipelines for system design
3. **`a11y-enforcer`** - Used in all UI pipelines for accessibility
4. **`performance-enforcer`** - Used in Expo/Next.js for performance budgets
5. **`performance-prophet`** - Used in Expo for predictive analysis
6. **`security-specialist`** - Used in Expo/iOS for security compliance

---

## Agent Total Count (v2.2)

| Domain | Opus | Sonnet | Total |
|--------|------|--------|-------|
| iOS | 1 | 17 | 18 |
| Next.js | 1 | 12 | 13 |
| Expo | 1 | 9 | 10 |
| Data | 0 | 4 | 4 |
| Design | 0 | 2 | 2 |
| SEO | 0 | 4 | 4 |
| Cross-Cutting | 0 | 6 | 6 |
| **TOTAL** | **3** | **54** | **57** |

**Note:** Cross-cutting agents counted separately but used within pipelines.

---

## Quality Gates (Numerical Scores)

All pipelines enforce numerical quality gates:

### Standards Gate
- **Agent:** `{domain}-standards-enforcer`
- **Checks:** Token usage, no inline styles, code quality, architecture compliance
- **Score:** 0-100 (≥90 to pass)

### Design QA Gate (UI pipelines)
- **Agent:** `{domain}-design-reviewer` or `{domain}-ui-reviewer`
- **Checks:** Grid compliance, token-based styling, interaction states, accessibility
- **Score:** 0-100 (≥90 to pass)

### Accessibility Gate (Mobile pipelines)
- **Agent:** `a11y-enforcer`
- **Checks:** WCAG 2.2 compliance, screen reader support, touch targets, contrast
- **Score:** 0-100 (≥90 to pass)

### Performance Gate (Mobile pipelines)
- **Agent:** `performance-enforcer`
- **Checks:** Bundle size budgets, heavy imports, render performance
- **Score:** 0-100 (≥90 to pass)

### Build/Test Gate (All pipelines)
- **Agent:** `{domain}-verification-agent`
- **Checks:** Build success, test pass, no console errors
- **Result:** PASS/FAIL

---

## Integration Points

### MCP Servers
- **ProjectContextServer** - Mandatory context queries for all agents
  - Location: `~/.claude/mcp/project-context/`
  - Tool: `mcp__project-context__query_context`
- **SharedContext** - Cross-session state management
  - Location: `~/.claude/mcp/shared-context/`
- **Workshop Memory** - Persistent knowledge graph
  - Location: `~/.claude/mcp/vibe-memory/`

### Memory Systems
- **phase_state.json** - Current pipeline state (`.claude/project/phase_state.json`)
- **vibe.db** - Persistent institutional memory (`.claude/memory/vibe.db`)
- **Workshop** - Decisions, gotchas, goals, antipatterns

### Configuration
- **Phase configs:** `~/.claude/docs/reference/phase-configs/`
- **Pipeline specs:** `~/.claude/docs/pipelines/`
- **Agent constraints:** Embedded in agent definitions

---

## Agent Patterns (v2.2)

### Constraint Framework Categories
1. **Scope** - What the agent can/cannot do (explicit boundaries)
2. **Quality** - Standards that must be met (numerical gates)
3. **Integration** - How agent connects with system (MCP tools)
4. **Resource** - Token/time/API limits (efficiency requirements)
5. **Behavioral** - Tone, style, approach (communication patterns)

### Pipeline Structure
```
ProjectContextServer Query (MANDATORY)
    ↓
Team Confirmation (AskUserQuestion - MANDATORY)
    ↓
Phase 1: Grand Architect (Architecture & Coordination) [Opus]
    ↓
Phase 2: Architect (Planning & Impact Analysis) [Sonnet]
    ↓
Phase 3: Implementation (Builder + Specialists) [Sonnet]
    ↓
Phase 4: Quality Gates (Standards, Design QA, A11y, Performance) [Sonnet]
    ↓
Phase 5: Verification (Build/Test) [Sonnet]
    ↓
Phase 6: Evidence Capture & Memory Update
```

### Anti-Patterns (v2.2)
❌ Orchestrator writing code directly
❌ Skipping ProjectContextServer query
❌ Bypassing team confirmation
❌ Abandoning pipeline on interruption
❌ Skipping quality gates to move faster
❌ Not updating phase_state.json

### Correct Patterns (v2.2)
✅ Orchestrator delegates via Task tool only
✅ Always query ProjectContextServer first
✅ Confirm team before execution
✅ Read phase_state.json after interruptions
✅ All gates must pass (≥90 scores)
✅ Update phase_state.json at each phase

---

## Usage Examples

### iOS Feature Implementation
```bash
# 1. Plan
/plan "Add biometric authentication"

# 2. Implement (orchestrator coordinates agents)
/orca-ios "Implement requirement <id> using spec"

# Agents used:
- ios-grand-architect (Opus) - Architecture planning
- ios-architect (Sonnet) - Implementation plan
- ios-builder (Sonnet) - Implementation
- ios-security-specialist (Sonnet) - Biometric integration
- ios-standards-enforcer (Sonnet) - Standards gate (≥90)
- ios-ui-reviewer (Sonnet) - UI gate (≥90)
- ios-verification (Sonnet) - Build/test verification
```

### Next.js UI Work
```bash
# 1. Plan
/plan "Add dark mode with user preference persistence"

# 2. Implement (orchestrator coordinates agents)
/orca-nextjs "Implement requirement <id> using spec"

# Agents used:
- nextjs-grand-architect (Opus) - Coordination
- nextjs-architect (Sonnet) - Planning
- nextjs-layout-analyzer (Sonnet) - Layout analysis
- nextjs-builder (Sonnet) - Implementation
- nextjs-tailwind-specialist (Sonnet) - Styling
- design-token-guardian (Sonnet) - Token enforcement
- nextjs-standards-enforcer (Sonnet) - Standards gate (≥90)
- nextjs-design-reviewer (Sonnet) - Design QA gate (≥90)
- nextjs-verification-agent (Sonnet) - Build/test
```

### Expo Mobile Feature
```bash
# 1. Plan
/plan "Add offline mode with sync"

# 2. Implement (orchestrator coordinates agents)
/orca-expo "Implement requirement <id> using spec"

# Agents used (complexity: high):
- expo-grand-orchestrator (Opus) - High-level coordination
- expo-architect-agent (Sonnet with Opus oversight) - Planning
- expo-builder-agent (Sonnet) - Implementation
- design-token-guardian (Sonnet) - Token gate
- a11y-enforcer (Sonnet) - Accessibility gate (≥90)
- performance-enforcer (Sonnet) - Performance gate (≥90)
- security-specialist (Sonnet) - Security gate
- expo-verification-agent (Sonnet) - Build/test
```

---

## Agent Locations

### Global Agents
- **iOS:** `~/.claude/agents/iOS/`
- **Next.js:** `~/.claude/agents/nextjs/`
- **Expo:** `~/.claude/agents/expo/`
- **Data:** `~/.claude/agents/data/`
- **Design:** `~/.claude/agents/design/`
- **SEO:** `~/.claude/agents/seo/`
- **Cross-cutting:** `~/.claude/agents/specialists/`

### Project-Specific Overrides
- **Location:** `<project>/.claude/agents/`
- **Use case:** Project-specific agent customizations

---

_This reference covers OS 2.2 (v2.2) agents. Legacy v1 agents archived. OS 2.2 agents updated to v2.2 patterns._
