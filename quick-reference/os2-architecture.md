# OS 2.0 Architecture Quick Reference

**Last Updated:** 2025-11-19

## Core Architecture

### Foundation: Context-First Orchestration
```
ProjectContextServer (MCP)
    ↓
Domain Orchestrator (/orca)
    ↓
Pipeline Phases (1-4)
    ↓
Quality Gates
    ↓
Output + Learning
```

## Key Components

### 1. ProjectContextServer (MCP)
- **Purpose:** Mandatory context provider
- **Location:** `~/.claude/mcp/project-context-server/`
- **Features:**
  - Semantic search across project
  - Historical context retrieval
  - Standards and decisions database
- **Integration:** Required for ALL operations

### 2. Orchestrator (/orca)
- **Purpose:** Central coordination engine
- **Domains:** webdev, iOS, data, SEO, brand
- **Flow:**
  1. Detect domain from request
  2. Query ProjectContextServer
  3. Execute phase pipeline
  4. Enforce quality gates
  5. Update memory systems

### 3. Agent Constraint Framework
Five constraint categories:
1. **Scope Constraints** - Boundaries of operation
2. **Quality Constraints** - Standards to maintain
3. **Integration Constraints** - System connections
4. **Resource Constraints** - Limits (tokens, time, APIs)
5. **Behavioral Constraints** - Style and approach

### 4. Memory Systems

#### AgentDB (Ephemeral)
- Pipeline state cache
- Cross-agent communication
- Session-scoped data
- Cleared after pipeline

#### vibe.db (Persistent)
- Institutional knowledge
- Learned patterns
- User preferences
- Historical decisions

### 5. Quality Gates

#### Clarity Gate
- **Threshold:** 70/100
- **Measures:** Readability, structure, coherence
- **Action:** Iterate if below threshold

#### Compliance Gate
- **Type:** Hard block
- **Checks:** Security, standards, policies
- **Action:** Fail pipeline if violated

#### Standards Gate
- **Threshold:** 90/100
- **Measures:** Best practices, patterns
- **Action:** Warning if below, block if critical

## Directory Structure

```
~/.claude/
├── agents/              # OS 2.0 agent definitions
├── commands/            # Orchestrator commands
├── mcp/                 # MCP servers
│   └── project-context-server/
├── docs/
│   └── reference/
│       └── phase-configs/  # Pipeline configurations
└── memory/              # vibe.db location

claude-vibe-config/      # This repo (mirror/record)
├── agents/              # Agent records
├── commands/            # Command records
├── docs/                # Documentation
├── quick-reference/     # This reference
└── .deprecated/         # Archived v1 content
```

## Phase Pipeline Pattern

### Standard 4-Phase Structure
```yaml
Phase 1: Research/Analysis
  - Context gathering
  - Domain exploration
  - Constraint identification

Phase 2: Strategy/Planning
  - Architecture decisions
  - Approach selection
  - Resource planning

Phase 3: Implementation
  - Core execution
  - Building/Creating
  - Integration

Phase 4: Quality/Validation
  - Standards enforcement
  - Testing/Verification
  - Documentation
```

## Integration Flow

### Request Lifecycle
```
User Request
    ↓
/orca Command
    ↓
Domain Detection
    ↓
ProjectContextServer Query ← [MANDATORY]
    ↓
Phase 1 Agent (with context)
    ↓
AgentDB Update
    ↓
Phase 2 Agent (with context + Phase 1 output)
    ↓
Phase 3 Agent (with accumulated context)
    ↓
Phase 4 Quality Gates
    ├─ Pass → Output + vibe.db update
    └─ Fail → Iterate or escalate
```

## Configuration Files

### Phase Configurations
Location: `~/.claude/docs/reference/phase-configs/`
- `seo-phase-config.yaml`
- `webdev-phase-config.yaml`
- `ios-phase-config.yaml`
- `data-phase-config.yaml`
- `brand-phase-config.yaml`

### MCP Registration
File: `~/.claude.json`
```json
{
  "mcp-servers": {
    "project-context": {
      "path": "~/.claude/mcp/project-context-server/",
      "required": true
    }
  }
}
```

## Key Principles

1. **Context is Mandatory** - No operation without ProjectContextServer
2. **Phases are Sequential** - Each builds on previous
3. **Quality is Non-Negotiable** - Gates must pass
4. **Memory is Dual** - Ephemeral for pipeline, persistent for learning
5. **Constraints Guide Behavior** - 5-category framework for all agents

---

_OS 2.0 represents a complete architectural shift from v1's reactive pattern to proactive, context-first orchestration._