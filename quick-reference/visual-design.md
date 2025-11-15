# Visual Design Spec — Quick Reference

Use this template to define clear, testable acceptance criteria for visual work. It pairs with the visual commands and agents (Playwright MCP) so the system can iterate, verify, and gate changes with evidence.

Related commands:
- `/visual-smoke` — quick screenshots + console capture
- `/visual-iterate` — spec-driven iteration loop
- `/design-review` — full design review (screenshots + structured findings)

Evidence locations:
- Screenshots: `.orchestration/evidence/screenshots/`
- Console logs: `.orchestration/evidence/logs/`
- Iteration logs: `.orchestration/evidence/iterations/`

---

## Example Spec (Fill-In Template)

### Scope
- URL(s):
  - http://localhost:3000/
  - http://localhost:3000/dashboard
- Views/components:
  - Header, Sidebar, KPI tiles, Charts (line + bar), CTA button
- Out of scope:
  - Authentication flows, settings panel

### Acceptance Criteria
- Hierarchy: H1 > H2 > body; CTA is primary focal element above the fold
- Spacing: 4/8/16/24/32 scale; no arbitrary pixel values
- Typography: Major Third scale; line length ~45–75ch for body
- Contrast: ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI components
- Responsiveness: No horizontal scrolling at 1440×900, 768×1024, 375×812
- States: Hover, focus, active, and disabled visible and consistent
- Errors/empty/loading: present and visually distinct

### Tokens
- Colors (OKLCH or HEX):
  - Primary: oklch(0.65 0.17 260)
  - Text: oklch(0.25 0 0)
  - Surface: #FFFFFF
- Spacing scale: 4, 8, 12, 16, 24, 32, 48
- Type scale: 1.25 (Major Third)

### References
- Target screenshots / mocks:
  - `docs/design/mocks/home-desktop.png`
  - `docs/design/mocks/home-mobile.png`
- Brand/style guide:
  - `docs/design/style-guide.md`
- Known constraints:
  - Chart library has fixed legend width (200px)

---

## How To Use With Commands

1) Quick check
```
/visual-smoke http://localhost:3000 label=home
```
Produces desktop/tablet/mobile screenshots + console log under `.orchestration/evidence/…`.

2) Iterative polish (spec-driven)
```
/visual-iterate url=http://localhost:3000 spec_path=docs/design/home-spec.md max_iterations=5 label=home
```
Loop: navigate → screenshots → compare to spec → minimal edits → log → repeat.

3) Final gate
```
/design-review http://localhost:3000
```
Generates screenshots and a structured findings summary.

---

## Tips
- Keep specs small and explicit; ambiguity stalls iteration.
- Save “golden” target screenshots and link them for side‑by‑side comparison.
- Prefer tokens and global classes over ad‑hoc styles; it makes iteration safer.
- When blocked by auth/data, stub deterministic content and note it in iteration logs.

