# Codex Memory: Per‑Project DB + MCP

Use the same per‑project memory that Claude Code uses — from Codex — with two levels of integration: lightweight scripts and an MCP‑aware retrieval shim.

## Overview

- Source of truth: `.claude/memory/workshop.db` in each project (FTS5 + optional vectors).
- MCP server: `~/.claude/mcp/vibe-memory/memory_server.py` exposes `memory.search`.
- Config: per‑project MCPs are defined in `~/.claude.json → projects[<abs path>].mcpServers` (not `.claude/mcp.json`).
- Fallbacks: when MCP is unavailable, use ripgrep (`rg`).

## Setup

1) Ensure a memory DB exists (and is in the consolidated location):
```bash
workshop init
mkdir -p .claude/memory
mv .workshop/workshop.db .claude/memory/workshop.db 2>/dev/null || true
```

2) Configure per‑project MCP in `~/.claude.json` (additive to global MCPs):
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

Tip: use `scripts/update-claude-project-mcps.py --project /abs/path --add-vibe-memory --dedupe-duplicates` to update safely.

## Quick Start (Codex)

Preamble and memory helpers (no code changes in Codex needed):
```bash
# Print CLAUDE.md + session context
bash scripts/codex-session-preamble.sh

# Search memory (Workshop → rg fallback)
bash scripts/mem.sh search "css tokens OR design system"

# Add decisions/gotchas/goals/notes
bash scripts/mem.sh decision "Use global CSS tokens" -r "Consistency"
bash scripts/mem.sh gotcha "iOS sim requires Xcode 15.4+"
bash scripts/mem.sh goal   "Add dark mode support" -p high
bash scripts/mem.sh note   "API limit 100 req/min"

# View session context
bash scripts/mem.sh context
```

Install Workshop CLI for add commands: `pipx install claude-workshop` (search still falls back to `rg`).

## Deeper Integration (MCP Retrieval)

Use the included scaffold to prefer MCP memory search and fall back to ripgrep:

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

Result shape (both MCP and fallback): `{ path, start, end, score?, snippet? }`.

Status probe (optional):
```ts
import { getMemoryStatus } from "./ext/codex-cli/retrieval/src/status";
(async () => {
  const s = await getMemoryStatus({ command: "python3", args: ["/Users/adilkalam/.claude/mcp/vibe-memory/memory_server.py"], cwd: process.cwd() });
  console.log(s.connected && s.hasTool ? "MCP mem: on" : "MCP mem: off");
})();
```

## Path Resolution (Server)

`memory_server.py` resolves the DB in this order:
- `$WORKSHOP_DB` (absolute)
- `$WORKSHOP_ROOT/.claude/memory/workshop.db`
- Walk up from CWD: `.claude/memory/workshop.db` → `.claude-work/memory/workshop.db` → `.workshop/workshop.db`
- Same walk from script location
- Fallback: `CWD/.claude/memory/workshop.db`

## Troubleshooting

- Show project MCPs from `~/.claude.json`:
```bash
python3 - << 'EOF'
import json; from pathlib import Path
cfg=json.loads(Path(Path.home()/'.claude.json').read_text()); proj=str(Path.cwd().resolve())
print(json.dumps(cfg.get('projects',{}).get(proj,{}).get('mcpServers',{}), indent=2))
EOF
```

- Verify DB and server:
```bash
ls -lh .claude/memory/workshop.db
ls -lh ~/.claude/mcp/vibe-memory/memory_server.py
```

- Rebuild index if needed:
```bash
python3 scripts/memory-index.py index-all --include-out
```

- No Workshop CLI installed:
  - Add commands won’t work; search falls back to `rg`.

## Notes

- Avoid duplicating global MCPs under project `mcpServers`; use `--dedupe-duplicates` in the updater.
- You can pin a statusline badge using `retrieval/src/status.ts` to show MCP memory availability.

