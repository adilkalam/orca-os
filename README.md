```
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓███████▓▒░░▒▓████████▓▒░       ░▒▓██████▓▒░ ░▒▓███████▓▒░      ░▒▓███████▓▒░       ░▒▓████████▓▒░ 
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░             ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░                    ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
 ░▒▓█▓▒▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░             ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░                    ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ 
 ░▒▓█▓▒▒▓█▓▒░░▒▓█▓▒░▒▓███████▓▒░░▒▓██████▓▒░        ░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░        ░▒▓██████▓▒░       ░▒▓█▓▒░░▒▓█▓▒░ 
  ░▒▓█▓▓█▓▒░ ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░             ░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░             ░▒▓█▓▒░░▒▓█▓▒░ 
  ░▒▓█▓▓█▓▒░ ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░             ░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓█▓▒░      ░▒▓██▓▒░▒▓█▓▒░░▒▓█▓▒░ 
   ░▒▓██▓▒░  ░▒▓█▓▒░▒▓███████▓▒░░▒▓████████▓▒░       ░▒▓██████▓▒░░▒▓███████▓▒░       ░▒▓████████▓▒░▒▓██▓▒░▒▓████████▓▒░ 
                                                                                                                        
```                                                                                                                        


# A Context-Aware, IMemory Persistent OS for Claude Code

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   Vibe Coding with High Quality Results and Outputs            │
│                                                                │
│   • Context & Memory-First Architecture                        │
│   • Introspective Response Awareness                           │
│   • Evidence Based Completion with Quality Gates               │ 
│   • Multi-Agent Parallel Orchestration                         │
│   • Workflow Specific Pipelines and Phase Schema               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Context & Memory: The Foundation

**Traditional AI assistants start from zero every session. This framework doesn't.**

The context and memory system is the foundation that enables everything else:

- **ProjectContext** — Intelligent context bundles that surface relevant files, past decisions, standards, and history for any task. No more "let me read your entire codebase" — agents get precisely what they need.

- **SharedContext** — Cross-session context sharing with compression and versioning. Reduces token usage by 40-50% by maintaining shared state across conversations.

- **Workshop Memory** — Per-project knowledge graph storing decisions, gotchas, goals, and antipatterns. Queryable via semantic search (vectors) and keyword search (FTS5).

**The result:** Agents that remember what was decided, why it was decided, and what failed before. Context loading is fast, precise, and automatic.

---

## The Problem This Solves

**Claude Code is extremely powerful but has the memory of a goldfish. It also lies. A lot.**

**Generic AI assistants drift, forget, and go rogue.** They say "done" when code doesn't compile, tests fail, and UI is broken. They hallucinate design systems, ignore constraints, and produce janky outputs. Without guardrails and scope, an AI assistant will default to what it believes are 'best-practice' behaviors and over-optimize for effeciency at the expense of proper execution.

When working with complex projects (or even smaller ones), they can be incredibly slow as they need to repeatedly gather context in order to execute a task. The result is endless iteration loops, and a high level of frustration -- and often an undesireable result.

**This framework enforces awareness and discipline:**
- Projects are indexed locally with **persistent context** that utilizes vectors for fast queries
- **An orchestration layer** that ONLY coordinates sub-agents to execute a task
- Agents operate in **strict lanes** with hard scopes
- **Memory persists** across sessions (no re-explaining decisions)
- **Quality gates** catch issues before humans see them
- Work isn't "done" until there's **evidence** (tests, builds, screenshots, logs)

---

