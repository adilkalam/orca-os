---
name: nav
description: View your complete Claude Code setup (agents, skills, MCPs) in a navigable format
---

# Claude Code Navigation

## 🤖 Agents (45 total - Specialist Architecture)

Run to see all agents:
```bash
ls -1 ~/.claude/agents/*/
```

**Orchestration:**
- workflow-orchestrator.md - Pure orchestrator (Read, Task, TodoWrite only)

**Planning (3):**
- requirement-analyst.md - Requirements elicitation and analysis
- system-architect.md - Technical architecture design
- plan-synthesis-agent.md - Interface validation and plan integration

**iOS Specialists (21):**
```bash
ls ~/.claude/agents/ios-specialists/
```
- swiftui-developer, uikit-specialist, ios-accessibility-tester
- swiftdata-specialist, coredata-expert
- urlsession-expert, combine-networking, ios-api-designer
- state-architect, tca-specialist, observation-specialist
- swift-testing-specialist, xctest-pro, ui-testing-expert
- swift-code-reviewer, ios-debugger
- xcode-cloud-expert, fastlane-specialist
- ios-performance-engineer, ios-security-tester, ios-penetration-tester

**Frontend Specialists (5):**
```bash
ls ~/.claude/agents/frontend-specialists/
```
- react-18-specialist, nextjs-14-specialist
- state-management-specialist, frontend-performance-specialist
- frontend-testing-specialist

**Design Specialists (8):**
```bash
ls ~/.claude/agents/design-specialists/
```
- design-system-architect, ux-strategist, visual-designer
- tailwind-specialist, css-specialist, ui-engineer
- accessibility-specialist, design-reviewer

**Implementation (3):**
- backend-engineer.md - Node.js, Go, Python server development
- android-engineer.md - Kotlin, Jetpack Compose, Material Design 3
- cross-platform-mobile.md - React Native & Flutter development

**Quality (3):**
- verification-agent.md - Meta-cognitive tag verification (Response Awareness)
- test-engineer.md - Unit, integration, E2E, performance testing
- quality-validator.md - Final validation gate

**Specialized (1):**
- infrastructure-engineer.md - CI/CD, Docker, Kubernetes, Fastlane

---

## 🎯 Skills

Run to see all skills:
```bash
ls -1 ~/.claude/skills/
```

Available skills include:
- brainstorming.md - Interactive brainstorming
- article-extractor/ - Extract article content
- youtube-transcript/ - Download YouTube transcripts
- uxscii-* - UI component creation tools
- And more...

---

## 📚 Context Files

Run to see context:
```bash
ls -1 ~/.claude/context/
```

**Current context:**
- daisyui.llms.txt (59KB) - Complete daisyUI 5 reference

---

## 🔌 MCP Servers

Run to see MCP configuration:
```bash
cat ~/.config/claude-code/mcp.json
```

**Configured MCPs:**
- XcodeBuildMCP - iOS simulator control and Xcode builds

**Also available (Claude Desktop):**
- sequential-thinking - Complex reasoning
- puppeteer - Browser automation

---

## 📦 Archive

Old agents preserved in:
```bash
ls -1 ~/claude-vibe-code/archive/
```

**Archived (11 agents):**
- Web agents: frontend-developer-1, frontend-developer-2, ui-engineer, etc.
- Mobile agents: mobile-app-builder, react-native-dev, etc.

---

## 🚀 Quick Commands

```bash
# Count agents
ls ~/.claude/agents/*.md | wc -l

# Search for specific agent
ls ~/.claude/agents/ | grep -i "mobile"

# View agent description (example: React specialist)
head -15 ~/.claude/agents/frontend-specialists/frameworks/react-18-specialist.md

# Check MCP status (requires restart after changes)
cat ~/.config/claude-code/mcp.json
```

---

## 📊 Structure Summary

```
.claude/
├── agents/ (45 agents - Specialist Architecture)
│   ├── orchestration/ - workflow-orchestrator
│   ├── planning/ - requirement-analyst, system-architect, plan-synthesis-agent
│   ├── ios-specialists/ - 21 iOS specialists (SwiftUI, data, networking, testing, etc.)
│   ├── frontend-specialists/ - 5 React/Next.js specialists
│   ├── design-specialists/ - 8 design specialists (UX, Tailwind, accessibility, review)
│   ├── implementation/ - backend-engineer, android-engineer, cross-platform-mobile
│   ├── quality/ - verification-agent, test-engineer, quality-validator
│   └── specialized/ - infrastructure-engineer
├── context/
│   └── daisyUI.llms.txt (59KB)
├── skills/
│   └── 14+ skills (brainstorming, article-extractor, etc.)
└── commands/
    └── /orca, /enhance, /agentfeedback, /concept, /clarify, and more

~/.config/claude-code/
└── mcp.json (XcodeBuildMCP configured)

~/claude-vibe-code/
└── archive/ (deprecated agents: ios-engineer, frontend-engineer, design-engineer)
```

---

**Tip:** After reorganization, restart Claude Code to ensure all agents and MCPs are loaded properly.
