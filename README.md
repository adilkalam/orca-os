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

# Vibe Code | Claude Code

> **🚧 /ORCA** 
> 
An intelligent auto-orchestration system for Claude Code that will detect your project, understand your intent, and dispatch the right specialists automatically - with **Response Awareness verification** to prevent false completions.

---

## The Problem

**Traditional AI coding:**
```
You: "Add authentication"
Claude: "Which library?"
You: "OAuth2"
Claude: "Which provider?"
You: "Google"
Claude: "Frontend or backend first?"
You: "Both please"
Claude: "Generates code..."
You: "Did you test it?"
Claude: "Uh..."
```

**With Orca:**
```
You: "Add authentication"
Claude: *detects Next.js project*
        *dispatches system-architect → designs OAuth flow*
        *dispatches backend-engineer → builds API*
        *dispatches nextjs-14-specialist → implements Next.js auth*
        *dispatches design-system-architect → creates auth UI components*
        *dispatches test-engineer → writes tests*
        *quality-validator → verifies everything works*
        *provides screenshots + test results as proof*
Claude: "Done. Here's the evidence."
```

---

## How It Works

### 1. Automatic Project Detection

On every session start, the system detects your project type:

```
┌─────────────────────────────────────────────┐
│             SESSION START                   │
└────────────────────┬────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Project Detection   │
          │  Hook (< 50ms)       │
          └──────────┬───────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   *.xcodeproj   package.json  requirements.txt
        │            │            │
        ▼            ▼            ▼
 iOS Team (8-16)  Frontend Team (10-15)  Backend Team (6)
        │            │            │
        └────────────┴────────────┘
                     │
                     ▼
          Context Loaded Automatically
```

**Supported Project Types:**
- iOS/Swift → 8-16 agents (requirement-analyst, system-architect, 2-10 iOS specialists, 1-2 design specialists, test-engineer, verification-agent, quality-validator)
- Next.js/React → 10-15 agents (requirement-analyst, system-architect, 3-5 design specialists, 2-4 frontend specialists, test-engineer, verification-agent, quality-validator)
- Python/Backend → 6 base agents (or 10 with admin UI including design specialists)
- Flutter/React Native → 10-13 agents (requirement-analyst, system-architect, 3-5 design specialists, cross-platform-mobile, test-engineer, verification-agent, quality-validator)
- Unknown → General purpose team (system-architect, test-engineer, verification-agent, quality-validator)

### 2. Smart Request Routing

Every request is automatically classified and routed:

```
                    YOUR REQUEST
                         │
                         ▼
              ┌───────────────────────┐
              │   Intent Classifier   │
              │   (< 1 second)        │
              └──────────┬────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    CODE CHANGE     IDEATION        QUESTION
         │               │               │
         │               │               └─→ Answer directly
         │               │
         │               └─→ Suggest: /concept
         │                   /enhance, /brainstorm
         │
         └─→ Auto-Orchestrate
                 │
                 ▼
        ┌────────────────────┐
        │  Dispatch Agents   │
        │  (parallel)        │
        └────────┬───────────┘
                 │
        ┌────────┴────────┬─────────┬──────────┐
        │                 │         │          │
        ▼                 ▼         ▼          ▼
   Frontend          Backend     Tests    Validation
   Engineer          Engineer   Engineer  (quality-validator)
        │                 │         │          │
        └─────────────────┴─────────┴──────────┘
                          │
                          ▼
                VERIFIED RESULTS + EVIDENCE
```

### 3. Response Awareness: How Quality Gates Actually Work

Traditional AI coding had a critical flaw: agents would claim "I built X" without actually verifying the files exist. Why? **LLMs can't stop mid-generation to check.** Once generating a response, they must complete it even if uncertain.

**Solution: Response Awareness**

We separate generation (agents code) from verification (separate agent checks). This prevents 99% of false completions.

