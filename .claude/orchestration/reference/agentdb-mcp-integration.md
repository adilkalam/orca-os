# AgentDB MCP Integration (Future Enhancement)

**Date**: 2025-11-19
**Status**: Documented for future implementation
**Priority**: Medium (after specialist enforcement is proven)

## What is AgentDB?

AgentDB v1.6.1 is a sub-millisecond memory engine with:
- **150x faster vector search** (HNSW indexing)
- **29 MCP tools** for zero-code integration
- **Reflexion memory**, skill library, causal reasoning
- **Universal runtime** (Node.js, browser, edge, MCP)

## Why AgentDB?

**Performance**:
- 96x-164x faster than brute force search
- 4-32x memory reduction (quantization)
- Instant startup (milliseconds)

**Current ProjectContextServer**:
- Uses keyword-based semantic search
- Indexes symbols, summaries, file metadata
- Works but lacks true semantic understanding

## Integration Approach

### Option 1: MCP Tools (Recommended)
Add AgentDB as MCP server to ~/.claude.json:

```json
{
  "mcpServers": {
    "agentdb": {
      "command": "npx",
      "args": ["-y", "agentdb"],
      "env": {
        "AGENTDB_PATH": "/path/to/.agentdb/memory.db"
      }
    }
  }
}
```

**Available Tools** (29 total):
- **Vector DB**: `agentdb_init`, `agentdb_insert`, `agentdb_search`, `agentdb_delete`
- **Core**: `agentdb_stats`, `agentdb_pattern_store`, `agentdb_pattern_search`
- **Learning**: `learning_start_session`, `learning_train`, `learning_metrics`

### Option 2: Hybrid Mode
Use both ProjectContextServer (historical context) + AgentDB (vector search):
- ProjectContextServer: decisions, standards, task history
- AgentDB: semantic file similarity, pattern matching

## When to Implement

**After**:
1. ✅ Context Proof System proven effective
2. ✅ Blueprint Gates prevent generic code
3. ✅ Pattern Violations catch bad design

**Trigger**: Need faster semantic search across large codebases (1000+ files)

## References
- Package: `agentdb@1.6.1`
- Docs: https://www.npmjs.com/package/agentdb
- Analysis: `.claude/orchestration/temp/claude-flow-analysis.md`
