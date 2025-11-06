# Data Analyst Team

## Overview
Specialized agents for Black Friday/Cyber Monday (BFCM) analytics. This team processes sales, advertising, and merchandising data to produce decision-ready insights.

## Team Composition

| Agent | Purpose | Auto-Activates On |
|-------|---------|------------------|
| `bf-sales-analyst` | YoY sales analysis, price/channel mix | "bfcm", "black friday", "yoy", "price band" |
| `ads-creative-analyst` | Meta ads performance, ROAS, creative scoring | "meta ads", "facebook", "roas", "creative" |
| `merch-lifecycle-analyst` | Product lifecycle, pricing opportunities | "lifecycle", "discount", "missed opportunity" |
| `story-synthesizer` | Executive narrative synthesis | "story", "narrative", "exec summary" |

## Quick Start

### 1. Set Output Location (Optional)
```bash
# Use Dropbox location
source scripts/analytics/set-output-root.sh

# Or use default (reports/analytics/ in project)
```

### 2. Prepare Your Data

Required files:
- `sales/sales_fact.csv` - Transaction data
- `sales/product_dim.csv` - Product catalog
- `bfcm/*reconstructed.csv` - Meta ads exports

### 3. Run Analysis

#### Option A: Auto-Activation via Keywords
```
"Analyze black friday sales performance yoy"
→ Triggers bf-sales-analyst

"Review Meta ads creative performance during BFCM"
→ Triggers ads-creative-analyst
```

#### Option B: Direct Invocation (when supported)
```
Run bf-sales-analyst with run_label="nov-analysis"
```

## File Organization

```
reports/
  analytics/
    bfcm/
      YYYY-MM-DD/
        run-<label>/
          final/
            *.csv         # Analysis outputs
            *.md          # Summaries
            manifest.json # Audit trail
```

## Parameters

All agents accept:
- `run_label` - Run identifier
- `keep_intermediates` - Keep temp files (default: false)
- `snapshot_inputs` - Copy inputs (default: false)
- `publish_to_topic` - Copy to published/ (default: false)

## Key Features

### BF Sales Analyst
- Event window analysis (pre/event/post)
- YoY comparisons
- Price-band distribution
- Channel mix analysis
- Elasticity calculations

### Ads Creative Analyst
- CTR/CPC/CPM/CPA/ROAS metrics
- Creative ranking
- Spend threshold analysis
- KEEP/ITERATE/RETIRE guidance

### Merch Lifecycle Analyst
- Volume vs discount tracking
- Under/over-discounting detection
- Channel performance by window
- Pricing opportunity flags

### Story Synthesizer
- Executive summary (5-7 bullets)
- What/Why/Next Actions structure
- Cross-source citations
- Decision-ready recommendations

## Quality Guarantees

✅ **Reconciliation** - Totals match source ±0.1%
✅ **Sample sizes** - N counts for all claims
✅ **Thresholds** - All filters documented
✅ **Citations** - Every claim linked to data
✅ **Audit trail** - Complete manifest.json

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Agents not activating | Use specific keywords or check data paths |
| Missing columns | Verify CSV has required columns |
| Output location unclear | Check `ANALYTICS_OUTPUT_ROOT` env var |

## Related Documentation

- [FILE_ORG_POLICY.md](FILE_ORG_POLICY.md) - Detailed file organization rules
- [DATA_ANALYST_TEAM_GUIDE.md](/docs/DATA_ANALYST_TEAM_GUIDE.md) - Complete usage guide
- [QUICK_REFERENCE.md](/QUICK_REFERENCE.md) - System-wide quick reference

## Status

✅ **Configured** - Agents created with proper structure
✅ **Documented** - Usage guides and policies in place
⚠️ **Task Tool Integration** - Not yet in Task tool registry (use auto-activation)
✅ **Auto-Activation** - Keywords trigger agents automatically