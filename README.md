```
 __      ___ _              _______ _                 _         _____          _      
 \ \    / (_) |            / / ____| |               | |       / ____|        | |     
  \ \  / / _| |__   ___   / / |    | | __ _ _   _  __| | ___  | |     ___   __| | ___ 
   \ \/ / | | '_ \ / _ \ / /| |    | |/ _` | | | |/ _` |/ _ \ | |    / _ \ / _` |/ _ \
    \  /  | | |_) |  __// / | |____| | (_| | |_| | (_| |  __/ | |___| (_) | (_| |  __/
     \/   |_|_.__/ \___/_/   \_____|_|\__,_|\__,_|\__,_|\___|  \_____\___/ \__,_|\___|

 ```                                                                                                                                                            
                                                                                                                                                             



[![Agents](https://img.shields.io/badge/agents-19-blue)](#agents)
[![Plugins](https://img.shields.io/badge/plugins-11-green)](#plugins)
[![Skills](https://img.shields.io/badge/skills-21-orange)](#plugins)
[![MCPs](https://img.shields.io/badge/MCPs-1-purple)](#mcps)


# Vibe Coding Claude Code Setup: 
Focused on orchestration, UI/UX design, content development, prototyping, and efficient workflows for **vibe coding**.

---

## 🧭 Table of Contents

- [Overview](#vibe-coding-claude-code-setup)
- [How Claude Code Works](#how-claude-code-works)
- [Example: How Tools Work Together](#example-how-tools-work-together)
- [Installation](#installation)
- [Agents](#agents)
- [Plugins](#plugins-marketplaces-for-skills)
- [MCPs](#mcps)
- [Configuration](#configuration)
- [Quick Start (15 Minutes)](#quick-start-15-minutes)

---

## 🧩 How Claude Code Works

```text
╔═══════════════════════════════════════════════════════════════════════╗
║                       CLAUDE CODE ECOSYSTEM                           ║
╚═══════════════════════════════════════════════════════════════════════╝


┌─────────────────────────────────────────────────────────────────────┐
│  MARKETPLACE FLOW                                                   │
└─────────────────────────────────────────────────────────────────────┘

    🏪 MARKETPLACE
       │
       │  Collection of related plugins
       │  Examples: superpowers-marketplace, claude-code-workflows
       │
       ▼
    🔧 PLUGIN
       │
       │  Bundle of skills (or agents in SEO case)
       │  Enabled in: ~/.claude/settings.json
       │  Format: "plugin-name@marketplace-name"
       │
       ▼
    ⚡ SKILL
       │
       │  Workflow framework that guides how Claude works
       │  Auto-triggers OR slash commands
       │
       └──┬─► brainstorming → Socratic questioning before design
          ├─► test-driven-development → Write tests first
          └─► requesting-code-review → Spawn code-reviewer


┌─────────────────────────────────────────────────────────────────────┐
│  AGENT KIT FLOW                                                     │
└─────────────────────────────────────────────────────────────────────┘

    📦 AGENT KIT
       │
       │  Installed via CLI (I use Leamas)
       │  Command: ~/leamas/leamas agent@kit-name
       │
       ▼
    🤖 AGENT
       │
       │  Fresh Claude instance with domain expertise
       │  Auto-invoked OR called via Task()
       │
       └──┬─► frontend-developer → Builds React components
          ├─► ui-designer → Creates design systems
          └─► code-reviewer → Reviews code quality


┌─────────────────────────────────────────────────────────────────────┐
│  MCP FLOW                                                           │
└─────────────────────────────────────────────────────────────────────┘

    🔌 MCP SERVER
       │
       │  External service (NOT AI)
       │  Configured in: claude_desktop_config.json
       │
       ▼
    🛠️  TOOL/CAPABILITY
       │
       │  Claude queries these for enhanced capabilities
       │
       └──┬─► sequential-thinking → Step-by-step reasoning
          └─► playwright → Browser automation
