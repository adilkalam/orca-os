# Agents & Orchestration Study
**Source:** 18 research documents from `_LLM-research/`
**Date:** 2025-11-24
**Purpose:** Foundational knowledge for OS 2.2 configuration

---

## 1. Anthropic's Official Agent Architecture

### Workflows vs Agents (Core Distinction)
- **Workflows:** LLMs + tools orchestrated through **predefined code paths**
- **Agents:** LLMs **dynamically direct their own processes**, maintaining control

### Five Workflow Patterns
| Pattern | When to Use | Key Benefit |
|---------|------------|-------------|
| **Prompt Chaining** | Task decomposes into fixed subtasks | Trade latency for accuracy |
| **Routing** | Distinct categories need different handling | Separation of concerns |
| **Parallelization** | Subtasks can run simultaneously | Speed + diverse perspectives |
| **Orchestrator-Workers** | Can't predict subtasks upfront | Flexibility |
| **Evaluator-Optimizer** | Clear evaluation criteria exist | Iterative refinement |

### Core Principles
1. **Simplicity:** Find simplest solution possible
2. **Transparency:** Show agent's planning steps explicitly
3. **ACI Design:** Invest as much in Agent-Computer Interface as HCI

### When NOT to Use Agents
- Simple tasks where single LLM call + retrieval suffices
- When latency/cost tradeoff doesn't make sense
- Tasks requiring predictability over flexibility

---

## 2. Agent Skills (Progressive Disclosure)

### Three Levels of Context Loading
1. **Level 1:** `name` + `description` in frontmatter (always loaded)
2. **Level 2:** Full `SKILL.md` body (loaded on trigger)
3. **Level 3:** Referenced files like `forms.md` (loaded as needed)

### Key Design Principles
- Skills are like onboarding guides for new hires
- Package procedural knowledge into composable resources
- Code execution within skills for deterministic operations
- Security: Only install skills from trusted sources

### Context Window Management
- Skills trigger based on user message relevance
- Claude reads SKILL.md via Bash tool
- Additional files loaded only when needed
- Effectively unbounded context via filesystem access

---

## 3. Writing Effective Tools

### Tools Are Different from APIs
- APIs: Contract between **deterministic systems**
- Tools: Contract between **deterministic systems and non-deterministic agents**
- Agent might call tool, answer from knowledge, or ask clarifying question

### Five Tool Design Principles

#### 1. Choose Right Tools
- More tools ≠ better outcomes
- Avoid wrapping every API endpoint
- Build tools targeting **specific high-impact workflows**
- Consolidate functionality (handle multiple operations under the hood)

#### 2. Namespace Tools
- Group related tools under common prefixes
- Example: `asana_projects_search`, `asana_users_search`
- Helps agents select right tools at right time
- Prefix vs suffix namespacing can have non-trivial effects

#### 3. Return Meaningful Context
- Prioritize contextual relevance over flexibility
- Avoid: `uuid`, `256px_image_url`, `mime_type`
- Prefer: `name`, `image_url`, `file_type`
- Use `response_format` enum: `"concise"` vs `"detailed"`

#### 4. Optimize for Token Efficiency
- Implement pagination, range selection, filtering, truncation
- Claude Code restricts tool responses to 25,000 tokens by default
- Steer agents toward token-efficient strategies

#### 5. Prompt-Engineer Descriptions
- Think like describing tool to a new hire
- Make implicit context explicit
- Unambiguous parameter names: `user_id` not `user`
- Small refinements yield dramatic improvements

### Tool Evaluation Process
1. Build prototype, connect to Claude Code
2. Generate realistic evaluation tasks (not sandbox scenarios)
3. Run programmatic evaluation with agentic loops
4. Analyze results (what agents omit is often more important)
5. Collaborate with agents to improve tools

---

## 4. Context Management

### Server-Side Strategies (API)
- **Tool Result Clearing:** Clear oldest tool results when context grows
- **Thinking Block Clearing:** Manage thinking blocks in extended thinking

