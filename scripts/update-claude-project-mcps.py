#!/usr/bin/env python3
import argparse
import json
import os
from pathlib import Path
from datetime import datetime


def load_json(path: Path) -> dict:
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except Exception as e:
            raise SystemExit(f"Failed to parse {path}: {e}")
    return {}


def main() -> int:
    ap = argparse.ArgumentParser(description="Update ~/.claude.json per-project MCP servers")
    ap.add_argument("--project", action="append", help="Absolute project path to update (repeatable)")
    ap.add_argument("--server-path", default=str(Path.home() / ".claude/mcp/vibe-memory/memory_server.py"), help="Path to vibe-memory server")
    ap.add_argument("--add-vibe-memory", action="store_true", help="Ensure vibe-memory is present for the project(s)")
    ap.add_argument("--dedupe-duplicates", action="store_true", help="Remove project-level MCPs that duplicate global ones (identical config)")
    ap.add_argument("--dry-run", action="store_true", help="Print changes without writing")
    args = ap.parse_args()

    if not args.project:
        ap.error("--project is required (repeat for multiple projects)")

    home = Path.home()
    cfg_path = home / ".claude.json"
    cfg = load_json(cfg_path)
    projects = cfg.setdefault("projects", {})
    global_mcps = cfg.get("mcpServers", {}) if isinstance(cfg.get("mcpServers"), dict) else {}

    changes = []
    for proj in args.project:
        p = str(Path(proj).resolve())
        proj_cfg = projects.setdefault(p, {})
        pmcps = proj_cfg.setdefault("mcpServers", {})

        if args.dedupe_duplicates and isinstance(pmcps, dict) and isinstance(global_mcps, dict):
            to_delete = []
            for name, val in pmcps.items():
                if name in global_mcps and global_mcps[name] == val:
                    to_delete.append(name)
            for name in to_delete:
                del pmcps[name]
                changes.append(f"[{p}] removed duplicate MCP: {name}")

        if args.add_vibe_memory:
            pmcps["vibe-memory"] = {
                "command": "python3",
                "args": [args.server_path],
                "env": {"PYTHONUNBUFFERED": "1"},
            }
            changes.append(f"[{p}] ensured MCP: vibe-memory -> {args.server_path}")

    if not changes:
        print("No changes needed.")
        return 0

    out = json.dumps(cfg, indent=2) + "\n"
    if args.dry_run:
        print(f"Would write {cfg_path} with changes:")
        print(out)
        return 0

    # backup
    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup = cfg_path.with_name(f"{cfg_path.name}.backup-{ts}")
    if cfg_path.exists():
        try:
            cfg_path.replace(backup)
            print(f"Backed up original to {backup}")
        except Exception:
            print("Warning: backup failed; continuing")

    cfg_path.write_text(out, encoding="utf-8")
    print(f"Updated {cfg_path}")
    for c in changes:
        print("-", c)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

