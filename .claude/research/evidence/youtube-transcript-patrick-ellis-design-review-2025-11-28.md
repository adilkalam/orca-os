# YouTube Transcript: Claude Code Design Review Workflow (Patrick Ellis)

**Source:** https://www.youtube.com/watch?v=xOO8Wt_i72s
**Creator:** Patrick Ellis (OneRedOak)
**GitHub:** https://github.com/OneRedOak/claude-code-workflows
**Extracted:** 2025-11-28

---

## Key Insights

### 1. The Core Problem: Models Can't See
> "If you're anything like I used to be, you prompt for a great looking modern design just to end up with the same generic ShadCN purple UI that you see all over Twitter."

> "Those cookie cutter designs aren't the model's fault. It's the environment that you're placing those agents in. You're taking an incredible PhD level intelligence and you're forcing it to design with essentially blindfolds on. The models can't see their own designs. They can only see the code that they're writing."

### 2. The Solution: Playwright MCP
> "What I'm about to show you is a massive unlock... It's a single tool that gives the AI eyes to see. The missing link in a workflow. All built around the Playwright MCP, allowing these agents to control the browser, take screenshots, iteratively self-correct on their designs."

### 3. The Orchestration Framework
Three pillars for success:
1. **Validation** - UI mocks, style guides, definitive examples
2. **Tools** - Playwright for screenshots and browser control
3. **Context** - Well-written prompts and documentation

> "If you have the validation such as a UI mock or a style guide, you have the tools such as Playwright, and you have the context well-written prompts and documentation, you will get so much more success out of Claude Code than it comes just out of the box."

### 4. The Iterative Agentic Loop
> "Imagine as we get more and more capable models, what we want to do is give them access to more of our workflow so that they can not just run for five minutes, but they could run for half an hour or an hour or even longer."

The loop:
1. Look at spec (style guide, UI mock)
2. Make changes
3. Take screenshot (Playwright)
4. Compare to spec
5. Identify gaps ("oh shoot, this SVG is nowhere close")
6. Iterate again

> "That iterative loop is what really gets us to these full agentic workflows and saves us a ton of time because we can kick off a process, go work on something else."

### 5. Implementation Details Mentioned
- Custom subagents for design workflows
- Playwright MCP configuration
- Customized CLAUDE.md for design context
- Screenshot-based validation loops

---

## Relevance to OS 2.4

**Key patterns to adopt:**
1. **Visual validation** - Playwright MCP for design verification
2. **Iterative loops** - Self-correction against fixed spec
3. **Orchestration framework** - Tools + Context + Validation
4. **Extended runtime** - Design for 30-60 minute autonomous runs

**Gap in OS 2.4:** We don't have explicit design review with visual validation. The `design-dna-guardian` and `design-reviewer` agents could benefit from Playwright screenshot loops.
