# SEO Pipeline Knowledge Graph Integration Gap Analysis

**Date:** 2025-11-07
**Session:** Post /seo-orca test run for "Retatrutide Recomp Lean Mass"

---

## Executive Summary

**Problem:** Pipeline produces 438-word skeleton drafts instead of 1500+ word full prose, despite Knowledge Graph containing all necessary content.

**Root Cause:** `generate_initial_draft()` function loads KG but doesn't use it for content generation - only for link resolution and reference appendix.

**User Expectation:** "The knowledge graph has all the references you'll ever need. The knowledge graph also has all the research content you'll ever need to produce a 1500 word document (I used it with GPT5 and it produced the 10,000 magnum opus 'the failure of medicine' with just my high level outline)"

---

## Current Architecture (What We Have)

### Knowledge Graph Content (RICH - UNUSED)

The KG loaded for "Retatrutide Recomp Lean Mass" contains:

**Primary Nodes (3):**
- `peptide:retatrutide` → Full PEPTIDE CARD from reta-card.md
- `content:dual-axis-recomp` → Full protocol from dual-axis-recomp.md
- `content:retatrutide-foundation` → Full metabolic foundation content

**Neighbor Nodes (12):**
- Mechanisms: UCP1, AMPK, mTOR
- Receptors: GLP1R, GIPR, GCGR
- Related peptides: MOTS-C, Tesamorelin, L-Carnitine, AOD-9604, NAD+
- Protocol: AK 4-Week Protocol

**Relations (10+):**
- Synergies (`synergizes_with`)
- Stack compositions (`composes_stack_with`)
- Mechanistic actions (`raises`, `activates`, `inhibits`)
- Axis membership (`part_of_axis`)

**Each node contains:**
- `source`: Path to source markdown file
- `source_excerpt`: Actual content from that file (200-500+ chars)
- Metadata: id, label, type

### What Current Code Does With KG

**File:** `scripts/seo_auto_pipeline.py:941-1222` (`generate_initial_draft()`)

**Line 1038-1063: Link Resolution Only**
```python
def get_node_path(node_id: str) -> Optional[str]:
    if not knowledge_graph:
        return None
    for node in knowledge_graph.get("nodes", []):
        if node.get("id") == node_id:
            src = node.get("source")
            # Returns file path for creating markdown links
```
**Purpose:** Create internal links like `[Semax](path/to/semax.md)`
**Content Usage:** NONE

**Line 1176-1185: References Appendix**
```python
if knowledge_graph and knowledge_graph.get("relations"):
    lines.append("## References & Evidence\n")
    for rel in knowledge_graph["relations"][:6]:
        lines.append(f"- {rel.get('source')} —[{rel.get('relation')}]→ {rel.get('target')}")
        snippet = rel.get("evidence_excerpt")
```
**Purpose:** Create References section with KG relations
**Content Usage:** Bullet list only, not prose

**Line 1089-1143: Content Generation (NO KG)**
```python
# Select 2–3 relevant curated snippets
picks = select_relevant_sections(heading, focus, k=3)

# Compose paragraph from snippets
if unique_picks:
    paragraph = compose_paragraph([s for _, s in unique_picks], min_sentences=3)
else:
    # Fallback to placeholder
    lines.append(f"This section explores: {questions[used_questions_idx]}\n")
```
**Source:** `curated_research` only (which was empty: 0 files loaded)
**KG Usage:** ZERO

---

## The Gap: What's Missing

### 1. KG Nodes Are Not Expanded Into Prose

**Available but unused:**
```json
{
  "id": "content:dual-axis-recomp",
  "label": "Dual-Axis Recomposition",
  "type": "content",
  "source": "docs/content/dual-axis-recomp.md",
  "source_excerpt": "# Dual-Axis Recomposition Protocol\n\n## 1. Executive Overview\nDual-Axis Recomposition is a systems-level approach to body recomposition designed for athletes and high-control trainees who need simultaneous fat loss and muscle preservation (or gain). Instead of relying on simplistic caloric-deficit logic, the protocol synchronizes two daily metabolic axes:\n- **Daytime AMPK axis** – catabolic, fat-mobilizing, performance-focused."
}
```

**What should happen:**
- Extract this 400+ character excerpt
- Use it to write "How it works (mechanisms)" section
- Expand with related node content (AMPK, UCP1, receptors)
- Create 300-400 word section with full explanations

**What actually happens:**
- KG loaded into memory ✓
- Node never accessed for content ✗
- Section gets placeholder: "This section explores: How does Retatrutide Recomp Lean Mass work mechanistically?"
- Result: 1 sentence instead of 300 words

