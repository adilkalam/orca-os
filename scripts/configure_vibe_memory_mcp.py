#!/usr/bin/env python3
"""
⚠️ DEPRECATED - DO NOT USE ⚠️

This script is INCORRECT for vibe-memory architecture.

VIBE-MEMORY IS PER-PROJECT, NOT GLOBAL

**Correct Architecture:**
- Server code: ~/.claude/mcp/vibe-memory/memory_server.py (shared)
- Config: ~/.claude.json → projects["/abs/path/to/project"].mcpServers (per-project)
- Data: Project/.claude/memory/workshop.db (or legacy .workshop/workshop.db)

**Use instead:**
  scripts/update-claude-project-mcps.py --project /abs/path/to/project --add-vibe-memory --dedupe-duplicates

**Why per-project:**
- Each project has its own .workshop/workshop.db
- Memory is project-specific, not global
- Server finds database by walking up from CWD
- Follows Workshop's intended architecture

**DO NOT configure vibe-memory in ~/.claude.json globally**

This script is kept for reference but should NOT be used.
Use setup-vibe-memory-project.sh to configure vibe-memory per-project.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DEPRECATED CODE BELOW (DO NOT USE)
"""
import json
import os
import sys
from datetime import datetime
from pathlib import Path


def main() -> int:
    dry = "--dry-run" in sys.argv
    home = Path.home()
    cfg_path = home / ".claude.json"
    backup_path = home / f".claude.json.backup-{datetime.now().strftime('%Y%m%d-%H%M%S')}"

    # Deploy to global location, not local repo
    global_mcp_path = home / ".claude" / "mcp" / "vibe-memory" / "memory_server.py"
    server_path = global_mcp_path.as_posix()

    desired = {
        "command": "python3",
        "args": [server_path],
        "env": {"PYTHONUNBUFFERED": "1"},
    }

    if cfg_path.exists():
        try:
            cfg = json.loads(cfg_path.read_text(encoding="utf-8"))
        except Exception:
            print(f"Cannot parse {cfg_path}; aborting.")
            return 2
    else:
        cfg = {}

    mcp = cfg.get("mcpServers")
    if not isinstance(mcp, dict):
        mcp = {}
    mcp["vibe-memory"] = desired
    cfg["mcpServers"] = mcp

    out = json.dumps(cfg, indent=2)
    if dry:
        print("Would write to", cfg_path)
        print(out)
        return 0

    # backup then write
    if cfg_path.exists():
        try:
            cfg_path.replace(backup_path)
            print(f"Backed up original to {backup_path}")
        except Exception:
            print("Warning: backup failed; continuing")
    cfg_path.write_text(out + "\n", encoding="utf-8")
    print(f"Updated {cfg_path} with vibe-memory MCP → {server_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
