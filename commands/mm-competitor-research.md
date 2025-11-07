---
description: "DEPRECATED — Use /mm-comps"
allowed-tools: [Read, Write, WebSearch, WebFetch, TodoWrite]
argument-hint: "Khaite, Toteme, The Row, Atlein, Bevza, Interior, Cecilie Bahnsen, Anna Quan"
---

# /mm-competitor-research — Marina Moscone Competitor Dossiers

Create structured competitor dossiers and a master synthesis. For now, focus on pricing ladders, editorial lookbooks, e‑comm visuals, and narrative timelines. Defer ad‑copy patterns until Phase II.

## Inputs
- Competitor list (comma‑separated). Defaults: Khaite, Toteme, The Row, Atlein, Bevza, Interior, Cecilie Bahnsen, Anna Quan

## Outputs (per competitor)
- `.orchestration/evidence/competitors/[brand]/prices.md` — category price ladder snapshots
- `.orchestration/evidence/competitors/[brand]/lookbook.md` — editorial aesthetic summary (reference screenshots)
- `.orchestration/evidence/competitors/[brand]/ecommerce-visuals.md` — PDP/listing visual conventions (reference screenshots)
- `.orchestration/evidence/competitors/[brand]/timeline.md` — story arc with dated milestones & inferred inflection points
- Master synthesis: `.orchestration/evidence/competitors/_summary.md` (positioning map, white‑space, implications)

## Data Collection
- WebSearch: official sites, press hits, “lookbook”, “about”, “campaign”, “timeline”
- WebFetch: PDP/listings for representative categories to capture price points & visuals
- Screenshots: `bash scripts/capture-screenshot.sh <url> --out .orchestration/evidence/competitors/[brand]/[slug].png --wait-for 20`
- (Optional later) Ad copy extraction from platforms — deferred in Phase I

## Steps
1) Normalize brand names; create evidence folders per competitor.
2) Collect 5–10 representative prices per key category; summarize ladder.
3) Capture editorial lookbook cues (pose, expression, composition, color, motion).
4) Capture e‑comm visual standards (PDP gallery styles, zoom/detail shots, model info conventions).
5) Build timeline: launch, first big stockist, signature item moments, awards, casting/creative shifts, collabs — with dates and sources.
6) Write per‑brand dossiers; then write the master synthesis with implications for MM.

## Evidence & Tags
- Save all outputs under `.orchestration/evidence/competitors/…`
- Append `#FILE_CREATED:` for each file in implementation log
- Add `#SCREENSHOT_CLAIMED:` lines for captured images

## Finish
- Present dossier paths & summary; suggest `bash scripts/finalize.sh`.
