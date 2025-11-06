# Data Analysts — File Organization Policy

This policy keeps analytics runs tidy, reproducible, and easy to diff.

## Directories (outside .claude-work)

- Final artifacts (source of truth):
  - Path: `reports/analytics/<topic>/<YYYY-MM-DD>/run-<run_label>/final/`

- Intermediates (safe to delete):
  - Path: `reports/analytics/.tmp/<topic>/<YYYY-MM-DD>/run-<run_label>/`

- Optional published mirrors (stable by topic):
  - Path: `reports/analytics/<topic>/published/`

Do not write to project root or the original Dropbox source folders from these agents. Keep outputs under `reports/analytics/`.

## Run Parameters (standard for all data-analyst agents)

- `run_label` (string, default varies per agent): Slug that names the run directory (e.g., `bf-sales`, `ads-creative`).
- `keep_intermediates` (bool, default: false): If false, write only to `final/` and keep minimal logs; compute in-memory where feasible.
- `snapshot_inputs` (bool, default: false): If true, copy input CSVs to `final/inputs/` with checksums (large files discouraged; prefer manifest-only).
- `publish_to_topic` (bool, default: false): If true, copy select finals to `reports/analytics/<topic>/published/`.
- `output_root_override` (optional): If set, must be a subpath of either `reports/analytics/` or `$ANALYTICS_OUTPUT_ROOT` (env var). Otherwise ignore.

Agents should accept these parameters when provided in task prompts and echo them in the manifest.

## Layout (per run)

```
reports/
  analytics/
    <topic>/
      <YYYY-MM-DD>/
        run-<run_label>/
          final/
            <canonical CSVs + MD summaries>
            inputs/            # only if snapshot_inputs=true
            manifest.json      # always present
            run.log            # brief steps + warnings
            qc/                # optional: warnings, unmatched lists
      published/               # optional mirrors when publish_to_topic=true
    .tmp/
      <topic>/<YYYY-MM-DD>/run-<run_label>/
        *.tmp.csv
```

If you prefer Dropbox placement, set environment variable `ANALYTICS_OUTPUT_ROOT` to a safe directory (e.g., `~/Dropbox/MM x Adil Kalam/minisite/data/outputs`) and use `output_root_override` under that root.

## Filenames (canonical)

- Use snake-case descriptive names; no timestamps in filenames (timestamps live in directory path and manifest):
  - Examples: `bfcm_sales_yoy.csv`, `price_band_mix.csv`, `channel_mix.csv`, `ads_unit_econ.csv`, `product_lifecycle.csv`.
- For alternates/variants, add a short suffix: `*_by_collection.csv`, `*_detailed.csv`.
- Avoid dumping many “helper-*.csv” files; either keep them in TEMP or aggregate into `*_detailed.csv` in final.

## Manifest (manifest.json)

Minimal JSON schema (extend as needed):
```
{
  "version": "1",
  "topic": "<bfcm|...>",
  "run_label": "<run_label>",
  "started_at": "ISO-8601",
  "finished_at": "ISO-8601",
  "parameters": { ... },
  "inputs": [
    {"path": "<source path>", "rows": <int?>, "checksum": "<sha1?>"}
  ],
  "outputs": [
    {"path": "final/bfcm_sales_yoy.csv", "rows": <int?>, "cols": <int?>, "checksum": "<sha1?>"},
    {"path": "final/bfcm_sales_summary.md"}
  ],
  "notes": ["filters applied", "thresholds", "exclusions"],
  "reconciliation": {"rule": "±0.1%", "status": "ok|warn|fail"}
}
```

Checksums are optional but recommended for stable datasets. Row/column counts should be included when cheap to compute.

## Hygiene Rules

- Intermediates → `reports/analytics/.tmp/`; never in repo root.
- Final tables only after reconciliation passes; otherwise suffix with `-draft` and note in manifest.
- Summaries must cite source filenames and row counts.
- Do not duplicate large inputs; prefer manifest references unless `snapshot_inputs=true`.

## Idempotency & Versioning

- Re-running with the same `run_label` on the same day writes to the same folder; do not overwrite existing final files without suffixing `-v2` and recording it in `manifest.json`.
- Prefer deterministic computation; if randomness is used, record the seed in the manifest.
