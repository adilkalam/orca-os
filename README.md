  ```
           _______                   _____                    _____                    _____          
          /::\    \                 /\    \                  /\    \                  /\    \         
         /::::\    \               /::\    \                /::\    \                /::\    \        
        /::::::\    \             /::::\    \              /::::\    \              /::::\    \       
       /::::::::\    \           /::::::\    \            /::::::\    \            /::::::\    \      
      /:::/~~\:::\    \         /:::/\:::\    \          /:::/\:::\    \          /:::/\:::\    \     
     /:::/    \:::\    \       /:::/__\:::\    \        /:::/  \:::\    \        /:::/__\:::\    \    
    /:::/    / \:::\    \     /::::\   \:::\    \      /:::/    \:::\    \      /::::\   \:::\    \   
   /:::/____/   \:::\____\   /::::::\   \:::\    \    /:::/    / \:::\    \    /::::::\   \:::\    \  
  |:::|    |     |:::|    | /:::/\:::\   \:::\____\  /:::/    /   \:::\    \  /:::/\:::\   \:::\    \ 
  |:::|____|     |:::|    |/:::/  \:::\   \:::|    |/:::/____/     \:::\____\/:::/  \:::\   \:::\____\
   \:::\    \   /:::/    / \::/   |::::\  /:::|____|\:::\    \      \::/    /\::/    \:::\  /:::/    /
    \:::\    \ /:::/    /   \/____|:::::\/:::/    /  \:::\    \      \/____/  \/____/ \:::\/:::/    / 
     \:::\    /:::/    /          |:::::::::/    /    \:::\    \                       \::::::/    /  
      \:::\__/:::/    /           |::|\::::/    /      \:::\    \                       \::::/    /   
       \::::::::/    /            |::| \::/____/        \:::\    \                      /:::/    /    
        \::::::/    /             |::|  ~|               \:::\    \                    /:::/    /     
         \::::/    /              |::|   |                \:::\    \                  /:::/    /      
          \::/____/               \::|   |                 \:::\____\                /:::/    /       
                                   \:|   |                  \::/    /                \::/    /        
                                    \|___|                   \/____/                  \/____/         
                                                                                                    
```

*Vibe-code multi-agent orchestration with Claude Code*

---

## ⚡ Quick Start

```bash
# Main command - orchestrates everything
/orca "Add a dark mode toggle to settings"

  
# Support command - assists in engineering a prompt and triggers orchestration
/enhance "Add loigin feature to iOS app"


# Deep analysis - no code changes
/ultra-think "Why is the app slow?"
```

**What happens automatically:**
- ✅ Orchestrates specialized agents (iOS, SwiftUI, QA)
- ✅ Requires evidence for all work (screenshots, tests)
- ✅ Verifies 100% completion before presenting
- ✅ Never shows broken or incomplete work

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        YOUR REQUEST                             │
│                     "Add dark mode toggle"                      │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────────────┐
│                   WORKFLOW ORCHESTRATOR                        │
│  • Saves your exact words to .orchestration/user-request.md    │
│  • Creates work plan in manageable pieces                      │
│  • Dispatches specialized agents                               │
│  • Maintains your perspective throughout                       │
└─────────────────┬──────────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┬─────────────┐
        ▼                   ▼             ▼
  ┌───────────┐       ┌───────────┐    ┌───────────┐
  │ ios-expert│       │  swiftui  │    │  quality  │
  │           │       │  -expert  │    │   -gate   │
  │ • Swift   │       │ • Layouts │    │ • Verifies│
  │ • Async   │       │ • Anims   │    │ • Evidence│
  │ • Testing │       │ • A11y    │    │ • Blocks  │
  └─────┬─────┘       └─────┬─────┘    └─────┬─────┘
        │                   │                │
        └─────────┬─────────┴────────────────┘
                  ▼
    ┌──────────────────────────────────────────┐
    │          EVIDENCE COLLECTION             │
    │  📸 Screenshots of UI changes            │
    │  ✅ Test output and build logs           │
    │  📊 Performance measurements             │
    └──────────────┬───────────────────────────┘
                   ▼
    ┌──────────────────────────────────────────┐
    │         QUALITY GATE (100%)              │
    │  ✓ All requirements verified             │
    │  ✓ Evidence for every claim              │
    │  ✓ No failures, no partial work          │
    └──────────────┬───────────────────────────┘
                   ▼
    ┌──────────────────────────────────────────┐
    │           RESULTS TO YOU                 │
    │  Complete, tested, proven solution       │
    └──────────────────────────────────────────┘
