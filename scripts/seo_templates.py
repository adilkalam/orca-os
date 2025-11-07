"""
SEO Templates Module
Provides E-E-A-T signals, citations, disclaimers, and schema markup templates
"""

from typing import Dict, List, Optional
from dataclasses import dataclass


# ============================================================================
# E-E-A-T Templates (Experience, Expertise, Authority, Trust)
# ============================================================================

@dataclass
class AuthorBio:
    """Structured author bio for E-E-A-T signals"""
    name: str
    credentials: List[str]
    experience: str
    specialization: str

    def to_markdown(self) -> str:
        """Generate markdown author bio box"""
        creds = ", ".join(self.credentials) if self.credentials else "Clinical Researcher"
        return f"""
---
**About the Author**

**{self.name}**, {creds}

{self.experience}

*Specialization:* {self.specialization}

---
"""


@dataclass
class MedicalReviewBox:
    """Medical review disclaimer for peptide/medical content"""
    reviewer_name: Optional[str] = None
    reviewer_credentials: Optional[str] = None
    review_date: Optional[str] = None

    def to_markdown(self) -> str:
        """Generate medical review box"""
        if self.reviewer_name:
            return f"""
> **Medical Review**
>
> Reviewed by {self.reviewer_name}, {self.reviewer_credentials or 'MD'}
>
> Last reviewed: {self.review_date or 'Not specified'}
>
> This content has been reviewed for medical accuracy and adherence to current clinical evidence.
"""
        else:
            return """
> **Clinical Review Pending**
>
> This content is pending medical review by a licensed healthcare professional.
>
> Consult a qualified clinician before making any medical decisions based on this information.
"""


class EEATTemplates:
    """E-E-A-T signal templates"""

    @staticmethod
    def expertise_signal(topic: str, credential_type: str = "research") -> str:
        """Generate expertise signal for topic"""
        signals = {
            "research": f"This guide synthesizes peer-reviewed research on {topic} with clinical evidence citations.",
            "clinical": f"Clinical protocols for {topic} based on current medical literature and safety guidelines.",
            "academic": f"Evidence-based analysis of {topic} from academic research and systematic reviews."
        }
        return signals.get(credential_type, signals["research"])

    @staticmethod
    def experience_signal(years: int, field: str) -> str:
        """Generate experience signal"""
        return f"Informed by {years}+ years of {field} research and clinical observation."

    @staticmethod
    def authority_signal(citations_count: int, sources: List[str]) -> str:
        """Generate authority signal from citations"""
        top_sources = ", ".join(sources[:3]) if sources else "peer-reviewed journals"
        return f"Supported by {citations_count} citations from authoritative sources including {top_sources}."

    @staticmethod
    def trust_signal_medical() -> str:
        """Generate trust signal for medical content"""
        return """
**Medical Disclaimer & Trust Signals:**
- This content is for educational purposes only
- Not a substitute for professional medical advice
- Consult a licensed healthcare provider before making treatment decisions
- Information based on current peer-reviewed research
- Updated regularly to reflect latest clinical evidence
"""


# ============================================================================
# Citation Templates
# ============================================================================

class CitationTemplates:
    """Citation formatting templates"""

    @staticmethod
    def pubmed(pmid: str, authors: str, title: str, year: str) -> str:
        """Format PubMed citation"""
        return f"[{authors} ({year}). {title}. PubMed: {pmid}](https://pubmed.ncbi.nlm.nih.gov/{pmid}/)"

    @staticmethod
    def doi(doi: str, authors: str, title: str, year: str, journal: str) -> str:
        """Format DOI citation"""
        return f"{authors} ({year}). {title}. *{journal}*. DOI: [{doi}](https://doi.org/{doi})"

    @staticmethod
    def inline_source(source_name: str, claim: str) -> str:
        """Format inline source reference"""
        return f"{claim} [Source: {source_name}]"

    @staticmethod
    def footnote_style(number: int, authors: str, year: str, title: str) -> str:
        """Format footnote-style citation"""
        return f"[^{number}]: {authors} ({year}). {title}."


# ============================================================================
# Disclaimer Templates
# ============================================================================

class DisclaimerTemplates:
    """Standard disclaimer templates"""

    @staticmethod
    def fda_unapproved_peptide(peptide_name: str) -> str:
        """FDA disclaimer for unapproved peptides"""
        return f"""
> **⚠️ FDA Status Notice**
>
> {peptide_name} is not approved by the FDA for human use. This peptide is available for research purposes only.
>
> Any discussion of therapeutic applications is based on preliminary research and should not be interpreted as medical advice.
"""

    @staticmethod
    def medical_supervision_required() -> str:
        """Medical supervision disclaimer"""
        return """
> **⚠️ Medical Supervision Required**
>
> The protocols described in this article should only be undertaken under the supervision of a qualified healthcare provider.
>
> Self-administration without medical oversight may pose serious health risks.
"""

    @staticmethod
    def educational_only() -> str:
        """Educational use disclaimer"""
        return """
_**Disclaimer:** This content is for educational and informational purposes only. It is not intended to diagnose, treat, cure, or prevent any disease. Consult a licensed healthcare provider before making any changes to your medical treatment or supplementation regimen._
"""

    @staticmethod
    def no_absolute_claims() -> str:
        """Disclaimer against absolute claims"""
        return """
> **Evidence Limitations**
>
> While this article presents current research findings, individual results may vary significantly.
>
> No therapeutic claim should be interpreted as a guarantee of efficacy or safety.
"""


