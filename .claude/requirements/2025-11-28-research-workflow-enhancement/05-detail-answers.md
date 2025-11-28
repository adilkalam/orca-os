# Detail Answers – Research Workflow Enhancement

---

## Q1: Default Time Budget
**Answer:** 5 minutes

Default time budget when `--time` is not specified:
- 5 minutes total
- ~3.5 minutes for research
- ~1.5 minutes reserved for synthesis

Can be overridden with `--time 10` or `--time unlimited`.

---

## Q2: Time Tracking
**Answer:** Lead agent tracks (default recommendation accepted)

Lead agent receives `start_time` + `time_budget_minutes` and calculates remaining time itself.

---

## Q3: Iteration Cap
**Answer:** Mode-based

| Mode | Max Iterations |
|------|---------------|
| Standard (default) | 3 |
| Deep (`--deep`) | 7 |

---

## Q4: Loop Decision Storage
**Answer:** In phase_state.json (default recommendation accepted)

Structured loop decision stored under `phase_state.research.gap_analysis.loop_decision`.

---

## Q5: Quick Flag
**Answer:** No

No `--quick` shorthand. Users can specify `--time 5` directly if needed.

---

## Final Flag Structure

```
/research [--deep] [--time N] <question>

--deep     → long-form academic report, 7 max iterations
--time N   → time budget in minutes (default: 5, use "unlimited" for no cap)
```

Examples:
- `/research What is the current state of AI agents?` → 5 min, 3 iterations
- `/research --deep What is the current state of AI agents?` → 5 min, 7 iterations
- `/research --time 10 --deep What is the current state of AI agents?` → 10 min, 7 iterations
- `/research --time unlimited What is X?` → no time limit, 3 iterations
