# AgentDB Integration Examples

**Version:** 2.0.0
**Last Updated:** 2025-11-19

---

## Overview

This document provides **practical examples** of integrating AgentDB into domain pipelines and agents for performance optimization through intelligent caching.

---

## Example 1: Webdev Pipeline Integration

### Scenario: Avoid Re-running Expensive Analysis

**Problem:** Frontend analysis takes 2 minutes. If implementation fails and we retry, we don't want to re-analyze.

**Solution:**

```typescript
// Agent: frontend-layout-analyzer
// Phase: analysis

async function runFrontendAnalysis(
  contextBundle: ContextBundle,
  agentdb: AgentDB
): Promise<{ analysisResults: AnalysisResults; agentdb: AgentDB }> {

  // Check cache first
  const cacheKey = 'analysis:full_results';
  let analysisResults = cacheGet<AnalysisResults>(agentdb, cacheKey);

  if (analysisResults) {
    const metadata = agentdb.cache[cacheKey].metadata;
    console.log(`✅ Using cached analysis (saved ${metadata?.computation_time_ms}ms)`);
    return { analysisResults, agentdb };
  }

  // Cache miss - run analysis
  console.log('⏳ Running frontend analysis...');
  const startTime = Date.now();

  // Expensive operations
  const dependencyMap = await analyzeDependencies(contextBundle.relevantFiles);
  const tokenUsage = await analyzeDesignTokens(contextBundle.relevantFiles);
  const safeChanges = await generateRecommendations(dependencyMap, tokenUsage);

  analysisResults = {
    dependencyMap,
    currentTokenUsage: tokenUsage,
    safeChangeRecommendations: safeChanges
  };

  const computationTime = Date.now() - startTime;

  // Cache results for future use
  agentdb = cacheSet(
    agentdb,
    cacheKey,
    analysisResults,
    'analysis',
    {
      metadata: {
        computation_time_ms: computationTime,
        source_agent: 'frontend-layout-analyzer',
        cache_hit_count: 0
      }
    }
  );

  console.log(`✅ Analysis complete in ${computationTime}ms (cached for retry/recovery)`);

  return { analysisResults, agentdb };
}
```

**Benefits:**
- First run: 120 seconds
- Retry/recovery: <1 second (cache hit)
- Savings: 119 seconds per retry

---

## Example 2: Sharing Context Between Agents

### Scenario: Multiple Agents Need Same ContextBundle

**Problem:**
- Analysis agent needs context
- Builder agent needs context
- Reviewer agent needs context
- Each querying ProjectContextServer = 3x redundant work

**Solution:**

```typescript
// Phase: context_query (run once)
async function loadProjectContext(
  request: string,
  agentdb: AgentDB
): Promise<{ contextBundle: ContextBundle; agentdb: AgentDB }> {

  const cacheKey = 'context_query:contextBundle';
  let contextBundle = cacheGet<ContextBundle>(agentdb, cacheKey);

  if (contextBundle) {
    console.log('✅ Using cached context bundle');
    return { contextBundle, agentdb };
  }

  // Query ProjectContextServer
  console.log('⏳ Querying ProjectContextServer...');
  const startTime = Date.now();

  contextBundle = await queryProjectContext({
    domain: 'webdev',
    task: request,
    projectPath: process.cwd(),
    maxFiles: 10
  });

  const queryTime = Date.now() - startTime;

  // Cache for all subsequent agents
  agentdb = cacheSet(
    agentdb,
    cacheKey,
    contextBundle,
    'context_query',
    {
      metadata: {
        computation_time_ms: queryTime,
        source_agent: 'ProjectContextServer'
      }
    }
  );

  console.log(`✅ Context loaded in ${queryTime}ms (cached for all agents)`);

  return { contextBundle, agentdb };
}

// Phase: analysis (reuse cached context)
async function runAnalysis(agentdb: AgentDB) {
  const contextBundle = cacheGet<ContextBundle>(agentdb, 'context_query:contextBundle');

  if (!contextBundle) {
    throw new Error('Context bundle not cached - context_query phase must run first');
  }

  console.log('✅ Loaded context from cache (no re-query)');
  // Use contextBundle...
}

// Phase: implementation (reuse cached context)
async function runImplementation(agentdb: AgentDB) {
  const contextBundle = cacheGet<ContextBundle>(agentdb, 'context_query:contextBundle');
  const analysisResults = cacheGet<AnalysisResults>(agentdb, 'analysis:full_results');

  if (!contextBundle || !analysisResults) {
    throw new Error('Required cached data missing');
  }

  console.log('✅ Loaded context + analysis from cache');
  // Use both...
}
```

