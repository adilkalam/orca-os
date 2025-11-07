"""
SEO Metrics Module
Calculates quality metrics for SEO content validation
"""

import re
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
import math


# ============================================================================
# Metric Data Structures
# ============================================================================

@dataclass
class KeywordMetrics:
    """Keyword density and distribution metrics"""
    primary_keyword: str
    density: float
    count: int
    total_words: int
    in_title: bool
    in_meta: bool
    in_h1: bool
    in_first_100_words: bool
    lsi_keywords_found: List[str]


@dataclass
class ReadabilityMetrics:
    """Readability score metrics"""
    flesch_reading_ease: float
    flesch_kincaid_grade: float
    avg_sentence_length: float
    avg_word_length: float
    target_grade_level: Tuple[int, int] = (8, 10)

    @property
    def meets_target(self) -> bool:
        """Check if grade level is within target range"""
        min_grade, max_grade = self.target_grade_level
        return min_grade <= self.flesch_kincaid_grade <= max_grade


@dataclass
class CitationMetrics:
    """Citation coverage metrics"""
    total_citations: int
    total_claims: int
    coverage_ratio: float
    citation_types: Dict[str, int]
    unsupported_sections: List[str]


@dataclass
class StructureMetrics:
    """Content structure and formatting metrics"""
    word_count: int
    h1_count: int
    h2_count: int
    h3_count: int
    paragraph_count: int
    list_count: int
    table_count: int
    internal_links: int
    external_links: int
    images: int


@dataclass
class EEATMetrics:
    """E-E-A-T signal metrics"""
    has_author_bio: bool
    has_medical_review: bool
    has_credentials_mentioned: bool
    has_expertise_signal: bool
    citation_count: int
    authoritative_sources: int
    has_disclaimers: bool


@dataclass
class ContentQualityMetrics:
    """Overall content quality score"""
    uniqueness_score: float  # 0-100, based on repetition detection
    repetition_count: int
    unique_sentences: int
    total_sentences: int


@dataclass
class SEOReport:
    """Comprehensive SEO metrics report"""
    keyword_metrics: KeywordMetrics
    readability_metrics: ReadabilityMetrics
    citation_metrics: CitationMetrics
    structure_metrics: StructureMetrics
    eeat_metrics: EEATMetrics
    quality_metrics: ContentQualityMetrics
    overall_score: float
    issues: List[Dict[str, str]]  # [{"severity": "critical", "issue": "...", "fix": "..."}]


# ============================================================================
# Keyword Analysis
# ============================================================================

class KeywordAnalyzer:
    """Analyze keyword usage and density"""

    @staticmethod
    def calculate_density(text: str, keyword: str) -> KeywordMetrics:
        """
        Calculate keyword density and positioning

        Args:
            text: Full markdown text
            keyword: Primary keyword to analyze

        Returns:
            KeywordMetrics with density and positioning data
        """
        # Clean text for word counting (remove markdown syntax)
        clean_text = KeywordAnalyzer._clean_markdown(text)
        words = clean_text.split()
        total_words = len(words)

        # Count keyword occurrences (case-insensitive, whole phrase)
        keyword_lower = keyword.lower()
        text_lower = clean_text.lower()
        count = text_lower.count(keyword_lower)

        # Calculate density percentage
        keyword_word_count = len(keyword.split())
        density = (count * keyword_word_count / total_words * 100) if total_words > 0 else 0.0

        # Check positioning
        lines = text.split("\n")
        title_line = next((l for l in lines if l.startswith("title:")), "")
        meta_line = next((l for l in lines if l.startswith("description:")), "")
        h1_line = next((l for l in lines if l.startswith("# ")), "")
        first_100_words = " ".join(words[:100])

        in_title = keyword_lower in title_line.lower()
        in_meta = keyword_lower in meta_line.lower()
        in_h1 = keyword_lower in h1_line.lower()
        in_first_100 = keyword_lower in first_100_words.lower()

        return KeywordMetrics(
            primary_keyword=keyword,
            density=round(density, 2),
            count=count,
            total_words=total_words,
            in_title=in_title,
            in_meta=in_meta,
            in_h1=in_h1,
            in_first_100_words=in_first_100,
            lsi_keywords_found=[]  # Will be populated separately
        )

    @staticmethod
    def _clean_markdown(text: str) -> str:
        """Remove markdown syntax for word counting"""
        # Remove frontmatter
        text = re.sub(r'^---\n.*?\n---\n', '', text, flags=re.DOTALL)
        # Remove headers
        text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
        # Remove links but keep text
        text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
        # Remove images
        text = re.sub(r'!\[([^\]]*)\]\([^\)]+\)', '', text)
        # Remove bold/italic
        text = re.sub(r'[*_]{1,2}([^*_]+)[*_]{1,2}', r'\1', text)
        # Remove code blocks
        text = re.sub(r'```.*?```', '', text, flags=re.DOTALL)
        # Remove inline code
        text = re.sub(r'`([^`]+)`', r'\1', text)
        return text