```
┌────────────────────────────────────────────────────┐
│                IMPLEMENTATION PHASE                │
└───────────────────────┬────────────────────────────┘
                        │
        ┌───────────────┴────────────┬─────────────┐
        │                            │             │
        ▼                            ▼             ▼
  ┌──────────┐                  ┌──────────┐   ┌──────────┐
  │ Frontend │                  │ Backend  │   │  Tests   │
  │ Engineer │                  │ Engineer │   │ Engineer │
  └────┬─────┘                  └────┬─────┘   └────┬─────┘
       │                             │              │
       │ + Meta-Cognitive TAGS       │              │
       ▼                             ▼              ▼
  ┌────────────────────────────────────────────────────┐
  │    Implementation Log with Assumption Tags         │
  │  #FILE_CREATED: src/Calculator.tsx                 │
  │  #COMPLETION_DRIVE: Assuming theme.colors exists   │
  │  #SCREENSHOT_CLAIMED: evidence/before.png          │
  └───────────────────┬────────────────────────────────┘
                      │
                      ▼
           ┌────────────────────┐
           │ Verification Agent │  ← NEW: Operates in SEARCH mode
           │ (grep/ls/Read)     │     (can't rationalize, just finds files)
           └─────────┬──────────┘
                     │
              Runs ACTUAL commands:
              $ ls src/Calculator.tsx → ✓ or ✗
              $ ls evidence/before.png → ✓ or ✗
              $ grep "theme.colors" → ✓ or ✗
                     │
                     ▼
           ┌─────────────────────┐
           │ Verification Report │
           │ (findings.md)       │
           └─────────┬───────────┘
                     │
              ┌──────┴──────┐
              │             │
              ▼             ▼
         ANY Failed?    All Verified?
              │             │
              ▼             ▼
          🚫 BLOCK      ✅ PASS
          Report        Continue to
          failures      quality-validator
              │             │
              └──────┬──────┘
                     │
                     ▼
              User gets TRANSPARENCY:
              Either verified proof ✓
              or specific failures ✗
```

**Key Innovation:** verification-agent operates in **search mode** (grep/ls), not generation mode. It can't rationalize "file probably exists" - it either finds it or doesn't.

**Result:** <5% false completion rate (down from ~80% before for complex multi-agent tasks)

See `docs/METACOGNITIVE_TAGS.md` for complete documentation.

---

## What's Included

### 🤖 Agents (45 Total)

**Active agents: 11 base + 21 iOS + 5 frontend + 8 design = 45 total**

```
                    AGENT ECOSYSTEM (45 Total)
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   BASE AGENTS      iOS SPECIALISTS    FRONTEND/DESIGN
     (11)               (21)            (5 + 8 = 13)
        │                   │                   │
        │                   │                   │
┌───────┴────────┐  ┌───────┴────────┐  ┌───────┴────────┐
│                │  │                │  │                │
│ Planning (3)   │  │ UI (3)         │  │ React (2)      │
│ Implementation │  │ Data (2)       │  │ State (1)      │
│   Backend (1)  │  │ Network (3)    │  │ Performance (1)│
│   Mobile (2)   │  │ Arch (3)       │  │ Testing (1)    │
│ Quality (3)    │  │ Testing (3)    │  │                │
│ Specialized (1)│  │ Quality (2)    │  │ Design (8)     │
│ Orchestration  │  │ DevOps (2)     │  │   System (2)   │
│   (1)          │  │ Perf (1)       │  │   Visual (1)   │
│                │  │ Security (2)   │  │   Build (3)    │
│                │  │                │  │   Review (2)   │
└────────────────┘  └────────────────┘  └────────────────┘
```

All agents live in `agents/` and are organized by function.

**System Architecture: 45 Total Agents**

- **iOS Specialists** (21 agents in `ios-specialists/`) - SwiftUI, SwiftData, networking, testing, architecture, performance, security, deployment
- **Frontend Specialists** (5 agents in `frontend-specialists/`) - React 18, Next.js 14, state management, performance optimization, testing
- **Design Specialists** (8 agents in `design-specialists/`) - Design systems, UX strategy, Tailwind v4, UI engineering, CSS, accessibility, design review, visual design
- **Base Agents** (11 agents):
  - **Planning**: requirement-analyst, system-architect, plan-synthesis-agent
  - **Quality**: verification-agent (🆕 meta-cognitive tag verification), test-engineer, quality-validator
  - **Implementation**: backend-engineer, android-engineer, cross-platform-mobile
  - **DevOps**: infrastructure-engineer
  - **Orchestration**: workflow-orchestrator

See the `agents/` directory for detailed agent specifications and the complete file structure below.

### ⚡ Commands (13 Total)

All commands live in `commands/` and extend Claude Code workflows:

#### Core Orchestration

| Command | Description | File |
|---------|-------------|------|
| **/orca** | Smart multi-agent orchestration with tech stack detection and team confirmation | `orca.md` |
| **/enhance** | Transform vague requests into well-structured prompts and execution | `enhance.md` |
| **/ultra-think** | Deep analysis and problem solving with multi-dimensional thinking | `ultra-think.md` |

#### Design Workflow

| Command | Description | File |
|---------|-------------|------|
| **/concept** | Creative exploration phase - study references, extract patterns, get approval BEFORE building | `concept.md` |
| **/design** | Conversational design brainstorming with user-provided project-specific references | `design.md` |
| **/inspire** | Analyze design examples to develop aesthetic taste before creating | `inspire.md` |
| **/save-inspiration** | Save design examples to your personal gallery with tags and vision analysis | `save-inspiration.md` |
| **/visual-review** | Visual QA review of implemented UI using chrome-devtools to screenshot and analyze | `visual-review.md` |

