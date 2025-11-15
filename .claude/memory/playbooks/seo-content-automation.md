# SEO Content Automation Playbook

**Version:** 1.0.0
**Last Updated:** 2025-11-07T05:06:00Z
**Project Type:** seo-content-automation

This playbook contains patterns specific to SEO content generation and automation.

---

## Helpful Patterns (✓)

### seo-pattern-001: Deep KG File Reading for Content Extraction
**Context:** Need rich prose from knowledge graph, not just metadata or excerpts
**Strategy:** Read complete markdown files (10-40KB), parse into sections by headings (H1/H2/H3), score relevance using Jaccard similarity + keyword presence (0.4+ threshold), extract top 5 files × top 5 sections per outline section = 2,000-4,000 words of substantial content.
**Evidence:** SEO Phase 1-4: Deep reader enabled 3,240-word articles from real prose (not filler). Technical completeness preserved, narrative flow maintained. Replaced 200-char excerpts lacking context.
**Helpful Count:** 1 | **Harmful Count:** 0
**Learned From:** seo-orca-phase-1-4-2025-11-07
**Tags:** content-extraction, knowledge-graph, quality

**Implementation:**
- **Module:** scripts/seo_kg_deep_reader.py
- **Functions:**
  - `parse_markdown_sections()` - Split by headings, preserve prose
  - `calculate_relevance_score()` - Jaccard similarity + keywords
  - `extract_kg_content_for_section()` - Top matches per section
- **Integrated In:** scripts/seo_auto_pipeline.py (line 44)

---

### seo-pattern-002: External Research Citation Architecture
**Context:** E-E-A-T validation for Google ranking
**Strategy:** Separate internal KG (content authority, editorial voice) from external research (E-E-A-T validation, credibility). Internal citations: [Source: file.md]. External citations: [^1]: Authors. Title. Journal. Year. [DOI](url). Research paper index at docs/research/index.json with topic_index and compound_index for fast lookup.
**Evidence:** SEO Phase 1-4: Research index with 7 papers (NEJM, Nature Medicine, Cell Metabolism) enables authoritative citations. Google sees peer-reviewed sources = E-E-A-T boost. Readers can verify claims via DOI links.
**Helpful Count:** 1 | **Harmful Count:** 0
**Learned From:** seo-orca-phase-1-4-2025-11-07
**Tags:** citations, e-e-a-t, seo, credibility

**Implementation:**
- **Index Location:** docs/research/index.json
- **Structure:**
  - `papers`: [id, file, title, journal, year, doi, key_findings]
  - `topic_index`: topic_slug -> [paper_ids]
  - `compound_index`: compound_slug -> [paper_ids]
- **Citation Formats:**
  - Internal: `[Source: file.md]`
  - External: `[^1]: Authors. Title. Journal. Year. [DOI](url)`

---

### seo-pattern-003: Communication Clarity Quality Gates
**Context:** Ensure content is sophisticated but accessible ('gym buddy test')
**Strategy:** Automated scoring (70+ required): (1) Jargon management 35% - <10 unexplained terms, inline explanations within 100 chars, pattern: term (functional/biological meaning). (2) Analogy presence 20% - detect patterns 'think of it like', 'imagine', 'it's like', at least 1 required. (3) Sentence clarity 30% - 15-20 words average, degrades 3pts per word over 20. (4) Paragraph readability 15% - 2-3 sentences ideal, degrades above 3. Block publication if <70 score, generate specific recommendations.
**Evidence:** SEO Phase 1-4: Gold standard v4 achieved 80/100 score. Clarity gates prevent false completion (draft done but unreadable). Specific actionable feedback ('explain AMPK inline with functional meaning') scales to unlimited content.
**Helpful Count:** 1 | **Harmful Count:** 0
**Learned From:** seo-orca-phase-1-4-2025-11-07
**Tags:** quality, communication, automation, readability

**Implementation:**
- **Module:** scripts/seo_clarity_gates.py
- **Metrics:**
  - Jargon management: 35% weight, <10 unexplained terms
  - Analogy presence: 20% weight, min 1 natural analogy
  - Sentence clarity: 30% weight, 15-20 words avg
  - Paragraph readability: 15% weight, 2-3 sentences avg