### Client-Side (SDK)
- **Compaction:** Generate summary, replace full history
- Threshold-based triggering (default 100k tokens)
- Summary includes: Task Overview, Current State, Important Discoveries, Next Steps, Context to Preserve

### Memory Tool Integration
- Claude receives warning before clearing
- Can save important info to memory files
- Enables long-running workflows beyond context limits

---

## 5. Response Awareness (Meta-Cognition)

### Self-Monitoring Tags
- `<confidence>` - certainty level assessment
- `<risk_assessment>` - potential failure modes
- `<complexity_analysis>` - task difficulty evaluation
- `<approach_justification>` - why this strategy

### Benefits
- Reduces hallucination through self-verification
- Enables course correction during generation
- Provides transparency for debugging

### Research Validation
- Two papers validate internal state awareness methodology
- Models can accurately report confidence levels
- Self-monitoring improves output quality

---

## 6. Spec-Driven Development (SDD)

### The Problem
- AI fills gaps with assumptions
- Context disappears between sessions
- Result: Endless rework, technical debt

### Three-Phase Process
1. **Foundation:** Persistent memory, Engineering Constitution
2. **Specification:** Feature specs with clarifications
3. **Execution:** Architecture planning, task breakdown

### Engineering Constitution
- Short, scar-driven, focused on real pain points
- Start with just 3 rules
- Each rule exists because of past failure
- Example rules: Database choice is final, API before UI, Error handling required

### Workflow
```
/specify → Clarifying questions → Answers
/plan → Architecture decisions with trade-offs → research.md
/tasks → Atomic, self-contained tasks → [P] parallelizable, sequential
```

### Context Persistence
- `CLAUDE.md` index (stack decisions, active decisions log)
- Session logs: `sessions/2024-01/day-1.md`
- Together = project memory beyond chat sessions

---

## 7. The Orchestrator's Dilemma

### Core Challenge
- Parent context not automatically passed to subagents
- Each subagent starts fresh without conversation history
- Must explicitly pass all relevant context in prompt

### Trade-offs
| Approach | Pros | Cons |
|----------|------|------|
| Single Agent | Full context accumulation | Token limits, cost |
| Multiple Subagents | Specialization, parallelism | Context loss, coordination |
| Hybrid | Best of both | Complexity |

### Solutions
- Explicit context bundling in prompts
- State management via external systems
- Strategic task decomposition
- Verification checkpoints

---

## 8. Key Insights for OS 2.2

### What This Means for Our Architecture

1. **Role Boundaries Are Critical**
   - Orchestrators delegate, never write code
   - Specialists execute, report back
   - Clear separation prevents confusion

2. **Context Must Be Explicit**
   - Use `mcp__project-context__query_context` before work
   - Pass relevant files, decisions, standards
   - Never assume subagents have parent context

3. **Progressive Disclosure Works**
   - Don't front-load all context
   - Level 1: Agent description (always loaded)
   - Level 2: Full agent prompt (when invoked)
   - Level 3: Referenced docs (as needed)

4. **Tools Need Human-Readable Output**
   - Prefer names over UUIDs
   - Return meaningful context
   - Optimize for token efficiency

5. **Evaluation-Driven Improvement**
   - Build realistic test scenarios
   - Measure agent performance
   - Iterate on prompts and tools

6. **Simplicity First**
   - Start with simplest solution
   - Add complexity only when demonstrably needed
   - Single LLM call often suffices

---

## References

### Anthropic Official
- Building Effective Agents
- Equipping Agents for the Real World with Agent Skills
- Writing Tools for AI Agents
- Context Editing
- Model Context Protocol
- JSON Output Consistency

### Community Research
- 7 Steps to Stop Claude Code from Building the Wrong Thing (Parts 1 & 2)
- Response Awareness and Meta Cognition in Claude
- Claude Code Subagents: The Orchestrator's Dilemma
- Additional Response Awareness Tags
- Claude AI Response Awareness Early Slash Command Break Down v2

---

## Part 2: Open Source Orchestration Frameworks

### Agentwise (VibeCodingWithPhil)
**Multi-Agent Orchestration System for Claude Code**

