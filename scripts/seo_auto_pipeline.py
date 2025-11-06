#!/usr/bin/env python3
"""
Lightweight SEO research pipeline.

Steps:
1. Retrieve top search results for the target keyword (DuckDuckGo).
2. Fetch and extract readable article text (trafilatura).
3. Generate concise summaries and insight phrases (sumy + RAKE).
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
import pathlib
import re
import sys
from collections import Counter
from typing import Any, Dict, List, Optional

import requests
import trafilatura
from ddgs import DDGS


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


def log(msg: str) -> None:
    ts = dt.datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] {msg}", file=sys.stderr)


def search_articles(keyword: str, max_results: int = 3) -> List[Dict[str, str]]:
    """Fetch top search results using DuckDuckGo (no API key required)."""
    log(f"Searching DuckDuckGo for '{keyword}' …")
    records: List[Dict[str, str]] = []
    with DDGS(verify=False) as ddgs:
        generator = ddgs.text(
            keyword,
            region="wt-wt",
            safesearch="moderate",
            timelimit="m",
            max_results=max_results,
        )
        for result in generator:
            href = result.get("href")
            title = result.get("title") or ""
            snippet = result.get("body") or ""
            if not href or not title:
                continue
            records.append(
                {
                    "title": title.strip(),
                    "url": href.strip(),
                    "snippet": snippet.strip(),
                }
            )
    log(f"Retrieved {len(records)} search hits.")
    return records


def fetch_article_text(url: str) -> Optional[str]:
    """Download and extract the main article text from a URL."""
    try:
        response = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=20)
        response.raise_for_status()
    except requests.RequestException as exc:
        log(f"⚠️  Failed to fetch {url}: {exc}")
        return None

    downloaded = trafilatura.extract(
        response.text,
        include_comments=False,
        include_images=False,
        include_tables=False,
    )
    if not downloaded:
        log(f"⚠️  Could not extract readable text from {url}")
    return downloaded


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
    ensure_nltk_resources()
    tokens = re.findall(r"[A-Za-z][A-Za-z\-]+", text.lower())
    stopwords = {
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
    }
    filtered = [tok for tok in tokens if tok not in stopwords and len(tok) > 3]
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
    """Create a lightweight outline using the top insight phrases."""
    outline = [
        f"Introduction: Overview of {keyword}",
    ]
    for phrase in insights[:4]:
        title = phrase
        title = re.sub(r"^[0-9]+\s*", "", title)
        title = title.capitalize()
        outline.append(title)
    outline.append("Conclusion and next steps")
    return outline


def assemble_report(keyword: str) -> Dict[str, Any]:
    """Run the pipeline and return a structured report."""
    records = search_articles(keyword)

    articles: List[Dict[str, Any]] = []
    combined_corpus_parts: List[str] = []

    for record in records:
        url = record["url"]
        text = fetch_article_text(url)
        if not text:
            continue
        combined_corpus_parts.append(text)
        summary = summarize_text(text)
        insights = extract_insights(text)
        articles.append(
            {
                **record,
                "summary": summary,
                "insights": insights,
                "word_count": len(text.split()),
            }
        )

    combined_corpus = "\n\n".join(combined_corpus_parts)
    combined_summary = summarize_text(combined_corpus, sentences=8) if combined_corpus else ""
    combined_insights = extract_insights(combined_corpus, max_phrases=15) if combined_corpus else []
    keyword_suggestions = suggest_keywords(combined_corpus) if combined_corpus else []
    outline = build_outline(keyword, combined_insights)

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
    }
    return report


def ensure_nltk_resources() -> None:
    """Download required NLTK resources if they are missing."""
    try:
        nltk_data.find("corpora/stopwords")
    except LookupError:
        nltk_download("stopwords")


def save_report(report: Dict[str, Any]) -> pathlib.Path:
    """Persist report to outputs/seo/<keyword>.json."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    keyword_slug = re.sub(r"[^a-zA-Z0-9]+", "-", report["keyword"]).strip("-").lower()
    path = OUTPUT_DIR / f"{keyword_slug or 'keyword'}-report.json"
    path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    log(f"Saved report to {path}")
    return path


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the SEO automation pipeline.")
    parser.add_argument("keyword", help="Target keyword or topic to research.")
    parser.add_argument(
        "--max-results",
        type=int,
        default=3,
        help="Maximum number of search results to analyze.",
    )
    args = parser.parse_args()

    report = assemble_report(args.keyword)
    report_path = save_report(report)
    print(json.dumps({"report_path": str(report_path)}, indent=2))


if __name__ == "__main__":
    main()
