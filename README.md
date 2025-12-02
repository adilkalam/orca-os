```
                                                                        
      ___           ___           ___           ___     
     /\  \         /\  \         /\  \         /\  \    
    /::\  \       /::\  \       /::\  \       /::\  \   
   /:/\:\  \     /:/\:\  \     /:/\:\  \     /:/\:\  \  
  /:/  \:\  \   /::\~\:\  \   /:/  \:\  \   /::\~\:\  \ 
 /:/__/ \:\__\ /:/\:\ \:\__\ /:/__/ \:\__\ /:/\:\ \:\__\
 \:\  \ /:/  / \/_|::\/:/  / \:\  \  \/__/ \/__\:\/:/  /
  \:\  /:/  /     |:|::/  /   \:\  \            \::/  / 
   \:\/:/  /      |:|\/__/     \:\  \           /:/  /  
    \::/  /       |:|  |        \:\__\         /:/  /   
     \/__/         \|__|         \/__/         \/__/    

```                                   
---

# Orchestrated Response Coordination Architecture (ORCA OS)

An orchestration and memory layer that transforms Claude Code from a developer companion tool into a multi-agent development environment with persistent memory, domain pipelines, and commercial-grade prompting—allowing Claude Code to run autonomously for hours, with iterative loops on output.

---

## How It Works

```text
                                                   +-------------------------+
                                                   |                         |
                                                   |   YOUR RULES            |
                                                   |   (always apply)        |
                                                   |                         |
                                                   |   "No font <12px"       |
                                                   |   "Prefer SwiftUI"      |
                                                   |   "No third-party deps" |
                                                   |                         |
                                                   +-----------+-------------+
                                                               |
                                                               | feeds into
                                                               v
+------------------------------------------+       +-------------------------+
|  SESSION 1                               |       |                         |
|  "Build me an iOS app based on my site"  |       |   PERSISTENT MEMORY     |
+------------------------------------------+       |                         |
              |                                    |   ProjectContext MCP    |
              v                                    |   - project structure   |
+------------------------------------------+       |   - past decisions      |
|  Requirements gathered via conversation  |<----->|   - task history        |
+------------------------------------------+       |                         |
              |                                    |   Workshop              |
              v                                    |   - decisions           |
+------------------------------------------+       |   - 'gotchas'           |
|  iOS Pipeline                            |       |   - standards           |
|                                          |       |   - YOUR RULES          |
|  ios-architect --> ios-builder ----+     |       |                         |
|       |                            |     |       +-------------------------+
|       v                            v     |               ^
|  ios-swiftui-spec    ios-verification    |               | 
|                                          |               |  
|  Uses: Context7, Playwright, iOS Sim MCP |               |
+------------------------------------------+               |  Able to commit self-reflection and learnings
              |                                            |  to memory and project context
              v                                            |  (e.g. always confirm calculations before completion)
+------------------------------------------+               |
|  V1 ships. Decisions saved. -------------|---------------+
+------------------------------------------+


+------------------------------------------+       +-------------------------+
|  SESSION 2                               |       |                         |
|  "Add dark mode"                         |       |   PERSISTENT MEMORY     |
+------------------------------------------+       |                         |
              |                                    |   Already knows:        |
              v                                    |   - MVVM architecture   |
+------------------------------------------+       |   - SwiftData models    |
|  Memory loaded. No re-explaining.        |<----->|   - "no font <12px"     |
|  Complexity: SIMPLE                      |       |   - Assets.xcassets     |
+------------------------------------------+       |     color tokens        |
              |                                    |                         |
              v                                    +-------------------------+
+------------------------------------------+               ^
|  ios-swiftui-spec implements directly    |               |
|  (Knows to avoid blue from your rules)   |               |
|                                          |               |
|  Verification runs. Done.                |               |
|                                          |               |
|  New decision saved: --------------------|---------------+
|  "@Environment(\.colorScheme) theming"   |
+------------------------------------------+
```

---

## The Foundation

### Memory persists
One of the most frustrating things about AI tools is that conversations exist in isolation—Claude in particular has the memory of a goldfish. No history, no continuity, no evolution. You explain the same context every time.

ORCA builds a working relationship. The more you work together on a project, the more the system understands - your standards, your preferences, why you made past decisions, what's been tried and failed. Like any good collaboration, it gets better over time.

