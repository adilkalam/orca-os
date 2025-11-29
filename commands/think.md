---
description: Reasoning strategist - recommends which thinking tools (Clear Thought, Stochastic, Sequential) to use and in what sequence for complex problems.
argument-hint: <problem or scenario to reason through>
---

# /think - Reasoning Strategy Advisor

**YOUR ROLE**: Analyze the user's problem and recommend a reasoning strategy using available thinking MCPs.

**Original Problem**: $ARGUMENTS

---

## If --help or empty arguments

Display this reference and stop:

```
/think - Reasoning Strategy Advisor

Analyzes your problem and recommends which thinking tools to use.

USAGE:
  /think <problem or scenario>
  /think --help

AVAILABLE THINKING TOOLS:

Clear Thought MCP (/clear-thought):
  Core:        --seq, --model, --debug, --creative, --visual, --meta, --science
  Collaborate: --collab, --decide, --socratic, --argue
  Analysis:    --systems, --causal, --analogy, --stats, --optimize
  Patterns:    --tree, --beam, --mcts, --graph
  Strategic:   --ooda, --ulysses

Sequential Thinking MCP:
  mcp__sequential-thinking__sequentialthinking
  - Multi-step reasoning with revision
  - Branching and backtracking
  - Hypothesis generation and verification

Stochastic Thinking MCP (if installed):
  - mdp: Sequential decisions with rewards
  - mcts: Game trees, strategic planning
  - bandit: A/B testing, exploration vs exploitation
  - bayesian: Optimization under uncertainty
  - hmm: Pattern inference, time series

EXAMPLES:
  /think Should we use microservices or monolith?
  /think How do I debug this intermittent failure?
  /think Plan migration from Expo to Swift iOS
  /think Optimize our CI/CD pipeline
```

---

## Phase 1: Problem Classification

Analyze $ARGUMENTS and classify:

### Problem Type
- **Architecture/Design**: System design, tech choices, migrations
- **Debugging/Troubleshooting**: Finding root causes, fixing issues
- **Decision Making**: Choosing between options, trade-offs
- **Planning/Strategy**: Multi-step projects, roadmaps
- **Optimization**: Improving performance, efficiency
- **Exploration**: Understanding options, brainstorming
- **Risk Assessment**: What could go wrong, mitigation

### Complexity Level
- **Simple**: Single decision, clear options
- **Medium**: Multiple factors, some uncertainty
- **Complex**: Many variables, dependencies, unknowns
- **Critical**: High stakes, needs rigorous analysis

### Key Characteristics
- Has clear options to evaluate? → Decision framework
- Involves multiple stakeholders? → Collaborative reasoning
- Has sequential dependencies? → Sequential thinking
- Involves uncertainty/probability? → Stochastic methods
- Needs cause-effect analysis? → Causal/systems thinking
- Is time-critical? → OODA loop
- Is high-stakes? → Ulysses protocol

---

## Phase 2: Generate Reasoning Strategy

Based on classification, recommend a sequence of thinking tools.

### Output Format

```
## Reasoning Strategy for: [Problem Summary]

**Problem Type**: [Classification]
**Complexity**: [Simple/Medium/Complex/Critical]
**Key Challenge**: [What makes this hard]

---

### Recommended Approach

**Phase 1: [Name]** - [Purpose]
```
/clear-thought --[flag] [Specific prompt for this phase]
```
Why: [1 sentence on why this tool fits]

**Phase 2: [Name]** - [Purpose]
```
/clear-thought --[flag] [Specific prompt for this phase]
```
Why: [1 sentence on why this tool fits]

[Continue for 2-5 phases depending on complexity]

---

### Alternative Approaches

If [condition], consider:
- [Alternative tool/sequence]

---

### Quick Start

Copy this to begin:
```
/clear-thought --[first recommended flag] [Ready-to-use prompt]
```
```

---

## Phase 3: Tool Selection Logic

### For Architecture/Design Problems
1. `--systems` → Map components and dependencies
2. `--collab` → Get multiple stakeholder perspectives
3. `--decide` → Evaluate options systematically
4. `--model inversion` → Identify failure modes

### For Debugging/Troubleshooting
1. `--debug` → Structured debugging approach
2. `--causal` → Trace cause-effect chains
3. `--tree` → Explore hypothesis branches
4. If critical: `--ulysses` → High-stakes protocol

