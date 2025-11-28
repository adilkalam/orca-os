# KG Research Workflow (OBDN)

**Command:** `/kg` and `/kg --deep`
**Domain:** OBDN (peptides, protocols, mechanisms)
**Primary Evidence:** Knowledge Graph (`docs/meta/kg.json`)

---

## When to Use /kg

### Use `/kg` for OBDN Questions

```
/kg "How does BPC-157 support tissue repair?"
/kg "What mechanisms does Retatrutide activate?"
/kg "Which peptides synergize with Semax?"
/kg "What's in the Intro to Healing protocol?"
```

**Good for:**
- Peptide mechanisms and pathways
- Protocol composition and design
- Axis relationships (which peptides support which axes)
- Synergy explanations
- Condition-to-peptide mapping

### Use `/research` for Non-OBDN Questions

```
/research "Compare vector databases for RAG"
/research "Latest AI safety research"
/research "Market analysis of peptide suppliers"
```

### When Both Apply

Some questions need KG context + external data:

```
/kg "How does BPC-157 work, and what do recent clinical trials show?"
```

The system will:
1. Pull mechanism paths from KG
2. Search web for clinical trial data
3. Synthesize both in the report

---

## What Happens When You Run `/kg`

### Phase 1: KG Check

The system checks if your question matches Knowledge Graph content:

```bash
node scripts/kg-brief.mjs topic "your question" --json
```

If KG has relevant nodes → KG-first mode
If no matches → falls back to web research

### Phase 2: Research Planning

For KG-eligible questions, the lead agent plans two tracks:

**KG Track:**
- "Map mechanism path from peptide X to condition Y"
- "Get all synergizes_with edges for peptide X"
- "Show protocol composition"

**Web Track (if needed):**
- "Find clinical trials for peptide X"
- "Search for safety data beyond OBDN"

### Phase 3: Evidence Gathering

**KG queries run like this:**

```bash
# Find the mechanism path
node scripts/kg-query.mjs mechpath peptide:bpc-157 condition:tendinopathy 4

# Output:
Mechanism path: peptide:bpc-157 [peptide] -> mechanism:vegf [mechanism] -> axis:structural [axis] -> condition:tendinopathy [condition]
  peptide:bpc-157 -[activates]-> mechanism:vegf
    evidence: data/peptides/cards/bpc-157.md:45
  mechanism:vegf -[supports]-> axis:structural
    evidence: docs/content/axes/structural.md:12
```

This becomes a structured Evidence Note.

### Phase 4: Report Writing

The writer uses KG evidence as the backbone:

```markdown
## How BPC-157 Supports Tissue Repair

BPC-157 activates VEGF signaling [1], which supports the Structural axis [2].
The Structural axis directly addresses tissue repair conditions including
tendinopathy [3].

**Mechanism Path:**
peptide:bpc-157 → mechanism:vegf → axis:structural → condition:tendinopathy

## Sources
[1] OBDN: data/peptides/cards/bpc-157.md:45
[2] OBDN: docs/content/axes/structural.md:12
[3] External: Smith et al. (2023). PMID: 12345678
```

### Phase 5: Quality Gates

- **Citation Gate:** Ensures all mechanism claims cite KG evidence
- **Consistency Gate:** Validates the mechanism path makes sense

---

## Understanding KG Output

### Mechanism Paths

The KG tracks relationships like:

```
peptide → activates → mechanism → supports → axis → addresses → condition
```

When you ask "How does X affect Y?", the system traces this path.

**Path with mechanism (HIGH confidence):**
> "BPC-157 activates VEGF (mechanism), which supports the Structural axis,
> which addresses tendinopathy."

**Path without mechanism (MEDIUM confidence):**
> "BPC-157 has a direct association with tissue repair, though the
> intermediate mechanism is not fully mapped."

### Node Types

| Type | Examples | Questions it Answers |
|------|----------|---------------------|
| peptide | bpc-157, retatrutide, semax | "What does X do?" |
| mechanism | vegf, ampk, bdnf | "How does it work?" |
| axis | structural, metabolic, neural | "What system does it target?" |
| condition | tendinopathy, fatigue, inflammation | "What does it help with?" |
| protocol | intro-healing, metabolic-prime | "What's the stack?" |

### Relations

| Relation | Meaning |
|----------|---------|
| activates | Peptide turns on a mechanism |
| inhibits | Peptide blocks a mechanism |
| supports | Mechanism contributes to an axis |
| addresses | Axis helps a condition |
| synergizes_with | Peptides work better together |
| composes | Protocol contains peptide |

---

## Deep Mode

```
/kg --deep "Compare all healing protocols with full mechanism analysis"
```

