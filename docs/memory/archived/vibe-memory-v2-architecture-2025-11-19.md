# Vibe Memory v2 Architecture — 2025-11-19

Project-scoped memory system for Claude Code and Codex, built to be reliable, inspectable, and cognitively interesting (captures how code was produced, not just what).

This design intentionally avoids Workshop/third-party coupling as a hard dependency. It uses a single per-project SQLite database plus small scripts/hooks you already have patterns for.

**📚 Related Documentation:**
- `vibe-memory-v2-conventions.md` — Operational conventions, event taxonomy, retention strategy, OS 2.2 integration
- `README.md` — CLI command reference with examples and troubleshooting
- `mcp-memory.md` — MCP server configuration
- `codex-cli-mcp-memory.md` — Codex CLI integration

---

## 1. Goals

- **Project-specific**: Each repo has its own durable memory, no accidental cross-contamination.
- **Tool-agnostic**: Works from Claude Code and Codex via Bash and/or MCP.
- **Observable**: Memory lives in a single SQLite file and plain-text docs you can read and diff.
- **Semantic + symbolic**: Combined FTS5 and embeddings, tuned on your local machine.
- **Cognitive-aware**: Can track Response Awareness tags and "bad states" as first-class metadata.

---

## 2. Storage: `vibe.db` (Per-Project SQLite)

Location (per project):

- `./.claude/memory/vibe.db`

Core tables:

- `chunks`
  - `path TEXT` — repo-relative path
  - `start_line INTEGER`, `end_line INTEGER` — inclusive span
  - `kind TEXT` — `code`, `doc`, `kg`, `note`, etc.
  - `mtime REAL`, `size INTEGER`

- `chunks_fts` (FTS5 virtual table)
  - Columns: `path UNINDEXED`, `start_line UNINDEXED`, `end_line UNINDEXED`, `text`

- `chunk_vectors` (optional)
  - `rowid INTEGER PRIMARY KEY` (matches `chunks_fts.rowid`)
  - `dim INTEGER NOT NULL`
  - `vec BLOB NOT NULL` (float32 embedding)

- `events`
  - `id TEXT PRIMARY KEY` (or INTEGER)
  - `ts TEXT` (ISO8601)
  - `kind TEXT` — `decision`, `gotcha`, `plan`, `retro`, `ra-tagged-snippet`, …
  - `title TEXT`
  - `detail_json TEXT` (arbitrary structured metadata)

- `tags` (optional, for cognitive markers)
  - `chunk_rowid INTEGER`
  - `tag TEXT` — e.g. `COMPLETION_DRIVE`, `POISON_PATH`, `PHANTOM_PATTERN`

The goal is a single file that holds:

- Sliced code/docs/notes (`chunks`/`chunks_fts`/`chunk_vectors`)
- Higher-level events and decisions (`events`)
- Cognitive tags you care about (`tags`)

---

## 3. Ingestion Paths

### 3.1 Static / Indexed Content

Adapt existing scripts to target `vibe.db`:

- `scripts/memory-index.py`
  - Currently indexes into `.workshop/workshop.db`.
  - Update to:
    - Use `ROOT/.claude/memory/vibe.db` instead.
    - Ensure `chunks` + `chunks_fts` schema exists.
    - Walk the same directory set (`src`, `agents`, `commands`, `docs`, `scripts`, `out`, etc.).
    - Chunk files into sensible segments and populate both `chunks` and `chunks_fts`.
    - Preserve `update-changed` vs `index-all` behaviour.

- `scripts/memory-embed.py`
  - Currently writes `memory_vectors` into `.workshop/workshop.db`.
  - Update to:
    - Target `vibe.db` and `chunk_vectors`.
    - Use `intfloat/e5-small` embeddings by default.
    - Only embed rows not yet present in `chunk_vectors`.

This gives you fast FTS5 search plus optional vector rerank on the M4 Max.

### 3.2 Cognitive / Session Events

Add a small helper, e.g. `scripts/memory-log-event.py`:

- CLI shape:

```bash
python3 scripts/memory-log-event.py \
  --kind decision \
  --title "Adopt Tailwind for marketing site only" \
  --detail '{"scope":"marketing", "rationale":"fast iteration"}'
```

