<div align="center">

# Claude Code Setup

> **Optimized for Vibe Coding** — AI-assisted development where you describe what you want and AI handles the implementation details.

[![Agents](https://img.shields.io/badge/agents-19-blue)](#agents)
[![Plugins](https://img.shields.io/badge/plugins-11-green)](#plugins)
[![Skills](https://img.shields.io/badge/skills-21-orange)](#skills)
[![MCPs](https://img.shields.io/badge/MCPs-1-purple)](#mcps)

**Quick Links:** [Core Concepts](#core-concepts) • [Tool Categories](#tool-categories) • [Configuration](#configuration) • [Marketplaces](#marketplaces)

*Last Updated: 2025-10-19*

</div>

---

## Core Concepts

Four key building blocks power this setup:

| Concept | What It Is | How You Use It |
|---------|------------|----------------|
| **Agents** | Specialized AI assistants with domain expertise | Invoke via Task tool: `Task({ subagent_type: "frontend-developer", ... })` |
| **Skills** | Process frameworks that guide how tasks are done | Auto-activate or explicit: `Skill({ command: "brainstorming" })` |
| **Plugins** | Packages that bundle skills together | Enable in settings: `"superpowers@superpowers-marketplace": true` |
| **MCPs** | External tools and data sources | Background services in `claude_desktop_config.json` |

**Installation:** Agents via [Leamas](https://leamas.sh/), Skills/Plugins via marketplaces, MCPs via npm.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Tool Categories](#tool-categories)
  - [Marketplaces](#marketplaces)
  - [1. Vibe Coding](#1-vibe-coding)
  - [2. Development](#2-development)
  - [3. Content & Marketing](#3-content--marketing)
  - [4. Tools & Utilities](#4-tools--utilities)
- [Configuration](#configuration)
- [Summary](#summary)

---

## Prerequisites

Verify required dependencies:

```bash
# Verify Node.js (18+)
node --version

# Verify Git
git --version

# Optional: GitHub CLI for PR workflows
gh --version
```

---

## Tool Categories

### Marketplaces

Three primary sources for agents, skills, and workflows:

| Marketplace | Focus | Link |
|------------|-------|------|
| **Agent Kits** | Pre-configured agent collections | [leamas.sh](https://leamas.sh/) |
| **Plugin Marketplace** | Community plugins and skills | [claudecodeplugins.io](https://claudecodeplugins.io/) |
| **Plugin Toolkits** | Specialized toolkits | [claudemarketplaces.com](https://claudemarketplaces.com/) |

**Key Repositories:**

- **[Superpowers Marketplace](https://github.com/Ejb503/multiverse-of-multiagents)** — Community framework for systematic development workflows • TDD, debugging, code review patterns
- **[Claude Code Workflows](https://github.com/anthropics/claude-code-workflows)** — Official Anthropic workflows • Language-specific development, SEO, content creation
- **[Claude Code Plugins](https://github.com/anthropics/claude-code-plugins)** — Core utilities • Git operations, commit workflows, version control helpers

---

### 1. Vibe Coding

**Orchestrate agents, develop skills, manage memory, plan implementations**

#### Agents

<details>
<summary><strong>agent-organizer</strong> — Coordinate multiple AI agents (Sonnet)</summary>

Your AI project manager that coordinates multiple agents working together on complex workflows.

```bash
~/leamas/leamas agent@wshobson
```
</details>

<details>
<summary><strong>vibe-coding-coach</strong> — Personalized coding mentorship (Sonnet)</summary>

Friendly coding mentor with personality. Provides guidance, explains concepts, improves your skills conversationally.

```bash
~/leamas/leamas agent@wshobson
```
</details>

<details>
<summary><strong>prompt-engineer</strong> — Craft optimized prompts (Opus)</summary>

Expert prompt architect using advanced techniques like Chain-of-Thought and Tree-of-Thoughts. Shows complete prompt text with implementation notes.

```bash
~/leamas/leamas agent@claude-code-sub-agents
```
</details>

<details>
<summary><strong>context-manager</strong> — Manage conversation context (Sonnet)</summary>

Optimizes context usage across conversations. Maximizes context windows and preserves important information.

```bash
~/leamas/leamas agent@wshobson
```
</details>

#### Plugins

##### superpowers@superpowers-marketplace

**Status:** ✅ ENABLED | **Provides:** 10 skills for systematic development

The core plugin providing the entire Superpowers skills ecosystem. Mandatory workflows, agent orchestration, planning tools.

```bash
# Enable in ~/.claude/settings.json
"superpowers@superpowers-marketplace": true
```

<details>
<summary><strong>View all 10 Superpowers skills</strong></summary>

**using-superpowers** — Your mandatory starting point for any task

**subagent-driven-development** — Dispatch fresh subagents for plan tasks with code reviews

**dispatching-parallel-agents** — Launch multiple agents for 3+ independent failures

**writing-skills** — Create bulletproof Claude skills with TDD

**testing-skills-with-subagents** — Validate skills resist rationalization

**sharing-skills** — Contribute skills upstream via PR

**commands** — Command-line workflow automation utilities

**brainstorming** — `/superpowers:brainstorm` — Refine ideas through Socratic questioning

**writing-plans** — `/superpowers:write-plan` — Create detailed implementation plans

**executing-plans** — `/superpowers:execute-plan` — Execute plans in controlled batches

</details>

##### claude-mem@thedotmack

**Status:** ✅ ENABLED | **Provides:** Persistent memory + 6 MCP search tools

Advanced memory system with SQLite + FTS5. Automatically captures work, processes into searchable summaries, injects context across sessions.

```bash
# Installation guide: https://github.com/thedotmack/claude-mem
"claude-mem@thedotmack": true
```

**Features:** Six specialized search tools, automatic capture/processing, session-to-session context injection

#### MCPs

##### sequential-thinking

**Provider:** Official @modelcontextprotocol

Structured, step-by-step reasoning for complex problems. Breaks challenges into logical sequential steps.

```json
// Add to ~/Library/Application Support/Claude/claude_desktop_config.json
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

### 2. Development

**Design, frontend, Next.js, and code review tools**

#### Agents

<details>
<summary><strong>ui-designer</strong> — Design systems and visual interfaces (Sonnet, MCP: magic + context7)</summary>

Creates accessible interfaces using color theory, typography, layout principles. Generates UI components, researches design patterns. WCAG compliant.

**Outputs:** High-fidelity mockups, prototypes, mood boards, style guides, design systems

```bash
~/leamas/leamas agent@claude-code-sub-agents
```
</details>

<details>
<summary><strong>ux-designer</strong> — User research and journey mapping (Sonnet, MCP: context7 + sequential-thinking + playwright)</summary>

User advocate focused on intuitive products through research and testing. Creates personas, journey maps, conducts usability testing.

**Outputs:** Research reports, wireframes, design specifications based on user needs

```bash
~/leamas/leamas agent@claude-code-sub-agents
```
</details>

<details>
<summary><strong>frontend-developer</strong> — Production React components (Sonnet, MCP: magic + context7 + playwright)</summary>

React specialist building complete production components with TypeScript and Tailwind CSS. Component-driven development with performance optimization.

**Outputs:** Component code, tests, accessibility checklist, performance notes, deployment checklist

```bash
~/leamas/leamas agent@claude-code-sub-agents
```
</details>

<details>
<summary><strong>ios-developer</strong> — Native iOS development (Sonnet)</summary>

iOS specialist covering Swift, SwiftUI, and UIKit. Builds native iOS apps following Apple's design guidelines.

```bash
~/leamas/leamas agent@claude-code-sub-agents
```
</details>

<details>
<summary><strong>nextjs-pro</strong> — Next.js SSR/SSG/routing (Sonnet)</summary>

Next.js specialist covering server-side rendering, static site generation, API routes, deployment optimizations.

```bash
~/leamas/leamas agent@wshobson
```
</details>

<details>
<summary><strong>code-reviewer</strong> — Comprehensive code review (Sonnet, MCP: context7 + sequential-thinking)</summary>

Senior code reviewer analyzing quality, security, performance, maintainability. Terminal-optimized reports: Critical Issues, Warnings, Suggestions.

```bash
~/leamas/leamas agent@claude-code-sub-agents
```
</details>

#### Plugins

##### javascript-typescript@claude-code-workflows

**Status:** ✅ ENABLED | **Provides:** 3 skills (frontend + backend)

JavaScript and TypeScript development skills.

```bash
"javascript-typescript@claude-code-workflows": true
```

**Skills:** modern-javascript-patterns, typescript-advanced-types, nodejs-backend-patterns

##### frontend-mobile-development@claude-code-workflows

**Status:** ✅ ENABLED | **Use Case:** Frontend and mobile development workflows

```bash
"frontend-mobile-development@claude-code-workflows": true
```

##### code-documentation@claude-code-workflows

**Status:** ✅ ENABLED | **Provides:** 3 agents for documentation + code review

```bash
"code-documentation@claude-code-workflows": true
```

---

### 3. Content & Marketing

**SEO content creation, technical optimization, and writing**

#### Plugins

##### seo-content-creation@claude-code-workflows

**Status:** ✅ ENABLED | **Provides:** 3 agents (writer, planner, auditor)

SEO content creation, planning, and auditing agents.

```bash
"seo-content-creation@claude-code-workflows": true
```

<details>
<summary><strong>View SEO Content Creation agents</strong></summary>

**seo-content-writer** (Sonnet) — Writes optimized content with natural keyword integration (0.5-1.5% density), E-E-A-T signals, scannable formatting

**seo-content-planner** (Haiku) — Plans content strategies, topic clusters, content calendars, identifies gaps, maps search intent

**seo-content-auditor** (Sonnet) — Analyzes existing content for quality, E-E-A-T, readability, keywords. Scores 1-10 with actionable recommendations

</details>

##### seo-technical-optimization@claude-code-workflows

**Status:** ✅ ENABLED | **Provides:** 4 agents (keywords, meta, snippets, structure)

Technical SEO optimization agents.

```bash
"seo-technical-optimization@claude-code-workflows": true
```

<details>
<summary><strong>View SEO Technical Optimization agents</strong></summary>

**seo-keyword-strategist** (Haiku) — Analyzes keyword usage, calculates density, generates 20-30 LSI variations, maps entities

**seo-meta-optimizer** (Haiku) — Creates optimized meta titles, descriptions, URLs within character limits. Provides 3-5 A/B test variations

**seo-snippet-hunter** (Haiku) — Formats content for featured snippets (position zero). Creates paragraph snippets, lists, tables with schema markup

**seo-structure-architect** (Haiku) — Optimizes header hierarchy, implements schema markup (Article, FAQ, HowTo, Review), identifies internal linking

</details>

##### seo-analysis-monitoring@claude-code-workflows

**Status:** ✅ ENABLED | **Provides:** 3 agents (authority, refresher, cannibalization)

SEO analysis and monitoring agents.

```bash
"seo-analysis-monitoring@claude-code-workflows": true
```

<details>
<summary><strong>View SEO Analysis & Monitoring agents</strong></summary>

**seo-authority-builder** (Sonnet) — Analyzes E-E-A-T signals: Experience, Expertise, Authority, Trust. Creates enhancement plans with templates

**seo-content-refresher** (Haiku) — Scans for outdated elements, prioritizes updates based on ranking decline, creates refresh plans

**seo-cannibalization-detector** (Haiku) — Identifies pages competing for same keywords. Resolution strategies: consolidate, differentiate, adjust targeting

</details>

##### elements-of-style@superpowers-marketplace

**Status:** ✅ ENABLED | **Provides:** 1 skill

Single-purpose plugin providing the `writing-clearly-and-concisely` skill. Applies Strunk & White's principles to any prose.

```bash
"elements-of-style@superpowers-marketplace": true
```

**Applies to:** Documentation, commit messages, error messages, reports, UI text

---

### 4. Tools & Utilities

**Data analysis, databases, Git workflows, and learning extraction**

#### Agents

<details>
<summary><strong>data-scientist</strong> — Data analysis and ML (Sonnet)</summary>

Handles data analysis, statistical modeling, machine learning implementations.

```bash
~/leamas/leamas agent@wshobson
```
</details>

<details>
<summary><strong>quant-analyst</strong> — Quantitative and financial analysis (Sonnet)</summary>

Provides quantitative analysis and financial modeling expertise.

```bash
~/leamas/leamas agent@wshobson
```
</details>

<details>
<summary><strong>python-pro</strong> — Python development and data analysis (Sonnet)</summary>

Python specialist for data analysis, scripting, automation, Python-specific best practices.

```bash
~/leamas/leamas agent@wshobson
```
</details>

<details>
<summary><strong>database-admin</strong> — Database setup and management (Sonnet)</summary>

Manages database administration, setup, ongoing maintenance.

```bash
~/leamas/leamas agent@wshobson
```
</details>

<details>
<summary><strong>database-optimizer</strong> — Query optimization and performance (Sonnet)</summary>

Optimizes database queries and overall database performance.

```bash
~/leamas/leamas agent@wshobson
```
</details>

<details>
<summary><strong>payment-integration</strong> — Payment systems (Sonnet)</summary>

Specializes in integrating Stripe, PayPal, payment processors. Handles payment workflows and security.

```bash
~/leamas/leamas agent@wshobson
```
</details>

#### Plugins

##### git@claude-code-plugins

**Status:** ✅ ENABLED | **Use Case:** Git version control workflows

Helpers and workflow improvements for Git operations.

```bash
"git@claude-code-plugins": true
```

##### commit-commands@claude-code-plugins

**Status:** ✅ ENABLED | **Use Case:** Better commit processes

Enhances commit workflows with helpers and improved commit message handling.

```bash
"commit-commands@claude-code-plugins": true
```

#### User-Created Skills

**article-extractor** — Extracts clean article content from URLs without ads, navigation, clutter

**ship-learn-next** — Transforms learning content into actionable implementation plans, practice reps, learning quests

**tapestry** — Unified workflow: `tapestry <URL>` auto-detects content type, extracts, creates action plan

**youtube-transcript** — Downloads transcripts and captions from YouTube videos

---

## Configuration

### File Locations

```
Agents:           ~/.claude/agents/leamas/
Settings:         ~/.claude/settings.json
MCP Config:       ~/Library/Application Support/Claude/claude_desktop_config.json
User Skills:      ~/.claude/skills/
Plugins:          ~/.claude/plugins/marketplaces/
Claude-Mem Data:  ${CLAUDE_PLUGIN_ROOT}/data/
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
  },
  "alwaysThinkingEnabled": false
}
```

---

## Summary

**Total Tools: 62**

| Category | Count |
|----------|-------|
| Agents | 19 |
| Plugins | 11 |
| Skills | 21 |
| MCPs | 1 |
| SEO Plugin Agents | 10 |

**Skills Breakdown:**
- 10 from superpowers
- 3 from javascript-typescript
- 1 from elements-of-style
- 3 from SEO plugins
- 4 user-created

---

**Recently Removed (18 tools):** react-pro, mobile-developer, javascript-pro, debugger, security-auditor, 4 business agents, 4 duplicate data agents, content-writer