**Benefits:**
- Context queried: 1x (10 seconds)
- Used by: 3+ agents
- Savings: 20+ seconds (avoided 2 redundant queries)

---

## Example 3: Pipeline Recovery

### Scenario: Phase 6 Fails, Resume Without Starting Over

**Problem:**
```
Phase 1-5: Completed (total 8 minutes)
Phase 6: Fails due to external issue
Without cache: Restart from Phase 1 (another 8 minutes) ❌
```

**Solution:**

```typescript
// Pipeline orchestrator with recovery support

async function runPipelineWithRecovery(
  request: string,
  sessionId: string
): Promise<PipelineResult> {

  // Try to load existing AgentDB (recovery scenario)
  let agentdb = loadAgentDB(sessionId);

  if (!agentdb) {
    // Fresh start
    agentdb = initializeAgentDB(sessionId, 'webdev');
    console.log('🚀 Starting fresh pipeline');
  } else {
    console.log('🔄 Resuming from previous run (AgentDB found)');
  }

  try {
    // Phase 1: Context Query
    let phase1Complete = cacheGet(agentdb, 'context_query:completed');
    if (!phase1Complete) {
      const { contextBundle, agentdb: updatedDB } = await runPhase1(request, agentdb);
      agentdb = updatedDB;
      agentdb = cacheSet(agentdb, 'context_query:completed', true, 'context_query');
      saveAgentDB(sessionId, agentdb);  // Persist for recovery
    } else {
      console.log('✅ Phase 1 already completed (skipping)');
    }

    // Phase 2: Planning
    let phase2Complete = cacheGet(agentdb, 'planning:completed');
    if (!phase2Complete) {
      const { planningOutput, agentdb: updatedDB } = await runPhase2(agentdb);
      agentdb = updatedDB;
      agentdb = cacheSet(agentdb, 'planning:completed', true, 'planning');
      saveAgentDB(sessionId, agentdb);
    } else {
      console.log('✅ Phase 2 already completed (skipping)');
    }

    // Phase 3: Analysis
    let phase3Complete = cacheGet(agentdb, 'analysis:completed');
    if (!phase3Complete) {
      const { analysisResults, agentdb: updatedDB } = await runPhase3(agentdb);
      agentdb = updatedDB;
      agentdb = cacheSet(agentdb, 'analysis:completed', true, 'analysis');
      saveAgentDB(sessionId, agentdb);
    } else {
      console.log('✅ Phase 3 already completed (skipping)');
    }

    // Continue for all phases...

    // Success: Cleanup
    cleanupAgentDB(sessionId);
    return { status: 'success' };

  } catch (error) {
    // Save AgentDB for recovery
    saveAgentDB(sessionId, agentdb);
    console.log(`💾 AgentDB saved for recovery (session: ${sessionId})`);

    throw error;
  }
}

function loadAgentDB(sessionId: string): AgentDB | null {
  const filePath = `.claude/orchestration/temp/agentdb-${sessionId}.json`;

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function saveAgentDB(sessionId: string, agentdb: AgentDB): void {
  const filePath = `.claude/orchestration/temp/agentdb-${sessionId}.json`;
  fs.writeFileSync(filePath, JSON.stringify(agentdb, null, 2));
}
```

