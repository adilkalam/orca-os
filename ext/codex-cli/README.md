# Codex CLI – MCP memory.search Integration (Draft)

This folder contains a PR-ready implementation scaffold to add MCP-backed retrieval to Codex CLI.

Components:
- `mcp-client/` — minimal JSON-RPC stdio client for MCP servers
- `retrieval/` — retrieval shim that prefers `memory.search` and falls back to `rg`
- `patch-preflight/` — tiny patch summary to reduce foot‑guns (optional)

Local demo (in this repo):
1) Ensure local memory DB exists:
   - `python3 scripts/memory-index.py index-all --include-out`
2) Start the MCP server (or configure Claude to start it automatically):
   - `python3 mcp/vibe-memory/memory_server.py` (normally spawned by client)
3) Try the Node usage example (see below).

Usage example (Node):
```ts
import { searchCode } from "./retrieval/src/retrievalShim";

(async () => {
  const hits = await searchCode("bento-card OR --color-accent-gold", 8, {
    preferMCP: true,
    memoryServer: {
      command: "python3",
      args: ["mcp/vibe-memory/memory_server.py"],
      cwd: process.cwd(),
      timeoutMs: 5000,
    },
  });
  console.log(hits);
})();
```

Statusline example:
```ts
import { getMemoryStatus } from "./retrieval/src/status";

(async () => {
  const s = await getMemoryStatus({ command: "python3", args: ["mcp/vibe-memory/memory_server.py"], cwd: process.cwd() });
  console.log(s.connected && s.hasTool ? "MCP mem: on" : "MCP mem: off");
})();
```

Tests (suggested):
- Add Jest or vitest; mock child_process spawn and stdio streams; verify MCP framing and fallback behavior.

Patch preflight (optional):
- Run: `node patch-preflight/src/index.js /path/to/patch.diff`
- Output: counts files/hunks and warns for missing update/delete targets; exits non‑zero if warnings.
