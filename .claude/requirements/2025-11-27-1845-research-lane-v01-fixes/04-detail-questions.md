# Detail Questions – Research Lane v0.1 Fixes

## Q1: Should research-lead-agent have Write tool for phase_state.json updates?

The lead agent is supposed to update phase_state.json with research progress, but currently lacks Write.

**Smart Default:** Yes
**Why:** Lead agent owns multiple phases (scoping through gap_analysis) and needs to persist state. Alternative is having /research command write all state, but that requires more back-and-forth.

---

## Q2: Should we add research-fact-checker agent (referenced in optional_phases)?

Phase config mentions `research-fact-checker` in optional_phases but the agent doesn't exist.

**Smart Default:** No (remove from config)
**Why:** v0.1 should ship with core functionality. Fact-checking can be added in v0.2 when we have real usage patterns. Simpler to remove the reference than create an untested agent.

---

## Q3: Should the simple complexity path use Data lane agents or skip /research entirely?

Command says simple queries go to `research-specialist` or `data-researcher` (Data lane agents).

**Smart Default:** Use Data lane agents
**Why:** Data lane already has working research capabilities. Simple questions don't need the full Research pipeline overhead. Keep the existing delegation pattern.

---

## Q4: Should subagents have ALL Firecrawl tools or just their specialization?

`research-web-search-subagent` focuses on search/scrape, `research-site-crawler-subagent` focuses on map/crawl.

**Smart Default:** Just their specialization
**Why:** Separation of concerns. Search subagent gets search+scrape. Crawler subagent gets map+crawl+scrape. Both get scrape since it's needed after discovery.

---

## Q5: Should we add explicit "spawn subagents in parallel" instructions to lead-agent?

Anthropic's architecture emphasizes parallel execution but current instructions don't enforce this.

**Smart Default:** Yes
**Why:** Parallel execution is a key performance differentiator. Add explicit instructions with examples showing multiple Task calls in one response.
