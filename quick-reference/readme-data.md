/opt/homebrew/Library/Homebrew/cmd/shellenv.sh: line 18: /bin/ps: Operation not permitted
# OS 2.4 Data Lane Readme

**Lane:** Data / Analysis  
**Domain:** `data`  
**Entrypoints:** `/plan`, `/orca`, `/project-memory`, `/project-code`

The data lane handles data analysis and related tasks as described in:

- `docs/pipelines/data-pipeline.md`

It generally uses data‑specific agents under `agents/data/`.

---

## 1. When to Use the Data Lane

Use for:

- Data exploration
- Analysis scripts
- Reporting and insight generation

See `docs/pipelines/data-pipeline.md` for detailed phases.

---

## 2. Commands, Agents, Skills, Memory

- Use `/plan` for complex analyses or multi‑step pipelines.
- Use `/orca` to route requests to the data pipeline.
- Agents:
  - `agents/data/competitive-analyst.md`
  - `agents/data/data-researcher.md`
  - `agents/data/python-analytics-expert.md`
  - `agents/data/research-specialist.md`
- Memory:
  - `/project-memory` for decisions, `/project-code` for code indexing.

Refer to the Next.js/iOS readmes for a more detailed pattern; the same
concepts (specs, RA, memory, gates) can be extended here as needed.
