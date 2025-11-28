# Requirements Spec: Research Lane v0.1 Fixes

**ID:** research-lane-v01-fixes
**Status:** Blueprint Complete
**Date:** 2025-11-27
**Domain:** OS-Dev

---

## Problem Statement

The Research Lane v0.1 implementation has configuration issues that will cause silent failures at runtime. The most critical issue is that Firecrawl MCP tools are described in agent prose but not included in the `tools:` frontmatter, meaning subagents cannot actually use Firecrawl. Additionally, phase config references non-existent agents, and key Anthropic patterns (parallel execution, extended thinking) are not encoded.

## Solution Overview

Fix all configuration issues to create a working Research Lane that:
1. Actually uses Firecrawl MCP tools for web research
2. Has correct agent references in phase config
3. Implements Anthropic's parallel subagent pattern
4. Includes extended thinking via sequential-thinking MCP
5. Creates the missing fact-checker agent
6. Corrects documentation counts

---

## Functional Requirements

### FR1: Firecrawl Tool Integration

Subagents must have Firecrawl MCP tools in their `tools:` frontmatter.

| Agent | Tools to Add |
|-------|--------------|
| `research-web-search-subagent` | `mcp__firecrawl__firecrawl_search`, `mcp__firecrawl__firecrawl_scrape` |
| `research-site-crawler-subagent` | `mcp__firecrawl__firecrawl_map`, `mcp__firecrawl__firecrawl_crawl`, `mcp__firecrawl__firecrawl_scrape` |

**#PATH_DECISION:** Specialized tool sets per agent rather than all tools to both. This maintains separation of concerns.

### FR2: Lead Agent Tool Enhancement

`research-lead-agent` must have:
- `Write` - for phase_state.json updates
- `mcp__sequential-thinking__sequentialthinking` - for structured planning

### FR3: Parallel Execution Guidance

Add explicit instructions to `research-lead-agent.md` for spawning subagents in parallel:
- When to parallelize (independent subquestions)
- How to parallelize (multiple Task calls in one response)
- Concrete example with 3-4 parallel invocations

### FR4: Fact Checker Agent

Create `agents/research/research-fact-checker.md` as an optional gate:
- Validates factual claims against evidence
- Checks for obvious contradictions
- Flags high-risk claims (medical, financial, legal)
- Returns PASS/CAUTION/FAIL like other gates

### FR5: Phase Config Alignment

Fix `docs/reference/phase-configs/research-phase-config.yaml`:
- Remove references to `research-orchestrator` and `research-light-orchestrator`
- Update complexity tier routing to use `/research` command (self)
- Fix `research-writer` → `research-answer-writer` / `research-deep-writer`
- Update `research-fact-checker` to be properly optional

---

## Technical Requirements

### TR1: Agent File Changes

#### `agents/research/research-lead-agent.md`

```yaml
# BEFORE
tools: Task, Read, Grep, Glob, WebSearch, WebFetch, Bash, AskUserQuestion

# AFTER
tools: Task, Read, Write, Grep, Glob, WebSearch, WebFetch, Bash, AskUserQuestion, mcp__sequential-thinking__sequentialthinking
```

Add new section after "3.4 Evidence Gathering":

```markdown
### 3.4.1 Parallel Subagent Execution

**CRITICAL: Spawn subagents in parallel when subquestions are independent.**

When delegating to subagents via Task:
- If subquestions can be researched independently → issue multiple Task calls in the SAME response
- The system executes parallel Task calls concurrently
- Do NOT wait for one subagent to complete before starting another

**Example - 4 independent subquestions:**

In a single response, call Task 4 times:

1. Task → research-web-search-subagent: "Subquestion A about market size"
2. Task → research-web-search-subagent: "Subquestion B about competitors"
3. Task → research-site-crawler-subagent: "Subquestion C about vendor documentation"
4. Task → research-web-search-subagent: "Subquestion D about recent news"

This parallel execution can reduce research time by 70-90% compared to sequential.

**When NOT to parallelize:**
- Subquestions that depend on answers from earlier subquestions
- When you need to refine the search based on initial results
- Gap-filling after synthesis (one focused query at a time)
```

#### `agents/research/research-web-search-subagent.md`

```yaml
# BEFORE
tools: Read, Write, WebSearch, WebFetch, Bash

# AFTER
tools: Read, Write, WebSearch, WebFetch, Bash, mcp__firecrawl__firecrawl_search, mcp__firecrawl__firecrawl_scrape
```

#### `agents/research/research-site-crawler-subagent.md`

```yaml
# BEFORE
tools: Read, Write, WebSearch, WebFetch, Bash

# AFTER
tools: Read, Write, WebSearch, WebFetch, Bash, mcp__firecrawl__firecrawl_map, mcp__firecrawl__firecrawl_crawl, mcp__firecrawl__firecrawl_scrape
```

### TR2: New Agent File

Create `agents/research/research-fact-checker.md`:

```yaml
---
name: research-fact-checker
description: >
  Optional fact-checking gate for the Research lane. Validates factual claims
  against evidence and flags high-risk or contradictory statements.
tools: Read, Grep, Glob, WebSearch, WebFetch
model: inherit
---
```

Content should include:
- Spot-check methodology for key claims
- High-risk domain detection (medical, financial, legal)
- Contradiction detection between claims
- Output format: PASS/CAUTION/FAIL with specific findings

### TR3: Phase Config Updates

File: `docs/reference/phase-configs/research-phase-config.yaml`

```yaml
# Fix complexity_tiers
complexity_tiers:
  simple:
    description: Narrow factual questions or quick lookups
    routing: direct-delegate  # /research handles directly
    # ... rest unchanged

  medium:
    description: Multi-part questions requiring several sources
    routing: full-pipeline    # Uses research-lead-agent
    # ... rest unchanged

  deep:
    routing: full-pipeline    # Uses research-lead-agent
    # ... rest unchanged
```