```

---

## 🎯 Key Features

### Maintains Your Perspective
```
┌──────────────────────────────────────────────────────┐
│ .orchestration/user-request.md                       │
│ ──────────────────────────────────────────────────── │
│ "The text is too small - I can't read it"            │
│                                                      │
│ ✓ Saved verbatim                                     │
│ ✓ Re-read by orchestrator before each decision       │
│ ✓ Agents reference YOUR words, not interpretations   │
└──────────────────────────────────────────────────────┘
```

### Evidence-Based Verification
```
┌─────────────────────────────────────────────────────┐
│ .orchestration/evidence/                            │
│ ─────────────────────────────────────────────────── │
│ before.png  ────►  Font size: 12pt (unreadable)     │
│ after.png   ────►  Font size: 18pt (readable)       │
│ test.log    ────►  ✓ All tests passing              │
│                                                     │
│ No evidence = Not done                              │
└─────────────────────────────────────────────────────┘
```

### Quality Gate (100% Required)
```
┌──────────────────────────────────────────────┐
│ Verification Table                           │
│ ──────────────────────────────────────────── │
│ ✅ Font increased to 18pt                    │
│ ✅ Screenshot shows readable text            │
│ ✅ Accessibility tested                      │
│ ✅ Dark mode works                           │
│ ✅ Tests passing                             │
│                                              │
│ Status: 100% Complete → Present to user      │
└──────────────────────────────────────────────┘
```

---

## 📁 Agent Structure

```
.claude/agents/
│
├── workflow-orchestrator.md  (61 lines)
│   ├─ Coordinates all work
│   ├─ Never implements anything
│   ├─ Maintains user perspective
│   └─ Dispatches specialized agents
│
├── ios-expert.md  (370 lines)
│   ├─ Swift 5.9+ async/await
│   ├─ Networking & Core Data
│   ├─ Testing & App Store
│   └─ Performance optimization
│
├── swiftui-expert.md  (337 lines)
│   ├─ Advanced animations
│   ├─ Custom layouts & grids
│   ├─ Accessibility excellence
│   └─ Platform adaptive design
│
└── quality-gate.md  (66 lines)
    ├─ 100% verification required
    ├─ Evidence validation
    ├─ Blocks incomplete work
    └─ Final approval gate
```

---

## 📊 What's New

Rebuilt from the ground up to solve orchestration failures:

| **Before** | **After** |
|------------|-----------|
| 1,284 line agents | <400 lines |
| Guidelines buried | Critical rules first |
| ~40% completion | 100% required |
| No verification | Evidence mandatory |
| Frame switching | User perspective locked |
| Complex coordination | Simple file-based |

**Key Improvements:**
- Agent prompts streamlined (1,284 → <400 lines)
- Context usage optimized (20K → <5K tokens)
- Completion rate enforced (40% → 100%)
- Frame maintenance automated (re-read user request)
- Evidence collection required for all claims

---

## 💼 File-Based Coordination

```
.orchestration/
├── user-request.md      ← Your exact words (never interpreted)
├── work-plan.md         ← Broken into 2-hour pieces
├── agent-log.md         ← What each agent did + evidence
└── evidence/
    ├── before.png       ← Screenshot before changes
    ├── after.png        ← Screenshot after changes
    └── tests.log        ← Proof functionality works
