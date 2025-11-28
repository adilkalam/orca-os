# Discovery Answers: OS 2.4 Agent Enrichment

**Answered:** 2025-11-28

---

## Q1: Scope
**Answer:** All 82 agents

**Impact:** Full coverage across all 9 domains. Will apply patterns systematically to ensure consistency. Estimated scope increases from ~20 hours to ~40+ hours.

---

## Q2: Pattern Delivery
**Answer:** Hybrid approach

**Impact:**
- Create universal skill files for patterns that apply across ALL agents (Cursor code_style, Lovable pitfalls)
- Inline lane-specific patterns (V0 design rules → frontend, Perplexity format → research)
- This ensures skills are actually wired to agents (fixing Gap #1 from research)

---

## Q3: Visual Validation
**Answer:** Yes, add Playwright to Shopify

**Impact:**
- Next.js: Already has it via `nextjs-design-reviewer`
- Shopify: Add Playwright MCP integration to `shopify-*` agents
- Expo: Deferred (mobile preview complexity)
- iOS: Deferred (Xcode preview screenshots via XcodeBuildMCP already available)

---

## Q4: Learning System
**Answer:** Learning now

**Impact:**
- Implement Equilateral's `.agent-knowledge/` pattern alongside prompt enrichment
- Agents will:
  1. Write to `.claude/agent-knowledge/{agent-name}/` after execution
  2. Read from knowledge store before starting new tasks
  3. Persist patterns that achieve >85% success rate
- This is a significant scope increase but delivers self-improving agents

---

## Summary of Choices

| Decision | Choice | Scope Impact |
|----------|--------|--------------|
| Agent coverage | All 82 | +100% scope |
| Pattern delivery | Hybrid | Balanced approach |
| Visual validation | Shopify added | +5% scope |
| Learning system | Implement now | +40% scope |

**Total estimated effort:** 60+ hours across 4 major phases
