---
description: "OS 2.4 Research lane entrypoint for deep, cited research"
argument-hint: "[--deep] [--time N] <research question>"
allowed-tools:
  - Task
  - Read
  - Grep
  - Glob
  - Bash
  - AskUserQuestion
  - WebSearch
  - WebFetch
  - mcp__project-context__query_context
  - mcp__project-context__save_task_history
---

# /research – OS 2.4 Research Lane Orchestrator

Use this command when the primary output is a **research report or answer**,
not code changes:

- Deep web research with citations (Perplexity / Anthropic-style).
- Market and competitive maps.
- Literature reviews and technical deep dives.
- Cross-doc / cross-repo investigations where the result is a report.

It routes work through the **Research lane** defined in
`docs/pipelines/research-pipeline.md` and
`docs/reference/phase-configs/research-phase-config.yaml`.

You are an **orchestrator**. You:

- Never edit project code.
- Coordinate agents via the `Task` tool.
- Keep `phase_state.json` in sync for `domain: "research"`.
- Ensure Firecrawl MCP is used when available, with safe fallbacks.

---
## 0. Parse Arguments & Mode

`$ARGUMENTS` may include:

- `--deep` – request deep, long-form research (use `research-deep-writer` and
  allow multiple evidence loops).
- `--time N` – time budget in minutes (default: 5, "unlimited" for no cap).
- Plain text question – the research query.

Steps:

1. Extract `mode`:
   - If `--deep` present → `mode = "deep"`.
   - Else → `mode = "standard"`.
2. Extract `time_budget`:
   - `--time unlimited` → `null` (no time limit).
   - `--time N` → `N` minutes.
   - (no flag) → `5` minutes (default).
3. Calculate `synthesis_reserve`:
   - If `time_budget` is null → `1.5` minutes.
   - Else → `min(1.5, time_budget * 0.3)`.
4. Set `max_iterations`:
   - `mode == "deep"` → `7`.
   - `mode == "standard"` → `3`.
5. Extract the raw question string.
6. Initialize `phase_state` (if missing) with:
   - `domain: "research"`.
   - `mode`.
   - `current_phase: "scoping"`.
   - `time_budget.total_minutes`: the parsed time budget.
   - `time_budget.synthesis_reserve_minutes`: calculated reserve.
   - `iteration.max`: the max iterations for this mode.

---
## 1. Scoping & Complexity Classification

Goal: fill the `scoping` entry in `phase_state`.

1. Briefly restate the question and, if necessary, use `AskUserQuestion` to
   clarify:
   - Desired depth (quick answer vs detailed vs academic).
   - Time horizon / recency requirements.
   - Any sensitive domains (medical, financial, legal).
2. Classify **complexity_tier** using:
   - `simple` – single, narrow factual question; can be answered with a small
     number of sources and no heavy planning.
   - `medium` – 2–5 subtopics, requires multiple sources and synthesis but not
     a very long report.
   - `deep` – many subtopics, cross-domain, or requires literature-review-level
     depth (use for `--deep` unless obviously simple).
3. Update `phase_state.scoping`:
   - `user_intent`, `research_scope`, `complexity_tier`, `timeframe`,
     `constraints`, `initial_questions`.
4. Set `phase_state.current_phase = "scoping"`.

**Simple route:**  
If `complexity_tier == "simple"` **and** user did not request `--deep`:

- Delegate once via `Task` to `research-specialist` or `data-researcher`
  for a focused, fast answer.
- You may still encourage them to use Firecrawl MCP, but you do **not**
  spin up the full multi-phase pipeline.
- Return their answer directly and **stop** (do not modify project files).

For `medium` and `deep`, continue through the full Research pipeline.

---
## 2. Memory-First Context

Goal: populate `phase_state.memory_context`.

1. Use `Bash` to run Workshop/vibe.db helpers (if present) to find:
   - Prior research notes.
   - Related standards or decisions.
   - Similar tasks.
2. If the question is clearly tied to the **current repo/project**:
   - Optionally call `mcp__project-context__query_context` with
     `domain: "data"` or another relevant domain to pull project-specific
     docs and history.
3. Summarize into:
   - `memory_summary`, `prior_research_refs`, `project_links`.
