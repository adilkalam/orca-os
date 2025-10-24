# Setup Guide

**Complete installation walkthrough with examples and explanations**

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Verification](#verification)
- [Your First Command](#your-first-command)
- [Understanding the System](#understanding-the-system)

---

## Overview

This guide will help you install the Claude Code orchestration system, which includes:

- **19 specialized agents** (ios-dev, design-master, code-reviewer-pro, etc.)
- **40+ skills** (test-driven-development, systematic-debugging, brainstorming)
- **8 workflows** (iOS development, UI/UX design, debugging, code review)
- **Optimization tools** (context caching, analytics, model tiering)

**Time to complete:** 15-20 minutes

---

## Prerequisites

### Required

- **Claude Desktop** installed
- **Node.js** (v18+) for MCP servers
- **Terminal** access

### Optional but Recommended

- **Xcode** (for iOS development)
- **Git** (for version control)
- **Browser** (for web development)

---

## Installation Steps

### Step 1: Install Core Agents

Agents are specialized Claude instances with domain expertise.

**Install agent kits:**

```bash
# Option A: Using Leamas (recommended)
# Visit https://leamas.sh/ and install Leamas
# Then install agent kits:

~/leamas/leamas agent@claude-code-sub-agents
# Installs: design-master, ios-dev, frontend-developer, debugger, +2 more

~/leamas/leamas agent@wshobson
# Installs: code-reviewer-pro, python-pro, mobile-developer, +7 more
```

**What this does:**

- Downloads agent definitions to `~/.claude/agents/`
- Each agent has: expertise, prompts, recommended skills
- Agents are loaded automatically when needed

**Example agent structure:**

```
~/.claude/agents/ios-dev/
├── agent.md           # Main agent definition
├── details.md         # Full expertise documentation
└── recommended-skills.yml
```

**Verify installation:**

```bash
# Count installed agents
ls ~/.claude/agents/ | wc -l

# Should show: 19 (or more)
```

---

### Step 2: Enable Essential Plugins

Plugins add skills and workflows to Claude Code.

**Edit your settings:**

```bash
# Open settings file
open ~/.claude/settings.json
```

**Add enabled plugins:**

```json
{
  "enabledPlugins": {
    "superpowers@superpowers-marketplace": true,
    "claude-mem@thedotmack": true
  }
}
```

**What each plugin provides:**

**superpowers@superpowers-marketplace:**
- Skills: test-driven-development, systematic-debugging, brainstorming
- Ensures agents follow proven processes
- Prevents ad-hoc approaches

**claude-mem@thedotmack:**
- Session continuity across restarts
- Context preservation
- Learning from previous sessions

**Save and close the file.**

---

### Step 3: Add MCP Servers

MCP (Model Context Protocol) servers provide structured reasoning and enhanced capabilities.

**Edit MCP config:**

```bash
# Open Claude Desktop config
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Add sequential-thinking:**

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

**What this does:**

- Adds structured reasoning capability
- Helps agents think through complex problems step-by-step
- Improves decision quality

**Example of sequential thinking in action:**

```
Agent receives: "Fix the login bug"

Without sequential-thinking:
→ Jumps to solution

With sequential-thinking:
→ Step 1: What is the bug? (gather info)
→ Step 2: What causes it? (root cause)
→ Step 3: What's the fix? (solution)
→ Step 4: Will this break anything? (validation)
→ Result: Better fix, fewer regressions
```

**Save and close the file.**

---

### Step 4: Install Orchestration Commands

Commands are entry points that trigger workflows.

**Clone this repository:**

```bash
# Choose a location for the orchestration system
cd ~/projects

# Clone the repo
git clone https://github.com/your-repo/claude-vibe-code.git
cd claude-vibe-code
```

**Link commands:**

```bash
# Create symlinks from ~/.claude/commands/ to this repo
ln -s $(pwd)/.claude/commands ~/.claude/commands
```

**What this installs:**

```
~/.claude/commands/
├── enhance.md          # Auto-detect and execute workflows
├── concept.md          # Explore approaches before building
├── agentfeedback.md    # Process multiple feedback items
├── visual-review.md    # QA design work
├── nav.md              # View your setup
└── [6 more commands]
```

**Verify installation:**

```bash
# List installed commands
ls ~/.claude/commands/

# Should show: 11 commands
```

---

### Step 5: Install Optimization Tools

Optional but recommended for cost/token savings.

**Install context caching:**

```bash
# Copy optimization libraries
cp -r lib ~/.claude/lib
```

**What this provides:**

- **context-cache.js** - Cache frequently read files (save 15K tokens)
- **session-analytics.js** - Track performance and costs
- **analytics-viewer.js** - Visualize metrics
- **workflow-detector.js** - Auto-detect task types
- **smart-agent-selector.js** - Recommend best agents

**Example of context caching:**

```javascript
// Without caching:
Every workflow reads DESIGN_PATTERNS.md (5000 tokens)
10 workflows = 50,000 tokens

// With caching:
First workflow reads file (5000 tokens)
Next 9 workflows use cache (0 tokens)
10 workflows = 5,000 tokens

Savings: 45,000 tokens (90%)
```

---

### Step 6: Restart Claude Desktop

**Quit completely:**

```bash
# Quit Claude Desktop
# (Cmd+Q, or Quit from menu)
```

**Relaunch:**

```bash
# Open Claude Desktop from Applications
```

**Why restart:** Loads new plugins, MCP servers, and commands.

---

## Verification

### Check 1: Agents Installed

```bash
# In Claude Code, type:
/nav

# Should show:
# 🤖 AGENTS (19 installed)
# - design-master
# - ios-dev
# - frontend-developer
# - code-reviewer-pro
# ... [+15 more]
```

---

### Check 2: Skills Available

```bash
# In Claude Code, ask:
"List available skills"

# Should show 40+ skills including:
# - test-driven-development
# - systematic-debugging
# - brainstorming
# - verification-before-completion
```

---

### Check 3: MCP Servers Running

```bash
# In Claude Desktop, check for MCP indicator
# Look for: "MCP" badge in bottom-left corner

# If missing:
# - Check ~/Library/Logs/Claude/mcp*.log for errors
# - Verify claude_desktop_config.json has no JSON syntax errors
```

---

### Check 4: Commands Work

```bash
# Try a simple command:
/nav

# Should display your setup overview
# If command not recognized:
# - Verify ~/.claude/commands/ exists
# - Check symlinks are correct: ls -la ~/.claude/commands/
```

---

## Your First Command

Let's test the system with a real example.

### Example: Build a Simple Feature

**Scenario:** You want to build a user profile card component in React.

**Step 1: Run /concept**

```bash
# In Claude Code:
/concept "create a user profile card component in React"
```

**What happens:**

```
🎨 CONCEPT EXPLORATION
   Agent: design-master
   Skill: brainstorming

Question 1: What information should the profile card display?

# You answer: Name, avatar, bio, social links

Question 2: What's the use case? (public profiles, admin dashboard, etc.)

# You answer: Public user profiles on a social platform

Question 3: What design style? (minimal, detailed, card-like, full-page)

# You answer: Card-like, minimal, clean

Question 4: Any specific features? (edit mode, follow button, etc.)

# You answer: Follow button, message button

🧠 ANALYZING

Based on your input, here's the recommended approach:

COMPONENT STRUCTURE:
- ProfileCard.tsx (main component)
- Avatar.tsx (reusable avatar)
- ProfileStats.tsx (followers, following)
- ProfileActions.tsx (follow, message buttons)

PROPS:
- user: { name, avatar, bio, socialLinks, stats }
- onFollow: () => void
- onMessage: () => void
- isFollowing: boolean

DESIGN:
- Card container (border-radius: 12px, padding: 24px)
- Avatar: 80x80px, circle
- Typography: Name (20px bold), Bio (14px regular)
- Buttons: Primary (follow), Secondary (message)

📋 CONCEPT BRIEF CREATED

   File: docs/design-briefs/user-profile-card-20251021.md

   Ready to implement?
```

---

**Step 2: Run /enhance**

```bash
# In Claude Code:
/enhance "build user profile card from concept brief"
```

**What happens:**

```
🔍 ANALYZING TASK
   Detected: Frontend development
   Workflow: ui-ux-design
   Loading concept brief...

📋 EXECUTION PLAN

   Wave 1: Architecture (frontend-developer)
   Wave 2: Implementation (frontend-developer + design-master)
   Wave 3: Quality Gate (code-reviewer-pro)

   Estimated time: 30 minutes

🏃 WAVE 1 - ARCHITECTURE

   Agent: frontend-developer
   ✓ Created components/ProfileCard.tsx
   ✓ Created components/Avatar.tsx
   ✓ Created components/ProfileStats.tsx
   ✓ Created components/ProfileActions.tsx
   ✓ Defined TypeScript interfaces

🎨 WAVE 2 - IMPLEMENTATION

   frontend-developer (TDD):
   ✓ Writing tests first (RED)
   ✓ Implementing features (GREEN)
   ✓ 8 tests passing

   design-master:
   ✓ Spacing: 8px grid system
   ✓ Typography: Correct hierarchy
   ✓ Layout: Clean card structure

🛡️ QUALITY GATE

   Agent: code-reviewer-pro
   ✓ Build passes
   ✓ Tests pass (8/8)
   ✓ TypeScript strict
   ✓ Accessibility: ARIA labels
   ✓ Responsive design

   Result: ✅ APPROVED

✅ COMPLETE

   Files created:
   - components/ProfileCard.tsx
   - components/Avatar.tsx
   - components/ProfileStats.tsx
   - components/ProfileActions.tsx
   - __tests__/ProfileCard.test.tsx

   Time: 28 minutes
   Quality: Production-ready
```

---

**Step 3: Verify the output**

```bash
# Check what was created:
ls components/

# Should show:
# ProfileCard.tsx
# Avatar.tsx
# ProfileStats.tsx
# ProfileActions.tsx

# Run tests:
npm test ProfileCard

# Should show:
# ✓ 8 tests passing
```

---

## Understanding the System

### How Commands Work

**Commands are entry points:**

```
You type:        /enhance "task description"
                     ↓
Command detects:     Task type (frontend, iOS, design, etc.)
                     ↓
Loads workflow:      ui-ux-design.yml
                     ↓
Executes phases:     Architecture → Implementation → Review
                     ↓
Uses agents:         frontend-developer, design-master
                     ↓
Follows skills:      test-driven-development
                     ↓
Quality gate:        code-reviewer-pro validates
                     ↓
Result:              Production-ready code
```

---

### How Agents Work

**Agents are specialists:**

```
design-master:
- Expertise: UI/UX, spacing, typography, visual hierarchy
- Skills: design-with-precision, brainstorming
- When to use: Design work, visual QA

ios-dev:
- Expertise: Swift, SwiftUI, iOS patterns, App Store
- Skills: test-driven-development, systematic-debugging
- When to use: iOS app development

code-reviewer-pro:
- Expertise: Security, performance, best practices
- Skills: verification-before-completion
- When to use: Quality gates (always, before shipping)
```

---

### How Skills Work

**Skills are proven processes:**

```
test-driven-development:
1. Write test (RED) - Test fails
2. Write minimal code (GREEN) - Test passes
3. Refactor for clarity
4. Repeat

Why: Ensures code actually works, prevents bugs

systematic-debugging:
1. Investigation - Gather information
2. Root cause - Find real problem
3. Hypothesis testing - Verify fix
4. Implementation - Apply solution

Why: Prevents "fix one bug, create three more"

brainstorming:
1. Socratic questioning - Understand problem deeply
2. Alternative exploration - Multiple approaches
3. Incremental validation - Test assumptions
4. Creative direction - Choose best path

Why: Prevents generic, mediocre solutions
```

---

### How Quality Gates Work

**Every workflow has a quality gate:**

```
After implementation:
     ↓
code-reviewer-pro validates:
  - Build passes
  - Tests pass
  - Security verified
  - Performance optimized
  - Best practices followed
     ↓
     ├─ ✅ APPROVED → Ship it
     └─ ❌ REQUEST_CHANGES → Agent fixes, re-review

Why: 0 bugs shipped in production
```

---

## Next Steps

**You're all set! Now:**

1. **Try commands** → [QUICKSTART.md](QUICKSTART.md)
2. **Learn workflows** → [WORKFLOWS.md](WORKFLOWS.md)
3. **Optimize costs** → [OPTIMIZATION.md](OPTIMIZATION.md)

**Questions?** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