# ============================================================================
# Readability Analysis
# ============================================================================

class ReadabilityAnalyzer:
    """Calculate readability scores"""

    @staticmethod
    def calculate_readability(text: str) -> ReadabilityMetrics:
        """
        Calculate Flesch Reading Ease and Flesch-Kincaid Grade Level

        Args:
            text: Cleaned text (no markdown)

        Returns:
            ReadabilityMetrics with scores
        """
        clean_text = KeywordAnalyzer._clean_markdown(text)

        # Count sentences (split on . ! ?)
        sentences = re.split(r'[.!?]+', clean_text)
        sentences = [s.strip() for s in sentences if s.strip()]
        sentence_count = len(sentences)

        # Count words
        words = clean_text.split()
        word_count = len(words)

        # Count syllables (approximation)
        syllable_count = ReadabilityAnalyzer._count_syllables(clean_text)

        if sentence_count == 0 or word_count == 0:
            return ReadabilityMetrics(
                flesch_reading_ease=0.0,
                flesch_kincaid_grade=0.0,
                avg_sentence_length=0.0,
                avg_word_length=0.0
            )

        # Calculate metrics
        avg_sentence_length = word_count / sentence_count
        avg_syllables_per_word = syllable_count / word_count
        avg_word_length = sum(len(w) for w in words) / word_count

        # Flesch Reading Ease: 206.835 - 1.015(total words/total sentences) - 84.6(total syllables/total words)
        flesch_ease = 206.835 - (1.015 * avg_sentence_length) - (84.6 * avg_syllables_per_word)

        # Flesch-Kincaid Grade Level: 0.39(total words/total sentences) + 11.8(total syllables/total words) - 15.59
        fk_grade = (0.39 * avg_sentence_length) + (11.8 * avg_syllables_per_word) - 15.59

        return ReadabilityMetrics(
            flesch_reading_ease=round(flesch_ease, 1),
            flesch_kincaid_grade=round(fk_grade, 1),
            avg_sentence_length=round(avg_sentence_length, 1),
            avg_word_length=round(avg_word_length, 1)
        )

    @staticmethod
    def _count_syllables(text: str) -> int:
        """
        Approximate syllable count
        """
        words = text.lower().split()
        syllable_count = 0

        for word in words:
            # Remove non-alphabetic characters
            word = re.sub(r'[^a-z]', '', word)
            if not word:
                continue

            # Count vowel groups
            syllables = len(re.findall(r'[aeiouy]+', word))

            # Adjust for silent e
            if word.endswith('e'):
                syllables -= 1

            # Minimum one syllable per word
            if syllables == 0:
                syllables = 1

            syllable_count += syllables

        return syllable_count


# ============================================================================
# Citation Analysis
# ============================================================================

