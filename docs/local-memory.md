# Local Memory — Fast, Private Project Retrieval (SQLite FTS5)

Why: Makes agents and humans faster by avoiding re‑reading the repo and by grounding answers in the right files/snippets — offline, private, and instant on your M‑series Mac.

---

## Quick Start

- Index everything (once): `python3 scripts/memory-index.py index-all --include-out`
- Update only changed files: `python3 scripts/memory-index.py update-changed`
- Search (BM25 ranked): `python3 scripts/memory-search.py "query terms" --k 8`

Examples:
- Tokens: `python3 scripts/memory-search.py "--color-accent-gold"`
- CSS class: `python3 scripts/memory-search.py "bento-card"`
- SwiftUI spacing: `python3 scripts/memory-search.py "\.padding\(16\) OR .padding(Spacing.s16)"`
- React hook: `python3 scripts/memory-search.py "useEffect NEAR/5 fetch"`

---

## What It Indexes

- Code + docs under: `src, app, pages, components, styles, lib, ui, agents, commands, hooks, scripts, templates, docs, Sources, Resources`
- Optional: `out/` static HTML via `--include-out`
- Skips: `.git`, `node_modules`, `.orchestration/verification/eval`
- Text only: typical code/doc extensions (ts/tsx/js/jsx/css/scss/sass/html/md/py/sh/swift/json/yml/txt)

---

## How It Works (Architecture)

- DB path: `.workshop/workshop.db`
- Tables:
  - `memory_files(path TEXT PRIMARY KEY, mtime REAL, size INTEGER)`
  - `memory_fts(path, start_line, end_line, text)` — SQLite FTS5 virtual table
- Chunking: ~120 lines or ~1200 chars per row with `start_line`/`end_line`
- Incremental updates: compares `mtime/size` and re-indexes only changed files
- Search: `bm25(memory_fts)` ranking + `snippet()` previews with file:line spans

---

## Commands

- Index changed files (default):
  - `python3 scripts/memory-index.py update-changed`
- Index everything (cold build):
  - `python3 scripts/memory-index.py index-all --include-out`
- Garbage collect removed files:
  - `python3 scripts/memory-index.py gc`
- Search:
  - `python3 scripts/memory-search.py "query" --k 8`

FTS tips:
- Phrase: `"exact phrase"`
- Boolean: `A AND B`, `A OR B`, `NOT A`
- Proximity: `NEAR/5`
- Prefix: `token*`

---

## Integrations

- Already wired (non-blocking): `scripts/quick-confirm.sh` and `scripts/finalize.sh` trigger `update-changed` in the background to keep the DB hot.
- Manual refresh (if you disable the hooks or want to run explicitly):
  - `python3 scripts/memory-index.py update-changed`
- Background refresh (file watcher):
  - `brew install fswatch`
  - `fswatch -o src app pages components styles ui | xargs -n1 -I{} python3 scripts/memory-index.py update-changed`

---

## Performance Notes (M‑Series Macs)

- SQLite FTS5 is in-process and very fast; WAL mode is enabled for reduced contention
- Indexing is incremental — subsequent runs typically complete in seconds
- Searching returns top‑k within milliseconds at this repo size

---

## Roadmap (Optional Vector Search)

For semantic search and higher precision:
- Add a `memory_vectors` table (chunk_id, vector BLOB) using FAISS or `sqlite-vss`
- Compute local embeddings (e.g., `sentence-transformers e5-small`) on MPS
- Pipeline: FTS top‑50 → rerank with cross-encoder (e.g., bge-rerank-base) → top‑k results
- Expose via an MCP server: `memory.search(query, k)` with citations

---

## Troubleshooting

- “No memory DB yet”: run `python3 scripts/memory-index.py index-all` once
- “FTS5 not supported”: use Homebrew SQLite or ensure macOS ships FTS5 (modern macOS includes it)
- “Missing results”: confirm file is in an indexed directory or pass `--dirs` to indexer
- Case-insensitivity: FTS is case-insensitive by default; use quotes for exact phrases

---

## FAQ

- Is it real-time? No — it’s near-real-time via `update-changed` or a watcher
- Does it index binaries? No — text code/doc files and `.html` (when `--include-out`)
- Privacy? Local-only; nothing leaves your machine
- Can agents use it? Yes — shell tools can call `memory-search.py`, and an MCP wrapper can expose a `memory://` tool easily
