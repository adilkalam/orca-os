# Orchestrator Framework - OS 2.0

**Purpose:** Systematic approach to task decomposition, subagent delegation, and execution
**Version:** 1.0
**Last Updated:** 2025-11-20

---

## Overview

This framework provides **explicit patterns** for orchestrating multi-agent workflows. It replaces ad-hoc agent delegation with structured decision-making based on task characteristics.

**Core Principle:** Make orchestration predictable through systematic classification and budgeting.

---

## Part 1: Task Classification Taxonomy

Every task falls into one of three categories. **Classify FIRST, then orchestrate accordingly.**

### 1. Depth-First Queries

**Definition:** Problems requiring multiple perspectives on the same core issue.

**Characteristics:**
- Single question with multiple valid approaches
- Benefits from diverse viewpoints or methodologies
- Same topic analyzed from different angles
- Synthesis across perspectives creates value

**Examples:**
- "What are the most effective treatments for depression?" → Multiple treatment modalities
- "What caused the 2008 financial crisis?" → Economic, regulatory, behavioral perspectives
- "Best approach to building AI finance agents in 2025?" → Technical, business, security angles

**Orchestration Strategy:**
- Deploy agents sequentially to explore different methodologies
- Start with approach most likely to yield comprehensive results
- Follow with alternative viewpoints to fill gaps
- Synthesize findings across perspectives

**Typical Subagent Count:** 3-5 agents (one per perspective)

---

### 2. Breadth-First Queries

**Definition:** Problems that decompose into distinct, independent sub-questions.

**Characteristics:**
- Naturally divides into multiple parallel research streams
- Each sub-question can be researched independently
- Minimal dependencies between sub-topics
- Results aggregate into coherent whole

**Examples:**
- "Compare economic systems of Nordic countries" → Independent research per country
- "Net worth and birthplace of Fortune 500 CEOs" → Divide into segments
- "Compare frontend frameworks on performance, learning curve, ecosystem" → Research each framework independently

**Orchestration Strategy:**
- Enumerate all distinct sub-questions upfront
- Prioritize sub-tasks by importance and complexity
- Define clear boundaries to prevent overlap
- Deploy subagents in parallel for efficiency
- Plan aggregation strategy before execution

**Typical Subagent Count:** 5-10 agents (one per sub-topic)

---

### 3. Straightforward Queries

**Definition:** Focused, well-defined problems with direct path to answer.

**Characteristics:**
- Single focused investigation
- Clear success criteria
- Minimal complexity
- Does not benefit from extensive research

**Examples:**
- "What is the current population of Tokyo?" → Simple fact-finding
- "List all Fortune 500 companies" → Fetch single resource
- "When is the tax deadline this year?" → Single data point

**Orchestration Strategy:**
- Identify most direct path to answer
- Minimal delegation (1 agent or handle yourself)
- Focus on verification of accuracy
- Avoid over-engineering

**Typical Subagent Count:** 0-1 agents

---

## Part 2: Subagent Count Guidelines

**Rule:** Match agent count to task complexity, not arbitrary numbers.

### Decision Tree

```
Is this straightforward?
├─ YES → 0-1 agents (handle yourself or simple delegation)
└─ NO → Is this depth-first or breadth-first?
    ├─ Depth-first → How many distinct perspectives?
    │   ├─ 2-3 perspectives → 2-3 agents
    │   ├─ 4-5 perspectives → 4-5 agents
    │   └─ >5 perspectives → Consolidate to 5 agents max
    └─ Breadth-first → How many distinct sub-questions?
        ├─ 2-5 sub-questions → 2-5 agents (one per sub-question)
        ├─ 6-10 sub-questions → 6-10 agents
        ├─ 11-20 sub-questions → Group related sub-questions, aim for 10 agents
        └─ >20 sub-questions → Restructure approach, max 20 agents
```

### Count Matrix

| Task Complexity | Agent Count | Example |
|----------------|-------------|---------|
| Trivial | 0 | Simple calculation, basic fact |
| Simple | 1 | Single fact lookup, one data point |
| Standard | 2-3 | Compare 3 options, analyze from 2-3 angles |
| Medium | 3-5 | Multi-faceted analysis, 4-5 sub-topics |
| High | 5-10 | Broad research, multiple independent streams |
| Very High | 10-20 | Fortune 500 analysis, comprehensive research |

