# KG Research Pipeline (OBDN)

**Status:** OS 2.4 Pipeline (KG Research)
**Last Updated:** 2025-11-27
**Project:** OBDN (`/Users/adilkalam/Desktop/OBDN/obdn_site`)

---

## Overview

The KG Research pipeline handles research questions in the OBDN domain where
the Knowledge Graph (`docs/meta/kg.json`) is the primary evidence source.

It extends the standard Research pipeline with:

- **KG-first evidence gathering** – mechanism paths, node neighbors, topic briefs
- **Mechanism path reasoning** – peptide → mechanism → axis → condition
- **KG outline templates** – structured sections from node types
- **Hybrid evidence** – KG primary, web fallback for gaps

The goal is to produce **mechanistically grounded, KG-cited research outputs**
that leverage OBDN's structured knowledge.

---

## Scope & Domain

### KG-Eligible Questions (use `/kg`)

- Peptide mechanisms: "How does X work?"
- Protocol design: "What's in protocol Y?"
- Axis relationships: "Which peptides support axis A?"
- Synergies: "Why do X and Y synergize?"
- Conditions: "What addresses condition Z?"

### Web-First Questions (use `/research`)

- General AI/tech topics
- Market analysis, pricing
- Topics outside OBDN domain
- Questions with no KG node matches

### Hybrid Questions

Some questions need both:
- "How does BPC-157 work, and what do clinical trials show?"
- KG for mechanism, web for trials

---

## Entry Point

```
/kg "question"           # Standard mode
/kg --deep "question"    # Deep mode (comprehensive)
```

The `/kg` command:
1. Checks KG eligibility via `kg-brief.mjs topic`
2. Sets `kg_mode: true` if KG has relevant nodes
3. Delegates to `kg-lead-agent`

---

## Pipeline Architecture

```
Request (OBDN research question)
    ↓
/kg (standard or --deep)
    ↓
[Phase 0: KG Eligibility Check]     ← kg-brief.mjs topic
    ↓
[Phase 1: Scoping]                  ← clarify scope, classify complexity
    ↓
[Phase 2: Research Plan]            ← kg-lead-agent plans KG vs web tracks
    ↓
[Phase 3: KG Evidence Gathering]    ← kg-query-subagent, kg-mechanism-subagent
    ↓
[Phase 3.5: Web Evidence (gaps)]    ← research-web-search-subagent
    ↓
[Phase 4: Synthesis]                ← kg-lead-agent
    ↓
[Phase 5: Report Draft]             ← kg-answer-writer
    ↓
[Phase 6: Citation Gate]            ← research-citation-gate
    ↓
[Phase 7: Consistency Gate]         ← research-consistency-gate
    ↓
[Phase 8: Completion]               ← save report + task history
```

---

## Agents

### OBDN-Specific Agents

| Agent | Role |
|-------|------|
| `kg-lead-agent` | Plans research, coordinates KG vs web tracks |
| `kg-query-subagent` | Runs KG tool commands, produces Evidence Notes |
| `kg-mechanism-subagent` | Specialized mechanism path mapping |
| `kg-answer-writer` | KG-grounded report writing |

### Reused Research Agents

| Agent | Role |
|-------|------|
| `research-web-search-subagent` | Firecrawl web search (fallback) |
| `research-citation-gate` | Citation validation |
| `research-consistency-gate` | Consistency and coverage gate |

---

## KG Tools

All tools run from OBDN project root:

```bash
cd /Users/adilkalam/Desktop/OBDN/obdn_site
```

### kg-query.mjs

| Command | Purpose |
|---------|---------|
| `find <text>` | Search nodes by text |
| `show <nodeId>` | Node details + edges |
| `neighbors <nodeId> [relation]` | Filtered neighbors |
| `path <src> <dst> [depth]` | Generic BFS path |
| `mechpath <src> <dst> [depth]` | Mechanism-aware path |

### kg-brief.mjs

| Command | Purpose |
|---------|---------|
| `node <nodeId> [--json]` | Detailed node lens |
| `topic "<text>" [--json]` | Topic brief with candidates |

---

## Evidence Note Schemas

### KG Evidence Note

