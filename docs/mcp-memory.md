# MCP: memory.search Tool

Expose the local memory DB via an MCP stdio server so agents can fetch top‑k file snippets instantly without scanning the filesystem.

Files:
- `.claude/mcp/memory_server.py` — minimal JSON‑RPC server over stdio
- `.claude/mcp.sample.json` — example client config snippet

What it provides:
- Tool `memory.search` with input `{ query: string, k?: number = 8 }`
- Results: JSON content with `{ results: [{ path, start, end, score, snippet }], used_vectors: boolean }`

Prereqs:
- A local memory DB at `.workshop/workshop.db` (create with `python3 scripts/memory-index.py index-all --include-out`)
- Optional embeddings for rerank: `python3 scripts/memory-embed.py` (requires `sentence-transformers`)

Configure (Claude Desktop example):
1) Open `~/Library/Application Support/Claude/claude_desktop_config.json`
2) Add an entry under `mcpServers` (use an absolute path or set `cwd` if supported):

```json
{
  "mcpServers": {
    "vibe-memory": {
      "command": "python3",
      "args": ["/absolute/path/to/repo/.claude/mcp/memory_server.py"],
      "env": { "PYTHONUNBUFFERED": "1" }
    }
  }
}
```

Restart Claude. The MCP tool `memory.search` should appear and be callable by agents.

Manual test (framing):
- This server speaks Content‑Length framed JSON‑RPC over stdio. Most MCP clients handle this automatically.

Notes:
- If `memory_vectors` exists and `sentence-transformers` is installed, the server reranks FTS top‑50 via e5‑small embeddings.
- Otherwise, it falls back to BM25 with `snippet()` previews.