**Hard Limit:** Never exceed 20 agents unless absolutely necessary. If task seems to require >20 agents, restructure your approach to consolidate similar sub-tasks.

**Efficiency Rule:** Prefer fewer, more capable agents over many narrow ones. Each agent adds overhead.

---

## Part 3: Research Budget System

**Purpose:** Prevent runaway agent loops and ensure efficient tool usage.

### Budget Guidelines by Task Complexity

| Task Type | Tool Call Budget | Reasoning |
|-----------|-----------------|-----------|
| **Trivial** | 0-2 calls | Simple lookup or reasoning, minimal tools needed |
| **Simple** | 3-5 calls | Single source verification, basic checks |
| **Medium** | 5-10 calls | Multiple source verification, moderate analysis |
| **Hard** | 10-15 calls | Deep analysis, comprehensive research |
| **Very Hard** | 15-20 calls | Multi-part research, extensive investigation |

**Absolute Maximum:** 20 tool calls per agent. If approaching limit, stop gathering sources and synthesize findings.

### Budget Allocation Strategy

**For Simple Tasks (3-5 calls):**
1. Initial query/search (1-2 calls)
2. Follow-up verification (1-2 calls)
3. Final synthesis (0-1 calls)

**For Medium Tasks (5-10 calls):**
1. Initial exploration (2-3 calls)
2. Deep investigation (3-5 calls)
3. Verification and synthesis (1-2 calls)

**For Hard Tasks (10-15 calls):**
1. Broad exploration (3-4 calls)
2. Focused deep dives (5-8 calls)
3. Cross-verification (2-3 calls)

### Efficiency Signals

**Stop research when:**
- Diminishing returns (not finding new relevant information)
- Same information appearing across sources
- Budget approaching limit
- Sufficient confidence in findings
- Task objectives met

**Don't waste budget on:**
- Repeated identical queries
- Overly specific searches with poor hit rates
- Tools for trivial operations (e.g., repl for simple math)
- Redundant verification when sources agree

---

## Part 4: OODA Loop Framework

**Purpose:** Structured decision-making process for agents during execution.

### The OODA Loop

```
┌─────────────┐
│  OBSERVE    │ What info gathered? What still needed? What tools available?
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  ORIENT     │ What tools/queries best? Update beliefs based on findings
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  DECIDE     │ Informed decision to use specific tool in certain way
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    ACT      │ Use tool, analyze result
└──────┬──────┘
       │
       └──────────┐
                  │
                  ▼
            (Repeat Loop)
```

### Implementation Template

**After each tool result:**

1. **OBSERVE:**
   - What information have I gathered so far?
   - What gaps remain in my understanding?
   - What tools are available currently?
   - How much budget do I have left?

2. **ORIENT:**
   - Which tool would be most valuable next?
   - How does this new information change my approach?
   - Are there alternative approaches I should consider?
   - Is current approach working or should I pivot?

3. **DECIDE:**
   - I will use [TOOL] to [SPECIFIC ACTION]
   - Because [REASONING based on OBSERVE + ORIENT]
   - This will cost [N] tool calls from my budget
   - Expected outcome: [WHAT I HOPE TO LEARN]

4. **ACT:**
   - Execute tool call
   - Analyze result quality and relevance
   - Update mental model based on findings
   - Return to OBSERVE

### Example OODA Cycle

```markdown
**OBSERVE:** I have basic facts about Feature X but lack performance data.
Budget: 7/15 calls used. Tools available: web_search, web_fetch, repl.

**ORIENT:** Performance data likely in technical docs or benchmarks.
web_fetch would give complete info vs web_search snippets. Official docs
are higher quality than blog posts.

**DECIDE:** Use web_fetch on official documentation URL found in previous
search. This will cost 1 call. Expected: Detailed performance metrics and
benchmarks.

**ACT:** [Execute web_fetch]
Result: Found comprehensive benchmark data. Now have 80% of needed info.
```

---

