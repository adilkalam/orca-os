#!/usr/bin/env python3
"""
phase-state-delta.py
====================

Delta operations for phase_state.json to prevent context collapse.

Instead of rewriting the entire state file (which causes LLM brevity bias),
this script uses append-only delta operations that can be replayed.

Location: ~/.claude/scripts/phase-state-delta.py

Files:
  .claude/orchestration/phase_state.json      - Current reconstructed state
  .claude/orchestration/phase_deltas.jsonl    - Append-only delta log

Usage:
  # Initialize new pipeline
  python3 phase-state-delta.py init --domain nextjs --request "Add dark mode"

  # Update a field
  python3 phase-state-delta.py set status in_progress
  python3 phase-state-delta.py set current_phase analysis

  # Update nested field (dot notation)
  python3 phase-state-delta.py set phases.analysis.status in_progress
  python3 phase-state-delta.py set phases.analysis.agent frontend-layout-analyzer

  # Append to array
  python3 phase-state-delta.py append gates_passed standards_gate
  python3 phase-state-delta.py append artifacts '{"type":"report","path":"..."}'

  # Record gate result (convenience command)
  python3 phase-state-delta.py gate standards_gate pass --score 92
  python3 phase-state-delta.py gate design_qa_gate fail --score 85 --violations "spacing issue"

  # Complete phase (convenience command)
  python3 phase-state-delta.py complete-phase analysis --agent frontend-layout-analyzer

  # View current state
  python3 phase-state-delta.py show

  # Reconstruct from deltas (recovery)
  python3 phase-state-delta.py reconstruct
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional


# ============================================================
# CONFIGURATION
# ============================================================

def get_project_root() -> Path:
    """Get project root from git or cwd."""
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            capture_output=True, text=True, check=True
        )
        return Path(result.stdout.strip())
    except Exception:
        return Path.cwd()


def get_paths(project_root: Path) -> Dict[str, Path]:
    """Get all relevant paths."""
    orch_dir = project_root / ".claude" / "orchestration"
    return {
        "orch_dir": orch_dir,
        "state_file": orch_dir / "phase_state.json",
        "delta_log": orch_dir / "phase_deltas.jsonl",
    }


# ============================================================
# DELTA OPERATIONS
# ============================================================

class DeltaOp:
    """Delta operation types."""
    INIT = "INIT"           # Initialize new state
    SET = "SET"             # Set a field value
    UPDATE = "UPDATE"       # Update nested field (merge)
    APPEND = "APPEND"       # Append to array
    REMOVE = "REMOVE"       # Remove from array
    CHECKPOINT = "CHECKPOINT"  # Mark a recovery point


def generate_session_id() -> str:
    """Generate a unique session ID."""
    return uuid.uuid4().hex


def timestamp() -> str:
    """ISO timestamp."""
    return datetime.now(tz=__import__('datetime').timezone.utc).isoformat().replace("+00:00", "Z")


def write_delta(delta_log: Path, operation: Dict[str, Any]) -> None:
    """Append a delta operation to the log."""
    delta_log.parent.mkdir(parents=True, exist_ok=True)
    with open(delta_log, "a") as f:
        f.write(json.dumps(operation) + "\n")


def read_deltas(delta_log: Path) -> List[Dict[str, Any]]:
    """Read all deltas from log."""
    if not delta_log.exists():
        return []
    deltas = []
    with open(delta_log, "r") as f:
        for line in f:
            line = line.strip()
            if line:
                deltas.append(json.loads(line))
    return deltas


def set_nested(obj: Dict, path: str, value: Any) -> None:
    """Set a nested value using dot notation."""
    parts = path.split(".")
    for part in parts[:-1]:
        if part not in obj:
            obj[part] = {}
        obj = obj[part]
    obj[parts[-1]] = value


def get_nested(obj: Dict, path: str, default: Any = None) -> Any:
    """Get a nested value using dot notation."""
    parts = path.split(".")
    for part in parts:
        if isinstance(obj, dict) and part in obj:
            obj = obj[part]
        else:
            return default
    return obj


def apply_delta(state: Dict[str, Any], delta: Dict[str, Any]) -> Dict[str, Any]:
    """Apply a single delta operation to state."""
    op = delta.get("op")

    if op == DeltaOp.INIT:
        return delta.get("state", {})

    elif op == DeltaOp.SET:
        path = delta.get("path")
        value = delta.get("value")
        if path:
            set_nested(state, path, value)
            state["updated_at"] = delta.get("timestamp", timestamp())

    elif op == DeltaOp.UPDATE:
        path = delta.get("path")
        updates = delta.get("updates", {})
        if path:
            current = get_nested(state, path, {})
            if isinstance(current, dict):
                current.update(updates)
                set_nested(state, path, current)
        state["updated_at"] = delta.get("timestamp", timestamp())

    elif op == DeltaOp.APPEND:
        path = delta.get("path")
        value = delta.get("value")
        if path:
            current = get_nested(state, path, [])
            if isinstance(current, list):
                current.append(value)
                set_nested(state, path, current)
        state["updated_at"] = delta.get("timestamp", timestamp())

    elif op == DeltaOp.REMOVE:
        path = delta.get("path")
        value = delta.get("value")
        if path:
            current = get_nested(state, path, [])
            if isinstance(current, list) and value in current:
                current.remove(value)
                set_nested(state, path, current)
        state["updated_at"] = delta.get("timestamp", timestamp())

    elif op == DeltaOp.CHECKPOINT:
        # Checkpoints don't modify state, just mark recovery points
        pass

    return state


def reconstruct_state(deltas: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Reconstruct state from delta log."""
    state = {}
    for delta in deltas:
        state = apply_delta(state, delta)
    return state


