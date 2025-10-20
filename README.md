[![Agents](https://img.shields.io/badge/agents-19-blue)](#-vibe-coding)
[![Plugins](https://img.shields.io/badge/plugins-11-green)](#-content--marketing)
[![Skills](https://img.shields.io/badge/skills-21-orange)](#-vibe-coding)
[![MCPs](https://img.shields.io/badge/MCPs-1-purple)](#-vibe-coding)

# Claude Code Setup

**Optimized for vibe coding** — Describe what you want, AI handles implementation. Uses 62 specialized tools (agents, skills, plugins, MCPs) organized by what you're building, not where they came from.

---

## How Claude Code Works

```
┌─────────────────────────────────────────────────────────────┐
│                    CLAUDE CODE ECOSYSTEM                    │
└─────────────────────────────────────────────────────────────┘


MARKETPLACE FLOW
────────────────

🏪 MARKETPLACE
   │  Collection of related plugins
   │  Examples: superpowers-marketplace, claude-code-workflows
   ↓
🔧 PLUGIN
   │  Bundle of skills (or agents in SEO case)
   │  Enabled in: ~/.claude/settings.json
   │  Format: "plugin-name@marketplace-name"
   ↓
⚡ SKILL
   │  Workflow framework that guides how Claude works
   │  Auto-triggers OR slash commands
   │
   Examples:
   • brainstorming → Socratic questioning before design
   • test-driven-development → Write tests first
   • requesting-code-review → Spawn code-reviewer


AGENT KIT FLOW
───────────────

📦 AGENT KIT
   │  Installed via CLI (I use Leamas)
   │  Command: ~/leamas/leamas agent@kit-name
   ↓
🤖 AGENT
   │  Fresh Claude instance with domain expertise
   │  Auto-invoked OR called via Task()
   │
   Examples:
   • frontend-developer → Builds React components
   • ui-designer → Creates design systems
   • code-reviewer → Reviews code quality
   • database-optimizer → Optimizes SQL queries


MCP FLOW
────────

🔌 MCP SERVER
   │  External service (NOT AI)
   │  Configured in: claude_desktop_config.json
   ↓
🛠️ TOOL/CAPABILITY
   │  Claude queries these for enhanced capabilities
   │
   Examples:
   • sequential-thinking → Step-by-step reasoning
   • magic → Component building assistance
   • playwright → Browser automation
```

---

## Example: How Tools Work Together

```
USER: "Add authentication to my app"
  │
  ▼ Claude analyzes → Identifies: auth, OAuth, sessions
  │
  ├─ ⚡ brainstorming
  │  └─ Socratic questions: OAuth providers? Password reset? Sessions?
  │
  ├─ ⚡ test-driven-development
  │  └─ Write failing tests: login✗ logout✗ OAuth✗
  │
  ├─ Parallel execution ────────────────────────────────────────────┐
  │  🤖 frontend-developer    🤖 database-admin      🔌 context7     │
  │  Build login UI           Create users table    Lookup Auth0/   │
  │  (React + TypeScript)     (email, oauth_provider, sessions)     │
  │                                                  Supabase docs   │
  │
  ├─ ⚡ requesting-code-review
  │  └─ Spawn code-reviewer agent: Check SQL injection, auth bypass
  │
  ├─ ⚡ verification-before-completion
  │  └─ Run tests: login✓ logout✓ OAuth✓
  │
  ✅ Feature complete & secure
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

## 🎨 Vibe Coding

Agents, skills, and tools for AI-assisted development workflows

### Agents

## 🧠 Agent Organizer ★★

```yaml
---
name: agent-organizer
description: Coordinates multiple agents working together on complex workflows
works-with: all agents
use-when: Running complex multi-agent workflows
---
```

**Key Capabilities:**
- Acts as your AI project manager
- Tracks which agents handle what
- Ensures work doesn't overlap

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

## 🎯 Vibe Coding Coach ★★★

```yaml
---
name: vibe-coding-coach
description: Your friendly coding mentor with personality
works-with: all development agents
---
```

**Key Capabilities:**
- Provides guidance while you code
- Explains concepts in approachable ways
- Helps improve your skills conversationally

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

## 📦 Context Manager ★★

```yaml
---
name: context-manager
description: Optimizes how context is used across conversations
use-when: Working on large codebases or long sessions
---
```

**Key Capabilities:**
- Maximizes available context windows
- Ensures important information is preserved when needed
- Prevents context overflow

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

## 🎨 Prompt Engineer ★★

```yaml
---
name: prompt-engineer
description: Expert prompt architect using Opus model for maximum reasoning
use-when: Building AI features or optimizing prompts
---
```

**Key Capabilities:**
- Specializes in Chain-of-Thought and Tree-of-Thoughts techniques
- Essential when building AI features
- Optimizes prompts for LLM performance

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```

---

### Plugins

## 🔧 Superpowers ★★★

```yaml
---
name: superpowers@superpowers-marketplace
description: Foundation of vibe coding with 10 systematic development skills
contains: 10 skills (listed below)
repository: https://github.com/Ejb503/multiverse-of-multiagents
---
```

**Key Capabilities:**
- Enforces best practices like TDD and code review
- Ensures you use existing approaches before inventing new ones
- Guides systematic development workflows

```bash
# Enable in ~/.claude/settings.json:
"superpowers@superpowers-marketplace": true
```

---

## 🧠 Claude Mem ★★★

```yaml
---
name: claude-mem@thedotmack
description: Persistent memory system using SQLite with full-text search
provides: 6 MCP search tools for querying stored knowledge
repository: https://github.com/thedotmack/claude-mem
---
```

**Key Capabilities:**
- Automatically captures your work
- Processes it into summaries
- Injects relevant context in future sessions
- No manual saving needed

```bash
# Enable in ~/.claude/settings.json:
"claude-mem@thedotmack": true
```

---

### Skills (from superpowers plugin)

## ⚡ Using Superpowers ★★★

```yaml
---
name: using-superpowers
description: Mandatory starting point for any task
auto-triggers: Start of every conversation
---
```

**Key Capabilities:**
- Forces you to search for existing skills before doing work
- Prevents reinventing the wheel
- Ensures best practices are followed

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

## 💭 Brainstorming ★★★

```yaml
---
name: brainstorming
description: Refines ideas using Socratic method questioning
auto-triggers: When starting design work
manual-invoke: /superpowers:brainstorm
---
```

**Key Capabilities:**
- Clarifies requirements before planning
- Explores alternatives
- Validates design incrementally

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

## 📋 Writing Plans ★★★

```yaml
---
name: writing-plans
description: Creates detailed implementation plans
manual-invoke: /superpowers:write-plan
works-with: executing-plans, subagent-driven-development
---
```

**Key Capabilities:**
- Breaks work into discrete, independent tasks
- Provides exact file paths and code examples
- Assumes engineer has zero codebase context

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

## ▶️ Executing Plans ★★★

```yaml
---
name: executing-plans
description: Executes plans in batches with review checkpoints
manual-invoke: /superpowers:execute-plan
works-with: writing-plans
---
```

**Key Capabilities:**
- Loads plan and reviews critically
- Executes tasks in batches
- Reports for review between batches

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

## 🤖 Subagent Driven Development ★★★

```yaml
---
name: subagent-driven-development
description: Dispatches fresh subagents to handle individual tasks from your plan
auto-triggers: When executing implementation plans
works-with: writing-plans, requesting-code-review
---
```

**Key Capabilities:**
- Each task gets a code review before moving to next
- Fast iteration with quality gates
- Independent task execution

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

## ⚡ Dispatching Parallel Agents ★★

```yaml
---
name: dispatching-parallel-agents
description: Launches multiple agents simultaneously for independent failures
auto-triggers: When facing 3+ independent failures
---
```

**Key Capabilities:**
- Investigates 3+ independent problems concurrently
- Each agent works without shared state
- Faster debugging

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

## 👀 Requesting Code Review ★★★

```yaml
---
name: requesting-code-review
description: Dispatches code-reviewer subagent to review implementation
auto-triggers: When completing tasks
works-with: code-reviewer agent
---
```

**Key Capabilities:**
- Reviews implementation against plan or requirements
- Catches issues before merging
- Provides actionable feedback

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

## ✅ Verification Before Completion ★★★

```yaml
---
name: verification-before-completion
description: Runs verification commands and confirms output before claiming success
auto-triggers: Before claiming completion
use-when: About to commit or create PRs
---
```

**Key Capabilities:**
- Evidence before assertions always
- Prevents claiming work is done without proof
- Runs tests and confirms passing

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

## 📝 Writing Skills ★

```yaml
---
name: writing-skills
description: Creates bulletproof Claude skills using TDD methodology
use-when: Creating new skills
---
```

**Key Capabilities:**
- Tests skills with subagents first to find gaps
- Writes instructions that close those gaps
- Applies TDD to process documentation

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

## 🧪 Testing Skills with Subagents ★

```yaml
---
name: testing-skills-with-subagents
description: Validates that skills resist AI rationalization
use-when: Verifying skills work before deployment
---
```

**Key Capabilities:**
- Runs skills through actual subagent sessions
- Uses RED-GREEN-REFACTOR cycle
- Ensures skills work under pressure

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

## 🤝 Sharing Skills ★

```yaml
---
name: sharing-skills
description: Helps contribute skills back to the community via pull requests
use-when: Contributing skills to community
---
```

**Key Capabilities:**
- Guides process of branching, committing, pushing
- Creates PR to contribute skills upstream
- Ensures proper formatting

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

### MCPs

## 🔌 Sequential Thinking ★★★

```yaml
---
name: sequential-thinking
description: Step-by-step reasoning for complex problems
used-by: All agents and workflows
documentation: https://github.com/modelcontextprotocol/servers/tree/main/src/sequential-thinking
---
```

**Key Capabilities:**
- Claude invokes this when thinking through multi-step solutions
- Structured reasoning framework
- Helps with complex debugging and planning

```bash
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

## ⚙️ Development

Design, frontend, Next.js, code review

### Agents

## 🎨 UI Designer ★★★

```yaml
---
name: ui-designer
description: Creates design systems and visual interfaces with WCAG accessibility
requires: magic MCP, context7 MCP
works-with: frontend-developer, ux-designer
---
```

**Key Capabilities:**
- Color palettes, typography, spacing systems
- Component libraries
- WCAG accessibility compliance

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```

---

## 👤 UX Designer ★★★

```yaml
---
name: ux-designer
description: Conducts user research, creates journey maps, and designs usability tests
requires: context7 MCP, sequential-thinking MCP, playwright MCP
works-with: ui-designer, frontend-developer
---
```

**Key Capabilities:**
- User flows, pain points, and interaction patterns
- Wireframes and prototypes
- Design validation with users

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```

---

## ⚛️ Frontend Developer ★★★

```yaml
---
name: frontend-developer
description: Builds production-ready React components with TypeScript and Tailwind
requires: magic MCP, context7 MCP, playwright MCP
works-with: ui-designer, code-reviewer, nextjs-pro
---
```

**Key Capabilities:**
- State management, hooks, responsive design
- Accessibility best practices
- Testing with React Testing Library

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```

---

## 📱 iOS Developer ★★

```yaml
---
name: ios-developer
description: Native iOS development using Swift, SwiftUI, and UIKit
works-with: ui-designer
---
```

**Key Capabilities:**
- iOS-specific patterns and navigation
- Platform conventions
- App Store optimization

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```

---

## 👁️ Code Reviewer ★★★

```yaml
---
name: code-reviewer
description: Reviews code for quality, security, performance, and maintainability
requires: context7 MCP, sequential-thinking MCP
works-with: all development agents
---
```

**Key Capabilities:**
- Actionable feedback with line-by-line suggestions
- Security vulnerability detection
- Best practices enforcement

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```

---

## ⚡ Next.js Pro ★★

```yaml
---
name: nextjs-pro
description: Next.js specialist covering SSR, SSG, routing, and Next.js patterns
works-with: frontend-developer
---
```

**Key Capabilities:**
- App Router, Server Components
- Deployment best practices
- Performance optimization

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

### Plugins

## 🔧 JavaScript TypeScript ★★

```yaml
---
name: javascript-typescript@claude-code-workflows
description: 4 skills covering modern JS patterns and TypeScript
contains: 4 skills
---
```

**Key Capabilities:**
- Modern JS patterns, testing approaches
- Node.js backend development
- TypeScript type system usage

```bash
# Enable in ~/.claude/settings.json:
"javascript-typescript@claude-code-workflows": true
```

---

## 🔧 Frontend Mobile Development ★★

```yaml
---
name: frontend-mobile-development@claude-code-workflows
description: 2 skills for building React and mobile apps
contains: 2 skills
---
```

**Key Capabilities:**
- Building React components
- Mobile apps with React Native or Flutter

```bash
# Enable in ~/.claude/settings.json:
"frontend-mobile-development@claude-code-workflows": true
```

---

## 🔧 Code Documentation ★★

```yaml
---
name: code-documentation@claude-code-workflows
description: 3 skills covering code review and documentation
contains: 3 skills
---
```

**Key Capabilities:**
- Code review processes
- Architecture documentation
- Step-by-step tutorial creation

```bash
# Enable in ~/.claude/settings.json:
"code-documentation@claude-code-workflows": true
```

---

## 📝 Content & Marketing

SEO content, technical optimization, writing

### Plugins with Agents

## 🔧 SEO Content Creation ★★★

```yaml
---
name: seo-content-creation@claude-code-workflows
description: Content writing optimized for search engines with E-E-A-T signals
contains: 3 SEO agents (seo-content-writer, seo-content-planner, seo-content-auditor)
---
```

```bash
# Enable in ~/.claude/settings.json:
"seo-content-creation@claude-code-workflows": true
```

**Agents in this plugin:**

## 📰 SEO Content Writer ★★★

```yaml
---
name: seo-content-writer
description: Writes E-E-A-T optimized articles with proper keyword density
model: Sonnet (high-quality long-form content)
---
```

**Key Capabilities:**
- 0.5-1.5% keyword density
- Structures content for readability and ranking

---

## 📅 SEO Content Planner ★★

```yaml
---
name: seo-content-planner
description: Creates content calendars, topic clusters, and search intent mappings
model: Haiku (fast planning)
---
```

**Key Capabilities:**
- Plans content strategy
- Topic clustering and search intent mapping

---

## 📊 SEO Content Auditor ★★

```yaml
---
name: seo-content-auditor
description: Scores content quality 1-10 and provides improvement recommendations
model: Sonnet (thorough analysis)
---
```

**Key Capabilities:**
- Actionable improvement recommendations
- Quality scoring system

---

## 🔧 SEO Technical Optimization ★★★

```yaml
---
name: seo-technical-optimization@claude-code-workflows
description: Technical SEO optimization covering keywords, meta tags, featured snippets
contains: 4 SEO agents
---
```

```bash
# Enable in ~/.claude/settings.json:
"seo-technical-optimization@claude-code-workflows": true
```

**Agents in this plugin:**

## 🔑 SEO Keyword Strategist ★★★

```yaml
---
name: seo-keyword-strategist
description: Analyzes keyword density and generates LSI keyword variations
model: Haiku (quick analysis)
---
```

**Key Capabilities:**
- Generates 20-30 LSI variations
- Maps entities and related concepts

---

## 🏷️ SEO Meta Optimizer ★★★

```yaml
---
name: seo-meta-optimizer
description: Creates optimized meta titles, descriptions, and URLs
model: Haiku (speed)
---
```

**Key Capabilities:**
- Respects character limits
- Provides 3-5 A/B testing variations

---

## 🎯 SEO Snippet Hunter ★★

```yaml
---
name: seo-snippet-hunter
description: Formats content for featured snippets (position zero)
model: Haiku (efficient formatting)
---
```

**Key Capabilities:**
- Creates paragraph snippets, list formats
- Table structures with schema markup

---

## 🏗️ SEO Structure Architect ★★

```yaml
---
name: seo-structure-architect
description: Optimizes header hierarchy and implements schema markup
model: Haiku (structural analysis)
---
```

**Key Capabilities:**
- H1-H6 structure optimization
- Schema markup (Article, FAQ, HowTo, Review)
- Internal linking opportunities

---

## 🔧 SEO Analysis Monitoring ★★

```yaml
---
name: seo-analysis-monitoring@claude-code-workflows
description: SEO analysis and monitoring for authority building and content freshness
contains: 3 SEO agents
---
```

```bash
# Enable in ~/.claude/settings.json:
"seo-analysis-monitoring@claude-code-workflows": true
```

**Agents in this plugin:**

## 🏆 SEO Authority Builder ★★

```yaml
---
name: seo-authority-builder
description: Analyzes content for E-E-A-T signals
model: Sonnet (comprehensive analysis)
---
```

**Key Capabilities:**
- Enhancement plans with author bio templates
- Trust signal checklists

---

## 🔄 SEO Content Refresher ★★

```yaml
---
name: seo-content-refresher
description: Scans content for outdated elements
model: Haiku (fast scanning)
---
```

**Key Capabilities:**
- Identifies statistics, dates, examples needing updates
- Prioritizes updates based on ranking decline

---

## ⚠️ SEO Cannibalization Detector ★

```yaml
---
name: seo-cannibalization-detector
description: Identifies when multiple pages compete for same keywords
model: Haiku (efficient comparison)
---
```

**Key Capabilities:**
- Provides resolution strategies
- Consolidate pages, differentiate targeting, or adjust focus

---

### Plugins with Skills

## 🔧 Elements of Style ★★

```yaml
---
name: elements-of-style@superpowers-marketplace
description: Applies Strunk & White's timeless writing principles
contains: 1 skill (writing-clearly-and-concisely)
---
```

**Key Capabilities:**
- Clear, concise writing
- "Omit needless words" and "use active voice"
- Works on documentation, commit messages, error messages

```bash
# Enable in ~/.claude/settings.json:
"elements-of-style@superpowers-marketplace": true
```

---

## 🛠️ Tools & Utilities

Data, databases, Git, learning extraction

### Agents

## 📊 Data Scientist ★★

```yaml
---
name: data-scientist
description: Handles data analysis, statistical modeling, SQL queries, BigQuery operations
works-with: python-pro, database-optimizer
---
```

**Key Capabilities:**
- Machine learning implementations
- Data transformation or analysis
- Statistical analysis

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

## 📈 Quant Analyst ★

```yaml
---
name: quant-analyst
description: Quantitative analysis and financial modeling
---
```

**Key Capabilities:**
- Statistical analysis
- Risk modeling
- Financial calculations

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

## 🐍 Python Pro ★★

```yaml
---
name: python-pro
description: Python development specialist
works-with: data-scientist
---
```

**Key Capabilities:**
- Data analysis, scripting, automation
- Python-specific best practices
- Knows pandas, numpy, requests

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

## 🗄️ Database Admin ★★

```yaml
---
name: database-admin
description: Database setup, configuration, and ongoing management
works-with: database-optimizer
---
```

**Key Capabilities:**
- Schema design, migrations, backups
- Database administration tasks

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

## ⚡ Database Optimizer ★★★

```yaml
---
name: database-optimizer
description: Optimizes database queries and overall database performance
works-with: database-admin, data-scientist
---
```

**Key Capabilities:**
- Analyzes slow queries
- Suggests indexes
- Improves database efficiency

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

## 💳 Payment Integration ★★

```yaml
---
name: payment-integration
description: Integrating payment systems like Stripe and PayPal
---
```

**Key Capabilities:**
- Payment workflows, webhooks
- Security considerations
- Checkout flows

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

### Plugins

## 🔧 Git ★★

```yaml
---
name: git@claude-code-plugins
description: 4 slash commands for Git operations
contains: 4 slash commands (commit-push, compact-commits, create-worktree, rebase-pr)
---
```

```bash
# Enable in ~/.claude/settings.json:
"git@claude-code-plugins": true
```

---

## 🔧 Commit Commands ★

```yaml
---
name: commit-commands@claude-code-plugins
description: Enhanced Git commit workflows with automated conventions
---
```

**Key Capabilities:**
- Improves commit message formatting
- Conventional commit support

```bash
# Enable in ~/.claude/settings.json:
"commit-commands@claude-code-plugins": true
```

---

### User-Created Skills

Custom skills you can add to `~/.claude/skills/` for specialized workflows

## 📰 Article Extractor ★

```yaml
---
name: article-extractor
description: Extracts clean article content from URLs
---
```

**Key Capabilities:**
- Removes ads, navigation, sidebars, clutter
- Returns just readable text

```bash
# Add to ~/.claude/skills/
# Manual installation from user repository
```

---

## 🚀 Ship Learn Next ★

```yaml
---
name: ship-learn-next
description: Transforms learning content into actionable implementation plans
---
```

**Key Capabilities:**
- Converts videos, articles, tutorials
- Creates concrete steps and practice reps

```bash
# Add to ~/.claude/skills/
# Manual installation from user repository
```

---

## 🧵 Tapestry ★★

```yaml
---
name: tapestry
description: Unified workflow for any learning material
---
```

**Key Capabilities:**
- Auto-detects content type (YouTube, article, PDF)
- Extracts content and creates action plan
- Single command: `tapestry <URL>`

```bash
# Add to ~/.claude/skills/
# Manual installation from user repository
```

---

## 🎥 YouTube Transcript ★

```yaml
---
name: youtube-transcript
description: Downloads transcripts and captions from YouTube videos
---
```

**Key Capabilities:**
- For analysis, summarization, content extraction

```bash
# Add to ~/.claude/skills/
# Manual installation from user repository
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

### Complete settings.json

```json
{
  "enabledPlugins": {
    "superpowers@superpowers-marketplace": true,
    "claude-mem@thedotmack": true,
    "javascript-typescript@claude-code-workflows": true,
    "frontend-mobile-development@claude-code-workflows": true,
    "code-documentation@claude-code-workflows": true,
    "seo-content-creation@claude-code-workflows": true,
    "seo-technical-optimization@claude-code-workflows": true,
    "seo-analysis-monitoring@claude-code-workflows": true,
    "elements-of-style@superpowers-marketplace": true,
    "git@claude-code-plugins": true,
    "commit-commands@claude-code-plugins": true
  },
  "alwaysThinkingEnabled": false
}
```

---

## Summary

**62 total tools:** 19 agents • 11 plugins • 21 skills • 1 MCP

**Agent Kits:**
- `claude-code-sub-agents` — 6 agents (prompt engineer, designers, frontend, iOS, code reviewer)
- `wshobson` — 10 agents (vibe coding, data, utilities, Next.js)

**Skills Breakdown:**
- 10 from Superpowers (core workflows)
- 9 from development plugins (JavaScript, frontend, docs)
- 1 from Elements of Style (writing)
- 4 user-created utilities

---

## Marketplaces & Resources

**[Superpowers Marketplace](https://github.com/Ejb503/multiverse-of-multiagents)**
- Community-driven framework for systematic, quality-driven development workflows
- Source of the core superpowers plugin

**[Claude Code Workflows](https://github.com/anthropics/claude-code-workflows)**
- Official Anthropic workflows for specialized tasks
- Language-specific development, SEO, and content creation

**[Claude Code Plugins](https://github.com/anthropics/claude-code-plugins)**
- Core utilities and integrations
- Git operations and commit workflow helpers

**Installation Tools:**
- [Leamas](https://leamas.sh/) — Agent kit installer
- [Plugin Marketplace](https://claudecodeplugins.io/) — Community plugins
- [Plugin Toolkits](https://claudemarketplaces.com/) — Specialized toolkits

---

## Recently Streamlined

Removed 18 redundant tools to focus on core functionality: react-pro, mobile-developer, javascript-pro, debugger, security-auditor, 4 business agents, 4 duplicate data agents, content-writer