- **Threshold:** 70+ overall score required to pass
- **Integrated In:** agents/specialists/seo-quality-guardian.md (MUST run before completion)

---

### seo-pattern-004: Manual Gold Standard to Automated Pipeline Encoding
**Context:** Need to match human-quality output at scale
**Strategy:** Three-phase process: (1) Manual iteration to gold standard (v1: basic output, v2-3: iterative improvements, v4: human-quality, document what changed and why). (2) Extract explicit lessons (citation architecture, communication heuristics, audience understanding, quality thresholds). (3) Encode into automation (update agent prompts with heuristics, create quality gate scripts with thresholds, integrate gates into workflow as MUST-pass, update documentation).
**Evidence:** SEO Phase 1-4: Manual v1→v4 took 4 hours one-time. Lessons extracted: citation architecture, clarity heuristics, jargon inline. Automation encoding: deep reader + clarity gates + communication principles. Result: automated output matches v4 quality. First article pays back implementation cost; every subsequent article is pure gain.
**Helpful Count:** 1 | **Harmful Count:** 0
**Learned From:** seo-orca-phase-1-4-2025-11-07
**Tags:** quality, automation, learning, scaling

**Implementation Phases:**
- **Phase 1 - Manual:** v1→v4 iteration (4 hours one-time)
- **Phase 2 - Extraction:** Document lessons learned (1 hour)
- **Phase 3 - Encoding:** Automate heuristics + gates (2-3 hours)
- **ROI:** Break-even: first automated article. Payback: every subsequent article.

---

### seo-pattern-005: Communication Heuristics for Technical Content
**Context:** Writing for sophisticated audience without sounding clinical
**Strategy:** Apply 'gym buddy test': content should sound like knowledgeable friend explaining, not textbook. Use natural analogies (not forced), explain jargon inline with functional/biological meaning, vary sentence length (15-20 avg), keep paragraphs 2-3 sentences for scannability. Audience: sophisticated biohackers who understand biochemistry but want accessible explanations.
**Evidence:** SEO Phase 1-4: v4 gold standard (3,240 words, 80/100 score) achieved through these heuristics. Encoded into agents/specialists/seo-draft-writer.md communication principles section.
**Helpful Count:** 1 | **Harmful Count:** 0
**Learned From:** seo-orca-phase-1-4-2025-11-07
**Tags:** communication, writing, audience, clarity

**Implementation:**
- **Principles:**
  - Gym buddy test (knowledgeable friend, not textbook)
  - Natural analogies (not forced)
  - Jargon inline with functional meaning
  - 15-20 word sentence average
  - 2-3 sentence paragraphs
- **Audience:** Sophisticated biohackers understanding biochemistry
- **Encoded In:** agents/specialists/seo-draft-writer.md (lines 51-99)

---

## Summary Statistics

- **Total Patterns:** 5
  - Helpful: 5
  - Anti-patterns: 0
  - Neutral: 0
- **All Patterns Have Evidence:** From seo-orca-phase-1-4-2025-11-07
- **Implementation Details:** All patterns include module/function references

---

## Pattern Application Workflow

When generating SEO content, apply patterns in this order:

1. **seo-pattern-002** - Set up external research citation architecture
2. **seo-pattern-001** - Use deep KG file reading for content extraction
3. **seo-pattern-005** - Apply communication heuristics during drafting
4. **seo-pattern-003** - Run clarity quality gates before publication
5. **seo-pattern-004** - When improving quality, use gold standard → automation encoding

---

## Integration Points

- **Research Index:** docs/research/index.json
- **Deep Reader Module:** scripts/seo_kg_deep_reader.py
- **Clarity Gates Module:** scripts/seo_clarity_gates.py
- **Pipeline Integration:** scripts/seo_auto_pipeline.py
- **Agent Updates:**
  - Draft Writer: agents/specialists/seo-draft-writer.md
  - Quality Guardian: agents/specialists/seo-quality-guardian.md