**Benefits:**
- First run fails at Phase 6: Phases 1-5 cached (8 minutes saved)
- Retry: Skip Phases 1-5, resume at Phase 6 (instant recovery)
- Total time: 8 minutes (first) + <1 minute (retry) = ~9 minutes
- Without cache: 8 minutes + 8 minutes = 16 minutes
- **Savings: 7 minutes (44% faster)**

---

## Example 4: iOS Analysis Cache

### Scenario: Swift Dependency Analysis is Expensive

```typescript
// Agent: ios-analyzer
// Phase: analysis

async function runSwiftAnalysis(
  contextBundle: ContextBundle,
  agentdb: AgentDB
): Promise<{ analysisResults: SwiftAnalysisResults; agentdb: AgentDB }> {

  const cacheKey = 'analysis:swift_dependencies';
  let dependencyMap = cacheGet<DependencyMap>(agentdb, cacheKey);

  if (dependencyMap) {
    console.log('✅ Using cached Swift dependency map');
    return {
      analysisResults: {
        dependencyMap,
        retainCycleRisks: cacheGet(agentdb, 'analysis:retain_cycle_risks')!,
        architectureCompliance: cacheGet(agentdb, 'analysis:architecture_compliance')!
      },
      agentdb
    };
  }

  // Run expensive Swift analysis
  console.log('⏳ Analyzing Swift dependencies...');
  const startTime = Date.now();

  const swiftFiles = contextBundle.relevantFiles.filter(f => f.endsWith('.swift'));

  // Parse Swift files, extract imports, analyze class relationships
  dependencyMap = await analyzeSwiftDependencies(swiftFiles);
  const retainCycleRisks = await detectRetainCycleRisks(dependencyMap);
  const architectureCompliance = await checkArchitecturePatterns(dependencyMap);

  const computationTime = Date.now() - startTime;

  // Cache all results
  agentdb = cacheSet(agentdb, 'analysis:swift_dependencies', dependencyMap, 'analysis', {
    metadata: { computation_time_ms: computationTime }
  });
  agentdb = cacheSet(agentdb, 'analysis:retain_cycle_risks', retainCycleRisks, 'analysis');
  agentdb = cacheSet(agentdb, 'analysis:architecture_compliance', architectureCompliance, 'analysis');

  console.log(`✅ Swift analysis complete in ${computationTime}ms`);

  return {
    analysisResults: { dependencyMap, retainCycleRisks, architectureCompliance },
    agentdb
  };
}
```

---

## Example 5: Data Pipeline Schema Cache

### Scenario: Database Schema Introspection is Slow

```typescript
// Agent: data-analyzer
// Phase: analysis

async function analyzeDataSchemas(
  contextBundle: ContextBundle,
  agentdb: AgentDB
): Promise<{ schemaAnalysis: SchemaAnalysis; agentdb: AgentDB }> {

  const cacheKey = 'analysis:schema_introspection';
  let schemaAnalysis = cacheGet<SchemaAnalysis>(agentdb, cacheKey);

  if (schemaAnalysis) {
    console.log('✅ Using cached schema analysis');
    return { schemaAnalysis, agentdb };
  }

  // Run expensive database introspection
  console.log('⏳ Introspecting database schemas...');
  const startTime = Date.now();

  // Query database for schema information
  const tables = await db.introspect.getTables();
  const relationships = await db.introspect.getRelationships();
  const indexes = await db.introspect.getIndexes();
  const constraints = await db.introspect.getConstraints();

  schemaAnalysis = {
    tables,
    relationships,
    indexes,
    constraints,
    analyzedAt: new Date().toISOString()
  };

  const computationTime = Date.now() - startTime;

  // Cache for retries and subsequent phases
  agentdb = cacheSet(
    agentdb,
    cacheKey,
    schemaAnalysis,
    'analysis',
    {
      ttl_ms: 1800000,  // 30 minutes (schema changes are rare)
      metadata: {
        computation_time_ms: computationTime,
        source_agent: 'data-analyzer'
      }
    }
  );

  console.log(`✅ Schema introspection complete in ${computationTime}ms`);

  return { schemaAnalysis, agentdb };
}
```

---

## Example 6: Invalidation on User Changes

### Scenario: User Manually Edits Files During Pipeline

```typescript
// Detect file changes and invalidate stale cache

async function handleFileChange(
  filePath: string,
  agentdb: AgentDB
): Promise<AgentDB> {

  console.log(`🔄 File changed: ${filePath}`);

  // Invalidate analysis results (now stale)
  agentdb = cacheInvalidatePhase(agentdb, 'analysis');
  console.log('🗑️ Analysis cache invalidated due to file change');

  // If design system changed, invalidate design-related cache
  if (filePath.includes('design-dna.json')) {
    agentdb = cacheDelete(agentdb, 'context_query:designSystem');
    console.log('🗑️ Design system cache invalidated');
  }

  // Save updated AgentDB
  saveAgentDB(agentdb.session_id, agentdb);

  return agentdb;
}
```

---

## Example 7: Performance Metrics Tracking

### Scenario: Measure Cache Effectiveness

```typescript
// Track how much time AgentDB saves

function reportCachePerformance(agentdb: AgentDB): void {
  const stats = getCacheStats(agentdb);

  const report = `
📊 AgentDB Performance Report

Cache Entries: ${stats.total_entries}
Cache Hits: ${stats.total_hits}
Time Saved: ${(stats.total_saved_time_ms / 1000).toFixed(1)}s
Avg Entry Age: ${(stats.avg_entry_age_ms / 1000).toFixed(1)}s

Cache Efficiency:
${generateCacheEfficiencyChart(agentdb)}

Top Cached Operations:
${getTopCachedOperations(agentdb)}
  `.trim();

  console.log(report);

  // Save to evidence
  const evidencePath = `.claude/orchestration/evidence/cache-performance-${agentdb.session_id}.md`;
  fs.writeFileSync(evidencePath, report);
}

function getTopCachedOperations(agentdb: AgentDB): string {
  const entries = Object.values(agentdb.cache)
    .sort((a, b) => {
      const aHits = a.metadata?.cache_hit_count || 0;
      const bHits = b.metadata?.cache_hit_count || 0;
      return bHits - aHits;
    })
    .slice(0, 5);

  return entries.map((entry, i) => {
    const hits = entry.metadata?.cache_hit_count || 0;
    const savedTime = (entry.metadata?.computation_time_ms || 0) * hits / 1000;
    return `${i + 1}. ${entry.key}: ${hits} hits (saved ${savedTime.toFixed(1)}s)`;
  }).join('\n');
}
```

**Example Output:**
```
📊 AgentDB Performance Report

Cache Entries: 8
Cache Hits: 23
Time Saved: 342.5s
Avg Entry Age: 145.2s

Top Cached Operations:
1. analysis:full_results: 12 hits (saved 144.0s)
2. context_query:contextBundle: 8 hits (saved 80.0s)
3. analysis:swift_dependencies: 3 hits (saved 72.0s)
```

---

## Example 8: Conditional Caching Based on Complexity

### Scenario: Only Cache Expensive Operations

