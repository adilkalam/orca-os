# Claude Vibe Code - Quick Reference

**Fast lookup for all agents, commands, teams, and workflows**

---

## 🤖 Agents (12 Total)

### Implementation Specialists

| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **frontend-engineer** | Building UI, web components | React, Vue, Next.js, Tailwind v4, TypeScript, performance, a11y | `agents/implementation/frontend-engineer.md` |
| **backend-engineer** | Building APIs, server logic | Node.js, Python, Go, REST/GraphQL, databases, auth | `agents/implementation/backend-engineer.md` |
| **ios-engineer** | Building iOS apps | Swift 6.0, SwiftUI, UIKit, iOS ecosystem, App Store | `agents/implementation/ios-engineer.md` |
| **android-engineer** | Building Android apps | Kotlin, Jetpack Compose, Material 3, MVVM, coroutines | `agents/implementation/android-engineer.md` |
| **cross-platform-mobile** | Multi-platform mobile | React Native, Flutter, platform optimization | `agents/implementation/cross-platform-mobile.md` |

### Planning Specialists

| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **requirement-analyst** | Need to clarify requirements | User stories, acceptance criteria, requirements docs | `agents/planning/requirement-analyst.md` |
| **system-architect** | Need system design | Architecture, tech stacks, API specs, data models, scalability | `agents/planning/system-architect.md` |

### Quality Specialists

| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **test-engineer** | Writing tests, QA | Unit, integration, E2E, security, performance testing | `agents/quality/test-engineer.md` |
| **quality-validator** | Final verification before delivery | Requirements compliance, evidence validation, blocking gates | `agents/quality/quality-validator.md` |

### Specialized Agents

| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **design-engineer** | UI/UX design work | Design systems, accessibility, Figma-to-code, WCAG 2.1 AA | `agents/specialized/design-engineer.md` |
| **infrastructure-engineer** | DevOps, deployment | CI/CD, Docker, Kubernetes, AWS/GCP/Azure, monitoring | `agents/specialized/infrastructure-engineer.md` |

### Orchestration

| Agent | Use When | Key Skills | File |
|-------|----------|------------|------|
| **workflow-orchestrator** | Complex multi-phase workflows | Pure coordination, quality gates, parallel dispatch, evidence collection | `agents/orchestration/workflow-orchestrator.md` |

---

## ⚡ Commands (15 Total)

### Core Orchestration

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| **/orca** | Complex multi-step tasks | Smart multi-agent orchestration with tech stack detection and team confirmation |
| **/enhance** | Vague or unclear requests | Transforms requests into well-structured prompts and executes |
| **/ultra-think** | Need deep analysis without code changes | Multi-dimensional problem analysis and reasoning |

### Design Workflow

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| **/concept** | Before building UI/UX | Creative exploration - study references, extract patterns, get approval BEFORE building |
| **/design** | Design brainstorming | Conversational design with project-specific references, establishes design system baseline |
| **/inspire** | Need design inspiration | Analyze beautiful design examples to develop aesthetic taste |
| **/discover** | Finding design references | Browse design collections when you DON'T have specific references |
| **/save-inspiration** | Found good design example | Save to personal gallery with tags and vision analysis |
| **/visual-review** | After implementing UI | Visual QA review using chrome-devtools to screenshot and analyze |

### Workflow & Utilities

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| **/agentfeedback** | Providing feedback on completed work | Parses feedback and orchestrates agents to address all points systematically |
| **/clarify** | Quick mid-workflow question | Focused clarification without full orchestration |
| **/nav** | Want to see what's available | View complete Claude Code setup (agents, skills, MCPs) in navigable format |
| **/session-save** | End of session | Save current session context for automatic resumption |
| **/session-resume** | Start of session | Manually reload session context (normally auto-loads) |

---

## 🎯 Suggested Teams by Project Type

### iOS/Swift Project
**Auto-detected when:** `*.xcodeproj` or `*.xcworkspace` found

**Primary Team:**
- ios-engineer (implementation)
- design-engineer (UI/UX)
- test-engineer (testing)
- quality-validator (final check)

**When to add:**
- system-architect (complex architecture)
- infrastructure-engineer (CI/CD, App Store deployment)

**Recommended Commands:**
- /orca (complex features)
- /enhance (quick tasks)
- /visual-review (UI verification)

---

### Next.js/React Project
**Auto-detected when:** `package.json` with "next" or "react"

**Primary Team:**
- frontend-engineer (UI implementation)
- design-engineer (design system)
- test-engineer (unit/integration tests)
- quality-validator (final check)

**When to add:**
- backend-engineer (if full-stack)
- system-architect (complex state management)
- infrastructure-engineer (deployment, SEO)

**Recommended Commands:**
- /orca (full features)
- /concept (design exploration)
- /enhance (component work)
- /visual-review (browser verification)

---

### Python/Backend Project
**Auto-detected when:** `requirements.txt` or `pyproject.toml`

**Primary Team:**
- backend-engineer (API implementation)
- test-engineer (comprehensive testing)
- system-architect (architecture)
- quality-validator (final check)

**When to add:**
- infrastructure-engineer (Docker, deployment)
- frontend-engineer (if building admin UI)

**Recommended Commands:**
- /orca (API development)
- /enhance (endpoint work)
- /ultra-think (performance analysis)

---

### React Native/Flutter Project
**Auto-detected when:** `package.json` with `ios/` and `android/` dirs, or `pubspec.yaml`

