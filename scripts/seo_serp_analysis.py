"""
SEO SERP Analysis Module - Data Structures & Utilities

This module provides data structures for SERP analysis.
Actual SERP data collection happens in Claude Code context via MCP,
then gets passed to the pipeline as JSON.
"""

from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
import json
from pathlib import Path


# ============================================================================
# Data Structures
# ============================================================================

@dataclass
class KeywordMetrics:
    """Core keyword metrics from Ahrefs"""
    keyword: str
    search_volume: int  # Monthly searches
    keyword_difficulty: int  # 0-100
    cpc: Optional[float]  # Cost per click (USD)
    traffic_potential: int  # Estimated monthly traffic if ranked #1
    parent_topic: Optional[str]  # Broader topic this keyword belongs to
    global_volume: int  # Global search volume
    clicks: Optional[int] = None  # Average monthly clicks
    cps: Optional[float] = None  # Clicks per search

    @property
    def competition_level(self) -> str:
        """Human-readable competition level"""
        if self.keyword_difficulty < 20:
            return "low"
        elif self.keyword_difficulty < 40:
            return "medium"
        elif self.keyword_difficulty < 60:
            return "hard"
        else:
            return "very hard"

    @property
    def recommend_targeting(self) -> bool:
        """Should we target this keyword?"""
        # Recommend if: reasonable volume + not too difficult
        return self.search_volume >= 10 and self.keyword_difficulty < 70

    @classmethod
    def from_ahrefs_mcp(cls, data: Dict[str, Any]) -> "KeywordMetrics":
        """Create from Ahrefs MCP response data"""
        # CPC comes in cents, convert to dollars
        cpc = data.get("cpc")
        if cpc is not None:
            cpc = cpc / 100.0  # Convert cents to dollars

        return cls(
            keyword=data.get("keyword", ""),
            search_volume=data.get("volume", 0),
            keyword_difficulty=data.get("difficulty", 0),
            cpc=cpc,
            traffic_potential=data.get("traffic_potential", 0),
            parent_topic=data.get("parent_topic"),
            global_volume=data.get("global_volume", 0),
            clicks=data.get("clicks"),
            cps=data.get("cps")
        )


@dataclass
class SearchIntent:
    """Search intent breakdown"""
    informational: bool = False
    navigational: bool = False
    commercial: bool = False
    transactional: bool = False
    branded: bool = False
    local: bool = False

    @classmethod
    def from_ahrefs_mcp(cls, data: Dict[str, bool]) -> "SearchIntent":
        """Create from Ahrefs MCP intents object"""
        return cls(
            informational=data.get("informational", False),
            navigational=data.get("navigational", False),
            commercial=data.get("commercial", False),
            transactional=data.get("transactional", False),
            branded=data.get("branded", False),
            local=data.get("local", False)
        )

    @property
    def primary_intent(self) -> str:
        """Get primary search intent"""
        if self.transactional:
            return "transactional"
        elif self.commercial:
            return "commercial"
        elif self.navigational:
            return "navigational"
        elif self.informational:
            return "informational"
        elif self.local:
            return "local"
        else:
            return "unknown"


@dataclass
class RelatedKeyword:
    """Related keyword suggestion"""
    keyword: str
    search_volume: int
    keyword_difficulty: int
    relevance_score: Optional[float] = None

    @classmethod
    def from_ahrefs_mcp(cls, data: Dict[str, Any]) -> "RelatedKeyword":
        """Create from Ahrefs MCP response data"""
        return cls(
            keyword=data.get("keyword", ""),
            search_volume=data.get("volume", 0),
            keyword_difficulty=data.get("difficulty", 0),
            relevance_score=data.get("relevance")
        )


