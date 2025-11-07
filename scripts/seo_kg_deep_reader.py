#!/usr/bin/env python3
"""
Deep Knowledge Graph Source File Reader

Reads complete KG source files (not just 200-char excerpts) and extracts
relevant sections for SEO content generation.
"""

import os
import re
from typing import Any, Dict, List, Optional, Tuple
from pathlib import Path


def parse_markdown_sections(content: str) -> List[Tuple[str, str]]:
    """
    Parse markdown content into sections based on headings.

    Returns list of (section_title, section_content) tuples.
    """
    sections = []
    lines = content.split('\n')
    current_heading = None
    current_content = []

    for line in lines:
        # Check for H1, H2, H3 headings
        heading_match = re.match(r'^(#{1,3})\s+(.+)$', line.strip())
        if heading_match:
            # Save previous section if exists
            if current_heading and current_content:
                sections.append((current_heading, '\n'.join(current_content)))

            # Start new section
            current_heading = heading_match.group(2).strip()
            current_content = []
        elif current_heading:
            # Add to current section content
            current_content.append(line)

    # Add final section
    if current_heading and current_content:
        sections.append((current_heading, '\n'.join(current_content)))

    return sections


def calculate_relevance_score(
    text1: str,
    text2: str,
    keyword: str = ""
) -> float:
    """
    Calculate relevance score between two texts.

    Uses token overlap and keyword presence.
    Returns score 0.0-1.0.
    """
    def tokenize(s: str) -> set:
        return set(re.findall(r'[a-z0-9]+', s.lower()))

    tokens1 = tokenize(text1)
    tokens2 = tokenize(text2)
    keyword_tokens = tokenize(keyword) if keyword else set()

    if not tokens1 or not tokens2:
        return 0.0

    # Jaccard similarity
    intersection = len(tokens1 & tokens2)
    union = len(tokens1 | tokens2)
    base_score = intersection / union if union > 0 else 0.0

    # Bonus for keyword presence
    keyword_bonus = 0.0
    if keyword_tokens:
        keyword_in_text2 = len(keyword_tokens & tokens2) / len(keyword_tokens)
        keyword_bonus = keyword_in_text2 * 0.3  # Up to 30% bonus

    return min(1.0, base_score + keyword_bonus)


