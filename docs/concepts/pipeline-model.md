# Pipeline Model

OS 2.4 uses a **multi-lane pipeline architecture** to handle different types of development work. Each "lane" is a domain-specific pipeline with its own agents, phases, and gates.

## Core Concepts

### Lanes (Domain Pipelines)

A **lane** is a complete pipeline for a specific development domain:

| Lane | Domain | Entry Point |
|------|--------|-------------|
| iOS | Native iOS (Swift/SwiftUI/UIKit) | `/orca-ios` |
| Next.js | Next.js frontend | `/orca-nextjs` |
| Expo | React Native/Expo mobile | `/orca-expo` |
| Shopify | Shopify theme (Liquid/CSS/JS) | `/orca-shopify` |
| Data | Data analysis and research | via `/orca` |
| SEO | SEO content pipeline | via `/orca` |
| Design | Design system work | via `/orca` |
| OS-Dev | OS configuration (LOCAL only) | `/orca-os-dev` |

The main `/orca` command auto-detects domain and routes to the appropriate lane.

### Phases

Every lane follows a similar phase structure:

```
Request
    ↓
[Phase 0: Memory-First Context]     ← Workshop + vibe.db
    ↓
[Phase 0.5: Complexity Classification]
    ↓
├─ SIMPLE → [Light Orchestrator] → Done
│
├─ MEDIUM/COMPLEX:
    ↓
[Phase 1: Team Confirmation]        ← User approves agents
    ↓
[Phase 2: ProjectContext Query]     ← ContextBundle
    ↓
[Phase 3: Planning/Architecture]    ← Grand Architect
    ↓
[Phase 4: Implementation]           ← Specialists
    ↓
[Phase 5: Gates & Verification]     ← Standards + Tests
    ↓
[Phase 6: Completion & Learning]    ← Save history
```

### Agent Roles

OS 2.4 enforces strict role separation:

#### Orchestrators (Never Write Code)
- **Commands**: `/orca`, `/orca-ios`, `/orca-nextjs`, etc.
- **Grand Architects**: `ios-grand-architect`, `nextjs-grand-architect`, etc.
- **Light Orchestrators**: `ios-light-orchestrator`, `nextjs-light-orchestrator`, etc.

Orchestrators:
- Classify complexity
- Query context (memory + ProjectContext)
- Delegate to specialists via `Task` tool
- Track phase state
- Never use `Edit`/`Write` tools

#### Specialists (Implement Changes)
Domain experts that do the actual work:
- `ios-swiftui-specialist`, `ios-uikit-specialist`
- `nextjs-builder`, `nextjs-tailwind-specialist`
- `shopify-css-specialist`, `shopify-liquid-specialist`
- etc.

Specialists:
- Receive scoped tasks from orchestrators
- Read and edit files
- Report changes back to orchestrator
- Tag assumptions with RA tags

#### Gates (Validate Quality)
Verification agents that check work:
- `ios-standards-enforcer`, `ios-verification`
- `nextjs-standards-enforcer`, `nextjs-verification-agent`
- `shopify-theme-checker`
- etc.

Gates:
- Run tests, linters, checks
- Score against standards
- Report PASS/CAUTION/FAIL
- Never fix issues (report only)

## The Orchestrator-Specialist-Gate Pattern

```
                    ┌─────────────────┐
                    │   Orchestrator  │
                    │  (coordinates)  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │Specialist│  │Specialist│  │Specialist│
        │   (CSS)  │  │ (Liquid) │  │   (JS)   │
        └────┬─────┘  └────┬─────┘  └────┬─────┘
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                    ┌─────────────────┐
                    │      Gate       │
                    │  (validates)    │
                    └─────────────────┘
```

1. **Orchestrator** receives task, classifies complexity, gathers context
2. **Orchestrator** delegates to appropriate **Specialists** via `Task` tool
3. **Specialists** implement changes and report back
4. **Orchestrator** sends changes to **Gate** for validation
5. **Gate** reports pass/fail; if fail, orchestrator may request corrective pass
6. **Orchestrator** logs outcome and returns summary to user

## State Preservation

Pipelines preserve state across interruptions using `phase_state.json`:

```json
{
  "domain": "ios",
  "task": "Add haptic feedback to save button",
  "phase": "implementation",
  "status": "in_progress",
  "complexity_tier": "simple",
  "context": { ... },
  "implementation": { ... },
  "gates": { ... }
}
```

When user interrupts (questions, clarifications):
1. Orchestrator reads `phase_state.json`
2. Acknowledges interruption
3. Processes new information
4. Resumes from appropriate phase
5. Does NOT abandon pipeline or switch to direct implementation

## See Also

- [Complexity Routing](complexity-routing.md) - How tasks are classified and routed
- [Memory Systems](memory-systems.md) - How context flows into pipelines
- [Response Awareness](response-awareness.md) - How assumptions are tracked
