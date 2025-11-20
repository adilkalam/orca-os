# MCP: memory.search Tool — 2025-11-19

Expose the local memory DB via an MCP stdio server so agents can fetch top‑k file snippets instantly without scanning the filesystem.

Files:
- `mcp/vibe-memory/memory_server.py` — minimal JSON‑RPC server over stdio
- `.claude/mcp.sample.json` — example client config snippet

What it provides:
- Tool `memory.search` with input `{ query: string, k?: number = 8 }`
- Results: JSON content with `{ results: [{ path, start, end, score, snippet }], used_vectors: boolean }`

Prereqs:
- A local memory DB at `.claude/memory/vibe.db` (or legacy `.workshop/workshop.db` fallback)
- Optional embeddings for rerank: `python3 scripts/memory-embed.py` (requires `sentence-transformers`)

Configure (Per‑Project in ~/.claude.json):
1) Edit `~/.claude.json` (Claude Desktop on macOS uses the same file).
2) Add `vibe-memory` under `projects["/absolute/path/to/your-project"].mcpServers`:

```json
{
  "projects": {
    "/absolute/path/to/your-project": {
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

Notes:
- Keep standard npm MCPs global under top‑level `mcpServers` to avoid duplication.
- Do not use `.claude/mcp.json` in the project; Claude Code does not read it.

Restart Claude. The `memory.search` tool should appear and be callable by agents in that project.

Manual test (framing):
- This server speaks Content‑Length framed JSON‑RPC over stdio. Most MCP clients handle this automatically.

Notes:
- If `chunk_vectors` exists and `sentence-transformers` is installed, the server reranks FTS top‑50 via e5‑small embeddings.
- Otherwise, it falls back to BM25 with `snippet()` previews.

---

_Last updated: 2025-11-19_
