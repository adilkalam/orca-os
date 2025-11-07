#!/usr/bin/env python3
"""
Lightweight SEO research pipeline.

Steps:
1. Retrieve top search results for the target keyword (DuckDuckGo).
2. Fetch and extract readable article text (trafilatura).
3. Generate concise summaries and heuristic insight phrases.
4. Aggregate keyword suggestions from extracted content.
5. Persist a structured JSON report for downstream agents.

This script intentionally avoids proprietary APIs so it can run end-to-end
without vendor credentials. It is a thin prototype for the richer multi-agent
workflow described in the marketing-SEO plan.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import pathlib
import re
import sys
from collections import Counter
import shutil
import subprocess
from typing import Any, Dict, List, Optional, Sequence, Tuple

import requests
try:
    import trafilatura  # type: ignore
    HAS_TRAFILATURA = True
except Exception:  # pragma: no cover - optional dependency
    trafilatura = None  # type: ignore
    HAS_TRAFILATURA = False
HAS_ANTHROPIC = False

# DuckDuckGo client import (try multiple module names)
DDGS = None  # type: ignore
HAS_DDGS = False
try:
    from ddgs import DDGS as _DDGS  # type: ignore
    DDGS = _DDGS
    HAS_DDGS = True
except Exception:
    try:
        from duckduckgo_search import DDGS as _DDGS  # type: ignore
        DDGS = _DDGS
        HAS_DDGS = True
    except Exception:
        HAS_DDGS = False
from urllib.parse import urlparse
HAS_OPENAI = False


ROOT = pathlib.Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "outputs" / "seo"
STOPWORDS = {
    "the",
    "and",
    "for",
    "with",
    "that",
    "from",
    "this",
    "into",
    "about",
    "your",
    "have",
    "their",
    "will",
    "such",
    "which",
    "when",
    "been",
    "within",
    "while",
    "where",
    "should",
    "these",
    "those",
    "because",
    "through",
    "using",
    "between",
    "during",
    "before",
    "after",
    "could",
    "would",
    "there",
    "other",
    "over",
    "even",
    "than",
    "each",
    "some",
    "most",
    "also",
    "more",
}
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
)


OPENAI_CLIENT = None
ANTHROPIC_CLIENT = None

GPT_SUMMARIZER_MODEL = None
GPT_RESEARCH_MODEL = None
SONNET_MODEL = None
MAX_SECTION_CHARACTERS = int(os.getenv("SEO_SUMMARY_CHAR_LIMIT", "6000"))

# SERP source quality controls
ALLOWLIST_DOMAINS = {
    "pubmed.ncbi.nlm.nih.gov",
    "pmc.ncbi.nlm.nih.gov",
    "ncbi.nlm.nih.gov",
    "clinicaltrials.gov",
    "cdc.gov",
    "who.int",
    "cochrane.org",
    "ema.europa.eu",
    "medlineplus.gov",
    "jamanetwork.com",
    "nejm.org",
    "thelancet.com",
    "bmj.com",
    "nature.com",
    "sciencedirect.com",
}
SOCIAL_DOMAINS = {
    "tiktok.com",
    "twitter.com",
    "x.com",
    "facebook.com",
    "instagram.com",
    "reddit.com",
    "youtube.com",
}
BLOCKLIST_DOMAINS = {
    # Hard block from scraping/summary
    "tiktok.com",
}
VENDOR_KEYWORDS = {
    "nootropic",
    "peptide",
    "shop",
    "store",
    "buy",
    "vendor",
    "clinic",
    "medspa",
    "cosmicnootropic",
    "elementsarms",
    "peptidesciences",
}


def log(msg: str) -> None:
    ts = dt.datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] {msg}", file=sys.stderr)


def _domain_from_url(url: str) -> str:
    try:
        return urlparse(url).netloc.lower()
    except Exception:
        return ""


def _score_source(domain: str, title: str, snippet: str) -> int:
    d = (domain or "").lower()
    t = (title or "").lower()
    s = (snippet or "").lower()
    score = 0
    if d in BLOCKLIST_DOMAINS:
        return -100
    if d in ALLOWLIST_DOMAINS:
        score += 20
    if d.endswith(".gov") or d.endswith(".edu"):
        score += 12
    if d in SOCIAL_DOMAINS:
        score -= 12
    if any(k in d for k in VENDOR_KEYWORDS):
        score -= 8
    if any(k in t or k in s for k in VENDOR_KEYWORDS):
        score -= 3
    return score


def _ddgs_cli_search(keyword: str, max_results: int) -> List[Dict[str, Any]]:
    """Fallback to the ddgs CLI (pipx-installed) when Python libs are unavailable.

    Returns a list of dicts with keys: title, url, snippet.
    """
    bin_path = shutil.which("ddgs")
    if not bin_path:
        return []
    try:
        # ddgs prints JSON when -o json is used; results are an array of objects
        proc = subprocess.run(
            [bin_path, "text", "-k", keyword, "-m", str(max_results or 10), "-o", "json"],
            check=True,
            capture_output=True,
            text=True,
        )
        raw = proc.stdout.strip() or "[]"
        data = json.loads(raw)
        records: List[Dict[str, Any]] = []
        for r in data:
            title = (r.get("title") or "").strip()
            url = (r.get("href") or r.get("url") or "").strip()
            body = (r.get("body") or r.get("snippet") or "").strip()
            if title and url:
                records.append({"title": title, "url": url, "snippet": body})
        return records
    except Exception as exc:  # pragma: no cover
        log(f"⚠️  ddgs CLI fallback failed: {exc}")
        return []


def search_articles(keyword: str, max_results: int = 10, allowlist_only: bool = False) -> List[Dict[str, str]]:
    """Fetch and filter search results using DuckDuckGo (no API key required)."""
    if not max_results or max_results <= 0:
        return []

    raw: List[Dict[str, Any]] = []
    # Prefer Python library if available
    if HAS_DDGS:
        log(f"Searching DuckDuckGo (python lib) for '{keyword}' …")
        with DDGS(verify=False) as ddgs:  # type: ignore
            generator = ddgs.text(
                keyword,
                region="wt-wt",
                safesearch="moderate",
                timelimit="m",
                max_results=max_results or None,
            )
            for result in generator:
                href = (result.get("href") or "").strip()
                title = (result.get("title") or "").strip()
                snippet = (result.get("body") or "").strip()
                if not href or not title:
                    continue
                domain = _domain_from_url(href)
                score = _score_source(domain, title, snippet)
                raw.append({
                    "title": title,
                    "url": href,
                    "snippet": snippet,
                    "domain": domain,
                    "quality": score,
                })
    else:
        log(f"Searching DuckDuckGo (ddgs CLI) for '{keyword}' …")
        cli_records = _ddgs_cli_search(keyword, max_results)
        for r in cli_records:
            domain = _domain_from_url(r["url"]) if r.get("url") else ""
            score = _score_source(domain, r.get("title", ""), r.get("snippet", ""))
            raw.append({
                "title": r.get("title", ""),
                "url": r.get("url", ""),
                "snippet": r.get("snippet", ""),
                "domain": domain,
                "quality": score,
            })

    log(f"Retrieved {len(raw)} search hits.")
    # Filter if allowlist_only
    if allowlist_only:
        filtered = [r for r in raw if (r["domain"] in ALLOWLIST_DOMAINS or r["domain"].endswith(".gov") or r["domain"].endswith(".edu")) and r["quality"] > -100]
    else:
        filtered = [r for r in raw if r["quality"] > -100]

    # Sort by quality desc, then keep top n
    ordered = sorted(filtered, key=lambda r: r["quality"], reverse=True)
    top = ordered[: max_results or 10]
    dom_counts = Counter(r["domain"] for r in top)
    log(f"Selected {len(top)} results (allowlist_only={allowlist_only}). Top domains: {', '.join(f'{d}:{c}' for d, c in dom_counts.most_common(5))}")

    return [
        {"title": r["title"], "url": r["url"], "snippet": r["snippet"]}
        for r in top
    ]


def fetch_article_text(url: str) -> Optional[str]:
    """Download and extract the main article text from a URL."""
    domain = _domain_from_url(url)
    if domain in BLOCKLIST_DOMAINS:
        log(f"⚠️  Skipping blocked domain {domain}")
        return None
    try:
        response = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=20)
        response.raise_for_status()
    except requests.RequestException as exc:
        log(f"⚠️  Failed to fetch {url}: {exc}")
        return None

    # Prefer trafilatura when available; otherwise fall back to a naive extractor
    if HAS_TRAFILATURA:
        try:
            downloaded = trafilatura.extract(
                response.text,
                include_comments=False,
                include_images=False,
                include_tables=False,
            )
        except Exception:
            downloaded = None
        if downloaded:
            return downloaded

    # Minimal, dependency-free fallback extraction
    def _naive_extract(html: str) -> str:
        # Strip scripts/styles
        html = re.sub(r"<script[\s\S]*?</script>", " ", html, flags=re.IGNORECASE)
        html = re.sub(r"<style[\s\S]*?</style>", " ", html, flags=re.IGNORECASE)
        # Try to isolate <article> if present
        m = re.search(r"<article[\s\S]*?</article>", html, flags=re.IGNORECASE)
        if m:
            html = m.group(0)
        # Remove tags, collapse whitespace
        text = re.sub(r"<[^>]+>", " ", html)
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    extracted = _naive_extract(response.text)
    if not extracted:
        log(f"⚠️  Could not extract readable text from {url}")
        return None
    return extracted


def summarize_text(text: str, sentences: int = 5) -> str:
    """Basic summarization by selecting the most information-dense sentences."""
    sentence_candidates = re.split(r"(?<=[.!?])\s+", text.strip())
    unique_sentences: List[str] = []
    for sent in sentence_candidates:
        cleaned = sent.strip()
        if not cleaned:
            continue
        if cleaned.lower() not in (s.lower() for s in unique_sentences):
            unique_sentences.append(cleaned)
    if not unique_sentences:
        return ""
    # Rank sentences by length as a lightweight proxy for information density.
    ranked = sorted(unique_sentences, key=lambda s: len(s), reverse=True)
    selected = sorted(ranked[:sentences], key=lambda s: unique_sentences.index(s))
    return " ".join(selected)


def split_sentences(text: str) -> List[str]:
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    return [s.strip() for s in sentences if s.strip()]


def simple_summary(text: str, max_sentences: int = 3) -> str:
    sentences = split_sentences(text)
    if not sentences:
        return text.strip()[:280]
    return " ".join(sentences[:max_sentences])


def parse_markdown_sections(text: str, max_sections: int = 12) -> List[Dict[str, Any]]:
    """
    Split markdown into sections keyed by headings.
    Returns up to `max_sections` entries with heading, level, summary, and raw content.
    """
    pattern = re.compile(r"^(#{1,6})\s+(.*)", re.MULTILINE)
    matches = list(pattern.finditer(text))
    sections: List[Dict[str, Any]] = []

    if not matches:
        return [
            {
                "heading": "Overview",
                "level": 1,
                "summary": simple_summary(text),
                "content": text.strip(),
            }
        ]

    for idx, match in enumerate(matches):
        heading_level = len(match.group(1))
        heading_text = match.group(2).strip()
        start = match.end()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
        section_body = text[start:end].strip()
        if not section_body:
            continue
        sections.append(
            {
                "heading": heading_text,
                "level": heading_level,
                "summary": simple_summary(section_body),
                "content": section_body,
            }
        )
        if len(sections) >= max_sections:
            break
    return sections


def extract_insights(text: str, max_phrases: int = 12) -> List[str]:
    """Extract n-gram based insight phrases from the corpus."""
    tokens = [
        tok for tok in re.findall(r"[A-Za-z][A-Za-z\-]+", text.lower()) if tok not in STOPWORDS
    ]
    phrase_counts: Counter[str] = Counter()

    def add_ngrams(n: int) -> None:
        for i in range(len(tokens) - n + 1):
            window = tokens[i : i + n]
            if any(len(word) <= 3 for word in window):
                continue
            phrase_counts[" ".join(window)] += 1

    add_ngrams(3)
    add_ngrams(2)

    candidates = [phrase for phrase, _ in phrase_counts.most_common(max_phrases * 3)]
    insights: List[str] = []
    for phrase in candidates:
        pretty = phrase.title()
        if pretty in insights:
            continue
        insights.append(pretty)
        if len(insights) >= max_phrases:
            break
    return insights


def suggest_keywords(text: str, top_n: int = 20) -> List[Dict[str, Any]]:
    """Generate keyword suggestions using word frequency heuristics."""
    tokens = re.findall(r"[A-Za-z][A-Za-z\-]+", text.lower())
    filtered = [tok for tok in tokens if tok not in STOPWORDS and len(tok) > 3]
    counts = Counter(filtered)
    suggestions = []
    for keyword, score in counts.most_common(top_n):
        suggestions.append(
            {
                "keyword": keyword,
                "score": score,
            }
        )
    return suggestions


def build_outline(keyword: str, insights: List[str]) -> List[str]:
    """Return a stable editorial outline for reliable draft structure.

    Heuristic insights can be noisy; a consistent outline yields better
    first-pass drafts humans can then refine.
    """
    return [
        f"Introduction: Overview of {keyword}",
        f"What is {keyword}?",
        "How it works (mechanisms)",
        "Evidence and research",
        "Dosing, safety, and side effects",
        "Practical use and protocols",
        "Conclusion and next steps",
    ]


def gpt_summarize_article(keyword: str, title: str, text: str) -> Optional[Dict[str, Any]]:
    """Removed external API usage; keep signature for compatibility (returns None)."""
    return None


def load_curated_research(keyword: str, research_paths: Optional[Sequence[str]]) -> List[Dict[str, Any]]:
    """Load curated research markdown docs and summarize their contents."""
    if not research_paths:
        return []
    entries: List[Dict[str, Any]] = []
    for raw_path in research_paths:
        path = pathlib.Path(raw_path).expanduser()
        if not path.exists():
            log(f"⚠️  Research doc not found: {path}")
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except Exception as exc:  # pylint: disable=broad-except
            log(f"⚠️  Failed to read research doc {path}: {exc}")
            continue

        gpt_summary = None
        summary = summarize_text(text)
        entry = {
            "title": path.stem.replace("_", " ").title(),
            "path": str(path),
            "summary": summary,
            "key_takeaways": gpt_summary.get("key_takeaways", []) if gpt_summary else [],
            "tone_notes": gpt_summary.get("tone", "") if gpt_summary else "",
            "sections": parse_markdown_sections(text),
        }
        entries.append(entry)
    return entries


def load_file_excerpt(path: pathlib.Path, line_number: Optional[int], context: int = 2) -> Optional[str]:
    if not path or not path.exists():
        return None
    try:
        text = path.read_text(encoding="utf-8")
    except Exception:
        return None
    lines = text.splitlines()
    if not lines:
        return None
    if not line_number or line_number <= 0:
        return "\n".join(lines[: context * 2 + 1]).strip()
    idx = min(len(lines) - 1, max(0, line_number - 1))
    start = max(0, idx - context)
    end = min(len(lines), idx + context + 1)
    return "\n".join(lines[start:end]).strip()


def load_knowledge_graph(
    kg_path: Optional[str], focus_terms: Sequence[str], base_root: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """Extract knowledge graph nodes/edges relevant to focus terms."""
    if not kg_path:
        return None
    path = pathlib.Path(kg_path).expanduser()
    if not path.exists():
        log(f"⚠️  Knowledge graph file not found: {path}")
        return None

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:  # pylint: disable=broad-except
        log(f"⚠️  Failed to parse knowledge graph: {exc}")
        return None

    focus_terms_clean = sorted({term.lower() for term in focus_terms if term})
    if not focus_terms_clean:
        return None

    nodes = data.get("nodes", [])
    edges = data.get("edges", [])
    node_map = {node["id"]: node for node in nodes}

    def term_matches(value: str) -> bool:
        lower = value.lower()
        return any(term in lower for term in focus_terms_clean)

    relevant_nodes = {
        node_id: node
        for node_id, node in node_map.items()
        if term_matches(node_id) or term_matches(node.get("label", ""))
    }

    related_edges = []
    neighbor_ids = set()
    root_base = pathlib.Path(base_root).expanduser() if base_root else path.parents[2]

    for edge in edges:
        source = edge.get("source", "")
        target = edge.get("target", "")
        relation = edge.get("relation", "")
        edge_relevant = (
            source in relevant_nodes
            or target in relevant_nodes
            or term_matches(source)
            or term_matches(target)
            or term_matches(relation)
        )
        if not edge_relevant:
            continue

        neighbor_ids.add(source)
        neighbor_ids.add(target)

        evidence = edge.get("evidence")
        snippet = None
        if evidence:
            file_part, _, line_part = evidence.partition(":")
            try:
                line_number = int(line_part) if line_part else None
            except ValueError:
                line_number = None
            evidence_path = root_base / file_part if file_part else None
            snippet = load_file_excerpt(evidence_path, line_number) if evidence_path else None
        related_edges.append(
            {
                "source": source,
                "target": target,
                "relation": relation,
                "evidence": evidence,
                "evidence_excerpt": snippet,
            }
        )

    neighbor_nodes = {
        nid: node_map[nid]
        for nid in neighbor_ids
        if nid in node_map and nid not in relevant_nodes
    }

    def serialize_node(node: Dict[str, Any]) -> Dict[str, Any]:
        serialized = {
            "id": node.get("id"),
            "label": node.get("label"),
            "type": node.get("type"),
            "source": node.get("source"),
        }
        source = node.get("source")
        if source:
            file_part, _, line_part = source.partition(":")
            try:
                line_number = int(line_part) if line_part else None
            except ValueError:
                line_number = None
            evidence_path = root_base / file_part if file_part else None
            excerpt = load_file_excerpt(evidence_path, line_number) if evidence_path else None
            if excerpt:
                serialized["source_excerpt"] = excerpt
        return serialized

    return {
        "focus_terms": focus_terms_clean,
        "nodes": [serialize_node(node) for node in relevant_nodes.values()],
        "neighbor_nodes": [serialize_node(node) for node in neighbor_nodes.values()],
        "relations": related_edges,
        "notes": data.get("notes"),
        "generated_at": data.get("generated_at"),
    }


def gpt_research_brief(keyword: str, combined_summary: str, insights: List[str]) -> Optional[Dict[str, Any]]:
    """Removed external API usage; return None to use heuristic-only brief."""
    return None


def sonnet_research_addendum(keyword: str, combined_summary: str, insights: List[str]) -> Optional[Dict[str, Any]]:
    """Removed external API usage; return None to use heuristic-only brief."""
    return None


def generate_brief(
    keyword: str,
    outline: List[str],
    combined_summary: str,
    combined_insights: List[str],
    keyword_suggestions: List[Dict[str, Any]],
    research_brief: Dict[str, Any],
    curated_research: List[Dict[str, Any]],
    knowledge_graph: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    """Assemble a structured brief for human review."""
    secondary_keywords = [entry["keyword"] for entry in keyword_suggestions[:8]]

    base_terms = [term for term in re.split(r"\s+", keyword) if term]
    pair_label = " & ".join(base_terms[:2]) if len(base_terms) >= 2 else keyword
    topic_label = keyword.title()

    # Correct common uppercase acronyms (e.g., ADHD)
    def normalize_title(text: str) -> str:
        text = re.sub(r"\bAdhd\b", "ADHD", text, flags=re.IGNORECASE)
        return text

    title_options = [
        normalize_title(f"{topic_label}: Evidence-Based Alternatives for ADHD and Anxiety"),
        normalize_title(f"How {pair_label} Support Focus and Calm Without Stimulants"),
        normalize_title(f"{pair_label} Guide: Mechanisms, Dosing, and Safety for ADHD & Anxiety"),
    ]

    # Meta description: prefer concise, on-message copy for Semax/Selank; otherwise fallback to heuristic
    meta_seed = combined_summary or " ".join(combined_insights[:3])
    default_meta = simple_summary(meta_seed, max_sentences=2)
    if len(default_meta) > 156:
        default_meta = default_meta[:153].rstrip() + "…"
    if re.search(r"\bsemax\b", keyword, re.IGNORECASE) and re.search(
        r"\bselank\b", keyword, re.IGNORECASE
    ):
        meta_description = (
            "Semax and Selank for ADHD/anxiety: mechanisms (BDNF, GABA), safety, and research‑context intranasal dosing under clinician guidance."
        )
        meta_description = meta_description[:156]
    else:
        meta_description = default_meta

    # Structure focus mapping: provide useful focus notes for our stable outline
    structure = []
    for heading in outline:
        focus_note = ""
        if "Introduction" in heading:
            focus_note = "What & why; clinician oversight"
        elif heading.startswith("What is"):
            focus_note = "Definitions & regulatory status"
        elif "mechanisms" in heading.lower():
            focus_note = (
                "Semax→BDNF; Selank→GABA"
                if (re.search(r"\bsemax\b", keyword, re.I) and re.search(r"\bselank\b", keyword, re.I))
                else "Mechanisms & pathways"
            )
        elif "Evidence" in heading:
            focus_note = "Preclinical + small human studies"
        elif "Dosing" in heading:
            focus_note = "Intranasal ranges; safety; disclaimers"
        elif "Practical" in heading:
            focus_note = "Adjunct use; tracking; supervision"
        elif "Conclusion" in heading:
            focus_note = "Conservative positioning; next steps"
        structure.append({"heading": heading, "focus": focus_note})

    # Angles
    if research_brief.get("angles_to_cover"):
        angles = research_brief.get("angles_to_cover")
    elif re.search(r"\bsemax\b", keyword, re.I) or re.search(r"\bselank\b", keyword, re.I):
        angles = [
            "Adjunct framing (with clinician)",
            "Non-sedating profile vs. benzos",
            "Mechanisms: BDNF (Semax), GABA (Selank)",
            "Evidence limitations and conservative claims",
        ]
    else:
        angles = combined_insights[:4]
    questions = research_brief.get("questions_to_answer") or [
        "What clinical evidence supports Semax or Selank for ADHD symptoms?",
        "How do Semax and Selank differ mechanistically for anxiety relief?",
        "Where do these peptides fit alongside traditional ADHD/anxiety care?",
    ]
    data_points = research_brief.get("data_points_to_hunt") or [
        "BDNF or dopamine modulation data for Semax",
        "Clinical anxiety scales impacted by Selank",
        "Comparative dosing ranges and onset timelines",
    ]
    storytelling_hooks = research_brief.get("storytelling_hooks") or []

    source_material = []
    for entry in curated_research:
        section_names = [section["heading"] for section in entry["sections"][:8]]
        source_material.append(
            {
                "title": entry["title"],
                "path": entry["path"],
                "key_sections": section_names,
                "summary": entry["summary"],
            }
        )

    internal_links: List[Dict[str, Any]] = []
    if knowledge_graph:
        for node in knowledge_graph.get("neighbor_nodes", []):
            if node.get("type") in {"peptide", "protocol", "condition"}:
                internal_links.append(
                    {
                        "id": node.get("id"),
                        "label": node.get("label"),
                        "type": node.get("type"),
                        "source": node.get("source"),
                    }
                )

    review_checklist = [
        "Validate all clinical claims against cited studies (add inline references).",
        "Include medical supervision / FDA status disclaimer for peptide use.",
        "Ensure ADHD guidance positions peptides as adjuncts, not replacements, unless evidence supports otherwise.",
    ]
    if knowledge_graph and knowledge_graph.get("relations"):
        review_checklist.append("Cross-check synergy and mechanism statements with knowledge graph evidence excerpts.")
    if storytelling_hooks:
        review_checklist.append("Select at least one storytelling hook and ensure the narrative delivers on it.")

    return {
        "primary_keyword": keyword,
        "secondary_keywords": secondary_keywords,
        "title_options": title_options,
        "meta_description": meta_description,
        "angles_to_cover": angles,
        "questions_to_answer": questions,
        "data_points_to_hunt": data_points,
        "storytelling_hooks": storytelling_hooks,
        "structure": structure,
        "source_material": source_material,
        "internal_links": internal_links,
        "review_checklist": review_checklist,
    }


def render_brief_markdown(
    keyword: str,
    generated_at: str,
    brief: Dict[str, Any],
    curated_research: List[Dict[str, Any]],
    knowledge_graph: Optional[Dict[str, Any]],
    brief_json_path: Optional[pathlib.Path] = None,
    report_path: Optional[pathlib.Path] = None,
) -> str:
    lines: List[str] = []
    lines.append(f"# Content Brief · {keyword}\n")
    lines.append(f"- Generated at: {generated_at}")
    if report_path:
        lines.append(f"- Research pack: `{report_path}`")
    if brief_json_path:
        lines.append(f"- Brief JSON: `{brief_json_path}`")
    lines.append("")

    lines.append("## Targeting\n")
    lines.append(f"- **Primary keyword:** {brief.get('primary_keyword')}")
    if brief.get("secondary_keywords"):
        secondary = ", ".join(brief["secondary_keywords"])
        lines.append(f"- **Secondary keywords:** {secondary}")
    lines.append("")

    if brief.get("title_options"):
        lines.append("## Title Options\n")
        for title in brief["title_options"]:
            lines.append(f"- {title}")
        lines.append("")

    if brief.get("meta_description"):
        lines.append("## Meta Description\n")
        lines.append(brief["meta_description"])
        lines.append("")

    lines.append("## Outline & Section Focus\n")
    for item in brief.get("structure", []):
        heading = item.get("heading", "")
        focus = item.get("focus") or ""
        lines.append(f"- **{heading}** — {focus}")
    lines.append("")

    if brief.get("angles_to_cover") or brief.get("questions_to_answer"):
        lines.append("## Angles & Questions\n")
        if brief.get("angles_to_cover"):
            lines.append("**Angles to cover:**")
            for angle in brief["angles_to_cover"]:
                lines.append(f"- {angle}")
        if brief.get("questions_to_answer"):
            lines.append("")
            lines.append("**Questions to answer:**")
            for q in brief["questions_to_answer"]:
                lines.append(f"- {q}")
        lines.append("")

    if brief.get("data_points_to_hunt"):
        lines.append("## Data Points to Hunt\n")
        for point in brief["data_points_to_hunt"]:
            lines.append(f"- {point}")
        lines.append("")

    if brief.get("storytelling_hooks"):
        lines.append("## Storytelling Hooks\n")
        for hook in brief["storytelling_hooks"]:
            lines.append(f"- {hook}")
        lines.append("")

    if brief.get("review_checklist"):
        lines.append("## Review Checklist\n")
        for item in brief["review_checklist"]:
            lines.append(f"- [ ] {item}")
        lines.append("")

    if curated_research:
        lines.append("## Curated Research\n")
        for entry in curated_research:
            lines.append(f"- **{entry['title']}** `[source: {entry['path']}]`")
            if entry.get("key_sections"):
                section_list = ", ".join(entry["key_sections"])
                lines.append(f"  - Key sections: {section_list}")
        lines.append("")

    if knowledge_graph:
        lines.append("## Knowledge Graph Highlights\n")
        for node in knowledge_graph.get("nodes", []):
            label = node.get("label", node.get("id"))
            node_type = node.get("type", "")
            lines.append(f"- **{label}** ({node_type})")
            excerpt = node.get("source_excerpt")
            if excerpt:
                lines.append(f"  > {excerpt.replace('|', '')}")
        if knowledge_graph.get("relations"):
            lines.append("")
            lines.append("**Key relations:**")
            for rel in knowledge_graph["relations"][:10]:
                source = rel.get("source")
                target = rel.get("target")
                relation = rel.get("relation")
                lines.append(f"- {source} —[{relation}]→ {target}")
                snippet = rel.get("evidence_excerpt")
                if snippet:
                    lines.append(f"  > {snippet.replace('|', '')}")
        lines.append("")

    return "\n".join(lines).strip() + "\n"


def generate_initial_draft(
    keyword: str,
    brief: Dict[str, Any],
    curated_research: List[Dict[str, Any]],
    knowledge_graph: Optional[Dict[str, Any]],
    *,
    articles: Optional[List[Dict[str, Any]]] = None,
    combined_summary: Optional[str] = None,
    knowledge_root: Optional[str] = None,
) -> Optional[str]:
    def heuristic_draft() -> str:
        # Helpers
        def tok(s: str) -> List[str]:
            return [t for t in re.findall(r"[A-Za-z0-9\-]+", (s or "").lower()) if t]

        def score_text(q_tokens: List[str], text: str) -> int:
            if not text:
                return 0
            tset = set(tok(text))
            return sum(1 for t in q_tokens if t in tset)

        def select_relevant_sections(heading: str, focus: Optional[str], k: int = 3) -> List[Tuple[str, str]]:
            q_tokens = tok(heading) + tok(focus or "") + tok(keyword)
            ranked: List[Tuple[int, str, str]] = []
            for entry in curated_research:
                for section in entry.get("sections", []):
                    h = section.get("heading", "")
                    s = section.get("summary", "")
                    if not h or not s:
                        continue
                    score = score_text(q_tokens, h) * 2 + score_text(q_tokens, s)
                    if score:
                        ranked.append((score, h, s))
            ranked.sort(key=lambda x: x[0], reverse=True)
            return [(h, s) for _, h, s in ranked[:k]]

        def clean_text(s: str) -> str:
            # Strip URLs, bracketed refs, and common noisy markers
            s = re.sub(r"https?://\S+", "", s)
            s = re.sub(r"\[[^\]]+\]", "", s)  # [1], [edit], etc.
            s = re.sub(r"\([^\)]*source[^\)]*\)", "", s, flags=re.IGNORECASE)
            s = re.sub(r"\s+", " ", s)
            return s.strip()

        def compose_paragraph(snippets: List[str], min_sentences: int = 3) -> str:
            sentences: List[str] = []
            for snip in snippets:
                # Split into short sentences and keep the first 2 per snippet
                parts = re.split(r"(?<=[.!?])\s+", snip.strip())
                for p in parts[:2]:
                    cleaned = clean_text(p.strip().rstrip(";,:-"))
                    if cleaned:
                        sentences.append(cleaned)
                if len(sentences) >= min_sentences + 2:
                    break
            # Ensure we have at least a few sentences
            if len(sentences) < min_sentences and brief.get("angles_to_cover"):
                sentences.append(f"Key angle: {brief['angles_to_cover'][0]}.")
            return " ".join(sentences)

        lines: List[str] = []
        # Frontmatter (no byline per user preference)
        title = brief.get("title_options", [keyword])[0]
        description = brief.get("meta_description") or (combined_summary or "").strip()[:156]
        lines.append("---")
        lines.append(f"title: \"{title}\"")
        if description:
            lines.append(f"description: \"{description}\"")
        lines.append(f"date: \"{dt.datetime.now().date()}\"")
        lines.append(f"lastmod: \"{dt.datetime.now().date()}\"")
        lines.append("status: \"draft\"")
        # lightweight tags from keyword tokens
        tags = [t for t in re.findall(r"[A-Za-z0-9]+", keyword.title()) if t]
        if tags:
            lines.append(f"tags: {tags}")
        lines.append("---\n")

        lines.append(f"# {title}\n")

        # Main sections based on planned structure
        intro = brief.get("meta_description") or combined_summary or ""
        # Resolve internal link targets from knowledge graph
        def get_node_path(node_id: str) -> Optional[str]:
            if not knowledge_graph:
                return None
            for node in knowledge_graph.get("nodes", []):
                if node.get("id") == node_id:
                    src = node.get("source")
                    if not src:
                        return None
                    file_part = src.split(":", 1)[0]
                    if knowledge_root:
                        return str(pathlib.Path(knowledge_root) / file_part)
                    return file_part
            return None

        semax_path = get_node_path("peptide:semax")
        selank_path = get_node_path("peptide:selank")
        axis_path = None
        # axis may be listed in nodes or neighbor_nodes
        for coll in ("nodes", "neighbor_nodes"):
            for node in (knowledge_graph.get(coll, []) if knowledge_graph else []):
                if node.get("id") == "axis:cognitive":
                    src = node.get("source")
                    if src:
                        file_part = src.split(":", 1)[0]
                        axis_path = str(pathlib.Path(knowledge_root) / file_part) if knowledge_root else file_part
                        break

        for idx, item in enumerate(brief.get("structure", [])):
            heading = item.get("heading", "Section").strip() or "Section"
            focus = item.get("focus")
            lines.append(f"## {heading}\n")
            # If this is the first section, treat intro as the opening paragraph
            if idx == 0 and intro:
                # Add linked peptide mentions if available
                if semax_path and selank_path:
                    lines.append(
                        f"Two research peptides, [Semax]({semax_path}) and [Selank]({selank_path}), are often discussed as non‑sedating options for focus and calm.\n"
                    )
                lines.append(intro + "\n")
            # Select 2–3 relevant curated snippets and weave into a paragraph
            picks = select_relevant_sections(heading, focus, k=3)
            if picks:
                paragraph = compose_paragraph([s for _, s in picks], min_sentences=3)
                if focus:
                    lines.append(f"*Focus:* {focus}\n")
                lines.append(paragraph + "\n")
            else:
                # Fallback to angles/questions if we can't match curated sections
                if focus:
                    lines.append(f"*Focus:* {focus}\n")
                # Try to use web article summaries when curated research is missing
                used_web = False
                if articles:
                    q_tokens = tok(heading) + tok(focus or "") + tok(keyword)
                    ranked = []
                    for art in articles:
                        s = art.get("summary") or ""
                        if not s:
                            continue
                        score = score_text(q_tokens, art.get("title", "")) * 2 + score_text(q_tokens, s)
                        if score:
                            ranked.append((score, s))
                    ranked.sort(key=lambda x: x[0], reverse=True)
                    if ranked:
                        paragraph = compose_paragraph([s for _, s in ranked[:2]], min_sentences=3)
                        lines.append(paragraph + "\n")
                        used_web = True
                if not used_web:
                    if brief.get("questions_to_answer"):
                        q = brief["questions_to_answer"][0]
                        lines.append(f"We address: {q}\n")
                    elif brief.get("angles_to_cover"):
                        lines.append(f"Key angle: {brief['angles_to_cover'][0]}\n")

            # Add dosing block when we reach Dosing section
            if heading.lower().startswith("dosing"):
                ak_candidates = [
                    pathlib.Path(knowledge_root) / "docs/protocols/ak-4-week-protocol.md"
                ] if knowledge_root else []
                ak_link = None
                for p in ak_candidates:
                    if p.exists():
                        ak_link = str(p)
                        break
                lines.append("Research‑context dosing examples (non‑prescriptive)\n")
                semax_bullet = (
                    f"- Semax (intranasal): 300–900\u2009µg per day in divided doses, reassess after 2–4 weeks. Example program shows 600–900\u2009µg/day blocks."
                )
                selank_bullet = (
                    f"- Selank (intranasal): 200–400\u2009µg per day in divided doses, reassess after 2–4 weeks. Example program shows 300–400\u2009µg/day blocks."
                )
                if ak_link:
                    semax_bullet += f" ([AK 4‑Week Protocol]({ak_link}))"
                    selank_bullet += f" ([AK 4‑Week Protocol]({ak_link}))"
                lines.append(semax_bullet)
                lines.append(selank_bullet + "\n")

        # Evidence appendix from knowledge graph (concise)
        if knowledge_graph and knowledge_graph.get("relations"):
            lines.append("## References & Evidence\n")
            for rel in knowledge_graph["relations"][:6]:
                lines.append(f"- {rel.get('source')} —[{rel.get('relation')}]→ {rel.get('target')}")
                snippet = rel.get("evidence_excerpt")
                if snippet:
                    cleaned = snippet.replace("|", "").strip()
                    if cleaned:
                        lines.append(f"  > {cleaned}")
            lines.append("")

        # Curated sources list for human follow-up
        if curated_research:
            lines.append("## Sources\n")
            for idx, entry in enumerate(curated_research, start=1):
                title = entry.get("title") or entry.get("path")
                path = entry.get("path", "")
                lines.append(f"- [{idx}] {title} ({path})")
            lines.append("")

        # Light disclaimer for medically-adjacent topics
        lines.append(
            "_Disclaimer: Educational content only. Consult a licensed clinician "
            "before making changes to diagnosis or treatment._"
        )

        return "\n".join(lines).strip()

    # External API removed; always use heuristic draft generation
    return heuristic_draft()

    try:
        prompt = (
            "You are writing a long-form, evidence-aware article for educated readers. "
            "Use the provided brief to generate a markdown draft with meaningful H2/H3 structure. "
            "Cite sources inline when possible using simple references (e.g., [Source]). "
            "Maintain a professional, helpful tone and highlight key data points."
        )
        payload = {
            "brief": brief,
            "curated_research": curated_research,
            "knowledge_graph": knowledge_graph,
        }
        pass
    except Exception:
        pass
    return heuristic_draft()


def assemble_report(
    keyword: str,
    research_paths: Optional[Sequence[str]] = None,
    knowledge_graph_path: Optional[str] = None,
    knowledge_root: Optional[str] = None,
    max_results: int = 10,
    extra_terms: Optional[Sequence[str]] = None,
    include_draft: bool = False,
    allowlist_only: bool = False,
) -> Dict[str, Any]:
    """Run the pipeline and return a structured report."""
    records = search_articles(keyword, max_results=max_results, allowlist_only=allowlist_only)

    articles: List[Dict[str, Any]] = []
    combined_corpus_parts: List[str] = []

    for record in records:
        url = record["url"]
        text = fetch_article_text(url)
        if not text:
            continue
        combined_corpus_parts.append(text)
        gpt_summary = gpt_summarize_article(keyword, record["title"], text)
        summary = gpt_summary["summary"] if gpt_summary and gpt_summary.get("summary") else summarize_text(text)
        insights = extract_insights(text)
        key_takeaways = []
        tone = ""
        summary_model: Optional[str] = None
        if gpt_summary:
            key_takeaways = []
            tone = ""
            summary_model = None

        articles.append(
            {
                **record,
                "summary": summary,
                "insights": insights,
                "word_count": len(text.split()),
                "key_takeaways": key_takeaways,
                "tone_notes": tone,
                "summary_model": summary_model or "heuristic",
            }
        )

    combined_corpus = "\n\n".join(combined_corpus_parts)
    combined_summary = summarize_text(combined_corpus, sentences=8) if combined_corpus else ""
    combined_insights = extract_insights(combined_corpus, max_phrases=15) if combined_corpus else []
    keyword_suggestions = suggest_keywords(combined_corpus) if combined_corpus else []
    outline = build_outline(keyword, combined_insights)
    gpt_research = None
    sonnet_research = None

    research_brief: Dict[str, Any] = {}
    # Heuristic-only research brief; leave empty dict and rely on outline/insights
    research_models: Dict[str, Optional[str]] = {"openai": None, "anthropic": None}

    curated_research = load_curated_research(keyword, research_paths)

    keyword_terms = re.findall(r"[A-Za-z0-9\-\+]+", keyword.lower())
    focus_terms = [term for term in keyword_terms if term]
    if extra_terms:
        focus_terms.extend(term.lower() for term in extra_terms if term)
    for entry in curated_research:
        for token in re.findall(r"[A-Za-z0-9\-\+]+", entry["title"].lower()):
            if token not in focus_terms:
                focus_terms.append(token)
    focus_terms = sorted(dict.fromkeys(focus_terms))

    knowledge_graph = load_knowledge_graph(knowledge_graph_path, focus_terms, knowledge_root)

    brief = generate_brief(
        keyword=keyword,
        outline=outline,
        combined_summary=combined_summary,
        combined_insights=combined_insights,
        keyword_suggestions=keyword_suggestions,
        research_brief=research_brief,
        curated_research=curated_research,
        knowledge_graph=knowledge_graph,
    )

    initial_draft = generate_initial_draft(
        keyword=keyword,
        brief=brief,
        curated_research=curated_research,
        knowledge_graph=knowledge_graph,
        articles=articles,
        combined_summary=combined_summary,
        knowledge_root=knowledge_root,
    ) if include_draft else None

    report: Dict[str, Any] = {
        "keyword": keyword,
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "source": "seo_auto_pipeline",
        "articles_analyzed": len(articles),
        "articles": articles,
        "combined_summary": combined_summary,
        "combined_insights": combined_insights,
        "outline": outline,
        "keyword_suggestions": keyword_suggestions,
        "research_brief": research_brief or None,
        "curated_research": curated_research,
        "knowledge_graph": knowledge_graph,
        "focus_terms": focus_terms,
        "brief": brief,
        "initial_draft": initial_draft,
        "openai_models": {"article_summarizer": None, "research_brief": None},
        "anthropic_models": {"research_brief": None},
    }
    return report


def save_report(report: Dict[str, Any]) -> Tuple[pathlib.Path, Optional[pathlib.Path], Optional[pathlib.Path], Optional[pathlib.Path]]:
    """Persist report and brief to outputs/seo/."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    keyword_slug = re.sub(r"[^a-zA-Z0-9]+", "-", report["keyword"]).strip("-").lower()
    path = OUTPUT_DIR / f"{keyword_slug or 'keyword'}-report.json"
    path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    log(f"Saved report to {path}")

    brief_path: Optional[pathlib.Path] = None
    brief_markdown_path: Optional[pathlib.Path] = None
    brief = report.get("brief")
    if brief:
        brief_payload = {
            "keyword": report["keyword"],
            "generated_at": report["generated_at"],
            "brief": brief,
            "focus_terms": report.get("focus_terms"),
            "knowledge_graph": report.get("knowledge_graph"),
            "source_report": str(path),
        }
        brief_path = OUTPUT_DIR / f"{keyword_slug or 'keyword'}-brief.json"
        brief_path.write_text(json.dumps(brief_payload, indent=2), encoding="utf-8")
        log(f"Saved brief to {brief_path}")

        brief_markdown = render_brief_markdown(
            keyword=report["keyword"],
            generated_at=report["generated_at"],
            brief=brief,
            curated_research=report.get("curated_research", []),
            knowledge_graph=report.get("knowledge_graph"),
            brief_json_path=brief_path,
            report_path=path,
        )
        brief_markdown_path = OUTPUT_DIR / f"{keyword_slug or 'keyword'}-brief.md"
        brief_markdown_path.write_text(brief_markdown, encoding="utf-8")
        log(f"Saved brief markdown to {brief_markdown_path}")

    draft_path: Optional[pathlib.Path] = None
    draft_content = report.get("initial_draft")
    if draft_content:
        draft_path = OUTPUT_DIR / f"{keyword_slug or 'keyword'}-draft.md"
        draft_path.write_text(draft_content, encoding="utf-8")
        log(f"Saved automated draft to {draft_path}")

    return path, brief_path, brief_markdown_path, draft_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the SEO automation pipeline.")
    parser.add_argument("keyword", help="Target keyword or topic to research.")
    parser.add_argument(
        "--max-results",
        type=int,
        default=10,
        help="Maximum number of search results to analyze.",
    )
    parser.add_argument(
        "--research-doc",
        action="append",
        dest="research_docs",
        help="Path to curated research markdown file (can be supplied multiple times).",
    )
    parser.add_argument(
        "--knowledge-graph",
        dest="knowledge_graph",
        help="Path to knowledge graph JSON file.",
    )
    parser.add_argument(
        "--knowledge-root",
        dest="knowledge_root",
        help="Root directory for resolving knowledge graph evidence paths.",
    )
    parser.add_argument(
        "--focus-term",
        action="append",
        dest="focus_terms",
        help="Additional focus terms to include when querying the knowledge graph.",
    )
    parser.add_argument(
        "--draft",
        action="store_true",
        dest="generate_draft",
        help="Generate an automated first-pass draft (heuristic, no APIs).",
    )
    parser.add_argument(
        "--allowlist-only",
        action="store_true",
        dest="allowlist_only",
        help="Restrict SERP sources to allowlisted/gov/edu domains.",
    )
    args = parser.parse_args()

    report = assemble_report(
        keyword=args.keyword,
        research_paths=args.research_docs,
        knowledge_graph_path=args.knowledge_graph,
        knowledge_root=args.knowledge_root,
        max_results=args.max_results,
        extra_terms=args.focus_terms,
        include_draft=args.generate_draft,
        allowlist_only=args.allowlist_only,
    )
    report_path, brief_json_path, brief_markdown_path, draft_path = save_report(report)
    output_payload = {"report_path": str(report_path)}
    if brief_json_path:
        output_payload["brief_path"] = str(brief_json_path)
    if brief_markdown_path:
        output_payload["brief_markdown_path"] = str(brief_markdown_path)
    if draft_path:
        output_payload["draft_path"] = str(draft_path)
    print(json.dumps(output_payload, indent=2))


if __name__ == "__main__":
    main()
