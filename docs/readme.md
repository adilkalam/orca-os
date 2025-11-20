# OS 2.0 Documentation

**Last Updated:** 2025-11-19
**Status:** Core implementation complete

## Overview

OS 2.0 is a context-first, domain-driven orchestration system for Claude Code that makes v1's context amnesia structurally impossible.

**Core Innovation:** ProjectContextServer as a mandatory first-class service - no agent can work without project awareness.

---

## Quick Start

### For Operators (Running Tasks)

1. **Use /orca for all work:**
   ```bash
   /orca "Add dark mode toggle to settings page"
   ```

2. **Orca detects domain and activates pipeline:**
   - Webdev → `pipelines/webdev-pipeline.md`
   - iOS → `pipelines/ios-pipeline.md` (coming soon)
   - Data → `pipelines/data-pipeline.md` (coming soon)
   - SEO → `pipelines/seo-pipeline.md` (coming soon)
   - Brand → `pipelines/brand-pipeline.md` (coming soon)

3. **Every pipeline starts with mandatory context query:**
   - ProjectContextServer loads relevant files, past decisions, standards
   - Agents receive full ContextBundle
   - Work proceeds with complete project awareness

### For Builders (Extending System)

1. **Read architecture docs:**
   - `architecture/vibe-code-os-v2-spec.md` - Full v2 specification
   - `OS-2.0-11-19-25.md` - Current state documentation

2. **Understand pipelines:**
   - `pipelines/webdev-pipeline.md` - Frontend workflow (reference implementation)

3. **Study ProjectContextServer:**
   - `/mcp/project-context-server/README.md` - MCP server documentation

---

## Documentation Structure

```
docs/
├── README.md                    ← You are here
│
├── architecture/                ← System design & specifications
│   ├── vibe-code-os-v2-spec.md         ← Full OS 2.0 specification
│   ├── chaos-prevention.md             ← File creation limits
│   └── agents.md                       ← Agent system overview
│
├── pipelines/                   ← Domain workflow specifications
│   └── webdev-pipeline.md              ← Frontend/web (REFERENCE)
│
├── design/                      ← Design system documentation
│   ├── design-dna/                     ← Design tokens
│   ├── design-system-guide.md          ← Design system guide
│   └── design-ocd-meta-rules.md        ← Design precision rules
│
├── memory/                      ← Memory system documentation
│   ├── workshop.md                     ← Workshop memory system
│   └── memory-systems-overview.md      ← All memory systems
│
└── sessions/                    ← Implementation notes & learnings
```

---

## Core Concepts

### 1. Context-First Architecture

**Problem (v1):** Agents worked without awareness of existing code, leading to rewrites and inconsistencies.

**Solution (v2):** ProjectContextServer is MANDATORY. Every operation starts with:

```typescript
const contextBundle = await queryContext({
  domain: 'webdev',
  task: 'Add dark mode',
  projectPath: '/path/to/project',
  maxFiles: 10,
  includeHistory: true
});

// Returns:
{
  relevantFiles: [...],      // Semantically related files
  projectState: {...},        // Current structure
  pastDecisions: [...],       // Why things are this way
  relatedStandards: [...],    // Rules to enforce
  similarTasks: [...],        // Past attempts & outcomes
  designSystem: {...}         // (webdev) Tokens & constraints
}
```

**Result:** Agents have full project awareness before writing a single line of code.

### 2. Domain Pipelines

**Problem (v1):** Ad-hoc agent teams with unclear workflows.

**Solution (v2):** Specialized pipelines for each domain:

- **Webdev:** Context → Analysis → Implementation → Standards → Design QA → Build → Complete
- **iOS:** Context → Requirements → Architecture → Implementation → Testing → Complete
- **Data:** Context → Discovery → Parallel Analysis → Synthesis → Verification → Complete
- **SEO:** Context → Research → Brief → Draft → Optimization → Complete
- **Brand:** Context → Strategy → Copywriting → Visual → Review → Complete