#### Architecture
- **8 Specialist Agents**: Frontend, Backend, Database, DevOps, Testing, Deployment, Designer, Code Review
- **Dynamic Agent Management**: Auto-discovers agents from `.claude/agents/`
- **Shared Context Server**: Port 3003 for context sharing between agents
- **Token Optimization**: 15-30% reduction via context sharing + smart caching

#### Key Patterns
| Pattern | Implementation |
|---------|---------------|
| Agent Frontmatter | YAML: name, description, tools |
| Context Sharing | SharedContextServer + AgentContextInjector |
| Self-Learning | Agent memory stored in `.agent-knowledge/` |
| MCP Integration | 25 verified servers assigned by role |

#### Agent Definition Format
```yaml
---
name: frontend-specialist
description: UI/UX development expert for React, Vue, Angular
tools: Read, Edit, Write, Bash, Grep, Glob, WebFetch
---

When invoked:
1. Analyze design requirements
2. Implement responsive, accessible components
3. Optimize performance
...
```

#### Unique Capabilities
- **Document Upload**: PDF, Word, Figma file processing
- **Website Cloning**: Via Firecrawl MCP
- **Figma Dev Mode**: Direct desktop integration
- **Visual Testing**: Playwright MCP for UI validation
- **Knowledge Graph**: Semantic codebase understanding

---

### Claude Code Workflows (Patrick Ellis)
**Practical Workflow Templates for Claude Code**

#### Three Core Workflows

##### 1. Code Review Workflow
- **Dual-loop architecture**: Slash commands + GitHub Actions
- **Pragmatic Quality Framework**: Balance rigor with velocity
- **Hierarchical Review**: Architecture → Security → Maintainability → Performance
- **Triage Matrix**: [Critical/Blocker], [Improvement], [Nit]

##### 2. Security Review Workflow
- **OWASP Top 10 Standards**
- **Severity Classification**: Critical, High, Medium, Low
- **Automated PR Scanning**: Via GitHub Actions
- **Secret Detection**: Hardcoded credentials, API keys

##### 3. Design Review Workflow
- **Playwright MCP Integration**: Browser automation
- **Viewport Testing**: 375px, 768px, 1440px, 1920px
- **Accessibility Validation**: WCAG compliance
- **Performance Metrics**: Core Web Vitals

#### Agent Design Philosophy
```markdown
**Net Positive > Perfection**
- Don't block on imperfections if change improves overall health
- Focus on substance over style
- Prefix optional suggestions with "Nit:"
```

---

### EquilateralAgents Open Core (HappyHippo.ai)
**22 Self-Learning Agents with Standards Methodology**

#### Core Concept: Knowledge Synthesis Flywheel
```
Execute Workflows → Agent Memory → Knowledge Harvest →
Create Standards → Enforce Standards → Fewer Incidents → [Repeat]
```

#### Agent Categories (22 Total)

| Category | Agents | Purpose |
|----------|--------|---------|
| Infrastructure (3) | Classifier, MemoryManager, Factory | Task routing, state, generation |
| Development (6) | CodeAnalyzer, Generator, TestOrchestration | Building code |
| Quality (5) | Auditor, CodeReview, Frontend/Backend Auditors | Standards enforcement |
| Security (4) | Scanner, Reviewer, Vulnerability, Compliance | Security posture |
| Infrastructure (4) | Deployment, Resource, Config, Monitoring | DevOps |

#### Three-Tier Standards System
1. **Official Standards** (`.standards/`): Universal principles
2. **Community Standards** (`.standards-community/`): Shared patterns
3. **Local Standards** (`.standards-local/`): Team-specific

#### Standard Creation Format
```markdown
## [Standard Name]

**What Happened:** [Incident description]
**The Cost:** [Business/technical impact]
**The Rule:** [Preventive measure]
```

#### Self-Learning System
- Track last 100 executions per agent
- Identify success/failure patterns
- Weekly knowledge harvest via `npm run memory:stats`
- Patterns become standards after 3+ occurrences

---

### Agent Fusion (Kotlin/JVM)
**MCP Context Engine + Task Manager**