@dataclass
class SERPAnalysis:
    """Complete SERP analysis for a keyword"""
    keyword: str
    metrics: KeywordMetrics
    serp_features: List[str]  # SERP feature types present
    intent: SearchIntent
    related_keywords: List[RelatedKeyword]
    people_also_ask: List[str]  # PAA questions (if available)
    top_ranking_domains: List[str]  # Top domains currently ranking

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        return {
            "keyword": self.keyword,
            "metrics": {
                "search_volume": self.metrics.search_volume,
                "keyword_difficulty": self.metrics.keyword_difficulty,
                "competition_level": self.metrics.competition_level,
                "cpc": self.metrics.cpc,
                "traffic_potential": self.metrics.traffic_potential,
                "parent_topic": self.metrics.parent_topic,
                "global_volume": self.metrics.global_volume,
                "clicks": self.metrics.clicks,
                "cps": self.metrics.cps,
                "recommend_targeting": self.metrics.recommend_targeting,
            },
            "intent": {
                "primary": self.intent.primary_intent,
                "informational": self.intent.informational,
                "commercial": self.intent.commercial,
                "transactional": self.intent.transactional,
                "navigational": self.intent.navigational,
                "branded": self.intent.branded,
                "local": self.intent.local,
            },
            "serp_features": self.serp_features,
            "related_keywords": [
                {
                    "keyword": rk.keyword,
                    "volume": rk.search_volume,
                    "difficulty": rk.keyword_difficulty,
                    "relevance": rk.relevance_score,
                }
                for rk in self.related_keywords[:15]  # Top 15
            ],
            "people_also_ask": self.people_also_ask,
            "top_ranking_domains": self.top_ranking_domains[:5],  # Top 5
        }

    @classmethod
    def from_file(cls, filepath: str) -> "SERPAnalysis":
        """Load SERP analysis from JSON file"""
        with open(filepath, 'r') as f:
            data = json.load(f)

        # Reconstruct objects from dict
        metrics_data = data["metrics"]
        metrics = KeywordMetrics(
            keyword=data["keyword"],
            search_volume=metrics_data["search_volume"],
            keyword_difficulty=metrics_data["keyword_difficulty"],
            cpc=metrics_data.get("cpc"),
            traffic_potential=metrics_data["traffic_potential"],
            parent_topic=metrics_data.get("parent_topic"),
            global_volume=metrics_data["global_volume"],
            clicks=metrics_data.get("clicks"),
            cps=metrics_data.get("cps")
        )

        intent_data = data["intent"]
        intent = SearchIntent(
            informational=intent_data.get("informational", False),
            commercial=intent_data.get("commercial", False),
            transactional=intent_data.get("transactional", False),
            navigational=intent_data.get("navigational", False),
            branded=intent_data.get("branded", False),
            local=intent_data.get("local", False)
        )

        related = [
            RelatedKeyword(
                keyword=rk["keyword"],
                search_volume=rk["volume"],
                keyword_difficulty=rk["difficulty"],
                relevance_score=rk.get("relevance")
            )
            for rk in data.get("related_keywords", [])
        ]

        return cls(
            keyword=data["keyword"],
            metrics=metrics,
            serp_features=data.get("serp_features", []),
            intent=intent,
            related_keywords=related,
            people_also_ask=data.get("people_also_ask", []),
            top_ranking_domains=data.get("top_ranking_domains", [])
        )

    def save(self, filepath: str) -> None:
        """Save SERP analysis to JSON file"""
        Path(filepath).parent.mkdir(parents=True, exist_ok=True)
        with open(filepath, 'w') as f:
            json.dump(self.to_dict(), f, indent=2)


# ============================================================================
# Brief Enhancement Functions
# ============================================================================