### 2. Source Files Are Not Read

**Available paths:**
- `docs/peptides/cards/reta-card.md`
- `docs/content/dual-axis-recomp.md`
- `docs/content/retatrutide-metabolic-foundation.md`
- `docs/content/system_master/3-metabolic-axis.md`

**What should happen:**
- Read full source files referenced by KG nodes
- Extract relevant sections based on outline headings
- Synthesize into coherent prose
- Create comprehensive explanations

**What actually happens:**
- Paths resolved for link creation only ✓
- Files never read for content extraction ✗
- Rich content in source files remains unused

### 3. Relations Are Not Used for Content Flow

**Available relationships:**
```json
{
  "source": "peptide:retatrutide",
  "target": "mech:AMPK",
  "relation": "raises",
  "evidence_excerpt": "AOD-9604 → unlocks resistant fat stores\nL-CARNITINE → ensures liberated fat becomes fuel\nTESAMORELIN (± IPAMORELIN) → protects and rebuilds structure"
}
```

**What should happen:**
- Use relations to structure content flow
- "Retatrutide activates AMPK..." (uses `raises` relation)
- Explain mechanism pathway using evidence excerpts
- Connect synergies in Practical Use section

**What actually happens:**
- Relations listed in References section ✓
- Never used to generate explanatory prose ✗
- Mechanistic connections not explained in body

### 4. No Content Synthesis Strategy

**Current approach:**
```python
def compose_paragraph(snippets: List[str], min_sentences: int = 3) -> str:
    # Takes 3 sentences max per snippet (line 992)
    # Assembles into 3-5 sentence paragraph
    # No expansion, no synthesis, no LLM
```

**What's missing:**
- No strategy to expand KG excerpts into full prose
- No LLM-based synthesis of multiple KG nodes
- No intelligent content weaving
- Just snippet assembly (if snippets exist) or placeholders (if not)

---

## Impact Analysis

### Current Output for "Retatrutide Recomp Lean Mass"

**Word Count:** 438 words
**Target:** 1500+ words
**Gap:** 1062 words (71% short)

**Quality Score:** 42/100

**Critical Issues:**
- Word count too low: 438 vs 1500+ target
- Keyword density too high: 7.31% (keyword stuffing risk)
- Zero citations despite KG containing all references
- 4 sections with placeholder text instead of content
- Readability grade 19.5 (target: 8-10) because short academic sentences

**What KG Could Have Provided:**

**Section: "How it works (mechanisms)"**
- Current: "This section explores: How does Retatrutide Recomp Lean Mass work mechanistically?"
- Available in KG:
  - Triple receptor action (GLP-1, GIP, Glucagon) from glp-1-comparison-specification.md
  - AMPK activation pathway from metabolic-axis.md
  - UCP1 thermogenesis from metabolic-axis.md
  - mTOR inhibition effects from mito-axis.md
  - Full mechanistic cascade explanation
- **Could be:** 300-400 word mechanistic explanation with citations

**Section: "Evidence and research"**
- Current: "This section explores: Who is this protocol appropriate for, and who should avoid it?"
- Available in KG:
  - Comparative weight loss data (10-15% vs 15-22% vs 20-24%)
  - Receptor target differences across GLP-1 agonists
  - Synergy data from integrated-systems-synergy document
  - Stack composition evidence from peptide-synergy-diagram
- **Could be:** 250-300 word evidence section with comparison table

**Section: "Practical use and protocols"**
- Current: "Key perspective: Medical supervision requirements"
- Available in KG:
  - Dual-Axis Recomposition full protocol from dual-axis-recomp.md
  - Daytime AMPK axis strategy
  - AK 4-Week Protocol structure
  - Stack composition recommendations (L-Carnitine, Tesamorelin, MOTS-C)
- **Could be:** 400-500 word implementation guide

**Total Available:** 950-1200 words from KG alone (hits 1500+ target with intro/conclusion)

---

## Architectural Changes Needed

### Phase 1: KG Content Extraction (Foundation)

**New Function: `extract_kg_content_for_section()`**

```python
def extract_kg_content_for_section(
    section_heading: str,
    knowledge_graph: Dict[str, Any],
    focus_terms: List[str]
) -> Dict[str, Any]:
    """
    Extract relevant KG content for a specific outline section.

    Returns:
        {
            "nodes": [...],           # Relevant nodes with excerpts
            "relations": [...],       # Relevant relations
            "source_files": [...],    # Files to read for full content
            "key_points": [...]       # Extracted key points from excerpts
        }
    """
```