### For Decision Making
1. `--decide` → Framework for weighing options
2. `--collab` → Multiple perspectives
3. `--model` (pareto/inversion) → Mental model analysis
4. `--socratic` → Challenge assumptions

### For Planning/Strategy
1. `--seq` → Break down into steps
2. `--systems` → Map dependencies
3. `--tree` → Explore approach branches
4. `--ooda` → If iterative/adaptive needed

### For Optimization
1. `--causal` → Understand what drives performance
2. `--stats` → Analyze data if available
3. Stochastic `bayesian` → If parameter tuning
4. `--optimize` → Find best solution

### For Exploration
1. `--creative` → Generate options
2. `--tree` → Branch exploration
3. `--analogy` → Learn from similar domains
4. `--collab` → Diverse perspectives

### For Risk Assessment
1. `--model inversion` → What could go wrong?
2. `--systems` → Map failure cascades
3. `--ulysses` → If high-stakes
4. `--decide` → Mitigation options

---

## Phase 4: Stochastic Tools (When to Recommend)

Recommend Stochastic Thinking MCP when:

| Situation | Algorithm | Why |
|-----------|-----------|-----|
| A/B testing, exploration vs exploitation | `bandit` | Balances trying new vs known good |
| Multi-step decisions with rewards | `mdp` | Optimizes over sequences |
| Game theory, adversarial scenarios | `mcts` | Simulates opponent moves |
| Hyperparameter tuning, expensive experiments | `bayesian` | Optimizes with uncertainty |
| Pattern inference from sequences | `hmm` | Infers hidden states |

Example recommendation:
```
This problem involves balancing exploration (trying new approaches) with
exploitation (using what works). Consider Stochastic Thinking:

mcp__stochastic-thinking__stochasticalgorithm
  algorithm: "bandit"
  problem: "[Your specific problem]"
  parameters: { strategy: "ucb", arms: [number of options] }
```

---

## Phase 5: Present Strategy

After generating the strategy:
1. Present the full reasoning strategy
2. Highlight the "Quick Start" command they can copy
3. Offer to run the first phase for them

End with:
```
Ready to begin? I can run the first phase now, or you can copy the
commands above to work through them step by step.
```

---

## Examples

### Example 1: Tech Stack Decision
**Input**: "Should we use microservices or monolith?"

**Output**:
```
## Reasoning Strategy for: Microservices vs Monolith

**Problem Type**: Architecture Decision
**Complexity**: Complex
**Key Challenge**: Long-term implications, many trade-offs

### Recommended Approach

**Phase 1: Systems Mapping** - Understand current state
/clear-thought --systems Map our application: current architecture, team size, deployment frequency, scaling needs, domain boundaries

**Phase 2: Multi-Perspective Analysis** - Get diverse viewpoints
/clear-thought --collab Microservices vs monolith: DevOps perspective, Developer perspective, Business perspective, Operations perspective

**Phase 3: Trade-off Evaluation** - Systematic comparison
/clear-thought --decide Compare: (A) Stay monolith (B) Full microservices (C) Modular monolith (D) Gradual extraction

**Phase 4: Risk Analysis** - What could go wrong
/clear-thought --model inversion How could each architecture choice fail? What are the worst-case scenarios?

### Quick Start
/clear-thought --systems Map our application: current architecture, team size, deployment frequency, scaling needs, domain boundaries
```

### Example 2: Debugging
**Input**: "Why is this test flaky?"

**Output**:
```
## Reasoning Strategy for: Flaky Test Investigation

**Problem Type**: Debugging
**Complexity**: Medium
**Key Challenge**: Intermittent failures are hard to reproduce

### Recommended Approach

**Phase 1: Structured Debug** - Apply debugging methodology
/clear-thought --debug Flaky test investigation: What are the symptoms? When does it fail? What's different between pass/fail runs?

**Phase 2: Causal Analysis** - Trace the cause
/clear-thought --causal What could cause intermittent test failures? Timing? State? External dependencies? Race conditions?

**Phase 3: Hypothesis Branching** - Explore possibilities
/clear-thought --tree Different hypotheses for test flakiness: timing issues, shared state, external services, resource contention

### Quick Start
/clear-thought --debug Flaky test investigation: What are the symptoms? When does it fail? What's different between pass/fail runs?
```
