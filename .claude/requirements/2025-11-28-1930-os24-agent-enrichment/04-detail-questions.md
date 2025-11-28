# Detail Questions: OS 2.4 Agent Enrichment

Concrete implementation decisions based on context findings.

---

## Q1: How should agents load knowledge at startup?

**Context:** Agents need to read `.claude/agent-knowledge/{agent}/patterns.json` before starting work.

**Options:**
- **A) Inline instructions** — Add "Read your knowledge file first" to each agent prompt
- **B) Pre-injection hook** — Create a SessionStart hook that injects knowledge
- **C) MCP tool** — Create `read_agent_knowledge` tool agents call explicitly

**Smart Default:** A (Inline instructions)

**Why:** Simplest implementation. Agent prompt says "First, read `.claude/agent-knowledge/{your-name}/patterns.json` if it exists." No hook/MCP changes needed.

---

## Q2: Should skills use YAML frontmatter like agents or stay pure markdown?

**Context:** New skills like `cursor-code-style` need to be created. Current skills vary in format.

**Options:**
- **A) YAML frontmatter** — Match agent format (name, description, tools)
- **B) Pure markdown** — Current skill format with # header
- **C) Standardize all** — Update all existing skills to YAML format

**Smart Default:** A (YAML frontmatter)

**Why:**
- Consistency with agents
- Enables future skill-catalog tooling
- Frontmatter can specify "applies_to" agent types

---

## Q3: What's the target line count for enriched agents?

**Context:** Current agents are 88-228 lines. V0 is 1,267 lines. Need a realistic target.

**Options:**
- **A) 300-400 lines** — 2x current, focused enhancement
- **B) 400-600 lines** — 3-4x current, comprehensive
- **C) 600-800 lines** — Approaching V0 depth

**Smart Default:** B (400-600 lines)

**Why:**
- V0's 1,267 includes many examples we don't need
- 400-600 allows full pattern extraction + examples
- Keeps agents readable and maintainable

---

## Q4: How should pattern success/failure be tracked?

**Context:** Learning system needs metrics to determine which patterns to promote.

**Options:**
- **A) Agent self-report** — Agent writes "task succeeded" at end of prompt
- **B) Verification agent** — Separate agent validates outcomes
- **C) User feedback** — Wait for explicit user approval/rejection

**Smart Default:** C (User feedback)

**Why:**
- Most reliable signal
- Avoids agent self-assessment bias
- Can use "Was this helpful?" or implicit (user continues vs user complains)
- Equilateral uses outcome-based feedback

---

## Q5: Should we create a migration script or update agents manually?

**Context:** 82 agents need updating. Manual is safer but slower.

**Options:**
- **A) Manual updates** — Edit each agent by hand
- **B) Template + script** — Generate base content, manual review
- **C) Full automation** — Script generates, no review

**Smart Default:** B (Template + script)

**Why:**
- Pattern insertion is repetitive (same code_style in all builders)
- Manual review catches lane-specific issues
- Script ensures consistency
- Template defines insertion points

---