#### Two Independent Components

##### 1. MCP Context Engine (RAG for Code)
- **Semantic Search**: Sentence-transformers embeddings
- **Symbol Search**: Identifier matching
- **Full-Text Search**: Keyword search
- **Graph Traversal**: Parent/child/sibling relationships
- **Storage**: DuckDB (local, no cloud)

#### Search Architecture
```
Query → [Semantic Provider] → Combined Ranking → Results
      → [Symbol Provider]   →
      → [Full-Text Provider]→
```

##### 2. Task Manager (Optional)
- **Multi-AI Coordination**: Route tasks between AIs
- **Voting System**: Consensus on decisions
- **Web Dashboard**: Real-time monitoring (port 8081)
- **Audit Trail**: All proposals and decisions logged

#### Configuration (TOML-based)
```toml
[context.watcher]
watch_paths = ["."]
ignore_patterns = [".git/", "node_modules/", "build/"]

[context.indexing]
allowed_extensions = [".kt", ".py", ".ts", ".md"]
skip_patterns = ["*.test.ts", "*.min.js"]
```

#### Why Semantic Search Matters
> "Ask for 'authentication logic' and grep finds 'authentication' —
> missing every file that calls it 'login', 'credentials', or 'access control'.
> Semantic search understands concepts, not just keywords."

---

## Synthesis: Key Patterns Across All Frameworks

### 1. Agent Definition Patterns

| Framework | Format | Key Fields |
|-----------|--------|------------|
| OS 2.2 | YAML frontmatter in MD | name, description, tools, model |
| Agentwise | YAML frontmatter in MD | name, description, tools |
| Workflows | YAML frontmatter in MD | name, description, tools, model, color |
| Equilateral | JavaScript classes | Static methods, capabilities |
| Agent Fusion | TOML config | Routing rules |

### 2. Context Management Strategies

| Strategy | Implementation | Benefit |
|----------|---------------|---------|
| Shared Context Server | Agentwise (port 3003) | 15-20% token reduction |
| Knowledge Graph | Agentwise, Agent Fusion | Semantic understanding |
| Standards Library | Equilateral | Institutional memory |
| File Watching | Agent Fusion | Auto-reindex on change |

### 3. Quality Gates

| Framework | Gate | Purpose |
|-----------|------|---------|
| OS 2.2 | Team Confirmation | User approves agents |
| Workflows | Triage Matrix | Prioritize findings |
| Equilateral | Standards Check | Prevent known mistakes |
| Agent Fusion | Voting System | Consensus on decisions |

### 4. Common Specialist Roles

All frameworks converge on similar specialists:
- **Frontend**: UI/UX, React, accessibility
- **Backend**: API, server logic, auth
- **Database**: Schema, queries, migrations
- **Security**: Vulnerabilities, OWASP
- **Testing**: Unit, integration, E2E
- **DevOps**: CI/CD, deployment
- **Design/Review**: Visual validation, code review

---

## Recommendations for OS 2.2

### 1. Adopt From Agentwise
- **Self-Learning Pattern**: Track agent success/failure in memory
- **Token Optimization**: Consider SharedContextServer approach
- **Visual Testing**: Enhanced Playwright integration

### 2. Adopt From Workflows
- **Triage Matrix**: [Critical], [Improvement], [Nit] for reviews
- **Net Positive Philosophy**: Don't block on imperfections
- **Design Principles File**: Project-specific design standards

### 3. Adopt From Equilateral
- **Standards Methodology**: "What Happened, Cost, Rule"
- **Knowledge Harvest**: Weekly pattern extraction
- **Three-Tier Standards**: Official → Community → Local

### 4. Adopt From Agent Fusion
- **Semantic Search**: For context retrieval
- **Multi-Provider Search**: Combine semantic + symbol + full-text
- **TOML Config**: For complex configuration

### 5. Patterns to Avoid
- Over-engineering context systems (keep it simple)
- Too many agent roles (consolidate where possible)
- Excessive token optimization (adds complexity)
- Voting systems (slow down execution)
