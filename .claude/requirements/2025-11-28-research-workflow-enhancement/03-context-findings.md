# Context Findings – Research Workflow Enhancement

## Current Architecture

### Entry Point: `/research` command (`commands/research.md`)

- Accepts `--deep` flag for long-form research
- Routes to `research-lead-agent` for medium/deep complexity
- Simple queries go directly to `research-specialist` or `data-researcher`
- Orchestrates writer and gate agents after lead agent returns

**Gap identified:** No `--time` flag support. #PATH_DECISION needed.

### Lead Agent: `research-lead-agent.md`

Current responsibilities:
- Scoping with query_type detection (already added)
- Research plan creation with subquestions
- Evidence gathering via parallel subagent delegation
- Synthesis and gap analysis
- Handoff to writers with structured brief

**Gap identified:** Gap analysis is free-form agent judgment, not structured JSON schema.

### Writers: `research-answer-writer.md`, `research-deep-writer.md`

Already updated with Perplexity format rules:
- No header start
- Inline citations only
- No hedging language
- Query type adaptations

### Subagents

| Agent | Purpose |
|-------|---------|
| `research-web-search-subagent` | Firecrawl search + scrape |
| `research-site-crawler-subagent` | Firecrawl map + crawl |
| `research-citation-gate` | Verify citations match sources |
| `research-consistency-gate` | Check RA tags, flag issues |

**Gap identified:** No retry limits tracked at subagent level.

---

## Files to Modify

| File | Changes Needed |
|------|----------------|
| `commands/research.md` | Add `--time` flag parsing, pass budget to lead agent |
| `agents/research/research-lead-agent.md` | Add structured loop decision, time budget awareness, iteration cap, retry tracking |
| `agents/research/research-web-search-subagent.md` | Add retry counting, `#RETRY_EXHAUSTED` tag |
| `agents/research/research-site-crawler-subagent.md` | Add retry counting |
| `docs/reference/phase-configs/research-phase-config.yaml` | Add `time_budget`, `max_iterations`, `retry_limit` fields |

---

## Key Patterns to Implement

### 1. Time Budget (from Open Deep Research)

```
--time 5   → 5 min total, 3.5 min research, 1.5 min synthesis
--time 10  → 10 min total, 8.5 min research, 1.5 min synthesis
(no flag)  → unlimited time, rely on iteration cap
```

Pass to lead agent: `time_budget_minutes`, `synthesis_reserve_minutes`

### 2. Structured Loop Decision (from Open Deep Research)

Replace free-form gap analysis with JSON schema:

```json
{
  "summary": "What we learned this iteration",
  "gaps": ["Unanswered aspect 1", "Unanswered aspect 2"],
  "shouldContinue": true,
  "nextSearchTopic": "Specific topic to search next",
  "urlToSearch": "Optional URL to extract from"
}
```

Decision logic:
- `shouldContinue = false` if gaps empty OR time budget exhausted OR max iterations reached
- Iteration cap: 7 (default), configurable

### 3. Retry Limits

Track at subagent level:
- `failed_attempts` counter per subquestion
- Max 3 retries before `#RETRY_EXHAUSTED`
- Aggregate in `phase_state.retry_events`

### 4. New RA Tag

Add `#RETRY_EXHAUSTED` to RA vocabulary – indicates a subquestion was abandoned after max retries.

---

## Integration Points

### phase_state.json additions

```json
{
  "research": {
    "time_budget": {
      "total_minutes": 5,
      "synthesis_reserve": 1.5,
      "started_at": "ISO timestamp",
      "remaining_minutes": 3.2
    },
    "iteration": {
      "current": 2,
      "max": 7
    },
    "retry_tracking": {
      "total_failed": 3,
      "exhausted_subquestions": ["subq-3"]
    },
    "loop_decision": {
      "summary": "...",
      "gaps": [],
      "shouldContinue": false
    }
  }
}
```

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Time budget too aggressive | Default to 10 min or unlimited; let user override |
| Structured schema too rigid | Allow `shouldContinue: true` with empty `nextSearchTopic` to let agent decide |
| Retry limit abandons important subquestions | Log to `#RETRY_EXHAUSTED`, surface in methodology |
