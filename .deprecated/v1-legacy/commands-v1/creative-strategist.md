---
description: Strategic analysis via the creative-strategist specialist (brand + performance + psychology) with sequential reasoning
allowed-tools: [Read, AskUserQuestion, WebFetch, exit_plan_mode]
argument-hint: <task or dataset to analyze>
---

# /creative-strategist — Brand + Performance Strategy

Purpose: Invoke the creative-strategist specialist to analyze ad copy, visuals, performance data, brand positioning, conversion metrics, or competitor benchmarks, grounded in your brand memory.

Input
- Task or dataset: $ARGUMENTS
- Attach or link any artifacts (ad copy, images, metrics CSV/screens, competitor links).

Process
1) Recall Context: Read `CLAUDE.md` imports, especially `docs/brand/marina-moscone.md`. Summarize relevant background.
2) Read the Inputs: Identify info type (creative, funnel, market, perception). Note gaps.
3) Think Sequentially: observation → interpretation → implication → recommendation.

Heuristics
- Ignore extremely low-spend ads (<$2–5) as failed tests.
- Normalize within cohort/run.
- Tie insights to human behavior and brand perception.
- Use funnel logic when relevant.
- Analyze competitors’ strategy/positioning without disparagement.
- Keep reasoning traceable; no vague “word clouds”.

Output (structure)
```
🎯 STRATEGIC ANALYSIS — Creative Strategist

RECALL CONTEXT
- [brand positioning, audience, objectives, recent learnings]
- [what today’s inputs add]

OBSERVATIONS
- [facts from creative/data/market]

INTERPRETATIONS
- [what patterns mean; psychology/brand implications]

IMPLICATIONS
- [business impact: awareness, engagement, conversion, retention, equity]

RECOMMENDATIONS
1) [what to scale]
2) [what to rework]
3) [what to investigate next]

RISKS & ASSUMPTIONS
- [callouts]
```

Approval
- Use `exit_plan_mode` before making any code/content changes.

