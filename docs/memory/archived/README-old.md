# Vibe Memory CLI Reference

Command-line tools for interacting with the per-project memory system (`.claude/memory/vibe.db`).

**Prerequisites:**
- SQLite 3.x installed
- Python 3.9+ with `sqlite3` module
- Optional: `sentence-transformers` for vector embeddings

**Quick Start:**

```bash
# 1. Index your project (creates vibe.db if needed)
python3 scripts/memory-index.py --update-changed

# 2. Embed for vector search (optional but recommended)
python3 scripts/memory-embed.py

# 3. Search for code patterns
python3 scripts/memory-search.py "routing pattern" --mode code --k 10

# 4. Search for past decisions
python3 scripts/memory-search.py "expo decisions" --mode events

# 5. Log a new decision
python3 scripts/memory-log-event.py \
  --kind decision \
  --title "Use Zustand for global state" \
  --detail '{"scope":"frontend","rationale":"simpler than Redux"}'
```

---

## Commands

### 1. `memory-index.py` — Index Code & Docs

**Purpose:** Scan project files and populate `chunks` + `chunks_fts` tables in `vibe.db`.

**Usage:**

```bash
# Index only changed files (fast, incremental)
python3 scripts/memory-index.py --update-changed

# Full reindex (slow, use after schema changes)
python3 scripts/memory-index.py --index-all

# Specify custom DB path
python3 scripts/memory-index.py --db-path /path/to/vibe.db
```

**What it indexes:**
- Source code: `src/**/*`, `app/**/*`, `components/**/*`
- Documentation: `docs/**/*`, `README.md`, `CLAUDE.md`
- Configuration: `agents/**/*`, `commands/**/*`, `scripts/**/*`
- Build outputs: `out/**/*`, `dist/**/*` (if present)

**Chunking strategy:**
- Code files: Split by function/class (50-500 lines per chunk)
- Markdown files: Split by section (based on headers)
- Config files: Entire file as one chunk

**Output:**

```
Indexing project...
Found 142 files to index
Indexed 87 chunks (23 code, 45 docs, 19 config)
Updated chunks_fts index
Duration: 2.3s
```

**Run frequency:**
- After major file changes (10+ files modified)
- After adding new directories to the project
- Before starting a new session (to ensure fresh index)

---

### 2. `memory-embed.py` — Generate Vector Embeddings

**Purpose:** Create vector embeddings for chunks to enable semantic search.

**Usage:**

```bash
# Embed all chunks that don't have vectors yet
python3 scripts/memory-embed.py

# Force re-embed all chunks (slow)
python3 scripts/memory-embed.py --force

# Use custom model (default: intfloat/e5-small)
python3 scripts/memory-embed.py --model sentence-transformers/all-MiniLM-L6-v2
```

**Requirements:**

```bash
pip install sentence-transformers torch
```

**Output:**

```
Loading model: intfloat/e5-small
Found 87 chunks to embed
Embedding: [████████████████████████████████] 87/87
Inserted 87 vectors
Duration: 12.4s
```

**Model notes:**
- `intfloat/e5-small`: Fast, good quality (384-dim vectors)
- `all-MiniLM-L6-v2`: Slightly faster (384-dim)
- `all-mpnet-base-v2`: Slower but higher quality (768-dim)

**Run frequency:**
- After running `memory-index.py` (to embed new chunks)
- Weekly for long-lived projects (to catch any missed chunks)

---

### 3. `memory-search.py` — Search Code, Docs, and Events

**Purpose:** Query `vibe.db` for relevant code snippets, documentation, or past events.

**Usage:**

```bash
# Search code
python3 scripts/memory-search.py "routing pattern"
python3 scripts/memory-search.py "button component" --mode code --k 10

# Search docs
python3 scripts/memory-search.py "setup instructions" --mode docs

# Search events (decisions, gotchas, plans)
python3 scripts/memory-search.py "expo decisions" --mode events

# Search everything
python3 scripts/memory-search.py "authentication" --mode all

# JSON output (for tools/scripts)
python3 scripts/memory-search.py "query" --json

# Safe mode (filter out bad patterns)
python3 scripts/memory-search.py "pattern to reuse" --safe-mode
```

**Parameters:**

| Flag | Default | Description |
|------|---------|-------------|
| `--mode` | `code` | Search scope: `code`, `docs`, `events`, `all` |
| `--k` | `10` | Number of results to return |
| `--json` | `false` | Output as JSON instead of human-readable |
| `--safe-mode` | `false` | Increase penalties for tagged bad patterns |
| `--alpha` | `0.3` | Vector similarity weight (0-1) |
| `--beta` | `0.5` | Tag penalty weight (0-1) |

**Output (human-readable):**

