# Research Domain Pipeline

**Status:** OS 2.4 Pipeline (Research)  
**Last Updated:** 2025-11-27

---

## Overview

The Research pipeline handles work where the primary output is a **research
artifact**, not a code change:

- Deep web research with citations (Perplexity / Anthropic-style).
- Market maps and competitive analyses.
- Literature reviews and technical deep dives.
- Cross-doc / cross-repo investigations where the result is a report.

It combines:

- OS 2.4 primitives (`phase_state.json`, Workshop, vibe.db, ProjectContext).
- A dedicated **Research lane** with `/research` as entrypoint.
- Firecrawl MCP for web search, scraping, mapping, and crawling.
- Multi-agent planning (`research-lead-agent` + subagents).
- Writer and gate agents modeled after Perplexity and Anthropic research
  systems.

The goal is to produce **cited, trustworthy, and structurally consistent**
research outputs while making tool limits and uncertainties explicit.

---

## Scope & Domain

Use this pipeline when:

- The user’s question is primarily about **information**, not code edits.
- You expect to consult multiple web sources or long-form documents.
- The output should be:
  - A structured answer with citations, or
  - A deep report (e.g. `/research --deep`).

Avoid this pipeline when:

- The task is a direct implementation request – use `/orca` and domain lanes.
- The question can be answered from immediate context without research.

---

## Entry Point and Modes

- `/research "question"` – Standard mode.
  - Uses `research-lead-agent` + `research-answer-writer`.
  - One or more Firecrawl evidence passes as needed.
- `/research --deep "question"` – Deep mode.
  - Same pipeline, but:
    - Complexity defaults to `deep`.
    - Multiple evidence loops allowed.
    - Uses `research-deep-writer` for long-form output.

In both modes, `/research` is an **orchestrator-only** command:
- It never edits project code.
- It delegates via `Task` to research agents.

---

## Phase State Contract (`phase_state.json`)

All Research pipeline work shares a common phase state file:

```text
.claude/orchestration/phase_state.json
```

For `domain: "research"`, see
`docs/reference/phase-configs/research-phase-config.yaml` for full details.
Key top-level fields:

- `domain`: `"research"`.
- `mode`: `"standard"` or `"deep"`.
- `complexity_tier`: `"simple" | "medium" | "deep"`.
- `current_phase`: current phase name.
- `tool_status`: map of tool health (`firecrawl`, `web_search`, etc.).
- `rate_limit_events`: list of Firecrawl/WebSearch rate-limit events.

Each phase writes a structured entry under `phase_state.phases.<name>`:

- `scoping` – user intent, scope, timeframe, initial questions.
- `memory_context` – memory hits and project links.
- `research_plan` – subquestions, strategies, evaluation criteria.
- `evidence_gathering` – evidence artifacts, source summary, RA events.
- `synthesis_pass1` – outline, key findings, remaining gaps.
- `gap_analysis` – additional queries, unresolved questions, more-research
  decision.
- `report_draft` – draft report path and style.
- `citation_gate` – report with citations, citations status.
- `consistency_gate` – quality score, gate decision, issues.
- `completion` – final report path, outcome, learnings.

---

## Pipeline Architecture

```text
Request (Research question)
    ↓
/research (standard or --deep)
    ↓
[Phase 0: Scoping]              ← clarify scope, classify complexity
    ↓
[Phase 0.5: Memory Context]     ← Workshop + vibe.db (+ ProjectContext if needed)
    ↓
[Phase 1: Research Plan]        ← research-lead-agent
    ↓
[Phase 2: Evidence Gathering]   ← Firecrawl-first subagents
    ↓
[Phase 3: Synthesis Pass 1]     ← lead agent outline + key findings
    ↓
[Phase 3.5: Gap Analysis]       ← decide more research? (loop)
    ↓
[Phase 4: Report Draft]         ← writer (standard or deep)
    ↓
[Phase 5: Citation Gate]        ← research-citation-gate
    ↓
[Phase 6: Consistency Gate]     ← research-consistency-gate
    ↓
[Phase 7: Completion]           ← orchestrator + task history
```

Simple questions may short-circuit: `/research` can delegate directly to
`research-specialist` for a one-shot answer.

---

## Agents

Core agents for this lane:

- `research-lead-agent` – plans multi-agent research, coordinates subagents,
  and produces outlines and key findings.
- `research-web-search-subagent` – Firecrawl-first web search and scraping for
  specific subquestions, producing Evidence Notes.
- `research-site-crawler-subagent` – Firecrawl map/crawl specialist for deep
  coverage of specific domains.
- `research-answer-writer` – Perplexity-style answer writer (standard mode).
- `research-deep-writer` – long-form academic writer (deep mode).
- `research-citation-gate` – citation insertion and audit.
- `research-consistency-gate` – consistency, coverage, and RA/limitations gate.

### Agent Roles Note

**Exception: research-citation-gate**

Unlike other gates that only validate, `research-citation-gate` has Write permission
and modifies the report to insert citations. This follows Anthropic's architecture
where the Citation Agent produces the final cited output. The "gate" naming reflects
its position in the pipeline (post-draft, pre-consistency) rather than write restrictions.

Existing Data agents (`research-specialist`, `data-researcher`,
`python-analytics-expert`, `competitive-analyst`) can be invoked via `Task`
for quantitative analysis or competitive mapping when needed.

---

## Firecrawl & Fallback Strategy

The Research lane is **Firecrawl-first**:

- Preferred tools:
  - `firecrawl_search` for open web queries.
  - `firecrawl_scrape` for specific URLs.
  - `firecrawl_map` / `firecrawl_crawl` for site-level mapping and crawling.
  - `firecrawl_extract` for structured data extraction.
- Fallbacks when Firecrawl is unavailable or rate-limited:
  - `WebSearch` + `WebFetch`.
  - Memory-only synthesis (Workshop + vibe.db + prior reports).

Rate limits are treated as **first-class signals**, not random failures:

- Subagents record `#RATE_LIMITED` and `#CONTEXT_DEGRADED` RA tags when
  Firecrawl limits affect coverage.
- `tool_status.firecrawl` and `rate_limit_events[]` capture details in
  `phase_state`.
- Writers and gates must surface these limitations explicitly in the final
  report (Methodology and Limitations sections).

---

## RA in Research

Research-specific RA tags include:

- `#LOW_EVIDENCE` – important claim with thin evidence.
- `#SOURCE_DISAGREEMENT` – credible sources conflict.
- `#SUSPECT_SOURCE` – low-credibility or heavily biased sources.
- `#OUT_OF_DATE` – evidence older than the requested time window.
- `#RATE_LIMITED` – Firecrawl/web tools constrained coverage.
- `#CONTEXT_DEGRADED` – had to operate with partial context or memory only.
- `#SCOPE_EXCEEDED` – query demands more time/budget than available.

Gates use these tags to decide whether to:

- Pass the report.
- Return with **CAUTION** and highlight limitations.
- Fail and suggest rerunning with narrower scope or more budget.

---

## Completion & Learning Loop

On completion, `/research`:

- Saves task history via `mcp__project-context__save_task_history` with:
  - `domain: "research"`.
  - `task`: original question.
  - `outcome`: `success`, `partial`, or `failure`.
  - `learnings`: notable patterns (e.g., common RA issues, Firecrawl usage).
- Future research tasks can query this history via Workshop and ProjectContext,
  allowing the lane to:
  - Reuse prior research artifacts.
  - Harden standards around evidence coverage and limitations.