Deep mode produces:
- Comprehensive mechanism path analysis
- Multiple pathways traced and compared
- Methodology section
- Extensive citations (15-30+)
- 2000-5000+ words

Use for:
- Protocol comparisons
- Comprehensive mechanism reviews
- Content that will be published or referenced

---

## Tips for Better Results

### Be specific about peptides

```
# Good - uses KG node IDs
/kg "How does BPC-157 affect tendinopathy?"

# Vague - may not match KG
/kg "How do healing peptides work?"
```

### Ask about relationships

```
# Mechanism question
/kg "What mechanisms does Retatrutide activate?"

# Synergy question
/kg "Why do BPC-157 and TB-500 synergize?"

# Protocol question
/kg "What's in the Intro to Healing protocol and why?"
```

### Request specific output

```
/kg "Map the mechanism path from Semax to cognitive enhancement"
/kg "List all peptides that support the Neural axis"
```

---

## Report Structure

### Standard Mode

```markdown
# [Topic]

## Summary
[KG-grounded overview]

## [Section from KG outline template]
[Mechanism-based explanation with citations]

## Supporting Evidence
[External sources if used]

## Limitations
[KG coverage, RA tags, gaps]

## Sources
[Internal OBDN + external citations]
```

### Deep Mode (additional sections)

```markdown
## Methodology
[How KG and web evidence were gathered]

## Mechanism Analysis
[Detailed path breakdowns]

## Comparative Analysis
[If comparing protocols/peptides]
```

---

## Limitations Section

Every report includes limitations:

```markdown
## Limitations

**Knowledge Graph Coverage:**
- Nodes used: 8
- Mechanism paths: 2 (both with mechanism nodes)
- Confidence: HIGH for primary claims

**Gaps:**
- Long-term safety data not in KG (#LOW_EVIDENCE)
- Dosing recommendations from external sources only

**Temporal Scope:**
- KG reflects current OBDN documentation
- External sources gathered November 2024
```

---

## Where Reports Are Saved

```
.claude/research/
├── evidence/
│   ├── kg-topic-bpc-157-tendinopathy.json   ← KG topic brief
│   ├── kg-mech-1.json                        ← Mechanism evidence
│   └── web-clinical-trials.md                ← Web evidence
├── reports/
│   └── bpc-157-tendinopathy-report.md        ← Final report
└── cache/
```

---

## Troubleshooting

### "No KG nodes matched"

Your question may be outside OBDN scope. Try:
- Use specific peptide names
- Check if the topic is in the KG: `node scripts/kg-query.mjs find "topic"`
- Fall back to `/research` for non-OBDN questions

### "No mechanism path found"

The KG may not have a direct connection. The report will note this and:
- Try longer paths (depth 5-6)
- Use generic path instead of mechanism path
- Flag as `#LOW_EVIDENCE`

### Report seems incomplete

Ask for gap-filling:
```
"The report doesn't cover safety considerations - can you add that from external sources?"
```

### Need more mechanism detail

```
/kg --deep "Expand on the AMPK activation pathway for Retatrutide"
```

---

## Example Session

```
You: /kg "How does Retatrutide support metabolic health?"

Claude: I'll research this using the OBDN Knowledge Graph.

[Checking KG eligibility...]
Found primary node: peptide:retatrutide
Candidates: mechanism:ampk, axis:metabolic, condition:metabolic-syndrome

[Planning research...]
KG Track:
1. Map mechanism path: retatrutide → metabolic conditions
2. Get all mechanisms retatrutide activates
3. Find synergies

[Gathering evidence...]
Mechanism path found (HIGH confidence):
peptide:retatrutide → mechanism:ampk → axis:metabolic → condition:metabolic-syndrome

[Writing report...]

# How Retatrutide Supports Metabolic Health

## Summary
Retatrutide is a triple-agonist peptide that activates AMPK, a master
metabolic regulator [1]. This mechanism supports the Metabolic axis [2],
which addresses metabolic syndrome and related conditions [3].

## Core Mechanisms
Retatrutide activates AMPK through GLP-1, GIP, and glucagon receptor
agonism. AMPK activation enhances glucose uptake, fatty acid oxidation,
and mitochondrial biogenesis.

**Mechanism Path:**
peptide:retatrutide → mechanism:ampk → axis:metabolic → condition:metabolic-syndrome

## Clinical Contexts
[...]

## Sources
[1] OBDN: data/peptides/cards/retatrutide.md:45
[2] OBDN: docs/content/axes/metabolic.md:12
[3] External: Jastreboff et al. (2023). DOI: 10.1056/NEJMoa2301972
```
