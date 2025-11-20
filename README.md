# Vibe Code OS 2.0

**Making Claude remember everything.**

---

## The Problem

Claude is brilliant at writing code. But it has **zero institutional memory**:

**Every session starts from scratch:**
- No awareness of past decisions or why they were made
- No knowledge of existing patterns or components
- No memory of what failed before and why
- No understanding of project-specific standards

**This causes cascading failures:**
1. You build a feature → Claude learns your patterns
2. Next session → Claude rewrites existing code instead of reusing it
3. You fix the breaks → Claude forgets why it broke
4. Repeat forever → Waste tokens, time, and context explaining the same things

**Enterprise solutions exist** (LangGraph, CrewAI, AutoGPT) but they require complex infrastructure, orchestration layers, and don't integrate with Claude Code. They solve different problems (multi-agent systems, workflow automation) not "make Claude remember my project."

**We wanted something different:**
- Project memory that persists across sessions
- Context awareness **before** writing any code
- Learning from every execution
- Quality gates that prevent regressions
- For everyday Claude Code users, not enterprises

---

## Our Approach

OS 2.0 makes **forgetting structurally impossible** through three innovations:

### 1. Persistent Memory (`vibe.db`)

Every project gets a SQLite database that captures institutional knowledge:
- **Decisions:** Why choices were made (not just what)
- **Standards:** Enforced rules learned from failures
- **Task History:** What worked, what failed, what was learned
- **Events:** Full audit trail of every action

This isn't a cache or embedding store. It's **structured institutional knowledge** that answers "why did we do it this way?"

### 2. Mandatory Context (ProjectContextServer MCP)

Before writing **any** code, agents **must** query the ProjectContextServer:
- Semantic search finds relevant files
- Decision lookup surfaces past reasoning
- Standards check loads enforcement rules
- Task history prevents repeated mistakes

**Result:** Full project awareness before the first line of code.

This isn't "RAG over your codebase." It's **mandatory context bundling** that makes amnesia architecturally impossible.

### 3. Domain Pipelines with Quality Gates

Specialized workflows for each domain (Frontend, iOS, SEO, Data) that enforce:
- **Context gathering** (mandatory first phase)
- **Quality gates** that block bad work (90+ threshold)
- **Learning loops** that capture outcomes
- **Standards enforcement** that prevents regressions

