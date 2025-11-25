# SEO-ORCA (Architecture Overview, Updated 2025-11-19)

> Status: **OS 2.2 SEO lane architecture.**  
> Canonical behavior is now specified in:
> - `docs/pipelines/seo-pipeline.md` (phase definitions)
> - `docs/reference/phase-configs/seo-phases.yaml` (phase config + gates)
> - `commands/seo-orca.md` (command-level orchestration)
>
> This document describes the architectural intent and historical evolution of
> the SEO orchestration stack.

Elite SEO orchestration that mirrors our iOS and data-analysis stacks: a deterministic research pipeline feeds a dedicated agent team, all mediated through ORCA's confirmation gate. The system produces **long-form sophisticated content** with natural clarity—matching manually-crafted gold standards through deep knowledge graph integration, external research citations, and automated clarity quality gates.

**What makes this special:** Most AI content automation treats research as snippets. We read complete source files (10-40KB each), extract relevant prose with relevance scoring, load external research papers with DOIs, and verify output passes communication clarity thresholds. The result: content that teaches complex peptide science with conversational authority—biohackers and fitness enthusiasts can understand dual-axis metabolic frameworks without a PhD.

---

## Key Features (Phase 1-4 Implementation)

### 🔬 Deep Knowledge Graph Reading
**Not just excerpts—complete source files.** The pipeline reads full markdown files (10-40KB) from your knowledge graph, parses them into sections, scores relevance to each outline heading, and extracts prose that directly supports the narrative. No more placeholder text or generic filler.

### 📚 External Research Citations
**E-E-A-T validation with real papers.** Research papers are indexed by topic and compound (`/docs/research/index.json`). The system automatically loads relevant studies (NEJM, Nature Medicine, Cell Metabolism, etc.), formats proper citations with DOIs, and separates them from internal KG evidence. Google sees authoritative sources; readers get verifiable claims.

### 💡 Communication Clarity Heuristics
**"Simplicity is the ultimate sophistication."** The draft writer knows how to teach complex concepts with natural analogies ("think of it like three dials on your metabolism"), explain jargon inline with functional meaning ("AMPK—the cell's energy sensor that triggers fat breakdown"), and pass the "gym buddy test" (can the reader explain this concept without looking up terms?).

### ✅ Automated Clarity Quality Gates
**70+ clarity score required to pass.** Before completion, the Quality Guardian runs `seo_clarity_gates.py` to detect unexplained jargon (50+ peptide/medical terms tracked), verify natural analogies are present, check sentence length (15-20 words ideal), and calculate an overall clarity score. Content that scores <70 gets flagged with specific recommendations.

### 🎯 Gold Standard Output
**Matches manually-crafted v4 quality.** Through iterative testing, we produced a 3,240-word gold standard article on "Retatrutide Recomp Lean Mass" that scored 80+/100. All lessons from that manual process (citation architecture, analogy usage, jargon management, audience understanding) are now encoded in the automated pipeline.

---

## Architecture Overview

```
Keyword / Brief Idea
        │
        ▼
┌───────────────────────────┐
│  `/seo-orca` (slash cmd)  │  ← ORCA prompts for inputs & confirms team
└─────────────┬─────────────┘
              │
              ▼
┌────────────────────────────────────────────┐
│  Specialist Pod (in execution order)       │
│  1. seo-research-specialist                │
│     • runs python pipeline                 │
│     • merges SERP + curated research + KG  │
│     • exports report / brief / draft       │
│                                             │
│  2. seo-brief-strategist                   │
│     • refines brief.md with marketing play │
│                                             │
│  3. seo-draft-writer                       │
│     • generates draft.md (LLM or heuristic)│
│                                             │
│  4. seo-quality-guardian                   │
│     • audits brief + draft, writes qa.md   │
└─────────────┬──────────────────────────────┘
              │
              ▼
┌──────────────────────────────┐
│  Human Review & Publishing   │
│  • check QA notes & TODOs    │
│  • edit draft, add citations │
│  • publish / schedule        │
└──────────────────────────────┘
```

Outputs land in `outputs/seo/<slug>-{report|brief|draft|qa}.(json|md)`.

---

## Quick Start

### The ORCA way (recommended)
Inside Claude Code run:

```bash
/seo-orca
```

When prompted, provide:
- **Primary keyword** (e.g., `Semax Selank ADHD`)
- **Research docs** (one or more paths such as `/Users/adilkalam/Desktop/OBDN/obdn_site/docs/semax-selank.md`)
- **Knowledge graph JSON** (default: `/Users/adilkalam/Desktop/OBDN/obdn_site/docs/meta/kg.json`)
- **Knowledge root directory** (default: `/Users/adilkalam/Desktop/OBDN/obdn_site`)
- **Extra focus terms** (`anxiety`, `neuroprotective`, etc.)

ORCA will propose the specialist team, you confirm, and the workflow executes automatically.

