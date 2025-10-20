[![Agents](https://img.shields.io/badge/agents-19-blue)](#-vibe-coding)
[![Plugins](https://img.shields.io/badge/plugins-11-green)](#-content--marketing)
[![Skills](https://img.shields.io/badge/skills-21-orange)](#-vibe-coding)
[![MCPs](https://img.shields.io/badge/MCPs-1-purple)](#-vibe-coding)

**Claude Code setup optimized for vibe coding** — describe what you want, AI handles implementation. Four building blocks (agents, skills, plugins, MCPs) organized by what you're trying to do, not where they came from.

## Quick Start

```bash
# Verify prerequisites
node --version  # Need 18+
git --version

# Install an agent collection
~/leamas/leamas agent@wshobson

# Enable a plugin (add to ~/.claude/settings.json)
{
  "enabledPlugins": {
    "superpowers@superpowers-marketplace": true
  }
}

# That's it - agents auto-invoke based on context
```

## Core Concepts

| Tool | What It Is | How It Works |
|------|------------|--------------|
| **Agent** | Specialized AI with domain expertise (frontend, SEO, Python) | Auto-invoked by context or explicit via `Task({ subagent_type: "frontend-developer" })` |
| **Skill** | Process framework that guides execution (TDD, debugging, planning) | Auto-activates on triggers or explicit via `Skill({ command: "brainstorming" })` |
| **Plugin** | Bundle of skills focused on one domain (development, SEO, Git) | Enable in settings, provides multiple skills at once |
| **MCP** | External tool/data source (memory, search, browser control) | Background service in `claude_desktop_config.json` |

**Installation sources:** Agents via [Leamas](https://leamas.sh/), Skills/Plugins via [marketplaces](#marketplaces), MCPs via npm

---

## Table of Contents

- [Marketplaces](#marketplaces)
- [🎨 Vibe Coding](#-vibe-coding)
- [⚙️ Development](#-development)
- [📝 Content & Marketing](#-content--marketing)
- [🛠️ Tools & Utilities](#-tools--utilities)
- [Configuration](#configuration)

---

## Marketplaces

**[Superpowers](https://github.com/Ejb503/multiverse-of-multiagents)** — TDD, debugging, code review workflows
**[Claude Code Workflows](https://github.com/anthropics/claude-code-workflows)** — Official language & SEO agents
**[Claude Code Plugins](https://github.com/anthropics/claude-code-plugins)** — Git operations & commit helpers

Install: [Leamas](https://leamas.sh/) • [Plugin Marketplace](https://claudecodeplugins.io/) • [Plugin Toolkits](https://claudemarketplaces.com/)

---

## 🎨 Vibe Coding

**Orchestrate agents, plan implementations, manage memory**

### Agents

| Agent | Purpose | Model | Source |
|-------|---------|-------|--------|
| **agent-organizer** | Coordinate multiple agents on complex workflows | Sonnet | `~/leamas/leamas agent@wshobson` |
| **vibe-coding-coach** | Friendly mentor with personality, explains concepts | Sonnet | `~/leamas/leamas agent@wshobson` |
| **prompt-engineer** | Craft optimized prompts (Chain-of-Thought, Tree-of-Thoughts) | Opus | `~/leamas/leamas agent@claude-code-sub-agents` |
| **context-manager** | Optimize context usage across conversations | Sonnet | `~/leamas/leamas agent@wshobson` |

### Plugins

#### superpowers@superpowers-marketplace

**10 skills** • Systematic development workflows • [Repository](https://github.com/Ejb503/multiverse-of-multiagents)

```json
"superpowers@superpowers-marketplace": true
```

<details>
<summary>📋 View all 10 skills</summary>

- **using-superpowers** — Mandatory starting point, establishes workflows
- **subagent-driven-development** — Dispatch fresh agents with code reviews
- **dispatching-parallel-agents** — 3+ independent failures, parallel investigation
- **writing-skills** — Create bulletproof Claude skills with TDD
- **testing-skills-with-subagents** — Validate skills resist rationalization
- **sharing-skills** — Contribute skills via PR
- **commands** — CLI automation utilities
- **brainstorming** — `/superpowers:brainstorm` — Refine ideas via Socratic method
- **writing-plans** — `/superpowers:write-plan` — Detailed implementation plans
- **executing-plans** — `/superpowers:execute-plan` — Execute in batches

</details>

#### claude-mem@thedotmack

**SQLite + FTS5 memory** • 6 MCP search tools • [Repository](https://github.com/thedotmack/claude-mem)

```json
"claude-mem@thedotmack": true
```

Auto-captures work → processes into summaries → injects context across sessions

### MCPs

#### sequential-thinking

Step-by-step reasoning for complex problems • [MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/sequential-thinking)

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

## ⚙️ Development

**Design, frontend, Next.js, code review**

### Agents

| Agent | Purpose | Model | MCPs | Source |
|-------|---------|-------|------|--------|
| **ui-designer** | Design systems, visual interfaces, WCAG compliance | Sonnet | magic, context7 | `~/leamas/leamas agent@claude-code-sub-agents` |
| **ux-designer** | User research, journey mapping, usability testing | Sonnet | context7, sequential-thinking, playwright | `~/leamas/leamas agent@claude-code-sub-agents` |
| **frontend-developer** | Production React + TypeScript + Tailwind components | Sonnet | magic, context7, playwright | `~/leamas/leamas agent@claude-code-sub-agents` |
| **ios-developer** | Native iOS (Swift, SwiftUI, UIKit) | Sonnet | — | `~/leamas/leamas agent@claude-code-sub-agents` |
| **nextjs-pro** | Next.js SSR/SSG/routing specialist | Sonnet | — | `~/leamas/leamas agent@wshobson` |
| **code-reviewer** | Quality, security, performance, maintainability | Sonnet | context7, sequential-thinking | `~/leamas/leamas agent@claude-code-sub-agents` |

### Plugins

```json
"javascript-typescript@claude-code-workflows": true,
"frontend-mobile-development@claude-code-workflows": true,
"code-documentation@claude-code-workflows": true
```

---

## 📝 Content & Marketing

**SEO content, technical optimization, writing**

### Plugins

#### seo-content-creation@claude-code-workflows

**3 agents:** writer, planner, auditor

```json
"seo-content-creation@claude-code-workflows": true
```

<details>
<summary>📋 View agents</summary>

- **seo-content-writer** (Sonnet) — Optimized content, 0.5-1.5% keyword density, E-E-A-T signals
- **seo-content-planner** (Haiku) — Content calendars, topic clusters, search intent mapping
- **seo-content-auditor** (Sonnet) — Quality scores 1-10, actionable recommendations

</details>

#### seo-technical-optimization@claude-code-workflows

**4 agents:** keywords, meta, snippets, structure

```json
"seo-technical-optimization@claude-code-workflows": true
```

<details>
<summary>📋 View agents</summary>

- **seo-keyword-strategist** (Haiku) — Keyword density, 20-30 LSI variations, entity mapping
- **seo-meta-optimizer** (Haiku) — Meta titles, descriptions, URLs, 3-5 A/B variations
- **seo-snippet-hunter** (Haiku) — Featured snippet formatting (paragraph, list, table)
- **seo-structure-architect** (Haiku) — Header hierarchy, schema markup, internal linking

</details>

#### seo-analysis-monitoring@claude-code-workflows

**3 agents:** authority, refresher, cannibalization

```json
"seo-analysis-monitoring@claude-code-workflows": true
```

<details>
<summary>📋 View agents</summary>

- **seo-authority-builder** (Sonnet) — E-E-A-T signals, enhancement plans, templates
- **seo-content-refresher** (Haiku) — Outdated element detection, update prioritization
- **seo-cannibalization-detector** (Haiku) — Keyword overlap detection, resolution strategies

</details>

#### elements-of-style@superpowers-marketplace

Applies Strunk & White's principles to documentation, commits, error messages, reports, UI text

```json
"elements-of-style@superpowers-marketplace": true
```

---

## 🛠️ Tools & Utilities

**Data, databases, Git, learning extraction**

### Agents

| Agent | Purpose | Source |
|-------|---------|--------|
| **data-scientist** | Data analysis, SQL, BigQuery, ML | `~/leamas/leamas agent@wshobson` |
| **quant-analyst** | Quantitative & financial analysis | `~/leamas/leamas agent@wshobson` |
| **python-pro** | Python development, data analysis, scripting | `~/leamas/leamas agent@wshobson` |
| **database-admin** | Database setup & management | `~/leamas/leamas agent@wshobson` |
| **database-optimizer** | Query & performance optimization | `~/leamas/leamas agent@wshobson` |
| **payment-integration** | Stripe, PayPal integration | `~/leamas/leamas agent@wshobson` |

### Plugins

```json
"git@claude-code-plugins": true,
"commit-commands@claude-code-plugins": true
```

### User Skills

- **article-extractor** — Clean article content from URLs (no ads/nav)
- **ship-learn-next** — Learning → actionable implementation plans
- **tapestry** — `tapestry <URL>` → auto-detects type, extracts, creates plan
- **youtube-transcript** — Download YouTube transcripts

---

## Configuration

### Locations

```
Agents:      ~/.claude/agents/leamas/
Settings:    ~/.claude/settings.json
MCP Config:  ~/Library/Application Support/Claude/claude_desktop_config.json
Skills:      ~/.claude/skills/
Plugins:     ~/.claude/plugins/marketplaces/
Claude-Mem:  ${CLAUDE_PLUGIN_ROOT}/data/
```

### settings.json

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
  },
  "alwaysThinkingEnabled": false
}
```

### Summary

**62 total tools:** 19 agents • 11 plugins • 21 skills • 1 MCP • 10 SEO agents

**Recently removed (18):** react-pro, mobile-developer, javascript-pro, debugger, security-auditor, business agents (4), duplicate data agents (4), content-writer