## System Architecture: Context-Driven, Memory-Backed

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VIBE CODE OS 2.0                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐       │
│  │   Commands   │      │   Agents     │      │     MCPs     │       │
│  │  (/orca,     │◄────►│ (Orchestrate │◄────►│  (Browser,   │       │
│  │  /response-  │      │  + Execute)  │      │   Memory,    │       │
│  │   aware)     │      │              │      │   DevTools)  │       │
│  └──────┬───────┘      └──────┬───────┘      └──────┬───────┘       │
│         │                     │                     │               │
│         └─────────────┬───────┴─────────────────────┘               │
│                       │                                             │
│                       ▼                                             │ 
│         ┌─────────────────────────────┐                             │
│         │   Verification Engine       │                             │
│         │  • Meta-tag resolution      │                             │
│         │  • Evidence capture         │                             │
│         │  • Quality gates            │                             │
│         └─────────────────────────────┘                             │
│                       │                                             │
│                       ▼                                             │
│         ┌─────────────────────────────┐                             │
│         │   Memory & Context Layer    │                             │
│         │  • ProjectContext (bundles) │                             │
│         │  • SharedContext (sessions) │                             │
│         │  • Workshop (knowledge)     │                             │
│         │  • Design DNA (standards)   │                             │
│         └─────────────────────────────┘                             │  
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Request Flow: Context Loading → Implementation → Verification

```
┌────────────┐
│   Human    │  "Add dark mode to dashboard"
│   Request  │
└─────┬──────┘
      │
      ▼
┌────────────────────────────────────────────────────────────┐
│ PHASE 1: CONTEXT LOADING                                   │
│ ┌─────────────┐     ┌─────────────┐     ┌─────────────┐    │
│ │   Memory    │────►│  Design DNA │────►│   Project   │    │
│ │   Search    │     │   (Brand)   │     │   CLAUDE.md │    │
│ └─────────────┘     └─────────────┘     └─────────────┘    │
└────────────────────────────────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────────────────────────────┐
│ PHASE 2: ORCHESTRATION                                     │
│ ┌─────────────┐                                            │
│ │ /orca or    │  • Detect stack (Next.js, iOS, etc.)       │
│ │ /response-  │  • Propose specialist team                 │
│ │  aware      │  • Get user confirmation                   │
│ └─────────────┘                                            │
└────────────────────────────────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────────────────────────────┐
│ PHASE 3: PLANNING (Parallel)                               │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│ │ Designer │  │ Architect│  │ Strategy │                   │
│ │  Plans   │  │  Plans   │  │  Plans   │                   │
│ └────┬─────┘  └────┬─────┘  └────┬─────┘                   │
│      └─────────────┬──────────────┘                        │
│                    ▼                                       │
│         ┌──────────────────────┐                           │
│         │  Synthesis Agent     │                           │
│         │  • Resolve conflicts │                           │
│         │  • Create blueprint  │                           │
│         │  • Tag uncertainties │                           │
│         └──────────────────────┘                           │
└────────────────────────────────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────────────────────────────┐
│ PHASE 4: IMPLEMENTATION (Parallel)                         │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│ │ Frontend │  │ Backend  │  │  Tests   │                   │
│ │  Agent   │  │  Agent   │  │  Agent   │                   │
│ └────┬─────┘  └────┬─────┘  └────┬─────┘                   │
│      │             │             │                         │
│      │   Tag assumptions & file operations                 │
│      │   #FILE_CREATED, #COMPLETION_DRIVE                  │
│      └─────────────┬──────────────┘                        │
└─────────────────────┴──────────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────────────────────────────┐
│ PHASE 5: VERIFICATION                                      │
│ ┌─────────────────────────────────────────────────────┐    │
│ │  Verification Agent                                 │    │
│ │  • Resolve ALL meta-tags                            │    │
│ │  • Run tests          → Capture output              │    │
│ │  • Run build          → Capture logs                │    │
│ │  • Take screenshots   → Visual evidence             │    │
│ │  • Check memory tags  → No orphaned claims          │    │
│ └─────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────────────────────────────┐
│ PHASE 6: QUALITY GATES                                     │
│ ┌─────────────────────────────────────────────────────┐    │
│ │  Design Review (if UI changed)                      │    │
│ │  • Grid compliance (4px system)                     │    │
│ │  • Token-based styling (no magic numbers)           │    │
│ │  • Accessibility audit                              │    │
│ │  • Interaction states (hover, focus, active)        │    │
│ └─────────────────────────────────────────────────────┘    │
│ ┌─────────────────────────────────────────────────────┐    │
│ │  Content Awareness (if copy changed)                │    │
│ │  • Matches brand voice                              │    │
│ │  • Audience-appropriate                             │    │
│ │  • Purpose-aligned                                  │    │
│ └─────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
      │
      ▼
┌────────────┐
│   DONE     │  Evidence attached, memory updated
│ + EVIDENCE │
└────────────┘
```

