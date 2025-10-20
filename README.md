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
  ↓
┌──────────────────────────────────┐
│ Claude analyzes request          │
│ Identifies: auth, OAuth, sessions│
└────────────┬─────────────────────┘
             ↓
       ⚡ brainstorming
       └─ Socratic questions:
          • OAuth providers?
          • Password reset flow?
          • Session management?
             ↓
       ⚡ test-driven-development
       └─ Write failing tests:
          • login ✗
          • logout ✗
          • OAuth flow ✗
             ↓
       ┌─────┴─────┐
       ↓           ↓
   🤖 frontend- 🔌 context7
   developer    └─ Lookup Auth0/
   └─ Build        Supabase docs
      login UI
      (React +
      TypeScript)
       ↓
   🤖 database-admin
   └─ Create users table:
      • email
      • oauth_provider
      • session_tokens
       ↓
   ⚡ requesting-code-review
   └─ Spawn code-reviewer agent
      • Check SQL injection
      • Auth bypass vulnerabilities
       ↓
   ⚡ verification-before-completion
   └─ Run tests:
      • login ✓
      • logout ✓
      • OAuth flow ✓
       ↓
   ✅ Feature complete & secure
```

---

## Quick Start (15 Minutes)

Get a working setup with your first win.

### Step 1: Prerequisites (2 min)

```bash
node --version  # Need 18+
git --version
```

### Step 2: Install Essentials (8 min)

Install these 3 core tools:

**1. superpowers** - Core workflow skills (TDD, code review, planning)

```bash
# Add to ~/.claude/settings.json:
{
  "enabledPlugins": {
    "superpowers@superpowers-marketplace": true
  }
}
```

**2. claude-mem** - Persistent memory across sessions

```bash
# Add to ~/.claude/settings.json:
{
  "enabledPlugins": {
    "claude-mem@thedotmack": true
  }
}
```

**3. sequential-thinking** - Structured reasoning for complex problems

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

### Step 3: Verify (2 min)

Restart Claude Desktop, then verify:

```bash
# Check plugins enabled
cat ~/.claude/settings.json | grep enabledPlugins

# Check MCP configured
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### Step 4: Try It (3 min)

Ask Claude:

> "Use brainstorming to help me design a navbar component"

✅ **Expected:** Claude invokes the brainstorming skill and asks Socratic questions

---

## 🎨 Vibe Coding

### Agents

##### 🤖 agent-organizer ★★

**What it does:** Coordinates multiple agents working together on complex workflows

**Key capabilities:**
- Acts as your AI project manager
- Tracks which agents handle what
- Ensures work doesn't overlap

**Works with:** All agents
**Use when:** Running complex multi-agent workflows

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

##### 🤖 vibe-coding-coach ★★★

**What it does:** Your friendly coding mentor with personality

**Key capabilities:**
- Provides guidance while you code
- Explains concepts in approachable ways
- Helps improve your skills conversationally

**Works with:** All development agents

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

##### 🤖 context-manager ★★

**What it does:** Optimizes how context is used across conversations

**Key capabilities:**
- Maximizes available context windows
- Ensures important information is preserved when needed
- Prevents context overflow

**Use when:** Working on large codebases or long sessions

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

##### 🤖 prompt-engineer ★★

**What it does:** Expert prompt architect using Opus model for maximum reasoning

**Key capabilities:**
- Specializes in Chain-of-Thought and Tree-of-Thoughts techniques
- Essential when building AI features
- Optimizes prompts for LLM performance