def write_state(state_file: Path, state: Dict[str, Any]) -> None:
    """Write reconstructed state to file."""
    state_file.parent.mkdir(parents=True, exist_ok=True)
    with open(state_file, "w") as f:
        json.dump(state, f, indent=2)


# ============================================================
# COMMANDS
# ============================================================

def cmd_init(args, paths: Dict[str, Path]) -> int:
    """Initialize a new pipeline state."""
    session_id = generate_session_id()
    ts = timestamp()

    initial_state = {
        "version": "2.1.0",
        "domain": args.domain,
        "session_id": session_id,
        "created_at": ts,
        "updated_at": ts,
        "current_phase": "context_query",
        "status": "initializing",
        "request": {
            "original": args.request,
            "complexity": args.complexity or "medium",
        },
        "phases": {},
        "gates_passed": [],
        "gates_failed": [],
        "artifacts": [],
    }

    delta = {
        "op": DeltaOp.INIT,
        "timestamp": ts,
        "state": initial_state,
    }

    # Clear old delta log for new session
    if paths["delta_log"].exists():
        paths["delta_log"].unlink()

    write_delta(paths["delta_log"], delta)
    write_state(paths["state_file"], initial_state)

    print(f"Initialized pipeline: {session_id}")
    print(f"  Domain: {args.domain}")
    print(f"  Request: {args.request}")
    return 0


def cmd_set(args, paths: Dict[str, Path]) -> int:
    """Set a field value."""
    ts = timestamp()

    # Parse value (try JSON first, then string)
    try:
        value = json.loads(args.value)
    except json.JSONDecodeError:
        value = args.value

    delta = {
        "op": DeltaOp.SET,
        "timestamp": ts,
        "path": args.path,
        "value": value,
    }

    write_delta(paths["delta_log"], delta)

    # Reconstruct and write state
    deltas = read_deltas(paths["delta_log"])
    state = reconstruct_state(deltas)
    write_state(paths["state_file"], state)

    print(f"Set {args.path} = {value}")
    return 0


def cmd_append(args, paths: Dict[str, Path]) -> int:
    """Append to an array field."""
    ts = timestamp()

    # Parse value
    try:
        value = json.loads(args.value)
    except json.JSONDecodeError:
        value = args.value

    delta = {
        "op": DeltaOp.APPEND,
        "timestamp": ts,
        "path": args.path,
        "value": value,
    }

    write_delta(paths["delta_log"], delta)

    # Reconstruct and write state
    deltas = read_deltas(paths["delta_log"])
    state = reconstruct_state(deltas)
    write_state(paths["state_file"], state)

    print(f"Appended to {args.path}")
    return 0


def cmd_gate(args, paths: Dict[str, Path]) -> int:
    """Record a gate result."""
    ts = timestamp()
    deltas_to_write = []

    if args.result == "pass":
        # Append to gates_passed
        deltas_to_write.append({
            "op": DeltaOp.APPEND,
            "timestamp": ts,
            "path": "gates_passed",
            "value": args.gate_name,
        })
    else:
        # Create gate failure object
        failure = {
            "gate": args.gate_name,
            "timestamp": ts,
            "severity": args.severity or "medium",
        }
        if args.score:
            failure["score"] = args.score
            failure["threshold"] = 90
        if args.violations:
            failure["violations"] = args.violations.split(",")

        deltas_to_write.append({
            "op": DeltaOp.APPEND,
            "timestamp": ts,
            "path": "gates_failed",
            "value": failure,
        })

        # Set status to blocked
        deltas_to_write.append({
            "op": DeltaOp.SET,
            "timestamp": ts,
            "path": "status",
            "value": "blocked",
        })

    for delta in deltas_to_write:
        write_delta(paths["delta_log"], delta)

    # Reconstruct and write state
    deltas = read_deltas(paths["delta_log"])
    state = reconstruct_state(deltas)
    write_state(paths["state_file"], state)

    print(f"Gate {args.gate_name}: {args.result}")
    return 0