---

## Memory & Context Architecture: Three-Layer System

### 1. ProjectContext: Intelligent Context Bundles

```
┌────────────────────────────────────────────────────────────────┐
│                    PROJECT CONTEXT                             │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   ┌─────────────────────────────────────────────────┐          │
│   │  Claude Code Session (ORCA/Agent)              │          │
│   │                                                 │          │
│   │  ┌────────────────────────────────────────┐     │          │
│   │  │  Agent Starting Task                   │     │          │
│   │  │                                        │     │          │
│   │  │  "Implement dark mode for dashboard"   │     │          │
│   │  └───────────────┬────────────────────────┘     │          │
│   │                  │                              │          │
│   │                  │ query_context()              │          │
│   │                  ▼                              │          │
│   │  ┌────────────────────────────────────────┐     │          │
│   │  │  ProjectContext MCP Server             │     │          │
│   │  │                                        │     │          │
│   │  │  Inputs:                               │     │          │
│   │  │  • domain (webdev/ios/expo/data/seo)   │     │          │
│   │  │  • task description                    │     │          │
│   │  │  • projectPath                         │     │          │
│   │  └───────────────┬────────────────────────┘     │          │
│   │                  │                              │          │
│   │                  │ Analyzes + Retrieves         │          │
│   │                  ▼                              │          │
│   │  ┌────────────────────────────────────────┐     │          │
│   │  │  Context Bundle Generated              │     │          │
│   │  │                                        │     │          │
│   │  │  Returns:                              │     │          │
│   │  │  ├─ Relevant files (semantic search)   │     │          │
│   │  │  ├─ Project structure (components)     │     │          │
│   │  │  ├─ Past decisions (from memory)       │     │          │
│   │  │  ├─ Standards (from Workshop)          │     │          │
│   │  │  ├─ Task history (similar work)        │     │          │
│   │  │  └─ Dependencies (what's connected)    │     │          │
│   │  └────────────────────────────────────────┘     │          │
│   └─────────────────────────────────────────────────┘          │
│                                                                │
│   Result: Agent gets PRECISELY what it needs — no more,        │
│           no less. No "let me read your entire codebase."      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 2. SharedContext: Cross-Session State Management

```
┌────────────────────────────────────────────────────────────────┐
│                    SHARED CONTEXT                              │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   ┌─────────────────────────────────────────────────┐          │
│   │  Claude Code Session A (Earlier)               │          │
│   │                                                 │          │
│   │  ┌────────────────────────────────────────┐     │          │
│   │  │  Orchestrator builds context           │     │          │
│   │  │  • Project state                       │     │          │
│   │  │  • Current requirements                │     │          │
│   │  │  • Implementation decisions            │     │          │
│   │  └───────────────┬────────────────────────┘     │          │
│   │                  │                              │          │
│   │                  │ update_shared_context()      │          │
│   │                  ▼                              │          │
│   │  ┌────────────────────────────────────────┐     │          │
│   │  │  SharedContext MCP Server              │     │          │
│   │  │                                        │     │          │
│   │  │  • Stores versioned context            │     │          │
│   │  │  • Creates differential updates        │     │          │
│   │  │  • Compresses shared state (40-50%)    │     │          │
│   │  └────────────────────────────────────────┘     │          │
│   └─────────────────────────────────────────────────┘          │
│                                                                │
│   ┌─────────────────────────────────────────────────┐          │
│   │  Claude Code Session B (Later)                 │          │
│   │                                                 │          │
│   │  ┌────────────────────────────────────────┐     │          │
│   │  │  Orchestrator queries state            │     │          │
│   │  └───────────────┬────────────────────────┘     │          │
│   │                  │                              │          │
│   │                  │ get_shared_context()         │          │
│   │                  ▼                              │          │
│   │  ┌────────────────────────────────────────┐     │          │
│   │  │  SharedContext MCP Server              │     │          │
│   │  │                                        │     │          │
│   │  │  Returns:                              │     │          │
│   │  │  • Latest context version              │     │          │
│   │  │  • Differential changes (token saving) │     │          │
│   │  │  • Compressed state                    │     │          │
│   │  └────────────────────────────────────────┘     │          │
│   └─────────────────────────────────────────────────┘          │
│                                                                │
│   Result: Session B picks up where Session A left off —        │
│           no re-explaining, 40-50% token reduction             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 3. Workshop Memory: Persistent Knowledge Graph