4. Update `phase_state.current_phase = "memory_context"`.

---
## 3. Delegate to `research-lead-agent`

For `medium` and `deep` tasks, your main job is to hand off to
`research-lead-agent` with the right context and constraints.

Use the `Task` tool with:

- `agent: "research-lead-agent"`.
- A prompt that includes:
  - The raw question and clarified scope.
  - `mode` (`standard` vs `deep`).
  - **Time budget parameters**:
    - `time_budget_minutes`: the total time budget (or null if unlimited).
    - `synthesis_reserve_minutes`: time to reserve for final synthesis.
    - `max_iterations`: iteration cap for this mode (3 or 7).
  - Any memory context summary.
  - Expectations around timelines, recency, and risk.
  - A reminder to:
    - Prefer Firecrawl MCP tools for search/crawl (`firecrawl_search`,
      `firecrawl_scrape`, `firecrawl_map`, `firecrawl_crawl`,
      `firecrawl_extract`) when available.
    - Fall back to `WebSearch`/`WebFetch` if Firecrawl is **rate limited** or
      unavailable, and to note this via RA tags.
    - Populate the `research_plan`, `evidence_gathering`, `synthesis_pass1`,
      and `gap_analysis` entries in `phase_state`.
    - **Respect time budget**: stop and synthesize when remaining time drops
      below synthesis reserve or iteration cap is reached.

You **do not** micro-manage their work; you just give clear expectations and
constraints.

---
## 4. Writer and Gate Orchestration

Once `research-lead-agent` returns with a plan, evidence, and outline:

1. Decide writer agent:
   - `mode == "deep"` → use `research-deep-writer`.
   - Else → use `research-answer-writer`.
2. Use `Task` to call the chosen writer with:
   - The outline, key findings, and Evidence Note paths.
   - Any style/audience instructions.
3. When the draft report path is ready, run the **Citation Gate**:
   - `Task` → `research-citation-gate` with:
     - `report_draft_path`.
     - Evidence artifact paths.
4. Then run the **Consistency Gate**:
   - `Task` → `research-consistency-gate` with:
     - Final report path.
     - RA summaries and `tool_status` / `rate_limit_events`.

Record outputs from these phases in `phase_state` under the corresponding
entries (`report_draft`, `citation_gate`, `consistency_gate`).

---
## 5. Rate Limits & Fallback Behaviour

If Firecrawl MCP returns rate-limit errors (429s or similar), or subagents
report Firecrawl being unavailable:

1. Ensure they:
   - Switch to `WebSearch`/`WebFetch` where appropriate.
   - Record `#RATE_LIMITED` and `#CONTEXT_DEGRADED` RA tags on affected
     subquestions.
   - Update `tool_status.firecrawl = "rate_limited"` and append an entry to
     `rate_limit_events`.
2. Require writer/gate agents to surface this explicitly in the:
   - **Methodology / Sources** section.
   - **Limitations & Uncertainties** section.
3. For `/research --deep`:
   - If critical subquestions remain unanswered even after fallbacks, allow
     the **Consistency Gate** to return `CAUTION` and clearly flag that the
     deep report is partial due to tool limits.

Do **not** silently pretend coverage is complete when Firecrawl is unavailable.

---
## 6. Completion & Task History

Once the Consistency Gate returns:

1. Decide whether the report is **usable**:
   - `gate_decision == "PASS"` → normal completion.
   - `gate_decision == "CAUTION"` → return the report but clearly describe
     limitations in your final explanation.
   - `gate_decision == "FAIL"` → explain why and suggest rerunning later or
     narrowing the scope.
2. Use `mcp__project-context__save_task_history` to log:
   - `domain: "research"`.
   - `task`: the original question.
   - `outcome`: `success`, `partial`, or `failure`.
   - `learnings`: short bullet list of what worked and what didn’t
     (especially around Firecrawl usage, RA tags, and coverage).
3. Update `phase_state.completion`:
   - `final_report_path`, `outcome`, `learnings`, `saved_task_history`.

Return the final report content (or a rich summary plus location of the full
report) to the user. Do not leave partial phase state hanging without a clear
status.