Decisions are captured with their reasoning. Ask "why did we set it up this way?" six months later and get the actual context from when the choice was made. Session 1 you're explaining everything. Session 50 you're just working.

'Gotchas' and failures are captured too - **when something goes wrong, it's remembered so it doesn't happen again.** Agents learn from your project's history, not just generic training data.

### Reasoning is structured—and incredibly powerful
Complex problems get dedicated thinking tools. While a typical AI can brainstorm with a user when prompted, ORCA's `/think` command analyzes your problem and recommends which reasoning approach to use. Clear Thought MCP provides 38 reasoning operations:

  | Flag       | Purpose                                                        |
  |------------|----------------------------------------------------------------|
  | --seq      | Step-by-step chain of thought                                  |
  | --collab   | Multi-perspective analysis (PM, engineer, designer viewpoints) |
  | --decide   | Decision framework for weighing options                        |
  | --systems  | Map interconnected components                                  |
  | --causal   | Trace cause-and-effect relationships                           |
  | --tree     | Branching exploration of approaches                            |
  | --socratic | Question-driven refinement and assumption challenging          |
  | --creative | Brainstorming and idea generation                              |

The Sequential Thinking MCP enables multi-step reasoning with revision - hypotheses can be generated, tested, and backtracked when needed. This isn't "AI winging it." It's structured problem-solving with explicit methodology.

### Requirements before code
The most frustrating AI failures aren't bugs - it's confident execution in the wrong direction. The AI fills in gaps with assumptions and defaults its trained on— and by the time you see the output, you're three layers deep into something you didn't want. **This is the failure mode that makes people give up on AI tools entirely.**

ORCA structurally prevents this. Complex tasks start with questions that surface the assumptions you didn't know were being made. "What's the target audience for this?" "Should this match existing brand guidelines?" "What happens if this fails halfway through?" "Does this need to work offline?" The blind spots that would send the work veering off course get caught upfront.

This is what makes the orchestration actually work. Without requirements gathering, even the strictly defined AI agents will drift - filling gaps with plausible-sounding guesses, compounding in the wrong direction before you see the first output. With it, the plan is explicit, edge cases are identified, and the AI can't drift because the boundaries are already set.

By the time execution starts, you're aligned on what "done" actually looks like.

### Awareness during execution 
AI models have internal states that normally stay hidden. Uncertainty about whether a method exists. The pull to generate output because 'this patterns usually expects this output.' The gradual degradation of earlier context as the response gets longer. These aren't anthropomorphism - research shows they're measurable dimensions in how models process information.

The problem: these states drive behavior but remain invisible. The model fills a gap with an assumption, and you don't know until something breaks. It generates boilerplate because the pattern "feels complete" that way, not because you needed it. Earlier context fades, and the model reconstructs what "seems right" instead of what was actually said.

**ORCA makes these states explicit.** As agents work, they mark assumptions, uncertainties, and pattern-driven choices in real-time: 
- #COMPLETION_DRIVE: Assuming this endpoint returns paginated data
- #CARGO_CULT: Adding retry logic because API calls usually have it
- #CONTEXT_DEGRADED: Reconstructing the auth flow from partial recall

These aren't just comments - they're checkpoints. Verification agents review every tag, confirm or correct the assumption, and document the resolution. What would silently compound into bugs gets caught, examined, and resolved. Planning catches what you can anticipate. Response Awareness catches what you can't.
---

## Why Agent Definitions Matter

Most agent frameworks define agents like this:

```text
role: "iOS Developer"
goal: "Build iOS features"
tools: [read, write, execute]
```

This works for helping developers with discrete tasks. The developer provides the expertise. The agent assists.

ORCA OS is different. Agents run extensive end-to-end orchestrated workflows without a human in the loop after the requirements gathering process. By extension, the expertise must be encoded in the agent itself.

### The Problem With Autonomous Agents

When agents work without human review at each step, they drift. They fill gaps with assumptions. They generate plausible-looking output that doesn't match your existing patterns. They report "done" when the build is broken. The longer the workflow, the more this compounds.

The solution isn't better prompts. It's architecture.

### Roles That Can't Leak

ORCA has 85 agents, but the number doesn't matter. What matters is that they have roles that can't bleed into each other.

### Orchestrators coordinate
They classify tasks, query memory, delegate work, track progress. They never touch files. The moment an orchestrator starts editing code, it stops being able to see the whole picture - it gets lost in implementation details, context fills with diffs, and the workflow loses coherence.