### Manual fallback (no ORCA)

These pipelines originally supported direct CLI invocation (e.g. via
`seo_auto_pipeline.py`) for debugging or manual runs. In OS 2.2, the preferred
entrypoint is the `/seo-orca` command plus the SEO pipeline specification, but
CLI-only workflows can still be used as implementation details when needed.

---

## Specialist Team

| Agent | Responsibilities | Key references |
|-------|-----------------|----------------|
| **seo-research-specialist** | Runs `seo_auto_pipeline.py`, merges SERP + curated research + KG, writes report/brief/draft files | `AI Content Research and SEO on Auto-Pilot with n8n.txt`, `seo-content-planner`, KG docs |
| **seo-brief-strategist** | Polishes `*-brief.md` (outline, angles, compliance) | `seo-content-planner`, `seo-keyword-strategist`, `seo-meta-optimizer`, `seo-authority-builder` |
| **seo-draft-writer** | Generates review-ready Markdown draft with inline citations/TODOs | `seo-content-writer`, knowledge graph evidence |
| **seo-quality-guardian** | Audits brief + draft (keywords, E‑E‑A‑T, freshness), logs findings in `*-qa.md` | `seo-content-auditor`, `seo-content-refresher`, `seo-authority-builder` |

All instructions live in `agents/specialists/seo-*.md`.

---

## Outputs & Locations

After a successful run you’ll find:

| File | Purpose |
|------|---------|
| `outputs/seo/<slug>-report.json` | Full research pack (SERP summaries, insights, KG data, raw brief data) |
| `outputs/seo/<slug>-brief.json` | Structured brief for downstream tooling |
| `outputs/seo/<slug>-brief.md` | Human-friendly brief (drop into Obsidian or share with partner) |
| `outputs/seo/<slug>-draft.md` | First-pass article draft (LLM or heuristic fallback) |
| `outputs/seo/<slug>-qa.md` | QA summary & outstanding TODOs from the quality guardian |

LLM quotas: if OpenAI/Anthropic APIs are unavailable, the pipeline automatically falls back to heuristic summaries/drafts so automation never fails silently—the QA file will note the fallback.

---

## Human Responsibilities

1. **Review QA notes & TODOs** – fix flagged sections, validate claims, add missing citations.
2. **Edit the draft** – ensure tone, POV, and compliance match brand standards.
3. **Publish** – once satisfied, move the article into your CMS/Obsidian workflow, schedule social promos, etc.

Optional: record key decisions in Workshop (`/memory-search`, `/memory-learn`) so the system remembers learnings for future runs.

---

## Recent Improvements (2025-11-07)

### ✅ Phase 1: Research Paper Index
- Created searchable research index at `/Users/adilkalam/Desktop/OBDN/obdn_site/docs/research/index.json`
- Indexed 7 research papers with DOIs, authors, journals, key findings
- Topic index (`ampk`, `body_recomposition`) and compound index (`retatrutide`, `mots-c`)

### ✅ Phase 2: Deep KG File Reading
- New module: `scripts/seo_kg_deep_reader.py` (10KB)
- Reads complete markdown source files with relevance scoring
- Integrated into `seo_auto_pipeline.py` at `select_relevant_sections()`
- Automatic external research citation loading

### ✅ Phase 3: Communication Heuristics
- Draft writer updated with v4 clarity principles
- "Gym buddy test" - concepts explained without jargon lookup
- Natural analogies ("three dials", "two bank accounts")
- Inline jargon explanation with functional/biological meaning
- Gold-standard v4 examples in agent prompt

### ✅ Phase 4: Clarity Quality Gates
- New script: `scripts/seo_clarity_gates.py` (11KB)
- Automated jargon detection (50+ peptide/medical terms)
- Analogy presence verification
- Clarity scoring (70+ to pass)
- Integrated into Quality Guardian workflow

**Impact:** Automated output now matches manual gold standard quality (3,000+ words, 70-80/100 score).

---

## Roadmap / Future Enhancements
- ~~Add MCP integrations (Ahrefs, GSC)~~ ✅ Ahrefs MCP integrated for SERP intelligence
- Swap DuckDuckGo with a Google SERP provider (SerpAPI or Bright Data) for richer SERP data
- Hook the QA summary into validation checklist (Notion/Obsidian template)
- Build "refresh" mode that reruns workflow for existing pieces and compares deltas
- Add A/B testing framework for headline variations
- Integrate GSC MCP for historical performance data

---

## References
- `_explore/_AGENTS/marketing-SEO/*`  
- `_explore/_AGENTS/marketing-SEO/AI Content Research and SEO on Auto-Pilot with n8n.txt`  
- `_explore/_AGENTS/marketing-SEO/Ship-Learn-Next Plan - Build AI Content Automation System.md`  
- Knowledge graph: `/Users/adilkalam/Desktop/OBDN/obdn_site/docs/meta/kg.json`
