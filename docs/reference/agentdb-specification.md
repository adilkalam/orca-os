# AgentDB Specification

**Version:** 2.0.0
**Last Updated:** 2025-11-19

---

## Overview

AgentDB is an **ephemeral key-value storage system** used for performance optimization during pipeline execution. It caches expensive operation results to avoid re-computation when retrying phases or recovering from failures.

### AgentDB vs vibe.db

| Feature | AgentDB | vibe.db |
|---------|---------|---------|
| **Lifespan** | Pipeline execution (ephemeral) | Cross-session (persistent) |
| **Purpose** | Performance cache | Institutional memory |
| **Scope** | Single pipeline run | Entire project history |
| **Data** | Analysis results, intermediate outputs | Decisions, standards, task history |
| **Cleanup** | Cleared after pipeline completion | Never deleted |
| **Location** | `.claude/orchestration/temp/agentdb-${session_id}.json` | `.claude/project/vibe.db` |

**Key Principle:** AgentDB is for **speed**, vibe.db is for **memory**.

---

## Use Cases

### 1. Cache Expensive Analysis Results

**Problem:**
```
Phase 3: Analysis (2 minutes) → Results
Phase 4: Implementation (fails)
Retry Phase 4 → Needs analysis results
Re-run Phase 3 (another 2 minutes) ❌
```

**Solution with AgentDB:**
```
Phase 3: Analysis (2 minutes) → Save to AgentDB
Phase 4: Implementation (fails)
Retry Phase 4 → Load from AgentDB (instant) ✅
```

**Savings:** Avoid re-running 2-minute analysis

---

### 2. Share Data Between Agents in Same Pipeline

**Problem:**
```
Agent A (analyzer): Computes dependency map
Agent B (builder): Needs same dependency map
Agent C (reviewer): Needs same dependency map
Each agent re-computes → 3x work ❌
```

**Solution with AgentDB:**
```
Agent A: Compute once → Save to AgentDB
Agent B: Load from AgentDB
Agent C: Load from AgentDB
Computed 1x, used 3x ✅
```

---

### 3. Enable Pipeline Recovery

**Problem:**
```
Phase 1-5: Completed successfully
Phase 6: Fails due to external issue (network timeout)
No state saved → Start over from Phase 1 ❌
```

**Solution with AgentDB:**
```
Each phase: Save outputs to AgentDB
Phase 6 fails
Recovery: Load Phases 1-5 outputs from AgentDB
Resume from Phase 6 ✅
```

---

### 4. Avoid Re-running Context Queries

**Problem:**
```
Phase 1: ProjectContextServer query (10 seconds)
Phase 2: Uses context
Phase 3: Needs same context → Query again (10 seconds) ❌
```

**Solution with AgentDB:**
```
Phase 1: Query → Save contextBundle to AgentDB
Phase 3: Load contextBundle from AgentDB (instant) ✅
```

---

## Schema

### Root Structure

```typescript
interface AgentDB {
  version: string;
  session_id: string;
  domain: DomainType;
  created_at: string;
  updated_at: string;
  ttl_ms: number;  // Time to live

  cache: Record<string, CacheEntry>;
}

interface CacheEntry {
  key: string;
  value: any;
  created_at: string;
  created_by_phase: string;
  ttl_ms?: number;  // Optional entry-specific TTL
  metadata?: {
    computation_time_ms?: number;
    source_agent?: string;
    cache_hit_count?: number;
  };
}

type DomainType = 'webdev' | 'ios' | 'data' | 'seo' | 'brand';
```

---

### Key Naming Convention

**Format:** `{phase_name}:{data_type}:{identifier?}`

**Examples:**
```
context_query:contextBundle
analysis:dependencyMap
analysis:currentTokenUsage
implementation_pass_1:filesModified
standards_enforcement:violations
design_qa:visualIssues
```

**Benefits:**
- Clear which phase created the data
- Easy to invalidate all keys from a phase
- Self-documenting

---

## Operations

### 1. Initialize AgentDB

```typescript
function initializeAgentDB(session_id: string, domain: DomainType): AgentDB {
  return {
    version: '2.0.0',
    session_id,
    domain,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ttl_ms: 3600000,  // 1 hour default
    cache: {}
  };
}
```

**When:** At start of pipeline execution (before Phase 1)

