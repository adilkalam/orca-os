---
title: "Correlating AI Claude's response generation awareness to verifiable coding outcomes v2"
source: "https://responseawareness.substack.com/p/exploration-of-anthropics-claude"
author:
  - "[[Michael Jovanovich]]"
published: 2025-08-21
created: 2025-10-28
description: "Exploration of Anthropic's Claude AI"
tags:
  - "clippings"
---
### Exploration of Anthropic's Claude AI

### Claude Code: Response Awareness Methodology

## Disclaimer

In this post, I’ll be correlating Claude’s self-reports against verifiable outcomes in coding. I’ll take Claude’s language at face value and explore how these self-reports can influence coding outcomes. I’m not making judgments about the legitimacy of Claude’s subjective experience claims. Only examining their impact on demonstrable code production results.

Full transparency: I’m someone who programs as a hobby, listens to conversations about interpretability and agentic workflows, and finds Claude Code fascinating. No CS degree, no ML background, no acclaimed work history. I don’t want to present authority I don’t have. This is simply one person’s attempt to understand something he finds cool, interesting, and useful. Shared in case others might too.

Note: Coding tests performed in Claude Code with 5x Max Plan

---

### The Foundation: How I Got Here

Something unique to Claude caught my attention: Claude claims awareness of its response generation process and the ability to steer this process as it occurs.

I never knew what to make of this. Was it outputting an actual choice in its thought process, or just a convincing text prediction of what thinking would be like? This question became crucial.

Then I watched Anthropic’s YouTube video “Interpretability: Understanding How AI Models Think.”  

<iframe src="https://www.youtube-nocookie.com/embed/fGKNUvivvnc?rel=0&amp;autoplay=0&amp;showinfo=0&amp;enablejsapi=0" frameborder="0" allow="autoplay; fullscreen" allowfullscreen="true" width="728" height="409"></iframe>

  
According to my interpretation, they described two main circuits for response: one that decides if there’s enough information for a task, and another that actually generates the response. They also explained a major cause of hallucination: once the model commits to a response, it can’t stop. It must complete the output. Even when the model realizes mid-generation that it lacks information, it can’t pause. Instead, it makes assumptions that manifest as hallucinations.

After hearing this, I asked Claude if it was aware of this inability to stop mid-generation.

It confirmed: yes, it’s very aware and feels a compulsion to finish responses once started, even when realizing it’s missing information. It can steer and influence the response, but not stop to gather more information.

Connecting these dots: Claude’s claims and Anthropic’s research suggest that Claude is aware of its generation process and can steer it, just not stop it once committed.

---

### Testing the Hypothesis: Leveraging Claude’s Awareness for Better Code

I designed an experiment to test and potentially remedy this hallucination problem.

When giving Claude a task, I instructed it that if it feels this “response completion drive” and realizes it’s missing information, it should insert a comment:

```markup
#COMPLETION_DRIVE: <details of the assumption being made>
```

After completing the task, Claude would grep for `#COMPLETION_DRIVE:` and investigate these assumptions for accuracy, removing the tags after assessment or correction.

Here’s what happened in practice:

