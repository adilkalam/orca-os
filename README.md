# Claude Code Setup for Vibe Coding

[![Agents](https://img.shields.io/badge/agents-19-blue)](#agents)
[![Plugins](https://img.shields.io/badge/plugins-11-green)](#plugins)
[![Skills](https://img.shields.io/badge/skills-21-orange)](#skills)
[![MCPs](https://img.shields.io/badge/MCPs-1-purple)](#mcps)


## What is Vibe Coding?

**Vibe coding** means you describe what you want in natural language. I handle the implementation details.

You say: *"Build a dark mode toggle with tests"*

I figure out: What components to create. What state management to use. What tests to write. How to verify it works.

This repository documents a complete Claude Code setup optimized for this workflow. **62 specialized tools** that extend my capabilities across development, design, SEO, data analysis, and workflow automation.









## How I Use These Tools

When you give me a task, I don't just execute commands in sequence. I analyze context and orchestrate multiple tool types simultaneously.


### The Four Tool Types

**Agents** are fresh Claude instances with specialized expertise. When I detect a task needs deep domain knowledge (frontend architecture, SEO optimization, financial modeling), I spawn a parallel conversation with that agent's custom prompt. The agent works independently, then reports results back to our main conversation.

**Skills** modify my behavior with process frameworks. Think test-driven development, systematic debugging, or code review protocols. Skills load additional instructions into my current context. They don't spawn new instances - they transform how I execute tasks.

**Plugins** bundle related skills together. Instead of enabling 20 individual skills, you enable one plugin and all its skills become available. Plugins are package management for behavioral modifications.

**MCPs** (Model Context Protocol servers) run as background services. They provide external capabilities I can't do natively: memory systems, documentation lookup, browser automation, sequential reasoning. MCPs are always running - their tools appear automatically in my toolset.





### How They Work Together

```
You: "Build a React dashboard with proper testing and deploy it"

                            ┌─────────────────────────┐
                            │   I analyze the task    │
                            └──────────┬──────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼

         ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
         │ Spawn agent      │  │ Use skills       │  │ Access MCPs      │
         ├──────────────────┤  ├──────────────────┤  ├──────────────────┤
         │ frontend-        │  │ test-driven-     │  │ magic            │
         │ developer        │  │ development      │  │ (component       │
         │                  │  │                  │  │  builder)        │
         │ Builds React     │  │ Write test       │  │                  │
         │ components with  │  │ first, watch it  │  │ context7         │
         │ TypeScript +     │  │ fail, implement  │  │ (React docs)     │
         │ Tailwind         │  │                  │  │                  │
         │                  │  │ code-reviewer    │  │ playwright       │
         │                  │  │ (before merge)   │  │ (verify UI)      │
         └──────────────────┘  └──────────────────┘  └──────────────────┘
                    │                  │                  │
                    └──────────────────┼──────────────────┘
                                       │
                                       ▼
                         Implementation complete
                    Tests pass, code reviewed, deployed
```

**This happens automatically.** You don't tell me which agent to use, which skill to invoke, or which MCP to call. I detect context and route to the appropriate tools based on the task requirements.









## What You Can Build

Real workflows combining multiple tool types.


### Example 1: Feature Implementation

**You:** *"Add user authentication with email/password and OAuth"*

**What I do:**

1. **Invoke skill:** `brainstorming` - Refine requirements through Socratic questions (OAuth providers? Password reset flow? Session management?)
2. **Invoke skill:** `test-driven-development` - Write failing tests first
3. **Spawn agent:** `frontend-developer` - Build login UI components with React + TypeScript
4. **Access MCP:** `context7` - Look up latest Auth0 or Supabase docs
5. **Spawn agent:** `database-admin` - Set up user table with proper indexes
6. **Invoke skill:** `requesting-code-review` - Dispatch code-reviewer before merging
7. **Invoke skill:** `verification-before-completion` - Run tests, confirm passing





### Example 2: Content Creation

**You:** *"Write a blog post about WebSockets that ranks well on Google"*

**What I do:**

1. **Spawn agent:** `seo-content-planner` (Haiku) - Create topic cluster, identify search intent
2. **Spawn agent:** `seo-keyword-strategist` (Haiku) - Generate 20-30 LSI keyword variations
3. **Spawn agent:** `seo-content-writer` (Sonnet) - Write E-E-A-T optimized article with 0.5-1.5% keyword density
4. **Spawn agent:** `seo-structure-architect` (Haiku) - Plan header hierarchy, schema markup
5. **Spawn agent:** `seo-meta-optimizer` (Haiku) - Create 3-5 A/B test variations for title/description
6. **Invoke skill:** `writing-clearly-and-concisely` - Apply Strunk & White principles
7. **Spawn agent:** `seo-content-auditor` (Sonnet) - Score 1-10, provide improvements





### Example 3: Data Analysis

**You:** *"Analyze our user retention data and find why people churn"*

**What I do:**

1. **Spawn agent:** `data-scientist` (Sonnet) - SQL queries, statistical analysis
2. **Access MCP:** `sequential-thinking` - Step-by-step reasoning through patterns
3. **Spawn agent:** `quant-analyst` (Sonnet) - Build cohort models, calculate churn metrics
4. **Invoke skill:** `systematic-debugging` - Investigate anomalies with four-phase framework
5. **Generate visualizations** - Charts showing retention curves, churn triggers
6. **Provide recommendations** - Actionable insights based on data patterns









---









## Agents

Specialized Claude instances with domain expertise. Each spawns a fresh conversation with custom instructions focused on specific tasks.


### Vibe Coding & Orchestration

Coordinate complex workflows and translate vision into implementation.


| Agent | Model | What It Does | Install |
|-------|-------|--------------|---------|
| **[agent-organizer](https://github.com/wshobson/claude-agents)** | Sonnet | Analyzes project requirements, defines specialized agent teams, manages collaborative workflows | wshobson |
| **[vibe-coding-coach](https://github.com/wshobson/claude-agents)** | Sonnet | Friendly mentor that translates ideas and visual references into working applications through conversation | wshobson |
| **[prompt-engineer](https://github.com/anthropics/claude-code-workflows)** | Opus | Crafts optimized prompts using Chain-of-Thought, Tree-of-Thought, and few-shot patterns | claude-code-sub-agents |
| **[context-manager](https://github.com/wshobson/claude-agents)** | Sonnet | Manages context across multiple agents and long-running tasks (required for 10k+ token projects) | wshobson |



```bash
# Install orchestration agents
~/leamas/leamas agent@wshobson                    # agent-organizer, vibe-coding-coach, context-manager
~/leamas/leamas agent@claude-code-sub-agents      # prompt-engineer
```





### Development & Design

Build interfaces, review code, and implement features with modern frameworks.


| Agent | Model | What It Does | MCPs Used | Install |
|-------|-------|--------------|-----------|---------|
| **[ui-designer](https://github.com/anthropics/claude-code-workflows)** | Sonnet | Create design systems, ensure WCAG compliance, build prototypes | magic, context7 | claude-code-sub-agents |
| **[ux-designer](https://github.com/anthropics/claude-code-workflows)** | Sonnet | User research, journey mapping, usability testing | context7, sequential-thinking, playwright | claude-code-sub-agents |
| **[frontend-developer](https://github.com/anthropics/claude-code-workflows)** | Sonnet | React + TypeScript + Tailwind implementation with best practices | magic, context7, playwright | claude-code-sub-agents |
| **[nextjs-pro](https://github.com/wshobson/claude-agents)** | Sonnet | Next.js architecture (SSR/SSG/App Router), performance optimization | — | wshobson |
| **[ios-developer](https://github.com/anthropics/claude-code-workflows)** | Sonnet | Swift, SwiftUI, UIKit native iOS development | — | claude-code-sub-agents |
| **[code-reviewer](https://github.com/anthropics/claude-code-workflows)** | Sonnet | Quality assurance, security analysis, performance review | context7, sequential-thinking | claude-code-sub-agents |



```bash
# Install development agents
~/leamas/leamas agent@claude-code-sub-agents      # ui-designer, ux-designer, frontend-developer, ios-developer, code-reviewer
~/leamas/leamas agent@wshobson                    # nextjs-pro
```





### SEO & Content Marketing

Create content that ranks on Google with E-E-A-T optimization and technical SEO.


| Agent | Model | What It Does | Install |
|-------|-------|--------------|---------|
| **[seo-content-writer](https://github.com/anthropics/claude-code-workflows)** | Sonnet | Write E-E-A-T optimized articles with 0.5-1.5% keyword density | Plugin |
| **[seo-content-planner](https://github.com/anthropics/claude-code-workflows)** | Haiku | Create content calendars, topic clusters, search intent analysis | Plugin |
| **[seo-content-auditor](https://github.com/anthropics/claude-code-workflows)** | Sonnet | Score content 1-10, provide actionable quality improvements | Plugin |
| **[seo-keyword-strategist](https://github.com/anthropics/claude-code-workflows)** | Haiku | Analyze keyword density, suggest 20-30 LSI variations | Plugin |
| **[seo-meta-optimizer](https://github.com/anthropics/claude-code-workflows)** | Haiku | Generate meta titles, descriptions with 3-5 A/B test variations | Plugin |
| **[seo-snippet-hunter](https://github.com/anthropics/claude-code-workflows)** | Haiku | Format content for featured snippets and SERP features | Plugin |
| **[seo-structure-architect](https://github.com/anthropics/claude-code-workflows)** | Haiku | Optimize header hierarchy, plan schema markup, suggest internal linking | Plugin |
| **[seo-authority-builder](https://github.com/anthropics/claude-code-workflows)** | Sonnet | Analyze E-E-A-T signals, enhance credibility for YMYL topics | Plugin |
| **[seo-content-refresher](https://github.com/anthropics/claude-code-workflows)** | Haiku | Detect outdated elements (statistics, dates, examples), suggest updates | Plugin |
| **[seo-cannibalization-detector](https://github.com/anthropics/claude-code-workflows)** | Haiku | Find keyword overlap between pages, recommend differentiation strategies | Plugin |



These agents are bundled in SEO plugins. Enable in `~/.claude/settings.json`:

```json
{
  "enabledPlugins": {
    "seo-content-creation@claude-code-workflows": true,
    "seo-technical-optimization@claude-code-workflows": true,
    "seo-analysis-monitoring@claude-code-workflows": true
  }
}
```





### Data & Financial Analysis

Query databases, backtest strategies, analyze quantitative models.


| Agent | Model | What It Does | Install |
|-------|-------|--------------|---------|
| **[data-scientist](https://github.com/wshobson/claude-agents)** | Sonnet | Data analysis, SQL queries, BigQuery operations, ML workflows | wshobson |
| **[quant-analyst](https://github.com/wshobson/claude-agents)** | Sonnet | Quantitative finance, backtesting, portfolio optimization, risk metrics | wshobson |
| **[python-pro](https://github.com/wshobson/claude-agents)** | Sonnet | Python development with async patterns, decorators, design patterns | wshobson |
| **[database-admin](https://github.com/wshobson/claude-agents)** | Sonnet | Database setup, backups, replication, monitoring, user permissions | wshobson |
| **[database-optimizer](https://github.com/wshobson/claude-agents)** | Sonnet | Query optimization, index design, solve N+1 problems, implement caching | wshobson |
| **[payment-integration](https://github.com/wshobson/claude-agents)** | Sonnet | Stripe, PayPal integration, webhooks, subscriptions, PCI compliance | wshobson |



```bash
# Install data/financial agents
~/leamas/leamas agent@wshobson                    # All data and tools agents
```









---









## Skills

Process frameworks that modify my behavior. Skills provide step-by-step workflows, checklists, and mandatory procedures.


### Core Development Workflows

Test-driven development, systematic debugging, planning, code review.


| Skill | What It Does | Trigger |
|-------|--------------|---------|
| **using-superpowers** | Mandatory starting point - establishes workflows for finding and using skills | Session start (automatic) |
| **brainstorming** | Interactive design refinement using Socratic method before implementation | Manual: `/superpowers:brainstorm` |
| **writing-plans** | Create detailed implementation plans with bite-sized tasks for engineers with zero context | Manual: `/superpowers:write-plan` |
| **executing-plans** | Execute plans in controlled batches with review checkpoints between batches | Manual: `/superpowers:execute-plan` |
| **test-driven-development** | RED-GREEN-REFACTOR workflow enforcement - write test first, watch fail, implement | Before feature implementation (automatic) |
| **systematic-debugging** | Four-phase investigation framework (root cause, pattern analysis, hypothesis, implementation) | Any bug or unexpected behavior (automatic) |
| **subagent-driven-development** | Dispatch fresh agent for each task with code review gates between tasks | Complex multi-task implementation (manual) |
| **dispatching-parallel-agents** | Parallel investigation of 3+ independent failures with no shared state | Multiple independent failures (manual) |
| **writing-skills** | TDD for process documentation - test skills with subagents before deployment | Creating/editing skills (automatic) |
| **testing-skills-with-subagents** | Validate skills resist rationalization under pressure using RED-GREEN-REFACTOR | Before skill deployment (manual) |



Install via superpowers plugin (see [Plugins](#plugins) section).





### Quality Assurance & Testing

Code review protocols, verification requirements, anti-patterns to avoid.


| Skill | What It Does | Trigger |
|-------|--------------|---------|
| **requesting-code-review** | Dispatch code-reviewer subagent to verify work meets requirements before merging | Task completion (automatic) |
| **receiving-code-review** | Require technical rigor and verification when receiving feedback, not performative agreement | Receiving review feedback (automatic) |
| **verification-before-completion** | Run verification commands and confirm output before making any "done" claims | Before completion claims (automatic) |
| **testing-anti-patterns** | Prevent testing mock behavior, production pollution with test-only methods, blind mocking | Writing/changing tests (automatic) |
| **condition-based-waiting** | Replace arbitrary timeouts with condition polling to wait for actual state changes | Fixing flaky tests (manual) |



Install via superpowers plugin (see [Plugins](#plugins) section).





### Git & Workflow Management

Worktrees, branch finishing, root cause tracing, multi-layer validation.


| Skill | What It Does | Source |
|-------|--------------|--------|
| **using-git-worktrees** | Create isolated git worktrees with smart directory selection and safety verification | superpowers plugin |
| **finishing-a-development-branch** | Present structured options for merge, PR, or cleanup when implementation is complete | superpowers plugin |
| **sharing-skills** | Guide PR contribution workflow to contribute skills back to upstream repository | superpowers plugin |
| **root-cause-tracing** | Trace bugs backward through call stack, add instrumentation to find invalid data source | superpowers plugin |
| **defense-in-depth** | Validate data at every layer it passes through to make bugs structurally impossible | superpowers plugin |



Install via superpowers plugin (see [Plugins](#plugins) section).





### Writing & Content

Apply Strunk & White principles to documentation, commit messages, error messages, UI text.


| Skill | What It Does | Source |
|-------|--------------|--------|
| **writing-clearly-and-concisely** | Make writing clearer, stronger, more professional for any prose humans will read | elements-of-style plugin |



Install via elements-of-style plugin (see [Plugins](#plugins) section).





### Learning Extraction (User Skills)

Extract content from URLs, YouTube videos, PDFs and transform into actionable plans.


| Skill | What It Does | Location |
|-------|--------------|----------|
| **tapestry** | Auto-detect content type (YouTube, article, PDF), extract clean content, create action plan | `~/.claude/skills/tapestry/` |
| **youtube-transcript** | Download YouTube video transcripts from URLs | `~/.claude/skills/youtube-transcript/` |
| **article-extractor** | Extract clean article content from URLs without ads, navigation, clutter | `~/.claude/skills/article-extractor/` |
| **ship-learn-next** | Transform learning content into actionable implementation plans using Ship-Learn-Next framework | `~/.claude/skills/ship-learn-next/` |



User skills are stored in project directory (`~/.claude/skills/` in this repository).









---









## Plugins

Containers that bundle related skills. Enable one plugin to make multiple skills available simultaneously.


| Plugin | Skills Included | Repository |
|--------|-----------------|------------|
| **[superpowers](https://github.com/Ejb503/multiverse-of-multiagents)** | 20 core development skills (TDD, debugging, planning, code review, git workflows) | superpowers-marketplace |
| **[elements-of-style](https://github.com/Ejb503/multiverse-of-multiagents)** | 1 writing skill (clear writing for docs, commits, UI text) | superpowers-marketplace |
| **[javascript-typescript](https://github.com/anthropics/claude-code-workflows)** | 4 skills (modern JS patterns, testing, Node.js backend, TypeScript types) | claude-code-workflows |
| **[frontend-mobile-development](https://github.com/anthropics/claude-code-workflows)** | 2 skills (React components, mobile apps with React Native/Flutter) | claude-code-workflows |
| **[code-documentation](https://github.com/anthropics/claude-code-workflows)** | 3 skills (code review, architecture documentation, step-by-step tutorials) | claude-code-workflows |
| **[seo-content-creation](https://github.com/anthropics/claude-code-workflows)** | 3 SEO agents (writer, planner, auditor) | claude-code-workflows |
| **[seo-technical-optimization](https://github.com/anthropics/claude-code-workflows)** | 4 SEO agents (keywords, meta tags, featured snippets, structure planning) | claude-code-workflows |
| **[seo-analysis-monitoring](https://github.com/anthropics/claude-code-workflows)** | 3 SEO agents (authority building, content refreshing, cannibalization detection) | claude-code-workflows |
| **[claude-mem](https://github.com/thedotmack/claude-mem)** | Memory system with 6 MCP search tools for persistent knowledge across sessions | thedotmack |
| **[git](https://github.com/anthropics/claude-code-plugins)** | 4 slash commands (commit-push, compact-commits, create-worktree, rebase-pr) | claude-code-plugins |
| **[commit-commands](https://github.com/anthropics/claude-code-plugins)** | Enhanced git commit workflows with automated conventions | claude-code-plugins |



Enable plugins in `~/.claude/settings.json`:

```json
{
  "enabledPlugins": {
    "superpowers@superpowers-marketplace": true,
    "elements-of-style@superpowers-marketplace": true,
    "javascript-typescript@claude-code-workflows": true,
    "frontend-mobile-development@claude-code-workflows": true,
    "code-documentation@claude-code-workflows": true,
    "seo-content-creation@claude-code-workflows": true,
    "seo-technical-optimization@claude-code-workflows": true,
    "seo-analysis-monitoring@claude-code-workflows": true,
    "claude-mem@thedotmack": true,
    "git@claude-code-plugins": true,
    "commit-commands@claude-code-plugins": true
  }
}
```









---









## MCPs

Background services that provide external capabilities. MCPs run continuously, exposing tools to Claude Code and all agents.


| MCP | What It Provides | Repository |
|-----|------------------|------------|
| **[sequential-thinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequential-thinking)** | `sequentialthinking` tool for structured step-by-step reasoning | modelcontextprotocol |


**Note:** Additional MCPs are available through plugins. The `magic` MCP (component builder), `context7` MCP (documentation lookup), and `playwright` MCP (browser automation) are included when certain agents are installed.


Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```









---









## Quick Start

```bash
# Prerequisites
node --version  # Requires Node.js 18+
git --version   # Requires git

# 1. Install Leamas (agent installer)
# Download from https://leamas.sh/
# Place binary in ~/leamas/

# 2. Install agent collections
~/leamas/leamas agent@wshobson
~/leamas/leamas agent@claude-code-sub-agents

# 3. Enable plugins
# Edit ~/.claude/settings.json
{
  "enabledPlugins": {
    "superpowers@superpowers-marketplace": true,
    "git@claude-code-plugins": true,
    "seo-content-creation@claude-code-workflows": true,
    "seo-technical-optimization@claude-code-workflows": true,
    "seo-analysis-monitoring@claude-code-workflows": true
  }
}

# 4. Install MCPs
# Edit ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}

# 5. Restart Claude Code to load all changes
```









---









## File Locations

```
Agents:      ~/.claude/agents/leamas/
Skills:      ~/.claude/skills/
Settings:    ~/.claude/settings.json
MCP Config:  ~/Library/Application Support/Claude/claude_desktop_config.json
Plugins:     ~/.claude/plugins/marketplaces/
Claude-Mem:  ${CLAUDE_PLUGIN_ROOT}/data/
```









---









## Resources

**Agent Collections:**
- [Leamas Marketplace](https://leamas.sh/) - Agent installer and collection browser
- [wshobson agents](https://github.com/wshobson/claude-agents) - Orchestration, development, data analysis
- [claude-code-sub-agents](https://github.com/anthropics/claude-code-workflows) - UI/UX design, code review

**Skill Repositories:**
- [Superpowers](https://github.com/Ejb503/multiverse-of-multiagents) - Core development workflows (TDD, debugging)
- [Claude Code Workflows](https://github.com/anthropics/claude-code-workflows) - Official Anthropic workflows
- [Claude Code Plugins](https://github.com/anthropics/claude-code-plugins) - Git utilities and conventions

**Marketplaces:**
- [Plugin Marketplace](https://claudecodeplugins.io/) - Browse available plugins
- [Plugin Toolkits](https://claudemarketplaces.com/) - Curated plugin collections

**MCP Resources:**
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers) - Official MCP implementations
- [NPM MCP Search](https://www.npmjs.com/search?q=mcp%20server) - Community MCP packages









---









## Summary

**62 specialized tools** extend Claude Code's capabilities:

- **19 agents** with domain expertise (Sonnet: 16, Opus: 1, Haiku: 7)
- **21 skills** providing process frameworks
- **11 plugins** bundling related skills
- **1 MCP** for sequential reasoning (+ additional MCPs via plugins)

**Total installed via:**
- 2 agent collections (wshobson, claude-code-sub-agents)
- 11 plugins (superpowers, git, SEO suite, etc.)
- 1 standalone MCP (sequential-thinking)
