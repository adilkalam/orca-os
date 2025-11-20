# Memory Architecture: vibe-memory + Workshop

**Per-Project Local Memory System for Claude Code**

---

## Overview

The memory system combines two components:
1. **Workshop** — SQLite FTS5 database for durable project knowledge
2. **vibe-memory MCP** — Exposes `memory.search` tool via Model Context Protocol

**Key Design:** Each project gets its own memory database in `.claude/memory/workshop.db`

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Claude Code Session                                     │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ MCP Client (Claude Code)                         │  │
│  │   ↓                                               │  │
│  │   Calls: memory.search("CSS patterns")           │  │
│  └───┬──────────────────────────────────────────────┘  │
│      │                                                  │
│      │ stdio (JSON-RPC 2.0)                             │
│      ↓                                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ vibe-memory MCP Server                           │  │
│  │   ~/.claude/mcp/vibe-memory/memory_server.py     │  │
│  │                                                   │  │
│  │   Path Resolution Priority:                      │  │
│  │   1. .claude/memory/workshop.db (NEW)            │  │
│  │   2. .claude-work/memory/workshop.db (legacy)    │  │
│  │   3. .workshop/workshop.db (legacy)              │  │
│  └───┬──────────────────────────────────────────────┘  │
│      │                                                  │
│      │ SQLite queries                                   │
│      ↓                                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Workshop Database                                │  │
│  │   .claude/memory/workshop.db                     │  │
│  │                                                   │  │
│  │   Tables:                                        │  │
│  │   - memory_files (tracked files)                 │  │
│  │   - memory_fts (FTS5 full-text search)          │  │
│  │   - memory_vectors (embeddings, optional)        │  │
│  │   - decisions, gotchas, goals, etc.              │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Directory Structure

### Per-Project Layout

```
your-project/
├── .claude/
│   ├── (no per-project mcp.json)   # Claude reads ~/.claude.json → projects[]
│   ├── memory/
│   │   ├── workshop.db             # SQLite database (FTS5)
│   │   └── playbooks/              # ACE learning patterns
│   ├── orchestration/
│   │   ├── session-context.md      # Loaded at session start
│   │   ├── evidence/               # Screenshots, logs
│   │   └── verification/           # Quality gate results
│   └── hooks/
│       └── session-start.sh        # Auto-loads memory context
│
├── CLAUDE.md                       # Project-specific instructions
└── (your source code...)
```

### Global MCP Server Location

```
~/.claude/
├── mcp/
│   └── vibe-memory/
│       └── memory_server.py        # MCP server (shared across projects)
├── hooks/
│   └── session-start.sh            # Outputs CLAUDE.md at session start
└── CLAUDE.md                       # Global instructions for all projects
```

---

## Configuration

### Per-Project MCP Config (Correct)

Configure per‑project MCPs inside `~/.claude.json` under the `projects` map, not in `.claude/mcp.json`.

```json
{
  "mcpServers": {
    "playwright": { /* global servers for ALL projects */ },
    "chrome-devtools": { /* … */ }
  },
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
- Do not duplicate global MCPs under a project’s `mcpServers` if they already exist in top‑level `mcpServers`.
- `.claude/mcp.json` files in the project are not read by Claude Code.

---

## Path Resolution Logic

The vibe-memory MCP server searches for `workshop.db` in this priority order:

1. **Environment variable:** `$WORKSHOP_DB` (absolute path)
2. **Environment variable:** `$WORKSHOP_ROOT/.claude/memory/workshop.db`
3. **Walk up from CWD:** `.claude/memory/workshop.db` (NEW primary location)
4. **Walk up from CWD:** `.claude-work/memory/workshop.db` (legacy fallback)
5. **Walk up from CWD:** `.workshop/workshop.db` (legacy fallback)
6. **Walk up from script location:** Same priority as above
7. **Fallback:** `CWD/.claude/memory/workshop.db`

**Result:** Automatically finds database in consolidated `.claude/memory/` location.

---

## Workshop Commands

### Initialize Database

```bash
cd your-project
workshop init
```

Creates `.workshop/workshop.db` in current directory.

**After initialization, move to consolidated location:**
```bash
mkdir -p .claude/memory
mv .workshop/workshop.db .claude/memory/workshop.db
rmdir .workshop
```

### Add Knowledge

```bash
# Record decision
workshop decision "Use Supabase for auth" -r "Self-hosted requirement"

