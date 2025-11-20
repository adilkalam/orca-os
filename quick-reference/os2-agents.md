# OS 2.0 Agents Quick Reference

**Last Updated:** 2025-11-19

## Current OS 2.0 Agents

### SEO Pipeline Agents

#### 1. `seo-research-specialist`
- **Purpose:** Domain research and context gathering
- **Phase:** Research (Phase 1)
- **Key Features:** Mandatory ProjectContextServer integration
- **Location:** `~/.claude/agents/seo-research-specialist.md`

#### 2. `seo-brief-strategist`
- **Purpose:** Content strategy and brief creation
- **Phase:** Strategy (Phase 2)
- **Key Features:** MECE analysis, semantic frameworks
- **Location:** `~/.claude/agents/seo-brief-strategist.md`

#### 3. `seo-draft-writer`
- **Purpose:** Content creation following E-E-A-T
- **Phase:** Writing (Phase 3)
- **Key Features:** Adaptive tone, structured content
- **Location:** `~/.claude/agents/seo-draft-writer.md`

#### 4. `seo-quality-guardian`
- **Purpose:** Quality assurance and standards enforcement
- **Phase:** Quality (Phase 4)
- **Key Features:** Clarity gates (70+), compliance checks
- **Location:** `~/.claude/agents/seo-quality-guardian.md`

### Frontend Pipeline Agents

#### 1. `frontend-builder-agent`
- **Purpose:** Frontend implementation in the webdev lane
- **Phase:** Implementation (Pass 1/2)
- **Key Features:** Design-dna.json enforcement, edit-not-rewrite, scoped diffs, lint/typecheck before gates
- **Location:** `~/.claude/agents/frontend-builder-agent.md`

#### 2. `frontend-design-reviewer-agent`
- **Purpose:** Visual QA gate for web UI
- **Phase:** Design QA
- **Key Features:** Design-dna compliance scoring (0–100), layout/spacing/typography checks, PASS/CAUTION/FAIL gate
- **Location:** `~/.claude/agents/frontend-design-reviewer-agent.md`

#### 3. `frontend-layout-analyzer`
- **Purpose:** Structure-first layout analysis before any CSS/JSX changes
- **Phase:** Analysis
- **Key Features:** Reads component hierarchy and CSS/tokens, maps containers and style sources, no code edits
- **Location:** `~/.claude/agents/frontend-layout-analyzer.md`

#### 4. `frontend-standards-enforcer`
- **Purpose:** Code-level standards gate for frontend changes
- **Phase:** Standards Enforcement
- **Key Features:** Computes Standards Score (0–100), blocks on inline styles / token violations / scope creep
- **Location:** `~/.claude/agents/frontend-standards-enforcer.md`

### iOS Pipeline Agents

#### 1. `ios-architect-agent`
- **Purpose:** iOS lane planner and architecture router
- **Phase:** Requirements & Impact Analysis, Architecture & Plan
- **Key Features:** ProjectContextServer integration, Swift 6/iOS stack detection, chooses between modern SwiftUI 18/26 vs existing MVVM/TCA/UIKit patterns, produces architecture plan and impact map
- **Location:** `~/.claude/agents/ios-architect-agent.md`

#### 2. `ios-standards-enforcer`
- **Purpose:** iOS code-level standards and safety gate
- **Phase:** Standards Enforcement
- **Key Features:** Audits Swift/SwiftUI/UIKit changes for architecture consistency, Swift 6 concurrency correctness, safety (force unwraps, casts), and testing discipline; computes Standards Score (0–100)
- **Location:** `~/.claude/agents/ios-standards-enforcer.md`

#### 3. `ios-ui-reviewer-agent`
- **Purpose:** iOS UI/interaction QA gate
- **Phase:** UI/Interaction QA
- **Key Features:** Uses simulator runs and code inspection to evaluate layout, navigation, interaction, and basic accessibility for the current flow; outputs Design/Interaction Score (0–100) with gate label
- **Location:** `~/.claude/agents/ios-ui-reviewer-agent.md`

#### 4. `ios-verification-agent`
- **Purpose:** Build & test verification gate for iOS lane
- **Phase:** Build/Test Verification
- **Key Features:** Runs Xcode builds and tests (via xcodebuild or MCP), summarizes build/test status, feeds final Build/Test Gate decision
- **Location:** `~/.claude/agents/ios-verification-agent.md`

