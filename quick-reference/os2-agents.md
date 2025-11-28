# OS 2.4 Agents Quick Reference

**Last Updated:** 2025-11-27
**Version:** OS 2.4 (v2.4)

---

## What's New in OS 2.4

**Agent Architecture Changes:**
- ✅ **All Agents Use Opus 4.5** - Unified model across all agents
- ✅ **Role Boundaries Enforced** - Clear separation between orchestrators and workers
- ✅ **State Preservation** - Agents survive interruptions across sessions
- ✅ **82 Specialized Agents** - Comprehensive coverage across 9 domains

**Key Improvements:**
- Orchestrators NEVER write code (only coordinate via Task tool)
- Agents maintain context through phase_state.json
- Team confirmation before pipeline execution
- Explicit anti-patterns to prevent drift

---

## Agent Architecture (OS 2.4)

### Agent Model (OS 2.4)

**All Agents Use Opus 4.5:**
- Grand architects (coordination & architecture)
- Builders (implementation)
- Specialists (domain-specific work)
- Gates (verification & enforcement)

**Benefits:**
- Consistent quality across all agents
- No model-selection overhead
- Unified capability level
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

#### Grand Architect
**`ios-grand-architect`**
- **Purpose:** High-level architecture planning and coordination
- **Phase:** Architecture (Phase 1)
- **Key Features:** SwiftUI vs UIKit decision, SwiftData vs Core Data/GRDB choice, risk assessment, task force assembly
- **Location:** `~/.claude/agents/iOS/ios-grand-architect.md`

#### Architect
**`ios-architect`**
- **Purpose:** Implementation planning and impact analysis
- **Phase:** Planning (Phase 2)
- **Key Features:** ProjectContextServer integration, detailed plan generation, constraint mapping
- **Location:** `~/.claude/agents/iOS/ios-architect.md`

#### Builder
**`ios-builder`**
- **Purpose:** iOS implementation specialist
- **Phase:** Implementation (Phase 3)
- **Key Features:** Swift/SwiftUI/UIKit implementation, follows architecture plan, prepares for gates
- **Location:** `~/.claude/agents/iOS/ios-builder.md`

#### Specialists (8 agents)
1. **`ios-swiftui-specialist`** - SwiftUI-specific features and best practices
2. **`ios-uikit-specialist`** - UIKit implementation for legacy/complex UI
3. **`ios-persistence-specialist`** - SwiftData/Core Data/GRDB data layer
4. **`ios-networking-specialist`** - URLSession, async/await networking
5. **`ios-testing-specialist`** - Swift Testing framework
6. **`ios-performance-specialist`** - Instruments, optimization
7. **`ios-security-specialist`** - Keychain, biometrics, secure storage
8. **`ios-accessibility-specialist`** - VoiceOver, accessibility compliance

#### Gates (4 agents)
1. **`ios-standards-enforcer`** - Code standards, Swift 6 concurrency (≥90)
2. **`ios-ui-reviewer`** - UI/interaction quality gate (≥90)
3. **`ios-verification`** - Build/test verification (xcodebuild)
4. **Architecture review** - Embedded in ios-grand-architect

**Total iOS Team:** 18 agents (all Opus 4.5)

---

### Next.js Pipeline (15 Agents)

#### Grand Architect
**`nextjs-grand-architect`**
- **Purpose:** Next.js architecture coordination and planning
- **Phase:** Architecture (Phase 1)
- **Key Features:** App Router vs Pages Router, RSC strategy, coordination of planning phase
- **Location:** `~/.claude/agents/dev/nextjs-grand-architect.md`

#### Architect
**`nextjs-architect`**
- **Purpose:** Implementation planning
- **Phase:** Planning (Phase 2)
- **Key Features:** Detailed plan with constraints, file-level changes, integration points
- **Location:** `~/.claude/agents/dev/nextjs-architect.md`

#### Layout Analyzer
**`nextjs-layout-analyzer`**
- **Purpose:** Structure-first layout analysis
- **Phase:** Analysis (Phase 2.5)
- **Key Features:** Component hierarchy mapping, CSS/token analysis, no code changes
- **Location:** `~/.claude/agents/dev/nextjs-layout-analyzer.md`

#### Builder
**`nextjs-builder`**
- **Purpose:** Next.js implementation specialist
- **Phase:** Implementation (Phase 3)
- **Key Features:** React/Next.js implementation, design-dna enforcement, scoped changes
- **Location:** `~/.claude/agents/dev/nextjs-builder.md`

