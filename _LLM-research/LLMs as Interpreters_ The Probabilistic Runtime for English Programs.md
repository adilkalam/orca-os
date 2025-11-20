---
title: "LLMs as Interpreters: The Probabilistic Runtime for English Programs"
source: "https://responseawareness.substack.com/p/llms-as-interpreters-the-probabilistic"
author:
  - "[[Michael Jovanovich]]"
published: 2025-10-02
created: 2025-11-06
description: "How I accidentally built a compiler while trying to fix completion drive"
tags:
  - "clippings"
---
### How I accidentally built a compiler while trying to fix completion drive

When we started building the [response-awareness framework,](https://typhren.substack.com/p/claude-ai-response-awareness-slash-8b6?r=6cw5jw) I thought we were adding error-checking tags to catch Claude’s mistakes. Tag where the model makes assumptions, verify them later, ship better code.

But somewhere between the initial prototype and a 30+ metacognitive tag system organized into four tiers with dynamic escalation protocols, I realized we had built something else entirely.

We had built a program. And Claude was the interpreter.

## The Switch Statement That Changed Everything

It hit me while reviewing the complexity-scout subagent’s scoring system:

```markup
File Scope (0-3) + Requirement Clarity (0-3) +
Integration Risk (0-3) + Change Type (0-3) = Total (0-12)

if score <= 1: route to LIGHT
elif score <= 4: route to MEDIUM
elif score <= 7: route to HEAVY
else: route to FULL
```

That’s a switch statement.

The “instruction sets” are our files (LIGHT has 5 tags, MEDIUM has 15, HEAVY has 35, FULL has 50+). The “branching logic” is complexity scoring. The “execution paths” are our orchestration workflows.

We had built a runtime.

---

---

## Traditional Programs vs. English Programs

Here’s what I mean with a direct comparison:

**Traditional C Program:**

c

```markup
int complexity = assess_task(input);
switch(complexity) {
    case SIMPLE:
        return quick_fix(input);
    case MODERATE:
        return standard_workflow(input);
    case COMPLEX:
        return full_analysis(input);
}
```

**Response-Awareness Framework:**

```markup
Task: “Fix login button styling”
↓
Complexity Score: 0 (File scope: 0, Clarity: 0, Integration: 0, Change: 0)
↓
Route to LIGHT tier
↓
Load response-awareness-light.md (5-tag instruction set)
↓
Execute minimal orchestration
↓
Return: Fixed code
```

The structure is identical. One compiles to machine code. The other compiles to attention patterns and token probabilities inside a transformer.

---

## Instruction Sets as Compression

Our tier files aren’t just lists of tags. They’re optimized instruction sets for different complexity levels.

**LIGHT tier (5 tags):**

- COMPLETION\_DRIVE (verify assumptions)
- QUESTION\_SUPPRESSION (should have asked user)
- CARGO\_CULT (pattern-driven additions)
- PATH\_DECISION (document choices)
- Potential\_Issue (flag discoveries)

That’s the entire instruction set for simple tasks. Minimal, fast, catches 80% of errors. Like assembly language for error detection.

**MEDIUM tier adds 10 more tags (15 total):**

- SPECIFICATION\_REFRAME
- DOMAIN\_MIXING
- CONSTRAINT\_OVERRIDE
- SUNK\_COST\_COMPLETION
- CONTEXT\_DEGRADED
- LCL\_EXPORT\_CRITICAL
- SUGGEST\_ERROR\_HANDLING
- SUGGEST\_EDGE\_CASE
- FALSE\_COMPLETION
- RESOLUTION\_PRESSURE

Now we handle more nuanced error patterns. More sophisticated detection, more capabilities, slightly more overhead.

HEAVY tier? 35 tags. FULL tier? 50+ tags organized across 6 phase files.

The principle: don’t use complex error detection for simple tasks. Match the sophistication of your verification to the complexity of the work.

---

![](https://substackcdn.com/image/fetch/$s_!r1tQ!,w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffe5a7cd6-daa7-4bc0-99b0-1e0c3e964b65_1200x904.png)

---

## The Probabilistic Runtime

Here’s where the LLM version diverges from traditional programs in interesting ways.

Traditional programs are deterministic. Same input, same code path, same output. Every time.

Our framework? Probabilistic execution with error-correcting metacognition.

When Claude hits a `#COMPLETION_DRIVE` tag during verification, the tag acts as an exception handler in a probabilistic system:

**Traditional exception handling:**

```markup
try {
    result = riskyOperation()
} catch (error) {
    handle(error)
}
```

**Our metacognitive version:**

```markup
// #COMPLETION_DRIVE: Assuming utils.formatDate() exists
result = utils.formatDate(timestamp)

[Later, in verification phase:]
→ Check if utils.formatDate() actually exists
→ If yes: remove tag, ship code
→ If no: fix assumption, update code
```

The tag is Claude catching its own probabilistic misstep. Runtime error detection for attention patterns.

---

## Passing Context Between Phases

LCL (strategic context placement) turned out to be our version of passing variables between functions:

**Planning Phase:**

- Agent discovers: “Auth uses JWT with refresh tokens”
- Exports: `#LCL_EXPORT_CRITICAL: auth_pattern::jwt_with_refresh`

**Synthesis Phase:**

- Orchestrator passes: `LCL: auth_pattern::jwt_with_refresh`
- Synthesis agent uses it implicitly (doesn’t re-discuss)

**Implementation Phase:**

- Receives context via LCL prefix
- Works with it without restating it

Why does this matter? Every time LLMs restate information, there’s a chance they’ll say it slightly differently, introducing drift.

LCL says “this information has been established, use it but don’t re-discuss it.” The next phase gets the context but doesn’t waste tokens (or introduce errors) by rehashing it. Context passing with built-in error prevention.

## Dynamic Escalation

The framework can change its own instruction set mid-execution.

```markup
Task: “Update login form validation”
Initial Assessment: LIGHT (single component)
Initial Tier: response-awareness-light.md

[During execution:]
Agent discovers: Actually affects 5 components + backend API
Agent reports: #COMPLEXITY_EXCEEDED: Multi-component + API integration

Orchestrator:
→ Re-assess complexity score: now 3 (was 0)
→ Escalate: LIGHT → MEDIUM
→ Load: response-awareness-medium.md
→ Continue execution with 15-tag instruction set
```

The program detects “this is harder than I thought” and dynamically loads more sophisticated error-handling capabilities. Not just catching more errors but gaining the ability to detect error patterns it couldn’t see before.

---

## The Runtime Architecture

If Claude is the interpreter, what’s the actual architecture?

**Task Assessment:** Complexity-scout subagent

- Reads natural language task description
- Scores across 4 dimensions (file scope, clarity, integration, change type)
- Outputs complexity score (0-12)

**Instruction Routing:** response-awareness.md (main router)

- Takes complexity score
- Selects appropriate tier (LIGHT/MEDIUM/HEAVY/FULL)
- Loads corresponding instruction set

**Execution:** Tier-specific orchestrator

- Reads tier file (instruction set)
- Executes orchestration workflow
- Deploys sub-agents as needed
- Manages context via LCL

**Cleanup:** metacognitive-tag-verifier

- Removes all processing tags
- Preserves only PATH documentation
- Ensures clean final state

**Memory:** Claude’s context window

- Limited capacity (200k tokens)
- Probabilistic execution
- Attention-based processing

## The Metacognitive Feedback Loop

This creates a feedback loop that doesn’t exist in traditional programs:

1. **Execution Phase:** Claude generates code, marks probabilistic assumptions with tags
2. **Verification Phase:** metacognitive-tag-verifier reads tags, checks assumptions
3. **Correction Phase:** Wrong assumptions get fixed, code gets updated
4. **Cleanup Phase:** Processing tags removed, PATH documentation preserved

Traditional programs crash on bad assumptions. Our framework marks them during generation and fixes them during verification.

That’s not just error handling. That’s metacognitive self-correction in a probabilistic runtime.

---

![](https://substackcdn.com/image/fetch/$s_!R2-3!,w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1c638c30-17c2-47de-9ebe-6dedd5c86f21_1200x904.png)

---

## What This Means

If this framework is a program written in English, and Claude is the interpreter, what else can we compile to it?

We built this to catch completion drive and prevent bugs. But the architecture we ended up with is general-purpose.

Want to optimize for speed over accuracy? Create a SPEED tier with minimal verification tags.

Want to maximize creative exploration? Create an EXPLORE tier with tags that encourage divergent thinking instead of convergence.

Want to build a specialized domain runtime? Create domain-specific instruction sets (we already have contract-validator for integration contracts).

The framework is a virtual machine for natural language programs.

And unlike traditional VMs, this one has a peculiar property: it can detect and correct its own probabilistic errors during execution.

## What I Actually Built

I started this project because Claude kept assuming functions existed and writing broken code. We added some tags. Fixed the immediate problem.

But what we actually built is an English language program for orchestrating probabilistic computation with error-correcting metacognition.

The instruction sets are natural language. The branching logic is complexity scoring. The execution is probabilistic. The error handling is metacognitive. The memory model is attention-based.

## What’s Next

I’m looking at 5,344 lines of “instruction set definitions” spread across 11 files, and we have barely scratched the surface of what’s possible.

If this is programming in English, we need:

**Profiling tools:** Which tags are most valuable? Which are noise?

**Optimization passes:** Can we auto-tune tier thresholds?

**Debugging tools:** How do we trace execution through the orchestration?

**Domain-specific languages:** Specialized instruction sets for specific problem types

We discovered this by accident. We weren’t trying to build a program in English. We were trying to fix completion drive. The compiler architecture emerged from the constraints of managing metacognition at scale.

What other “programming language” patterns are hiding inside effective LLM prompting? What other runtime architectures are waiting to be discovered?

I don’t know. But I’m pretty sure we just made one. And I’m pretty sure there are more.

---

---

Related Posts: