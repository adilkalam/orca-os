# Data & Analytics – OS 2.2 Overview

This doc is the **entrypoint** for the data/analytics pipeline in OS 2.2.

Use it when your task is primarily about **data understanding, analysis, or
decision support**, rather than UI implementation or SEO/content.

---

## What Lives Where

- **Pipeline spec:**  
  - `docs/pipelines/data-pipeline.md` – phases, agents, gates, artifacts.

- **Phase config:**  
  - `docs/reference/phase-configs/data-phases.yaml` – machine-readable phase
    definitions for `/orca` and agents.

- **Quality rubric:**  
  - `.claude/orchestration/reference/quality-rubrics/data-analytics-rubric.md`
    – 0–100 scoring across:
    - Data foundations & quality
    - Analysis rigor & methods
    - Implementation & reproducibility
    - Communication & business impact

- **Core agents:**  
  - `agents/data-researcher.md` – scoping, inventory, quality assessment.  
  - `agents/research-specialist.md` – cross-domain research, analysis, synthesis.  
  - `agents/python-analytics-expert.md` – Python-side implementation
    (NumPy/pandas/PyTorch, pipelines, scripts/notebooks).

- **Best-practices reference:**  
  - `_explore/orchestration_repositories/claude_code_agent_farm-main/claude_code_agent_farm-main/best_practices_guides/DATA_ENGINEERING_AND_ANALYTICS_BEST_PRACTICES.md`
    – modern lakehouse, medallion, streaming/ETL, maintenance, and cost-aware
      patterns.

---

## How to Use the Data Pipeline

For a data/analytics task:

1. **Start with `/orca`**
   - It will:
     - Run the mandatory context query (`domain: "data"`).
     - Confirm questions/decisions and constraints via Q&A.
     - Propose a plan (phases + agents).

2. **Let the pipeline run**
   - `data-researcher` scopes questions and inventories data.
   - `research-specialist` designs the analysis plan and later synthesizes findings.
   - `python-analytics-expert` implements code when needed.

3. **Check quality**
   - The verification phase scores the work against the data analytics rubric.
   - `/orca` hands you:
     - A findings report.
     - A summary brief.
     - A quality score and gate status (PASS/CAUTION/FAIL/BLOCK).

4. **Decide next steps**
   - Use the brief + quality score to:
     - Make your decision, or
     - Request a refinement pass (e.g., more data, stronger implementation, clearer storytelling).

The goal of this pipeline is to make data work **systematic, reproducible, and
decision-ready**, not a series of one-off notebooks.***
