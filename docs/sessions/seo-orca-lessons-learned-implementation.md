# SEO-ORCA: Lessons Learned & Implementation Plan

**Date:** 2025-11-07
**Source:** Manual iteration v1→v2→v3→v4 on "Retatrutide Recomp Lean Mass"

---

## Executive Summary

**Test conclusion:** With proper KG utilization + communication heuristics, we can produce world-class peptide content (3,200+ words, 8 citations, sophisticated but clear).

**Gap identified:** Current automation produces 491-word skeletons. Manual process produces 3,240-word comprehensive articles.

**Root cause:** Pipeline never reads KG source files (only uses 200-char excerpts), doesn't apply communication heuristics, uses wrong citation architecture.

**Solution:** Encode manual process lessons into agents and pipeline infrastructure.

---

## Critical Lessons from V1→V4 Iteration

### Lesson 1: Citation Architecture (V1→V2)

**What we learned:**
- Internal KG documents are for CONTENT EXTRACTION, not citations
- External research papers are for E-E-A-T VALIDATION
- Never cite internal docs as proof (reta-card.md is not peer review)

**Implementation:**
```python
# Wrong (v1 approach)
citation = f"[^1]: {kg_node['source']} — {kg_node['excerpt']}"

# Right (v2+ approach)
# Content from KG sources
content = read_full_file(kg_node['source'])
# Citations from research directory
citation = f"[^1]: {research_paper['authors']}. {research_paper['title']}. {research_paper['journal']}. {research_paper['year']}. {research_paper['doi']}"
```

**Required changes:**
1. Separate KG content extraction from citation extraction
2. Build research paper index (external citations)
3. Map claims → external research (not KG docs)

---

### Lesson 2: Deep File Reading (V1→V2)

**What we learned:**
- KG JSON has 200-char `source_excerpt` → NOT ENOUGH
- Source files contain 10-40KB complete prose → THIS IS THE CONTENT
- Pipeline must READ source files, not just use excerpts

**Implementation:**
```python
# Wrong (current)
content = kg_node.get("source_excerpt")  # 200 chars max

# Right (needed)
source_path = kg_node.get("source")
content = read_markdown_file(f"{kg_root}/{source_path}")  # Full file, 10-40KB
relevant_sections = extract_sections_matching(content, outline_heading)
```

**Required changes:**
1. Add `read_kg_source_files()` function
2. Parse markdown into sections (H1, H2, H3)
3. Score sections by relevance to outline heading
4. Extract full prose blocks (300-500 words per section)

---

### Lesson 3: Structure & Audience (V2→V3)

**What we learned:**
- Oversimplifying = wrong (v2 "fitness enthusiast" tone too basic)
- User wants SOPHISTICATED content using KG frameworks (dual-axis recomp)
- Audience is intelligent and wants to LEARN, not just get instructions

**Implementation:**
```markdown
# Wrong (v2 structure)
Problem → Quick solution → Simple protocol

# Right (v3 structure)
Mechanism explained → Framework taught → Synchronization shown → Protocol with rationale
```

**Required changes:**
1. Use KG frameworks directly (dual-axis-recomp.md structure)
2. Teach concepts progressively (AMPK/mTOR before introducing stack)
3. Don't dumb down—explain clearly instead
4. Target: "Person who wants to understand, not just do"

---

### Lesson 4: Communication Heuristics (V3→V4)

**What we learned:**
- Technical accuracy + conversational clarity = winning combination
- Analogies make complex concepts click immediately
- Pattern: Experience → Mechanism → Outcome (not Mechanism → Definition)
- Test: "Can reader explain this to gym buddy?" = clarity gate

**The Heuristic:**

