# Discovery Questions: OS 2.4 Agent Enrichment

These questions validate scope and approach based on our research findings.

---

## Q1: Should we enrich ALL 82 agents, or prioritize high-impact lanes first?

**Options:**
- **A) All 82 agents** — Comprehensive but time-intensive (~40+ hours)
- **B) Priority lanes only** — Next.js (14), Research (8), iOS (19), Data (4) = 45 agents

**Smart Default:** B (Priority lanes only)

**Why:** The research shows the biggest gaps are in:
- Frontend agents (missing V0/Lovable design rules)
- Research agents (missing Perplexity format)
- iOS agents (have rich swift-agents-plugin source)
- Data agents (missing Codex citation format)

Shopify (7) and Expo (11) can follow later using the patterns we establish.

---

## Q2: Should we create NEW skill files or inline patterns directly into agent prompts?

**Options:**
- **A) New skills** — Create reusable skill files, reference from agents
- **B) Inline** — Paste patterns directly into agent prompts
- **C) Hybrid** — Universal patterns as skills, lane-specific inline

**Smart Default:** C (Hybrid)

**Why:**
- Universal patterns (code_style, common pitfalls) → skills (avoid duplication)
- Lane-specific patterns (V0 design, Perplexity format) → inline (context-specific)
- Research shows current skills aren't wired properly; hybrid forces connection

---

## Q3: Should we adopt V0's MDX tool format for subagent invocation?

**Options:**
- **A) Yes** — Use `<V0Task name="..." status="...">` pattern
- **B) No** — Keep current Task tool format
- **C) Partial** — Use status tags but not JSX format

**Smart Default:** B (No)

**Why:** Claude Code's Task tool already works. MDX format is V0-specific and would require parser changes. The value is in the content, not the format.

---

## Q4: Should we add Playwright visual validation to all frontend lanes?

**Options:**
- **A) Yes, all frontend lanes** — Next.js, Shopify, Expo
- **B) Next.js only** — Keep current state
- **C) Next.js + Shopify** — Skip Expo (mobile preview harder)

**Smart Default:** C (Next.js + Shopify)

**Why:**
- Next.js already has it via design-reviewer
- Shopify themes are web-based, Playwright works directly
- Expo requires mobile simulators, more complex setup
- Patrick Ellis pattern: "Playwright gives AI eyes to see"

---

## Q5: Should we implement agent-level learning (Equilateral pattern)?

**Options:**
- **A) Yes** — Add `.agent-knowledge/` persistence
- **B) No** — Keep current /reflect + Workshop approach
- **C) Later** — Focus on prompt enrichment first, learning second

**Smart Default:** C (Later)

**Why:**
- Agent learning requires execution loop changes, not just prompt edits
- Current gap is prompt depth, not learning capability
- /reflect + Workshop + ProjectContext already capture learnings
- Higher ROI: fix prompt depth first, learning mechanism later