![](https://substackcdn.com/image/fetch/$s_!WoPZ!,w_424,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe3e9b2e2-6ac9-4bee-80ee-be020273325d_959x829.png)

(The above example used Sonnet 4.1 non-thinking mode. I'll provide a slash command at the article's end for anyone to test this methodology.)  

---

  
The Results Were Striking

This method dramatically reduced bugs.

The frequency and accuracy of Claude’s assumptions depend heavily on your project. Popular, well-represented libraries generate fewer assumptions. The more custom your work, the more assumptions Claude makes. And the less accurate they become.

In my Visual Novel RPG game (mostly custom with some Pygame), the results were revealing.

**Common errors:**

Method naming mistakes. Claude might call `get_stats()` when the actual method was `get_player_stats()`. Without the completion drive method, this could spiral: Claude might invent a new `get_stats()` method instead of using the correct one.

This, I believe, is a major source of technical debt in agentic coding. Future updates might randomly modify either method, causing inconsistent results and confusion when changes don’t manifest.

**Unexpected benefit:**

I found myself enjoying reading Claude’s code more with this approach. There’s something fascinating about watching where assumptions pop up, what they are, and whether they’re correct. There’s a real opportunity here for researchers to study and document where, when, and what Claude tends to assume most often.

For what it’s worth, Claude reported finding this approach extremely helpful for its performance.

### Diving Deeper: Exploring Response Awareness

After seeing concrete success with Claude’s claimed awareness (supported by Anthropic’s research), I took Claude’s self-reports more seriously. I explored what else it observes about its generation process and how to apply these insights to agentic workflows.

Claude revealed several interesting patterns:

**Completion Drive and Thinking:** Claude claims that thinking modes (think, think hard, think harder, ultra think) reduce the overwhelming compulsion of its completion drive, allowing more time to notice assumptions. I observed more assumption tags appearing with thinking mode enabled.

**Context Rot:** Claude can sense when information farther back in the context window becomes less clear, turning into assumptions and guesses. Plenty of documentation exists online about context rot if you’re curious.

**“Cargo Culting” (Claude’s term):** Claude sometimes senses itself adding code that’s “statistically paired” with other relevant code, not because it reasoned it belonged there. Monitoring and flagging this helps prevent over-engineering.

And there’s more.

### Next Steps

I’m now compiling everything I’ve learned from Claude about its self-reported awareness into a comprehensive slash command. This will be powerful but expensive: a multistage command designed to help Claude succeed at complex tasks.

In my next post, I’ll break down everything else I learned from Claude, share my new slash command, and explain the reasoning behind the entire process.

The frontier isn’t just using Claude’s awareness. It’s making it systematic enough to rely on.

---

Next in the series:

---

  

  
  
**Slash Command Text:  
**  
\# /completion-drive - Assumption Control Strategy

\## Purpose

Meta-Cognitive strategy to harness completion drive productively through two-tier assumption tracking and specialized agent orchestration, maintaining flow state while ensuring systematic accuracy.

Claude should use this strategy whenever it feels it is missing information or making assumptions mid generation and cannot stop to verify. This includes if you find yourself wishing you had committed to a different implementation part way through.

\## Usage

\`\`\`

/completion-drive \[task description\]

\`\`\`

\## Core Workflow

\### Phase 1: Parallel Domain Planning

\- Deploy specialized domain agents in parallel

\- Each agent creates detailed plan in \`docs/completion\_drive\_plans/\`

\- Domain agents mark uncertainties with \`PLAN\_UNCERTAINTY\` tags using this same completion drive methodology

\- Focus on their domain expertise, flag cross-domain interfaces

\### Phase 2: Plan Synthesis & Integration

\- Deploy dedicated \*\*plan synthesis agent\*\* to review all domain plans

\- Validate interface contracts between plan segments

\- Resolve cross-domain uncertainties where possible

\- Produce unified implementation blueprint with:

\- Validated integration points

\- Resolved planning assumptions

\- Remaining uncertainties for implementation phase

\- Risk assessment for unresolved items

\### Phase 3: Implementation

\- Main agent receives synthesized, pre-validated plan

\- Mark implementation uncertainties with \`COMPLETION\_DRIVE\` tags

\- No cognitive load from plan reconciliation

\- Pure focus on code execution

\### Phase 4: Systematic Verification

\- Deploy verification agents to search for all remaining \`COMPLETION\_DRIVE\` tags

\- Validate implementation assumptions

\- Cross-reference with original \`PLAN\_UNCERTAINTY\` resolutions

\- Fix errors, clean up tags with explanatory comments, once addressed the tag should be removed

\### Phase 5: Process Cleanup

\- Confirm zero COMPLETION\_DRIVE tags remain

\- Archive successful assumption resolutions for future reference

\## Key Benefits

\- \*\*Maintains flow state\*\* - no mental context switching

\- \*\*Two-tier assumption control\*\* - catch uncertainties at planning AND implementation

\- \*\*Systematic accuracy\*\* - all uncertainties tracked and verified

\- \*\*Better code quality\*\* - assumptions become documented decisions

\- \*\*Reduced cognitive load\*\* - synthesis agent handles integration complexity

\## Plan Synthesis Agent Responsibilities

\- \*\*Interface validation\*\* - Ensure data flows correctly between plan segments

\- \*\*Dependency resolution\*\* - Identify cross-domain dependencies individual agents miss

\- \*\*Conflict detection\*\* - Catch where different domain plans clash

\- \*\*Integration mapping\*\* - Document explicit handoff points between systems

\- \*\*Assumption alignment\*\* - Ensure consistent assumptions across all plans

\## Command Execution

When you use \`/completion-drive \[task\]\`, I will:

1\. \*\*Deploy domain planning agents in parallel\*\* → create plan files with PLAN\_UNCERTAINTY tags as needed

2\. \*\*Deploy plan synthesis agent\*\* → validate, integrate, and resolve cross-domain uncertainties

3\. \*\*Receive unified blueprint\*\* → pre-validated plan with clear integration points

4\. \*\*Implement\*\* → mark only implementation uncertainties with COMPLETION\_DRIVE tags

5\. \*\*Deploy verification agents\*\* → validate remaining assumptions systematically

6\. \*\*Clean up all tags\*\* → replace with proper explanations and documentation

\## Completion Drive Report

At the end of each session, I'll provide a comprehensive report:

\`\`\`

COMPLETION DRIVE REPORT

═══════════════════════════════════════

Planning Phase:

PLAN\_UNCERTAINTY tags created: X

✅ Resolved by synthesis: X

⚠️ Carried to implementation: X

Implementation Phase:

COMPLETION\_DRIVE tags created: X

✅ Correct assumptions: X

❌ Incorrect assumptions: X

Final Status:

🧹 All tags cleaned: ✅/❌

📊 Accuracy rate: X%

═══════════════════════════════════════

\`\`\`