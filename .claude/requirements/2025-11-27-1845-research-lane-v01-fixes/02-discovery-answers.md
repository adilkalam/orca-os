# Discovery Answers – Research Lane v0.1 Fixes

## Q1: Should research-lead-agent use Opus model explicitly?

**Answer:** Yes - use Opus for all agents
**User Note:** "We have OPUS 4.5 now as the default model, everything should use Opus"

**Implication:** All research agents can use `model: inherit` since Opus 4.5 is now the default. No explicit model override needed. This simplifies the config.

---

## Q2: Should we create dedicated research-orchestrator agents?

**Answer:** No (command orchestrates)

**Implication:** Keep `/research` as the orchestrator. Update phase-config to remove references to non-existent `research-orchestrator` and `research-light-orchestrator`. The command handles complexity routing directly.

---

## Q3: Citation-gate naming (not asked - using default)

**Answer:** Keep as gate (default accepted)

**Implication:** Document in research-pipeline.md that citation-gate is an exception to "gates don't write" pattern, following Anthropic's architecture.

---

## Q4: Where should research evidence artifacts live?

**Answer:** `.claude/research/`

**Implication:**
- Create `.claude/research/` structure
- Update CLAUDE.md to document this path
- Evidence persists across sessions (not temp)

---

## Q5: Should research-lead-agent have sequential-thinking MCP?

**Answer:** Yes

**Implication:** Add `mcp__sequential-thinking__sequentialthinking` to research-lead-agent tools for structured planning and synthesis.
