# Data Analyst Team - Usage Guide

## Overview

A specialized team of 4 data analysis agents for Black Friday/Cyber Monday (BFCM) analytics, designed to process sales, advertising, and merchandising data into decision-ready insights.

## Team Members

### 1. BF Sales Analyst (`bf-sales-analyst`)
**Purpose:** Analyze BFCM sales performance YoY at product and collection levels

**Auto-activates on keywords:**
- "bfcm", "black friday", "cyber monday", "yoy"
- "price band", "discount mix", "channel mix", "aov", "pre-post"

**Key Features:**
- Event window analysis (pre/event/post)
- YoY comparison metrics
- Price-band and channel mix analysis
- AOV/units/revenue deltas
- Simple elasticity calculations by discount bins

**Required inputs:**
- `sales/sales_fact.csv` - sales transactions
- `sales/product_dim.csv` - product dimensions

**Outputs:**
- `reports/analytics/bfcm/YYYY-MM-DD/run-<label>/final/bfcm_sales_yoy.csv`
- `reports/analytics/bfcm/YYYY-MM-DD/run-<label>/final/price_band_mix.csv`
- `reports/analytics/bfcm/YYYY-MM-DD/run-<label>/final/channel_mix.csv`
- `reports/analytics/bfcm/YYYY-MM-DD/run-<label>/final/bfcm_sales_summary.md`

### 2. Ads Creative Analyst (`ads-creative-analyst`)
**Purpose:** Analyze Meta (Facebook/Instagram) ads performance during BFCM

**Auto-activates on keywords:**
- "meta ads", "facebook", "instagram", "creative"
- "campaign", "adset", "roas", "cpc", "bfcm", "scorecard"

**Key Features:**
- CTR/CPC/CPM/CPA/ROAS calculation
- Creative and campaign ranking
- Spend threshold analysis
- KEEP/ITERATE/RETIRE/ADD guidance
- Copy/visual theme annotation

**Required inputs:**
- `bfcm/*reconstructed.csv` or similar Meta ads exports
- Optional: `bfcm/ad_to_product_map.csv` for product mapping

**Outputs:**
- `reports/analytics/bfcm/YYYY-MM-DD/run-<label>/final/ads_unit_econ.csv`
- `reports/analytics/bfcm/YYYY-MM-DD/run-<label>/final/creative_themes.csv`
- `reports/analytics/bfcm/YYYY-MM-DD/run-<label>/final/ads_summary.md`

### 3. Merch Lifecycle Analyst (`merch-lifecycle-analyst`)
**Purpose:** Trace product lifecycle across windows to identify pricing opportunities

**Auto-activates on keywords:**
- "lifecycle", "price band", "discount", "channel mix"
- "under-discounted", "over-discounted", "missed opportunity"

**Key Features:**
- Volume vs discount analysis by window
- Channel mix tracking
- Pricing opportunity flags
- Under/over-discounting detection
- Concrete evidence-based recommendations

**Required inputs:**
- `sales/sales_fact.csv` with realized prices
- `sales/product_dim.csv` with MSRP

**Outputs:**
- `reports/analytics/bfcm/YYYY-MM-DD/run-<label>/final/product_lifecycle.csv`
- `reports/analytics/bfcm/YYYY-MM-DD/run-<label>/final/opportunity_flags.csv`
- `reports/analytics/bfcm/YYYY-MM-DD/run-<label>/final/merch_findings.md`

### 4. Story Synthesizer (`story-synthesizer`)
**Purpose:** Combine outputs from all analysts into executive narrative

**Auto-activates on keywords:**
- "story", "narrative", "synthesis", "exec summary"
- "bfcm summary", "what happened", "why", "next actions"

**Key Features:**
- Executive summary (5-7 bullets)
- What/Why/What-to-do-next structure
- Cross-source citation
- Decision-ready recommendations
- KEEP/ITERATE/RETIRE/ADD framework

**Required inputs:**
- Outputs from other three analysts

