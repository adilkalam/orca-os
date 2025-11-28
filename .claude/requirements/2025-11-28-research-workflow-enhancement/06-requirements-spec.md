# Requirements Spec: Research Workflow Enhancement

**ID:** research-workflow-enhancement
**Domain:** os-dev
**Tier:** default
**Status:** complete
**Date:** 2025-11-28

---

## Problem Statement

Our research pipeline lacks the control mechanisms and output quality standards found in production research systems like Perplexity and Open Deep Research. Specifically:

1. **No time budgets** – Research can run indefinitely
2. **Unstructured loop decisions** – Gap analysis relies on agent judgment, not auditable schemas
3. **No retry limits** – Failed web operations can loop forever
4. **Inconsistent output format** – Writers lack strict formatting rules

## Solution Overview

Integrate patterns from Perplexity (format rules) and Open Deep Research (loop control) into our OS 2.4 research pipeline:

1. Add `--time N` flag with 5-minute default and synthesis reserve
2. Implement structured JSON loop decision schema
3. Add 3-retry limit with `#RETRY_EXHAUSTED` RA tag
4. Mode-based iteration caps (3 standard, 7 deep)
5. Apply Perplexity format rules to all research output (already done)

---

## Functional Requirements

### FR-1: Time Budget Flag

**`/research` command must accept `--time N` flag:**

| Input | Behavior |
|-------|----------|
| `--time 5` | 5 minutes total, 3.5 min research, 1.5 min synthesis reserve |
| `--time 10` | 10 minutes total, 8.5 min research, 1.5 min synthesis reserve |
| `--time unlimited` | No time limit, rely on iteration cap only |
| (no flag) | Default to 5 minutes |

**Synthesis reserve calculation:** `min(1.5, total * 0.3)`

### FR-2: Mode-Based Iteration Caps

| Mode | Max Iterations |
|------|---------------|
| Standard (no `--deep`) | 3 |
| Deep (`--deep`) | 7 |

Research must stop and synthesize when iteration cap is reached, even if gaps remain.

### FR-3: Structured Loop Decision Schema

Replace free-form gap analysis with structured JSON:

```json
{
  "iteration": 2,
  "summary": "What we learned this iteration",
  "gaps": ["Unanswered aspect 1", "Unanswered aspect 2"],
  "shouldContinue": true,
  "nextSearchTopic": "Specific topic to search next",
  "urlToSearch": "Optional URL to extract from",
  "timeRemainingMinutes": 2.3
}
```

**Decision logic:**
- `shouldContinue = false` if:
  - `gaps` is empty, OR
  - `timeRemainingMinutes < 1.5` (synthesis reserve), OR
  - `iteration >= max_iterations`

### FR-4: Retry Limits

Each subquestion/URL gets max 3 retry attempts:

- Track `failed_attempts` per subquestion in lead agent state
- After 3 failures: mark `#RETRY_EXHAUSTED`, move on
- Aggregate exhausted subquestions in `phase_state.research.retry_tracking`

### FR-5: New RA Tag

Add `#RETRY_EXHAUSTED` to RA vocabulary:
- Indicates subquestion abandoned after max retries
- Must be surfaced in Methodology section of final report

---

## Technical Requirements

### TR-1: Modify `commands/research.md`

**File:** `commands/research.md`

Changes:
1. Update argument-hint to include `--time N`
2. Add time budget parsing in Section 0
3. Pass `time_budget` and `max_iterations` to lead agent in Section 3

```markdown
## 0. Parse Arguments & Mode

`$ARGUMENTS` may include:
- `--deep` – deep mode (7 iterations)
- `--time N` – time budget in minutes (default: 5, "unlimited" for no cap)
- Plain text question

Steps:
1. Extract `mode`: `--deep` present → `deep`, else → `standard`
2. Extract `time_budget`:
   - `--time unlimited` → `null`
   - `--time N` → `N` minutes
   - (no flag) → `5` minutes
3. Calculate `synthesis_reserve`: `min(1.5, time_budget * 0.3)` or `1.5` if unlimited
4. Set `max_iterations`: `deep` → 7, `standard` → 3
```

### TR-2: Modify `agents/research/research-lead-agent.md`

**File:** `agents/research/research-lead-agent.md`

Changes:

1. **Add time tracking to phase state:**

```markdown
### 1.1 Initialize Time Budget

When receiving task from /research:
1. Record `start_time = now()`
2. Store `time_budget_minutes` and `synthesis_reserve_minutes`
3. Track `remaining_time = time_budget - elapsed`

Before each iteration, calculate remaining time. If `remaining_time < synthesis_reserve`, set `shouldContinue = false`.
```

2. **Replace Section 3.6 Gap Analysis with structured schema:**