**For any technical term:**
1. Use natural analogy when helpful (don't force)
2. Describe experience/function first
3. Name the mechanism
4. Connect to practical outcome

**Examples:**

**AMPK:**
```markdown
# Academic (v3)
AMPK is an energy sensor that activates when cells detect low energy.

# Clear (v4)
Morning = Breakdown Mode

You wake up after 10-16 hours without food. Your body needs energy but nothing's
coming in. So it flips into breakdown mode: fat unlocks, cells shift to burning
fat, mental clarity peaks.

This is called AMPK activation—think of it as a cellular fuel gauge that says
"we're low on energy, start breaking things down."
```

**Retatrutide mechanism:**
```markdown
# Academic (v3)
Retatrutide is a triple-agonist activating GLP-1, GIP, and glucagon receptors.

# Clear (v4)
Think of it like turning up three dials:

Dial 1: Appetite Control (GLP-1)
Makes eating less feel natural. "Food noise" disappears—that constant background
hum of thinking about the next meal just goes quiet.

Dial 2: Nutrient Efficiency (GIP)
...

Dial 3: Metabolism Boost (Glucagon)
This one's dangerous—it doesn't just burn fat, it burns everything.
```

**Implementation:**
```python
def apply_communication_heuristic(technical_term, context):
    """
    Transform technical explanation into clear, functional description.

    Pattern:
    1. Natural analogy (if helpful)
    2. Describe what happens (experience)
    3. Name the mechanism
    4. Connect to outcome
    """
    # Use LLM with specific prompt:
    prompt = f"""
    Explain {technical_term} using this pattern:
    1. If helpful, start with simple analogy
    2. Describe what actually happens (experience)
    3. Name the technical term
    4. Connect to practical outcome

    Context: {context}
    Audience: Intelligent reader who wants to learn, not just follow instructions
    Test: Could they explain this to their gym buddy without looking it up?
    """
```

**Required changes:**
1. Add communication heuristic to draft generation prompts
2. Quality gate: scan for undefined jargon (terms without functional explanation)
3. Test output with "gym buddy explainability" check

---

### Lesson 5: Voice & Sophistication (User Philosophy)

**What we learned:**
- "Simplicity is the ultimate sophistication"
- If reader can't understand, it's writer's fault (didn't understand well enough to explain clearly)
- Test: Can engineer explain AI without jargon? Can peptide expert explain AMPK to gym buddy?

**The Standard:**

**Bad (hiding behind jargon):**
```markdown
L-Carnitine facilitates β-oxidation of long-chain fatty acids via CPT1-mediated
mitochondrial import.
```

**Good (clear mechanism + function):**
```markdown
L-Carnitine shuttles long-chain fatty acids across the mitochondrial membrane
where they're burned for energy. Without enough carnitine, freed fat circulates
in your blood doing nothing. It's like having firewood delivered but no way to
get it into the fireplace.
```

**Both are technically accurate. Second is understandable.**

**Implementation:**
- Prompt instruction: "Use proper terminology but explain functionally immediately"
- Quality gate: Flag sentences with technical terms lacking functional explanations
- Test: "Gym buddy test" - can reader explain without looking up terms?

---

## Architectural Changes Required

### 1. Citation System Overhaul

**Current state:**
```python
# Line 1176-1185 in seo_auto_pipeline.py
if knowledge_graph and knowledge_graph.get("relations"):
    lines.append("## References & Evidence\n")
    for rel in knowledge_graph["relations"][:6]:
        lines.append(f"- {rel.get('source')} —[{rel.get('relation')}]→ {rel.get('target')}")
```

**New architecture:**

```python
class CitationManager:
    def __init__(self, kg_path, research_path):
        self.kg = load_kg(kg_path)
        self.research_index = build_research_index(research_path)

    def extract_content_from_kg(self, section_heading):
        """Extract prose content from KG source files."""
        relevant_nodes = score_nodes_by_relevance(self.kg, section_heading)
        content_blocks = []
        for node in relevant_nodes[:3]:
            source_file = node['source']
            full_content = read_markdown_file(f"{kg_root}/{source_file}")
            sections = extract_matching_sections(full_content, section_heading)
            content_blocks.extend(sections)
        return content_blocks

    def map_claims_to_research(self, content_with_claims):
        """Map factual claims to external research papers."""
        claims = extract_claims(content_with_claims)
        citations = {}
        for claim in claims:
            matching_papers = find_supporting_research(claim, self.research_index)
            if matching_papers:
                citations[claim] = format_citation(matching_papers[0])
        return citations
```