### Expo / React Native Pipeline Agents

#### 1. `expo-architect-agent`
- **Purpose:** Expo lane architect for requirements, impact analysis, and architecture planning
- **Phase:** Requirements & Impact, Architecture & Plan
- **Key Features:** Uses ProjectContextServer (`domain: expo`) and React Native best practices to map impact, choose architecture, and hand off to implementation and gate agents
- **Location:** `~/.claude/agents/expo-architect-agent.md`

#### 2. `expo-builder-agent`
- **Purpose:** Expo/React Native implementation specialist
- **Phase:** Implementation (Pass 1/2)
- **Key Features:** Implements mobile features according to the Expo pipeline plan, respects design tokens and standards, prepares work for gate agents, runs local checks
- **Location:** `~/.claude/agents/expo-builder-agent.md`

#### 3. `expo-verification-agent`
- **Purpose:** Build/test verification gate for the Expo lane
- **Phase:** Verification (Build/Test)
- **Key Features:** Runs tests, linting, and Expo-specific health checks (e.g. expo doctor), summarizes verification status for the Verification Gate
- **Location:** `~/.claude/agents/expo-verification-agent.md`

#### 4. `design-token-guardian`
- **Purpose:** Expo/React Native design token enforcement
- **Phase:** Standards & Budgets (Design Tokens Gate)
- **Key Features:** Scans RN/Expo components for hardcoded colors/spacing/typography, enforces theme tokens, computes a Design Tokens/Standards Score (0–100)
- **Location:** `~/.claude/agents/design-token-guardian.md`

#### 5. `a11y-enforcer`
- **Purpose:** Accessibility compliance gate for Expo/React Native UI
- **Phase:** Standards & Budgets (A11y Gate)
- **Key Features:** Checks WCAG 2.2 compliance (labels, hitSlop, roles, contrast), reports issues and an Accessibility Score (0–100), can propose targeted auto-fixes
- **Location:** `~/.claude/agents/a11y-enforcer.md`

#### 6. `performance-enforcer`
- **Purpose:** Performance budget gate for Expo/React Native apps
- **Phase:** Standards & Budgets (Performance Gate)
- **Key Features:** Monitors bundle size and runtime characteristics, detects heavy imports and unnecessary re-renders, outputs a Performance Score (0–100)
- **Location:** `~/.claude/agents/performance-enforcer.md`

#### 7. `performance-prophet`
- **Purpose:** Predictive performance analysis for Expo/React Native features
- **Phase:** Power Checks (optional)
- **Key Features:** Uses static analysis and known patterns to predict FPS drops and bottlenecks before runtime, recommends fixes, integrates with ProjectContextServer
- **Location:** `~/.claude/agents/performance-prophet.md`

#### 8. `security-specialist`
- **Purpose:** Security gate for Expo/React Native apps
- **Phase:** Power Checks / Security Gate
- **Key Features:** Audits for OWASP Mobile Top 10 issues (storage, network, auth, secrets, deeplinks), produces structured Security Audit Reports for gate decisions
- **Location:** `~/.claude/agents/security-specialist.md`

## Agent Architecture (OS 2.0)

### Constraint Framework Categories
1. **Scope** - What the agent can/cannot do
2. **Quality** - Standards that must be met
3. **Integration** - How agent connects with system
4. **Resource** - Token/time/API limits
5. **Behavioral** - Tone, style, approach

### Pipeline Structure
```
ProjectContextServer (MANDATORY)
    ↓
Phase 1: Research/Analysis
    ↓
Phase 2: Strategy/Planning
    ↓
Phase 3: Implementation
    ↓
Phase 4: Quality Gates
```

### Quality Gates
- **Clarity Score:** Minimum 70/100
- **Compliance:** Hard block on violations
- **Standards:** Minimum 90/100

## Integration Points

### MCP Servers
- `ProjectContextServer` - Mandatory context queries
- Located at: `~/.claude/mcp/project-context-server/`

### Memory Systems
- **AgentDB:** Ephemeral pipeline cache
- **vibe.db:** Persistent institutional memory

### Configuration
- Phase configs: `~/.claude/docs/reference/phase-configs/`
- Agent constraints: Embedded in agent definitions

---

_This reference covers OS 2.0 agents only. Legacy v1 agents have been archived._
