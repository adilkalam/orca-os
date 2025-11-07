#!/usr/bin/env python3
"""
SERP Analysis Bridge - Converts Ahrefs MCP responses to SERP analysis files

This script is called from Claude Code context after MCP calls are made.
It takes raw MCP response data and creates properly formatted SERP analysis files.

Usage:
    python3 seo_serp_bridge.py \
        --keyword "BPC-157" \
        --overview-response '{"keywords": [...]}' \
        --related-response '{"keywords": [...]}' \
        --output outputs/seo/bpc-157-serp.json
"""

import json
import sys
from pathlib import Path
from typing import Dict, Any, List, Optional
import argparse

# Import data structures from seo_serp_analysis
from seo_serp_analysis import (
    KeywordMetrics,
    SearchIntent,
    RelatedKeyword,
    SERPAnalysis,
    generate_serp_strategy_summary
)


def parse_overview_response(data: Dict[str, Any], keyword: str) -> tuple[KeywordMetrics, SearchIntent, List[str]]:
    """
    Parse Ahrefs keywords-explorer-overview response

    Returns: (KeywordMetrics, SearchIntent, serp_features)
    """
    keywords_data = data.get("keywords", [])
    if not keywords_data:
        raise ValueError(f"No keyword data found in overview response for '{keyword}'")

    kw_data = keywords_data[0]

    # Build metrics
    metrics = KeywordMetrics.from_ahrefs_mcp(kw_data)

    # Build intent
    intents_data = kw_data.get("intents", {})
    intent = SearchIntent.from_ahrefs_mcp(intents_data)

    # Extract SERP features
    serp_features = kw_data.get("serp_features", [])

    return metrics, intent, serp_features


def parse_related_response(data: Dict[str, Any]) -> List[RelatedKeyword]:
    """Parse Ahrefs keywords-explorer-related-terms response"""
    keywords_data = data.get("keywords", [])

    related = []
    for kw_data in keywords_data:
        related.append(RelatedKeyword.from_ahrefs_mcp(kw_data))

    return related


def parse_serp_overview_response(data: Dict[str, Any]) -> tuple[List[str], List[str]]:
    """
    Parse Ahrefs serp-overview-serp-overview response

    Returns: (people_also_ask, top_domains)
    """
    serp_data = data.get("serp", [])

    paa_questions = []
    top_domains = []

    for result in serp_data[:10]:  # Top 10 results
        # Extract domain
        url = result.get("url", "")
        if url:
            try:
                domain = url.split("/")[2]
                if domain and domain not in top_domains:
                    top_domains.append(domain)
            except (IndexError, AttributeError):
                pass

        # Extract PAA if available
        title = result.get("title", "")
        if result.get("serp_feature") == "question" and title:
            paa_questions.append(title)

    return paa_questions, top_domains


def create_serp_analysis(
    keyword: str,
    overview_response: Dict[str, Any],
    related_response: Optional[Dict[str, Any]] = None,
    serp_response: Optional[Dict[str, Any]] = None
) -> SERPAnalysis:
    """
    Create complete SERP analysis from Ahrefs MCP responses

    Args:
        keyword: Target keyword
        overview_response: Response from keywords-explorer-overview
        related_response: Response from keywords-explorer-related-terms (optional)
        serp_response: Response from serp-overview-serp-overview (optional)

    Returns:
        Complete SERPAnalysis object
    """
    # Parse overview (required)
    metrics, intent, serp_features = parse_overview_response(overview_response, keyword)

    # Parse related keywords (optional)
    related_keywords = []
    if related_response:
        related_keywords = parse_related_response(related_response)

    # Parse SERP overview (optional)
    paa_questions = []
    top_domains = []
    if serp_response:
        paa_questions, top_domains = parse_serp_overview_response(serp_response)

    return SERPAnalysis(
        keyword=keyword,
        metrics=metrics,
        serp_features=serp_features,
        intent=intent,
        related_keywords=related_keywords,
        people_also_ask=paa_questions,
        top_ranking_domains=top_domains
    )


def main():
    parser = argparse.ArgumentParser(
        description="Convert Ahrefs MCP responses to SERP analysis file"
    )
    parser.add_argument("--keyword", required=True, help="Target keyword")
    parser.add_argument("--overview", required=True, help="JSON string from keywords-explorer-overview")
    parser.add_argument("--related", help="JSON string from keywords-explorer-related-terms")
    parser.add_argument("--serp", help="JSON string from serp-overview-serp-overview")
    parser.add_argument("--output", required=True, help="Output JSON file path")
    parser.add_argument("--save-summary", action="store_true", help="Also save markdown summary")

    args = parser.parse_args()

    try:
        # Parse JSON responses
        overview_data = json.loads(args.overview)
        related_data = json.loads(args.related) if args.related else None
        serp_data = json.loads(args.serp) if args.serp else None

        # Create analysis
        analysis = create_serp_analysis(
            keyword=args.keyword,
            overview_response=overview_data,
            related_response=related_data,
            serp_response=serp_data
        )

        # Save to file
        analysis.save(args.output)
        print(f"✓ SERP analysis saved to: {args.output}")

        # Optionally save summary
        if args.save_summary:
            summary_path = args.output.replace(".json", "-summary.md")
            summary = generate_serp_strategy_summary(analysis)
            Path(summary_path).write_text(summary)
            print(f"✓ Summary saved to: {summary_path}")

        # Print key metrics
        print(f"\n{'='*60}")
        print(f"SERP ANALYSIS: {analysis.keyword}")
        print(f"{'='*60}")
        print(f"Search Volume: {analysis.metrics.search_volume:,}/mo")
        print(f"Difficulty: {analysis.metrics.keyword_difficulty}/100 ({analysis.metrics.competition_level})")
        print(f"Traffic Potential: {analysis.metrics.traffic_potential:,}/mo")
        print(f"Primary Intent: {analysis.intent.primary_intent}")
        print(f"Recommend: {'✅ YES' if analysis.metrics.recommend_targeting else '⚠️  Challenging'}")
        print(f"\nSERP Features: {', '.join(analysis.serp_features) if analysis.serp_features else 'None detected'}")
        print(f"Related Keywords: {len(analysis.related_keywords)}")
        print(f"PAA Questions: {len(analysis.people_also_ask)}")
        print(f"{'='*60}\n")

        return 0

    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