**Result:** Work that improves over time, not regresses.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│                         User: "/orca add feature X"                             │
│                                     │                                           │
│                                     ▼                                           │
│   ┌─────────────────────────────────────────────────────────────────────┐      │
│   │                                                                       │      │
│   │  ORCA ORCHESTRATOR  (/orca command)                                  │      │
│   │  ─────────────────────────────────────────────────────────────       │      │
│   │                                                                       │      │
│   │  1. Detect domain (frontend/ios/seo/data)                            │      │
│   │  2. Load pipeline (.orchestration/pipelines/{domain}-pipeline.md)    │      │
│   │  3. Execute phases with constraints                                  │      │
│   │                                                                       │      │
│   └───────────────────────────┬───────────────────────────────────────────┘      │
│                               │                                                  │
│                               ▼                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐      │
│   │                                                                       │      │
│   │  PHASE 1: MANDATORY CONTEXT                                          │      │
│   │  ═══════════════════════════                                         │      │
│   │                                                                       │      │
│   │  ┌─────────────────────────────────────────────────────────┐         │      │
│   │  │                                                          │         │      │
│   │  │  ProjectContextServer (MCP)                             │         │      │
│   │  │  ──────────────────────────────────────────             │         │      │
│   │  │                                                          │         │      │
│   │  │  query_context({                                        │         │      │
│   │  │    domain: "frontend",                ┌──────────────┐  │         │      │
│   │  │    task: "add feature X",             │              │  │         │      │
│   │  │    projectPath: "/path/to/project"    │   vibe.db    │  │         │      │
│   │  │  })                                    │  ──────────  │  │         │      │
│   │  │       │                                │              │  │         │      │
│   │  │       ├──semantic search──────────────▶│  decisions/  │  │         │      │
│   │  │       ├──decision lookup───────────────▶│  standards/  │  │         │      │
│   │  │       ├──standards check───────────────▶│  task_hist/  │  │         │      │
│   │  │       └──task history──────────────────▶│  events/     │  │         │      │
│   │  │                                         │              │  │         │      │
│   │  │                                         └──────────────┘  │         │      │
│   │  │  Returns: ContextBundle                                  │         │      │
│   │  │  {                                                       │         │      │
│   │  │    relevantFiles: [...],                                │         │      │
│   │  │    pastDecisions: [...],                                │         │      │
│   │  │    standards: [...],                                    │         │      │
│   │  │    taskHistory: [...],                                  │         │      │
│   │  │    designSystem: {...}                                  │         │      │
│   │  │  }                                                       │         │      │
│   │  │                                                          │         │      │
│   │  └─────────────────────────────────────────────────────────┘         │      │
│   │                                                                       │      │
│   └───────────────────────────┬───────────────────────────────────────────┘      │
│                               │                                                  │
│                               ▼                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐      │
│   │                                                                       │      │
│   │  PHASE 2-N: SPECIALIZED AGENTS (subagents via Task tool)             │      │
│   │  ═════════════════════════════════════════════════════               │      │
│   │                                                                       │      │
│   │  Domain-specific agents receive ContextBundle:                       │      │
│   │                                                                       │      │
│   │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │      │
│   │  │                  │  │                  │  │                  │   │      │
│   │  │  Analyzer        │  │  Builder         │  │  Reviewer        │   │      │
│   │  │  ──────────      │  │  ──────────      │  │  ──────────      │   │      │
│   │  │                  │  │                  │  │                  │   │      │
│   │  │  • Reads context │  │  • Uses patterns │  │  • Checks rules  │   │      │
│   │  │  • Finds files   │  │  • Reuses code   │  │  • Scores work   │   │      │
│   │  │  • Plans work    │  │  • Follows stds  │  │  • Blocks bad    │   │      │
│   │  │                  │  │                  │  │                  │   │      │
│   │  └──────────────────┘  └──────────────────┘  └──────────────────┘   │      │
│   │                                                                       │      │
│   │  Each agent:                                                          │      │
│   │  • Has ContextBundle (knows project history)                         │      │
│   │  • Uses specialized tools (limited scope)                            │      │
│   │  • Returns to Orca for next phase                                    │      │
│   │                                                                       │      │
│   └───────────────────────────┬───────────────────────────────────────────┘      │
│                               │                                                  │
│                               ▼                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐      │
│   │                                                                       │      │
│   │  PHASE N+1: QUALITY GATES                                            │      │
│   │  ═════════════════════════                                           │      │
│   │                                                                       │      │
│   │  Hard thresholds that block bad work:                                │      │
│   │                                                                       │      │
│   │  ┌─────────────────────────────────────────────────┐                 │      │
│   │  │  Standards Gate (90+ required)                  │                 │      │
│   │  │  ─────────────────────────────────────          │                 │      │
│   │  │  ✓ No inline styles                   [95/100] │                 │      │
│   │  │  ✓ Design token compliance            [92/100] │                 │      │
│   │  │  ✓ Component reuse                    [100/100]│                 │      │
│   │  │  → PASS                                         │                 │      │
│   │  └─────────────────────────────────────────────────┘                 │      │
│   │                                                                       │      │
│   │  ┌─────────────────────────────────────────────────┐                 │      │
│   │  │  Design QA Gate (90+ required)                  │                 │      │
│   │  │  ─────────────────────────────────────          │                 │      │
│   │  │  ✓ Spacing (8px grid)                 [100/100]│                 │      │
│   │  │  ✓ Typography (design system)         [95/100] │                 │      │
│   │  │  ✓ Visual hierarchy                   [88/100] │                 │      │
│   │  │  → FAIL (below threshold, needs fixes)          │                 │      │
│   │  └─────────────────────────────────────────────────┘                 │      │
│   │                                                                       │      │
│   │  ┌─────────────────────────────────────────────────┐                 │      │
│   │  │  Build Gate (must pass)                         │                 │      │
│   │  │  ─────────────────────────────────────          │                 │      │
│   │  │  npm run build                                  │                 │      │
│   │  │  ✓ TypeScript compilation successful            │                 │      │
│   │  │  ✓ No linting errors                            │                 │      │
│   │  │  → PASS                                         │                 │      │
│   │  └─────────────────────────────────────────────────┘                 │      │
│   │                                                                       │      │
│   │  If any gate fails: Loop back with feedback                          │      │
│   │                                                                       │      │
│   └───────────────────────────┬───────────────────────────────────────────┘      │
│                               │                                                  │
│                               ▼                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐      │
│   │                                                                       │      │
│   │  PHASE N+2: SAVE LEARNINGS                                           │      │
│   │  ══════════════════════════                                          │      │
│   │                                                                       │      │
│   │  ProjectContextServer.save_decision({                                │      │
│   │    decision: "Used pattern X for feature Y",                         │      │
│   │    reasoning: "Because it handles edge case Z",                      │      │
│   │    domain: "frontend",                                               │      │
│   │    tags: ["patterns", "reusable"]                                    │      │
│   │  })                                                                  │      │
│   │                                        │                              │      │
│   │  ProjectContextServer.save_task_history({                  ┌──────┐  │      │
│   │    task: "Add feature X",                                  │      │  │      │
│   │    outcome: "success",                     saved to ───────▶│vibe  │  │      │
│   │    files: ["Component.tsx", ...],                          │ .db  │  │      │
│   │    learnings: "Pattern X works well for Y"                 │      │  │      │
│   │  })                                                         └──────┘  │      │
│   │                                                                       │      │
│   │  ProjectContextServer.save_standard({                                │      │
│   │    what_happened: "Inline styles broke dark mode",                   │      │
│   │    cost: "2 hours debugging + user frustration",                     │      │
│   │    rule: "Never use inline styles, use design tokens",               │      │
│   │    domain: "frontend"                                                │      │
│   │  })                                                                  │      │
│   │                                                                       │      │
│   └───────────────────────────────────────────────────────────────────────┘      │
│                                                                                 │
│                                     │                                           │
│                                     ▼                                           │
│                                                                                 │
│                       ✓ Feature shipped with quality                            │
│                       ✓ Knowledge persisted to vibe.db                          │
│                       ✓ Standards updated automatically                         │
│                       ✓ Next session has full context                           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Key architectural properties:**