### Specialists implement:
A SwiftUI specialist knows SwiftUI. A CSS specialist knows design tokens. They receive scoped tasks, do the work, report back. They don't decide what to build next.

### Gates validate
They run the build, check the tests, measure against standards. A gate scores work 0-100 and reports PASS, CAUTION, or FAIL. Gates never fix anything. They report. The orchestrator decides what to do with that information.

This isn't bureaucracy. It's the only way multi-step autonomous workflows stay coherent—and resembles how actual human teams work.

### Constraints, Not Guidelines

The expertise encoded in agents came from studying production AI tools - v0, Repl.it, Cursor, Same.new, Replit - whose system prompts have exist in open-source repositories.

V0's prompt is 1,267 lines. Most of it isn't about code generation. It's constraints:
- "Do not add additional code beyond what is necessary"
- "Components should be under 50 lines"
- "Semantic tokens only - no hardcoded colors, ever"

Same.new's prompt enforces: "The design system is law. Never write custom styles in components."

Cursor's prompt mandates: "Do not loop more than 3 times on fixing linter errors. On the third time, stop and ask."

These aren't suggestions in our agents. **They're rules that can't be violated.** The discipline these companies invested in learning is baked into the system.

### Verification Grounded in Reality

When an agent says "done," that claim has to mean something.

ORCA's gates don't just ask "did it work?" They require evidence. Design review gates must save a structured report with screenshots before they can report PASS. Verification gates must prove the build commands actually ran - a hook checks the Bash log and blocks fake success claims.

This keeps "PASS" grounded in artifacts, not self-reporting.

### Learning That Accumulates

Static rules aren't enough. Agents also learn from your project.

When an iOS agent uses `NavigationStack` on an iOS 15 project and the build fails, that failure gets recorded. The next time, it checks the deployment target first. Pattern success and failure are tracked - when something works 12 times and fails once, it gets promoted. When a pattern starts failing, it gets deprecated.

The agents remember what your project taught them.

---

## How Good Results Are Produced

ORCA OS produces consistent results through a structured process:

```text
+------------------------------------------------------------------+
|                    1. RESPONSE-AWARE PLANNING                    |
|                                                                  |
|  Before any code is written:                                     |
|  - Requirements gathered through conversation                    |
|  - Ambiguities surfaced and resolved via Q&A                     |
|  - Plan artifact created with explicit assumptions               |
|  - Risks and gaps identified upfront                             |
+-------------------------------+----------------------------------+
                                |
                                v
+------------------------------------------------------------------+
|                    2. ORCHESTRATED EXECUTION                     |
|                                                                  |
|  Grand Architect coordinates without writing code:               |
|                                                                  |
|  +------------------+     +------------------+                   |
|  |  ios-architect   |---->|  ios-builder     |                   |
|  |  (plans)         |     |  (implements)    |                   |
|  +------------------+     +------------------+                   |
|           |                        |                             |
|           v                        v                             |
|  +------------------+     +------------------+                   |
|  |  Specialists     |     |  More builders   |                   |
|  |  (as needed)     |     |  (in parallel)   |                   |
|  +------------------+     +------------------+                   |
+-------------------------------+----------------------------------+
                                |
                                v
+------------------------------------------------------------------+
|                    3. VERIFICATION GATES                         |
|                                                                  |
|  Every complex task passes through gates:                        |
|                                                                  |
|  ios-standards-enforcer   ios-verification    ios-ui-reviewer    |
|  - Runs SwiftLint         - Builds project    - Screenshots      |
|  - Checks patterns        - Runs tests        - Design compare   |
|  - PASS/CAUTION/FAIL      - PASS/CAUTION/FAIL - PASS/CAUTION/FAIL|
|                                                                  |
|  Gates NEVER fix issues. They report. The orchestrator decides   |
|  whether to route back to builders or surface to the user.       |
+-------------------------------+----------------------------------+
                                |
                                v
+------------------------------------------------------------------+
|                    4. MEMORY PERSISTENCE                         |
|                                                                  |
|  After completion:                                               |
|  - Decisions saved                                               |
|  - Task history recorded                                         |
|  - Patterns available for next session                           |
+------------------------------------------------------------------+
```

---

## How Memory Works

Memory isn't one system—it's three, each solving a different retrieval problem.