**File structure needed:**
```
/docs/research/
  ├── glp1-agonists/
  │   ├── retatrutide-nejm-2023.json
  │   ├── tirzepatide-nejm-2022.json
  │   └── semaglutide-nejm-2021.json
  ├── peptides/
  │   ├── tesamorelin-metabolism-2014.json
  │   ├── l-carnitine-clinical-nutrition-2020.json
  │   └── mots-c-cell-metabolism-2015.json
  └── index.json  # Searchable index
```

**Citation JSON format:**
```json
{
  "id": "retatrutide_nejm_2023",
  "authors": ["Jastreboff AM", "Aronne LJ", "et al"],
  "title": "Triple–Hormone-Receptor Agonist Retatrutide for Obesity",
  "journal": "New England Journal of Medicine",
  "year": 2023,
  "doi": "10.1056/NEJMoa2301972",
  "url": "https://doi.org/10.1056/NEJMoa2301972",
  "key_findings": [
    "24% body weight reduction in 48 weeks",
    "Superior to semaglutide (~15%) and tirzepatide (~21%)",
    "Well-tolerated with manageable GI side effects"
  ],
  "relevance_tags": ["retatrutide", "weight loss", "triple agonist", "clinical trial"]
}
```

---

### 2. Deep File Reading System

**New function:**

```python
def extract_kg_content_for_section(
    section_heading: str,
    section_focus: str,
    knowledge_graph: Dict[str, Any],
    kg_root: str
) -> Dict[str, Any]:
    """
    Extract full prose content from KG source files for a specific section.

    Returns:
        {
            "content_blocks": [
                {
                    "source_file": "dual-axis-recomp.md",
                    "section": "Metabolic Partitioning & Retatrutide Fusion",
                    "content": "Full markdown text...",
                    "word_count": 450,
                    "relevance_score": 0.92
                },
                ...
            ],
            "nodes_used": [list of KG node IDs],
            "total_words_available": 2400
        }
    """
    # 1. Score KG nodes by relevance to section heading
    scored_nodes = []
    for node in knowledge_graph.get("nodes", []):
        score = calculate_relevance(
            node.get("label", ""),
            node.get("source_excerpt", ""),
            section_heading,
            section_focus
        )
        scored_nodes.append((score, node))

    scored_nodes.sort(reverse=True, key=lambda x: x[0])

    # 2. Read top 3-5 source files completely
    content_blocks = []
    for score, node in scored_nodes[:5]:
        if score < 0.3:  # Relevance threshold
            continue

        source_path = node.get("source")
        if not source_path:
            continue

        full_path = os.path.join(kg_root, source_path)
        if not os.path.exists(full_path):
            continue

        # Read and parse markdown
        with open(full_path, 'r') as f:
            content = f.read()

        # Extract sections matching heading intent
        sections = parse_markdown_sections(content)
        for section_title, section_text in sections:
            section_score = calculate_relevance(
                section_title,
                section_text[:500],  # First 500 chars
                section_heading,
                section_focus
            )

            if section_score > 0.4:
                content_blocks.append({
                    "source_file": source_path,
                    "section": section_title,
                    "content": section_text,
                    "word_count": len(section_text.split()),
                    "relevance_score": section_score
                })

    # 3. Sort by relevance, return top matches
    content_blocks.sort(reverse=True, key=lambda x: x["relevance_score"])

    return {
        "content_blocks": content_blocks[:5],  # Top 5 matches
        "nodes_used": [node["id"] for score, node in scored_nodes[:5]],
        "total_words_available": sum(b["word_count"] for b in content_blocks)
    }
```

---

### 3. Content Synthesis with Communication Heuristics

**New synthesis approach:**

