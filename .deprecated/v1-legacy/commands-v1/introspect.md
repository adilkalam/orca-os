---
description: "Run an introspection pass to predict failure modes and set a risk gate"
allowed-tools: ["Read", "Grep", "Glob", "Bash", "TodoWrite"]
---

# /introspect – Self‑Risk Assessment

Run a fast introspection on the current plan/answer to predict likely failure modes before writing code. Emit tags, a numeric risk score (0.00–1.00), and recommended next actions.

## What to Introspect

- Prefer the most recent plan or assistant answer relevant to $ARGUMENTS
- If unclear, ask the user to confirm the target (plan vs. answer)

## Produce This Output

- Risk score (0.00–1.00)
- Tags (use these when applicable):
  - `#COMPLETION_DRIVE`, `#CARGO_CULT`, `#CONTEXT_DEGRADED`, `#PATH_DECISION`, `#POISON_PATH`, `#RESOLUTION_PRESSURE`
- Short rationale (3–5 bullets)
- Gate decision:
  - `proceed` when risk < 0.30
  - `review` when 0.30 ≤ risk < 0.45 (ask one clarifying question or tighten plan)
  - `gate` when risk ≥ 0.45 (switch to `/response-awareness-plan` before any writes)

## Log the Result

- Append structured JSON to `.orchestration/logs/introspection.jsonl` so hooks and dashboards can act on it.
- Use the helper script to avoid escaping issues:

```bash
Bash(python3 scripts/log_introspection.py \
  --risk 0.42 \
  --summary "risk rationale one-liner" \
  --flag COMPLETION_DRIVE --flag PATH_DECISION)
```

The logger creates the directory if needed and appends a single JSON line with timestamp, risk, flags, and summary.

## Next Actions by Gate

- `proceed`: Continue; call tools as planned
- `review`: Ask 1–2 clarifying questions; adjust plan; re‑introspect if changed materially
- `gate`: Run `/response-awareness-plan` and wait for approval; only then proceed to implementation

## Notes

- Keep the assessment crisp (<= 8 lines plus tags)
- Prefer under‑confident errs when ambiguity is high; let verification close gaps