**Outputs:**
- `reports/analytics/bfcm/YYYY-MM-DD/run-<label>/final/bfcm_story.md`
- `reports/analytics/bfcm/YYYY-MM-DD/run-<label>/final/appendix_links.md`

## File Organization

All agents follow the standardized file organization policy:

```
reports/
  analytics/
    <topic>/
      <YYYY-MM-DD>/
        run-<run_label>/
          final/
            *.csv, *.md
            manifest.json
            run.log
          inputs/     # only if snapshot_inputs=true
      published/      # optional stable versions
    .tmp/            # intermediates
```

## Standard Parameters

All agents accept these parameters:
- `run_label` - Identifies the run (default varies per agent)
- `keep_intermediates` - Keep intermediate files (default: false)
- `snapshot_inputs` - Copy inputs to final/ (default: false)
- `publish_to_topic` - Copy to published/ (default: false)
- `output_root_override` - Custom output location

## Environment Setup

### Option 1: Default Location
Outputs go to `reports/analytics/` in project directory

### Option 2: Dropbox Integration
```bash
# Set up Dropbox output root
source scripts/analytics/set-output-root.sh
# This sets ANALYTICS_OUTPUT_ROOT to ~/Dropbox/MM x Adil Kalam/minisite/data/outputs
```

## Usage Examples

### Example 1: Analyze BFCM Sales Performance
```
"Analyze our black friday sales yoy performance comparing 2023 vs 2024,
looking at price band mix and channel distribution"
```
→ Triggers `bf-sales-analyst`

### Example 2: Review Meta Ads Creative Performance
```
"Review our Meta ads campaign performance during BFCM, calculate ROAS
and identify which creatives to keep vs retire"
```
→ Triggers `ads-creative-analyst`

### Example 3: Find Pricing Opportunities
```
"Analyze product lifecycle across the BFCM event window to identify
which products were under-discounted or over-discounted"
```
→ Triggers `merch-lifecycle-analyst`

### Example 4: Executive Summary
```
"Create an executive summary narrative of what happened during BFCM,
why it happened, and what we should do next"
```
→ Triggers `story-synthesizer`

### Example 5: Full Analysis Pipeline
```
"Run complete BFCM analysis: sales YoY, ads performance, merchandising
lifecycle, and synthesize into executive story"
```
→ Triggers all four agents in sequence

## Data Requirements

### Minimum Required Files
1. **Sales data:** `sales/sales_fact.csv`
   - Columns: date, order_id, product_key, units, gross_revenue, discount, net_revenue, channel

2. **Product data:** `sales/product_dim.csv`
   - Columns: product_key, product_name, category, season, MSRP

3. **Ads data:** `bfcm/*reconstructed.csv` or similar
   - Columns: date, campaign, adset, ad, impressions, clicks, spend
   - Optional: purchases, revenue (for ROAS)

## Quality Guarantees

All agents provide:
- **Reconciliation checks** - Totals match source within ±0.1%
- **Sample size reporting** - N counts for all metrics
- **Threshold documentation** - All filters/exclusions noted
- **Citation trails** - Every claim linked to source data
- **Manifest tracking** - Complete audit trail in manifest.json

## Troubleshooting

### Issue: Agents not activating
**Solution:** Use the specific keywords listed above or call agents by name

### Issue: Missing data files
**Solution:** Ensure input files are in expected locations with required columns

### Issue: Output location confusion
**Solution:** Check `ANALYTICS_OUTPUT_ROOT` environment variable or use default `reports/analytics/`

## Best Practices

1. **Run in sequence:** Sales → Ads → Lifecycle → Story for complete analysis
2. **Use run labels:** Helps track multiple analysis runs
3. **Keep manifests:** Always generated for reproducibility
4. **Review QC folders:** Check for warnings and unmatched data
5. **Snapshot critical inputs:** Use `snapshot_inputs=true` for important runs

## Support

For issues or questions:
- Check agent definitions in `agents/specialists/data-analysts/`
- Review FILE_ORG_POLICY.md for file organization details
- Examine manifest.json for run details and reconciliation status