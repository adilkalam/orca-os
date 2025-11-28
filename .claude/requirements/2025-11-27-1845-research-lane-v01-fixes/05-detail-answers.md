# Detail Answers – Research Lane v0.1 Fixes

## Q1: Should research-lead-agent have Write tool?

**Answer:** Yes

**Implication:** Add `Write` to research-lead-agent tools. Lead agent can directly update phase_state.json and create intermediate artifacts.

---

## Q2: What to do with research-fact-checker?

**Answer:** Create agent

**Implication:** Create `agents/research/research-fact-checker.md` as an optional gate. Update agent count in docs/agents.md (will be 8 research agents, not 7).

---

## Q3: Should subagents have ALL Firecrawl tools or specialization?

**Answer:** Specialization only

**Implication:**
- `research-web-search-subagent`: `mcp__firecrawl__firecrawl_search`, `mcp__firecrawl__firecrawl_scrape`
- `research-site-crawler-subagent`: `mcp__firecrawl__firecrawl_map`, `mcp__firecrawl__firecrawl_crawl`, `mcp__firecrawl__firecrawl_scrape`

Both get `firecrawl_scrape` since it's needed after URL discovery.

---

## Q4: Add explicit parallel subagent spawning instructions?

**Answer:** Yes

**Implication:** Add a dedicated section to research-lead-agent.md explaining:
- When to spawn in parallel (independent subquestions)
- How to do it (multiple Task calls in one response)
- Example showing 3-4 parallel Task invocations

---

## Q5: Simple path agents (from discovery default)

**Answer:** Use Data lane agents (default accepted)

**Implication:** Keep existing pattern where simple queries delegate to `research-specialist` or `data-researcher` from Data lane. Document this in research-pipeline.md.