```json
{
  "type": "kg",
  "subquestion_id": "kg-1",
  "question": "...",
  "nodes_used": ["peptide:x", "mechanism:y", ...],
  "edges_used": [{"source": "...", "target": "...", "relation": "...", "evidence": "..."}],
  "mechanism_paths": [{"src": "...", "dst": "...", "path_nodes": [...], "has_mechanism": true}],
  "source_files": ["data/peptides/cards/x.md:45"],
  "summary": "...",
  "limitations": null,
  "ra_tags": []
}
```

### KG Mechanism Evidence Note

```json
{
  "type": "kg-mechanism",
  "peptide_id": "peptide:x",
  "condition_id": "condition:y",
  "mechanism_path": {
    "path_nodes": [...],
    "path_edges": [...],
    "has_mechanism": true,
    "mechanism_nodes": ["mechanism:z"],
    "depth": 3
  },
  "narrative": "X activates Z, which supports A axis...",
  "confidence": "HIGH|MEDIUM|LOW",
  "source_files": [...],
  "ra_tags": []
}
```

---

## Mechanism Path Behavior

### Input
- `peptideId`: KG node id (type: peptide)
- `conditionId`: KG node id (type: condition)
- `maxDepth`: integer (default 4)

### Resolution
```bash
node scripts/kg-query.mjs mechpath <peptideId> <conditionId> [maxDepth]
```

### Path Preference
1. Paths with mechanism nodes (type === "mechanism")
2. Falls back to any path if no mechanism found

### Confidence Levels

| Path Quality | Confidence |
|--------------|------------|
| `has_mechanism: true`, depth ≤ 4 | HIGH |
| `has_mechanism: true`, depth > 4 | MEDIUM |
| `has_mechanism: false`, depth ≤ 3 | MEDIUM |
| `has_mechanism: false`, depth > 3 | LOW |
| No path found | NONE |

### Narrative Template

> "[Peptide] activates [mechanism], which supports the [axis] axis,
> which in turn addresses [condition]."

---

## Phase State Contract

```json
{
  "domain": "kg-research",
  "mode": "standard|deep",
  "kg_mode": true,
  "kg_primary_node_id": "peptide:bpc-157",
  "kg_candidate_nodes": [...],
  "current_phase": "...",

  "scoping": {
    "question": "...",
    "kg_eligible": true,
    "kg_topic_brief_path": ".claude/research/evidence/kg-topic-*.json"
  },

  "research_plan": {
    "kg_subquestions": [
      {"id": "kg-1", "description": "...", "tools": ["mechpath"], "target_nodes": [...]}
    ],
    "web_subquestions": [...]
  },

  "kg_evidence": {
    "notes": [".claude/research/evidence/kg-1.json", ...],
    "nodes_used": 12,
    "has_mech_paths": true
  },

  "web_evidence": {
    "notes": [...]
  },

  "synthesis": {
    "kg_summary": "80% KG-grounded",
    "kg_coverage": {
      "nodes_used": 12,
      "relations_used": 8,
      "gaps": ["Long-term safety not in KG"]
    }
  },

  "gates": {
    "citation_gate": {...},
    "consistency_gate": {...}
  }
}
```

---

## RA Tags for KG Research

| Tag | Meaning |
|-----|---------|
| `#LOW_EVIDENCE` | KG path thin (no mechanism, long path) |
| `#CONTEXT_DEGRADED` | Node not in KG, web fallback used |
| `#SOURCE_DISAGREEMENT` | KG and web conflict |
| `#OUT_OF_DATE` | KG may be stale |
| `#RATE_LIMITED` | Firecrawl limits on web track |

---

## Artifact Locations

```
.claude/research/
├── evidence/
│   ├── kg-topic-<slug>.json     ← KG topic brief
│   ├── kg-<subquestion>.json    ← KG evidence notes
│   ├── kg-mech-<id>.json        ← Mechanism evidence notes
│   └── web-<subquestion>.md     ← Web evidence notes
├── reports/
│   └── <topic>-report.md        ← Final reports
└── cache/                       ← Optional cached results
```

---

## Completion & Learning

On completion, `/kg`:

- Saves report to `.claude/research/reports/`
- Records task history via `mcp__project-context__save_task_history`:
  - `domain: "kg-research"`
  - `learnings`: KG coverage, mechanism paths found, gaps
- Future `/kg` queries can reference prior research
