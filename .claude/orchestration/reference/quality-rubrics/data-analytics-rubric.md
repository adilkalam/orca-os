# Data & Analytics Quality Rubric - OS 2.0

**Domain:** Data / Analytics  
**Version:** 1.0  
**Last Updated:** 2025-11-20

---

## Scoring Overview

**Total Score:** 0–100 points across 4 dimensions (25 points each)

**Scoring Interpretation:**
- **90–100:** Excellent – Production-ready analysis, strong data foundations.
- **75–89:** Good – Useful, with minor improvements needed.
- **60–74:** Fair – Significant gaps; proceed only with caution.
- **0–59:** Poor – Not reliable enough to use.

Use this rubric to evaluate work produced through the **data/analytics lane**
and agents such as:
- `research-specialist`
- `data-researcher`
- `python-analytics-expert`

Alongside:
- `DATA_ENGINEERING_AND_ANALYTICS_BEST_PRACTICES.md`  
  (`_explore/orchestration_repositories/claude_code_agent_farm-main/claude_code_agent_farm-main/best_practices_guides/DATA_ENGINEERING_AND_ANALYTICS_BEST_PRACTICES.md`)

---

## Dimension 1: Data Foundations & Quality (0–25 points)

### 1.1 Data Inventory & Lineage (0–10)

**Excellent (9–10):**
- All key data sources are identified and documented.
- Lineage from raw → transformed → outputs is clear.
- Ownership and refresh cadence of each source are known.

**Good (7–8):**
- Most sources documented; lineage mostly clear.
- Some minor gaps in ownership/refresh detail.

**Fair (5–6):**
- Key sources used but documentation/lineage is patchy.

**Poor (0–4):**
- Unclear where data comes from; ad-hoc copying/joins.

### 1.2 Data Quality & Fitness (0–15)

**Excellent (13–15):**
- Completeness and accuracy assessed and documented.
- Obvious issues (duplicates, missing keys) handled.
- Clear statements of caveats/limits (e.g. short time window).

**Good (10–12):**
- Basic quality checks done; a few caveats not fully explored.

**Fair (6–9):**
- Only superficial checks; some unchecked risks.

**Poor (0–5):**
- No explicit quality assessment; many assumptions.

---

## Dimension 2: Analysis Rigor & Methods (0–25 points)

### 2.1 Methodology & Question Fit (0–10)

**Excellent (9–10):**
- Analysis directly answers the stated question(s).
- Methods are appropriate to data size/shape and decision context.
- Assumptions are explicit; limitations called out.

**Good (7–8):**
- Methods mostly appropriate; some loose ends.

**Fair (5–6):**
- Methods partially misaligned with question or data constraints.

**Poor (0–4):**
- Methods unclear or inappropriate; “chart fishing”.

### 2.2 Statistical Soundness / Robustness (0–15)

**Excellent (13–15):**
- Basic statistics are correct (aggregations, rates, distributions).
- Comparisons/tests are reasonably robust (e.g. avoid over-interpreting tiny Ns).
- Time windows, cohorts, and segments are treated consistently.

**Good (10–12):**
- Mostly sound; minor over-interpretation or missing checks.

**Fair (6–9):**
- Several questionable conclusions or missing sanity checks.

**Poor (0–5):**
- Errors, misinterpretations, or unjustified strong claims.

---

## Dimension 3: Implementation & Reproducibility (0–25 points)

### 3.1 Code & Pipeline Quality (0–12)

**Excellent (11–12):**
- Python/SQL code is clear, modular, and aligned with best practices:
  - Vectorized operations where appropriate.
  - Clear handling of missing data and types.
  - No obvious anti-patterns (N+1 queries, huge in-memory joins without need).
- Code matches the project’s architecture (e.g. bronze/silver/gold layers).

**Good (8–10):**
- Generally solid; some opportunities for performance or clarity improvements.

**Fair (5–7):**
- Works but fragile, or hard to maintain/extend.

**Poor (0–4):**
- Ad-hoc scripts, unclear invariants, hidden side effects.

### 3.2 Reproducibility & Automation (0–13)

**Excellent (11–13):**
- Analysis is reproducible:
  - Clear entrypoint (script/notebook) and parameters.
  - Versioned code and data assumptions.
  - Steps documented so another engineer can rerun.
- For recurring tasks, there is a clear path to automation (or already automated).

**Good (8–10):**
- Mostly reproducible, minor manual glue or unclear setup.

**Fair (5–7):**
- Re-running requires guesswork or manual recreation.

**Poor (0–4):**
- One-off, non-repeatable, no documented path to re-run.

---

## Dimension 4: Communication & Business Impact (0–25 points)

### 4.1 Clarity & Structure (0–12)

**Excellent (11–12):**
- Findings are organized and labeled:
  - Clear question statement.
  - Key findings summarised in bullets.
  - Supporting tables/plots well labeled.
- Non-technical stakeholders can follow the logic.

**Good (8–10):**
- Mostly clear; minor jargon or structural issues.

**Fair (5–7):**
- Useful content but difficult to parse or follow.

**Poor (0–4):**
- Unstructured dumps; unclear what was learned.

### 4.2 Actionability & Alignment (0–13)

**Excellent (11–13):**
- Recommendations are concrete and tied to:
  - The original question.
  - Project/brand/product goals.
- Explicitly links analysis to decisions, risks, and next steps.

**Good (8–10):**
- Some actionable guidance; a few leaps left for stakeholders.

**Fair (5–7):**
- Interesting observations, but weak or generic recommendations.

**Poor (0–4):**
- No clear path from analysis to action.

---

## Gate Thresholds

**Gate Status by Score:**

| Score  | Status   | Action                                           |
|--------|----------|--------------------------------------------------|
| 90–100 | ✅ PASS  | Excellent – safe for production decisions        |
| 75–89  | ⚠️ CAUTION | Good – use, but address noted gaps              |
| 60–74  | 🔴 FAIL | Significant issues – refine before relying fully |
| 0–59   | 🚫 BLOCK | Do not rely; revisit data and methods           |

**Critical Issues (Automatic FAIL/BLOCK):**
- Unsound methods leading to misleading conclusions.
- Major data-quality issues left unacknowledged.
- Non-reproducible analyses that are supposed to be operational.

---

## Example Scoring Snapshot

**Scenario:** Data lane used to analyze churn drivers for a subscription product.

- Data Foundations: 21/25
  - Strong source inventory; some ambiguity on one legacy table.
- Analysis Rigor: 22/25
  - Solid cohort and regression analysis; some small Ns called out.
- Implementation & Reproducibility: 19/25
  - Python/pandas code is clean; notebook is reproducible but not yet in a pipeline.
- Communication & Impact: 23/25
  - Clear slides + summary; recommendations tied directly to pricing/UX changes.

**Total:** 85/100 → **CAUTION** (good but should pipeline key analyses and tighten source docs).

