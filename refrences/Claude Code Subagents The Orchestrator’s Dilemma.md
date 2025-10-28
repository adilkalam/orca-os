---
title: "Claude Code Subagents: The Orchestrator’s Dilemma"
source: "https://responseawareness.substack.com/p/claude-code-subagents-the-orchestrators"
author:
  - "[[Michael Jovanovich]]"
published: 2025-09-27
created: 2025-10-28
description: "Why I Chose Plan Preservation Over Efficiency"
tags:
  - "clippings"
---
### Why I Chose Plan Preservation Over Efficiency

When designing the Response Awareness framework for Claude Code, I faced a fundamental architectural decision: Should the main agent orchestrate while sub-agents implement, or should the main agent implement while sub-agents gather context?

I chose orchestration-only for the main agent. Here’s why that choice unlocks complexity capabilities that would otherwise be impossible.

---

![](https://substackcdn.com/image/fetch/$s_!Q0gB!,w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2496c3c8-0ebc-4b9f-94d7-9e6e6c174341_1200x904.png)

---

### The Cognitive Load Problem

Every complex software task requires holding two types of information simultaneously: the comprehensive architectural plan and the specific implementation details. These compete for the same contextual resources.

When the main agent starts implementing code, their attention shifts to code details, debugging syntax, figuring out API calls, handling edge cases. Meanwhile, the comprehensive plan that was fresh moments ago starts decaying.

This isn’t minor degradation, it’s catastrophic for complex tasks. The agent needs to maintain awareness of all your instructions. The moment they dive into debugging a React component, your instructions start slipping away.

### Context Rot: The Technical Reality

Context rot is a fundamental limitation of the attention mechanism. Tokens earlier in the context window lose influence as more tokens are added. As implementation details accumulate, debugging sessions, error messages, code iterations. The attention mechanism increasingly weights recent tokens and those semantically similar to the current task.

This manifests as:

- Starting with a clear 5-step architectural plan in early context
- Adding thousands of tokens of implementation work
- Attention weights increasingly focus on recent implementation details
- Original plan specifications have minimal influence on outputs
- Decisions made based on immediate context rather than overall architecture

The result is **implementation drift**, final code barely resembles the original design because the model has effectively “forgotten” the architectural intent buried under layers of implementation tokens.

By keeping the main agent in pure orchestration mode, they never accumulate implementation noise. The architectural plan remains at the front of their context window with maximum influence over all coordination decisions.

---

---

### The Token Trade-Off: Why It’s Worth It

Sub-agents have separate context windows from the main agent. Yes, sub-agents will sometimes read the same files multiple times, increasing input tokens. Having the main agent implement and send out sub-agents to gather context would be more token-efficient, no rereading needed.

But this optimization is false economy for complex tasks.

Consider a typical complex implementation:

- **Orchestration approach**: 3 sub-agents each read 10,000 tokens = 30,000 tokens
- **Direct approach**: Main agent holds accumulated context = 20,000 tokens (less redundancy)

Seems wasteful, right? Factor in the failure modes:

- **Orchestration approach**: Clean execution, minimal rework
- **Direct approach**: Context rot → implementation drift → massive debugging/refactoring or git reset

The redundant reads are insurance against exponentially more expensive recovery work.

### Task Complexity as the Decision Factor

This isn’t universal, it’s about matching approach to task complexity.

**Use orchestration-only when:**

- Task spans multiple domains (UI, backend, database)
- Many integration points between systems
- Working in unfamiliar codebases
- Requirements involve architectural changes
- Implementation requires coordinating multiple components

**Use main-agent implementation when:**

- Single-domain tasks (just UI work, just API changes)
- Well-understood patterns in familiar code
- Quick fixes or feature additions
- Task complexity is genuinely linear

---

![](https://substackcdn.com/image/fetch/$s_!widM!,w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8e4abc46-7f95-4157-aeeb-d79fc47796ed_1200x904.png)

---

### The Complexity Threshold

There’s a clear inflection point where cognitive architecture must fundamentally change. Just like human organizations scale from individual contributors to project managers to program directors, AI task execution needs different patterns at different complexity levels.

Simple tasks: direct execution. Medium tasks: light sub-agent support for context gathering. Truly complex, multi-domain architectural work: the orchestrator must stay at the meta-level to prevent plan dissolution.

### What This Unlocks

This design choice enables capabilities impossible with traditional approaches:

**Multi-session project continuity**: The orchestrator maintains architectural coherence across different work stages because they never lost the instructional details.

**Parallel domain execution**: Multiple implementation streams proceed simultaneously without one main agent becoming a bottleneck.

**Graceful complexity scaling**: As requirements expand, more sub-agents can be deployed without overwhelming the orchestrator’s capacity to coordinate.

---

### The Broader Lesson

This trade-off reveals something fundamental about AI orchestration systems: efficiency and capability often pull in opposite directions. The optimal choice depends entirely on the complexity envelope you’re operating within.

For simple tasks, direct execution wins on speed and token efficiency. But for genuinely complex work—the kind that pushes the boundaries of what’s possible with AI assistance—preserving plan coherence becomes paramount.

The future of AI-assisted development isn’t just about making individual AI instances more capable. It’s about designing orchestration patterns that let us tackle problems too complex for any single agent to hold in working memory, no matter how sophisticated.

That’s why I chose plan preservation over efficiency. Because the most interesting problems are the ones that require it.

---

---

Related Post:[The AI-Augmented Engineer](https://www.augmentedswe.com/p/claude-code-orchestration?utm_source=substack&utm_campaign=post_embed&utm_medium=web)

[

Even if you’re already using Claude Code, you might not know about one of its most powerful capabilities: Subagents…

](https://www.augmentedswe.com/p/claude-code-orchestration?utm_source=substack&utm_campaign=post_embed&utm_medium=web)