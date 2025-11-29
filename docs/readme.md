# OS 2.4 – Claude Code Orchestration System

A multi-lane pipeline architecture for Claude Code that routes tasks to domain-specific agents, enforces role boundaries, and maintains context across sessions.

## Quick Start

```bash
# Plan complex work first
/plan "description of feature or change"

# Execute via domain orchestrator
/orca "task description"                    # Auto-routes to correct lane
/orca-ios "add haptic feedback"             # iOS-specific
/orca-nextjs "update pricing page"          # Next.js-specific
/orca-expo "add pull-to-refresh"            # Expo/React Native
/orca-shopify "refactor header CSS"         # Shopify theme

# Quick fixes (skip overhead)
/orca-ios -tweak "fix button padding"

# Deep audit (review without changes)
/orca-ios --audit

# Retrospective analysis
/audit "last 10 tasks"

# Diagnostic investigation
/root-cause "tests failing after merge"
```

## Core Concepts

| Concept | Description |
|---------|-------------|
| [Pipeline Model](concepts/pipeline-model.md) | Lanes, phases, orchestrator-specialist-gate pattern |
| [Complexity Routing](concepts/complexity-routing.md) | Simple/medium/complex tiers, `-tweak`, `--audit`, spec gating |
| [Memory Systems](concepts/memory-systems.md) | Workshop, vibe.db, ProjectContext, memory-first pattern |
| [Response Awareness](concepts/response-awareness.md) | RA tags, assumption tracking, audit loop |
| **Evidence-Based Gates** | Programmatic checks and artifacts required for PASS decisions |
| [Self-Improvement](concepts/self-improvement.md) | Outcome recording, pattern analysis, agent learning loop |
| [Skills](concepts/skills.md) | Reusable knowledge packages |

## Lanes (Domain Pipelines)

| Lane | Entry Point | Description |
|------|-------------|-------------|
| iOS | `/orca-ios` | Native iOS (Swift/SwiftUI/UIKit) |
| Next.js | `/orca-nextjs` | Next.js frontend |
| Expo | `/orca-expo` | React Native/Expo mobile |
| Shopify | `/orca-shopify` | Shopify theme (Liquid/CSS/JS) |
| Data | via `/orca` | Data analysis and research |
| SEO | via `/orca` | SEO content pipeline |
| Design | via `/orca` | Design system work |
| Research | `/research` | Deep research and reporting (Firecrawl-first) |
| OBDN | `/kg` | KG-augmented research (peptides, protocols, mechanisms) |
| OS-Dev | `/orca-os-dev` | OS configuration (LOCAL only) |

See [pipelines/](pipelines/) for detailed architecture of each lane.

## Commands

| Command | Purpose |
|---------|---------|
| `/plan` | Create requirements spec for complex work |
| `/orca` | Auto-route to domain orchestrator |
| `/orca-{domain}` | Domain-specific orchestrator |
| `/research` | Deep research (Firecrawl + multi-agent writers) |
| `/kg` | KG-first research for OBDN (peptides, protocols) |
| `/audit` | Retrospective RA analysis |
| `/root-cause` | Diagnostic investigation |
| `/think` | Reasoning strategy advisor (recommends thinking tools) |
| `/clear-thought` | Unified reasoning operations (38 tools via Clear Thought MCP) |

## Key Principles

### Role Boundaries
- **Orchestrators** never write code (coordinate via Task tool)
- **Specialists** implement changes (scoped to their domain)
- **Gates** validate but don't fix

### Complexity Routing
- **Simple** → Light orchestrator, skip gates
- **Medium** → Full pipeline, spec recommended
- **Complex** → Full pipeline, spec REQUIRED

### Memory-First
Check local memory (Workshop + vibe.db) before expensive ProjectContext queries.

### Response Awareness
Track assumptions with RA tags. Gates report RA status. `/audit` mines patterns.

## Workflows

User-facing guides for specific workflows:

| Workflow | Guide |
|----------|-------|
| Deep Research | [workflows/deep-research-workflow.md](workflows/deep-research-workflow.md) |
| KG Research (OBDN) | [workflows/kg-research-workflow.md](workflows/kg-research-workflow.md) |

## Directory Structure

```
docs/
├── README.md              # This file
├── changelog.md           # Version history
├── agents.md              # Agent roster
├── concepts/              # Core mental models
├── pipelines/             # Lane architecture (technical)
├── workflows/             # User-facing workflow guides
└── reference/             # Technical schemas

quick-reference/           # Domain quick-reference guides
agents/                    # Agent definitions (runtime)
commands/                  # Command definitions (runtime)
skills/                    # Skill definitions (runtime)
```

## Agent Enrichment (v2.4.1)

All 85 agents have been enriched with:

- **Knowledge Loading** - Agents check `.claude/agent-knowledge/{agent}/patterns.json`
- **Required Skills** - 5 universal skills (cursor-code-style, lovable-pitfalls, search-before-edit, linter-loop-limits, debugging-first)
- **Lane-Specific Patterns** - V0/Lovable for Next.js, Swift-agents for iOS, RN best practices for Expo
- **Visual Validation** - Shopify lane has Playwright MCP via `shopify-ui-reviewer`

See [Self-Improvement](concepts/self-improvement.md) for the agent-level learning system.

## Version

**OS 2.4.1** | 2025-11-28 | [Changelog](changelog.md)
