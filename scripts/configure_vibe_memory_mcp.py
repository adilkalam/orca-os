#!/usr/bin/env python3
"""
Safely add/merge the vibe-memory MCP server into your global Claude config (~/.claude.json).

Usage:
  python3 scripts/configure_vibe_memory_mcp.py [--dry-run]

What it does:
  - Creates ~/.claude.json if missing
  - Adds/updates mcpServers.vibe-memory with the server in this repo
  - Backs up the original to ~/.claude.json.backup-YYYYmmdd-HHMMSS
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