```

---

## 💡 Example: How Tools Work Together

```text
USER: "Build a peptide protocols dashboard from this research article"
  │
  ▼ Claude analyzes → Identifies: content extraction, data viz, health tracking
  │
  ├─ ⚡ tapestry
  │  └─ Extract article content + create action plan
  │
  ├─ ⚡ brainstorming
  │  └─ Questions: Track protocols? Dosage calculator? Timeline view?
  │
  ├─ Parallel agent execution ────────────────────────────────────────────────┐
  │                                                                           │
  │  ┌─────────────────────┐  ┌───────────────────────┐  ┌──────────────────┐ │
  │  │ ui-designer         │  │ frontend-developer    │  │   vibe-coding    | │
  │  │                     │  │                       │  │    coach         │ │
  │  │  Design protocol    │  │  Build React          │  │                  │ │
  │  │  cards + data viz   │  │  dashboard            │  │  Guide vision →  │ │
  │  │                     │  │  (TypeScript +        │  │  implementation  │ │
  │  │                     │  │   Tailwind)           │  │                  │ │
  │  └─────────────────────┘  └────────────────────── ┘  └──────────────────┘ │
  │                                                                           │
  └───────────────────────────────────────────────────────────────────────────┘
  │
  ├─ ⚡ design-with-precision
  │  └─ OCD-level audit: Typography scale, 4px grid, contrast ratios (7:1 AAA)
  │     ✗ "Card padding 13px → Must be 12px or 16px (--space-3 or --space-4)"
  │     ✗ "H5 usage forbidden → Restructure to H4 max depth"
  │     Score: 7.2/10 → Provide exact fixes with system values
  │
  ├─ ⚡ requesting-code-review
  │  └─ Spawn code-reviewer agent: Check accessibility, performance
  │
  ├─ ⚡ verification-before-completion
  │  └─ Run build: types✓ lint✓ visual regression✓
  │
  ✅ Pixel-perfect dashboard ready to deploy
```




## Installation

### How to Install Agents

I use **Leamas** to install agent kits. Each kit bundles multiple related agents.

```bash
# Install Leamas (if not already installed)
# Visit: https://leamas.sh/

# Install agent kits I use:
~/leamas/leamas agent@claude-code-sub-agents  # 6 development agents
~/leamas/leamas agent@wshobson                # 10 vibe coding + utility agents
```

**Available Agent Kits:**
- `claude-code-sub-agents` — 6 agents (ui-designer, ux-designer, frontend-developer, ios-developer, code-reviewer, prompt-engineer)
- `wshobson` — 10 agents (agent-organizer, vibe-coding-coach, context-manager, nextjs-pro, data-scientist, quant-analyst, python-pro, database-admin, database-optimizer, payment-integration)



  
### How to Get Plugin Marketplaces

Plugins come from **marketplaces** — collections of related plugins:

1. **[Superpowers Marketplace](https://github.com/Ejb503/multiverse-of-multiagents)**
   - Community-driven framework for systematic development workflows
   - Contains: superpowers plugin, elements-of-style plugin

2. **[Claude Code Workflows](https://github.com/anthropics/claude-code-workflows)**
   - Official Anthropic workflows for specialized tasks
   - Contains: javascript-typescript, frontend-mobile-development, code-documentation, SEO plugins (3 total)

3. **[Claude Code Plugins](https://github.com/anthropics/claude-code-plugins)**
   - Core utilities and integrations
   - Contains: git, commit-commands

4. **[Claude Mem by thedotmack](https://github.com/thedotmack/claude-mem)**
   - Persistent memory system using SQLite
   - Standalone plugin with MCP integration



---

# Agents

Agents are installed to: `~/.claude/agents/leamas/{kit-name}/`


---

### 🧠 Agent Organizer

```yaml
---
name: agent-organizer
description: Coordinates multiple agents working together on complex workflows
works-with: all agents
use-when: Running complex multi-agent workflows
kit: wshobson
---
# Key Capabilities:
# - Acts as your AI project manager
# - Tracks which agents handle what
# - Ensures work doesn't overlap
```

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```



