#!/usr/bin/env python3
"""
Minimal MCP (Model Context Protocol) stdio server exposing one tool:

  memory.search(query: string, k?: int = 8)

Backed by the local SQLite FTS database at .workshop/workshop.db.
Falls back gracefully when vectors/embedding libs are unavailable.

Transport: JSON-RPC 2.0 over stdio with Content-Length framing (LSP-style).

Notes:
- Designed to be dependency-light and portable.
- Implements only the subset of MCP needed by common clients: initialize, tools/list, tools/call.
"""
import io
import json
import os
import sqlite3
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urlparse, unquote

GLOBAL_ROOT: Optional[Path] = None


def resolve_db_path(root: Optional[Path] = None) -> Path:
    """Resolve the Workshop DB path robustly.

    Priority:
      1) WORKSHOP_DB env (absolute path)
      2) WORKSHOP_ROOT env + ".workshop/workshop.db"
      3) Nearest ".workshop/workshop.db" from CWD walking up
      4) Nearest ".workshop/workshop.db" from script location walking up
      5) Fallback: CWD/.workshop/workshop.db
    """
    env_db = os.environ.get("WORKSHOP_DB")
    if env_db:
        return Path(env_db).expanduser().resolve()

    # Root precedence: explicit param > global captured root > env var
    root_override = root or GLOBAL_ROOT
    if root_override:
        rootp = Path(root_override).expanduser().resolve()
        new_cand = rootp / ".claude-work" / "memory" / "workshop.db"
        if new_cand.exists():
            return new_cand
        old_cand = rootp / ".workshop" / "workshop.db"
        if old_cand.exists():
            return old_cand

    env_root = os.environ.get("WORKSHOP_ROOT")
    if env_root:
        rootp = Path(env_root).expanduser().resolve()
        # Prefer new layout
        new_cand = rootp / ".claude-work" / "memory" / "workshop.db"
        if new_cand.exists():
            return new_cand
        return rootp / ".workshop" / "workshop.db"

    cwd = Path(os.environ.get("PWD", os.getcwd()))
    # 3) Walk up from CWD (prefer new layout)
    for p in [cwd] + list(cwd.parents):
        cand_new = p / ".claude-work" / "memory" / "workshop.db"
        if cand_new.exists():
            return cand_new
        cand_old = p / ".workshop" / "workshop.db"
        if cand_old.exists():
            return cand_old

    # 4) Walk up from script location
    try:
        here = Path(__file__).resolve()
        for p in [here.parent] + list(here.parents):
            cand_new = p / ".claude-work" / "memory" / "workshop.db"
            if cand_new.exists():
                return cand_new
            cand_old = p / ".workshop" / "workshop.db"
            if cand_old.exists():
                return cand_old
    except Exception:
        pass

    # 5) Fallback
    # Default to new layout under CWD
    return cwd / ".claude-work" / "memory" / "workshop.db"

DB_PATH = resolve_db_path()


# ---------- Framing (Content-Length) ----------
stdin = sys.stdin.buffer
stdout = sys.stdout.buffer
stderr = sys.stderr


def read_message() -> Optional[Dict[str, Any]]:
    """Read one JSON-RPC message with Content-Length framing. Returns None on EOF."""
    # Read headers
    headers: Dict[str, str] = {}
    while True:
        line = stdin.readline()
        if not line:
            return None
        if line in (b"\r\n", b"\n"):
            break
        try:
            k, v = line.decode("utf-8").split(":", 1)
            headers[k.strip().lower()] = v.strip()
        except Exception:
            continue
    length_str = headers.get("content-length")
    if not length_str:
        return None
    try:
        length = int(length_str)
    except Exception:
        return None
    body = stdin.read(length)
    if not body:
        return None
    try:
        return json.loads(body.decode("utf-8"))
    except Exception as e:
        stderr.write(f"Failed to decode JSON body: {e}\n")
        stderr.flush()
        return None


