#!/usr/bin/env python3
"""
SEO Clarity Quality Gates (Phase 4)

Implements quality checks for communication clarity:
1. Gym Buddy Test - Can concepts be explained without jargon?
2. Jargon Detection - Are technical terms explained inline?
3. Analogy Detection - Natural analogies present?
4. Clarity Score - Overall readability
"""
import re
from typing import Dict, List, Any, Tuple


# Common peptide/medical jargon that should be explained inline
PEPTIDE_JARGON = {
    "ampk", "mtor", "glp-1", "gip", "glucagon", "lipolysis", "glycolysis",
    "metabolic partitioning", "anabolic", "catabolic", "catabolism", "anabolism",
    "mitochondria", "mitochondrial", "autophagy", "apoptosis", "homeostasis",
    "insulin sensitivity", "glucose metabolism", "fatty acid oxidation",
    "hepatic", "visceral fat", "subcutaneous", "adipose", "lipogenesis",
    "thermogenesis", "ghrelin", "leptin", "peptide", "receptor", "agonist",
    "gastric emptying", "satiety", "tesamorelin", "retatrutide", "semaglutide",
    "tirzepatide", "mots-c", "l-carnitine", "aod-9604", "ss-31"
}


def detect_unexplained_jargon(text: str) -> List[Dict[str, Any]]:
    """
    Detect jargon terms that appear without inline explanation.

    Returns list of issues with line numbers and suggestions.
    """
    issues = []
    lines = text.split('\n')

    for line_num, line in enumerate(lines, start=1):
        # Skip headings, code blocks, citations
        if line.strip().startswith('#') or line.strip().startswith('```'):
            continue
        if line.strip().startswith('[^') or line.strip().startswith('- ['):
            continue

        line_lower = line.lower()

        # Check for jargon terms
        for jargon in PEPTIDE_JARGON:
            if jargon in line_lower:
                # Check if explained inline with parentheses nearby
                # Pattern: "term (explanation)" or "term—explanation"
                jargon_pattern = rf'\b{re.escape(jargon)}\b'
                matches = list(re.finditer(jargon_pattern, line_lower, re.IGNORECASE))

                for match in matches:
                    start = match.start()
                    end = match.end()

                    # Look for explanation within 100 chars after the term
                    context = line[end:end+100]
                    has_explanation = (
                        '(' in context[:20] and ')' in context or
                        '—' in context[:20] or
                        'the ' in context[:30]  # "AMPK the cell's energy sensor"
                    )

                    if not has_explanation:
                        issues.append({
                            "line": line_num,
                            "term": jargon,
                            "context": line.strip()[:100],
                            "severity": "warning",
                            "suggestion": f"Explain '{jargon}' inline with functional/biological meaning"
                        })

    return issues


def detect_analogies(text: str) -> Dict[str, Any]:
    """
    Detect natural analogies in the text.

    Returns count and examples of analogies found.
    """
    analogy_patterns = [
        r"think of it like",
        r"like having",
        r"imagine",
        r"it's like",
        r"similar to",
        r"like a",
        r"as if",
        r"dial",
        r"bank account"
    ]

    analogies_found = []
    lines = text.split('\n')

    for line_num, line in enumerate(lines, start=1):
        line_lower = line.lower()
        for pattern in analogy_patterns:
            if pattern in line_lower:
                analogies_found.append({
                    "line": line_num,
                    "pattern": pattern,
                    "context": line.strip()[:150]
                })

    return {
        "count": len(analogies_found),
        "examples": analogies_found[:5],  # Top 5
        "has_analogies": len(analogies_found) > 0
    }


def calculate_clarity_score(text: str) -> Dict[str, Any]:
    """
    Calculate overall clarity score based on multiple factors.

    Returns score 0-100 and breakdown.
    """
    # Count words and sentences
    word_count = len(re.findall(r'\b\w+\b', text))
    sentences = re.split(r'[.!?]+', text)
    sentence_count = len([s for s in sentences if s.strip()])

    if sentence_count == 0:
        return {"score": 0, "breakdown": {}}

    # Average sentence length (shorter = clearer)
    avg_sentence_length = word_count / sentence_count
    sentence_score = 100 - min(100, max(0, (avg_sentence_length - 15) * 3))

    # Jargon density (lower = clearer)
    jargon_issues = detect_unexplained_jargon(text)
    jargon_density = len(jargon_issues) / (word_count / 100)  # per 100 words
    jargon_score = 100 - min(100, jargon_density * 10)

    # Analogy presence (more = clearer)
    analogies = detect_analogies(text)
    analogy_count = analogies["count"]
    analogy_score = min(100, analogy_count * 20)  # 20 points per analogy, cap at 100

    # Paragraph length check (shorter paragraphs = more readable)
    paragraphs = [p for p in text.split('\n\n') if p.strip() and not p.strip().startswith('#')]
    if paragraphs:
        avg_para_lines = sum(p.count('\n') + 1 for p in paragraphs) / len(paragraphs)
        para_score = 100 - min(100, max(0, (avg_para_lines - 3) * 10))
    else:
        para_score = 50

    # Overall clarity score (weighted average)
    clarity_score = (
        sentence_score * 0.3 +
        jargon_score * 0.35 +
        analogy_score * 0.20 +
        para_score * 0.15
    )

    return {
        "score": round(clarity_score, 1),
        "breakdown": {
            "sentence_clarity": round(sentence_score, 1),
            "jargon_management": round(jargon_score, 1),
            "analogy_presence": round(analogy_score, 1),
            "paragraph_readability": round(para_score, 1)
        },
        "stats": {
            "avg_sentence_length": round(avg_sentence_length, 1),
            "jargon_issues_count": len(jargon_issues),
            "analogy_count": analogy_count,
            "avg_paragraph_lines": round(avg_para_lines, 1) if paragraphs else 0
        }
    }