**File Location:** `.claude/orchestration/temp/agentdb-${session_id}.json`

---

### 2. Write to Cache

```typescript
function cacheSet(
  agentdb: AgentDB,
  key: string,
  value: any,
  phase: string,
  options?: {
    ttl_ms?: number;
    metadata?: CacheEntry['metadata'];
  }
): AgentDB {
  const entry: CacheEntry = {
    key,
    value,
    created_at: new Date().toISOString(),
    created_by_phase: phase,
    ttl_ms: options?.ttl_ms,
    metadata: options?.metadata
  };

  return {
    ...agentdb,
    cache: {
      ...agentdb.cache,
      [key]: entry
    },
    updated_at: new Date().toISOString()
  };
}
```

**Example:**
```typescript
// After expensive analysis
const agentdb = cacheSet(
  currentAgentDB,
  'analysis:dependencyMap',
  dependencyMapResult,
  'analysis',
  {
    metadata: {
      computation_time_ms: 120000,
      source_agent: 'frontend-layout-analyzer'
    }
  }
);
```

---

### 3. Read from Cache

```typescript
function cacheGet<T>(
  agentdb: AgentDB,
  key: string
): T | null {
  const entry = agentdb.cache[key];

  if (!entry) {
    return null;
  }

  // Check TTL
  if (entry.ttl_ms) {
    const age = Date.now() - new Date(entry.created_at).getTime();
    if (age > entry.ttl_ms) {
      return null;  // Expired
    }
  }

  // Update hit count
  if (entry.metadata) {
    entry.metadata.cache_hit_count = (entry.metadata.cache_hit_count || 0) + 1;
  }

  return entry.value as T;
}
```

**Example:**
```typescript
// Avoid re-running analysis
const cachedDependencyMap = cacheGet<DependencyMap>(
  agentdb,
  'analysis:dependencyMap'
);

if (cachedDependencyMap) {
  console.log('✅ Using cached dependency map');
  dependencyMap = cachedDependencyMap;
} else {
  console.log('⏳ Computing dependency map...');
  dependencyMap = await runAnalysis();
  agentdb = cacheSet(agentdb, 'analysis:dependencyMap', dependencyMap, 'analysis');
}
```

---

### 4. Invalidate Cache

```typescript
// Invalidate specific key
function cacheDelete(agentdb: AgentDB, key: string): AgentDB {
  const { [key]: _, ...remainingCache } = agentdb.cache;
  return {
    ...agentdb,
    cache: remainingCache,
    updated_at: new Date().toISOString()
  };
}

// Invalidate all keys from a phase
function cacheInvalidatePhase(agentdb: AgentDB, phase: string): AgentDB {
  const filteredCache = Object.fromEntries(
    Object.entries(agentdb.cache).filter(
      ([_, entry]) => entry.created_by_phase !== phase
    )
  );

  return {
    ...agentdb,
    cache: filteredCache,
    updated_at: new Date().toISOString()
  };
}

// Clear entire cache
function cacheClear(agentdb: AgentDB): AgentDB {
  return {
    ...agentdb,
    cache: {},
    updated_at: new Date().toISOString()
  };
}
```

---

### 5. Cleanup After Pipeline

```typescript
function cleanupAgentDB(session_id: string): void {
  const filePath = `.claude/orchestration/temp/agentdb-${session_id}.json`;

  // Delete ephemeral cache file
  fs.unlinkSync(filePath);

  console.log(`🗑️ AgentDB cleaned up for session ${session_id}`);
}
```

**When:** After pipeline completion (success or failure)

**Why:** AgentDB is ephemeral - no need to keep after pipeline finishes

---

## Integration with Pipeline Phases

### Phase 1: Context Query

```typescript
// Phase: context_query
const contextBundle = await queryProjectContext({
  domain: 'webdev',
  task: request
});

// Cache for later phases
agentdb = cacheSet(
  agentdb,
  'context_query:contextBundle',
  contextBundle,
  'context_query',
  {
    metadata: {
      computation_time_ms: 7000,
      source_agent: 'ProjectContextServer'
    }
  }
);
```

---

### Phase 3: Analysis

