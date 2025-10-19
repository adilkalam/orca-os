# Claude Code Setup

> **Optimized for Vibe Coding** — AI-assisted development where you describe what you want and AI handles the implementation details.
>
> Last Updated: 2025-10-19

## Table of Contents

- [Introduction](#introduction)
- [Core Concepts](#core-concepts)
- [Marketplaces](#marketplaces)
- [Prerequisites](#prerequisites)
- [Tool Categories](#tool-categories)
  - [Vibe Coding](#1-vibe-coding)
  - [Development](#2-development)
  - [Content & Marketing](#3-content--marketing)
  - [Tools & Utilities](#4-tools--utilities)
- [Configuration](#configuration)
- [Summary](#summary)

---

## Introduction

This reference documents a comprehensive Claude Code setup optimized for "vibe coding"—AI-assisted development where you describe what you want and AI handles the implementation details.

## Core Concepts

### Agents

Specialized AI assistants with specific expertise (e.g., `frontend-developer`, `code-reviewer`). Invoked via the Task tool and installed via package managers like Leamas. Agents are standalone—not bundled in plugins.

```typescript
// Invoke an agent to handle a specific task
Task({
  subagent_type: "frontend-developer",
  prompt: "Build a responsive navbar component"
})
```

### Skills

Process frameworks and workflows that guide how tasks should be done (e.g., `test-driven-development`, `brainstorming`). Skills activate automatically when relevant or via the Skill tool. They come bundled in plugins.

```typescript
// Explicitly invoke a skill to guide your process
Skill({ command: "superpowers:brainstorming" })
```

### Plugins

Packages that provide collections of skills. Enabled in your Claude Code settings to provide additional capabilities like systematic workflows or SEO tools.

```json
// Enable plugins in ~/.claude/settings.json
{
  "enabledPlugins": {
    "superpowers@superpowers-marketplace": true
  }
}
```

### MCPs (Model Context Protocol)

Extend Claude's capabilities with external tools and data sources. Run as background services providing functions like memory systems or structured reasoning.

```json
// Configure MCPs in ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

## Marketplaces

Claude Code has three primary plugin marketplaces providing agents, skills, and workflows:

| Marketplace | Focus | Link |
|------------|-------|------|
| **Agent Kits** | Pre-configured agent collections | [leamas.sh](https://leamas.sh/) |
| **Plugin Marketplace** | Community plugins and skills | [claudecodeplugins.io](https://claudecodeplugins.io/) |
| **Plugin Toolkits** | Specialized toolkits | [claudemarketplaces.com](https://claudemarketplaces.com/) |

### Key Repositories

**Superpowers Marketplace**
Community-driven framework for systematic, quality-driven development workflows. Provides core skills including TDD, debugging, code review, and collaborative development patterns.
[github.com/Ejb503/multiverse-of-multiagents](https://github.com/Ejb503/multiverse-of-multiagents)

**Claude Code Workflows**
Official Anthropic workflows for language-specific development and specialized tasks (SEO, content creation, documentation).
[github.com/anthropics/claude-code-workflows](https://github.com/anthropics/claude-code-workflows)

**Claude Code Plugins**
Core utilities and integrations for Git operations, commit workflows, and version control helpers.
[github.com/anthropics/claude-code-plugins](https://github.com/anthropics/claude-code-plugins)

## Prerequisites

Verify you have the required dependencies before installation:

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

### 1. Vibe Coding

Orchestrate agents, develop skills, manage memory, and plan implementations.

#### Agents

<details>
<summary><strong>agent-organizer</strong> — Coordinate multiple AI agents working together</summary>

**Model:** Sonnet
**Use Case:** Coordinating multiple agents for complex workflows

Helps you organize and manage multiple AI agents working together. Think of it as your AI project manager that keeps track of which agents are doing what and coordinates their efforts.

```bash
# Install via wshobson kit
~/leamas/leamas agent@wshobson
```
</details>

<details>
<summary><strong>vibe-coding-coach</strong> — Personalized coding guidance and mentorship</summary>

**Model:** Sonnet
**Use Case:** Personalized coding guidance and mentorship

Your friendly coding mentor with personality. Provides guidance while you code, offers suggestions, explains concepts, and helps improve your skills with a conversational approach.

```bash
# Install via wshobson kit
~/leamas/leamas agent@wshobson
```
</details>

<details>
<summary><strong>prompt-engineer</strong> — Craft and optimize prompts for AI systems</summary>

**Model:** Opus (highest reasoning)
**Use Case:** Crafting and optimizing prompts for AI systems

Expert prompt architect using the most powerful model. Specializes in advanced techniques like Chain-of-Thought and Tree-of-Thoughts. Always shows complete prompt text with implementation notes. Essential for building AI features.

```bash
# Install via claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```
</details>

<details>
<summary><strong>context-manager</strong> — Manage conversation context and memory</summary>

**Model:** Sonnet
**Use Case:** Managing conversation context and memory

Optimizes how context is used and managed across conversations. Helps maximize available context windows and ensures important information is preserved and accessible.

```bash
# Install via wshobson kit
~/leamas/leamas agent@wshobson
```
</details>

#### Plugins

##### superpowers@superpowers-marketplace

The core plugin providing the entire Superpowers skills ecosystem. Includes mandatory workflows, agent orchestration, planning tools, and collaborative development patterns.

**Status:** ENABLED
**Provides:** 10 skills for systematic development

```bash
# Enable in ~/.claude/settings.json
# Add: "superpowers@superpowers-marketplace": true
```

<details>
<summary>View all 10 Superpowers skills</summary>

##### using-superpowers

**Triggers:** EVERY task (starting point)

Your mandatory starting point for any task. Forces you to search for and use existing skills before doing work. Prevents reinventing the wheel by ensuring you check if there's already a proven approach. Read → Announce → Follow.

##### subagent-driven-development

**Triggers:** Executing implementation plans with independent tasks

Automatically dispatches fresh subagents to handle individual tasks from your plan, with code reviews between each task. Enables fast iteration while maintaining quality.

##### dispatching-parallel-agents

**Triggers:** Facing 3+ independent failures

Launches multiple agents simultaneously to investigate different problems that don't depend on each other. Parallelizes problem-solving for faster resolution.

##### writing-skills

**Use Case:** Creating bulletproof Claude skills

Applies test-driven development methodology to creating Claude skills. Test the skill with subagents first to see where it fails, then write instructions that close those gaps.

##### testing-skills-with-subagents

**Use Case:** Validating skills resist rationalization

Runs your skills through actual subagent sessions to verify they work. Uses RED-GREEN-REFACTOR cycle to ensure skills are bulletproof before deployment.

##### sharing-skills

**Use Case:** Contributing skills to upstream repositories

Guides you through contributing your skill back to the community. Handles branching, committing, pushing, and creating pull requests.

##### commands

**Use Case:** Command-line workflow automation

Provides utilities and helpers for command-line workflows. Streamlines common operations and automates repetitive tasks.

##### brainstorming

**Triggers:** Before writing code or implementation plans
**Slash Command:** `/superpowers:brainstorm`

Refines rough ideas into fully-formed designs through structured Socratic questioning. Explores alternatives, validates assumptions, and incrementally refines concepts before writing code.

##### writing-plans

**Triggers:** When design is complete
**Slash Command:** `/superpowers:write-plan`

Creates detailed, step-by-step implementation plans with exact file paths and complete code examples. Designed for engineers with zero codebase context.

##### executing-plans

**Triggers:** When given a complete implementation plan
**Slash Command:** `/superpowers:execute-plan`

Loads a complete plan, reviews it critically, then executes tasks in controlled batches with review checkpoints between each batch.

</details>

##### claude-mem@thedotmack

Advanced memory system that remembers everything across sessions. Automatically captures what you do, processes it into searchable summaries, and injects relevant context when you start new sessions.

**Status:** ENABLED
**Provides:** Persistent memory with full-text search, 6 MCP search tools
**Technology:** SQLite with FTS5 for fast searching

```bash
# Follow installation guide at:
# https://github.com/thedotmack/claude-mem
# Then enable in ~/.claude/settings.json:
# "claude-mem@thedotmack": true
```

**Features:**
- Six specialized search tools (concept, file, type, full-text)
- Automatic capture and processing
- Session-to-session context injection

#### MCPs

##### sequential-thinking

**Provider:** Official @modelcontextprotocol
**Use Case:** Breaking down complex problems into logical steps

Enables structured, step-by-step reasoning for complex problems. Helps break down challenges into manageable sequential steps with clear logical progression.

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

```bash
# Restart Claude Desktop after editing
```

### 2. Development

Design, frontend, Next.js, and code review tools.

#### Agents

<details>
<summary><strong>ui-designer</strong> — Create design systems and visual interfaces</summary>

**Model:** Sonnet
**MCP:** magic, context7
**Use Case:** Creating design systems and visual interfaces

Creates beautiful, accessible interfaces using color theory, typography, and layout principles. Generates UI components with magic MCP and researches design patterns with context7. Ensures WCAG compliance.

**Outputs:** High-fidelity mockups, interactive prototypes, mood boards, style guides, complete design systems

```bash
# Install via claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```
</details>

<details>
<summary><strong>ux-designer</strong> — User research, journey mapping, and usability testing</summary>

**Model:** Sonnet
**MCP:** context7, sequential-thinking, playwright
**Use Case:** User research, journey mapping, and usability testing

Your user advocate focused on making products intuitive through research and testing. Creates user personas, journey maps, and conducts usability testing.

**Outputs:** Research reports, wireframes, design specifications based on user needs

```bash
# Install via claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```
</details>

<details>
<summary><strong>frontend-developer</strong> — Build production-ready React components</summary>

**Model:** Sonnet
**MCP:** magic, context7, playwright
**Use Case:** Building production-ready React components

React specialist building complete, production-ready components with TypeScript and Tailwind CSS. Follows component-driven development with performance optimization built in.

**Outputs:** Component code, tests, accessibility checklist, performance notes, deployment checklist

```bash
# Install via claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```
</details>

<details>
<summary><strong>ios-developer</strong> — Native iOS application development</summary>

**Model:** Sonnet
**Use Case:** Native iOS application development

iOS specialist covering Swift, SwiftUI, and UIKit. Builds native iOS applications following Apple's design guidelines and platform-specific patterns.

```bash
# Install via claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```
</details>

<details>
<summary><strong>nextjs-pro</strong> — Next.js applications with SSR, SSG, and routing</summary>

**Model:** Sonnet
**Use Case:** Next.js applications with SSR, SSG, and routing

Next.js specialist covering server-side rendering, static site generation, API routes, and deployment. Understands Next.js-specific patterns and optimizations.

```bash
# Install via wshobson kit
~/leamas/leamas agent@wshobson
```
</details>

<details>
<summary><strong>code-reviewer</strong> — Comprehensive code review before merging</summary>

**Model:** Sonnet
**MCP:** context7, sequential-thinking
**Use Case:** Comprehensive code review before merging

Senior code reviewer analyzing code for quality, security, performance, and maintainability. Provides terminal-optimized reports organized by priority: Critical Issues, Warnings, and Suggestions.

```bash
# Install via claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```
</details>

#### Plugins

##### javascript-typescript@claude-code-workflows

**Status:** ENABLED
**Provides:** 3 skills (2 frontend, 1 backend)

JavaScript and TypeScript development skills including frontend patterns and backend Node.js support.

```bash
# Enable in ~/.claude/settings.json
# Add: "javascript-typescript@claude-code-workflows": true
```

**Skills included:**
- **modern-javascript-patterns** — ES6+ features and patterns
- **typescript-advanced-types** — Advanced TypeScript type system
- **nodejs-backend-patterns** — Express, Fastify, API design

##### frontend-mobile-development@claude-code-workflows

**Status:** ENABLED
**Use Case:** Frontend and mobile development workflows

Workflow agents specialized in frontend and mobile development patterns and best practices.

```bash
# Enable in ~/.claude/settings.json
# Add: "frontend-mobile-development@claude-code-workflows": true
```

##### code-documentation@claude-code-workflows

**Status:** ENABLED
**Use Case:** Code documentation and quality workflows

Three agents specialized in documentation generation and code review workflows for maintaining quality and documentation standards.

```bash
# Enable in ~/.claude/settings.json
# Add: "code-documentation@claude-code-workflows": true
```

### 3. Content & Marketing

SEO content creation, technical optimization, and writing.

#### Plugins

##### seo-content-creation@claude-code-workflows

**Status:** ENABLED
**Provides:** 3 agents (writer, planner, auditor)

SEO content creation, planning, and auditing agents for comprehensive content workflow.

```bash
# Enable in ~/.claude/settings.json
# Add: "seo-content-creation@claude-code-workflows": true
```

<details>
<summary>View SEO Content Creation agents</summary>

**seo-content-writer** (Sonnet)
Writes content optimized for search engines while maintaining quality. Integrates keywords naturally (0.5-1.5% density), includes E-E-A-T signals, and creates scannable content.

**seo-content-planner** (Haiku)
Plans comprehensive content strategies with topic clusters, content calendars, and outlines. Identifies content gaps and maps search intent.

**seo-content-auditor** (Sonnet)
Analyzes existing content for quality, E-E-A-T signals, readability, and keyword optimization. Scores content on 1-10 scale with actionable recommendations.

</details>

##### seo-technical-optimization@claude-code-workflows

**Status:** ENABLED
**Provides:** 4 agents (keywords, meta, snippets, structure)

Technical SEO optimization agents for keywords, metadata, featured snippets, and content structure.

```bash
# Enable in ~/.claude/settings.json
# Add: "seo-technical-optimization@claude-code-workflows": true
```

<details>
<summary>View SEO Technical Optimization agents</summary>

**seo-keyword-strategist** (Haiku)
Analyzes keyword usage, calculates density, generates 20-30 LSI keyword variations. Maps entities and related concepts.

**seo-meta-optimizer** (Haiku)
Creates optimized meta titles, descriptions, and URL structures within character limits. Provides 3-5 variations for A/B testing.

**seo-snippet-hunter** (Haiku)
Formats content for featured snippets (position zero). Creates paragraph snippets, list formats, and table structures with schema markup.

**seo-structure-architect** (Haiku)
Optimizes header hierarchy, implements schema markup (Article, FAQ, HowTo, Review), and identifies internal linking opportunities.

</details>

##### seo-analysis-monitoring@claude-code-workflows

**Status:** ENABLED
**Provides:** 3 agents (authority, refresher, cannibalization)

SEO analysis and monitoring agents for building authority, detecting conflicts, and maintaining freshness.

```bash
# Enable in ~/.claude/settings.json
# Add: "seo-analysis-monitoring@claude-code-workflows": true
```

<details>
<summary>View SEO Analysis & Monitoring agents</summary>

**seo-authority-builder** (Sonnet)
Analyzes content for E-E-A-T signals: Experience, Expertise, Authority, Trust. Creates enhancement plans with author bio templates and trust signal checklists.

**seo-content-refresher** (Haiku)
Scans content for outdated elements and prioritizes updates based on ranking decline. Creates refresh plans with update checklists.

**seo-cannibalization-detector** (Haiku)
Identifies when multiple pages compete for the same keywords. Provides resolution strategies: consolidate, differentiate, or adjust targeting.

</details>

##### elements-of-style@superpowers-marketplace

**Status:** ENABLED
**Provides:** 1 skill

Single-purpose plugin providing the `writing-clearly-and-concisely` skill. Brings Strunk & White's timeless writing principles to all your prose.

```bash
# Enable in ~/.claude/settings.json
# Add: "elements-of-style@superpowers-marketplace": true
```

**Skill: writing-clearly-and-concisely**
Applies classic writing principles from Strunk & White to any text: documentation, commit messages, error messages, reports, UI text.

### 4. Tools & Utilities

Data analysis, databases, Git workflows, and learning extraction.

#### Agents

<details>
<summary><strong>data-scientist</strong> — Data analysis and machine learning</summary>

**Model:** Sonnet
**Use Case:** Data analysis and machine learning

Handles data analysis, statistical modeling, and machine learning implementations.

```bash
# Install via wshobson kit
~/leamas/leamas agent@wshobson
```
</details>

<details>
<summary><strong>quant-analyst</strong> — Quantitative and financial analysis</summary>

**Model:** Sonnet
**Use Case:** Quantitative and financial analysis

Provides quantitative analysis and financial modeling expertise.

```bash
# Install via wshobson kit
~/leamas/leamas agent@wshobson
```
</details>

<details>
<summary><strong>python-pro</strong> — Python development and data analysis</summary>

**Model:** Sonnet
**Use Case:** Python development and data analysis

Python specialist for data analysis, scripting, automation, and Python-specific best practices.

```bash
# Install via wshobson kit
~/leamas/leamas agent@wshobson
```
</details>

<details>
<summary><strong>database-admin</strong> — Database setup, configuration, and management</summary>

**Model:** Sonnet
**Use Case:** Database setup, configuration, and management

Manages database administration, setup, and ongoing maintenance.

```bash
# Install via wshobson kit
~/leamas/leamas agent@wshobson
```
</details>

<details>
<summary><strong>database-optimizer</strong> — Query optimization and database performance</summary>

**Model:** Sonnet
**Use Case:** Query optimization and database performance

Optimizes database queries and overall database performance.

```bash
# Install via wshobson kit
~/leamas/leamas agent@wshobson
```
</details>

<details>
<summary><strong>payment-integration</strong> — Implementing payment systems</summary>

**Model:** Sonnet
**Use Case:** Implementing payment systems

Specializes in integrating payment systems like Stripe, PayPal, and other payment processors. Handles payment workflows and security considerations.

```bash
# Install via wshobson kit
~/leamas/leamas agent@wshobson
```
</details>

#### Plugins

##### git@claude-code-plugins

**Status:** ENABLED
**Use Case:** Git version control workflows

Provides helpers and workflow improvements for Git operations.

```bash
# Enable in ~/.claude/settings.json
# Add: "git@claude-code-plugins": true
```

##### commit-commands@claude-code-plugins

**Status:** ENABLED
**Use Case:** Better commit processes

Enhances commit workflows with helpers and improved commit message handling.

```bash
# Enable in ~/.claude/settings.json
# Add: "commit-commands@claude-code-plugins": true
```

#### User-Created Skills

##### article-extractor

**Triggers:** User provides article URL

Extracts clean article content from URLs without ads, navigation, sidebars, or other clutter. Returns just the readable text from blog posts, articles, and tutorials.

##### ship-learn-next

**Use Case:** Turning learning into action

Transforms learning content (videos, articles, tutorials) into actionable implementation plans. Converts advice and lessons into concrete action steps, practice reps, and learning quests.

##### tapestry

**Triggers:** `tapestry <URL>`, `weave <URL>`, `make this actionable <URL>`

Automatically detects content type (YouTube video, article, PDF), extracts the content, and creates an action plan—all in one step. Your unified workflow for extracting and planning from any learning material.

##### youtube-transcript

**Triggers:** User provides YouTube URL

Downloads transcripts and captions from YouTube videos for analysis, summarization, or content extraction.

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

**Recently Removed (18 tools):** react-pro, mobile-developer, javascript-pro, debugger, security-auditor, 4 business agents, 4 duplicate data agents, content-writer
