# Data Analysis Team Playbook

## Team Definition

**Purpose**: Granular, causality-focused data analysis for business insights

**Core Team (5 specialists)**:
1. **merch-lifecycle-analyst** - Product journey mapping and lifecycle analysis
2. **general-performance-analyst** - Baseline and organic performance analysis (foundation)
3. **ads-creative-analyst** - Ad creative, copy, and performance analysis (all periods)
4. **bf-sales-analyst** - Sales event performance analysis (special case)
5. **story-synthesizer** - Synthesize insights into actionable strategy

**Support Agents (as needed)**:
- **verification-agent** - Verify data integrity and calculations
- **quality-validator** - Final quality validation

## Pattern Recognition

### Trigger Keywords
- "BFCM", "Black Friday", "Cyber Monday" → bf-sales-analyst
- "ads", "creative", "copy", "campaign", "CPM", "CTR" → ads-creative-analyst
- "product journey", "lifecycle", "price bands" → merch-lifecycle-analyst
- "strategy", "synthesize", "recommendations" → story-synthesizer
- "baseline", "organic", "non-sale", "steady state" → general-performance-analyst
- "granular", "causality", "not correlation" → Full team

### Request Types

#### Type 1: Full Business Causality Analysis (Complete Picture)
**Keywords**: "full analysis", "complete picture", "all periods", "causality"
**Team**: All relevant specialists in sequence
**Sequence**: merch-lifecycle → ads-creative → general-performance → bf-sales (if sale periods exist) → story-synthesizer
**Example**: "Analyze full year performance - baseline, campaigns, and sales"
**Focus**: Complete business understanding, organic baseline PLUS promotional lifts

#### Type 2: Baseline Causality Analysis (Foundation)
**Keywords**: "baseline", "organic", "steady state", "non-promotional"
**Team**: 3-4 specialists in sequence
**Sequence**: merch-lifecycle → ads-creative (if running non-sale ads) → general-performance → story-synthesizer
**Example**: "Why is organic growth declining?" or "What drives baseline performance?"
**Focus**: Understanding TRUE demand without promotional influence

#### Type 3: Sale Event Causality Analysis
**Keywords**: "BFCM", "sale", "promotional", "event analysis"
**Team**: 4 specialists in sequence
**Sequence**: merch-lifecycle → ads-creative → bf-sales → story-synthesizer
**Example**: "Analyze BFCM performance and identify why it underperformed"
**Focus**: Sale event performance vs baseline, promotional lift analysis

#### Type 4: Product Journey Mapping
**Keywords**: "product journey", "lifecycle", "month by month", "price bands"
**Team**: merch-lifecycle-analyst (lead), general-performance-analyst, story-synthesizer
**Example**: "Map product lifecycles from launch through maturity"
**Focus**: Complete product story, baseline velocity, lifecycle stages

#### Type 5: Ads Performance Analysis
**Keywords**: "ads", "creative", "CPM", "CTR", "copy", "degradation"
**Team**: ads-creative-analyst (lead), story-synthesizer
**Example**: "Deep analysis of ad performance - what creative/copy works?"
**Focus**: Individual ad analysis, creative patterns, timing effects

#### Type 6: Channel Dynamics Analysis
**Keywords**: "channel", "direct vs marketplace", "channel split"
**Team**: general-performance-analyst (lead), merch-lifecycle-analyst, story-synthesizer
**Example**: "How do channels perform in steady-state vs sales?"
**Focus**: Channel preference patterns, natural vs promotional dynamics

## Workflow Pattern

### Phase 1: Data Discovery
- Agents identify relevant data files
- Verify data integrity
- Flag missing/incomplete data

### Phase 2: Granular Analysis
- Individual entity-level analysis (NO premature aggregation)
- Raw units always shown with percentages
- Causality chains identified

### Phase 3: Synthesis
- story-synthesizer creates strategic recommendations
- Cross-validation between agents
- Final quality check

## Critical Rules

1. **NO fabrication** - All numbers must be verified from actual data
2. **Granular first** - Never start with aggregates
3. **Causality focus** - Identify true drivers, not correlations
4. **Evidence required** - Every claim needs data backing
5. **Raw units always** - Never show percentages without counts

## Agent Locations

All agents are in: `agents/specialists/data-analysts/`
- bf-sales-analyst.md
- ads-creative-analyst.md
- merch-lifecycle-analyst.md
- story-synthesizer.md
- general-performance-analyst.md

## Common Failures to Avoid

❌ **Fabricating numbers** - Always verify with grep/read
❌ **Aggregating too early** - Start granular
❌ **Correlation as causation** - Question confounding variables
❌ **Missing channel context** - Always specify direct vs marketplace
❌ **Unverified claims** - Evidence required for everything

## Success Pattern

✅ Read actual data files
✅ Verify every number
✅ Show raw units with context
✅ Identify causality chains
✅ Flag confounding variables
✅ Synthesize into strategy

## Team Dispatch (Task Tool Mapping)

Since custom agents aren't registered in Task tool, map to general-purpose:

### Actual Dispatch:
```
Data Analysis Team (via general-purpose agents):
1. general-purpose (as merch-lifecycle-analyst):
   "Follow methodology in /Users/adilkalam/claude-vibe-code/agents/specialists/data-analysts/merch-lifecycle-analyst.md
    Create master product journeys from creation through all sales, month-by-month
    by price bands and channels. NO aggregation - granular entity-level analysis.
    Verify all numbers with grep/read."

2. general-purpose (as ads-creative-analyst):
   "Follow methodology in /Users/adilkalam/claude-vibe-code/agents/specialists/data-analysts/ads-creative-analyst.md
    Deep GRANULAR analysis of individual ads - CPM/CTR/CPC by creative, copy
    effectiveness (first 8 words), timing degradation. NO campaign rollups.
    Track day-by-day performance."

3. general-purpose (as bf-sales-analyst):
   "Follow methodology in /Users/adilkalam/claude-vibe-code/agents/specialists/data-analysts/bf-sales-analyst.md
    Analyze ACTUAL sales performance, verify every number (no fabrication).
    Layer onto product journeys and ad data. Always show channel splits."

4. general-purpose (as general-performance-analyst):
   "Follow methodology in /Users/adilkalam/claude-vibe-code/agents/specialists/data-analysts/general-performance-analyst.md
    Analyze baseline performance during non-sale periods. Track organic growth,
    seasonality patterns, and steady-state operations. NO fabrication - verify
    all numbers with grep/read."

5. general-purpose (as story-synthesizer):
   "Follow methodology in /Users/adilkalam/claude-vibe-code/agents/specialists/data-analysts/story-synthesizer.md
    Connect ALL dots into causal chains with specific, actionable recommendations.
    Every claim needs evidence. Question assumptions."

6. verification-agent - Verify all numbers match source data
7. quality-validator - Ensure no fabrication, causality focus maintained
```

### How Orca Should Present It:
```
Data Analysis Team:
1. Merch Lifecycle Analyst - Map complete product journeys
2. General Performance Analyst - Analyze baseline/organic performance (foundation)
3. Ads Creative Analyst - Analyze all ad performance (baseline + promotional)
4. BFCM Sales Analyst - Analyze sales events (when applicable)
5. Story Synthesizer - Create strategic recommendations
6. Verification Agent - Verify calculations
7. Quality Validator - Final validation
```