def gym_buddy_test(text: str) -> Dict[str, Any]:
    """
    Simulate "gym buddy test" - can concepts be explained simply?

    Checks for:
    - Unexplained jargon
    - Lack of analogies for complex concepts
    - Dense academic prose

    Returns pass/fail and specific issues.
    """
    # Check for unexplained jargon
    jargon_issues = detect_unexplained_jargon(text)

    # Check for analogies
    analogies = detect_analogies(text)

    # Check clarity score
    clarity = calculate_clarity_score(text)

    # Determine pass/fail
    passes = (
        len(jargon_issues) < 10 and  # Max 10 unexplained terms
        analogies["has_analogies"] and  # At least one analogy
        clarity["score"] >= 70  # Clarity score 70+
    )

    return {
        "passes": passes,
        "score": clarity["score"],
        "issues": {
            "unexplained_jargon": jargon_issues[:10],  # Top 10
            "needs_analogies": not analogies["has_analogies"],
            "clarity_breakdown": clarity["breakdown"]
        },
        "recommendations": generate_recommendations(jargon_issues, analogies, clarity)
    }


def generate_recommendations(
    jargon_issues: List[Dict],
    analogies: Dict,
    clarity: Dict
) -> List[str]:
    """Generate specific recommendations for improvement."""
    recommendations = []

    if len(jargon_issues) > 10:
        recommendations.append(
            f"⚠️  {len(jargon_issues)} unexplained jargon terms found. "
            "Explain technical terms inline with functional/biological meaning."
        )

    if not analogies["has_analogies"]:
        recommendations.append(
            "⚠️  No analogies detected. Add natural analogies to explain complex concepts "
            "(e.g., 'three dials', 'two bank accounts')."
        )

    if clarity["score"] < 70:
        if clarity["breakdown"]["sentence_clarity"] < 70:
            recommendations.append(
                "⚠️  Sentences too long. Break into shorter, clearer sentences (15-20 words)."
            )
        if clarity["breakdown"]["paragraph_readability"] < 70:
            recommendations.append(
                "⚠️  Paragraphs too dense. Break into 2-3 sentence paragraphs for scannability."
            )

    if not recommendations:
        recommendations.append("✅ Content passes gym buddy test! Clear and accessible.")

    return recommendations


def run_quality_gates(markdown_file: str) -> Dict[str, Any]:
    """
    Run all clarity quality gates on a markdown file.

    Returns comprehensive report with pass/fail and recommendations.
    """
    try:
        with open(markdown_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return {
            "error": f"Failed to read file: {e}",
            "passes": False
        }

    # Run gym buddy test
    gym_buddy_result = gym_buddy_test(content)

    # Get detailed analogy analysis
    analogy_analysis = detect_analogies(content)

    # Get jargon issues
    jargon_issues = detect_unexplained_jargon(content)

    # Get clarity score
    clarity = calculate_clarity_score(content)

    return {
        "file": markdown_file,
        "passes": gym_buddy_result["passes"],
        "overall_score": gym_buddy_result["score"],
        "gym_buddy_test": gym_buddy_result,
        "clarity_metrics": clarity,
        "jargon_analysis": {
            "total_issues": len(jargon_issues),
            "issues": jargon_issues
        },
        "analogy_analysis": analogy_analysis,
        "summary": {
            "passes_quality_gate": gym_buddy_result["passes"],
            "clarity_score": clarity["score"],
            "jargon_issues": len(jargon_issues),
            "analogy_count": analogy_analysis["count"],
            "recommendations": gym_buddy_result["recommendations"]
        }
    }


if __name__ == "__main__":
    import sys
    import json

    if len(sys.argv) < 2:
        print("Usage: python seo_clarity_gates.py <markdown_file>")
        sys.exit(1)

    markdown_file = sys.argv[1]
    result = run_quality_gates(markdown_file)

    # Print summary
    print(f"\n{'='*60}")
    print(f"CLARITY QUALITY GATE REPORT")
    print(f"{'='*60}\n")
    print(f"File: {result['file']}")
    print(f"Status: {'✅ PASS' if result['passes'] else '❌ FAIL'}")
    print(f"Overall Clarity Score: {result['overall_score']}/100\n")

    print("Breakdown:")
    for key, value in result['clarity_metrics']['breakdown'].items():
        print(f"  {key}: {value}/100")

    print(f"\nJargon Issues: {result['jargon_analysis']['total_issues']}")
    print(f"Analogies Found: {result['analogy_analysis']['count']}\n")

    print("Recommendations:")
    for rec in result['summary']['recommendations']:
        print(f"  {rec}")

    # Save detailed JSON report
    json_file = markdown_file.replace('.md', '-clarity-report.json')
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2)

    print(f"\nDetailed report saved to: {json_file}")