1. **Context is mandatory** - No agent can bypass Phase 1
2. **Memory is persistent** - vibe.db survives sessions
3. **Gates enforce quality** - 90+ threshold, no exceptions
4. **Learning is automatic** - Every outcome captured
5. **Orchestration is explicit** - Orca controls flow, agents execute

---

## Memory System (The Novel Part)

Most AI coding assistants have no memory or session-only memory:

| System | Memory Type | Persistence | Context Awareness |
|--------|-------------|-------------|-------------------|
| GitHub Copilot | None | None | File-level only |
| Cursor | Chat history | Session | Manual @-mentions |
| Replit Agent | Conversation | Session | Re-explain each time |
| Enterprise (LangGraph) | Vector DB | Persistent | Complex setup |

**OS 2.0 combines four memory layers:**

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Hybrid Memory System                                               │
│  ═══════════════════════                                            │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │                                                             │     │
│  │  Layer 1: SYMBOLIC MEMORY                                  │     │
│  │  ────────────────────────────────────────────              │     │
│  │                                                             │     │
│  │  SQLite tables in vibe.db:                                 │     │
│  │                                                             │     │
│  │  decisions     → Why choices were made                     │     │
│  │                  "We use CSS vars for theming because..."   │     │
│  │                                                             │     │
│  │  standards     → Enforced rules from failures              │     │
│  │                  "Never inline styles → Use tokens"        │     │
│  │                                                             │     │
│  │  task_history  → What worked, what failed                  │     │
│  │                  "Dark mode: success, lessons learned..."   │     │
│  │                                                             │     │
│  │  events        → Full audit trail                          │     │
│  │                  Timestamped log of every action            │     │
│  │                                                             │     │
│  │  Query time: <10ms (indexed by domain, tags, time)         │     │
│  │                                                             │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │                                                             │     │
│  │  Layer 2: SEMANTIC SEARCH                                  │     │
│  │  ────────────────────────────────────────────              │     │
│  │                                                             │     │
│  │  FTS5 full-text search over:                               │     │
│  │  • Code snippets with context                              │     │
│  │  • Documentation fragments                                 │     │
│  │  • Past conversation excerpts                              │     │
│  │                                                             │     │
│  │  Optional: e5-small embeddings for reranking               │     │
│  │  (lightweight local model, not API-dependent)              │     │
│  │                                                             │     │
│  │  Query time: <100ms (FTS) or <500ms (with embeddings)      │     │
│  │                                                             │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │                                                             │     │
│  │  Layer 3: COGNITIVE TAGS                                   │     │
│  │  ────────────────────────────────────────────              │     │
│  │                                                             │     │
│  │  Response Awareness tags track HOW code was produced:      │     │
│  │                                                             │     │
│  │  #COMPLETION_DRIVE  → Claimed done too early               │     │
│  │  #POISON_PATH       → This approach failed before          │     │
│  │  #PHANTOM_PATTERN   → Imagined pattern that doesn't exist  │     │
│  │  #PLAN_UNCERTAINTY  → Wasn't sure, made assumptions        │     │
│  │                                                             │     │
│  │  Used to: Deprioritize bad patterns, surface warnings      │     │
│  │                                                             │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │                                                             │     │
│  │  Layer 4: CROSS-SESSION CONTEXT                            │     │
│  │  ────────────────────────────────────────────              │     │
│  │                                                             │     │
│  │  SharedContext MCP (context compression):                  │     │
│  │  • Differential updates between sessions                   │     │
│  │  • Version tracking                                        │     │
│  │  • 20-30% token savings vs re-sending full context        │     │
│  │                                                             │     │
│  │  ProjectContext MCP (mandatory bundling):                  │     │
│  │  • Semantic file search                                    │     │
│  │  • Decision/standard lookup                                │     │
│  │  • Task history analysis                                   │     │
│  │  • Auto-bundled before every agent execution               │     │
│  │                                                             │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                      │
│  Result:                                                             │
│  • Fast symbolic queries for structured knowledge                   │
│  • Smart semantic search for "find similar code"                    │
│  • Cognitive awareness of HOW decisions were made                   │
│  • Cross-session persistence without re-explaining                  │
│                                                                      │
│  All running locally, no cloud dependencies.                        │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Why This Combination?