class CitationAnalyzer:
    """Analyze citation coverage"""

    @staticmethod
    def calculate_coverage(text: str) -> CitationMetrics:
        """
        Calculate citation coverage ratio

        Args:
            text: Full markdown text

        Returns:
            CitationMetrics with coverage data
        """
        # Find all citations
        # Patterns: [Source: ...], [Author, Year], PubMed: ..., DOI: ...
        citation_patterns = [
            r'\[Source: [^\]]+\]',
            r'\[[A-Z][^,]+, \d{4}\]',
            r'PubMed: \d+',
            r'DOI: [^\s\]]+',
        ]

        citations = []
        citation_types = {}

        for pattern in citation_patterns:
            matches = re.findall(pattern, text)
            citations.extend(matches)
            if matches:
                pattern_name = pattern.split(':')[0].replace('[', '').replace('\\', '')
                citation_types[pattern_name] = len(matches)

        total_citations = len(citations)

        # Count claims (sentences that make factual assertions)
        # Heuristic: sentences with specific numbers, research terms, or definitive statements
        claim_indicators = [
            r'\d+%',  # Percentages
            r'\d+\s*(mg|mcg|ml|μg)',  # Dosages
            r'(study|research|trial|evidence|data) (shows?|suggests?|indicates?|demonstrates?)',
            r'(increase|decrease|improve|reduce)[sd]',
            r'(significant|effective|beneficial|adverse)',
        ]

        sentences = re.split(r'[.!?]+', text)
        claim_count = 0

        for sentence in sentences:
            for indicator in claim_indicators:
                if re.search(indicator, sentence, re.IGNORECASE):
                    claim_count += 1
                    break  # Count each sentence only once

        # Calculate coverage ratio
        coverage_ratio = (total_citations / claim_count) if claim_count > 0 else 0.0

        # Find sections without citations
        unsupported_sections = CitationAnalyzer._find_unsupported_sections(text)

        return CitationMetrics(
            total_citations=total_citations,
            total_claims=claim_count,
            coverage_ratio=round(coverage_ratio, 2),
            citation_types=citation_types,
            unsupported_sections=unsupported_sections
        )

    @staticmethod
    def _find_unsupported_sections(text: str) -> List[str]:
        """Find H2 sections with no citations"""
        unsupported = []
        sections = re.split(r'^## ', text, flags=re.MULTILINE)

        for section in sections[1:]:  # Skip preamble
            lines = section.split('\n')
            section_title = lines[0].strip()

            # Check if section has any citations
            section_text = '\n'.join(lines[1:])
            has_citation = bool(re.search(r'\[(Source|[A-Z][^,]+, \d{4})\]|PubMed:|DOI:', section_text))

            if not has_citation and len(section_text.split()) > 50:  # Only flag substantial sections
                unsupported.append(section_title)

        return unsupported


# ============================================================================
# Structure Analysis
# ============================================================================

class StructureAnalyzer:
    """Analyze document structure and formatting"""

    @staticmethod
    def calculate_structure(text: str) -> StructureMetrics:
        """
        Calculate structure metrics

        Args:
            text: Full markdown text

        Returns:
            StructureMetrics with counts
        """
        lines = text.split('\n')

        # Count headings
        h1_count = sum(1 for l in lines if l.startswith('# '))
        h2_count = sum(1 for l in lines if l.startswith('## '))
        h3_count = sum(1 for l in lines if l.startswith('### '))

        # Count paragraphs (non-empty lines that aren't headings/lists/code)
        paragraph_count = sum(
            1 for l in lines
            if l.strip()
            and not l.startswith('#')
            and not l.startswith('-')
            and not l.startswith('*')
            and not l.startswith('|')
            and not l.startswith('>')
            and not l.startswith('```')
        )

        # Count lists (lines starting with - or *)
        list_count = sum(1 for l in lines if re.match(r'^\s*[-*]\s+', l))

        # Count tables (lines with |)
        table_count = sum(1 for l in lines if l.strip().startswith('|'))

        # Count links
        internal_links = len(re.findall(r'\[([^\]]+)\]\((?!http)', text))
        external_links = len(re.findall(r'\[([^\]]+)\]\(https?://', text))

        # Count images
        images = len(re.findall(r'!\[', text))

        # Word count
        clean_text = KeywordAnalyzer._clean_markdown(text)
        word_count = len(clean_text.split())

        return StructureMetrics(
            word_count=word_count,
            h1_count=h1_count,
            h2_count=h2_count,
            h3_count=h3_count,
            paragraph_count=paragraph_count,
            list_count=list_count,
            table_count=table_count,
            internal_links=internal_links,
            external_links=external_links,
            images=images
        )


# ============================================================================
# E-E-A-T Analysis
# ============================================================================