#### Specialists (6 agents)
1. **`nextjs-css-specialist`** - Semantic CSS, @layer, design tokens (CSS-agnostic)
2. **`nextjs-typescript-specialist`** - TypeScript best practices, type safety
3. **`nextjs-tailwind-specialist`** - Tailwind projects (when auto-detected)
4. **`nextjs-layout-specialist`** - Complex layout implementation
5. **`nextjs-performance-specialist`** - Bundle optimization, lazy loading
6. **`nextjs-accessibility-specialist`** - WCAG compliance, semantic HTML

#### Gates (3 agents)
1. **`nextjs-standards-enforcer`** - Code standards, token usage (≥90)
2. **`nextjs-design-reviewer`** - Design QA, visual compliance (≥90)
3. **`nextjs-verification-agent`** - Build/test/lint verification

**Total Next.js Team:** 16 agents (all Opus 4.5)

---

### Expo Pipeline (11 Agents)

#### Grand Orchestrator
**`expo-grand-orchestrator`**
- **Purpose:** Expo/React Native high-complexity coordinator
- **Phase:** Architecture (Phase 1, complex tasks only)
- **Key Features:** Complexity-based delegation, risk assessment, coordinates planning when needed
- **Location:** `~/.claude/agents/expo/expo-grand-orchestrator.md`

#### Architect
**`expo-architect-agent`**
- **Purpose:** Expo planning and impact analysis
- **Phase:** Planning (Phase 2)
- **Key Features:** React Native best practices, architecture choice, impact mapping
- **Location:** `~/.claude/agents/expo/expo-architect-agent.md`

#### Builder
**`expo-builder-agent`**
- **Purpose:** Expo/React Native implementation
- **Phase:** Implementation (Phase 3)
- **Key Features:** Mobile-first implementation, design token respect, local checks
- **Location:** `~/.claude/agents/expo/expo-builder-agent.md`

#### Specialists (6 agents)
1. **`design-token-guardian`** - Design token enforcement, no hardcoded values
2. **`a11y-enforcer`** - Accessibility compliance (WCAG 2.2, screen readers)
3. **`performance-enforcer`** - Bundle size, performance budgets
4. **`performance-prophet`** - Predictive performance analysis
5. **`security-specialist`** - OWASP Mobile Top 10, secure storage
6. **`expo-aesthetics-specialist`** - Visual polish and interaction design

#### Verification (1 agent)
1. **`expo-verification-agent`** - Build/test/expo doctor verification

**Total Expo Team:** 11 agents (all Opus 4.5)

**Complexity Bands:**
- **Low/Medium:** expo-architect → expo-builder → gates
- **High/Critical:** expo-grand-orchestrator → expo-architect → expo-builder → gates

---

### Data Pipeline (4 Agents)

#### Researchers (2 agents)
1. **`data-researcher`** - Data discovery, exploration, question formulation
2. **`research-specialist`** - Deep research, context gathering, hypothesis generation

#### Analysts (2 agents)
1. **`python-analytics-expert`** - Python-based data analysis, pandas, numpy
2. **`competitive-analyst`** - Market analysis, competitor research

**Gates:**
- Data quality verification
- Narrative coherence check

**Total Data Team:** 4 agents (all Opus 4.5)

---

### Design Pipeline (2 Agents)

#### Design System (1 agent)
**`design-system-architect`**
- **Purpose:** Design token and component system design
- **Phase:** System Design
- **Key Features:** Token generation, component specs, global class systems
- **Location:** `~/.claude/agents/design-system-architect.md`

#### Design Guardian (1 agent)
**`design-dna-guardian`**
- **Purpose:** Design system compliance enforcement
- **Phase:** Quality Gate
- **Key Features:** Token usage verification, no magic numbers, grid compliance
- **Location:** `~/.claude/agents/iOS/design-dna-guardian.md`

**Total Design Team:** 2 agents (all Opus 4.5)

---

### SEO Pipeline (4 Agents)

#### Research (1 agent)
**`seo-research-specialist`**
- **Purpose:** SERP analysis, keyword research, knowledge graph reading
- **Phase:** Research (Phase 1)
- **Key Features:** ProjectContextServer integration, competitive analysis
- **Location:** `~/.claude/agents/seo/seo-research-specialist.md`

#### Strategy (1 agent)
**`seo-brief-strategist`**
- **Purpose:** Content strategy and brief generation
- **Phase:** Strategy (Phase 2)
- **Key Features:** MECE analysis, semantic frameworks, H1-H6 structure
- **Location:** `~/.claude/agents/seo/seo-brief-strategist.md`

#### Writing (1 agent)
**`seo-draft-writer`**
- **Purpose:** Long-form SEO content creation
- **Phase:** Writing (Phase 3)
- **Key Features:** E-E-A-T compliance, adaptive tone, structured content
- **Location:** `~/.claude/agents/seo/seo-draft-writer.md`

