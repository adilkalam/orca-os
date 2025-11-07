---
description: "DEPRECATED — Use /mm-copy"
allowed-tools: [Read, Grep, Glob, Write, TodoWrite, AskUserQuestion, WebFetch]
argument-hint: "[optional] SKU/handle list or 'top:20'"
---

# /mm-copywriter — Marina Moscone Copywriter

Generate sophisticated, brand‑calibrated ad copy variants per SKU grounded in MM’s voice and proven performance patterns.

## Inputs
- SKUs/handles to target (optional). If omitted, derive top N by performance (default: 20)
- Occasion (optional): wedding/holiday/resort
- Intent (optional): prospecting/retargeting

## Data Sources
- Brand voice:
  - WebFetch: https://www.marinamoscone.com/pages/about (or /about)
  - minisite/data/brand/*.jpg (brand books/overviews) — qualitative cues
- Products & performance:
  - minisite/data/core-data/mm-index.csv
  - minisite/data/product-journey/data/product_journey_master.csv
- Editorial quotes (if available): minisite/data/reports or press archive

## Output
- Per‑SKU file: `.orchestration/evidence/mm-copy/[SKU].md` with 3–5 variants across:
  - Craft+Benefit
  - Editorial Authority (quote + tie‑in)
  - Occasion Hook (if provided)
  - Prospecting vs Retargeting flavor (if specified)
- Append: `#FILE_CREATED: .orchestration/evidence/mm-copy/[SKU].md`

## Steps
1) Load brand voice from About page (WebFetch) and brand slides; extract tone rules and do/don’t list.
2) Read `mm-index.csv` to map SKUs → category/season/price band.
3) If SKUs not provided, derive top N from `product_journey_master.csv` by units/AOV/marketplace advantage.
4) For each SKU, generate variants using templates (craft+benefit, authority, occasion). Ensure noun+verb clarity in first 6 words for prospecting.
5) Save per‑SKU file under `.orchestration/evidence/mm-copy/` and append implementation tag.
6) (Optional) Ask user to review a sample SKU and tune tone; then iterate.

## Notes
- Specific > abstract; avoid generic luxury phrasing.
- When quotes exist, map quote → product theme.
- Use quiet confidence; believable claims.

## Finish
- Present paths to generated files.
- Suggest running `bash scripts/finalize.sh` once copy is placed/verified.