def extract_kg_content_for_section(
    section_heading: str,
    section_focus: str,
    knowledge_graph: Dict[str, Any],
    kg_root: str,
    keyword: str = ""
) -> Dict[str, Any]:
    """
    Extract full prose content from KG source files for a specific section.

    Args:
        section_heading: Outline section heading (e.g., "How it works")
        section_focus: Section focus description
        knowledge_graph: Loaded KG JSON
        kg_root: Root path to KG files
        keyword: Primary keyword for relevance scoring

    Returns:
        {
            "content_blocks": [
                {
                    "source_file": "dual-axis-recomp.md",
                    "section": "Metabolic Partitioning",
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
    # Score KG nodes by relevance to section heading
    scored_nodes = []
    for node in knowledge_graph.get("nodes", []):
        label = node.get("label", "")
        excerpt = node.get("source_excerpt", "")

        # Combine heading and focus for relevance matching
        query_text = f"{section_heading} {section_focus}"
        node_text = f"{label} {excerpt}"

        score = calculate_relevance_score(query_text, node_text, keyword)
        scored_nodes.append((score, node))

    # Also check neighbor nodes
    for node in knowledge_graph.get("neighbor_nodes", []):
        label = node.get("label", "")
        excerpt = node.get("source_excerpt", "")
        query_text = f"{section_heading} {section_focus}"
        node_text = f"{label} {excerpt}"
        score = calculate_relevance_score(query_text, node_text, keyword)
        scored_nodes.append((score, node))

    scored_nodes.sort(reverse=True, key=lambda x: x[0])

    # Read top 5 source files completely
    content_blocks = []
    nodes_used = []

    for score, node in scored_nodes[:5]:
        if score < 0.3:  # Relevance threshold
            continue

        source_path = node.get("source")
        if not source_path:
            continue

        # Extract file path (source format may be "file.md:section")
        file_path = source_path.split(':', 1)[0]
        full_path = os.path.join(kg_root, file_path)

        if not os.path.exists(full_path):
            continue

        # Read complete file
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            continue

        # Parse into sections
        sections = parse_markdown_sections(content)

        # Score each section by relevance to heading
        for section_title, section_text in sections:
            section_score = calculate_relevance_score(
                f"{section_heading} {section_focus}",
                f"{section_title} {section_text[:500]}",  # First 500 chars
                keyword
            )

            if section_score > 0.4:  # Section relevance threshold
                word_count = len(section_text.split())
                content_blocks.append({
                    "source_file": file_path,
                    "section": section_title,
                    "content": section_text.strip(),
                    "word_count": word_count,
                    "relevance_score": section_score
                })

        nodes_used.append(node.get("id"))

    # Sort by relevance, return top matches
    content_blocks.sort(reverse=True, key=lambda x: x["relevance_score"])

    return {
        "content_blocks": content_blocks[:5],  # Top 5 most relevant
        "nodes_used": nodes_used,
        "total_words_available": sum(b["word_count"] for b in content_blocks[:5])
    }


def load_research_papers(
    research_index_path: str,
    topic_keywords: List[str]
) -> List[Dict[str, Any]]:
    """
    Load relevant research papers from index based on topic keywords.

    Args:
        research_index_path: Path to research/index.json
        topic_keywords: Keywords to search for (e.g., ["retatrutide", "body recomposition"])

    Returns:
        List of research paper JSON objects
    """
    import json

    if not os.path.exists(research_index_path):
        return []

    try:
        with open(research_index_path, 'r', encoding='utf-8') as f:
            index = json.load(f)
    except Exception:
        return []

    # Find papers matching keywords
    relevant_paper_ids = set()
    topic_index = index.get("topic_index", {})

    for keyword in topic_keywords:
        # Normalize keyword
        norm_key = keyword.lower().replace(' ', '_').replace('-', '_')

        # Check topic index
        for topic_key, paper_ids in topic_index.items():
            if norm_key in topic_key or topic_key in norm_key:
                relevant_paper_ids.update(paper_ids)

    # Load full paper data
    papers = []
    research_root = os.path.dirname(research_index_path)

    for paper in index.get("papers", []):
        if paper["id"] in relevant_paper_ids:
            paper_file = os.path.join(research_root, paper["file"])
            try:
                with open(paper_file, 'r', encoding='utf-8') as f:
                    paper_data = json.load(f)
                    papers.append(paper_data)
            except Exception:
                continue

    return papers


def format_citation(paper: Dict[str, Any], citation_num: int) -> str:
    """
    Format research paper as inline citation.

    Args:
        paper: Paper JSON object
        citation_num: Citation number [^1], [^2], etc.

    Returns:
        Formatted citation string
    """
    authors = ", ".join(paper.get("authors", [])[:3])
    if len(paper.get("authors", [])) > 3:
        authors += ", et al"

    title = paper.get("title", "")
    journal = paper.get("journal", "")
    year = paper.get("year", "")
    url = paper.get("url", "") or paper.get("doi", "")

    citation = f"[^{citation_num}]: {authors}. {title}. *{journal}*. {year}."
    if url:
        citation += f" [{url}]({url})"

    return citation


def extract_key_finding(
    paper: Dict[str, Any],
    query: str
) -> Optional[str]:
    """
    Extract most relevant key finding from paper based on query.

    Args:
        paper: Paper JSON object
        query: Query text to match against

    Returns:
        Most relevant finding string or None
    """
    findings = paper.get("key_findings", [])
    if not findings:
        return None

    # Score findings by relevance to query
    scored_findings = []
    for finding in findings:
        score = calculate_relevance_score(query, finding)
        scored_findings.append((score, finding))

    scored_findings.sort(reverse=True, key=lambda x: x[0])

    if scored_findings and scored_findings[0][0] > 0.3:
        return scored_findings[0][1]

    return findings[0] if findings else None


if __name__ == "__main__":
    # Test functions
    import sys

    if len(sys.argv) < 2:
        print("Usage: python seo_kg_deep_reader.py <kg_json_path>")
        sys.exit(1)

    kg_path = sys.argv[1]

    # Load KG
    with open(kg_path, 'r') as f:
        kg = json.load(f)

    # Test extraction
    kg_root = "/Users/adilkalam/Desktop/OBDN/obdn_site/docs"
    result = extract_kg_content_for_section(
        section_heading="How it works",
        section_focus="Mechanisms & pathways",
        knowledge_graph=kg,
        kg_root=kg_root,
        keyword="retatrutide recomp lean mass"
    )

    print(f"Found {len(result['content_blocks'])} content blocks")
    print(f"Total words available: {result['total_words_available']}")

    for block in result['content_blocks']:
        print(f"\n---")
        print(f"Source: {block['source_file']}")
        print(f"Section: {block['section']}")
        print(f"Words: {block['word_count']}")
        print(f"Relevance: {block['relevance_score']:.2f}")
        print(f"Preview: {block['content'][:200]}...")