Each pipeline defines:
- Phases (sequential steps)
- Agents (who does what)
- Gates (quality thresholds)
- Constraints (what's forbidden)
- Artifacts (what gets saved)

### 3. Quality Gates

**Problem (v1):** No systematic quality enforcement.

**Solution (v2):** Hard gates that block progression:

```yaml
gates:
  standards_gate:
    threshold: 90
    blocks_if_failed: true
    saves_violations_as_standards: true

  design_qa_gate:
    threshold: 90
    blocks_if_failed: true
    saves_issues_as_standards: true

  build_gate:
    threshold: success
    blocks_if_failed: true
```

**Result:** Work cannot proceed if quality bars aren't met. Violations become standards.

### 4. Constraint Framework

**Problem (v1):** Agents could do anything, leading to chaos.

**Solution (v2):** Every agent has explicit constraints:

```yaml
required_context:
  - ContextBundle from ProjectContextServer
  - design-dna.json
  - Related standards

forbidden_operations:
  - inline_styles: "Use tokens only"
  - component_rewrites: "Edit, never rewrite"
  - arbitrary_values: "Design system only"

verification_required:
  - lint_check
  - typecheck
  - standards_audit
  - build
```

**Result:** Agents have clear boundaries and can't violate core principles.

### 5. Learning System (vibe.db)

**Problem (v1):** No memory - same mistakes repeated.

**Solution (v2):** SQLite database stores institutional knowledge:

```sql
-- Past decisions with reasoning
decisions (id, domain, decision, reasoning, context, tags)

-- Standards learned from failures
standards (id, what_happened, cost, rule, domain, enforced_count)

-- Task execution history
task_history (id, domain, task, outcome, learnings, files_modified)

-- Audit trail
events (id, timestamp, type, data)
```

**Result:** System learns from every execution. Standards auto-enforce.

---

## Key Files

### MCP Server (Deployed)

Location: `~/.claude/mcp/project-context-server/` (deployed)
Source: `/mcp/project-context-server/` (this repo)

**Purpose:** Mandatory context service

**Tools:**
- `query_context` - Get project context (MANDATORY before work)
- `save_decision` - Record architectural decisions
- `save_standard` - Create enforceable rules from failures
- `save_task_history` - Record task outcomes
- `index_project` - Index codebase for semantic search

### Orchestrator (Command)

Location: `~/.claude/commands/orca.md` (deployed)
Source: `/commands/orca.md` (this repo)

**Purpose:** Pure coordinator (never writes code)

**Workflow:**
1. Detect domain from request
2. Query ProjectContextServer (MANDATORY)
3. Activate appropriate pipeline
4. Monitor phase progression
5. Enforce quality gates
6. Save learnings to vibe.db

### Project Memory (Database)

Location: `.claude/project/vibe.db` (per-project)

**Purpose:** Persistent project memory

**Tables:**
- `decisions` - Why choices were made
- `standards` - Rules learned from failures
- `task_history` - Past attempts and outcomes
- `events` - Full audit trail

### Phase State (Tracker)

Location: `.claude/project/phase_state.json` (per-execution)

**Purpose:** Track workflow progression

**Structure:**
```json
{
  "domain": "webdev",
  "current_phase": "implementation",
  "phases": { ... },
  "gates_passed": [ ... ],
  "gates_failed": [ ... ],
  "artifacts": [ ... ]
}
```

---

## Philosophy

### Documentation as Code

**Principle:** Configurations and documentation drive behavior, not buried prompts.

**Implementation:**
- Pipelines are specs (`.md` files)
- Constraints are configs (`required_context`, `forbidden_operations`)
- States are data (`phase_state.json`, `vibe.db`)
- Documentation lives alongside code

### Context is Mandatory, Not Optional

**Principle:** Make v1's context amnesia structurally impossible.

**Implementation:**
- ProjectContextServer is first-class service
- Every pipeline starts with `query_context`
- No agent can proceed without ContextBundle
- Context includes: files, decisions, standards, history

### Learn from Every Execution

**Principle:** System improves autonomously over time.

**Implementation:**
- Violations → Standards (auto-saved to vibe.db)
- Task outcomes → History (analyzed for patterns)
- Gate failures → Constraints (tightened for future)
- Every execution leaves learnings

### Quality is Enforced, Not Hoped For

**Principle:** Hard gates that block bad work.

**Implementation:**
- Standards Gate (≥90)
- Design QA Gate (≥90)
- Build Gate (must succeed)
- Gates block progression if failed
- No bypassing gates to "move faster"

---

## Development Status

### ✅ Complete (Week 1)

1. **ProjectContextServer** - Mandatory context service
   - MCP server with 5 tools
   - vibe.db schema (decisions, standards, task_history)
   - Semantic file search (keyword-based)
   - Context bundling

2. **/orca** - Pure orchestrator
   - Domain detection
   - Pipeline activation
   - Phase state management
   - Gate enforcement

3. **Webdev Pipeline** - Reference implementation
   - 9 phases fully specified
   - 4 quality gates defined
   - Hard constraints documented
   - Integration with ProjectContextServer

4. **Documentation Structure** - Docs as code
   - Architecture docs
   - Pipeline specs
   - Core concepts documented

### 🚧 In Progress (Week 2)

5. **Constraint Framework** - Agent constraints as config
6. **iOS Pipeline** - iOS development workflow
7. **Data Pipeline** - Analysis workflow
8. **Phase Configs** - JSON/YAML for orchestration

### 📋 Planned (Week 3+)

9. **Claude Context MCP Integration** - True vector search
10. **AgentDB Integration** - 96x-164x performance boost
11. **SEO Pipeline** - Content/SEO workflow
12. **Brand Pipeline** - Creative workflow
13. **Hybrid Learning** - ACE-style adaptation (with constraints)

---

## For More Information

- **Full Specification:** `architecture/vibe-code-os-v2-spec.md`
- **Current State:** `OS-2.0-11-19-25.md`
- **Research Log:** `OS v2.0 11-19-25 Log.md`
- **Example Pipeline:** `pipelines/webdev-pipeline.md`
- **MCP Server:** `/mcp/project-context-server/README.md`

---

_OS 2.0: Making context amnesia structurally impossible._
