# Context Findings: Agent Self-Improvement Research Synthesis

## Key Patterns from Research

### Pattern 1: Pain-to-Pattern Loop (Equilateral Agents)

The most valuable insight from Equilateral Agents:

```
Incident → Cost Analysis → Root Cause → Standard → Enforcement → Measurement
```

**Formula**: "What Happened + The Cost + The Rule = Standard"

This is exactly what Workshop gotchas/decisions already capture, but there's no automated loop back to agent prompts.

### Pattern 2: Structured Improvement Items (Pantheon)

Pantheon's `agent_improvements.schema.jsonnet` provides a clean schema:

```json
{
  "agent_name": "ios-builder",
  "issue_description": "Generates SwiftUI code that doesn't compile",
  "recommended_changes": "Add SwiftUI version check before using newer APIs",
  "priority": "high",
  "example_feedback": "Used NavigationStack which requires iOS 16+"
}
```

This could feed directly into agent YAML updates.

### Pattern 3: Execution Tracking (Claude Flow)

Claude Flow tracks per-execution:
- Success rate %
- Average score
- Execution time
- Strategy used (conservative/balanced/aggressive)

Then uses **Exponential Moving Average (α=0.3)** to smooth results over time.

### Pattern 4: Narrative Extraction (Claude Self-Reflect)

Claude Self-Reflect v7.0 transforms raw conversations into rich narratives:
- **Problem**: What went wrong
- **Solution**: What fixed it
- **Tools Used**: Which tools were effective
- **Concepts**: Technical concepts involved
- **Files**: Files that were modified

This achieves 9.3x better search quality than raw excerpts.

---

## Gap Analysis: OS 2.3 vs Self-Improvement

### What OS 2.3 Has

| Component | Current State |
|-----------|--------------|
| Workshop | Records decisions, gotchas, standards (manual) |
| vibe.db | Semantic search over code (not execution history) |
| `/audit` command | Post-task review (but doesn't feed back to agents) |
| Agent Task tool | Spawns agents (but doesn't track outcomes systematically) |
| ProjectContext MCP | Context bundles (but no learning loop) |

### What OS 2.3 Lacks

| Missing | Impact |
|---------|--------|
| Execution outcome tracking | Can't measure agent success/failure rates |
| Pattern recognition across executions | Can't identify recurring issues |
| Automated improvement proposals | Manual-only prompt updates |
| Feedback loop to agents | Learnings don't propagate to agent definitions |
| Success metrics per agent | Can't identify underperforming agents |

---

## Proposed Architecture: Self-Improvement Loop

### The Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Execute Task                                                   │
│       ↓                                                         │
│  Record Outcome (success/failure, issues, time, files)          │
│       ↓                                                         │
│  Store in Workshop (.claude/memory/workshop.db)                 │
│       ↓                                                         │
│  /audit or Periodic Harvest                                     │
│       ↓                                                         │
│  Identify Patterns (3+ occurrences of same issue)               │
│       ↓                                                         │
│  Generate Improvement Proposal (agent_improvements schema)      │
│       ↓                                                         │
│  User Approves/Rejects                                          │
│       ↓                                                         │
│  Update Agent Definition / CLAUDE.md / Workshop Standard        │
│       ↓                                                         │
│  Measure Impact (track if issue recurs)                         │
│       └────────────────────────────────────────────────────────┘
```

### Where Data Lives

| Data | Storage |
|------|---------|
| Execution outcomes | Workshop `task_history` entries |
| Patterns identified | Workshop `gotcha` entries (tagged `pattern`) |
| Improvement proposals | `.claude/orchestration/temp/improvement-proposals.json` |
| Approved changes | Agent YAML files + Workshop `decision` entries |
| Success metrics | Workshop `note` entries (tagged `metrics`) |

### Integration Points

1. **Grand-architects** record task outcomes at pipeline completion
2. **`/audit`** command triggers pattern analysis
3. **Workshop CLI** already supports structured entries
4. **Agent YAML** files can be programmatically updated
5. **CLAUDE.md** can reference Workshop standards

---

## Design Options

### Option A: Lightweight (Workshop-Native)

Use Workshop as the only storage:
- Record outcomes as `task_history` entries
- Record patterns as `gotcha` entries with `pattern` tag
- Record improvements as `decision` entries
- No new infrastructure

**Pros**: Simple, uses existing Workshop
**Cons**: No semantic search, limited analysis

### Option B: Claude Self-Reflect Integration

Add Claude Self-Reflect MCP for semantic search:
- Use `store_reflection` to record execution outcomes
- Use `reflect_on_past` to find similar past issues
- Generate improvement proposals from search results

**Pros**: Semantic search, 9.3x better pattern matching
**Cons**: Requires Docker, more infrastructure

### Option C: Hybrid (Workshop + Analysis Script)

Workshop for storage + Python script for analysis:
- Workshop stores raw data
- Script queries Workshop, identifies patterns, proposes improvements
- Script outputs structured improvement proposals

**Pros**: Best of both, can evolve independently
**Cons**: More moving parts

---

## RA Tags

### #PATH_DECISION: Made
1. **Workshop as primary storage** - Already integrated, structured, persistent
2. **Structured outcome recording** - Use Workshop `task_history` with standard fields
3. **User approval required** - Never auto-modify agents without confirmation

### #PATH_DECISION: Needed
1. **Semantic search integration** - Whether to add Claude Self-Reflect
2. **Improvement proposal format** - JSON vs markdown
3. **Trigger mechanism** - Automatic (post-task) vs manual (`/audit`)

### #COMPLETION_DRIVE: Assumptions
1. Grand-architects can call Workshop CLI from within Task execution
2. Pattern threshold of 3 occurrences is appropriate
3. Users want improvement proposals, not automatic changes

### #CONTEXT_DEGRADED: Unknown
1. Actual failure rates of current agents (no tracking exists)
2. User workflow for reviewing/approving improvements
3. Whether improvement proposals should include code diffs

---

## Priority Recommendations

| Priority | Feature | Effort |
|----------|---------|--------|
| **P0** | Outcome recording in grand-architects | Low |
| **P0** | Improvement proposal schema | Low |
| **P1** | `/audit` enhancement for pattern analysis | Medium |
| **P1** | Agent YAML programmatic updates | Medium |
| **P2** | Claude Self-Reflect integration | High |
| **P3** | Automatic success metrics tracking | Medium |
