# Vibe Memory v2 Conventions & Implementation Details — 2025-11-20

Operational conventions for the vibe.db memory system. Read this alongside `vibe-memory-v2-architecture-2025-11-19.md`.

---

## 1. Event Taxonomy & Structure

### 1.1 Canonical Event Kinds

The `events.kind` field uses a small, fixed vocabulary:

| Kind | Purpose | Example Title |
|------|---------|---------------|
| `decision` | Architectural or design choice | "Adopt Tailwind for marketing site only" |
| `gotcha` | Pitfall, anti-pattern, or failure mode | "Expo router breaks on nested dynamic routes" |
| `plan` | Strategic plan or phased approach | "Three-phase migration from Context API to Zustand" |
| `retro` | Session retrospective or learning summary | "Session 2025-11-19: Fixed calculator layout issues" |
| `ra-tagged-snippet` | Response Awareness marker event | "COMPLETION_DRIVE detected in agent response" |
| `task_history` | Completed task with outcome | "Implemented user authentication flow" |
| `phase_complete` | OS 2.2 pipeline phase completion | "Expo build pipeline phase 3 complete" |

**Rule:** Use only these kinds. If you need a new one, document it here first.

### 1.2 Detail JSON Structure Convention

`events.detail_json` is a JSON string with the following recommended schema:

```json
{
  "scope": "expo|ios|frontend|data|seo|general",
  "phase": "planning|implementation_pass1|implementation_pass2|review|complete",
  "decision_type": "architecture|tooling|pattern|style|process",
  "rationale": "Brief explanation of why",
  "alternatives_considered": ["option A", "option B"],
  "tags": ["expo", "routing", "breaking-change"],
  "outcome": "success|partial|failure",
  "files_modified": ["src/app/index.tsx", "src/components/Button.tsx"],
  "learnings": "What we learned or what to avoid next time"
}
```

**Not all fields are required for every event.** Use what makes sense:

- `decision`: Include `scope`, `decision_type`, `rationale`, `alternatives_considered`
- `gotcha`: Include `scope`, `tags`, example of what went wrong
- `task_history`: Include `outcome`, `files_modified`, `learnings`
- `phase_complete`: Include `scope`, `phase`, `outcome`

**Why this matters:** Consistent structure enables:
- Better MCP filtering ("show me all expo decisions")
- Dashboard/analysis tools
- Future ML-based pattern detection

---

## 2. Retention & Compaction Strategy

### 2.1 When to Clean Up

Memory grows over time. Define thresholds:

| Scenario | Threshold | Action |
|----------|-----------|--------|
| Old chunks | File deleted or moved | Mark as `orphaned` or remove from `chunks` |
| Superseded code | Same path indexed again | Update existing `chunks` row (don't duplicate) |
| Old events | Events older than 6 months | Archive to `events_archive` table or export to JSONL |
| Vector bloat | `chunk_vectors` > 10k rows | Prune lowest-relevance chunks or compress embeddings |

### 2.2 Compaction Script: `memory-compact.py`

Create `scripts/memory-compact.py` with:

```bash
python3 scripts/memory-compact.py --mode prune-orphans
python3 scripts/memory-compact.py --mode archive-old-events --older-than 180
python3 scripts/memory-compact.py --mode vacuum
```

**Responsibilities:**
- Remove `chunks` where `path` no longer exists in repo
- Move old `events` to `events_archive` table
- Run `VACUUM` to reclaim space
- Optionally: compress `chunk_vectors` (future enhancement)

**When to run:** Monthly, or when `vibe.db` exceeds 100MB.

### 2.3 Backup Before Compaction

Always backup before destructive operations:

```bash
cp .claude/memory/vibe.db .claude/memory/vibe.db.backup-$(date +%Y%m%d)
```

---

## 3. Concurrency & Access Patterns

### 3.1 SQLite WAL Mode (MANDATORY)

**Rule:** All tools MUST enable WAL mode on first connection.

Add to every script that opens `vibe.db`:

```python
conn = sqlite3.connect('.claude/memory/vibe.db')
conn.execute('PRAGMA journal_mode=WAL')
conn.execute('PRAGMA synchronous=NORMAL')
```

**Why:** WAL (Write-Ahead Logging) allows:
- Concurrent reads while writing
- Better crash recovery
- Essential for multi-tool access (Claude Code + Codex + MCP server)

### 3.2 Access Patterns

| Tool | Access Pattern | Notes |
|------|----------------|-------|
| `memory-index.py` | Write-heavy (batch inserts) | Run separately from active sessions |
| `memory-search.py` | Read-only | Can run concurrently with other reads |
| MCP `memory.search` | Read-only | Can run concurrently with other reads |
| `memory-log-event.py` | Write-light (single row inserts) | Safe to run during sessions |
| `memory-embed.py` | Write-heavy (batch vector inserts) | Run separately from active sessions |

**Best practice:**
- Run `memory-index.py` and `memory-embed.py` during off-hours or between sessions
- All search/query operations are safe to run anytime
- Event logging is lightweight and safe to run during active work

### 3.3 Locking Strategy

SQLite with WAL handles locking automatically, but:

- **Avoid long-running transactions** in scripts (keep them < 5 seconds)
- **Use `IMMEDIATE` transactions** for writes to prevent deadlocks:

```python
conn.execute('BEGIN IMMEDIATE')
# ... writes ...
conn.commit()
```

---

## 4. Search Ranking Formula & Safe Mode

### 4.1 Ranking Formula

When `memory-search.py` returns results, score them as:

```
final_score = (fts_score * 1.0) + (vector_similarity * α) - (tag_penalty * β)
```

**Parameters:**
- `fts_score`: BM25 score from FTS5 (normalized to 0-1)
- `vector_similarity`: Cosine similarity from embeddings (0-1)
- `α` (alpha): Vector weight, default `0.3`
- `β` (beta): Tag penalty weight, default `0.5`

**Tag penalties:**

| Tag | Penalty | Reason |
|-----|---------|--------|
| `COMPLETION_DRIVE` | 0.2 | Possibly hasty/incomplete work |
| `POISON_PATH` | 0.5 | Known bad pattern |
| `PHANTOM_PATTERN` | 0.3 | False pattern, avoid reuse |
| `UNVERIFIED_CLAIM` | 0.2 | Not proven to work |

### 4.2 Safe Mode

Add `--safe-mode` flag to `memory-search.py`:

```bash
python3 scripts/memory-search.py "routing pattern" --safe-mode
```

**Behavior:**
- Increase tag penalties: `β = 1.0` (instead of 0.5)
- Filter out chunks with `POISON_PATH` or `PHANTOM_PATTERN` tags entirely
- Show warning if top results have cognitive tags

**Use safe mode when:**
- Generating production code
- Reusing patterns for critical features
- Want to avoid known pitfalls

**Normal mode:** Use for exploration, research, understanding past work (including mistakes)

### 4.3 Implementation in `memory-search.py`

Add CLI arguments:

```python
parser.add_argument('--alpha', type=float, default=0.3, help='Vector weight')
parser.add_argument('--beta', type=float, default=0.5, help='Tag penalty weight')
parser.add_argument('--safe-mode', action='store_true', help='Increase penalties, filter bad patterns')
```

Compute scores:

```python
if args.safe_mode:
    beta = 1.0
    # Filter out POISON_PATH and PHANTOM_PATTERN entirely
    results = [r for r in results if not has_bad_tags(r)]
else:
    beta = args.beta

for result in results:
    tag_penalty = sum(TAG_PENALTIES.get(tag, 0) for tag in result['tags'])
    result['score'] = (result['fts_score'] * 1.0) +
                      (result['vector_sim'] * args.alpha) -
                      (tag_penalty * beta)
```

---

## 5. OS 2.2 Integration Points

### 5.1 ORCA Commands MUST Use Memory First

**Rule:** `/orca` and all `/orca-*` commands should:
1. Consult `memory.search` (via MCP) BEFORE doing manual `rg`/`find` searches
2. Look for historical decisions, patterns, gotchas related to the task
3. Surface relevant past work to avoid reinventing or repeating mistakes

**Implementation:**
- Update `orca-commands/*.md` to include a "Memory Consultation" step
- Example for `/orca-expo`:

```markdown
## Step 1: Memory Consultation (MANDATORY)

Before implementing, search memory for:
- Past Expo decisions: `memory.search "expo architecture decisions"`
- Known gotchas: `memory.search "expo gotcha" --mode events`
- Similar patterns: `memory.search "navigation pattern expo"`

Review results and note any:
- Architectural decisions to follow
- Anti-patterns to avoid
- Proven patterns to reuse
```

### 5.2 Agent Integration

Specialized agents should consult memory during their workflows:

| Agent | When to Use Memory | Query Examples |
|-------|-------------------|----------------|
| `frontend-builder-agent` | Before implementing UI components | "react component patterns", "tailwind layout gotchas" |
| `expo-architect-agent` | Before architectural decisions | "expo routing decisions", "expo state management patterns" |
| `ios-verification-agent` | Before testing | "ios testing gotchas", "xcode build failures" |
| `research-specialist` | When exploring approaches | "similar research", "past experiments with X" |

**Add to agent definitions:** A "Memory Research" phase at the start of their workflow.

### 5.3 Phase State Integration

When an OS 2.2 pipeline completes a phase:

**Hook:** End of phase (e.g., after `phase_state.json` updated)

**Action:** Log event to memory:

```bash
python3 scripts/memory-log-event.py \
  --kind phase_complete \
  --title "Expo build pipeline - Phase 3 complete" \
  --detail '{
    "scope": "expo",
    "phase": "implementation_pass2",
    "outcome": "success",
    "files_modified": ["src/app/index.tsx", "app.json"],
    "learnings": "Metro bundler caching caused issues, required cache clear"
  }'
```

**Benefit:** Creates searchable record of "runs" per project. Future work can query:
- "What happened last time we did an expo build?"
- "What issues did phase 3 encounter?"

### 5.4 Task History from `mcp__project-context__save_task_history`

**Integration:** When `save_task_history` MCP tool is called, ALSO log to memory:

```python
# In project-context MCP server, after saving to .claude/project/task-history/
# Also call:
memory_log_event(
    kind='task_history',
    title=f"{domain}: {task}",
    detail_json={
        'scope': domain,
        'outcome': outcome,
        'files_modified': files_modified,
        'learnings': learnings
    }
)
```

**Why:** Unifies task history across both:
- Project-context's structured task tracking
- Memory's searchable event log

---

## 6. Standardized Event Kind Values (Reference)

See section 1.1 for canonical list. Do NOT invent new kinds without updating this doc.

**Adding a new kind:**
1. Document in section 1.1
2. Add example detail_json schema
3. Update `memory-log-event.py` validation
4. Add to MCP server's event filtering logic

---

## 7. CLI as First-Class Tool

### 7.1 Memory CLI Command Reference

Create `docs/memory/README.md` with:

**Core commands:**

```bash
# Index project (run after major file changes)
python3 scripts/memory-index.py --update-changed

# Full reindex (run initially or after schema changes)
python3 scripts/memory-index.py --index-all

# Embed chunks for vector search (run after indexing)
python3 scripts/memory-embed.py

# Search code/docs
python3 scripts/memory-search.py "query text" --mode code --k 10 --json

# Search events
python3 scripts/memory-search.py "decisions about expo" --mode events --json

# Log an event
python3 scripts/memory-log-event.py \
  --kind decision \
  --title "Switch to Zustand for state management" \
  --detail '{"scope":"frontend","rationale":"simpler than Redux"}'

# Compact and clean up
python3 scripts/memory-compact.py --mode prune-orphans
python3 scripts/memory-compact.py --mode archive-old-events --older-than 180
python3 scripts/memory-compact.py --mode vacuum
```

### 7.2 JSON Output Examples

**Code search result:**

```json
{
  "results": [
    {
      "path": "src/components/Button.tsx",
      "start_line": 15,
      "end_line": 42,
      "score": 0.87,
      "snippet": "export function Button({ variant, children, ...props }) {\n  const styles = variant === 'primary' ? primaryStyles : secondaryStyles;\n  ...",
      "tags": []
    }
  ],
  "used_vectors": true,
  "mode": "code"
}
```

**Event search result:**

```json
{
  "events": [
    {
      "id": "evt-20251119-001",
      "ts": "2025-11-19T14:32:10Z",
      "kind": "decision",
      "title": "Adopt Tailwind for marketing site only",
      "detail_json": {
        "scope": "frontend",
        "decision_type": "tooling",
        "rationale": "Fast iteration on marketing pages, keep main app with styled-components"
      }
    }
  ],
  "mode": "events"
}
```

### 7.3 Wiring Codex CLI to Prefer Memory

**Goal:** When Codex needs to find patterns/context, use `memory.search` instead of `rg`.

**Implementation:** Update Codex agent system prompt or tool definitions to:

1. Check if `memory.search` MCP tool is available
2. If yes, use it for code/pattern searches
3. If no, fall back to `rg`/`grep`

**Example (conceptual):**

```python
# In Codex agent logic
if 'memory.search' in available_mcp_tools:
    results = call_mcp_tool('memory.search', {
        'query': user_query,
        'mode': 'code',
        'k': 10
    })
else:
    # Fallback to rg
    results = bash('rg "pattern" src/')
```

---

## 8. Implementation Checklist

Before considering v2 "production-ready", verify:

- [ ] `vibe.db` schema created with all tables (chunks, chunks_fts, chunk_vectors, events, tags)
- [ ] `memory-index.py` ported to target `vibe.db` and uses WAL mode
- [ ] `memory-embed.py` ported to target `vibe.db` and uses WAL mode
- [ ] `memory-search.py` v2 implemented with:
  - [ ] `--mode code|docs|events|all`
  - [ ] `--json` output
  - [ ] `--safe-mode` flag
  - [ ] Ranking formula with configurable `--alpha` and `--beta`
- [ ] `memory-log-event.py` created with validation for canonical event kinds
- [ ] `memory-compact.py` created with prune/archive/vacuum modes
- [ ] MCP server (`memory_server.py`) updated to:
  - [ ] Use `vibe.db` as primary DB path
  - [ ] Enable WAL mode
  - [ ] Support mode filtering
  - [ ] Return JSON payload matching documented schema
- [ ] `docs/memory/README.md` created with CLI examples
- [ ] ORCA commands updated to include "Memory Consultation" step
- [ ] Agent definitions updated to include memory research phase
- [ ] Phase state integration: Events logged at phase completion
- [ ] Task history integration: `save_task_history` also logs to memory events

---

## 9. Future Enhancements (Post-v2.0)

Ideas to consider later:

- **Embedding compression:** Store quantized vectors to reduce `chunk_vectors` size
- **Multi-modal memory:** Store screenshots, diagrams, audio notes as blobs
- **Cross-project memory:** Optional shared memory for patterns across multiple repos
- **ML-based pattern detection:** Train local model to detect code smells, anti-patterns
- **Memory dashboard:** Simple web UI to browse events, chunks, tag distribution
- **Automated event extraction:** Parse git commits and infer decisions/gotchas automatically

---

_Last updated: 2025-11-20_
