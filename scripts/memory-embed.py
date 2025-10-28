#!/usr/bin/env python3
import argparse
import os
import sqlite3
from pathlib import Path

ROOT = Path(os.getcwd())
DB_PATH = ROOT / ".workshop" / "workshop.db"

def ensure_vectors(conn):
    conn.execute(
        "CREATE TABLE IF NOT EXISTS memory_vectors (rowid INTEGER PRIMARY KEY, dim INTEGER NOT NULL, vec BLOB NOT NULL)"
    )
    conn.commit()

def embed_texts(texts, model_name):
    try:
        from sentence_transformers import SentenceTransformer
        import numpy as np
    except Exception as e:
        print("Embedding libraries not available. Install: pip install sentence-transformers numpy")
        return None, None
    model = SentenceTransformer(model_name)
    vecs = model.encode(texts, normalize_embeddings=True)
    return vecs, vecs.shape[1]

def main():
    ap = argparse.ArgumentParser(description="Compute embeddings for FTS chunks into memory_vectors table")
    ap.add_argument("--model", default="intfloat/e5-small")
    ap.add_argument("--limit", type=int, default=5000)
    args = ap.parse_args()

    if not DB_PATH.exists():
        print("No DB found. Run memory-index first.")
        return 2
    con = sqlite3.connect(DB_PATH)
    try:
        ensure_vectors(con)
        # fetch rows without vectors
        rows = con.execute(
            "SELECT rowid, text FROM memory_fts WHERE rowid NOT IN (SELECT rowid FROM memory_vectors) LIMIT ?",
            (args.limit,),
        ).fetchall()
        if not rows:
            print("No new chunks to embed.")
            return 0
        rowids = [r[0] for r in rows]
        texts = [r[1] for r in rows]
        vecs, dim = embed_texts(texts, args.model)
        if vecs is None:
            return 3
        import numpy as np
        cur = con.cursor()
        for rid, vec in zip(rowids, vecs):
            blob = np.asarray(vec, dtype=np.float32).tobytes()
            cur.execute("REPLACE INTO memory_vectors(rowid, dim, vec) VALUES(?,?,?)", (rid, dim, blob))
        con.commit()
        print(f"Embedded {len(rowids)} chunks (dim={dim})")
        return 0
    finally:
        con.close()

if __name__ == "__main__":
    raise SystemExit(main())

