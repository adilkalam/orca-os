# Styling Policy (Global CSS Only)

This repository prohibits Tailwind (all versions), daisyUI, and utility-class heavy HTML. All front-end work must use Global CSS with design tokens and clean semantic class names.

## Rules (Mandatory)

- Use Global CSS: `src/styles/globals.css` (or project-equivalent) for base, tokens, and components.
- No Tailwind/daisyUI: Do not add configs, imports, or utility classes.
- No inline styles: Never use `style={...}` except for dynamic CSS variables (e.g., `--progress`).
- Keep HTML clean: Minimal, semantic class names; avoid verbose per-element styling.
- Use CSS Variables: Define tokens in `:root` for colors, spacing, typography, radii, transitions.
- Theming: Prefer CSS variables and media queries; avoid framework-specific theming.
- Optional Modules: CSS Modules are allowed for local overrides, but Global CSS is the default.

## Architecture

- styles/globals.css: Reset/normalize, tokens, base elements, component classes, utilities.
- styles/tokens.css (optional): Split tokens if large.
- components: Components reference global classes (e.g., `button`, `button--primary`).

## Class Naming

- Prefer semantic, compact names: `button`, `button--primary`, `input`, `card`, `stack`.
- Use BEM-ish modifiers when helpful; avoid long utility chains.

## Implementation Guidance

- React/Vue: Use `className`/`class` with global classes. No Tailwind utilities.
- Dynamic values: Pass CSS variables inline only (e.g., `style={{ '--progress': percent + '%' }}`) and consume in CSS.
- Responsive: Use media queries and container queries in CSS, not per-element utility classes.

## Migration Notes

- When encountering Tailwind/utility markup, extract repeated patterns into global classes and replace utilities with semantic classes.
- Remove Tailwind config, PostCSS plugins, and imports if present.

## Enforcement

- Code reviews should reject Tailwind/utility classes and inline styles.
- Agents generating UI must produce clean HTML + Global CSS, not Tailwind.

