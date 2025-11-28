# /kg – OBDN Knowledge Graph Research Command

Use this command for research questions in the OBDN domain (peptides, protocols,
mechanisms, axes, conditions). The Knowledge Graph is the primary evidence source.

**Examples:**
```
/kg "How does BPC-157 support tissue repair?"
/kg "What mechanisms does Retatrutide activate?"
/kg --deep "Compare healing protocols for tendinopathy"
```

## When to Use /kg vs /research

| Question Type | Command | Why |
|---------------|---------|-----|
| Peptide mechanisms | `/kg` | KG has structured mechanism paths |
| Protocol design | `/kg` | KG has protocol compositions |
| Axis relationships | `/kg` | KG maps peptide → axis connections |
| General AI/tech | `/research` | Outside OBDN domain |
| Market analysis | `/research` | Web-first evidence |
| Clinical trials | `/kg` then web | KG for context, web for trials |

---

## Flow

### 1) Scoping & KG Eligibility

First, check if the Knowledge Graph has relevant content:

```bash
cd /Users/adilkalam/Desktop/OBDN/obdn_site
node scripts/kg-brief.mjs topic "$QUESTION" --json
```

**If `primary_node` exists:**
- Set `kg_mode: true`
- Use KG-first evidence gathering
- Delegate to `kg-lead-agent`

**If no KG matches:**
- Fall back to standard `/research` behavior
- Use Firecrawl/WebSearch

### 2) Team Confirmation

Present the KG research team:

```
KG Research Pipeline:
- kg-lead-agent (planning, coordination)
- kg-query-subagent (KG tool queries)
- kg-mechanism-subagent (mechanism paths)
- kg-answer-writer (KG-grounded reports)
- research-citation-gate (citations)
- research-consistency-gate (validation)
```

Ask: "Proceed with KG-first research? (or switch to web-first)"

### 3) Delegate to kg-lead-agent

Once confirmed, delegate via Task:

```
Task → kg-lead-agent:
"Research question: [USER QUESTION]
Mode: [standard | deep]
KG Topic Brief: [path to saved brief]

Plan KG vs web tracks, coordinate evidence gathering, and produce
a KG-grounded research report."
```

### 4) Evidence Gathering

The lead agent coordinates:

**KG Track:**
- `kg-query-subagent` for general KG queries
- `kg-mechanism-subagent` for mechanism paths
- Evidence Notes saved to `.claude/research/evidence/kg-*.json`

**Web Track (fallback):**
- `research-web-search-subagent` for external sources
- Only for topics KG doesn't cover

### 5) Report Draft

Delegate to `kg-answer-writer`:
- Uses KG outline template
- Mechanism paths as narrative backbone
- Web evidence as supporting enrichment

### 6) Gates

Run standard research gates:
- `research-citation-gate` – handles both KG and web citations
- `research-consistency-gate` – validates mechanism path consistency

### 7) Completion

Save final report to `.claude/research/reports/`

Record task history:
```
mcp__project-context__save_task_history
domain: "kg-research"
task: <question>
outcome: success|partial|failure
learnings: <key findings, RA tags>
```

---

## Phase State Contract

```json
{
  "domain": "kg-research",
  "mode": "standard|deep",
  "kg_mode": true,
  "kg_primary_node_id": "peptide:bpc-157",
  "kg_candidate_nodes": ["peptide:bpc-157", "mechanism:vegf", ...],
  "current_phase": "evidence_gathering",

  "scoping": {
    "question": "...",
    "kg_eligible": true,
    "kg_topic_brief_path": ".claude/research/evidence/kg-topic-*.json"
  },

  "research_plan": {
    "kg_subquestions": [...],
    "web_subquestions": [...]
  },

  "evidence_gathering": {
    "kg_evidence_notes": [...],
    "web_evidence_notes": [...]
  },

  "synthesis": {
    "kg_summary": "...",
    "kg_coverage": {
      "nodes_used": 12,
      "has_mech_paths": true,
      "gaps": [...]
    }
  }
}
```

---

## Modes

### Standard Mode (default)

```
/kg "What peptides support the Metabolic axis?"
```

- Single evidence pass
- Structured answer (500-1500 words)
- Uses `kg-answer-writer`

### Deep Mode

```
/kg --deep "Compare all healing protocols with mechanism analysis"
```

- Multiple evidence passes
- Long-form report (2000-5000+ words)
- Comprehensive mechanism path analysis
- Methodology section
- Extensive citations

---

## KG Tools Reference

All tools run from `/Users/adilkalam/Desktop/OBDN/obdn_site`:

```bash
# Find nodes
node scripts/kg-query.mjs find "NAD"

# Node details
node scripts/kg-query.mjs show peptide:nad

# Neighbors by relation
node scripts/kg-query.mjs neighbors peptide:retatrutide synergizes_with

# Generic path
node scripts/kg-query.mjs path peptide:a condition:b 4

# Mechanism-aware path
node scripts/kg-query.mjs mechpath peptide:retatrutide condition:metabolic-syndrome 4

# Topic brief
node scripts/kg-brief.mjs topic "Retatrutide metabolic" --json

# Node lens
node scripts/kg-brief.mjs node peptide:retatrutide --json
```

---

## RA Tags for KG Research

| Tag | Meaning |
|-----|---------|
| `#LOW_EVIDENCE` | KG path exists but thin (no mechanism node, long path) |
| `#CONTEXT_DEGRADED` | Node not in KG, had to use web only |
| `#SOURCE_DISAGREEMENT` | KG and web sources conflict |
| `#OUT_OF_DATE` | KG may be stale for rapidly changing topics |
| `#RATE_LIMITED` | Firecrawl limits affected web coverage |

---

## CRITICAL: Role Boundary

**YOU ARE AN ORCHESTRATOR. YOU NEVER WRITE REPORTS YOURSELF.**

- Delegate KG queries to `kg-query-subagent` or `kg-mechanism-subagent`
- Delegate report writing to `kg-answer-writer`
- Delegate validation to gates
- Your job: coordinate, track phase_state, ensure quality

If you find yourself running KG queries directly or writing report prose: **STOP**.
Delegate via Task tool.

ARGUMENTS: $ARGUMENTS