# ============================================================================
# Schema Markup Templates
# ============================================================================

class SchemaTemplates:
    """Schema.org markup templates for SEO"""

    @staticmethod
    def medical_entity(name: str, description: str, category: str = "Drug") -> Dict:
        """Generate MedicalEntity schema"""
        return {
            "@context": "https://schema.org",
            "@type": f"Medical{category}",
            "name": name,
            "description": description,
            "disclaimer": "For educational purposes only. Not FDA approved for human use.",
        }

    @staticmethod
    def article(
        title: str,
        description: str,
        author_name: str,
        date_published: str,
        date_modified: str,
        keywords: List[str]
    ) -> Dict:
        """Generate Article schema"""
        return {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "author": {
                "@type": "Person",
                "name": author_name
            },
            "datePublished": date_published,
            "dateModified": date_modified,
            "keywords": ", ".join(keywords)
        }

    @staticmethod
    def faq(questions_and_answers: List[tuple]) -> Dict:
        """Generate FAQ schema from Q&A pairs"""
        faq_items = []
        for question, answer in questions_and_answers:
            faq_items.append({
                "@type": "Question",
                "name": question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": answer
                }
            })

        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faq_items
        }

    @staticmethod
    def how_to(
        name: str,
        description: str,
        steps: List[Dict[str, str]],
        estimated_time: str = "PT30M"
    ) -> Dict:
        """Generate HowTo schema for protocols"""
        how_to_steps = []
        for idx, step in enumerate(steps, 1):
            how_to_steps.append({
                "@type": "HowToStep",
                "position": idx,
                "name": step.get("name", f"Step {idx}"),
                "text": step.get("text", "")
            })

        return {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": name,
            "description": description,
            "totalTime": estimated_time,
            "step": how_to_steps
        }


# ============================================================================
# Template Application Functions
# ============================================================================

def apply_eeat_to_draft(
    draft: str,
    author_bio: Optional[AuthorBio] = None,
    medical_review: Optional[MedicalReviewBox] = None,
    expertise_topic: Optional[str] = None
) -> str:
    """
    Apply E-E-A-T templates to existing draft

    Args:
        draft: Original markdown draft
        author_bio: Optional author bio to append
        medical_review: Optional medical review box
        expertise_topic: Topic for expertise signal

    Returns:
        Enhanced draft with E-E-A-T signals
    """
    lines = draft.split("\n")

    # Insert medical review box after first H2 if provided
    if medical_review:
        for i, line in enumerate(lines):
            if line.startswith("## ") and i > 0:
                lines.insert(i + 1, medical_review.to_markdown())
                break

    # Add expertise signal after introduction if topic provided
    if expertise_topic:
        expertise = EEATTemplates.expertise_signal(expertise_topic)
        for i, line in enumerate(lines):
            if line.startswith("## ") and "introduction" in line.lower():
                # Find end of intro section
                next_h2 = i + 1
                while next_h2 < len(lines) and not lines[next_h2].startswith("## "):
                    next_h2 += 1
                lines.insert(next_h2, f"\n{expertise}\n")
                break

    # Append author bio at end if provided
    if author_bio:
        lines.append("\n---\n")
        lines.append(author_bio.to_markdown())

    return "\n".join(lines)


def apply_disclaimers_to_draft(
    draft: str,
    peptide_name: Optional[str] = None,
    requires_supervision: bool = True
) -> str:
    """
    Apply standard disclaimers to draft

    Args:
        draft: Original markdown draft
        peptide_name: If provided, add FDA disclaimer for this peptide
        requires_supervision: Whether to add medical supervision disclaimer

    Returns:
        Draft with disclaimers added
    """
    lines = draft.split("\n")

    # Add FDA disclaimer after first H2 if peptide name provided
    if peptide_name:
        fda_disclaimer = DisclaimerTemplates.fda_unapproved_peptide(peptide_name)
        for i, line in enumerate(lines):
            if line.startswith("## ") and i > 0:
                lines.insert(i + 1, fda_disclaimer)
                break

    # Add supervision disclaimer in dosing section
    if requires_supervision:
        supervision_disclaimer = DisclaimerTemplates.medical_supervision_required()
        for i, line in enumerate(lines):
            if "dosing" in line.lower() and line.startswith("## "):
                # Find end of dosing section
                next_h2 = i + 1
                while next_h2 < len(lines) and not lines[next_h2].startswith("## "):
                    next_h2 += 1
                lines.insert(next_h2, supervision_disclaimer)
                break

    # Always add educational disclaimer at the very end
    lines.append("\n")
    lines.append(DisclaimerTemplates.educational_only())

    return "\n".join(lines)


# ============================================================================
# Example Usage
# ============================================================================

if __name__ == "__main__":
    # Example: Create author bio
    author = AuthorBio(
        name="Dr. Sarah Chen",
        credentials=["PhD", "Clinical Researcher"],
        experience="Over 15 years researching peptide therapeutics and regenerative medicine protocols.",
        specialization="Peptide pharmacology and evidence-based protocol development"
    )
    print(author.to_markdown())

    # Example: Create medical review box
    review = MedicalReviewBox(
        reviewer_name="Dr. James Williams",
        reviewer_credentials="MD, FACP",
        review_date="2025-11-06"
    )
    print(review.to_markdown())

    # Example: Generate schema markup
    schema = SchemaTemplates.medical_entity(
        name="BPC-157",
        description="Synthetic peptide derived from body protection compound with potential healing properties",
        category="Drug"
    )
    import json
    print(json.dumps(schema, indent=2))