**Primary Team:**
- cross-platform-mobile (implementation)
- design-engineer (UI/UX)
- test-engineer (multi-platform testing)
- quality-validator (final check)

**When to add:**
- ios-engineer (iOS-specific features)
- android-engineer (Android-specific features)
- infrastructure-engineer (app store deployment)

**Recommended Commands:**
- /orca (cross-platform features)
- /concept (design exploration)
- /visual-review (multi-device verification)

---

### Unknown/General Project
**Auto-detected when:** No specific project markers found

**Primary Team:**
- system-architect (figure out the architecture)
- test-engineer (testing)
- quality-validator (verification)

**When to add:**
- Appropriate implementation specialist once project type is known

**Recommended Commands:**
- /ultra-think (understand the codebase)
- /orca (with explicit agent selection)
- /enhance (after understanding project)

---

## 🔄 Common Workflows

### Workflow 1: Add a New Feature

```
1. /orca "Add [feature name]"
   └─ Auto-detects project type
   └─ Dispatches: requirement-analyst → system-architect
   └─ Implementation agents in parallel
   └─ test-engineer writes tests
   └─ quality-validator verifies

2. Review evidence
   └─ Screenshots (UI changes)
   └─ Test output (functionality)
   └─ Build logs (compilation)

3. Done!
```

---

### Workflow 2: Fix a Bug

```
1. Describe the problem naturally
   "The login button doesn't work on mobile"

2. Auto-orchestration:
   └─ Appropriate agent investigates
   └─ Identifies root cause
   └─ Implements fix
   └─ test-engineer adds regression test
   └─ quality-validator verifies

3. Evidence provided:
   └─ Before/after screenshots
   └─ Test showing bug is fixed
```

---

### Workflow 3: Design Exploration

```
1. /concept "Dashboard with analytics"
   └─ Studies reference examples
   └─ Extracts design patterns
   └─ Brainstorms approach
   └─ Gets your approval

2. Once approved, /orca executes
   └─ design-engineer creates design system
   └─ frontend-engineer implements
   └─ test-engineer validates
   └─ quality-validator checks a11y

3. /visual-review for final check
```

---

### Workflow 4: Performance Investigation

```
1. /ultra-think "Why is the app slow?"
   └─ Deep analysis (no code changes)
   └─ Identifies bottlenecks
   └─ Provides recommendations

2. Review recommendations

3. /orca "Implement [specific optimization]"
   └─ Appropriate agents implement
   └─ test-engineer benchmarks
   └─ Evidence shows improvement
```

---

### Workflow 5: Iterative Feedback

```
1. Work gets completed

2. /agentfeedback "The spacing is too tight and colors are off"
   └─ Parses into actionable points:
      a) Increase spacing
      b) Adjust colors
   └─ Dispatches design-engineer
   └─ Updates with evidence

3. Optionally: /agentfeedback --learn
   └─ Extracts design rules
   └─ Prevents repeated mistakes
```

---

## 🪝 Auto-Orchestration Hook

**File:** `hooks/detect-project-type.sh`

**Runs:** Every session start (< 50ms)

**Does:**
1. Checks for project markers (*.xcodeproj, package.json, requirements.txt, etc.)
2. Detects project type
3. Loads appropriate agent team
4. Sets evidence requirements
5. Writes `.claude-orchestration-context.md`

**Install:**
```bash
cp hooks/detect-project-type.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/detect-project-type.sh
```

**Configure in `.claude/settings.local.json`:**
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/detect-project-type.sh 2>/dev/null || echo '# Auto-Orchestration: Detection failed'"
          }
        ]
      }
    ]
  }
}
```

---

## 📊 Quick Decision Tree

```
Got a task?
│
├─ Is it a question? → Answer directly (no agents)
│
├─ Is it ideation/exploration?
│  └─ Use: /concept, /ultra-think, or /clarify
│
├─ Is it a code change?
│  │
│  ├─ Simple/focused?
│  │  └─ Use: /enhance (smart task execution)
│  │
│  └─ Complex/multi-step?
│     └─ Use: /orca (full orchestration)
│
└─ Is it design-related?
   ├─ Exploration: /concept
   ├─ Inspiration: /inspire or /discover
   ├─ Brainstorming: /design
   └─ Verification: /visual-review
```

---

## 💡 Pro Tips

**1. Trust Auto-Detection**
- The hook detects your project type automatically
- Loads the right agent team
- Just describe what you want

**2. Use Evidence**
- Screenshots for UI changes
- Test output for functionality
- Build logs for compilation
- No evidence = not done

**3. Leverage Parallel Execution**
- /orca dispatches multiple agents simultaneously
- 3-5x faster than sequential
- Same cost, better results

**4. Save Feedback as Rules**
- /agentfeedback --learn extracts design rules
- Prevents repeating mistakes
- Builds personal design language

**5. Browse the Repo**
- All agents in `agents/*/`
- All commands in `commands/`
- Easy to reference and edit

---

## 📁 File Locations

```
~/.claude/
├── agents/              ← Copy from repo: agents/*
├── commands/            ← Copy from repo: commands/*
├── hooks/               ← Copy from repo: hooks/*
└── settings.local.json  ← Configure hook here

claude-vibe-code/       (this repo)
├── agents/              ← All 12 agents organized by function
├── commands/            ← All 15 slash commands
├── hooks/               ← Auto-detection hook
├── skills/              ← Superpowers plugin skills
├── examples/            ← Real-world examples
└── archive/             ← Historical/deprecated files
```

---

**Need more details?** Check the full README.md or browse specific agent/command files.
