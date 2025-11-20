# OS 2.0 Commands Quick Reference

**Last Updated:** 2025-11-19

## Core OS 2.0 Commands

### `/orca` - Universal Orchestrator
- **Purpose:** OS 2.0 orchestration engine for all domains
- **Usage:** `/orca <task description>`
- **Features:**
  - Mandatory ProjectContextServer integration
  - Domain detection (webdev, iOS, data, SEO, brand)
  - Phase-based execution
  - Quality gates enforcement
- **Location:** `~/.claude/commands/orca.md`

### `/seo-orca` - SEO Pipeline Orchestrator
- **Purpose:** Specialized SEO content pipeline
- **Usage:** `/seo-orca "<keyword or topic>"`
- **Phases:**
  1. Research (seo-research-specialist)
  2. Strategy (seo-brief-strategist)
  3. Writing (seo-draft-writer)
  4. Quality (seo-quality-guardian)
- **Location:** `~/.claude/commands/seo-orca.md`

## Command Architecture

### Phase Structure
```yaml
phase_1_research:
  agent: specialist-agent
  context_required: true

phase_2_strategy:
  agent: strategist-agent
  dependencies: [phase_1]

phase_3_implementation:
  agent: builder-agent
  dependencies: [phase_2]

phase_4_quality:
  agent: guardian-agent
  gates:
    - clarity: 70
    - standards: 90
```

### Context Integration
All OS 2.0 commands MUST:
1. Query ProjectContextServer first
2. Pass context to agents
3. Maintain context through phases
4. Update vibe.db with learnings

### Quality Gates
Commands enforce:
- **Clarity:** Minimum score 70/100
- **Compliance:** Block on violations
- **Standards:** Minimum score 90/100

## Command Patterns

### Domain Detection
```
/orca "build a React component"  → webdev pipeline
/orca "create iOS view"          → iOS pipeline
/orca "analyze user metrics"     → data pipeline
/orca "write about AI safety"    → SEO pipeline
```

### Phase Execution
```
START → Context Query → Phase 1 → Phase 2 → Phase 3 → Quality Gates → OUTPUT
```

### Error Handling
- Context failures → Block execution
- Agent failures → Retry with context
- Quality failures → Iterate or escalate

## Configuration

### Phase Configs Location
`~/.claude/docs/reference/phase-configs/`
- `seo-phase-config.yaml`
- `webdev-phase-config.yaml`
- `ios-phase-config.yaml`
- `data-phase-config.yaml`

### Global Settings
`~/.claude.json` - MCP server registration
`~/.claude/settings.json` - Command settings

---

_This reference covers OS 2.0 commands only. Legacy v1 commands have been archived._