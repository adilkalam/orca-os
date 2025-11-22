---
title: "“7 Steps” How to Stop Claude Code from Building the Wrong Thing (Part 1): The Foundation of…"
source: "https://alirezarezvani.medium.com/7-steps-how-to-stop-claude-code-from-building-the-wrong-thing-part-1-the-foundation-of-2d2c9c1a99f1"
author:
  - "[[Reza Rezvani]]"
published: 2025-09-17
created: 2025-11-06
description: "“7 Steps” How to Stop Claude Code from Building the Wrong Thing (Part 1): The Foundation of Spec-Driven Development Learn how to stop Claude Code from rewriting your architecture with vague …"
tags:
  - "clippings"
---
[Sitemap](https://alirezarezvani.medium.com/sitemap/sitemap.xml)

[Mastodon](https://me.dm/@alirezarezvani)

Learn how to stop Claude Code from rewriting your architecture with vague prompts. This guide introduces Spec-Driven Development, persistent context systems, and Engineering Constitutions to preserve context and boost engineering productivity.

![Mastering Spec Driven Development with Claude Code](https://miro.medium.com/v2/resize:fit:640/format:webp/1*6aeUMhghIv4kp67za6ZZ9g.png)

Spec Driven Development with Claude Code

Every engineering team working with [Claude Code](https://docs.claude.com/en/docs/claude-code/terminal-config) — or any agentive coding tool, like [Codex CLI](https://developers.openai.com/codex/cli) or [Gemini CLI](https://github.com/google-gemini/gemini-cli) — has lived through the same nightmare: you ask the AI to extend yesterday’s feature, and it rewrites your architecture from scratch. The problem isn’t the AI. It’s the lack of clear, persistent specifications.

That’s where **Spec-Driven Development (SDD)** comes in. Instead of vague prompts and lost context, you build a **repeatable system of specifications, rules, and clarifications** that guide the AI to produce consistent, production-ready code.

In this first part of the guide, we’ll cover the **foundation** of SDD:

- Setting up a persistent memory system for Claude Code
- Writing your first **Engineering Constitution** (with a real example from 1 engineer to a 10-person startup or bigger)
- Learning how to specify features the right way — before the AI ever writes a line of code

These steps may sound simple, but they’re the difference between endless rework and a codebase your whole team can trust.

👉 *Once you understand the foundation, you’ll be ready for* [*Part 2*](https://alirezarezvani.medium.com/7-steps-how-to-stop-claude-code-from-building-the-wrong-thing-part-2-execution-results-and-d990ef7d92db)*, where we move from specifications to execution — planning architectures, breaking down tasks, and seeing how real teams cut rework by up to 80%.*

## The Everyday Problem with AI Coding Assistants

Every engineering team using Claude Code — or any AI coding assistant — has faced the same headache: you ask the AI to “just add a webhook,” and suddenly it rewrites your entire payment flow with a new architecture. What was working yesterday is broken today.

This isn’t an Anthropic problem, or even an AI problem. It’s a **context and specification problem**. When instructions are vague, the AI fills in the blanks with its own assumptions. When context disappears between sessions, it rebuilds from scratch.

The result? Lost hours, rising technical debt, and frustration make teams wonder if AI coding is worth the hassle.

The good news: it doesn’t have to be this way. With a process called **Spec-Driven Development (SDD)**, you can transform Claude Code from a random generator into a consistent, reliable engineering partner.## [GitHub - alirezarezvani/claude-code-tresor: A world-class collection of Claude Code utilities…](https://github.com/alirezarezvani/claude-code-tresor?source=post_page-----2d2c9c1a99f1---------------------------------------)

A world-class collection of Claude Code utilities: autonomous skills, expert agents, slash commands, and prompts that…

github.com

[View original](https://github.com/alirezarezvani/claude-code-tresor?source=post_page-----2d2c9c1a99f1---------------------------------------)

## What is Spec-Driven Development (SDD)?

Most teams fall into the trap of thinking they need “better prompts.” But better prompts don’t solve the core problem: AI doesn’t remember context unless you give it a system to hold onto.

Spec-Driven Development flips the script. Instead of coding first and cleaning up later, you define **detailed specifications and rules** that guide AI output from the start.

**Think of it like building a house:**

- Asking AI with vague prompts is like telling builders, “Make me a nice house.”
- SDD is like giving them full architectural blueprints, material lists, and construction phases.

## The Traditional Way vs. The Spec-Driven Way

**Traditional AI Workflow:**  
Idea → Vague description → AI generates code → Wrong result → Rework

**Spec-Driven Workflow:**  
Idea → Detailed specification → Clarifications → Plan → Executable tasks → Correct code

## Why Teams Adopt Spec-Driven Development

SDD isn’t a theory. It’s already in use by startups, agencies, and scale-ups that need consistency and predictability with Claude Code. Here’s what they report:

- **Consistency across sessions:** AI outputs align even after conversations are reset.
- **Predictable outcomes:** Specifications prevent the AI from filling gaps with guesswork.
- **Team alignment:** Multiple developers get consistent patterns instead of conflicting ones.
- **Reduced rework:** Teams see rework cut by up to 80% — not a small efficiency gain, but transformative.
- **Knowledge preservation:** Decisions and rationales are documented automatically, so new engineers can onboard faster.

> *Of course, no system is perfect.*

## The Drawbacks You Should Know

- **Upfront time cost:** Writing specs takes 20–30 minutes per feature. Worth it for production work, not always for one-off hacks.
- **Learning curve:** The first few features feel slower — after that, speed compounds.
- **Not ideal for exploration:** If you’re prototyping or experimenting, SDD can feel restrictive.
- **Requires discipline:** Specifications and context files only work if you maintain them.## [From Assistant to Autonomous Engineer: The 9-Month Technical Evolution of Claude Code](https://alirezarezvani.medium.com/from-assistant-to-autonomous-engineer-the-9-month-technical-evolution-of-claude-code-1671362d6902?source=post_page-----2d2c9c1a99f1---------------------------------------)

[

alirezarezvani.medium.com

](https://alirezarezvani.medium.com/from-assistant-to-autonomous-engineer-the-9-month-technical-evolution-of-claude-code-1671362d6902?source=post_page-----2d2c9c1a99f1---------------------------------------)

## Phase 1 — Build the Foundation

SDD is built in three phases: **Foundation → Specification → Execution**. In this first part, we’ll focus on the foundation — the practices that stop Claude Code from going off the rails.

## Action 1: Install a Persistent Memory System

Claude Code doesn’t come with long-term context out of the box. You need a layer that preserves project memory. Here are three proven options:

**Option A: GitHub’s Spec Kit (Free, Official)**

```c
uvx --from git+https://github.com/github/spec-kit.git specify init my-app --ai claude
cd my-app
```
- Provides `/specify`, `/plan`, and `/tasks` commands.
- Maintained by GitHub, integrates tightly with Claude Code.
- Best choice if you want systematic, command-driven development.
- Download it from the [official Spec Kit Repo on GitHub](https://github.com/github/spec-kit.git).

**Option B: Agent OS from** [**Brian Casel**](https://www.youtube.com/@briancasel) **(Visual, Structured) — Highly professional and recommended**

- A visual operating system for AI agents ([buildermethods.com/agent-os](https://buildermethods.com/agent-os)).
- Excels at managing complex projects and explaining context to non-technical stakeholders.
- Best choice if you work in mixed teams.

**Option C: Claude Code Tresor (Lightweight, Flexible)**

- My lightweight context system ([github.com/alirezarezvani/claude-code-tresor](https://github.com/alirezarezvani/claude-code-tresor)).
- Optimized for teams that want flexibility without heavy frameworks.
- Best choice if you value simplicity and direct control.

👉 Choose one and install it today. Without persistent memory, the rest of SDD won’t stick.

## Action 2: Create Your Engineering Constitution

This is where most teams go wrong: they write endless theoretical rules nobody reads. A good constitution is short, scar-driven, and focused on your real pain points.

Start with just three rules. Ask yourself:

- What mistakes did Claude Code make that wasted the most time?
- What decisions do we *never* want to debate again?

Here’s a real example from a 10-person startup:

```c
# Engineering Constitution
Version: 3.2 | Last Updated: 2025-09-15

## Core Rules (Non-Negotiable)
### Rule 1: Database Choice is Final
We use PostgreSQL with Prisma ORM. Never suggest MongoDB, MySQL, DynamoDB, or raw SQL.  
Rationale: We spent two weeks migrating from MongoDB. Never again.
### Rule 2: API Before UI
Every feature starts with backend API endpoints. Frontend comes after.  
Rationale: Three features had to be rebuilt when we did UI first.
### Rule 3: Error Handling is Not Optional
Every function must handle errors explicitly.  
Every API returns standardized error responses.  
Rationale: Silent failures in production cost us $30K in lost sales.
```

**Notice:** each rule exists because of a scar. That’s the secret — rules built on pain get respected.

## Action 3: Specify Features the Right Way

Now comes the step most developers resist: writing specifications before coding. But this is where the system saves you hours.

Here’s an example using `/specify`:

```c
/specify Build a team workspace feature where multiple users can:
- Share projects with role-based permissions
- See real-time presence indicators
- Leave comments on code
- Track changes with attribution
```
```rb
Current setup: Next.js 14, PostgreSQL, single-user authentication
```

Instead of just generating code, Claude Code asks clarifying questions:

```c
## Needs Clarification
- Can users belong to multiple workspaces?
- What happens to shared projects if the owner deletes their account?
- Should comments be versioned when code changes?
```

Each clarification represents hours of future rework that will be avoided. Even answering *“undefined for MVP”* is better than leaving it blank.## [Finally arrived: Claude Code in Browser & on your mobile phone: The Dev Workflow (R)evolution](https://alirezarezvani.medium.com/finally-arrived-claude-code-in-browser-on-your-mobile-phone-the-dev-workflow-r-evolution-502efff6d9b9?source=post_page-----2d2c9c1a99f1---------------------------------------)

How Anthropic just opened a new gate for engineers & Claude AI users — and why I tested and shipped more before 9 AM…

alirezarezvani.medium.com

[View original](https://alirezarezvani.medium.com/finally-arrived-claude-code-in-browser-on-your-mobile-phone-the-dev-workflow-r-evolution-502efff6d9b9?source=post_page-----2d2c9c1a99f1---------------------------------------)

## Closing — What’s Next

With these three steps — persistent memory, a living constitution, and specifications with clarifications — you’ve built the foundation of Spec-Driven Development.

[In **Part 2**](https://alirezarezvani.medium.com/7-steps-how-to-stop-claude-code-from-building-the-wrong-thing-part-2-execution-results-and-d990ef7d92db), we’ll move from specs to execution:

- Planning architectures with trade-offs documented
- Breaking down tasks, Claude Code can actually complete
- Maintaining context across sessions with CLAUDE.md
- Testing the critical path and shipping features with confidence
- Learning from teams who’ve already cut rework by 80%

👉 [**Continue with Part 2:**](https://alirezarezvani.medium.com/7-steps-how-to-stop-claude-code-from-building-the-wrong-thing-part-2-execution-results-and-d990ef7d92db) How to Stop Claude Code from Building the Wrong Thing (Part 2): Execution, Results, and Scaling the System

👉 Bookmark this post, share it with your team, and subscribe if you want to master *Spec-Driven Development with Claude Code*.

*Ready to 10x your development productivity?* [*Download the complete Claude Code Productivity Toolkit*](https://github.com/alirezarezvani/claude-code-tresor), which I am working on daily, *and start building your context system today.*

👉 Read my other useful article about *“* [*Mastering Context Engineering with Claude Code*](https://medium.com/@alirezarezvani/mastering-claude-code-a-7-step-guide-to-building-ai-powered-projects-with-context-engineering-68f593cab377) *”*

Happy Clauding;)

## About the Author

**Alireza Rezvani** is a Chief Technology Officer, Senior Fullstack architect & software engineer, and AI technology specialist with expertise in modern development frameworks, cloud native applications, and agentic AI systems. With a focus on [*ReactJS*](https://react.dev/)*,* [*NextJS*](https://nextjs.org/)*,* [*Node.js*](https://nodejs.org/en)*,* and cutting-edge AI technologies and concepts of AI engineering, Alireza helps engineering teams leverage tools like [*Gemini CLI*](https://blog.google/technology/developers/introducing-gemini-cli-open-source-ai-agent/)*,* and [*Claude Code*](https://www.anthropic.com/claude-code) or [*Codex from OpenAI*](https://openai.com/en-EN/codex/) to transform their development workflows.

Connect with Alireza at [*alirezarezvani.com*](https://alirezarezvani.com/) for more insights on AI-powered development, architectural patterns, and the future of software engineering.

Looking forward to connecting and seeing your contributions — check out my [*open source projects on GitHub*](https://github.com/alirezarezvani)!

✨ Thanks for reading! If you’d like more practical insights on AI and tech, hit **subscribe** to stay updated.

I’d also love to hear your thoughts — drop a comment with your ideas, questions, or even the kind of topics you’d enjoy seeing here next. Your input really helps shape the direction of this channel.

As CTO of a Berlin AI MedTech startup, I tackle daily challenges in healthcare tech. With 2 decades in tech, I drive innovations in human motion analysis.

## Responses (2)

Adil Kalam

What are your thoughts?  

```ts
I'm glad that more people are writing about this. But, it would be nice of you to give me credit for Spec Coding since I introduced it back in August:https://medium.com/@sevakavakians/dont-vibe-spec-1885e61dd844
```

```ts
Aren't you about to reinvent waterfall? Why not simply pairing with coding agents within an Agile process?
```

## More from Reza Rezvani

## Recommended from Medium

[

See more recommendations

](https://medium.com/?source=post_page---read_next_recirc--2d2c9c1a99f1---------------------------------------)