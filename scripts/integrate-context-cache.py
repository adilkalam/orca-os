#!/usr/bin/env python3
"""
integrate-context-cache.py
==========================

Helper CLI for inspecting and managing the SharedContext cache that backs
OS 2.2's unified memory architecture.

This script is designed to live at:
  ~/.claude/scripts/integrate-context-cache.py

and be invoked as:

  # Check cache status for the current project
  python3 ~/.claude/scripts/integrate-context-cache.py status

  # Invalidate cache for the current project
  python3 ~/.claude/scripts/integrate-context-cache.py invalidate

  # Show the recommended MCP call to query context with caching
  python3 ~/.claude/scripts/integrate-context-cache.py query \\
    --domain nextjs \\
    --task "implement auth flow"

This script does **not** speak MCP directly; the actual caching logic lives
in the `shared-context-server` MCP. Here we:
  - Inspect and manage the SQLite cache at ~/.claude/cache/shared-context/contexts.db
  - Emit the equivalent MCP calls that Claude/agents should make.
"""

from __future__ import annotations

import argparse
import os
import sqlite3
import subprocess
import sys
from pathlib import Path
from typing import Optional


HOME = Path(os.path.expanduser("~"))
SHARED_CONTEXT_DIR = HOME / ".claude" / "cache" / "shared-context"
CONTEXT_DB = SHARED_CONTEXT_DIR / "contexts.db"


def get_project_root() -> Path:
  """
  Resolve the project root, preferring the git toplevel when available.
  Falls back to the current working directory.
  """
  try:
    result = subprocess.run(
      ["git", "rev-parse", "--show-toplevel"],
      check=True,
      capture_output=True,
      text=True,
    )
    root = result.stdout.strip()
    if root:
      return Path(root)
  except Exception:
    pass
  return Path(os.environ.get("PWD", os.getcwd()))


def get_cache_row(project_id: str) -> Optional[sqlite3.Row]:
  """
  Return the cache metadata row for a given project_id, or None if missing.
  """
  if not CONTEXT_DB.exists():
    return None

  con = sqlite3.connect(str(CONTEXT_DB))
  con.row_factory = sqlite3.Row
  try:
    row = con.execute(
      "SELECT * FROM contexts WHERE project_id = ?",
      (project_id,),
    ).fetchone()
    return row
  finally:
    con.close()


def count_versions(project_id: str) -> int:
  """
  Count how many stored versions exist for a project.
  """
  if not CONTEXT_DB.exists():
    return 0
  con = sqlite3.connect(str(CONTEXT_DB))
  try:
    row = con.execute(
      "SELECT COUNT(*) FROM versions WHERE project_id = ?",
      (project_id,),
    ).fetchone()
    return int(row[0]) if row else 0
  finally:
    con.close()


def cmd_status(args: argparse.Namespace) -> int:
  project_root = get_project_root()
  project_id = str(project_root)

  if not CONTEXT_DB.exists():
    print(f"No SharedContext database found at: {CONTEXT_DB}")
    print("Run shared-context-server once (via Claude) to initialize it.")
    return 0

  row = get_cache_row(project_id)
  if row is None:
    print(f"No cache entry for project: {project_id}")
    print("Next call to mcp__project-context__query_context will populate cache.")
    return 0

  versions = count_versions(project_id)
  print(f"SharedContext cache status for project: {project_id}")
  print(f"- current_version: {row['current_version']}")
  print(f"- last_accessed:  {row['last_accessed']}")
  print(f"- access_count:   {row['access_count']}")
  print(f"- stored_versions:{versions}")
  return 0


def cmd_invalidate(args: argparse.Namespace) -> int:
  project_root = get_project_root()
  project_id = str(project_root)

  if not CONTEXT_DB.exists():
    print(f"No SharedContext database found at: {CONTEXT_DB}")
    return 0

  con = sqlite3.connect(str(CONTEXT_DB))
  try:
    with con:
      con.execute("DELETE FROM versions WHERE project_id = ?", (project_id,))
      con.execute("DELETE FROM contexts WHERE project_id = ?", (project_id,))
    print(f"Cleared SharedContext cache for project: {project_id}")
  finally:
    con.close()
  return 0


def cmd_query(args: argparse.Namespace) -> int:
  project_root = get_project_root()
  project_id = str(project_root)
  domain = args.domain
  task = args.task

  # This script does not call MCP directly; instead, emit the recommended
  # tool calls so Claude/agents can use them.
  print("To query context with caching for this project, run these MCP tools:")
  print()
  print("1) Load any existing cached context for this project:")
  print(f"   mcp__shared-context__get_shared_context({{ projectId: \"{project_id}\" }})")
  print()
  print("2) If cache miss or stale, call ProjectContextServer:")
  print("   mcp__project-context__query_context({")
  print(f"     domain: \"{domain}\",")
  print(f"     task: \"{task}\",")
  print(f"     projectPath: \"{project_root}\",")
  print("     maxFiles: 10,")
  print("     includeHistory: true")
  print("   })")
  print()
  print("3) Then update SharedContext with the fresh bundle:")
  print("   mcp__shared-context__update_shared_context({")
  print(f"     projectId: \"{project_id}\",")
  print("     context: /* the ContextBundle from step 2 */")
  print("   })")
  print()
  print("SharedContext caching is implemented inside shared-context-server;")
  print("this helper simply standardizes projectId and recommended calls.")
  return 0


def build_arg_parser() -> argparse.ArgumentParser:
  p = argparse.ArgumentParser(
    description="Inspect and manage SharedContext cache for the current project."
  )
  sub = p.add_subparsers(dest="command", required=True)

  sub.add_parser("status", help="Show cache status for the current project")
  sub.add_parser("invalidate", help="Clear cache entries for the current project")

  q = sub.add_parser("query", help="Show recommended MCP calls for cached query_context")
  q.add_argument("--domain", required=True, help="Domain/lane (e.g. nextjs, ios, expo)")
  q.add_argument("--task", required=True, help="Short description of the task")

  return p


def main(argv: list[str] | None = None) -> int:
  parser = build_arg_parser()
  args = parser.parse_args(argv)

  if args.command == "status":
    return cmd_status(args)
  if args.command == "invalidate":
    return cmd_invalidate(args)
  if args.command == "query":
    return cmd_query(args)

  parser.print_help()
  return 1


if __name__ == "__main__":
  raise SystemExit(main())

