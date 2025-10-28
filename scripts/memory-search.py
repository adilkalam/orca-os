#!/usr/bin/env python3
import argparse
import os
import sqlite3
from pathlib import Path

ROOT = Path(os.getcwd())
DB_PATH = ROOT / ".workshop" / "workshop.db"

def try_vector_search(con, query: str, k: int, fts_k: int = 50):
    try:
        from sentence_transformers import SentenceTransformer
        import numpy as np
    except Exception:
        return None
    model = SentenceTransformer("intfloat/e5-small")
    qvec = model.encode([query], normalize_embeddings=True)[0].astype("float32")
    # get FTS top N rowids
    rows = con.execute(
        "SELECT rowid, path, start_line, end_line FROM memory_fts WHERE memory_fts MATCH ? LIMIT ?",
        (query, fts_k),
    ).fetchall()
    if not rows:
        return []
    rowids = [r[0] for r in rows]
    # fetch vectors
    vec_rows = con.execute(
        f"SELECT rowid, dim, vec FROM memory_vectors WHERE rowid IN ({','.join('?'*len(rowids))})",
        rowids,
    ).fetchall()
    dims = set(r[1] for r in vec_rows)
    if not vec_rows or len(dims) != 1:
        return None
    dim = dims.pop()
    import numpy as np
    mat = np.vstack([np.frombuffer(r[2], dtype=np.float32) for r in vec_rows])
    cand_rowids = [r[0] for r in vec_rows]
    sims = mat @ qvec[:dim]
    order = np.argsort(-sims)[:k]
    rowid_to_meta = {r[0]: (r[1], r[2]) for r in rows}  # rowid -> (path,start,end)
    results = []
    for idx in order:
        rid = cand_rowids[idx]
        path, s, e = rowid_to_meta.get(rid, (None, None, None))
        if path is None:
            continue
        snip = con.execute(
            "SELECT snippet(memory_fts, 3, '>>','<<',' … ', 8) FROM memory_fts WHERE rowid=?",
            (rid,),
        ).fetchone()[0]
        results.append((path, s, e, float(sims[idx]), snip))
    return results


def search(query: str, k: int):
    if not DB_PATH.exists():
        print("No memory DB yet. Run: python3 scripts/memory-index.py index-all")
        return
    con = sqlite3.connect(DB_PATH)
    try:
        con.execute("PRAGMA query_only=ON")
        # Try vector rerank if vectors exist and libs available
        has_vecs = con.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='memory_vectors'").fetchone()
        used_vectors = False
        if has_vecs:
            vec_results = try_vector_search(con, query, k)
            if vec_results is not None:
                used_vectors = True
                for path, s, e, score, snip in vec_results:
                    print(f"{path}:{s}–{e}\n  {snip}\n")
        if not used_vectors:
            sql = (
                "SELECT path, start_line, end_line, bm25(memory_fts) AS rank, "
                "snippet(memory_fts, 3, '>>', '<<', ' … ', 8) AS snip "
                "FROM memory_fts WHERE memory_fts MATCH ? ORDER BY rank LIMIT ?"
            )
            for row in con.execute(sql, (query, k)):
                path, s, e, rank, snip = row
                print(f"{path}:{s}–{e}\n  {snip}\n")
    finally:
        con.close()


def main():
    ap = argparse.ArgumentParser(description="Search local memory (SQLite FTS5)")
    ap.add_argument("query", help="search query (FTS match syntax)")
    ap.add_argument("--k", type=int, default=8)
    args = ap.parse_args()
    search(args.query, args.k)


if __name__ == "__main__":
    raise SystemExit(main())