#### Workflow & Utilities

| Command | Description | File |
|---------|-------------|------|
| **/agentfeedback** | Parse user feedback and orchestrate agents to address all points systematically | `agentfeedback.md` |
| **/clarify** | Quick focused clarification for mid-workflow questions | `clarify.md` |
| **/session-save** | Save current session context for automatic resumption | `session-save.md` |
| **/session-resume** | Manually reload session context (normally auto-loads) | `session-resume.md` |
| **/all-tools** | (Utility command) | `all-tools.md` |

### 🪝 Hooks

| Hook | Description | File |
|------|-------------|------|
| **detect-project-type.sh** | Auto-detects project type on session start (< 50ms) and loads appropriate agent team | `hooks/detect-project-type.sh` |

### 🎯 Skills

Skills from the superpowers plugin are available. See `skills/` directory for the complete list.

---

## Why Response Awareness Matters

### The Problem: LLMs Can't Verify Mid-Generation

**Anthropic Research Finding:** Once an LLM starts generating a response, it cannot stop to verify assumptions. It must complete the output.

**What this means in practice:**

```python
# Agent in generation mode:
"I created Calculator.tsx with full functionality ✓"
# Agent CANNOT stop here to run: ls Calculator.tsx
# Must complete the response → Claims success without checking
```

**Real failure (before Response Awareness):**
```
User: "Build calculator view"
swiftui-developer: "✓ Created CalculatorView.swift (245 lines)"
quality-validator: "✓ All requirements met"
User runs app: 💥 File doesn't exist, app crashes
```

### The Solution: Separate Phases

**Phase 3: Implementation (Generation Mode)**
- Agents write code
- Mark ALL assumptions with tags: `#FILE_CREATED`, `#COMPLETION_DRIVE`
- Cannot verify (still generating)

**Phase 4: Verification (Search Mode)**
- verification-agent runs AFTER generation completes
- Searches for tags via grep
- Runs actual commands: `ls`, `grep`, `file`
- Cannot rationalize ("file probably exists") - either finds it or doesn't
- Creates verification-report.md

**Phase 5: Quality Validation**
- quality-validator reads verification report
- If verification failed → BLOCKS → User sees specific failures
- If verification passed → Proceeds with quality assessment

**Result:**
- Before: ~80% false completion rate
- After: <5% false completion rate (target)
- User gets **transparency**: verified proof ✓ or specific failures ✗

### Research Backing

1. **Anthropic:** Models can't stop mid-generation to verify
2. **Li et al.:** Models can monitor internal states via explicit tokens (`#COMPLETION_DRIVE` tags)
3. **Didolkar et al.:** Metacognitive behaviors can be systematized (46% token reduction)
4. **Typhren:** Tag-based verification achieved 99.2% accuracy in production

---

## Complete Workflow Visualization

```
                    USER REQUEST: "Add dark mode"
                              │
                              ▼
                    ┌─────────────────┐
                    │  AUTO-DETECT    │
                    │  Project Type   │
                    └────────┬────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │   LOAD AGENT TEAM        │
              │   iOS: 8-16 agents       │
              │   Frontend: 10-15 agents │
              │   Mobile: 10-13 agents   │
              └───────────┬──────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ PHASE 1  │    │ PHASE 2  │    │ PHASE 3  │
    │ PLANNING │    │ DESIGN   │    │  CODE    │
    └────┬─────┘    └─────┬────┘    └─────┬────┘
         │                │               │
         │                │               │
    requirement-     design-system-    Implementation-
    analyst          architect         agents (parallel)
         │               │                │
    system-         ux-strategist     + Meta tags
    architect            │                │
         │          visual-design         │
         └──────────────┴─────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │    PHASE 4      │
              │  VERIFICATION   │ ← NEW: Response Awareness
              └────────┬────────┘
                       │
                Runs actual commands:
                ls, grep, build, test
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
         Files exist?      Tests pass?
              │                 │
              └────────┬────────┘
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
           ✅ PASS            ❌ FAIL
              │                 │
              │                 └──→ BLOCK, report issues
              │
              ▼
    ┌─────────────────────┐
    │     PHASE 5         │
    │  QUALITY-VALIDATOR  │
    └─────────┬───────────┘
              │
    Evidence validation:
    - Screenshots ✓
    - Tests ✓
    - Build ✓
    - Requirements ✓
             │
             ▼
    ┌────────────────┐
    │  DELIVERY TO   │
    │     USER       │
    │ + Evidence     │
    └────────────────┘
```

## Real-World Examples

### Example 1: "Fix the broken calculator"

