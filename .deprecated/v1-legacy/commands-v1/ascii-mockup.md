---
description: Generate Fluxwing‑style ASCII mockups on a strict 4‑space grid with fixed box widths and allowed characters
allowed-tools: [Read, Glob, AskUserQuestion, exit_plan_mode]
argument-hint: <screen/component to mock>
---

# /ascii-mockup — Fluxwing‑style ASCII Wireframes

Purpose: Produce fast, legible ASCII wireframes (like Fluxwing/uxscii) that we can iterate on conversationally before building UI.

Use when:
- You want a quick visual wireframe without opening a design tool
- You’re exploring layout/IA options for a page or component
- You want multiple variations to compare (A/B/C)

Input
- Target: $ARGUMENTS (e.g., “Bento Card”, “Protocol Detail Page”, “Onboarding Stepper”)
- If missing details, ask: web vs mobile, viewport width, column count, density (compact/comfortable), and key content blocks.

Hard Rules (Project‑specific)
- Grid: 4‑space grid
- Box widths: 20, 30, 40, 60 only
- Characters: ┌ ┐ └ ┘ ─ │ ┬ ┴ ├ ┤ ┼ ▼ (and ASCII text)
- Mathematical centering; avoid ragged alignments
- Keep to 60‑char width for main container unless user requests narrower

Output Format
- Wrap each mockup in a single fenced block
- No extra prose inside code fences; narrate above/below
- Title each variation clearly (Variation A/B/C)
- Label key regions inline in brackets [LIKE THIS]

Example (single variation)
```
VARIATION A — Bento Card (60w)

┌──────────────────────────────────────────────────────────────┐
│ [HEADER] Logo            Search [__]        Actions [⋯]      │
├──────────────────────────────────────────────────────────────┤
│ [HERO]  [Illustration]   Headline                                │
│         Short subcopy                                                │
├──────────────────────────────────────────────────────────────┤
│ [BENTO GRID]                                                ▼ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────┐ │
│ │ [CARD]       │ │ [CARD]       │ │ [CARD]       │ │ [CTA]  │ │
│ │ title        │ │ title        │ │ title        │ │        │ │
│ │ body…        │ │ body…        │ │ body…        │ │        │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ └────────┘ │
├──────────────────────────────────────────────────────────────┤
│ [FOOTER] Links · Legal · Social                               │
└──────────────────────────────────────────────────────────────┘
```

Flow
1) Clarify constraints (viewport, columns, density, must‑include blocks)
2) Produce 1–3 variations (A/B/C) using the rules above
3) Ask user which variation to refine; then iterate
4) When approved, hand off to /concept or implementation

Multiple Screens (optional)
- If user asks for a flow, output a storyboard (Screen 1/2/3) with consistent headers/footers and focused content changes.

Hand‑off Notes
- If building in SwiftUI, map spacing to `Spacing.*` and typography via `Typography.*`
- If building in web, map to tokens/classes and verify with Design Guard

Prompt Skeleton (internal)
```
Create an ASCII wireframe for: "$ARGUMENTS"
Rules: 4‑space grid; widths: 20/30/40/60; chars: ┌ ┐ └ ┘ ─ │ ┬ ┴ ├ ┤ ┼ ▼; center mathematically.
Ask for viewport/columns/density if unclear. Output 1–3 variations in fenced blocks.
```