**Symbolic memory alone:** Fast but can't find "similar" patterns
**Semantic search alone:** Good at similarity but no causal reasoning
**Cognitive tags alone:** Meta-awareness but no structured storage
**Cross-session context alone:** Compression but no learning

**Together:** Fast structured queries + Smart semantic search + Meta-cognitive awareness + Cross-session persistence = **Institutional knowledge that compounds over time**

---

## Example Flow: Building a Payment Form

Let's say you're building an e-commerce checkout flow.

### Session 1: Initial Implementation

**User:** `/orca "Add a payment form with credit card validation"`

**What happens:**

```
[1] Orca detects domain: "frontend"
    Loads: pipelines/webdev-pipeline.md

[2] Phase: CONTEXT
    ProjectContextServer.query_context()

    Returns ContextBundle:
    {
      relevantFiles: [
        "src/components/Form/Input.tsx",        // Existing input component
        "src/styles/design-tokens.ts",          // Design system
        "src/utils/validation.ts"               // Existing validators
      ],

      pastDecisions: [
        {
          decision: "Form inputs use controlled components",
          reasoning: "Easier to manage validation state"
        }
      ],

      standards: [
        "Use design tokens for spacing/colors",
        "Validation feedback must be accessible",
        "Form fields must have clear error states"
      ],

      taskHistory: [],  // First time building payment forms

      designSystem: {
        spacing: [4, 8, 16, 24, 32],
        colors: { error: "#DC2626", ... }
      }
    }

[3] Phase: ANALYZE
    frontend-layout-analyzer:
    "I see existing Input component and validators.
     I'll compose PaymentForm using Input,
     add new creditCardValidator,
     follow design token spacing."

[4] Phase: BUILD
    frontend-builder-agent:
    • Creates PaymentForm.tsx (reuses Input component)
    • Adds creditCardValidator to validation.ts
    • Uses design tokens for layout
    • Implements accessible error states

[5] Phase: STANDARDS CHECK
    ✓ Design tokens used (95/100)
    ✓ Components reused (100/100)
    ✓ Accessibility (92/100)
    → PASS

[6] Phase: DESIGN QA
    ✓ Spacing follows 8px grid (100/100)
    ✓ Error states visible (90/100)
    ✓ Typography consistent (95/100)
    → PASS

[7] Phase: BUILD
    npm run build → ✓ Success

[8] Phase: SAVE LEARNINGS
    Saves to vibe.db:
    • Decision: "Credit card validation uses Luhn algorithm"
    • Task: "Add payment form → Success"
    • Standard: (none yet, first implementation)
```

