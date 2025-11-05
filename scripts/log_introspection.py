#!/usr/bin/env python3
import argparse
import json
import os
from datetime import datetime
from pathlib import Path


def main() -> int:
    ap = argparse.ArgumentParser(description="Append an introspection JSONL record")
    ap.add_argument("--risk", type=float, required=True)
    ap.add_argument("--summary", type=str, default="")
    ap.add_argument("--flag", action="append", dest="flags", default=[])
    ap.add_argument("--subject", type=str, default="")
    args = ap.parse_args()

    root = Path(os.getcwd())
    out_dir = root / ".orchestration" / "logs"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "introspection.jsonl"

    rec = {
        "ts": datetime.utcnow().isoformat() + "Z",
        "risk": round(float(args.risk), 4),
        "flags": list(args.flags or []),
        "summary": args.summary,
        "subject": args.subject,
    }
    with out_path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")
    print(f"Logged introspection to {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