---

### 🎯 Vibe Coding Coach

```yaml
---
name: vibe-coding-coach
description: Your friendly coding mentor with personality
works-with: all development agents
kit: wshobson
---
# Key Capabilities:
# - Provides guidance while you code
# - Explains concepts in approachable ways
# - Helps improve your skills conversationally
```

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```



---

### 📦 Context Manager

```yaml
---
name: context-manager
description: Optimizes how context is used across conversations
use-when: Working on large codebases or long sessions
kit: wshobson
---
# Key Capabilities:
# - Maximizes available context windows
# - Ensures important information is preserved when needed
# - Prevents context overflow
```

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```



---

### 🎨 Prompt Engineer

```yaml
---
name: prompt-engineer
description: Expert prompt architect using Opus model for maximum reasoning
use-when: Building AI features or optimizing prompts
kit: claude-code-sub-agents
---
# Key Capabilities:
# - Specializes in Chain-of-Thought and Tree-of-Thoughts techniques
# - Essential when building AI features
# - Optimizes prompts for LLM performance
```

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```



---

### 🎨 UI Designer

```yaml
---
name: ui-designer
description: Creates design systems and visual interfaces with WCAG accessibility
requires: magic MCP, context7 MCP
works-with: frontend-developer, ux-designer
kit: claude-code-sub-agents
---
# Key Capabilities:
# - Color palettes, typography, spacing systems
# - Component libraries
# - WCAG accessibility compliance
```

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```



---

### 👤 UX Designer

```yaml
---
name: ux-designer
description: Conducts user research, creates journey maps, and designs usability tests
requires: context7 MCP, sequential-thinking MCP, playwright MCP
works-with: ui-designer, frontend-developer
kit: claude-code-sub-agents
---
# Key Capabilities:
# - User flows, pain points, and interaction patterns
# - Wireframes and prototypes
# - Design validation with users
```

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```



---

### ⚛️ Frontend Developer

```yaml
---
name: frontend-developer
description: Builds production-ready React components with TypeScript and Tailwind
requires: magic MCP, context7 MCP, playwright MCP
works-with: ui-designer, code-reviewer, nextjs-pro
kit: claude-code-sub-agents
---
# Key Capabilities:
# - State management, hooks, responsive design
# - Accessibility best practices
# - Testing with React Testing Library
```

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```



---

### 📱 iOS Developer

```yaml
---
name: ios-developer
description: Native iOS development using Swift, SwiftUI, and UIKit
works-with: ui-designer
kit: claude-code-sub-agents
---
# Key Capabilities:
# - iOS-specific patterns and navigation
# - Platform conventions
# - App Store optimization
```

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```



---

### 👁️ Code Reviewer

```yaml
---
name: code-reviewer
description: Reviews code for quality, security, performance, and maintainability
requires: context7 MCP, sequential-thinking MCP
works-with: all development agents
kit: claude-code-sub-agents
---
# Key Capabilities:
# - Actionable feedback with line-by-line suggestions
# - Security vulnerability detection
# - Best practices enforcement
```

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```



---

### ⚡ Next.js Pro

```yaml
---
name: nextjs-pro
description: Next.js specialist covering SSR, SSG, routing, and Next.js patterns
works-with: frontend-developer
kit: wshobson
---
# Key Capabilities:
# - App Router, Server Components
# - Deployment best practices
# - Performance optimization
```

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

### 📊 Data Scientist

```yaml
---
name: data-scientist
description: Handles data analysis, statistical modeling, SQL queries, BigQuery operations
works-with: python-pro, database-optimizer
kit: wshobson
---
# Key Capabilities:
# - Machine learning implementations
# - Data transformation or analysis
# - Statistical analysis
```

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```


---

### 📈 Quant Analyst

```yaml
---
name: quant-analyst
description: Quantitative analysis and financial modeling
kit: wshobson
---
# Key Capabilities:
# - Statistical analysis
# - Risk modeling
# - Financial calculations
```

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```