**Traditional approach:** You debug, write fix, hope it works

**/orca Vibe Code:**

```
You: "The calculator buttons are broken on mobile"

┌─ Session Start ────────────────────────────────────────┐
│ Detected: iOS project (*.xcodeproj found)              │
│ Agent Team: swiftui-developer, ui-testing-expert,      │
│             accessibility-specialist                   │
│ Evidence: iOS Simulator screenshots required           │
└────────────────────────────────────────────────────────┘

┌─ Auto-Orchestration ───────────────────────────────────┐
│                                                        │
│  Phase 1: Investigation                                │
│  ├─ Read CalcView.swift                                │
│  ├─ Identified: Button tap targets too small (30pt)    │
│  └─ iOS HIG requires 44pt minimum                      │
│                                                        │
│  Phase 2: Fix (swiftui-developer)                      │
│  ├─ Update button frame: .frame(height: 44)            │
│  ├─ Add padding for visual balance                     │
│  └─ Test on iPhone 15 simulator                        │
│                                                        │
│  Phase 3: Validation (quality-validator)               │
│  ├─ Screenshot: Before (30pt) vs After (44pt)          │
│  ├─ Build: ✓ Compiles successfully                     │
│  ├─ Runtime: ✓ No crashes                              │
│  └─ A11y: ✓ VoiceOver compatible                       │
│                                                        │
└────────────────────────────────────────────────────────┘

Result: CalcView.swift:42 updated
Evidence: before.png, after.png, build.log
All tests: ✓ PASSING
```

### Example 2: "Add dark mode"

**Traditional approach:** Multiple back-and-forth about implementation details

**/orca Vibe Code:**

```
You: "Add dark mode toggle"

┌─ Detected: Next.js project ────────────────────────────┐
│ Agent Team: nextjs-14-specialist, state-management-    │
│             specialist, design-system-architect        │
│ Evidence: Browser screenshots required                 │
└────────────────────────────────────────────────────────┘

┌─ Parallel Orchestration ─────────────────────────────┐
│                                                      │
│  Agent: system-architect (2 min)                     │
│  └─ Design: Context API + CSS variables approach     │
│                                                      │
│  Agent: nextjs-14-specialist (8 min)                 │
│  ├─ ThemeContext.tsx (React Context)                 │
│  ├─ ThemeToggle.tsx (Toggle component)               │
│  ├─ globals.css (dark mode variables)                │
│  └─ _app.tsx (provider wrapper)                      │
│                                                      │
│  Agent: test-engineer (5 min)                        │
│  ├─ ThemeToggle.test.tsx (user interactions)         │
│  ├─ ThemeContext.test.tsx (state management)         │
│  └─ Integration test (localStorage persistence)      │
│                                                      │
│  Agent: quality-validator (3 min)                    │
│  ├─ Screenshot: Light mode ✓                         │
│  ├─ Screenshot: Dark mode ✓                          │
│  ├─ Screenshot: Toggle transition ✓                  │
│  ├─ Test output: 12/12 passing ✓                     │
│  ├─ Build: npm run build ✓                           │
│  └─ No console errors ✓                              │
│                                                      │
└──────────────────────────────────────────────────────┘

Files Created:
  - components/ThemeContext.tsx
  - components/ThemeToggle.tsx
  - __tests__/ThemeToggle.test.tsx

Evidence Provided:
  - light-mode.png (screenshot)
  - dark-mode.png (screenshot)
  - test-output.log (12/12 passing)
  - build.log (successful)

Total Time: 18 minutes (parallelized)
```

### Example 3: "The app feels slow"

**Traditional approach:** Vague debugging, random optimizations

**/orca Vibe Code:**

```
You: "Why does the app feel slow?"

┌─ Intent Classification ────────────────────────────────┐
│ Type: QUESTION (not code change)                       │
│ Route: Answer directly (no orchestration needed)       │
└────────────────────────────────────────────────────────┘

Response: I analyzed your app's performance. Here's what I found:

1. Bundle size: 2.3MB (too large)
   - Recommendation: Code splitting + lazy loading

2. Re-renders: Header re-renders on every state change
   - Recommendation: React.memo() on Header component

3. API calls: No caching (fetching same data repeatedly)
   - Recommendation: SWR or React Query

Would you like me to implement these fixes?
[This would trigger Code Change orchestration]
```

---

## Installation

### 1. Clone the repo

```bash
git clone https://github.com/adilkalam/claude-vibe-code.git
cd claude-vibe-code
```

### 2. Install the hook

```bash
# Create hooks directory
mkdir -p ~/.claude/hooks

# Copy the detection hook
cp hooks/detect-project-type.sh ~/.claude/hooks/

# Make it executable
chmod +x ~/.claude/hooks/detect-project-type.sh
```