**Approach:**
1. Score KG nodes by relevance to section heading
2. Extract source_excerpt from top nodes
3. Collect relations involving those nodes
4. Identify source files needing full read
5. Return structured content package

### Phase 2: Source File Reading

**New Function: `read_kg_source_files()`**

```python
def read_kg_source_files(
    source_paths: List[str],
    knowledge_root: str,
    section_heading: str
) -> List[Dict[str, str]]:
    """
    Read full content from KG source files.

    Returns list of:
        {
            "file": "path/to/file.md",
            "content": "full markdown content",
            "relevant_sections": ["Section 1", "Section 2"]
        }
    """
```

**Approach:**
1. Read markdown files from KG source paths
2. Parse into sections (H1, H2, H3)
3. Score sections by relevance to outline heading
4. Return full section content (not just excerpts)

### Phase 3: Content Synthesis (LLM Integration)

**New Function: `synthesize_section_prose()`**

```python
def synthesize_section_prose(
    section_heading: str,
    section_focus: str,
    kg_content: Dict[str, Any],
    source_content: List[Dict[str, str]],
    target_word_count: int = 250
) -> str:
    """
    Generate full prose section from KG content using LLM.

    Uses Claude to:
    - Weave KG excerpts into coherent narrative
    - Expand technical concepts with context
    - Maintain E-E-A-T signals (citations, disclaimers)
    - Hit target word count with valuable content
    """
```

**Approach:**
1. Build prompt with KG content + source excerpts
2. Specify section heading, focus, target length
3. Request citations to specific sources
4. Generate 250-400 word prose per section
5. Maintain consistent voice and structure

### Phase 4: Outline Review Workflow

**New: Interactive Outline Confirmation**

```python
def generate_outline_with_kg_preview(
    keyword: str,
    knowledge_graph: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generate outline WITH preview of available KG content.

    Returns:
        {
            "outline": [...],
            "kg_coverage": {
                "Section 1": {
                    "nodes": 3,
                    "word_estimate": 350,
                    "sources": ["reta-card.md", "dual-axis-recomp.md"]
                },
                ...
            }
        }
    """
```

**User Workflow:**
1. System generates outline with KG coverage preview
2. User sees what content is available for each section
3. User can modify outline based on KG strength
4. User confirms: "Yes, proceed with full draft"
5. System generates 1500+ word prose using KG

---

## Proposed Implementation Plan

### Step 1: Add KG Content Extraction
- Write `extract_kg_content_for_section()`
- Test with "How it works" section
- Verify it pulls relevant nodes + relations

### Step 2: Add Source File Reading
- Write `read_kg_source_files()`
- Test with reta-card.md and dual-axis-recomp.md
- Verify full content extraction

### Step 3: Add LLM Synthesis (Claude)
- Write `synthesize_section_prose()`
- Use Anthropic API or local Claude
- Test generating 250-word section from KG content
- Validate: coherent prose, citations, no hallucination

### Step 4: Integrate Into Pipeline
- Modify `generate_initial_draft()` to use new functions
- Each section: extract KG → read sources → synthesize prose
- Target: 250-400 words per section = 1500+ total

### Step 5: Add Outline Review Step
- Generate outline with KG preview
- Output to file for user review
- Wait for confirmation before full draft
- Allow outline modification

### Step 6: Full Workflow Test
- Run `/seo-orca` end-to-end
- Verify 1500+ word output with full prose
- Check quality metrics (citations, readability, structure)
- Compare to current 438-word skeleton

---

## Success Metrics

**Before (Current State):**
- Word count: 438
- Quality score: 42/100
- Citation coverage: 0%
- Content type: Skeleton with placeholders
- KG utilization: ~5% (links + refs only)

**After (Target State):**
- Word count: 1500-2000
- Quality score: 75+/100
- Citation coverage: 80%+
- Content type: Full prose with explanations
- KG utilization: 90%+ (content + relations + citations)

**User Experience:**
- Current: "That's not what I expected" → needs manual rewrite
- Target: "This is a solid first draft" → needs light editing only

---

## Next Steps

**Immediate:**
1. Confirm this analysis matches user's understanding of the gap
2. Get approval for proposed architectural approach
3. Decide on LLM integration method (API vs local)

**Implementation:**
1. Start with Step 1 (KG content extraction)
2. Build incrementally with tests at each step
3. Integrate when synthesis working
4. Full workflow test with real keyword

**Question for User:**
Which LLM approach for prose synthesis?
- Option A: Anthropic API (Claude Sonnet) - requires API key
- Option B: Local LLM setup
- Option C: Different approach (user specifies)
