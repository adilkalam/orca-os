# Hybrid Learning System

**Version:** 2.0.0
**Last Updated:** 2025-11-19

---

## Overview

The Hybrid Learning System combines **AgentDB** (ephemeral cache) and **vibe.db** (persistent memory) to create a self-improving orchestration system that learns from every pipeline execution.

### The Two-Tier Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PIPELINE EXECUTION                    │
│                                                          │
│  ┌────────────┐                                         │
│  │  AgentDB   │ ← Fast ephemeral cache                 │
│  │  (Speed)   │   - Analysis results                    │
│  └────────────┘   - Context bundles                     │
│        ↓          - Phase outputs                       │
│        ↓                                                 │
│  ┌────────────┐                                         │
│  │  Pipeline  │                                         │
│  │  Execution │                                         │
│  └────────────┘                                         │
│        ↓                                                 │
│        ↓                                                 │
│  ┌────────────┐                                         │
│  │  Learning  │ ← Extract insights                     │
│  │ Extraction │   - Violations → Standards              │
│  └────────────┘   - Success → Patterns                  │
│        ↓          - Issues → Gotchas                    │
│        ↓                                                 │
│  ┌────────────┐                                         │
│  │  vibe.db   │ ← Persistent institutional memory      │
│  │ (Memory)   │   - decisions                           │
│  └────────────┘   - standards                           │
│                    - task_history                        │
│                    - events                              │
└─────────────────────────────────────────────────────────┘
                      ↓
                      ↓ (next pipeline)
                      ↓
┌─────────────────────────────────────────────────────────┐
│              FUTURE PIPELINE EXECUTION                   │
│                                                          │
│  ProjectContextServer loads from vibe.db                │
│  → Learned standards auto-enforced                      │
│  → Past decisions inform planning                       │
│  → Similar task patterns reused                         │
│                                                          │
│  Self-improving system ✨                               │
└─────────────────────────────────────────────────────────┘
```

---

## System Components

### Component 1: AgentDB (Speed Layer)

**Purpose:** Performance optimization during pipeline execution

**Characteristics:**
- Ephemeral (deleted after pipeline completion)
- Session-scoped (one per pipeline run)
- Key-value storage
- Fast access (<1ms)

**What it stores:**
- Analysis results (dependency maps, schema analysis)
- Context bundles (from ProjectContextServer)
- Phase outputs (for recovery and sharing)
- Expensive computation results

**Lifespan:** Single pipeline execution

**Example:**
```json
{
  "session_id": "a1b2c3d4",
  "cache": {
    "context_query:contextBundle": { "value": {...}, "created_at": "..." },
    "analysis:dependencyMap": { "value": {...}, "computation_time_ms": 120000 },
    "implementation_pass_1:filesModified": { "value": [...] }
  }
}
```

---

### Component 2: vibe.db (Memory Layer)

**Purpose:** Institutional memory across sessions

**Characteristics:**
- Persistent (SQLite database)
- Project-scoped (all pipeline history)
- Relational storage
- Query-able

**What it stores:**
- Decisions (architectural choices, patterns chosen)
- Standards (learned from violations, best practices)
- Task history (what was done, how it went)
- Events (pipeline executions, gate results)

**Lifespan:** Permanent (until explicit deletion)

**Example:**
```sql
-- decisions table
INSERT INTO decisions (domain, decision, reasoning, created_at)
VALUES ('webdev', 'Use Edit tool not Write', 'Preserves context', '2025-11-19');

-- standards table
INSERT INTO standards (domain, category, rule, enforcement_level)
VALUES ('webdev', 'code_quality', 'no_inline_styles', 'automated');