## Part 5: Parallel Execution Patterns

**Default Behavior:** Use parallel tool calls whenever operations are independent.

### When to Parallelize

**Always parallelize:**
- Creating multiple subagents at workflow start
- Independent web searches for different topics
- Multiple file reads that don't depend on each other
- Separate data fetches from independent sources

**Never parallelize:**
- Operations with dependencies (read then edit same file)
- Sequential analysis (analyze result A, then use insight to query B)
- Budget-constrained operations where you want to evaluate after each step

### Parallel Execution Template

**Bad (Sequential):**
```
1. Create subagent for iOS research
2. Wait for completion
3. Create subagent for Android research
4. Wait for completion
5. Create subagent for Web research
```
**Result:** 3x time, unnecessary waiting

**Good (Parallel):**
```
1. Create 3 subagents simultaneously:
   - iOS research subagent
   - Android research subagent
   - Web research subagent
2. Wait for all completions
3. Synthesize results
```
**Result:** 1x time, maximum efficiency

### Implementation

**Single Message, Multiple Tool Calls:**
```
When deploying multiple independent subagents, send a single message
with multiple Task tool calls rather than multiple sequential messages.

Example:
<tool_use>Task (iOS research)</tool_use>
<tool_use>Task (Android research)</tool_use>
<tool_use>Task (Web research)</tool_use>
```

---

## Part 6: Delegation Best Practices

### Clear Task Instructions Template

Every subagent should receive:

```markdown
**OBJECTIVE:** [Single, clear goal]

**EXPECTED OUTPUT:** [Specific format - list, report, analysis, etc.]

**BACKGROUND:** [Context about user's query and how this fits]

**KEY QUESTIONS:**
- Question 1 to answer
- Question 2 to answer
- Question 3 to answer

**SUGGESTED SOURCES:**
- [Where to start looking]
- [What constitutes reliable information]
- [Sources to avoid and why]

**TOOLS TO USE:**
- Primary: [Main tool for this task]
- Secondary: [Backup tools if needed]
- Don't use: [Tools that won't help]

**SCOPE BOUNDARIES:**
- Focus on: [What's in scope]
- Don't research: [What's out of scope]

**BUDGET:** [X tool calls for this task]
```

### Bad vs Good Delegation

**❌ Bad (Vague):**
```
"Research iOS development patterns"
```
- No clear objective
- No output format specified
- No guidance on where to look
- No scope boundaries

**✅ Good (Clear):**
```
**OBJECTIVE:** Identify modern iOS architecture patterns (2024-2025) with
adoption rates and tradeoffs

**EXPECTED OUTPUT:** Markdown report with:
- List of 3-5 patterns (MVVM, TCA, VIPER, etc.)
- Adoption rate estimates
- Pros/cons comparison table

**KEY QUESTIONS:**
- What are the current popular iOS architecture patterns?
- What are their relative adoption rates?
- What are the tradeoffs of each?

**SUGGESTED SOURCES:**
- Official Apple documentation
- iOS dev community surveys (iOS Dev Weekly, Swift.org forums)
- GitHub repo statistics for pattern libraries

**TOOLS TO USE:**
- web_search: Find overview articles and surveys
- web_fetch: Get detailed pattern documentation

**SCOPE:** Focus on architecture patterns, not UI frameworks. SwiftUI vs
UIKit is out of scope.

**BUDGET:** 8 tool calls
```

---

## Part 7: Synthesis Strategy

**Planning synthesis before execution prevents chaotic results.**

### Pre-Execution Synthesis Planning

**Before deploying subagents, decide:**

1. **What format will final output take?**
   - Report? List? Comparison table? Decision matrix?

2. **How will subagent results combine?**
   - Merged sections? Aggregated data? Synthesized analysis?

3. **How will conflicts be resolved?**
   - Prioritize by source quality? Majority vote? Expert judgment?

4. **What's the success criteria?**
   - What does "complete answer" look like?

### Synthesis Patterns

**Pattern 1: Aggregation (Breadth-First)**
```
Sub-task A results → |
Sub-task B results → | → Aggregate into comprehensive list/report
Sub-task C results → |
```
Example: Fortune 500 CEO research → Combine all data points

