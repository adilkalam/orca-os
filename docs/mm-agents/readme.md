# MM Agents — Phases & Scope

This document outlines the planned brand agents, what they do, how they’re triggered, and where outputs live.

## Phase I — Live

- mm-copy (Copywriter)
  - Purpose: Produce brand‑calibrated prospecting/retargeting ad copy grounded in MM voice and FW25 items.
  - Triggers: `/mm-copy`
  - Inputs: minisite/data/brand, minisite/data/meta-api/ad-copy, About page; product details (FW25 bustier dress, organza edit, faux fur coat).
  - Outputs: `.orchestration/evidence/mm-copy/*.md` for variants; shareable copies in `minisite/orca-docs/`.
  - Notes: No editorial quotes in ads; craft → benefit clarity; first 6 words focus for prospecting.

- mm-comps (Market Researcher / Competitor Dossiers)
  - Purpose: Build competitor profiles (press search, collection reviews, e‑comm visuals, PDP price ladders).
  - Triggers: `/mm-comps`
  - Inputs: minisite/minisite-v1/competitors, minisite/data/competitors, press (Vogue, WWD), official sites/retailers.
  - Outputs: `minisite/data/competitors/brand-*.md`; supporting evidence under `.orchestration/evidence/competitors/<brand>/`.
  - Initial targets: Khaite; one emerging (e.g., Cecilie Bahnsen) for pilot before expanding.

## Phase II — Next

- mm-visual-auditor (Visual QA)
  - Purpose: Ingest lookbooks/PDP/editorial assets; assess against design DNA and performance heuristics; flag gaps and opportunities.
  - Inputs: Brand and competitor visuals; internal design DNA docs.
  - Outputs: Audit reports + checklists; recommended content briefs.

- mm-merchandising-specialist (Assortment + Pricing)
  - Purpose: Support seasonal assortment selection and pricing strategy; propose content priorities by SKU group.
  - Inputs: Historical orders/journey data, assortment models, competitor ladders.
  - Outputs: Seasonal buy plans, price ladders, content shoot pre‑plans.

## Phase III — Later

- mm-accessories-optimizer
  - Purpose: Quantify stockout loss from inventory + journey data; propose buy plan with creative/channel split.

- mm-uniform-decision-analyst
  - Purpose: Transform vs exit scenarios using UNIFORM rows from mm-index + journey + orders; decision memo with assumptions and sensitivity.

## Data & Evidence Conventions

- Control + Evidence (required for gates)
  - `.orchestration/` for control files (implementation log, verification reports)
  - `.orchestration/evidence/` for screenshots, logs, extracted artifacts
- Shareable docs (human‑facing)
  - `minisite/orca-docs/` for session bundles
  - `minisite/data/` for brand/competitor reports
- Verification
  - Use `scripts/capture-*.sh` helpers, then `bash scripts/finalize.sh` to score and write `.verified`
  - Required tags in `.orchestration/implementation-log.md` (e.g., `#FILE_CREATED`, `#SCREENSHOT_CLAIMED`)

## Current Outputs (Starter Set)

- Brand communication note: `minisite/orca-docs/brand-communication.md`
- FW25 press scan (themes + quotes with links): `minisite/orca-docs/mm-fw25-press.md`
- FW25 ad copy variants (10 each): bustier, organza, faux fur — in `minisite/orca-docs/`

## Slash Commands (Related)

- `/mm-copy` — Copywriter
- `/mm-comps` — Competitor dossiers (press + collection reviews)
- `/respawr`, `/respawr-plan`, `/respawr-build` — Plan/implement with evidence
- `/enhance -clarify` — Fast clarify → structure
- `/mode -on` / `/mode -off` — Verification gates
- `/cleanup` — Safe organize + tidy (non‑destructive)