---

### 🐍 Python Pro

```yaml
---
name: python-pro
description: Python development specialist
works-with: data-scientist
kit: wshobson
---
# Key Capabilities:
# - Data analysis, scripting, automation
# - Python-specific best practices
# - Knows pandas, numpy, requests
```

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

### 🗄️ Database Admin

```yaml
---
name: database-admin
description: Database setup, configuration, and ongoing management
works-with: database-optimizer
kit: wshobson
---
# Key Capabilities:
# - Schema design, migrations, backups
# - Database administration tasks
```

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```


---

### ⚡ Database Optimizer

```yaml
---
name: database-optimizer
description: Optimizes database queries and overall database performance
works-with: database-admin, data-scientist
kit: wshobson
---
# Key Capabilities:
# - Analyzes slow queries
# - Suggests indexes
# - Improves database efficiency
```

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

# Plugins: Marketplaces for Skills

To find plugins and their associated skills, type /plugins into Claude Code

```yaml
/plugins
 1. Command Recognition:  Claude Code detects the /plugins slash command
 2. Marketplace Loading:  The system reads ~/.claude/settings.json to see which plugins are enabled
 3. Plugin Discovery: Scans ~/.claude/plugins/marketplaces/ directories for installed plugin definitions
 4. Activation — Each enabled plugin's manifest is loaded, which contains:
    - Skills (workflow instructions)
    - Agents (specialized AI definitions)
    - Slash commands (custom commands)
    - MCP integrations (if any)
  5. Context Injection: Skills become available for auto-triggering or manual invocation
  6. Agent Registration: Agents become available via Task({ subagent_type: "agent-name" })
  7. Command Registration: Slash commands become available in the command palette