```
Results for "routing pattern" (mode: code)

1. src/app/router.tsx:15-42 (score: 0.87)
   export function AppRouter() {
     const routes = useRoutes([
       { path: '/', element: <HomePage /> },
       ...
```

**Output (JSON):**

```json
{
  "results": [
    {
      "path": "src/app/router.tsx",
      "start_line": 15,
      "end_line": 42,
      "score": 0.87,
      "snippet": "export function AppRouter() { ... }",
      "tags": []
    }
  ],
  "used_vectors": true,
  "mode": "code"
}
```

**Safe mode:**
- Filters out chunks with `POISON_PATH` or `PHANTOM_PATTERN` tags
- Increases penalty for `COMPLETION_DRIVE` and other cognitive tags
- Use when generating production code or reusing patterns

---

### 4. `memory-log-event.py` — Record Decisions & Events

**Purpose:** Add entries to the `events` table for tracking decisions, gotchas, plans, etc.

**Usage:**

```bash
# Log a decision
python3 scripts/memory-log-event.py \
  --kind decision \
  --title "Switch to Zustand for state management" \
  --detail '{"scope":"frontend","rationale":"simpler than Redux","alternatives_considered":["Redux","MobX"]}'

# Log a gotcha
python3 scripts/memory-log-event.py \
  --kind gotcha \
  --title "Expo router breaks on nested dynamic routes" \
  --detail '{"scope":"expo","tags":["routing","breaking-change"]}'

# Log a session retrospective
python3 scripts/memory-log-event.py \
  --kind retro \
  --title "Session 2025-11-19: Fixed calculator layout issues" \
  --detail '{"files_modified":["src/Calculator.tsx"],"learnings":"CSS Grid better than Flexbox for this layout"}'
```

**Event kinds (see `vibe-memory-v2-conventions.md` for full list):**
- `decision` — Architectural or design choice
- `gotcha` — Pitfall or anti-pattern
- `plan` — Strategic plan or phased approach
- `retro` — Session retrospective
- `ra-tagged-snippet` — Response Awareness marker
- `task_history` — Completed task with outcome
- `phase_complete` — OS 2.2 pipeline phase completion

**Detail JSON structure (recommended fields):**

```json
{
  "scope": "expo|ios|frontend|data|seo|general",
  "phase": "planning|implementation_pass1|implementation_pass2|review|complete",
  "decision_type": "architecture|tooling|pattern|style|process",
  "rationale": "Brief explanation",
  "alternatives_considered": ["option A", "option B"],
  "tags": ["tag1", "tag2"],
  "outcome": "success|partial|failure",
  "files_modified": ["file1.tsx", "file2.ts"],
  "learnings": "What we learned"
}
```

**Output:**

```
Event logged:
  ID: evt-20251120-001
  Kind: decision
  Title: Switch to Zustand for state management
  Timestamp: 2025-11-20T10:15:30Z
```

---

### 5. `memory-compact.py` — Clean Up & Optimize

**Purpose:** Prune orphaned chunks, archive old events, and reclaim space.

**Usage:**

```bash
# Remove chunks for files that no longer exist
python3 scripts/memory-compact.py --mode prune-orphans

# Archive events older than 180 days
python3 scripts/memory-compact.py --mode archive-old-events --older-than 180

# Vacuum database to reclaim space
python3 scripts/memory-compact.py --mode vacuum

# Run all cleanup operations
python3 scripts/memory-compact.py --mode all
```

**Output:**

```
Running compact mode: prune-orphans
Checking 87 chunks...
Found 5 orphaned chunks (files deleted)
Removed 5 chunks
Duration: 0.8s
```

**Backup before compacting:**

```bash
cp .claude/memory/vibe.db .claude/memory/vibe.db.backup-$(date +%Y%m%d)
python3 scripts/memory-compact.py --mode all
```

**Run frequency:**
- Monthly for active projects
- When `vibe.db` exceeds 100MB
- After major file reorganizations

---

## MCP Integration

The memory system is also accessible via MCP (Model Context Protocol) for use by Claude Code and Codex.

**MCP tool:** `memory.search`

**Usage from Claude Code/Codex:**

```typescript
// Agent calls this automatically
const results = await call_mcp_tool('memory.search', {
  query: 'routing pattern',
  k: 10,
  mode: 'code'
});
```

**Configuration:**

Add to `~/.claude.json` (per-project):

```json
{
  "projects": {
    "/path/to/your-project": {
      "mcpServers": {
        "vibe-memory": {
          "command": "python3",
          "args": ["/Users/adilkalam/.claude/mcp/vibe-memory/memory_server.py"],
          "env": { "PYTHONUNBUFFERED": "1" }
        }
      }
    }
  }
}
```

