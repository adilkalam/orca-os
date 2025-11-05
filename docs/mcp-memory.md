# MCP: memory.search Tool

Expose the local memory DB via an MCP stdio server so agents can fetch top‑k file snippets instantly without scanning the filesystem.

Files:
- `mcp/vibe-memory/memory_server.py` — minimal JSON‑RPC server over stdio
- `.claude/mcp.sample.json` — example client config snippet

What it provides:
- Tool `memory.search` with input `{ query: string, k?: number = 8 }`
- Results: JSON content with `{ results: [{ path, start, end, score, snippet }], used_vectors: boolean }`

Prereqs:
- A local memory DB at `.workshop/workshop.db` (create with `python3 scripts/memory-index.py index-all --include-out`)
- Optional embeddings for rerank: `python3 scripts/memory-embed.py` (requires `sentence-transformers`)

Configure (Global):
1) Claude Code CLI: edit `~/.claude.json`
   Claude Desktop (macOS): edit `~/Library/Application Support/Claude/claude_desktop_config.json`
2) Add an entry under `mcpServers` (use an absolute server path; workspace root is inferred via initialize):

```json
{
  "mcpServers": {
    "vibe-memory": {
      "command": "python3",
      "args": ["/absolute/path/to/repo/mcp/vibe-memory/memory_server.py"],
      "env": { "PYTHONUNBUFFERED": "1" }
    }
  }
}

CLI helper (optional):

```bash
python3 scripts/configure_vibe_memory_mcp.py   # writes to ~/.claude.json (backed up)
```
```

Restart Claude. The MCP tool `memory.search` should appear and be callable by agents.

Manual test (framing):
- This server speaks Content‑Length framed JSON‑RPC over stdio. Most MCP clients handle this automatically.

Notes:
- If `memory_vectors` exists and `sentence-transformers` is installed, the server reranks FTS top‑50 via e5‑small embeddings.
- Otherwise, it falls back to BM25 with `snippet()` previews.