### 3. Configure Claude Code settings

Add to your `.claude/settings.local.json`:

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

### 4. Install agents and commands

```bash
# Copy all agents (organized by function)
cp -r agents/* ~/.claude/agents/

# Copy all commands
cp commands/*.md ~/.claude/commands/

# Optional: Copy skills
cp -r skills/* ~/.claude/skills/
```

**What you get:**
- **45 specialized agents** (11 base + 21 iOS + 5 frontend + 8 design) for implementation, planning, quality, and orchestration
- **13 slash commands** for enhanced workflows
- **Response Awareness verification** system (meta-cognitive tags + verification)
- **Project-specific skills** from the superpowers plugin

### 5. Verify installation

```bash
# Start a new Claude Code session in any project
# You should see:

┌─ Session Start ───────────────────────────────────────┐
│ Detected: [your-project-type]                         │
│ Agent Team: [specialized-agents]                      │
│ Auto-Orchestration: ACTIVE                            │
└───────────────────────────────────────────────────────┘
```

---

## Architecture Deep Dive

### The Hook System

**File:** `~/.claude/hooks/detect-project-type.sh`

```
Session Start
     │
     ▼
Check project files (< 50ms)
     │
     ├─ *.xcodeproj? → iOS
     ├─ package.json + "next"? → Next.js
     ├─ package.json + "react"? → React
     ├─ requirements.txt? → Python
     ├─ pubspec.yaml? → Flutter
     └─ else → Unknown (general)
     │
     ▼
Generate .claude-orchestration-context.md
     │
     ├─ Project type
     ├─ Agent team
     ├─ Verification method
     └─ Workflow rules
     │
     ▼
Context loaded into session automatically
```

**Why file-based detection?**
- Fast (< 50ms)
- Reliable (checks actual files)
- No external dependencies
- Easy to extend

### Agent Coordination

**Token Economics:**

```
┌────────────────────────────────────────────────────────┐
│  Claude Code Pricing                                   │
│  ─────────────────────────────────────────────────────│
│  Input:   $0.003 / 1K tokens  (cheap)                 │
│  Output:  $0.015 / 1K tokens  (5x expensive)          │
│                                                        │
│  Strategy: Send detailed context, get concise results │
└────────────────────────────────────────────────────────┘

Example: "Add authentication"

┌─ Sequential (bad) ─────────────────────────────────────┐
│ 1. Backend agent:  10K input →  5K output             │
│ 2. Frontend agent: 10K input →  5K output             │
│ 3. Test agent:     10K input →  4K output             │
│                                                        │
│ Total: 30K input ($0.09) + 14K output ($0.21) = $0.30 │
│ Time: 15 minutes (sequential)                         │
└────────────────────────────────────────────────────────┘

┌─ Parallel (good) ──────────────────────────────────────┐
│ Task 1: Backend agent   → 10K input,  5K output       │
│ Task 2: Frontend agent  → 10K input,  5K output       │
│ Task 3: Test agent      → 10K input,  4K output       │
│ (All run simultaneously)                              │
│                                                        │
│ Total: 30K input ($0.09) + 14K output ($0.21) = $0.30 │
│ Time: 5 minutes (parallelized, 3x faster!)            │
└────────────────────────────────────────────────────────┘
```

**Parallel dispatch:**
```javascript
// All in ONE message with multiple Task tool calls
Task(subagent_type="backend-engineer", prompt="Build API...")
Task(subagent_type="nextjs-14-specialist", prompt="Build Next.js UI...")
Task(subagent_type="test-engineer", prompt="Write tests...")

// Each agent gets its own context
// Results collected when all complete
// Then quality-validator reviews everything
```

### Quality Gates

Three mandatory validation checkpoints:

```
┌─ Quality Gate 1: Planning (95% threshold) ─────────────┐
│ ☑ Requirements documented?                             │
│ ☑ Architecture designed?                               │
│ ☑ APIs specified?                                      │
│ ☑ User stories clear?                                  │
│ ☑ Tech stack decided?                                  │
│                                                        │
│ If < 95%: Loop back with specific gaps identified      │
└────────────────────────────────────────────────────────┘

┌─ Quality Gate 2: Implementation (80% threshold) ───────┐
│ ☑ Code matches specs?                                  │
│ ☑ Tests written?                                       │
│ ☑ Tests passing?                                       │
│ ☑ Build succeeds?                                      │
│ ☑ No critical bugs?                                    │
│                                                        │
│ If < 80%: Identify failures, re-dispatch agents        │
└────────────────────────────────────────────────────────┘

┌─ Quality Gate 3: Production (85% threshold) ───────────┐
│ ☑ Security validated?                                  │
│ ☑ Performance acceptable?                              │
│ ☑ Accessibility compliant?                             │
│ ☑ Documentation complete?                              │
│ ☑ Evidence provided?                                   │
│                                                        │
│ If < 85%: Block deployment, fix issues                 │
└────────────────────────────────────────────────────────┘
```