```
┌────────────────────────────────────────────────────────────────┐
│                    WORKSHOP MEMORY                             │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   ┌─────────────────────────────────────────────────┐          │
│   │  Claude Code Session                            │          │
│   │                                                 │          │
│   │  ┌────────────────────────────────────────┐     │          │
│   │  │  Orchestrator/Agent                    │     │          │
│   │  │                                        │     │          │
│   │  │  "What CSS approach did we decide?"    │     │          │
│   │  └───────────────┬────────────────────────┘     │          │
│   │                  │                              │          │
│   │                  │ memory.search()              │          │
│   │                  ▼                              │          │
│   │  ┌────────────────────────────────────────┐     │          │
│   │  │  vibe-memory MCP Server                │     │          │
│   │  │  ~/.claude/mcp/vibe-memory/            │     │          │
│   │  │                                        │     │          │
│   │  │  • Vector search (semantic)            │     │          │
│   │  │  • FTS5 search (keyword)               │     │          │
│   │  │  • Path resolution                     │     │          │
│   │  └───────────────┬────────────────────────┘     │          │
│   │                  │                              │          │
│   │                  │ SQLite queries               │          │
│   │                  ▼                              │          │
│   │  ┌────────────────────────────────────────┐     │          │
│   │  │  Workshop Database                     │     │          │
│   │  │  .claude/memory/workshop.db            │     │          │
│   │  │                                        │     │          │
│   │  │  Tables:                               │     │          │
│   │  │  ├─ decisions      (architectural)     │     │          │
│   │  │  ├─ gotchas        (learned failures)  │     │          │
│   │  │  ├─ goals          (roadmap)           │     │          │
│   │  │  ├─ antipatterns   (banned approaches) │     │          │
│   │  │  ├─ memory_fts     (FTS5 index)        │     │          │
│   │  │  └─ memory_vectors (embeddings)        │     │          │
│   │  └────────────────────────────────────────┘     │          │
│   └─────────────────────────────────────────────────┘          │
│                                                                │
│   Result: "Use global CSS with design tokens, not Tailwind"    │
│           (from decision recorded in workshop.db)              │
│                                                                │
└────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  CLI Interface (Workshop)                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  $ workshop decision "Use Supabase for auth"                    │
│  $ workshop gotcha "iOS Simulator needs Xcode 15.4+"            │
│  $ workshop goal "Add dark mode" -p high                        │
│  $ workshop antipattern "No inline styles" -r "Design system"   │
│  $ workshop search "CSS patterns"                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Memory is not ephemeral chat context — it's a queryable knowledge graph that persists across sessions.**

---

## Agent Hierarchy: Orchestrators vs Specialists

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ORCHESTRATORS                                  │
│  (Own planning, synthesis, and decision-making)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  /orca                          /response-aware                     │
│  ┌────────────────────┐         ┌────────────────────┐              │
│  │ • Stack detection  │         │ • 6-phase protocol │              │
│  │ • Team proposal    │         │ • Meta-tag system  │              │
│  │ • User confirm     │         │ • Evidence req'd   │              │
│  │ • Parallel exec    │         │ • Quality gates    │              │
│  │ • Chaos prevention │         │ • Final synthesis  │              │
│  └────────────────────┘         └────────────────────┘              │
│           │                              │                          │
│           └──────────────┬───────────────┘                          │
│                          │                                          │
│                          ▼                                          │
└─────────────────────────────────────────────────────────────────────┘
                           │
                           │ Dispatches →
                           │
┌─────────────────────────────────────────────────────────────────────┐
│                       SPECIALISTS                                   │
│  (Narrow scopes, strict inputs, explicit non-responsibilities)      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Planning Layer                                                     │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │
│  │ system-        │  │ requirement-   │  │ plan-synthesis │         │
│  │ architect      │  │ analyst        │  │ agent          │         │
│  └────────────────┘  └────────────────┘  └────────────────┘         │
│                                                                     │
│  Design Layer                                                       │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │
│  │ design-        │  │ creative-      │  │ ux-            │         │
│  │ director       │  │ strategist     │  │ strategist     │         │
│  └────────────────┘  └────────────────┘  └────────────────┘         │
│                                                                     │
│  Implementation Layer                                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │
│  │ frontend-      │  │ backend-       │  │ ui-            │         │
│  │ (Next.js, etc) │  │ (Node, Go, Py) │  │ engineer       │         │
│  └────────────────┘  └────────────────┘  └────────────────┘         │
│                                                                     │
│  Quality Layer                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │
│  │ test-          │  │ design-        │  │ verification-  │         │
│  │ engineer       │  │ reviewer       │  │ agent          │         │
│  └────────────────┘  └────────────────┘  └────────────────┘         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Pattern that works:**
1. **Narrow role** — One job, clearly defined
2. **Mandatory context recall** — Always load memory + design DNA first
3. **Thinking scaffold** — Fixed reasoning structure (FRAME → STRUCTURE → SURFACE)
4. **Hard rules** — Type scales, spacing tokens, banned patterns
5. **Structured output** — Blueprint templates, not freeform

**Pattern that failed:**
- Broad "design" agents that tried to do everything → drift and hallucination

---

## Evidence-Based Completion: Meta-Tags + Verification

### The Problem: False Completion

```
❌ DEFAULT APPROACH:
   Agent: "I've added dark mode support."
   Reality: Code doesn't compile, tests fail, UI is broken