class EEATAnalyzer:
    """Analyze E-E-A-T signals"""

    @staticmethod
    def calculate_eeat(text: str, citations: CitationMetrics) -> EEATMetrics:
        """
        Calculate E-E-A-T signal presence

        Args:
            text: Full markdown text
            citations: Citation metrics from CitationAnalyzer

        Returns:
            EEATMetrics with signal flags
        """
        text_lower = text.lower()

        # Check for author bio
        has_author_bio = bool(re.search(r'about the author|author bio|written by', text_lower))

        # Check for medical review
        has_medical_review = bool(re.search(r'medical review|reviewed by|clinical review', text_lower))

        # Check for credentials
        credentials = ['md', 'phd', 'do', 'pharmd', 'rn', 'np', 'pa-c']
        has_credentials = any(cred in text_lower for cred in credentials)

        # Check for expertise signals
        expertise_keywords = ['research', 'clinical', 'evidence', 'peer-reviewed', 'systematic review']
        has_expertise_signal = sum(1 for kw in expertise_keywords if kw in text_lower) >= 2

        # Count authoritative sources (PubMed, DOI, .gov, .edu)
        authoritative = len(re.findall(r'(pubmed|doi:|\.gov|\.edu)', text_lower))

        # Check for disclaimers
        has_disclaimers = bool(re.search(r'disclaimer|educational purposes|consult.*physician', text_lower))

        return EEATMetrics(
            has_author_bio=has_author_bio,
            has_medical_review=has_medical_review,
            has_credentials_mentioned=has_credentials,
            has_expertise_signal=has_expertise_signal,
            citation_count=citations.total_citations,
            authoritative_sources=authoritative,
            has_disclaimers=has_disclaimers
        )


# ============================================================================
# Content Quality Analysis
# ============================================================================

class QualityAnalyzer:
    """Analyze content quality and uniqueness"""

    @staticmethod
    def calculate_quality(text: str) -> ContentQualityMetrics:
        """
        Calculate content quality metrics including repetition detection

        Args:
            text: Full markdown text

        Returns:
            ContentQualityMetrics with uniqueness score
        """
        clean_text = KeywordAnalyzer._clean_markdown(text)

        # Split into sentences
        sentences = re.split(r'[.!?]+', clean_text)
        sentences = [s.strip().lower() for s in sentences if s.strip() and len(s.strip()) > 20]

        total_sentences = len(sentences)
        unique_sentences = len(set(sentences))
        repetition_count = total_sentences - unique_sentences

        # Calculate uniqueness score (0-100)
        uniqueness_score = (unique_sentences / total_sentences * 100) if total_sentences > 0 else 0.0

        return ContentQualityMetrics(
            uniqueness_score=round(uniqueness_score, 1),
            repetition_count=repetition_count,
            unique_sentences=unique_sentences,
            total_sentences=total_sentences
        )


# ============================================================================
# Comprehensive SEO Analysis
# ============================================================================

