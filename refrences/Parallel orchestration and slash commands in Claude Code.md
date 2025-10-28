---
title: "Parallel orchestration and slash commands in Claude Code"
source: "https://www.augmentedswe.com/p/claude-code-orchestration"
author:
  - "[[Jeff Morhous]]"
published: 2025-10-16
created: 2025-10-28
description: "Unlock the full power of Claude Code with your own custom subagents"
tags:
  - "clippings"
---
### Unlock the full power of Claude Code with your own custom subagents

Even if you’re already using Claude Code, you might not know about one of its most powerful capabilities:**[Subagents](https://docs.claude.com/en/docs/claude-code/sub-agents)**



A lot of people use Claude Code like any other AI assistant. You ask a question, get a response, iterate. That works fine for simple tasks. But Claude Code has a hidden superpower that changes everything for complex work.

You can ask Claude to spawn additional copies of itself to work on different parts of a problem simultaneously. These are sub-agents: fresh Claude instances with their own context windows, each focused on a specific task.

While speed is an important benefit of these parallel agents working simultaneously, it’s not the only benefit. In today’s article, Michael walks us through how it works!

### About Michael

> I’m not an AI researcher or a software engineer with a CS degree. I’m a hobbyist programmer who came to really enjoy using AI as a development partner. It might sound silly, but opening a Claude Code terminal gives me this feeling of infinite possibility. This feeling like anything could happen, anything I can imagine could become real. Nothing else has ever felt quite like this.

> I’ve spent hundreds of hours exploring how to get the best results from AI-assisted development. I write about the frameworks, patterns, and techniques that actually work.

> I love Claude Code specifically because of **sub-agents and slash commands**. These features transform AI assistance from “helpful autocomplete” into a genuine collaborative partner that can carry out complex workflows autonomously. They let someone like me, with no formal training, build complex systems that actually work.

If you love today’s article, you might be interested in a few other articles from Michael:

- **[Correlating AI Claude’s response generation awareness to verifiable coding outcomes.](https://typhren.substack.com/p/exploration-of-anthropics-claude)**This explores my initial discovery of just how much awareness and control Claude has of over its own output and how to prompt Claude to utilize this capacity. These initial findings would later grow into my Response Awareness Methodology.
- **[The Science of AI Internal State Awareness: Two Papers That Validate Response-Awareness Methodology.](https://typhren.substack.com/p/the-science-of-ai-internal-state?r=6cw5jw)**This is a technical article covering the academic research that supports the capacity for LLMs to monitor and impart some control over their own internal processes. The core capacity the Response Awareness Methodology leverages.

## Your First Sub-Agent

Here’s something you can try right now in Claude Code.

Instead of asking Claude to research your entire authentication system (which might span dozens of files), you can ask:

> Spawn a sub-agent to research how authentication currently works in this codebase. Have it report back on the middleware pattern, session handling, and any existing security measures.

Claude will create a fresh instance, give it that specific research task, and wait for it to complete. When the sub-agent finishes, it sends back a focused report.

**What just happened:**

- Your main conversation context stayed clean
- The sub-agent did the deep dive through files
- You got a synthesized report instead of watching Claude read 20 files
- Your context window didn’t fill with file contents and exploration

This is useful on its own because the sub-agent filters out everything unrelated to your request. It only reports back what matters. This is where it gets interesting.

## Parallel Sub-Agents

You don’t have to spawn just one sub-agent. You can spawn multiple agents working simultaneously on different aspects of a problem.

*Try this:*

> Spawn three sub-agents in parallel:
> 
> 1\. Research the authentication middleware and how it integrates
> 
> 2\. Research the user database schema and session storage
> 
> 3\. Research the frontend login flow and session handling
> 
> Wait for all three to complete, then summarize their findings.

Now you have three Claudes exploring different domains at the same time. Each has a focused task. Each has its own clean context window. None of them are competing for attention in a single conversation.

When they finish, Claude synthesizes their reports into a coherent picture.

***Why this matters:***

The big win here is focused context windows, not only speed

Each sub-agent holds only what it needs for its specific task. No noise. No competition between “understanding the middleware” and “understanding the database schema.” Each agent can go deep in its domain without filling context with unrelated information.

**The result**: better research, clearer reports, no forgotten details.

## Slash Commands - Saving Your Workflows

Here’s the problem: that three-agent research workflow is powerful, but you don’t want to type it out every time.

This is where **[custom slash commands](https://docs.claude.com/en/docs/claude-code/slash-commands)** come in.

Slash commands are custom prompts you save in.claude/commands/ that trigger complex workflows. Instead of re-explaining your orchestration strategy every time, you create a reusable command.

**How to create one:**

1\. Create a directory:.claude/commands/ in your project

2\. Create a file:.claude/commands/research.md

3\. Write the workflow:

> You are an orchestrator coordinating sub-agents.
> 
> User will provide a topic to research.
> 
> Spawn 3 sub-agents in parallel:
> 
> Agent 1: Find all files and code related to the topic
> 
> Agent 2: Identify dependencies and integration points
> 
> Agent 3: Look for recent changes and potential issues
> 
> Wait for all agents to complete.
> 
> Synthesize their findings into a clear, organized report covering:
> 
> Current implementation
> 
> Key integration points
> 
> Potential concerns or technical debt

***Now use it:***

Restart your Claude Code, then type /research authentication system in your CLI terminal. Notice it autocompletes. As you type, it’ll suggest different slash commands you have in your project. You can navigate with arrow keys and hit tab when the one you want is selected. With a / and a couple letters, you can call upon complex workflows for Claude.

That’s it. Claude reads your slash command file, becomes the orchestrator, spawns the three agents, waits for completion, synthesizes results.

You didn’t re-explain the workflow. You didn’t manage the agents. The slash command encoded your strategy, and Claude executed it.

This changes the game.

Slash commands turn complex multi-agent workflows into single-command operations. Any orchestration pattern you develop, no matter how sophisticated, becomes reusable.

### Why This Solves Implementation Drift

Now we have covered sub-agents, parallelization, and slash commands, here’s what they unlock together: solving implementation drift.

You’ve experienced this before:

You give Claude detailed instructions. A complex feature spanning UI, backend, and database. You’ve been specific. You’ve thought it through.

Halfway through implementation, it starts drifting. That API endpoint you specified? It’s different now. The validation logic you emphasized? Missing. By the end, you’re debugging code that barely resembles what you asked for.

This is a fundamental limitation. A single context window trying to hold architecture, implementation details, debugging sessions, and all your original requirements simultaneously. Something has to give.

The answer isn’t bigger context windows. It’s parallel orchestration, and now you know how to use it.

### The Problem: Context Rot

Every complex task requires holding two types of information:

1\. The comprehensive plan - your requirements, architecture, integration points

2\. Implementation details - syntax, debugging, API calls, edge cases

When Claude implements directly, these compete for the same context window. As implementation tokens accumulate—error messages, code iterations, debugging—the attention mechanism progressively weights recent work over your original instructions.

This is context rot: your architectural plan, buried under thousands of tokens of implementation noise, loses influence over outputs. The model makes decisions based on immediate context rather than overall design.

**Result**: implementation drift. The final code doesn’t match your specification because Claude has effectively “forgotten” it.

### Parallel Orchestration Solves Context Rot

Instead of one Claude doing everything, you split the work across specialized agents running in parallel, each with a focused context window:

**Main orchestrator:** Holds your requirements pristine, never implements

**Planning agents:** Design architecture in parallel domains (UI, backend, data)

**Synthesis agent:** Integrates plans, resolves conflicts

**Implementation agents:** Execute code in parallel streams

**Verification agents:** Check assumptions, clean up patterns

Each agent holds only what it needs. No cognitive overload. No drift.

The orchestrator coordinates everything without losing your original intent.

### Full-Feature Orchestration with Slash Commands

Now let’s look at a more sophisticated slash command example—orchestrating an entire feature implementation with phases.

Early on, I tried a simpler approach—spawn agents where each handled their full domain vertically: one agent did UI planning and implementation, another did backend planning and implementation, etc. All in parallel.

Disaster. The UI agent made assumptions about API structure. The backend agent designed endpoints differently. By the time they finished, integration points didn’t align. The database schema didn’t match what either expected. Total mess requiring extensive rework.

The solution is the synthesis agent. Separate planning from implementation with a synthesis step in between. All agents do planning in parallel, then synthesis creates a unified plan ensuring integration points align, then implementation agents work from that coordinated blueprint. Parallel execution with coordinated architecture.

Here’s a /feature command:

.claude/commands/feature.md:

You are the main orchestrator. DO NOT implement anything yourself.

The user will describe a feature. Your job:

1\. Spawn planning agents in parallel:

- Agent 1 (system-architect role): Overall design and integration points
- Agent 2 (ui-planner role): Interface structure and user experience
- Agent 3 (data-architect role): Database schema and data flow

2\. Review all planning reports. Identify conflicts or gaps.

3\. Spawn synthesis agent (general-purpose):

Task: Review all plans, resolve conflicts, create unified blueprint

Provide all planning reports as context

4\. Spawn implementation agents in parallel (general-purpose):

- Agent 1 (frontend role): UI components based on synthesis plan
- Agent 2 (backend role): API endpoints based on synthesis plan
- Agent 3 (database role): Migrations and queries based on synthesis plan
- Each agent receives the synthesis blueprint and relevant planning docs.

5\. Spawn verification agents (general-purpose):

- Agent 1 (reviewer role): Check assumptions, remove unnecessary code
- Agent 2 (tester role): Validate edge cases, test coverage

Report progress at each phase. Never lose track of user requirements.

### Important note on agent types:

Claude Code has only three built-in agent types: general-purpose, statusline-setup, and output-style-setup. The names like “system-architect” and “frontend-engineer” are labels for custom agents. If you haven’t made them, Claude will just prompt regular subagents to do the work.

## Creating your own custom subagents:

You can also define your own specialized sub-agent types by creating configuration files in.claude/agents/. For example, create.claude/agents/code-reviewer.md with specific instructions about how that agent should behave, what it should look for, and how it should report findings.

These instructions serve as essentially an extension to the subagents system prompt. Once defined, you can reference these custom agents in your slash commands just like you would the built-in general-purpose type. This lets you encode expert knowledge into reusable agent behaviors—a code reviewer that knows your team’s conventions, a database architect that understands your schema patterns, or a security analyst that checks for your specific compliance requirements. Custom agents become part of your project’s orchestration toolkit.

Now instead of explaining orchestration every time, you type:

/feature Add real-time collaborative editing to the document viewer

Claude becomes the orchestrator. Spawns planning agents in parallel, waits for completion. Reviews their outputs. Synthesizes into a unified plan. Implements across domains using that plan. Verifies assumptions.

Your requirements stay pristine in the orchestrator’s context while implementation happens in focused sub-agent windows. Each agent receives exactly the context it needs—no more, no less.

### The Token Trade-Off

The orchestration approach uses more tokens. Each sub-agent has its own context window, which means redundant file reads.

Note: The following numbers are illustrative examples based on typical scenarios. Actual token usage and costs vary by task complexity and codebase size.

Example task: Refactoring authentication across 15 files (~50,000 tokens of code)

**Single-agent approach:**

- Input tokens: ~50,000 (file reads) + ~10,000 (reviewing own work) = 60,000
- Output tokens: ~30,000 (implementation)
- Total: ~90,000 tokens

**Orchestration approach:**

- Input tokens: ~195,000 (multiple agents reading files, plans, code)
- Output tokens: ~60,000 (plans, synthesis, implementation, reports)
- Total: ~255,000 tokens

3x more input tokens. Seems wasteful.

But here’s the critical insight: token costs aren’t equal. Claude Sonnet 4.5 pricing:

Input tokens: $3 per million ($0.003 per 1K)

Output tokens: $15 per million ($0.015 per 1K)

Output tokens cost 5x more than input tokens.

***The orchestration approach spends extra money on the cheap side (input - potential redundant file reads) to improve quality on the expensive side (output - generated code).***

**For simple tasks, single-agent wins:**

- Single-file bug fix or straightforward feature:
- Single-agent: $0.50, works fine
- Orchestration: $1.50, overkill

Clear winner: single-agent.

For complex tasks, the math reverses completely:

Multi-domain feature with integration points - here’s what actually happens:

**Single-agent reality (complex task with drift):**

- Initial implementation: 90K tokens, $0.63
- Discover integration issues during testing: 60K tokens exploring, $0.40
- First refactor attempt: 120K tokens, doesn’t fully fix the issue, $0.90
- Second refactor with different approach: 150K tokens, introduces new bugs, $1.15
- Debugging the new bugs: 80K tokens, $0.60
- Final attempt to salvage: 100K tokens, still doesn’t match requirements, $0.75
- Total spent: ~$4.43 for code that doesn’t work right

Outcome: Git reset to previous commit, throw away all work, start over

That’s 600K tokens and $4.43 spent to get nothing. Now you start fresh and hope the second attempt goes better.

**Orchestration reality (same complex task):**

- Clean execution: 255K tokens, $1.485
- Minor adjustments: 10K tokens, $0.08
- Total: ~$1.57 for code that works and matches requirements
- Outcome: Much more likely to produce working implementations, no git reset needed

The difference:

Orchestration: $1.57, working code, done

Single-agent: $4.43 wasted + starting over = $4.43 + another attempt

Even if second attempt succeeds cleanly: $5.06 total vs orchestration’s $1.57

On genuinely complex tasks, orchestration isn’t just better—it’s multiple times cheaper because it avoids the catastrophic failure mode where implementation drift forces you to throw away everything and reset to a previous commit.

The extra input token cost is insurance against expensive output token waste on debugging, refactoring, and complete do-overs. For complex multi-domain work, orchestration actually saves money, time, and frustration.

**When to Use Orchestration**

- Use orchestration when:
- Task spans multiple domains (UI + backend + database)
- Many integration points between systems
- Working in unfamiliar codebases
- Requirements involve architectural changes
- Task complexity exceeds single-agent cognitive load

**Use single-agent when:**

- Single-domain tasks (just UI, just API)
- Well-understood patterns in familiar code
- Quick fixes or feature additions
- Task is genuinely linear

## What This Unlocks

Capabilities that become possible with parallel orchestration:

Multi-domain coherence: UI, backend, and database changes align because the orchestrator maintains integration points while agents implement in focused contexts

Parallel complexity scaling: Add more agents as requirements expand without overwhelming any single agents context

Plan preservation: Your original requirements make it all the way to working code without degradation

Architecture fidelity: Final implementation matches design because the orchestrator never lost it

## Common Mistakes to Avoid

As I developed this approach, I hit a few important lessons:

**Mistake 1: Orchestrator implements “just this one small thing”**

- Result: The orchestrator’s context fills with implementation details, plan coherence degrades. Keep the orchestrator pure.

**Mistake 2: Vague agent tasks**

- Bad: “Plan the system”
- Good: “Design authentication flow identifying all integration points with existing middleware”

Result: Specific tasks get specific, useful results.

**Mistake 3: Using orchestration for simple tasks**

- Result: 3x token cost for tasks that don’t need it. Save orchestration for genuinely complex multi-domain work.

---