```

### The Solution: Response Awareness Meta-Tag System

**Refrences:**
-[Response Awareness and Meta Cognition in Claude] (https://responseawareness.substack.com/p/response-awareness-and-meta-cognition)
-[Language Models Are Capable of Metacognitive Monitoring and Control of Their Internal Activations] (https://arxiv.org/html/2505.13763)
-[Signs of introspection in large language models] (https://www.anthropic.com/research/introspection)


```
✅ OS 2.0 APPROACH:

   Implementation Agent:
   ┌────────────────────────────────────────────────────┐
   │ Created components/DarkModeToggle.tsx              │
   │ #FILE_CREATED: components/DarkModeToggle.tsx       │
   │ #COMPLETION_DRIVE: Assuming CSS vars exist         │
   │ #SCREENSHOT_CLAIMED: .orchestration/evidence/ui.png│
   └────────────────────────────────────────────────────┘

   Verification Agent:
   ┌────────────────────────────────────────────────────┐
   │ Resolving tags...                                  │
   │                                                    │
   │ ✓ #FILE_CREATED → ls confirms exists               │
   │ ✓ #COMPLETION_DRIVE → grep found CSS vars          │
   │ ✓ #SCREENSHOT_CLAIMED → screenshot captured        │
   │ ✓ Build → npm run build (success)                  │
   │ ✓ Tests → npm test (12/12 passed)                  │
   │                                                    │
   │ Evidence attached:                                 │
   │ - Build logs: .orchestration/logs/build.log        │
   │ - Test output: .orchestration/logs/test.log        │
   │ - Screenshot: .orchestration/evidence/ui.png       │
   └────────────────────────────────────────────────────┘

   Result: VERIFIED COMPLETE (with proof)
```

**Core Tags:**
- `#FILE_CREATED`, `#FILE_MODIFIED`, `#FILE_DELETED` → File operations
- `#COMPLETION_DRIVE` → Assumptions that need verification
- `#SCREENSHOT_CLAIMED` → Visual evidence needed
- `#PATH_DECISION` → Architectural choices
- `#PLAN_UNCERTAINTY` → Needs clarification

**Verification Requirements:**
- All tags must be resolved
- Evidence must be captured (not claimed)
- No work is "done" until verification passes

---

## Design-OCD Quality Gates

### Visual Precision is Non-Negotiable