class SEOAnalyzer:
    """Main SEO analysis orchestrator"""

    @staticmethod
    def analyze(text: str, primary_keyword: str) -> SEOReport:
        """
        Run comprehensive SEO analysis

        Args:
            text: Full markdown draft
            primary_keyword: Primary keyword to analyze

        Returns:
            SEOReport with all metrics and issues
        """
        # Calculate all metrics
        keyword_metrics = KeywordAnalyzer.calculate_density(text, primary_keyword)
        readability_metrics = ReadabilityAnalyzer.calculate_readability(text)
        citation_metrics = CitationAnalyzer.calculate_coverage(text)
        structure_metrics = StructureAnalyzer.calculate_structure(text)
        eeat_metrics = EEATAnalyzer.calculate_eeat(text, citation_metrics)
        quality_metrics = QualityAnalyzer.calculate_quality(text)

        # Identify issues
        issues = SEOAnalyzer._identify_issues(
            keyword_metrics,
            readability_metrics,
            citation_metrics,
            structure_metrics,
            eeat_metrics,
            quality_metrics
        )

        # Calculate overall score (0-100)
        overall_score = SEOAnalyzer._calculate_overall_score(
            keyword_metrics,
            readability_metrics,
            citation_metrics,
            structure_metrics,
            eeat_metrics,
            quality_metrics
        )

        return SEOReport(
            keyword_metrics=keyword_metrics,
            readability_metrics=readability_metrics,
            citation_metrics=citation_metrics,
            structure_metrics=structure_metrics,
            eeat_metrics=eeat_metrics,
            quality_metrics=quality_metrics,
            overall_score=overall_score,
            issues=issues
        )

    @staticmethod
    def _identify_issues(
        keyword: KeywordMetrics,
        readability: ReadabilityMetrics,
        citations: CitationMetrics,
        structure: StructureMetrics,
        eeat: EEATMetrics,
        quality: ContentQualityMetrics
    ) -> List[Dict[str, str]]:
        """Identify issues and generate actionable fixes"""
        issues = []

        # Keyword issues
        if keyword.density < 0.5:
            issues.append({
                "severity": "high",
                "issue": f"Keyword density too low ({keyword.density}%). Target: 0.5-1.5%",
                "fix": f"Add {math.ceil((0.5 * structure.word_count / 100) - keyword.count)} more mentions of '{keyword.primary_keyword}'"
            })
        elif keyword.density > 1.5:
            issues.append({
                "severity": "medium",
                "issue": f"Keyword density too high ({keyword.density}%). Risk of keyword stuffing.",
                "fix": "Replace some keyword mentions with synonyms or related terms"
            })

        if not keyword.in_title:
            issues.append({
                "severity": "critical",
                "issue": "Primary keyword not in title tag",
                "fix": f"Add '{keyword.primary_keyword}' to title"
            })

        if not keyword.in_first_100_words:
            issues.append({
                "severity": "high",
                "issue": "Primary keyword not in first 100 words",
                "fix": "Mention keyword in opening paragraph"
            })

        # Readability issues
        if not readability.meets_target:
            if readability.flesch_kincaid_grade > 10:
                issues.append({
                    "severity": "medium",
                    "issue": f"Readability grade too high ({readability.flesch_kincaid_grade}). Target: 8-10",
                    "fix": "Simplify sentences and reduce technical jargon"
                })
            else:
                issues.append({
                    "severity": "low",
                    "issue": f"Readability grade too low ({readability.flesch_kincaid_grade}). Target: 8-10",
                    "fix": "Add more detailed explanations"
                })

        # Citation issues
        if citations.coverage_ratio < 0.3:
            issues.append({
                "severity": "critical",
                "issue": f"Citation coverage too low ({citations.coverage_ratio:.0%}). Many claims unsupported.",
                "fix": f"Add {math.ceil(citations.total_claims * 0.3 - citations.total_citations)} more citations"
            })

        if citations.unsupported_sections:
            issues.append({
                "severity": "high",
                "issue": f"Sections without citations: {', '.join(citations.unsupported_sections)}",
                "fix": "Add supporting evidence to these sections"
            })

        # Structure issues
        if structure.word_count < 1500:
            issues.append({
                "severity": "high",
                "issue": f"Word count too low ({structure.word_count}). Target: 1500+ words",
                "fix": f"Add {1500 - structure.word_count} more words of valuable content"
            })

        if structure.h1_count != 1:
            issues.append({
                "severity": "medium",
                "issue": f"Should have exactly 1 H1, found {structure.h1_count}",
                "fix": "Ensure only one H1 (main title)"
            })

        if structure.internal_links < 3:
            issues.append({
                "severity": "medium",
                "issue": f"Too few internal links ({structure.internal_links}). Target: 3-5",
                "fix": "Add links to related peptide cards and protocols"
            })

        # E-E-A-T issues
        if not eeat.has_author_bio:
            issues.append({
                "severity": "medium",
                "issue": "No author bio found",
                "fix": "Add author bio with credentials"
            })

        if not eeat.has_medical_review:
            issues.append({
                "severity": "high",
                "issue": "No medical review disclaimer",
                "fix": "Add medical review box or pending review notice"
            })

        if not eeat.has_disclaimers:
            issues.append({
                "severity": "critical",
                "issue": "Missing required disclaimers",
                "fix": "Add FDA status and educational use disclaimers"
            })

        # Quality issues
        if quality.uniqueness_score < 90:
            issues.append({
                "severity": "critical",
                "issue": f"Content repetition detected ({quality.repetition_count} duplicate sentences)",
                "fix": "Remove or rewrite repeated content"
            })

        return issues

    @staticmethod
    def _calculate_overall_score(
        keyword: KeywordMetrics,
        readability: ReadabilityMetrics,
        citations: CitationMetrics,
        structure: StructureMetrics,
        eeat: EEATMetrics,
        quality: ContentQualityMetrics
    ) -> float:
        """Calculate overall SEO quality score (0-100)"""
        score = 0.0

        # Keyword optimization (20 points)
        if 0.5 <= keyword.density <= 1.5:
            score += 10
        if keyword.in_title:
            score += 3
        if keyword.in_meta:
            score += 2
        if keyword.in_h1:
            score += 2
        if keyword.in_first_100_words:
            score += 3

        # Readability (15 points)
        if readability.meets_target:
            score += 15
        elif 7 <= readability.flesch_kincaid_grade <= 11:
            score += 10

        # Citations (20 points)
        if citations.coverage_ratio >= 0.5:
            score += 20
        elif citations.coverage_ratio >= 0.3:
            score += 15
        elif citations.coverage_ratio >= 0.1:
            score += 10

        # Structure (15 points)
        if structure.word_count >= 1500:
            score += 5
        if structure.h1_count == 1:
            score += 2
        if structure.h2_count >= 5:
            score += 2
        if structure.internal_links >= 3:
            score += 3
        if structure.list_count >= 3:
            score += 3

        # E-E-A-T (20 points)
        if eeat.has_author_bio:
            score += 5
        if eeat.has_medical_review:
            score += 5
        if eeat.has_credentials_mentioned:
            score += 3
        if eeat.has_expertise_signal:
            score += 3
        if eeat.has_disclaimers:
            score += 4

        # Quality (10 points)
        score += quality.uniqueness_score / 10

        return round(min(score, 100.0), 1)