```typescript
// Phase: analysis
// Check cache first
let analysisResults = cacheGet(agentdb, 'analysis:results');

if (!analysisResults) {
  // Run expensive analysis
  const startTime = Date.now();
  analysisResults = await runFrontendAnalysis(contextBundle);
  const computationTime = Date.now() - startTime;

  // Cache results
  agentdb = cacheSet(
    agentdb,
    'analysis:results',
    analysisResults,
    'analysis',
    {
      metadata: {
        computation_time_ms: computationTime,
        source_agent: 'frontend-layout-analyzer'
      }
    }
  );

  console.log(`⏳ Analysis computed in ${computationTime}ms`);
} else {
  console.log('✅ Using cached analysis results');
}
```

---

### Phase 4: Implementation Pass 1

```typescript
// Phase: implementation_pass_1
// Load cached analysis instead of re-running
const contextBundle = cacheGet(agentdb, 'context_query:contextBundle');
const analysisResults = cacheGet(agentdb, 'analysis:results');

if (!contextBundle || !analysisResults) {
  throw new Error('Required cached data missing');
}

// Run implementation
const implementationResults = await runImplementation({
  contextBundle,
  analysisResults
});

// Cache implementation results
agentdb = cacheSet(
  agentdb,
  'implementation_pass_1:results',
  implementationResults,
  'implementation_pass_1'
);
```

---

### Recovery from Failed Phase

```typescript
// Phase 6 failed, need to retry
// Load all previous phase outputs from cache
const contextBundle = cacheGet(agentdb, 'context_query:contextBundle');
const planningOutput = cacheGet(agentdb, 'planning:output');
const analysisResults = cacheGet(agentdb, 'analysis:results');
const implementationResults = cacheGet(agentdb, 'implementation_pass_1:results');
const standardsResults = cacheGet(agentdb, 'standards_enforcement:results');

// All previous work preserved → Resume from Phase 6
if (contextBundle && planningOutput && analysisResults && implementationResults && standardsResults) {
  console.log('✅ Recovered previous phase outputs from AgentDB');
  await retryPhase6(contextBundle, planningOutput, analysisResults, implementationResults, standardsResults);
} else {
  console.log('❌ Cache incomplete, must restart pipeline');
}
```

---

## Cache Invalidation Strategy

### When to Invalidate

1. **Phase Re-runs:** Invalidate that phase's keys before re-running
2. **Upstream Changes:** If Phase 2 re-runs, invalidate Phases 3-9 keys
3. **User Modifies Files:** Invalidate analysis/context keys
4. **Design System Updates:** Invalidate design-related keys

### Example: Corrective Pass Invalidation

```typescript
// implementation_pass_2 triggered (corrective pass)
// Previous implementation_pass_1 results are now stale

// Invalidate implementation_pass_1 results
agentdb = cacheDelete(agentdb, 'implementation_pass_1:results');
agentdb = cacheDelete(agentdb, 'implementation_pass_1:filesModified');

// Run fresh implementation_pass_2
const pass2Results = await runImplementationPass2();

// Cache new results
agentdb = cacheSet(
  agentdb,
  'implementation_pass_2:results',
  pass2Results,
  'implementation_pass_2'
);
```

---

## Performance Metrics

### Track Cache Effectiveness

```typescript
function getCacheStats(agentdb: AgentDB): CacheStats {
  const entries = Object.values(agentdb.cache);

  return {
    total_entries: entries.length,
    total_hits: entries.reduce(
      (sum, e) => sum + (e.metadata?.cache_hit_count || 0),
      0
    ),
    total_saved_time_ms: entries.reduce(
      (sum, e) => sum + (e.metadata?.computation_time_ms || 0),
      0
    ),
    avg_entry_age_ms: entries.reduce(
      (sum, e) => sum + (Date.now() - new Date(e.created_at).getTime()),
      0
    ) / entries.length
  };
}
```

**Example Output:**
```json
{
  "total_entries": 7,
  "total_hits": 15,
  "total_saved_time_ms": 450000,
  "avg_entry_age_ms": 180000
}
```

**Interpretation:**
- 15 cache hits avoided 450 seconds (7.5 minutes) of re-computation
- Average cache entry is 3 minutes old
- Cache is actively being reused

---

## File Structure

```
.claude/orchestration/temp/
├── agentdb-a1b2c3d4.json         ← Active pipeline session
├── agentdb-e5f6g7h8.json         ← Another active session
└── [cleaned up after completion]
```