```

**Why file-based?**
- ✓ Simple coordination without message passing
- ✓ Clear handoffs between agents
- ✓ Persistent context across sessions
- ✓ Easy to debug (just read the files)
- ✓ Evidence naturally organized

---

## 🚀 Examples

### Add a Feature
```bash
/enhance "Add a logout button to the profile"
```
**Result:**
- Button added with proper styling
- Screenshot showing button in context
- Tap handler tested and verified
- Accessibility labels added
- Evidence: `profile-logout.png`, `tests.log`

### Fix a Problem
```bash
/enhance "The text is too small to read"
```
**Result:**
- Font size increased from 12pt → 18pt
- Before/after screenshots provided
- Measurements documented
- Dark mode verified
- Evidence: `before.png`, `after.png`, `measurements.txt`

### Analyze Without Changing
```bash
/ultra-think "Why does the calculator feel confusing?"
```
**Result:**
- Multi-dimensional analysis
- UX principles evaluated
- Design patterns examined
- Concrete recommendations
- No code changes made

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [Quick Start](docs/QUICKSTART.md) | Examples and usage patterns |
| [Architecture](docs/ARCHITECTURE.md) | How the system works internally |
| [Setup](docs/SETUP.md) | Installation and configuration |
| [Workflows](docs/WORKFLOWS.md) | Common development patterns |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Debug help and FAQ |
| [Design Guidelines](docs/DESIGN-GUIDELINES.md) | Universal design patterns |
| [SwiftUI Design System](docs/SWIFTUI-DESIGN-SYSTEM.md) | iOS-specific patterns |

---

## 🛠️ Extending the System

The orchestration system is designed to be extended:

1. **Add new agents**: Create markdown files in `.claude/agents/`
2. **Add commands**: Create markdown in `.claude/commands/`
3. **Keep agents focused**: Under 400 lines, single responsibility
4. **Critical rules first**: Most important info in first 30 lines
5. **Always require evidence**: Screenshots, tests, measurements

**Agent Template:**
```markdown
---
name: my-expert
description: What this agent does (use PROACTIVELY for X)
tools: Read, Edit, Bash, Grep
---

# My Expert

## CRITICAL RULES (READ FIRST)

1. Read .orchestration/user-request.md BEFORE starting
2. Evidence required for all work
3. No claims without proof

## [Rest of agent definition]
```

---

## 📈 Performance Metrics

**Context Efficiency:**
- Agent prompts: 1,284 → 370 lines (71% reduction)
- Context per iteration: 20K → <5K tokens (75% reduction)
- Agent invocations: Multiple → Single dispatch

**Quality Improvements:**
- Completion rate: ~40% → 100% enforced
- Frame maintenance: Manual → Automated
- Evidence collection: Optional → Mandatory
- Verification: ~40% → 100% required

---

## 🎨 Design Philosophy

```
┌──────────────────────────────────────────────────────┐
│  "Built to solve actual problems,                    │
│   not just complete tasks."                          │
│                                                      │
│  • User perspective maintained throughout            │
│  • Evidence required for all claims                  │
│  • 100% verification before presenting               │
│  • No broken work ever shown                         │
└──────────────────────────────────────────────────────┘
```

**Core Values:**
1. **User truth**: Your exact words are the specification
2. **Evidence-based**: No claims without proof
3. **Quality gate**: 100% complete or block
4. **Transparency**: All work logged and visible

---

## 📄 License

MIT

---

## 🤝 Contributing

Contributions welcome! The system is intentionally simple:
- Agents are markdown files with clear structure
- Coordination is file-based (no complex protocols)
- Evidence is required for all changes
- Quality gates enforce completion

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

---

<div align="center">

**Vibe with Orca**

*Native agent orchestration

Built with [Claude Code](https://claude.com/claude-code)

</div>
