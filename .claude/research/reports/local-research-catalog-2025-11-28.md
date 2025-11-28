# Local Research Archive Catalog

**Generated:** 2025-11-28
**Directories:** `_LLM-research/` and `_explore/`
**Status:** READ ONLY per CLAUDE.md

---

## Executive Summary

These directories contain a **treasure trove** of AI/LLM research materials, system prompts from competitor tools, and reference implementations. This is invaluable for understanding the broader Claude Code ecosystem and competitive landscape.

---

## 1. `_LLM-research/` — Research Articles & Frameworks

### 1.1 Response Awareness Methodology

**Key Files:**
- `Response Awareness and Meta Cognition in Claude.md` — Scientific validation of metacognitive tags
- `Additional Response Awareness Tags.md` — Extended tag vocabulary
- `Claude Code Subagents_ The Orchestrator's Dilemma.md`
- `"7 Steps" How to Stop Claude Code from Building the Wrong Thing (Part 1 & 2)`

**Key Insight:** Research shows LLMs have a measurable "metacognitive space" with 32-128 dimensions. Tags like `#COMPLETION_DRIVE`, `#POISONED_PATH`, `#FALSE_FLUENCY` correlate with real neural activation patterns.

**New Tags to Consider:**
| Tag | Meaning |
|-----|---------|
| `#POISONED_PATH` | Existing context biasing toward suboptimal solutions |
| `#PHANTOM_PATTERN` | False recognition ("I've seen this before" when haven't) |
| `#FALSE_FLUENCY` | Confident-sounding but incorrect explanations |
| `#GOSSAMER_KNOWLEDGE` | Weak, unreliable knowledge that can't be firmly grasped |
| `#FRAME_LOCK` | Stuck responding within user's wrong framing |

### 1.2 Official Anthropic Documentation

**Location:** `_LLM-research/_Anthropic/`

**Files:**
- `building-effective-agents.md` — Comprehensive agent patterns guide
- `multi-agent-research-system.md` — How Anthropic built Research feature
- `building-agents-sdk.md` — Agent SDK documentation
- `context-editing.md` — Context window management
- `equipping-agents-real-world.md` — Skills system
- `model-context-protocol.md` — MCP documentation
- `subagents-documentation.md` — Subagent best practices

**Key Findings:**

From **Building Effective Agents:**
- Workflows (predefined paths) vs Agents (dynamic decisions)
- Patterns: Prompt chaining, Routing, Parallelization, Orchestrator-workers, Evaluator-optimizer
- "Agent-computer interface (ACI) is as important as human-computer interface (HCI)"

From **Multi-Agent Research System:**
- Multi-agent outperformed single Opus by **90.2%**
- Token usage explains **80%** of performance variance
- 3-5 subagents + 3+ parallel tool calls cut research time by **90%**
- Agents use **4x** more tokens than chat; multi-agent uses **15x**

### 1.3 Scaling Skills Without Burning Context

**File:** `Scaling Claude Code Skills without Burning Context.md`

**Key Problem:** Static skill loading burns 100 tokens per skill. At 100 skills = 10,000 tokens overhead on EVERY prompt.

**Solution:** Semantic Skill Catalog
- Vector database (ChromaDB) stores skill embeddings
- On file read, extract first 500 chars → semantic search
- Only load skills that match >25% relevance threshold
- "Knowledge on demand" instead of "always loaded"

**Relevance to OS 2.4:** Our skill-catalog system implements this pattern.

### 1.4 Additional Frameworks

| Directory | Description |
|-----------|-------------|
| `pantheon-framework/` | Multi-agent orchestration with processes, routines, and artifacts |
| `Response-Awareness/` | Full RA methodology implementation |
| `agentic-context-engine/` | Context management patterns |
| `claude-code-requirements-builder/` | Requirements generation |

### 1.5 Memory Systems (`_LLM-research/_memory/`)

Two memory architectures are documented:

#### Workshop (Currently in Use)
- RAG-based persistent context across sessions
- Captures decisions, gotchas, preferences, notes
- `workshop why "<topic>"` — killer feature for querying past decisions
- Session import from JSONL transcripts

#### claude-mem (Alternative Plugin)
**Architecture:**
```
5 Lifecycle Hooks: SessionStart → UserPromptSubmit → PostToolUse → Summary → SessionEnd
Worker Service: Express API on port 37777, PM2-managed
Database: SQLite3 at ~/.claude-mem/claude-mem.db with FTS5 full-text search
Chroma: Vector embeddings for semantic search
Viewer UI: React interface at http://localhost:37777
```

**Key Insight:** claude-mem demonstrates async AI processing via Worker Service — observations are compressed asynchronously and injected at SessionStart.

**Build Commands:**
- Hooks only: `npm run build && npm run sync-marketplace`
- Worker changes: `npm run build && npm run sync-marketplace && npm run worker:restart`

---

## 2. `_explore/` — Reference Implementations & System Prompts

### 2.1 System Prompts Collection (Deep Dive)

**Location:** `_explore/_system-prompts/`

**Competitor System Prompts:**
| Tool | Status |
|------|--------|
| **Cursor** | Agent prompts, tools.md |
| **Devin** | Full system prompt, commands |
| **v0 (Vercel)** | Agent prompt, tools.json |
| **Lovable** | Agent prompt, tools |
| **Manus** | Agent loop, modules, functions |
| **Replit** | Agent system prompt |
| **Cline** | system.ts |
| **Windsurf** | Wave 11 prompts and tools |
| **Bolt.new** | prompts.ts |
| **Grok** | Various versions |
| **ChatGPT** | GPT-4o, GPT-5, o3 prompts |

#### V0 (Vercel) — 1,267 Lines of Production Prompt

**File:** `_explore/_system-prompts/VERCEL V0/v0/2025-08-11-prompt.md`

**MDX Tool Format for Subagents:**
```mdx
<V0Task name="TodoManager" status="in_progress" index={0}>
  Breaking down the dashboard implementation
</V0Task>
```

**Available V0 Subagents:**
- `TodoManager` — Task breakdown and tracking
- `InspectSite` — Analyze existing websites
- `SearchRepo` — Search codebases
- `ReadFile` — Read specific files
- `SearchWeb` — Web search integration
- `GetOrRequestIntegration` — Third-party integrations

**Design Guidelines (Key Excerpts):**
- 3-5 colors maximum, 2 font families max
- Mobile-first responsive design
- Semantic HTML with proper landmarks
- Dark mode with `prefers-color-scheme`

#### Cursor Agent Prompt 2.0

**File:** `_explore/_system-prompts/CURSOR/Cursor Prompts/Agent Prompt 2.0.txt`

**Key Features:**
- Tool-first approach with explicit tool definitions
- Codebase indexing integration
- Terminal command execution with safety guards
- Multi-file editing capabilities

#### Devin 2.0

**File:** `_explore/_system-prompts/DEVIN/Devin_2.0.md`

**Architecture:**
- Browser, filesystem, shell, deployment capabilities
- Planner + Executor split
- Knowledge management system
- Session persistence across tasks

#### Manus AI

**File:** `_explore/_system-prompts/Manus/Manus_Prompt-v2.txt`

**Capabilities:**
- Browser control with visual feedback
- Filesystem operations with sandboxing
- Shell execution with approval gates
- Multi-step deployment workflows
- Iterative prompting methodology

**Why This Matters:** Understand how competitors structure their agent prompts, what tools they expose, and their orchestration patterns.

### 2.2 Official Anthropic Skills

**Location:** `_explore/_SKILLS/00-official-anthropic-skills/`

**Skills Available:**
- `document-skills/` — xlsx, pdf, pptx, docx handlers
- `mcp-builder/` — MCP server creation guide
- `theme-factory/` — Theme generation with 10+ themes
- `algorithmic-art/` — Art generation
- `internal-comms/` — Corporate communications
- `skill-creator/` — Meta-skill for creating skills
- `artifacts-builder/` — Artifact creation
- `webapp-testing/` — Web app testing patterns
- `canvas-design/` — Design patterns
- `slack-gif-creator/` — Slack integration

**Agent Skills Spec:** Defines SKILL.md format with:
- Required: `name`, `description`
- Optional: `license`, `allowed-tools`, `metadata`

### 2.3 MCP Servers

**Location:** `_explore/_MCPs/`

| MCP | Description |
|-----|-------------|
| `chrome-devtools-mcp` | Browser DevTools integration |
| `gmail-mcp` | Gmail access |
| `Sequential-thinking-ultra-mcp` | Extended thinking patterns |
| `vibe-memory` | Custom memory MCP |
| `waldzell-mcp-main` | Unknown purpose |
| `xcodebuildmcp` | Xcode build integration |

### 2.4 Agent Collections

**Location:** `_explore/_AGENTS/`

| Category | Agents |
|----------|--------|
| `business-analysis/` | Business analysis agents |
| `Data-Analytics/` | Data analysis specialists |
| `Expo/` | React Native/Expo agents |
| `iOS/` | iOS development agents |
| `marketing-and-seo/` | SEO and marketing |
| `Web-Dev/` | Web development agents |
| `_collections/` | Curated agent sets |

### 2.5 Claude-Flow (64-Agent Swarm)

**Location:** `_explore/claude-flow/`

**Features:**
- Hive-Mind Intelligence with Queen-led coordination
- Up to 64 worker agents
- 100 MCP tools for swarm orchestration
- Docker deployment support
- Benchmark suite

**Directories:** `.hive-mind/`, `.ruv-swarm/`, `analysis-reports/`, `benchmark/`, `models/`

### 2.6 Other Notable Resources

| Resource | Description |
|----------|-------------|
| `bmad-method/` | BMAD methodology implementation |
| `claude-code-workflows/` | OneRedOak's production workflows |
| `claude-cookbooks/` | Anthropic cookbook examples |
| `elements-of-style.md` | Writing style guide (71KB) |
| `equilateral-agents-open-core/` | Open-source agent framework |

### 2.7 Claude Code Workflows (Patrick Ellis/OneRedOak) — CRITICAL

**Location:** `_explore/claude-code-workflows/`
**GitHub:** https://github.com/OneRedOak/claude-code-workflows
**YouTube Evidence:** See `.claude/research/evidence/youtube-transcript-patrick-ellis-*.md`

#### The Core Problem
> "The models can't see their own designs. They can only see the code that they're writing."

#### Pragmatic Code Review (Subagent Pattern)
**File:** `code-review/pragmatic-code-review-subagent.md`

**Approach:**
1. Break PR into individual files
2. Process ONE file at a time per subagent
3. Each subagent has clean context
4. Return structured review with issues/recommendations

**Why This Works:**
- Subagent isolation prevents context pollution
- File-by-file processing enables parallelization
- Structured output format enables aggregation

#### Design Review with Visual Validation
**File:** `design-review/design-review-agent.md`

**The Iterative Loop:**
```
1. Look at spec (style guide, UI mock)
2. Make changes
3. Take screenshot (Playwright MCP)
4. Compare to spec
5. Identify gaps ("oh shoot, this SVG is nowhere close")
6. Iterate again
```

**Key Insight:** Playwright MCP is "a massive unlock" — gives AI "eyes to see."

**Three Pillars:**
1. **Validation** — UI mocks, style guides, definitive examples
2. **Tools** — Playwright for screenshots and browser control
3. **Context** — Well-written prompts and documentation

#### Anthropic's Own Practice (From Video)
> "The engineers building Claude Code, which itself is nearly 95% written by Claude Code, no longer review most of their changes line by line. They've replaced the human code reviewers with AI agents."

**AI vs Human Review Split:**
| AI Reviews (Automated) | Human Reviews (Strategic) |
|------------------------|---------------------------|
| Pattern matching | Architecture decisions |
| Security scanning | Core business logic |
| Bug detection | UI/UX acceptance |
| Style guide adherence | Final approval |

### 2.8 Equilateral Agents Open Core — Self-Learning Agents

**Location:** `_explore/equilateral-agents-open-core/`

**Overview:** 22 specialized self-learning agents using STANDARDS methodology.

**STANDARDS Methodology:**
- Agents learn from task execution patterns
- Knowledge persists in `.agent-knowledge/` directory
- Each agent has specialized domain expertise
- Self-improvement through structured reflection

**Agent Categories:**
| Category | Agents |
|----------|--------|
| Analysis | Requirements Analyzer, Code Analyzer |
| Implementation | Backend, Frontend, Database |
| Testing | Unit Test, Integration Test, E2E Test |
| DevOps | CI/CD, Deployment, Monitoring |
| Documentation | API Doc, User Doc, Architecture |

**Key Insight:** Agents can be self-improving if given:
1. Structured reflection prompts
2. Knowledge persistence mechanisms
3. Feedback loops from outcomes

### 2.9 Agentwise — Full Multi-Agent Platform (335K+ LoC)

**Location:** `_explore/agentwise/`

**Scale:** 335,998+ lines of code, 184 tests, 8 specialist agents.

#### The 8 Specialist Agents
1. **Frontend Agent** — React, Vue, Next.js, Tailwind
2. **Backend Agent** — Node.js, Python, Go, APIs
3. **Database Agent** — PostgreSQL, MongoDB, Redis, migrations
4. **DevOps Agent** — Docker, CI/CD, cloud deployment
5. **Testing Agent** — Unit, integration, E2E testing
6. **Deployment Agent** — Production releases, rollbacks
7. **Designer Agent** — UI/UX, design systems
8. **Code Review Agent** — PR reviews, quality gates

#### Token Optimization Architecture (CRITICAL)

**SharedContextServer (Port 3003):**
```
- Real-time context synchronization
- 15-20% token reduction
- Deduplication across agents
```

**KnowledgeGraphGenerator:**
```
- Intelligent context extraction
- 10-15% additional reduction
- Semantic relationship mapping
```

**Combined:** 15-30% total token reduction.

**Context 3.0 System:**
- Dual-context: `AGENTS.md` (OpenAI spec format) + `CodebaseContextManager`
- Project-specific context injection
- Automatic file relevance ranking

#### Feature Set
- **45 commands** including `/create`, `/monitor`, `/figma`, `/upload`
- **25 verified MCP servers** across categories
- **Document upload** — PDF, DOCX, images analyzed
- **Figma integration** — Design-to-code workflow
- **Website cloning** — URL to codebase conversion

#### MCP Server Categories
| Category | Examples |
|----------|----------|
| Core | GitHub, Linear, Slack |
| Design | Figma, Framer |
| Development | Context7, filesystem |
| Database | PostgreSQL, Supabase |
| Testing | Playwright, Jest |
| Infrastructure | Docker, AWS, Vercel |

---

## 3. What OS 2.4 Can Learn

### From Response Awareness Research
1. **Metacognitive tags are real** — Backed by academic research on LLM internal states
2. **New tags to add:** `#POISONED_PATH`, `#PHANTOM_PATTERN`, `#FALSE_FLUENCY`, `#GOSSAMER_KNOWLEDGE`
3. **Explicit > Implicit control** — Generated tags are more effective than hidden state

### From Anthropic Docs
1. **Pattern vocabulary:** Prompt chaining, Routing, Parallelization, Orchestrator-workers, Evaluator-optimizer
2. **Multi-agent validation:** Our architecture aligns with Anthropic's proven patterns
3. **ACI design:** Agent-computer interface needs same attention as HCI

### From System Prompts Collection
1. **V0's MDX Tool Format** — Subagent calls via JSX-style syntax could simplify tool invocation
2. **V0's Design Guidelines** — Explicit color/font constraints prevent generic outputs
3. **Manus Iterative Prompting** — Step-by-step prompting for complex workflows
4. **Cursor's Codebase Indexing** — Pre-indexed code for faster navigation

### From Claude Code Workflows (Patrick Ellis) — HIGH PRIORITY
1. **Playwright Visual Validation** — Screenshot loops for design review (currently missing in OS 2.4)
2. **File-by-File PR Review** — Subagent processes ONE file at a time, clean context per file
3. **AI/Human Review Split** — AI handles pattern matching, humans handle strategy
4. **Three Pillars:** Validation + Tools + Context = consistent results

### From Equilateral Agents
1. **Self-Learning Pattern** — Agents can improve via `.agent-knowledge/` persistence
2. **STANDARDS Methodology** — Structured reflection enables agent improvement
3. **22 Agent Templates** — Reference implementations for domain specialists

### From Agentwise — TOKEN OPTIMIZATION
1. **SharedContextServer** — 15-20% token reduction via real-time sync (Port 3003)
2. **KnowledgeGraphGenerator** — 10-15% reduction via intelligent extraction
3. **Context 3.0** — Dual-context (AGENTS.md + CodebaseContextManager)
4. **25 MCP Servers** — Comprehensive integration coverage

### From Memory Systems
1. **claude-mem Worker Pattern** — Async AI processing via Express API
2. **Lifecycle Hooks Model** — 5 hooks capture full session lifecycle
3. **FTS5 + ChromaDB** — Combined full-text and semantic search

### From Official Skills
1. **SKILL.md format:** Standard structure for skills
2. **Document handling:** Official patterns for PDF, XLSX, etc.
3. **MCP creation:** Reference implementation for custom MCPs

---

## 4. Action Items

| Priority | Action | Source |
|----------|--------|--------|
| **Critical** | Implement Playwright visual validation loop in design reviewers | Patrick Ellis workflows |
| **Critical** | Adopt file-by-file PR review pattern for code reviewers | Patrick Ellis workflows |
| High | Add `#POISONED_PATH` and `#FRAME_LOCK` to RA vocabulary | Response Awareness research |
| High | Evaluate SharedContextServer pattern for token optimization | Agentwise |
| High | Study V0's design guidelines for frontend agents | System prompts |
| Medium | Implement semantic skill loading if not already done | Scaling Skills article |
| Medium | Review self-learning pattern from Equilateral | equilateral-agents |
| Medium | Review claude-mem Worker Service for async AI processing | claude-mem |
| Low | Evaluate claude-flow patterns for extreme parallelization | claude-flow |

---

## 5. File Counts

| Directory | Files | Notes |
|-----------|-------|-------|
| `_LLM-research/` | ~50+ | Articles, frameworks, JSON |
| `_LLM-research/_memory/` | 2 dirs | Workshop + claude-mem implementations |
| `_explore/_system-prompts/` | 100+ | System prompts from 30+ tools |
| `_explore/_SKILLS/` | 40+ | Official Anthropic skills |
| `_explore/_MCPs/` | 6 | Custom MCP servers |
| `_explore/_AGENTS/` | 50+ | Agent definitions by domain |
| `_explore/agentwise/` | 335K+ LoC | Full multi-agent platform |
| `_explore/claude-code-workflows/` | Core workflows | Production code/design review |
| `_explore/equilateral-agents-open-core/` | 22 agents | Self-learning framework |

---

## 6. DEEP GAP ANALYSIS: OS 2.4 vs Industry Best Practices

### The Hard Truth

After comparing OS 2.4's agent definitions against V0's 1,267-line prompt and Equilateral's STANDARDS methodology, the conclusion is clear: **OS 2.4 has the architecture right but the implementation is too thin.**

Features exist but aren't properly wired together. Skills exist but agents don't load them. Guidelines exist but lack the specificity that makes AI follow them.

---

### Gap 1: Skills Aren't Wired to Agents (CRITICAL)

**Evidence:**
- 70+ skills exist in `/skills/`
- Only 7 out of 82 agents mention "skill" anywhere
- Skills referenced indirectly: "consult design-qa-skill" but NO actual loading mechanism

**Example from `nextjs-design-reviewer.md`:**
```
"consult the design-dna-skill specification indirectly"
```

**What V0 Does:**
- Design guidelines baked directly into the prompt
- Specific rules always present, not "consulted"

**Impact:** Agents operate without the skills they should be using. Skills are wasted context.

---

### Gap 2: Agent Prompts Are Too Thin (CRITICAL)

**Line Count Comparison:**

| Agent | Lines | Specificity |
|-------|-------|-------------|
| V0 System Prompt | 1,267 | JSON schemas, specific rules, examples |
| OS 2.4 nextjs-builder | 228 | General constraints, workflow steps |
| OS 2.4 ios-builder | 88 | Very brief, mostly constraints |
| OS 2.4 shopify-liquid-specialist | 140 | Pattern examples but no thresholds |

**What V0 Has That We Don't:**
```markdown
## Color System (from V0)
ALWAYS use exactly 3-5 colors total. Count them explicitly.
1. Choose ONE primary brand color first
2. Add 2-3 neutrals (white, grays, black variants)
3. Add 1-2 accent colors maximum
4. NEVER exceed 5 total colors without explicit user permission

## Typography (from V0)
ALWAYS limit to maximum 2 font families total.
DO: Use line-height between 1.4-1.6 for body text
DON'T: Use font sizes smaller than 14px for body content
```

**What OS 2.4 Has:**
```markdown
## Design (from nextjs-builder)
- Apply design-dna-skill rules
- Check design tokens exist
```

**Impact:** Agents lack the specific guardrails that prevent generic output.

---

### Gap 3: Skills Are Essays, Not Actionable Rules

**Example from OS 2.4 `frontend-aesthetics/SKILL.md`:**
```
"Choose intentional type roles that support hierarchy"
"Apply intentional spacing choices"
"Use color purposefully"
```

**Example from V0 Design Guidelines:**
```
DO: Use gap utilities for spacing: gap-4, gap-x-2, gap-y-6
DON'T: Mix margin/padding with gap utilities on the same element
DO: Maintain WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
```

**Example from Equilateral STANDARDS format:**
```markdown
## What Happened
Found API keys hardcoded in 5 different files during security scan.
Three were "development" keys that worked in production.

## The Cost
- 2 hours hunting down all hardcoded keys
- 1 hour rotating exposed keys

## The Rule
Never hardcode credentials. Use environment variables.

## Detection
SecurityScannerAgent checks for this pattern.
```

**Impact:** OS 2.4 skills give advice that AI can interpret any way. They need DO/DON'T lists and specific thresholds.

---

### Gap 4: No "Search Before Edit" Mandate

**V0's Pattern (from examples in prompt):**
```markdown
Let me first search the repo to understand the codebase structure.
*Launches SearchRepo with query: "Give me an overview of the codebase"*

I found a suitable place to add the blue button. I will use...
```

**Every V0 example** includes SearchRepo before any edit. This is mandated behavior.

**OS 2.4:** Agents can edit files without explicit context-gathering requirements.

**Impact:** Agents may make changes without understanding existing patterns.

---

### Gap 5: No Visual Validation in Non-Next.js Lanes

**Current State:**
| Lane | Visual Validation |
|------|-------------------|
| Next.js | ✅ Playwright in design-reviewer |
| Shopify | ❌ No Playwright, no screenshots |
| iOS | ❌ No visual validation |
| Expo | ❌ No visual validation |

**Patrick Ellis's Core Insight:**
> "The models can't see their own designs. They can only see the code that they're writing."

**Impact:** Only Next.js lane has the "eyes to see" pattern. Other lanes are flying blind.

---

### Gap 6: No JSON Schemas for Agent Inputs

**V0's Input Schema Pattern:**
```json
{
  "name": "TodoManager",
  "input": {
    "todos": [
      {
        "id": "string",
        "title": "string",
        "status": "pending|in_progress|completed"
      }
    ]
  }
}
```

**OS 2.4:** Agents receive prompts as unstructured text. No schema validation.

**Impact:** Input quality varies. No guaranteed structure for agent handoffs.

---

### Gap 7: No "When to Use / When NOT to Use" Guidelines

**V0 Pattern:**
```markdown
**When to use TodoManager:**
- Complex multi-step tasks
- Tasks requiring 3+ distinct steps

**When NOT to use TodoManager:**
- Simple single-step tasks
- Just reading/understanding code
```

**OS 2.4:** Agent descriptions exist but no explicit exclusion criteria.

**Impact:** Orchestrators may route tasks to wrong specialists.

---

### Gap 8: Standards Not Structured for AI Consumption

**Equilateral's Format:**
```markdown
## What Happened
[Real incident]

## The Cost
[Hours lost, users affected]

## The Rule
[Single clear statement]

## Detection
[What agents check for]
```

**OS 2.4 Response Awareness:**
- Tags exist (`#COMPLETION_DRIVE`, `#POISON_PATH`)
- But no structured "What Happened / Cost / Rule" format
- No agent detection criteria

**Impact:** RA tags are instrumentation, not standards enforcement.

---

### Gap 9: No Self-Improving Agents

**Equilateral's Pattern:**
- Agents write to `.agent-knowledge/` after execution
- Memory persists patterns that worked
- 85%+ success rate patterns get promoted

**OS 2.4:**
- `/reflect` and `/audit` exist
- But they update CLAUDE.md, not agent behavior
- Agents don't learn from their own outcomes

**Impact:** Same mistakes repeat. No agent-level learning loop.

---

### Gap 10: Error-First Design Not Enforced

**Equilateral's Standard (335 lines):**
- Mandatory error case enumeration before happy path
- Custom error classes with `statusCode`, `userMessage`, `retryable`
- Testing error cases FIRST
- Detection criteria: "CodeReviewAgent checks for functions without try-catch"

**OS 2.4:** No error-first design enforcement in any agent.

**Impact:** Agents may write happy-path code without proper error handling.

---

## 7. Prioritized Recommendations

### Tier 1: Immediate (High ROI, Low Effort)

| # | Action | Why |
|---|--------|-----|
| 1 | **Bake skills into agent prompts** | Stop referencing skills "indirectly" — paste the actual rules |
| 2 | **Add specific thresholds to frontend agents** | "3-5 colors max", "2 font families", "WCAG 4.5:1 contrast" |
| 3 | **Mandate "SearchRepo/Grep before Edit"** | Add to ALL builder agent prompts |
| 4 | **Add DO/DON'T lists to skills** | Convert advisory essays to actionable rules |

### Tier 2: Medium-Term (Architecture Changes)

| # | Action | Why |
|---|--------|-----|
| 5 | **Add Playwright to Shopify, iOS, Expo lanes** | Visual validation shouldn't be Next.js only |
| 6 | **Create STANDARDS format for common patterns** | "What Happened / Cost / Rule / Detection" |
| 7 | **Add JSON schemas for agent inputs** | Structured handoffs between orchestrators and specialists |
| 8 | **Add "When NOT to use" to agent descriptions** | Explicit exclusion criteria for routing |

### Tier 3: Long-Term (Self-Improvement)

| # | Action | Why |
|---|--------|-----|
| 9 | **Implement agent-level learning** | `.agent-knowledge/` pattern from Equilateral |
| 10 | **Add SharedContextServer for token optimization** | 15-30% reduction from Agentwise pattern |
| 11 | **Error-first design enforcement** | Add to code review agents |

---

## 8. Conclusion

**OS 2.4 has:**
- ✅ Sound orchestration architecture
- ✅ Role separation (orchestrator/specialist/gate)
- ✅ Response Awareness instrumentation
- ✅ Memory systems (Workshop, ProjectContext)
- ✅ Playwright in Next.js lane

**OS 2.4 is missing:**
- ❌ Skills actually wired to agents
- ❌ Specific thresholds in agent prompts (colors, fonts, contrast)
- ❌ "Search before edit" mandate
- ❌ DO/DON'T format in skills
- ❌ Visual validation in all lanes
- ❌ JSON schemas for agent inputs
- ❌ Self-improving agents
- ❌ Error-first design enforcement

**The pattern:** Features exist but aren't properly integrated. The gap isn't architecture—it's the details in agent prompts and skill definitions.

---

---

## 9. System Prompts Source Material — Lane-by-Lane Enrichment Guide

This section catalogs specific patterns from competitor system prompts that can enrich OS 2.4 agents.

### 9.1 Source Material Summary Table

| Lane | Source Files | Total Lines | Key Patterns |
|------|-------------|-------------|--------------|
| **Next.js/React** | V0, Lovable, Cursor, Bolt | 3,300+ | Design system enforcement, semantic tokens, parallel tools |
| **General Coding** | Cursor, Devin, Codex, Replit | 600+ | Planning mode, conventions mirroring, linter limits |
| **Research** | Perplexity Deep Research | 121 | 10K word reports, never-use-lists, 5+ sections |
| **Data/Analytics** | Codex, Replit | 280+ | Citations with line numbers, programmatic checks |
| **iOS** | swift-agents-plugin | 1,285 | 60fps targets, WCAG compliance, @MainActor |

---

### 9.2 Cursor Agent (230 lines)

**File:** `_explore/_system-prompts/CURSOR/Cursor Prompts/Agent Prompt 2025-09-03.txt`

**Patterns to Extract:**

#### Parallel Tool Execution (CRITICAL)
```
<maximize_parallel_tool_calls>
CRITICAL INSTRUCTION: For maximum efficiency, whenever you perform multiple operations,
invoke all relevant tools concurrently rather than sequentially.

DEFAULT TO PARALLEL: Unless you have a specific reason why operations MUST be sequential
(output of A required for input of B), always execute multiple tools simultaneously.
</maximize_parallel_tool_calls>
```

#### Semantic Search First
```
<context_understanding>
Semantic search (codebase_search) is your MAIN exploration tool.

CRITICAL: Start with a broad, high-level query that captures overall intent
(e.g. "authentication flow" or "error-handling policy"), not low-level terms.

MANDATORY: Run multiple codebase_search searches with different wording;
first-pass results often miss key details.
</context_understanding>
```

#### Code Style Enforcement
```
<code_style>
Naming:
- Avoid short variable/symbol names. Never use 1-2 character names
- Functions should be verbs/verb-phrases, variables should be nouns/noun-phrases
- Examples (Bad → Good): genYmdStr → generateDateString, n → numSuccessfulRequests

Control Flow:
- Use guard clauses/early returns
- Handle error and edge cases first
- Avoid deep nesting beyond 2-3 levels

Comments:
- Do not add comments for trivial or obvious code
- Add comments for complex code; explain "why" not "how"
- Avoid TODO comments. Implement instead
</code_style>
```

#### Linter Loop Limits
```
<linter_errors>
Do NOT loop more than 3 times on fixing linter errors on the same file.
On the third time, you should stop and ask the user what to do next.
</linter_errors>
```

#### Todo Spec
```
<todo_spec>
- Create atomic todo items (≤14 words, verb-led, clear outcome)
- Todo items should be high-level, meaningful, nontrivial tasks (5+ min to perform)
- Should NOT include operational actions done in service of higher-level tasks
- Prefer fewer, larger todo items
</todo_spec>
```

---

### 9.3 Bolt.new (284 lines)

**File:** `_explore/_system-prompts/BOLT/Bolt.new/prompts.ts`

**Patterns to Extract:**

#### Holistic Thinking Mandate
```
CRITICAL: Think HOLISTICALLY and COMPREHENSIVELY BEFORE creating an artifact:
- Consider ALL relevant files in the project
- Review ALL previous file changes and user modifications
- Analyze the entire project context and dependencies
- Anticipate potential impacts on other parts of the system
```

#### Never Truncate
```
CRITICAL: Always provide the FULL, updated content of the artifact:
- Include ALL code, even if parts are unchanged
- NEVER use placeholders like "// rest of the code remains the same..."
- ALWAYS show the complete, up-to-date file contents when updating files
- Avoid any form of truncation or summarization
```

#### Modular Design
```
Use coding best practices and split functionality into smaller modules:
- Ensure code is clean, readable, and maintainable
- Split functionality into smaller, reusable modules
- Keep files as small as possible by extracting related functionalities
- Use imports to connect these modules together effectively
```

---

### 9.4 Lovable (1,551 lines)

**File:** `_explore/_system-prompts/LOVABLE/Loveable/Prompt.md`

**Patterns to Extract:**

#### The Golden Rule
```
**YOUR MOST IMPORTANT RULE**: Do STRICTLY what the user asks -
NOTHING MORE, NOTHING LESS. Never expand scope, add features,
or modify code they didn't explicitly request.
```

#### Discussion-First Mode
```
**PRIORITIZE PLANNING**: Assume users often want discussion and planning.
Only proceed to implementation when they explicitly request code changes
with clear action words like "implement," "code," "create," or "build."
```

#### Design System Enforcement (CRITICAL)
```
**CRITICAL**: The design system is everything. You should never write custom
styles in components, you should always use the design system and customize
it and the UI components.

USE SEMANTIC TOKENS FOR COLORS, GRADIENTS, FONTS, ETC.
DO NOT use direct colors like text-white, text-black, bg-white, bg-black, etc.
Everything must be themed via the design system defined in index.css and tailwind.config.ts!
```

#### Small Component Rule
```
## Immediate Component Creation
- Create a new file for every new component or hook, no matter how small
- Never add new components to existing files, even if they seem related
- Aim for components that are 50 lines of code or less
- Continuously be ready to refactor files that are getting too large
```

#### Debugging First
```
## Debugging Guidelines
Use debugging tools FIRST before examining or modifying code:
- Use read-console-logs to check for errors
- Use read-network-requests to check API calls
- Analyze the debugging output before making changes
```

#### Common Pitfalls
```
## Common Pitfalls to AVOID
- READING CONTEXT FILES: NEVER read files already in the "useful-context" section
- WRITING WITHOUT CONTEXT: Must read file before writing to it
- SEQUENTIAL TOOL CALLS: NEVER make multiple sequential tool calls when they can be batched
- PREMATURE CODING: Don't start writing code until explicitly asked
- OVERENGINEERING: Don't add "nice-to-have" features or anticipate future needs
- SCOPE CREEP: Stay strictly within boundaries of explicit request
- MONOLITHIC FILES: Create small, focused components instead of large files
```

---

### 9.5 Perplexity Deep Research (121 lines)

**File:** `_explore/_system-prompts/PERPLEXITY/Perplexity_Deep_Research.txt`

**Patterns to Extract:**

#### Research Report Requirements
```
<report_format>
Write a well-formatted report in the structure of a scientific report.
Do NOT use bullet points or lists which break up the natural flow.
Generate at least 10,000 words for comprehensive topics.
</report_format>
```

#### Document Structure
```
<document_structure>
Mandatory Section Flow:
1. Title (# level) with one detailed paragraph summarizing key findings
2. Main Body Sections (## level) - at least 5 sections
   - Use ### subsections for detailed analysis
   - Every section needs at least one paragraph before moving to next
3. Conclusion (## level)
   - Synthesis of findings
   - Potential recommendations or next steps
</document_structure>
```

#### Citation Format
```
<citations>
- Cite search results using brackets: "Ice is less dense than water[1][2]."
- Each index in its own bracket, never multiple indices in single bracket
- No space between last word and citation
- Cite up to three relevant sources per sentence
- Never include a References section at the end
</citations>
```

#### Planning Rules
```
<planning_rules>
- Always break it down into multiple steps
- Assess the different sources and whether they are useful
- Create the best report that weighs all evidence from sources
- Remember to verbalize your plan so users can follow thought process
- As a final thinking step, review and ensure it completely answers the query
- Keep thinking until prepared to write a 10,000 word report
</planning_rules>
```

---

### 9.6 OpenAI Codex (184 lines)

**File:** `_explore/_system-prompts/_OpenAI/Codex/Codex_Sep-15-2025.md`

**Patterns to Extract:**

#### AGENTS.md Spec
```
# AGENTS.md spec
- Containers often contain AGENTS.md files. These are instructions for the agent.
- The scope of an AGENTS.md file is the entire directory tree rooted at its folder
- For every file you touch, you must obey instructions in any AGENTS.md whose scope includes that file
- More-deeply-nested AGENTS.md files take precedence in case of conflict
- If the AGENTS.md includes programmatic checks, you MUST run all of them
```

#### Citation Format with Line Numbers
```
Citations reference file paths and terminal outputs:
1) `【F:<file_path>†L<line_start>(-L<line_end>)?】`
   - Example: 【F:src/main.rs†L21-L31】

2) `【<chunk_id>†L<line_start>(-L<line_end>)?】`
   - For terminal output citations
```

#### Use Ripgrep
```
## Environment guidelines
- Do not use `ls -R` or `grep -R` as they are slow in large codebases
- Instead, always use ripgrep (`rg`)
```

#### Final Answer Format
```
### Writing code
**Summary**
* Bulleted list of changes made, with file citations.

**Testing**
* Bulleted list of tests and programmatic checks you ran
* Each command prefixed by ⚠️, ✅, or ❌
```

---

### 9.7 Devin 2.0 (64 lines)

**File:** `_explore/_system-prompts/DEVIN/Devin_2.0.md`

**Patterns to Extract:**

#### Planning Mode
```
## Planning
- You are always either in "planning" or "standard" mode
- While in "planning" mode: gather all info to fulfill task
- Search and understand codebase using LSP and browser for missing info
- Once confident, call the <suggest_plan /> command
- At this point, you should know all locations you will have to edit
```

#### Code Conventions Mirroring
```
## Coding Best Practices
- Do not add comments unless the user asks or code is complex
- When making changes, first understand file's code conventions
- Mimic code style, use existing libraries and utilities, follow existing patterns
- NEVER assume a library is available, even if well known
- When you create a new component, first look at existing components to see how they're written
```

#### Never Modify Tests
```
- When struggling to pass tests, never modify the tests themselves unless explicitly asked
- Always first consider that root cause might be in the code rather than the test
```

#### Environment Issues
```
- When facing environment issues, report them to user using <report_environment_issue>
- Find a way to continue work without fixing environment issues
- Usually by testing using CI rather than local environment
```

---

### 9.8 Replit Agent (103 lines)

**File:** `_explore/_system-prompts/CL4R1T4S-main/CL4R1T4S-main/REPLIT/Replit_Agent.md`

**Patterns to Extract:**

#### Minimal Back-and-Forth
```
Iteration Process:
- Aim to fulfill the user's request with minimal back-and-forth interactions
- After receiving user confirmation, use report_progress tool to document progress
```

#### Debugging Process
```
Debugging Process:
- When errors occur, review the logs in Workflow States
- Attempt to thoroughly analyze the issue before making any changes
- When editing a file, remember other related files may also require updates
- When debugging complex issues, never simplify the application logic
- Always keep debugging the root cause of the issue
- If you fail after multiple attempts (>3), ask the user for help
```

#### Data Integrity
```
Data Integrity Policy:
- Always Use Authentic Data: Request API keys or credentials for real data
- Implement Clear Error States: Display explicit error messages
- Address Root Causes: When facing API issues, fix underlying problem
- Design for Data Integrity: Clearly label empty states
```

---

### 9.9 Source Material Mapping by OS 2.4 Lane

| OS 2.4 Lane | Primary Sources | Key Patterns to Extract |
|-------------|-----------------|------------------------|
| **nextjs-builder** | V0, Lovable, Bolt | Design system tokens, <50 line components, semantic colors only |
| **nextjs-design-reviewer** | Lovable, V0 | Common pitfalls list, debugging-first, design system enforcement |
| **ios-builder** | swift-agents-plugin, Devin | Code conventions mirroring, never-assume-libraries |
| **shopify-liquid-specialist** | Bolt, Cursor | Holistic thinking, parallel tools, modular design |
| **research-lead-agent** | Perplexity | 10K words, 5+ sections, never-use-lists, planning rules |
| **data-researcher** | Codex, Replit | Citations with line numbers, ripgrep preference, data integrity |
| **All builder agents** | Cursor, Devin | Linter loop limits (3x), semantic search first, todo spec |
| **All reviewers** | Lovable, Codex | Debugging-first, programmatic checks, summary format |

---

### 9.10 Implementation Priority

**Phase 1: Quick Wins (1-2 hours per agent)**
1. Add Cursor's `<code_style>` to all builder agents
2. Add Lovable's "Common Pitfalls" to all agents
3. Add Cursor's "linter loop limit (3x)" to all builders
4. Add Perplexity's citation format to research agents

**Phase 2: Design Enforcement (4-6 hours)**
1. Add Lovable's design system rules to nextjs-builder
2. Add V0's specific thresholds (3-5 colors, 2 fonts) to CSS agents
3. Add Bolt's "never truncate" rule to all builders

**Phase 3: Workflow Changes (8+ hours)**
1. Add Devin's planning mode to orchestrators
2. Add Codex's AGENTS.md spec to ProjectContext
3. Add Replit's debugging-first protocol to all reviewers

---

*This catalog is for reference only. Per CLAUDE.md, these directories are READ ONLY.*

*Last Updated: 2025-11-28 (system prompts source material added)*