```
"Why did we decide to do it this way?"
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: Workshop                                          │
│  Problem: Decisions get lost. Reasoning evaporates.         │
│  Three months later, nobody remembers why.                  │
│                                                             │
│  Solution: A database that stores decisions WITH the        │
│  reasoning behind them. Not just "what" but "why."          │
│                                                             │
│  Why it's fast: Direct lookup. No searching through files.  │
│  Response: <10ms                                            │
│                                                             │
│  "why did we choose this approach?"  →  "Because the        │
│   alternative failed when we tried it last quarter..."      │
└─────────────────────────────────────────────────────────────┘
                    │
                    │ no decision recorded? search the work
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: vibe.db                                           │
│  Problem: Keyword search misses meaning.                    │
│  Searching "customer complaints" won't find the doc         │
│  titled "User Feedback Analysis."                           │
│                                                             │
│  Solution: Search by meaning, not exact words.              │
│  Understands that "complaints" and "feedback" are related.  │
│                                                             │
│  Why it's fast: Runs locally. No internet round-trips.      │
│  Response: 50-100ms                                         │
│                                                             │
│  "how do we handle unhappy customers?"  →  finds            │
│   support policies, escalation procedures, past incidents   │
└─────────────────────────────────────────────────────────────┘
                    │
                    │ need full context for a task?
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: ProjectContext                                    │
│  Problem: Complex tasks need more than search results.      │
│  They need relevant files, current state, past decisions,   │
│  and similar completed work—assembled together.             │
│                                                             │
│  Solution: Bundles everything relevant into one package.    │
│  You get context, not a scavenger hunt.                     │
│                                                             │
│  Why it's slower: Does the gathering so you don't have to.  │
│  Response: 200-500ms                                        │
│                                                             │
│  "prepare for quarterly review"  →  returns last quarter's  │
│   decisions, current goals, blockers, relevant history      │
└─────────────────────────────────────────────────────────────┘
                    │
                    ▼
        Start with full context,
        not a blank slate.
```

### Why three layers instead of one?

| Layer | Optimized For | Trade-off |
|-------|---------------|-----------|
| Workshop | Past decisions with reasoning | Only contains what was captured |
| vibe.db | Finding by meaning | Larger index, slightly slower |
| ProjectContext | Ready-to-go task bundles | Slower, but comprehensive |

Most questions hit Workshop and stop—past decisions answer most "why" questions. vibe.db handles discovery. ProjectContext activates when the task needs assembled context.

---

## Agents by Domain—Examples

ORCA OS includes 85+ agents across multiple domains.


### iOS Lane (19 agents)

| Role | Agents |
|------|--------|
| Orchestration | ios-grand-architect, ios-light-orchestrator |
| Architecture | ios-architect |
| Implementation | ios-builder, ios-swiftui-specialist, ios-uikit-specialist, ios-persistence-spec, ios-networking-spec, ios-accessibility-spec, ios-performance-spec, ios-security-specialist |
| Testing | ios-testing-specialist, ios-ui-testing-spec |
| Configuration | ios-spm-config-spec, ios-fastlane-specialist |
| Verification | ios-standards-enforcer, ios-verification, ios-ui-reviewer, design-dna-guardian |


### Research Lane (8 agents)

| Role | Agents |
|------|--------|
| Orchestration | research-lead-agent |
| Research | research-web-search-subagent, research-site-crawler-subagent |
| Writing | research-deep-writer, research-answer-writer |
| Verification | research-citation-gate, research-consistency-gate, research-fact-checker |


### Cross-Cutting Agents

Some agents work across all domains, invoked automatically when relevant:

| Agent | Purpose |
|-------|---------|
| a11y-enforcer | Accessibility compliance for any UI |
| security-specialist | Security review for any codebase |
| performance-enforcer | Performance checks across platforms |
| design-token-guardian | Design system compliance |

---

## Project Structure

```text
~/.claude/
+-- agents/       # 85+ agent definitions
|   +-- iOS/
|   +-- dev/
|   +-- expo/
|   +-- shopify/
|   +-- research/
|   +-- ...
+-- commands/     # Entry points
+-- skills/       # Reusable knowledge packages
+-- hooks/        # Session automation
+-- memory/       # workshop.db, vibe.db
```

---

**ORCA OS 2.4.1** | Orchestrated Response Coordination Architecture
