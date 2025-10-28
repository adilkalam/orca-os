#!/usr/bin/env python3
import argparse
import os
import sqlite3
import time
from pathlib import Path

ROOT = Path(os.getcwd())
WS_DIR = ROOT / ".workshop"
DB_PATH = WS_DIR / "workshop.db"

DEFAULT_DIRS = [
    "src", "app", "pages", "components", "styles", "lib", "ui",
    "agents", "commands", "hooks", "scripts", "templates", "docs",
    "Sources", "Resources",
]

SKIP_DIRS = {".git", "node_modules", ".orchestration/verification/eval"}
TEXT_EXTS = {
    ".ts", ".tsx", ".js", ".jsx", ".css", ".scss", ".sass", ".html", ".md",
    ".py", ".sh", ".swift", ".json", ".yml", ".yaml", ".txt"
}


def ensure_db(conn: sqlite3.Connection):
    conn.executescript(
        """
        PRAGMA journal_mode=WAL;
        CREATE TABLE IF NOT EXISTS memory_files (
          path TEXT PRIMARY KEY,
          mtime REAL NOT NULL,
          size INTEGER NOT NULL
        );
        CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
          path UNINDEXED, start_line UNINDEXED, end_line UNINDEXED, text,
          tokenize='porter'
        );
        """
    )
    conn.commit()


def iter_files(dirs, include_out=False):
    for name in dirs:
        p = ROOT / name
        if not p.exists():
            continue
        for path in p.rglob("*"):
            if path.is_dir():
                rel = path.relative_to(ROOT).as_posix()
                if any(rel.startswith(s) for s in SKIP_DIRS):
                    continue
                continue
            if path.suffix.lower() in TEXT_EXTS:
                yield path
    if include_out:
        out = ROOT / "out"
        if out.exists():
            for path in out.rglob("*.html"):
                yield path


def chunk_lines(lines, max_chars=1200, max_lines=120):
    start = 1
    buf = []
    char_count = 0
    for i, line in enumerate(lines, start=1):
        buf.append(line)
        char_count += len(line) + 1
        if len(buf) >= max_lines or char_count >= max_chars:
            yield start, i, "\n".join(buf)
            start = i + 1
            buf = []
            char_count = 0
    if buf:
        yield start, start + len(buf) - 1, "\n".join(buf)


def index_file(conn, path: Path):
    rel = path.relative_to(ROOT).as_posix()
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return
    lines = text.splitlines()
    cur = conn.cursor()
    cur.execute("DELETE FROM memory_fts WHERE path=?", (rel,))
    for start, end, chunk in chunk_lines(lines):
        cur.execute(
            "INSERT INTO memory_fts(path,start_line,end_line,text) VALUES(?,?,?,?)",
            (rel, start, end, chunk),
        )
    st = path.stat()
    cur.execute(
        "REPLACE INTO memory_files(path,mtime,size) VALUES(?,?,?)",
        (rel, st.st_mtime, st.st_size),
    )
    conn.commit()


def needs_index(conn, path: Path):
    rel = path.relative_to(ROOT).as_posix()
    st = path.stat()
    cur = conn.execute("SELECT mtime,size FROM memory_files WHERE path=?", (rel,))
    row = cur.fetchone()
    if not row:
        return True
    old_mtime, old_size = row
    return (st.st_mtime != old_mtime) or (st.st_size != old_size)


def gc_deleted(conn):
    cur = conn.cursor()
    rows = cur.execute("SELECT path FROM memory_files").fetchall()
    for (rel,) in rows:
        if not (ROOT / rel).exists():
            cur.execute("DELETE FROM memory_files WHERE path=?", (rel,))
            cur.execute("DELETE FROM memory_fts WHERE path=?", (rel,))
    conn.commit()


def main():
    ap = argparse.ArgumentParser(description="Index project files into local memory (SQLite FTS5)")
    ap.add_argument("command", choices=["index-all", "update-changed", "gc"], nargs="?", default="update-changed")
    ap.add_argument("--include-out", action="store_true", dest="include_out")
    ap.add_argument("--dirs", nargs="*", default=DEFAULT_DIRS)
    args = ap.parse_args()

    WS_DIR.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        ensure_db(conn)
        if args.command == "gc":
            gc_deleted(conn)
            print("GC complete")
            return 0

        count = 0
        for path in iter_files(args.dirs, include_out=args.include_out):
            if args.command == "update-changed" and not needs_index(conn, path):
                continue
            index_file(conn, path)
            count += 1
        print(f"Indexed {count} files ({args.command})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