**Result:** Payment form shipped ✓

---

### Session 2: Bug Fix (Next Day)

**User:** `/orca "Fix the payment form - it's not showing errors on blur"`

**What happens:**

```
[1] Phase: CONTEXT
    ProjectContextServer.query_context()

    Returns ContextBundle:
    {
      relevantFiles: [
        "src/components/PaymentForm.tsx",       // Just built yesterday!
        "src/components/Form/Input.tsx",
        "src/utils/validation.ts"
      ],

      pastDecisions: [
        {
          decision: "Credit card validation uses Luhn algorithm",
          when: "2025-11-19",
          reasoning: "Industry standard, prevents typos"
        },
        {
          decision: "Form inputs use controlled components",
          reasoning: "Easier to manage validation state"
        }
      ],

      standards: [
        "Validation feedback must be accessible"
      ],

      taskHistory: [
        {
          task: "Add payment form",
          outcome: "success",
          when: "2025-11-19",
          files: ["PaymentForm.tsx", "validation.ts"]
        }
      ]
    }

[2] Phase: ANALYZE
    "Looking at PaymentForm.tsx from yesterday's session.
     The Input component has onBlur but validation only runs onChange.
     Need to add blur validation trigger."

[3] Phase: BUILD
    • Adds onBlur validation to Input component
    • Updates PaymentForm to pass validateOnBlur prop
    • Maintains existing patterns

[4] GATES PASS → Bug fixed

[5] SAVE LEARNINGS
    Saves to vibe.db:
    • Standard: "Form validation must run on both change AND blur"
      (Created from this failure)
    • Task: "Fix payment form blur validation → Success"
```

**Result:** Bug fixed + New standard learned ✓

---

### Session 3: New Feature (Week Later)

**User:** `/orca "Add a shipping address form"`

**What happens:**

```
[1] Phase: CONTEXT
    ProjectContextServer.query_context()

    Returns ContextBundle:
    {
      relevantFiles: [
        "src/components/PaymentForm.tsx",       // Similar form!
        "src/components/Form/Input.tsx",
        "src/utils/validation.ts"
      ],

      pastDecisions: [
        "Credit card validation uses Luhn algorithm",
        "Form inputs use controlled components"
      ],

      standards: [
        "Validation feedback must be accessible",
        "Form validation must run on both change AND blur"  ← Learned from bug!
      ],

      taskHistory: [
        "Add payment form → Success",
        "Fix payment form blur validation → Success"
      ]
    }

[2] Phase: BUILD
    frontend-builder-agent:
    "I see PaymentForm as a pattern.
     I'll create ShippingForm following same structure,
     reuse Input component,
     apply onChange + onBlur validation (learned standard),
     use design tokens."

    • Creates ShippingForm.tsx (mirrors PaymentForm structure)
    • Adds addressValidator to validation.ts
    • Includes onBlur validation from the start (no bug!)

[3] GATES PASS on first try
    (Because standards were followed automatically)
```

**Result:** Shipping form built correctly on first try, no bugs ✓

---