**Use when:** Building AI features or optimizing prompts

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```

---

### Plugins

##### 🔧 superpowers@superpowers-marketplace ★★★

**What it does:** Foundation of vibe coding with 10 systematic development skills

**Key capabilities:**
- Enforces best practices like TDD and code review
- Ensures you use existing approaches before inventing new ones
- Guides systematic development workflows

**Contains:** 10 skills (listed below)

```bash
# Enable in ~/.claude/settings.json:
"superpowers@superpowers-marketplace": true
```

[Repository](https://github.com/Ejb503/multiverse-of-multiagents)

---

##### 🔧 claude-mem@thedotmack ★★★

**What it does:** Persistent memory system using SQLite with full-text search

**Key capabilities:**
- Automatically captures your work
- Processes it into summaries
- Injects relevant context in future sessions
- No manual saving needed

**Provides:** 6 MCP search tools for querying stored knowledge

```bash
# Enable in ~/.claude/settings.json:
"claude-mem@thedotmack": true
```

[Repository](https://github.com/thedotmack/claude-mem)

---

### Skills (from superpowers plugin)

##### ⚡ using-superpowers ★★★

**What it does:** Mandatory starting point for any task

**Key capabilities:**
- Forces you to search for existing skills before doing work
- Prevents reinventing the wheel
- Ensures best practices are followed

**Auto-triggers:** Start of every conversation

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

##### ⚡ brainstorming ★★★

**What it does:** Refines ideas using Socratic method questioning

**Key capabilities:**
- Clarifies requirements before planning
- Explores alternatives
- Validates design incrementally

**Auto-triggers:** When starting design work
**Manual invoke:** `/superpowers:brainstorm`

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

##### ⚡ writing-plans ★★★

**What it does:** Creates detailed implementation plans

**Key capabilities:**
- Breaks work into discrete, independent tasks
- Provides exact file paths and code examples
- Assumes engineer has zero codebase context

**Manual invoke:** `/superpowers:write-plan`
**Works with:** executing-plans, subagent-driven-development

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

##### ⚡ executing-plans ★★★

**What it does:** Executes plans in batches with review checkpoints

**Key capabilities:**
- Loads plan and reviews critically
- Executes tasks in batches
- Reports for review between batches

**Manual invoke:** `/superpowers:execute-plan`
**Works with:** writing-plans

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

##### ⚡ subagent-driven-development ★★★

**What it does:** Dispatches fresh subagents to handle individual tasks from your plan

**Key capabilities:**
- Each task gets a code review before moving to next
- Fast iteration with quality gates
- Independent task execution

**Auto-triggers:** When executing implementation plans
**Works with:** writing-plans, requesting-code-review

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

##### ⚡ dispatching-parallel-agents ★★

**What it does:** Launches multiple agents simultaneously for independent failures

**Key capabilities:**
- Investigates 3+ independent problems concurrently
- Each agent works without shared state
- Faster debugging

**Auto-triggers:** When facing 3+ independent failures

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

##### ⚡ requesting-code-review ★★★

**What it does:** Dispatches code-reviewer subagent to review implementation

**Key capabilities:**
- Reviews implementation against plan or requirements
- Catches issues before merging
- Provides actionable feedback

**Auto-triggers:** When completing tasks
**Works with:** code-reviewer agent

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

##### ⚡ verification-before-completion ★★★

**What it does:** Runs verification commands and confirms output before claiming success

**Key capabilities:**
- Evidence before assertions always
- Prevents claiming work is done without proof
- Runs tests and confirms passing

**Auto-triggers:** Before claiming completion
**Use when:** About to commit or create PRs

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

##### ⚡ writing-skills ★

**What it does:** Creates bulletproof Claude skills using TDD methodology

**Key capabilities:**
- Tests skills with subagents first to find gaps
- Writes instructions that close those gaps
- Applies TDD to process documentation

**Use when:** Creating new skills

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

##### ⚡ testing-skills-with-subagents ★

**What it does:** Validates that skills resist AI rationalization

**Key capabilities:**
- Runs skills through actual subagent sessions
- Uses RED-GREEN-REFACTOR cycle
- Ensures skills work under pressure

**Use when:** Verifying skills work before deployment

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

##### ⚡ sharing-skills ★

**What it does:** Helps contribute skills back to the community via pull requests

**Key capabilities:**
- Guides process of branching, committing, pushing
- Creates PR to contribute skills upstream
- Ensures proper formatting

**Use when:** Contributing skills to community

```bash
# Included in superpowers plugin
"superpowers@superpowers-marketplace": true
```

---

### MCPs

##### 🔌 sequential-thinking ★★★

**What it does:** Provides step-by-step reasoning for complex problems

**Key capabilities:**
- Claude invokes this when thinking through multi-step solutions
- Structured reasoning framework
- Helps with complex debugging and planning

**Used by:** All agents and workflows

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

[Documentation](https://github.com/modelcontextprotocol/servers/tree/main/src/sequential-thinking)

---

## ⚙️ Development

Design, frontend, Next.js, code review

### Agents

##### 🤖 ui-designer ★★★

**What it does:** Creates design systems and visual interfaces with WCAG accessibility compliance

**Key capabilities:**
- Handles color palettes, typography, spacing systems
- Component libraries
- WCAG accessibility compliance

**Requires:** magic MCP, context7 MCP
**Works with:** frontend-developer, ux-designer

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```

---

##### 🤖 ux-designer ★★★

**What it does:** Conducts user research, creates journey maps, and designs usability tests

**Key capabilities:**
- Focuses on user flows, pain points, and interaction patterns
- Creates wireframes and prototypes
- Validates designs with users

**Requires:** context7 MCP, sequential-thinking MCP, playwright MCP
**Works with:** ui-designer, frontend-developer

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```

---

##### 🤖 frontend-developer ★★★

**What it does:** Builds production-ready React components with TypeScript and Tailwind

**Key capabilities:**
- Handles state management, hooks, responsive design
- Accessibility best practices
- Testing with React Testing Library

**Requires:** magic MCP, context7 MCP, playwright MCP
**Works with:** ui-designer, code-reviewer, nextjs-pro

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```