# Record gotcha
workshop gotcha "iOS Simulator needs Xcode 15.4+ on macOS 15"

# Set goal
workshop goal "Add dark mode support" -p high

# Add note
workshop note "API rate limit is 100 req/min"

# Record antipattern
workshop antipattern "Don't use inline styles" -r "Use design system classes only"
```

### Search Memory

```bash
# Search via CLI
workshop search "CSS patterns"

# Search via MCP (in Claude Code)
# Uses memory.search tool automatically when vibe-memory is configured
```

### View Context

```bash
# Show recent context (loaded at session start)
workshop context

# Show all decisions
workshop read decisions

# Show all gotchas
workshop read gotchas
```

---

## Memory Search Tool

### Usage in Claude Code

Once vibe-memory MCP is configured, Claude can search project memory automatically:

**Example conversation:**
```
User: "What CSS approach did we decide on?"

Claude: [Calls memory.search tool internally]
Results: "Use global CSS with design tokens, not Tailwind"
         (from decision recorded in workshop.db)
```

### Search Methods

1. **Vector search** (if sentence-transformers installed):
   - Uses e5-small embeddings
   - Semantic similarity ranking
   - Falls back to FTS if vectors unavailable

2. **Full-text search** (FTS5, always available):
   - BM25 ranking
   - SQLite FTS5 with snippet extraction
   - Works without any ML dependencies

### Return Format

```json
{
  "results": [
    {
      "path": "src/components/Button.tsx",
      "start": 15,
      "end": 32,
      "score": 0.847,
      "snippet": "Use >>design system<< classes only"
    }
  ],
  "used_vectors": true
}
```

---

## Session Hooks Integration

### SessionStart Hook

**File:** `.claude/hooks/session-start.sh`

**What it does:**
1. Checks for Workshop database at `.claude/memory/workshop.db`
2. Generates session context from:
   - Recent git changes
   - Recent decisions, gotchas, goals
   - Implementation log tags
3. Outputs CLAUDE.md contents so Claude reads and follows instructions
4. Writes context to `.claude/orchestration/session-context.md`

**Key sections loaded:**
```bash
ORCH_DIR=".claude/orchestration"
DB_PATH=".claude/memory/workshop.db"
```

### CLAUDE.md Loading

The SessionStart hook now **forces Claude to read CLAUDE.md** at every session:

```bash
if [ -n "$NATIVE_PATH" ]; then
  echo "═══════════════════════════════════════════════════════════"
  echo "PROJECT INSTRUCTIONS (CLAUDE.md) - FOLLOW THESE THROUGHOUT SESSION"
  echo "═══════════════════════════════════════════════════════════"
  cat "$NATIVE_PATH"
  echo "═══════════════════════════════════════════════════════════"
  echo "END OF PROJECT INSTRUCTIONS - THESE MUST BE FOLLOWED"
  echo "═══════════════════════════════════════════════════════════"
fi
```

**Result:** Claude sees and must follow project instructions every session.

---

## Migration from Legacy Structure

### Old Structure (DEPRECATED)

```
your-project/
├── .claude-work/memory/workshop.db    ❌ Old location
├── .orchestration/                    ❌ Old location
└── .workshop/workshop.db              ❌ Old location
```

### New Structure (CURRENT)

```
your-project/
└── .claude/
    ├── mcp.json
    ├── memory/workshop.db             ✅ New location
    └── orchestration/                 ✅ New location
