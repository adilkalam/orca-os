# Parallel Agent Deployment Pattern

**When to use:** Multiple independent components/features that don't depend on each other.

**Goal:** Spawn multiple specialized agents concurrently to maximize throughput.

---

## Sequential vs Parallel

### ❌ Sequential (Inefficient for independent work)

One agent with a sequential todo list:

```
expo-builder-agent working through:
  ☐ My Protocols: Wire components + glass chrome
  ☐ Protocol Builder: Wire components + glass chrome
  ☐ Schedule: Restructure data grouping
  ☐ Inventory: Polish empty state + glass chrome
```

**Problem:** Single agent does all work sequentially. Total time = sum of all tasks.

**What you see in Claude Code:**
```
⏺ expo-builder-agent(Phase 4.1: Wiring components)
  ⎿  Update(app/my-protocols.tsx)
     Updated app/my-protocols.tsx
     +30 more tool uses

✻ Wiring My Protocols components… (3m 9s)
  ⎿  ☑ My Protocols: Wire components + glass chrome
     ☐ Protocol Builder: Wire components + glass chrome
     ☐ Schedule: Restructure data grouping
     ☐ Inventory: Polish empty state + glass chrome
```

Each task completes before the next starts.

### ✅ Parallel (Efficient for independent work)

ORCA spawns multiple agents concurrently:

```
ORCA spawns 4 agents in parallel:
  → expo-builder-agent(My Protocols)
  → expo-builder-agent(Protocol Builder)
  → expo-builder-agent(Schedule)
  → expo-builder-agent(Inventory)
```

**Benefit:** All work happens simultaneously. Total time ≈ longest task.

**What you see in Claude Code:**
```
⏺ expo-builder-agent(My Protocols)
  ⎿  Update(app/my-protocols.tsx)

⏺ expo-builder-agent(Protocol Builder)
  ⎿  Update(app/protocol-builder.tsx)

⏺ expo-builder-agent(Schedule)
  ⎿  Update(app/schedule.tsx)

⏺ expo-builder-agent(Inventory)
  ⎿  Update(app/inventory.tsx)

✻ All 4 agents working concurrently…
```

All 4 agents work simultaneously.

---

## When to Use Parallel Deployment

### Use Parallel When:

- ✅ Components are in **different files**
- ✅ No shared state between components
- ✅ No inter-dependencies (A doesn't need B's output)
- ✅ Same phase of work (all Phase 4, all Phase 5, etc.)
- ✅ Similar scope (all feature implementation, or all testing, etc.)

### Use Sequential When:

- ❌ One task depends on another's output
- ❌ Shared files require coordination
- ❌ Different phases (can't test before implementing)
- ❌ Risk of merge conflicts if done concurrently

---

## Implementation: How ORCA Deploys Parallel Agents

### Step 1: User Request

```
/orca-expo "Wire 4 screens: My Protocols, Protocol Builder, Schedule, Inventory - all need glass chrome"
```

### Step 2: ORCA Analysis

ORCA (the orchestrator) analyzes the request:

```
Identified work:
1. My Protocols screen (app/my-protocols.tsx)
2. Protocol Builder screen (app/protocol-builder.tsx)
3. Schedule screen (app/schedule.tsx)
4. Inventory screen (app/inventory.tsx)

Analysis:
- 4 separate files ✓
- No shared state ✓
- All Phase 4 work ✓
- Same requirements (glass chrome) ✓

Decision: PARALLEL deployment
```

### Step 3: ORCA Spawns Multiple Task Calls

**CRITICAL RULE:** All Task invocations must be in **ONE MESSAGE** for parallel execution.

**Bad (Sequential):**
```xml
<function_calls>
<invoke name="Task">...</invoke></function_calls>
<!-- Agent 1 runs, then WAITS for completion -->

Then send another message:
```xml
<function_calls>
<invoke name="Task">...</invoke>
</function_calls>
<!-- Agent 2 runs, then WAITS for completion -->
```

**Result:** Agents run sequentially, waiting for each to finish.

**Good (Parallel):**
```xml
<!-- DO THIS - All agents run concurrently -->
<function_calls>
<invoke name="Task">
<parameter name="subagent_type">expo-builder-agent</parameter>
<parameter name="description">Wire My Protocols</parameter>
<parameter name="prompt">Phase 4.1: My Protocols component wiring

Files: app/my-protocols.tsx, components/protocols/*
Task: Wire protocol list data + apply glass chrome styling
Scope: ONLY My Protocols screen</parameter>
</invoke>
<invoke name="Task">
<parameter name="subagent_type">expo-builder-agent</parameter>
<parameter name="description">Wire Protocol Builder</parameter>
<parameter name="prompt">Phase 4.1: Protocol Builder component wiring

Files: app/protocol-builder.tsx, components/protocol-builder/*
Task: Wire protocol creation flow + apply glass chrome styling
Scope: ONLY Protocol Builder screen</parameter>
</invoke>
<invoke name="Task">
<parameter name="subagent_type">expo-builder-agent</parameter>
<parameter name="description">Restructure Schedule</parameter>
<parameter name="prompt">Phase 4.1: Schedule data grouping restructure

Files: app/schedule.tsx, components/schedule/*
Task: Refactor data grouping logic for better performance
Scope: ONLY Schedule screen</parameter>
</invoke>
<invoke name="Task">
<parameter name="subagent_type">expo-builder-agent</parameter>
<parameter name="description">Polish Inventory</parameter>
<parameter name="prompt">Phase 4.1: Inventory empty state polish

Files: app/inventory.tsx, components/inventory/*
Task: Improve empty state UX + apply glass chrome styling
Scope: ONLY Inventory screen</parameter>
</invoke>
</function_calls>
```

**Result:** All 4 agents start immediately and work concurrently.

---

## Real-World Example from Expo Project

### User Request:
```
/orca-expo "My Protocols, Protocol Builder, Schedule, Inventory need glass chrome + wiring"
```

### ORCA Response:
```
Analyzing request...
- 4 independent screens identified
- All require similar work (component wiring + styling)
- No dependencies between screens
- Decision: Parallel deployment

Spawning 4 expo-builder-agent instances...
```

### What Claude Code Shows:
```
⏺ expo-builder-agent(My Protocols)
  ⎿ Read(app/my-protocols.tsx)
  ⎿ Read(design-system.md)
  ⎿ Edit(app/my-protocols.tsx)

⏺ expo-builder-agent(Protocol Builder)
  ⎿ Read(app/protocol-builder.tsx)
  ⎿ Read(design-system.md)
  ⎿ Edit(app/protocol-builder.tsx)

⏺ expo-builder-agent(Schedule)
  ⎿ Read(app/schedule.tsx)
  ⎿ Edit(app/schedule.tsx)

⏺ expo-builder-agent(Inventory)
  ⎿ Read(app/inventory.tsx)
  ⎿ Read(design-system.md)
  ⎿ Edit(app/inventory.tsx)

✻ All agents working concurrently (4 parallel threads)
```

### Results:
- All 4 screens completed in ~5 minutes (time of longest task)
- If done sequentially: would take ~18 minutes (sum of all tasks)
- **Throughput improvement: 3.6x**

---

## Best Practices

### 1. Clear Scope Boundaries

Each agent should have:
- **Specific files** it's responsible for
- **Clear deliverables** it must produce
- **Explicit scope limits** (don't touch other components)

**Example:**
```
Scope: ONLY My Protocols screen
Do not modify: Protocol Builder, Schedule, or Inventory screens
Files: app/my-protocols.tsx, components/protocols/*
```

### 2. Shared Context in All Prompts

If multiple agents need the same information, include it in all prompts:

```
All agents should reference:
- Design system: design-system.md (glass chrome tokens)
- Phase state: phase_state.json (current phase context)
- Quality rubric: expo-rubric.md (target standards)
```

### 3. Post-Parallel Verification

After all agents complete, run a single verification step:

```
All 4 screens implemented → Run unified verification:
- Build the app (check for conflicts)
- Run tests (check for regressions)
- Design review (check visual consistency)
- Accessibility check (check a11y compliance)
```

---

## When NOT to Use Parallel Deployment

### Dependencies Between Tasks

```
❌ DON'T parallelize this:
1. Design API schema
2. Implement API endpoints
3. Wire up frontend to API

Why: Each step depends on the previous step's output
```

### Shared File Modifications

```
❌ DON'T parallelize this:
1. Refactor theme.ts (colors)
2. Refactor theme.ts (typography)
3. Refactor theme.ts (spacing)

Why: All modify the same file → merge conflicts
```

### Different Pipeline Phases

```
❌ DON'T parallelize this:
1. Phase 4: Implement features
2. Phase 5: Run tests
3. Phase 6: Deploy

Why: Must complete phases sequentially
```

---

## ORCA Decision Tree

```
User request → Analyze tasks

Are tasks independent?
├─ Yes → Can they run in parallel?
│  ├─ Yes (different files, no deps) → PARALLEL
│  └─ No (shared files, dependencies) → SEQUENTIAL
└─ No → SEQUENTIAL

PARALLEL → Spawn all agents in single message
SEQUENTIAL → Spawn agents one at a time, wait for each
```

---

## Implementation Checklist

When implementing parallel deployment in ORCA:

- [ ] Analyze user request for independent tasks
- [ ] Verify no inter-dependencies between tasks
- [ ] Confirm different files / no shared state
- [ ] Check all tasks are same phase/scope
- [ ] Spawn all Task invocations in ONE message
- [ ] Include shared context in all agent prompts
- [ ] Define clear scope boundaries for each agent
- [ ] Plan post-parallel verification step
- [ ] Monitor all agents concurrently
- [ ] Aggregate results after all complete

---

_Last updated: 2025-11-20_
