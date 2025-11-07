---
description: "Run the full SEO research → brief → draft workflow with our specialist agent team."
allowed-tools: ["AskUserQuestion", "Task", "Read", "Write", "Bash", "MultiEdit"]
---

# /seo-orca — SEO Content Automation

Kick off an end-to-end SEO workflow that mirrors the “Semax & Selank” automation, using our dedicated specialists.

## Inputs to Gather
- **Primary keyword/topic** (e.g., “Semax and Selank for ADHD & Anxiety”)
- **Curated research docs** (paths to markdown/notes already assembled)
- **Knowledge graph JSON** (default: `/Users/adilkalam/Desktop/OBDN/obdn_site/docs/meta/kg.json`)
- **Knowledge root directory** (default: `/Users/adilkalam/Desktop/OBDN/obdn_site`)
- **Extra focus terms** (conditions, entities, etc.)
- Optional: skip SERP scrape by using `--max-results 0` (if only internal research is desired)

Ask the user for missing values before continuing.

## Team & Order
1. **seo-research-specialist** – runs `scripts/seo_auto_pipeline.py` with `--draft`, collects report/brief/draft paths.
2. **seo-brief-strategist** – refines `*-brief.md` using marketing playbooks.
3. **seo-draft-writer** – produces/updates `*-draft.md` (uses fallback output if already present).
4. **seo-quality-guardian** – audits brief + draft, writes QA summary (`*-qa.md`), highlights TODOs.

When ORCA proposes other agents, trim back to these core roles plus any essential orchestrator/verification roles.

## Execution Steps
1. Confirm inputs with the user. Echo the final command that will be run.
2. Dispatch **seo-research-specialist** to execute:
   ```bash
   python3 scripts/seo_auto_pipeline.py "<KEYWORD>" \
     --research-doc <DOC_PATH> \
     --knowledge-graph <KG_PATH> \
     --knowledge-root <KG_ROOT> \
     --focus-term <TERM> \
     --draft
   ```
   Include `--research-doc` and `--focus-term` multiple times if needed.
3. Pass generated file paths to the brief strategist and ensure they work in-place (no manual copying).
4. After the draft writer finishes, confirm `outputs/seo/<slug>-draft.md` exists.
5. Have the quality guardian review everything and save `*-qa.md`.

## Deliverables to User
- Absolute paths to report, brief (JSON + Markdown), draft, QA summary.
- High-level synopsis (1–2 paragraphs) of notable findings/issues.
- Outstanding TODOs or human review points (medical review, missing citations, etc.).

## Phase 1-4 Improvements (2025-11-07)

**Phase 1: Research Paper Index**
- External research papers now indexed at `/Users/adilkalam/Desktop/OBDN/obdn_site/docs/research/index.json`
- Papers organized by topic and compound for E-E-A-T citations
- Format: JSON with DOIs, authors, journals, key findings

**Phase 2: Deep KG Reading**
- Pipeline now reads FULL KG source files (not just 200-char excerpts)
- New module: `scripts/seo_kg_deep_reader.py`
- Extracts complete prose from markdown files with relevance scoring
- Loads external research citations automatically

**Phase 3: Communication Heuristics**
- Draft writer updated with v4 clarity principles
- "Gym buddy test" - can concepts be explained without jargon?
- Natural analogies integrated ("three dials", "two bank accounts")
- Jargon explained inline with functional/biological meaning
- Gold-standard v4 examples included in agent prompt

**Phase 4: Clarity Quality Gates**
- New script: `scripts/seo_clarity_gates.py`
- Automated jargon detection and analogy checking
- Clarity scoring (70+ required to pass)
- Quality Guardian runs clarity gates automatically

**Impact:** These improvements enable production of 3,000+ word sophisticated content with v4 clarity quality, matching manually-crafted gold standard output.

## Non-Negotiables
- Never skip team confirmation (Phase 3).
- Do not alter generated files outside the designated output directory.
- Surface warnings from the pipeline (403/429, heuristic fallbacks) in the final response.
- Quality Guardian MUST run clarity gates on draft before completion.