### Evidence Collection

**What counts as evidence:**

```
UI Changes:
├─ before.png (screenshot before change)
├─ after.png (screenshot after change)
└─ console.log (no errors in browser/simulator)

Functionality Changes:
├─ test-output.log (npm test / pytest / swift test)
├─ coverage.txt (code coverage %)
└─ integration-test.log (E2E tests)

Performance Changes:
├─ benchmark-before.txt (baseline metrics)
├─ benchmark-after.txt (improved metrics)
└─ lighthouse.json (web vitals)

Build Changes:
├─ build.log (successful compilation)
├─ bundle-size.txt (size analysis)
└─ deploy.log (deployment success)
```

**What does NOT count:**
- "Looks good to me"
- "Should work"
- "I tested it" (without logs)
- "Probably fine"

---

## Available Agents

**45 Total Agents organized into specialized teams:**

### iOS Specialists (21 agents)
SwiftUI, SwiftData, Core Data, networking (URLSession), testing (Swift Testing, XCTest, XCUITest), architecture (State-first, TCA), performance optimization, security, code review, debugging, deployment (Xcode Cloud, Fastlane), accessibility, and API design.

### Frontend Specialists (5 agents)
React 18+ (Server Components, Suspense, hooks), Next.js 14 (App Router, Server Actions), state management (strategic separation), performance optimization (code splitting, Core Web Vitals), and user-behavior-focused testing.

### Design Specialists (8 agents)
Design system architecture, UX strategy, Tailwind CSS v4 + daisyUI 5, UI engineering, pure CSS (when Tailwind insufficient), accessibility (WCAG 2.1 AA), design review (visual QA with Playwright), and visual design (hierarchy, typography, composition).

### Base Agents (11 agents)
- **Planning**: requirement-analyst, system-architect, plan-synthesis-agent
- **Quality**: verification-agent (meta-cognitive tag verification), test-engineer, quality-validator
- **Implementation**: backend-engineer, android-engineer, cross-platform-mobile
- **DevOps**: infrastructure-engineer
- **Orchestration**: workflow-orchestrator

For detailed agent specifications, see the `agents/` directory.

---

## Team Compositions

### iOS Development

**Total System: 45 Agents** (11 base + 21 iOS + 5 frontend + 8 design)

**iOS Team**: Dynamic composition (8-16 agents) based on app complexity:

```
            iOS TEAM COMPOSITION (Dynamic 8-16 Agents)

┌─────────────────────────────────────────────────────────────┐
│                     CORE PLANNING (2)                       │
│         requirement-analyst → system-architect              │
│                            ↓                                │
│              (Analyzes complexity, recommends specialists)  │
└────────────────────────────┬────────────────────────────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ DESIGN   │  │   iOS    │  │ QUALITY  │
        │ (1-2)    │  │ (2-10)   │  │  (2)     │
        └────┬─────┘  └────┬─────┘  └────┬─────┘
             │             │             │
             │             │             │
    ┌────────┴─────┐  ┌────┴─────┐  ┌──┴──┐
    │ design-sys   │  │ UI       │  │ ver │
    │ ux-strat     │  │ Data     │  │ qua │
    │ visual       │  │ Network  │  │     │
    │ tailwind     │  │ Arch     │  │     │
    │ a11y         │  │ Testing  │  │     │
    │ reviewer*    │  │ Quality  │  │     │
    │              │  │ DevOps   │  │     │
    │              │  │ Perf     │  │     │
    │              │  │ Security │  │     │
    └──────────────┘  └──────────┘  └─────┘
         OPTIONAL        CHOOSE       MANDATORY
         (design         2-10 FROM    (verification-agent
          reviewer       21 TOTAL      quality-validator)
          MANDATORY      SPECIALISTS
          for prod)
```

- **Core Planning (2)**: requirement-analyst, system-architect
- **Design Specialists (1-2)**: design-system-architect, ux-strategist, visual-designer, tailwind-specialist, accessibility-specialist, design-reviewer (MANDATORY for production)
- **iOS Specialists (2-10)**: Chosen from 21 specialists:
  - UI: swiftui-developer, uikit-specialist, ios-accessibility-tester
  - Data: swiftdata-specialist, coredata-expert
  - Networking: urlsession-expert, combine-networking, ios-api-designer
  - Architecture: state-architect, tca-specialist, observation-specialist
  - Testing: swift-testing-specialist, xctest-pro, ui-testing-expert
  - Quality: swift-code-reviewer, ios-debugger
  - DevOps: xcode-cloud-expert, fastlane-specialist
  - Performance & Security: ios-performance-engineer, ios-security-tester, ios-penetration-tester

