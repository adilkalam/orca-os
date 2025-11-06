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
from typing import Any, Dict, List, Optional

import requests
import trafilatura
from anthropic import Anthropic
from ddgs import DDGS
from openai import OpenAI


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


OPENAI_CLIENT: Optional[OpenAI] = OpenAI() if os.getenv("OPENAI_API_KEY") else None
ANTHROPIC_CLIENT: Optional[Anthropic] = (
    Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY")) if os.getenv("ANTHROPIC_API_KEY") else None
)

GPT_SUMMARIZER_MODEL = os.getenv("SEO_GPT_SUMMARIZER_MODEL", "gpt-5")
GPT_RESEARCH_MODEL = os.getenv("SEO_GPT_RESEARCH_MODEL", "gpt-5")
SONNET_MODEL = os.getenv("SEO_SONNET_MODEL", "claude-3-5-sonnet-20241022")
MAX_SECTION_CHARACTERS = int(os.getenv("SEO_SUMMARY_CHAR_LIMIT", "6000"))


def log(msg: str) -> None:
    ts = dt.datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] {msg}", file=sys.stderr)


def search_articles(keyword: str, max_results: int = 10) -> List[Dict[str, str]]:
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


def gpt_summarize_article(keyword: str, title: str, text: str) -> Optional[Dict[str, Any]]:
    """Use GPT-5 (or configured model) to generate summary and key takeaways."""
    if not OPENAI_CLIENT:
        return None
    snippet = text[:MAX_SECTION_CHARACTERS]
    prompt = (
        "You are an SEO content strategist. Read the article excerpt below and produce:\n"
        "1) A concise 4-6 sentence summary highlighting the central message.\n"
        "2) 5 bullet key takeaways (actionable, fact-oriented).\n"
        "3) Tone notes in 1-2 sentences (e.g., authoritative, clinical, promotional).\n\n"
        f"Target keyword: {keyword}\n"
        f"Article title: {title}\n"
        "Article content:\n"
        "-----------------\n"
        f"{snippet}\n"
        "-----------------\n"
        "Respond strictly as JSON with fields summary, key_takeaways (array), tone."
    )
    try:
        response = OPENAI_CLIENT.responses.create(
            model=GPT_SUMMARIZER_MODEL,
            input=prompt,
            max_output_tokens=600,
        )
        text_output = response.output_text
        data = json.loads(text_output)
        if not isinstance(data, dict):
            raise ValueError("Unexpected GPT summary format.")
        return {
            "summary": data.get("summary", "").strip(),
            "key_takeaways": data.get("key_takeaways", []),
            "tone": data.get("tone", "").strip(),
            "model": GPT_SUMMARIZER_MODEL,
        }
    except Exception as exc:  # pylint: disable=broad-except
        log(f"⚠️  GPT summarizer failed ({exc}); falling back to heuristic summary.")
        return None


def gpt_research_brief(keyword: str, combined_summary: str, insights: List[str]) -> Optional[Dict[str, Any]]:
    """Generate deep-dive research prompts and POV using GPT-5 Pro (OpenAI)."""
    if not OPENAI_CLIENT:
        return None
    joined_insights = ", ".join(insights[:10])
    prompt = (
        "You are an SEO strategist preparing to brief a writer on an article.\n"
        "Given the existing research summary and insight list, produce:\n"
        "- A paragraph 'market_context' describing why the topic matters now.\n"
        "- A bullet list 'angles_to_cover' (<=5) focusing on differentiation opportunities.\n"
        "- A bullet list 'questions_to_answer' (3-5) that the article must address.\n"
        "- A bullet list 'data_points_to_hunt' suggesting statistics or proof points worth sourcing.\n"
        f"Primary keyword: {keyword}\n"
        f"Existing combined summary:\n{combined_summary}\n"
        f"Insight phrases: {joined_insights}\n"
        "Return strictly as JSON with the fields described above."
    )
    try:
        response = OPENAI_CLIENT.responses.create(
            model=GPT_RESEARCH_MODEL,
            input=prompt,
            max_output_tokens=700,
        )
        return json.loads(response.output_text)
    except Exception as exc:  # pylint: disable=broad-except
        log(f"⚠️  GPT research brief failed ({exc}); skipping.")
        return None


def sonnet_research_addendum(keyword: str, combined_summary: str, insights: List[str]) -> Optional[Dict[str, Any]]:
    """Use Claude 3.5 Sonnet to surface narrative hooks and caution flags."""
    if not ANTHROPIC_CLIENT:
        return None
    joined_insights = "; ".join(insights[:10])
    prompt = (
        "You are an editorial strategist partnering with a human writer on a long-form SEO article.\n"
        "Review the summary and insight list and respond in JSON with:\n"
        "- storytelling_hooks: array of up to 4 narrative angles, each 1 sentence.\n"
        "- risk_flags: array of cautions (compliance, medical, legal) the writer must note.\n"
        "- expert_sources: array naming people/roles or organizations worth quoting/interviewing.\n"
        "- refresh_triggers: array of signals that should prompt a future content update.\n"
        f"Keyword: {keyword}\n"
        f"Combined summary:\n{combined_summary}\n"
        f"Insight phrases: {joined_insights}\n"
        "Respond only with JSON."
    )
    try:
        response = ANTHROPIC_CLIENT.messages.create(
            model=SONNET_MODEL,
            max_output_tokens=700,
            system="You build thoughtful editorial plans that balance SEO ambition with brand integrity.",
            messages=[{"role": "user", "content": prompt}],
        )
        # Anthropic returns list of content blocks; pull text
        text_chunks = []
        for block in response.content:
            if block.type == "text":
                text_chunks.append(block.text)
        if not text_chunks:
            raise ValueError("Unexpected Sonnet response format.")
        return json.loads("".join(text_chunks))
    except Exception as exc:  # pylint: disable=broad-except
        log(f"⚠️  Sonnet research addendum failed ({exc}); skipping.")
        return None


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
        gpt_summary = gpt_summarize_article(keyword, record["title"], text)
        summary = gpt_summary["summary"] if gpt_summary and gpt_summary.get("summary") else summarize_text(text)
        insights = extract_insights(text)
        key_takeaways = []
        tone = ""
        summary_model: Optional[str] = None
        if gpt_summary:
            key_takeaways = gpt_summary.get("key_takeaways", [])
            tone = gpt_summary.get("tone", "")
            summary_model = gpt_summary.get("model")

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
    gpt_research = gpt_research_brief(keyword, combined_summary, combined_insights) if combined_summary else None
    sonnet_research = sonnet_research_addendum(keyword, combined_summary, combined_insights) if combined_summary else None

    research_brief: Dict[str, Any] = {}
    if gpt_research:
        research_brief.update(gpt_research)
    if sonnet_research:
        research_brief["storytelling_hooks"] = sonnet_research.get("storytelling_hooks", [])
        research_brief["risk_flags"] = sonnet_research.get("risk_flags", [])
        research_brief["expert_sources"] = sonnet_research.get("expert_sources", [])
        research_brief["refresh_triggers"] = sonnet_research.get("refresh_triggers", [])
    research_models: Dict[str, Optional[str]] = {
        "openai": GPT_RESEARCH_MODEL if gpt_research else None,
        "anthropic": SONNET_MODEL if sonnet_research else None,
    }

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
        "openai_models": {
            "summarizer": GPT_SUMMARIZER_MODEL if OPENAI_CLIENT else None,
            "research": GPT_RESEARCH_MODEL if gpt_research else None,
        },
        "anthropic_models": {
            "research": SONNET_MODEL if sonnet_research else None,
        },
    }
    return report


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