def cmd_complete_phase(args, paths: Dict[str, Path]) -> int:
    """Mark a phase as complete."""
    ts = timestamp()

    phase_update = {
        "status": "completed",
        "completed_at": ts,
    }
    if args.agent:
        phase_update["agent"] = args.agent
    if args.notes:
        phase_update["notes"] = args.notes

    delta = {
        "op": DeltaOp.UPDATE,
        "timestamp": ts,
        "path": f"phases.{args.phase_name}",
        "updates": phase_update,
    }

    write_delta(paths["delta_log"], delta)

    # Reconstruct and write state
    deltas = read_deltas(paths["delta_log"])
    state = reconstruct_state(deltas)
    write_state(paths["state_file"], state)

    print(f"Completed phase: {args.phase_name}")
    return 0


def cmd_show(args, paths: Dict[str, Path]) -> int:
    """Show current state."""
    if not paths["state_file"].exists():
        print("No phase state found. Run 'init' first.")
        return 1

    with open(paths["state_file"]) as f:
        state = json.load(f)

    if args.json:
        print(json.dumps(state, indent=2))
    else:
        print(f"Session: {state.get('session_id', 'unknown')}")
        print(f"Domain: {state.get('domain', 'unknown')}")
        print(f"Status: {state.get('status', 'unknown')}")
        print(f"Current Phase: {state.get('current_phase', 'unknown')}")
        print(f"Gates Passed: {', '.join(state.get('gates_passed', []))}")
        if state.get('gates_failed'):
            print(f"Gates Failed: {len(state['gates_failed'])}")
        print(f"Artifacts: {len(state.get('artifacts', []))}")

    return 0


def cmd_reconstruct(args, paths: Dict[str, Path]) -> int:
    """Reconstruct state from delta log."""
    deltas = read_deltas(paths["delta_log"])
    if not deltas:
        print("No deltas found.")
        return 1

    state = reconstruct_state(deltas)
    write_state(paths["state_file"], state)

    print(f"Reconstructed state from {len(deltas)} deltas")
    return 0


def cmd_checkpoint(args, paths: Dict[str, Path]) -> int:
    """Create a checkpoint for recovery."""
    ts = timestamp()

    delta = {
        "op": DeltaOp.CHECKPOINT,
        "timestamp": ts,
        "label": args.label or f"checkpoint_{ts}",
    }

    write_delta(paths["delta_log"], delta)
    print(f"Checkpoint created: {delta['label']}")
    return 0


# ============================================================
# MAIN
# ============================================================

def main():
    parser = argparse.ArgumentParser(
        description="Delta operations for phase_state.json"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    # init
    init_p = subparsers.add_parser("init", help="Initialize new pipeline")
    init_p.add_argument("--domain", required=True, help="Domain (nextjs, ios, etc)")
    init_p.add_argument("--request", required=True, help="Original request")
    init_p.add_argument("--complexity", help="simple, medium, complex")

    # set
    set_p = subparsers.add_parser("set", help="Set a field value")
    set_p.add_argument("path", help="Field path (dot notation)")
    set_p.add_argument("value", help="Value (JSON or string)")

    # append
    append_p = subparsers.add_parser("append", help="Append to array")
    append_p.add_argument("path", help="Array field path")
    append_p.add_argument("value", help="Value to append (JSON or string)")

    # gate
    gate_p = subparsers.add_parser("gate", help="Record gate result")
    gate_p.add_argument("gate_name", help="Gate name")
    gate_p.add_argument("result", choices=["pass", "fail"])
    gate_p.add_argument("--score", type=int, help="Numeric score")
    gate_p.add_argument("--violations", help="Comma-separated violations")
    gate_p.add_argument("--severity", help="low, medium, high, critical")

    # complete-phase
    cp_p = subparsers.add_parser("complete-phase", help="Complete a phase")
    cp_p.add_argument("phase_name", help="Phase name")
    cp_p.add_argument("--agent", help="Agent that ran phase")
    cp_p.add_argument("--notes", help="Phase notes")

    # show
    show_p = subparsers.add_parser("show", help="Show current state")
    show_p.add_argument("--json", action="store_true", help="Output as JSON")

    # reconstruct
    subparsers.add_parser("reconstruct", help="Reconstruct from deltas")

    # checkpoint
    ckpt_p = subparsers.add_parser("checkpoint", help="Create recovery checkpoint")
    ckpt_p.add_argument("--label", help="Checkpoint label")

    args = parser.parse_args()
    project_root = get_project_root()
    paths = get_paths(project_root)

    commands = {
        "init": cmd_init,
        "set": cmd_set,
        "append": cmd_append,
        "gate": cmd_gate,
        "complete-phase": cmd_complete_phase,
        "show": cmd_show,
        "reconstruct": cmd_reconstruct,
        "checkpoint": cmd_checkpoint,
    }

    return commands[args.command](args, paths)


if __name__ == "__main__":
    sys.exit(main())
