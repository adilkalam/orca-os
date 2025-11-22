# ASCII Mockups (Fluxwing‑style)

Purpose: Fast, legible ASCII wireframes you can iterate on before implementation.

Command: `/ascii-mockup "<screen or component>"`

Rules (project‑specific)
- Grid: 4‑space grid
- Box widths: 20, 30, 40, 60 only
- Characters: ┌ ┐ └ ┘ ─ │ ┬ ┴ ├ ┤ ┼ ▼ (and ASCII text)
- Mathematical centering; avoid ragged alignments
- Keep to 60‑char width for main container unless you request otherwise

Tips
- Start with 2–3 variations (A/B/C); pick one, refine
- Label regions inline in brackets [LIKE THIS]
- For flows, output multiple screens as a storyboard

Hand‑off
- Web: map spacing to 4px multiples; tokens/classes; run Design Guard
- SwiftUI: use `Spacing.*`, `Typography.*`, and color tokens from `DesignTokens.swift`

Examples
- `/ascii-mockup "Protocol Detail Page (3 columns, comfortable)"`
- `/ascii-mockup "Bento Card variant for pricing"`

