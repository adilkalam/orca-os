# Discovery Questions – Research Lane v0.1 Fixes

## Q1: Should research-lead-agent use Opus model explicitly?

Anthropic's architecture uses Opus for the lead agent and Sonnet for subagents. This provides better planning and coordination.

**Smart Default:** Yes
**Why:** Matches Anthropic's proven pattern. Lead agent does planning/synthesis which benefits from stronger reasoning. Subagents do focused search tasks suitable for Sonnet.

---

## Q2: Should we create explicit orchestrator agents (research-orchestrator, research-light-orchestrator)?

Currently `/research` command acts as orchestrator directly. Other lanes have dedicated orchestrator agents.

**Smart Default:** No
**Why:** The `/research` command already handles orchestration well. Adding separate orchestrator agents would duplicate the command's role. Keep it simple - command orchestrates, lead-agent researches.

---

## Q3: Should citation-gate be renamed to citation-specialist since it writes files?

`research-citation-gate` has Write tool and modifies the report, which violates "gates validate only" pattern.

**Smart Default:** No (keep as gate)
**Why:** Anthropic's Citation Agent also modifies output. Document this as an exception specific to research lane rather than renaming. The "gate" label still conveys its role in the pipeline.

---

## Q4: Should evidence artifacts go in .claude/research/ or .claude/orchestration/temp/research/?

Currently config uses `.claude/research/evidence/` which is outside the standard `.claude/orchestration/` structure.

**Smart Default:** Keep `.claude/research/` (create new top-level structure)
**Why:** Research artifacts are different from orchestration temp files - they may be reused across sessions and should persist. A dedicated `.claude/research/` structure makes sense for this domain.

---

## Q5: Should we add sequential-thinking MCP to research-lead-agent?

Anthropic emphasizes extended thinking for planning. We have `mcp__sequential-thinking__sequentialthinking` available.

**Smart Default:** Yes
**Why:** Sequential thinking helps with research planning, subquestion decomposition, and synthesis. Aligns with Anthropic's emphasis on guided thinking process.