```
┌────────────────────────────────────────────────────────────────┐
│  DESIGN REVIEW CHECKLIST (Automatic)                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Grid Compliance                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ✓ All spacing uses 4px/8px/16px/24px/32px progression   │   │
│  │ ✓ No arbitrary margins (e.g., margin: 13px)             │   │
│  │ ✓ Container widths from design system scale             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  Token-Based Styling                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ✓ All colors from design tokens (no #HEX in code)       │   │
│  │ ✓ Typography uses scale (no arbitrary font-size)        │   │
│  │ ✓ No inline styles (className only)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  Interaction States                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ✓ Hover states defined                                  │   │
│  │ ✓ Focus states (keyboard navigation)                    │   │
│  │ ✓ Active/pressed states                                 │   │
│  │ ✓ Disabled states                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
│  Accessibility                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ✓ ARIA labels on interactive elements                   │   │
│  │ ✓ Semantic HTML (not div soup)                          │   │
│  │ ✓ Keyboard navigable                                    │   │
│  │ ✓ Color contrast meets WCAG AA                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Philosophy:**
- Visual bugs are as critical as functional bugs
- Design review is MANDATORY, not optional
- Optical alignment > geometric alignment
- Calculate, don't guess

---

## MCP Servers: Context, Memory, and Automation Tools

```
┌────────────────────────────────────────────────────────────────┐
│                    MCP SERVERS                                 │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  CONTEXT & MEMORY SERVERS                                      │
│  ────────────────────────────                                  │
│                                                                │
│  project-context (Local Custom)                                │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Path: ~/.claude/mcp/project-context/                   │    │
│  │ Tools:                                                 │    │
│  │  • query_context() — Intelligent context bundles       │    │
│  │  • save_decision() — Log architectural decisions       │    │
│  │  • save_standard() — Create standards from failures    │    │
│  │  • save_task_history() — Record task completion        │    │
│  │  • index_project() — Semantic project indexing         │    │
│  │  • reanalyze_project() — Rebuild project structure     │    │
│  │ Returns: Relevant files, decisions, standards, history │    │
│  │ Used by: All orchestrators (MANDATORY before work)     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                │
│  shared-context (Local Custom)                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Path: ~/.claude/mcp/shared-context/                    │    │
│  │ Tools:                                                 │    │
│  │  • get_shared_context() — Retrieve session context     │    │
│  │  • update_shared_context() — Store session state       │    │
│  │  • get_context_diff() — Differential changes           │    │
│  │  • get_server_stats() — Token savings & metrics        │    │
│  │ Features:                                              │    │
│  │  • Versioned context (track changes over time)         │    │
│  │  • Compression (40-50% token reduction)                │    │
│  │  • Differential updates (only send changes)            │    │
│  │ Used by: Orchestrators for cross-session continuity    │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                │
│  vibe-memory (Local Custom)                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Path: ~/.claude/mcp/vibe-memory/                       │    │
│  │ Tools:                                                 │    │
│  │  • memory.search (semantic + FTS)                      │    │
│  │  • Auto-loads project decisions, gotchas, goals        │    │
│  │ Backend: Workshop database (.claude/memory/)           │    │
│  │ Used by: All orchestrators and specialists             │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                │
│  AUTOMATION & TESTING SERVERS                                  │
│  ─────────────────────────────                                 │
│                                                                │
│  playwright (External)                                         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Purpose: End-to-end browser automation                 │    │
│  │ Tools:                                                 │    │
│  │  • navigate, click, fill, screenshot, video            │    │
│  │  • Network/console capture for evidence                │    │
│  │ Used by: design-reviewer, verification-agent           │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                │
│  chrome-devtools (External)                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Purpose: Live page inspection                          │    │
│  │ Tools:                                                 │    │
│  │  • DOM inspection, network analysis, console logs      │    │
│  │ Used by: design-reviewer, ui-testing-expert            │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                │
│  XcodeBuildMCP (External)                                      │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Purpose: iOS/macOS development automation              │    │
│  │ Tools:                                                 │    │
│  │  • Build, test, run, deploy to simulators/devices      │    │
│  │ Used by: ios-specialists, swiftui-developer            │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                │
│  context7 (External)                                           │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Purpose: Library documentation and code search         │    │
│  │ Tools:                                                 │    │
│  │  • resolve-library-id, get-library-docs                │    │
│  │ Used by: All implementation agents                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Key Principle:** All I/O goes through declared tools. Agents can only use MCPs specified in their `allowed-tools` — this acts as a hard permission boundary.

