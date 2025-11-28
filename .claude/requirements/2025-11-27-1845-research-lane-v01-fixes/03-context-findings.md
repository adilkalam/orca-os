# Context Findings – Research Lane v0.1 Fixes

## Existing Architecture

### Agent Files (agents/research/)

| File | Current Tools | Issues |
|------|---------------|--------|
| `research-lead-agent.md` | `Task, Read, Grep, Glob, WebSearch, WebFetch, Bash, AskUserQuestion` | Missing: Write, sequential-thinking, Firecrawl tools (if direct use) |
| `research-web-search-subagent.md` | `Read, Write, WebSearch, WebFetch, Bash` | **CRITICAL:** Missing Firecrawl MCP tools |
| `research-site-crawler-subagent.md` | `Read, Write, WebSearch, WebFetch, Bash` | **CRITICAL:** Missing Firecrawl MCP tools |
| `research-answer-writer.md` | `Read, Grep, Glob` | OK (reads only) |
| `research-deep-writer.md` | `Read, Grep, Glob` | OK (reads only) |
| `research-citation-gate.md` | `Read, Write, Grep, Glob` | OK (documented exception) |
| `research-consistency-gate.md` | `Read, Grep, Glob` | OK (reads only) |

### Phase Config Issues

File: `docs/reference/phase-configs/research-phase-config.yaml`

```yaml
# References non-existent agents:
complexity_tiers:
  simple:
    routing: research-light-orchestrator  # DOES NOT EXIST
  medium:
    routing: research-orchestrator         # DOES NOT EXIST
```

```yaml
# Agent name mismatches:
phases:
  - name: report_draft
    agent: research-writer  # Should be: research-answer-writer or research-deep-writer
```

### Documentation Issues

File: `docs/agents.md`
- Says "69 agents" but actual count is 77
- Expo lane table has 11 agents but says "10 agents"

### RA Tags (docs/concepts/response-awareness.md)

Research-specific tags are well-defined:
- `#LOW_EVIDENCE`
- `#SOURCE_DISAGREEMENT`
- `#SUSPECT_SOURCE`
- `#OUT_OF_DATE`
- `#RATE_LIMITED`

These are good and should remain.

---

## Firecrawl MCP Tools Available

From the system, the following Firecrawl tools are available:

```
mcp__firecrawl__firecrawl_scrape
mcp__firecrawl__firecrawl_map
mcp__firecrawl__firecrawl_search
mcp__firecrawl__firecrawl_crawl
mcp__firecrawl__firecrawl_check_crawl_status
mcp__firecrawl__firecrawl_extract
```

**#PATH_DECISION:** Subagents should have direct access to these tools rather than relying on the lead agent to call them.

---

## Anthropic Architecture Alignment

| Anthropic Pattern | Current State | Fix Needed |
|-------------------|---------------|------------|
| Lead Agent (Opus) | Uses `model: inherit` | OK with Opus 4.5 default |
| Parallel subagents | Not enforced | Add guidance to lead-agent instructions |
| Extended thinking | Not configured | Add sequential-thinking MCP |
| Memory persistence | Workshop + phase_state | OK |
| Citation Agent | Exists as gate | Document exception |
| Subagent → filesystem | Evidence Notes pattern | OK |
| Start broad, narrow | Documented | OK |
| Firecrawl-first | Described but tools missing | **CRITICAL FIX** |

---

## Files to Modify

1. `agents/research/research-lead-agent.md` - Add tools, parallel guidance
2. `agents/research/research-web-search-subagent.md` - Add Firecrawl tools
3. `agents/research/research-site-crawler-subagent.md` - Add Firecrawl tools
4. `docs/reference/phase-configs/research-phase-config.yaml` - Fix agent references
5. `docs/agents.md` - Fix count, clarify Expo count
6. `docs/pipelines/research-pipeline.md` - Document citation-gate exception
7. `CLAUDE.md` - Document `.claude/research/` path

---

## Risk Assessment

**#COMPLETION_DRIVE:** Assuming Firecrawl MCP is always available. If not, fallback to WebSearch/WebFetch should work, but we should verify the fallback logic is solid.

**#PATH_DECISION:** Decided to keep citation-gate naming despite Write permission. This is documented as a research-specific exception to the "gates don't write" rule.
