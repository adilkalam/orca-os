# Claude Code Setup for Vibe Coding

[![Agents](https://img.shields.io/badge/agents-19-blue)](#agents)
[![Plugins](https://img.shields.io/badge/plugins-11-green)](#plugins)
[![Skills](https://img.shields.io/badge/skills-21-orange)](#skills)
[![MCPs](https://img.shields.io/badge/MCPs-1-purple)](#mcps)

**Vibe coding** means describing what you want in natural language while AI handles the implementation details. This repository documents a complete Claude Code setup optimized for this workflow.

Claude Code provides four types of tools that work together to handle different aspects of development:

**Agents** spawn fresh AI instances with specialized expertise (frontend development, SEO optimization, data analysis). **Skills** modify Claude's behavior with process frameworks (test-driven development, systematic debugging, code review workflows). **Plugins** bundle related skills into installable packages. **MCPs** run as background services providing tools and data sources (memory, documentation, browser control).

These tools are **not mutually exclusive** — an agent can use multiple skills while accessing MCP services simultaneously.


## How Claude Code Tools Work Together

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Request                             │
│              "Build a feature with proper testing"               │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Claude Code                                │
│                 Analyzes context & routes                        │
└─┬──────────────┬──────────────┬──────────────┬──────────────────┘
  │              │              │              │
  ▼              ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Agents   │  │ Skills   │  │ Plugins  │  │  MCPs    │
├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤
│ Spawn    │  │ Modify   │  │ Bundle   │  │ Provide  │
│ fresh AI │  │ behavior │  │ skills   │  │ tools/   │
│ instance │  │ with     │  │          │  │ data     │
│          │  │ process  │  │          │  │          │
│ Can use  │  │ guides   │  │          │  │ Always   │
│ Skills + │  │          │  │          │  │ running  │
│ MCPs     │  │ Can be   │  │          │  │          │
│          │  │ in       │◄─┤ Contains │  │          │
│          │  │ Plugins  │  │ Skills   │  │          │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
     │             │                            │
     │             │                            │
     └─────────────┴────────────────────────────┘
                   │
                   ▼
          Implementation complete
```




---

## 🤖 Agents

Specialized AI instances with domain expertise. Each agent spawns a fresh Claude conversation with a custom prompt focused on a specific task.



### 1. What they are

Dedicated AI instances with specialized knowledge in specific domains (frontend development, SEO writing, database optimization, financial analysis). When invoked, Claude Code spawns a parallel conversation with the agent's custom instructions.



### 2. How to explore

Browse agent collections at [Leamas marketplace](https://leamas.sh/)



### 3. How to install

1. Download Leamas binary from [leamas.sh](https://leamas.sh/)
2. Place binary in `~/leamas/` directory
3. Run: `~/leamas/leamas agent@collection-name`
4. Agents install to `~/.claude/agents/leamas/collection-name/`



### 4. How to invoke

**Automatic:** Claude Code detects context and routes to appropriate agent

**Manual:** `Task({ subagent_type: "agent-name" })`



### 5. What they do

Spawn parallel Claude instance with specialized knowledge. Can access MCPs and use skills. Returns results to main conversation when complete.




### Vibe Coding & Orchestration

| Model | Agent | What It Does |
|-------|-------|--------------|
| Sonnet | **agent-organizer** | Coordinates multiple AI agents on complex workflows |
| Sonnet | **vibe-coding-coach** | Friendly mentor translating vision into implementation |
| Opus | **prompt-engineer** | Crafts optimized prompts with CoT, ToT patterns |
| Sonnet | **context-manager** | Optimizes context across conversations for 10k+ token projects |

**Install:**

```bash
# Install wshobson collection (agent-organizer, vibe-coding-coach, context-manager)
~/leamas/leamas agent@wshobson

# Install claude-code-sub-agents collection (prompt-engineer)
~/leamas/leamas agent@claude-code-sub-agents
```


### Development & Design

| Model | Agent | What It Does | MCPs Used |
|-------|-------|--------------|-----------|
| Sonnet | **ui-designer** | Design systems, WCAG compliance, prototyping | magic, context7 |
| Sonnet | **ux-designer** | User research, journey mapping, usability testing | context7, sequential-thinking, playwright |
| Sonnet | **frontend-developer** | React + TypeScript + Tailwind implementation | magic, context7, playwright |
| Sonnet | **ios-developer** | Swift, SwiftUI, UIKit native development | — |
| Sonnet | **nextjs-pro** | Next.js SSR/SSG/App Router architecture | — |
| Sonnet | **code-reviewer** | Quality assurance, security, performance analysis | context7, sequential-thinking |

**Install:**

```bash
# Install claude-code-sub-agents collection (ui-designer, ux-designer, frontend-developer, ios-developer, code-reviewer)
~/leamas/leamas agent@claude-code-sub-agents

# Install wshobson collection (nextjs-pro)
~/leamas/leamas agent@wshobson
```


### SEO & Content

| Model | Agent | What It Does |
|-------|-------|--------------|
| Sonnet | **seo-content-writer** | E-E-A-T optimized content, 0.5-1.5% keyword density |
| Haiku | **seo-content-planner** | Content calendars, topic clusters, search intent |
| Sonnet | **seo-content-auditor** | Quality scores 1-10, actionable recommendations |
| Haiku | **seo-keyword-strategist** | Keyword density analysis, 20-30 LSI variations |
| Haiku | **seo-meta-optimizer** | Meta titles, descriptions, 3-5 A/B test variations |
| Haiku | **seo-snippet-hunter** | Featured snippet formatting strategies |
| Haiku | **seo-structure-architect** | Header hierarchy, schema markup planning |
| Sonnet | **seo-authority-builder** | E-E-A-T signals, credibility enhancement |
| Haiku | **seo-content-refresher** | Outdated element detection, freshness updates |
| Haiku | **seo-cannibalization-detector** | Keyword overlap analysis, differentiation strategies |

**Install:**

These agents are bundled in SEO plugins. Enable plugins in settings.json (see [Plugins section](#plugins)):

```json
{
  "enabledPlugins": {
    "seo-content-creation@claude-code-workflows": true,
    "seo-technical-optimization@claude-code-workflows": true,
    "seo-analysis-monitoring@claude-code-workflows": true
  }
}
```


### Tools & Data

| Model | Agent | What It Does |
|-------|-------|--------------|
| Sonnet | **data-scientist** | Data analysis, SQL, BigQuery, ML workflows |
| Sonnet | **quant-analyst** | Quantitative & financial analysis, backtesting |
| Sonnet | **python-pro** | Python development, async patterns, design patterns |
| Sonnet | **database-admin** | Database setup, backups, replication, monitoring |
| Sonnet | **database-optimizer** | Query optimization, index design, N+1 solutions |
| Sonnet | **payment-integration** | Stripe, PayPal, webhooks, PCI compliance |

**Install:**

```bash
# Install wshobson collection (all data/tools agents)
~/leamas/leamas agent@wshobson
```







---

## 📋 Skills

Process frameworks that modify Claude's behavior. Skills provide step-by-step workflows, checklists, and mandatory procedures.



### 1. What they are

Behavioral modifications that guide Claude's execution. Skills add structured processes (test-driven development, systematic debugging, code review protocols) to ensure consistent quality and methodology.



### 2. How to explore

- Browse plugin marketplaces for bundled skills
- Check `~/.claude/skills/` for user-created skills
- Review plugin documentation for included skills



### 3. How to install

**Plugin-bundled skills:** Enable plugin in `~/.claude/settings.json`

**Standalone skills:** Create `.md` file in `~/.claude/skills/`



### 4. How to invoke

**Automatic:** Skills with triggers auto-activate on matching conditions

**Manual:** `Skill({ command: "skill-name" })`



### 5. What they do

Load additional instructions into current Claude context. Transform behavior without spawning new instance. Can be used by agents or main Claude instance.




### Core Development (superpowers@superpowers-marketplace)

| Skill | What It Does | Trigger |
|-------|--------------|---------|
| **using-superpowers** | Mandatory starting point for all tasks | Session start |
| **brainstorming** | Socratic refinement before implementation | Manual `/superpowers:brainstorm` |
| **writing-plans** | Detailed implementation plans with tasks | Manual `/superpowers:write-plan` |
| **executing-plans** | Batch execution with review checkpoints | Manual `/superpowers:execute-plan` |
| **test-driven-development** | RED-GREEN-REFACTOR workflow enforcement | Before feature implementation |
| **systematic-debugging** | Four-phase investigation framework | Any bug or unexpected behavior |
| **subagent-driven-development** | Dispatch agents with code review gates | Complex multi-task implementation |
| **dispatching-parallel-agents** | Parallel investigation of 3+ failures | Multiple independent failures |
| **writing-skills** | TDD for process documentation | Creating/editing skills |
| **testing-skills-with-subagents** | Validate skills resist rationalization | Before skill deployment |


### Quality & Testing (superpowers@superpowers-marketplace)

| Skill | What It Does | Trigger |
|-------|--------------|---------|
| **requesting-code-review** | Dispatch code-reviewer before merging | Task completion |
| **receiving-code-review** | Technical rigor, verify feedback | Receiving review |
| **verification-before-completion** | Run verification commands before claims | Before "done" claims |
| **testing-anti-patterns** | Prevent mocking pitfalls, test pollution | Writing/changing tests |
| **condition-based-waiting** | Replace timeouts with state polling | Flaky test fixes |


### Workflow & Git (superpowers@superpowers-marketplace + git@claude-code-plugins)

| Skill | What It Does | Source |
|-------|--------------|--------|
| **using-git-worktrees** | Isolated workspace creation | superpowers |
| **finishing-a-development-branch** | Structured options for merge/PR/cleanup | superpowers |
| **sharing-skills** | PR contribution workflow | superpowers |
| **root-cause-tracing** | Trace bugs backward through call stack | superpowers |
| **defense-in-depth** | Multi-layer validation | superpowers |


### Writing & Content

| Skill | What It Does | Source |
|-------|--------------|--------|
| **writing-clearly-and-concisely** | Strunk & White principles for all prose | elements-of-style@superpowers-marketplace |


### Learning Extraction (User Skills)

| Skill | What It Does | Location |
|-------|--------------|----------|
| **tapestry** | Auto-detect content type, extract, plan | `~/.claude/skills/tapestry/` |
| **youtube-transcript** | Download YouTube transcripts | `~/.claude/skills/youtube-transcript/` |
| **article-extractor** | Clean article content from URLs | `~/.claude/skills/article-extractor/` |
| **ship-learn-next** | Transform learning into action plans | `~/.claude/skills/ship-learn-next/` |







---

## 🔌 Plugins

Containers that bundle related skills. Enabling one plugin makes multiple skills available simultaneously.



### 1. What they are

Package management for skills. Instead of enabling 20 individual skills, you enable one plugin and get all related skills at once.



### 2. How to explore

- [Plugin Marketplace](https://claudecodeplugins.io/)
- [Plugin Toolkits](https://claudemarketplaces.com/)
- [Superpowers Repository](https://github.com/Ejb503/multiverse-of-multiagents)



### 3. How to install

Add to `~/.claude/settings.json`:

```json
{
  "enabledPlugins": {
    "plugin-name@marketplace-name": true
  }
}
```



### 4. How to invoke

Automatic — all skills inside become available once enabled



### 5. What they do

Enable bundled skills. No manual invocation needed. Skills within activate based on their individual triggers.




### Available Plugins

| Plugin | Skills Included | Repository |
|--------|-----------------|------------|
| **superpowers@superpowers-marketplace** | 20 skills (TDD, debugging, planning, code review, git workflows) | [Repository](https://github.com/Ejb503/multiverse-of-multiagents) |
| **elements-of-style@superpowers-marketplace** | 1 skill (clear writing for docs/commits/UI) | [Repository](https://github.com/Ejb503/multiverse-of-multiagents) |
| **javascript-typescript@claude-code-workflows** | 4 skills (modern JS patterns, testing, Node.js backend, TypeScript types) | [Repository](https://github.com/anthropics/claude-code-workflows) |
| **frontend-mobile-development@claude-code-workflows** | 2 skills (React components, mobile apps) | [Repository](https://github.com/anthropics/claude-code-workflows) |
| **code-documentation@claude-code-workflows** | 3 skills (code review, architecture docs, tutorials) | [Repository](https://github.com/anthropics/claude-code-workflows) |
| **seo-content-creation@claude-code-workflows** | 3 agents (writer, planner, auditor) | [Repository](https://github.com/anthropics/claude-code-workflows) |
| **seo-technical-optimization@claude-code-workflows** | 4 agents (keywords, meta, snippets, structure) | [Repository](https://github.com/anthropics/claude-code-workflows) |
| **seo-analysis-monitoring@claude-code-workflows** | 3 agents (authority, refresher, cannibalization) | [Repository](https://github.com/anthropics/claude-code-workflows) |
| **claude-mem@thedotmack** | Memory system with 6 MCP search tools | [Repository](https://github.com/thedotmack/claude-mem) |
| **git@claude-code-plugins** | 4 slash commands (commit-push, compact-commits, create-worktree, rebase-pr) | [Repository](https://github.com/anthropics/claude-code-plugins) |
| **commit-commands@claude-code-plugins** | Enhanced git commit workflows | [Repository](https://github.com/anthropics/claude-code-plugins) |


### Complete settings.json

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

## ⚡ MCPs

Background services providing tools and data sources. MCPs run continuously as separate processes, exposing capabilities to Claude Code.



### 1. What they are

External services that provide additional capabilities beyond Claude's built-in tools. Examples: memory systems, documentation lookup, browser automation, sequential reasoning.



### 2. How to explore

- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)
- [NPM package search](https://www.npmjs.com/search?q=mcp%20server)



### 3. How to install

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@package/name"]
    }
  }
}
```



### 4. How to invoke

Always running — tools appear automatically in Claude Code and agents. No manual invocation needed.



### 5. What they do

Provide external capabilities:

- **sequential-thinking:** Step-by-step reasoning tool
- **context7:** Documentation lookup for 100+ libraries
- **magic:** Component builder/refiner for UI
- **playwright:** Browser automation and snapshots
- **claude-mem:** Persistent memory with full-text search




### Installed MCPs

| MCP | What It Provides | Repository |
|-----|------------------|------------|
| **sequential-thinking** | `sequentialthinking` tool for structured reasoning | [Repository](https://github.com/modelcontextprotocol/servers/tree/main/src/sequential-thinking) |

**Install:**

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

## 🚀 Quick Start

```bash
# Prerequisites
node --version  # Need 18+
git --version

# 1. Install Leamas
# Download from https://leamas.sh/
# Place binary in ~/leamas/

# 2. Install agent collections
~/leamas/leamas agent@wshobson
~/leamas/leamas agent@claude-code-sub-agents

# 3. Enable plugins in ~/.claude/settings.json
{
  "enabledPlugins": {
    "superpowers@superpowers-marketplace": true,
    "git@claude-code-plugins": true
  }
}

# 4. Add MCPs to ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}

# 5. Restart Claude Code to load changes
```







---

## 📁 File Locations

```
Agents:      ~/.claude/agents/leamas/
Settings:    ~/.claude/settings.json
MCP Config:  ~/Library/Application Support/Claude/claude_desktop_config.json
Skills:      ~/.claude/skills/
Plugins:     ~/.claude/plugins/marketplaces/
Claude-Mem:  ${CLAUDE_PLUGIN_ROOT}/data/
```







---

## 📊 Summary

**62 total tools:** 19 agents • 11 plugins • 21 skills • 1 MCP • 10 SEO agents

**Model distribution:** Sonnet (16 agents) • Opus (1 agent) • Haiku (7 agents)

**Key repositories:**
- [Superpowers](https://github.com/Ejb503/multiverse-of-multiagents) — TDD, debugging, workflows
- [Claude Code Workflows](https://github.com/anthropics/claude-code-workflows) — Official Anthropic workflows
- [Claude Code Plugins](https://github.com/anthropics/claude-code-plugins) — Git utilities
- [Leamas](https://leamas.sh/) — Agent installer