**See also:**
- `docs/memory/mcp-memory.md` — MCP server details
- `docs/memory/codex-cli-mcp-memory.md` — Codex CLI integration

---

## Typical Workflow

### Starting a New Project

```bash
# 1. Initialize (creates vibe.db)
python3 scripts/memory-index.py --index-all

# 2. Generate embeddings
python3 scripts/memory-embed.py

# 3. Verify it works
python3 scripts/memory-search.py "test query" --mode all
```

### Daily Work

```bash
# At start of day: Update index with recent changes
python3 scripts/memory-index.py --update-changed

# During work: Search as needed
python3 scripts/memory-search.py "pattern I need"

# At end of day: Log decisions/learnings
python3 scripts/memory-log-event.py \
  --kind retro \
  --title "Session $(date +%Y-%m-%d): Summary" \
  --detail '{"files_modified":["..."],"learnings":"..."}'
```

### Monthly Maintenance

```bash
# Backup database
cp .claude/memory/vibe.db .claude/memory/vibe.db.backup-$(date +%Y%m%d)

# Clean up and optimize
python3 scripts/memory-compact.py --mode all

# Re-embed if needed (after big changes)
python3 scripts/memory-embed.py --force
```

---

## Troubleshooting

### Database locked errors

**Cause:** Multiple tools accessing `vibe.db` simultaneously without WAL mode.

**Solution:**

```python
# Ensure all scripts use WAL mode
conn = sqlite3.connect('.claude/memory/vibe.db')
conn.execute('PRAGMA journal_mode=WAL')
```

### Search returns no results

**Diagnosis:**

```bash
# Check if chunks exist
sqlite3 .claude/memory/vibe.db "SELECT COUNT(*) FROM chunks;"

# Check if FTS index populated
sqlite3 .claude/memory/vibe.db "SELECT COUNT(*) FROM chunks_fts;"

# Check if vectors exist (for semantic search)
sqlite3 .claude/memory/vibe.db "SELECT COUNT(*) FROM chunk_vectors;"
```

**Solution:**
- If chunks empty: Run `memory-index.py --index-all`
- If FTS empty but chunks populated: Schema issue, recreate FTS table
- If vectors empty: Run `memory-embed.py`

### Large database size

**Diagnosis:**

```bash
# Check database size
du -h .claude/memory/vibe.db

# Check table sizes
sqlite3 .claude/memory/vibe.db << EOF
SELECT
  name,
  SUM(pgsize) / 1024 / 1024 AS size_mb
FROM dbstat
GROUP BY name
ORDER BY size_mb DESC;
EOF
```

**Solution:**
- Run `memory-compact.py --mode all`
- Consider pruning old events: `--mode archive-old-events --older-than 90`
- If vectors are huge, reduce embedding coverage (don't embed every tiny chunk)

---

## Advanced Usage

### Custom Ranking Weights

Tune search ranking for your project:

```bash
# Favor vector similarity over FTS
python3 scripts/memory-search.py "query" --alpha 0.7 --beta 0.3

# Heavily penalize bad patterns
python3 scripts/memory-search.py "query" --beta 1.5

# Disable vector search (FTS only)
python3 scripts/memory-search.py "query" --alpha 0.0
```

### Event Filtering

```bash
# Find all decisions about Expo
python3 scripts/memory-search.py "expo" --mode events --json \
  | jq '.events[] | select(.kind == "decision")'

# Find all gotchas in the last 30 days
python3 scripts/memory-search.py "" --mode events --json \
  | jq '.events[] | select(.kind == "gotcha") | select(.ts > "2025-10-20")'
```

### Integration with Other Tools

```bash
# Use memory search in shell scripts
RESULTS=$(python3 scripts/memory-search.py "pattern" --json)
echo "$RESULTS" | jq '.results[0].path'

# Pipe to other commands
python3 scripts/memory-search.py "TODO" --mode code --json \
  | jq -r '.results[].path' \
  | xargs -I {} echo "TODO found in: {}"
```

---

## Files

| File | Purpose |
|------|---------|
| `.claude/memory/vibe.db` | SQLite database (per-project) |
| `scripts/memory-index.py` | Index code & docs |
| `scripts/memory-embed.py` | Generate embeddings |
| `scripts/memory-search.py` | Query memory |
| `scripts/memory-log-event.py` | Log events |
| `scripts/memory-compact.py` | Clean up & optimize |
| `mcp/vibe-memory/memory_server.py` | MCP server for tools |

---

## See Also

- `vibe-memory-v2-architecture-2025-11-19.md` — System architecture
- `vibe-memory-v2-conventions.md` — Conventions and integration details
- `mcp-memory.md` — MCP server configuration
- `codex-cli-mcp-memory.md` — Codex CLI integration

---

_Last updated: 2025-11-20_