```typescript
// Only cache if operation is expensive enough to justify overhead

async function runAnalysisWithSmartCaching(
  contextBundle: ContextBundle,
  agentdb: AgentDB,
  complexity: 'simple' | 'medium' | 'complex'
): Promise<{ analysisResults: any; agentdb: AgentDB }> {

  const cacheKey = 'analysis:results';

  // Only use cache for medium/complex tasks
  if (complexity === 'medium' || complexity === 'complex') {
    const cached = cacheGet(agentdb, cacheKey);
    if (cached) {
      console.log('✅ Using cached analysis (complex task)');
      return { analysisResults: cached, agentdb };
    }
  } else {
    console.log('⚡ Running analysis without cache (simple task, faster to recompute)');
  }

  // Run analysis
  const startTime = Date.now();
  const analysisResults = await performAnalysis(contextBundle, complexity);
  const computationTime = Date.now() - startTime;

  // Only cache if took >5 seconds
  if (computationTime > 5000) {
    agentdb = cacheSet(agentdb, cacheKey, analysisResults, 'analysis', {
      metadata: { computation_time_ms: computationTime }
    });
    console.log(`✅ Analysis cached (took ${computationTime}ms)`);
  } else {
    console.log(`⚡ Analysis not cached (only ${computationTime}ms, faster to recompute)`);
  }

  return { analysisResults, agentdb };
}
```

---

## Example 9: Multi-Level Cache

### Scenario: Cache Both Raw Data and Processed Results

```typescript
// Cache at multiple levels for flexibility

async function analyzeWithMultiLevelCache(
  contextBundle: ContextBundle,
  agentdb: AgentDB
): Promise<{ results: ProcessedResults; agentdb: AgentDB }> {

  // Level 1: Check for processed results (fastest)
  let processed = cacheGet<ProcessedResults>(agentdb, 'analysis:processed_results');
  if (processed) {
    console.log('✅ Cache hit: processed results');
    return { results: processed, agentdb };
  }

  // Level 2: Check for raw analysis (partial hit - can reprocess)
  let rawAnalysis = cacheGet<RawAnalysis>(agentdb, 'analysis:raw_data');
  if (rawAnalysis) {
    console.log('⚡ Cache hit: raw data (reprocessing...)');
    processed = processAnalysisData(rawAnalysis);
    agentdb = cacheSet(agentdb, 'analysis:processed_results', processed, 'analysis');
    return { results: processed, agentdb };
  }

  // Cache miss: Run full analysis
  console.log('⏳ Cache miss: running full analysis');
  const startTime = Date.now();

  rawAnalysis = await performRawAnalysis(contextBundle);
  processed = processAnalysisData(rawAnalysis);

  const computationTime = Date.now() - startTime;

  // Cache both levels
  agentdb = cacheSet(agentdb, 'analysis:raw_data', rawAnalysis, 'analysis', {
    metadata: { computation_time_ms: computationTime }
  });
  agentdb = cacheSet(agentdb, 'analysis:processed_results', processed, 'analysis');

  console.log(`✅ Full analysis complete in ${computationTime}ms (both levels cached)`);

  return { results: processed, agentdb };
}
```

---

## Integration Checklist

When integrating AgentDB into a pipeline phase:

- [ ] **Check cache first** before expensive operations
- [ ] **Track computation time** for cache effectiveness metrics
- [ ] **Use descriptive cache keys** (`phase:data_type` format)
- [ ] **Cache results** with metadata (source agent, computation time)
- [ ] **Invalidate stale data** when inputs change
- [ ] **Save AgentDB** after each phase for recovery
- [ ] **Cleanup AgentDB** after pipeline completion
- [ ] **Report cache stats** for performance visibility
- [ ] **Conditional caching** (only cache if operation >5 seconds)
- [ ] **Handle cache misses** gracefully

---

## Summary

**AgentDB Integration Benefits:**
1. **Performance:** Avoid re-running expensive operations (seconds → milliseconds)
2. **Recovery:** Resume failed pipelines from last successful phase
3. **Sharing:** One expensive query, multiple agents use it
4. **Visibility:** Track time saved through cache metrics

**Best Practices:**
1. Always check cache before computing
2. Cache with descriptive keys
3. Track computation time
4. Invalidate when stale
5. Only cache expensive operations (>5 seconds)

**Anti-Patterns:**
- ❌ Caching trivial operations (<1 second)
- ❌ Never invalidating stale cache
- ❌ Using unclear cache keys
- ❌ Not tracking cache effectiveness

---

_AgentDB: Make pipelines fast through intelligent caching._