```python
def synthesize_section_with_clarity(
    section_heading: str,
    section_focus: str,
    kg_content: Dict[str, Any],
    research_citations: Dict[str, str],
    target_word_count: int = 400
) -> str:
    """
    Generate section prose using KG content + communication heuristics.
    """

    # Build synthesis prompt
    prompt = f"""
You are writing a section for a sophisticated peptide science article.

**Section:** {section_heading}
**Focus:** {section_focus}
**Target:** {target_word_count} words

**Content available from knowledge graph:**
{format_content_blocks(kg_content['content_blocks'])}

**Research citations available:**
{format_citations(research_citations)}

**Communication principles:**

1. **Clarity through natural explanation**
   - Use analogies when helpful (don't force)
   - Pattern: Experience → Mechanism → Outcome
   - Example: "Your body flips into breakdown mode" before "This is called AMPK activation"

2. **Voice: Sophisticated but conversational**
   - Teaching a smart friend who wants to learn
   - Use proper terminology but explain functionally immediately
   - Not academic paper, not dumbed-down blog post

3. **Test: Gym buddy explainability**
   - Could reader explain this concept without looking it up?
   - If no → rewrite more clearly

4. **Technical terms must be explained inline**
   - Don't just define ("AMPK is an energy sensor")
   - Explain functionally ("AMPK is a cellular fuel gauge that says 'we're low on energy, start breaking things down'")

5. **Citations**
   - Use footnotes [^1], [^2] for research papers
   - Every major claim gets citation
   - Don't cite internal KG docs as proof

**Write the section now.**

Synthesize the content blocks into coherent {target_word_count}-word prose following these principles.
Use the voice and clarity from this example:

[Include v4 example section as reference]
"""

    # Use Claude/LLM to synthesize
    response = call_llm(prompt, model="claude-sonnet-4")

    return response
```

---

### 4. Quality Gates

**Add clarity quality gate:**

```python
def check_clarity_quality(content: str, section: str) -> Dict[str, Any]:
    """
    Quality gate: Check if content meets clarity standards.
    """

    issues = []

    # 1. Check for undefined jargon
    technical_terms = extract_technical_terms(content)
    for term in technical_terms:
        if not has_functional_explanation_nearby(content, term):
            issues.append({
                "severity": "high",
                "issue": f"Technical term '{term}' lacks functional explanation",
                "location": find_term_location(content, term),
                "fix": f"Add inline explanation after '{term}' describing what it does/means"
            })

    # 2. Check for "gym buddy explainability"
    explainability_score = evaluate_explainability(content, section)
    if explainability_score < 0.7:
        issues.append({
            "severity": "medium",
            "issue": f"Section may be too complex to explain without reference",
            "explainability_score": explainability_score,
            "fix": "Add more intuitive explanations or analogies"
        })

    # 3. Check for academic vs conversational tone
    tone_score = evaluate_tone(content)
    if tone_score > 0.8:  # Too academic
        issues.append({
            "severity": "low",
            "issue": "Tone too academic/formal",
            "fix": "Rewrite in conversational style (teaching smart friend)"
        })

    # 4. Check citation coverage
    claims = extract_factual_claims(content)
    uncited_claims = [c for c in claims if not has_citation_nearby(content, c)]
    if len(uncited_claims) > len(claims) * 0.3:  # >30% uncited
        issues.append({
            "severity": "critical",
            "issue": f"{len(uncited_claims)} factual claims lack citations",
            "fix": "Add research citations for major claims"
        })

    return {
        "section": section,
        "clarity_score": calculate_clarity_score(issues),
        "issues": issues,
        "passes": len([i for i in issues if i["severity"] in ["critical", "high"]]) == 0
    }
```

---

## Agent Updates Required

### 1. SEO Research Specialist

**Current:** Gathers SERP data, keyword metrics
**Update:** Also identify external research papers relevant to keyword

**New capability:**
```markdown
## Research Paper Discovery

For keyword "{keyword}":

1. Identify key compounds/mechanisms mentioned
2. Search research directory for relevant papers
3. Return list of applicable citations with relevance scores
4. Include in brief for draft writer to use

Example output:
- Retatrutide: NEJM 2023 (Phase 2 trial, 24% weight loss) - relevance: 0.95
- Tesamorelin: Metabolism 2014 (visceral fat) - relevance: 0.82
- MOTS-c: Cell Metabolism 2015 (metabolic homeostasis) - relevance: 0.78
```

---

### 2. SEO Brief Strategist

**Current:** Creates outline with section headings + focus
**Update:** Map KG content availability to each section

**New capability:**
```markdown
## KG Content Availability Preview

For each outline section, show:
- Relevant KG nodes (with source files)
- Estimated word count available
- Content quality score
- Suggested external citations

This lets user see "do we have enough content for this section?" before draft generation.
```

---