---

## File Organization: Chaos Prevention

```
project-root/
├── .claude/
│   ├── memory/
│   │   └── workshop.db              ← Per-project knowledge graph
│   ├── orchestration/
│   │   ├── evidence/                ← FINAL artifacts (screenshots, reports)
│   │   ├── temp/                    ← Working files (DELETE after session)
│   │   ├── playbooks/               ← Reference patterns
│   │   └── reference/               ← Key docs
│   └── hooks/
│       └── session-start.sh         ← Auto-loads context at session start
│
├── CLAUDE.md                        ← Project-specific instructions
└── (source code...)

~/.claude/ (Global OS)
├── commands/                        ← Live slash commands
│   ├── orca.md
│   ├── response-aware.md
│   ├── creative-strategist.md
│   └── ...
├── agents/                          ← Custom agent definitions
│   ├── orchestration/
│   ├── specialists/
│   └── ...
├── mcp/
│   └── vibe-memory/                 ← Custom MCP server
├── hooks/
│   └── session-start.sh             ← Global session hook
└── CLAUDE.md                        ← Global instructions
```

**Chaos Prevention Rules:**
1. **File limits** — Max files per agent, per session
2. **Standard paths** — Evidence, logs, temp all in `.claude/orchestration/`
3. **Meta-tags required** — `#FILE_CREATED`, `#FILE_MODIFIED`, `#FILE_DELETED`
4. **No planning doc explosion** — No `PLAN.md`, `TODO.md`, etc.
5. **Cleanup enforcement** — `/cleanup` command consolidates legacy folders

---

## Usage Recipes

### Full End-to-End Implementation with Verification

```bash
/response-aware "Add dark mode to dashboard"
```

**What happens:**
1. Loads memory (prior decisions about theming)
2. Loads design DNA (color tokens, spacing)
3. Plans implementation (parallel planners)
4. Synthesizes single blueprint
5. Implements (with meta-tags)
6. Verifies (resolves all tags, captures evidence)
7. Runs quality gates (design review, tests)
8. Returns with evidence attached

---

### Plan-Only Mode (Review Before Implementation)

```bash
/response-aware -plan "iOS to React migration"
```

**What happens:**
1. Survey phase (map domains, interfaces)
2. Parallel planning (multiple approaches)
3. Synthesis (single blueprint with risks)
4. User approval required
5. Stops (no implementation yet)

**Then implement from blueprint:**

```bash
/response-aware -build path/to/blueprint.md
```

---

### Design a New Layout

```bash
/design-director "product detail page layout"
```

**What happens:**
1. Loads design DNA (typography, spacing, grid)
2. Applies thinking scaffold (FRAME → STRUCTURE → SURFACE)
3. Produces blueprint with:
   - Mathematical spacing calculations
   - Component hierarchy
   - Token-based styling specs
   - No code (blueprint-first)

---

### Strategic Analysis with Performance Data

```bash
/creative-strategist "<paste performance data + ads>"
```

