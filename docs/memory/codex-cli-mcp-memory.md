# Proposal: Codex CLI — memory.search via MCP — 2025-11-19

Summary
- Add an MCP-backed retrieval path to Codex that prefers `memory.search` and falls back to ripgrep.
- Source of truth: per-project `.claude/memory/vibe.db` (shared with Claude Code).

Deliverables (in this repo)
- `ext/codex-cli/mcp-client/` — minimal stdio MCP client
- `ext/codex-cli/retrieval/` — retrieval shim + status probe
- `scripts/codex-session-preamble.sh` — prints CLAUDE.md + session-context
- `scripts/mem.sh` — simple `/mem` wrappers using Workshop CLI

Integration Steps (PR outline)
1) Copy `ext/codex-cli/*` into the Codex monorepo under packages (e.g., `packages/retrieval`, `packages/mcp-client`).
2) Wire the retrieval shim in Codex where code search is needed (intent, patch planning, RAG prompts):
   - `searchCode(query,k,cfg)` with `cfg.preferMCP = true` and `cfg.memoryServer` pointing to the user's MCP path.
3) Add a tiny statusline badge using `retrieval/src/status.ts` (optional).
4) Keep MCP configuration project-scoped; do not register vibe-memory globally.

Notes
- The MCP server resolves `.claude/memory/vibe.db` first, then legacy fallbacks. No manual path passing required.
- Vectors (e5-small) are used when available; otherwise FTS5 BM25 with snippets.

---

_Last updated: 2025-11-19_