```

## How to Enable Plugins:
Edit `~/.claude/settings.json` and add plugins to `enabledPlugins`:

```json
{
  "enabledPlugins": {
    "superpowers@superpowers-marketplace": true,
    "claude-mem@thedotmack": true,
    "javascript-typescript@claude-code-workflows": true,
    "seo-content-creation@claude-code-workflows": true,
    "git@claude-code-plugins": true
  }
}
```

Plugin Locations:
- Installed to: `~/.claude/plugins/marketplaces/{marketplace-name}/{plugin-name}/`
- Settings: `~/.claude/settings.json`

---


---

### Superpowers

```jsonc
{
  "enabledPlugins": {
    "superpowers@superpowers-marketplace": true
  }
}
// Foundation of vibe coding with 10 systematic development skills
// Skills:
// - using-superpowers
// - brainstorming
// - writing-plans
// - executing-plans
// - subagent-driven-development
// - dispatching-parallel-agents
// - writing-skills
// - testing-skills-with-subagents
// - sharing-skills
// Repository: https://github.com/Ejb503/multiverse-of-multiagents
```

---

### Claude Mem

```jsonc
{
  "enabledPlugins": {
    "claude-mem@thedotmack": true
  }
}
// Persistent memory system using SQLite with full-text search
// Key Capabilities:
// - Provides 6 MCP search tools for querying stored knowledge
// - Automatically captures work, processes into summaries
// - Injects relevant context in future sessions
// Repository: https://github.com/thedotmack/claude-mem
```

---

### JavaScript TypeScript

```jsonc
{
  "enabledPlugins": {
    "javascript-typescript@claude-code-workflows": true
  }
}
// 4 skills covering modern JS patterns and TypeScript
// Skills:
// - modern-javascript-patterns
// - javascript-testing-patterns
// - nodejs-backend-patterns
// - typescript-advanced-types
```

---

### Frontend Mobile Development

```jsonc
{
  "enabledPlugins": {
    "frontend-mobile-development@claude-code-workflows": true
  }
}
// 2 skills for building React and mobile apps
// Skills:
// - frontend-developer
// - mobile-developer
```

---

### Code Documentation

```jsonc
{
  "enabledPlugins": {
    "code-documentation@claude-code-workflows": true
  }
}
// 3 skills covering code review and documentation
// Skills:
// - code-reviewer
// - docs-architect
// - tutorial-engineer
```

---

### SEO Content Creation

```jsonc
{
  "enabledPlugins": {
    "seo-content-creation@claude-code-workflows": true
  }
}
// Content writing optimized for search engines with E-E-A-T signals
// Agents:
// - seo-content-writer
// - seo-content-planner
// - seo-content-auditor
```

---

### SEO Technical Optimization

```jsonc
{
  "enabledPlugins": {
    "seo-technical-optimization@claude-code-workflows": true
  }
}
// Technical SEO optimization covering keywords, meta tags, snippets
// Agents:
// - seo-keyword-strategist
// - seo-meta-optimizer
// - seo-snippet-hunter
// - seo-structure-architect
```

---

### SEO Analysis Monitoring

```jsonc
{
  "enabledPlugins": {
    "seo-analysis-monitoring@claude-code-workflows": true
  }
}
// SEO analysis and monitoring for authority building
// Agents:
// - seo-authority-builder
// - seo-content-refresher
// - seo-cannibalization-detector
```

---

### Elements of Style

```jsonc
{
  "enabledPlugins": {
    "elements-of-style@superpowers-marketplace": true
  }
}
// Applies Strunk & White's timeless writing principles
// Skills:
// - writing-clearly-and-concisely
// Works on: documentation, commit messages, error messages
```

---

### Git

```jsonc
{
  "enabledPlugins": {
    "git@claude-code-plugins": true
  }
}
// 4 slash commands for Git operations
// Commands:
// - /git:commit-push
// - /git:compact-commits
// - /git:create-worktree
// - /git:rebase-pr
```

---

### Commit Commands

```jsonc
{
  "enabledPlugins": {
    "commit-commands@claude-code-plugins": true
  }
}
// Enhanced Git commit workflows with automated conventions
// Key Capabilities:
// - Improves commit message formatting
// - Conventional commit support
```

# MCPs

### 🔌 Sequential Thinking

```yaml
---
name: sequential-thinking
description: Step-by-step reasoning for complex problems
used-by: All agents and workflows
documentation: https://github.com/modelcontextprotocol/servers/tree/main/src/sequential-thinking
---
# Key Capabilities:
# - Claude invokes this when thinking through multi-step solutions
# - Structured reasoning framework
# - Helps with complex debugging and planning
```

```jsonc
# Add to ~/Library/Application Support/Claude/claude_desktop_config.json:
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


## Configuration

### File Locations

```
Agents       ~/.claude/agents/leamas/
Settings     ~/.claude/settings.json
MCP Config   ~/Library/Application Support/Claude/claude_desktop_config.json
Skills       ~/.claude/skills/
Plugins      ~/.claude/plugins/marketplaces/
Claude-Mem   ${CLAUDE_PLUGIN_ROOT}/data/
```

---

## Quick Start (15 Minutes)

```bash
# ============================================================================
# QUICK START (15 Minutes)
# ============================================================================

# Step 1: Prerequisites (2 min)
# Verify you have the basics
node --version  # Need 18+
git --version

# Step 2: Install Essentials (8 min)

# 2a. superpowers - Core workflow skills (TDD, code review, planning)
# 2b. claude-mem - Persistent memory across sessions
# Add to ~/.claude/settings.json:
{
  "enabledPlugins": {
    "superpowers@superpowers-marketplace": true,
    "claude-mem@thedotmack": true
  }
}

# 2c. sequential-thinking - Structured reasoning for complex problems
# Add to ~/Library/Application Support/Claude/claude_desktop_config.json:
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}

# Step 3: Verify (2 min)
# Restart Claude Desktop, then verify:
cat ~/.claude/settings.json | grep enabledPlugins
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Step 4: Try It (3 min)
# Ask Claude: "Use brainstorming to help me design a navbar component"
# ✅ Expected: Claude invokes brainstorming skill and asks Socratic questions
```

---
