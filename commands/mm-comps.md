---
description: "MM Comps — build competitor dossiers (prices, lookbooks, e‑comm visuals, press search & collection reviews, story arcs). Ad copy deferred for later."
allowed-tools: [Read, Write, WebSearch, WebFetch, TodoWrite]
argument-hint: "Khaite, Toteme, The Row, Atlein, Bevza, Interior, Cecilie Bahnsen, Anna Quan"
---

# /mm-comps — Marina Moscone Competitor Dossiers

Create structured competitor dossiers and a master synthesis. For now, focus on pricing ladders, editorial lookbooks, e‑comm visuals, and narrative timelines. Defer ad‑copy patterns until Phase II.

## Inputs
- Competitor list (comma‑separated). Defaults: Khaite, Toteme, The Row, Atlein, Bevza, Interior, Cecilie Bahnsen, Anna Quan

## Outputs (per competitor)
- `.orchestration/evidence/competitors/[brand]/prices.md` — category price ladder snapshots
- `.orchestration/evidence/competitors/[brand]/lookbook.md` — editorial aesthetic summary (reference screenshots)
- `.orchestration/evidence/competitors/[brand]/ecommerce-visuals.md` — PDP/listing visual conventions (reference screenshots)
- `.orchestration/evidence/competitors/[brand]/press.md` — press & collection reviews (Vogue Runway, WWD, BoF): key quotes, dates, themes
- `.orchestration/evidence/competitors/[brand]/timeline.md` — story arc with dated milestones & inferred inflection points
- Master synthesis: `.orchestration/evidence/competitors/_summary.md` (positioning map, white‑space, implications)

## Data Collection
- WebSearch:
  - Official sites: “about”, “lookbook”, “campaign”, “timeline”
  - Press & reviews: site:vogue.com/runway <brand>, site:wwd.com <brand> review, site:businessoffashion.com <brand>
  - Additional: “collection review”, “show review”, “interview”, “profile”
- WebFetch: PDP/listings for representative categories to capture price points & visuals; fetch review pages for quotes/dates
- Screenshots: `bash scripts/capture-screenshot.sh <url> --out .orchestration/evidence/competitors/[brand]/[slug].png --wait-for 20`
- (Optional later) Ad copy extraction from platforms — deferred in Phase I

## Steps
1) Normalize brand names; create evidence folders per competitor.
2) Collect 5–10 representative prices per key category; summarize ladder.
3) Capture editorial lookbook cues (pose, expression, composition, color, motion).
4) Capture e‑comm visual standards (PDP gallery styles, zoom/detail shots, model info conventions).
5) Aggregate press & collection reviews; extract 3–5 key quotes with dates and themes; save to press.md.
6) Build timeline using press/reviews + site milestones: launch, first big stockist, signature item moments, awards, casting/creative shifts, collabs — with dates and sources.
7) Write per‑brand dossiers; then write the master synthesis with implications for MM.

## Evidence & Tags
- Save all outputs under `.orchestration/evidence/competitors/…`
- Append `#FILE_CREATED:` for each file in implementation log
- Add `#SCREENSHOT_CLAIMED:` lines for captured images

## Finish
- Present dossier paths & summary; suggest `bash scripts/finalize.sh`.