```

### Automatic Consolidation

The `/cleanup` slash command now auto-detects and consolidates legacy folders:

```bash
/cleanup
```

**What it does:**
1. Detects `.claude-work/`, `.orchestration/`, `.workshop/`
2. Moves contents to `.claude/memory/` and `.claude/orchestration/`
3. Removes empty legacy folders
4. Reports consolidation complete

---

## Why Per-Project Memory?

### Benefits

1. **Isolation** — Each project's memory is independent
2. **Performance** — Uses local M4 Max machine (no cloud latency)
3. **Privacy** — Memory stays on your machine
4. **Portability** — Database travels with project
5. **Scale** — No shared global database bottleneck

### Comparison with Global Memory

| Aspect | Per-Project (vibe-memory) | Global (claude-self-reflect) |
|--------|---------------------------|------------------------------|
| **Database** | SQLite per project | Qdrant + Docker (global) |
| **Speed** | Local (instant) | Network overhead |
| **Setup** | Simple (workshop init) | Docker + Qdrant setup |
| **Privacy** | Isolated per project | Shared across projects |
| **Use Case** | Project-specific context | Cross-project patterns |

**Note:** Both can coexist. Use per-project for project memory, global for universal patterns.

---

## Troubleshooting

### vibe-memory not connecting

```bash
# Check per-project MCP config in ~/.claude.json
python3 - << 'EOF'
import json, os
from pathlib import Path
cfg = json.loads(Path(Path.home()/'.claude.json').read_text())
proj = str(Path.cwd().resolve())
print(json.dumps(cfg.get('projects',{}).get(proj,{}).get('mcpServers',{}), indent=2))
EOF

# Verify database exists
ls -lh .claude/memory/workshop.db

# Check MCP server location
ls -lh ~/.claude/mcp/vibe-memory/memory_server.py

# Test Workshop CLI
workshop context
```

### Database not found

```bash
# Initialize in project root
cd your-project
workshop init

# Move to consolidated location
mkdir -p .claude/memory
mv .workshop/workshop.db .claude/memory/workshop.db
rmdir .workshop

# Verify
ls -lh .claude/memory/workshop.db
```

### Memory search returns no results

```bash
# Check if content is indexed
workshop read files

# Rebuild FTS index
python3 scripts/memory-index.py index-all --include-out

# Verify FTS table exists
sqlite3 .claude/memory/workshop.db "SELECT COUNT(*) FROM memory_fts;"
```

### CLAUDE.md not being followed

```bash
# Check session-start hook outputs it
cat ~/.claude/hooks/session-start.sh | grep -A 10 "CLAUDE.md"

# Verify hook is installed
ls -lh ~/.claude/hooks/session-start.sh

# Check CLAUDE.md exists
ls -lh CLAUDE.md .claude/CLAUDE.md
```

---

## Related Documentation

- **Workshop CLI:** `docs/memory/workshop.md`
- **MCP Setup:** `docs/memory/mcp-memory.md`
- **ACE Playbooks:** `.claude/orchestration/playbooks/readme.md`
- **Cleanup Command:** `commands/cleanup.md`

---

## Summary: Key Points

1. **Per-project architecture** — Each project gets `.claude/memory/workshop.db`
2. **Per‑project MCP config** — in `~/.claude.json` under `projects[<abs path>].mcpServers`
3. **Automatic path resolution** — Finds database in `.claude/memory/` first
4. **SessionStart loads context** — Includes CLAUDE.md contents with visual emphasis
5. **Workshop CLI for management** — Add decisions, gotchas, goals via CLI
6. **memory.search tool** — Claude uses automatically when vibe-memory MCP configured
7. **Cleanup auto-consolidates** — `/cleanup` moves legacy folders to `.claude/`

**Philosophy:** Local, isolated, fast project memory using your M4 Max machine.

---

_Last updated: 2025-11-12_
_Update after: Memory architecture changes or path resolution updates_