def send_message(payload: Dict[str, Any]) -> None:
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    stdout.write(f"Content-Length: {len(data)}\r\n\r\n".encode("ascii"))
    stdout.write(data)
    stdout.flush()


def rpc_result(req_id: Any, result: Any) -> Dict[str, Any]:
    return {"jsonrpc": "2.0", "id": req_id, "result": result}


def rpc_error(req_id: Any, code: int, message: str, data: Any = None) -> Dict[str, Any]:
    err: Dict[str, Any] = {"jsonrpc": "2.0", "id": req_id, "error": {"code": code, "message": message}}
    if data is not None:
        err["error"]["data"] = data
    return err


_MODEL = None  # lazy-loaded SentenceTransformer


def _get_model():
    global _MODEL
    if _MODEL is not None:
        return _MODEL
    try:
        from sentence_transformers import SentenceTransformer
        _MODEL = SentenceTransformer("intfloat/e5-small")
    except Exception:
        _MODEL = None
    return _MODEL


# ---------- Memory search ----------
def try_vector_rerank(con: sqlite3.Connection, query: str, k: int, fts_k: int = 50):
    model = _get_model()
    if model is None:
        return None
    try:
        import numpy as np
        qvec = model.encode([query], normalize_embeddings=True)[0].astype("float32")
    except Exception:
        return None

    rows = con.execute(
        "SELECT rowid, path, start_line, end_line FROM memory_fts WHERE memory_fts MATCH ? LIMIT ?",
        (query, fts_k),
    ).fetchall()
    if not rows:
        return []
    rowids = [r[0] for r in rows]
    ph = ",".join(["?"] * len(rowids))
    vec_rows = con.execute(
        f"SELECT rowid, dim, vec FROM memory_vectors WHERE rowid IN ({ph})",
        rowids,
    ).fetchall()
    if not vec_rows:
        return None
    dims = {r[1] for r in vec_rows}
    if len(dims) != 1:
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
        results.append({
            "path": path,
            "start": int(s),
            "end": int(e),
            "score": float(sims[idx]),
            "snippet": snip,
        })
    return results


def fts_search(con: sqlite3.Connection, query: str, k: int):
    sql = (
        "SELECT path, start_line, end_line, bm25(memory_fts) AS rank, "
        "snippet(memory_fts, 3, '>>', '<<', ' … ', 8) AS snip "
        "FROM memory_fts WHERE memory_fts MATCH ? ORDER BY rank LIMIT ?"
    )
    out = []
    for path, s, e, rank, snip in con.execute(sql, (query, k)):
        out.append({
            "path": path,
            "start": int(s),
            "end": int(e),
            "score": float(rank),
            "snippet": snip,
        })
    return out


def handle_memory_search(args: Dict[str, Any]) -> Dict[str, Any]:
    query = str(args.get("query", "")).strip()
    if not query:
        raise ValueError("Missing 'query'")
    k = int(args.get("k", 8) or 8)
    # Optional: per-call root override (absolute or relative)
    root_arg = args.get("root")
    root_path = None
    if isinstance(root_arg, str) and root_arg.strip():
        root_path = Path(root_arg).expanduser().resolve()
    db_path = resolve_db_path(root_path)
    if not db_path.exists():
        return {
            "results": [],
            "used_vectors": False,
            "note": f"No Workshop DB at '{db_path}'. Run `workshop init` and try again.",
        }
    con = sqlite3.connect(db_path)
    try:
        con.execute("PRAGMA query_only=ON")
        # Ensure FTS index exists; if missing, guide user to build it
        fts_exists = con.execute(
            "SELECT 1 FROM sqlite_master WHERE type='table' AND name='memory_fts'"
        ).fetchone()
        if not fts_exists:
            return {
                "results": [],
                "used_vectors": False,
                "note": (
                    "Local memory index missing (no memory_fts table). "
                    "Run: python3 scripts/memory-index.py index-all --include-out"
                ),
            }
        used_vectors = False
        has_vecs = con.execute(
            "SELECT 1 FROM sqlite_master WHERE type='table' AND name='memory_vectors'"
        ).fetchone()
        if has_vecs:
            vec = try_vector_rerank(con, query, k)
            if vec is not None:
                used_vectors = True
                return {"results": vec, "used_vectors": True}
        # BM25 fallback
        return {"results": fts_search(con, query, k), "used_vectors": used_vectors}
    finally:
        con.close()