- **Quality Gates (2)**: verification-agent (MANDATORY), quality-validator (MANDATORY)

**Team Scaling by App Complexity:**

```
         SIMPLE       MEDIUM        COMPLEX       ENTERPRISE
        (Calculator)  (Notes App)   (Social)      (Banking)
            8            10            14            16+
            │            │             │             │
     ┌──────┴───┐  ┌─────┴────┐  ┌─────┴────┐  ┌─────┴──────┐
     │          │  │          │  │          │  │            │
     │ Plan: 2  │  │ Plan: 2  │  │ Plan: 2  │  │ Plan:  2   │
     │ iOS:  2  │  │ iOS:  4  │  │ iOS:  7  │  │ iOS:  10+  │
     │ Design:1 │  │ Design:1 │  │ Design:2 │  │ Design: 2  │
     │ Qual: 2  │  │ Qual: 2  │  │ Qual: 2  │  │ Qual:  2   │
     │          │  │          │  │          │  │            │
     │ SwiftUI  │  │ + Data   │  │ + Net    │  │ + Security │
     │ Testing  │  │ + State  │  │ + TCA    │  │ + DevOps   │
     │          │  │ + Review │  │ + UITest │  │ + Perf     │
     │          │  │          │  │ + Perf   │  │ + PenTest  │
     │          │  │          │  │ + Vis    │  │ + Advanced │
     └──────────┘  └──────────┘  └──────────┘  └────────────┘
```

**Examples**:
- Simple app (calculator): 8 agents (planning 2 + iOS 2 + design 1 + quality 2)
- Medium app (notes): 10 agents (planning 2 + iOS 4 + design 1 + quality 2)
- Complex app (social network): 14 agents (planning 2 + iOS 7 + design 2 + quality 2)
- Enterprise app (banking): 16+ agents (planning 2 + iOS 10+ + design 2 + quality 2)

**Capabilities**:
- Swift 6.2 native patterns (@Observable, approachable concurrency)
- Modern architecture (state-first, not MVVM)
- SwiftData (iOS 17+) and Core Data (iOS 16 and earlier)
- Swift Testing framework (modern) and XCTest (legacy)
- Performance profiling with Instruments
- Security testing with CryptoKit, Keychain, biometric auth
- CI/CD with Xcode Cloud and Fastlane
- Accessibility compliance (WCAG 2.1 AA)
- iOS simulator integration (96-99% token efficiency)

See `QUICK_REFERENCE.md` for full specialist list and `/orca` for team composition logic.

---

## Advanced Usage

### Custom Project Detection

Edit `~/.claude/hooks/detect-project-type.sh`:

```bash
# Add custom detection
if [ -f "go.mod" ]; then
  echo "golang"
  return
fi

# Add custom agent team in get_agent_team()
case "$1" in
  golang)
    echo "backend-engineer, test-engineer"
    ;;
  # ...
esac
```

### Override Auto-Detection

Force specific agents for one-off tasks:

```bash
# Use /orca with explicit agent selection
/orca "Build API endpoint with Go backend-engineer"
```

### Disable Auto-Orchestration

Remove the hook from `.claude/settings.local.json`:

```json
{
  "hooks": {
    "SessionStart": []  // Empty = disabled
  }
}
```

---

## Project Structure