```yaml
# Fix phase agent references
phases:
  - name: report_draft
    agent: research-answer-writer  # or research-deep-writer based on mode
    # Add note: "Agent chosen based on mode: standard → research-answer-writer, deep → research-deep-writer"
```

```yaml
# Update optional_phases
optional_phases:
  - name: fact_check_gate
    agent: research-fact-checker
    trigger: high_risk_topic OR user_requested
    # ... rest unchanged
```

### TR4: Documentation Updates

#### `docs/agents.md`

1. Update count: "**Total: 78 agents**" (adding fact-checker)
2. Update Research Lane table:

```markdown
## Research Lane (8 agents)

| Agent | Role |
|-------|------|
| `research-lead-agent` | Lead researcher, plans multi-agent research |
| `research-web-search-subagent` | Firecrawl-first web search & scraping |
| `research-site-crawler-subagent` | Firecrawl site mapping & crawling |
| `research-answer-writer` | Structured answer writer (standard mode) |
| `research-deep-writer` | Long-form academic writer (deep mode) |
| `research-citation-gate` | Citation insertion and audit |
| `research-consistency-gate` | Consistency and limitations gate |
| `research-fact-checker` | Optional fact validation gate |
```

3. Fix Expo lane: clarify count matches table (11 agents including test-generator)

#### `docs/pipelines/research-pipeline.md`

Add note about citation-gate:

```markdown
## Agent Roles Note

**Exception: research-citation-gate**

Unlike other gates that only validate, `research-citation-gate` has Write permission
and modifies the report to insert citations. This follows Anthropic's architecture
where the Citation Agent produces the final cited output. The "gate" naming reflects
its position in the pipeline (post-draft, pre-consistency) rather than write restrictions.
```

#### `CLAUDE.md`

Add `.claude/research/` to documented structure:

```markdown
### `.claude/research/` Structure

Research artifacts that persist across sessions:

```
.claude/research/
├── evidence/       ← Evidence Notes from subagents
├── reports/        ← Final and draft research reports
└── cache/          ← Cached search results (optional)
```

**Note:** Unlike `.claude/orchestration/temp/`, research artifacts may be reused
across sessions for related queries.
```

---

## RA-Tagged Decisions

### `#PATH_DECISION` - Resolved

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Lead agent model | inherit (Opus 4.5 default) | User confirmed Opus is default for all |
| Orchestrator agents | None (command orchestrates) | Simpler, avoids duplication |
| Citation-gate naming | Keep as "gate" | Document exception, follows Anthropic |
| Evidence path | `.claude/research/` | Persistence across sessions |
| Subagent tools | Specialized per agent | Separation of concerns |
| Fact-checker | Create new agent | User requested |

### `#COMPLETION_DRIVE` - Assumptions

| Assumption | Mitigation |
|------------|------------|
| Firecrawl MCP is available | Fallback to WebSearch/WebFetch documented in agents |
| Sequential-thinking MCP works for research planning | Can remove if issues arise |

### `#POISON_PATH` - Warnings

None identified.

---

## Acceptance Criteria

### AC1: Firecrawl Actually Works
- [ ] `research-web-search-subagent` can call `mcp__firecrawl__firecrawl_search`
- [ ] `research-site-crawler-subagent` can call `mcp__firecrawl__firecrawl_map`
- [ ] Evidence Notes are created in `.claude/research/evidence/`

### AC2: Phase Config Consistency
- [ ] No references to non-existent agents
- [ ] All agent names match actual files in `agents/research/`
- [ ] Complexity routing is clear and correct

### AC3: Parallel Execution
- [ ] Lead agent instructions include parallel Task example
- [ ] Instructions clearly state when to parallelize vs sequence

### AC4: Documentation Accuracy
- [ ] Agent count matches actual agents
- [ ] Citation-gate exception documented
- [ ] `.claude/research/` path documented in CLAUDE.md

### AC5: New Fact-Checker Agent
- [ ] `agents/research/research-fact-checker.md` exists
- [ ] Has appropriate tools and instructions
- [ ] Referenced correctly in phase config optional_phases

---

## Files to Create/Modify

| File | Action | Priority |
|------|--------|----------|
| `agents/research/research-lead-agent.md` | Modify (tools + parallel section) | Critical |
| `agents/research/research-web-search-subagent.md` | Modify (add Firecrawl tools) | Critical |
| `agents/research/research-site-crawler-subagent.md` | Modify (add Firecrawl tools) | Critical |
| `agents/research/research-fact-checker.md` | Create | High |
| `docs/reference/phase-configs/research-phase-config.yaml` | Modify (fix references) | High |
| `docs/agents.md` | Modify (fix counts) | Medium |
| `docs/pipelines/research-pipeline.md` | Modify (add citation-gate note) | Medium |
| `CLAUDE.md` | Modify (add .claude/research/ path) | Medium |

---

## Implementation Order

1. **Critical fixes first** (agents can actually use Firecrawl):
   - Modify research-web-search-subagent.md
   - Modify research-site-crawler-subagent.md

2. **Lead agent enhancement**:
   - Add Write and sequential-thinking to tools
   - Add parallel execution section

3. **New agent**:
   - Create research-fact-checker.md

4. **Config alignment**:
   - Fix phase-config agent references

5. **Documentation**:
   - Update counts in docs/agents.md
   - Add citation-gate note to pipeline docs
   - Document .claude/research/ in CLAUDE.md

---

## Next Step

```
/orca-os-dev Implement requirement research-lane-v01-fixes
```