# ---------- MCP handlers ----------
def handle_initialize(req_id: Any, params: Dict[str, Any]):
    # Try to capture workspace root from params (best-effort)
    global GLOBAL_ROOT
    root_candidate: Optional[Path] = None
    try:
        # Common fields we might see (varies by client)
        root_uri = params.get("rootUri") or params.get("rootURI")
        if isinstance(root_uri, str) and root_uri.startswith("file://"):
            up = urlparse(root_uri)
            root_candidate = Path(unquote(up.path))
        elif isinstance(params.get("rootPath"), str):
            root_candidate = Path(params["rootPath"]).expanduser()
        else:
            wf = params.get("workspaceFolders")
            if isinstance(wf, list) and wf:
                uri = wf[0].get("uri") if isinstance(wf[0], dict) else None
                if isinstance(uri, str) and uri.startswith("file://"):
                    up = urlparse(uri)
                    root_candidate = Path(unquote(up.path))
        if root_candidate is None:
            # Fallback to PWD if provided
            pwd = os.environ.get("PWD")
            if pwd:
                root_candidate = Path(pwd)
    except Exception:
        root_candidate = None

    if root_candidate is not None:
        try:
            GLOBAL_ROOT = root_candidate.resolve()
        except Exception:
            GLOBAL_ROOT = root_candidate

    capabilities = {
        "capabilities": {
            "tools": {"listChanged": False},
        },
        "serverInfo": {"name": "vibe-memory", "version": "0.1.0"},
    }
    send_message(rpc_result(req_id, capabilities))


def handle_tools_list(req_id: Any):
    tools = [
        {
            "name": "memory.search",
            "description": "Search local memory (SQLite FTS) and return top-k snippets with file spans.",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "k": {"type": "integer", "default": 8},
                },
                "required": ["query"],
            },
        }
    ]
    send_message(rpc_result(req_id, {"tools": tools}))


def handle_tools_call(req_id: Any, params: Dict[str, Any]):
    try:
        name = params.get("name")
        arguments = params.get("arguments") or {}
        if name == "memory.search":
            payload = handle_memory_search(arguments)
            # MCP tool results should be in a content array; use JSON content part
            result = {"content": [{"type": "json", "json": payload}]}
            send_message(rpc_result(req_id, result))
        else:
            send_message(rpc_error(req_id, -32601, f"Unknown tool: {name}"))
    except Exception as e:
        send_message(rpc_error(req_id, -32603, "Tool error", {"message": str(e)}))


def main() -> int:
    # Basic readiness log (disabled for MCP compatibility)
    # MCP servers must not write to stderr during initialization
    # try:
    #     db_path = resolve_db_path()
    #     stderr.write(f"[vibe-memory] starting, initial DB guess: {db_path} (exists={db_path.exists()})\n")
    # except Exception as e:
    #     stderr.write(f"[vibe-memory] starting, resolve error: {e}\n")
    # stderr.flush()
    while True:
        msg = read_message()
        if msg is None:
            break
        method = msg.get("method")
        req_id = msg.get("id")
        params = msg.get("params") or {}

        if method == "initialize":
            handle_initialize(req_id, params)
        elif method == "tools/list":
            handle_tools_list(req_id)
        elif method == "tools/call":
            handle_tools_call(req_id, params)
        elif method in {"shutdown", "exit"}:
            send_message(rpc_result(req_id, {}))
            break
        else:
            # Respond to unknown methods politely
            if req_id is not None:
                send_message(rpc_error(req_id, -32601, f"Unknown method: {method}"))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