# ============================================================================
# CLI for Testing
# ============================================================================

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 3:
        print("Usage: python seo_metrics.py <draft_file> <primary_keyword>")
        sys.exit(1)

    draft_file = sys.argv[1]
    primary_keyword = sys.argv[2]

    with open(draft_file, 'r') as f:
        text = f.read()

    report = SEOAnalyzer.analyze(text, primary_keyword)

    print(f"\n{'='*60}")
    print(f"SEO ANALYSIS REPORT")
    print(f"{'='*60}\n")
    print(f"Overall Score: {report.overall_score}/100\n")

    print(f"KEYWORD METRICS")
    print(f"  Density: {report.keyword_metrics.density}% (target: 0.5-1.5%)")
    print(f"  Count: {report.keyword_metrics.count}")
    print(f"  In title: {report.keyword_metrics.in_title}")
    print(f"  In first 100 words: {report.keyword_metrics.in_first_100_words}\n")

    print(f"READABILITY METRICS")
    print(f"  Grade level: {report.readability_metrics.flesch_kincaid_grade} (target: 8-10)")
    print(f"  Reading ease: {report.readability_metrics.flesch_reading_ease}")
    print(f"  Avg sentence length: {report.readability_metrics.avg_sentence_length} words\n")

    print(f"CITATION METRICS")
    print(f"  Total citations: {report.citation_metrics.total_citations}")
    print(f"  Coverage ratio: {report.citation_metrics.coverage_ratio:.0%}")
    print(f"  Unsupported sections: {len(report.citation_metrics.unsupported_sections)}\n")

    print(f"STRUCTURE METRICS")
    print(f"  Word count: {report.structure_metrics.word_count}")
    print(f"  Internal links: {report.structure_metrics.internal_links}")
    print(f"  External links: {report.structure_metrics.external_links}\n")

    print(f"E-E-A-T SIGNALS")
    print(f"  Author bio: {report.eeat_metrics.has_author_bio}")
    print(f"  Medical review: {report.eeat_metrics.has_medical_review}")
    print(f"  Disclaimers: {report.eeat_metrics.has_disclaimers}\n")

    print(f"QUALITY METRICS")
    print(f"  Uniqueness: {report.quality_metrics.uniqueness_score}%")
    print(f"  Repetitions: {report.quality_metrics.repetition_count}\n")

    if report.issues:
        print(f"ISSUES FOUND ({len(report.issues)})")
        print(f"{'-'*60}")
        for issue in sorted(report.issues, key=lambda x: {"critical": 0, "high": 1, "medium": 2, "low": 3}[x["severity"]]):
            print(f"\n[{issue['severity'].upper()}] {issue['issue']}")
            print(f"Fix: {issue['fix']}")
