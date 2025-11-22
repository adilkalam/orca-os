---
title: "“7 Steps” How to Stop Claude Code from Building the Wrong Thing (Part 2): Execution, Results, and…"
source: "https://alirezarezvani.medium.com/7-steps-how-to-stop-claude-code-from-building-the-wrong-thing-part-2-execution-results-and-d990ef7d92db"
author:
  - "[[Reza Rezvani]]"
published: 2025-09-17
created: 2025-11-06
description: "“7 Steps” How to Stop Claude Code from Building the Wrong Thing (Part 2): Execution, Results, and Scaling the System Quick Recap of Part 1 In Part 1 of this guide, we laid the foundation for …"
tags:
  - "clippings"
---
[Sitemap](https://alirezarezvani.medium.com/sitemap/sitemap.xml)

[Mastodon](https://me.dm/@alirezarezvani)

## Quick Recap of Part 1

In [**Part 1 of this guide**](https://medium.com/@alirezarezvani/7-steps-how-to-stop-claude-code-from-building-the-wrong-thing-part-1-the-foundation-of-2d2c9c1a99f1), we laid the foundation for **Spec-Driven Development (SDD)**: setting up persistent context, writing an Engineering Constitution, and learning how to specify features so [Claude Code](https://claude.com/product/claude-code) doesn’t reinvent your architecture every session.

**You learned how to:**

- Install a **persistent memory system** ([GitHub Spec Kit](https://github.com/github/spec-kit), [Agent OS](https://buildermethods.com/agent-os), or [Claude Code Tresor](https://github.com/alirezarezvani/claude-code-tresor))
- Write an **Engineering Constitution** to codify non-negotiable rules
- Use `/specify` to capture clarifications before a single line of code is written

These steps *stopped Claude from “guessing” your architecture*. Now it’s time to turn specifications into **execution** — planning architectures, breaking down tasks, and keeping context alive across sessions.

![Mastering Context and Spec Composition with Claude Code](https://miro.medium.com/v2/resize:fit:640/format:webp/1*PGglTD0VoxulR-g8BydCWA.png)

Context and Spec Composition with Claude Code

Now it’s time for the **payoff**: turning those specs into real, working software.

**In this second part, we’ll cover how to:**

- **Plan architectures** with trade-offs documented in research files
- **Break down executable tasks** that Claude Code can complete without losing context
- **Maintain project memory** across sessions with *CLAUDE.md* and session logs
- **Test the critical path** so you ship with confidence
- Learn from **real teams** that scaled SDD to 5, 15, even 30 developers — cutting rework, boosting consistency, and preserving knowledge

This is where SDD goes from theory to practice. By the end, you’ll have a repeatable playbook for running entire sprints with AI assistance — without the chaos.

👉 For a quick overview of the full methodology, refer to the [Master Guide for Spec Driven Development with Claude Code](https://medium.com/@alirezarezvani/7-steps-master-guide-spec-driven-development-with-claude-code-how-to-stop-ai-from-building-0482ee97d69b), which *links both parts together with templates, diagrams, and adoption roadmaps.*

## From Specifications to Execution

Specifications define *what* you’re building. Execution ensures it’s built the *right way* — without chaos, rework, or lost decisions.

**This phase has three goals:**

1. Plan architectures with clear trade-offs
2. Break work into executable tasks
3. Maintain context across sessions

Done right, this is where teams move from “Claude as a tool” to **Claude as a team mate**.

## Action 4: Plan the Architecture

Once you’ve specified a feature, the `/plan` command converts it into architectural decisions with rationale.

**Example:**

```c
/plan Implement using our PostgreSQL database.
Add workspaces and workspace_members tables.
Use Pusher for real-time presence.
Implement comments as a separate table with soft deletes.
```

**Instead of raw code, you get structured research:**

```c
## Decision: Real-Time Infrastructure

Chosen: Pusher channels (per workspace)  
Cost: $49/month for 100 concurrent workspaces  
Time: 2 days  
Alternative: Custom WebSocket server  
Cost: $200/month  
Time: 2 weeks  
Rejected because: Too complex for MVP  
Alternative: Polling every 5 seconds  
Cost: negligible  
Time: 2 hours  
Rejected because: Poor user experience
```

This creates **research.md** files:

- Prevents arbitrary decisions
- Documents trade-offs
- Preserves knowledge for future hires

## Action 5: Break Down Into Executable Tasks

Most rework comes from tasks that are too vague. `/tasks` fixes this by generating **atomic, self-contained tasks** with file paths and success criteria.

**Example**:

```c
## Backend Tasks (Parallel)
- [ ] T001 [P]: Create workspace migration in prisma/migrations/
- [ ] T002 [P]: Create workspace_members migration with roles enum
- [ ] T003 [P]: Create comments table with workspace_id foreign key

## API Routes (Sequential)
- [ ] T005: POST /api/workspaces - create workspace
- [ ] T006: POST /api/workspaces/[id]/invite - generate invite token
- [ ] T007: POST /api/workspaces/[id]/members - accept invite
```
- **\[P\] = Parallelizable** → can be done in any order
- Sequential tasks prevent dependency conflicts

This ensures Claude Code can pick up a task without *“guessing”* context.

## Action 6: Maintain Context Across Sessions

This is where most teams fail. Specs and tasks are strong — but only if context survives between coding sessions.

**The fix:** maintain a **CLAUDE.md** index.

```c
# Project Context

## Current Sprint  
Feature: Team Workspaces  
Status: Backend complete (T001–T009), Frontend in progress  
## Stack Decisions (Immutable)  
- Database: PostgreSQL + Prisma  
- Real-time: Pusher  
- Auth: NextAuth v5  
- Styling: Tailwind  
## Active Decisions Log  
2025-09-15: Chose Pusher over WebSockets  
2025-09-14: Role-based permissions for MVP
```

Then log details per session in `sessions/2024-01/day-1.md`:

```c
## Morning Session  
Completed: T001–T004 (DB setup)  

### Decisions  
- Workspace deletion cascades to members, not projects  
- Invite tokens expire after 7 days  
### Next Session  
Start with T005 - API routes

### Decisions  
- Workspace deletion cascades to members, not projects  
- Invite tokens expire after 7 days  
### Next Session  
Start with T005 - API routes
```

Together, CLAUDE.md + logs = **project memory** that persists beyond chat sessions.

## Action 7: Test the Critical Path

AI-generated code doesn’t fail because of edge cases — it fails because **core flows break**.

Instead of 100 unit tests, start with one integration test that covers the user’s critical journey.

**Example:**

```c
test('Workspace flow', async () => {
  const workspace = await createWorkspace('Team Alpha', ownerId);
  const invite = await generateInvite(workspace.id, ownerId);
  const membership = await acceptInvite(invite.token, memberId);
  const presence = await getPresence(workspace.id);
  expect(presence.active_users).toContain(memberId);
});
```

If this passes, you can ship. Add edge cases incrementally.

## Real Results from Real Teams

Here’s how real teams applied SDD with Claude Code:

***Team Before After Key Change Quote 15-person SaaS Features:*** 2 weeks + 3–4 revisions Features: 4 days, 0–1 revisions Constitution avoided architecture debates *“We stopped debating patterns and started shipping.”* 8-person agency, Inconsistent code per dev, Unified code across project, Shared constitution *“Junior devs now output senior-quality structures.”* 30-person FinTech 40% velocity wasted on rework 8% rework Specs caught edge cases *“Compliance team loves the auto-documentation.”*

## Common Failure Modes (And Fixes)

Every system has weak spots. Here’s where teams stumble with SDD — and how to recover:

- **Constitution bloat:** Too many rules → nobody reads them.
- *Fix:* Quarterly reviews, keep active rules <20.
- **Specification paralysis:** Hours spent perfecting specs.
- *Fix:* Time-box to 30 mins, mark unclear items “discover during implementation.”
- **Context chaos:** CLAUDE.md becomes bloated.
- *Fix:* Automate with a script that regenerates context before sessions.

## Adoption Path for Teams

**Rolling out SDD is easier when staged:**

**Week 1: Minimal Adoption**

- Install Spec Kit / Agent OS / Tresor
- Write 3 constitutional rules
- Use `/specify` for next feature

**Week 2: Add Planning**

- Use `/plan`
- Start research.md
- Maintain CLAUDE.md

**Week 3: Full System**

- Add `/tasks`
- Start logging sessions
- Write the first integration test

**Month 2: Team Alignment**

- Shared constitution + specs folder
- Review process for rules

**Month 3: Optimization**

- Automate context generation
- Build templates
- Track rework reduction

## Closing — The Payoff of Spec-Driven Development

Spec-Driven Development isn’t about writing longer prompts. It’s about **making Claude Code predictable**.

**When you know exactly:**

- *What you’re building* (specifications)
- *How you’re building it* (plans)
- *What steps to follow* (tasks)

… Claude stops “guessing” and starts partnering.

The teams succeeding with AI coding assistants aren’t the ones with clever tricks — they’re the ones with better processes.

👉 For a complete overview of the entire framework, check out the [Master Guide](https://medium.com/@alirezarezvani/7-steps-master-guide-spec-driven-development-with-claude-code-how-to-stop-ai-from-building-0482ee97d69b). Bookmark it, share it with your team, and use it as your reference hub for Spec-Driven Development.

👉 [**Continue with Part 1:**](https://alirezarezvani.medium.com/7-steps-how-to-stop-claude-code-from-building-the-wrong-thing-part-1-the-foundation-of-2d2c9c1a99f1)*How to Stop Claude Code from Building the Wrong Thing (Part 1): The Foundation of Spec-Driven Development*

👉 Bookmark this post, share it with your team, and subscribe if you want to master *Spec-Driven Development with Claude Code*.

*Ready to 10x your development productivity?* [*Download the complete Claude Code Productivity Toolkit*](https://github.com/alirezarezvani/claude-code-tresor), which I am working on daily, *and start building your context system today.*

👉 Read my other useful article about *“* [*Mastering Context Engineering with Claude Code*](https://medium.com/@alirezarezvani/mastering-claude-code-a-7-step-guide-to-building-ai-powered-projects-with-context-engineering-68f593cab377) *”*

Happy Clauding;)

## About the Author

**Alireza Rezvani** is a Chief Technology Officer, Senior Full-stack architect & software engineer, and AI technology specialist with expertise in modern development frameworks, cloud native applications, and agentic AI systems. With a focus on [*ReactJS*](https://react.dev/)*,* [*NextJS*](https://nextjs.org/)*,* [*Node.js*](https://nodejs.org/en)*,* and cutting-edge AI technologies and concepts of AI engineering, Alireza helps engineering teams leverage tools like [*Gemini CLI*](https://blog.google/technology/developers/introducing-gemini-cli-open-source-ai-agent/)*,* and [*Claude Code*](https://www.anthropic.com/claude-code) or [*Codex from OpenAI*](https://openai.com/en-EN/codex/) to transform their development workflows.

Connect with Alireza at [*alirezarezvani.com*](https://alirezarezvani.com/) for more insights on AI-powered development, architectural patterns, and the future of software engineering.

Looking forward to connecting and seeing your contributions — check out my [*open source projects on GitHub*](https://github.com/alirezarezvani)!

✨ Thanks for reading! If you’d like more practical insights on AI and tech, hit **subscribe** to stay updated.

I’d also love to hear your thoughts — drop a comment with your ideas, questions, or even the kind of topics you’d enjoy seeing here next. Your input really helps shape the direction of this channel.

As CTO of a Berlin AI MedTech startup, I tackle daily challenges in healthcare tech. With 2 decades in tech, I drive innovations in human motion analysis.

## Responses (1)

Adil Kalam

What are your thoughts?  

```c
Great article, I plan to use it!Can you check Master Guide link, when I tried to open it, got an error in chatgpt.com
```

1

## More from Reza Rezvani

## Recommended from Medium

[

See more recommendations

](https://medium.com/?source=post_page---read_next_recirc--d990ef7d92db---------------------------------------)