- Responsibilities:
  - Open `./.claude/memory/vibe.db`.
  - Ensure `events` exists.
  - Insert `ts=now()`, `kind`, `title`, `detail_json` (parsed/validated briefly).

Hook integration ideas:

- Claude Code `SessionEnd` hook:
  - Parse transcript (like `scripts/workshop-session-end.sh`), compute:
    - Files touched
    - Commands run
    - Any "big" user requests
  - Write a single `events` row summarizing the session.

- Codex "end-of-task" helper:
  - When you tell Codex "log what we learned", it calls `Bash` → `memory-log-event.py` with a synthesized summary.

---

## 4. Search API

### 4.1 Local CLI (`memory-search.py` v2)

Enhance `scripts/memory-search.py` to target `vibe.db` and support:

- Arguments:
  - `query` — search string (FTS syntax or plain text)
  - `--k` — number of results (default 8–16)
  - `--mode code|docs|events|all`

Behaviour:

- If `mode` includes code/docs:
  - FTS5 over `chunks_fts` + optional vector rerank using `chunk_vectors`.
  - Return `{path, start_line, end_line, score, snippet}`.

- If `mode` includes events:
  - Simple `LIKE`/FTS over `events.title`/`detail_json`.
  - Return `{id, ts, kind, title, detail_json}`.

Output:

- Human-readable (for direct shell use) **and** JSON mode (for tools), e.g. via `--json`.

### 4.2 MCP Bridge (`memory.search` tool)

Reuse the existing MCP server (`_explore/_MCPs/vibe-memory/memory_server.py`), but:

- Point `resolve_db_path` to `./.claude/memory/vibe.db` as the primary candidate.
- In `handle_memory_search`:
  - Call the same search logic as `memory-search.py`.
  - Return a JSON payload:

```json
{
  "results": [
    { "path": "src/foo.ts", "start": 10, "end": 30, "score": 0.83, "snippet": "…" }
  ],
  "events": [
    { "id": "sess-2025-11-19T01", "kind": "decision", "title": "…" }
  ],
  "used_vectors": true
}
```

- Wrap it in an MCP `tools/call` response with `content: [{ type: "json", json: payload }]`.

This keeps the transport identical but simplifies the DB side.

---

## 5. Cognitive / Metacognitive Layer

Once the basics are stable, add the "fun" part:

- Detection:
  - When indexing, scan chunks for Response Awareness tags (e.g. `#COMPLETION_DRIVE:`, `#POISON_PATH:`).
  - Write `tags(chunk_rowid, tag)` accordingly.

- Search/rank integration:
  - When searching for "patterns to reuse", deprioritize chunks that carry "bad" tags.
  - When surfacing historical decisions, highlight if they were produced under flagged states.

- Event kinds:
  - `ra-tagged-snippet` — log particularly interesting/important tagged events as first-class `events` rows.

The result is a memory system that doesn't just recall outputs, but remembers *how* you got there.

---

## 6. Suggested Implementation Order

1. **DB + index:**
   - Implement `vibe.db` schema and port `memory-index.py` / `memory-search.py` to it.
   - Confirm you can index and search code/docs for one project.

2. **Embeddings:**
   - Wire up `memory-embed.py` for `chunk_vectors` using `e5-small`.
   - Confirm vector rerank works locally.

3. **MCP bridge:**
   - Point `memory_server.py` at `vibe.db` and new search logic.
   - Verify `memory.search` works from Claude Code and Codex.

4. **Events:**
   - Add `events` + `memory-log-event.py`.
   - Hook it into at least one workflow (session end or explicit "log this" command).

5. **Cognitive tags:**
   - Detect Response Awareness tags during indexing.
   - Use them to influence ranking and surface "suspect" past work explicitly.

This keeps the system small and robust, while still giving you a rich playground for LLM cognitive behaviour experiments.

---

## 7. Implementation Details & Conventions

For operational details including:
- Event taxonomy and canonical event kinds
- Retention and compaction strategies
- Concurrency handling (WAL mode, access patterns)
- Search ranking formula and safe mode
- OS 2.2 integration points
- Standardized event structures
- Phase state and task history integration

See: **`vibe-memory-v2-conventions.md`**

For CLI usage and examples, see: **`README.md`**

---

_Last updated: 2025-11-19_
