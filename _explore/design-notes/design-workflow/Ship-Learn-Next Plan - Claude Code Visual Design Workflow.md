# Ship-Learn-Next Plan: Master Claude Code Visual Design with Playwright MCP (Historical)

> Status: **Historical / planning doc.**  
> This captures an earlier plan for Playwright-driven visual design workflows.
> The current OS 2.0 design behavior is defined in:
> - `docs/pipelines/design-pipeline.md`
> - `docs/design/design-dna-schema.md`
> - `docs/design/design-system-guide.md`

**Quest Overview**: Transform Claude Code into a powerful UI designer by implementing the Playwright MCP workflow with iterative agentic loops, visual context, and automated design review.

**Source Material**: "Turn Claude Code into Your Own INCREDIBLE UI Designer (using Playwright MCP Subagents)" by Patrick Ellis

**Timeline**: 4 weeks (5 reps)

**Core Philosophy**: Claude Code can't see its own designs by default. Playwright MCP gives it "eyes" through screenshots, unlocking the visual modality and enabling pixel-perfect iterative design.

---

## Rep 1: Ship Playwright MCP Setup + First Visual Iteration (By Friday)

**Goal**: Install Playwright MCP, configure basic visual workflow, and see Claude iterate on a design using screenshots.

**What You'll Build**:
1. Install Playwright MCP for Claude Code
2. Create a simple test page (e.g., landing page component)
3. Add basic Playwright workflow to your `CLAUDE.md`
4. Have Claude make a change → take screenshot → iterate

**Step-by-Step**:

```bash
# 1. Install Playwright MCP
# Add to claude_desktop_config.json:
{
  "mcps": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    }
  }
}

# 2. Create test page
# Build a simple component (button, card, hero section)

# 3. Add to CLAUDE.md
## Visual Development Workflow

When making front-end changes:
1. Navigate to the page
2. Take screenshot
3. Compare to design requirements
4. Check console errors
5. Iterate if needed

# 4. Test the loop
# Prompt: "Please review the homepage UI, take a screenshot,
# and fix any spacing/alignment issues you see"
```

**Deliverables**:
- ✅ Playwright MCP installed and working
- ✅ One component designed with at least one visual iteration
- ✅ Screenshot showing before/after
- ✅ Basic CLAUDE.md workflow documented

**Success Criteria**:
- Claude can automatically take screenshots when you ask
- You see Claude compare screenshot to requirements and iterate
- Console errors are detected and reported

**Estimated Time**: 2-3 hours

---

## Rep 2: Add Design Principles + Style Guide Context (Week 2)

**Goal**: Create design principles and style guide documents that Claude references automatically.

**What You'll Build**:
1. Create `design-principles.md` with your aesthetic preferences
2. Create `style-guide.md` with colors, typography, spacing rules
3. Store in `.claude/context/` folder
4. Reference in CLAUDE.md
5. Test Claude following your design system

**Step-by-Step**:

```bash
# 1. Use Gemini Deep Research (or manual research)
# Prompt: "Research best design principles for [your aesthetic]
# Examples: brutalism, minimal, Swiss design, Y2K, etc."

# 2. Create design-principles.md
# - Visual hierarchy rules
# - Spacing/layout principles
# - Color usage philosophy
# - Typography guidelines
# - Component patterns

# 3. Create style-guide.md
colors:
  - primary: #HEX
  - secondary: #HEX
typography:
  - heading: Font Family, sizes
  - body: Font Family, sizes
spacing:
  - scale: 4px, 8px, 16px, 24px, 32px, 48px

# 4. Reference in CLAUDE.md
Before any design work, consult:
- .claude/context/design-principles.md
- .claude/context/style-guide.md

# 5. Test
# Prompt: "Build a pricing table following our design system"
```

**Deliverables**:
- ✅ design-principles.md file
- ✅ style-guide.md file
- ✅ Updated CLAUDE.md referencing both
- ✅ One component built following the system