-- task_history table
INSERT INTO task_history (domain, task, outcome, learnings, files_modified)
VALUES ('webdev', 'Fix pricing card spacing', 'success', 'Standards: 100, Design QA: 95', '["src/components/PricingCard.tsx"]');
```

---

## The Learning Flow

### Stage 1: Pipeline Execution (Use AgentDB)

```typescript
async function runPipeline(request: string) {
  // Initialize ephemeral cache
  const sessionId = generateSessionId();
  let agentdb = initializeAgentDB(sessionId, 'webdev');

  try {
    // Phase 1: Context Query
    const contextBundle = await queryContext(request);
    agentdb = cacheSet(agentdb, 'context_query:contextBundle', contextBundle, 'context_query');

    // Phase 2-3: Use cached context (avoid re-query)
    // Phase 4-9: Continue with AgentDB for speed...

    // Success: Extract learnings before cleanup
    const learnings = await extractLearnings(agentdb, phaseResults);
    await saveToVibeDB(learnings);

    // Cleanup AgentDB (ephemeral)
    cleanupAgentDB(sessionId);

  } catch (error) {
    // Even on failure, extract learnings
    const failureLearnings = await extractFailureLearnings(agentdb, error);
    await saveToVibeDB(failureLearnings);

    cleanupAgentDB(sessionId);
    throw error;
  }
}
```

**Key Principle:** AgentDB is fast cache for single execution, then discarded

---

### Stage 2: Learning Extraction (AgentDB → vibe.db)

```typescript
async function extractLearnings(
  agentdb: AgentDB,
  phaseResults: PhaseResults
): Promise<Learnings> {

  const learnings: Learnings = {
    decisions: [],
    standards: [],
    taskHistory: null,
    events: []
  };

  // Extract decisions from planning phase
  const planningOutput = cacheGet(agentdb, 'planning:output');
  if (planningOutput?.architecturalDecisions) {
    learnings.decisions.push(...planningOutput.architecturalDecisions.map(d => ({
      domain: 'webdev',
      decision: d.decision,
      reasoning: d.reasoning,
      context: d.context,
      created_at: new Date().toISOString()
    })));
  }

  // Extract standards from violations
  const violations = cacheGet(agentdb, 'standards_enforcement:violations');
  if (violations && violations.length > 0) {
    for (const violation of violations) {
      learnings.standards.push({
        domain: 'webdev',
        category: 'code_quality',
        rule: violation.violation,
        rationale: violation.fix,
        examples: JSON.stringify({
          bad: violation.example,
          good: violation.fix
        }),
        enforcement_level: 'automated',
        created_at: new Date().toISOString()
      });
    }
  }

  // Create task history record
  const filesModified = cacheGet(agentdb, 'implementation_pass_1:filesModified');
  const standardsScore = phaseResults.standards_enforcement?.score;
  const designQAScore = phaseResults.design_qa?.score;

  learnings.taskHistory = {
    domain: 'webdev',
    task: agentdb.request,
    outcome: phaseResults.status === 'completed' ? 'success' : 'failure',
    learnings: `Standards: ${standardsScore}, Design QA: ${designQAScore}`,
    files_modified: JSON.stringify(filesModified),
    created_at: new Date().toISOString()
  };

  // Log pipeline execution event
  learnings.events.push({
    type: 'pipeline_execution',
    domain: 'webdev',
    data: JSON.stringify({
      session_id: agentdb.session_id,
      phases_completed: Object.keys(phaseResults),
      gates_passed: phaseResults.gates_passed,
      gates_failed: phaseResults.gates_failed
    }),
    created_at: new Date().toISOString()
  });

  return learnings;
}
```

---

### Stage 3: Persistence (Write to vibe.db)

```typescript
async function saveToVibeDB(learnings: Learnings): Promise<void> {
  const db = openVibeDB();

  // Save decisions
  for (const decision of learnings.decisions) {
    await db.run(`
      INSERT INTO decisions (domain, decision, reasoning, context, created_at)
      VALUES (?, ?, ?, ?, ?)
    `, [decision.domain, decision.decision, decision.reasoning, decision.context, decision.created_at]);
  }

  // Save standards
  for (const standard of learnings.standards) {
    // Check if standard already exists (dedup)
    const existing = await db.get(`
      SELECT id FROM standards
      WHERE domain = ? AND rule = ?
    `, [standard.domain, standard.rule]);

    if (!existing) {
      await db.run(`
        INSERT INTO standards (domain, category, rule, rationale, examples, enforcement_level, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [standard.domain, standard.category, standard.rule, standard.rationale, standard.examples, standard.enforcement_level, standard.created_at]);

      console.log(`📚 Learned new standard: ${standard.rule}`);
    }
  }

  // Save task history
  if (learnings.taskHistory) {
    await db.run(`
      INSERT INTO task_history (domain, task, outcome, learnings, files_modified, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [learnings.taskHistory.domain, learnings.taskHistory.task, learnings.taskHistory.outcome, learnings.taskHistory.learnings, learnings.taskHistory.files_modified, learnings.taskHistory.created_at]);
  }

  // Save events
  for (const event of learnings.events) {
    await db.run(`
      INSERT INTO events (type, domain, data, created_at)
      VALUES (?, ?, ?, ?)
    `, [event.type, event.domain, event.data, event.created_at]);
  }

  db.close();
  console.log('✅ Learnings persisted to vibe.db');
}
```

---

### Stage 4: Future Use (vibe.db → ProjectContextServer → AgentDB)

```typescript
async function queryProjectContext(request: string): Promise<ContextBundle> {
  const vibeDB = openVibeDB();

  // Load learned standards
  const standards = await vibeDB.all(`
    SELECT * FROM standards
    WHERE domain = 'webdev'
    ORDER BY created_at DESC
  `);

  // Load past decisions
  const decisions = await vibeDB.all(`
    SELECT * FROM decisions
    WHERE domain = 'webdev'
    ORDER BY created_at DESC
    LIMIT 20
  `);

  // Find similar past tasks
  const similarTasks = await vibeDB.all(`
    SELECT * FROM task_history
    WHERE domain = 'webdev'
      AND task LIKE ?
    ORDER BY created_at DESC
    LIMIT 5
  `, [`%${extractKeywords(request)}%`]);

  vibeDB.close();

  // Build context bundle with learned knowledge
  const contextBundle: ContextBundle = {
    relevantFiles: await findRelevantFiles(request),
    projectState: await getProjectState(),
    pastDecisions: decisions,
    relatedStandards: standards,  // ← Learned standards auto-loaded
    similarTasks: similarTasks,
    designSystem: await loadDesignSystem()
  };

  return contextBundle;
}
```

**Result:** Future pipelines automatically benefit from past learnings

---

## Learning Patterns

### Pattern 1: Violation → Standard

**Pipeline 1:**
```typescript
// Implementation violates standards
<div style={{ padding: '16px' }}>

// Standards gate fails (score: 80)
// Violation logged to vibe.db
INSERT INTO standards (rule, rationale, enforcement_level)
VALUES ('no_inline_styles', 'Use design-dna tokens', 'automated');
```

**Pipeline 2 (future):**
```typescript
// ProjectContextServer loads standards from vibe.db
contextBundle.relatedStandards = [
  { rule: 'no_inline_styles', rationale: 'Use design-dna tokens', enforcement_level: 'automated' }
];

// Standards gate automatically enforces learned rule
// Violation caught before user sees it ✅
```

---

### Pattern 2: Success → Pattern

**Pipeline 1:**
```typescript
// Successful implementation
task: "Fix pricing card spacing"
outcome: "success"
learnings: "Standards: 100, Design QA: 95"
files_modified: ["src/components/PricingCard.tsx"]

// Saved to task_history
```

**Pipeline 2 (similar task):**
```typescript
// User requests: "Fix feature card spacing"

// ProjectContextServer finds similar task
similarTasks = [
  {
    task: "Fix pricing card spacing",
    outcome: "success",
    learnings: "Standards: 100, Design QA: 95",
    files_modified: ["src/components/PricingCard.tsx"]
  }
];

// Agent: "Similar task succeeded with these approaches..."
// Reuses successful pattern ✅
```

---

### Pattern 3: Decision → Reuse

**Pipeline 1:**
```typescript
// Architectural decision made
decision: "Use Edit tool not Write for component changes"
reasoning: "Preserves context, avoids component rewrites"

// Saved to decisions table
```

**Pipeline 2:**
```typescript
// ProjectContextServer loads decision
pastDecisions = [
  {
    decision: "Use Edit tool not Write",
    reasoning: "Preserves context, avoids component rewrites"
  }
];

// Agent automatically uses Edit tool (no repeat decision needed) ✅
```

---

## Self-Improvement Metrics

### Track Learning Effectiveness

```sql
-- How many standards learned over time?
SELECT
  DATE(created_at) as date,
  COUNT(*) as standards_learned
FROM standards
WHERE created_at > date('now', '-30 days')
GROUP BY DATE(created_at)
ORDER BY date;

-- Success rate over time (learning working?)
SELECT
  DATE(created_at) as date,
  SUM(CASE WHEN outcome = 'success' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as success_rate
FROM task_history
WHERE created_at > date('now', '-30 days')
GROUP BY DATE(created_at)
ORDER BY date;

-- Most enforced standards (high value learnings)
SELECT
  rule,
  COUNT(*) as enforcement_count
FROM events
WHERE type = 'standards_violation'
  AND created_at > date('now', '-30 days')
GROUP BY rule
ORDER BY enforcement_count DESC
LIMIT 10;
```

**Expected Trends:**
- Standards learned: Increasing initially, plateauing (finite set of violations)
- Success rate: Increasing over time (learning is working)
- Enforcement count: Decreasing over time (violations caught earlier)

---

## Hybrid System Benefits

### 1. Speed (AgentDB)

**Without AgentDB:**
```
Phase 1: Context query (10s)
Phase 2: Uses context
Phase 3: Analysis (120s)
Phase 4: Implementation (fails)
Retry Phase 4:
  - Re-query context (10s) ❌
  - Re-run analysis (120s) ❌
  - Retry implementation (60s)

Total: 320s
```

**With AgentDB:**
```
Phase 1: Context query (10s) → Cache
Phase 2: Load from cache (<1s)
Phase 3: Analysis (120s) → Cache
Phase 4: Implementation (fails)
Retry Phase 4:
  - Load context from cache (<1s) ✅
  - Load analysis from cache (<1s) ✅
  - Retry implementation (60s)

Total: 192s (40% faster)
```

---

### 2. Memory (vibe.db)

**Without vibe.db:**
```
Session 1: Violate inline_styles → Fixed manually
Session 2: Violate inline_styles again ❌
Session 3: Same violation ❌
User frustrated: "Why doesn't it remember?"
```

**With vibe.db:**
```
Session 1: Violate inline_styles → Logged to standards
Session 2: Standard auto-enforced → Caught before user sees ✅
Session 3: Standard auto-enforced → Zero violations ✅
User delighted: "It learned from last time!"
```

---

### 3. Self-Improvement

**Metric: Violations Over Time**

```
Week 1: 15 violations (no learned standards)
Week 2: 10 violations (5 standards learned)
Week 3: 6 violations (9 standards learned)
Week 4: 3 violations (12 standards learned)
Week 5: 1 violation (14 standards learned)

Trend: Decreasing violations = Learning working ✅
```

---

## Implementation Checklist

**Phase 1: Setup**
- [ ] AgentDB initialized at pipeline start
- [ ] vibe.db tables created (decisions, standards, task_history, events)
- [ ] ProjectContextServer loads from vibe.db

**Phase 2: During Pipeline**
- [ ] AgentDB used for caching expensive operations
- [ ] Phase outputs saved to AgentDB
- [ ] Standards from vibe.db enforced automatically

**Phase 3: After Pipeline**
- [ ] Learning extraction function implemented
- [ ] Violations → Standards conversion
- [ ] Success patterns logged to task_history
- [ ] Decisions recorded

**Phase 4: Cleanup**
- [ ] Learnings persisted to vibe.db
- [ ] AgentDB cleaned up (ephemeral)
- [ ] Artifacts saved to evidence if needed

**Phase 5: Verification**
- [ ] Future pipelines load from vibe.db
- [ ] Learned standards auto-enforced
- [ ] Success rate increasing over time

---

## Anti-Patterns to Avoid

### ❌ Don't: Use AgentDB for Persistent Memory

```typescript
// WRONG: Trying to persist AgentDB across sessions
const agentdb = loadAgentDB('persistent.json');  // ❌
// AgentDB is EPHEMERAL - use vibe.db for persistence
```

**Correct:**
```typescript
const learnings = extractLearnings(agentdb);
await saveToVibeDB(learnings);  // ✅
cleanupAgentDB(sessionId);      // ✅
```

---

### ❌ Don't: Query vibe.db During Pipeline Execution

```typescript
// WRONG: Querying vibe.db in every phase (slow)
async function runAnalysis() {
  const standards = await queryVibeDB('SELECT * FROM standards');  // ❌ Slow
}
```

**Correct:**
```typescript
// Query ONCE at context_query phase, cache in AgentDB
const contextBundle = await queryProjectContext(request);  // Loads from vibe.db
agentdb = cacheSet(agentdb, 'context_query:contextBundle', contextBundle, 'context_query');  // ✅

// Later phases use cached context
const contextBundle = cacheGet(agentdb, 'context_query:contextBundle');  // ✅ Fast
```

---

### ❌ Don't: Skip Learning Extraction

```typescript
// WRONG: Pipeline completes but doesn't save learnings
async function runPipeline(request: string) {
  const results = await executePipeline(request);
  cleanupAgentDB(sessionId);  // ❌ Lost all learnings!
  return results;
}
```

**Correct:**
```typescript
async function runPipeline(request: string) {
  const results = await executePipeline(request);
  const learnings = await extractLearnings(agentdb, results);  // ✅
  await saveToVibeDB(learnings);  // ✅
  cleanupAgentDB(sessionId);
  return results;
}
```

---

## Summary

**Hybrid Learning System:**
- **AgentDB:** Fast ephemeral cache for single pipeline execution
- **vibe.db:** Persistent institutional memory across all sessions
- **Learning Flow:** AgentDB (speed) → Extract learnings → vibe.db (memory) → Future pipelines (benefit)

**Benefits:**
1. **Speed:** Avoid re-computation through AgentDB caching
2. **Memory:** Learn from every pipeline execution
3. **Self-Improvement:** Success rate increases over time
4. **Automation:** Learned standards auto-enforced

**Key Principle:**
*Use AgentDB for speed during execution, extract to vibe.db for memory after completion, load from vibe.db for knowledge in future executions.*

---

_Hybrid Learning System: Fast execution today, smarter execution tomorrow._
