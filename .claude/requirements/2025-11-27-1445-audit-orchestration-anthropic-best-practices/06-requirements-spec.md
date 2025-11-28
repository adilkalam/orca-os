# Blueprint: OS 2.3 Anthropic Best Practices Alignment

**Requirement ID:** audit-orchestration-anthropic-best-practices
**Status:** Complete
**Date:** 2025-11-27

---

## Problem Statement

OS 2.3 is a sophisticated multi-agent orchestration system, but it was built before several key Anthropic engineering posts were published. This audit identifies gaps where our implementation diverges from Anthropic's official recommendations for building effective agent systems.

## Solution Overview

Align OS 2.3 with Anthropic best practices through targeted improvements in:
1. Tool configuration (FIXED)
2. Context management
3. Effort scaling
4. Thinking triggers
5. Agent structure

---

## Functional Requirements

### FR1: Tool Format Standardization (COMPLETED)
- **Status**: DONE (fixed 68 agents on 2025-11-27)
- All agent `tools` fields use comma-separated strings
- Deployed to `~/.claude/agents/`

### FR2: ProjectContext Response Format
- Add `response_format` parameter to `query_context`
- Options: `concise` (default), `detailed`, `minimal`
- `concise`: Current behavior (summary + key files)
- `detailed`: Full file contents, expanded history
- `minimal`: Just file paths and one-line summaries

### FR3: Complexity-Based Effort Scaling
- Add `complexity_tier` detection to `/orca` commands
- Tiers and agent counts:
  - `simple` (1-2 files, single concern): Light orchestrator only
  - `medium` (3-10 files, multi-concern): Grand-architect + 2-4 specialists
  - `complex` (10+ files, cross-cutting): Grand-architect + 5-10 specialists
- Detection heuristics in `/orca-{domain}` commands

### FR4: Extended Thinking Integration
- Add thinking triggers to grand-architect prompts
- Pattern: "Think through the architecture before delegating"
- Use "think harder" for complex cross-cutting tasks

### FR5: Progressive Disclosure for Large Agents
- Restructure agents with 100+ lines
- Pattern: Core instructions in agent markdown, reference external docs
- External docs in `docs/reference/agent-guides/`

---

## Technical Requirements

### TR1: Agent YAML Format (COMPLETE)
```yaml
# Correct format (implemented)
tools: Task, Read, Edit, MultiEdit, Grep, Glob, Bash
model: opus  # or sonnet, haiku, inherit
```

### TR2: ProjectContext MCP Enhancement
- File: `mcp/project-context-server/`
- Add parameter:
```typescript
interface QueryContextParams {
  domain: string;
  task: string;
  projectPath?: string;
  maxFiles?: number;
  includeHistory?: boolean;
  responseFormat?: 'concise' | 'detailed' | 'minimal';  // NEW
}
```

### TR3: Complexity Detection in /orca
- File: `commands/orca-*.md`
- Add heuristics:
```markdown
## Complexity Detection
Before confirming team:
1. Count files likely affected (from context bundle)
2. Assess cross-cutting concerns
3. Set complexity_tier: simple | medium | complex
4. Adjust team size accordingly
```

### TR4: Agent Prompt Structure
- Current: Monolithic markdown
- Target: Core + references pattern
```markdown
---
name: ios-builder
tools: Task, Read, Edit, MultiEdit, Grep, Glob, Bash
---
# iOS Builder

Core instructions here (50-70 lines max).

## Extended Guidance
For detailed patterns, see:
- `docs/reference/ios-patterns.md`
- `docs/reference/swiftui-guidelines.md`
```

---

## RA-Tagged Decisions

### #PATH_DECISION: Confirmed Correct
1. **Orchestrator-worker pattern** - Matches Anthropic's multi-agent research architecture
2. **Opus for grand-architects, Sonnet for specialists** - Aligns with "smarter model for orchestration"
3. **Role boundaries** - Orchestrators don't write code, specialists do
4. **Comma-separated tools** - Official format per subagents documentation

### #PATH_DECISION: Changes Needed
1. **Progressive disclosure** - Should split large agents into core + references
2. **Complexity heuristics** - Should scale agent count to task complexity
3. **Response format** - Should let agents choose context verbosity

### #COMPLETION_DRIVE: Assumptions
1. 68 agents is appropriate count (not verified against token costs)
2. Current context bundle size is within efficient range
3. Workshop + vibe.db memory is sufficient (no agent-accessible memory yet)

### #CONTEXT_DEGRADED: Unknown
1. Actual token usage per pipeline invocation
2. Agent reasoning quality (no extended thinking visibility)
3. Real-world failure modes in production pipelines

---

## Acceptance Criteria

### AC1: Tools Format
- [x] All 68 agents use comma-separated tools
- [x] Deployed to ~/.claude/agents/

### AC2: ProjectContext Enhancement
- [ ] `response_format` parameter added
- [ ] All three formats work correctly
- [ ] Default is `concise`

### AC3: Complexity Scaling
- [ ] `/orca` commands detect complexity
- [ ] Team size adjusts based on tier
- [ ] User can override with explicit agent count

### AC4: Thinking Triggers
- [ ] Grand-architects prompt includes "think through"
- [ ] Complex tasks use "think harder"

### AC5: Progressive Disclosure
- [ ] Largest 5 agents restructured
- [ ] External reference docs created
- [ ] Agents still function correctly

---

## Implementation Priority

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| P0 | Tools format fix | DONE | Critical |
| P1 | Complexity heuristics | Medium | High |
| P1 | Response format parameter | Medium | High |
| P2 | Thinking triggers | Low | Medium |
| P2 | Progressive disclosure | High | Medium |
| P3 | Agent self-improvement | High | Long-term |

---

## Next Steps

```
/orca-os-dev Implement complexity heuristics in /orca commands
```

Or implement incrementally:
1. Add complexity detection to `/orca-ios` first
2. Validate with real iOS task
3. Roll out to other domains