**Success Criteria**:
- Claude references your design principles without being reminded
- Components use exact colors/fonts from style guide
- Spacing follows your mathematical scale

**Estimated Time**: 3-4 hours

---

## Rep 3: Build Design Review Sub-Agent (Week 3)

**Goal**: Create a specialized agent that does comprehensive design reviews automatically.

**What You'll Build**:
1. Create `.claude/agents/design-reviewer.md`
2. Define step-by-step review process
3. Configure to use Playwright + design principles
4. Test on a complete page

**Step-by-Step**:

```bash
# 1. Create agent file
# .claude/agents/design-reviewer.md

# 2. Define agent structure (from video example):
---
name: design-reviewer
description: Comprehensive UI/UX design review agent
tools: [Playwright, Context7, Read, Grep]
model: sonnet-4
---

## Role
You are a principal-level product designer reviewing UI/UX quality.
Reference companies: Stripe, Airbnb, Linear.

## Process
1. Identify changed files (git diff)
2. Launch dev server
3. Take screenshots (desktop, tablet, mobile)
4. Check against:
   - design-principles.md
   - style-guide.md
   - Accessibility standards
   - Console errors
5. Generate detailed report

## Output Format
- Overall grade (A+ to F)
- Strengths (3-5 items)
- High priority issues
- Medium priority issues
- Code health notes

# 3. Test agent
# Prompt: "@agent design-reviewer please review the homepage"
```

**Deliverables**:
- ✅ design-reviewer.md agent file
- ✅ Agent successfully runs and generates report
- ✅ Report identifies real issues you can fix
- ✅ Documentation on how to invoke