def enhance_brief_with_serp(
    brief: Dict[str, Any],
    serp_analysis: SERPAnalysis
) -> Dict[str, Any]:
    """
    Enhance content brief with SERP intelligence

    Args:
        brief: Existing brief dictionary
        serp_analysis: SERP analysis data

    Returns:
        Enhanced brief with SERP data
    """
    # Add SERP metrics section
    brief["serp_intelligence"] = {
        "search_volume": serp_analysis.metrics.search_volume,
        "keyword_difficulty": serp_analysis.metrics.keyword_difficulty,
        "competition_level": serp_analysis.metrics.competition_level,
        "traffic_potential": serp_analysis.metrics.traffic_potential,
        "recommend_targeting": serp_analysis.metrics.recommend_targeting,
        "primary_intent": serp_analysis.intent.primary_intent,
        "cpc": serp_analysis.metrics.cpc,
    }

    # Add SERP feature optimization targets
    brief["serp_optimization_targets"] = []

    if "snippet" in serp_analysis.serp_features or "ai_overview" in serp_analysis.serp_features:
        brief["serp_optimization_targets"].append({
            "feature": "Featured Snippet / AI Overview",
            "strategy": "Answer main question concisely in 40-60 words at start of article",
            "priority": "high"
        })

    if "question" in serp_analysis.serp_features and serp_analysis.people_also_ask:
        brief["serp_optimization_targets"].append({
            "feature": "People Also Ask",
            "questions": serp_analysis.people_also_ask[:5],
            "strategy": "Answer each PAA question in dedicated sections with clear headings",
            "priority": "high"
        })

    if "video" in serp_analysis.serp_features or "video_th" in serp_analysis.serp_features:
        brief["serp_optimization_targets"].append({
            "feature": "Video Results",
            "strategy": "Consider embedding relevant video content or creating video guide",
            "priority": "medium"
        })

    if "image" in serp_analysis.serp_features or "image_th" in serp_analysis.serp_features:
        brief["serp_optimization_targets"].append({
            "feature": "Image Pack",
            "strategy": "Include high-quality images with descriptive alt text and captions",
            "priority": "medium"
        })

    if "local_pack" in serp_analysis.serp_features:
        brief["serp_optimization_targets"].append({
            "feature": "Local Pack",
            "strategy": "Include location-specific information and local context",
            "priority": "medium"
        })

    # Add related keywords to target
    if serp_analysis.related_keywords:
        top_related = sorted(
            serp_analysis.related_keywords,
            key=lambda x: x.search_volume,
            reverse=True
        )[:15]

        brief["related_keywords_to_include"] = [
            {
                "keyword": rk.keyword,
                "volume": rk.search_volume,
                "difficulty": rk.keyword_difficulty,
                "priority": "high" if rk.search_volume > 500 else "medium"
            }
            for rk in top_related
        ]

    # Add competitor intelligence
    if serp_analysis.top_ranking_domains:
        brief["top_competitors"] = serp_analysis.top_ranking_domains[:5]

    return brief


def generate_serp_strategy_summary(serp_analysis: SERPAnalysis) -> str:
    """
    Generate human-readable SERP strategy summary

    Args:
        serp_analysis: SERP analysis data

    Returns:
        Markdown-formatted strategy summary
    """
    lines = []
    lines.append(f"## SERP Strategy: {serp_analysis.keyword}")
    lines.append("")

    # Metrics overview
    lines.append("### Keyword Metrics")
    lines.append(f"- **Search Volume:** {serp_analysis.metrics.search_volume:,}/month")
    lines.append(f"- **Difficulty:** {serp_analysis.metrics.keyword_difficulty}/100 ({serp_analysis.metrics.competition_level})")
    lines.append(f"- **Traffic Potential:** {serp_analysis.metrics.traffic_potential:,}/month")
    lines.append(f"- **Primary Intent:** {serp_analysis.intent.primary_intent}")
    if serp_analysis.metrics.cpc:
        lines.append(f"- **CPC:** ${serp_analysis.metrics.cpc:.2f}")
    lines.append(f"- **Recommendation:** {'✅ Target this keyword' if serp_analysis.metrics.recommend_targeting else '⚠️ High difficulty - consider alternatives'}")
    lines.append("")

    # SERP features
    if serp_analysis.serp_features:
        lines.append("### SERP Features Present")
        for feature in serp_analysis.serp_features:
            lines.append(f"- {feature}")
        lines.append("")

    # Optimization targets
    lines.append("### Optimization Priorities")
    if "snippet" in serp_analysis.serp_features or "ai_overview" in serp_analysis.serp_features:
        lines.append("1. **Featured Snippet/AI Overview** - High priority")
        lines.append("   - Provide concise 40-60 word answer at start")
    if "question" in serp_analysis.serp_features:
        lines.append("2. **People Also Ask** - High priority")
        lines.append("   - Address PAA questions in dedicated sections")
    lines.append("")

    # Related keywords
    if serp_analysis.related_keywords:
        lines.append("### Top Related Keywords to Include")
        for i, rk in enumerate(serp_analysis.related_keywords[:10], 1):
            lines.append(f"{i}. **{rk.keyword}** ({rk.search_volume:,}/mo, diff: {rk.keyword_difficulty})")
        lines.append("")

    return "\n".join(lines)


# ============================================================================
# CLI for Testing
# ============================================================================

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage:")
        print("  python seo_serp_analysis.py <serp-json-file>  # Load and display")
        print("\nThis module provides data structures only.")
        print("SERP data collection happens in Claude Code via MCP.")
        sys.exit(1)

    filepath = sys.argv[1]

    try:
        analysis = SERPAnalysis.from_file(filepath)

        print(f"\n{'='*60}")
        print(f"SERP ANALYSIS: {analysis.keyword}")
        print(f"{'='*60}\n")

        print(generate_serp_strategy_summary(analysis))

    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
