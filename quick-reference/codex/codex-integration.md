# Codex Integration: Use Per‑Project Memory + Preamble

This repo includes lightweight scripts so Codex can leverage the same per‑project memory and session context you set up for Claude Code.

Key pieces:
- `.claude/memory/workshop.db` — per‑project memory DB (FTS5 + optional vectors)
- `.claude/orchestration/session-context.md` — session context snapshot
- `scripts/codex-session-preamble.sh` — prints CLAUDE.md + session context
- `scripts/mem.sh` — `/mem` helpers (search/add/context) wrapping Workshop

## Quick Start

1) Run the session preamble at the start of a Codex session:

```bash
bash scripts/codex-session-preamble.sh
```

2) Use memory helpers directly in Codex:

```bash
# Search memory (Workshop → ripgrep fallback)
bash scripts/mem.sh search "css tokens OR design system"

# Record decisions/gotchas/goals/notes
bash scripts/mem.sh decision "Use global CSS tokens" -r "Consistency across pages"
bash scripts/mem.sh gotcha "iOS simulator requires Xcode 15.4+ on macOS 15"
bash scripts/mem.sh goal "Add dark mode support" -p high
bash scripts/mem.sh note "API rate limit is 100 req/min"

# View session context
bash scripts/mem.sh context
```

Notes:
- Install Workshop CLI for add commands: `pipx install claude-workshop` (or `pip install claude-workshop`).
- The search command works without Workshop by falling back to `rg`.

## Optional: Deeper Codex Integration (MCP)

There’s a PR‑ready scaffold under `ext/codex-cli/` that adds an MCP‑aware retrieval shim to Codex:

- `ext/codex-cli/mcp-client/` — minimal stdio MCP client
- `ext/codex-cli/retrieval/src/retrievalShim.ts` — prefers `memory.search`, fallback to `rg`
- `ext/codex-cli/retrieval/src/status.ts` — small status probe for a statusline badge

Usage example (Node):

```ts
import { searchCode } from "./ext/codex-cli/retrieval/src/retrievalShim";

(async () => {
  const hits = await searchCode("decision OR gotcha", 8, {
    preferMCP: true,
    memoryServer: {
      command: "python3",
      args: ["/Users/adilkalam/.claude/mcp/vibe-memory/memory_server.py"],
      cwd: process.cwd(),
      timeoutMs: 5000,
    },
  });
  console.log(hits);
})();
```

This reuses the same per‑project DB at `.claude/memory/workshop.db` (resolved by the server via CWD/root), so Codex and Claude share one source of truth.

## Troubleshooting

- No `.claude/memory/workshop.db`:
  - Initialize with `workshop init`, then move DB to `.claude/memory/` (see quick-reference/memory.md).

- Workshop CLI missing:
  - Install via `pipx install claude-workshop` or use `rg` search fallback.

- Preamble prints no session context:
  - Generate with your SessionStart hook or run `hooks/session-start.sh` (legacy) to populate `.claude/orchestration/session-context.md`.

## Summary

- Codex can immediately use per‑project memory via the provided scripts.
- For deeper integration, wire `ext/codex-cli/retrieval` into Codex’s retrieval path to call `memory.search` automatically.