**What happens:**
1. Analyzes creative signals (copy, visuals, CTAs)
2. Maps to performance metrics
3. Identifies patterns (what worked, what didn't)
4. Provides recommendations grounded in data
5. No implementation (strategy only)

---

### Multi-Agent Orchestration with Stack Detection

```bash
/orca "Implement user authentication"
```

**What happens:**
1. Detects stack (inspects package.json, files)
2. Proposes specialist team (architect, backend, frontend, test)
3. Shows team to user via interactive confirmation
4. Dispatches agents in parallel (with file limits)
5. Synthesis agent resolves conflicts
6. Verification agent proves completion

---

## Design Principles

### 1. Blueprint-First, Code-Second

For UI and complex systems, always design the blueprint (structure, spacing, tokens) before writing code. Prevents hallucinated design systems and janky layouts.

### 2. Evidence-Based "Done"

Work is complete only when tags are resolved and evidence is captured: tests, builds, screenshots, logs. No more "it works" without proof.

### 3. Narrow Agents with Hard Scopes

Each agent has a single job, strict inputs, and explicit non-responsibilities. Generic agents drift; narrow agents behave.

### 4. Memory as Ground Truth

Decisions live in Workshop (via `vibe-memory` MCP), not ephemeral chat. Design DNA lives in versioned design system docs.

### 5. Parallel Planning, Centralized Decisions

Many agents can explore paths, but one orchestrator decides and enforces. Prevents chaos.

### 6. Calculate, Don't Guess

Spacing, typography, layout all follow mathematical systems. No arbitrary values, no eyeballed alignment.

---

## Token Efficiency Through Discipline

**Why this is more efficient than generic chat:**

1. **Less context repetition**
   - Decisions stored in memory (query once, not re-explain)
   - Design DNA loaded automatically (not pasted into chat)

2. **Fewer iteration loops**
   - Verification catches issues before human review
   - Quality gates prevent janky outputs
   - Blueprint-first prevents "rebuild it properly" cycles

3. **Smaller, reusable prompts**
   - Specialist agents < 3KB each (not one giant persona)
   - Orchestrators dispatch narrow agents (not doing everything)

4. **Bounded parallelism**
   - File limits prevent runaway planning docs
   - Meta-tags track actual work (not phantom claims)

---

## Getting Started

### 1. Install Workshop CLI

```bash
cargo install workshop-cli
# or download binary from https://github.com/zachswift615/workshop
```

### 2. Initialize Project Memory

```bash
cd your-project
workshop init
mkdir -p .claude/memory
mv .workshop/workshop.db .claude/memory/workshop.db
```

### 3. Configure vibe-memory MCP

Add to `~/.claude.json`:

```json
{
  "projects": {
    "/absolute/path/to/your-project": {
      "mcpServers": {
        "vibe-memory": {
          "command": "python3",
          "args": ["/path/to/.claude/mcp/vibe-memory/memory_server.py"],
          "env": { "PYTHONUNBUFFERED": "1" }
        }
      }
    }
  }
}
```

### 4. Add Project Instructions

Create `CLAUDE.md` in project root with project-specific constraints, design system, and preferences.

### 5. Start Using Commands

```bash
# Full implementation with verification
/response-aware "Your feature request"

# Multi-agent orchestration
/orca "Your complex task"

# Design-only
/design-director "Your layout request"

# Strategy analysis
/creative-strategist "Your data + context"
```

---

## Documentation Structure

```
/
├── README.md                        ← You are here
├── quick-reference/
│   ├── memory-explainer.md          ← Memory system deep dive
│   ├── agents-teams.md              ← Agent hierarchy and scopes
│   ├── verification.md              ← Meta-tag system and quality gates
│   ├── commands.md                  ← Slash command reference
│   └── visual-design.md             ← Design-OCD principles
├── commands/                        ← Slash command definitions
├── agents/                          ← Agent definitions
├── mcp/                             ← Custom MCP servers
└── scripts/                         ← Helper scripts
```

---

## Philosophy: Why This Exists

**Generic AI assistants are helpful but undisciplined.** They drift from requirements, hallucinate constraints, and say "done" when reality disagrees.

**This framework treats Claude Code as an operating system:**
- Commands are **system calls** (orchestrators)
- Agents are **processes** (constrained, observable)
- MCPs are **I/O interfaces** (structured, permission-bounded)
- Memory is **persistent state** (queryable knowledge graph)
- Verification is **syscall validation** (evidence required)

**The result:** A disciplined, evidence-driven development system that produces reliable outputs and learns from failures.

---

## License

MIT

---

## Contributing

This is a personal framework, but the patterns are generalizable. If you build on this:
- Share agent definitions and orchestration patterns
- Document what works (and what failed)
- Contribute to Workshop CLI and vibe-memory MCP

---

**Build right first. Verify with evidence. Learn from memory.**