```markdown
### 3.6 Gap Analysis – Structured Loop Decision

After synthesis, produce a loop decision JSON:

\`\`\`json
{
  "iteration": <current iteration number>,
  "summary": "<what we learned this iteration>",
  "gaps": ["<gap1>", "<gap2>"],
  "shouldContinue": <true/false>,
  "nextSearchTopic": "<optional>",
  "urlToSearch": "<optional>",
  "timeRemainingMinutes": <calculated>
}
\`\`\`

**shouldContinue = false** when ANY of:
- `gaps` is empty
- `timeRemainingMinutes < synthesis_reserve`
- `iteration >= max_iterations`
- All remaining gaps are tagged `#RETRY_EXHAUSTED`

Store in `phase_state.research.gap_analysis.loop_decision`.
```

3. **Add retry tracking:**

```markdown
### 3.4.2 Retry Tracking

For each subquestion, track:
- `attempts`: number of times we tried to gather evidence
- `status`: `pending` | `complete` | `exhausted`

When a subagent returns failure:
1. Increment `attempts`
2. If `attempts >= 3`:
   - Set `status = exhausted`
   - Tag with `#RETRY_EXHAUSTED`
   - Do NOT retry again
3. Else: retry with fallback strategy

Aggregate in `phase_state.research.retry_tracking`:
\`\`\`json
{
  "subquestions": {
    "sq-1": { "attempts": 2, "status": "complete" },
    "sq-2": { "attempts": 3, "status": "exhausted" }
  },
  "total_exhausted": 1
}
\`\`\`
```

### TR-3: Modify `agents/research/research-web-search-subagent.md`

**File:** `agents/research/research-web-search-subagent.md`

Changes:
1. Add `#RETRY_EXHAUSTED` to RA tag vocabulary in Section 4
2. Return `attempt_number` in response so lead agent can track

### TR-4: Update phase_state schema

**Location:** `docs/reference/phase-configs/research-phase-config.yaml`

Add fields:

```yaml
research:
  time_budget:
    total_minutes: number | null
    synthesis_reserve_minutes: number
    started_at: ISO timestamp
  iteration:
    current: number
    max: number
  retry_tracking:
    subquestions: object
    total_exhausted: number
  gap_analysis:
    loop_decision:
      iteration: number
      summary: string
      gaps: string[]
      shouldContinue: boolean
      nextSearchTopic: string | null
      urlToSearch: string | null
      timeRemainingMinutes: number | null
```

---

## RA-Tagged Decisions

### #PATH_DECISION: Time Budget Default

**Decision:** Default to 5 minutes when `--time` not specified.
**Rationale:** Matches Open Deep Research pattern; prevents runaway research while allowing override.

### #PATH_DECISION: Mode-Based Iterations

**Decision:** Standard = 3 iterations, Deep = 7 iterations.
**Rationale:** Deep research justifies more loops; standard should be fast.

### #PATH_DECISION: No Quick Flag

**Decision:** No `--quick` shorthand flag.
**Rationale:** `--time 5` is explicit enough; fewer flags to remember.

### #COMPLETION_DRIVE: Synthesis Reserve

**Assumption:** 1.5 minutes is sufficient for final synthesis.
**Risk:** Complex deep research may need more. May need adjustment based on usage.

---

## Acceptance Criteria

1. `/research "question"` completes within 5 minutes by default
2. `/research --time 10 "question"` respects 10-minute budget
3. `/research --time unlimited --deep "question"` uses iteration cap only
4. Loop decision JSON is present in `phase_state.research.gap_analysis.loop_decision`
5. After 3 failed attempts on a subquestion, `#RETRY_EXHAUSTED` tag is applied
6. Research stops and synthesizes when time or iteration limit reached
7. Final report includes methodology note when retry limits or time limits were hit

---

## Files to Modify

| File | Changes |
|------|---------|
| `commands/research.md` | Add `--time` parsing, pass budget to lead agent |
| `agents/research/research-lead-agent.md` | Time tracking, structured loop decision, retry limits |
| `agents/research/research-web-search-subagent.md` | Add `#RETRY_EXHAUSTED` tag |
| `agents/research/research-site-crawler-subagent.md` | Add `#RETRY_EXHAUSTED` tag |
| `docs/reference/phase-configs/research-phase-config.yaml` | Add new phase state fields |
| `docs/reference/response-awareness.md` | Add `#RETRY_EXHAUSTED` to RA vocabulary |

---

## Out of Scope

- Perplexity format rules for writers (already implemented)
- Query type detection in scoping (already implemented)
- Progress streaming to UI (would require MCP changes)

---

## Next Step

```
/orca-os-dev Implement requirement research-workflow-enhancement
```