---

##### 🤖 ios-developer ★★

**What it does:** Native iOS development using Swift, SwiftUI, and UIKit

**Key capabilities:**
- Handles iOS-specific patterns, navigation
- Platform conventions
- App Store optimization

**Works with:** ui-designer

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```

---

##### 🤖 code-reviewer ★★★

**What it does:** Reviews code for quality, security, performance, and maintainability

**Key capabilities:**
- Provides actionable feedback with line-by-line suggestions
- Security vulnerability detection
- Best practices enforcement

**Requires:** context7 MCP, sequential-thinking MCP
**Works with:** All development agents

```bash
# Included in claude-code-sub-agents kit
~/leamas/leamas agent@claude-code-sub-agents
```

---

##### 🤖 nextjs-pro ★★

**What it does:** Next.js specialist covering SSR, SSG, routing, and Next.js-specific patterns

**Key capabilities:**
- Knows App Router, Server Components
- Deployment best practices
- Performance optimization

**Works with:** frontend-developer

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

### Plugins

##### 🔧 javascript-typescript@claude-code-workflows ★★

**What it does:** 4 skills covering modern JS patterns and TypeScript

**Key capabilities:**
- Modern JS patterns, testing approaches
- Node.js backend development
- TypeScript type system usage

**Contains:** 4 skills

```bash
# Enable in ~/.claude/settings.json:
"javascript-typescript@claude-code-workflows": true
```

---

##### 🔧 frontend-mobile-development@claude-code-workflows ★★

**What it does:** 2 skills for building React and mobile apps

**Key capabilities:**
- Building React components
- Mobile apps with React Native or Flutter

**Contains:** 2 skills

```bash
# Enable in ~/.claude/settings.json:
"frontend-mobile-development@claude-code-workflows": true
```

---

##### 🔧 code-documentation@claude-code-workflows ★★

**What it does:** 3 skills covering code review and documentation

**Key capabilities:**
- Code review processes
- Architecture documentation
- Step-by-step tutorial creation

**Contains:** 3 skills

```bash
# Enable in ~/.claude/settings.json:
"code-documentation@claude-code-workflows": true
```

---

## 📝 Content & Marketing

SEO content, technical optimization, writing

### Plugins with Agents

##### 🔧 seo-content-creation@claude-code-workflows ★★★

**What it does:** Content writing optimized for search engines with E-E-A-T signals

**Contains:** 3 SEO agents

```bash
# Enable in ~/.claude/settings.json:
"seo-content-creation@claude-code-workflows": true
```

**Agents in this plugin:**

##### 🤖 seo-content-writer ★★★

**What it does:** Writes E-E-A-T optimized articles with proper keyword density

**Key capabilities:**
- 0.5-1.5% keyword density
- Structures content for readability and ranking
- Uses Sonnet model for high-quality long-form content

---

##### 🤖 seo-content-planner ★★

**What it does:** Creates content calendars, topic clusters, and search intent mappings

**Key capabilities:**
- Plans content strategy
- Uses efficient Haiku model for fast planning

---

##### 🤖 seo-content-auditor ★★

**What it does:** Scores content quality 1-10 and provides improvement recommendations

**Key capabilities:**
- Actionable improvement recommendations
- Uses Sonnet for thorough analysis

---

##### 🔧 seo-technical-optimization@claude-code-workflows ★★★

**What it does:** Technical SEO optimization covering keywords, meta tags, featured snippets

**Contains:** 4 SEO agents

```bash
# Enable in ~/.claude/settings.json:
"seo-technical-optimization@claude-code-workflows": true
```

**Agents in this plugin:**

##### 🤖 seo-keyword-strategist ★★★

**What it does:** Analyzes keyword density and generates LSI keyword variations

**Key capabilities:**
- Generates 20-30 LSI variations
- Maps entities and related concepts
- Fast Haiku model for quick analysis

---

##### 🤖 seo-meta-optimizer ★★★

**What it does:** Creates optimized meta titles, descriptions, and URLs

**Key capabilities:**
- Respects character limits
- Provides 3-5 A/B testing variations
- Uses Haiku for speed

---

##### 🤖 seo-snippet-hunter ★★

**What it does:** Formats content for featured snippets (position zero)

**Key capabilities:**
- Creates paragraph snippets, list formats
- Table structures with schema markup
- Haiku model for efficient formatting

---

##### 🤖 seo-structure-architect ★★

**What it does:** Optimizes header hierarchy and implements schema markup

**Key capabilities:**
- H1-H6 structure optimization
- Schema markup (Article, FAQ, HowTo, Review)
- Internal linking opportunities

---

##### 🔧 seo-analysis-monitoring@claude-code-workflows ★★

**What it does:** SEO analysis and monitoring for authority building and content freshness

**Contains:** 3 SEO agents

```bash
# Enable in ~/.claude/settings.json:
"seo-analysis-monitoring@claude-code-workflows": true
```

**Agents in this plugin:**

##### 🤖 seo-authority-builder ★★

**What it does:** Analyzes content for E-E-A-T signals

**Key capabilities:**
- Creates enhancement plans with author bio templates
- Trust signal checklists
- Uses Sonnet for comprehensive analysis

---

##### 🤖 seo-content-refresher ★★

**What it does:** Scans content for outdated elements

**Key capabilities:**
- Identifies statistics, dates, examples that need updating
- Prioritizes updates based on ranking decline
- Fast Haiku model for scanning

---

##### 🤖 seo-cannibalization-detector ★

**What it does:** Identifies when multiple pages compete for same keywords

**Key capabilities:**
- Provides resolution strategies
- Consolidate pages, differentiate targeting, or adjust focus
- Uses Haiku for efficient comparison

---

### Plugins with Skills

##### 🔧 elements-of-style@superpowers-marketplace ★★

**What it does:** Applies Strunk & White's timeless writing principles

**Key capabilities:**
- Clear, concise writing
- "Omit needless words" and "use active voice"
- Works on documentation, commit messages, error messages

**Contains:** 1 skill (writing-clearly-and-concisely)

```bash
# Enable in ~/.claude/settings.json:
"elements-of-style@superpowers-marketplace": true
```

---

## 🛠️ Tools & Utilities

Data, databases, Git, learning extraction

### Agents

##### 🤖 data-scientist ★★

**What it does:** Handles data analysis, statistical modeling, SQL queries, BigQuery operations

**Key capabilities:**
- Machine learning implementations
- Data transformation or analysis
- Statistical analysis

**Works with:** python-pro, database-optimizer

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

##### 🤖 quant-analyst ★

**What it does:** Quantitative analysis and financial modeling

**Key capabilities:**
- Statistical analysis
- Risk modeling
- Financial calculations

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

##### 🤖 python-pro ★★

**What it does:** Python development specialist

**Key capabilities:**
- Data analysis, scripting, automation
- Python-specific best practices
- Knows pandas, numpy, requests

**Works with:** data-scientist

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

##### 🤖 database-admin ★★

**What it does:** Database setup, configuration, and ongoing management

**Key capabilities:**
- Schema design, migrations, backups
- Database administration tasks

**Works with:** database-optimizer

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

##### 🤖 database-optimizer ★★★

**What it does:** Optimizes database queries and overall database performance

**Key capabilities:**
- Analyzes slow queries
- Suggests indexes
- Improves database efficiency

**Works with:** database-admin, data-scientist

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

##### 🤖 payment-integration ★★

**What it does:** Integrating payment systems like Stripe and PayPal

**Key capabilities:**
- Payment workflows, webhooks
- Security considerations
- Checkout flows

```bash
# Included in wshobson kit
~/leamas/leamas agent@wshobson
```

---

### Plugins

##### 🔧 git@claude-code-plugins ★★

**What it does:** 4 slash commands for Git operations

**Key capabilities:**
- commit-push, compact-commits
- create-worktree, rebase-pr

**Contains:** 4 slash commands

```bash
# Enable in ~/.claude/settings.json:
"git@claude-code-plugins": true
```

---

##### 🔧 commit-commands@claude-code-plugins ★

**What it does:** Enhanced Git commit workflows with automated conventions

**Key capabilities:**
- Improves commit message formatting
- Conventional commit support

```bash
# Enable in ~/.claude/settings.json:
"commit-commands@claude-code-plugins": true
```

---

### User-Created Skills

Custom skills you can add to `~/.claude/skills/` for specialized workflows

##### ⚡ article-extractor ★

**What it does:** Extracts clean article content from URLs

**Key capabilities:**
- Removes ads, navigation, sidebars, clutter
- Returns just readable text

```bash
# Add to ~/.claude/skills/
# Manual installation from user repository
```

---

##### ⚡ ship-learn-next ★

**What it does:** Transforms learning content into actionable implementation plans

**Key capabilities:**
- Converts videos, articles, tutorials
- Creates concrete steps and practice reps

```bash
# Add to ~/.claude/skills/
# Manual installation from user repository
```

---

##### ⚡ tapestry ★★

**What it does:** Unified workflow for any learning material

**Key capabilities:**
- Auto-detects content type (YouTube, article, PDF)
- Extracts content and creates action plan
- Single command: `tapestry <URL>`

```bash
# Add to ~/.claude/skills/
# Manual installation from user repository
```

---

##### ⚡ youtube-transcript ★

**What it does:** Downloads transcripts and captions from YouTube videos

**Key capabilities:**
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
