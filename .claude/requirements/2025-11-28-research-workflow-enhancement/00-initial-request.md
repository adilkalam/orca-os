# Initial Request: Research Workflow Enhancement

**Date:** 2025-11-28
**Requested by:** User
**Domain:** os-dev (Claude Code configuration)

## Original Request

Integrate learnings from two external research systems into our OS 2.4 research pipeline:

1. **Perplexity's System Prompt** - Format rules, restrictions, query type detection
2. **Open Deep Research** - Loop control, time budgets, structured gap analysis

## Context Already Gathered

### From Perplexity Prompt

Key patterns identified:
- Strict format rules (no header start, flat lists, tables for comparisons)
- Hedging language restrictions ("It is important to..." banned)
- Query type detection (academic, news, people, coding, comparison, factual)
- Inline citations only, no References section
- Wrap-up summary requirement

### From Open Deep Research (nickscamara/open-deep-research)

Key patterns identified:
- Structured loop decision schema with `shouldContinue`, `gaps[]`, `nextSearchTopic`
- Time budget management (4.5 min cap, 1 min reserved for synthesis)
- Max depth limit (7 iterations)
- Failed attempts counter with retry limit (3 max)
- Progress tracking with activity types (search, extract, analyze, reasoning, synthesis)

## Changes Already Made

1. `research-answer-writer.md` - Updated with Perplexity format rules
2. `research-deep-writer.md` - Updated with Perplexity format rules
3. `research-lead-agent.md` - Added query_type detection to scoping

## Remaining Work

Need to incorporate Open Deep Research patterns:
- Structured loop decision in gap analysis
- Time budget awareness
- Explicit iteration caps and retry limits
- Enhanced state tracking

## Goals

1. Research outputs match Perplexity quality standards
2. Research loops are controlled and predictable
3. Time/resource budgets prevent runaway research
4. Clear progress visibility throughout research