**Cleanup Policy:**
- Delete after successful pipeline completion
- Delete after failed pipeline (save to evidence if needed for debugging)
- Delete files older than 1 hour (stale sessions)

---

## Best Practices

### 1. Always Check Cache First

```typescript
// ❌ Bad: Always compute
const results = await expensiveOperation();

// ✅ Good: Check cache first
let results = cacheGet(agentdb, 'phase:results');
if (!results) {
  results = await expensiveOperation();
  agentdb = cacheSet(agentdb, 'phase:results', results, 'phase');
}
```

---

### 2. Use Descriptive Keys

```typescript
// ❌ Bad: Unclear keys
cacheSet(agentdb, 'data', results, 'analysis');
cacheSet(agentdb, 'output', files, 'impl');

// ✅ Good: Self-documenting keys
cacheSet(agentdb, 'analysis:dependencyMap', dependencyMap, 'analysis');
cacheSet(agentdb, 'implementation_pass_1:filesModified', files, 'implementation_pass_1');
```

---

### 3. Track Computation Time

```typescript
// ✅ Good: Track time saved by caching
const startTime = Date.now();
const results = await expensiveOperation();
const computationTime = Date.now() - startTime;

agentdb = cacheSet(
  agentdb,
  'phase:results',
  results,
  'phase',
  {
    metadata: {
      computation_time_ms: computationTime
    }
  }
);

console.log(`⏳ Computed in ${computationTime}ms (cached for future use)`);
```

---

### 4. Invalidate Stale Data

```typescript
// If user manually edits files, invalidate analysis
if (userEditedFiles) {
  agentdb = cacheInvalidatePhase(agentdb, 'analysis');
  console.log('🔄 Analysis cache invalidated due to file changes');
}
```

---

## Example: Full Pipeline with AgentDB

```typescript
async function runWebdevPipeline(request: string) {
  // Initialize AgentDB
  const sessionId = generateSessionId();
  let agentdb = initializeAgentDB(sessionId, 'webdev');

  try {
    // Phase 1: Context Query
    let contextBundle = cacheGet(agentdb, 'context_query:contextBundle');
    if (!contextBundle) {
      contextBundle = await queryContext(request);
      agentdb = cacheSet(agentdb, 'context_query:contextBundle', contextBundle, 'context_query');
    }

    // Phase 2: Planning
    const planningOutput = await runPlanning(request, contextBundle);
    agentdb = cacheSet(agentdb, 'planning:output', planningOutput, 'planning');

    // Phase 3: Analysis
    let analysisResults = cacheGet(agentdb, 'analysis:results');
    if (!analysisResults) {
      analysisResults = await runAnalysis(contextBundle);
      agentdb = cacheSet(agentdb, 'analysis:results', analysisResults, 'analysis');
    }

    // Phase 4: Implementation
    const implResults = await runImplementation(analysisResults);
    agentdb = cacheSet(agentdb, 'implementation_pass_1:results', implResults, 'implementation_pass_1');

    // Phase 5-9: Continue...

    // Success: Cleanup AgentDB
    cleanupAgentDB(sessionId);

  } catch (error) {
    // Save AgentDB to evidence for debugging
    const evidencePath = `.claude/orchestration/evidence/agentdb-${sessionId}-failed.json`;
    fs.writeFileSync(evidencePath, JSON.stringify(agentdb, null, 2));
    console.log(`💾 AgentDB saved to ${evidencePath} for debugging`);

    throw error;
  }
}
```

---

## Summary

**AgentDB Purpose:**
- Performance optimization through caching
- Avoid re-computing expensive operations
- Enable pipeline recovery from failures
- Share data between agents in same pipeline

**Key Characteristics:**
- Ephemeral (deleted after pipeline completion)
- Session-scoped (one AgentDB per pipeline run)
- Key-value storage (simple, fast)
- TTL support (auto-expiration)

**When to Use:**
- Analysis results (dependency maps, schema analysis)
- Context bundles (expensive ProjectContextServer queries)
- Intermediate phase outputs (for recovery)
- Expensive computations (>10 seconds)

**When NOT to Use:**
- Persistent data (use vibe.db instead)
- Cross-session knowledge (use vibe.db instead)
- Small, fast operations (<1 second)

---

_AgentDB: Speed up pipelines through intelligent caching._
