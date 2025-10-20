[![Agents](https://img.shields.io/badge/agents-19-blue)](#vibe-coding)
[![Plugins](https://img.shields.io/badge/plugins-11-green)](#content--marketing)
[![Skills](https://img.shields.io/badge/skills-21-orange)](#vibe-coding)
[![MCPs](https://img.shields.io/badge/MCPs-1-purple)](#vibe-coding)

Claude Code setup for **vibe coding** — describe what you want, AI handles implementation.

Four building blocks organized by what you're trying to do:

| Tool | Purpose | How to Use |
|------|---------|------------|
| **Agent** | Specialized AI (frontend, SEO, Python) | Auto-invoked by context or `Task({ subagent_type: "name" })` |
| **Skill** | Process framework (TDD, debugging, planning) | Auto-activates or `Skill({ command: "name" })` |
| **Plugin** | Bundle of related skills | Enable in `~/.claude/settings.json` |
| **MCP** | External tool/data source | Background service in config |


## Quick Start

```bash
# Verify prerequisites
node --version  # Need 18+
git --version

# Install Leamas (agent installer) - download from https://leamas.sh/
# Place binary in ~/leamas/

# Install agent collections
~/leamas/leamas agent@wshobson
~/leamas/leamas agent@claude-code-sub-agents

# Enable plugins in ~/.claude/settings.json
{
  "enabledPlugins": {
    "superpowers@superpowers-marketplace": true
  }
}
```


## Marketplaces

Install from:
- [Leamas](https://leamas.sh/) — Agent installer
- [Plugin Marketplace](https://claudecodeplugins.io/) — Community plugins
- [Plugin Toolkits](https://claudemarketplaces.com/) — Specialized toolkits

Key repositories:
- [Superpowers](https://github.com/Ejb503/multiverse-of-multiagents) — TDD, debugging, code review
- [Claude Code Workflows](https://github.com/anthropics/claude-code-workflows) — Official Anthropic workflows
- [Claude Code Plugins](https://github.com/anthropics/claude-code-plugins) — Git utilities



## Vibe Coding

Orchestrate agents, manage memory, plan implementations

### Agents

**agent-organizer** — Coordinates multiple AI agents on complex workflows (Sonnet)

```bash
~/leamas/leamas agent@wshobson
```

**vibe-coding-coach** — Friendly mentor with personality (Sonnet)

```bash
~/leamas/leamas agent@wshobson
```

**prompt-engineer** — Crafts optimized prompts (CoT, ToT) (Opus)

```bash
~/leamas/leamas agent@claude-code-sub-agents
```

**context-manager** — Optimizes context across conversations (Sonnet)

```bash
~/leamas/leamas agent@wshobson
```


### Plugins

#### superpowers@superpowers-marketplace

10 skills for systematic development • [Repository](https://github.com/Ejb503/multiverse-of-multiagents)

```json
"superpowers@superpowers-marketplace": true
```

| Skill | What It Does |
|-------|--------------|
| **using-superpowers** | Mandatory starting point |
| **subagent-driven-development** | Dispatch agents with code reviews |
| **dispatching-parallel-agents** | 3+ independent failures → parallel fix |
| **writing-skills** | Create bulletproof skills with TDD |
| **testing-skills-with-subagents** | Validate skills resist rationalization |
| **sharing-skills** | Contribute via PR |
| **commands** | CLI automation |
| **brainstorming** | `/superpowers:brainstorm` — Socratic refinement |
| **writing-plans** | `/superpowers:write-plan` — Implementation plans |
| **executing-plans** | `/superpowers:execute-plan` — Batch execution |


#### claude-mem@thedotmack

SQLite + FTS5 memory • 6 MCP search tools • [Repository](https://github.com/thedotmack/claude-mem)

```json
"claude-mem@thedotmack": true
```

Auto-captures work → processes summaries → injects context across sessions


### MCPs

#### sequential-thinking

Step-by-step reasoning • [Repository](https://github.com/modelcontextprotocol/servers/tree/main/src/sequential-thinking)

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



## Development

Design, frontend, Next.js, code review

### Agents

**ui-designer** — Design systems, WCAG compliance (Sonnet)
MCPs: magic, context7

```bash
~/leamas/leamas agent@claude-code-sub-agents
```

**ux-designer** — User research, journey mapping (Sonnet)
MCPs: context7, sequential-thinking, playwright

```bash
~/leamas/leamas agent@claude-code-sub-agents
```

**frontend-developer** — React + TypeScript + Tailwind (Sonnet)
MCPs: magic, context7, playwright

```bash
~/leamas/leamas agent@claude-code-sub-agents
```

**ios-developer** — Swift, SwiftUI, UIKit (Sonnet)

```bash
~/leamas/leamas agent@claude-code-sub-agents
```

**nextjs-pro** — Next.js SSR/SSG/routing (Sonnet)

```bash
~/leamas/leamas agent@wshobson
```

**code-reviewer** — Quality, security, performance (Sonnet)
MCPs: context7, sequential-thinking

```bash
~/leamas/leamas agent@claude-code-sub-agents
```


### Plugins

```json
"javascript-typescript@claude-code-workflows": true,
"frontend-mobile-development@claude-code-workflows": true,
"code-documentation@claude-code-workflows": true
```



## Content & Marketing

SEO content, technical optimization, writing

### seo-content-creation@claude-code-workflows

3 agents: writer, planner, auditor

```json
"seo-content-creation@claude-code-workflows": true
```

| Agent | Model | What It Does |
|-------|-------|--------------|
| **seo-content-writer** | Sonnet | Optimized content, 0.5-1.5% keyword density, E-E-A-T |
| **seo-content-planner** | Haiku | Content calendars, topic clusters, search intent |
| **seo-content-auditor** | Sonnet | Quality scores 1-10, actionable recommendations |


### seo-technical-optimization@claude-code-workflows

4 agents: keywords, meta, snippets, structure

```json
"seo-technical-optimization@claude-code-workflows": true
```

| Agent | Model | What It Does |
|-------|-------|--------------|
| **seo-keyword-strategist** | Haiku | Keyword density, 20-30 LSI variations |
| **seo-meta-optimizer** | Haiku | Meta titles, descriptions, 3-5 A/B variations |
| **seo-snippet-hunter** | Haiku | Featured snippet formatting |
| **seo-structure-architect** | Haiku | Header hierarchy, schema markup |


### seo-analysis-monitoring@claude-code-workflows

3 agents: authority, refresher, cannibalization

```json
"seo-analysis-monitoring@claude-code-workflows": true
```

| Agent | Model | What It Does |
|-------|-------|--------------|
| **seo-authority-builder** | Sonnet | E-E-A-T signals, enhancement plans |
| **seo-content-refresher** | Haiku | Outdated element detection |
| **seo-cannibalization-detector** | Haiku | Keyword overlap resolution |


### elements-of-style@superpowers-marketplace

Applies Strunk & White principles to docs, commits, errors, UI text

```json
"elements-of-style@superpowers-marketplace": true
```



## Tools & Utilities

Data, databases, Git, learning extraction

### Agents

**data-scientist** — Data analysis, SQL, BigQuery, ML (Sonnet)

```bash
~/leamas/leamas agent@wshobson
```

**quant-analyst** — Quantitative & financial analysis (Sonnet)

```bash
~/leamas/leamas agent@wshobson
```

**python-pro** — Python development, scripting (Sonnet)

```bash
~/leamas/leamas agent@wshobson
```

**database-admin** — Database setup & management (Sonnet)

```bash
~/leamas/leamas agent@wshobson
```

**database-optimizer** — Query & performance optimization (Sonnet)

```bash
~/leamas/leamas agent@wshobson
```

**payment-integration** — Stripe, PayPal integration (Sonnet)

```bash
~/leamas/leamas agent@wshobson
```


### Plugins

```json
"git@claude-code-plugins": true,
"commit-commands@claude-code-plugins": true
```


### User Skills

| Skill | What It Does |
|-------|--------------|
| **article-extractor** | Clean article content from URLs |
| **ship-learn-next** | Learning → actionable plans |
| **tapestry** | `tapestry <URL>` → auto-detect + extract + plan |
| **youtube-transcript** | Download YouTube transcripts |



## Configuration

### File Locations

```
Agents:      ~/.claude/agents/leamas/
Settings:    ~/.claude/settings.json
MCP Config:  ~/Library/Application Support/Claude/claude_desktop_config.json
Skills:      ~/.claude/skills/
Plugins:     ~/.claude/plugins/marketplaces/
Claude-Mem:  ${CLAUDE_PLUGIN_ROOT}/data/
```

### Complete settings.json

```json
{
  "enabledPlugins": {
    "commit-commands@claude-code-plugins": true,
    "elements-of-style@superpowers-marketplace": true,
    "superpowers@superpowers-marketplace": true,
    "javascript-typescript@claude-code-workflows": true,
    "code-documentation@claude-code-workflows": true,
    "frontend-mobile-development@claude-code-workflows": true,
    "seo-content-creation@claude-code-workflows": true,
    "seo-technical-optimization@claude-code-workflows": true,
    "seo-analysis-monitoring@claude-code-workflows": true,
    "claude-mem@thedotmack": true,
    "git@claude-code-plugins": true
  }
}
```

### Summary

**62 total tools:** 19 agents • 11 plugins • 21 skills • 1 MCP • 10 SEO agents

**Recently removed (18):** react-pro, mobile-developer, javascript-pro, debugger, security-auditor, 4 business agents, 4 duplicate data agents, content-writer