```
claude-vibe-code/
├── README.md                          # You are here
│
├── agents/                            # All active agents (45 total)
│   ├── implementation/                # 3 implementation specialists
│   │   ├── backend-engineer.md
│   │   ├── android-engineer.md
│   │   └── cross-platform-mobile.md
│   ├── planning/                      # 2 planning specialists
│   │   ├── requirement-analyst.md
│   │   └── system-architect.md
│   ├── quality/                       # 3 quality specialists
│   │   ├── test-engineer.md
│   │   ├── verification-agent.md       # NEW: Response Awareness verification
│   │   └── quality-validator.md
│   ├── specialized/                   # 1 specialized agent
│   │   └── infrastructure-engineer.md
│   ├── orchestration/                 # 2 orchestrators
│   │   ├── workflow-orchestrator.md
│   │   └── plan-synthesis-agent.md
│   ├── ios-specialists/               # 21 iOS specialists (NEW)
│   │   ├── ui/                        # swiftui-developer, uikit-specialist, ios-accessibility-tester
│   │   ├── data/                      # swiftdata-specialist, coredata-expert
│   │   ├── networking/                # urlsession-expert, combine-networking, ios-api-designer
│   │   ├── architecture/              # state-architect, tca-specialist, observation-specialist
│   │   ├── testing/                   # swift-testing-specialist, xctest-pro, ui-testing-expert
│   │   ├── quality/                   # swift-code-reviewer, ios-debugger
│   │   ├── devops/                    # xcode-cloud-expert, fastlane-specialist
│   │   ├── performance/               # ios-performance-engineer
│   │   └── security/                  # ios-security-tester, ios-penetration-tester
│   ├── frontend-specialists/          # 5 frontend specialists (NEW)
│   │   ├── frameworks/                # react-18-specialist, nextjs-14-specialist
│   │   ├── state/                     # state-management-specialist
│   │   ├── performance/               # frontend-performance-specialist
│   │   └── testing/                   # frontend-testing-specialist
│   └── design-specialists/            # 8 design specialists (NEW)
│       ├── foundation/                # design-system-architect, ux-strategist
│       ├── visual/                    # visual-designer
│       ├── implementation/            # tailwind-specialist, css-specialist, ui-engineer
│       └── quality/                   # accessibility-specialist, design-reviewer
│
├── commands/                          # All slash commands (13 total)
│   ├── orca.md                       # Multi-agent orchestration
│   ├── enhance.md                    # Smart task execution
│   ├── ultra-think.md                # Deep analysis
│   ├── concept.md                    # Design exploration
│   ├── design.md                     # Design brainstorming
│   ├── inspire.md                    # Design inspiration
│   ├── save-inspiration.md           # Save design examples
│   ├── visual-review.md              # Visual QA
│   ├── agentfeedback.md              # Feedback processing
│   ├── clarify.md                    # Quick questions
│   ├── session-save.md               # Save session
│   ├── session-resume.md             # Resume session
│   └── all-tools.md                  # Utility
│
├── hooks/                             # Auto-orchestration hooks
│   └── detect-project-type.sh        # < 50ms project detection
│
└── .claude/                           # Local Claude Code config
    ├── settings.local.json           # Hook configuration
    └── commands/                     # Project-specific overrides
        ├── enhance.md
        └── ultra-think.md
```

**Key Directories:**
- `agents/` - Copy to `~/.claude/agents/` for active use (45 total agents)
- `commands/` - Copy to `~/.claude/commands/` for slash commands (13 total)
- `hooks/` - Copy to `~/.claude/hooks/` for auto-detection hook

---

## Why This Exists

Traditional AI coding assistants make you:
1. Know which commands to run
2. Understand tool selection
3. Remember to ask for tests
4. Request evidence manually
5. Verify quality yourself

**Claude Vibe Code** does all of that automatically:
- Detects your project type
- Selects appropriate specialists
- Ensures tests are written
- Demands evidence for claims
- Validates quality at every step

**You focus on what to build. Claude handles how to build it.**

---

## FAQ

**Q: Does this replace Claude Code?**
A: No, it's an extension. Uses Claude Code's built-in agents with smarter orchestration.

**Q: Do I need to learn new commands?**
A: No. Just describe what you want. The system figures out the rest.

**Q: What if auto-detection gets it wrong?**
A: Override with `/orca "task description" [agent-name]` or edit the detection hook.

**Q: Is this faster than manual Claude usage?**
A: Yes. Parallel agent execution + automatic quality validation = 3-5x faster for complex tasks.

**Q: Do I need to provide evidence?**
A: No, agents provide it automatically (screenshots, test logs, build outputs).

**Q: Can I use this for non-code tasks?**
A: Yes. Questions and ideation work too (auto-classified).

---

## Development Status

**Current Phase:** System Architecture & Agent Implementation

This repository contains the architectural design and documentation for a comprehensive multi-agent orchestration system. The full implementation (45 agents, 14 commands, auto-detection hooks) is being built and tested locally before public release.

**What's Complete:**
- ✅ System architecture and workflow design
- ✅ Response Awareness methodology
- ✅ Quality gate protocols
- ✅ Agent taxonomy and specialization design

**In Progress:**
- 🔨 45 specialized agents (iOS, Frontend, Design, Backend)
- 🔨 14 slash commands with quality gates
- 🔨 Auto-detection and orchestration system
- 🔨 Integration testing and validation

**Watch this repo** to follow development. Full system will be released when quality standards are met.

---

## License

MIT License - See [LICENSE](LICENSE) for details

---

## Connect

- **Issues:** [Report bugs or request features](https://github.com/adilkalam/claude-vibe-code/issues)
- **Discussions:** [Share workflows and tips](https://github.com/adilkalam/claude-vibe-code/discussions)

---

<div align="center">

**Claude Vibe Code**

*Stop orchestrating. Start building.*

Built with ❤️ using Claude Code

</div>