### 3. SEO Draft Writer

**MAJOR OVERHAUL**

**Current approach:**
- Uses `curated_research` (which is empty)
- Generates placeholders when no content
- No communication heuristics
- No deep file reading

**New approach:**

```markdown
## SEO Draft Writer v2.0

**Mission:** Generate sophisticated, clear peptide content using KG sources + external research

**Process:**

### Phase 1: Content Extraction
For each outline section:
1. Extract full prose from KG source files (not just excerpts)
2. Identify relevant research citations
3. Calculate available word count vs target
4. Score content quality/relevance

### Phase 2: Synthesis with Communication Heuristics
For each section:
1. **Apply clarity principles:**
   - Use analogies naturally when helpful
   - Pattern: Experience → Mechanism → Outcome
   - Explain technical terms functionally inline

2. **Voice: Sophisticated but conversational**
   - Teaching smart friend who wants to learn
   - Use proper terminology but explain immediately
   - Not academic, not dumbed-down

3. **Structure with rationale:**
   - Every instruction gets "why" explanation
   - Every mechanism gets practical outcome
   - Every timing choice gets biological justification

4. **Test standard: Gym buddy explainability**
   - Could reader explain this without looking it up?
   - If no → rewrite more clearly

### Phase 3: Citation Integration
1. Insert footnote citations [^1], [^2] for major claims
2. Use external research papers (not internal KG docs)
3. Build bibliography at end with DOIs/URLs
4. Ensure E-E-A-T compliance (citations for factual claims)

### Phase 4: Quality Check
Run clarity quality gate:
- Undefined jargon check
- Gym buddy explainability score
- Tone assessment (conversational not academic)
- Citation coverage check

**Example prompt structure:**
```
You are writing: {section_heading}
Focus: {section_focus}
Target: {target_words} words

Available KG content:
[Full prose blocks from source files, 300-500 words each]

Available citations:
[Research papers with key findings]

Communication principles:
[Clarity heuristics from v4]

Voice example:
[Include v4 section as reference]