#### Quality (1 agent)
**`seo-quality-guardian`**
- **Purpose:** SEO content quality assurance
- **Phase:** Quality (Phase 4)
- **Key Features:** Clarity gates (≥70), compliance checks, readability
- **Location:** `~/.claude/agents/seo/seo-quality-guardian.md`

**Total SEO Team:** 4 agents (all Opus 4.5)

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

## Agent Total Count (v2.4)

| Domain | Total |
|--------|-------|
| iOS | 19 |
| Next.js | 15 |
| Expo | 11 |
| Shopify | 7 |
| OS-Dev | 5 |
| Data | 4 |
| Design | 2 |
| SEO | 4 |
| Research | 8 |
| OBDN | 4 |
| Cross-Cutting | 6 |
| **TOTAL** | **82** |

**Note:** All agents use Opus 4.5. Cross-cutting agents counted separately but used within pipelines.

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
- **phase_state.json** - Current pipeline state (`.claude/orchestration/phase_state.json`)
- **vibe.db** - Persistent institutional memory (`.claude/memory/vibe.db`)
- **Workshop** - Decisions, gotchas, goals, antipatterns

### Configuration
- **Phase configs:** `~/.claude/docs/reference/phase-configs/`
- **Pipeline specs:** `~/.claude/docs/pipelines/`
- **Agent constraints:** Embedded in agent definitions

---

## Agent Patterns (v2.4)

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
Team Confirmation (AskUserQuestion - complex only)
    ↓
Phase 1: Grand Architect (Architecture & Coordination)
    ↓
Phase 2: Architect (Planning & Impact Analysis)
    ↓
Phase 3: Implementation (Builder + Specialists)
    ↓
Phase 4: Quality Gates (Standards, Design QA, A11y, Performance)
    ↓
Phase 5: Verification (Build/Test)
    ↓
Phase 6: Evidence Capture & Memory Update
```

**Note:** All agents use Opus 4.5. No model-based phase distinctions.

### Anti-Patterns (v2.4)
❌ Orchestrator writing code directly
❌ Skipping ProjectContextServer query
❌ Bypassing team confirmation (for complex mode)
❌ Abandoning pipeline on interruption
❌ Skipping quality gates (unless -tweak mode)
❌ Not updating phase_state.json

### Correct Patterns (v2.4)
✅ Orchestrator delegates via Task tool only
✅ Always query ProjectContextServer first
✅ Confirm team before execution (complex mode)
✅ Read phase_state.json after interruptions
✅ All gates must pass (≥90 scores) except -tweak mode
✅ Update phase_state.json at each phase

---

## Usage Examples

### iOS Feature Implementation
```bash
# 1. Plan
/plan "Add biometric authentication"

# 2. Implement (orchestrator coordinates agents)
/orca-ios --complex "Implement requirement <id> using spec"

# Agents used (all Opus 4.5):
- ios-grand-architect - Architecture planning
- ios-architect - Implementation plan
- ios-builder - Implementation
- ios-security-specialist - Biometric integration
- ios-standards-enforcer - Standards gate (≥90)
- ios-ui-reviewer - UI gate (≥90)
- ios-verification - Build/test verification
```

### Next.js UI Work
```bash
# 1. Plan
/plan "Add dark mode with user preference persistence"

# 2. Implement (orchestrator coordinates agents)
/orca-nextjs --complex "Implement requirement <id> using spec"

# Agents used (all Opus 4.5):
- nextjs-grand-architect - Coordination
- nextjs-architect - Planning
- nextjs-layout-analyzer - Layout analysis
- nextjs-builder - Implementation
- nextjs-css-specialist - CSS (auto-selects based on project)
- design-token-guardian - Token enforcement
- nextjs-standards-enforcer - Standards gate (≥90)
- nextjs-design-reviewer - Design QA gate (≥90)
- nextjs-verification-agent - Build/test
```

### Expo Mobile Feature
```bash
# 1. Plan
/plan "Add offline mode with sync"

# 2. Implement (orchestrator coordinates agents)
/orca-expo --complex "Implement requirement <id> using spec"

# Agents used (all Opus 4.5):
- expo-grand-orchestrator - High-level coordination
- expo-architect-agent - Planning
- expo-builder-agent - Implementation
- design-token-guardian - Token gate
- a11y-enforcer - Accessibility gate (≥90)
- performance-enforcer - Performance gate (≥90)
- security-specialist - Security gate
- expo-verification-agent - Build/test
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

_This reference covers OS 2.4 agents. All 82 agents use Opus 4.5. Legacy v1/v2 agents archived._