**Success Criteria**:
- Agent runs autonomously (you don't guide each step)
- Generates actionable feedback
- Checks multiple viewport sizes
- References your design principles

**Estimated Time**: 4-5 hours

---

## Rep 4: Implement Advanced Workflows (Week 4)

**Goal**: Add advanced capabilities - reference URL scraping, mobile testing, and git worktrees for parallel iteration.

**What You'll Build**:
1. Workflow: Scrape reference designs with Playwright
2. Workflow: Automated mobile responsive testing
3. Setup: Git worktrees for parallel design exploration
4. Create slash command for quick design checks

**Step-by-Step**:

```bash
# 1. Reference URL workflow
# Add to CLAUDE.md:
When given reference URLs:
1. Use Playwright to navigate and screenshot
2. Extract design patterns (spacing, colors, hierarchy)
3. Apply learnings to current work

# Test:
# "Here's a site I love: [URL]. Please extract the design
# patterns and apply them to our homepage"

# 2. Mobile responsive testing workflow
# Add automated viewport checks:
viewports:
  - mobile: 375x667 (iPhone SE)
  - tablet: 768x1024 (iPad)
  - desktop: 1920x1080

# 3. Git worktrees setup
git worktree add ../project-v2 feature/design-v2
git worktree add ../project-v3 feature/design-v3

# Open Claude Code in each worktree
# Run same prompt, compare outputs

# 4. Create slash command
# .claude/commands/quick-design-check.md
---
description: Quick visual QA check
---
1. Take screenshot of current page
2. Check console errors
3. Verify responsive behavior
4. Report issues
```

**Deliverables**:
- ✅ Reference URL scraping working
- ✅ Mobile testing workflow documented
- ✅ At least one git worktree example
- ✅ /quick-design-check command created

**Success Criteria**:
- Can extract design patterns from any reference URL
- Automated testing catches responsive issues
- Can run 2-3 parallel design explorations
- Slash command saves 5+ minutes per check

**Estimated Time**: 5-6 hours

---

## Rep 5: Ship Production Design System + Documentation (Week 4-5)

**Goal**: Package everything into a reusable system for your team with documentation.

**What You'll Build**:
1. Complete design system documentation
2. Team playbook for using the workflow
3. Templates for common design tasks
4. Case study: Before/after comparison

**Step-by-Step**:

```bash
# 1. Design system documentation
# Create: .claude/context/design-system-complete.md
- All design tokens
- Component library
- Usage examples
- Claude Code integration notes

# 2. Team playbook
# Create: docs/claude-code-design-workflow.md
- Installation guide
- How to use agents
- When to use each workflow
- Troubleshooting

# 3. Templates
# Create: .claude/templates/
- new-component.md (prompt template)
- design-review-request.md
- mobile-testing.md

# 4. Case study
# Document one real project:
- Before: Generic purple shadcn UI
- Process: How you used the workflow
- After: Pixel-perfect branded design
- Screenshots and metrics
```

**Deliverables**:
- ✅ Complete design system docs
- ✅ Team playbook (shareable)
- ✅ 3+ prompt templates
- ✅ One before/after case study

**Success Criteria**:
- Another team member can follow your docs and set up the workflow
- Case study shows measurable improvement
- Templates save 10+ minutes per task
- System is version controlled and documented

**Estimated Time**: 6-8 hours

---

## Reflection Framework

**After Each Rep, Ask**:

1. **What worked?** (Keep doing this)
   - Which parts of the workflow felt smooth?
   - What surprised you in a good way?

2. **What didn't work?** (Adjust next rep)
   - Where did you get stuck?
   - What took longer than expected?

3. **What did you learn?**
   - New capabilities you discovered?
   - Limitations you found?

4. **What's next?**
   - How will you apply this in Rep N+1?
   - What new experiments do you want to try?

**Track Your Progress**:
- Screenshot collection (before/after)
- Time saved per design task
- Number of visual iterations reduced
- Quality improvements (subjective but noticeable)

---

## Key Resources

**From the Video**:
- [Playwright MCP GitHub](https://github.com/microsoft/playwright)
- [Anthropic Claude Code Docs](https://docs.anthropic.com/claude-code)
- [Claude Code Best Practices Guide](https://docs.anthropic.com/en/docs/build-with-claude/best-practices)
- [Anthropic GitHub Examples](https://github.com/anthropics)

**Tools Mentioned**:
- Playwright MCP (visual automation)
- Context7 MCP (documentation)
- Gemini Deep Research (design principles)
- Git worktrees (parallel exploration)

**Key Concepts**:
- **Orchestration Layer**: Context + Tools + Validation
- **Iterative Agentic Loop**: Make → Screenshot → Compare → Iterate
- **Visual Modality**: Activate Claude's image understanding
- **Sub-Agents**: Specialized autonomous workflows

---

## The Meta-Lesson

**The video's core insight**:

> "You're taking an incredible PhD level intelligence and forcing it to design with essentially blindfolds on. The models can't see their own designs. They can only see the code."

**Solution**: Give Claude eyes through Playwright screenshots.

**Result**: Unlock the "missing 90%" of Claude Code's design capabilities by activating its visual intelligence.

---

## Success Metrics

**You'll know this is working when**:

1. ✅ Claude iterates on designs without you prompting each step
2. ✅ Visual quality dramatically improves (no more generic purple shadcn)
3. ✅ Design reviews happen automatically before PRs
4. ✅ You can explore 3 design directions in parallel
5. ✅ Team members adopt your workflow
6. ✅ Time from mockup → pixel-perfect implementation drops by 50%+

---

## Next Steps

**When will you ship Rep 1?**

Target: This Friday (or specify your date)

**Suggested Schedule**:
- **Day 1-2**: Install Playwright MCP, configure CLAUDE.md
- **Day 3**: Build test component with visual iteration
- **Day 4**: Document and create screenshots
- **Day 5**: Review and reflect

**Questions to Consider**:
1. What project will you test this on?
2. What's your aesthetic/design direction?
3. Do you have existing design mockups to reference?
4. Will you work solo or involve your team?

---

**Remember**: The goal isn't to study this workflow—it's to **ship with it**. Start with Rep 1 this week. Learn by building, not by consuming.

Let's weave learning into action. 🎯