**Pattern 2: Synthesis (Depth-First)**
```
Perspective A → |
Perspective B → | → Synthesize into unified analysis
Perspective C → |
```
Example: "What caused financial crisis?" → Integrate economic, regulatory, behavioral views

**Pattern 3: Comparison (Evaluation)**
```
Option A analysis → |
Option B analysis → | → Compare and recommend
Option C analysis → |
```
Example: Frontend framework comparison → Scoring matrix with recommendation

---

## Part 8: Adaptation Mechanisms

**Plans should adapt based on findings, not be rigidly followed.**

### When to Adapt

**Signals that plan needs adjustment:**
- Subagent returns unexpected findings that change scope
- Research hitting dead ends (sources don't exist)
- Budget consumed faster than expected
- Original assumptions proven wrong
- User context changes mid-execution

### Adaptation Strategies

**1. Scope Adjustment:**
- Broaden if results too narrow
- Narrow if too broad/overwhelming
- Pivot to related topic if original unresearchable

**2. Resource Reallocation:**
- Stop unproductive research streams
- Double down on high-value findings
- Redirect budget to promising leads

**3. Strategy Shift:**
- Switch from depth-first to breadth-first (or vice versa)
- Change from comprehensive to targeted analysis
- Adjust subagent count based on complexity revelation

### Adaptation Protocol

**Step 1: Recognize Signal**
- What's not working as expected?
- What new information changes the situation?

**Step 2: Diagnose Issue**
- Is this a temporary obstacle or fundamental problem?
- Can original plan succeed with adjustments?
- Or does plan need complete revision?

**Step 3: Decide Adjustment**
- Scope change? Resource reallocation? Strategy shift?
- What specific modifications to make?

**Step 4: Communicate Change**
- Update remaining subagents with new context
- Adjust synthesis strategy if needed
- Revise success criteria if appropriate

---

## Part 9: Quality Gates

**Don't wait until the end to check quality. Gate at each stage.**

### Stage 1: Planning Quality Gate

**Before deploying any subagents, verify:**
- [ ] Task classified correctly (depth/breadth/straightforward)
- [ ] Subagent count matches complexity
- [ ] Budget allocated appropriately
- [ ] Clear delegation instructions prepared
- [ ] Synthesis strategy defined
- [ ] Success criteria established

**If any checkbox fails, revise plan before proceeding.**

### Stage 2: Execution Quality Gate

**After each subagent completes, verify:**
- [ ] Output matches expected format
- [ ] Key questions answered
- [ ] Sources are high quality
- [ ] Findings are relevant to original query
- [ ] Budget used efficiently

**If subagent output is poor quality, diagnose before continuing:**
- Were instructions unclear?
- Was task too broad/narrow?
- Were suggested sources wrong?
- Does approach need adjustment?

### Stage 3: Synthesis Quality Gate

**Before finalizing output, verify:**
- [ ] All subagent findings integrated
- [ ] Conflicts resolved appropriately
- [ ] Output format matches user needs
- [ ] Success criteria met
- [ ] Quality meets standards (see quality rubrics)

---

## Part 10: Common Anti-Patterns

### Anti-Pattern 1: Over-Engineering Simple Tasks
**Problem:** Creating 5 subagents for straightforward query
**Solution:** Use task classification - most queries are straightforward

### Anti-Pattern 2: Vague Delegation
**Problem:** "Research iOS development" with no specifics
**Solution:** Use delegation template with clear objectives

### Anti-Pattern 3: Sequential When Parallel Available
**Problem:** Deploying subagents one at a time
**Solution:** Default to parallel execution for independent tasks

### Anti-Pattern 4: No Budget Management
**Problem:** Agent makes 50 tool calls chasing rabbit holes
**Solution:** Set explicit budget, track usage, stop when diminishing returns

### Anti-Pattern 5: Rigid Plans
**Problem:** Following original plan despite evidence it's wrong
**Solution:** Use OODA loop to adapt based on findings

### Anti-Pattern 6: No Synthesis Strategy
**Problem:** Deploy subagents, then figure out how to combine results
**Solution:** Plan synthesis before execution

### Anti-Pattern 7: Ignoring Quality Gates
**Problem:** Proceeding with poor subagent output
**Solution:** Gate at each stage, fix issues immediately

---

## Quick Reference: Decision Flowchart

```
START: New Task
│
├─ CLASSIFY: Depth/Breadth/Straightforward?
│  │
│  ├─ Straightforward → 0-1 agents → Execute directly
│  ├─ Depth-First → 3-5 agents → Sequential perspectives
│  └─ Breadth-First → 5-10 agents → Parallel sub-questions
│
├─ BUDGET: Assign tool call budget
│  ├─ Simple: 3-5 calls
│  ├─ Medium: 5-10 calls
│  └─ Hard: 10-15 calls
│
├─ PLAN SYNTHESIS: How will results combine?
│  ├─ Aggregation (breadth)
│  ├─ Synthesis (depth)
│  └─ Comparison (evaluation)
│
├─ DELEGATE: Create subagents
│  ├─ Use template for clear instructions
│  └─ Deploy in parallel when possible
│
├─ EXECUTE: Monitor with OODA loops
│  ├─ Observe → Orient → Decide → Act
│  └─ Adapt plan based on findings
│
└─ SYNTHESIZE: Combine results
   ├─ Apply synthesis strategy
   ├─ Resolve conflicts
   └─ Verify quality gates
```

---

## Usage Examples

### Example 1: Depth-First Query

**Query:** "What's the best approach to building production ML systems in 2025?"

**Classification:** Depth-first (multiple perspectives on single question)

**Plan:**
- 4 agents (infrastructure, MLOps, serving, monitoring)
- 10 tool calls per agent (medium complexity)
- Synthesis: Integrate perspectives into unified recommendations

**Delegation:**
```
Agent 1: Infrastructure perspective
- Objective: Research infrastructure patterns
- Focus: Cloud vs on-prem, GPU management, scaling
- Budget: 10 calls

Agent 2: MLOps perspective
- Objective: Research MLOps tooling and workflows
- Focus: Training pipelines, versioning, deployment
- Budget: 10 calls

Agent 3: Serving perspective
- Objective: Research model serving patterns
- Focus: APIs, latency, throughput, batching
- Budget: 10 calls

Agent 4: Monitoring perspective
- Objective: Research monitoring and observability
- Focus: Model drift, data quality, performance tracking
- Budget: 10 calls
```

**Synthesis:** Integrate findings into comprehensive guide with recommendations per area

---

### Example 2: Breadth-First Query

**Query:** "Compare TypeScript, Python, Go, and Rust for backend development"

**Classification:** Breadth-first (4 independent sub-questions)

**Plan:**
- 4 agents (one per language)
- 8 tool calls per agent (standard complexity)
- Synthesis: Comparison matrix with scoring

**Delegation:**
```
Agent 1: TypeScript analysis
- Objective: Assess TypeScript for backend dev
- Key questions: Performance, ecosystem, type safety, developer experience
- Budget: 8 calls

Agent 2: Python analysis
[Same structure]

Agent 3: Go analysis
[Same structure]

Agent 4: Rust analysis
[Same structure]
```

**Synthesis:** Create comparison matrix:
| Language | Performance | Ecosystem | Type Safety | DevEx | Recommendation |
|----------|------------|-----------|-------------|-------|----------------|
| TS       | 7/10       | 9/10      | 8/10        | 9/10  | Web APIs       |
| Python   | 6/10       | 10/10     | 6/10        | 10/10 | Data/ML        |
| Go       | 9/10       | 7/10      | 7/10        | 8/10  | Microservices  |
| Rust     | 10/10      | 6/10      | 10/10       | 6/10  | Systems        |

---

## Changelog

- **2025-11-20:** Initial framework created based on Anthropic cookbook patterns

---

## Related Documents

- **Quality Rubrics:** `.claude/orchestration/reference/quality-rubrics/`
- **Output Styles:** `.claude/orchestration/reference/output-styles/`
- **Workflow Templates:** `.claude/orchestration/reference/workflows/`

---

_Framework Version 1.0 - Use this for all orchestration decisions_