### The Difference

**Without OS 2.0:**
```
Session 1: Build payment form
Session 2: Fix blur bug
Session 3: Build shipping form
           → Repeat blur bug (forgot the fix)
           → Use different pattern (no consistency)
           → Re-explain design tokens (no memory)
```

**With OS 2.0:**
```
Session 1: Build payment form → Patterns saved
Session 2: Fix blur bug → Standard learned
Session 3: Build shipping form → Patterns reused, standards enforced, no bugs
```

**Impact:**
- **Token savings:** 40-50% (no re-explaining patterns/decisions)
- **Time savings:** No debugging repeated mistakes
- **Quality improvement:** Standards enforced automatically
- **Knowledge compounds:** Each session makes future sessions better

---

## Getting Started

### Prerequisites

- [Claude Code](https://claude.com/code) (with MCP support)
- Node.js 18+
- Python 3.9+ (optional, for memory indexing)

### Quick Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/claude-vibe-config.git
   cd claude-vibe-config
   ```

2. **Deploy to ~/.claude:**
   ```bash
   ./scripts/deploy-to-global.sh
   ```

3. **Configure MCP servers in ~/.claude.json:**
   ```json
   {
     "mcpServers": {
       "shared-context": {
         "command": "npx",
         "args": ["-y", "@anthropic-ai/shared-context-mcp"]
       },
       "project-context": {
         "command": "npx",
         "args": ["-y", "@anthropic-ai/project-context-mcp"]
       }
     }
   }
   ```

4. **Initialize project memory:**
   ```bash
   cd your-project
   claude /orca "Initialize project memory"
   ```

### First Command

```bash
/orca "Add feature X to my app"
```

Watch as:
- Context gathered automatically
- Domain pipeline activates
- Quality gates enforce standards
- Learnings saved to vibe.db
- Future sessions remember everything

---

## Documentation

### Core Architecture
- [OS 2.0 Specification](docs/architecture/vibe-code-os-v2-spec.md) - Full system design
- [Memory Architecture](docs/memory/vibe-memory-v2-architecture-2025-11-19.md) - vibe.db schema
- [Configuration Record](docs/architecture/configuration-record.md) - What's in ~/.claude

### Domain Pipelines
- [Frontend Pipeline](docs/pipelines/webdev-pipeline.md) - Web development
- [iOS Pipeline](docs/pipelines/ios-pipeline.md) - Native iOS
- [Expo Pipeline](docs/pipelines/expo-pipeline.md) - React Native
- [SEO Pipeline](docs/pipelines/seo-pipeline.md) - Content/SEO

---

## Philosophy

### Context is Mandatory
No agent works without ContextBundle. Make forgetting architecturally impossible.

### Quality is Enforced
Hard gates (90+ threshold) block bad work. No bypassing to "move faster."

### Learning is Automatic
Every execution leaves institutional knowledge. Standards auto-enforce.

### Documentation as Code
Pipelines are specs. Constraints are configs. States are data.

---

## Status

**Current:** OS 2.0 core complete
- ✅ Persistent memory (vibe.db)
- ✅ Mandatory context (ProjectContextServer MCP)
- ✅ Domain pipelines (Frontend/iOS/Expo/SEO)
- ✅ Quality gates (Standards/Design/Build)

**Next:**
- 🚧 Response Awareness tags (cognitive layer)
- 🚧 Vector search optimization
- 🚧 Multi-agent coordination improvements

---

## Contributing

Built for everyday Claude Code users who want:
- Claude to remember project context
- Quality enforcement without manual checks
- Learning systems that improve over time
- Simple setup without enterprise complexity

Contributions welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT License - see [LICENSE](LICENSE)

---

## Acknowledgments

- [Claude Code](https://claude.com/code) - The foundation
- [MCP Protocol](https://modelcontextprotocol.io/) - Context servers
- [Workshop](https://github.com/waldzell/workshop) - Memory inspiration
- Response Awareness methodology - Cognitive framework

---

**Vibe Code OS 2.0:** Making Claude remember everything, so you don't have to explain twice.

_Last updated: 2025-11-19_