Write section now, following these principles exactly.
```

---

### 4. SEO Quality Guardian

**Current:** Calculates metrics (keyword density, readability, etc.)
**Update:** Add clarity quality gates

**New checks:**
1. **Undefined jargon detection**
   - Scan for technical terms
   - Verify functional explanations nearby
   - Flag terms without explanation

2. **Gym buddy test simulation**
   - Use LLM to evaluate "could this be explained without reference"
   - Score each section 0-1
   - Flag sections <0.7

3. **Tone assessment**
   - Check for overly academic language
   - Verify conversational clarity
   - Flag dense paragraphs lacking examples

4. **Citation E-E-A-T**
   - Verify external research cited (not internal docs)
   - Check coverage (major claims have citations)
   - Validate DOI/URL format

---

## Implementation Sequence

### Phase 1: Foundation (Week 1)

**Tasks:**
1. ✅ Document lessons learned (this file)
2. Build research paper index system
3. Create citation JSON format
4. Add research papers for key compounds (retatrutide, tesamorelin, etc.)

**Deliverable:** `/docs/research/` directory with indexed papers

---

### Phase 2: Deep Reading (Week 2)

**Tasks:**
1. Implement `extract_kg_content_for_section()`
2. Add markdown parsing functions
3. Build relevance scoring
4. Test with retatrutide topic (compare to manual v4)

**Deliverable:** Deep file reading working, extracting full prose from KG sources

---

### Phase 3: Synthesis & Clarity (Week 2-3)

**Tasks:**
1. Update draft writer agent prompt with communication heuristics
2. Implement `synthesize_section_with_clarity()`
3. Add v4 example sections as reference in prompt
4. Test output quality vs v4 manual draft

**Deliverable:** Draft writer producing v4-quality prose automatically

---

### Phase 4: Quality Gates (Week 3)

**Tasks:**
1. Implement `check_clarity_quality()`
2. Add undefined jargon detection
3. Build gym buddy explainability check
4. Integrate into quality guardian agent

**Deliverable:** Automated quality gates catching clarity issues

---

### Phase 5: Integration & Testing (Week 4)

**Tasks:**
1. Wire everything into `/seo-orca` command
2. Update all agent prompts
3. Run full test on new keyword
4. Compare automated output to manual v4 quality
5. Iterate based on gaps

**Deliverable:** Fully automated pipeline producing v4-quality content

---

## Success Metrics

**Compare automated output to v4 manual standard:**

| Metric | Manual v4 | Automated Target | Current Gap |
|--------|-----------|------------------|-------------|
| Word count | 3,240 | 2,500-3,500 | ❌ (491 current) |
| External citations | 8 | 6-10 | ❌ (0 current) |
| KG source files read | 5 complete | 4-6 complete | ❌ (0 current) |
| Clarity score | 90/100 (estimated) | 80+/100 | ❌ (N/A current) |
| Gym buddy test | Pass | Pass | ❌ (Fail current) |
| Voice | Conversational sophistication | Match v4 | ❌ (Academic or placeholder current) |
| Structure | Dual-axis framework | Match KG framework | ❌ (Generic current) |

**Target:** Automated output achieves 85%+ of manual v4 quality

---

## Testing Plan

### Test 1: Same Keyword (Validation)

**Keyword:** "Retatrutide Recomp Lean Mass"
**Approach:** Run automated pipeline with new architecture
**Compare to:** Manual v4 draft
**Success criteria:**
- Word count 2,500+
- 6+ external citations
- Clarity score 80+
- Gym buddy test pass
- Uses dual-axis framework from KG

---

### Test 2: New Keyword (Generalization)

**Keyword:** TBD (user choice - different peptide/protocol)
**Approach:** Run automated pipeline on completely new topic
**Compare to:** Manual spot-check for quality
**Success criteria:**
- Same quality metrics as Test 1
- Validates system works beyond retatrutide
- No manual intervention needed

---

### Test 3: Quality at Scale

**Approach:** Generate 5 articles on different keywords
**Compare to:** Consistency check across outputs
**Success criteria:**
- All meet quality thresholds
- Voice consistent across topics
- Citation architecture working
- No catastrophic failures

---

## Risk Mitigation

**Risk 1: LLM fails to match v4 voice despite prompting**
- Mitigation: Include v4 example sections in prompt as reference
- Fallback: Fine-tune local model on v4 examples

**Risk 2: KG sources don't have enough content for some topics**
- Mitigation: Quality gate flags low content availability in brief stage
- Fallback: User review before full draft, can adjust outline

**Risk 3: Citation mapping fails (can't find relevant research)**
- Mitigation: Research specialist flags gaps during brief creation
- Fallback: User provides external research, system learns mapping

**Risk 4: Clarity quality gates too strict (false positives)**
- Mitigation: Tunable thresholds, user can override
- Fallback: Warning mode instead of blocking mode initially

---

## Next Steps (Immediate)

1. **Get user confirmation** on implementation plan
2. **Build research index** (start with compounds in v4: retatrutide, tesamorelin, l-carnitine, mots-c)
3. **Implement deep file reading** (test on retatrutide topic)
4. **Update draft writer prompt** (add communication heuristics from v4)
5. **Test automated generation** (compare to v4 manual)

---

## Files & References

**Manual drafts (reference examples):**
- `outputs/seo/retatrutide-recomp-lean-mass-MANUAL-draft-v4.md` (GOLD STANDARD)
- `outputs/seo/retatrutide-recomp-lean-mass-MANUAL-draft-v3.md` (framework)
- `outputs/seo/retatrutide-recomp-lean-mass-MANUAL-draft-v2.md` (citations fixed)

**Session documentation:**
- `docs/sessions/manual-vs-automated-comparison.md` (gap analysis)
- `docs/sessions/seo-pipeline-kg-gap-analysis.md` (technical analysis)
- `docs/sessions/v2-improvements-summary.md` (v1→v2 lessons)
- `docs/sessions/v3-dual-axis-rewrite.md` (v2→v3 lessons)
- `docs/sessions/v4-clarity-rewrite.md` (v3→v4 lessons)

**Implementation specs:**
- This file: complete implementation plan

---

_Created: 2025-11-07_
_Status: Ready for implementation_
_Estimated effort: 4 weeks to full automation_
_Expected outcome: World-class automated peptide content generation_
