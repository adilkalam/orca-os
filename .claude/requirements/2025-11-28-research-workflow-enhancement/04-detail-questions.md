# Detail Questions – Research Workflow Enhancement

These questions address specific implementation choices.

---

## Q1: What should the default time budget be when `--time` is not specified?

Options:
- **Unlimited (no cap)** – rely solely on iteration limit (max 7)
- **10 minutes** – generous default with time awareness
- **5 minutes** – matches Open Deep Research's approach

- **Default: Unlimited** – iteration cap provides sufficient control without time pressure.
- **Why:** Time pressure may cause premature synthesis; iteration cap is less disruptive.

---

## Q2: Should the lead agent calculate remaining time itself, or should the orchestrator track it?

Options:
- **Orchestrator tracks** – `/research` command calculates and passes remaining time to lead agent each iteration
- **Lead agent tracks** – Lead agent receives start time + budget, calculates remaining itself

- **Default: Lead agent tracks** – Simpler architecture; lead agent has full context.
- **Why:** Fewer handoffs, lead agent can make time-aware decisions mid-iteration.

---

## Q3: Should the iteration cap (max depth) be configurable per-request, or fixed?

Options:
- **Fixed at 7** – matches Open Deep Research, prevents runaway loops
- **Configurable via flag** – e.g., `--iterations 3` for quick research
- **Mode-based** – standard mode = 3, deep mode = 7

- **Default: Mode-based** – standard = 3, deep = 7.
- **Why:** Deep research justifies more iterations; standard should be faster.

---

## Q4: Where should the structured loop decision JSON be stored?

Options:
- **In phase_state.json under gap_analysis** – replaces current free-form decision
- **Separate file per iteration** – `.claude/research/iterations/loop-decision-N.json`
- **Inline in lead agent output** – returned to orchestrator, not persisted

- **Default: In phase_state.json** – consistent with other phase data.
- **Why:** Single source of truth; auditable via phase state.

---

## Q5: Should we add a `--quick` flag as shorthand for `--time 5 --iterations 3`?

Options:
- **Yes** – convenient for fast lookups
- **No** – `--time` and mode flags are sufficient

- **Default: Yes** – UX improvement for common case.
- **Why:** Many research queries are quick lookups; explicit shorthand is clearer than remembering flag combos.
